import type { Metadata } from 'next'

import { Compass, type CompassPlace } from '@/components/destination/Compass'
import { PostCard } from '@/components/home/Sections'
import { Icon } from '@/components/ui/Icon'
import { PageHead } from '@/components/ui/PageHead'
import { Cta, JsonLd, SectionHead } from '@/components/ui/Primitives'
import { SetupNote } from '@/components/ui/SetupNote'
import type { IconName } from '@/lib/constants'
import { getDestinationPage, getJournal, getPlaces, getSite } from '@/lib/data'
import { real } from '@/lib/placeholders'
import { breadcrumbSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { Tx } from '@/lib/text'

export const revalidate = 3600

const routeIcon: Record<string, IconName> = { plane: 'plane', train: 'train', car: 'car', walk: 'walk' }

export async function generateMetadata(): Promise<Metadata> {
  const [site, page] = await Promise.all([getSite(), getDestinationPage()])
  return pageMetadata(site, {
    path: '/destination',
    title: `${site.settings.location} travel guide — getting here, seasons and places nearby`,
    description: page.hero?.intro,
    seo: page.seo,
    image: page.hero?.image,
  })
}

export default async function DestinationPage() {
  const [site, page, places, guides] = await Promise.all([getSite(), getDestinationPage(), getPlaces(), getJournal('guide', 6)])
  const trail = [
    { name: 'Home', path: '/' },
    { name: 'Destination', path: '/destination' },
  ]
  const { hero, gettingHere, explorer, seasons, practical } = page
  const compassPlaces: CompassPlace[] = places.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    description: p.description,
    tip: p.tip,
    direction: p.direction,
    travelMinutes: p.travelMinutes,
    mode: p.mode,
    distanceKm: p.distanceKm,
    mapsUrl: p.mapsUrl,
    image: p.image,
  }))
  const embed = real(site.settings.mapEmbedUrl)
  const mapOk = embed?.startsWith('https://www.google.com/maps/embed')
  const a = site.settings.address
  const addressLine = [a?.street, a?.locality, a?.city, a?.region, a?.postalCode].filter((v) => real(v)).join(', ')

  return (
    <>
      <JsonLd data={breadcrumbSchema(site, trail)} />
      <PageHead
        trail={trail}
        eyebrow={hero?.eyebrow ?? 'Destination guide'}
        heading={hero?.heading ?? `Around *${site.settings.location}*`}
        intro={hero?.intro}
        image={hero?.image}
      />

      <section className="section section--flush-top" id="getting-here">
        <div className="container">
          <SectionHead eyebrow={gettingHere?.eyebrow} heading={gettingHere?.heading} intro={gettingHere?.intro} layout="split" size="m" />
          {(gettingHere?.routes?.length ?? 0) > 0 ? (
            <ul className="routes">
              {gettingHere!.routes!.map((route, i) => (
                <li key={route.id ?? route.title} className="route" data-reveal style={{ ['--d' as string]: i }}>
                  <Icon name={routeIcon[route.mode] ?? 'compass'} size={26} className="route__icon" />
                  <h3>
                    <Tx>{route.title}</Tx>
                  </h3>
                  <p>
                    <Tx>{route.text}</Tx>
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            !site.isLive && (
              <SetupNote title="Add directions" href="/admin/globals/destination" action="Open the destination guide">
                <p>By air, by rail, by road — and how guests get around once they arrive.</p>
              </SetupNote>
            )
          )}
        </div>
      </section>

      <section className="section section--linen" id="nearby">
        <div className="container">
          <SectionHead eyebrow={explorer?.eyebrow ?? 'The compass'} heading={explorer?.heading ?? 'What’s *near*'} intro={explorer?.intro} layout="split" size="m" />
          {compassPlaces.length > 0 ? (
            <Compass places={compassPlaces} />
          ) : (
            !site.isLive && (
              <SetupNote title="Plot the places you recommend" href="/admin/collections/places/create" action="Add a place">
                <p>
                  Each place needs only a name, a rough direction and a travel time. They appear on the compass and on the
                  homepage.
                </p>
              </SetupNote>
            )
          )}
        </div>
      </section>

      {(seasons?.items?.length ?? 0) > 0 && (
        <section className="section" id="when-to-come">
          <div className="container">
            <SectionHead eyebrow={seasons?.eyebrow} heading={seasons?.heading} intro={seasons?.intro} layout="split" size="m" />
            <ul className="seasons">
              {seasons!.items!.map((season, i) => (
                <li key={season.id ?? season.title} className="season" data-reveal style={{ ['--d' as string]: i }}>
                  <span className="season__months">
                    <Tx>{season.months}</Tx>
                  </span>
                  <h3>
                    <Tx>{season.title}</Tx>
                  </h3>
                  {season.text && (
                    <p>
                      <Tx>{season.text}</Tx>
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {(practical?.items?.length ?? 0) > 0 && (
        <section className="section section--flush-top" id="good-to-know">
          <div className="container">
            <SectionHead eyebrow="Practical" heading={practical?.heading ?? 'Good to know'} size="m" />
            <ul className="notes">
              {practical!.items!.map((item) => (
                <li key={item.id ?? item.title}>
                  <h3>
                    <Tx>{item.title}</Tx>
                  </h3>
                  <p>
                    <Tx>{item.text}</Tx>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {(mapOk || addressLine) && (
        <section className="section section--flush-top" id="where">
          <div className="container">
            <SectionHead eyebrow="Where we are" heading="Find *the door*" size="m" intro={addressLine || undefined}>
              {real(site.settings.mapsUrl) && (
                <Cta href={site.settings.mapsUrl!} variant="text" icon="arrow-up-right">
                  Directions in Google Maps
                </Cta>
              )}
            </SectionHead>
            {mapOk && (
              <div className="map-embed">
                <iframe src={embed} title={`Map showing ${site.brand}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
              </div>
            )}
          </div>
        </section>
      )}

      {guides.length > 0 && (
        <section className="section section--sage">
          <div className="container">
            <SectionHead eyebrow="Guides" heading="Read before *you come*" layout="split" size="m">
              <Cta href="/journal" variant="text" icon="arrow-right">
                The whole journal
              </Cta>
            </SectionHead>
            <div className="post-grid">
              {guides.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
