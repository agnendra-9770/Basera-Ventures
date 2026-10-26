import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
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
import { databaseStorage } from './lib/database-storage'
import { serverUrl } from './lib/preview'
import { migrations as postgresMigrations } from './migrations/postgres'
import { migrations as sqliteMigrations } from './migrations/sqlite'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * DATABASE_URL decides the database: postgres://… (e.g. Supabase) or a SQLite / Turso URL.
 * Schema changes always go through migrations (src/migrations/<database>), so a fresh
 * production database sets itself up on first start.
 */
const databaseUrl = process.env.DATABASE_URL || 'file:./data/site.db'
const usesPostgres = /^postgres(ql)?:\/\//.test(databaseUrl)

const database = () => {
  const url = databaseUrl
  if (!usesPostgres) {
    return sqliteAdapter({
      client: { url, authToken: process.env.DATABASE_AUTH_TOKEN || undefined },
      push: false,
      migrationDir: path.resolve(dirname, 'migrations/sqlite'),
      prodMigrations: sqliteMigrations,
    })
  }
  // Scripts (migrate, seed) set PAYLOAD_DIRECT_DB so they use the session connection
  // (Supabase's DIRECT_URL) rather than the transaction pooler the site runs on.
  const target = new URL(process.env.PAYLOAD_DIRECT_DB && process.env.DIRECT_URL ? process.env.DIRECT_URL : url)
  const sslmode = target.searchParams.get('sslmode')
  // Prisma-only flags; node-postgres would misread them.
  for (const flag of ['pgbouncer', 'sslmode', 'connection_limit']) target.searchParams.delete(flag)
  const local = ['localhost', '127.0.0.1', '::1'].includes(target.hostname)
  // Encrypted by default. Supabase signs with its own CA: paste it into DATABASE_CA_CERT to verify it too.
  const ca = process.env.DATABASE_CA_CERT?.replace(/\\n/g, '\n')
  const ssl = sslmode === 'disable' || (local && !sslmode) ? false : ca ? { ca } : { rejectUnauthorized: false }
  return postgresAdapter({
    // Keep-alive and a short idle time stop the pooler's idle cut-offs surfacing as
    // "Connection terminated unexpectedly"; a connect timeout fails fast instead of hanging.
    pool: { connectionString: target.toString(), ssl, keepAlive: true, idleTimeoutMillis: 20_000, connectionTimeoutMillis: 20_000 },
    push: false,
    migrationDir: path.resolve(dirname, 'migrations/postgres'),
    prodMigrations: postgresMigrations,
  })
}

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
  serverURL: serverUrl(),
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    dateFormat: 'd MMM yyyy',
    meta: {
      titleSuffix: ' · Studio',
      description: 'Edit the website — stays, photographs, stories and settings.',
      icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/brand/icons/favicon.svg' }],
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
  db: database(),
  // With Postgres, uploaded files live in the database too (see lib/database-storage), so
  // the site works on hosts without a lasting disk. With SQLite they stay in media/.
  plugins: [cloudStoragePlugin({ enabled: usesPostgres, collections: { media: { adapter: databaseStorage() } } })],
  email,
  sharp,
  graphQL: { disable: true },
  telemetry: false,
  upload: { limits: { fileSize: 250_000_000 } },
})
