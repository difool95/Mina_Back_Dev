import { secondsUntilHour } from '../lib/clock.js'
import { BRAND_MEMORY_EXPIRY_HOUR, TIME_ZONE } from '../lib/constants.js'
import { resetIdleUseCounts, sweepExpiredBrandMemories } from '../services/brandMemory.service.js'


//This method schedules the brand memory expiry sweep to run at a specific hour of the day (BRAND_MEMORY_EXPIRY_HOUR) in the specified time zone (TIME_ZONE).
//It calculates the time to wait until the next scheduled run and sets a timeout to execute the sweepExpiredBrandMemories and resetIdleUseCounts functions. 
//After the sweep is completed, it schedules the next run.
export function scheduleBrandMemoryExpiry() {
  const wait = secondsUntilHour(BRAND_MEMORY_EXPIRY_HOUR, TIME_ZONE)

  setTimeout(() => {
    // The expired ones go first, so no row about to be deleted is written to.
    void sweepExpiredBrandMemories()
      .then(async (expiry) => console.log('Brand memory expiry sweep finished', expiry, await resetIdleUseCounts()))
      // An unhandled rejection in a timer takes the process down with it.
      .catch((error: unknown) => console.error('Brand memory expiry sweep failed', error))
      .finally(scheduleBrandMemoryExpiry)
  }, wait * 1000)

  console.log(`Next brand memory expiry sweep in ${Math.round(wait / 60)} min (${BRAND_MEMORY_EXPIRY_HOUR}:00 ${TIME_ZONE})`)
}
