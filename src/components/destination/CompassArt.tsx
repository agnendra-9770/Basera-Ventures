import type { Place } from '@/payload-types'
import { plot, radiusFor, RINGS } from '@/lib/compass'

/** The compass rose drawn as a static illustration (used on the homepage). */
export function CompassArt({ places = [] }: { places?: Pick<Place, 'id' | 'direction' | 'travelMinutes'>[] }) {
  const points = plot(places)
  return (
    <div className="compass-art">
      <svg viewBox="0 0 100 100" role="img" aria-label="A compass showing places near the property by direction and travel time">
        <CompassRings />
        {points.map(({ place, x, y }) => (
          <circle key={place.id} cx={x} cy={y} r="1.1" className="compass-art__dot" />
        ))}
      </svg>
    </div>
  )
}

export function CompassRings() {
  return (
    <g className="compass-rings">
      <circle cx="50" cy="50" r="49.4" className="compass-rings__edge" />
      {RINGS.map((ring) => {
        const r = 50 * radiusFor(ring.minutes)
        return (
          <g key={ring.minutes}>
            <circle cx="50" cy="50" r={r} className="compass-rings__ring" />
            <text x={50 + r * 0.7071 + 0.8} y={50 - r * 0.7071 - 0.8} className="compass-rings__label">
              {ring.label}
            </text>
          </g>
        )
      })}
      <path d="M50 3V97M3 50H97" className="compass-rings__axis" />
      <path d="M16.8 16.8 83.2 83.2M83.2 16.8 16.8 83.2" className="compass-rings__axis compass-rings__axis--minor" />
      {[
        ['N', 50, 7.4],
        ['E', 93.2, 51.2],
        ['S', 50, 95],
        ['W', 6.8, 51.2],
      ].map(([label, x, y]) => (
        <text key={label as string} x={x as number} y={y as number} className="compass-rings__cardinal" textAnchor="middle">
          {label}
        </text>
      ))}
      <g transform="translate(46.4 42.8) scale(0.18)" className="compass-rings__home">
        <path d="M3 51V23.2C3 21.2 3.8 20 5 19.6C6 19.3 6.4 18.4 6.4 17.4C6.4 9.6 12.4 3.6 20 1.5C27.6 3.6 33.6 9.6 33.6 17.4C33.6 18.4 34 19.3 35 19.6C36.2 20 37 21.2 37 23.2V51" />
        <circle cx="20" cy="29" r="3.6" />
      </g>
    </g>
  )
}
