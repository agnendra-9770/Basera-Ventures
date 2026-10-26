'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type ReactNode, useEffect, useRef, useState } from 'react'

import { cx } from '@/lib/cx'

import { Icon } from '../ui/Icon'

export type NavItem = { href: string; label: string }

type Props = {
  primary: NavItem[]
  secondary: NavItem[]
  wordmark: ReactNode
  brandLabel: string
  book: { href: string; label: string; external: boolean }
  contact: { label: string; href: string; icon: 'whatsapp' | 'phone' | 'mail' }[]
  footnote?: ReactNode
}

const BookLink = ({ book, className }: { book: Props['book']; className: string }) =>
  book.external ? (
    <a className={className} href={book.href} target="_blank" rel="noopener noreferrer">
      {book.label}
    </a>
  ) : (
    <Link className={className} href={book.href}>
      {book.label}
    </Link>
  )

export function HeaderClient({ primary, secondary, wordmark, brandLabel, book, contact, footnote }: Props) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the menu whenever the page changes.
  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
    document.documentElement.classList.toggle('menu-open', open)
  }, [open])

  const isActive = (href: string) => href !== '/' && (pathname === href || pathname.startsWith(`${href}/`))
  const start = primary.slice(0, 3)
  const end = primary.slice(3)

  const navLink = (item: NavItem) => (
    <li key={item.href}>
      <Link href={item.href} className="site-nav__link" aria-current={isActive(item.href) ? 'page' : undefined}>
        {item.label}
      </Link>
    </li>
  )

  return (
    <header className={cx('site-header', scrolled && 'is-scrolled')}>
      <div className="site-header__inner">
        <nav className="site-nav" aria-label="Primary">
          <ul className="site-nav__list site-nav__list--start">{start.map(navLink)}</ul>
          <Link href="/" className="site-nav__home" aria-label={`${brandLabel} — home`}>
            {wordmark}
          </Link>
          <ul className="site-nav__list site-nav__list--end">
            {end.map(navLink)}
            <li className="site-nav__book">
              <BookLink book={book} className="btn btn--solid btn--sm" />
            </li>
          </ul>
        </nav>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <Icon name="menu" size={26} />
        </button>
      </div>

      <dialog id="site-menu" ref={dialogRef} className="menu" aria-label="Menu" onClose={() => setOpen(false)}>
        <div className="menu__top">
          <Link href="/" className="site-nav__home" aria-label={`${brandLabel} — home`}>
            {wordmark}
          </Link>
          <button type="button" className="menu__close" onClick={() => setOpen(false)}>
            <span className="sr-only">Close menu</span>
            <Icon name="close" size={26} />
          </button>
        </div>
        <nav className="menu__nav" aria-label="Menu">
          <ol className="menu__primary">
            {primary.map((item, i) => (
              <li key={item.href} style={{ ['--i' as string]: i }}>
                <Link href={item.href} aria-current={isActive(item.href) ? 'page' : undefined}>
                  <span className="menu__num">{String(i + 1).padStart(2, '0')}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ol>
          <ul className="menu__secondary">
            {secondary.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="menu__foot">
          <BookLink book={book} className="btn btn--solid" />
          {contact.length > 0 && (
            <ul className="menu__contact">
              {contact.map((c) => (
                <li key={c.href}>
                  <a href={c.href} {...(c.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                    <Icon name={c.icon} size={18} />
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
          {footnote}
        </div>
      </dialog>
    </header>
  )
}

/** A slim "Check availability" bar for phones, shown once the visitor starts scrolling. */
export function MobileBookBar({
  book,
  whatsapp,
}: {
  book: Props['book']
  whatsapp?: string | null
}) {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY > document.body.scrollHeight - 260
      setVisible(window.scrollY > window.innerHeight * 0.6 && !nearBottom)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  if (pathname.startsWith('/contact')) return null

  return (
    <div className={cx('book-bar', visible && 'is-visible')} inert={!visible}>
      <BookLink book={book} className="btn btn--solid book-bar__main" />
      {whatsapp && (
        <a className="book-bar__icon" href={whatsapp} target="_blank" rel="noopener noreferrer">
          <span className="sr-only">Message us on WhatsApp</span>
          <Icon name="whatsapp" size={22} />
        </a>
      )}
    </div>
  )
}
