import type { MmaPreferences } from '../types/customer.types.js'
import { supabase } from './supabase.client.js'

//GET THE STRIPE CUSTOMER ID OF THE CUSTOMER WITH THE GIVEN PASS ID, RETURNS NULL IF THE CUSTOMER DOES NOT HAVE A STRIPE CUSTOMER ID
export async function getStripeCustomerId(passId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('mega_customers')
    .select('mg_stripe_customer_id')
    .eq('mg_pass_id', passId)
    .maybeSingle()

  if (error) throw new Error(error.message)

  return data?.mg_stripe_customer_id ?? null
}

// IN THE FIRST CHECKOUT SESSION, WE SAVE THE STRIPE CUSTOMER ID AND PAYMENT METHOD ID TO THE CUSTOMER, SO THAT WE CAN USE IT FOR FUTURE AUTO REFILL PAYMENTS
export async function saveStripeCard(
  passId: string,
  stripeCustomerId: string,
  paymentMethodId: string,
): Promise<void> {
  const { error } = await supabase
    .from('mega_customers')
    .update({
      mg_stripe_customer_id: stripeCustomerId,
      mg_stripe_payment_method_id: paymentMethodId,
      mg_updated_at: new Date().toISOString(),
    })
    .eq('mg_pass_id', passId)

  if (error) throw new Error(error.message)
}

//UPDATES THE MMA PREFERENCES OF THE CUSTOMER WITH THE PREFERENCES OF THE USER WITH THE GIVEN PASS ID
export async function updateMmaPreferences(passId: string, preferences: MmaPreferences): Promise<void> {
  const now = new Date().toISOString()

  const { error } = await supabase
    .from('mega_customers')
    .update({ mg_mma_preferences: preferences, mg_mma_preferences_updated_at: now, mg_updated_at: now })
    .eq('mg_pass_id', passId)

  if (error) throw new Error(error.message)
}
