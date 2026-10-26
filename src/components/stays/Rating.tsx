import type { Stay } from '@/payload-types'
import { formatDate, platformLabel } from '@/lib/format'

export const formatScore = (score: number) => score.toFixed(Number.isInteger(score * 10) ? 1 : 2)

/** The platform URL for this stay's rating, so every rating links to its source. */
const sourceUrl = (stay: Stay) => {
  const platform = stay.rating?.platform ?? 'airbnb'
  return stay.bookingLinks?.find((link) => link.platform === platform)?.url
}

/**
 * "★ 5.0 · 54 reviews on Airbnb" — copied from the platform and linked to it.
 * Never presented as the site's own rating, and never added to search markup.
 */
export function RatingLine({ stay, withBadge = true, withDate = false }: { stay: Stay; withBadge?: boolean; withDate?: boolean }) {
  const r = stay.rating
  if (!r?.score || !r.count) return null
  const url = sourceUrl(stay)
  const platform = platformLabel(r.platform ?? 'airbnb')
  const content = (
    <>
      <span className="rating__star" aria-hidden="true">
        ★
      </span>
      <span className="rating__text">
        {formatScore(r.score)} · {r.count} review{r.count === 1 ? '' : 's'} on {platform}
        {withDate && r.checkedOn ? ` (checked ${formatDate(r.checkedOn, 'short')})` : ''}
      </span>
      {withBadge && r.badge && <span className="rating__badge">{r.badge}</span>}
    </>
  )
  return url ? (
    <a className="rating" href={url} target="_blank" rel="noopener noreferrer" title={`Read the reviews on ${platform}`}>
      {content}
    </a>
  ) : (
    <span className="rating">{content}</span>
  )
}
