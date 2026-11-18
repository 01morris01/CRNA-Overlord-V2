"""write_json.py: the runtime JSON files built from what the builders measured (run by build_all.sh after the builds).
   python3 -I tools/props/airway/write_json.py RAWDIR REPO"""
import json, os, sys

raw, repo = sys.argv[1], sys.argv[2]
A = os.path.join(repo, 'assets/models/airway'); HD = os.path.join(repo, 'assets/models/hands')

s = json.load(open(os.path.join(raw, 'syringes.raw.json')))
out = {'frame': 'meters, glTF; barrel axis +Z toward the tip (push direction); origin = the zero line (front sealing edge of the stopper when empty); printed scale faces +Y; finger flange wings along X',
       'plunger': 'node `plunger` moves along -Z: plunger.position.z = -volume_mL * travel_m_per_mL (0 = empty)',
       'label': 'node `label`: a curved quad on the -Y side of the barrel; UV u runs from the flange end (0) to the tip end (1), v across; it reads correctly with the syringe tip-right and the label facing the viewer. Assign a CanvasTexture with flipY = false.',
       'anchors': {'tip': 'Luer tip end, +Z = push direction', 'flange': 'finger flange center on the axis (hands: grip_syringe)', 'thumb': 'back of the thumb press (child of plunger)'},
       'sizes': {}}
for k, v in s.items():
    out['sizes'][k.replace('syringe_', '')] = {'file': k + '.glb', **v}
json.dump(out, open(os.path.join(A, 'syringes.json'), 'w'), indent=1)

h = json.load(open(os.path.join(raw, 'hands.raw.json')))
hj = {
    'file': 'hands_gloved.glb', 'frame': h['frame'],
    'hands': {'L': {'armature_node': 'hand_L', 'mesh': 'glove_L', 'thumb_side': '+X'}, 'R': {'armature_node': 'hand_R', 'mesh': 'glove_R', 'thumb_side': '-X'}},
    'note_layout': 'in the file the two hand roots sit 0.12 m either side of the root for viewing; the runtime places each hand root itself',
    'bones': ['lowerarm02 (static root, distal forearm)', 'wrist', 'metacarpal1..4 (index..little)', 'finger1-1..1-3 (thumb)', 'finger2..5-1..3 (index..little)'],
    'poses': h['poses'],
    'animations': {'naming': 'each pose exists three times: <pose> (both hands), <pose>.L and <pose>.R (one hand only), so the hands can be crossfaded independently',
                   'keys': 'one key at t=0 (bone rotations only), except syringe_hold: t=0 hold, t=1 s thumb pressed about 2 cm (syringe_push is the pressed pose alone)'},
    'grips': h['grips'],
    'grip_rule': 'place the held item so that its anchor empty coincides with the hand grip empty: item_root_world = grip_world * inverse(anchor_in_item)',
    'grip_anchor_in_item': h['anchor_meaning'], 'grip_parent': 'grip empties are children of the hand armature node (hand frame); no pose moves the wrist bone',
    'triangles_per_hand': h['triangles_per_hand'],
    'materials': {'nitrile_blue_L / _R': 'blue nitrile: roughness 0.34, sheen, wrinkle normal map glove_normal_L / _R', 'skin_forearm': 'bare forearm between the glove cuff and the cut'},
    'glove_cuff_m': 0.062, 'forearm_cut_m': 0.125,
}
json.dump(hj, open(os.path.join(HD, 'hands.json'), 'w'), indent=1)
print('wrote syringes.json, hands.json')
