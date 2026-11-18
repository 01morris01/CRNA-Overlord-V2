"""build_bag.py: 3 L reservoir (breathing) bag, latex-free black rubber, with a 22 mm female neck. Authored (no open model
with a usable shape for morphing; see SOURCES.md).

   blender -b --factory-startup --python tools/props/airway/build_bag.py -- OUTDIR

Frame (meters, glTF): +Y runs from the tail to the neck (the bag hangs neck-up on a bag mount); the origin is the center of
the neck opening. The `neck` empty sits there with +Z pointing out of the neck along the fitting axis (glTF +Y).
Morph targets on the `bag` mesh (base shape = empty, lying flat):
  fill     0 = empty and flat, 1 = full (3.0 L enclosed by the body skin)
  squeeze  a one-hand squeeze of the full bag: four finger dents on the -X side, the thumb on +X, centered on the
           widest part; removes about 0.7 L at weight 1 (use with fill = 1).
The volume at several weights is written to the root node's extras (bag.volume_by_fill, bag.squeeze_delta_l)."""
import bpy, bmesh, sys, os, math, json
import numpy as np
from mathutils import Matrix, Vector
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import kit, specs
from kit import MM

NI = 64                       # segments around
NECK_LEN = 52.0               # mm, mouth to the base of the neck
R_NECK_IN = specs.BAG['neck_id'] / 2
R_NECK_OUT = 15.8
BODY_LEN = 262.0              # mm, neck base to tail end
TAIL_R = 5.5


def body_profile(Rm, n=58):
    """(r, y) from the neck base down to the tail tip. Pear shaped: fullest about 58 % of the way down."""
    pts = []
    for k in range(n + 1):
        t = k / n; u = t ** 1.22
        f = math.sin(math.pi * u) ** 0.72
        r = Rm * f + R_NECK_OUT * (1 - t) ** 7 + TAIL_R * t ** 14
        y = -NECK_LEN - BODY_LEN * t
        pts.append((max(r, 0.0), y))
    return pts


def rings_full(prof):
    P = np.zeros((len(prof), NI, 3))
    for j, (r, y) in enumerate(prof):
        for i in range(NI):
            a = 2 * math.pi * i / NI; P[j, i] = (r * math.sin(a), y, r * math.cos(a))
    return P


def volume(P):
    """Enclosed volume (mm^3) of the closed skin made by the rings (capped at both ends) by the divergence theorem."""
    V = 0.0; nj = P.shape[0]
    def tri(a, b, c): return float(np.dot(a, np.cross(b, c))) / 6.0
    for j in range(nj - 1):
        for i in range(NI):
            a, b, c, d = P[j, i], P[j, (i + 1) % NI], P[j + 1, (i + 1) % NI], P[j + 1, i]
            V += tri(a, b, c) + tri(a, c, d)
    for j, sgn in ((0, -1), (nj - 1, 1)):
        ctr = P[j].mean(axis=0)
        for i in range(NI):
            V += sgn * tri(ctr, P[j, (i + 1) % NI], P[j, i])
    return abs(V)


def flat_rings(prof, P_full):
    """The empty bag: each ring flattened to two sheets (width ~ half its circumference, a few mm thick) with soft wrinkles;
    the bag lengthens to its meridian length. The neck end of the body keeps its shape."""
    nj = len(prof); out = np.zeros_like(P_full)
    s = [0.0]
    for j in range(1, nj): s.append(s[-1] + math.dist(prof[j - 1], prof[j]))
    for j, (r, y) in enumerate(prof):
        t = j / (nj - 1); k = min(1.0, (t / 0.10) ** 1.5)                         # flattening ramps in over the first 10 % below the neck
        yf = -NECK_LEN - s[j] * 0.97
        for i in range(NI):
            a = 2 * math.pi * i / NI
            xf = (math.pi * r / 2) * math.sin(a) * 0.96; zf = (2.6 + 0.012 * r) * math.cos(a)
            zf += 2.2 * math.sin(0.045 * yf + 3.1 * math.sin(a)) * math.sin(a) ** 2 + 1.3 * math.sin(0.11 * xf + 0.02 * yf)     # wrinkles
            full = P_full[j, i]; fl = np.array((xf, yf, zf))
            out[j, i] = full + (fl - full) * k
    return out


def squeeze_field(prof, P_full, amount):
    """Displacements of the full bag for a one-hand squeeze (mm), scaled by `amount`."""
    nj = len(prof); D = np.zeros_like(P_full); radii = np.array([p[0] for p in prof]); jmax = int(np.argmax(radii)); yc = prof[jmax][1] + 10.0
    fingers = [yc + 33, yc + 11, yc - 11, yc - 31]
    for j, (r, y) in enumerate(prof):
        win = math.exp(-((y - yc) / 58.0) ** 2)
        for i in range(NI):
            a = 2 * math.pi * i / NI; x, z = math.sin(a), math.cos(a)                 # unit direction in the ring (x = sin, z = cos)
            inward = -np.array((x, 0, z))
            d = 0.0
            d += 0.30 * r * win * abs(x) ** 1.6                                          # palm and thumb press the section into an oval (along X)
            if x < 0:                                                                    # fingers: four grooves wrapping the -X side
                wrap = math.exp(-((math.atan2(z, -x)) / 0.95) ** 2)
                d += sum(6.0 * math.exp(-((y - fy) / 8.5) ** 2) for fy in fingers) * wrap * win
            else:                                                                        # thumb pad on +X
                d += 8.0 * math.exp(-((y - (yc + 5)) / 20.0) ** 2) * math.exp(-((math.atan2(z, x)) / 0.45) ** 2)
            bulge = 0.10 * r * math.exp(-((y - (yc - 120)) / 45.0) ** 2) + 0.05 * r * math.exp(-((y - (yc + 105)) / 35.0) ** 2)
            D[j, i] = (inward * d - inward * bulge * abs(z) ** 1.2) * amount
    return D


def build(outdir):
    kit.reset()
    # size the body so that the full skin encloses 3.0 L
    Rm = 75.0
    for _ in range(30):
        prof = body_profile(Rm); V = volume(rings_full(prof)) * 1e-6
        Rm *= math.sqrt(specs.BAG['volume_l'] / V)
    prof = body_profile(Rm); Pf = rings_full(prof); V_full = volume(Pf) * 1e-6
    Pflat = flat_rings(prof, Pf)
    # squeeze: find the amount that removes the specified volume
    amt = 1.0
    for _ in range(25):
        Vs = volume(Pf + squeeze_field(prof, Pf, amt)) * 1e-6
        dv = V_full - Vs; amt *= specs.BAG['squeeze_l'] / max(dv, 1e-6)
    D = squeeze_field(prof, Pf, amt); V_sq = volume(Pf + D) * 1e-6
    print('squeeze amount', round(amt, 3), 'max dent mm', round(float(np.linalg.norm(D, axis=2).max()), 1))
    # rigid neck: outer skin from the mouth to the neck base (with two reinforcing ribs), and the bore
    neck_prof = kit.fillet([(R_NECK_IN + 0.2, 0.0, 0), (R_NECK_OUT - 0.6, 0.0, 0.0), (R_NECK_OUT, -0.8, 0.0), (R_NECK_OUT, -6.0, 0.5), (R_NECK_OUT + 1.6, -7.5, 0.6),
                            (R_NECK_OUT + 1.6, -10.5, 0.6), (R_NECK_OUT, -12.0, 0.5), (R_NECK_OUT, -17.0, 0.5), (R_NECK_OUT + 1.2, -18.4, 0.5), (R_NECK_OUT + 1.2, -20.8, 0.5),
                            (R_NECK_OUT, -22.2, 0.5), (R_NECK_OUT, -NECK_LEN + 0.01, 0)], r=0.5, n=3)
    neck_outer = [(r, y) for r, y in neck_prof]
    # one mesh: neck outer rings + body rings (same NI), so morph deltas are simply per ring
    rings = []                                               # (positions for base(flat), full, squeeze)
    for r, y in neck_outer:
        ring = np.array([(r * math.sin(2 * math.pi * i / NI), y, r * math.cos(2 * math.pi * i / NI)) for i in range(NI)])
        rings.append((ring, ring, ring))
    for j in range(1, len(prof)):
        rings.append((Pflat[j], Pf[j], Pf[j] + D[j]))
    bm = bmesh.new(); uvl = bm.loops.layers.uv.new('UVMap'); V = []
    nr = len(rings)
    for j in range(nr):
        V.append([bm.verts.new(tuple(rings[j][0][i] * MM)) for i in range(NI)])
    yspan = (rings[0][1][0][1] - rings[-1][1][0][1])
    for j in range(nr - 1):
        for i in range(NI):
            i2 = (i + 1) % NI
            f = bm.faces.new([V[j][i], V[j][i2], V[j + 1][i2], V[j + 1][i]])
            v0 = (rings[0][1][0][1] - rings[j][1][0][1]) / yspan; v1 = (rings[0][1][0][1] - rings[j + 1][1][0][1]) / yspan
            for l, t in zip(f.loops, [(i / NI, 1 - v0), ((i + 1) / NI, 1 - v0), ((i + 1) / NI, 1 - v1), (i / NI, 1 - v1)]): l[uvl].uv = t
    tipc = bm.verts.new(tuple(np.mean(rings[-1][0], axis=0) * MM))
    for i in range(NI):
        f = bm.faces.new([V[-1][i], V[-1][(i + 1) % NI], tipc])
        for l in f.loops: l[uvl].uv = (i / NI, 0.0)
    me = bpy.data.meshes.new('bag'); bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth = True
    rubber = kit.material('rubber_bag_black', rgb=(0.018, 0.018, 0.02), rough=0.38, sheen=0.12, sheen_rough=0.3, sheen_tint=(0.35, 0.35, 0.37), specular=0.5)
    me.materials.append(rubber)
    bag = kit._obj('bag', me)
    # shape keys: Basis = flat; fill = full; squeeze = full + dents (stored relative to basis, so set fill=1 with it)
    bag.shape_key_add(name='Basis')
    kf = bag.shape_key_add(name='fill', from_mix=False); ks = bag.shape_key_add(name='squeeze', from_mix=False)
    idx = 0
    for j in range(nr):
        for i in range(NI):
            kf.data[idx].co = Vector(rings[j][1][i] * MM)
            ks.data[idx].co = Vector((rings[j][2][i] - rings[j][1][i] + rings[j][0][i]) * MM)   # squeeze delta added on top of fill
            idx += 1
    kf.data[idx].co = Vector(np.mean(rings[-1][1], axis=0) * MM); ks.data[idx].co = Vector(np.mean(rings[-1][0], axis=0) * MM)
    kf.value = 1.0; ks.value = 0.0                      # glTF default weights: a full bag, not squeezed
    # the bore of the neck (rigid, separate object, joined below without shape keys influence)
    bore = kit.lathe('bore', [(R_NECK_IN, -NECK_LEN + 6), (R_NECK_IN, -2.0), (R_NECK_IN + 0.2, 0.0)], seg=48, mat=rubber, sharp_deg=None, flip=True)
    kit.xform(bore, Matrix.Diagonal((MM, MM, MM, 1)))
    # tail loop
    tail_y = rings[-1][1][0][1]
    loop = kit.sweep('tail_loop', [((9.0 * math.sin(a)) * MM, (tail_y - 9.0 - 9.0 * math.cos(a)) * MM, 0) for a in np.linspace(0, 2 * math.pi, 33)[:-1]], radius=2.4 * MM, seg=12, mat=rubber, closed=True)
    stub = kit.lathe('tail_stub', [(TAIL_R * 0.9, tail_y + 3), (3.2, tail_y - 1.5), (2.6, tail_y - 1.6)], seg=24, mat=rubber)
    kit.xform(stub, Matrix.Diagonal((MM, MM, MM, 1)))
    # join rigid parts into the bag mesh: Blender keeps their positions in every shape key
    bpy.ops.object.select_all(action='DESELECT')
    for o in (bore, loop, stub): o.select_set(True)
    bag.select_set(True); bpy.context.view_layer.objects.active = bag; bpy.ops.object.join()
    item = kit.Item('reservoir_bag_3l')
    bag = item.part('bag', [bag])
    item.empty('neck', at=(0, 0, 0), z=(0, 1, 0), y=(0, 0, 1))
    radii = np.array([p[0] for p in prof]); jmax = int(np.argmax(radii)); yc = prof[jmax][1] + 10.0
    item.empty('squeeze_center', at=(0, yc * MM, 0), z=(1, 0, 0), y=(0, 1, 0))
    # volume by fill weight (linear blend of the flat and full rings)
    vols = {}
    for w in (0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0):
        vols[str(w)] = round(volume(Pflat + (Pf - Pflat) * w) * 1e-6, 3)
    info = {'volume_full_l': round(V_full, 3), 'squeeze_delta_l': round(V_full - V_sq, 3), 'volume_by_fill': vols, 'max_diameter_m': round(2 * Rm * MM, 4),
            'length_m': round((NECK_LEN + BODY_LEN + 18) * MM, 4), 'neck_id_m': round(2 * R_NECK_IN * MM, 4), 'squeeze_center_m': [0, round(yc * MM, 4), 0],
            'squeeze_hand': 'fingers on -X, thumb on +X, grip centered at squeeze_center', 'tris': kit.tris(bag)}
    path = os.path.join(outdir, 'reservoir_bag_3l.raw.glb')
    item.export(path, extras={'bag': json.dumps(info)})
    fix_squeeze_normals(path, bag)
    print('BAG', info)


def eval_normals(o, fill, squeeze):
    kb = o.data.shape_keys.key_blocks; kb['fill'].value = fill; kb['squeeze'].value = squeeze
    dg = bpy.context.evaluated_depsgraph_get(); e = o.evaluated_get(dg); me = e.to_mesh()
    n = np.array([v.normal[:] for v in me.vertices]); e.to_mesh_clear(); return n


def fix_squeeze_normals(path, o):
    """glTF morph normals add up linearly. The exporter wrote the `squeeze` normal deltas against the flat base, but squeeze is
    meant to be used on top of fill = 1, so its normal deltas must be (normal of the squeezed full bag) - (normal of the full
    bag). Rewrite them in the exported file, matching exported vertices to mesh vertices by their base (flat) position."""
    import struct
    from mathutils.kdtree import KDTree
    n_full = eval_normals(o, 1.0, 0.0); n_sq = eval_normals(o, 1.0, 1.0); o.data.shape_keys.key_blocks['squeeze'].value = 0.0
    base = [tuple(v.co) for v in o.data.shape_keys.key_blocks['Basis'].data]
    kd = KDTree(len(base))
    for i, c in enumerate(base): kd.insert(c, i)
    kd.balance()
    data = open(path, 'rb').read(); jl = struct.unpack('<I', data[12:16])[0]; doc = json.loads(data[20:20 + jl]); bin_off = 20 + jl + 8
    blob = bytearray(data[bin_off:])
    mesh = next(m for m in doc['meshes'] if m['name'] == 'bag'); names = mesh.get('extras', {}).get('targetNames', [])
    k = names.index('squeeze'); acc = doc['accessors']; bvs = doc['bufferViews']
    def arr(ai):
        a = acc[ai]; bv = bvs[a['bufferView']]; off = bv.get('byteOffset', 0) + a.get('byteOffset', 0); n = a['count']
        return off, np.frombuffer(bytes(blob[off:off + n * 12]), dtype='<f4').reshape(n, 3).copy()
    for prim in mesh['primitives']:
        _, P = arr(prim['attributes']['POSITION'])
        tgt = prim['targets'][k]
        if 'NORMAL' not in tgt: continue
        off, N = arr(tgt['NORMAL'])
        for i, p in enumerate(P):
            co, j, d = kd.find(tuple(p)); N[i] = n_sq[j] - n_full[j]
        blob[off:off + N.size * 4] = N.astype('<f4').tobytes()
        a = acc[tgt['NORMAL']]; a['min'] = [float(x) for x in N.min(0)]; a['max'] = [float(x) for x in N.max(0)]
    js = json.dumps(doc, separators=(',', ':')).encode(); js += b' ' * ((4 - len(js) % 4) % 4)
    out = struct.pack('<4sII', b'glTF', 2, 12 + 8 + len(js) + 8 + len(blob)) + struct.pack('<II', len(js), 0x4E4F534A) + js + struct.pack('<II', len(blob), 0x004E4942) + bytes(blob)
    open(path, 'wb').write(out); print('squeeze normals rewritten')


if __name__ == '__main__':
    argv = sys.argv[sys.argv.index('--') + 1:]; build(argv[0])
