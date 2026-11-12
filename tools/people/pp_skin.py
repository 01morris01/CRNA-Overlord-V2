"""pp_skin.py: the skin picture for one patient. Used by make_person.py.
MakeHuman skins are 2048-pixel pictures of the whole body in which the face is only about 400 pixels tall. The browser
budget is 1024 pixels, and only the head, neck and a little of the chest show above the gown. So the picture is laid
out again: the face keeps (in fact slightly gains) its resolution in the middle of a new 1024 picture, the scalp and the
back of the head are squeezed around it, and the few other visible pieces go in a strip along the bottom. The base
mesh's own texture coordinates are the same for every MakeHuman person, so the numbers below hold for all 56.
On top of the re-laid picture this module adds what a 400-pixel face lacks: fine unevenness of colour, pores as a normal
map, eyebrows taken from the eyebrow asset and painted into the skin, and the patient's own skin tone."""
import math
import numpy as np
from scipy import ndimage as ndi
from mathutils.bvhtree import BVHTree
from mathutils import Vector

SIZE = 1024
HEAD_ROWS = 880                       # the head takes the top 880 rows; a 144-row strip under it holds chest, mouth lining and eye sockets
# the head piece of the MakeHuman layout: its centre line, the middle of the face, and how the squeeze works
UC, VC = 0.865, 0.483168              # middle of the face (about the nose) in the original layout
R1, M1 = 0.16, 0.42                   # inside this radius the layout is kept; beyond it distances shrink to 42 %
U_LEFT = R1 + M1 * (0.224 - R1) + 0.004      # extent after the squeeze, toward the crown ...
U_RIGHT = 0.129 + 0.004                      # ... toward the neck ...
V_HALF = R1 + M1 * (0.335 - R1) + 0.004      # ... and toward each side of the back of the head


def srgb_to_lin(c):
    c = np.asarray(c, np.float64)
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def lin_to_srgb(c):
    c = np.clip(c, 0, None)
    return np.where(c <= 0.0031308, c * 12.92, 1.055 * np.power(c, 1 / 2.4) - 0.055)


def head_to_atlas(u, v):
    """Original head coordinates -> coordinates in the new picture (x right, y up, both 0..1)."""
    du, dv = np.asarray(u) - UC, np.asarray(v) - VC
    r = np.maximum(np.hypot(du, dv), 1e-12)
    g = np.where(r <= R1, r, R1 + M1 * (r - R1))
    du, dv = du * g / r, dv * g / r
    x = (dv + V_HALF) / (2 * V_HALF)
    row = (du + U_LEFT) / (U_LEFT + U_RIGHT) * HEAD_ROWS          # pixels from the top: forehead up, chin down
    return x, 1.0 - row / SIZE


def atlas_to_head(px, py):
    """Pixel centre in the head part of the new picture -> original coordinates (the inverse of head_to_atlas)."""
    dv = (px + 0.5) / SIZE * 2 * V_HALF - V_HALF
    du = (py + 0.5) / HEAD_ROWS * (U_LEFT + U_RIGHT) - U_LEFT
    g = np.maximum(np.hypot(du, dv), 1e-12)
    r = np.where(g <= R1, g, R1 + (g - R1) / M1)
    return UC + du * r / g, VC + dv * r / g


def uv_islands(quads, fuv):
    """Which connected piece of the original layout each face belongs to."""
    key, parent = {}, []

    def find(a):
        while parent[a] != a:
            parent[a] = parent[parent[a]]
            a = parent[a]
        return a
    ids = np.zeros(quads.shape, int)
    for fi in range(len(quads)):
        for c in range(4):
            k = (int(quads[fi, c]), round(float(fuv[fi, c, 0]), 5), round(float(fuv[fi, c, 1]), 5))
            if k not in key:
                key[k] = len(parent); parent.append(len(parent))
            ids[fi, c] = key[k]
    for fi in range(len(quads)):
        r = find(ids[fi, 0])
        for c in range(1, 4):
            parent[find(ids[fi, c])] = r
    return np.array([find(ids[fi, 0]) for fi in range(len(quads))])


def classify_islands(quads, fuv):
    """Name the pieces of the MakeHuman layout by where they sit in it."""
    comp = uv_islands(quads, fuv)
    name = np.empty(len(quads), object)
    for c in np.unique(comp):
        m = comp == c
        cu, cv = fuv[m][:, :, 0].mean(), fuv[m][:, :, 1].mean()
        n = m.sum()
        if n > 3500:
            nm = 'trunk'
        elif n > 2500:
            nm = 'head'
        elif 1400 < n < 1800:
            nm = 'handR' if cu < 0.5 else 'handL'           # the right hand's piece is the left one of the two
        elif 900 < n < 1200:
            nm = 'foot'
        elif 300 < n < 500:
            nm = 'mouth'
        else:
            nm = 'socketR' if cu < 0.08 else 'socketL'
        name[m] = nm
    return name


def rasterize(tri_px, tri_attr, height, width):
    """Fill triangles given in pixel coordinates, interpolating per-corner attributes. Returns (attributes, covered)."""
    A = tri_attr.shape[2]
    out = np.zeros((height, width, A), np.float32)
    hit = np.zeros((height, width), bool)
    for t in range(len(tri_px)):
        p = tri_px[t]
        x0, x1 = int(max(0, math.floor(p[:, 0].min()))), int(min(width - 1, math.ceil(p[:, 0].max())))
        y0, y1 = int(max(0, math.floor(p[:, 1].min()))), int(min(height - 1, math.ceil(p[:, 1].max())))
        if x1 < x0 or y1 < y0:
            continue
        den = (p[1, 1] - p[2, 1]) * (p[0, 0] - p[2, 0]) + (p[2, 0] - p[1, 0]) * (p[0, 1] - p[2, 1])
        if abs(den) < 1e-12:
            continue
        gx, gy = np.meshgrid(np.arange(x0, x1 + 1) + 0.5, np.arange(y0, y1 + 1) + 0.5)
        w0 = ((p[1, 1] - p[2, 1]) * (gx - p[2, 0]) + (p[2, 0] - p[1, 0]) * (gy - p[2, 1])) / den
        w1 = ((p[2, 1] - p[0, 1]) * (gx - p[2, 0]) + (p[0, 0] - p[2, 0]) * (gy - p[2, 1])) / den
        w2 = 1 - w0 - w1
        ins = (w0 >= -0.02) & (w1 >= -0.02) & (w2 >= -0.02)
        if not ins.any():
            continue
        val = w0[..., None] * tri_attr[t, 0] + w1[..., None] * tri_attr[t, 1] + w2[..., None] * tri_attr[t, 2]
        sub = out[y0:y1 + 1, x0:x1 + 1]
        sub[ins] = val[ins]
        hit[y0:y1 + 1, x0:x1 + 1] |= ins
    return out, hit


class SkinLayout:
    """Where every kept face of the body goes in the two pictures (skin picture and the shared detail picture)."""

    def __init__(self, quads, fuv, keep, island, is_arm_face, detail_slots):
        self.kept = np.nonzero(keep)[0]
        q, uv, isl = quads[self.kept], fuv[self.kept], island[self.kept]
        self.new_uv = np.zeros_like(uv)
        self.which = np.zeros(len(q), int)                  # 0: skin picture, 1: detail picture
        self.rects = {}                                     # name -> (source box, target box in pixels) for the pieces placed as rectangles
        head = isl == 'head'
        x, y = head_to_atlas(uv[head][:, :, 0], uv[head][:, :, 1])
        self.new_uv[head] = np.stack([x, y], -1)
        self.head = head
        strip = {'chest': (0, HEAD_ROWS, 640, SIZE - HEAD_ROWS), 'mouth': (640, HEAD_ROWS, 192, SIZE - HEAD_ROWS),
                 'socketL': (832, HEAD_ROWS, 96, SIZE - HEAD_ROWS), 'socketR': (928, HEAD_ROWS, 96, SIZE - HEAD_ROWS)}
        arm_kept = is_arm_face[self.kept]
        groups = {'chest': (isl == 'trunk') & ~arm_kept, 'mouth': isl == 'mouth', 'socketL': isl == 'socketL', 'socketR': isl == 'socketR',
                  'handL': isl == 'handL', 'handR': isl == 'handR',
                  'forearmL': (isl == 'trunk') & arm_kept & (uv[:, :, 0].mean(1) > 0.38), 'forearmR': (isl == 'trunk') & arm_kept & (uv[:, :, 0].mean(1) <= 0.38)}
        for nm, m in groups.items():
            if not m.any():
                continue
            target, pic = (strip[nm], 0) if nm in strip else (detail_slots[nm], 1)
            u0, u1, v0, v1 = uv[m][:, :, 0].min(), uv[m][:, :, 0].max(), uv[m][:, :, 1].min(), uv[m][:, :, 1].max()
            pad = 3.0                                        # pixels kept free around a piece, so neighbours do not bleed in
            tx, ty, tw, th = target
            sx, sy = (tw - 2 * pad) / max(u1 - u0, 1e-9), (th - 2 * pad) / max(v1 - v0, 1e-9)
            px = tx + pad + (uv[m][:, :, 0] - u0) * sx
            py = ty + pad + (v1 - uv[m][:, :, 1]) * sy       # rows count from the top
            self.new_uv[m] = np.stack([px / SIZE, 1.0 - py / SIZE], -1)
            self.which[m] = pic
            self.rects[nm] = ((u0, u1, v0, v1), (tx, ty, tw, th), pad, pic)
        self.quads = q

    def source_coords(self, picture):
        """For every pixel of one of the two pictures: the original coordinates to take colour from, and where that applies."""
        yy, xx = np.mgrid[0:SIZE, 0:SIZE].astype(np.float64)
        U = np.zeros((SIZE, SIZE)); V = np.zeros((SIZE, SIZE)); ok = np.zeros((SIZE, SIZE), bool)
        if picture == 0:
            u, v = atlas_to_head(xx[:HEAD_ROWS], yy[:HEAD_ROWS])
            U[:HEAD_ROWS], V[:HEAD_ROWS], ok[:HEAD_ROWS] = u, v, True
        for nm, ((u0, u1, v0, v1), (tx, ty, tw, th), pad, pic) in self.rects.items():
            if pic != picture:
                continue
            sl = (slice(ty, ty + th), slice(tx, tx + tw))
            sx, sy = (tw - 2 * pad) / max(u1 - u0, 1e-9), (th - 2 * pad) / max(v1 - v0, 1e-9)
            U[sl] = u0 + (xx[sl] + 0.5 - tx - pad) / sx
            V[sl] = v1 - (yy[sl] + 0.5 - ty - pad) / sy
            ok[sl] = True
        return U, V, ok


def sample_image(img, U, V, order=1):
    """Colour of a picture at original coordinates (u right, v up)."""
    h, w = img.shape[:2]
    rows, cols = (1.0 - V) * h - 0.5, U * w - 0.5
    return np.stack([ndi.map_coordinates(img[:, :, c], [rows, cols], order=order, mode='nearest') for c in range(img.shape[2])], -1)


def fractal(shape, rng, sigmas, weights):
    out = np.zeros(shape)
    for s, w in zip(sigmas, weights):
        f = ndi.gaussian_filter(rng.standard_normal(shape), s, mode='wrap')
        out += w * f / (f.std() + 1e-9)
    return out


def skin_relief(shape, rng, lum, smooth_mask, squeeze):
    """A height picture for the skin: pores, fine lines taken from the painted picture, and a little broader unevenness.
    smooth_mask (0..1) marks lips and eyelids, where pores are not wanted; squeeze is squeeze_map()."""
    white = rng.standard_normal(shape)
    pores = ndi.gaussian_filter(white, 0.7) - ndi.gaussian_filter(white, 1.5)        # dots about a millimetre apart
    pores = np.minimum(pores / (pores.std() + 1e-9), 0.5)                             # pits more than bumps
    fine = ndi.gaussian_filter(rng.standard_normal(shape), 2.2) - ndi.gaussian_filter(rng.standard_normal(shape), 5.0)
    fine /= fine.std() + 1e-9
    painted = lum - ndi.gaussian_filter(lum, 2.5)                                     # dark lines in the picture become grooves
    painted = np.clip(painted / (painted.std() + 1e-9), -3, 3)
    keep = np.clip((squeeze - M1) / (1 - M1), 0, 1)
    h = (0.60 * pores + 0.12 * fine) * (1 - 0.8 * smooth_mask) * (0.25 + 0.75 * keep) + 0.22 * painted * (0.3 + 0.7 * keep)
    h[HEAD_ROWS:] *= 0.5                                                              # the chest strip is seen from further away
    return h, pores


def height_to_normal(h, strength):
    """Tangent-space normal map (red: across, green: up the picture, blue: out) from a height picture."""
    gy, gx = np.gradient(h)
    nx, ny, nz = -gx * strength, gy * strength, np.ones_like(h)        # rows run downward, the normal map's green axis runs upward
    ln = np.sqrt(nx * nx + ny * ny + nz * nz)
    return np.clip(np.stack([nx / ln, ny / ln, nz / ln], -1) * 0.5 + 0.5, 0, 1)


def tone_match(lin, mask, target_lin, keep=0.25):
    """Bring the average skin colour inside `mask` to the target, channel by channel (linear light). `keep` leaves a
    little of the original colour balance, which keeps lips and shadows from going flat."""
    cur = np.array([np.median(lin[..., c][mask]) for c in range(3)])
    gain = np.asarray(target_lin) / np.maximum(cur, 1e-4)
    gain = gain ** (1 - keep) * (gain.mean()) ** keep
    return lin * gain, gain


def paint_from_card(albedo, pos_map, nrm_map, valid, card_tris, card_uv, card_img, tint, strength, reach):
    """Paint a hair card's picture (an eyebrow) onto the skin under it. Each skin pixel takes the colour and opacity of
    the nearest point of the card, provided that point lies over the pixel (along the skin's own normal), not beside it."""
    verts = card_tris.reshape(-1, 3)
    tree = BVHTree.FromPolygons([tuple(v) for v in verts], [(3 * i, 3 * i + 1, 3 * i + 2) for i in range(len(card_tris))])
    lo, hi = verts.min(0) - reach, verts.max(0) + reach
    near = valid & np.all((pos_map >= lo) & (pos_map <= hi), -1)
    ys, xs = np.nonzero(near)
    cov = np.zeros(albedo.shape[:2])
    rgb = np.zeros(albedo.shape)
    h, w = card_img.shape[:2]
    for y, x in zip(ys, xs):
        p = Vector(pos_map[y, x]); n = Vector(nrm_map[y, x])
        if n.length < 1e-6:
            continue
        n.normalize()
        loc, _, idx, dist = tree.find_nearest(p, reach)
        if loc is None:
            continue
        off = loc - p
        side = (off - n * off.dot(n)).length
        if side > 0.0012 + 0.25 * abs(off.dot(n)):       # the card is beside this pixel, not over it
            continue
        a, b, c = (Vector(v) for v in card_tris[idx])
        v0, v1, v2 = b - a, c - a, loc - a
        d00, d01, d11, d20, d21 = v0.dot(v0), v0.dot(v1), v1.dot(v1), v2.dot(v0), v2.dot(v1)
        den = d00 * d11 - d01 * d01
        if abs(den) < 1e-14:
            continue
        w1 = (d11 * d20 - d01 * d21) / den; w2 = (d00 * d21 - d01 * d20) / den; w0 = 1 - w1 - w2
        uv = w0 * card_uv[idx, 0] + w1 * card_uv[idx, 1] + w2 * card_uv[idx, 2]
        cx, cy = min(max(uv[0] * w - 0.5, 0), w - 1.001), min(max((1 - uv[1]) * h - 0.5, 0), h - 1.001)
        ix, iy = int(cx), int(cy); fx, fy = cx - ix, cy - iy
        px = (card_img[iy, ix] * (1 - fx) * (1 - fy) + card_img[iy, ix + 1] * fx * (1 - fy) + card_img[iy + 1, ix] * (1 - fx) * fy + card_img[iy + 1, ix + 1] * fx * fy)
        cov[y, x] = float(px[3])
        rgb[y, x] = px[:3]
    # the single hairs, over a soft darker ground: a brow is a mass of hair, not only its outermost strokes
    ground = np.clip(ndi.gaussian_filter(cov, 1.6) * 1.7, 0, 1) * 0.5
    al = np.clip(np.maximum(cov, ground) * strength, 0, 1)[..., None]
    out = albedo * (1 - al) + np.asarray(tint) * (0.75 + 0.5 * (albedo.mean(-1, keepdims=True) - 0.5)) * al
    return out, cov


def hair_cover(pos_map, nrm_map, where, tris, tri_uv, alpha_img, reach):
    """How much hair lies over each skin pixel: a ray is sent out along the skin's normal and the hair picture's opacity
    is read where it meets the hair mesh. Returned as 0..1, only inside `where`."""
    verts = tris.reshape(-1, 3)
    tree = BVHTree.FromPolygons([tuple(v) for v in verts], [(3 * i, 3 * i + 1, 3 * i + 2) for i in range(len(tris))])
    cov = np.zeros(pos_map.shape[:2])
    h, w = alpha_img.shape[:2]
    lo, hi = verts.min(0) - reach, verts.max(0) + reach
    ys, xs = np.nonzero(where & np.all((pos_map >= lo) & (pos_map <= hi), -1))
    for y, x in zip(ys, xs):
        n = Vector(nrm_map[y, x])
        if n.length < 1e-6:
            continue
        n.normalize()
        p = Vector(pos_map[y, x]) - n * 0.004
        best = 0.0
        for _ in range(3):                                   # up to three layers of hair above this spot
            loc, _, idx, dist = tree.ray_cast(p, n, reach)
            if loc is None:
                break
            a, b, c = (Vector(v) for v in tris[idx])
            v0, v1, v2 = b - a, c - a, loc - a
            d00, d01, d11, d20, d21 = v0.dot(v0), v0.dot(v1), v1.dot(v1), v2.dot(v0), v2.dot(v1)
            den = d00 * d11 - d01 * d01
            if abs(den) > 1e-14:
                w1 = (d11 * d20 - d01 * d21) / den; w2 = (d00 * d21 - d01 * d20) / den; w0 = 1 - w1 - w2
                uv = w0 * tri_uv[idx, 0] + w1 * tri_uv[idx, 1] + w2 * tri_uv[idx, 2]
                ix = int(min(max(uv[0] * w, 0), w - 1)); iy = int(min(max((1 - uv[1]) * h, 0), h - 1))
                best = max(best, float(alpha_img[iy, ix]))
            p = loc + n * 0.0015
        cov[y, x] = best
    return cov


def vertex_occlusion(P, N, verts_used, tris, reach, rng, rays=40):
    """How open to the surroundings each vertex is (1 = fully open, lower in the eye sockets, beside the nose, under
    the lip, inside the ear): rays are sent out over the hemisphere around the normal and the blocked share is counted.
    This soft shading is later painted into the skin colour, because the browser does not compute it."""
    tree = BVHTree.FromPolygons([tuple(v) for v in P], [tuple(int(i) for i in t) for t in tris])
    out = np.ones(len(P))
    # one fixed set of directions on the unit hemisphere (z up), cosine-weighted
    u1, u2 = rng.random(rays), rng.random(rays)
    r_, th = np.sqrt(u1), 2 * np.pi * u2
    local = np.stack([r_ * np.cos(th), r_ * np.sin(th), np.sqrt(1 - u1)], 1)
    for i in verts_used:
        n = N[i]
        t1 = np.cross(n, (1.0, 0.0, 0.0) if abs(n[0]) < 0.9 else (0.0, 1.0, 0.0)); t1 /= np.linalg.norm(t1) + 1e-12
        t2 = np.cross(n, t1)
        dirs = local[:, 0:1] * t1 + local[:, 1:2] * t2 + local[:, 2:3] * n
        o = Vector(P[i] + n * 0.0012)
        blocked = 0
        for d in dirs:
            if tree.ray_cast(o, Vector(d), reach)[0] is not None:
                blocked += 1
        out[i] = 1.0 - blocked / rays
    return out


def feathered(cover, rng, width_px, grain=(0.7, 1.7)):
    """Hair painted on skin must not end in a line. Given where hair grows (0..1, hard-edged), return its opacity: full
    inside, thinning out over about `width_px` toward the edge, and broken into single dots and short strokes as it thins
    (each pixel keeps its hair only while the local density is above that pixel's own random threshold)."""
    soft = ndi.gaussian_filter(np.asarray(cover, float), width_px / 2.5)
    g = fractal(soft.shape, rng, grain, (1.0, 0.7))
    rank = 0.5 * (1.0 + np.tanh(g / (1.2 * g.std() + 1e-9)))          # roughly even between 0 and 1
    return np.clip((soft * 1.3 - rank * 0.8) / 0.22, 0, 1)


def lash_line(pos_map, valid, root_points, reach):
    """A thin line along the lid margins, for painting lashes: 1 at the roots of the lash asset's hairs, falling to 0
    at `reach` from them. root_points are points sampled on the lash cards where they meet the lid."""
    from scipy.spatial import cKDTree
    out = np.zeros(pos_map.shape[:2])
    lo, hi = root_points.min(0) - reach, root_points.max(0) + reach
    ys, xs = np.nonzero(valid & np.all((pos_map >= lo) & (pos_map <= hi), -1))
    if len(ys):
        d = cKDTree(root_points).query(pos_map[ys, xs])[0]
        out[ys, xs] = np.clip(1.0 - d / reach, 0, 1) ** 1.5
    return out


def fill_outside(img, covered):
    """Carry the colours at the edge of the covered area outward, so that nothing foreign shows when the picture is filtered."""
    idx = ndi.distance_transform_edt(~covered, return_distances=False, return_indices=True)
    return img[idx[0], idx[1]]


def squeeze_map():
    """1 where the head layout keeps its scale (the face), falling to the squeeze factor around it. Used to tone down
    fine relief where it would otherwise be stretched."""
    yy, xx = np.mgrid[0:SIZE, 0:SIZE].astype(np.float64)
    dv = (xx + 0.5) / SIZE * 2 * V_HALF - V_HALF
    du = (yy + 0.5) / HEAD_ROWS * (U_LEFT + U_RIGHT) - U_LEFT
    g = np.hypot(du, dv)
    m = np.where(g <= R1 * 0.97, 1.0, M1)
    m[HEAD_ROWS:] = 1.0
    return ndi.gaussian_filter(m, 6.0)


def eye_picture(size, iris_rgb, seed, pupil=0.30, theta_iris=27.5, theta_lim=100.0, power=0.6, glint=0.0):
    """One eye, drawn from nothing: iris fibres, a dark rim, the pupil, a sclera that darkens and reddens toward its
    edge, and the shade of the upper lid. The eye mesh is mapped so that the distance from the middle of this picture is
    (angle from straight ahead / theta_lim) ** power, which gives the iris about half of the picture's width."""
    rng = np.random.default_rng(seed)
    yy, xx = np.mgrid[0:size, 0:size]
    dx, dy = (xx + 0.5) / size * 2 - 1, 1 - (yy + 0.5) / size * 2          # +y is the top of the eye
    r = np.hypot(dx, dy)
    theta = theta_lim * np.power(np.clip(r, 0, 1), 1 / power)
    phi = np.arctan2(dy, dx)
    t = theta / theta_iris                                                  # 0 at the middle, 1 at the rim of the iris
    # fibres: noise that is fine around the circle and long along the radius, made in (angle, radius) space
    na, nr = 720, 96
    streak = ndi.gaussian_filter(rng.standard_normal((nr, na)), (9, 1.3), mode='wrap') + 0.6 * ndi.gaussian_filter(rng.standard_normal((nr, na)), (20, 3.5), mode='wrap')
    streak /= streak.std() + 1e-9
    blot = ndi.gaussian_filter(rng.standard_normal((nr, na)), (5, 10), mode='wrap'); blot /= blot.std() + 1e-9
    ai = (phi + math.pi) / (2 * math.pi) * (na - 1)
    ri = np.clip(t, 0, 1) * (nr - 1)
    fib = ndi.map_coordinates(streak, [ri, ai], order=1, mode='wrap')
    spots = ndi.map_coordinates(blot, [ri, ai], order=1, mode='wrap')
    base = np.asarray(iris_rgb, float)
    lum = base.mean()
    inner = np.clip(base * 1.25 + np.array([0.10, 0.07, 0.01]) * (1.2 - lum), 0, 1)      # the ring round the pupil is warmer and lighter
    ring = np.exp(-((t - (pupil + 0.14)) / 0.13) ** 2)
    iris = base[None, None] * (1 - ring[..., None]) + inner[None, None] * ring[..., None]
    iris = iris * (1.0 + 0.30 * fib[..., None] + 0.10 * spots[..., None])
    iris = iris * (1.0 - 0.55 * np.clip((t - 0.72) / 0.28, 0, 1)[..., None] ** 1.5)       # darker toward the rim
    iris = iris * (0.80 + 0.20 * np.clip((t - pupil) / 0.25, 0, 1)[..., None])            # and next to the pupil
    furrow = 0.5 + 0.5 * np.cos((t - 0.62) * 60.0)
    iris = iris * (1.0 - 0.05 * furrow[..., None] * np.clip((t - 0.6) / 0.1, 0, 1)[..., None])
    pm = np.clip((pupil - t) / 0.05 + 0.5, 0, 1)
    pm = pm * pm * (3 - 2 * pm)
    iris = iris * (1 - pm[..., None]) + np.array([0.012, 0.010, 0.010]) * pm[..., None]
    # sclera
    vein_src = np.abs(ndi.gaussian_filter(rng.standard_normal((size, size)), 5.0))
    veins = np.clip(1 - vein_src / (0.35 * vein_src.std()), 0, 1) ** 2                    # thin wandering lines
    out_t = np.clip((theta - theta_iris) / (75 - theta_iris), 0, 1)
    sclera = np.array([0.80, 0.78, 0.76])[None, None] * (1 - 0.30 * out_t[..., None]) + np.array([0.10, -0.02, -0.04])[None, None] * out_t[..., None] ** 1.5
    sclera = sclera - veins[..., None] * np.array([0.02, 0.10, 0.10]) * (0.25 + 0.75 * out_t[..., None])
    limb = np.clip((t - 0.965) / 0.075, 0, 1)                                             # soft edge between iris and white
    limb = limb * limb * (3 - 2 * limb)
    img = iris * (1 - limb[..., None]) + sclera * limb[..., None]
    img = img * (1 - 0.25 * np.exp(-((t - 1.0) / 0.07) ** 2)[..., None])                 # the dark ring at the rim of the iris
    # shade of the upper lid and lashes: darker toward the top of the eye
    up = np.clip(theta * np.sin(phi) / theta_iris, -2.5, 2.5)
    img = img * (0.86 - 0.20 * np.clip(up, -1, 1.6))[..., None].clip(0.45, 1.0)
    if glint > 0:
        # The browser's room has no lamp to mirror in the eye, and an eye without a point of light looks painted. So the
        # reflection of a ceiling light is drawn in: a small bright spot high on the cornea and a fainter one below it.
        for cx, cy, rad, a in ((-0.28, 0.42, 0.105, glint), (0.16, 0.30, 0.05, 0.45 * glint)):
            dd = np.hypot(theta * np.cos(phi) / theta_iris - cx, theta * np.sin(phi) / theta_iris - cy) / rad
            spot = np.clip(1.25 - dd, 0, 1) ** 1.5
            img = img * (1 - a * spot[..., None]) + np.array([0.97, 0.98, 1.0]) * a * spot[..., None]
    return np.clip(img, 0, 1)
