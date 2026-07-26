// Abstention gate for the single-class Nerve-UTP segmenters, applied in-app.
//
// The four Nerve-UTP segmenters cannot abstain on their own: they paint
// thousands of nerve pixels on pure noise and on blank frames (measured). Their
// probability map looks almost identical on nerve, noise and blank, so a
// prob-map-only gate (as used for the supraclavicular model) does not separate
// them. This gate instead reads DOMAIN-NEUTRAL features that DO separate the
// failure modes we can test: three input-quality features from the raw frame
// (catch blank / noise / dropout) plus three prob-map shape features. A tiny
// logistic (trained in build_nerveutp_gates.py, weights shipped as JSON) decides
// keep vs force-empty. This arithmetic is a byte-for-byte port of the Python
// feature functions so the browser reproduces the verified decision.
//
// Honest limitation, stated in the UI too: this rejects NON-ANATOMICAL input. A
// real in-domain "ultrasound frame with no nerve in view" is untestable here
// because the Nerve-UTP dataset contains no nerve-absent frame.

// Fixed geometry (matches inference.js IMG/N). Defined locally so this module
// has no onnxruntime dependency and its pure feature math can be imported and
// parity-checked in plain node against the Python reference.
export const IMG = 256;
export const N = IMG * IMG;

const PRED_THRESH = 0.5;

const gateCache = new Map();

export async function loadGate(key) {
  if (gateCache.has(key)) return gateCache.get(key);
  const url = new URL(`../models/nerveutp_${key}_gate.json`, import.meta.url).href;
  const g = await (await fetch(url)).json();
  gateCache.set(key, g);
  return g;
}

// 5x5 box blur with edge replication, matching build_nerveutp_gates.box_blur.
function boxBlurStd(gray) {
  const k = 5, pad = 2, W = IMG, PW = IMG + 2 * pad;
  const padded = new Float32Array(PW * PW);
  for (let y = 0; y < PW; y++) {
    const sy = Math.min(W - 1, Math.max(0, y - pad));
    for (let x = 0; x < PW; x++) {
      const sx = Math.min(W - 1, Math.max(0, x - pad));
      padded[y * PW + x] = gray[sy * W + sx];
    }
  }
  // integral image of padded, size (PW+1)x(PW+1)
  const IW = PW + 1;
  const integ = new Float64Array(IW * IW);
  for (let y = 0; y < PW; y++) {
    let rs = 0;
    for (let x = 0; x < PW; x++) {
      rs += padded[y * PW + x];
      integ[(y + 1) * IW + (x + 1)] = integ[y * IW + (x + 1)] + rs;
    }
  }
  let sum = 0, sumSq = 0;
  const area = k * k;
  for (let y = 0; y < W; y++) {
    for (let x = 0; x < W; x++) {
      const y0 = y, x0 = x, y1 = y + k, x1 = x + k;
      const tot =
        integ[y1 * IW + x1] - integ[y0 * IW + x1] -
        integ[y1 * IW + x0] + integ[y0 * IW + x0];
      const v = tot / area;
      sum += v; sumSq += v * v;
    }
  }
  const mean = sum / N;
  return Math.sqrt(Math.max(0, sumSq / N - mean * mean));
}

function stdOf(arr) {
  let s = 0, sq = 0;
  for (let i = 0; i < arr.length; i++) { s += arr[i]; sq += arr[i] * arr[i]; }
  const m = s / arr.length;
  return Math.sqrt(Math.max(0, sq / arr.length - m * m));
}

// Feature vector in the exact order build_nerveutp_gates.FEATURE_NAMES uses:
// [input_std, blur_survival, frac_dark]. All three come from the RAW frame with
// no model involved, so numpy and JS produce identical values (verified in
// webexport/run_web_gate.mjs). The gate deliberately does NOT read the
// probability map: doing so introduced PyTorch/onnxruntime-web skew that flipped
// the all-zeros decision in the browser.
export function gateFeatures(gray) {
  const inputStd = stdOf(gray);
  const blurSurvival = inputStd < 1e-6 ? 0 : boxBlurStd(gray) / inputStd;
  let dark = 0;
  for (let i = 0; i < gray.length; i++) if (gray[i] < 0.02) dark++;
  const fracDark = dark / gray.length;
  return [inputStd, blurSurvival, fracDark];
}

// Logistic decision: standardize, dot with weights, sigmoid, compare threshold.
export function applyGate(gate, features) {
  let z = gate.bias;
  for (let j = 0; j < features.length; j++) {
    z += gate.weight[j] * ((features[j] - gate.mean[j]) / gate.std[j]);
  }
  const prob = 1 / (1 + Math.exp(-z));
  return { keep: prob > gate.threshold, prob, features };
}
