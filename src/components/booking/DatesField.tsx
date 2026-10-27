'use client'

import { useEffect, useRef, useState } from 'react'

import { cx } from '@/lib/cx'
import { type Day, daysBetween, formatMedium, formatShort, nightsLabel } from '@/lib/dates'

import { Icon } from '../ui/Icon'
import { type Calendar, rangeStatus } from './availability'
import { DateRangePicker, type Range } from './DateRangePicker'

type Props = {
  value: Range
  onChange: (range: Range) => void
  calendar: Calendar
  loading: boolean
  today: Day
  idPrefix: string
  /** "bar": two cells of the booking bar. "form": two boxes in the inquiry form. */
  variant: 'bar' | 'form'
  stayName?: string
  errors?: { start?: string; end?: string }
}

const useNarrow = () => {
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(max-width: 719px)')
    const update = () => setNarrow(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return narrow
}

/**
 * Check-in and check-out boxes that open the calendar: a panel under the booking bar
 * on larger screens, a full-screen sheet with scrolling months on phones.
 */
export function DatesField({ value, onChange, calendar, loading, today, idPrefix, variant, stayName, errors }: Props) {
  const [open, setOpen] = useState(false)
  const narrow = useNarrow()
  const panel = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const wrap = useRef<HTMLDivElement>(null)
  const active = !value.start || value.end ? 'start' : 'end'

  const close = (refocus = true) => {
    setOpen(false)
    if (refocus) trigger.current?.focus()
  }

  // Focus the calendar on open; close on Escape or (larger screens) a click elsewhere.
  useEffect(() => {
    if (!open) return
    requestAnimationFrame(() => panel.current?.querySelector<HTMLButtonElement>('[data-day][tabindex="0"]')?.focus())
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && close()
    const onPointer = (event: PointerEvent) => {
      if (!narrow && !wrap.current?.contains(event.target as Node)) close(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    if (narrow) document.documentElement.classList.add('sheet-open')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
      document.documentElement.classList.remove('sheet-open')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, narrow])

  const change = (range: Range) => {
    onChange(range)
    // Like Airbnb: the panel closes once both dates are in; on phones the guest taps Save.
    if (range.start && range.end && !narrow) close()
  }

  const nights = value.start && value.end ? daysBetween(value.start, value.end) : 0
  const status = value.start && value.end && !loading ? rangeStatus(calendar, value.start, value.end) : null
  const titleId = `${idPrefix}-dates-title`

  const heading = nights
    ? `${nightsLabel(nights)}${stayName ? ` in ${stayName}` : ''}`
    : value.start
      ? 'Select your check-out date'
      : 'Select your check-in date'
  const sub = nights
    ? `${formatShort(value.start!)} – ${formatShort(value.end!)}`
    : calendar.minNights > 1
      ? `Minimum stay: ${nightsLabel(calendar.minNights)}`
      : value.start
        ? `Check-in ${formatMedium(value.start)}`
        : 'Add your travel dates to see what’s free'

  const box = (which: 'start' | 'end') => {
    const day = which === 'start' ? value.start : value.end
    const label = which === 'start' ? 'Check-in' : 'Check-out'
    const error = errors?.[which]
    return (
      <div className={cx(variant === 'bar' ? 'booking__field' : 'dates__box', open && active === which && 'is-active', error && 'is-invalid')}>
        <span className={variant === 'bar' ? 'booking__label' : 'dates__label'} id={`${idPrefix}-${which}-label`}>
          {label}
        </span>
        <button
          ref={which === 'start' ? trigger : undefined}
          type="button"
          className={cx(variant === 'bar' ? 'booking__input booking__toggle' : 'dates__value', !day && 'is-empty')}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-labelledby={`${idPrefix}-${which}-label ${idPrefix}-${which}-value`}
          aria-describedby={error ? `${idPrefix}-${which}-error` : undefined}
          onClick={() => setOpen(true)}
        >
          <span id={`${idPrefix}-${which}-value`}>{day ? formatMedium(day) : 'Add date'}</span>
          {variant === 'bar' && <Icon name="calendar" size={16} />}
        </button>
        {error && (
          <p className="field__error" id={`${idPrefix}-${which}-error`}>
            {error}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className={cx('dates', `dates--${variant}`)} ref={wrap}>
      {box('start')}
      {box('end')}
      {open && (
        <div
          className={cx('dates__panel', narrow && 'is-sheet')}
          ref={panel}
          role="dialog"
          aria-modal={narrow || undefined}
          aria-labelledby={titleId}
        >
          <div className="dates__head">
            <div>
              <h2 className="dates__title" id={titleId}>
                {heading}
              </h2>
              <p className="dates__sub">{sub}</p>
            </div>
            {narrow && (
              <button type="button" className="dates__close" onClick={() => close()} aria-label="Close">
                <Icon name="close" size={22} />
              </button>
            )}
          </div>
          {loading ? (
            <p className="dates__loading" role="status">
              Checking availability…
            </p>
          ) : (
            <DateRangePicker value={value} onChange={change} calendar={calendar} today={today} layout={narrow ? 'column' : 'pair'} />
          )}
          <div className="dates__foot">
            <p className={cx('dates__status', status && `is-${status}`)} role="status">
              {status === 'free' && (
                <>
                  <Icon name="check" size={16} /> These dates are available
                </>
              )}
              {status === 'unknown' && 'We’ll confirm these dates personally when we reply.'}
              {!status && calendar.synced && 'Live availability — booked nights are struck through.'}
              {!status && !calendar.synced && !loading && 'Struck-through nights are already taken.'}
            </p>
            <div className="dates__actions">
              <button
                type="button"
                className="dates__clear"
                onClick={() => onChange({ start: null, end: null })}
                disabled={!value.start}
              >
                Clear dates
              </button>
              <button type="button" className="btn btn--solid btn--sm" onClick={() => close()}>
                {narrow && value.end ? 'Save' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
