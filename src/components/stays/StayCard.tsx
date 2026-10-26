import Link from 'next/link'

import type { Stay } from '@/payload-types'
import type { Site } from '@/lib/data'
import { priceLine, stayFacts, stayTypeLabel } from '@/lib/stays'
import { Tx } from '@/lib/text'

import { Frame } from '../media/Img'
import { Icon } from '../ui/Icon'
import { RatingLine } from './Rating'

export function Facts({ stay, showMissing, className }: { stay: Stay; showMissing: boolean; className?: string }) {
  const facts = stayFacts(stay, showMissing)
  if (!facts.length) return null
  return (
    <ul className={['facts', className].filter(Boolean).join(' ')}>
      {facts.map((fact) => (
        <li key={fact.label}>
          <Icon name={fact.icon} size={18} />
          <span>
            <Tx>{fact.label}</Tx>
          </span>
        </li>
      ))}
    </ul>
  )
}

export function StayCard({ stay, site, index = 0 }: { stay: Stay; site: Site; index?: number }) {
  const price = priceLine(stay, site.settings.booking?.currency ?? 'INR')
  const href = `/stays/${stay.slug}`
  return (
    <article className="stay-card" data-reveal style={{ ['--d' as string]: index }}>
      <Link href={href} className="stay-card__media" tabIndex={-1} aria-hidden="true">
        <Frame media={stay.heroImage} ratio="4x5" arch sizes="(min-width: 1000px) 40vw, (min-width: 640px) 50vw, 100vw" reveal={false} />
      </Link>
      <div className="stay-card__body">
        <p className="label">{stayTypeLabel(stay)}</p>
        <h3 className="display-s">
          <Link href={href} className="stay-card__title">
            <Tx>{stay.name}</Tx>
          </Link>
        </h3>
        {stay.tagline && (
          <p className="caption">
            <Tx>{stay.tagline}</Tx>
          </p>
        )}
        <RatingLine stay={stay} />
        <Facts stay={stay} showMissing={!site.isLive} />
        <div className="stay-card__foot">
          {price ? (
            <p className="stay-card__price">
              From <strong>{price.amount}</strong> a {price.unit}
            </p>
          ) : (
            <p className="stay-card__price stay-card__price--ask">Rates on request</p>
          )}
          <Link href={href} className="link-arrow">
            <span>Explore</span>
            <Icon name="arrow-right" size={16} />
          </Link>
        </div>
      </div>
    </article>
  )
}
