# References and tools: what was actually inspected, and what was taken from each

## Core references

| Reference | What could be inspected | What was taken from it |
|---|---|---|
| WORLDFOLD (zamta.io/worldfold) | The public page only. It is a waitlist landing page: no engine, download, licence or documentation was available | Ambition only: architectural scale, material response, a composed first view. It cannot be a dependency |
| ANIMA RES (animares.com) | Not opened in this session; your description was used | The standard for anatomy presentation: dark ground, controlled key light, anatomy you manipulate directly. No assets |
| Your museum and OR preview (`overlord-world-and-or.mp4`, the local `crisis-sim` scene) | The local scene code and its equipment models were read; the layout of the room was reused as a starting point | Pale anatomy on dark backdrops with a restrained warm highlight, kept for the gallery. The OR equipment is your licensed pack, loaded only on this machine |
| X-Ray Mirror (`X-Ray Mirror.html`) | The file's structure and dependencies: hand and pose tracking loaded from a CDN, three.js. Its origin is not recorded | The Mirror station launches it locally and says plainly what it is. A camera-free alternative is always offered. It is not part of the build |
| The 13 Muscles | Not re-opened in this session | Cause and effect: an action changes a visible mechanism (the section ring; ghosting a group; the film's prediction) |
| Semichenko's diorama prompt (X post) | The post could not be fetched; your description of it was used | Its specificity: named objects, materials, light, life, a fixed camera for capture, performance planning. Not its voxel style |

## Suggested later in this session

| Source | What was inspected | Verdict |
|---|---|---|
| `thebuggeddev/anatomy` | Repository metadata, file tree, README, `package.json`. Nine organ models (skin, pancreas, lungs, heart, liver, brain, eye, kidneys, intestine) and five images per organ; three.js with GSAP. GitHub reports **no licence** and the README is a starter template that does not say where the models came from. The live site returned only a shell to a plain fetch | A reference for an organ explorer's flow (location, structure, microscopic view, compare). **No assets or code used**: no licence, unknown provenance, and nothing in it covers airway, nerves or the plexus |
| `huahbo/ocularium` | Repository metadata, file tree and README. An eye lab built on the project above: 24 structures of an "HRA eye model", peel, opacity, search, a click-the-model quiz, a narrated tour, a draggable cross-section, a flow animation. GitHub reports no licence | Confirms the interaction vocabulary used here (peel or ghost, isolate, cut, identify on the model, guided tour). **A lead worth following:** its model appears to come from the Human Reference Atlas 3D reference organs, which could supply structures the CT software cannot outline (epiglottis, vocal folds). Not verified in this session |
| Three.js | In use (r170, plain modules, no build step) | Kept as the renderer. WebGPU was not adopted: nothing in this brief needs it, and the lightmap, probe and shadow path here is WebGL |
| React Three Fiber, Drei, React Postprocessing | Considered | Not adopted. The world is plain three.js with no React and no bundler; adopting them means a rewrite with no visual gain of its own. What they offer that matters here (environment lighting, contact shading, tone mapping, selective effects) is done directly. Bloom and depth of field were left out so that anatomy and readings stay sharp |

## Toolkit from the brief

| Resource | Used? | Note |
|---|---|---|
| Blender (scripted, headless) | **Yes** | The whole building, its baked light and probes, character retargeting, the draped patient, the anatomy exports. `tools/build_institute.py`, `convert_rocketbox.py`, `build_patient.py`, `zanatomy_export_figure.py` |
| TotalSegmentator and 3D Slicer | **Yes, offline** | The airway and neck exhibit. See `HEADNECK-CT.md` |
| TotalSegmentator's MCP server | Evaluated | A thin wrapper over the command line. One of its tools failed on a new output folder in 2.18.0. Not used for production |
| Poly Haven | **Yes** | 17 materials, a sky, 9 furniture and plant models (CC0) |
| Microsoft Rocketbox | **Yes** | Four rigged characters and one patient figure (MIT) |
| Z-Anatomy | **Yes** | The plexus and the atrium figure (CC BY-SA 4.0) |
| glTF Transform | **Yes** | Draco and WebP compression of the furniture and the building's textures |
| ambientCG, NIH 3D | Not needed this round | Poly Haven covered materials; NIH 3D was not re-searched |
| Blender MCP, blender-skills, gamedev skills, impeccable, hallmark, open-design | Not installed | Blender was driven directly by script, which is reproducible and leaves a record |
| threeui, glasswork, pro-threads, pixelfx, sprite-gen | Not used | The interface is small and plain; pixel and sprite work does not fit a realistic world |
| gsap-skills | Not used | Transitions are a few lines of CSS and camera easing |
| remotion, hyperframes, OpenMontage, video-shotcraft, anything2explainer, herk-edit-kit | Not used | The lesson film is the live 3D scene, frame-exact through `window.renderAt(t)`; no separate video pipeline was built. An exported video of it is not made yet |
| unity-mcp, universal-modder | Not used | No engine change was justified |
| Idol SDK | Not run | Still needs your Hugging Face login and two gated model licences. It produces a Gaussian splat with invented unseen sides, so it could only ever dress a scene, never supply anatomy |
