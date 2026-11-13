"""journey_check.py: one complete first journey through the institute with REAL keyboard and mouse input, recorded to video.
     uv run --with playwright python3 tools/journey_check.py OUT_DIR tools/test-account.example.json [PORT]
   Needs the dev server:  python3 tools/dev_server.py 8091
   What it is: a functional check. Every step is driven through the page as a learner would (keys, clicks, typing).
   What it is not: a check of content accuracy (docs/overlord-world/CONTENT-VERIFICATION.md), of how it looks (the visual
   review), of frame rate (measured separately, in a visible browser) or of real devices. Page internals are read to learn
   what to click and to confirm results, never to perform an action, except where a line says "test setup"."""
import sys, asyncio, json, glob, os, shutil
from playwright.async_api import async_playwright
OUT = sys.argv[1]; ACC = json.load(open(sys.argv[2])); PORT = sys.argv[3] if len(sys.argv) > 3 else "8091"; B = f"http://127.0.0.1:{PORT}/world/"; R = []
os.makedirs(OUT, exist_ok=True)
def ok(group, name, cond, detail=""):
    R.append({"group": group, "pass": bool(cond), "check": name, "detail": str(detail)[:200]}); print(("PASS " if cond else "FAIL ") + f"[{group}] " + name + (" :: " + str(detail)[:170] if detail else ""), flush=True)
FIND = """(id) => { const a = __ov.hall.atlas, p = a.parts.get(id), r = a.renderer.domElement.getBoundingClientRect(); if (!p) return null; const v = p.samples[0].clone();
  for (const s of p.samples) { v.copy(s).project(a.camera); if (v.z > 1) continue; const x = r.left + (v.x + 1) / 2 * r.width, y = r.top + (1 - v.y) / 2 * r.height; if (x < r.left + 8 || x > r.right - 380 || y < r.top + 170 || y > r.bottom - 90) continue; if (a.pick({ clientX: x, clientY: y }) === id) return [x, y]; } return null; }"""
HALL = "window.__ov && window.__ov.hall && __ov.hall.atlas.running"; WORLD = "window.__ov && __ov.world && __ov.places && document.getElementById('veil').classList.contains('off') && document.body.dataset.screen === 'world' && !document.getElementById('wipe').className"; LS = "__ov.hall.learn.state"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(channel="chrome", args=["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist", "--autoplay-policy=no-user-gesture-required"])
        ctx = await b.new_context(viewport={"width": 1280, "height": 760}, record_video_dir=OUT + "/_vid", record_video_size={"width": 1280, "height": 760})
        pg = await ctx.new_page(); errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)[:300])); pg.on("console", lambda m: errs.append("console: " + m.text[:240]) if m.type == "error" and "404" not in m.text else None)
        shot = lambda n: pg.screenshot(path=f"{OUT}/{n}.jpg", quality=86, type="jpeg")
        P = lambda: pg.evaluate("({x: __ov.world.P.x, z: __ov.world.P.z, room: __ov.world.room})")
        async def walk_to(x, z, tol=0.4, limit=22):
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
        async def pick(id_):
            await muscles(await pg.evaluate(f"__ov.hall.atlas.parts.get('{id_}').layer") == "muscle"); return await click_structure(id_)
        async def run_items(plan, tag):
            """plan: {index: 'wrong' | 'wrong+retry' | 'hint' | 'guess'}; everything else is answered right and sure."""
            n = await pg.evaluate(f"{LS}.items.length"); cams = []; seen_tip = False; fb = ""; retry_view = None
            for i in range(n):
                await pg.wait_for_timeout(1300); cams.append(await pg.evaluate("__ov.hall.atlas.camera.position.toArray().map(v => +v.toFixed(2)).join(',')"))
                if i == 0: ok("functional", f"{tag}: nothing is labeled or highlighted while you identify", await pg.evaluate("document.getElementById('hLabels').children.length === 0 && [...__ov.hall.atlas.parts.values()].every(p => p.glow < 0.02)"))
                ans = await pg.evaluate(f"{LS}.items[{LS}.i].answer"); how = plan.get(i, ""); wrong = how.startswith("wrong")
                if how == "hint": await pg.click('[data-act="hint"]'); await pg.wait_for_timeout(400); ok("functional", f"{tag} {i+1}: a hint is shown on request and flagged", "nudge" in await pg.inner_html("#hPanel"))
                target = next(x for x in ["median_nerve_r", "ulnar_nerve_r", "radial_nerve_r"] if x not in ans) if wrong else ans[0]
                got = await pick(target); seen_tip = seen_tip or await pg.evaluate("document.getElementById('hTip').classList.contains('on')")
                if i == 0: await shot(f"{tag}-selected")
                await pg.click(f'[data-conf="{1 if how == "guess" else 3}"]'); await pg.wait_for_timeout(1400)
                verdict = (await pg.inner_text("#hPanel .verdict")).lower(); body = await pg.inner_text("#hPanel")
                ok("functional", f"{tag} {i+1}: {'a wrong pick is marked wrong and explained' if wrong else 'a right pick is marked right'}", got and (("not" in verdict) == wrong) and (not wrong or "You selected" in body), (await pg.inner_text("#hHead h1"))[:70])
                if wrong and not fb: fb = body.replace("\n", " ")[:200]; await shot(f"{tag}-mistake")
                if how == "wrong+retry":
                    v0, d0 = await pg.evaluate(f"[{LS}.lastView, {LS}.lastDress]"); c0 = await pg.evaluate("__ov.hall.atlas.camera.position.toArray().map(v => +v.toFixed(2)).join(',')")
                    lit = await pg.evaluate(f"(() => {{ const a = __ov.hall.atlas, it = {LS}.items[{LS}.i]; return a.parts.get(it.answer[0]).glow > 0.2 && a.selected() === '{target}' && document.getElementById('hLabels').children.length === 2; }})()")
                    ok("functional", f"{tag} {i+1}: after a mistake the model shows both: what you chose and the answer, each named", lit)
                    await pg.click('[data-act="iretry"]'); await pg.wait_for_timeout(1700)
                    v1, d1, rt = await pg.evaluate(f"[{LS}.lastView, {LS}.lastDress, {LS}.retry]"); c1 = await pg.evaluate("__ov.hall.atlas.camera.position.toArray().map(v => +v.toFixed(2)).join(',')")
                    ok("functional", f"{tag} {i+1}: the second try is from a different view and dressing, unlabelled again", rt and v1 != v0 and d1 != d0 and c1 != c0 and await pg.evaluate("document.getElementById('hLabels').children.length === 0 && [...__ov.hall.atlas.parts.values()].every(p => p.glow < 0.05)"), f"{v0}/{d0} -> {v1}/{d1}")
                    await shot(f"{tag}-retry"); got2 = await pick(ans[0]); await pg.click('[data-conf="2"]'); await pg.wait_for_timeout(1200); body2 = await pg.inner_text("#hPanel")
                    ok("functional", f"{tag} {i+1}: the second try is marked as assisted, not as recall", got2 and "assisted" in body2.lower() and "found it" in body2.lower(), body2.replace("\n", " ")[:110])
                await pg.click('[data-act="inext"]')
            ok("functional", f"{tag}: names never appear on hover while you identify", not seen_tip)
            ok("functional", f"{tag}: the camera starts from a different angle on different items", len(set(cams)) >= max(3, n // 2), f"{len(set(cams))} distinct starting views in {n} items")
            return fb
        async def to_world():
            try: await pg.wait_for_function(WORLD, timeout=120000)
            except Exception as e:
                print("NOT READY:", json.dumps(await pg.evaluate("({ov: !!window.__ov, keys: window.__ov ? Object.keys(window.__ov).filter(k => window.__ov[k]) : [], screen: document.body.dataset.screen, veil: document.getElementById('veil').className, text: document.getElementById('veilText').textContent, wipe: document.getElementById('wipe').className})")), errs[:5], flush=True); raise
            await pg.wait_for_timeout(1200)

        # ===== 0. sign in; an island-era save must survive the move to the institute (test setup: seeds the save) =====
        await pg.goto(B); await pg.wait_for_timeout(1200)
        if await pg.locator("#gate").is_visible():
            await pg.fill("#gUser", ACC["username"]); await pg.fill("#gPass", ACC["password"]); await pg.click('#gateForm button[type=submit]'); await pg.wait_for_timeout(900)
            if await pg.locator("#gate").is_visible(): await pg.click("#gReg"); await pg.wait_for_timeout(900)
        ok("functional", "sign in with the app's own account", await pg.evaluate("!!localStorage.getItem('hemodynamic_overlord_session')"))
        await pg.goto(B + "blank.html")   # test setup: leave the app before editing its save, because the app saves once more as it closes
        await pg.evaluate("""(() => { const u = JSON.parse(localStorage.getItem('hemodynamic_overlord_session')).userId, k = 'hemodynamic_overlord_save_' + u;
          localStorage.setItem(k, JSON.stringify({ sentinel: 'classic-save-must-not-change', points: 1234 }));
          localStorage.setItem(k + '::world', JSON.stringify({ v: 2, createdAt: 1, lastSeen: 1700000000000, visits: 3, character: { name: 'Old', skin: 1, hair: 'bun', scrubs: 4 },
            game: { pos: [48, 30, 52, 0], inventory: { plank: 9 }, plot: [[64, 30, 66, 20]], notes: ['dock'], rewards: ['nerve-stimulator', 'plexus-model'], lessonDone: true, progress: {} },
            learning: { objectives: {}, attempts: [{ t: 5, objective: 'x', item: 'Select the median nerve.', evidence: 'identified', correct: true, confidence: 3, picked: 'median_nerve_r' }], due: [] } })); })()""")
        await pg.goto(B); await to_world()
        mig = await pg.evaluate("({v: __ov.state.v, from: __ov.state.migratedFrom, col: __ov.state.game.collection.map(c => c.id), attempts: __ov.state.learning.attempts.length, name: __ov.state.character.name, person: __ov.state.character.person, lesson: __ov.state.game.lessonDone})")
        ok("functional", "a save from the island is carried into the institute: answers kept, what was earned becomes its counterpart", mig["v"] == 3 and mig["from"] == 2 and mig["attempts"] == 1 and mig["col"] == ["plexus-specimen", "stimulator-layer"] and mig["name"] == "Old" and mig["person"] == "tunic" and mig["lesson"], json.dumps(mig))
        await pg.goto(B + "blank.html"); await pg.evaluate("(() => { const k = Object.keys(localStorage).find(k => k.endsWith('::world')); localStorage.removeItem(k); })()")   # test setup: start the real run fresh

        # ===== 1. character =====
        await pg.goto(B); await pg.wait_for_selector("#charGo", state="visible"); await pg.wait_for_timeout(2500)
        await pg.click('[data-person="scrubs"]'); await pg.wait_for_timeout(1800); await pg.click('[data-colour="navy"]'); await pg.wait_for_timeout(700)
        await pg.fill("#cName", "Shawn"); await pg.wait_for_timeout(500); await shot("j01-character")
        await pg.click("#charGo"); await to_world(); await pg.wait_for_timeout(2500)
        ok("functional", "the chosen person, color and name are saved, and that person is the one in the level", await pg.evaluate("__ov.state.character.person === 'scrubs' && __ov.state.character.colour === 'navy' && __ov.state.character.name === 'Shawn'"))
        await shot("j02-arrival")
        goal0 = await pg.inner_text("#wGoal"); ok("functional", "on arrival one line says where to start", "plinth" in goal0.lower(), goal0[:90])
        # ===== 2. walking in =====
        await pg.mouse.move(640, 380); p0 = await P()
        ok("functional", "walk through the entrance into the court with the keyboard", await walk_to(0.5, 2.6) and await walk_to(0.5, -1.9) and (await P())["room"] == "court", json.dumps(await P())); await pg.wait_for_timeout(600); await shot("j03-court")
        y0 = await pg.evaluate("__ov.world.camera.rotation.y"); await pg.mouse.move(700, 300); await pg.mouse.down(); await pg.mouse.move(520, 292, steps=14); await pg.mouse.up(); await pg.wait_for_timeout(300)
        ok("functional", "drag turns the view", abs(await pg.evaluate("__ov.world.camera.rotation.y") - y0) > 0.3); await pg.mouse.move(520, 300); await pg.mouse.down(); await pg.mouse.move(700, 308, steps=14); await pg.mouse.up(); await pg.wait_for_timeout(300)
        await walk_to(2.3, -6.0); await shot("j04-figure"); await walk_to(1.9, -12.5); await walk_to(1.9, -18.0); await walk_to(0.3, -20.5); await pg.wait_for_timeout(500); await shot("j05-portal")
        ok("functional", "walk through the portal into the gallery; the room is known to the level", await walk_to(0.2, -24.2) and (await P())["room"] == "gallery")
        ok("functional", "walk to the lit plinth", await walk_to(0.0, -26.7, tol=0.5)); await pg.wait_for_timeout(700)
        prompt = await pg.inner_text("#wPrompt"); ok("functional", "the plinth offers to be examined", "brachial plexus" in prompt.lower() and await pg.evaluate("document.getElementById('wPrompt').classList.contains('on')"), prompt); await shot("j06-plinth")
        await pg.keyboard.press("KeyE"); await pg.wait_for_function(HALL, timeout=90000); await pg.wait_for_timeout(2500)
        # ===== 3. the film: 76 seconds, captions, scrubbing, a prediction =====
        ok("functional", "the first visit opens the film, and it is playing with a caption", await pg.evaluate(f"{LS}.mode === 'film' && __ov.hall.learn.film.playing") and len(await pg.inner_text("#hHead h1")) > 40, (await pg.inner_text("#hHead h1"))[:80]); await shot("j07-film-1")
        D = await pg.evaluate("window.renderAt.duration"); CUE = await pg.evaluate("window.renderAt.cues"); VO = "__ov.hall.learn.voice"
        spoken = await pg.evaluate(f"(async () => {{ const m = await import('./data/plexus.js'), v = {VO}; return {{ name: v.voiceName(), all: m.FILM.cues.every((c) => v.recorded(c.say)), fits: m.FILM.cues.every((c, i) => (i < m.FILM.cues.length - 1 ? m.FILM.cues[i + 1].t : m.FILM.seconds) - c.t >= v.seconds(c.say)), speaking: v.speaking() }}; }})()")
        ok("functional", "every line of the film has a recording, each cue lasts at least as long as its line, and the first line is playing", spoken["all"] and spoken["fits"] and spoken["speaking"] and 60 <= D <= 90, json.dumps(spoken) + f" film {D} s")
        cap0 = await pg.inner_text("#hHead h1"); await pg.wait_for_timeout(int((CUE[1] + 1.2) * 1000)); t1 = await pg.evaluate("__ov.hall.learn.film.t")
        ok("functional", "the film advances by itself and the caption changes with it", t1 > CUE[1] and await pg.inner_text("#hHead h1") != cap0, f"t = {t1:.1f} s"); await shot("j07-film-2")
        box = await pg.locator("#fRange").bounding_box(); await pg.mouse.click(box["x"] + box["width"] * 0.42, box["y"] + box["height"] / 2); await pg.wait_for_timeout(700)
        t2 = await pg.evaluate("__ov.hall.learn.film.t"); ok("functional", "clicking the scrubber moves the film, pauses it and stops the voice", abs(t2 - 0.42 * D) < 3 and not await pg.evaluate("__ov.hall.learn.film.playing") and not await pg.evaluate(f"{VO}.speaking()"), f"t = {t2:.1f} s")
        det = await pg.evaluate("(() => { const T = (window.renderAt.cues[3] + window.renderAt.cues[4]) / 2, a = window.renderAt(T), c1 = __ov.hall.atlas.camera.position.toArray().join(), g1 = [...__ov.hall.atlas.parts.values()].map(p => p.alpha.toFixed(3)).join(); window.renderAt(window.renderAt.cues[6] + 1); const b = window.renderAt(T), c2 = __ov.hall.atlas.camera.position.toArray().join(), g2 = [...__ov.hall.atlas.parts.values()].map(p => p.alpha.toFixed(3)).join(); return { same: c1 === c2 && g1 === g2, cue: a.cue, cap: a.caption.slice(0, 50), n: __ov.state.learning.attempts.length }; })()")
        ok("functional", "window.renderAt(t) gives the same picture for the same time, and writes nothing to the record", det["same"] and det["cue"] == 3 and det["n"] == 0, json.dumps(det))
        box = await pg.locator("#fRange").bounding_box(); await pg.mouse.click(box["x"] + box["width"] * (CUE[4] + 0.55 * (CUE[5] - CUE[4])) / D, box["y"] + box["height"] / 2); await pg.wait_for_timeout(400); await pg.click('[data-act="fplay"]')
        await pg.wait_for_selector('[data-pred="2"]', timeout=12000); await pg.wait_for_timeout(400); await shot("j08-film-prediction")
        ok("functional", "the film stops for a prediction before it shows the answer", not await pg.evaluate("__ov.hall.learn.film.playing") and "Not scored" in await pg.inner_text("#hPanel"))
        await pg.click('[data-pred="2"]'); await pg.wait_for_timeout(2500); ok("functional", "after the prediction the film goes on to the consequence", await pg.evaluate("__ov.hall.learn.film.playing && __ov.hall.learn.film.cue === 5") and "medial cord" in (await pg.inner_text("#hHead h1")).lower()); await shot("j08-film-consequence")
        box = await pg.locator("#fRange").bounding_box(); await pg.mouse.click(box["x"] + box["width"] * 0.93, box["y"] + box["height"] / 2); await pg.wait_for_timeout(300); await pg.click('[data-act="fplay"]'); await pg.wait_for_function("__ov.state.game.filmDone === true", timeout=15000); await pg.wait_for_timeout(600)
        ok("functional", "the film ends by asking you to do it yourself, and is marked seen", await pg.evaluate("__ov.state.game.filmDone === true") and await pg.locator('#hPanel [data-go="lesson"]').count() == 1); await shot("j09-film-end")
        await pg.click('#hPanel [data-go="lesson"]'); await pg.wait_for_timeout(1900)
        # ===== 4. hands-on =====
        ids = await pg.evaluate("(async () => (await import('./data/plexus.js')).ID)()"); T = ids["trunks"]
        plan = [[ids["scm"]], [ids["roots"][1]], T, ids["postDivs"], [ids["PC"]], [ids["axillary"], ids["radial"]]]
        for i, want in enumerate(plan):
            await pg.wait_for_timeout(1500)
            if i == 2:
                await click_structure(T[2]); await pg.wait_for_timeout(500); nudge = await pg.inner_text("#hPanel"); ok("functional", "hands-on corrects a wrong click without ending the step", "highest" in nudge.lower(), nudge.replace("\n", " ")[:90])
            done = [await click_structure(x) for x in want]; await pg.wait_for_timeout(500)
            ok("functional", f"hands-on step {i+1} is completed by acting on the model", await pg.evaluate(f"{LS}.done") and all(done), await pg.inner_text("#hHead h1"))
            if i in (1, 4): await shot(f"j10-hands-on-{i+1}")
            await pg.click('[data-act="next"]')
        await pg.wait_for_timeout(1200); ok("functional", "hands-on is saved, and wrote nothing to the learning record", await pg.evaluate("__ov.state.game.lessonDone === true && __ov.state.learning.attempts.length === 0"))
        # ===== 5. the challenge: 8 items; one missed then retried, one with a hint, one guessed =====
        await pg.click('[data-go="challenge"]'); await pg.wait_for_timeout(1200)
        kinds = await pg.evaluate(f"{LS}.items.map(i => i.kind)"); ok("functional", "the challenge mixes naming with working it out", kinds.count("relation") >= 4 and kinds.count("find") >= 2, kinds)
        fb = await run_items({2: "wrong+retry", 4: "hint", 6: "guess"}, "j11-challenge"); ok("functional", "a mistake is explained: what you picked, and how to tell the right one", "What you were looking for" in fb, fb)
        await pg.wait_for_timeout(1300); await shot("j12-results")
        st = await pg.evaluate("({due: __ov.state.learning.due.map(d => [d.reason, Math.round((d.at - Date.now()) / 86400000)]), col: __ov.state.game.collection.map(c => c.id), A: __ov.state.learning.attempts.map(a => [a.correct, a.assist, a.ms > 0, a.where, !!a.view, a.confidence]), best: __ov.state.game.best.plexus, sum: __ov.summary(__ov.state)})")
        ok("functional", "every answer is recorded with correctness, confidence, help used, time, route and view", len(st["A"]) == 9 and all(a[2] and a[3] == "gallery" and a[4] for a in st["A"]) and sum(1 for a in st["A"] if a[1] == "retry") == 1 and sum(1 for a in st["A"] if a[1] == "hint") == 1, json.dumps(st["A"])[:190])
        ok("functional", "assisted answers are kept apart: the record counts 7 unaided and 2 assisted", st["sum"]["attempts"] == 7 and st["sum"]["assisted"] == 2, json.dumps({k: st['sum'][k] for k in ('attempts', 'assisted', 'identified', 'related')}))
        ok("functional", "6 of 8 unaided earns the specimen; the miss returns in 1 day, the guess in 2, the sure ones in 6; the hinted item is not scheduled", st["col"] == ["plexus-specimen"] and sorted(set(map(tuple, st["due"]))) == [("guessed", 2), ("missed", 1), ("spaced", 6)] and len(st["due"]) == 7 and st["best"]["right"] == 6, json.dumps(st["due"]))
        body = await pg.inner_text("#hPanel"); ok("functional", "the results say what was shown, what was assisted and what was added, separately", "unaided" in body and "assisted" in body and "specimen" in body.lower(), body.replace("\n", " ")[:150])
        # ===== 6. what was earned is in the studio, and usable at once =====
        await pg.click('[data-go="exit"]'); await to_world(); await pg.wait_for_timeout(1500); await shot("j13-back-in-gallery")
        toast = await pg.inner_text("#wToast"); goal1 = await pg.inner_text("#wGoal"); ok("functional", "back in the level: told what was added, and where it is", "collection" in toast.lower() and "studio" in goal1.lower(), toast[:80] + " | " + goal1[:70])
        await walk_to(0.3, -23.4); await walk_to(0.4, -20.5); await walk_to(1.9, -18.0); await walk_to(1.9, -7.4); await walk_to(3.8, -5.5); ok("functional", "walk across the court and through the studio door", await walk_to(6.6, -5.6) and (await P())["room"] == "studio", json.dumps(await P()))
        ok("functional", "walk to the collection wall", await walk_to(7.6, -6.9, tol=0.5)); await pg.wait_for_timeout(900); await shot("j14-studio")
        ok("functional", "the specimen stands on the shelf as a real object", await pg.evaluate("__ov.exhibits.shelf.length") >= 1)
        await pg.keyboard.press("KeyE"); await pg.wait_for_function("!document.getElementById('wPlace').hidden", timeout=20000); await pg.wait_for_timeout(700); col = await pg.inner_text("#wPlace"); await shot("j15-collection")      # waits for the panel, not for a fixed time: a busy machine glides slowly
        ok("functional", "the collection lists it and offers to open it", "Brachial plexus specimen" in col and await pg.locator('[data-m="inspect"]').count() == 1)
        await pg.click("details.item >> nth=0"); await pg.wait_for_timeout(400); five = await pg.inner_text("details.item >> nth=0"); ok("functional", "each held thing answers: what, why, use, kept, return", all(k in five.lower() for k in ["what", "why", "use", "kept", "return"]), five.replace("\n", " ")[:120])
        await pg.click('[data-m="inspect"]'); await pg.wait_for_function(HALL, timeout=60000); await pg.wait_for_timeout(2200)
        await muscles(False); await pg.click('[data-view="lateral"]'); await pg.wait_for_timeout(1500); await click_structure(ids["PC"]); await pg.wait_for_timeout(500)
        await pg.fill("#note", "Behind the artery. Radial and axillary come off this."); await pg.keyboard.press("Tab"); await pg.wait_for_timeout(400); await shot("j16-specimen-note")
        ok("functional", "a note can be pinned to a structure of your specimen", await pg.evaluate(f"__ov.state.game.notes['{ids['PC']}']") == "Behind the artery. Radial and axillary come off this.")
        ok("functional", "the stimulation layer is not offered before it is earned", await pg.locator('[data-act="stim"]').count() == 0)
        await click_structure(ids["LC"]); await pg.wait_for_timeout(400); ok("functional", "a structure built for Overlord says that it was built", "built for overlord" in (await pg.inner_text("#hPanel")).lower())
        await pg.click('#hPanel [data-go="menu"]'); await pg.wait_for_timeout(600); await pg.click('[data-go="exit"]'); await to_world()
        # ===== 7. reload: everything is where it was =====
        await pg.wait_for_timeout(4500); await pg.goto(B); await to_world(); await pg.wait_for_timeout(2500); await shot("j17-return")
        back = await pg.evaluate("({pos: __ov.state.game.pos, P: [__ov.world.P.x, __ov.world.P.z], col: __ov.state.game.collection.map(c => c.id), notes: Object.keys(__ov.state.game.notes).length, who: __ov.state.character, shelf: __ov.exhibits.shelf.length, toast: document.getElementById('wToast').innerText, goal: document.getElementById('wGoal').innerText, room: __ov.world.room})")
        ok("functional", "after a reload: same place, same person, the specimen on the shelf, the note kept", back["pos"] and abs(back["P"][0] - back["pos"]["x"]) < 0.5 and back["room"] == "studio" and back["col"] == ["plexus-specimen"] and back["notes"] == 1 and back["who"]["person"] == "scrubs" and back["shelf"] >= 1, json.dumps(back)[:190])
        ok("functional", "after a reload: greeted by name, and pointed at the next thing", "Welcome back, Shawn" in back["toast"] and "regional case" in back["goal"].lower(), back["toast"][:50] + " | " + back["goal"][:70])
        ok("functional", "the classic app's own save is untouched", await pg.evaluate("(() => { const u = JSON.parse(localStorage.getItem('hemodynamic_overlord_session')).userId; return localStorage.getItem('hemodynamic_overlord_save_' + u) === JSON.stringify({ sentinel: 'classic-save-must-not-change', points: 1234 }); })()"))
        # ===== 8. the regional case, reached without walking =====
        await pg.click("#wGoal [data-go]"); await pg.wait_for_function(HALL, timeout=60000); await pg.wait_for_timeout(2500); await shot("j18-narration")
        ok("functional", "'Go there' opens the next activity directly, with no walking", await pg.evaluate(f"{LS}.mode === 'r-intro'"))
        cap0 = await pg.inner_text("#hHead h1"); await pg.wait_for_timeout(11500); ok("functional", "the narration plays by itself, caption by caption", await pg.evaluate(f"{LS}.n") >= 1 and await pg.inner_text("#hHead h1") != cap0)
        await pg.click('[data-act="nplay"]'); await pg.click('#hPanel [data-go="r-explore"]'); await pg.wait_for_timeout(1500)
        for k in ["interscalene", "supraclavicular", "infraclavicular", "axillary"]:
            pt = await pg.evaluate(f"(() => {{ const m = __ov.hall.atlas.markerScreen('{k}'); return [m.x, m.y]; }})()")
            if pt[0] > 880 or pt[1] < 170 or await pg.evaluate(f"__ov.hall.atlas.pick({{clientX: {pt[0]}, clientY: {pt[1]}}})") != "marker:" + k: await pg.click(f'[data-level="{k}"]')
            else: await pg.mouse.click(pt[0], pt[1])
            await pg.wait_for_timeout(1400)
        lv = (await pg.inner_text("#hPanel")).lower(); ok("functional", "all four levels can be opened; each says what it is used for, what it misses and what lies beside it", await pg.evaluate(f"{LS}.visited.size") == 4 and all(k in lv for k in ["used for", "what it misses", "what lies beside it"])); await shot("j19-levels")
        await pg.click('#hPanel [data-go="r-identify"]'); await pg.wait_for_timeout(1000); await run_items({1: "wrong"}, "j20-identify")
        await pg.wait_for_timeout(1500); case = await pg.evaluate(f"({{id: {LS}.case.id, best: Object.keys({LS}.case.grade).find(k => {LS}.case.grade[k][0] === 'best'), no: Object.keys({LS}.case.grade).find(k => {LS}.case.grade[k][0] === 'no'), truths: {LS}.case.reasons.map(r => r[1])}})"); await shot("j21-case")
        ok("functional", "the case shows four unlabelled level rings", await pg.evaluate("__ov.hall.atlas.markers.size === 4 && document.getElementById('hLabels').children.length === 0"))
        async def choose(level):
            await muscles(False); await pg.click('[data-view="anterolateral"]'); await pg.wait_for_timeout(1600)
            pt = await pg.evaluate(f"(() => {{ const m = __ov.hall.atlas.markerScreen('{level}'); return [m.x, m.y]; }})()"); await pg.mouse.click(pt[0], pt[1]); await pg.wait_for_timeout(500); return await pg.evaluate(f"{LS}.chosen") == level
        ok("functional", "the approach is chosen by clicking its level on the model", await choose(case["no"]), case["no"]); await pg.click('[data-act="ccommit"]'); await pg.wait_for_timeout(500)
        for i, t in enumerate(case["truths"]):
            if t and i != 0: await pg.click(f'[data-reason="{i}"]'); await pg.wait_for_timeout(180)
        await pg.click('[data-act="creasons"]'); await pg.wait_for_timeout(500); await pg.fill("#why", "It is the nearest approach to where the surgery is."); await pg.click('[data-act="cexplain"]'); await pg.wait_for_timeout(1400); await shot("j22-case-first-attempt")
        body = await pg.inner_text("#hPanel"); ok("functional", "a poor approach is graded as such, each reason is marked, and a model answer is set beside your sentence", all(k in body.lower() for k in ["not this approach", "your reasons", "a model answer", "your sentence"]), body.replace("\n", " ")[:120])
        await pg.click('[data-self="0"]'); await pg.wait_for_timeout(400)
        await pg.click('#hPanel [data-go="r-questions"]'); await pg.wait_for_timeout(900)
        for qi in range(await pg.evaluate(f"{LS}.qs.length")):
            q = await pg.evaluate(f"({{type: {LS}.qs[{LS}.q].type, correct: {LS}.qs[{LS}.q].correct}})")
            if q["type"] == "match":
                for i, c in enumerate(q["correct"]): await pg.select_option(f'[data-match="{i}"]', str(c)); await pg.wait_for_timeout(200)
            else:
                for o in q["correct"]: await pg.click(f'[data-opt="{o}"]'); await pg.wait_for_timeout(200)
            await pg.click('[data-act="qsubmit"]'); await pg.wait_for_timeout(700); good = "correct" in (await pg.inner_text("#hPanel .verdict")).lower(); await pg.click('[data-act="qnext"]'); await pg.wait_for_timeout(500)
            ok("functional", f"practice question {qi+1} ({q['type']}) accepts the correct answer", good)
        await pg.wait_for_timeout(900); await shot("j23-regional-results")
        r = await pg.evaluate("({col: __ov.state.game.collection.map(c => c.id), cases: Object.fromEntries(Object.entries(__ov.state.game.cases).map(([k, v]) => [k, v.attempts.map(a => [a.chosen, a.grade, a.self])])), done: __ov.state.game.progress.regionalDone, outline: [...new Set(__ov.state.learning.attempts.map(a => a.outline).filter(Boolean))]})")
        ok("functional", "the explained case is filed in the archive even though the approach was wrong; the series patch is not given", ("case:" + case["id"]) in r["col"] and "regional-patch" not in r["col"] and r["cases"][case["id"]] == [[case["no"], "no", False]] and "III.I.5" in r["outline"], json.dumps(r)[:190])
        await pg.click('[data-go="exit"]'); await to_world(); await pg.wait_for_timeout(1200)
        # ===== 9. the archive: run the case again and compare =====
        await pg.evaluate("__ov.world.open('desk')"); await pg.wait_for_function("!document.getElementById('wPlace').hidden", timeout=25000); await pg.wait_for_timeout(700)   # test setup: stand at the desk instead of walking there again
        desk = await pg.inner_text("#wPlace"); ok("functional", "the desk shows the case with your decisions and your own sentence", "nearest approach" in desk and "Not this approach" in desk and await pg.locator(".atts.two").count() == 0, desk.replace("\n", " ")[:110]); await shot("j24-archive-one")
        await pg.click('[data-m="case"]'); await pg.wait_for_function(HALL, timeout=60000); await pg.wait_for_timeout(2200)
        for _ in range(3):
            if await pg.evaluate(f"{LS}.case.id") == case["id"]: break
            await pg.evaluate("__ov.hall.learn.go('r-case')"); await pg.wait_for_timeout(900)   # test setup: ask for a case until it is the same one
        if await pg.evaluate(f"{LS}.case.id") == case["id"]:
            await choose(case["best"]); await pg.click('[data-act="ccommit"]'); await pg.wait_for_timeout(400)
            for i, t in enumerate(case["truths"]):
                if t: await pg.click(f'[data-reason="{i}"]'); await pg.wait_for_timeout(160)
            await pg.click('[data-act="creasons"]'); await pg.wait_for_timeout(400); await pg.fill("#why", "It covers what the surgery needs and avoids what this patient cannot afford."); await pg.click('[data-act="cexplain"]'); await pg.wait_for_timeout(1200); await pg.click('[data-self="1"]'); await pg.wait_for_timeout(300)
            await pg.evaluate("__ov.hall.learn.go('menu')"); await pg.wait_for_timeout(500); await pg.click('[data-go="exit"]'); await to_world(); await pg.evaluate("__ov.world.open('desk')"); await pg.wait_for_function("!document.getElementById('wPlace').hidden", timeout=25000); await pg.wait_for_timeout(700)   # test setup: back to the desk
            desk2 = await pg.inner_text("#wPlace"); ok("functional", "after a second attempt the desk sets the first and the latest side by side", await pg.locator(".atts.two .att").count() == 2 and "Not this approach" in desk2 and "preferred approach" in desk2.lower() and "First attempt on the left" in desk2, desk2.replace("\n", " ")[:120]); await shot("j25-archive-compare")
        else: ok("functional", "after a second attempt the desk sets the first and the latest side by side", False, "the same case did not come up again")
        await pg.keyboard.press("Escape"); await pg.wait_for_timeout(600)
        # ===== 10. honest states: every other place says what works and what does not =====
        for key, must in [("or", ["Works", "Not built", "Student Workstation"]), ("regional", ["Works", "Approximated", "Not built", "ultrasound"]), ("mirror", ["without a camera", "Not built", "never count against you"]), ("atrium", ["Move the plane", "view-only"])]:
            await pg.evaluate(f"__ov.world.open('{key}')"); await pg.wait_for_function("!document.getElementById('wPlace').hidden", timeout=25000); await pg.wait_for_timeout(700); txt = await pg.inner_text("#wPlace")   # test setup: visit each place without walking
            ok("functional", f"{key}: the place states what works, what is approximated and what is not built", all(m.lower() in txt.lower() for m in must), txt.replace("\n", " ")[:90])
            if key in ("or", "atrium"): await shot(f"j26-place-{key}")
            if key == "atrium":
                k0 = await pg.evaluate("__ov.exhibits.figure.k"); await pg.focus("#figK"); [await pg.keyboard.press("ArrowLeft" if k0 > 0.5 else "ArrowRight") for _ in range(30)]; await pg.wait_for_timeout(300); ok("functional", "atrium: moving the slider moves the section plane", abs(await pg.evaluate("__ov.exhibits.figure.k") - k0) > 0.1)
            await pg.keyboard.press("Escape"); await pg.wait_for_timeout(500)
        # ===== 11. two days later: what was missed comes first, without walking; passing it adds the stimulation layer =====
        await pg.evaluate("(() => { for (const d of __ov.state.learning.due) { d.at -= 2 * 86400000; d.set -= 2 * 86400000; } for (const c of __ov.state.game.collection) c.at -= 2 * 86400000; __ov.save(__ov.state); })()")   # test setup: move the clock
        await pg.goto(B); await to_world(); goal2 = await pg.inner_text("#wGoal"); ok("functional", "two days later the level says what is due", "due" in goal2.lower(), goal2[:80])
        await pg.click("#mark"); await pg.wait_for_timeout(400); await shot("j27-menu"); await pg.click('[data-m="study"]'); await pg.wait_for_timeout(1500); await shot("j28-direct-study")
        await pg.click('#wPlace [data-d="plexus"][data-mode="review"]'); await pg.wait_for_function(HALL, timeout=60000); await pg.wait_for_timeout(1500)
        dueAsks = await pg.evaluate("__ov.state.learning.due.filter(d => d.at <= Date.now()).map(d => d.item)"); items = await pg.evaluate(f"{LS}.items.map(i => i.ask)")
        ok("functional", "menu > Study directly > Review opens the missed and guessed items, with no walking", len(items) >= 2 and all(a in dueAsks for a in items), f"{len(items)} review items")
        await run_items({}, "j29-review"); await pg.wait_for_timeout(1200)
        rv = await pg.evaluate("({col: __ov.state.game.collection.map(c => c.id), sum: __ov.summary(__ov.state)})"); ok("functional", "a later review that is passed adds the stimulation layer, and counts as delayed recall", "stimulator-layer" in rv["col"] and rv["sum"]["delayed"] >= 2 and rv["sum"]["delayedPct"] == 100, json.dumps({"col": rv["col"], "delayed": rv["sum"]["delayed"], "pct": rv["sum"]["delayedPct"]}))
        await pg.evaluate("__ov.hall.learn.go('explore')"); await pg.wait_for_timeout(900)   # test setup: jump to Explore
        await muscles(False); await pg.click('[data-view="lateral"]'); await pg.wait_for_timeout(1500); await click_structure(ids["PC"]); await pg.wait_for_timeout(400)
        await pg.click('[data-act="stim"]'); await pg.wait_for_timeout(500); stim = await pg.inner_text("#hPanel .stim"); ok("functional", "the earned stimulation layer works on a cord", "little finger extends" in stim, stim[:90]); await shot("j30-stimulation")
        await pg.click('#hPanel [data-go="menu"]'); await pg.wait_for_timeout(500); await pg.click('[data-go="exit"]'); await to_world()
        # ===== 12. the record, settings, the mirror in the studio =====
        await pg.click("#mark"); await pg.wait_for_timeout(300); await pg.click('[data-m="record"]'); await pg.wait_for_timeout(1200); rec = await pg.inner_text("#wPlace"); await shot("j31-record")
        ok("functional", "the record keeps coverage, assisted work, unaided answers and delayed recall apart, and claims no exam score", all(k in rec.lower() for k in ["coverage", "assisted", "unaided", "delayed", "iii.i.1"]) and "not an NBCRNA score" in rec, rec.replace("\n", " ")[:120]); await pg.keyboard.press("Escape"); await pg.wait_for_timeout(400)
        await pg.click("#mark"); await pg.wait_for_timeout(300); await pg.click('[data-m="settings"]'); await pg.wait_for_timeout(900); await pg.focus("#sF"); [await pg.keyboard.press("ArrowRight") for _ in range(8)]; await pg.click("#sC"); await pg.wait_for_timeout(300); await shot("j32-settings")
        ok("functional", "settings change field of view and captions, and are saved with the account", await pg.evaluate("__ov.world.prefs.fov === 70 && __ov.world.prefs.captions === false && __ov.state.game.prefs.fov === 70")); await pg.keyboard.press("Escape"); await pg.wait_for_timeout(400)
        await pg.click("#mark"); await pg.wait_for_timeout(300); await pg.click('[data-m="character"]'); await pg.wait_for_selector("#charGo", state="visible"); await pg.wait_for_timeout(1500); await pg.click('[data-person="coat"]'); await pg.wait_for_timeout(1800); await shot("j33-change-character"); await pg.click("#charGo"); await to_world(); await pg.wait_for_timeout(1500)
        ok("functional", "the character can be changed later and the new one walks the level", await pg.evaluate("__ov.state.character.person === 'coat'"))
        # ===== 13. a direct link opens an activity without walking =====
        await pg.goto(B + "?go=plexus&mode=challenge"); await pg.wait_for_function(HALL, timeout=90000); await pg.wait_for_timeout(1500)
        ok("functional", "a direct link (?go=plexus&mode=challenge) opens the challenge with no walking", await pg.evaluate(f"{LS}.mode === 'items' && {LS}.run === 'plexus'"))
        ok("functional", "sound: the audio engine starts on first input and the mute choice is kept", await pg.evaluate("(async () => { const a = await import('./js/audio.js'); a.unlock(); a.setMuted(true); const m1 = localStorage.getItem('overlord_world_mute'); a.setMuted(false); return m1 === '1' && localStorage.getItem('overlord_world_mute') === '0'; })()"))
        ok("functional", "no script errors during the whole run", not errs, errs[:3])
        await ctx.close(); await b.close()
    v = sorted(glob.glob(OUT + "/_vid/*.webm"), key=os.path.getsize)[-1]; shutil.move(v, OUT + "/journey.webm"); shutil.rmtree(OUT + "/_vid", ignore_errors=True)
    print(f"\n{sum(1 for r in R if r['pass'])} of {len(R)} functional checks pass"); json.dump(R, open(OUT + "/journey-results.json", "w"), indent=1)
asyncio.run(main())
