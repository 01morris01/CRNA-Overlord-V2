"""bedside_views.py: fixed pictures of the endoscopy patient at the bedside, for before-and-after comparison.
     uv run --with playwright python3 tools/bedside_views.py OUT_DIR tools/test-account.example.json [PORT] [--stage STAGE]
   Needs the dev server:  python3 tools/dev_server.py 8091

The cameras are fixed in the room, measured from the middle of the endoscopy stretcher's top (the case table), so the same file
run before and after a change gives pictures from the same eye, with the same lens and the same room light. Nothing is framed on
the patient: if the patient lies differently, the pictures show it.

Test setup (said where it happens): a fresh save with the throwaway account; the endoscopy patient is brought to bay 2, the
bedside decision "convert" is pressed and the case is begun in the suite through the panel's own buttons. STAGE picks how far
the case is taken before the pictures: `setup` (on the stretcher, awake, nothing on), or `procedure` (monitors on, asleep,
intubated, the team told you are ready) which is reached through the step list exactly as tools/endo_check.py does it.
The case panel and hints are hidden for the pictures only (CSS); nothing about the scene changes.

Writes OUT_DIR/<view>.jpg (1600 x 1000) and OUT_DIR/views.json (camera numbers, frame time, renderer counts)."""
import sys, json, os, asyncio, time
from playwright.async_api import async_playwright
A = [a for a in sys.argv[1:] if not a.startswith('--')]
OUT = A[0]; ACC = json.load(open(A[1])); PORT = A[2] if len(A) > 2 else "8091"; B = f"http://127.0.0.1:{PORT}/world/"
STAGE = sys.argv[sys.argv.index('--stage') + 1] if '--stage' in sys.argv else 'setup'
os.makedirs(OUT, exist_ok=True)
WORLD = "window.__ov && __ov.world && __ov.periop && document.getElementById('veil').classList.contains('off') && !document.getElementById('wipe').className"
HUD = "#caseHud"
# camera: eye and look, meters from the middle of the stretcher top; -z is the head end; +x is the patient's left when lying on the back
VIEWS = {
    'head_of_bed':  ([0.00, 0.90, -1.50], [0.00, 0.18, -0.45], 55),
    'side_left':    ([1.45, 0.78, -0.20], [0.00, 0.20, -0.25], 55),
    'side_right':   ([-1.45, 0.78, -0.20], [0.00, 0.20, -0.25], 55),
    'face_close':   ([0.34, 0.52, -1.10], [0.00, 0.27, -0.78], 40),
    'profile':      ([0.80, 0.30, -0.80], [0.00, 0.28, -0.80], 40),
    'mouth_open':   ([0.00, 0.62, -1.08], [0.00, 0.26, -0.77], 38),
}

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(channel="chrome", args=["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"])
        ctx = await b.new_context(viewport={"width": 1600, "height": 1000}, service_workers="block")
        pg = await ctx.new_page(); errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)[:300]))
        # ---- test setup: the throwaway account, a fresh save, sound off, no care plan
        await pg.goto(B + "blank.html"); await pg.evaluate("""async ([u, p]) => { const a = await import('/core/auth.js'); let r = await a.loginUser(u, p); if (!r.success) { await a.registerUser(u, p); r = await a.loginUser(u, p); }
          const s = await import('/world/js/save.js'); localStorage.removeItem(s.key()); const st = s.load(); st.character = { name: 'Tester', person: 'scrubs', colour: 'teal' }; s.save(st); localStorage.setItem('overlord_world_mute', '1');
          for (const k of Object.keys(localStorage)) if (k.startsWith('overlord.careplan.v1.') || k === 'overlord.student.session.v1') localStorage.removeItem(k); }""", [ACC["username"], ACC["password"]])
        await pg.goto(B); await pg.wait_for_function(WORLD, timeout=120000); await pg.wait_for_function("__ov.exhibits && __ov.exhibits.hasClinical", timeout=120000); await pg.evaluate("__ov.periop.ready"); await pg.wait_for_timeout(1500)
        pid = await pg.evaluate("Object.values(__ov.periop.byId).find((e) => /^endo/i.test(e.room || '') && e.engineSupported).id")
        await pg.evaluate("(id) => __ov.periop.setBay(2, id)", pid); await pg.wait_for_timeout(2500); await pg.evaluate("__ov.world.open('bay2')"); await pg.wait_for_timeout(1200)
        await pg.click('#wPlace [data-endo="convert"]'); await pg.wait_for_timeout(1000)
        await pg.click('#wPlace [data-m="endo-run"]'); await pg.wait_for_function("__ov.periop.case && !document.getElementById('wipe').className && !document.getElementById('caseHud').hidden", timeout=30000); await pg.wait_for_timeout(1500)
        await pg.click(f'{HUD} [data-start="list"]'); await pg.wait_for_timeout(1500)
        if STAGE == 'procedure':
            await pg.evaluate("__ov.periop.case.setSpeed && __ov.periop.case.setSpeed(8)")
            for a in ("ppe", "timeout", "spo2", "nibp", "ecg", "preox"):
                ph = await pg.evaluate("(id) => import('/world/js/cases.js').then(m => m.ACTIONS[id][1])", a)
                await pg.click(f'{HUD} [data-ph="{ph}"]'); await pg.wait_for_timeout(150); await pg.click(f'{HUD} [data-a="{a}"]'); await pg.wait_for_timeout(300)
        # pictures only: the case panel, hints and toasts are hidden
        await pg.add_style_tag(content="#caseHud, #wPlace, #wHands, .toast, #toast, #hint, .hint, #wHint { visibility: hidden !important; }")
        T = await pg.evaluate("(() => { const t = __ov.periop.table || null; const st = __ov.world.level.stations.endo; return { x: st.table[0], z: st.table[1] }; })()")
        TOP = 0.74
        shots = {}
        await pg.evaluate("([x, z]) => __ov.world.standAt(x - 1.2, z - 1.2, x, z)", [T["x"], T["z"]]); await pg.wait_for_timeout(800)
        for name, (eye, look, fov) in VIEWS.items():
            E = [T["x"] + eye[0], TOP + eye[1], T["z"] + eye[2]]; L = [T["x"] + look[0], TOP + look[1], T["z"] + look[2]]
            jaw = 1.0 if name == 'mouth_open' else 0.0
            await pg.evaluate("(w) => { const P = __ov.periop.patient; if (P && P.morph) P.morph('jawOpen', w); }", jaw)
            await pg.evaluate("([e, l, f]) => __ov.world.view(e, l, f, 0)", [E, L, fov]); await pg.wait_for_timeout(900)
            t0 = time.time(); fr0 = await pg.evaluate("__ov.world.frame || 0"); await pg.wait_for_timeout(1500); fr1 = await pg.evaluate("__ov.world.frame || 0")
            info = await pg.evaluate("(() => { const i = __ov.world.renderer.info; return { calls: i.render.calls, triangles: i.render.triangles, textures: i.memory.textures, geometries: i.memory.geometries }; })()")
            await pg.screenshot(path=f"{OUT}/{name}.jpg", quality=90, type="jpeg")
            shots[name] = {"eye": E, "look": L, "fov": fov, "jawOpen": jaw, "renderer": info, "frames_in_1_5s": (fr1 - fr0) if isinstance(fr1, (int, float)) else None}
            print(name, json.dumps(shots[name]), flush=True)
        await pg.evaluate("() => { const P = __ov.periop.patient; if (P && P.morph) P.morph('jawOpen', 0); }")
        rec = {"stage": STAGE, "table": T, "views": shots, "errors": errs, "gpu": await pg.evaluate("(() => { const g = __ov.world.renderer.getContext(); const d = g.getExtension('WEBGL_debug_renderer_info'); return d ? g.getParameter(d.UNMASKED_RENDERER_WEBGL) : 'unknown'; })()")}
        json.dump(rec, open(f"{OUT}/views.json", "w"), indent=1); print("errors", errs)
        await b.close()

asyncio.run(main())
