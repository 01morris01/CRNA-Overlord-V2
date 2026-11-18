"""textures.py: the printed marks and small normal maps the airway and machine props use (system Python 3 + Pillow + numpy).

   python3 -I tools/props/airway/textures.py OUTDIR [name ...]

Every picture is drawn from the dimensions in specs.py at a known pixel density, so a mark printed on a model lands where
the geometry says it should (a 1 mL line on a syringe is exactly one mL of plunger travel from zero).

Ink pictures are RGBA: RGB is the ink color, A is coverage (the model uses them as alpha-masked decals over clear plastic)."""
import math, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import specs

FONT = '/System/Library/Fonts/Supplemental/Arial.ttf'
FONT_B = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'


def font(px, bold=False):
    return ImageFont.truetype(FONT_B if bold else FONT, max(6, int(round(px))))


def frac(x):
    """US printing of half mLs on 3 mL syringes: 1/2, 1 1/2 ..."""
    w = int(x); h = abs(x - w) > 1e-6
    if not h: return str(w)
    return ('' if w == 0 else str(w)) + '½'


def ink_rgba(mask, rgb=(10, 10, 12)):
    a = np.clip(mask, 0, 255).astype(np.uint8); out = np.zeros(mask.shape + (4,), np.uint8); out[..., 0], out[..., 1], out[..., 2] = rgb; out[..., 3] = a
    return Image.fromarray(out, 'RGBA')


# ---------------------------------------------------------------------------------------------- syringe scale
def syringe_scale(key, out, ppmm=24.0):
    """The scale patch for one syringe size. Layout (millimetres): the patch is W wide (around the barrel) and H tall (along
    the barrel). Image top = the end nearest the tip. The zero line is TOP_MARGIN below the top edge, and the line for V mL is
    V * mm_per_ml below the zero line. Returns the layout so the builder can place the patch."""
    s = specs.SYRINGES[key]; mmml = s['mm_per_ml']
    top, bottom = 3.0, 7.5                                         # margins: above zero, and below the last mark (room for the "mL" capacity mark)
    H = top + s['scale_len'] + bottom
    W = {'3ml': 12.0, '5ml': 14.0, '10ml': 16.0}[key]               # arc width of the printed band (mm), about 130, 115, 110 degrees of the barrel
    w, h = int(round(W * ppmm)), int(round(H * ppmm)); S = 4                       # draw 4x and reduce, for clean edges
    img = Image.new('L', (w * S, h * S), 0); d = ImageDraw.Draw(img)
    def Y(mm): return (top + mm) * ppmm * S
    x0 = 1.0 * ppmm * S                                             # ticks start 1 mm in from the left edge
    lw_minor, lw_major = 0.19 * ppmm * S, 0.25 * ppmm * S
    minor_len = {'3ml': 2.4, '5ml': 2.8, '10ml': 3.2}[key] * ppmm * S
    major_len = {'3ml': 4.2, '5ml': 5.0, '10ml': 5.6}[key] * ppmm * S
    mid_len = (minor_len + major_len) / 2
    n = int(round(s['ml'] / s['minor']))
    for i in range(n + 1):
        v = i * s['minor']; y = Y(v * mmml)
        is_major = abs(v / s['major'] - round(v / s['major'])) < 1e-6
        is_half = (key != '3ml') and abs(v * 2 - round(v * 2)) < 1e-6 and not is_major
        L = major_len if is_major else (mid_len if is_half else minor_len); lw = lw_major if is_major else lw_minor
        d.rectangle([x0, y - lw / 2, x0 + L, y + lw / 2], fill=255)
    fs = {'3ml': 2.3, '5ml': 2.6, '10ml': 2.8}[key] * ppmm * S; f = font(fs)
    for v in s['numbers']:
        t = frac(v) if key == '3ml' else str(int(v)); y = Y(v * mmml)
        bb = d.textbbox((0, 0), t, font=f); th = bb[3] - bb[1]
        d.text((x0 + major_len + 0.7 * ppmm * S, y - th / 2 - bb[1]), t, font=f, fill=255)
    # the capacity under the last line, and "mL" beside the first number
    f2 = font(fs * 0.95, bold=True); cap = '%d mL' % s['ml']; bb = d.textbbox((0, 0), cap, font=f2)
    d.text((x0, Y(s['scale_len']) + 1.9 * ppmm * S - bb[1]), cap, font=f2, fill=255)
    img = img.resize((w, h), Image.LANCZOS)
    a = np.asarray(img).astype(np.float32); a = np.clip(a * 1.15, 0, 255)
    ink_rgba(a).save(os.path.join(out, 'syringe_scale_%s.png' % key))
    return dict(width_mm=W, height_mm=H, top_mm=top, px=(w, h))


# ---------------------------------------------------------------------------------------------- review ruler (not shipped)
def ruler(out, ppmm=8):
    """A 30 cm steel rule face: 320 x 30 mm, mm ticks, cm numbers, inch scale on the other edge. Opaque RGB."""
    W, H = 320, 30; w, h = W * ppmm, H * ppmm; S = 2
    img = Image.new('RGB', (w * S, h * S), (205, 207, 208)); d = ImageDraw.Draw(img); k = ppmm * S; x0 = 10 * k
    f = font(3.6 * k)
    for mm in range(0, 301):
        x = x0 + mm * k; L = (6.5 if mm % 10 == 0 else 4.5 if mm % 5 == 0 else 3.0) * k
        d.rectangle([x - 0.09 * k, 0, x + 0.09 * k, L], fill=(25, 25, 28))
        if mm % 10 == 0 and mm > 0:
            t = str(mm // 10); bb = d.textbbox((0, 0), t, font=f); d.text((x - (bb[2] - bb[0]) / 2, 7.2 * k), t, font=f, fill=(25, 25, 28))
    for q in range(0, 12 * 16 + 1):
        x = x0 + q * 25.4 / 16 * k; L = (6.0 if q % 16 == 0 else 4.0 if q % 8 == 0 else 3.0 if q % 4 == 0 else 2.0) * k
        d.rectangle([x - 0.09 * k, h * S - L, x + 0.09 * k, h * S], fill=(25, 25, 28))
        if q % 16 == 0 and q > 0:
            t = str(q // 16); bb = d.textbbox((0, 0), t, font=f); d.text((x - (bb[2] - bb[0]) / 2, h * S - 7.2 * k - (bb[3] - bb[1]) - bb[1]), t, font=f, fill=(25, 25, 28))
    f2 = font(2.6 * k); d.text((x0 + 140 * k, 13 * k), 'mm  30 cm', font=f2, fill=(25, 25, 28))
    img.resize((w, h), Image.LANCZOS).save(os.path.join(out, 'ruler_30cm.png'))
    return dict(width_mm=W, height_mm=H, zero_mm=10)


# ---------------------------------------------------------------------------------------------- machine prints
def bellows_scale(out, ppmm=10):
    """The housing scale: a band W mm wide (around) x H mm tall. Image top = the housing top (bellows fully up = 0 mL
    delivered). The line for V mL sits V / area below the top. Returns the layout."""
    B = specs.BELLOWS; W = 34.0; top_pad = 4.0; H = B['travel'] * 1000 + top_pad + 8.0
    w, h = int(W * ppmm), int(H * ppmm); S = 3; img = Image.new('L', (w * S, h * S), 0); d = ImageDraw.Draw(img); k = ppmm * S
    f = font(4.2 * k, bold=True); f2 = font(3.2 * k, bold=True)
    for v in B['scale']:
        y = (top_pad + v * 1e-6 / B['area'] * 1000) * k; L = (9 if v in B['labels'] else 5.5) * k
        d.rectangle([W / 2 * k - L / 2, y - 0.35 * k, W / 2 * k + L / 2, y + 0.35 * k], fill=255)
        if v in B['labels']:
            t = str(v); bb = d.textbbox((0, 0), t, font=f); d.text((W / 2 * k + L / 2 + 1.2 * k, y - (bb[3] - bb[1]) / 2 - bb[1]), t, font=f, fill=255)
    t = 'mL'; bb = d.textbbox((0, 0), t, font=f2); d.text((W / 2 * k - L / 2 - 1.5 * k - (bb[2] - bb[0]), (top_pad + 300e-6 / B['area'] * 1000) * k - (bb[3] - bb[1]) / 2 - bb[1]), t, font=f2, fill=255)
    a = np.asarray(img.resize((w, h), Image.LANCZOS)).astype(np.float32)
    ink_rgba(a, (245, 245, 245)).save(os.path.join(out, 'bellows_scale.png'))
    return dict(width_mm=W, height_mm=H, top_pad_mm=top_pad)


def flow_scale(out, kind, ppmm=16):
    """A flow-tube scale printed on the glass: W mm wide band, H = graduated length + margins; image top = top of tube."""
    F = specs.FLOW; spec = F[kind]; g0, g1 = F['grad_y']; G = (g1 - g0) * 1000; W = 14.0; pad = 6.0; H = G + 2 * pad
    w, h = int(W * ppmm), int(H * ppmm); S = 3; img = Image.new('L', (w * S, h * S), 0); d = ImageDraw.Draw(img); k = ppmm * S
    f = font(2.6 * k, bold=True)
    for q in spec['marks']:
        frac_ = (q / spec['qmax']) ** spec['k']; y = (pad + G * (1 - frac_)) * k; lab = spec['labels'].get(q)
        L = (5.5 if lab else 3.2) * k; d.rectangle([0.6 * k, y - 0.22 * k, 0.6 * k + L, y + 0.22 * k], fill=255)
        if lab:
            bb = d.textbbox((0, 0), lab, font=f); d.text((0.6 * k + L + 0.8 * k, y - (bb[3] - bb[1]) / 2 - bb[1]), lab, font=f, fill=255)
    f2 = font(2.2 * k, bold=True); t = spec['unit']; bb = d.textbbox((0, 0), t, font=f2); d.text((0.6 * k, (pad + G) * k + 1.2 * k - bb[1]), t, font=f2, fill=255)
    a = np.asarray(img.resize((w, h), Image.LANCZOS)).astype(np.float32)
    ink_rgba(a, (14, 14, 16)).save(os.path.join(out, 'flow_scale_%s.png' % kind))
    return dict(width_mm=W, height_mm=H, pad_mm=pad)


def dial_ring(out, name, marks, r_text, r_tick, size=1024, rgb=(14, 14, 16), ccw=True, extra=(), tick_len=0.06, font_px=0.075, sub=None):
    """A round print (square picture, center = disk center): numbers at angles around a ring. marks: [(label, deg)];
    angles are measured counter-clockwise from 12 o'clock as seen on the picture (ccw=True)."""
    S = 2; N = size * S; img = Image.new('L', (N, N), 0); d = ImageDraw.Draw(img); c = N / 2; f = font(font_px * N, bold=True)
    for lab, deg in marks:
        a = math.radians(deg if ccw else -deg); ux, uy = -math.sin(a), -math.cos(a)
        x0, y0 = c + ux * r_tick * N, c + uy * r_tick * N; x1, y1 = c + ux * (r_tick + tick_len) * N, c + uy * (r_tick + tick_len) * N
        d.line([(x0, y0), (x1, y1)], fill=255, width=int(0.011 * N))
        if lab is not None:
            t = str(lab); bb = d.textbbox((0, 0), t, font=f); tw, th = bb[2] - bb[0], bb[3] - bb[1]
            x, y = c + ux * r_text * N, c + uy * r_text * N; d.text((x - tw / 2 - bb[0], y - th / 2 - bb[1]), t, font=f, fill=255)
    for lab, deg in (sub or []):
        a = math.radians(deg if ccw else -deg); ux, uy = -math.sin(a), -math.cos(a)
        d.line([(c + ux * r_tick * N, c + uy * r_tick * N), (c + ux * (r_tick + tick_len * 0.55) * N, c + uy * (r_tick + tick_len * 0.55) * N)], fill=255, width=int(0.007 * N))
    for txt, (x, y), px in extra:
        f2 = font(px * N, bold=True); bb = d.textbbox((0, 0), txt, font=f2); d.text((x * N - (bb[2] - bb[0]) / 2 - bb[0], y * N - (bb[3] - bb[1]) / 2 - bb[1]), txt, font=f2, fill=255)
    a = np.asarray(img.resize((size, size), Image.LANCZOS)).astype(np.float32)
    ink_rgba(a, rgb).save(os.path.join(out, name + '.png'))


def machine_prints(out):
    L = {'bellows_scale': bellows_scale(out), 'flow_fine': flow_scale(out, 'fine'), 'flow_coarse': flow_scale(out, 'coarse')}
    S = specs.SEVO
    dial_ring(out, 'sevo_dial', [(('%g' % v) if v in (0, 0.4, 0.8, 1, 2, 3, 4, 5, 6, 7, 8) or v == 1.5 else None, a) for v, a in S['marks']] + [('T', S['T'])], r_text=0.355, r_tick=0.415, font_px=0.068,
              sub=[(None, a) for v, a in S['marks']], extra=[('Sevoflurane', (0.5, 0.67), 0.062), ('Vol.%', (0.5, 0.77), 0.05)], ccw=False)
    A = specs.APL
    dial_ring(out, 'apl_ring', [(lab, A['sp_at'] - a) for lab, a in A['marks']], r_text=0.40, r_tick=0.30, font_px=0.075, extra=[('cmH2O', (0.5, 0.5), 0.07)], ccw=False)
    dial_ring(out, 'flush_face', [], r_text=0.3, r_tick=0.4, extra=[('O2+', (0.5, 0.52), 0.28)], rgb=(245, 245, 245))
    dial_ring(out, 'bagvent_plate', [], r_text=0.3, r_tick=0.4, extra=[('BAG', (0.5, 0.20), 0.13), ('VENT', (0.5, 0.82), 0.13)])
    return L


# ---------------------------------------------------------------------------------------------- normal maps
def normal_from_height(h, strength, wrap=True):
    """Tangent-space normal map (OpenGL / glTF convention: +Y up in the picture = +V) from a height field in pixels."""
    gx = (np.roll(h, -1, 1) - np.roll(h, 1, 1)) / 2.0; gy = (np.roll(h, -1, 0) - np.roll(h, 1, 0)) / 2.0
    nx, ny, nz = -gx * strength, gy * strength, np.ones_like(h)          # image rows run down; V runs up
    l = np.sqrt(nx * nx + ny * ny + nz * nz); n = np.stack([nx / l, ny / l, nz / l], -1)
    return Image.fromarray(((n * 0.5 + 0.5) * 255 + 0.5).clip(0, 255).astype(np.uint8), 'RGB')


def knurl(out, px=256, n=8):
    """Diamond knurl, one tile = n x n diamonds (the builder maps one tile to 8 x 8 mm: 1 mm pitch)."""
    y, x = np.mgrid[0:px, 0:px] / px
    tri = lambda t: np.abs((t % 1.0) - 0.5) * 2.0
    h = np.minimum(tri(n * (x + y)), tri(n * (x - y)))                    # pyramids between two sets of crossing grooves
    h = np.clip(h * 1.25, 0, 1) ** 0.8
    img = normal_from_height(h * 6.0, 1.0); img.save(os.path.join(out, 'knurl_normal.png'))
    return dict(tile_mm=8.0, pitch_mm=8.0 / n)


def corrugated(out, px=512, ribs=8, tile_mm=36.0):
    """Corrugated breathing-tube wall: `ribs` rounded ribs per tile along V; U runs around the tube (no variation)."""
    y, x = np.mgrid[0:px, 0:px] / px
    t = (y * ribs) % 1.0
    S_ = lambda a: np.clip(np.sin(a), 0, 1)
    h = np.where(t < 0.5, S_(t / 0.5 * np.pi) ** 0.55, -0.35 * S_((t - 0.5) / 0.5 * np.pi) ** 1.5)    # a full rounded rib, then a narrower valley
    img = normal_from_height(h * px / ribs * 0.22, 1.0); img.save(os.path.join(out, 'corrugated_normal.png'))
    return dict(tile_mm=tile_mm, ribs=ribs, pitch_mm=tile_mm / ribs)


# ---------------------------------------------------------------------------------------------- main
def main():
    out = sys.argv[1]; os.makedirs(out, exist_ok=True); want = set(sys.argv[2:])
    layouts = {}
    if not want or 'syringe' in want:
        for k in specs.SYRINGES: layouts['syringe_' + k] = syringe_scale(k, out)
    if not want or 'ruler' in want: layouts['ruler'] = ruler(out)
    if not want or 'knurl' in want: layouts['knurl'] = knurl(out)
    if not want or 'machine' in want: layouts.update(machine_prints(out))
    if not want or 'corrugated' in want: layouts['corrugated'] = corrugated(out)
    import json
    p = os.path.join(out, 'layouts.json'); old = json.load(open(p)) if os.path.exists(p) else {}
    old.update(layouts); json.dump(old, open(p, 'w'), indent=1)
    print(json.dumps(layouts, indent=1))


if __name__ == '__main__':
    main()
