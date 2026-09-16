import { secondsUntilHour } from '../lib/clock.js'
import { CREDIT_EXPIRY_HOUR, TIME_ZONE } from '../lib/constants.js'
import { sweepExpiredCredits } from '../services/credits.service.js'

/**
 * Sweeps expired credits every day at the expiry hour, Dubai time, for as long
 * as this process is up. This is the only thing that sweeps them: there is no
 * endpoint for it, because the only caller was ever a scheduler and the
 * scheduler is now in here.
 *
 * Starting up only waits — nothing is swept at boot. The delay is read off the
 * clock again after every run, so a slow sweep, a failed one, or a timer that
 * fires late all still land on the next one instead of compounding.
 *
 * There is no catch-up: a process that is down at the hour misses that day,
 * and those credits go at the next one.
 */
export function scheduleCreditExpiry() {
  const wait = secondsUntilHour(CREDIT_EXPIRY_HOUR, TIME_ZONE)

  console.log('Scheduling credit expiry sweep in', wait, 'seconds')

  setTimeout(() => {
    void sweepExpiredCredits()
      .then((result) => console.log('Expiry sweep finished', result))
      // An unhandled rejection in a timer takes the process down with it, and
      // a sweep that failed today should still be tried tomorrow.
      .catch((error: unknown) => console.error('Expiry sweep failed', error))
      .finally(scheduleCreditExpiry)
  }, wait * 1000)

  console.log(
    `Next credit expiry sweep in ${Math.round(wait / 60)} min (0${CREDIT_EXPIRY_HOUR}:00 ${TIME_ZONE})`,
  )
}
