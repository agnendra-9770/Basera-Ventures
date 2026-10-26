import type { MetadataRoute } from 'next'

import { getSite } from '@/lib/data'

export const revalidate = 3600

/** Search engines are kept out until "The site is live" is ticked in Site settings. */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSite()
  if (!site.isLive) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/next/'] },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  }
}
