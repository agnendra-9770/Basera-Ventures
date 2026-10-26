import type { Field, GlobalConfig, Tab } from 'payload'

import { anyone, authenticated } from '../access'
import { introFields, seoFields, tokenHelp } from '../fields'
import { revalidateGlobal } from '../hooks/revalidate'

const pageTab = (name: string, label: string, extra: Field[] = []): Tab => ({
  name,
  label,
  fields: [
    ...introFields(),
    { name: 'image', type: 'upload', relationTo: 'media' },
    ...extra,
    {
      name: 'seo',
      type: 'group',
      label: 'Search & sharing',
      fields: seoFields,
    },
  ],
})

export const Pages: GlobalConfig = {
  slug: 'pages',
  label: 'Other pages',
  admin: {
    group: 'Website',
    description: `Opening words and search settings for the remaining pages. ${tokenHelp}`,
  },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        pageTab('stays', 'Our stays'),
        pageTab('experiences', 'Experiences'),
        pageTab('gallery', 'Gallery', [
          { name: 'postcardsHeading', type: 'text', label: 'Postcards heading' },
          { name: 'postcardsIntro', type: 'textarea', label: 'Postcards intro' },
        ]),
        pageTab('journal', 'Journal'),
        pageTab('faqs', 'FAQs'),
        pageTab('contact', 'Contact & book', [
          {
            name: 'nextSteps',
            type: 'array',
            label: 'What happens after an inquiry',
            labels: { singular: 'Step', plural: 'Steps' },
            fields: [
              { name: 'title', type: 'text', required: true },
              { name: 'text', type: 'textarea' },
            ],
          },
        ]),
        pageTab('privacy', 'Privacy', [
          {
            name: 'body',
            type: 'richText',
            admin: { description: 'Have this reviewed for your jurisdiction before launch.' },
          },
        ]),
      ],
    },
  ],
}
