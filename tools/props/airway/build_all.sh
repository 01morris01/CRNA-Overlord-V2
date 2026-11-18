#!/bin/sh
# build_all.sh: rebuild every airway, hands and machine asset from its sources (see each build_*.py) and compress it.
#   sh tools/props/airway/build_all.sh
set -e
REPO=$(cd "$(dirname "$0")/../../.." && pwd); T=$REPO/tools/props/airway
SRC=${OVERLORD_SOURCES:-$HOME/Developer/overlord-asset-sources}; W=$SRC/work/props-airway; TEX=$W/tex; RAW=$W/raw
A=$REPO/assets/models/airway; M=$REPO/assets/models/machine; HD=$REPO/assets/models/hands
mkdir -p "$TEX" "$RAW" "$W/blend" "$A" "$M" "$HD"
B="blender -b --factory-startup --python"
python3 -I "$T/textures.py" "$TEX" > /dev/null
$B "$T/build_syringes.py" -- "$TEX" "$RAW"
$B "$T/build_mask.py" -- "$RAW"
$B "$T/build_bag.py" -- "$RAW"
$B "$T/build_laryngoscope.py" -- "$TEX" "$RAW"
$B "$T/build_circuit.py" -- "$RAW"
$B "$T/build_iv.py" -- "$SRC/sourcing/69f883fdc4b54b51aca2864eb4b9c646/69f883fdc4b54b51aca2864eb4b9c646.glb" "$RAW"
$B "$T/build_face_items.py" -- "$RAW"
$B "$T/build_machine.py" -- "$TEX" "$RAW"
BLENDER_USER_RESOURCES=$SRC/people/blender-user $B "$T/build_hands.py" -- "$TEX" "$RAW" "$W/blend/hands_posed.blend"
F="python3 -I $T/finish.py"
for k in 3ml 5ml 10ml; do $F "$RAW/syringe_$k.raw.glb" "$A/syringe_$k.glb" --nodes syringe_$k,barrel,plunger,tip,label; done
$F "$RAW/face_mask_adult.raw.glb" "$A/face_mask_adult.glb" --nodes mask,dome,cushion,connector,seat,port
$F "$RAW/reservoir_bag_3l.raw.glb" "$A/reservoir_bag_3l.glb" --nodes reservoir_bag_3l,bag,neck
$F "$RAW/laryngoscope_mac.raw.glb" "$A/laryngoscope_mac.glb" --nodes laryngoscope,handle,blade,grip,hinge,blade_tip
$F "$RAW/circuit_parts.raw.glb" "$A/circuit_parts.glb" --nodes elbow,y_piece,filter,in,out,exp --strip-suffix in,out,exp --max-tris 30000
$F "$RAW/iv_port.raw.glb" "$A/iv_port.glb" --nodes iv_port,catheter,extension,port --max-tris 15100
$F "$RAW/bite_block.raw.glb" "$A/bite_block.glb" --nodes bite_block,block,strap
$F "$RAW/nasal_cannula_capno.raw.glb" "$A/nasal_cannula_capno.glb" --nodes nasal_cannula_capno,prongs,loopL,loopR
$F "$RAW/bellows.raw.glb" "$M/bellows.glb" --nodes bellows_assembly,bellows,housing --max-tris 30000
$F "$RAW/controls.raw.glb" "$M/controls.glb" --nodes controls,knob_o2,knob_air,sevo_dial,apl_knob,bag_vent_switch,o2_flush --max-tris 30000
mv "$RAW/bellows.json" "$RAW/controls.json" "$M/" 2>/dev/null || true
$F "$RAW/hands_gloved.raw.glb" "$HD/hands_gloved.glb" --nodes hands_gloved,hand_L,hand_R,glove_L,glove_R --max-tris 22000
cp "$TEX/corrugated_normal.png" "$A/corrugated_normal.png"
python3 -I "$T/write_json.py" "$RAW" "$REPO"
