import { AUTO_REFILL_INTERVAL_MS } from '../lib/constants.js'
import { runAutoRefillCycle } from '../services/autoRefill.service.js'

/**
 * Runs the auto-refill scan on a flat interval, for as long as this process
 * is up — the same self-rescheduling `setTimeout` shape as
 * `scheduleCreditExpiry`, not `setInterval`: the next cycle is only armed
 * once the current one has finished, so a slow cycle can never overlap the
 * next and risk charging someone twice.
 */
export function scheduleAutoRefill() {
  console.log('Scheduling auto-refill cycle in', AUTO_REFILL_INTERVAL_MS / 1000, 'seconds')

  setTimeout(() => {
    void runAutoRefillCycle()
      .then((result) => console.log('Auto-refill cycle finished', result))
      .catch((error: unknown) => console.error('Auto-refill cycle failed', error))
      .finally(scheduleAutoRefill)
  }, AUTO_REFILL_INTERVAL_MS)
}
