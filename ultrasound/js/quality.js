// Scan quality grader, a direct port of scan_quality.py.
//
//   score = 100 * presence * centering
//   presence  = mean nerve softmax over predicted nerve pixels
//               * area adequacy factor * spatial coherence factor
//   centering = 1 - centroid distance from center / quarter diagonal
//
// The coherence gate is what keeps the grader honest on noise: real anatomy
// is one compact blob, hallucinations on noise are dozens of fragments.

import { IMG, N, CLASS_NERVE } from "./inference.js";

const AREA_FULL = 0.02 * N; // ~2 percent of frame is full credit area
const QUARTER_DIAG = 0.5 * Math.hypot(IMG, IMG);
const CO_LO = 0.2;
const CO_HI = 0.8;
const CENTER = IMG / 2;

// Largest connected component fraction of the nerve mask, 4-connectivity,
// same as scipy.ndimage.label with the default structure.
function coherenceFactor(seg, totalArea) {
  const visited = new Uint8Array(N);
  const stack = new Int32Array(N);
  let largest = 0;
  for (let p0 = 0; p0 < N; p0++) {
    if (seg[p0] !== CLASS_NERVE || visited[p0]) continue;
    let top = 0;
    stack[top++] = p0;
    visited[p0] = 1;
    let size = 0;
    while (top > 0) {
      const p = stack[--top];
      size++;
      const x = p % IMG;
      const up = p - IMG;
      const dn = p + IMG;
      if (up >= 0 && seg[up] === CLASS_NERVE && !visited[up]) { visited[up] = 1; stack[top++] = up; }
      if (dn < N && seg[dn] === CLASS_NERVE && !visited[dn]) { visited[dn] = 1; stack[top++] = dn; }
      if (x > 0 && seg[p - 1] === CLASS_NERVE && !visited[p - 1]) { visited[p - 1] = 1; stack[top++] = p - 1; }
      if (x < IMG - 1 && seg[p + 1] === CLASS_NERVE && !visited[p + 1]) { visited[p + 1] = 1; stack[top++] = p + 1; }
    }
    if (size > largest) largest = size;
  }
  const frac = largest / totalArea;
  return Math.min(1, Math.max(0, (frac - CO_LO) / (CO_HI - CO_LO)));
}

export function gradeScan(seg, conf) {
  let area = 0;
  let confSum = 0;
  let sx = 0;
  let sy = 0;
  for (let p = 0; p < N; p++) {
    if (seg[p] === CLASS_NERVE) {
      area++;
      confSum += conf[p]; // argmax is nerve, so max softmax IS the nerve prob
      sx += p % IMG;
      sy += (p / IMG) | 0;
    }
  }
  if (area === 0) {
    return { score: 0, presence: 0, centering: 0, coherence: 0, area: 0, meanConf: 0 };
  }
  const meanConf = confSum / area;
  const areaFactor = Math.min(1, area / AREA_FULL);
  const coherence = coherenceFactor(seg, area);
  const presence = meanConf * areaFactor * coherence;
  const dist = Math.hypot(sx / area - CENTER, sy / area - CENTER);
  const centering = Math.max(0, 1 - dist / QUARTER_DIAG);
  const score = 100 * presence * centering;
  return { score, presence, centering, coherence, area, meanConf };
}

export function qualityLabel(g) {
  if (g.area === 0) return "no structure in view";
  if (g.coherence < 0.15) return "fragmented, likely noise";
  if (g.centering < 0.5) return "structure off center";
  if (g.score < 25) return "weak capture";
  if (g.score < 55) return "adequate capture";
  return "well framed";
}
