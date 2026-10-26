import type { Metadata } from 'next'

import { BookCta } from '@/components/booking/BookCta'
import { Frame } from '@/components/media/Img'
import { PageHead } from '@/components/ui/PageHead'
import { JsonLd, SectionHead } from '@/components/ui/Primitives'
import { getSite, getStoryPage } from '@/lib/data'
import { breadcrumbSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { paragraphs, Tx } from '@/lib/text'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const [site, story] = await Promise.all([getSite(), getStoryPage()])
  return pageMetadata(site, {
    path: '/our-story',
    title: `Our story — the people behind ${site.brand}`,
    description: story.hero?.intro,
    seo: story.seo,
    image: story.hero?.image,
  })
}

export default async function StoryPage() {
  const [site, story] = await Promise.all([getSite(), getStoryPage()])
  const trail = [
    { name: 'Home', path: '/' },
    { name: 'Our story', path: '/our-story' },
  ]
  const { hero, people, philosophy, local, timeline, promise } = story

  return (
    <>
      <JsonLd data={breadcrumbSchema(site, trail)} />
      <PageHead
        trail={trail}
        eyebrow={hero?.eyebrow ?? 'Our story'}
        heading={hero?.heading ?? 'A place shaped by *how people actually stay*'}
        intro={hero?.intro}
        image={hero?.image}
      />

      <section className="section section--flush-top">
        <div className="container people">
          <div>
            <Frame media={people?.image} ratio="4x5" arch sizes="(min-width: 900px) 40vw, 100vw" label="The hosts — a photograph of you" />
          </div>
          <div className="people__text">
            {people?.heading && (
              <h2 className="display-m" data-reveal>
                <Tx>{people.heading}</Tx>
              </h2>
            )}
            {paragraphs(people?.text).map((para, i) => (
              <p key={i} className="lead text-soft" data-reveal style={{ ['--d' as string]: i + 1 }}>
                <Tx>{para}</Tx>
              </p>
            ))}
            {(people?.members?.length ?? 0) > 0 && (
              <ul className="members">
                {people!.members!.map((m) => (
                  <li key={m.id ?? m.name} className="member" data-reveal>
                    <Frame media={m.photo} ratio="4x5" sizes="(min-width: 900px) 18vw, 45vw" label={m.name} />
                    <span className="member__name">
                      <Tx>{m.name}</Tx>
                    </span>
                    {m.role && (
                      <span className="member__role">
                        <Tx>{m.role}</Tx>
                      </span>
                    )}
                    {m.bio && (
                      <p className="member__bio">
                        <Tx>{m.bio}</Tx>
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {(philosophy?.pillars?.length ?? 0) > 0 && (
        <section className="section section--linen">
          <div className="container">
            <SectionHead eyebrow={philosophy?.eyebrow} heading={philosophy?.heading} intro={philosophy?.intro} layout="split" />
            <ol className="pillars">
              {philosophy!.pillars!.map((pillar, i) => (
                <li key={pillar.id ?? pillar.title} className="pillar">
                  <Frame media={pillar.image} ratio={i % 2 ? '3x4' : '4x3'} sizes="(min-width: 760px) 48vw, 100vw" label={pillar.title} />
                  <div className="pillar__text" data-reveal>
                    <h3 className="display-s">
                      <Tx>{pillar.title}</Tx>
                    </h3>
                    {pillar.text && (
                      <p>
                        <Tx>{pillar.text}</Tx>
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {(local?.heading || local?.text) && (
        <section className="section">
          <div className="container two-col">
            <div className="people__text">
              <SectionHead eyebrow="Local connections" heading={local?.heading} size="m" />
              {paragraphs(local?.text).map((para, i) => (
                <p key={i} className="lead text-soft" data-reveal>
                  <Tx>{para}</Tx>
                </p>
              ))}
            </div>
            <Frame media={local?.image} ratio="4x3" sizes="(min-width: 900px) 48vw, 100vw" label="The neighbourhood, the makers, the market" />
          </div>
        </section>
      )}

      {(timeline?.entries?.length ?? 0) > 0 && (
        <section className="section section--flush-top">
          <div className="container container--narrow">
            <SectionHead eyebrow="Timeline" heading={timeline?.heading} size="m" />
            <ol className="timeline">
              {timeline!.entries!.map((entry) => (
                <li key={entry.id ?? entry.year} data-reveal>
                  <div className="timeline__text">
                    <span className="timeline__year">
                      <Tx>{entry.year}</Tx>
                    </span>
                    <h3 className="display-s">
                      <Tx>{entry.title}</Tx>
                    </h3>
                    {entry.text && (
                      <p className="text-soft">
                        <Tx>{entry.text}</Tx>
                      </p>
                    )}
                  </div>
                  {entry.image && <Frame media={entry.image} ratio="4x3" sizes="(min-width: 760px) 30vw, 100vw" />}
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {(promise?.items?.length ?? 0) > 0 && (
        <section className="section section--sage">
          <div className="container">
            <SectionHead eyebrow="Our promise" heading={promise?.heading} size="m" />
            <ul className="promises">
              {promise!.items!.map((item, i) => (
                <li key={item.id ?? item.title} data-reveal style={{ ['--d' as string]: i }}>
                  <h3>
                    <Tx>{item.title}</Tx>
                  </h3>
                  {item.text && (
                    <p>
                      <Tx>{item.text}</Tx>
                    </p>
                  )}
                </li>
              ))}
            </ul>
            <div className="section-foot">
              <BookCta site={site} icon="arrow-right" />
            </div>
          </div>
        </section>
      )}
    </>
  )
}
