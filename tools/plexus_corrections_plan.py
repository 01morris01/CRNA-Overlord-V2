#!/usr/bin/env python3
"""plexus_corrections_plan.py: work out, from the source model's own geometry, where corrected and newly built
brachial plexus curves must run. Writes a plan (JSON) that tools/zanatomy_export_plexus.py applies in Blender.

Every item states what it is: `corrected` (a source curve whose end was attached to the wrong place) or `built`
(a structure the source model lacks). Each is derived from landmarks in the source model, never drawn freehand, and is
then held to tools/audit_plexus.py, which was written from the textbook statements before this file was.

   uv run --with numpy --with scipy python3 tools/plexus_corrections_plan.py RAW_SOURCE.glb CURVES.json PLAN.json
Working axes (GLB, millimetres): +X patient's left (right arm is -X), +Y up, +Z anterior. Blender = (x, -z, y)."""
import json, struct, sys
import numpy as np
from scipy.spatial import cKDTree

def load(path):
    with open(path, 'rb') as f:
        f.read(12); n, _ = struct.unpack('<II', f.read(8)); j = json.loads(f.read(n)); m, _ = struct.unpack('<II', f.read(8)); bin_ = f.read(m)
    out = {}
    for node in j['nodes']:
        if 'mesh' not in node: continue
        pts = []
        for prim in j['meshes'][node['mesh']]['primitives']:
            a = j['accessors'][prim['attributes']['POSITION']]; bv = j['bufferViews'][a['bufferView']]
            off = bv.get('byteOffset', 0) + a.get('byteOffset', 0); stride = bv.get('byteStride', 12)
            arr = np.frombuffer(bin_, dtype=np.uint8, count=(a['count'] - 1) * stride + 12, offset=off)
            pts.append(np.lib.stride_tricks.as_strided(arr, shape=(a['count'], 12), strides=(stride, 1)).copy().view('<f4').reshape(-1, 3))
        out[node['name']] = np.concatenate(pts).astype(np.float64) * 1000.0
    return out
S = load(sys.argv[1]); T = {k: cKDTree(v) for k, v in S.items()}
C = {r['name']: r for r in json.load(open(sys.argv[2]))}
g = lambda b: np.array([b[0], b[2], -b[1]], float)            # Blender mm -> GLB mm
b = lambda p: [round(float(p[0]), 2), round(float(-p[2]), 2), round(float(p[1]), 2)]   # GLB mm -> Blender mm
pts = lambda name, i=-1: [g(p) for p in max(C[name]['splines'], key=lambda s: s['n'])['pts']] if i < 0 else [g(p) for p in C[name]['splines'][i]['pts']]
ANT, MID = S['scalenus_anterior_muscle_r'], S['scalenus_medius_muscle_r']

def gap(h, x, win=4.5):
    """The interscalene interval at height h and lateral position x: (mid z, width) or None.
    Front wall = the back surface of the anterior scalene; back wall = the front surface of the middle scalene."""
    a = ANT[(abs(ANT[:, 1] - h) < win) & (abs(ANT[:, 0] - x) < win)]; m = MID[(abs(MID[:, 1] - h) < win) & (abs(MID[:, 0] - x) < win)]
    if len(a) < 3 or len(m) < 3: return None
    za, zm = a[:, 2].min(), m[:, 2].max()
    return ((za + zm) / 2, za - zm)
def lateral_exit(h):
    """Most lateral x at height h where both scalenes are still present: the lateral border of the interval."""
    for x in np.arange(-60, -24, 1.0):
        if gap(h, x): return x
    return None

plan = {'modify': [], 'create': [], 'remove_splines': [], 'notes': []}
note = lambda s: (plan['notes'].append(s), print('  ' + s))

# ---- 1. trunks: re-seat each medial end at the lateral border of the interscalene interval, at its own height
TR = {'Superior': 'Superior trunk of brachial plexus.r', 'Middle': 'Middle trunk of brachial plexus.r', 'Inferior': 'Inferior trunk of brachial plexus.r'}
starts = {}
for k, name in TR.items():
    P = pts(name); old = P[0]; h = old[1]; xb = lateral_exit(h); zm, w = gap(h, xb); new = np.array([xb + 1.0, h, zm])   # at the lateral border of the muscles, where the sources say the trunks form
    starts[k] = new; P2 = [new] + P[1:]
    if len(P2) == 3: P2[1] = (new + P2[2]) / 2 + (P[1] - (P[0] + P[2]) / 2) * 0.4      # keep a little of the original bow
    plan['modify'].append({'name': name, 'spline': 0, 'points': [b(p) for p in P2], 'origin': 'corrected', 'what': f'medial end moved {np.linalg.norm(new - old):.1f} mm into the interscalene interval (gap {w:.1f} mm wide here)'})
    note(f'{k} trunk start {np.round(old, 1)} -> {np.round(new, 1)}; moved {np.linalg.norm(new - old):.1f} mm; interval width {w:.1f} mm')
# other source curves that begin at the old trunk starts follow them
for name, key in [('Suprascapular nerve.r', 'Superior'), ('Medial pectoral nerve.r', None)]:
    if key:
        P = pts(name, 0); P[0] = starts[key]; plan['modify'].append({'name': name, 'spline': 0, 'points': [b(p) for p in P], 'origin': 'corrected', 'what': 'origin follows the re-seated superior trunk'})

# ---- 2. roots C5-T1: from each intervertebral foramen, through the interval, to the trunk
V = {k: S[k] for k in ['vertebra_c4', 'vertebra_c5', 'vertebra_c6', 'vertebra_c7', 'vertebra_t1', 'vertebra_t2']}
def body(v):   # the vertebral body is the anterior part of the bone
    p = V[v]; zmax = p[:, 2].max(); bd = p[p[:, 2] > zmax - 15]; front = p[p[:, 2] > zmax - 5]   # the front 5 mm is body only, no transverse process
    return {'cy': bd[:, 1].mean(), 'half': np.percentile(np.abs(front[:, 0]), 90), 'zback': zmax - 15, 'top': front[:, 1].max(), 'bot': front[:, 1].min()}
BD = {k: body(k) for k in V}
ROOTS = [('C5', 'vertebra_c4', 'vertebra_c5', 'Superior'), ('C6', 'vertebra_c5', 'vertebra_c6', 'Superior'), ('C7', 'vertebra_c6', 'vertebra_c7', 'Middle'), ('C8', 'vertebra_c7', 'vertebra_t1', 'Inferior'), ('T1', 'vertebra_t1', 'vertebra_t2', 'Inferior')]
for r, up, lo, trunk in ROOTS:
    fh = (BD[up]['bot'] + BD[lo]['top']) / 2                       # the foramen sits between the two bodies
    f = np.array([-(max(BD[up]['half'], BD[lo]['half']) + 4.0), fh, (BD[up]['zback'] + BD[lo]['zback']) / 2 - 3.0]); end = starts[trunk]
    P = [f]
    for t in (0.3, 0.55, 0.8):
        x = f[0] + (end[0] - f[0]) * t; h = f[1] + (end[1] - f[1]) * t; gp = gap(h, x); z = gp[0] if gp else f[2] + (end[2] - f[2]) * t
        P.append(np.array([x, h, z]))
    P.append(end)
    inside = sum(1 for p in P[1:-1] if gap(p[1], p[0]))
    plan['create'].append({'name': f'{r} root of brachial plexus.r', 'points': [b(p) for p in P], 'layer': 'nerve', 'origin': 'built', 'what': f'anterior ramus of {r} from the {up[-2:].upper()}-{lo[-2:].upper()} foramen through the interscalene interval to the {trunk.lower()} trunk'})
    note(f'{r} root: foramen at height {fh:.1f} (between {up[-2:]} body bottom {BD[up]["bot"]:.1f} and {lo[-2:]} body top {BD[lo]["top"]:.1f}), x {f[0]:.1f}; {inside} of 3 waypoints inside the interval')

# ---- 3. the posterior division of the inferior trunk belongs to the posterior cord
Pn = g([-100.7, 26.3, 1399.5]); Ln = g([-110.4, 14.4, 1399.5]); Mn = g([-100.9, 10.1, 1399.1])   # where the source's own divisions converge
P = pts('Posterior division of inferior trunk of brachial plexus.r'); old = P[-1]; P[-1] = Pn
plan['modify'].append({'name': 'Posterior division of inferior trunk of brachial plexus.r', 'spline': 0, 'points': [b(p) for p in P], 'origin': 'corrected', 'what': f'end moved {np.linalg.norm(Pn - old):.1f} mm from the lateral cord junction to the posterior cord junction'})
note(f'posterior division of inferior trunk: end moved {np.linalg.norm(Pn - old):.1f} mm to the posterior cord junction')

# ---- 4. lateral and medial cords: follow the axillary artery, each on its own side of it
ART = pts('Axillary artery.r'); 
def along(P, n=60):
    P = np.array(P); d = np.r_[0, np.cumsum(np.linalg.norm(np.diff(P, axis=0), axis=1))]; s = np.linspace(0, d[-1], n); return np.c_[[np.interp(s, d, P[:, i]) for i in range(3)]].T, s
AC, AS = along(ART, 200)
def cord(node, tgt, length=40.0):
    """From its junction, a cord settles into its named position beside the axillary artery within the first third
    of its length and keeps it. tgt = offset from the artery's centre line (x: -lateral/+medial, y: up, z: +anterior)."""
    i0 = int(np.argmin(np.linalg.norm(AC - node, axis=1))); o0 = node - AC[i0]; out = [node]
    for d in (0.33, 0.66, 1.0):
        i = int(np.argmin(abs(AS - (AS[i0] + length * d)))); w = min(1.0, d / 0.33); out.append(AC[i] + o0 * (1 - w) + np.array(tgt) * w)
    return out
LC = cord(Ln, [-7.0, 5.0, 0.0])      # lateral cord: superior and lateral to the artery (Nagelhout p.1155)
MC = cord(Mn, [6.0, 0.0, -5.0])      # medial cord: posterior and medial (Nagelhout p.1155)
plan['create'].append({'name': 'Lateral cord of brachial plexus.r', 'points': [b(p) for p in LC], 'layer': 'nerve', 'origin': 'built', 'what': 'from the junction of the anterior divisions of the superior and middle trunks, along the lateral side of the axillary artery'})
plan['create'].append({'name': 'Medial cord of brachial plexus.r', 'points': [b(p) for p in MC], 'layer': 'nerve', 'origin': 'built', 'what': 'the continuation of the anterior division of the inferior trunk, along the medial side of the axillary artery'})
LE, ME = LC[-1], MC[-1]; note(f'lateral cord {np.round(Ln,1)} -> {np.round(LE,1)}; medial cord {np.round(Mn,1)} -> {np.round(ME,1)}')

# ---- 5. terminal branches re-attached to the cords the sources give them
PCend = pts('Posterior cord of brachial plexus.r')[-1]
P = pts('Axillary nerve.r'); old = P[0]; P = [PCend, (PCend + P[2]) / 2 + np.array([0, 0, -2.0])] + P[2:]
plan['modify'].append({'name': 'Axillary nerve.r', 'spline': 0, 'points': [b(p) for p in P], 'origin': 'corrected', 'what': f'origin moved {np.linalg.norm(PCend - old):.1f} mm from the lateral cord junction to the end of the posterior cord'})
note(f'axillary nerve origin moved {np.linalg.norm(PCend - old):.1f} mm to the posterior cord')
U = pts('Ulnar nerve.r'); d = np.r_[0, np.cumsum(np.linalg.norm(np.diff(np.array(U), axis=0), axis=1))]; keep = [p for p, dd in zip(U, d) if dd > 55]
plan['modify'].append({'name': 'Ulnar nerve.r', 'spline': 1, 'points': [b(p) for p in [ME] + keep], 'origin': 'corrected', 'what': 'now begins at the end of the medial cord; its first 40 mm is the medial cord'})
Mm = pts('Median nerve.r'); dM = np.r_[0, np.cumsum(np.linalg.norm(np.diff(np.array(Mm), axis=0), axis=1))]
J = Mm[1] + (Mm[2] - Mm[1]) * 0.15                                   # a point on the source median nerve just below both cord ends
plan['modify'].append({'name': 'Median nerve.r', 'spline': 1, 'points': [b(p) for p in [J] + Mm[2:]], 'origin': 'corrected', 'what': 'no longer attached to the posterior cord; begins where its two roots meet'})
plan['create'].append({'name': 'Lateral root of median nerve.r', 'points': [b(p) for p in [LE, (LE + J) / 2 + np.array([-1.5, 0, 1.0]), J]], 'layer': 'nerve', 'origin': 'built', 'what': 'from the lateral cord to the median nerve'})
plan['create'].append({'name': 'Medial root of median nerve.r', 'points': [b(p) for p in [ME, (ME + J) / 2 + np.array([1.5, 0, 1.0]), J]], 'layer': 'nerve', 'origin': 'built', 'what': 'from the medial cord to the median nerve'})
plan['remove_splines'] += [{'name': 'Median nerve.r', 'spline': 0}, {'name': 'Ulnar nerve.r', 'spline': 0}]
note(f'median nerve now starts at {np.round(J,1)}; lateral root {np.linalg.norm(LE-J):.1f} mm, medial root {np.linalg.norm(ME-J):.1f} mm')

# ---- 6. musculocutaneous: the continuation of the lateral cord, through coracobrachialis, to the source's nerve in the arm
CB = S['coracobrachialis_muscle_r']; MCN = pts('Musculocutaneous nerve.r'); top = MCN[0]; way = []
for h in np.linspace(LE[1] - 14, top[1] + 12, 3):
    sl = CB[abs(CB[:, 1] - h) < 5]
    if len(sl) > 5: way.append(sl.mean(axis=0))
plan['modify'].append({'name': 'Musculocutaneous nerve.r', 'spline': 0, 'points': [b(p) for p in [LE] + way + MCN], 'origin': 'corrected', 'what': f'proximal {np.linalg.norm(LE - top):.0f} mm added: from the end of the lateral cord through the belly of coracobrachialis to where the source nerve begins'})
note(f'musculocutaneous: {len(way)} waypoints through coracobrachialis; added {np.linalg.norm(LE - top):.0f} mm')
P = pts('Lateral pectoral nerve.r', 0); P[0] = Ln; plan['notes'].append('lateral pectoral nerve already begins at the lateral cord junction (unchanged)')

# ---- 7. phrenic nerve: down the front of the anterior scalene, lateral border above to medial border below
hs = np.arange(ANT[:, 1].max() - 6, ANT[:, 1].min() + 6, -7.0); PH = []
for i, h in enumerate(hs):
    sl = ANT[abs(ANT[:, 1] - h) < 4]; t = i / (len(hs) - 1); x = (sl[:, 0].min() + 2) * (1 - t) + (sl[:, 0].max() - 2) * t
    col = sl[abs(sl[:, 0] - x) < 3]; z = (col[:, 2].max() if len(col) else sl[:, 2].max()) + 1.2; PH.append(np.array([x, h, z]))
plan['create'].append({'name': 'Phrenic nerve.r', 'points': [b(p) for p in PH], 'layer': 'nerve', 'origin': 'built', 'what': 'cervical course only: on the anterior surface of the anterior scalene. Its C3 to C5 origin and its course in the chest are not modelled'})
note(f'phrenic nerve: {len(PH)} points on the front of the anterior scalene, heights {hs[0]:.0f} to {hs[-1]:.0f}')
json.dump(plan, open(sys.argv[3], 'w'), indent=1); print(f"plan: {len(plan['modify'])} corrected, {len(plan['create'])} built, {len(plan['remove_splines'])} stray splines removed")
