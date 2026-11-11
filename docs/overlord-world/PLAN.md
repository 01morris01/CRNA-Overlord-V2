# Overlord: one product, two directions

## The shape of it

After sign-in you have a character and a home (the island). From there you choose how to spend the session.

| Activity | Where | Direction | State |
|---|---|---|---|
| Explore and play | The island | Game | First slice built |
| Explore anatomy | Anatomy Hall | Realistic | First region built |
| Practice in the OR | The OR | Realistic | Exists as Mock OR Day; 3D room planned |
| Learn and prepare for the SEE | Lessons in the Hall, Review, exam sessions | Both | One lesson, three questions, mapping started |

## What the two directions share

- One account, one character, one saved record.
- Type (Inter Tight), the coral dot, pill controls, dark glass panels.
- Coral always means alive, active, or yours. Green always means correct. Nothing else uses them.
- The same anatomy files. The plexus you study in the Hall is the plexus that stands on your plot.
- The same rule for honesty: every screen says whether you are looking at sourced anatomy, a simplified model, or a
  scripted event.
- Booth as the voice: dry, quick, on your side. No profanity.

## Direction 1: the game world (the island)

**Scene.** A 72 by 72 metre island in open sea. A timber pier in a small bay on the south shore. A stone path north to
a round plaza with a dark basin fountain and the coral dot above it. North of the plaza, under a grass hill with
stone on its crown: Anatomy Hall, white walls, glass front, flat teal roof, coral door frame. East: the OR, low and
white with a long window and a coral canopy. West: Review, timber posts, plaster, stepped terracotta roof. South-east:
your plot behind a knee-high hedge. South-west: the regional pavilion, an honest building site.

**Materials.** Matte painted blocks, one metre each, with baked corner shading and slight colour variation per block.
Clear, faintly blue glass. Lamps and coral surfaces glow. Slim modelled posts, benches and a notice board, because
metre blocks are too coarse for thin things.

**Lighting.** Late afternoon. Warm sun from the south-west with soft shadows, cool sky fill, peach haze at the horizon.

**Movement.** Leaves and hedges sway, water moves and glints, clouds drift, pollen floats, field notes turn, the
groundskeeper walks a loop and Booth waves.

**Performance.** All blocks in four draw calls; plants and clouds instanced; one fixed shadow map; no post-processing;
pixel ratio capped. Measured 16 to 17 ms a frame on this Mac. Phones are untested.

**What you do.** Walk, jump and look. Find field notes that teach one fact each. Talk to Booth, who knows your record.
Read the board for what is due. Enter buildings. Build on your plot with blocks earned by correct answers, and stand
the anatomy you have mastered on it.

**What you learn.** Nothing is taught by a pop-up. The island teaches by sending you somewhere and by what you carry
back: the field notes are the lesson's key facts, the reward is the thing you learned, and the board shows your record.

**Next for the island.** A second and third hall; challenges that happen outdoors (trace a nerve as a path across the
island; carry the right block to the right site); classmates visiting plots through the room-code link the simulator
already uses; sound.

## Direction 2: the realistic environment

**Anatomy Hall (built).** One specimen in a daylight studio: soft grey-blue backdrop, a warm key light, a cool rim, a
contact shadow on the floor. A switch gives the dark museum room of direction A. Conventional atlas colours (nerves
yellow, arteries red, veins blue, muscle red-brown, bone ivory). Controls along the bottom: six layers, five views,
peel, restore, room. Rotate and zoom freely; click to read; hide names to test yourself.

**The OR (planned).** The existing Mock OR Day steps stay exactly as they are. The change is the last step, "Into the
OR": instead of only a flat monitor page, the case opens in a 3D room with the patient on the table, the machine at
the head, and the monitor readable in the room. The monitor and every control keep reading from the same engine and
the same message channel the instructor console already uses, so cases, records, rubrics and the two-computer link
are untouched. Order of work: (1) settle the model pack's licence; (2) a view-only 3D room that mirrors the existing
monitor; (3) interactions one at a time (mask, laryngoscope, flowmeters), each with a test that the 3D control and
the existing control produce the same engine call.

**Regional (planned).** The same plexus with a needle path and an ultrasound plane cut through it, joined to the
existing ultrasound trainer.

## How each direction runs

Both run in the browser, inside the existing site, in three.js. No install.

| | Luanti | Browser-native |
|---|---|---|
| Reaching it from the app | Leave the site, open a separate program, join a server | A link |
| Devices | Windows, macOS, Linux, Android. No official iPhone or iPad version | Anything with a current browser |
| Embedding in the site | Not possible officially; an unofficial web port exists with no releases | It is the site |
| Accounts and progress | Separate accounts; a mod can call out only if the server operator whitelists it, and there is no Overlord server to call | Same account and record as everything else |
| Deployment | Someone hosts and maintains a game server | Already deployed on Vercel as static files |
| Multiplayer | Built in | Has to be built; first step reuses the existing two-browser link |
| Realistic anatomy and OR | Not what a voxel engine is for | Same renderer as the game world |

Recommendation: browser-native for both. The realistic environment needs physically based materials, layered
transparency and exact picking, which three.js gives directly.

## Characters and progression

- Built from parts so anything can be swapped or added: skin, hair, scrubs, cap, glasses, stethoscope now; lab coats,
  badges, tools and patterns later.
- **Earned items are tools you have shown you can use** (the nerve stimulator first). They are visible on the
  character and listed as earned.
- **Two ledgers.** Game: character, items, blocks, plot, field notes. Learning: every unaided answer with its type
  (identified, applied, recalled, recognised), correctness, confidence and next due date. They are saved together and
  never mixed. Results screens show both, separately, and say which is which.
- Wrong answers earn nothing. A threshold reward needs 75% correct.

## SEE preparation

Source: NBCRNA 2025/2026 NCE and SEE Content Outline and the 2025 SEE Handbook (read on nbcrna.com, 2026-11-10).

- Four domains: Basic Sciences; Equipment, Instrumentation and Technology; General Principles of Anesthesia;
  Anesthesia for Surgical Procedures and Special Populations. On the SEE each is 25%.
- 240 questions in four hours, 40 of them unscored pretest items.
- Formats named by NBCRNA: multiple choice, multiple correct response, calculation, hotspot, drag and drop. A
  multiple-use drag and drop is being piloted on the SEE from 2 January 2027.

This slice maps to III.I Local/regional anesthetics: 1 Anatomy, 5 Peripheral blocks, 7 Ultrasound and/or nerve
stimulator guided concepts. Clicking a structure on the model is the same skill a hotspot item tests.

Plan: tag every lesson, challenge item and question with its outline code; build coverage per domain; add calculation
and drag-and-drop formats; add cumulative and timed sessions that draw across domains in the SEE's proportions.
Every question is original, carries a rationale and a source, and is labelled as not an NBCRNA item. Nothing will
claim to predict a score.

## Textbooks

Your folder holds 24 PDFs (Nagelhout 7e, Miller 10e, Barash 9e, Hadzic 2e, Stoelting, Netter 8e and others).

Done in this slice: three books converted to text **in a private scratch folder outside the repository**, searched to
locate and read the pages behind the lesson, and cited by title, edition, chapter and page. No textbook text or
figure is in the repository or the app.

Plan:
1. A private index (never committed, never deployed): per book, per page, the text and its headings.
2. A topic map built from the NBCRNA outline, each topic linked to the pages that cover it in each book.
3. Topic pages in the app with original explanations, each sentence carrying its sources, linked to the 3D model,
   lesson, challenge and questions for that topic.
4. Conflicts between books are shown as conflicts, with both citations. Gaps are shown as gaps.
5. Sharing: citations and original text can be shared. Book text and figures are never sent to classmates or a public
   repository. Note that questions sent to the AI graders include your answer and a rubric, not book text.

Two files in that folder are other companies' study products (Apex). They were not opened and will not be used as a
source for questions.
