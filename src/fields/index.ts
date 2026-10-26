import type { Field, FieldHook } from 'payload'

export const toSlug = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

const formatSlug =
  (fallback: string): FieldHook =>
  ({ value, data, originalDoc }) => {
    if (typeof value === 'string' && value.trim()) return toSlug(value)
    const source = data?.[fallback] ?? originalDoc?.[fallback]
    return typeof source === 'string' ? toSlug(source) : value
  }

export const slugField = (fallback = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  label: 'Web address (slug)',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description:
      'Created from the title automatically. Short, lowercase and descriptive works best — changing it later breaks old links.',
  },
  hooks: { beforeValidate: [formatSlug(fallback)] },
})

export const orderField: Field = {
  name: 'sortOrder',
  type: 'number',
  label: 'Order',
  admin: { position: 'sidebar', description: 'Lower numbers come first.' },
}

export const seoFields: Field[] = [
  {
    name: 'title',
    type: 'text',
    label: 'Search title',
    admin: {
      description:
        'Aim for 50–60 characters. Lead with what a guest would search for, e.g. "Studio with kitchenette in {location}". Leave blank for a sensible default.',
    },
  },
  {
    name: 'description',
    type: 'textarea',
    label: 'Search description',
    admin: {
      description:
        '140–160 characters. A specific, honest invitation: what is here and who it suits. Shown under the title in Google.',
    },
  },
  {
    name: 'image',
    type: 'upload',
    relationTo: 'media',
    label: 'Share image',
    admin: {
      description: 'Shown when the page is shared on WhatsApp, Facebook or LinkedIn. Landscape photographs work best.',
    },
  },
  {
    name: 'noindex',
    type: 'checkbox',
    label: 'Hide this page from search engines',
  },
]

/** A tab containing the search & sharing fields, stored under `seo`. */
export const seoTab = {
  name: 'seo',
  label: 'Search & sharing',
  fields: seoFields,
}

/** Eyebrow + heading + intro, reused by most page sections. */
export const introFields = (defaults: { eyebrow?: string; heading?: string; intro?: string } = {}): Field[] => [
  { name: 'eyebrow', type: 'text', defaultValue: defaults.eyebrow, admin: { description: 'The small label above the heading.' } },
  {
    name: 'heading',
    type: 'text',
    defaultValue: defaults.heading,
    admin: { description: 'Wrap words in *asterisks* to set them in italics.' },
  },
  { name: 'intro', type: 'textarea', defaultValue: defaults.intro },
]

export const tokenHelp =
  'You can write {brand}, {location}, {propertyType}, {nearbyCity}, {responseTime}, {checkIn}, {checkOut}, {cancellation}, {payment}, {children}, {pets} or {idPolicy} — each is replaced with its value from Site settings.'
