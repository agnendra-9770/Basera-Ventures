import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { introFields, seoTab, tokenHelp } from '../fields'
import { revalidateGlobal } from '../hooks/revalidate'
import { previewPath } from '../lib/preview'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Homepage',
  admin: {
    group: 'Website',
    description: `The homepage, section by section. ${tokenHelp}`,
    preview: () => previewPath('/'),
  },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'hero',
          label: 'Hero',
          fields: [
            { name: 'eyebrow', type: 'text' },
            {
              name: 'headline',
              type: 'text',
              required: true,
              admin: { description: 'Wrap words in *asterisks* for italics. A line break is added after each full stop.' },
            },
            { name: 'subheadline', type: 'textarea' },
            {
              type: 'row',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { description: 'Landscape, at least 2400 px wide. Set its focal point.' },
                },
                {
                  name: 'mobileImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Phone image (portrait)',
                  admin: { description: 'Optional portrait crop for phones.' },
                },
              ],
            },
            {
              name: 'video',
              type: 'upload',
              relationTo: 'media',
              filterOptions: { mimeType: { contains: 'video' } },
              admin: {
                description:
                  'Optional muted background film (MP4, 10–25 seconds, under 8 MB). The image above is shown first and to visitors who prefer reduced motion.',
              },
            },
            {
              type: 'row',
              fields: [
                { name: 'primaryLabel', type: 'text', defaultValue: 'Explore the Stay' },
                { name: 'secondaryLabel', type: 'text', defaultValue: 'Check Availability' },
              ],
            },
          ],
        },
        {
          name: 'story',
          label: 'The story',
          fields: [
            ...introFields(),
            {
              name: 'lines',
              type: 'array',
              label: 'Manifesto lines',
              labels: { singular: 'Line', plural: 'Lines' },
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            {
              type: 'row',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Portrait works best — it is framed in an arch.' } },
                { name: 'detailImage', type: 'upload', relationTo: 'media' },
              ],
            },
            { name: 'linkLabel', type: 'text', defaultValue: 'Read our story' },
          ],
        },
        {
          name: 'moments',
          label: 'Find your moment',
          fields: [
            ...introFields(),
            {
              name: 'items',
              type: 'array',
              labels: { singular: 'Moment', plural: 'Moments' },
              admin: { description: 'One per kind of trip you genuinely cater for. Drag to reorder.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, admin: { description: 'The short tab label, e.g. "Two of you".' } },
                    { name: 'title', type: 'text', required: true },
                  ],
                },
                { name: 'description', type: 'textarea', required: true },
                { name: 'image', type: 'upload', relationTo: 'media' },
                {
                  name: 'highlights',
                  type: 'array',
                  labels: { singular: 'Point', plural: 'Points' },
                  fields: [{ name: 'text', type: 'text', required: true }],
                },
                {
                  name: 'stay',
                  type: 'relationship',
                  relationTo: 'stays',
                  label: 'Suggested stay',
                },
              ],
            },
          ],
        },
        {
          name: 'signature',
          label: 'Signature experiences',
          fields: [
            ...introFields(),
            {
              name: 'experiences',
              type: 'relationship',
              relationTo: 'experiences',
              hasMany: true,
              admin: { description: 'Pick and order them. Leave empty to show experiences marked “Feature on the homepage”.' },
            },
          ],
        },
        {
          name: 'day',
          label: 'A day here',
          fields: introFields(),
        },
        {
          name: 'collage',
          label: 'Visual journal',
          fields: [
            ...introFields(),
            {
              name: 'images',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              admin: { description: 'Six or seven photographs, mixing wide and tall. Drag to reorder.' },
            },
          ],
        },
        {
          name: 'stories',
          label: 'Guest reviews',
          fields: [
            { name: 'eyebrow', type: 'text' },
            { name: 'heading', type: 'text' },
          ],
        },
        {
          name: 'destination',
          label: 'Destination',
          fields: [...introFields(), { name: 'image', type: 'upload', relationTo: 'media' }],
        },
        {
          name: 'invitation',
          label: 'Final invitation',
          fields: [
            ...introFields(),
            { name: 'image', type: 'upload', relationTo: 'media' },
            { name: 'buttonLabel', type: 'text', defaultValue: 'Check Availability' },
          ],
        },
        seoTab,
      ],
    },
  ],
}
