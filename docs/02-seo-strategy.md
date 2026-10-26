# SEO strategy

The goal is qualified direct bookings from people searching for a place to stay in your area — not rankings for their own sake. Everything below is built into the site; your job is to replace the placeholders with specific, truthful detail.

## Sitemap

```
/                         Home — brand + location + the whole offer
/stays                    All stays (hidden automatically when there is only one)
/stays/[slug]             One stay: photos, sleeping, amenities, rates, policies, FAQs, booking
/experiences              What you can do here and nearby
/our-story                The people, design philosophy, local ties, timeline, promise
/a-day-here               Editorial "day in the life"
/destination              Travel guide: getting here, compass of places, seasons, practicalities, map
/gallery                  Photographs by theme + postcards
/journal                  Guides and stories
/journal/[slug]           One story
/faqs                     Questions and policies
/contact                  Inquiry form, WhatsApp, phone, map, what happens next
/privacy
/sitemap.xml  /robots.txt
```

## Basera Ventures: what to target (Jaipur)

Every query below matches something true and shown on the site. Don't chase terms the homes can't satisfy.

| Intent | Queries | Where it lands | Why it's true |
| --- | --- | --- | --- |
| Pool stays | `homestay in Jaipur with pool`, `studio apartment Jaipur with swimming pool` | Home, Laxom / Khushom / Lovom | Pool open daily at the community |
| Couples | `couple friendly homestay Jaipur`, `romantic stay Jaipur` | Eclipse, Laxom | Moon-wall studio, private balcony, self check-in. *Only use "couple friendly" if your policy welcomes unmarried couples with ID — say so in the FAQs.* |
| Corporate / long stays | `serviced studio Jaipur`, `corporate stay Jaipur`, `monthly rental studio Jaipur` | Experiences → Corporate stays, every stay page | Dedicated workspace + high-speed Wi-Fi + kitchenette in all four |
| Shoots | `shoot location Jaipur`, `aesthetic studio for photoshoot Jaipur` | Experiences → Aesthetic shoot locations | Stated offering on your link page |
| Pets | `pet friendly homestay Jaipur` | Eclipse | Pets allowed on the Eclipse listing |
| Area | `homestay Raja Park Jaipur`, `stay near Hawa Mahal` | Eclipse | Listing title and location |
| Weekenders | `weekend getaway from Delhi`, `Delhi to Jaipur stay` | Destination guide | Delhi → Jaipur road/rail guidance |

Next pieces worth writing as journal guides: *Getting to Jaipur* (draft is waiting), *Jaipur in summer: what to do between 12 and 4* (pool!), *Working from Jaipur for a month*, *Five shoot-friendly corners at Basera*.

## Page-by-page search intent & recommended metadata

Titles and descriptions are editable per page in the CMS (every page has a **Search & sharing** tab). `{brand}`, `{location}`, `{propertyType}` and `{nearbyCity}` are filled in automatically. Replace the bracketed parts with your real amenities.

| Page | Searcher's intent | Target queries (only if true for you) | Suggested title (≤60 chars) | Suggested description (≤160 chars) |
| --- | --- | --- | --- | --- |
| Home | "Where should we stay in [location]?" | `homestay in {location}`, `{propertyType} in {location}`, `best homestay in {location}` | `{brand} — {propertyType} in {location} with a courtyard pool` | Lamplit studios with kitchenettes, a courtyard pool and a dining room in {location}. Book direct with the hosts — real rates, personal replies. |
| Stay page | "Is this room right for us?" | `studio with kitchenette in {location}`, `{location} stay with pool`, `private room for couples in {location}` | `The Sage Studio — studio with kitchenette in {location}` | A lamplit studio with a kitchenette, sofa corner and work desk at {brand}. Photographs, amenities and policies, then check availability. |
| Stays list | compare rooms | `rooms at {brand}` | `Studios at {brand}, {location} — compare & check availability` | Compare sleeping arrangements, kitchenettes, desks and amenities, then check availability directly with the hosts. |
| Experiences | "What is there to do?" | `things to do in {location}`, `{location} weekend getaway` | `Experiences at {brand} — pool, dining & days out in {location}` | Swim in the courtyard pool, dine under mosaic lamps, settle into a lamplit studio — plus the best of {location} nearby. |
| Our story | trust, brand | `{brand}` (brand searches) | `Our story — the people behind {brand}` | Who hosts you, how the place was designed, and what we promise. |
| Destination | planning | `how to get to {location}`, `best time to visit {location}`, `weekend getaway from {nearbyCity}` | `{location} travel guide — getting here, seasons & places nearby` | How to reach {location} by air, rail and road, when to come, and the places our guests love — from the hosts of {brand}. |
| Journal story | specific question | long-tail: `{location} in monsoon`, `cafés near …`, `{nearbyCity} to {location} by road` | the story's own title, ≤60 chars | the excerpt |
| FAQs | policy questions | `{brand} check-in time`, `{brand} cancellation` | `FAQs — booking, check-in & policies | {brand}` | Check-in times, cancellation, food, parking, Wi-Fi, children and pets. |
| Contact | ready to book | `{brand} contact`, `book {brand}` | `Contact & book — {brand}, {location}` | Send your dates, call, or message on WhatsApp — the hosts reply personally. |

Rules of thumb: lead with the thing searched for, not the brand; one page per intent (no duplicate "location" pages); descriptions are invitations with a specific fact, not keyword lists.

## Structured data (JSON-LD) — automatic

- **LodgingBusiness** (type selectable: BedAndBreakfast, Hotel…) on the home page: name, address, geo, phone, email, check-in/out, shared amenities, price range (only from maintained rates), social profiles, photos.
- **HotelRoom / Apartment / House** per stay (`containsPlace`), with occupancy, beds, size, amenities and an Offer only when a rate is maintained.
- **BreadcrumbList** on every inner page; **BlogPosting** on journal stories; **FAQPage** on the FAQ page and stay pages — but only for questions whose answers contain no placeholders.
- **VacationRental** is generated *only* when you tick the eligibility box in Site settings (Google requires a Hotel Center / vacation-rental partnership) **and** the stay has an identifier, 8+ photos, 5-decimal coordinates and an occupancy. Otherwise it is omitted — Google treats ineligible markup as spam.
- No ratings are ever self-declared. Reviews are shown as attributed quotes with a link to the source; aggregate ratings belong to the platforms that collected them.

## Technical SEO built in

- Server-rendered HTML for every page (no content hidden behind client-side rendering); pages cached for an hour and refreshed instantly whenever anything is saved in the CMS.
- Clean URLs from titles; canonical links; Open Graph and Twitter cards with a 1200×630 crop generated for every image.
- `sitemap.xml` with last-modified dates; `robots.txt` that blocks everything until "The site is live" is ticked, then allows all but `/admin`, `/api` and `/next`.
- Images: AVIF/WebP, sized per screen (`sizes` on every image), lazy except the hero (which is preloaded with `fetchpriority=high`), blur-up placeholders, focal-point crops, descriptive `alt` text required on upload.
- Core Web Vitals: fonts self-hosted via `next/font` with `display: swap`; no layout shift (every frame has an aspect ratio); CSS ~40 kB, no UI framework; JavaScript only where there is interaction.
- Accessibility (which Google also rewards): semantic landmarks, skip link, keyboard-operable tabs/menu/lightbox/compass, visible focus, reduced-motion support, 4.5:1+ contrast.
- Security headers (HSTS, nosniff, referrer policy, frame options, permissions policy); forms are server-validated with a honeypot and rate limiting.

## Content that earns search traffic

Write the destination guide and journal stories as the answers you give guests anyway. The most valuable pages are the specific ones:

1. *How to get to {location}* (airport, station, road, last-mile, parking) — the seeded draft is a template.
2. *When to come* — each season honestly: weather, what to pack, what's on, what's closed.
3. *Where we send guests to eat / walk / shop* — with your tip and a Maps link (the Places collection does this for the compass; expand the best into stories).
4. *Working from {brand}* — Wi-Fi speed (tested), desk, power cuts, quiet hours — if you want remote workers.
5. *Coming with children* — pool rules, cots, high chairs, nearby things kids like — if you want families.

Avoid: pages that only exist to repeat a keyword, "top 10" lists copied from elsewhere, and anything you haven't checked yourself.

## Google setup

1. **Search Console** — paste the HTML-tag code into Site settings → Search & launch → *Google Search Console code*; verify; submit `https://your-domain/sitemap.xml`; after launch, use *URL inspection* on the home page and one stay page.
2. **Google Analytics 4** — paste the `G-…` ID. It loads only after a visitor accepts the cookie prompt.
3. **Google Business Profile** — create/claim it with exactly the same name, address and phone as Site settings; use the same photographs; link the website; paste the profile link into Site settings → Social. Ask happy guests for Google reviews — then quote them (verified, linked) on the site.
4. **Bing Webmaster** — optional; the code field is beside Google's.
