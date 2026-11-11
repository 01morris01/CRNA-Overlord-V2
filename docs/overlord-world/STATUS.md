# Overlord world: status of the first playable slice

Branch `overlord/world-slice`, cut from the deployed commit `bcba0c3`. Working copy: `~/Desktop/overlord-next`.
Nothing here is committed, pushed or deployed. Date: 2026-11-10.

## How to run it

```bash
python3 ~/Desktop/overlord-next/tools/dev_server.py 8090
```

Then open http://localhost:8090/world/ and sign in with your Overlord account for that browser (or create one).

## What the slice is

Sign in, make a character, walk a small island, enter Anatomy Hall, take a six-step 3D lesson on the right brachial
plexus, identify structures with no labels, answer three practice questions, earn something, build with it on your
plot, and find all of it still there when you come back.

## Working now (tested)

| Part | What works | How it was checked |
|---|---|---|
| Sign-in | Uses the app's existing accounts (`core/auth.js`), unchanged | Playthrough; classic save compared byte for byte before and after |
| Character | Name, 6 skin tones, 6 hair styles, 6 hair colours, 8 scrub colours, cap, glasses, stethoscope; one earned item | Playthrough; saved options read back |
| Island | Third-person walking, jumping, camera, 5 places, 2 characters who talk, 4 field notes to find, a plot you build on | Real keyboard and mouse |
| Anatomy atlas | 102 named structures in 6 layers; rotate, zoom, show/hide layers, peel, isolate, names on/off, daylight or dark room | Real mouse |
| Lesson | Six steps; each ends with an action on the model; wrong actions are corrected, not skipped | Each step completed by clicking the model |
| Challenge | 8 of 14 items, no labels, confidence before the answer, feedback with the reason and source | Right picks marked right, wrong picks marked wrong, names never shown |
| Practice questions | 3 original items (2 multiple choice, 1 multiple correct response) with rationale and source | Playthrough |
| Later review | Missed: back in 1 day. Right but a guess: 2 days. Right and sure: 6 days. Due items come first | Clock moved forward 2 days in the test |
| Reward | 6 of 8 earns the nerve stimulator and a plexus sculpture; every correct answer earns blocks; wrong answers earn nothing | Playthrough |
| Building | Place and take back blocks and the sculpture on your plot | Real clicks |
| Return | Position, character, plot, field notes, rewards, learning record, greeting by name | Fresh page load |

Automated playthrough: **36 of 36 checks pass** with real keyboard and mouse (`playthrough-results.json`).
Geometric audit of the anatomy: **18 of 23 pass; the 5 that fail are documented differences in the source model**
(`plexus-audit.json`, and the section below).

## Devices tested

| Device | Result |
|---|---|
| This Mac (M4 Pro), Chrome, 1280 x 760 and 1440 x 860, real keyboard and mouse | Full playthrough passes; 16 to 17 ms a frame in both the island and the atlas |
| Chrome's phone emulation (390 x 664, touch events) | Layout fits, on-screen stick moves the player, lesson opens. Emulation only |
| Chrome's tablet emulation (1080 x 810, touch events) | Same. Emulation only |
| Real iPad or iPhone, Safari, Android, Windows | **Not tested** |
| iOS Simulator | **Not available**: this Mac has Xcode command-line tools but not full Xcode |

## Simplified, and labelled as such

- **The anatomy is the source model's.** It has no separate lateral cord, medial cord, C5 to T1 roots or phrenic nerve.
  The junction of divisions and cords is a rough knot. The musculocutaneous nerve is drawn only in the arm. The app
  says this on the Hall menu and wherever it matters, and never asks for those structures by clicking.
- **Verification status is "AI-checked".** I compared the lesson against the cited pages and ran a geometric audit.
  No anatomist or faculty member has reviewed it. Every source panel in the app says so.
- **Citations.** Six statements were read in context on the cited page (trunk formation, phrenic course and block,
  interscalene groove, musculocutaneous roots, nerve to subclavius, suprascapular origin). The rest cite the chapter
  page range where the topic is covered and still need a person to confirm the exact page.
- **The island is built in code**: blocks, props and the characters. It is the weakest art in the slice next to the
  anatomy, which is real sourced modelling. No purchased or downloaded environment art is used.
- **The two island characters are scripted.** Booth's lines are chosen by simple rules from your saved progress. No AI.
- **Scoring is rules only.** The clicked object's id is compared with the answer. No AI decides anything.

## Planned, not built

| Area | Planned |
|---|---|
| World | More places, classmates, co-op, a second plot tier, sound, a regional pavilion with needle path and ultrasound |
| Atlas | More regions, cross-sections, search, structures missing from this model (cords, roots, phrenic) from a reviewed source |
| Simulator | 3D operating room joined to Mock OR Day. Today the island's OR door only links to the existing page |
| Textbooks | Searchable index, topic pages, page-linked explanations. Today: three books indexed privately to find and check pages |
| SEE system | Outline-mapped question bank, cumulative and exam-style sessions. Today: three questions and one outline mapping |
| Accounts | Server accounts and sync. Today everything is per browser. See ACCOUNTS-MIGRATION.md |
| Idol | Not run. Needs your Hugging Face login and two gated model licences. See ASSET-LEDGER.md |

## Not done from your brief, and why

- **The voxel-diorama prompt.** It is not in this conversation. I wrote the scene specs to that level of detail
  (PLAN.md and the top of `world/js/game.js`) but could not match a prompt I have not seen.
- **Idol test in the browser.** Blocked on account access that only you can grant.
- **3D OR inside Mock OR Day.** Investigated and planned (PLAN.md), not built.
- **Real device testing.** No simulator available; no physical device driven.
