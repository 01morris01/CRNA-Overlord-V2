#!/usr/bin/env python3
"""audit_plexus.py (version 2): an independent geometric check of the brachial plexus model against statements read
in context in two textbooks. It shares no code with the app or with the script that builds the corrections.

Each check was written from the source statement first. A check is never loosened to make a model pass: if the model
disagrees with the source, the model is corrected or the relationship is kept out of scored teaching.
A PASS means the geometry agrees with the statement to the stated tolerance. It is not an anatomist's review.

   uv run --with numpy --with scipy --with trimesh --with rtree python3 tools/audit_plexus.py RAW.glb OUT.json
Axes: +Y up, +Z anterior, patient's right arm at -X (so on this side lateral is -X, medial is +X). Millimetres.
Sources: H = Hadzic's Textbook of Regional Anesthesia and Acute Pain Management, 2nd ed., ch. 3.
         N = Nagelhout & Elisha, Nurse Anesthesia, 7th ed., ch. 50."""
import json, struct, sys
import numpy as np
from scipy.spatial import cKDTree
import trimesh

def load(path):
    with open(path, 'rb') as f:
        f.read(12); n, _ = struct.unpack('<II', f.read(8)); j = json.loads(f.read(n)); m, _ = struct.unpack('<II', f.read(8)); bin_ = f.read(m)
    def acc(i, dt, w):
        a = j['accessors'][i]; bv = j['bufferViews'][a['bufferView']]; off = bv.get('byteOffset', 0) + a.get('byteOffset', 0)
        return np.frombuffer(bin_, dtype=dt, count=a['count'] * w, offset=off).reshape(-1, w) if w > 1 else np.frombuffer(bin_, dtype=dt, count=a['count'], offset=off)
    V, F, X = {}, {}, {}
    for node in j['nodes']:
        if 'mesh' not in node: continue
        vs, fs, base = [], [], 0
        for prim in j['meshes'][node['mesh']]['primitives']:
            v = acc(prim['attributes']['POSITION'], '<f4', 3).astype(np.float64) * 1000.0; ct = j['accessors'][prim['indices']]['componentType']
            idx = acc(prim['indices'], {5121: '<u1', 5123: '<u2', 5125: '<u4'}[ct], 1).astype(np.int64).reshape(-1, 3)
            vs.append(v); fs.append(idx + base); base += len(v)
        V[node['name']] = np.concatenate(vs); F[node['name']] = np.concatenate(fs); X[node['name']] = node.get('extras', {})
    return V, F, X
S, FACES, EXTRA = load(sys.argv[1]); T = {k: cKDTree(v) for k, v in S.items()}; results = []
r1 = lambda v: round(float(v), 1)
def check(group, name, ok, measured, claim, src, built=None):
    results.append({'group': group, 'check': name, 'pass': bool(ok), 'measured': measured, 'claim': claim, 'source': src, 'involves': built or []}); print(('PASS ' if ok else 'FAIL ') + name + ' :: ' + measured)
def gap(a, b):
    d, i = T[b].query(S[a]); k = int(np.argmin(d)); return float(d[k]), S[a][k], S[b][i[k]]
touch = lambda a, b: gap(a, b)[0]
def ends(k):   # the two ends of a tube: the vertices furthest apart along its principal axis
    p = S[k]; c = p.mean(0); u = np.linalg.svd(p - c, full_matrices=False)[2][0]; t = (p - c) @ u; return p[t < np.percentile(t, 3)].mean(0), p[t > np.percentile(t, 97)].mean(0)
def medial_end(k): a, b = ends(k); return a if a[0] > b[0] else b
def lateral_end(k): a, b = ends(k); return a if a[0] < b[0] else b
def between_scalenes(p):
    """Is point p in the interval between the two scalenes? Distances to each, and whether the anterior scalene is in
    front of it and the middle scalene behind it."""
    da, ia = T[ANT].query(p); dm, im = T[MID].query(p); a, m = S[ANT][ia], S[MID][im]
    return float(da), float(dm), bool(a[2] > p[2] - 0.5 and m[2] < p[2] + 0.5)
ANT, MID = 'scalenus_anterior_muscle_r', 'scalenus_medius_muscle_r'
BP = lambda s: s + '_of_brachial_plexus_r'
TR = [BP('superior_trunk'), BP('middle_trunk'), BP('inferior_trunk')]; ROOTS = [BP(r + '_root') for r in ('c5', 'c6', 'c7', 'c8', 't1')]
LC, MC, PC = BP('lateral_cord'), BP('medial_cord'), BP('posterior_cord')
have = lambda *ks: all(k in S for k in ks)
origin = lambda k: EXTRA.get(k, {}).get('origin', 'source')

# ---------------------------------------------------------------- roots
if have(*ROOTS):
    lev = {'c5': ('vertebra_c4', 'vertebra_c5'), 'c6': ('vertebra_c5', 'vertebra_c6'), 'c7': ('vertebra_c6', 'vertebra_c7'), 'c8': ('vertebra_c7', 'vertebra_t1'), 't1': ('vertebra_t1', 'vertebra_t2')}
    for k in ROOTS:
        r = k[:2]; m = medial_end(k); up, lo = lev[r]; bodyc = lambda v: S[v][S[v][:, 2] > S[v][:, 2].max() - 15][:, 1].mean(); yu, yl = bodyc(up), bodyc(lo)   # body centres: the foramen lies between adjacent bodies
        check('roots', f'{r.upper()} leaves the spine between {up[-2:].upper()} and {lo[-2:].upper()}', yl < m[1] < yu, f'root begins at height {r1(m[1])}; {up[-2:].upper()} body centre {r1(yu)}, {lo[-2:].upper()} body centre {r1(yl)}', 'Each root exits through its own intervertebral foramen', 'N p.1149 (numbering convention is standard anatomy, not read in these chapters)', [k])
        P = S[k]; res = [between_scalenes(p) for p in P[::7]]; inside = [x for x in res if x[2] and x[0] < 6 and x[1] < 6]
        check('roots', f'{r.upper()} passes between the anterior and middle scalenes', len(inside) >= max(3, 0.12 * len(res)), f'{len(inside)} of {len(res)} sampled points lie in the interval, within 6 mm of both muscles (closest: {r1(min(x[0] for x in res))} mm anterior scalene, {r1(min(x[1] for x in res))} mm middle scalene)', 'The roots pass between the anterior and middle scalene muscles', 'N p.1149; H p.44', [k])
    for trunk, rs in zip(TR, (['c5', 'c6'], ['c7'], ['c8', 't1'])):
        t0 = medial_end(trunk); endd = lambda r: float(np.linalg.norm(lateral_end(BP(r + '_root')) - t0))   # where each root ends, relative to where this trunk begins
        d = {r: endd(r) for r in rs}; others = {r: endd(r) for r in ('c5', 'c6', 'c7', 'c8', 't1') if r not in rs}
        check('roots', f'{trunk.split("_of_")[0].replace("_", " ")} is formed by {" and ".join(x.upper() for x in rs)} only', all(v < 2.0 for v in d.values()) and all(v > 4 for v in others.values()), 'root ends at the start of the trunk: ' + ', '.join(f'{r.upper()} {r1(v)} mm' for r, v in d.items()) + '; nearest other root end ' + f'{r1(min(others.values()))} mm away', 'C5 and C6 form the superior trunk, C7 the middle, C8 and T1 the inferior', 'H p.44', [BP(r + '_root') for r in rs])
else: check('roots', 'roots C5 to T1 are present', False, 'not in this model', 'The plexus begins as five roots', 'N p.1149')

# ---------------------------------------------------------------- trunks
for k in TR:
    m = medial_end(k); da, dm, btw = between_scalenes(m)
    check('trunks', f'{k.split("_of_")[0].replace("_", " ")} forms between the scalenes at their lateral border', btw and da < 6 and dm < 6, f'trunk begins {r1(da)} mm from the anterior scalene and {r1(dm)} mm from the middle scalene; lying between them: {"yes" if btw else "no"}', 'The rami join to form trunks between the scalenes, as they pass the lateral border of the muscles', 'H p.44; N p.1149', [k] if origin(k) != 'source' else [])
ys = [medial_end(k)[1] for k in TR]; check('trunks', 'trunks lie superior, middle, inferior in that order', ys[0] > ys[1] > ys[2], f'heights where they form: {r1(ys[0])}, {r1(ys[1])}, {r1(ys[2])}', 'Superior, middle and inferior trunks', 'H p.44')
for k in TR:
    sp = lateral_end(k); dc, ic = T['clavicle_r'].query(sp); c = S['clavicle_r'][ic]; rib = S['first_rib_r']; latx = rib[:, 0].min(); dr = float(T['first_rib_r'].query(sp)[0])
    check('trunks', f'{k.split("_of_")[0].replace("_", " ")} divides behind the clavicle at the lateral border of the first rib', sp[2] < c[2] and abs(sp[0] - latx) < 20, f'division point is {r1(c[2] - sp[2])} mm behind the nearest point of the clavicle and {r1(abs(sp[0] - latx))} mm from the lateral border of the first rib', 'At the lateral border of the first rib and posterior to the clavicle the trunks divide', 'N p.1149')
tc = np.mean([S[k].mean(0) for k in TR], 0); _, i = T['clavicle_r'].query(tc); _, i2 = T['clavicle_r'].query(S[PC].mean(0))
check('trunks', 'trunks lie above the clavicle and the cords below it', tc[1] > S['clavicle_r'][i][1] and S[PC].mean(0)[1] < S['clavicle_r'][i2][1], f'trunks {r1(tc[1] - S["clavicle_r"][i][1])} mm above, posterior cord {r1(S["clavicle_r"][i2][1] - S[PC].mean(0)[1])} mm below', 'Roots, trunks and divisions are supraclavicular; cords and terminal branches are infraclavicular', 'N p.1149')
dd, pp, qq = gap(BP('inferior_trunk'), 'first_rib_r'); ar = S['right_subclavian_artery']; tk = np.concatenate([S[k] for k in TR + [BP(f'{a}_division_of_{t}_trunk') for a in ('anterior', 'posterior') for t in ('superior', 'middle', 'inferior')]])
near = tk[T['right_subclavian_artery'].query(tk)[0] < 25]; da_, ia_ = T['right_subclavian_artery'].query(near); lat = float(np.mean(near[:, 0] < ar[ia_][:, 0])) if len(near) else 0
rib = S['first_rib_r']; RT = cKDTree(rib[:, [0, 2]]); dh, ih = RT.query(near[:, [0, 2]]); over = dh < 4.0     # plexus points with rib directly beneath or above them (plan view)
above = float(np.mean(near[over][:, 1] > rib[ih[over]][:, 1])) if over.any() else 0
check('trunks', 'at the first rib the trunks and divisions lie lateral to the subclavian artery and above the rib', len(near) > 20 and lat > 0.8 and over.sum() > 20 and above > 0.8, f'of the plexus within 25 mm of the artery, {round(lat * 100)}% is lateral to it; of the {int(over.sum())} points that are over the rib in plan view, {round(above * 100)}% are above it', 'The trunks and divisions lie lateral to the subclavian artery and superior to the first rib', 'N p.1153')

# ---------------------------------------------------------------- divisions and cords
div = lambda a, t: BP(f'{a}_division_of_{t}_trunk')
for t, trunk in zip(('superior', 'middle', 'inferior'), TR):
    d = (touch(div('anterior', t), trunk), touch(div('posterior', t), trunk)); check('cords', f'{t} trunk splits into an anterior and a posterior division', max(d) < 1.5, f'anterior division {r1(d[0])} mm, posterior division {r1(d[1])} mm from the trunk', 'All trunks branch into anterior and posterior divisions', 'H p.44')
d = {t: touch(div('posterior', t), PC) for t in ('superior', 'middle', 'inferior')}
check('cords', 'all three posterior divisions join the posterior cord', all(v < 1.5 for v in d.values()), ', '.join(f'{t} {r1(v)} mm' for t, v in d.items()), 'All the posterior divisions join to form the posterior cord', 'H p.44', [div('posterior', 'inferior')] if origin(div('posterior', 'inferior')) != 'source' else [])
if have(LC, MC):
    d = {t: touch(div('anterior', t), LC) for t in ('superior', 'middle')}; x = touch(div('anterior', 'inferior'), LC)
    check('cords', 'anterior divisions of the superior and middle trunks join the lateral cord', all(v < 1.5 for v in d.values()) and x > 3, ', '.join(f'{t} {r1(v)} mm' for t, v in d.items()) + f'; inferior trunk anterior division {r1(x)} mm away', 'The anterior divisions of the superior and middle trunks join to form the lateral cord', 'H p.44; N p.1149', [LC])
    d = touch(div('anterior', 'inferior'), MC); x = min(touch(div('anterior', t), MC) for t in ('superior', 'middle'))
    check('cords', 'anterior division of the inferior trunk continues as the medial cord', d < 1.5 and x > 3, f'{r1(d)} mm; nearest other anterior division {r1(x)} mm away', 'The anterior division of the inferior trunk forms the medial cord', 'H p.44; N p.1149', [MC])
    A = S['axillary_artery_r']
    def rel(k):   # where the distal two thirds of a cord sits relative to the nearest point of the axillary artery
        p = S[k]; a, b = ends(k); far = a if np.linalg.norm(a - S[k][0]) < 0 else None; u = (lateral_end(k) - medial_end(k)); tpar = (p - medial_end(k)) @ u / (u @ u); q = p[tpar > 0.34]; d_, i_ = T['axillary_artery_r'].query(q); o = q - A[i_]; return o
    oL, oM, oP = rel(LC), rel(MC), rel(PC)
    check('cords', 'lateral cord lies superior and lateral to the axillary artery', np.mean(oL[:, 0] < 0) > 0.8 and np.mean(oL[:, 1] > 0) > 0.8, f'{round(np.mean(oL[:, 0] < 0) * 100)}% lateral, {round(np.mean(oL[:, 1] > 0) * 100)}% superior (mean offset {r1(-oL[:, 0].mean())} mm lateral, {r1(oL[:, 1].mean())} mm up)', 'The lateral cord lies superior and lateral to the artery', 'N p.1155', [LC])
    check('cords', 'medial cord lies posterior and medial to the axillary artery', np.mean(oM[:, 0] > 0) > 0.8 and np.mean(oM[:, 2] < 0) > 0.8, f'{round(np.mean(oM[:, 0] > 0) * 100)}% medial, {round(np.mean(oM[:, 2] < 0) * 100)}% posterior (mean offset {r1(oM[:, 0].mean())} mm medial, {r1(-oM[:, 2].mean())} mm back)', 'The medial cord is posterior and medial', 'N p.1155', [MC])
    check('cords', 'posterior cord lies posterior to the axillary artery', np.mean(oP[:, 2] < 0) > 0.8, f'{round(np.mean(oP[:, 2] < 0) * 100)}% posterior (mean {r1(-oP[:, 2].mean())} mm back)', 'The posterior cord is posterior', 'N p.1155')
else:
    check('cords', 'lateral and medial cords are present', False, 'not in this model', 'Three cords: lateral, posterior and medial', 'H p.44; N p.1149')

# ---------------------------------------------------------------- branches
d = (touch('axillary_nerve_r', PC), touch('radial_nerve_r', PC))
check('branches', 'axillary and radial nerves arise from the posterior cord', max(d) < 1.5, f'axillary {r1(d[0])} mm, radial {r1(d[1])} mm', 'The axillary and radial nerves both arise from the posterior cord', 'N p.1149; H p.48', ['axillary_nerve_r'] if origin('axillary_nerve_r') != 'source' else [])
br = {k: touch(PC, k) for k in ['thoracodorsal_nerve_r', 'superior_subscapular_nerve_r', 'inferior_subscapular_nerve_r']}
check('branches', 'posterior cord gives the thoracodorsal and both subscapular nerves', all(v < 1.5 for v in br.values()), '; '.join(f'{k.replace("_nerve_r", "").replace("_", " ")} {r1(v)} mm' for k, v in br.items()), 'The posterior cord forms the upper and lower subscapular nerves and the thoracodorsal nerve', 'H p.48')
if have(LC, MC):
    d = touch('musculocutaneous_nerve_r', LC); check('branches', 'musculocutaneous nerve is the continuation of the lateral cord', d < 1.5, f'{r1(d)} mm from the lateral cord', 'The musculocutaneous nerve is a continuation of the lateral cord', 'N p.1149', ['musculocutaneous_nerve_r', LC])
    d = touch('ulnar_nerve_r', MC); check('branches', 'ulnar nerve extends from the medial cord', d < 1.5, f'{r1(d)} mm from the medial cord', 'The ulnar nerve extends from the medial cord', 'N p.1149', [MC])
    lr, mr = 'lateral_root_of_median_nerve_r', 'medial_root_of_median_nerve_r'
    d = (touch(lr, LC), touch(lr, 'median_nerve_r'), touch(mr, MC), touch(mr, 'median_nerve_r'), touch('median_nerve_r', PC))
    check('branches', 'median nerve is formed by a branch from the lateral cord and a branch from the medial cord', max(d[:4]) < 1.5 and d[4] > 3, f'lateral root: cord {r1(d[0])} mm, nerve {r1(d[1])} mm; medial root: cord {r1(d[2])} mm, nerve {r1(d[3])} mm; median nerve to posterior cord {r1(d[4])} mm', 'The median nerve is formed by junction of branches from the lateral and medial cords', 'H p.50; N p.1149', [lr, mr, 'median_nerve_r'])
else:
    check('branches', 'musculocutaneous, ulnar and median nerves arise from the lateral and medial cords', False, 'the model has no lateral or medial cord', 'Musculocutaneous from lateral, ulnar from medial, median from both', 'N p.1149')
d = touch('suprascapular_nerve_r', TR[0]); d2 = touch('suprascapular_nerve_r', 'scapula_r')
check('branches', 'suprascapular nerve arises from the superior trunk and reaches the scapula', d < 1.5 and d2 < 12, f'{r1(d)} mm from the superior trunk, {r1(d2)} mm from the scapula', 'The suprascapular nerve arises from the superior trunk', 'H p.48', ['suprascapular_nerve_r'] if origin('suprascapular_nerve_r') != 'source' else [])
cb = trimesh.Trimesh(S['coracobrachialis_muscle_r'], FACES['coracobrachialis_muscle_r'], process=False); M = S['musculocutaneous_nerve_r']; ins = cb.contains(M); 
check('branches', 'musculocutaneous nerve pierces coracobrachialis', ins.mean() > 0.04 and ins.sum() > 30, f'{int(ins.sum())} of {len(M)} points of the nerve are inside the muscle (muscle mesh closed: {"yes" if cb.is_watertight else "no"}); closest approach {r1(touch("musculocutaneous_nerve_r", "coracobrachialis_muscle_r"))} mm', 'It pierces the coracobrachialis muscle', 'H p.50', ['musculocutaneous_nerve_r'] if origin('musculocutaneous_nerve_r') != 'source' else [])
db, _ = T['brachialis_muscle_r'].query(M); d1, _ = T['short_head_of_biceps_brachii_r'].query(M); d2, _ = T['long_head_of_biceps_brachii_r'].query(M); arm = M[:, 1] < S['coracobrachialis_muscle_r'][:, 1].min() + 30; both = float(np.mean((db[arm] < 12) & (np.minimum(d1, d2)[arm] < 12)))
check('branches', 'musculocutaneous nerve descends between brachialis and biceps', both > 0.6, f'{round(both * 100)}% of the nerve below coracobrachialis lies within 12 mm of both muscles', 'It descends between the brachialis and biceps brachii muscles', 'H p.50')
d = touch('musculocutaneous_nerve_r', 'lateral_antebrachial_cutaneous_nerve_r'); check('branches', 'musculocutaneous nerve continues as the lateral antebrachial cutaneous nerve', d < 1.5, f'{r1(d)} mm', 'It supplies the lateral forearm as the lateral antebrachial cutaneous nerve', 'N p.1150')
H_ = S['humerus_r']; hy0, hy1 = H_[:, 1].min(), H_[:, 1].max(); frac = lambda y: (y - hy0) / (hy1 - hy0); hc = H_.mean(0)
A_ = S['axillary_nerve_r']; dd, ii = T['humerus_r'].query(A_); sel = (dd < 20) & np.array([0.78 < frac(H_[i][1]) < 0.93 for i in ii])   # the surgical neck: just below the head
axis_z = lambda y: H_[abs(H_[:, 1] - y) < 4][:, 2].mean(); post = float(np.mean([p[2] < axis_z(p[1]) for p in A_[sel]])) if sel.any() else 0
check('branches', 'axillary nerve passes posterior to the surgical neck of the humerus', sel.sum() > 15 and post > 0.6, f'{int(sel.sum())} points of the nerve within 20 mm of the surgical neck; {round(post * 100)}% lie behind the bone\'s axis at that height', 'The nerve continues posterior to the surgical neck of the humerus to the deltoid', 'H p.49')
R_ = S['radial_nerve_r']; dd, ii = T['humerus_r'].query(R_); sel = (dd < 12) & np.array([0.3 < frac(H_[i][1]) < 0.7 for i in ii]); post = float(np.mean(R_[sel][:, 2] < H_[ii[sel]][:, 2])) if sel.any() else 0
check('branches', 'radial nerve descends along the back of the humeral shaft', sel.sum() > 20 and post > 0.6, f'{int(sel.sum())} points within 12 mm of the mid-shaft; {round(post * 100)}% posterior to the bone', 'It descends along the shaft of the humerus in the spiral groove', 'H p.49')
U_ = S['ulnar_nerve_r']; dd, ii = T['humerus_r'].query(U_); low = (dd < 20) & np.array([frac(H_[i][1]) < 0.12 for i in ii]); med = float(np.mean(U_[low][:, 0] > hc[0])) if low.any() else 0; pos = float(np.mean(U_[low][:, 2] < H_[ii[low]][:, 2])) if low.any() else 0
check('branches', 'ulnar nerve crosses the elbow posterior to the medial epicondyle', low.sum() > 5 and med > 0.8 and pos > 0.6, f'{int(low.sum())} points at the distal humerus; {round(med * 100)}% medial, {round(pos * 100)}% posterior', 'It crosses the elbow posterior to the medial epicondyle', 'H p.52')
Mn = S['median_nerve_r']; arm = Mn[(Mn[:, 1] > hy0) & (Mn[:, 1] < hy0 + 0.7 * (hy1 - hy0))]; dd, _ = T['brachial_artery_r'].query(arm)
check('branches', 'median nerve descends the arm with the brachial artery', float(np.median(dd)) < 12, f'median separation {r1(np.median(dd))} mm (largest {r1(dd.max())} mm)', 'It descends the arm in association with the brachial artery', 'H p.50')
L_ = S['long_thoracic_nerve_r']; dd, _ = T['serratus_anterior_muscle_r'].query(L_); dm_, _ = T[MID].query(L_); up = L_[:, 1] > S['first_rib_r'][:, 1].max()
check('branches', 'long thoracic nerve descends on the middle scalene, then on serratus anterior', float(np.mean(dd[~up] < 12)) > 0.5 and float(np.mean(dm_[up] < 8)) > 0.5, f'above the first rib {round(float(np.mean(dm_[up] < 8)) * 100)}% lies within 8 mm of the middle scalene; below it {round(float(np.mean(dd[~up] < 12)) * 100)}% lies within 12 mm of serratus anterior', 'It descends along the anterior surface of the middle scalene to the first rib and then onto serratus anterior', 'H pp.46-48')
d2 = touch('dorsal_scapular_nerve_r', 'levator_scapulae_r'); D_ = S['dorsal_scapular_nerve_r']; dl, _ = T['levator_scapulae_r'].query(D_)
check('branches', 'dorsal scapular nerve follows levator scapulae', float(np.mean(dl < 12)) > 0.4, f'{round(float(np.mean(dl < 12)) * 100)}% of the nerve lies within 12 mm of levator scapulae (closest {r1(d2)} mm)', 'It follows the levator scapulae muscle to the scapula', 'H p.46')

# ---------------------------------------------------------------- landmarks
cy = S['cricoid_cartilage'][:, 1].mean(); c6 = S['vertebra_c6'][:, 1]
check('landmarks', 'cricoid cartilage is level with C6', c6.min() <= cy <= c6.max(), f'cricoid centre {r1(cy)}; C6 spans {r1(c6.min())} to {r1(c6.max())}', 'The C6 level is found by a line drawn laterally from the cricoid cartilage', 'N p.1152')
if have('phrenic_nerve_r'):
    P = S['phrenic_nerve_r']; d_, i_ = T[ANT].query(P); front = float(np.mean(P[:, 2] > S[ANT][i_][:, 2] - 0.3)); close = float(np.mean(d_ < 4))
    check('landmarks', 'phrenic nerve descends on the anterior surface of the anterior scalene', front > 0.9 and close > 0.9, f'{round(close * 100)}% within 4 mm of the muscle; {round(front * 100)}% in front of its surface', 'The phrenic nerve descends through the neck on the anterior surface of the anterior scalene muscle', 'H p.43', ['phrenic_nerve_r'])
else: check('landmarks', 'phrenic nerve is present', False, 'not in this model', 'The phrenic nerve descends on the anterior scalene', 'H p.43')
n = sum(r['pass'] for r in results); print(f'\n{n} of {len(results)} checks pass')
json.dump({'model': sys.argv[1].split('/')[-1], 'passed': n, 'total': len(results), 'results': results}, open(sys.argv[2], 'w'), indent=1)
