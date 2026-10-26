import type { Metadata } from 'next'

import type { Site } from './data'
import { asMedia, shareImageUrl } from './media'
import { plain } from './text'

type SeoGroup = {
  title?: string | null
  description?: string | null
  image?: unknown
  noindex?: boolean | null
} | null

const truncate = (text: string, max: number) =>
  text.length <= max ? text : `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…`

export const canonical = (site: Site, path: string) => (path === '/' ? `${site.url}/` : `${site.url}${path}`)

/**
 * Builds every page's <head>: title, description, canonical link, social
 * cards and robots rules. While the site is in setup mode (Site settings →
 * Search & launch), every page asks search engines not to index it.
 */
export function pageMetadata(
  site: Site,
  options: {
    path: string
    title?: string | null
    description?: string | null
    seo?: SeoGroup
    image?: unknown
    type?: 'website' | 'article'
    publishedTime?: string | null
    noindex?: boolean
  },
): Metadata {
  const brand = plain(site.brand)
  const baseTitle = plain(options.seo?.title) || plain(options.title) || brand
  const title = baseTitle.toLowerCase().includes(brand.toLowerCase()) ? baseTitle : `${baseTitle} · ${brand}`
  const description = truncate(
    plain(options.seo?.description) || plain(options.description) || plain(site.settings.seo?.defaultDescription),
    300,
  )
  const url = canonical(site, options.path)
  const image = shareImageUrl(
    asMedia(options.seo?.image) ?? asMedia(options.image) ?? asMedia(site.settings.seo?.shareImage),
    site.url,
  )
  const pageHidden = Boolean(options.noindex || options.seo?.noindex)
  const index = site.isLive && !pageHidden

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: options.type ?? 'website',
      url,
      title,
      description,
      siteName: brand,
      locale: 'en_IN',
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
      ...(options.publishedTime ? { publishedTime: options.publishedTime } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: index
      ? { index: true, follow: true, 'max-image-preview': 'large' }
      : { index: false, follow: site.isLive && !pageHidden },
  }
}
