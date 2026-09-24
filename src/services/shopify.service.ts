import { env } from '../config/env.js'
import type { ShopifyOrder } from '../types/shopify.types.js'
import { supabase } from './supabase.client.js'


//THIS IS A GRAPHQL MUTATION THAT CREATES AN ORDER AND A CUSTOMER RECORD IN SHOPIFY.
const ORDER_CREATE = `mutation ($order: OrderCreateOrderInput!, $options: OrderCreateOptionsInput) {
  orderCreate(order: $order, options: $options) {
    order { customer { id } }
    userErrors { field message }
  }
}`

//THIS IS A GRAPHQL MUTATION THAT UPDATES THE CUSTOMER'S EMAIL MARKETING CONSENT IN SHOPIFY.
const EMAIL_CONSENT_UPDATE = `mutation ($input: CustomerEmailMarketingConsentUpdateInput!) {
  customerEmailMarketingConsentUpdate(input: $input) {
    userErrors { field message }
  }
}`

//THIS METHOD SENDS A GRAPHQL MUTATION TO SHOPIFY, IT RETURNS THE RESULT OF THE MUTATION OR THROWS AN ERROR IF THE REQUEST FAILS OR SHOPIFY RETURNS AN ERROR
async function shopifyMutation<T extends { userErrors: unknown[] }>(
  query: string,
  field: string,
  variables: unknown,
): Promise<T> {
  const response = await fetch(
    `https://${env.SHOPIFY_STORE_DOMAIN}/admin/api/${env.SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': env.SHOPIFY_ADMIN_TOKEN },
      body: JSON.stringify({ query, variables }),
    },
  )

  if (!response.ok) throw new Error(`${response.status} ${await response.text()}`)

  const { data, errors } = (await response.json()) as { data?: Record<string, T>; errors?: unknown[] }
  const result = data?.[field]

  if (errors?.length || !result || result.userErrors.length) {
    throw new Error(JSON.stringify(errors ?? result?.userErrors))
  }

  return result
}

//THIS METHOD RECORDS A PAID MATCHA PURCHASE INTO SHOPIFY, IT CREATES AN ORDER WITH THE GIVEN DETAILS, 
// SUBSCRIBES THE CUSTOMER TO EMAILS AND UPDATES THE CUSTOMER RECORD WITH THE SHOPIFY CUSTOMER ID
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

    const created = await shopifyMutation<{ order: { customer: { id: string } | null } | null; userErrors: unknown[] }>(
      ORDER_CREATE,
      'orderCreate',
      {
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
    )

    const customerGid = created.order?.customer?.id
    if (!customerGid) return

    const { error } = await supabase
      .from('mega_customers')
      .update({ mg_shopify_customer_id: customerGid.split('/').pop() })
      .eq('mg_pass_id', order.passId)

    if (error) throw new Error(error.message)

    // The order's customer upsert cannot carry marketing consent, so it is set in a second call.
    await shopifyMutation(EMAIL_CONSENT_UPDATE, 'customerEmailMarketingConsentUpdate', {
      input: {
        customerId: customerGid,
        emailMarketingConsent: {
          marketingState: 'SUBSCRIBED',
          // No consentUpdatedAt: Shopify stamps its own time, and ours can run ahead of it and be rejected.
          marketingOptInLevel: 'SINGLE_OPT_IN',
        },
      },
    })
  } catch (error) {
    console.error(`Shopify: could not record ${order.refType} ${order.refId}`, error)
  }
}
