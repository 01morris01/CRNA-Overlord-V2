"""review_sheets.py: one sheet per item: Cycles views on top, three.js r170 views below (system Python + Pillow).
   python3 -I tools/props/airway/review_sheets.py RENDERDIR OUTDIR"""
import os, sys, glob, json
from PIL import Image, ImageDraw, ImageFont

src, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
F = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 22); FB = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 30)
specs = sorted(glob.glob(os.path.join(src, '..', 'final_specs', '*.json')))
for sp in specs:
    s = json.load(open(sp)); name = s['name']; views = [v['name'] for v in s['views']]
    W, H = 600, 400; cols = len(views); sheet = Image.new('RGB', (W * cols, 60 + 2 * (H + 34)), (24, 25, 27)); d = ImageDraw.Draw(sheet)
    d.text((14, 14), name, font=FB, fill=(235, 235, 235))
    for r, (tag, suf) in enumerate((('Cycles (Blender 5.1)', ''), ('three.js r170 (Chrome, Metal)', '_three'))):
        y = 60 + r * (H + 34); d.text((14, y + 4), tag, font=F, fill=(200, 200, 200))
        for c, v in enumerate(views):
            f = os.path.join(src, '%s_%s%s.png' % (name, v, suf))
            if os.path.exists(f): sheet.paste(Image.open(f).convert('RGB').resize((W, H)), (c * W, y + 34))
            d.text((c * W + 8, y + 40), v, font=F, fill=(255, 255, 255))
    sheet.save(os.path.join(out, name + '.png')); print('sheet', name)
