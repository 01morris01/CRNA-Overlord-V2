"""sb_pose.py: posing and clip tools for the staff figures (Blender 5.x python; imported by build_staff.py).

  Rig        the avatar's skeleton as plain matrices, with its own forward kinematics, so that poses can be built and
             changed without waiting for Blender to re-evaluate anything
  sample     reads a Microsoft Rocketbox clip (an FBX with its own skeleton) frame by frame
  retarget   puts that motion on an avatar. The library's clips are stored against their own rigs' rest poses, which differ
             from the avatars' bind poses, so the curves cannot be copied: each avatar bone takes the WORLD rotation of the
             bone of the same name, bone lengths stay the avatar's own, and the hips follow the source scaled by leg length
             (the same rule as tools/convert_rocketbox.py, which the learner's own character uses)
  arm_ik, hand_frame, curl   authored arm and hand poses: where the wrist is, which way the palm faces, how far the
             fingers close. Used wherever the library has no clip that fits (and for everyone in a sterile gown, whose
             hands must stay in front of the body and above the waist)
  write      turns a list of poses into an action on the avatar"""
import bpy, math
from mathutils import Vector, Matrix, Quaternion

L, R = 'L', 'R'
FINGERS = ('Finger0', 'Finger1', 'Finger2', 'Finger3', 'Finger4')
ARM_BONES = lambda s: [f'Bip01 {s} Clavicle', f'Bip01 {s} UpperArm', f'Bip01 {s} Forearm', f'Bip01 {s} Hand'] + [f'Bip01 {s} {f}{k}' for f in FINGERS for k in ('', '1', '2')]


def _chain(b):
    yield b
    for c in b.children: yield from _chain(c)


class Pose:
    """Local rotations per bone (missing = rest) and the root's local offset."""
    __slots__ = ('q', 'loc')

    def __init__(self, q=None, loc=None):
        self.q = q or {}; self.loc = loc.copy() if loc is not None else Vector((0, 0, 0))

    def copy(self):
        return Pose({k: v.copy() for k, v in self.q.items()}, self.loc)


class Rig:
    def __init__(self, arm):
        self.arm = arm; bones = [b for r in arm.data.bones if r.parent is None for b in _chain(r)]
        self.order = [b.name for b in bones]; self.root = self.order[0]
        self.parent = {b.name: (b.parent.name if b.parent else None) for b in bones}
        self.kids = {b.name: [c.name for c in b.children] for b in bones}
        self.rest = {b.name: b.matrix_local.copy() for b in bones}
        self.rest_inv = {n: m.inverted() for n, m in self.rest.items()}
        self.local = {n: (self.rest_inv[self.parent[n]] @ self.rest[n]) if self.parent[n] else self.rest[n].copy() for n in self.order}
        self.head = {n: self.rest[n].translation.copy() for n in self.order}
        h = self.head; self.leg = (h['Bip01 L Calf'] - h['Bip01 L Thigh']).length + (h['Bip01 L Foot'] - h['Bip01 L Calf']).length
        self.len = {s: ((h[f'Bip01 {s} Forearm'] - h[f'Bip01 {s} UpperArm']).length, (h[f'Bip01 {s} Hand'] - h[f'Bip01 {s} Forearm']).length) for s in (L, R)}

    def descendants(self, n):
        out = []
        for k in self.kids[n]: out.append(k); out += self.descendants(k)
        return out

    # ---- forward kinematics: world (= armature space) matrix of every bone
    def fk(self, pose):
        M = {}
        for n in self.order:
            p = self.parent[n]
            base = (M[p] @ self.local[n]) if p else (self.rest[n] @ Matrix.Translation(pose.loc))
            q = pose.q.get(n); M[n] = base @ q.to_matrix().to_4x4() if q is not None else base
        return M

    def base_rot(self, pose, n, M=None):
        """World rotation the bone would have with no pose rotation of its own."""
        M = M or self.fk(pose); p = self.parent[n]
        return ((M[p] @ self.local[n]) if p else self.rest[n]).to_quaternion()

    def set_world_rot(self, pose, n, q_world, M=None):
        pose.q[n] = self.base_rot(pose, n, M).inverted() @ q_world

    def rotate_world(self, pose, n, q_delta, M=None):
        M = M or self.fk(pose); self.set_world_rot(pose, n, q_delta @ M[n].to_quaternion(), M)

    def aim(self, pose, n, child, direction, M=None):
        """Swing bone n (no added twist) so that the line from its joint to its child's joint points along `direction`."""
        M = M or self.fk(pose); cur = (M[child].translation - M[n].translation).normalized()
        self.rotate_world(pose, n, cur.rotation_difference(Vector(direction).normalized()), M)

    def twist(self, pose, n, child, angle, M=None):
        M = M or self.fk(pose); axis = (M[child].translation - M[n].translation).normalized()
        self.rotate_world(pose, n, Quaternion(axis, angle), M)

    # ---- arms
    def arm_ik(self, pose, s, wrist, pole, palm=None, fingers=None, fore_twist=0.55):
        """Put the wrist of side s at `wrist` (world), the elbow toward `pole` (a world direction); optionally turn the hand
        so that its fingers point along `fingers` and its palm faces `palm`. Part of the hand's turn about the forearm's own
        axis is given to the forearm (there are no twist bones in this skeleton), so the wrist does not wring."""
        ua, fa, ha = f'Bip01 {s} UpperArm', f'Bip01 {s} Forearm', f'Bip01 {s} Hand'; a, b = self.len[s]
        M = self.fk(pose); S = M[ua].translation; W = Vector(wrist); d = W - S; dist = max(abs(a - b) + 1e-4, min(a + b - 1e-4, d.length)); dn = d.normalized()
        x = (a * a - b * b + dist * dist) / (2 * dist); h = math.sqrt(max(0.0, a * a - x * x)); p = Vector(pole); p = p - dn * p.dot(dn)
        p = p.normalized() if p.length > 1e-6 else dn.orthogonal().normalized(); E = S + dn * x + p * h; Wc = S + dn * dist
        self.aim(pose, ua, fa, E - S, M); M = self.fk(pose); self.aim(pose, fa, ha, Wc - M[fa].translation, M)
        if palm is not None and fingers is not None:
            M = self.fk(pose); want = self.hand_rot(s, fingers, palm); axis = (M[ha].translation - M[fa].translation).normalized()
            rel = want @ M[ha].to_quaternion().inverted()                # world rotation still to be made by the hand
            proj = Vector((rel.x, rel.y, rel.z)).dot(axis); tw = Quaternion((rel.w, axis.x * proj, axis.y * proj, axis.z * proj))
            if tw.magnitude > 1e-8:
                tw.normalize(); ang = tw.angle if tw.angle <= math.pi else tw.angle - 2 * math.pi; sign = 1 if Vector(tw.axis).dot(axis) >= 0 else -1
                self.rotate_world(pose, fa, Quaternion(axis, sign * ang * fore_twist), M); M = self.fk(pose)
            self.set_world_rot(pose, ha, want, M)

    def hand_axes(self, s):
        """In the bind pose: (direction of the fingers, direction the palm faces), world."""
        h = self.head; w = h[f'Bip01 {s} Hand']; f = (h[f'Bip01 {s} Finger2'] - w).normalized(); t = (h[f'Bip01 {s} Finger1'] - h[f'Bip01 {s} Finger4']).normalized()
        n = f.cross(t) if s == L else t.cross(f); n = (n - f * n.dot(f)).normalized()
        return f, n

    def hand_rot(self, s, fingers, palm):
        """World rotation of the hand bone that points its fingers along `fingers` with the palm facing `palm`."""
        f0, n0 = self.hand_axes(s); f1 = Vector(fingers).normalized(); n1 = Vector(palm); n1 = (n1 - f1 * n1.dot(f1)).normalized()
        A = Matrix((f0, n0, f0.cross(n0))).transposed(); B = Matrix((f1, n1, f1.cross(n1))).transposed()       # columns are the axes
        return (B @ A.inverted()).to_quaternion() @ self.rest[f'Bip01 {s} Hand'].to_quaternion()

    def curl(self, pose, s, amount, thumb=None, spread=0.0, per=None):
        """Close the fingers of side s: amount 0 = as bound (flat), 1 = a loose fist. `per` overrides single fingers (1..4)."""
        f0, n0 = self.hand_axes(s); side = f0.cross(n0)          # the axis the fingers bend about, in the bind pose
        hand_rest = self.rest[f'Bip01 {s} Hand'].to_quaternion(); ax_local = hand_rest.inverted() @ side; n_local = hand_rest.inverted() @ n0
        for k in (1, 2, 3, 4):
            c = (per or {}).get(k, amount)
            for j, (suffix, share) in enumerate((('', 0.95), ('1', 1.15), ('2', 0.75))):
                n = f'Bip01 {s} Finger{k}{suffix}'; rl = self.rest[n].to_quaternion().inverted() @ hand_rest      # hand space -> this bone's rest space
                q = Quaternion(rl @ ax_local, -c * share * math.radians(78))
                if j == 0 and spread: q = Quaternion(rl @ n_local, spread * (k - 2.5) * math.radians(7) * (1 if s == L else -1)) @ q
                pose.q[n] = q
        t = amount if thumb is None else thumb
        for suffix, share in (('', 0.25), ('1', 0.45), ('2', 0.55)):
            n = f'Bip01 {s} Finger0{suffix}'; rl = self.rest[n].to_quaternion().inverted() @ hand_rest
            pose.q[n] = Quaternion(rl @ ax_local, -t * share * math.radians(60))


# ------------------------------------------------------------------------------------------------ library clips
def sample(path, fps=30):
    """Read one Rocketbox clip. Returns {'frames': [{bone: world matrix}], 'leg': leg length of its rig, 'fps': fps}."""
    scene = bpy.context.scene; bo, ba = set(bpy.data.objects), set(bpy.data.actions)
    bpy.ops.import_scene.fbx(filepath=path); scene.render.fps = fps
    new_o = [o for o in bpy.data.objects if o not in bo]; src = next(o for o in new_o if o.type == 'ARMATURE')
    f0, f1 = (int(round(v)) for v in src.animation_data.action.frame_range); names = [b.name for b in src.data.bones]; frames = []
    for f in range(f0, f1 + 1):
        scene.frame_set(f); bpy.context.view_layer.update(); W = src.matrix_world
        frames.append({n: (W @ src.pose.bones[n].matrix).copy() for n in names})
    r = {b.name: (src.matrix_world @ b.matrix_local).translation for b in src.data.bones}
    leg = (r['Bip01 L Calf'] - r['Bip01 L Thigh']).length + (r['Bip01 L Foot'] - r['Bip01 L Calf']).length
    for o in new_o: bpy.data.objects.remove(o, do_unlink=True)
    for a in [a for a in bpy.data.actions if a not in ba]: bpy.data.actions.remove(a)
    scene.frame_set(1)
    return {'frames': frames, 'leg': leg, 'fps': fps, 'root': names and next(n for n in names if n == 'Bip01 Pelvis' or n == 'Bip01')}


def retarget(rig, clip, in_place=False, first=0, last=None, step=1):
    """The clip on this rig: (list of Pose, meters per second of travel that was taken out)."""
    S = clip['frames'][first:(last + 1 if last is not None else None):step]; k = rig.leg / clip['leg']; root = rig.root
    p0, p1 = S[0][root].translation.copy(), S[-1][root].translation.copy(); travel = Vector((p1.x - p0.x, p1.y - p0.y, 0)); out = []
    for i, fr in enumerate(S):
        pose = Pose(); M = {}
        for n in rig.order:
            p = rig.parent[n]; base = (M[p] @ rig.local[n]) if p else rig.rest[n]; q = Quaternion()
            if n in fr:
                q = base.to_quaternion().inverted() @ fr[n].to_quaternion()
                if p is None:
                    w = fr[n].translation.copy(); t = i / max(1, len(S) - 1)
                    if in_place: w -= travel * t
                    w = Vector((p0.x + (w.x - p0.x) * k, p0.y + (w.y - p0.y) * k, w.z * k)) if in_place else Vector((w.x * k, w.y * k, w.z * k))
                    pose.loc = base.inverted() @ w; base = base @ Matrix.Translation(pose.loc)
            pose.q[n] = q; M[n] = base @ q.to_matrix().to_4x4()
        out.append(pose)
    secs = (len(S) - 1) * step / clip['fps']
    return out, (travel.length * k / secs if secs else 0.0)


def centre(rig, poses, x=0.0, y=0.0):
    """Shift a standing clip so that its hips average over (x, y): figures are placed by their feet."""
    c = Vector((0, 0, 0))
    for p in poses: c += rig.rest[rig.root] @ p.loc
    c /= len(poses); d = rig.rest[rig.root].to_quaternion().inverted() @ Vector((x - c.x, y - c.y, 0))
    for p in poses: p.loc += d


def slerp_pose(a, b, t, names=None):
    out = a.copy()
    for n in (names if names is not None else set(a.q) | set(b.q)):
        qa = a.q.get(n, Quaternion()); qb = b.q.get(n, Quaternion()); out.q[n] = qa.slerp(qb, t)
    if names is None: out.loc = a.loc.lerp(b.loc, t)
    return out


def close_loop(poses, blend):
    """Ease the last `blend` frames toward the first pose, so the clip can repeat without a jump."""
    n = len(poses)
    for j in range(max(1, n - blend), n):
        t = (j - (n - blend) + 1) / blend; t = t * t * (3 - 2 * t); poses[j] = slerp_pose(poses[j], poses[0], t)
    return poses


def smooth(v):
    v = max(0.0, min(1.0, v)); return v * v * (3 - 2 * v)


# ------------------------------------------------------------------------------------------------ feet on the floor
class Feet:
    """The vertices that touch the ground, so that a clip can be set down on z = 0 frame by frame."""

    def __init__(self, rig, meshes):
        self.rig = rig; self.v = []
        for mesh in meshes:
            names = [g.name for g in mesh.vertex_groups]
            for v in mesh.data.vertices:
                ws = [(names[g.group], g.weight) for g in v.groups if g.weight > 1e-3]
                if sum(w for n, w in ws if 'Foot' in n or 'Toe' in n) > 0.5:
                    tot = sum(w for _, w in ws); self.v.append((v.co.copy(), [(n, w / tot) for n, w in ws if n in rig.rest]))

    def lowest(self, pose):
        M = self.rig.fk(pose); D = {}; lo = 1e9
        for co, ws in self.v:
            z = 0.0
            for n, w in ws:
                d = D.get(n)
                if d is None: d = D[n] = M[n] @ self.rig.rest_inv[n]
                z += w * (d @ co).z
            lo = min(lo, z)
        return lo

    def ground(self, poses, each_frame=True):
        up = self.rig.rest[self.rig.root].to_quaternion().inverted() @ Vector((0, 0, 1)); lows = [self.lowest(p) for p in poses]
        if not each_frame: lows = [min(lows)] * len(poses)
        else:      # follow the floor, but smoothly: no single frame may jerk the whole body
            for _ in range(2): lows = [(lows[max(0, i - 1)] + 2 * lows[i] + lows[min(len(lows) - 1, i + 1)]) / 4 for i in range(len(lows))]
        for p, lo in zip(poses, lows): p.loc -= up * lo
        return poses


# ------------------------------------------------------------------------------------------------ writing actions
def write(arm, rig, name, poses, fps=30):
    """A new action on the armature from a list of poses, one per frame. Returns (action, seconds)."""
    if not arm.animation_data: arm.animation_data_create()
    act = bpy.data.actions.new(name); arm.animation_data.action = act; prev = {}
    for pb in arm.pose.bones: pb.rotation_mode = 'QUATERNION'
    for i, pose in enumerate(poses):
        for n in rig.order:
            pb = arm.pose.bones[n]; q = pose.q.get(n, Quaternion()).copy()
            if n in prev and q.dot(prev[n]) < 0: q.negate()
            prev[n] = q; pb.rotation_quaternion = q; pb.keyframe_insert('rotation_quaternion', frame=i + 1)
            if n == rig.root: pb.location = pose.loc; pb.keyframe_insert('location', frame=i + 1)
    act.use_fake_user = True
    return act, (len(poses) - 1) / fps


def apply(arm, rig, pose):
    """Show one pose on the armature (for renders and for draping)."""
    for n in rig.order:
        pb = arm.pose.bones[n]; pb.rotation_mode = 'QUATERNION'; pb.rotation_quaternion = pose.q.get(n, Quaternion()); pb.location = pose.loc if n == rig.root else Vector((0, 0, 0))
    bpy.context.view_layer.update()


def use_action(arm, act):
    arm.animation_data.action = act
    if act is not None and getattr(act, 'slots', None): arm.animation_data.action_slot = act.slots[0]
