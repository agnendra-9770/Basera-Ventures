import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Amenities } from './collections/Amenities'
import { Experiences } from './collections/Experiences'
import { Faqs } from './collections/Faqs'
import { Inquiries } from './collections/Inquiries'
import { Journal } from './collections/Journal'
import { Media } from './collections/Media'
import { Places } from './collections/Places'
import { Stays } from './collections/Stays'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'
import { Day } from './globals/Day'
import { Destination } from './globals/Destination'
import { Home } from './globals/Home'
import { Pages } from './globals/Pages'
import { Settings } from './globals/Settings'
import { Story } from './globals/Story'
import { migrations } from './migrations'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const email = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'no-reply@example.com',
      defaultFromName: process.env.EMAIL_FROM_NAME || 'Website',
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      },
    })
  : undefined

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    dateFormat: 'd MMM yyyy',
    meta: {
      titleSuffix: ' · Studio',
      description: 'Edit the website — stays, photographs, stories and settings.',
    },
    components: {
      graphics: {
        Logo: '@/components/admin/Brand#Logo',
        Icon: '@/components/admin/Brand#Icon',
      },
      beforeDashboard: ['@/components/admin/LaunchReadiness#LaunchReadiness'],
    },
  },
  collections: [Stays, Amenities, Experiences, Journal, Testimonials, Faqs, Places, Inquiries, Media, Users],
  globals: [Home, Story, Day, Pages, Destination, Settings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./data/site.db',
      authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
    },
    // Schema changes always go through migrations (src/migrations), so a fresh
    // production database sets itself up on first start.
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
    prodMigrations: migrations,
  }),
  email,
  sharp,
  graphQL: { disable: true },
  telemetry: false,
  upload: { limits: { fileSize: 250_000_000 } },
})
