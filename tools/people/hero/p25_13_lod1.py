"""p25_13_lod1.py: the hero patient's lighter file (about 25k triangles for the figure): same skeleton, the same clips and
the same clinical morph names. Each piece is reduced by Blender's collapse decimation, then its skin weights and shape
keys are taken again from the hero piece under it (bound to its surface), so they stay exact. The tear line and lid
shadow are left out; maps are 1024 px.   Blender -b --factory-startup --python tools/people/hero/p25_13_lod1.py"""
import bpy, os, sys, json
sys.dont_write_bytecode = True
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
import hero_lib as H

WORK = H.patient_work('p25')
BLEND = os.path.join(H.HERO, 'p25', 'blend')
TEX = os.path.join(WORK, 'tex')
log = H.Log('lod1')
bpy.ops.wm.open_mainfile(filepath=os.path.join(BLEND, 'p25_final.blend'))
scene = bpy.context.scene
arm = bpy.data.objects['rig']
CLIN = ['jawOpen', 'lipsPart', 'jawThrust', 'cheekPuff', 'eyesClosed', 'blink', 'breathe', 'press_ramped', 'press_lateral_left']
RATIO = {'skin_head': 0.20, 'skin_body': 0.25, 'gown': 0.22, 'hair': 0.45, 'eyes': 0.45, 'cornea': 0.4, 'teeth_lower': 0.22, 'gums': 0.2, 'tongue': 0.22, 'mouth_inner': 0.2,
         'brows': 1.0, 'lashes': 1.0, 'support_ramp__ramped': 0.4, 'support_head__ramped': 0.3, 'pillow_head__flat': 0.3, 'pillow_head__lateral_left': 0.3,
         'pillow_knees__lateral_left': 0.3, 'blanket__flat': 0.25, 'blanket__ramped': 0.25, 'blanket__lateral_left': 0.25}
for n in ('eye_wet', 'eye_occlusion'):
    bpy.data.objects.remove(bpy.data.objects[n], do_unlink=True)
REPORT = {}
for name, ratio in RATIO.items():
    o = bpy.data.objects[name]
    keys = [k.name for k in o.data.shape_keys.key_blocks[1:]] if o.data.shape_keys else []
    skinned = any(m.type == 'ARMATURE' for m in o.modifiers)
    src_V = H.get_co(o.data.shape_keys.key_blocks[0].data if o.data.shape_keys else o.data.vertices, len(o.data.vertices))
    src_T = H.tris_of(H.quads_of(o))
    src_keys = {k: H.get_co(o.data.shape_keys.key_blocks[k].data, len(src_V)) - src_V for k in keys if k in CLIN}
    src_W = {g.name: np.zeros(len(src_V)) for g in o.vertex_groups}
    gname = {g.index: g.name for g in o.vertex_groups}
    for v in o.data.vertices:
        for g in v.groups:
            src_W[gname[g.group]][v.index] = g.weight
    t0 = sum(len(p.vertices) - 2 for p in o.data.polygons)
    if ratio < 1.0:
        me = o.data.copy(); o.data = me
        if me.shape_keys:
            o.shape_key_clear()
        for m in list(o.modifiers):
            o.modifiers.remove(m)
        o.vertex_groups.clear()
        d = o.modifiers.new('dec', 'DECIMATE')
        d.ratio = ratio; d.use_collapse_triangulate = False
        bpy.context.view_layer.objects.active = o
        bpy.ops.object.modifier_apply(modifier='dec')
        V = H.get_co(o.data.vertices, len(o.data.vertices))
        tri, bc, off = H.bind_to_surface(V, src_V, src_T)
        lerp = lambda A: A[src_T[tri, 0]] * bc[:, :1] + A[src_T[tri, 1]] * bc[:, 1:2] + A[src_T[tri, 2]] * bc[:, 2:3]
        if skinned:
            for gn, w in src_W.items():
                wl = lerp(w[:, None])[:, 0]
                if wl.max() < 1e-3:
                    continue
                vg = o.vertex_groups.new(name=gn)
                for i in np.nonzero(wl > 1e-3)[0]:
                    vg.add([int(i)], float(wl[i]), 'REPLACE')
            md = o.modifiers.new('rig', 'ARMATURE'); md.object = arm
        if src_keys:
            o.shape_key_add(name='Basis', from_mix=False)
            for k, dlt in src_keys.items():
                kk = o.shape_key_add(name=k, from_mix=False); H.set_co(kk.data, V + lerp(dlt)); kk.value = 0.0
    else:
        if o.data.shape_keys:
            for k in list(o.data.shape_keys.key_blocks[1:]):
                if k.name not in CLIN:
                    o.shape_key_remove(k)
    t1 = sum(len(p.vertices) - 2 for p in o.data.polygons)
    REPORT[name] = dict(hero_triangles=t0, lod1_triangles=t1, morphs=[k.name for k in o.data.shape_keys.key_blocks[1:]] if o.data.shape_keys else [])
    log(f'{name}: {t0} -> {t1} triangles; morphs {len(REPORT[name]["morphs"])}')
# 1024 px maps
for im in bpy.data.images:
    if im.size[0] > 1024 and im.filepath:
        im.scale(1024, 1024)
        p = os.path.join(TEX, 'lod1_' + os.path.basename(bpy.path.abspath(im.filepath)))
        im.filepath_raw = p; im.file_format = 'PNG'; im.save()
fig = sum(v['lod1_triangles'] for k, v in REPORT.items() if '__' not in k)
for o in bpy.data.objects:
    if o.type == 'MESH' and o.data.shape_keys:
        for k in o.data.shape_keys.key_blocks[1:]:
            k.value = 0.0
log(f'LOD1 figure triangles: {fig}')
H.save_json(os.path.join(WORK, 'lod1.json'), dict(pieces=REPORT, figure_triangles=fig))
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(BLEND, 'p25_lod1.blend'))
log('SAVED p25_lod1.blend')
