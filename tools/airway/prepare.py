"""prepare.py: turn openly licensed source models into the small props the operating room puts on the patient.

Every piece here starts from somebody's professionally made upload (CC BY 4.0, fetched by tools/airway/fetch_models.py) and is
only prepared: the wanted part is taken out of its source, brought to real size in metres, turned to the room's convention,
cleaned, thinned where it is heavier than a browser needs, and given the points ("anchors") the room attaches things to.
Nothing is modelled from primitives. tools/airway/finish.py then compresses the result and writes airway.json.

   blender -b --factory-startup --python tools/airway/prepare.py -- SOURCES WORK [item ...]
   blender -b --factory-startup --python tools/airway/prepare.py -- SOURCES WORK --recipe recipe.json

SOURCES is the fetch directory (SOURCES/<uid>/<uid>.glb), WORK receives <item>.raw.glb and <item>.meta.json.
Items: spo2_probe, nibp_cuff (accepted), y_splitter (a candidate that was not accepted: see airway.json "not_found").

The room's convention (glTF axes, +Y up): the patient lies supine, face toward +Y, top of the head toward -Z, feet toward +Z.
Inside this file the work is done in Blender's axes (Z up); gl() and bl() convert: glTF (x, y, z) = Blender (x, z, -y).

--recipe prepares a face mask (anesthesia or oxygen) from a model that had to be downloaded by its owner, for example one of the
"needs_sign_in" entries in airway.json. The recipe is a JSON object:
   {"item": "mask", "source": "/path/model.glb", "uid": "...", "keep": "regex over object, parent and material names",
    "drop": "regex", "up": "+Z", "nose": "+Y", "length": 0.125, "clear": "regex over material names", "alpha": 0.38, "budget": 8000}
"up" is the source direction the port points along and "nose" the source direction of the narrow (nose-bridge) end, each one of
+X -X +Y -Y +Z -Z in Blender's axes as tools/airway/look.py prints and draws them; "length" is nose to chin in metres."""
import bpy, bmesh, json, math, os, re, sys
import numpy as np
from mathutils import Vector, Matrix

SOURCES = WORK = None
AXES = {'+X': (1, 0, 0), '-X': (-1, 0, 0), '+Y': (0, 1, 0), '-Y': (0, -1, 0), '+Z': (0, 0, 1), '-Z': (0, 0, -1)}

def gl(v): return [round(float(v[0]), 5), round(float(v[2]), 5), round(float(-v[1]), 5)]          # a Blender point in the room's (glTF) axes
def bl(x, y, z): return Vector((x, -z, y))                                                        # a glTF direction or point in Blender's axes
def source(uid): return os.path.join(SOURCES, uid, uid + '.glb')
def bsdf(m): return m.node_tree.nodes.get('Principled BSDF') if m and m.node_tree else None

# ------------------------------------------------------------------ bringing a model in
def bring(path, keep=None, drop=None):
    """Import one source model and return its meshes with every transform baked in, so they share one frame.
    A mesh posed by a skeleton or by shape keys keeps the pose it is shown in, not its straight rest shape."""
    before = set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=path); new = [o for o in bpy.data.objects if o not in before]
    bpy.context.view_layer.update(); dg = bpy.context.evaluated_depsgraph_get(); meshes = [(o, o.matrix_world.copy()) for o in new if o.type == 'MESH']
    for o, mw in meshes:
        if o.modifiers or o.data.shape_keys:
            nm = bpy.data.meshes.new_from_object(o.evaluated_get(dg), preserve_all_data_layers=True, depsgraph=dg); o.modifiers.clear(); o.data = nm
        else: o.data = o.data.copy()
        o.vertex_groups.clear()
    names = {o: ' '.join([o.name, o.parent.name if o.parent else ''] + [m.name for m in o.data.materials if m]) for o, _ in meshes}
    for o, mw in meshes:
        o.parent = None; o.matrix_world = Matrix.Identity(4); o.data.transform(mw)
        if mw.determinant() < 0: o.data.flip_normals()
    for o in new:
        if o.type != 'MESH': bpy.data.objects.remove(o)
    for a in list(bpy.data.actions): bpy.data.actions.remove(a)
    out = []
    for o, _ in meshes:
        if (keep and not re.search(keep, names[o])) or (drop and re.search(drop, names[o])) or not len(o.data.polygons): bpy.data.objects.remove(o)
        else: out.append(o)
    for m in {m for o in out for m in o.data.materials if bsdf(m)}:                 # true refraction costs the browser a second pass over the whole scene
        b = bsdf(m); t = b.inputs.get('Transmission Weight')
        if t is not None and (t.default_value > 0.01 or t.links):
            for l in list(t.links): m.node_tree.links.remove(l)
            t.default_value = 0.0; m['was_transmissive'] = True
    return out

def co(objs):
    a = []
    for o in objs:
        v = np.empty(len(o.data.vertices) * 3, np.float32); o.data.vertices.foreach_get('co', v); a.append(v.reshape(-1, 3))
    return np.concatenate(a) if a else np.zeros((0, 3), np.float32)
def bounds(objs): c = co(objs); return Vector(c.min(axis=0)), Vector(c.max(axis=0))
def tris(objs): return sum(len(p.vertices) - 2 for o in objs for p in o.data.polygons)
def xf(objs, M):
    for o in objs:
        o.data.transform(M)
        if M.determinant() < 0: o.data.flip_normals()
        o.data.update()
def activate(o):
    bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); bpy.context.view_layer.objects.active = o
def loose(o):
    """Split a mesh into its unconnected pieces (a glTF source is already split along its texture seams and hard edges)."""
    activate(o); before = set(bpy.data.objects); bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.separate(type='LOOSE'); bpy.ops.object.mode_set(mode='OBJECT'); return [o] + [q for q in bpy.data.objects if q not in before]
def join(objs, name):
    if len(objs) > 1:
        bpy.ops.object.select_all(action='DESELECT')
        for o in objs: o.select_set(True)
        bpy.context.view_layer.objects.active = objs[0]; bpy.ops.object.join()
    objs[0].name = name; objs[0].data.name = name; return objs[0]
def by_material(objs, prefix):
    """One mesh per material: a prop should cost a handful of draw calls."""
    groups = {}
    for o in objs: groups.setdefault(o.data.materials[0].name if o.data.materials and o.data.materials[0] else 'plain', []).append(o)
    return [join(g, re.sub(r'[^a-z0-9]+', '_', k.lower()).strip('_') if k.lower().startswith(prefix) else prefix + '_' + re.sub(r'[^a-z0-9]+', '_', k.lower()).strip('_')) for k, g in groups.items()]
def thin(o, ratio):
    if ratio >= 0.999 or len(o.data.polygons) < 300: return
    m = o.modifiers.new('thin', 'DECIMATE'); m.ratio = ratio; dg = bpy.context.evaluated_depsgraph_get()
    nm = bpy.data.meshes.new_from_object(o.evaluated_get(dg), preserve_all_data_layers=True, depsgraph=dg); o.modifiers.clear(); o.data = nm
def thin_to(objs, total):
    have = tris(objs)
    if have > total:
        for o in objs: thin(o, total / have)
def soften(o, levels=1, angle=50):
    """Round a faceted low-polygon piece: weld the seams the source's exporter split, pair its triangles back into quads,
    subdivide, and shade smooth. Texture coordinates follow."""
    activate(o); bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.remove_doubles(threshold=1e-5)
    bpy.ops.mesh.tris_convert_to_quads(face_threshold=0.7, shape_threshold=0.7, uvs=True, sharp=False, materials=True); bpy.ops.object.mode_set(mode='OBJECT')
    m = o.modifiers.new('soften', 'SUBSURF'); m.levels = m.render_levels = levels; m.uv_smooth = 'PRESERVE_BOUNDARIES'; m.boundary_smooth = 'PRESERVE_CORNERS'
    bpy.ops.object.modifier_apply(modifier='soften'); bpy.ops.object.shade_smooth_by_angle(angle=math.radians(angle))
def frame(up, nose):
    """The rotation that takes a source's 'up' to Blender +Z (glTF +Y) and its 'nose' to Blender +Y (glTF -Z)."""
    u, n = Vector(AXES[up]), Vector(AXES[nose]); s = n.cross(u)                 # s -> +X keeps the turn a proper rotation
    return Matrix((s, n, u)).to_4x4()
def plain(name, rgb, rough=0.5, metal=0.0, alpha=1.0):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = bsdf(m); b.inputs['Base Color'].default_value = (*rgb, 1); b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal; b.inputs['Alpha'].default_value = alpha
    if alpha < 1: m.surface_render_method = 'BLENDED'
    return m
def see_through(m, alpha):
    """Clear plastic for the browser: plain alpha blending, no refraction; the name carries the word 'clear'."""
    b = bsdf(m)
    for l in list(b.inputs['Alpha'].links): m.node_tree.links.remove(l)
    b.inputs['Alpha'].default_value = alpha; m.surface_render_method = 'BLENDED'; m.use_backface_culling = False
    if 'clear' not in m.name.lower(): m.name = 'clear_' + m.name
def crop_textures(o, pad=6):
    """Cut the object's images down to the part of them its faces use, and move the UVs to match (a part taken out of a set
    would otherwise ship the whole set's texture sheet)."""
    me = o.data; uv = me.uv_layers.active
    if uv is None: return
    a = np.empty(len(uv.data) * 2, np.float32); uv.data.foreach_get('uv', a); a = a.reshape(-1, 2)
    if a.min() < -1e-4 or a.max() > 1 + 1e-4: return                             # tiled UVs: leave alone
    images = {n.image for m in me.materials if m and m.node_tree for n in m.node_tree.nodes if n.type == 'TEX_IMAGE' and n.image}
    if not images or len({tuple(i.size) for i in images}) != 1: return
    w, h = next(iter(images)).size; x0 = max(0, int(a[:, 0].min() * w) - pad); x1 = min(w, int(math.ceil(a[:, 0].max() * w)) + pad)
    y0 = max(0, int(a[:, 1].min() * h) - pad); y1 = min(h, int(math.ceil(a[:, 1].max() * h)) + pad)
    if (x1 - x0) * (y1 - y0) > 0.8 * w * h: return
    for im in images:
        px = np.empty(w * h * 4, np.float32); im.pixels.foreach_get(px); px = px.reshape(h, w, 4)[y0:y1, x0:x1].copy()
        im.scale(x1 - x0, y1 - y0); im.pixels.foreach_set(px.ravel()); im.pack()
    a[:, 0] = (a[:, 0] * w - x0) / (x1 - x0); a[:, 1] = (a[:, 1] * h - y0) / (y1 - y0); uv.data.foreach_set('uv', a.ravel()); me.update()
    return [x0, y0, x1, y1]

def export(item, objs, meta):
    """Write WORK/<item>.raw.glb with one root node named after the item, and WORK/<item>.meta.json beside it."""
    root = bpy.data.objects.new(item, None); bpy.context.scene.collection.objects.link(root)
    for o in objs: o.parent = root
    bpy.ops.object.select_all(action='DESELECT'); root.select_set(True)
    for o in objs: o.select_set(True)
    bpy.context.view_layer.objects.active = root
    bpy.ops.export_scene.gltf(filepath=os.path.join(WORK, item + '.raw.glb'), export_format='GLB', use_selection=True, export_yup=True, export_apply=True,
                              export_animations=False, export_cameras=False, export_lights=False, export_extras=False, export_skins=False, export_morph=False)
    lo, hi = bounds(objs); meta = dict(meta, item=item, triangles_before_finish=tris(objs), size=[round(v, 4) for v in (hi.x - lo.x, hi.z - lo.z, hi.y - lo.y)],
                                        box=[gl((lo.x, hi.y, lo.z)), gl((hi.x, lo.y, hi.z))], materials=sorted({m.name for o in objs for m in o.data.materials if m}))
    json.dump(meta, open(os.path.join(WORK, item + '.meta.json'), 'w'), indent=1, ensure_ascii=False); print('PREPARED', item, json.dumps(meta, ensure_ascii=False))

# ------------------------------------------------------------------ the pieces
def spo2_probe(length=0.058):
    """Nofil.Khan's fingertip pulse oximeter. It is a self-contained consumer unit with its own display, not the cabled clip
    sensor of an anesthesia monitor: the display picture (a fixed 98 % / 70 bpm) is replaced by dark glass so it cannot
    contradict the room's monitor. Finger channel along Z, the finger enters from -Z, display toward +Y."""
    objs = bring(source('e3ad5ac95aed4546bb869fcd984a7a99'))
    xf(objs, Matrix.Rotation(math.pi, 4, 'Z'))                                   # in the source the wide mouth faces -Y; the finger must enter from Blender +Y, which is the room's -Z
    lo, hi = bounds(objs); s = length / (hi.y - lo.y); xf(objs, Matrix.Diagonal((s, s, s, 1)))
    pads = [o for o in objs if o.data.materials[0].name == 'M_DeviceBlue']; plo, phi = bounds(pads); zs = sorted((bounds([p])[0].z + bounds([p])[1].z) / 2 for p in pads)
    xf(objs, Matrix.Translation((-(plo.x + phi.x) / 2, -(plo.y + phi.y) / 2, -(zs[0] + zs[-1]) / 2)))       # origin: middle of the channel between the two pads
    glass = plain('spo2_screen_off', (0.012, 0.014, 0.018), rough=0.3); screen = [o for o in objs if o.data.materials[0].name == 'M_BlackScreeb'][0]; screen.data.materials[0] = glass
    for m in {o.data.materials[0] for o in objs}:
        if m.name == 'M_DeviceBlue': m.name = 'spo2_pad_blue'; bsdf(m).inputs['Base Color'].default_value = (0.02, 0.07, 0.62, 1); bsdf(m).inputs['Roughness'].default_value = 0.7
        elif m.name == 'M_DeviceWhite': m.name = 'spo2_body_white'
        elif m is not glass: m.name = 'spo2_button_white'
    plo, phi = bounds(pads); slo, shi = bounds([screen]); lo, hi = bounds(objs)
    anchors = {'finger': [0, 0, 0], 'entry': gl((0, phi.y, 0)), 'fingertip': gl((0, plo.y, 0)), 'screen': gl(((slo.x + shi.x) / 2, (slo.y + shi.y) / 2, shi.z)), 'top': gl((0, 0, hi.z)), 'underside': gl((0, 0, lo.z))}
    export('spo2_probe', by_material(objs, 'spo2'), {'uid': 'e3ad5ac95aed4546bb869fcd984a7a99', 'anchors': anchors,
        'axes': 'Origin in the middle of the finger channel, between the two pads. Long axis Z: the finger lies along Z and enters from -Z (anchor "entry"), its tip toward +Z. +Y is the display side (the back of the finger), -Y the pad of the finger.',
        'changes': 'Scaled to 58 mm long; turned so the finger channel runs along Z; origin moved into the channel; the display picture (fixed readings 98 % and 70 bpm) replaced by dark glass; materials renamed; meshes merged by material.'})

def nibp_cuff(length=0.14, opening=(0.104, 0.092)):
    """The cuff of TheGiwi's aneroid sphygmomanometer (the gauge, bulb and tubes are left out). In the source it lies flattened
    on a table; here its loop is opened to the oval of an upper arm. Arm along Z, the overlapping flap toward +Y."""
    parts = loose(bring(source('58f303b71fd047b0960785141485f8f0'))[0]); keep = []
    for p in parts:                                                              # the band's surfaces span the cuff's whole width; its side strips are thin; the tubes that pass through the loop are neither
        lo, hi = bounds([p]); inside = lo.x > -0.42 and hi.x < 0.38 and lo.y > 0.38 and hi.y < 1.02 and lo.z > 0.05 and hi.z < 0.45; w = hi.x - lo.x
        if inside and (w > 0.7 or w < 0.05): keep.append(p)
        else: bpy.data.objects.remove(p)
    big = sorted(keep, key=lambda p: -len(p.data.vertices))[:2]; ilo, ihi = bounds([min(big, key=lambda p: bounds([p])[1].y - bounds([p])[0].y)])       # the band's two faces: the inner one bounds the hole for the arm
    hole = Matrix.Rotation(-math.pi / 2, 4, 'Z') @ ((ilo + ihi) / 2); inner = (ihi.y - ilo.y, ihi.z - ilo.z)
    cuff = join(keep, 'nibp_cuff_fabric'); used = crop_textures(cuff)
    xf([cuff], Matrix.Translation(-hole) @ Matrix.Rotation(-math.pi / 2, 4, 'Z'))                                       # width of the band -> Blender -Y (the room's +Z, toward the elbow); the flap stays on top; origin in the middle of the hole
    lo, hi = bounds([cuff]); s_len = length / (hi.y - lo.y); s_x = opening[0] / inner[0]; s_z = opening[1] / inner[1]
    xf([cuff], Matrix.Diagonal((s_x, s_len, s_z, 1))); source_tris = tris([cuff]); soften(cuff)                         # 480 triangles made an eight-sided loop: one level of subdivision rounds it
    def hole():                                                                  # the hole for the arm, measured across the middle of the cuff: nearest surface on each side of the axis
        c = co([cuff]); mid = c[np.abs(c[:, 1]) < 0.02]; side = mid[np.abs(mid[:, 2]) < 0.012]; cap = mid[np.abs(mid[:, 0]) < 0.012]
        return (float(side[side[:, 0] > 0][:, 0].min() - side[side[:, 0] < 0][:, 0].max()), float(cap[cap[:, 2] > 0][:, 2].min() - cap[cap[:, 2] < 0][:, 2].max()))
    w, h = hole(); xf([cuff], Matrix.Diagonal((opening[0] / w, 1, opening[1] / h, 1))); w, h = hole()                   # smoothing draws the loop in a little: bring the hole back to size
    lo, hi = bounds([cuff]); xf([cuff], Matrix.Translation((0, -(lo.y + hi.y) / 2, 0))); lo, hi = bounds([cuff])
    m = cuff.data.materials[0]; m.name = 'nibp_cuff_fabric'
    anchors = {'centre': [0, 0, 0], 'proximal': gl((0, hi.y, 0)), 'distal': gl((0, lo.y, 0)), 'hose': gl((0, lo.y, hi.z * 0.82)), 'top': gl((0, 0, hi.z)), 'underside': gl((0, 0, lo.z))}
    export('nibp_cuff', [cuff], {'uid': '58f303b71fd047b0960785141485f8f0', 'anchors': anchors, 'opening': [round(w, 4), round(h, 4)], 'texture_crop': used,
        'axes': 'Origin on the axis of the arm, at the middle of the cuff. Long axis Z: the arm passes through along Z ("proximal" toward the shoulder at -Z, "distal" toward the elbow at +Z). +Y is the side with the overlapping flap, away from the table. "hose" is where a monitor hose would leave, on the distal edge. "opening" is the width (X) and height (Y) of the hole for the arm.',
        'changes': 'Cuff taken out of the set (gauge, bulb and tubes left out); turned so the arm runs along Z; scaled to 14 cm wide and its flattened loop opened to a 10.4 x 9.2 cm oval (the height is stretched 1.5 times more than the other two directions); the faceted loop of %d triangles rounded by one level of subdivision; texture sheet cropped to the cuff.' % source_tris})

def y_splitter(port=0.022, budget=4000):
    """NOT ACCEPTED (kept as a candidate only). One of the Advanced Visualization Lab's scans of ventilator parts improvised in
    Indiana University Health's 3D lab during the pandemic: a printed Y that joins two 22 mm limbs to one port. The scan's torn
    rims are cut back to clean rings. It is not a standard breathing-circuit Y-piece and it has no elbow."""
    objs = bring(source('3765bb838cf74a8cbdc981325b6ad825')); objs.sort(key=lambda o: bounds([o])[0].x)
    y = [o for o in objs if abs((bounds([o])[1].z - bounds([o])[0].z) - 0.2715) < 0.01][0]
    for o in objs:
        if o is not y: bpy.data.objects.remove(o)
    lo, hi = bounds([y]); trim = 0.012                                           # the two limbs end at the bottom, the single port at the top; the rims are ragged for about a centimetre of the scan's own units
    activate(y); bpy.ops.object.mode_set(mode='EDIT')
    for z, n in ((hi.z - trim, (0, 0, 1)), (lo.z + trim, (0, 0, -1))):
        bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.bisect(plane_co=(0, 0, z), plane_no=n, use_fill=True, clear_outer=True)
    bpy.ops.object.mode_set(mode='OBJECT'); c = co([y]); lo, hi = Vector(c.min(axis=0)), Vector(c.max(axis=0))
    ring = c[c[:, 2] < lo.z + 0.004]; left = ring[ring[:, 0] < (lo.x + hi.x) / 2]; d = float(left[:, 0].max() - left[:, 0].min())        # outside diameter of one limb at its cut end
    s = port / d; xf([y], Matrix.Diagonal((s, s, s, 1))); c = co([y]); lo, hi = Vector(c.min(axis=0)), Vector(c.max(axis=0))
    top = c[c[:, 2] > hi.z - 0.0005]; tc = Vector((float(top[:, 0].min() + top[:, 0].max()) / 2, float(top[:, 1].min() + top[:, 1].max()) / 2, hi.z))
    xf([y], Matrix.Rotation(math.pi, 4, 'Y') @ Matrix.Translation(-tc)); thin_to([y], budget)                           # origin at the single port, which now points down; the limbs rise
    activate(y); bpy.ops.object.shade_smooth(); y.data.materials.clear(); y.data.materials.append(plain('splitter_white', (0.86, 0.86, 0.84), rough=0.55)); y.name = y.data.name = 'y_splitter_body'
    c = co([y]); lo, hi = Vector(c.min(axis=0)), Vector(c.max(axis=0)); ring = c[c[:, 2] > hi.z - 0.001]; a = ring[ring[:, 0] < 0]; b = ring[ring[:, 0] >= 0]
    mid = lambda r: (float(r[:, 0].min() + r[:, 0].max()) / 2, float(r[:, 1].min() + r[:, 1].max()) / 2, hi.z)
    export('y_splitter', [y], {'uid': '3765bb838cf74a8cbdc981325b6ad825', 'anchors': {'patient': [0, 0, 0], 'limb_a': gl(mid(a)), 'limb_b': gl(mid(b))}, 'limb_outside_diameter': round(port, 4),
        'axes': 'Origin at the centre of the single (patient) port, which opens toward -Y. The two limbs rise toward +Y and end at "limb_a" and "limb_b", side by side along X.',
        'changes': 'One of the five scanned parts taken out; torn rims cut back to flat rings and closed; scaled so a limb is 22 mm across; thinned from 73,883 triangles; plain off-white material in place of the scan\'s translucent white.'})

def face_mask(r):
    """A face mask from a recipe (see the top of this file). Origin at the centre of the cushion's contact plane, the port
    toward +Y, the narrow nose-bridge end toward -Z, the contact plane on XZ."""
    objs = bring(r['source'], r.get('keep'), r.get('drop'))
    if not objs: raise SystemExit('nothing matched "keep" in ' + r['source'])
    xf(objs, frame(r.get('up', '+Z'), r.get('nose', '+Y'))); lo, hi = bounds(objs); s = r.get('length', 0.125) / (hi.y - lo.y); xf(objs, Matrix.Diagonal((s, s, s, 1)))
    c = co(objs); z0 = float(np.percentile(c[:, 2], 0.5)); rim = c[c[:, 2] < z0 + 0.006]                          # the cushion's lowest ring is what rests on the face
    xf(objs, Matrix.Translation((-float(rim[:, 0].min() + rim[:, 0].max()) / 2, -float(rim[:, 1].min() + rim[:, 1].max()) / 2, -z0)))
    thin_to(objs, r.get('budget', 8000)); clear = r.get('clear')
    for m in {m for o in objs for m in o.data.materials if bsdf(m)}:
        if (clear and re.search(clear, m.name)) or (not clear and (m.get('was_transmissive') or bsdf(m).inputs['Alpha'].default_value < 0.95)): see_through(m, r.get('alpha', 0.38))
    for o in objs:                                                               # textures down to what a prop of this size can show
        for m in o.data.materials:
            for n in (m.node_tree.nodes if m and m.node_tree else []):
                if n.type == 'TEX_IMAGE' and n.image and max(n.image.size) > 512: k = 512 / max(n.image.size); n.image.scale(max(1, int(n.image.size[0] * k)), max(1, int(n.image.size[1] * k))); n.image.pack()
    c = co(objs); lo, hi = Vector(c.min(axis=0)), Vector(c.max(axis=0)); top = c[c[:, 2] > hi.z - 0.002]
    port = (float(top[:, 0].min() + top[:, 0].max()) / 2, float(top[:, 1].min() + top[:, 1].max()) / 2, hi.z)
    item = r.get('item', 'mask'); export(item, by_material(objs, item), {'uid': r.get('uid'), 'source': r['source'], 'recipe': {k: v for k, v in r.items() if k != 'source'},
        'anchors': {'port': gl(port), 'contact': [0, 0, 0], 'nose': gl((0, hi.y, 0)), 'chin': gl((0, lo.y, 0))},
        'axes': 'Origin at the centre of the cushion\'s contact plane (the XZ plane). The port points toward +Y; the narrow nose-bridge end points toward -Z (the top of the head), the chin end toward +Z.',
        'changes': r.get('changes', 'Mask taken out of its source; turned to the room\'s convention; scaled to %d mm nose to chin; clear parts given plain alpha blending; thinned to the triangle budget.' % round(r.get('length', 0.125) * 1000))})

ITEMS = {'spo2_probe': spo2_probe, 'nibp_cuff': nibp_cuff, 'y_splitter': y_splitter}

if __name__ == '__main__':
    a = sys.argv[sys.argv.index('--') + 1:]; SOURCES, WORK = os.path.abspath(os.path.expanduser(a[0])), os.path.abspath(os.path.expanduser(a[1])); os.makedirs(WORK, exist_ok=True)
    jobs = [('recipe', json.load(open(a[a.index('--recipe') + 1])))] if '--recipe' in a else [(k, None) for k in (a[2:] or ['spo2_probe', 'nibp_cuff'])]
    for k, r in jobs:
        bpy.ops.wm.read_factory_settings(use_empty=True)
        face_mask(r) if r else ITEMS[k]()
