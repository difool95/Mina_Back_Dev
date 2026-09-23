import { randomUUID } from 'node:crypto'

import { LOT_LIFETIME_MONTHS, SIGNUP_BONUS } from '../lib/constants.js'
import { addMonths } from '../lib/date.js'
import type { MmaPreferences } from '../types/customer.types.js'
import type {
  CreditLot,
  CreditTransactionMeta,
  ExpirySweepResult,
  PurchaseFulfillmentResult,
  SignupBonusResult,
} from '../types/credit.types.js'
import { supabase } from './supabase.client.js'

interface LedgerEntry {
  passId: string
  delta: number
  reason: string
  refType: string
  refId: string
  meta: CreditTransactionMeta
  at: string
  /** Who triggered the transaction. Everything but a paid checkout is the platform itself. */
  source?: string
}

/**
 * Appends one `credit_transaction` row to `mega_generations`.
 *
 * Columns the platform leaves blank for this record type are omitted rather
 * than sent as null, so each keeps whatever default the table defines.
 */
export async function recordTransaction(entry: LedgerEntry) {
  const { error } = await supabase.from('mega_generations').insert({
    mg_id: `credit_transaction:${randomUUID()}`,
    mg_record_type: 'credit_transaction',
    mg_pass_id: entry.passId,
    mg_status: 'succeeded',
    mg_meta: entry.meta,
    mg_event_at: entry.at,
    mg_created_at: entry.at,
    mg_updated_at: entry.at,
    mg_delta: entry.delta,
    mg_reason: entry.reason,
    mg_source: entry.source ?? 'system',
    mg_ref_type: entry.refType,
    mg_ref_id: entry.refId,
  })

  if (error) throw new Error(error.message)
}

/**
 * Gives a first-time user their free matchas, once and only once.
 *
 * The ledger in `mega_generations` is the sole record of who has already been
 * paid — there is no flag on the customer row — so a returning user finds
 * their own `free_signup` transaction here and nothing further happens.
 */
export async function grantSignupBonus(userId: string): Promise<SignupBonusResult> {
  const passId = `pass:user:${userId}`

  const { data: customer, error: customerError } = await supabase
    .from('mega_customers')
    .select('mg_credits')
    .eq('mg_pass_id', passId)
    .maybeSingle()

  if (customerError) throw new Error(customerError.message)
  if (!customer) throw new Error(`No mega_customers row for ${passId}`)

  const { data: alreadyPaid, error: ledgerError } = await supabase
    .from('mega_generations')
    .select('mg_id')
    .eq('mg_pass_id', passId)
    .eq('mg_record_type', 'credit_transaction')
    .eq('mg_reason', 'free_signup')
    .limit(1)
    .maybeSingle()

  if (ledgerError) throw new Error(ledgerError.message)

  const creditsBefore = Number(customer.mg_credits ?? 0)

  if (alreadyPaid) return { granted: false, credits: creditsBefore }

  const at = new Date().toISOString()
  const expiresAt = addMonths(at, LOT_LIFETIME_MONTHS)
  const creditsAfter = creditsBefore + SIGNUP_BONUS

  await recordTransaction({
    passId,
    delta: SIGNUP_BONUS,
    reason: 'free_signup',
    refType: 'free_signup',
    refId: passId,
    meta: { expires_at: expiresAt, credits_after: creditsAfter, credits_before: creditsBefore },
    at,
  })

  const lot: CreditLot = {
    amount: SIGNUP_BONUS,
    ref_id: passId,
    ref_type: 'free_signup',
    created_at: at,
    expires_at: expiresAt,
  }

  const { error } = await supabase
    .from('mega_customers')
    .update({
      mg_credits: creditsAfter,
      mg_expires_at: expiresAt,
      mg_credit_lots: [lot],
      mg_updated_at: at,
    })
    .eq('mg_pass_id', passId)

  if (error) throw new Error(error.message)

  return { granted: true, credits: creditsAfter }
}

interface CreditFulfillmentParams {
  passId: string
  matchas: number
  /** The Stripe id this fulfillment is keyed on — a checkout session id or an invoice id. */
  refId: string
  refType: string
  reason: string
  /** The Stripe event type that triggered this, recorded in the webhook_event row's meta. */
  eventType: string
  /** What the webhook_event row's `mg_meta` calls `refId` — a purchase's is a session, an auto-refill's an invoice. */
  refIdMetaKey: string
}

interface CreditFulfillmentOutcome {
  applied: boolean
  creditsBefore: number
  creditsAfter: number
  nextExpiresAt: string
  lots: CreditLot[]
  at: string
  mmaPreferences: MmaPreferences | null
}

// THIS METHOD HANDLES THE CREDIT FULFILLMENT FOR BOTH PURCHASED CREDITS AND AUTO REFILL CREDITS, 
// IT CHECKS IF THE CREDITS HAVE ALREADY BEEN APPLIED AND IF NOT, 
// IT APPLIES THEM AND RECORDS THE TRANSACTION IN THE LEDGER
async function applyCreditFulfillment(params: CreditFulfillmentParams): Promise<CreditFulfillmentOutcome> {
  const { data: customer, error: customerError } = await supabase
    .from('mega_customers')
    .select('mg_email, mg_credits, mg_credit_lots, mg_expires_at, mg_mma_preferences')
    .eq('mg_pass_id', params.passId)
    .maybeSingle()

  if (customerError) throw new Error(customerError.message)
  if (!customer) throw new Error(`No mega_customers row for ${params.passId}`)

  const { data: alreadyFulfilled, error: ledgerError } = await supabase
    .from('mega_generations')
    .select('mg_id')
    .eq('mg_record_type', 'credit_transaction')
    .eq('mg_ref_type', params.refType)
    .eq('mg_ref_id', params.refId)
    .limit(1)
    .maybeSingle()

  if (ledgerError) throw new Error(ledgerError.message)

  const creditsBefore = Number(customer.mg_credits ?? 0)
  const existingLots = Array.isArray(customer.mg_credit_lots) ? (customer.mg_credit_lots as CreditLot[]) : []
  const nextExpiresAtIfUnfulfilled = customer.mg_expires_at ?? ''

  if (alreadyFulfilled) {
    return {
      applied: false,
      creditsBefore,
      creditsAfter: creditsBefore,
      nextExpiresAt: nextExpiresAtIfUnfulfilled,
      lots: existingLots,
      at: '',
      mmaPreferences: (customer.mg_mma_preferences as MmaPreferences | null) ?? null,
    }
  }

  const at = new Date().toISOString()
  const expiresAt = addMonths(at, LOT_LIFETIME_MONTHS)
  const creditsAfter = creditsBefore + params.matchas

  await recordTransaction({
    passId: params.passId,
    delta: params.matchas,
    reason: params.reason,
    refType: params.refType,
    refId: params.refId,
    source: 'stripe',
    meta: { expires_at: expiresAt, credits_after: creditsAfter, credits_before: creditsBefore },
    at,
  })

  // Stripe's delivery carries no id of its own worth keying on, so this is
  // what the webhook_event row uses as both its mg_id and its mg_meta.request_id.
  const requestId = `stripe_${Date.now()}_${randomUUID()}`
  const webhookAt = new Date(new Date(at).getTime() + 500).toISOString()

  const { error: webhookError } = await supabase.from('mega_generations').insert({
    mg_id: `webhook_event:${requestId}`,
    mg_record_type: 'webhook_event',
    mg_pass_id: params.passId,
    mg_status: 'succeeded',
    mg_meta: {
      email: customer.mg_email,
      balance: creditsAfter,
      credited: params.matchas,
      event_type: params.eventType,
      request_id: requestId,
      [params.refIdMetaKey]: params.refId,
    },
    mg_event_at: webhookAt,
    mg_created_at: webhookAt,
    mg_updated_at: webhookAt,
    mg_source: 'stripe',
    mg_ref_type: params.refType,
    mg_ref_id: params.refId,
  })

  if (webhookError) throw new Error(webhookError.message)

  const lot: CreditLot = {
    amount: params.matchas,
    ref_id: params.refId,
    ref_type: params.refType,
    created_at: at,
    expires_at: expiresAt,
  }

  const nextExpiresAt =
    customer.mg_expires_at && customer.mg_expires_at > expiresAt ? customer.mg_expires_at : expiresAt

  return {
    applied: true,
    creditsBefore,
    creditsAfter,
    nextExpiresAt,
    lots: [...existingLots, lot],
    at,
    mmaPreferences: (customer.mg_mma_preferences as MmaPreferences | null) ?? null,
  }
}

//THIS METHOD HANDLES THE CREDIT FULFILLMENT FOR PURCHASED CREDITS, IT CHECKS IF THE CREDITS HAVE ALREADY BEEN APPLIED AND IF NOT,
// IT APPLIES THEM AND RECORDS THE TRANSACTION IN THE LEDGER
export async function addPurchasedCredits(
  passId: string,
  matchas: number,
  sessionId: string,
): Promise<PurchaseFulfillmentResult> {
  const outcome = await applyCreditFulfillment({
    passId,
    matchas,
    refId: sessionId,
    refType: 'stripe_checkout',
    reason: 'stripe-checkout',
    eventType: 'checkout.session.completed',
    refIdMetaKey: 'session_id',
  })

  if (!outcome.applied) return { credited: false, credits: outcome.creditsBefore }

  // The `mega_customers` update is the last step of fulfillment, so it can
  const { error } = await supabase
    .from('mega_customers')
    .update({
      mg_credits: outcome.creditsAfter,
      mg_expires_at: outcome.nextExpiresAt,
      mg_credit_lots: outcome.lots,
      mg_updated_at: outcome.at,
    })
    .eq('mg_pass_id', passId)

  if (error) throw new Error(error.message)

  return { credited: true, credits: outcome.creditsAfter }
}

//THIS METHOD HANDLES THE CREDIT FULFILLMENT FOR AUTO REFILL CREDITS, IT CHECKS IF THE CREDITS HAVE ALREADY BEEN APPLIED AND IF NOT,
// IT APPLIES THEM AND RECORDS THE TRANSACTION IN THE LEDGER
export async function addAutoRefillCredits(
  passId: string,
  matchas: number,
  invoiceId: string,
): Promise<PurchaseFulfillmentResult> {
  const outcome = await applyCreditFulfillment({
    passId,
    matchas,
    refId: invoiceId,
    refType: 'stripe_auto_refill',
    reason: 'stripe-auto-refill',
    eventType: 'invoice.paid',
    refIdMetaKey: 'invoice_id',
  })

  if (!outcome.applied) return { credited: false, credits: outcome.creditsBefore }

  // The `mega_customers` update is the last step of fulfillment, so it can
  const preferences = outcome.mmaPreferences
  const updatedPreferences: MmaPreferences | undefined = preferences
    ? { autoRefill: { ...preferences.autoRefill, monthlyCount: preferences.autoRefill.monthlyCount + 1 } }
    : undefined

  const { error } = await supabase
    .from('mega_customers')
    .update({
      mg_credits: outcome.creditsAfter,
      mg_expires_at: outcome.nextExpiresAt,
      mg_credit_lots: outcome.lots,
      mg_updated_at: outcome.at,
      ...(updatedPreferences ? { mg_mma_preferences: updatedPreferences } : {}),
    })
    .eq('mg_pass_id', passId)

  if (error) throw new Error(error.message)

  return { credited: true, credits: outcome.creditsAfter }
}

/**
 * Zeroes the balance of every customer whose matchas have reached their expiry
 * date, writing one `expired` transaction per customer so the ledger still
 * explains where the credits went.
 */
export async function sweepExpiredCredits(): Promise<ExpirySweepResult> {
  const at = new Date().toISOString()
  console.log(`Sweeping expired credits at ${at}…`)
  const { data, error } = await supabase
    .from('mega_customers')
    .select('mg_pass_id, mg_credits')
    .lte('mg_expires_at', at)
    .gt('mg_credits', 0)

  if (error) throw new Error(error.message)

  const expired = data ?? []
  let creditsRemoved = 0

  for (const customer of expired) {
    const creditsBefore = Number(customer.mg_credits)

    await recordTransaction({
      passId: customer.mg_pass_id,
      delta: -creditsBefore,
      reason: 'expired',
      refType: 'expiration',
      // The timestamp is what keeps this unique when the same user expires again.
      refId: `exp_${customer.mg_pass_id}_${at}`,
      meta: { expires_at: at, credits_after: 0, credits_before: creditsBefore },
      at,
    })

    const { error: updateError } = await supabase
      .from('mega_customers')
      .update({ mg_credits: 0, mg_credit_lots: [], mg_expires_at: null, mg_updated_at: at })
      .eq('mg_pass_id', customer.mg_pass_id)

    if (updateError) throw new Error(updateError.message)

    creditsRemoved += creditsBefore
  }

  return { swept: expired.length, creditsRemoved }
}
