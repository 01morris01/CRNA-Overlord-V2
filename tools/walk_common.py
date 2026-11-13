"""walk_common.py: the pieces the walking checks share (imported by tools/rooms_check.py).
The page questions (STATE, GRID, SLAB, SEE), the route planner, and a Walker that drives the ordinary keys and mouse.
Taken from tools/movement_check.py, which keeps its own copy and is unchanged; nothing here teleports the player."""
import math, time, heapq
import numpy as np
from scipy import ndimage as ndi
R = 0.24                                   # the walker's radius in the walking code
STATE = """(() => { const w = __ov.world, d = new (w.camera.position.constructor)(); w.camera.getWorldDirection(d); return { x: w.P.x, z: w.P.z, yaw: Math.atan2(d.x, d.z), pitch: Math.asin(Math.max(-1, Math.min(1, d.y))), room: w.room, enabled: w.enabled, first: w.firstPerson, speed: w.P.speed, eye: w.camera.position.toArray() }; })()"""
GRID = """([x0, z0, x1, z1, st]) => { const w = __ov.world, nx = Math.round((x1 - x0) / st), nz = Math.round((z1 - z0) / st); let s = ''; for (let k = 0; k < nz; k++) { let row = ''; for (let i = 0; i < nx; i++) row += w.free(x0 + (i + 0.5) * st, z0 + (k + 0.5) * st) ? '1' : '0'; s += row; } return { nx, nz, s }; }"""
# what is visible in a slab of the room, seen from straight above: nothing here asks the walking code anything
SLAB = """async ([x0, z0, x1, z1, px, lo, hi, soft]) => { const THREE = await import('three'), w = __ov.world, r = w.renderer, scene = w.scene, W = Math.round((x1 - x0) / px), H = Math.round((z1 - z0) / px);
  const cam = new THREE.OrthographicCamera(-(x1 - x0) / 2, (x1 - x0) / 2, (z1 - z0) / 2, -(z1 - z0) / 2, 0, hi - lo); cam.position.set((x0 + x1) / 2, hi, (z0 + z1) / 2); cam.up.set(0, 0, -1); cam.lookAt((x0 + x1) / 2, 0, (z0 + z1) / 2); cam.updateMatrixWorld(true);
  const rt = new THREE.WebGLRenderTarget(W, H), white = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }), hid = [], re = new RegExp(soft, 'i');
  scene.traverse((o) => { if (o.isMesh && o.visible && re.test(o.name + ' ' + ((o.material && o.material.name) || ''))) { o.visible = false; hid.push(o); } if ((o.isLine || o.isPoints || o.isSprite) && o.visible) { o.visible = false; hid.push(o); } });
  const keep = { bg: scene.background, om: scene.overrideMaterial, rt: r.getRenderTarget(), cc: r.getClearColor(new THREE.Color()), ca: r.getClearAlpha(), tm: r.toneMapping, sh: r.shadowMap.autoUpdate };
  scene.background = null; scene.overrideMaterial = white; r.setRenderTarget(rt); r.setClearColor(0x000000, 1); r.toneMapping = THREE.NoToneMapping; r.shadowMap.autoUpdate = false; r.clear(); r.render(scene, cam);
  const buf = new Uint8Array(W * H * 4); r.readRenderTargetPixels(rt, 0, 0, W, H, buf);
  scene.background = keep.bg; scene.overrideMaterial = keep.om; r.setRenderTarget(keep.rt); r.setClearColor(keep.cc, keep.ca); r.toneMapping = keep.tm; r.shadowMap.autoUpdate = keep.sh; for (const o of hid) o.visible = true; rt.dispose(); white.dispose();
  let s = ''; for (let k = 0; k < H; k++) { const row = H - 1 - k; let line = ''; for (let i = 0; i < W; i++) line += buf[(row * W + i) * 4] > 60 ? '1' : '0'; s += line; }      /* the picture's top row is the smallest z; rows are read bottom up */
  return { nx: W, nz: H, s }; }"""
# is a point in the room inside the clear part of the window, and is it the first visible thing along the line from the eye?
SEE = """async ([pts, tol]) => { const THREE = await import('three'), w = __ov.world, cam = w.camera, hud = document.getElementById('caseHud'), place = document.getElementById('wPlace'); cam.updateMatrixWorld(true);
  let L = 0, T = 0, Rr = innerWidth, Bb = innerHeight; for (const el of [hud, place]) { if (!el || el.hidden || !el.offsetParent) continue; const q = el.getBoundingClientRect(); if (q.width < 4) continue; if (q.height > innerHeight * 0.6 && q.left > innerWidth * 0.4) Rr = Math.min(Rr, q.left); else if (q.width > innerWidth * 0.8 && q.top > innerHeight * 0.3) Bb = Math.min(Bb, q.top); }
  const meshes = []; w.scene.traverseVisible((o) => { if (o.isMesh && o.material && o.material.opacity !== 0) meshes.push(o); }); const ray = new THREE.Raycaster(); const out = [];
  for (const p of pts) { const v = new THREE.Vector3(...p), s = v.clone().project(cam), sx = (s.x + 1) / 2 * innerWidth, sy = (1 - s.y) / 2 * innerHeight, dir = v.clone().sub(cam.position), dist = dir.length(); dir.normalize(); ray.set(cam.position, dir); ray.far = dist + 0.5; ray.near = 0.05;
    const hits = ray.intersectObjects(meshes, false).filter((h) => !(h.object.material.transparent && h.object.material.opacity < 0.5)); const h = hits[0];
    out.push({ sx: Math.round(sx), sy: Math.round(sy), inView: s.z < 1 && sx > L + 12 && sx < Rr - 12 && sy > T + 12 && sy < Bb - 12, clear: !h || h.distance > dist - tol, first: h ? [h.object.name || h.object.parent.name, +h.distance.toFixed(3)] : null, dist: +dist.toFixed(3) }); }
  return { clearRect: [L, T, Rr, Bb], out }; }"""

# what is drawn between two heights, from the triangles themselves: a wall face seen edge-on from above still marks the floor it stands on.
# This does not use the walking code's boxes; it reads the meshes the renderer draws.
TRIS = """([x0, z0, x1, z1, px, lo, hi, soft]) => { const w = __ov.world, W = Math.round((x1 - x0) / px), H = Math.round((z1 - z0) / px), g = new Uint8Array(W * H), re = new RegExp(soft, 'i'), V = w.camera.position.constructor, a = new V(), b = new V(), c = new V();
  const mark = (x, z) => { const i = Math.floor((x - x0) / px), k = Math.floor((z - z0) / px); if (i >= 0 && i < W && k >= 0 && k < H) g[k * W + i] = 1; };
  const seg = (p, q) => { const n = Math.max(1, Math.ceil(Math.hypot(q.x - p.x, q.z - p.z) / (px / 2))); for (let t = 0; t <= n; t++) mark(p.x + (q.x - p.x) * t / n, p.z + (q.z - p.z) * t / n); };
  const cut = (p, q, y) => { const t = (y - p.y) / (q.y - p.y); return new V(p.x + (q.x - p.x) * t, y, p.z + (q.z - p.z) * t); };
  w.scene.traverseVisible((o) => { if (!o.isMesh || o.isSkinnedMesh || o.isInstancedMesh || !o.geometry || !o.geometry.attributes.position || re.test(o.name + ' ' + ((o.material && o.material.name) || ''))) return; const m = o.material; if (m && (m.opacity === 0 || m.visible === false)) return;
    o.updateWorldMatrix(true, false); const P = o.geometry.attributes.position, I = o.geometry.index, n = I ? I.count : P.count;
    o.geometry.computeBoundingBox && (o.geometry.boundingBox || o.geometry.computeBoundingBox()); const B = o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld); if (B.max.y < lo || B.min.y > hi || B.max.x < x0 || B.min.x > x1 || B.max.z < z0 || B.min.z > z1) return;
    for (let t = 0; t + 2 < n; t += 3) { const ia = I ? I.getX(t) : t, ib = I ? I.getX(t + 1) : t + 1, ic = I ? I.getX(t + 2) : t + 2; a.fromBufferAttribute(P, ia).applyMatrix4(o.matrixWorld); b.fromBufferAttribute(P, ib).applyMatrix4(o.matrixWorld); c.fromBufferAttribute(P, ic).applyMatrix4(o.matrixWorld);
      const ys = [a.y, b.y, c.y]; if (Math.max(...ys) < lo || Math.min(...ys) > hi) continue;
      // the part of the triangle inside the band, as the segments where it crosses the band's edges and its own edges inside the band
      const pts = []; for (const [p, q] of [[a, b], [b, c], [c, a]]) { if (p.y >= lo && p.y <= hi) pts.push(p.clone()); for (const y of [lo, hi]) if ((p.y - y) * (q.y - y) < 0) pts.push(cut(p, q, y)); }
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) seg(pts[i], pts[j]); } });
  let s = ''; for (let i = 0; i < g.length; i++) s += g[i] ? '1' : '0'; return { nx: W, nz: H, s }; }"""

def ang(a): return math.atan2(math.sin(a), math.cos(a))

def to_grid(d): return np.frombuffer(d["s"].encode(), dtype=np.uint8).reshape(d["nz"], d["nx"]) == 49

def plan(free, clear, st, a, b, x0, z0):
    """The way from a to b over the free cells, keeping to the middle where there is a middle. Returns points in meters, or None."""
    nz, nx = free.shape; cell = lambda p: (min(nz - 1, max(0, int((p[1] - z0) / st))), min(nx - 1, max(0, int((p[0] - x0) / st))))
    def snap(c):
        if free[c]: return c
        best = None
        for dk in range(-8, 9):
            for di in range(-8, 9):
                q = (c[0] + dk, c[1] + di)
                if 0 <= q[0] < nz and 0 <= q[1] < nx and free[q] and (best is None or dk * dk + di * di < best[0]): best = (dk * dk + di * di, q)
        return best[1] if best else None
    s, g = snap(cell(a)), snap(cell(b))
    if s is None or g is None: return None
    cost = 1 + 0.5 / (0.06 + clear)                      # near things costs more than open floor
    dist = {s: 0.0}; prev = {}; pq = [(0.0, s)]; nb = [(-1, 0, 1), (1, 0, 1), (0, -1, 1), (0, 1, 1), (-1, -1, 1.4142), (-1, 1, 1.4142), (1, -1, 1.4142), (1, 1, 1.4142)]
    while pq:
        f, c = heapq.heappop(pq)
        if c == g: break
        dc = dist[c]
        if f - math.hypot(c[0] - g[0], c[1] - g[1]) > dc + 1e-9: continue
        for dk, di, wgt in nb:
            q = (c[0] + dk, c[1] + di)
            if not (0 <= q[0] < nz and 0 <= q[1] < nx) or not free[q]: continue
            if dk and di and not (free[c[0] + dk, c[1]] and free[c[0], c[1] + di]): continue
            nd = dc + wgt * cost[q]
            if nd < dist.get(q, 1e18): dist[q] = nd; prev[q] = c; heapq.heappush(pq, (nd + math.hypot(q[0] - g[0], q[1] - g[1]), q))
    if g not in dist: return None
    path = [g]
    while path[-1] != s: path.append(prev[path[-1]])
    path.reverse()
    def sees(p, q):                                    # a straight line with a little room either side
        n = int(max(abs(q[0] - p[0]), abs(q[1] - p[1])) * 2) + 1
        for i in range(n + 1):
            k = int(round(p[0] + (q[0] - p[0]) * i / n)); j = int(round(p[1] + (q[1] - p[1]) * i / n))
            if not free[k, j] or clear[k, j] < min(0.10, clear[p], clear[q]) - 1e-6: return False
        return True
    out = [path[0]]; i = 0
    while i < len(path) - 1:
        j = len(path) - 1
        while j > i + 1 and not sees(path[i], path[j]): j -= 1
        out.append(path[j]); i = j
    return [(x0 + (c[1] + 0.5) * st, z0 + (c[0] + 0.5) * st) for c in out]

class Walker:
    """Real keys only. st() reads where you are; go() plans on the floor map and walks it with the arrow keys and W."""
    def __init__(self, pg, bounds):
        self.pg, self.bounds, self.snags, self.trail = pg, bounds, [], []
    def st(self): return self.pg.evaluate(STATE)
    def turn_to(self, yaw, tol=0.05, timeout=6.0):
        pg = self.pg; held = None; t0 = time.time()
        while time.time() - t0 < timeout:
            e = ang(yaw - self.st()["yaw"])
            if abs(e) < tol: break
            want = "ArrowLeft" if e > 0 else "ArrowRight"
            if held != want:
                if held: pg.keyboard.up(held)
                pg.keyboard.down(want); held = want
            pg.wait_for_timeout(8 if abs(e) < 0.35 else 30)
        if held: pg.keyboard.up(held)
        return abs(ang(yaw - self.st()["yaw"]))
    def walk_to(self, x, z, near=0.3, label=""):
        pg = self.pg; s = self.st(); d = math.hypot(x - s["x"], z - s["z"])
        if d < near: return True
        self.turn_to(math.atan2(x - s["x"], z - s["z"]))
        pg.keyboard.down("KeyW"); held = None; t0 = time.time(); mark = (s["x"], s["z"], t0); ok = False
        try:
            while time.time() - t0 < d / 0.9 + 5:
                s = self.st(); self.trail.append((s["x"], s["z"])); dx, dz = x - s["x"], z - s["z"]; d = math.hypot(dx, dz)
                if d < near: ok = True; break
                e = ang(math.atan2(dx, dz) - s["yaw"])
                if abs(e) > 1.3: break
                want = None if abs(e) < 0.05 else ("ArrowLeft" if e > 0 else "ArrowRight")
                if want != held:
                    if held: pg.keyboard.up(held)
                    if want: pg.keyboard.down(want)
                    held = want
                now = time.time()
                if math.hypot(s["x"] - mark[0], s["z"] - mark[1]) > 0.1: mark = (s["x"], s["z"], now)
                elif now - mark[2] > 1.3: self.snags.append({"at": [round(s["x"], 2), round(s["z"], 2)], "toward": [round(x, 2), round(z, 2)], "on": label}); break
                pg.wait_for_timeout(16)
        finally:
            if held: pg.keyboard.up(held)
            pg.keyboard.up("KeyW")
        pg.wait_for_timeout(260)
        return ok
    def grid(self, a, b, fine=None):
        """A 4 cm map when both ends are inside `fine` (x0, z0, x1, z1), else 8 cm over the whole level."""
        inside = lambda q: fine and fine[0] <= q[0] <= fine[2] and fine[1] <= q[1] <= fine[3]
        (x0, z0, x1, z1), step = (tuple(fine), 0.04) if inside(a) and inside(b) else (tuple(self.bounds), 0.08)
        g = to_grid(self.pg.evaluate(GRID, [x0, z0, x1, z1, step])); return g, ndi.distance_transform_edt(g) * step, step, x0, z0
    def go(self, x, z, label, near=0.3, fine=None):
        for attempt in range(4):
            s = self.st(); g, cl, step, x0, z0 = self.grid((s["x"], s["z"]), (x, z), fine); path = plan(g, cl, step, (s["x"], s["z"]), (x, z), x0, z0)
            if path is None: return False
            done = True
            for i, (px, pz) in enumerate(path[1:]):
                last = i == len(path) - 2
                if not self.walk_to(px, pz, near if last else 0.34, label): done = False; break
            s = self.st()
            if done or math.hypot(x - s["x"], z - s["z"]) < near + 0.1: return True
        return False
    def moved(self, key, ms=550):
        pg = self.pg; s1 = self.st(); pg.keyboard.down(key); pg.wait_for_timeout(ms); pg.keyboard.up(key); pg.wait_for_timeout(300); s2 = self.st(); dx, dz = s2["x"] - s1["x"], s2["z"] - s1["z"]; f = (math.sin(s1["yaw"]), math.cos(s1["yaw"])); l = (math.cos(s1["yaw"]), -math.sin(s1["yaw"]))
        return {"fwd": dx * f[0] + dz * f[1], "left": dx * l[0] + dz * l[1], "dyaw": ang(s2["yaw"] - s1["yaw"])}
    def spin(self, key, ms=700):
        pg = self.pg; a = self.st(); pg.keyboard.down(key); pg.wait_for_timeout(ms); pg.keyboard.up(key); pg.wait_for_timeout(120); b = self.st()
        return ang(b["yaw"] - a["yaw"]), math.hypot(b["x"] - a["x"], b["z"] - a["z"])

def truth(pg, rect, soft="tube|hose|bag|cable|wire|cord|strap|circuit"):
    """Compare what stops you (the walking code's grid) with what you can see at body height (a render from above). 2 cm cells."""
    x0, z0, x1, z1 = rect; px = 0.02
    free = to_grid(pg.evaluate(GRID, [x0, z0, x1, z1, px]))
    low = to_grid(pg.evaluate(SLAB, [x0, z0, x1, z1, px, 0.07, 1.6, soft])) | to_grid(pg.evaluate(TRIS, [x0, z0, x1, z1, px, 0.07, 1.6, soft]))      # seen from above, or a drawn face standing in the band
    body = to_grid(pg.evaluate(SLAB, [x0, z0, x1, z1, px, 0.3, 1.5, soft])) | to_grid(pg.evaluate(TRIS, [x0, z0, x1, z1, px, 0.3, 1.5, soft]))
    d_low = ndi.distance_transform_edt(~low) * px; d_body = ndi.distance_transform_edt(~body) * px
    inner = np.zeros_like(free); m = int(0.3 / px); inner[m:-m, m:-m] = True
    nogo = ~free & inner; over = np.where(nogo, d_low - R, 0); bad_over = over > 0.10
    through = free & inner & (d_body < R - 0.10)
    return {"free": free, "px": px, "max_over": float(over.max()), "closed_m2": float(bad_over.sum()) * px * px, "through_m2": float(through.sum()) * px * px, "low": low, "body": body, "bad_over": bad_over, "through": through}

def widest_way(free, px, rect, a, b):
    """The narrowest gap between things on the widest way from a to b (meters, your own width included), or None."""
    x0, z0 = rect[0], rect[1]; clear = ndi.distance_transform_edt(free) * px
    def patch(q):
        ck, ci = int((q[1] - z0) / px), int((q[0] - x0) / px); rad = int(0.5 / px); kk, ii = np.ogrid[:free.shape[0], :free.shape[1]]; disc = free & ((kk - ck) ** 2 + (ii - ci) ** 2 <= rad * rad)
        if not disc.any(): return None
        lab, _ = ndi.label(disc); ks, is_ = np.nonzero(disc); n = np.argmin((ks - ck) ** 2 + (is_ - ci) ** 2); return lab == lab[ks[n], is_[n]]
    A, D = patch(a), patch(b)
    if A is None or D is None: return None
    lab, _ = ndi.label(free)
    if not ((set(np.unique(lab[A])) & set(np.unique(lab[D]))) - {0}): return None
    lo, hi = 0.0, 1.5
    for _i in range(12):
        mid = (lo + hi) / 2; lab, _ = ndi.label(clear >= mid)
        if (set(np.unique(lab[A])) & set(np.unique(lab[D]))) - {0}: lo = mid
        else: hi = mid
    return round(2 * (R + lo), 2)
