import type { Payload } from 'payload'
import React from 'react'

import { BrandLockup, BrandSymbol } from '@/components/brand/BrandLogo'
import { logoSpelling } from '@/lib/brand'

const ArchMark = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 40 50" fill="none" aria-hidden="true">
    <path
      d="M3 49V20.5C3 18.6 4.1 17.6 5.6 17.2C7.3 16.8 8.1 15.6 8.6 13.9C10.3 7.6 14.6 3.4 20 1.6C25.4 3.4 29.7 7.6 31.4 13.9C31.9 15.6 32.7 16.8 34.4 17.2C35.9 17.6 37 18.6 37 20.5V49"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="20" cy="27" r="3.2" fill="currentColor" />
  </svg>
)

export async function Logo({ payload }: { payload?: Payload }) {
  let name = 'Studio'
  try {
    const settings = await payload?.findGlobal({ slug: 'settings', depth: 0 })
    if (settings?.brandName) name = settings.brandName
  } catch {
    // Database not ready yet (first run) — fall back to the generic name.
  }
  const spelling = logoSpelling(name)
  if (spelling) {
    return (
      <div role="img" aria-label={name}>
        <BrandLockup spelling={spelling} style={{ height: 64, width: 'auto', maxWidth: '100%' }} />
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <ArchMark size={30} />
      <span style={{ fontFamily: 'Georgia, serif', fontSize: 26, letterSpacing: '0.02em' }}>{name}</span>
    </div>
  )
}

export function Icon() {
  return <BrandSymbol style={{ height: 22, width: 'auto' }} />
}
