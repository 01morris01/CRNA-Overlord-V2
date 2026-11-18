"""build_syringes.py: 3, 5 and 10 mL Luer-lock syringes at US proportions (authored; no open model matched, see SOURCES.md).

   blender -b --factory-startup --python tools/props/airway/build_syringes.py -- TEXDIR OUTDIR

Frame of each file (meters, glTF): the barrel axis is +Z, pointing to the tip (the push direction). The origin is the zero
line: where the front sealing ring of the stopper sits when the syringe is empty. The printed scale faces +Y; the finger
flange wings run along X. The plunger node moves along -Z: plunger.position.z = -volume_mL * travel_m_per_mL.
Nodes: syringe_<n>ml (root) > barrel, plunger, label, tip (empty), flange (empty), and plunger > thumb (empty)."""
import bpy, sys, os, math, json
from mathutils import Matrix, Vector
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import kit, specs
from kit import MM

R90 = Matrix.Rotation(math.radians(90), 4, 'X')          # lathe axis +Y -> +Z
S = Matrix.Diagonal((MM, MM, MM, 1))
TO = R90 @ S                                             # lathe space (mm, axis Y) -> asset space (m, axis Z)


def thread_ring(name, r_in, y0, y1, pitch, depth, mat, seg=40):
    """A double-start internal thread inside the Luer-lock collar, as a swept triangular ridge."""
    objs = []
    for start in (0.0, math.pi):
        turns = (y1 - y0) / pitch; n = int(turns * seg) + 2; path = []
        for i in range(n):
            t = i / (n - 1); th = start + t * turns * kit.TAU; y = y0 + t * (y1 - y0)
            path.append((r_in * math.sin(th), y, r_in * math.cos(th)))
        # frames with up = the axis: N runs along the axis, B points radially outward, so the ridge reaches inward along -B
        o = kit.sweep(name, path, section=[(-0.32, 0.05), (0.0, -depth), (0.32, 0.05)], mat=mat, up=(0, 1, 0), sharp_deg=50)
        objs.append(o)
    return objs


def build(key, texdir, outdir):
    kit.reset(); s = specs.SYRINGES[key]; L = specs.LUER
    r, R = s['id'] / 2, s['od'] / 2; Lg, E = s['scale_len'], s['extra']; yb = -(Lg + E)            # back end of the barrel
    floor = r * 0.32; wall_front = s['wall_floor']; yf = floor + wall_front * 0.55                 # outer front face of the barrel
    clear = kit.material('clear_pp', rgb=(0.965, 0.975, 0.975), rough=0.07, transmission=1.0, ior=1.49, specular=0.5)
    white = kit.material('plunger_pp', rgb=(0.86, 0.87, 0.86), rough=0.34, specular=0.5)
    rubber = kit.M('rubber_stopper'); paper = kit.M('label_paper')
    item = kit.Item('syringe_' + key)

    # ---- barrel: wall with a conical inner floor running into the tip bore
    bore = L['bore'] / 2; c_out = L['collar_od'] / 2; c_in = L['collar_id'] / 2
    lip = 0.35
    prof = kit.fillet([
        (bore, yf + 0.2, 0),                                      # bore at the base of the tip
        (bore + 0.4, floor, 0.15), (r, 0.0, 0.25),                # inner conical floor to the zero line
        (r, yb + 1.2, 0.0), (r + 0.25, yb + 0.6, 0.0), (r + 0.25, yb, 0.0),       # a slight flare at the open end
        (R - 0.2, yb, 0.0),                                       # back face (meets the flange)
        (R, yb + 0.2, 0.0),
        (R, yf - 1.6, 1.2),                                       # outer wall to the front shoulder
        (c_out + 0.4 if c_out + 0.4 < R - 0.3 else R - 0.3, yf, 0.6),
        (bore + 1.0, yf + 0.2, 0.0)], r=0.3, n=3)
    prof.append(prof[0])
    body = kit.lathe('barrel_wall', prof, seg=64, mat=clear, sharp_deg=55)
    # ---- Luer-lock collar (internal double-start thread) and the male Luer tip inside it
    yc0, yc1 = yf - 0.2, yf + L['collar_len']
    col = kit.lathe('collar', kit.fillet([(c_in, yc1, 0), (c_in, yc0 + 0.3, 0.2), (c_out - 0.3, yc0, 0.2), (c_out, yc0 + 0.6, 0.4),
                                          (c_out, yc1 - 0.5, 0.4), (c_out - 0.4, yc1, 0.3), (c_in, yc1, 0)], r=0.25, n=2), seg=48, mat=clear, sharp_deg=55)
    thr = thread_ring('thread', c_in, yc0 + 1.2, yc1 - 0.6, 2.5, 0.55, clear)
    ytip = yc1 + 0.3; t_base = L['tip_d'] / 2 + L['taper'] * (L['tip_len']) / 2
    tip = kit.lathe('luer_tip', kit.fillet([(bore, ytip, 0), (bore, yf - 0.5, 0), (t_base + 0.35, yf - 0.5, 0), (t_base, yf + 0.4, 0.3),
                                             (L['tip_d'] / 2, ytip, 0.25), (bore, ytip, 0)], r=0.2, n=3), seg=48, mat=clear, sharp_deg=55)
    # ---- finger flange: a rounded oblong plate with the barrel hole
    fw, fd, ft = s['flange']
    def flange_outline(n=96):
        pts = []
        for i in range(n):
            th = kit.TAU * i / n; c, sn = math.cos(th), math.sin(th)
            # superellipse: wings along X, flats front/back
            ex = 2.8
            x = (fw / 2) * math.copysign(abs(c) ** (2 / ex), c); z = (fd / 2) * math.copysign(abs(sn) ** (2 / ex), sn)
            pts.append((x, z))
        return pts
    out = flange_outline(); hole = [(r * 1.0 * math.cos(kit.TAU * i / 48), r * 1.0 * math.sin(kit.TAU * i / 48)) for i in range(48)]
    import bmesh
    bm = bmesh.new(); top = [bm.verts.new((x, yb, z)) for x, z in out]; bot = [bm.verts.new((x, yb - ft, z)) for x, z in out]
    f1 = bm.faces.new(top[::-1]); f2 = bm.faces.new(bot)
    for i in range(len(out)):
        j = (i + 1) % len(out); bm.faces.new([top[i], top[j], bot[j], bot[i]])
    bmesh.ops.bevel(bm, geom=[e for e in bm.edges if len(e.link_faces) == 2 and e.calc_face_angle(0) > 0.8], offset=0.45, segments=3, profile=0.5, affect='EDGES', clamp_overlap=True)
    bmesh.ops.triangulate(bm, faces=[f for f in bm.faces if len(f.verts) > 4])
    uvl = bm.loops.layers.uv.new('UVMap')
    for f in bm.faces:
        for l in f.loops: l[uvl].uv = (l.vert.co.x / fw + 0.5, l.vert.co.z / fd + 0.5)
    me = bpy.data.meshes.new('flange'); bm.to_mesh(me); bm.free(); kit.finish_mesh(me, 40); flange = kit._obj('flange', me); me.materials.append(clear)
    # the flange is cut by the bore: a boolean leaves clean geometry
    cutter = kit.lathe('cut', [(r + 0.25, yb + 2), (r + 0.25, yb - ft - 2)], seg=72, cap0=True, cap1=True)
    b = flange.modifiers.new('hole', 'BOOLEAN'); b.object = cutter; b.operation = 'DIFFERENCE'; b.solver = 'EXACT'; kit.apply_mods(flange); bpy.data.objects.remove(cutter)
    kit.finish_mesh(flange.data, 40)
    barrel_parts = [body, col, tip, flange] + thr
    for o in barrel_parts: kit.xform(o, TO)

    # ---- printed scale: an alpha-masked shell just outside the barrel, facing +Y
    lay = json.load(open(os.path.join(texdir, 'layouts.json')))['syringe_' + key]
    W, H, top = lay['width_mm'], lay['height_mm'], lay['top_mm']; rs = R + 0.03; span = W / rs; ctr = math.pi        # lathe angle pi -> +Y after the turn
    def scale_pt(u, v):
        th = ctr - span / 2 + span * u; y = top - H * (1 - v)              # v=1 at the image top (tip side)
        return (rs * math.sin(th), y, rs * math.cos(th))
    scale = kit.grid('scale', scale_pt, 20, 1, mat=kit.ink('ink_scale_' + key, kit.image(os.path.join(texdir, 'syringe_scale_%s.png' % key))))
    # mirror check: lathe angle increases toward +X at the front... u is flipped so text reads left to right from outside
    kit.xform(scale, TO)
    barrel = item.part('barrel', barrel_parts + [scale])

    # ---- label: the area the runtime paints (on the side away from the scale)
    lw_mm, lh_mm = s['label']; lw_mm = min(lw_mm, Lg - 2.0); rl = R + 0.12; lspan = lh_mm / rl; lc = 0.0       # lathe angle 0 -> -Y
    yl0 = -Lg / 2 - lw_mm / 2
    def label_pt(u, v):
        th = lc + lspan / 2 - lspan * v; y = yl0 + lw_mm * u
        return (rl * math.sin(th), y, rl * math.cos(th))
    label = kit.grid('label', label_pt, 1, 14, mat=paper)
    # u along the barrel (0 flange end -> 1 tip end), v around; the grid already gives (u, v)
    kit.xform(label, TO); item.part('label', [label])

    # ---- plunger: stopper + cross-ribbed rod + thumb press. Pivot = front sealing edge of the stopper (zero line at 0 mL)
    sl = s['stopper_len']; rr = r + 0.05                                                         # the ribs press slightly into the wall
    nose = floor * 0.92
    stop = kit.lathe('stopper', kit.fillet([(0.0, nose, 0), (r * 0.55, nose * 0.55, 0.3), (r - 0.25, 0.25, 0.3), (rr, 0.0, 0.25), (rr, -1.1, 0.25), (r - 0.45, -1.6, 0.3),
                                            (r - 0.45, -sl + 1.6, 0.3), (rr, -sl + 1.1, 0.25), (rr, -sl + 0.2, 0.2), (r - 0.6, -sl, 0.2), (r * 0.6, -sl, 0)], r=0.3, n=3), seg=48, mat=rubber, sharp_deg=60)
    ys = -sl + 0.5                                                                                # rod head sits inside the stopper's back
    rod_len = (Lg + E) + 12.0 - sl                                                                # thumb press about 12 mm behind the flange when empty
    yt = ys - rod_len
    head = kit.lathe('head', kit.fillet([(0, ys + 1.2, 0), (r - 1.0, ys + 1.2, 0.3), (r - 1.0, ys - 0.4, 0.3), (r * 0.5, ys - 1.4, 0), (0, ys - 1.4, 0)], r=0.3), seg=48, mat=white, cap0=False)
    ribw, ribt = s['id'] - 1.0, s['rod_rib']
    ribs = []
    for ang in (0, 90):
        b = kit.box('rib%d' % ang, (ribw, rod_len - 2.2, ribt), center=(0, ys - 1.2 - (rod_len - 2.2) / 2, 0), bevel=0.25, seg=2, mat=white)
        b.data.transform(Matrix.Rotation(math.radians(ang), 4, 'Y')); ribs.append(b)
    th_ = s['thumb'] / 2; tt = 1.8
    thumb = kit.lathe('thumbpress', kit.fillet([(0, yt + 0.1, 0), (th_ - 0.3, yt + 0.1, 0.0), (th_, yt - 0.5, 0.5), (th_, yt - tt + 0.5, 0.5), (th_ - 0.4, yt - tt, 0.4), (0, yt - tt, 0)], r=0.4, n=3), seg=48, mat=white, sharp_deg=60)
    # a ring of reinforcement where the rod meets the thumb press
    collar2 = kit.lathe('rodfoot', kit.fillet([(ribw / 2 * 0.35, yt + 4.0, 0), (ribw / 2 * 0.55, yt + 0.6, 1.0), (ribw / 2 * 0.95, yt + 0.1, 0)], r=0.6), seg=32, mat=white)
    pl = [stop, head, thumb, collar2] + ribs
    for o in pl: kit.xform(o, TO)
    plunger = item.part('plunger', pl)

    # ---- anchors
    ytipm = ytip * MM
    item.empty('tip', at=(0, 0, ytipm), z=(0, 0, 1), y=(0, 1, 0))
    item.empty('flange', at=(0, 0, yb * MM - ft * MM / 2), z=(0, 0, 1), y=(0, 1, 0))
    item.empty('thumb', at=(0, 0, (yt - tt) * MM), z=(0, 0, 1), y=(0, 1, 0), parent='plunger')

    travel = s['mm_per_ml'] * MM
    max_stroke = (Lg + E - sl - 1.5) * MM
    info = {'capacity_mL': s['ml'], 'inside_diameter_m': round(s['id'] * MM, 6), 'outside_diameter_m': round(s['od'] * MM, 6),
            'travel_m_per_mL': round(travel, 7), 'full_stroke_offset_m': round(s['ml'] * travel, 6), 'max_stroke_offset_m': round(max_stroke, 6),
            'plunger_axis': [0, 0, -1], 'label_size_m': [round(lw_mm * MM, 5), round(lh_mm * MM, 5)],
            'label_center_m': [0, round(-rl * MM, 5), round((yl0 + lw_mm / 2) * MM, 5)],
            'tip_m': [0, 0, round(ytipm, 5)], 'length_empty_m': round((ytip - (yt - tt)) * MM, 5),
            'graduations': {'minor_mL': s['minor'], 'major_mL': s['major'], 'numbers': s['numbers']}}
    path = item.export(os.path.join(outdir, 'syringe_%s.raw.glb' % key), extras={'syringe': json.dumps(info)})
    print('SYRINGE', key, {k: kit.tris(o) for k, o in item.parts.items() if o.type == 'MESH'}, info)
    return info


if __name__ == '__main__':
    argv = sys.argv[sys.argv.index('--') + 1:]; texdir, outdir = argv[0], argv[1]
    infos = {}
    for k in specs.SYRINGES: infos['syringe_' + k] = build(k, texdir, outdir)
    json.dump(infos, open(os.path.join(outdir, 'syringes.raw.json'), 'w'), indent=1)
