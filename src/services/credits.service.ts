import { randomUUID } from 'node:crypto'

import { LOT_LIFETIME_MONTHS, SIGNUP_BONUS } from '../lib/constants.js'
import { addMonths } from '../lib/date.js'
import type {
  CreditLot,
  CreditTransactionMeta,
  ExpirySweepResult,
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
}

/**
 * Appends one `credit_transaction` row to `mega_generations`.
 *
 * Columns the platform leaves blank for this record type are omitted rather
 * than sent as null, so each keeps whatever default the table defines.
 */
async function recordTransaction(entry: LedgerEntry) {
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
    mg_source: 'system',
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
