import config from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload, type Where } from 'payload'
import { cache } from 'react'

import type { Setting, Stay } from '@/payload-types'

import { interpolateDeep, type Tokens } from './placeholders'
import { serverUrl } from './preview'

export const getPayloadClient = () => getPayload({ config })

/** True when a signed-in editor is previewing drafts. */
export const isDraftMode = async () => {
  try {
    return (await draftMode()).isEnabled
  } catch {
    // Outside a request (sitemap generation, static params) — never draft.
    return false
  }
}

export type StayLink = Pick<Stay, 'id' | 'name' | 'slug' | 'stayType'>

export type Site = {
  settings: Setting
  tokens: Tokens
  brand: string
  url: string
  isLive: boolean
  /** WhatsApp number as digits only, or null when not set. */
  whatsapp: string | null
  stays: StayLink[]
}

export const getSite = cache(async (): Promise<Site> => {
  const payload = await getPayloadClient()
  const draft = await isDraftMode()
  const raw = await payload.findGlobal({ slug: 'settings', depth: 1 })

  const tokens: Tokens = {
    brand: raw.brandName,
    location: raw.location,
    propertyType: raw.propertyType,
    nearbyCity: raw.nearbyCity || '[NEARBY CITY]',
    usp: raw.usp || '[PROPERTY USP]',
    responseTime: raw.contact?.responseTime || '[RESPONSE TIME]',
    checkIn: raw.policies?.checkIn || '[CHECK-IN TIME]',
    checkOut: raw.policies?.checkOut || '[CHECK-OUT TIME]',
    cancellation: raw.policies?.cancellation || '[CANCELLATION POLICY]',
    payment: raw.booking?.paymentNote || '[PAYMENT TERMS]',
    children: raw.policies?.children || '[CHILD POLICY]',
    pets: raw.policies?.pets || '[PET POLICY]',
    idPolicy: raw.policies?.idRequirements || '[ID REQUIREMENTS]',
  }

  const stays = await payload.find({
    collection: 'stays',
    depth: 0,
    limit: 100,
    pagination: false,
    sort: '_order',
    draft,
    overrideAccess: draft,
    select: { name: true, slug: true, stayType: true },
  })

  const digits = raw.contact?.whatsapp?.replace(/\D/g, '') ?? ''

  return {
    settings: interpolateDeep(raw, tokens),
    tokens,
    brand: raw.brandName,
    url: serverUrl(),
    isLive: Boolean(raw.seo?.isLive),
    whatsapp: digits.length >= 8 ? digits : null,
    stays: stays.docs.filter((s): s is StayLink => Boolean(s.slug)),
  }
})

const withTokens = async <T>(doc: T): Promise<T> => interpolateDeep(doc, (await getSite()).tokens)

export const getHome = cache(async () => withTokens(await (await getPayloadClient()).findGlobal({ slug: 'home', depth: 2 })))
export const getStoryPage = cache(async () =>
  withTokens(await (await getPayloadClient()).findGlobal({ slug: 'story', depth: 1 })),
)
export const getDayPage = cache(async () => withTokens(await (await getPayloadClient()).findGlobal({ slug: 'day', depth: 1 })))
export const getDestinationPage = cache(async () =>
  withTokens(await (await getPayloadClient()).findGlobal({ slug: 'destination', depth: 1 })),
)
export const getPages = cache(async () => withTokens(await (await getPayloadClient()).findGlobal({ slug: 'pages', depth: 1 })))

export const getStays = cache(async () => {
  const draft = await isDraftMode()
  const result = await (await getPayloadClient()).find({
    collection: 'stays',
    depth: 2,
    limit: 100,
    pagination: false,
    sort: '_order',
    draft,
    overrideAccess: draft,
  })
  return withTokens(result.docs)
})

export const getStay = cache(async (slug: string) => {
  const draft = await isDraftMode()
  const result = await (await getPayloadClient()).find({
    collection: 'stays',
    depth: 2,
    limit: 1,
    pagination: false,
    draft,
    overrideAccess: draft,
    where: { slug: { equals: slug } },
  })
  return result.docs[0] ? withTokens(result.docs[0]) : null
})

export const getExperiences = cache(async () => {
  const draft = await isDraftMode()
  const result = await (await getPayloadClient()).find({
    collection: 'experiences',
    depth: 1,
    limit: 100,
    pagination: false,
    sort: '_order',
    draft,
    overrideAccess: draft,
  })
  return withTokens(result.docs)
})

/** Facilities every guest can use (pool, dining room …), shown on every stay. */
export const getSharedAmenities = cache(async () => {
  const result = await (await getPayloadClient()).find({
    collection: 'amenities',
    depth: 0,
    limit: 100,
    pagination: false,
    sort: '_order',
    overrideAccess: false,
    where: { shared: { equals: true } },
  })
  return result.docs
})

export const getPlaces = cache(async () => {
  const result = await (await getPayloadClient()).find({
    collection: 'places',
    depth: 1,
    limit: 200,
    pagination: false,
    sort: '_order',
    overrideAccess: false,
  })
  return withTokens(result.docs)
})

export const getFaqs = cache(async () => {
  const result = await (await getPayloadClient()).find({
    collection: 'faqs',
    depth: 0,
    limit: 300,
    pagination: false,
    sort: '_order',
    overrideAccess: false,
  })
  return withTokens(result.docs)
})

/** Only reviews marked as verified are ever returned to the public site. */
export const getTestimonials = cache(async () => {
  const result = await (await getPayloadClient()).find({
    collection: 'testimonials',
    depth: 1,
    limit: 100,
    pagination: false,
    sort: '_order',
    overrideAccess: false,
    where: { verified: { equals: true } },
  })
  return result.docs
})

export const getJournal = cache(async (category?: string, limit = 100) => {
  const draft = await isDraftMode()
  const where: Where | undefined = category ? { category: { equals: category } } : undefined
  const result = await (await getPayloadClient()).find({
    collection: 'journal',
    depth: 1,
    limit,
    sort: '-publishedAt',
    draft,
    overrideAccess: draft,
    where,
  })
  return withTokens(result.docs)
})

export const getPost = cache(async (slug: string) => {
  const draft = await isDraftMode()
  const result = await (await getPayloadClient()).find({
    collection: 'journal',
    depth: 2,
    limit: 1,
    pagination: false,
    draft,
    overrideAccess: draft,
    where: { slug: { equals: slug } },
  })
  return result.docs[0] ? withTokens(result.docs[0]) : null
})

export const getGalleryMedia = cache(async () => {
  const result = await (await getPayloadClient()).find({
    collection: 'media',
    depth: 1,
    limit: 500,
    pagination: false,
    sort: '_order',
    overrideAccess: false,
    where: { showInGallery: { equals: true } },
  })
  return withTokens(result.docs)
})

export const getPostcards = cache(async () => {
  const result = await (await getPayloadClient()).find({
    collection: 'media',
    depth: 1,
    limit: 24,
    pagination: false,
    sort: '_order',
    overrideAccess: false,
    where: { postcard: { equals: true } },
  })
  return withTokens(result.docs)
})
