"""Step 5b. Mesh clean-up and GLB export in Blender (headless).

    "$HN_BLENDER" -b --factory-startup --python tools/headneck/17_blender_optimize.py -- \
        --plan $HN_WORK/meshes/plan.json --raw $HN_WORK/meshes/raw --out <repo>/assets/models/headneck/headneck.glb \
        --report $HN_WORK/meshes/blender_report.json [--keep-blend $HN_WORK/meshes/headneck_final.blend]

plan.json (written by 16_mesh_plan.py):
  {"origin_G_mm": [R0, A0, S0],
   "structures": [{"id", "display_name", "group", "side", "target_triangles", "smooth_iterations"}, ...]}

Per structure (raw mesh = Slicer closed surface, RAS millimetres in the patient frame G):
  1. coordinates -> Blender scene metres:  (x, y, z) = (-(R-R0), -(A-A0), (S-S0)) / 1000   [Blender is Z-up]
     The glTF exporter's +Y-up conversion (x, y, z) -> (x, z, -y) then yields the BROWSER FRAME
        X = -(R-R0)/1000 (patient LEFT),  Y = (S-S0)/1000 (SUPERIOR),  Z = (A-A0)/1000 (ANTERIOR).
     Both maps are proper rotations (det = +1), so triangle winding is preserved and nodes stay identity.
  2. weld coincident vertices, delete loose vertices/edges and degenerate faces
  3. drop tiny disconnected shells (< 0.5 % of the structure's enclosed volume, incl. inverted inner shells)
  4. Taubin lambda|mu smoothing (non-shrinking low-pass; removes the voxel staircase)
  5. decimate (edge collapse) to the triangle budget
  6. recompute outward normals, smooth shading
Exports ONE Draco-compressed GLB with one node per structure (node name = structure id, identity transform,
extras = id / display name / group / side).
"""
import argparse
import json
import math
import sys
import time

import bmesh
import bpy
import numpy as np

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
ap = argparse.ArgumentParser()
ap.add_argument("--plan", required=True)
ap.add_argument("--raw", required=True)
ap.add_argument("--out", required=True)
ap.add_argument("--report", required=True)
ap.add_argument("--keep-blend")
ap.add_argument("--no-draco", action="store_true")
a = ap.parse_args(argv)

plan = json.load(open(a.plan))
R0, A0, S0 = plan["origin_G_mm"]

GROUP_COLORS = {  # base colour RGBA, roughness
    "airway": ((0.55, 0.80, 0.95, 1.0), 0.55), "cartilage": ((0.72, 0.82, 0.86, 1.0), 0.55),
    "bone": ((0.90, 0.86, 0.74, 1.0), 0.65), "artery": ((0.80, 0.16, 0.14, 1.0), 0.45),
    "vein": ((0.20, 0.32, 0.72, 1.0), 0.45), "muscle": ((0.62, 0.28, 0.24, 1.0), 0.70),
    "gland": ((0.82, 0.62, 0.42, 1.0), 0.60), "other": ((0.80, 0.74, 0.62, 1.0), 0.60),
}


def material_for(group, sid):
    key = group
    if group == "vessel":
        key = "vein" if ("vein" in sid or "vena" in sid) else "artery"
    name = f"hn_{key}"
    m = bpy.data.materials.get(name)
    if m is None:
        m = bpy.data.materials.new(name)
        m.use_nodes = True
        bsdf = m.node_tree.nodes.get("Principled BSDF")
        col, rough = GROUP_COLORS.get(key, GROUP_COLORS["other"])
        bsdf.inputs["Base Color"].default_value = col
        bsdf.inputs["Roughness"].default_value = rough
        bsdf.inputs["Metallic"].default_value = 0.0
    return m


def signed_volume(v, f):
    p0, p1, p2 = v[f[:, 0]], v[f[:, 1]], v[f[:, 2]]
    return float(np.einsum("ij,ij->i", p0, np.cross(p1, p2)).sum() / 6.0)


def mesh_arrays(me):
    me.calc_loop_triangles()
    v = np.empty(len(me.vertices) * 3, dtype=np.float64)
    me.vertices.foreach_get("co", v)
    v = v.reshape(-1, 3)
    f = np.empty(len(me.loop_triangles) * 3, dtype=np.int64)
    me.loop_triangles.foreach_get("vertices", f)
    return v, f.reshape(-1, 3)


def taubin(me, iterations, lam=0.5, mu=-0.53):
    """Taubin lambda|mu smoothing with uniform (umbrella) weights; boundary-free closed meshes."""
    n = len(me.vertices)
    v = np.empty(n * 3, dtype=np.float64)
    me.vertices.foreach_get("co", v)
    v = v.reshape(-1, 3)
    e = np.empty(len(me.edges) * 2, dtype=np.int64)
    me.edges.foreach_get("vertices", e)
    e = e.reshape(-1, 2)
    i = np.concatenate([e[:, 0], e[:, 1]])
    j = np.concatenate([e[:, 1], e[:, 0]])
    deg = np.bincount(i, minlength=n).astype(np.float64)
    deg[deg == 0] = 1.0

    def lap(x):
        out = np.empty_like(x)
        for c in range(3):
            out[:, c] = np.bincount(i, weights=x[j, c], minlength=n) / deg - x[:, c]
        return out
    for _ in range(iterations):
        v = v + lam * lap(v)
        v = v + mu * lap(v)
    me.vertices.foreach_set("co", v.ravel())
    me.update()


def clean_shells(obj, min_frac=0.005):
    """Delete disconnected shells whose |enclosed volume| is below min_frac of the total (and inverted shells)."""
    me = obj.data
    v, f = mesh_arrays(me)
    n = len(v)
    # union-find over triangles' vertices
    parent = np.arange(n)

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    # iterative label propagation via edges (vectorised)
    e = np.empty(len(me.edges) * 2, dtype=np.int64)
    me.edges.foreach_get("vertices", e)
    e = e.reshape(-1, 2)
    lab = np.arange(n)
    while True:
        m = np.minimum(lab[e[:, 0]], lab[e[:, 1]])
        new = lab.copy()
        np.minimum.at(new, e[:, 0], m)
        np.minimum.at(new, e[:, 1], m)
        new = new[new]                       # pointer jumping
        if np.array_equal(new, lab):
            break
        lab = new
    fl = lab[f[:, 0]]
    comps = np.unique(fl)
    if len(comps) == 1:
        return {"shells": 1, "removed_shells": 0, "removed_volume_frac": 0.0}
    p0, p1, p2 = v[f[:, 0]], v[f[:, 1]], v[f[:, 2]]
    tv = np.einsum("ij,ij->i", p0, np.cross(p1, p2)) / 6.0
    idx = np.searchsorted(comps, fl)
    vol = np.bincount(idx, weights=tv, minlength=len(comps))
    total = vol[vol > 0].sum()
    kill = (vol < min_frac * total)          # tiny shells and negative (inner cavity) shells
    removed_frac = float(np.abs(vol[kill]).sum() / max(total, 1e-30))
    kill_labels = set(comps[kill].tolist())
    if not kill_labels:
        return {"shells": int(len(comps)), "removed_shells": 0, "removed_volume_frac": 0.0}
    vkill = np.isin(lab, list(kill_labels))
    bm = bmesh.new()
    bm.from_mesh(me)
    bm.verts.ensure_lookup_table()
    bmesh.ops.delete(bm, geom=[bm.verts[i] for i in np.nonzero(vkill)[0]], context="VERTS")
    bm.to_mesh(me)
    bm.free()
    me.update()
    return {"shells": int(len(comps)), "removed_shells": int(kill.sum()), "removed_volume_frac": removed_frac}


bpy.ops.wm.read_factory_settings(use_empty=True)
report = {"blender_version": bpy.app.version_string, "origin_G_mm": [R0, A0, S0], "structures": {}}
t_all = time.time()
for s in plan["structures"]:
    sid = s["id"]
    t0 = time.time()
    before = set(bpy.data.objects)
    bpy.ops.wm.ply_import(filepath=f"{a.raw}/{sid}.ply")
    obj = next(o for o in bpy.data.objects if o not in before)
    obj.name = sid
    me = obj.data
    me.name = sid
    # 1. frame change (vertex data, object transform stays identity)
    n = len(me.vertices)
    co = np.empty(n * 3, dtype=np.float64)
    me.vertices.foreach_get("co", co)
    co = co.reshape(-1, 3)
    co = np.column_stack([-(co[:, 0] - R0), -(co[:, 1] - A0), (co[:, 2] - S0)]) / 1000.0
    me.vertices.foreach_set("co", co.ravel())
    me.update()
    obj.matrix_world.identity()
    v, f = mesh_arrays(me)
    rec = {"raw_vertices": int(len(v)), "raw_triangles": int(len(f)), "raw_volume_mL": signed_volume(v, f) * 1e6}

    # 2. weld + loose geometry
    bm = bmesh.new()
    bm.from_mesh(me)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-7)
    loose_v = [vv for vv in bm.verts if not vv.link_faces]
    rec["loose_vertices_removed"] = len(loose_v)
    if loose_v:
        bmesh.ops.delete(bm, geom=loose_v, context="VERTS")
    bmesh.ops.dissolve_degenerate(bm, edges=bm.edges, dist=1e-9)
    bmesh.ops.triangulate(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    me.update()
    rec["welded_vertices"] = int(len(me.vertices))

    # 3. tiny / inverted shells
    rec.update(clean_shells(obj))

    # 4. smoothing
    it = int(s.get("smooth_iterations", 12))
    taubin(me, it)
    rec["taubin_iterations"] = it

    # 5. decimation
    me.calc_loop_triangles()
    ntri = len(me.loop_triangles)
    target = int(s["target_triangles"])
    if ntri > target:
        mod = obj.modifiers.new("decimate", "DECIMATE")
        mod.decimate_type = "COLLAPSE"
        mod.ratio = target / ntri
        mod.use_collapse_triangulate = True
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=mod.name)
        me = obj.data
    # 6. normals / shading
    bm = bmesh.new()
    bm.from_mesh(me)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    me.update()
    v, f = mesh_arrays(me)
    vol = signed_volume(v, f)
    if vol < 0:                                # keep outward orientation
        bm = bmesh.new(); bm.from_mesh(me); bmesh.ops.reverse_faces(bm, faces=bm.faces); bm.to_mesh(me); bm.free(); me.update()
        v, f = mesh_arrays(me)
        vol = signed_volume(v, f)
    rec.update({"final_vertices": int(len(v)), "final_triangles": int(len(f)), "final_volume_mL": vol * 1e6,
                "target_triangles": target, "seconds": round(time.time() - t0, 2)})
    me.materials.clear()
    me.materials.append(material_for(s["group"], sid))
    obj["id"] = sid
    obj["display_name"] = s["display_name"]
    obj["group"] = s["group"]
    obj["side"] = s["side"]
    report["structures"][sid] = rec
    print(f"{sid:36} raw {rec['raw_triangles']:8d} -> {rec['final_triangles']:7d} tris  vol {rec['raw_volume_mL']:8.3f} -> {rec['final_volume_mL']:8.3f} mL  {rec['seconds']} s", flush=True)

report["total_final_triangles"] = sum(r["final_triangles"] for r in report["structures"].values())
report["total_raw_triangles"] = sum(r["raw_triangles"] for r in report["structures"].values())

for o in bpy.data.objects:
    o.select_set(True)
if a.keep_blend:
    bpy.ops.wm.save_as_mainfile(filepath=a.keep_blend)
kw = dict(filepath=a.out, export_format="GLB", use_selection=False, export_apply=True, export_yup=True,
          export_normals=True, export_texcoords=False, export_materials="EXPORT", export_extras=True,
          export_cameras=False, export_lights=False, export_animations=False, export_skins=False, export_morph=False)
if not a.no_draco:
    kw.update(export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=7,
              export_draco_position_quantization=14, export_draco_normal_quantization=10, export_draco_generic_quantization=12)
bpy.ops.export_scene.gltf(**kw)
report["export"] = {k: v for k, v in kw.items() if k != "filepath"}
report["seconds_total"] = round(time.time() - t_all, 1)
json.dump(report, open(a.report, "w"), indent=1)
print("TOTAL triangles", report["total_raw_triangles"], "->", report["total_final_triangles"], "in", report["seconds_total"], "s")
