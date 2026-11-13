"""pp_cloth.py: the gown and the sheet for a person who is already lying down. Used by make_person.py.
Frame: X = the patient's left, Y = toward the head, Z = up from the table, meters.
The sheet is made the way tools/build_patient.py made the first patient's, only finer: look straight down at the body
to get the height of its top surface everywhere (rays against the mesh), then let a cloth settle on that height map. A
cloth cannot sink into what is under it and otherwise evens itself out, so it bridges small hollows and sags between
the legs. The sheet is a rectangle from a line across the chest to past the feet; it lies on the table beside the body,
and the arms lie on top of it, pressing it down where they rest. Its mesh is a regular net whose edge points are slid
onto the outline, so the edges are straight and smooth, not stepped.
The gown cannot be made that way (seen from above, a shoulder is a cliff), so it is a thin shell: the body's own
surface moved outward a few millimetres, evened out, lifted where a real cloth would bridge a hollow, and cut cleanly
along the neckline, the sleeve ends and a line that the sheet hides."""
import math
import numpy as np
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from scipy import ndimage as ndi

TABLE = 0.0025        # a cloth lying on the table sits this far above it


class Grid:
    """A raster over the table top."""
    def __init__(self, x0, x1, y0, y1, cell):
        self.cell = cell
        self.x0, self.y0 = x0, y0
        self.nx, self.ny = int(math.ceil((x1 - x0) / cell)) + 1, int(math.ceil((y1 - y0) / cell)) + 1
        self.xs = x0 + cell * np.arange(self.nx)
        self.ys = y0 + cell * np.arange(self.ny)
        self.X, self.Y = np.meshgrid(self.xs, self.ys)

    def px(self, metres):
        return metres / self.cell

    def sample(self, field, x, y, order=1):
        """Value of a raster field at arbitrary points (bilinear)."""
        return ndi.map_coordinates(field, [(np.asarray(y) - self.y0) / self.cell, (np.asarray(x) - self.x0) / self.cell], order=order, mode='nearest')


def height_map(grid, verts, faces, from_below=False):
    """Height of the top surface seen from straight above (or of the underside, seen from below); -1 where there is nothing."""
    tree = BVHTree.FromPolygons([tuple(v) for v in verts], [tuple(int(i) for i in f) for f in faces])
    H = np.full((grid.ny, grid.nx), -1.0)
    down = Vector((0, 0, -1))
    top = float(verts[:, 2].max()) + 0.5
    verts = np.asarray(verts)
    used = np.array(sorted({int(i) for f in faces for i in f}))
    bx0, bx1, by0, by1 = verts[used, 0].min(), verts[used, 0].max(), verts[used, 1].min(), verts[used, 1].max()
    for j, y in enumerate(grid.ys):
        if y < by0 - grid.cell or y > by1 + grid.cell:
            continue
        for i, x in enumerate(grid.xs):
            if x < bx0 - grid.cell or x > bx1 + grid.cell:
                continue
            hit = tree.ray_cast(Vector((x, y, -0.5)), -down) if from_below else tree.ray_cast(Vector((x, y, top)), down)
            if hit[0] is not None:
                H[j, i] = hit[0].z
    return H


def settle(floor, mask, outside, reach_y, reach_x):
    """Let a cloth settle. floor: the lowest it may be; mask: where the cloth is; outside: the height taken as given
    beyond the mask (the table at a tucked edge, the skin at a cut edge). reach_y and reach_x, in cells, are how far the
    cloth evens out along and across the body: hollows narrower than that are bridged, wider ones are followed."""
    sx = 1.4
    sy = sx * reach_y / reach_x
    n = max(1, int(round((reach_x / sx) ** 2)))
    S = np.where(mask, floor, outside)
    for _ in range(n):
        S = np.where(mask, np.maximum(floor, ndi.gaussian_filter(S, (sy, sx), mode='nearest')), outside)
    return S


def signed_distance(grid, mask, smooth_px=1.5):
    """Distance to the outline of a region, negative inside, in meters, smoothed so the outline has no pixel steps."""
    d = ndi.distance_transform_edt(~mask) - ndi.distance_transform_edt(mask)
    d = np.where(d > 0, d - 0.5, d + 0.5) * grid.cell
    return ndi.gaussian_filter(d, smooth_px)


def mesh_from_region(grid, sdf, height, step, hem=0.0, hem_above=0.012, uv_scale=2.0, body=None):
    """A mesh of a draped cloth. A regular net with `step` spacing is laid over the region where sdf < 0; net points near
    the outline are slid onto it; heights come from the settled cloth. Where an edge is a cut edge high above the table
    (a neckline, a hem) and `hem` is set, a narrow turned-under strip gives the cloth a visible thickness there."""
    xs = np.arange(grid.x0 + step, grid.xs[-1], step)
    ys = np.arange(grid.y0 + step, grid.ys[-1], step)
    PX, PY = np.meshgrid(xs, ys)
    d = grid.sample(sdf, PX, PY)
    gy, gx = np.gradient(sdf, grid.cell)
    near = np.abs(d) < 0.5 * step
    nx_, ny_ = grid.sample(gx, PX, PY), grid.sample(gy, PX, PY)
    ln = np.maximum(np.hypot(nx_, ny_), 1e-6)
    for _ in range(3):                                   # slide onto the outline (a few short steps follow a curved outline)
        dd = grid.sample(sdf, PX, PY)
        PX = np.where(near, PX - dd * nx_ / ln, PX)
        PY = np.where(near, PY - dd * ny_ / ln, PY)
    ok = (d < 0) | near
    idx = -np.ones(PX.shape, int)
    idx[ok] = np.arange(ok.sum())
    V = np.stack([PX[ok], PY[ok], grid.sample(height, PX[ok], PY[ok])], 1)
    on_edge = near[ok]
    faces = []
    a, b, c, e = idx[:-1, :-1], idx[:-1, 1:], idx[1:, 1:], idx[1:, :-1]
    full = (a >= 0) & (b >= 0) & (c >= 0) & (e >= 0)
    for q in np.stack([a[full], b[full], c[full], e[full]], 1):
        faces.append(tuple(int(i) for i in q))
    for corners in ((a, b, c, e), (b, c, e, a), (c, e, a, b), (e, a, b, c)):      # three good corners: keep a triangle
        p, q, r, miss = corners
        tri = (p >= 0) & (q >= 0) & (r >= 0) & (miss < 0)
        for t in np.stack([p[tri], q[tri], r[tri]], 1):
            faces.append(tuple(int(i) for i in t))
    # drop points no face uses
    used = np.zeros(len(V), bool)
    for f in faces:
        used[list(f)] = True
    re = -np.ones(len(V), int); re[used] = np.arange(used.sum())
    V, on_edge = V[used], on_edge[used]
    faces = [tuple(int(re[i]) for i in f) for f in faces]
    if hem > 0:
        V, faces = add_hem(V, faces, grid, sdf, hem, hem_above, body)
    uv_of = lambda v: (v[0] * uv_scale, v[1] * uv_scale)
    uvs = [uv_of(V[i]) for f in faces for i in f]
    return V, faces, uvs


def add_hem(V, faces, grid, sdf, depth, above, body=None):
    """Finish the edges of a cloth that are well above the table. Over the body (a neckline, a sleeve end) the cloth is
    turned under by one narrow strip, which gives it a visible thickness. Beyond the body's outline (`body` is the height
    map of what lies under the cloth) it hangs: one strip straight down to the table."""
    count = {}
    for f in faces:
        for i in range(len(f)):
            e = (f[i], f[(i + 1) % len(f)])
            count[tuple(sorted(e))] = count.get(tuple(sorted(e)), []) + [e]
    border = [es[0] for es in count.values() if len(es) == 1]
    gy, gx = np.gradient(sdf, grid.cell)
    V = [tuple(v) for v in V]
    over_body = None
    if body is not None:
        over_body = grid.sample(ndi.binary_dilation(body >= 0, iterations=2).astype(float), [v[0] for v in V], [v[1] for v in V]) > 0.5
    twin = {}

    def under(i):
        if i not in twin:
            x, y, z = V[i]
            nx_, ny_ = float(grid.sample(gx, [x], [y])[0]), float(grid.sample(gy, [x], [y])[0])
            ln = max(math.hypot(nx_, ny_), 1e-6)
            twin[i] = len(V)
            if over_body is not None and not over_body[i]:
                V.append((x + 0.004 * nx_ / ln, y + 0.004 * ny_ / ln, TABLE))            # hangs to the table
            else:
                V.append((x - 0.6 * depth * nx_ / ln, y - 0.6 * depth * ny_ / ln, z - depth))   # turned under
        return twin[i]
    for (i, j) in border:
        if V[i][2] > above and V[j][2] > above:
            faces.append((j, i, under(i), under(j)))
    return np.array(V), faces


def wrinkles(grid, seed, amount, along=1.0):
    """Small unevenness for a cloth: long soft folds along the body plus finer crumple. Returns meters, zero mean."""
    rng = np.random.default_rng(seed)
    out = np.zeros((grid.ny, grid.nx))
    for sx, sy, w in ((0.012, 0.07 * along, 1.0), (0.03, 0.03, 0.7), (0.008, 0.012, 0.35)):
        f = ndi.gaussian_filter(rng.standard_normal((grid.ny, grid.nx)), (grid.px(sy), grid.px(sx)), mode='wrap')
        out += w * f / (f.std() + 1e-9)
    return amount * out / 2.0


def vertex_normals(co, quads):
    n = np.zeros_like(co)
    a, b, c, d = (co[quads[:, i]] for i in range(4))
    fn = np.cross(c - a, d - b)
    for i in range(4):
        np.add.at(n, quads[:, i], fn)
    return n / np.maximum(np.linalg.norm(n, axis=1, keepdims=True), 1e-12)


def clip_polygons(V, faces, d):
    """Cut a mesh along the line where the per-vertex value d is zero and keep the side where it is negative.
    New vertices are placed on the edges exactly where d crosses zero, so the cut is as smooth as d is.
    Returns the new positions, the faces (3 to 5 corners), and for every vertex (a, b, t): it is a*(1-t) + b*t of the old ones."""
    V = np.asarray(V, float)
    src = [(i, i, 0.0) for i in range(len(V))]
    pts = [tuple(v) for v in V]
    made = {}

    def cross(i, j):
        key = (min(i, j), max(i, j))
        if key not in made:
            a, b = key
            t = d[a] / (d[a] - d[b])
            made[key] = len(pts)
            pts.append(tuple(V[a] * (1 - t) + V[b] * t))
            src.append((a, b, float(t)))
        return made[key]
    out = []
    for f in faces:
        inside = [d[i] < 0 for i in f]
        if all(inside):
            out.append(tuple(int(i) for i in f))
            continue
        if not any(inside):
            continue
        poly = []
        n = len(f)
        for q in range(n):
            i, j = int(f[q]), int(f[(q + 1) % n])
            if d[i] < 0:
                poly.append(i)
            if (d[i] < 0) != (d[j] < 0):
                poly.append(cross(i, j))
        if len(poly) >= 3:
            out.append(tuple(poly))
    used = sorted({i for f in out for i in f})
    re = {o: n for n, o in enumerate(used)}
    return np.array([pts[i] for i in used]), [tuple(re[i] for i in f) for f in out], [src[i] for i in used]


def clip_with_uv(V, faces, uvs, d):
    """clip_polygons for a mesh whose texture coordinates are stored per face corner (so seams are kept): cuts along
    d = 0, keeps d < 0. Returns positions, faces and one uv per face corner of the result."""
    V = np.asarray(V, float); uvs = np.asarray(uvs, float)
    pts = [tuple(v) for v in V]
    made = {}
    out_f, out_uv = [], []
    c0 = 0
    for f in faces:
        n = len(f)
        fuv = uvs[c0:c0 + n]; c0 += n
        inside = [d[i] < 0 for i in f]
        if all(inside):
            out_f.append(tuple(int(i) for i in f)); out_uv.extend(fuv)
            continue
        if not any(inside):
            continue
        poly, puv = [], []
        for q in range(n):
            i, j = int(f[q]), int(f[(q + 1) % n])
            if d[i] < 0:
                poly.append(i); puv.append(fuv[q])
            if (d[i] < 0) != (d[j] < 0):
                key = (min(i, j), max(i, j))
                t = d[i] / (d[i] - d[j])
                if key not in made:
                    made[key] = len(pts)
                    pts.append(tuple(V[i] * (1 - t) + V[j] * t))
                poly.append(made[key]); puv.append(fuv[q] * (1 - t) + fuv[(q + 1) % n] * t)
        if len(poly) >= 3:
            out_f.append(tuple(poly)); out_uv.extend(puv)
    used = sorted({i for f in out_f for i in f})
    re = {o: n for n, o in enumerate(used)}
    return np.array([pts[i] for i in used]), [tuple(re[i] for i in f) for f in out_f], np.array(out_uv)


def gown_shell(body, quads, labels, grid, bridge, cut, k, seed):
    """The gown as a thin shell around the shoulders, chest and upper arms: the body's own surface moved outward, evened
    out so that it reads as cloth and not as skin, lifted where a real cloth would bridge a hollow (`bridge` is a cloth
    settled on the body seen from above), and cut along the neckline, the sleeve ends and a line hidden under the sheet.
    cut = {'a', 'b', 'y_c': the neck opening, 'y_sleeve', 'y_bottom'}."""
    N = vertex_normals(body, quads)
    x, y = body[:, 0], body[:, 1]
    is_arm = (labels['armL'] + labels['armR']) >= 0.5
    a, b, y_c = cut['a'], cut['b'], cut['y_c']
    # distance to the neck opening (negative inside the opening): a strip up past the neck with a rounded lower end
    hole = np.hypot(x, np.minimum(y - y_c, 0.0) * a / b) - a
    y_cut = np.where(is_arm, cut['y_sleeve'], cut['y_bottom'])
    d = np.maximum(-hole, y_cut - y)                         # negative: this vertex is under the gown
    d = np.where(labels['head'] >= 0.5, np.maximum(d, 0.02), d)
    t = 0.0055 * max(k, 0.55)                                # the cloth's stand-off from the skin
    sel = d < 0.04 * k
    qsel = quads[sel[quads].all(1)]
    Sh = body + N * t
    E = np.unique(np.sort(np.concatenate([qsel[:, [i, (i + 1) % 4]] for i in range(4)]), axis=1), axis=0)
    nb_sum = np.zeros_like(Sh); nb_cnt = np.zeros(len(Sh))
    for _ in range(3):                                       # even out, and never closer to the skin than a minimum
        nb_sum[:] = 0; nb_cnt[:] = 0
        np.add.at(nb_sum, E[:, 0], Sh[E[:, 1]]); np.add.at(nb_cnt, E[:, 0], 1)
        np.add.at(nb_sum, E[:, 1], Sh[E[:, 0]]); np.add.at(nb_cnt, E[:, 1], 1)
        move = nb_cnt > 2
        Sh[move] = 0.45 * Sh[move] + 0.55 * (nb_sum[move] / nb_cnt[move][:, None])
        off = np.einsum('ij,ij->i', Sh - body, N)
        Sh += N * np.maximum(0.6 * t - off, 0.0)[:, None]
    # where a cloth seen from above would bridge a hollow (armpit, the dip above the collar bones), lift the shell to it
    w = np.clip((N[:, 2] - 0.35) / 0.35, 0, 1)
    gz = grid.sample(bridge, Sh[:, 0], Sh[:, 1])
    Sh[:, 2] += w * np.maximum(gz - Sh[:, 2], 0.0)
    Sh[:, 2] = np.maximum(Sh[:, 2], 0.0012)
    V, faces, src = clip_polygons(Sh, qsel, d)
    Nv = np.array([N[i] * (1 - tt) + N[j] * tt for i, j, tt in src])
    # the part lying flat on the table under the patient is never seen
    faces = [f for f in faces if not all(V[i, 2] < 0.012 * k and Nv[i, 2] < -0.3 for i in f)]
    used = sorted({i for f in faces for i in f}); re = {o: n for n, o in enumerate(used)}
    V, Nv = V[used], Nv[used]
    faces = [tuple(re[i] for i in f) for f in faces]
    # hems: every open edge well above the table is turned in toward the skin, which gives the cloth a visible thickness
    count, centre = {}, {}
    for f in faces:
        c = V[list(f)].mean(0)
        for q in range(len(f)):
            e = (f[q], f[(q + 1) % len(f)])
            count.setdefault(tuple(sorted(e)), []).append(e)
            centre.setdefault(f[q], []).append(c)
    V = [tuple(v) for v in V]; twin = {}

    def under(i):
        if i not in twin:
            inward = np.mean(centre[i], 0) - np.array(V[i])
            inward /= max(np.linalg.norm(inward), 1e-9)
            p = np.array(V[i]) - Nv[i] * (0.85 * t) + inward * (0.6 * t)
            twin[i] = len(V); V.append((p[0], p[1], max(p[2], 0.001)))
        return twin[i]
    for es in list(count.values()):
        if len(es) == 1:
            i, j = es[0]
            if (V[i][2] > 0.02 * k or V[j][2] > 0.02 * k) and Nv[i][2] > -0.2 and Nv[j][2] > -0.2:
                faces.append((j, i, under(i), under(j)))
    V = np.array(V)
    uvs = [(V[i][0] * 2.0, V[i][1] * 2.0) for f in faces for i in f]
    return (V, faces, uvs), d


def drape_patient(body, quads, labels, J, H, seed=1, log=print):
    """Gown and sheet for one patient.
    body: (N, 3) lying positions; quads: body faces; labels: per-vertex part weights; J: joint positions (lying frame);
    H: the patient's height. Returns a dict with the two meshes and the pieces make_person.py needs afterwards."""
    k = H / 1.75                                            # everything below is given for an adult and scaled to the patient
    cell = max(0.0015, 0.0045 * k)
    used = np.unique(quads)
    bx0, bx1 = body[used, 0].min(), body[used, 0].max()
    by0, by1 = body[used, 1].min(), body[used, 1].max()
    grid = Grid(bx0 - 0.10 * k, bx1 + 0.10 * k, by0 - 0.16 * k, by1 + 0.06 * k, cell)
    is_arm = (labels['armL'][quads].mean(1) + labels['armR'][quads].mean(1)) >= 0.5
    is_head = (labels['head'][quads].mean(1) + labels['neck'][quads].mean(1)) >= 0.5
    H_tl = height_map(grid, body, quads[~is_arm & ~is_head])       # trunk and legs
    H_arm = height_map(grid, body, quads[is_arm])
    H_head = height_map(grid, body, quads[is_head])
    H_all = np.maximum(np.maximum(H_tl, H_arm), H_head)
    sil_tl, sil_arm = H_tl >= 0, H_arm >= 0
    y_sh = 0.5 * (J['upperarm01.L'][1] + J['upperarm01.R'][1])
    y_el = 0.5 * (J['lowerarm01.L'][1] + J['lowerarm01.R'][1])
    y_top = y_sh - 0.066 * H                                # the sheet's top edge: across the upper chest, at the armpits
    y_notch = 0.5 * (J['clavicle.L'][1] + J['clavicle.R'][1])       # where the collar bones meet the breast bone
    X, Y = grid.X, grid.Y
    step_sheet = 0.0185 * k
    lift = 0.004 * max(k, 0.5)

    # ------------------------------------------------ the gown: shoulders, upper chest, sleeves
    y_sleeve = y_el + 0.30 * (y_sh - y_el)
    overlap = 0.06 * k
    neck = labels['neck'] > 0.5
    neck_half = 0.5 * np.ptp(body[neck, 0]) if neck.any() else 0.06 * k
    a = neck_half + 0.030 * k                               # the neck opening: a rounded scoop from a little below the notch, up past the neck on both sides
    y_c = y_notch + 0.035 * k
    cut = {'a': a, 'b': y_c - (y_notch - 0.022 * k), 'y_c': y_c, 'y_sleeve': y_sleeve, 'y_bottom': y_top - overlap}
    reach = grid.px(0.03 * k)
    floor_b = np.where(H_all >= 0, H_all + lift, TABLE)
    bridge = settle(floor_b, np.ones_like(sil_tl), floor_b, reach, reach)
    gown, d_gown = gown_shell(body, quads, labels, grid, bridge, cut, k, seed)
    deep_gown = d_gown < -0.02 * k                           # skin this far under the gown is never seen
    H_gown = height_map(grid, gown[0], gown[1])

    # ------------------------------------------------ the sheet: a rectangle from the chest line to past the feet; the arms lie on top of it
    rows = np.nonzero(sil_tl.any(1))[0]
    foot_y = grid.ys[rows[0]]
    below = Y <= y_top
    x_body = np.abs(X[sil_tl & below]).max()
    x_arm = np.abs(X[sil_arm]).max() if sil_arm.any() else 0.0
    half = max(x_arm + 0.028 * max(k, 0.6), x_body + 0.045 * k)             # wide enough to lie under the hands and to reach the table beside the body
    sheet_mask = (np.abs(X) <= half) & below & (Y >= foot_y - 0.085 * k)
    # What the sheet rests on: the highest point within one mesh spacing, so no net point sits below a nearby bump; and
    # carried a little past the body's outline, so the cloth leaves the body level and then falls.
    r_s = int(round(grid.px(1.0 * step_sheet)))
    near_body = ndi.binary_dilation(sil_tl, iterations=r_s)
    under = np.where(near_body, ndi.maximum_filter(np.maximum(H_tl, 0), size=2 * r_s + 1), 0.0)
    floor_s = np.where(near_body, under + 0.0035 * max(k, 0.5), TABLE)
    on_gown = (H_gown >= 0) & (Y >= y_top - overlap) & ~sil_arm
    floor_s = np.where(on_gown, np.maximum(floor_s, ndi.maximum_filter(H_gown, size=5) + 0.003), floor_s)      # the sheet lies over the gown where they meet
    # the cloth is pulled along the body, so it evens out further along Y than across
    loose = settle(floor_s, np.ones_like(sheet_mask), floor_s, grid.px(0.062 * k), grid.px(0.045 * k))
    outside_s = np.where(Y > y_top, loose, TABLE)                    # the sheet lies on the table all round, and simply ends along its top edge
    S = settle(floor_s, sheet_mask, outside_s, grid.px(0.062 * k), grid.px(0.045 * k))
    S = S + np.where(sheet_mask, np.clip((S - TABLE) / 0.03, 0, 1) * wrinkles(grid, seed, 0.0016 * k), 0.0)
    S = np.where(sheet_mask, np.maximum(S, floor_s), S)
    # an arm lying on the sheet presses it down: under an arm (and under a sleeve) the sheet is no higher than the arm's underside
    arm_under = height_map(grid, body, quads[is_arm], from_below=True)
    gown_under = height_map(grid, gown[0], gown[1], from_below=True)
    lid = np.where(arm_under >= 0, arm_under, 9.0)
    lid = np.minimum(lid, np.where((gown_under >= 0) & ndi.binary_dilation(sil_arm, iterations=2), gown_under, 9.0))
    lid = ndi.minimum_filter(lid, size=5)
    pressed = lid < 8.0
    low = np.maximum(TABLE, lid - 0.003)
    # ... and around the arm the sheet comes down to it in a slope, not a step: the pressed part is evened out with its
    # surroundings while it stays under the arm
    T = S.copy()
    for _ in range(10):
        T = ndi.gaussian_filter(np.where(pressed, np.minimum(T, low), T), 1.6)
    reach_w = ndi.gaussian_filter(ndi.binary_dilation(pressed, iterations=int(round(grid.px(0.035 * k)))).astype(float), grid.px(0.012 * k))
    S = S * (1 - reach_w) + T * reach_w
    S = np.maximum(np.where(pressed, np.minimum(S, low), S), TABLE)
    sdf_s = signed_distance(grid, sheet_mask)
    sheet = mesh_from_region(grid, sdf_s, S, step_sheet, hem=0.005 * k, hem_above=0.02 * k)
    arm_vertex = (labels['armL'] + labels['armR']) >= 0.5
    deep_sheet = (grid.sample(sdf_s, body[:, 0], body[:, 1]) < -0.014 * k) & ~arm_vertex       # skin this far under the sheet is never seen; the arms are on top of it
    log(f'CLOTH raster {grid.nx}x{grid.ny} at {cell * 1000:.1f} mm; gown {len(gown[0])} points {len(gown[1])} faces; sheet {len(sheet[0])} points {len(sheet[1])} faces; chest line y {y_top:.3f}, sleeve ends y {y_sleeve:.3f}')
    return {'grid': grid, 'gown': gown, 'sheet': sheet, 'sdf_sheet': sdf_s, 'S': S, 'y_top': y_top, 'y_notch': y_notch, 'y_sleeve': y_sleeve, 'cut': cut,
            'hidden': deep_gown | deep_sheet, 'H_tl': H_tl, 'H_arm': H_arm, 'H_head': H_head, 'H_gown': H_gown, 'k': k}
