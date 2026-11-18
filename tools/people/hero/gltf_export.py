"""gltf_export.py: export a hero .blend to a raw glTF binary with Blender's own exporter (skins, sparse morph targets,
animations), as the asset contract asks.   Blender -b --factory-startup --python gltf_export.py -- BLEND OUT.glb [--no-anim]"""
import bpy, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import hero_lib as H
A = H.args_after_dashes(); BL, OUTF = A[0], A[1]
bpy.ops.wm.open_mainfile(filepath=BL)
for o in bpy.data.objects:
    o.hide_viewport = False; o.hide_render = False; o.hide_set(False)
    o.select_set(o.type in ('MESH', 'ARMATURE'))
arm = bpy.data.objects.get('rig')
anim = '--no-anim' not in A
kw = dict(filepath=OUTF, export_format='GLB', use_selection=True, export_yup=True, export_apply=False, export_texcoords=True, export_normals=True,
          export_tangents=False, export_materials='EXPORT', export_skins=True, export_all_influences=False, export_def_bones=False,
          export_morph=True, export_morph_normal=True, export_morph_tangent=False, export_animations=anim, export_extras=True)
try:
    kw.update(export_animation_mode='ACTIONS', export_force_sampling=False, export_optimize_animation_size=True, export_reset_pose_bones=True, export_try_sparse_sk=True,
              export_try_omit_sparse_sk=True, export_morph_animation=False, export_bake_animation=False, export_anim_slide_to_zero=False, export_image_format='AUTO')
    bpy.ops.export_scene.gltf(**kw)
except TypeError as e:
    print('exporter option not known, retrying without the optional ones:', e)
    for k in ('export_try_sparse_sk', 'export_try_omit_sparse_sk', 'export_morph_animation', 'export_bake_animation', 'export_anim_slide_to_zero', 'export_optimize_animation_size'):
        kw.pop(k, None)
    bpy.ops.export_scene.gltf(**kw)
print('EXPORTED', OUTF, os.path.getsize(OUTF))
