# Brand & design system

## The idea

Everything on the site is drawn from what the photographs already show: lime-washed walls and warm cove light, oak grain and sage velvet, marble-veined stone, jaali lattice screens above the kitchenettes, a flowering plant painted inside an arched niche, mosaic-glass lamps over mustard banquettes, and a pool tiled in impossible blue.

The brand promise the site makes: **a place built around the hours you actually spend there.** Not "rooms" — light, routine, a desk, a kettle, a pool at noon, lamps at dusk.

Tone of voice: specific, warm, unhurried, first-person-plural ("we"). Short sentences. Verbs over adjectives. No "nestled", "luxurious", "unforgettable". Never claim what you cannot show.

## Logo

The symbol is a geometric **B drawn as a Jaipur façade**. The stem is a pillar, the upper counter a jharokha window, and the lower counter an arched doorway with its light on (gold). Both openings are cut in the site's own arch. *Basera* means a dwelling, a place to rest. The mark says home and welcome without drawing a house, and still reads as a B at favicon size.

The wordmark sets **BASERA** in Fraunces (optical size 60, weight 460, crisp serifs) over **VENTURES** in Instrument Sans (weight 540, widely tracked). Colours are deep charcoal `#2A2622`, muted gold `#A88A57` (`--gold`) and warm ivory `#F7F2EA`. In one colour the doorway is left open.

- **Files:** `public/brand/logo/` (SVG + PNG, every lockup and colourway, both spellings). The presentation sheet with usage rules is `brand/logo-sheet.html` / `.png`.
- **On the site:** header, footer, menu and CMS draw it from `src/components/brand` (`BrandLockup`, `BrandSymbol`). The spelling follows **Site settings → Brand name**: "Basera Ventures" or "Basera Venture". Favicon, Apple and app icons are built in too.
- **Changing it:** edit the numbers in `brand/source/build_logo.py` and run it (see `brand/README.md`). Never edit the generated files by hand.

## Motif: the arch and the lamp

The site's recurring shape is the dining-room arch with a lit lamp inside it. The logo's doorway is cut in the same arch. It appears as:

- the logo's window and doorway, and `ArchMark` (placeholders, and the wordmark if the brand name is changed to something other than Basera);
- the **arch crop** on hero portraits, stay cards and story photographs (`.arch`, from `public/brand/arch-mask.svg`);
- the centre of the destination compass ("home").

The **jaali** pattern (`public/brand/jaali-*.svg`) — a four-point lattice drawn from the screens above the kitchenettes — appears only at low contrast: the footer band, the full-screen menu, placeholders and setup notes. It is texture, never decoration for its own sake.

## Colour

| Token | Hex | Drawn from | Use |
| --- | --- | --- | --- |
| `--ivory` | `#F7F2EA` | lime-washed walls | page background |
| `--linen` | `#EFE7DA` | bed linen, jute | alternate sections |
| `--sand` / `--sand-deep` | `#E5D7C1` / `#CDB894` | rattan, oak light | image frames, selection |
| `--oak` | `#B58E62` | oak panelling | accents |
| `--sage` / `--sage-deep` / `--sage-wash` | `#8B977B` / `#4F5A45` / `#E4E7DB` | velvet headboard, sofa | WhatsApp, ticks, calm sections |
| `--terracotta` / `--terracotta-deep` | `#B25F3E` / `#8F4529` | clay pots, lamp glow | the single "action" colour: hover states, pins, placeholders |
| `--bronze` / `--bronze-deep` | `#A07B4B` / `#74572F` | brass lamps, lamp chains | eyebrows, rules, icons |
| `--gold` | `#A88A57` | lamplight in a doorway | the logo's lit door; VENTURES on dark grounds |
| `--charcoal` / `--ink` | `#2A2622` / `#1B1815` | black joinery frames | text, buttons, footer, night |
| `--mosaic` | `#2E6A86` | the lamps and the pool | used once: the preview bar |

Contrast: body text on ivory is 11.6:1; `--text-soft` 6.4:1; eyebrows in `--bronze-deep` 5.2:1. White on `--terracotta-deep` 6.3:1.

## Typography

- **Display: Fraunces** (variable; `SOFT` axis at 50 for headings, 100 for italics and quotes). Light weight (300) at large sizes gives the editorial, magazine feel; *italic* is used for the emotional half of a headline — editors write it as `*asterisks*`.
- **Text: Instrument Sans** — a quiet, contemporary sans for body copy, labels and UI.

Scale (fluid, `clamp`): `display-xl` 48–136 px (hero only) · `display-l` 40–92 px (page titles) · `display-m` 32–58 px (section titles) · `display-s` 23–34 px (cards, sub-sections) · `lead` 18–23 px (intros, Fraunces light) · body 17 px / 1.7 · eyebrow 11.5 px, tracked 0.22em, uppercase.

## Layout principles

- One wide container (1480 px) with fluid gutters; asymmetric 7/5 and 5/7 splits rather than centred stacks.
- Photographs are the layout. Mixed portrait/landscape frames (`.frame--4x5`, `3x2`, `21x9`…) with **focal points** set in the CMS so crops always keep the subject.
- Overlapping "detail" images (story, signature experiences) give the collage feel of a travel magazine.
- Whitespace is generous: section padding 88–184 px.
- Motion is restrained and purposeful: a clip-path reveal on images, a soft rise on text, a crossfade on "Find your moment", colour that shifts through "A day here". All of it is disabled under `prefers-reduced-motion`, and the site reads fully without JavaScript.

## Homepage design concept

1. **Cinematic hero** — full-bleed photograph (portrait crop on phones, optional muted film), headline *"Some places are visited. Others stay with you."*, two CTAs. The header is transparent until you scroll.
2. **Booking dock** — dates, guests, stay; overlaps the hero's bottom edge so the booking journey starts in the first screen.
3. **The idea** — arch-framed portrait with an overlapping detail, and a numbered manifesto (i–vi) in Fraunces italic.
4. **Find your moment** — tabs for each kind of trip; the photograph crossfades, the panel lists only what genuinely suits that trip, and suggests a stay.
5. **Signature experiences** — alternating editorial rows with practical details (when, how, price) beneath the story.
6. **Where you'll stay** — stay cards (arch crop, facts, honest price or "rates on request").
7. **A day here** — dark band, horizontal strip from dawn to night, linking into the full page.
8. **Visual journal** — a 12-column collage of seven photographs.
9. **Guest reviews** — one large quote plus smaller ones, each attributed and linked to its source.
10. **Destination** — the compass illustration and an invitation to the guide.
11. **Journal** — three latest stories.
12. **Final invitation** — full-bleed evening photograph, "no countdown timers, no pressure", Check availability + WhatsApp.

## Components worth knowing

| Component | Purpose |
| --- | --- |
| `Frame` / `Img` | Every photograph: ratio, arch crop, focal point, blur-up, AVIF/WebP, lazy or preloaded |
| `PlaceholderMedia` | Obvious, designed stand-in until a photograph is uploaded |
| `Tx` | Renders CMS text: `*italics*` and highlighted `[PLACEHOLDERS]` |
| `SectionHead` / `PageHead` | Consistent eyebrow–heading–intro openings |
| `Cta` | Every button and arrow link (solid, light, ghost, text) |
| `BookingBar` | Dates/guests/stay widget — hands off to inquiry form or booking engine |
| `SetupNote` | Pre-launch guidance where a section is still empty; disappears once live |
