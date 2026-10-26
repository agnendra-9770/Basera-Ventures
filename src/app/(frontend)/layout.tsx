import type { Metadata, Viewport } from 'next'
import { Fraunces, Instrument_Sans } from 'next/font/google'
import { draftMode } from 'next/headers'
import type { ReactNode } from 'react'

import { Analytics, PreviewBar, RevealObserver, revealBootScript } from '@/components/layout/Client'
import { MobileBar, SetupBadge, SiteFooter, SiteHeader } from '@/components/layout/SiteChrome'
import { getSite } from '@/lib/data'
import { real } from '@/lib/placeholders'
import { plain } from '@/lib/text'

import './styles/base.css'
import './styles/layout.css'
import './styles/components.css'
import './styles/sections.css'
import './styles/pages.css'

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  axes: ['SOFT', 'opsz'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const sans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()
  const bing = real(site.settings.seo?.bingVerification)
  return {
    metadataBase: new URL(site.url),
    applicationName: plain(site.brand),
    formatDetection: { telephone: false, address: false, email: false },
    verification: {
      google: real(site.settings.seo?.googleVerification),
      ...(bing ? { other: { 'msvalidate.01': bing } } : {}),
    },
  }
}

export const viewport: Viewport = {
  themeColor: '#f7f2ea',
  width: 'device-width',
  initialScale: 1,
}

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const site = await getSite()
  const { isEnabled: previewing } = await draftMode()
  const ga4 = real(site.settings.seo?.ga4Id)

  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealBootScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader site={site} />
        <main id="main">{children}</main>
        <SiteFooter site={site} />
        <MobileBar site={site} />
        <RevealObserver />
        {!site.isLive && <SetupBadge />}
        {previewing && <PreviewBar />}
        {ga4 && <Analytics id={ga4} />}
      </body>
    </html>
  )
}
