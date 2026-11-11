#!/usr/bin/env python
"""Step 5a'. Triangle budgets, smoothing settings and the browser-frame origin for the Blender step.

    $HN_PY -I tools/headneck/16b_mesh_plan.py [--total 380000]
        -> $HN_WORK/meshes/plan.json

Budget:  T_i  proportional to  w_i * A_i^0.75   (A = raw surface area; sub-linear so small structures keep detail),
         w = importance weight (laryngeal cartilages and hyoid 3, airway lumen and vessels 2, ... muscles 0.7),
         clamped to [1500, raw triangle count], scaled so the total is about --total.
Origin (subtracted before the axis change, recorded in every JSON that carries coordinates):
         R0 = mid-sagittal plane (mean R of the spinal-canal and trachea centroids), so X = 0 is the patient's midline;
         A0, S0 = centre of the exported slice volume, so the volume box is centred on the origin in Y and Z.
"""
import argparse
import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import catalog

WORK = Path(os.environ.get("HN_WORK", Path.home() / "Developer/overlord-asset-sources/totalsegmentator"))
ap = argparse.ArgumentParser()
ap.add_argument("--total", type=int, default=380000)
a = ap.parse_args()

raw = json.loads((WORK / "meshes" / "raw_meshes.json").read_text())["meshes"]
st = json.loads((WORK / "review" / "corrected" / "stats.json").read_text())
dec = json.loads((Path(__file__).resolve().parent / "14_decisions.json").read_text())
info = json.loads((WORK / "data" / "s0527" / "subject_info.json").read_text())

WEIGHT = {"thyroid_cartilage": 3.0, "cricoid_cartilage": 3.0, "hyoid": 3.0, "hard_palate": 1.5, "mandible": 1.2,
          "skull": 0.8, "teeth_upper": 1.0, "teeth_lower": 1.0, "sternum": 0.8, "esophagus": 0.8, "spinal_cord": 0.8,
          "tongue": 0.7, "soft_palate": 1.0, "thyroid_gland": 1.4}
GROUP_WEIGHT = {"airway": 2.0, "cartilage": 3.0, "vessel": 2.0, "bone": 1.0, "gland": 1.2, "muscle": 0.7, "other": 0.8}
# Taubin iterations: fewer on thin / small parts so fine shape survives
SMOOTH = {"thyroid_cartilage": 18, "cricoid_cartilage": 18, "hyoid": 14, "hard_palate": 12, "internal_carotid_artery_left": 14,
          "internal_carotid_artery_right": 14, "teeth_upper": 8, "teeth_lower": 8}
DEFAULT_SMOOTH = 24

ids = dec["keep"]
w = {i: WEIGHT.get(i, GROUP_WEIGHT[catalog.group(i)]) for i in ids}
score = {i: w[i] * raw[i]["area_mm2"] ** 0.75 for i in ids}
lo = 1500
scale = a.total / sum(score.values())
for _ in range(30):                          # water-filling with the clamps
    t = {i: min(max(score[i] * scale, lo), raw[i]["triangles"]) for i in ids}
    free = [i for i in ids if lo < score[i] * scale < raw[i]["triangles"]]
    if not free:
        break
    fixed = sum(t[i] for i in ids if i not in free)
    new_scale = (a.total - fixed) / sum(score[i] for i in free)
    if abs(new_scale - scale) / scale < 1e-4:
        break
    scale = new_scale

AG = info["frame_G"]["affine_native_ijk_to_G_mm"]
top_k = dec["parameters"]["exhibit_top_native_k_exclusive"]
shape = info["shape_ijk"]
A_lo, A_hi = AG[1][3] - 0.75, AG[1][3] - 0.75 + 1.5 * shape[1]
S_lo, S_hi = AG[2][3] - 0.75, AG[2][3] - 0.75 + 1.5 * top_k
origin = [round(st["midline_R_mm"], 2), round((A_lo + A_hi) / 2, 2), round((S_lo + S_hi) / 2, 2)]

DISPLAY_OVERRIDE = {
    "skull": "Skull base and maxilla (skull cut at the exhibit's upper boundary)",
    "spinal_cord": "Spinal cord with thecal sac (spinal canal contents)",
    "trachea": "Trachea and main bronchi (lumen)",
    "hypopharynx": "Hypopharynx (air lumen with piriform sinuses)",
    "larynx_air": "Laryngeal airway (lumen)",
    "sterno_thyroid_left": "Infrahyoid strap muscle (sternothyroid), left",
    "sterno_thyroid_right": "Infrahyoid strap muscle (sternothyroid), right",
    "aorta": "Aortic arch",
    "sternum": "Sternum (manubrium and upper body)",
    "clavicula_left": "Clavicle, left (medial part)",
    "clavicula_right": "Clavicle, right (medial part)",
}
plan = {"origin_G_mm": origin,
        "origin_note": "R0 = mid-sagittal plane from spinal canal and trachea centroids; A0, S0 = centre of the exported slice volume",
        "total_target": a.total, "structures": []}
for i in ids:
    plan["structures"].append({
        "id": i, "display_name": DISPLAY_OVERRIDE.get(i, catalog.display_name(i)), "group": catalog.group(i),
        "side": catalog.split_side(i)[1], "weight": w[i], "raw_triangles": raw[i]["triangles"],
        "raw_area_mm2": raw[i]["area_mm2"], "target_triangles": int(round(t[i])),
        "smooth_iterations": SMOOTH.get(i, DEFAULT_SMOOTH)})
(WORK / "meshes" / "plan.json").write_text(json.dumps(plan, indent=1) + "\n")
tot = sum(s["target_triangles"] for s in plan["structures"])
print("origin_G_mm", origin, "total target triangles", tot)
for s in sorted(plan["structures"], key=lambda s: -s["target_triangles"])[:12]:
    print(f"  {s['id']:32} {s['raw_triangles']:8d} -> {s['target_triangles']:6d}")
print("  ...")
for s in sorted(plan["structures"], key=lambda s: s["target_triangles"])[:8]:
    print(f"  {s['id']:32} {s['raw_triangles']:8d} -> {s['target_triangles']:6d}")
