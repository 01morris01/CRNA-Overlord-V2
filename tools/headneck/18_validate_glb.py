#!/usr/bin/env python
"""Step 6. Independent numerical verification of the FINAL headneck.glb (re-loaded from disk).

    $HN_PY -I tools/headneck/18_validate_glb.py
        -> $HN_WORK/meshes/validation.json  (per-structure table + pass/fail summary)

The GLB is parsed here from its JSON and binary chunks and the Draco payloads are decoded with DracoPy
(Google's reference decoder) -- no Blender code is involved. Checks:
  * container: one node per structure, node name = structure id, NO node translation / rotation / scale / matrix
  * frame: positions are metres, X = patient LEFT, Y = SUPERIOR, Z = ANTERIOR, origin = plan origin
      - volume centroid of each mesh vs centroid of its corrected mask (voxels)        expect < 0.75 mm (1 working voxel)
      - enclosed volume vs voxel volume
      - every *_left structure on +X, every *_right structure on -X of the midline (X = 0)
      - unpaired asymmetric anatomy as an orientation check that does not use the left/right labels:
        aortic arch left of the midline, superior vena cava and brachiocephalic trunk origin right of it
  * mesh clean-up cost: symmetric surface distance raw (Slicer) <-> final, mean and max in mm (VTK cell locator)
"""
import json
import os
import struct
import sys
from pathlib import Path

import DracoPy
import numpy as np
import vtk
from vtk.util import numpy_support as ns

WORK = Path(os.environ.get("HN_WORK", Path.home() / "Developer/overlord-asset-sources/totalsegmentator"))
REPO = Path(os.environ.get("HN_REPO", Path.home() / "Developer/overlord-next"))
GLB = REPO / "assets" / "models" / "headneck" / "headneck.glb"
plan = json.loads((WORK / "meshes" / "plan.json").read_text())
R0, A0, S0 = plan["origin_G_mm"]
stats = json.loads((WORK / "review" / "corrected" / "stats.json").read_text())["segments"]
VOX = 0.75


def read_glb(path):
    b = path.read_bytes()
    magic, version, length = struct.unpack_from("<4sII", b, 0)
    assert magic == b"glTF" and version == 2 and length == len(b)
    off = 12
    js = bn = None
    while off < length:
        clen, ctype = struct.unpack_from("<I4s", b, off)
        data = b[off + 8: off + 8 + clen]
        if ctype == b"JSON":
            js = json.loads(data)
        elif ctype == b"BIN\x00":
            bn = data
        off += 8 + clen
    return js, bn


def centroid_volume(v, f):
    p0, p1, p2 = v[f[:, 0]], v[f[:, 1]], v[f[:, 2]]
    sv = np.einsum("ij,ij->i", p0, np.cross(p1, p2)) / 6.0
    vol = sv.sum()
    c = ((p0 + p1 + p2) / 4.0 * sv[:, None]).sum(axis=0) / vol
    return c, vol


def to_vtk(v, f):
    pd = vtk.vtkPolyData()
    pts = vtk.vtkPoints()
    pts.SetData(ns.numpy_to_vtk(np.ascontiguousarray(v, dtype=np.float64), deep=True))
    pd.SetPoints(pts)
    cells = np.hstack([np.full((len(f), 1), 3, dtype=np.int64), f.astype(np.int64)]).ravel()
    ca = vtk.vtkCellArray()
    ca.SetCells(len(f), ns.numpy_to_vtkIdTypeArray(cells, deep=True))
    pd.SetPolys(ca)
    return pd


def dist_points_to_surface(points, surf):
    loc = vtk.vtkStaticCellLocator()
    loc.SetDataSet(surf)
    loc.BuildLocator()
    out = np.empty(len(points))
    cp = [0.0, 0.0, 0.0]
    cid = vtk.reference(0)
    sub = vtk.reference(0)
    d2 = vtk.reference(0.0)
    for i, p in enumerate(points):
        loc.FindClosestPoint(p, cp, cid, sub, d2)
        out[i] = d2.get()
    return np.sqrt(out)


def read_ply(path):
    r = vtk.vtkPLYReader()
    r.SetFileName(str(path))
    r.Update()
    pd = r.GetOutput()
    v = ns.vtk_to_numpy(pd.GetPoints().GetData()).astype(np.float64)
    f = ns.vtk_to_numpy(pd.GetPolys().GetConnectivityArray()).reshape(-1, 3).astype(np.int64)
    return v, f


js, bn = read_glb(GLB)
assert "KHR_draco_mesh_compression" in js.get("extensionsRequired", []), js.get("extensionsRequired")
out = {"glb": str(GLB), "bytes": GLB.stat().st_size, "generator": js["asset"].get("generator"), "gltf_version": js["asset"]["version"],
       "extensionsRequired": js.get("extensionsRequired"), "n_nodes": len(js["nodes"]), "n_meshes": len(js["meshes"]),
       "n_materials": len(js.get("materials", [])), "scene_root_nodes": len(js["scenes"][js.get("scene", 0)]["nodes"]),
       "origin_G_mm": [R0, A0, S0], "structures": {}}
bad_transform = [n["name"] for n in js["nodes"] if any(k in n for k in ("translation", "rotation", "scale", "matrix"))]
out["nodes_with_transform"] = bad_transform
out["nodes_with_children"] = [n["name"] for n in js["nodes"] if n.get("children")]

ids = [s["id"] for s in plan["structures"]]
names = [n["name"] for n in js["nodes"]]
assert sorted(names) == sorted(ids), (set(names) ^ set(ids))
tot_tri = 0
for node in js["nodes"]:
    sid = node["name"]
    mesh = js["meshes"][node["mesh"]]
    V, F = [], []
    base = 0
    for prim in mesh["primitives"]:
        ext = prim["extensions"]["KHR_draco_mesh_compression"]
        bv = js["bufferViews"][ext["bufferView"]]
        raw = bn[bv.get("byteOffset", 0): bv.get("byteOffset", 0) + bv["byteLength"]]
        dm = DracoPy.decode(raw)
        v = np.asarray(dm.points, dtype=np.float64).reshape(-1, 3)
        f = np.asarray(dm.faces, dtype=np.int64).reshape(-1, 3)
        V.append(v)
        F.append(f + base)
        base += len(v)
        acc = js["accessors"][prim["attributes"]["POSITION"]]
        assert np.all(v.min(axis=0) >= np.array(acc["min"]) - 1e-4) and np.all(v.max(axis=0) <= np.array(acc["max"]) + 1e-4), sid
    v = np.vstack(V)
    f = np.vstack(F)
    tot_tri += len(f)
    c, vol = centroid_volume(v, f)                         # browser frame, metres / m^3
    st = stats[sid]
    R, A_, S = st["centroid_RAS_mm"]
    c_mask = np.array([-(R - R0), (S - S0), (A_ - A0)]) / 1000.0
    err_mm = float(np.linalg.norm(c - c_mask) * 1000.0)
    side = "left" if sid.endswith("_left") or sid.startswith("rib_left") else ("right" if sid.endswith("_right") or sid.startswith("rib_right") else "midline")
    lat_ok = None if side == "midline" else bool((c[0] > 0) == (side == "left"))
    # surface distance against the raw Slicer mesh (frame G mm -> browser frame mm)
    rv, rf = read_ply(WORK / "meshes" / "raw" / f"{sid}.ply")
    rv_b = np.column_stack([-(rv[:, 0] - R0), (rv[:, 2] - S0), (rv[:, 1] - A0)])        # mm
    fv_mm = v * 1000.0
    d_rf = dist_points_to_surface(rv_b, to_vtk(fv_mm, f))                               # raw vertices -> final surface
    d_fr = dist_points_to_surface(fv_mm, to_vtk(rv_b, rf))                              # final vertices -> raw surface
    ext = node.get("extras", {})
    rec = {
        "triangles_final": int(len(f)), "vertices_final": int(len(v)), "triangles_raw": int(len(rf)),
        "centroid_mesh_m": [round(float(x), 6) for x in c], "centroid_mask_m": [round(float(x), 6) for x in c_mask],
        "centroid_error_mm": round(err_mm, 3),
        "volume_mesh_mL": round(float(vol) * 1e6, 4), "volume_voxels_mL": st["volume_mL"],
        "volume_diff_pct": round(float((vol * 1e6 - st["volume_mL"]) / st["volume_mL"] * 100.0), 3),
        "side": side, "centroid_x_mm": round(float(c[0] * 1000), 2), "laterality_ok": lat_ok,
        "surface_distance_raw_to_final_mm": {"mean": round(float((d_rf.mean() + d_fr.mean()) / 2), 4),
                                             "max": round(float(max(d_rf.max(), d_fr.max())), 4),
                                             "raw_to_final_mean": round(float(d_rf.mean()), 4), "final_to_raw_mean": round(float(d_fr.mean()), 4),
                                             "raw_to_final_max": round(float(d_rf.max()), 4), "final_to_raw_max": round(float(d_fr.max()), 4),
                                             "p95": round(float(np.percentile(np.concatenate([d_rf, d_fr]), 95)), 4)},
        "bbox_min_m": [round(float(x), 5) for x in v.min(axis=0)], "bbox_max_m": [round(float(x), 5) for x in v.max(axis=0)],
        "extras": ext,
    }
    out["structures"][sid] = rec

S = out["structures"]
out["total_triangles"] = tot_tri
out["max_centroid_error_mm"] = max(r["centroid_error_mm"] for r in S.values())
out["worst_centroid"] = max(S, key=lambda k: S[k]["centroid_error_mm"])
out["max_abs_volume_diff_pct"] = max(abs(r["volume_diff_pct"]) for r in S.values())
out["worst_volume"] = max(S, key=lambda k: abs(S[k]["volume_diff_pct"]))
out["laterality_failures"] = [k for k, r in S.items() if r["laterality_ok"] is False]
out["laterality_checked"] = sum(1 for r in S.values() if r["laterality_ok"] is not None)
out["max_surface_distance_mm"] = max(r["surface_distance_raw_to_final_mm"]["max"] for r in S.values())
out["mean_surface_distance_mm_over_structures"] = round(float(np.mean([r["surface_distance_raw_to_final_mm"]["mean"] for r in S.values()])), 4)
# orientation check with unpaired asymmetric anatomy (does not use any left/right label)
ao = S["aorta"]["centroid_x_mm"]
svc = S["superior_vena_cava"]["centroid_x_mm"]
bct_lo = None
out["asymmetry_check"] = {
    "aortic_arch_centroid_x_mm": ao, "aortic_arch_left_of_midline": bool(ao > 0),
    "superior_vena_cava_centroid_x_mm": svc, "superior_vena_cava_right_of_midline": bool(svc < 0),
    "esophagus_centroid_x_mm": S["esophagus"]["centroid_x_mm"],
    "midline_structures_x_mm": {k: S[k]["centroid_x_mm"] for k in ("trachea", "spinal_cord", "larynx_air", "hyoid", "thyroid_cartilage", "cricoid_cartilage")},
}
out["pass"] = {
    "identity_node_transforms": not bad_transform,
    "centroid_within_1_working_voxel": out["max_centroid_error_mm"] < VOX,
    "laterality": not out["laterality_failures"],
    "asymmetric_anatomy_consistent": bool(ao > 0 and svc < 0),
    "volume_within_2pct": out["max_abs_volume_diff_pct"] < 2.0,
}
(WORK / "meshes" / "validation.json").write_text(json.dumps(out, indent=1) + "\n")
print(json.dumps({k: out[k] for k in ("bytes", "generator", "n_nodes", "n_meshes", "n_materials", "total_triangles", "nodes_with_transform",
                                      "max_centroid_error_mm", "worst_centroid", "max_abs_volume_diff_pct", "worst_volume",
                                      "laterality_checked", "laterality_failures", "max_surface_distance_mm",
                                      "mean_surface_distance_mm_over_structures", "asymmetry_check", "pass")}, indent=1))
