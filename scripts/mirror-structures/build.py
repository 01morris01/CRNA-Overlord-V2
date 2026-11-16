import sys, json, pickle, struct, hashlib
import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *
from scipy.spatial import cKDTree
import catalog
from meshio_ import WORK
def landmarks_L():
    from landmarks import L
    return L

L = landmarks_L()
T4 = np.load(os.path.join(WORK, 'T_v4.npz')); T3 = np.load(os.path.join(WORK, 'T_v3.npz'))
JAW_ELEMS = re.compile(r'^(Mandible|Gingiva of lower jaw|(Right|Left) lower .*tooth)$')
JAW_LM = {'Mandibular condyle', 'Coronoid process', 'Mandibular notch', 'Mandibular angle', 'Mental foramen', 'Ramus',
          'Body of mandible', 'Mandibular foramen', 'Mylohyoid line'}
MID = -0.5

def to_head(P, T=T4):
    P = np.asarray(P, float).reshape(-1, 3)
    Q = np.c_[P[:, 0], P[:, 2], -P[:, 1]] * 0.1
    return float(T['s']) * Q @ T['R'].T + T['t']

def mir(P):
    P = np.array(P, float).copy(); P[..., 0] = 2 * MID - P[..., 0]; return P

def elements(pat):
    ks = by_name(pat)
    if not ks: raise KeyError(pat)
    return ks

def merge(ms):
    V = []; F = []; o = 0
    for v, f in ms:
        if len(f) == 0: continue
        V.append(v); F.append(f + o); o += len(v)
    if not V: return np.zeros((0, 3)), np.zeros((0, 3), int)
    return np.vstack(V), np.vstack(F)

def compact(v, f):
    used = np.unique(f); remap = -np.ones(len(v), int); remap[used] = np.arange(len(used))
    return v[used], remap[f]

def face_subset(v, f, keep):
    return compact(v, f[keep])

def ellipsoid(c, r, n=2):
    import trimesh
    s = trimesh.creation.icosphere(subdivisions=n)
    return np.asarray(s.vertices) * np.array(r) + np.array(c), np.asarray(s.faces)

chunks = []          # dict(key, v (head cm), f, jaw, src)
chunk_by_key = {}

def add_chunk(key, v, f, jaw=0, budget=1800):
    if key in chunk_by_key: return chunk_by_key[key]
    if len(f) == 0: raise ValueError('empty chunk ' + key)
    if len(f) > budget:
        v, f = deci(v, f, budget); v = np.asarray(v, float); f = np.asarray(f, int)
    v, f = compact(v, f)
    assert len(v) < 65535, key
    chunks.append(dict(key=key, v=v, f=f, jaw=jaw))
    chunk_by_key[key] = len(chunks) - 1
    return len(chunks) - 1

def budget_for(pat):
    if re.search(r'bone|Ethmoid|Vomer|Mandible|vertebra|Atlas|Axis|cartilage', pat): return 1100
    if re.search(r'gyrus|lobule|lobe|White matter|Cerebellum', pat): return 1000
    return 600

def resolve(spec):
    """returns list of chunk ids"""
    kind = spec[0]
    if kind == 'ctx': return resolve(spec[1])
    if kind == 'page': return [('page', spec[1])]
    if kind == 'v4':
        out = []
        for pat in spec[1:]:
            ks = elements(pat); jaw = [k for k in ks if JAW_ELEMS.match(idx[k]['name'])]; rest = [k for k in ks if k not in jaw]
            for group, j in ((rest, 0), (jaw, 1)):
                if not group: continue
                v, f = merge([load_obj(k) for k in sorted(group)])
                out.append(add_chunk(f'v4:{pat}:{j}', to_head(v), f, j, budget_for(pat) * (1 if len(group) < 3 else 2)))
        return out
    if kind == 'v3':
        v, f = merge([load_stl(k) for k in spec[1]])
        return [add_chunk('v3:' + ','.join(spec[1]), to_head(v, T3), f, 0, 900)]
    if kind in ('sub', 'sub1'):
        _, pat, lm, rad, off = spec[:5]
        v, f = concept(pat); cen = v[f].mean(1)
        keep = np.zeros(len(f), bool)
        for i, p in enumerate(L[lm]):
            o = np.array(off, float)
            if p[0] > MID: o[0] = -o[0]
            keep |= np.linalg.norm(cen - (p + o), axis=1) < rad
        sv, sf = face_subset(v, f, keep)
        jaw = 1 if pat == '^Mandible$' else 0
        return [add_chunk(f'sub:{pat}:{lm}', to_head(sv), sf, jaw, 600)]
    if kind == 'box':
        pat, lo, hi = spec[1], np.array(spec[2], float), np.array(spec[3], float)
        v, f = concept(pat); cen = v[f].mean(1)
        keep = np.all((cen >= lo) & (cen <= hi), 1)
        if len(spec) > 4 and spec[4] == 'bi':
            ml, mh = mir(hi), mir(lo); lo2 = np.minimum(ml, mh); hi2 = np.maximum(ml, mh)
            keep |= np.all((cen >= lo2) & (cen <= hi2), 1)
        sv, sf = face_subset(v, f, keep)
        jaw = 1 if pat == '^Mandible$' else 0
        return [add_chunk(f'box:{pat}:{spec[2]}:{spec[3]}', to_head(sv), sf, jaw, budget_for(pat))]
    if kind == 'half':
        _, pat, ax, op, val = spec
        v, f = concept(pat); cen = v[f].mean(1)
        keep = cen[:, ax] < val if op == '<' else cen[:, ax] > val
        sv, sf = face_subset(v, f, keep)
        return [add_chunk(f'half:{pat}:{op}{val}', to_head(sv), sf, 0, 600)]
    if kind == 'strip':
        _, pa, pb, dist = spec
        va, fa = concept(pa); vb, fb = concept(pb)
        ta, tb = cKDTree(vb), cKDTree(va)
        ka = (ta.query(va[fa].mean(1))[0] < dist); kb = (tb.query(vb[fb].mean(1))[0] < dist)
        sv, sf = merge([face_subset(va, fa, ka), face_subset(vb, fb, kb)])
        return [add_chunk(f'strip:{pa}:{pb}:{dist}', to_head(sv), sf, 0, 900)]
    if kind == 'ell':
        c, r = spec[1], spec[2]
        ms = [ellipsoid(c, r)]
        if len(spec) > 3 and spec[3] == 'bi': ms.append(ellipsoid(mir(c), r))
        v, f = merge(ms)
        return [add_chunk(f'ell:{c}:{r}:{len(ms)}', to_head(v), f, 0, 4000)]
    raise ValueError(spec)

def pin_points(p):
    if p[0] == 'L':
        jaw = 1 if p[1] in JAW_LM else 0
        return [(to_head(q)[0], jaw) for q in L[p[1]]]
    pts = [np.array(p[1], float)]
    if len(p) > 2 and p[2] == 'bi': pts.append(mir(p[1]))
    return [(to_head(q)[0], 0) for q in pts]

out_items = []
seen = {}
for it in catalog.ITEMS:
    rec = dict(n=it['name'], s=it['sec'], g=it['grp'], notes=it['notes'], parts=[], ctx=[], pins=[], paths=[])
    if it['approx']: rec['approx'] = 1
    if it['aka']: rec['aka'] = it['aka']
    for spec in it['parts']:
        ids = resolve(spec)
        (rec['ctx'] if spec[0] == 'ctx' else rec['parts']).extend(ids)
    for p in it['pins']:
        for q, jaw in pin_points(p):
            rec['pins'].append([round(float(x), 3) for x in q] + ([1] if jaw else []))
    for pth in it['paths']:
        sets = [np.array(pth['pts'], float)]
        if pth.get('bi'): sets.append(mir(pth['pts']))
        for s_ in sets:
            rec['paths'].append(dict(k=pth.get('kind', 'nerve'), p=[[round(float(x), 3) for x in q] for q in to_head(s_)]))
    for k in ('parts', 'ctx'):
        rec[k] = [x if isinstance(x, int) else f'page:{x[1]}' for x in rec[k]]
    if not (rec['parts'] or rec['pins'] or rec['paths']): raise SystemExit('nothing to show for ' + it['name'])
    for k in ('ctx', 'pins', 'paths', 'notes'):
        if not rec[k]: del rec[k]
    out_items.append(rec)

# ---- binary pack: per chunk uint16 quantized positions then uint16 indices
blob = bytearray(); table = []
for c in chunks:
    v, f = c['v'], c['f']
    lo = v.min(0); size = np.maximum(v.max(0) - lo, 1e-6)
    q = np.round((v - lo) / size * 65535).astype('<u2')
    offV = len(blob); blob += q.tobytes()
    offI = len(blob); blob += f.astype('<u2').tobytes()
    if len(blob) % 4: blob += b'\0' * (4 - len(blob) % 4)
    table.append(dict(nv=len(v), ni=int(f.size), min=[round(float(x), 5) for x in lo], size=[round(float(x), 5) for x in size],
                      offV=offV, offI=offI, jaw=c['jaw']))
data = dict(version=1, source='BIOL 520 Study Guide: The Head and Neck', chunks=table, items=out_items)
outdir = sys.argv[1]
open(outdir + '/hn-structures.bin', 'wb').write(bytes(blob))
open(outdir + '/hn-structures.json', 'w').write(json.dumps(data, separators=(',', ':'), ensure_ascii=False))
print('items', len(out_items), 'chunks', len(chunks), 'tris', sum(c['f'].shape[0] for c in chunks), 'bin', len(blob), 'json', len(json.dumps(data)))
