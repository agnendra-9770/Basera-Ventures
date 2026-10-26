/**
 * Structured data (JSON-LD) for search engines.
 *
 * Rule of thumb: only state facts. Any value that is empty or still a
 * [PLACEHOLDER] is left out entirely, and no ratings are ever self-declared.
 */
import type { Amenity, Faq, Journal, Media, Stay } from '@/payload-types'

import { LOGO_ICON, logoSpelling } from './brand'
import type { Site } from './data'
import { toIsoTime } from './format'
import { absoluteMediaUrl, asMedia, asMediaList, isVideo } from './media'
import { real } from './placeholders'
import { plain } from './text'

type Json = Record<string, unknown>

/** Drops undefined, null, empty strings and empty arrays/objects, recursively. */
const clean = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    const items = value.map(clean).filter((v) => v !== undefined)
    return items.length ? items : undefined
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value)
      .map(([k, v]) => [k, clean(v)] as const)
      .filter(([, v]) => v !== undefined)
    const meaningful = entries.filter(([k]) => k !== '@type' && k !== '@context')
    return meaningful.length ? Object.fromEntries(entries) : undefined
  }
  if (value === null || value === '') return undefined
  return value
}

const lodgingId = (site: Site) => `${site.url}/#lodging`
const stayUrl = (site: Site, stay: Pick<Stay, 'slug'>) => `${site.url}/stays/${stay.slug}`

const imageUrls = (site: Site, media: (Media | null)[], limit = 12) =>
  Array.from(
    new Set(media.filter((m): m is Media => Boolean(m && !isVideo(m))).map((m) => absoluteMediaUrl(m, site.url))),
  ).slice(0, limit)

const amenityList = (stay: Stay): Amenity[] =>
  (stay.amenities ?? []).filter((a): a is Amenity => typeof a === 'object' && a !== null)

const feature = (name: string) => ({ '@type': 'LocationFeatureSpecification', name, value: true })

/** "1 double bed" → { numberOfBeds: 1, typeOfBed: "Double" } */
const bedDetails = (beds: string) => {
  const text = real(beds)
  if (!text) return undefined
  const count = Number(text.match(/^\s*(\d+)/)?.[1] ?? 1)
  const kind = ['california king', 'king', 'queen', 'full', 'double', 'semi double', 'single', 'twin', 'bunk', 'sofa']
    .find((k) => text.toLowerCase().includes(k))
  const typeOfBed = kind
    ? kind.replace(/(^|\s)\w/g, (c) => c.toUpperCase()).replace(/\s/g, '')
    : text.replace(/^\s*\d+\s*/, '')
  return { '@type': 'BedDetails', numberOfBeds: count, typeOfBed }
}

const postalAddress = (site: Site) => {
  const a = site.settings.address
  return clean({
    '@type': 'PostalAddress',
    streetAddress: real(a?.street),
    addressLocality: real(a?.city) ?? real(a?.locality),
    addressRegion: real(a?.region),
    postalCode: real(a?.postalCode),
    addressCountry: real(a?.country),
  })
}

export function lodgingSchema(site: Site, stays: Stay[] = [], images: Media[] = []): Json | null {
  const name = real(site.brand)
  if (!name) return null
  const s = site.settings

  const shared = new Map<string, string>()
  stays.forEach((stay) => amenityList(stay).forEach((a) => a.shared && shared.set(a.name, a.name)))

  const prices = stays.map((stay) => stay.priceFrom).filter((p): p is number => typeof p === 'number' && p > 0)
  const currency = s.booking?.currency ?? 'INR'
  const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 })
  const low = Math.min(...prices)
  const high = Math.max(...prices)
  const priceRange = prices.length
    ? low === high
      ? `From ${money.format(low)}`
      : `${money.format(low)}–${money.format(high)}`
    : undefined

  const logo = asMedia(s.logo)

  return clean({
    '@context': 'https://schema.org',
    '@type': s.seo?.businessType || 'LodgingBusiness',
    '@id': lodgingId(site),
    name,
    url: `${site.url}/`,
    description: real(plain(s.seo?.defaultDescription)),
    image: imageUrls(site, images, 8),
    logo: logo ? absoluteMediaUrl(logo, site.url) : logoSpelling(plain(site.brand)) ? `${site.url}${LOGO_ICON}` : undefined,
    telephone: real(s.contact?.phone),
    email: real(s.contact?.email),
    address: postalAddress(site),
    geo:
      typeof s.geo?.latitude === 'number' && typeof s.geo?.longitude === 'number'
        ? { '@type': 'GeoCoordinates', latitude: s.geo.latitude, longitude: s.geo.longitude }
        : undefined,
    hasMap: real(s.mapsUrl),
    checkinTime: toIsoTime(real(s.policies?.checkIn)),
    checkoutTime: toIsoTime(real(s.policies?.checkOut)),
    amenityFeature: [...shared.keys()].map(feature),
    priceRange,
    currenciesAccepted: currency,
    sameAs: [s.social?.instagram, s.social?.facebook, s.social?.youtube, s.social?.googleBusiness, s.social?.tripadvisor]
      .map((v) => real(v))
      .filter(Boolean),
    containsPlace: stays.map((stay) => ({ '@id': `${stayUrl(site, stay)}#accommodation` })),
  }) as Json
}

export function websiteSchema(site: Site): Json | null {
  const name = real(site.brand)
  if (!name) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url: `${site.url}/`,
    inLanguage: 'en',
    publisher: { '@id': lodgingId(site) },
  }
}

const accommodationType: Record<string, string> = {
  studio: 'HotelRoom',
  room: 'HotelRoom',
  suite: 'Suite',
  apartment: 'Apartment',
  villa: 'House',
  cottage: 'House',
  homestay: 'Accommodation',
  other: 'Accommodation',
}

export function staySchema(site: Site, stay: Stay): Json {
  const url = stayUrl(site, stay)
  const gallery = [asMedia(stay.heroImage), ...asMediaList(stay.gallery)]
  const currency = site.settings.booking?.currency ?? 'INR'
  const unit = { night: 'DAY', week: 'WEE', month: 'MON' }[stay.priceUnit ?? 'night'] ?? 'DAY'

  return clean({
    '@context': 'https://schema.org',
    '@type': accommodationType[stay.stayType] ?? 'Accommodation',
    '@id': `${url}#accommodation`,
    name: real(plain(stay.name)),
    url,
    description: real(plain(stay.summary)),
    image: imageUrls(site, gallery),
    occupancy: stay.maxGuests ? { '@type': 'QuantitativeValue', maxValue: stay.maxGuests, unitCode: 'C62' } : undefined,
    numberOfBedrooms: stay.bedrooms ?? undefined,
    numberOfBathroomsTotal: stay.bathrooms ?? undefined,
    floorSize: stay.size
      ? { '@type': 'QuantitativeValue', value: stay.size, unitCode: stay.sizeUnit === 'sqm' ? 'MTK' : 'FTK' }
      : undefined,
    bed: (stay.sleeping ?? []).map((s) => bedDetails(s.beds)),
    amenityFeature: amenityList(stay).map((a) => feature(a.name)),
    containedInPlace: real(site.brand) ? { '@id': lodgingId(site) } : undefined,
    offers:
      stay.priceFrom && stay.priceFrom > 0
        ? {
            '@type': 'Offer',
            url,
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: stay.priceFrom,
              priceCurrency: currency,
              unitCode: unit,
            },
          }
        : undefined,
  }) as Json
}

const googleAmenityNames: Record<string, string> = {
  wifi: 'wifi',
  pool: 'pool',
  tv: 'tv',
  ac: 'ac',
  kitchen: 'kitchen',
  microwave: 'microwave',
  washer: 'washerDryer',
  balcony: 'balcony',
  child: 'childFriendly',
  accessible: 'wheelchairAccessible',
  pet: 'petsAllowed',
}

/**
 * Google's VacationRental markup. Only produced when the owner has confirmed
 * eligibility (Hotel Center / vacation-rental partnership) AND every required
 * property is real: an identifier, 8+ photos, precise coordinates, occupancy.
 */
export function vacationRentalSchema(site: Site, stay: Stay): Json | null {
  const s = site.settings
  if (!s.seo?.vacationRental) return null
  const lat = s.geo?.latitude
  const lng = s.geo?.longitude
  const precise = (n?: number | null) => typeof n === 'number' && (String(n).split('.')[1]?.length ?? 0) >= 5
  const images = imageUrls(site, [asMedia(stay.heroImage), ...asMediaList(stay.gallery)], 30)
  const name = real(plain(stay.name))
  if (!name || !stay.maxGuests || images.length < 8 || !precise(lat) || !precise(lng)) return null

  const additionalType: Record<string, string> = { villa: 'Villa', cottage: 'Cottage', apartment: 'Apartment', studio: 'Apartment', homestay: 'House' }

  return clean({
    '@context': 'https://schema.org',
    '@type': 'VacationRental',
    '@id': `${stayUrl(site, stay)}#vacation-rental`,
    identifier: `stay-${stay.id}`,
    name,
    url: stayUrl(site, stay),
    description: real(plain(stay.summary)),
    additionalType: additionalType[stay.stayType] ?? 'VacationRental',
    brand: real(site.brand) ? { '@type': 'Brand', name: real(site.brand) } : undefined,
    image: images,
    latitude: lat,
    longitude: lng,
    address: postalAddress(site),
    checkinTime: toIsoTime(real(stay.checkIn) ?? real(s.policies?.checkIn)),
    checkoutTime: toIsoTime(real(stay.checkOut) ?? real(s.policies?.checkOut)),
    containsPlace: {
      '@type': 'Accommodation',
      additionalType: 'EntirePlace',
      occupancy: { '@type': 'QuantitativeValue', value: stay.maxGuests },
      numberOfBedrooms: stay.bedrooms ?? undefined,
      numberOfBathroomsTotal: stay.bathrooms ?? undefined,
      floorSize: stay.size
        ? { '@type': 'QuantitativeValue', value: stay.size, unitCode: stay.sizeUnit === 'sqm' ? 'MTK' : 'FTK' }
        : undefined,
      bed: (stay.sleeping ?? []).map((sl) => bedDetails(sl.beds)),
      amenityFeature: amenityList(stay).map((a) => feature(googleAmenityNames[a.icon ?? ''] ?? a.name)),
    },
  }) as Json
}

export function articleSchema(site: Site, post: Journal): Json {
  const url = `${site.url}/journal/${post.slug}`
  const cover = asMedia(post.coverImage)
  return clean({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: plain(post.title),
    description: real(plain(post.excerpt)),
    image: cover && !isVideo(cover) ? [absoluteMediaUrl(cover, site.url)] : undefined,
    datePublished: post.publishedAt ?? post.createdAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: url,
    author: real(post.author)
      ? { '@type': 'Person', name: real(post.author) }
      : real(site.brand)
        ? { '@type': 'Organization', name: real(site.brand), url: `${site.url}/` }
        : undefined,
    publisher: real(site.brand) ? { '@id': lodgingId(site) } : undefined,
  }) as Json
}

/** Only questions whose answers are complete (no placeholders) are marked up. */
export function faqSchema(faqs: Pick<Faq, 'question' | 'answer'>[]): Json | null {
  const answered = faqs.filter((f) => real(f.answer) && real(f.question))
  if (!answered.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: answered.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

export function breadcrumbSchema(site: Site, trail: { name: string; path: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: plain(item.name),
      item: item.path === '/' ? `${site.url}/` : `${site.url}${item.path}`,
    })),
  }
}
