#!/bin/sh
# fetch.sh: the Microsoft Rocketbox sources the staff figures are built from (MIT licence, public GitHub repository, no login).
#   sh tools/people/staff/fetch.sh WORK_DIR [SHARED_ROCKETBOX_DIR]
# Writes WORK_DIR/rocketbox/<Avatar>/<Avatar>.fbx with its .tga textures, and WORK_DIR/rocketbox/anim/<clip>.fbx.
# If SHARED_ROCKETBOX_DIR already holds a file (the building's earlier downloads), it is linked instead of fetched again.
set -e
W="${1:?work directory}"; S="${2:-}"; R="$W/rocketbox"; mkdir -p "$R/anim"
B="https://raw.githubusercontent.com/microsoft/Microsoft-Rocketbox/master/Assets"
get() { # url, path relative to $R
  if [ -s "$R/$2" ]; then return 0; fi
  mkdir -p "$(dirname "$R/$2")"
  if [ -n "$S" ] && [ -s "$S/$2" ]; then ln -sf "$S/$2" "$R/$2"; return 0; fi
  curl -sfL -m 900 --retry 3 -o "$R/$2.part" "$1" && mv "$R/$2.part" "$R/$2" || { echo "FAILED $1" >&2; rm -f "$R/$2.part"; return 1; }
}
avatar() { # group, name, code, extra texture parts...
  g=$1; a=$2; c=$3; shift 3
  get "$B/Avatars/$g/$a/Export/$a.fbx" "$a/$a.fbx"
  for t in body_color body_normal head_color head_normal "$@"; do get "$B/Avatars/$g/$a/Textures/${c}_$t.tga" "$a/${c}_$t.tga"; done
}
anim() { # variant (static | xy | xyz), clip names...
  v=$1; shift
  for n in "$@"; do get "$B/Animations/all_animations_max_motextr_$v/$n.max.fbx" "anim/$n.fbx"; done
}
# ---- bodies. The codes (m162 ...) are the texture prefixes the library uses.
# "opacity" is the hair and eyelash card texture; the two capped figures have none.
avatar Professions Medical_Male_04 m162 protection_color protection_normal
avatar Professions Medical_Male_05 m163 protection_color protection_normal
avatar Professions Medical_Female_01 f152 opacity_color
avatar Professions Medical_Female_02 f153 opacity_color
for spec in $EXTRA_AVATARS; do a=${spec%%:*}; c=${spec##*:}; avatar Adults "$a" "$c" opacity_color; done
# ---- clips
for s in m f; do
  anim static ${s}_idle_breathe_01 ${s}_idle_neutral_01 ${s}_work_table ${s}_work_mid ${s}_gestic_talk_neutral_01 ${s}_gestic_talk_relaxed_01 \
    ${s}_gestic_listen_left_01 ${s}_gestic_listen_right_01 ${s}_idle_look_around_01 ${s}_gestic_presentation_left_01 ${s}_gestic_presentation_right_01 \
    ${s}_documents_take ${s}_documents_out ${s}_documents_in ${s}_try_door_inwards ${s}_take_picture ${s}_idle_stretch_arms_01 ${s}_trolley_idle ${s}_invite_sit \
    ${s}_sit_chair_idle_neutral_01 ${s}_sit_chair_breathe_01 ${s}_sit_chair_idle_look_around
  anim xy ${s}_walk_neutral_01 ${s}_walk_slow_01
done
echo "fetched into $R"
