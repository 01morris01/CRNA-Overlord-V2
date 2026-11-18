"""hero_lib.py: shared helpers for the hero patient scripts in tools/people/hero/ (first patient: p25).
Run inside Blender 5.1 with the private MakeHuman user folder, as the other people scripts are:
   BLENDER_USER_RESOURCES=~/Developer/overlord-asset-sources/people/blender-user \
     /Applications/Blender.app/Contents/MacOS/Blender -b --factory-startup --python tools/people/hero/<script>.py -- ...
The existing modules in tools/people (pp_common, pp_body, ...) are imported as a library and never changed.

Frames used by every hero script
  standing frame (Blender): +Z up, the face looks along -Y, the person's left is +X, metres, feet at z = 0.
  patient frame (glTF, the delivered file): +Y up, metres, origin = middle of the stretcher-top surface, head toward -Z,
     lying on his back with the face toward +Y, so his left is +X.
  lying frame (Blender, used while posing): +Z up from the mattress top, head toward +Y, face +Z, left +X.
     lying (x, y, z) -> patient (x, z, -y)  (the glTF exporter does exactly this conversion).
"""
import os, sys, json, math, time
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
PEOPLE_TOOLS = os.path.join(REPO, 'tools', 'people')
for p in (HERE, PEOPLE_TOOLS):
    if p not in sys.path:
        sys.path.insert(0, p)
PEOPLE = os.environ.get('OVERLORD_PEOPLE', os.path.expanduser('~/Developer/overlord-asset-sources/people'))
PYDEPS = os.path.join(PEOPLE, 'pydeps')
if PYDEPS not in sys.path:
    sys.path.append(PYDEPS)
HERO = os.path.join(PEOPLE, 'hero')
STUDY = os.path.join(HERO, 'design', 'asset-first')
DL = os.path.join(STUDY, 'downloads')
MHR_DIR = os.path.join(DL, 'mhr', 'x', 'assets')
ICT_DIR = os.path.join(DL, 'ict-facekit', 'x', 'ICT-FaceKit-master', 'FaceXModel')
HBM_CACHE = os.path.join(STUDY, 'work', 'cache')
HBM_BLEND = os.path.join(DL, 'blender-human-base-meshes', 'x', 'human-base-meshes-bundle-v1.4.1', 'human_base_meshes_bundle.blend')
UV_BIN = os.path.expanduser('~/.local/bin/uv')
OUT_ASSETS = os.path.join(REPO, 'assets', 'people', 'hero')

# icosphere/plain helpers that do not need bpy ------------------------------------------------------------------


def patient_work(pid):
    w = os.path.join(HERO, pid, 'work')
    os.makedirs(w, exist_ok=True)
    return w


class Log:
    def __init__(self, tag):
        self.t0 = time.time(); self.tag = tag

    def __call__(self, *a):
        print(f'[{self.tag} {time.time() - self.t0:6.1f}s]', *a, flush=True)


def args_after_dashes():
    return sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []


def tris_of(F):
    """(m, 3|4) faces (quads may repeat their last index for triangles) -> triangles."""
    F = np.asarray(F)
    if F.shape[1] == 3:
        return F
    t1 = F[:, [0, 1, 2]]
    q = F[:, 3] != F[:, 2]
    t2 = F[q][:, [0, 2, 3]]
    return np.concatenate([t1, t2])


def volume(V, F):
    T = tris_of(F)
    a, b, c = V[T[:, 0]], V[T[:, 1]], V[T[:, 2]]
    return float(np.einsum('ij,ij->i', a, np.cross(b, c)).sum() / 6.0)


def edges_of(F):
    F = np.asarray(F)
    e = np.concatenate([F[:, [k, (k + 1) % F.shape[1]]] for k in range(F.shape[1])])
    e = e[e[:, 0] != e[:, 1]]
    return np.unique(np.sort(e, 1), axis=0)


def vertex_normals(V, F):
    N = np.zeros_like(V)
    for t in [tris_of(F)]:
        n = np.cross(V[t[:, 1]] - V[t[:, 0]], V[t[:, 2]] - V[t[:, 0]])
        for k in range(3):
            np.add.at(N, t[:, k], n)
    return N / np.maximum(np.linalg.norm(N, axis=1, keepdims=True), 1e-20)


def smooth_field(values, E, n_iter=10, keep=None, lam=0.5):
    """Laplacian smoothing of a per-vertex field along mesh edges E. keep: boolean mask of vertices held fixed."""
    v = np.array(values, float)
    n = len(v)
    deg = np.zeros(n); np.add.at(deg, E[:, 0], 1); np.add.at(deg, E[:, 1], 1)
    for _ in range(n_iter):
        acc = np.zeros_like(v)
        np.add.at(acc, E[:, 0], v[E[:, 1]]); np.add.at(acc, E[:, 1], v[E[:, 0]])
        avg = acc / np.maximum(deg, 1).reshape((-1,) + (1,) * (v.ndim - 1))
        nv = v + lam * (avg - v)
        if keep is not None:
            nv[keep] = v[keep]
        v = nv
    return v


def tps_fit(src, dst, reg=1e-6):
    """3D thin-plate (biharmonic, kernel r) warp mapping src control points onto dst. Returns a function."""
    src = np.asarray(src, float); dst = np.asarray(dst, float)
    n = len(src)
    K = np.linalg.norm(src[:, None] - src[None], axis=2)
    P = np.c_[np.ones(n), src]
    A = np.zeros((n + 4, n + 4)); A[:n, :n] = K + reg * np.eye(n); A[:n, n:] = P; A[n:, :n] = P.T
    b = np.zeros((n + 4, 3)); b[:n] = dst
    sol = np.linalg.solve(A, b)
    w, a = sol[:n], sol[n:]

    def f(X):
        X = np.asarray(X, float)
        out = np.empty_like(X)
        for i in range(0, len(X), 20000):
            x = X[i:i + 20000]
            U = np.linalg.norm(x[:, None] - src[None], axis=2)
            out[i:i + 20000] = U @ w + np.c_[np.ones(len(x)), x] @ a
        return out
    return f


def convex_perimeter(P2):
    """Perimeter of the convex hull of 2D points (what a tape measure reads around a section)."""
    from scipy.spatial import ConvexHull
    h = ConvexHull(P2)
    q = P2[h.vertices]
    return float(np.linalg.norm(q - np.roll(q, 1, 0), axis=1).sum())


def section_loop(V, F, origin, normal):
    """Points where the mesh crosses the plane (origin, normal): returns (k, 3) points (unordered segment ends)."""
    T = tris_of(F)
    d = (V - origin) @ normal
    pts = []
    for a, b in ((0, 1), (1, 2), (2, 0)):
        ia, ib = T[:, a], T[:, b]
        s = (d[ia] * d[ib]) < 0
        t = d[ia[s]] / (d[ia[s]] - d[ib[s]])
        pts.append(V[ia[s]] + t[:, None] * (V[ib[s]] - V[ia[s]]))
    return np.concatenate(pts) if pts else np.zeros((0, 3))


def plane_basis(n):
    n = n / np.linalg.norm(n)
    a = np.array([1.0, 0, 0]) if abs(n[0]) < 0.9 else np.array([0, 1.0, 0])
    u = np.cross(n, a); u /= np.linalg.norm(u)
    v = np.cross(n, u)
    return u, v


def tape_circumference(V, F, origin, normal, keep_near=None, radius=0.25):
    """Tape-measure circumference of the body section through origin, perpendicular to normal. keep_near limits the
    section to points within `radius` of keep_near (so that, e.g., the chin or shoulders cut by the same plane are left out)."""
    P = section_loop(V, F, np.asarray(origin, float), np.asarray(normal, float))
    if keep_near is not None:
        P = P[np.linalg.norm(P - np.asarray(keep_near), axis=1) < radius]
    if len(P) < 8:
        return float('nan'), P
    u, v = plane_basis(np.asarray(normal, float))
    Q = np.stack([(P - origin) @ u, (P - origin) @ v], 1)
    return convex_perimeter(Q), P


def srgb_to_lin(c):
    c = np.asarray(c, float)
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def lin_to_srgb(c):
    c = np.clip(np.asarray(c, float), 0, None)
    return np.where(c <= 0.0031308, c * 12.92, 1.055 * np.power(c, 1 / 2.4) - 0.055)


def save_json(path, obj):
    def conv(o):
        if isinstance(o, np.ndarray):
            return o.tolist()
        if isinstance(o, (np.floating,)):
            return float(o)
        if isinstance(o, (np.integer,)):
            return int(o)
        raise TypeError(type(o))
    with open(path, 'w') as f:
        json.dump(obj, f, indent=1, default=conv)


def cc_subdivide(n_verts, faces, uvs, subset):
    """(Copied from the texture-first study's tf_lib.py.) One level of Catmull-Clark on the quads listed in `subset` (indices into faces); other faces are kept and those
    that touch the subdivided set are re-cut so that no T-junction is left. faces: list of index tuples (3 or 4 long);
    uvs: one (u, v) per face corner, in face order. Returns (W, new_faces, new_uvs, parent_face) where W is a sparse
    (new verts x old verts) matrix: positions, shape keys and skin weights of the new mesh are W @ old."""
    from scipy import sparse
    subset = set(int(i) for i in subset if len(faces[int(i)]) == 4)
    edge_faces, face_off = {}, []
    c0 = 0
    for fi, f in enumerate(faces):
        face_off.append(c0); c0 += len(f)
        for q in range(len(f)):
            e = (min(f[q], f[(q + 1) % len(f)]), max(f[q], f[(q + 1) % len(f)]))
            edge_faces.setdefault(e, []).append(fi)
    rows, cols, vals = [], [], []
    n = n_verts

    def add_row(r, items):
        for c, v in items:
            rows.append(r); cols.append(int(c)); vals.append(float(v))
    # face points
    fpt = {}
    for fi in subset:
        fpt[fi] = n; add_row(n, [(v, 0.25) for v in faces[fi]]); n += 1
    # edge points: interior edges of the set use the smooth rule, edges on its border (or the mesh border) the midpoint
    ept = {}
    for e, fl in edge_faces.items():
        ins = [fi for fi in fl if fi in subset]
        if not ins:
            continue
        ept[e] = n
        if len(fl) == 2 and len(ins) == 2:
            items = [(e[0], 0.25), (e[1], 0.25)]
            for fi in ins:
                items += [(v, 0.25 * 0.25) for v in faces[fi]]
            add_row(n, items)
        else:
            add_row(n, [(e[0], 0.5), (e[1], 0.5)])
        n += 1
    # original vertices: smoothed where every face around them is in the set
    vert_faces = {}
    for fi, f in enumerate(faces):
        for v in f:
            vert_faces.setdefault(v, []).append(fi)
    vert_edges = {}
    for e in edge_faces:
        vert_edges.setdefault(e[0], []).append(e); vert_edges.setdefault(e[1], []).append(e)
    for v in range(n_verts):
        fl = vert_faces.get(v, [])
        el = vert_edges.get(v, [])
        if fl and all(fi in subset for fi in fl) and len(el) == len(fl) and len(fl) >= 3:
            k = len(fl)
            acc = {v: (k - 3.0) / k}
            for fi in fl:
                for u in faces[fi]:
                    acc[u] = acc.get(u, 0.0) + 0.25 / (k * k)
            for e in el:
                for u in e:
                    acc[u] = acc.get(u, 0.0) + 0.5 * 2.0 / (k * k)
            add_row(v, list(acc.items()))
        else:
            add_row(v, [(v, 1.0)])
    W = sparse.csr_matrix((vals, (rows, cols)), shape=(n, n_verts))
    new_faces, new_uvs, parent = [], [], []
    uvs = np.asarray(uvs, np.float64)
    for fi, f in enumerate(faces):
        fu = uvs[face_off[fi]:face_off[fi] + len(f)]
        if fi in subset:
            a, b, c, d = f
            ua, ub, uc, ud = fu
            e = [ept[(min(f[q], f[(q + 1) % 4]), max(f[q], f[(q + 1) % 4]))] for q in range(4)]
            ue = [(fu[q] + fu[(q + 1) % 4]) * 0.5 for q in range(4)]
            m, um = fpt[fi], fu.mean(0)
            for quad, quv in (((a, e[0], m, e[3]), (ua, ue[0], um, ue[3])), ((e[0], b, e[1], m), (ue[0], ub, ue[1], um)), ((m, e[1], c, e[2]), (um, ue[1], uc, ue[2])), ((e[3], m, e[2], d), (ue[3], um, ue[2], ud))):
                new_faces.append(quad); new_uvs.extend(quv); parent.append(fi)
        else:
            poly, puv = [], []
            for q in range(len(f)):
                poly.append(f[q]); puv.append(fu[q])
                e = (min(f[q], f[(q + 1) % len(f)]), max(f[q], f[(q + 1) % len(f)]))
                if e in ept:
                    poly.append(ept[e]); puv.append((fu[q] + fu[(q + 1) % len(f)]) * 0.5)
            if len(poly) == len(f):
                new_faces.append(tuple(f)); new_uvs.extend(fu); parent.append(fi)
            else:                                       # fan from the first inserted midpoint
                first = next(i for i, p in enumerate(poly) if p >= n_verts)
                poly = poly[first:] + poly[:first]; puv = puv[first:] + puv[:first]
                for t in range(1, len(poly) - 1):
                    new_faces.append((poly[0], poly[t], poly[t + 1])); new_uvs.extend((puv[0], puv[t], puv[t + 1])); parent.append(fi)
    return W, new_faces, np.array(new_uvs), np.array(parent)



# Blender helpers ------------------------------------------------------------------------------------------------
try:
    import bpy
    from mathutils import Matrix, Vector, Quaternion
except ImportError:          # plain Python (texture and report scripts)
    bpy = None


def get_co(data, n):
    a = np.empty(n * 3, np.float32)
    data.foreach_get('co', a)
    return a.reshape(-1, 3).astype(np.float64)


def set_co(data, co):
    data.foreach_set('co', np.asarray(co, np.float32).ravel())


def world_coords(obj, depsgraph=None):
    dg = depsgraph or bpy.context.evaluated_depsgraph_get()
    ev = obj.evaluated_get(dg)
    me = ev.to_mesh()
    a = get_co(me.vertices, len(me.vertices))
    ev.to_mesh_clear()
    mw = np.array(obj.matrix_world)
    return a @ mw[:3, :3].T + mw[:3, 3]


def faces_of(obj):
    return [tuple(p.vertices) for p in obj.data.polygons]


def quads_of(obj):
    return np.array([list(p.vertices) + [p.vertices[-1]] * (4 - len(p.vertices)) for p in obj.data.polygons if len(p.vertices) <= 4], np.int32)


def new_mesh(name, V, F, uvs=None, smooth=True, collection=None):
    me = bpy.data.meshes.new(name)
    me.from_pydata([tuple(map(float, v)) for v in V], [], [tuple(int(i) for i in f) for f in F])
    me.update()
    if uvs is not None:
        layer = me.uv_layers.new(name='UVMap')
        layer.data.foreach_set('uv', np.asarray(uvs, np.float32).reshape(-1))
    if smooth:
        me.polygons.foreach_set('use_smooth', [True] * len(me.polygons))
    ob = bpy.data.objects.new(name, me)
    (collection or bpy.context.scene.collection).objects.link(ob)
    return ob


def bvh(V, F):
    from mathutils.bvhtree import BVHTree
    polys = [tuple(int(i) for i in (f if len(f) < 4 or f[-1] != f[-2] else f[:-1])) for f in F]
    return BVHTree.FromPolygons([tuple(map(float, v)) for v in V], polys)


def closest_points(tree, P):
    loc = np.empty_like(P); nrm = np.empty_like(P); dist = np.empty(len(P)); idx = np.empty(len(P), int)
    for i, p in enumerate(P):
        l, n, j, d = tree.find_nearest(Vector(p))
        if l is None:
            loc[i] = p; nrm[i] = (0, 0, 1); dist[i] = 1e9; idx[i] = -1
        else:
            loc[i] = l; nrm[i] = n; dist[i] = d; idx[i] = j
    return loc, nrm, dist, idx


def barycentric(P, A, B, C):
    v0, v1, v2 = B - A, C - A, P - A
    d00 = (v0 * v0).sum(1); d01 = (v0 * v1).sum(1); d11 = (v1 * v1).sum(1); d20 = (v2 * v0).sum(1); d21 = (v2 * v1).sum(1)
    den = np.maximum(d00 * d11 - d01 * d01, 1e-30)
    v = (d11 * d20 - d01 * d21) / den; w = (d00 * d21 - d01 * d20) / den
    return np.stack([1 - v - w, v, w], 1)


def bind_to_surface(P, V, T):
    """Bind points P to triangles T of mesh V: (tri index, barycentric, normal offset). Lets P follow V's later shapes."""
    tree = bvh(V, T)
    loc, nrm, dist, idx = closest_points(tree, P)
    A, B, C = V[T[idx, 0]], V[T[idx, 1]], V[T[idx, 2]]
    bc = barycentric(loc, A, B, C)
    n = np.cross(B - A, C - A); n /= np.maximum(np.linalg.norm(n, axis=1, keepdims=True), 1e-20)
    off = ((P - loc) * n).sum(1)
    return idx, bc, off


def eval_binding(V, T, binding, use_offset=True):
    idx, bc, off = binding
    A, B, C = V[T[idx, 0]], V[T[idx, 1]], V[T[idx, 2]]
    p = A * bc[:, :1] + B * bc[:, 1:2] + C * bc[:, 2:3]
    if use_offset:
        n = np.cross(B - A, C - A); n /= np.maximum(np.linalg.norm(n, axis=1, keepdims=True), 1e-20)
        p = p + n * off[:, None]
    return p


def use_gpu(scene, samples=96):
    scene.render.engine = 'CYCLES'
    scene.cycles.samples = samples
    scene.cycles.use_denoising = True
    try:
        prefs = bpy.context.preferences.addons['cycles'].preferences
        prefs.compute_device_type = 'METAL'
        prefs.get_devices()
        for d in prefs.devices:
            d.use = True
        scene.cycles.device = 'GPU'
    except Exception as e:
        print('GPU not used:', e)


def look(cam_obj, loc, tgt, up=(0, 0, 1)):
    loc, tgt, up = Vector(loc), Vector(tgt), Vector(up)
    f = (tgt - loc).normalized()
    if abs(f.dot(up)) > 0.98:
        up = Vector((0, 1, 0)) if abs(f.y) < 0.9 else Vector((1, 0, 0))
    r = f.cross(up).normalized(); u = r.cross(f)
    cam_obj.matrix_world = Matrix(((r.x, u.x, -f.x, loc.x), (r.y, u.y, -f.y, loc.y), (r.z, u.z, -f.z, loc.z), (0, 0, 0, 1)))


def render(scene, path, w, h):
    scene.render.resolution_x, scene.render.resolution_y = w, h
    scene.render.resolution_percentage = 100
    scene.render.filepath = path
    scene.render.image_settings.file_format = 'PNG'
    bpy.ops.render.render(write_still=True)


def clay(name='clay', color=(0.5, 0.48, 0.46), rough=0.5):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*color, 1)
    b.inputs['Roughness'].default_value = rough
    return m


def studio(scene, target, strength=1.0, world=0.25):
    w = bpy.data.worlds.new('w'); scene.world = w; w.use_nodes = True
    w.node_tree.nodes['Background'].inputs[0].default_value = (0.5, 0.52, 0.55, 1)
    w.node_tree.nodes['Background'].inputs[1].default_value = world
    out = []
    for off, energy, size, color in (((-0.9, -1.3, 0.9), 150, 0.9, (1.0, 0.97, 0.93)), ((1.4, -0.9, 0.2), 35, 1.4, (0.92, 0.96, 1.0)), ((0.6, 1.4, 0.9), 90, 0.8, (1, 1, 1))):
        d = bpy.data.lights.new('l', 'AREA'); d.energy = energy * strength; d.size = size; d.color = color
        o = bpy.data.objects.new('l', d); scene.collection.objects.link(o)
        o.location = Vector(target) + Vector(off)
        o.rotation_euler = (Vector(target) - o.location).to_track_quat('-Z', 'Y').to_euler()
        out.append(o)
    return out


def skin_matrices(arm_obj, mesh_obj):
    """Per-vertex linear-blend skinning matrices (4x4) for mesh_obj under arm_obj's current pose, in the mesh's local
    space (mesh and armature are assumed to share the same object transform). Returns (n, 4, 4)."""
    me = mesh_obj.data
    n = len(me.vertices)
    names = {g.index: g.name for g in mesh_obj.vertex_groups}
    pb = arm_obj.pose.bones
    mats = {}
    for i, nm in names.items():
        if nm in pb:
            b = pb[nm]
            mats[i] = np.array(b.matrix) @ np.linalg.inv(np.array(b.bone.matrix_local))
    S = np.zeros((n, 4, 4)); wsum = np.zeros(n)
    for v in me.vertices:
        for g in v.groups:
            m = mats.get(g.group)
            if m is not None and g.weight > 0:
                S[v.index] += g.weight * m; wsum[v.index] += g.weight
    ok = wsum > 1e-8
    S[ok] /= wsum[ok][:, None, None]
    S[~ok] = np.eye(4)
    return S


def apply_mats(S, P):
    return np.einsum('nij,nj->ni', S[:, :3, :3], P) + S[:, :3, 3]


def apply_mats_dir(S, D):
    return np.einsum('nij,nj->ni', S[:, :3, :3], D)
