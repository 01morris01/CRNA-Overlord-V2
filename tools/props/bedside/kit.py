"""kit.py: the small modelling library the bedside props are built with (Blender 5.1, run headless).

Everything here is authored directly in the coordinates the browser uses: metres, +Y up, and exported with Blender's
axis conversion switched off, so a number written in a build script is the number three.js sees.

What it gives the build scripts:
  fillet(profile, r)            round the corners of a 2D outline so every edge carries a highlight
  lathe(profile, ...)           a surface of revolution, optionally with a non-circular section at chosen points
  prism, tube, slab, patch      extrusions, swept tubes, rounded plates, curved label patches with a 0..1 UV
  Item                          one asset: its root node, named part nodes, anchors, materials, and the raw export

Materials are plain metal-roughness ones. Clear plastic and glass are alpha-blended with low roughness (no transmission:
three.js would add a whole scene pass for it); every blended material has "clear" in its name."""
import bpy, bmesh, math, os, json, sys
from mathutils import Vector, Matrix

MM = 0.001
TAU = math.tau

# ---------------------------------------------------------------------------------------------- scene
def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    for b in (bpy.data.meshes, bpy.data.materials, bpy.data.images, bpy.data.curves):
        for x in list(b): b.remove(x)

# ---------------------------------------------------------------------------------------------- materials
# name: (base colour, roughness, metallic, alpha)
PALETTE = {
    'plastic_white':   ((0.84, 0.85, 0.85), 0.42, 0.0, 1.0),
    'plastic_ivory':   ((0.80, 0.78, 0.72), 0.45, 0.0, 1.0),
    'plastic_grey':    ((0.42, 0.44, 0.46), 0.45, 0.0, 1.0),
    'plastic_light':   ((0.66, 0.68, 0.69), 0.44, 0.0, 1.0),
    'plastic_dark':    ((0.045, 0.05, 0.055), 0.42, 0.0, 1.0),
    'plastic_blue':    ((0.10, 0.27, 0.52), 0.42, 0.0, 1.0),
    'plastic_teal':    ((0.18, 0.47, 0.50), 0.45, 0.0, 1.0),
    'clear_plastic':   ((0.93, 0.96, 0.97), 0.07, 0.0, 0.30),
    'clear_soft':      ((0.92, 0.95, 0.96), 0.16, 0.0, 0.26),      # soft film: bags, tubing stubs
    'clear_fluid':     ((0.82, 0.92, 0.97), 0.04, 0.0, 0.34),
    'clear_glass':     ((0.90, 0.96, 0.94), 0.03, 0.0, 0.24),
    'clear_film':      ((0.95, 0.97, 0.98), 0.20, 0.0, 0.16),      # adhesive dressing film
    'rubber_black':    ((0.018, 0.018, 0.02), 0.62, 0.0, 1.0),
    'rubber_grey':     ((0.30, 0.31, 0.33), 0.66, 0.0, 1.0),
    'rubber_blue':     ((0.12, 0.30, 0.62), 0.55, 0.0, 1.0),
    'steel':           ((0.62, 0.63, 0.65), 0.28, 1.0, 1.0),
    'chrome':          ((0.80, 0.81, 0.83), 0.10, 1.0, 1.0),
    'aluminium':       ((0.78, 0.79, 0.80), 0.34, 1.0, 1.0),
    'label':           ((0.95, 0.95, 0.93), 0.78, 0.0, 1.0),       # blank paper the browser writes on
    'paper':           ((0.93, 0.93, 0.90), 0.80, 0.0, 1.0),
    'card':            ((0.88, 0.89, 0.88), 0.72, 0.0, 1.0),
    'foam_white':      ((0.92, 0.92, 0.90), 0.92, 0.0, 1.0),
    'ink':             ((0.02, 0.02, 0.025), 0.6, 0.0, 1.0),
}
def mat(name, like=None, rgb=None, rough=None, metal=None, alpha=None, image=None, emit=None, two_sided=False):
    """A material by its palette name, or a new one named `name` built like a palette entry with changes."""
    m = bpy.data.materials.get(name)
    if m: return m
    base = PALETTE.get(like or name, ((0.8, 0.8, 0.8), 0.5, 0.0, 1.0))
    rgb = rgb or base[0]; rough = base[1] if rough is None else rough; metal = base[2] if metal is None else metal; alpha = base[3] if alpha is None else alpha
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*rgb, 1); b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    if 'Specular IOR Level' in b.inputs: b.inputs['Specular IOR Level'].default_value = 0.5
    if emit: b.inputs['Emission Color'].default_value = (*emit[:3], 1); b.inputs['Emission Strength'].default_value = emit[3] if len(emit) > 3 else 1.0
    if image:
        t = m.node_tree.nodes.new('ShaderNodeTexImage'); t.image = image; m.node_tree.links.new(t.outputs['Color'], b.inputs['Base Color'])
        if image.get('has_alpha'): m.node_tree.links.new(t.outputs['Alpha'], b.inputs['Alpha']); alpha = 0.5
    if alpha < 1 or (image and image.get('has_alpha')):
        if not (image and image.get('has_alpha')): b.inputs['Alpha'].default_value = alpha
        m.surface_render_method = 'BLENDED'
        assert 'clear' in name, 'a blended material must have "clear" in its name: ' + name
    m.use_backface_culling = not two_sided
    return m
def image(path, has_alpha=False):
    im = bpy.data.images.load(path); im['has_alpha'] = has_alpha; im.pack(); return im

# ---------------------------------------------------------------------------------------------- outlines
def fillet(pts, r=0.0003, n=3, closed=False):
    """Round the corners of a polyline of (a, b) or (a, b, key) points. A point may carry its own radius as {'r': x} in a 4th
    place, or 0 to stay sharp. Returns a new list; keys are carried onto the arc points."""
    out = []; N = len(pts)
    for i, p in enumerate(pts):
        key = p[2] if len(p) > 2 else None; rad = p[3] if len(p) > 3 else r
        if (not closed and (i == 0 or i == N - 1)) or rad <= 0: out.append((p[0], p[1], key)); continue
        A = Vector(pts[(i - 1) % N][:2]); B = Vector(p[:2]); C = Vector(pts[(i + 1) % N][:2]); u = A - B; v = C - B
        lu, lv = u.length, v.length
        if lu < 1e-9 or lv < 1e-9: out.append((p[0], p[1], key)); continue
        u /= lu; v /= lv; cosang = max(-1, min(1, u.dot(v))); ang = math.acos(cosang)
        if ang > math.pi - 0.12 or ang < 0.05: out.append((p[0], p[1], key)); continue          # nearly straight, or a needle point
        t = min(rad / math.tan(ang / 2), 0.45 * lu, 0.45 * lv); rr = t * math.tan(ang / 2); P1 = B + u * t; P2 = B + v * t
        bis = (u + v).normalized(); O = B + bis * (rr / math.sin(ang / 2)); a1 = math.atan2(P1.y - O.y, P1.x - O.x); a2 = math.atan2(P2.y - O.y, P2.x - O.x); d = a2 - a1
        while d > math.pi: d -= TAU
        while d < -math.pi: d += TAU
        steps = max(1, round(n * (math.pi - ang) / (math.pi / 2)))
        for k in range(steps + 1): a = a1 + d * k / steps; out.append((O.x + rr * math.cos(a), O.y + rr * math.sin(a), key))
    return out
def arc(cx, cy, r, a0, a1, n, key=None): return [(cx + r * math.cos(a0 + (a1 - a0) * k / n), cy + r * math.sin(a0 + (a1 - a0) * k / n), key) for k in range(n + 1)]
def superellipse(a, b, n=3.0): return lambda phi, r=1.0: 1.0 / ((abs(math.cos(phi)) / a) ** n + (abs(math.sin(phi)) / b) ** n) ** (1.0 / n)

AXES = {'Z': Matrix.Identity(4), 'Y': Matrix(((1, 0, 0, 0), (0, 0, 1, 0), (0, -1, 0, 0), (0, 0, 0, 1))), 'X': Matrix(((0, 0, 1, 0), (1, 0, 0, 0), (0, 1, 0, 0), (0, 0, 0, 1))),
        '-Y': Matrix(((1, 0, 0, 0), (0, 0, -1, 0), (0, 1, 0, 0), (0, 0, 0, 1))), '-Z': Matrix(((1, 0, 0, 0), (0, -1, 0, 0), (0, 0, -1, 0), (0, 0, 0, 1))), '-X': Matrix(((0, 0, -1, 0), (-1, 0, 0, 0), (0, 1, 0, 0), (0, 0, 0, 1)))}
def T(x=0, y=0, z=0): return Matrix.Translation((x, y, z))
def R(axis, deg): return Matrix.Rotation(math.radians(deg), 4, axis)

# ---------------------------------------------------------------------------------------------- solids (each returns a bmesh built about +Z)
def lathe(profile, segs=32, closed=False, shapes=None, a0=0.0, a1=TAU, cap_ends=False):
    """Revolve (r, z[, key]) points about Z. Walk the outline counter-clockwise in the (r, z) half-plane (up the outside, in
    across the top, down the inside) and the faces look out of the material. A point with r = 0 is a pole. A key names a
    function in `shapes` giving the radius at each angle, for a section that is not round (a finger flange)."""
    bm = bmesh.new(); uvl = bm.loops.layers.uv.new('UVMap'); full = abs((a1 - a0) - TAU) < 1e-6; cols = segs if full else segs + 1
    rings = []; lens = [0.0]
    for i, p in enumerate(profile):
        if i: lens.append(lens[-1] + math.hypot(p[0] - profile[i - 1][0], p[1] - profile[i - 1][1]))
        r, z = p[0], p[1]; f = shapes.get(p[2]) if (shapes and len(p) > 2 and p[2]) else None
        if r < 1e-7 and not f: rings.append([bm.verts.new((0, 0, z))]); continue
        ring = []
        for j in range(cols):
            a = a0 + (a1 - a0) * j / segs; rr = f(a, r) if f else r; ring.append(bm.verts.new((rr * math.cos(a), rr * math.sin(a), z)))
        rings.append(ring)
    total = lens[-1] or 1.0; n = len(profile)
    for i in (range(n) if closed else range(n - 1)):
        A, B = rings[i], rings[(i + 1) % n]; va, vb = lens[i] / total, (lens[i + 1] / total if i + 1 < n else 1.0)
        for j in range(segs):
            j2 = (j + 1) % cols if full else j + 1; u0, u1 = j / segs, (j + 1) / segs
            if len(A) == 1 and len(B) == 1: continue
            if len(A) == 1: f = bm.faces.new((A[0], B[j2], B[j])); uvs = ((u0 + u1) / 2, va), (u1, vb), (u0, vb)
            elif len(B) == 1: f = bm.faces.new((A[j], A[j2], B[0])); uvs = (u0, va), (u1, va), ((u0 + u1) / 2, vb)
            else: f = bm.faces.new((A[j], A[j2], B[j2], B[j])); uvs = (u0, va), (u1, va), (u1, vb), (u0, vb)
            for l, uv in zip(f.loops, uvs): l[uvl].uv = uv
    if not full and cap_ends and closed:
        try: bm.faces.new([rings[i][0] for i in range(n) if len(rings[i]) > 1][::-1]); bm.faces.new([rings[i][-1] for i in range(n) if len(rings[i]) > 1])
        except ValueError: pass
    return bm
def prism(outline, z0, z1, cap=True, hole=None):
    """Extrude a counter-clockwise (x, y) outline from z0 to z1. `hole` is an inner outline (same winding) that is cut through."""
    bm = bmesh.new(); bm.loops.layers.uv.new('UVMap')
    def ring(o, z): return [bm.verts.new((p[0], p[1], z)) for p in o]
    lo, hi = ring(outline, z0), ring(outline, z1); n = len(outline)
    for i in range(n): bm.faces.new((lo[i], lo[(i + 1) % n], hi[(i + 1) % n], hi[i]))
    if hole:
        hl, hh = ring(hole, z0), ring(hole, z1); m = len(hole)
        for i in range(m): bm.faces.new((hl[(i + 1) % m], hl[i], hh[i], hh[(i + 1) % m]))
        if cap:
            for a, b, flip in ((hi, hh, False), (lo, hl, True)):
                geom = bmesh.ops.triangle_fill(bm, use_beauty=True, use_dissolve=False, edges=[e for e in bm.edges if (e.verts[0] in a or e.verts[0] in b) and (e.verts[1] in a or e.verts[1] in b) and abs(e.verts[0].co.z - e.verts[1].co.z) < 1e-9])
                for f in [g for g in geom['geom'] if isinstance(g, bmesh.types.BMFace)]:
                    if (f.normal.z < 0) != flip: f.normal_flip()
    elif cap:
        bm.faces.new(hi); bm.faces.new(lo[::-1])
    bm.normal_update(); return bm
def frames(points, up=None):
    """Parallel-transport frames along a polyline: a list of (point, normal, binormal, tangent)."""
    P = [Vector(p) for p in points]; n = len(P); tang = []
    for i in range(n): t = (P[min(i + 1, n - 1)] - P[max(i - 1, 0)]); tang.append(t.normalized() if t.length > 1e-12 else Vector((0, 0, 1)))
    t0 = tang[0]; ref = Vector(up) if up else (Vector((0, 1, 0)) if abs(t0.y) < 0.9 else Vector((1, 0, 0))); nrm = (ref - t0 * ref.dot(t0)).normalized(); out = []
    for i in range(n):
        if i:
            ax = tang[i - 1].cross(tang[i])
            if ax.length > 1e-9: nrm = Matrix.Rotation(tang[i - 1].angle(tang[i]), 3, ax.normalized()) @ nrm
            nrm = (nrm - tang[i] * nrm.dot(tang[i])).normalized()
        out.append((P[i], nrm, tang[i].cross(nrm), tang[i]))
    return out
def tube(points, radius, segs=12, inner=None, cap=True, up=None, radii=None, section=None):
    """A tube swept along a polyline (any direction, not about Z). `inner` gives it a bore (a real wall, open ends closed by
    annular rims). `radii` varies the radius along it. `section` is a list of (x, y) offsets replacing the circle."""
    bm = bmesh.new(); uvl = bm.loops.layers.uv.new('UVMap'); F = frames(points, up); n = len(F)
    sec = section or [(math.cos(TAU * j / segs), math.sin(TAU * j / segs)) for j in range(segs)]; segs = len(sec)
    def rings(scale_of):
        out = []
        for i, (p, nn, bb, tt) in enumerate(F):
            s = scale_of(i); out.append([bm.verts.new(p + (nn * q[0] + bb * q[1]) * s) for q in sec])
        return out
    outer = rings(lambda i: (radii[i] if radii else radius)); L = [0.0]
    for i in range(1, n): L.append(L[-1] + (F[i][0] - F[i - 1][0]).length)
    tot = L[-1] or 1
    def skin(rs, flip):
        for i in range(n - 1):
            for j in range(segs):
                j2 = (j + 1) % segs; q = (rs[i][j], rs[i][j2], rs[i + 1][j2], rs[i + 1][j]); f = bm.faces.new(q[::-1] if flip else q)
                uv = ((j / segs, L[i] / tot), ((j + 1) / segs, L[i] / tot), ((j + 1) / segs, L[i + 1] / tot), (j / segs, L[i + 1] / tot))
                for l, t in zip(f.loops, uv[::-1] if flip else uv): l[uvl].uv = t
    skin(outer, False)
    if inner:
        k = inner / radius; inn = rings(lambda i: (radii[i] if radii else radius) * k); skin(inn, True)
        for i, flip in ((0, True), (n - 1, False)):
            for j in range(segs):
                j2 = (j + 1) % segs; q = (outer[i][j], outer[i][j2], inn[i][j2], inn[i][j]); bm.faces.new(q if flip else q[::-1])
    elif cap:
        bm.faces.new(outer[0][::-1]); bm.faces.new(outer[-1])
    bm.normal_update(); return bm
def slab(w, d, h, r=0.002, corner_segs=5, bevel=0.0006, bevel_segs=2):
    """A plate w (X) by d (Y) by h (Z, from 0 up) with rounded plan corners and softened top and bottom edges."""
    out = rrect(w, d, r, corner_segs); n = len(out); bm = bmesh.new(); bm.loops.layers.uv.new('UVMap')
    prof = fillet([(0, 0), (1, 0), (1, h), (0, h)], bevel, bevel_segs)[1:-1]                      # (inset factor 0..1 mapped below, z)
    cx = [(p[0], p[1]) for p in prof]; rings = []
    for (k, z, *_) in cx:
        ins = (1 - k) * 1.0; rings.append([bm.verts.new((p[0] - math.copysign(min(abs(p[0]), bevel * ins), p[0]), p[1] - math.copysign(min(abs(p[1]), bevel * ins), p[1]), z)) for p in out])
    for i in range(len(rings) - 1):
        for j in range(n): bm.faces.new((rings[i][j], rings[i][(j + 1) % n], rings[i + 1][(j + 1) % n], rings[i + 1][j]))
    bm.faces.new(rings[-1]); bm.faces.new(rings[0][::-1]); bm.normal_update(); return bm
def rrect(w, d, r, n=5):
    """Counter-clockwise outline of a rounded rectangle centred on the origin."""
    r = min(r, w / 2 - 1e-6, d / 2 - 1e-6); out = []
    for cx, cy, a in ((w / 2 - r, d / 2 - r, 0), (-w / 2 + r, d / 2 - r, 90), (-w / 2 + r, -d / 2 + r, 180), (w / 2 - r, -d / 2 + r, 270)):
        for k in range(n + 1): t = math.radians(a + 90 * k / n); out.append((cx + r * math.cos(t), cy + r * math.sin(t)))
    return out
def patch(radius, z0, z1, a0, a1, segs=16, rows=1, swap_uv=False, flip=False):
    """Part of a cylinder wall about Z from angle a0 to a1 (radians) and z0 to z1, with a 0..1 UV: u runs round, v runs up
    (or the other way about with swap_uv). Used for labels and printed scales that sit a hair proud of a barrel."""
    bm = bmesh.new(); uvl = bm.loops.layers.uv.new('UVMap'); grid = []
    for i in range(rows + 1):
        z = z0 + (z1 - z0) * i / rows; grid.append([bm.verts.new((radius * math.cos(a0 + (a1 - a0) * j / segs), radius * math.sin(a0 + (a1 - a0) * j / segs), z)) for j in range(segs + 1)])
    for i in range(rows):
        for j in range(segs):
            q = (grid[i][j], grid[i][j + 1], grid[i + 1][j + 1], grid[i + 1][j]); uv = ((j / segs, i / rows), ((j + 1) / segs, i / rows), ((j + 1) / segs, (i + 1) / rows), (j / segs, (i + 1) / rows))
            if swap_uv: uv = tuple((v, u) for u, v in uv)
            if flip: q = q[::-1]; uv = uv[::-1]
            f = bm.faces.new(q)
            for l, t in zip(f.loops, uv): l[uvl].uv = t
    bm.normal_update(); return bm
def quad(w, h, z=0.0):
    """A flat w (X) by h (Y) rectangle facing +Z with a 0..1 UV."""
    bm = bmesh.new(); uvl = bm.loops.layers.uv.new('UVMap'); v = [bm.verts.new(p) for p in ((-w / 2, -h / 2, z), (w / 2, -h / 2, z), (w / 2, h / 2, z), (-w / 2, h / 2, z))]; f = bm.faces.new(v)
    for l, t in zip(f.loops, ((0, 0), (1, 0), (1, 1), (0, 1))): l[uvl].uv = t
    bm.normal_update(); return bm
def join_bm(*bms):
    """Several bmeshes as one (the inputs are freed)."""
    out = bmesh.new(); tmp = bpy.data.meshes.new('_tmp')
    for b in bms:
        if b is None: continue
        b.to_mesh(tmp); b.free(); out.from_mesh(tmp)
    bpy.data.meshes.remove(tmp); return out
def xform(bm, M):
    bmesh.ops.transform(bm, matrix=M, verts=bm.verts)
    if M.determinant() < 0: bmesh.ops.reverse_faces(bm, faces=bm.faces)
    return bm
def volume(bm): return bm.calc_volume(signed=True)
def text_mesh(body, height, depth=0.0, font=None, align='CENTER'):
    """Flat lettering as a mesh in the XY plane facing +Z, capital height `height` (Blender's built-in font, a DejaVu Sans derivative)."""
    cu = bpy.data.curves.new('_txt', 'FONT'); cu.body = body; cu.align_x = align; cu.align_y = 'CENTER'; cu.size = 1.0; cu.extrude = 0.0; cu.resolution_u = 2
    if font: cu.font = font
    o = bpy.data.objects.new('_txt', cu); bpy.context.scene.collection.objects.link(o); dg = bpy.context.evaluated_depsgraph_get(); me = bpy.data.meshes.new_from_object(o.evaluated_get(dg), depsgraph=dg)
    bpy.data.objects.remove(o); bpy.data.curves.remove(cu); bm = bmesh.new(); bm.from_mesh(me); bpy.data.meshes.remove(me)
    ys = [v.co.y for v in bm.verts] or [0, 1]; s = height / max(1e-9, (max(ys) - min(ys))); cy = (max(ys) + min(ys)) / 2
    for v in bm.verts: v.co = Vector((v.co.x * s, (v.co.y - cy) * s, 0))
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=height * 1e-4)
    if depth > 0:
        ext = bmesh.ops.extrude_face_region(bm, geom=bm.faces[:]); bmesh.ops.translate(bm, vec=(0, 0, depth), verts=[g for g in ext['geom'] if isinstance(g, bmesh.types.BMVert)])
    for f in bm.faces:
        if depth <= 0 and f.normal.z < 0: f.normal_flip()
    if not bm.loops.layers.uv: bm.loops.layers.uv.new('UVMap')
    bm.normal_update(); return bm

# ---------------------------------------------------------------------------------------------- an asset
class Item:
    def __init__(self, key, item, source=None, built_here=True):
        reset(); self.key = key; self.root = bpy.data.objects.new(key, None); bpy.context.scene.collection.objects.link(self.root)
        self.anchors = {}; self.meta = {'item': item, 'file': key + '.glb', 'builtHere': built_here, 'source': source or {'title': item, 'author': 'built for this project (tools/props/bedside)', 'licence': 'project work, no third-party geometry', 'url': None, 'via': None}}
        self.parts = []
    def add(self, name, bm, material, parent=None, M=None, smooth=38, weighted=True, origin=None, two_sided=None):
        """A named mesh node. M places the +Z-built geometry in the item's frame. `origin` moves the node's own origin there
        (a pivot for something that turns or slides) while leaving the geometry where it is."""
        if M is not None: xform(bm, M)
        if origin is not None: bmesh.ops.translate(bm, vec=-Vector(origin), verts=bm.verts)
        me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); o = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(o)
        o.parent = parent or self.root
        if origin is not None:
            o.location = Vector(origin) - (self._world(parent) if parent else Vector((0, 0, 0)))
        mats = material if isinstance(material, (list, tuple)) else [material]
        for m in mats: me.materials.append(mat(m) if isinstance(m, str) else m)
        shade(o, smooth, weighted); self.parts.append(o); return o
    def _world(self, o):
        v = Vector((0, 0, 0))
        while o is not None and o is not self.root: v += o.location; o = o.parent
        return v
    def node(self, name, at=(0, 0, 0), parent=None, record=False):
        """An empty: a pivot that parts hang from, or (record=True) an anchor that is also written to the manifest."""
        e = bpy.data.objects.new(name, None); bpy.context.scene.collection.objects.link(e); e.parent = parent or self.root
        e.location = Vector(at) - (self._world(parent) if parent else Vector((0, 0, 0))); e.empty_display_size = 0.004
        if record: self.anchors[name] = [round(v, 5) for v in at]
        return e
    def anchor(self, name, at, parent=None): return self.node(name, at, parent, record=True)
    def box(self):
        lo = Vector((1e9,) * 3); hi = Vector((-1e9,) * 3); bpy.context.view_layer.update()
        for o in self.parts:
            for v in o.data.vertices:
                w = o.matrix_world @ v.co
                for i in range(3): lo[i] = min(lo[i], w[i]); hi[i] = max(hi[i], w[i])
        return lo, hi
    def export(self, out_dir, **meta):
        os.makedirs(out_dir, exist_ok=True); lo, hi = self.box(); self.meta.update(meta)
        self.meta['size'] = [round(hi[i] - lo[i], 5) for i in range(3)]; self.meta['box'] = [[round(v, 5) for v in lo], [round(v, 5) for v in hi]]; self.meta['anchors'] = self.anchors
        names = []
        def walk(o, d):
            names.append(o.name)
            for c in sorted(o.children, key=lambda c: c.name): walk(c, d + 1)
        walk(self.root, 0); self.meta['nodes'] = names
        self.meta['materials'] = sorted({m.name for o in self.parts for m in o.data.materials if m})
        self.meta['morphs'] = sorted({k.name for o in self.parts if o.data.shape_keys for k in o.data.shape_keys.key_blocks[1:]})
        self.meta['rawTriangles'] = sum(len(p.vertices) - 2 for o in self.parts for p in o.data.polygons)
        bad = [n for n in names if not all(c.isalnum() or c == '_' for c in n)]
        assert not bad, 'node names must be letters, digits and underscores (three.js rewrites anything else): %s' % bad
        bpy.ops.object.select_all(action='DESELECT')
        def sel(o):
            o.select_set(True)
            for c in o.children: sel(c)
        sel(self.root); bpy.context.view_layer.objects.active = self.root; path = os.path.join(out_dir, self.key + '.raw.glb')
        bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', use_selection=True, export_yup=False, export_apply=False, export_cameras=False, export_lights=False, export_animations=False, export_skins=False,
                                  export_morph=True, export_morph_normal=True, export_tangents=False, export_extras=False, export_image_format='AUTO')
        json.dump(self.meta, open(os.path.join(out_dir, self.key + '.meta.json'), 'w'), indent=1, ensure_ascii=False)
        print('BUILT %-24s %6d triangles  size %s' % (self.key, self.meta['rawTriangles'], [round(v * 1000, 1) for v in self.meta['size']])); return path

def shade(o, deg=38, weighted=True):
    """Smooth shading that keeps real corners: an edge sharper than `deg` stays an edge; then face-weighted normals so
    flat faces stay flat beside a rounded edge."""
    me = o.data
    if not len(me.polygons): return
    bm = bmesh.new(); bm.from_mesh(me); lim = math.radians(deg)
    for f in bm.faces: f.smooth = True
    for e in bm.edges: e.smooth = (len(e.link_faces) != 2) or e.calc_face_angle(0.0) < lim
    bm.to_mesh(me); bm.free()
    if weighted and not me.shape_keys:
        m = o.modifiers.new('wn', 'WEIGHTED_NORMAL'); m.keep_sharp = True; m.weight = 60; m.mode = 'FACE_AREA_WITH_ANGLE'
        dg = bpy.context.evaluated_depsgraph_get(); nm = bpy.data.meshes.new_from_object(o.evaluated_get(dg), preserve_all_data_layers=True, depsgraph=dg); o.modifiers.clear(); old = o.data; o.data = nm; nm.name = old.name; bpy.data.meshes.remove(old)
def bevel_bm(bm, width, segs=2, deg=30):
    """Bevel every edge of a bmesh sharper than `deg`."""
    lim = math.radians(deg); bm.normal_update(); edges = [e for e in bm.edges if len(e.link_faces) == 2 and e.calc_face_angle(0.0) > lim]
    if edges: bmesh.ops.bevel(bm, geom=edges, offset=width, offset_type='OFFSET', segments=segs, profile=0.5, affect='EDGES', clamp_overlap=True)
    bm.normal_update(); return bm
def args(): return sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
