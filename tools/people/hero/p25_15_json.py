"""p25_15_json.py: write assets/people/hero/p25.json from the delivered GLBs and the build's measurements.   python3 p25_15_json.py
Landmarks: each has the joint it rides on (MakeHuman bone name = glTF joint node name), the point's offset in that
joint's own frame (rest pose, metres) and the normal there, so the runtime gets it with jointWorld * offset in any pose;
plus the exact point and normal in each clip (with that clip's press shape on), for checking."""
import os, sys, json, math
sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import numpy as np
import glb_io as G

PEOPLE = os.path.expanduser('~/Developer/overlord-asset-sources/people')
WORK = os.path.join(PEOPLE, 'hero', 'p25', 'work')
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
OUTD = os.path.join(REPO, 'assets', 'people', 'hero')
LW = json.load(open(os.path.join(WORK, 'landmarks_world.json')))
J = lambda n: json.load(open(os.path.join(WORK, n)))


def glb_summary(path):
    js, binb = G.read(path)
    tris, morph = {}, {}
    for m in js['meshes']:
        t = 0
        for p in m['primitives']:
            t += js['accessors'][p['indices']]['count'] // 3 if 'indices' in p else js['accessors'][p['attributes']['POSITION']]['count'] // 3
        tris[m['name']] = t; morph[m['name']] = m.get('extras', {}).get('targetNames', [])
    imgs = []
    for im in js.get('images', []):
        bv = js['bufferViews'][im['bufferView']]
        imgs.append(dict(name=im.get('name'), mime=im.get('mimeType'), bytes=bv['byteLength']))
    figure = sum(t for n, t in tris.items() if '__' not in n)
    return js, binb, dict(bytes=os.path.getsize(path), triangles_total=sum(tris.values()), triangles_figure=figure, triangles_by_mesh=tris,
                          morph_targets_by_mesh={k: v for k, v in morph.items() if v}, images=imgs, animations=[a['name'] for a in js.get('animations', [])])


js, binb, HERO = glb_summary(os.path.join(OUTD, 'p25.glb'))
_, _, LOD1 = glb_summary(os.path.join(OUTD, 'p25_lod1.glb'))
names = {n.get('name'): i for i, n in enumerate(js['nodes'])}
Wrest = G.world_matrices(js)
Wpose = {p: G.world_matrices(js, G.clip_overrides(js, binb, p)) for p in HERO['animations']}
LM = {}
for name, rec in LW['landmarks'].items():
    bone = rec['bone']; ji = names[bone]
    Wr = Wrest[ji]
    p = np.array(rec['poses']['flat']['position']); n = np.array(rec['poses']['flat']['normal'])
    off = np.linalg.inv(Wr) @ np.r_[p, 1.0]
    nl = np.linalg.inv(Wr[:3, :3]) @ n; nl /= np.linalg.norm(nl)
    out = dict(bone=bone, offset=[round(float(x), 5) for x in off[:3]], normal=[round(float(x), 4) for x in nl], note=rec.get('note', ''), poses={})
    for pose, pr in rec['poses'].items():
        exact = np.array(pr['position'])
        rigid = (Wpose[pose][ji] @ off)[:3]
        out['poses'][pose] = dict(position=[round(float(x), 4) for x in exact], normal=[round(float(x), 4) for x in pr['normal']],
                                  rigid_error_mm=round(float(np.linalg.norm(rigid - exact) * 1000), 1))
    LM[name] = out
F = J('form.json'); M = LW['measurements']; C = J('checks.json'); CT = J('contact.json'); PO = J('poses.json')['info']; RJ = J('rest.json')
ID = json.load(open(os.path.join(HERE, 'p25_identity.json')))
doc = {
    'id': 'p25', 'name': 'Dale Swinford (fictional)', 'stage': 1,
    'frame': 'glTF: +Y up, metres; origin = middle of the endoscopy stretcher\'s mattress-top surface; head toward -Z; lying on his back face +Y in the rest pose, so his left is +X',
    'stretcher': dict(J('stretcher/stretcher.json'), note='measured from assets/level/clinical.glb (eq_stretcher_flat in the endoscopy suite); mattress top is y 0'),
    'files': {'p25.glb': HERO, 'p25_lod1.glb': LOD1},
    'clips': {'flat': 'rest pose: on his back, head on a pillow, arms at the sides resting on the flanks (the trunk is wider than the mattress allows arms beside it)',
              'ramped': dict(PO['ramped'], note='trunk raised 27 deg at the lumbar spine; ear canal level with the sternal notch, face plane horizontal; ramp and head rest built to fit'),
              'lateral_left': dict(PO['lateral_left'], note='hip flexion limited to what the 0.576 m mattress holds; knees 92/97 deg; knee pillow 85 mm'),
              'how_to_blend': 'crossfade the clips; set press_<clip> on skin_body and gown to that clip\'s weight (flat has no press shape: it is the rest)'},
    'heights': dict(chart_cm=178, standing_m=M['standing_height_m'], lying_length_m=round(M['lying_length_m'], 3)),
    'weight': dict(chart_kg=139.4, mesh_volume_standing_m3=round(M['volume_standing_m3'], 5), weight_at_1010_kg_m3=round(M['weight_kg_at_1010'], 1),
                   weight_fat_corrected_kg=round(M['weight_kg_fat_corrected'], 1), tissue_density_kg_m3=round(M['tissue_density_kg_m3'], 1), lung_air_l=M['lung_air_l'],
                   how='volume sized so that 139.4 kg of tissue at 1006 kg/m3 (Siri, 42 % fat: fat 0.90, lean 1.10 g/cm3) plus 2.0 L of lung air at FRC fill it; at the 1010 kg/m3 used for the other patients the same volume reads 142.0 kg',
                   rest_pose_volume_m3=round(M['volume_rest_pose_m3'], 5), rest_pose_note='posing and contact lost 3.7 % before a 3.4 mm even swelling of the soft parts restored it'),
    'neck': dict(circumference_cm=round(M['neck_circumference_standing_m'] * 100, 1), level='cricoid: 2.3 cm above the sternal notch along the neck axis (40 % of notch to chin), measured standing as clinically, tape round the convex outline',
                 lying_note='lying on the pillow the short neck sinks into the shoulders and a plane at that level also cuts the trapezius, so it is not re-measured lying'),
    'mouth': dict(interincisal_at_jawOpen_1_mm=round(M['interincisal_jawOpen1_mm'], 1), rest_gap_mm=round(LW['incisors']['rest_gap_mm'], 1),
                  measured_between='crest of the edentulous upper ridge (dentures out) and the lower central incisal edges', jaw_rotation_deg=round(M['jaw_open_degrees'], 1),
                  jaw_bone_note='use the morph or the jaw bone, not both; jawOpen 1 equals a jaw-bone rotation of about %.0f degrees plus the condylar slide built into the morph' % M['jaw_open_degrees'],
                  dentition='upper complete denture removed: edentulous upper ridge; natural lower teeth (third molars absent); tonsils absent (tonsillectomy 1986); larynx not modeled',
                  mallampati='III intended: tongue enlarged and raised; check the laryngoscopist picture'),
    'morphs': dict(clinical=['jawOpen', 'lipsPart', 'jawThrust', 'cheekPuff', 'eyesClosed', 'blink', 'breathe'], pose_press=['press_ramped', 'press_lateral_left'],
                   arkit_on='skin_head (52 names exactly as ARKit; jawOpen and cheekPuff are both clinical and ARKit names)',
                   by_mesh=HERO['morph_targets_by_mesh']),
    'materials': {'skin_head / skin_body': 'baseColor, normal, packed map as occlusion (R) and metallicRoughness (G roughness; metallicFactor 0); B = thickness for the app\'s skin shader; extras.detailNormalImage names the tiling pore normal image (skin_detail_normal, 36 mm per tile)',
                  'cornea, eye_wet, eye_occlusion': 'alpha blended; draw after the eyes', 'hair, brows, lashes': 'alpha masked at 0.3 (alpha to coverage helps)'},
    'replacement_head': dict(seam=LW['seam'], bones=LW['bones'], eye_centres=LW['eye_centres'], incisors=LW['incisors'],
                             how='skin_head and skin_body meet only at the seam loop (same positions, normals set from the joined skin). A head made elsewhere (e.g. MetaHuman exported through Blender) can be aligned with the seam loop, eye centres and incisor points, skinned to neck01..03, head and jaw, and must provide the same face morph names.'),
    'arkit_review': {'how': 'each of the 52 at weight 1 alone, flat pose, three.js r170 (review sheet p25_three_07_arkit_52.jpg)',
                     'look_wrong': {
                         'eyeLookUp/Down/In/Out (8)': 'only the lids move a little; the eyeballs do not turn with morphs: turn the eye.L / eye.R bones with them',
                         'eyeBlinkLeft, eyeBlinkRight (and eyesClosed, blink)': 'the upper lid stops 2 to 4 mm short of the lower one: a dark slit stays (MakeHuman units were made for a smaller eyeball; a 1.45x lid-travel fix opened holes and was not kept)',
                         'mouthClose': 'alone it pushes the lips through each other (a dark hole at the lower lip); ARKit uses it only together with jawOpen',
                         'tongueOut': 'alone the tongue passes through the closed lips; use it with jawOpen',
                         'mouthFunnel, mouthPucker, mouthRollLower, mouthLeft, mouthRight, mouthLowerDownLeft/Right, mouthPressLeft/Right, mouthSmileLeft, mouthStretchLeft': 'small dark slits at the lower lip or corners: the lip lining is open to the mouth where MakeHuman\'s mouth bag was cut out',
                         'brow*, cheekSquint*, eyeSquint*, eyeWide*, noseSneer*, mouthShrug*, mouthDimple*': 'small amplitude on this heavy face; read as subtle rather than wrong'},
                     'look_right': ['jawOpen', 'jawForward', 'jawLeft', 'jawRight', 'cheekPuff', 'mouthUpperUpLeft', 'mouthUpperUpRight', 'mouthRollUpper', 'mouthFrownLeft', 'mouthFrownRight'],
                     'byte_cost': 'the 50 ARKit-only shapes are 8.69 MB of the raw export (sparse float positions and normals); the clinical and press shapes 3.59 MB; the compressed hero file is 19.1 MB in all'},
    'landmarks': LM,
    'contact_checks_mm': C,
    'supports': CT,
    'identity': ID,
    'notes': ['Stage 1 of 2: hair is MakeHuman\'s culturalibre_hair_02 polygon hair (strand cards come in Stage 2); ears and hands are MakeHuman\'s, not wrapped to the sculpt.',
              'Dentures: the chart conflicts (airway exam "Dentures, remove before sedation"; nursing checklist "Dentures: None"); modeled with the upper complete denture out (see SOURCES.md).']}
json.dump(doc, open(os.path.join(OUTD, 'p25.json'), 'w'), indent=1)
print('WROTE', os.path.join(OUTD, 'p25.json'), os.path.getsize(os.path.join(OUTD, 'p25.json')), 'bytes')
print('hero figure triangles', HERO['triangles_figure'], 'total', HERO['triangles_total'], 'bytes', HERO['bytes'])
print('lod1 figure triangles', LOD1['triangles_figure'], 'bytes', LOD1['bytes'])
print('landmark rigid errors (mm) worst per pose:', {p: max(v['poses'][p]['rigid_error_mm'] for v in LM.values()) for p in HERO['animations']})
