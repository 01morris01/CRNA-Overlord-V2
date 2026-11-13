"""room_shots.py: load the surgical props into the running operating room, at sensible places, and take pictures from standing height.

     uv run --with playwright python3 tools/props/surgical/room_shots.py OUT_DIR tools/test-account.example.json [PORT] [--set NAME] [--only a,b] [--no-case]

   Needs the dev server (python3 tools/dev_server.py 8091). It reads assets/models/or/surgical/surgical.json (or, with --set, the
   layout file given) and for each file listed calls world.loadModel + world.place in the page, exactly as room code would. Nothing
   in the repository is changed: the props live only in that browser page.

   Frame used for every placement: the operating table's own. Origin on the floor under the table centre (__ov.periop.table),
   +x the patient's left, -z the patient's head, y up. A layout row is { file, at: [x, y, z], ry: degrees about y }.

   This takes pictures. It checks only that every file loaded, how many triangles the page counted, and that the named nodes exist."""
import sys, json, os
from playwright.sync_api import sync_playwright

args = [a for a in sys.argv[1:] if not a.startswith('--')]; flags = sys.argv[1:]
OUT = args[0]; ACC = json.load(open(args[1])); PORT = next((a for a in args[2:] if a.isdigit()), '8091')
def opt(name, default=None):
    return flags[flags.index(name) + 1] if name in flags and flags.index(name) + 1 < len(flags) else default
HERE = os.path.dirname(os.path.abspath(__file__)); REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
LAYOUT = json.load(open(opt('--set', os.path.join(HERE, 'room_layout.json')))); ONLY = set((opt('--only') or '').split(',')) - {''}
B = f'http://127.0.0.1:{PORT}/world/'; os.makedirs(OUT, exist_ok=True)

PLACE = """async (rows) => { const THREE = await import('three'), w = __ov.world, T = __ov.periop.table, out = [];
  window.__props = window.__props || {};
  for (const r of rows) { try {
      const g = await w.loadModel(r.path), root = g.scene; root.name = 'prop_' + r.key; root.position.set(T.x + r.at[0], r.at[1], T.z + r.at[2]); root.rotation.y = (r.ry || 0) * Math.PI / 180; root.updateMatrixWorld(true);
      let tris = 0; const names = []; root.traverse((o) => { names.push(o.name); if (o.isMesh) { const gm = o.geometry; tris += (gm.index ? gm.index.count : gm.attributes.position.count) / 3; } });
      w.place(root, { at: root.position.clone(), room: 'or', envI: 0.8 }); window.__props[r.key] = root;
      const box = new THREE.Box3().setFromObject(root); out.push({ key: r.key, ok: true, tris, names, box: [box.min.toArray().map((v) => +v.toFixed(3)), box.max.toArray().map((v) => +v.toFixed(3))] });
    } catch (e) { out.push({ key: r.key, ok: false, error: String(e).slice(0, 300) }); } }
  return out; }"""
VIEW = """([e, l, f]) => { const T = __ov.periop.table; __ov.world.view([T.x + e[0], e[1], T.z + e[2]], [T.x + l[0], l[1], T.z + l[2]], f, 0); }"""

with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', args=['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist']); ctx = b.new_context(viewport={'width': 1440, 'height': 810}, device_scale_factor=1, service_workers='block'); pg = ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)[:300])); pg.on('console', lambda m: errs.append('console: ' + m.text[:300]) if m.type == 'error' else None)
    # test setup: the throwaway account (its values are never printed), a fresh save, sound off
    pg.goto(B + 'blank.html'); pg.evaluate("""async ([u, p]) => { const a = await import('/core/auth.js'); let r = await a.loginUser(u, p); if (!r.success) { await a.registerUser(u, p); r = await a.loginUser(u, p); }
      const s = await import('/world/js/save.js'); localStorage.removeItem(s.key()); const st = s.load(); st.character = { name: 'Tester', person: 'tunic', colour: 'ceil' }; s.save(st); localStorage.setItem('overlord_world_mute', '1'); }""", [ACC['username'], ACC['password']])
    pg.goto(B); pg.wait_for_function("window.__ov && __ov.world && __ov.periop && document.getElementById('veil').classList.contains('off')", timeout=180000); pg.wait_for_function('__ov.exhibits && __ov.exhibits.hasClinical', timeout=120000); pg.evaluate('__ov.periop.ready'); pg.wait_for_timeout(1500)
    if '--no-case' not in flags:
        pg.evaluate("(id) => __ov.periop.begin(__ov.periop.byId[id], { unplanned: true })", 'p51'); pg.wait_for_function("__ov.periop.case && __ov.periop.patient && !document.getElementById('wipe').className", timeout=60000); pg.wait_for_timeout(1200)
        try: pg.click('#caseHud [data-start=list]', timeout=5000)
        except Exception as e: errs.append('start button: ' + str(e)[:120])
        pg.wait_for_timeout(800)
    else:
        pg.evaluate("(() => { const T = __ov.periop.table; __ov.world.view([T.x + 2.4, 1.6, T.z + 2.2], [T.x, 0.9, T.z], 50, 0); })()"); pg.wait_for_timeout(600)
    pg.add_style_tag(content='#caseHud, #mark, #wGoal, #wToast, #wCaption, #wPrompt, #wPlace, .stick, .pad { display: none !important; }')
    table = pg.evaluate('__ov.periop.table.toArray()')
    report = {'table_centre_world': table, 'groups': [], 'errors': errs}
    for grp in LAYOUT['groups']:
        if ONLY and grp['name'] not in ONLY: continue
        rows = [dict(r, path='models/or/surgical/' + r['file'] + '?v=' + str(int(os.path.getmtime(os.path.join(REPO, 'assets/models/or/surgical', r['file'])))), key=r.get('key') or r['file'].replace('.glb', '')) for r in grp['props'] if os.path.exists(os.path.join(REPO, 'assets/models/or/surgical', r['file']))]
        missing = [r['file'] for r in grp['props'] if not os.path.exists(os.path.join(REPO, 'assets/models/or/surgical', r['file']))]
        res = pg.evaluate(PLACE, rows); pg.wait_for_timeout(1500)
        for hide in grp.get('hide', []): pg.evaluate("(re) => { const x = new RegExp(re, 'i'); __ov.world.scene.traverse((o) => { if (x.test(o.name)) { o.userData._pv = o.visible; o.visible = false; } }); }", hide)
        shots = []
        for name, (eye, look, fov) in grp['views'].items():
            pg.evaluate(VIEW, [eye, look, fov]); pg.wait_for_timeout(900); f = f"{OUT}/{grp['name']}_{name}.jpg"; pg.screenshot(path=f, type='jpeg', quality=92); shots.append(f)
        pg.evaluate("__ov.world.scene.traverse((o) => { if (o.userData && '_pv' in o.userData) { o.visible = o.userData._pv; delete o.userData._pv; } })")
        if not grp.get('keep'):
            pg.evaluate("(keys) => { for (const k of keys) { const r = window.__props[k]; if (r) { __ov.world.unplace(r); delete window.__props[k]; } } }", [r['key'] for r in rows])
        report['groups'].append({'name': grp['name'], 'loaded': [{k: v for k, v in r.items() if k != 'names'} for r in res], 'nodes': {r['key']: r.get('names') for r in res}, 'missing_files': missing, 'shots': shots})
        print(grp['name'], 'loaded', [(r['key'], r.get('tris'), r.get('ok')) for r in res], 'missing', missing, flush=True)
    json.dump(report, open(f'{OUT}/room_shots.json', 'w'), indent=1); print('errors:', errs[:6]); b.close()
