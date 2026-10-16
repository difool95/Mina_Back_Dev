import { msUntilNextMonthStart, secondsUntilHour } from '../lib/clock.js'
import { EXCHANGE_RATE_HOUR, GENERATIONS_COUNT_HOUR, TIME_ZONE } from '../lib/constants.js'
import { refreshGenerationsPerMonth, refreshUsdPerGbp } from '../services/mma/mmaCostRates.service.js'


// this method is called on startup and then every day at the exchange-rate hour, Dubai time. It reads the GBP → USD rate from the same source the frontend uses,
// and keeps it in memory for pricing.
export function scheduleExchangeRate() {
  const refresh = (when: string) =>
    refreshUsdPerGbp()
      .then((usdPerGbp) => console.log(`GBP → USD rate refreshed (${when}):`, usdPerGbp))
      .catch((error: unknown) => console.error('GBP → USD rate refresh failed, keeping the last one', error))

  void refresh('startup')

  const scheduleNext = () => {
    const wait = secondsUntilHour(EXCHANGE_RATE_HOUR, TIME_ZONE)
    setTimeout(() => void refresh('daily').finally(scheduleNext), wait * 1000)
    console.log(`Next GBP → USD rate refresh in ${Math.round(wait / 60)} min (${EXCHANGE_RATE_HOUR}:00 ${TIME_ZONE})`)
  }
  scheduleNext()
}

/** The longest wait a single `setTimeout` can hold, about 24.8 days. */
const MAX_TIMEOUT_MS = 2 ** 31 - 1

/** Runs `run` once, `ms` from now — waiting in a chain of timers when that is further than one can hold. */
function runIn(ms: number, run: () => void) {
  if (ms > MAX_TIMEOUT_MS) setTimeout(() => runIn(ms - MAX_TIMEOUT_MS, run), MAX_TIMEOUT_MS)
  else setTimeout(run, Math.max(ms, 0))
}

// this method is called on startup and then once a month, on the 1st at the generations-count hour, Dubai time. It counts the generations
// that ended "done" last calendar month, and keeps it in memory for pricing.
export function scheduleGenerationsCount() {
  const refresh = (when: string) =>
    refreshGenerationsPerMonth()
      .then((count) => console.log(`Generations per month refreshed (${when}):`, count))
      .catch((error: unknown) => console.error('Generations per month refresh failed', error))

  void refresh('startup')

  const scheduleNext = () => {
    const wait = msUntilNextMonthStart(GENERATIONS_COUNT_HOUR, TIME_ZONE)
    runIn(wait, () => void refresh('monthly').finally(scheduleNext))
    console.log(`Next generations count in ${Math.round(wait / 86_400_000)} days (1st, ${GENERATIONS_COUNT_HOUR}:00 ${TIME_ZONE})`)
  }
  scheduleNext()
}
