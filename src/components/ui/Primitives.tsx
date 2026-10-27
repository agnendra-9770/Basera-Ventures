import Link from 'next/link'
import type { ReactNode } from 'react'

import type { IconName } from '@/lib/constants'
import { cx } from '@/lib/cx'
import { Tx } from '@/lib/text'

import { Icon } from './Icon'

type CtaProps = {
  href: string
  children: ReactNode
  variant?: 'solid' | 'light' | 'ghost' | 'ghost-light' | 'text'
  icon?: IconName
  size?: 'md' | 'sm'
  className?: string
  external?: boolean
  ariaLabel?: string
}

/** Every call to action on the site. External links open safely in a new tab. */
export function Cta({ href, children, variant = 'solid', icon, size = 'md', className, external, ariaLabel }: CtaProps) {
  const classes = cx(variant === 'text' ? 'link-arrow' : 'btn', variant !== 'text' && `btn--${variant}`, size === 'sm' && 'btn--sm', className)
  const content = (
    <>
      <span>{children}</span>
      {icon && <Icon name={icon} size={variant === 'text' ? 16 : 18} />}
    </>
  )
  const isExternal = external ?? /^https?:\/\//.test(href)
  if (isExternal || href.startsWith('tel:') || href.startsWith('mailto:')) {
    return (
      <a
        className={classes}
        href={href}
        aria-label={ariaLabel}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    )
  }
  return (
    <Link className={classes} href={href} aria-label={ariaLabel}>
      {content}
    </Link>
  )
}

/** Eyebrow, heading and intro — the opening of almost every section. */
export function SectionHead({
  eyebrow,
  heading,
  intro,
  as: Heading = 'h2',
  size = 'l',
  layout = 'stack',
  align = 'start',
  className,
  light,
  children,
}: {
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
  as?: 'h1' | 'h2' | 'h3'
  size?: 'xl' | 'l' | 'm' | 's'
  layout?: 'stack' | 'split'
  align?: 'start' | 'center'
  className?: string
  light?: boolean
  children?: ReactNode
}) {
  if (!eyebrow && !heading && !intro) return null
  return (
    <header className={cx('section-head', `section-head--${layout}`, align === 'center' && 'section-head--center', light && 'on-dark', className)}>
      <div className="section-head__title">
        {eyebrow && (
          <p className="eyebrow" data-reveal>
            <Tx>{eyebrow}</Tx>
          </p>
        )}
        {heading && (
          <Heading className={`display-${size}`} data-reveal style={{ ['--d' as string]: 1 }}>
            <Tx>{heading}</Tx>
          </Heading>
        )}
      </div>
      {(intro || children) && (
        <div className="section-head__intro" data-reveal style={{ ['--d' as string]: 2 }}>
          {intro && (
            <p className="lead text-soft">
              <Tx>{intro}</Tx>
            </p>
          )}
          {children}
        </div>
      )}
    </header>
  )
}

/**
 * Shown only in setup mode (before launch) where a section has nothing real
 * to show yet. Once the site is live, empty sections simply disappear.
 */

export function JsonLd({ data }: { data: unknown }) {
  const items = (Array.isArray(data) ? data : [data]).filter(Boolean)
  if (!items.length) return null
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, '\\u003c') }}
        />
      ))}
    </>
  )
}

export function Breadcrumbs({ trail }: { trail: { name: string; path: string }[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {trail.map((item, i) => (
          <li key={item.path}>
            {i < trail.length - 1 ? (
              <Link href={item.path}>
                <Tx>{item.name}</Tx>
              </Link>
            ) : (
              <span aria-current="page">
                <Tx>{item.name}</Tx>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
