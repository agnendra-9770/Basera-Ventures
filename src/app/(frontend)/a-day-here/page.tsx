import type { Metadata } from 'next'

import { BookCta } from '@/components/booking/BookCta'
import { DayScroll } from '@/components/day/DayScroll'
import { timeIcon } from '@/components/home/Sections'
import { Frame } from '@/components/media/Img'
import { Icon } from '@/components/ui/Icon'
import { PageHead } from '@/components/ui/PageHead'
import { JsonLd, SetupNote } from '@/components/ui/Primitives'
import { DAY_TIMES, labelFor } from '@/lib/constants'
import { getDayPage, getSite } from '@/lib/data'
import { breadcrumbSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { Tx } from '@/lib/text'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const [site, day] = await Promise.all([getSite(), getDayPage()])
  return pageMetadata(site, {
    path: '/a-day-here',
    title: `A day at ${site.brand}`,
    description: day.intro?.intro,
    seo: day.seo,
    image: day.moments?.find((m) => m.image)?.image,
  })
}

export default async function DayPage() {
  const [site, day] = await Promise.all([getSite(), getDayPage()])
  const moments = day.moments ?? []
  const trail = [
    { name: 'Home', path: '/' },
    { name: 'A day here', path: '/a-day-here' },
  ]
  const seen = new Set<string>()
  const ids = moments.map((m, i) => {
    const id = seen.has(m.time) ? `${m.time}-${i}` : m.time
    seen.add(m.time)
    return id
  })

  return (
    <div className="day-page" data-time={moments[0]?.time ?? 'morning'}>
      <JsonLd data={breadcrumbSchema(site, trail)} />
      <DayScroll />
      <PageHead
        trail={trail}
        eyebrow={day.intro?.eyebrow ?? 'A day here'}
        heading={day.intro?.heading ?? 'From first light *to lamplight*'}
        intro={day.intro?.intro}
      />

      {moments.length > 0 ? (
        <>
          <nav className="day-timeline" aria-label="Times of day">
            {moments.map((m, i) => (
              <a key={ids[i]} href={`#${ids[i]}`} title={labelFor(DAY_TIMES, m.time)} className={i === 0 ? 'is-current' : undefined}>
                <Icon name={timeIcon[m.time] ?? 'sun'} size={16} />
                <span className="sr-only">{labelFor(DAY_TIMES, m.time)}</span>
              </a>
            ))}
          </nav>
          <ol className="container">
            {moments.map((m, i) => (
              <li key={ids[i]} id={ids[i]} className="day-moment" data-moment-time={m.time}>
                <div className="day-moment__media">
                  <Frame media={m.image} ratio={i % 2 ? '3x4' : '4x5'} arch={i % 3 === 0} sizes="(min-width: 900px) 50vw, 100vw" label={m.title} />
                </div>
                <div className="day-moment__text" data-reveal>
                  <p className="day-moment__time">
                    <Icon name={timeIcon[m.time] ?? 'sun'} size={18} />
                    {labelFor(DAY_TIMES, m.time)}
                    {m.timeLabel && (
                      <strong>
                        <Tx>{m.timeLabel}</Tx>
                      </strong>
                    )}
                  </p>
                  <h2 className="display-m">
                    <Tx>{m.title}</Tx>
                  </h2>
                  <p>
                    <Tx>{m.text}</Tx>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </>
      ) : (
        !site.isLive && (
          <div className="container">
            <SetupNote title="Describe a day here" href="/admin/globals/day" action="Open “A day here”">
              <p>One photograph and a few sentences per moment, from first light to lamplight. The page colour shifts with the time of day.</p>
            </SetupNote>
          </div>
        )
      )}

      <div className="container day-closing">
        {day.closing?.heading && (
          <h2 className="display-l" data-reveal>
            <Tx>{day.closing.heading}</Tx>
          </h2>
        )}
        {day.closing?.text && (
          <p className="lead" data-reveal style={{ ['--d' as string]: 1 }}>
            <Tx>{day.closing.text}</Tx>
          </p>
        )}
        <BookCta site={site} variant={moments.some((m) => m.time === 'night' || m.time === 'evening') ? 'light' : 'solid'} icon="arrow-right" />
      </div>
    </div>
  )
}
