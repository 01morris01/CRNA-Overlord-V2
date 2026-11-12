#!/bin/sh
# finish_people.sh RAW_DIR OUT_DIR [id ...]: compress the files written by make_person.py for the browser.
#   RAW_DIR/<id>.raw.glb  ->  OUT_DIR/<id>.glb
# Pictures become WebP (the normal map and the colour pictures at their own quality, both well above the tool's default,
# because a face is looked at closely); geometry is Draco-compressed. Nothing is merged, thinned or renamed: the browser
# finds the sheet, the drape material and the hair materials by name, and the morph targets must keep their vertex order.
# Without ids, every *.raw.glb in RAW_DIR is done.
set -e
RAW="$1"; OUT="$2"; shift 2
G="npx -y @gltf-transform/cli@4"
T="$(mktemp -d)"; trap 'rm -rf "$T"' EXIT
mkdir -p "$OUT"
[ $# -gt 0 ] || set -- $(cd "$RAW" && ls *.raw.glb | sed 's/\.raw\.glb$//')
for id in "$@"; do
  $G webp "$RAW/$id.raw.glb" "$T/a.glb" --slots "normalTexture" --quality 88 --effort 80 > "$T/log" 2>&1 || { cat "$T/log"; exit 1; }
  $G webp "$T/a.glb" "$T/b.glb" --slots "baseColorTexture" --quality 90 --effort 80 >> "$T/log" 2>&1 || { cat "$T/log"; exit 1; }
  $G optimize "$T/b.glb" "$OUT/$id.glb" --compress draco --texture-compress false --simplify false --join false --flatten false --instance false --palette false --prune-attributes false >> "$T/log" 2>&1 || { cat "$T/log"; exit 1; }
  echo "$id $(wc -c < "$OUT/$id.glb" | tr -d ' ') bytes"
done
