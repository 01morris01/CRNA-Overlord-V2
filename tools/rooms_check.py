"""rooms_check.py: can you get into, round and out of the endoscopy suite, the labor room and the procedure room with the ordinary
controls, and does the endoscopy case begin from the pre-op bay the way a learner begins it?
     uv run --with playwright --with numpy --with scipy --with pillow python3 tools/rooms_check.py OUT_DIR tools/test-account.example.json [PORT] [--video]
   Needs the dev server:  python3 tools/dev_server.py 8091

For each room, with real keys (nothing teleported; routes are planned on the walking code's floor map and driven with the arrows and W):
  - walk from the court in through its door
  - what stops you is what you see: the walking code's no-go floor against a render of what is visible at body height
  - every working position is joined to the door by a gap you fit through
  - turn left and right on the spot, back up, step sideways
  - walk to each working position, then out of the door, recording any stall
Then the endoscopy path, through the screens a learner uses: the schedule station brings the endoscopy patient to a bay, each of
the three decisions is made at the bedside and read back from the saved record (also after a reload), conversion takes the patient to
the endoscopy suite, the pulse oximeter probe is picked up with the mouse, put back with X, picked up again and clipped on, the
held views reach the machine and the bedside, and walking out of the door pauses the case.
This checks movement, decisions and handling. It does not judge how the rooms look."""
import sys, json, os, math, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image
from playwright.sync_api import sync_playwright
from walk_common import STATE, SEE, Walker, truth, widest_way, ang, R

OUT = sys.argv[1]; ACC = json.load(open(sys.argv[2])); PORT = next((a for a in sys.argv[3:] if a.isdigit()), "8091"); VIDEO = "--video" in sys.argv
B = f"http://127.0.0.1:{PORT}/world/"; os.makedirs(OUT, exist_ok=True)
results = []; notes = {}
def check(name, ok, detail=""):
    results.append({"check": name, "ok": bool(ok), "detail": detail}); print(("  ok   " if ok else "  FAIL ") + name + (" :: " + str(detail) if detail else ""), flush=True)

WORLD = "window.__ov && __ov.world && __ov.periop && document.getElementById('veil').classList.contains('off') && !document.getElementById('wipe').className"
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", args=["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"])
    ctx = b.new_context(viewport={"width": 1440, "height": 810}, device_scale_factor=1, service_workers="block", **({"record_video_dir": OUT, "record_video_size": {"width": 1440, "height": 810}} if VIDEO else {})); pg = ctx.new_page(); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)[:300]))
    # test setup: the throwaway account, a fresh save, sound off
    pg.goto(B + "blank.html"); pg.evaluate("""async ([u, p]) => { const a = await import('/core/auth.js'); let r = await a.loginUser(u, p); if (!r.success) { await a.registerUser(u, p); r = await a.loginUser(u, p); }
      const s = await import('/world/js/save.js'); localStorage.removeItem(s.key()); const st = s.load(); st.character = { name: 'Tester', person: 'tunic', colour: 'ceil' }; s.save(st); localStorage.setItem('overlord_world_mute', '1'); }""", [ACC["username"], ACC["password"]])
    def load():
        pg.goto(B); pg.wait_for_function(WORLD, timeout=180000); pg.wait_for_function("__ov.exhibits && __ov.exhibits.hasClinical", timeout=120000); pg.evaluate("__ov.periop.ready"); pg.wait_for_timeout(2500)
    load()
    LV = pg.evaluate("({ rooms: __ov.world.level.rooms, bounds: __ov.world.level.bounds, st: __ov.world.level.stations })"); ROOMS = LV["rooms"]; ST = LV["st"]
    W = Walker(pg, LV["bounds"]); st = W.st; shots = [0]
    def shot(name): shots[0] += 1; pg.wait_for_timeout(350); pg.screenshot(path=f"{OUT}/{shots[0]:02d}-{name}.jpg", type="jpeg", quality=88)

    # ---------------------------------------------------------------- the three rooms, one at a time
    # Working positions in three.js meters. Beds lie north-south with the head to the north (-z) in all three rooms (tools/clinical_set.py).
    # The labor bed stands against the head wall, so it is worked from the sides and the foot.
    def positions(key):
        T = ST[key]["table"]; x, z = T
        pos = {"patient's right side": (x - 0.82, z), "patient's left side": (x + 0.82, z), "foot of the bed": (x, z + 1.45)}
        if key in ("endo", "procedure"): pos["head of the bed"] = (x, z - 1.26)
        if key == "endo":
            m = pg.evaluate("(() => { const m = __ov.exhibits.clinical.pieces.eq_anesthesia_machine001; if (!m) return null; const V = __ov.world.camera.position.constructor; m.updateMatrixWorld(true); return m.localToWorld(new V(0.3, 0, 1.02)).toArray(); })()")
            if m: pos["front of the anesthesia machine"] = (m[0], m[2])
        return pos
    for key in ("endo", "labor", "procedure"):
        Rm = ROOMS[key]; at = ST[key]["at"]; east = at[0] > 0
        outside = (Rm["x0"] - 1.5 if east else Rm["x1"] + 1.5, at[1]); fine = [min(Rm["x0"], outside[0]) - 0.4, Rm["z0"] - 0.3, max(Rm["x1"], outside[0]) + 0.4, Rm["z1"] + 0.3]
        name = ST[key]["label"].lower(); n0 = len(W.snags); t0 = time.time()
        ok = W.go(*outside, f"to the court outside the {name}"); s = st()
        check(f"{name}: walked to the court outside its door", ok and s["room"] == "court", f"{time.time() - t0:.0f} s, in {s['room']} at ({s['x']:.1f}, {s['z']:.1f})")
        ok = W.go(at[0], at[1], f"in through the {name} door", fine=fine); s = st()
        check(f"{name}: walked in through the doorway", ok and s["room"] == key, f"in {s['room']} at ({s['x']:.2f}, {s['z']:.2f})"); shot(f"{key}-inside-the-door")
        rect = [Rm["x0"] - 0.3, Rm["z0"] - 0.3, Rm["x1"] + 0.3, Rm["z1"] + 0.3]; tr = truth(pg, rect)
        img = np.zeros(tr["free"].shape + (3,), dtype=np.uint8); img[:] = (244, 241, 234); img[~tr["free"]] = (246, 200, 185); img[tr["low"]] = (150, 156, 160); img[tr["body"]] = (60, 44, 44); img[tr["bad_over"]] = (255, 0, 200); img[tr["through"]] = (0, 120, 255)
        Image.fromarray(img).resize((tr["free"].shape[1] * 2, tr["free"].shape[0] * 2), Image.NEAREST).save(f"{OUT}/truth-{key}.png")
        check(f"{name}: nothing stops you that you cannot see", tr["closed_m2"] < 0.02, f"largest reach of a no-go area beyond anything visible {tr['max_over']:.2f} m; floor wrongly closed {tr['closed_m2']:.3f} m2")
        check(f"{name}: nothing visible at body height can be walked through", tr["through_m2"] < 0.02, f"{tr['through_m2']:.3f} m2")
        P = positions(key); door = (at[0], at[1]); widths = {}
        for pname, q in P.items():
            wdt = widest_way(tr["free"], tr["px"], rect, q, door); widths[pname] = wdt
            check(f"{name}: the door is joined to the {pname}", wdt is not None and wdt >= 0.7, ("narrowest gap on the way " + f"{wdt:.2f} m" if wdt is not None else "no way through") + " (you are 0.48 m wide)")
        notes[key] = {"truth": {k: round(tr[k], 3) for k in ("max_over", "closed_m2", "through_m2")}, "ways": widths}
        # turning and stepping, on open floor between the door and the bed
        T = ST[key]["table"]; ok = W.go((at[0] + T[0]) / 2, (at[1] + T[1]) / 2, f"{name}: open floor", fine=fine); pg.wait_for_timeout(700)
        dl, ml = W.spin("ArrowLeft"); dr, mr = W.spin("ArrowRight")
        check(f"{name}: the arrows turn you left and right on the spot", 1.0 < dl < 2.0 and -2.0 < dr < -1.0 and ml < 0.03 and mr < 0.03, f"left {math.degrees(dl):.0f}, right {math.degrees(-dr):.0f} degrees; moved {max(ml, mr) * 100:.0f} cm")
        W.turn_to(math.atan2(T[0] - st()["x"], T[1] - st()["z"]))
        mb = W.moved("KeyS"); ma = W.moved("KeyA", 450); md = W.moved("KeyD", 450)
        check(f"{name}: S backs up, A and D step sideways, none of them turns you", mb["fwd"] < -0.4 and ma["left"] > 0.35 and md["left"] < -0.35 and max(abs(mb["dyaw"]), abs(ma["dyaw"]), abs(md["dyaw"])) < 0.01, f"back {-mb['fwd']:.2f} m, left {ma['left']:.2f} m, right {-md['left']:.2f} m")
        reached = {}
        for pname, q in P.items():
            ok = W.go(*q, f"{name}: to the {pname}", fine=fine); s = st(); reached[pname] = ok and math.hypot(s["x"] - q[0], s["z"] - q[1]) < 0.55
        shot(f"{key}-at-the-bed")
        check(f"{name}: walked to every working position with the keyboard", all(reached.values()), ", ".join(k for k, v in reached.items() if not v) + (" not reached" if not all(reached.values()) else f"{len(reached)} positions"))
        ok = W.go(*outside, f"{name}: out of the door", fine=fine); s = st()
        check(f"{name}: walked out of the door into the court", ok and s["room"] == "court", f"in {s['room']}")
        check(f"{name}: nothing caught you on the way", len(W.snags) == n0, "; ".join(f"stalled at {q['at']} on the way {q['on']}" for q in W.snags[n0:]) or "no stall of 1.3 s or more while a walking key was held")

    # ---------------------------------------------------------------- the endoscopy patient, from the schedule to the suite
    sched = ST["schedule"]["at"]; ok = W.go(sched[0], sched[1], "to the schedule station", near=0.5)
    pg.keyboard.press("KeyE"); pg.wait_for_function("!document.getElementById('wPlace').hidden", timeout=8000); pg.wait_for_timeout(1200)
    pid = pg.evaluate("Object.values(__ov.periop.byId).find((e) => /^endo/i.test(e.room || '') && e.engineSupported).id")
    pg.click('#wPlace [data-bay="2"]'); pg.click(f'#wPlace [data-p="{pid}"]'); pg.wait_for_timeout(2500)
    check("the schedule station brings the endoscopy patient to bay 2", pg.evaluate("__ov.periop.bays[1]") == pid, f"patient {pid}")
    pg.keyboard.press("Escape"); pg.wait_for_timeout(600)
    bay = ST["bay2"]["at"]
    def open_bay():
        W.go(bay[0], bay[1], "to bay 2", near=0.5); pg.keyboard.press("KeyE"); pg.wait_for_function("!document.getElementById('wPlace').hidden", timeout=8000); pg.wait_for_timeout(1200)
    open_bay(); shot("bay-2-endoscopy-decision")
    txt = pg.inner_text("#wPlace").lower(); choices = pg.eval_on_selector_all("#wPlace [data-endo]", "l => l.map(b => [b.dataset.endo, b.className, b.innerText])")
    same = len(choices) == 3 and len({c[1] for c in choices}) == 1
    check("the bedside offers the three decisions the same way, before anything is said about what the simulator can run", same and "simulator" not in " ".join(c[2].lower() for c in choices) and "answer key is shown only after" in txt, "; ".join(f"{c[0]} ({c[1]})" for c in choices))
    rec = {}
    for k in ("sedation", "postpone"):
        pg.click(f'#wPlace [data-endo="{k}"]'); pg.wait_for_timeout(1200); t = pg.inner_text("#wPlace"); rec[k] = t
        saved = pg.evaluate("(id) => { const l = __ov.state.game.or.decisions[id]; return Array.isArray(l) ? l[l.length - 1] : l; }", pid)
        check(f"choosing '{k}' records it with its status, then shows the draft answer key beside it", saved and saved.get("kind") == k and "draft answer key" in t.lower() and saved.get("status"), f"saved: {saved and saved.get('choice')} / {saved and saved.get('status')}")
        pg.click('#wPlace [data-m="back"]'); pg.wait_for_timeout(800)
    check("the sedation choice says plainly that the case does not start, and the choice is kept", "does not start" in rec["sedation"].lower() and "stays on the record" in rec["sedation"].lower(), rec["sedation"][:160].replace("\n", " "))
    check("the bay remembers the last decision", "your last recorded decision" in pg.inner_text("#wPlace").lower())
    pg.keyboard.press("Escape"); pg.wait_for_timeout(500)
    n_before = pg.evaluate("(id) => __ov.state.game.or.decisions[id].length", pid); load()
    n_after = pg.evaluate("(id) => { const l = (__ov.state.game.or.decisions || {})[id]; return l ? l.map(q => q.kind) : null; }", pid)
    check("both decisions are still in the saved record after a reload, in order", n_after == ["sedation", "postpone"] and n_before == 2, str(n_after))
    open_bay(); pg.click('#wPlace [data-endo="convert"]'); pg.wait_for_timeout(1200); t = pg.inner_text("#wPlace").lower()
    check("converting is recorded first and only then offers the endoscopy suite", "take" in t and "endoscopy suite" in t and pg.query_selector('#wPlace [data-m="endo-run"]') is not None and pg.evaluate("(id) => __ov.state.game.or.decisions[id].map(q => q.kind).join(',')", pid) == "sedation,postpone,convert")
    pg.click('#wPlace [data-m="endo-run"]'); pg.wait_for_function("__ov.periop.case && __ov.periop.patient && !document.getElementById('wipe').className && !document.getElementById('caseHud').hidden", timeout=60000); pg.wait_for_timeout(1500)
    s = st(); info = pg.evaluate("({ room: __ov.periop.room, team: __ov.periop.case.team.lead, brief: document.querySelector('#caseHud').innerText })")
    check("the case opens in the endoscopy suite, with the endoscopist leading and you in control", info["room"] == "endo" and s["room"] == "endo" and info["team"] == "endoscopist" and s["enabled"] and "surgeon" not in info["brief"].lower() and "incision" not in info["brief"].lower(), f"room {info['room']}, standing in {s['room']}")
    shot("endo-case-brief"); pg.click("#caseHud [data-start=list]"); pg.wait_for_timeout(1200)
    labels = pg.eval_on_selector_all("#caseHud [data-a]", "l => l.map(b => b.innerText)") if pg.query_selector("#caseHud [data-a]") else []
    # ---- hands: the probe, with the mouse
    pg.click('#caseHud [data-view="side"]'); pg.wait_for_timeout(1100)
    kitvis = pg.evaluate("(() => { let v = true, o = __ov.hands.things.get('spo2probe').obj; while (o) { if (o.visible === false) v = false; o = o.parent; } return v; })()")
    check("the oximeter probe is drawn in the endoscopy suite", kitvis)
    def click_thing(i):
        w = pg.evaluate("(i) => __ov.hands.where(i)", i)
        if not w or not w.get("front"): return w
        pg.mouse.move(w["x"], w["y"], steps=4); pg.wait_for_timeout(250); pg.mouse.click(w["x"], w["y"]); pg.wait_for_timeout(500); return w
    w = pg.evaluate("__ov.hands.where('spo2probe')")
    if w and w["dist"] > w["reach"]:          # step nearer with the keys, toward the head of the bed
        W.go(ST["endo"]["table"][0] - 0.75, ST["endo"]["table"][1] - 0.85, "toward the probe", fine=[5.0, -26.6, 12.2, -19.8]); W.turn_to(math.atan2(ST["endo"]["table"][0] - st()["x"], ST["endo"]["table"][1] - 0.8 - st()["z"])); pg.mouse.move(720, 300); pg.mouse.down(); pg.mouse.move(720, 470, steps=6); pg.mouse.up(); pg.wait_for_timeout(500)
    w = click_thing("spo2probe"); held = pg.evaluate("__ov.hands.held && __ov.hands.held.id")
    check("clicking the probe picks it up", held == "spo2probe", f"probe on screen at {w and (w.get('x'), w.get('y'))}, {w and w.get('dist')} m away")
    shot("endo-holding-the-probe")
    s1 = st(); pg.keyboard.down("KeyS"); pg.wait_for_timeout(400); pg.keyboard.up("KeyS"); pg.wait_for_timeout(300); s2 = st()
    check("you can walk while holding it", math.hypot(s2["x"] - s1["x"], s2["z"] - s1["z"]) > 0.2 and pg.evaluate("__ov.hands.held && __ov.hands.held.id") == "spo2probe")
    pg.keyboard.press("KeyX"); pg.wait_for_timeout(600)
    check("X puts the held probe back where it lives and frees your hand", pg.evaluate("__ov.hands.held") is None and not pg.evaluate("__ov.periop.case.mon.spo2"))
    pg.keyboard.down("KeyW"); pg.wait_for_timeout(400); pg.keyboard.up("KeyW"); pg.wait_for_timeout(400)
    click_thing("spo2probe"); finger = None
    for site in ("spo2@fingerR", "spo2@fingerL"):
        if pg.evaluate("__ov.hands.held && __ov.hands.held.id") == "spo2probe":
            ww = pg.evaluate("(i) => __ov.hands.where(i)", site)
            if ww and ww.get("front") and ww.get("usable"): click_thing(site); finger = site
    on = pg.evaluate("({ mon: __ov.periop.case.mon.spo2, done: !!__ov.periop.case.done.spo2, where: (__ov.periop.case.kit || {}).sites })")
    check("picked up again and clipped on a finger, the case records the oximeter", on["mon"] and on["done"], f"site {finger}; record {on['where']}")
    shot("endo-probe-on")
    # ---- held views reach the machine and the bedside, and leave you free
    for k in ("worktop", "monitor", "side", "patient"):
        pg.click(f'#caseHud [data-view="{k}"]'); pg.wait_for_timeout(900); s = st(); m = W.moved("KeyS", 300)
        check(f"'{k}' view in the endoscopy suite puts you in the room and one key steps you back", s["room"] == "endo" and s["enabled"] and m["fwd"] < -0.12, f"at ({s['x']:.2f}, {s['z']:.2f}), backed {-m['fwd']:.2f} m")
        if k == "worktop": shot("endo-machine")
    mach = pg.evaluate("(() => { const m = __ov.exhibits.clinical.pieces.eq_anesthesia_machine001, V = __ov.world.camera.position.constructor; m.updateMatrixWorld(true); return m.localToWorld(new V(0.3, 1.02, 0.12)).toArray(); })()")
    pg.click('#caseHud [data-view="worktop"]'); pg.wait_for_timeout(900); r = pg.evaluate(SEE, [[mach], 0.15])["out"][0]
    check("from the machine view the machine's worktop is in sight", r["inView"] and r["clear"], f"at ({r['sx']}, {r['sy']}) px, {r['dist']} m{'' if r['clear'] else ', hidden by ' + str(r['first'])}")
    # ---- out of the door: the case waits; back in: it runs
    at = ST["endo"]["at"]; ok = W.go(ROOMS["endo"]["x0"] - 1.5, at[1], "case running: out of the endoscopy suite", fine=[3.6, -26.6, 12.2, -19.8]); s = st(); away = pg.evaluate("__ov.periop.away")
    check("walking out of the endoscopy suite pauses the patient's clock", ok and s["room"] == "court" and bool(away), f"in {s['room']}, paused: {bool(away)}")
    ok = W.go(at[0], at[1], "back into the endoscopy suite", fine=[3.6, -26.6, 12.2, -19.8]); pg.wait_for_timeout(800)
    check("walking back in starts it again", st()["room"] == "endo" and not pg.evaluate("__ov.periop.away"))
    pg.evaluate("__ov.periop.cancel && __ov.periop.cancel()"); pg.wait_for_timeout(1500)
    check("sending the patient back to holding leaves you in control", st()["enabled"])
    check("no page errors", not errs, "; ".join(errs[:3]))
    notes["stalls"] = W.snags; notes["browser"] = b.version; notes["window"] = [1440, 810]; notes["endo_step_labels"] = labels
    ctx.close(); b.close()

passed = sum(1 for r in results if r["ok"]); json.dump({"passed": passed, "total": len(results), "results": results, "notes": notes}, open(f"{OUT}/rooms.json", "w"), indent=1)
print(f"\n{passed}/{len(results)} room checks passed; pictures and rooms.json in {OUT}")
sys.exit(0 if passed == len(results) else 1)
