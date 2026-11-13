"""clinical_check.py: the operating room, the regional bay and pre-op holding as rooms, walked with REAL keyboard and mouse input and recorded.
     uv run --with playwright python3 tools/clinical_check.py OUT_DIR tools/test-account.example.json [PORT]
   Needs the dev server:  python3 tools/dev_server.py 8091
   What it is: a functional check that the equipment loads and stands where it should, that the rooms can be entered and
   used, that solid things are solid, that with no patient in the room the monitors say STANDBY and show no trace, and that
   the ultrasound says on its own face that it is not a scan. Running a case is tools/periop_check.py.
   What it is not: a judgment of how the rooms look (the visual review), of frame rate (tools/perf_check.py, in a visible
   browser), of real devices, or of clinical content: nothing is taught or scored from this equipment.
   Page internals are read to confirm results, never to perform an action, except where a line says "test setup"."""
import sys, asyncio, json, glob, os, shutil
from playwright.async_api import async_playwright
OUT = sys.argv[1]; ACC = json.load(open(sys.argv[2])); PORT = sys.argv[3] if len(sys.argv) > 3 else "8091"; B = f"http://127.0.0.1:{PORT}/world/"; R = []
os.makedirs(OUT, exist_ok=True)
def ok(name, cond, detail=""):
    R.append({"group": "functional", "pass": bool(cond), "check": name, "detail": str(detail)[:220]}); print(("PASS " if cond else "FAIL ") + name + (" :: " + str(detail)[:190] if detail else ""), flush=True)
WORLD = "window.__ov && __ov.world && __ov.places && document.getElementById('veil').classList.contains('off') && document.body.dataset.screen === 'world' && !document.getElementById('wipe').className"
# what a display's canvas holds: a fingerprint of its pixels, how many are lit, how many are the green of a live trace, and how many are the amber of a DEMO tag
PIX = """(name) => { const o = __ov.exhibits.clinical.screens[name]; if (!o || !o.material.map) return null; const c = o.material.map.image, g = c.getContext('2d'), d = g.getImageData(0, 0, c.width, c.height).data; let h = 0; for (let i = 0; i < d.length; i += 97) h = (h * 31 + d[i]) >>> 0;
  const at = (x, y) => { const p = g.getImageData(x, y, 1, 1).data; return [p[0], p[1], p[2]]; }; let amber = 0, lit = 0, green = 0; for (let i = 0; i < d.length; i += 4) { if (d[i] > 225 && d[i + 1] > 160 && d[i + 1] < 200 && d[i + 2] < 70) amber++; if (d[i] + d[i + 1] + d[i + 2] > 200) lit++; if (Math.abs(d[i] - 62) < 40 && Math.abs(d[i + 1] - 224) < 40 && Math.abs(d[i + 2] - 106) < 40) green++; } return { hash: h, w: c.width, h: c.height, amber, lit, green, tag: at(14, 12) }; }"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(channel="chrome", args=["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist", "--autoplay-policy=no-user-gesture-required"])
        ctx = await b.new_context(viewport={"width": 1280, "height": 760}, record_video_dir=OUT + "/_vid", record_video_size={"width": 1280, "height": 760})
        pg = await ctx.new_page(); errs = []; asked = []
        pg.on("pageerror", lambda e: errs.append(str(e)[:300])); pg.on("console", lambda m: errs.append("console: " + m.text[:240]) if m.type == "error" and "404" not in m.text else None); pg.on("request", lambda r: asked.append(r.url))
        shot = lambda n: pg.screenshot(path=f"{OUT}/{n}.jpg", quality=88, type="jpeg")
        P = lambda: pg.evaluate("({x: __ov.world.P.x, z: __ov.world.P.z, room: __ov.world.room})")
        async def forward(until, limit=6.0):                                   # hold W (walk the way you face) until a condition on your position holds
            await pg.keyboard.down("KeyW"); t = 0; q = await P()
            while t < limit and not until(q): await pg.wait_for_timeout(50); t += 0.05; q = await P()
            await pg.keyboard.up("KeyW"); await pg.wait_for_timeout(450); return await P()
        async def look(dx, dy=0, steps=24):                                    # drag on the view, as a learner turns to look
            await pg.mouse.move(640, 400); await pg.mouse.down(); await pg.mouse.move(640 + dx, 400 + dy, steps=steps); await pg.mouse.up(); await pg.wait_for_timeout(500)
        # ---- test setup: the throwaway account, a character, and a camera that looks north so that W A S D follow the compass
        await pg.goto(B + "blank.html"); await pg.evaluate("""async ([u, p]) => { const a = await import('/core/auth.js'); let r = await a.loginUser(u, p); if (!r.success) { await a.registerUser(u, p); r = await a.loginUser(u, p); }
          const s = await import('/world/js/save.js'); localStorage.removeItem(s.key()); const st = s.load(); st.character = { name: 'Tester', person: 'scrubs', colour: 'teal' }; s.save(st); }""", [ACC["username"], ACC["password"]])
        await pg.goto(B); await pg.wait_for_function(WORLD, timeout=120000); await pg.wait_for_function("__ov.exhibits && __ov.exhibits.hasClinical", timeout=120000); await pg.wait_for_timeout(2500); await pg.mouse.move(640, 380)
        names = await pg.evaluate("Object.keys(__ov.exhibits.clinical.pieces)"); need = ["eq_op_table", "eq_anesthesia_machine", "eq_surgical_lights", "eq_emergency_cart", "eq_ultrasound", "eq_stretcher", "eq_curtain_bay", "eq_vitals_monitor"]
        ok("the equipment file loads and its pieces stand in the level", all(n in names for n in need) and len(names) >= 24, f"{len(names)} pieces")
        rooms = await pg.evaluate("(() => { const r = {}, w = __ov.world; for (const [n, k] of Object.entries(__ov.exhibits.clinical.pieces)) { const b = new (k.position.constructor)(); k.getWorldPosition(b); const c = w.roomAt(b.x, 1, b.z, 0.2); r[c] = (r[c] || 0) + 1; } return r; })()")
        ok("every piece is inside the operating room, the regional room or pre-op holding", set(rooms) <= {"or", "regional", "preop"} and rooms.get("or", 0) >= 14 and rooms.get("regional", 0) >= 6 and rooms.get("preop", 0) >= 12, json.dumps(rooms))
        beds = [n for n in names if n.startswith("eq_stretcher_flat")]; curtains = [n for n in names if n.startswith("eq_curtain_bay")]; signs = await pg.evaluate("['bay1', 'bay2', 'bay3', 'bay4', 'schedule'].filter(k => __ov.world.signs[k] && __ov.world.signs[k].material.map)")
        ok("pre-op holding has its four stretchers, its curtains, a lit display at each bay and the schedule board", len(beds) == 4 and len(curtains) >= 5 and len(signs) == 5, f"{len(beds)} stretchers, {len(curtains)} curtain sets, displays {signs}")
        ok("nothing is asked of the licensed equipment pack that used to fill this room", not any("/local/or-pack" in u for u in asked), f"{len(asked)} requests")
        # ---- the operating room, entered on foot
        await pg.evaluate("__ov.world.standAt(3.4, -14.05, 9, -14.05)"); await pg.wait_for_timeout(900)          # test setup: start in the court, facing the operating room's door
        q0 = await P(); q1 = await forward(lambda q: q["x"] >= 6.0)
        ok("walk from the court through the sliding door into the operating room with the keyboard", q0["room"] == "court" and q1["room"] == "or" and q1["x"] > 5.3, json.dumps([q0, q1])); await pg.wait_for_timeout(700); await shot("c01-or-entry")
        await look(-150); await shot("c02-or-look-left"); await look(300); await shot("c03-or-look-right"); await look(-150)
        prompt = await pg.inner_text("#wPrompt"); await pg.keyboard.press("KeyE"); await pg.wait_for_function("!document.getElementById('wPlace').hidden", timeout=25000); await pg.wait_for_timeout(700); txt = await pg.inner_text("#wPlace"); low = txt.lower()
        ok("the station opens with E and states what works, what is approximated and what is not built", "operating room" in prompt.lower() and all(k in low for k in ["works", "approximated", "not built", "student workstation"]), txt.replace("\n", " ")[:120])
        ok("the panel says the monitors are on standby until a patient is connected, and lists who is waiting", "standby until a patient is connected" in low and "waiting in pre-op holding" in low); await shot("c04-or-panel")
        await pg.click('[data-m="work"]'); await pg.wait_for_timeout(1400); w = await pg.evaluate("__ov.world.stations.find(s => s.key === 'or').table"); q = await P()
        ok("'Take the anesthesia position' stands you at the head of the table", abs(q["x"] - w[0]) < 0.1 and abs(q["z"] - (w[1] - 1.26)) < 0.1 and q["room"] == "or", json.dumps(q)); await shot("c05-or-anesthesia-position")
        await pg.keyboard.down("KeyS"); await pg.wait_for_timeout(500); await pg.keyboard.up("KeyS"); await pg.wait_for_timeout(300); q2 = await P()
        ok("and leaves you free to move from there", abs(q2["x"] - q["x"]) + abs(q2["z"] - q["z"]) > 0.15, json.dumps(q2))
        a = await pg.evaluate(f"({PIX})('monitor')"); await pg.wait_for_timeout(450); b2 = await pg.evaluate(f"({PIX})('monitor')"); v1 = await pg.evaluate(f"({PIX})('vent')"); await pg.wait_for_timeout(450); v2 = await pg.evaluate(f"({PIX})('vent')")
        ok("with no patient in the room the patient monitor and the ventilator display say STANDBY and stay still", a and b2 and a["hash"] == b2["hash"] and v1["hash"] == v2["hash"] and a["lit"] > 1500 and v1["lit"] > 600, json.dumps([a, v1])[:200])
        ok("neither shows a trace, a number or a demonstration patient: nothing is drawn that a sensor would have to supply", a["green"] == 0 and v1["green"] == 0 and a["amber"] == 0 and v1["amber"] == 0, json.dumps([a["green"], a["amber"], v1["green"], v1["amber"]]))
        await look(-330, 20); await pg.wait_for_timeout(700); await shot("c06-or-workstation"); await look(330, -20)
        await pg.evaluate("__ov.world.standAt(7.0, -15.95, 9.5, -15.95)"); await pg.wait_for_timeout(700)             # test setup: stand west of the table, facing it
        q = await forward(lambda q: False, 1.8)
        ok("the operating table is solid: walking at it stops you at its edge", q["x"] < 8.2, json.dumps(q)); await shot("c07-or-at-table")
        # ---- the regional bay, entered on foot
        await pg.evaluate("__ov.world.standAt(-3.4, -15.2, -9, -15.2)"); await pg.wait_for_timeout(900)           # test setup: back in the court, facing the regional room's door
        q0 = await P(); q1 = await forward(lambda q: q["x"] <= -6.7)
        ok("walk from the court into the regional room with the keyboard", q0["room"] == "court" and q1["room"] == "regional", json.dumps([q0, q1])); await shot("c08-regional-entry")
        await look(-210, 10); await pg.wait_for_timeout(600); await shot("c09-regional-bay")
        await pg.keyboard.press("KeyE"); await pg.wait_for_function("!document.getElementById('wPlace').hidden", timeout=25000); await pg.wait_for_timeout(700); txt = await pg.inner_text("#wPlace"); low = txt.lower()
        ok("the bay's panel says the ultrasound unit is a model whose screen shows a probe held in air", all(k in low for k in ["works", "approximated", "not built", "probe held in air", "no needle path or dose"]), txt.replace("\n", " ")[:120]); await shot("c10-regional-panel")
        await pg.keyboard.press("Escape"); await pg.wait_for_timeout(300)
        if await pg.evaluate("!document.getElementById('wPlace').hidden"): await pg.click("#wPlace [data-x]")
        await pg.wait_for_timeout(900); u1 = await pg.evaluate(f"({PIX})('us')"); m1 = await pg.evaluate(f"({PIX})('monitor')"); await pg.wait_for_timeout(700); u2 = await pg.evaluate(f"({PIX})('us')"); m2 = await pg.evaluate(f"({PIX})('monitor')")
        ok("the ultrasound display is live here and carries the DEMO tag and its 'not a scan' line", u1 and u1["hash"] != u2["hash"] and u1["amber"] > 600, json.dumps([u1, u2])[:150])
        ok("displays in a room you are not looking into are left alone (the operating room's monitor is not redrawn from here)", m1["hash"] == m2["hash"])
        await pg.evaluate("__ov.world.standAt(-7.6, -14.9, -8.9, -13.4)"); await pg.wait_for_timeout(600)             # test setup: stand at the foot of the bay, facing the stretcher
        q = await forward(lambda q: False, 1.6); await shot("c11-regional-at-stretcher")
        ok("the stretcher is solid", not (-9.3 < q["x"] < -8.5 and -14.4 < q["z"] < -12.45), json.dumps(q))
        st = await pg.evaluate("__ov.world.stats()"); ok("no script errors during the run", not errs, errs[:3]); print("stats", json.dumps(st))
        await ctx.close(); await b.close()
    v = sorted(glob.glob(OUT + "/_vid/*.webm"), key=os.path.getsize)[-1]; shutil.move(v, OUT + "/clinical.webm"); shutil.rmtree(OUT + "/_vid", ignore_errors=True)
    print(f"\n{sum(1 for r in R if r['pass'])} of {len(R)} functional checks pass"); json.dump(R, open(OUT + "/clinical-results.json", "w"), indent=1)
asyncio.run(main())
