// Reference (ground truth) layer. Loads the compact reference artifacts derived
// from the real Sonosite dataset (ac_masks nerve contours and needle tip/tail
// coordinates) and renders them in a style deliberately DISTINCT from the model
// overlay: the ground truth is the answer key, the model overlay is a fallible
// second opinion, and the UI must never let a student confuse the two.
//
// Reference geometry is in each clip's own 512x360 pixel space, the same space
// as the recorded clip frame, so it is drawn straight into a natural sized
// canvas. This layer draws structure only. It never draws an insertion path;
// the needle tip and tail mark the needle that is physically present in the
// annotated frame, the same identified structure the model needle overlay marks.

const REF_LINE = "#F6EFD6";      // cream, the ground truth color
const REF_FILL = "rgba(246, 239, 214, 0.14)";
const REF_NEEDLE = "#FFE9A8";    // pale cream amber for the annotated needle

const cache = new Map();

export async function loadReference(sid) {
  if (cache.has(sid)) return cache.get(sid);
  const res = await fetch(`reference/${sid}.json`);
  if (!res.ok) throw new Error(`reference ${sid} not found`);
  const data = await res.json();
  const byIndex = new Map();
  for (const f of data.frames) byIndex.set(f.i, f);
  const ref = { ...data, byIndex };
  cache.set(sid, ref);
  return ref;
}

// Map the video playhead to a reference frame index by proportion of duration,
// robust to any small container fps rounding.
export function frameIndexFor(video, ref) {
  if (!video.duration || !isFinite(video.duration)) return 0;
  const frac = Math.min(0.9999, Math.max(0, video.currentTime / video.duration));
  return Math.min(ref.frameCount - 1, Math.floor(frac * ref.frameCount));
}

// Rasterize a reference frame's nerve mask into a Uint8Array(w*h) for scoring.
export function nerveMaskAt(ref, idx, w, h) {
  const frame = ref.byIndex.get(idx);
  const mask = new Uint8Array(w * h);
  if (!frame || !frame.nerve || frame.nerve.length === 0) return mask;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#fff";
  const sx = w / ref.frameW;
  const sy = h / ref.frameH;
  for (const poly of frame.nerve) {
    ctx.beginPath();
    poly.forEach((p, k) => {
      const x = p[0] * sx;
      const y = p[1] * sy;
      if (k === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
  }
  const d = ctx.getImageData(0, 0, w, h).data;
  for (let p = 0; p < w * h; p++) if (d[p * 4] > 127) mask[p] = 1;
  return mask;
}

export function renderReference(ctx, ref, idx, opts = {}) {
  const canvas = ctx.canvas;
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const frame = ref.byIndex.get(idx);
  if (!frame) return;
  const sx = w / ref.frameW;
  const sy = h / ref.frameH;

  if (opts.showNerve !== false && frame.nerve && frame.nerve.length) {
    ctx.lineWidth = Math.max(1.5, 2 * (w / ref.frameW));
    ctx.strokeStyle = REF_LINE;
    ctx.fillStyle = REF_FILL;
    ctx.setLineDash([6, 4]);
    for (const poly of frame.nerve) {
      ctx.beginPath();
      poly.forEach((p, k) => {
        const x = p[0] * sx;
        const y = p[1] * sy;
        if (k === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.setLineDash([]);
  }

  if (opts.showNeedle !== false && frame.needleTip && frame.needleTail) {
    const tip = [frame.needleTip[0] * sx, frame.needleTip[1] * sy];
    const tail = [frame.needleTail[0] * sx, frame.needleTail[1] * sy];
    // dotted segment along the needle that is present in the frame (structure
    // annotation, not a trajectory) with tip and tail markers
    ctx.strokeStyle = REF_NEEDLE;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(tip[0], tip[1]);
    ctx.lineTo(tail[0], tail[1]);
    ctx.stroke();
    ctx.setLineDash([]);
    drawCross(ctx, tip[0], tip[1], REF_NEEDLE);
    drawRing(ctx, tail[0], tail[1], REF_NEEDLE);
  }
}

function drawCross(ctx, x, y, color) {
  const r = 5;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x - r, y); ctx.lineTo(x + r, y);
  ctx.moveTo(x, y - r); ctx.lineTo(x, y + r);
  ctx.stroke();
}

function drawRing(ctx, x, y, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.stroke();
}

// Draw an instructor placed manual reference mark (used for live volunteer
// scans that have no dataset ground truth). mark is {x,y} in natural coords.
export function renderManualMark(ctx, mark) {
  const canvas = ctx.canvas;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!mark) return;
  ctx.strokeStyle = REF_LINE;
  ctx.fillStyle = REF_FILL;
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.arc(mark.x, mark.y, mark.r || 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.setLineDash([]);
  drawCross(ctx, mark.x, mark.y, REF_LINE);
}

export const REF_COLORS = { line: REF_LINE, needle: REF_NEEDLE };
