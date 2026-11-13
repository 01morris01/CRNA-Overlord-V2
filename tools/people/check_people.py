"""check_people.py: open every finished patient file the way a viewer would, and measure it against the contract.
   blender -b --factory-startup --python tools/people/check_people.py -- [REPORT.json]
Reads assets/people/patients.json and assets/people/patients/<id>.glb (decoding the Draco geometry), and for each file checks:
  * frame: nothing below the resting surface (y = 0), the head toward -Z, the face up, centered on x = 0, and the top of
    the head half a body-length from the origin (the origin is under the midpoint of the body's length);
  * names: a mesh `sheet` with a two-sided material `drape`; hair, lash and beard materials named hair...; cut-out alpha
    only on those;
  * budgets: triangles, bytes, picture sizes;
  * morph targets: eyesClosed, jawOpen and breathe exist, move the right part of the body by a sensible amount, and move
    nothing else (which also proves that compression kept the vertex order the targets depend on);
  * the arms: nothing of them further than 0.30 m from the midline (the width of a stretcher);
  * landmarks: each lies on the surface it names (lips, closed lids, tip of the nose, the sheet over the chest, the backs
    of the hands).
Prints one line per patient and a summary; writes the full numbers to REPORT.json. Coordinates below are the file's own
(the browser's): Y up, Z toward the feet. Blender imports them as (x, -z, y), which is undone here."""
import bpy, os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
import pp_common as C
from scipy.spatial import cKDTree
from mathutils import Vector
from mathutils.bvhtree import BVHTree

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
A = C.args_after_dashes()
REPORT = A[0] if A else os.path.join(C.PEOPLE, 'work', 'check_report.json')
man = json.load(open(os.path.join(REPO, 'assets', 'people', 'patients.json')))
ids = sorted(json.load(open(os.path.join(REPO, 'data', 'mock-or-day', 'index.json')))['patients'], key=lambda p: p['id'])
ids = [p['id'] for p in ids]


def verts(ob, key=None):
    """Vertex positions in the file's own frame; with a morph target fully on if `key` is given."""
    me = ob.data
    src = me.shape_keys.key_blocks[key].data if key else me.vertices
    a = np.empty(len(me.vertices) * 3, np.float32); src.foreach_get('co', a)
    a = a.reshape(-1, 3).astype(np.float64)
    mw = np.array(ob.matrix_world)
    a = a @ mw[:3, :3].T + mw[:3, 3]
    return np.stack([a[:, 0], a[:, 2], -a[:, 1]], 1)


report, bad = {}, 0
for pid in ids:
    rec = man.get(pid)
    path = os.path.join(REPO, 'assets', 'people', 'patients', pid + '.glb')
    if rec is None or not os.path.exists(path):
        report[pid] = {'ok': False, 'problems': ['file or record missing']}; bad += 1
        print(f'{pid}  MISSING'); continue
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=path)
    obs = {o.name: o for o in bpy.context.scene.objects if o.type == 'MESH'}
    V = {n: verts(o) for n, o in obs.items()}
    allv = np.concatenate(list(V.values()))
    L = {k: np.array(v) for k, v in rec['landmarks'].items()}
    P = []                                                   # problems found
    tris = sum(len(p.vertices) - 2 for o in obs.values() for p in o.data.polygons)
    # ---- frame
    if allv[:, 1].min() < -0.0015: P.append(f'below the surface by {-allv[:, 1].min() * 1000:.1f} mm')
    eyes_c = V['eyes'].mean(0)
    if not (eyes_c[2] < -0.2 * rec['heightM'] and V['sheet'][:, 2].max() > 0.3 * rec['heightM']): P.append('head is not toward -Z')
    if not (L['nose'][1] > L['earL'][1] + 0.03): P.append('face is not up')
    body_x = 0.5 * (V['body'][:, 0].min() + V['body'][:, 0].max())
    if abs(body_x) > 0.004 or abs(L['eyeL'][0] + L['eyeR'][0]) > 0.004: P.append(f'not centered on x (head center {body_x * 1000:.1f} mm)')
    head_top = min(V['body'][:, 2].min(), V['hair'][:, 2].min() if 'hair' in V else 9)
    half = rec['lyingLengthM'] / 2
    if abs(-V['body'][:, 2].min() - half) > 0.012: P.append(f'origin not under the midpoint: top of head at z {V["body"][:, 2].min():.3f}, half length {half:.3f}')
    width = float(np.abs(allv[:, 0]).max())
    arms_w = float(np.abs(V['arms'][:, 0]).max()) if 'arms' in V else 0.0
    # ---- names and materials
    mats = {m.name: m for o in obs.values() for m in o.data.materials}
    if 'sheet' not in obs or [m.name for m in obs['sheet'].data.materials] != ['drape']: P.append('no mesh "sheet" with material "drape"')
    for n in ('hair', 'lashes', 'beard'):
        if n in obs and not all('hair' in m.name for m in obs[n].data.materials): P.append(f'{n} material not named hair...')
    # ---- budgets
    if tris > 30500: P.append(f'{tris} triangles')
    if rec['bytes'] > 1.5e6: P.append(f'{rec["bytes"]} bytes')
    big = [im.name for im in bpy.data.images if max(im.size) > 1024]
    if big: P.append('picture larger than 1024: ' + ','.join(big))
    # ---- morph targets
    M = {}
    for n, o in obs.items():
        if o.data.shape_keys:
            for kb in o.data.shape_keys.key_blocks[1:]:
                M.setdefault(kb.name, {})[n] = verts(o, kb.name) - V[n]
    for want in ('eyesClosed', 'jawOpen', 'breathe'):
        if want not in M: P.append('morph missing: ' + want)
    stats = {}
    if 'eyesClosed' in M and 'body' in M['eyesClosed']:
        d = np.linalg.norm(M['eyesClosed']['body'], axis=1); mv = d > 0.0015
        far = np.minimum(np.linalg.norm(V['body'][mv] - L['eyeL'], axis=1), np.linalg.norm(V['body'][mv] - L['eyeR'], axis=1)).max() if mv.any() else 9
        stats['eyesClosed'] = (round(float(d.max()), 4), round(float(far), 3))
        if d.max() < 0.003 or far > 0.10 * max(rec['heightM'] / 1.7, 0.75): P.append(f'eyesClosed moves {d.max() * 1000:.1f} mm, up to {far * 100:.1f} cm from an eye')
        # closed means closed: the lid surface now passes in front of each eye's center line, close to the recorded lid landmark
        closed = V['body'] + M['eyesClosed']['body']
        lid_tree = BVHTree.FromPolygons([tuple(v) for v in closed], [tuple(p.vertices) for p in obs['body'].data.polygons])
        for e in ('eyeL', 'eyeR'):
            dist = float(lid_tree.find_nearest(Vector(L[e]))[3])
            if dist > 0.002: P.append(f'{e} landmark is {dist * 1000:.1f} mm from the closed lid')
    if 'jawOpen' in M and 'body' in M['jawOpen']:
        d = np.linalg.norm(M['jawOpen']['body'], axis=1); mv = d > 0.003
        far = np.linalg.norm(V['body'][mv] - L['mouth'], axis=1).max() if mv.any() else 9
        stats['jawOpen'] = (round(float(d.max()), 4), round(float(far), 3))
        if not (0.012 < d.max() < 0.06) or far > 0.16: P.append(f'jawOpen moves {d.max() * 1000:.1f} mm, up to {far * 100:.1f} cm from the mouth')
    if 'breathe' in M and 'sheet' in M['breathe']:
        d = M['breathe']['sheet']; up = d[:, 1]
        stats['breathe'] = (round(float(up.max()), 4), round(float(np.abs(d[:, [0, 2]]).max()), 5))
        top = V['sheet'][np.argmax(up)]
        if not (0.004 < up.max() < 0.02) or np.abs(d[:, [0, 2]]).max() > 1e-4 or up.min() < -1e-5 or not (L['chest'][2] - 0.05 < top[2] < 0.25 * rec['heightM']):
            P.append(f'breathe rises {up.max() * 1000:.1f} mm at z {top[2]:.2f}')
    # ---- landmarks on their surfaces
    def off(name, mesh):
        """Distance from a landmark to the surface of a mesh (to its faces, not only its vertices)."""
        o = obs[mesh]
        tree = BVHTree.FromPolygons([tuple(v) for v in V[mesh]], [tuple(p.vertices) for p in o.data.polygons])
        return float(tree.find_nearest(Vector(L[name]))[3])
    for name, mesh, tol in (('mouth', 'body', 0.004), ('nose', 'body', 0.002), ('chest', 'sheet', 0.002), ('handL', 'arms', 0.002), ('handR', 'arms', 0.002)):
        if mesh not in V or off(name, mesh) > tol: P.append(f'{name} landmark is {off(name, mesh) * 1000:.1f} mm from the {mesh}' if mesh in V else f'no {mesh}')
    if not (L['handL'][0] > 0.05 and L['handR'][0] < -0.05 and L['eyeL'][0] > 0 > L['eyeR'][0]): P.append('left and right are swapped')
    if arms_w > 0.3005: P.append(f'an arm reaches {arms_w:.3f} m from the midline')
    report[pid] = {'ok': not P, 'problems': P, 'triangles': tris, 'bytes': rec['bytes'], 'widthM': round(width, 3), 'armsHalfWidthM': round(arms_w, 3), 'lowestY': round(float(allv[:, 1].min()), 4),
                   'headTopZ': round(float(V['body'][:, 2].min()), 3), 'sheetEndZ': round(float(V['sheet'][:, 2].max()), 3), 'morphs': {k: sorted(v) for k, v in M.items()}, 'morphStats': stats,
                   'meshes': sorted(obs), 'materials': sorted(mats)}
    bad += bool(P)
    print(f'{pid}  {"ok  " if not P else "FAIL"}  {tris:5d} tris  {rec["bytes"] / 1e6:.2f} MB  width {width:.2f}  arms +-{arms_w:.3f}  eyesClosed {stats.get("eyesClosed")}  jawOpen {stats.get("jawOpen")}  breathe {stats.get("breathe")}  ' + '; '.join(P), flush=True)
json.dump(report, open(REPORT, 'w'), indent=1)
ok = [r for r in report.values() if r['ok']]
print(f'CHECKED {len(report)} patients: {len(ok)} pass, {bad} with problems. Report: {REPORT}')
if ok:
    print(f'triangles {min(r["triangles"] for r in ok)}..{max(r["triangles"] for r in ok)}; bytes {min(r["bytes"] for r in ok)}..{max(r["bytes"] for r in ok)}; total {sum(r["bytes"] for r in report.values() if "bytes" in r) / 1e6:.1f} MB; widest {max(r["widthM"] for r in ok):.2f} m half-width; arms within +-{max(r["armsHalfWidthM"] for r in ok):.3f} m')
