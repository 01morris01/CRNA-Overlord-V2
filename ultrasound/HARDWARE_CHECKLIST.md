# Plexus Studio, USB HDMI grabber checklist

Run this with a physical USB HDMI frame grabber and a consenting non patient volunteer only. This tool is a training aid. It never guides a needle and it is not for use on a patient. Scan a fellow student who has agreed to be scanned; nobody else.

This checklist has NOT been executed against physical hardware in this build. It is the protocol the operator follows; treat every step as unverified until you have done it yourself.

## 1. Before you connect

- Confirm the volunteer has consented and understands this is a training scan, not a clinical exam.
- Confirm the ultrasound machine has an HDMI output (or DVI/SDI with an adapter into the grabber).
- Have the grabber, a known good USB cable, and the HDMI cable ready. Prefer a USB 3 port for 1080p60.

## 2. Physical connection

1. Ultrasound HDMI out to the grabber HDMI in.
2. Grabber USB to the computer. Use a direct port, not an unpowered hub, for 1080p.
3. Wait for the operating system to enumerate the device (it appears as a UVC camera or "video input").

## 3. Confirm the OS sees it

- macOS: it shows up as a camera to any app; you can sanity check in Photo Booth, then quit Photo Booth so it is free.
- Windows: check Device Manager under Cameras or Imaging devices; close the Camera app if it opened.
- Only one application can hold the grabber at a time. Close Zoom, Teams, OBS, QuickTime, and any camera app before using the studio.

## 4. In the studio

1. Open the studio at http://localhost:8765 (run `node studio/server.mjs`).
2. Pick HDMI CAPTURE DEVICE.
3. If the device list is empty, press rescan. If still empty, reseat the USB cable and rescan.
4. Select the grabber from the list. Grant camera permission when the browser asks. Device names only appear after permission is granted.
5. Read the capture status line. It reports the detected resolution and frame rate (for example 1920 x 1080 at 60 fps). Confirm it matches the ultrasound output.

## 5. Define the region of interest

1. The grabber frame usually includes the ultrasound machine chrome (depth scale, patient banner, menus) around the B mode image.
2. Press DRAW ROI and drag a rectangle around the live B mode image only, excluding the chrome.
3. Inference will not run until the ROI is set. This is deliberate; the model must read the ultrasound image, not the whole capture frame.
4. The ROI persists, so you set it once per machine layout.

## 6. Sanity checks before teaching

- Freeze a frame with obvious anatomy and confirm the overlay lands on the structure, roughly, not in a corner. The model is weak (nerve Dice around 0.61); expect ragged and flickering boundaries.
- Watch the scan quality score. It should rise on a well framed compact structure and collapse on a poor or empty image. The distrust panel confidence stays high even when the model is wrong; that mismatch is the lesson, not a bug.
- Do a call it first self test: the student calls the structure before the overlay and the answer key are revealed.

## 7. Common failures and what they mean

| Symptom | Likely cause | Fix |
|---|---|---|
| Device list empty | grabber not enumerated | reseat USB, press rescan, try another port |
| Permission denied message | camera permission blocked | allow camera for this page in the browser site settings, rescan |
| Device busy or unreadable | another app holds the grabber | close Zoom, Teams, OBS, QuickTime, camera apps |
| Black frame, device opens | ultrasound HDMI out off or asleep | wake the ultrasound, confirm HDMI out is enabled |
| Wrong aspect or squashed image | grabber native mode differs | the app adapts to the reported resolution; redraw the ROI if the layout moved |
| Overlay drifts or flickers | true model per frame variance | expected; this model has no temporal smoothing |

## 8. Teardown

- Stop the capture (switch source or close the tab) to release the grabber.
- Recorded sessions live only in browser memory and are gone when you reload. Capture a PNG of any frame you want to keep.
- No scan data leaves the machine. There is no upload path.
