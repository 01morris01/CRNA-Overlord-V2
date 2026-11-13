"""clinical_set.py: the equipment of the operating room and the regional bay.

The principal pieces are professionally made, openly licensed models (CC BY 4.0, credited one by one in
docs/overlord-world/ASSET-LEDGER.md and assets/LICENSES.md), taken from the Objaverse release of each author's upload and
prepared here: brought to real size, stood on the floor facing a known way, cleaned, thinned where they were heavier than a
browser needs, and given plain rectangles where their displays are so that the browser can draw on them. A few fittings that
no open model covered (the ceiling lights and supply arm, draped tables, stools, cabinets, wall panel) come from
tools/clinical_kit.py and are named as such in the ledger.

Nothing here is a working device and nothing is taught from it. Where a source model carried something that would mislead a
nurse anesthesia student (cylinders and flow controls in no recognised colour code) it is set to the United States convention:
oxygen green, nitrous oxide blue, air yellow; sevoflurane yellow, isoflurane purple.

Used by tools/build_institute.py. On its own it renders the two rooms' equipment for a look:
   blender -b --factory-startup --python tools/clinical_set.py -- OBJAVERSE_DIR preview.png"""
import bpy, bmesh, math, os, sys
import numpy as np
from mathutils import Vector, Matrix
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import clinical_kit as kit

SRC = None
SOURCES = {   # uid prefix -> (title, author) for the ledger; every one CC BY 4.0, from sketchfab.com/3d-models/<uid>
    '7ae35c7d': ('Anesthesia_SF Gamicon21', 'DGLENN43'), 'e3a45122': ('Operating Table', 'shashkinv1ad'), '0d4593f4': ('Ultrasound Machine', 'liuuzaki'),
    'aecf349e': ('Gourney - Hospital Bed', 'meeww'), '7b6c0aa0': ('Emergency Cart', 'tutminchai'), '2a0a574f': ('Medical Cart', 'NicolasVB'), '76521e2f': ('IV Pole', 'Mountrise'),
    '295ed50e': ('Bed Curtain and Vital Signs Monitor', 'EDIIIC'), '34f41e23': ('Suction-canister', 'Dwayne.Barnett'), '2971a44d': ('SURGICAL INSTRUMENT', 'ferofluid'),
    '2533ef50': ('(FREE) Wall Clock', 'Ma16.q'), '8423d037': ('Laryngoscope Straight', 'marcomiceli29'), '577ee63d': ('IV Supplies', 'EDIIIC'),
}
PIECES, USED = [], set()

# ------------------------------------------------------------------ bringing a model in
def bring(uid, keep=None, drop=None):
    """Import one source model and return its meshes with every transform baked in, so they share one frame."""
    f = [p for p in os.listdir(SRC) if p.startswith(uid) and p.endswith('.glb')][0]; USED.add(uid)
    before = set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=os.path.join(SRC, f)); new = [o for o in bpy.data.objects if o not in before]; bpy.context.view_layer.update()
    meshes = [(o, o.matrix_world.copy()) for o in new if o.type == 'MESH']; dg = bpy.context.evaluated_depsgraph_get()
    for o, mw in meshes:
        if o.modifiers or o.data.shape_keys:                                   # a hose or bag posed by a skeleton: keep the pose it is shown in, not its straight rest shape
            nm = bpy.data.meshes.new_from_object(o.evaluated_get(dg), preserve_all_data_layers=True, depsgraph=dg); o.modifiers.clear(); o.data = nm
        else: o.data = o.data.copy()
        o.vertex_groups.clear()
    for o, mw in meshes:
        o.parent = None; o.matrix_world = Matrix.Identity(4); o.data.transform(mw)
        if mw.determinant() < 0: o.data.flip_normals()
    for o in new:
        if o.type != 'MESH': bpy.data.objects.remove(o)
    out = []
    for m in {m for o, _ in meshes for m in o.data.materials if m and m.node_tree}:                    # true refraction costs the browser a second pass over the whole scene: thin clear parts are simply see-through
        b = bsdf(m)
        if b and 'Transmission Weight' in b.inputs and (b.inputs['Transmission Weight'].default_value > 0.01 or b.inputs['Transmission Weight'].links):
            for l in list(b.inputs['Transmission Weight'].links): m.node_tree.links.remove(l)
            b.inputs['Transmission Weight'].default_value = 0.0; b.inputs['Alpha'].default_value = 0.2
    for o, _ in meshes:
        mname = o.data.materials[0].name if o.data.materials and o.data.materials[0] else ''
        if (keep and not keep(o.name, mname)) or (drop and drop(o.name, mname)) or not len(o.data.polygons): bpy.data.objects.remove(o)
        else: out.append(o)
    return out
def co(objs):
    a = []
    for o in objs:
        v = np.empty(len(o.data.vertices) * 3, np.float32); o.data.vertices.foreach_get('co', v); a.append(v.reshape(-1, 3))
    return np.concatenate(a) if a else np.zeros((0, 3), np.float32)
def bounds(objs): c = co(objs); return Vector(c.min(axis=0)), Vector(c.max(axis=0))
def xf(objs, M):
    for o in objs:
        o.data.transform(M)
        if M.determinant() < 0: o.data.flip_normals()
def stand(objs, scale=1.0, rz=0.0, centre=True, floor=True, sz=None):
    """Scale, turn about the vertical, centre over the origin and put the lowest point on the floor."""
    S = Matrix.Diagonal((scale, scale, sz if sz is not None else scale, 1)); xf(objs, Matrix.Rotation(rz, 4, 'Z') @ S); lo, hi = bounds(objs)
    xf(objs, Matrix.Translation((-(lo.x + hi.x) / 2 if centre else 0, -(lo.y + hi.y) / 2 if centre else 0, -lo.z if floor else 0)))
def thin(o, ratio):
    if ratio >= 0.999 or len(o.data.polygons) < 400: return
    m = o.modifiers.new('thin', 'DECIMATE'); m.ratio = ratio; dg = bpy.context.evaluated_depsgraph_get(); nm = bpy.data.meshes.new_from_object(o.evaluated_get(dg), preserve_all_data_layers=True, depsgraph=dg); o.modifiers.clear(); o.data = nm
def thin_to(objs, total):
    """Thin a set of meshes toward a triangle total, taking most from the heaviest."""
    tris = [sum(len(p.vertices) - 2 for p in o.data.polygons) for o in objs]; have = sum(tris)
    if have <= total: return
    small = sum(t for t in tris if t < 1500); r = max(0.06, (total - small) / max(1, have - small))
    for o, t in zip(objs, tris):
        if t >= 1500: thin(o, min(1.0, r))
def merge(objs):
    """One mesh per material: a piece should cost a handful of draw calls, not one per bolt."""
    by = {}
    for o in objs: by.setdefault(o.data.materials[0].name if o.data.materials and o.data.materials[0] else '', []).append(o)
    out = []
    for name, group in by.items():
        if len(group) > 1:
            bpy.ops.object.select_all(action='DESELECT')
            for o in group: o.select_set(True)
            bpy.context.view_layer.objects.active = group[0]; bpy.ops.object.join()
        out.append(group[0])
    return out
def loose(o):
    bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); bpy.context.view_layer.objects.active = o; before = set(bpy.data.objects)
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.separate(type='LOOSE'); bpy.ops.object.mode_set(mode='OBJECT'); return [o] + [q for q in bpy.data.objects if q not in before]
def group(name, objs, collide=False, room=None):
    root = bpy.data.objects.new('eq_' + name, None); bpy.context.scene.collection.objects.link(root)
    for i, o in enumerate(objs):
        o.parent = root
        if not o.name.startswith('screen_'): o.name = f'{name}_{i}'
    root['collide'] = collide; PIECES.append(root); return root
def put(root, at, rz=0.0, room=None, collide=None):
    root.location = at; root.rotation_euler = (0, 0, rz)
    if room: root['room'] = room
    if collide is not None: root['collide'] = collide
    return root
def copy(root, name=None):
    """A second copy of a piece that shares its geometry."""
    r = root.copy(); bpy.context.scene.collection.objects.link(r); PIECES.append(r)
    for c in root.children: q = c.copy(); bpy.context.scene.collection.objects.link(q); q.parent = r
    return r
def bsdf(m): return m.node_tree.nodes.get('Principled BSDF')
def tint(m, rgb, rough=None, metal=None):
    b = bsdf(m); b.inputs['Base Color'].default_value = (*rgb, 1)
    for l in list(b.inputs['Base Color'].links): m.node_tree.links.remove(l)
    if rough is not None:
        for l in list(b.inputs['Roughness'].links): m.node_tree.links.remove(l)
        b.inputs['Roughness'].default_value = rough
    if metal is not None:
        for l in list(b.inputs['Metallic'].links): m.node_tree.links.remove(l)
        b.inputs['Metallic'].default_value = metal
def recolour(o, name, rgb, rough=None, metal=None):
    m = o.data.materials[0].copy(); m.name = name; o.data.materials[0] = m; tint(m, rgb, rough, metal); return m
def images(objs):
    out = {}
    for o in objs:
        for m in o.data.materials:
            if not m or not m.node_tree: continue
            b = bsdf(m)
            for n in m.node_tree.nodes:
                if n.type == 'TEX_IMAGE' and n.image: out.setdefault(n.image, set()).add('base' if b and any(l.from_node == n for l in b.inputs['Base Color'].links) else 'other')
    return out
def textures(objs, base=1024, other=512):
    """Bring textures down to what their place in the room needs, and unhook normal maps that carry nothing."""
    for im, roles in images(objs).items():
        want = base if 'base' in roles else other
        if im.size[0] > want: im.scale(want, max(1, int(im.size[1] * want / im.size[0]))); im.pack()
    for o in objs:
        for m in o.data.materials:
            if not m or not m.node_tree: continue
            for n in [n for n in m.node_tree.nodes if n.type == 'NORMAL_MAP' and n.inputs['Color'].links]:
                t = n.inputs['Color'].links[0].from_node
                if t.type == 'TEX_IMAGE' and t.image and t.image.size[0]:
                    w, h = t.image.size; a = np.empty(w * h * 4, np.float32); t.image.pixels.foreach_get(a); a = a.reshape(-1, 4)[::max(1, (w * h) // 20000), :3]
                    if float(a.std(axis=0).max()) < 0.004:
                        for l in list(n.outputs[0].links): m.node_tree.links.remove(l)
def screen_quad(kind, tl, tr, br, bl, lift=0.0015):
    """A rectangle just in front of a model's display, with a plain 0..1 picture on it: the browser draws the display."""
    kit.materials(); P = [Vector(p) for p in (bl, br, tr, tl)]; n = (P[1] - P[0]).cross(P[3] - P[0]).normalized(); bm = bmesh.new(); f = bm.faces.new([bm.verts.new(p + n * lift) for p in P]); uv = bm.loops.layers.uv.new('UV0')
    for l, q in zip(f.loops, ((0, 0), (1, 0), (1, 1), (0, 1))): l[uv].uv = q
    me = bpy.data.meshes.new('screen_' + kind); bm.to_mesh(me); bm.free(); me.materials.append(kit.M['eq_screen']); o = bpy.data.objects.new('screen_' + kind, me); bpy.context.scene.collection.objects.link(o); return o
def fill_holes(rgb, mask):
    """Paint over masked pixels from what surrounds them (coarse to fine)."""
    h, w = mask.shape
    if not mask.any() or min(h, w) < 4: return rgb
    keep = (~mask).astype(np.float32); h2, w2 = h // 2 * 2, w // 2 * 2; wsum = keep[:h2, :w2].reshape(h2 // 2, 2, w2 // 2, 2).sum(axis=(1, 3))
    small = (rgb[:h2, :w2] * keep[:h2, :w2, None]).reshape(h2 // 2, 2, w2 // 2, 2, 3).sum(axis=(1, 3)) / np.maximum(wsum, 1e-6)[:, :, None]; small = fill_holes(small, wsum < 0.5)
    up = np.repeat(np.repeat(small, 2, axis=0), 2, axis=1); full = np.zeros_like(rgb); full[:h2, :w2] = up; full[h2:, :] = rgb[h2:, :]; full[:, w2:] = rgb[:, w2:]; out = rgb.copy(); out[mask] = full[mask]; return out

# ------------------------------------------------------------------ the pieces
def operating_table(top=0.9, length=2.06):
    """The table from shashkinv1ad's operating station (the lights, robot arm and column are not used). Its colour map carried
    red stains: they are painted out, and the rust-brown wear is drawn back toward clean steel. The column is drawn up so the
    pads stand at working height."""
    objs = bring('e3a45122', keep=lambda n, m: m.startswith('Table')); c = co(objs)[:, :2]; c = c - c.mean(axis=0); w, v = np.linalg.eigh(np.cov(c.T)); ax = v[:, int(np.argmax(w))]
    stand(objs, 1.0, math.pi / 2 - math.atan2(float(ax[1]), float(ax[0]))); lo, hi = bounds(objs); stand(objs, length / (hi.y - lo.y)); lo, hi = bounds(objs)
    za, zb, lift = hi.z * 0.36, hi.z * 0.6, top - hi.z                      # the column between the base and the frame under the pads is stretched; everything above it rises
    for o in objs:
        for vtx in o.data.vertices:
            z = vtx.co.z; vtx.co.z = z if z <= za else z + lift * min(1.0, (z - za) / (zb - za))
    for im, roles in images(objs).items():
        if 'base' not in roles: continue
        wd, ht = im.size; a = np.empty(wd * ht * 4, np.float32); im.pixels.foreach_get(a); a = a.reshape(ht, wd, 4); rgb = a[:, :, :3].copy(); r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
        mx, mn = rgb.max(axis=2), rgb.min(axis=2); d = np.maximum(mx - mn, 1e-6); hue = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
        red = ((hue > 252) | (hue < 17)) & ((mx - mn) / np.maximum(mx, 1e-6) > 0.1) & (mx - mn > 0.025)                  # purple through red: nothing on a clean table is that colour
        for _ in range(5): red = red | np.roll(red, 1, 0) | np.roll(red, -1, 0) | np.roll(red, 1, 1) | np.roll(red, -1, 1)
        rgb = fill_holes(rgb, red)
        for _ in range(36): sm = (rgb + np.roll(rgb, 1, 0) + np.roll(rgb, -1, 0) + np.roll(rgb, 1, 1) + np.roll(rgb, -1, 1)) / 5; rgb[red] = sm[red]            # soften what was painted in
        r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]; lum = rgb @ np.array([0.2126, 0.7152, 0.0722], np.float32)
        brown = np.clip(((r - b) - 0.03) / 0.08, 0, 1) * (r >= g) * (g >= b * 0.98)                  # warm, dirty tones: back toward neutral metal, and a little lighter
        rgb = rgb + (np.clip(lum * 1.25 + 0.04, 0, 1)[:, :, None] - rgb) * (brown * 0.85)[:, :, None]; a[:, :, :3] = rgb; im.pixels.foreach_set(a.ravel()); im.pack()
    textures(objs, 1024, 1024); return group('op_table', merge(objs), collide=True)
def anesthesia_machine(scale=0.0085):
    """DGLENN43's anesthesia workstation: flow controls, two vaporizers, absorber, bag and circuit, drawers, a monitor on an arm
    and two cylinders. Its trailing pipeline hoses are left out (they ended on bare floor). Operator at -Y, circuit to the operator's left."""
    objs = bring('7ae35c7d', drop=lambda n, m: n.startswith('Icosphere') or m == 'anesthesia_machine_tubes')
    body = [o for o in objs if o.data.materials[0].name == 'anesthesia_machine_body']; lo, hi = bounds(body); M = Matrix.Diagonal((scale, scale, scale, 1)) @ Matrix.Translation((-(lo.x + hi.x) / 2, -(lo.y + hi.y) / 2, -bounds(objs)[0].z))
    rects = {'monitor': ([-80.7354, -3.131, 194.1157], [-49.3932, -3.3084, 194.1157], [-49.3932, -3.3085, 166.2254], [-80.7354, -3.131, 166.2254]), 'vent': ([14.8097, -8.0003, 190.2497], [32.6209, -8.0002, 190.2497], [32.6209, -8.0003, 172.5766], [14.8097, -8.0003, 172.5766])}
    xf(objs, M); named = {o.name: o for o in objs}
    for o in objs:                                                                                   # colour codes a student would read
        n, m = o.name, o.data.materials[0]
        if n.startswith('Knob_Oxygen'): recolour(o, 'knob_oxygen', (0.03, 0.36, 0.12), 0.42)
        elif n.startswith('Knob_Nitrous'): recolour(o, 'knob_nitrous', (0.04, 0.16, 0.55), 0.42)
        elif n.startswith('Knob_Air'): recolour(o, 'knob_air', (0.78, 0.6, 0.04), 0.42)
        elif n.startswith('Sevoflorane_Valve'): recolour(o, 'dial_sevoflurane', (0.8, 0.62, 0.05), 0.45)
        elif n.startswith('Isoflurane_Valve'): recolour(o, 'dial_isoflurane', (0.36, 0.13, 0.5), 0.45)
    tanks = [o for o in objs if o.name.startswith('Tanks')]
    if tanks:
        parts = loose(tanks[0]); objs += [p for p in parts if p not in objs]; xs = sorted(parts, key=lambda p: -len(p.data.polygons)); big = xs[:2]; mid = sum((bounds([p])[0].x + bounds([p])[1].x) / 2 for p in big) / max(1, len(big))
        o2 = n2o = None
        for p in parts:
            left = (bounds([p])[0].x + bounds([p])[1].x) / 2 < mid
            if left: o2 = o2 or recolour(p, 'cylinder_oxygen', (0.02, 0.2, 0.075), 0.36); p.data.materials[0] = o2
            else: n2o = n2o or recolour(p, 'cylinder_nitrous', (0.02, 0.08, 0.34), 0.36); p.data.materials[0] = n2o
    for m in {o.data.materials[0] for o in objs}:
        if m.name == 'anesthesia_machine_screens_and_dials': tint(m, (0.012, 0.016, 0.022), 0.16, 0.0); bsdf(m).inputs['Emission Strength'].default_value = 0.0      # gauge glass, dark
        if m.name == 'anesthesia_machine_body': tint(m, (0.74, 0.75, 0.73))
        if m.name == 'anesthesia_machine_air_tubes': tint(m, (0.62, 0.74, 0.8))
        if m.name == 'anesthesia_machine_bag_and_tube_pump': tint(m, (0.05, 0.3, 0.2))
    for o in objs:
        if o.name.startswith('Monitor_anesthesia'): bpy.data.objects.remove(o); objs = [q for q in objs if q is not o]; break
    thin_to([o for o in objs if o.data.materials[0].name == 'anesthesia_machine_body'], 60000); thin_to([o for o in objs if o.data.materials[0].name != 'anesthesia_machine_body'], 60000); textures(objs, 1024, 512)
    quads = [screen_quad(k, *[M @ Vector(p) for p in r]) for k, r in rects.items()]; return group('anesthesia_machine', merge(objs) + quads, collide=True)
def ultrasound():
    """liuuzaki's cart ultrasound unit. Operator at -Y. Its two displays are blank in the source; the browser draws them."""
    objs = bring('0d4593f4'); lo, hi = bounds(objs); M = Matrix.Translation((-(lo.x + hi.x) / 2, -(lo.y + hi.y) / 2, -lo.z)); xf(objs, M)
    rects = {'us': ([-0.1703, -0.0052, 1.3732], [0.1743, -0.0052, 1.3732], [0.1743, -0.0052, 1.0781], [-0.1703, -0.0052, 1.0781]), 'us_touch': ([-0.1129, -0.0275, 0.9349], [0.118, -0.0275, 0.9349], [0.118, -0.0995, 0.8127], [-0.1129, -0.0995, 0.8127])}
    thin_to(objs, 52000); textures(objs, 1024, 512); quads = [screen_quad(k, *[M @ Vector(p) for p in r]) for k, r in rects.items()]; return group('ultrasound', merge(objs) + quads, collide=True)
def stretcher(length=2.1):
    """meeww's stretcher (the finer of the pair in the source). Head at +Y, back rest raised."""
    objs = bring('aecf349e', keep=lambda n, m: n in ('Object_4', 'Object_5', 'Object_6', 'Object_7', 'Object_8')); lo, hi = bounds(objs); stand(objs, length / (hi.y - lo.y)); thin_to(objs, 46000)
    for m in {o.data.materials[0] for o in objs}:
        if m.name.startswith('BlueRubber'): tint(m, (0.07, 0.17, 0.3), 0.6, 0.0)
    return group('stretcher', merge(objs), collide=True)
def stretcher_flat(length=2.1, top=0.74):
    """The lighter of meeww's two stretchers, with its back rest laid flat so that a patient can lie supine on it, and raised
    so the mattress top stands at `top`. Head at +Y."""
    objs = bring('aecf349e', keep=lambda n, m: n in ('Object_10', 'Object_11', 'Object_12', 'Object_13', 'Object_14')); lo, hi = bounds(objs); stand(objs, length / (hi.y - lo.y))
    mat = [o for o in objs if o.data.materials[0].name.startswith('BlueRubber')]; c = co(mat); ys = np.linspace(c[:, 1].min(), c[:, 1].max(), 41); prof = np.array([c[(c[:, 1] >= a) & (c[:, 1] <= b_), 2].max() if ((c[:, 1] >= a) & (c[:, 1] <= b_)).any() else np.nan for a, b_ in zip(ys[:-1], ys[1:])]); mid = (ys[:-1] + ys[1:]) / 2
    flat = float(np.nanmedian(prof[:len(prof) // 2])); rise = np.where(prof > flat + 0.035)[0]; rise = rise[rise > len(prof) // 3]
    if len(rise) > 3:                                                                                # find the hinge and the angle of the raised back, then lay everything above the deck back down about that hinge
        k = np.polyfit(mid[rise], prof[rise], 1); ang = math.atan(k[0]); yh = (flat - k[1]) / k[0]; deck = flat - 0.16
        for o in objs:
            for v in o.data.vertices:
                if v.co.y > yh and v.co.z > deck:
                    dy, dz = v.co.y - yh, v.co.z - flat; w = min(1.0, (v.co.y - yh) / 0.06); ca, sa = math.cos(-ang * w), math.sin(-ang * w); v.co.y = yh + dy * ca - dz * sa; v.co.z = flat + dy * sa + dz * ca
        print('STRETCHER back rest laid flat: hinge y %.2f, angle %.1f deg' % (yh, math.degrees(ang)))
    lo, hi = bounds(mat); lift = top - hi.z
    if abs(lift) > 0.005:                                                                             # raise the deck on its lifts: everything above the base moves, the columns stretch
        zb = hi.z * 0.42
        for o in objs:
            for v in o.data.vertices: v.co.z += lift * min(1.0, max(0.0, (v.co.z - zb * 0.75) / (zb * 0.25)))
    for m in {o.data.materials[0] for o in objs}:
        if m.name.startswith('BlueRubber'): tint(m, (0.1, 0.22, 0.36), 0.6, 0.0)
    for o in objs: o.data.update()
    return group('stretcher_flat', merge(objs), collide=True)
def emergency_cart(scale=0.56):
    objs = bring('7b6c0aa0'); stand(objs, scale); thin_to(objs, 42000); return group('emergency_cart', merge(objs), collide=True)
def supply_cart():
    objs = bring('2a0a574f'); stand(objs, 0.01); textures(objs, 512, 512); return group('supply_cart', merge(objs), collide=True)
def iv_poles():
    """Mountrise's two poles (one carries a bag): returned as two pieces."""
    objs = bring('76521e2f'); lo, hi = bounds(objs); stand(objs, 2.02 / (hi.z - lo.z), centre=False); parts = loose(objs[0]); mid = sum((bounds([p])[0].y + bounds([p])[1].y) / 2 * len(p.data.polygons) for p in parts) / sum(len(p.data.polygons) for p in parts)
    textures(parts, 512, 512); out = []; near = [(bounds([p])[0].y + bounds([p])[1].y) / 2 < mid for p in parts]; sides = [[p for p, n in zip(parts, near) if n == side] for side in (True, False)]
    for k, g in enumerate(sides):
        if not g: continue
        stand(g, 1.0); out.append(group(f'iv_pole_{k}', merge(g), collide=True))
    return out
def curtain_bay(width=2.6, depth=2.7, ceiling=3.0):
    """EDIIIC's ceiling track with its two side curtains (the front curtain is left out, so the bay stays open to view).
    Open end at -Y (the head wall), the track's rods reach the ceiling."""
    objs = bring('295ed50e', keep=lambda n, m: n not in ('defaultMaterial', 'defaultMaterial.001')); lo, hi = bounds(objs)
    front = [o for o in objs if bounds([o])[1].y < lo.y + (hi.y - lo.y) * 0.08 and bounds([o])[0].z < hi.z * 0.9]                 # the curtain across the foot, and its hooks
    for o in front: bpy.data.objects.remove(o)
    objs = [o for o in objs if o not in front]; lo, hi = bounds(objs); xf(objs, Matrix.Rotation(math.pi, 4, 'Z') @ Matrix.Diagonal((width / (hi.x - lo.x), depth / (hi.y - lo.y), ceiling / hi.z, 1)))
    lo, hi = bounds(objs); xf(objs, Matrix.Translation((-(lo.x + hi.x) / 2, -lo.y, 0))); textures(objs, 512, 512); return group('curtain_bay', merge(objs))
def vitals_monitor(scale=0.3):
    objs = bring('295ed50e', keep=lambda n, m: n in ('defaultMaterial', 'defaultMaterial.001')); stand(objs, scale); return group('vitals_monitor', merge(objs), collide=True)
def suction():
    """Dwayne.Barnett's wall suction set: regulator, canister, tubing and tip. Its back is at y = 0 and it looks toward -Y."""
    objs = bring('34f41e23'); xf(objs, Matrix.Rotation(math.pi, 4, 'Z')); lo, hi = bounds(objs); back = [o for o in objs if o.name.startswith('outletBack')]; y1 = bounds(back)[1].y if back else hi.y
    xf(objs, Matrix.Translation((-(lo.x + hi.x) / 2, -y1, -(lo.z + hi.z) / 2))); thin_to(objs, 16000); return group('suction', merge(objs))
def instruments():
    objs = bring('2971a44d'); xf(objs, Matrix.Rotation(-math.pi / 2, 4, 'X')); stand(objs, 1.0); thin_to(objs, 5000); textures(objs, 512, 512); return group('instruments', merge(objs))
def clock(d=0.34):
    objs = bring('2533ef50'); lo, hi = bounds(objs); s = d / (hi.x - lo.x); xf(objs, Matrix.Diagonal((s, s, s, 1))); lo, hi = bounds(objs); xf(objs, Matrix.Translation((-(lo.x + hi.x) / 2, -hi.y, -(lo.z + hi.z) / 2))); objs = merge(objs); thin_to(objs, 3500); textures(objs, 512, 512); return group('clock', objs)
def laryngoscope():
    objs = bring('8423d037'); xf(objs, Matrix.Rotation(math.pi / 2, 4, 'Y')); stand(objs, 0.72); textures(objs, 512, 512); return group('laryngoscope', merge(objs))
def syringes():
    """Two syringes from EDIIIC's IV supplies, laid flat."""
    objs = bring('577ee63d', keep=lambda n, m: n.startswith('Pusher') or n.startswith('Tube_All')); xf(objs, Matrix.Rotation(math.pi / 2, 4, 'Y')); stand(objs, 0.65); textures(objs, 512, 512); return group('syringe', merge(objs))

# ------------------------------------------------------------------ the two rooms
OR_TABLE, OR_HEAD = (8.6, 15.6), (8.6, 16.63)
PREOP_BAYS = ((-9.3, True), (-6.4, True), (-9.3, False), (-6.4, False))      # (centre x, against the north wall?) for bays 1 to 4
STRETCHER_TOP = 0.74
def build(src):
    """Stand everything in the level (Blender axes: +X east, +Y north). Returns pieces, lamps for the bake, and screens."""
    global SRC; SRC = src; kit.materials(); k0 = len(kit.PIECES); lamps = []
    # ---- operating room: x 4.9..12, y 11.5..19.6. Table north-south, head to the north; anesthesia at the head.
    put(operating_table(), (*OR_TABLE, 0), -0.1306, 'or')                                                    # the model's top is swivelled 7.5 degrees on its column: turned back so the pads lie along the room and under the patient
    am = put(anesthesia_machine(), (6.95, 17.45, 0), 1.2217, 'or')                                             # west of the head, facing the anesthetist; its circuit side toward the patient
    am2 = copy(am)                                                                                              # the endoscopy suite's machine: copied before the small things are laid on the first one
    poles = iv_poles(); put(poles[0], (9.98, 16.72, 0), 0.6, 'or')
    put(emergency_cart(), (11.25, 18.95, 0), 0.0, 'or'); cart = supply_cart(); put(cart, (9.9, 17.6, 0), math.pi / 2, 'or')      # the anesthesia cart, at the anesthetist's left hand
    put(suction(), (6.15, 19.578, 1.42), 0.0, 'or'); put(clock(), (10.9, 19.578, 2.42), 0.0, 'or')
    tools = instruments(); put(tools, (10.42, 12.62, 0.925), 0.25, 'or'); t2 = copy(tools); put(t2, (10.98, 12.55, 0.925), 3.3, 'or')
    for small, at, rz in ((laryngoscope(), (0.42, -0.225, 0.789), -math.pi / 2), (syringes(), (0.56, -0.2, 0.903), math.pi / 2)):      # on the machine's worktop (measured: top at 0.903, front edge at 0.31) and moving with it; the laryngoscope's handle rests on the top with its blade hanging over the front edge
        PIECES.remove(small); small.parent = am; small.location = at; small.rotation_euler = (0, 0, rz)
    g, heads = kit.surgical_lights((8.6, 15.35, 2.886), [(8.6, 16.05, 0.98), (8.6, 15.05, 0.98)], reach=((-0.85, 0.35), (0.8, -0.3))); g['room'] = 'or'
    for hp, tg in heads: lamps.append({'kind': 'SPOT', 'at': tuple(hp + (tg - hp).normalized() * 0.06), 'to': tuple(tg), 'power': 300, 'color': (1.0, 0.985, 0.95), 'size': 0.28, 'spot': 34, 'blend': 0.55, 'dyn': True})
    kit.pendant((10.75, 15.1, 3.0), (-0.72, 0.18))['room'] = 'or'
    kit.back_table((10.7, 12.6, 0), 0.0, w=1.5, d=0.7, h=0.9)['room'] = 'or'; kit.mayo_stand((9.75, 13.55, 0), 2.6)['room'] = 'or'
    kit.stool((8.7, 18.55, 0))['room'] = 'or'; kit.stool((5.45, 16.6, 0), 0.4)['room'] = 'or'; kit.kick_bucket((9.6, 12.9, 0))['room'] = 'or'      # clear of the ways round the table
    kit.wall_cabinet((11.795, 13.0, 0), -math.pi / 2)['room'] = 'or'; kit.wall_cabinet((11.795, 13.95, 0), -math.pi / 2)['room'] = 'or'
    kit.control_panel((11.968, 17.6, 1.4), -math.pi / 2)['room'] = 'or'; kit.sharps_wall((11.968, 18.45, 1.25), -math.pi / 2)['room'] = 'or'
    # ---- regional bay: x -11.5..-4.9, y 12..18.5. A curtained bay against the south wall, head to the wall.
    put(curtain_bay(), (-8.9, 12.03, 0), 0.0, 'regional'); put(stretcher(), (-8.9, 13.42, 0), math.pi, 'regional')
    put(ultrasound(), (-10.0, 13.3, 0), 1.3, 'regional')                                               # across the stretcher from the operator, screen toward them
    put(vitals_monitor(), (-8.05, 12.45, 0), 3.4, 'regional')
    if len(poles) > 1: put(poles[1], (-9.6, 12.38, 0), 0.3, 'regional')
    c2 = copy(cart); put(c2, (-6.85, 12.62, 0), 0.0, 'regional'); kit.stool((-7.85, 13.55, 0), 0.0, 0.52, 'eq_pad_blue')['room'] = 'regional'
    s2 = copy(PIECES[[p.name for p in PIECES].index('eq_suction')]); put(s2, (-10.05, 12.052, 1.62), math.pi, 'regional')
    # ---- endoscopy suite: x 5.4..11.9, y 20..26.4. A flat stretcher north-south with the head to the north, as in the operating room; the machine at the head on the patient's right.
    us0 = PIECES[[p.name for p in PIECES].index('eq_ultrasound')]; mon0 = PIECES[[p.name for p in PIECES].index('eq_vitals_monitor')]; suc0 = PIECES[[p.name for p in PIECES].index('eq_suction')]; flat = stretcher_flat()
    put(flat, (8.6, 23.2, 0), 0.0, 'endo'); put(am2, (6.95, 25.05, 0), 1.2217, 'endo'); put(copy(cart), (9.9, 25.2, 0), math.pi / 2, 'endo'); put(copy(mon0), (10.35, 24.2, 0), 2.2, 'endo'); put(copy(suc0), (8.0, 26.378, 1.42), 0.0, 'endo')
    kit.stool((9.75, 22.2, 0), 0.0, 0.52, 'eq_pad_blue')['room'] = 'endo'; kit.iv_pole((7.45, 22.2, 0), 0.4)['room'] = 'endo'; kit.sharps_wall((11.868, 25.6, 1.25), -math.pi / 2)['room'] = 'endo'; kit.control_panel((11.868, 24.6, 1.4), -math.pi / 2)['room'] = 'endo'
    # ---- labour room: x -11.9..-5.4, y 20..26.4. The bed against the oak head wall on the north side, head to the wall.
    put(copy(PIECES[[p.name for p in PIECES].index('eq_stretcher')]), (-8.9, 25.2, 0), 0.0, 'labor'); put(copy(mon0), (-7.5, 25.9, 0), 3.6, 'labor'); put(copy(cart), (-10.4, 22.6, 0), 0.0, 'labor')
    kit.stool((-8.9, 22.9, 0), 0.0, 0.5, 'eq_pad_blue')['room'] = 'labor'; kit.iv_pole((-10.2, 25.7, 0), 0.4)['room'] = 'labor'; kit.sharps_wall((-5.432, 23.2, 1.25), math.pi / 2)['room'] = 'labor'
    # ---- procedure room: x 4.9..9, y -3.6..2.4. A flat stretcher with the head to the north and room to stand behind it; ultrasound at the patient's right hip, in the operator's line of sight.
    put(copy(flat), (6.95, -0.9, 0), 0.0, 'procedure'); put(copy(us0), (5.75, -1.75, 0), -0.6, 'procedure'); put(copy(mon0), (8.25, 0.55, 0), 2.6, 'procedure'); put(copy(cart), (8.0, 1.55, 0), math.pi, 'procedure')
    kit.stool((6.95, 1.0, 0), 0.0, 0.52, 'eq_pad_blue')['room'] = 'procedure'; kit.iv_pole((8.2, -0.3, 0), 0.4)['room'] = 'procedure'; kit.sharps_wall((8.968, -0.6, 1.25), -math.pi / 2)['room'] = 'procedure'
    # ---- pre-op holding: x -10.7..-4.9, y 2.6..9.6. Four curtained bays, two against the north wall and two against the south, each with a flat stretcher.
    bay0 = PIECES[[p.name for p in PIECES].index('eq_curtain_bay')]; flat = copy(flat); first = True
    for i, (cx, north) in enumerate(PREOP_BAYS):
        wall, sy = (9.58, -1) if north else (2.62, 1); put(copy(bay0), (cx, wall, 0), math.pi if north else 0.0, 'preop')
        put(flat if first else copy(flat), (cx, wall + sy * 1.32, 0), 0.0 if north else math.pi, 'preop'); first = False
        if i % 2 == 0: put(copy(mon0), (cx + 0.95, wall + sy * 0.45, 0), (0.4 if north else 3.5), 'preop')
        kit.stool((cx - 0.95, wall + sy * 1.5, 0), 0.0, 0.5, 'eq_pad_blue')['room'] = 'preop'
    for p in kit.PIECES[k0:]:
        if 'collide' not in p.keys(): p['collide'] = p.name.split('.')[0] in ('eq_back_table', 'eq_mayo_stand', 'eq_stool', 'eq_kick_bucket', 'eq_cabinet')
    return PIECES + kit.PIECES[k0:], lamps
def colliders(pieces):
    """Floor footprints for the walker, from each standing piece's real outline (Blender axes)."""
    out = []; bpy.context.view_layer.update()
    for r in pieces:
        if not r.get('collide'): continue
        pts = [c.matrix_world @ Vector(b) for c in r.children_recursive if c.type == 'MESH' for b in c.bound_box]
        if not pts: continue
        x0, x1, y0, y1, z1 = min(p.x for p in pts), max(p.x for p in pts), min(p.y for p in pts), max(p.y for p in pts), max(p.z for p in pts); pad = 0.04
        out.append([round(x0 + pad, 3), round(y0 + pad, 3), round(x1 - pad, 3), round(y1 - pad, 3), 0, round(min(z1, 1.9), 2)])
    return out
def tris(pieces): return {r.name: sum(sum(len(p.vertices) - 2 for p in c.data.polygons) for c in r.children_recursive if c.type == 'MESH') for r in pieces}

if __name__ == '__main__':
    a = sys.argv[sys.argv.index('--') + 1:]; bpy.ops.wm.read_factory_settings(use_empty=True); scene = bpy.context.scene; pieces, lamps = build(a[0]); t = tris(pieces); print('PIECES', len(pieces), 'tris', sum(t.values())); print({k: v for k, v in sorted(t.items(), key=lambda q: -q[1])}); print('COLLIDERS', colliders(pieces))
    if len(a) > 1:
        scene.render.engine = 'CYCLES'; scene.cycles.samples = 128; scene.cycles.use_denoising = True; scene.view_settings.view_transform = 'AgX'; scene.view_settings.look = 'AgX - Medium High Contrast'
        try: prefs = bpy.context.preferences.addons['cycles'].preferences; prefs.compute_device_type = 'METAL'; prefs.get_devices(); scene.cycles.device = 'GPU'
        except Exception: pass
        w = bpy.data.worlds.new('w'); scene.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs[0].default_value = (0.5, 0.56, 0.62, 1); w.node_tree.nodes['Background'].inputs[1].default_value = 0.25
        kit.pbr('floor', (0.1, 0.12, 0.15), 0.28); fm = bpy.data.meshes.new('f'); bm = bmesh.new(); bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=40); bm.to_mesh(fm); bm.free(); fm.materials.append(kit.M['floor']); scene.collection.objects.link(bpy.data.objects.new('f', fm))
        for (loc, e, sz) in (((8.6, 15.6, 2.95), 500, 3.0), ((6.5, 13, 2.9), 200, 1.5), ((-8.9, 14.2, 2.95), 600, 3.0), ((-6.5, 16, 2.9), 250, 2.0)):
            d = bpy.data.lights.new('l', 'AREA'); d.energy = e; d.size = sz; lo = bpy.data.objects.new('l', d); scene.collection.objects.link(lo); lo.location = loc
        for l in lamps:
            d = bpy.data.lights.new('s', 'SPOT'); d.energy = l['power'] * 3; d.spot_size = math.radians(l['spot']); d.spot_blend = l['blend']; so = bpy.data.objects.new('s', d); scene.collection.objects.link(so); so.location = l['at']; so.rotation_euler = (Vector(l['to']) - Vector(l['at'])).to_track_quat('-Z', 'Y').to_euler()
        views = {'or_door': ((5.6, 12.6, 1.62), (8.9, 16.2, 1.0), 22), 'or_work': ((8.6, 18.25, 1.62), (8.5, 15.4, 0.95), 22), 'or_anes': ((9.4, 18.6, 1.55), (7.5, 17.3, 1.0), 30), 'or_east': ((11.3, 17.5, 1.6), (8.2, 15.2, 0.9), 22),
                 'reg_door': ((-5.7, 16.9, 1.62), (-9.0, 13.3, 0.95), 22), 'reg_us': ((-8.1, 14.6, 1.55), (-9.9, 13.0, 1.05), 30), 'reg_bay': ((-8.9, 16.4, 1.6), (-8.9, 12.6, 1.0), 24)}
        for k, (loc, tgt, lens) in views.items():
            cam = bpy.data.cameras.new(k); cam.lens = lens; co_ = bpy.data.objects.new(k, cam); scene.collection.objects.link(co_); co_.location = loc; co_.rotation_euler = (Vector(tgt) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler(); scene.camera = co_
            scene.render.resolution_x, scene.render.resolution_y = 1100, 700; scene.render.filepath = a[1].replace('.png', f'_{k}.png'); bpy.ops.render.render(write_still=True)
