"""hands_pose.py: poses for the gloved hands, solved against simple stand-ins of the objects they hold.

Each pose is written once in LEFT-hand terms (hand frame: wrist at the origin, -Z toward the fingertips, +Y out of the back of
the hand, thumb on +X) and mirrored for the right hand (x -> -x). A finger is curled about its own joint axes until any part
of it would enter the object (a capsule test against a cylinder, ellipsoid or box), so fingers rest on the surface instead of
being guessed; the thumb's base angles are searched so its pad lands on a target point when one is given.

Joint motions (degrees), per finger n in 2..5 (index..little): mcp, pip, dip flexion (+ curls toward the palm) and spread
(+ toward the thumb); thumb: swing (+ across the palm, opposition), abd (+ away from the index in the palm plane), roll
(+ turns the pad toward the fingers), mcp, ip; wrist: flex (+ palmar), dev (+ toward the thumb)."""
import bpy, math
from mathutils import Matrix, Vector, Quaternion

RADIUS = {1: 0.0092, 2: 0.0085, 3: 0.0088, 4: 0.0083, 5: 0.0072}       # finger half-thickness incl. glove (m)
CHAIN = {n: ['finger%d-%d' % (n, j) for j in (1, 2, 3)] for n in range(1, 6)}
LAST = {1: 'finger1-3', 2: 'finger2-3', 3: 'finger3-3', 4: 'finger4-3', 5: 'finger5-3'}


class Hand:
    def __init__(self, ao, side):
        self.ao, self.side, self.s = ao, side, (1.0 if side == 'L' else -1.0)
        self.rest = {b.name[:-2]: b.matrix_local.to_3x3() for b in ao.data.bones}
        self.dirs = {b.name[:-2]: (b.tail_local - b.head_local).normalized() for b in ao.data.bones}
        for pb in ao.pose.bones: pb.rotation_mode = 'QUATERNION'
        self.q = {}

    def m(self, v):
        """Mirror a left-hand vector for this hand."""
        return Vector((v[0] * self.s, v[1], v[2]))

    def pb(self, n): return self.ao.pose.bones[n + '.' + self.side]

    def flex_axis(self, n):
        d = self.dirs[n]; a = Vector((0, 1, 0)).cross(d)
        if n.startswith('finger1'):          # the thumb bends about its own (MakeHuman) local Z, signed to curl toward the palm
            z = self.rest[n] @ Vector((0, 0, 1)); a = z if z.dot(a) >= 0 else -z
        return a.normalized()

    def rot(self, n, axis_arm, deg):
        """Add a rotation about an armature-space (rest) axis to bone n."""
        B = self.rest[n]; loc = (B.inverted() @ Vector(axis_arm)).normalized()
        self.q[n] = self.q.get(n, Quaternion()) @ Quaternion(loc, math.radians(deg))

    def clear(self):
        self.q = {}
        for pb in self.ao.pose.bones: pb.rotation_quaternion = Quaternion()

    def apply(self):
        for pb in self.ao.pose.bones: pb.rotation_quaternion = Quaternion()
        for n, q in self.q.items(): self.pb(n).rotation_quaternion = q
        bpy.context.view_layer.update()

    # ---- setting a pose from numbers
    def set_finger(self, n, mcp=0, pip=0, dip=0, spread=0):
        c = CHAIN[n]
        for k in c: self.q.pop(k, None)
        if spread: self.rot(c[0], (0, -self.s, 0), spread * (1 if n == 2 else -1 if n in (4, 5) else 0.3))
        self.rot(c[0], self.flex_axis(c[0]), mcp); self.rot(c[1], self.flex_axis(c[1]), pip); self.rot(c[2], self.flex_axis(c[2]), dip)

    def set_thumb(self, swing=0, abd=0, roll=0, mcp=0, ip=0):
        for k in CHAIN[1]: self.q.pop(k, None)
        self.rot('finger1-1', (0, 0, -self.s), swing); self.rot('finger1-1', (0, -self.s, 0), abd)
        self.rot('finger1-1', self.dirs['finger1-1'], roll * self.s)
        self.rot('finger1-2', self.flex_axis('finger1-2'), mcp); self.rot('finger1-3', self.flex_axis('finger1-3'), ip)

    def set_wrist(self, flex=0, dev=0):
        self.q.pop('wrist', None)
        if flex: self.rot('wrist', (-1, 0, 0), flex)
        if dev: self.rot('wrist', (0, -self.s, 0), dev)

    # ---- where things are, posed (armature space = hand frame)
    def seg_points(self, n, k=4):
        pts = []
        for b in CHAIN[n]:
            pb = self.pb(b); h, t = pb.head, pb.tail
            for i in range(1, k + 1): pts.append(h.lerp(t, i / k))
        return pts

    def pad(self, n):
        """The finger pad: just short of the tip, on the palm side of the distal phalanx."""
        pb = self.pb(LAST[n]); d = (pb.tail - pb.head).normalized()
        a = (pb.matrix.to_3x3() @ (self.rest[LAST[n]].inverted() @ self.flex_axis(LAST[n]))).normalized()
        palmar = a.cross(d).normalized()
        return pb.tail - d * 0.006 + palmar * RADIUS[n] * 0.75

    # ---- solving against a stand-in shape
    def curl_to(self, n, shape, maxes, base=(0, 0, 0), spread=0, iters=14, extra=None):
        """Curl finger n from base toward base + maxes until it touches `shape`; returns the fraction used."""
        def ok(t):
            self.set_finger(n, *(b + t * m for b, m in zip(base, maxes)), spread=spread); self.apply()
            pts = self.seg_points(n)
            return min(sdf(shape, p) for p in pts) >= RADIUS[n] and (extra is None or all(sdf(extra, p) >= RADIUS[n] for p in pts))
        lo, hi = 0.0, 1.0
        if ok(1.0): return 1.0
        if not ok(0.0): self.set_finger(n, *base, spread=spread); self.apply(); return 0.0
        for _ in range(iters):
            mid = (lo + hi) / 2
            if ok(mid): lo = mid
            else: hi = mid
        ok(lo); return lo

    def wrap_to(self, n, shape, maxes, base=(0, 0, 0), spread=0, iters=12):
        """Curl one joint at a time (MCP, then PIP, then DIP), each until its segment touches `shape`: a finger wraps round a
        large object instead of stopping at the first touch near the knuckle."""
        ang = list(base)
        for j in range(3):
            def ok(a):
                trial = list(ang); trial[j] = a
                if n == 1: self.set_thumb(self._sw, self._ab, self._ro, trial[0], trial[1])
                else: self.set_finger(n, *trial, spread=spread)
                self.apply(); pts = self.seg_points(n)
                return min(sdf(shape, p) for p in pts) >= RADIUS[n]
            if n == 1 and j == 2: break
            lo, hi = ang[j], ang[j] + maxes[j]
            if ok(hi): ang[j] = hi; continue
            if not ok(lo): continue
            for _ in range(iters):
                mid = (lo + hi) / 2
                if ok(mid): lo = mid
                else: hi = mid
            ang[j] = lo
        if n == 1: self.set_thumb(self._sw, self._ab, self._ro, ang[0], ang[1])
        else: self.set_finger(n, *ang, spread=spread)
        self.apply(); return ang

    def thumb_base(self, swing, abd, roll):
        self._sw, self._ab, self._ro = swing, abd, roll

    def thumb_to(self, target, shape=None, swing=(0, 90), abd=(-30, 40), roll=0, mcp=(0, 50), ip=(0, 60), steps=7):
        """Search the thumb's base angles so its pad lands on `target` (hand frame) without entering `shape`."""
        best = None
        def run(sw, ab, mc, i_):
            self.set_thumb(sw, ab, roll, mc, i_); self.apply(); p = self.pad(1); d = (p - Vector(target)).length
            if shape is not None:
                pen = min(sdf(shape, q) for q in self.seg_points(1)) - RADIUS[1]
                if pen < -0.001: d += -pen * 4
            return d
        rng = lambda a, k: [a[0] + (a[1] - a[0]) * i / (k - 1) for i in range(k)]
        for sw in rng(swing, steps):
            for ab in rng(abd, steps):
                for mc in rng(mcp, 4):
                    for i_ in rng(ip, 4):
                        d = run(sw, ab, mc, i_)
                        if best is None or d < best[0]: best = (d, sw, ab, mc, i_)
        # refine around the best
        d0, sw, ab, mc, i_ = best; step = [(swing[1] - swing[0]) / steps, (abd[1] - abd[0]) / steps, (mcp[1] - mcp[0]) / 4, (ip[1] - ip[0]) / 4]
        cur = [sw, ab, mc, i_]
        for _ in range(4):
            for k in range(4):
                for sgn in (-1, 1):
                    trial = list(cur); trial[k] += sgn * step[k] / 2; d = run(*trial)
                    if d < d0: d0, cur = d, trial
            step = [x / 2 for x in step]
        run(*cur); return d0, cur


def sdf(shape, p):
    """Signed distance from p to a stand-in shape (hand frame)."""
    p = Vector(p); k = shape['type']
    if k == 'cyl':
        c, a, r = Vector(shape['p']), Vector(shape['axis']).normalized(), shape['r']; v = p - c
        return (v - a * v.dot(a)).length - r
    if k == 'ell':
        c, R = Vector(shape['p']), shape['r']; M = shape.get('rot', Matrix.Identity(3)); v = M.transposed() @ (p - c)
        q = Vector((v.x / R[0], v.y / R[1], v.z / R[2])); L = q.length
        return (L - 1.0) * min(R) if L > 0 else -min(R)
    if k == 'box':
        c, h = Vector(shape['p']), Vector(shape['half']); M = shape.get('rot', Matrix.Identity(3)); v = M.transposed() @ (p - c)
        q = Vector((abs(v.x) - h.x, abs(v.y) - h.y, abs(v.z) - h.z)); r = shape.get('round', 0.0)
        out = Vector((max(q.x, 0), max(q.y, 0), max(q.z, 0))).length; return out + min(max(q.x, q.y, q.z), 0) - r
    if k == 'union':
        return min(sdf(s, p) for s in shape['shapes'])
    raise KeyError(k)


def frame(origin, z, y):
    """A 4x4 frame (hand space) with +Z along z and +Y as close to y as possible."""
    z = Vector(z).normalized(); y = Vector(y); y = (y - z * y.dot(z)).normalized(); x = y.cross(z)
    M = Matrix((x, y, z)).transposed().to_4x4(); M.translation = Vector(origin); return M
