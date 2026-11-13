"""movement_check.py: can you get about the building and the operating room with the ordinary controls?
     uv run --with playwright --with numpy --with scipy --with pillow python3 tools/movement_check.py OUT_DIR tools/test-account.example.json [PORT] [--video]
   Needs the dev server:  python3 tools/dev_server.py 8091

Three kinds of evidence, kept apart in the report:

  1. WHAT STOPS YOU IS WHAT YOU SEE.  The page is asked two independent questions about each clinical room and the answers are compared.
     One is the walking code's own: "may my center be here?" on a 2 cm grid. The other never touches the walking code: the renderer draws the
     room from straight above, cut to a slab at body height, with every material replaced by flat white, so a white pixel is something you
     can see there. A place you cannot stand that is further than your own width from anything visible is an invisible or oversized
     collider; a place you can stand inside something visible at body height is a thing you walk through.

  2. THE WAYS ROUND.  From the same grid: is every working position joined to the door, and how wide is the narrowest gap on the way.

  3. REAL KEYS AND MOUSE.  Nothing is teleported. Starting where a new student starts, outside the front door, the keyboard walks to the
     operating room, turns on the spot both ways and right round, backs up, steps sideways, looks with the mouse while walking, goes to the
     front of the anesthesia machine, round all four sides of the table, and out through the door. It then opens and leaves the schedule
     station in pre-op and a bedside panel, and walks away from each. Routes are planned on the floor map and then driven with the arrow
     keys and W, so a snag is recorded where it happens instead of being steered round by the script.

Sightlines are checked from the five places the case panel offers: the thing you went to look at has to be inside the clear part of the
window and the first thing a ray from your eye meets.

This checks movement, collision and sightlines. It does not judge how the room looks."""
import sys, json, os, math, time, heapq, base64, io
import numpy as np
from scipy import ndimage as ndi
from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright

OUT = sys.argv[1]; ACC = json.load(open(sys.argv[2])); PORT = next((a for a in sys.argv[3:] if a.isdigit()), "8091"); VIDEO = "--video" in sys.argv
B = f"http://127.0.0.1:{PORT}/world/"; os.makedirs(OUT, exist_ok=True)
R = 0.24                                   # the walker's radius in the walking code
results = []; notes = {}
def check(name, ok, detail=""):
    results.append({"check": name, "ok": bool(ok), "detail": detail}); print(("  ok   " if ok else "  FAIL ") + name + (" :: " + str(detail) if detail else ""), flush=True)

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

with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", args=["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"])
    ctx = b.new_context(viewport={"width": 1440, "height": 810}, device_scale_factor=1, service_workers="block", **({"record_video_dir": OUT, "record_video_size": {"width": 1440, "height": 810}} if VIDEO else {})); pg = ctx.new_page(); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)[:300]))
    # test setup: the throwaway account, a fresh save (so the walk starts where a new student starts), sound off
    pg.goto(B + "blank.html"); pg.evaluate("""async ([u, p]) => { const a = await import('/core/auth.js'); let r = await a.loginUser(u, p); if (!r.success) { await a.registerUser(u, p); r = await a.loginUser(u, p); }
      const s = await import('/world/js/save.js'); localStorage.removeItem(s.key()); const st = s.load(); st.character = { name: 'Tester', person: 'tunic', colour: 'ceil' }; s.save(st); localStorage.setItem('overlord_world_mute', '1'); }""", [ACC["username"], ACC["password"]])
    pg.goto(B); pg.wait_for_function("window.__ov && __ov.world && __ov.periop && document.getElementById('veil').classList.contains('off')", timeout=180000); pg.wait_for_function("__ov.exhibits && __ov.exhibits.hasClinical", timeout=120000); pg.evaluate("__ov.periop.ready"); pg.wait_for_timeout(2500)
    LV = pg.evaluate("({ rooms: __ov.world.level.rooms, bounds: __ov.world.level.bounds, st: __ov.world.level.stations })"); ROOMS = LV["rooms"]
    st = lambda: pg.evaluate(STATE)
    snags = []; trail = []; shots = [0]
    def shot(name): shots[0] += 1; pg.wait_for_timeout(350); pg.screenshot(path=f"{OUT}/{shots[0]:02d}-{name}.jpg", type="jpeg", quality=88)

    # ---------------------------------------------------------------- the keyboard
    def turn_to(yaw, tol=0.05, timeout=6.0):
        held = None; t0 = time.time()
        while time.time() - t0 < timeout:
            e = ang(yaw - st()["yaw"])
            if abs(e) < tol: break
            want = "ArrowLeft" if e > 0 else "ArrowRight"
            if held != want:
                if held: pg.keyboard.up(held)
                pg.keyboard.down(want); held = want
            pg.wait_for_timeout(8 if abs(e) < 0.35 else 30)
        if held: pg.keyboard.up(held)
        return abs(ang(yaw - st()["yaw"]))
    def walk_to(x, z, near=0.3, label=""):
        s = st(); d = math.hypot(x - s["x"], z - s["z"])
        if d < near: return True
        turn_to(math.atan2(x - s["x"], z - s["z"]))
        pg.keyboard.down("KeyW"); held = None; t0 = time.time(); mark = (s["x"], s["z"], t0); ok = False
        try:
            while time.time() - t0 < d / 0.9 + 5:
                s = st(); trail.append((s["x"], s["z"])); dx, dz = x - s["x"], z - s["z"]; d = math.hypot(dx, dz)
                if d < near: ok = True; break
                e = ang(math.atan2(dx, dz) - s["yaw"])
                if abs(e) > 1.3: break                                   # gone past: stop and aim again
                want = None if abs(e) < 0.05 else ("ArrowLeft" if e > 0 else "ArrowRight")
                if want != held:
                    if held: pg.keyboard.up(held)
                    if want: pg.keyboard.down(want)
                    held = want
                now = time.time()
                if math.hypot(s["x"] - mark[0], s["z"] - mark[1]) > 0.1: mark = (s["x"], s["z"], now)
                elif now - mark[2] > 1.3: snags.append({"at": [round(s["x"], 2), round(s["z"], 2)], "toward": [round(x, 2), round(z, 2)], "on": label}); break
                pg.wait_for_timeout(16)
        finally:
            if held: pg.keyboard.up(held)
            pg.keyboard.up("KeyW")
        pg.wait_for_timeout(260)
        return ok
    def big_grid(a, bq):
        o = ROOMS["or"]; near_or = lambda q: o["x0"] - 3.0 <= q[0] <= o["x1"] + 0.3 and o["z0"] - 0.3 <= q[1] <= o["z1"] + 0.3
        (x0, z0, x1, z1), step = ((o["x0"] - 3.0, o["z0"] - 0.3, o["x1"] + 0.3, o["z1"] + 0.3), 0.04) if near_or(a) and near_or(bq) else (LV["bounds"], 0.08)      # a 4 cm map in and around the operating room, 8 cm for the long walk
        g = to_grid(pg.evaluate(GRID, [x0, z0, x1, z1, step])); return g, ndi.distance_transform_edt(g) * step, step, x0, z0
    def go(x, z, label, near=0.3):
        """Plan on the floor map, then walk it with the keys. Re-plans at most three times; every stall is recorded."""
        for attempt in range(4):
            s = st(); g, cl, step, x0, z0 = big_grid((s["x"], s["z"]), (x, z)); path = plan(g, cl, step, (s["x"], s["z"]), (x, z), x0, z0)
            if path is None: return False
            done = True
            for i, (px, pz) in enumerate(path[1:]):
                last = i == len(path) - 2
                if not walk_to(px, pz, near if last else 0.34, label): done = False; break
            s = st()
            if done or math.hypot(x - s["x"], z - s["z"]) < near + 0.1: return True
        return False

    # ---------------------------------------------------------------- 3a. from the front door to the operating room, on foot
    s0 = st(); notes["start"] = {k: (round(v, 2) if isinstance(v, float) else v) for k, v in s0.items() if k != "eye"}
    check("the walk starts outside the building with the controls live", s0["enabled"] and s0["room"] in ("forecourt", "arrival"), f"{s0['room']} at ({s0['x']:.1f}, {s0['z']:.1f})")
    OR = ROOMS["or"]; door = LV["st"]["or"]["at"]; t0 = time.time()
    ok = go(door[0] - 2.4, door[1], "forecourt to the corridor outside the operating room"); s = st()
    check("walked from the front door to the corridor outside the operating room with the keyboard", ok and s["room"] == "court", f"{time.time() - t0:.0f} s, now in {s['room']} at ({s['x']:.1f}, {s['z']:.1f}); stalls so far {len(snags)}")
    shot("outside-the-operating-room")
    ok = go(door[0] - 0.3, door[1], "through the operating room door"); s = st()
    check("walked in through the operating room doorway", ok and s["room"] == "or", f"in {s['room']} at ({s['x']:.2f}, {s['z']:.2f}); through your own eyes: {s['first']}")
    shot("just-inside")

    # ---------------------------------------------------------------- 1. what stops you is what you see (asked while standing in the room, so everything in it is drawn)
    def room_truth(name, rect, tag):
        x0, z0, x1, z1 = rect; px = 0.02
        free = to_grid(pg.evaluate(GRID, [x0, z0, x1, z1, px])); low = to_grid(pg.evaluate(SLAB, [x0, z0, x1, z1, px, 0.07, 1.6, "tube|hose|bag|cable|wire|cord|strap|circuit"])); body = to_grid(pg.evaluate(SLAB, [x0, z0, x1, z1, px, 0.3, 1.5, "tube|hose|bag|cable|wire|cord|strap|circuit"]))
        d_low = ndi.distance_transform_edt(~low) * px; d_body = ndi.distance_transform_edt(~body) * px
        inner = np.zeros_like(free); m = int(0.3 / px); inner[m:-m, m:-m] = True
        nogo = ~free & inner; over = np.where(nogo, d_low - R, 0); bad_over = over > 0.10
        through = free & inner & (d_body < R - 0.10)
        img = np.zeros(free.shape + (3,), dtype=np.uint8); img[:] = (244, 241, 234); img[~free] = (246, 200, 185); img[low] = (150, 156, 160); img[body] = (60, 44, 44); img[bad_over] = (255, 0, 200); img[through] = (0, 120, 255)
        Image.fromarray(img).resize((free.shape[1] * 2, free.shape[0] * 2), Image.NEAREST).save(f"{OUT}/truth-{tag}.png")
        a_over = float(bad_over.sum()) * px * px; a_thr = float(through.sum()) * px * px
        check(f"{name}: nothing stops you that you cannot see", a_over < 0.02, f"largest reach of a no-go area beyond anything visible: {float(over.max()):.2f} m (cells are 4 cm); floor wrongly closed: {a_over:.3f} m2")
        check(f"{name}: nothing visible at body height can be walked through", a_thr < 0.02, f"floor where you could stand inside something visible: {a_thr:.3f} m2")
        notes[f"truth_{tag}"] = {"max_overreach_m": round(float(over.max()), 3), "closed_without_cause_m2": round(a_over, 4), "walk_through_m2": round(a_thr, 4), "free_floor_m2": round(float((free & inner).sum()) * px * px, 2), "picture": f"truth-{tag}.png"}
        return free, px
    rect = [OR["x0"] - 0.6, OR["z0"] - 0.3, OR["x1"] + 0.3, OR["z1"] + 0.3]
    free, px = room_truth("operating room, empty table", rect, "or-empty")

    # ---------------------------------------------------------------- 2. the ways round
    T = pg.evaluate("__ov.periop.table.toArray()"); M = pg.evaluate("(() => { const m = __ov.exhibits.clinical.pieces.eq_anesthesia_machine, V = __ov.world.camera.position.constructor; m.updateMatrixWorld(true); return { front: m.localToWorld(new V(0.3, 0, 1.02)).toArray(), top: m.localToWorld(new V(0.3, 1.02, 0.12)).toArray() }; })()")
    PLACES = {"head of the bed": (T[0], T[2] - 1.26), "front of the anesthesia machine": (M["front"][0], M["front"][2]), "patient's right side": (T[0] - 0.82, T[2] - 0.05), "foot of the table": (T[0], T[2] + 1.45), "patient's left side": (T[0] + 0.82, T[2] - 0.05), "the door": (door[0] - 0.5, door[1])}
    def ways(free, px, rect, tag):
        """How wide is the narrowest gap between things on the widest way from the door to each working position?
        The last half meter at either end is left out: you stand close to the table on purpose."""
        x0, z0 = rect[0], rect[1]; clear = ndi.distance_transform_edt(free) * px; out = {}
        def patch(q):
            ck, ci = int((q[1] - z0) / px), int((q[0] - x0) / px); rad = int(0.5 / px); kk, ii = np.ogrid[:free.shape[0], :free.shape[1]]; disc = free & ((kk - ck) ** 2 + (ii - ci) ** 2 <= rad * rad)
            if not disc.any(): return None
            lab, _ = ndi.label(disc); ks, is_ = np.nonzero(disc); n = np.argmin((ks - ck) ** 2 + (is_ - ci) ** 2); return lab == lab[ks[n], is_[n]]
        masks = {name: patch(q) for name, q in PLACES.items()}; D = masks["the door"]
        for name, A in masks.items():
            if name == "the door": continue
            if A is None or D is None: out[name] = None; continue
            lab, _ = ndi.label(free)
            if not ((set(np.unique(lab[A])) & set(np.unique(lab[D]))) - {0}): out[name] = None; continue
            lo, hi = 0.0, 1.5
            for _i in range(12):
                mid = (lo + hi) / 2; lab, _ = ndi.label(clear >= mid)
                if (set(np.unique(lab[A])) & set(np.unique(lab[D]))) - {0}: lo = mid
                else: hi = mid
            out[name] = round(2 * (R + lo), 2)
        notes[f"ways_{tag}"] = out
        for name, wdt in out.items(): check(f"{tag}: the door is joined to the {name}", wdt is not None and wdt >= 0.7, "narrowest gap between things on the way: " + (f"{wdt:.2f} m" if wdt is not None else "no way through") + " (you are 0.48 m wide; 0.70 m is the least this check accepts)")
        return out
    ways(free, px, rect, "empty room")

    # ---------------------------------------------------------------- 3b. turning, backing up, stepping sideways, looking while walking
    go(T[0] - 1.6, T[2] + 0.4, "open floor west of the table"); pg.wait_for_timeout(900)      # standing quite still before the turns are measured
    a = st(); pg.keyboard.down("ArrowLeft"); pg.wait_for_timeout(700); pg.keyboard.up("ArrowLeft"); pg.wait_for_timeout(120); bq = st()
    check("left arrow turns you left on the spot", 1.0 < ang(bq["yaw"] - a["yaw"]) < 2.0 and math.hypot(bq["x"] - a["x"], bq["z"] - a["z"]) < 0.03, f"turned {math.degrees(ang(bq['yaw'] - a['yaw'])):.0f} degrees, moved {math.hypot(bq['x'] - a['x'], bq['z'] - a['z']) * 100:.0f} cm")
    pg.keyboard.down("ArrowRight"); pg.wait_for_timeout(700); pg.keyboard.up("ArrowRight"); pg.wait_for_timeout(120); c = st()
    check("right arrow turns you right on the spot", -2.0 < ang(c["yaw"] - bq["yaw"]) < -1.0 and math.hypot(c["x"] - a["x"], c["z"] - a["z"]) < 0.03, f"turned {math.degrees(-ang(c['yaw'] - bq['yaw'])):.0f} degrees, moved {math.hypot(c['x'] - a['x'], c['z'] - a['z']) * 100:.0f} cm")
    y0 = st()["yaw"]; err = turn_to(ang(y0 + math.pi)); d = st()
    check("you can turn to look straight behind you without taking a step", err < 0.08 and math.hypot(d["x"] - a["x"], d["z"] - a["z"]) < 0.03, f"within {math.degrees(err):.1f} degrees of behind; moved {math.hypot(d['x'] - a['x'], d['z'] - a['z']) * 100:.0f} cm")
    pg.keyboard.down("KeyQ"); pg.wait_for_timeout(400); pg.keyboard.up("KeyQ"); pg.wait_for_timeout(100); e = st(); check("Q also turns left", ang(e["yaw"] - d["yaw"]) > 0.5, f"{math.degrees(ang(e['yaw'] - d['yaw'])):.0f} degrees")
    turn_to(math.pi / 2); a = st()                      # facing +x: toward the table from the west
    def moved(key, ms=550):
        s1 = st(); pg.keyboard.down(key); pg.wait_for_timeout(ms); pg.keyboard.up(key); pg.wait_for_timeout(300); s2 = st(); dx, dz = s2["x"] - s1["x"], s2["z"] - s1["z"]; f = (math.sin(s1["yaw"]), math.cos(s1["yaw"])); l = (math.cos(s1["yaw"]), -math.sin(s1["yaw"]))
        return {"fwd": dx * f[0] + dz * f[1], "left": dx * l[0] + dz * l[1], "dyaw": ang(s2["yaw"] - s1["yaw"])}
    m = moved("KeyS"); check("S backs you up without turning you round", m["fwd"] < -0.5 and abs(m["left"]) < 0.08 and abs(m["dyaw"]) < 0.01, f"back {-m['fwd']:.2f} m, sideways {abs(m['left']):.2f} m, turned {math.degrees(abs(m['dyaw'])):.1f} degrees")
    m = moved("KeyW"); check("W walks you the way you face", m["fwd"] > 0.5 and abs(m["left"]) < 0.08, f"forward {m['fwd']:.2f} m")
    m = moved("KeyA"); check("A steps left while you keep facing the same way", m["left"] > 0.5 and abs(m["fwd"]) < 0.08 and abs(m["dyaw"]) < 0.01, f"left {m['left']:.2f} m, turned {math.degrees(abs(m['dyaw'])):.1f} degrees")
    m = moved("KeyD"); check("D steps right while you keep facing the same way", m["left"] < -0.5 and abs(m["fwd"]) < 0.08 and abs(m["dyaw"]) < 0.01, f"right {-m['left']:.2f} m")
    m = moved("ArrowDown"); m2 = moved("ArrowUp"); check("the up and down arrows walk too", m["fwd"] < -0.5 and m2["fwd"] > 0.5, f"back {-m['fwd']:.2f} m, forward {m2['fwd']:.2f} m")
    s1 = st(); pg.mouse.move(520, 420); pg.mouse.down(); pg.mouse.move(380, 380, steps=8); pg.mouse.up(); pg.wait_for_timeout(120); s2 = st()
    check("dragging the mouse looks round and up without moving you", abs(ang(s2["yaw"] - s1["yaw"])) > 0.3 and abs(s2["pitch"] - s1["pitch"]) > 0.08 and math.hypot(s2["x"] - s1["x"], s2["z"] - s1["z"]) < 0.03, f"turned {math.degrees(ang(s2['yaw'] - s1['yaw'])):.0f}, tilted {math.degrees(s2['pitch'] - s1['pitch']):.0f} degrees")
    s1 = st(); pg.mouse.move(520, 420); pg.mouse.down(button="right"); pg.mouse.move(640, 430, steps=8); pg.mouse.up(button="right"); pg.wait_for_timeout(120); s2 = st()
    check("so does dragging with the right button", abs(ang(s2["yaw"] - s1["yaw"])) > 0.3 and math.hypot(s2["x"] - s1["x"], s2["z"] - s1["z"]) < 0.03, f"turned {math.degrees(ang(s2['yaw'] - s1['yaw'])):.0f} degrees")
    turn_to(math.pi * 0.9); s1 = st(); pg.keyboard.down("KeyW"); pg.wait_for_timeout(200); pg.mouse.move(520, 420); pg.mouse.down(); pg.mouse.move(440, 420, steps=6); pg.wait_for_timeout(350); pg.mouse.up(); pg.keyboard.up("KeyW"); pg.wait_for_timeout(300); s2 = st()
    check("you can look round while you walk", abs(ang(s2["yaw"] - s1["yaw"])) > 0.2 and math.hypot(s2["x"] - s1["x"], s2["z"] - s1["z"]) > 0.6, f"walked {math.hypot(s2['x'] - s1['x'], s2['z'] - s1['z']):.2f} m while turning {math.degrees(abs(ang(s2['yaw'] - s1['yaw']))):.0f} degrees")
    pg.mouse.move(520, 90); pg.mouse.down(); pg.mouse.move(520, 780, steps=12); pg.mouse.up(); pg.wait_for_timeout(120); lo_p = st()["pitch"]; pg.mouse.move(520, 780); pg.mouse.down(); pg.mouse.move(520, 60, steps=12); pg.mouse.up(); pg.wait_for_timeout(120); hi_p = st()["pitch"]
    check("you can look down at your hands and up at the lights", lo_p < -1.1 and hi_p > 0.8, f"down {math.degrees(lo_p):.0f}, up {math.degrees(hi_p):.0f} degrees"); pg.mouse.move(520, 300); pg.mouse.down(); pg.mouse.move(520, 520, steps=6); pg.mouse.up()

    # ---------------------------------------------------------------- 3c. to the machine, round the table, out of the door: an empty table first
    def circuit(tag):
        n0 = len(snags); t0 = time.time(); reached = {}
        for name in ("head of the bed", "front of the anesthesia machine", "head of the bed", "patient's right side", "foot of the table", "patient's left side", "head of the bed"):
            ok = go(*PLACES[name], f"{tag}: to the {name}"); s = st(); reached[name] = ok and math.hypot(s["x"] - PLACES[name][0], s["z"] - PLACES[name][1]) < 0.55
            if name in ("front of the anesthesia machine", "patient's left side", "foot of the table"): shot(f"{tag.replace(' ', '-')}-{name.replace(' ', '-').replace(chr(39), '')}")
        check(f"{tag}: reached the machine and walked right round the table with the keyboard", all(reached.values()), f"{time.time() - t0:.0f} s; " + ", ".join(k for k, v in reached.items() if not v) + ("" if all(reached.values()) else " not reached"))
        check(f"{tag}: nothing caught you on the way", len(snags) == n0, "stalled at " + "; ".join(f"({q['at'][0]}, {q['at'][1]}) on the way {q['on']}" for q in snags[n0:]) if len(snags) > n0 else "no stall of 1.3 s or more while a walking key was held")
    circuit("empty table")
    ok = go(door[0] - 2.2, door[1], "empty table: out through the door"); s = st(); check("empty table: walked out through the door", ok and s["room"] == "court", f"now in {s['room']}")

    # ---------------------------------------------------------------- the same room with a patient on the table and a case open
    go(door[0] - 0.3, door[1], "back in"); pg.evaluate("__ov.periop.begin(__ov.periop.byId.p51, { unplanned: true })"); pg.wait_for_function("__ov.periop.case && __ov.periop.patient && !document.getElementById('wipe').className", timeout=60000); pg.wait_for_timeout(1500)
    s = st(); check("opening a case leaves you in control, looking through your own eyes", s["enabled"] and s["first"], f"at ({s['x']:.2f}, {s['z']:.2f})")
    pg.click("#caseHud [data-start=list]"); pg.wait_for_timeout(900)
    free, px = room_truth("operating room, patient on the table", rect, "or-case"); ways(free, px, rect, "case running")
    # sightlines from the five places the panel offers
    def target(k):
        return pg.evaluate("""(k) => { const o = __ov, P = o.periop.patient, m = o.exhibits.clinical.pieces.eq_anesthesia_machine, V = o.world.camera.position.constructor, w = (r, v) => r.localToWorld(v.clone ? v.clone() : new V(...v)).toArray(); m.updateMatrixWorld(true); const scr = (n) => { let q = null; m.traverse((c) => { if (c.isMesh && c.name.startsWith(n)) q = c; }); if (!q) return null; q.geometry.computeBoundingBox(); const c = q.geometry.boundingBox.getCenter(new V()); return q.localToWorld(c).toArray(); };
          if (k === 'patient') return [['the face', w(P.root, P.lm.nose)], ['the mouth', w(P.root, P.lm.mouth)], ['the chest', w(P.root, P.lm.chest)]];
          if (k === 'monitor') return [['the monitor screen', scr('screen_monitor')]];
          if (k === 'worktop') return [['the middle of the worktop', w(m, [0.3, 0.92, 0.12])], ['the ventilator screen', scr('screen_vent')], ['the monitor screen', scr('screen_monitor')], ['the oxygen flow knob', w(m, [0.08, 1.145, 0.03])], ['the sevoflurane dial', w(m, [0.35, 1.335, -0.05])]];
          if (k === 'side') return [['the chest', w(P.root, P.lm.chest)], ['the near hand', w(P.root, P.lm.handL)]];
          if (k === 'door') return [['the doorway', [o.world.level.stations.or.at[0] - 1.37, 1.1, o.world.level.stations.or.at[1]]]]; }""", k)
    for k, name in (("patient", "Head of bed"), ("monitor", "Monitor"), ("worktop", "Machine"), ("side", "Bedside"), ("door", "Door")):
        pg.click(f'#caseHud [data-view="{k}"]'); pg.wait_for_timeout(900); s = st(); tg = [q for q in target(k) if q[1]]; r = pg.evaluate(SEE, [[q[1] for q in tg], 0.09])
        ok = s["enabled"] and all(o["inView"] and o["clear"] for o in r["out"])
        check(f"'{name}' puts you where you can see {' and '.join(q[0] for q in tg)}, and leaves you free to move", ok, "; ".join(f"{q[0]} at ({o['sx']}, {o['sy']}) px, {o['dist']:.2f} m away" + ("" if o["inView"] else " OUT OF THE CLEAR PART OF THE WINDOW") + ("" if o["clear"] else f" HIDDEN BY {o['first'][0]} at {o['first'][1]} m") for q, o in zip(tg, r["out"])))
        shot(f"stand-{k}"); m = moved("KeyS", 300); check(f"'{name}': one key steps you back from it", m["fwd"] < -0.12, f"backed up {-m['fwd']:.2f} m")
    # the way out can be seen from where you work
    pg.click('#caseHud [data-view="patient"]'); pg.wait_for_timeout(600); ex = pg.evaluate("__ov.periop.exits[0]"); s = st(); turn_to(math.atan2(ex[0] - s["x"], ex[2] - s["z"])); pg.mouse.move(520, 420); pg.mouse.down(); pg.mouse.move(520, 250, steps=8); pg.mouse.up(); pg.wait_for_timeout(200)
    r = pg.evaluate(SEE, [[ex, [door[0] - 1.37, 1.1, door[1]]], 0.12]); o = r["out"]
    check("from the head of the bed, turning shows the exit sign and the doorway", all(q["inView"] and q["clear"] for q in o), f"sign at ({o[0]['sx']}, {o[0]['sy']}) px{'' if o[0]['clear'] else ' hidden by ' + str(o[0]['first'])}; doorway at ({o[1]['sx']}, {o[1]['sy']}) px{'' if o[1]['clear'] else ' hidden by ' + str(o[1]['first'])}"); shot("exit-from-the-head-of-the-bed")
    circuit("case running")
    ok = go(door[0] - 2.2, door[1], "case running: out through the door"); s = st(); away = pg.evaluate("__ov.periop.away")
    check("case running: walked out through the door, and the patient waits", ok and s["room"] == "court" and bool(away), f"now in {s['room']}; the case is paused while you are out: {bool(away)}")
    ok = go(*PLACES["head of the bed"], "back to the head of the bed"); s = st(); check("walked back in to the head of the bed", ok and s["room"] == "or" and not pg.evaluate("__ov.periop.away"), f"in {s['room']}; clock running again: {not pg.evaluate('__ov.periop.away')}")
    pg.evaluate("__ov.periop.cancel && __ov.periop.cancel()"); pg.wait_for_timeout(1200)
    s = st(); check("sending the patient back leaves you in control", s["enabled"], f"in {s['room']}")

    # ---------------------------------------------------------------- 3d. stations give control back
    go(door[0] - 2.2, door[1], "out again")
    sched = LV["st"]["schedule"]["at"]; ok = go(sched[0], sched[1], "to the schedule station in pre-op", near=0.5); s = st()
    check("walked to the schedule station in pre-op", ok and s["room"] == "preop", f"in {s['room']} at ({s['x']:.1f}, {s['z']:.1f})")
    pg.keyboard.press("KeyE"); pg.wait_for_function("!document.getElementById('wPlace').hidden", timeout=8000); pg.wait_for_timeout(1300); held = st(); shot("schedule-station")
    pg.keyboard.press("Escape"); pg.wait_for_timeout(700); s = st(); m = moved("KeyS", 450)
    check("leaving the schedule station with Escape gives you your legs back", (not held["enabled"]) and s["enabled"] and m["fwd"] < -0.3, f"held while open: {not held['enabled']}; after Escape backed up {-m['fwd']:.2f} m")
    go(sched[0], sched[1], "back to the schedule station", near=0.5); pg.keyboard.press("KeyE"); pg.wait_for_function("!document.getElementById('wPlace').hidden", timeout=8000); pg.wait_for_timeout(1300)
    s1 = st(); pg.keyboard.down("KeyS"); pg.wait_for_timeout(700); pg.keyboard.up("KeyS"); pg.wait_for_timeout(300); s2 = st()
    check("pressing a walking key at a station closes it and walks you away", pg.evaluate("document.getElementById('wPlace').hidden") and s2["enabled"] and math.hypot(s2["x"] - s1["x"], s2["z"] - s1["z"]) > 0.25, f"panel closed: {pg.evaluate('document.getElementById(\"wPlace\").hidden')}; moved {math.hypot(s2['x'] - s1['x'], s2['z'] - s1['z']):.2f} m")
    bay = LV["st"]["bay1"]["at"]; ok = go(bay[0], bay[1], "to bay 1", near=0.5); pg.keyboard.press("KeyE"); pg.wait_for_function("!document.getElementById('wPlace').hidden", timeout=8000); pg.wait_for_timeout(1300); shot("bay-1")
    desk = pg.query_selector("#wPlace [data-m=desk]")
    if desk:
        desk.click(); pg.wait_for_timeout(1500); opened = pg.evaluate("!document.getElementById('desk').hidden"); shot("chart-station")
        pg.click("#deskBack"); pg.wait_for_timeout(900)
        if pg.evaluate("!document.getElementById('wPlace').hidden"): pg.keyboard.press("Escape"); pg.wait_for_timeout(700)
        s = st(); m = moved("KeyS", 450); check("after leaving the chart station you can walk away", opened and s["enabled"] and m["fwd"] < -0.3, f"chart opened: {opened}; backed up {-m['fwd']:.2f} m")
    else:
        pg.keyboard.press("Escape"); pg.wait_for_timeout(600); s = st(); m = moved("KeyS", 450); check("after leaving a bedside panel you can walk away", s["enabled"] and m["fwd"] < -0.3, f"backed up {-m['fwd']:.2f} m (no chart button found on the bay panel)")
    hands = pg.evaluate("!!(__ov.hands)"); notes["held_tool"] = "checked in tools/hands_check.py" if hands else "nothing can be held yet"

    # ---------------------------------------------------------------- the map of where the walk went
    x0, z0, x1, z1 = rect; mp = pg.evaluate("([a, b, c, d]) => __ov.world.solidMap(a, b, c, d, 100).toDataURL('image/png')", rect); im = Image.open(io.BytesIO(base64.b64decode(mp.split(",")[1]))).convert("RGB"); dr = ImageDraw.Draw(im)
    pts = [((x - x0) * 100, (z - z0) * 100) for x, z in trail if x0 <= x <= x1 and z0 <= z <= z1]
    for a_, b_ in zip(pts, pts[1:]):
        if math.hypot(a_[0] - b_[0], a_[1] - b_[1]) < 30: dr.line([a_, b_], fill=(20, 110, 220), width=2)
    for q in snags: dr.ellipse([(q["at"][0] - x0) * 100 - 7, (q["at"][1] - z0) * 100 - 7, (q["at"][0] - x0) * 100 + 7, (q["at"][1] - z0) * 100 + 7], outline=(255, 0, 0), width=3)
    im.save(f"{OUT}/walked.png")
    check("no page errors", not errs, "; ".join(errs[:3]))
    notes["stalls"] = snags; notes["browser"] = b.version; notes["window"] = [1440, 810]
    ctx.close(); b.close()

passed = sum(1 for r in results if r["ok"]); json.dump({"passed": passed, "total": len(results), "results": results, "notes": notes}, open(f"{OUT}/movement.json", "w"), indent=1)
print(f"\n{passed}/{len(results)} movement checks passed; pictures and movement.json in {OUT}")
sys.exit(0 if passed == len(results) else 1)
