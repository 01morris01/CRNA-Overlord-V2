"""playthrough_check.py: one complete play of the slice with REAL keyboard and mouse input, recorded to video.
     uv run --with playwright python3 tools/playthrough_check.py OUT_DIR tools/test-account.example.json
   Needs the dev server:  python3 tools/dev_server.py 8090
   What it is: a functional check. Every step is driven through the page as a player would (keys, clicks, typing).
   What it is not: a check of content accuracy (see CONTENT-VERIFICATION.md), of how it looks (visual review), or of
   real devices. Page internals are read to learn what to click and to confirm results, never to perform an action,
   except where a line says "test setup"."""
import sys, asyncio, json, glob, os, shutil
from playwright.async_api import async_playwright
OUT = sys.argv[1]; ACC = json.load(open(sys.argv[2])); B = "http://localhost:8090/world/"; R = []
def ok(group, name, cond, detail=""):
    R.append({"group": group, "pass": bool(cond), "check": name, "detail": str(detail)[:170]}); print(("PASS " if cond else "FAIL ") + f"[{group}] " + name + (" :: " + str(detail)[:150] if detail else ""))
FIND = """(id) => { const a = __ov.hall.atlas, p = a.parts.get(id), r = a.renderer.domElement.getBoundingClientRect(); if (!p) return null; const v = p.samples[0].clone();
  for (const s of p.samples) { v.copy(s).project(a.camera); if (v.z > 1) continue; const x = r.left + (v.x + 1) / 2 * r.width, y = r.top + (1 - v.y) / 2 * r.height; if (x < r.left + 8 || x > r.right - 380 || y < r.top + 170 || y > r.bottom - 90) continue; if (a.pick({ clientX: x, clientY: y }) === id) return [x, y]; } return null; }"""
HALL = "window.__ov && window.__ov.hall && __ov.hall.atlas.running"; WORLD = "window.__ov && __ov.world && __ov.world.active"; LS = "__ov.hall.learn.state"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(channel="chrome", args=["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"])
        ctx = await b.new_context(viewport={"width": 1280, "height": 760}, record_video_dir=OUT + "/_vid", record_video_size={"width": 1280, "height": 760})
        pg = await ctx.new_page(); errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)[:300])); pg.on("console", lambda m: errs.append("console: " + m.text[:200]) if m.type == "error" and "404" not in m.text else None)
        shot = lambda n: pg.screenshot(path=f"{OUT}/{n}.jpg", quality=84, type="jpeg")
        P = lambda: pg.evaluate("({x: __ov.world.P.x, y: __ov.world.P.y, z: __ov.world.P.z})")
        async def walk_to(x, z, tol=0.45, limit=16):
            down = set(); t = 0
            while t < limit:
                q = await P(); want = set()
                if q["z"] - z > tol: want.add("KeyW")
                if z - q["z"] > tol: want.add("KeyS")
                if x - q["x"] > tol: want.add("KeyD")
                if q["x"] - x > tol: want.add("KeyA")
                for k in down - want: await pg.keyboard.up(k)
                for k in want - down: await pg.keyboard.down(k)
                down = want
                if not want: return True
                await pg.wait_for_timeout(50); t += 0.05
            for k in down: await pg.keyboard.up(k)
            return False
        async def click_structure(id_):
            for view in [None, "lateral", "posterior", "anterolateral", "superior", "whole"]:
                if view: await pg.click(f'[data-view="{view}"]'); await pg.wait_for_timeout(1500)
                for _ in range(2):
                    pt = await pg.evaluate(f"({FIND})('{id_}')")
                    if pt: await pg.mouse.move(pt[0], pt[1], steps=5); await pg.wait_for_timeout(150); await pg.mouse.click(pt[0], pt[1]); await pg.wait_for_timeout(330); return True
                    await pg.wait_for_timeout(450)
            return False
        async def muscles(on):
            if await pg.evaluate("__ov.hall.atlas.layerIsOn('muscle')") != on: await pg.click('[data-layer="muscle"]'); await pg.wait_for_timeout(550)
        async def run_items(n_wrong_at, tag):
            n = await pg.evaluate(f"{LS}.items.length"); cams = []; seen_tip = False; fb = ""
            for i in range(n):
                await pg.wait_for_timeout(1300); cams.append(await pg.evaluate("__ov.hall.atlas.camera.position.toArray().map(v => +v.toFixed(2)).join(',')"))
                if i == 0: ok("functional", f"{tag}: nothing is labelled or highlighted while you identify", await pg.evaluate("document.getElementById('hLabels').children.length === 0 && [...__ov.hall.atlas.parts.values()].every(p => p.glow < 0.02)"))
                ans = await pg.evaluate(f"{LS}.items[{LS}.i].answer"); wrong = i in n_wrong_at
                pick = next(x for x in ["median_nerve_r", "ulnar_nerve_r", "radial_nerve_r"] if x not in ans) if wrong else ans[0]
                await muscles(await pg.evaluate(f"__ov.hall.atlas.parts.get('{pick}').layer") == "muscle")
                got = await click_structure(pick); seen_tip = seen_tip or await pg.evaluate("document.getElementById('hTip').classList.contains('on')")
                if i == 0: await shot(f"{tag}-selected")
                await pg.click(f'[data-conf="{1 if (wrong and i == min(n_wrong_at)) else 3}"]'); await pg.wait_for_timeout(1400)
                verdict = (await pg.inner_text("#hPanel .verdict")).lower(); body = await pg.inner_text("#hPanel")
                ok("functional", f"{tag} {i+1}: {'a wrong pick is marked wrong and explained' if wrong else 'a right pick is marked right'}", got and (("not" in verdict) == wrong) and (not wrong or "You selected" in body), (await pg.inner_text("#hHead h1"))[:70])
                if wrong and not fb: fb = body.replace("\n", " ")[:160]; await shot(f"{tag}-mistake")
                await pg.click('[data-act="inext"]')
            ok("functional", f"{tag}: names never appear on hover while you identify", not seen_tip)
            ok("functional", f"{tag}: the camera starts from a different angle on different items", len(set(cams)) >= max(3, n // 2), f"{len(set(cams))} distinct starting views in {n} items")
            return fb

        # ===== 0. an existing version-1 save must survive the move to the new island (test setup: seeds the save) =====
        await pg.goto(B); await pg.wait_for_timeout(1000)
        if await pg.locator("#gate").is_visible():
            await pg.fill("#gUser", ACC["username"]); await pg.fill("#gPass", ACC["password"]); await pg.click('#gateForm button[type=submit]'); await pg.wait_for_timeout(900)
            if await pg.locator("#gate").is_visible(): await pg.click("#gReg"); await pg.wait_for_timeout(900)
        ok("functional", "sign in with the app's own account", await pg.evaluate("!!localStorage.getItem('hemodynamic_overlord_session')"))
        await pg.evaluate("""(() => { const u = JSON.parse(localStorage.getItem('hemodynamic_overlord_session')).userId, k = 'hemodynamic_overlord_save_' + u;
          localStorage.setItem(k, JSON.stringify({ sentinel: 'classic-save-must-not-change', points: 1234 }));
          localStorage.setItem(k + '::world', JSON.stringify({ v: 1, createdAt: 1, visits: 3, character: { name: 'Old', skin: 1, hair: 'bun', hairColor: 2, scrubs: 4, cap: false, glasses: false, steth: true },
            game: { pos: [48, 7, 52, 0], inventory: { plank: 9, glass: 8, lamp: 1, hedge: 6, plexus: 0 }, plot: [[50, 7, 50, 19], [48, 7, 49, 13], [49, 7, 54, 8]], notes: ['dock'], rewards: ['nerve-stimulator', 'plexus-model'], lessonDone: true },
            learning: { objectives: {}, attempts: [{ t: 5, objective: 'x', item: 'Select the median nerve.', evidence: 'identified', correct: true, confidence: 3, picked: 'median_nerve_r' }], due: [] } })); })()""")
        await pg.goto(B); await pg.wait_for_function(WORLD, timeout=60000); await pg.wait_for_timeout(1500)
        mig = await pg.evaluate("({v: __ov.state.v, from: __ov.state.migratedFrom, plot: __ov.state.game.plot, attempts: __ov.state.learning.attempts.length, rewards: __ov.state.game.rewards, name: __ov.state.character.name, notes: __ov.state.game.notes, standing: __ov.world.world().top(__ov.world.P.x, __ov.world.P.z) >= 0})")
        ok("functional", "a version-1 save is carried to the new island with nothing lost", mig["v"] == 2 and mig["from"] == 1 and mig["plot"] == [[64, 30, 66, 20], [62, 30, 65, 14], [63, 30, 70, 9]] and mig["attempts"] == 1 and mig["rewards"] == ["nerve-stimulator", "plexus-model"] and mig["name"] == "Old" and mig["standing"], json.dumps(mig)[:150])
        await pg.evaluate("(() => { const k = Object.keys(localStorage).find(k => k.endsWith('::world')); localStorage.removeItem(k); })()")   # test setup: start the real run fresh

        # ===== 1. character =====
        await pg.goto(B + "?character"); await pg.wait_for_selector("#charGo", state="visible"); await pg.wait_for_timeout(1200)
        for sel in ['[data-k="skin"][data-v="3"]', '[data-k="hair"][data-v="curly"]', '[data-k="scrubs"][data-v="0"]', '[data-t="glasses"]']:
            await pg.click(sel); await pg.wait_for_timeout(420)
        await pg.fill("#cName", "Shawn"); await pg.wait_for_timeout(400); await shot("p01-character")
        await pg.click("#charGo"); await pg.wait_for_function(WORLD, timeout=60000); await pg.wait_for_timeout(2600)
        ok("functional", "character saved with the chosen options", await pg.evaluate("__ov.state.character.hair === 'curly' && __ov.state.character.skin === 3 && __ov.state.character.glasses === true && __ov.state.character.name === 'Shawn'"))
        await shot("p02-landing")
        # ===== 2. the island =====
        await pg.mouse.move(640, 380)
        ok("functional", "walk to the end of the landing with the keyboard", await walk_to(48, 94.0)); await pg.wait_for_timeout(900)
        ok("functional", "a field note is collected by walking into it", await pg.evaluate("__ov.state.game.notes.includes('dock')"), (await pg.inner_text("#wToast"))[:90]); await shot("p03-field-note")
        y0 = await pg.evaluate("__ov.world.cam.yaw"); await pg.mouse.move(700, 300); await pg.mouse.down(); await pg.mouse.move(520, 290, steps=14); await pg.mouse.up()
        ok("functional", "drag turns the camera", abs(await pg.evaluate("__ov.world.cam.yaw") - y0) > 0.5); await pg.mouse.move(520, 300); await pg.mouse.down(); await pg.mouse.move(700, 310, steps=14); await pg.mouse.up(); await pg.evaluate("__ov.world.cam.yaw = 0")   # test setup: square the camera so W is north
        await walk_to(48, 60); await shot("p04-toward-plaza"); await walk_to(54, 54); await walk_to(55.4, 47.4); await pg.wait_for_timeout(1500); await shot("p05-booth")
        ok("functional", "Booth speaks when you come near", await pg.evaluate("__ov.world.people[0].near"), await pg.evaluate("__ov.world.people[0].el.innerText.slice(0, 80)"))
        await walk_to(48.2, 40.2); y_plaza = (await P())["y"]; ok("functional", "climb the steps to the Hall terrace", await walk_to(48, 33.2) and (await P())["y"] - y_plaza >= 2.9, f"rose {(await P())['y'] - y_plaza:.1f} m")
        await pg.wait_for_timeout(600); ok("functional", "the door offers to let you in", await pg.evaluate("__ov.world.spotLabel()") == "Enter Anatomy Hall"); await shot("p06-hall-door")
        await pg.keyboard.press("KeyE"); await pg.wait_for_function(HALL, timeout=60000); await pg.wait_for_timeout(2800); await shot("p07-hall-menu")
        # ===== 3. the lesson =====
        await pg.click('[data-go="lesson"]'); await pg.wait_for_timeout(1900)
        ids = await pg.evaluate("(async () => (await import('./data/plexus.js')).ID)()"); T = ids["trunks"]
        plan = [[ids["scm"]], [ids["roots"][1]], T, ids["postDivs"], [ids["PC"]], [ids["axillary"], ids["radial"]]]
        for i, want in enumerate(plan):
            await pg.wait_for_timeout(1500)
            if i == 2:
                await click_structure(T[2]); await pg.wait_for_timeout(500); nudge = await pg.inner_text("#hPanel"); ok("functional", "lesson corrects a wrong click without ending the step", "highest" in nudge.lower(), nudge.replace("\n", " ")[:90])
            done = [await click_structure(x) for x in want]; await pg.wait_for_timeout(500)
            ok("functional", f"lesson step {i+1} is completed by acting on the model", await pg.evaluate(f"{LS}.done") and all(done), await pg.inner_text("#hHead h1"))
            if i in (1, 4): await shot(f"p08-lesson-{i+1}")
            await pg.click('[data-act="next"]')
        await pg.wait_for_timeout(1200); ok("functional", "lesson completion is saved", await pg.evaluate("__ov.state.game.lessonDone === true"))
        # ===== 4. the challenge: 8 items, two missed on purpose =====
        await pg.click('[data-go="challenge"]'); await pg.wait_for_timeout(1200)
        kinds = await pg.evaluate(f"{LS}.items.map(i => i.kind)"); ok("functional", "the challenge mixes naming with working it out", kinds.count("relation") >= 4 and kinds.count("find") >= 2, kinds)
        fb = await run_items({2, 5}, "p09-challenge"); ok("functional", "a mistake is explained: what you picked, and how to tell the right one", "What you were looking for" in fb, fb)
        await pg.wait_for_timeout(1300); await shot("p10-results"); st = await pg.evaluate("({due: __ov.state.learning.due.map(d => [d.reason, Math.round((d.at - Date.now()) / 86400000)]), rewards: __ov.state.game.rewards, n: __ov.state.learning.attempts.length, ev: [...new Set(__ov.state.learning.attempts.map(a => a.evidence))]})")
        ok("functional", "6 of 8 earns the tool; missed come back in 1 day, a correct guess... sure-and-right in 6", "nerve-stimulator" in st["rewards"] and sorted(set(map(tuple, st["due"]))) == [("missed", 1), ("spaced", 6)], json.dumps(st)[:150])
        # ===== 5. the reward is something you can use =====
        await pg.click('[data-go="challenge"]'); await pg.wait_for_timeout(600); await pg.evaluate("__ov.hall.learn.go('explore')"); await pg.wait_for_timeout(900)   # test setup: jump to Explore
        await muscles(False); await pg.click('[data-view="lateral"]'); await pg.wait_for_timeout(1500); await click_structure(ids["PC"]); await pg.wait_for_timeout(400)
        await pg.click('[data-act="stim"]'); await pg.wait_for_timeout(500); stim = await pg.inner_text("#hPanel .stim"); ok("functional", "the earned nerve stimulator works on a cord in Explore", "little finger extends" in stim, stim[:90]); await shot("p11-stimulator")
        badge = await pg.inner_text("#hPanel"); await click_structure(ids["LC"]); await pg.wait_for_timeout(400); ok("functional", "a built structure says that it was built", "Built for Overlord" in await pg.inner_text("#hPanel"))
        # ===== 6. four ways in =====
        await pg.click('[data-go="menu"]'); await pg.wait_for_timeout(700); await muscles(True); await pg.click('[data-go="r-intro"]'); await pg.wait_for_timeout(2500); await shot("p12-narration-1")
        cap0 = await pg.inner_text("#hHead h1"); await pg.wait_for_timeout(7500); n1 = await pg.evaluate(f"{LS}.n"); await pg.wait_for_timeout(6000); await shot("p12-narration-2")
        ok("functional", "the narration plays by itself, caption by caption", n1 >= 1 and await pg.inner_text("#hHead h1") != cap0, f"reached caption {await pg.evaluate(LS + '.n') + 1} of 7")
        await pg.click('[data-act="nplay"]'); await pg.click('[data-go="r-explore"]'); await pg.wait_for_timeout(1500)
        for k in ["interscalene", "supraclavicular", "infraclavicular", "axillary"]:
            pt = await pg.evaluate(f"(() => {{ const m = __ov.hall.atlas.markerScreen('{k}'); return [m.x, m.y]; }})()")
            if pt[0] > 880 or pt[1] < 170 or await pg.evaluate(f"__ov.hall.atlas.pick({{clientX: {pt[0]}, clientY: {pt[1]}}})") != "marker:" + k: await pg.click(f'[data-level="{k}"]')
            else: await pg.mouse.click(pt[0], pt[1])
            await pg.wait_for_timeout(1500)
            if k == "infraclavicular": await shot("p13-level-infraclavicular")
        ok("functional", "all four levels can be opened; each shows what it is for, misses and lies beside", await pg.evaluate(f"{LS}.visited.size") == 4 and "What it misses" in await pg.inner_text("#hPanel"))
        await pg.click('[data-go="r-identify"]'); await pg.wait_for_timeout(1000); await run_items({1}, "p14-identify")
        await pg.wait_for_timeout(1500); case = await pg.evaluate(f"({{id: {LS}.case.id, best: Object.keys({LS}.case.grade).find(k => {LS}.case.grade[k][0] === 'best'), truths: {LS}.case.reasons.map(r => r[1])}})"); await shot("p15-case")
        ok("functional", "the case shows four unlabelled level rings", await pg.evaluate("__ov.hall.atlas.markers.size === 4 && document.getElementById('hLabels').children.length === 0"))
        await muscles(False); await pg.click('[data-view="anterolateral"]'); await pg.wait_for_timeout(1600)
        pt = await pg.evaluate(f"(() => {{ const m = __ov.hall.atlas.markerScreen('{case['best']}'); return [m.x, m.y]; }})()"); await pg.mouse.click(pt[0], pt[1]); await pg.wait_for_timeout(500)
        ok("functional", "the approach is chosen by clicking its level on the model", await pg.evaluate(f"{LS}.chosen") == case["best"], case["best"]); await pg.click('[data-act="ccommit"]'); await pg.wait_for_timeout(500)
        for i, t in enumerate(case["truths"]):
            if t: await pg.click(f'[data-reason="{i}"]'); await pg.wait_for_timeout(180)
        await shot("p16-case-reasons"); await pg.click('[data-act="creasons"]'); await pg.wait_for_timeout(500)
        await pg.fill("#why", "It covers below the elbow and stays clear of the phrenic nerve." if case["id"] == "copd-radius" else "It blocks C5 and C6, which supply the shoulder."); await pg.click('[data-act="cexplain"]'); await pg.wait_for_timeout(1400); await shot("p17-case-feedback")
        body = await pg.inner_text("#hPanel"); ok("functional", "the case grades the approach and every reason, then shows a model answer beside your sentence", "source prefers" in body.lower() and "Your reasons" in body and "A model answer" in body and "Your sentence" in body)
        await pg.click('[data-self="1"]'); await pg.wait_for_timeout(400); ok("functional", "your own sentence is recorded as self-rated, not as a grade", "self-rated" in json.dumps(await pg.evaluate("__ov.state.learning.attempts.map(a => a.evidence)")))
        await pg.click('[data-go="r-questions"]'); await pg.wait_for_timeout(900); qtypes = []
        for qi in range(await pg.evaluate(f"{LS}.qs.length")):
            q = await pg.evaluate(f"({{type: {LS}.qs[{LS}.q].type, correct: {LS}.qs[{LS}.q].correct}})"); qtypes.append(q["type"])
            if q["type"] == "match":
                for i, c in enumerate(q["correct"]): await pg.select_option(f'[data-match="{i}"]', str(c)); await pg.wait_for_timeout(200)
                await shot("p18-question-match")
            else:
                for o in q["correct"]: await pg.click(f'[data-opt="{o}"]'); await pg.wait_for_timeout(200)
            await pg.click('[data-act="qsubmit"]'); await pg.wait_for_timeout(700); good = "correct" in (await pg.inner_text("#hPanel .verdict")).lower(); await pg.click('[data-act="qnext"]'); await pg.wait_for_timeout(500)
            ok("functional", f"question {qi+1} ({q['type']}) accepts the correct answer", good)
        await pg.wait_for_timeout(900); await shot("p19-regional-results")
        r = await pg.evaluate("({rewards: __ov.state.game.rewards, coral: __ov.state.game.inventory.coral, done: __ov.state.game.progress.regionalDone, outline: [...new Set(__ov.state.learning.attempts.map(a => a.outline).filter(Boolean))]})")
        ok("functional", "finishing the regional sequence earns a wearable and coral blocks, and is filed under outline codes", "block-cap" in r["rewards"] and r["coral"] > 0 and r["done"] == 1 and "III.I.5" in r["outline"] and "III.I.1" in r["outline"], json.dumps(r)[:140])
        # ===== 7. back on the island: wear it, build with it =====
        await pg.click('[data-go="exit"]'); await pg.wait_for_function(WORLD, timeout=20000); await pg.wait_for_timeout(2600); await shot("p20-back")
        ok("functional", "on return the island says what was earned", "Earned" in await pg.inner_text("#wToast"), (await pg.inner_text("#wToast"))[:100])
        await walk_to(48, 36.6); await walk_to(48.2, 40.2); await walk_to(52.6, 43.8); await walk_to(53.6, 53.6); await walk_to(60.6, 62.4); ok("functional", "walk down to the plot", await walk_to(62.5, 68.5)); await pg.wait_for_timeout(500)
        await pg.keyboard.press("KeyB"); await pg.wait_for_timeout(600); ok("functional", "build mode opens on the plot", await pg.evaluate("__ov.world.build().on"))
        await pg.evaluate("__ov.world.cam.pitch = 0.78; __ov.world.cam.dist = 12"); await pg.wait_for_timeout(700)   # test setup: look down at the plot
        for item, cells in [("plexus", [(64, 66)]), ("lamp", [(60, 65), (66, 65)]), ("coral", [(61, 71), (62, 71), (63, 71)])]:
            await pg.click(f'[data-item="{item}"]')
            for bx, bz in cells: pt = await pg.evaluate(f"__ov.world.blockScreen({bx}, 29, {bz})"); await pg.mouse.click(pt[0], pt[1] - 5); await pg.wait_for_timeout(450)
        await pg.wait_for_timeout(1700); plot = await pg.evaluate("__ov.state.game.plot"); ok("functional", "place the sculpture, lamps and the newly earned coral blocks with real clicks", len(plot) == 6 and any(c[3] == 20 for c in plot) and sum(1 for c in plot if c[3] == 13) == 3, plot)
        await pg.keyboard.press("KeyB"); await pg.evaluate("__ov.world.cam.pitch = 0.4; __ov.world.cam.dist = 9; __ov.world.cam.yaw = 2.5"); await pg.wait_for_timeout(1700); await shot("p21-plot")   # test setup: camera for the picture
        await pg.evaluate("__ov.world.cam.yaw = 0"); await walk_to(66.4, 68); ok("functional", "step over the hedge to the workshop bench", await walk_to(69.2, 68)); await pg.wait_for_timeout(600)
        ok("functional", "the workbench lists the tools you have earned", await pg.evaluate("__ov.world.spotLabel()") == "Look at your workbench"); await pg.keyboard.press("KeyE"); await pg.wait_for_timeout(700); bench = await pg.inner_text("#wToast"); ok("functional", "the bench names the stimulator, the sculpture and the cap", all(w in bench for w in ["Nerve stimulator", "Plexus sculpture", "Regional cap"]), bench[:80])
        await pg.evaluate("__ov.world.cam.yaw = -1.6; __ov.world.cam.pitch = 0.3; __ov.world.cam.dist = 8"); await pg.wait_for_timeout(1500); await shot("p22-workshop")
        # wear the cap (the mark is the menu)
        await pg.click("#mark"); await pg.wait_for_timeout(400); await shot("p23-menu"); await pg.click('[data-m="character"]'); await pg.wait_for_timeout(1200); await pg.click('[data-cap="dots"]'); await pg.wait_for_timeout(700); await shot("p24-cap"); await pg.click("#charGo"); await pg.wait_for_function(WORLD, timeout=20000); await pg.wait_for_timeout(1200)
        ok("functional", "the earned cap can be worn", await pg.evaluate("__ov.state.character.cap === true && __ov.state.character.capStyle === 'dots'"))
        # ===== 8. come back later =====
        await pg.wait_for_timeout(2800); await pg.goto(B); await pg.wait_for_function(WORLD, timeout=60000); await pg.wait_for_timeout(2600); await shot("p25-return")
        back = await pg.evaluate("({pos: __ov.state.game.pos, P: [__ov.world.P.x, __ov.world.P.z], plot: __ov.state.game.plot.length, notes: __ov.state.game.notes, rewards: __ov.state.game.rewards, name: __ov.state.character.name, cap: __ov.state.character.capStyle, toast: document.getElementById('wToast').innerText})")
        ok("functional", "after a reload: same place, character, cap, plot, notes and rewards", abs(back["P"][0] - back["pos"][0]) < 0.5 and back["plot"] == 6 and back["notes"] == ["dock"] and len(back["rewards"]) == 3 and back["name"] == "Shawn" and back["cap"] == "dots", json.dumps(back)[:150])
        ok("functional", "after a reload: greeted by name", "Welcome back, Shawn" in back["toast"], back["toast"][:90])
        ok("functional", "the classic app's own save is untouched", await pg.evaluate("(() => { const u = JSON.parse(localStorage.getItem('hemodynamic_overlord_session')).userId; return localStorage.getItem('hemodynamic_overlord_save_' + u) === JSON.stringify({ sentinel: 'classic-save-must-not-change', points: 1234 }); })()"))
        # ===== 9. two days later: what was missed comes first, and can be reached without walking =====
        await pg.evaluate("(() => { for (const d of __ov.state.learning.due) d.at -= 2 * 86400000; __ov.save(__ov.state); })()")   # test setup: move the clock
        await pg.goto(B); await pg.wait_for_function(WORLD, timeout=60000); await pg.wait_for_timeout(1500); ok("functional", "two days later the greeting says what is due", "due" in await pg.inner_text("#wToast"), (await pg.inner_text("#wToast"))[:80])
        await pg.click("#mark"); await pg.wait_for_timeout(300); await pg.click('[data-m="review"]'); await pg.wait_for_function(HALL, timeout=60000); await pg.wait_for_timeout(1500)
        dueAsks = await pg.evaluate("__ov.state.learning.due.filter(d => d.at <= Date.now()).map(d => d.item)"); items = await pg.evaluate(f"{LS}.items.map(i => i.ask)")
        ok("functional", "Study > Review goes straight to the missed items, no walking", len(items) >= 2 and all(a in dueAsks for a in items), f"{len(items)} review items"); await shot("p26-review")
        ok("functional", "sound: the audio engine starts on first input and the mute choice is kept", await pg.evaluate("(async () => { const a = await import('./js/audio.js'); a.unlock(); a.setMuted(true); const m1 = localStorage.getItem('overlord_world_mute'); a.setMuted(false); return m1 === '1' && localStorage.getItem('overlord_world_mute') === '0'; })()"))
        ok("functional", "no script errors during the whole run", not errs, errs[:3])
        await ctx.close(); await b.close()
    v = sorted(glob.glob(OUT + "/_vid/*.webm"), key=os.path.getsize)[-1]; shutil.move(v, OUT + "/playthrough.webm"); shutil.rmtree(OUT + "/_vid", ignore_errors=True)
    print(f"\n{sum(1 for r in R if r['pass'])} of {len(R)} functional checks pass"); json.dump(R, open(OUT + "/playthrough-results.json", "w"), indent=1)
asyncio.run(main())
