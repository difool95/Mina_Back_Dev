import type Stripe from 'stripe'

import { env } from '../config/env.js'
import { MATCHA_PACKS } from '../lib/constants.js'
import type { CreateCheckoutSessionResult, Currency } from '../types/checkout.types.js'
import { addPurchasedCredits } from './credits.service.js'
import { stripe } from './stripe.client.js'

// The same no-key, CORS-open rate source the frontend prices its display
// with — fetched again here rather than trusted from the client, since it
// feeds directly into what Stripe charges the card.
const RATES_URL = 'https://open.er-api.com/v6/latest/GBP'

async function rateFromGbp(currency: Currency): Promise<number> {
  if (currency === 'GBP') return 1

  const response = await fetch(RATES_URL)
  if (!response.ok) throw new Error(`Could not read exchange rates (${response.status})`)

  const { rates } = (await response.json()) as { rates?: Partial<Record<Currency, number>> }
  const rate = rates?.[currency]
  if (!rate) throw new Error(`No exchange rate for ${currency}`)

  return rate
}

/**
 * Starts a Stripe-hosted checkout for one matcha pack. The price is looked up
 * server-side from `MATCHA_PACKS` — never trust a client-supplied amount for
 * something that charges a card — and converted to the client's own currency
 * from a rate this fetches itself, for the same reason.
 */
export async function createCheckoutSession(
  userId: string,
  matchas: number,
  currency: Currency,
): Promise<CreateCheckoutSessionResult> {
  const pack = MATCHA_PACKS.find((candidate) => candidate.matchas === matchas)
  if (!pack) throw new Error(`Unknown matcha pack: ${matchas}`)

  const rate = await rateFromGbp(currency)

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
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
    metadata: { passId: `pass:user:${userId}`, matchas: String(matchas) },
    success_url: `${env.CORS_ORIGIN}/profile?purchase=success`,
    cancel_url: `${env.CORS_ORIGIN}/profile?purchase=cancelled`,
  })

  if (!session.url) throw new Error('Stripe did not return a checkout URL')

  return { url: session.url }
}

/**
 * Verifies a webhook delivery came from Stripe and, once a checkout has
 * actually been paid, credits the matchas it was for.
 */
export async function fulfillWebhookEvent(rawBody: Buffer, signature: string): Promise<void> {
  const event = stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET)

  if (event.type !== 'checkout.session.completed') return

  const session = event.data.object as Stripe.Checkout.Session
  const passId = session.metadata?.passId
  const matchas = Number(session.metadata?.matchas)

  if (!passId || !matchas) {
    throw new Error(`Checkout session ${session.id} is missing pass/matchas metadata`)
  }

  await addPurchasedCredits(passId, matchas, session.id)
}
