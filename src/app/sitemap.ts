import type { MetadataRoute } from 'next'

import { getPayloadClient, getSite } from '@/lib/data'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSite()
  const payload = await getPayloadClient()
  const [stays, posts] = await Promise.all([
    payload.find({ collection: 'stays', draft: false, overrideAccess: false, limit: 500, pagination: false, select: { slug: true, updatedAt: true } }),
    payload.find({ collection: 'journal', draft: false, overrideAccess: false, limit: 1000, pagination: false, select: { slug: true, updatedAt: true } }),
  ])

  const page = (path: string, priority: number, changeFrequency: 'weekly' | 'monthly' = 'monthly', lastModified?: string) => ({
    url: path === '/' ? `${site.url}/` : `${site.url}${path}`,
    lastModified: lastModified ? new Date(lastModified) : undefined,
    changeFrequency,
    priority,
  })

  return [
    page('/', 1, 'weekly'),
    ...(stays.docs.length > 1 ? [page('/stays', 0.9, 'weekly')] : []),
    ...stays.docs.filter((s) => s.slug).map((s) => page(`/stays/${s.slug}`, 0.9, 'weekly', s.updatedAt)),
    page('/experiences', 0.8),
    page('/our-story', 0.7),
    page('/a-day-here', 0.6),
    page('/destination', 0.8),
    page('/gallery', 0.6),
    page('/journal', 0.7, 'weekly'),
    ...posts.docs.filter((p) => p.slug).map((p) => page(`/journal/${p.slug}`, 0.6, 'monthly', p.updatedAt)),
    page('/faqs', 0.7),
    page('/contact', 0.8),
    page('/privacy', 0.2),
  ]
}
