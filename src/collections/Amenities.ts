import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { revalidateHooks } from '../hooks/revalidate'
import { AMENITY_CATEGORIES, ICON_NAMES } from '../lib/constants'

export const Amenities: CollectionConfig = {
  slug: 'amenities',
  labels: { singular: 'Amenity', plural: 'Amenities' },
  orderable: true,
  admin: {
    group: 'Stays',
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'shared'],
    description:
      'Your amenity library. Add each thing once, then pick it on every stay that has it. Only list what guests will actually find.',
  },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  hooks: revalidateHooks,
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'note',
      type: 'text',
      admin: { description: 'Optional detail, e.g. "Induction cooktop and electric kettle".' },
    },
    {
      type: 'row',
      fields: [
        { name: 'category', type: 'select', required: true, options: AMENITY_CATEGORIES },
        {
          name: 'icon',
          type: 'select',
          options: ICON_NAMES.map((name) => ({ label: name, value: name })),
        },
      ],
    },
    {
      name: 'shared',
      type: 'checkbox',
      label: 'Shared facility',
      defaultValue: false,
      admin: {
        description:
          'Tick for facilities every guest can use (a pool, a dining room). These appear under “Shared spaces” on every stay.',
      },
    },
  ],
}
