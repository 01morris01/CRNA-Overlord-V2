# PLEXUS STUDIO, Training Station build ledger

Append only. Never edit a prior entry. New entries go at the bottom of the LEDGER section.

## TASKS

- T1. ROI capture layer. Operator draws the B mode rectangle once inside the full capture frame and it persists. Crop to that ROI before preprocessing. DoD: on a simulated real grabber frame (B mode embedded in 1080p with chrome), inference on the ROI matches inference on the raw clip within tolerance. Adversarial: no ROI set means the app refuses to infer and says so, it does not silently feed the whole frame.
- T2. Session record and review. Record a scan session (frames, overlay, confidence, quality) locally, no cloud. Scrub and replay. DoD: verified round trip, a recorded session replays with overlays intact.
- T3. Reference answer key layer. Import the real nerve masks and needle coordinates for the sample clips as ground truth, and allow an instructor to place a manual reference mark for a live volunteer scan. DoD: reference renders correctly against the matching frame; distinct from the model overlay in the UI.
- T4. Call it first self test. Student marks where they believe the nerve is, then the overlay and reference reveal. Score against the reference from T3, not the model. Show the model as a fallible second opinion and surface the distrust lesson whenever model and reference disagree or confidence is high while coherence is low. DoD: end to end on a real clip with real ground truth, scored numbers shown. Adversarial: on a needle absent or noise clip the correct answer is to abstain, and abstaining is rewarded, not penalized.
- T5. Real grabber readiness and test protocol. Robust device enumeration, resolution and aspect handling for common grabber outputs, graceful fallback, and a written hardware checklist the operator runs with a physical grabber. DoD: enumeration and fallback verified in browser; the physical grabber step is NOT VERIFIED and the DoD must not claim otherwise.
- T6. Final honesty and scope pass. Grep the whole studio tree: no UI copy states or implies the overlay is correct or ground truth, no insertion trajectory or targeting code exists, the training aid banner and ceiling stay pinned. DoD: clean grep output pasted, plus a final browser screenshot of the station in self test mode.

## BLOCKED

(none yet)

## LEDGER

## T0 Baseline confirmation
Status: DONE
Definition of done: Server starts, existing app renders live overlay with model loaded and zero blocking console errors, before any T1 change.
What I ran: node studio/server.mjs; Playwright navigate http://localhost:8765; waited for bootStatus == "model loaded, wasm backend, 1 thread"; screenshot.
Result: Boot status "model loaded, wasm backend, 1 thread". s071 clip playing, nerve overlay (2286 px, conf 98.0%), needle amber overlay, scan quality 47.9. Only console error is favicon.ico 404 (benign, preexisting). Screenshot studio/evidence/baseline.png.
Verified on: BROWSER RENDER
Caveats: Baseline only, no station features yet. Favicon 404 to be silenced.

## T1 ROI capture layer
Status: DONE
Definition of done:
1. The operator can draw a rectangle over the LIVE FIELD to define the B mode region of interest inside the full capture frame; the ROI persists across reloads (localStorage) per source type.
2. Before preprocessing, the active frame is cropped to the ROI, then resized to 256; the model overlay is painted back into the ROI rectangle, not stretched over the whole frame.
3. Adversarial: if no ROI is set, the app refuses to run inference, shows an explicit message, and does NOT silently feed the whole frame.
4. A GRABBER SIM source renders a dataset clip embedded inside a 1920x1080 canvas with fake, non clinical UI chrome. With the ROI set to the embedded B mode region, the model segmentation matches inference on the raw clip within tolerance (nerve intersection over union >= 0.85 on a frozen frame), proving ROI cropping recovers the raw result. Numbers produced in browser and pasted.
What I ran: node studio/server.mjs; Playwright at http://localhost:8765; on load with no ROI observed the refuse state; clicked USE WHOLE FRAME on the clip; switched to GRABBER SIM; ran window.__roiSelfTest() which pauses the frame, infers the raw clip full frame from the video element and infers the embedded B mode region cropped from the 1920x1080 sim canvas, then computes per class intersection over union.
Result:
  No ROI refuse state: confValue "--", quality "--", overlay cleared, viewport message "No region of interest set. Draw the B mode rectangle (or Use whole frame) to enable inference. The model will not read the raw capture frame." (studio/evidence/t1_refuse.png).
  Whole frame ROI on clip s071 restored inference: conf 98.3%, nervePx 2718, quality 49.1, roi "512 x 360 at (0, 0) in 512 x 360".
  ROI vs raw self test s071: rawNervePx 2587 vs roiNervePx 2588, rawNeedlePx 332 vs roiNeedlePx 333, nerveIoU 0.9973, needleIoU 0.9970.
  ROI vs raw self test s311: rawNervePx 1761 vs roiNervePx 1760, rawNeedlePx 284 vs roiNeedlePx 288, nerveIoU 0.9904, needleIoU 0.9724.
  Grabber sim render with overlay landing inside the ROI on the embedded B mode, chrome around it: studio/evidence/t1_grabbersim_roi.png. Console errors: 0.
Verified on: BROWSER RENDER, SYNTHETIC CLIP (dataset clips run through the real model)
Caveats: IoU is not 1.000 because the sim upscales the 512x360 clip to 910x640 then the ROI crop downsamples to 256, so bilinear resampling differs by a few boundary pixels from the raw 512 to 256 path; 0.97 to 0.997 is well within tolerance and the tiny needle class is the most sensitive. This proves cropping fidelity, not model correctness. ROI drawing was exercised programmatically for the whole frame and embed presets; freehand pointer drag uses the same normRect path and is wired to the roiLayer.

## T2 Session record and review
Status: DONE
Definition of done:
1. The operator can record a scan session locally with no network calls: each recorded inference frame stores the source image, the model segmentation, live confidence, and the scan quality grade in browser memory.
2. A recorded session can be scrubbed frame by frame and played back; the overlay re renders from the stored segmentation so nerve and needle highlighting appear intact on replay, and the trust and quality readouts show the stored values for that frame.
3. Round trip verified in browser: record a run, stop, scrub to a specific stored frame, and confirm the replayed overlay pixel count and confidence equal the values captured at record time (exact match on the stored numbers), and the overlay canvas is non empty on a frame that had structure.
4. No cloud: confirm zero network requests are generated by recording or replay (all in memory).
What I ran: Playwright at http://localhost:8765; set whole frame ROI on clip s071; snapshotted performance.getEntriesByType('resource').length; clicked RECORD, waited 4 s, clicked STOP; snapshotted resource count again; clicked REVIEW; scrubbed to frames 10, 40, 80, 118 via window.__replaySnapshot which re renders the stored segmentation and reads back the overlay pixels.
Result:
  Recorded 119 frames in memory. Network resource entries 12 before recording and 12 after, unchanged, so recording and replay made zero network requests (no cloud).
  Round trip stored vs replayed (exact):
    frame 10: stored nerve 2475 -> shown 2475, stored conf 0.9803 -> shown 98.0%, overlay painted 9805 px.
    frame 40: stored nerve 2881 -> shown 2881, conf 0.9802 -> 98.0%, painted 10350 px.
    frame 80: stored nerve 2352 -> shown 2352, conf 0.9790 -> 97.9%, painted 9579 px.
    frame 118: stored nerve 2766 -> shown 2766, conf 0.9825 -> 98.3%, painted 10289 px.
  Review render with REPLAY chip, frame 41/119, overlay intact, readouts from stored values: studio/evidence/t2_review.png. Console errors: 0.
Verified on: BROWSER RENDER, REAL GROUND TRUTH is not involved here (model output round trip)
Caveats: Stored frames are JPEG at quality 0.7 capped to 960 px, so the replayed background image is slightly compressed; the segmentation and all numbers are stored losslessly so the overlay and readouts are exact. Session lives in memory only and is lost on reload (no export was in scope). One console warning (getImageData willReadFrequently) is emitted only by the verification harness reading overlay pixels, not by normal use.

## T3 Reference answer key layer
Status: DONE
Definition of done:
1. The real nerve masks (ac_masks) and needle tip/tail coordinates (needle_coordinates) for the five studio clips are imported as ground truth via a precomputed compact artifact derived from the real dataset files (studio/reference/<sid>.json), nothing fabricated.
2. The reference overlay renders against the correct frame of the playing clip; the frame mapping is verified (the ground truth nerve contour lands on the same anatomy the model highlights, model vs ground truth nerve intersection over union clearly positive, not zero and not misplaced in a corner).
3. The reference is visually DISTINCT from the model overlay in the UI (different color and style, a GROUND TRUTH label) so a student can never confuse the answer key with the model second opinion.
4. For a live volunteer scan (no dataset ground truth), an instructor can place a manual reference mark on the image; it renders in the reference style and persists for that source.
What I ran: .venv/bin/python studio/tools/build_reference.py to derive studio/reference/<sid>.json from brachial_plexus/data/Sonosite ac_masks and needle_coordinates; Playwright at http://localhost:8765; window.__refCheck() which pauses the clip, computes the frame index by playhead proportion, rasterizes the dataset nerve mask at that frame, and compares it to the model nerve mask in 256 space; toggled the reference overlay on a frozen frame; placed a manual mark on the noise (live stand in) source by dispatching a pointer click on the mark layer.
Result:
  Artifacts built: s005 100 frames nerve on 100 needle ABSENT; s071 160 frames needle present 125 frames; s123 180 frames needle 139; s187 120 frames nerve on 119 needle ABSENT; s311 114 frames needle 114. Sizes 27 to 52 KB each.
  Frame mapping, model vs ground truth nerve IoU: s071 frame 66 IoU 0.9076 (model 1777 px, GT 1754 px, GT centroid 256 [49,84]); s123 frame 74 IoU 0.6883 (model 1441, GT 1944, centroid [36,69]); s311 frame 48 IoU 0.4162 (model 1402, GT 2603, centroid [36,77]). All clearly positive, centroids in the upper left plexus region, not corners, so the ground truth is aligned to the played frame. The spread 0.42 to 0.91 is the model's known Dice 0.61 imperfection, not a mapping error.
  Distinct render: cream dashed ground truth contour over the cobalt model fill, GROUND TRUTH chip, refReadout "clip s071, frame 69 of 159, nerve GT present, needle GT none this frame": studio/evidence/t3_reference.png.
  Manual mark: PLACE MANUAL MARK enabled on the noise source, click at viewport 35%/45% stored as (179, 162) in 512 x 360, rendered as a cream dashed ring plus cross distinct from the model, while the noise honesty check held (conf 81.0%, quality 0.0, coherence 0.000): studio/evidence/t3_manual_mark.png. Console errors: 0.
Verified on: REAL GROUND TRUTH, BROWSER RENDER
Caveats: Dataset reference is rendered for the recorded clip source; grabber sim and HDMI use the manual instructor mark path (dataset coordinates are not remapped into the embedded 1080p frame). The needle reference is drawn as a dotted segment plus tip and tail markers over the needle already present in the annotated frame (structure annotation), never an insertion path. The manual mark records a single instructor point with a fixed radius, it is not a traced contour.

## T4 Call it first self test
Status: DONE
Definition of done:
1. On a frozen frame the student commits first: they either place a guess mark on the target, or press ABSTAIN, before any overlay is revealed. The model overlay and the reference are hidden until the student commits.
2. On reveal the frame's model overlay, the reference (ground truth), and the student guess are shown together, and the student is scored against the REFERENCE from T3, not against the model.
3. The model is presented as a fallible second opinion, and the distrust lesson is surfaced whenever the model and the reference disagree, or the model confidence is high while spatial coherence is low.
4. End to end on a needle present real clip with real ground truth: the student marks the nerve, and scored numbers (hit or miss versus the ground truth nerve mask, distance, and whether the student beat the model) are shown.
5. Adversarial: on a needle absent clip (s005, s187) and on the noise source, the tested target is the needle, the reference shows no needle, so the correct call is to ABSTAIN. Abstaining is rewarded; committing a mark (chasing the model's phantom needle) is scored as the error. Design note: on needle present clips the target is the nerve (which is really present); the abstain reward applies only where the reference confirms the target is truly absent, so the station never teaches a student to abstain on a real structure.
What I ran: Playwright at http://localhost:8765; drove the self test with window.__stApi (start, guessAt, abstain, reveal) which mirror the on screen buttons; ran four scenarios; verified verdicts, scored numbers, and distrust lessons; captured screenshots.
Result:
  Nerve happy path, clip s071, student call placed then revealed: verdict "Correct, your call is inside the nerve" (good). Scored vs ground truth: your call to GT nerve centroid 5.0 px, model centroid to GT centroid 1.5 px, "the model centroid was closer this time, but it is still only a second opinion", model vs reference nerve IoU 0.908. Screenshot studio/evidence/t4_nerve_reveal.png.
  Adversarial abstain, needle absent clip s005, student ABSTAINED: verdict "Correct, you abstained" (good, rewarded). Distrust lesson fired: "The model painted a needle (59 px, 88.1% confidence) where the reference has none. A confident model is not a correct model." Screenshot studio/evidence/t4_abstain_reward.png.
  Adversarial commit penalized, noise source, student committed a call: verdict "Incorrect, there is no needle to mark" (bad). Distrust: "The model painted a needle (210 px, 84.1% confidence) where the reference has none." Model coherence 0.081 on noise.
  Adversarial commit penalized, needle absent clip s187, committed: verdict "Incorrect, there is no needle to mark" (bad).
  Model overlay, reference, and student call are all hidden until the student commits, then shown together on reveal. Scoring is always against the reference (ground truth nerve mask, or reference needle absence), never the model. Console errors: 0.
Verified on: REAL GROUND TRUTH, BROWSER RENDER
Caveats: The nerve score is a point in region test plus a distance to the ground truth centroid, not a full traced contour comparison; it credits a call that lands inside the real nerve mask. A stale frame bug was found during verification (switching source did not clear the frozen state, so the noise reveal reused a prior frame's inference); it was fixed so setSource resumes live and the synthetic sources draw a fresh frame before freezing, and the noise numbers then came back distinct (210 px vs the stale 59 px). The "confident yet incoherent" universal distrust line requires mean structure confidence above 0.9; on the noise frame tested the mean was 0.84 so that specific line did not fire, but the phantom needle distrust did and the main quality panel still shows coherence collapsing.

## T5 Real grabber readiness and test protocol
Status: DONE
Definition of done:
1. Device enumeration is robust: the app lists video input devices, handles the zero device case and the labels hidden before permission case, and offers a rescan.
2. Resolution and aspect handling: when a grabber stream starts, the app reads the actual track resolution and frame rate and adapts the viewport geometry and the ROI space to it, so common grabber outputs (1920x1080, 1280x720, 720x480 and other aspect ratios) are handled, not assumed to be 512x360. A readout shows the detected resolution.
3. Graceful fallback: permission denied, no device, device busy, and unsupported API each produce a clear, specific message and leave the rest of the app usable, with no uncaught error.
4. A written hardware checklist (studio/HARDWARE_CHECKLIST.md) lists the physical steps the operator runs with a real USB HDMI grabber.
5. Browser verification of enumeration and fallback only. The physical grabber path is NOT VERIFIED with real hardware and this entry does not claim otherwise.
What I ran: Playwright at http://localhost:8765; clicked HDMI CAPTURE DEVICE with no real camera; then mocked navigator.mediaDevices to test each path deterministically, using a real MediaStream from canvas.captureStream at 1280x720 and 1920x1080 to exercise resolution and aspect adaptation, and DOMException rejects for the error paths.
Result:
  Real attempt with no camera present: getUserMedia stayed pending on the browser permission prompt (neither resolved nor rejected), the app showed "opening capture device..." and stayed usable. This is the browser awaiting a user decision, so the success and error handling were verified with mocks below.
  Resolution and aspect adaptation (real captureStream): 1280x720 stream produced status "capturing 1280 x 720 at 30 fps...", frame readout "1280x720 in, 256 net", viewport aspect ratio "1280 / 720"; a separate 1920x1080 stream produced "1920x1080 in, 256 net" and a 16:9 viewport, MODEL RATE 25.6 fps, INFERENCE 30.7 ms, with live inference running on the ROI (conf 87 to 91%). The viewport and ROI space adapt to the reported resolution, they are not fixed at 512x360. Screenshot studio/evidence/t5_hdmi_1080p.png.
  Enumeration: 3 devices including 1 audio input filtered to 2 video inputs listed by label ("AV.io HD Video", "FaceTime HD Camera"); an all audio list collapsed to the "no video input devices detected" option with status "no video input devices found. Plug in the USB HDMI grabber and rescan."
  Graceful fallback (each leaves the app usable, no uncaught error): NotAllowedError to "camera permission denied. Grant camera access to this page, then rescan..."; NotReadableError to "the video device is busy or unreadable. Close any other app using the grabber..."; zero device case as above. srcClipBtn remained enabled throughout.
  Hardware checklist written: studio/HARDWARE_CHECKLIST.md (physical connection, OS device check, ROI over the B mode only, sanity checks, a failure table, teardown).
  Console errors: 0. Two console warnings are the intentional failHdmi console.warn diagnostics on the injected errors, not faults.
Verified on: BROWSER RENDER (enumeration, resolution adaptation, and fallback via real captureStream and mocked errors)
Caveats: NOT VERIFIED on physical USB HDMI grabber hardware. No Epiphan, Elgato, or AV.io device was connected in this build. The success path was proven with a synthetic MediaStream (canvas.captureStream), which exercises the same getUserMedia, track.getSettings, geometry, and inference code a real grabber would, but a real device can still differ in native modes, color range, and driver quirks. The hardware checklist is unexecuted; step 5 physical verification remains for the operator with real equipment.

## T6 Final honesty and scope pass
Status: DONE
Definition of done:
1. Grep the whole studio tree for insertion, trajectory, targeting, reticle, aim, block success, and pain prediction language; confirm no such feature exists and any occurrence is a scope disclaimer or the neutral self test word "target structure", not a guidance cue.
2. Confirm no UI copy states or implies the MODEL overlay is correct or is ground truth; the only "ground truth" usage is the reference answer key, which is legitimately the answer key.
3. Confirm the training aid banner and the 73 to 74 percent accuracy ceiling are still present and not dismissible.
4. Paste the grep output and capture a final browser screenshot of the station in self test mode.
What I ran: grep over studio index.html, styles.css, js, server.mjs, README.md, HARDWARE_CHECKLIST.md; then Playwright at http://localhost:8765 to confirm the banner and ceiling in the DOM and to capture the station in self test mode.
Result:
  Guidance feature grep (insert here, insertion, trajectory, reticle, crosshair, aim, where to insert, guide the needle, targeting): 6 hits, ALL are scope disclaimers or a UI cursor style, none is a feature:
    styles.css:406 "cursor: crosshair;" (ROI and mark draw cursor, not a reticle)
    index.html:19 banner "...it never indicates where to insert a needle."
    index.html:214 "this tool never draws a trajectory, target, or insertion cue"
    js/overlay.js:3 comment "Deliberately NO trajectory, reticle, or insertion cue"
    js/reference.js:101 comment "annotation, not a trajectory"
    README.md:9 "It never draws a trajectory, targeting reticle, or any cue about where to insert a needle."
  Block success / pain prediction grep: 1 hit, README.md:12 "No patient data, no diagnosis, no block success or pain prediction." (disclaimer of absence).
  Model correctness / ground truth grep: 2 hits, both honest: app.js "Model centroid to ground truth centroid: N px" (comparison, model is not the ground truth) and app.js "A confident model is not a correct model." The word "target" appears only as the self test's neutral structure variable (nerve or needle), never a targeting cue.
  "GROUND TRUTH" label appears only on the REFERENCE ANSWER KEY panel; the model overlay is labelled "ASSISTIVE, NOT AUTHORITATIVE" and described as "a fallible second opinion".
  Banner: index.html:13 <div class="banner" role="note"> with comment "Not dismissible by design"; no dismiss, close, or remove control exists in HTML or JS. DOM check bannerVisible true.
  Ceiling: index.html:150 shows 73 to 74 percent with a bar marker at 73 percent; DOM check ceiling "73to74%".
  Final station in self test mode showing the model overlay (cobalt), the reference ground truth (cream dashed), and the student's YOUR CALL marker (periwinkle) together, banner pinned, verdict "Correct, your call is inside the nerve": studio/evidence/t6_station_selftest.png. Console errors: 0.
Verified on: BROWSER RENDER, plus source grep
Caveats: The grep patterns are finite; a novel euphemism could evade them, but the overlay renderer (overlay.js) and reference renderer (reference.js) provably draw only filled regions, contours, and tip/tail structure markers, with no line extended beyond the annotated needle and no computed insertion vector anywhere in the code.
