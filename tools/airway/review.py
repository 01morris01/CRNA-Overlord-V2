"""review.py: lit review renders of the finished airway props, made from the very files the room will load.

   blender -b --factory-startup --python tools/airway/review.py -- OUT REVIEW [more.glb ...]

OUT is assets/models/airway (its airway.json gives the anchors); REVIEW receives, for every .glb:
   <item>_three_quarter.png, <item>_top.png (looking down the room's -Y), <item>_side.png, <item>_back.png, and
   <item>_anchors.png: the anchors as red beads with the room's axes drawn at the origin (X red, Y green, Z blue, 2 cm each);
and scale_bar.png: every piece side by side next to a 20 cm bar marked in centimetres.
Extra .glb paths (candidates that were not accepted) are rendered the same way; their anchors are read from <name>.json beside them.
The bar, beads and axes exist only in these pictures."""
import bpy, json, math, os, sys
from mathutils import Vector, Matrix

def bl(p): return Vector((p[0], -p[2], p[1]))                                    # a point in the room's (glTF) axes -> Blender's
def mat(name, rgb, rough=0.5, emit=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = (*rgb, 1); b.inputs['Roughness'].default_value = rough
    if emit: b.inputs['Emission Color'].default_value = (*rgb, 1); b.inputs['Emission Strength'].default_value = emit
    return m
def box(name, lo, hi, m):
    me = bpy.data.meshes.new(name); v = [(x, y, z) for x in (lo[0], hi[0]) for y in (lo[1], hi[1]) for z in (lo[2], hi[2])]
    me.from_pydata(v, [], [(0, 1, 3, 2), (4, 6, 7, 5), (0, 4, 5, 1), (2, 3, 7, 6), (0, 2, 6, 4), (1, 5, 7, 3)]); me.materials.append(m); o = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(o); return o
def bead(p, r, m):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=p, segments=16, ring_count=8); o = bpy.context.object; o.data.materials.append(m); return o
def bring(path):
    before = set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=path); new = [o for o in bpy.data.objects if o not in before]; bpy.context.view_layer.update(); return new
def extent(objs):
    pts = [o.matrix_world @ Vector(c) for o in objs if o.type == 'MESH' for c in o.bound_box]
    return Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts))), Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
def studio(scene):
    scene.render.engine = 'CYCLES'; scene.cycles.samples = 96; scene.cycles.use_denoising = True; scene.view_settings.view_transform = 'AgX'; scene.view_settings.look = 'AgX - Base Contrast'
    try:
        prefs = bpy.context.preferences.addons['cycles'].preferences; prefs.compute_device_type = 'METAL'; prefs.get_devices()
        for d in prefs.devices: d.use = True
        scene.cycles.device = 'GPU'
    except Exception as e: print('cpu render:', e)
    w = bpy.data.worlds.new('studio'); scene.world = w; w.use_nodes = True; bg = w.node_tree.nodes['Background']; bg.inputs[0].default_value = (0.5, 0.52, 0.55, 1); bg.inputs[1].default_value = 0.7
    for d, e, size in (((0.9, -1.0, 1.5), 2.6, 0.25), ((-1.2, -0.5, 0.9), 0.9, 0.6), ((0.1, 1.0, 0.8), 1.1, 0.6)):
        L = bpy.data.lights.new('sun', 'SUN'); L.energy = e; L.angle = size; o = bpy.data.objects.new('sun', L); scene.collection.objects.link(o); o.rotation_euler = Vector(d).to_track_quat('Z', 'Y').to_euler()
    cam = bpy.data.cameras.new('cam'); cam.lens = 90; co = bpy.data.objects.new('cam', cam); scene.collection.objects.link(co); scene.camera = co; scene.render.resolution_x, scene.render.resolution_y = 1200, 900; return co
def shoot(cam, centre, radius, direction, path, up='Y'):
    """Frame a ball of the given radius about the centre, looking back along the direction."""
    d = Vector(direction).normalized(); dist = radius / math.sin(math.atan(13.5 / cam.data.lens)) * 1.06; cam.data.clip_start = dist * 0.02; cam.data.clip_end = dist * 20; cam.location = centre + d * dist
    cam.rotation_euler = (-d).to_track_quat('-Z', up).to_euler(); bpy.context.scene.render.filepath = path; bpy.ops.render.render(write_still=True)

def one(path, anchors, review):
    """Four pictures of one finished file."""
    bpy.ops.wm.read_factory_settings(use_empty=True); scene = bpy.context.scene; cam = studio(scene); item = os.path.basename(path)[:-4]; objs = bring(path); lo, hi = extent(objs); c = (lo + hi) / 2; size = max(hi - lo); rad = (hi - lo).length / 2
    floor = box('floor', (c.x - size * 12, c.y - size * 12, lo.z - size * 0.02 - 0.0006), (c.x + size * 12, c.y + size * 12, lo.z - 0.0006), mat('floor', (0.3, 0.31, 0.33), 0.9))
    shoot(cam, c, rad, (0.95, -1.15, 0.75), os.path.join(review, item + '_three_quarter.png'))
    shoot(cam, c, rad, (0.0, -0.0001, 1.0), os.path.join(review, item + '_top.png'), up='Y')               # from the room's +Y; the room's -Z (the head end) is at the top of the picture
    shoot(cam, c, rad, (1.0, 0.0, 0.12), os.path.join(review, item + '_side.png'))
    shoot(cam, c, rad, (-0.6, 1.2, 0.5), os.path.join(review, item + '_back.png'))
    red = mat('anchor', (0.9, 0.05, 0.05), 0.4, 1.5); r = max(size * 0.012, 0.0008)
    for name, p in (anchors or {}).items(): bead(bl(p), r, red)
    for axis, rgb in (((1, 0, 0), (0.9, 0.1, 0.1)), ((0, 1, 0), (0.1, 0.7, 0.1)), ((0, 0, 1), (0.1, 0.2, 0.9))):                        # the room's axes, 2 cm long
        a = bl(axis); t = r * 0.45; m = mat('axis', rgb, 0.4, 1.2); lo_ = Vector((min(0, a.x * 0.02) - t, min(0, a.y * 0.02) - t, min(0, a.z * 0.02) - t)); hi_ = Vector((max(0, a.x * 0.02) + t, max(0, a.y * 0.02) + t, max(0, a.z * 0.02) + t)); box('axis', lo_, hi_, m)
    for o in objs:                                                               # see the beads through the piece
        if o.type == 'MESH':
            for m in o.data.materials:
                if m and m.node_tree and m.node_tree.nodes.get('Principled BSDF'): m.node_tree.nodes['Principled BSDF'].inputs['Alpha'].default_value = min(0.45, m.node_tree.nodes['Principled BSDF'].inputs['Alpha'].default_value); m.surface_render_method = 'BLENDED'
    shoot(cam, c, max(rad, 0.03), (0.95, -1.15, 0.75), os.path.join(review, item + '_anchors.png')); print('REVIEWED', item, 'size', [round(v, 4) for v in (hi - lo)])

def together(paths, review):
    """Every piece in a row beside a 20 cm bar."""
    bpy.ops.wm.read_factory_settings(use_empty=True); scene = bpy.context.scene; cam = studio(scene); x = 0.0; top = 0.0
    dark, light = mat('bar_dark', (0.05, 0.05, 0.06), 0.6), mat('bar_light', (0.92, 0.92, 0.9), 0.6)
    for i in range(20): box('bar', (i * 0.01, -0.13, 0.0), ((i + 1) * 0.01, -0.118, 0.004), dark if i % 2 == 0 else light)                       # 20 cm in centimetres
    for i in range(2): box('bar10', (i * 0.1, -0.142, 0.0), ((i + 1) * 0.1, -0.133, 0.004), light if i % 2 == 0 else dark)                      # and in two 10 cm halves
    for p in paths:
        objs = bring(p); lo, hi = extent(objs); roots = [o for o in objs if o.parent is None]
        for o in roots: o.location += Vector((x - lo.x, -(lo.y + hi.y) / 2, -lo.z))
        x += (hi.x - lo.x) + 0.03; top = max(top, hi.z - lo.z)
    box('floor', (-2, -2, -0.01), (3, 2, 0.0), mat('floor', (0.3, 0.31, 0.33), 0.9)); w = max(x - 0.03, 0.2); c = Vector((w / 2, -0.04, top / 3)); scene.render.resolution_x, scene.render.resolution_y = 1500, 900
    shoot(cam, c, Vector((w, 0.24, top)).length / 2, (0.2, -1.0, 0.9), os.path.join(review, 'scale_bar.png')); print('REVIEWED together', len(paths))

if __name__ == '__main__':
    a = sys.argv[sys.argv.index('--') + 1:]; out, review = os.path.abspath(os.path.expanduser(a[0])), os.path.abspath(os.path.expanduser(a[1])); os.makedirs(review, exist_ok=True)
    manifest = json.load(open(os.path.join(out, 'airway.json'))); jobs = [(os.path.join(out, k), v.get('anchors')) for k, v in manifest.items() if k.endswith('.glb')]
    for extra in a[2:]:
        side = extra[:-4] + '.json'; jobs.append((extra, list(json.load(open(side)).values())[0].get('anchors') if os.path.exists(side) else None))
    for path, anchors in jobs: one(path, anchors, review)
    together([p for p, _ in jobs], review)
