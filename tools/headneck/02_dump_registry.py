#!/usr/bin/env python
"""Step 1b. Dump the task registry and class maps of the INSTALLED TotalSegmentator package.

Writes tools/headneck/registry.json:
  - every selectable task -> modality, license flag, {label value: class name}
  - which tasks are license-gated (totalsegmentator.map_to_binary.commercial_models)
  - where each open task's weights come from (weights id, release tag, file) as recorded in the package
  - an explicit search of ALL class names for nerve / plexus terms (coverage evidence)

Runs instantly: imports only the pure-data maps, no torch model, no weights download.

    $HN_PY tools/headneck/02_dump_registry.py
"""
import json
import os
import re
import sys
from pathlib import Path

from totalsegmentator.map_to_binary import class_map, commercial_models
from totalsegmentator.map_tasks_config import TASK_CONFIGS
from totalsegmentator.registry import TASKS, task_registry, package_version

OUT = Path(__file__).resolve().parent / "registry.json"

reg = task_registry()

# ---- weights provenance per task (from the package's own tables) ---------------------------------
def task_ids(task):
    cfg = TASK_CONFIGS.get(task)
    if cfg is None:
        return None
    ids = {}
    if "sub_modes" in cfg:
        for mode, sub in cfg["sub_modes"].items():
            ids[mode] = sub["task_id"]
    else:
        ids["default"] = cfg.get("task_id")
    return ids


for name, t in reg["tasks"].items():
    cfg = TASK_CONFIGS.get(name, {})
    t["num_classes"] = len(t["classes"])
    t["weights_ids"] = task_ids(name)
    t["config"] = {k: v for k, v in cfg.items() if k in ("resample", "crop", "crop_addon", "model", "disallow_fast", "commercial", "crop_model")}

# ---- nerve / plexus coverage ---------------------------------------------------------------------
NERVE_TERMS = [
    "nerve", "nerv", "plexus", "brachial", "vagus", "vagal", "phrenic", "recurrent", "laryngeal_n",
    "ganglion", "sympathetic", "cord", "root", "trunk", "hypoglossal", "accessory", "facial_n",
    "trigeminal", "glossopharyngeal", "sciatic", "femoral_n", "median", "ulnar", "radial",
    "canal",  # e.g. inferior alveolar canal (a bony canal for a nerve, not the nerve itself)
]
pat = re.compile("|".join(re.escape(t) for t in NERVE_TERMS), re.I)

hits = {}
for name, t in reg["tasks"].items():
    for idx, cls in t["classes"].items():
        if pat.search(cls):
            hits.setdefault(cls, []).append({"task": name, "label": int(idx), "license_required": t["license_required"]})


def is_true_nerve(cls):
    c = cls.lower()
    return ("nerve" in c) or ("spinal_cord" in c) or ("plexus" in c)


nerve_classes = {k: v for k, v in hits.items() if is_true_nerve(k)}
false_friends = {k: v for k, v in hits.items() if not is_true_nerve(k)}

all_classes = sorted({c for t in reg["tasks"].values() for c in t["classes"].values()})
brachial_plexus_present = any("plexus" in c.lower() for c in all_classes)

coverage = {
    "search_terms": NERVE_TERMS,
    "nervous_system_classes_found": nerve_classes,
    "matched_but_not_nerves": false_friends,
    "any_class_containing_plexus": [c for c in all_classes if "plexus" in c.lower()],
    "brachial_plexus_present": brachial_plexus_present,
    "peripheral_nerves_of_neck_or_arm_present": False if not any(
        re.search(r"vagus|phrenic|recurrent|accessory|hypoglossal|median|ulnar|radial_n|plexus", c, re.I) for c in all_classes) else True,
    "statement": (
        "The installed registry contains no brachial plexus class and no peripheral nerve class of the neck or arm "
        "(no vagus, phrenic, recurrent laryngeal, accessory, hypoglossal, cervical/brachial plexus roots, trunks or cords). "
        "The only nervous-system classes are spinal_cord (task total; total_mr), optic_nerve_left/right "
        "(head_glands_cavities; oculomotor_muscles) and brain / brain sub-structures. "
        "Matches such as brachiocephalic_trunk, *_alveolar_canal, auditory_canal_* and *_incisive_canal_* are vessels or bony canals, not nerves."
    ),
}

out = {
    "generated_by": "tools/headneck/02_dump_registry.py",
    "source": "installed package: totalsegmentator.registry.task_registry(), totalsegmentator.map_to_binary.commercial_models, totalsegmentator.map_tasks_config.TASK_CONFIGS",
    "totalsegmentator_version": package_version(),
    "num_tasks": len(TASKS),
    "num_unique_classes": len(all_classes),
    "open_tasks": [t for t in TASKS if t not in commercial_models],
    "license_gated_tasks": {t: commercial_models[t] for t in TASKS if t in commercial_models},
    "license_gated_note": "license_gated_tasks maps task -> weights id served only by the TotalSegmentator license server "
                          "(free non-commercial key requires registration; not obtained, not used).",
    "open_weights_source": "https://github.com/wasserth/TotalSegmentator/releases/download/<tag>/<file>.zip (see totalsegmentator/libs.py)",
    "nerve_coverage": coverage,
    "tasks": reg["tasks"],
}
OUT.write_text(json.dumps(out, indent=1) + "\n")
print(f"wrote {OUT}  ({OUT.stat().st_size} bytes)")
print("version", out["totalsegmentator_version"], "tasks", out["num_tasks"], "unique classes", out["num_unique_classes"])
print("license-gated:", ", ".join(out["license_gated_tasks"]))
print("nervous-system classes:", json.dumps(nerve_classes, indent=1))
print("matched but not nerves:", sorted(false_friends))
print("brachial plexus present:", brachial_plexus_present)
