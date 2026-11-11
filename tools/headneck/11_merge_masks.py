#!/usr/bin/env python
"""Step 3b. Merge TotalSegmentator's per-class masks into one label map per task (input for 3D Slicer).

For every task directory $HN_WORK/masks/<task>/ it writes
  $HN_WORK/masks/<task>_ml.nii.gz     uint8 label map on the working grid; label value = the task's own class index
  $HN_WORK/masks/labels.json          {task: {label value: class name}}, empty classes, voxel counts, run reports

Within a task the classes do not overlap (nnU-Net arg-max), which the script asserts.

    $HN_PY -I tools/headneck/11_merge_masks.py
"""
import json
import os
from pathlib import Path

import nibabel as nib
import numpy as np

from totalsegmentator.map_to_binary import class_map

WORK = Path(os.environ.get("HN_WORK", Path.home() / "Developer/overlord-asset-sources/totalsegmentator"))
MASKS = WORK / "masks"
TASKS = ["total", "headneck_bones_vessels", "headneck_muscles", "head_glands_cavities", "head_muscles", "craniofacial_structures"]

ref = nib.load(WORK / "data" / "s0527" / "ct_075.nii.gz")
out = {"reference": "data/s0527/ct_075.nii.gz", "shape": list(ref.shape), "tasks": {}}
for task in TASKS:
    d = MASKS / task
    cm = class_map[task]
    ml = np.zeros(ref.shape, dtype=np.uint8)
    rec = {"labels": {}, "empty": [], "missing_files": [], "voxels": {}}
    for idx, name in sorted(cm.items()):
        f = d / f"{name}.nii.gz"
        if not f.exists():
            rec["missing_files"].append(name)
            continue
        im = nib.load(f)
        assert im.shape == ref.shape and np.allclose(im.affine, ref.affine, atol=1e-3), (task, name)
        m = np.asanyarray(im.dataobj) > 0
        n = int(m.sum())
        if n == 0:
            rec["empty"].append(name)
            continue
        assert not (ml[m] > 0).any(), f"{task}: {name} overlaps another class of the same task"
        ml[m] = idx
        rec["labels"][str(idx)] = name
        rec["voxels"][name] = n
    h = nib.Nifti1Header()
    h.set_data_dtype(np.uint8)
    o = nib.Nifti1Image(ml, ref.affine, h)
    o.set_sform(ref.affine, code=1)
    o.set_qform(ref.affine, code=1)
    nib.save(o, MASKS / f"{task}_ml.nii.gz")
    rr = d / "run_report.json"
    if rr.exists():
        r = json.loads(rr.read_text())
        rec["run_report"] = {k: r.get(k) for k in ("totalsegmentator_version", "nnunetv2_version", "torch_version", "device", "runtime_seconds", "num_classes")}
    out["tasks"][task] = rec
    print(f"{task:26} classes with voxels: {len(rec['labels']):3d}  empty: {len(rec['empty']):3d}  missing files: {len(rec['missing_files'])}")
(MASKS / "labels.json").write_text(json.dumps(out, indent=1) + "\n")
print("wrote", MASKS / "labels.json")
