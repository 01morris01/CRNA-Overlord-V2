"""finish.py: compress what tools/airway/prepare.py wrote, check it against the room's contract, and write airway.json.

   python3 -I tools/airway/finish.py WORK SOURCES OUT [CANDIDATES]

WORK holds <item>.raw.glb and <item>.meta.json; SOURCES is the fetch directory (its sources.json gives title, author and licence);
OUT is assets/models/airway. Items named under "accepted" in tools/airway/findings.json go to OUT and into airway.json; anything
else that was prepared is a candidate that was looked at and not accepted: it goes to CANDIDATES (outside the repository) if that
directory is given, and is otherwise left alone.

The contract checked for every file: one root node named after the file; real size in metres; at most 8,000 triangles and
400 kB; textures WebP and at most 512 px, or none; no cameras, lights, animations or skins; no KHR_materials_transmission;
every alpha-blended material has "clear" in its name."""
import json, os, struct, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
OPTIMIZE = ['npx', '-y', '@gltf-transform/cli@4', 'optimize', None, None, '--compress', 'draco', '--texture-compress', 'webp', '--texture-size', '512',
            '--simplify', 'false', '--join', 'false', '--flatten', 'false', '--instance', 'false', '--palette', 'false', '--prune-attributes', 'false']
ALLOWED = {'KHR_draco_mesh_compression', 'EXT_texture_webp', 'KHR_mesh_quantization', 'KHR_texture_transform'}

def read_glb(path):
    with open(path, 'rb') as f:
        magic, version, total = struct.unpack('<4sII', f.read(12)); n, kind = struct.unpack('<II', f.read(8)); doc = json.loads(f.read(n)); rest = f.read()
    return doc, (rest[8:] if rest else b''), total

def webp_size(b):
    if b[:4] != b'RIFF' or b[8:12] != b'WEBP': return None
    kind = b[12:16]
    if kind == b'VP8X': return 1 + int.from_bytes(b[24:27], 'little'), 1 + int.from_bytes(b[27:30], 'little')
    if kind == b'VP8 ': return struct.unpack('<H', b[26:28])[0] & 0x3fff, struct.unpack('<H', b[28:30])[0] & 0x3fff
    if kind == b'VP8L': v = int.from_bytes(b[21:25], 'little'); return 1 + (v & 0x3fff), 1 + ((v >> 14) & 0x3fff)

def check(path, item, box=None):
    """Return (facts, problems) for one finished file."""
    doc, blob, total = read_glb(path); bad = []; acc = doc.get('accessors', []); nodes = doc.get('nodes', [])
    roots = doc['scenes'][doc.get('scene', 0)]['nodes']
    if len(roots) != 1 or nodes[roots[0]].get('name') != item: bad.append('root node is %r, wanted one node named %r' % ([nodes[r].get('name') for r in roots], item))
    for key in ('cameras', 'animations', 'skins'):
        if doc.get(key): bad.append('has ' + key)
    used = set(doc.get('extensionsUsed', []))
    if used - ALLOWED: bad.append('extensions not allowed: %s' % sorted(used - ALLOWED))
    tris = 0
    for m in doc.get('meshes', []):
        for p in m['primitives']:
            if p.get('mode', 4) != 4: bad.append('primitive mode %s' % p.get('mode')); continue
            tris += acc[p['indices']]['count'] // 3 if 'indices' in p else acc[p['attributes']['POSITION']]['count'] // 3
    if tris > 8000: bad.append('%d triangles' % tris)
    size = os.path.getsize(path)
    if size > 400_000: bad.append('%d bytes' % size)
    images = []
    for im in doc.get('images', []):
        bv = doc['bufferViews'][im['bufferView']]; data = blob[bv.get('byteOffset', 0):bv.get('byteOffset', 0) + bv['byteLength']]; wh = webp_size(data)
        images.append({'name': im.get('name'), 'type': im.get('mimeType'), 'size': wh})
        if im.get('mimeType') != 'image/webp' or not wh or max(wh) > 512: bad.append('texture %s is %s %s' % (im.get('name'), im.get('mimeType'), wh))
    mats = []
    for m in doc.get('materials', []):
        mats.append({'name': m.get('name'), 'alphaMode': m.get('alphaMode', 'OPAQUE'), 'alpha': round((m.get('pbrMetallicRoughness', {}).get('baseColorFactor') or [1, 1, 1, 1])[3], 3)})
        if m.get('alphaMode') == 'BLEND' and 'clear' not in (m.get('name') or '').lower(): bad.append('blended material %r is not named clear' % m.get('name'))
    lo, hi = [1e9] * 3, [-1e9] * 3                                               # the model's box in its own coordinates (node transforms are identity apart from Draco's dequantisation, which the accessor bounds already include)
    for n in nodes:
        if 'mesh' not in n: continue
        if any(k in n for k in ('rotation', 'scale', 'translation', 'matrix')) and (n.get('scale', [1, 1, 1]) != [1, 1, 1] or n.get('rotation', [0, 0, 0, 1]) != [0, 0, 0, 1] or n.get('translation', [0, 0, 0]) != [0, 0, 0] or 'matrix' in n): bad.append('mesh node %r carries a transform' % n.get('name'))
        for p in doc['meshes'][n['mesh']]['primitives']:
            a = acc[p['attributes']['POSITION']]
            for i in range(3): lo[i] = min(lo[i], a['min'][i]); hi[i] = max(hi[i], a['max'][i])
    if box and max(abs(lo[i] - box[0][i]) for i in range(3)) + max(abs(hi[i] - box[1][i]) for i in range(3)) > 0.004: bad.append('box %s %s differs from the prepared %s' % ([round(v, 4) for v in lo], [round(v, 4) for v in hi], box))
    return {'triangles': tris, 'bytes': size, 'box': [[round(v, 4) for v in lo], [round(v, 4) for v in hi]], 'textures': images, 'materials': mats, 'nodes': [n.get('name') for n in nodes], 'extensions': sorted(used)}, bad

def main():
    work, sources, out = [os.path.abspath(os.path.expanduser(p)) for p in sys.argv[1:4]]; cand = os.path.abspath(os.path.expanduser(sys.argv[4])) if len(sys.argv) > 4 else None
    findings = json.load(open(os.path.join(HERE, 'findings.json'))); credit = {s['uid']: s for s in json.load(open(os.path.join(sources, 'sources.json')))}
    os.makedirs(out, exist_ok=True); manifest = {}; failed = False
    for f in sorted(os.listdir(work)):
        if not f.endswith('.meta.json'): continue
        meta = json.load(open(os.path.join(work, f))); item = meta['item']; accepted = item in findings['accepted']
        if not accepted and not cand: continue
        dest = os.path.join(out if accepted else cand, item + '.glb'); os.makedirs(os.path.dirname(dest), exist_ok=True)
        cmd = list(OPTIMIZE); cmd[4], cmd[5] = os.path.join(work, item + '.raw.glb'), dest; r = subprocess.run(cmd, capture_output=True, text=True)
        if r.returncode: print(r.stdout[-2000:], r.stderr[-2000:]); raise SystemExit('gltf-transform failed for ' + item)
        facts, bad = check(dest, item, meta.get('box')); failed = failed or bool(bad); src = credit.get(meta.get('uid'), {})
        print('%-12s %s  %5d triangles  %6d bytes  %s  textures %s  %s' % (item, 'ACCEPTED ' if accepted else 'candidate', facts['triangles'], facts['bytes'], facts['box'], [t['size'] for t in facts['textures']], 'OK' if not bad else 'CONTRACT: ' + '; '.join(bad)))
        entry = {'title': src.get('title'), 'author': src.get('author'), 'licence': src.get('licence'), 'uid': meta.get('uid'), 'url': src.get('url'), 'via': src.get('via'), 'licence_checked': src.get('licence_checked'),
                 'changes': meta['changes'], 'triangles': facts['triangles'], 'bytes': facts['bytes'], 'anchors': meta['anchors'], 'axes': meta['axes'], 'size': meta['size'], 'box': facts['box'],
                 'materials': [m['name'] for m in facts['materials']], 'textures': [t['size'] for t in facts['textures']]}
        for k in ('opening', 'limb_outside_diameter'):
            if k in meta: entry[k] = meta[k]
        entry.update(findings.get('notes', {}).get(item, {}))
        if accepted: manifest[item + '.glb'] = entry
        else: json.dump({item + '.glb': entry}, open(os.path.join(cand, item + '.json'), 'w'), indent=1, ensure_ascii=False)
    manifest['not_found'] = findings['not_found']; manifest['needs_sign_in'] = findings['needs_sign_in']
    json.dump(manifest, open(os.path.join(out, 'airway.json'), 'w'), indent=1, ensure_ascii=False); print('wrote', os.path.join(out, 'airway.json'))
    if failed: raise SystemExit('one or more files break the contract')

if __name__ == '__main__': main()
