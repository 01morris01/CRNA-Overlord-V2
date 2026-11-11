"""small_screen_check.py: the institute at phone and tablet sizes, in Chrome's touch EMULATION on this computer.
     uv run --with playwright python3 tools/small_screen_check.py OUT_DIR tools/test-account.example.json [PORT]
It checks that the layout fits, that the touch controls exist and move the walker, and that the exhibits open.
Emulation is not a real device: it says nothing about a phone's graphics speed, memory, heat or real touch handling."""
import sys, json, os
from playwright.sync_api import sync_playwright
OUT = sys.argv[1]; ACC = json.load(open(sys.argv[2])); PORT = sys.argv[3] if len(sys.argv) > 3 else "8091"; B = f"http://127.0.0.1:{PORT}/world/"; R = []; os.makedirs(OUT, exist_ok=True)
def ok(name, cond, detail=""):
    R.append({"group": "small-screen emulation", "pass": bool(cond), "check": name, "detail": str(detail)[:200]}); print(("PASS " if cond else "FAIL ") + name + (" :: " + str(detail)[:160] if detail else ""), flush=True)
FITS = "(sel) => { const e = document.querySelector(sel); if (!e || e.hidden) return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.left >= -1 && r.right <= innerWidth + 1 && r.top >= -1 && r.bottom <= innerHeight + 1; }"
WORLD = "window.__ov && __ov.world && __ov.places && document.getElementById('veil').classList.contains('off') && document.body.dataset.screen === 'world' && !document.getElementById('wipe').className"
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", args=["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"])
    for tag, w, h, dpr in [("phone", 390, 844, 3), ("tablet", 820, 1180, 2)]:
        ctx = b.new_context(viewport={"width": w, "height": h}, device_scale_factor=dpr, is_mobile=True, has_touch=True, user_agent=None); pg = ctx.new_page(); errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)[:300])); pg.on("console", lambda m: errs.append(m.text[:200]) if m.type == "error" and "404" not in m.text else None)
        pg.goto(B + "blank.html"); pg.evaluate("""async ([u, p]) => { const a = await import('/core/auth.js'); let r = await a.loginUser(u, p); if (!r.success) { await a.registerUser(u, p); r = await a.loginUser(u, p); }
          const s = await import('/world/js/save.js'); localStorage.removeItem(s.key()); }""", [ACC["username"], ACC["password"]])   # test setup: signed in, no save
        pg.goto(B); pg.wait_for_selector("#charGo", state="visible"); pg.wait_for_timeout(2500); pg.screenshot(path=f"{OUT}/{tag}-1-character.jpg", type="jpeg", quality=85)
        ok(f"{tag}: the character screen fits, with the choices and the button on screen", pg.evaluate(FITS, "#charGo") and pg.evaluate(FITS, ".people") and pg.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"))
        pg.tap('[data-person="coat"]'); pg.wait_for_timeout(1500); pg.tap("#charGo"); pg.wait_for_function(WORLD, timeout=180000); pg.wait_for_timeout(3500); pg.screenshot(path=f"{OUT}/{tag}-2-arrival.jpg", type="jpeg", quality=85)
        st = pg.evaluate("({q: __ov.world.prefs.quality, coarse: matchMedia('(hover: none) and (pointer: coarse)').matches, px: __ov.world.stats().pixels})")
        ok(f"{tag}: touch is detected and the lower-cost graphics are chosen by default", st["coarse"] and st["q"] == "low", json.dumps(st))
        ok(f"{tag}: the walking pad, the open button and the next-step line are on screen and nothing overflows", pg.evaluate(FITS, "#stick") and pg.evaluate(FITS, "#padAct") and pg.evaluate(FITS, "#wGoal") and pg.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"))
        z0 = pg.evaluate("__ov.world.P.z"); r = pg.locator("#stick").bounding_box(); cx, cy = r["x"] + r["width"] / 2, r["y"] + r["height"] / 2
        pg.mouse.move(cx, cy); pg.mouse.down(); pg.mouse.move(cx, cy - 46, steps=6); pg.wait_for_timeout(2200); pg.mouse.up(); pg.wait_for_timeout(300); z1 = pg.evaluate("__ov.world.P.z")
        ok(f"{tag}: pushing the pad forward walks toward the entrance", z1 < z0 - 2, f"moved {z0 - z1:.1f} m")
        y0 = pg.evaluate("__ov.world.camera.rotation.y"); pg.mouse.move(w * 0.6, h * 0.35); pg.mouse.down(); pg.mouse.move(w * 0.3, h * 0.36, steps=8); pg.mouse.up(); pg.wait_for_timeout(300)
        ok(f"{tag}: dragging the picture turns the view", abs(pg.evaluate("__ov.world.camera.rotation.y") - y0) > 0.2)
        pg.tap("#wGoal [data-go]"); pg.wait_for_function("window.__ov && __ov.hall && __ov.hall.atlas.running", timeout=120000); pg.wait_for_timeout(3500); pg.screenshot(path=f"{OUT}/{tag}-3-film.jpg", type="jpeg", quality=85)
        ok(f"{tag}: 'Go there' opens the film; its caption, scrubber and controls are on screen", pg.evaluate("__ov.hall.learn.state.mode === 'film'") and pg.evaluate(FITS, "#hHead h1") and pg.evaluate(FITS, "#fRange") and pg.evaluate("getComputedStyle(document.querySelector('#hHead h1')).opacity === '1'"))
        pg.evaluate("__ov.hall.learn.go('challenge')"); pg.wait_for_timeout(2500); pg.screenshot(path=f"{OUT}/{tag}-4-challenge.jpg", type="jpeg", quality=85)   # test setup: jump to the challenge
        ok(f"{tag}: the challenge shows its question and the model, with the panel on screen", pg.evaluate(FITS, "#hHead h1") and pg.evaluate(FITS, "#hPanel"))
        pg.evaluate("__ov.hall.learn.go('menu')"); pg.wait_for_timeout(600); pg.tap('#hPanel [data-go="exit"]'); pg.wait_for_function(WORLD, timeout=60000); pg.wait_for_timeout(1500)
        pg.evaluate("__ov.places.direct('scan')"); pg.wait_for_function("window.__ov && __ov.scan && __ov.scan.running", timeout=120000); pg.wait_for_timeout(2500); pg.tap('#sPanel [data-go="explore"]'); pg.wait_for_timeout(1800); pg.screenshot(path=f"{OUT}/{tag}-5-scan.jpg", type="jpeg", quality=85)   # test setup: the direct route
        ok(f"{tag}: the scan exhibit shows the model, an active slice and its panel without overflow", pg.evaluate(FITS, "#sSlices figure.on canvas") and pg.evaluate(FITS, "#sPanel") and pg.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"))
        ok(f"{tag}: no script errors", not errs, errs[:2]); ctx.close()
    b.close()
print(f"\n{sum(1 for r in R if r['pass'])} of {len(R)} emulation checks pass"); json.dump(R, open(OUT + "/small-screen-results.json", "w"), indent=1)
