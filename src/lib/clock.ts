import { DAY_SECONDS } from './constants.js'

/**
 * Seconds from now until the next `hour` o'clock in `timeZone`.
 *
 * A whole day when it is already that hour to the second, so a job that has
 * just run can never schedule itself straight back in.
 */
export function secondsUntilHour(hour: number, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    // `hour12: false` reads midnight back as hour 24 in some locales; this never does.
    hourCycle: 'h23',
  }).formatToParts(new Date())

  const read = (type: 'hour' | 'minute' | 'second') =>
    Number(parts.find((part) => part.type === type)!.value)

  const into = read('hour') * 3600 + read('minute') * 60 + read('second')
  const target = hour * 3600

  return target > into ? target - into : target - into + DAY_SECONDS
}

/**
 * Milliseconds from now until the next 1st of the month at `hour` o'clock in
 * `timeZone` — today, when it is the 1st and that hour is still to come.
 */
export function msUntilNextMonthStart(hour: number, timeZone: string) {
  const now = new Date()
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)
  const read = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)!.value)

  // The zone's wall clock written as if it were UTC, so the zone's offset is its difference from now.
  const wallClock = Date.UTC(read('year'), read('month') - 1, read('day'), read('hour'), read('minute'), read('second'))
  const offset = wallClock - Math.floor(now.getTime() / 1000) * 1000

  const isBeforeHourOnTheFirst = read('day') === 1 && read('hour') < hour
  const target = Date.UTC(read('year'), read('month') - (isBeforeHourOnTheFirst ? 1 : 0), 1, hour)

  return target - offset - now.getTime()
}
