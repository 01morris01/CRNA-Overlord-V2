#!/usr/bin/env python
"""Step 10a. Small review images for docs/overlord-world/HEADNECK-CT.md (each < 300 KB, JPEG).

    $HN_PY -I tools/headneck/23_doc_images.py

Built from files the earlier steps left in the work area:
  review/raw/img, review/corrected/img      3D Slicer captures (12_*, 14_*)
  review/mesh_compare                       Blender renders (19_*)
  review/volume/deface_check.png            exported-volume check
Only neck-level panels are used for the Slicer sheets (no facial profile).
"""
import json
import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

WORK = Path(os.environ.get("HN_WORK", Path.home() / "Developer/overlord-asset-sources/totalsegmentator"))
REPO = Path(os.environ.get("HN_REPO", Path.home() / "Developer/overlord-next"))
DOC = REPO / "docs" / "overlord-world" / "headneck"
DOC.mkdir(parents=True, exist_ok=True)
RAW, COR, CMP = WORK / "review" / "raw", WORK / "review" / "corrected", WORK / "review" / "mesh_compare"
font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 13)
small = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 11)


def sq(path, size):
    im = Image.open(path).convert("RGB")
    w, h = im.size
    s = min(w, h)
    return im.crop(((w - s) // 2, (h - s) // 2, (w - s) // 2 + s, (h - s) // 2 + s)).resize((size, size), Image.LANCZOS)


def save(img, name, quality=80):
    p = DOC / name
    q = quality
    while True:
        img.save(p, quality=q, optimize=True)
        if p.stat().st_size < 290_000 or q <= 40:
            break
        q -= 6
    print(f"{name}: {img.size} {p.stat().st_size / 1000:.0f} KB (q={q})")


def slicer_rows(stage_dir, names, cell=236, tags=("ax", "sag", "cor", "3da", "ctx_3dl"), title=None):
    st = json.loads((stage_dir / "stats.json").read_text())
    ax = st["slice_view_axes"]
    head = 20
    img = Image.new("RGB", (cell * len(tags), (cell + head) * len(names) + (22 if title else 0)), (0, 0, 0))
    d = ImageDraw.Draw(img)
    y0 = 0
    if title:
        d.text((4, 3), title, fill=(255, 255, 255), font=font)
        y0 = 22
    for r, nm in enumerate(names):
        s = st["segments"][nm]
        y = y0 + r * (cell + head)
        d.text((4, y + 3), f"{nm}   {s['volume_mL']:.2f} mL   {s['HU_mean']:.0f} +/- {s['HU_sd']:.0f} HU   components {s['components_26']}", fill=(255, 255, 140), font=font)
        for c, t in enumerate(tags):
            img.paste(sq(stage_dir / "img" / f"{nm}_{t}.png", cell), (c * cell, y + head))
            lab = {"ax": f"axial (right={ax['Red']['screen_right_is']}, up={ax['Red']['screen_up_is']})",
                   "sag": f"sagittal (right={ax['Yellow']['screen_right_is']})", "cor": f"coronal (right={ax['Green']['screen_right_is']})",
                   "3da": "3D from anterior", "ctx_3dl": "3D from patient-left"}[t]
            d.text((c * cell + 3, y + head + cell - 14), lab, fill=(120, 255, 120), font=small)
    return img


# 1. Slicer review of the corrected laryngeal set (neck-level panels only)
save(slicer_rows(COR, ["thyroid_cartilage", "cricoid_cartilage", "larynx_air", "thyroid_gland", "anterior_scalene_right"],
                 title="3D Slicer review captures, corrected segmentation (outline = mask on the 0.75 mm working volume)"), "slicer_review_larynx.jpg")

# 2. the largest correction: hypopharynx before / after the HU mask
a = slicer_rows(RAW, ["hypopharynx"], tags=("ax", "sag", "cor", "3da"), cell=290, title="hypopharynx as segmented (region incl. collapsed lumen and mucosa)")
b = slicer_rows(COR, ["hypopharynx"], tags=("ax", "sag", "cor", "3da"), cell=290, title="hypopharynx after correction A (HU < -400 only: air crescent and piriform sinuses)")
both = Image.new("RGB", (a.width, a.height + b.height), (0, 0, 0))
both.paste(a, (0, 0))
both.paste(b, (0, a.height))
save(both, "slicer_hypopharynx_before_after.jpg")

# 3. Slicer 3D group overviews of the corrected segmentation
groups = ["all", "airway", "cartilage", "bone", "vessel", "muscle"]
C = 300
g = Image.new("RGB", (C * 4, C * 3), (0, 0, 0))
d = ImageDraw.Draw(g)
for gi, name in enumerate(groups):
    for vi, tag in enumerate(("3da", "3dl")):
        x, y = ((gi % 2) * 2 + vi) * C, (gi // 2) * C
        g.paste(sq(COR / "img" / f"group_{name}_{tag}.png", C), (x, y))
        d.text((x + 5, y + 4), f"{name}: {'from anterior' if tag == '3da' else 'from patient-left'}", fill=(255, 255, 140), font=small)
save(g, "slicer_groups_3d.jpg")

# 4. mesh clean-up before / after
rep = json.loads((CMP / "compare_render.json").read_text())
for name, ids in (("mesh_cleanup_a.jpg", ["thyroid_cartilage", "hyoid", "larynx_air"]),
                  ("mesh_cleanup_b.jpg", ["cricoid_cartilage", "common_carotid_artery_left", "anterior_scalene_left"])):
    C = 330
    sheet = Image.new("RGB", (C * 3, (C + 22) * len(ids)), (8, 8, 10))
    d = ImageDraw.Draw(sheet)
    for r, i in enumerate(ids):
        for c, t in enumerate(("raw", "final", "wire")):
            sheet.paste(Image.open(CMP / f"{i}_{t}.png").convert("RGB").resize((C, C), Image.LANCZOS), (c * C, r * (C + 22) + 22))
        d.text((6, r * (C + 22) + 4), f"{i}: raw Slicer surface {rep[i]['raw_triangles']:,} tris  |  final (shipped) {rep[i]['final_triangles']:,} tris  |  final with triangle edges",
               fill=(255, 255, 140), font=font)
    save(sheet, name)

# 5. overview of the shipped GLB
ov = Image.new("RGB", (3 * 400, 514), (8, 8, 10))
for c, t in enumerate(("anterior", "left_lateral", "posterior_right")):
    ov.paste(Image.open(CMP / f"overview_{t}.png").convert("RGB").resize((400, 514), Image.LANCZOS), (c * 400, 0))
save(ov, "glb_overview.jpg")

# 6. exported-volume defacing check and the left IJV gap
im = Image.open(WORK / "review" / "volume" / "deface_check.png").convert("RGB")
save(im.resize((int(im.width * 1.0), int(im.height * 1.0))), "volume_deface_check.jpg")
im = Image.open(RAW / "ijv_left_gap.png").convert("RGB")
save(im, "ijv_left_gap.jpg")
