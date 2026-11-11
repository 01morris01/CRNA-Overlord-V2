#!/usr/bin/env python
"""Step 8. Assemble assets/models/headneck/structures.json from the pipeline's own records.

    $HN_PY -I tools/headneck/21_write_structures_json.py

Sources: review/corrected/stats.json + corrections.json (3D Slicer), review/raw/stats.json (Dice vs publisher labels),
         14_decisions.json + 14_review_notes.json (the reviewed selection and per-structure findings),
         meshes/plan.json, meshes/blender_report.json, meshes/validation.json, assets/.../volume.json.
"""
import json
import os
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import catalog

WORK = Path(os.environ.get("HN_WORK", Path.home() / "Developer/overlord-asset-sources/totalsegmentator"))
REPO = Path(os.environ.get("HN_REPO", Path.home() / "Developer/overlord-next"))
OUT = REPO / "assets" / "models" / "headneck"


def J(p):
    return json.loads(Path(p).read_text())


dec = J(HERE / "14_decisions.json")
notes = J(HERE / "14_review_notes.json")
cor = J(WORK / "review" / "corrected" / "stats.json")
corr = J(WORK / "review" / "corrected" / "corrections.json")
raw = J(WORK / "review" / "raw" / "stats.json")
plan = J(WORK / "meshes" / "plan.json")
brep = J(WORK / "meshes" / "blender_report.json")
val = J(WORK / "meshes" / "validation.json")
vol = J(OUT / "volume.json")
info = J(WORK / "data" / "s0527" / "subject_info.json")
labels = J(WORK / "masks" / "labels.json")

R0, A0, S0 = plan["origin_G_mm"]
pl = {s["id"]: s for s in plan["structures"]}
lab_of = {t["id"]: t for t in vol["labels"]["table"]}
changes = {}
for c in corr["changes"]:
    changes.setdefault(c["structure"], []).append(c)


def frame(p):
    R, A, S = p
    return [round(-(R - R0) / 1000.0, 6), round((S - S0) / 1000.0, 6), round((A - A0) / 1000.0, 6)]


BORDER = {"R_min": "left image border", "R_max": "right image border", "A_min": "posterior image border", "A_max": "anterior image border",
          "S_min": "lower scan boundary", "S_max": "upper image border"}
structures = []
for sid in dec["keep"]:
    s = cor["segments"][sid]
    rs = raw["segments"][s["raw_segment"]]
    v = val["structures"][sid]
    b = brep["structures"][sid]
    ch = changes.get(sid, [])
    cut = {}
    for k, n in s.get("border_contact_voxels", {}).items():
        key = k.split("(")[0]
        cut[BORDER[key]] = {"voxels": n, "cut_face_cm2": round(n * 0.5625 / 100.0, 2)}
    base, side = catalog.split_side(sid)
    other = None
    if side in ("left", "right"):
        o = sid.replace("left", "right") if side == "left" else sid.replace("right", "left")
        if o in cor["segments"]:
            other = o
    sd = v["surface_distance_raw_to_final_mm"]
    rec = {
        "id": sid,
        "display_name": pl[sid]["display_name"],
        "side": side,
        "group": pl[sid]["group"],
        "label_id": lab_of[sid]["label"],
        "source": {"tool": "TotalSegmentator 2.18.0", "task": s["task"], "label_value": s["label"], "class": s["class"]},
        "review": {
            "status": "corrected" if ch else "accepted",
            "note": notes["kept"][sid],
            "corrections": [{"step": c["step"], "operation": c["operation"], "reason": c["reason"],
                             "voxels_before": c["voxels_before"], "voxels_after": c["voxels_after"]} for c in ch],
            "reviewed_in": "3D Slicer %s (AI-assisted visual and quantitative review; not a clinical validation)" % cor["slicer_version"],
        },
        "mask": {
            "grid": "0.75 mm working grid",
            "voxel_count": s["voxels"], "volume_mL": s["volume_mL"],
            "voxel_count_before_corrections": rs["voxels"], "volume_mL_before_corrections": rs["volume_mL"],
            "components": s["components_26"], "largest_component_fraction": s["largest_component_fraction"],
            "centroid_m": frame(s["centroid_RAS_mm"]),
            "bbox_min_m": [min(a, b_) for a, b_ in zip(frame(s["bbox_RAS_min_mm"]), frame(s["bbox_RAS_max_mm"]))],
            "bbox_max_m": [max(a, b_) for a, b_ in zip(frame(s["bbox_RAS_min_mm"]), frame(s["bbox_RAS_max_mm"]))],
            "hu_mean": s["HU_mean"], "hu_sd": s["HU_sd"], "hu_p05": s["HU_p05"], "hu_median": s["HU_median"], "hu_p95": s["HU_p95"],
            "cut_by_field_of_view": cut,
        },
        "slice_labels": {"voxel_count_1p5mm": lab_of[sid]["voxels"], "volume_mL": lab_of[sid]["volume_mL"],
                         "volume_ratio_to_mask": lab_of[sid]["volume_ratio_to_corrected_mask"]},
        "mesh": {
            "node": sid,
            "triangles_raw": b["raw_triangles"], "triangles_final": v["triangles_final"], "vertices_final": v["vertices_final"],
            "smoothing": "Taubin lambda=0.5 mu=-0.53, %d iterations" % b["taubin_iterations"],
            "shells_removed": b.get("removed_shells", 0),
            "surface_distance_raw_to_final_mm": {"mean": sd["mean"], "p95": sd["p95"], "max": sd["max"]},
            "volume_mL_raw_mesh": round(b["raw_volume_mL"], 4), "volume_mL_final_mesh": v["volume_mesh_mL"],
            "volume_change_pct_raw_to_final": round((v["volume_mesh_mL"] - b["raw_volume_mL"]) / b["raw_volume_mL"] * 100.0, 3),
            "volume_diff_pct_final_mesh_vs_voxels": v["volume_diff_pct"],
            "centroid_m": v["centroid_mesh_m"], "centroid_error_vs_mask_mm": v["centroid_error_mm"],
        },
    }
    if other:
        rec["paired_with"] = other
        rec["volume_ratio_to_pair"] = round(s["volume_mL"] / cor["segments"][other]["volume_mL"], 3)
        rec["laterality_check"] = {"centroid_x_mm": v["centroid_x_mm"], "expected_sign": "+" if side == "left" else "-", "pass": v["laterality_ok"]}
    d = raw.get("dice_vs_publisher_total", {}).get(s["class"]) if s["task"] == "total" else None
    if d:
        rec["review"]["dice_vs_publisher_label_before_corrections"] = d["dice"]
    structures.append(rec)

excluded = []
for key, reason in dec["excluded"].items():
    raw_name = "skull" if key.startswith("skull [") else key
    rs = raw["segments"][raw_name]
    excluded.append({"class": rs["class"], "task": rs["task"], "label_value": rs["label"], "volume_mL": rs["volume_mL"],
                     "components": rs.get("components_26"), "reason": reason})
empty = []
for task, rec in labels["tasks"].items():
    for n in rec["empty"]:
        empty.append({"class": n, "task": task})

status_count = {"accepted": sum(1 for s in structures if s["review"]["status"] == "accepted"),
                "corrected": sum(1 for s in structures if s["review"]["status"] == "corrected")}
out = {
    "schema": "overlord.headneck.structures/1",
    "disclaimer": "Automatic segmentation (TotalSegmentator) reviewed and corrected by an AI assistant in 3D Slicer with quantitative checks. NOT validated by a radiologist or clinician. Teaching illustration only; not for clinical use.",
    "source": vol["source"],
    "frame": vol["frame"],
    "files": {"meshes": "headneck.glb", "volume": "volume.json"},
    "counts": {"tasks_run": list(labels["tasks"].keys()),
               "classes_in_those_tasks": sum(len(r["labels"]) + len(r["empty"]) for r in labels["tasks"].values()),
               "classes_with_voxels": sum(len(r["labels"]) for r in labels["tasks"].values()),
               "classes_empty_in_this_scan": len(empty),
               "exported": len(structures), **status_count, "excluded": len(excluded),
               "triangles_total": val["total_triangles"]},
    "verification": {"max_centroid_error_mm": val["max_centroid_error_mm"], "max_abs_volume_diff_pct_mesh_vs_voxels": val["max_abs_volume_diff_pct"],
                     "laterality_checked": val["laterality_checked"], "laterality_failures": val["laterality_failures"],
                     "asymmetry_check": val["asymmetry_check"], "nodes_with_transform": val["nodes_with_transform"]},
    "structures": structures,
    "excluded": excluded,
    "empty_classes": empty,
}
(OUT / "structures.json").write_text(json.dumps(out, indent=1) + "\n")
print("wrote", OUT / "structures.json", (OUT / "structures.json").stat().st_size, "bytes")
print(json.dumps(out["counts"], indent=1))
