# Basera Ventures — logo kit

Open **`logo-sheet.png`** (or `logo-sheet.html` in a browser) for the logo, its idea, construction, colours and rules.

## Which file do I use?

All files are in `public/brand/logo/` (also online at `https://<your-domain>/brand/logo/...`). `svg/` holds sharp, scalable files for designers, printers, signage and the web. `png/` holds ready-to-use images for Word, PowerPoint, Canva, WhatsApp and Instagram.

| Need | File |
| --- | --- |
| Website, documents, email signature | `basera-ventures-horizontal` |
| Business card, signage, social post | `basera-ventures-stacked` |
| Name only (symbol shown elsewhere) | `basera-ventures-wordmark` |
| Profile picture (WhatsApp, Instagram, Google, Airbnb) | `png/basera-avatar-charcoal.png` or `basera-avatar-ivory.png` |
| App icon, sticker, embroidery, small spaces | `basera-symbol` |
| Rubber stamp / seal on invoices and letters | `basera-ventures-stamp-charcoal` |
| Gold foil, embossing | the `-gold` file of any lockup |

Colour versions: no suffix = charcoal with a gold door, for light backgrounds. `-reverse` is for dark backgrounds. `-charcoal`, `-ivory` and `-gold` are one colour, with the door left open.

Every file also exists as `basera-venture-…` with the singular spelling.

## Rules in short

- Keep clear space on all sides at least the width of the B's pillar.
- Smallest sizes: horizontal 140 px / 35 mm wide · stacked 90 px / 22 mm wide · symbol 16 px / 6 mm tall.
- Don't redraw, stretch, recolour, outline, add shadows or gradients, or retype the name in another font.
- Colours: charcoal `#2A2622`, gold `#A88A57`, ivory `#F7F2EA`. For print, ask for a proof. Gold looks best as foil or Pantone 871 C metallic.

## Rebuilding the files

Everything is generated from one script, so a change is made once and every file follows:

```bash
python -m pip install -r brand/source/requirements.txt
python brand/source/build_logo.py
```

`brand/source/build_logo.py` holds the symbol's construction and the type settings. It writes the kit, the site's favicon/app icons and `src/components/brand/logo-data.ts`. The typefaces in `brand/source/fonts` (Fraunces, Instrument Sans) are under the SIL Open Font License; the licence texts are next to them.
