import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { authenticated, authenticatedOrPublished } from '../access'
import { seoFields, slugField } from '../fields'
import { revalidateHooks } from '../hooks/revalidate'
import { JOURNAL_CATEGORIES } from '../lib/constants'
import { previewPath } from '../lib/preview'

const stampPublishedAt: CollectionBeforeChangeHook = ({ data }) => {
  if (data?._status === 'published' && !data.publishedAt) {
    data.publishedAt = new Date().toISOString()
  }
  return data
}

export const Journal: CollectionConfig = {
  slug: 'journal',
  labels: { singular: 'Journal story', plural: 'Journal' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
    description:
      'Destination guides and stories. Write what a guest would genuinely want to know — specific, first-hand, useful. That is also what Google rewards.',
    preview: (doc) => previewPath(`/journal/${doc?.slug ?? ''}`),
  },
  versions: { drafts: true, maxPerDoc: 25 },
  defaultSort: '-publishedAt',
  access: {
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    beforeChange: [stampPublishedAt],
    ...revalidateHooks,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Story',
          fields: [
            {
              name: 'excerpt',
              type: 'textarea',
              required: true,
              admin: { description: 'One or two sentences for cards and the default Google description.' },
            },
            { name: 'coverImage', type: 'upload', relationTo: 'media' },
            { name: 'body', type: 'richText', required: true },
          ],
        },
        { name: 'seo', label: 'Search & sharing', fields: seoFields },
      ],
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'notes',
      options: JOURNAL_CATEGORIES,
      admin: { position: 'sidebar', description: '“Destination guide” stories also appear on the Destination page.' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    { name: 'author', type: 'text', admin: { position: 'sidebar' } },
    {
      name: 'relatedStays',
      type: 'relationship',
      relationTo: 'stays',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
  ],
}
