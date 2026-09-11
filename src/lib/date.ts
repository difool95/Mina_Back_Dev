export function addMonths(iso: string, months: number) {
  const date = new Date(iso)
  date.setUTCMonth(date.getUTCMonth() + months)

  return date.toISOString()
}
