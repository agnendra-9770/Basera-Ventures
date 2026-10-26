import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { introFields, seoTab, tokenHelp } from '../fields'
import { revalidateGlobal } from '../hooks/revalidate'
import { ROUTE_MODES } from '../lib/constants'
import { previewPath } from '../lib/preview'

export const Destination: GlobalConfig = {
  slug: 'destination',
  label: 'Destination guide',
  admin: {
    group: 'Destination',
    description: `The practical guide to your area: how to get here, when to come, what to know. Specific, first-hand detail is what helps guests — and what search engines reward. ${tokenHelp}`,
    preview: () => previewPath('/destination'),
  },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'hero',
          label: 'Opening',
          fields: [...introFields(), { name: 'image', type: 'upload', relationTo: 'media' }],
        },
        {
          name: 'gettingHere',
          label: 'Getting here',
          fields: [
            ...introFields(),
            {
              name: 'routes',
              type: 'array',
              labels: { singular: 'Route', plural: 'Routes' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'mode', type: 'select', required: true, options: ROUTE_MODES },
                    { name: 'title', type: 'text', required: true },
                  ],
                },
                { name: 'text', type: 'textarea', required: true },
              ],
            },
          ],
        },
        {
          name: 'explorer',
          label: 'Compass',
          description: 'The places on the compass come from Destination → Places nearby.',
          fields: introFields(),
        },
        {
          name: 'seasons',
          label: 'When to come',
          fields: [
            ...introFields(),
            {
              name: 'items',
              type: 'array',
              labels: { singular: 'Season', plural: 'Seasons' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'months', type: 'text', required: true },
                    { name: 'title', type: 'text', required: true },
                  ],
                },
                { name: 'text', type: 'textarea' },
              ],
            },
          ],
        },
        {
          name: 'practical',
          label: 'Good to know',
          fields: [
            { name: 'heading', type: 'text' },
            {
              name: 'items',
              type: 'array',
              labels: { singular: 'Note', plural: 'Notes' },
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'text', type: 'textarea', required: true },
              ],
            },
          ],
        },
        seoTab,
      ],
    },
  ],
}
