import type Stripe from 'stripe'

import { env } from '../config/env.js'
import { MATCHA_PACKS } from '../lib/constants.js'
import type { CreateCheckoutSessionResult, Currency } from '../types/checkout.types.js'
import { addAutoRefillCredits, addPurchasedCredits } from './credits.service.js'
import { getStripeCustomerId, saveStripeCard } from './customers.service.js'
import { stripe } from './stripe.client.js'


const RATES_URL = 'https://open.er-api.com/v6/latest/GBP'

//THIS METHOD CALCULATES THE RATE OF THE GIVEN CURRENCY FROM GBP, IF THE CURRENCY IS GBP IT RETURNS 1
export async function rateFromGbp(currency: Currency): Promise<number> {
  if (currency === 'GBP') return 1

  const response = await fetch(RATES_URL)
  if (!response.ok) throw new Error(`Could not read exchange rates (${response.status})`)

  const { rates } = (await response.json()) as { rates?: Partial<Record<Currency, number>> }
  const rate = rates?.[currency]
  if (!rate) throw new Error(`No exchange rate for ${currency}`)

  return rate
}

//THIS METHOD CREATES A CHECKOUT SESSION FOR THE GIVEN USER, MATCHAS AND CURRENCY, IT RETURNS THE CHECKOUT URL AND CREATE AN INVOICE FOR THE PURCHASED CREDITS,
//IT ALSO SAVES THE STRIPE CUSTOMER ID AND PAYMENT METHOD ID TO THE CUSTOMER FOR FUTURE AUTO REFILL PAYMENTS
export async function createCheckoutSession(
  userId: string,
  matchas: number,
  currency: Currency,
): Promise<CreateCheckoutSessionResult> {
  const pack = MATCHA_PACKS.find((candidate) => candidate.matchas === matchas)
  if (!pack) throw new Error(`Unknown matcha pack: ${matchas}`)

  const rate = await rateFromGbp(currency)
  const passId = `pass:user:${userId}`
  const existingCustomerId = await getStripeCustomerId(passId)

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    ...(existingCustomerId ? { customer: existingCustomerId } : { customer_creation: 'always' }),
    payment_method_types: ['card'],
    payment_intent_data: { setup_future_usage: 'off_session' },
    invoice_creation: { enabled: true },
    line_items: [
      {
        quantity: 1,
        price_data: {
          // Stripe wants its three-letter code lowercase.
          currency: currency.toLowerCase(),
          unit_amount: Math.round(pack.gbp * rate * 100),
          product_data: { name: `${matchas} Matcha` },
        },
      },
    ],
    // The webhook is the only thing that reads these back — it has no other
    // way to know which customer or how many matchas a session paid for.
    metadata: { passId, matchas: String(matchas) },
    success_url: `${env.CORS_ORIGIN}/profile?purchase=success`,
    cancel_url: `${env.CORS_ORIGIN}/profile?purchase=cancelled`,
  })

  if (!session.url) throw new Error('Stripe did not return a checkout URL')

  return { url: session.url }
}


// THIS METHOD CHARGES THE CUSTOMER FOR THE AUTO REFILL PAYMENT, IT CREATES AN INVOICE AND INVOICE ITEM FOR THE AUTO REFILL
//  PAYMENT AND PAYS THE INVOICE OFF_SESSION
export async function chargeAutoRefill(params: {
  passId: string
  customerId: string
  paymentMethodId: string
  matchas: number
  amountMinor: number
  currency: string
}): Promise<void> {
  console.log("Charging auto-refill for", params.passId, ":", params.amountMinor, params.currency, "for", params.matchas, "matchas")
  // Charged through an invoice rather than a bare PaymentIntent so the refill
  // shows up in the customer's billing portal. Paying a draft finalizes it.
  const invoice = await stripe.invoices.create({
    customer: params.customerId,
    currency: params.currency,
    auto_advance: false,
    metadata: { type: 'auto_refill', passId: params.passId, matchas: String(params.matchas) },
  })

  await stripe.invoiceItems.create({
    customer: params.customerId,
    invoice: invoice.id,
    amount: params.amountMinor,
    currency: params.currency,
    description: `${params.matchas} Matcha`,
  })

  await stripe.invoices.pay(invoice.id, { payment_method: params.paymentMethodId, off_session: true })
}

/** A link to Stripe's billing portal, where the signed-in user sees their invoices. */
export async function createBillingPortalSession(userId: string): Promise<CreateCheckoutSessionResult> {
  const customerId = await getStripeCustomerId(`pass:user:${userId}`)
  if (!customerId) throw new Error('This account has no Stripe customer yet')

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${env.CORS_ORIGIN}/profile`,
  })

  return { url: session.url }
}

// THIS METHOD IS THE ENTRY POINT FOR THE STRIPE WEBHOOK, IT HANDLES THE CHECKOUT SESSION COMPLETED AND INVOICE PAID EVENTS
export async function fulfillWebhookEvent(rawBody: Buffer, signature: string): Promise<void> {
  const event = stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET)

  //THIS EVENT TYPE IS FIRED WHEN A CHECKOUT SESSION IS COMPLETED, IT ADDS THE PURCHASED CREDITS TO THE CUSTOMER AND SAVES THE CARD FOR FUTURE AUTO REFILL PAYMENTS
  //THIS IS ONLY CALLED WHEN FOR ONLY PURCHASED CREDITS, THE INVOICE PAID EVENT HANDLES THE AUTO REFILL PAYMENTS
  if (event.type === 'checkout.session.completed') {
    await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
    return
  }

  // THIS EVENT TYPE IS FIRED WHEN AN INVOICE IS PAID, IT HANDLES THE AUTO REFILL PAYMENTS AND ADDS THE AUTO REFILL CREDITS TO THE CUSTOMER
  // Checkout's own invoices fire this too; only auto-refill invoices carry the metadata.
  if (event.type === 'invoice.paid') {
    const invoice = event.data.object as Stripe.Invoice
    if (invoice.metadata?.type === 'auto_refill') {
      await handleAutoRefillInvoicePaid(invoice)
    }
  }
}


//THIS METHOD HANDLES THE CHECKOUT SESSION COMPLETED EVENT, IT ADDS THE PURCHASED CREDITS TO THE CUSTOMER AND SAVES THE CARD FOR FUTURE AUTO REFILL PAYMENTS
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const passId = session.metadata?.passId
  const matchas = Number(session.metadata?.matchas)

  if (!passId || !matchas) {
    throw new Error(`Checkout session ${session.id} is missing pass/matchas metadata`)
  }

  await addPurchasedCredits(passId, matchas, session.id)

//THIS METHOD SAVES THE CARD USED IN THE CHECKOUT SESSION FOR FUTURE AUTO REFILL PAYMENTS, IT RESOLVES THE PAYMENT METHOD ID 
// FROM THE CHECKOUT SESSION AND SAVES IT TO THE CUSTOMER
  const paymentMethodId = await resolvePaymentMethodId(session)
  const customerId = typeof session.customer === 'string' ? session.customer : (session.customer?.id ?? null)

  //WE SAVE THE STRIPE CUSTOMER ID AND PAYMENT METHOD ID TO THE CUSTOMER, SO THAT WE CAN USE IT FOR FUTURE AUTO REFILL PAYMENTS
  if (customerId && paymentMethodId) await saveStripeCard(passId, customerId, paymentMethodId)
}

//THIS METHOD RESOLVES THE PAYMENT METHOD ID FROM THE CHECKOUT SESSION, IT RETURNS NULL IF THE PAYMENT METHOD ID CANNOT BE RESOLVED
async function resolvePaymentMethodId(session: Stripe.Checkout.Session): Promise<string | null> {
  if (!session.payment_intent) return null

  const id = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent.id
  const paymentIntent = await stripe.paymentIntents.retrieve(id)

  return typeof paymentIntent.payment_method === 'string'
    ? paymentIntent.payment_method
    : (paymentIntent.payment_method?.id ?? null)
}


//THIS METHOD HANDLES THE INVOICE PAID EVENT FOR AUTO REFILL PAYMENTS, IT ADDS THE AUTO REFILL CREDITS TO THE CUSTOMER
async function handleAutoRefillInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
  const passId = invoice.metadata?.passId
  const matchas = Number(invoice.metadata?.matchas)

  if (!passId || !matchas) {
    throw new Error(`Auto-refill invoice ${invoice.id} is missing passId/matchas metadata`)
  }

  await addAutoRefillCredits(passId, matchas, invoice.id)
}
