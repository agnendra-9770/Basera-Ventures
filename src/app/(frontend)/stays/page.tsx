import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { BookCta } from '@/components/booking/BookCta'
import { Frame } from '@/components/media/Img'
import { RatingLine } from '@/components/stays/Rating'
import { Facts } from '@/components/stays/StayCard'
import { PageHead } from '@/components/ui/PageHead'
import { Cta, JsonLd, SetupNote } from '@/components/ui/Primitives'
import { getPages, getSite, getStays } from '@/lib/data'
import { breadcrumbSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { priceLine, stayTypeLabel } from '@/lib/stays'
import { plain, Tx } from '@/lib/text'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const [site, pages] = await Promise.all([getSite(), getPages()])
  const p = pages.stays
  return pageMetadata(site, {
    path: '/stays',
    title: `Stays at ${site.brand} — ${site.settings.propertyType} in ${site.settings.location}`,
    description: p?.intro,
    seo: p?.seo,
    image: p?.image,
  })
}

export default async function StaysPage() {
  const [site, pages, stays] = await Promise.all([getSite(), getPages(), getStays()])
  if (stays.length === 1 && stays[0].slug) redirect(`/stays/${stays[0].slug}`)

  const p = pages.stays
  const trail = [
    { name: 'Home', path: '/' },
    { name: 'Our stays', path: '/stays' },
  ]
  const currency = site.settings.booking?.currency ?? 'INR'
  const list = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: stays.map((stay, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${site.url}/stays/${stay.slug}`,
      name: plain(stay.name),
    })),
  }

  return (
    <>
      <JsonLd data={[breadcrumbSchema(site, trail), stays.length ? list : null]} />
      <PageHead
        trail={trail}
        eyebrow={p?.eyebrow ?? 'Our stays'}
        heading={p?.heading ?? 'Rooms for *staying in*'}
        intro={p?.intro}
      />
      <section className="section section--flush-top">
        <div className="container">
          {stays.length === 0 ? (
            !site.isLive && (
              <SetupNote title="No stays yet" href="/admin/collections/stays/create" action="Add your first stay">
                <p>Each studio, room or villa becomes its own page with photographs, amenities, policies and a booking form.</p>
              </SetupNote>
            )
          ) : (
            <ol className="stays-list">
              {stays.map((stay) => {
                const href = `/stays/${stay.slug}`
                const price = priceLine(stay, currency)
                return (
                  <li key={stay.id} className="stay-row">
                    <div className="stay-row__media">
                      <Link href={href} tabIndex={-1} aria-hidden="true">
                        <Frame media={stay.heroImage} ratio="4x5" arch sizes="(min-width: 900px) 48vw, 100vw" label={stay.name} />
                      </Link>
                    </div>
                    <div className="stay-row__body" data-reveal>
                      <p className="label">
                        {stayTypeLabel(stay)}
                        {stay.maxGuests ? ` · Sleeps ${stay.maxGuests}` : ''}
                      </p>
                      <h2 className="display-m">
                        <Link href={href} className="stay-card__title">
                          <Tx>{stay.name}</Tx>
                        </Link>
                      </h2>
                      {stay.tagline && (
                        <p className="caption">
                          <Tx>{stay.tagline}</Tx>
                        </p>
                      )}
                      <RatingLine stay={stay} />
                      <p className="text-soft">
                        <Tx>{stay.summary}</Tx>
                      </p>
                      <Facts stay={stay} showMissing={!site.isLive} />
                      <div className="stay-row__actions">
                        <Cta href={href} icon="arrow-right">
                          Explore the stay
                        </Cta>
                        <BookCta site={site} stay={stay.slug} variant="ghost" />
                        <p className="stay-card__price">
                          {price ? (
                            <>
                              From <strong>{price.amount}</strong> a {price.unit}
                            </>
                          ) : (
                            'Rates on request'
                          )}
                        </p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>
          )}
        </div>
      </section>
    </>
  )
}
