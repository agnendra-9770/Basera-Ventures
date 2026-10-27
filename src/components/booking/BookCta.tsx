import type { ReactNode } from 'react'

import type { Site } from '@/lib/data'
import { inquiryHref } from '@/lib/format'
import { plain } from '@/lib/text'

import { bookingTarget } from '../layout/SiteChrome'
import { Cta } from '../ui/Primitives'
import type { StayOption } from './BookingBar'

/** "Check availability" — to the booking engine when configured, otherwise the inquiry form. */
export function BookCta({
  site,
  stay,
  children,
  variant = 'solid',
  icon,
}: {
  site: Site
  stay?: string | null
  children?: ReactNode
  variant?: 'solid' | 'light' | 'ghost' | 'ghost-light' | 'text'
  icon?: 'arrow-right' | 'calendar'
}) {
  const target = bookingTarget(site)
  const href = target.external ? target.href : inquiryHref({ stay: stay ?? undefined })
  return (
    <Cta href={href} variant={variant} icon={icon} external={target.external}>
      {children ?? target.label}
    </Cta>
  )
}

/** The stays as the booking widgets need them: name, capacity and Airbnb listing. */
export const stayOptions = (site: Site): StayOption[] =>
  site.stays.map((s) => ({
    slug: s.slug ?? '',
    name: plain(s.name),
    maxGuests: s.maxGuests ?? null,
    airbnb: s.bookingLinks?.find((link) => link.platform === 'airbnb' && link.url.startsWith('https://'))?.url ?? null,
  }))

/** Everything the booking widget needs, derived from Site settings. */
export const bookingProps = (site: Site) => {
  const stays = stayOptions(site)
  const intro = plain(site.settings.booking?.whatsappMessage || `Hello! I would like to ask about staying at ${site.brand}`).replace(
    /[.!\s]+$/,
    '',
  )
  return {
    stays,
    mode: site.settings.booking?.mode === 'engine' ? ('engine' as const) : ('inquiry' as const),
    engineUrl: site.settings.booking?.engineUrl ?? null,
    whatsapp: site.whatsapp,
    whatsappIntro: intro,
  }
}
