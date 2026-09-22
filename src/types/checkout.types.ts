/** The four currencies Mina prices in. Everything is held in GBP and converted. */
export type Currency = 'GBP' | 'EUR' | 'AED' | 'USD'

export interface CreateCheckoutSessionResult {
  url: string
}
