"""p25_12_export.py: export the hero patient p25 and its LOD1, compress, and write p25.json.   python3 p25_12_export.py
 1. Blender's glTF exporter (skins, sparse morph targets, the three clips as animations) -> work/export/*.raw.glb
 2. the tiling pore normal is added as its own named image ('skin_detail_normal'); the skin materials name it in extras
 3. gltf-transform 4.5.1: WebP (quality 90), then Draco; never 'optimize' (its default simplification removed triangles
    in the study) -> assets/people/hero/p25.glb, p25_lod1.glb
 4. landmarks (bone + offset in that joint's own frame + normal, and the world point in every clip), measurements,
    counts and sizes -> assets/people/hero/p25.json"""
import os, sys, json, subprocess, shutil, math
sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import numpy as np
import glb_io as G

PEOPLE = os.path.expanduser('~/Developer/overlord-asset-sources/people')
WORK = os.path.join(PEOPLE, 'hero', 'p25', 'work')
BLEND = os.path.join(PEOPLE, 'hero', 'p25', 'blend')
EXP = os.path.join(WORK, 'export'); os.makedirs(EXP, exist_ok=True)
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
OUTD = os.path.join(REPO, 'assets', 'people', 'hero'); os.makedirs(OUTD, exist_ok=True)
BL = '/Applications/Blender.app/Contents/MacOS/Blender'
ENV = dict(os.environ, BLENDER_USER_RESOURCES=os.path.join(PEOPLE, 'blender-user'))
GT = ['npx', '-y', '@gltf-transform/cli@4.5.1']
log = lambda *a: print('[export]', *a, flush=True)


def run(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, **kw)
    if r.returncode != 0:
        print(r.stdout[-2000:], r.stderr[-3000:]); raise SystemExit('FAILED: ' + ' '.join(cmd[:4]))
    return r.stdout


def export(blend, raw):
    out = run([BL, '-b', '--factory-startup', '--python', os.path.join(HERE, 'gltf_export.py'), '--', blend, raw], env=ENV)
    log([l for l in out.splitlines() if 'EXPORTED' in l][-1])


def patch(raw, patched):
    js, binb = G.read(raw)
    png = open(os.path.join(WORK, 'tex', 'skin_detail_normal.png'), 'rb').read()
    G.add_image(js, binb, png, 'skin_detail_normal')
    for m in js.get('materials', []):
        if m.get('name') in ('skin_head', 'skin_body'):
            m.setdefault('extras', {}).update(detailNormalImage='skin_detail_normal', detailTileMM=36.0,
                                              packedMap='R: ambient occlusion, G: roughness, B: thickness (metallicFactor 0 keeps B inert in plain glTF)')
        if m.get('name') in ('hair', 'brows', 'lashes'):
            m['alphaMode'] = 'MASK'; m['alphaCutoff'] = 0.3; m['doubleSided'] = True
        if m.get('name') in ('cornea', 'eye_wet', 'eye_occlusion'):
            m['alphaMode'] = 'BLEND'
        if m.get('name') in ('gown', 'blanket', 'pillow_cotton'):
            m['doubleSided'] = True
    G.write(patched, js, binb)


def compress(src, dst):
    a, b = dst + '.a.glb', dst + '.b.glb'
    run(GT + ['webp', src, a, '--quality', '90', '--effort', '80'])
    run(GT + ['draco', a, b])
    shutil.move(b, dst); os.remove(a)


def counts(path):
    js, binb = G.read(path)
    tris = {}
    for mesh in js['meshes']:
        t = 0
        for p in mesh['primitives']:
            if 'indices' in p:
                t += js['accessors'][p['indices']]['count'] // 3
            else:
                t += js['accessors'][p['attributes']['POSITION']]['count'] // 3
        tris[mesh.get('name', '?')] = t
    morphs = {m.get('name'): m.get('extras', {}).get('targetNames', []) for m in js['meshes']}
    return js, tris, morphs


for tag, blend in (('p25', 'p25_final.blend'), ('p25_lod1', 'p25_lod1.blend')):
    raw = os.path.join(EXP, tag + '.raw.glb'); pat = os.path.join(EXP, tag + '.patched.glb'); fin = os.path.join(OUTD, tag + '.glb')
    export(os.path.join(BLEND, blend), raw)
    patch(raw, pat)
    compress(pat, fin)
    log(f'{tag}: raw {os.path.getsize(raw) / 1e6:.2f} MB -> {os.path.getsize(fin) / 1e6:.2f} MB')
    insp = run(GT + ['inspect', fin, '--format', 'md'])
    open(os.path.join(EXP, tag + '_inspect.md'), 'w').write(insp)
print('done exports')
