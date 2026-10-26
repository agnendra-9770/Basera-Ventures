import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { introFields, seoTab, tokenHelp } from '../fields'
import { revalidateGlobal } from '../hooks/revalidate'
import { previewPath } from '../lib/preview'

export const Story: GlobalConfig = {
  slug: 'story',
  label: 'Our story page',
  admin: {
    group: 'Website',
    description: `The people, ideas and history behind the place. Only true stories — they are what make a brand worth returning to. ${tokenHelp}`,
    preview: () => previewPath('/our-story'),
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
          name: 'people',
          label: 'The people',
          fields: [
            { name: 'heading', type: 'text' },
            { name: 'text', type: 'textarea', admin: { description: 'Who you are and why you built this place, in your own voice.' } },
            { name: 'image', type: 'upload', relationTo: 'media' },
            {
              name: 'members',
              type: 'array',
              labels: { singular: 'Person', plural: 'People' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', required: true },
                    { name: 'role', type: 'text' },
                  ],
                },
                { name: 'photo', type: 'upload', relationTo: 'media' },
                { name: 'bio', type: 'textarea' },
              ],
            },
          ],
        },
        {
          name: 'philosophy',
          label: 'Design & philosophy',
          fields: [
            ...introFields(),
            {
              name: 'pillars',
              type: 'array',
              labels: { singular: 'Idea', plural: 'Ideas' },
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'text', type: 'textarea' },
                { name: 'image', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
        {
          name: 'local',
          label: 'Local connections',
          fields: [
            { name: 'heading', type: 'text' },
            { name: 'text', type: 'textarea' },
            { name: 'image', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          name: 'timeline',
          label: 'Timeline',
          description: 'Optional. Shown only when you add real milestones.',
          fields: [
            { name: 'heading', type: 'text' },
            {
              name: 'entries',
              type: 'array',
              labels: { singular: 'Milestone', plural: 'Milestones' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'year', type: 'text', required: true },
                    { name: 'title', type: 'text', required: true },
                  ],
                },
                { name: 'text', type: 'textarea' },
                { name: 'image', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
        {
          name: 'promise',
          label: 'Our promise',
          fields: [
            { name: 'heading', type: 'text' },
            {
              name: 'items',
              type: 'array',
              labels: { singular: 'Promise', plural: 'Promises' },
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'text', type: 'textarea' },
              ],
            },
          ],
        },
        seoTab,
      ],
    },
  ],
}
