import path from 'path'
import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { anyone, authenticated } from '../access'
import { revalidateHooks } from '../hooks/revalidate'
import { MEDIA_CATEGORIES } from '../lib/constants'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/** Stores a tiny blurred preview so photos fade in softly instead of popping. */
const addBlurPlaceholder: CollectionBeforeChangeHook = async ({ data, req }) => {
  const file = req.file
  if (file?.data && file.mimetype?.startsWith('image/') && !file.mimetype.includes('svg')) {
    try {
      const buffer = await sharp(file.data).resize(24, 24, { fit: 'inside' }).webp({ quality: 50 }).toBuffer()
      data.blurDataUrl = `data:image/webp;base64,${buffer.toString('base64')}`
    } catch (error) {
      req.payload.logger.warn({ err: error }, 'Could not create blur placeholder')
    }
  }
  return data
}

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Photo or video', plural: 'Photos & videos' },
  orderable: true,
  admin: {
    group: 'Library',
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'category', 'showInGallery', 'postcard'],
    listSearchableFields: ['alt', 'caption', 'filename'],
    description:
      'Every photograph and video on the site. Drop in several files at once to bulk-upload; drag rows to set the gallery order. After uploading, set a focal point so crops keep the important part of the picture.',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    beforeChange: [addBlurPlaceholder],
    ...revalidateHooks,
  },
  upload: {
    staticDir: path.resolve(dirname, '../../media'),
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/webm'],
    focalPoint: true,
    crop: true,
    adminThumbnail: 'thumbnail',
    // Very large originals are scaled down on upload; the site then serves
    // modern AVIF/WebP versions at exactly the size each screen needs.
    resizeOptions: { width: 3200, height: 3200, fit: 'inside', withoutEnlargement: true },
    imageSizes: [
      { name: 'thumbnail', width: 480, formatOptions: { format: 'webp', options: { quality: 76 } } },
      {
        name: 'og',
        width: 1200,
        height: 630,
        formatOptions: { format: 'jpeg', options: { quality: 82, mozjpeg: true } },
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Description (alt text)',
      admin: {
        description:
          'Describe what is in the picture, plainly — e.g. "Studio with a sage velvet headboard and warm wall lights". Read aloud by screen readers and used by Google.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: { description: 'Optional. A short editorial caption shown in galleries.' },
    },
    {
      name: 'category',
      type: 'select',
      options: MEDIA_CATEGORIES,
      admin: { position: 'sidebar', description: 'Used for the gallery filters.' },
    },
    {
      name: 'showInGallery',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show in the gallery',
      admin: { position: 'sidebar' },
    },
    {
      name: 'postcard',
      type: 'checkbox',
      defaultValue: false,
      label: 'Feature in “Postcards from here”',
      admin: { position: 'sidebar' },
    },
    {
      name: 'credit',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Photographer, or the guest who shared it. Shown on postcards and in the gallery.',
      },
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      label: 'Video thumbnail',
      filterOptions: { mimeType: { contains: 'image' } },
      admin: {
        description: 'For videos: the still image shown before the video plays.',
        condition: (data) => Boolean(data?.mimeType?.startsWith('video/')),
      },
    },
    {
      name: 'blurDataUrl',
      type: 'text',
      admin: { hidden: true },
    },
  ],
}
