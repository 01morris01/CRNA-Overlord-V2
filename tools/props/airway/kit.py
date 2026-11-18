"""kit.py: the modeling library the airway and machine props are built with (Blender 5.1, run headless).

Everything is authored directly in the frame the browser uses: meters, +Y up, and exported with Blender's axis conversion
switched off (export_yup=False), so a number written in a build script is the number three.js reads.

What it gives the build scripts:
  fillet(pts, r)            round the corners of a 2D outline so every edge catches a highlight
  lathe(profile, ...)       a surface of revolution about +Y with a 0..1 UV (u around, v along the outline)
  sweep(path, section)      a tube or any closed section swept along a 3D path, with parallel-transport frames
  grid(fn, nu, nv)          a parametric surface from a function (u, v) -> point
  Item                      one asset: root node, named part nodes, empties, materials, and the export

Materials are metal-roughness ones with the glTF extensions three.js r170 reads: clear plastic is
KHR_materials_transmission + KHR_materials_ior (thin-walled: no volume), rubber gets a little sheen, and printed marks are
separate alpha-masked shells so that the plastic under them stays clear."""
import bpy, bmesh, math, os, json
from mathutils import Vector, Matrix, Quaternion

MM = 0.001
TAU = math.tau


# ---------------------------------------------------------------------------------------------- scene
def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    for coll in (bpy.data.meshes, bpy.data.materials, bpy.data.images, bpy.data.curves, bpy.data.objects):
        for x in list(coll): coll.remove(x)


# ---------------------------------------------------------------------------------------------- materials
def _bsdf(m): return m.node_tree.nodes['Principled BSDF']


def image(path, colorspace='sRGB', name=None):
    im = bpy.data.images.load(path, check_existing=True)
    if name: im.name = name
    im.colorspace_settings.name = colorspace
    im.pack()
    return im


def material(name, rgb=(0.8, 0.8, 0.8), rough=0.5, metal=0.0, *, transmission=0.0, ior=1.5, alpha=1.0, alpha_mode=None,
             clearcoat=0.0, clearcoat_rough=0.05, sheen=0.0, sheen_rough=0.5, sheen_tint=(1, 1, 1), specular=0.5,
             emission=None, emission_strength=0.0, base_tex=None, normal_tex=None, normal_strength=1.0, rough_tex=None,
             double_sided=False):
    """A Principled material that exports to the glTF extension set three.js r170 reads.
    base_tex: image whose alpha (if alpha_mode == 'MASK' or 'BLEND') drives Alpha.  rough_tex: image whose G channel is
    roughness (glTF metallicRoughness layout: R unused, G roughness, B metallic)."""
    m = bpy.data.materials.get(name)
    if m: return m
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; b = _bsdf(m)
    b.inputs['Base Color'].default_value = (*rgb, 1); b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    b.inputs['IOR'].default_value = ior
    b.inputs['Specular IOR Level'].default_value = specular
    if transmission: b.inputs['Transmission Weight'].default_value = transmission
    if clearcoat: b.inputs['Coat Weight'].default_value = clearcoat; b.inputs['Coat Roughness'].default_value = clearcoat_rough
    if sheen: b.inputs['Sheen Weight'].default_value = sheen; b.inputs['Sheen Roughness'].default_value = sheen_rough; b.inputs['Sheen Tint'].default_value = (*sheen_tint, 1)
    if emission:
        b.inputs['Emission Color'].default_value = (*emission, 1); b.inputs['Emission Strength'].default_value = emission_strength
    if base_tex:
        t = nt.nodes.new('ShaderNodeTexImage'); t.image = base_tex; t.location = (-500, 300); nt.links.new(t.outputs['Color'], b.inputs['Base Color'])
        if alpha_mode in ('MASK', 'BLEND'): nt.links.new(t.outputs['Alpha'], b.inputs['Alpha'])
    elif alpha < 1: b.inputs['Alpha'].default_value = alpha
    if rough_tex:
        t = nt.nodes.new('ShaderNodeTexImage'); t.image = rough_tex; t.location = (-700, 0); sep = nt.nodes.new('ShaderNodeSeparateColor'); sep.location = (-400, 0)
        nt.links.new(t.outputs['Color'], sep.inputs['Color']); nt.links.new(sep.outputs['Green'], b.inputs['Roughness'])
    if normal_tex:
        t = nt.nodes.new('ShaderNodeTexImage'); t.image = normal_tex; t.location = (-700, -300); nm = nt.nodes.new('ShaderNodeNormalMap'); nm.location = (-400, -300)
        nm.inputs['Strength'].default_value = normal_strength; nt.links.new(t.outputs['Color'], nm.inputs['Color']); nt.links.new(nm.outputs['Normal'], b.inputs['Normal'])
    if alpha_mode == 'MASK':
        m.surface_render_method = 'DITHERED'
        m['gltf_alpha_mode'] = 'MASK'
    elif alpha_mode == 'BLEND' or (alpha < 1 and not base_tex):
        assert 'clear' in name or name.startswith('ink'), 'an alpha-blended material must have "clear" (or start with "ink") in its name: ' + name
        m.surface_render_method = 'BLENDED'
    m.use_backface_culling = not double_sided
    return m


def set_alpha_mask_cutoff(m, cutoff=0.5):
    """The exporter writes MASK when the alpha socket is fed through a Math 'Round' node (glTF-Blender-IO convention)."""
    nt = m.node_tree; b = _bsdf(m)
    if not b.inputs['Alpha'].links: return
    src = b.inputs['Alpha'].links[0].from_socket; nt.links.remove(b.inputs['Alpha'].links[0])
    r = nt.nodes.new('ShaderNodeMath'); r.operation = 'ROUND'; r.location = (-200, 200)
    if cutoff != 0.5:
        s = nt.nodes.new('ShaderNodeMath'); s.operation = 'ADD'; s.inputs[1].default_value = 0.5 - cutoff; nt.links.new(src, s.inputs[0]); src = s.outputs[0]
    nt.links.new(src, r.inputs[0]); nt.links.new(r.outputs[0], b.inputs['Alpha'])


# A shared palette. Clear plastics are transmissive; rubber has a soft sheen; nothing is pure black or pure white.
def M(name):
    P = {
        'clear_pc':        dict(rgb=(0.97, 0.985, 0.99), rough=0.04, transmission=1.0, ior=1.58, specular=0.5),       # polycarbonate / acrylic: housings, barrels
        'clear_pc_tint':   dict(rgb=(0.90, 0.95, 0.97), rough=0.06, transmission=1.0, ior=1.58),                      # slightly blue-grey clear
        'clear_pvc':       dict(rgb=(0.95, 0.975, 0.98), rough=0.12, transmission=1.0, ior=1.53),                      # soft PVC: cushions, cannula, tubing
        'clear_pvc_frost': dict(rgb=(0.93, 0.95, 0.96), rough=0.32, transmission=0.92, ior=1.53),                      # frosted soft PVC
        'clear_film':      dict(rgb=(0.97, 0.975, 0.97), rough=0.18, transmission=1.0, ior=1.45),                       # dressing film
        'plastic_white':   dict(rgb=(0.80, 0.81, 0.80), rough=0.38),
        'plastic_ivory':   dict(rgb=(0.78, 0.76, 0.70), rough=0.42),
        'plastic_grey':    dict(rgb=(0.36, 0.38, 0.40), rough=0.42),
        'plastic_lgrey':   dict(rgb=(0.62, 0.64, 0.65), rough=0.40),
        'plastic_dark':    dict(rgb=(0.035, 0.038, 0.042), rough=0.40),
        'plastic_blue':    dict(rgb=(0.06, 0.22, 0.55), rough=0.38),
        'plastic_green':   dict(rgb=(0.05, 0.38, 0.16), rough=0.38),
        'plastic_pink':    dict(rgb=(0.85, 0.40, 0.55), rough=0.40),
        'plastic_yellow':  dict(rgb=(0.85, 0.66, 0.06), rough=0.40),
        'rubber_black':    dict(rgb=(0.022, 0.022, 0.024), rough=0.62, sheen=0.35, sheen_rough=0.45, sheen_tint=(0.6, 0.6, 0.62)),
        'rubber_grey':     dict(rgb=(0.20, 0.205, 0.21), rough=0.58, sheen=0.3, sheen_rough=0.5, sheen_tint=(0.7, 0.7, 0.7)),
        'rubber_stopper':  dict(rgb=(0.05, 0.05, 0.055), rough=0.45, sheen=0.25, sheen_rough=0.4, sheen_tint=(0.6, 0.6, 0.6)),
        'silicone_blue':   dict(rgb=(0.10, 0.30, 0.62), rough=0.45, sheen=0.25, sheen_rough=0.5, sheen_tint=(0.7, 0.8, 1.0)),
        'steel_satin':     dict(rgb=(0.66, 0.67, 0.68), rough=0.26, metal=1.0),
        'steel_bright':    dict(rgb=(0.80, 0.81, 0.82), rough=0.10, metal=1.0),
        'chrome':          dict(rgb=(0.86, 0.87, 0.88), rough=0.05, metal=1.0),
        'brass':           dict(rgb=(0.82, 0.66, 0.36), rough=0.25, metal=1.0),
        'label_paper':     dict(rgb=(0.93, 0.93, 0.91), rough=0.80),
        'foam':            dict(rgb=(0.88, 0.88, 0.86), rough=0.92),
        'elastic_white':   dict(rgb=(0.82, 0.82, 0.80), rough=0.85, sheen=0.5, sheen_rough=0.6),
        'paper_filter':    dict(rgb=(0.92, 0.92, 0.89), rough=0.95),
    }
    if name in P: return material(name, **P[name])
    raise KeyError(name)


def ink(name, tex, rgb=(0.02, 0.02, 0.025), rough=0.5, mask=False):
    """Printed marks: a decal material whose alpha comes from tex. Blended by default: fine lines survive mipmapping, which an
    alpha cut-off does not (thin ticks vanished in three.js with MASK)."""
    m = material(name, rgb=rgb, rough=rough, base_tex=tex, alpha_mode='MASK' if mask else 'BLEND', double_sided=False)
    if mask: set_alpha_mask_cutoff(m, 0.5)
    return m


# ---------------------------------------------------------------------------------------------- outlines
def fillet(pts, r=0.3 * MM, n=4, closed=False):
    """Round the corners of a polyline of (a, b) points. A point may be (a, b, r) to give its own radius (0 keeps it sharp)."""
    out = []; N = len(pts)
    for i, p in enumerate(pts):
        a, b = p[0], p[1]; rr = p[2] if len(p) > 2 else r
        if (not closed and (i == 0 or i == N - 1)) or rr <= 0:
            out.append((a, b)); continue
        P0 = Vector((pts[i - 1][0], pts[i - 1][1])); P1 = Vector((a, b)); P2 = Vector((pts[(i + 1) % N][0], pts[(i + 1) % N][1]))
        d1 = (P0 - P1); d2 = (P2 - P1); l1, l2 = d1.length, d2.length
        if l1 < 1e-9 or l2 < 1e-9: out.append((a, b)); continue
        d1 /= l1; d2 /= l2; cosang = max(-1.0, min(1.0, d1.dot(d2))); ang = math.acos(cosang)
        if ang > math.pi - 1e-3: out.append((a, b)); continue
        t = rr / math.tan(ang / 2); t = min(t, l1 * 0.45, l2 * 0.45); rr = t * math.tan(ang / 2)
        A = P1 + d1 * t; B = P1 + d2 * t; bis = (d1 + d2).normalized(); C = P1 + bis * (rr / math.sin(ang / 2))
        a0 = math.atan2(A.y - C.y, A.x - C.x); a1 = math.atan2(B.y - C.y, B.x - C.x); da = a1 - a0
        while da > math.pi: da -= TAU
        while da < -math.pi: da += TAU
        for k in range(n + 1):
            th = a0 + da * k / n; out.append((C.x + rr * math.cos(th), C.y + rr * math.sin(th)))
    return out


def arc_len(pts):
    s = [0.0]
    for i in range(1, len(pts)): s.append(s[-1] + math.dist(pts[i - 1][:2], pts[i][:2]))
    return s


# ---------------------------------------------------------------------------------------------- mesh builders
def _obj(name, me):
    o = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(o); return o


def finish_mesh(me, sharp_deg=40.0, smooth=True):
    """Shade smooth with sharp edges where faces meet at more than sharp_deg (Blender 4.1+ sharp_edge attribute)."""
    for p in me.polygons: p.use_smooth = smooth
    if smooth and sharp_deg is not None:
        bm = bmesh.new(); bm.from_mesh(me); lim = math.radians(sharp_deg)
        for e in bm.edges:
            if len(e.link_faces) == 2 and e.calc_face_angle(0.0) > lim: e.smooth = False
            elif len(e.link_faces) != 2: e.smooth = False
        bm.to_mesh(me); bm.free()
    me.update()
    return me


def lathe(name, profile, seg=48, mat=None, cap0=False, cap1=False, sharp_deg=40.0, a0=0.0, a1=TAU, uv_scale=None, flip=False, axis_xform=None, outward=True):
    """Revolve profile [(r, y), ...] about +Y. UV: u = angle / span, v = arc length (normalized, or in meters * uv_scale).
    Full turns are closed (seam duplicated for UVs). Caps close the ends with a fan when r > 0."""
    full = abs((a1 - a0) - TAU) < 1e-6
    bm = bmesh.new(); uv = bm.loops.layers.uv.new('UVMap')
    s = arc_len(profile); L = s[-1] or 1.0
    vs = []
    nring = seg + 1
    for i, (r, y) in enumerate(profile):
        ring = []
        for j in range(nring):
            th = a0 + (a1 - a0) * j / seg
            ring.append(bm.verts.new((r * math.sin(th), y, r * math.cos(th))))
        vs.append(ring)
    def V(i): return (s[i] * uv_scale) if uv_scale else s[i] / L
    for i in range(len(profile) - 1):
        for j in range(seg):
            q = [vs[i][j], vs[i][j + 1], vs[i + 1][j + 1], vs[i + 1][j]]
            if flip: q = q[::-1]
            try: f = bm.faces.new(q)
            except ValueError: continue
            uvs = [(j / seg, V(i)), ((j + 1) / seg, V(i)), ((j + 1) / seg, V(i + 1)), (j / seg, V(i + 1))]
            if flip: uvs = uvs[::-1]
            for l, t in zip(f.loops, uvs): l[uv].uv = t
    def cap(i, up):
        r, y = profile[i]
        if r <= 1e-7: return
        c = bm.verts.new((0, y, 0)); ring = vs[i]
        for j in range(seg):
            tri = [c, ring[j], ring[j + 1]] if up else [c, ring[j + 1], ring[j]]
            if flip: tri = tri[::-1]
            try: f = bm.faces.new(tri)
            except ValueError: continue
            for l in f.loops:
                p = l.vert.co; l[uv].uv = (0.5 + 0.5 * p.x / max(r, 1e-9), 0.5 + 0.5 * p.z / max(r, 1e-9))
    if cap0: cap(0, False)
    if cap1: cap(len(profile) - 1, True)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-7) if full else None
    if not flip and outward:                       # three.js culls back faces: make every solid face outward whatever way the profile runs
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    finish_mesh(me, sharp_deg)
    o = _obj(name, me)
    if mat: me.materials.append(mat)
    if axis_xform: me.transform(axis_xform)
    return o


def frames(path, up=None):
    """Parallel-transport frames (tangent, normal, binormal) along a list of Vectors."""
    n = len(path); T = []
    for i in range(n):
        a = path[max(0, i - 1)]; b = path[min(n - 1, i + 1)]; T.append((b - a).normalized())
    ref = Vector(up) if up else (Vector((0, 1, 0)) if abs(T[0].y) < 0.9 else Vector((1, 0, 0)))
    N = [(ref - T[0] * ref.dot(T[0])).normalized()]
    for i in range(1, n):
        v = N[-1] - T[i] * N[-1].dot(T[i])
        N.append(v.normalized() if v.length > 1e-9 else N[-1])
    B = [T[i].cross(N[i]) for i in range(n)]
    return T, N, B


def sweep(name, path, radius=None, section=None, seg=16, mat=None, cap0=False, cap1=False, closed=False, up=None, uv_scale=None, sharp_deg=None, radii=None, twist=0.0):
    """Sweep a closed section along path (list of 3-tuples). section: list of (x, y) in the frame's (N, B) plane, or a circle
    of `radius` with `seg` sides. radii: optional per-point scale. UV: u around (0..1), v = distance along * uv_scale (or 0..1)."""
    path = [Vector(p) for p in path]
    if closed: path = path + [path[0]]
    T, N, B = frames(path, up)
    if section is None:
        section = [(radius * math.cos(TAU * k / seg), radius * math.sin(TAU * k / seg)) for k in range(seg)]
    ns = len(section)
    s = arc_len([tuple(p) for p in path]); L = s[-1] or 1.0
    bm = bmesh.new(); uvl = bm.loops.layers.uv.new('UVMap'); rings = []
    for i, p in enumerate(path):
        sc = radii[i] if radii else 1.0; tw = twist * s[i] / L
        c, sn = math.cos(tw), math.sin(tw)
        ring = []
        for k in range(ns + 1):
            x, y = section[k % ns]; x, y = x * c - y * sn, x * sn + y * c
            ring.append(bm.verts.new(p + N[i] * (x * sc) + B[i] * (y * sc)))
        rings.append(ring)
    for i in range(len(path) - 1):
        for k in range(ns):
            f = bm.faces.new([rings[i][k], rings[i + 1][k], rings[i + 1][k + 1], rings[i][k + 1]])
            v0 = s[i] * uv_scale if uv_scale else s[i] / L; v1 = s[i + 1] * uv_scale if uv_scale else s[i + 1] / L
            for l, t in zip(f.loops, [(k / ns, v0), (k / ns, v1), ((k + 1) / ns, v1), ((k + 1) / ns, v0)]): l[uvl].uv = t
    def cap(i, end):
        c = bm.verts.new(path[i]); ring = rings[i]
        for k in range(ns):
            tri = [c, ring[k + 1], ring[k]] if not end else [c, ring[k], ring[k + 1]]
            f = bm.faces.new(tri)
            for l in f.loops: l[uvl].uv = (0.5, 0.5)
    if cap0: cap(0, False)
    if cap1: cap(len(path) - 1, True)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-8)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); finish_mesh(me, sharp_deg)
    if mat: me.materials.append(mat)
    return _obj(name, me)


def grid(name, fn, nu, nv, mat=None, wrap_u=False, wrap_v=False, sharp_deg=None, uv=None, flip=False):
    """A parametric surface: fn(u, v) -> (x, y, z), u in [0, 1] over nu steps, v in [0, 1] over nv steps.
    uv: optional fn(u, v) -> (s, t); default (u, v). Seams are duplicated so UVs stay continuous."""
    bm = bmesh.new(); uvl = bm.loops.layers.uv.new('UVMap'); V = []
    for i in range(nu + 1):
        row = []
        for j in range(nv + 1):
            row.append(bm.verts.new(fn(i / nu, j / nv)))
        V.append(row)
    for i in range(nu):
        for j in range(nv):
            q = [V[i][j], V[i + 1][j], V[i + 1][j + 1], V[i][j + 1]]; t = [(i / nu, j / nv), ((i + 1) / nu, j / nv), ((i + 1) / nu, (j + 1) / nv), (i / nu, (j + 1) / nv)]
            if flip: q = q[::-1]; t = t[::-1]
            try: f = bm.faces.new(q)
            except ValueError: continue
            for l, (a, b) in zip(f.loops, t): l[uvl].uv = uv(a, b) if uv else (a, b)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-8)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); finish_mesh(me, sharp_deg)
    if mat: me.materials.append(mat)
    return _obj(name, me)


def box(name, size, center=(0, 0, 0), bevel=0.5 * MM, seg=3, mat=None):
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts: v.co = Vector((v.co.x * size[0], v.co.y * size[1], v.co.z * size[2])) + Vector(center)
    if bevel > 0: bmesh.ops.bevel(bm, geom=list(bm.edges), offset=bevel, segments=seg, profile=0.5, affect='EDGES', clamp_overlap=True)
    uv = bm.loops.layers.uv.new('UVMap')
    for f in bm.faces:
        n = f.normal; ax = max(range(3), key=lambda k: abs(n[k])); a, b = [k for k in range(3) if k != ax]
        for l in f.loops: l[uv].uv = (l.vert.co[a] / max(size), l.vert.co[b] / max(size))
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); finish_mesh(me, 35)
    if mat: me.materials.append(mat)
    return _obj(name, me)


def join(name, objs):
    """Join objects into one (materials kept as slots)."""
    objs = [o for o in objs if o]
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs: o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]; bpy.ops.object.join(); o = objs[0]; o.name = name; o.data.name = name
    return o


def xform(o, M):
    """Bake a matrix into an object's mesh."""
    o.data.transform(M)
    if M.determinant() < 0: o.data.flip_normals()
    o.data.update(); return o


def apply_mods(o):
    dg = bpy.context.evaluated_depsgraph_get(); me = bpy.data.meshes.new_from_object(o.evaluated_get(dg), preserve_all_data_layers=True, depsgraph=dg)
    o.modifiers.clear(); old = o.data; o.data = me; me.name = old.name
    return o


def subdivide(o, levels=1):
    m = o.modifiers.new('sub', 'SUBSURF'); m.levels = levels; m.render_levels = levels; m.uv_smooth = 'PRESERVE_BOUNDARIES'
    return apply_mods(o)


def solidify(o, t, offset=-1.0):
    m = o.modifiers.new('sol', 'SOLIDIFY'); m.thickness = t; m.offset = offset; m.use_even_offset = True; m.use_quality_normals = True
    return apply_mods(o)


def tris(o):
    return sum(len(p.vertices) - 2 for p in o.data.polygons)


def bounds(objs, world=True):
    lo = Vector((1e9,) * 3); hi = Vector((-1e9,) * 3)
    for o in objs:
        if o.type != 'MESH': continue
        mw = o.matrix_world if world else Matrix.Identity(4)
        for v in o.data.vertices:
            p = mw @ v.co
            for k in range(3): lo[k] = min(lo[k], p[k]); hi[k] = max(hi[k], p[k])
    return lo, hi


def look_matrix(origin, z_axis, y_hint=(0, 1, 0)):
    """A matrix whose +Z is z_axis and whose +Y is as close to y_hint as possible."""
    z = Vector(z_axis).normalized(); y = Vector(y_hint); y = (y - z * y.dot(z))
    if y.length < 1e-6: y = Vector((1, 0, 0)) - z * z.x
    y.normalize(); x = y.cross(z)
    m = Matrix((x, y, z)).transposed().to_4x4(); m.translation = Vector(origin); return m


# ---------------------------------------------------------------------------------------------- an asset
class Item:
    """One exported asset. root: an empty named after the asset (or as given). Parts are parented to the root (or to another
    part) with their own pivots; anchors are empties."""
    def __init__(self, root_name):
        self.root = bpy.data.objects.new(root_name, None); bpy.context.scene.collection.objects.link(self.root); self.parts = {}

    def part(self, name, objs, parent=None, pivot=None, pivot_matrix=None):
        """Join objs into one mesh node named `name`, whose origin (pivot) is at `pivot` (in the parent's frame), or whose local
        frame is pivot_matrix (mesh data is moved so it stays where it is)."""
        objs = [o for o in (objs if isinstance(objs, (list, tuple)) else [objs]) if o]
        o = join(name, objs) if len(objs) > 1 else objs[0]
        o.name = name; o.data.name = name
        P = pivot_matrix if pivot_matrix is not None else Matrix.Translation(Vector(pivot or (0, 0, 0)))
        o.data.transform(P.inverted()); o.matrix_world = Matrix.Identity(4)
        par = self.parts.get(parent) if isinstance(parent, str) else (parent or self.root)
        o.parent = par
        o.matrix_parent_inverse = Matrix.Identity(4)
        o.matrix_basis = (self.world(par).inverted() @ P) if par is not self.root else P
        self.parts[name] = o
        return o

    def world(self, o):
        M = o.matrix_basis.copy(); p = o.parent
        while p is not None:
            M = p.matrix_basis @ M; p = p.parent
        return M

    def empty(self, name, matrix=None, at=None, z=None, y=(0, 1, 0), parent=None, size=0.01):
        """An anchor. Either matrix (in root frame) or at + z axis (+ y hint)."""
        e = bpy.data.objects.new(name, None); e.empty_display_type = 'ARROWS'; e.empty_display_size = size
        bpy.context.scene.collection.objects.link(e)
        Mw = matrix if matrix is not None else look_matrix(at or (0, 0, 0), z or (0, 0, 1), y)
        par = self.parts.get(parent) if isinstance(parent, str) else (parent or self.root)
        e.parent = par; e.matrix_parent_inverse = Matrix.Identity(4)
        e.matrix_basis = (self.world(par).inverted() @ Mw) if par is not self.root else Mw
        self.parts[name] = e
        return e

    def export(self, path, extras=None):
        if extras:
            for k, v in extras.items(): self.root[k] = v
        bpy.ops.object.select_all(action='DESELECT')
        keep = set()
        def walk(o):
            keep.add(o)
            for c in o.children: walk(c)
        walk(self.root)
        for o in keep: o.select_set(True)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', use_selection=True, export_yup=False, export_apply=True,
                                  export_extras=True, export_morph=True, export_morph_normal=True, export_morph_tangent=False,
                                  export_texcoords=True, export_normals=True, export_tangents=False, export_materials='EXPORT',
                                  export_cameras=False, export_lights=False, export_animations=False, export_skins=True,
                                  export_image_format='AUTO', export_try_sparse_sk=False)
        return path


def stats(objs):
    return sum(tris(o) for o in objs if o.type == 'MESH')
