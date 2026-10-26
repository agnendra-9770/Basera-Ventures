'use server'

import { headers } from 'next/headers'

import { getPayloadClient } from '@/lib/data'

export type InquiryState = {
  ok: boolean
  errors: Record<string, string>
  values: Record<string, string>
}

const FIELDS = ['name', 'email', 'phone', 'preferredContact', 'stay', 'checkIn', 'checkOut', 'adults', 'children', 'message', 'consent', 'sourcePage'] as const

// A gentle brake on abuse: five inquiries an hour per connection.
const attempts = new Map<string, number[]>()
const tooMany = (key: string) => {
  const now = Date.now()
  const recent = (attempts.get(key) ?? []).filter((t) => now - t < 60 * 60 * 1000)
  if (recent.length >= 5) return true
  recent.push(now)
  attempts.set(key, recent)
  return false
}

const isoDate = /^\d{4}-\d{2}-\d{2}$/

export async function sendInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  const values: Record<string, string> = {}
  for (const field of FIELDS) values[field] = String(formData.get(field) ?? '').trim()

  // Bots fill the hidden "website" field; people never see it.
  if (String(formData.get('website') ?? '')) return { ok: true, errors: {}, values }

  const errors: Record<string, string> = {}
  if (values.name.length < 2 || values.name.length > 120) errors.name = 'Please tell us your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email) || values.email.length > 200) errors.email = 'That email address doesn’t look right.'
  if (values.phone.length > 40) errors.phone = 'That phone number is too long.'
  if (values.checkIn && !isoDate.test(values.checkIn)) errors.checkIn = 'Please choose an arrival date.'
  if (values.checkOut && !isoDate.test(values.checkOut)) errors.checkOut = 'Please choose a departure date.'
  if (values.checkIn && values.checkOut && values.checkOut <= values.checkIn) errors.checkOut = 'Departure needs to be after arrival.'
  const adults = Number(values.adults || 0)
  const children = Number(values.children || 0)
  if (!Number.isInteger(adults) || adults < 1 || adults > 30) errors.adults = 'How many adults are coming?'
  if (!Number.isInteger(children) || children < 0 || children > 20) errors.children = 'Please check the number of children.'
  if (values.message.length > 2000) errors.message = 'Please keep your message under 2,000 characters.'
  if (values.consent !== 'on') errors.consent = 'Please confirm we may contact you about your inquiry.'
  if (!['', 'email', 'phone', 'whatsapp'].includes(values.preferredContact)) values.preferredContact = ''
  if (Object.keys(errors).length) return { ok: false, errors, values }

  const requestHeaders = await headers()
  const ip = (requestHeaders.get('x-forwarded-for') ?? '').split(',')[0].trim() || requestHeaders.get('x-real-ip') || 'local'
  if (tooMany(ip)) {
    return {
      ok: false,
      errors: { form: 'That’s a lot of messages from this connection. Please try again in an hour — or WhatsApp us.' },
      values,
    }
  }

  try {
    const payload = await getPayloadClient()
    let stayId: number | undefined
    if (values.stay) {
      const match = await payload.find({
        collection: 'stays',
        where: { slug: { equals: values.stay } },
        limit: 1,
        depth: 0,
        overrideAccess: false,
        select: { slug: true },
      })
      stayId = match.docs[0]?.id
    }
    await payload.create({
      collection: 'inquiries',
      overrideAccess: true,
      data: {
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        preferredContact: (values.preferredContact || undefined) as 'email' | 'phone' | 'whatsapp' | undefined,
        stay: stayId,
        checkIn: values.checkIn || undefined,
        checkOut: values.checkOut || undefined,
        adults,
        children,
        message: values.message || undefined,
        consent: true,
        sourcePage: values.sourcePage.slice(0, 200) || undefined,
        status: 'new',
      },
    })
  } catch (error) {
    console.error('Inquiry could not be saved', error)
    return {
      ok: false,
      errors: { form: 'Something went wrong on our side and your message wasn’t saved. Please try again, or contact us directly.' },
      values,
    }
  }

  return { ok: true, errors: {}, values }
}
