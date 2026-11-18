"""kit_check.py: the hand-held equipment in a running case, used with the mouse and keyboard as a learner would.
     uv run --with playwright python3 tools/kit_check.py OUT_DIR tools/test-account.example.json [PORT]
   Needs the dev server:  python3 tools/dev_server.py 8091

Test setup (said where it happens): a fresh save with the throwaway account; the endoscopy patient converted to a general
anesthetic and begun in the suite (as tools/endo_check.py does); one propofol syringe drawn through the case's own C.draw (the
same call the drug form makes); the learner put at the machine with the worktop view key, and next to the patient's right arm
with world.standLook (the walk itself is checked by rooms_check.py). Everything after that is real input: mouse clicks on the
syringe and the port, mouse button held on the plunger, X to put it back.

What it checks: the syringe is picked up and the chip says what it holds; the port accepts it and the record says connected;
holding the plunger gives drug in parts while held and nothing after release; a second hold gives only the new part; the case
record (syringe.givenMg and its pushes) equals what the engine was given (the runner's drug log); taking it off and pressing X
puts it back on the tray. It checks that this works and is recorded truthfully, not how it looks."""
import sys, json, os, asyncio
from playwright.async_api import async_playwright
OUT = sys.argv[1]; ACC = json.load(open(sys.argv[2])); PORT = sys.argv[3] if len(sys.argv) > 3 else "8091"; B = f"http://127.0.0.1:{PORT}/world/"; R = []
os.makedirs(OUT, exist_ok=True)
def ok(name, cond, detail=""):
    R.append({"pass": bool(cond), "check": name, "detail": str(detail)[:400]}); print(("PASS " if cond else "FAIL ") + name + (" :: " + str(detail)[:300] if detail else ""), flush=True)
WORLD = "window.__ov && __ov.world && __ov.periop && document.getElementById('veil').classList.contains('off') && !document.getElementById('wipe').className"
HUD = "#caseHud"
KIT = "(() => { const k = __ov.periop.kits && __ov.periop.kits.find(q => q.name === 'drugs'); return k ? k.state() : null; })()"
REC = """(() => { const C = __ov.periop.case, s = C.syringes[0]; const eng = C.runner.log.filter(e => e.meta && e.meta.action === 'drug' && e.meta.drug === 'Propofol').reduce((a, e) => a + e.meta.doseMg, 0);
  return { givenMg: +s.givenMg.toFixed(3), pushes: s.pushes.length, engineMg: +eng.toFixed(3), given: s.given, held: __ov.hands.held ? __ov.hands.held.id : null }; })()"""

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(channel="chrome", args=["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"])
        ctx = await b.new_context(viewport={"width": 1280, "height": 800}, record_video_dir=OUT + "/_vid", record_video_size={"width": 1280, "height": 800}, service_workers="block")
        pg = await ctx.new_page(); errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)[:300])); pg.on("console", lambda m: errs.append("console: " + m.text[:300]) if m.type == "error" or (m.type == "warning" and "kit" in m.text) else None)
        shot = lambda n: pg.screenshot(path=f"{OUT}/{n}.jpg", quality=88, type="jpeg")
        async def where(i): return await pg.evaluate("(i) => __ov.hands.where(i)", i)
        async def click_thing(i):
            w = await where(i)
            if not w or not w.get("front"): return w
            await pg.mouse.move(w["x"], w["y"]); await pg.wait_for_timeout(250); await pg.mouse.click(w["x"], w["y"]); await pg.wait_for_timeout(450); return w
        # ---- test setup
        await pg.goto(B + "blank.html"); await pg.evaluate("""async ([u, p]) => { const a = await import('/core/auth.js'); let r = await a.loginUser(u, p); if (!r.success) { await a.registerUser(u, p); r = await a.loginUser(u, p); }
          const s = await import('/world/js/save.js'); localStorage.removeItem(s.key()); const st = s.load(); st.character = { name: 'Tester', person: 'scrubs', colour: 'teal' }; s.save(st); localStorage.setItem('overlord_world_mute', '1');
          for (const k of Object.keys(localStorage)) if (k.startsWith('overlord.careplan.v1.') || k === 'overlord.student.session.v1') localStorage.removeItem(k); }""", [ACC["username"], ACC["password"]])
        await pg.goto(B); await pg.wait_for_function(WORLD, timeout=120000); await pg.wait_for_function("__ov.exhibits && __ov.exhibits.hasClinical", timeout=120000); await pg.evaluate("__ov.periop.ready"); await pg.wait_for_timeout(1500)
        pid = await pg.evaluate("Object.values(__ov.periop.byId).find((e) => /^endo/i.test(e.room || '') && e.engineSupported).id")
        await pg.evaluate("(id) => __ov.periop.setBay(2, id)", pid); await pg.wait_for_timeout(2500); await pg.evaluate("__ov.world.open('bay2')"); await pg.wait_for_timeout(1200)
        await pg.click('#wPlace [data-endo="convert"]'); await pg.wait_for_timeout(1000); await pg.click('#wPlace [data-m="endo-run"]')
        await pg.wait_for_function("__ov.periop.case && !document.getElementById('wipe').className && !document.getElementById('caseHud').hidden", timeout=30000); await pg.wait_for_timeout(1500)
        await pg.click(f'{HUD} [data-start="list"]'); await pg.wait_for_timeout(1200)
        drew = await pg.evaluate("__ov.periop.case.draw('Propofol', 200, 'mg')")
        ok("test setup: propofol 200 mg drawn as 20 mL at 10 mg/mL (strength from the US label in data/world/formulary.json)", drew.get("ok") and "20 mL" in drew.get("say", ""), drew.get("say"))
        await pg.keyboard.press("3"); await pg.wait_for_timeout(1500); await shot("k01-worktop")
        st = await pg.evaluate(KIT); ok("the drugs kit is running and shows the drawn syringe on the tray", st and len(st["rows"]) == 1 and not st["rows"][0]["connected"], json.dumps(st))
        # ---- pick up
        w = await click_thing("syr:s1"); held = await pg.evaluate("__ov.hands.held && __ov.hands.held.id"); chip = await pg.inner_text(".hheld") if await pg.query_selector(".hheld:not([hidden])") else ""
        ok("clicking the syringe picks it up; the chip names the drug", held == "syr:s1" and "propofol" in chip.lower(), json.dumps({"where": w, "held": held, "chip": chip[:120]})); await shot("k02-holding")
        # ---- go to the right arm and connect
        port = await pg.evaluate("(() => { const w = __ov.hands.where('ivport'); return w && w.at; })()")
        ok("the IV port is on the patient (right antecubital)", port is not None, json.dumps(port))
        if port: await pg.evaluate("(a) => __ov.world.standLook(a[0] - 0.75, a[2] + 0.2, a)", port); await pg.wait_for_timeout(1200)
        await shot("k03-at-the-arm"); w = await click_thing("ivport"); st = await pg.evaluate(KIT)
        ok("clicking the port connects the syringe", st and st["onPort"] == "s1" and st["rows"][0]["connected"], json.dumps({"where": w, "kit": st})); await shot("k04-connected")
        # ---- push, stop, push again
        r0 = await pg.evaluate(REC); w = await where("push:s1"); ok("the plunger can be reached once connected", w and w.get("usable"), json.dumps(w))
        if w:
            await pg.mouse.move(w["x"], w["y"]); await pg.wait_for_timeout(300)
            dbg = await pg.evaluate("({ hover: __ov.hands.hover && __ov.hands.hover.id, enabled: __ov.world.enabled, locked: __ov.world.locked })"); print("DEBUG before press", dbg)
            await pg.mouse.down(); await pg.wait_for_timeout(1000)
            dbg = await pg.evaluate("({ busy: __ov.hands.busy, hover: __ov.hands.hover && __ov.hands.hover.id, kit: __ov.periop.kits.find(q => q.name === 'drugs').state().pushing })"); print("DEBUG during press", dbg)
            await pg.wait_for_timeout(2000); await shot("k05-pushing"); await pg.mouse.up(); await pg.wait_for_timeout(600)
        r1 = await pg.evaluate(REC); await pg.wait_for_timeout(2000); r1b = await pg.evaluate(REC)
        ok("holding the plunger 3 s gives about 1.5 mL (15 mg) in several parts; the engine got exactly what the record says", 10 <= r1["givenMg"] <= 20 and r1["pushes"] >= 3 and abs(r1["engineMg"] - r1["givenMg"]) < 1e-6, json.dumps(r1))
        ok("after the button is released nothing more is given", r1b["givenMg"] == r1["givenMg"], json.dumps(r1b))
        w = await where("push:s1")
        if w: await pg.mouse.move(w["x"], w["y"]); await pg.wait_for_timeout(200); await pg.mouse.down(); await pg.wait_for_timeout(2000); await pg.mouse.up(); await pg.wait_for_timeout(600)
        r2 = await pg.evaluate(REC); part = r2["givenMg"] - r1b["givenMg"]
        ok("a second 2 s hold adds only the new part (about 10 mg); record and engine still agree", 6 <= part <= 14 and abs(r2["engineMg"] - r2["givenMg"]) < 1e-6 and not r2["given"], json.dumps({"second_part_mg": round(part, 3), **r2}))
        said = await pg.evaluate("__ov.periop.case.lastSay || ''"); ok("the case says what was pushed and what is left", "ml pushed" in said.lower() and "left" in said.lower(), said)
        # ---- take it off, put it back
        w = await click_thing("syr:s1"); held = await pg.evaluate("__ov.hands.held && __ov.hands.held.id"); ok("clicking the syringe on the port takes it off into the hand", held == "syr:s1", json.dumps(w))
        await pg.keyboard.press("x"); await pg.wait_for_timeout(700); st = await pg.evaluate(KIT); held = await pg.evaluate("__ov.hands.held && __ov.hands.held.id")
        ok("X puts it back on the tray, partly used, not connected", held is None and st["rows"][0]["connected"] is False and st["onPort"] is None and 17 < st["rows"][0]["left"] < 18.8, json.dumps(st))
        await pg.keyboard.press("3"); await pg.wait_for_timeout(1200); await shot("k06-back-on-tray")
        ok("no page errors", not [e for e in errs if not e.startswith("console: Failed to load resource")], json.dumps(errs[:6]))
        json.dump(R, open(f"{OUT}/kit_check.json", "w"), indent=1); print(f"{sum(r['pass'] for r in R)} of {len(R)} passed")
        await ctx.close(); await b.close()

asyncio.run(main())
