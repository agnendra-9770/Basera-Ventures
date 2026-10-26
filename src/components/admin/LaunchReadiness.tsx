import type { Payload } from 'payload'
import React from 'react'

import { findPlaceholders, hasPlaceholder } from '../../lib/placeholders'

type Check = { label: string; detail: string; done: boolean; href: string; optional?: boolean }

const filled = (value: unknown) => typeof value === 'string' && value.trim() !== '' && !hasPlaceholder(value)

async function buildReport(payload: Payload) {
  const [settings, home, story, day, destination, pages] = await Promise.all([
    payload.findGlobal({ slug: 'settings', depth: 0 }),
    payload.findGlobal({ slug: 'home', depth: 0 }),
    payload.findGlobal({ slug: 'story', depth: 0 }),
    payload.findGlobal({ slug: 'day', depth: 0 }),
    payload.findGlobal({ slug: 'destination', depth: 0 }),
    payload.findGlobal({ slug: 'pages', depth: 0 }),
  ])
  const [stays, experiences, faqs, journal, reviews, places, inquiries] = await Promise.all([
    payload.find({ collection: 'stays', depth: 0, limit: 100, draft: false }),
    payload.find({ collection: 'experiences', depth: 0, limit: 100 }),
    payload.find({ collection: 'faqs', depth: 0, limit: 200 }),
    payload.find({ collection: 'journal', depth: 0, limit: 100, where: { _status: { equals: 'published' } } }),
    payload.count({ collection: 'testimonials', where: { verified: { equals: true } } }),
    payload.count({ collection: 'places' }),
    payload.count({ collection: 'inquiries', where: { status: { equals: 'new' } } }),
  ])

  const publishedStays = stays.docs.filter((s) => s._status === 'published')
  const completeStays = publishedStays.filter((s) => s.maxGuests && (s.gallery?.length ?? 0) >= 3)

  const checks: Check[] = [
    {
      label: 'Brand & location',
      detail: 'Name, property type and where you are',
      done: filled(settings.brandName) && filled(settings.propertyType) && filled(settings.location),
      href: '/admin/globals/settings',
    },
    {
      label: 'Contact details',
      detail: 'Phone, WhatsApp or email — and your full address',
      done:
        (filled(settings.contact?.phone) || filled(settings.contact?.whatsapp) || filled(settings.contact?.email)) &&
        (filled(settings.address?.street) || filled(settings.address?.city)),
      href: '/admin/globals/settings',
    },
    {
      label: 'Policies',
      detail: 'Check-in, check-out and cancellation',
      done:
        filled(settings.policies?.checkIn) &&
        filled(settings.policies?.checkOut) &&
        filled(settings.policies?.cancellation),
      href: '/admin/globals/settings',
    },
    {
      label: 'Stays',
      detail: 'At least one published stay with guest numbers and three or more photographs',
      done: completeStays.length > 0,
      href: '/admin/collections/stays',
    },
    {
      label: 'Destination guide',
      detail: 'How to get here, when to come, and what to know',
      done: (destination.gettingHere?.routes?.length ?? 0) > 0 && findPlaceholders(destination).length === 0,
      href: '/admin/globals/destination',
    },
    {
      label: 'Places on the compass',
      detail: 'Three or more real places you recommend',
      done: places.totalDocs >= 3,
      href: '/admin/collections/places',
      optional: true,
    },
    {
      label: 'Guest reviews',
      detail: 'Real reviews, verified and attributed',
      done: reviews.totalDocs > 0,
      href: '/admin/collections/testimonials',
      optional: true,
    },
    {
      label: 'Search Console & analytics',
      detail: 'Verification code and (optionally) Google Analytics',
      done: filled(settings.seo?.googleVerification),
      href: '/admin/globals/settings',
      optional: true,
    },
  ]

  const sources: { label: string; href: string; doc: unknown }[] = [
    { label: 'Site settings', href: '/admin/globals/settings', doc: settings },
    { label: 'Homepage', href: '/admin/globals/home', doc: home },
    { label: 'Our story page', href: '/admin/globals/story', doc: story },
    { label: 'A day here', href: '/admin/globals/day', doc: day },
    { label: 'Destination guide', href: '/admin/globals/destination', doc: destination },
    { label: 'Other pages', href: '/admin/globals/pages', doc: pages },
    ...stays.docs.map((d) => ({ label: `Stay · ${d.name}`, href: `/admin/collections/stays/${d.id}`, doc: d })),
    ...experiences.docs.map((d) => ({
      label: `Experience · ${d.title}`,
      href: `/admin/collections/experiences/${d.id}`,
      doc: d,
    })),
    ...journal.docs.map((d) => ({ label: `Journal · ${d.title}`, href: `/admin/collections/journal/${d.id}`, doc: d })),
    ...faqs.docs.map((d) => ({ label: `FAQ · ${d.question}`, href: `/admin/collections/faqs/${d.id}`, doc: d })),
  ]

  const placeholders = sources
    .map((s) => ({ ...s, found: findPlaceholders(s.doc) }))
    .filter((s) => s.found.length > 0)

  return { checks, placeholders, isLive: Boolean(settings.seo?.isLive), newInquiries: inquiries.totalDocs }
}

const styles = {
  wrap: {
    border: '1px solid var(--theme-elevation-150)',
    borderRadius: 6,
    padding: '28px 32px',
    marginBottom: 32,
    background: 'var(--theme-elevation-0)',
  },
  head: { display: 'flex', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' as const, alignItems: 'baseline' },
  h2: { margin: 0, fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 28 },
  muted: { color: 'var(--theme-elevation-600)', margin: '6px 0 0', fontSize: 14 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12, marginTop: 24 },
  item: {
    display: 'block',
    padding: '14px 16px',
    border: '1px solid var(--theme-elevation-100)',
    borderRadius: 4,
    textDecoration: 'none',
    color: 'inherit',
  },
  pill: (ok: boolean) => ({
    display: 'inline-block',
    fontSize: 11,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    padding: '2px 8px',
    borderRadius: 99,
    marginBottom: 6,
    background: ok ? 'var(--theme-success-100)' : 'var(--theme-elevation-100)',
    color: ok ? 'var(--theme-success-800)' : 'var(--theme-elevation-800)',
  }),
}

export async function LaunchReadiness({ payload }: { payload: Payload }) {
  let report: Awaited<ReturnType<typeof buildReport>>
  try {
    report = await buildReport(payload)
  } catch (error) {
    payload.logger.error({ err: error }, 'Launch readiness could not be built')
    return null
  }

  const { checks, placeholders, isLive, newInquiries } = report
  const required = checks.filter((c) => !c.optional)
  const doneCount = required.filter((c) => c.done).length
  const placeholderCount = placeholders.reduce((sum, p) => sum + p.found.length, 0)

  return (
    <section style={styles.wrap} aria-labelledby="launch-readiness">
      <div style={styles.head}>
        <div>
          <h2 id="launch-readiness" style={styles.h2}>
            {isLive ? 'Your site is live' : 'Launch readiness'}
          </h2>
          <p style={styles.muted}>
            {isLive
              ? 'Search engines may index the site. Keep content current — especially rates and availability notes.'
              : `${doneCount} of ${required.length} essentials done · ${placeholderCount} placeholder${placeholderCount === 1 ? '' : 's'} left. When ready, tick “The site is live” in Site settings → Search & launch.`}
          </p>
        </div>
        <a href="/admin/collections/inquiries" style={{ ...styles.item, padding: '10px 14px' }}>
          <strong>{newInquiries}</strong> new {newInquiries === 1 ? 'inquiry' : 'inquiries'} →
        </a>
      </div>

      <div style={styles.grid}>
        {checks.map((check) => (
          <a key={check.label} href={check.href} style={styles.item}>
            <span style={styles.pill(check.done)}>
              {check.done ? 'Done' : check.optional ? 'Recommended' : 'To do'}
            </span>
            <div style={{ fontWeight: 600 }}>{check.label}</div>
            <div style={{ ...styles.muted, marginTop: 2 }}>{check.detail}</div>
          </a>
        ))}
      </div>

      {placeholders.length > 0 && (
        <details style={{ marginTop: 24 }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
            Where the {placeholderCount} placeholders are
          </summary>
          <ul style={{ margin: '12px 0 0', paddingLeft: 18, lineHeight: 1.8 }}>
            {placeholders.map((p) => (
              <li key={p.href}>
                <a href={p.href}>{p.label}</a>{' '}
                <span style={{ color: 'var(--theme-elevation-600)' }}>
                  — {Array.from(new Set(p.found)).slice(0, 4).join(', ')}
                  {new Set(p.found).size > 4 ? '…' : ''}
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  )
}
