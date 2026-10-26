# Editing guide

Sign in at `/admin`. Everything on the website lives here; nothing requires code.

## How the site fills itself in

- **Tokens.** In any text you can write `{brand}`, `{location}`, `{propertyType}`, `{nearbyCity}`, `{responseTime}`, `{checkIn}`, `{checkOut}`, `{cancellation}`, `{payment}`, `{children}`, `{pets}`, `{idPolicy}`. Each is replaced with the value from **Site settings**, so you change a fact once.
- **Placeholders.** Anything in `[CAPITALS IN BRACKETS]` is a placeholder. The site shows it highlighted so it cannot be mistaken for finished copy, leaves it out of search data, and the dashboard counts what remains.
- **Italics in headings.** Wrap words in `*asterisks*` — `Some places are visited. *Others stay with you.*`
- **Setup mode.** Until you tick *The site is live*, search engines are kept out, a "Setup mode" badge shows, and empty sections display a setup guide. Once live, empty sections simply disappear.
- **Publishing.** Stays, experiences and journal stories have drafts: *Save draft* keeps changes private; *Publish* makes them public. Use **Preview** to see a draft on the real site. Everything else (settings, pages, photos, FAQs, places, reviews) is live the moment you save.

## Photos & videos (Library → Photos & videos)

- Drag several files at once to bulk-upload. JPG, PNG, WebP, AVIF, MP4, WebM; very large images are resized on upload.
- **Description (alt)** is required: say what is in the picture. **Caption** is optional and shown in galleries. **Category** powers the gallery filters. **Credit** names a photographer or a guest.
- After uploading, click the image to set its **focal point** — the part that must stay in every crop (a face, the bed, the lamp).
- Tick *Show in the gallery* and/or *Feature in "Postcards from here"*. Drag rows to set the gallery order.
- Replacing a file: open it, upload a new file over it; the site refreshes automatically.
- Videos: upload an MP4 and choose a *Video thumbnail*. The homepage film should be muted, 10–25 seconds, under 8 MB.

## Stays

Each stay is a page. Tabs: **Story** (type, tagline, summary, description, highlights, who it suits), **Photos & video**, **Rooms & amenities** (sleeps, beds, size, amenities from the library, accessibility), **Rates & booking** (optional price — only if you keep it current — minimum nights, links to this listing on other platforms), **Policies & FAQs** (overrides and per-stay questions), **Search & sharing**.

With one stay, the site hides the listing page and sends "Explore the stay" straight to it. Drag stays in the list to order them.

**Amenities** are a shared library (Stays → Amenities). Add each once; tick *Shared facility* for things every guest can use (pool, dining room) — these appear on every stay automatically.

## Homepage, Our story, A day here, Other pages

Each is edited section by section under **Website**. Every section has an eyebrow, heading and intro; most have photos. **Find your moment** items should be only the kinds of trip you genuinely cater for, each with a suggested stay. **Signature experiences** picks from your Experiences (or shows the ones marked "Feature on the homepage").

## Experiences, Journal, FAQs, Places, Reviews (Content & Destination)

- **Experiences** — kinds: at the stay, nearby, arranged on request, seasonal; practical details (when, duration, distance, price, how to arrange) appear beneath the story.
- **Journal** — stories and guides. Category *Destination guide* also appears on the Destination page. Published date is set when you first publish.
- **FAQs** — grouped by category; complete answers (no brackets) are also marked up for Google.
- **Places nearby** — name, category, rough direction and travel time are enough; they plot themselves on the compass. Add a tip and a Maps link.
- **Guest reviews** — paste real reviews word for word, name as shown, source and link, date; tick *Verified*. Reviews sent to you directly need *consent*. Nothing shows until verified.

## Bookings

- **Inquiries** (Bookings → Inquiries) hold every form submission with dates, guests, contact preference and message. Update the status as you reply. If SMTP is configured you also get an email.
- **Booking mode** (Site settings → Booking): *Inquiry* is the default. Choose *External booking engine* and paste its link with `{arrival}`, `{departure}`, `{adults}`, `{children}`, `{stay}` where it expects them, and every "Check availability" button sends guests there with their dates.
- **WhatsApp**: adding a number turns on WhatsApp buttons everywhere; the booking widget pre-writes the message with the guest's dates.

## Team

Settings → Team: add colleagues with their own logins. Accounts lock for 10 minutes after five wrong passwords.

## If something looks wrong

- A section vanished: it is empty and the site is live — add content, or untick *The site is live* while editing.
- A photo looks cropped badly: set its focal point.
- A change doesn't appear: hard-refresh; pages refresh within seconds of saving, and in any case within an hour.
- Dashboard says the database is locked / a migration is pending: run `npm run migrate` on the server.
