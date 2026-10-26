import type { Access } from 'payload'

export const anyone: Access = () => true

export const authenticated: Access = ({ req: { user } }) => Boolean(user)

/** Drafts stay private; visitors only ever see published documents. */
export const authenticatedOrPublished: Access = ({ req: { user } }) =>
  user ? true : { _status: { equals: 'published' } }

/** Guest reviews are only public once someone has ticked "verified". */
export const authenticatedOrVerified: Access = ({ req: { user } }) =>
  user ? true : { verified: { equals: true } }
