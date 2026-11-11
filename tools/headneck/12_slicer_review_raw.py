"""Step 4a. Review of the UNCORRECTED TotalSegmentator masks in 3D Slicer.

    "$HN_SLICER" --no-splash --python-script tools/headneck/12_slicer_review_raw.py

Loads the CT (0.75 mm working grid and the published 1.5 mm grid) and all task label maps into ONE Slicer
segmentation, then for every non-empty segment:
  quantitative checks  -> $HN_WORK/review/raw/stats.json
      voxel count, volume, centroid, bounding box, 26-connected components, HU mean/SD/percentiles,
      contact with the volume faces (field-of-view truncation), side of the midline;
      Slicer's own Segment Statistics module for cross-checking volume / centroid / HU;
      overlaps between segments of different tasks; Dice against the publisher's labels (task `total`)
  review renders       -> $HN_WORK/review/raw/img/<segment>_{ax,sag,cor,3da,3dl}.png
      slice overlays in three planes (the slice of largest cross-section) and two 3D views
Saves $HN_WORK/review/slicer/TS_raw.seg.nrrd and scene_raw.mrml.
"""
import os
import sys
import time
import traceback

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
import slicer
import vtk

import slicer_lib as L

OUT = os.path.join(L.WORK, "review", "raw")
IMG = os.path.join(OUT, "img")
SCN = os.path.join(L.WORK, "review", "slicer")
for d in (OUT, IMG, SCN):
    os.makedirs(d, exist_ok=True)
P = L.log_open(os.path.join(OUT, "slicer_review_raw.log"))

try:
    t0 = time.time()
    P("Slicer", slicer.app.applicationVersion, "revision", slicer.app.repositoryRevision, "os", slicer.app.os, slicer.app.arch)
    lm = L.setup_window()
    ct, ctn = L.load_cts()
    A = L.ijk_to_ras(ct)
    ct_arr = slicer.util.arrayFromVolume(ct)
    P("CT working grid", ct_arr.shape[::-1], "IJK->RAS", np.round(A, 4).tolist())

    segNode = slicer.mrmlScene.AddNewNodeByClass("vtkMRMLSegmentationNode", "TS_raw")
    segNode.CreateDefaultDisplayNodes()
    segNode.SetReferenceImageGeometryParameterFromVolumeNode(ct)
    info = L.import_task_labelmaps(segNode, ct, P)
    seg = segNode.GetSegmentation()
    names = [seg.GetNthSegment(i).GetName() for i in range(seg.GetNumberOfSegments())]
    P("segments:", len(names), "layers:", seg.GetNumberOfLayers())

    # midline from the two unpaired midline structures
    def cenR(nm):
        m = L.seg_array(segNode, seg.GetSegmentIdBySegmentName(nm), ct)
        kk, jj, ii = np.nonzero(m)
        return float((A @ np.array([ii.mean(), jj.mean(), kk.mean(), 1.0]))[0])
    mid = {nm: cenR(nm) for nm in ("spinal_cord", "trachea") if nm in names}
    midline_R = float(np.mean(list(mid.values())))
    P("midline R (mm) from", mid, "->", round(midline_R, 2))

    stats = L.segment_stats(segNode, ct, ct_arr, names, P, midline_R)
    sstats = L.slicer_segment_statistics(segNode, ct)
    by_name = {v["name"]: v for v in info.values()}
    for nm in names:
        stats[nm].update({"task": by_name[nm]["task"], "label": by_name[nm]["label"], "class": by_name[nm]["class"], "group": L.group_of(nm)})
        if nm in sstats:
            stats[nm]["slicer_SegmentStatistics"] = sstats[nm]
    P("stats done", round(time.time() - t0, 1), "s")

    # ---- overlaps between tasks (same-task classes cannot overlap) ----------------------------------
    import json
    labels = json.load(open(os.path.join(L.MASKS, "labels.json")))["tasks"]
    ml = {}
    for task in L.TASKS:
        n = slicer.util.loadLabelVolume(os.path.join(L.MASKS, f"{task}_ml.nii.gz"), properties={"name": f"tmp_{task}"})
        ml[task] = slicer.util.arrayFromVolume(n).copy()
        slicer.mrmlScene.RemoveNode(n)
    name_of = {(t, v["label"]): v["name"] for v in info.values() for t in [v["task"]]}
    overlaps = []
    for a in range(len(L.TASKS)):
        for b in range(a + 1, len(L.TASKS)):
            ta, tb = L.TASKS[a], L.TASKS[b]
            both = (ml[ta] > 0) & (ml[tb] > 0)
            if not both.any():
                continue
            code = ml[ta][both].astype(np.int32) * 1000 + ml[tb][both].astype(np.int32)
            u, c = np.unique(code, return_counts=True)
            for uu, cc in zip(u, c):
                na, nb = name_of[(ta, int(uu // 1000))], name_of[(tb, int(uu % 1000))]
                overlaps.append({"a": na, "b": nb, "voxels": int(cc), "frac_of_a": round(cc / stats[na]["voxels"], 4),
                                 "frac_of_b": round(cc / stats[nb]["voxels"], 4)})
    overlaps.sort(key=lambda o: -o["voxels"])
    P("cross-task overlapping pairs:", len(overlaps))

    # ---- Dice vs the publisher's reviewed labels (task total; native 1.5 mm grid replicated 2x2x2) --
    pub = slicer.util.loadLabelVolume(os.path.join(L.SUBJ, "publisher_labels_G.nii.gz"), properties={"name": "publisher_labels"})
    pa = slicer.util.arrayFromVolume(pub)
    pa2 = np.repeat(np.repeat(np.repeat(pa, 2, axis=0), 2, axis=1), 2, axis=2)
    assert pa2.shape == ml["total"].shape
    dice = {}
    for v_s, nm in labels["total"]["labels"].items():
        v = int(v_s)
        x, y = ml["total"] == v, pa2 == v
        if y.any() or x.any():
            dice[nm] = {"dice": round(float(2 * (x & y).sum() / max(x.sum() + y.sum(), 1)), 4), "model_vox": int(x.sum()), "publisher_vox": int(y.sum())}
    pub_only = [n for n, c in json.load(open(os.path.join(L.SUBJ, "publisher_labels.json")))["voxels_per_class_native_grid"].items()
                if n not in labels["total"]["labels"].values()]
    slicer.mrmlScene.RemoveNode(pub)
    del ml, pa2

    L.save_json({"slicer_version": slicer.app.applicationVersion, "slicer_revision": slicer.app.repositoryRevision,
                 "grid": {"shape_ijk": list(ct_arr.shape[::-1]), "ijk_to_RAS_G_mm": A.tolist()},
                 "midline_R_mm": midline_R, "midline_sources": mid,
                 "slice_view_axes": L.slice_axes_report(lm),
                 "segments": stats, "cross_task_overlaps": overlaps,
                 "dice_vs_publisher_total": dice, "publisher_classes_missing_from_model": pub_only},
                os.path.join(OUT, "stats.json"))
    slicer.util.saveNode(segNode, os.path.join(SCN, "TS_raw.seg.nrrd"))
    P("saved stats + TS_raw.seg.nrrd", round(time.time() - t0, 1), "s")

    # ---- renders -----------------------------------------------------------------------------------
    if os.environ.get("HN_NO_RENDER") != "1":
        segNode.CreateClosedSurfaceRepresentation()
        P("closed surfaces created", round(time.time() - t0, 1), "s")
        ctx_names = [n for n in ("skull", "mandible", "hyoid", "vertebrae_C1", "vertebrae_C2", "vertebrae_C3", "vertebrae_C4", "vertebrae_C5",
                                 "vertebrae_C6", "vertebrae_C7", "vertebrae_T1", "vertebrae_T2", "clavicula_left", "clavicula_right", "sternum")
                     if n in names]
        for i, nm in enumerate(names):
            m = L.seg_array(segNode, seg.GetSegmentIdBySegmentName(nm), ct)
            if not m.any():
                continue
            centres, cen = L.best_planes(m, A)
            size = float(max(stats[nm]["bbox_size_mm"]))
            grp = L.group_of(nm)
            pre = os.path.join(IMG, nm)
            L.render_segment(lm, segNode, ct, [nm], centres, cen, min(size, 220.0), pre, L.GROUP_WL[grp], context=None, close=True)
            # wider 3D view with skeletal context replaces the oblique close-up
            L.render_segment(lm, segNode, ct, [nm], centres, cen, max(min(size, 220.0), 110.0), pre + "_ctx", L.GROUP_WL[grp],
                             context={n: 0.18 for n in ctx_names}, close=False)
            for tag in ("ax", "sag", "cor", "3da"):
                os.remove(pre + f"_ctx_{tag}.png")
            if i % 20 == 0:
                P("rendered", i + 1, "/", len(names), round(time.time() - t0, 1), "s")
        P("renders done", round(time.time() - t0, 1), "s")
    slicer.util.saveScene(os.path.join(SCN, "scene_raw.mrml"))
    P("DONE", round(time.time() - t0, 1), "s")
except Exception:
    P("ERROR", traceback.format_exc())
slicer.util.exit(0)
