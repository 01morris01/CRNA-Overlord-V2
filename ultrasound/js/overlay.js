// Overlay renderer. Structure highlighting only: nerve filled translucent
// cobalt with a periwinkle contour, needle marked amber as an identified
// structure. Deliberately NO trajectory, reticle, or insertion cue of any
// kind, this tool teaches recognition, it must never guide a needle.

import { IMG, N, CLASS_NERVE, CLASS_NEEDLE } from "./inference.js";

// Brand palette
const NERVE_FILL = [1, 49, 185, 96];        // cobalt #0131B9, translucent
const NERVE_EDGE = [164, 181, 235, 235];    // periwinkle #A4B5EB contour
const NEEDLE_FILL = [255, 211, 107, 150];   // amber #FFD36B
const NEEDLE_EDGE = [255, 211, 107, 245];

const segCanvas = document.createElement("canvas");
segCanvas.width = IMG;
segCanvas.height = IMG;
const segCtx = segCanvas.getContext("2d");
const segImage = segCtx.createImageData(IMG, IMG);

function isEdge(seg, p, cls) {
  const x = p % IMG;
  const y = (p / IMG) | 0;
  return (
    (x === 0 || seg[p - 1] !== cls) ||
    (x === IMG - 1 || seg[p + 1] !== cls) ||
    (y === 0 || seg[p - IMG] !== cls) ||
    (y === IMG - 1 || seg[p + IMG] !== cls)
  );
}

// Paint the 256 space segmentation, then scale it into the region of interest.
// opts.rect {x,y,w,h} in destination canvas pixels places the overlay back on
// the exact B mode region the operator cropped; without it the overlay would
// stretch across the whole capture frame, which is wrong for an embedded feed.
export function renderOverlay(ctx, seg, opts) {
  const { showNerve, showNeedle, opacity } = opts;
  const rect = opts.rect || { x: 0, y: 0, w: ctx.canvas.width, h: ctx.canvas.height };
  const d = segImage.data;
  for (let p = 0, i = 0; p < N; p++, i += 4) {
    const cls = seg[p];
    let c = null;
    if (cls === CLASS_NERVE && showNerve) {
      c = isEdge(seg, p, CLASS_NERVE) ? NERVE_EDGE : NERVE_FILL;
    } else if (cls === CLASS_NEEDLE && showNeedle) {
      c = isEdge(seg, p, CLASS_NEEDLE) ? NEEDLE_EDGE : NEEDLE_FILL;
    }
    if (c) {
      d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = c[3];
    } else {
      d[i + 3] = 0;
    }
  }
  segCtx.putImageData(segImage, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.globalAlpha = opacity;
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(segCanvas, rect.x, rect.y, rect.w, rect.h);
  ctx.globalAlpha = 1;
}

export function clearOverlay(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
