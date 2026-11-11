"""End-to-end playthrough with real keyboard and mouse. Records video. Prints a results table."""
import sys, asyncio, json, glob, os, shutil
from playwright.async_api import async_playwright
OUT = sys.argv[1]; ACC = json.load(open(sys.argv[2])); B = "http://localhost:8090/world/"; R = []
def ok(name, cond, detail=""): R.append((bool(cond), name, str(detail)[:150])); print(("PASS " if cond else "FAIL ") + name + (" :: " + str(detail)[:150] if detail else ""))
FIND = """(id) => { const a = __ov.hall.atlas, p = a.parts.get(id), r = a.renderer.domElement.getBoundingClientRect(); if (!p) return null;
  const v = p.samples[0].clone(); for (const s of p.samples) { v.copy(s).project(a.camera); if (v.z > 1) continue; const x = r.left + (v.x + 1) / 2 * r.width, y = r.top + (1 - v.y) / 2 * r.height; if (x < r.left + 8 || x > r.right - 380 || y < r.top + 150 || y > r.bottom - 90) continue; if (a.pick({ clientX: x, clientY: y }) === id) return [x, y]; } return null; }"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(channel="chrome", args=["--use-angle=metal","--enable-gpu","--ignore-gpu-blocklist"])
        ctx = await b.new_context(viewport={"width":1280,"height":760}, record_video_dir=OUT+"/_vid", record_video_size={"width":1280,"height":760})
        pg = await ctx.new_page(); errs=[]
        pg.on("pageerror", lambda e: errs.append(str(e)[:300])); pg.on("console", lambda m: errs.append("console: "+m.text[:200]) if m.type=="error" and "404" not in m.text else None)
        shot = lambda n: pg.screenshot(path=f"{OUT}/{n}.jpg", quality=84, type="jpeg")
        P = lambda: pg.evaluate("({x: __ov.world.P.x, y: __ov.world.P.y, z: __ov.world.P.z})")
        async def walk_to(x, z, tol=0.45, limit=14):
            keysdown = set(); t = 0
            while t < limit:
                p_ = await P(); want = set()
                if p_["z"] - z > tol: want.add("KeyW")
                if z - p_["z"] > tol: want.add("KeyS")
                if x - p_["x"] > tol: want.add("KeyD")
                if p_["x"] - x > tol: want.add("KeyA")
                for k in keysdown - want: await pg.keyboard.up(k)
                for k in want - keysdown: await pg.keyboard.down(k)
                keysdown = want
                if not want: return True
                await pg.wait_for_timeout(50); t += 0.05
            for k in keysdown: await pg.keyboard.up(k)
            return False
        async def click_structure(id_):
            for attempt in range(6):
                pt = await pg.evaluate(f"({FIND})('{id_}')")
                if pt: await pg.mouse.move(pt[0], pt[1], steps=6); await pg.wait_for_timeout(180); await pg.mouse.click(pt[0], pt[1]); await pg.wait_for_timeout(350); return True
                await pg.wait_for_timeout(500)
            return False
        # ---- 1. sign in with the existing test account; nothing of the classic save may change
        await pg.goto(B + "?character"); await pg.wait_for_timeout(1200)
        if await pg.locator("#gate").is_visible():
            await pg.fill("#gUser", ACC["username"]); await pg.fill("#gPass", ACC["password"]); await pg.click('#gateForm button[type=submit]'); await pg.wait_for_timeout(900)
            if await pg.locator("#gate").is_visible(): await pg.click("#gReg"); await pg.wait_for_timeout(900)
        ok("sign in with the app's own account reaches character screen", await pg.locator("#character").is_visible())
        await pg.evaluate("(() => { const k = Object.keys(localStorage).find(k => k.endsWith('::world')); if (k) localStorage.removeItem(k); const u = JSON.parse(localStorage.getItem('hemodynamic_overlord_session')).userId; localStorage.setItem('hemodynamic_overlord_save_' + u, JSON.stringify({ sentinel: 'classic-save-must-not-change', points: 1234 })); })()")
        await pg.reload(); await pg.wait_for_timeout(1500); await shot("p01-character")
        # ---- 2. character
        for sel in ['[data-k="skin"][data-v="3"]', '[data-k="hair"][data-v="curly"]', '[data-k="scrubs"][data-v="0"]', '[data-t="cap"]', '[data-t="cap"]', '[data-t="glasses"]']:
            await pg.click(sel); await pg.wait_for_timeout(450)
        await pg.fill("#cName", "Shawn"); await pg.wait_for_timeout(500); await shot("p02-character-made")
        await pg.click("#charGo"); await pg.wait_for_function("window.__ov && __ov.world && __ov.world.active", timeout=40000); await pg.wait_for_timeout(2200)
        ok("character saved with chosen options", await pg.evaluate("__ov.state.character.hair === 'curly' && __ov.state.character.skin === 3 && __ov.state.character.glasses === true && __ov.state.character.name === 'Shawn'"))
        await shot("p03-arrive")
        # ---- 3. explore: field note at the end of the pier, then walk to the Hall around the fountain
        await pg.mouse.move(640, 380)
        ok("walked to the end of the pier (real keys)", await walk_to(37, 68.3)); await pg.wait_for_timeout(900)
        ok("field note collected by walking into it", await pg.evaluate("__ov.state.game.notes.includes('dock')"), await pg.inner_text("#wToast")); await shot("p04-field-note")
        await pg.mouse.move(700, 300); await pg.mouse.down(); await pg.mouse.move(560, 290, steps=12); await pg.mouse.move(700, 300, steps=12); await pg.mouse.up()   # look around, and back
        await pg.evaluate("__ov.world.cam.yaw = 0")
        await walk_to(37, 48.5); await shot("p05-toward-plaza")
        await walk_to(41.8, 46.5); await walk_to(41.8, 42.2); await pg.wait_for_timeout(1400); await shot("p06-booth")
        ok("Booth speaks when you are near", await pg.evaluate("__ov.world.people[0].near"))
        await walk_to(41.8, 31); await walk_to(37, 31); ok("reached the Hall door", await walk_to(37, 25.6)); await pg.wait_for_timeout(700)
        ok("door prompt appears", await pg.evaluate("__ov.world.spotLabel()") == "Enter Anatomy Hall"); await shot("p07-hall-door")
        await pg.keyboard.press("KeyE"); await pg.wait_for_function("window.__ov && window.__ov.hall && __ov.hall.atlas.running", timeout=40000); await pg.wait_for_timeout(2600); await shot("p08-hall-menu")
        # ---- 4. the lesson: do what each step asks, with real clicks on the model
        await pg.click('[data-go="lesson"]'); await pg.wait_for_timeout(1900)
        T = ['superior_trunk_of_brachial_plexus_r', 'middle_trunk_of_brachial_plexus_r', 'inferior_trunk_of_brachial_plexus_r']
        plan = [['sternocleidomastoid_muscle_r'], [T[1]], T, ['posterior_cord_of_brachial_plexus_r'], ['axillary_nerve_r', 'radial_nerve_r'], [T[2]]]
        for i, ids in enumerate(plan):
            await pg.wait_for_timeout(1500)
            if i == 2:   # a wrong click first, to see the correction
                await click_structure(T[2]); await pg.wait_for_timeout(600); nudge = await pg.inner_text("#hPanel"); ok("lesson corrects a wrong order without ending the step", "highest" in nudge.lower() or "not" in nudge.lower(), nudge[:90].replace("\n", " "))
            done = [await click_structure(x) for x in ids]; await pg.wait_for_timeout(500)
            okd = await pg.evaluate("__ov.hall.learn.state.done"); ok(f"lesson step {i+1} completed by acting on the model", okd and all(done), await pg.inner_text("#hHead h1"))
            await shot(f"p09-lesson-{i+1}"); await pg.click('[data-act="next"]')
        await pg.wait_for_timeout(1200); ok("lesson completion saved", await pg.evaluate("__ov.state.game.lessonDone === true"))
        # ---- 5. the challenge: no labels. Miss two on purpose.
        await pg.click('[data-go="challenge"]'); await pg.wait_for_timeout(1600)
        ok("no names are shown during the challenge", await pg.evaluate("document.getElementById('hLabels').children.length === 0"))
        await pg.click('[data-layer="muscle"]'); await pg.wait_for_timeout(700)   # peel the muscles, as a player would
        n = await pg.evaluate("__ov.hall.learn.state.items.length"); tipSeen = False
        for i in range(n):
            ans = await pg.evaluate("__ov.hall.learn.state.items[__ov.hall.learn.state.i].answer[0]"); wrong = i in (2, 5)
            pick = ("median_nerve_r" if ans != "median_nerve_r" else "ulnar_nerve_r") if wrong else ans
            if await pg.evaluate(f"__ov.hall.atlas.parts.get('{pick}').layer") == 'muscle': await pg.click('[data-layer="muscle"]'); await pg.wait_for_timeout(600)
            got = await click_structure(pick)
            if not got: await pg.click('[data-view="lateral"]'); await pg.wait_for_timeout(1400); got = await click_structure(pick)
            if not got: await pg.click('[data-view="posterior"]'); await pg.wait_for_timeout(1400); got = await click_structure(pick)
            tipSeen = tipSeen or await pg.evaluate("document.getElementById('hTip').classList.contains('on')")
            if i == 0: await shot("p10-challenge-selected")
            await pg.click(f'[data-conf="{3 if (not wrong or i == 5) else 1}"]'); await pg.wait_for_timeout(1500)
            if i in (0, 2): await shot(f"p11-challenge-feedback-{i+1}")
            verdict = await pg.inner_text("#hPanel .verdict"); ok(f"challenge {i+1}: {'wrong pick is marked wrong' if wrong else 'right pick is marked right'}", got and (("not" in verdict.lower()) == wrong), ans.replace("_r", "").replace("_", " ")[:40])
            if await pg.evaluate("!__ov.hall.atlas.layerIsOn('muscle')") is False: await pg.click('[data-layer="muscle"]')
            await pg.click('[data-act="cnext"]'); await pg.wait_for_timeout(1300)
            if i < n - 1 and await pg.evaluate("__ov.hall.atlas.layerIsOn('muscle')"): await pg.click('[data-layer="muscle"]'); await pg.wait_for_timeout(500)
        ok("structure names never appeared on hover during the challenge", not tipSeen)
        # ---- 6. three practice questions
        for qi in range(3):
            await pg.wait_for_timeout(700); correct = await pg.evaluate("(async () => (await import('./data/plexus.js')).QUESTIONS.map(q => q.correct))()")
            for o in correct[qi]: await pg.click(f'[data-opt="{o}"]'); await pg.wait_for_timeout(250)
            if qi == 1: await shot("p12-question")
            await pg.click('[data-act="qsubmit"]'); await pg.wait_for_timeout(900); await pg.click('[data-act="qnext"]')
        await pg.wait_for_timeout(1300); await shot("p13-results"); res = await pg.inner_text("#hPanel")
        st = await pg.evaluate("({due: __ov.state.learning.due.map(d => [d.reason, Math.round((d.at - Date.now()) / 86400000)]), attempts: __ov.state.learning.attempts.length, rewards: __ov.state.game.rewards, inv: __ov.state.game.inventory})")
        ok("6 of 8 unaided answers earns the reward; learning record kept separately", "nerve-stimulator" in st["rewards"] and st["attempts"] == 11, json.dumps(st)[:150])
        ok("missed items are due tomorrow, a correct guess in two days, sure-and-right in six", sorted(set(map(tuple, st["due"]))) == [("guessed", 2), ("missed", 1), ("spaced", 6)] or sorted(set(map(tuple, st["due"]))) == [("missed", 1), ("spaced", 6)], sorted(set(map(tuple, st["due"]))))
        # ---- 7. back to the island wearing what was earned; build on the plot
        await pg.click('[data-go="exit"]'); await pg.wait_for_function("__ov.world.active", timeout=15000); await pg.wait_for_timeout(2500); await shot("p14-back-with-reward")
        ok("return toast names what was earned", "Earned" in await pg.inner_text("#wToast"), (await pg.inner_text("#wToast"))[:110])
        await walk_to(37, 31); await walk_to(41.8, 31); await walk_to(41.8, 44.5); await walk_to(46.5, 46.5); await walk_to(46.5, 50); ok("walked onto the plot", await walk_to(48.5, 52.5)); await pg.wait_for_timeout(500)
        await pg.keyboard.press("KeyB"); await pg.wait_for_timeout(600); ok("build mode opens on the plot", await pg.evaluate("__ov.world.build().on"))
        await pg.evaluate("__ov.world.cam.pitch = 0.7; __ov.world.cam.dist = 11"); await pg.wait_for_timeout(600)
        await pg.click('[data-item="plexus"]'); pt = await pg.evaluate("__ov.world.blockScreen(50, 6, 50)"); await pg.mouse.click(pt[0], pt[1] - 6); await pg.wait_for_timeout(900)
        await pg.click('[data-item="lamp"]')
        for bx, bz in [(48, 49), (52, 49)]: pt = await pg.evaluate(f"__ov.world.blockScreen({bx}, 6, {bz})"); await pg.mouse.click(pt[0], pt[1] - 6); await pg.wait_for_timeout(500)
        await pg.click('[data-item="plank"]')
        for bx in (49, 50, 51): pt = await pg.evaluate(f"__ov.world.blockScreen({bx}, 6, 54)"); await pg.mouse.click(pt[0], pt[1] - 6); await pg.wait_for_timeout(400)
        await pg.wait_for_timeout(1800); plot = await pg.evaluate("__ov.state.game.plot"); ok("placed the earned plexus model and blocks on the plot (real clicks)", len(plot) >= 5 and any(b[3] == 19 for b in plot), plot)
        await pg.keyboard.press("KeyB"); await pg.evaluate("__ov.world.cam.pitch = 0.42; __ov.world.cam.dist = 8; __ov.world.cam.yaw = 2.6"); await pg.wait_for_timeout(1600); await shot("p15-plot-built")
        before = await pg.evaluate("JSON.stringify(__ov.state.game.pos)")
        # ---- 8. come back later: a fresh page load
        await pg.wait_for_timeout(2800); await pg.goto(B); await pg.wait_for_function("window.__ov && __ov.world && __ov.world.active", timeout=40000); await pg.wait_for_timeout(2600); await shot("p16-return")
        back = await pg.evaluate("({pos: __ov.state.game.pos, P: [__ov.world.P.x, __ov.world.P.z], plot: __ov.state.game.plot.length, notes: __ov.state.game.notes, rewards: __ov.state.game.rewards, name: __ov.state.character.name, visits: __ov.state.visits, toast: document.getElementById('wToast').innerText})")
        ok("on return: same place, same character, plot, notes and rewards", abs(back["P"][0] - back["pos"][0]) < 0.5 and back["plot"] == len(plot) and back["notes"] == ["dock"] and "nerve-stimulator" in back["rewards"] and back["name"] == "Shawn", json.dumps(back)[:150])
        ok("on return: greeted by name", "Welcome back, Shawn" in back["toast"], back["toast"][:100])
        ok("the classic app's save is untouched", await pg.evaluate("(() => { const u = JSON.parse(localStorage.getItem('hemodynamic_overlord_session')).userId; return localStorage.getItem('hemodynamic_overlord_save_' + u) === JSON.stringify({ sentinel: 'classic-save-must-not-change', points: 1234 }); })()"))
        # due review: pretend it is two days later, then check the Hall offers the missed ones first
        await pg.evaluate("(() => { for (const d of __ov.state.learning.due) d.at -= 2 * 86400000; __ov.save(__ov.state); })()"); await pg.goto(B + "?go=hall"); await pg.wait_for_function("window.__ov && window.__ov.hall && __ov.hall.atlas.running", timeout=40000); await pg.wait_for_timeout(1500)
        menu = await pg.inner_text("#hPanel"); await pg.click('[data-go="challenge"]'); await pg.wait_for_timeout(800)
        first = await pg.evaluate("__ov.hall.learn.state.items.slice(0, 2).map(i => i.ask)"); dueAsks = await pg.evaluate("__ov.state.learning.due.filter(d => d.at <= Date.now()).map(d => d.item)")
        ok("two days later the missed structures are due and come first", "due" in menu and all(a in dueAsks for a in first), menu.split("\n")[3][:80] if len(menu.split("\n")) > 3 else menu[:80])
        m = await pg.evaluate("new Promise(r => { let n = 0, t0 = performance.now(); (function f() { if (++n < 120) requestAnimationFrame(f); else r(+((performance.now() - t0) / 120).toFixed(1)); })(); })"); print("frame ms (atlas):", m)
        ok("no script errors during the whole run", not errs, errs[:3])
        await ctx.close(); await b.close()
    v = sorted(glob.glob(OUT+"/_vid/*.webm"), key=os.path.getsize)[-1]; shutil.move(v, OUT+"/playthrough.webm"); shutil.rmtree(OUT+"/_vid", ignore_errors=True)
    print(f"\n{sum(1 for r in R if r[0])} of {len(R)} checks pass"); json.dump([{"pass": a, "check": b, "detail": c} for a, b, c in R], open(OUT+"/playthrough-results.json", "w"), indent=1)
asyncio.run(main())
