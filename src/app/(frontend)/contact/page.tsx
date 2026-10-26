import type { Metadata } from 'next'

import { InquiryForm } from '@/components/contact/InquiryForm'
import { whatsappLink } from '@/components/layout/SiteChrome'
import { Icon } from '@/components/ui/Icon'
import { PageHead } from '@/components/ui/PageHead'
import { Cta, JsonLd } from '@/components/ui/Primitives'
import { getPages, getSite } from '@/lib/data'
import { describeTrip, platformLabel, telHref } from '@/lib/format'
import { real } from '@/lib/placeholders'
import { breadcrumbSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { plain, Tx } from '@/lib/text'

export async function generateMetadata(): Promise<Metadata> {
  const [site, pages] = await Promise.all([getSite(), getPages()])
  const p = pages.contact
  return pageMetadata(site, {
    path: '/contact',
    title: `Contact & book — ${site.brand}, ${site.settings.location}`,
    description: p?.intro,
    seo: p?.seo,
    image: p?.image,
  })
}

type Args = { searchParams: Promise<Record<string, string | string[] | undefined>> }

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? ''

export default async function ContactPage({ searchParams }: Args) {
  const [site, pages, query] = await Promise.all([getSite(), getPages(), searchParams])
  const p = pages.contact
  const s = site.settings
  const trail = [
    { name: 'Home', path: '/' },
    { name: 'Contact & book', path: '/contact' },
  ]
  const defaults = {
    checkIn: first(query.arrival),
    checkOut: first(query.departure),
    adults: first(query.adults),
    children: first(query.children),
    stay: first(query.stay),
    sourcePage: '/contact',
  }
  const stayName = site.stays.find((st) => st.slug === defaults.stay)?.name
  const trip = describeTrip({ arrival: defaults.checkIn, departure: defaults.checkOut, adults: defaults.adults, children: defaults.children }, stayName ? plain(stayName) : undefined)
  const wa = whatsappLink(site, trip ? `${plain(s.booking?.whatsappMessage ?? 'Hello!').replace(/[.!\s]+$/, '')} — ${trip}.` : undefined)
  const a = s.address
  const addressLines = [a?.street, [a?.locality, a?.city].filter((x) => real(x)).join(', '), [a?.region, a?.postalCode].filter((x) => real(x)).join(' '), a?.country].filter((line) => real(line)) as string[]
  const embed = real(s.mapEmbedUrl)
  const mapOk = embed?.startsWith('https://www.google.com/maps/embed')
  const channels = (s.booking?.channels ?? []).filter((c) => real(c.url))
  const responseTime = real(s.contact?.responseTime)

  return (
    <>
      <JsonLd data={breadcrumbSchema(site, trail)} />
      <PageHead trail={trail} eyebrow={p?.eyebrow ?? 'Contact & book'} heading={p?.heading ?? 'Let’s find *your dates*'} intro={p?.intro} />

      <section className="section section--flush-top">
        <div className="container contact-layout">
          <div>
            <InquiryForm stays={site.stays.map((st) => ({ slug: st.slug ?? '', name: plain(st.name) }))} defaults={defaults} responseTime={responseTime} whatsappHref={wa} />
          </div>

          <aside className="contact-side">
            <div className="contact-block">
              <h2>Talk to us directly</h2>
              <ul className="contact-list">
                {wa && (
                  <li>
                    <a href={wa} target="_blank" rel="noopener noreferrer">
                      <Icon name="whatsapp" size={20} /> WhatsApp{trip ? ' with your dates' : ''}
                    </a>
                  </li>
                )}
                {real(s.contact?.phone) && (
                  <li>
                    <a href={telHref(s.contact!.phone!)}>
                      <Icon name="phone" size={20} /> {s.contact!.phone}
                    </a>
                  </li>
                )}
                {real(s.contact?.email) && (
                  <li>
                    <a href={`mailto:${s.contact!.email}`}>
                      <Icon name="mail" size={20} /> {s.contact!.email}
                    </a>
                  </li>
                )}
                {!wa && !real(s.contact?.phone) && !real(s.contact?.email) && (
                  <li>
                    <Tx>[PHONE] · [EMAIL] · [WHATSAPP]</Tx>
                  </li>
                )}
              </ul>
              <p className="text-soft" style={{ fontSize: '0.92rem' }}>
                {s.contact?.hours && (
                  <>
                    We answer <Tx>{s.contact.hours}</Tx>.{' '}
                  </>
                )}
                Replies usually within <Tx>{s.contact?.responseTime ?? '[RESPONSE TIME]'}</Tx>.
              </p>
            </div>

            {(p?.nextSteps?.length ?? 0) > 0 && (
              <div className="contact-block">
                <h2>What happens next</h2>
                <ol className="steps">
                  {p!.nextSteps!.map((step) => (
                    <li key={step.id ?? step.title}>
                      <div>
                        <strong>
                          <Tx>{step.title}</Tx>
                        </strong>
                        {step.text && (
                          <p>
                            <Tx>{step.text}</Tx>
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {channels.length > 0 && (
              <div className="contact-block">
                <h2>Prefer to book elsewhere?</h2>
                <div className="chip-links">
                  {channels.map((c) => (
                    <a key={c.url} className="chip" href={c.url} target="_blank" rel="noopener noreferrer">
                      {platformLabel(c.platform)} <Icon name="arrow-up-right" size={14} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="contact-block">
              <h2>Where we are</h2>
              <address style={{ fontStyle: 'normal' }}>
                {real(a?.street) || real(a?.city) ? (
                  addressLines.map((line) => (
                    <span key={line} style={{ display: 'block' }}>
                      <Tx>{line}</Tx>
                    </span>
                  ))
                ) : (
                  <Tx>{`[STREET ADDRESS] · ${s.location}`}</Tx>
                )}
              </address>
              {mapOk && (
                <div className="map-embed">
                  <iframe src={embed} title={`Map showing ${plain(site.brand)}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
                </div>
              )}
              {real(s.mapsUrl) && (
                <Cta href={s.mapsUrl!} variant="text" icon="arrow-up-right">
                  Directions in Google Maps
                </Cta>
              )}
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
