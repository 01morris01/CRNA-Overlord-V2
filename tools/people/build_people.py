"""build_people.py: build patient figures and keep assets/people/patients.json up to date.
   python3 tools/people/build_people.py p51 p52 p06 p54        (some patients)
   python3 tools/people/build_people.py --all                  (all 56)
   python3 tools/people/build_people.py --manifest             (only re-read the finished files and rewrite patients.json)
Options: --jobs N (how many at once, default 5), --keep-raw (do not delete the uncompressed files).
For each patient: tools/people/patient_specs.py decides the looks, tools/people/make_person.py (in Blender) makes the
figure, tools/people/finish_people.sh compresses it into assets/people/patients/<id>.glb. Then every finished file is
opened again and measured (triangles, bytes, bounding box, morph targets), and patients.json is rewritten from those
measurements and from the landmarks that make_person.py recorded. A patient that fails is reported and left out; the
others are unaffected. Work files go to ~/Developer/overlord-asset-sources/people/work/build (outside the repository)."""
import os, sys, json, struct, subprocess, time
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
PEOPLE = os.path.expanduser(os.environ.get('OVERLORD_PEOPLE', '~/Developer/overlord-asset-sources/people'))
WORK = os.path.join(PEOPLE, 'work', 'build')
OUT = os.path.join(REPO, 'assets', 'people', 'patients')
MANIFEST = os.path.join(REPO, 'assets', 'people', 'patients.json')
BLENDER = os.environ.get('BLENDER', '/Applications/Blender.app/Contents/MacOS/Blender')
sys.path.insert(0, HERE)
import patient_specs


def read_glb(path):
    """The table of contents of a .glb file (its JSON part)."""
    with open(path, 'rb') as f:
        d = f.read(20)
        n = struct.unpack_from('<I', d, 12)[0]
        return json.loads(f.read(n).decode('utf8'))


def measure(path):
    """What can be read from a finished file without decoding its geometry: size, triangles, extent, morph targets, names."""
    doc = read_glb(path)
    acc = doc['accessors']
    lo, hi = [1e9] * 3, [-1e9] * 3
    tris, morphs, meshes = 0, {}, []
    for node in doc['nodes']:
        if 'mesh' not in node:
            continue
        assert not any(k in node for k in ('rotation', 'scale', 'matrix')) and all(abs(v) < 1e-9 for v in node.get('translation', [0, 0, 0])), 'a node is not at the origin: ' + node.get('name', '?')
        m = doc['meshes'][node['mesh']]
        meshes.append(node.get('name', m.get('name')))
        for p in m['primitives']:
            a = acc[p['attributes']['POSITION']]
            lo = [min(x, y) for x, y in zip(lo, a['min'])]; hi = [max(x, y) for x, y in zip(hi, a['max'])]
            tris += acc[p['indices']]['count'] // 3
            if p.get('targets'):
                morphs[node.get('name')] = (m.get('extras') or {}).get('targetNames', [])
    mats = {m['name']: {'alphaMode': m.get('alphaMode', 'OPAQUE'), 'doubleSided': bool(m.get('doubleSided'))} for m in doc.get('materials', [])}
    tex = [(i.get('name'), i.get('mimeType'), doc['bufferViews'][i['bufferView']]['byteLength']) for i in doc.get('images', [])]
    return {'bytes': os.path.getsize(path), 'triangles': tris, 'bboxMin': [round(v, 4) for v in lo], 'bboxMax': [round(v, 4) for v in hi],
            'morphsByMesh': morphs, 'meshes': meshes, 'materials': mats, 'textures': tex, 'extensions': doc.get('extensionsUsed', [])}


def build_one(pid, spec, keep_raw):
    t0 = time.time()
    os.makedirs(WORK, exist_ok=True)
    sp = os.path.join(WORK, pid + '.spec.json')
    json.dump(spec, open(sp, 'w'), indent=1)
    env = dict(os.environ, BLENDER_USER_RESOURCES=os.path.join(PEOPLE, 'blender-user'))
    log = os.path.join(WORK, pid + '.log')
    with open(log, 'w') as lf:
        r = subprocess.run([BLENDER, '-b', '--factory-startup', '--python', os.path.join(HERE, 'make_person.py'), '--', sp, WORK], stdout=lf, stderr=subprocess.STDOUT, env=env)
    raw = os.path.join(WORK, pid + '.raw.glb')
    text = open(log, errors='replace').read()
    if r.returncode != 0 or 'Traceback' in text or not os.path.exists(raw) or f'[{pid}' not in text or 'done' not in text.split(f'[{pid}')[-1]:
        return pid, False, 'make_person failed:\n' + '\n'.join(text.strip().splitlines()[-12:])
    r = subprocess.run(['sh', os.path.join(HERE, 'finish_people.sh'), WORK, OUT, pid], capture_output=True, text=True)
    if r.returncode != 0:
        return pid, False, 'finish failed:\n' + (r.stdout + r.stderr)[-1200:]
    if not keep_raw:
        os.remove(raw)
    notes = [l.split('] ', 1)[1] for l in text.splitlines() if l.startswith(f'[{pid}') and any(k in l for k in ('BUILD', 'POSE', 'LIDS', 'JAW'))]
    return pid, True, f'{time.time() - t0:.0f}s  ' + ' | '.join(n[:95] for n in notes[:2])


def write_manifest(specs):
    """patients.json: one record per finished file, keyed by patient id."""
    out = {}
    for pid in sorted(specs):
        glb, side = os.path.join(OUT, pid + '.glb'), os.path.join(WORK, pid + '.json')
        if not (os.path.exists(glb) and os.path.exists(side)):
            continue
        s = json.load(open(side)); m = measure(glb)
        out[pid] = {'file': pid + '.glb', 'heightM': s['heightM'], 'sex': s['sex'], 'ageYears': s['ageYears'], 'source': s['source'],
                    'morphs': sorted({n for v in m['morphsByMesh'].values() for n in v}, key=['eyesClosed', 'jawOpen', 'breathe'].index),
                    'triangles': m['triangles'], 'bytes': m['bytes'], 'landmarks': s['landmarks'], 'headTiltDeg': s['headTiltDeg'],
                    'neckExtensionDeg': s['neckExtensionDeg'], 'headRestGapM': s['headRestGapM'], 'lyingLengthM': s['lyingLengthM'], 'jawOpenM': s['jawOpenM'], 'breatheRiseM': s['breatheRiseM'],
                    'meshes': m['meshes'], 'morphsByMesh': m['morphsByMesh'], 'bboxMin': m['bboxMin'], 'bboxMax': m['bboxMax'],
                    'bmi': s['build']['bmiReached'], 'note': s.get('note', '')}
    os.makedirs(os.path.dirname(MANIFEST), exist_ok=True)
    json.dump(out, open(MANIFEST, 'w'), indent=1)
    return out


if __name__ == '__main__':
    args = sys.argv[1:]
    jobs = int(args[args.index('--jobs') + 1]) if '--jobs' in args else 5
    specs = patient_specs.build()
    ids = sorted(specs) if '--all' in args else [a for a in args if a in specs]
    if ids and '--manifest' not in args:
        os.makedirs(OUT, exist_ok=True)
        t0 = time.time()
        with ThreadPoolExecutor(max_workers=jobs) as ex:
            for pid, ok, msg in ex.map(lambda i: build_one(i, specs[i], '--keep-raw' in args), ids):
                print(('ok   ' if ok else 'FAIL ') + pid, msg, flush=True)
        print(f'{len(ids)} patients in {time.time() - t0:.0f}s')
    man = write_manifest(specs)
    tb = [(v['triangles'], v['bytes']) for v in man.values()]
    if tb:
        print(f'patients.json: {len(man)} of {len(specs)} patients; triangles {min(t for t, _ in tb)}..{max(t for t, _ in tb)}; bytes {min(b for _, b in tb)}..{max(b for _, b in tb)}; total {sum(b for _, b in tb) / 1e6:.1f} MB')
