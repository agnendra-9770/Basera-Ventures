import Link from 'next/link'

import type { Site } from '@/lib/data'
import { fillEngineUrl, telHref, whatsappHref } from '@/lib/format'
import { asMedia } from '@/lib/media'
import { real } from '@/lib/placeholders'
import { plain, Tx } from '@/lib/text'

import { Img } from '../media/Img'
import { ArchMark } from '../ui/ArchMark'
import { Icon } from '../ui/Icon'
import { HeaderClient, MobileBookBar, type NavItem } from './HeaderClient'

/** Where "Check availability" goes: the booking engine if one is set up, otherwise our inquiry form. */
export const bookingTarget = (site: Site, label = 'Check availability') => {
  const engine = real(site.settings.booking?.engineUrl)
  if (site.settings.booking?.mode === 'engine' && engine) {
    return { href: fillEngineUrl(engine, {}), label, external: true }
  }
  return { href: '/contact#book', label, external: false }
}

export const staysHref = (site: Site) => (site.stays.length === 1 ? `/stays/${site.stays[0].slug}` : '/stays')

export const primaryNav = (site: Site): NavItem[] => [
  { href: staysHref(site), label: site.stays.length === 1 ? 'The Stay' : 'Stays' },
  { href: '/experiences', label: 'Experiences' },
  { href: '/our-story', label: 'Our Story' },
  { href: '/destination', label: 'Destination' },
  { href: '/journal', label: 'Journal' },
]

const secondaryNav: NavItem[] = [
  { href: '/a-day-here', label: 'A Day Here' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/faqs', label: 'FAQs' },
  { href: '/contact', label: 'Contact & Book' },
]

export const whatsappLink = (site: Site, message?: string) =>
  site.whatsapp
    ? whatsappHref(site.whatsapp, plain(message ?? site.settings.booking?.whatsappMessage ?? `Hello! I'd like to ask about staying at ${site.brand}.`))
    : null

export function Wordmark({ site, size = 'md' }: { site: Site; size?: 'md' | 'lg' }) {
  const logo = asMedia(site.settings.logo)
  const logoDark = asMedia(site.settings.logoOnDark)
  if (logo) {
    return (
      <span className={`wordmark wordmark--image wordmark--${size}`}>
        <Img media={logo} intrinsic sizes="240px" className="wordmark__img wordmark__img--default" alt={plain(site.brand)} />
        {logoDark && (
          <Img media={logoDark} intrinsic sizes="240px" className="wordmark__img wordmark__img--dark" alt={plain(site.brand)} />
        )}
      </span>
    )
  }
  return (
    <span className={`wordmark wordmark--${size}`}>
      <ArchMark className="wordmark__mark" />
      <span className="wordmark__name">
        <Tx>{site.brand}</Tx>
      </span>
    </span>
  )
}

const contactLinks = (site: Site) => {
  const c = site.settings.contact
  const links: { label: string; href: string; icon: 'whatsapp' | 'phone' | 'mail' }[] = []
  const wa = whatsappLink(site)
  if (wa) links.push({ label: 'WhatsApp', href: wa, icon: 'whatsapp' })
  if (real(c?.phone)) links.push({ label: c!.phone!, href: telHref(c!.phone!), icon: 'phone' })
  if (real(c?.email)) links.push({ label: c!.email!, href: `mailto:${c!.email}`, icon: 'mail' })
  return links
}

export function SiteHeader({ site }: { site: Site }) {
  return (
    <HeaderClient
      primary={primaryNav(site)}
      secondary={secondaryNav}
      wordmark={<Wordmark site={site} />}
      brandLabel={plain(site.brand)}
      book={bookingTarget(site)}
      contact={contactLinks(site)}
      footnote={
        <p className="menu__note">
          <Tx>{`${site.settings.propertyType} · ${site.settings.location}`}</Tx>
        </p>
      }
    />
  )
}

export function SiteFooter({ site }: { site: Site }) {
  const s = site.settings
  const a = s.address
  const addressLines = [a?.street, [a?.locality, a?.city].filter(Boolean).join(', '), [a?.region, a?.postalCode].filter(Boolean).join(' '), a?.country]
    .map((line) => line?.trim())
    .filter((line): line is string => Boolean(line))
  const hasAddress = Boolean(real(a?.street) || real(a?.city))
  const social = [
    { href: s.social?.instagram, icon: 'instagram' as const, label: 'Instagram' },
    { href: s.social?.facebook, icon: 'facebook' as const, label: 'Facebook' },
    { href: s.social?.youtube, icon: 'youtube' as const, label: 'YouTube' },
  ].filter((item) => real(item.href))
  const links = contactLinks(site)
  const year = new Date().getFullYear()
  const book = bookingTarget(site)

  return (
    <footer className="footer on-dark">
      <div className="footer__band" aria-hidden="true" />
      <div className="container footer__grid">
        <div className="footer__brand">
          <Link href="/" className="footer__wordmark" aria-label={`${plain(site.brand)} — home`}>
            <Wordmark site={site} size="lg" />
          </Link>
          {s.tagline && (
            <p className="footer__tagline">
              <Tx>{s.tagline}</Tx>
            </p>
          )}
          {book.external ? (
            <a className="btn btn--light" href={book.href} target="_blank" rel="noopener noreferrer">
              {book.label}
            </a>
          ) : (
            <Link className="btn btn--light" href={book.href}>
              {book.label}
            </Link>
          )}
        </div>

        <nav className="footer__col" aria-label="Explore">
          <p className="label">Explore</p>
          <ul>
            {primaryNav(site)
              .slice(0, 3)
              .map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            <li>
              <Link href="/a-day-here">A Day Here</Link>
            </li>
            <li>
              <Link href="/gallery">Gallery</Link>
            </li>
          </ul>
        </nav>

        <nav className="footer__col" aria-label="Plan your stay">
          <p className="label">Plan</p>
          <ul>
            <li>
              <Link href="/destination">Destination guide</Link>
            </li>
            <li>
              <Link href="/journal">Journal</Link>
            </li>
            <li>
              <Link href="/faqs">FAQs</Link>
            </li>
            <li>
              <Link href="/contact">Contact & Book</Link>
            </li>
          </ul>
        </nav>

        <div className="footer__col footer__contact">
          <p className="label">Find us</p>
          <address>
            {hasAddress ? (
              addressLines.map((line) => (
                <span key={line}>
                  <Tx>{line}</Tx>
                </span>
              ))
            ) : !site.isLive ? (
              <span>
                <Tx>{`[STREET ADDRESS] · ${s.location}`}</Tx>
              </span>
            ) : (
              <span>
                <Tx>{s.location}</Tx>
              </span>
            )}
          </address>
          {links.length > 0 ? (
            <ul className="footer__links">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                    <Icon name={link.icon} size={16} />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            !site.isLive && (
              <p>
                <Tx>[PHONE] · [EMAIL] · [WHATSAPP]</Tx>
              </p>
            )
          )}
          {social.length > 0 && (
            <ul className="footer__social">
              {social.map((item) => (
                <li key={item.icon}>
                  <a href={item.href!} target="_blank" rel="noopener noreferrer">
                    <Icon name={item.icon} size={20} />
                    <span className="sr-only">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="container footer__bottom">
        <p>
          © {year} <Tx>{site.brand}</Tx>
        </p>
        <ul>
          <li>
            <Link href="/privacy">Privacy</Link>
          </li>
          <li>
            <a href="/sitemap.xml">Sitemap</a>
          </li>
          <li>
            <a href="#main" className="footer__top">
              Back to top ↑
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}

export function MobileBar({ site }: { site: Site }) {
  return <MobileBookBar book={bookingTarget(site)} whatsapp={whatsappLink(site)} />
}

export function SetupBadge() {
  return (
    <a className="setup-badge" href="/admin">
      <span className="setup-badge__dot" aria-hidden="true" />
      Setup mode — text in [brackets] is a placeholder
    </a>
  )
}
