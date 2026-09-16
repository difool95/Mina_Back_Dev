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
