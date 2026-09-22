/** `mega_customers.mg_mma_preferences` — settings the auto-refill cron reads. */
export interface MmaPreferences {
  autoRefill: {
    /** Matchas bought per refill, in units of 50 (100 matcha packs as 2, 500 as 10, 5000 as 100). */
    qty: number
    enabled: boolean
    /** Lowercase ISO code, e.g. `"eur"` — what the card gets charged in. */
    currency: string
    /** Refill once the balance drops below this many matchas. */
    threshold: number
    /** Refills done in the current monthly window; the cron resets it at `monthlyResetAt`. */
    monthlyCount: number
    /** Max refills this window allows, or `null` for no cap. */
    monthlyLimit: number | null
    /** One month on from the moment auto-refill was last turned on, or last reset. */
    monthlyResetAt: string | null
    /** The raw monthly cap the user typed, in their own currency, or `null` for no cap. */
    monthlyLimitAmount: number | null
  }
}
