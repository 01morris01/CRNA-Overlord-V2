"""p25_14_landmarks.py: evaluate the landmark points of the hero patient in the rest pose and in every clip (with that
clip's press shape on), in the delivered glTF frame, plus the bone each one rides on and its normal; also the head
seam, head/neck/jaw bone rest transforms, eye centres and incisor points for a replacement head, and measurements on
the final rest mesh (neck circumference at the cricoid level, volume, lengths, worst contact numbers).
   Blender -b --factory-startup --python tools/people/hero/p25_14_landmarks.py"""
import bpy, os, sys, json, math
sys.dont_write_bytecode = True
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from mathutils import Vector
import hero_lib as H
import pose_lib as PL

WORK = H.patient_work('p25')
BLEND = os.path.join(H.HERO, 'p25', 'blend')
log = H.Log('landmarks')
bpy.ops.wm.open_mainfile(filepath=os.path.join(BLEND, 'p25_final.blend'))
scene = bpy.context.scene
arm = bpy.data.objects['rig']
LMV = json.load(open(os.path.join(WORK, 'landmark_verts.json')))
G = lambda p: [float(p[0]), float(p[2]), float(-p[1])]                  # lying (Blender) -> patient (glTF)
FIG = [o for o in bpy.data.objects if o.type == 'MESH' and o.parent == arm]


def set_pose(name):
    arm.animation_data.action = bpy.data.actions[name]; scene.frame_set(1)
    for o in FIG:
        if o.data.shape_keys:
            for k in o.data.shape_keys.key_blocks[1:]:
                k.value = 1.0 if k.name == 'press_' + name else 0.0
    bpy.context.view_layer.update()


def dominant_bone(o, vi):
    gn = {g.index: g.name for g in o.vertex_groups}
    best = max(((g.weight, gn[g.group]) for g in o.data.vertices[vi].groups if gn[g.group] in arm.data.bones), default=(0, 'head'))
    return best[1]


OUT = {}
for pose in ('flat', 'ramped', 'lateral_left'):
    set_pose(pose)
    cache = {o.name: (PL.evaluated(o), H.vertex_normals(PL.evaluated(o), H.quads_of(o))) for o in FIG if o.name in ('skin_head', 'skin_body')}
    for name, d in LMV.items():
        rec = OUT.setdefault(name, {'note': d.get('note', '')})
        if 'point' in d:                                              # eye: cornea apex, rides on the eye bone
            pb = arm.pose.bones[d['bone']]; b = arm.data.bones[d['bone']]
            local = np.linalg.inv(np.array(b.matrix_local)) @ np.r_[d['point'], 1.0]
            p = np.array(pb.matrix) @ local
            pts = [p[:3]]; nrm = (np.array(pb.matrix)[:3, :3] @ (np.linalg.inv(np.array(b.matrix_local))[:3, :3] @ np.array([0, 0, 1.0])))
            rec['bone'] = d['bone']
        else:
            pts = []; ns = []
            for oname, vi in d['points']:
                V, N = cache[oname]; pts.append(V[vi]); ns.append(N[vi])
                if 'bone' not in rec:
                    rec['bone'] = dominant_bone(bpy.data.objects[oname], vi)
                    rec['vertices'] = d['points']
            nrm = np.mean(ns, 0)
        p = np.mean(pts, 0); nrm = nrm / max(np.linalg.norm(nrm), 1e-9)
        rec.setdefault('poses', {})[pose] = dict(position=G(p), normal=G(nrm))
# bone rest frames (glTF frame) for the replacement head
set_pose('flat')
BONES = {}
for n in ('root', 'spine01', 'neck01', 'neck02', 'neck03', 'head', 'jaw', 'eye.L', 'eye.R'):
    b = arm.data.bones[n]
    M = np.array(b.matrix_local)
    BONES[n] = dict(head=G(b.head_local), tail=G(b.tail_local), x_axis=G(M[:3, 0]), y_axis=G(M[:3, 1]), z_axis=G(M[:3, 2]),
                    note='Blender bone frame written in glTF axes (y_axis runs head to tail); the GLB joint nodes hold the same rest transforms')
RJ = json.load(open(os.path.join(WORK, 'rest.json')))
MJ = json.load(open(os.path.join(WORK, 'morphs.json')))
seam = dict(vertices=[G(p) for p in RJ['seam']['vertices']], plane_point=G(RJ['seam']['plane_point']), plane_normal=G(RJ['seam']['plane_normal']),
            above_sternal_notch_mm=RJ['seam']['above_sternal_notch_mm'], count=RJ['seam']['count'])
# measurements on the delivered rest mesh
SH, SB = bpy.data.objects['skin_head'], bpy.data.objects['skin_body']
VH, VB = PL.evaluated(SH), PL.evaluated(SB)
QH, QB = H.quads_of(SH), H.quads_of(SB)
V = np.vstack([VH, VB]); Q = np.vstack([QH, QB + len(VH)])
F = json.load(open(os.path.join(WORK, 'form.json')))
# neck at the cricoid level, measured again on the delivered rest mesh at the level used standing
notch = np.array(RJ['seam']['sternal_notch'])
n01, hd = np.array(arm.data.bones['neck01'].head_local), np.array(arm.data.bones['head'].head_local)
ax = (hd - n01) / np.linalg.norm(hd - n01)
PJ = json.load(open(os.path.join(WORK, 'poses.json')))['landmarks_used']
chin = VH[PJ['pogonion'][1]]
t = float(F['neck_level_above_notch_m']); lvl = notch + ax * t                     # the same anatomical level as measured standing
centre = n01 + ax * np.dot(lvl - n01, ax)
circ, pts = H.tape_circumference(V, Q, lvl, ax, keep_near=centre, radius=0.14)
# incisor points in the rest pose: lower incisal edge (most cranial lower-incisor point at the midline front), upper ridge
# crest (most caudal point of the edentulous ridge at the midline front), jaw hinge (jaw bone head)
TL = PL.evaluated(bpy.data.objects['teeth_lower']); GM = bpy.data.objects['gums']; GV_ = PL.evaluated(GM)
wj = PL.group_w(GM, {'jaw'})
front_t = TL[np.abs(TL[:, 0]) < 0.006]; inc = front_t[np.argmax(front_t[:, 1] + 0.3 * front_t[:, 2])]
up = GV_[(wj < 0.5) & (np.abs(GV_[:, 0]) < 0.006)]; crest = up[np.argmin(up[:, 1] - 0.3 * up[:, 2])]
INC = dict(lower_incisal_edge=G(inc), upper_ridge_crest=G(crest), jaw_hinge=G(arm.data.bones['jaw'].head_local), rest_gap_mm=float(np.linalg.norm(inc - crest) * 1000))
# lengths and the open mouth
lying_len = float(V[:, 1].max() - V[:, 1].min())
MEAS = dict(height_chart_m=1.78, standing_height_m=1.78, lying_length_m=lying_len, volume_standing_m3=F['volume_m3'], weight_kg_at_1010=F['weight_at_1010'],
            weight_kg_fat_corrected=F['weight_at_tissue_density'], tissue_density_kg_m3=F['tissue_density'], lung_air_l=F['lung_air_m3'] * 1000,
            volume_rest_pose_m3=abs(H.volume(VB, QB)) + abs(H.volume(VH, QH)), neck_circumference_standing_m=F['neck_circumference_m'],
            neck_circumference_rest_m=circ, neck_level_above_notch_m=float(t), interincisal_jawOpen1_mm=MJ['gap_open_mm'], interincisal_rest_mm=MJ['gap_rest_mm'],
            jaw_open_degrees=MJ['theta_deg'])
H.save_json(os.path.join(WORK, 'landmarks_world.json'), dict(landmarks=OUT, bones=BONES, seam=seam, measurements=MEAS,
            eye_centres=dict(L=G(arm.data.bones['eye.L'].head_local), R=G(arm.data.bones['eye.R'].head_local)),
            incisors=INC))
log(f'neck circumference on the delivered rest mesh: {circ * 100:.1f} cm at {t * 100:.1f} cm above the notch; lying length {lying_len:.3f} m; {len(OUT)} landmarks x 3 poses')
