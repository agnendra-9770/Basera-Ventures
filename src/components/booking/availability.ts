'use client'

import { useEffect, useState } from 'react'

import type { Availability } from '@/lib/availability'
import { addDays, type Day, daysBetween } from '@/lib/dates'

export type Calendar = {
  /** Nights that can't be booked. */
  booked: Set<Day>
  /** Free nights are really free (a platform calendar is connected and was read). */
  synced: boolean
  minNights: number
  maxNights: number | null
}

const EMPTY: Calendar = { booked: new Set(), synced: false, minNights: 1, maxNights: null }

let request: Promise<Availability | null> | null = null

/** Booked nights for every stay, fetched once per page and shared by every date picker. */
export function useAvailability() {
  const [data, setData] = useState<Availability | null>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    let live = true
    request ??= fetch('/next/availability')
      .then((res) => (res.ok ? (res.json() as Promise<Availability>) : null))
      .catch(() => null)
    request.then((result) => {
      if (!live) return
      if (result) setData(result)
      else {
        setFailed(true)
        request = null
      }
    })
    return () => {
      live = false
    }
  }, [])
  return { data, loading: !data && !failed, failed }
}

/**
 * The calendar for one stay, or — when no stay is chosen — for "any stay":
 * a night is only unavailable when every stay is booked that night.
 */
export const calendarFor = (data: Availability | null, stay?: string | null): Calendar => {
  if (!data) return EMPTY
  if (stay) {
    const one = data.stays[stay]
    return one ? { ...one, booked: new Set(one.booked) } : EMPTY
  }
  const all = Object.values(data.stays)
  if (!all.length) return EMPTY
  const [first, ...rest] = all.map((s) => new Set(s.booked))
  return {
    booked: new Set([...first].filter((night) => rest.every((set) => set.has(night)))),
    synced: all.every((s) => s.synced),
    minNights: Math.min(...all.map((s) => s.minNights)),
    maxNights: all.some((s) => s.maxNights === null) ? null : Math.max(...all.map((s) => s.maxNights ?? 0)),
  }
}

export const nightsOf = (start: Day, end: Day) => Array.from({ length: Math.max(0, daysBetween(start, end)) }, (_, i) => addDays(start, i))

/** "free" (confirmed by a synced calendar), "unknown" (nothing blocks it, but no calendar is connected) or "booked". */
export const rangeStatus = (calendar: Calendar, start: Day, end: Day): 'free' | 'unknown' | 'booked' => {
  if (nightsOf(start, end).some((night) => calendar.booked.has(night))) return 'booked'
  return calendar.synced ? 'free' : 'unknown'
}

/** Which stays can host a range: confirmed free first, then those still to confirm. */
export const staysForRange = (data: Availability | null, start: Day, end: Day) => {
  const free: string[] = []
  const unknown: string[] = []
  for (const [slug, stay] of Object.entries(data?.stays ?? {})) {
    const status = rangeStatus({ ...stay, booked: new Set(stay.booked) }, start, end)
    const nights = daysBetween(start, end)
    if (status === 'booked' || nights < stay.minNights || (stay.maxNights && nights > stay.maxNights)) continue
    ;(status === 'free' ? free : unknown).push(slug)
  }
  return { free, unknown }
}
