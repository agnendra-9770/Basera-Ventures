'use client'

import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'

import { cx } from '@/lib/cx'
import { addDays, addMonths, type Day, daysBetween, formatLong, formatMonth, monthGrid, monthOf } from '@/lib/dates'

import { Icon } from '../ui/Icon'
import type { Calendar } from './availability'

export type Range = { start: Day | null; end: Day | null }

type Props = {
  value: Range
  onChange: (range: Range) => void
  calendar: Calendar
  today: Day
  /** Two months side by side with arrows, or a scrolling column of months (phones). */
  layout: 'pair' | 'column'
  /** How many months ahead guests can book. */
  horizonMonths?: number
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/**
 * An Airbnb-style range calendar. Booked nights are struck through; a day whose night is
 * booked but whose previous night is free can still be a check-out day. Once a check-in is
 * picked, every check-out beyond the next booked night (or outside the minimum/maximum
 * stay) is disabled, so a guest can never choose dates that don't work.
 */
export function DateRangePicker({ value, onChange, calendar, today, layout, horizonMonths = 18 }: Props) {
  const firstMonth = monthOf(today)
  const lastMonth = addMonths(firstMonth, horizonMonths - 1)
  const lastDay = addDays(`${addMonths(lastMonth, 1)}-01`, -1)
  const [month, setMonth] = useState(() => (value.start ? monthOf(value.start) : firstMonth))
  const [hover, setHover] = useState<Day | null>(null)
  const [focus, setFocus] = useState<Day>(() => value.start ?? today)
  const grid = useRef<HTMLDivElement>(null)
  const moved = useRef(false)

  const { booked, minNights, maxNights } = calendar
  const free = (night: Day) => !booked.has(night)

  /** A check-in needs its first `minNights` nights free. */
  const canStart = (day: Day) => {
    if (day < today || day > lastDay) return false
    for (let i = 0; i < minNights; i++) if (!free(addDays(day, i))) return false
    return true
  }

  /** The latest possible check-out after `start`: the next booked night, or the maximum stay. */
  const lastEnd = useMemo(() => {
    if (!value.start || value.end) return null
    let end = addDays(value.start, 1)
    const limit = maxNights ? addDays(value.start, maxNights) : addDays(lastDay, 1)
    while (end < limit && free(end)) end = addDays(end, 1)
    return end
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.start, value.end, booked, maxNights, lastDay])

  const canEnd = (day: Day) =>
    Boolean(value.start && lastEnd && day > value.start && day <= lastEnd && daysBetween(value.start, day) >= minNights)

  const choosingEnd = Boolean(value.start && !value.end)
  // While choosing a check-out, later dates past the next booked night are greyed out (as on
  // Airbnb); earlier dates stay open so the check-in can still be moved.
  const selectable = (day: Day) =>
    choosingEnd ? canEnd(day) || (day < value.start! && canStart(day)) : canStart(day)

  const pick = (day: Day) => {
    if (choosingEnd && canEnd(day)) onChange({ start: value.start, end: day })
    else if (selectable(day)) onChange({ start: day, end: null })
  }

  const rangeEnd = value.end ?? (choosingEnd && hover && canEnd(hover) ? hover : null)

  const describe = (day: Day) => {
    const parts = [formatLong(day)]
    if (day === value.start) parts.push('your check-in')
    else if (day === value.end) parts.push('your check-out')
    if (day < today) parts.push('in the past')
    else if (choosingEnd) {
      if (canEnd(day)) parts.push(`check out here, ${daysBetween(value.start!, day)} nights`)
      else if (day < value.start! && canStart(day)) parts.push('choose as new check-in')
      else if (day > value.start!) parts.push('not available with this check-in')
      else parts.push('not available')
    } else if (!free(day)) parts.push(free(addDays(day, -1)) ? 'check-out only' : 'booked')
    else if (!canStart(day)) parts.push(`not available for a ${minNights}-night minimum stay`)
    else parts.push('available')
    return parts.join(', ')
  }

  // Keep the keyboard focus inside the months on screen.
  const visible = layout === 'pair' ? [month, addMonths(month, 1)] : Array.from({ length: horizonMonths }, (_, i) => addMonths(firstMonth, i))
  useEffect(() => {
    if (!moved.current) return
    moved.current = false
    grid.current?.querySelector<HTMLButtonElement>(`[data-day="${focus}"]`)?.focus()
  }, [focus, month])

  const onKey = (event: KeyboardEvent<HTMLButtonElement>, day: Day) => {
    const step: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
    let next: Day | null = null
    if (event.key in step) next = addDays(day, step[event.key])
    else if (event.key === 'PageUp') next = addDays(day, -28)
    else if (event.key === 'PageDown') next = addDays(day, 28)
    else if (event.key === 'Home') next = addDays(day, -new Date(`${day}T12:00:00Z`).getUTCDay())
    else if (event.key === 'End') next = addDays(day, 6 - new Date(`${day}T12:00:00Z`).getUTCDay())
    if (!next) return
    event.preventDefault()
    if (next < `${firstMonth}-01`) next = `${firstMonth}-01`
    if (next > lastDay) next = lastDay
    if (layout === 'pair') {
      if (monthOf(next) < month) setMonth(monthOf(next))
      else if (monthOf(next) > addMonths(month, 1)) setMonth(addMonths(monthOf(next), -1))
    }
    moved.current = true
    setFocus(next)
    if (choosingEnd) setHover(next)
  }

  const focusable = visible.some((m) => monthOf(focus) === m) ? focus : `${visible[0]}-01`

  return (
    <div className={cx('calendar', `calendar--${layout}`)} ref={grid} onMouseLeave={() => setHover(null)}>
      {layout === 'pair' && (
        <div className="calendar__nav">
          <button
            type="button"
            className="calendar__arrow"
            onClick={() => setMonth(addMonths(month, -1))}
            disabled={month <= firstMonth}
            aria-label="Previous month"
          >
            <Icon name="arrow-left" size={18} />
          </button>
          <button
            type="button"
            className="calendar__arrow"
            onClick={() => setMonth(addMonths(month, 1))}
            disabled={addMonths(month, 1) >= lastMonth}
            aria-label="Next month"
          >
            <Icon name="arrow-right" size={18} />
          </button>
        </div>
      )}
      <div className="calendar__months">
        {visible.map((m) => (
          <div className="calendar__month" key={m}>
            <h3 className="calendar__title" id={`cal-${m}`}>
              {formatMonth(m)}
            </h3>
            <table className="calendar__grid" role="grid" aria-labelledby={`cal-${m}`}>
              <thead>
                <tr>
                  {WEEKDAYS.map((d, i) => (
                    <th key={d} scope="col" abbr={WEEKDAY_NAMES[i]}>
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monthGrid(m).map((week, w) => (
                  <tr key={w}>
                    {week.map((day, i) => {
                      if (!day) return <td key={i} aria-hidden="true" />
                      const isStart = day === value.start
                      const isEnd = day === value.end
                      const inRange = Boolean(value.start && rangeEnd && day > value.start && day < rangeEnd)
                      const isPast = day < today
                      const checkoutOnly = !choosingEnd && !isPast && !free(day) && free(addDays(day, -1))
                      const disabled = !selectable(day) && !isStart && !isEnd
                      return (
                        <td
                          key={day}
                          className={cx(
                            'calendar__cell',
                            inRange && 'is-range',
                            (isStart || (value.start && day === rangeEnd)) && rangeEnd && value.start !== rangeEnd && (isStart ? 'is-range-start' : 'is-range-end'),
                          )}
                        >
                          <button
                            type="button"
                            data-day={day}
                            className={cx(
                              'calendar__day',
                              (isStart || isEnd) && 'is-selected',
                              day === rangeEnd && !isEnd && 'is-preview',
                              disabled && 'is-disabled',
                              !isPast && booked.has(day) && !checkoutOnly && disabled && 'is-booked',
                              checkoutOnly && 'is-checkout-only',
                              day === today && 'is-today',
                            )}
                            tabIndex={day === focusable ? 0 : -1}
                            aria-disabled={disabled || undefined}
                            aria-pressed={isStart || isEnd || undefined}
                            aria-label={describe(day)}
                            title={checkoutOnly ? 'Check-out only' : undefined}
                            onClick={() => !disabled && pick(day)}
                            onMouseEnter={() => choosingEnd && setHover(day)}
                            onFocus={() => {
                              setFocus(day)
                              if (choosingEnd) setHover(day)
                            }}
                            onKeyDown={(event) => {
                              if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
                                event.preventDefault()
                                pick(day)
                              } else onKey(event, day)
                            }}
                          >
                            {Number(day.slice(8))}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  )
}
