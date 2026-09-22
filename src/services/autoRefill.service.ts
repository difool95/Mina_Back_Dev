import { AUTO_REFILL_PAGE_SIZE, MATCHA_PACKS } from '../lib/constants.js'
import { addMonths } from '../lib/date.js'
import type { AutoRefillCustomerRow, AutoRefillCycleResult } from '../types/autoRefill.types.js'
import type { Currency } from '../types/checkout.types.js'
import type { MmaPreferences } from '../types/customer.types.js'
import { updateMmaPreferences } from './customers.service.js'
import { chargeAutoRefill, rateFromGbp } from './stripe.service.js'
import { supabase } from './supabase.client.js'

interface CustomerResult {
  outcome: 'skipped' | 'charged' | 'failed'
  
  /** True if this pass also rolled the monthly window over, independent of `outcome`. */
  reset: boolean
}

// THIS METHOD IS THE MAIN ENTRY POINT FOR THE AUTO REFILL JOB, IT SCANS ALL THE CUSTOMERS WITH AUTO REFILL ENABLED AND CHARGES THEM IF THEY ARE ELIGIBLE
export async function runAutoRefillCycle(): Promise<AutoRefillCycleResult> {
  const at = new Date().toISOString()
  const result: AutoRefillCycleResult = { scanned: 0, charged: 0, failed: 0, reset: 0 }

  let offset = 0

  // The `for(;;)` loop is a simple way to page through all eligible customers without risking overlapping cycles or missing anyone. Each page is processed
  //  fully before the next is fetched, and the loop only exits when a page returns fewer than the requested number of rows.
  for (;;) {
    const { data, error } = await supabase
      .from('mega_customers')
      .select('mg_pass_id, mg_credits, mg_mma_preferences, mg_stripe_customer_id, mg_stripe_payment_method_id')
      .contains('mg_mma_preferences', { autoRefill: { enabled: true } })
      .order('mg_pass_id')
      .range(offset, offset + AUTO_REFILL_PAGE_SIZE - 1)

    if (error) throw new Error(error.message)

    const page = (data ?? []) as AutoRefillCustomerRow[]

    for (const customer of page) {
      result.scanned += 1

      // One bad row — a transient Stripe error, a malformed preferences
      // blob — must not stop every other eligible customer from being tried
      // this cycle.
      try {
        const { outcome, reset } = await processCustomer(customer, at)
        if (reset) result.reset += 1
        if (outcome === 'charged') result.charged += 1
        else if (outcome === 'failed') result.failed += 1
      } catch (error) {
        console.error(`Auto-refill: unexpected error for ${customer.mg_pass_id}`, error)
        result.failed += 1
      }
    }

    if (page.length < AUTO_REFILL_PAGE_SIZE) break
    offset += AUTO_REFILL_PAGE_SIZE
  }

  return result
}

//CHECK IF THE CUSTOMER IS ELIGIBLE FOR AUTO REFILL, IF YES THEN CHARGE THE CUSTOMER AND INCREMENT THE MONTHLY COUNT
async function processCustomer(customer: AutoRefillCustomerRow, at: string): Promise<CustomerResult> {
  let autoRefill = customer.mg_mma_preferences.autoRefill
  let reset = false

  if (autoRefill.monthlyResetAt && autoRefill.monthlyResetAt <= at) {
//RESETS THE MONTHLY COUNT AND SETS THE NEXT MONTHLY RESET DATE TO ONE MONTH FROM THE CURRENT MONTHLY RESET DATE
    autoRefill = { ...autoRefill, monthlyCount: 0, monthlyResetAt: addMonths(autoRefill.monthlyResetAt, 1) }
    const preferences: MmaPreferences = { autoRefill }
    await updateMmaPreferences(customer.mg_pass_id, preferences)
    reset = true
  }

  // THE CUSTOMER DIDN'T REACH THE THRESHOLD WE SKIP IT
  if (customer.mg_credits >= autoRefill.threshold) return { outcome: 'skipped', reset }

  //IF THE CUSTOMER REACHED THE MONTHLY LIMIT WE SKIP IT
  if (autoRefill.monthlyLimit !== null && autoRefill.monthlyCount >= autoRefill.monthlyLimit) {
    return { outcome: 'skipped', reset }
  }

  // IF THE CUSTOMER HAS NO SAVED CARD WE SKIP IT SILENTLY, THE NEXT CYCLE WILL TRY AGAIN (USER NEED TO DO AT LEAST ONE PURCHASE TO SAVE A CARD FOR AUTO REFILL)
  if (!customer.mg_stripe_customer_id || !customer.mg_stripe_payment_method_id) {
    console.log(`Auto-refill: ${customer.mg_pass_id} has no saved card yet, skipping`)
    return { outcome: 'skipped', reset }
  }

  //GET THE MATCHA PACK BASED ON THE QTY OF MATCHAS THAT THE CUSTOMER HAD IN HIS AUTO REFILL SETTINGS, IF THERE IS NO MATCHA PACK FOR THE QTY WE SKIP IT
  const matchas = autoRefill.qty * 50
  const pack = MATCHA_PACKS.find((candidate) => candidate.matchas === matchas)
  if (!pack) {
    console.error(`Auto-refill: ${customer.mg_pass_id} has no matcha pack matching qty ${autoRefill.qty}`)
    return { outcome: 'skipped', reset }
  }

  try {
    const rate = await rateFromGbp(autoRefill.currency.toUpperCase() as Currency)

    //CHARGE THE CUSTOMER AND INCREMENT THE MONTHLY COUNT
    await chargeAutoRefill({
      passId: customer.mg_pass_id,
      customerId: customer.mg_stripe_customer_id,
      paymentMethodId: customer.mg_stripe_payment_method_id,
      matchas,
      amountMinor: Math.round(pack.gbp * rate * 100),
      currency: autoRefill.currency,
    })

    return { outcome: 'charged', reset }
  } catch (error) {
    // Declined, needs re-authentication, whatever the reason — log it and
    // move on. No retry backoff, no auto-disable: the next cycle in 10
    // minutes tries again for as long as auto-refill stays on.
    console.error(`Auto-refill: charge failed for ${customer.mg_pass_id}`, error)
    return { outcome: 'failed', reset }
  }
}
