import { getImageProps } from 'next/image'
import { preload } from 'react-dom'

import type { Home, Media } from '@/payload-types'
import type { Site } from '@/lib/data'
import { asMedia, focalPosition, isVideo, mediaSrc } from '@/lib/media'
import { Lines, Tx } from '@/lib/text'

import { BookCta } from '../booking/BookCta'
import { staysHref } from '../layout/SiteChrome'
import { PlaceholderMedia } from '../media/Img'
import { Cta } from '../ui/Primitives'
import { HeroVideo } from './HeroVideo'

/** Art-directed hero image: a portrait crop for phones, landscape elsewhere. */
function HeroPicture({ image, mobile }: { image: Media | null; mobile: Media | null }) {
  if (!image) return <PlaceholderMedia label="Your opening photograph — wide, warm, at least 2400 px across" />

  const options = { sizes: '100vw', quality: 80 as const }
  const desktop = getImageProps({
    ...options,
    src: mediaSrc(image),
    alt: image.alt,
    width: image.width ?? 2400,
    height: image.height ?? 1600,
  }).props
  const phone = mobile
    ? getImageProps({
        ...options,
        src: mediaSrc(mobile),
        alt: mobile.alt,
        width: mobile.width ?? 1080,
        height: mobile.height ?? 1440,
      }).props
    : null

  // Start downloading the right hero image before anything else.
  if (phone?.srcSet) {
    preload(phone.src, {
      as: 'image',
      imageSrcSet: phone.srcSet,
      imageSizes: '100vw',
      fetchPriority: 'high',
      media: '(max-width: 760px)',
    })
  }
  if (desktop.srcSet) {
    preload(desktop.src, {
      as: 'image',
      imageSrcSet: desktop.srcSet,
      imageSizes: '100vw',
      fetchPriority: 'high',
      ...(phone ? { media: '(min-width: 761px)' } : {}),
    })
  }

  const { style: _ignored, ...img } = desktop
  return (
    <picture className="hero__picture">
      {phone && <source media="(max-width: 760px)" srcSet={phone.srcSet} sizes="100vw" />}
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img
        {...img}
        className="hero__img"
        loading="eager"
        fetchPriority="high"
        style={{
          ['--focal' as string]: focalPosition(image),
          ['--focal-m' as string]: mobile ? focalPosition(mobile) : focalPosition(image),
        }}
      />
    </picture>
  )
}

export function Hero({ hero, site }: { hero: Home['hero']; site: Site }) {
  const image = asMedia(hero.image)
  const mobile = asMedia(hero.mobileImage)
  const video = asMedia(hero.video)
  const poster = image ? mediaSrc(image) : undefined

  return (
    <section className="hero" data-overlay-header aria-labelledby="hero-title">
      <div className="hero__media">
        <HeroPicture image={image} mobile={mobile} />
        {video && isVideo(video) && <HeroVideo src={mediaSrc(video)} poster={poster} />}
      </div>
      <div className="hero__scrim" aria-hidden="true" />

      <div className="container hero__inner">
        {hero.eyebrow && (
          <p className="eyebrow eyebrow--light hero__eyebrow">
            <Tx>{hero.eyebrow}</Tx>
          </p>
        )}
        <h1 id="hero-title" className="display-xl hero__title">
          <Lines text={hero.headline} className="hero__line" />
        </h1>
        {hero.subheadline && (
          <p className="hero__sub">
            <Tx>{hero.subheadline}</Tx>
          </p>
        )}
        <div className="hero__actions">
          <Cta href={staysHref(site)} variant="light" icon="arrow-right">
            {hero.primaryLabel || 'Explore the Stay'}
          </Cta>
          <BookCta site={site} variant="ghost-light">
            {hero.secondaryLabel || 'Check Availability'}
          </BookCta>
        </div>
      </div>

      {image?.caption && (
        <p className="hero__caption">
          <Tx>{image.caption}</Tx>
        </p>
      )}
      <a className="hero__scroll" href="#after-hero" aria-label="Scroll to the story">
        <span aria-hidden="true" />
      </a>
    </section>
  )
}
