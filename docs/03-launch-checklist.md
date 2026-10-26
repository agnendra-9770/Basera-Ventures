# Launch checklist

The CMS dashboard (`/admin`) shows **Launch readiness** with the same essentials and links straight to each one. Work through this list top to bottom.

## 1. Facts (Site settings)

- [ ] Brand name, property type, what makes you distinct, tagline
- [ ] Location, nearby city, full street address, PIN, map coordinates (right-click your door in Google Maps), Maps link and embed link
- [ ] Phone, WhatsApp number (with country code), email, hours, an honest response time
- [ ] Booking mode: *Inquiry* (default) or *External engine* with its link; listings on Airbnb/Booking.com etc.; WhatsApp opening message; currency; how guests pay
- [ ] Policies: check-in, check-out, cancellation, house rules, children, pets, ID
- [ ] Social links; default search description; default share image; business type for Google
- [ ] Logo (optional — the wordmark is used otherwise) and a logo for dark backgrounds

## 2. Stays

- [ ] Every stay published with: featured image + 3–10 gallery photos (focal points set), summary, description, highlights, sleeping arrangements, max guests, bedrooms/bathrooms, size, amenities chosen from the library
- [ ] Rates: either a maintained *price from* with the date checked, or leave blank ("rates on request")
- [ ] Per-stay FAQs, overrides for check-in/out only if different, accessibility notes
- [ ] Search title and description on each stay

## 3. Photographs

- [ ] Replace seed photos with your final professional set; every image has a plain-language description (alt), a category, and "Show in gallery" set as wanted
- [ ] Hero image (landscape ≥ 2400 px) and a portrait crop for phones; optional 10–25 s muted film under 8 MB
- [ ] Homepage story image (portrait), collage (6–7 mixed), "A day here" (one per moment), invitation (evening)
- [ ] Mark 6–12 as postcards; add credits where a guest shared one

## 4. Words

- [ ] Homepage: hero lines, manifesto, "Find your moment" items (only trips you cater for), section intros, invitation
- [ ] Our story: who you are (in your voice), design ideas, local connections, timeline (only real milestones), promises
- [ ] A day here: 5–7 moments
- [ ] Destination: directions by air/rail/road, getting around, seasons, practical notes; 5+ places on the compass with tips and Maps links
- [ ] FAQs: every answer complete (no brackets); Journal: the "Getting here" draft finished and published
- [ ] Privacy notice reviewed for your jurisdiction (DPDP Act 2023 in India; GDPR if you host EU guests)
- [ ] Search the dashboard's placeholder list until it reads zero

## 5. Reviews

- [ ] Real reviews copied word for word, with name as shown, source and link, date; "Verified" ticked; consent ticked for ones sent to you directly
- [ ] Nothing invented, nothing reworded, no star rating unless the source shows one

## 6. Technical

- [ ] `.env`: `NEXT_PUBLIC_SERVER_URL=https://your-domain`, fresh `PAYLOAD_SECRET`, `NODE_ENV=production`
- [ ] SMTP set up and a test inquiry received by email (or decide you'll work from the CMS inbox)
- [ ] HTTPS working; `npm run build` passes; migrations applied
- [ ] Backups scheduled for the database (`data/site.db`, or Supabase → Database → Backups) and `media/`
- [ ] Test on a phone: menu, booking bar, inquiry form, WhatsApp link, tap targets
- [ ] Run Lighthouse on home and one stay page (aim ≥ 90 on all four); check Google's Rich Results Test on home, a stay, FAQs and a journal story

## 7. Go live

- [ ] Tick **The site is live** in Site settings → Search & launch (this switches robots.txt to allow and removes `noindex`)
- [ ] Search Console: verify, submit sitemap, inspect two URLs
- [ ] GA4 ID entered (loads only with consent)
- [ ] Google Business Profile matches name/address/phone exactly; website linked; photos uploaded
- [ ] Share the site on your social profiles and in your Airbnb/Booking.com descriptions where allowed

## 8. Every month after

- [ ] Rates still correct (update "rate checked" date) · new reviews added · seasonal notes current · reply time still honest
- [ ] One new journal story that answers a question a guest actually asked
- [ ] Inquiries in the CMS marked replied/confirmed/closed
