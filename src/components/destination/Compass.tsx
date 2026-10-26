'use client'

import { type KeyboardEvent, useState } from 'react'

import { type IconName, labelFor, PLACE_CATEGORIES, TRAVEL_MODES } from '@/lib/constants'
import { plot, travelLabel } from '@/lib/compass'
import { cx } from '@/lib/cx'
import { Tx } from '@/lib/text'

import { Frame } from '../media/Img'
import { Icon } from '../ui/Icon'
import { CompassRings } from './CompassArt'

export type CompassPlace = {
  id: number
  name: string
  category: string
  description?: string | null
  tip?: string | null
  direction: string
  travelMinutes: number
  mode?: string | null
  distanceKm?: number | null
  mapsUrl?: string | null
  image?: unknown
}

const modeIcon: Record<string, IconName> = { walk: 'walk', car: 'car', auto: 'car', train: 'train', plane: 'plane' }

/** Places plotted by direction and travel time from the front door. */
export function Compass({ places }: { places: CompassPlace[] }) {
  const [filter, setFilter] = useState('all')
  const [activeId, setActiveId] = useState<number | null>(places[0]?.id ?? null)

  const categories = PLACE_CATEGORIES.filter((c) => places.some((p) => p.category === c.value))
  const shown = filter === 'all' ? places : places.filter((p) => p.category === filter)
  const active = shown.find((p) => p.id === activeId) ?? shown[0] ?? null
  const points = plot(shown)

  const onKey = (event: KeyboardEvent, id: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setActiveId(id)
    }
  }

  return (
    <div className="compass">
      <div className="compass__map">
        <svg viewBox="0 0 100 100" role="group" aria-label="Places near the property, plotted by direction and travel time">
          <CompassRings />
          {points.map(({ place, x, y }) => (
            <g
              key={place.id}
              className={cx('compass__pin', active?.id === place.id && 'is-active')}
              role="button"
              tabIndex={0}
              aria-pressed={active?.id === place.id}
              aria-label={`${place.name}, ${travelLabel(place.travelMinutes)} ${place.direction}`}
              onClick={() => setActiveId(place.id)}
              onKeyDown={(event) => onKey(event, place.id)}
            >
              <circle cx={x} cy={y} r="1.4" />
              <text x={x + 2.3} y={y + 0.9}>
                {place.name.length > 22 ? `${place.name.slice(0, 21)}…` : place.name}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="compass__panel">
        {categories.length > 1 && (
          <div className="chips compass__filters" role="group" aria-label="Filter places">
            <button type="button" className="chip" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>
              All
            </button>
            {categories.map((c) => (
              <button key={c.value} type="button" className="chip" aria-pressed={filter === c.value} onClick={() => setFilter(c.value)}>
                {c.label}
              </button>
            ))}
          </div>
        )}

        {active && (
          <article className="place-card" aria-live="polite">
            {active.image ? <Frame media={active.image} ratio="3x2" sizes="(min-width: 900px) 40vw, 100vw" reveal={false} /> : null}
            <p className="label">{labelFor(PLACE_CATEGORIES, active.category)}</p>
            <h3 className="display-s">
              <Tx>{active.name}</Tx>
            </h3>
            <div className="place-card__meta">
              <span>
                <Icon name={modeIcon[active.mode ?? 'car'] ?? 'car'} size={16} />
                {travelLabel(active.travelMinutes)} {labelFor(TRAVEL_MODES, active.mode).toLowerCase()}
              </span>
              {active.distanceKm ? <span>{active.distanceKm} km</span> : null}
              <span>
                <Icon name="compass" size={16} />
                {active.direction} of us
              </span>
            </div>
            {active.description && (
              <p className="text-soft">
                <Tx>{active.description}</Tx>
              </p>
            )}
            {active.tip && (
              <p className="place-card__tip">
                <Tx>{active.tip}</Tx>
              </p>
            )}
            {active.mapsUrl && (
              <a className="link-arrow" href={active.mapsUrl} target="_blank" rel="noopener noreferrer">
                <span>Open in Google Maps</span>
                <Icon name="arrow-up-right" size={16} />
              </a>
            )}
          </article>
        )}

        <ul className="place-list">
          {shown.map((place) => (
            <li key={place.id}>
              <button
                type="button"
                className={cx(active?.id === place.id && 'is-active')}
                onClick={() => setActiveId(place.id)}
                aria-current={active?.id === place.id ? 'true' : undefined}
              >
                <span>
                  <Tx>{place.name}</Tx>
                </span>
                <small>{travelLabel(place.travelMinutes)}</small>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
