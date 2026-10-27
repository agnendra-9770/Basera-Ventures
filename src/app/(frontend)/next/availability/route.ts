import { getAvailability } from '@/lib/availability'

/**
 * Booked nights for every stay, for the date picker. Only nights are returned —
 * never the calendar links themselves. Cached for 15 minutes at the edge.
 */
export async function GET() {
  try {
    const availability = await getAvailability()
    return Response.json(availability, {
      headers: { 'Cache-Control': 'public, max-age=60, s-maxage=900, stale-while-revalidate=3600' },
    })
  } catch {
    return Response.json({ error: 'Availability is unavailable right now.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
  }
}
