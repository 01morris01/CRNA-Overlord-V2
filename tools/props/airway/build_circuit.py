"""build_circuit.py: breathing-circuit fittings: 22 mm swivel elbow with a capped sampling port, Y-piece, and an adult HME
filter (HMEF). Authored to ISO 5356-1 cone sizes (see specs.py); no open model was suitable (SOURCES.md).

   blender -b --factory-startup --python tools/props/airway/build_circuit.py -- OUTDIR

One file, three part roots: elbow, y_piece, filter. Each has empties at its port mouths with +Z pointing out of the port
along its axis: `in` (machine side), `out` (patient side); the Y-piece also has `exp` (its `in` is the inspiratory limb).
Convention used: patient side 22 mm male / 15 mm female; machine side 22 mm female (the Y-piece limb ports are 22 mm male,
for the 22 mm female cuffs of the circuit limbs)."""
import bpy, sys, os, math, json
from mathutils import Matrix, Vector
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import kit, specs
from kit import MM

C22, C15 = specs.CONE22, specs.CONE15
S = Matrix.Diagonal((MM, MM, MM, 1))


def to_axis(o, origin, axis):
    """Move a part lathed about +Y (in mm, its mouth at y=0, body toward -y) so its mouth is at origin and +Y points along axis."""
    R = Vector((0, 1, 0)).rotation_difference(Vector(axis).normalized()).to_matrix().to_4x4()
    kit.xform(o, Matrix.Translation(Vector(origin) * MM) @ R @ S); return o


def male22_female15(name, mat, L=19.0, body_r=13.0):
    """Patient-side port: 22 mm male cone outside, 15 mm female bore inside. Mouth at y=0, body toward -y."""
    d_tip = C22['d'] - C22['at'] * C22['taper']                    # 22 mm male: 22.37 at 15 mm back from the tip
    d_base = C22['d'] + (L - C22['at']) * C22['taper']
    f15 = C15['d'] + C15['at'] * C15['taper']                       # 15 mm female mouth
    prof = kit.fillet([(f15 / 2 - 0.1, -L - 2, 0), (f15 / 2 - (L - 1) * C15['taper'] / 2, -L + 1, 0), (f15 / 2, -0.6, 0), (f15 / 2 + 0.5, 0, 0),
                       (d_tip / 2 - 0.5, 0, 0), (d_tip / 2, -0.6, 0), (d_base / 2, -L, 0.3), (body_r, -L - 0.8, 0.6), (body_r, -L - 4, 0)], r=0.3, n=2)
    return kit.lathe(name, prof, seg=56, mat=mat, sharp_deg=45)


def female22(name, mat, L=18.0, wall=1.6, collar=True):
    """Machine-side port: 22 mm female socket. Mouth at y=0, body toward -y."""
    d_m = C22['d'] + C22['at'] * C22['taper']
    ro = d_m / 2 + wall
    pts = [(d_m / 2 - L * C22['taper'] / 2, -L - 2, 0), (d_m / 2 - (L - 1) * C22['taper'] / 2, -L, 0), (d_m / 2, -0.8, 0.2), (d_m / 2 + 0.5, 0, 0), (ro - 0.4, 0, 0), (ro, -0.5, 0.3)]
    if collar: pts += [(ro, -3.0, 0.3), (ro + 0.9, -3.8, 0.3), (ro + 0.9, -7.0, 0.3), (ro, -7.8, 0.3)]
    pts += [(ro, -L - 2, 0)]
    return kit.lathe(name, kit.fillet(pts, r=0.3, n=2), seg=56, mat=mat, sharp_deg=45)


def male22(name, mat, L=21.0, body_r=12.5):
    """A limb port: 22 mm male cone with a hollow 19 mm bore."""
    d_tip = C22['d'] - C22['at'] * C22['taper']; d_base = C22['d'] + (L - C22['at']) * C22['taper']; bore = 18.6
    prof = kit.fillet([(bore / 2, -L - 2, 0), (bore / 2, -0.4, 0), (bore / 2 + 0.6, 0, 0), (d_tip / 2 - 0.5, 0, 0), (d_tip / 2, -0.6, 0), (d_base / 2, -L, 0.3), (body_r, -L - 0.8, 0.5), (body_r, -L - 3, 0)], r=0.3, n=2)
    return kit.lathe(name, prof, seg=56, mat=mat, sharp_deg=45)


def luer_port(name, mat, cap_mat, origin, axis, h=7.5):
    """A female Luer gas-sampling port with its cap on, sticking out along axis from origin (mm)."""
    stem = kit.lathe(name + '_stem', kit.fillet([(1.0, -4, 0), (1.0, h - 0.3, 0), (2.0, h, 0), (3.1, h, 0.3), (3.1, h - 1.2, 0.2), (2.8, h - 1.6, 0), (2.8, 0, 0.6), (4.5, -2, 0)], r=0.25, n=2), seg=24, mat=mat)
    cap = kit.lathe(name + '_cap', kit.fillet([(0, h + 4.2, 0), (3.6, h + 4.2, 0.6), (3.6, h - 2.0, 0.4), (3.0, h - 2.0, 0)], r=0.3, n=2), seg=24, mat=cap_mat, sharp_deg=50)
    for o in (stem, cap): to_axis(o, origin, axis)
    # turn the lathe so its +Y runs along axis: to_axis does the turn; the profile's y is measured from the port base
    return [stem, cap]


def bend(name, mat, r_tube, R_bend, ang, seg=40, nsec=24):
    """A tube bent through `ang` degrees in the XY plane, centerline radius R_bend, starting at the origin along -Y."""
    pts = []
    for k in range(nsec + 1):
        a = math.radians(ang) * k / nsec
        pts.append((R_bend - R_bend * math.cos(a), -R_bend * math.sin(a), 0))
    return kit.sweep(name, [tuple(Vector(p) * MM) for p in pts], radius=r_tube * MM, seg=seg, mat=mat, sharp_deg=None)


def elbow(item, mat, cap_mat):
    """Swivel elbow: machine end (in) 22 mm female along +Y; patient end (out) 22 mm male / 15 mm female along +X."""
    R_b = 17.0; r_t = 12.8
    b = bend('elbow_bend', mat, r_t, R_b, 90)                    # from (0,0) going -Y, curving to +X at (R_b, -R_b)
    kit.xform(b, Matrix.Translation((0, -6 * MM, 0)))
    fin = female22('elbow_in', mat, L=18.0); to_axis(fin, (0, 14.0, 0), (0, 1, 0))
    ring = kit.lathe('elbow_swivel', kit.fillet([(13.4, 0, 0), (14.8, 0.6, 0.5), (14.8, 5.4, 0.5), (13.4, 6, 0)], r=0.4), seg=56, mat=mat); to_axis(ring, (0, -1.5, 0), (0, 1, 0))
    pm = male22_female15('elbow_out', mat, L=19.0, body_r=12.8); to_axis(pm, (R_b + 28.0, -6 - R_b, 0), (1, 0, 0))
    # straight piece from the bend to the patient port
    st = kit.sweep('elbow_st', [((R_b) * MM, (-6 - R_b) * MM, 0), ((R_b + 6) * MM, (-6 - R_b) * MM, 0)], radius=12.8 * MM, seg=40, mat=mat)
    st2 = kit.sweep('elbow_st2', [(0, -6 * MM, 0), (0, 1 * MM, 0)], radius=12.8 * MM, seg=40, mat=mat)
    # the sampling port on the outside of the bend, at 45 degrees
    a = math.radians(45); c = Vector((R_b - R_b * math.cos(a), -6 - R_b * math.sin(a), 0)); outw = Vector((-math.cos(a), math.sin(a), 0)).normalized()
    lp = luer_port('elbow_luer', mat, cap_mat, tuple(c + outw * (r_t - 1.5)), tuple(outw))
    part = item.part('elbow', [b, fin, ring, pm, st, st2] + lp, pivot=(0, 0, 0))
    item.empty('in', at=(0, 14.0 * MM, 0), z=(0, 1, 0), y=(0, 0, 1), parent='elbow')
    item.empty('out', at=((R_b + 28.0) * MM, (-6 - R_b) * MM, 0), z=(1, 0, 0), y=(0, 0, 1), parent='elbow')
    return part


def y_piece(item, mat):
    """Y-piece: patient port (out) along -Y; inspiratory (in) and expiratory (exp) limb ports 22 mm male, 36 degrees apart."""
    half = math.radians(18)
    pm = male22_female15('y_out', mat, L=19.0, body_r=13.0); to_axis(pm, (0, -42.0, 0), (0, -1, 0))
    body = []
    for k, sgn in (('in', -1), ('exp', 1)):
        d = Vector((sgn * math.sin(half), math.cos(half), 0))
        base = Vector((0, -12.0, 0)); mouth = base + d * 46.0
        tube = kit.sweep('y_leg_' + k, [tuple(base * MM), tuple((mouth - d * 21.0) * MM)], radius=12.5 * MM, seg=40, mat=mat)
        port = male22('y_port_' + k, mat, L=21.0, body_r=12.5); to_axis(port, tuple(mouth), tuple(d))
        body += [tube, port]
        item_e = (k, mouth, d)
        body.append(item_e)
    trunk = kit.sweep('y_trunk', [(0, -23 * MM, 0), (0, -6 * MM, 0)], radius=13.0 * MM, seg=40, mat=mat)
    # the septum between the limbs, where the legs meet (a molded web)
    web = kit.box('y_web', (2.0 * MM, 26 * MM, 18 * MM), center=(0, 8 * MM, 0), bevel=0.6 * MM, mat=mat)
    meshes = [o for o in body if not isinstance(o, tuple)] + [pm, trunk, web]
    part = item.part('y_piece', meshes, pivot=(0, 0, 0))
    for k, mouth, d in [o for o in body if isinstance(o, tuple)]:
        item.empty(k, at=tuple(mouth * MM), z=tuple(d), y=(0, 0, 1), parent='y_piece')
    item.empty('out', at=(0, -42.0 * MM, 0), z=(0, -1, 0), y=(0, 0, 1), parent='y_piece')
    return part


def hmef(item, mat, media, foam, cap_mat):
    """Adult HME filter: a clear round housing (two shallow cones), white pleated filter paper and an HME foam disc inside;
    machine side (in, +Y) 22 mm female with a capped Luer sampling port; patient side (out, -Y) 22 mm male / 15 mm female."""
    R, H = 34.0, 24.0                                             # housing radius, half-height of the disc body (mm)
    shell = kit.lathe('hmef_shell', kit.fillet([(13.0, H + 4, 0), (13.0, H, 0.8), (R - 4, 5.0, 3.0), (R, 2.0, 1.5), (R + 0.8, 0.6, 0.4), (R + 0.8, -0.6, 0.4), (R, -2.0, 1.5),
                                                (R - 4, -5.0, 3.0), (13.0, -H, 0.8), (13.0, -H - 4, 0)], r=0.6, n=3), seg=64, mat=mat, sharp_deg=50)
    kit.xform(shell, S)
    inner = kit.lathe('hmef_inner', [(13.0 - 1.2, H + 4), (13.0 - 1.2, H - 1), (R - 5.2, 4.0), (R - 1.4, 0.0), (R - 5.2, -4.0), (13.0 - 1.2, -H + 1), (13.0 - 1.2, -H - 4)], seg=64, mat=mat, flip=True)
    kit.xform(inner, S)
    # pleated filter: a wavy disc (radial pleats) in the mid-plane
    def pleat(u, v):
        a = u * kit.TAU; r = 4.0 + (R - 6.0) * v; z = 2.6 * math.sin(a * 36) * min(1.0, v * 3)
        return (r * math.sin(a) * MM, z * MM, r * math.cos(a) * MM)
    pl = kit.grid('hmef_pleats', pleat, 288, 6, mat=media)
    fm = kit.lathe('hmef_foam', kit.fillet([(0, 9.5, 0), (R - 8.0, 9.5, 1.2), (R - 8.0, 5.0, 1.2), (0, 5.0, 0)], r=1.0, n=2), seg=48, mat=foam, cap0=False)
    kit.xform(fm, S)
    fin = female22('hmef_in', mat, L=17.0, collar=False); to_axis(fin, (0, H + 16.0, 0), (0, 1, 0))
    pm = male22_female15('hmef_out', mat, L=19.0, body_r=13.0); to_axis(pm, (0, -H - 20.0, 0), (0, -1, 0))
    lp = luer_port('hmef_luer', mat, cap_mat, (0, H + 6.0, 11.5), (0, 0.3, 1))
    part = item.part('filter', [shell, inner, fin, pm] + lp, pivot=(0, 0, 0))
    item.part('filter_media', [pl, fm], parent='filter', pivot=(0, 0, 0))
    item.empty('in', at=(0, (H + 16.0) * MM, 0), z=(0, 1, 0), y=(0, 0, 1), parent='filter')
    item.empty('out', at=(0, (-H - 20.0) * MM, 0), z=(0, -1, 0), y=(0, 0, 1), parent='filter')
    return part


def build(outdir):
    kit.reset()
    clear = kit.material('clear_circuit_pp', rgb=(0.95, 0.97, 0.975), rough=0.09, transmission=1.0, ior=1.49)
    cap = kit.material('cap_blue', rgb=(0.08, 0.28, 0.62), rough=0.38)
    media = kit.material('filter_paper', rgb=(0.92, 0.92, 0.89), rough=0.95, double_sided=True)
    foam = kit.material('hme_foam', rgb=(0.85, 0.87, 0.88), rough=0.92)
    item = kit.Item('circuit_parts')
    # three separate roots inside one file: build each under the item root, then spread them out for viewing
    e = elbow(item, clear, cap); y = y_piece(item, clear); f = hmef(item, clear, media, foam, cap)
    e.matrix_basis = Matrix.Translation((-0.09, 0, 0)) @ e.matrix_basis; f.matrix_basis = Matrix.Translation((0.09, 0, 0)) @ f.matrix_basis
    info = {'tris': {k: kit.tris(o) for k, o in item.parts.items() if o.type == 'MESH'}, 'cones': 'ISO 5356-1: 22 mm 22.37 at 15 mm, 15 mm 15.47 at 10 mm, taper 1:40',
            'layout_note': 'the three parts sit side by side in the file (elbow x -0.09, filter x +0.09); each part node is its own pivot'}
    item.export(os.path.join(outdir, 'circuit_parts.raw.glb'), extras={'circuit': json.dumps(info)})
    print('CIRCUIT', info)


if __name__ == '__main__':
    argv = sys.argv[sys.argv.index('--') + 1:]; build(argv[0])
