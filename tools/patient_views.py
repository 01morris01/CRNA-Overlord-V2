"""patient_views.py: the patient on the operating table from eight fixed review cameras, for before-and-after comparison.
     uv run --with playwright python3 tools/patient_views.py OUT_DIR tools/test-account.example.json [PORT] [PATIENT_ID] [WIDTHxHEIGHT]
   Needs the dev server:  python3 tools/dev_server.py 8091

The cameras are fixed in the patient's own frame (origin under the body's midpoint on the mattress, Y up, head toward -Z, face up,
which puts the patient's own right hand on -X), so the same eight views can be taken of any version of the patient and of any patient:
   head, side_right, side_left            the whole person from the head of the bed and from each side
   face_above, face_three_quarter, face_profile     the face, placed from the nose landmark
   hand_right, hand_left                  each hand, placed from the hand landmarks
The room's own lights are used as they are. The interface is hidden for the pictures; nothing else is changed.
This takes pictures. It checks nothing and judges nothing."""
import sys, json, os
from playwright.sync_api import sync_playwright
OUT = sys.argv[1]; ACC = json.load(open(sys.argv[2])); PORT = sys.argv[3] if len(sys.argv) > 3 else "8091"; PID = sys.argv[4] if len(sys.argv) > 4 else "p51"; W, H = (int(v) for v in (sys.argv[5] if len(sys.argv) > 5 else "1600x1000").split("x"))
B = f"http://127.0.0.1:{PORT}/world/"; os.makedirs(OUT, exist_ok=True)
CAMS = """(() => { const p = __ov.periop.patient, r = p.root, L = p.lm, T = __ov.world.camera.position.constructor, w = (v) => r.localToWorld(new T(v[0], v[1], v[2])).toArray(), at = (k, d) => { const q = L[k] || L.nose; return [q.x + d[0], q.y + d[1], q.z + d[2]]; };
  const has = (k) => !!L[k]; return { has: { handR: has('handR'), handL: has('handL'), nose: has('nose') }, cams: {
    head: [w([0, 0.72, -1.55]), w([0, 0.10, -0.60]), 50], side_right: [w([-2.3, 0.65, 0]), w([0, 0.10, 0]), 50], side_left: [w([2.3, 0.65, 0]), w([0, 0.10, 0]), 50],
    face_above: [w(at('nose', [0, 0.62, -0.26])), w(at('nose', [0, 0, 0])), 30], face_three_quarter: [w(at('nose', [-0.42, 0.34, 0.34])), w(at('nose', [0, 0, 0])), 30], face_profile: [w(at('nose', [-0.75, 0, 0])), w(at('nose', [0, 0, 0])), 26],
    hand_right: [w(at('handR', [-0.30, 0.28, 0.22])), w(at('handR', [0, 0, 0])), 30], hand_left: [w(at('handL', [0.30, 0.28, 0.22])), w(at('handL', [0, 0, 0])), 30] } }; })()"""
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", args=["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"]); ctx = b.new_context(viewport={"width": W, "height": H}, device_scale_factor=1, service_workers="block"); pg = ctx.new_page(); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)[:300]))
    # test setup: the throwaway account, a fresh save, sound off, and the patient brought straight to the table
    pg.goto(B + "blank.html"); pg.evaluate("""async ([u, p]) => { const a = await import('/core/auth.js'); let r = await a.loginUser(u, p); if (!r.success) { await a.registerUser(u, p); r = await a.loginUser(u, p); }
      const s = await import('/world/js/save.js'); localStorage.removeItem(s.key()); const st = s.load(); st.character = { name: 'Tester', person: 'tunic', colour: 'ceil' }; s.save(st); localStorage.setItem('overlord_world_mute', '1'); }""", [ACC["username"], ACC["password"]])
    pg.goto(B); pg.wait_for_function("window.__ov && __ov.world && __ov.periop && document.getElementById('veil').classList.contains('off')", timeout=180000); pg.wait_for_function("__ov.exhibits && __ov.exhibits.hasClinical", timeout=120000); pg.evaluate("__ov.periop.ready"); pg.wait_for_timeout(1500)
    pg.evaluate("(id) => __ov.periop.begin(__ov.periop.byId[id], { unplanned: true })", PID); pg.wait_for_function("__ov.periop.case && __ov.periop.patient && !document.getElementById('wipe').className", timeout=60000); pg.wait_for_timeout(1500)
    pg.add_style_tag(content="#caseHud, #mark, #wGoal, #wToast, #wCaption, #wPrompt, #wPlace, .stick, .pad { display: none !important; }")
    info = pg.evaluate(CAMS); own = pg.evaluate("__ov.periop.patient.own")
    for name, (eye, look, fov) in info["cams"].items():
        pg.evaluate("([e, l, f]) => __ov.world.view(e, l, f, 0)", [eye, look, fov]); pg.wait_for_timeout(900); pg.screenshot(path=f"{OUT}/{name}.jpg", type="jpeg", quality=92)
    json.dump({"patient": PID, "own_figure": own, "landmarks_present": info["has"], "cameras_in_room": info["cams"], "window": [W, H], "errors": errs[:5]}, open(f"{OUT}/views.json", "w"), indent=1)
    print("saved", len(info["cams"]), "views of", PID, "to", OUT, "| own figure:", own, "| errors:", errs[:3]); b.close()
