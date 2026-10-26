#!/usr/bin/env python3
"""Basera Ventures logo kit. Every file is drawn from the numbers in this script.

    python -m pip install -r brand/source/requirements.txt
    python brand/source/build_logo.py

The symbol is constructed geometrically (nothing is traced). The wordmark is set in
the brand typefaces, Fraunces (BASERA) and Instrument Sans (VENTURES), both under
the SIL Open Font License (see ./fonts), and converted to outlines so the files need
no fonts installed.

Writes
  public/brand/logo/svg, png     the kit (served at /brand/logo/…)
  public/brand/icons             favicon, app and schema.org icons
  src/app/favicon.ico, src/app/(frontend)/icon.svg, apple-icon.png
  src/components/brand/logo-data.ts   paths the website draws its logo from
  brand/logo-sheet.html          the presentation sheet
"""
from __future__ import annotations

import base64
import io
import math
import pathlib
import struct
from functools import lru_cache

import pathops
import resvg_py
import uharfbuzz as hb
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
KIT = ROOT / 'public' / 'brand' / 'logo'
ICONS = ROOT / 'public' / 'brand' / 'icons'
APP = ROOT / 'src' / 'app'

CHARCOAL, GOLD, IVORY = '#2A2622', '#A88A57', '#F7F2EA'

# ── The symbol ───────────────────────────────────────────────────────────────
# A capital B drawn as a Jaipur façade, 100 units tall: the stem is a pillar, the
# upper counter a jharokha window, the lower counter an arched doorway. Both openings
# are cut in the website's arch: vertical jambs, a stepped shoulder, a pointed head.
STEM = 20                                   # pillar width
UPPER, LOWER = 60, 68                       # bowl widths
WINDOW_HEAD, SILL, DOOR_HEAD, THRESHOLD = 11, 40, 51, 13
WALL_UPPER, WALL_LOWER = 18, 20             # right-hand walls beside window and door
R_UPPER, R_LOWER = (26, 20), (26, 28)       # bowl corner radii (top, bottom)
OVERLAP = 3                                 # upper bowl tucks into the lower one
ARCH = dict(rise=0.55, inset=0.09, kink=0.18)
K = 0.5522847498                            # quarter circle as a cubic


def rrect(x0, y0, x1, y1, rtr=0.0, rbr=0.0):
    """Rectangle with rounded right-hand corners (y down)."""
    p = pathops.Path()
    p.moveTo(x0, y0)
    p.lineTo(x1 - rtr, y0)
    if rtr:
        p.cubicTo(x1 - rtr + rtr * K, y0, x1, y0 + rtr - rtr * K, x1, y0 + rtr)
    p.lineTo(x1, y1 - rbr)
    if rbr:
        p.cubicTo(x1, y1 - rbr + rbr * K, x1 - rbr + rbr * K, y1, x1 - rbr, y1)
    p.lineTo(x0, y1)
    p.close()
    return p


def circle(cx, cy, r):
    p = pathops.Path()
    p.moveTo(cx + r, cy)
    for (ax, ay), (bx, by), (ex, ey) in (
        ((cx + r, cy + r * K), (cx + r * K, cy + r), (cx, cy + r)),
        ((cx - r * K, cy + r), (cx - r, cy + r * K), (cx - r, cy)),
        ((cx - r, cy - r * K), (cx - r * K, cy - r), (cx, cy - r)),
        ((cx + r * K, cy - r), (cx + r, cy - r * K), (cx + r, cy)),
    ):
        p.cubicTo(ax, ay, bx, by, ex, ey)
    p.close()
    return p


def arch(x0, x1, y_head, y_foot, rise=0.55, inset=0.09, kink=0.18):
    """An opening: jambs at x0/x1 from y_foot up, a stepped shoulder, a pointed head at y_head."""
    w = x1 - x0
    k, hk = w * inset, w * kink
    half = (w - 2 * k) / 2
    ra = 2 * half * rise
    xc = (x0 + x1) / 2
    spring = y_head + ra
    shoulder = spring + hk
    p = pathops.Path()
    p.moveTo(x0, y_foot)
    p.lineTo(x0, shoulder)
    p.cubicTo(x0, shoulder - hk * 0.6, x0 + k, shoulder - hk * 0.4, x0 + k, spring)
    p.cubicTo(x0 + k, spring - ra * 0.49, xc - half * 0.56, y_head + ra * 0.13, xc, y_head)
    p.cubicTo(xc + half * 0.56, y_head + ra * 0.13, x1 - k, spring - ra * 0.49, x1 - k, spring)
    p.cubicTo(x1 - k, shoulder - hk * 0.4, x1, shoulder - hk * 0.6, x1, shoulder)
    p.lineTo(x1, y_foot)
    p.close()
    return p


def union(*paths):
    out = pathops.Path()
    for p in paths:
        out = pathops.op(out, p, pathops.PathOp.UNION)
    return out


def minus(a, *paths):
    for p in paths:
        a = pathops.op(a, p, pathops.PathOp.DIFFERENCE)
    return a


def tf(path, a=1.0, b=0.0, c=0.0, d=1.0, e=0.0, f=0.0):
    out = pathops.Path()
    path.draw(TransformPen(out.getPen(), (a, b, c, d, e, f)))
    return out


def place(path, scale=1.0, x=0.0, y=0.0):
    return tf(path, scale, 0, 0, scale, x, y)


def area(path):
    return abs(path.area)


def symbol():
    waist = (SILL + DOOR_HEAD) / 2
    body = union(
        rrect(0, 0, STEM, 100),
        rrect(0, 0, UPPER, waist + OVERLAP, *R_UPPER),
        rrect(0, waist, LOWER, 100, *R_LOWER),
    )
    window = arch(STEM, UPPER - WALL_UPPER, WINDOW_HEAD, SILL, **ARCH)
    door = arch(STEM, LOWER - WALL_LOWER, DOOR_HEAD, 100 - THRESHOLD, **ARCH)
    # The lit doorway is drawn a hair larger and sits under the B, so no seam can show.
    e = 0.8
    light = arch(STEM - e, LOWER - WALL_LOWER + e, DOOR_HEAD - e, 100 - THRESHOLD + e, **ARCH)
    assert area(minus(door, light)) < 1e-3, 'the light must cover the doorway'
    return minus(body, window, door), light


# ── The wordmark ─────────────────────────────────────────────────────────────
FONTS = {'fraunces': HERE / 'fonts' / 'Fraunces.ttf', 'instrument': HERE / 'fonts' / 'InstrumentSans.ttf'}
NAME_FONT = ('fraunces', {'opsz': 60, 'wght': 460, 'SOFT': 0, 'WONK': 0})
SUB_FONT = ('instrument', {'wght': 540, 'wdth': 100})
NAME_CAP, NAME_TRACK = 100, 0.12            # BASERA: cap height, tracking (em)
SUB_CAP, SUB_TRACK, SUB_GAP = 36, 0.55, 34  # VENTURES: cap height, tracking, gap below BASERA
MARK_GAP = 58                               # horizontal lockup: symbol to wordmark
STACK_MARK, STACK_GAP = 136, 56             # stacked lockup: symbol height, gap to wordmark


@lru_cache(maxsize=None)
def instance(family, axes):
    font = TTFont(FONTS[family])
    inst = instancer.instantiateVariableFont(font, dict(axes), inplace=False, overlap=instancer.OverlapMode.REMOVE)
    buf = io.BytesIO()
    inst.save(buf)
    gs = inst.getGlyphSet()
    bp = BoundsPen(gs)
    gs[inst.getBestCmap()[ord('H')]].draw(bp)
    return inst, buf.getvalue(), bp.bounds[3] - bp.bounds[1]


def glyphs(font, text, cap, tracking):
    """Shape `text` (kerning on) and return [(outline, x_start, advance)], cap height `cap`, baseline y=cap."""
    family, axes = font
    inst, data, cap_units = instance(family, tuple(sorted(axes.items())))
    face = hb.Face(data)
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(hb.Font(face), buf, {'kern': True, 'liga': False})
    scale = cap / cap_units
    order, gs = inst.getGlyphOrder(), inst.getGlyphSet()
    out, x = [], 0.0
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        g = pathops.Path()
        gs[order[info.codepoint]].draw(TransformPen(g.getPen(glyphSet=gs), (scale, 0, 0, -scale, (x + pos.x_offset) * scale, cap)))
        out.append((g, x * scale, pos.x_advance * scale))
        x += pos.x_advance + tracking * face.upem
    return out


def setline(font, text, cap, tracking):
    path = union(*(g for g, _, _ in glyphs(font, text, cap, tracking)))
    return place(path, 1, -path.bounds[0], 0)


def words(sub, align):
    name = setline(NAME_FONT, 'BASERA', NAME_CAP, NAME_TRACK)
    second = setline(SUB_FONT, sub, SUB_CAP, SUB_TRACK)
    x = 0 if align == 'left' else (name.bounds[2] - second.bounds[2]) / 2
    return name, place(second, 1, x, NAME_CAP + SUB_GAP)


def horizontal(sub):
    mark, light = symbol()
    name, second = words(sub, 'left')
    s = (NAME_CAP + SUB_GAP + SUB_CAP) / 100   # the symbol is as tall as the two lines
    x = LOWER * s + MARK_GAP
    return {'light': place(light, s), 'mark': place(mark, s), 'name': place(name, 1, x), 'sub': place(second, 1, x)}


def stacked(sub):
    mark, light = symbol()
    name, second = words(sub, 'center')
    s = STACK_MARK / 100
    x = (name.bounds[2] - LOWER * s) / 2
    y = STACK_MARK + STACK_GAP
    return {'light': place(light, s, x), 'mark': place(mark, s, x), 'name': place(name, 1, 0, y), 'sub': place(second, 1, 0, y)}


def wordmark(sub):
    name, second = words(sub, 'center')
    return {'name': name, 'sub': second}


def symbol_layers():
    mark, light = symbol()
    return {'light': light, 'mark': mark}


def stamp(sub):
    """A round seal for documents: name above, place below, the symbol in the middle."""
    ring = minus(circle(0, 0, 100), circle(0, 0, 96.5))
    inner = minus(circle(0, 0, 69), circle(0, 0, 67.6))
    cap, track = 12.5, 0.13
    font = ('instrument', {'wght': 600, 'wdth': 100})
    parts = [ring, inner]
    for text, top in ((f'BASERA {sub}', True), ('JAIPUR · INDIA', False)):
        run = glyphs(font, text, cap, track)
        width = run[-1][1] + run[-1][2]
        if top:
            rb, rmid = 77.0, 77.0 + cap / 2
        else:
            rb, rmid = 89.5, 89.5 - cap / 2
        assert width / rmid < math.radians(150), f'{text} is too long for the seal'
        for g, x0, adv in run:
            gc = x0 + adv / 2
            phi = (gc - width / 2) / rmid
            cs, sn = math.cos(phi), math.sin(phi)
            if top:
                parts.append(tf(g, cs, sn, -sn, cs, -gc * cs + (cap + rb) * sn, -gc * sn - (cap + rb) * cs))
            else:
                parts.append(tf(g, cs, -sn, sn, cs, -gc * cs + (rb - cap) * sn, gc * sn + (rb - cap) * cs))
    for side in (-1, 1):
        dmd = pathops.Path()
        cx, r = side * 83.25, 3.2
        dmd.moveTo(cx, -r); dmd.lineTo(cx + r, 0); dmd.lineTo(cx, r); dmd.lineTo(cx - r, 0); dmd.close()
        parts.append(dmd)
    mark, _ = symbol()
    h = 72
    parts.append(place(mark, h / 100, -LOWER * h / 200, -h / 2))
    return {'mark': union(*parts)}


# ── Output ───────────────────────────────────────────────────────────────────
SCHEMES = {
    'color': {'light': GOLD, 'mark': CHARCOAL, 'name': CHARCOAL, 'sub': CHARCOAL},
    'reverse': {'light': GOLD, 'mark': IVORY, 'name': IVORY, 'sub': GOLD},
    'charcoal': {'mark': CHARCOAL, 'name': CHARCOAL, 'sub': CHARCOAL},
    'ivory': {'mark': IVORY, 'name': IVORY, 'sub': IVORY},
    'gold': {'mark': GOLD, 'name': GOLD, 'sub': GOLD},
}
ORDER = ('light', 'mark', 'name', 'sub')


def num(v, nd):
    s = f'{v:.{nd}f}'
    return s.rstrip('0').rstrip('.') if '.' in s else s


def pathdata(path, nd=2):
    p = pathops.Path(path)
    p.simplify(fix_winding=True)
    pen = SVGPathPen(None, ntos=lambda v: num(v, nd))
    p.draw(pen)
    return pen.getCommands()


def bounds(layers):
    bs = [p.bounds for p in layers.values() if p.bounds != (0, 0, 0, 0)]
    return min(b[0] for b in bs), min(b[1] for b in bs), max(b[2] for b in bs), max(b[3] for b in bs)


def normalised(layers, pad=0.0):
    x0, y0, x1, y1 = bounds(layers)
    return {k: place(v, 1, pad - x0, pad - y0) for k, v in layers.items()}, x1 - x0 + 2 * pad, y1 - y0 + 2 * pad


def svg(layers, scheme, title, pad=0.0, bg=None, height=None, nd=2):
    layers, w, h = normalised(layers, pad)
    size = f' width="{num(w, 2)}" height="{num(h, 2)}"' if height is None else f' height="{height}" width="{num(height * w / h, 1)}"'
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {num(w, 2)} {num(h, 2)}"{size} role="img"><title>{title}</title>']
    if bg:
        out.append(f'<rect width="100%" height="100%" fill="{bg}"/>')
    for role in ORDER:
        if role in layers and role in scheme:
            out.append(f'<path fill="{scheme[role]}" d="{pathdata(layers[role], nd)}"/>')
    out.append('</svg>')
    return ''.join(out)


def tile(size, symbol_height, bg, radius=0.0, fg=IVORY):
    """The symbol centred on a square tile (favicons, app icons, avatars)."""
    mark, light = symbol()
    s = symbol_height / 100
    x, y = (size - LOWER * s) / 2, (size - 100 * s) / 2
    shape = f'<rect width="{size}" height="{size}" rx="{num(radius, 2)}" fill="{bg}"/>' if bg else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" width="{size}" height="{size}">{shape}'
            f'<path fill="{GOLD}" d="{pathdata(place(light, s, x, y))}"/><path fill="{fg}" d="{pathdata(place(mark, s, x, y))}"/></svg>')


def png(svg_text, width=None, height=None):
    data = resvg_py.svg_to_bytes(svg_string=svg_text, width=width, height=height)
    return bytes(data)


def ico(images):
    head = struct.pack('<HHH', 0, 1, len(images))
    offset, entries, blobs = 6 + 16 * len(images), b'', b''
    for size, blob in images:
        entries += struct.pack('<BBBBHHII', size % 256, size % 256, 0, 0, 1, 32, len(blob), offset + len(blobs))
        blobs += blob
    return head + entries + blobs


def write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    if isinstance(data, str):
        path.write_text(data, encoding='utf-8', newline='\n')
    else:
        path.write_bytes(data)


def ts_paths(layers):
    layers, w, h = normalised(layers)
    body = ', '.join(f"{k}: '{pathdata(v, 1)}'" for k, v in layers.items())
    return f"{{ viewBox: '0 0 {num(w, 1)} {num(h, 1)}', {body} }}"


SPELLINGS = {'ventures': 'VENTURES', 'venture': 'VENTURE'}
NAMES = {'ventures': 'Basera Ventures', 'venture': 'Basera Venture'}


def build():
    for folder in (KIT / 'svg', KIT / 'png'):
        for old in folder.glob('*') if folder.exists() else ():
            old.unlink()

    # Symbol (the same for both spellings)
    sym = symbol_layers()
    for scheme in SCHEMES:
        suffix = '' if scheme == 'color' else f'-{scheme}'
        doc = svg(sym, SCHEMES[scheme], 'Basera symbol')
        write(KIT / 'svg' / f'basera-symbol{suffix}.svg', doc)
        write(KIT / 'png' / f'basera-symbol{suffix}.png', png(doc, height=1024))

    for key, sub in SPELLINGS.items():
        name = NAMES[key]
        slug = name.lower().replace(' ', '-')
        for kind, make, width in (('horizontal', horizontal, 2400), ('stacked', stacked, 1600), ('wordmark', wordmark, 1600)):
            layers = make(sub)
            for scheme in SCHEMES:
                suffix = '' if scheme == 'color' else f'-{scheme}'
                doc = svg(layers, SCHEMES[scheme], name)
                write(KIT / 'svg' / f'{slug}-{kind}{suffix}.svg', doc)
                if scheme in ('color', 'reverse') or kind != 'wordmark':
                    write(KIT / 'png' / f'{slug}-{kind}{suffix}.png', png(doc, width=width))
        seal = stamp(sub)
        for scheme in ('charcoal', 'gold'):
            doc = svg(seal, SCHEMES[scheme], f'{name} seal')
            write(KIT / 'svg' / f'{slug}-stamp-{scheme}.svg', doc)
            write(KIT / 'png' / f'{slug}-stamp-{scheme}.png', png(doc, width=1200))

    # Social avatars (circle-safe) and web icons
    write(KIT / 'png' / 'basera-avatar-charcoal.png', png(tile(1080, 500, CHARCOAL), 1080))
    write(KIT / 'png' / 'basera-avatar-ivory.png', png(tile(1080, 500, IVORY, fg=CHARCOAL), 1080))
    favicon = tile(64, 46, CHARCOAL, radius=14)
    write(APP / '(frontend)' / 'icon.svg', favicon)
    write(ICONS / 'favicon.svg', favicon)
    write(APP / 'favicon.ico', ico([(s, png(tile(64, 48 if s < 32 else 46, CHARCOAL, radius=12 if s < 32 else 14), s, s)) for s in (16, 32, 48)]))
    write(APP / '(frontend)' / 'apple-icon.png', png(tile(180, 100, CHARCOAL), 180, 180))
    write(ICONS / 'icon-192.png', png(tile(192, 96, CHARCOAL), 192, 192))
    write(ICONS / 'icon-512.png', png(tile(512, 256, CHARCOAL), 512, 512))
    write(ICONS / 'symbol-512.png', png(tile(512, 440, None, fg=CHARCOAL), 512, 512))

    # Paths for the website's header, footer and admin
    lines = [
        '// Generated by brand/source/build_logo.py — change the script and run it again, not this file.',
        '',
        '/** The Basera symbol: `mark` is the B, `light` the lit doorway behind it. */',
        f'export const SYMBOL = {ts_paths(symbol_layers())} as const',
        '',
        '/** Horizontal lockups: symbol, BASERA and the second line, by spelling. */',
        'export const LOCKUPS = {',
        *(f'  {key}: {ts_paths(horizontal(sub))},' for key, sub in SPELLINGS.items()),
        '} as const',
        '',
    ]
    write(ROOT / 'src' / 'components' / 'brand' / 'logo-data.ts', '\n'.join(lines))

    write(ROOT / 'brand' / 'logo-sheet.html', sheet())
    print('Logo kit written to', KIT.relative_to(ROOT))


# ── Presentation sheet ───────────────────────────────────────────────────────
def data_uri(blob):
    return 'data:image/png;base64,' + base64.b64encode(blob).decode()


def construction():
    """The symbol at 4×, with the numbers it is drawn from."""
    s = 4
    mark, light = symbol()
    waist = (SILL + DOOR_HEAD) / 2
    g = [f'<path fill="{CHARCOAL}" opacity=".13" d="{pathdata(place(mark, s))}"/>']
    line = f'stroke="{GOLD}" stroke-width="1" fill="none"'
    for x in (0, STEM, UPPER - WALL_UPPER, LOWER - WALL_LOWER, UPPER, LOWER):
        g.append(f'<line x1="{x * s}" y1="-14" x2="{x * s}" y2="{100 * s + 14}" {line} stroke-dasharray="3 4"/>')
    for y in (0, WINDOW_HEAD, SILL, DOOR_HEAD, 100 - THRESHOLD, 100):
        g.append(f'<line x1="-14" y1="{y * s}" x2="{LOWER * s + 14}" y2="{y * s}" {line} stroke-dasharray="3 4"/>')
    for cx, cy, r in ((UPPER - R_UPPER[0], R_UPPER[0], R_UPPER[0]),
                      (UPPER - R_UPPER[1], waist + OVERLAP - R_UPPER[1], R_UPPER[1]),
                      (LOWER - R_LOWER[0], waist + R_LOWER[0], R_LOWER[0]),
                      (LOWER - R_LOWER[1], 100 - R_LOWER[1], R_LOWER[1])):
        g.append(f'<circle cx="{cx * s}" cy="{cy * s}" r="{r * s}" {line} opacity=".7"/>')
    g.append(f'<path fill="none" stroke="{CHARCOAL}" stroke-width="1.6" d="{pathdata(place(mark, s))}"/>')
    labels = []
    for y, t in ((0, '0'), (WINDOW_HEAD, str(WINDOW_HEAD)), (SILL, str(SILL)), (DOOR_HEAD, str(DOOR_HEAD)), (100 - THRESHOLD, str(100 - THRESHOLD)), (100, '100')):
        labels.append(f'<text x="-22" y="{y * s + 4}" text-anchor="end">{t}</text>')
    for x, t in ((0, '0'), (STEM, str(STEM)), (UPPER - WALL_UPPER, str(UPPER - WALL_UPPER)), (LOWER - WALL_LOWER, str(LOWER - WALL_LOWER)), (UPPER, str(UPPER)), (LOWER, str(LOWER))):
        labels.append(f'<text x="{x * s}" y="{100 * s + 34}" text-anchor="middle">{t}</text>')
    w, h = LOWER * s, 100 * s
    return (f'<svg viewBox="-60 -24 {w + 90} {h + 72}" width="{w + 90}" height="{h + 72}" class="construction">'
            + ''.join(g) + '<g class="nums">' + ''.join(labels) + '</g></svg>')


def cmyk(hexcol):
    r, g, b = (int(hexcol[i:i + 2], 16) / 255 for i in (1, 3, 5))
    k = 1 - max(r, g, b)
    return tuple(round(v * 100) for v in ((1 - r - k) / (1 - k), (1 - g - k) / (1 - k), (1 - b - k) / (1 - k), k))


SHEET_CSS = '''
@font-face { font-family: Fraunces; src: url('source/fonts/Fraunces.ttf'); font-weight: 100 900; }
@font-face { font-family: Instrument; src: url('source/fonts/InstrumentSans.ttf'); font-weight: 400 700; }
* { box-sizing: border-box; }
body { margin: 0; background: #F7F2EA; color: #2A2622; font: 15px/1.55 Instrument, system-ui, sans-serif; }
.page { width: 1600px; margin: 0 auto; padding: 0 0 80px; }
.label { font-size: 11px; letter-spacing: .22em; text-transform: uppercase; color: #8a7a5c; font-weight: 600; }
h2 { font: 400 34px/1.15 Fraunces, serif; font-variation-settings: 'opsz' 60; margin: 6px 0 18px; }
p { margin: 0 0 12px; max-width: 46em; }
.hero { height: 620px; display: grid; place-items: center; border-bottom: 1px solid #e4dccd; position: relative; }
.hero .label { position: absolute; top: 40px; left: 64px; }
.hero .note { position: absolute; bottom: 36px; left: 64px; right: 64px; display: flex; justify-content: space-between; color: #7c7263; font-size: 13px; }
section { padding: 64px 64px 0; }
.two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 64px; align-items: center; }
.three { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
.panel { border-radius: 10px; display: grid; place-items: center; padding: 56px 32px; min-height: 260px; }
.panel svg, .construction { max-width: 100%; height: auto; }
.panel.light { background: #FFFDF8; border: 1px solid #e9e1d2; }
.panel.dark { background: #2A2622; }
.panel.gold { background: #A88A57; }
.cap { margin-top: 10px; font-size: 13px; color: #7c7263; }
.construction text { font: 12px Instrument, sans-serif; fill: #8a7a5c; }
.swatches { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.swatch { border-radius: 10px; overflow: hidden; border: 1px solid #e4dccd; background: #FFFDF8; }
.swatch .chip { height: 150px; }
.swatch .meta { padding: 16px 20px; font-size: 13px; line-height: 1.7; }
.swatch b { font: 400 22px Fraunces, serif; display: block; margin-bottom: 4px; }
.tiny { display: flex; gap: 40px; align-items: flex-end; flex-wrap: wrap; }
.tiny figure { margin: 0; display: grid; justify-items: center; gap: 10px; font-size: 12px; color: #7c7263; }
.tiny img.px { image-rendering: pixelated; }
.avatar { width: 160px; height: 160px; border-radius: 50%; }
.type { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.type .panel { justify-items: start; place-items: start; }
.big-serif { font: 460 64px/1 Fraunces, serif; font-variation-settings: 'opsz' 60, 'SOFT' 0, 'WONK' 0; letter-spacing: .12em; }
.big-sans { font: 540 40px/1 Instrument, sans-serif; letter-spacing: .3em; }
.clear { position: relative; display: inline-block; padding: 34px; outline: 1px dashed #A88A57; outline-offset: 0; }
ul { margin: 0; padding-left: 18px; } li { margin: 4px 0; }
'''


def sheet():
    sym = symbol_layers()
    hz, st, wm = horizontal('VENTURES'), stacked('VENTURES'), wordmark('VENTURES')
    c, r = SCHEMES['color'], SCHEMES['reverse']
    fav = {s: data_uri(png(tile(64, 48 if s < 32 else 46, CHARCOAL, radius=12 if s < 32 else 14), s, s)) for s in (16, 32, 48)}
    avatar = data_uri(png(tile(1080, 500, CHARCOAL), 320))
    avatar_iv = data_uri(png(tile(1080, 500, IVORY, fg=CHARCOAL), 320))
    seal = svg(stamp('VENTURES'), SCHEMES['charcoal'], 'Seal', height=220)
    clear_px = STEM * (NAME_CAP + SUB_GAP + SUB_CAP) / 100 * 110 / normalised(hz)[2]
    sw = ''.join(
        f'<div class="swatch"><div class="chip" style="background:{hexcol}"></div><div class="meta"><b>{label}</b>'
        f'HEX {hexcol} · RGB {", ".join(str(int(hexcol[i:i + 2], 16)) for i in (1, 3, 5))}<br>'
        f'CMYK {"/".join(str(v) for v in cmyk(hexcol))} (approx.)<br>{note}</div></div>'
        for label, hexcol, note in (
            ('Deep charcoal', CHARCOAL, 'The B, the name, all text. Print: Pantone Black 7 C as a starting point.'),
            ('Muted gold', GOLD, 'The lit doorway; VENTURES on dark grounds. Print: gold foil or Pantone 871 C metallic.'),
            ('Warm ivory', IVORY, 'Grounds and reversed artwork. Print: an ivory or cream stock rather than ink.'),
        ))
    return f'''<!doctype html><html lang="en"><meta charset="utf-8"><title>Basera Ventures — logo</title>
<style>{SHEET_CSS}</style>
<div class="page">
<div class="hero"><span class="label">Basera Ventures · Logo</span>{svg(hz, c, 'Basera Ventures', height=190)}
<div class="note"><span>Primary logo · deep charcoal and muted gold on warm ivory</span><span>Jaipur · luxury homestays, corporate stays and shoot locations</span></div></div>

<section class="two"><div>
<span class="label">The idea</span><h2>A B that is also a doorway</h2>
<p>Basera means a dwelling, a place to rest for the night. The symbol draws the B of Basera as a Jaipur façade: the stem is a pillar, the upper counter is a jharokha window, and the lower counter is an arched doorway with its light on.</p>
<p>Both openings are cut in the same arch the website uses: vertical jambs, a small stepped shoulder and a pointed head, the profile of the city's palace and haveli doorways. It says <em>home</em> without drawing a house. The open door says <em>welcome</em>, and the B still reads at favicon size.</p>
<p>The wordmark sets BASERA in Fraunces, a high-contrast serif with crisp wedge serifs, and VENTURES in Instrument Sans, widely spaced. They are the same two typefaces the website uses.</p>
</div><div style="display:grid;place-items:center">{construction()}<div class="cap">Construction on a 100-unit height: pillar 20 · window 22 × 29 · door 28 × 36 · walls 18 / 20 · bowls from radii 26, 20, 26, 28</div></div></section>

<section><span class="label">Lockups</span><h2>Horizontal, stacked, wordmark</h2>
<div class="three">
<div><div class="panel light">{svg(hz, c, 'Horizontal', height=96)}</div><div class="cap">Horizontal: website header, documents, email signatures</div></div>
<div><div class="panel light">{svg(st, c, 'Stacked', height=200)}</div><div class="cap">Stacked: signage, business cards, social posts</div></div>
<div><div class="panel light">{svg(wm, c, 'Wordmark', height=84)}</div><div class="cap">Wordmark: when the symbol already appears nearby</div></div>
<div><div class="panel dark">{svg(hz, r, 'Horizontal reverse', height=96)}</div><div class="cap">Reverse on charcoal: VENTURES and the door in gold</div></div>
<div><div class="panel dark">{svg(st, r, 'Stacked reverse', height=200)}</div><div class="cap">Reverse, stacked</div></div>
<div><div class="panel dark">{svg(sym, r, 'Symbol reverse', height=170)}</div><div class="cap">Symbol on charcoal</div></div>
</div></section>

<section><span class="label">Monochrome</span><h2>One colour, door open</h2>
<p>In one colour the doorway is simply left open. Use these for stamps, embossing, engraving, foil, fax and newspaper.</p>
<div class="three">
<div><div class="panel light">{svg(hz, SCHEMES['charcoal'], 'Charcoal', height=96)}</div><div class="cap">Charcoal</div></div>
<div><div class="panel dark">{svg(hz, SCHEMES['ivory'], 'Ivory', height=96)}</div><div class="cap">Ivory (white) on dark or on photographs</div></div>
<div><div class="panel dark">{svg(hz, SCHEMES['gold'], 'Gold', height=96)}</div><div class="cap">Gold, for foil on charcoal card</div></div>
<div><div class="panel light">{svg(sym, SCHEMES['charcoal'], 'Symbol charcoal', height=170)}</div><div class="cap">Symbol, charcoal</div></div>
<div><div class="panel light">{svg(sym, c, 'Symbol colour', height=170)}</div><div class="cap">Symbol, colour</div></div>
<div><div class="panel gold">{svg(sym, SCHEMES['ivory'], 'Symbol ivory', height=170)}</div><div class="cap">Symbol, ivory on gold</div></div>
</div></section>

<section class="two"><div><span class="label">The symbol on its own</span><h2>Favicon, avatar, seal</h2>
<p>The symbol works without the name: browser tab, app icon, WhatsApp / Instagram / Google profile picture, and a round seal for invoices, agreements and letters.</p>
<div class="tiny">
<figure><img class="px" src="{fav[16]}" width="16" height="16" alt=""><span>16 px</span></figure>
<figure><img class="px" src="{fav[32]}" width="32" height="32" alt=""><span>32 px</span></figure>
<figure><img class="px" src="{fav[48]}" width="48" height="48" alt=""><span>48 px</span></figure>
<figure><img class="px" src="{fav[16]}" width="64" height="64" alt=""><span>16 px, enlarged</span></figure>
<figure><img class="avatar" src="{avatar}" alt=""><span>Profile picture</span></figure>
<figure><img class="avatar" src="{avatar_iv}" alt="" style="border:1px solid #e4dccd"><span>Profile picture, light</span></figure>
</div></div>
<div style="display:grid;place-items:center">{seal}<div class="cap">Seal: BASERA VENTURES · JAIPUR · INDIA (one colour)</div></div></section>

<section><span class="label">Colour</span><h2>Three colours, used sparingly</h2><div class="swatches">{sw}</div>
<p class="cap" style="margin-top:14px">Gold is for the doorway and accents. It is too light for small text on ivory, so text stays charcoal on light grounds.</p></section>

<section><span class="label">Typography</span><h2>The website's own typefaces</h2><div class="type">
<div class="panel light"><span class="big-serif">BASERA</span><div class="cap">Fraunces · optical size 60 · weight 460 · soft 0 · tracking +120</div></div>
<div class="panel light"><span class="big-sans">VENTURES</span><div class="cap">Instrument Sans · weight 540 · tracking +550 (in the logo)</div></div>
</div></section>

<section class="two"><div><span class="label">Space and size</span><h2>Give it room</h2>
<ul>
<li>Clear space on every side: at least the width of the B's pillar (X).</li>
<li>Smallest sizes: horizontal 140 px / 35 mm wide · stacked 90 px / 22 mm wide · symbol 16 px / 6 mm tall.</li>
<li>Use the files as supplied. Don't redraw, stretch, outline, add shadows or gradients, recolour the door on a light ground, or set the name in another typeface.</li>
<li>On photographs, use the ivory version over a calm, darker area.</li>
</ul></div>
<div style="display:grid;place-items:center"><span class="clear" style="padding:{clear_px:.1f}px">{svg(hz, c, 'Clear space', height=110)}</span><div class="cap">Dashed line: the minimum clear space, X</div></div></section>

<section><span class="label">Spelling</span><h2>Also supplied as BASERA VENTURE</h2>
<p>Your link page and email use “Basera Venture”. The kit includes the same files with the singular spelling (basera-venture-…). The website shows whichever matches the name in Site settings.</p>
<div class="panel light" style="min-height:0;padding:40px">{svg(horizontal('VENTURE'), c, 'Basera Venture', height=80)}</div></section>
</div></html>'''


if __name__ == '__main__':
    build()
