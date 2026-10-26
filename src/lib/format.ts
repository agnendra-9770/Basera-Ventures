import { BOOKING_PLATFORMS, labelFor } from './constants'

export const formatPrice = (amount: number, currency = 'INR') =>
  new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)

export const formatDate = (iso?: string | null, style: 'long' | 'short' = 'long') =>
  iso
    ? new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: style === 'long' ? 'long' : 'short',
        year: 'numeric',
      }).format(new Date(iso))
    : ''

export const readingMinutes = (words: number) => Math.max(1, Math.round(words / 220))

export const platformLabel = (value?: string | null) => labelFor(BOOKING_PLATFORMS, value)

export const whatsappHref = (digits: string, message: string) =>
  `https://wa.me/${digits}?text=${encodeURIComponent(message)}`

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`

export type BookingQuery = {
  arrival?: string
  departure?: string
  adults?: number | string
  children?: number | string
  stay?: string
}

/** Fills {arrival}, {departure}, {adults}, {children} and {stay} in a booking-engine link. */
export const fillEngineUrl = (template: string, query: BookingQuery) =>
  template.replace(/\{(arrival|departure|adults|children|stay)\}/g, (_, key: keyof BookingQuery) =>
    encodeURIComponent(String(query[key] ?? '')),
  )

export const inquiryHref = (query: BookingQuery) => {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '' && value !== null) params.set(key, String(value))
  }
  const qs = params.toString()
  return `/contact${qs ? `?${qs}` : ''}#book`
}

/** "The Sage Studio · 12 Nov – 15 Nov · 2 adults" style summary for WhatsApp messages. */
export const describeTrip = (query: BookingQuery, stayName?: string) => {
  const fmt = (d?: string) =>
    d ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(new Date(d)) : ''
  const parts: string[] = []
  if (stayName) parts.push(stayName)
  if (query.arrival && query.departure) parts.push(`${fmt(query.arrival)} – ${fmt(query.departure)}`)
  else if (query.arrival) parts.push(`from ${fmt(query.arrival)}`)
  const adults = Number(query.adults || 0)
  const children = Number(query.children || 0)
  if (adults) {
    parts.push(
      `${adults} adult${adults === 1 ? '' : 's'}${children ? `, ${children} child${children === 1 ? '' : 'ren'}` : ''}`,
    )
  }
  return parts.join(' · ')
}

/** Converts "2 pm", "2:30 PM", "14:00" or "noon" into "14:00" for structured data. */
export const toIsoTime = (value?: string | null) => {
  if (!value) return undefined
  const text = value.trim().toLowerCase()
  if (text.includes('noon')) return '12:00'
  const match = text.match(/^(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)?$/)
  if (!match) return undefined
  let hours = Number(match[1])
  const minutes = match[2] ?? '00'
  const meridiem = match[3]?.replace(/\./g, '')
  if (meridiem === 'pm' && hours < 12) hours += 12
  if (meridiem === 'am' && hours === 12) hours = 0
  if (hours > 23 || Number(minutes) > 59) return undefined
  return `${String(hours).padStart(2, '0')}:${minutes}`
}
