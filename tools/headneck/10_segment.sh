#!/bin/bash
# Step 3. Run the open TotalSegmentator tasks on the working volume (0.75 mm grid, frame G).
#
#   bash tools/headneck/10_segment.sh            # all tasks on Apple MPS
#   HN_DEVICE=cpu bash tools/headneck/10_segment.sh
#
# -ho   cropped-logits resampling back to the input grid (smoother label borders than nearest neighbour)
# -s -sx -sii   statistics.json with volume, mean/SD HU, voxel count, centroid, bbox, incl. structures at the border
# -rp   machine-readable run report (versions, device, runtime)
# Weights download on first use from github.com/wasserth/TotalSegmentator/releases into $TOTALSEG_HOME_DIR.
# No licence key is set, so licence-gated tasks cannot run.
set -uo pipefail
source "$(dirname "$0")/00_env.sh"
DEV="${HN_DEVICE:-mps}"
CT="$HN_WORK/data/s0527/ct_075.nii.gz"
OUT="$HN_WORK/masks"
LOG="$HN_WORK/logs"
mkdir -p "$OUT" "$LOG"

TASKS="${HN_TASKS:-total headneck_bones_vessels headneck_muscles head_glands_cavities head_muscles craniofacial_structures}"
: > "$LOG/segment_runtimes.tsv"
for T in $TASKS; do
  echo "=== $T ($DEV) $(date -u +%FT%TZ)"
  S=$(date +%s)
  TotalSegmentator -i "$CT" -o "$OUT/$T" -ta "$T" -d "$DEV" -ho -s -sx -sii -rp "$OUT/$T/run_report.json" \
      > "$LOG/segment_$T.log" 2>&1
  RC=$?
  E=$(date +%s)
  printf "%s\t%s\t%s\t%s\n" "$T" "$DEV" "$((E-S))" "$RC" | tee -a "$LOG/segment_runtimes.tsv"
done
TotalSegmentator --version
