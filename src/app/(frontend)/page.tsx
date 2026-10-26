import type { Metadata } from 'next'

import { BookingBar } from '@/components/booking/BookingBar'
import { bookingProps } from '@/components/booking/BookCta'
import { FindYourMoment, type Moment } from '@/components/home/FindYourMoment'
import { Hero } from '@/components/home/Hero'
import {
  CollageSection,
  DayTeaser,
  DestinationTeaser,
  GuestStories,
  Invitation,
  JournalTeaser,
  SignatureSection,
  StaysBand,
  StorySection,
} from '@/components/home/Sections'
import { bookingTarget } from '@/components/layout/SiteChrome'
import { JsonLd } from '@/components/ui/Primitives'
import type { Experience, Stay } from '@/payload-types'
import {
  getDayPage,
  getExperiences,
  getGalleryMedia,
  getHome,
  getJournal,
  getPlaces,
  getSite,
  getStays,
  getTestimonials,
} from '@/lib/data'
import { asMedia, asMediaList } from '@/lib/media'
import { lodgingSchema, websiteSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { plain } from '@/lib/text'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const [site, home] = await Promise.all([getSite(), getHome()])
  return pageMetadata(site, {
    path: '/',
    title: `${site.brand} — ${site.settings.propertyType} in ${site.settings.location}`,
    seo: home.seo,
    image: home.hero?.image,
  })
}

export default async function HomePage() {
  const [site, home, stays, experiences, reviews, day, posts, places, gallery] = await Promise.all([
    getSite(),
    getHome(),
    getStays(),
    getExperiences(),
    getTestimonials(),
    getDayPage(),
    getJournal(undefined, 3),
    getPlaces(),
    getGalleryMedia(),
  ])

  const moments: Moment[] = (home.moments?.items ?? []).map((item) => {
    const stay = item.stay && typeof item.stay === 'object' ? (item.stay as Stay) : null
    return {
      label: item.label,
      title: item.title,
      description: item.description,
      image: item.image,
      highlights: (item.highlights ?? []).map((h) => h.text),
      stay: stay?.slug ? { name: plain(stay.name), slug: stay.slug, tagline: stay.tagline } : null,
    }
  })

  const chosen = (home.signature?.experiences ?? []).filter((e): e is Experience => typeof e === 'object' && e !== null)
  const signature = chosen.length ? chosen : experiences.filter((e) => e.featured)

  const collageImages = asMediaList(home.collage?.images)
  const target = bookingTarget(site)
  const schemaImages = [asMedia(home.hero?.image), ...gallery].filter((m): m is NonNullable<typeof m> => Boolean(m))

  return (
    <>
      <JsonLd data={[lodgingSchema(site, stays, schemaImages), websiteSchema(site)]} />
      <Hero hero={home.hero} site={site} />

      <div className="booking-dock">
        <div className="container">
          <BookingBar {...bookingProps(site)} variant="dock" />
        </div>
      </div>

      <StorySection story={home.story} />
      <FindYourMoment
        eyebrow={home.moments?.eyebrow}
        heading={home.moments?.heading}
        intro={home.moments?.intro}
        moments={moments}
        bookExternal={target.external ? target.href : null}
      />
      <SignatureSection signature={home.signature} experiences={signature} />
      <StaysBand stays={stays} site={site} />
      <DayTeaser day={home.day} moments={day.moments ?? []} />
      <CollageSection collage={home.collage} images={collageImages.length >= 3 ? collageImages : gallery} />
      <GuestStories stories={home.stories} reviews={reviews} site={site} stays={stays} />
      <DestinationTeaser destination={home.destination} places={places} />
      <JournalTeaser posts={posts} />
      <Invitation invitation={home.invitation} site={site} />
    </>
  )
}
