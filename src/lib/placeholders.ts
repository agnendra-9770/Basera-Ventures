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

const MASKED = /\u0001\d+\u0002/

/**
 * Text as visitors see it: any sentence still holding a placeholder is left out
 * ("·"-separated parts are dropped one by one), so "Daily · [POOL HOURS]" reads "Daily".
 */
export const withoutPlaceholders = (value: string): string => {
  if (!hasPlaceholder(value)) return value
  let n = 0
  // Masked first, so full stops inside a placeholder ("e.g.") don't split it.
  const masked = value.replace(PLACEHOLDER_ALL, () => `\u0001${n++}\u0002`)
  return masked
    .split('\n')
    .map((line) =>
      line
        .split(/(?<=[.!?…])\s+/)
        .map((sentence) =>
          !MASKED.test(sentence)
            ? sentence
            : sentence.includes(' · ')
              ? sentence
                  .split(' · ')
                  .filter((part) => !MASKED.test(part))
                  .join(' · ')
              : '',
        )
        .filter((sentence) => sentence.trim())
        .join(' '),
    )
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

type RichText = { root: { type: string; children?: unknown[] } }
type LexicalNode = { type?: string; text?: string; children?: LexicalNode[] }

const isRichText = (value: unknown): value is RichText =>
  typeof value === 'object' && value !== null && 'root' in value && (value as RichText).root?.type === 'root'

const cleanLexical = (node: LexicalNode): LexicalNode | null => {
  if (typeof node.text === 'string') {
    const text = withoutPlaceholders(node.text)
    return text.trim() || !hasPlaceholder(node.text) ? { ...node, text } : null
  }
  if (!Array.isArray(node.children) || !node.children.length) return node
  const children = node.children.map(cleanLexical).filter((child): child is LexicalNode => child !== null)
  return children.length ? { ...node, children } : null
}

/** A list entry that only held a placeholder: a string now empty, or a row (not a document) with a field now empty. */
const emptied = (before: unknown, after: unknown): boolean => {
  if (typeof before === 'string') return hasPlaceholder(before) && !String(after ?? '').trim()
  if (!before || typeof before !== 'object' || Array.isArray(before) || 'createdAt' in before) return false
  const now = after as Record<string, unknown>
  return Object.entries(before).some(([key, value]) => {
    if (SKIP_KEYS.has(key)) return false
    if (typeof value === 'string') return hasPlaceholder(value) && !String(now[key] ?? '').trim()
    if (isRichText(value)) return findPlaceholders(value).length > 0 && now[key] === null
    return false
  })
}

/**
 * A document as visitors see it: unfinished sentences, list rows and rich-text
 * paragraphs are left out, so no "[PLACEHOLDER]" ever reaches the public site.
 * Editors previewing in the CMS still see everything.
 */
export const forVisitors = <T>(value: T): T => {
  if (typeof value === 'string') return withoutPlaceholders(value) as T
  if (Array.isArray(value)) {
    return value.map((item) => forVisitors(item)).filter((item, i) => !emptied(value[i], item)) as T
  }
  if (isRichText(value)) {
    const root = cleanLexical(value.root as LexicalNode)
    return (root ? { ...value, root } : null) as T
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) out[k] = SKIP_KEYS.has(k) ? v : forVisitors(v)
    return out as T
  }
  return value
}

/** Plain text with placeholders removed — for meta tags when a value is optional. */
export const stripPlaceholders = (value: string) =>
  value.replace(PLACEHOLDER_ALL, '').replace(/\s{2,}/g, ' ').replace(/\s+([,.;:])/g, '$1').trim()
