// Main application. Wires source selection (recorded clip, HDMI grabber via
// getUserMedia, grabber sim, synthetic noise honesty check), the operator
// defined region of interest, the real time inference loop, the overlay, and
// the instrument readouts. Every number shown on screen is a real measurement
// or real model output, nothing is canned.

import { IMG, loadModel, rgbaToGray, infer } from "./inference.js";
import { gradeScan, qualityLabel } from "./quality.js";
import { renderOverlay, clearOverlay } from "./overlay.js";
import {
  loadReference,
  frameIndexFor,
  nerveMaskAt,
  renderReference,
  renderManualMark,
} from "./reference.js";

const FRAME_W = 512;
const FRAME_H = 360;

// Grabber sim canvas: a dataset clip embedded in a full 1080p capture frame
// with fake, non clinical device chrome, so ROI cropping can be proven against
// the raw clip. The embed rectangle keeps the clip 512:360 aspect.
const SIM_W = 1920;
const SIM_H = 1080;
const SIM_EMBED = { x: 505, y: 230, w: 910, h: 640 };

const CLIPS = [
  { id: "s071", note: "needle present in clip", fps: 7.5, hasNeedle: true },
  { id: "s123", note: "needle present in clip", fps: 7.5, hasNeedle: true },
  { id: "s311", note: "needle present in clip", fps: 7.5, hasNeedle: true },
  { id: "s005", note: "no needle in clip", fps: 30, hasNeedle: false },
  { id: "s187", note: "no needle in clip", fps: 30, hasNeedle: false },
];

const $ = (id) => document.getElementById(id);

const els = {
  video: $("video"),
  noiseCanvas: $("noiseCanvas"),
  simCanvas: $("simCanvas"),
  replayCanvas: $("replayCanvas"),
  overlay: $("overlay"),
  refOverlay: $("refOverlay"),
  guessOverlay: $("guessOverlay"),
  markLayer: $("markLayer"),
  refToggle: $("refToggle"),
  refReadout: $("refReadout"),
  refMarkBtn: $("refMarkBtn"),
  refMarkClearBtn: $("refMarkClearBtn"),
  stState: $("stState"),
  stPrompt: $("stPrompt"),
  stStartBtn: $("stStartBtn"),
  stGuessBtn: $("stGuessBtn"),
  stAbstainBtn: $("stAbstainBtn"),
  stRevealBtn: $("stRevealBtn"),
  stResult: $("stResult"),
  stVerdict: $("stVerdict"),
  stLines: $("stLines"),
  stDistrust: $("stDistrust"),
  recChip: $("recChip"),
  replayChip: $("replayChip"),
  sessState: $("sessState"),
  sessRecBtn: $("sessRecBtn"),
  sessReplayBtn: $("sessReplayBtn"),
  sessClearBtn: $("sessClearBtn"),
  sessPlayBtn: $("sessPlayBtn"),
  sessScrub: $("sessScrub"),
  sessCount: $("sessCount"),
  viewport: null,
  roiRect: $("roiRect"),
  roiLayer: $("roiLayer"),
  roiReadout: $("roiReadout"),
  roiDrawBtn: $("roiDrawBtn"),
  roiWholeBtn: $("roiWholeBtn"),
  roiClearBtn: $("roiClearBtn"),
  viewportMsg: $("viewportMsg"),
  frozenChip: $("frozenChip"),
  srcClipBtn: $("srcClipBtn"),
  srcHdmiBtn: $("srcHdmiBtn"),
  srcGrabberBtn: $("srcGrabberBtn"),
  srcNoiseBtn: $("srcNoiseBtn"),
  clipSelect: $("clipSelect"),
  deviceRow: $("deviceRow"),
  clipRow: $("clipRow"),
  deviceSelect: $("deviceSelect"),
  deviceRefresh: $("deviceRefresh"),
  hdmiStatus: $("hdmiStatus"),
  playBtn: $("playBtn"),
  playIcon: $("playIcon"),
  pauseIcon: $("pauseIcon"),
  freezeBtn: $("freezeBtn"),
  captureBtn: $("captureBtn"),
  sourceReadout: $("sourceReadout"),
  clipNoteReadout: $("clipNoteReadout"),
  resReadout: $("resReadout"),
  fpsReadout: $("fpsReadout"),
  inferReadout: $("inferReadout"),
  confValue: $("confValue"),
  confState: $("confState"),
  confBarFill: $("confBarFill"),
  qualityValue: $("qualityValue"),
  qualityLabel: $("qualityLabel"),
  qualityBarFill: $("qualityBarFill"),
  qPresence: $("qPresence"),
  qCentering: $("qCentering"),
  qCoherence: $("qCoherence"),
  qArea: $("qArea"),
  nervePx: $("nervePx"),
  needlePx: $("needlePx"),
  nerveToggle: $("nerveToggle"),
  needleToggle: $("needleToggle"),
  opacity: $("opacity"),
  opacityReadout: $("opacityReadout"),
  bootStatus: $("bootStatus"),
  bootPanel: $("bootPanel"),
};
els.viewport = els.overlay.parentElement;

const state = {
  source: "clip", // clip | hdmi | grabbersim | noise
  clip: "s071",
  frozen: false,
  stream: null,
  lastResult: null,
  showNerve: true,
  showNeedle: true,
  opacity: 0.9,
  modelReady: false,
  loopBusy: false,
  fpsWindow: [],
  inferEma: null,
  // ROI persisted per source type, natural pixel coords of that source
  roi: { clip: null, hdmi: null, grabbersim: null, noise: null },
  roiDrawing: false,
  // session record and review, all in memory
  recording: false,
  replaying: false,
  replayPlaying: false,
  session: [], // array of captured frames
  replayIndex: 0,
  replayTimer: null,
  // reference (ground truth) layer
  showReference: false,
  reference: null, // loaded reference for the current clip
  refIndex: -1,
  markPlacing: false,
  manualMark: { hdmi: null, grabbersim: null, noise: null, clip: null },
  // call it first self test
  selftest: {
    active: false,
    revealed: false,
    target: "nerve", // nerve | needle
    committed: null, // guess | abstain
    guess: null, // {x,y} natural coords
    frameIdx: -1,
  },
  guessPlacing: false,
};

const NEEDLE_ABSENT = new Set(["s005", "s187"]);

const SESSION_MAX = 900; // cap memory, about two minutes at 7.5 fps
const CAP_MAX_DIM = 960; // stored frame max dimension

// ---------- preprocessing ----------

const preCanvas = document.createElement("canvas");
preCanvas.width = IMG;
preCanvas.height = IMG;
const preCtx = preCanvas.getContext("2d", { willReadFrequently: true });
const grayBuf = new Float32Array(IMG * IMG);

function activeSourceEl() {
  if (state.source === "noise") return els.noiseCanvas;
  if (state.source === "grabbersim") return els.simCanvas;
  return els.video;
}

function sourceNatural() {
  if (state.source === "noise") return { w: FRAME_W, h: FRAME_H };
  if (state.source === "grabbersim") return { w: SIM_W, h: SIM_H };
  return {
    w: els.video.videoWidth || FRAME_W,
    h: els.video.videoHeight || FRAME_H,
  };
}

function currentRoi() {
  return state.roi[state.source];
}

function sourceHasFrame() {
  if (state.source === "noise") return true;
  if (state.source === "grabbersim") return els.video.readyState >= 2 && els.video.videoWidth > 0;
  return els.video.readyState >= 2 && els.video.videoWidth > 0;
}

// Crop the active frame to the ROI, grayscale, resize to 256, /255. Exactly the
// real_data.py contract, applied to the operator defined region only.
function preprocess() {
  const roi = currentRoi();
  const src = activeSourceEl();
  preCtx.drawImage(src, roi.x, roi.y, roi.w, roi.h, 0, 0, IMG, IMG);
  const rgba = preCtx.getImageData(0, 0, IMG, IMG).data;
  return rgbaToGray(rgba, grayBuf);
}

// ---------- noise source (honesty check) ----------

const noiseCtx = els.noiseCanvas.getContext("2d");
const noiseImage = noiseCtx.createImageData(FRAME_W, FRAME_H);

function drawNoiseFrame() {
  const d = noiseImage.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = (Math.random() * 256) | 0;
    d[i] = v; d[i + 1] = v; d[i + 2] = v; d[i + 3] = 255;
  }
  noiseCtx.putImageData(noiseImage, 0, 0);
}

// ---------- grabber sim source ----------

const simCtx = els.simCanvas.getContext("2d");

function drawSimFrame() {
  const c = simCtx;
  // capture card background
  c.fillStyle = "#05070f";
  c.fillRect(0, 0, SIM_W, SIM_H);
  // top device bar (fake chrome, not clinical guidance)
  c.fillStyle = "#0b1120";
  c.fillRect(0, 0, SIM_W, 96);
  c.fillStyle = "#8fa2d6";
  c.font = "600 30px Menlo, monospace";
  c.fillText("SONO GRABBER  HDMI IN 1080p60", 40, 58);
  c.fillStyle = "#5f6f9c";
  c.font = "22px Menlo, monospace";
  c.fillText("MSK LINEAR  L15-4", 1500, 52);
  // left param rail (all fake instrument labels, no guidance cues)
  c.fillStyle = "#0b1120";
  c.fillRect(0, 96, 480, SIM_H - 96);
  c.fillStyle = "#5f6f9c";
  c.font = "22px Menlo, monospace";
  const params = ["GAIN 58", "DEPTH 4.0 cm", "FREQ 10 MHz", "TIS 0.3", "MI 0.7", "MAP D/3", "FRAME 60 Hz"];
  params.forEach((p, i) => c.fillText(p, 40, 200 + i * 60));
  // bottom status bar
  c.fillStyle = "#0b1120";
  c.fillRect(0, SIM_H - 70, SIM_W, 70);
  c.fillStyle = "#5f6f9c";
  c.fillText("REC 00:00  SIMULATED CAPTURE FRAME, TRAINING ONLY", 40, SIM_H - 26);
  // the embedded live B mode image
  const e = SIM_EMBED;
  if (els.video.readyState >= 2 && els.video.videoWidth > 0) {
    c.drawImage(els.video, e.x, e.y, e.w, e.h);
  } else {
    c.fillStyle = "#000";
    c.fillRect(e.x, e.y, e.w, e.h);
  }
  c.strokeStyle = "#1a2650";
  c.lineWidth = 2;
  c.strokeRect(e.x - 1, e.y - 1, e.w + 2, e.h + 2);
}

// ---------- ROI persistence, geometry, interaction ----------

function roiKey(src) {
  return `plexus.roi.${src}`;
}

function loadRoi(src) {
  try {
    const raw = localStorage.getItem(roiKey(src));
    if (!raw) return null;
    const r = JSON.parse(raw);
    if (r && r.w > 0 && r.h > 0) return r;
  } catch {
    /* ignore */
  }
  return null;
}

function saveRoi(src, roi) {
  try {
    if (roi) localStorage.setItem(roiKey(src), JSON.stringify(roi));
    else localStorage.removeItem(roiKey(src));
  } catch {
    /* storage unavailable, keep in memory */
  }
}

function setRoi(roi) {
  state.roi[state.source] = roi;
  saveRoi(state.source, roi);
  updateRoiUi();
}

// Fit the viewport and overlay canvas to the active source geometry so the
// overlay lands on the exact ROI region, not a stretched full frame.
function setViewportGeometry() {
  const n = sourceNatural();
  for (const cv of [els.overlay, els.refOverlay, els.guessOverlay]) {
    if (cv.width !== n.w || cv.height !== n.h) {
      cv.width = n.w;
      cv.height = n.h;
    }
  }
  els.viewport.style.aspectRatio = `${n.w} / ${n.h}`;
  els.resReadout.textContent = `${n.w}x${n.h} in, ${IMG} net`;
  updateRoiUi();
  updateReference();
}

function updateRoiUi() {
  const n = sourceNatural();
  const roi = currentRoi();
  if (roi) {
    els.roiRect.hidden = false;
    els.roiRect.style.left = `${(100 * roi.x) / n.w}%`;
    els.roiRect.style.top = `${(100 * roi.y) / n.h}%`;
    els.roiRect.style.width = `${(100 * roi.w) / n.w}%`;
    els.roiRect.style.height = `${(100 * roi.h) / n.h}%`;
    els.roiReadout.textContent = `${roi.w} x ${roi.h} at (${roi.x}, ${roi.y}) in ${n.w} x ${n.h}`;
  } else {
    els.roiRect.hidden = true;
    els.roiReadout.textContent = "not set";
  }
}

function armRoiDraw() {
  state.roiDrawing = true;
  els.roiLayer.hidden = false;
  els.roiDrawBtn.classList.add("active");
  setViewportMsg("Drag a rectangle over the B mode image to set the region of interest.");
}

function disarmRoiDraw() {
  state.roiDrawing = false;
  els.roiLayer.hidden = true;
  els.roiDrawBtn.classList.remove("active");
  setViewportMsg("");
}

function wireRoiInteraction() {
  const layer = els.roiLayer;
  let start = null;
  const toNatural = (ev) => {
    const rect = els.viewport.getBoundingClientRect();
    const n = sourceNatural();
    const px = ((ev.clientX - rect.left) / rect.width) * n.w;
    const py = ((ev.clientY - rect.top) / rect.height) * n.h;
    return {
      x: Math.max(0, Math.min(n.w, px)),
      y: Math.max(0, Math.min(n.h, py)),
    };
  };
  layer.addEventListener("pointerdown", (ev) => {
    if (!state.roiDrawing) return;
    layer.setPointerCapture(ev.pointerId);
    start = toNatural(ev);
  });
  layer.addEventListener("pointermove", (ev) => {
    if (!state.roiDrawing || !start) return;
    const cur = toNatural(ev);
    previewRect(start, cur);
  });
  layer.addEventListener("pointerup", (ev) => {
    if (!state.roiDrawing || !start) return;
    const cur = toNatural(ev);
    const roi = normRect(start, cur);
    start = null;
    if (roi.w >= 12 && roi.h >= 12) {
      setRoi(roi);
      disarmRoiDraw();
    } else {
      setViewportMsg("Region too small, drag a larger rectangle.");
    }
  });
}

function normRect(a, b) {
  const x = Math.round(Math.min(a.x, b.x));
  const y = Math.round(Math.min(a.y, b.y));
  const w = Math.round(Math.abs(a.x - b.x));
  const h = Math.round(Math.abs(a.y - b.y));
  return { x, y, w, h };
}

function previewRect(a, b) {
  const n = sourceNatural();
  const r = normRect(a, b);
  els.roiRect.hidden = false;
  els.roiRect.style.left = `${(100 * r.x) / n.w}%`;
  els.roiRect.style.top = `${(100 * r.y) / n.h}%`;
  els.roiRect.style.width = `${(100 * r.w) / n.w}%`;
  els.roiRect.style.height = `${(100 * r.h) / n.h}%`;
}

// ---------- source switching ----------

function stopStream() {
  if (state.stream) {
    for (const t of state.stream.getTracks()) t.stop();
    state.stream = null;
  }
  if (els.video.srcObject) els.video.srcObject = null;
}

function setSourceButtons() {
  els.srcClipBtn.classList.toggle("active", state.source === "clip");
  els.srcHdmiBtn.classList.toggle("active", state.source === "hdmi");
  els.srcGrabberBtn.classList.toggle("active", state.source === "grabbersim");
  els.srcNoiseBtn.classList.toggle("active", state.source === "noise");
  els.clipRow.hidden = !(state.source === "clip" || state.source === "grabbersim");
  els.deviceRow.hidden = state.source !== "hdmi";
  els.noiseCanvas.hidden = state.source !== "noise";
  els.simCanvas.hidden = state.source !== "grabbersim";
  els.video.hidden = state.source === "noise" || state.source === "grabbersim";
  els.playBtn.disabled = !(state.source === "clip" || state.source === "grabbersim");
}

function setViewportMsg(text) {
  els.viewportMsg.textContent = text || "";
  els.viewportMsg.hidden = !text;
}

async function playClip(id) {
  stopStream();
  state.clip = id;
  els.video.srcObject = null;
  els.video.src = `clips/${id}.mp4`;
  els.video.loop = true;
  els.video.muted = true;
  const clip = CLIPS.find((c) => c.id === id);
  els.clipNoteReadout.textContent = clip ? clip.note : "";
  try {
    await els.video.play();
  } catch (e) {
    setViewportMsg(`clip failed to play: ${e.message}`);
  }
  updatePlayIcon();
}

async function useClip(id) {
  await playClip(id);
  await loadRefForClip(id);
  els.sourceReadout.textContent = `clip ${id}.mp4`;
  setViewportGeometry();
  updateRefControls();
  refuseGate();
}

async function useGrabberSim(id) {
  await playClip(id);
  await loadRefForClip(id);
  els.sourceReadout.textContent = "grabber sim, clip in 1080p capture";
  els.clipNoteReadout.textContent = "embedded B mode, define the ROI";
  setViewportGeometry();
  updateRefControls();
  refuseGate();
}

function setHdmiStatus(text, tone) {
  els.hdmiStatus.hidden = !text;
  els.hdmiStatus.textContent = text || "";
  els.hdmiStatus.dataset.tone = tone || "";
}

// Map the getUserMedia failure names to specific, actionable operator guidance.
function hdmiErrorMessage(e) {
  switch (e.name) {
    case "NotAllowedError":
    case "SecurityError":
      return "camera permission denied. Grant camera access to this page, then rescan. The grabber presents as a camera.";
    case "NotFoundError":
    case "OverconstrainedError":
      return "no matching video input found. Plug in the USB HDMI grabber, confirm the ultrasound HDMI out is connected, then rescan.";
    case "NotReadableError":
    case "AbortError":
      return "the video device is busy or unreadable. Close any other app using the grabber (Zoom, OBS, QuickTime) and retry.";
    case "TypeError":
      return "media capture is unavailable in this context. Serve over http://localhost or https, which this app does.";
    default:
      return `video input unavailable (${e.name}). Check the grabber connection and retry.`;
  }
}

async function useHdmi(deviceId) {
  stopStream();
  els.video.removeAttribute("src");
  els.video.load();
  els.sourceReadout.textContent = "HDMI capture device";
  els.clipNoteReadout.textContent = "live volunteer scan";
  setViewportMsg("requesting video input permission");
  setHdmiStatus("opening capture device...", "wait");

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    setViewportMsg("this browser does not expose camera capture. Use a current Chrome, Edge, or Safari over localhost.");
    setHdmiStatus("getUserMedia not available in this browser", "bad");
    return;
  }

  // Ask for a high resolution but never over constrain: ideal lets the grabber
  // return its native mode (1080p, 720p, 480p, and other aspect ratios) which
  // the viewport and ROI space then adapt to.
  const base = { width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 30 } };
  const constraints = {
    video: deviceId ? { deviceId: { exact: deviceId }, ...base } : base,
    audio: false,
  };
  try {
    state.stream = await navigator.mediaDevices.getUserMedia(constraints);
  } catch (e) {
    // one retry with the loosest possible request before giving up
    if (e.name === "OverconstrainedError" || e.name === "NotFoundError") {
      try {
        state.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      } catch (e2) {
        failHdmi(e2);
        return;
      }
    } else {
      failHdmi(e);
      return;
    }
  }

  try {
    els.video.srcObject = state.stream;
    await els.video.play();
  } catch (e) {
    failHdmi(e);
    return;
  }

  setViewportMsg("");
  const track = state.stream.getVideoTracks()[0];
  const s = track ? track.getSettings() : {};
  const w = s.width || els.video.videoWidth || 0;
  const h = s.height || els.video.videoHeight || 0;
  const fr = s.frameRate ? `${Math.round(s.frameRate)} fps` : "unknown fps";
  els.sourceReadout.textContent = `HDMI grabber, ${track ? track.label || "video input" : "video input"}`;
  setHdmiStatus(`capturing ${w} x ${h} at ${fr}. Draw the B mode ROI over the ultrasound image inside the frame.`, "good");
  setViewportGeometry(); // adapts viewport and ROI space to the real resolution
  updateRefControls();
  refuseGate();
  await refreshDevices(); // labels become available after permission
}

function failHdmi(e) {
  stopStream();
  const msg = hdmiErrorMessage(e);
  setViewportMsg(msg);
  setHdmiStatus(msg, "bad");
  console.warn("hdmi capture failed", e.name, e.message);
}

async function refreshDevices() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    els.deviceSelect.innerHTML = "";
    const o = document.createElement("option");
    o.textContent = "device enumeration unavailable";
    o.value = "";
    els.deviceSelect.appendChild(o);
    setHdmiStatus("this browser does not support device enumeration", "bad");
    return;
  }
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cams = devices.filter((d) => d.kind === "videoinput");
    els.deviceSelect.innerHTML = "";
    if (cams.length === 0) {
      const o = document.createElement("option");
      o.textContent = "no video input devices detected";
      o.value = "";
      els.deviceSelect.appendChild(o);
      if (state.source === "hdmi") {
        setHdmiStatus("no video input devices found. Plug in the USB HDMI grabber and rescan.", "bad");
      }
      return;
    }
    let unlabeled = 0;
    for (const c of cams) {
      const o = document.createElement("option");
      o.value = c.deviceId;
      if (c.label) o.textContent = c.label;
      else { unlabeled++; o.textContent = `video input ${els.deviceSelect.length + 1}`; }
      els.deviceSelect.appendChild(o);
    }
    if (state.source === "hdmi" && !state.stream) {
      setHdmiStatus(
        unlabeled === cams.length
          ? `${cams.length} video input(s) found. Names appear after you grant camera permission. Select one to open it.`
          : `${cams.length} video input(s) found. Select the grabber to open it.`,
        "wait"
      );
    }
  } catch (e) {
    console.warn("enumerateDevices failed", e);
    setHdmiStatus(`could not enumerate devices (${e.name}).`, "bad");
  }
}

function useNoise() {
  stopStream();
  els.video.pause();
  els.sourceReadout.textContent = "synthetic noise, honesty check";
  els.clipNoteReadout.textContent = "no anatomy present, score must fall toward 0";
  setViewportGeometry();
  updateRefControls();
  refuseGate();
}

async function setSource(src) {
  if (state.replaying) exitReplay();
  if (state.selftest.active) resetSelfTest();
  if (state.frozen) setFrozen(false); // switching source resumes live
  state.source = src;
  state.roi[src] = loadRoi(src);
  disarmRoiDraw();
  setSourceButtons();
  clearOverlay(els.overlay.getContext("2d"));
  state.lastResult = null;
  if (src === "clip") await useClip(state.clip);
  else if (src === "grabbersim") await useGrabberSim(state.clip);
  else if (src === "hdmi") await useHdmi(els.deviceSelect.value || undefined);
  else useNoise();
}

// If no ROI is set, refuse to infer and say so instead of feeding the whole
// frame silently. This is the adversarial requirement for the ROI layer.
function refuseGate() {
  if (state.source === "hdmi" && !state.stream) return; // hdmi shows its own msg
  if (!currentRoi()) {
    setViewportMsg(
      "No region of interest set. Draw the B mode rectangle (or Use whole frame) to enable inference. The model will not read the raw capture frame."
    );
    clearReadouts();
    return true;
  }
  setViewportMsg("");
  return false;
}

function clearReadouts() {
  clearOverlay(els.overlay.getContext("2d"));
  els.confValue.textContent = "--";
  els.confState.textContent = "inference disabled until a region of interest is set";
  els.confBarFill.style.width = "0%";
  els.qualityValue.textContent = "--";
  els.qualityLabel.textContent = "no region of interest";
  els.qualityBarFill.style.width = "0%";
  els.qPresence.textContent = "--";
  els.qCentering.textContent = "--";
  els.qCoherence.textContent = "--";
  els.qArea.textContent = "--";
  els.nervePx.textContent = "--";
  els.needlePx.textContent = "--";
}

// ---------- readouts ----------

function fmtPct(x, digits = 1) {
  return `${(100 * x).toFixed(digits)}%`;
}

function updateReadouts(r, grade) {
  if (r.structPx > 0) {
    els.confValue.textContent = fmtPct(r.meanStructConf);
    els.confState.textContent =
      "raw uncalibrated softmax, can read high even when the model is wrong";
    els.confBarFill.style.width = `${Math.min(100, 100 * r.meanStructConf)}%`;
  } else {
    els.confValue.textContent = "--";
    els.confState.textContent = "no structure detected in this frame";
    els.confBarFill.style.width = "0%";
  }

  els.qualityValue.textContent = grade.score.toFixed(1);
  els.qualityLabel.textContent = qualityLabel(grade);
  els.qualityBarFill.style.width = `${Math.min(100, grade.score)}%`;
  els.qPresence.textContent = grade.presence.toFixed(3);
  els.qCentering.textContent = grade.centering.toFixed(3);
  els.qCoherence.textContent = grade.coherence.toFixed(3);
  els.qArea.textContent = String(grade.area);

  els.nervePx.textContent = String(r.nervePx);
  els.needlePx.textContent = String(r.needlePx);

  state.inferEma =
    state.inferEma == null ? r.inferMs : 0.85 * state.inferEma + 0.15 * r.inferMs;
  els.inferReadout.textContent = `${state.inferEma.toFixed(1)} ms`;
  const now = performance.now();
  state.fpsWindow.push(now);
  while (state.fpsWindow.length > 2 && now - state.fpsWindow[0] > 2000) {
    state.fpsWindow.shift();
  }
  if (state.fpsWindow.length > 1) {
    const span = now - state.fpsWindow[0];
    const fps = ((state.fpsWindow.length - 1) / span) * 1000;
    els.fpsReadout.textContent = `${fps.toFixed(1)} fps`;
  }
}

// ---------- main loop ----------

const overlayCtx = els.overlay.getContext("2d");
const refOverlayCtx = els.refOverlay.getContext("2d");
const guessOverlayCtx = els.guessOverlay.getContext("2d");

async function tick() {
  if (!state.replaying && !state.frozen && state.modelReady && sourceHasFrame() && !state.loopBusy) {
    state.loopBusy = true;
    try {
      if (state.source === "noise") drawNoiseFrame();
      else if (state.source === "grabbersim") drawSimFrame();
      if (!currentRoi()) {
        refuseGate();
      } else {
        setViewportMsg("");
        const gray = preprocess();
        const r = await infer(gray);
        state.lastResult = r;
        const grade = gradeScan(r.seg, r.conf);
        renderOverlay(overlayCtx, r.seg, overlayOpts());
        updateReadouts(r, grade);
        updateReference();
        if (state.recording) captureSessionFrame(r, grade);
      }
    } catch (e) {
      console.error("inference tick failed", e);
    } finally {
      state.loopBusy = false;
    }
  }
  requestAnimationFrame(tick);
}

function overlayOpts() {
  return {
    showNerve: state.showNerve,
    showNeedle: state.showNeedle,
    opacity: state.opacity,
    rect: currentRoi(),
  };
}

function repaintOverlay() {
  if (!state.lastResult || !currentRoi()) return;
  renderOverlay(overlayCtx, state.lastResult.seg, overlayOpts());
}

// ---------- freeze and capture ----------

function updatePlayIcon() {
  const playing = !els.video.paused;
  els.playIcon.style.display = playing ? "none" : "";
  els.pauseIcon.style.display = playing ? "" : "none";
}

function setFrozen(frozen) {
  state.frozen = frozen;
  els.frozenChip.hidden = !frozen;
  els.freezeBtn.classList.toggle("active", frozen);
  if (state.source === "clip" || state.source === "grabbersim") {
    if (frozen) els.video.pause();
    else els.video.play().catch(() => {});
    updatePlayIcon();
  }
}

function capturePng() {
  const n = sourceNatural();
  const out = document.createElement("canvas");
  out.width = n.w;
  out.height = n.h;
  const ctx = out.getContext("2d");
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, n.w, n.h);
  ctx.drawImage(activeSourceEl(), 0, 0, n.w, n.h);
  ctx.drawImage(els.overlay, 0, 0, n.w, n.h);
  const barH = Math.max(18, Math.round(n.h * 0.05));
  ctx.fillStyle = "rgba(7, 11, 24, 0.75)";
  ctx.fillRect(0, n.h - barH, n.w, barH);
  ctx.fillStyle = "#F6EFD6";
  ctx.font = `${Math.round(barH * 0.55)}px ui-monospace, Menlo, monospace`;
  const conf = state.lastResult && state.lastResult.structPx > 0
    ? fmtPct(state.lastResult.meanStructConf)
    : "none";
  ctx.fillText(
    `TRAINING AID ONLY  ${els.sourceReadout.textContent}  conf ${conf}  ${new Date().toISOString()}`,
    6, n.h - Math.round(barH * 0.3)
  );
  const a = document.createElement("a");
  const src = state.source === "clip" || state.source === "grabbersim" ? state.clip : state.source;
  a.download = `plexus_${state.source}_${src}_${Date.now()}.png`;
  a.href = out.toDataURL("image/png");
  a.click();
}

// ---------- session record and review ----------
// Everything stays in browser memory. No fetch, no upload. A recorded frame
// keeps the source image, the raw segmentation, and the live numbers so the
// overlay can be re rendered exactly on replay.

const capCanvas = document.createElement("canvas");
const capCtx = capCanvas.getContext("2d");

function captureSessionFrame(r, grade) {
  if (state.session.length >= SESSION_MAX) {
    stopRecording();
    setViewportMsg("Session buffer full, recording stopped. Clear to record again.");
    return;
  }
  const n = sourceNatural();
  const scale = Math.min(1, CAP_MAX_DIM / Math.max(n.w, n.h));
  const cw = Math.max(1, Math.round(n.w * scale));
  const ch = Math.max(1, Math.round(n.h * scale));
  if (capCanvas.width !== cw || capCanvas.height !== ch) {
    capCanvas.width = cw;
    capCanvas.height = ch;
  }
  capCtx.drawImage(activeSourceEl(), 0, 0, cw, ch);
  state.session.push({
    img: capCanvas.toDataURL("image/jpeg", 0.7),
    natW: n.w,
    natH: n.h,
    seg: r.seg.slice(),
    roi: { ...currentRoi() },
    nervePx: r.nervePx,
    needlePx: r.needlePx,
    structPx: r.structPx,
    meanStructConf: r.meanStructConf,
    grade: {
      score: grade.score,
      presence: grade.presence,
      centering: grade.centering,
      coherence: grade.coherence,
      area: grade.area,
    },
    source: els.sourceReadout.textContent,
    clip: state.clip,
  });
  updateSessionUi();
}

function updateSessionUi() {
  const n = state.session.length;
  els.sessScrub.max = String(Math.max(0, n - 1));
  els.sessCount.textContent = state.replaying
    ? `${state.replayIndex + 1} / ${n}`
    : `${n} / ${n}`;
  els.sessReplayBtn.disabled = n === 0;
  els.sessClearBtn.disabled = n === 0 || state.recording;
  els.sessPlayBtn.disabled = !state.replaying || n === 0;
  els.sessScrub.disabled = !state.replaying || n === 0;
}

function startRecording() {
  if (state.replaying) exitReplay();
  state.recording = true;
  els.recChip.hidden = false;
  els.sessRecBtn.textContent = "STOP";
  els.sessRecBtn.classList.add("active");
  els.sessState.textContent = "RECORDING";
  updateSessionUi();
}

function stopRecording() {
  state.recording = false;
  els.recChip.hidden = true;
  els.sessRecBtn.textContent = "RECORD";
  els.sessRecBtn.classList.remove("active");
  els.sessState.textContent = state.session.length ? "READY" : "IDLE";
  updateSessionUi();
}

function toggleRecording() {
  if (state.recording) stopRecording();
  else startRecording();
}

function enterReplay() {
  if (state.session.length === 0) return;
  if (state.recording) stopRecording();
  state.replaying = true;
  els.replayChip.hidden = false;
  els.sessState.textContent = "REVIEW";
  els.sessReplayBtn.classList.add("active");
  // hide live sources, show the replay canvas
  els.video.hidden = true;
  els.noiseCanvas.hidden = true;
  els.simCanvas.hidden = true;
  els.replayCanvas.hidden = false;
  els.video.pause();
  state.replayIndex = 0;
  els.sessScrub.value = "0";
  updateSessionUi();
  showReplayFrame(0);
}

function exitReplay() {
  stopReplayPlay();
  state.replaying = false;
  els.replayChip.hidden = true;
  els.replayCanvas.hidden = true;
  els.sessReplayBtn.classList.remove("active");
  els.sessState.textContent = state.session.length ? "READY" : "IDLE";
  setSourceButtons(); // restore correct source visibility
  setViewportGeometry();
  updateSessionUi();
}

const replayCtx = els.replayCanvas.getContext("2d");

function showReplayFrame(i) {
  const f = state.session[i];
  if (!f) return;
  state.replayIndex = i;
  // size overlay and replay canvas to the stored natural geometry
  if (els.overlay.width !== f.natW || els.overlay.height !== f.natH) {
    els.overlay.width = f.natW;
    els.overlay.height = f.natH;
  }
  els.replayCanvas.width = f.natW;
  els.replayCanvas.height = f.natH;
  els.viewport.style.aspectRatio = `${f.natW} / ${f.natH}`;
  const img = new Image();
  img.onload = () => {
    replayCtx.clearRect(0, 0, f.natW, f.natH);
    replayCtx.drawImage(img, 0, 0, f.natW, f.natH);
  };
  img.src = f.img;
  // re render the overlay from the stored segmentation into the stored ROI
  renderOverlay(overlayCtx, f.seg, {
    showNerve: state.showNerve,
    showNeedle: state.showNeedle,
    opacity: state.opacity,
    rect: f.roi,
  });
  // show the stored ROI outline
  const nn = { w: f.natW, h: f.natH };
  els.roiRect.hidden = false;
  els.roiRect.style.left = `${(100 * f.roi.x) / nn.w}%`;
  els.roiRect.style.top = `${(100 * f.roi.y) / nn.h}%`;
  els.roiRect.style.width = `${(100 * f.roi.w) / nn.w}%`;
  els.roiRect.style.height = `${(100 * f.roi.h) / nn.h}%`;
  // drive the readouts from stored values
  const r = {
    structPx: f.structPx,
    meanStructConf: f.meanStructConf,
    nervePx: f.nervePx,
    needlePx: f.needlePx,
    inferMs: state.inferEma || 0,
  };
  updateReadouts(r, f.grade);
  els.sessScrub.value = String(i);
  els.sessCount.textContent = `${i + 1} / ${state.session.length}`;
}

function stopReplayPlay() {
  state.replayPlaying = false;
  if (state.replayTimer) {
    clearInterval(state.replayTimer);
    state.replayTimer = null;
  }
}

function toggleReplayPlay() {
  if (!state.replaying) return;
  if (state.replayPlaying) {
    stopReplayPlay();
    return;
  }
  state.replayPlaying = true;
  state.replayTimer = setInterval(() => {
    let next = state.replayIndex + 1;
    if (next >= state.session.length) {
      stopReplayPlay();
      return;
    }
    showReplayFrame(next);
  }, 133); // about 7.5 fps, the clip cadence
}

function clearSession() {
  if (state.replaying) exitReplay();
  state.session = [];
  els.sessScrub.value = "0";
  els.sessScrub.max = "0";
  els.sessCount.textContent = "0 / 0";
  els.sessState.textContent = "IDLE";
  updateSessionUi();
}

// Exposed for the automated round trip gate.
window.__sessionInfo = () => ({
  length: state.session.length,
  replaying: state.replaying,
  replayIndex: state.replayIndex,
});
window.__replaySnapshot = (i) => {
  showReplayFrame(i);
  const f = state.session[i];
  // count non transparent overlay pixels as proof the overlay re rendered
  const data = overlayCtx.getImageData(0, 0, els.overlay.width, els.overlay.height).data;
  let painted = 0;
  for (let p = 3; p < data.length; p += 4) if (data[p] > 0) painted++;
  return {
    storedNervePx: f.nervePx,
    storedNeedlePx: f.needlePx,
    storedConf: f.meanStructConf,
    storedScore: f.grade.score,
    shownNervePx: els.nervePx.textContent,
    shownConf: els.confValue.textContent,
    overlayPaintedPx: painted,
  };
};

// ---------- reference (ground truth) layer ----------

async function loadRefForClip(id) {
  try {
    state.reference = await loadReference(id);
    state.refIndex = -1;
  } catch (e) {
    state.reference = null;
    console.warn("reference load failed", e);
  }
}

function updateReference() {
  const ctx = refOverlayCtx;
  const clear = () => ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  if (!state.showReference || state.replaying) {
    clear();
    els.refOverlay.hidden = true;
    return;
  }
  els.refOverlay.hidden = false;
  if (state.source === "clip" && state.reference) {
    const idx = frameIndexFor(els.video, state.reference);
    state.refIndex = idx;
    renderReference(ctx, state.reference, idx, {
      showNerve: state.showNerve,
      showNeedle: state.showNeedle,
    });
    const f = state.reference.byIndex.get(idx);
    const hasNerve = f && f.nerve && f.nerve.length;
    const hasNeedle = f && f.needleTip;
    const needleTxt = state.reference.hasNeedle
      ? hasNeedle ? "present" : "none this frame"
      : "absent (needle free clip)";
    els.refReadout.textContent =
      `clip ${state.clip}, frame ${idx} of ${state.reference.frameCount - 1}, nerve GT ${hasNerve ? "present" : "none"}, needle GT ${needleTxt}`;
  } else {
    const mark = state.manualMark[state.source];
    renderManualMark(ctx, mark);
    els.refReadout.textContent = mark
      ? `manual instructor mark at (${Math.round(mark.x)}, ${Math.round(mark.y)}) in ${sourceNatural().w} x ${sourceNatural().h}`
      : "no dataset answer key for this source, place a manual reference mark";
  }
}

function setReferenceShown(on) {
  state.showReference = on;
  els.refToggle.checked = on;
  updateReference();
}

function markCapable() {
  return state.source !== "clip";
}

function armMarkPlace() {
  if (!markCapable()) return;
  state.markPlacing = true;
  els.markLayer.hidden = false;
  els.refMarkBtn.classList.add("active");
  setReferenceShown(true);
  setViewportMsg("Click the image where the nerve is, to drop the instructor reference mark.");
}

function disarmMarkPlace() {
  state.markPlacing = false;
  els.markLayer.hidden = true;
  els.refMarkBtn.classList.remove("active");
  setViewportMsg("");
}

function pointerToNatural(ev) {
  const rect = els.viewport.getBoundingClientRect();
  const n = sourceNatural();
  return {
    x: ((ev.clientX - rect.left) / rect.width) * n.w,
    y: ((ev.clientY - rect.top) / rect.height) * n.h,
  };
}

function wireMarkInteraction() {
  els.markLayer.addEventListener("pointerdown", (ev) => {
    const n = sourceNatural();
    if (state.guessPlacing) {
      const p = pointerToNatural(ev);
      placeSelfTestGuess(p);
      return;
    }
    if (!state.markPlacing) return;
    const p = pointerToNatural(ev);
    state.manualMark[state.source] = { x: p.x, y: p.y, r: Math.round(0.06 * Math.max(n.w, n.h)) };
    els.refMarkClearBtn.disabled = false;
    disarmMarkPlace();
    updateReference();
  });
}

function updateRefControls() {
  els.refMarkBtn.disabled = !markCapable();
  els.refMarkClearBtn.disabled = !state.manualMark[state.source];
}

// ---------- call it first self test ----------
// The student commits a call before any overlay is revealed, and is scored
// against the real dataset ground truth, never against the model. The model is
// shown afterward as a fallible second opinion.

function resetSelfTest() {
  const st = state.selftest;
  st.active = false;
  st.revealed = false;
  st.committed = null;
  st.guess = null;
  state.guessPlacing = false;
  els.markLayer.hidden = true;
  els.guessOverlay.hidden = true;
  guessOverlayCtx.clearRect(0, 0, els.guessOverlay.width, els.guessOverlay.height);
  els.stResult.hidden = true;
  els.stState.textContent = "OFF";
  els.stStartBtn.textContent = "START";
  els.stGuessBtn.classList.remove("active");
  els.stPrompt.textContent =
    "Freeze a frame, then start the self test. You commit your call before the model or the answer key is revealed.";
  stSetButtons();
}

function stTargetForSource() {
  // needle present clips test the nerve (really present). Needle absent clips
  // and the noise source test the needle, where the reference confirms there
  // is none, so the honest answer is to abstain.
  if (state.source === "clip" && !NEEDLE_ABSENT.has(state.clip)) return "nerve";
  return "needle";
}

function stSetButtons() {
  const st = state.selftest;
  els.stGuessBtn.disabled = !st.active || st.revealed;
  els.stAbstainBtn.disabled = !st.active || st.revealed;
  els.stRevealBtn.disabled = !st.active || st.revealed || !st.committed;
}

function startSelfTest() {
  if (!currentRoi()) {
    setViewportMsg("Set a region of interest before the self test.");
    return;
  }
  if (state.replaying) exitReplay();
  // draw a fresh frame for the synthetic source before freezing on it
  if (state.source === "noise") drawNoiseFrame();
  else if (state.source === "grabbersim") drawSimFrame();
  // freeze the current frame
  setFrozen(true);
  const st = state.selftest;
  st.active = true;
  st.revealed = false;
  st.committed = null;
  st.guess = null;
  st.target = stTargetForSource();
  st.frameIdx = state.source === "clip" && state.reference
    ? frameIndexFor(els.video, state.reference)
    : -1;
  // hide model and reference so the student cannot cheat
  clearOverlay(overlayCtx);
  refOverlayCtx.clearRect(0, 0, els.refOverlay.width, els.refOverlay.height);
  els.refOverlay.hidden = true;
  guessOverlayCtx.clearRect(0, 0, els.guessOverlay.width, els.guessOverlay.height);
  els.guessOverlay.hidden = false;
  els.stResult.hidden = true;
  els.stState.textContent = "AWAITING CALL";
  els.stStartBtn.textContent = "RESTART";
  const targetName = st.target === "nerve" ? "nerve (brachial plexus)" : "needle";
  els.stPrompt.textContent = st.target === "nerve"
    ? `Frozen. Place your call on the ${targetName}, then reveal. The model and the answer key are hidden until you commit.`
    : `Frozen. A needle may or may not be present. If you can identify a real needle, place your call on its tip; if not, ABSTAIN. Commit before revealing.`;
  stSetButtons();
}

function armGuessPlace() {
  if (!state.selftest.active || state.selftest.revealed) return;
  state.guessPlacing = true;
  els.markLayer.hidden = false;
  els.stGuessBtn.classList.add("active");
  setViewportMsg("Click your call on the image.");
}

function disarmGuessPlace() {
  state.guessPlacing = false;
  els.markLayer.hidden = true;
  els.stGuessBtn.classList.remove("active");
  setViewportMsg("");
}

function placeSelfTestGuess(p) {
  const st = state.selftest;
  st.guess = { x: p.x, y: p.y };
  st.committed = "guess";
  drawGuessMarker(p);
  disarmGuessPlace();
  els.stState.textContent = "CALL PLACED";
  stSetButtons();
}

function drawGuessMarker(p) {
  const ctx = guessOverlayCtx;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.strokeStyle = "#A4B5EB";
  ctx.fillStyle = "rgba(164,181,235,0.15)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(p.x, p.y, Math.round(0.05 * Math.max(ctx.canvas.width, ctx.canvas.height)), 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(p.x - 8, p.y); ctx.lineTo(p.x + 8, p.y);
  ctx.moveTo(p.x, p.y - 8); ctx.lineTo(p.x, p.y + 8);
  ctx.stroke();
  // label
  ctx.fillStyle = "#A4B5EB";
  ctx.font = "12px ui-monospace, Menlo, monospace";
  ctx.fillText("YOUR CALL", p.x + 12, p.y - 10);
}

function abstainSelfTest() {
  const st = state.selftest;
  if (!st.active || st.revealed) return;
  st.committed = "abstain";
  st.guess = null;
  disarmGuessPlace();
  guessOverlayCtx.clearRect(0, 0, els.guessOverlay.width, els.guessOverlay.height);
  els.stState.textContent = "ABSTAINED";
  stSetButtons();
}

function nerveCentroid256(seg) {
  let sx = 0, sy = 0, n = 0;
  for (let p = 0; p < IMG * IMG; p++) {
    if (seg[p] === 1) { sx += p % IMG; sy += (p / IMG) | 0; n++; }
  }
  return n ? { x: sx / n, y: sy / n, n } : null;
}

async function revealSelfTest() {
  const st = state.selftest;
  if (!st.active || st.revealed || !st.committed) return;
  // model second opinion on the frozen frame
  const gray = preprocess();
  const r = await infer(gray);
  const grade = gradeScan(r.seg, r.conf);
  renderOverlay(overlayCtx, r.seg, overlayOpts());

  const lines = [];
  const distrust = [];
  let verdict = "";
  let verdictClass = "st-neutral";

  const natW = sourceNatural().w;
  const natH = sourceNatural().h;

  if (st.target === "nerve") {
    // reference nerve mask in 256 space
    const ref = state.reference;
    renderReference(refOverlayCtx, ref, st.frameIdx, {
      showNerve: true, showNeedle: true,
    });
    els.refOverlay.hidden = false;
    const gt = nerveMaskAt(ref, st.frameIdx, IMG, IMG);
    let gsx = 0, gsy = 0, gn = 0;
    for (let p = 0; p < IMG * IMG; p++) if (gt[p]) { gsx += p % IMG; gsy += (p / IMG) | 0; gn++; }
    const gtC = gn ? { x: gsx / gn, y: gsy / gn } : null;
    const modelC = nerveCentroid256(r.seg);

    if (st.committed === "abstain") {
      verdict = "No credit, the nerve was present";
      verdictClass = "st-neutral";
      lines.push("You abstained, but the reference shows a real nerve in this frame.");
      lines.push("Abstaining here is honest caution, not an error, but it earns no point.");
    } else {
      const gx = Math.min(IMG - 1, Math.max(0, Math.round((st.guess.x / natW) * IMG)));
      const gy = Math.min(IMG - 1, Math.max(0, Math.round((st.guess.y / natH) * IMG)));
      const hit = gt[gy * IMG + gx] === 1;
      const dStudent = gtC ? Math.hypot(gx - gtC.x, gy - gtC.y) : NaN;
      const dModel = gtC && modelC ? Math.hypot(modelC.x - gtC.x, modelC.y - gtC.y) : NaN;
      verdict = hit ? "Correct, your call is inside the nerve" : "Miss, your call is outside the nerve";
      verdictClass = hit ? "st-good" : "st-bad";
      lines.push(`Your call to ground truth centroid: ${dStudent.toFixed(1)} px (256 space).`);
      lines.push(`Model centroid to ground truth centroid: ${isNaN(dModel) ? "n/a" : dModel.toFixed(1) + " px"}.`);
      if (!isNaN(dModel)) {
        lines.push(dStudent < dModel
          ? "You were closer to the answer key than the model."
          : "The model centroid was closer this time, but it is still only a second opinion.");
      }
    }
    // model vs reference agreement
    let inter = 0, uni = 0;
    for (let p = 0; p < IMG * IMG; p++) {
      const a = r.seg[p] === 1, b = gt[p] === 1;
      if (a || b) uni++; if (a && b) inter++;
    }
    const iou = uni ? inter / uni : 0;
    lines.push(`Model vs reference nerve IoU: ${iou.toFixed(3)}.`);
    if (iou < 0.5) distrust.push(`Model and reference disagree on the nerve (IoU ${iou.toFixed(3)}). Trust the anatomy, not the paint.`);
  } else {
    // needle target: reference confirms no needle on these sources
    if (state.source === "clip" && state.reference) {
      renderReference(refOverlayCtx, state.reference, st.frameIdx, { showNerve: true, showNeedle: true });
      els.refOverlay.hidden = false;
    }
    const refNeedle = false; // needle absent clips and noise have no needle reference
    if (st.committed === "abstain") {
      verdict = "Correct, you abstained";
      verdictClass = "st-good";
      lines.push("The reference confirms there is no needle here.");
      lines.push("You did not chase a target that is not there. This is the rewarded call.");
    } else {
      verdict = "Incorrect, there is no needle to mark";
      verdictClass = "st-bad";
      lines.push("The reference shows no needle in this source.");
      lines.push("You committed a needle call; abstaining was the correct, rewarded answer.");
    }
    if (r.needlePx > 0) {
      distrust.push(`The model painted a needle (${r.needlePx} px, ${(100 * r.meanStructConf).toFixed(1)}% confidence) where the reference has none. A confident model is not a correct model.`);
    }
  }

  // universal distrust check: confident but incoherent
  if (r.structPx > 0 && r.meanStructConf > 0.9 && grade.coherence < 0.15) {
    distrust.push(`Confidence ${(100 * r.meanStructConf).toFixed(1)}% with coherence ${grade.coherence.toFixed(3)}: the classic hallucination signature the distrust panel warns about.`);
  }

  els.stVerdict.textContent = verdict;
  els.stVerdict.className = `st-verdict ${verdictClass}`;
  els.stLines.innerHTML = lines.map((l) => `<div>${l}</div>`).join("");
  if (distrust.length) {
    els.stDistrust.hidden = false;
    els.stDistrust.innerHTML =
      `<div class="st-distrust-title">DISTRUST LESSON</div>` +
      distrust.map((d) => `<div>${d}</div>`).join("");
  } else {
    els.stDistrust.hidden = true;
  }
  els.stResult.hidden = false;
  els.stState.textContent = "REVEALED";
  st.revealed = true;
  stSetButtons();

  // expose for the automated gate
  window.__lastSelfTest = {
    source: state.source,
    clip: state.clip,
    target: st.target,
    committed: st.committed,
    verdict,
    verdictClass,
    distrustCount: distrust.length,
    modelNeedlePx: r.needlePx,
    modelConf: r.meanStructConf,
    coherence: grade.coherence,
  };
}

// Exposed for the automated self test gate: drive the flow deterministically.
window.__stApi = {
  start: startSelfTest,
  guessAt: (fx, fy) => {
    const n = sourceNatural();
    placeSelfTestGuess({ x: fx * n.w, y: fy * n.h });
  },
  abstain: abstainSelfTest,
  reveal: () => revealSelfTest(),
  state: () => ({ ...state.selftest }),
};

// ---------- ROI verification harness ----------
// Proves ROI cropping recovers the raw clip result. Runs entirely in browser on
// real model output; exposed for the automated gate and instructor spot checks.

function inferCrop(sourceEl, rect) {
  preCtx.drawImage(sourceEl, rect.x, rect.y, rect.w, rect.h, 0, 0, IMG, IMG);
  const rgba = preCtx.getImageData(0, 0, IMG, IMG).data;
  const gray = rgbaToGray(rgba, new Float32Array(IMG * IMG));
  return infer(gray);
}

function classIoU(segA, segB, cls) {
  let inter = 0;
  let uni = 0;
  for (let p = 0; p < segA.length; p++) {
    const a = segA[p] === cls;
    const b = segB[p] === cls;
    if (a || b) uni++;
    if (a && b) inter++;
  }
  return { inter, uni, iou: uni === 0 ? 1 : inter / uni };
}

async function roiSelfTest() {
  if (state.source !== "grabbersim") {
    return { error: "switch to grabbersim source first" };
  }
  els.video.pause();
  await new Promise((r) => setTimeout(r, 120)); // let the frame settle
  drawSimFrame();
  // raw: infer the clip full frame straight from the video element
  const raw = await inferCrop(els.video, {
    x: 0, y: 0, w: els.video.videoWidth, h: els.video.videoHeight,
  });
  // roi: infer the embedded B mode region cropped out of the 1080p sim frame
  const roi = await inferCrop(els.simCanvas, SIM_EMBED);
  const nerve = classIoU(raw.seg, roi.seg, 1);
  const needle = classIoU(raw.seg, roi.seg, 2);
  return {
    clip: state.clip,
    rawNervePx: raw.nervePx,
    roiNervePx: roi.nervePx,
    rawNeedlePx: raw.needlePx,
    roiNeedlePx: roi.needlePx,
    nerveIoU: Number(nerve.iou.toFixed(4)),
    needleIoU: Number(needle.iou.toFixed(4)),
  };
}

window.__roiSelfTest = roiSelfTest;

// Verify the frame mapping and that ground truth lands on the same anatomy the
// model highlights: compares the model nerve mask against the dataset ground
// truth nerve mask at the current clip frame, in 256 space.
window.__refCheck = async () => {
  if (state.source !== "clip" || !state.reference) {
    return { error: "select a recorded clip first" };
  }
  els.video.pause();
  await new Promise((r) => setTimeout(r, 120));
  const idx = frameIndexFor(els.video, state.reference);
  const gray = preprocess();
  const r = await infer(gray);
  const gt = nerveMaskAt(state.reference, idx, IMG, IMG);
  let inter = 0, uni = 0, gtPx = 0, modelPx = 0, sxGt = 0, syGt = 0;
  for (let p = 0; p < IMG * IMG; p++) {
    const a = r.seg[p] === 1;
    const b = gt[p] === 1;
    if (a) modelPx++;
    if (b) { gtPx++; sxGt += p % IMG; syGt += (p / IMG) | 0; }
    if (a || b) uni++;
    if (a && b) inter++;
  }
  return {
    clip: state.clip,
    frame: idx,
    modelNervePx: modelPx,
    gtNervePx: gtPx,
    gtCentroid256: gtPx ? [Math.round(sxGt / gtPx), Math.round(syGt / gtPx)] : null,
    nerveIoU_modelVsGT: uni ? Number((inter / uni).toFixed(4)) : 0,
  };
};

// ---------- wiring ----------

function wireControls() {
  els.srcClipBtn.addEventListener("click", () => setSource("clip"));
  els.srcHdmiBtn.addEventListener("click", () => setSource("hdmi"));
  els.srcGrabberBtn.addEventListener("click", () => setSource("grabbersim"));
  els.srcNoiseBtn.addEventListener("click", () => setSource("noise"));
  els.clipSelect.addEventListener("change", () => {
    if (state.source === "grabbersim") useGrabberSim(els.clipSelect.value);
    else useClip(els.clipSelect.value);
  });
  els.deviceSelect.addEventListener("change", () => useHdmi(els.deviceSelect.value));
  els.deviceRefresh.addEventListener("click", refreshDevices);
  els.playBtn.addEventListener("click", () => {
    if (els.video.paused) els.video.play().catch(() => {});
    else els.video.pause();
    updatePlayIcon();
  });
  els.freezeBtn.addEventListener("click", () => setFrozen(!state.frozen));
  els.captureBtn.addEventListener("click", capturePng);
  els.roiDrawBtn.addEventListener("click", () => {
    if (state.roiDrawing) disarmRoiDraw();
    else armRoiDraw();
  });
  els.roiWholeBtn.addEventListener("click", () => {
    const n = sourceNatural();
    // whole frame for clip and noise; for grabber sim, the embedded B mode
    if (state.source === "grabbersim") setRoi({ ...SIM_EMBED });
    else setRoi({ x: 0, y: 0, w: n.w, h: n.h });
    disarmRoiDraw();
    refuseGate();
  });
  els.roiClearBtn.addEventListener("click", () => {
    setRoi(null);
    state.lastResult = null;
    refuseGate();
  });
  els.nerveToggle.addEventListener("change", () => {
    state.showNerve = els.nerveToggle.checked;
    repaintOverlay();
  });
  els.needleToggle.addEventListener("change", () => {
    state.showNeedle = els.needleToggle.checked;
    repaintOverlay();
  });
  els.opacity.addEventListener("input", () => {
    state.opacity = Number(els.opacity.value) / 100;
    els.opacityReadout.textContent = `${els.opacity.value}%`;
    repaintOverlay();
    if (state.replaying) showReplayFrame(state.replayIndex);
  });
  els.video.addEventListener("loadedmetadata", setViewportGeometry);

  els.sessRecBtn.addEventListener("click", toggleRecording);
  els.sessReplayBtn.addEventListener("click", () => {
    if (state.replaying) exitReplay();
    else enterReplay();
  });
  els.sessClearBtn.addEventListener("click", clearSession);
  els.sessPlayBtn.addEventListener("click", toggleReplayPlay);
  els.sessScrub.addEventListener("input", () => {
    if (!state.replaying) return;
    stopReplayPlay();
    showReplayFrame(Number(els.sessScrub.value));
  });

  els.refToggle.addEventListener("change", () => setReferenceShown(els.refToggle.checked));
  els.refMarkBtn.addEventListener("click", () => {
    if (state.markPlacing) disarmMarkPlace();
    else armMarkPlace();
  });
  els.refMarkClearBtn.addEventListener("click", () => {
    state.manualMark[state.source] = null;
    els.refMarkClearBtn.disabled = true;
    updateReference();
  });

  els.stStartBtn.addEventListener("click", startSelfTest);
  els.stGuessBtn.addEventListener("click", () => {
    if (state.guessPlacing) disarmGuessPlace();
    else armGuessPlace();
  });
  els.stAbstainBtn.addEventListener("click", abstainSelfTest);
  els.stRevealBtn.addEventListener("click", () => { revealSelfTest(); });
}

async function boot() {
  els.overlay.width = FRAME_W;
  els.overlay.height = FRAME_H;
  els.noiseCanvas.width = FRAME_W;
  els.noiseCanvas.height = FRAME_H;
  els.simCanvas.width = SIM_W;
  els.simCanvas.height = SIM_H;
  els.resReadout.textContent = `${FRAME_W}x${FRAME_H} in, ${IMG} net`;

  for (const c of CLIPS) {
    const o = document.createElement("option");
    o.value = c.id;
    o.textContent = `${c.id}.mp4  (${c.note})`;
    els.clipSelect.appendChild(o);
  }

  state.roi.clip = loadRoi("clip");
  state.roi.grabbersim = loadRoi("grabbersim");
  state.roi.hdmi = loadRoi("hdmi");
  state.roi.noise = loadRoi("noise");

  wireControls();
  wireRoiInteraction();
  wireMarkInteraction();
  setSourceButtons();
  refreshDevices();

  els.bootStatus.textContent = "loading model, onnxruntime-web wasm";
  try {
    await loadModel();
    state.modelReady = true;
    els.bootStatus.textContent = "model loaded, wasm backend, 1 thread";
    els.bootPanel.classList.add("ready");
    console.log("studio: model loaded, starting loop");
  } catch (e) {
    els.bootStatus.textContent = `model failed to load: ${e.message}`;
    console.error("studio: model load failed", e);
  }

  await useClip(state.clip);
  els.clipSelect.value = state.clip;
  clearOverlay(overlayCtx);
  setViewportGeometry();
  refuseGate();
  requestAnimationFrame(tick);
}

boot();
