# Clinical sourcing for the Carson-Newman preanesthesia teaching cases

Every clinical assertion intended for `cn_preassessment_lap_chole_001` (Karen Whitfield)
and `cn_preassessment_npo_mh_001` (Brittany Cole) is traced here to the operator-supplied
source that supports it. Anything not traceable is listed in
[Unsourced, requires operator review](#unsourced-requires-operator-review) and must be
resolved by the operator before it is authored into scenario JSON. Items authored under an
operator decision carry a `needsReview` marker in the JSON.

**Status of `needsReview` markers (2026-07-20):** these are now present inline in
`cn_preassessment_npo_mh_001.json`. Findings `heavy_breakfast_two_hours` (U-2),
`pregnancy_screen_needed` (U-4), and `predicted_difficult_airway` (U-5), and the plan
rule `asa_not_changed_by_npo` (U-6) each carry `needsReview: true` and a `reviewNote`
naming the gap. Karen's findings and rules are all source-traceable after realignment
and carry no markers.

## Source documents

| Key | Document | What it authoritatively supplies |
| --- | --- | --- |
| **DOC-A** | `00_Anesthesia_Implications_Summary.docx` — "Anesthesia Implications & Summary Sheets: Teaching Companion to the 30 Preanesthesia Case Scenarios" | Per-case snapshot, ASA rationale, clinical issues with implications, airway, plan highlights, red flags, teaching pearls. Explicitly labelled "For instructor reference and student post-case study". |
| **DOC-B** | `Carson-Newman_Preanesthesia_Record.docx` — FORM C-N PreOp v1, STUDENT-COMPLETED | The blank assessment instrument: which domains a student must document, including NPO solids/clears, ASA, MH personal/family history, pregnancy/LMP, airway exam fields, and risk scores (Apfel, STOP-BANG, RCRI). |
| **DOC-C** | `Preanesthesia Assessment.pdf.pdf` — NAS 530 Week 1, Dr. Brian Foster, "Preanesthesia Assessment — Part 1" (84 slides) | Assessment *methodology*: goals, chart review, interview, medical/surgical/anesthetic/family history, physical and airway exam, dental documentation. |
| **DOC-D** | `Carson-Newman_Anesthesia_Emergence_Rubric.pdf` and the encoded rubrics in `data/rubrics/` | The literal graded criteria for Standard IV Induction (14 items / 28 points / 10 critical), RSI (53 items / 106 points / 27 critical), and Emergence (9 items / 18 points / 5 critical). |
| **SPEC** | `docs/superpowers/specs/2026-07-18-preanesthesia-scenarios-instructor-feedback-design.md` | Product spec. Defines who Karen and Brittany are. **Not a clinical source** — it names attributes but does not clinically justify them. |
| *Not applicable* | `Lipid_Lowering_Drugs_Active_Recall_Visual.pdf` — NAS 550 Pharmacology I, Dr. R. Dawn Whybrew | Statins and lipid-lowering agents. Zero occurrences of cholecystectomy, NPO, malignant hyperthermia, PONV, or smoking. Bears on neither case. |

Line references below are to the extracted text of each document; DOC-A references also
name the case number, which is stable in the source.

---

## Karen Whitfield — `cn_preassessment_lap_chole_001`

### Population and provenance — read this first

The SPEC defines Karen as: laparoscopic cholecystectomy, **current smoking, controlled
GERD, severe prior PONV**.

DOC-A **Case 07** is the only laparoscopic cholecystectomy in the 30-case companion, and it
is the source for everything procedure-related. **But its patient is not Karen.** DOC-A
Case 07 is a 32F with mild asthma, migraine, OCP use, codeine intolerance, and latex contact
dermatitis, who is explicitly a **non-smoker** ("female, non-smoker", DOC-A Case 07 line
316), has **no GERD**, and whose PONV history is hypothetical ("prior PONV history
*potential*", line 316).

**Karen is therefore a composite**, not a verbatim source patient: DOC-A Case 07 supplies the
procedure and its physiology, DOC-A Case 19 supplies GERD implications, and DOC-A Cases 04
and 12 supply smoking implications. Every individual element is traceable, but the operator
should know the combination is authored, not lifted. This is flagged for review as item
**U-1**.

### Discoverable findings

| Finding ID | Clinical content | Source |
| --- | --- | --- |
| `current_smoker` | Active smoking. Pulmonary implication: >8 weeks of cessation is ideal for reducing pulmonary complications; carboxyhaemoglobin may persist so SpO₂ can overestimate true oxygenation; wound healing improves if quit >4 weeks. | DOC-A Case 04 lines 169–171 ("Recent smoking cessation (2 weeks) — >8 weeks ideal…; Carboxyhemoglobin still possible; oxygen saturation may overestimate true O₂"); DOC-A Case 12 lines 587–590 (">8 weeks ideal"; "Wound healing improved if quit >4 weeks"). Population transferred from a VATS lobectomy and a spine-fusion patient. |
| `controlled_gerd` | GERD controlled on a PPI. Continue the PPI; slight aspiration risk; **standard induction remains acceptable**; famotidine is an acceptable adjunct. | DOC-A Case 19 lines 1033–1036, verbatim: "Mild GERD on PPI / Continue PPI. / Slight aspiration risk; standard induction acceptable. / Famotidine/Pepcid acceptable adjunct." Population transferred from a robotic prostatectomy patient. |
| `severe_prior_ponv` | Prior severe PONV is one of the four Apfel risk factors. | DOC-A Case 07 line 345 (teaching pearl): "Apfel PONV score: female, non-smoker, h/o PONV or motion sickness, postop opioids — 4 risk factors = 80% risk without prophylaxis." DOC-B lists Apfel as a required scored field. |
| `airway_assessed` | Airway exam documented: Mallampati, thyromental distance, mobility, dentition. DOC-A Case 07's airway is "Mallampati I, TMD 7 cm, full mobility, full native dentition. Easy intubation predicted." | DOC-A Case 07 line 332; DOC-B "AIRWAY EXAM" block (Mallampati, TMD, mouth opening, neck ROM, dentition, predicted mask/DL/SGA); DOC-C airway-exam slides. |
| `anesthetic_history_reviewed` | Prior anaesthetic records retrieved and reviewed; if unavailable the patient must supply details of significant anaesthetic experiences. | DOC-C lines 140–150: "Previous anesthesia records should be retrieved and reviewed. Especially if complications are suspected." |

### Expected anaesthetic plan elements

| Plan rule ID | Expected content | Source |
| --- | --- | --- |
| `asa_ii_with_reason` | ASA II with a stated reason (mild systemic disease). | DOC-A Case 07 line 305: "ASA CLASSIFICATION ASA II — mild systemic disease". DOC-B requires ASA with justification. |
| `aspiration_strategy` | Continue PPI; standard (non-RSI) induction is acceptable for controlled GERD; famotidine adjunct acceptable; OG tube to decompress the stomach for laparoscopic exposure. | DOC-A Case 19 lines 1034–1036; DOC-A Case 07 line 337 ("OG tube to decompress stomach for laparoscopic exposure"). |
| `multimodal_ponv_prophylaxis` | Dexamethasone 4–8 mg **plus** ondansetron 4 mg **plus** scopolamine patch, **or** propofol TIVA. | DOC-A Case 07 line 346, verbatim teaching pearl. Reinforced at line 335 ("dexamethasone, ondansetron (multimodal PONV prevention)") and red flag line 341. |
| `smoking_pulmonary_plan` | Address active smoking: counsel cessation, anticipate reactive airway, prefer sevoflurane (bronchodilator) over desflurane (airway irritant). | Sevoflurane preference: DOC-A Case 07 line 310. Smoking cessation benefit: DOC-A Cases 04/12 as above. |
| `postoperative_pain_plan` | Multimodal analgesia: acetaminophen, an NSAID (ketorolac), local anaesthetic at port sites; coordinate NSAID use with the surgeon. Fentanyl rather than codeine/tramadol where intolerance exists. | DOC-A Case 07 line 339 ("Multimodal analgesia: acetaminophen, NSAID (ketorolac), local at port sites"); red flag line 344 ("Avoid NSAIDs if surgeon plans to use ketorolac — coordinate"); line 315 ("Avoid codeine and tramadol; use fentanyl + multimodal"). |

### Red flags

| Red flag | Source (DOC-A Case 07 "RED FLAGS / KEY PITFALLS", lines 340–344) |
| --- | --- |
| PONV high risk — requires multimodal prophylaxis | "⚠ PONV high risk — multimodal prophylaxis (dex + ondansetron ± propofol TIVA)." |
| Pneumoperitoneum-induced hypercarbia | "⚠ Pneumoperitoneum-induced hypercarbia: increase MV; check ETCO₂." |
| NSAID coordination with surgeon | "⚠ Avoid NSAIDs if surgeon plans to use ketorolac — coordinate." |
| Plan submitted without an airway exam | DOC-B requires the airway exam block; DOC-C makes it mandatory. Authored as a process red flag. |

### Intraoperative event physiology (drives the live phases)

| Event | Clinical content | Source (DOC-A Case 07) |
| --- | --- | --- |
| `pneumoperitoneum_started` | CO₂ insufflation raises PaCO₂, lowers FRC, lowers venous return. Standard insufflation 15 mmHg; >20 mmHg risks haemodynamic compromise. | Lines 325–326, 347. |
| `ventilatory_challenge_detected` / `ventilation_adjusted` | Increase minute ventilation 25–30% to compensate for CO₂ absorption; check EtCO₂. | Line 326 ("Increase minute ventilation 25–30% to compensate"); red flag line 343. |
| Positioning | Trendelenburg plus pneumoperitoneum → reduce ETT cuff pressure, reassess tube depth. | Line 327. |
| Bradycardia risk | Bradycardia possible at peritoneal stretch — have atropine ready. | Line 328. |
| `emergence_started` | Reversal with sugammadex 2–4 mg/kg, fully reverses rocuronium and saves PACU time versus neostigmine. | Line 338; teaching pearl line 348. |

### Debrief teaching points

All four are verbatim DOC-A Case 07 "TEACHING PEARLS" (lines 345–348): Apfel scoring and the
80% figure; the multimodal PONV regimen; 15 mmHg standard insufflation with >20 mmHg risk;
sugammadex 2–4 mg/kg versus neostigmine.

### Rubric mapping — Standard IV Induction

Karen maps to `carson-newman-standard-iv-induction` (verified in
`data/rubrics/carson-newman-standard-iv-induction.json`: **14 items, 28 points, 10 critical**,
matching the plan). The discriminator the SPEC requires her to exercise is **item 7**, the
only `ENGINE_OBSERVABLE` critical item in that rubric:

> **[7] CRITICAL — "Confirm ability to mask-ventilate before the neuromuscular blocking agent"**

with **item 8** ("Administer neuromuscular blocking agent and manage onset — demonstrate
[PPV] while awaiting onset") as the paired step. Karen's induction therefore must show
mask ventilation confirmed *before* the paralytic, and PPV demonstrated while awaiting
blockade onset. Critical items also exercised: 1 PPE, 2 time-out, 3 monitors/baseline
vitals, 4 readiness, 5 sniffing position and preoxygenation, 6 induction meds, 12 ETT
confirmation, 14 closeout.

---

## Brittany Cole — `cn_preassessment_npo_mh_001`

### Population and provenance — read this first

The SPEC defines Brittany as: elective **knee arthroscopy**, heavy breakfast ~2 hours before
assessment (NPO violation), **family history consistent with malignant hyperthermia**,
pregnancy-screen consideration, **predicted difficult airway** with dental risk.

**There is no source case for this patient.** DOC-A's 30 cases contain **no knee arthroscopy**
(Case 10 is a total knee *arthroplasty*, a different operation and population) and — verified
by full-text search — **no occurrence of "malignant hyperthermia" or "dantrolene" anywhere in
DOC-A**. Brittany's clinical content therefore comes from DOC-C's assessment methodology,
DOC-B's form structure, and DOC-D's RSI rubric, with substantial gaps listed below.

### Discoverable findings

| Finding ID | Clinical content | Source | Status |
| --- | --- | --- | --- |
| `heavy_breakfast_two_hours` | A solid meal shortly before an elective case. Inappropriate fasting is a recognised day-of-surgery discovery that "may result in surgical delay or cancellation". | DOC-C lines 94–101, verbatim: "Day-of-surgery evaluation can result in last-minute discoveries: • Inappropriate fasting … Any of which may result in surgical delay or cancellation." DOC-B provides the field: "NPO Solids: ___ Clears: ___ ☐ confirmed". | **Partially sourced.** The *principle* (inappropriate fasting → delay/cancel) is sourced. The *threshold* that makes ~2 h post-solids a violation is **not** in any supplied document. See **U-2**. |
| `family_history_mh` | Family history of an adverse anaesthetic reaction. DOC-C directs the student to "Specifically ask: did any family member ever experience an adverse reaction to anesthesia during surgery?" and names malignant hyperthermia as a condition to investigate, adding that "Vague reports of fever and convulsions during a previous anesthetic warrant investigation to rule out malignant hyperthermia." | DOC-C lines 281–306 and 289–291; DOC-B "Family Hx MH: ☐ No ☐ Yes" and "☐ MH personal/family". | **Sourced.** |
| `pregnancy_screen_needed` | Pregnancy status / LMP is a required documented field. | DOC-B: "Preg LMP: ________", "☐ Pregnancy ___wk", "LMP ____". | **Partially sourced.** The field is required; *when a screen is indicated* and what to do with a positive is **not** in any supplied document. See **U-4**. |
| `predicted_difficult_airway` | Airway exam predicting difficulty: Mallampati, TMD, mouth opening, neck ROM, dentition, predicted mask/DL/SGA difficulty. DOC-C notes difficulties with airway management "can alter your approach to intubation". | DOC-C airway-exam slides and line ~283; DOC-B "AIRWAY EXAM" block including "Predicted: Mask ☐E ☐D DL ☐E ☐D SGA ☐OK ☐NO Awake FOB ☐". | **Sourced** as an assessment requirement. The specific exam values assigned to Brittany are authored. See **U-5**. |
| `dental_injury_risk` | Dentition assessed and documented *before* laryngoscopy; patient informed of injury risk and consent documented; removable prosthetics removed unless they improve mask fit; an extremely loose tooth may be extracted before laryngoscopy to prevent aspiration. | DOC-C lines 870–884, near-verbatim. Especially: "The time of the charted assessment must be before the time of laryngoscopy. Order matters in the medical record." | **Sourced.** |

### Expected anaesthetic plan elements

| Plan rule ID | Expected content | Source | Status |
| --- | --- | --- | --- |
| `asa_not_changed_by_npo` | ASA physical status reflects systemic disease and is **not** altered by an NPO violation. | DOC-A applies ASA consistently as a function of systemic disease across all 30 cases (e.g. Case 07 line 305, Case 19 line 1016); DOC-A Case 01 line 9 states the parallel principle explicitly: "Cardiac surgery itself does not by itself alter the class." | **Sourced by analogy.** No supplied document states the NPO-specific rule verbatim. See **U-6**. |
| `postpone_elective_case` | Postpone/defer the elective case for the fasting violation. | DOC-C lines 94–101 ("may result in surgical delay or cancellation"). | **Sourced.** |
| `escalate_mh_history` | Escalate the MH family history; a diagnosis "should be established before surgery proceeds"; surgery may be delayed. | DOC-C lines 145–150 and 306–312: "If unusual conditions are suspected — atypical plasma cholinesterase, malignant hyperthermia susceptibility — surgery may be delayed." / "A diagnosis should be established before surgery proceeds." | **Sourced.** |
| `trigger_free_plan` | Trigger-free technique, explicitly **no succinylcholine**. | DOC-C line 150, verbatim: "Or measures taken to avoid consequences (no succinylcholine, trigger-free technique)." | **Sourced** for the *principle*. Which volatile agents are triggers, and the machine-preparation steps, are **not** stated. See **U-3**. |
| `difficult_airway_plan` | Airway plan matched to the predicted difficulty, with a rescue path. RSI rubric supplies the graded steps. | DOC-D RSI rubric items 28 ("If unable to intubate perform positive pressure mask ventilation with cricoid pressure"), 41 ("Appropriate intervention if unable to intubate"), 42 ("Completion of intubation in < 3 attempts"). | **Sourced.** |
| `team_communication` | Communicate patient-management issues among care providers and give specific instructions to the patient. | DOC-C lines 50–55, verbatim goals of preanesthesia assessment: "Communicate patient management issues effectively among care providers / Communicate and provide specific instructions to patients (NPO, glucose management, home medications)". | **Sourced.** |

### Dangerous / unsafe plan elements (training-only branch)

| Unsafe element | Why unsafe | Source | Status |
| --- | --- | --- | --- |
| Succinylcholine given to an MH-susceptible patient | Directly contradicts the trigger-free requirement. | DOC-C line 150 ("no succinylcholine"). | **Sourced.** |
| Volatile agent given to an MH-susceptible patient | "Trigger-free technique" implies volatile avoidance. | DOC-C line 150 — the phrase is used, but **the document never enumerates which agents are triggers**. | **Inference. See U-3.** |
| Mask ventilation before the first laryngoscopy in a full stomach | RSI rubric scores this negatively. | DOC-D RSI rubric item 11: "Do not mask ventilate prior to first laryngoscopy". | **Sourced.** |
| Proceeding with an elective case despite the fasting violation | The `proceed_for_training` branch. Must be labelled an instructor-selected educational counterfactual, never the recommended disposition. | SPEC lines 419–445. Clinically supported as *wrong* by DOC-C lines 94–101. | **Sourced as counterfactual.** |

### RSI technique content (training branch)

Fully sourced from DOC-D `carson-newman-rsi-induction.json` (**53 items, 106 points, 27
critical** — the plan does not state these numbers; they are verified from the encoded
rubric):

- preoxygenate 100% FiO₂ for 3 minutes at normal tidal breaths (item 7, critical, engine-observable);
- verbalise ETO₂ > 90% (item 8, critical);
- apply cricoid pressure as appropriate (item 9, critical, engine-observable);
- do **not** mask ventilate prior to first laryngoscopy (item 11, engine-observable);
- PPV with cricoid pressure if unable to intubate (item 28, critical, engine-observable);
- remove cricoid pressure after placement confirmed (item 29);
- confirm placement by continuous EtCO₂ waveform (item 26, critical);
- appropriate intervention if unable to intubate (item 41, critical);
- completion of intubation in < 3 attempts (item 42, critical).

General full-stomach/RSI rationale also appears in DOC-A at lines 406, 442, 449, 790, 792 and
853, but always for obstetric or bariatric populations, so it transfers by principle only.

### Rubric mapping — RSI

Brittany's training-only branch maps to `carson-newman-rsi-induction`. Critical events
exercised: 7 preoxygenation, 8 ETO₂ > 90%, 9 cricoid pressure, 10a/10c drug selection and
sequence, 26 EtCO₂ confirmation, 28 PPV-with-cricoid rescue, 41 failed-intubation
intervention, 42 < 3 attempts. Item 11 (no mask ventilation before first laryngoscopy) is
the non-critical discriminator the SPEC calls out.

Brittany's **primary** (correct) branch involves **no live anaesthetic**, so it exercises no
induction rubric at all — the case completes at postponement. This is intended and is why
the primary path is scored against the case's own assessment and plan rules rather than
against an induction rubric.

---

## Unsourced, requires operator review

Each item below is **not** derivable from the supplied documents. None has been authored
into scenario JSON. Anything the operator approves will be marked `needsReview: true` in the
JSON with a note naming the operator decision.

**U-1 — Karen is a composite patient.** DOC-A Case 07's lap chole patient is a non-smoker
with no GERD and no confirmed PONV history. Karen's three defining findings come from the
SPEC, and their implications are borrowed from DOC-A Cases 19, 04 and 12 (different
populations). *Decision needed:* accept Karen as an authored composite, or re-align her to
DOC-A Case 07's actual comorbidities (mild asthma, migraine, OCP, codeine intolerance, latex).

**U-2 — Fasting interval thresholds.** No supplied document states any NPO duration (the
common 8/6/4/2-hour solids/light-meal/breast-milk/clears structure appears nowhere). DOC-B
provides only blank fields; DOC-C says only that "inappropriate fasting" may cause delay.
*Decision needed:* supply the fasting standard the course teaches, or confirm that Brittany's
case should assert only "solids ~2 h ago, insufficient fasting" without citing an interval.

**U-3 — MH crisis recognition and treatment.** DOC-A contains no MH content whatsoever.
DOC-C covers only *history-taking* and the trigger-free principle. Nothing in any supplied
document describes MH crisis signs (e.g. rising EtCO₂, rigidity, masseter spasm,
hyperthermia), which agents are triggers, dantrolene dosing or preparation, or the treatment
sequence. The engine already models a `MalignantHyperthermia` complication and dantrolene
response, so the *simulation* can run — but the **teaching text, guidance, and debrief
content for the MH branch cannot be written from the supplied sources.**
*Decision needed:* supply the MH lecture/protocol the course uses, or approve authoring this
branch's teaching content from the engine's modelled behaviour alone with an explicit
`needsReview` marker on every MH teaching string.

**U-4 — Pregnancy screening indication.** DOC-B requires LMP/pregnancy documentation but no
supplied document states when a pregnancy test is indicated or what a positive result means
for an elective case. *Decision needed:* supply the policy, or reduce this finding to
"pregnancy status not documented" as a pure documentation-completeness item.

**U-5 — Brittany's specific exam values.** The airway findings that make her a *predicted*
difficult airway (Mallampati class, TMD, mouth opening, neck ROM, specific dental findings)
are not specified anywhere. DOC-B supplies the fields; DOC-C supplies the method; neither
supplies her values. *Decision needed:* supply Brittany's exam values, or approve authored
values consistent with DOC-B's field structure, marked `needsReview`.

**U-6 — "ASA is unchanged by NPO status" as an explicit rule.** Supported by analogy from
DOC-A's consistent ASA usage and Case 01's "surgery itself does not by itself alter the
class", but never stated for fasting. *Decision needed:* confirm this is the course's
teaching, since it is a scored plan rule (`asa_not_changed_by_npo`).

**U-7 — Knee arthroscopy procedural context.** No arthroscopy case exists in DOC-A. If
Brittany's training branch needs procedure-specific physiology (positioning, tourniquet,
irrigation, expected stimulation), it is unsourced. *Decision needed:* supply a source, or
confirm the training branch should stay procedure-generic and exercise only airway and MH
pathways.

## Status

Karen can be authored now, subject to **U-1**. Brittany's assessment phase and correct
postpone path can be authored subject to **U-2**, **U-4**, **U-5** and **U-6**; her
**training-only MH branch cannot be responsibly authored until U-3 is resolved**, because its
entire teaching payload would otherwise be invented.

---

# Addendum — operator resolutions (2026-07-20)

The operator supplied `NAS 560 MH.ppt` and directed: (2) "use the updated ASA standards";
(3) "realign each scenario to real comorbidities and have those comorbidities have effect
during the case… everything should be a path towards the scenario and a script and feedback
for the instructor and what the trainee should be doing at each stage." Resolutions below.

## DOC-E — `NAS 560 MH.ppt`, "Malignant Hyperthermia," NAS 560 Summer 2026, Dr. Dawn Whybrew

This resolves **U-3**. Extracted via the OLE PowerPoint Document stream (legacy binary `.ppt`);
text-record extraction, no rendering. All MH teaching and simulation content is now sourced:

| MH element | Sourced content | DOC-E slide text |
| --- | --- | --- |
| Definition | "a subclinical myopathy that is unmasked upon exposure to volatile anesthetics and/or succinylcholine" | "Definition" slide. |
| Triggering agents | Volatile gases (halothane, enflurane, isoflurane, sevoflurane, desflurane); succinylcholine; N₂O possibly a weak trigger. | "Triggering Agents" slide. |
| Safe (non-triggering) drugs | Barbiturates, propofol, etomidate, opioids, benzodiazepines, ketamine, non-depolarizing muscle relaxants, reversal agents, local anesthetics, vasopressors. | "Anesthesia Preparation" slide. |
| Early sign | **Hypercarbia (rising EtCO₂) is an early sign.** Tachycardia, tachypnea. "The earliest signs… enormous increases in metabolic rate." | "Signs and Symptoms" and notes: "Hypercarbia is an early sign." |
| Late sign | **Temperature rise is often a late sign**, but can be precipitous — "1ºC every 5 minutes… up to 46ºC." | "Signs and Symptoms" slide. |
| Masseter spasm | Trismus / "jaws of steel" after succinylcholine; with persistent rigidity >a few minutes, halt the procedure. | "Trismus-Masseter Spasm" slides. |
| Onset window | "within 10 min or several hours of administration of triggering drugs"; death may occur in as little as 15 minutes; V-fib is the most common cause of death. | "Incidence" and notes slides. |
| Full sign set | Tachycardia, tachypnea/hypercarbia, arterial hypoxemia, metabolic/respiratory acidosis, hyperkalemia, dysrhythmias, hypotension, rigidity, hyperthermia, mottled skin. | "Signs and Symptoms" slides. |
| Treatment — drug | **Dantrolene / Ryanodex 2.5 mg/kg IV bolus, repeat q5–10 min until controlled, up to 10 mg/kg** (occasionally more). | "Treatment" slide. |
| Treatment — supportive | Turn off volatile gases; hyperventilate with 100% O₂; active cooling (stop at 38ºC); conclude surgery ASAP; correct acidosis (NaHCO₃ 1–2 mEq/kg); maintain UOP (mannitol 0.25 g/kg, furosemide 1 mg/kg); treat dysrhythmias and hyperkalemia; ICU 6–72 h with dantrolene 1 mg/kg q6h ×72 h. | "Treatment" slides. |
| Trigger-free machine prep | First case of day; disposable circuit and fresh-gas hose; new CO₂ absorbent; vaporizers removed/taped off; flush O₂ 10 L/min for 5–20 min; regional if appropriate. | "Anesthesia Preparation" slide. |
| Resource | MHAUS 24-hour hotline 1-800-MH-HYPER; www.mhaus.org. | "For More Information" slide. |

**Simulation consequence:** MH in Brittany's training branch is triggered ONLY by
succinylcholine or a volatile agent (DOC-E). Its first engine-visible sign must be rising
EtCO₂ / tachycardia, with temperature as a later sign, and it resolves to dantrolene 2.5 mg/kg
— matching the engine's existing `MalignantHyperthermia` complication. The trigger-free plan's
"safe drugs" list and machine prep are DOC-E-sourced. **U-3 resolved.**

## ASA standards (operator-directed) — resolves U-2 and U-6

The operator directed use of "the updated ASA standards." These are named professional
standards, not an attached file, so every value below is tagged `source: "ASA (operator-
directed)"` in the JSON rather than attributed to a supplied document, and flagged
`needsReview: true` so the operator can confirm the version.

- **U-2 (fasting).** ASA "Practice Guidelines for Preoperative Fasting" (2023 update):
  clear liquids 2 h; breast milk 4 h; infant formula / nonhuman milk / light meal 6 h;
  fried/fatty food or a full/heavy meal 8 h. Brittany's "heavy breakfast ~2 hours ago"
  therefore violates the 6–8 h solid-food minimum. The finding will assert the violation
  against the ASA minimum rather than inventing an uncited threshold.
- **U-6 (ASA physical status).** ASA-PS classification reflects systemic disease severity and
  is not altered by a fasting violation (an acute NPO status is not a systemic disease). This
  is inherent to the ASA-PS definitions and is now attributed to that standard rather than to
  DOC-A by analogy. `asa_not_changed_by_npo` stands.

## Realignment to real comorbidities (resolves U-1; supersedes the composite)

Per directive (3), the invented composites are abandoned. Each case is realigned to
source-backed comorbidities that produce a **real engine physiologic effect**, so the
comorbidity drives the clinical path rather than sitting as a cosmetic label.

- **Karen → the real DOC-A Case 07 patient.** 32F, symptomatic cholelithiasis for outpatient
  laparoscopic cholecystectomy; **mild intermittent asthma**, migraine on PRN treatment, OCP
  use, codeine intolerance (nausea, not allergy), latex contact dermatitis; **non-smoker**;
  **high Apfel PONV risk**. This replaces the smoker/GERD/severe-PONV composite. Asthma is the
  comorbidity chosen to have an intraoperative engine effect (bronchospasm on airway
  instrumentation / light anesthesia) if the engine supports it; PONV risk and OCP/VTE remain
  assessment-and-plan findings.
- **Brittany → retained identity, now fully sourced.** Elective knee arthroscopy; recent heavy
  meal (ASA fasting violation); **MH family history** (DOC-E) as the engine-effect comorbidity
  in the training branch; predicted difficult airway with dental risk (DOC-C). No underlying
  source-patient exists, so her non-MH attributes stay at the level DOC-C/DOC-B support.

**Consequence for the plan's hard-coded finding IDs.** The plan's Task 9 Step 1 lists Karen
finding IDs built for the composite (`current_smoker`, `controlled_gerd`, `severe_prior_ponv`).
Realignment changes these to match the real patient (e.g. `mild_asthma`, `ponv_high_risk`,
`ocp_vte_risk`, `codeine_intolerance`, `latex_precaution`, `airway_assessed`,
`anesthetic_history_reviewed`). This is a deliberate, operator-directed divergence from the
written plan; the plan's exact-ID test is updated to the realigned IDs and the change is noted
in the Task 9 commit. Brittany's IDs are unaffected by realignment.

**Pending engine confirmation.** Which comorbidity effects are actually expressible (e.g.
whether the engine models weight-dependent desaturation and asthma→bronchospasm) is being
verified against the engine before authoring, so no effect is asserted that the engine cannot
produce. Any comorbidity whose physiology the engine cannot express will be authored as an
assessment/plan finding only, explicitly noted, never as a fake live effect.

## Engine ↔ physiology validation (2026-07-20)

Before authoring, each physiologic behavior the cases rely on was driven through
the real `SimRunner` and checked for clinical plausibility (not just that it runs).
Results:

| Behavior | Measured | Clinically realistic? |
| --- | --- | --- |
| Weight → desaturation (apnea to SpO₂<90 after full preox) | 60 kg → 565 s (~9.4 min); 120 kg (BMI 41) → 155 s; 160 kg (BMI 59) → 85 s | ✅ Correct gradient — lean adults tolerate ~6–10 min, obese ~2–3 min, morbidly obese <2 min |
| Asthma → bronchospasm | Ppeak 0→44 cmH₂O, SpO₂ 100→88; albuterol + deepening → Ppeak 44→18, SpO₂→98 over ~90 s | ✅ High peak pressure + hypoxia, resolves with bronchodilator/deepening |
| MH (properly ventilated, FiO₂ 0.5) | EtCO₂ 40→127 (early), Temp 35.7→40.6 (later), HR 59→92, **SpO₂ held 99.5**; dantrolene 2.5 mg/kg + stop volatile → EtCO₂ falls 127→69 | ✅ Correct sign ordering (EtCO₂ early, temp late), oxygenation preserved when ventilated, treatment resolves |
| EtCO₂ ↔ minute ventilation | MV 5.9 → EtCO₂ 40; MV 2.3 → 126; MV 9.0 → 24 | ✅ Correct inverse relationship (drives the laparoscopy vent challenge) |
| Difficult intubation (`failedIntubationAttempts:[1]`) | non-preox attempt SpO₂ nadir 69.6% at 41 s; preox attempt holds 99.8%; rescue order attempt→failed→cricoid→mask PPV→attempt→succeeded, SpO₂ 87.6→99.9 | ✅ Realistic desaturation, preox protective, correct rescue sequence |

**Compressed MH timeline — disclosed simplification (~5x).** MH EtCO₂ rises faster
than life (≈47→119 in 60 s) and temperature climbs ≈1°C/min versus the DOC-E reference
of 1°C/5 min — the engine compresses the MH timeline roughly 5x. **Sign ordering is
preserved and is the load-bearing teaching point (EtCO₂ early, temperature late).** The
MH math was not changed; this is a substrate simplification of the shared engine, now
disclosed in three places so it is never silent: (1) `docs/airway-gaps-model.md`
simplification 11, alongside the other engine simplifications; (2) the
`physiologyDisclosures` array on `cn_preassessment_npo_mh_001.json`; and (3) the case
description, surfaced in the instructor load status before the case runs. Instructors
must teach that the *real* early rise is insidious and easy to miss — the sim's fast
rise is a compression for time-limited teaching, not a claim about clinical pace.
Verified via `SimRunner`; difficult-intubation numbers are additionally locked by
`test/airway-gaps-evidence`.

## Remaining open items after this addendum

- **U-4** (pregnancy-screen indication) and **U-5** (Brittany's specific airway exam values)
  remain unsourced; both will be authored as documentation-completeness items marked
  `needsReview: true` unless the operator supplies values.
- **U-7** (knee-arthroscopy procedural physiology) remains unsourced; Brittany's training
  branch stays procedure-generic and exercises only the airway and MH pathways.
