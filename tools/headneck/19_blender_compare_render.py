"""Step 9. Before/after renders of the mesh clean-up (Blender, headless, Workbench engine).

    "$HN_BLENDER" -b --factory-startup --python tools/headneck/19_blender_compare_render.py -- \
        --plan $HN_WORK/meshes/plan.json --raw $HN_WORK/meshes/raw --glb <repo>/assets/models/headneck/headneck.glb \
        --out $HN_WORK/review/mesh_compare --ids thyroid_cartilage hyoid larynx_air trachea common_carotid_artery_left anterior_scalene_left

Per structure three panels with one fixed orthographic camera:
  raw.png    Slicer closed surface of the 0.75 mm mask (no smoothing, no decimation), flat shaded
  final.png  the mesh as shipped: decoded from the final Draco GLB, smooth shaded
  wire.png   the shipped mesh with its triangle edges
plus overview renders of the whole GLB (anterior, left-lateral, posterior).
"""
import argparse
import json
import math
import os
import sys

import bpy
import numpy as np
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
ap = argparse.ArgumentParser()
ap.add_argument("--plan", required=True)
ap.add_argument("--raw", required=True)
ap.add_argument("--glb", required=True)
ap.add_argument("--out", required=True)
ap.add_argument("--ids", nargs="+", required=True)
ap.add_argument("--size", type=int, default=520)
a = ap.parse_args(argv)
os.makedirs(a.out, exist_ok=True)
plan = json.load(open(a.plan))
R0, A0, S0 = plan["origin_G_mm"]

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = "BLENDER_WORKBENCH"
scene.render.resolution_x = scene.render.resolution_y = a.size
scene.render.film_transparent = False
scene.render.image_settings.file_format = "PNG"
sh = scene.display.shading
sh.light = "STUDIO"
sh.color_type = "MATERIAL"
sh.show_cavity = True
sh.cavity_type = "BOTH"
sh.show_shadows = False
sh.show_specular_highlight = True
scene.world = bpy.data.worlds.new("w")
scene.world.color = (0.03, 0.03, 0.04)
scene.display.render_aa = "8"

cam_data = bpy.data.cameras.new("cam")
cam_data.type = "ORTHO"
cam = bpy.data.objects.new("cam", cam_data)
scene.collection.objects.link(cam)
scene.camera = cam


def mat(name, rgba):
    m = bpy.data.materials.new(name)
    m.diffuse_color = rgba
    m.roughness = 0.55
    return m


M_RAW = mat("raw", (0.85, 0.78, 0.62, 1))
M_FIN = mat("fin", (0.62, 0.80, 0.90, 1))
M_WIRE = mat("wire", (0.02, 0.02, 0.02, 1))


def frame(objs, direction, margin=1.12):
    pts = []
    for o in objs:                      # bounds from the vertex data itself (bound_box is stale after foreach_set)
        co = np.empty(len(o.data.vertices) * 3)
        o.data.vertices.foreach_get("co", co)
        co = co.reshape(-1, 3)
        lo, hi = co.min(axis=0), co.max(axis=0)
        pts += [(x, y, z) for x in (lo[0], hi[0]) for y in (lo[1], hi[1]) for z in (lo[2], hi[2])]
    pts = np.array(pts)
    c = (pts.min(axis=0) + pts.max(axis=0)) / 2
    d = Vector(direction).normalized()
    cam.location = Vector(c) + d * 2.0
    cam.rotation_euler = (-d).to_track_quat("-Z", "Y").to_euler()
    bpy.context.view_layer.update()
    inv = cam.matrix_world.inverted()
    loc = np.array([list(inv @ Vector(p)) for p in pts])
    cam_data.ortho_scale = float(max(np.ptp(loc[:, 0]), np.ptp(loc[:, 1])) * margin)
    cam_data.clip_start, cam_data.clip_end = 0.01, 10.0
    return cam_data.ortho_scale


def render(path):
    scene.render.filepath = path
    bpy.ops.render.render(write_still=True)


# ---- final meshes exactly as shipped ----------------------------------------------------------------
bpy.ops.import_scene.gltf(filepath=a.glb)
final = {o.name: o for o in bpy.data.objects if o.type == "MESH"}
for o in final.values():
    o.hide_render = True

# overview of the whole GLB with its own materials
for o in final.values():
    o.hide_render = False
for tag, d in (("anterior", (0, -1, 0.05)), ("left_lateral", (1, -0.25, 0.05)), ("posterior_right", (-0.7, 1, 0.1))):
    frame(list(final.values()), d, 1.05)
    scene.render.resolution_x, scene.render.resolution_y = 700, 900
    render(os.path.join(a.out, f"overview_{tag}.png"))
scene.render.resolution_x = scene.render.resolution_y = a.size
for o in final.values():
    o.hide_render = True

report = {}
VIEW = (0.55, -1.0, 0.35)            # from anterior, the patient's left and slightly above (Blender: +x left, -y anterior, +z up)
for sid in a.ids:
    before = set(bpy.data.objects)
    bpy.ops.wm.ply_import(filepath=os.path.join(a.raw, f"{sid}.ply"))
    raw = next(o for o in bpy.data.objects if o not in before)
    raw.name = f"raw_{sid}"
    me = raw.data
    n = len(me.vertices)
    co = np.empty(n * 3)
    me.vertices.foreach_get("co", co)
    co = co.reshape(-1, 3)
    co = np.column_stack([-(co[:, 0] - R0), -(co[:, 1] - A0), (co[:, 2] - S0)]) / 1000.0
    me.vertices.foreach_set("co", co.ravel())
    me.update()
    for p in me.polygons:
        p.use_smooth = False
    me.materials.clear()
    me.materials.append(M_RAW)
    fin = final[sid]
    fin.data.materials.clear()
    fin.data.materials.append(M_FIN)
    scale = frame([raw, fin], VIEW)
    # raw
    raw.hide_render, fin.hide_render = False, True
    render(os.path.join(a.out, f"{sid}_raw.png"))
    # final
    raw.hide_render, fin.hide_render = True, False
    render(os.path.join(a.out, f"{sid}_final.png"))
    # final + wire
    wire = fin.copy()
    wire.data = fin.data.copy()
    scene.collection.objects.link(wire)
    wire.data.materials.clear()
    wire.data.materials.append(M_WIRE)
    mod = wire.modifiers.new("w", "WIREFRAME")
    mod.thickness = scale * 0.0018
    mod.use_replace = True
    render(os.path.join(a.out, f"{sid}_wire.png"))
    report[sid] = {"raw_triangles": len(raw.data.polygons), "final_triangles": len(fin.data.polygons), "ortho_scale_m": scale}
    bpy.data.objects.remove(wire, do_unlink=True)
    bpy.data.objects.remove(raw, do_unlink=True)
    fin.hide_render = True
json.dump(report, open(os.path.join(a.out, "compare_render.json"), "w"), indent=1)
print("rendered", list(report))
