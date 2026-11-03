import { secondsUntilHour } from '../lib/clock.js'
import { BRAND_MEMORY_EXPIRY_HOUR, TIME_ZONE } from '../lib/constants.js'
import { sweepExpiredBrandMemories } from '../services/brandMemory.service.js'

/**
 * Deletes the brand memories nobody used for BRAND_MEMORY_EXPIRY_DAYS, every
 * day at BRAND_MEMORY_EXPIRY_HOUR, Dubai time, the same way the credit expiry
 * sweep is scheduled: nothing at boot, and the next run read off the clock
 * after each one, so a failed or late run still lands on the next day.
 */
export function scheduleBrandMemoryExpiry() {
  const wait = secondsUntilHour(BRAND_MEMORY_EXPIRY_HOUR, TIME_ZONE)

  setTimeout(() => {
    void sweepExpiredBrandMemories()
      .then((result) => console.log('Brand memory expiry sweep finished', result))
      // An unhandled rejection in a timer takes the process down with it.
      .catch((error: unknown) => console.error('Brand memory expiry sweep failed', error))
      .finally(scheduleBrandMemoryExpiry)
  }, wait * 1000)

  console.log(`Next brand memory expiry sweep in ${Math.round(wait / 60)} min (${BRAND_MEMORY_EXPIRY_HOUR}:00 ${TIME_ZONE})`)
}
