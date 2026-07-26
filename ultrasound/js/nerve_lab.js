// NERVE MODEL LAB
//
// A self-contained panel that exercises the four peripheral-nerve (Nerve-UTP)
// segmenters inside Plexus Studio WITHOUT touching the main supraclavicular live
// loop. The studio only carries supraclavicular clips, so there is no sciatic /
// femoral video to demo; instead each nerve model is run on a REAL held-out
// Nerve-UTP still frame (pulled from the training cache into studio/samples),
// and on two adversarial inputs (pure noise, blank) to show the abstention gate
// staying silent. Every number shown is a live measurement from the exported
// ONNX graph and the shipped gate weights.

import { IMG, N, NERVE_MODELS, rgbaToGray, inferNerveRaw } from "./inference.js";
import { loadGate, gateFeatures, applyGate } from "./gate.js";
import { renderOverlay, clearOverlay } from "./overlay.js";
import { gradeScan, qualityLabel } from "./quality.js";

const $ = (id) => document.getElementById(id);

const labEls = {
  select: $("nerveModelSelect"),
  runSample: $("labRunSample"),
  runNoise: $("labRunNoise"),
  runBlank: $("labRunBlank"),
  frame: $("labFrame"),
  overlay: $("labOverlay"),
  decision: $("labDecision"),
  rawPx: $("labRawPx"),
  gatedPx: $("labGatedPx"),
  gateProb: $("labGateProb"),
  dice: $("labDice"),
  quality: $("labQuality"),
  infer: $("labInfer"),
  input: $("labInput"),
  dims: $("labDims"),
};

const frameCtx = labEls.frame.getContext("2d", { willReadFrequently: true });
const overlayCtx = labEls.overlay.getContext("2d");
const grayBuf = new Float32Array(N);

// Draw a data source into the 256 frame canvas and return its grayscale buffer.
async function drawSampleImage(key) {
  const url = new URL(`../samples/${key}/frame.png`, import.meta.url).href;
  const img = await new Promise((res, rej) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = rej;
    im.src = url;
  });
  frameCtx.drawImage(img, 0, 0, IMG, IMG);
  const rgba = frameCtx.getImageData(0, 0, IMG, IMG).data;
  return rgbaToGray(rgba, grayBuf);
}

function drawNoise() {
  const im = frameCtx.createImageData(IMG, IMG);
  const d = im.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = (Math.random() * 256) | 0;
    d[i] = v; d[i + 1] = v; d[i + 2] = v; d[i + 3] = 255;
  }
  frameCtx.putImageData(im, 0, 0);
  return rgbaToGray(frameCtx.getImageData(0, 0, IMG, IMG).data, grayBuf);
}

function drawBlank() {
  frameCtx.fillStyle = "#000";
  frameCtx.fillRect(0, 0, IMG, IMG);
  grayBuf.fill(0);
  return grayBuf;
}

async function loadGtMask(key) {
  try {
    const url = new URL(`../samples/${key}/gt_mask.png`, import.meta.url).href;
    const img = await new Promise((res, rej) => {
      const im = new Image();
      im.onload = () => res(im);
      im.onerror = rej;
      im.src = url;
    });
    const c = document.createElement("canvas");
    c.width = IMG; c.height = IMG;
    const cx = c.getContext("2d", { willReadFrequently: true });
    cx.drawImage(img, 0, 0, IMG, IMG);
    const d = cx.getImageData(0, 0, IMG, IMG).data;
    const gt = new Uint8Array(N);
    for (let p = 0; p < N; p++) gt[p] = d[p * 4] > 127 ? 1 : 0;
    return gt;
  } catch {
    return null;
  }
}

function diceOf(seg, gt) {
  let inter = 0, a = 0, b = 0;
  for (let p = 0; p < N; p++) {
    const s = seg[p] === 1 ? 1 : 0;
    inter += s & gt[p]; a += s; b += gt[p];
  }
  if (a === 0 && b === 0) return 1;
  return (2 * inter) / (a + b);
}

async function run(kind) {
  const key = labEls.select.value;
  let gray, inputLabel;
  if (kind === "sample") { gray = await drawSampleImage(key); inputLabel = "real Nerve-UTP held-out frame"; }
  else if (kind === "noise") { gray = drawNoise(); inputLabel = "pure noise (adversarial)"; }
  else { gray = drawBlank(); inputLabel = "blank / dropout (adversarial)"; }

  const { prob, rawPx, inferMs } = await inferNerveRaw(key, gray);
  const gate = await loadGate(key);
  const feats = gateFeatures(gray);
  const { keep, prob: gateProb } = applyGate(gate, feats);

  // Build the final segmentation: nerve where prob>0.5, but ONLY if the gate
  // keeps the frame. If the gate abstains, the mask is forced empty (silent).
  const seg = new Uint8Array(N);
  const conf = new Float32Array(N);
  let gatedPx = 0;
  if (keep) {
    for (let p = 0; p < N; p++) {
      if (prob[p] > 0.5) { seg[p] = 1; conf[p] = prob[p]; gatedPx++; }
    }
  }
  renderOverlay(overlayCtx, seg, {
    showNerve: true, showNeedle: false, opacity: 0.9,
    rect: { x: 0, y: 0, w: labEls.overlay.width, h: labEls.overlay.height },
  });

  const grade = gradeScan(seg, conf);
  labEls.decision.textContent = keep ? "KEEP (nerve retained)" : "ABSTAIN (mask forced empty)";
  labEls.decision.className = "lab-decision " + (keep ? "keep" : "abstain");
  labEls.rawPx.textContent = String(rawPx);
  labEls.gatedPx.textContent = String(gatedPx);
  labEls.gateProb.textContent = gateProb.toFixed(3) + "  (thr " + gate.threshold.toFixed(2) + ")";
  labEls.infer.textContent = inferMs.toFixed(1) + " ms";
  labEls.input.textContent = inputLabel;
  labEls.dims.textContent = `input_std ${feats[0].toFixed(3)}  blur_survival ${feats[1].toFixed(3)}  frac_dark ${feats[2].toFixed(3)}`;

  if (kind === "sample") {
    const gt = await loadGtMask(key);
    labEls.dice.textContent = gt
      ? diceOf(seg, gt).toFixed(3) + "  (vs dataset ground truth mask)"
      : "n/a";
    labEls.quality.textContent = grade.score.toFixed(1) + " / 100  " + qualityLabel(grade);
  } else {
    labEls.dice.textContent = "n/a (no nerve in adversarial input)";
    labEls.quality.textContent = keep ? grade.score.toFixed(1) + " / 100" : "0 / 100  gated silent";
  }
}

// Deep link support. When the Overlord app opens this trainer with
// ?model=femoral (or sciatic, ulnar, median) preselect that peripheral nerve
// model in the lab, scroll the lab into view, and run its held out sample so
// the requested model is loaded and running on arrival. The supraclavicular
// value maps to the main live loop (which already runs supraclavicular), so it
// simply leaves the lab on its default first entry.
function applyDeepLink() {
  let requested = null;
  try {
    requested = new URLSearchParams(window.location.search).get("model");
  } catch {
    requested = null;
  }
  if (!requested) return false;
  requested = requested.toLowerCase();
  const match = NERVE_MODELS.find((m) => m.key === requested);
  if (!match) return false;
  labEls.select.value = match.key;
  const panel = labEls.select.closest(".nervelab") || labEls.select;
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
  run("sample").catch((e) => console.error(e));
  return true;
}

function init() {
  if (!labEls.select) return; // panel not present
  for (const m of NERVE_MODELS) {
    const opt = document.createElement("option");
    opt.value = m.key;
    opt.textContent = `${m.label}  (held-out Dice ${m.dice.toFixed(2)})`;
    labEls.select.appendChild(opt);
  }
  labEls.runSample.addEventListener("click", () => run("sample").catch((e) => console.error(e)));
  labEls.runNoise.addEventListener("click", () => run("noise").catch((e) => console.error(e)));
  labEls.runBlank.addEventListener("click", () => run("blank").catch((e) => console.error(e)));
  clearOverlay(overlayCtx);
  // If a deep link requested a specific peripheral nerve model, honor it;
  // otherwise auto-run the first sample so the panel is populated on load.
  if (!applyDeepLink()) {
    run("sample").catch((e) => console.error(e));
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
