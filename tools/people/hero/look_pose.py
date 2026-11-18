"""look_pose.py: clay pictures of a posed .blend (lying frame) from above, the foot end, the head end and both sides,
with the measured mattress outline drawn in, for the build log.   Blender -b --python look_pose.py -- BLEND OUT_PREFIX [action]"""
import bpy, os, sys, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from mathutils import Vector
import hero_lib as H
A = H.args_after_dashes(); BL, OUTP = A[0], A[1]
ACT = A[2] if len(A) > 2 else None
bpy.ops.wm.open_mainfile(filepath=BL)
sc = bpy.context.scene
arm = bpy.data.objects.get('rig')
if ACT and arm:
    arm.animation_data_create(); arm.animation_data.action = bpy.data.actions[ACT]; sc.frame_set(1)
    for o in sc.objects:
        if o.type == 'MESH' and o.data.shape_keys and ('press_' + ACT) in o.data.shape_keys.key_blocks:
            o.data.shape_keys.key_blocks['press_' + ACT].value = 1.0
        if '__' in o.name and not o.name.endswith('__' + ACT):
            o.hide_render = True
W = H.patient_work('p25')
SN = np.load(os.path.join(W, 'stretcher', 'stretcher.npz'))
mat = H.clay('clay', (0.55, 0.45, 0.38), 0.5)
for o in sc.objects:
    if o.type == 'MESH':
        if '__' not in o.name:
            o.data.materials.clear(); o.data.materials.append(mat)
off = np.array(eval(A[3])) if len(A) > 3 else np.zeros(3)
# the mattress as measured (patient frame -> lying frame), shifted like the figure
V = SN['V'].astype(float); F = SN['F']; pad = SN['pad']
Vl = np.stack([V[:, 0], -V[:, 2], V[:, 1]], 1) + off
st = H.new_mesh('mattress_ref', Vl, [tuple(f if f[-1] != f[-2] else f[:-1]) for f in F[pad]])
st.data.materials.append(H.clay('pad', (0.18, 0.3, 0.42), 0.8))
fr = H.new_mesh('frame_ref', Vl, [tuple(f if f[-1] != f[-2] else f[:-1]) for f in F[~pad]])
fr.data.materials.append(H.clay('frame', (0.7, 0.7, 0.72), 0.4))
H.use_gpu(sc, 24); sc.view_settings.view_transform = 'AgX'
ctr = Vector((0, 0, 0.15)) + Vector(off)
H.studio(sc, ctr, strength=1.2, world=0.5)
cam = bpy.data.cameras.new('c'); c = bpy.data.objects.new('c', cam); sc.collection.objects.link(c); sc.camera = c
for nm, loc, size in (('top', (0, 0.0, 3.2), (700, 1100)), ('foot', (0, -2.6, 0.9), (900, 600)), ('head', (0, 2.6, 0.9), (900, 600)), ('plusx', (2.6, 0, 0.6), (1100, 600)), ('minusx', (-2.6, 0, 0.6), (1100, 600))):
    cam.lens = 50
    H.look(c, ctr + Vector(loc), ctr)
    H.render(sc, OUTP + f'_{nm}.png', *size)
