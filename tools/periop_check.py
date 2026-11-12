"""periop_check.py: pre-op holding and a whole anesthetic in the operating room, done with REAL mouse and keyboard and recorded.
     uv run --with playwright python3 tools/periop_check.py OUT_DIR tools/test-account.example.json [PORT]
   Needs the dev server:  python3 tools/dev_server.py 8091
   What it is: a functional check that the day's patients are in the building as people, that the Student Workstation opens
   beside them, that a patient can be taken to the operating room, and that a whole case can be run there on the app's own
   engine from the first monitor to handover, with the room's monitor showing the engine and the record saying who scored what.
   What it is not: a judgement of clinical content (the engine, the rubrics and the patients are the app's own and are not
   reviewed here), of how the rooms look, of frame rate, or of any real device. The engine itself is checked without a
   browser by tools/cases_check.mjs.
   Every action is a click, a key or typing. Page internals are read to confirm results, never to perform an action, except
   where a line says "test setup". The simulated clock is run at the panel's own 8x setting, and waits are on the patient's
   state, not on fixed times."""
import sys, asyncio, json, os, shutil, glob
from playwright.async_api import async_playwright
OUT = sys.argv[1]; ACC = json.load(open(sys.argv[2])); PORT = sys.argv[3] if len(sys.argv) > 3 else "8091"; B = f"http://127.0.0.1:{PORT}/world/"; R = []
os.makedirs(OUT, exist_ok=True)
def ok(name, cond, detail=""):
    R.append({"group": "functional", "pass": bool(cond), "check": name, "detail": str(detail)[:240]}); print(("PASS " if cond else "FAIL ") + name + (" :: " + str(detail)[:200] if detail else ""), flush=True)
WORLD = "window.__ov && __ov.world && __ov.places && __ov.periop && document.getElementById('veil').classList.contains('off') && document.body.dataset.screen === 'world' && !document.getElementById('wipe').className"
SNAP = "(() => { const C = __ov.periop.case; if (!C) return null; const s = C.runner.snapshot(); return { t: Math.round(s.t), hr: Math.round(s.hr), spo2: Math.round(s.spo2), eto2: Math.round(s.eto2), etco2: Math.round(s.etco2), dev: s.airwayDevice, status: s.status, busy: !!s.intubationInProgress, tofRatio: +s.tofRatio.toFixed(2), rr: Math.round(s.spontaneousRR), tv: Math.round(s.spontaneousTV), mode: s.ventMode, agent: +(+s.vaporizer || 0).toFixed(1), running: !!s.running, say: C.lastSay }; })()"
# what a display's canvas holds: a fingerprint of its pixels and how many pixels are close to a colour
PIX = """([name, rgb]) => { const o = name.startsWith('sign:') ? __ov.world.signs[name.slice(5)] : __ov.exhibits.clinical.screens[name]; if (!o || !o.material.map) return null; const c = o.material.map.image, g = c.getContext('2d'), d = g.getImageData(0, 0, c.width, c.height).data; let h = 0, near = 0, lit = 0;
  for (let i = 0; i < d.length; i += 4) { if (i % 388 === 0) h = (h * 31 + d[i] + d[i + 1] * 3 + d[i + 2] * 7) >>> 0; if (d[i] + d[i + 1] + d[i + 2] > 300) lit++; if (rgb && Math.abs(d[i] - rgb[0]) < 46 && Math.abs(d[i + 1] - rgb[1]) < 46 && Math.abs(d[i + 2] - rgb[2]) < 46) near++; } return { hash: h, lit, near, w: c.width, h: c.height }; }"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(channel="chrome", args=["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist", "--autoplay-policy=no-user-gesture-required"])
        ctx = await b.new_context(viewport={"width": 1280, "height": 760}, record_video_dir=OUT + "/_vid", record_video_size={"width": 1280, "height": 760}, service_workers="block")      # the classic app's service worker would serve yesterday's files to this check
        pg = await ctx.new_page(); errs = []; asked = []
        pg.on("pageerror", lambda e: errs.append(str(e)[:300])); pg.on("console", lambda m: errs.append("console: " + m.text[:240]) if m.type == "error" and "404" not in m.text and "501" not in m.text else None); pg.on("request", lambda r: asked.append((r.method, r.url)))
        shot = lambda n: pg.screenshot(path=f"{OUT}/{n}.jpg", quality=88, type="jpeg")
        P = lambda: pg.evaluate("({x: __ov.world.P.x, z: __ov.world.P.z, room: __ov.world.room})"); S = lambda: pg.evaluate(SNAP)
        async def forward(until, limit=7.0):
            await pg.keyboard.down("KeyW"); t = 0; q = await P()
            while t < limit and not until(q): await pg.wait_for_timeout(50); t += 0.05; q = await P()
            await pg.keyboard.up("KeyW"); await pg.wait_for_timeout(450); return await P()
        async def until(js, seconds=120):                                       # wait on the patient's state
            try: await pg.wait_for_function(js, timeout=seconds * 1000); return True
            except Exception: return False
        HUD = "#caseHud"
        async def tab(t):
            await pg.click(f'{HUD} [data-tab="{t}"]'); await pg.wait_for_timeout(180)
        async def act(*ids):                                                    # press a step's button, opening its phase first if it is folded
            if await pg.evaluate("(document.querySelector('#caseHud .body') || {dataset: {}}).dataset.tab") != "steps": await tab("steps")
            for i in ids:
                if not await pg.query_selector(f'{HUD} [data-a="{i}"]'):
                    ph = await pg.evaluate("(id) => import('/world/js/cases.js').then(m => m.ACTIONS[id][1])", i); await pg.click(f'{HUD} [data-ph="{ph}"]'); await pg.wait_for_timeout(160)
                await pg.click(f'{HUD} [data-a="{i}"]'); await pg.wait_for_timeout(200)
        async def draw(drug, amount, unit):
            await tab("drugs"); await pg.select_option(f"{HUD} [name=drug]", drug); await pg.fill(f"{HUD} [name=amt]", str(amount)); await pg.select_option(f"{HUD} [name=unit]", unit); await pg.click(f"{HUD} form[data-f=draw] button"); await pg.wait_for_timeout(220)
        async def give(label):                                                  # give the syringe whose label names this drug
            await tab("drugs"); await pg.locator(f"{HUD} .syr", has_text=label).locator("[data-give]").click(); await pg.wait_for_timeout(220)
        async def say(text):
            await pg.fill(f"{HUD} [name=q]", text); await pg.keyboard.press("Enter"); await pg.wait_for_timeout(260)
        async def vent(**kw):
            await tab("machine")
            for k, v in kw.items():
                if k == "mode": await pg.select_option(f"{HUD} [name=mode]", str(v))
                else: await pg.fill(f"{HUD} [name={k}]", str(v))
            await pg.click(f"{HUD} form[data-f=vent] button.on"); await pg.wait_for_timeout(220)
        # ---- test setup: the throwaway account, a fresh save, a character, sound off (so that no speech is bought by this check)
        await pg.goto(B + "blank.html"); await pg.evaluate("""async ([u, p]) => { const a = await import('/core/auth.js'); let r = await a.loginUser(u, p); if (!r.success) { await a.registerUser(u, p); r = await a.loginUser(u, p); }
          const s = await import('/world/js/save.js'); localStorage.removeItem(s.key()); const st = s.load(); st.character = { name: 'Tester', person: 'scrubs', colour: 'teal' }; s.save(st); localStorage.setItem('overlord_world_mute', '1');
          for (const k of Object.keys(localStorage)) if (k.startsWith('overlord.careplan.v1.') || k === 'overlord.student.session.v1') localStorage.removeItem(k); }""", [ACC["username"], ACC["password"]])
        await pg.goto(B); await pg.wait_for_function(WORLD, timeout=120000); await pg.wait_for_function("__ov.exhibits && __ov.exhibits.hasClinical", timeout=120000); await pg.evaluate("__ov.periop.ready"); await pg.wait_for_timeout(2000); await pg.mouse.move(640, 380)
        # ================================================================ pre-op holding
        sched = await pg.evaluate("import('/world/js/cases.js').then(m => m.loadSchedule()).then(l => l.map(p => ({ id: p.id, ok: p.engineSupported, an: p.anesthesia, name: p.label })))"); bays = await pg.evaluate("__ov.periop.bays.slice()")
        ok("the day's schedule is the app's own mock OR day, and four of its patients are waiting in bays", len(sched) == 56 and len(bays) == 4 and all(any(q["id"] == x for q in sched) for x in bays), f"{len(sched)} patients; bays {bays}")
        ppl = await pg.evaluate("__ov.periop.bayPeople().map((p, i) => p && { own: p.own, room: __ov.world.roomAt(p.root.position.x, 1, p.root.position.z), y: +p.root.position.y.toFixed(2), tris: (() => { let n = 0; p.root.traverse(o => { if (o.isMesh) n += (o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count) / 3; }); return Math.round(n); })(), shown: p.root.parent === __ov.world.scene })")
        ok("each of the four is in the room as a figure lying on a stretcher", all(q and q["room"] == "preop" and q["shown"] and 0.6 < q["y"] < 0.9 and q["tris"] > 500 for q in ppl), json.dumps(ppl)[:220])
        own = sum(1 for q in ppl if q and q["own"]); manifest = await pg.evaluate("Object.keys(__ov.periop.people).length")
        ok("how many of those figures are the patient's own generated body, not the shared stand-in (reported, not required)", True, f"{own} of 4 in the bays; {manifest} of 56 listed in assets/people/patients.json")
        await pg.evaluate("__ov.world.standAt(-3.3, -6.1, -9, -6.1)"); await pg.wait_for_timeout(900)          # test setup: start in the court, facing the door of pre-op holding
        q0 = await P(); q1 = await forward(lambda q: q["x"] <= -6.3)
        ok("walk from the court into pre-op holding with the keyboard", q0["room"] == "court" and q1["room"] == "preop" and q1["x"] < -5.4, json.dumps([q0, q1])); await pg.wait_for_timeout(600); await shot("p01-preop-entry")
        await pg.evaluate("__ov.world.standAt(-9.1, -6.5, -9.3, -8.28)"); await pg.wait_for_timeout(700)          # test setup: stand at bay 1's ring
        prompt = await pg.inner_text("#wPrompt"); await pg.keyboard.press("KeyE"); await pg.wait_for_function("!document.getElementById('wPlace').hidden", timeout=8000); await pg.wait_for_timeout(1300); txt = await pg.inner_text("#wPlace"); low = txt.lower(); who = next(q["name"] for q in sched if q["id"] == bays[0]).replace("CN Rubric · ", "")
        ok("a bay opens with E and names its patient, with age, weight, procedure and allergies from the chart", "bay 1" in prompt.lower() and who.lower() in low and " kg" in low and ("allerg" in low), txt.replace("\n", " ")[:150]); await shot("p02-bay1")
        go = await pg.get_attribute('#wPlace [data-m="go"]', "disabled"); skip = await pg.query_selector('#wPlace [data-m="skip"]')
        ok("without a submitted care plan the operating room is held back, as the classic app holds it, and the bypass is named 'as practice'", go is not None and skip is not None and "recorded as unplanned" in low)
        disp = await pg.evaluate(f"({PIX})(['sign:bay1', [241, 244, 245]])"); empty_like = await pg.evaluate(f"({PIX})(['sign:cases', null])")
        ok("the bay's wall display is drawn from the same patient (it carries text)", disp and disp["lit"] > 1500 and disp["near"] > 300, json.dumps(disp))
        spot = await pg.evaluate("(id) => { const cl = __ov.exhibits.clinical, ph = __ov.periop.byId[id].physiology, near = Object.values(cl.spots).filter(s => Math.hypot(s.at.x + 9.3, s.at.z + 8.28) < 1.6); return { n: Object.keys(cl.spots).length, data: near[0] && near[0].data, ph: { hr: ph.baselineHR, sbp: ph.baselineSystolic, spo2: ph.baselineSpO2 }, idle: Object.values(cl.spots).filter(s => !s.data).length }; }", bays[0])
        ok("the stand monitor beside the bay shows that patient's last recorded vital signs from the chart, not a picture of someone else's", spot["data"] and spot["data"]["hr"] == spot["ph"]["hr"] and spot["data"]["sbp"] == spot["ph"]["sbp"] and spot["data"]["spo2"] == spot["ph"]["spo2"] and spot["data"]["when"] and spot["idle"] >= 1, json.dumps(spot)[:220])
        # ---- the Student Workstation, inside the building
        await pg.click('#wPlace [data-m="desk"]'); await pg.wait_for_function("!document.getElementById('desk').hidden", timeout=8000); fr = pg.frame_locator("#deskFrame"); src = await pg.get_attribute("#deskFrame", "src")
        seen = False
        for _ in range(40):
            try:
                body = (await fr.locator("body").inner_text(timeout=1500)).lower()
                if who.split(". ")[-1].lower() in body: seen = True; break
            except Exception: pass
            await pg.wait_for_timeout(500)
        ok("'Open the chart' brings up the Student Workstation over the building, on this patient", src.endswith("/student.html") and seen, f"{src} · patient named in the page: {seen}"); await pg.wait_for_timeout(800); await shot("p03-workstation")
        state = (await pg.inner_text("#deskState")).lower(); hidden_go = await pg.evaluate("document.getElementById('deskGo').hidden")
        ok("its bar says where the care plan stands and offers the operating room only once the plan is in", "care plan" in state and hidden_go, state)
        await pg.click("#deskBack"); await pg.wait_for_timeout(900); back = await pg.evaluate("document.getElementById('desk').hidden && !document.getElementById('wPlace').hidden")
        ok("'Back to the bay' returns to the same bay", back)
        await pg.keyboard.press("Escape"); await pg.wait_for_timeout(600)
        # ---- the schedule board
        await pg.evaluate("__ov.world.standAt(-8.0, -6.45, -10.62, -6.6)"); await pg.wait_for_timeout(700); prompt = await pg.inner_text("#wPrompt"); await pg.keyboard.press("KeyE"); await pg.wait_for_function("!document.getElementById('wPlace').hidden", timeout=8000); await pg.wait_for_timeout(1300)      # test setup: stand at the board's ring
        rows = await pg.locator("#wPlace [data-p]").count(); board = await pg.evaluate(f"({PIX})(['sign:schedule', [232, 237, 240]])")
        ok("the schedule board opens and lists every patient of the day, on the wall and in the panel", "schedule" in prompt.lower() and rows == 56 and board and board["near"] > 4000, f"{rows} rows; board {json.dumps(board)}"); await shot("p04-schedule")
        await pg.fill("#ptFilter", "hernia"); await pg.wait_for_timeout(300); few = await pg.locator("#wPlace [data-p]").count()
        ok("typing in the board's search narrows the list", 0 < few < 12, f"{few} rows for 'hernia'")
        spinal = next(q for q in sched if q["ok"] and "spinal" in q["an"].lower()); tiny = next(q for q in sched if not q["ok"])
        await pg.fill("#ptFilter", ""); await pg.click('#wPlace [data-bay="3"]'); await pg.click(f'#wPlace [data-p="{spinal["id"]}"]'); await pg.wait_for_timeout(2500); b3 = await pg.evaluate("__ov.periop.bays[2]"); p3 = await pg.evaluate("(() => { const p = __ov.periop.bayPeople()[2]; return !!p && p.root.parent === __ov.world.scene; })()")
        ok("choosing a patient on the board brings that person to the chosen bay", b3 == spinal["id"] and p3, f"bay 3: {b3}")
        await pg.evaluate("__ov.world.standAt(-9.1, -5.7, -9.3, -3.92)"); await pg.wait_for_timeout(700); await pg.keyboard.press("KeyE"); await pg.wait_for_function("!document.getElementById('wPlace').hidden", timeout=8000); await pg.wait_for_timeout(1200); low = (await pg.inner_text("#wPlace")).lower()      # test setup: stand at bay 3's ring
        ok("a patient scheduled for a spinal keeps chart and plan here, and the panel says this room does not run that case", "general anesthetics with a tube" in low and not await pg.query_selector('#wPlace [data-m="go"]') and await pg.query_selector('#wPlace [data-m="desk"]') is not None, low.replace("\n", " ")[:140]); await shot("p05-bay3-spinal")
        await pg.click('#wPlace [data-m="call"]'); await pg.wait_for_timeout(500); await pg.click(f'#wPlace [data-p="{tiny["id"]}"]'); await pg.wait_for_timeout(2500); await pg.keyboard.press("KeyE"); await pg.wait_for_function("!document.getElementById('wPlace').hidden", timeout=8000); await pg.wait_for_timeout(1200); low = (await pg.inner_text("#wPlace")).lower()
        ok("a patient outside the simulator's range is chart and care plan only, and says why", "chart and care plan only" in low and "20 kg" in low and not await pg.query_selector('#wPlace [data-m="go"]'), low.replace("\n", " ")[:140])
        await pg.keyboard.press("Escape"); await pg.wait_for_timeout(500)
        # ---- with a care plan in, the way to the operating room opens
        await pg.evaluate("(id) => localStorage.setItem('overlord.careplan.v1.' + id, JSON.stringify({ values: { plan: 'check' }, submittedAt: Date.now(), grade: { percent: 88 } }))", bays[0])      # test setup: a submitted, graded plan for the first patient (writing one by hand is the Student Workstation's own check)
        await pg.evaluate("__ov.world.standAt(-9.1, -6.5, -9.3, -8.28)"); await pg.wait_for_timeout(700); await pg.keyboard.press("KeyE"); await pg.wait_for_function("!document.getElementById('wPlace').hidden", timeout=8000); await pg.wait_for_timeout(1200); low = (await pg.inner_text("#wPlace")).lower(); go = await pg.get_attribute('#wPlace [data-m="go"]', "disabled")
        ok("once the care plan is submitted the bay says so and 'Take to the operating room' is live", "care plan submitted (88%)" in low and go is None and not await pg.query_selector('#wPlace [data-m="skip"]'))
        # ================================================================ the operating room: a whole case
        await pg.click('#wPlace [data-m="go"]'); await pg.wait_for_function("__ov.periop.case && !document.getElementById('wipe').className && !document.getElementById('caseHud').hidden", timeout=30000); await pg.wait_for_timeout(1500)
        st = await pg.evaluate("(() => { const p = __ov.periop, q = p.patient; return { kind: p.case.kind, own: !!p.case.own, room: __ov.world.room, bay: p.bays[0], at: q && [q.root.position.x, q.root.position.y, q.root.position.z].map(v => +v.toFixed(2)), view: document.getElementById('caseHud').dataset.view, started: p.run.started, unplanned: p.run.unplanned, live: !!__ov.exhibits.clinical.live }; })()")
        ok("the patient leaves the bay and is on the operating table, and you are at the head of it with the case brief", st["room"] == "or" and st["bay"] is None and st["at"] and abs(st["at"][0] - 8.6) < 0.05 and abs(st["at"][1] - 0.9) < 0.05 and st["view"] == "brief" and not st["started"] and not st["unplanned"], json.dumps(st)); await shot("o01-brief")
        brief = (await pg.inner_text(HUD)).lower(); ok("the brief offers two ways to run it and says how each is recorded", "with the step list" in brief and "from memory" in brief and "assisted" in brief and "unaided" in brief and "clock starts when you choose" in brief)
        t0 = await S(); await pg.wait_for_timeout(1200); t1 = await S(); await pg.click(f'{HUD} [data-start="list"]'); await pg.wait_for_timeout(1600); t2 = await S()
        ok("the clock does not run until you choose, then it runs", t0["t"] == t1["t"] and t2["t"] > t1["t"] and t2["running"], json.dumps([t0["t"], t1["t"], t2["t"]]))
        mon = await pg.evaluate("__ov.exhibits.clinical.live.m.mon"); m0 = await pg.evaluate(f"({PIX})(['monitor', [62, 224, 106]])")
        ok("the patient monitor shows this patient but no trace or number until a sensor is on", not mon["spo2"] and not mon["ecg"] and not mon["nibp"] and not mon["gas"] and m0 and m0["near"] < 1000, json.dumps([mon, m0]))      # the channel labels and dashes are there; no trace is
        await pg.click(f'{HUD} [data-view="monitor"]'); await pg.wait_for_timeout(1100); await shot("o02-monitor-nothing-connected")
        await act("ppe", "timeout", "spo2", "nibp", "ecg"); await pg.wait_for_timeout(1500); mon = await pg.evaluate("__ov.exhibits.clinical.live.m.mon"); m1 = await pg.evaluate(f"({PIX})(['monitor', [62, 224, 106]])"); await pg.wait_for_timeout(500); m2 = await pg.evaluate(f"({PIX})(['monitor', [62, 224, 106]])"); s = await S()
        shown = await pg.evaluate("(() => { const L = __ov.exhibits.clinical.live; return { hr: Math.round(L.m.shown.hr), spo2: Math.round(L.m.shown.spo2), nibp: L.m.nibp }; })()")
        ok("putting on the oximeter, cuff and leads brings up their channels, live, with the engine's own numbers", mon["spo2"] and mon["ecg"] and mon["nibp"] and not mon["gas"] and m1["near"] > m0["near"] + 1200 and m1["hash"] != m2["hash"] and shown["hr"] == s["hr"] and shown["spo2"] == s["spo2"] and shown["nibp"], json.dumps([shown, s["hr"], s["spo2"], m1["near"]])); await pg.wait_for_timeout(500); await shot("o03-monitor-connected")
        board = await pg.evaluate("__ov.exhibits.clinical.live.board"); ok("the room board carries the patient, the allergies and the time-out", who in board["name"] and board["timeout"] and board["allergies"], json.dumps(board)[:200])
        cam = await pg.evaluate("__ov.world.camera.position.toArray().map(v => +v.toFixed(2))"); await pg.click(f'{HUD} [data-view="walk"]'); await pg.wait_for_timeout(700); q0 = await P(); await pg.keyboard.down("KeyS"); await pg.wait_for_timeout(450); await pg.keyboard.up("KeyS"); await pg.wait_for_timeout(300); q1 = await P(); await pg.click(f'{HUD} [data-view="patient"]'); await pg.wait_for_timeout(1000); cam2 = await pg.evaluate("__ov.world.camera.position.toArray().map(v => +v.toFixed(2))")
        ok("the views move your eyes (monitor, patient) and 'Walk' gives your feet back", abs(cam[0] - 7.5) < 1.2 and abs(q1["z"] - q0["z"]) + abs(q1["x"] - q0["x"]) > 0.1 and abs(cam2[0] - 8.6) < 0.4 and cam2[1] > 1.6, json.dumps([cam, q0, q1, cam2]))
        await act("baseline", "machine", "suction", "airwaykit", "iv")
        # ---- drugs: drawn up and labelled by hand, refused when absurd
        await draw("Propofol", 5000, "mg"); bad = await S(); n_bad = await pg.evaluate("__ov.periop.case.syringes.length")
        await draw("Propofol", 2, "mg/kg"); await draw("Fentanyl", 100, "mcg"); await draw("Rocuronium", 0.6, "mg/kg"); syr = await pg.evaluate("({ list: __ov.periop.case.syringes.map(q => [q.drug, q.cls, Math.round(q.totalMg * 100) / 100]), on: __ov.periop.props.syr.children.length })")
        ok("a dose far outside the engine's range is refused; three real ones are drawn up, labelled by class, and lie on the worktop", n_bad == 0 and len(syr["list"]) == 3 and syr["on"] == 3 and syr["list"][0][1] == "induction" and syr["list"][1][1] == "opioid" and syr["list"][2][1] == "relaxant", f"{bad['say'][:70]} | {json.dumps(syr)}")
        await pg.click(f'{HUD} [data-view="worktop"]'); await pg.wait_for_timeout(1100); await shot("o04-worktop-syringes"); await pg.click(f'{HUD} [data-view="patient"]'); await pg.wait_for_timeout(800)
        # ---- pre-oxygenation, at the panel's own 8x clock
        await pg.click(f'{HUD} [data-speed="8"]'); await act("sniff", "preox"); await pg.wait_for_timeout(900); vis = await pg.evaluate("({ mask: __ov.periop.props.maskG.visible, gas: __ov.exhibits.clinical.live.m.mon.gas })")
        ok("the mask goes on the patient's face and only then does the gas channel come up", vis["mask"] and vis["gas"], json.dumps(vis)); await shot("o05-mask-on")
        got = await until("(() => { const s = __ov.periop.case.runner.snapshot(); return s.eto2 > 90 && s.t > 185; })()", 90); await act("eto2"); s = await S()
        ok("three minutes of 100% oxygen bring the end-tidal oxygen above 90% (waited on the patient, not on a timer)", got and s["eto2"] > 90, json.dumps(s))
        # ---- induction: a typed step, a spoken-style order, and syringes given by their labels
        await give("Fentanyl"); await give("Propofol"); got = await until("__ov.periop.case.runner.snapshot().status >= 2", 60); await act("lash", "mask", "apnea"); await give("Rocuronium"); await act("reassess1")
        await say("tape the eyes"); eyes = await pg.evaluate("({ done: !!__ov.periop.case.done.eyes, tapes: __ov.periop.props.tapes.every(t => t.visible) })")
        ok("a step typed in your own words is understood and done ('tape the eyes')", eyes["done"] and eyes["tapes"], json.dumps(eyes))
        got = await until("(() => { const s = __ov.periop.case.runner.snapshot(); return s.tof === 0 || s.tofRatio === 0; })()", 90); await act("tof"); s = await S()
        ok("the patient loses consciousness and the block comes on in the engine's own time", got and s["status"] >= 2, json.dumps(s))
        # ---- laryngoscopy and the tube
        await act("open", "blade"); await pg.wait_for_timeout(700); sc = await pg.evaluate("({ busy: !!__ov.periop.case.runner.snapshot().intubationInProgress, scope: !!(__ov.periop.props.scope && __ov.periop.props.scope.visible), mask: __ov.periop.props.maskG.visible })")
        ok("the blade goes in: the laryngoscope is in the mouth, the mask is off, and the engine's attempt clock is running", sc["busy"] and sc["scope"] and not sc["mask"], json.dumps(sc)); await shot("o06-laryngoscopy")
        await act("view", "tube"); got = await until("__ov.periop.case.runner.snapshot().airwayDevice === 'intubated'", 60); await act("bladeout", "stylet", "cuff", "circuit"); await pg.wait_for_timeout(500)
        tb = await pg.evaluate("({ tube: !!(__ov.periop.props.tube && __ov.periop.props.tube.visible), scope: !!(__ov.periop.props.scope && __ov.periop.props.scope.visible), attempt: __ov.periop.case.lastAttempt })")
        ok("the engine decides the attempt; the tube is in and the circuit is connected", got and tb["tube"] and not tb["scope"] and tb["attempt"] and tb["attempt"]["outcome"] == "succeeded", json.dumps(tb))
        await vent(mode=1, tv=480, rr=12, peep=5, o2=1, air=1); await pg.fill(f"{HUD} [name=dial]", "2"); await pg.click(f"{HUD} form[data-f=agent] button.on"); await pg.wait_for_timeout(300); await shot("o07-machine")
        got = await until("(() => { const s = __ov.periop.case.runner.snapshot(); return s.capnogramPresent && s.etco2 > 20 && s.ventMode === 1; })()", 60); await act("etco2", "chest", "breath", "epigastric", "secure", "reassess2", "agentcheck"); s = await S()
        ok("the ventilator and vaporizer are set from the machine's own controls and the capnogram returns", got and s["mode"] == 1 and s["agent"] == 2.0 and s["etco2"] > 20, json.dumps(s))
        await pg.click(f'{HUD} [data-view="monitor"]'); await pg.wait_for_timeout(1100); await shot("o08-monitor-asleep"); await pg.click(f'{HUD} [data-view="patient"]'); await pg.wait_for_timeout(900); await shot("o09-intubated")
        await act("ready"); await pg.wait_for_timeout(500); ind = await pg.evaluate("(() => { const C = __ov.periop.case, sh = C.sheet('induction'); return { final: sh.final, percent: sh.percent, pass: sh.pass, engine: !!C.final, outcome: C.final && C.final.outcome, by: sh.items.reduce((a, q) => (a[q.by] = (a[q.by] || 0) + 1, a), {}), caveats: sh.items.filter(q => q.caveat).length, missed: sh.criticalsMissed }; })()")
        ok("telling the surgeon you are ready closes the induction rubric by the engine's own rules and pass rule", ind["final"] and ind["engine"] and ind["outcome"] in ("PASS", "FAIL") and ind["percent"] >= 85 and ind["pass"] == (ind["outcome"] == "PASS"), json.dumps(ind))
        ok("the sheet says who scored each item, and says in words where a judgement was not made", ind["by"].get("engine", 0) >= 1 and ind["by"].get("room", 0) >= 8 and ind["caveats"] >= 3, json.dumps(ind["by"]) + f" · {ind['caveats']} items carry a 'not judged here' line")
        # ---- leaving the room stops the patient's clock
        await pg.click(f'{HUD} [data-view="walk"]'); await pg.wait_for_timeout(600); await pg.evaluate("__ov.world.standAt(6.6, -14.05, 3, -14.05)"); await pg.wait_for_timeout(500)      # test setup: stand inside the door, facing the court
        q = await forward(lambda q: q["x"] <= 4.2); await pg.wait_for_timeout(700); a = await pg.evaluate("({ away: __ov.periop.away, running: __ov.periop.case.runner.snapshot().running, hud: document.getElementById('caseHud').hidden, goal: document.getElementById('wGoal').innerText })"); ta = await S(); await pg.wait_for_timeout(1200); tb2 = await S()
        ok("walking out of the room pauses the case and says so; nothing happens to the patient while you are away", q["room"] == "court" and a["away"] and not a["running"] and a["hud"] and "paused" in a["goal"].lower() and ta["t"] == tb2["t"], json.dumps([q, a])[:200]); await shot("o10-away-paused")
        await pg.click("#wGoal [data-go]"); await pg.wait_for_function("__ov.world.room === 'or' && !__ov.periop.away && !document.getElementById('caseHud').hidden", timeout=15000); await pg.wait_for_timeout(1200); tc = await S()
        ok("'Go there' brings you back to the head of the table and the clock runs again", tc["running"])
        # ---- emergence
        await act("closing"); await tab("machine"); await pg.click(f"{HUD} [data-agentoff]"); await vent(o2=10, air=0); await act("tof"); await draw("Sugammadex", 4, "mg/kg"); await give("Sugammadex")
        got = await until("__ov.periop.case.runner.snapshot().tofRatio >= 0.9", 120); await act("tof"); await vent(mode=0)
        got2 = await until("(() => { const s = __ov.periop.case.runner.snapshot(); return s.spont && s.spontaneousRR >= 8 && s.spontaneousTV >= 5 * __ov.periop.case.weightKg; })()", 180); await act("spont", "untape", "suctionop", "loosen", "reassess3")
        got3 = await until("__ov.periop.case.runner.snapshot().status === 0", 240); await act("commands"); s = await S()
        ok("reversal, spontaneous breathing and waking all arrive in the engine's own time", got and got2 and got3 and s["tofRatio"] >= 0.9 and s["status"] == 0, json.dumps(s))
        await act("cuffdown", "extubate"); await pg.wait_for_timeout(600); ex = await pg.evaluate("({ dev: __ov.periop.case.runner.snapshot().airwayDevice, tube: !!(__ov.periop.props.tube && __ov.periop.props.tube.visible), at: __ov.periop.case.atExtubation })")
        ok("the tube comes out, and what the patient was like at that moment is kept", ex["dev"] == "extubated" and not ex["tube"] and ex["at"] and ex["at"]["awake"] and ex["at"]["tofRatio"] >= 0.9, json.dumps(ex)[:200]); await act("o2device", "obstruction", "stable"); await pg.wait_for_timeout(500); await shot("o11-extubated")
        await act("handover"); await pg.wait_for_function("!document.getElementById('wPlace').hidden && document.getElementById('wPlace').innerText.toLowerCase().includes('debrief')", timeout=15000); await pg.wait_for_timeout(900); deb = (await pg.inner_text("#wPlace")).lower(); await shot("o12-debrief")
        last = await pg.evaluate("__ov.periop.last"); ok("handover ends the case with a debrief that shows both rubrics and how the case was run", "case complete" in deb and "emergence" in deb and "run with the step list: recorded as assisted" in deb and "practice evidence" in deb and "your instructor's grade is the grade" in deb, json.dumps(last))
        ok("a careful emergence meets the emergence rubric's pass rule; the saved record carries scores, mode and the carbon dioxide rule used", last["emergence"] is not None and last["emergencePass"] and last["induction"] == ind["percent"] and last["steps"] == "list" and last["co2"] == "stores" and last["unplanned"] is False and last["ended"] == "handover", json.dumps(last))
        rec = await pg.evaluate("(() => { const st = __ov.state, a = st.learning.attempts.filter(q => q.where === 'or'); return { n: a.length, assist: a.map(q => q.assist), objs: a.map(q => q.objective), due: st.learning.due.filter(q => String(q.objective).startsWith('or.')).length, kept: Object.keys(st.game.or.cases) }; })()")
        ok("both rubrics are written to the one learning record as assisted work, and neither queues itself as a review card", rec["n"] == 2 and all(x == "labels" for x in rec["assist"]) and rec["due"] == 0 and bays[0] in rec["kept"], json.dumps(rec))
        await pg.click('#wPlace [data-m="leave"]'); await pg.wait_for_timeout(3000); cl = await pg.evaluate("({ live: !!__ov.exhibits.clinical.live, c: !!__ov.periop.case, bays: __ov.periop.bays.slice(), hud: document.getElementById('caseHud').hidden })"); sb = await pg.evaluate(f"({PIX})(['monitor', [62, 224, 106]])")
        ok("sending the patient to recovery clears the room: monitors back to standby, and the next patient of the day takes the free bay", not cl["live"] and not cl["c"] and cl["hud"] and cl["bays"][0] and cl["bays"][0] != bays[0] and sb["near"] < 200, json.dumps(cl) + f" standby green {sb['near']}"); await shot("o13-room-cleared")
        # ================================================================ from memory, and the first-attempt failure the program's own scenario holds
        rsi = next((q["id"] for q in sched if q["id"] == "p53"), None)
        if rsi:
            await pg.evaluate("__ov.world.standAt(6.3, -14.05, 8.6, -15.6)"); await pg.wait_for_timeout(600)      # test setup: stand at the operating room's ring
            await pg.evaluate("(id) => __ov.periop.setBay(2, id)", rsi); await pg.wait_for_timeout(2500)          # test setup: bring the failed-first-attempt scenario's patient to bay 2
            await pg.keyboard.press("KeyE"); await pg.wait_for_function("!document.getElementById('wPlace').hidden", timeout=8000); await pg.wait_for_timeout(1200); low = (await pg.inner_text("#wPlace")).lower()
            ok("the operating room's own station lists who is waiting and says what works, what is approximated and what is not built", "waiting in pre-op holding" in low and all(k in low for k in ["works", "approximated", "not built"]) and "runs as unplanned practice" in low, low.replace("\n", " ")[:120]); await shot("o14-or-station")
            await pg.click(f'#wPlace [data-in="{rsi}"]'); await pg.wait_for_function("__ov.periop.case && !document.getElementById('wipe').className && !document.getElementById('caseHud').hidden", timeout=30000); await pg.wait_for_timeout(1200); await pg.click(f'{HUD} [data-start="memory"]'); await pg.wait_for_timeout(900)
            mem = await pg.evaluate("({ steps: document.querySelectorAll('#caseHud [data-a]').length, text: document.querySelector('#caseHud .body').innerText.toLowerCase(), kind: __ov.periop.case.kind, unplanned: __ov.periop.run.unplanned })")
            ok("'From memory' shows no step list: the room waits for what you say", mem["steps"] == 0 and "from memory" in mem["text"] and mem["kind"] == "rsi" and mem["unplanned"], json.dumps(mem)[:160])
            await say("gloves and eye protection on, then time out"); await say("pulse ox on and bp cuff and ekg leads"); await say("baseline vitals"); d = await pg.evaluate("Object.keys(__ov.periop.case.done)")
            ok("several steps said in one breath are each done, in order", all(k in d for k in ["ppe", "timeout", "spo2", "nibp", "ecg", "baseline"]), json.dumps(d))
            await say("machine check, suction on, check the blade light, iv is running"); await say("sniffing position"); await say("preoxygenate"); await pg.click(f'{HUD} [data-speed="8"]')
            await until("(() => { const s = __ov.periop.case.runner.snapshot(); return s.eto2 > 90 && s.t > 185; })()", 90); await say("end tidal oxygen"); await say("cricoid pressure on")
            await say("give 2 mg/kg of propofol"); await say("succinylcholine 1.5 mg/kg"); g = await pg.evaluate("__ov.periop.case.given.map(q => [q.drug, Math.round(q.totalMg)])")
            ok("an order in Booth's own words draws up and gives the drug by weight", len(g) == 2 and g[0][0] == "Propofol" and g[1][0] == "Succinylcholine", json.dumps(g))
            await until("__ov.periop.case.runner.snapshot().status >= 2", 60); await say("unconscious and apneic"); await say("tape the eyes"); await say("ready to intubate"); await say("open the mouth"); await say("insert the blade")
            got = await until("(() => { const C = __ov.periop.case; return C.lastAttempt && !C.runner.snapshot().intubationInProgress; })()", 60); fa = await pg.evaluate("({ a: __ov.periop.case.lastAttempt, dev: __ov.periop.case.runner.snapshot().airwayDevice, say: __ov.periop.case.lastSay })")
            ok("in the program's failed-first-attempt scenario the engine fails the first laryngoscopy and the room says so plainly", got and fa["a"]["outcome"] != "succeeded" and fa["dev"] != "intubated" and "failed" in fa["say"].lower(), json.dumps(fa)[:200]); await shot("o15-first-attempt-failed")
            await pg.click(f'{HUD} [data-end]'); await pg.wait_for_function("!document.getElementById('wPlace').hidden && document.getElementById('wPlace').innerText.toLowerCase().includes('debrief')", timeout=15000); await pg.wait_for_timeout(800); deb = (await pg.inner_text("#wPlace")).lower(); last2 = await pg.evaluate("__ov.periop.last")
            ok("ending a case early is recorded as stopped, from memory, with no score claimed for a rubric that was not closed", "case stopped" in deb and last2["steps"] == "memory" and last2["ended"] == "stopped early" and last2["induction"] is None and "not closed" in deb, json.dumps(last2)); await shot("o16-stopped-debrief")
            await pg.click('#wPlace [data-m="leave"]'); await pg.wait_for_timeout(2000)
        # ================================================================ a page closed in the middle of a case
        await pg.evaluate("__ov.world.standAt(6.3, -14.05, 8.6, -15.6)"); await pg.wait_for_timeout(600); await pg.keyboard.press("KeyE"); await pg.wait_for_function("!document.getElementById('wPlace').hidden", timeout=8000); await pg.wait_for_timeout(1000)      # test setup: stand at the operating room's ring
        pid = await pg.get_attribute("#wPlace [data-in]", "data-in"); n_before = await pg.evaluate("(id) => ((__ov.state.game.or.cases[id] || {}).attempts || []).length", pid); await pg.click(f'#wPlace [data-in="{pid}"]'); await pg.wait_for_function("__ov.periop.case && !document.getElementById('wipe').className && !document.getElementById('caseHud').hidden", timeout=30000); await pg.wait_for_timeout(800); await pg.click(f'{HUD} [data-start="list"]'); await pg.wait_for_timeout(800); await act("ppe", "spo2")
        await pg.reload(); await pg.wait_for_function(WORLD, timeout=120000); await pg.evaluate("__ov.periop.ready"); await pg.wait_for_timeout(1500)
        back = await pg.evaluate("(id) => ({ bays: __ov.periop.bays.slice(), c: !!__ov.periop.case, n: ((__ov.state.game.or.cases[id] || {}).attempts || []).length, hud: document.getElementById('caseHud').hidden })", pid)
        ok("closing the page in the middle of a case records nothing and puts the patient back in a bay", pid in back["bays"] and not back["c"] and back["n"] == n_before and back["hud"], json.dumps(back))
        # ================================================================ what the page asked of the outside world
        mic = await pg.evaluate("navigator.permissions ? navigator.permissions.query({ name: 'microphone' }).then(r => r.state).catch(() => 'unknown') : 'unknown'")
        ok("the microphone was never asked for (it is asked only when 'Speak' is pressed)", mic in ("prompt", "unknown", "denied"), mic)
        tts = [u for m, u in asked if "/api/tts" in u and m == "POST"]; out = sorted({u.split("/")[2] for m, u in asked if u.startswith("http") and "127.0.0.1" not in u and "localhost" not in u})
        ok("with sound off no speech was requested, and nothing was sent anywhere but this server and the script and font hosts", not tts and all(h in ("cdn.jsdelivr.net", "fonts.googleapis.com", "fonts.gstatic.com") for h in out), f"speech requests {len(tts)}; other hosts {out}")
        ok("no page errors during the whole run", not errs, json.dumps(errs[:4])[:240])
        vid = pg.video; await ctx.close(); await b.close()
        try:
            v = await vid.path(); shutil.move(v, f"{OUT}/periop.webm"); shutil.rmtree(OUT + "/_vid", ignore_errors=True)
        except Exception as e: print("video", e)
    n = sum(1 for r in R if r["pass"]); json.dump({"passed": n, "total": len(R), "results": R}, open(f"{OUT}/periop-results.json", "w"), indent=1); print(f"\n{n} of {len(R)} checks pass"); sys.exit(0 if n == len(R) else 1)
asyncio.run(main())
