import Link from 'next/link'

import type { Day, Experience, Home, Journal, Media, Place, Stay, Testimonial } from '@/payload-types'
import { DAY_TIMES, type IconName, JOURNAL_CATEGORIES, labelFor, REVIEW_SOURCES } from '@/lib/constants'
import type { Site } from '@/lib/data'
import { formatDate, platformLabel } from '@/lib/format'
import { asMedia } from '@/lib/media'
import { Tx } from '@/lib/text'

import { BookCta } from '../booking/BookCta'
import { CompassArt } from '../destination/CompassArt'
import { whatsappLink } from '../layout/SiteChrome'
import { Frame, Img } from '../media/Img'
import { formatScore, RatingLine } from '../stays/Rating'
import { StayCard } from '../stays/StayCard'
import { Icon } from '../ui/Icon'
import { Cta, SectionHead, SetupNote } from '../ui/Primitives'

const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x']

export function StorySection({ story }: { story: Home['story'] }) {
  const lines = story?.lines ?? []
  return (
    <section className="section story" id="after-hero">
      <div className="container story__grid">
        <div className="story__media">
          <Frame
            media={story?.image}
            ratio="3x4"
            arch
            sizes="(min-width: 1000px) 36vw, 88vw"
            label="A portrait photograph — framed in the arch"
          />
          {story?.detailImage && (
            <Frame className="story__detail" media={story.detailImage} ratio="4x3" sizes="(min-width: 1000px) 18vw, 44vw" />
          )}
        </div>
        <div className="story__text">
          {story?.eyebrow && (
            <p className="eyebrow" data-reveal>
              <Tx>{story.eyebrow}</Tx>
            </p>
          )}
          {story?.heading && (
            <h2 className="display-l" data-reveal style={{ ['--d' as string]: 1 }}>
              <Tx>{story.heading}</Tx>
            </h2>
          )}
          {lines.length > 0 && (
            <ol className="manifesto">
              {lines.map((line, i) => (
                <li key={line.id ?? i} data-reveal style={{ ['--d' as string]: i + 1 }}>
                  <span className="manifesto__num" aria-hidden="true">
                    {ROMAN[i] ?? i + 1}
                  </span>
                  <span className="manifesto__line">
                    <Tx>{line.text}</Tx>
                  </span>
                </li>
              ))}
            </ol>
          )}
          <Cta href="/our-story" variant="text" icon="arrow-right">
            {story?.linkLabel || 'Read our story'}
          </Cta>
        </div>
      </div>
    </section>
  )
}

const detailRows = (exp: Experience) =>
  [
    { label: 'When', value: exp.details?.when },
    { label: 'Duration', value: exp.details?.duration },
    { label: 'Distance', value: exp.details?.distance },
    { label: 'Price', value: exp.details?.price },
    { label: 'How', value: exp.details?.booking },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value))

export function ExperienceDetails({ experience }: { experience: Experience }) {
  const rows = detailRows(experience)
  if (!rows.length) return null
  return (
    <dl className="details">
      {rows.map((row) => (
        <div key={row.label}>
          <dt>{row.label}</dt>
          <dd>
            <Tx>{row.value}</Tx>
          </dd>
        </div>
      ))}
    </dl>
  )
}

export function SignatureSection({ signature, experiences }: { signature: Home['signature']; experiences: Experience[] }) {
  if (!experiences.length) return null
  return (
    <section className="section signature">
      <div className="container">
        <SectionHead eyebrow={signature?.eyebrow} heading={signature?.heading} intro={signature?.intro} layout="split" />
        <ol className="signature__list">
          {experiences.map((exp, i) => (
            <li key={exp.id} className={i % 2 ? 'signature__item is-flipped' : 'signature__item'}>
              <div className="signature__media">
                <Frame
                  media={exp.image}
                  ratio={i % 2 ? '4x5' : '3x2'}
                  arch={i % 2 === 1}
                  sizes="(min-width: 1000px) 52vw, 100vw"
                  label={exp.title}
                />
                {exp.detailImage && (
                  <Frame className="signature__detail" media={exp.detailImage} ratio="1x1" sizes="(min-width: 1000px) 16vw, 36vw" />
                )}
              </div>
              <div className="signature__text" data-reveal>
                <span className="signature__num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="display-m">
                  <Tx>{exp.title}</Tx>
                </h3>
                <p className="text-soft">
                  <Tx>{exp.summary}</Tx>
                </p>
                <ExperienceDetails experience={exp} />
              </div>
            </li>
          ))}
        </ol>
        <div className="section-foot">
          <Cta href="/experiences" variant="text" icon="arrow-right">
            Every experience
          </Cta>
        </div>
      </div>
    </section>
  )
}

export function StaysBand({ stays, site }: { stays: Stay[]; site: Site }) {
  if (!stays.length) return null
  const single = stays.length === 1
  return (
    <section className="section stays-band">
      <div className="container">
        <SectionHead
          eyebrow={single ? 'The stay' : 'Where you’ll stay'}
          heading={single ? 'Your room *for the duration*' : 'Choose *your room*'}
          layout="split"
          size="m"
        >
          {!single && (
            <Cta href="/stays" variant="text" icon="arrow-right">
              Compare the stays
            </Cta>
          )}
        </SectionHead>
        <div className={single ? 'stays-band__grid is-single' : 'stays-band__grid'}>
          {stays.map((stay, i) => (
            <StayCard key={stay.id} stay={stay} site={site} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

export const timeIcon: Record<string, IconName> = {
  dawn: 'sunrise',
  morning: 'coffee',
  midday: 'sun',
  afternoon: 'leaf',
  golden: 'sunset',
  evening: 'lamp',
  night: 'moon',
}

export function DayTeaser({ day, moments }: { day: Home['day']; moments: NonNullable<Day['moments']> }) {
  if (!moments.length) return null
  return (
    <section className="section day-teaser on-dark">
      <div className="container">
        <SectionHead eyebrow={day?.eyebrow} heading={day?.heading} intro={day?.intro} layout="split" light />
        <ol className="day-teaser__strip">
          {moments.map((moment, i) => (
            <li key={moment.id ?? i} data-reveal style={{ ['--d' as string]: i }}>
              <Link href={`/a-day-here#${moment.time}`} className="day-teaser__card">
                <span className="day-teaser__time">
                  <Icon name={timeIcon[moment.time] ?? 'sun'} size={18} />
                  {moment.timeLabel || labelFor(DAY_TIMES, moment.time)}
                </span>
                <span className="day-teaser__media">
                  <Frame media={moment.image} ratio="3x4" sizes="(min-width: 1000px) 16vw, 60vw" reveal={false} label={moment.title} />
                </span>
                <span className="day-teaser__title">
                  <Tx>{moment.title}</Tx>
                </span>
              </Link>
            </li>
          ))}
        </ol>
        <div className="section-foot">
          <Cta href="/a-day-here" variant="ghost-light" icon="arrow-right">
            Spend a day here
          </Cta>
        </div>
      </div>
    </section>
  )
}

export function CollageSection({ collage, images }: { collage: Home['collage']; images: Media[] }) {
  if (images.length < 3) return null
  const shown = images.slice(0, 7)
  return (
    <section className="section collage">
      <div className="container">
        <SectionHead eyebrow={collage?.eyebrow} heading={collage?.heading} intro={collage?.intro} layout="split" />
        <div className={`collage__grid collage__grid--${shown.length}`}>
          {shown.map((media, i) => (
            <figure key={media.id} className={`collage__item collage__item--${i + 1}`}>
              <div className="frame" data-reveal="image" style={{ ['--d' as string]: i % 3 }}>
                <Img media={media} sizes={i === 0 ? '(min-width: 1000px) 42vw, 100vw' : '(min-width: 1000px) 28vw, 50vw'} />
              </div>
              {media.caption && (
                <figcaption className="caption">
                  <Tx>{media.caption}</Tx>
                </figcaption>
              )}
            </figure>
          ))}
        </div>
        <div className="section-foot">
          <Cta href="/gallery" variant="text" icon="arrow-right">
            Open the gallery
          </Cta>
        </div>
      </div>
    </section>
  )
}

export function ReviewSource({ review }: { review: Testimonial }) {
  const source = labelFor(REVIEW_SOURCES, review.source)
  const label = review.source === 'direct' ? 'Shared with us directly' : `Review on ${source}`
  return review.sourceUrl ? (
    <a className="review__source" href={review.sourceUrl} target="_blank" rel="noopener noreferrer">
      {label} <Icon name="arrow-up-right" size={14} />
    </a>
  ) : (
    <span className="review__source">{label}</span>
  )
}

export function ReviewQuote({ review, large }: { review: Testimonial; large?: boolean }) {
  return (
    <figure className={large ? 'review review--large' : 'review'}>
      <Icon name="quote" size={28} className="review__mark" />
      <blockquote>
        <p>{review.quote}</p>
      </blockquote>
      <figcaption>
        <span className="review__name">{review.guestName}</span>
        <span className="review__meta">
          {[review.guestFrom, review.stayedIn ? `stayed ${review.stayedIn}` : null].filter(Boolean).join(' · ')}
        </span>
        {typeof review.rating === 'number' && (
          <span className="review__rating">Rated {review.rating} out of 5</span>
        )}
        <ReviewSource review={review} />
      </figcaption>
    </figure>
  )
}

/** Ratings copied from booking platforms, each linked to its source. */
function RatingsSummary({ stays }: { stays: Stay[] }) {
  const rated = stays.filter((s) => s.rating?.score && s.rating?.count)
  if (!rated.length) return null
  const total = rated.reduce((sum, s) => sum + (s.rating!.count ?? 0), 0)
  const average = rated.reduce((sum, s) => sum + s.rating!.score! * s.rating!.count!, 0) / total
  const platforms = Array.from(new Set(rated.map((s) => platformLabel(s.rating!.platform ?? 'airbnb'))))
  const checked = rated
    .map((s) => s.rating!.checkedOn)
    .filter(Boolean)
    .sort()
    .at(0)

  return (
    <div className="ratings">
          <div className="ratings__total" data-reveal>
            <p className="ratings__score">
              {formatScore(Math.round(average * 100) / 100)}
              <span aria-hidden="true">★</span>
            </p>
            <p className="ratings__label">
              average across {total} guest review{total === 1 ? '' : 's'} on {platforms.join(' and ')}
            </p>
            <p className="caption">
              {checked ? `Checked ${formatDate(checked)}. ` : ''}Ratings belong to the platforms that collected them — follow
              the links to read every review.
            </p>
          </div>
          <ul className="ratings__list">
            {rated.map((stay) => (
              <li key={stay.id} data-reveal>
                <Link href={`/stays/${stay.slug}`} className="ratings__name">
                  <Tx>{stay.name}</Tx>
                </Link>
                <RatingLine stay={stay} />
              </li>
            ))}
          </ul>
    </div>
  )
}

export function GuestStories({
  stories,
  reviews,
  site,
  stays = [],
}: {
  stories: Home['stories']
  reviews: Testimonial[]
  site: Site
  stays?: Stay[]
}) {
  const featured = reviews.filter((r) => r.featured !== false)
  const hasRatings = stays.some((s) => s.rating?.score && s.rating?.count)
  if (!featured.length && hasRatings) {
    return (
      <section className="section reviews">
        <div className="container">
          <SectionHead eyebrow={stories?.eyebrow} heading={stories?.heading} size="m" />
          <RatingsSummary stays={stays} />
        </div>
      </section>
    )
  }
  if (!featured.length) {
    if (site.isLive) return null
    return (
      <section className="section section--tight">
        <div className="container container--narrow">
          <SetupNote title="Guest reviews will appear here" href="/admin/collections/testimonials/create" action="Add a verified review">
            <p>
              Copy real reviews word for word from Google, Airbnb or Booking.com, link to the original, and tick
              “Verified”. Nothing is shown until you do — the site never invents reviews or ratings.
            </p>
          </SetupNote>
        </div>
      </section>
    )
  }
  const [first, ...rest] = featured
  return (
    <section className="section reviews">
      <div className="container">
        <SectionHead eyebrow={stories?.eyebrow} heading={stories?.heading} size="m" />
        <div className="reviews__grid">
          <ReviewQuote review={first} large />
          {rest.length > 0 && (
            <div className="reviews__rest">
              {rest.slice(0, 3).map((review) => (
                <ReviewQuote key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
        {hasRatings && (
          <div style={{ marginTop: 'calc(var(--space-block) * 1.5)' }}>
            <RatingsSummary stays={stays} />
          </div>
        )}
      </div>
    </section>
  )
}

export function DestinationTeaser({ destination, places }: { destination: Home['destination']; places: Place[] }) {
  return (
    <section className="section destination-teaser">
      <div className="container destination-teaser__grid">
        <div className="destination-teaser__art" data-reveal>
          {asMedia(destination?.image) ? (
            <Frame media={destination?.image} ratio="4x5" arch sizes="(min-width: 1000px) 34vw, 90vw" />
          ) : (
            <CompassArt places={places} />
          )}
        </div>
        <div className="destination-teaser__text">
          <SectionHead eyebrow={destination?.eyebrow} heading={destination?.heading} intro={destination?.intro} size="l" />
          <Cta href="/destination" variant="solid" icon="arrow-right">
            Open the destination guide
          </Cta>
        </div>
      </div>
    </section>
  )
}

export function PostCard({ post, index = 0 }: { post: Journal; index?: number }) {
  return (
    <article className="post-card" data-reveal style={{ ['--d' as string]: index }}>
      <Link href={`/journal/${post.slug}`} className="post-card__media" tabIndex={-1} aria-hidden="true">
        <Frame media={post.coverImage} ratio="3x2" sizes="(min-width: 1000px) 30vw, 90vw" reveal={false} label={post.title} />
      </Link>
      <p className="label">
        {labelFor(JOURNAL_CATEGORIES, post.category)}
        {post.publishedAt ? ` · ${formatDate(post.publishedAt, 'short')}` : ''}
      </p>
      <h3 className="display-s">
        <Link href={`/journal/${post.slug}`} className="post-card__title">
          <Tx>{post.title}</Tx>
        </Link>
      </h3>
      <p className="text-soft post-card__excerpt">
        <Tx>{post.excerpt}</Tx>
      </p>
    </article>
  )
}

export function JournalTeaser({ posts }: { posts: Journal[] }) {
  if (!posts.length) return null
  return (
    <section className="section section--tight journal-teaser">
      <div className="container">
        <SectionHead eyebrow="Journal" heading="Notes *from here*" layout="split" size="m">
          <Cta href="/journal" variant="text" icon="arrow-right">
            All stories
          </Cta>
        </SectionHead>
        <div className="post-grid">
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function Invitation({ invitation, site }: { invitation: Home['invitation']; site: Site }) {
  const wa = whatsappLink(site)
  return (
    <section className="invitation on-dark">
      <div className="invitation__media" aria-hidden="true">
        <Img media={invitation?.image} sizes="100vw" label="A warm, evening photograph" />
      </div>
      <div className="invitation__scrim" aria-hidden="true" />
      <div className="container invitation__inner">
        {invitation?.eyebrow && (
          <p className="eyebrow eyebrow--light" data-reveal>
            <Tx>{invitation.eyebrow}</Tx>
          </p>
        )}
        {invitation?.heading && (
          <h2 className="display-l" data-reveal style={{ ['--d' as string]: 1 }}>
            <Tx>{invitation.heading}</Tx>
          </h2>
        )}
        {invitation?.intro && (
          <p className="lead invitation__intro" data-reveal style={{ ['--d' as string]: 2 }}>
            <Tx>{invitation.intro}</Tx>
          </p>
        )}
        <div className="invitation__actions" data-reveal style={{ ['--d' as string]: 3 }}>
          <BookCta site={site} variant="light" icon="arrow-right">
            {invitation?.buttonLabel || 'Check Availability'}
          </BookCta>
          {wa && (
            <Cta href={wa} variant="ghost-light" icon="whatsapp">
              WhatsApp us
            </Cta>
          )}
        </div>
      </div>
    </section>
  )
}
