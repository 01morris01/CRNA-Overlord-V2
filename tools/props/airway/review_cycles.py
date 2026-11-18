"""review_cycles.py: studio renders of a finished prop next to a 30 cm rule (Cycles, Blender 5.1).

   blender -b --factory-startup --python tools/props/airway/review_cycles.py -- SPEC.json OUTDIR

SPEC (all coordinates in the glTF frame of the file, meters, +Y up):
 {"name": "...", "file": "x.glb", "hdri": "studio.hdr", "ruler_tex": "ruler_30cm.png",
  "place": {"rot": [rx, ry, rz] degrees applied to the whole prop before it is stood on the backdrop},
  "nodes": {"plunger": {"t": [x, y, z], "r": [rx, ry, rz]}},   "morphs": {"mesh node": {"key": w}},
  "views": [{"name": "front", "dir": [x, y, z], "fit": "all" | [[lo], [hi]], "margin": 1.15, "lens": 60, "ruler": true}],
  "samples": 96, "size": [1200, 900], "extra": [{"file": "...", "at": [..], "rot": [..]}]}
The prop is stood on a light-grey seamless backdrop; the rule lies beside it, its 0 mark level with the prop's left end."""
import bpy, sys, os, json, math
from mathutils import Vector, Matrix, Euler

G2B = Matrix(((1, 0, 0, 0), (0, 0, -1, 0), (0, 1, 0, 0), (0, 0, 0, 1)))   # glTF (Y up) -> Blender (Z up)


def gv(v): return (G2B @ Vector((*v, 1)))[:3] if len(v) == 3 else v


def setup(spec):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene; sc.render.engine = 'CYCLES'
    try:
        prefs = bpy.context.preferences.addons['cycles'].preferences; prefs.compute_device_type = 'METAL'; prefs.get_devices()
        for d in prefs.devices: d.use = True
        sc.cycles.device = 'GPU'
    except Exception as e: print('GPU not set', e)
    sc.cycles.samples = spec.get('samples', 96); sc.cycles.use_denoising = True
    sc.cycles.max_bounces = 16; sc.cycles.transparent_max_bounces = 24; sc.cycles.transmission_bounces = 16; sc.cycles.glossy_bounces = 8
    sc.render.resolution_x, sc.render.resolution_y = spec.get('size', [1200, 900]); sc.render.film_transparent = False
    sc.view_settings.view_transform = 'AgX'; sc.view_settings.exposure = spec.get('exposure', -1.1); sc.view_settings.look = 'AgX - Medium High Contrast' if 'AgX - Medium High Contrast' in [i.identifier for i in sc.view_settings.bl_rna.properties['look'].enum_items] else 'None'
    w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; nt = w.node_tree; bg = nt.nodes['Background']
    env = nt.nodes.new('ShaderNodeTexEnvironment'); env.image = bpy.data.images.load(spec['hdri']); nt.links.new(env.outputs['Color'], bg.inputs['Color']); bg.inputs['Strength'].default_value = spec.get('hdri_strength', 0.35)
    mp = nt.nodes.new('ShaderNodeMapping'); tc = nt.nodes.new('ShaderNodeTexCoord'); nt.links.new(tc.outputs['Generated'], mp.inputs['Vector']); nt.links.new(mp.outputs['Vector'], env.inputs['Vector']); mp.inputs['Rotation'].default_value[2] = math.radians(spec.get('hdri_rot', 30))


def light(name, loc, target, size, energy, color=(1, 1, 1)):
    d = bpy.data.lights.new(name, 'AREA'); d.size = size; d.energy = energy; d.color = color; o = bpy.data.objects.new(name, d); bpy.context.scene.collection.objects.link(o)
    o.location = loc; o.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler(); return o


def backdrop(z0, size):
    bpy.ops.mesh.primitive_plane_add(size=size * 6, location=(0, 0, z0)); p = bpy.context.object
    m = bpy.data.materials.new('backdrop'); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = (0.30, 0.31, 0.32, 1); b.inputs['Roughness'].default_value = 0.65
    p.data.materials.append(m)
    # a curved sweep behind
    bpy.ops.mesh.primitive_cylinder_add(vertices=64, radius=size * 1.5, depth=size * 6, location=(0, size * 1.6, z0 + size * 1.5), rotation=(0, math.pi / 2, 0)); c = bpy.context.object; c.data.materials.append(m)
    return p


def ruler(tex, x0, y, z, length=0.32, width=0.03, thick=0.0012):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x0 + length / 2 - 0.01, y, z + thick / 2)); r = bpy.context.object; r.scale = (length, width, thick)
    bpy.ops.object.transform_apply(scale=True)
    m = bpy.data.materials.new('ruler'); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']; b.inputs['Metallic'].default_value = 0.85; b.inputs['Roughness'].default_value = 0.35
    t = nt.nodes.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(tex); nt.links.new(t.outputs['Color'], b.inputs['Base Color'])
    r.data.materials.append(m)
    while r.data.uv_layers: r.data.uv_layers.remove(r.data.uv_layers[0])
    uv = r.data.uv_layers.new(name='UVMap')
    for poly in r.data.polygons:
        for li in poly.loop_indices:
            v = r.data.vertices[r.data.loops[li].vertex_index].co
            uv.data[li].uv = ((v.x - (x0 - 0.01)) / length, (v.y - (y - width / 2)) / width)
    return r


def import_glb(path):
    before = set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=path); new = [o for o in bpy.data.objects if o not in before]
    roots = [o for o in new if o.parent is None]; return new, roots


def world_bounds(objs):
    dg = bpy.context.evaluated_depsgraph_get(); lo = Vector((1e9,) * 3); hi = Vector((-1e9,) * 3)
    for o in objs:
        if o.type != 'MESH': continue
        e = o.evaluated_get(dg); me = e.to_mesh()
        for v in me.vertices:
            p = o.matrix_world @ v.co
            for k in range(3): lo[k] = min(lo[k], p[k]); hi[k] = max(hi[k], p[k])
        e.to_mesh_clear()
    return lo, hi


def main():
    argv = sys.argv[sys.argv.index('--') + 1:]; spec = json.load(open(argv[0])); out = argv[1]; os.makedirs(out, exist_ok=True)
    setup(spec)
    new, roots = import_glb(spec['file'])
    pivot = bpy.data.objects.new('pivot', None); bpy.context.scene.collection.objects.link(pivot)
    for r in roots: r.parent = pivot
    by = {o.name: o for o in new}
    for name, tr in spec.get('nodes', {}).items():
        o = by.get(name)
        if not o: print('no node', name); continue
        # node transforms are given in glTF terms relative to the node's rest (translation added, rotation composed)
        if 't' in tr: o.location = o.location + Vector((tr['t'][0], -tr['t'][2], tr['t'][1]))           # glTF local offset -> Blender local
        if 'r' in tr:
            C = G2B.to_3x3(); qg = Euler([math.radians(a) for a in tr['r']]).to_matrix(); qb = (C @ qg @ C.inverted()).to_quaternion()
            o.rotation_mode = 'QUATERNION'; o.rotation_quaternion = o.rotation_quaternion @ qb
    for name, keys in spec.get('morphs', {}).items():
        o = by.get(name)
        if not o or not o.data.shape_keys: print('no morphs on', name); continue
        for k, w in keys.items():
            kb = o.data.shape_keys.key_blocks.get(k)
            if kb: kb.value = w
    for ex in spec.get('extra', []):
        n2, r2 = import_glb(ex['file'])
        for r in r2:
            r.rotation_mode = 'XYZ'; r.rotation_euler = [math.radians(a) for a in ex.get('rot', [0, 0, 0])]; r.location = gv(ex.get('at', [0, 0, 0])); new += n2
    bpy.context.view_layer.update()
    pivot.rotation_euler = [math.radians(a) for a in spec.get('place', {}).get('rot', [0, 0, 0])]; bpy.context.view_layer.update()
    lo, hi = world_bounds(new); c = (lo + hi) / 2; pivot.location = (-c.x, -c.y, -lo.z + spec.get('lift', 0.0)); bpy.context.view_layer.update()
    lo, hi = world_bounds(new); size = max(hi - lo)
    backdrop(0.0, max(size, 0.35))
    rx0 = lo.x; ry = lo.y - 0.03
    if spec.get('ruler', True): ruler(spec['ruler_tex'], rx0, ry, 0.0)
    # lights: key softbox, fill, rim
    S = max(size, 0.2)
    k = spec.get('light', 1.0) * (S / 0.2) ** 2
    light('key', (S * 1.6, -S * 2.0, S * 2.2), (0, 0, size * 0.3), S * 1.5, 16 * k, (1.0, 0.98, 0.95))
    light('fill', (-S * 2.2, -S * 1.2, S * 1.2), (0, 0, size * 0.3), S * 2.0, 7 * k, (0.95, 0.97, 1.0))
    light('rim', (-S * 0.6, S * 2.4, S * 1.8), (0, 0, size * 0.3), S * 1.2, 14 * k)
    cam_d = bpy.data.cameras.new('cam'); cam = bpy.data.objects.new('cam', cam_d); bpy.context.scene.collection.objects.link(cam); bpy.context.scene.camera = cam
    for v in spec['views']:
        if v.get('fit', 'all') == 'all':
            flo, fhi = lo.copy(), hi.copy()
            if v.get('ruler', False): flo.x = min(flo.x, rx0 - 0.01); fhi.x = max(fhi.x, rx0 + 0.31); flo.y = min(flo.y, ry - 0.016)
        else:
            a = Vector(gv(v['fit'][0])) + pivot.location; b = Vector(gv(v['fit'][1])) + pivot.location
            flo = Vector([min(a[k], b[k]) for k in range(3)]); fhi = Vector([max(a[k], b[k]) for k in range(3)])
            if spec.get('place', {}).get('rot'):
                pts = [pivot.matrix_world @ Vector(gv(p)) for p in (v['fit'][0], v['fit'][1])]
                flo = Vector([min(p[k] for p in pts) for k in range(3)]); fhi = Vector([max(p[k] for p in pts) for k in range(3)])
        ctr = (flo + fhi) / 2
        d = Vector(v['dir']).normalized(); lens = v.get('lens', 60); cam_d.lens = lens; cam_d.sensor_width = 36; cam_d.sensor_fit = 'HORIZONTAL'
        rx_, ry_ = bpy.context.scene.render.resolution_x, bpy.context.scene.render.resolution_y
        th = 18 / lens; tv = th * ry_ / rx_
        zax = d; xax = Vector((0, 0, 1)).cross(zax).normalized(); yax = zax.cross(xax); dist = 0.0
        for k in range(8):
            p = Vector((fhi.x if k & 1 else flo.x, fhi.y if k & 2 else flo.y, fhi.z if k & 4 else flo.z)) - ctr
            dist = max(dist, p.dot(zax) + abs(p.dot(xax)) / th, p.dot(zax) + abs(p.dot(yax)) / tv)
        dist *= v.get('margin', 1.08); cam.location = ctr + d * dist; cam.rotation_euler = (-d).to_track_quat('-Z', 'Y').to_euler()
        cam_d.clip_start = 0.002; cam_d.dof.use_dof = False
        bpy.context.scene.render.filepath = os.path.join(out, '%s_%s.png' % (spec['name'], v['name'])); bpy.ops.render.render(write_still=True)
        print('RENDERED', bpy.context.scene.render.filepath)


if __name__ == '__main__':
    main()
