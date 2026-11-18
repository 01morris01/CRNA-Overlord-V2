"""look_morphs.py: quick clay-and-colour check of the face shapes on a .blend (standing frame), for the build log.
   Blender -b --factory-startup --python look_morphs.py -- BLEND OUT_DIR shape[,shape...]"""
import bpy, os, sys, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from mathutils import Vector
import hero_lib as H
A = H.args_after_dashes(); BL, OUT, SH = A[0], A[1], A[2].split(',')
os.makedirs(OUT, exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=BL)
sc = bpy.context.scene
H.use_gpu(sc, 24); sc.view_settings.view_transform = 'AgX'
cam = bpy.data.cameras.new('cl'); c = bpy.data.objects.new('cl', cam); sc.collection.objects.link(c); sc.camera = c; cam.lens = 70
skin = bpy.data.objects['skin']
V = np.array([v.co[:] for v in skin.data.vertices]); top = V[:, 2].max()
ctr = Vector((0, -0.12, top - 0.155))
H.studio(sc, ctr, strength=0.08, world=0.6)
for o in sc.objects:
    if o.type == 'MESH' and o.name == 'hair':
        o.hide_render = True
views = {'front': (0, -0.6, 0.05), 'into': (0, -0.30, 0.42), 'three': (0.38, -0.42, 0.05)}
for sh in SH:
    for o in sc.objects:
        if o.type == 'MESH' and o.data.shape_keys:
            for k in o.data.shape_keys.key_blocks[1:]:
                k.value = 1.0 if k.name == sh else 0.0
    for vn in (('front', 'into') if sh in ('jawOpen', 'jawThrust', 'lipsPart') else ('front', 'three')):
        tgt = ctr + Vector((0, 0.0, -0.035)) if vn == 'into' else ctr
        H.look(c, tgt + Vector(views[vn]), tgt); H.render(sc, os.path.join(OUT, f'{sh}_{vn}.png'), 560, 560)
