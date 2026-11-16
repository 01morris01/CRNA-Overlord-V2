"""Mesh loading for the mirror structure pack. Set BP3D4 to the unzipped isa_BP3D_4.0_obj_99 folder and BP3D3 to the
BodyParts3D 3.0 STL folder (github.com/Kevin-Mattheus-Moerman/BodyParts3D, assets/BodyParts3D_data/stl)."""
import os, re, json, numpy as np, trimesh
HERE = os.path.dirname(os.path.abspath(__file__))
V4 = os.environ.get('BP3D4', os.path.join(HERE, '_data/isa_BP3D_4.0_obj_99')) + '/'
V3 = os.environ.get('BP3D3', os.path.join(HERE, '_data/bp3d3_stl')) + '/'
WORK = os.environ.get('MIRROR_WORK', os.path.join(HERE, '_work'))
os.makedirs(WORK, exist_ok=True)
def _index():
    p = os.path.join(WORK, 'v4_elements.json')
    if os.path.exists(p): return json.load(open(p))
    out = {}
    for f in os.listdir(V4):
        h = open(V4 + f, errors='ignore').read(1500)
        c = re.search(r'Concept ID : (\S+)', h); n = re.search(r'English name : (.*)', h)
        if c and n: out[f[:-4]] = dict(fma=c.group(1), name=n.group(1).strip())
    json.dump(out, open(p, 'w')); return out
idx = _index()
def load_obj(fj):
    v = []; f = []
    for line in open(V4 + fj + '.obj', errors='ignore'):
        if line.startswith('v '): v.append([float(x) for x in line.split()[1:4]])
        elif line.startswith('f '): f.append([int(x.split('/')[0]) - 1 for x in line.split()[1:4]])
    return np.array(v), np.array(f)
def load_stl(fma):
    m = trimesh.load(V3 + fma + '.stl', process=True); return np.asarray(m.vertices), np.asarray(m.faces)
def by_name(pat):
    r = re.compile(pat, re.I); return [k for k, v in idx.items() if r.search(v['name'])]
