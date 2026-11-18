"""finish.py: compress a raw export with gltf-transform and check it against what the runtime expects.

   python3 -I tools/props/airway/finish.py RAW.glb OUT.glb [--nodes a,b,c] [--max-tris 15000] [--max-bytes 2000000] [--tex 1024]

Draco geometry, WebP textures (at most --tex px), no simplification, and nothing joined, flattened, instanced or pruned (the
empties are anchors the runtime looks up by name). Prints triangles, bytes, node names, morph targets and the extensions used."""
import json, os, struct, subprocess, sys

def read_glb(path):
    with open(path, 'rb') as f:
        f.read(12); n, _ = struct.unpack('<II', f.read(8)); return json.loads(f.read(n))

def facts(path):
    d = read_glb(path); acc = d.get('accessors', []); tris = 0; morphs = {}
    for m in d.get('meshes', []):
        for p in m['primitives']:
            tris += (acc[p['indices']]['count'] if 'indices' in p else acc[p['attributes']['POSITION']]['count']) // 3
        names = (m.get('extras') or {}).get('targetNames')
        if names: morphs[m.get('name')] = names
    return {'triangles': tris, 'bytes': os.path.getsize(path), 'nodes': [n.get('name') for n in d.get('nodes', [])], 'morphs': morphs,
            'extensions': d.get('extensionsUsed', []), 'materials': [m.get('name') for m in d.get('materials', [])],
            'images': [(i.get('name'), i.get('mimeType')) for i in d.get('images', [])], 'animations': [a.get('name') for a in d.get('animations', [])],
            'skins': len(d.get('skins', []))}

def strip_suffix(path, names):
    """Blender needs unique object names, the runtime wants the same anchor name under each part: rename `in.001` -> `in`."""
    import re
    with open(path, 'rb') as fh: data = fh.read()
    n, _ = struct.unpack('<II', data[12:20]); doc = json.loads(data[20:20 + n]); rest = data[20 + n:]
    for node in doc.get('nodes', []):
        m = re.match(r'^(.*)\.\d{3}$', node.get('name', ''))
        if m and m.group(1) in names: node['name'] = m.group(1)
    js = json.dumps(doc, separators=(',', ':')).encode(); js += b' ' * ((4 - len(js) % 4) % 4)
    out = struct.pack('<4sII', b'glTF', 2, 12 + 8 + len(js) + len(rest)) + struct.pack('<II', len(js), 0x4E4F534A) + js + rest
    with open(path, 'wb') as fh: fh.write(out)


def main():
    a = sys.argv[1:]; raw, out = a[0], a[1]; opts = {}
    i = 2
    while i < len(a): opts[a[i].lstrip('-')] = a[i + 1]; i += 2
    tex = opts.get('tex', '1024')
    cmd = ['npx', '-y', '@gltf-transform/cli@4', 'optimize', raw, out, '--compress', opts.get('compress', 'draco'), '--texture-compress', 'webp', '--texture-size', tex,
           '--simplify', 'false', '--join', 'false', '--flatten', 'false', '--instance', 'false', '--palette', 'false', '--prune', 'false', '--prune-attributes', 'false']
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(r.stdout[-3000:], r.stderr[-3000:]); raise SystemExit('gltf-transform failed')
    if opts.get('strip-suffix'):
        strip_suffix(out, set(opts['strip-suffix'].split(',')))
    f = facts(out); bad = []
    want = [n for n in opts.get('nodes', '').split(',') if n]
    for n in want:
        if n not in f['nodes']: bad.append('missing node ' + n)
    if f['triangles'] > int(opts.get('max-tris', 15000)): bad.append('%d triangles' % f['triangles'])
    if f['bytes'] > int(opts.get('max-bytes', 2_000_000)): bad.append('%d bytes' % f['bytes'])
    f['raw_bytes'] = os.path.getsize(raw); f['problems'] = bad
    print(json.dumps(f))
    if bad: print('PROBLEMS', bad)

if __name__ == '__main__':
    main()
