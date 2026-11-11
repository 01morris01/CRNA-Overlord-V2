#!/bin/bash
# Step 1a. Create the Python 3.11 environment and install TotalSegmentator (pinned) with its MCP extra.
set -euo pipefail
source "$(dirname "$0")/00_env.sh"
mkdir -p "$HN_WORK"
cd "$HN_WORK"
[ -d venv ] || uv venv --python 3.11 venv
# shellcheck disable=SC1091
source venv/bin/activate
# TotalSegmentator pinned; idc-index/pydicom/remotezip for the dataset survey; DracoPy/rtree/trimesh for GLB verification;
# pypdf only to search the TotalSegmentator preprint for its data statement
uv pip install 'TotalSegmentator[mcp]==2.18.0' idc-index trimesh pydicom remotezip DracoPy rtree pypdf
python -c "import totalsegmentator, importlib.metadata as m; print('TotalSegmentator', m.version('TotalSegmentator'))"
