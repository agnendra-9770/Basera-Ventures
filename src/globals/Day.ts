import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { introFields, seoTab } from '../fields'
import { revalidateGlobal } from '../hooks/revalidate'
import { DAY_TIMES } from '../lib/constants'
import { previewPath } from '../lib/preview'

export const Day: GlobalConfig = {
  slug: 'day',
  label: 'A day here',
  admin: {
    group: 'Website',
    description:
      'The “A day here” story, told from first light to lamplight. One photograph and a few sentences per moment.',
    preview: () => previewPath('/a-day-here'),
  },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        { name: 'intro', label: 'Opening', fields: introFields() },
        {
          label: 'Moments',
          fields: [
            {
              name: 'moments',
              type: 'array',
              labels: { singular: 'Moment', plural: 'Moments' },
              admin: { description: 'In order through the day. The page colour shifts with the time you choose.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'time', type: 'select', required: true, options: DAY_TIMES },
                    { name: 'timeLabel', type: 'text', label: 'Clock time', admin: { description: 'Optional, e.g. "6:40 am"' } },
                  ],
                },
                { name: 'title', type: 'text', required: true },
                { name: 'text', type: 'textarea', required: true },
                { name: 'image', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
        {
          name: 'closing',
          label: 'Closing',
          fields: [
            { name: 'heading', type: 'text' },
            { name: 'text', type: 'textarea' },
          ],
        },
        seoTab,
      ],
    },
  ],
}
