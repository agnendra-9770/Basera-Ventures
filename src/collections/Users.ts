import { type CollectionConfig, Forbidden } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Team member', plural: 'Team' },
  admin: {
    group: 'Settings',
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'updatedAt'],
    description: 'People who can sign in and edit the website.',
  },
  auth: {
    // Lock an account for 10 minutes after 5 wrong passwords.
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    tokenExpiration: 60 * 60 * 12,
  },
  hooks: {
    // Accounts are made only by a signed-in admin, or on this computer with `npm run admin:create`.
    // That also closes Payload's public "create first user" sign-up to visitors.
    beforeOperation: [
      ({ operation, req }) => {
        if (operation === 'create' && !req.user && req.payloadAPI !== 'local') throw new Forbidden(req.t)
      },
    ],
  },
  fields: [{ name: 'name', type: 'text' }],
}
