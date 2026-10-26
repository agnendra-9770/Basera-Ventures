# Basera-Ventures

The Basera homestays website (Jaipur). An editorial, SEO-ready website for a homestay, villa or small collection of stays — with a built-in CMS so every photograph, word, rate and policy can be changed without touching code.

- **Website:** Next.js 16 (App Router, React 19), server-rendered and cached, AVIF/WebP images, structured data, sitemap, robots.
- **CMS:** Payload 3 at `/admin` — stays, photos & videos, experiences, journal, reviews, FAQs, places, inquiries, and every page's copy.
- **Database:** Postgres (e.g. Supabase) when `DATABASE_URL` is a `postgres://` URL; otherwise a single SQLite file (`data/site.db`) or Turso/libSQL.
- **Booking:** honest by design — an inquiry form with email notification, WhatsApp hand-off, links to Airbnb/Booking.com listings, or a hand-off to an external booking engine. It never fakes availability, prices, urgency or reviews.

Read next: [`docs/04-editing-guide.md`](docs/04-editing-guide.md) (how to run the site day to day), [`docs/03-launch-checklist.md`](docs/03-launch-checklist.md) (going live), [`docs/01-brand-and-design.md`](docs/01-brand-and-design.md), [`docs/02-seo-strategy.md`](docs/02-seo-strategy.md).

## Quick start

Requirements: Node 20.18+ (24 recommended) and npm.

```bash
npm install
cp .env.example .env        # then set PAYLOAD_SECRET to a long random string
npm run setup               # creates the database and seeds it with the starter content + photographs
npm run dev                 # http://localhost:3000  ·  CMS at http://localhost:3000/admin
```

The first visit to `/admin` asks you to create your account. The dashboard then shows **Launch readiness** — what is still a placeholder and where to fix it.

Everything shown in `[SQUARE BRACKETS]` on the site is a placeholder waiting for a real value. Search engines are asked to stay away until you tick **Site settings → Search & launch → The site is live**.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` / `npm start` | Production build and server |
| `npm run setup` | `migrate` + `seed` — first-time database setup |
| `npm run seed` | Seeds starter content (skips if content exists; `SEED_FORCE=1 npm run seed` wipes content, not users, and seeds again) |
| `npm run migrate` | Applies database migrations (also runs automatically in production on start) |
| `npm run media:upload` | Postgres only: copies photos from `media/` on this computer into the database, so the live site can serve them |
| `npm run migrate:create <name>` | After changing a collection/global in `src/collections` or `src/globals`, creates the migration for it |
| `npm run generate:types` | Regenerates `src/payload-types.ts` after schema changes |
| `npm run typecheck` | TypeScript check |

## Project structure

```
src/
  payload.config.ts        CMS configuration (collections, globals, database, email, uploads)
  collections/             Stays, Media, Amenities, Experiences, Journal, Testimonials, Faqs, Places, Inquiries, Users
  globals/                 Settings (brand, location, contact, booking, policies, SEO), Home, Story, Day, Destination, Pages
  migrations/              Database migrations (generated) — postgres/ and sqlite/, one set per database
  seed/                    Starter content + your photographs (src/seed/photos)
  app/(frontend)/          The website — one folder per page, CSS in styles/
  app/(payload)/           The CMS admin and REST API (generated boilerplate — do not edit)
  components/              UI: layout, booking, media, home sections, stays, gallery, destination, contact, admin
  lib/                     Data access, SEO/metadata, structured data, placeholders & tokens, formatting
public/brand/              Arch mask and jaali pattern SVGs; logo/ (the logo kit) and icons/
brand/                     Logo presentation sheet, kit guide and the script that builds every logo file
media/                     Uploaded files (created on first upload; back this up with data/site.db)
docs/                      Brand, SEO, launch and editing guides
```

Adding a new field is a three-step routine: edit the collection or global → `npm run generate:types` → `npm run migrate:create <name>` → `npm run migrate`. `migrate:create` writes the migration for whichever database `DATABASE_URL` points at; to keep both sets current, run it once more with the other URL (e.g. `DATABASE_URL=file:./data/site.db npm run migrate:create <name>`).

## Environment variables

See `.env.example`. `NEXT_PUBLIC_SERVER_URL` must be the public address of the site (used for canonical links, the sitemap and share cards). `SMTP_*` enables inquiry email notifications; without it inquiries are still saved in the CMS and the host sees a count on the dashboard.

## Deploying

The site needs a database and a place for uploaded files (`media/`).

**With Supabase (Postgres)** — set in `.env` (or the host's environment settings):

- `DATABASE_URL` — Supabase → Connect → *Transaction pooler* URL (port 6543). A `?pgbouncer=true` suffix is fine; it is ignored.
- `DIRECT_URL` — the *Session pooler* URL (port 5432). `npm run migrate` and `npm run seed` use it.
- Optional `DATABASE_CA_CERT` — Supabase's CA certificate (Database settings → SSL), to verify the server as well as encrypt.

Then `npm run setup` once (creates the tables, then loads the starter content and photographs), and `npm run build`. `npm run build` applies any new migrations first.

**With SQLite** — leave `DATABASE_URL=file:./data/site.db` on a Node host with a persistent disk (a small VPS, Railway, Render, Fly.io, Coolify…).

1. Set the environment variables (`NEXT_PUBLIC_SERVER_URL=https://your-domain`, a fresh `PAYLOAD_SECRET`, `NODE_ENV=production`).
2. `npm ci && npm run build`, then `npm start`.
3. Point the domain at the server over HTTPS; the app sends security headers (HSTS, nosniff, referrer policy, frame options).
4. Back up the database (`data/site.db`, or Supabase's backups) and `media/` regularly — together they are the entire site.

**Photos and uploads.** With Postgres, uploaded files are stored in the database itself (table `media_files`, see `src/lib/database-storage.ts`), so Vercel and other hosts without a lasting disk serve them, and uploads made in the live CMS persist. Media created on this computer before that existed can be copied in with `npm run media:upload` (safe to repeat). With SQLite, files stay in `media/` on disk. On Vercel, one upload can be at most about 4.5 MB, so resize very large camera originals first.

**Site address.** Set `NEXT_PUBLIC_SERVER_URL` to the real domain (e.g. `https://basera…`) once you have one. On Vercel, if it is missing or still `localhost`, the project's production domain is used automatically for canonical links, the sitemap and share previews.

## Design & content principles

- Facts come from one place: **Site settings**. Write `{brand}`, `{location}`, `{checkIn}` etc. in any text and the site fills them in.
- Nothing is invented. Rates show only if you maintain them; reviews show only when marked verified; structured data omits anything still a placeholder.
- Every creative element has a job: the arch motif (from the dining-room niche), the jaali pattern, the compass, the day-long colour shift — all tie back to the property and help a guest decide.
