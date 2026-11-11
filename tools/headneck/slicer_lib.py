"""Shared helpers for the 3D Slicer scripts of the head-and-neck pipeline (12_*, 14_*, 15_*).

Runs INSIDE 3D Slicer's Python (slicer, vtk, qt, numpy, scipy, SimpleITK are Slicer's own).
"""
import json
import os
import time

import numpy as np
import qt
import slicer
import vtk
from scipy import ndimage as ndi

WORK = os.environ.get("HN_WORK", os.path.expanduser("~/Developer/overlord-asset-sources/totalsegmentator"))
SUBJ = os.path.join(WORK, "data", "s0527")
MASKS = os.path.join(WORK, "masks")
TASKS = ["total", "headneck_bones_vessels", "headneck_muscles", "head_glands_cavities", "head_muscles", "craniofacial_structures"]

# display groups: window/level used for the slice overlays, and base colour
GROUP_WL = {  # (window, level)
    "airway": (1600, -450), "cartilage": (700, 150), "bone": (1800, 400), "vessel": (700, 180),
    "muscle": (400, 60), "gland": (400, 80), "other": (400, 60),
}


def group_of(name):
    """Display group of a segment (TotalSegmentator class name, optionally with a '__<task>' suffix)."""
    import catalog
    return catalog.group(name.split("__")[0])


def log_open(path):
    f = open(path, "a")

    def P(*a):
        s = " ".join(str(x) for x in a)
        print(s)
        f.write(s + "\n")
        f.flush()
    return P


def setup_window(width=1500, height=1100):
    mw = slicer.util.mainWindow()
    mw.resize(width, height)
    mw.move(20, 40)
    for fn in (lambda: slicer.util.setPythonConsoleVisible(False), lambda: slicer.util.setDataProbeVisible(False),
               lambda: slicer.util.setModuleHelpSectionVisible(False), lambda: slicer.util.setStatusBarVisible(False),
               lambda: slicer.util.setToolbarsVisible(False), lambda: slicer.util.setModulePanelTitleVisible(False)):
        try:
            fn()
        except Exception:
            pass
    try:   # hide the module panel so the views get the room
        mw.findChild("QDockWidget", "PanelDockWidget").hide()
    except Exception:
        pass
    lm = slicer.app.layoutManager()
    lm.setLayout(slicer.vtkMRMLLayoutNode.SlicerLayoutFourUpView)
    slicer.app.processEvents()
    return lm


def load_cts():
    ct = slicer.util.loadVolume(os.path.join(SUBJ, "ct_075.nii.gz"), properties={"name": "CT_075"})
    ctn = slicer.util.loadVolume(os.path.join(SUBJ, "ct_native_G.nii.gz"), properties={"name": "CT_native_1p5"})
    ct.GetDisplayNode().SetAutoWindowLevel(False)
    ct.GetDisplayNode().SetInterpolate(1)
    slicer.util.setSliceViewerLayers(background=ct, fit=True)
    return ct, ctn


def ijk_to_ras(vol):
    m = vtk.vtkMatrix4x4()
    vol.GetIJKToRASMatrix(m)
    return np.array([[m.GetElement(i, j) for j in range(4)] for i in range(4)])


PALETTE = [(0.90, 0.75, 0.25), (0.25, 0.70, 0.95), (0.95, 0.40, 0.35), (0.40, 0.85, 0.45), (0.80, 0.45, 0.90), (0.95, 0.60, 0.20),
           (0.35, 0.50, 0.95), (0.60, 0.90, 0.85), (0.95, 0.85, 0.55), (0.75, 0.75, 0.75), (0.55, 0.35, 0.25), (0.95, 0.55, 0.75)]


def import_task_labelmaps(segNode, ct, P):
    """Import masks/<task>_ml.nii.gz for every task; segments are named by TotalSegmentator class name.

    A class name already used by an earlier task gets '__<task>' appended (e.g. skull__craniofacial_structures).
    Returns {segmentId: {"name", "task", "label"}}.
    """
    labels = json.load(open(os.path.join(MASKS, "labels.json")))["tasks"]
    seg = segNode.GetSegmentation()
    info, used = {}, set()
    M = vtk.vtkMatrix4x4()
    ct.GetIJKToRASMatrix(M)
    for task in TASKS:
        lab = {int(k): v for k, v in labels[task]["labels"].items()}
        if not lab:
            continue
        lm = slicer.util.loadLabelVolume(os.path.join(MASKS, f"{task}_ml.nii.gz"), properties={"name": f"lm_{task}"})
        ctab = slicer.mrmlScene.AddNewNodeByClass("vtkMRMLColorTableNode", f"colors_{task}")
        ctab.SetTypeToUser()
        ctab.SetNumberOfColors(max(lab) + 1)
        ctab.SetColor(0, "background", 0, 0, 0, 0)
        names = {}
        for v in range(1, max(lab) + 1):
            if v in lab:
                nm = lab[v] if lab[v] not in used else f"{lab[v]}__{task}"
                used.add(nm)
                names[v] = nm
                r, g, b = PALETTE[v % len(PALETTE)]
                ctab.SetColor(v, nm, r, g, b, 1.0)
            else:
                ctab.SetColor(v, f"unused_{task}_{v}", 0, 0, 0, 0)
        lm.GetDisplayNode().SetAndObserveColorNodeID(ctab.GetID())
        before = {seg.GetNthSegmentID(i) for i in range(seg.GetNumberOfSegments())}
        ok = slicer.modules.segmentations.logic().ImportLabelmapToSegmentationNode(lm, segNode)
        assert ok, task
        new = [seg.GetNthSegmentID(i) for i in range(seg.GetNumberOfSegments()) if seg.GetNthSegmentID(i) not in before]
        got = {seg.GetSegment(s).GetName(): s for s in new}
        for v, nm in names.items():
            assert nm in got, (task, nm, sorted(got))
            s = got[nm]
            seg.GetSegment(s).SetTag("TS.task", task)
            seg.GetSegment(s).SetTag("TS.label", str(v))
            seg.GetSegment(s).SetTag("TS.class", lab[v])
            info[s] = {"name": nm, "task": task, "label": v, "class": lab[v]}
        slicer.mrmlScene.RemoveNode(lm)
        slicer.mrmlScene.RemoveNode(ctab)
        P(f"imported {task}: {len(names)} segments")
    return info


def seg_array(segNode, sid, ct):
    """Binary numpy array (k, j, i) of one segment on the CT grid."""
    return slicer.util.arrayFromSegmentBinaryLabelmap(segNode, sid, ct) > 0


def segment_stats(segNode, ct, ct_arr, names, P, midline_R=None):
    """Quantitative checks per segment. ct_arr is the CT as numpy (k, j, i). Returns {name: {...}}."""
    A = ijk_to_ras(ct)
    vox_mm3 = abs(np.linalg.det(A[:3, :3]))
    seg = segNode.GetSegmentation()
    out = {}
    nk, nj, ni = ct_arr.shape
    struct26 = np.ones((3, 3, 3), bool)
    for nm in names:
        sid = seg.GetSegmentIdBySegmentName(nm)
        m = seg_array(segNode, sid, ct)
        n = int(m.sum())
        rec = {"voxels": n, "volume_mL": round(n * vox_mm3 / 1000.0, 4)}
        if n == 0:
            out[nm] = rec
            continue
        kk, jj, ii = np.nonzero(m)
        k0, k1, j0, j1, i0, i1 = kk.min(), kk.max(), jj.min(), jj.max(), ii.min(), ii.max()
        cen_ijk = np.array([ii.mean(), jj.mean(), kk.mean(), 1.0])
        cen = (A @ cen_ijk)[:3]
        lo = (A @ np.array([i0 - 0.5, j0 - 0.5, k0 - 0.5, 1]))[:3]
        hi = (A @ np.array([i1 + 0.5, j1 + 0.5, k1 + 0.5, 1]))[:3]
        rec["centroid_RAS_mm"] = [round(float(x), 3) for x in cen]
        rec["bbox_RAS_min_mm"] = [round(float(min(a, b)), 2) for a, b in zip(lo, hi)]
        rec["bbox_RAS_max_mm"] = [round(float(max(a, b)), 2) for a, b in zip(lo, hi)]
        rec["bbox_size_mm"] = [round(float(abs(b - a)), 2) for a, b in zip(lo, hi)]
        sub = m[k0:k1 + 1, j0:j1 + 1, i0:i1 + 1]
        lab, ncomp = ndi.label(sub, structure=struct26)
        sizes = np.sort(np.bincount(lab.ravel())[1:])[::-1]
        rec["components_26"] = int(ncomp)
        rec["largest_component_fraction"] = round(float(sizes[0] / n), 5)
        rec["component_sizes_top5_vox"] = [int(x) for x in sizes[:5]]
        hu = ct_arr[m].astype(np.float32)
        rec["HU_mean"] = round(float(hu.mean()), 1)
        rec["HU_sd"] = round(float(hu.std()), 1)
        p5, p50, p95 = np.percentile(hu, [5, 50, 95])
        rec["HU_p05"], rec["HU_median"], rec["HU_p95"] = round(float(p5), 1), round(float(p50), 1), round(float(p95), 1)
        rec["frac_HU_lt_-300"] = round(float((hu < -300).mean()), 4)
        rec["frac_HU_gt_150"] = round(float((hu > 150).mean()), 4)
        # contact with the volume faces (field-of-view truncation): voxels lying in the outermost voxel layer
        faces = {"R_min(i=0)": int(m[:, :, 0].sum()), "R_max": int(m[:, :, ni - 1].sum()), "A_min(j=0)": int(m[:, 0, :].sum()),
                 "A_max": int(m[:, nj - 1, :].sum()), "S_min(k=0)": int(m[0].sum()), "S_max": int(m[nk - 1].sum())}
        rec["border_contact_voxels"] = {k: v for k, v in faces.items() if v > 0}
        if midline_R is not None:
            rec["centroid_minus_midline_R_mm"] = round(float(cen[0] - midline_R), 2)
            rec["centroid_side"] = "right" if cen[0] > midline_R else "left"
        out[nm] = rec
    return out


def slicer_segment_statistics(segNode, ct):
    """Slicer's own Segment Statistics module (volume, centroid, HU) keyed by segment name."""
    import SegmentStatistics
    lg = SegmentStatistics.SegmentStatisticsLogic()
    pn = lg.getParameterNode()
    pn.SetParameter("Segmentation", segNode.GetID())
    pn.SetParameter("ScalarVolume", ct.GetID())
    for k in ("LabelmapSegmentStatisticsPlugin.centroid_ras.enabled", "ScalarVolumeSegmentStatisticsPlugin.median.enabled",
              "ScalarVolumeSegmentStatisticsPlugin.stdev.enabled"):
        pn.SetParameter(k, "True")
    pn.SetParameter("ClosedSurfaceSegmentStatisticsPlugin.enabled", "False")
    lg.computeStatistics()
    st = lg.getStatistics()
    out = {}
    for sid in st["SegmentIDs"]:
        nm = st[(sid, "Segment")]
        out[nm] = {
            "voxel_count": st.get((sid, "LabelmapSegmentStatisticsPlugin.voxel_count")),
            "volume_cm3": st.get((sid, "LabelmapSegmentStatisticsPlugin.volume_cm3")),
            "centroid_ras": st.get((sid, "LabelmapSegmentStatisticsPlugin.centroid_ras")),
            "hu_mean": st.get((sid, "ScalarVolumeSegmentStatisticsPlugin.mean")),
            "hu_stdev": st.get((sid, "ScalarVolumeSegmentStatisticsPlugin.stdev")),
            "hu_median": st.get((sid, "ScalarVolumeSegmentStatisticsPlugin.median")),
        }
    return out


# ------------------------------------------------------------------------------------------------ rendering
def _capture(view, path):
    slicer.app.processEvents()
    view.forceRender() if hasattr(view, "forceRender") else None
    slicer.app.processEvents()
    import ScreenCapture
    ScreenCapture.ScreenCaptureLogic().captureImageFromView(view, path)


def slice_axes_report(lm):
    """Which patient direction is screen-right / screen-up in each slice view (from SliceToRAS)."""
    rep = {}
    names = {(1, 0, 0): "R", (-1, 0, 0): "L", (0, 1, 0): "A", (0, -1, 0): "P", (0, 0, 1): "S", (0, 0, -1): "I"}
    for vn in ("Red", "Yellow", "Green"):
        sn = lm.sliceWidget(vn).mrmlSliceNode()
        m = sn.GetSliceToRAS()
        xr = tuple(int(round(m.GetElement(i, 0))) for i in range(3))
        yu = tuple(int(round(m.GetElement(i, 1))) for i in range(3))
        rep[vn] = {"orientation": sn.GetOrientation(), "screen_right_is": names.get(xr, str(xr)), "screen_up_is": names.get(yu, str(yu))}
    return rep


def best_planes(m, A):
    """Per-view centres for a binary mask m (k, j, i): the axial / sagittal / coronal slice with the largest
    cross-section, centred on the mask's centroid inside that slice. Returns ({'ax','sag','cor'}: RAS, centroid RAS)."""
    kk, jj, ii = np.nonzero(m)
    cen = (A @ np.array([ii.mean(), jj.mean(), kk.mean(), 1.0]))[:3]
    out = {}
    for tag, axis in (("ax", 0), ("cor", 1), ("sag", 2)):
        area = m.sum(axis=tuple(a for a in (0, 1, 2) if a != axis))
        idx = int(np.argmax(area))
        sl = np.take(m, idx, axis=axis)
        a, b = np.nonzero(sl)
        if axis == 0:
            ijk = (b.mean(), a.mean(), idx)
        elif axis == 1:
            ijk = (b.mean(), idx, a.mean())
        else:
            ijk = (idx, b.mean(), a.mean())
        out[tag] = tuple(float(x) for x in (A @ np.array([*ijk, 1.0]))[:3])
    return out, tuple(float(x) for x in cen)


def render_segment(lm, segNode, ct, names_visible, centres, centre3d, size_mm, out_prefix, wl, context=None, close=True):
    """Slice overlays (axial, sagittal, coronal) and two 3D views.

    names_visible: segment names shown (2D outline + light fill, 3D opaque)
    centres: {'ax': RAS, 'sag': RAS, 'cor': RAS} point each slice view is centred on
    context: optional {name: opacity} extra segments shown translucent in 3D only
    """
    seg = segNode.GetSegmentation()
    dn = segNode.GetDisplayNode()
    dn.SetAllSegmentsVisibility(False)
    for nm in names_visible:
        sid = seg.GetSegmentIdBySegmentName(nm)
        dn.SetSegmentVisibility(sid, True)
        dn.SetSegmentOpacity3D(sid, 1.0)
        dn.SetSegmentVisibility2DFill(sid, True)
        dn.SetSegmentVisibility2DOutline(sid, True)
    dn.SetOpacity2DFill(0.18)
    dn.SetOpacity2DOutline(1.0)
    dn.SetSliceIntersectionThickness(2)
    ct.GetDisplayNode().SetWindowLevel(*wl)
    fov = float(max(size_mm * 1.9, 60.0))
    for vn, tag in (("Red", "ax"), ("Yellow", "sag"), ("Green", "cor")):
        sw = lm.sliceWidget(vn)
        sn = sw.mrmlSliceNode()
        dims = sn.GetDimensions()
        sn.SetFieldOfView(fov * dims[0] / max(dims[1], 1), fov, sn.GetFieldOfView()[2])
        sn.JumpSliceByCentering(*centres[tag])
        _capture(sw.sliceView(), f"{out_prefix}_{tag}.png")
    # 3D
    if context:
        for nm, op in context.items():
            sid = seg.GetSegmentIdBySegmentName(nm)
            if sid and nm not in names_visible:
                dn.SetSegmentVisibility(sid, True)
                dn.SetSegmentVisibility2DFill(sid, False)
                dn.SetSegmentVisibility2DOutline(sid, False)
                dn.SetSegmentOpacity3D(sid, op)
    tw = lm.threeDWidget(0)
    tv = tw.threeDView()
    vnode = tv.mrmlViewNode()
    vnode.SetBackgroundColor(0.05, 0.05, 0.07)
    vnode.SetBackgroundColor2(0.05, 0.05, 0.07)
    vnode.SetBoxVisible(False)
    vnode.SetAxisLabelsVisible(False)
    vnode.SetRenderMode(slicer.vtkMRMLViewNode.Orthographic)
    cam = slicer.modules.cameras.logic().GetViewActiveCameraNode(vnode).GetCamera()
    half = float(max(size_mm * (0.75 if close else 1.1), 25.0))
    c = centre3d
    for tag, d in (("3da", (0, 1, 0)), ("3dl", (-0.94, 0.34, 0.0))):   # from anterior ; from the patient's left, slightly anterior
        cam.SetFocalPoint(*c)
        cam.SetPosition(c[0] + 600 * d[0], c[1] + 600 * d[1], c[2] + 600 * d[2])
        cam.SetViewUp(0, 0, 1)
        cam.ParallelProjectionOn()
        cam.SetParallelScale(half)
        tv.renderWindow().GetRenderers().GetFirstRenderer().ResetCameraClippingRange()
        _capture(tv, f"{out_prefix}_{tag}.png")


def save_json(obj, path):
    with open(path, "w") as f:
        json.dump(obj, f, indent=1)
        f.write("\n")
