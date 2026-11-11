#!/bin/sh
# finish_institute.sh LEVEL_DIR: encode the baked light and compress the furniture after tools/build_institute.py has run.
set -e
D="$1"; HERE="$(cd "$(dirname "$0")" && pwd)"
uv run -q --with pillow --with numpy python3 "$HERE/encode_lightmap.py" "$D/lightmap.npy" "$D"
npx -y @gltf-transform/cli@4 optimize "$D/institute-props.glb" "$D/props.glb" --compress draco --texture-compress webp --texture-size 1024 --simplify-error 0.0006 --join false --palette false > "$D/_props.log" 2>&1 || { cat "$D/_props.log"; exit 1; }
# the building keeps its geometry and both UV sets exactly; only its textures are re-encoded (JPEG -> WebP)
mv "$D/institute.glb" "$D/institute-jpeg.glb" && npx -y @gltf-transform/cli@4 webp "$D/institute-jpeg.glb" "$D/institute.glb" --quality 84 >> "$D/_props.log" 2>&1 && rm "$D/institute-jpeg.glb"
ls -la "$D" | awk '{print $5, $9}'
