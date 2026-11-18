"""measure.py: real sizes of the finished files (Blender imports them; sizes in the files' own glTF frame, mm).
   blender -b --factory-startup --python tools/props/airway/measure.py -- FILE.glb [FILE.glb ...]"""
import bpy, sys, json
from mathutils import Matrix, Vector
FIX = Matrix.Rotation(-1.5707963, 4, 'X')
def bounds(objs):
    lo = Vector((1e9,) * 3); hi = -lo
    dg = bpy.context.evaluated_depsgraph_get()
    for o in objs:
        if o.type != 'MESH': continue
        e = o.evaluated_get(dg); me = e.to_mesh()
        for v in me.vertices:
            p = FIX @ (o.matrix_world @ v.co)
            for k in range(3): lo[k] = min(lo[k], p[k]); hi[k] = max(hi[k], p[k])
        e.to_mesh_clear()
    return lo, hi
for f in sys.argv[sys.argv.index('--') + 1:]:
    bpy.ops.wm.read_factory_settings(use_empty=True); bpy.ops.import_scene.gltf(filepath=f); bpy.context.view_layer.update()
    objs = list(bpy.data.objects); res = {}
    lo, hi = bounds(objs); res['ALL'] = [round((hi[k] - lo[k]) * 1000, 1) for k in range(3)]
    for o in objs:
        if o.type == 'MESH':
            l, h = bounds([o]); res[o.name] = [round((h[k] - l[k]) * 1000, 1) for k in range(3)]
        elif o.type == 'EMPTY' and o.parent:
            p = FIX @ o.matrix_world.translation; res['@' + o.name] = [round(c * 1000, 1) for c in p]
    print('MEASURE', f.split('/')[-1], json.dumps(res))
