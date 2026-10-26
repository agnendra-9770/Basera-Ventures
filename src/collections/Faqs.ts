import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { tokenHelp } from '../fields'
import { revalidateHooks } from '../hooks/revalidate'
import { FAQ_CATEGORIES } from '../lib/constants'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  orderable: true,
  admin: {
    group: 'Content',
    useAsTitle: 'question',
    defaultColumns: ['question', 'category'],
    description: 'Answer the questions guests actually ask before booking. Drag to reorder.',
  },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  hooks: revalidateHooks,
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true, admin: { description: tokenHelp } },
    { name: 'category', type: 'select', required: true, defaultValue: 'stay', options: FAQ_CATEGORIES },
  ],
}
