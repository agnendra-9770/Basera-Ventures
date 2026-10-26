import type { CollectionConfig } from 'payload'

import { authenticated, authenticatedOrPublished } from '../access'
import { slugField } from '../fields'
import { revalidateHooks } from '../hooks/revalidate'
import { MOMENTS } from '../lib/constants'
import { previewPath } from '../lib/preview'

export const Experiences: CollectionConfig = {
  slug: 'experiences',
  labels: { singular: 'Experience', plural: 'Experiences' },
  orderable: true,
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'featured', '_status'],
    description:
      'Things guests can genuinely do or feel here — on site, nearby, or arranged on request. Never list something you cannot offer.',
    preview: (doc) => previewPath(`/experiences#${doc?.slug ?? ''}`),
  },
  versions: { drafts: true, maxPerDoc: 15 },
  access: {
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: revalidateHooks,
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    {
      type: 'row',
      fields: [
        {
          name: 'kind',
          type: 'select',
          required: true,
          defaultValue: 'onsite',
          options: [
            { label: 'At the stay', value: 'onsite' },
            { label: 'Nearby', value: 'nearby' },
            { label: 'Arranged on request', value: 'arranged' },
            { label: 'Seasonal', value: 'seasonal' },
          ],
        },
        {
          name: 'moments',
          type: 'select',
          hasMany: true,
          options: MOMENTS,
          label: 'Especially good for',
        },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: { description: 'Two or three vivid, specific sentences.' },
    },
    { name: 'body', type: 'richText', admin: { description: 'Optional longer story.' } },
    {
      type: 'row',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'detailImage', type: 'upload', relationTo: 'media', admin: { description: 'Optional second, smaller image.' } },
      ],
    },
    {
      name: 'details',
      type: 'group',
      admin: { description: 'Practical notes. Leave any of these blank to hide them.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'when', type: 'text', label: 'When', admin: { description: 'e.g. "Best at golden hour"' } },
            { name: 'duration', type: 'text' },
            { name: 'distance', type: 'text', admin: { description: 'For nearby experiences.' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'price', type: 'text', admin: { description: 'e.g. "Included" or "On request"' } },
            { name: 'booking', type: 'text', label: 'How to arrange it' },
          ],
        },
      ],
    },
    {
      name: 'relatedStays',
      type: 'relationship',
      relationTo: 'stays',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Feature on the homepage',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
