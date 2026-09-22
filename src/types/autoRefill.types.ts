import type { MmaPreferences } from './customer.types.js'

/** One `mega_customers` row as the auto-refill scan needs to see it. */
export interface AutoRefillCustomerRow {
  mg_pass_id: string
  mg_credits: number
  mg_mma_preferences: MmaPreferences
  mg_stripe_customer_id: string | null
  mg_stripe_payment_method_id: string | null
}

export interface AutoRefillCycleResult {
  scanned: number
  charged: number
  failed: number
  reset: number
}
