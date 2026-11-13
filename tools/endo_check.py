"""endo_check.py: the endoscopy patient, converted to a general anesthetic, played from the bedside decision to the recovery handover.
     uv run --with playwright python3 tools/endo_check.py OUT_DIR tools/test-account.example.json [PORT]
   Needs the dev server:  python3 tools/dev_server.py 8091

Test setup (said where it happens): a fresh save; the endoscopy patient is brought to bay 2 and that bay's panel is opened through the
same calls the schedule station and the E key use. Everything after that is the case panel's own controls: the decision buttons, the
step list, drawing and giving syringes, the machine form, the views, walking out of the door with W. The engine decides everything
the patient does; the check waits on the patient's state, never on a timer. It records a video of the run.
This checks that the case runs and is recorded truthfully. It does not grade the clinical choices and does not judge how it looks."""
import sys, json, os, asyncio
from playwright.async_api import async_playwright
OUT = sys.argv[1]; ACC = json.load(open(sys.argv[2])); PORT = sys.argv[3] if len(sys.argv) > 3 else "8091"; B = f"http://127.0.0.1:{PORT}/world/"; R = []
os.makedirs(OUT, exist_ok=True)
def ok(name, cond, detail=""):
    R.append({"pass": bool(cond), "check": name, "detail": str(detail)[:300]}); print(("PASS " if cond else "FAIL ") + name + (" :: " + str(detail)[:220] if detail else ""), flush=True)
WORLD = "window.__ov && __ov.world && __ov.periop && document.getElementById('veil').classList.contains('off') && !document.getElementById('wipe').className"
SNAP = "(() => { const C = __ov.periop.case; if (!C) return null; const s = C.runner.snapshot(); return { t: Math.round(s.t), hr: Math.round(s.hr), spo2: Math.round(s.spo2), eto2: Math.round(s.eto2), etco2: Math.round(s.etco2), dev: s.airwayDevice, status: s.status, tofRatio: +s.tofRatio.toFixed(2), rr: Math.round(s.spontaneousRR), mode: s.ventMode, agent: +(+s.vaporizer || 0).toFixed(1), running: !!s.running, say: C.lastSay }; })()"
HUD = "#caseHud"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(channel="chrome", args=["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"])
        ctx = await b.new_context(viewport={"width": 1280, "height": 760}, record_video_dir=OUT + "/_vid", record_video_size={"width": 1280, "height": 760}, service_workers="block")
        pg = await ctx.new_page(); errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)[:300]))
        shot = lambda n: pg.screenshot(path=f"{OUT}/{n}.jpg", quality=88, type="jpeg"); S = lambda: pg.evaluate(SNAP)
        P = lambda: pg.evaluate("({x: __ov.world.P.x, z: __ov.world.P.z, room: __ov.world.room})")
        async def until(js, seconds=120):
            try: await pg.wait_for_function(js, timeout=seconds * 1000); return True
            except Exception: return False
        async def tab(t): await pg.click(f'{HUD} [data-tab="{t}"]'); await pg.wait_for_timeout(180)
        async def act(*ids):
            if await pg.evaluate("(document.querySelector('#caseHud .body') || {dataset: {}}).dataset.tab") != "steps": await tab("steps")
            for i in ids:
                if not await pg.query_selector(f'{HUD} [data-a="{i}"]'):
                    ph = await pg.evaluate("(id) => import('/world/js/cases.js').then(m => m.ACTIONS[id][1])", i); await pg.click(f'{HUD} [data-ph="{ph}"]'); await pg.wait_for_timeout(160)
                await pg.click(f'{HUD} [data-a="{i}"]'); await pg.wait_for_timeout(200)
        async def draw(drug, amount, unit):
            await tab("drugs"); await pg.select_option(f"{HUD} [name=drug]", drug); await pg.fill(f"{HUD} [name=amt]", str(amount)); await pg.select_option(f"{HUD} [name=unit]", unit); await pg.click(f"{HUD} form[data-f=draw] button"); await pg.wait_for_timeout(220)
        async def give(label):
            await tab("drugs"); await pg.locator(f"{HUD} .syr", has_text=label).locator("[data-give]").click(); await pg.wait_for_timeout(220)
            done = await pg.evaluate("(d) => __ov.periop.case.syringes.filter(q => q.drug === d).every(q => q.given)", label)
            if not done:      # evidence for a push that did not land: what the panel showed and what the case held
                await shot(f"give-failed-{label}"); open(f"{OUT}/give-failed-{label}.html", "w").write(await pg.inner_html(HUD))
                print("GIVE DID NOT LAND", label, await pg.evaluate("(d) => ({ syr: __ov.periop.case.syringes.filter(q => q.drug === d), say: __ov.periop.case.lastSay, away: __ov.periop.away, held: __ov.periop.run.held, hands: __ov.hands && __ov.hands.held && __ov.hands.held.id })", label), flush=True)
        async def vent(**kw):
            await tab("machine")
            for k, v in kw.items():
                if k == "mode": await pg.select_option(f"{HUD} [name=mode]", str(v))
                else: await pg.fill(f"{HUD} [name={k}]", str(v))
            await pg.click(f"{HUD} form[data-f=vent] button.on"); await pg.wait_for_timeout(220)
        # ---- test setup: the throwaway account, a fresh save, sound off, no care plan
        await pg.goto(B + "blank.html"); await pg.evaluate("""async ([u, p]) => { const a = await import('/core/auth.js'); let r = await a.loginUser(u, p); if (!r.success) { await a.registerUser(u, p); r = await a.loginUser(u, p); }
          const s = await import('/world/js/save.js'); localStorage.removeItem(s.key()); const st = s.load(); st.character = { name: 'Tester', person: 'scrubs', colour: 'teal' }; s.save(st); localStorage.setItem('overlord_world_mute', '1');
          for (const k of Object.keys(localStorage)) if (k.startsWith('overlord.careplan.v1.') || k === 'overlord.student.session.v1') localStorage.removeItem(k); }""", [ACC["username"], ACC["password"]])
        await pg.goto(B); await pg.wait_for_function(WORLD, timeout=120000); await pg.wait_for_function("__ov.exhibits && __ov.exhibits.hasClinical", timeout=120000); await pg.evaluate("__ov.periop.ready"); await pg.wait_for_timeout(1500)
        pid = await pg.evaluate("Object.values(__ov.periop.byId).find((e) => /^endo/i.test(e.room || '') && e.engineSupported).id")
        await pg.evaluate("(id) => __ov.periop.setBay(2, id)", pid); await pg.wait_for_timeout(2500); await pg.evaluate("__ov.world.open('bay2')"); await pg.wait_for_timeout(1200)      # test setup: patient to bay 2, its panel open
        # ---- the decision, then the suite
        await pg.click('#wPlace [data-endo="convert"]'); await pg.wait_for_timeout(1200); dec = (await pg.inner_text("#wPlace")).lower(); await shot("e01-decision-recorded")
        ok("converting is recorded, the draft key is shown beside it, and the case is offered, unplanned because no care plan is in", "recorded" in dec and "draft answer key" in dec and "unplanned practice" in dec)
        await pg.click('#wPlace [data-m="endo-run"]'); await pg.wait_for_function("__ov.periop.case && !document.getElementById('wipe').className && !document.getElementById('caseHud').hidden", timeout=30000); await pg.wait_for_timeout(1500)
        st = await pg.evaluate("(() => { const p = __ov.periop, q = p.patient; return { kind: p.case.kind, room: p.room, standing: __ov.world.room, at: q && [q.root.position.x, q.root.position.y, q.root.position.z].map(v => +v.toFixed(2)), unplanned: p.run.unplanned, converted: p.run.converted, lead: p.case.team.lead }; })()")
        ok("the patient is on the endoscopy stretcher, the case is a rapid sequence led by the endoscopist, recorded as converted and unplanned", st["room"] == "endo" and st["standing"] == "endo" and st["kind"] == "rsi" and st["at"] and abs(st["at"][0] - 8.6) < 0.05 and abs(st["at"][2] + 23.2) < 0.05 and st["converted"] and st["unplanned"] and st["lead"] == "endoscopist", json.dumps(st))
        brief = (await pg.inner_text(HUD)).lower(); await shot("e02-brief")
        ok("the brief speaks of the endoscopist and the scope, not a surgeon or an incision", "endoscop" in brief and "surgeon" not in brief and "incision" not in brief, brief[:200])
        await pg.click(f'{HUD} [data-start="list"]'); await pg.wait_for_timeout(1500)
        steps = await pg.evaluate("Array.from(document.querySelectorAll('#caseHud [data-a]')).map(b => b.innerText).join(' | ')")
        await act("ppe", "timeout", "spo2", "nibp", "ecg"); await pg.wait_for_timeout(1200); mon = await pg.evaluate("__ov.exhibits.clinical.live && __ov.exhibits.clinical.live.m.mon")
        ok("the monitor in this room comes up channel by channel as the sensors are recorded", mon and mon["spo2"] and mon["ecg"] and mon["nibp"] and not mon["gas"], json.dumps(mon))
        await pg.click(f'{HUD} [data-view="monitor"]'); await pg.wait_for_timeout(1000); await shot("e03-monitor"); await pg.click(f'{HUD} [data-view="patient"]'); await pg.wait_for_timeout(800)
        await act("baseline", "machine", "suction", "airwaykit", "iv")
        await draw("Propofol", 200, "mg"); await draw("Rocuronium", 100, "mg")      # 139 kg: induction doses by lean and ideal body weight, not total weight
        await pg.click(f'{HUD} [data-speed="8"]'); await act("sniff", "preox"); t_pre = (await S())["t"]
        got = await until(f"(() => {{ const s = __ov.periop.case.runner.snapshot(); return s.eto2 > 85 && s.t >= {t_pre + 185}; }})()", 120); await act("eto2"); s = await S()      # three full minutes from the mask going on
        ok("pre-oxygenation by mask raises the end-tidal oxygen (waited on the patient)", got and s["eto2"] > 85, json.dumps(s))
        await give("Propofol"); await act("cricoid"); await give("Rocuronium")      # cricoid as the induction drug goes in, before laryngoscopy (the program's rule)
        got = await until("(() => { const s = __ov.periop.case.runner.snapshot(); return s.status >= 2 && (s.tof === 0 || s.tofRatio === 0); })()", 120); await act("lash", "apnea", "reassess1", "eyes", "tof", "callready"); s = await S()
        ok("rapid sequence: unconscious and blocked in the engine's own time, with no mask ventilation in between", got and s["status"] >= 2 and not await pg.evaluate("__ov.periop.case.runner.snapshot().ppvEpisodeCount"), json.dumps(s))
        await act("open", "blade"); await pg.wait_for_timeout(700); await shot("e04-laryngoscopy"); await act("view", "tube")
        got = await until("__ov.periop.case.runner.snapshot().airwayDevice === 'intubated'", 90); await act("bladeout", "stylet", "cuff", "circuit")
        await vent(mode=1, tv=560, rr=12, peep=5, o2=1, air=1); await pg.fill(f"{HUD} [name=dial]", "2"); await pg.click(f"{HUD} form[data-f=agent] button.on"); await pg.wait_for_timeout(300)
        got2 = await until("(() => { const s = __ov.periop.case.runner.snapshot(); return s.capnogramPresent && s.etco2 > 20 && s.ventMode === 1; })()", 60); await act("etco2", "chest", "breath", "epigastric", "uncricoid", "secure", "reassess2", "agentcheck"); s = await S()
        ok("intubated, ventilated from the machine's controls, capnogram back, cricoid released after the tube is confirmed", got and got2 and s["dev"] == "intubated" and s["mode"] == 1 and s["etco2"] > 20, json.dumps(s)); await shot("e05-intubated")
        await act("ready"); await pg.wait_for_timeout(500); said = await pg.evaluate("__ov.periop.case.lastSay || ''"); ind = await pg.evaluate("(() => { const sh = __ov.periop.case.sheet('induction'); return { final: sh.final, percent: sh.percent, pass: sh.pass }; })()")
        ok("telling the endoscopist you are ready starts the procedure and closes the induction rubric", "endoscopist" in said.lower() and "scope" in said.lower() and ind["final"], f"{said} | {json.dumps(ind)}")
        # ---- out of the door and back: the patient waits
        door = await pg.evaluate("__ov.world.level.stations.endo.at"); await pg.evaluate("([x, z]) => __ov.world.standAt(x + 0.2, z, x - 3, z)", door); await pg.wait_for_timeout(500)      # test setup: stand inside the door, facing the court
        await pg.keyboard.down("KeyW"); t = 0
        while t < 6 and (await P())["room"] != "court": await pg.wait_for_timeout(100); t += 0.1
        await pg.wait_for_timeout(400); await pg.keyboard.up("KeyW"); await pg.wait_for_timeout(600); a = await pg.evaluate("({ away: __ov.periop.away, running: __ov.periop.case.runner.snapshot().running })"); t1 = await S(); await pg.wait_for_timeout(1200); t2 = await S()
        ok("walking out of the endoscopy suite pauses the case; nothing happens to the patient while you are away", a["away"] and not a["running"] and t1["t"] == t2["t"], json.dumps(a))
        await pg.click("#wGoal [data-go]"); back = await until("__ov.world.room === 'endo' && !__ov.periop.away && !document.getElementById('caseHud').hidden", 15); await pg.wait_for_timeout(1000)
        ok("'Go there' brings you back to the head of the stretcher in the endoscopy suite", back)
        # ---- emergence
        await act("closing"); said = await pg.evaluate("__ov.periop.case.lastSay || ''"); await tab("machine"); await pg.click(f"{HUD} [data-agentoff]"); await vent(o2=10, air=0); await act("tof"); tc = await pg.evaluate("__ov.periop.case.runner.snapshot().tof"); wt = await pg.evaluate("__ov.periop.case.weightKg"); await draw("Sugammadex", round((2 if (tc or 0) >= 2 else 4) * wt), "mg"); await give("Sugammadex")      # label dosing by actual body weight: 2 mg/kg with two or more twitches, 4 mg/kg for a deeper block
        ok("the end of the procedure is the endoscopist withdrawing the scope", "withdraw" in said.lower(), said)
        rev = {"tof_count_at_dose": tc, "dose_mg": round((2 if (tc or 0) >= 2 else 4) * wt), "mg_per_kg": 2 if (tc or 0) >= 2 else 4}
        got = await until("__ov.periop.case.runner.snapshot().tofRatio >= 0.9", 150); await act("tof"); s = await S(); rev["ratio_after"] = s["tofRatio"]; rev["t"] = s["t"]; rev["room"] = await pg.evaluate("(() => { const C = __ov.periop.case; return { syringes: C.syringes.filter(q => /ugammadex/.test(q.drug)).map(q => ({ total: q.totalMg, given: q.givenMg, held: q.heldMg, done: q.given })), log: C.runner.log.filter(l => /ugammadex/i.test(l.detail || l.kind || '')).map(l => Math.round(l.t) + ' ' + l.kind + ' ' + l.detail), relief: C.runner.p.sugammadexRocRelief, say: C.lastSay }; })()")
        ok("sugammadex by weight reverses the block while the patient is still on the ventilator", got, json.dumps(rev))
        if not got:      # never take a partly reversed patient off the ventilator: stop here and say why
            ok("the case was stopped on the ventilator because reversal was incomplete (the rest of emergence was not attempted)", False, json.dumps(rev)); await ctx.close(); await b.close(); return
        await vent(mode=0)
        got2 = await until("(() => { const s = __ov.periop.case.runner.snapshot(); return s.spont && s.spontaneousRR >= 8 && s.spontaneousTV >= 5 * __ov.periop.case.weightKg; })()", 240); await act("spont", "untape", "suctionop", "loosen", "reassess3")
        got3 = await until("__ov.periop.case.runner.snapshot().status === 0", 300); await act("commands"); s = await S()
        ok("reversal, spontaneous breathing and waking arrive in the engine's own time", got and got2 and got3 and s["tofRatio"] >= 0.9 and s["status"] == 0, json.dumps(s))
        await act("cuffdown", "extubate"); await pg.wait_for_timeout(600); await act("o2device", "obstruction", "stable"); await shot("e06-extubated")
        await act("handover"); await pg.wait_for_function("!document.getElementById('wPlace').hidden && document.getElementById('wPlace').innerText.toLowerCase().includes('debrief')", timeout=15000); await pg.wait_for_timeout(900); deb = (await pg.inner_text("#wPlace")).lower(); await shot("e07-debrief")
        last = await pg.evaluate("__ov.periop.last")
        ok("the induction meets the program's rapid sequence pass rule when it is done in the right order", last and last.get("inductionPass") is True, json.dumps({k: last.get(k) for k in ("induction", "inductionPass")}) if last else "no record")
        ok("the debrief shows both rubrics, how the case was run, and the pre-op decision without grading it", "case complete" in deb and "emergence" in deb and "pre-op decision" in deb and "does not grade the choice" in deb and "practice evidence" in deb, deb[:300])
        ok("the saved result names the room, the decision, the rule for carbon dioxide and that it was unplanned", last and last.get("room") == "endo" and last.get("decision") and last["decision"].get("kind") == "convert" and last.get("co2") == "stores" and last.get("unplanned") is True and last.get("ended") == "handover", json.dumps(last)[:300])
        await pg.click('#wPlace [data-m="leave"]'); await pg.wait_for_timeout(2500); cl = await pg.evaluate("({ c: !!__ov.periop.case, live: !!__ov.exhibits.clinical.live })")
        ok("sending the patient to recovery clears the suite", not cl["c"] and not cl["live"], json.dumps(cl))
        ok("no page errors", not errs, "; ".join(errs[:3]))
        json.dump({"steps_shown": steps}, open(f"{OUT}/endo-notes.json", "w"), indent=1)
        await ctx.close(); await b.close()
asyncio.run(main())
n = sum(1 for r in R if r["pass"]); json.dump({"passed": n, "total": len(R), "results": R}, open(f"{OUT}/endo-results.json", "w"), indent=1)
print(f"\n{n} of {len(R)} checks pass"); sys.exit(0 if n == len(R) else 1)
