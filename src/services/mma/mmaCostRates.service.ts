import { EXCHANGE_RATES_URL, MMA_COSTS } from '../../lib/constants.js'
import type { CostRates } from '../../types/mma/mma.types.js'
import { supabase } from '../thirdPartyClients/supabase.client.js'

// Held in memory: the exchange-rate and generations-count jobs refresh them, at startup and on their schedules.
let rates: CostRates = {
  usdPerGbp: MMA_COSTS.defaultUsdPerGbp,
  generationsPerMonth: MMA_COSTS.defaultGenerationsPerMonth,
}

/** The rates `mg_cost_data` is priced with right now. */
export const costRates = () => rates

/**
 * Reads what a pound is worth in dollars today, from the same rates the
 * frontend prices matchas with. A rate that cannot be read throws, and the
 * last one is kept.
 */
export async function refreshUsdPerGbp() {
  const response = await fetch(EXCHANGE_RATES_URL)
  if (!response.ok) throw new Error(`Could not read exchange rates (${response.status})`)

  const { rates: fromGbp } = (await response.json()) as { rates?: { USD?: number } }
  if (!fromGbp?.USD) throw new Error('Exchange rates came back without USD')

  rates = { ...rates, usdPerGbp: fromGbp.USD }

  return rates.usdPerGbp
}

/**
 * Counts the generations, still and video, that ended "done" last calendar
 * month (older rows say "succeeded" for the same thing, so both count). A
 * count that cannot be made, or comes back zero, falls back to the default
 * volume, so the fixed overhead is never divided by nothing.
 */
export async function refreshGenerationsPerMonth() {
  const now = new Date()
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)).toISOString()
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString()

  const { count, error } = await supabase
    .from('mega_generations')
    .select('mg_id', { count: 'exact', head: true })
    .eq('mg_record_type', 'generation')
    .in('mg_status', ['done', 'succeeded'])
    .gte('mg_created_at', start)
    .lt('mg_created_at', end)

  if (error) console.error('Could not count last month’s generations, using the default', error)

  rates = { ...rates, generationsPerMonth: count || MMA_COSTS.defaultGenerationsPerMonth }

  return rates.generationsPerMonth
}
