import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'

import { authenticated } from '../access'

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/** Emails the host when a new inquiry arrives — only if SMTP is configured. */
const notifyHost: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create' || !process.env.SMTP_HOST) return doc

  try {
    const settings = await req.payload.findGlobal({ slug: 'settings', depth: 0, req })
    const to = process.env.INQUIRY_NOTIFY_EMAIL || settings?.contact?.email
    if (!to) return doc

    const stay =
      typeof doc.stay === 'object' && doc.stay ? doc.stay.name : doc.stay ? `Stay #${doc.stay}` : 'Any stay'
    const rows: [string, unknown][] = [
      ['Name', doc.name],
      ['Email', doc.email],
      ['Phone', doc.phone],
      ['Prefers', doc.preferredContact],
      ['Stay', stay],
      ['Arrival', doc.checkIn?.slice(0, 10)],
      ['Departure', doc.checkOut?.slice(0, 10)],
      ['Guests', `${doc.adults ?? 0} adults, ${doc.children ?? 0} children`],
      ['Message', doc.message],
    ]

    await req.payload.sendEmail({
      to,
      replyTo: doc.email,
      subject: `New inquiry from ${doc.name}${doc.checkIn ? ` — ${doc.checkIn.slice(0, 10)}` : ''}`,
      html: `<h2 style="font-family:Georgia,serif;font-weight:400">New inquiry</h2><table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px">${rows
        .filter(([, v]) => v)
        .map(([k, v]) => `<tr><td style="color:#7a6f63">${k}</td><td>${escapeHtml(v)}</td></tr>`)
        .join('')}</table><p style="font-family:Arial,sans-serif;font-size:13px;color:#7a6f63">An inquiry is not a confirmed booking. Reply to the guest to confirm availability and rate.</p>`,
    })
  } catch (error) {
    req.payload.logger.error({ err: error }, 'Could not send inquiry notification email')
  }

  return doc
}

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: 'Inquiry', plural: 'Inquiries' },
  admin: {
    group: 'Bookings',
    useAsTitle: 'name',
    defaultColumns: ['name', 'checkIn', 'checkOut', 'adults', 'status', 'createdAt'],
    description:
      'Requests sent through the website. An inquiry is not a booking until you reply to confirm it. Update the status as you go.',
  },
  defaultSort: '-createdAt',
  access: {
    // Created only by the website's own form handler (server-side), never directly by the public API.
    create: () => false,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: { afterChange: [notifyHost] },
  fields: [
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Replied', value: 'replied' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Declined / unavailable', value: 'declined' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'phone', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'checkIn', type: 'date', label: 'Arrival', admin: { date: { pickerAppearance: 'dayOnly' } } },
        { name: 'checkOut', type: 'date', label: 'Departure', admin: { date: { pickerAppearance: 'dayOnly' } } },
        { name: 'adults', type: 'number', min: 1 },
        { name: 'children', type: 'number', min: 0 },
      ],
    },
    { name: 'stay', type: 'relationship', relationTo: 'stays' },
    { name: 'message', type: 'textarea' },
    {
      name: 'preferredContact',
      type: 'select',
      label: 'Prefers to hear back by',
      options: [
        { label: 'Email', value: 'email' },
        { label: 'Phone call', value: 'phone' },
        { label: 'WhatsApp', value: 'whatsapp' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Internal notes',
      admin: { description: 'Only visible to your team.' },
    },
    { name: 'consent', type: 'checkbox', label: 'Agreed to be contacted', admin: { readOnly: true, position: 'sidebar' } },
    { name: 'sourcePage', type: 'text', admin: { readOnly: true, position: 'sidebar' } },
  ],
}
