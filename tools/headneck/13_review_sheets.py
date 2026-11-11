#!/usr/bin/env python
"""Step 4b. Assemble the Slicer captures into review sheets (one row per structure) for visual judgement.

    $HN_PY -I tools/headneck/13_review_sheets.py raw            # after 12_slicer_review_raw.py
    $HN_PY -I tools/headneck/13_review_sheets.py corrected      # after 15_slicer_review_corrected.py
    $HN_PY -I tools/headneck/13_review_sheets.py raw name1 name2 ...   # only these structures, one sheet

Row = axial | sagittal | coronal slice overlay (Slicer slice views, slice of largest cross-section) |
      3D from anterior | 3D from the patient's left with translucent skeleton.
Slice view conventions come from stats.json["slice_view_axes"] and are printed on every panel.
"""
import json
import os
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

WORK = Path(os.environ.get("HN_WORK", Path.home() / "Developer/overlord-asset-sources/totalsegmentator"))
stage = sys.argv[1]
only = sys.argv[2:]
D = WORK / "review" / stage
IMG = D / "img"
OUT = D / "sheets"
OUT.mkdir(parents=True, exist_ok=True)
st = json.loads((D / "stats.json").read_text())
axes = st["slice_view_axes"]
segs = st["segments"]
CELL = 300
ROWS = 5
GROUP_ORDER = ["airway", "cartilage", "bone", "vessel", "gland", "muscle", "other"]

try:
    font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 13)
    small = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 11)
except Exception:
    font = small = ImageFont.load_default()


def cell(path):
    if not path.exists():
        return Image.new("RGB", (CELL, CELL), (40, 0, 0))
    im = Image.open(path).convert("RGB")
    w, h = im.size
    s = min(w, h)
    im = im.crop(((w - s) // 2, (h - s) // 2, (w - s) // 2 + s, (h - s) // 2 + s))
    return im.resize((CELL, CELL), Image.LANCZOS)


def row(nm):
    r = segs[nm]
    strip = Image.new("RGB", (CELL * 5, CELL + 34), (0, 0, 0))
    tags = [("ax", "Red"), ("sag", "Yellow"), ("cor", "Green"), ("3da", None), ("ctx_3dl", None)]
    for x, (tag, view) in enumerate(tags):
        strip.paste(cell(IMG / f"{nm}_{tag}.png"), (x * CELL, 34))
    d = ImageDraw.Draw(strip)
    bc = ",".join(f"{k.split('(')[0]}:{v}" for k, v in r.get("border_contact_voxels", {}).items()) or "none"
    t1 = f"{nm}   [{r.get('task')}#{r.get('label')}]   {r['volume_mL']} mL   comps {r.get('components_26')} (largest {r.get('largest_component_fraction')})"
    t2 = (f"HU {r.get('HU_mean')}±{r.get('HU_sd')} (p5 {r.get('HU_p05')}, p95 {r.get('HU_p95')})   side {r.get('centroid_side')} "
          f"({r.get('centroid_minus_midline_R_mm')} mm)   border {bc}   bbox {r.get('bbox_size_mm')}")
    d.text((4, 2), t1, fill=(255, 255, 120), font=font)
    d.text((4, 18), t2, fill=(200, 200, 200), font=small)
    for x, (tag, view) in enumerate(tags):
        if view:
            a = axes[view]
            d.text((x * CELL + 4, 34 + CELL - 14), f"{a['orientation']}: right={a['screen_right_is']} up={a['screen_up_is']}", fill=(120, 255, 120), font=small)
        else:
            d.text((x * CELL + 4, 34 + CELL - 14), "3D from anterior" if tag == "3da" else "3D from patient-left (skeleton ghost)", fill=(120, 255, 120), font=small)
    return strip


names = [n for n in segs if segs[n].get("voxels", 0) > 0]
if only:
    names = [n for n in only if n in segs]
else:
    names.sort(key=lambda n: (GROUP_ORDER.index(segs[n].get("group", "other")), n))
index = {}
for s in range(0, len(names), ROWS):
    chunk = names[s:s + ROWS]
    sheet = Image.new("RGB", (CELL * 5, (CELL + 34) * len(chunk)), (0, 0, 0))
    for i, nm in enumerate(chunk):
        sheet.paste(row(nm), (0, i * (CELL + 34)))
    fn = OUT / (f"sheet_{s // ROWS + 1:02d}.png" if not only else f"custom_{'_'.join(only)[:60]}.png")
    sheet.save(fn, optimize=True)
    index[fn.name] = chunk
    print(fn.name, chunk)
if not only:
    (OUT / "index.json").write_text(json.dumps(index, indent=1) + "\n")
