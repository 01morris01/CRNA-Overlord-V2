"""build_face_items.py: the adult endoscopy bite block with its strap, and the adult nasal cannula with a CO2 sampling line.
Both authored (no open models found; see SOURCES.md).

   blender -b --factory-startup --python tools/props/airway/build_face_items.py -- OUTDIR

bite_block.glb  frame: origin at the bite line (where the incisors close on the mouthpiece), +Z out of the mouth (anterior),
                +Y toward the head (cranial), +X to the patient's left. Nodes: bite_block > block, strap; empty mouth (scope
                opening at the front of the flange, +Z out). The strap is drawn worn round an average adult head at mouth
                level; its centerline is in the strap node's extras (strap_centerline_m) for refitting.
nasal_cannula_capno.glb  frame: origin = `prongs` (midway between the two prongs at their base), +Z anterior, +Y cranial,
                +X patient's left. Nodes: nasal_cannula_capno > facepiece, tube_L, tube_R, bolo, line_o2, line_co2; empties
                prongs, loopL, loopR (where each tube passes over the ear), chin (bolo), o2_end, co2_end. Each tube node's
                extras carry its centerline (centerline_m) and outside radius so the runtime can redraw it on a fitted path."""
import bpy, bmesh, sys, os, math, json
from mathutils import Matrix, Vector
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import kit
from kit import MM


def spline(pts, n=10):
    """Catmull-Rom through pts (mm Vectors), n samples per span."""
    P = [Vector(p) for p in pts]; P = [P[0] * 2 - P[1]] + P + [P[-1] * 2 - P[-2]]; out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        for k in range(n):
            t = k / n; t2, t3 = t * t, t * t * t
            out.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3))
    out.append(P[-2]); return out


# ---------------------------------------------------------------------------------------------- bite block
def bite_block(outdir):
    kit.reset()
    blue = kit.material('biteblock_blue', rgb=(0.07, 0.26, 0.58), rough=0.40)
    white = kit.material('biteblock_white', rgb=(0.85, 0.86, 0.85), rough=0.45)
    strap_m = kit.material('strap_elastic', rgb=(0.80, 0.80, 0.78), rough=0.88, sheen=0.5, sheen_rough=0.6, double_sided=True)
    item = kit.Item('bite_block')
    # mouthpiece: an oval tube, bite surfaces top and bottom, a guard ridge at the inner end; 20 mm (60 Fr) scope channel
    def oval(rx, ry, n=48): return [(rx * math.cos(kit.TAU * k / n), ry * math.sin(kit.TAU * k / n)) for k in range(n)]
    def ring_mesh(name, stations, mat, n=48):
        """stations: list of (z, rx, ry) along +Z; a closed oval tube surface."""
        bm = bmesh.new(); uv = bm.loops.layers.uv.new('UVMap'); R = []
        for z, rx, ry in stations: R.append([bm.verts.new((x * MM, y * MM, z * MM)) for x, y in oval(rx, ry, n)])
        for i in range(len(R) - 1):
            for k in range(n):
                f = bm.faces.new([R[i][k], R[i][(k + 1) % n], R[i + 1][(k + 1) % n], R[i + 1][k]])
                for l, t in zip(f.loops, [(k / n, i), ((k + 1) / n, i), ((k + 1) / n, i + 1), (k / n, i + 1)]): l[uv].uv = t
        me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); kit.finish_mesh(me, 45); me.materials.append(mat); return kit._obj(name, me)
    outer = ring_mesh('tube_outer', [(-24.0, 13.5, 10.5), (-23.0, 15.8, 12.8), (-20.0, 16.2, 13.2), (-17.0, 14.6, 11.6), (-14.0, 14.4, 11.4), (2.0, 14.4, 11.4), (6.0, 14.4, 11.4)], white)
    inner = ring_mesh('tube_inner', [(8.0, 9.7, 9.7), (-24.0, 9.7, 9.7)], white)
    lip = ring_mesh('tube_lip', [(-24.0, 9.7, 9.7), (-24.0, 13.5, 10.5)], white)
    # flange: a face plate 72 x 46 mm, 3 mm thick, curved to the face, with strap lugs at each side
    def plate(u, v):
        a = (u - 0.5) * 2; b = (v - 0.5) * 2
        x = 36.0 * a; y = 23.0 * b * (1 - 0.18 * a * a); z = 6.0 - 7.5 * a * a - 2.0 * b * b
        return Vector((x, y, z))
    bm = bmesh.new(); uv = bm.loops.layers.uv.new('UVMap'); nu, nv = 32, 16; Vf, Vb = [], []
    for i in range(nu + 1):
        rf, rb = [], []
        for j in range(nv + 1):
            p = plate(i / nu, j / nv); rf.append(bm.verts.new(tuple(p * MM))); rb.append(bm.verts.new(tuple((p - Vector((0, 0, 3.0))) * MM)))
        Vf.append(rf); Vb.append(rb)
    for i in range(nu):
        for j in range(nv):
            bm.faces.new([Vf[i][j], Vf[i + 1][j], Vf[i + 1][j + 1], Vf[i][j + 1]]); bm.faces.new([Vb[i][j + 1], Vb[i + 1][j + 1], Vb[i + 1][j], Vb[i][j]])
    edge = [(i, 0) for i in range(nu)] + [(nu, j) for j in range(nv)] + [(i, nv) for i in range(nu, 0, -1)] + [(0, j) for j in range(nv, 0, -1)]
    for k in range(len(edge)):
        a, b = edge[k], edge[(k + 1) % len(edge)]
        bm.faces.new([Vf[a[0]][a[1]], Vb[a[0]][a[1]], Vb[b[0]][b[1]], Vf[b[0]][b[1]]])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new('flange'); bm.to_mesh(me); bm.free(); kit.finish_mesh(me, 50); me.materials.append(blue); fl = kit._obj('flange', me)
    hole = kit.lathe('hole', [(10.4, -30), (10.4, 30)], seg=48, cap0=True, cap1=True); kit.xform(hole, Matrix.Rotation(math.radians(90), 4, 'X') @ Matrix.Diagonal((MM, MM, MM, 1)))
    b = fl.modifiers.new('h', 'BOOLEAN'); b.object = hole; b.operation = 'DIFFERENCE'; b.solver = 'EXACT'; kit.apply_mods(fl); bpy.data.objects.remove(hole); kit.finish_mesh(fl.data, 50)
    collar = kit.lathe('collar', kit.fillet([(10.1, -1.0, 0), (10.1, 9.0, 0), (12.4, 9.0, 0.6), (13.0, 8.0, 0.5), (13.0, 2.0, 0)], r=0.5), seg=48, mat=blue)
    kit.xform(collar, Matrix.Rotation(math.radians(90), 4, 'X') @ Matrix.Diagonal((MM, MM, MM, 1)))
    lugs = []
    for sx in (-1, 1):
        lug = kit.box('lug', (8.0 * MM, 22.0 * MM, 3.0 * MM), center=(sx * 39.0 * MM, 0, (6.0 - 7.5 - 1.5) * MM), bevel=1.0 * MM, seg=2, mat=blue)
        slot = kit.box('slot', (3.2 * MM, 16.0 * MM, 8.0 * MM), center=(sx * 40.0 * MM, 0, (6.0 - 7.5 - 1.5) * MM), bevel=0)
        b = lug.modifiers.new('s', 'BOOLEAN'); b.object = slot; b.operation = 'DIFFERENCE'; b.solver = 'EXACT'; kit.apply_mods(lug); bpy.data.objects.remove(slot); lugs.append(lug)
    block = item.part('block', [outer, inner, lip, fl, collar] + lugs)
    # strap: 20 mm elastic band from each lug round the back of the head at mouth level
    half = [(40.0, 0, -3.0), (56.0, 0, -12.0), (70.0, 2.0, -38.0), (77.0, 4.0, -75.0), (75.0, 6.0, -115.0), (62.0, 6.0, -150.0), (34.0, 6.0, -174.0), (0.0, 6.0, -182.0)]
    path = [Vector((-x, y, z)) for x, y, z in half] + [Vector((x, y, z)) for x, y, z in reversed(half[:-1])]
    cl = spline(path, 8)
    sec = [(-10.0, -0.75), (10.0, -0.75), (10.0, 0.75), (-10.0, 0.75)]          # width along N (= +Y, up the head), thickness across
    strap = kit.sweep('strap', [tuple(p * MM) for p in cl], section=[(a * MM, b * MM) for a, b in sec], mat=strap_m, up=(0, 1, 0), sharp_deg=60)
    sp = item.part('strap', [strap]); sp['strap_centerline_m'] = json.dumps([[round(c / 1000, 4) for c in p] for p in cl[::2]]); sp['strap_width_m'] = 0.020
    item.empty('mouth', at=(0, 0, 9.0 * MM), z=(0, 0, 1), y=(0, 1, 0))
    info = {'channel_mm': 20.0, 'flange_mm': [72, 46], 'mouthpiece_mm': [28.8, 22.8], 'head_loop_mm': 'about 155 wide x 185 deep at mouth level',
            'tris': {k: kit.tris(o) for k, o in item.parts.items() if o.type == 'MESH'}}
    item.export(os.path.join(outdir, 'bite_block.raw.glb'), extras={'bite_block': json.dumps(info)}); print('BITE', info)


# ---------------------------------------------------------------------------------------------- nasal cannula
def cannula(outdir):
    kit.reset()
    pvc = kit.material('clear_cannula_pvc', rgb=(0.86, 0.95, 0.90), rough=0.16, transmission=0.9, ior=1.5)
    bolo_m = kit.material('bolo_clear', rgb=(0.92, 0.96, 0.95), rough=0.12, transmission=0.9, ior=1.5)
    luer_m = kit.material('luer_yellow', rgb=(0.85, 0.62, 0.06), rough=0.4)
    item = kit.Item('nasal_cannula_capno')
    r_t = 2.4                                                            # tubing outside radius (mm): ~4.8 mm cannula tubing
    # face piece: a soft curved bar under the nose (septum in the middle: O2 one side, CO2 sampling the other), with two prongs
    bar = [Vector((x, -2.0 - 0.012 * x * x, -2.0 - 0.020 * x * x)) for x in range(-24, 25, 2)]
    fp = kit.sweep('facebar', [tuple(p * MM) for p in bar], section=[(math.cos(a) * 3.4 * MM, math.sin(a) * 2.6 * MM) for a in [kit.TAU * k / 20 for k in range(20)]], mat=pvc, up=(0, 0, 1), cap0=True, cap1=True)
    prongs = []
    for sx in (-1, 1):
        base = Vector((sx * 7.5, -0.5, -1.0)); pr = spline([base, base + Vector((0, 4.0, -1.0)), base + Vector((0, 8.5, -4.0)), base + Vector((0, 10.5, -8.0))], 5)
        radii = [1.0 - 0.18 * k / (len(pr) - 1) for k in range(len(pr))]
        prongs.append(kit.sweep('prong', [tuple(p * MM) for p in pr], radius=2.5 * MM, seg=16, mat=pvc, radii=radii, cap1=True))
    item.part('facepiece', [fp] + prongs)
    # tubing paths (mm): from each end of the face piece across the cheek, over the ear, down behind it and under the jaw to the chin slide
    def side(sx):
        pts = [(24.5, -9.0, -14.0), (34.0, -8.0, -20.0), (50.0, -4.0, -34.0), (63.0, 6.0, -58.0), (71.0, 22.0, -84.0), (73.0, 27.0, -96.0), (71.0, 16.0, -108.0),
               (67.0, -10.0, -106.0), (60.0, -42.0, -94.0), (46.0, -72.0, -66.0), (26.0, -92.0, -36.0), (6.0, -100.0, -22.0), (1.6, -101.0, -20.0)]
        return [Vector((sx * x, y, z)) for x, y, z in pts]
    ears = {}
    for s_, sx in (('L', 1), ('R', -1)):
        cl = spline(side(sx), 9)
        t = kit.sweep('tube_' + s_, [tuple(p * MM) for p in cl], radius=r_t * MM, seg=12, mat=pvc, up=(0, 0, 1))
        node = item.part('tube_' + s_, [t]); node['centerline_m'] = json.dumps([[round(c / 1000, 4) for c in p] for p in cl[::3]]); node['radius_m'] = r_t / 1000
        ears[s_] = side(sx)[5]
    # bolo (chin slide): a short clear block the two tubes pass through
    bolo = kit.box('bolo', (11.0 * MM, 7.0 * MM, 9.0 * MM), center=(0, -101.5 * MM, -19.0 * MM), bevel=2.0 * MM, seg=3, mat=bolo_m)
    item.part('bolo', [bolo])
    # below the chin the two lines part: O2 supply and CO2 sampling (300 mm shown; the runtime continues them)
    lines = {}
    for name, sx, end_mat in (('line_o2', 1, None), ('line_co2', -1, luer_m)):
        pts = [Vector((sx * 1.6, -104.0, -20.0)), Vector((sx * 4.0, -130.0, -14.0)), Vector((sx * 10.0, -200.0, -6.0)), Vector((sx * 18.0, -280.0, 4.0)), Vector((sx * 24.0, -400.0, 10.0))]
        cl = spline(pts, 10)
        t = kit.sweep(name, [tuple(p * MM) for p in cl], radius=(r_t if name == 'line_o2' else 1.9) * MM, seg=12, mat=pvc, up=(0, 0, 1), cap1=True)
        node = item.part(name, [t]); node['centerline_m'] = json.dumps([[round(c / 1000, 4) for c in p] for p in cl[::3]]); node['radius_m'] = (r_t if name == 'line_o2' else 1.9) / 1000
        lines[name] = cl
    item.empty('prongs', at=(0, 0, 0), z=(0, 0, 1), y=(0, 1, 0))
    for s_, p in ears.items(): item.empty('loop' + s_, at=tuple(p * MM), z=(0, 1, 0), y=(0, 0, -1))
    item.empty('chin', at=(0, -101.5 * MM, -19.0 * MM), z=(0, -1, 0), y=(0, 0, 1))
    for name, cl in lines.items():
        d = (cl[-1] - cl[-2]).normalized(); item.empty(name.replace('line_', '') + '_end', at=tuple(cl[-1] * MM), z=tuple(d), y=(0, 0, 1))
    info = {'tubing_od_mm': 2 * r_t, 'sampling_line_od_mm': 3.8, 'prong_spacing_mm': 15.0, 'ear_loop_mm': [round(v, 1) for v in ears['L']],
            'tris': {k: kit.tris(o) for k, o in item.parts.items() if o.type == 'MESH'}}
    item.export(os.path.join(outdir, 'nasal_cannula_capno.raw.glb'), extras={'nasal_cannula': json.dumps(info)}); print('CANNULA', info)


if __name__ == '__main__':
    argv = sys.argv[sys.argv.index('--') + 1:]
    bite_block(argv[0]); cannula(argv[0])
