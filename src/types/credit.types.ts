/**
 * One batch of credits with its own expiry, as stored in
 * `mega_customers.mg_credit_lots`.
 */
export interface CreditLot {
  amount: number
  ref_id: string
  ref_type: string
  created_at: string
  expires_at: string
}

/** The `mg_meta` payload every `credit_transaction` row carries. */
export interface CreditTransactionMeta {
  expires_at: string
  credits_after: number
  credits_before: number
}

export interface SignupBonusResult {
  /** False when the ledger already holds a `free_signup` row for this user. */
  granted: boolean
  credits: number
}

export interface ExpirySweepResult {
  swept: number
  creditsRemoved: number
}

export interface PurchaseFulfillmentResult {
  /** False when this Stripe checkout session was already fulfilled. */
  credited: boolean
  credits: number
}
