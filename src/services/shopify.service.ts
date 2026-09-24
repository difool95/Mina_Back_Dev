import { env } from '../config/env.js'
import type { ShopifyOrder } from '../types/shopify.types.js'
import { supabase } from './supabase.client.js'

const ORDER_CREATE = `mutation ($order: OrderCreateOrderInput!, $options: OrderCreateOptionsInput) {
  orderCreate(order: $order, options: $options) {
    order { customer { id } }
    userErrors { field message }
  }
}`

//THIS METHOD RECORDS A PAID MATCHA PURCHASE INTO SHOPIFY, IT CREATES AN ORDER WITH THE GIVEN DETAILS AND UPDATES THE CUSTOMER RECORD WITH THE SHOPIFY CUSTOMER ID
export async function recordShopifyOrder(order: ShopifyOrder): Promise<void> {
  try {
    // The Mina account's own address, not whatever was typed on the Stripe card form.
    const { data: customer, error: lookupError } = await supabase
      .from('mega_customers')
      .select('mg_email')
      .eq('mg_pass_id', order.passId)
      .maybeSingle()

    if (lookupError) throw new Error(lookupError.message)

    const email = customer?.mg_email as string | undefined
    if (!email) return

    const currencyCode = order.currency.toUpperCase()
    const priceSet = { shopMoney: { amount: (order.amountMinor / 100).toFixed(2), currencyCode } }

    const response = await fetch(
      `https://${env.SHOPIFY_STORE_DOMAIN}/admin/api/${env.SHOPIFY_API_VERSION}/graphql.json`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': env.SHOPIFY_ADMIN_TOKEN },
        body: JSON.stringify({
          query: ORDER_CREATE,
          variables: {
            order: {
              email,
              customer: { toUpsert: { email } },
              currency: currencyCode,
              financialStatus: 'PAID',
              sourceIdentifier: order.refId,
              // Stripe test-mode payments are flagged so they stay out of the real sales numbers.
              test: !order.livemode,
              tags: order.livemode ? [order.refType] : [order.refType, 'fake'],
              lineItems: [
                {
                  title: `${order.livemode ? '' : 'FAKE '}${order.matchas} Matcha`,
                  quantity: 1,
                  requiresShipping: false,
                  priceSet,
                },
              ],
            },
            options: { sendReceipt: false, sendFulfillmentReceipt: false },
          },
        }),
      },
    )

    if (!response.ok) throw new Error(`${response.status} ${await response.text()}`)

    const { data, errors } = (await response.json()) as {
      data?: { orderCreate: { order: { customer: { id: string } | null } | null; userErrors: unknown[] } }
      errors?: unknown[]
    }
    const result = data?.orderCreate

    if (errors?.length || !result || result.userErrors.length) {
      throw new Error(JSON.stringify(errors ?? result?.userErrors))
    }

    const customerId = result.order?.customer?.id.split('/').pop()
    if (!customerId) return

    const { error } = await supabase
      .from('mega_customers')
      .update({ mg_shopify_customer_id: customerId })
      .eq('mg_pass_id', order.passId)

    if (error) throw new Error(error.message)
  } catch (error) {
    console.error(`Shopify: could not record ${order.refType} ${order.refId}`, error)
  }
}
