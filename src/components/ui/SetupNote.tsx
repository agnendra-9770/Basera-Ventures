import type { ReactNode } from 'react'

import { isDraftMode } from '@/lib/data'

import { Icon } from './Icon'

/** A hint for the editor about missing content. Only shown in CMS preview, never to visitors. */
export async function SetupNote({
  title,
  children,
  href,
  action = 'Open the CMS',
}: {
  title: string
  children?: ReactNode
  href: string
  action?: string
}) {
  if (!(await isDraftMode())) return null
  return (
    <aside className="setup-note">
      <p className="setup-note__badge">Setup guide · only you see this, in preview</p>
      <p className="setup-note__title">{title}</p>
      {children && <div className="setup-note__body">{children}</div>}
      <a className="setup-note__link" href={href}>
        {action} <Icon name="arrow-up-right" size={14} />
      </a>
    </aside>
  )
}
