import type { CollectionConfig } from 'payload'

import { authenticated, authenticatedOrPublished } from '../access'
import { seoTab, slugField } from '../fields'
import { revalidateHooks } from '../hooks/revalidate'
import { BOOKING_PLATFORMS, MOMENTS, STAY_TYPES } from '../lib/constants'
import { previewPath } from '../lib/preview'

export const Stays: CollectionConfig = {
  slug: 'stays',
  labels: { singular: 'Stay', plural: 'Stays' },
  orderable: true,
  admin: {
    group: 'Stays',
    useAsTitle: 'name',
    defaultColumns: ['name', 'stayType', 'maxGuests', '_status', 'updatedAt'],
    description:
      'Each studio, room, villa or cottage guests can book. With only one stay, the site adapts automatically — no listing page, no filters.',
    preview: (doc) => previewPath(`/stays/${doc?.slug ?? ''}`),
  },
  versions: { drafts: true, maxPerDoc: 25 },
  access: {
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: revalidateHooks,
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name'),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Story',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'stayType', type: 'select', required: true, defaultValue: 'studio', options: STAY_TYPES },
                {
                  name: 'tagline',
                  type: 'text',
                  admin: { description: 'One evocative line, e.g. "Sage velvet, a kitchenette and lamplight".' },
                },
              ],
            },
            {
              name: 'summary',
              type: 'textarea',
              required: true,
              maxLength: 420,
              admin: { description: 'Two or three sentences. Used on cards and as the default Google description.' },
            },
            {
              name: 'description',
              type: 'richText',
              admin: { description: 'The fuller story of this stay — what it feels like, what is where.' },
            },
            {
              name: 'highlights',
              type: 'array',
              labels: { singular: 'Highlight', plural: 'Highlights' },
              admin: {
                description: 'What makes this stay distinct. Only things a guest will actually find.',
                initCollapsed: true,
              },
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'text', type: 'textarea' },
              ],
            },
            {
              name: 'moments',
              type: 'select',
              hasMany: true,
              options: MOMENTS,
              label: 'Best suited to',
              admin: { description: 'Which trips is this stay right for? Used by “Find your moment”.' },
            },
            {
              name: 'area',
              type: 'text',
              label: 'Neighbourhood',
              admin: { description: 'The area guests should know this home by, e.g. "Raja Park".' },
            },
            {
              name: 'locationNote',
              type: 'textarea',
              label: 'About the location',
              admin: { description: 'What is close by, how quiet it is, how to find the door.' },
            },
            {
              name: 'nearby',
              type: 'array',
              label: 'Close by',
              labels: { singular: 'Place', plural: 'Places' },
              admin: { initCollapsed: true },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'place', type: 'text', required: true },
                    { name: 'distance', type: 'text', admin: { description: 'e.g. "1.9 km"' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Photos & video',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Featured image',
              admin: { description: 'The lead photograph, used on cards and at the top of the page.' },
            },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              admin: {
                description: 'Select several at once, or upload new ones. Drag to reorder.',
              },
            },
            {
              name: 'video',
              type: 'upload',
              relationTo: 'media',
              filterOptions: { mimeType: { contains: 'video' } },
              admin: { description: 'Optional walk-through video (MP4). Keep it under a minute.' },
            },
          ],
        },
        {
          label: 'Rooms & amenities',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'maxGuests', type: 'number', min: 1, label: 'Sleeps (max guests)' },
                { name: 'bedrooms', type: 'number', min: 0 },
                { name: 'bathrooms', type: 'number', min: 0 },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'size', type: 'number', min: 0, label: 'Size' },
                {
                  name: 'sizeUnit',
                  type: 'select',
                  defaultValue: 'sqft',
                  options: [
                    { label: 'sq ft', value: 'sqft' },
                    { label: 'm²', value: 'sqm' },
                  ],
                },
              ],
            },
            {
              name: 'sleeping',
              type: 'array',
              label: 'Sleeping arrangements',
              labels: { singular: 'Space', plural: 'Spaces' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'space', type: 'text', required: true, admin: { description: 'e.g. "Studio" or "Bedroom 1"' } },
                    { name: 'beds', type: 'text', required: true, admin: { description: 'e.g. "1 queen bed"' } },
                  ],
                },
              ],
            },
            {
              name: 'amenities',
              type: 'relationship',
              relationTo: 'amenities',
              hasMany: true,
              admin: {
                description: 'Pick from your amenity library. Shared facilities (pool, dining room) are added automatically.',
              },
            },
            {
              name: 'accessibility',
              type: 'textarea',
              admin: {
                description:
                  'Floor level, lift access, steps, door widths, grab rails — honest detail helps guests who need it.',
              },
            },
          ],
        },
        {
          label: 'Rates & booking',
          description:
            'Prices are optional. Only enter a rate you actively keep up to date — when blank, guests are invited to ask instead.',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'priceFrom', type: 'number', min: 0, label: 'Price from' },
                {
                  name: 'priceUnit',
                  type: 'select',
                  defaultValue: 'night',
                  options: [
                    { label: 'per night', value: 'night' },
                    { label: 'per week', value: 'week' },
                    { label: 'per month', value: 'month' },
                  ],
                },
                {
                  name: 'ratesCheckedOn',
                  type: 'date',
                  label: 'Rate last checked',
                  admin: { description: 'Shown next to the price so guests know it is current.' },
                },
              ],
            },
            { name: 'priceNote', type: 'text', admin: { description: 'e.g. "Taxes extra · weekend rates vary".' } },
            {
              type: 'row',
              fields: [
                { name: 'minNights', type: 'number', min: 1, label: 'Minimum nights' },
                {
                  name: 'maxNights',
                  type: 'number',
                  min: 1,
                  label: 'Maximum nights',
                  admin: { description: 'Optional. Longer stays are asked to get in touch.' },
                },
              ],
            },
            {
              name: 'availability',
              type: 'group',
              label: 'Availability calendar',
              admin: {
                description:
                  'Keeps the website calendar in step with your bookings: booked nights are greyed out, so guests only pick dates you can host. Only signed-in editors can see these links and notes.',
              },
              // The links contain a private token, so they never leave the server.
              access: { read: ({ req }) => Boolean(req.user) },
              fields: [
                {
                  name: 'calendars',
                  type: 'array',
                  label: 'Calendar links (iCal)',
                  admin: {
                    description:
                      'Airbnb: Listings → this listing → Availability → Connect calendars → Export calendar → copy the link and paste it here. Booking.com, Vrbo and Google Calendar offer the same kind of link. Re-checked every 15 minutes.',
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'platform', type: 'select', required: true, defaultValue: 'airbnb', options: BOOKING_PLATFORMS },
                        {
                          name: 'url',
                          type: 'text',
                          required: true,
                          validate: (value: string | null | undefined) =>
                            !value || /^https:\/\/\S+$/.test(value.trim()) || 'Paste the full https:// calendar link.',
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'blocked',
                  type: 'array',
                  label: 'Dates you block yourself',
                  admin: {
                    description:
                      'Bookings taken by phone or WhatsApp, maintenance, family visits. From the first night to the last night you can’t host.',
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'from', type: 'date', required: true, label: 'First night', admin: { date: { pickerAppearance: 'dayOnly' } } },
                        { name: 'to', type: 'date', required: true, label: 'Last night', admin: { date: { pickerAppearance: 'dayOnly' } } },
                        { name: 'note', type: 'text', admin: { description: 'Only you see this.' } },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: 'rating',
              type: 'group',
              label: 'Guest rating on a booking platform',
              admin: {
                description:
                  'Copy it exactly from the platform (e.g. Airbnb) and update the date when you check it. Shown with a link to the listing; never added to Google markup as your own rating.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'score', type: 'number', min: 0, max: 5, admin: { step: 0.01, description: 'e.g. 4.96' } },
                    { name: 'count', type: 'number', min: 0, label: 'Number of reviews' },
                    {
                      name: 'platform',
                      type: 'select',
                      defaultValue: 'airbnb',
                      options: BOOKING_PLATFORMS,
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'badge', type: 'text', admin: { description: 'e.g. "Guest favourite"' } },
                    { name: 'checkedOn', type: 'date', label: 'Checked on', admin: { date: { pickerAppearance: 'dayOnly' } } },
                  ],
                },
              ],
            },
            {
              name: 'bookingLinks',
              type: 'array',
              label: 'This stay on other platforms',
              admin: { description: 'Direct links to this exact listing on Airbnb, Booking.com and so on.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'platform', type: 'select', required: true, options: BOOKING_PLATFORMS },
                    { name: 'url', type: 'text', required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Policies & FAQs',
          description: 'Leave blank to use the defaults from Site settings → Policies.',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'checkIn', type: 'text', label: 'Check-in (override)' },
                { name: 'checkOut', type: 'text', label: 'Check-out (override)' },
              ],
            },
            {
              name: 'houseRules',
              type: 'array',
              labels: { singular: 'Rule', plural: 'House rules' },
              fields: [{ name: 'rule', type: 'text', required: true }],
            },
            { name: 'cancellation', type: 'textarea', label: 'Cancellation policy (override)' },
            {
              name: 'faqs',
              type: 'array',
              label: 'Questions about this stay',
              labels: { singular: 'Question', plural: 'Questions' },
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
            },
          ],
        },
        seoTab,
      ],
    },
  ],
}
