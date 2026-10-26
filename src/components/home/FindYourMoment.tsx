'use client'

import Link from 'next/link'
import { type KeyboardEvent, useId, useRef, useState } from 'react'

import { cx } from '@/lib/cx'
import { inquiryHref } from '@/lib/format'
import { Tx } from '@/lib/text'

import { Img } from '../media/Img'
import { Icon } from '../ui/Icon'
import { SectionHead } from '../ui/Primitives'

export type Moment = {
  label: string
  title: string
  description: string
  image: unknown
  highlights: string[]
  stay: { name: string; slug: string; tagline?: string | null } | null
}

/**
 * "Find your moment": guests choose the kind of trip they are planning and
 * see the parts of the place that genuinely suit it.
 */
export function FindYourMoment({
  eyebrow,
  heading,
  intro,
  moments,
  bookExternal,
}: {
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
  moments: Moment[]
  bookExternal?: string | null
}) {
  const [active, setActive] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const id = useId()

  if (!moments.length) return null

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = moments.length - 1
    const next =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? active === last
          ? 0
          : active + 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? active === 0
            ? last
            : active - 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null
    if (next === null) return
    event.preventDefault()
    setActive(next)
    tabs.current[next]?.focus()
  }

  return (
    <section className="section moments">
      <div className="container">
        <SectionHead eyebrow={eyebrow} heading={heading} intro={intro} layout="split" size="l" />

        <div className="moments__tabs" role="tablist" aria-label="Kinds of trip" data-reveal>
          {moments.map((moment, i) => (
            <button
              key={moment.label}
              ref={(el) => {
                tabs.current[i] = el
              }}
              id={`${id}-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={active === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={active === i ? 0 : -1}
              className="moments__tab"
              onClick={() => setActive(i)}
              onKeyDown={onKeyDown}
            >
              <span className="moments__tab-num">{String(i + 1).padStart(2, '0')}</span>
              <Tx>{moment.label}</Tx>
            </button>
          ))}
        </div>

        <div className="moments__stage">
          <div className="moments__images" aria-hidden="true">
            {moments.map((moment, i) => (
              <div key={moment.label} className={cx('moments__image', active === i && 'is-active')}>
                <Img media={moment.image} sizes="(min-width: 1000px) 56vw, 100vw" label={moment.title} />
              </div>
            ))}
          </div>

          {moments.map((moment, i) => (
            <div
              key={moment.label}
              id={`${id}-panel-${i}`}
              role="tabpanel"
              aria-labelledby={`${id}-tab-${i}`}
              className={cx('moments__panel', active === i && 'is-active')}
              hidden={active !== i}
            >
              <h3 className="display-m">
                <Tx>{moment.title}</Tx>
              </h3>
              <p className="lead">
                <Tx>{moment.description}</Tx>
              </p>
              {moment.highlights.length > 0 && (
                <ul className="ticks">
                  {moment.highlights.map((text) => (
                    <li key={text}>
                      <Icon name="check" size={18} />
                      <span>
                        <Tx>{text}</Tx>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="moments__actions">
                {moment.stay && (
                  <Link className="moments__stay" href={`/stays/${moment.stay.slug}`}>
                    <span className="label">Suggested stay</span>
                    <span className="moments__stay-name">
                      <Tx>{moment.stay.name}</Tx>
                      <Icon name="arrow-right" size={18} />
                    </span>
                  </Link>
                )}
                {bookExternal ? (
                  <a className="btn btn--ghost" href={bookExternal} target="_blank" rel="noopener noreferrer">
                    Check availability
                  </a>
                ) : (
                  <Link className="btn btn--ghost" href={inquiryHref({ stay: moment.stay?.slug })}>
                    Ask about dates
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
