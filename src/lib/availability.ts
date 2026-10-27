import type { Stay } from '@/payload-types'

import { addDays, daysBetween, fromUtc, isDay, type Day } from './dates'
import { getPayloadClient } from './data'

/** How far ahead the calendar looks, in days. */
const HORIZON = 550
/** How long a platform's calendar is reused before it is fetched again. */
const REFRESH_SECONDS = 900

export type StayAvailability = {
  /** Nights that can't be booked ("YYYY-MM-DD" of the night's evening). */
  booked: Day[]
  /** True when at least one platform calendar was read successfully, so free nights are really free. */
  synced: boolean
  minNights: number
  maxNights: number | null
}

export type Availability = {
  checkedAt: string
  from: Day
  stays: Record<string, StayAvailability>
}

/** The date part of an iCalendar DATE or DATE-TIME value ("20261104" or "20261104T140000Z"). */
const icsDay = (value: string): Day | null => {
  const m = value.trim().match(/^(\d{4})(\d{2})(\d{2})/)
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null
}

/**
 * Booked nights in an iCalendar feed (Airbnb, Booking.com, Vrbo, Google…). Each event
 * blocks the nights from its start up to, not including, its end — the check-out day
 * stays free for the next guest to arrive.
 */
export const parseIcs = (text: string): Day[] => {
  const lines = text.replace(/\r?\n[ \t]/g, '').split(/\r?\n/)
  const nights = new Set<Day>()
  let event: Record<string, string> | null = null
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') event = {}
    else if (line === 'END:VEVENT' && event) {
      const start = event.DTSTART ? icsDay(event.DTSTART) : null
      const end = event.DTEND ? icsDay(event.DTEND) : null
      if (start && event.STATUS?.toUpperCase() !== 'CANCELLED') {
        const span = end ? Math.max(1, daysBetween(start, end)) : 1
        for (let i = 0; i < Math.min(span, 1000); i++) nights.add(addDays(start, i))
      }
      event = null
    } else if (event) {
      const colon = line.indexOf(':')
      if (colon > 0) event[line.slice(0, colon).split(';')[0].toUpperCase()] = line.slice(colon + 1)
    }
  }
  return [...nights]
}

const readCalendar = async (url: string): Promise<Day[] | null> => {
  try {
    const res = await fetch(url, {
      headers: { Accept: 'text/calendar, text/plain;q=0.9, */*;q=0.1' },
      next: { revalidate: REFRESH_SECONDS },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return null
    const text = await res.text()
    return text.includes('BEGIN:VCALENDAR') ? parseIcs(text) : null
  } catch {
    return null
  }
}

const blockedNights = (ranges: NonNullable<NonNullable<Stay['availability']>['blocked']>): Day[] =>
  ranges.flatMap((range) => {
    const from = range.from?.slice(0, 10)
    const to = range.to?.slice(0, 10)
    if (!isDay(from) || !isDay(to) || to < from) return []
    return Array.from({ length: Math.min(daysBetween(from, to) + 1, 1000) }, (_, i) => addDays(from, i))
  })

/** Booked nights for every published stay: platform calendars plus the dates blocked in the CMS. */
export const getAvailability = async (): Promise<Availability> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'stays',
    depth: 0,
    limit: 100,
    pagination: false,
    overrideAccess: true,
    where: { _status: { equals: 'published' } },
    select: { slug: true, minNights: true, maxNights: true, availability: true },
  })

  // Yesterday, so a guest in a time zone behind ours still sees today correctly.
  const from = addDays(fromUtc(Date.now()), -1)
  const until = addDays(from, HORIZON)
  const stays: Record<string, StayAvailability> = {}

  await Promise.all(
    docs.map(async (stay) => {
      if (!stay.slug) return
      const feeds = await Promise.all((stay.availability?.calendars ?? []).map((c) => readCalendar(c.url)))
      const booked = new Set<Day>([...feeds.flatMap((nights) => nights ?? []), ...blockedNights(stay.availability?.blocked ?? [])])
      stays[stay.slug] = {
        booked: [...booked].filter((night) => night >= from && night <= until).sort(),
        synced: feeds.some((nights) => nights !== null),
        minNights: Math.max(1, stay.minNights ?? 1),
        maxNights: stay.maxNights ?? null,
      }
    }),
  )

  return { checkedAt: new Date().toISOString(), from, stays }
}
