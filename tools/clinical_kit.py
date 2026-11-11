"""clinical_kit.py: clinical equipment modelled for Overlord, in Blender, from measurements typical of the real things.
Nothing here is a manufacturer's product and nothing is traced from one. Every piece is built from bevelled solids, lathed
profiles and swept tubes with physically based materials, so that steel, painted metal, vinyl, rubber, cloth and clear
plastic each answer light differently. It is set dressing for the operating room and the regional bay: no control on it is
live, and nothing is taught from it.

Used by tools/build_institute.py (which places the pieces, lets them shade the bake and exports them), or on its own:
   blender -b --factory-startup --python tools/clinical_kit.py -- preview.png      a studio picture of every piece
Each builder returns an empty that owns its parts. A piece is built facing +Y (its head or front), standing on z = 0."""
import bpy, bmesh, math, random, sys, os
from mathutils import Vector, Matrix, Euler

M, PIECES = {}, []
def pbr(name, color, rough=0.5, metal=0.0, emit=None, es=0.0, alpha=1.0, coat=0.0, two=False):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*color, 1); b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    if emit: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = es
    if alpha < 1:
        b.inputs['Alpha'].default_value = alpha
        try: m.blend_method = 'BLEND'
        except Exception: pass
    if coat:
        try: b.inputs['Coat Weight'].default_value = coat; b.inputs['Coat Roughness'].default_value = 0.1
        except Exception: pass
    m.use_backface_culling = not two; M[name] = m; return m
def materials():
    if M: return
    pbr('eq_steel', (0.64, 0.65, 0.66), 0.28, 1.0); pbr('eq_steel_dark', (0.11, 0.115, 0.125), 0.4, 1.0); pbr('eq_chrome', (0.8, 0.81, 0.82), 0.12, 1.0)
    pbr('eq_paint', (0.83, 0.845, 0.84), 0.4, 0, coat=0.35); pbr('eq_paint_grey', (0.42, 0.45, 0.47), 0.42, 0, coat=0.25); pbr('eq_graphite', (0.085, 0.09, 0.1), 0.38, 0, coat=0.3)
    pbr('eq_plastic_dark', (0.035, 0.037, 0.042), 0.5); pbr('eq_plastic_light', (0.74, 0.75, 0.74), 0.52); pbr('eq_rubber', (0.022, 0.022, 0.024), 0.86)
    pbr('eq_pad', (0.028, 0.03, 0.034), 0.56); pbr('eq_pad_blue', (0.07, 0.17, 0.3), 0.55); pbr('eq_mattress', (0.2, 0.3, 0.38), 0.62)
    pbr('eq_teal', (0.03, 0.3, 0.32), 0.48); pbr('eq_blue', (0.06, 0.2, 0.46), 0.42, 0, coat=0.3); pbr('eq_yellow', (0.8, 0.56, 0.04), 0.45); pbr('eq_purple', (0.32, 0.14, 0.46), 0.45)
    pbr('eq_red', (0.6, 0.05, 0.05), 0.45); pbr('eq_green', (0.05, 0.42, 0.16), 0.45); pbr('eq_white', (0.9, 0.9, 0.89), 0.5)
    pbr('eq_glass', (0.7, 0.8, 0.84), 0.04, 0, alpha=0.22, two=True); pbr('eq_clear', (0.86, 0.92, 0.95), 0.12, 0, alpha=0.38, two=True); pbr('eq_fluid', (0.9, 0.93, 0.8), 0.2, 0, alpha=0.7, two=True)
    pbr('eq_screen', (0.004, 0.005, 0.007), 0.1, 0, emit=(0.05, 0.12, 0.16), es=0.6); pbr('eq_led', (1, 1, 1), 0.4, 0, emit=(1.0, 0.98, 0.94), es=14.0); pbr('eq_led_soft', (1, 1, 1), 0.4, 0, emit=(1.0, 0.98, 0.94), es=2.5)
    pbr('eq_led_teal', (0.2, 0.9, 0.85), 0.4, 0, emit=(0.16, 0.85, 0.8), es=5.0); pbr('eq_led_green', (0.1, 0.9, 0.3), 0.4, 0, emit=(0.1, 0.95, 0.3), es=3.0); pbr('eq_led_amber', (1, 0.6, 0.1), 0.4, 0, emit=(1.0, 0.55, 0.08), es=3.0)
    pbr('eq_drape', (0.075, 0.26, 0.36), 0.92, 0, two=True); pbr('eq_curtain', (0.5, 0.62, 0.66), 0.9, 0, two=True); pbr('eq_hose', (0.66, 0.74, 0.78), 0.42); pbr('eq_cable', (0.05, 0.05, 0.055), 0.6)
    pbr('eq_soda', (0.86, 0.84, 0.9), 0.9); pbr('eq_face', (0.95, 0.95, 0.93), 0.5); pbr('eq_cream', (0.82, 0.8, 0.74), 0.5)

# ------------------------------------------------------------------ making solids
def _obj(bm, name, mat, parent, at, rot, smooth=True, angle=38):
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    if smooth:
        for f in bm.faces: f.smooth = True
        for e in bm.edges:
            if len(e.link_faces) == 2 and e.calc_face_angle(0.0) > math.radians(angle): e.smooth = False
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); me.materials.append(M[mat]); o = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(o)
    o.location = at; o.rotation_euler = rot
    if parent is not None: o.parent = parent
    return o
def rbox(p, name, mat, size, at, r=0.004, seg=2, rot=(0, 0, 0)):
    """A box with every edge rounded: nothing manufactured has a knife edge."""
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts: v.co = Vector((v.co.x * size[0], v.co.y * size[1], v.co.z * size[2]))
    r = min(r, min(size) * 0.45)
    if r > 0: bmesh.ops.bevel(bm, geom=list(bm.edges), offset=r, offset_type='OFFSET', segments=seg, profile=0.5, affect='EDGES', clamp_overlap=True)
    return _obj(bm, name, mat, p, at, rot)
def cyl(p, name, mat, r, h, at, rot=(0, 0, 0), seg=28, r2=None, bevel=0.0):
    bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=seg, radius1=r, radius2=r if r2 is None else r2, depth=h)
    if bevel > 0: bmesh.ops.bevel(bm, geom=[e for e in bm.edges if abs(e.verts[0].co.z - e.verts[1].co.z) < 1e-6], offset=min(bevel, r * 0.4, h * 0.4), offset_type='OFFSET', segments=2, profile=0.5, affect='EDGES', clamp_overlap=True)
    return _obj(bm, name, mat, p, at, rot)
def lathe(p, name, mat, profile, at, rot=(0, 0, 0), seg=36):
    """Turn a profile [(radius, z), ...] about the vertical axis: domes, bowls, knobs, light heads, wheels, bags."""
    bm = bmesh.new(); rings = []
    for (r, z) in profile: rings.append([bm.verts.new((max(r, 1e-5) * math.cos(2 * math.pi * j / seg), max(r, 1e-5) * math.sin(2 * math.pi * j / seg), z)) for j in range(seg)])
    for i in range(len(rings) - 1):
        for j in range(seg): bm.faces.new((rings[i][j], rings[i][(j + 1) % seg], rings[i + 1][(j + 1) % seg], rings[i + 1][j]))
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-4); return _obj(bm, name, mat, p, at, rot, angle=50)
def tube(p, name, mat, pts, r, seg=10, ribs=0.0, pitch=0.011, at=(0, 0, 0), rot=(0, 0, 0)):
    """Sweep a round section through points: hoses (ribs > 0 makes it corrugated), cables, rails, frames."""
    P = [Vector(q) for q in pts]; Q = [P[0]] + P + [P[-1]]; path = []
    for i in range(1, len(Q) - 2):
        n = max(2, int((Q[i + 1] - Q[i]).length / (pitch / 3 if ribs else max(0.012, r * 1.6))))
        for k in range(n):
            t = k / n; t2, t3 = t * t, t * t * t
            path.append(0.5 * ((2 * Q[i]) + (-Q[i - 1] + Q[i + 1]) * t + (2 * Q[i - 1] - 5 * Q[i] + 4 * Q[i + 1] - Q[i + 2]) * t2 + (-Q[i - 1] + 3 * Q[i] - 3 * Q[i + 1] + Q[i + 2]) * t3))
    path.append(P[-1]); bm = bmesh.new(); rings = []; up = Vector((0, 0, 1)); s = 0.0
    for i, c in enumerate(path):
        tan = (path[min(i + 1, len(path) - 1)] - path[max(i - 1, 0)]).normalized()
        if i == 0: nrm = tan.cross(up); nrm = nrm.normalized() if nrm.length > 1e-4 else Vector((1, 0, 0))
        else: nrm = (nrm - tan * nrm.dot(tan)).normalized(); s += (c - path[i - 1]).length
        bi = tan.cross(nrm); rr = r * (1 + ribs * math.sin(2 * math.pi * s / pitch)) if ribs else r
        rings.append([bm.verts.new(c + (nrm * math.cos(2 * math.pi * j / seg) + bi * math.sin(2 * math.pi * j / seg)) * rr) for j in range(seg)])
    for i in range(len(rings) - 1):
        for j in range(seg): bm.faces.new((rings[i][j], rings[i][(j + 1) % seg], rings[i + 1][(j + 1) % seg], rings[i + 1][j]))
    bm.faces.new(rings[0][::-1]); bm.faces.new(rings[-1]); return _obj(bm, name, mat, p, at, rot, angle=60)
def cloth(p, name, mat, w, d, top, hang, at=(0, 0, 0), rot=(0, 0, 0), n=44, seed=1):
    """A sheet laid over a rectangular top w x d at height `top`, hanging `hang` down every side with soft folds."""
    random.seed(seed); bm = bmesh.new(); L = w / 2 + hang; D = d / 2 + hang; nx = n; ny = max(8, int(n * D / L)); g = [[None] * (nx + 1) for _ in range(ny + 1)]
    for j in range(ny + 1):
        for i in range(nx + 1):
            u = -L + 2 * L * i / nx; v = -D + 2 * D * j / ny; ex = max(0.0, abs(u) - w / 2); ey = max(0.0, abs(v) - d / 2); e = max(ex, ey); f = 1 - math.exp(-e / 0.06)
            x = math.copysign(min(abs(u), w / 2) + 0.03 * (1 - math.exp(-ex / 0.05)) + (0.011 * math.sin(v * 31 + seed) * f if ex > 0 else 0), u)
            y = math.copysign(min(abs(v), d / 2) + 0.03 * (1 - math.exp(-ey / 0.05)) + (0.011 * math.sin(u * 29 + seed * 2) * f if ey > 0 else 0), v)
            g[j][i] = bm.verts.new((x, y, top + 0.004 + 0.0015 * math.sin(u * 23) * math.sin(v * 19) - (e - 0.03 * f if e > 0 else 0)))
    for j in range(ny):
        for i in range(nx): bm.faces.new((g[j][i], g[j][i + 1], g[j + 1][i + 1], g[j + 1][i]))
    return _obj(bm, name, mat, p, at, rot, angle=80)
def group(name, at=(0, 0, 0), rz=0.0):
    e = bpy.data.objects.new('eq_' + name, None); bpy.context.scene.collection.objects.link(e); e.location = at; e.rotation_euler = (0, 0, rz); PIECES.append(e); return e
X90, Y90 = (math.pi / 2, 0, 0), (0, math.pi / 2, 0)
def castor(p, x, y, r=0.05, w=0.028, mat='eq_rubber', fork='eq_steel_dark'):
    lathe(p, 'castor', mat, [(0.0, -w / 2), (r * 0.72, -w / 2), (r, -w / 2 + 0.006), (r, w / 2 - 0.006), (r * 0.72, w / 2), (0.0, w / 2)], (x, y, r), Y90, seg=24)
    lathe(p, 'hub', 'eq_plastic_light', [(0.0, -w / 2 - 0.001), (r * 0.5, -w / 2 - 0.001), (r * 0.5, w / 2 + 0.001), (0.0, w / 2 + 0.001)], (x, y, r), Y90, seg=20)
    rbox(p, 'fork', fork, (w + 0.022, r * 0.9, 0.012), (x, y + r * 0.1, r * 2 + 0.004), 0.003); rbox(p, 'fork', fork, (0.006, r * 0.8, r * 1.15), (x - w / 2 - 0.008, y + r * 0.1, r * 1.45), 0.002); rbox(p, 'fork', fork, (0.006, r * 0.8, r * 1.15), (x + w / 2 + 0.008, y + r * 0.1, r * 1.45), 0.002)
    cyl(p, 'stem', fork, 0.011, 0.03, (x, y + r * 0.1, r * 2 + 0.022), seg=14)
def star_base(p, legs=5, reach=0.27, z=0.075, mat='eq_steel_dark', wheel=0.026):
    cyl(p, 'hub', mat, 0.045, 0.05, (0, 0, z), seg=24, bevel=0.006)
    for k in range(legs):
        a = 2 * math.pi * k / legs + 0.3; rbox(p, 'leg', mat, (reach, 0.034, 0.022), (math.cos(a) * reach / 2, math.sin(a) * reach / 2, z - 0.006), 0.008, rot=(0, 0.06, a))
        lathe(p, 'wheel', 'eq_rubber', [(0, -0.012), (wheel * 0.7, -0.012), (wheel, -0.007), (wheel, 0.007), (wheel * 0.7, 0.012), (0, 0.012)], (math.cos(a) * reach, math.sin(a) * reach, wheel), (math.pi / 2, 0, a), seg=18)
        cyl(p, 'pin', mat, 0.007, 0.03, (math.cos(a) * reach, math.sin(a) * reach, wheel * 2 + 0.006), seg=10)
def knob(p, mat, r, at, rot=X90, h=0.02): lathe(p, 'knob', mat, [(0, 0), (r, 0), (r, h * 0.55), (r * 0.82, h), (0, h)], at, rot, seg=24)
def screen(p, kind, w, h, at, rot, bezel=0.014, depth=0.028, mat='eq_plastic_dark'):
    """A display: dark bezel, a glass face the browser draws on (mesh named screen_<kind>)."""
    R = Euler(rot).to_matrix(); rbox(p, 'bezel', mat, (w + 2 * bezel, depth, h + 2 * bezel), Vector(at) + R @ Vector((0, depth / 2, 0)), 0.006, rot=rot)
    bm = bmesh.new(); v = [bm.verts.new(q) for q in ((-w / 2, 0, -h / 2), (w / 2, 0, -h / 2), (w / 2, 0, h / 2), (-w / 2, 0, h / 2))]; f = bm.faces.new(v); uv = bm.loops.layers.uv.new('UV0')
    for l, q in zip(f.loops, ((0, 0), (1, 0), (1, 1), (0, 1))): l[uv].uv = q
    return _obj(bm, 'screen_' + kind, 'eq_screen', p, Vector(at) + R @ Vector((0, -0.0012, 0)), rot, smooth=False)

# ------------------------------------------------------------------ the pieces
def op_table(at, rz=0.0):
    """Operating table: low base, telescopic column, four-section top with pads, side rails. Top of the pads: 0.90 m."""
    g = group('op_table', at, rz)
    rbox(g, 'base', 'eq_graphite', (0.54, 0.92, 0.075), (0, -0.06, 0.05), 0.022, 3); rbox(g, 'base_top', 'eq_paint', (0.46, 0.8, 0.03), (0, -0.06, 0.1), 0.012); rbox(g, 'foot_pedal', 'eq_steel', (0.12, 0.05, 0.012), (0.2, -0.54, 0.03), 0.004)
    rbox(g, 'column', 'eq_paint', (0.25, 0.31, 0.3), (0, 0, 0.26), 0.02, 3); rbox(g, 'column', 'eq_steel', (0.2, 0.26, 0.28), (0, 0, 0.5), 0.012); rbox(g, 'column', 'eq_paint', (0.16, 0.22, 0.14), (0, 0, 0.69), 0.01)
    rbox(g, 'chassis', 'eq_steel_dark', (0.42, 1.0, 0.045), (0, 0.06, 0.785), 0.01); rbox(g, 'chassis', 'eq_steel_dark', (0.38, 0.62, 0.035), (0, -0.74, 0.79), 0.008)
    for (w, d, y, x, h) in ((0.25, 0.27, 0.985, 0, 0.065), (0.52, 0.6, 0.5, 0, 0.075), (0.52, 0.42, -0.03, 0, 0.075), (0.245, 0.66, -0.6, -0.138, 0.07), (0.245, 0.66, -0.6, 0.138, 0.07)):
        rbox(g, 'pad', 'eq_pad', (w, d, h), (x, y, 0.9 - h / 2), 0.022, 4); rbox(g, 'plate', 'eq_steel', (w - 0.03, d - 0.03, 0.014), (x, y, 0.9 - h - 0.007), 0.003)
    for sx in (-1, 1):
        for (y0, y1) in ((0.24, 0.78), (-0.22, 0.16), (-0.9, -0.32)):
            tube(g, 'rail', 'eq_steel', [(sx * 0.292, y0, 0.805), (sx * 0.292, y1, 0.805)], 0.0065, 8); [rbox(g, 'standoff', 'eq_steel', (0.03, 0.02, 0.016), (sx * 0.275, yy, 0.805), 0.003) for yy in (y0 + 0.04, y1 - 0.04)]
        rbox(g, 'clamp', 'eq_steel_dark', (0.03, 0.05, 0.05), (sx * 0.3, 0.6, 0.8), 0.006); knob(g, 'eq_plastic_dark', 0.016, (sx * 0.318, 0.6, 0.8), (0, sx * math.pi / 2, 0))
    rbox(g, 'handset', 'eq_plastic_light', (0.05, 0.022, 0.13), (-0.31, 0.34, 0.72), 0.008, rot=(0, 0.25, 0)); tube(g, 'coil', 'eq_cable', [(-0.31, 0.34, 0.65), (-0.27, 0.3, 0.5), (-0.2, 0.2, 0.42), (-0.12, 0.08, 0.5)], 0.004, 6)
    return g
def anesthesia_machine(at, rz=0.0, hose_to=None):
    """Anesthesia workstation: trolley, drawers, work surface, absorber and bellows, vaporizers, gas panel, two screens.
    Its user stands at -Y. hose_to: where the breathing hoses end, in the piece's own coordinates."""
    g = group('anesthesia_machine', at, rz)
    for (x, y) in ((-0.33, -0.25), (0.33, -0.25), (-0.33, 0.25), (0.33, 0.25)): castor(g, x, y, 0.052, 0.03)
    rbox(g, 'chassis', 'eq_graphite', (0.8, 0.64, 0.07), (0, 0, 0.155), 0.02, 3); rbox(g, 'foot_rail', 'eq_steel', (0.5, 0.025, 0.025), (-0.08, -0.34, 0.2), 0.01)
    rbox(g, 'drawers', 'eq_paint', (0.5, 0.56, 0.42), (-0.14, 0.0, 0.4), 0.014, 3)
    for k in range(3):
        rbox(g, 'drawer', 'eq_paint', (0.46, 0.014, 0.118), (-0.14, -0.284, 0.268 + k * 0.132), 0.006); tube(g, 'pull', 'eq_steel', [(-0.3, -0.31, 0.3 + k * 0.132), (0.02, -0.31, 0.3 + k * 0.132)], 0.006, 8)
        for sx in (-0.3, 0.02): cyl(g, 'post', 'eq_steel', 0.005, 0.022, (sx, -0.3, 0.3 + k * 0.132), X90, seg=8)
    rbox(g, 'circuit_block', 'eq_paint_grey', (0.26, 0.5, 0.4), (0.26, 0.02, 0.39), 0.016, 3)
    cyl(g, 'absorber', 'eq_clear', 0.068, 0.2, (0.27, -0.33, 0.37), seg=30, bevel=0.008); cyl(g, 'soda_lime', 'eq_soda', 0.061, 0.17, (0.27, -0.33, 0.365), seg=24); cyl(g, 'absorber_cap', 'eq_plastic_dark', 0.072, 0.03, (0.27, -0.33, 0.485), seg=30, bevel=0.006); rbox(g, 'absorber_arm', 'eq_paint_grey', (0.1, 0.12, 0.05), (0.27, -0.26, 0.5), 0.01)
    rbox(g, 'worktop', 'eq_steel', (0.82, 0.66, 0.022), (0, 0, 0.622), 0.006); rbox(g, 'worktop_lip', 'eq_steel', (0.82, 0.014, 0.03), (0, 0.323, 0.645), 0.004)
    rbox(g, 'tower', 'eq_paint', (0.78, 0.16, 0.76), (0, 0.24, 1.01), 0.016, 3); rbox(g, 'tower_face', 'eq_graphite', (0.72, 0.012, 0.44), (0, 0.156, 0.9), 0.006)
    screen(g, 'vent', 0.3, 0.2, (-0.19, 0.146, 0.94), (-0.2, 0, 0), 0.016, 0.03)
    for k, col in enumerate(('eq_green', 'eq_yellow', 'eq_blue')):
        knob(g, col, 0.019, (0.06 + k * 0.07, 0.148, 0.78), X90, 0.026); cyl(g, 'flow_tube', 'eq_clear', 0.008, 0.16, (0.06 + k * 0.07, 0.146, 0.93), seg=12); cyl(g, 'float', 'eq_white', 0.0055, 0.012, (0.06 + k * 0.07, 0.146, 0.9 + k * 0.022), seg=10)
    rbox(g, 'flush', 'eq_green', (0.05, 0.02, 0.03), (0.3, 0.146, 0.74), 0.008); knob(g, 'eq_plastic_dark', 0.024, (0.31, -0.15, 0.634), (0, 0, 0), 0.034); cyl(g, 'bag_port', 'eq_plastic_dark', 0.014, 0.05, (0.2, -0.3, 0.6), X90, seg=14)
    lathe(g, 'bellows_dome', 'eq_clear', [(0.072, 0), (0.072, 0.14), (0.062, 0.168), (0.03, 0.184), (0, 0.187)], (0.24, 0.06, 0.635), seg=32); lathe(g, 'bellows', 'eq_plastic_dark', [(0, 0)] + [(0.058 if i % 2 else 0.047, 0.006 + i * 0.011) for i in range(11)] + [(0, 0.12)], (0.24, 0.06, 0.638), seg=28); cyl(g, 'bellows_base', 'eq_plastic_dark', 0.08, 0.016, (0.24, 0.06, 0.64), seg=32, bevel=0.004)
    for k, col in enumerate(('eq_yellow', 'eq_purple')):
        x = 0.17 + k * 0.125; rbox(g, 'vaporizer', 'eq_paint_grey', (0.1, 0.12, 0.2), (x, 0.11, 1.2), 0.014, 3); lathe(g, 'dial', col, [(0, 0), (0.047, 0), (0.047, 0.02), (0.04, 0.034), (0, 0.036)], (x, 0.11, 1.3), seg=30); rbox(g, 'sight', 'eq_clear', (0.016, 0.006, 0.06), (x, 0.048, 1.17), 0.003); rbox(g, 'band', col, (0.1, 0.004, 0.022), (x, 0.049, 1.27), 0.001)
    rbox(g, 'vap_bar', 'eq_steel', (0.3, 0.03, 0.03), (0.23, 0.16, 1.24), 0.006)
    rbox(g, 'shelf', 'eq_paint', (0.8, 0.4, 0.028), (0, 0.13, 1.4), 0.01); rbox(g, 'shelf_rail', 'eq_steel', (0.76, 0.012, 0.03), (0, -0.064, 1.43), 0.005)
    rbox(g, 'monitor_foot', 'eq_plastic_dark', (0.16, 0.14, 0.02), (-0.14, 0.14, 1.424), 0.006); rbox(g, 'monitor_neck', 'eq_plastic_dark', (0.05, 0.04, 0.09), (-0.14, 0.17, 1.47), 0.008)
    screen(g, 'monitor', 0.42, 0.27, (-0.14, 0.13, 1.66), (-0.1, 0, 0), 0.018, 0.05); rbox(g, 'alarm_bar', 'eq_led_amber', (0.1, 0.012, 0.012), (-0.14, 0.14, 1.815), 0.004)
    rbox(g, 'side_rail', 'eq_steel', (0.014, 0.5, 0.03), (-0.403, 0.0, 0.9), 0.005); rbox(g, 'side_rail', 'eq_steel', (0.014, 0.5, 0.03), (0.403, 0.0, 0.9), 0.005)
    tube(g, 'bag_arm', 'eq_steel', [(0.39, -0.1, 0.68), (0.47, -0.16, 0.86), (0.5, -0.24, 0.9)], 0.006, 8); lathe(g, 'bag', 'eq_teal', [(0, 0), (0.012, 0), (0.016, 0.03), (0.058, 0.09), (0.078, 0.17), (0.07, 0.24), (0.04, 0.275), (0, 0.283)], (0.5, -0.24, 0.6), seg=24)
    rbox(g, 'suction', 'eq_paint_grey', (0.09, 0.07, 0.14), (-0.43, 0.2, 0.86), 0.01); cyl(g, 'canister', 'eq_clear', 0.055, 0.2, (-0.47, 0.06, 0.74), seg=24, bevel=0.006); cyl(g, 'canister_lid', 'eq_blue', 0.058, 0.02, (-0.47, 0.06, 0.85), seg=24, bevel=0.004)
    tube(g, 'mains', 'eq_cable', [(0.2, 0.33, 0.5), (0.3, 0.42, 0.2), (0.42, 0.5, 0.012), (0.75, 0.56, 0.01)], 0.006, 6)
    for k, col in enumerate(('eq_green', 'eq_yellow', 'eq_white')): tube(g, 'gas_hose', col, [(-0.2 + k * 0.05, 0.33, 0.62), (-0.24 + k * 0.05, 0.46, 0.9), (-0.3 + k * 0.05, 0.6, 1.7), (-0.32 + k * 0.05, 0.66, 2.6)], 0.008, 8)
    if hose_to is not None:
        h = Vector(hose_to); y_piece = h + Vector((0.0, -0.04, 0.05))
        for k, sx in enumerate((0.2, 0.31)):
            a = Vector((sx, -0.27, 0.56)); tube(g, 'breathing_hose', 'eq_hose', [a, a + Vector((0, -0.16, -0.06)), (a + y_piece) / 2 + Vector((0.12 * (k - 0.5), -0.1, -0.2)), y_piece + Vector((0.05 * (k - 0.5) * 2, -0.02, 0.14)), y_piece], 0.0125, 12, ribs=0.1)
        rbox(g, 'y_piece', 'eq_plastic_light', (0.07, 0.035, 0.03), y_piece, 0.008); tube(g, 'catheter_mount', 'eq_hose', [y_piece, (y_piece + h) / 2 + Vector((0, 0, 0.02)), h], 0.01, 10, ribs=0.08, pitch=0.008); cyl(g, 'filter', 'eq_clear', 0.028, 0.035, (y_piece + h) / 2 + Vector((0, 0, 0.02)), X90, seg=18, bevel=0.004)
    return g
def iv_pole(at, rz=0.0, pump=True):
    g = group('iv_pole', at, rz); star_base(g, 5, 0.26, 0.07); cyl(g, 'pole', 'eq_steel', 0.014, 1.1, (0, 0, 0.64), seg=16); cyl(g, 'collar', 'eq_steel_dark', 0.02, 0.05, (0, 0, 1.2), seg=16, bevel=0.004); cyl(g, 'pole', 'eq_chrome', 0.009, 0.82, (0, 0, 1.6), seg=12)
    for k in range(4):
        a = k * math.pi / 2 + 0.4; c, s = math.cos(a), math.sin(a); tube(g, 'hook', 'eq_chrome', [(0, 0, 2.0), (c * 0.09, s * 0.09, 2.03), (c * 0.14, s * 0.14, 2.0), (c * 0.15, s * 0.15, 1.955), (c * 0.125, s * 0.125, 1.94)], 0.004, 6)
    rbox(g, 'bag', 'eq_clear', (0.115, 0.028, 0.2), (0.14, 0.06, 1.8), 0.012, 3); rbox(g, 'fluid', 'eq_fluid', (0.1, 0.02, 0.13), (0.14, 0.06, 1.775), 0.01); rbox(g, 'label', 'eq_white', (0.07, 0.002, 0.07), (0.14, 0.045, 1.8), 0.001); cyl(g, 'drip', 'eq_clear', 0.011, 0.06, (0.14, 0.06, 1.655), seg=12)
    line = [(0.14, 0.06, 1.62), (0.13, 0.04, 1.4), (0.09, -0.02, 1.2)]
    if pump:
        rbox(g, 'pump', 'eq_paint', (0.15, 0.11, 0.21), (0.0, -0.075, 1.08), 0.012, 3); rbox(g, 'pump_door', 'eq_graphite', (0.07, 0.012, 0.17), (0.035, -0.134, 1.08), 0.005); screen(g, 'pump', 0.058, 0.04, (-0.035, -0.132, 1.135), (0, 0, 0), 0.004, 0.006)
        for i in range(6): rbox(g, 'key', 'eq_plastic_light', (0.016, 0.004, 0.014), (-0.052 + (i % 3) * 0.02, -0.132, 1.07 - (i // 3) * 0.02), 0.002)
        rbox(g, 'clamp', 'eq_steel_dark', (0.05, 0.05, 0.06), (0, -0.01, 1.08), 0.008); line += [(0.05, -0.12, 1.19), (0.036, -0.14, 1.08), (0.04, -0.12, 0.96)]
    tube(g, 'line', 'eq_clear', line + [(0.2, -0.2, 0.86), (0.3, -0.3, 0.95)], 0.0022, 6); return g
def surgical_lights(at, targets, reach=((-0.75, -0.2), (0.6, 0.55))):
    """Two light heads on sprung arms from one ceiling mount at `at` (the ceiling). Each head faces its target point."""
    g = group('surgical_lights', at); cyl(g, 'ceiling_plate', 'eq_paint', 0.17, 0.05, (0, 0, -0.025), seg=40, bevel=0.012); cyl(g, 'drop', 'eq_paint', 0.045, 0.34, (0, 0, -0.2), seg=24); heads = []
    for k, ((ax, ay), tgt) in enumerate(zip(reach, targets)):
        z0 = -0.3 - k * 0.1; elbow = Vector((ax, ay, z0)); cyl(g, 'bearing', 'eq_paint_grey', 0.06, 0.07, (0, 0, z0), seg=28, bevel=0.01); tube(g, 'arm', 'eq_paint', [(0, 0, z0), elbow], 0.03, 14)
        cyl(g, 'joint', 'eq_paint_grey', 0.05, 0.09, elbow, seg=24, bevel=0.012); local_t = Vector(tgt) - Vector(at); head = Vector((local_t.x * 0.55 + ax * 0.45, local_t.y * 0.55 + ay * 0.45, -0.95 - k * 0.05))
        mid = (elbow + head) / 2 + Vector((0, 0, 0.14)); tube(g, 'spring_arm', 'eq_paint', [elbow, mid, head + Vector((0, 0, 0.26))], 0.026, 14); cyl(g, 'joint', 'eq_paint_grey', 0.04, 0.07, head + Vector((0, 0, 0.26)), seg=20, bevel=0.01)
        aim = (local_t - head).normalized(); q = aim.to_track_quat('-Z', 'Y'); e = q.to_euler(); h = bpy.data.objects.new('light_head', None); bpy.context.scene.collection.objects.link(h); h.parent = g; h.location = head; h.rotation_euler = e
        tube(g, 'yoke', 'eq_paint', [head + Vector((0, 0, 0.26)), head + q @ Vector((0.2, 0, 0.2)), head + q @ Vector((0.33, 0, 0.06)), head + q @ Vector((0.335, 0, 0.0))], 0.016, 10)
        lathe(h, 'housing', 'eq_paint', [(0, 0.085), (0.1, 0.082), (0.22, 0.066), (0.3, 0.04), (0.33, 0.012), (0.33, -0.012), (0.315, -0.022), (0, -0.022)], (0, 0, 0), seg=48)
        lathe(h, 'lens', 'eq_led', [(0.07, -0.0235), (0.3, -0.0235)], (0, 0, 0), seg=48); lathe(h, 'lens_ring', 'eq_graphite', [(0.158, -0.025), (0.172, -0.025)], (0, 0, 0), seg=48); lathe(h, 'lens_ring', 'eq_graphite', [(0.238, -0.025), (0.25, -0.025)], (0, 0, 0), seg=48)
        for i in range(8): rbox(h, 'lens_rib', 'eq_graphite', (0.008, 0.23, 0.003), (math.cos(i * math.pi / 4) * 0.185, math.sin(i * math.pi / 4) * 0.185, -0.0245), 0.001, rot=(0, 0, i * math.pi / 4 + math.pi / 2))
        lathe(h, 'handle', 'eq_plastic_light', [(0, -0.022), (0.03, -0.022), (0.026, -0.05), (0.02, -0.15), (0.022, -0.16), (0, -0.165)], (0, 0, 0), seg=20); heads.append((Vector(at) + head, Vector(tgt)))
    return g, heads
def pendant(at, column=(0.9, 0.0), rz=0.0):
    """A ceiling supply unit: an arm from the ceiling carrying a column with shelves, outlets and a device."""
    g = group('pendant', at, rz); cx, cy = column; cyl(g, 'ceiling_plate', 'eq_paint', 0.2, 0.06, (0, 0, -0.03), seg=40, bevel=0.012); cyl(g, 'bearing', 'eq_paint_grey', 0.09, 0.12, (0, 0, -0.12), seg=28, bevel=0.01)
    rbox(g, 'arm', 'eq_paint', (math.hypot(cx, cy) + 0.2, 0.2, 0.13), (cx / 2, cy / 2, -0.24), 0.03, 3, rot=(0, 0, math.atan2(cy, cx))); cyl(g, 'bearing', 'eq_paint_grey', 0.085, 0.1, (cx, cy, -0.33), seg=28, bevel=0.01)
    rbox(g, 'column', 'eq_paint', (0.2, 0.24, 1.15), (cx, cy, -0.95), 0.02, 3); rbox(g, 'column_face', 'eq_graphite', (0.012, 0.18, 1.0), (cx - 0.101, cy, -0.95), 0.004)
    for k, col in enumerate(('eq_green', 'eq_yellow', 'eq_blue', 'eq_white', 'eq_white')): cyl(g, 'outlet', col, 0.017, 0.016, (cx - 0.11, cy - 0.05 + (k % 2) * 0.1, -0.56 - (k // 2) * 0.12), Y90, seg=18, bevel=0.003)
    for k in range(6): rbox(g, 'socket', 'eq_white', (0.006, 0.05, 0.05), (cx - 0.108, cy - 0.04 + (k % 2) * 0.08, -1.02 - (k // 2) * 0.1), 0.004)
    for z in (-0.86, -1.3):
        rbox(g, 'shelf', 'eq_paint', (0.46, 0.44, 0.022), (cx + 0.3, cy, z), 0.008); rbox(g, 'shelf_rail', 'eq_steel', (0.012, 0.44, 0.04), (cx + 0.53, cy, z + 0.03), 0.004)
    rbox(g, 'device', 'eq_paint', (0.36, 0.36, 0.15), (cx + 0.3, cy, -1.212), 0.012, 3); rbox(g, 'device_face', 'eq_graphite', (0.008, 0.33, 0.12), (cx + 0.484, cy, -1.212), 0.004); screen(g, 'device', 0.1, 0.07, (cx + 0.4895, cy - 0.09, -1.2), (0, 0, math.pi / 2), 0.004, 0.004)
    for k in range(3): knob(g, ('eq_yellow', 'eq_blue', 'eq_plastic_light')[k], 0.016, (cx + 0.488, cy + 0.02 + k * 0.05, -1.2), (0, math.pi / 2, 0), 0.02)
    rbox(g, 'handle', 'eq_steel', (0.02, 0.3, 0.02), (cx + 0.3, cy - 0.25, -1.5), 0.008); tube(g, 'lead', 'eq_cable', [(cx + 0.46, cy + 0.1, -1.24), (cx + 0.6, cy + 0.16, -1.5), (cx + 0.5, cy + 0.3, -1.9)], 0.004, 6); return g
def back_table(at, rz=0.0, w=1.5, d=0.7, h=0.9):
    g = group('back_table', at, rz)
    for sx in (-1, 1):
        for sy in (-1, 1): cyl(g, 'leg', 'eq_steel', 0.016, h - 0.1, (sx * (w / 2 - 0.05), sy * (d / 2 - 0.05), (h - 0.1) / 2 + 0.08), seg=14); castor(g, sx * (w / 2 - 0.05), sy * (d / 2 - 0.05) - 0.004, 0.038, 0.022)
    rbox(g, 'shelf', 'eq_steel', (w - 0.06, d - 0.06, 0.016), (0, 0, 0.3), 0.004); rbox(g, 'top', 'eq_steel', (w, d, 0.02), (0, 0, h - 0.01), 0.005); cloth(g, 'drape', 'eq_drape', w, d, h, 0.42, n=52, seed=3)
    for k, (x, y, ww, dd) in enumerate(((-0.45, 0.05, 0.42, 0.3), (0.05, 0.1, 0.3, 0.22), (0.45, -0.05, 0.32, 0.26))):
        rbox(g, 'tray', 'eq_steel', (ww, dd, 0.012), (x, y, h + 0.012), 0.004); [rbox(g, 'tray_wall', 'eq_steel', s, (x + ox, y + oy, h + 0.032), 0.003) for (s, ox, oy) in (((ww, 0.006, 0.04), 0, dd / 2), ((ww, 0.006, 0.04), 0, -dd / 2), ((0.006, dd, 0.04), ww / 2, 0), ((0.006, dd, 0.04), -ww / 2, 0))]
        for i in range(5): tube(g, 'instrument', 'eq_chrome', [(x - ww / 2 + 0.05 + i * (ww - 0.1) / 4, y - dd / 2 + 0.03, h + 0.024), (x - ww / 2 + 0.05 + i * (ww - 0.1) / 4 + 0.006, y + dd / 2 - 0.04, h + 0.024)], 0.0035, 6)
    lathe(g, 'basin', 'eq_steel', [(0, 0.004), (0.09, 0.004), (0.14, 0.07), (0.146, 0.075), (0.138, 0.072), (0.086, 0.01), (0, 0.01)], (0.02, -0.19, h + 0.006), seg=32); return g
def mayo_stand(at, rz=0.0, h=1.26):
    g = group('mayo_stand', at, rz); tube(g, 'base', 'eq_steel', [(-0.26, -0.3, 0.05), (-0.26, 0.3, 0.05), (0.26, 0.3, 0.05), (0.26, -0.02, 0.05)], 0.014, 10)
    for (x, y) in ((-0.26, -0.3), (-0.26, 0.3), (0.26, 0.3)): castor(g, x, y, 0.03, 0.02)
    cyl(g, 'post', 'eq_steel', 0.019, 0.7, (0.26, 0.3, 0.42), seg=16); cyl(g, 'post', 'eq_chrome', 0.013, h - 0.62, (0.26, 0.3, 0.62 + (h - 0.62) / 2), seg=12); knob(g, 'eq_plastic_dark', 0.022, (0.285, 0.3, 0.76), (0, math.pi / 2, 0)); tube(g, 'tray_arm', 'eq_steel', [(0.26, 0.3, h - 0.02), (0.26, 0.05, h - 0.02), (0.0, 0.0, h - 0.02)], 0.012, 8)
    rbox(g, 'tray', 'eq_steel', (0.5, 0.34, 0.012), (0, 0, h), 0.005); cloth(g, 'drape', 'eq_drape', 0.5, 0.34, h + 0.006, 0.24, n=36, seed=5)
    for i in range(7): tube(g, 'instrument', 'eq_chrome', [(-0.18 + i * 0.06, -0.11, h + 0.018), (-0.176 + i * 0.06, 0.1, h + 0.018)], 0.0032, 6)
    return g
def stool(at, rz=0.0, h=0.56, mat='eq_pad'):
    g = group('stool', at, rz); star_base(g, 5, 0.25, 0.065); cyl(g, 'column', 'eq_plastic_dark', 0.028, 0.2, (0, 0, 0.18), seg=16); cyl(g, 'column', 'eq_chrome', 0.017, h - 0.3, (0, 0, 0.28 + (h - 0.3) / 2), seg=12)
    lathe(g, 'foot_ring', 'eq_chrome', [(0.16 + 0.01 * math.cos(a), 0.01 * math.sin(a)) for a in [i * math.pi / 5 for i in range(11)]], (0, 0, 0.26), seg=32)
    for k in range(3): tube(g, 'spoke', 'eq_chrome', [(0.02 * math.cos(k * 2.094), 0.02 * math.sin(k * 2.094), 0.26), (0.16 * math.cos(k * 2.094), 0.16 * math.sin(k * 2.094), 0.26)], 0.005, 6)
    lathe(g, 'seat', mat, [(0, 0), (0.16, 0), (0.18, 0.015), (0.182, 0.045), (0.165, 0.07), (0.08, 0.078), (0, 0.078)], (0, 0, h - 0.07), seg=36); cyl(g, 'seat_plate', 'eq_plastic_dark', 0.12, 0.016, (0, 0, h - 0.078), seg=24); return g
def kick_bucket(at):
    g = group('kick_bucket', at); lathe(g, 'ring', 'eq_steel', [(0.19 + 0.012 * math.cos(a), 0.012 * math.sin(a)) for a in [i * math.pi / 5 for i in range(11)]], (0, 0, 0.1), seg=36)
    for k in range(3): castor(g, 0.19 * math.cos(k * 2.094 + 0.5), 0.19 * math.sin(k * 2.094 + 0.5), 0.028, 0.018)
    lathe(g, 'bucket', 'eq_steel', [(0, 0.085), (0.13, 0.085), (0.17, 0.34), (0.176, 0.345), (0.166, 0.34), (0.126, 0.095), (0, 0.095)], (0, 0, 0), seg=36); tube(g, 'bail', 'eq_steel', [(-0.172, 0, 0.33), (-0.15, 0, 0.44), (0, 0, 0.5), (0.15, 0, 0.44), (0.172, 0, 0.33)], 0.004, 6); return g
def hamper(at, rz=0.0, bag='eq_cream', lid='eq_white'):
    g = group('hamper', at, rz)
    for (x, y) in ((-0.2, -0.2), (0.2, -0.2), (-0.2, 0.2), (0.2, 0.2)): cyl(g, 'leg', 'eq_steel', 0.011, 0.82, (x, y, 0.47), seg=10); castor(g, x, y, 0.028, 0.018)
    tube(g, 'rim', 'eq_steel', [(-0.2, -0.2, 0.88), (0.2, -0.2, 0.88), (0.2, 0.2, 0.88), (-0.2, 0.2, 0.88), (-0.2, -0.2, 0.88)], 0.011, 8); tube(g, 'brace', 'eq_steel', [(-0.2, -0.2, 0.16), (0.2, -0.2, 0.16), (0.2, 0.2, 0.16), (-0.2, 0.2, 0.16), (-0.2, -0.2, 0.16)], 0.008, 8)
    lathe(g, 'bag', bag, [(0, 0.2), (0.16, 0.2), (0.21, 0.4), (0.2, 0.7), (0.21, 0.87), (0.2, 0.875)], (0, 0, 0), seg=4 * 6); rbox(g, 'lid', lid, (0.46, 0.46, 0.02), (0, 0.02, 0.905), 0.01, rot=(0.06, 0, 0)); return g
def drawer_cart(at, rz=0.0, colour='eq_blue', w=0.66, d=0.5, h=0.9, rows=5):
    """A procedure cart: coloured drawer fronts, a railed top, a few boxes and a sharps container."""
    g = group('drawer_cart', at, rz)
    for (x, y) in ((-w / 2 + 0.06, -d / 2 + 0.06), (w / 2 - 0.06, -d / 2 + 0.06), (-w / 2 + 0.06, d / 2 - 0.06), (w / 2 - 0.06, d / 2 - 0.06)): castor(g, x, y, 0.05, 0.028)
    rbox(g, 'body', 'eq_paint', (w, d, h - 0.14), (0, 0, 0.14 + (h - 0.14) / 2), 0.016, 3); dh = (h - 0.2) / rows
    for k in range(rows):
        z = 0.17 + dh * (k + 0.5); rbox(g, 'drawer', colour, (w - 0.05, 0.014, dh - 0.012), (0, -d / 2 - 0.006, z), 0.006); rbox(g, 'pull', 'eq_steel', (w * 0.5, 0.016, 0.014), (0, -d / 2 - 0.022, z + dh * 0.22), 0.005); rbox(g, 'tag', 'eq_white', (0.07, 0.002, 0.022), (w * 0.3, -d / 2 - 0.014, z - dh * 0.2), 0.001)
    rbox(g, 'top', 'eq_plastic_light', (w + 0.03, d + 0.03, 0.022), (0, 0, h + 0.008), 0.008); tube(g, 'top_rail', 'eq_steel', [(-w / 2, -d / 2 + 0.02, h + 0.06), (-w / 2, d / 2, h + 0.06), (w / 2, d / 2, h + 0.06), (w / 2, -d / 2 + 0.02, h + 0.06)], 0.006, 8)
    for (x, y) in ((-w / 2, d / 2), (w / 2, d / 2), (-w / 2, -d / 2 + 0.02), (w / 2, -d / 2 + 0.02)): cyl(g, 'rail_post', 'eq_steel', 0.005, 0.045, (x, y, h + 0.04), seg=8)
    tube(g, 'push_handle', 'eq_steel', [(w / 2 + 0.01, -0.15, h - 0.1), (w / 2 + 0.07, -0.15, h - 0.06), (w / 2 + 0.07, 0.15, h - 0.06), (w / 2 + 0.01, 0.15, h - 0.1)], 0.009, 8)
    rbox(g, 'glove_box', 'eq_white', (0.24, 0.12, 0.07), (-0.14, 0.12, h + 0.055), 0.004); rbox(g, 'glove_band', 'eq_purple', (0.242, 0.122, 0.022), (-0.14, 0.12, h + 0.04), 0.002); rbox(g, 'box', 'eq_white', (0.16, 0.1, 0.05), (0.15, 0.13, h + 0.045), 0.004)
    rbox(g, 'sharps', 'eq_red', (0.13, 0.11, 0.2), (-w / 2 - 0.075, 0.08, h - 0.2), 0.012, 3); rbox(g, 'sharps_lid', 'eq_clear', (0.13, 0.11, 0.035), (-w / 2 - 0.075, 0.08, h - 0.085), 0.01); return g
def wall_cabinet(at, rz=0.0, w=0.9, h=2.05, d=0.36):
    """A tall supply cabinet with glass doors: stocked shelves behind them."""
    g = group('cabinet', at, rz); t = 0.022; rbox(g, 'plinth', 'eq_steel_dark', (w - 0.02, d - 0.04, 0.1), (0, 0.01, 0.05), 0.003)
    for (sz, c) in (((t, d, h), (-w / 2 + t / 2, 0, h / 2 + 0.1)), ((t, d, h), (w / 2 - t / 2, 0, h / 2 + 0.1)), ((w, d, t), (0, 0, 0.1 + t / 2)), ((w, d, t), (0, 0, h + 0.1 - t / 2)), ((w, t, h), (0, d / 2 - t / 2, h / 2 + 0.1))): rbox(g, 'carcass', 'eq_steel', sz, c, 0.004)
    rbox(g, 'interior', 'eq_white', (w - 2 * t, 0.006, h - 2 * t), (0, d / 2 - t - 0.004, h / 2 + 0.1), 0.001); rbox(g, 'cabinet_light', 'eq_led_soft', (w - 0.1, 0.02, 0.012), (0, -d / 2 + 0.05, h + 0.1 - t - 0.008), 0.003)
    random.seed(int(at[0] * 10 + at[1] * 7))
    for k in range(5):
        z = 0.3 + k * 0.38; rbox(g, 'shelf', 'eq_steel', (w - 0.06, d - 0.08, 0.012), (0, -0.01, z), 0.002); x = -w / 2 + 0.08
        while x < w / 2 - 0.12:
            bw = random.choice((0.1, 0.14, 0.18)); bh = random.choice((0.1, 0.16, 0.22)); rbox(g, 'stock', random.choice(('eq_white', 'eq_white', 'eq_cream', 'eq_blue', 'eq_plastic_light')), (bw, 0.16, bh), (x + bw / 2, -0.03, z + 0.008 + bh / 2), 0.004); x += bw + 0.012
    for sx in (-1, 1):
        rbox(g, 'door', 'eq_glass', (w / 2 - 0.02, 0.008, h - 0.06), (sx * w / 4, -d / 2 - 0.004, h / 2 + 0.1), 0.002)
        for (s, ox, oz) in (((0.03, 0.014, h - 0.04), sx * (w / 2 - 0.016), 0), ((0.03, 0.014, h - 0.04), sx * 0.016, 0), ((w / 2, 0.014, 0.03), sx * w / 4, h / 2 - 0.035), ((w / 2, 0.014, 0.03), sx * w / 4, -h / 2 + 0.035)): rbox(g, 'door_frame', 'eq_steel', s, (ox, -d / 2 - 0.006, h / 2 + 0.1 + oz), 0.004)
        rbox(g, 'pull', 'eq_steel_dark', (0.012, 0.03, 0.22), (sx * 0.05, -d / 2 - 0.022, 1.1), 0.005)
    return g
def wall_unit(at, rz=0.0, w=1.9, h=1.1, kind='wall', label_leds=True):
    """A large display set in a dark surround, with a slim status strip beneath. Faces -Y."""
    g = group('wall_display', at, rz); rbox(g, 'surround', 'eq_graphite', (w + 0.12, 0.05, h + 0.2), (0, 0.0, 0), 0.01); screen(g, kind, w, h, (0, -0.026, 0.03), (0, 0, 0), 0.012, 0.02)
    if label_leds:
        for k, col in enumerate(('eq_led_green', 'eq_led_soft', 'eq_led_amber')): rbox(g, 'status', col, (0.05, 0.006, 0.012), (-w / 2 + 0.06 + k * 0.08, -0.027, -h / 2 - 0.045), 0.002)
    return g
def control_panel(at, rz=0.0):
    """The room's wall panel: a touch screen, a clock, a timer bar, gas and power outlets, a glove dispenser."""
    g = group('control_panel', at, rz); rbox(g, 'plate', 'eq_steel', (0.62, 0.02, 1.05), (0, 0, 0), 0.006); screen(g, 'panel', 0.36, 0.26, (-0.08, -0.012, 0.3), (0, 0, 0), 0.01, 0.012)
    lathe(g, 'clock_rim', 'eq_steel_dark', [(0, 0), (0.105, 0), (0.105, 0.018), (0.098, 0.022), (0, 0.022)], (0.2, -0.01, 0.34), X90, seg=40); lathe(g, 'clock_face', 'eq_face', [(0, 0.0225), (0.096, 0.0225)], (0.2, -0.01, 0.34), X90, seg=40)
    for k in range(12): a = k * math.pi / 6; rbox(g, 'tick', 'eq_plastic_dark', (0.004, 0.002, 0.014 if k % 3 else 0.024), (0.2 + math.sin(a) * 0.082, -0.0335, 0.34 + math.cos(a) * 0.082), 0.0005, rot=(0, -a, 0))
    rbox(g, 'hand', 'eq_plastic_dark', (0.006, 0.002, 0.055), (0.2 + 0.018, -0.0345, 0.34 + 0.02), 0.001, rot=(0, -0.73, 0)); rbox(g, 'hand', 'eq_plastic_dark', (0.004, 0.002, 0.078), (0.2 - 0.03, -0.035, 0.34 + 0.022), 0.001, rot=(0, 0.93, 0)); cyl(g, 'pin', 'eq_red', 0.006, 0.004, (0.2, -0.036, 0.34), X90, seg=12)
    for k, col in enumerate(('eq_green', 'eq_yellow', 'eq_blue', 'eq_white')):
        rbox(g, 'outlet_plate', 'eq_paint', (0.11, 0.012, 0.11), (-0.21 + k * 0.14, -0.012, -0.05), 0.006); lathe(g, 'outlet', col, [(0, 0), (0.034, 0), (0.034, 0.012), (0.024, 0.02), (0, 0.02)], (-0.21 + k * 0.14, -0.018, -0.05), X90, seg=24); cyl(g, 'outlet_core', 'eq_steel_dark', 0.012, 0.01, (-0.21 + k * 0.14, -0.04, -0.05), X90, seg=14)
    for k in range(6): rbox(g, 'socket', 'eq_white', (0.075, 0.008, 0.115), (-0.23 + k * 0.092, -0.012, -0.26), 0.006); rbox(g, 'socket_slot', 'eq_plastic_dark', (0.03, 0.002, 0.045), (-0.23 + k * 0.092, -0.0165, -0.25), 0.002)
    rbox(g, 'dispenser', 'eq_steel', (0.27, 0.1, 0.3), (0.16, -0.05, 0.0), 0.006)
    for k, col in enumerate(('eq_purple', 'eq_blue', 'eq_white')): rbox(g, 'gloves', col, (0.24, 0.006, 0.08), (0.16, -0.103, 0.1 - k * 0.095), 0.003)
    return g
def stretcher(at, rz=0.0):
    """A procedure stretcher: wheeled base, two lifts, a mattress deck, rails folded down, push handles. Mattress top 0.86 m."""
    g = group('stretcher', at, rz)
    for (x, y) in ((-0.27, -0.82), (0.27, -0.82), (-0.27, 0.82), (0.27, 0.82)): castor(g, x, y, 0.075, 0.036, fork='eq_steel')
    rbox(g, 'base', 'eq_graphite', (0.62, 1.5, 0.09), (0, 0, 0.215), 0.03, 3); rbox(g, 'base_tray', 'eq_plastic_dark', (0.5, 1.1, 0.03), (0, 0, 0.275), 0.012); rbox(g, 'pedal', 'eq_green', (0.07, 0.11, 0.014), (0.34, -0.5, 0.13), 0.004); rbox(g, 'pedal', 'eq_red', (0.07, 0.11, 0.014), (0.34, -0.36, 0.13), 0.004)
    for y in (-0.48, 0.48): rbox(g, 'lift', 'eq_paint', (0.16, 0.16, 0.22), (0, y, 0.37), 0.014, 3); cyl(g, 'ram', 'eq_chrome', 0.045, 0.22, (0, y, 0.57), seg=24); rbox(g, 'lift_head', 'eq_steel_dark', (0.22, 0.2, 0.04), (0, y, 0.685), 0.008)
    rbox(g, 'deck', 'eq_steel_dark', (0.66, 1.92, 0.035), (0, 0, 0.722), 0.012); rbox(g, 'mattress', 'eq_mattress', (0.64, 1.9, 0.11), (0, 0, 0.805), 0.035, 4); rbox(g, 'pillow', 'eq_white', (0.42, 0.26, 0.07), (0, 0.76, 0.885), 0.03, 4)
    for sx in (-1, 1):
        tube(g, 'rail', 'eq_steel', [(sx * 0.36, -0.55, 0.6), (sx * 0.37, -0.55, 0.5), (sx * 0.37, 0.45, 0.5), (sx * 0.36, 0.45, 0.6)], 0.011, 10); tube(g, 'rail', 'eq_steel', [(sx * 0.37, -0.55, 0.42), (sx * 0.37, 0.45, 0.42)], 0.009, 8)
        for y in (-0.3, -0.05, 0.2): tube(g, 'rail_bar', 'eq_steel', [(sx * 0.37, y, 0.42), (sx * 0.37, y, 0.5)], 0.007, 8)
        tube(g, 'push', 'eq_steel', [(sx * 0.22, 0.95, 0.74), (sx * 0.24, 1.05, 0.9), (sx * 0.24, 1.07, 1.0)], 0.012, 10); cyl(g, 'grip', 'eq_rubber', 0.016, 0.11, (sx * 0.24, 1.07, 0.985), seg=14)
        rbox(g, 'bumper', 'eq_rubber', (0.05, 0.05, 0.05), (sx * 0.31, 0.95, 0.72), 0.02); rbox(g, 'bumper', 'eq_rubber', (0.05, 0.05, 0.05), (sx * 0.31, -0.95, 0.72), 0.02)
    cyl(g, 'iv_socket', 'eq_steel', 0.012, 0.9, (0.3, 0.9, 1.2), seg=10); return g
def ultrasound(at, rz=0.0):
    """A cart-based ultrasound unit: wheeled base, column, tilted console with keys, a touch panel, a monitor on an arm,
    two probes in holders. Its operator stands at -Y. The browser plays a recorded clip on the monitor (mesh screen_us)."""
    g = group('ultrasound', at, rz)
    for (x, y) in ((-0.22, -0.28), (0.22, -0.28), (-0.22, 0.28), (0.22, 0.28)): castor(g, x, y, 0.055, 0.03)
    rbox(g, 'base', 'eq_graphite', (0.52, 0.66, 0.1), (0, 0, 0.165), 0.04, 4); rbox(g, 'base_cap', 'eq_paint', (0.4, 0.5, 0.05), (0, 0.02, 0.235), 0.02, 3); rbox(g, 'column', 'eq_paint', (0.2, 0.24, 0.62), (0, 0.1, 0.56), 0.03, 4); rbox(g, 'column_grille', 'eq_graphite', (0.14, 0.01, 0.3), (0, -0.021, 0.5), 0.004)
    rbox(g, 'body', 'eq_paint', (0.5, 0.46, 0.14), (0, 0.0, 0.92), 0.03, 4); rbox(g, 'ports', 'eq_graphite', (0.36, 0.012, 0.07), (0, -0.232, 0.9), 0.006)
    for k in range(3): cyl(g, 'port', 'eq_steel_dark', 0.022, 0.016, (-0.11 + k * 0.11, -0.24, 0.9), X90, seg=18, bevel=0.003)
    T = (0.34, 0, 0); rbox(g, 'console', 'eq_graphite', (0.56, 0.36, 0.035), (0, -0.2, 1.045), 0.014, 3, rot=T); R = Euler(T).to_matrix(); K = lambda x, y, z=0.02: Vector((0, -0.2, 1.045)) + R @ Vector((x, y, z))
    for r in range(3):
        for c in range(11): rbox(g, 'key', 'eq_plastic_light', (0.03, 0.022, 0.006), K(-0.2 + c * 0.04, -0.13 + r * 0.03), 0.003, rot=T)
    lathe(g, 'trackball', 'eq_white', [(0.03 * math.sin(a), 0.03 * (1 - math.cos(a)) - 0.012) for a in [i * math.pi / 12 for i in range(13)]], K(0.0, 0.0, 0.012), T, seg=24); lathe(g, 'trackball_ring', 'eq_steel', [(0.034, 0), (0.044, 0), (0.044, 0.006), (0.034, 0.008)], K(0.0, 0.0, 0.016), T, seg=28)
    for (x, y, col) in ((-0.2, 0.02, 'eq_plastic_light'), (-0.14, 0.02, 'eq_plastic_light'), (0.14, 0.02, 'eq_plastic_light'), (0.2, 0.02, 'eq_teal'), (-0.2, 0.09, 'eq_plastic_light'), (0.2, 0.09, 'eq_plastic_light')): knob(g, col, 0.017, K(x, y, 0.017), T, 0.02)
    for c in range(8): rbox(g, 'slider_slot', 'eq_plastic_dark', (0.006, 0.08, 0.004), K(-0.105 + c * 0.03, 0.105), 0.001, rot=T); rbox(g, 'slider', 'eq_plastic_light', (0.014, 0.014, 0.01), K(-0.105 + c * 0.03, 0.085 + 0.04 * math.sin(c * 0.9) * 0.5 + 0.02), 0.003, rot=T)
    screen(g, 'us_touch', 0.24, 0.13, (0, -0.045, 1.2), (-0.62, 0, 0), 0.01, 0.016); rbox(g, 'touch_neck', 'eq_graphite', (0.1, 0.05, 0.1), (0, 0.0, 1.13), 0.012)
    cyl(g, 'arm_post', 'eq_paint_grey', 0.03, 0.34, (0, 0.16, 1.14), seg=18); tube(g, 'arm', 'eq_paint_grey', [(0, 0.16, 1.3), (0.1, 0.14, 1.42), (0.03, 0.06, 1.5)], 0.024, 12); cyl(g, 'arm_joint', 'eq_graphite', 0.034, 0.06, (0.03, 0.06, 1.5), X90, seg=18, bevel=0.006)
    screen(g, 'us', 0.5, 0.31, (0.0, 0.03, 1.56), (-0.14, 0, 0), 0.016, 0.03, 'eq_graphite'); rbox(g, 'monitor_back', 'eq_paint', (0.4, 0.03, 0.24), (0.0, 0.075, 1.555), 0.012, rot=(-0.14, 0, 0)); rbox(g, 'power_led', 'eq_led_green', (0.012, 0.004, 0.004), (0.22, 0.012, 1.395), 0.001)
    for sx, shape in ((-1, 'linear'), (1, 'curved')):
        hx = sx * 0.29; rbox(g, 'holder', 'eq_graphite', (0.07, 0.09, 0.06), (hx, -0.16, 1.0), 0.016, 3); rbox(g, 'probe_grip', 'eq_plastic_light', (0.03, 0.024, 0.1), (hx, -0.16, 1.07), 0.01, 3)
        if shape == 'linear': rbox(g, 'probe_head', 'eq_plastic_light', (0.056, 0.022, 0.03), (hx, -0.16, 1.13), 0.007, 3); rbox(g, 'probe_lens', 'eq_plastic_dark', (0.048, 0.016, 0.006), (hx, -0.16, 1.147), 0.003)
        else: lathe(g, 'probe_head', 'eq_plastic_light', [(0, 0)] + [(0.034 * math.sin(a), 0.03 * (1 - math.cos(a))) for a in [i * math.pi / 14 for i in range(1, 8)]], (hx, -0.16, 1.155), (math.pi, 0, 0), seg=20)
        tube(g, 'probe_cable', 'eq_plastic_light', [(hx, -0.16, 1.02), (hx, -0.2, 0.9), (hx * 0.9, -0.3, 0.72), (hx * 0.6, -0.33, 0.78), (sx * 0.11, -0.25, 0.9)], 0.0055, 8)
    cyl(g, 'gel', 'eq_white', 0.026, 0.12, (-0.2, 0.05, 1.05), seg=16, bevel=0.006); lathe(g, 'gel_cap', 'eq_blue', [(0, 0), (0.02, 0), (0.008, 0.04), (0, 0.042)], (-0.2, 0.05, 1.11), seg=14)
    tube(g, 'handle', 'eq_steel', [(-0.22, 0.24, 0.98), (-0.22, 0.32, 1.02), (0.22, 0.32, 1.02), (0.22, 0.24, 0.98)], 0.012, 10); tube(g, 'mains', 'eq_cable', [(0.1, 0.33, 0.24), (0.2, 0.44, 0.05), (0.5, 0.5, 0.012), (0.9, 0.52, 0.01)], 0.006, 6); return g
def curtain(at, rz=0.0, w=1.3, h=2.25, folds=9):
    """A cubicle curtain drawn back on its ceiling track: vertical folds, a mesh top band."""
    g = group('curtain', at, rz); bm = bmesh.new(); nx, nz = folds * 8, 10; grid = [[None] * (nx + 1) for _ in range(nz + 1)]
    for k in range(nz + 1):
        for i in range(nx + 1):
            u = i / nx; z = h * k / nz; amp = 0.05 * (0.55 + 0.45 * (1 - k / nz)); grid[k][i] = bm.verts.new((-w / 2 + w * u, amp * math.sin(u * folds * 2 * math.pi) + 0.01 * math.sin(u * 37 + k), 0.3 + z))
    for k in range(nz):
        for i in range(nx): bm.faces.new((grid[k][i], grid[k][i + 1], grid[k + 1][i + 1], grid[k + 1][i]))
    _obj(bm, 'curtain', 'eq_curtain', g, (0, 0, 0), (0, 0, 0), angle=80); rbox(g, 'track', 'eq_steel', (w + 1.6, 0.03, 0.03), (0.8, 0, h + 0.36), 0.006)
    for i in range(folds): cyl(g, 'glider', 'eq_white', 0.006, 0.06, (-w / 2 + w * (i + 0.5) / folds, 0, h + 0.32), seg=8)
    return g
def sharps_wall(at, rz=0.0):
    g = group('sharps', at, rz); rbox(g, 'bracket', 'eq_steel', (0.2, 0.02, 0.3), (0, 0, 0), 0.004); rbox(g, 'bin', 'eq_red', (0.18, 0.13, 0.26), (0, -0.075, -0.01), 0.016, 3); rbox(g, 'lid', 'eq_clear', (0.18, 0.13, 0.05), (0, -0.075, 0.145), 0.014); rbox(g, 'label', 'eq_white', (0.1, 0.002, 0.07), (0, -0.141, -0.02), 0.001); return g
def monitor_arm(at, rz=0.0, kind='bay'):
    """A patient monitor on a wall arm."""
    g = group('wall_monitor', at, rz); rbox(g, 'channel', 'eq_steel', (0.07, 0.02, 0.5), (0, 0, 0), 0.004); cyl(g, 'pivot', 'eq_steel_dark', 0.022, 0.06, (0, -0.03, 0.05), seg=14); tube(g, 'arm', 'eq_paint', [(0, -0.03, 0.05), (0.16, -0.16, 0.07), (0.06, -0.3, 0.08)], 0.016, 10)
    screen(g, kind, 0.34, 0.22, (0.06, -0.34, 0.1), (-0.08, 0, 0.25), 0.014, 0.05); return g

# ------------------------------------------------------------------ a studio picture of everything, to judge the modelling on its own
if __name__ == '__main__' or (len(sys.argv) > 1 and os.path.basename(sys.argv[sys.argv.index('--python') + 1] if '--python' in sys.argv else '') == 'clinical_kit.py'):
    out = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv else '/tmp/kit.png'
    bpy.ops.wm.read_factory_settings(use_empty=True); scene = bpy.context.scene; materials()
    op_table((0, 0, 0)); anesthesia_machine((1.25, 1.35, 0), -2.3, hose_to=None); iv_pole((-0.9, 0.9, 0)); surgical_lights((0, 0.1, 3.0), [(0, 0.3, 0.95), (0, -0.2, 0.95)]); pendant((2.2, -0.6, 3.0), (-0.75, 0.2)); back_table((-2.3, -0.6, 0), 1.5708); mayo_stand((0.05, -0.95, 0))
    stool((0.5, 1.9, 0)); kick_bucket((-1.2, -1.0, 0)); hamper((-3.0, 1.4, 0)); drawer_cart((2.5, 1.9, 0), -1.9); wall_cabinet((3.6, 2.2, 0), -1.5708); stretcher((5.4, 0, 0)); ultrasound((6.5, 1.0, 0), 2.5); curtain((7.6, -0.6, 0), 1.5708); control_panel((3.2, 3.0, 1.4)); wall_unit((0, 3.0, 1.75), 0, 1.5, 0.85)
    fl = bpy.data.meshes.new('f'); bm = bmesh.new(); bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=14); bm.to_mesh(fl); bm.free(); pbr('floor', (0.2, 0.24, 0.27), 0.4); fl.materials.append(M['floor']); scene.collection.objects.link(bpy.data.objects.new('f', fl))
    scene.render.engine = 'CYCLES'; scene.cycles.samples = 96; scene.cycles.use_denoising = True; scene.view_settings.view_transform = 'AgX'
    try: prefs = bpy.context.preferences.addons['cycles'].preferences; prefs.compute_device_type = 'METAL'; prefs.get_devices(); scene.cycles.device = 'GPU'
    except Exception: pass
    w = bpy.data.worlds.new('w'); scene.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs[0].default_value = (0.55, 0.62, 0.66, 1); w.node_tree.nodes['Background'].inputs[1].default_value = 0.5
    for (loc, e, sz) in (((2, -3, 4.5), 1800, 4.0), ((6, 4, 4), 900, 3.0), ((-3, 3, 3.5), 500, 3.0)):
        d = bpy.data.lights.new('l', 'AREA'); d.energy = e; d.size = sz; lo = bpy.data.objects.new('l', d); scene.collection.objects.link(lo); lo.location = loc; lo.rotation_euler = (Vector((2, 0.5, 0.8)) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler()
    for name, loc, tgt, lens in (('a', (2.6, -4.6, 2.3), (0.3, 0.6, 0.9), 30), ('b', (3.6, 3.4, 1.7), (1.1, 1.2, 1.0), 36), ('c', (7.6, -3.6, 2.0), (6.0, 0.4, 0.9), 36)):
        cam = bpy.data.cameras.new(name); cam.lens = lens; co = bpy.data.objects.new(name, cam); scene.collection.objects.link(co); co.location = loc; co.rotation_euler = (Vector(tgt) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler(); scene.camera = co
        scene.render.resolution_x, scene.render.resolution_y = 1100, 640; scene.render.filepath = out.replace('.png', f'_{name}.png'); bpy.ops.render.render(write_still=True)
    print('KIT pieces', len(PIECES), 'objects', len(bpy.data.objects), 'tris', sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in bpy.data.objects if o.type == 'MESH'))
