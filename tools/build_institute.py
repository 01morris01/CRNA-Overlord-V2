"""build_institute.py: build, light and bake the Overlord institute level. Run inside Blender:

   blender -b --factory-startup --python tools/build_institute.py -- POLYHAVEN_DIR OUT_DIR [draft|final] [preview.png]

then finish with tools/finish_institute.sh (encodes the lightmap, compresses the models).

Writes into OUT_DIR:
   institute.glb        architecture, two UV sets (materials, lightmap), flat-shaded with small bevels
   institute-props.glb  furniture and plants (Poly Haven models), not lightmapped
   lightmap.npy         baked light, linear, float16: sky + lamps + all bounces, WITHOUT the sun's direct light
   sky.hdr              the sky, turned so that its sun sits where the level's sun is
   level.json           colliders, rooms, stations, signs, glass, lamps, light probes, sun

Light is split on purpose. The sun's direct light is drawn live in the browser with one shadow map, so that a person walking
through a sun patch is lit and shadowed by the same light as the floor. Everything else (sky, lamps, every bounce, including
the sun's) is baked: into the lightmap for the building, and into a set of small probes for things that move.

Plan, in meters, +X east, +Y north, +Z up, origin at the court's entrance threshold:

   forecourt + pool  ->  arrival (low, 2.8 m)  ->  LIGHT COURT 9 x 22 x 7 m under a finned skylight  ->  ANATOMY GALLERY 10 x 9
   west of the court: REGIONAL ROOM          east of the court: OPERATING ROOM (north) and STUDY STUDIO (south)

These are scene-design proportions, not hospital building standards. Materials are Poly Haven scans (CC0), regraded."""
import bpy, bmesh, json, math, os, sys, time
import numpy as np
from mathutils import Vector, Matrix
A = sys.argv[sys.argv.index('--') + 1:]; SRC, OUT = A[0], A[1]; FINAL = len(A) > 2 and A[2] == 'final'; PREVIEW = A[3] if len(A) > 3 else None; ONLY = A[4].split(',') if len(A) > 4 else None; STOP = len(A) > 2 and A[2] == 'preview'      # 'preview': render the views and stop, no bake
os.makedirs(OUT, exist_ok=True); TMP = os.path.join(OUT, '_tex'); os.makedirs(TMP, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True); scene = bpy.context.scene
scene.render.engine = 'CYCLES'; scene.cycles.device = 'GPU'
try:
    prefs = bpy.context.preferences.addons['cycles'].preferences; prefs.compute_device_type = 'METAL'; prefs.get_devices()
    for d in prefs.devices: d.use = True
except Exception as e: print('GPU setup:', e)

# ------------------------------------------------------------------ materials
MATS = {}
def tex(asset, kind, size, grade=None):
    """A Poly Haven map, downscaled once to `size` and saved as JPEG. `grade` = (target mean, saturation, contrast, tint)
    regrades a color map. Byte images hold display-encoded values, so the grade is applied to them directly."""
    src = os.path.join(SRC, 'textures', asset, f'{asset}_{kind}.jpg'); tag = ('_g' + '-'.join(str(g) for g in grade[:3]) + ''.join('%02x' % int(c * 255) for c in grade[3])) if grade else ''
    dst = os.path.join(TMP, f'{asset}_{kind}_{size}{tag}.jpg')
    if not os.path.exists(src): return None
    if not os.path.exists(dst):
        im = bpy.data.images.load(src); im.scale(size, size)
        if grade:
            a = np.array(im.pixels[:], dtype=np.float32).reshape(-1, 4); rgb = a[:, :3]
            lum = rgb @ np.array([0.2126, 0.7152, 0.0722], np.float32); rgb = lum[:, None] + (rgb - lum[:, None]) * grade[1]
            rgb = (rgb - rgb.mean()) * grade[2] + grade[0]; a[:, :3] = np.clip(rgb * np.array(grade[3], np.float32), 0, 1); im.pixels.foreach_set(a.ravel())
        im.filepath_raw = dst; im.file_format = 'JPEG'; scene.render.image_settings.quality = 90; im.save(); bpy.data.images.remove(im)
    im = bpy.data.images.load(dst, check_existing=True); im.colorspace_settings.name = 'sRGB' if kind == 'diff' else 'Non-Color'; return im
def mat(name, asset=None, tint=(1, 1, 1), uv_m=2.0, rough=None, rough_mul=1.0, metallic=0.0, size=1024, normal=True, emit=None, emit_strength=0.0, grade=None, nstrength=1.0, vary=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']; m['uv_m'] = uv_m; m['vary'] = vary
    uv = nt.nodes.new('ShaderNodeUVMap'); uv.uv_map = 'UV0'
    b.inputs['Metallic'].default_value = metallic; b.inputs['Roughness'].default_value = rough if rough is not None else 0.6
    if grade and len(grade) < 4: grade = (*grade, (1, 1, 1))
    if asset and tex(asset, 'diff', size, grade):
        t = nt.nodes.new('ShaderNodeTexImage'); t.image = tex(asset, 'diff', size, grade); nt.links.new(uv.outputs[0], t.inputs[0]); nt.links.new(t.outputs[0], b.inputs['Base Color'])
        if rough is None and tex(asset, 'rough', size):
            r = nt.nodes.new('ShaderNodeTexImage'); r.image = tex(asset, 'rough', size); nt.links.new(uv.outputs[0], r.inputs[0]); m['rough_mul'] = rough_mul
            nt.links.new(r.outputs[0], b.inputs['Roughness'])            # the multiplier is applied by the browser (glTF roughness factor)
        if normal and tex(asset, 'nor', size):
            n = nt.nodes.new('ShaderNodeTexImage'); n.image = tex(asset, 'nor', size); nm = nt.nodes.new('ShaderNodeNormalMap'); nm.uv_map = 'UV0'; nm.inputs['Strength'].default_value = nstrength; nt.links.new(uv.outputs[0], n.inputs[0]); nt.links.new(n.outputs[0], nm.inputs['Color']); nt.links.new(nm.outputs[0], b.inputs['Normal'])
    else: b.inputs['Base Color'].default_value = (*tint, 1)
    if emit: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = emit_strength
    MATS[name] = m; return m
HI = 2048 if FINAL else 1024
mat('stone_floor', 'marble_01', uv_m=2.7, size=HI, rough_mul=0.55, grade=(0.73, 0.3, 1.25, (1.0, 0.985, 0.955)), nstrength=0.7, vary=0.05)   # pale honed limestone
mat('stone_pave', 'large_grey_tiles', uv_m=2.4, rough_mul=0.95, grade=(0.6, 0.35, 0.75), vary=0.06)
mat('concrete', 'concrete_wall_008', uv_m=3.2, size=HI, grade=(0.72, 0.22, 0.9, (1.0, 0.988, 0.965)), vary=0.07)                       # fine board-marked concrete, pale
mat('concrete_fine', 'brushed_concrete', uv_m=2.5, grade=(0.76, 0.2, 0.6, (1.0, 0.99, 0.97)), vary=0.05)
mat('plaster', 'plastered_wall_04', uv_m=2.5, grade=(0.88, 0.2, 0.5), vary=0.02)
mat('plaster_warm', 'white_plaster_02', uv_m=2.2, grade=(0.86, 0.45, 0.4, (1.0, 0.985, 0.95)), vary=0.02)
mat('gallery_wall', 'plastered_wall_04', uv_m=2.5, grade=(0.2, 0.2, 0.5, (0.94, 0.97, 1.0)), vary=0.03)
mat('gallery_floor', 'concrete_floor_02', uv_m=3.0, grade=(0.24, 0.2, 0.55), rough_mul=0.42, nstrength=0.5, vary=0.04)
mat('backdrop', None, tint=(0.006, 0.006, 0.008), rough=0.96)
mat('clinical_floor', 'concrete_floor_02', uv_m=3.0, grade=(0.5, 0.14, 0.3, (0.86, 0.95, 1.0)), rough_mul=0.45, normal=False)                    # a mid-toned sheet floor: it anchors the white rooms
mat('stone_dark', 'brushed_concrete', uv_m=1.8, grade=(0.17, 0.15, 0.5), rough_mul=0.45, nstrength=0.4)                                  # dark honed tops in the gallery, so pale anatomy stands off them
mat('ceiling', 'plastered_wall_04', uv_m=2.4, grade=(0.9, 0.15, 0.3))
mat('ceiling_dark', None, tint=(0.018, 0.018, 0.02), rough=0.9)
mat('marble', 'brushed_concrete', uv_m=1.8, grade=(0.84, 0.2, 0.5, (1.0, 0.99, 0.965)), rough_mul=0.5, nstrength=0.4)                # honed stone tops and plinths
mat('oak', 'oak_veneer_01', uv_m=1.6, grade=(0.6, 0.85, 0.9))
mat('oak_dark', 'black_oak_veneer', uv_m=1.6, grade=(0.26, 0.8, 0.9))
mat('oak_floor', 'oak_veneer_01', uv_m=2.2, grade=(0.63, 0.7, 0.8), rough_mul=0.8)
mat('metal_dark', None, tint=(0.05, 0.052, 0.058), rough=0.42, metallic=1.0)
mat('brass', None, tint=(0.83, 0.61, 0.33), rough=0.34, metallic=1.0)
mat('steel', None, tint=(0.72, 0.73, 0.74), rough=0.3, metallic=1.0)
mat('pad', 'leather_white', uv_m=0.8, grade=(0.32, 0.3, 0.8, (0.78, 0.9, 1.0)))
mat('rubber', None, tint=(0.05, 0.052, 0.056), rough=0.8)
mat('pool_basin', None, tint=(0.035, 0.045, 0.05), rough=0.6)
mat('light_panel', None, tint=(1, 1, 1), rough=0.5, emit=(1.0, 0.97, 0.92), emit_strength=3.2)
mat('light_warm', None, tint=(1, 1, 1), rough=0.5, emit=(1.0, 0.82, 0.6), emit_strength=7.0)
mat('screen', None, tint=(0.02, 0.025, 0.03), rough=0.22)
mat('panel', None, tint=(0.62, 0.665, 0.69), rough=0.16)
mat('panel_light', None, tint=(0.84, 0.86, 0.86), rough=0.2)
mat('panel_deep', None, tint=(0.085, 0.115, 0.145), rough=0.13)                                                                                        # back-painted glass wall panels, a cool white
mat('panel_dark', None, tint=(0.05, 0.06, 0.07), rough=0.14)                                                                                      # dark glass: display surrounds, door headers
mat('joint', None, tint=(0.02, 0.024, 0.028), rough=0.8)
mat('or_floor', 'concrete_floor_02', uv_m=3.4, grade=(0.25, 0.1, 0.07, (0.8, 0.93, 1.0)), rough_mul=0.44, normal=False)                           # a dark sheet floor with a soft sheen
mat('canopy', None, tint=(0.8, 0.82, 0.83), rough=0.85)
mat('or_ceiling', None, tint=(0.8, 0.82, 0.83), rough=0.7)
mat('glow_white', None, tint=(1, 1, 1), rough=0.5, emit=(0.93, 0.97, 1.0), emit_strength=6.0)
mat('glow_teal', None, tint=(0.3, 0.8, 0.85), rough=0.5, emit=(0.1, 0.72, 0.8), emit_strength=9.0)
mat('glow_green', None, tint=(0.2, 0.9, 0.4), rough=0.5, emit=(0.1, 0.9, 0.3), emit_strength=4.0)
mat('glow_amber', None, tint=(1.0, 0.6, 0.2), rough=0.5, emit=(1.0, 0.55, 0.1), emit_strength=4.0)

# ------------------------------------------------------------------ geometry helpers
PARTS, COLLIDERS = [], []
GLASS, STATIONS, LIGHTS, ROOMS, PROPS, SIGNS, LAMP_OBJS = [], {}, [], {}, [], [], []
def box(x0, y0, z0, x1, y1, z1, m, collide=None, rot=0.0, about=None, omit=''):
    """A box in meters, optionally turned about a vertical axis. `omit` drops faces nobody can see ('t' top, 'b' bottom)
    so that they take no room in the lightmap. Tall solid things collide by default."""
    me = bpy.data.meshes.new('b'); bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0); bm.normal_update()
    if omit: bmesh.ops.delete(bm, geom=[f for f in bm.faces if ('t' in omit and f.normal.z > 0.9) or ('b' in omit and f.normal.z < -0.9)], context='FACES')
    sx, sy, sz = abs(x1 - x0), abs(y1 - y0), abs(z1 - z0); cx, cy, cz = (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2
    for v in bm.verts: v.co = Vector((cx + v.co.x * sx, cy + v.co.y * sy, cz + v.co.z * sz))
    if rot:
        c = Vector(about) if about else Vector((cx, cy, 0)); bmesh.ops.transform(bm, matrix=Matrix.Translation(c) @ Matrix.Rotation(rot, 4, 'Z') @ Matrix.Translation(-c), verts=bm.verts)
    bm.to_mesh(me); bm.free(); o = bpy.data.objects.new('b', me); scene.collection.objects.link(o); me.materials.append(MATS[m]); PARTS.append(o)
    if collide is None: collide = sz > 0.45 and min(z0, z1) < 1.6 and not rot
    if collide: COLLIDERS.append([round(min(x0, x1), 3), round(min(y0, y1), 3), round(max(x0, x1), 3), round(max(y0, y1), 3), round(min(z0, z1), 2), round(max(z0, z1), 2)])
    return o
def trim(axis, a, b, w, t, h, sill, kind):
    """What lines an opening from a..b in a wall whose near face is at w and whose thickness is t. kind: 'open' nothing,
    'door' a slim dark frame at the middle of the reveal, 'window'/'smoked' the same with a sill rail and glass, 'portal' thin brass lining."""
    P = (lambda u0, v0, z0, u1, v1, z1, m: box(u0, v0, z0, u1, v1, z1, m, collide=False)) if axis == 'x' else (lambda u0, v0, z0, u1, v1, z1, m: box(v0, u0, z0, v1, u1, z1, m, collide=False))
    c = w + t / 2
    if kind in ('door', 'window', 'smoked'):
        f = 0.05; P(a, c - 0.04, sill, a + f, c + 0.04, h, 'metal_dark'); P(b - f, c - 0.04, sill, b, c + 0.04, h, 'metal_dark'); P(a + f, c - 0.04, h - f, b - f, c + 0.04, h, 'metal_dark')
        if kind != 'door':
            P(a + f, c - 0.04, sill, b - f, c + 0.04, sill + f, 'metal_dark')
            g = [a + f, c - 0.006, sill + f, b - f, c + 0.006, h - f] if axis == 'x' else [c - 0.006, a + f, sill + f, c + 0.006, b - f, h - f]; GLASS.append(g + ['smoked' if kind == 'smoked' else 'clear'])
    elif kind == 'portal':
        g = 0.008; P(a, w - 0.012, sill, a + g, w + t + 0.012, h, 'brass'); P(b - g, w - 0.012, sill, b, w + t + 0.012, h, 'brass'); P(a + g, w - 0.012, h - g, b - g, w + t + 0.012, h, 'brass')
def wall_x(y, x0, x1, z1, m, t=0.4, openings=(), z0=0.0):
    """A wall running east-west whose south face is at y, thickness t northwards. openings = [(xa, xb, head, sill, kind)]."""
    xs = [x0]
    for (a, b_, h, s, k) in sorted(openings): xs += [a, b_]
    xs.append(x1)
    for i in range(0, len(xs), 2):
        if xs[i + 1] - xs[i] > 0.01: box(xs[i], y, z0, xs[i + 1], y + t, z1, m)
    for (a, b_, h, s, k) in openings:
        if z1 - h > 0.01: box(a, y, h, b_, y + t, z1, m, collide=False)
        if s > 0.01: box(a, y, z0, b_, y + t, s, m, collide=True)
        trim('x', a, b_, y, t, h, s, k)
def wall_y(x, y0, y1, z1, m, t=0.4, openings=(), z0=0.0):
    """A wall running north-south whose west face is at x, thickness t eastwards. openings = [(ya, yb, head, sill, kind)]."""
    ys = [y0]
    for (a, b_, h, s, k) in sorted(openings): ys += [a, b_]
    ys.append(y1)
    for i in range(0, len(ys), 2):
        if ys[i + 1] - ys[i] > 0.01: box(x, ys[i], z0, x + t, ys[i + 1], z1, m)
    for (a, b_, h, s, k) in openings:
        if z1 - h > 0.01: box(x, a, h, x + t, b_, z1, m, collide=False)
        if s > 0.01: box(x, a, z0, x + t, b_, s, m, collide=True)
        trim('y', a, b_, x, t, h, s, k)
def plate(text, x, y, z, face, w=0.42, h=0.1, style='plate'):
    """A small brass plate on a wall; the browser engraves the words. face: the compass direction the plate looks toward."""
    d = 0.012
    if style == 'plate':
        if face in 'NS': box(x - w / 2, y - (d if face == 'S' else 0), z - h / 2, x + w / 2, y + (0 if face == 'S' else d), z + h / 2, 'brass', collide=False)
        else: box(x - (d if face == 'W' else 0), y - w / 2, z - h / 2, x + (0 if face == 'W' else d), y + w / 2, z + h / 2, 'brass', collide=False)
    off = {'S': (0, -d - 0.001), 'N': (0, d + 0.001), 'W': (-d - 0.001, 0), 'E': (d + 0.001, 0)}[face]
    SIGNS.append({'text': text, 'at': [x + off[0], y + off[1], z], 'face': face, 'w': w, 'h': h, 'style': style})

# ------------------------------------------------------------------ the building
T = 0.4
# --- LIGHT COURT: x -4.5..4.5, y 0..22, 7 m tall
ROOMS['court'] = [-4.5, 0, 4.5, 22, 7.0, 'stone', 0.95]
box(-4.9, -0.4, -0.3, 4.9, 22.4, 0.0, 'stone_floor', collide=False, omit='b')
# south wall: the entrance (2.6 x 2.7 m), and above the vestibule roof a tall window that throws a shaft of light down the axis
box(-4.9, -0.4, 0, -1.6, 0.0, 7.0, 'concrete'); box(1.6, -0.4, 0, 4.9, 0.0, 7.0, 'concrete')
box(-1.6, -0.4, 0, -1.3, 0.0, 2.7, 'concrete'); box(1.3, -0.4, 0, 1.6, 0.0, 2.7, 'concrete')
box(-1.6, -0.4, 2.7, 1.6, 0.0, 3.5, 'concrete', collide=False); box(-1.6, -0.4, 6.4, 1.6, 0.0, 7.0, 'concrete', collide=False)
trim('x', -1.3, 1.3, -0.4, T, 2.7, 0, 'door'); trim('x', -1.6, 1.6, -0.4, T, 6.4, 3.5, 'window')
for x in (-0.53, 0.53): box(x - 0.02, -0.24, 3.55, x + 0.02, -0.16, 6.35, 'metal_dark', collide=False)
for sx in (-1, 1):                                                                                  # two glass leaves, standing open into the court
    x = sx * 1.3; xa, xb = x - 0.02, x + 0.02
    box(xa, 0.02, 0.0, xb, 0.07, 2.62, 'metal_dark', collide=False); box(xa, 1.2, 0.0, xb, 1.25, 2.62, 'metal_dark', collide=False)
    box(xa, 0.07, 0.0, xb, 1.2, 0.06, 'metal_dark', collide=False); box(xa, 0.07, 2.56, xb, 1.2, 2.62, 'metal_dark', collide=False)
    GLASS.append([x - 0.006, 0.07, 0.06, x + 0.006, 1.2, 2.56, 'clear']); COLLIDERS.append([xa, 0.02, xb, 1.25, 0, 2.62])
    box(x - sx * 0.07, 1.04, 0.85, x - sx * 0.045, 1.07, 1.45, 'steel', collide=False)
wall_x(22.0, -4.9, 4.9, 7.0, 'concrete', openings=[(-1.7, 1.7, 3.4, 0, 'portal')])                 # north: the portal to the gallery
wall_y(-4.9, 0, 22, 7.0, 'concrete', openings=[(5.3, 6.9, 2.4, 0, 'door'), (14.4, 16.0, 2.4, 0, 'door'), (20.5, 21.9, 2.4, 0, 'door')])                       # west: pre-op, regional room, labor room
wall_y(4.5, 0, 22, 7.0, 'concrete', openings=[(0.6, 2.0, 2.4, 0, 'door'), (4.9, 6.1, 2.4, 0, 'door'), (13.2, 14.9, 2.4, 0, 'door'), (15.8, 19.2, 2.3, 0.95, 'smoked'), (20.5, 21.9, 2.4, 0, 'door')])   # east: procedure room, studio, OR door, OR observation window, endoscopy
# roof: a slab with one long opening, crossed by deep pale fins
box(-4.9, -0.4, 7.0, -2.9, 22.4, 7.5, 'concrete_fine', collide=False, omit='t'); box(2.9, -0.4, 7.0, 4.9, 22.4, 7.5, 'concrete_fine', collide=False, omit='t')
box(-2.9, -0.4, 7.0, 2.9, 2.6, 7.5, 'concrete_fine', collide=False, omit='t'); box(-2.9, 19.4, 7.0, 2.9, 22.4, 7.5, 'concrete_fine', collide=False, omit='t')
for i in range(1, 8): yb = 2.6 + i * 2.1; box(-2.9, yb - 0.1, 6.3, 2.9, yb + 0.1, 7.5, 'plaster', collide=False)
box(-3.02, 2.6, 7.5, -2.9, 19.4, 7.62, 'metal_dark', collide=False); box(2.9, 2.6, 7.5, 3.02, 19.4, 7.62, 'metal_dark', collide=False); GLASS.append([-2.9, 2.6, 7.55, 2.9, 19.4, 7.58, 'roof'])
# the axis: two brass inlays in the floor from the door to the portal; a datum line round the walls at 1.1 m (the section-plane motif)
for x in (-1.25, 1.25): box(x - 0.012, 0.1, 0.0, x + 0.012, 21.9, 0.003, 'brass', collide=False)
box(-4.5, 0.0, 1.1, -4.49, 5.2, 1.122, 'brass', collide=False); box(-4.5, 7.0, 1.1, -4.49, 14.3, 1.122, 'brass', collide=False); box(-4.5, 16.1, 1.1, -4.49, 20.4, 1.122, 'brass', collide=False)
box(4.49, 0.0, 1.1, 4.5, 0.5, 1.122, 'brass', collide=False); box(4.49, 2.1, 1.1, 4.5, 4.8, 1.122, 'brass', collide=False); box(4.49, 6.2, 1.1, 4.5, 13.1, 1.122, 'brass', collide=False)
# the focal object stands on a low stone plinth under the skylight
box(-0.95, 8.75, 0.0, 0.95, 10.65, 0.42, 'marble', collide=True); box(-0.99, 8.71, 0.42, 0.99, 10.69, 0.44, 'brass', collide=False); box(-0.95, 8.75, 0.44, 0.95, 10.65, 0.5, 'marble', collide=False)
STATIONS['atrium'] = {'at': [0.0, 6.9], 'look': [0.0, 9.7, 1.45], 'label': 'The sectioned figure', 'mount': [0.0, 9.7, 0.5]}
plate('THE SECTIONED FIGURE', 0.0, 8.75, 0.3, 'S', w=0.62, h=0.07)
# a long stone bench on dark steel, west side; a stone orientation table near the entrance
for (ya, yb_) in ((2.0, 4.7), (7.6, 11.2)): box(-4.2, ya, 0.40, -3.55, yb_, 0.48, 'marble', collide=False); COLLIDERS.append([-4.2, ya, -3.55, yb_, 0, 0.5])      # two benches, leaving the way to pre-op clear
for yb in (2.3, 4.4, 7.9, 9.4, 10.9): box(-4.12, yb - 0.03, 0.0, -3.63, yb + 0.03, 0.40, 'metal_dark', collide=False)
box(2.25, 2.05, 0.0, 3.35, 2.65, 0.9, 'marble'); box(2.21, 2.01, 0.9, 3.39, 2.69, 0.92, 'brass', collide=False); box(2.2, 2.0, 0.92, 3.4, 2.7, 0.97, 'marble', collide=False)
STATIONS['orientation'] = {'at': [2.8, 1.45], 'look': [2.8, 2.35, 0.95], 'label': 'Choose a session', 'top': [2.8, 2.35, 0.97]}
for (px, py, plant) in ((-3.9, 12.6, 'potted_plant_02'), (-3.9, 19.3, 'potted_plant_01'), (3.9, 9.4, 'potted_plant_04'), (3.9, 19.75, 'potted_plant_02'), (-3.9, 1.0, 'potted_plant_01')):
    box(px - 0.42, py - 0.42, 0.0, px + 0.42, py + 0.42, 0.5, 'concrete_fine'); PROPS.append((plant, px, py, 0.5, py * 1.3, 1.5 if plant != 'potted_plant_04' else 1.25))
PROPS += [('modern_arm_chair_01', 3.55, 11.0, 0.0, -1.15, 1.0), ('modern_arm_chair_01', 3.55, 13.0, 0.0, -2.0, 1.0), ('side_table_01', 3.85, 12.0, 0.0, 0.0, 1.0), ('ceramic_vase_03', 3.85, 12.0, 0.55, 0.6, 1.0)]
COLLIDERS += [[3.1, 10.55, 4.0, 11.45, 0, 0.8], [3.1, 12.55, 4.0, 13.45, 0, 0.8], [3.6, 11.75, 4.1, 12.25, 0, 0.55]]
plate('PRE-OP HOLDING', -4.5, 7.3, 1.5, 'E'); plate('ANATOMY GALLERY', 2.25, 22.0, 1.5, 'S'); plate('REGIONAL PRACTICE', -4.5, 16.45, 1.5, 'E'); plate('OPERATING ROOM', 4.5, 12.75, 1.5, 'W'); plate('STUDY STUDIO', 4.5, 6.55, 1.5, 'W'); plate('ENDOSCOPY', 4.5, 20.2, 1.5, 'W'); plate('LABOUR AND DELIVERY', -4.5, 20.15, 1.5, 'E', w=0.56); plate('PROCEDURE ROOM', 4.5, 2.4, 1.5, 'W')
# --- ARRIVAL: a low vestibule, then the forecourt and its pool
ROOMS['arrival'] = [-2.6, -4.6, 2.6, -0.4, 2.8, 'stone', 0.66]
box(-3.0, -4.6, -0.3, 3.0, -0.4, 0.0, 'stone_floor', collide=False, omit='b'); wall_y(-3.0, -4.6, -0.4, 2.8, 'concrete'); wall_y(2.6, -4.6, -0.4, 2.8, 'concrete'); box(-3.4, -5.4, 2.8, 3.4, -0.4, 3.2, 'concrete_fine', collide=False)
box(-1.0, -3.9, 0.0, 1.0, -2.7, 0.004, 'rubber', collide=False); box(-0.05, -4.2, 2.79, 0.05, -0.8, 2.8, 'light_warm', collide=False)
ROOMS['forecourt'] = [-9.0, -15.0, 9.0, -4.6, 0, 'pave', 0.4]
for (a, b_, c, d) in ((-9.0, -15.0, 9.0, -12.0), (-9.0, -6.2, 9.0, -4.6), (-9.0, -12.0, -8.2, -6.2), (-2.4, -12.0, 9.0, -6.2)): box(a, b_, -0.5, c, d, 0.0, 'stone_pave', collide=False, omit='b')
box(-8.2, -12.0, -0.5, -2.4, -6.2, -0.42, 'pool_basin', collide=False, omit='b'); COLLIDERS.append([-8.25, -12.05, -2.35, -6.15, 0, 0.3])
for (a, b_, c, d) in ((-8.36, -12.16, -2.24, -12.0), (-8.36, -6.2, -2.24, -6.04), (-8.36, -12.0, -8.2, -6.2), (-2.4, -12.0, -2.24, -6.2)): box(a, b_, -0.08, c, d, 0.035, 'marble', collide=False)
POOL = [-8.2, -12.0, -2.4, -6.2, -0.07]
wall_y(-9.4, -15.0, -4.6, 1.1, 'concrete'); wall_y(9.0, -15.0, -4.6, 1.1, 'concrete'); wall_x(-15.4, -9.4, 9.4, 1.1, 'concrete', openings=[(-2.2, 2.2, 1.1, 0, 'open')])
wall_x(-5.0, -9.4, -3.0, 4.0, 'concrete'); wall_x(-5.0, 3.0, 9.4, 4.0, 'concrete')
box(3.6, -11.5, 0.0, 7.4, -7.0, 0.45, 'concrete_fine', collide=True); PROPS.append(('potted_plant_04', 5.5, -9.2, 0.45, 0.4, 2.2)); box(4.4, -14.1, 0.36, 7.6, -13.5, 0.44, 'marble', collide=False); COLLIDERS.append([4.4, -14.1, 7.6, -13.5, 0, 0.45])
for xb in (4.7, 6.0, 7.3): box(xb - 0.03, -14.02, 0.0, xb + 0.03, -13.58, 0.36, 'metal_dark', collide=False)
plate('WORDMARK', 6.2, -5.0, 2.35, 'S', w=4.2, h=0.62, style='wordmark')
# --- ANATOMY GALLERY: x -5..5, y 22.4..31.4, 4.2 m, dark
ROOMS['gallery'] = [-5.0, 22.4, 5.0, 31.4, 4.2, 'concrete', 1.6]
box(-5.4, 22.4, -0.3, 5.4, 31.8, 0.0, 'gallery_floor', collide=False, omit='b'); box(-5.4, 22.4, 4.2, 5.4, 31.8, 4.6, 'ceiling_dark', collide=False, omit='t')
wall_x(31.4, -5.4, 5.4, 4.2, 'gallery_wall'); wall_y(-5.4, 22.4, 31.4, 4.2, 'gallery_wall'); wall_y(5.0, 22.4, 31.4, 4.2, 'gallery_wall')
box(-5.0, 22.4, 0.0, -1.72, 22.42, 4.2, 'gallery_wall', collide=False); box(1.72, 22.4, 0.0, 5.0, 22.42, 4.2, 'gallery_wall', collide=False); box(-1.72, 22.4, 3.41, 1.72, 22.42, 4.2, 'gallery_wall', collide=False)   # the court wall is dark on this side
def mount(cx, cy, w, d, h, key, label, sign):
    box(cx - w / 2, cy - d / 2, 0.0, cx + w / 2, cy + d / 2, h - 0.06, 'metal_dark'); box(cx - w / 2 - 0.02, cy - d / 2 - 0.02, h - 0.06, cx + w / 2 + 0.02, cy + d / 2 + 0.02, h - 0.045, 'brass', collide=False); box(cx - w / 2, cy - d / 2, h - 0.045, cx + w / 2, cy + d / 2, h, 'stone_dark', collide=False)
    STATIONS[key] = {'at': [cx, cy - d / 2 - 1.2], 'look': [cx, cy, h + 0.42], 'label': label, 'mount': [cx, cy, h]}
    plate(sign, cx, cy - d / 2, h - 0.2, 'S', w=min(w - 0.1, 0.62), h=0.07)
mount(0.0, 28.6, 1.5, 0.9, 0.98, 'plexus', 'Examine the brachial plexus', 'BRACHIAL PLEXUS  ·  RIGHT')
box(-1.5, 30.2, 0.25, 1.5, 30.26, 3.2, 'backdrop', collide=False); box(-1.53, 30.26, 0.22, 1.53, 30.28, 3.23, 'brass', collide=False)
mount(-3.3, 26.0, 0.8, 0.8, 1.06, 'airway', 'Airway and neck: scan and structure', 'AIRWAY AND NECK  ·  CT')
box(-4.99, 25.1, 0.95, -4.955, 26.9, 2.25, 'screen', collide=False); box(-5.0, 25.07, 0.92, -4.985, 26.93, 2.28, 'brass', collide=False)          # a lightbox on the west wall: the browser shows a slice of the scan on it
SIGNS.append({'text': 'LIGHTBOX', 'at': [-4.954, 26.0, 1.6], 'face': 'E', 'w': 1.74, 'h': 1.24, 'style': 'lightbox'})
# the examination table: a stone slab on a steel frame, for the regional case
box(-3.9, 29.1, 0.86, -1.9, 30.0, 0.92, 'stone_dark', collide=False); COLLIDERS.append([-3.9, 29.1, -1.9, 30.0, 0, 0.92])
for (lx, ly) in ((-3.8, 29.2), (-2.0, 29.2), (-3.8, 29.9), (-2.0, 29.9)): box(lx - 0.03, ly - 0.03, 0, lx + 0.03, ly + 0.03, 0.86, 'metal_dark', collide=False)
STATIONS['regional_case'] = {'at': [-2.9, 28.1], 'look': [-2.9, 29.55, 1.0], 'label': 'Regional reasoning: four ways in', 'top': [-2.9, 29.55, 0.92]}; plate('REGIONAL CASE', -2.9, 29.1, 0.89, 'S', w=0.5, h=0.045)
# the mirror station: a tall dark glass on the east wall with a small control pedestal
box(4.955, 27.6, 0.2, 4.99, 29.4, 2.6, 'screen', collide=False); box(4.985, 27.57, 0.17, 5.0, 29.43, 2.63, 'brass', collide=False); box(4.1, 28.25, 0.0, 4.4, 28.75, 0.95, 'metal_dark'); box(4.08, 28.23, 0.95, 4.42, 28.77, 0.97, 'brass', collide=False)
STATIONS['mirror'] = {'at': [3.2, 28.5], 'look': [4.95, 28.5, 1.5], 'label': 'Mirror station'}; plate('MIRROR', 4.25, 28.25, 0.75, 'S', w=0.24, h=0.07)
box(2.3, 23.3, 0.4, 4.3, 23.85, 0.47, 'stone_dark', collide=False); COLLIDERS.append([2.3, 23.3, 4.3, 23.85, 0, 0.47])
for xb in (2.5, 3.3, 4.1): box(xb - 0.03, 23.38, 0.0, xb + 0.03, 23.77, 0.4, 'metal_dark', collide=False)
for (lx, ly) in ((0.0, 27.1), (-1.0, 27.3), (1.0, 27.3), (-3.3, 24.9), (-2.9, 28.4), (3.9, 27.4)): box(lx - 0.05, ly - 0.05, 3.98, lx + 0.05, ly + 0.05, 4.2, 'metal_dark', collide=False)
box(-4.0, 27.18, 4.14, 4.0, 27.22, 4.2, 'metal_dark', collide=False); box(-4.0, 24.88, 4.14, -2.0, 24.92, 4.2, 'metal_dark', collide=False)
# --- the two clinical rooms share a wall system: pale back-painted glass panels on a dark backing, so every joint reads as a fine shadow line
def panels(axis, w, a, b, z0, z1, face, m='panel', module=1.2, t=0.016, gap=0.007, back=0.004):
    """Line a wall with panels. axis 'x': the wall runs east-west at y = w; 'y': north-south at x = w. face: +1 or -1, the way the panels look."""
    P = (lambda u0, v0, zz0, u1, v1, zz1, mm: box(u0, v0, zz0, u1, v1, zz1, mm, collide=False)) if axis == 'x' else (lambda u0, v0, zz0, u1, v1, zz1, mm: box(v0, u0, zz0, v1, u1, zz1, mm, collide=False))
    P(a, w, z0, b, w + face * back, z1, 'joint'); n = max(1, round((b - a) / module)); step = (b - a) / n
    for i in range(n): P(a + i * step + gap / 2, w + face * back, z0 + gap / 2, a + (i + 1) * step - gap / 2, w + face * (back + t), z1 - gap / 2, m)
def lining(axis, w, a, b, face, h=3.0, split=2.26, skirt='or_floor', openings=(), m='panel'):
    """A whole wall of panels in two tiers over a coved skirting, leaving out door and window openings [(a, b, sill, head)]."""
    cuts = sorted(openings); edges = [a] + [v for c in cuts for v in c[:2]] + [b]
    P = (lambda u0, v0, zz0, u1, v1, zz1, mm: box(u0, v0, zz0, u1, v1, zz1, mm, collide=False)) if axis == 'x' else (lambda u0, v0, zz0, u1, v1, zz1, mm: box(v0, u0, zz0, v1, u1, zz1, mm, collide=False))
    for i in range(0, len(edges), 2):
        if edges[i + 1] - edges[i] > 0.05: panels(axis, w, edges[i], edges[i + 1], 0.1, split, face, m); panels(axis, w, edges[i], edges[i + 1], split, h, face, m); P(edges[i], w, 0.0, edges[i + 1], w + face * 0.024, 0.1, skirt)
    for (oa, ob, sill, head) in cuts:
        if sill > 0.15: panels(axis, w, oa, ob, 0.1, sill, face, m); P(oa, w, 0.0, ob, w + face * 0.024, 0.1, skirt)
        if h - head > 0.05: panels(axis, w, oa, ob, head, h, face, m)
# --- PRE-OP HOLDING: x -10.7..-4.9, y 2.6..9.6, 3 m. Four curtained bays, two a side; the aisle between them leads from the court to the day's schedule.
ROOMS['preop'] = [-10.7, 2.6, -4.9, 9.6, 3.0, 'vinyl', 0.66]
box(-11.1, 2.2, -0.3, -4.9, 10.0, 0.0, 'clinical_floor', collide=False, omit='b'); box(-11.1, 2.2, 3.0, -4.9, 10.0, 3.4, 'ceiling', collide=False, omit='t')
wall_x(2.2, -11.1, -4.9, 3.0, 'plaster'); wall_x(9.6, -11.1, -4.9, 3.0, 'plaster'); wall_y(-11.1, 2.2, 10.0, 3.0, 'plaster')
lining('x', 2.6, -10.7, -4.9, 1, skirt='clinical_floor', m='panel_light'); lining('x', 9.6, -10.7, -4.9, -1, skirt='clinical_floor', m='panel_light'); lining('y', -10.7, 2.6, 9.6, 1, skirt='clinical_floor', m='panel_light'); lining('y', -4.9, 2.6, 9.6, -1, skirt='clinical_floor', openings=[(5.3, 6.9, 0.0, 2.4)], m='panel_light')
def headwall(cx, y, f, n):
    """A bay's head wall on a wall at y that looks along f (+1 north, -1 south): oak, a services rail, a reading light, and a small bay display the browser writes on."""
    q = lambda a_, b_: (min(y + f * a_, y + f * b_), max(y + f * a_, y + f * b_))
    (y0, y1) = q(0.02, 0.05); box(cx - 1.25, y0, 0.1, cx + 1.25, y1, 2.32, 'oak', collide=False); (y0, y1) = q(0.05, 0.085); box(cx - 1.15, y0, 1.3, cx + 1.15, y1, 1.47, 'steel', collide=False)
    (y0, y1) = q(0.085, 0.09); box(cx - 1.15, y0, 1.375, cx + 1.15, y1, 1.395, 'metal_dark', collide=False)
    for i, mm in enumerate(('glow_green', 'steel', 'steel', 'glow_amber')):
        (y0, y1) = q(0.085, 0.098); box(cx - 0.75 + i * 0.3, y0, 1.415, cx - 0.65 + i * 0.3, y1, 1.455, 'steel', collide=False); (y0, y1) = q(0.098, 0.103); box(cx - 0.72 + i * 0.3, y0, 1.426, cx - 0.68 + i * 0.3, y1, 1.444, mm if mm.startswith('glow') else 'metal_dark', collide=False)
    (y0, y1) = q(0.05, 0.13); box(cx - 0.55, y0, 2.02, cx + 0.55, y1, 2.07, 'steel', collide=False); (y0, y1) = q(0.06, 0.12); box(cx - 0.51, y0, 2.012, cx + 0.51, y1, 2.02, 'light_warm', collide=False)
    (y0, y1) = q(0.05, 0.075); box(cx + 0.62, y0, 1.56, cx + 1.14, y1, 1.9, 'panel_dark', collide=False); (y0, y1) = q(0.075, 0.079); box(cx + 0.64, y0, 1.58, cx + 1.12, y1, 1.88, 'screen', collide=False)
    SIGNS.append({'text': 'BAY%d' % n, 'at': [cx + 0.88, y + f * 0.0795, 1.73], 'face': 'S' if f < 0 else 'N', 'w': 0.48, 'h': 0.3, 'style': 'bay%d' % n})
PREOP_TOP = 0.74
for n, (cx, north) in enumerate(((-9.3, True), (-6.4, True), (-9.3, False), (-6.4, False)), 1):
    wall, f = (9.6, -1) if north else (2.6, 1); headwall(cx, wall, f, n); yb = wall + f * 1.32
    STATIONS['bay%d' % n] = {'at': [cx + 0.2, wall + f * 2.95], 'look': [cx, yb, 0.95], 'label': 'Bay %d' % n, 'bed': [cx, yb, PREOP_TOP], 'turn': 0.0 if north else math.pi}
    box(cx - 0.6, yb - 0.3, 2.97, cx + 0.6, yb + 0.3, 3.0, 'light_panel', collide=False)
box(-10.676, 4.85, 0.98, -10.64, 7.35, 2.36, 'panel_dark', collide=False); box(-10.641, 4.95, 1.06, -10.625, 7.25, 2.28, 'screen', collide=False)          # the day's schedule, on the west wall at the end of the aisle
SIGNS.append({'text': 'SCHEDULE', 'at': [-10.624, 6.1, 1.67], 'face': 'E', 'w': 2.3, 'h': 1.22, 'style': 'schedule'})
STATIONS['schedule'] = {'at': [-8.0, 6.6], 'look': [-10.62, 6.6, 1.6], 'label': 'Today\'s schedule'}      # far enough back for the whole board, and half a meter to its right so the board sits clear of the panel
box(-7.9, 5.8, 2.97, -6.7, 6.4, 3.0, 'light_panel', collide=False)
box(-4.94, 3.62, 0.04, -4.985, 5.26, 2.38, 'steel', collide=False); box(-4.99, 3.8, 1.0, -4.935, 5.08, 2.2, 'panel_dark', collide=False); box(-4.94, 3.5, 2.4, -5.04, 7.0, 2.56, 'panel_dark', collide=False)         # sliding door, open along the wall
box(-5.045, 6.0, 2.47, -5.04, 6.04, 2.49, 'glow_green', collide=False)
# --- REGIONAL PRACTICE ROOM: x -11.5..-4.9, y 12..18.5, 3 m. A curtained block bay against a timber head wall; daylight from the west.
ROOMS['regional'] = [-11.5, 12.0, -4.9, 18.5, 3.0, 'vinyl', 0.66]
box(-11.9, 11.6, -0.3, -4.9, 18.9, 0.0, 'clinical_floor', collide=False, omit='b'); box(-11.9, 11.6, 3.0, -4.9, 18.9, 3.4, 'ceiling', collide=False, omit='t')
wall_x(11.6, -11.9, -4.9, 3.0, 'plaster'); wall_x(18.5, -11.9, -4.9, 3.0, 'plaster'); wall_y(-11.9, 11.6, 18.9, 3.0, 'plaster', openings=[(13.6, 16.9, 2.5, 0.9, 'window')])
lining('x', 12.0, -11.5, -4.9, 1, skirt='clinical_floor', m='panel_light'); lining('x', 18.5, -11.5, -4.9, -1, skirt='clinical_floor', m='panel_light'); lining('y', -11.5, 12.0, 18.5, 1, skirt='clinical_floor', openings=[(13.6, 16.9, 0.9, 2.5)], m='panel_light'); lining('y', -4.9, 12.0, 18.5, -1, skirt='clinical_floor', openings=[(14.4, 16.0, 0.0, 2.4)], m='panel_light')
box(-10.35, 12.02, 0.1, -7.45, 12.05, 2.32, 'oak', collide=False); box(-10.35, 12.05, 2.32, -7.45, 12.062, 2.335, 'steel', collide=False)                       # the head wall: oak veneer, a services rail, a reading light
box(-10.2, 12.05, 1.3, -7.6, 12.085, 1.47, 'steel', collide=False); box(-10.2, 12.085, 1.375, -7.6, 12.09, 1.395, 'metal_dark', collide=False)
for i, mm in enumerate(('glow_green', 'steel', 'steel', 'glow_amber', 'steel')): box(-9.3 + i * 0.3, 12.085, 1.415, -9.2 + i * 0.3, 12.098, 1.455, mm if not mm.startswith('glow') else 'steel', collide=False); box(-9.27 + i * 0.3, 12.098, 1.426, -9.23 + i * 0.3, 12.103, 1.444, mm if mm.startswith('glow') else 'metal_dark', collide=False)
box(-9.5, 12.05, 2.02, -8.3, 12.13, 2.07, 'steel', collide=False); box(-9.46, 12.06, 2.012, -8.34, 12.12, 2.02, 'light_warm', collide=False)
box(-5.66, 12.06, 0.0, -4.96, 13.7, 0.9, 'panel_light'); box(-5.68, 12.04, 0.9, -4.94, 13.72, 0.93, 'steel', collide=False); box(-5.6, 12.1, 0.0, -5.0, 13.66, 0.08, 'metal_dark', collide=False)                # supply counter with drawers
for i in range(3):
    for j in range(2): box(-5.668, 12.1 + i * 0.53, 0.13 + j * 0.38, -5.66, 12.6 + i * 0.53, 0.47 + j * 0.38, 'panel_light', collide=False); box(-5.684, 12.25 + i * 0.53, 0.4 + j * 0.38, -5.668, 12.45 + i * 0.53, 0.415 + j * 0.38, 'steel', collide=False)
box(-5.5, 12.03, 1.45, -4.93, 13.7, 2.2, 'panel_light', collide=False); box(-5.508, 12.06, 1.47, -5.5, 13.67, 2.18, 'screen', collide=False)                              # wall cupboard over it, dark glass doors
box(-10.2, 18.44, 1.0, -7.6, 18.476, 2.3, 'screen', collide=False); box(-10.28, 18.45, 0.92, -7.52, 18.48, 2.38, 'panel_dark', collide=False)       # wall display
SIGNS.append({'text': 'DISPLAY', 'at': [-8.9, 18.439, 1.65], 'face': 'S', 'w': 2.56, 'h': 1.26, 'style': 'display'})
STATIONS['regional'] = {'at': [-7.3, 15.3], 'look': [-8.9, 13.4, 1.0], 'label': 'Regional practice room', 'table': [-8.9, 13.42]}
for (cx, cy) in ((-8.9, 13.5), (-6.4, 13.2), (-10.6, 16.6), (-6.4, 17.0), (-8.6, 16.6)): box(cx - 0.6, cy - 0.3, 2.97, cx + 0.6, cy + 0.3, 3.0, 'light_panel', collide=False)
box(-4.94, 12.72, 0.04, -4.985, 14.36, 2.38, 'steel', collide=False); box(-4.99, 12.9, 1.0, -4.935, 14.18, 2.2, 'panel_dark', collide=False); box(-4.94, 12.6, 2.4, -5.04, 16.1, 2.56, 'panel_dark', collide=False)    # the door slides open along the wall on a top track
box(-5.045, 14.25, 2.47, -5.04, 14.29, 2.49, 'glow_green', collide=False)
# --- OPERATING ROOM: x 4.9..12, y 11.5..19.6, 3 m. Panelled walls, a laminar-flow ceiling over the table, a dark sheet floor, a cool light cove.
ROOMS['or'] = [4.9, 11.5, 12.0, 19.6, 3.0, 'vinyl', 0.6]
box(4.9, 11.1, -0.3, 12.4, 20.0, 0.0, 'or_floor', collide=False, omit='b'); box(4.9, 11.1, 3.0, 12.4, 20.0, 3.4, 'or_ceiling', collide=False, omit='t')
wall_x(11.1, 4.9, 12.4, 3.0, 'plaster'); wall_x(19.6, 4.9, 12.4, 3.0, 'plaster'); wall_y(12.0, 11.1, 20.0, 3.0, 'plaster')
lining('x', 11.5, 4.9, 12.0, 1); lining('x', 19.6, 4.9, 12.0, -1, m='panel_deep'); lining('y', 12.0, 11.5, 19.6, -1); lining('y', 4.9, 11.5, 19.6, 1, openings=[(13.2, 14.9, 0.0, 2.4), (15.8, 19.2, 0.95, 2.3)])
OC = (8.6, 15.6)                                                                                     # the table's center, and the canopy's
box(OC[0] - 1.62, OC[1] - 1.62, 2.9, OC[0] + 1.62, OC[1] + 1.62, 3.0, 'steel', collide=False, omit='t'); box(OC[0] - 1.56, OC[1] - 1.56, 2.893, OC[0] + 1.56, OC[1] + 1.56, 2.9, 'glow_white', collide=False, omit='t')        # the canopy: a ring of light round a field of diffusers
box(OC[0] - 1.42, OC[1] - 1.42, 2.885, OC[0] + 1.42, OC[1] + 1.42, 2.894, 'canopy', collide=False, omit='t')
for i in range(1, 4):
    u = -1.42 + i * 0.71; box(OC[0] + u - 0.012, OC[1] - 1.42, 2.88, OC[0] + u + 0.012, OC[1] + 1.42, 2.886, 'steel', collide=False, omit='t'); box(OC[0] - 1.42, OC[1] + u - 0.012, 2.88, OC[0] + 1.42, OC[1] + u + 0.012, 2.886, 'steel', collide=False, omit='t')
for (cx, cy) in ((6.0, 12.5), (11.0, 12.5), (6.0, 18.7), (11.0, 18.7), (6.0, 15.6), (11.2, 15.6)): box(cx - 0.3, cy - 0.3, 2.985, cx + 0.3, cy + 0.3, 3.0, 'light_panel', collide=False, omit='t')
box(5.2, 19.3, 2.975, 11.7, 19.36, 3.0, 'glow_teal', collide=False, omit='t'); box(11.7, 11.8, 2.975, 11.76, 19.36, 3.0, 'glow_teal', collide=False, omit='t'); box(5.2, 11.74, 2.975, 11.7, 11.8, 3.0, 'glow_teal', collide=False, omit='t')      # a cool cove of light at the head of three walls
box(7.3, 19.545, 0.98, 9.9, 19.58, 2.36, 'panel_dark', collide=False); box(7.42, 19.53, 1.06, 9.78, 19.546, 2.28, 'screen', collide=False)                # the room display, set into the north wall
SIGNS.append({'text': 'ORWALL', 'at': [8.6, 19.529, 1.67], 'face': 'S', 'w': 2.32, 'h': 1.18, 'style': 'orwall'})
box(4.94, 11.62, 0.04, 4.985, 13.16, 2.38, 'steel', collide=False); box(4.935, 11.8, 1.0, 4.99, 12.98, 2.2, 'panel_dark', collide=False); box(4.94, 11.56, 2.4, 5.04, 14.96, 2.56, 'panel_dark', collide=False)      # the door slides open along the wall on a top track
box(5.04, 14.0, 2.47, 5.045, 14.04, 2.49, 'glow_green', collide=False)
for (a_, b_) in ((15.8, 15.86), (19.14, 19.2)): box(4.9, a_, 0.95, 4.945, b_, 2.3, 'steel', collide=False)
box(4.9, 15.8, 0.91, 4.96, 19.2, 0.95, 'steel', collide=False); box(4.9, 15.8, 2.3, 4.945, 19.2, 2.34, 'steel', collide=False)
STATIONS['or'] = {'at': [6.3, 14.05], 'look': [8.6, 15.6, 1.0], 'label': 'Operating room', 'table': [8.6, 15.6], 'work': [8.6, 17.62]}
# --- STUDY STUDIO: x 4.9..10.4, y 2.8..8.6, 2.9 m, timber floor, a window east
ROOMS['studio'] = [4.9, 2.8, 10.4, 8.6, 2.9, 'timber', 0.95]
box(4.9, 2.4, -0.3, 10.8, 9.0, 0.0, 'oak_floor', collide=False, omit='b'); box(4.9, 2.4, 2.9, 10.8, 9.0, 3.3, 'plaster', collide=False, omit='t')
wall_x(2.4, 4.9, 10.8, 2.9, 'plaster_warm'); wall_x(8.6, 4.9, 10.8, 2.9, 'plaster_warm'); wall_y(10.4, 2.4, 9.0, 2.9, 'plaster_warm', openings=[(3.6, 7.6, 2.5, 0.75, 'window')])
box(4.9, 2.8, 0.0, 4.92, 4.9, 2.9, 'plaster_warm', collide=False); box(4.9, 6.1, 0.0, 4.92, 8.6, 2.9, 'plaster_warm', collide=False); box(4.9, 4.9, 2.4, 4.92, 6.1, 2.9, 'plaster_warm', collide=False)
box(5.3, 8.5, 0.3, 9.9, 8.6, 2.6, 'oak_dark', collide=False); box(5.3, 8.46, 1.5, 9.9, 8.5, 1.53, 'brass', collide=False)                                  # the collection wall, with a brass rail
for z in (0.62, 1.12, 1.62, 2.12): box(5.4, 8.2, z, 9.8, 8.5, z + 0.035, 'oak', collide=False)
COLLIDERS.append([5.3, 8.15, 9.9, 8.6, 0, 2.6])
STATIONS['collection'] = {'at': [7.6, 6.9], 'look': [7.6, 8.3, 1.35], 'label': 'Your collection', 'shelf': [[6.0, 8.34, 1.155], [7.6, 8.34, 1.155], [9.2, 8.34, 1.155], [6.8, 8.34, 1.655], [8.4, 8.34, 1.655], [7.6, 8.34, 0.655]]}
PROPS += [('WoodenTable_02', 8.9, 4.4, 0.0, 0.0, 1.0), ('modern_arm_chair_01', 8.9, 5.35, 0.0, 3.0, 1.0), ('desk_lamp_arm_01', 9.4, 4.3, 0.78, 2.4, 1.0), ('book_encyclopedia_set_01', 8.3, 4.25, 0.78, 0.3, 1.0), ('modern_arm_chair_01', 5.9, 3.55, 0.0, 0.75, 1.0), ('side_table_01', 6.8, 3.2, 0.0, 0.0, 1.0), ('potted_plant_04', 9.9, 8.0, 0.0, 0.0, 1.3), ('ceramic_vase_03', 6.8, 3.2, 0.55, 0.0, 1.0)]
COLLIDERS += [[8.2, 4.0, 9.6, 4.8, 0, 0.8], [5.4, 3.0, 6.4, 4.0, 0, 0.8], [8.55, 5.0, 9.25, 5.7, 0, 0.8]]
STATIONS['desk'] = {'at': [7.5, 5.1], 'look': [7.3, 2.9, 1.5], 'label': 'Case archive', 'top': [8.6, 4.45, 0.78]}
STATIONS['wardrobe'] = {'at': [6.0, 7.3], 'look': [4.93, 7.3, 1.3], 'label': 'Change how you look'}
box(4.92, 6.85, 0.25, 4.935, 7.75, 2.1, 'steel', collide=False); box(4.92, 6.82, 0.22, 4.928, 7.78, 2.13, 'brass', collide=False)                         # a mirror by the door
box(6.4, 5.4, 2.87, 7.6, 6.0, 2.9, 'light_warm', collide=False)
box(5.2, 2.812, 1.0, 8.0, 2.83, 2.2, 'oak_dark', collide=False); box(5.2, 2.83, 0.98, 8.0, 2.85, 1.0, 'brass', collide=False)                                  # a pin rail for case sheets, south wall
SIGNS.append({'text': 'CASES', 'at': [6.6, 2.851, 1.6], 'face': 'N', 'w': 2.7, 'h': 1.1, 'style': 'cases'})
for (a, b_, c, d) in ((4.92, 2.8, 10.4, 2.812), (4.92, 8.588, 5.3, 8.6), (10.388, 2.8, 10.4, 3.6), (10.388, 7.6, 10.4, 8.6)): box(a, b_, 0, c, d, 0.09, 'plaster', collide=False)
box(4.9, 4.9, 0.02, 4.95, 6.05, 2.36, 'oak', collide=False, rot=-1.2, about=(4.9, 4.9, 0))
def slider(x, ya, yb, face, lamp_y):
    """A sliding door standing open along the room side of a north-south wall whose room face is at x; the leaf covers ya..yb, the track runs on past the opening. face: +1 the room is east of the wall, -1 west."""
    f = face; q = lambda a_, b_: (min(x + f * a_, x + f * b_), max(x + f * a_, x + f * b_))
    (x0, x1) = q(0.04, 0.085); box(x0, ya, 0.04, x1, yb, 2.38, 'steel', collide=False); (x0, x1) = q(0.035, 0.09); box(x0, ya + 0.18, 1.0, x1, yb - 0.18, 2.2, 'panel_dark', collide=False)
    (x0, x1) = q(0.04, 0.14); box(x0, min(ya, lamp_y) - 0.75, 2.4, x1, max(yb, lamp_y) + 0.75, 2.56, 'panel_dark', collide=False); (x0, x1) = q(0.14, 0.145); box(x0, lamp_y - 0.02, 2.47, x1, lamp_y + 0.02, 2.49, 'glow_green', collide=False)
def counter(x0, y0, x1, y1, face_x):
    """A supply counter with drawers against a wall, a steel top, and a wall cupboard with dark glass doors over it. face_x: -1 the drawers look west, +1 east."""
    box(x0, y0, 0.0, x1, y1, 0.9, 'panel_light'); box(x0 - 0.02, y0 - 0.02, 0.9, x1 + 0.02, y1 + 0.02, 0.93, 'steel', collide=False); fx = x0 if face_x < 0 else x1; n = max(1, round((y1 - y0) / 0.55)); st = (y1 - y0) / n
    for i in range(n):
        for j in range(2):
            (xa, xb) = sorted((fx, fx + face_x * 0.008)); box(xa, y0 + i * st + 0.04, 0.13 + j * 0.38, xb, y0 + (i + 1) * st - 0.04, 0.47 + j * 0.38, 'panel_light', collide=False)
            (xa, xb) = sorted((fx + face_x * 0.008, fx + face_x * 0.024)); box(xa, y0 + i * st + st / 2 - 0.1, 0.4 + j * 0.38, xb, y0 + i * st + st / 2 + 0.1, 0.415 + j * 0.38, 'steel', collide=False)
    wx0, wx1 = (x1 - 0.42, x1) if face_x < 0 else (x0, x0 + 0.42); box(wx0, y0, 1.45, wx1, y1, 2.2, 'panel_light', collide=False); gx = wx0 if face_x < 0 else wx1; (xa, xb) = sorted((gx, gx + face_x * 0.008)); box(xa, y0 + 0.03, 1.47, xb, y1 - 0.03, 2.18, 'screen', collide=False)
# --- ENDOSCOPY SUITE: x 5.4..11.9, y 20..26.4, 3 m. North of the operating room, entered from the head of the court through a deep doorway.
ROOMS['endo'] = [5.4, 20.0, 11.9, 26.4, 3.0, 'vinyl', 0.66]
box(4.9, 20.0, -0.3, 12.3, 26.8, 0.0, 'clinical_floor', collide=False, omit='b'); box(4.9, 20.0, 3.0, 12.3, 26.8, 3.4, 'ceiling', collide=False, omit='t')
wall_y(4.9, 20.0, 22.4, 3.0, 'plaster', t=0.5, openings=[(20.5, 21.9, 2.4, 0, 'door')]); wall_x(26.4, 5.0, 12.3, 3.0, 'plaster'); wall_y(11.9, 20.0, 26.8, 3.0, 'plaster')
lining('x', 20.0, 5.4, 11.9, 1, skirt='clinical_floor', m='panel_light'); lining('x', 26.4, 5.4, 11.9, -1, skirt='clinical_floor', m='panel_light'); lining('y', 11.9, 20.0, 26.4, -1, skirt='clinical_floor', m='panel_light'); lining('y', 5.4, 20.0, 26.4, 1, skirt='clinical_floor', openings=[(20.5, 21.9, 0.0, 2.4)], m='panel_light')
slider(5.4, 21.95, 23.45, 1, 21.2); counter(11.22, 20.25, 11.88, 22.45, -1)
ENDO_LIGHTS = ((7.0, 21.5), (10.2, 21.5), (7.0, 24.9), (10.2, 24.9), (8.6, 23.2))
for (cx, cy) in ENDO_LIGHTS: box(cx - 0.6, cy - 0.3, 2.97, cx + 0.6, cy + 0.3, 3.0, 'light_panel', collide=False)
STATIONS['endo'] = {'at': [6.5, 21.2], 'look': [8.6, 23.2, 0.9], 'label': 'Endoscopy suite', 'table': [8.6, 23.2]}
# --- LABOR ROOM: x -11.9..-5.4, y 20..26.4, 3 m. A warmer room: timber floor, an oak head wall on the north side, a window to a walled garden on the west.
ROOMS['labor'] = [-11.9, 20.0, -5.4, 26.4, 3.0, 'timber', 0.8]
box(-12.3, 19.6, -0.3, -4.9, 26.8, 0.0, 'oak_floor', collide=False, omit='b'); box(-12.3, 19.6, 3.0, -4.9, 26.8, 3.4, 'ceiling', collide=False, omit='t')
wall_x(19.6, -12.3, -4.9, 3.0, 'plaster_warm'); wall_x(26.4, -12.3, -5.0, 3.0, 'plaster_warm'); wall_y(-12.3, 19.6, 26.8, 3.0, 'plaster_warm', openings=[(21.4, 24.4, 2.5, 0.9, 'window')]); wall_y(-5.4, 20.0, 22.4, 3.0, 'plaster_warm', t=0.5, openings=[(20.5, 21.9, 2.4, 0, 'door')])
for (a_, b_, c_, d_) in ((-11.9, 20.0, -5.4, 20.012), (-11.9, 26.388, -5.4, 26.4), (-11.9, 20.0, -11.888, 21.4), (-11.9, 24.4, -11.888, 26.4), (-5.412, 22.4, -5.4, 26.4)): box(a_, b_, 0, c_, d_, 0.09, 'plaster', collide=False)      # a plain skirting
box(-10.35, 26.35, 0.1, -7.45, 26.38, 2.32, 'oak', collide=False); box(-10.35, 26.338, 2.32, -7.45, 26.35, 2.335, 'steel', collide=False)                       # the head wall: oak, a services rail, a reading light
box(-10.2, 26.315, 1.3, -7.6, 26.35, 1.47, 'steel', collide=False); box(-10.2, 26.31, 1.375, -7.6, 26.315, 1.395, 'metal_dark', collide=False)
for i, mm in enumerate(('glow_green', 'steel', 'steel', 'glow_amber', 'steel')): box(-9.3 + i * 0.3, 26.302, 1.415, -9.2 + i * 0.3, 26.315, 1.455, 'steel', collide=False); box(-9.27 + i * 0.3, 26.297, 1.426, -9.23 + i * 0.3, 26.302, 1.444, mm if mm.startswith('glow') else 'metal_dark', collide=False)
box(-9.5, 26.27, 2.02, -8.3, 26.35, 2.07, 'steel', collide=False); box(-9.46, 26.28, 2.012, -8.34, 26.34, 2.02, 'light_warm', collide=False)
slider(-5.4, 21.95, 23.45, -1, 21.2); counter(-6.1, 23.7, -5.44, 25.9, -1)
LABOR_LIGHTS = ((-8.9, 24.6), (-6.9, 21.6), (-10.4, 21.6), (-8.9, 22.6))
for (cx, cy) in LABOR_LIGHTS: box(cx - 0.6, cy - 0.3, 2.97, cx + 0.6, cy + 0.3, 3.0, 'light_panel', collide=False)
STATIONS['labor'] = {'at': [-6.6, 21.2], 'look': [-8.9, 24.6, 0.9], 'label': 'Labor room', 'table': [-8.9, 24.95]}
PROPS += [('modern_arm_chair_01', -11.2, 25.3, 0.0, math.pi / 2, 1.0),      # square to the west wall, facing the bed: its box collider then fits it (a turned chair left floor closed round its corners)
           ('side_table_01', -11.3, 24.4, 0.0, 0.0, 1.0)]; COLLIDERS += [[-11.65, 24.85, -10.75, 25.75, 0, 0.8], [-11.55, 24.15, -11.05, 24.65, 0, 0.55]]
# --- PROCEDURE ROOM: x 4.9..9.0, y -3.6..2.4, 3 m. South of the studio, behind the forecourt wall; entered from the foot of the court.
ROOMS['procedure'] = [4.9, -3.6, 9.0, 2.4, 3.0, 'vinyl', 0.66]
box(4.5, -4.0, -0.3, 9.4, 2.4, 0.0, 'clinical_floor', collide=False, omit='b'); box(4.5, -4.0, 3.0, 9.4, 2.4, 3.4, 'ceiling', collide=False, omit='t')
wall_y(4.5, -4.0, -0.4, 3.0, 'plaster'); wall_x(-4.0, 4.5, 9.4, 3.0, 'plaster'); wall_y(9.0, -4.0, 2.4, 3.0, 'plaster')
lining('x', -3.6, 4.9, 9.0, 1, skirt='clinical_floor', m='panel_light'); lining('x', 2.4, 4.9, 9.0, -1, skirt='clinical_floor', m='panel_light'); lining('y', 9.0, -3.6, 2.4, -1, skirt='clinical_floor', m='panel_light'); lining('y', 4.9, -3.6, 2.4, 1, skirt='clinical_floor', openings=[(0.6, 2.0, 0.0, 2.4)], m='panel_light')
slider(4.9, -0.95, 0.55, 1, 1.3); counter(8.32, -3.4, 8.98, -1.2, -1)
PROC_LIGHTS = ((6.0, -2.4), (7.9, -2.4), (6.0, 0.9), (7.9, 0.9), (6.95, -0.8))
for (cx, cy) in PROC_LIGHTS: box(cx - 0.6, cy - 0.3, 2.97, cx + 0.6, cy + 0.3, 3.0, 'light_panel', collide=False)
STATIONS['procedure'] = {'at': [5.8, 1.3], 'look': [6.95, -0.9, 0.9], 'label': 'Procedure room', 'table': [6.95, -0.9]}
# --- outside the windows: walled gravel gardens, so that no window looks into a void (the ground itself is drawn by the browser)
wall_y(15.4, 0.5, 11.1, 1.7, 'concrete'); wall_x(0.1, 10.8, 15.8, 1.7, 'concrete'); wall_x(10.7, 12.4, 15.8, 1.7, 'concrete')
PROPS += [('potted_plant_02', 13.6, 4.2, 0.0, 0.7, 2.4), ('potted_plant_01', 12.6, 7.3, 0.0, 2.1, 2.0), ('potted_plant_04', 14.3, 8.6, 0.0, 0.2, 2.6)]
wall_y(-17.4, 10.6, 20.0, 1.7, 'concrete'); wall_x(10.2, -17.4, -11.9, 1.7, 'concrete'); wall_x(19.6, -17.4, -11.9, 1.7, 'concrete')
PROPS += [('potted_plant_04', -14.4, 13.4, 0.0, 1.1, 2.6), ('potted_plant_02', -15.3, 16.8, 0.0, 0.4, 2.3)]
wall_y(-17.4, 20.0, 27.2, 1.7, 'concrete'); wall_x(26.8, -17.4, -12.3, 1.7, 'concrete')
PROPS += [('potted_plant_01', -14.6, 22.2, 0.0, 2.2, 2.3), ('potted_plant_04', -15.6, 24.6, 0.0, 0.7, 2.5)]

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
        p = l.vert.co; q = ((p.x, p.z) if a == 1 else (p.y, p.z) if a == 0 else (p.x, p.y)); l[uv0].uv = (q[0] / s, q[1] / s)
    f.smooth = False
bm.to_mesh(me); bm.free()
# Lightmap UVs. The thin bevel faces would take most of the atlas if each were packed on its own, so each one borrows
# the texels along the edge of the large face it belongs to; only the large faces are packed.
bm = bmesh.new(); bm.from_mesh(me); bm.faces.ensure_lookup_table()
thin = [min(e.calc_length() for e in f.edges) < 0.016 for f in bm.faces]; borrow = {}
for f in bm.faces:
    if not thin[f.index]: continue
    ring = {g for v in f.verts for g in v.link_faces if not thin[g.index]}
    if not ring: ring = {h for v in f.verts for g in v.link_faces for w in g.verts for h in w.link_faces if not thin[h.index]}
    if ring: borrow[f.index] = max(ring, key=lambda g: f.normal.dot(g.normal)).index
for f in bm.faces: f.select = f.index not in borrow
bm.to_mesh(me); bm.free()
lm = me.uv_layers.new(name='LM'); me.uv_layers.active = lm; bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_mode(type='FACE')
bpy.ops.uv.lightmap_pack(PREF_CONTEXT='SEL_FACES', PREF_PACK_IN_ONE=True, PREF_NEW_UVLAYER=False, PREF_BOX_DIV=48, PREF_MARGIN_DIV=0.2); bpy.ops.object.mode_set(mode='OBJECT')
bm = bmesh.new(); bm.from_mesh(me); bm.faces.ensure_lookup_table(); LL = bm.loops.layers.uv['LM']
for fi, gi in borrow.items():
    g = bm.faces[gi]
    for l in bm.faces[fi].loops: l[LL].uv = min(g.loops, key=lambda q: (q.vert.co - l.vert.co).length_squared)[LL].uv.copy()
bm.to_mesh(me); bm.free(); print('LIGHTMAP faces packed', len(me.polygons) - len(borrow), 'borrowing', len(borrow))
area = sum(p.area for p in me.polygons); print('ARCH faces', len(me.polygons), 'verts', len(me.vertices), 'area m2', round(area), 'colliders', len(COLLIDERS))

# ------------------------------------------------------------------ furniture (Poly Haven models): they shade the bake, and are lit by probes in the browser
prop_objs = []
for (name, x, y, z, rz, sc) in PROPS:
    p = os.path.join(SRC, 'models', name, name + '.gltf')
    if not os.path.exists(p): print('missing prop', name); continue
    before = set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=p); new = [o for o in bpy.data.objects if o not in before]
    root = bpy.data.objects.new('prop_' + name, None); scene.collection.objects.link(root)
    for o in new:
        if o.parent is None: o.parent = root
    root.location = (x, y, z); root.rotation_euler = (0, 0, rz); root.scale = (sc, sc, sc); prop_objs += new + [root]

# ------------------------------------------------------------------ clinical equipment (tools/clinical_set.py): shades the bake, collides, and is exported on its own
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import clinical_set
CLIN = os.path.join(os.path.dirname(os.path.abspath(SRC.rstrip('/'))), 'objaverse'); eq_pieces, eq_lamps = clinical_set.build(CLIN); EQUIP_FROM = len(COLLIDERS); COLLIDERS += clinical_set.colliders(eq_pieces)      # the equipment's boxes come last: the browser replaces them with each piece's real outline
print('CLINICAL pieces', len(eq_pieces), 'tris', sum(clinical_set.tris(eq_pieces).values()))

# ------------------------------------------------------------------ sky and sun: find the sun in the sky image, and turn the image so both agree
hdr = bpy.data.images.load(os.path.join(SRC, 'hdri', 'kloofendal_48d_partly_cloudy_puresky_1k.hdr')); W, H = hdr.size
sky = np.array(hdr.pixels[:], dtype=np.float32).reshape(H, W, 4); lum = sky[:, :, :3] @ np.array([0.2126, 0.7152, 0.0722], np.float32)
r, c = np.unravel_index(np.argmax(lum), lum.shape); u_s, v_s = (c + 0.5) / W, (r + 0.5) / H; elev = float(np.clip((v_s - 0.5) * math.pi, math.radians(38), math.radians(62)))
D = Vector((-0.37, -0.93)).normalized()                                             # where the sun stands, seen from above: south, a little west
SUN_DIR = Vector((D.x * math.cos(elev), D.y * math.cos(elev), math.sin(elev)))      # direction TO the sun
u_t = math.atan2(-D.y, D.x) / (2 * math.pi) + 0.5                                   # three.js: u = atan2(dir.z, dir.x) / 2pi + 0.5, with z = -north
rolled = np.roll(sky, int(round((u_t - u_s) * W)), axis=1); out_sky = bpy.data.images.new('sky', W, H, alpha=False, float_buffer=True); out_sky.pixels.foreach_set(rolled.ravel())
out_sky.filepath_raw = os.path.join(OUT, 'sky.hdr'); out_sky.file_format = 'HDR'; out_sky.save()
a_s = (u_s - 0.5) * 2 * math.pi; theta = math.atan2(math.sin(a_s), -math.cos(a_s)) - math.atan2(D.y, D.x)        # Blender: u = atan2(dir.y, -dir.x) / 2pi + 0.5
SKY, SUN = 1.5, 5.2
world = bpy.data.worlds.new('sky'); scene.world = world; world.use_nodes = True; wn = world.node_tree; env = wn.nodes.new('ShaderNodeTexEnvironment'); env.image = bpy.data.images.load(os.path.join(SRC, 'hdri', 'kloofendal_48d_partly_cloudy_puresky_2k.hdr'))
mp = wn.nodes.new('ShaderNodeMapping'); tc = wn.nodes.new('ShaderNodeTexCoord'); wn.links.new(tc.outputs['Generated'], mp.inputs[0]); wn.links.new(mp.outputs[0], env.inputs[0]); mp.inputs['Rotation'].default_value = (0, 0, theta)
cl = wn.nodes.new('ShaderNodeVectorMath'); cl.operation = 'MINIMUM'; cl.inputs[1].default_value = (20, 20, 20); wn.links.new(env.outputs[0], cl.inputs[0])     # the sky without its sun disc: the lamp below is the sun
wn.links.new(cl.outputs[0], wn.nodes['Background'].inputs[0]); wn.nodes['Background'].inputs[1].default_value = SKY
up = lum[H // 2:, :]; print('SKY sun at u %.3f v %.3f elevation %.1f deg; peak %.0f; upper-sky mean %.2f; turn %.1f deg' % (u_s, v_s, math.degrees(elev), float(lum.max()), float(np.minimum(up, 20).mean()), math.degrees(theta)))

def lamp(kind, loc, energy, color=(1, 1, 1), target=None, size=0.3, spot=50, blend=0.5, dyn=False):
    d = bpy.data.lights.new('l', kind); d.energy = energy; d.color = color
    if kind == 'SPOT': d.spot_size = math.radians(spot); d.spot_blend = blend; d.shadow_soft_size = size
    if kind == 'AREA': d.size = size; d.shape = 'SQUARE'
    if kind == 'SUN': d.angle = math.radians(1.2)
    o = bpy.data.objects.new('lamp', d); scene.collection.objects.link(o); o.location = loc
    if target is not None: o.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler()
    LIGHTS.append({'kind': kind, 'at': list(loc), 'to': list(target) if target else None, 'color': list(color), 'power': energy, 'angle': spot, 'blend': blend, 'dyn': dyn}); LAMP_OBJS.append((o, dyn)); return o
sun = lamp('SUN', (0, 0, 30), SUN, (1.0, 0.955, 0.89)); sun.rotation_euler = (-SUN_DIR).to_track_quat('-Z', 'Y').to_euler()
WARM, COOL = (1.0, 0.86, 0.7), (0.93, 0.97, 1.0)
lamp('SPOT', (0.0, 27.1, 4.0), 1000, WARM, (0.0, 28.6, 1.4), 0.1, 44, dyn=True); lamp('SPOT', (-1.0, 27.3, 4.0), 260, COOL, (-0.3, 28.7, 1.5), 0.1, 46, dyn=True); lamp('SPOT', (1.0, 27.3, 4.0), 300, WARM, (0.0, 30.1, 1.9), 0.3, 70)
lamp('SPOT', (-3.3, 24.9, 4.0), 620, WARM, (-3.3, 26.0, 1.45), 0.1, 40, dyn=True); lamp('SPOT', (-2.9, 28.4, 4.0), 300, WARM, (-2.9, 29.55, 0.92), 0.1, 46); lamp('SPOT', (3.9, 27.4, 4.0), 200, COOL, (4.9, 28.5, 1.5), 0.1, 50)
TEAL = (0.35, 0.86, 0.95)
for (cx, cy) in ((-8.9, 13.5), (-6.4, 13.2), (-10.6, 16.6), (-6.4, 17.0), (-8.6, 16.6)): lamp('AREA', (cx, cy, 2.95), 24, COOL, (cx, cy, 0), 0.6)
lamp('AREA', (-8.9, 12.2, 1.98), 9, WARM, (-8.9, 12.6, 0.9), 0.5)
for (cx, north) in ((-9.3, True), (-6.4, True), (-9.3, False), (-6.4, False)):
    yb = (9.6 - 1.32) if north else (2.6 + 1.32); lamp('AREA', (cx, yb, 2.95), 22, COOL, (cx, yb, 0), 0.6); lamp('AREA', (cx, (9.6 - 0.2) if north else (2.6 + 0.2), 1.98), 7, WARM, (cx, (9.6 - 0.6) if north else (2.6 + 0.6), 0.9), 0.5)
lamp('AREA', (-7.3, 6.1, 2.95), 22, COOL, (-7.3, 6.1, 0), 0.6)
lamp('AREA', (OC[0], OC[1], 2.86), 30, COOL, (OC[0], OC[1], 0), 2.7)
for (cx, cy) in ((6.0, 12.5), (11.0, 12.5), (6.0, 18.7), (11.0, 18.7), (6.0, 15.6), (11.2, 15.6)): lamp('AREA', (cx, cy, 2.96), 6, COOL, (cx, cy, 0), 0.5)
for (cx, cy, tx, ty) in ((7.0, 19.3, 7.0, 19.6), (10.2, 19.3, 10.2, 19.6), (11.7, 13.6, 12.0, 13.6), (11.7, 17.6, 12.0, 17.6), (7.0, 11.8, 7.0, 11.5), (10.2, 11.8, 10.2, 11.5)): lamp('AREA', (cx, cy, 2.95), 10, TEAL, (tx, ty, 1.2), 1.0)
for l in eq_lamps: lamp(l['kind'], l['at'], l['power'], l['color'], l['to'], l['size'], l['spot'], l['blend'], dyn=l['dyn'])
for (cx, cy) in ENDO_LIGHTS + PROC_LIGHTS: lamp('AREA', (cx, cy, 2.95), 24, COOL, (cx, cy, 0), 0.6)
for (cx, cy) in LABOR_LIGHTS: lamp('AREA', (cx, cy, 2.95), 20, WARM, (cx, cy, 0), 0.6)
lamp('AREA', (-8.9, 26.2, 1.98), 9, WARM, (-8.9, 25.8, 0.9), 0.5)
lamp('AREA', (7.0, 5.7, 2.85), 110, WARM, (7.0, 5.7, 0), 0.6); lamp('SPOT', (7.6, 6.9, 2.8), 170, WARM, (7.6, 8.3, 1.4), 0.2, 75); lamp('SPOT', (6.6, 4.4, 2.8), 90, WARM, (6.6, 2.85, 1.6), 0.2, 70)
lamp('AREA', (0, -2.5, 2.75), 50, WARM, (0, -2.5, 0), 1.0)

scene.cycles.samples = 512 if FINAL else 64; scene.cycles.use_denoising = True; scene.view_settings.view_transform = 'AgX'; scene.view_settings.exposure = 1.35
# ------------------------------------------------------------------ preview renders (the whole light, sun included), to judge composition before a long bake
if PREVIEW:
    views = {'forecourt': ((1.2, -13.4, 1.62), (-0.4, 0, 2.3), 24), 'arrival': ((0, -3.6, 1.62), (0, 12, 2.0), 22), 'court': ((2.4, 2.2, 1.62), (-1.2, 19, 2.6), 20), 'focal': ((-2.7, 4.4, 1.62), (0.2, 9.9, 1.5), 28),
             'gallery': ((0.5, 23.3, 1.62), (-0.4, 28.6, 1.3), 22), 'studio': ((5.6, 3.6, 1.6), (9.2, 8.2, 1.2), 20), 'regional': ((-5.7, 17.5, 1.6), (-9.2, 13.4, 1.0), 20), 'preop': ((-5.6, 6.1, 1.62), (-9.6, 7.4, 1.0), 18), 'preop2': ((-9.9, 5.0, 1.6), (-6.6, 8.6, 0.9), 20), 'bay': ((-7.6, 15.6, 1.6), (-9.3, 13.0, 1.05), 26), 'or': ((5.75, 13.75, 1.62), (9.0, 16.3, 1.05), 19), 'orwork': ((8.55, 18.3, 1.6), (8.75, 15.2, 0.95), 20), 'oranes': ((9.6, 18.75, 1.55), (7.6, 17.3, 1.05), 26), 'oreast': ((11.2, 13.4, 1.62), (7.6, 16.9, 1.1), 19),
             'endo': ((6.0, 20.6, 1.62), (9.6, 24.6, 0.9), 18), 'endo2': ((11.2, 25.8, 1.62), (7.4, 22.4, 0.9), 18), 'labor': ((-6.0, 20.6, 1.62), (-9.8, 25.0, 0.9), 18), 'labor2': ((-11.2, 20.8, 1.62), (-7.6, 25.2, 0.9), 18), 'procedure': ((5.5, 1.8, 1.62), (7.8, -2.4, 0.9), 18), 'procedure2': ((8.4, -3.0, 1.62), (6.0, 0.6, 0.9), 18), 'courtnorth': ((0.0, 14.0, 1.62), (0.0, 22.0, 1.8), 16)}
    for k, (loc, tgt, lens) in views.items():
        if ONLY and k not in ONLY: continue
        cam = bpy.data.cameras.new(k); cam.lens = lens; co = bpy.data.objects.new(k, cam); scene.collection.objects.link(co); co.location = loc; co.rotation_euler = (Vector(tgt) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler(); scene.camera = co
        scene.render.resolution_x, scene.render.resolution_y = 960, 540; scene.cycles.samples = 96; scene.render.filepath = PREVIEW.replace('.png', f'_{k}.png'); bpy.ops.render.render(write_still=True); print('PREVIEW', k)
    scene.cycles.samples = 512 if FINAL else 64
    if STOP: sys.exit(0)

# ------------------------------------------------------------------ bake 1: the lightmap. Everything except the sun's direct light.
sun.visible_camera = False                                           # no first-hit sunlight; its bounces still count
RES = 4096 if FINAL else 2048
img = bpy.data.images.new('lightmap', RES, RES, alpha=False, float_buffer=True)
for m in me.materials:
    n = m.node_tree.nodes.new('ShaderNodeTexImage'); n.image = img; n.name = 'BAKE'; uvn = m.node_tree.nodes.new('ShaderNodeUVMap'); uvn.uv_map = 'LM'; m.node_tree.links.new(uvn.outputs[0], n.inputs[0]); m.node_tree.nodes.active = n
bpy.ops.object.select_all(action='DESELECT'); arch.select_set(True); bpy.context.view_layer.objects.active = arch; me.uv_layers.active = me.uv_layers['LM']
scene.cycles.bake_type = 'DIFFUSE'; bk = scene.render.bake; bk.use_pass_direct = True; bk.use_pass_indirect = True; bk.use_pass_color = False; bk.margin = 8; bk.use_clear = True; bk.target = 'IMAGE_TEXTURES'
t0 = time.time(); bpy.ops.object.bake(type='DIFFUSE'); print('BAKED lightmap in', round(time.time() - t0), 's at', RES)
px = np.array(img.pixels[:], dtype=np.float32).reshape(RES, RES, 4)[:, :, :3]
def blur(a):   # a one-texel soften, to settle the remaining noise
    p = np.pad(a, ((1, 1), (1, 1), (0, 0)), mode='edge'); return (p[1:-1, 1:-1] * 4 + p[:-2, 1:-1] + p[2:, 1:-1] + p[1:-1, :-2] + p[1:-1, 2:] + (p[:-2, :-2] + p[:-2, 2:] + p[2:, :-2] + p[2:, 2:]) * 0.5) / 10
px = blur(blur(px)); np.save(os.path.join(OUT, 'lightmap.npy'), np.flipud(px).astype(np.float16))          # top row first, as an image file has it
print('lightmap mean %.3f p50 %.3f p99 %.2f p99.9 %.2f max %.1f' % (float(px.mean()), float(np.median(px)), float(np.percentile(px, 99)), float(np.percentile(px, 99.9)), float(px.max())))
for m in me.materials: m.node_tree.nodes.remove(m.node_tree.nodes['BAKE'])

# ------------------------------------------------------------------ bake 2: light probes for things that move (people, specimens, furniture)
# A probe is a 3 cm white sphere; its baked shading, as a function of the surface normal, is fitted with nine terms per color.
def inside(x, y, z, pad=0.25): return any(c[0] - pad < x < c[2] + pad and c[1] - pad < y < c[3] + pad and c[4] - 0.05 < z < c[5] + pad for c in COLLIDERS)
PTS = []
for k, (x0, y0, x1, y1, h, floor, expo) in ROOMS.items():
    nx, ny = max(1, round((x1 - x0) / 1.7)), max(1, round((y1 - y0) / 1.7))
    for i in range(nx):
        for j in range(ny):
            x, y = x0 + (i + 0.5) * (x1 - x0) / nx, y0 + (j + 0.5) * (y1 - y0) / ny
            for z in ((1.15,) if k in ('forecourt', 'arrival') else (0.45, 1.3)):
                if not inside(x, y, z): PTS.append((k, x, y, z))
for k, s in STATIONS.items():
    if 'mount' in s: PTS.append(('@' + k, s['mount'][0], s['mount'][1], s['mount'][2] + 0.38))
    for sh in s.get('shelf', []): PTS.append(('@' + k, sh[0], sh[1], sh[2] + 0.12))
PTS += [('@bay%d' % n, cx, (9.6 - 1.32) if north else (2.6 + 1.32), 1.0) for n, (cx, north) in enumerate(((-9.3, True), (-6.4, True), (-9.3, False), (-6.4, False)), 1)]
PTS += [('@or_table', 8.6, 15.6, 1.05), ('@regional_table', -8.9, 13.4, 1.05), ('@atrium_hi', 0.0, 9.7, 1.9), ('@desk', 8.6, 4.45, 0.95), ('@endo_table', 8.6, 23.2, 0.95), ('@labor_bed', -8.9, 24.95, 0.95), ('@procedure_table', 6.95, -0.9, 0.95)]
pb = bmesh.new()
for (k, x, y, z) in PTS: bmesh.ops.create_icosphere(pb, subdivisions=3, radius=0.03, matrix=Matrix.Translation((x, y, z)))
for f in pb.faces: f.smooth = True
pm = bpy.data.meshes.new('probes'); pb.to_mesh(pm); pb.free(); po = bpy.data.objects.new('probes', pm); scene.collection.objects.link(po)
wm = bpy.data.materials.new('probe_white'); wm.use_nodes = True; wm.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (1, 1, 1, 1); wm.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = 1.0; pm.materials.append(wm)
attr = pm.color_attributes.new('probe', 'FLOAT_COLOR', 'POINT'); pm.color_attributes.active_color = attr
po.visible_shadow = False; po.visible_diffuse = False; po.visible_glossy = False; po.visible_transmission = False
for (o, dyn) in LAMP_OBJS:
    if dyn: o.visible_camera = False                                   # spots the browser draws live: only their bounce goes into the probes
bpy.ops.object.select_all(action='DESELECT'); po.select_set(True); bpy.context.view_layer.objects.active = po; bk.target = 'VERTEX_COLORS'
t0 = time.time(); bpy.ops.object.bake(type='DIFFUSE'); print('BAKED', len(PTS), 'probes in', round(time.time() - t0), 's')
nv = len(pm.vertices) // len(PTS); cols = np.empty(len(pm.vertices) * 4, np.float32); attr.data.foreach_get('color', cols); cols = cols.reshape(-1, 4)[:, :3]
co = np.empty(len(pm.vertices) * 3, np.float32); pm.vertices.foreach_get('co', co); co = co.reshape(-1, 3)
PROBES = []
for i, (k, x, y, z) in enumerate(PTS):
    nb = co[i * nv:(i + 1) * nv] - np.array([x, y, z], np.float32); nb /= np.linalg.norm(nb, axis=1, keepdims=True); X, Y, Z = nb[:, 0], nb[:, 2], -nb[:, 1]      # normals in three.js axes
    B = np.stack([np.ones_like(X), X, Y, Z, X * Y, Y * Z, 3 * Z * Z - 1, X * Z, X * X - Y * Y], axis=1); coef, *_ = np.linalg.lstsq(B, cols[i * nv:(i + 1) * nv], rcond=None)
    PROBES.append({'room': k, 'p': [round(x, 3), round(z, 3), round(-y, 3)], 'c': [round(float(v), 4) for v in coef.ravel()]})
bpy.data.objects.remove(po)
for (o, dyn) in LAMP_OBJS: o.visible_camera = True
means = {}
for p in PROBES: means.setdefault(p['room'].lstrip('@'), []).append(sum(p['c'][0:3]) / 3)
print('probe mean level by room:', {k: round(sum(v) / len(v), 3) for k, v in means.items()})

# ------------------------------------------------------------------ export
me.uv_layers.active = me.uv_layers['UV0']; me.uv_layers['UV0'].active_render = True
bpy.ops.object.select_all(action='DESELECT'); arch.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, 'institute.glb'), export_format='GLB', use_selection=True, export_apply=True, export_yup=True, export_texcoords=True, export_normals=True, export_materials='EXPORT', export_image_format='JPEG', export_jpeg_quality=88, export_extras=True)
bpy.ops.object.select_all(action='DESELECT')
for o in prop_objs: o.select_set(True)
if prop_objs: bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, 'institute-props.glb'), export_format='GLB', use_selection=True, export_apply=False, export_yup=True, export_materials='EXPORT', export_image_format='JPEG', export_jpeg_quality=85)
bpy.ops.object.select_all(action='DESELECT')
for r in eq_pieces:
    r.select_set(True)
    for c in r.children_recursive: c.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, 'institute-clinical.glb'), export_format='GLB', use_selection=True, export_apply=False, export_yup=True, export_materials='EXPORT', export_image_format='AUTO', export_extras=True)
def T3(p): return [round(p[0], 3), round(p[2], 3) if len(p) > 2 else 0, round(-p[1], 3)]      # Blender (x, y, z) -> three.js (x, z, -y)
def st(v):
    o = {**v, 'at': [v['at'][0], -v['at'][1]], 'look': T3(v['look'])}
    for key in ('mount', 'top', 'bed'):
        if key in v: o[key] = T3(v[key])
    if 'shelf' in v: o['shelf'] = [T3(s) for s in v['shelf']]
    for key in ('table', 'work'):
        if key in v: o[key] = [v[key][0], -v[key][1]]
    return o
FACE = {'N': [0, -1], 'S': [0, 1], 'E': [1, 0], 'W': [-1, 0]}
level = {'units': 'metres; three.js axes (x east, y up, z south)', 'sunDir': T3(list(SUN_DIR)), 'sun': SUN, 'sky': SKY, 'sunColor': [1.0, 0.955, 0.89], 'lightmapSize': RES,
  'spawn': {'x': 0.9, 'z': 12.9, 'yaw': 0.07}, 'bounds': [-18.0, -32.2, 16.2, 15.8],
  'colliders': [[c[0], -c[3], c[2], -c[1], c[4], c[5]] for c in COLLIDERS],
  'equipFrom': EQUIP_FROM,
  'rooms': {k: {'x0': v[0], 'z0': -v[3], 'x1': v[2], 'z1': -v[1], 'h': v[4], 'floor': v[5], 'exposure': v[6]} for k, v in ROOMS.items()},
  'glass': [[g[0], g[2], -g[4], g[3], g[5], -g[1], g[6]] for g in GLASS], 'pool': [POOL[0], -POOL[3], POOL[2], -POOL[1], POOL[4]],
  'stations': {k: st(v) for k, v in STATIONS.items()},
  'signs': [{**s, 'at': T3(s['at']), 'face': FACE[s['face']]} for s in SIGNS],
  'lamps': [{**l, 'at': T3(l['at']), 'to': T3(l['to']) if l['to'] else None} for l in LIGHTS if l['kind'] == 'SPOT' and l['dyn']],
  'probes': PROBES}
json.dump(level, open(os.path.join(OUT, 'level.json'), 'w'), separators=(',', ':')); print('EXPORTED', OUT, 'probes', len(PROBES), 'signs', len(SIGNS), 'glass', len(GLASS))
