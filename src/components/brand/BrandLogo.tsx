import type { CSSProperties } from 'react'

import type { LogoSpelling } from '@/lib/brand'
import { cx } from '@/lib/cx'

import { LOCKUPS, SYMBOL } from './logo-data'

// Drawn in the current text colour. The doorway stays gold unless a parent sets
// --logo-light; the second line follows the text unless a parent sets --logo-sub.
const light = { fill: 'var(--logo-light, #a88a57)' }
const sub = { fill: 'var(--logo-sub, currentColor)' }

type Props = { className?: string; style?: CSSProperties }

/** Symbol + BASERA / VENTURES. Decorative: label the link or element around it. */
export function BrandLockup({ spelling, className, style }: Props & { spelling: LogoSpelling }) {
  const logo = LOCKUPS[spelling]
  return (
    <svg className={cx('brand-logo', className)} style={style} viewBox={logo.viewBox} fill="currentColor" aria-hidden="true" focusable="false">
      <path style={light} d={logo.light} />
      <path d={logo.mark} />
      <path d={logo.name} />
      <path style={sub} d={logo.sub} />
    </svg>
  )
}

/** The symbol alone: the B with its lit doorway. */
export function BrandSymbol({ className, style }: Props) {
  return (
    <svg className={cx('brand-logo', className)} style={style} viewBox={SYMBOL.viewBox} fill="currentColor" aria-hidden="true" focusable="false">
      <path style={light} d={SYMBOL.light} />
      <path d={SYMBOL.mark} />
    </svg>
  )
}
