"""build_institute.py: build, light and bake the Overlord institute level. Run inside Blender:
   blender -b --factory-startup --python tools/build_institute.py -- POLYHAVEN_DIR OUT_DIR [draft|final] [preview.png]
Writes OUT_DIR/institute.glb (architecture + furniture), lightmap.jpg (baked direct + bounce light, encoded), level.json
(colliders, rooms, stations, camera bookmarks). Plan, in metres, +Y north, origin at the entrance threshold:

   forecourt + pool  ->  arrival (low, 2.8 m)  ->  LIGHT COURT 9 x 22 x 7 m under a finned skylight  ->  ANATOMY GALLERY 10 x 9
   west of the court: REGIONAL ROOM          east of the court: OPERATING ROOM (north) and STUDY STUDIO (south)

Every wall has thickness; openings have frames; edges carry a small bevel. Materials are Poly Haven scans (CC0).
These are scene-design proportions, not hospital building standards."""
import bpy, bmesh, json, math, os, sys
from mathutils import Vector, Matrix, Euler
A = sys.argv[sys.argv.index('--') + 1:]; SRC, OUT = A[0], A[1]; FINAL = len(A) > 2 and A[2] == 'final'; PREVIEW = A[3] if len(A) > 3 else None
os.makedirs(OUT, exist_ok=True); TMP = os.path.join(OUT, '_tex'); os.makedirs(TMP, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True); scene = bpy.context.scene
scene.render.engine = 'CYCLES'; scene.cycles.device = 'GPU'
try:
    prefs = bpy.context.preferences.addons['cycles'].preferences; prefs.compute_device_type = 'METAL'; prefs.get_devices()
    for d in prefs.devices: d.use = True
except Exception as e: print('GPU setup:', e)

# ------------------------------------------------------------------ materials
MATS = {}
import numpy as np
def tex(asset, kind, size, grade=None):
    """A Poly Haven map, downscaled once to `size` and saved as JPEG so the GLB stays small. `grade` = (target mean, saturation,
    contrast, tint) regrades a colour map in display space: the scans are darker and warmer than the pale stone the design asks for."""
    src = os.path.join(SRC, 'textures', asset, f'{asset}_{kind}.jpg'); tag = ('_' + '-'.join(str(g) for g in grade[:3]) + ''.join('%02x' % int(c * 255) for c in grade[3])) if grade else ''
    dst = os.path.join(TMP, f'{asset}_{kind}_{size}{tag}.jpg')
    if not os.path.exists(src): return None
    if not os.path.exists(dst):
        im = bpy.data.images.load(src); im.scale(size, size)
        if grade:
            a = np.array(im.pixels[:], dtype=np.float32).reshape(-1, 4); rgb = np.clip(a[:, :3], 0, 1) ** (1 / 2.2) if im.colorspace_settings.name != 'sRGB' else a[:, :3]
            rgb = np.where(rgb <= 0.0031308, rgb * 12.92, 1.055 * np.clip(rgb, 1e-6, None) ** (1 / 2.4) - 0.055)      # pixels are linear: to display
            lum = rgb @ np.array([0.2126, 0.7152, 0.0722], np.float32); rgb = lum[:, None] + (rgb - lum[:, None]) * grade[1]
            rgb = (rgb - rgb.mean()) * grade[2] + grade[0]; rgb = np.clip(rgb * np.array(grade[3], np.float32), 0, 1)
            a[:, :3] = np.where(rgb <= 0.04045, rgb / 12.92, ((rgb + 0.055) / 1.055) ** 2.4); im.pixels.foreach_set(a.ravel())
        im.filepath_raw = dst; im.file_format = 'JPEG'; scene.render.image_settings.quality = 88; im.save(); bpy.data.images.remove(im)
    im = bpy.data.images.load(dst, check_existing=True); im.colorspace_settings.name = 'sRGB' if kind == 'diff' else 'Non-Color'; return im
def mat(name, asset=None, tint=(1, 1, 1), uv_m=2.0, rough=None, rough_mul=1.0, metallic=0.0, size=1024, normal=True, emit=None, emit_strength=0.0, grade=None, nstrength=1.0):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']; m['uv_m'] = uv_m
    uv = nt.nodes.new('ShaderNodeUVMap'); uv.uv_map = 'UV0'
    b.inputs['Metallic'].default_value = metallic; b.inputs['Roughness'].default_value = rough if rough is not None else 0.6
    if grade and len(grade) < 4: grade = (*grade, (1, 1, 1))
    if asset and tex(asset, 'diff', size, grade):
        t = nt.nodes.new('ShaderNodeTexImage'); t.image = tex(asset, 'diff', size, grade); nt.links.new(uv.outputs[0], t.inputs[0]); nt.links.new(t.outputs[0], b.inputs['Base Color'])
        if rough is None and tex(asset, 'rough', size):
            r = nt.nodes.new('ShaderNodeTexImage'); r.image = tex(asset, 'rough', size); nt.links.new(uv.outputs[0], r.inputs[0]); m['rough_mul'] = rough_mul
            nt.links.new(r.outputs[0], b.inputs['Roughness'])
        if normal and tex(asset, 'nor', size):
            n = nt.nodes.new('ShaderNodeTexImage'); n.image = tex(asset, 'nor', size); nm = nt.nodes.new('ShaderNodeNormalMap'); nm.uv_map = 'UV0'; nm.inputs['Strength'].default_value = nstrength; nt.links.new(uv.outputs[0], n.inputs[0]); nt.links.new(n.outputs[0], nm.inputs['Color']); nt.links.new(nm.outputs[0], b.inputs['Normal'])
    else: b.inputs['Base Color'].default_value = (*tint, 1)
    if emit: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = emit_strength
    MATS[name] = m; return m
HI = 2048 if FINAL else 1024
mat('stone_floor', 'marble_01', uv_m=2.7, size=HI, rough_mul=0.6, grade=(0.76, 0.42, 0.85), nstrength=0.6)            # pale honed limestone
mat('stone_pave', 'large_grey_tiles', uv_m=2.4, rough_mul=0.95, grade=(0.62, 0.45, 0.8))
mat('concrete', 'concrete_wall_008', uv_m=3.2, size=HI, grade=(0.74, 0.4, 1.05, (1.0, 0.99, 0.97)))                   # fine board-marked concrete, pale
mat('concrete_fine', 'brushed_concrete', uv_m=2.5, grade=(0.72, 0.3, 0.7))
mat('plaster', 'plastered_wall_04', uv_m=2.5, grade=(0.87, 0.3, 0.55))
mat('plaster_warm', 'white_plaster_02', uv_m=2.2, grade=(0.85, 0.7, 0.45, (1.0, 0.985, 0.95)))
mat('gallery_wall', 'plastered_wall_04', uv_m=2.5, grade=(0.16, 0.3, 0.45, (0.95, 0.97, 1.0)))
mat('gallery_floor', 'concrete_floor_02', uv_m=3.0, grade=(0.2, 0.25, 0.5), rough_mul=0.45, nstrength=0.5)
mat('backdrop', None, tint=(0.008, 0.008, 0.01), rough=0.95)
mat('clinical_floor', 'concrete_floor_02', uv_m=3.0, grade=(0.74, 0.15, 0.3, (0.95, 0.985, 1.0)), rough_mul=0.5, normal=False)
mat('ceiling', 'plastered_wall_04', uv_m=2.4, grade=(0.9, 0.2, 0.35))
mat('ceiling_dark', None, tint=(0.02, 0.02, 0.022), rough=0.9)
mat('marble', 'brushed_concrete', uv_m=1.8, grade=(0.84, 0.25, 0.55, (1.0, 0.99, 0.965)), rough_mul=0.55, nstrength=0.4)   # honed stone tops and plinths
mat('oak', 'oak_veneer_01', uv_m=1.6, grade=(0.6, 0.8, 0.9))
mat('oak_dark', 'black_oak_veneer', uv_m=1.6, grade=(0.24, 0.8, 0.9))
mat('oak_floor', 'oak_veneer_01', uv_m=2.2, grade=(0.64, 0.6, 0.8))
mat('metal_dark', None, tint=(0.05, 0.052, 0.058), rough=0.42, metallic=1.0)
mat('brass', None, tint=(0.83, 0.61, 0.33), rough=0.34, metallic=1.0)
mat('steel', None, tint=(0.72, 0.73, 0.74), rough=0.28, metallic=1.0)
mat('pad', 'leather_white', uv_m=0.8, grade=(0.3, 0.3, 0.8, (0.8, 0.9, 1.0)))
mat('rubber', None, tint=(0.05, 0.052, 0.056), rough=0.8)
mat('pool_basin', None, tint=(0.03, 0.035, 0.04), rough=0.5)
mat('gravel', 'large_grey_tiles', uv_m=3.4, grade=(0.66, 0.3, 0.6))
mat('light_panel', None, tint=(1, 1, 1), rough=0.5, emit=(1.0, 0.97, 0.92), emit_strength=6.0)
mat('light_warm', None, tint=(1, 1, 1), rough=0.5, emit=(1.0, 0.82, 0.6), emit_strength=9.0)
mat('screen', None, tint=(0.02, 0.025, 0.03), rough=0.25)

# ------------------------------------------------------------------ geometry helpers
PARTS, COLLIDERS = [], []
def box(x0, y0, z0, x1, y1, z1, m, collide=None, rot=0.0, about=None, name='b'):
    """An axis-aligned box in metres (optionally turned about a vertical axis). Tall solid things collide by default."""
    me = bpy.data.meshes.new(name); bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts: v.co = Vector(((x0 + x1) / 2 + v.co.x * abs(x1 - x0), (y0 + y1) / 2 + v.co.y * abs(y1 - y0), (z0 + z1) / 2 + v.co.z * abs(z1 - z0)))
    if rot:
        c = Vector(about) if about else Vector(((x0 + x1) / 2, (y0 + y1) / 2, 0)); R = Matrix.Translation(c) @ Matrix.Rotation(rot, 4, 'Z') @ Matrix.Translation(-c); bmesh.ops.transform(bm, matrix=R, verts=bm.verts)
    bm.to_mesh(me); bm.free(); o = bpy.data.objects.new(name, me); scene.collection.objects.link(o); me.materials.append(MATS[m]); PARTS.append(o)
    if collide is None: collide = (z1 - z0) > 0.45 and z0 < 1.6 and not rot
    if collide: COLLIDERS.append([round(min(x0, x1), 3), round(min(y0, y1), 3), round(max(x0, x1), 3), round(max(y0, y1), 3), round(z0, 2), round(z1, 2)])
    return o
def wall_x(y, x0, x1, z1, m, t=0.4, openings=(), frame=True, z0=0.0, m_frame='metal_dark'):
    """A wall running east-west at y (its south face), thickness t northwards. openings = [(xa, xb, head_height, sill)]."""
    xs = [x0]
    for (a, b_, h, *s) in sorted(openings): xs += [a, b_]
    xs.append(x1)
    for i in range(0, len(xs), 2):
        if xs[i + 1] - xs[i] > 0.01: box(xs[i], y, z0, xs[i + 1], y + t, z1, m)
    for (a, b_, h, *s) in openings:
        sill = s[0] if s else 0.0
        if z1 - h > 0.01: box(a, y, h, b_, y + t, z1, m, collide=False)
        if sill > 0.01: box(a, y, z0, b_, y + t, sill, m)
        if frame: f = 0.06; box(a, y - 0.02, sill, a + f, y + t + 0.02, h, m_frame, collide=False); box(b_ - f, y - 0.02, sill, b_, y + t + 0.02, h, m_frame, collide=False); box(a, y - 0.02, h - f, b_, y + t + 0.02, h, m_frame, collide=False)
def wall_y(x, y0, y1, z1, m, t=0.4, openings=(), frame=True, z0=0.0, m_frame='metal_dark'):
    """A wall running north-south at x (its west face), thickness t eastwards. openings = [(ya, yb, head_height, sill)]."""
    ys = [y0]
    for (a, b_, h, *s) in sorted(openings): ys += [a, b_]
    ys.append(y1)
    for i in range(0, len(ys), 2):
        if ys[i + 1] - ys[i] > 0.01: box(x, ys[i], z0, x + t, ys[i + 1], z1, m)
    for (a, b_, h, *s) in openings:
        sill = s[0] if s else 0.0
        if z1 - h > 0.01: box(x, a, h, x + t, b_, z1, m, collide=False)
        if sill > 0.01: box(x, a, z0, x + t, b_, sill, m)
        if frame: f = 0.06; box(x - 0.02, a, sill, x + t + 0.02, a + f, h, m_frame, collide=False); box(x - 0.02, b_ - f, sill, x + t + 0.02, b_, h, m_frame, collide=False); box(x - 0.02, a, h - f, x + t + 0.02, b_, h, m_frame, collide=False)
GLASS = []   # glazing is added at runtime (it must not block baked light): [x0, y0, z0, x1, y1, z1]
STATIONS, LIGHTS, ROOMS, PROPS = {}, [], {}, []

# ------------------------------------------------------------------ the building
T = 0.4
# --- LIGHT COURT: x -4.5..4.5, y 0..22, 7 m tall
ROOMS['court'] = [-4.5, 0, 4.5, 22, 7.0, 'stone']
box(-4.9, -0.4, -0.3, 4.9, 22.4, 0.0, 'stone_floor', collide=False)
wall_x(-0.4, -4.9, 4.9, 7.0, 'concrete', openings=[(-1.3, 1.3, 2.7)])                                   # south, the entrance
wall_x(22.0, -4.9, 4.9, 7.0, 'concrete', openings=[(-1.7, 1.7, 3.4)], m_frame='brass')                  # north, the portal to the gallery
wall_y(-4.9, 0, 22, 7.0, 'concrete', openings=[(14.4, 16.0, 2.4)])                                      # west: regional room
wall_y(4.5, 0, 22, 7.0, 'concrete', openings=[(4.9, 6.1, 2.4), (13.2, 14.9, 2.4), (15.8, 19.2, 2.3, 0.95)])   # east: studio door, OR doors, OR observation window
GLASS.append([4.62, 15.86, 1.01, 4.66, 19.14, 2.24])
# roof: a slab with one long opening, and deep concrete fins across it
box(-4.9, -0.4, 7.0, -2.3, 22.4, 7.5, 'concrete_fine', collide=False); box(2.3, -0.4, 7.0, 4.9, 22.4, 7.5, 'concrete_fine', collide=False); box(-2.3, -0.4, 7.0, 2.3, 2.6, 7.5, 'concrete_fine', collide=False); box(-2.3, 19.4, 7.0, 2.3, 22.4, 7.5, 'concrete_fine', collide=False)
for i in range(9): yb = 2.6 + i * 2.1; box(-2.3, yb - 0.11, 6.1, 2.3, yb + 0.11, 7.5, 'plaster', collide=False)
box(-2.42, 2.6, 7.5, -2.3, 19.4, 7.62, 'metal_dark', collide=False); box(2.3, 2.6, 7.5, 2.42, 19.4, 7.62, 'metal_dark', collide=False); GLASS.append([-2.3, 2.6, 7.55, 2.3, 19.4, 7.58])
# the axis: two brass inlays in the floor from the door to the portal; a section-plane line round the walls at 1.1 m
for x in (-1.25, 1.25): box(x - 0.012, 0.1, 0.0, x + 0.012, 21.9, 0.003, 'brass', collide=False)
box(-4.5, 0.0, 1.1, -4.49, 14.3, 1.125, 'brass', collide=False); box(4.49, 6.3, 1.1, 4.5, 13.0, 1.125, 'brass', collide=False)
box(-0.95, 8.75, 0.0, 0.95, 10.65, 0.42, 'marble'); box(-0.99, 8.71, 0.42, 0.99, 10.69, 0.44, 'brass', collide=False); box(-0.95, 8.75, 0.44, 0.95, 10.65, 0.5, 'marble', collide=False)
STATIONS['atrium'] = {'at': [0.0, 7.0], 'look': [0.0, 9.7, 1.5], 'label': 'The sectioned figure', 'mount': [0.0, 9.7, 0.5]}
box(-70, -70, -0.34, 70, 70, -0.3, 'gravel', collide=False)
# a long stone bench on dark steel, west side; a low marble orientation table near the entrance
box(-4.2, 3.2, 0.40, -3.55, 11.2, 0.48, 'marble', collide=False); COLLIDERS.append([-4.2, 3.2, -3.55, 11.2, 0, 0.5])
for yb in (3.6, 6.1, 8.6, 10.8): box(-4.12, yb - 0.03, 0.0, -3.63, yb + 0.03, 0.40, 'metal_dark', collide=False)
box(2.2, 2.0, 0.0, 3.4, 2.7, 0.92, 'marble'); box(2.16, 1.96, 0.92, 3.44, 2.74, 0.95, 'brass', collide=False); box(2.2, 2.0, 0.95, 3.4, 2.7, 0.99, 'marble', collide=False)
STATIONS['orientation'] = {'at': [2.8, 1.5], 'look': [2.8, 2.35, 0.95], 'label': 'Choose a session'}
for (px, py) in ((-3.9, 12.6), (-3.9, 20.6), (3.9, 9.6), (3.9, 20.6), (-3.9, 1.2)): box(px - 0.42, py - 0.42, 0.0, px + 0.42, py + 0.42, 0.5, 'concrete_fine'); PROPS.append(('potted_plant_02' if px < 0 else 'potted_plant_01', px, py, 0.5, py * 1.3, 1.5))
# --- ARRIVAL: a low vestibule, then the forecourt and its pool
ROOMS['arrival'] = [-2.6, -4.4, 2.6, -0.4, 2.8, 'stone']
box(-3.0, -4.6, -0.3, 3.0, -0.4, 0.0, 'stone_floor', collide=False); wall_y(-3.0, -4.6, -0.4, 2.8, 'concrete'); wall_y(2.6, -4.6, -0.4, 2.8, 'concrete'); box(-3.4, -5.4, 2.8, 3.4, -0.4, 3.2, 'concrete_fine', collide=False)
box(-9.0, -15.0, -0.3, 9.0, -4.6, 0.0, 'stone_pave', collide=False); ROOMS['forecourt'] = [-9.0, -15.0, 9.0, -4.6, 0, 'stone']
box(-8.2, -12.0, -0.28, -2.4, -6.2, -0.02, 'pool_basin', collide=False); COLLIDERS.append([-8.2, -12.0, -2.4, -6.2, 0, 0.3])
for (a, b_, c, d) in ((-8.35, -12.15, -2.25, -12.0), (-8.35, -6.2, -2.25, -6.05), (-8.35, -12.0, -8.2, -6.2), (-2.4, -12.0, -2.25, -6.2)): box(a, b_, -0.02, c, d, 0.06, 'marble', collide=False)
POOL = [-8.2, -12.0, -2.4, -6.2, -0.03]
wall_y(-9.4, -15.0, -4.6, 1.1, 'concrete'); wall_y(9.0, -15.0, -4.6, 1.1, 'concrete'); wall_x(-15.4, -9.4, 9.4, 1.1, 'concrete', openings=[(-2.0, 2.0, 1.1)], frame=False)
wall_x(-5.0, -9.4, -3.0, 4.0, 'concrete'); wall_x(-5.0, 3.0, 9.4, 4.0, 'concrete')
box(3.6, -11.5, 0.0, 7.4, -7.0, 0.45, 'concrete_fine'); PROPS.append(('potted_plant_04', 5.5, -9.2, 0.45, 0.4, 2.2))
# --- ANATOMY GALLERY: x -5..5, y 22.4..31.4, 4.2 m, dark
ROOMS['gallery'] = [-5.0, 22.4, 5.0, 31.4, 4.2, 'dark']
box(-5.4, 22.4, -0.3, 5.4, 31.8, 0.0, 'gallery_floor', collide=False); box(-5.4, 22.4, 4.2, 5.4, 31.8, 4.6, 'ceiling_dark', collide=False)
wall_x(31.4, -5.4, 5.4, 4.2, 'gallery_wall'); wall_y(-5.4, 22.4, 31.4, 4.2, 'gallery_wall'); wall_y(5.0, 22.4, 31.4, 4.2, 'gallery_wall')
box(-5.0, 22.4, 0.0, -1.76, 22.42, 4.2, 'gallery_wall', collide=False); box(1.76, 22.4, 0.0, 5.0, 22.42, 4.2, 'gallery_wall', collide=False)   # the court wall is dark on this side
def mount(cx, cy, w, d, h, key, label):
    box(cx - w / 2, cy - d / 2, 0.0, cx + w / 2, cy + d / 2, h - 0.06, 'metal_dark'); box(cx - w / 2 - 0.02, cy - d / 2 - 0.02, h - 0.06, cx + w / 2 + 0.02, cy + d / 2 + 0.02, h - 0.045, 'brass', collide=False); box(cx - w / 2, cy - d / 2, h - 0.045, cx + w / 2, cy + d / 2, h, 'marble', collide=False)
    STATIONS[key] = {'at': [cx, cy - d / 2 - 1.15], 'look': [cx, cy, h + 0.45], 'label': label, 'mount': [cx, cy, h]}
mount(0.0, 28.6, 1.5, 0.9, 0.98, 'plexus', 'Examine the brachial plexus'); box(-1.5, 30.2, 0.25, 1.5, 30.26, 3.2, 'backdrop', collide=False); box(-1.53, 30.26, 0.22, 1.53, 30.28, 3.23, 'brass', collide=False)
mount(-3.4, 26.2, 0.7, 0.7, 1.12, 'larynx', 'Larynx (view only)'); box(-4.99, 25.2, 0.3, -4.93, 27.2, 3.0, 'backdrop', collide=False)
mount(3.4, 26.2, 0.7, 0.7, 1.12, 'bronchi', 'Bronchial tree (view only)')
# the examination table: a stone slab on a steel frame, for the regional case
box(-3.9, 29.1, 0.86, -1.9, 30.0, 0.92, 'marble', collide=False); COLLIDERS.append([-3.9, 29.1, -1.9, 30.0, 0, 0.92])
for (lx, ly) in ((-3.8, 29.2), (-2.0, 29.2), (-3.8, 29.9), (-2.0, 29.9)): box(lx - 0.03, ly - 0.03, 0, lx + 0.03, ly + 0.03, 0.86, 'metal_dark', collide=False)
# the mirror station: a recess in the east wall with a tall dark glass and a small control pedestal
box(4.72, 27.6, 0.2, 4.76, 29.4, 2.6, 'screen', collide=False); box(4.76, 27.57, 0.17, 4.78, 29.43, 2.63, 'brass', collide=False); box(4.1, 28.25, 0.0, 4.4, 28.75, 0.95, 'metal_dark'); box(4.08, 28.23, 0.95, 4.42, 28.77, 0.97, 'brass', collide=False)
STATIONS['mirror'] = {'at': [3.2, 28.5], 'look': [4.7, 28.5, 1.5], 'label': 'Mirror station'}
for (lx, ly) in ((0.0, 27.1), (-3.4, 25.3), (3.4, 25.3), (-1.0, 27.3), (1.0, 27.3), (-2.9, 28.6), (3.9, 27.4)): box(lx - 0.05, ly - 0.05, 3.98, lx + 0.05, ly + 0.05, 4.2, 'metal_dark', collide=False)
box(-4.0, 27.0, 4.14, 4.0, 27.04, 4.2, 'metal_dark', collide=False); box(-4.0, 25.2, 4.14, 4.0, 25.24, 4.2, 'metal_dark', collide=False)
# --- REGIONAL PRACTICE ROOM: x -11.5..-4.9, y 12..18.5, 3 m
ROOMS['regional'] = [-11.5, 12.0, -4.9, 18.5, 3.0, 'clinical']
box(-11.9, 11.6, -0.3, -4.9, 18.9, 0.0, 'clinical_floor', collide=False); box(-11.9, 11.6, 3.0, -4.9, 18.9, 3.4, 'ceiling', collide=False)
wall_x(11.6, -11.9, -4.9, 3.0, 'plaster'); wall_x(18.5, -11.9, -4.9, 3.0, 'plaster'); wall_y(-11.9, 11.6, 18.9, 3.0, 'plaster', openings=[(13.6, 16.9, 2.5, 0.9)]); GLASS.append([-11.74, 13.66, 0.96, -11.7, 16.84, 2.44])
box(-8.9, 14.4, 0.0, -8.3, 16.0, 0.12, 'metal_dark', collide=False); box(-8.75, 14.9, 0.12, -8.45, 15.5, 0.74, 'steel'); box(-9.0, 14.2, 0.74, -8.2, 16.2, 0.8, 'metal_dark', collide=False); box(-8.98, 14.22, 0.8, -8.22, 16.18, 0.9, 'pad', collide=False); COLLIDERS.append([-9.0, 14.2, -8.2, 16.2, 0, 0.9])
box(-5.6, 12.1, 0.0, -5.0, 13.6, 0.9, 'plaster'); box(-5.62, 12.08, 0.9, -4.98, 13.62, 0.93, 'steel', collide=False)                              # supply counter
for i in range(3): box(-5.61, 12.14 + i * 0.5, 0.1, -5.6, 12.6 + i * 0.5, 0.82, 'steel', collide=False)
box(-10.2, 18.42, 1.0, -7.6, 18.5, 2.3, 'screen', collide=False); box(-10.26, 18.4, 0.94, -7.54, 18.42, 2.36, 'metal_dark', collide=False)       # wall display
STATIONS['regional'] = {'at': [-7.2, 15.2], 'look': [-8.6, 15.2, 1.0], 'label': 'Regional reasoning: four ways in'}
for (cx, cy) in ((-8.6, 15.2), (-6.4, 13.2), (-10.4, 13.2), (-6.4, 17.2), (-10.4, 17.2)): box(cx - 0.6, cy - 0.3, 2.97, cx + 0.6, cy + 0.3, 3.0, 'light_panel', collide=False)
for y in (11.6 + T, 18.5): box(-11.5, y - 0.012 if y > 15 else y, 0, -4.9, y if y > 15 else y + 0.012, 0.1, 'steel', collide=False)
# --- OPERATING ROOM: x 4.9..12, y 11.5..19.6, 3 m
ROOMS['or'] = [4.9, 11.5, 12.0, 19.6, 3.0, 'clinical']
box(4.9, 11.1, -0.3, 12.4, 20.0, 0.0, 'clinical_floor', collide=False); box(4.9, 11.1, 3.0, 12.4, 20.0, 3.4, 'ceiling', collide=False)
wall_x(11.1, 4.9, 12.4, 3.0, 'plaster'); wall_x(19.6, 4.9, 12.4, 3.0, 'plaster'); wall_y(12.0, 11.1, 20.0, 3.0, 'plaster')
box(7.3, 14.3, 2.94, 9.9, 16.9, 3.0, 'light_panel', collide=False); box(7.2, 14.2, 2.9, 10.0, 14.3, 3.0, 'steel', collide=False); box(7.2, 16.9, 2.9, 10.0, 17.0, 3.0, 'steel', collide=False)
for (cx, cy) in ((6.2, 12.6), (11.0, 12.6), (6.2, 18.4), (11.0, 18.4)): box(cx - 0.6, cy - 0.3, 2.97, cx + 0.6, cy + 0.3, 3.0, 'light_panel', collide=False)
box(11.86, 12.2, 0.0, 12.0, 15.0, 2.1, 'steel'); box(11.84, 12.2, 1.0, 11.86, 15.0, 1.04, 'metal_dark', collide=False)                                  # storage wall
for (d0, hinge, ang) in ((13.2, (4.5, 13.2), -1.25), (14.9, (4.5, 14.9), 1.25)): box(4.5, min(d0, d0 + (0.84 if d0 < 14 else -0.84)), 0.02, 4.55, max(d0, d0 + (0.84 if d0 < 14 else -0.84)), 2.36, 'steel', collide=False, rot=ang, about=(hinge[0], hinge[1], 0))
STATIONS['or'] = {'at': [6.2, 14.05], 'look': [8.6, 15.6, 1.0], 'label': 'Operating room', 'table': [8.6, 15.6]}
# --- STUDY STUDIO: x 4.9..10.4, y 2.8..8.6, 2.9 m, timber floor, a window east
ROOMS['studio'] = [4.9, 2.8, 10.4, 8.6, 2.9, 'timber']
box(4.9, 2.4, -0.3, 10.8, 9.0, 0.0, 'oak_floor', collide=False); box(4.9, 2.4, 2.9, 10.8, 9.0, 3.3, 'plaster', collide=False)
wall_x(2.4, 4.9, 10.8, 2.9, 'plaster_warm'); wall_x(8.6, 4.9, 10.8, 2.9, 'plaster_warm'); wall_y(10.4, 2.4, 9.0, 2.9, 'plaster_warm', openings=[(3.6, 7.6, 2.5, 0.75)]); GLASS.append([10.58, 3.66, 0.81, 10.62, 7.54, 2.44])
box(5.3, 8.5, 0.3, 9.9, 8.6, 2.6, 'oak_dark', collide=False); box(5.3, 8.46, 1.5, 9.9, 8.5, 1.53, 'brass', collide=False)                                  # the collection wall, with a brass rail
for z in (0.62, 1.12, 1.62, 2.12): box(5.4, 8.2, z, 9.8, 8.5, z + 0.035, 'oak', collide=False)
COLLIDERS.append([5.3, 8.15, 9.9, 8.6, 0, 2.6])
STATIONS['collection'] = {'at': [7.6, 7.1], 'look': [7.6, 8.3, 1.3], 'label': 'Your collection', 'shelf': [[5.9, 8.34, 1.155], [7.6, 8.34, 1.155], [9.3, 8.34, 1.155], [6.7, 8.34, 1.655], [8.5, 8.34, 1.655]]}
PROPS += [('WoodenTable_02', 8.9, 4.6, 0.0, 0.0, 1.0), ('modern_arm_chair_01', 8.9, 5.5, 0.0, 3.0, 1.0), ('desk_lamp_arm_01', 9.4, 4.5, 0.78, 2.4, 1.0), ('book_encyclopedia_set_01', 8.3, 4.45, 0.78, 0.3, 1.0), ('ArmChair_01', 5.8, 3.6, 0.0, 0.9, 1.0), ('side_table_01', 6.7, 3.3, 0.0, 0.0, 1.0), ('potted_plant_04', 9.9, 8.0, 0.0, 0.0, 1.3), ('ceramic_vase_03', 6.7, 3.3, 0.55, 0.0, 1.0)]
STATIONS['desk'] = {'at': [8.9, 5.9], 'look': [8.9, 4.6, 0.9], 'label': 'Case archive'}
STATIONS['wardrobe'] = {'at': [5.9, 6.4], 'look': [5.0, 6.4, 1.4], 'label': 'Change how you look'}
box(4.92, 6.0, 0.25, 4.95, 6.8, 2.1, 'steel', collide=False); box(4.9, 5.97, 0.22, 4.915, 6.83, 2.13, 'brass', collide=False)                                # a mirror by the door
box(6.4, 5.4, 2.87, 7.6, 6.0, 2.9, 'light_warm', collide=False)
# skirting in the timber room; court door leaves
for (a, b_, c, d) in ((4.9, 2.8, 10.4, 2.812), (4.9, 8.588, 5.3, 8.6)): box(a, b_, 0, c, d, 0.09, 'plaster', collide=False)
box(4.5, 4.9, 0.02, 4.55, 5.98, 2.36, 'oak', collide=False, rot=1.15, about=(4.5, 4.9, 0)); box(-4.9, 14.4, 0.02, -4.85, 15.9, 2.36, 'oak', collide=False, rot=-1.2, about=(-4.9, 14.4, 0))
# seating in the court
PROPS += [('Sofa_01', 3.6, 11.4, 0.0, -1.5708, 1.0), ('CoffeeTable_01', 2.4, 11.4, 0.0, 0.0, 1.0), ('Ottoman_01', 2.5, 12.9, 0.0, 0.3, 1.0), ('Ottoman_01', 2.3, 9.9, 0.0, 0.0, 1.0)]
COLLIDERS += [[3.1, 10.2, 4.2, 12.6, 0, 0.8], [8.2, 4.2, 9.6, 5.0, 0, 0.8], [5.3, 3.1, 6.3, 4.1, 0, 0.8]]

# ------------------------------------------------------------------ join, bevel, UVs
bpy.ops.object.select_all(action='DESELECT')
for o in PARTS: o.select_set(True)
bpy.context.view_layer.objects.active = PARTS[0]; bpy.ops.object.join(); arch = bpy.context.view_layer.objects.active; arch.name = 'institute'
bv = arch.modifiers.new('bevel', 'BEVEL'); bv.width = 0.007; bv.segments = 2; bv.limit_method = 'ANGLE'; bv.angle_limit = math.radians(40); bv.harden_normals = False
bpy.ops.object.modifier_apply(modifier='bevel')
me = arch.data; bm = bmesh.new(); bm.from_mesh(me); uv0 = bm.loops.layers.uv.new('UV0')
for f in bm.faces:
    n = f.normal; a = max(range(3), key=lambda i: abs(n[i])); s = me.materials[f.material_index].get('uv_m', 2.0)
    for l in f.loops:
        p = l.vert.co; l[uv0].uv = ((p.x, p.z) if a == 1 else (p.y, p.z) if a == 0 else (p.x, p.y)); l[uv0].uv = (l[uv0].uv[0] / s, l[uv0].uv[1] / s)
    f.smooth = False
bm.to_mesh(me); bm.free()
lm = me.uv_layers.new(name='LM'); me.uv_layers.active = lm; bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.uv.lightmap_pack(PREF_CONTEXT='ALL_FACES', PREF_PACK_IN_ONE=True, PREF_NEW_UVLAYER=False, PREF_BOX_DIV=48, PREF_MARGIN_DIV=0.25); bpy.ops.object.mode_set(mode='OBJECT')
print('ARCH faces', len(me.polygons), 'verts', len(me.vertices), 'colliders', len(COLLIDERS))

# ------------------------------------------------------------------ furniture (Poly Haven models): they cast baked shadows
prop_objs = []
for (name, x, y, z, rz, sc) in PROPS:
    p = os.path.join(SRC, 'models', name, name + '.gltf')
    if not os.path.exists(p): print('missing prop', name); continue
    before = set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=p); new = [o for o in bpy.data.objects if o not in before]
    root = bpy.data.objects.new('prop_' + name, None); scene.collection.objects.link(root)
    for o in new:
        if o.parent is None: o.parent = root
    root.location = (x, y, z); root.rotation_euler = (0, 0, rz); root.scale = (sc, sc, sc); prop_objs += new + [root]

# ------------------------------------------------------------------ light
world = bpy.data.worlds.new('sky'); scene.world = world; world.use_nodes = True; wn = world.node_tree; env = wn.nodes.new('ShaderNodeTexEnvironment'); env.image = bpy.data.images.load(os.path.join(SRC, 'hdri', 'kloofendal_48d_partly_cloudy_puresky_2k.hdr'))
mp = wn.nodes.new('ShaderNodeMapping'); tc = wn.nodes.new('ShaderNodeTexCoord'); wn.links.new(tc.outputs['Generated'], mp.inputs[0]); wn.links.new(mp.outputs[0], env.inputs[0]); mp.inputs['Rotation'].default_value = (0, 0, math.radians(200))
wn.links.new(env.outputs[0], wn.nodes['Background'].inputs[0]); wn.nodes['Background'].inputs[1].default_value = 0.9
def lamp(kind, loc, energy, color=(1, 1, 1), target=None, size=0.3, spot=50, blend=0.5):
    d = bpy.data.lights.new('l', kind); d.energy = energy; d.color = color
    if kind == 'SPOT': d.spot_size = math.radians(spot); d.spot_blend = blend; d.shadow_soft_size = size
    if kind == 'AREA': d.size = size; d.shape = 'SQUARE'
    if kind == 'SUN': d.angle = math.radians(2.5)
    o = bpy.data.objects.new('lamp', d); scene.collection.objects.link(o); o.location = loc
    if target is not None: v = Vector(target) - Vector(loc); o.rotation_euler = v.to_track_quat('-Z', 'Y').to_euler()
    LIGHTS.append({'kind': kind, 'at': list(loc), 'to': list(target) if target else None, 'color': list(color), 'energy': energy}); return o
SUN_DIR = Vector((-0.42, -0.36, 0.83)).normalized()        # from the south-west, high: it comes down the skylight onto the east wall and the floor
sun = lamp('SUN', (0, 0, 30), 4.6, (1.0, 0.96, 0.9)); sun.rotation_euler = (-SUN_DIR).to_track_quat('-Z', 'Y').to_euler()
WARM, COOL = (1.0, 0.86, 0.7), (0.93, 0.97, 1.0)
lamp('SPOT', (0.0, 27.1, 4.0), 900, WARM, (0.0, 28.6, 1.35), 0.1, 42); lamp('SPOT', (-1.0, 27.3, 4.0), 260, COOL, (-0.4, 28.7, 1.5), 0.1, 46); lamp('SPOT', (1.0, 27.3, 4.0), 320, WARM, (0.0, 30.1, 1.9), 0.3, 70)
lamp('SPOT', (-3.4, 25.3, 4.0), 480, WARM, (-3.4, 26.2, 1.4), 0.1, 40); lamp('SPOT', (3.4, 25.3, 4.0), 480, WARM, (3.4, 26.2, 1.4), 0.1, 40); lamp('SPOT', (-2.9, 28.6, 4.0), 300, WARM, (-2.9, 29.5, 0.92), 0.1, 46); lamp('SPOT', (3.9, 27.4, 4.0), 220, COOL, (4.7, 28.5, 1.5), 0.1, 50)
for (cx, cy) in ((-8.6, 15.2), (-6.4, 13.2), (-10.4, 13.2), (-6.4, 17.2), (-10.4, 17.2)): lamp('AREA', (cx, cy, 2.95), 110, COOL, (cx, cy, 0), 0.6)
lamp('AREA', (8.6, 15.6, 2.92), 520, COOL, (8.6, 15.6, 0), 2.4)
for (cx, cy) in ((6.2, 12.6), (11.0, 12.6), (6.2, 18.4), (11.0, 18.4)): lamp('AREA', (cx, cy, 2.95), 100, COOL, (cx, cy, 0), 0.6)
lamp('AREA', (7.0, 5.7, 2.85), 120, WARM, (7.0, 5.7, 0), 0.6); lamp('SPOT', (7.6, 6.9, 2.8), 160, WARM, (7.6, 8.3, 1.4), 0.2, 75)
lamp('AREA', (0, -2.4, 2.75), 60, WARM, (0, -2.4, 0), 1.0)

scene.cycles.samples = 256 if FINAL else 48; scene.cycles.use_denoising = True; scene.view_settings.view_transform = 'AgX'; scene.view_settings.exposure = 0.0
# ------------------------------------------------------------------ preview render from the entrance (to judge composition before a long bake)
if PREVIEW:
    for k, (loc, tgt, lens) in {'arrival': ((0, -3.6, 1.62), (0, 12, 2.1), 22), 'court': ((2.4, 2.2, 1.62), (-1.2, 19, 2.6), 20), 'gallery': ((0.4, 23.4, 1.62), (0, 28.6, 1.3), 24), 'studio': ((5.6, 3.6, 1.6), (9.2, 8.2, 1.2), 20), 'regional': ((-5.6, 17.6, 1.6), (-9.4, 14.2, 1.0), 20)}.items():
        cam = bpy.data.cameras.new(k); cam.lens = lens; co = bpy.data.objects.new(k, cam); scene.collection.objects.link(co); co.location = loc; co.rotation_euler = (Vector(tgt) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler(); scene.camera = co
        scene.render.resolution_x, scene.render.resolution_y = 960, 540; scene.cycles.samples = 64; scene.render.filepath = PREVIEW.replace('.png', f'_{k}.png'); bpy.ops.render.render(write_still=True); print('PREVIEW', k)
    scene.cycles.samples = 256 if FINAL else 48

# ------------------------------------------------------------------ bake direct + bounce light into one atlas
RES = 4096 if FINAL else 1536; RANGE = 8.0
img = bpy.data.images.new('lightmap', RES, RES, alpha=False, float_buffer=True); img.colorspace_settings.name = 'Linear Rec.709' if 'Linear Rec.709' in [c.name for c in bpy.types.ColorManagedInputColorspaceSettings.bl_rna.properties['name'].enum_items] else 'Non-Color'
for m in me.materials:
    n = m.node_tree.nodes.new('ShaderNodeTexImage'); n.image = img; n.name = 'BAKE'; uvn = m.node_tree.nodes.new('ShaderNodeUVMap'); uvn.uv_map = 'LM'; m.node_tree.links.new(uvn.outputs[0], n.inputs[0]); m.node_tree.nodes.active = n
    b = m.node_tree.nodes['Principled BSDF']; m['emit_keep'] = b.inputs['Emission Strength'].default_value
bpy.ops.object.select_all(action='DESELECT'); arch.select_set(True); bpy.context.view_layer.objects.active = arch; me.uv_layers.active = me.uv_layers['LM']
scene.cycles.bake_type = 'DIFFUSE'; scene.render.bake.use_pass_direct = True; scene.render.bake.use_pass_indirect = True; scene.render.bake.use_pass_color = False; scene.render.bake.margin = 6; scene.render.bake.use_clear = True
import time; t0 = time.time(); bpy.ops.object.bake(type='DIFFUSE'); print('BAKED in', round(time.time() - t0), 's at', RES)
import numpy as np
px = np.array(img.pixels[:], dtype=np.float32).reshape(RES, RES, 4)[:, :, :3]
def blur(a):   # a one-texel soften, to settle the remaining noise without smearing shadow edges
    p = np.pad(a, ((1, 1), (1, 1), (0, 0)), mode='edge'); return (p[1:-1, 1:-1] * 4 + p[:-2, 1:-1] + p[2:, 1:-1] + p[1:-1, :-2] + p[1:-1, 2:] + (p[:-2, :-2] + p[:-2, 2:] + p[2:, :-2] + p[2:, 2:]) * 0.5) / 10
px = blur(blur(px)); enc = np.clip(px / RANGE, 0, 1) ** (1 / 2.2)
out = bpy.data.images.new('lm_out', RES, RES, alpha=False); out.colorspace_settings.name = 'sRGB'; flat = np.concatenate([enc, np.ones((RES, RES, 1), np.float32)], axis=2).ravel(); out.pixels.foreach_set(flat)
scene.view_settings.view_transform = 'Standard'; scene.render.image_settings.file_format = 'JPEG'; scene.render.image_settings.quality = 93; out.save_render(os.path.join(OUT, 'lightmap.jpg'))
print('lightmap mean', float(px.mean()), 'p99', float(np.percentile(px, 99)), 'max', float(px.max()))

# ------------------------------------------------------------------ export
for m in me.materials: m.node_tree.nodes.remove(m.node_tree.nodes['BAKE'])
me.uv_layers.active = me.uv_layers['UV0']; me.uv_layers['UV0'].active_render = True
for o in bpy.data.objects:
    if o.type == 'LIGHT' or o.type == 'CAMERA': o.select_set(False)
bpy.ops.object.select_all(action='DESELECT'); arch.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, 'institute.glb'), export_format='GLB', use_selection=True, export_apply=True, export_yup=True, export_texcoords=True, export_normals=True, export_materials='EXPORT', export_image_format='JPEG', export_jpeg_quality=85, export_extras=True, export_draco_mesh_compression_enable=False)
bpy.ops.object.select_all(action='DESELECT')
for o in prop_objs: o.select_set(True)
if prop_objs: bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, 'institute-props.glb'), export_format='GLB', use_selection=True, export_apply=False, export_yup=True, export_materials='EXPORT', export_image_format='JPEG', export_jpeg_quality=82)
T3 = lambda p: [round(p[0], 3), round(p[2], 3) if len(p) > 2 else 0, round(-p[1], 3)]      # Blender (x, y, z) -> three (x, z, -y)
level = {'units': 'metres; three.js axes (x east, y up, z south)', 'lightmapRange': RANGE, 'sunDir': T3(list(SUN_DIR)), 'spawn': {'x': 0, 'z': 12.6, 'yaw': 0},
  'colliders': [[c[0], -c[3], c[2], -c[1], c[4], c[5]] for c in COLLIDERS], 'rooms': {k: {'x0': v[0], 'z0': -v[3], 'x1': v[2], 'z1': -v[1], 'h': v[4], 'floor': v[5]} for k, v in ROOMS.items()},
  'glass': [[g[0], g[2], -g[4], g[3], g[5], -g[1]] for g in GLASS], 'pool': [POOL[0], -POOL[3], POOL[2], -POOL[1], POOL[4]],
  'stations': {k: {**v, 'at': [v['at'][0], -v['at'][1]], 'look': T3(v['look']), **({'mount': T3(v['mount'])} if 'mount' in v else {}), **({'shelf': [T3(s) for s in v['shelf']]} if 'shelf' in v else {}), **({'table': [v['table'][0], -v['table'][1]]} if 'table' in v else {})} for k, v in STATIONS.items()},
  'lights': [{**l, 'at': T3(l['at']), 'to': T3(l['to']) if l['to'] else None} for l in LIGHTS]}
json.dump(level, open(os.path.join(OUT, 'level.json'), 'w'), indent=1); print('EXPORTED', OUT)
