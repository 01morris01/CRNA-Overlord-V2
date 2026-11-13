"""sb_dress.py: surgical dress built onto a Microsoft Rocketbox body (Blender 5.x python; imported by build_staff.py).

The Rocketbox library has scrubs, a tied cap and a tied mask (Medical_Male_04 and _05) but no sterile gown and no gloves.
This module makes those two, on whichever body it is given:

  gown    A blank is grown around the body (convex shells around the trunk-and-legs and around each arm, joined and re-meshed
          to an even surface), opened at the neck, the wrists and below the hem, then DRAPED with Blender's cloth solver
          against the body, with the neckline and the ends of the sleeves held. The folds are the solver's, not a pattern.
          It is then cut level at mid-calf, given turned edges, shaded (occlusion in the vertex colors), and skinned from
          the body underneath with the skirt shared between the two legs.
  gloves  The body's own hands, lifted a fraction of a millimetre and carried up the forearm over the end of the sleeve,
          with a rolled edge. Same skinning as the hands, so the fingers work.

Nothing here is a recolour of the body, and nothing is assembled from boxes or cylinders. It is still script-built
clothing on a library body, and the manifest says so."""
import bpy, bmesh, math, random
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree
from sb_common import bone_head, world_verts

L, R = 'L', 'R'


def weights_of(mesh):
    names = [g.name for g in mesh.vertex_groups]
    return [{names[g.group]: g.weight for g in v.groups if g.weight > 1e-4} for v in mesh.data.vertices]


def dominant(w):
    return max(w, key=w.get) if w else ''


def landmarks(arm):
    """Joint positions and a few derived heights, all in world meters (rest pose)."""
    b = lambda n: bone_head(arm, n)
    lm = {'neck': b('Bip01 Neck'), 'head': b('Bip01 Head'), 'pelvis': b('Bip01 Pelvis')}
    for s in (L, R):
        lm['shoulder' + s] = b(f'Bip01 {s} UpperArm'); lm['elbow' + s] = b(f'Bip01 {s} Forearm'); lm['wrist' + s] = b(f'Bip01 {s} Hand')
        lm['hip' + s] = b(f'Bip01 {s} Thigh'); lm['knee' + s] = b(f'Bip01 {s} Calf'); lm['ankle' + s] = b(f'Bip01 {s} Foot')
    knee = (lm['kneeL'].z + lm['kneeR'].z) / 2; ankle = (lm['ankleL'].z + lm['ankleR'].z) / 2
    lm['z_hem'] = knee - 0.45 * (knee - ankle)          # mid-calf
    lm['z_armpit'] = (lm['shoulderL'].z + lm['shoulderR'].z) / 2 - 0.10
    return lm


def body_bvh(body, faces=None):
    """BVH of the body's rest surface (optionally only some faces). Returns (bvh, verts)."""
    vs = [v.co.copy() for v in body.data.vertices]
    polys = [tuple(p.vertices) for p in body.data.polygons if faces is None or p.index in faces]
    return BVHTree.FromPolygons(vs, polys), vs


def _hull(points, inflate, name):
    bm = bmesh.new()
    for p in points: bm.verts.new(p)
    r = bmesh.ops.convex_hull(bm, input=bm.verts)
    junk = list({e for e in r['geom_interior'] + r['geom_unused'] if isinstance(e, bmesh.types.BMVert)})
    bmesh.ops.delete(bm, geom=junk, context='VERTS')
    bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
    bm.normal_update(); bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.normal_update()
    for v in bm.verts: v.co += v.normal * inflate
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    return me


def gown_blank(arm, body, lm, ease_body=0.034, ease_arm=0.026, voxel=0.013, extra_len=0.10, skip_parts=('kit', 'hair')):
    """The undraped gown: one even, closed-then-opened surface standing clear of the body. Returns the object."""
    W = weights_of(body); co = [v.co.copy() for v in body.data.vertices]
    skip = {i for i, m in enumerate(body.data.materials) if m and m.get('part') in skip_parts}; keep = set()
    for p in body.data.polygons:
        if p.material_index not in skip: keep.update(p.vertices)
    z_low = lm['z_hem'] - extra_len; z_top = lm['neck'].z + 0.055
    trunk = {'Bip01 Pelvis', 'Bip01 Spine', 'Bip01 Spine1', 'Bip01 Spine2', 'Bip01 Neck', 'Bip01 Head', 'Bip01 L Clavicle', 'Bip01 R Clavicle', 'Bip01 L Thigh', 'Bip01 R Thigh', 'Bip01 L Calf', 'Bip01 R Calf'}
    bell = []
    for i in keep:
        d = dominant(W[i]); p = co[i]
        if d in trunk and z_low <= p.z <= z_top:
            bell.append(p)
            if p.z < lm['z_armpit'] and 'Calf' not in d: bell.append(Vector((p.x, p.y, z_low)))     # cloth hangs straight down from whatever holds it out
    parts = [_hull(bell, ease_body, 'bell')]
    for s in (L, R):
        axis = (lm['wrist' + s] - lm['elbow' + s]).normalized()
        up = [co[i] for i in keep if dominant(W[i]) == f'Bip01 {s} UpperArm']
        fo = [co[i] for i in keep if dominant(W[i]) == f'Bip01 {s} Forearm' or (dominant(W[i]) == f'Bip01 {s} Hand' and (co[i] - lm['wrist' + s]).dot(axis) < 0.02)]
        parts += [_hull(up, ease_arm, 'upper' + s), _hull(fo, ease_arm, 'fore' + s)]
    bm = bmesh.new()
    for me in parts: bm.from_mesh(me); bpy.data.meshes.remove(me)
    me = bpy.data.meshes.new('gown'); bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new('gown', me); bpy.context.scene.collection.objects.link(ob)
    md = ob.modifiers.new('remesh', 'REMESH'); md.mode = 'VOXEL'; md.voxel_size = voxel; md.adaptivity = 0
    bpy.context.view_layer.objects.active = ob; bpy.ops.object.select_all(action='DESELECT'); ob.select_set(True); bpy.ops.object.modifier_apply(modifier='remesh')
    bm = bmesh.new(); bm.from_mesh(me)
    for _ in range(8): bmesh.ops.smooth_vert(bm, verts=bm.verts, factor=0.5, use_axis_x=True, use_axis_y=True, use_axis_z=True)
    # ---- openings: below the hem, past each wrist, above the neckline
    bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=Vector((0, 0, z_low)), plane_no=Vector((0, 0, -1)), clear_outer=True)
    for s in (L, R):
        axis = (lm['wrist' + s] - lm['elbow' + s]).normalized(); at = lm['wrist' + s] + axis * 0.012
        near = lambda p: (p - lm['elbow' + s]).dot(axis) > 0.08 and ((p - lm['elbow' + s]) - axis * (p - lm['elbow' + s]).dot(axis)).length < 0.16
        vs = [v for v in bm.verts if near(v.co)]; es = [e for e in bm.edges if all(v in vs for v in e.verts)]; fs = [f for f in bm.faces if all(v in vs for v in f.verts)]
        bmesh.ops.bisect_plane(bm, geom=vs + es + fs, plane_co=at, plane_no=axis, clear_outer=False)
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if near(v.co) and (v.co - at).dot(axis) > 1e-5], context='VERTS')
    n_no = Vector((0, 0.30, 1)).normalized(); n_at = lm['neck'] + Vector((0, 0, 0.012))       # the neckline sits lower in front than behind
    top = [v for v in bm.verts if v.co.z > lm['neck'].z - 0.12 and abs(v.co.x) < 0.16]; es = [e for e in bm.edges if all(v in top for v in e.verts)]; fs = [f for f in bm.faces if all(v in top for v in f.verts)]
    bmesh.ops.bisect_plane(bm, geom=top + es + fs, plane_co=n_at, plane_no=n_no, clear_outer=False)
    bmesh.ops.delete(bm, geom=[v for v in bm.verts if v.co.z > lm['neck'].z - 0.12 and abs(v.co.x) < 0.16 and (v.co - n_at).dot(n_no) > 1e-5], context='VERTS')
    bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
    bmesh.ops.triangulate(bm, faces=bm.faces, quad_method='BEAUTY')
    bm.to_mesh(me); bm.free(); me.update()
    ob['z_low'] = z_low
    return ob


def classify(gown, lm):
    """For every gown vertex: ('arm', side, s) with s meters from the wrist end going up the arm, or ('trunk', None, 0)."""
    out = []
    for v in gown.data.vertices:
        p = v.co; best = ('trunk', None, 0.0)
        for s in (L, R):
            sh, el, wr = lm['shoulder' + s], lm['elbow' + s], lm['wrist' + s]; sx = 1 if s == L else -1
            if p.x * sx < sh.x * sx - 0.035: continue
            # distance to the two-segment arm line, and how far along it
            dmin = 1e9; along = 0
            for a, b_, base in ((sh, el, (wr - el).length), (el, wr, 0.0)):
                ab = b_ - a; t = max(0, min(1, (p - a).dot(ab) / ab.length_squared)); d = (p - (a + ab * t)).length
                if d < dmin: dmin = d; along = base + (1 - t) * ab.length
            if dmin < 0.13: best = ('arm', s, along)
        out.append(best)
    return out


def pre_shape(gown, body, lm, cuff_len=0.07, cuff_clear=0.0035, neck_clear=0.006):
    """Draw the ends of the sleeves in to the wrists (where the gloves go over them) and the neckline in to the neck.
    Returns the pin weights per vertex."""
    bvh, _ = body_bvh(body); cls = classify(gown, lm); me = gown.data; pin = [0.0] * len(me.vertices)
    bm = bmesh.new(); bm.from_mesh(me); bm.verts.ensure_lookup_table()
    n_no = Vector((0, 0.30, 1)).normalized(); n_at = lm['neck'] + Vector((0, 0, 0.012))
    for v in bm.verts:
        kind, s, along = cls[v.index]
        if kind == 'arm' and along < cuff_len + 0.05:
            hit = bvh.find_nearest(v.co)
            if hit[0] is None: continue
            t = 1 - min(1, max(0, (along - cuff_len) / 0.05)); t = t * t * (3 - 2 * t)
            target = hit[0] + (v.co - hit[0]).normalized() * cuff_clear
            v.co = v.co.lerp(target, t); pin[v.index] = 1.0 if along < cuff_len else 0.0
        elif kind == 'trunk':
            d = -(v.co - n_at).dot(n_no)            # meters below the neckline plane
            if d < 0.05 and v.co.z > lm['neck'].z - 0.14 and abs(v.co.x) < 0.17:
                hit = bvh.find_nearest(v.co)
                if hit[0] is None: continue
                t = 1 - min(1, max(0, d / 0.05)); t = t * t * (3 - 2 * t)
                target = hit[0] + (v.co - hit[0]).normalized() * neck_clear
                v.co = v.co.lerp(target, t * 0.9); pin[v.index] = 1.0 if d < 0.014 else 0.0
    bm.to_mesh(me); bm.free(); me.update()
    return pin, cls


def drape(gown, body, pin, frames=70, expand=0.06, quality=10, bending=1.2, log=print):
    """Run the cloth solver: the gown falls onto the body and settles. The result replaces the gown's shape."""
    scene = bpy.context.scene; g = gown.vertex_groups.new(name='pin')
    for i, w in enumerate(pin):
        if w > 0: g.add([i], w, 'REPLACE')
    col = body.modifiers.new('collide', 'COLLISION'); body.collision.thickness_outer = 0.004; body.collision.thickness_inner = 0.012; body.collision.cloth_friction = 12; body.collision.damping = 0.6
    md = gown.modifiers.new('cloth', 'CLOTH'); st = md.settings; cs = md.collision_settings
    st.quality = quality; st.mass = 0.18; st.air_damping = 1.2; st.time_scale = 1.0
    st.tension_stiffness = 22; st.compression_stiffness = 22; st.shear_stiffness = 10; st.bending_stiffness = bending
    st.tension_damping = 8; st.compression_damping = 8; st.shear_damping = 6; st.bending_damping = 0.8
    st.vertex_group_mass = 'pin'; st.pin_stiffness = 1.0; st.shrink_min = -expand
    cs.use_collision = True; cs.distance_min = 0.005; cs.collision_quality = 4; cs.use_self_collision = True; cs.self_distance_min = 0.005; cs.self_friction = 8
    md.point_cache.frame_start = 1; md.point_cache.frame_end = frames
    scene.frame_start = 1; scene.frame_end = frames
    for f in range(1, frames + 1):
        scene.frame_set(f)
        if f % 10 == 0: log(f'  drape frame {f}/{frames}')
    co = [v.co.copy() for v in gown.evaluated_get(bpy.context.evaluated_depsgraph_get()).data.vertices]
    gown.modifiers.remove(md); body.modifiers.remove(col)
    for v, c in zip(gown.data.vertices, co): v.co = c
    gown.data.update(); scene.frame_set(1)
    return gown
