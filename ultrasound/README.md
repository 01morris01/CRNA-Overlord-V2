# Plexus Studio

A capture to overlay ultrasound training harness for anesthesia students. It plays a recorded brachial plexus clip, or streams a live scan of a consenting volunteer through a USB HDMI frame grabber, and draws a real time overlay of the structures a 3 class U-Net detects: nerve (cobalt fill, periwinkle contour) and needle (amber, labeled as an identified structure). Everything runs locally in the browser, inference is real onnxruntime-web WASM, nothing leaves the machine.

## What this is, and is not

This is courseware. It teaches probe handling and anatomy recognition. It is not a clinical device and it is built to refuse that role:

- Structure highlighting only. It never draws a trajectory, targeting reticle, or any cue about where to insert a needle. The needle overlay marks what the model detected, nothing more.
- A persistent, non dismissible banner states the training aid scope at all times.
- A mandatory calibrated distrust panel shows the live confidence next to the published accuracy ceiling (73 to 74 percent) and lists what the model does not know.
- No patient data, no diagnosis, no block success or pain prediction. Scan consenting fellow students only.

## Running it

```
node studio/server.mjs
```

Then open http://localhost:8765. The bundled server exists because onnxruntime-web needs `.wasm` served as `application/wasm` and video seeking wants Range support. There is also a `studio` entry in `.claude/launch.json` for the preview tooling.

## Connecting a real HDMI frame grabber

Any USB HDMI capture device (Epiphan AV.io, Elgato Cam Link, generic UVC grabbers) presents itself to the operating system as a webcam. Plug the ultrasound machine's HDMI output into the grabber, the grabber into USB, then in the app pick "HDMI capture device" and choose it from the device list. Grant the browser camera permission when asked. The rescan button re-enumerates devices after you plug something in.

## Sources

- Recorded clip: five real ultrasound clips (512x360). `s071`, `s123`, `s311` contain a needle and nerve. `s005`, `s187` contain no needle, use them to watch the needle overlay stay quiet.
- HDMI capture device: live input as above.
- Noise test: feeds synthetic noise to the model as an honesty check. The model will still paint fragments at high confidence, and the scan quality score collapses to 0 because the coherence gate detects the fragmentation. This is the lesson of the distrust panel made visible.

## Model contract

- `models/nerve_needle_unet.onnx`, input `input` [1,1,256,256] float32, output `logits` [1,3,256,256]. Classes: 0 background, 1 nerve, 2 needle.
- Preprocessing mirrors `real_data.py` exactly: grayscale, resize to 256x256, pixel divided by 255, no mean or std normalization.
- Per pixel softmax then argmax. The live confidence readout is the mean max softmax over detected structure pixels.
- The scan quality score is a direct port of `scan_quality.py`: score = 100 x presence x centering, where presence = mean nerve confidence x area adequacy x spatial coherence (largest connected component fraction mapped through 0.2 to 0.8, 4-connectivity like scipy).

## Files

- `index.html`, `styles.css`, the instrument panel UI
- `js/app.js`, sources, loop, controls, readouts
- `js/inference.js`, preprocessing and onnxruntime-web session
- `js/quality.js`, the scan quality grader port
- `js/overlay.js`, the segmentation painter
- `server.mjs`, static server with correct MIME types and Range support
- `models/`, `vendor/`, `clips/`, staged model, runtime, and clips

## BUILD NOTES, honest limitations

- The model is weak and the UI says so. Nerve Dice is 0.61 on held out subjects, and it was validated on 2 subjects only. Boundaries are ragged, blobs flicker frame to frame, and on some frames the nerve prediction wanders.
- The model cannot abstain. On pure noise it confidently paints scattered fragments (observed around 80 percent mean softmax). The scan quality coherence gate is the mitigation, it drives the score to 0 on fragmented predictions, but the confidence number itself stays misleadingly high. That mismatch is deliberately displayed, not hidden.
- Confidence is raw uncalibrated softmax. Typical readings on the needle clips are 97 to 98 percent, far above the published 73 to 74 percent ceiling, which is exactly why the ceiling is printed beside it.
- Browser resizing uses canvas bilinear sampling while training used OpenCV INTER_AREA. On these clips the difference did not visibly change the segmentations, but pixel parity with the Python pipeline is not exact.
- Temporal smoothing (the `temporal.py` work) is not applied here, each frame is scored independently, so readouts flicker at the model's true per frame variance.
- The HDMI path is implemented and degrades cleanly when no device or permission is available, but it was verified in this build only with the browser's permission denial path, not with physical grabber hardware.
- Observed performance on an Apple Silicon Mac, single threaded WASM: about 29 ms per inference, about 32 fps loop rate, comfortably real time for 7.5 fps clips.
