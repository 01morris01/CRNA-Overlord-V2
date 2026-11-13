# What comes next

Short, and in order of what would change the experience most. Nothing here is built. `STATUS.md` says what is.

1. **Have people check the content.** An anatomist or CRNA faculty member for the corrected plexus model and its 124
   statements; a radiologist for the airway and neck outlines. Both exhibits say "checked by AI" until then.
2. **Carbon dioxide in the simulator.** The defect is reproduced and a correction is prepared (`CO2-FACULTY-REVIEW.md`).
   The 3D operating room now runs cases with the correction on by default and says so; the classic simulator is
   unchanged. Faculty need to confirm the correction or send the room back to the original rule.
3. **Have faculty look at how the room scores.** A case in the operating room is scored by the engine where the engine
   can observe and by the room's record elsewhere, and says "not judged here" where a rubric asks whether a drug, dose or
   setting was right. Faculty should decide whether that record is useful practice evidence as it stands, which of those
   judgments they want the engine to make, and whether the one guard (ready or stable is not credited below 90%
   saturation) is the right one.
4. **Real devices.** Nothing has been run on a real phone or tablet. Start with an iPad in Safari; the lower-cost mode
   exists but is tuned only by reasoning.
5. **The airway the scan software cannot outline.** Epiglottis, arytenoids and vocal folds are not in TotalSegmentator.
   The Human Reference Atlas 3D organs are the first lead; whatever is used gets the same review and ledger entry.
6. **A second regional series** (lower limb), built the same way: page-verified statements, an audited model, a case, a
   later review. The patch gains a tick for it.
7. **More of the case in the room.** Crises, a second pair of hands, regional and neuraxial cases, an instructor's
   seat, and the small things on the patient that are still only on the monitor: the IV line, the oximeter probe, the
   leads and the cuff. Hands are not animated; equipment appears where it is used.
8. **Better models for the script-built fittings.** The principal equipment is now professionally made and openly
   licensed. The surgical lights, ceiling supply arm, stools and cabinets were built by script because no open model was
   found. Newer CC BY models exist on Sketchfab that need your own sign-in to download ("Hospital operating room" by
   Chenchanchong, "Operating Room Roof Monitors" by kareem.elgayyar, "Anesthesia workstation on wheels" by
   Mr.Adeudo.59.94, "Patient Monitor" by Ram-je), and paid packs would go further. Any of them drops into
   `tools/clinical_set.py` the same way. The equipment also carries no printed labels yet.
9. **Accounts that follow you.** Everything is per browser (`ACCOUNTS-MIGRATION.md`). No sync is claimed anywhere.
10. **An exported lesson film.** The film is frame-exact through `window.renderAt(t)` and its narration is now
    recorded; a capture script would turn it into a short video without authoring it twice.
11. **Ultrasound.** Only recorded clips exist (the older trainer). A validated simulation is a separate project and
    should not be approximated with a texture.
12. **Caching before release.** The classic app's service worker fetches every file again in the background on each
    visit. That is fine for the classic app's small files and wasteful for the building's large ones (about 40 MB).
    Give the building's assets versioned names and a cache-first rule in `sw.js` before it goes to learners' phones.
