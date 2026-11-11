#!/usr/bin/env python3
"""audit_plexus.py: an independent check of the brachial plexus model's geometry against the relationships the lesson
teaches. It shares no code with the app: it reads the raw (uncompressed) GLB exported from Z-Anatomy and measures
distances between structures. A PASS means the model's geometry agrees with the textbook statement to the stated
tolerance. It does not mean the anatomy has been reviewed by an anatomist.
   uv run --with numpy --with scipy python3 tools/audit_plexus.py RAW.glb OUT.json
Axes in the GLB: +Y up, +Z anterior, patient's right arm at -X (so medial is +X on this side). Units: metres."""
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
        p = np.concatenate(pts).astype(np.float64)
        if 'translation' in node: p = p + np.array(node['translation'])
        out[node['name']] = p
    return out

S = load(sys.argv[1]); T = {k: cKDTree(v) for k, v in S.items()}; results = []
mm = lambda v: round(float(v) * 1000, 1)
def gap(a, b):
    d, i = T[b].query(S[a]); k = int(np.argmin(d)); return float(d[k]), S[a][k], S[b][i[k]]
def check(name, ok, measured, claim, src, note=''):
    results.append({'check': name, 'pass': bool(ok), 'measured': measured, 'claim': claim, 'source': src, 'note': note if not ok else ''}); print(('PASS ' if ok else 'FAIL ') + name + ' :: ' + measured)
cen = lambda k: S[k].mean(axis=0)
TR = ['superior_trunk_of_brachial_plexus_r', 'middle_trunk_of_brachial_plexus_r', 'inferior_trunk_of_brachial_plexus_r']
ys = [cen(k)[1] for k in TR]
check('trunks run superior > middle > inferior', ys[0] > ys[1] > ys[2], f'mean heights {mm(ys[0])}, {mm(ys[1])}, {mm(ys[2])} mm', 'Superior trunk highest, inferior trunk lowest', 'HADZIC3')
for k in TR:
    da, pa, qa = gap(k, 'scalenus_anterior_muscle_r'); dm, pm, qm = gap(k, 'scalenus_medius_muscle_r'); c = cen(k)
    check(f'{k.split("_of_")[0]} lies inside the interscalene groove', da < 0.015 and dm < 0.015 and qa[2] > qm[2], f'{mm(da)} mm from anterior scalene, {mm(dm)} mm from middle scalene; nearest anterior-scalene point is {mm(qa[2] - qm[2])} mm in front of nearest middle-scalene point', 'Plexus emerges between anterior and middle scalenes', 'HADZIC3, NAG50',
          note='MODEL DIFFERENCE. The trunk objects begin lateral to the scalene bellies; the roots, which are what run inside the groove, are not in this model. The lesson was changed to say the roots pass between the scalenes and the trunks form at the outer edge.')
    check(f'{k.split("_of_")[0]} emerges at the outer edge of the groove, behind the anterior scalene', da < 0.03 and dm < 0.015 and pa[2] < qa[2], f'{mm(da)} mm from anterior scalene and {mm(qa[2] - pa[2])} mm behind it; {mm(dm)} mm from middle scalene', 'Roots pass between the scalenes and join into trunks near their lateral border', 'HADZIC3, NAG50')
d, p, q = gap('right_subclavian_artery', 'first_rib_r'); check('subclavian artery crosses the first rib', d < 0.015, f'closest approach {mm(d)} mm', 'Artery crosses the first rib', 'HADZIC3')
d, p, q = gap('inferior_trunk_of_brachial_plexus_r', 'right_subclavian_artery'); check('inferior trunk is beside the subclavian artery', d < 0.015, f'closest approach {mm(d)} mm; trunk point is {mm(p[2] - q[2])} mm anterior(+)/posterior(-) and {mm(p[1] - q[1])} mm above(+)/below(-) the artery', 'Inferior trunk lies behind/above the artery on the first rib', 'HADZIC3')
dv, pv, qv = gap('right_subclavian_vein', 'scalenus_anterior_muscle_r'); da, pa, qa = gap('right_subclavian_artery', 'scalenus_anterior_muscle_r')
check('vein in front of anterior scalene, artery behind it', pv[2] > qv[2] and pa[2] < qa[2] + 0.004, f'vein is {mm(pv[2] - qv[2])} mm anterior to the muscle at closest approach ({mm(dv)} mm away); artery is {mm(qa[2] - pa[2])} mm posterior ({mm(da)} mm away)', 'Subclavian vein passes anterior to the anterior scalene; artery and plexus posterior', 'HADZIC3')
d, p, q = gap('musculocutaneous_nerve_r', 'coracobrachialis_muscle_r'); check('musculocutaneous nerve meets coracobrachialis', d < 0.006, f'closest approach {mm(d)} mm', 'Musculocutaneous nerve pierces coracobrachialis', 'NAG50, NETTER439',
      note='MODEL DIFFERENCE. The nerve is drawn beside coracobrachialis, not through it, and only in the arm: its top end is ' + str(mm(min(cen(k)[1] for k in TR) - S['musculocutaneous_nerve_r'][:, 1].max())) + ' mm below the trunks with nothing joining it to the plexus. The app says so wherever this nerve is shown.')
MC = S['musculocutaneous_nerve_r']; db, _ = T['brachialis_muscle_r'].query(MC); d1, _ = T['short_head_of_biceps_brachii_r'].query(MC); d2, _ = T['long_head_of_biceps_brachii_r'].query(MC); dbi = np.minimum(d1, d2); both = float(np.mean((db < 0.012) & (dbi < 0.012)))
check('musculocutaneous nerve runs between biceps and brachialis in the arm', both > 0.4, f'{round(both * 100)}% of the nerve lies within 12 mm of both biceps and brachialis', 'Musculocutaneous nerve descends between biceps and brachialis', 'NAG50, NETTER439')
H = S['humerus_r']; hy0, hy1 = H[:, 1].min(), H[:, 1].max(); frac = lambda y: (y - hy0) / (hy1 - hy0); hc = cen('humerus_r')
d, p, q = gap('axillary_nerve_r', 'humerus_r'); check('axillary nerve at the surgical neck', d < 0.02 and frac(q[1]) > 0.72, f'closest approach {mm(d)} mm at {round(frac(q[1]) * 100)}% of humeral height (100% = top)', 'Axillary nerve winds around the surgical neck of the humerus', 'NAG50')
R = S['radial_nerve_r']; dd, ii = T['humerus_r'].query(R); mid = [(frac(H[i][1]) > 0.3 and frac(H[i][1]) < 0.7) for i in ii]; sel = np.array(mid) & (dd < 0.012)
post = float(np.mean(R[sel][:, 2] < H[ii[sel]][:, 2])) if sel.any() else 0
check('radial nerve runs against the back of the humeral shaft', sel.sum() > 20 and post > 0.5, f'{int(sel.sum())} nerve points within 12 mm of the mid-shaft; {round(post * 100)}% of them lie posterior to the bone surface', 'Radial nerve runs in the spiral groove on the posterior humerus', 'NAG50')
U = S['ulnar_nerve_r']; dd, ii = T['humerus_r'].query(U); low = np.array([frac(H[i][1]) < 0.12 for i in ii]) & (dd < 0.02)
med = float(np.mean(U[low][:, 0] > hc[0])) if low.any() else 0; pos = float(np.mean(U[low][:, 2] < H[ii[low]][:, 2])) if low.any() else 0
check('ulnar nerve passes behind the medial epicondyle', low.sum() > 5 and med > 0.8 and pos > 0.5, f'{int(low.sum())} nerve points within 20 mm of the distal humerus; {round(med * 100)}% medial to the shaft axis, {round(pos * 100)}% posterior to the bone', 'Ulnar nerve passes posterior to the medial epicondyle', 'NAG50')
M = S['median_nerve_r']; arm = M[(M[:, 1] > hy0) & (M[:, 1] < hy0 + 0.75 * (hy1 - hy0))]; dd, _ = T['brachial_artery_r'].query(arm)
check('median nerve travels with the brachial artery', float(np.median(dd)) < 0.012, f'median separation along the arm {mm(np.median(dd))} mm (max {mm(dd.max())} mm)', 'Median nerve accompanies the brachial artery', 'NAG50')
d1, _, _ = gap('suprascapular_nerve_r', 'superior_trunk_of_brachial_plexus_r'); d2, _, _ = gap('suprascapular_nerve_r', 'scapula_r')
check('suprascapular nerve: superior trunk to scapula', d1 < 0.008 and d2 < 0.012, f'{mm(d1)} mm from the superior trunk, {mm(d2)} mm from the scapula', 'Suprascapular nerve arises from the superior trunk and runs to the scapula', 'HADZIC3')
L = S['long_thoracic_nerve_r']; dd, _ = T['serratus_anterior_muscle_r'].query(L); check('long thoracic nerve descends on serratus anterior', float(np.mean(dd < 0.012)) > 0.35, f'{round(float(np.mean(dd < 0.012)) * 100)}% of the nerve lies within 12 mm of serratus anterior', 'Long thoracic nerve runs on and supplies serratus anterior', 'HADZIC3')
d1, _, _ = gap('dorsal_scapular_nerve_r', 'scalenus_medius_muscle_r'); d2, _, _ = gap('dorsal_scapular_nerve_r', 'levator_scapulae_r')
check('dorsal scapular nerve: through middle scalene toward levator scapulae', d1 < 0.008 and d2 < 0.015, f'{mm(d1)} mm from middle scalene, {mm(d2)} mm from levator scapulae', 'Dorsal scapular nerve pierces the middle scalene and runs to levator scapulae and rhomboids', 'HADZIC3')
pc = 'posterior_cord_of_brachial_plexus_r'; ds = {k: gap(pc, k)[0] for k in ['posterior_division_of_superior_trunk_of_brachial_plexus_r', 'posterior_division_of_middle_trunk_of_brachial_plexus_r', 'posterior_division_of_inferior_trunk_of_brachial_plexus_r', 'axillary_nerve_r', 'radial_nerve_r']}
check('posterior cord joins all three posterior divisions and gives axillary and radial', all(v < 0.006 for v in ds.values()), '; '.join(f'{k.split("_of_brachial")[0].replace("_", " ")} {mm(v)} mm' for k, v in ds.items()), 'Posterior divisions form the posterior cord, which gives the axillary and radial nerves', 'HADZIC3, NETTER439',
      note='MODEL DIFFERENCE. The junction of divisions and cords is drawn as a rough knot about 15 mm across. The object named posterior division of the inferior trunk does not reach the posterior cord, and the axillary nerve starts 7 mm from it. The model has no lateral or medial cord at all. The lesson teaches this wiring in words and never asks the learner to trace a division.')
br = {k: gap('posterior_cord_of_brachial_plexus_r', k)[0] for k in ['radial_nerve_r', 'thoracodorsal_nerve_r', 'superior_subscapular_nerve_r', 'inferior_subscapular_nerve_r']}
check('posterior cord gives radial, thoracodorsal and both subscapular nerves', all(v < 0.002 for v in br.values()), '; '.join(f'{k.replace("_nerve_r", "").replace("_", " ")} {mm(v)} mm' for k, v in br.items()), 'Posterior cord branches: subscapular nerves, thoracodorsal, axillary, radial', 'HADZIC3, NETTER439')
cy = cen('cricoid_cartilage')[1]; c6 = S['vertebra_c6'][:, 1]; c5 = S['vertebra_c5'][:, 1]; c7 = S['vertebra_c7'][:, 1]
level = 'C6' if c6.min() - 0.004 <= cy <= c6.max() + 0.004 else ('C5' if c5.min() <= cy <= c5.max() else ('C7' if c7.min() <= cy <= c7.max() else 'outside C5-C7'))
check('cricoid cartilage sits at the level of C6', level == 'C6', f'cricoid centre at {mm(cy)} mm; C6 body spans {mm(c6.min())} to {mm(c6.max())} mm (level found: {level})', 'Cricoid cartilage marks C6', 'NAG50')
cl = S['clavicle_r']; tcen = np.mean([cen(k) for k in TR], axis=0); _, i = T['clavicle_r'].query(tcen); _, i2 = T['clavicle_r'].query(cen(pc))
check('trunks above the clavicle, posterior cord below it', tcen[1] > cl[i][1] and cen(pc)[1] < cl[i2][1], f'trunks {mm(tcen[1] - cl[i][1])} mm above nearest clavicle point; posterior cord {mm(cl[i2][1] - cen(pc)[1])} mm below', 'Supraclavicular part: roots, trunks, divisions. Infraclavicular part: cords and branches', 'NAG50')
n = sum(r['pass'] for r in results); print(f'\n{n} of {len(results)} checks pass')
json.dump({'model': sys.argv[1].split('/')[-1], 'passed': n, 'total': len(results), 'results': results}, open(sys.argv[2], 'w'), indent=1)
