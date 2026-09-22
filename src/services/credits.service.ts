import { randomUUID } from 'node:crypto'

import { LOT_LIFETIME_MONTHS, SIGNUP_BONUS } from '../lib/constants.js'
import { addMonths } from '../lib/date.js'
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

/**
 * Credits a customer for one paid Stripe checkout session, once and only
 * once — Stripe retries webhook delivery, so `sessionId` doubles as the
 * idempotency key the same way `free_signup` does for the signup bonus.
 *
 * Unlike the signup bonus, a purchase must not overwrite whatever the
 * customer already holds: the new lot is appended to `mg_credit_lots`, and
 * `mg_expires_at` only ever moves later, never earlier.
 *
 * Writes two ledger rows, the same as every other Stripe purchase already in
 * the table: the `credit_transaction` itself, and a `webhook_event` row
 * recording that this delivery was processed (its own id is what a retried
 * delivery would otherwise have no way to be told apart from).
 */
export async function addPurchasedCredits(
  passId: string,
  matchas: number,
  sessionId: string,
): Promise<PurchaseFulfillmentResult> {
  const { data: customer, error: customerError } = await supabase
    .from('mega_customers')
    .select('mg_email, mg_credits, mg_credit_lots, mg_expires_at')
    .eq('mg_pass_id', passId)
    .maybeSingle()

  if (customerError) throw new Error(customerError.message)
  if (!customer) throw new Error(`No mega_customers row for ${passId}`)

  const { data: alreadyFulfilled, error: ledgerError } = await supabase
    .from('mega_generations')
    .select('mg_id')
    .eq('mg_record_type', 'credit_transaction')
    .eq('mg_ref_type', 'stripe_checkout')
    .eq('mg_ref_id', sessionId)
    .limit(1)
    .maybeSingle()

  if (ledgerError) throw new Error(ledgerError.message)

  const creditsBefore = Number(customer.mg_credits ?? 0)

  if (alreadyFulfilled) return { credited: false, credits: creditsBefore }

  const at = new Date().toISOString()
  const expiresAt = addMonths(at, LOT_LIFETIME_MONTHS)
  const creditsAfter = creditsBefore + matchas

  await recordTransaction({
    passId,
    delta: matchas,
    reason: 'stripe-checkout',
    refType: 'stripe_checkout',
    refId: sessionId,
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
    mg_pass_id: passId,
    mg_status: 'succeeded',
    mg_meta: {
      email: customer.mg_email,
      balance: creditsAfter,
      credited: matchas,
      event_type: 'checkout.session.completed',
      request_id: requestId,
      session_id: sessionId,
    },
    mg_event_at: webhookAt,
    mg_created_at: webhookAt,
    mg_updated_at: webhookAt,
    mg_source: 'stripe',
    mg_ref_type: 'stripe_checkout',
    mg_ref_id: sessionId,
  })

  if (webhookError) throw new Error(webhookError.message)

  const lot: CreditLot = {
    amount: matchas,
    ref_id: sessionId,
    ref_type: 'stripe_checkout',
    created_at: at,
    expires_at: expiresAt,
  }

  const existingLots = Array.isArray(customer.mg_credit_lots) ? (customer.mg_credit_lots as CreditLot[]) : []
  const nextExpiresAt =
    customer.mg_expires_at && customer.mg_expires_at > expiresAt ? customer.mg_expires_at : expiresAt

  const { error } = await supabase
    .from('mega_customers')
    .update({
      mg_credits: creditsAfter,
      mg_expires_at: nextExpiresAt,
      mg_credit_lots: [...existingLots, lot],
      mg_updated_at: at,
    })
    .eq('mg_pass_id', passId)

  if (error) throw new Error(error.message)

  return { credited: true, credits: creditsAfter }
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
