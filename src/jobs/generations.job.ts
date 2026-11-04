import { secondsUntilHour } from '../lib/clock.js'
import { GENERATION_PURGE_HOUR, TIME_ZONE } from '../lib/constants.js'
import { purgeDeletedGenerations } from '../services/generations.service.js'

//This method os called every day at GENERATION_PURGE_HOUR to purge all deleted generations that have been deleted for more than GENERATION_PURGE_DAYS.
//It uses a setTimeout to schedule the next purge after the current one is finished.
export function schedulePurgeDeletedGenerations() {
  const wait = secondsUntilHour(GENERATION_PURGE_HOUR, TIME_ZONE)

  setTimeout(() => {
    void purgeDeletedGenerations()
      .then((result) => console.log('Deleted generations purge finished', result))
      // An unhandled rejection in a timer takes the process down with it.
      .catch((error: unknown) => console.error('Deleted generations purge failed', error))
      .finally(schedulePurgeDeletedGenerations)
  }, wait * 1000)

  console.log(`Next deleted generations purge in ${Math.round(wait / 60)} min (${GENERATION_PURGE_HOUR}:00 ${TIME_ZONE})`)
}
