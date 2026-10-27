/**
 * Calendar days as "YYYY-MM-DD" strings. All arithmetic is done in UTC, so a
 * visitor's time zone can never shift a night forwards or backwards.
 */
export type Day = string

const DAY_MS = 86_400_000

export const toUtc = (day: Day) => Date.UTC(Number(day.slice(0, 4)), Number(day.slice(5, 7)) - 1, Number(day.slice(8, 10)))

export const fromUtc = (ms: number): Day => new Date(ms).toISOString().slice(0, 10)

export const addDays = (day: Day, days: number): Day => fromUtc(toUtc(day) + days * DAY_MS)

/** Whole days from `a` to `b` (positive when b is later). */
export const daysBetween = (a: Day, b: Day) => Math.round((toUtc(b) - toUtc(a)) / DAY_MS)

export const isDay = (value: unknown): value is Day => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)

/** Today on the visitor's own clock. */
export const localToday = (): Day => {
  const now = new Date()
  return fromUtc(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
}

/** "2026-11" for the month containing `day`. */
export const monthOf = (day: Day) => day.slice(0, 7)

export const addMonths = (month: string, count: number) => {
  const index = Number(month.slice(0, 4)) * 12 + Number(month.slice(5, 7)) - 1 + count
  return `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, '0')}`
}

/** Weeks of a month, Sunday first; days outside the month are null. */
export const monthGrid = (month: string): (Day | null)[][] => {
  const first = `${month}-01`
  const lead = new Date(toUtc(first)).getUTCDay()
  const length = daysBetween(first, `${addMonths(month, 1)}-01`)
  const cells: (Day | null)[] = [...Array(lead).fill(null), ...Array.from({ length }, (_, i) => addDays(first, i))]
  while (cells.length % 7) cells.push(null)
  return Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7))
}

const format = (day: Day, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', ...options }).format(new Date(toUtc(day)))

export const formatMonth = (month: string) => format(`${month}-01`, { month: 'long', year: 'numeric' })
export const formatShort = (day: Day) => format(day, { day: 'numeric', month: 'short' })
export const formatMedium = (day: Day) => format(day, { weekday: 'short', day: 'numeric', month: 'short' })
export const formatLong = (day: Day) => format(day, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

export const nightsLabel = (nights: number) => `${nights} night${nights === 1 ? '' : 's'}`
