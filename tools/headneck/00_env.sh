#!/bin/bash
# Common environment for the head-and-neck CT asset pipeline.
# Source this file from the other scripts:  source "$(dirname "$0")/00_env.sh"
#
# Everything heavy (venv, CT, weights, masks, Slicer, raw meshes) lives OUTSIDE the repo.
export HN_REPO="${HN_REPO:-$HOME/Developer/overlord-next}"
export HN_WORK="${HN_WORK:-$HOME/Developer/overlord-asset-sources/totalsegmentator}"
export HN_TOOLS_DIR="${HN_TOOLS_DIR:-$HOME/Developer/overlord-asset-sources/tools}"
export HN_VENV="$HN_WORK/venv"
export HN_SLICER="$HN_TOOLS_DIR/Slicer.app/Contents/MacOS/Slicer"
export HN_BLENDER="${HN_BLENDER:-/opt/homebrew/bin/blender}"

# TotalSegmentator keeps its config and downloaded weights here instead of ~/.totalsegmentator
export TOTALSEG_HOME_DIR="$HN_WORK/totalseg_home"

# Opt out of TotalSegmentator's anonymous usage statistics (documented switch in its README:
# "send_usage_stats": false in config.json). Written once, before the first run.
if [ ! -f "$TOTALSEG_HOME_DIR/config.json" ]; then
  mkdir -p "$TOTALSEG_HOME_DIR"
  printf '{\n    "totalseg_id": "totalseg_OPTEDOUT",\n    "send_usage_stats": false,\n    "prediction_counter": 0\n}\n' > "$TOTALSEG_HOME_DIR/config.json"
fi

# Use the venv python without "activate" side effects
export HN_PY="$HN_VENV/bin/python"
export PATH="$HN_VENV/bin:$PATH"
