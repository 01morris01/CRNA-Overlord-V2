"""support_lib.py: the authored supports for the hero patient (no open model of a bariatric foam ramp, a foam head
support or a hospital pillow with a sewn edge was found): plain meshes with real thickness, rounded edges and texture
coordinates, built from numpy and dented later where the body lies. Lying frame (+Z up, head +Y)."""
import math
import numpy as np


def pillow(cx, cy, z0, sx, sy, thick, n=(40, 30), p=3.5, welt=0.004, crown=1.0):
    """A sewn pillow lying on z0: plan size sx by sy, full thickness `thick` at its middle, thinning to the seam
    (superellipse profile of power p) with a small welt along the seam. Returns V, F (quads), UV (per vertex)."""
    nu, nv = n
    us = np.linspace(-1, 1, nu); vs = np.linspace(-1, 1, nv)
    U, Vv = np.meshgrid(us, vs, indexing='ij')
    prof = np.clip(1 - np.abs(U) ** p, 0, 1) ** (1 / p) * np.clip(1 - np.abs(Vv) ** p, 0, 1) ** (1 / p)
    prof = prof ** (0.6 * crown)
    x = cx + U * sx / 2; y = cy + Vv * sy / 2
    # pull the rim in a little so the edges round over (a stuffed case, not a box)
    rim = 1 - prof
    x = cx + (x - cx) * (1 - 0.04 * rim); y = cy + (y - cy) * (1 - 0.05 * rim)
    zmid = z0 + thick / 2
    top = np.stack([x, y, zmid + thick / 2 * prof + welt * (rim > 0.97)], -1)
    bot = np.stack([x, y, zmid - thick / 2 * prof - welt * (rim > 0.97)], -1)
    bot[..., 2] = np.maximum(bot[..., 2], z0)
    V = np.concatenate([top.reshape(-1, 3), bot.reshape(-1, 3)])
    idx = lambda i, j, s: s * nu * nv + i * nv + j
    F = []
    for i in range(nu - 1):
        for j in range(nv - 1):
            F.append([idx(i, j, 0), idx(i + 1, j, 0), idx(i + 1, j + 1, 0), idx(i, j + 1, 0)])
            F.append([idx(i, j, 1), idx(i, j + 1, 1), idx(i + 1, j + 1, 1), idx(i + 1, j, 1)])
    # stitch the rim (top and bottom share the outermost ring: weld by merging later, here just join the edges)
    ring = [(i, 0) for i in range(nu)] + [(nu - 1, j) for j in range(1, nv)] + [(i, nv - 1) for i in range(nu - 2, -1, -1)] + [(0, j) for j in range(nv - 2, 0, -1)]
    for k in range(len(ring)):
        a, b = ring[k], ring[(k + 1) % len(ring)]
        F.append([idx(*a, 0), idx(*a, 1), idx(*b, 1), idx(*b, 0)])
    UV = np.concatenate([np.stack([(x - cx) / 0.29 + 0.5, (y - cy) / 0.28 + 0.5], -1).reshape(-1, 2)] * 2)     # 29 x 28 cm per weave tile
    return V, np.array(F), UV


def foam_profile_solid(profile_yz, x_half, n_x=16, r_edge=0.012):
    """A foam block: a closed profile in the y-z plane (counter-clockwise polygon, already rounded where wanted),
    extruded across x from -x_half to x_half, with the side edges rounded by r_edge (the cover's seam). Returns V, F, UV."""
    prof = np.asarray(profile_yz, float)
    area = 0.5 * np.sum(prof[:, 0] * np.roll(prof[:, 1], -1) - np.roll(prof[:, 0], -1) * prof[:, 1])
    if area < 0:                                          # make the profile counter-clockwise so the faces point outward
        prof = prof[::-1].copy()
    m = len(prof)
    th = np.linspace(0, np.pi / 2, 6)
    left = -x_half + r_edge * (1 - np.sin(th))[::-1] * 0 + (-x_half + r_edge - r_edge * np.cos(th)) - (-x_half)
    left = -x_half + r_edge * (1 - np.cos(th))
    mid = np.linspace(-x_half + r_edge, x_half - r_edge, n_x)
    xs = np.concatenate([left, mid, -left[::-1]])
    xs = np.unique(np.round(xs, 6))
    c = prof.mean(0)
    rings = []
    for x in xs:
        # near the ends the profile is shrunk toward its middle (rounded edges of the cover)
        dist_end = x_half - abs(x)
        k = 1.0 if dist_end >= r_edge else math.sqrt(max(0.0, 1 - ((r_edge - dist_end) / r_edge) ** 2))
        shrink = (1 - k) * r_edge
        pr = c + (prof - c) * (1 - shrink / max(np.linalg.norm(prof - c, axis=1).mean(), 1e-6))
        rings.append(np.c_[np.full(m, x), pr])
    V = np.concatenate(rings)
    F = []
    for i in range(len(xs) - 1):
        for j in range(m):
            a = i * m + j; b = i * m + (j + 1) % m
            F.append([a, b, b + m, a + m])
    # end caps (fans)
    for i, flip in ((0, True), (len(xs) - 1, False)):
        ci = len(V); V = np.vstack([V, np.r_[xs[i], c]])
        for j in range(m):
            a = i * m + j; b = i * m + (j + 1) % m
            F.append([b, a, ci, ci] if flip else [a, b, ci, ci])
    per = np.r_[0, np.cumsum(np.linalg.norm(np.diff(np.vstack([prof, prof[:1]]), axis=0), axis=1))][:m]
    UV = np.concatenate([np.stack([np.full(m, x / 0.3), per / 0.3], 1) for x in xs] + [np.array([[0.5, 0.5]]), np.array([[0.5, 0.5]])])
    return V, np.array(F), UV


def rounded_polygon(pts, r, n=5):
    """Round the corners of a closed 2D polygon with arcs of radius r (n points per corner)."""
    pts = np.asarray(pts, float); out = []
    m = len(pts)
    for i in range(m):
        p0, p1, p2 = pts[i - 1], pts[i], pts[(i + 1) % m]
        a = p0 - p1; b = p2 - p1
        la, lb = np.linalg.norm(a), np.linalg.norm(b)
        a /= la; b /= lb
        ang = math.acos(np.clip(np.dot(a, b), -1, 1))
        t = min(r / math.tan(ang / 2), 0.45 * la, 0.45 * lb)
        s, e = p1 + a * t, p1 + b * t
        for k in range(n):
            u = k / (n - 1)
            q = (1 - u) ** 2 * s + 2 * (1 - u) * u * p1 + u ** 2 * e          # quadratic Bezier corner
            out.append(q)
    return np.array(out)
