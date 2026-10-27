'use client'

import { useActionState, useEffect, useId, useState } from 'react'

import { type InquiryState, sendInquiry } from '@/app/(frontend)/contact/actions'
import { isDay, localToday } from '@/lib/dates'

import { calendarFor, useAvailability } from '../booking/availability'
import { DatesField } from '../booking/DatesField'
import type { Range } from '../booking/DateRangePicker'
import { Icon } from '../ui/Icon'

const initialInquiryState: InquiryState = { ok: false, errors: {}, values: {} }

type Props = {
  stays: { slug: string; name: string }[]
  defaults: Record<string, string>
  responseTime?: string | null
  whatsappHref?: string | null
}

export function InquiryForm({ stays, defaults, responseTime, whatsappHref }: Props) {
  const [state, action, pending] = useActionState<InquiryState, FormData>(sendInquiry, initialInquiryState)
  const id = useId()
  const v = (key: string) => state.values[key] ?? defaults[key] ?? ''
  const err = (key: string) => state.errors[key]
  const describe = (key: string) => (err(key) ? `${id}-${key}-error` : undefined)
  const day = (key: string) => (isDay(v(key)) ? v(key) : null)

  const [range, setRange] = useState<Range>(() => ({ start: day('checkIn'), end: day('checkOut') }))
  const [stay, setStay] = useState(() => (stays.length === 1 ? stays[0].slug : v('stay')))
  const [today, setToday] = useState('')
  const { data, loading } = useAvailability()
  useEffect(() => setToday(localToday()), [])

  if (state.ok) {
    const prefers = { email: 'by email', phone: 'by phone', whatsapp: 'on WhatsApp' }[state.values.preferredContact] ?? 'by email'
    return (
      <div className="form-success" role="status" id="book">
        <p className="eyebrow">Received</p>
        <h2 className="display-s">Thank you, {state.values.name.split(' ')[0]}. We have your dates.</h2>
        <p className="text-soft">
          A person will reply {prefers}
          {responseTime ? `, usually within ${responseTime}` : ''}. An inquiry isn’t a confirmed booking yet — we’ll
          confirm availability and the rate in our reply.
        </p>
        {whatsappHref && (
          <a className="btn btn--ghost" href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <span>In a hurry? WhatsApp us</span>
            <Icon name="whatsapp" size={18} />
          </a>
        )}
      </div>
    )
  }

  return (
    <form action={action} className="form" id="book" noValidate aria-describedby={err('form') ? `${id}-form-error` : undefined}>
      <input type="hidden" name="sourcePage" value={defaults.sourcePage ?? '/contact'} />
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Leave this field empty</label>
        <input id={`${id}-website`} type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset className="form__group">
        <legend>
          <span>01</span>Your dates
        </legend>
        {stays.length > 1 && (
          <div className="field field--full">
            <label htmlFor={`${id}-stay`}>Which stay?</label>
            <select id={`${id}-stay`} className="input" name="stay" value={stay} onChange={(e) => setStay(e.target.value)}>
              <option value="">Not sure yet — help me choose</option>
              {stays.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {stays.length === 1 && <input type="hidden" name="stay" value={stays[0].slug} />}
        <div className="field field--full">
          <DatesField
            value={range}
            onChange={setRange}
            calendar={calendarFor(data, stay || null)}
            loading={loading || !today}
            today={today}
            idPrefix={id}
            variant="form"
            stayName={stays.find((s) => s.slug === stay)?.name}
            errors={{ start: err('checkIn'), end: err('checkOut') }}
          />
          <input type="hidden" name="checkIn" value={range.start ?? ''} />
          <input type="hidden" name="checkOut" value={range.end ?? ''} />
        </div>
        <div className="field">
          <label htmlFor={`${id}-adults`}>Adults</label>
          <input id={`${id}-adults`} className="input" type="number" name="adults" min={1} max={30} inputMode="numeric" defaultValue={v('adults') || '2'} aria-invalid={Boolean(err('adults'))} aria-describedby={describe('adults')} />
          {err('adults') && <p className="field__error" id={`${id}-adults-error`}>{err('adults')}</p>}
        </div>
        <div className="field">
          <label htmlFor={`${id}-children`}>
            Children <span className="field__optional">(under 12)</span>
          </label>
          <input id={`${id}-children`} className="input" type="number" name="children" min={0} max={20} inputMode="numeric" defaultValue={v('children') || '0'} aria-invalid={Boolean(err('children'))} aria-describedby={describe('children')} />
          {err('children') && <p className="field__error" id={`${id}-children-error`}>{err('children')}</p>}
        </div>
      </fieldset>

      <fieldset className="form__group">
        <legend>
          <span>02</span>About you
        </legend>
        <div className="field">
          <label htmlFor={`${id}-name`}>Name</label>
          <input id={`${id}-name`} className="input" type="text" name="name" autoComplete="name" required defaultValue={v('name')} aria-invalid={Boolean(err('name'))} aria-describedby={describe('name')} />
          {err('name') && <p className="field__error" id={`${id}-name-error`}>{err('name')}</p>}
        </div>
        <div className="field">
          <label htmlFor={`${id}-email`}>Email</label>
          <input id={`${id}-email`} className="input" type="email" name="email" autoComplete="email" required defaultValue={v('email')} aria-invalid={Boolean(err('email'))} aria-describedby={describe('email')} />
          {err('email') && <p className="field__error" id={`${id}-email-error`}>{err('email')}</p>}
        </div>
        <div className="field">
          <label htmlFor={`${id}-phone`}>
            Phone <span className="field__optional">(optional, with country code)</span>
          </label>
          <input id={`${id}-phone`} className="input" type="tel" name="phone" autoComplete="tel" defaultValue={v('phone')} aria-invalid={Boolean(err('phone'))} aria-describedby={describe('phone')} />
          {err('phone') && <p className="field__error" id={`${id}-phone-error`}>{err('phone')}</p>}
        </div>
        <div className="field">
          <span className="field__label" id={`${id}-prefers`}>
            Reply by
          </span>
          <div className="choice-row" role="radiogroup" aria-labelledby={`${id}-prefers`}>
            {[
              ['email', 'Email'],
              ['whatsapp', 'WhatsApp'],
              ['phone', 'Phone call'],
            ].map(([value, label]) => (
              <label key={value} className="choice">
                <input type="radio" name="preferredContact" value={value} defaultChecked={(v('preferredContact') || 'email') === value} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      <fieldset className="form__group">
        <legend>
          <span>03</span>Anything we should know?
        </legend>
        <div className="field field--full">
          <label htmlFor={`${id}-message`}>
            Message <span className="field__optional">(optional)</span>
          </label>
          <textarea id={`${id}-message`} className="input" name="message" rows={5} maxLength={2000} defaultValue={v('message')} placeholder="An occasion, a question, an early arrival…" aria-invalid={Boolean(err('message'))} aria-describedby={describe('message')} />
          {err('message') && <p className="field__error" id={`${id}-message-error`}>{err('message')}</p>}
        </div>
        <div className="field field--full">
          <label className="check">
            <input type="checkbox" name="consent" defaultChecked={v('consent') === 'on'} aria-invalid={Boolean(err('consent'))} aria-describedby={describe('consent')} />
            <span>
              You may contact me about this inquiry. We keep your details only to answer you — see our{' '}
              <a href="/privacy">privacy notice</a>.
            </span>
          </label>
          {err('consent') && <p className="field__error" id={`${id}-consent-error`}>{err('consent')}</p>}
        </div>
      </fieldset>

      {err('form') && (
        <p className="field__error" id={`${id}-form-error`} role="alert">
          {err('form')}
        </p>
      )}

      <div className="hero__actions" style={{ marginTop: 0 }}>
        <button type="submit" className="btn btn--solid" disabled={pending}>
          <span>{pending ? 'Sending…' : 'Send inquiry'}</span>
          <Icon name="arrow-right" size={18} />
        </button>
        <p className="field__hint">No payment is taken. We reply personally with availability and the rate.</p>
      </div>
    </form>
  )
}
