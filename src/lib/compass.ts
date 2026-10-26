/**
 * Geometry for the destination compass: places are drawn by direction and
 * travel time from the property, not by map coordinates — so it works (and
 * stays honest) before anyone has looked up an exact latitude.
 */

const BEARING: Record<string, number> = { N: -90, NE: -45, E: 0, SE: 45, S: 90, SW: 135, W: 180, NW: -135 }

export const RINGS = [
  { minutes: 10, label: '10 min' },
  { minutes: 30, label: '30 min' },
  { minutes: 60, label: '1 hr' },
  { minutes: 120, label: '2 hr' },
]

/** Distance from the centre as a fraction of the radius (0–1). */
export const radiusFor = (minutes: number) => 0.18 + 0.74 * Math.sqrt(Math.min(Math.max(minutes, 1), 150) / 150)

type Plottable = { direction: string; travelMinutes: number }

/** Percent positions (0–100) for each place, nudging apart places that would overlap. */
export const plot = <T extends Plottable>(places: T[]) => {
  const seen: { angle: number; r: number }[] = []
  return places.map((place) => {
    let angle = BEARING[place.direction] ?? 0
    const r = radiusFor(place.travelMinutes)
    let tries = 0
    while (seen.some((s) => Math.abs(s.angle - angle) < 9 && Math.abs(s.r - r) < 0.09) && tries < 6) {
      tries += 1
      angle += (tries % 2 ? 1 : -1) * 11 * Math.ceil(tries / 2)
    }
    seen.push({ angle, r })
    const rad = (angle * Math.PI) / 180
    return { place, x: 50 + 50 * r * Math.cos(rad), y: 50 + 50 * r * Math.sin(rad) }
  })
}

export const travelLabel = (minutes: number) =>
  minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)} hr${minutes % 60 ? ` ${minutes % 60} min` : ''}`
