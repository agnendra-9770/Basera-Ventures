import type { MetadataRoute } from 'next'

import { getSite } from '@/lib/data'
import { real } from '@/lib/placeholders'
import { plain } from '@/lib/text'

/** Name and icons for "Add to home screen". Icons are built by brand/source/build_logo.py. */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const site = await getSite()
  const name = real(plain(site.brand)) ?? 'Home'
  return {
    name,
    short_name: name.split(' ')[0],
    description: real(plain(site.settings.tagline ?? '')),
    start_url: '/',
    display: 'browser',
    background_color: '#f7f2ea',
    theme_color: '#2a2622',
    icons: [
      { src: '/brand/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/brand/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
