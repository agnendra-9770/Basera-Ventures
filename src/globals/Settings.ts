import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'
import { BOOKING_PLATFORMS, CURRENCIES } from '../lib/constants'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Site settings',
  admin: {
    group: 'Settings',
    description:
      'The facts the whole site is built on. Anything still in [BRACKETS] is a placeholder shown on the site until you replace it.',
  },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Brand',
          fields: [
            {
              name: 'brandName',
              type: 'text',
              required: true,
              defaultValue: '[BRAND NAME]',
              admin: { description: 'Replaces {brand} everywhere on the site.' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'propertyType',
                  type: 'text',
                  required: true,
                  defaultValue: '[PROPERTY TYPE]',
                  admin: { description: 'e.g. homestay, villa, cottage, boutique stay. Replaces {propertyType}.' },
                },
                {
                  name: 'usp',
                  type: 'text',
                  label: 'What makes you distinct',
                  defaultValue: '[PROPERTY USP]',
                  admin: { description: 'One plain phrase. Replaces {usp}.' },
                },
              ],
            },
            { name: 'tagline', type: 'text', admin: { description: 'A short line shown under the name in the footer.' } },
            {
              type: 'row',
              fields: [
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description:
                      'Optional. The Basera logo is built in and follows the brand name above (Basera Ventures or Basera Venture). Upload a file only to replace it.',
                  },
                },
                { name: 'logoOnDark', type: 'upload', relationTo: 'media', label: 'Logo for dark backgrounds' },
              ],
            },
          ],
        },
        {
          label: 'Location',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'location',
                  type: 'text',
                  required: true,
                  defaultValue: '[CITY / REGION]',
                  admin: { description: 'How you describe where you are, e.g. "Old Manali". Replaces {location}.' },
                },
                {
                  name: 'nearbyCity',
                  type: 'text',
                  defaultValue: '[NEARBY CITY]',
                  admin: { description: 'The big city weekenders come from. Replaces {nearbyCity}.' },
                },
              ],
            },
            {
              name: 'address',
              type: 'group',
              fields: [
                { name: 'street', type: 'text', label: 'Street address' },
                {
                  type: 'row',
                  fields: [
                    { name: 'locality', type: 'text', label: 'Area / locality' },
                    { name: 'city', type: 'text' },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'region', type: 'text', label: 'State / region' },
                    { name: 'postalCode', type: 'text', label: 'PIN / postal code' },
                    { name: 'country', type: 'text', defaultValue: 'India' },
                  ],
                },
              ],
            },
            {
              name: 'geo',
              type: 'group',
              label: 'Map coordinates',
              admin: { description: 'In Google Maps, right-click your door and click the numbers to copy them.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'latitude', type: 'number' },
                    { name: 'longitude', type: 'number' },
                  ],
                },
              ],
            },
            { name: 'mapsUrl', type: 'text', label: 'Google Maps link (for directions)' },
            {
              name: 'mapEmbedUrl',
              type: 'text',
              label: 'Google Maps embed link',
              admin: { description: 'Google Maps → Share → Embed a map → copy only the link inside src="…".' },
            },
          ],
        },
        {
          label: 'Contact',
          name: 'contact',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'phone', type: 'text', admin: { description: 'With country code, e.g. +91 98765 43210' } },
                {
                  name: 'whatsapp',
                  type: 'text',
                  label: 'WhatsApp number',
                  admin: { description: 'With country code. Turns on WhatsApp buttons across the site.' },
                },
              ],
            },
            { name: 'email', type: 'email' },
            {
              type: 'row',
              fields: [
                {
                  name: 'responseTime',
                  type: 'text',
                  defaultValue: '[RESPONSE TIME]',
                  admin: { description: 'An honest promise, e.g. "a few hours" or "the same day".' },
                },
                { name: 'hours', type: 'text', label: 'When you answer', admin: { description: 'e.g. "9 am – 9 pm IST"' } },
              ],
            },
          ],
        },
        {
          label: 'Booking',
          name: 'booking',
          description:
            'How guests book. The site never pretends a booking is confirmed — without a booking engine, guests send an inquiry and you reply.',
          fields: [
            {
              name: 'mode',
              type: 'select',
              defaultValue: 'inquiry',
              required: true,
              options: [
                { label: 'Inquiry — we check dates and reply personally', value: 'inquiry' },
                { label: 'External booking engine — send guests there with their dates', value: 'engine' },
              ],
            },
            {
              name: 'engineUrl',
              type: 'text',
              label: 'Booking engine link',
              admin: {
                condition: (_, siblingData) => siblingData?.mode === 'engine',
                description:
                  'Put {arrival}, {departure}, {adults}, {children} and {stay} where your engine expects them, e.g. https://book.example.com/?checkin={arrival}&checkout={departure}&adults={adults}',
              },
            },
            {
              name: 'channels',
              type: 'array',
              label: 'Listings on other platforms',
              labels: { singular: 'Listing', plural: 'Listings' },
              admin: { description: 'Shown as “Also on Airbnb” style links.' },
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
            {
              name: 'whatsappMessage',
              type: 'textarea',
              label: 'WhatsApp opening message',
              defaultValue: 'Hello! I would like to ask about staying at {brand}.',
            },
            {
              type: 'row',
              fields: [
                { name: 'currency', type: 'select', defaultValue: 'INR', options: CURRENCIES },
                {
                  name: 'paymentNote',
                  type: 'text',
                  label: 'How guests pay',
                  defaultValue: '[PAYMENT TERMS — e.g. an advance by UPI or bank transfer confirms your booking]',
                },
              ],
            },
          ],
        },
        {
          label: 'Policies',
          name: 'policies',
          description: 'Defaults for every stay. A stay can override any of these.',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'checkIn', type: 'text', label: 'Check-in from', defaultValue: '[CHECK-IN TIME]' },
                { name: 'checkOut', type: 'text', label: 'Check-out by', defaultValue: '[CHECK-OUT TIME]' },
              ],
            },
            { name: 'cancellation', type: 'textarea', defaultValue: '[CANCELLATION POLICY]' },
            {
              name: 'houseRules',
              type: 'array',
              labels: { singular: 'Rule', plural: 'House rules' },
              fields: [{ name: 'rule', type: 'text', required: true }],
            },
            {
              type: 'row',
              fields: [
                { name: 'children', type: 'text', label: 'Children', defaultValue: '[CHILD POLICY]' },
                { name: 'pets', type: 'text', label: 'Pets', defaultValue: '[PET POLICY]' },
              ],
            },
            {
              name: 'idRequirements',
              type: 'text',
              label: 'ID at check-in',
              defaultValue: '[ID REQUIREMENTS]',
            },
          ],
        },
        {
          label: 'Social',
          name: 'social',
          fields: [
            { name: 'instagram', type: 'text' },
            { name: 'facebook', type: 'text' },
            { name: 'youtube', type: 'text' },
            { name: 'googleBusiness', type: 'text', label: 'Google Business Profile link' },
            { name: 'tripadvisor', type: 'text' },
          ],
        },
        {
          label: 'Search & launch',
          name: 'seo',
          fields: [
            {
              name: 'isLive',
              type: 'checkbox',
              defaultValue: false,
              label: 'The site is live — allow search engines to index it',
              admin: {
                description:
                  'Leave this off until the placeholders are replaced. While off, search engines are asked to stay away and empty sections show setup guides instead of hiding.',
              },
            },
            {
              name: 'businessType',
              type: 'select',
              defaultValue: 'LodgingBusiness',
              label: 'Type of business (for Google)',
              options: [
                { label: 'Lodging business (general)', value: 'LodgingBusiness' },
                { label: 'Bed & breakfast / homestay', value: 'BedAndBreakfast' },
                { label: 'Hotel', value: 'Hotel' },
                { label: 'Resort', value: 'Resort' },
                { label: 'Hostel', value: 'Hostel' },
              ],
            },
            {
              name: 'defaultDescription',
              type: 'textarea',
              label: 'Default search description',
              defaultValue:
                '{brand} is a {propertyType} in {location} — warm-lit studios with kitchenettes, a courtyard pool and a dining room. Book direct with the hosts.',
            },
            { name: 'shareImage', type: 'upload', relationTo: 'media', label: 'Default share image' },
            {
              type: 'row',
              fields: [
                {
                  name: 'googleVerification',
                  type: 'text',
                  label: 'Google Search Console code',
                  admin: { description: 'Only the content="…" value of the HTML-tag method.' },
                },
                { name: 'bingVerification', type: 'text', label: 'Bing Webmaster code' },
              ],
            },
            {
              name: 'ga4Id',
              type: 'text',
              label: 'Google Analytics 4 measurement ID',
              admin: { description: 'Looks like G-XXXXXXXXXX. Analytics loads only after a visitor accepts.' },
            },
            {
              name: 'vacationRental',
              type: 'checkbox',
              label: 'Eligible for Google vacation-rental listings',
              defaultValue: false,
              admin: {
                description:
                  'Only tick this if Google has approved you for vacation-rental structured data (through a Hotel Center / vacation-rental partner integration) and each stay is a whole unit with coordinates and at least 8 photos.',
              },
            },
          ],
        },
      ],
    },
  ],
}
