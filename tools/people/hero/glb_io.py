"""glb_io.py: read and write glTF binary files as (json dict, bin bytes), and small helpers on the node tree.
Plain Python + numpy; no outside packages."""
import json, struct
import numpy as np


def read(path):
    data = open(path, 'rb').read()
    magic, ver, length = struct.unpack_from('<III', data, 0)
    assert magic == 0x46546C67, 'not a glb'
    off = 12; js = None; binb = b''
    while off < length:
        clen, ctype = struct.unpack_from('<II', data, off); off += 8
        chunk = data[off:off + clen]; off += clen
        if ctype == 0x4E4F534A:
            js = json.loads(chunk.decode('utf-8'))
        elif ctype == 0x004E4942:
            binb = chunk
    return js, bytearray(binb)


def write(path, js, binb):
    jb = json.dumps(js, separators=(',', ':')).encode('utf-8')
    jb += b' ' * ((4 - len(jb) % 4) % 4)
    bb = bytes(binb) + b'\0' * ((4 - len(binb) % 4) % 4)
    total = 12 + 8 + len(jb) + (8 + len(bb) if bb else 0)
    with open(path, 'wb') as f:
        f.write(struct.pack('<III', 0x46546C67, 2, total))
        f.write(struct.pack('<II', len(jb), 0x4E4F534A)); f.write(jb)
        if bb:
            f.write(struct.pack('<II', len(bb), 0x004E4942)); f.write(bb)


def add_image(js, binb, png_bytes, name, mime='image/png'):
    while len(binb) % 4:
        binb.append(0)
    off = len(binb); binb.extend(png_bytes)
    js.setdefault('bufferViews', []).append({'buffer': 0, 'byteOffset': off, 'byteLength': len(png_bytes)})
    js['buffers'][0]['byteLength'] = len(binb)
    js.setdefault('images', []).append({'name': name, 'mimeType': mime, 'bufferView': len(js['bufferViews']) - 1})
    js.setdefault('samplers', []).append({'magFilter': 9729, 'minFilter': 9987, 'wrapS': 10497, 'wrapT': 10497})
    js.setdefault('textures', []).append({'name': name, 'source': len(js['images']) - 1, 'sampler': len(js['samplers']) - 1})
    return len(js['textures']) - 1


def quat_to_mat(q):
    x, y, z, w = q
    return np.array([[1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w)],
                     [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w)],
                     [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y)]])


def node_local(n, override=None):
    if 'matrix' in n and not override:
        return np.array(n['matrix'], float).reshape(4, 4).T
    t = np.array((override or {}).get('translation', n.get('translation', [0, 0, 0])), float)
    r = np.array((override or {}).get('rotation', n.get('rotation', [0, 0, 0, 1])), float)
    s = np.array((override or {}).get('scale', n.get('scale', [1, 1, 1])), float)
    M = np.eye(4); M[:3, :3] = quat_to_mat(r) * s; M[:3, 3] = t
    return M


def world_matrices(js, overrides=None):
    nodes = js['nodes']; parent = {}
    for i, n in enumerate(nodes):
        for c in n.get('children', []):
            parent[c] = i
    W = {}

    def get(i):
        if i in W:
            return W[i]
        L = node_local(nodes[i], (overrides or {}).get(i))
        W[i] = (get(parent[i]) @ L) if i in parent else L
        return W[i]
    for i in range(len(nodes)):
        get(i)
    return W


def accessor(js, binb, idx):
    a = js['accessors'][idx]; bv = js['bufferViews'][a['bufferView']]
    comp = {5126: np.float32, 5123: np.uint16, 5125: np.uint32, 5121: np.uint8, 5122: np.int16, 5120: np.int8}[a['componentType']]
    ncomp = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4, 'MAT4': 16}[a['type']]
    off = bv.get('byteOffset', 0) + a.get('byteOffset', 0)
    stride = bv.get('byteStride', 0)
    if stride and stride != np.dtype(comp).itemsize * ncomp:
        raw = np.frombuffer(bytes(binb[off:off + stride * a['count']]), np.uint8).reshape(a['count'], stride)
        return raw[:, :np.dtype(comp).itemsize * ncomp].copy().view(comp).reshape(a['count'], ncomp)
    return np.frombuffer(bytes(binb[off:off + a['count'] * ncomp * np.dtype(comp).itemsize]), comp).reshape(a['count'], ncomp)


def clip_overrides(js, binb, anim_name):
    """Node TRS of the first keyframe of each channel of the named animation."""
    an = next(a for a in js.get('animations', []) if a.get('name') == anim_name)
    ov = {}
    for ch in an['channels']:
        smp = an['samplers'][ch['sampler']]
        out = accessor(js, binb, smp['output'])
        node = ch['target'].get('node'); path = ch['target']['path']
        if node is None or path == 'weights':
            continue
        ov.setdefault(node, {})[path] = out[0].tolist()
    return ov
