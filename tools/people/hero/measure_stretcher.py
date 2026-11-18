"""measure_stretcher.py: measure the endoscopy-suite stretcher of the level (read only) and save its mattress as a height
field and a plain mesh in the patient frame, for posing and contact checks.
   blender -b --factory-startup --python measure_stretcher.py -- OUT_DIR
Patient frame used by every hero script (glTF axes): Y up, metres, origin = middle of the mattress-top surface,
head toward -Z, the patient's left = +X when he lies on his back face up.
The level places the stretcher at Blender (8.6, 23.2, 0) with its head toward Blender +Y (tools/clinical_set.py), i.e.
glTF (8.6, *, -23.2) with the head toward -Z."""
import bpy, sys, os, json, math
import numpy as np
OUT = sys.argv[sys.argv.index('--') + 1]
os.makedirs(OUT, exist_ok=True)
GLB = os.path.expanduser('~/Developer/overlord-next/assets/level/clinical.glb')
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=GLB)
CX, CY = 8.6, 23.2
cands = []
for o in bpy.data.objects:
    if o.type != 'MESH':
        continue
    mw = np.array(o.matrix_world)
    co = np.array([v.co[:] for v in o.data.vertices])
    if not len(co):
        continue
    w = co @ mw[:3, :3].T + mw[:3, 3]
    c = w.mean(0)
    if abs(c[0] - CX) < 1.3 and abs(c[1] - CY) < 1.4:
        mats = [m.name for m in o.data.materials if m]
        cands.append((o, w, mats))
        print('NEAR', o.name, o.parent.name if o.parent else '-', len(w), 'bbox', w.min(0).round(3), w.max(0).round(3), mats)
# the stretcher: the object(s) whose bbox centre is at the placement and has the blue rubber mattress
st = [(o, w, m) for o, w, m in cands if any(n.startswith('BlueRubber') for n in m) or 'stretcher' in (o.parent.name if o.parent else o.name).lower()]
print('STRETCHER parts', [o.name for o, _, _ in st])
allw = []; allf = []; base = 0; mat_of_face = []
for o, w, m in st:
    for p in o.data.polygons:
        allf.append([base + i for i in p.vertices]); mn = o.data.materials[p.material_index].name if o.data.materials else ''
        mat_of_face.append(mn)
    allw.append(w); base += len(w)
W = np.concatenate(allw)
# Blender (x, y, z) -> patient frame: X = x - CX, Y = z - top, Z = -(y - CY)
P = np.stack([W[:, 0] - CX, W[:, 2], -(W[:, 1] - CY)], 1)
pad = np.array([mn.startswith('BlueRubber') for mn in mat_of_face])
padv = np.unique(np.concatenate([allf[i] for i in np.nonzero(pad)[0]]))
Q = P[padv]
print('PAD bbox (patient frame, before re-origin):', Q.min(0).round(4), Q.max(0).round(4))
# top surface: upward faces of the pad
tris = []
for i in np.nonzero(pad)[0]:
    f = allf[i]
    for k in range(1, len(f) - 1):
        tris.append((f[0], f[k], f[k + 1]))
tris = np.array(tris)
n = np.cross(P[tris[:, 1]] - P[tris[:, 0]], P[tris[:, 2]] - P[tris[:, 0]]); a = 0.5 * np.linalg.norm(n, axis=1); n = n / np.maximum(2 * a[:, None], 1e-12)
cen = P[tris].mean(1)
up = n[:, 1] > 0.8
top = float(np.median(cen[up & (a > 1e-4), 1])) if (up & (a > 1e-4)).any() else float(Q[:, 1].max())
xs = cen[up, 0]; zs = cen[up, 2]
x0, x1 = float(np.percentile(P[padv][:, 0], 0.5)), float(np.percentile(P[padv][:, 0], 99.5))
z0, z1 = float(P[padv][:, 2].min()), float(P[padv][:, 2].max())
cx_, cz_ = 0.5 * (x0 + x1), 0.5 * (z0 + z1)
print(f'PAD top y {top:.4f} (median of upward faces), x {x0:.3f}..{x1:.3f} (width {x1 - x0:.3f}), z {z0:.3f}..{z1:.3f} (length {z1 - z0:.3f})')
# height field of the top surface (ray casts down) on a 5 mm grid
from mathutils.bvhtree import BVHTree
from mathutils import Vector
tree = BVHTree.FromPolygons([tuple(v) for v in P], [tuple(f) for f in allf])
padtree = BVHTree.FromPolygons([tuple(v) for v in P], [tuple(allf[i]) for i in np.nonzero(pad)[0]])
gx = np.arange(x0 - 0.12, x1 + 0.12, 0.005); gz = np.arange(z0 - 0.05, z1 + 0.05, 0.005)
H = np.full((len(gz), len(gx)), np.nan); Hpad = np.full_like(H, np.nan)
for i, z in enumerate(gz):
    for j, x in enumerate(gx):
        loc = tree.ray_cast(Vector((x, top + 1.0, z)), Vector((0, -1, 0)))[0]
        if loc is not None: H[i, j] = loc.y
        loc = padtree.ray_cast(Vector((x, top + 1.0, z)), Vector((0, -1, 0)))[0]
        if loc is not None: Hpad[i, j] = loc.y
# the flat part of the mattress: cells within 8 mm of the top
flat = np.abs(Hpad - top) < 0.008
rows = [(gz[i], gx[flat[i]].min(), gx[flat[i]].max()) for i in range(len(gz)) if flat[i].any()]
wid = np.array([r[2] - r[1] for r in rows])
print(f'flat top: z {rows[0][0]:.3f}..{rows[-1][0]:.3f}; width median {np.median(wid):.3f} min {wid.min():.3f} max {wid.max():.3f}')
# edges: how the mattress rounds off (height drop vs distance from the flat edge), mid-length section
mid = np.argmin(np.abs(gz - cz_))
prof = [(round(float(gx[j]), 3), None if np.isnan(Hpad[mid, j]) else round(float(Hpad[mid, j] - top), 4), None if np.isnan(H[mid, j]) else round(float(H[mid, j] - top), 4)) for j in range(len(gx))]
print('mid-length section (x, pad dy, anything dy):', prof[::6])
# rails: anything above the mattress top within 0.25 m outside the pad
above = P[:, 1] > top - 0.10
outside = np.abs(P[:, 0] - cx_) > 0.5 * (x1 - x0) + 0.005
for s in (-1, 1):
    sel = above & outside & ((P[:, 0] - cx_) * s > 0)
    if sel.any():
        q = P[sel]; print(f'RAIL side {s:+d}: {sel.sum()} vertices, x {q[:, 0].min():.3f}..{q[:, 0].max():.3f}, y {q[:, 1].min() - top:+.3f}..{q[:, 1].max() - top:+.3f} rel top, z {q[:, 2].min():.3f}..{q[:, 2].max():.3f}')
info = dict(level_file='assets/level/clinical.glb', placement_blender=[CX, CY, 0], parts=[o.name for o, _, _ in st],
            top_y_world=top, pad_x=[x0 - cx_, x1 - cx_], pad_z=[z0 - cz_, z1 - cz_], pad_centre_world=[CX + cx_, top, -(CY) + cz_],
            pad_width=x1 - x0, pad_length=z1 - z0, flat_width_median=float(np.median(wid)), origin_note='patient frame origin = (pad centre x, pad top, pad centre z)')
json.dump(info, open(os.path.join(OUT, 'stretcher.json'), 'w'), indent=1)
np.savez_compressed(os.path.join(OUT, 'stretcher.npz'), V=(P - np.array([cx_, top, cz_])).astype(np.float32), F=np.array([f + [f[-1]] * (4 - len(f)) for f in allf if len(f) <= 4], np.int32),
                    pad=pad[[len(f) <= 4 for f in allf]], gx=gx - cx_, gz=gz - cz_, H=H - top, Hpad=Hpad - top)
print('SAVED', json.dumps(info))
