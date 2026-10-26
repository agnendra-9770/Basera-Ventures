import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { revalidateHooks } from '../hooks/revalidate'
import { DIRECTIONS, PLACE_CATEGORIES, TRAVEL_MODES } from '../lib/constants'

export const Places: CollectionConfig = {
  slug: 'places',
  labels: { singular: 'Place', plural: 'Places nearby' },
  orderable: true,
  admin: {
    group: 'Destination',
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'travelMinutes', 'direction'],
    description:
      'Real places you recommend — they appear on the destination compass and in the guide. A rough direction and travel time is all it needs.',
  },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  hooks: revalidateHooks,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'category', type: 'select', required: true, options: PLACE_CATEGORIES },
    { name: 'description', type: 'textarea', admin: { description: 'Why you send guests here.' } },
    { name: 'tip', type: 'text', label: 'Host’s tip', admin: { description: 'e.g. "Go before 8 am, when the light is soft."' } },
    {
      type: 'row',
      fields: [
        {
          name: 'direction',
          type: 'select',
          required: true,
          options: DIRECTIONS,
          admin: { description: 'Roughly which way from the property?' },
        },
        {
          name: 'travelMinutes',
          type: 'number',
          required: true,
          min: 1,
          label: 'Travel time (minutes)',
        },
        { name: 'mode', type: 'select', options: TRAVEL_MODES, defaultValue: 'car', label: 'Usually reached' },
        { name: 'distanceKm', type: 'number', min: 0, label: 'Distance (km)' },
      ],
    },
    { name: 'mapsUrl', type: 'text', label: 'Google Maps link' },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}
