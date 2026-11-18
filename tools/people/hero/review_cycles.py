"""review_cycles.py: Cycles pictures of the hero patient for review (same cameras as the three.js page, from p25.json).
   Blender -b --factory-startup --python review_cycles.py -- OUT_DIR [--samples N]"""
import bpy, os, sys, json, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from mathutils import Vector, Quaternion, Matrix
import hero_lib as H

A = H.args_after_dashes(); OUT = A[0]; os.makedirs(OUT, exist_ok=True)
SAMPLES = int(A[A.index('--samples') + 1]) if '--samples' in A else 48
WORK = H.patient_work('p25')
bpy.ops.wm.open_mainfile(filepath=os.path.join(H.HERO, 'p25', 'blend', 'p25_final.blend'))
sc = bpy.context.scene
arm = bpy.data.objects['rig']
META = json.load(open(os.path.join(H.OUT_ASSETS, 'p25.json')))
SN = np.load(os.path.join(WORK, 'stretcher', 'stretcher.npz'))
V = np.stack([SN['V'][:, 0], -SN['V'][:, 2], SN['V'][:, 1]], 1)
for nm, sel, col, rough in (('stretcher_pad', SN['pad'], (0.06, 0.16, 0.27), 0.65), ('stretcher_frame', ~SN['pad'], (0.75, 0.76, 0.78), 0.3)):
    o = H.new_mesh(nm, V, [tuple(int(x) for x in (f if f[-1] != f[-2] else f[:-1])) for f in SN['F'][sel]])
    m = bpy.data.materials.new(nm); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Roughness'].default_value = rough
    o.data.materials.append(m)
# skin: subsurface for Cycles (the GLB carries no SSS); cornea glossy and clear
for mn in ('skin_head', 'skin_body'):
    b = [n for n in bpy.data.materials[mn].node_tree.nodes if n.type == 'BSDF_PRINCIPLED'][0]
    b.inputs['Subsurface Weight'].default_value = 0.35; b.inputs['Subsurface Radius'].default_value = (1.0, 0.4, 0.2); b.inputs['Subsurface Scale'].default_value = 0.004
H.use_gpu(sc, SAMPLES); sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Medium High Contrast' if False else 'None'
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs[0].default_value = (0.42, 0.45, 0.48, 1); w.node_tree.nodes['Background'].inputs[1].default_value = 0.35
for loc, energy, size, color in (((0.5, 0.9, 2.4), 260, 1.6, (1.0, 0.97, 0.92)), ((-1.6, -0.8, 1.6), 90, 2.0, (0.92, 0.96, 1.0)), ((1.4, -1.2, 1.2), 60, 1.5, (1, 1, 1))):
    d = bpy.data.lights.new('l', 'AREA'); d.energy = energy; d.size = size; d.color = color
    o = bpy.data.objects.new('l', d); sc.collection.objects.link(o); o.location = loc
    o.rotation_euler = (Vector((0, 0, 0.3)) - o.location).to_track_quat('-Z', 'Y').to_euler()
cam = bpy.data.cameras.new('c'); co = bpy.data.objects.new('c', cam); sc.collection.objects.link(co); sc.camera = co
FIG = [o for o in bpy.data.objects if o.type == 'MESH' and o.parent == arm]
L2B = lambda p: Vector((p[0], -p[2], p[1]))


def pose_keys(name):
    act = bpy.data.actions[name]; out = {}
    arm.animation_data.action = act; sc.frame_set(1)
    for pb in arm.pose.bones:
        out[pb.name] = (pb.location.copy(), pb.rotation_quaternion.copy())
    return out


def set_pose(a, b=None, t=0.0, morphs=()):
    if b is None:
        arm.animation_data.action = bpy.data.actions[a]; sc.frame_set(1)
    else:
        ka, kb = pose_keys(a), pose_keys(b)
        arm.animation_data.action = None
        for pb in arm.pose.bones:
            la, qa = ka[pb.name]; lb, qb = kb[pb.name]
            pb.location = la.lerp(lb, t); pb.rotation_quaternion = qa.slerp(qb, t)
        bpy.context.view_layer.update()
    for o in FIG:
        if o.data.shape_keys:
            for k in o.data.shape_keys.key_blocks[1:]:
                k.value = 0.0
                if k.name == 'press_' + a:
                    k.value = 1.0 - t if b else 1.0
                if b and k.name == 'press_' + b:
                    k.value = t
                if k.name in morphs:
                    k.value = 1.0
    shown = (a if (b is None or t < 0.5) else b)
    for o in bpy.data.objects:
        if '__' in o.name:
            o.hide_render = not o.name.endswith('__' + shown)
    bpy.context.view_layer.update()
    return shown


def lm(name, pose):
    r = META['landmarks'][name]['poses'][pose]
    return L2B(r['position'])


def frame(pose):
    mouth, nose, chin, fh, eL, eR = (lm(n, pose) for n in ('mouth', 'noseTip', 'chin', 'forehead', 'eyeL', 'eyeR'))
    face = (nose + fh) * 0.5; up = (fh - chin).normalized(); left = (eL - eR).normalized()
    fn = left.cross(up).normalized()
    if fn.dot(nose - face) < 0:
        fn = -fn
    return dict(mouth=mouth, face=face, up=up, left=left, fn=fn)


def shoot(name, eye, look, up=(0, 0, 1), lens=50, res=(1280, 720)):
    cam.lens = lens
    H.look(co, eye, look, up)
    H.render(sc, os.path.join(OUT, name + '.png'), *res)
    print('rendered', name, flush=True)


JOBS = []
set_pose('flat'); F = frame('flat')
shoot('ref_front', F['face'] + F['fn'] * 0.75, F['face'] - F['up'] * 0.02, F['up'], lens=85)
shoot('ref_three', F['face'] + F['fn'] * 0.55 + F['left'] * 0.5, F['face'], F['up'], lens=85)
shoot('ref_profile', F['face'] + F['left'] * 0.75 + F['fn'] * 0.04, F['face'] - F['fn'] * 0.03, F['up'], lens=85)
for pose in ('flat', 'ramped', 'lateral_left'):
    set_pose(pose); F = frame(pose)
    shoot(f'{pose}_head', Vector((0, 1.75, 0.95)), Vector((0, 0.25, 0.12)), lens=40)
    shoot(f'{pose}_plusx', Vector((2.2, 0.05, 0.85)), Vector((0, 0.05, 0.15)), lens=35)
    shoot(f'{pose}_minusx', Vector((-2.2, 0.05, 0.85)), Vector((0, 0.05, 0.15)), lens=35)
    shoot(f'{pose}_face', F['face'] + F['fn'] * 0.45 - F['up'] * 0.12, F['face'], F['up'], lens=70)
set_pose('ramped', morphs=('jawOpen',)); F = frame('ramped')
shoot('mouth_laryngoscopist', F['mouth'] + F['fn'] * 0.42 + F['up'] * 0.25, F['mouth'] - F['fn'] * 0.05 + F['up'] * 0.01, -F['up'], lens=70)
set_pose('flat', morphs=('jawOpen',)); F = frame('flat')
shoot('mouth_into', F['mouth'] + F['fn'] * 0.40 - F['up'] * 0.03, F['mouth'] - F['fn'] * 0.06 + F['up'] * 0.012, F['up'], lens=90)
for mname in ('jawThrust', 'eyesClosed', 'cheekPuff'):
    set_pose('flat', morphs=(mname,)); F = frame('flat')
    shoot('m_' + mname, F['face'] + F['fn'] * 0.36 + F['left'] * 0.28 - F['up'] * 0.06, F['face'], F['up'], lens=70)
set_pose('ramped', 'lateral_left', 0.5)
shoot('mix_head', Vector((0, 1.75, 0.95)), Vector((0, 0.25, 0.12)), lens=40)
shoot('mix_plusx', Vector((2.2, 0.05, 0.85)), Vector((0, 0.05, 0.15)), lens=35)
print('DONE')
