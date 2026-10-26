'use client'

import { useRouter } from 'next/navigation'
import { type ReactNode, useEffect, useId, useRef, useState } from 'react'

import { cx } from '@/lib/cx'
import { describeTrip, fillEngineUrl, inquiryHref, whatsappHref } from '@/lib/format'

import { Icon } from '../ui/Icon'

export type StayOption = { slug: string; name: string }

const isoDay = (date: Date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 10)
}
const addDays = (iso: string, days: number) => {
  const d = new Date(`${iso}T12:00:00`)
  d.setDate(d.getDate() + days)
  return isoDay(d)
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
 * Dates, guests and (when there is a choice) the stay. Sends guests to the
 * booking engine if one is configured, otherwise to the inquiry form with
 * everything filled in. It never pretends a booking has been made.
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
  const [arrival, setArrival] = useState('')
  const [departure, setDeparture] = useState('')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [stay, setStay] = useState(defaultStay ?? '')
  const [error, setError] = useState('')
  const [guestsOpen, setGuestsOpen] = useState(false)
  const guestsRef = useRef<HTMLDivElement>(null)

  // Dates depend on the visitor's own clock, so they are set after hydration.
  useEffect(() => setToday(isoDay(new Date())), [])

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

  const onArrival = (value: string) => {
    setArrival(value)
    setError('')
    if (value && (!departure || departure <= value)) setDeparture(addDays(value, 1))
  }

  const query = { arrival, departure, adults, children, stay }
  const stayName = stays.find((s) => s.slug === stay)?.name

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (arrival && departure && departure <= arrival) {
      setError('Your departure date needs to be after your arrival.')
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

  return (
    <form className={cx('booking', `booking--${variant}`)} onSubmit={submit} aria-label="Check availability" noValidate>
      <div className="booking__fields">
        <div className="booking__field">
          <label className="booking__label" htmlFor={`${id}-arrival`}>
            Arrival
          </label>
          <input
            id={`${id}-arrival`}
            className="booking__input"
            type="date"
            min={today || undefined}
            value={arrival}
            onChange={(e) => onArrival(e.target.value)}
          />
        </div>
        <div className="booking__field">
          <label className="booking__label" htmlFor={`${id}-departure`}>
            Departure
          </label>
          <input
            id={`${id}-departure`}
            className="booking__input"
            type="date"
            min={arrival ? addDays(arrival, 1) : today ? addDays(today, 1) : undefined}
            value={departure}
            onChange={(e) => {
              setDeparture(e.target.value)
              setError('')
            }}
          />
        </div>
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
              <Stepper label="Adults" value={adults} min={1} max={16} onChange={setAdults} />
              <Stepper label="Children" hint="Under 12" value={children} min={0} max={10} onChange={setChildren} />
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
              onChange={(e) => setStay(e.target.value)}
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
      {error && (
        <p className="booking__error" role="alert">
          {error}
        </p>
      )}
      {(waHref || footer) && (
        <div className="booking__extra">
          {waHref && (
            <a className="booking__whatsapp" href={waHref} target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={18} />
              Prefer WhatsApp? Send these details
            </a>
          )}
          {footer}
        </div>
      )}
    </form>
  )
}
