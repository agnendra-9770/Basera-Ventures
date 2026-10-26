import type { CollectionConfig } from 'payload'

import { authenticated, authenticatedOrVerified } from '../access'
import { revalidateHooks } from '../hooks/revalidate'
import { REVIEW_SOURCES } from '../lib/constants'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Guest review', plural: 'Guest reviews' },
  orderable: true,
  admin: {
    group: 'Content',
    useAsTitle: 'guestName',
    defaultColumns: ['guestName', 'source', 'verified', 'featured'],
    description:
      'Only reviews real guests wrote — copied word for word, with a link to the original wherever possible. A review stays hidden until “Verified” is ticked.',
  },
  access: {
    read: authenticatedOrVerified,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: revalidateHooks,
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      admin: { description: 'Exactly as the guest wrote it. You may shorten with “…”, never reword.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'guestName',
          type: 'text',
          required: true,
          admin: { description: 'As shown on the source, e.g. "Ananya" or "Rohan & Meera".' },
        },
        { name: 'guestFrom', type: 'text', label: 'Where they are from', admin: { description: 'Only if they shared it.' } },
        { name: 'stayedIn', type: 'text', label: 'When they stayed', admin: { description: 'e.g. "March 2026"' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'source', type: 'select', required: true, options: REVIEW_SOURCES },
        { name: 'sourceUrl', type: 'text', label: 'Link to the original review' },
        {
          name: 'rating',
          type: 'number',
          min: 1,
          max: 5,
          admin: { description: 'Only if the source shows a star rating.' },
        },
      ],
    },
    { name: 'stay', type: 'relationship', relationTo: 'stays', admin: { position: 'sidebar' } },
    {
      name: 'consent',
      type: 'checkbox',
      label: 'The guest agreed to be quoted',
      admin: {
        position: 'sidebar',
        description: 'Required for reviews sent to you directly (messages, emails, guestbook).',
      },
      validate: (value: boolean | null | undefined, { siblingData }: { siblingData: Record<string, unknown> }) =>
        siblingData?.source === 'direct' && !value
          ? 'Please confirm the guest agreed to be quoted.'
          : true,
    },
    {
      name: 'verified',
      type: 'checkbox',
      label: 'Verified — this is a genuine, unaltered review',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Show on the homepage',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
}
