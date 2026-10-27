import type { Metadata } from 'next'
import Link from 'next/link'

import { BookCta } from '@/components/booking/BookCta'
import { ExperienceDetails } from '@/components/home/Sections'
import { Frame } from '@/components/media/Img'
import { RichText } from '@/components/RichText'
import { Icon } from '@/components/ui/Icon'
import { PageHead } from '@/components/ui/PageHead'
import { JsonLd } from '@/components/ui/Primitives'
import { SetupNote } from '@/components/ui/SetupNote'
import type { Experience, Stay } from '@/payload-types'
import type { IconName } from '@/lib/constants'
import { getExperiences, getPages, getSite } from '@/lib/data'
import { breadcrumbSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { Tx } from '@/lib/text'

export const revalidate = 3600

const KINDS: { value: Experience['kind']; label: string; icon: IconName }[] = [
  { value: 'onsite', label: 'At the stay', icon: 'lamp' },
  { value: 'nearby', label: 'Nearby', icon: 'compass' },
  { value: 'arranged', label: 'Arranged on request', icon: 'sparkle' },
  { value: 'seasonal', label: 'Seasonal', icon: 'leaf' },
]

export async function generateMetadata(): Promise<Metadata> {
  const [site, pages] = await Promise.all([getSite(), getPages()])
  const p = pages.experiences
  return pageMetadata(site, {
    path: '/experiences',
    title: `Experiences at ${site.brand}, ${site.settings.location}`,
    description: p?.intro,
    seo: p?.seo,
    image: p?.image,
  })
}

export default async function ExperiencesPage() {
  const [site, pages, experiences] = await Promise.all([getSite(), getPages(), getExperiences()])
  const p = pages.experiences
  const trail = [
    { name: 'Home', path: '/' },
    { name: 'Experiences', path: '/experiences' },
  ]
  const groups = KINDS.map((kind) => ({ ...kind, items: experiences.filter((e) => e.kind === kind.value) })).filter(
    (g) => g.items.length > 0,
  )

  return (
    <>
      <JsonLd data={breadcrumbSchema(site, trail)} />
      <PageHead
        trail={trail}
        eyebrow={p?.eyebrow ?? 'Experiences'}
        heading={p?.heading ?? 'Things to do, *and not do*'}
        intro={p?.intro}
        image={p?.image}
      />
      <section className="section section--flush-top">
        <div className="container">
          {groups.length === 0 && !site.isLive && (
            <SetupNote title="No experiences yet" href="/admin/collections/experiences/create" action="Add an experience">
              <p>Only list what guests can genuinely do or feel here — on site, nearby, or arranged on request.</p>
            </SetupNote>
          )}
          {groups.map((group) => (
            <div key={group.value} className="exp-section">
              <h2 className="display-m">
                <Tx>{group.label}</Tx>
              </h2>
              <div className="exp-grid">
                {group.items.map((exp, i) => {
                  const stays = (exp.relatedStays ?? []).filter((s): s is Stay => typeof s === 'object' && s !== null)
                  return (
                    <article key={exp.id} id={exp.slug ?? undefined} className="exp-card">
                      <Frame
                        media={exp.image}
                        ratio={i % 6 === 0 || i % 6 === 5 ? '3x2' : '4x5'}
                        arch={i % 6 === 1}
                        sizes="(min-width: 900px) 50vw, 100vw"
                        label={exp.title}
                      />
                      <div className="exp-card__body" data-reveal>
                        <p className="label exp-card__kind">
                          <Icon name={group.icon} size={14} /> {group.label}
                        </p>
                        <h3 className="display-s">
                          <Tx>{exp.title}</Tx>
                        </h3>
                        <p className="text-soft">
                          <Tx>{exp.summary}</Tx>
                        </p>
                        {exp.body && <RichText data={exp.body} />}
                        <ExperienceDetails experience={exp} />
                        {stays.length > 0 && (
                          <div className="chip-links">
                            {stays.map((stay) => (
                              <Link key={stay.id} className="chip" href={`/stays/${stay.slug}`}>
                                <Tx>{stay.name}</Tx>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="section section--flush-top">
        <div className="container">
          <div className="section-cta">
            <h2 className="display-m">Ready to *plan the days?*</h2>
            <p className="lead text-soft">Send your dates and we’ll tell you what’s on while you’re here.</p>
            <BookCta site={site} icon="arrow-right" />
          </div>
        </div>
      </section>
    </>
  )
}
