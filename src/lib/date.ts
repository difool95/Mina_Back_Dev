import type { StepTiming } from '../types/mma/mma.types.js'

/** When an MMA step ran: from `startedAt` until now. */
export function stepTiming(startedAt: Date): StepTiming {
  const endedAt = new Date()

  return {
    started_at: startedAt.toISOString(),
    ended_at: endedAt.toISOString(),
    duration_ms: endedAt.getTime() - startedAt.getTime(),
  }
}

export function addMonths(iso: string, months: number) {
  const date = new Date(iso)
  date.setUTCMonth(date.getUTCMonth() + months)

  return date.toISOString()
}
