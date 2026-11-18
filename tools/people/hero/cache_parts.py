"""cache_parts.py: read the open part meshes the hero uses once and store them as plain arrays (no outside file is opened
again later, and nothing from them is executed).
   blender -b --factory-startup --disable-autoexec --python cache_parts.py -- OUT_DIR
Writes hbm_eye.npz (Blender Studio "Eye - Realistic", CC0: globe and cornea shell, split) and ict_parts.npz
(ICT-FaceKit, MIT: neutral mesh vertex positions in its file order, faces by geometry part, and the expression shapes
the inner parts use)."""
import bpy, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
import hero_lib as H
OUT = H.args_after_dashes()[0]; os.makedirs(OUT, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
with bpy.data.libraries.load(H.HBM_BLEND, link=False) as (src, dst):
    dst.objects = [n for n in src.objects if n == 'Eye - Realistic']
ob = dst.objects[0]; bpy.context.scene.collection.objects.link(ob)
me = ob.data
V = H.get_co(me.vertices, len(me.vertices))
F = [list(p.vertices) for p in me.polygons]
uv = np.empty(len(me.loops) * 2, np.float32); me.uv_layers[0].data.foreach_get('uv', uv); uv = uv.reshape(-1, 2)
# split into connected parts
parent = list(range(len(V)))
def find(a):
    while parent[a] != a:
        parent[a] = parent[parent[a]]; a = parent[a]
    return a
for f in F:
    for i in f[1:]:
        ra, rb = find(f[0]), find(i)
        if ra != rb: parent[ra] = rb
comp = np.array([find(i) for i in range(len(V))])
ids = np.unique(comp)
print('Eye - Realistic parts:', [(int(c), int((comp == c).sum())) for c in ids], 'bbox', V.min(0).round(4), V.max(0).round(4))
Fq = np.array([f + [f[-1]] * (4 - len(f)) for f in F], np.int32)
UVq = []
li = 0
for f in F:
    q = [uv[li + k] for k in range(len(f))] + [uv[li + len(f) - 1]] * (4 - len(f)); UVq.append(q); li += len(f)
np.savez_compressed(os.path.join(OUT, 'hbm_eye.npz'), V=V, F=Fq, UV=np.array(UVq, np.float32), comp=comp)
# ICT
def read_obj(path):
    vs, fs = [], []
    with open(path, 'r', errors='replace') as f:
        for line in f:
            if line.startswith('v '):
                p = line.split(); vs.append((float(p[1]), float(p[2]), float(p[3])))
            elif line.startswith('f '):
                fs.append([int(t.split('/')[0]) - 1 for t in line.split()[1:]])
    return np.array(vs), fs
base, faces = read_obj(os.path.join(H.ICT_DIR, 'generic_neutral_mesh.obj'))
# also texture coordinates per face corner
vts, fuv = [], []
with open(os.path.join(H.ICT_DIR, 'generic_neutral_mesh.obj'), 'r', errors='replace') as f:
    for line in f:
        if line.startswith('vt '):
            p = line.split(); vts.append((float(p[1]), float(p[2])))
        elif line.startswith('f '):
            fuv.append([int(t.split('/')[1]) - 1 if '/' in t and t.split('/')[1] else 0 for t in line.split()[1:]])
vts = np.array(vts)
print('ICT neutral:', len(base), 'vertices', len(faces), 'faces', len(vts), 'uvs')
EXPR = ['jawOpen', 'jawForward', 'cheekPuff_L', 'cheekPuff_R', 'mouthClose', 'mouthLowerDown_L', 'mouthLowerDown_R', 'mouthUpperUp_L', 'mouthUpperUp_R', 'eyeBlink_L', 'eyeBlink_R', 'jawLeft', 'jawRight', 'mouthFunnel', 'mouthPucker']
out = dict(base=base, faces=np.array([f + [f[-1]] * (4 - len(f)) for f in faces], np.int32), fuv=np.array([f + [f[-1]] * (4 - len(f)) for f in fuv], np.int32), vt=vts)
for e in EXPR:
    v, _ = read_obj(os.path.join(H.ICT_DIR, e + '.obj')); out['x_' + e] = v - base
    print('  expr', e, 'max move', np.abs(v - base).max().round(3))
for i in range(4):
    v, _ = read_obj(os.path.join(H.ICT_DIR, f'identity{i:03d}.obj')); out[f'id_{i}'] = v - base
np.savez_compressed(os.path.join(OUT, 'ict_parts.npz'), **out)
print('SAVED')
