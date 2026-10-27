'use client'

import { useRouter } from 'next/navigation'
import { type ReactNode, useEffect, useId, useRef, useState } from 'react'

import { cx } from '@/lib/cx'
import { daysBetween, formatShort, localToday, nightsLabel } from '@/lib/dates'
import { describeTrip, fillEngineUrl, inquiryHref, whatsappHref } from '@/lib/format'

import { Icon } from '../ui/Icon'
import { calendarFor, rangeStatus, staysForRange, useAvailability } from './availability'
import { DatesField } from './DatesField'
import type { Range } from './DateRangePicker'

export type StayOption = { slug: string; name: string; maxGuests?: number | null; airbnb?: string | null }

/** The stay's Airbnb listing with dates and guests filled in, so the guest lands on the real price. */
const airbnbHref = (listing: string, range: Range, adults: number, children: number) => {
  try {
    const url = new URL(listing)
    if (range.start) url.searchParams.set('check_in', range.start)
    if (range.end) url.searchParams.set('check_out', range.end)
    url.searchParams.set('adults', String(adults))
    if (children) url.searchParams.set('children', String(children))
    return url.toString()
  } catch {
    return listing
  }
}

function Stepper({
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  hint?: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}) {
  return (
    <div className="stepper">
      <div>
        <span className="stepper__label">{label}</span>
        {hint && <span className="stepper__hint">{hint}</span>}
      </div>
      <div className="stepper__controls">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Fewer ${label.toLowerCase()}`}
        >
          <Icon name="minus" size={16} />
        </button>
        <output aria-live="polite" aria-label={label}>
          {value}
        </output>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`More ${label.toLowerCase()}`}
        >
          <Icon name="plus" size={16} />
        </button>
      </div>
    </div>
  )
}

type Props = {
  stays: StayOption[]
  mode: 'inquiry' | 'engine'
  engineUrl?: string | null
  whatsapp?: string | null
  whatsappIntro?: string
  variant?: 'dock' | 'card'
  defaultStay?: string
  submitLabel?: string
  footer?: ReactNode
}

/**
 * Dates, guests and (when there is a choice) the stay. Booked nights come from each
 * stay's platform calendars, so guests only pick dates that work. Sends guests to the
 * booking engine if one is configured, otherwise to the inquiry form with everything
 * filled in. It never pretends a booking has been made.
 */
export function BookingBar({
  stays,
  mode,
  engineUrl,
  whatsapp,
  whatsappIntro = 'Hello! I would like to ask about staying with you',
  variant = 'dock',
  defaultStay,
  submitLabel = 'Check availability',
  footer,
}: Props) {
  const router = useRouter()
  const id = useId()
  const [today, setToday] = useState('')
  const [range, setRange] = useState<Range>({ start: null, end: null })
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [stay, setStay] = useState(defaultStay ?? '')
  const [error, setError] = useState('')
  const [guestsOpen, setGuestsOpen] = useState(false)
  const guestsRef = useRef<HTMLDivElement>(null)
  const { data, loading } = useAvailability()

  // Dates depend on the visitor's own clock, so they are set after hydration.
  useEffect(() => setToday(localToday()), [])

  useEffect(() => {
    if (!guestsOpen) return
    const onPointer = (event: PointerEvent) => {
      if (!guestsRef.current?.contains(event.target as Node)) setGuestsOpen(false)
    }
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setGuestsOpen(false)
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [guestsOpen])

  const chosen = stays.find((s) => s.slug === stay)
  const calendar = calendarFor(data, stay || null)
  const maxGuests = chosen?.maxGuests ?? Math.max(16, ...stays.map((s) => s.maxGuests ?? 0))

  // Keep the party within the chosen stay's capacity.
  useEffect(() => {
    if (adults + children > maxGuests) {
      setChildren(Math.max(0, Math.min(children, maxGuests - 1)))
      setAdults((a) => Math.max(1, Math.min(a, maxGuests - Math.min(children, maxGuests - 1))))
    }
  }, [maxGuests, adults, children])

  const nights = range.start && range.end ? daysBetween(range.start, range.end) : 0
  const status = nights && !loading ? rangeStatus(calendar, range.start!, range.end!) : null
  const tooShort = nights > 0 && nights < calendar.minNights
  const tooLong = Boolean(nights && calendar.maxNights && nights > calendar.maxNights)
  const options = !stay && nights && data ? staysForRange(data, range.start!, range.end!) : null

  const query = { arrival: range.start ?? '', departure: range.end ?? '', adults, children, stay }
  const stayName = chosen?.name

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (stay && status === 'booked') {
      setError(`${stayName} is already booked on some of these nights. Choose other dates or another home.`)
      return
    }
    if (tooShort) {
      setError(`${stayName ?? 'This stay'} has a minimum stay of ${nightsLabel(calendar.minNights)}.`)
      return
    }
    if (mode === 'engine' && engineUrl) {
      window.location.href = fillEngineUrl(engineUrl, query)
      return
    }
    router.push(inquiryHref(query))
  }

  const trip = describeTrip(query, stayName)
  const waHref = whatsapp ? whatsappHref(whatsapp, `${whatsappIntro}${trip ? ` — ${trip}` : ''}.`) : null
  const guestsLabel = `${adults} adult${adults === 1 ? '' : 's'}${children ? ` · ${children} child${children === 1 ? '' : 'ren'}` : ''}`
  const nameOf = (slug: string) => stays.find((s) => s.slug === slug)?.name ?? slug
  const airbnb = chosen?.airbnb && range.start && range.end && status !== 'booked' ? airbnbHref(chosen.airbnb, range, adults, children) : null

  return (
    <form className={cx('booking', `booking--${variant}`)} onSubmit={submit} aria-label="Check availability" noValidate>
      <div className="booking__fields">
        <DatesField
          value={range}
          onChange={(next) => {
            setRange(next)
            setError('')
          }}
          calendar={calendar}
          loading={loading || !today}
          today={today}
          idPrefix={id}
          variant="bar"
          stayName={stayName}
        />
        <div className="booking__field booking__field--guests" ref={guestsRef}>
          <span className="booking__label" id={`${id}-guests-label`}>
            Guests
          </span>
          <button
            type="button"
            className="booking__input booking__toggle"
            aria-expanded={guestsOpen}
            aria-controls={`${id}-guests`}
            aria-labelledby={`${id}-guests-label ${id}-guests-value`}
            onClick={() => setGuestsOpen((open) => !open)}
          >
            <span id={`${id}-guests-value`}>{guestsLabel}</span>
            <Icon name="chevron-down" size={16} />
          </button>
          {guestsOpen && (
            <div className="booking__popover" id={`${id}-guests`} role="group" aria-label="Number of guests">
              <Stepper label="Adults" value={adults} min={1} max={maxGuests - children} onChange={setAdults} />
              <Stepper label="Children" hint="Under 12" value={children} min={0} max={Math.max(0, maxGuests - adults)} onChange={setChildren} />
              {chosen?.maxGuests && (
                <p className="booking__note">
                  {chosen.name} sleeps up to {chosen.maxGuests} guest{chosen.maxGuests === 1 ? '' : 's'}.
                </p>
              )}
              <button type="button" className="link-arrow" onClick={() => setGuestsOpen(false)}>
                Done
              </button>
            </div>
          )}
        </div>
        {stays.length > 1 && (
          <div className="booking__field">
            <label className="booking__label" htmlFor={`${id}-stay`}>
              Stay
            </label>
            <select
              id={`${id}-stay`}
              className="booking__input booking__select"
              value={stay}
              onChange={(e) => {
                setStay(e.target.value)
                setError('')
              }}
            >
              <option value="">Any — help me choose</option>
              {stays.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="booking__submit">
        <button type="submit" className="btn btn--solid">
          <span>{submitLabel}</span>
          <Icon name="arrow-right" size={18} />
        </button>
      </div>

      {nights > 0 && (
        <div className="booking__result" role="status">
          {stay ? (
            status === 'booked' ? (
              <p className="is-booked">
                {stayName} is already booked on some of these nights — choose other dates or another home.
              </p>
            ) : tooShort ? (
              <p className="is-booked">
                {stayName} has a minimum stay of {nightsLabel(calendar.minNights)}.
              </p>
            ) : tooLong ? (
              <p>For stays longer than {nightsLabel(calendar.maxNights!)}, send us your dates and we’ll arrange it.</p>
            ) : status === 'free' ? (
              <p className="is-free">
                <Icon name="check" size={16} /> {stayName} is free for {nightsLabel(nights)}, {formatShort(range.start!)} – {formatShort(range.end!)}.
              </p>
            ) : (
              <p>
                {nightsLabel(nights)}, {formatShort(range.start!)} – {formatShort(range.end!)}. We’ll confirm availability and the rate in our reply.
              </p>
            )
          ) : options ? (
            options.free.length || options.unknown.length ? (
              <p>
                {options.free.length > 0 && (
                  <span className="booking__group is-free">
                    <Icon name="check" size={16} /> Free for your dates:
                    {options.free.map((slug) => (
                      <button key={slug} type="button" className="booking__chip" onClick={() => setStay(slug)}>
                        {nameOf(slug)}
                      </button>
                    ))}
                  </span>
                )}
                {options.unknown.length > 0 && (
                  <span className="booking__group">
                    {options.free.length ? 'We’ll confirm:' : 'Choose a home — we’ll confirm availability:'}
                    {options.unknown.map((slug) => (
                      <button key={slug} type="button" className="booking__chip" onClick={() => setStay(slug)}>
                        {nameOf(slug)}
                      </button>
                    ))}
                  </span>
                )}
              </p>
            ) : (
              <p className="is-booked">Every home is taken on at least one of these nights — try moving your dates.</p>
            )
          ) : null}
        </div>
      )}
      {error && (
        <p className="booking__error" role="alert">
          {error}
        </p>
      )}
      {(waHref || footer || airbnb) && (
        <div className="booking__extra">
          {waHref && (
            <a className="booking__whatsapp" href={waHref} target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={18} />
              Prefer WhatsApp? Send these details
            </a>
          )}
          {airbnb && (
            <a className="booking__airbnb" href={airbnb} target="_blank" rel="noopener noreferrer">
              Book these dates on Airbnb
              <Icon name="arrow-up-right" size={16} />
            </a>
          )}
          {footer}
        </div>
      )}
    </form>
  )
}
