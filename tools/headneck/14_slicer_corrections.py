"""Step 4c. Corrections in 3D Slicer (Segment Editor, scripted) and the corrected segmentation.

    "$HN_SLICER" --no-splash --python-script tools/headneck/14_slicer_corrections.py

Input : $HN_WORK/review/slicer/TS_raw.seg.nrrd (all 124 non-empty TotalSegmentator classes), CT working grid
Output: $HN_WORK/review/slicer/TS_corrected.seg.nrrd      the structures selected for export, corrected
        $HN_WORK/review/corrected/corrections.json        every change, with the reason and voxel counts
        $HN_WORK/review/corrected/stats.json + img/       the same checks and renders as for the raw masks

Selection (which classes are kept / excluded and why) is the reviewed list in 14_decisions.json next to this file.

Corrections, in this order (Segment Editor effects unless noted):
  A  HU-masked edit of the five air-lumen segments: Threshold (HU < -400) into a helper segment, then
     Logical operators / INTERSECT. Reason: the model's pharynx classes are regions that include collapsed lumen and
     mucosa (53.7 % of `hypopharynx` voxels were not air); an exhibit "lumen" must be air.
  B  Seam between two models: `larynx_air` (headneck_bones_vessels) and `trachea` (total) are separated by an unlabeled
     layer of air voxels. Those voxels (HU < -400, between and connected to both) are added to `trachea`
     (helper segment built at voxel coordinates, then Logical operators / UNION).
  B2 The same kind of seam in the carotid artery: `common_carotid_artery_*` (total) ends about 14 mm below
     `internal_carotid_artery_*` (headneck_bones_vessels) although the enhanced vessel is plainly visible in between.
     Voxels >= 120 HU inside a 9 mm tube that connect the two masks are added to the common carotid.
  C  Skull: planar cut at the exhibit's upper boundary (helper box segment, Logical operators / SUBTRACT). Privacy and scope:
     nothing above the temporomandibular joints is exported.
  D  Overlaps between segments that come from different models: Logical operators / SUBTRACT by a fixed priority
     (air lumen > cartilage and bone > arteries > veins > glands > esophagus, spinal canal > muscles).
  E  Islands / REMOVE_SMALL_ISLANDS (< 200 voxels = 84 mm3) on every kept segment;
     Islands / KEEP_LARGEST_ISLAND on the skull (fragments left floating by cut C).
No smoothing, margin or interpolation effect was applied to any mask (surface smoothing is done on the meshes only).
"""
import json
import os
import sys
import time
import traceback

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
import slicer
import vtk
from scipy import ndimage as ndi

import slicer_lib as L

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(L.WORK, "review", "corrected")
IMG = os.path.join(OUT, "img")
SCN = os.path.join(L.WORK, "review", "slicer")
for d in (OUT, IMG):
    os.makedirs(d, exist_ok=True)
P = L.log_open(os.path.join(OUT, "slicer_corrections.log"))
DEC = json.load(open(os.path.join(HERE, "14_decisions.json")))
AIR_HU = DEC["parameters"]["air_lumen_max_HU"]            # -400
MIN_ISLAND = DEC["parameters"]["min_island_voxels"]      # 200
S_TOP = DEC["parameters"]["exhibit_top_S_mm"]            # upper exhibit boundary in frame G
KEEP = DEC["keep"]                                        # ordered by overlap priority (first wins)
SOURCE = DEC.get("source_segment", {})                    # final id -> raw segment name when they differ

try:
    t0 = time.time()
    P("Slicer", slicer.app.applicationVersion, "revision", slicer.app.repositoryRevision)
    lm = L.setup_window()
    ct, ctn = L.load_cts()
    A = L.ijk_to_ras(ct)
    ct_arr = slicer.util.arrayFromVolume(ct)
    raw = slicer.util.loadSegmentation(os.path.join(SCN, "TS_raw.seg.nrrd"))
    raw.SetName("TS_raw")
    rseg = raw.GetSegmentation()

    cor = slicer.mrmlScene.AddNewNodeByClass("vtkMRMLSegmentationNode", "TS_corrected")
    cor.CreateDefaultDisplayNodes()
    cor.SetReferenceImageGeometryParameterFromVolumeNode(ct)
    cseg = cor.GetSegmentation()
    meta = {}
    for sid_final in KEEP:
        src = SOURCE.get(sid_final, sid_final)
        rid = rseg.GetSegmentIdBySegmentName(src)
        assert rid, f"raw segment {src} not found"
        ok = cseg.CopySegmentFromSegmentation(rseg, rid)
        assert ok, src
        s = cseg.GetSegment(rid)
        s.SetName(sid_final)
        tags = {}
        for t in ("TS.task", "TS.label", "TS.class"):
            v = vtk.mutable("")
            if s.GetTag(t, v):
                tags[t] = str(v)
        meta[sid_final] = {"task": tags.get("TS.task"), "label": int(tags.get("TS.label", 0)), "class": tags.get("TS.class"), "raw_segment": src}
    slicer.mrmlScene.RemoveNode(raw)
    P("copied", cseg.GetNumberOfSegments(), "segments into TS_corrected", round(time.time() - t0, 1), "s")

    def sid(name):
        return cseg.GetSegmentIdBySegmentName(name)

    def arr(name):
        return L.seg_array(cor, sid(name), ct)

    def count(name):
        return int(arr(name).sum())

    # ---- Segment Editor ---------------------------------------------------------------------------
    w = slicer.qMRMLSegmentEditorWidget()
    w.setMRMLScene(slicer.mrmlScene)
    en = slicer.mrmlScene.AddNewNodeByClass("vtkMRMLSegmentEditorNode")
    w.setMRMLSegmentEditorNode(en)
    w.setSegmentationNode(cor)
    w.setSourceVolumeNode(ct)
    en.SetOverwriteMode(slicer.vtkMRMLSegmentEditorNode.OverwriteNone)
    en.SetMaskMode(slicer.vtkMRMLSegmentationNode.EditAllowedEverywhere)
    en.SetSourceVolumeIntensityMask(False)

    def effect(name):
        w.setActiveEffectByName(name)
        e = w.activeEffect()
        assert e is not None, name
        return e

    def logical(target, op, modifier):
        en.SetSelectedSegmentID(sid(target))
        e = effect("Logical operators")
        e.setParameter("Operation", op)
        e.setParameter("ModifierSegmentID", sid(modifier))
        e.setParameter("BypassMasking", "1")
        e.self().onApply()

    def helper_from_array(name, mask_kji):
        hid = cseg.AddEmptySegment(name, name)
        slicer.util.updateSegmentBinaryLabelmapFromArray(mask_kji.astype(np.uint8), cor, hid, ct)
        return hid

    changes = []

    def record(step, structure, operation, reason, before, after, extra=None):
        c = {"step": step, "structure": structure, "operation": operation, "reason": reason, "voxels_before": before,
             "voxels_after": after, "voxels_changed": after - before,
             "volume_change_mL": round((after - before) * 0.421875 / 1000.0, 4)}
        if extra:
            c.update(extra)
        changes.append(c)
        P(f"[{step}] {structure}: {operation}: {before} -> {after} ({after - before:+d})")

    # ---- A. air-lumen HU mask ---------------------------------------------------------------------
    lumen = DEC["air_lumen_segments"]
    air_id = cseg.AddEmptySegment("helper_air", "helper_air")
    en.SetSelectedSegmentID(air_id)
    e = effect("Threshold")
    e.setParameter("MinimumThreshold", "-4000")
    e.setParameter("MaximumThreshold", str(AIR_HU - 1))       # integer HU: "< -400" == "<= -401"
    e.self().onApply()
    n_air = count("helper_air")
    assert n_air == int((ct_arr < AIR_HU).sum()), (n_air, int((ct_arr < AIR_HU).sum()))
    for nm in lumen:
        b = count(nm)
        logical(nm, "INTERSECT", "helper_air")
        record("A", nm, f"Threshold (HU < {AIR_HU}) + Logical operators INTERSECT",
               "lumen must be air: remove mucosa / collapsed-lumen / partial-volume voxels included by the model's region label",
               b, count(nm))

    # ---- B. seam larynx_air / trachea -------------------------------------------------------------
    la, tr = arr("larynx_air"), arr("trachea")
    k_tr_top = int(np.nonzero(tr.any(axis=(1, 2)))[0].max())
    k_la_bot = int(np.nonzero(la.any(axis=(1, 2)))[0].min())
    gap_layers = k_la_bot - k_tr_top - 1
    air = ct_arr < AIR_HU
    slab = np.zeros_like(air)
    k0, k1 = min(k_tr_top, k_la_bot) - 2, max(k_tr_top, k_la_bot) + 2
    slab[k0:k1 + 1] = True
    foot = ndi.binary_dilation((la | tr)[k0 - 4:k1 + 5].any(axis=0), iterations=2)       # in-plane footprint of both lumina near the seam
    cand = air & slab & foot[None, :, :] & ~la & ~tr
    lab, n = ndi.label(cand | (la & slab) | (tr & slab), structure=np.ones((3, 3, 3), bool))
    both = set(np.unique(lab[la & slab])) & set(np.unique(lab[tr & slab])) - {0}
    fill = cand & np.isin(lab, list(both))
    b = count("trachea")
    if fill.any():
        helper_from_array("helper_seam", fill)
        logical("trachea", "UNION", "helper_seam")
        cseg.RemoveSegment(sid("helper_seam"))
    record("B", "trachea", "voxel-coordinate helper segment + Logical operators UNION",
           f"seam between two models: {gap_layers} unlabeled voxel layer(s) of air between `trachea` (total) and `larynx_air` "
           "(headneck_bones_vessels); air voxels (HU < %d) lying between and connected to both were assigned to trachea" % AIR_HU,
           b, count("trachea"), {"gap_layers_before": gap_layers, "k_trachea_top": k_tr_top, "k_larynx_air_bottom": k_la_bot})
    # the pharyngo-laryngo-tracheal lumen must now be one connected body
    uni = np.zeros_like(air)
    for nm in lumen:
        uni |= arr(nm)
    lab, n = ndi.label(uni, structure=np.ones((3, 3, 3), bool))
    sizes = np.sort(np.bincount(lab.ravel())[1:])[::-1]
    P("airway union after A+B: components", n, "largest fraction", round(float(sizes[0] / uni.sum()), 5))
    airway_union = {"components": int(n), "largest_fraction": float(sizes[0] / uni.sum())}
    del la, tr, air, slab, cand, lab, uni

    # ---- B2. seam common carotid (total) / internal carotid (headneck_bones_vessels) ------------------
    occupied = np.zeros(ct_arr.shape, bool)
    for nm in KEEP:
        occupied |= arr(nm)
    R_TUBE = int(round(DEC["parameters"]["carotid_bridge_tube_radius_mm"] / 0.75))
    HU_ART = DEC["parameters"]["carotid_bridge_min_HU"]
    jj_grid, ii_grid = np.mgrid[0:ct_arr.shape[1], 0:ct_arr.shape[2]]
    for side in ("left", "right"):
        cname, iname = f"common_carotid_artery_{side}", f"internal_carotid_artery_{side}"
        cca, ica = arr(cname), arr(iname)
        k_top = int(np.nonzero(cca.any(axis=(1, 2)))[0].max())
        k_bot = int(np.nonzero(ica.any(axis=(1, 2)))[0].min())
        gap_mm = (k_bot - k_top - 1) * 0.75
        b = int(cca.sum())
        if k_bot - k_top <= 1:
            continue
        ja, ia = np.nonzero(cca[k_top])
        jb, ib = np.nonzero(ica[k_bot])
        p0, p1 = (ja.mean(), ia.mean()), (jb.mean(), ib.mean())
        cand = np.zeros(ct_arr.shape, bool)
        for k in range(k_top + 1, k_bot):
            t = (k - k_top) / float(k_bot - k_top)
            cj, ci = p0[0] + t * (p1[0] - p0[0]), p0[1] + t * (p1[1] - p0[1])
            disk = (jj_grid - cj) ** 2 + (ii_grid - ci) ** 2 <= R_TUBE ** 2
            cand[k] = (ct_arr[k] >= HU_ART) & disk & ~occupied[k]
        seed_a = np.zeros_like(cand)
        seed_a[k_top] = cca[k_top]
        seed_b = np.zeros_like(cand)
        seed_b[k_bot] = ica[k_bot]
        sl = (slice(k_top, k_bot + 1),)
        lab, n = ndi.label((cand | seed_a | seed_b)[sl], structure=np.ones((3, 3, 3), bool))
        both = (set(np.unique(lab[seed_a[sl]])) & set(np.unique(lab[seed_b[sl]]))) - {0}
        fill = np.zeros_like(cand)
        fill[sl] = cand[sl] & np.isin(lab, list(both))
        if fill.any():
            helper_from_array("helper_carotid", fill)
            logical(cname, "UNION", "helper_carotid")
            cseg.RemoveSegment(sid("helper_carotid"))
            occupied |= fill
        record("B2", cname, f"voxel-coordinate helper segment (HU >= {HU_ART} inside a {R_TUBE * 0.75:.1f} mm tube) + Logical operators UNION",
               f"seam between two models: {gap_mm:.1f} mm of clearly enhanced artery (distal common carotid and carotid bulb) lay unlabeled between "
               f"`{cname}` (total) and `{iname}` (headneck_bones_vessels). Voxels >= {HU_ART} HU that connect the two masks were assigned to the "
               "common carotid; the top 2-3 mm may already be past the bifurcation",
               b, count(cname), {"gap_mm_before": gap_mm, "k_cca_top": k_top, "k_ica_bottom": k_bot,
                                 "connected_after": bool(fill.any()), "fill_HU_mean": float(ct_arr[fill].mean()) if fill.any() else None})
    del occupied

    # ---- C. skull cut at the exhibit's upper boundary ----------------------------------------------
    k_top = int(round((S_TOP - A[2, 3]) / A[2, 2] + 0.5))          # first k whose voxel lies above the plane
    box = np.zeros(ct_arr.shape, bool)
    box[k_top:] = True
    helper_from_array("helper_above_top", box)
    for nm in DEC["cut_at_top"]:
        b = count(nm)
        logical(nm, "SUBTRACT", "helper_above_top")
        record("C", nm, f"box helper segment (S > {S_TOP} mm) + Logical operators SUBTRACT",
               "exhibit boundary: only the skull base and maxilla below the temporomandibular joints are exported (scope and privacy)",
               b, count(nm), {"plane_S_mm": S_TOP, "first_removed_k": k_top})
    cseg.RemoveSegment(sid("helper_above_top"))
    cseg.RemoveSegment(sid("helper_air"))
    del box

    # ---- D. cross-model overlaps by priority ---------------------------------------------------------
    def bbox_of(m):
        kk, jj, ii = np.nonzero(m)
        return (kk.min(), kk.max() + 1, jj.min(), jj.max() + 1, ii.min(), ii.max() + 1)

    crops = {}
    for nm in KEEP:
        m = arr(nm)
        bb = bbox_of(m)
        crops[nm] = (bb, m[bb[0]:bb[1], bb[2]:bb[3], bb[4]:bb[5]].copy())
    overlaps = []
    for a_i, hi in enumerate(KEEP):
        ba, ma = crops[hi]
        for lo in KEEP[a_i + 1:]:
            bb_, mb = crops[lo]
            o = (max(ba[0], bb_[0]), min(ba[1], bb_[1]), max(ba[2], bb_[2]), min(ba[3], bb_[3]), max(ba[4], bb_[4]), min(ba[5], bb_[5]))
            if o[0] >= o[1] or o[2] >= o[3] or o[4] >= o[5]:
                continue
            sa = ma[o[0] - ba[0]:o[1] - ba[0], o[2] - ba[2]:o[3] - ba[2], o[4] - ba[4]:o[5] - ba[4]]
            sb = mb[o[0] - bb_[0]:o[1] - bb_[0], o[2] - bb_[2]:o[3] - bb_[2], o[4] - bb_[4]:o[5] - bb_[4]]
            n = int((sa & sb).sum())
            if n:
                overlaps.append((hi, lo, n))
    P("overlapping pairs among kept segments:", len(overlaps))
    for hi, lo, n in overlaps:
        b = count(lo)
        logical(lo, "SUBTRACT", hi)
        record("D", lo, f"Logical operators SUBTRACT `{hi}`",
               f"{n} voxels claimed by two different models; `{hi}` has priority (air lumen > cartilage/bone > arteries > veins > glands > esophagus/canal > muscle)",
               b, count(lo), {"overlap_voxels": n, "kept_by": hi})
    del crops

    # ---- E. small islands -----------------------------------------------------------------------------
    for nm in KEEP:
        m = arr(nm)
        lab, n = ndi.label(m, structure=np.ones((3, 3, 3), bool))
        if n <= 1:
            continue
        sizes = np.bincount(lab.ravel())[1:]
        small = int((sizes < MIN_ISLAND).sum())
        if small == 0:
            continue
        b = int(m.sum())
        en.SetSelectedSegmentID(sid(nm))
        e = effect("Islands")
        e.setParameter("Operation", "REMOVE_SMALL_ISLANDS")
        e.setParameter("MinimumSize", str(MIN_ISLAND))
        e.self().onApply()
        record("E", nm, f"Islands REMOVE_SMALL_ISLANDS (< {MIN_ISLAND} voxels)",
               f"{small} disconnected fragment(s) smaller than {MIN_ISLAND * 0.421875:.0f} mm3 (of {n} components)", b, count(nm),
               {"components_before": int(n), "small_components": small, "small_sizes_vox": sorted(int(x) for x in sizes[sizes < MIN_ISLAND])})
    # ---- E2. fragments detached by the planar cut (step C) --------------------------------------------
    for nm in DEC.get("keep_largest_island", []):
        m = arr(nm)
        lab, n = ndi.label(m, structure=np.ones((3, 3, 3), bool))
        if n <= 1:
            continue
        sizes = np.sort(np.bincount(lab.ravel())[1:])[::-1]
        b = int(m.sum())
        en.SetSelectedSegmentID(sid(nm))
        e = effect("Islands")
        e.setParameter("Operation", "KEEP_LARGEST_ISLAND")
        e.self().onApply()
        record("E2", nm, "Islands KEEP_LARGEST_ISLAND",
               f"{n - 1} fragment(s) left floating by the planar cut at the exhibit's upper boundary", b, count(nm),
               {"components_before": int(n), "removed_sizes_vox": [int(x) for x in sizes[1:]]})
    w.setActiveEffect(None)

    # ---- verify: no overlaps remain, record, save -----------------------------------------------------
    owner = np.zeros(ct_arr.shape, np.uint8)
    dup = 0
    for i, nm in enumerate(KEEP, 1):
        m = arr(nm)
        dup += int((owner[m] > 0).sum())
        owner[m] = i
    P("voxels claimed twice after corrections:", dup)
    assert dup == 0

    names = list(KEEP)
    mid = {}
    for nm in ("spinal_cord", "trachea"):
        m = arr(nm)
        kk, jj, ii = np.nonzero(m)
        mid[nm] = float((A @ np.array([ii.mean(), jj.mean(), kk.mean(), 1.0]))[0])
    midline_R = float(np.mean(list(mid.values())))
    stats = L.segment_stats(cor, ct, ct_arr, names, P, midline_R)
    sstats = L.slicer_segment_statistics(cor, ct)
    for nm in names:
        stats[nm].update(meta[nm])
        stats[nm]["group"] = L.group_of(nm)
        if nm in sstats:
            stats[nm]["slicer_SegmentStatistics"] = sstats[nm]
    for nm in names:                                   # tags travel with the .seg.nrrd
        s = cseg.GetSegment(sid(nm))
        s.SetTag("HN.id", nm)
    L.save_json({"slicer_version": slicer.app.applicationVersion, "slicer_revision": slicer.app.repositoryRevision,
                 "parameters": DEC["parameters"], "airway_union_after_corrections": airway_union,
                 "voxels_claimed_twice_after_corrections": dup, "changes": changes}, os.path.join(OUT, "corrections.json"))
    L.save_json({"slicer_version": slicer.app.applicationVersion, "slicer_revision": slicer.app.repositoryRevision,
                 "grid": {"shape_ijk": list(ct_arr.shape[::-1]), "ijk_to_RAS_G_mm": A.tolist()},
                 "midline_R_mm": midline_R, "midline_sources": mid, "slice_view_axes": L.slice_axes_report(lm),
                 "segments": stats}, os.path.join(OUT, "stats.json"))
    slicer.util.saveNode(cor, os.path.join(SCN, "TS_corrected.seg.nrrd"))
    P("saved TS_corrected.seg.nrrd, corrections.json, stats.json", round(time.time() - t0, 1), "s")

    # ---- renders of the corrected segments --------------------------------------------------------------
    if os.environ.get("HN_NO_RENDER") != "1":
        cor.CreateClosedSurfaceRepresentation()
        ctx_names = [n for n in ("skull", "mandible", "hyoid", "vertebrae_C1", "vertebrae_C2", "vertebrae_C3", "vertebrae_C4", "vertebrae_C5",
                                 "vertebrae_C6", "vertebrae_C7", "vertebrae_T1", "vertebrae_T2", "clavicula_left", "clavicula_right", "sternum")
                     if n in names]
        for i, nm in enumerate(names):
            m = arr(nm)
            centres, cen = L.best_planes(m, A)
            size = float(max(stats[nm]["bbox_size_mm"]))
            grp = L.group_of(nm)
            pre = os.path.join(IMG, nm)
            L.render_segment(lm, cor, ct, [nm], centres, cen, min(size, 220.0), pre, L.GROUP_WL[grp], context=None, close=True)
            L.render_segment(lm, cor, ct, [nm], centres, cen, max(min(size, 220.0), 110.0), pre + "_ctx", L.GROUP_WL[grp],
                             context={n: 0.18 for n in ctx_names}, close=False)
            for tag in ("ax", "sag", "cor", "3da"):
                os.remove(pre + f"_ctx_{tag}.png")
        # group overviews: every segment of a group together
        groups = {}
        for nm in names:
            groups.setdefault(L.group_of(nm), []).append(nm)
        groups["all"] = names
        for g, members in groups.items():
            u = np.zeros(ct_arr.shape, bool)
            for nm in members:
                u |= arr(nm)
            centres, cen = L.best_planes(u, A)
            kk, jj, ii = np.nonzero(u)
            size = float(max((ii.max() - ii.min()), (jj.max() - jj.min()), (kk.max() - kk.min())) * 0.75)
            wl = L.GROUP_WL.get(g, (400, 60))
            L.render_segment(lm, cor, ct, members, centres, cen, min(size, 300.0), os.path.join(IMG, f"group_{g}"), wl, context=None, close=True)
        P("renders done", round(time.time() - t0, 1), "s")
    slicer.util.saveScene(os.path.join(SCN, "scene_corrected.mrml"))
    P("DONE", round(time.time() - t0, 1), "s")
except Exception:
    P("ERROR", traceback.format_exc())
slicer.util.exit(0)
