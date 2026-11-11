"""scan_check.py: the airway-and-neck exhibit, driven with REAL mouse and keyboard input, recorded to video.
     uv run --with playwright python3 tools/scan_check.py OUT_DIR tools/test-account.example.json [PORT]
   A functional check: that the model and the scan's slices are linked both ways, that cutting, ghosting, isolating and
   selecting work, and that the unlabeled round records what it should. It says nothing about whether the outlines are
   anatomically right (docs/overlord-world/HEADNECK-CT.md covers how they were reviewed) or about real devices.
   Page internals are read to learn where to click and to confirm results; "test setup" marks the few direct changes."""
import sys, asyncio, json, glob, os, shutil
from playwright.async_api import async_playwright
OUT = sys.argv[1]; ACC = json.load(open(sys.argv[2])); PORT = sys.argv[3] if len(sys.argv) > 3 else "8091"; B = f"http://127.0.0.1:{PORT}/world/"; R = []
os.makedirs(OUT, exist_ok=True)
def ok(name, cond, detail=""):
    R.append({"group": "functional", "pass": bool(cond), "check": name, "detail": str(detail)[:200]}); print(("PASS " if cond else "FAIL ") + name + (" :: " + str(detail)[:170] if detail else ""), flush=True)
SC = "__ov.scan"; ST = "__ov.scan.state"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(channel="chrome", args=["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"])
        ctx = await b.new_context(viewport={"width": 1280, "height": 760}, record_video_dir=OUT + "/_vid", record_video_size={"width": 1280, "height": 760})
        pg = await ctx.new_page(); errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)[:300])); pg.on("console", lambda m: errs.append("console: " + m.text[:240]) if m.type == "error" and "404" not in m.text else None)
        shot = lambda n: pg.screenshot(path=f"{OUT}/{n}.jpg", quality=86, type="jpeg")
        await pg.goto(B + "blank.html")
        await pg.evaluate("""async ([u, p]) => { const a = await import('/core/auth.js'); let r = await a.loginUser(u, p); if (!r.success) { await a.registerUser(u, p); r = await a.loginUser(u, p); }
          const s = await import('/world/js/save.js'); localStorage.removeItem(s.key()); const st = s.load(); st.character = { name: 'Shawn', person: 'scrubs', colour: 'navy' }; s.save(st); }""", [ACC["username"], ACC["password"]])   # test setup: a signed-in learner with a character and nothing else
        await pg.goto(B); await pg.wait_for_function("window.__ov && __ov.world && __ov.places && document.getElementById('veil').classList.contains('off')", timeout=120000); await pg.wait_for_timeout(2500)
        ok("the level knows the exhibit is installed, and its lightbox shows the scan", await pg.evaluate("__ov.exhibits.hasScan === true"))
        await pg.evaluate("__ov.world.teleport('airway')"); await pg.wait_for_timeout(900); await shot("s01-mount")   # test setup: stand at the mount without walking
        await pg.keyboard.press("KeyE"); await pg.wait_for_function(f"window.__ov && {SC} && {SC}.running", timeout=90000); await pg.wait_for_timeout(2500); await shot("s02-menu")
        info = await pg.evaluate(f"({{n: {SC}.parts.size, dims: [{SC}.volume.NI, {SC}.volume.NJ, {SC}.volume.NK], src: {SC}.volume.vol.source.license}})")
        ok("the exhibit opens from its mount with the model, the scan and its licence", info["n"] >= 60 and info["dims"] == [98, 152, 185] and "CC BY" in info["src"], json.dumps(info))
        body = await pg.inner_text("#sPanel"); await pg.click("#sPanel details.src summary"); await pg.wait_for_timeout(300); lim = await pg.inner_text("#sPanel")
        ok("it says what it is: software outlines on one scan, AI-reviewed, not checked by a radiologist, and no peripheral nerves", all(k in lim for k in ["NOT validated by a radiologist", "does not outline the brachial plexus", "CC BY 4.0"]), lim.replace("\n", " ")[-200:])
        # ---- the tour: five operations on this scan
        await pg.click('[data-go="tour"]'); await pg.wait_for_timeout(1500)
        await pg.focus("#scPos"); [await pg.keyboard.press("ArrowRight") for _ in range(18)]; await pg.wait_for_timeout(500); await shot("s03-tour-scan")
        ok("tour 1: moving the slider moves through the scan, on bare slices", await pg.evaluate(f"{ST}.done && {ST}.slicesOnly"))
        await pg.click('[data-act="tnext"]'); await pg.wait_for_timeout(1700)
        pt = None
        for sid in ["larynx_air", "trachea", "oropharynx", "hypopharynx"]:
            pt = await pg.evaluate(f"{SC}.spot3d('{sid}')")
            if pt: break
        if pt: await pg.mouse.click(pt[0], pt[1]); await pg.wait_for_timeout(600)
        ok("tour 2: the air column is selected by clicking it on the cut model", bool(pt) and await pg.evaluate(f"{ST}.done"), sid); await shot("s04-tour-model")
        cross = await pg.evaluate(f"{ST}.cross.toArray().map(v => +v.toFixed(4))"); await pg.click('[data-act="tnext"]'); await pg.wait_for_timeout(900)
        pt = await pg.evaluate(f"{SC}.findOnSlice('sagittal', 'trachea') || {SC}.findOnSlice('axial', 'larynx_air') || {SC}.findOnSlice('sagittal', 'oropharynx')"); await pg.mouse.click(pt[0], pt[1]); await pg.wait_for_timeout(600)
        ok("tour 3: the same air column is selected by clicking it on a slice; the model lights it too", await pg.evaluate(f"{ST}.done && {SC}.parts.get({ST}.sel).glow > 0.2"), await pg.evaluate(f"{ST}.sel")); await shot("s05-tour-slice")
        await pg.click('[data-act="tnext"]'); await pg.wait_for_timeout(1200); await pg.click('[data-group="bone"]'); await pg.wait_for_timeout(900)
        ok("tour 4: a group can be ghosted, and what it hid shows through", await pg.evaluate(f"{ST}.done && {ST}.groups.bone === 0.5 && {SC}.parts.get('mandible').alpha < 0.3")); await shot("s06-tour-ghost")
        await pg.click('[data-act="tnext"]'); await pg.wait_for_timeout(1700)
        pr = await pg.evaluate(f"{SC}.findOnSlice('axial', 'internal_jugular_vein_right')"); pl = await pg.evaluate(f"{SC}.findOnSlice('axial', 'internal_jugular_vein_left')")
        ok("the axial slice is drawn in radiological convention: the patient's left is on the right of the picture", pr and pl and pl[0] > pr[0], f"right IJV at x {pr[0]:.0f}, left IJV at x {pl[0]:.0f}")
        await pg.mouse.click(pr[0], pr[1]); await pg.wait_for_timeout(500); nudge = await pg.inner_text("#sPanel"); ok("tour 5: choosing the wrong side is corrected, not ended", "mirrored" in nudge and not await pg.evaluate(f"{ST}.done"), nudge.replace("\n", " ")[:100])
        await pg.mouse.click(pl[0], pl[1]); await pg.wait_for_timeout(600); ok("tour 5: the left internal jugular vein is found on the axial slice", await pg.evaluate(f"{ST}.done")); await shot("s07-tour-axial")
        await pg.click('[data-act="tnext"]'); await pg.wait_for_timeout(900); ok("the tour is saved, and wrote nothing to the learning record", await pg.evaluate("__ov.state.game.progress.scanTour === true && __ov.state.learning.attempts.length === 0"))
        # ---- explore: cut, isolate, see through, measured facts
        await pg.click('[data-go="explore"]'); await pg.wait_for_timeout(1700); pt = await pg.evaluate(f"{SC}.findOnSlice('sagittal', 'cricoid_cartilage') || {SC}.findOnSlice('axial', 'cricoid_cartilage')")
        if not pt: await pg.evaluate(f"(() => {{ const s = {ST}; s.cross.copy({SC}.parts.get('cricoid_cartilage').centre); {SC}.go('explore'); }})()")   # test setup, only if the cartilage is not on the opening slice
        pt = pt or await pg.evaluate(f"{SC}.findOnSlice('sagittal', 'cricoid_cartilage')"); await pg.mouse.click(pt[0], pt[1]); await pg.wait_for_timeout(700); ex = await pg.inner_text("#sPanel"); await shot("s08-explore-cricoid")
        ok("explore: selecting on a slice names the structure and states only what was measured on this scan, with its review status", "Cricoid cartilage" in ex and "Measured on this scan" in ex and "mm" in ex and "review" in ex.lower() and "triangles" in ex, ex.replace("\n", " ")[:170])
        await pg.click('[data-act="isolate"]'); await pg.wait_for_timeout(900); ok("explore: isolate leaves one structure solid and ghosts the rest", await pg.evaluate(f"{SC}.parts.get('cricoid_cartilage').alpha > 0.8 && {SC}.parts.get('hyoid').alpha < 0.1")); await shot("s09-isolate")
        await pg.click('[data-act="isolate"]'); await pg.click('[data-cut="axial"]'); await pg.wait_for_timeout(1300); f0 = await pg.evaluate(f"{ST}.fade"); await pg.focus("#scFade"); [await pg.keyboard.press("ArrowLeft") for _ in range(30)]; await pg.wait_for_timeout(500); await shot("s10-axial-faded")
        ok("explore: the cut can be turned to another plane, and the scan faded to show the model behind it", await pg.evaluate(f"{ST}.axis === 'axial' && {ST}.fade < {f0} - 0.4"))
        await pg.click('[data-win="bone"]'); await pg.wait_for_timeout(400); ok("explore: the slices can be windowed for bone", await pg.evaluate(f"{ST}.win === 'bone'")); await pg.click('[data-win="soft"]')
        await pg.click('[data-act="names"]'); await pg.wait_for_timeout(400); ok("explore: names can be switched off to test yourself, unrecorded", "What is this?" in await pg.inner_text("#sPanel") and await pg.evaluate("__ov.state.learning.attempts.length === 0"))
        await pg.click('#sPanel [data-go="menu"]'); await pg.wait_for_timeout(700)
        # ---- identify: 8 structures, half on the model and half on bare slices; one missed then retried the other way, one hinted
        await pg.click('[data-go="items"]'); await pg.wait_for_timeout(1500); items = await pg.evaluate(f"{ST}.items.map(q => [q.id, q.on])")
        ok("the round mixes the model and bare slices, with no structure asked twice", len(items) == 8 and sum(1 for q in items if q[1] == "slice") == 4 and len(set(q[0] for q in items)) == 8, json.dumps(items)[:190])
        async def spot(sid, on):
            if on == "slice":
                ax = await pg.evaluate(f"{ST}.axis")
                for nudge in [0, 1, 1, 1, -4, -1, -1]:
                    if nudge: await pg.focus("#scPos"); [await pg.keyboard.press("ArrowRight" if nudge > 0 else "ArrowLeft") for _ in range(abs(nudge))]; await pg.wait_for_timeout(250)
                    pt = await pg.evaluate(f"{SC}.findOnSlice('{ax}', '{sid}')")
                    if pt: return pt
                return None
            for v in [None, "left", "front", "right", "back", "above"]:
                if v: await pg.click(f'[data-view="{v}"]'); await pg.wait_for_timeout(1300)
                pt = await pg.evaluate(f"{SC}.spot3d('{sid}')")
                if pt: return pt
            for g in ["bone", "muscle", "vessel"]:
                if await pg.evaluate(f"{SC}.records['{sid}'].group") != g: await pg.click(f'[data-group="{g}"]'); await pg.click(f'[data-group="{g}"]'); await pg.wait_for_timeout(700)   # switch that group off, as a learner would
                pt = await pg.evaluate(f"{SC}.spot3d('{sid}')")
                if pt: return pt
            return None
        seen_names = False; views = []
        for i, (sid, on) in enumerate(items):
            await pg.wait_for_timeout(1300); views.append(await pg.evaluate(f"{ST}.lastView"))
            if i == 0: await shot("s11-item-first")
            hidden = await pg.evaluate(f"document.getElementById('sLabels').children.length === 0 && [...{SC}.parts.values()].every(p => p.glow < 0.05) && ({ST}.item.on !== 'slice' || {ST}.slicesOnly)")
            if i in (0, 1): ok(f"item {i+1} ({on}): nothing is named or lit, and a slice item shows the scan alone", hidden)
            how = {2: "wrong+retry", 4: "hint"}.get(i, "")
            if how == "hint": await pg.click('[data-act="hint"]'); await pg.wait_for_timeout(300); ok(f"item {i+1}: the hint is a measurement on this scan", "Measured on this scan" in await pg.inner_text("#sPanel"))
            target = sid
            if how == "wrong+retry":      # a plausible mistake: some other outlined structure that is in view right now
                ax = await pg.evaluate(f"{ST}.axis"); target = await pg.evaluate(f"Object.keys({SC}.records).find((id) => id !== '{sid}' && (" + (f"{SC}.findOnSlice('{ax}', id)" if on == "slice" else f"{SC}.spot3d(id)") + "))")
            pt = await spot(target, on)
            if not pt: ok(f"item {i+1} ({on}): {sid} can be reached", False, "no clickable point found"); await pg.evaluate(f"{SC}.go('menu')"); break
            await pg.mouse.click(pt[0], pt[1]); await pg.wait_for_timeout(500); await pg.click('[data-conf="3"]'); await pg.wait_for_timeout(1100)
            verdict = (await pg.inner_text("#sPanel .verdict")).lower(); body = await pg.inner_text("#sPanel")
            ok(f"item {i+1} ({on}): {'a wrong pick is marked wrong, and the answer is placed relative to it by measurement' if how == 'wrong+retry' else 'a right pick is marked right'}", ("not" in verdict) == (how == "wrong+retry") and (how != "wrong+retry" or ("You selected" in body and "mm" in body)), body.replace("\n", " ")[:120])
            if how == "wrong+retry":
                await shot("s12-mistake"); await pg.click('[data-act="iretry"]'); await pg.wait_for_timeout(1500); on2 = await pg.evaluate(f"{ST}.item.on")
                ok(f"item {i+1}: the second try is in the other form (model instead of slices, or the reverse), unlabelled again", on2 != on and await pg.evaluate(f"{ST}.retry && document.getElementById('sLabels').children.length === 0"), f"{on} -> {on2}"); await shot("s13-retry")
                pt = await spot(sid, on2); await pg.mouse.click(pt[0], pt[1]); await pg.wait_for_timeout(500); await pg.click('[data-conf="2"]'); await pg.wait_for_timeout(1000)
                ok(f"item {i+1}: the second try is recorded as assisted", "assisted" in (await pg.inner_text("#sPanel")).lower())
            await pg.click('[data-act="inext"]')
        await pg.wait_for_timeout(1300); await shot("s14-results")
        st = await pg.evaluate("({A: __ov.state.learning.attempts.map(a => [a.correct, a.assist, a.outline, a.ms > 0, a.view, a.objective]), col: __ov.state.game.collection.map(c => c.id), sum: __ov.summary(__ov.state)})")
        ok("every answer is recorded with objective, outline area, help used, time and view", len(st["A"]) == 9 and all(a[2] == "I.A.2" and a[3] and a[4] and a[5].startswith("airway.identify.") for a in st["A"]) and sum(1 for a in st["A"] if a[1] == "retry") == 1 and sum(1 for a in st["A"] if a[1] == "hint") == 1, json.dumps(st["A"][:3]))
        ok("6 of 8 unaided adds the section set; assisted answers are not counted", st["col"] == ["airway-sections"] and st["sum"]["attempts"] == 7 and st["sum"]["assisted"] == 2, json.dumps(st["col"]))
        ok("slice items changed plane and model items changed view between questions", len(set(views)) >= 4, json.dumps(views))
        await pg.click('#sPanel [data-go="exit"]'); await pg.wait_for_function("document.body.dataset.screen === 'world' && !document.getElementById('wipe').className", timeout=60000); await pg.wait_for_timeout(2500)
        toast = await pg.inner_text("#wToast"); ok("back in the gallery: told what was added", "collection" in toast.lower() and "section set" in toast.lower(), toast[:90])
        await pg.evaluate("__ov.world.open('collection')"); await pg.wait_for_timeout(2400); col = await pg.inner_text("#wPlace")   # test setup: stand at the shelf without walking
        ok("the section set stands on the studio shelf and can be opened from there", "Airway and neck section set" in col and await pg.locator('[data-m="airway"]').count() == 1 and await pg.evaluate("__ov.exhibits.shelf.length") >= 1); await pg.keyboard.press("Escape"); await pg.wait_for_timeout(500)
        await pg.evaluate("__ov.world.bookmark('collection')"); await pg.wait_for_timeout(1500); await shot("s15-shelf")   # test setup: a fixed camera for the picture
        ok("no script errors during the whole run", not errs, errs[:3])
        await ctx.close(); await b.close()
    v = sorted(glob.glob(OUT + "/_vid/*.webm"), key=os.path.getsize)[-1]; shutil.move(v, OUT + "/scan.webm"); shutil.rmtree(OUT + "/_vid", ignore_errors=True)
    print(f"\n{sum(1 for r in R if r['pass'])} of {len(R)} functional checks pass"); json.dump(R, open(OUT + "/scan-results.json", "w"), indent=1)
asyncio.run(main())
