// Real model inference through onnxruntime-web (WASM backend), the same path
// verified in webexport/run_web.mjs. Preprocessing mirrors real_data.py
// exactly: grayscale, resize to 256x256, pixel / 255.0, nothing else.

import * as ort from "../vendor/ort.min.mjs";

export const IMG = 256;
export const CLASSES = 3;
export const N = IMG * IMG;
export const CLASS_BG = 0;
export const CLASS_NERVE = 1;
export const CLASS_NEEDLE = 2;

let session = null;

// Peripheral nerve models (Nerve-UTP). Single-class sigmoid segmenters, each
// paired with an abstention gate (see gate.js). Supraclavicular stays the
// default model driving the main live loop; these are exercised on real
// Nerve-UTP still frames in the Nerve Model Lab panel. Only models whose gate
// PASSED the abstain criteria in build_nerveutp_gates.py are listed here.
export const NERVE_MODELS = [
  { key: "sciatic", label: "Sciatic (proximal window)", dice: 0.7193 },
  { key: "femoral", label: "Femoral", dice: 0.7374 },
  { key: "ulnar", label: "Ulnar", dice: 0.6110 },
  { key: "median", label: "Median", dice: 0.6904 },
];

const nerveSessions = new Map();

export async function loadModel() {
  ort.env.wasm.wasmPaths = new URL("../vendor/", import.meta.url).href;
  ort.env.wasm.numThreads = 1; // no cross origin isolation needed
  session = await ort.InferenceSession.create(
    new URL("../models/nerve_needle_unet.onnx", import.meta.url).href,
    { executionProviders: ["wasm"] }
  );
  return session;
}

async function ensureNerveSession(key) {
  if (nerveSessions.has(key)) return nerveSessions.get(key);
  ort.env.wasm.wasmPaths = new URL("../vendor/", import.meta.url).href;
  ort.env.wasm.numThreads = 1;
  const s = await ort.InferenceSession.create(
    new URL(`../models/nerveutp_${key}_unet.onnx`, import.meta.url).href,
    { executionProviders: ["wasm"] }
  );
  nerveSessions.set(key, s);
  return s;
}

// Run a single-class Nerve-UTP segmenter on one preprocessed frame. Returns the
// raw sigmoid probability map and the raw nerve-pixel count BEFORE gating. The
// caller (nerve_lab.js) applies the abstention gate and builds the final seg.
export async function inferNerveRaw(key, gray) {
  const s = await ensureNerveSession(key);
  const input = new ort.Tensor("float32", gray, [1, 1, IMG, IMG]);
  const t0 = performance.now();
  const out = await s.run({ input });
  const inferMs = performance.now() - t0;
  const logits = out.logits.data; // [1,1,256,256] flattened
  const prob = new Float32Array(N);
  let rawPx = 0;
  let confSum = 0;
  for (let p = 0; p < N; p++) {
    const pr = 1 / (1 + Math.exp(-logits[p]));
    prob[p] = pr;
    if (pr > 0.5) { rawPx++; confSum += pr; }
  }
  return { prob, rawPx, rawMeanConf: rawPx > 0 ? confSum / rawPx : 0, inferMs };
}

// rgba: Uint8ClampedArray from a 256x256 getImageData.
// Returns Float32Array of length N in [0,1], matching cv2 BGR2GRAY weights.
export function rgbaToGray(rgba, out) {
  const gray = out || new Float32Array(N);
  for (let p = 0, i = 0; p < N; p++, i += 4) {
    gray[p] =
      (0.299 * rgba[i] + 0.587 * rgba[i + 1] + 0.114 * rgba[i + 2]) / 255.0;
  }
  return gray;
}

// Run the model on one preprocessed frame. Returns per pixel class (seg),
// per pixel max softmax (conf), structure pixel counts, the mean max softmax
// over detected structure pixels, and the measured inference time in ms.
export async function infer(gray) {
  if (!session) throw new Error("model not loaded");
  const input = new ort.Tensor("float32", gray, [1, 1, IMG, IMG]);
  const t0 = performance.now();
  const out = await session.run({ input });
  const inferMs = performance.now() - t0;
  const logits = out.logits.data; // [1,3,256,256] flattened, layout [C, H*W]

  const seg = new Uint8Array(N);
  const conf = new Float32Array(N);
  let nervePx = 0;
  let needlePx = 0;
  let structConfSum = 0;
  for (let p = 0; p < N; p++) {
    const l0 = logits[p];
    const l1 = logits[N + p];
    const l2 = logits[2 * N + p];
    let m = l0;
    let cls = 0;
    if (l1 > m) { m = l1; cls = 1; }
    if (l2 > m) { m = l2; cls = 2; }
    // softmax of the argmax class: exp(m - m) = 1 over the shifted sum
    const denom = Math.exp(l0 - m) + Math.exp(l1 - m) + Math.exp(l2 - m);
    const maxProb = 1 / denom;
    seg[p] = cls;
    conf[p] = maxProb;
    if (cls === CLASS_NERVE) { nervePx++; structConfSum += maxProb; }
    else if (cls === CLASS_NEEDLE) { needlePx++; structConfSum += maxProb; }
  }
  const structPx = nervePx + needlePx;
  return {
    seg,
    conf,
    nervePx,
    needlePx,
    structPx,
    meanStructConf: structPx > 0 ? structConfSum / structPx : 0,
    inferMs,
  };
}
