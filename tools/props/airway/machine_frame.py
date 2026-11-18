"""machine_frame.py: bring DGLENN43's anesthesia workstation into the machine-local frame of assets/level/clinical.glb.

tools/clinical_set.py builds the level's workstation in Blender (Z up) from the source file, scales it by 0.0085 and centers
its body; the level is exported with +Y up, so a point (x, y, z) in Blender is (x, z, -y) in the frame of the glTF node
eq_anesthesia_machine. This module repeats that transform so the controls and the bellows can be built in the same frame.

   blender -b --factory-startup --python tools/props/airway/machine_frame.py -- SOURCE.glb OUT.json
writes every named source part with its box in the machine-local glTF frame (meters, +Y up, +Z toward the operator)."""
import bpy, sys, os, json
import numpy as np
from mathutils import Matrix, Vector

SCALE = 0.0085
TO_GLTF = Matrix(((1, 0, 0, 0), (0, 0, 1, 0), (0, -1, 0, 0), (0, 0, 0, 1)))   # Blender Z-up -> glTF Y-up

def bring(path):
    """Import the source and bake every transform into its mesh data (as clinical_set.bring does)."""
    before = set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=path); new = [o for o in bpy.data.objects if o not in before]
    bpy.context.view_layer.update(); dg = bpy.context.evaluated_depsgraph_get(); meshes = [(o, o.matrix_world.copy()) for o in new if o.type == 'MESH']
    for o, mw in meshes:
        if o.modifiers or o.data.shape_keys:
            nm = bpy.data.meshes.new_from_object(o.evaluated_get(dg), preserve_all_data_layers=True, depsgraph=dg); o.modifiers.clear(); o.data = nm
        else: o.data = o.data.copy()
        o.vertex_groups.clear()
    for o, mw in meshes:
        o.parent = None; o.matrix_world = Matrix.Identity(4); o.data.transform(mw)
        if mw.determinant() < 0: o.data.flip_normals()
    for o in new:
        if o.type != 'MESH': bpy.data.objects.remove(o)
    return [o for o, _ in meshes if o.name in bpy.data.objects]

def co(objs):
    a = []
    for o in objs:
        v = np.empty(len(o.data.vertices) * 3, np.float32); o.data.vertices.foreach_get('co', v); a.append(v.reshape(-1, 3))
    return np.concatenate(a)

def machine_matrix(objs):
    """The Blender-space matrix clinical_set.anesthesia_machine applies, followed by the Y-up conversion."""
    kept = [o for o in objs if not o.name.startswith('Icosphere') and not (o.data.materials and o.data.materials[0] and o.data.materials[0].name == 'anesthesia_machine_tubes')]
    body = [o for o in kept if o.data.materials and o.data.materials[0].name == 'anesthesia_machine_body']
    b = co(body); lo, hi = b.min(0), b.max(0); zmin = co(kept).min(0)[2]
    M = Matrix.Diagonal((SCALE, SCALE, SCALE, 1)) @ Matrix.Translation((-(lo[0] + hi[0]) / 2, -(lo[1] + hi[1]) / 2, -zmin))
    return TO_GLTF @ M, kept

def load(path):
    objs = bring(path); M, kept = machine_matrix(objs)
    for o in objs: o.data.transform(M)
    return objs

if __name__ == '__main__':
    argv = sys.argv[sys.argv.index('--') + 1:]
    bpy.ops.wm.read_factory_settings(use_empty=True)
    objs = load(argv[0]); out = {}
    for o in objs:
        c = co([o]); lo, hi = c.min(0), c.max(0)
        out[o.name] = {'material': o.data.materials[0].name if o.data.materials and o.data.materials[0] else None, 'tris': sum(len(p.vertices) - 2 for p in o.data.polygons),
                       'min': [round(float(v), 4) for v in lo], 'max': [round(float(v), 4) for v in hi], 'center': [round(float(v), 4) for v in (lo + hi) / 2]}
    json.dump(out, open(argv[1], 'w'), indent=1)
    for k in sorted(out): print('%-34s %-38s %6d %s %s' % (k, out[k]['material'], out[k]['tris'], out[k]['min'], out[k]['max']))
