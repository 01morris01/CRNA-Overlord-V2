"""review.py: neutral studio pictures of one .glb on a 10 cm grid, for looking at before anything is accepted.

   blender -b --factory-startup --python tools/props/surgical/review.py -- IN.glb OUT_PREFIX [--views three,front,side,top] [--only a,b]
        [--res 1400x1000] [--samples 48] [--close x,y,z,r] [--list] [--az 35] [--el 22] [--dark]

   The file is imported as it will be loaded by the browser (glTF, +Y up, metres), so what is measured here is what ships.
   Floor: a matt plane at the model's lowest point with fine lines every 10 cm and heavier lines every 50 cm; the heavy lines
   cross at the model's own origin. Light: one soft key, a fill, a rim, and a neutral interior panorama for reflections
   (Blender's bundled "interior" studio light). No bloom, no depth of field.
   --list prints every object with its size and triangle count and renders nothing.
   --close adds a view aimed at the point x,y,z (glTF axes) from distance r.
   This makes pictures and prints sizes. It judges nothing."""
import bpy, sys, os, math
from mathutils import Vector

def args():
    a = sys.argv[sys.argv.index('--') + 1:]; pos = [x for x in a if not x.startswith('--')]; o = {'in': pos[0], 'out': pos[1] if len(pos) > 1 else None}
    def opt(k, d=None): return a[a.index(k) + 1] if k in a else d
    o['views'] = opt('--views', 'three,front,side,top').split(','); o['only'] = [s for s in (opt('--only') or '').split(',') if s]; o['res'] = [int(v) for v in opt('--res', '1400x1000').split('x')]
    o['samples'] = int(opt('--samples', '48')); o['close'] = [[float(v) for v in c.split(',')] for c in a[a.index('--close') + 1].split(';')] if '--close' in a else []; o['list'] = '--list' in a
    o['az'] = float(opt('--az', '35')); o['el'] = float(opt('--el', '22')); o['dark'] = '--dark' in a; o['hide'] = [s for s in (opt('--hide') or '').split(',') if s]; return o

def grid_material(dark=False):
    m = bpy.data.materials.new('review_floor'); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']; b.inputs['Roughness'].default_value = 0.9
    tc = nt.nodes.new('ShaderNodeTexCoord'); sep = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(tc.outputs['Object'], sep.inputs[0])
    def lines(axis, step, width):
        d = nt.nodes.new('ShaderNodeMath'); d.operation = 'DIVIDE'; nt.links.new(sep.outputs[axis], d.inputs[0]); d.inputs[1].default_value = step
        sh = nt.nodes.new('ShaderNodeMath'); sh.operation = 'ADD'; nt.links.new(d.outputs[0], sh.inputs[0]); sh.inputs[1].default_value = 0.5
        fr = nt.nodes.new('ShaderNodeMath'); fr.operation = 'FRACT'; nt.links.new(sh.outputs[0], fr.inputs[0])
        ce = nt.nodes.new('ShaderNodeMath'); ce.operation = 'SUBTRACT'; nt.links.new(fr.outputs[0], ce.inputs[0]); ce.inputs[1].default_value = 0.5
        ab = nt.nodes.new('ShaderNodeMath'); ab.operation = 'ABSOLUTE'; nt.links.new(ce.outputs[0], ab.inputs[0])
        lt = nt.nodes.new('ShaderNodeMath'); lt.operation = 'LESS_THAN'; nt.links.new(ab.outputs[0], lt.inputs[0]); lt.inputs[1].default_value = width / step / 2; return lt
    def either(p, q):
        mx = nt.nodes.new('ShaderNodeMath'); mx.operation = 'MAXIMUM'; nt.links.new(p.outputs[0], mx.inputs[0]); nt.links.new(q.outputs[0], mx.inputs[1]); return mx
    fine = either(lines('X', 0.1, 0.0016), lines('Y', 0.1, 0.0016)); heavy = either(lines('X', 0.5, 0.004), lines('Y', 0.5, 0.004))
    base, c1, c2 = ((0.06, 0.065, 0.07, 1), (0.16, 0.17, 0.18, 1), (0.42, 0.44, 0.46, 1)) if dark else ((0.56, 0.57, 0.58, 1), (0.36, 0.37, 0.38, 1), (0.13, 0.14, 0.15, 1))
    m1 = nt.nodes.new('ShaderNodeMixRGB'); m1.inputs[1].default_value = base; m1.inputs[2].default_value = c1; nt.links.new(fine.outputs[0], m1.inputs[0])
    m2 = nt.nodes.new('ShaderNodeMixRGB'); nt.links.new(m1.outputs[0], m2.inputs[1]); m2.inputs[2].default_value = c2; nt.links.new(heavy.outputs[0], m2.inputs[0]); nt.links.new(m2.outputs[0], b.inputs['Base Color']); return m

def main():
    o = args(); bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
    bpy.ops.import_scene.gltf(filepath=o['in']); bpy.context.view_layer.update(); objs = [q for q in bpy.data.objects if q.type == 'MESH']
    if o['only']: objs = [q for q in objs if any(q.name.startswith(n) or any(p.name.startswith(n) for p in parents(q)) for n in o['only'])]
    for q in bpy.data.objects:
        if q.type == 'MESH' and (q not in objs or any(q.name.startswith(n) or any(p.name.startswith(n) for p in parents(q)) for n in o['hide'])): q.hide_render = True; objs = [x for x in objs if x is not q]
    pts = [q.matrix_world @ Vector(c) for q in objs for c in q.bound_box]; lo = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts))); hi = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    size = hi - lo; mid = (lo + hi) / 2; tris = sum(sum(len(p.vertices) - 2 for p in q.data.polygons) for q in objs)
    print('REVIEW %s  size x %.4f  y(up) %.4f  z %.4f m   box lo (%.4f %.4f %.4f) hi (%.4f %.4f %.4f) [glTF axes]   %d triangles in %d meshes' % (os.path.basename(o['in']), size.x, size.z, size.y, lo.x, lo.z, -hi.y, hi.x, hi.z, -lo.y, tris, len(objs)))
    if o['list']:
        for q in sorted(bpy.data.objects, key=lambda q: q.name):
            if q.type == 'MESH':
                p = [q.matrix_world @ Vector(c) for c in q.bound_box]; d = [max(v[i] for v in p) - min(v[i] for v in p) for i in range(3)]; c = [(max(v[i] for v in p) + min(v[i] for v in p)) / 2 for i in range(3)]
                print('  %-42s parent %-28s %7d tris  size %.4f %.4f %.4f  centre %.4f %.4f %.4f  mats %s' % (q.name, q.parent.name if q.parent else '-', sum(len(f.vertices) - 2 for f in q.data.polygons), d[0], d[2], d[1], c[0], c[2], -c[1], [m.name for m in q.data.materials if m]))
            elif q.type == 'EMPTY': print('  %-42s parent %-28s (empty) at %.4f %.4f %.4f' % (q.name, q.parent.name if q.parent else '-', q.matrix_world.translation.x, q.matrix_world.translation.z, -q.matrix_world.translation.y))
        return
    sc.render.engine = 'CYCLES'; sc.cycles.samples = o['samples']; sc.cycles.use_denoising = True; sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Base Contrast'; sc.render.film_transparent = False
    try: pr = bpy.context.preferences.addons['cycles'].preferences; pr.compute_device_type = 'METAL'; pr.get_devices(); [setattr(d, 'use', True) for d in pr.devices]; sc.cycles.device = 'GPU'
    except Exception as e: print('gpu not used', e)
    w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; nt = w.node_tree; bg = nt.nodes['Background']
    exr = os.path.join(bpy.utils.resource_path('LOCAL'), 'datafiles', 'studiolights', 'world', 'interior.exr')
    if os.path.exists(exr):
        t = nt.nodes.new('ShaderNodeTexEnvironment'); t.image = bpy.data.images.load(exr); nt.links.new(t.outputs[0], bg.inputs[0]); bg.inputs[1].default_value = 0.55 if not o['dark'] else 0.3
        lp = nt.nodes.new('ShaderNodeLightPath'); bg2 = nt.nodes.new('ShaderNodeBackground'); bg2.inputs[0].default_value = (0.012, 0.013, 0.015, 1) if o['dark'] else (0.5, 0.51, 0.52, 1); mix = nt.nodes.new('ShaderNodeMixShader')      # the camera sees a plain backdrop; the panorama only lights and reflects
        nt.links.new(lp.outputs['Is Camera Ray'], mix.inputs[0]); nt.links.new(bg.outputs[0], mix.inputs[1]); nt.links.new(bg2.outputs[0], mix.inputs[2]); nt.links.new(mix.outputs[0], nt.nodes['World Output'].inputs[0])
    else: bg.inputs[0].default_value = (0.5, 0.51, 0.52, 1); bg.inputs[1].default_value = 0.6
    R = max(size.length / 2, 0.02); fm = bpy.data.meshes.new('floor'); fl = bpy.data.objects.new('review_floor', fm); sc.collection.objects.link(fl); import bmesh; bm = bmesh.new(); bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=max(4.0, R * 14)); bm.to_mesh(fm); bm.free(); fl.location = (0, 0, lo.z - 0.0004); fm.materials.append(grid_material(o['dark']))
    def lamp(name, kind, energy, loc, sz):
        d = bpy.data.lights.new(name, kind); d.energy = energy; d.size = sz; q = bpy.data.objects.new(name, d); sc.collection.objects.link(q); q.location = loc; q.rotation_euler = (mid - Vector(loc)).to_track_quat('-Z', 'Y').to_euler(); return q
    k = R * R * 55
    lamp('key', 'AREA', 5.5 * k, mid + Vector((-1.6, -2.2, 2.6)) * R, R * 2.2); lamp('fill', 'AREA', 1.6 * k, mid + Vector((2.6, -1.4, 1.0)) * R, R * 3.0); lamp('rim', 'AREA', 3.0 * k, mid + Vector((1.2, 2.6, 2.2)) * R, R * 1.6)
    sc.render.resolution_x, sc.render.resolution_y = o['res']; asp = o['res'][0] / o['res'][1]
    def shoot(name, direction, target=None, radius=None, lens=85, ortho=False):
        cam = bpy.data.cameras.new(name); q = bpy.data.objects.new(name, cam); sc.collection.objects.link(q); tg = target or mid; r = radius or R; d = Vector(direction).normalized()
        if ortho: cam.type = 'ORTHO'; cam.ortho_scale = r * 2.5 * max(1.0, asp * 0.8); dist = r * 6
        else: cam.lens = lens; fov = 2 * math.atan(36 / (2 * lens) / max(asp, 1) * 1.0); dist = r * 1.12 / math.sin(min(fov, 2 * math.atan(36 / (2 * lens) / asp)) / 2)
        q.location = tg + d * dist; q.rotation_euler = (tg - q.location).to_track_quat('-Z', 'Y').to_euler(); cam.clip_start = max(0.001, dist * 0.02); cam.clip_end = dist * 20 + 50; sc.camera = q
        sc.render.filepath = '%s_%s.png' % (o['out'], name); bpy.ops.render.render(write_still=True); print('WROTE', sc.render.filepath)
    az, el = math.radians(o['az']), math.radians(o['el'])
    D = {'three': (math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el), math.sin(el)), 'back': (-math.sin(az) * math.cos(el), math.cos(az) * math.cos(el), math.sin(el)), 'front': (0, -1, 0.05), 'side': (1, 0, 0.05), 'rear': (0, 1, 0.05), 'top': (0, -0.001, 1), 'low': (math.sin(-az) * math.cos(0.1), -math.cos(az) * math.cos(0.1), math.sin(0.1))}
    for v in o['views']:
        if v in D: shoot(v, D[v])
    for i, c in enumerate(o['close']):
        x, y, z, r = c[:4]; a2 = math.radians(c[4]) if len(c) > 4 else az; e2 = math.radians(c[5]) if len(c) > 5 else el
        shoot('close%d' % (i + 1), (math.sin(a2) * math.cos(e2), -math.cos(a2) * math.cos(e2), math.sin(e2)), Vector((x, -z, y)), r)
def parents(q):
    while q.parent: q = q.parent; yield q
main()
