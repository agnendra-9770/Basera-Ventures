'use client'

import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { useEffect, useState } from 'react'

/**
 * Reveals [data-reveal] elements as they scroll into view. Without JavaScript,
 * or with reduced motion, everything is simply visible.
 */
export function RevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    ;(window as unknown as { __revealReady?: boolean }).__revealReady = true
    const pending = () => document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)')

    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      pending().forEach((el) => el.classList.add('is-in'))
      return
    }

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            io.unobserve(entry.target)
          }
        }),
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
    )
    const observeAll = () => pending().forEach((el) => io.observe(el))
    observeAll()
    const mo = new MutationObserver(observeAll)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [pathname])

  return null
}

/** Runs before paint: enables reveal styles, with a safety net if scripts fail. */
export const revealBootScript = `document.documentElement.classList.add('js');setTimeout(function(){if(!window.__revealReady){document.documentElement.classList.remove('js')}},3500);`

const CONSENT_KEY = 'analytics-consent'

/**
 * Google Analytics 4, loaded only after the visitor agrees.
 * Nothing is stored or sent before that.
 */
export function Analytics({ id }: { id: string }) {
  const [consent, setConsent] = useState<'granted' | 'denied' | 'unknown' | null>(null)

  useEffect(() => {
    let stored: string | null = null
    try {
      stored = localStorage.getItem(CONSENT_KEY)
    } catch {
      // Storage unavailable (private mode) — ask every visit.
    }
    setConsent(stored === 'granted' || stored === 'denied' ? stored : 'unknown')
  }, [])

  const choose = (value: 'granted' | 'denied') => {
    try {
      localStorage.setItem(CONSENT_KEY, value)
    } catch {
      // ignore
    }
    setConsent(value)
  }

  if (!/^G-[A-Z0-9]{4,}$/.test(id)) return null

  return (
    <>
      {consent === 'granted' && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${id}');`}
          </Script>
        </>
      )}
      {consent === 'unknown' && (
        <div className="consent" role="region" aria-label="Analytics cookies">
          <p>
            May we use analytics cookies to learn which pages help guests most? Nothing else is tracked.{' '}
            <a href="/privacy">Privacy notice</a>
          </p>
          <div className="consent__actions">
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => choose('denied')}>
              No, thanks
            </button>
            <button type="button" className="btn btn--solid btn--sm" onClick={() => choose('granted')}>
              Allow
            </button>
          </div>
        </div>
      )}
    </>
  )
}

/** Shown to editors previewing unpublished drafts. */
export function PreviewBar() {
  const pathname = usePathname()
  return (
    <div className="preview-bar" role="status">
      <span>Previewing drafts</span>
      <a href={`/next/exit-preview?path=${encodeURIComponent(pathname)}`}>Exit preview</a>
    </div>
  )
}
