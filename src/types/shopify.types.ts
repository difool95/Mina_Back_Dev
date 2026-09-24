/** A paid matcha purchase, as mirrored into Shopify. */
export interface ShopifyOrder {
  passId: string
  matchas: number
  /** In the currency's minor unit, as Stripe reports it. */
  amountMinor: number
  currency: string
  /** The Stripe checkout session or invoice id the order mirrors. */
  refId: string
  refType: 'stripe_checkout' | 'stripe_auto_refill'
  /** False for a Stripe test-mode payment, which Shopify then records as a fake order. */
  livemode: boolean
}
