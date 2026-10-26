/**
 * Placeholders and tokens.
 *
 * - A placeholder is any text in square brackets starting with a capital,
 *   e.g. "[CHECK-IN TIME]". The site styles them so they are obvious, keeps them
 *   out of structured data, and the CMS dashboard counts what is left.
 * - A token is a word in curly braces, e.g. "{brand}", replaced with the value
 *   from Site settings — so the brand name is typed once, not fifty times.
 */

const PLACEHOLDER = /\[[A-Z0-9][^\]\n]{0,160}\]/
const PLACEHOLDER_ALL = /\[[A-Z0-9][^\]\n]{0,160}\]/g

export const hasPlaceholder = (value?: string | null): boolean =>
  typeof value === 'string' && PLACEHOLDER.test(value)

/** Returns the value only if it is real content (not empty, not a placeholder). */
export const real = (value?: string | null): string | undefined =>
  typeof value === 'string' && value.trim() !== '' && !hasPlaceholder(value) ? value.trim() : undefined

const SKIP_KEYS = new Set(['id', 'url', 'filename', 'mimeType', 'blurDataUrl', 'createdAt', 'updatedAt', 'slug', 'sizes', 'thumbnailURL'])

/** Every placeholder found anywhere inside a document (including rich text). */
export const findPlaceholders = (doc: unknown): string[] => {
  const found: string[] = []
  const walk = (value: unknown, key?: string) => {
    if (key && SKIP_KEYS.has(key)) return
    if (typeof value === 'string') {
      const matches = value.match(PLACEHOLDER_ALL)
      if (matches) found.push(...matches)
    } else if (Array.isArray(value)) {
      value.forEach((item) => walk(item))
    } else if (value && typeof value === 'object') {
      for (const [k, v] of Object.entries(value)) walk(v, k)
    }
  }
  walk(doc)
  return found
}

export type Tokens = Record<string, string>

export const TOKEN_NAMES = [
  'brand',
  'location',
  'propertyType',
  'nearbyCity',
  'usp',
  'responseTime',
  'checkIn',
  'checkOut',
  'cancellation',
  'payment',
  'children',
  'pets',
  'idPolicy',
] as const

const TOKEN = new RegExp(`\\{(${TOKEN_NAMES.join('|')})\\}`, 'g')

export const interpolate = (value: string, tokens: Tokens): string =>
  value.replace(TOKEN, (match, key: string) => tokens[key] ?? match)

/** Replaces tokens in every string of a document, returning a new object. */
export const interpolateDeep = <T>(value: T, tokens: Tokens): T => {
  if (typeof value === 'string') return interpolate(value, tokens) as T
  if (Array.isArray(value)) return value.map((item) => interpolateDeep(item, tokens)) as T
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) {
      out[k] = SKIP_KEYS.has(k) ? v : interpolateDeep(v, tokens)
    }
    return out as T
  }
  return value
}

/** Plain text with placeholders removed — for meta tags when a value is optional. */
export const stripPlaceholders = (value: string) =>
  value.replace(PLACEHOLDER_ALL, '').replace(/\s{2,}/g, ' ').replace(/\s+([,.;:])/g, '$1').trim()
