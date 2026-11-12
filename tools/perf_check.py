"""perf_check.py: measure the institute in a VISIBLE Chrome window on this machine (a hidden browser does not pace frames
like a real one). For each quality level it loads the level, stands at fixed views, walks, and records what the display
actually got: time between presented frames, the script's own cost per frame, draw calls, triangles, canvas size, bytes
fetched and time to first usable frame.
     uv run --with playwright python3 tools/perf_check.py OUT.json tools/test-account.example.json [PORT] [WIDTHxHEIGHT]
This is one machine. It says nothing about phones, tablets or other computers."""
import sys, json, os, platform, subprocess, time
from playwright.sync_api import sync_playwright
OUT = sys.argv[1]; ACC = json.load(open(sys.argv[2])); PORT = sys.argv[3] if len(sys.argv) > 3 else "8091"; W, H = (int(v) for v in (sys.argv[4] if len(sys.argv) > 4 else "1440x900").split("x")); B = f"http://127.0.0.1:{PORT}/world/"
VIEWS = ["arrival", "court", "atrium", "portal", "gallery", "or", "orwork", "oranes", "bay", "preop", "studio"]
SAMPLE = """(n) => new Promise((res) => { const t = []; let last = performance.now(); function f(now) { t.push(now - last); last = now; if (t.length >= n) { t.shift(); const s = [...t].sort((a, b) => a - b), q = (p) => +s[Math.min(s.length - 1, Math.floor(s.length * p))].toFixed(2);
  res({ frames: s.length, median_ms: q(0.5), p95_ms: q(0.95), worst_ms: q(0.999), fps: +(1000 / (s.reduce((a, b) => a + b, 0) / s.length)).toFixed(1), over_25ms: s.filter((v) => v > 25).length }); } else requestAnimationFrame(f); } requestAnimationFrame(f); })"""
res = {"machine": {"model": subprocess.run(["sysctl", "-n", "machdep.cpu.brand_string"], capture_output=True, text=True).stdout.strip(), "os": platform.platform(), "memory_gb": round(int(subprocess.run(["sysctl", "-n", "hw.memsize"], capture_output=True, text=True).stdout) / 2**30)}, "window": [W, H], "runs": []}
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", headless=False, args=[f"--window-size={W},{H + 90}", "--window-position=40,40"])
    res["browser"] = "Chrome " + b.version
    for q in ["high", "medium", "low"]:
        ctx = b.new_context(viewport={"width": W, "height": H}, device_scale_factor=2, service_workers="block"); pg = ctx.new_page()
        pg.goto(B + "blank.html"); pg.evaluate("""async ([u, p, q]) => { const a = await import('/core/auth.js'); let r = await a.loginUser(u, p); if (!r.success) { await a.registerUser(u, p); r = await a.loginUser(u, p); }
          const s = await import('/world/js/save.js'); localStorage.removeItem(s.key()); const st = s.load(); st.character = { name: 'Perf', person: 'scrubs', colour: 'navy' }; st.game.prefs = { quality: q }; s.save(st); }""", [ACC["username"], ACC["password"], q])
        t0 = time.time(); pg.goto(B); pg.wait_for_function("window.__ov && __ov.world && __ov.places && document.getElementById('veil').classList.contains('off')", timeout=180000); ready = round(time.time() - t0, 2); pg.wait_for_function("__ov.exhibits && __ov.exhibits.hasClinical && __ov.periop", timeout=120000); pg.evaluate("__ov.periop.ready"); pg.wait_for_timeout(6000)
        pg.evaluate("(() => { const f = __ov.exhibits.figure; if (f) { f.auto = true; } })()")
        run = {"quality": q, "seconds_to_usable": ready, "megabytes": pg.evaluate("(() => { let n = 0; for (const e of performance.getEntriesByType('resource')) n += (e.encodedBodySize || e.decodedBodySize || 0) / 1e6; return { shipped: +n.toFixed(1) }; })()"), "dpr": pg.evaluate("devicePixelRatio"), "gpu": pg.evaluate("(() => { const g = __ov.world.renderer.getContext(), e = g.getExtension('WEBGL_debug_renderer_info'); return e ? g.getParameter(e.UNMASKED_RENDERER_WEBGL) : 'unknown'; })()"), "views": {}}
        for v in VIEWS:
            pg.evaluate("(v) => __ov.world.bookmark(v, v === 'court' || v === 'arrival' ? { person: [0.4, v === 'arrival' ? 8.5 : -6, 3.14] } : {})", v); pg.wait_for_timeout(1500); s = pg.evaluate(SAMPLE, 300); st = pg.evaluate("__ov.world.stats()")
            run["views"][v] = {**s, "script_ms_median": st["cpuMs"], "script_ms_p95": st["cpuP95"], "draw_calls": st["calls"], "triangles": st["tris"], "canvas_px": st["pixels"]}
        pg.evaluate("__ov.world.teleport('atrium'); __ov.world.release()"); pg.wait_for_timeout(800); pg.mouse.move(W / 2, H / 2); pg.keyboard.down("KeyW"); pg.keyboard.down("KeyD"); walk = pg.evaluate(SAMPLE, 240); pg.keyboard.up("KeyW"); pg.keyboard.up("KeyD"); st = pg.evaluate("__ov.world.stats()")
        run["walking_in_court"] = {**walk, "draw_calls": st["calls"], "triangles": st["tris"]}; run["memory"] = {"geometries": st["geometries"], "textures": st["textures"]}
        # a case running in the operating room: the patient on the table, the monitor and ventilator display redrawn from the engine
        pg.evaluate("localStorage.setItem('overlord_world_mute', '1'); __ov.periop.begin(__ov.periop.byId[__ov.periop.bays.find(Boolean)], { unplanned: true })"); pg.wait_for_function("__ov.periop.case && !document.getElementById('wipe').className && !document.getElementById('caseHud').hidden", timeout=40000); pg.wait_for_timeout(800)   # test setup: bring the first waiting patient in
        pg.click('#caseHud [data-start="list"]'); pg.wait_for_timeout(600)
        for a in ("spo2", "nibp", "ecg"): pg.click(f'#caseHud [data-a="{a}"]'); pg.wait_for_timeout(150)
        run["case"] = {}
        for v in ("patient", "monitor", "worktop"):
            pg.click(f'#caseHud [data-view="{v}"]'); pg.wait_for_timeout(1500); c = pg.evaluate(SAMPLE, 300); st = pg.evaluate("__ov.world.stats()"); run["case"][v] = {**c, "script_ms_median": st["cpuMs"], "script_ms_p95": st["cpuP95"], "draw_calls": st["calls"], "triangles": st["tris"], "canvas_px": st["pixels"]}
        res["runs"].append(run); print(q, "case", json.dumps({k: (v["median_ms"], v["p95_ms"], v["draw_calls"], v["triangles"]) for k, v in run["case"].items()}), flush=True); print(q, json.dumps({k: (v["median_ms"], v["p95_ms"], v["draw_calls"], v["triangles"]) for k, v in run["views"].items()}), "walk", walk["median_ms"], walk["p95_ms"], "ready", ready, "MB", run["megabytes"], run["views"]["court"]["canvas_px"], flush=True); ctx.close()
    b.close()
json.dump(res, open(OUT, "w"), indent=1); print("saved", OUT, res["machine"], res["browser"])
