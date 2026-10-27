import type { Metadata } from 'next'
import Link from 'next/link'

import { BookCta } from '@/components/booking/BookCta'
import { whatsappLink } from '@/components/layout/SiteChrome'
import { PageHead } from '@/components/ui/PageHead'
import { Cta, JsonLd } from '@/components/ui/Primitives'
import { SetupNote } from '@/components/ui/SetupNote'
import { FAQ_CATEGORIES } from '@/lib/constants'
import { getFaqs, getPages, getSite } from '@/lib/data'
import { breadcrumbSchema, faqSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { Tx } from '@/lib/text'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const [site, pages] = await Promise.all([getSite(), getPages()])
  const p = pages.faqs
  return pageMetadata(site, {
    path: '/faqs',
    title: `FAQs — booking, check-in and policies at ${site.brand}`,
    description: p?.intro,
    seo: p?.seo,
    image: p?.image,
  })
}

export default async function FaqsPage() {
  const [site, pages, faqs] = await Promise.all([getSite(), getPages(), getFaqs()])
  const p = pages.faqs
  const trail = [
    { name: 'Home', path: '/' },
    { name: 'FAQs', path: '/faqs' },
  ]
  const groups = FAQ_CATEGORIES.map((c) => ({ ...c, items: faqs.filter((f) => f.category === c.value) })).filter((g) => g.items.length > 0)
  const wa = whatsappLink(site)

  return (
    <>
      <JsonLd data={[breadcrumbSchema(site, trail), faqSchema(faqs)]} />
      <PageHead trail={trail} eyebrow={p?.eyebrow ?? 'FAQs'} heading={p?.heading ?? 'Good *questions*'} intro={p?.intro}>
        <div className="chip-links">
          {groups.map((g) => (
            <a key={g.value} className="chip" href={`#${g.value}`}>
              {g.label}
            </a>
          ))}
        </div>
      </PageHead>

      <section className="section section--flush-top">
        <div className="container container--narrow faq-groups">
          {groups.length === 0 && !site.isLive && (
            <SetupNote title="Answer the questions guests ask" href="/admin/collections/faqs/create" action="Add a question">
              <p>Check-in times, cancellation, food, parking, Wi-Fi, children, pets. Honest answers save everyone a message.</p>
            </SetupNote>
          )}
          {groups.map((group) => (
            <div key={group.value} id={group.value}>
              <h2 className="display-m">{group.label}</h2>
              <div className="accordion">
                {group.items.map((faq) => (
                  <details key={faq.id}>
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
            </div>
          ))}
          {site.stays.length > 0 && (
            <p className="text-soft">
              Questions about a particular room are answered on each stay page:{' '}
              {site.stays.map((s, i) => (
                <span key={s.id}>
                  {i > 0 && ', '}
                  <Link href={`/stays/${s.slug}`}>
                    <Tx>{s.name}</Tx>
                  </Link>
                </span>
              ))}
              .
            </p>
          )}
          <div className="section-cta">
            <h2 className="display-m">Still *wondering?*</h2>
            <p className="lead text-soft">Ask us directly — a person replies.</p>
            <div className="hero__actions" style={{ marginTop: 0 }}>
              <BookCta site={site} icon="arrow-right">
                Send an inquiry
              </BookCta>
              {wa && (
                <Cta href={wa} variant="ghost" icon="whatsapp">
                  WhatsApp us
                </Cta>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
