// content_report.mjs: write docs/overlord-world/CONTENT-VERIFICATION.md from the data the app actually ships.
//   node tools/content_report.mjs
// One row per statement a learner can be shown or scored on, with the printed page it was read on. Nothing is typed twice:
// if a statement is not in world/data/*.js it is not in the app, and if it is there it is listed here with its sources.
import { writeFileSync } from 'node:fs';
import { SOURCES, STRUCTURES, LESSON, FILM, CHALLENGE, STIM, OUTLINE } from '../world/data/plexus.js';
import { LEVELS, NARRATION, IDENTIFY, CASES, QUESTIONS } from '../world/data/regional.js';
const page = (k) => (SOURCES[k]?.cite || k).replace("Hadzic's Textbook of Regional Anesthesia and Acute Pain Management, 2nd ed., ch. 3, ", 'Hadzic 2e ch.3 ').replace('Nagelhout & Elisha, Nurse Anesthesia, 7th ed., ch. 50, ', 'Nagelhout 7e ch.50 ');
const src = (keys = []) => [...new Set(keys)].filter((k) => k !== 'ZA' && k !== 'NETTER').map(page).join('; ') || '(model only)';
const esc = (s) => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
const rows = []; const add = (where, text, keys) => rows.push(`| ${where} | ${esc(text)} | ${src(keys)} |`);
for (const [id, s] of Object.entries(STRUCTURES)) { if (s.fact) add('Explore: ' + s.name, s.fact, s.src); }
FILM.cues.forEach((c, i) => add(`Film, ${c.t}s`, c.say, c.src));
LESSON.forEach((s, i) => add(`Hands-on, step ${i + 1}`, s.say, s.src));
CHALLENGE.forEach((c) => add(`Challenge (${c.kind})`, `${c.ask} → ${c.why}`, c.src));
for (const [id, s] of Object.entries(STIM)) add('Stimulation layer: ' + (STRUCTURES[id]?.name || id), s.says, s.src);
for (const [k, L] of Object.entries(LEVELS)) add('Four ways in: ' + L.name, `Aimed at ${L.targets}. Used for: ${L.usedFor} Misses: ${L.misses} Beside it: ${L.near}`, L.src);
NARRATION.forEach((n, i) => add(`Regional narration, ${i + 1}`, n.say, n.src));
IDENTIFY.forEach((c) => add('Regional identify', `${c.ask} → ${c.why}`, c.src));
for (const c of CASES) { add('Case: ' + c.title, c.stem + ' Model answer: ' + c.model, c.src); for (const [k, [g, why]] of Object.entries(c.grade)) add(`Case: ${c.title} (${k}: ${g})`, why, c.src); for (const [t, truth, why] of c.reasons) add(`Case: ${c.title} (reason, ${truth ? 'true' : 'false'})`, `${t} ${why}`, c.src); }
QUESTIONS.forEach((q, i) => add(`Practice question ${i + 1} (${q.type})`, `${q.stem} → ${q.why}`, q.src));
const used = new Set(rows.flatMap((r) => r.split('|')[3].split(';').map((s) => s.trim())));
const md = `# Content verification

**What this lists.** Every statement the plexus exhibit can show a learner or score them on: ${rows.length} rows, generated
from \`world/data/plexus.js\` and \`world/data/regional.js\` by \`tools/content_report.mjs\`. Regenerate it after any edit.

**What "verified" means here.** Each statement was read in context on the cited printed page of the learner's own copy,
and the wording in the app is original (no passages are copied). A chapter or page range is never used as evidence: a
citation names the page the statement was read on. This reading was done by an AI assistant on 2026-11-10. **No anatomist,
CRNA or faculty member has reviewed it**, and the app says so in every source panel.

**Printed pages, not PDF positions.** All page numbers are the numbers printed on the page. In the PDFs that were used,
Hadzic's printed page N is PDF page N + 29, and Nagelhout's printed page N is PDF page N + 184.

**Sources.** ${Object.entries(SOURCES).filter(([k]) => k !== 'ZA').map(([k, v]) => v.cite).join(' · ')}

**A statement is scored only if** it is verified as above **and** \`tools/audit_plexus.py\` confirms that the model shows
it (48 of 48 checks on the corrected model; see \`PLEXUS-DISCREPANCIES.md\` for what was wrong in the source model).

**Outline mapping.** Items are filed under NBCRNA outline areas ${Object.entries(OUTLINE).map(([k, v]) => `${k} (${v})`).join(', ')}, from the 2025/2026
content outline. Practice questions are original; none is an NBCRNA item and no score here predicts an exam result.

## Looked for and not found: removed from the app

| Claim | What happened |
|---|---|
| Injury to the long thoracic nerve produces a winged scapula | Not found in context on the pages read. Removed from scored content. |
| Radial nerve injury produces wrist drop | Not found in context on the pages read. Removed from scored content. |
| The subclavian vein passes anterior to the anterior scalene | Not found in context on the pages read. Removed; the related audit check was dropped with it. |
| Root values of the median nerve | The two books differ (Hadzic's table gives C6 to T1). Shown nowhere and never tested. |
| Any needle path, ultrasound appearance, drug or dose | Nothing of this kind could be validated, so none is shown. |

## The second exhibit (airway and neck, from a CT scan)

It makes **no textbook statements**. Names come from the segmentation software's class list; every sentence about position
is computed from the reviewed masks of that one scan and is worded "measured on this scan". How the outlines were reviewed
and corrected, and their limits, are in \`HEADNECK-CT.md\`. Items are filed under I.A.2 (Basic sciences: respiratory anatomy).

## Every statement, where it is used, and where it was read

| Where | Statement | Read on |
|---|---|---|
${rows.join('\n')}
`;
writeFileSync(new URL('../docs/overlord-world/CONTENT-VERIFICATION.md', import.meta.url), md); console.log('rows', rows.length, 'sources used', used.size);
