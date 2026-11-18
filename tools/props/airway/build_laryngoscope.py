"""build_laryngoscope.py: medium (C-cell) knurled handle with a Macintosh 4 blade, fiberoptic ("green system") light.
Authored: the open laryngoscope found (CarlosBe0305, CC BY) was checked and not used, see SOURCES.md.

   blender -b --factory-startup --python tools/props/airway/build_laryngoscope.py -- TEXDIR OUTDIR

Frame (meters, glTF): origin = the hinge pin center; +Y up the handle; the open blade runs along +Z (forward) from the heel
and its tip curves down (-Y), away from the handle, as a Macintosh blade does; the flange is on the +X side (the user's left
when looking along the blade). Nodes: laryngoscope (root) > handle, blade (pivot on the hinge pin) > lamp; empties hinge,
grip (left-hand grip: on the handle axis low near the blade, +Y up the handle, +Z toward the blade), blade_tip (child of
blade, +Z along the tip). Fold: rotate `blade` about its local X; 0 = open (90 degrees to the handle), -90 deg = folded
along the front of the handle."""
import bpy, bmesh, sys, os, math, json
from mathutils import Matrix, Vector
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import kit, specs
from kit import MM

T = 1.5            # blade sheet thickness (mm)


def spine(n=90):
    """Blade spine in the YZ plane (mm): from the heel's front face forward (+Z), nearly straight, then curving down."""
    pts = [Vector((0, -24.0, 9.0))]; ang = math.radians(-2.0); L = 141.0; ds = L / n
    for k in range(n):
        s = (k + 0.5) / n; kappa = (1 / 900.0) + (1 / 175.0 - 1 / 900.0) * min(1.0, max(0.0, (s - 0.12) / 0.5)) ** 1.3
        ang -= kappa * ds
        pts.append(pts[-1] + Vector((0, math.sin(ang), math.cos(ang))) * ds)
    return pts


def section(s):
    """Blade cross-section at s (0 heel .. 1 tip) as a closed polygon in (x, v) mm: v toward the handle side.
    Spatula to the right (-X), web on the left, flange lip curling further left (+X)."""
    W = 17.5 - 4.5 * s ** 1.2                                   # spatula width
    hw = 19.0 * (1 - min(1.0, s / 0.86) ** 1.6) if s < 0.86 else 0.0      # web height, gone before the tip
    F = 8.5 * (1 - min(1.0, s / 0.86) ** 1.3) if s < 0.86 else 0.0
    xr, xl = -W / 2, W / 2
    pts = [(xr, -0.6, 1.2), (xr + 2.5, 0.0, 3.0), (xl - 1.0, 0.0, 2.5 if hw > 1 else 1.0)]
    if hw > 0.8:
        pts += [(xl + 0.6, hw * 0.5, 0), (xl + 1.2, hw, min(2.5, hw * 0.4)), (xl + 1.2 + F, hw - 0.9 - 0.15 * F, 0)]
    path = kit.fillet(pts, r=1.5, n=3)
    # thicken: offset the open path by T toward -v (under side) to make a closed outline
    import numpy as np
    P = [Vector(p) for p in path]; N = []
    for i in range(len(P)):
        a = P[max(0, i - 1)]; b = P[min(len(P) - 1, i + 1)]; t = (b - a).normalized(); N.append(Vector((t.y, -t.x)))
    under = [P[i] + N[i] * T for i in range(len(P))]
    poly = [tuple(p) for p in P] + [tuple(p) for p in reversed(under)]
    return poly


def resample(poly, n):
    """Resample a closed polygon to n points by arc length (so every station has the same vertex count)."""
    pts = [Vector(p) for p in poly] + [Vector(poly[0])]; d = [0.0]
    for i in range(1, len(pts)): d.append(d[-1] + (pts[i] - pts[i - 1]).length)
    out = []; L = d[-1]; j = 0
    for k in range(n):
        t = L * k / n
        while d[j + 1] < t: j += 1
        f = (t - d[j]) / max(1e-9, d[j + 1] - d[j]); out.append(pts[j].lerp(pts[j + 1], f))
    return out


def blade_mesh(mat, nsec=64, nring=64):
    sp = spine(nsec); T_, N_, B_ = [], [], []
    for i in range(len(sp)):
        a = sp[max(0, i - 1)]; b = sp[min(len(sp) - 1, i + 1)]; t = (b - a).normalized(); x = Vector((1, 0, 0)); v = t.cross(x).normalized()    # v: in-plane normal toward +Y side
        if v.y < 0: v = -v
        T_.append(t); N_.append(v)
    bm = bmesh.new(); uvl = bm.loops.layers.uv.new('UVMap'); rings = []
    for i, p in enumerate(sp):
        s = i / (len(sp) - 1)
        poly = resample(section(s), nring)
        # rounded tip: the last 6 % of the blade narrows into a bead
        k = max(0.0, (s - 0.94) / 0.06)
        ring = []
        for q in poly:
            x, v = q.x, q.y
            if k > 0:
                x *= math.sqrt(max(0.02, 1 - k ** 2.2)); v = v * (1 - 0.3 * k) + 0.8 * k
            ring.append(bm.verts.new(tuple((p + Vector((x, 0, 0)) + N_[i] * v) * MM)))
        rings.append(ring)
    for i in range(len(rings) - 1):
        for j in range(nring):
            f = bm.faces.new([rings[i][j], rings[i][(j + 1) % nring], rings[i + 1][(j + 1) % nring], rings[i + 1][j]])
            for l, t in zip(f.loops, [(j / nring, i / nsec), ((j + 1) / nring, i / nsec), ((j + 1) / nring, (i + 1) / nsec), (j / nring, (i + 1) / nsec)]): l[uvl].uv = t
    for ring, flip in ((rings[0], True), (rings[-1], False)):
        c = bm.verts.new(tuple(sum((v.co for v in ring), Vector()) / len(ring)))
        for j in range(nring):
            tri = [c, ring[j], ring[(j + 1) % nring]]
            if flip: tri = tri[::-1]
            f = bm.faces.new(tri)
            for l in f.loops: l[uvl].uv = (0.5, 0.5)
    me = bpy.data.meshes.new('blade_body'); bm.to_mesh(me); bm.free(); kit.finish_mesh(me, 50); me.materials.append(mat)
    return kit._obj('blade_body', me), sp, N_, T_


def heel(mat):
    """The hook-on heel: a block on the blade's proximal end with a slot that takes the handle's hinge pin (at the origin)."""
    o = kit.box('heel', (15.0 * MM, 24.0 * MM, 24.0 * MM), center=(0, -12.0 * MM, 4.0 * MM), bevel=1.2 * MM, seg=3, mat=mat)
    # the slot: a U notch from the top-back, centered on the pin
    cut = kit.lathe('slot', [(3.2, -10), (3.2, 10)], seg=24, cap0=True, cap1=True); kit.xform(cut, Matrix.Diagonal((MM, MM, MM, 1)) @ Matrix.Rotation(math.radians(90), 4, 'Z'))
    cut2 = kit.box('slot2', (20 * MM, 7.0 * MM, 14 * MM), center=(0, 0.0, -7 * MM), bevel=0)
    for c in (cut, cut2):
        b = o.modifiers.new('s', 'BOOLEAN'); b.object = c; b.operation = 'DIFFERENCE'; b.solver = 'EXACT'; kit.apply_mods(o); bpy.data.objects.remove(c)
    kit.finish_mesh(o.data, 35)
    # fiber light guide: from the heel's top-front along the web under the flange to a lens at mid-blade
    return o


def light_guide(sp, N_, mat_tube, mat_lens):
    i0, i1 = 4, int(len(sp) * 0.52); path = []
    for i in range(i0, i1 + 1):
        s = i / (len(sp) - 1); W = 17.5 - 4.5 * s ** 1.2; hw = 19.0 * (1 - min(1.0, s / 0.86) ** 1.6)
        path.append(tuple((sp[i] + Vector((W / 2 - 3.0, 0, 0)) + N_[i] * min(hw * 0.55, 8.5)) * MM))
    tube = kit.sweep('guide', path, radius=1.7 * MM, seg=14, mat=mat_tube, cap0=True)
    end = Vector(path[-1]); d = (Vector(path[-1]) - Vector(path[-2])).normalized()
    lens = kit.sweep('lens', [tuple(end), tuple(end + d * 1.2 * MM)], radius=1.75 * MM, seg=18, mat=mat_lens, cap1=True)
    return tube, lens, end + d * 1.2 * MM, d


def handle_parts(steel, chrome, knurl_mat, lens_mat):
    """Hinge head (fork with the pin bar) and the knurled C-cell handle with its end cap."""
    R = specs.LARYNGOSCOPE['handle_d'] / 2
    head = kit.box('head', (22.0 * MM, 27.0 * MM, 22.0 * MM), center=(0, 8.5 * MM, 0), bevel=1.5 * MM, seg=3, mat=chrome)
    cut = kit.box('fork', (16.4 * MM, 12.0 * MM, 30 * MM), center=(0, 0.0, 0), bevel=0)
    b = head.modifiers.new('f', 'BOOLEAN'); b.object = cut; b.operation = 'DIFFERENCE'; b.solver = 'EXACT'; kit.apply_mods(head); bpy.data.objects.remove(cut); kit.finish_mesh(head.data, 35)
    pin = kit.lathe('pin', kit.fillet([(0, -11.2, 0), (2.9, -11.2, 0.4), (2.9, 11.2, 0.4), (0, 11.2, 0)], r=0.4), seg=24, mat=steel)
    kit.xform(pin, Matrix.Diagonal((MM, MM, MM, 1)) @ Matrix.Rotation(math.radians(-90), 4, 'Z'))       # pin along X
    neck = kit.lathe('neck', kit.fillet([(9.5, 21.5, 0), (11.0, 22.5, 0.8), (11.0, 25.5, 0.8), (R - 0.4, 27.0, 0.8), (R, 28.5, 0.6), (R, 33.0, 0)], r=0.6, n=3), seg=56, mat=chrome, sharp_deg=45)
    knurled = kit.lathe('knurled', [(R + 0.05, 33.0), (R + 0.05, 137.0)], seg=56, mat=knurl_mat, uv_scale=None)
    # knurl UVs: u around x 11 tiles (8 mm tiles on an 88 mm circumference), v along in 8 mm tiles
    for l in knurled.data.uv_layers.active.data: l.uv = (l.uv[0] * 11.0, l.uv[1] * (104.0 / 8.0))
    band = kit.lathe('band', kit.fillet([(R, 137.0, 0), (R, 141.0, 0.6), (R - 0.6, 142.0, 0.4), (R - 0.6, 143.0, 0.0), (R - 0.2, 143.4, 0.3), (R - 0.2, 155.0, 1.5), (R - 2.5, 157.5, 2.0), (0, 158.0, 0)], r=0.6, n=3), seg=56, mat=chrome, sharp_deg=45)
    for o in (neck, knurled, band): kit.xform(o, Matrix.Diagonal((MM, MM, MM, 1)))
    # green-system light window on the head's front face, where the blade's light guide meets it
    win = kit.sweep('window', [(0, 9.0 * MM, 11.0 * MM), (0, 9.0 * MM, 11.25 * MM)], radius=2.2 * MM, seg=18, mat=lens_mat, cap1=True)
    return [head, pin, neck, knurled, band], win


def build(texdir, outdir):
    kit.reset()
    steel = kit.material('steel_blade', rgb=(0.72, 0.73, 0.74), rough=0.17, metal=1.0)
    chrome = kit.material('chrome_handle', rgb=(0.86, 0.87, 0.88), rough=0.07, metal=1.0)
    knurl_tex = kit.image(os.path.join(texdir, 'knurl_normal.png'), colorspace='Non-Color')
    knurl_mat = kit.material('chrome_knurl', rgb=(0.82, 0.83, 0.84), rough=0.24, metal=1.0, normal_tex=knurl_tex, normal_strength=0.65)
    tube_mat = kit.material('light_guide', rgb=(0.68, 0.69, 0.70), rough=0.22, metal=1.0)
    lamp_mat = kit.material('lamp_led', rgb=(0.9, 0.9, 0.88), rough=0.1, emission=(1.0, 0.96, 0.88), emission_strength=6.0)
    green = kit.material('green_band', rgb=(0.05, 0.42, 0.18), rough=0.35)
    item = kit.Item('laryngoscope')
    hp, win = handle_parts(steel, chrome, knurl_mat, lamp_mat)
    # a green ring on the handle neck marks the green (fiberoptic) system (ISO 7376)
    gr = kit.lathe('green_ring', [(11.05, 22.6), (11.05, 25.4)], seg=48, mat=green); kit.xform(gr, Matrix.Diagonal((MM, MM, MM, 1)))
    item.part('handle', hp + [win, gr])
    body, sp, N_, T_ = blade_mesh(steel)
    hl = heel(steel)
    tube, lens, lens_pt, lens_dir = light_guide(sp, N_, tube_mat, lamp_mat)
    blade = item.part('blade', [body, hl, tube], pivot=(0, 0, 0))
    lamp = item.part('lamp', [lens], parent='blade', pivot=tuple(lens_pt))
    item.empty('hinge', at=(0, 0, 0), z=(0, 0, 1), y=(0, 1, 0))
    tip = sp[-1]; tdir = (sp[-1] - sp[-3]).normalized()
    item.empty('blade_tip', at=tuple(tip * MM), z=tuple(tdir), y=(0, 1, 0), parent='blade')
    item.empty('grip', at=(0, 0.062, 0), z=(0, 0, 1), y=(0, 1, 0))
    chord = (sp[-1] - Vector((0, -24.0, -8.0))).length
    info = {'blade': 'Macintosh 4 (adult large)', 'blade_length_heel_to_tip_mm': round(chord, 1), 'handle_diameter_mm': specs.LARYNGOSCOPE['handle_d'],
            'handle_length_mm': 158.0, 'fold': 'rotate blade about local X: 0 open, -90 deg folded', 'lamp': 'material lamp_led, emissive; set emissiveIntensity 0 when folded',
            'tris': {k: kit.tris(o) for k, o in item.parts.items() if o.type == 'MESH'}}
    item.export(os.path.join(outdir, 'laryngoscope_mac.raw.glb'), extras={'laryngoscope': json.dumps(info)})
    print('LARYNGOSCOPE', info)


if __name__ == '__main__':
    argv = sys.argv[sys.argv.index('--') + 1:]; build(argv[0], argv[1])
