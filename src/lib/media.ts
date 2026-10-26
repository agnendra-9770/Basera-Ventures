import type { Media } from '@/payload-types'

/** Relationship values arrive as ids or as populated documents. */
export const asMedia = (value: unknown): Media | null =>
  value && typeof value === 'object' && 'url' in value && (value as Media).url ? (value as Media) : null

export const asMediaList = (values: unknown): Media[] =>
  Array.isArray(values) ? values.map(asMedia).filter((m): m is Media => Boolean(m)) : []

export const isVideo = (media?: Media | null) => Boolean(media?.mimeType?.startsWith('video/'))

const relative = (url?: string | null) => (url ? url.replace(/^https?:\/\/[^/]+/, '') : '')

/** Same-origin path for an upload, versioned so replaced files are never served stale. */
export const mediaSrc = (media: Media) => {
  const path = relative(media.url)
  const version = media.updatedAt ? Date.parse(media.updatedAt) : 0
  return version ? `${path}?v=${version}` : path
}

export const focalPosition = (media: Media) => `${media.focalX ?? 50}% ${media.focalY ?? 50}%`

export const orientation = (media: Media): 'portrait' | 'landscape' | 'square' => {
  if (!media.width || !media.height) return 'landscape'
  const ratio = media.width / media.height
  if (ratio > 1.1) return 'landscape'
  if (ratio < 0.9) return 'portrait'
  return 'square'
}

/** Absolute URL of the 1200×630 social crop (falls back to the original). */
export const shareImageUrl = (media: Media | null | undefined, base: string) => {
  if (!media || isVideo(media)) return undefined
  const path = relative(media.sizes?.og?.url || media.url)
  return path ? `${base}${path}` : undefined
}

export const absoluteMediaUrl = (media: Media, base: string) => `${base}${relative(media.url)}`
