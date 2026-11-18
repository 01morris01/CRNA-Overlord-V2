"""stretcher_ref.py: the measured endoscopy stretcher as a small GLB in the patient frame, for the review pictures only.
   Blender -b --factory-startup --python stretcher_ref.py -- OUT.glb"""
import bpy, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
import hero_lib as H
OUTF = H.args_after_dashes()[0]
bpy.ops.wm.read_factory_settings(use_empty=True)
SN = np.load(os.path.join(H.patient_work('p25'), 'stretcher', 'stretcher.npz'))
V = np.stack([SN['V'][:, 0], -SN['V'][:, 2], SN['V'][:, 1]], 1)
for nm, sel, col, rough in (('stretcher_pad', SN['pad'], (0.08, 0.2, 0.32), 0.7), ('stretcher_frame', ~SN['pad'], (0.75, 0.76, 0.78), 0.35)):
    o = H.new_mesh(nm, V, [tuple(int(x) for x in (f if f[-1] != f[-2] else f[:-1])) for f in SN['F'][sel]])
    m = bpy.data.materials.new(nm); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Roughness'].default_value = rough
    o.data.materials.append(m)
bpy.ops.export_scene.gltf(filepath=OUTF, export_format='GLB', export_yup=True)
