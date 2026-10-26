import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BookingBar } from '@/components/booking/BookingBar'
import { Gallery } from '@/components/gallery/Gallery'
import { bookingProps } from '@/components/booking/BookCta'
import { Frame } from '@/components/media/Img'
import { RichText } from '@/components/RichText'
import { RatingLine } from '@/components/stays/Rating'
import { Facts, StayCard } from '@/components/stays/StayCard'
import { Icon } from '@/components/ui/Icon'
import { Breadcrumbs, Cta, JsonLd, SectionHead } from '@/components/ui/Primitives'
import { getPayloadClient, getSite, getStay, getStays } from '@/lib/data'
import { platformLabel } from '@/lib/format'
import { asMedia, asMediaList, mediaSrc } from '@/lib/media'
import { real } from '@/lib/placeholders'
import { breadcrumbSchema, faqSchema, staySchema, vacationRentalSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { amenitiesOf, groupAmenities, priceLine, stayTypeLabel } from '@/lib/stays'
import { plain, Tx } from '@/lib/text'

export const revalidate = 3600

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'stays',
    draft: false,
    limit: 100,
    pagination: false,
    overrideAccess: false,
    select: { slug: true },
  })
  return result.docs.filter((d) => d.slug).map((d) => ({ slug: d.slug as string }))
}

type Args = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const [site, stay] = await Promise.all([getSite(), getStay(decodeURIComponent(slug))])
  if (!stay) return {}
  return pageMetadata(site, {
    path: `/stays/${stay.slug}`,
    title: `${stay.name} — ${stayTypeLabel(stay).toLowerCase()} in ${site.settings.location}`,
    description: stay.summary,
    seo: stay.seo,
    image: stay.heroImage,
  })
}

export default async function StayPage({ params }: Args) {
  const { slug } = await params
  const [site, stay, allStays] = await Promise.all([getSite(), getStay(decodeURIComponent(slug)), getStays()])
  if (!stay) notFound()

  const s = site.settings
  const gallery = asMediaList(stay.gallery)
  const hero = asMedia(stay.heroImage) ?? gallery[0] ?? null
  const side = gallery.filter((m) => m.id !== hero?.id).slice(0, 2)
  const video = asMedia(stay.video)
  const poster = video ? asMedia(video.poster) : null

  const own = amenitiesOf(stay)
  const groups = groupAmenities(own.filter((a) => !a.shared))
  const shared = own.filter((a) => a.shared)

  const policies = s.policies
  const checkIn = stay.checkIn || policies?.checkIn
  const checkOut = stay.checkOut || policies?.checkOut
  const cancellation = stay.cancellation || policies?.cancellation
  const rules = stay.houseRules?.length ? stay.houseRules : (policies?.houseRules ?? [])
  const policyRows = [
    { label: 'Check-in from', value: checkIn },
    { label: 'Check-out by', value: checkOut },
    { label: 'Minimum stay', value: stay.minNights ? `${stay.minNights} night${stay.minNights === 1 ? '' : 's'}` : null },
    { label: 'Children', value: policies?.children },
    { label: 'Pets', value: policies?.pets },
    { label: 'ID at check-in', value: policies?.idRequirements },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value))

  const price = priceLine(stay, s.booking?.currency ?? 'INR')
  const listingLinks = stay.bookingLinks?.filter((c) => real(c.url)) ?? []
  const channels = listingLinks.length ? listingLinks : (s.booking?.channels ?? []).filter((c) => real(c.url))
  const others = allStays.filter((o) => o.id !== stay.id)
  const trail = [
    { name: 'Home', path: '/' },
    ...(allStays.length > 1 ? [{ name: 'Our stays', path: '/stays' }] : []),
    { name: stay.name, path: `/stays/${stay.slug}` },
  ]
  const responseTime = real(s.contact?.responseTime)

  return (
    <>
      <JsonLd
        data={[staySchema(site, stay), vacationRentalSchema(site, stay), breadcrumbSchema(site, trail), faqSchema(stay.faqs ?? [])]}
      />

      <header className="container page-head">
        <Breadcrumbs trail={trail} />
        <div className="page-head__grid">
          <div className="page-head__title">
            <p className="eyebrow">
              {stayTypeLabel(stay)} · <Tx>{s.location}</Tx>
            </p>
            <h1 className="display-l">
              <Tx>{stay.name}</Tx>
            </h1>
          </div>
          <div className="page-head__intro">
            {stay.tagline && (
              <p className="lead text-soft">
                <Tx>{stay.tagline}</Tx>
              </p>
            )}
            <RatingLine stay={stay} withDate />
          </div>
        </div>
      </header>

      <div className="container stay-hero">
        <Frame media={hero} ratio="3x2" sizes="(min-width: 900px) 66vw, 100vw" preload reveal={false} label={stay.name}>
          {gallery.length > 2 && (
            <a href="#photos" className="btn btn--light btn--sm stay-hero__more">
              <span>All {gallery.length} photographs</span>
              <Icon name="grid" size={16} />
            </a>
          )}
        </Frame>
        <div className="stay-hero__side">
          {(side.length ? side : [null, null]).map((media, i) => (
            <Frame key={media?.id ?? i} media={media} ratio={i === 0 ? '4x5' : '4x3'} sizes="(min-width: 900px) 33vw, 50vw" label="Another angle" />
          ))}
        </div>
      </div>

      <div className="container section stay-layout">
        <div className="stay-main">
          <section>
            <Facts stay={stay} showMissing={!site.isLive} />
            <p className="lead">
              <Tx>{stay.summary}</Tx>
            </p>
          </section>

          {(stay.highlights?.length ?? 0) > 0 && (
            <section>
              <h2 className="display-s">What makes it</h2>
              <ul className="highlights">
                {stay.highlights!.map((h) => (
                  <li key={h.id ?? h.title} data-reveal>
                    <h3>
                      <Tx>{h.title}</Tx>
                    </h3>
                    {h.text && (
                      <p>
                        <Tx>{h.text}</Tx>
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {stay.description && (
            <section>
              <h2 className="display-s">The room</h2>
              <RichText data={stay.description} />
            </section>
          )}

          {video && (
            <section>
              <h2 className="display-s">A walk through</h2>
              <video className="stay-video" controls preload="metadata" poster={poster ? mediaSrc(poster) : undefined} src={mediaSrc(video)}>
                <Tx>{video.alt}</Tx>
              </video>
            </section>
          )}

          {(stay.sleeping?.length ?? 0) > 0 && (
            <section>
              <h2 className="display-s">Sleeping arrangements</h2>
              <ul className="sleeping">
                {stay.sleeping!.map((sl) => (
                  <li key={sl.id ?? sl.space}>
                    <span className="sleeping__space">
                      <Tx>{sl.space}</Tx>
                    </span>
                    <span className="sleeping__beds">
                      <Tx>{sl.beds}</Tx>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(groups.length > 0 || shared.length > 0) && (
            <section>
              <h2 className="display-s">What’s included</h2>
              <div className="amenity-groups">
                {groups.map((group) => (
                  <div key={group.value}>
                    <h3>{group.label}</h3>
                    <ul>
                      {group.items.map((a) => (
                        <li key={a.id} className="amenity">
                          <Icon name={a.icon ?? 'sparkle'} size={20} />
                          <span>
                            <Tx>{a.name}</Tx>
                            {a.note && (
                              <small>
                                <Tx>{a.note}</Tx>
                              </small>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {shared.length > 0 && (
                  <div>
                    <h3>In the community</h3>
                    <ul>
                      {shared.map((a) => (
                        <li key={a.id} className="amenity">
                          <Icon name={a.icon ?? 'sparkle'} size={20} />
                          <span>
                            <Tx>{a.name}</Tx>
                            {a.note && (
                              <small>
                                <Tx>{a.note}</Tx>
                              </small>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {(stay.area || stay.locationNote || (stay.nearby?.length ?? 0) > 0) && (
            <section id="location">
              <h2 className="display-s">
                Where it is
                {stay.area ? (
                  <>
                    {' '}
                    — <Tx>{stay.area}</Tx>, <Tx>{s.location}</Tx>
                  </>
                ) : null}
              </h2>
              {stay.locationNote && (
                <p className="text-soft">
                  <Tx>{stay.locationNote}</Tx>
                </p>
              )}
              {(stay.nearby?.length ?? 0) > 0 && (
                <dl className="policy-grid">
                  {stay.nearby!.map((n) => (
                    <div key={n.id ?? n.place}>
                      <dt>
                        <Tx>{n.distance ?? ''}</Tx>
                      </dt>
                      <dd>
                        <Tx>{n.place}</Tx>
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
              <Cta href="/destination" variant="text" icon="arrow-right">
                The {plain(s.location)} guide
              </Cta>
            </section>
          )}

          {stay.accessibility && (
            <section>
              <h2 className="display-s">Accessibility</h2>
              <p className="text-soft">
                <Tx>{stay.accessibility}</Tx>
              </p>
            </section>
          )}

          <section id="policies">
            <h2 className="display-s">Good to know</h2>
            {policyRows.length > 0 && (
              <dl className="policy-grid">
                {policyRows.map((row) => (
                  <div key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>
                      <Tx>{row.value}</Tx>
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            {cancellation && (
              <div>
                <p className="label" style={{ marginBottom: '0.4rem' }}>
                  Cancellation
                </p>
                <p className="text-soft">
                  <Tx>{cancellation}</Tx>
                </p>
              </div>
            )}
            {rules.length > 0 && (
              <div>
                <p className="label" style={{ marginBottom: '0.6rem' }}>
                  House rules
                </p>
                <ul className="rules">
                  {rules.map((r) => (
                    <li key={r.id ?? r.rule}>
                      <span>
                        <Tx>{r.rule}</Tx>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {(stay.faqs?.length ?? 0) > 0 && (
            <section>
              <h2 className="display-s">Questions about this stay</h2>
              <div className="accordion">
                {stay.faqs!.map((faq) => (
                  <details key={faq.id ?? faq.question}>
                    <summary>
                      <Tx>{faq.question}</Tx>
                    </summary>
                    <div className="accordion__body">
                      <p>
                        <Tx>{faq.answer}</Tx>
                      </p>
                    </div>
                  </details>
                ))}
              </div>
              <Cta href="/faqs" variant="text" icon="arrow-right">
                More questions answered
              </Cta>
            </section>
          )}
        </div>

        <aside className="stay-aside" aria-label="Rates and booking">
          <div className="rate-card">
            {price ? (
              <>
                <p className="label">From</p>
                <p className="rate-card__amount">
                  {price.amount} <small>a {price.unit}</small>
                </p>
                {price.note && (
                  <p className="rate-card__note">
                    <Tx>{price.note}</Tx>
                  </p>
                )}
                {price.checked && <p className="rate-card__note">Rate checked {price.checked}</p>}
              </>
            ) : (
              <>
                <p className="rate-card__amount">Rates on request</p>
                <p className="rate-card__note">
                  Tell us your dates and we’ll reply with the rate{responseTime ? `, usually within ${responseTime}` : ''}.
                </p>
              </>
            )}
          </div>
          <BookingBar {...bookingProps(site)} variant="card" defaultStay={stay.slug ?? undefined} />
          {channels.length > 0 && (
            <div className="channels">
              <p>Also listed on</p>
              {channels.map((c) => (
                <a key={c.url} href={c.url} target="_blank" rel="noopener noreferrer">
                  {platformLabel(c.platform)} <Icon name="arrow-up-right" size={14} />
                </a>
              ))}
            </div>
          )}
        </aside>
      </div>

      {gallery.length > 0 && (
        <section className="section section--flush-top" id="photos">
          <div className="container">
            <SectionHead eyebrow="Photographs" heading={`Inside *${plain(stay.name)}*`} size="m" />
            <Gallery items={gallery} />
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="section stays-band">
          <div className="container">
            <SectionHead eyebrow="Also consider" heading="The *other stays*" layout="split" size="m">
              <Cta href="/stays" variant="text" icon="arrow-right">
                Compare them all
              </Cta>
            </SectionHead>
            <div className="stays-band__grid">
              {others.map((o, i) => (
                <StayCard key={o.id} stay={o} site={site} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
