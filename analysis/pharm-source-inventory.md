# Pharm Source Inventory — adv-pharmacology-1

**Generated:** 2025-05-25  
**Scope:** All source materials for the `adv-pharmacology-1` course  
**Purpose:** Map synthesis questions → MCQ sources → slide sources. Identify gaps before authoring new content.

---

## Section 1: Synthesis Questions (14 total, all on ap1-wk-1)

All 14 synthesis questions live in `data/recall-questions-adv-pharmacology-1.js`.  
All cite `source: 'Stoelting Ch 2, Vandivier lecture'`.  
All are assigned `nodeId: 'ap1-wk-1'`.

| # | ID | Topic | Key Points | Source MCQ IDs cited | feeder_atoms |
|---|-----|-------|------------|---------------------|--------------|
| 1 | r-ap1-w1-1a | receptor-theory | 3 (kp1–kp3) | ap1-w1-001, 002, 006, 007, 061 | — |
| 2 | r-ap1-w1-1b | receptor-theory | 3 (kp4–kp6) | ap1-w1-003, 004, 005, 008 | atom-competitive-antag-1, atom-noncompetitive-antag-1, atom-inverse-agonism-1 |
| 3 | r-ap1-w1-2 | receptor-regulation | 5 (kp1–kp5) | ap1-w1-009, 010, 011, 012, 071 | — |
| 4 | r-ap1-w1-3a | pk-compartment-model | 3 (kp1–kp3) | ap1-w1-018, 020, 021, 022, 054 | atom-central-compartment-1, atom-redistribution-1, atom-csht-1 |
| 5 | r-ap1-w1-3b | pk-compartment-model | 3 (kp4–kp6) | ap1-w1-019, 022, 054, 073 | — |
| 6 | r-ap1-w1-4 | protein-binding | 5 (kp1–kp5) | ap1-w1-023, 024, 025, 026, 027, 075 | — |
| 7 | r-ap1-w1-5 | absorption-bioavailability | 5 (kp1–kp5) | ap1-w1-046, 048, 049, 050, 074 | — |
| 8 | r-ap1-w1-6a | drug-metabolism | 3 (kp1–kp3) | ap1-w1-030, 031, 032, 037, 076 | — |
| 9 | r-ap1-w1-6b | drug-metabolism | 3 (kp4–kp6) | ap1-w1-029, 033, 034, 035 | — |
| 10 | r-ap1-w1-7 | pharmacogenetics | 5 (kp1–kp5) | ap1-w1-029, 066, 067, 068, 069, 070, 080 | — |
| 11 | r-ap1-w1-8 | dose-response | 5 (kp1–kp5) | ap1-w1-058, 059, 060, 061, 062, 063, 064, 065, 079 | — |
| 12 | r-ap1-w1-9a | elimination-kinetics | 3 (kp1–kp3) | ap1-w1-041, 051, 052, 053 | — |
| 13 | r-ap1-w1-9b | elimination-kinetics | 3 (kp4–kp6) | ap1-w1-040, 052, 053, 055, 056, 057, 077 | — |
| 14 | r-ap1-w1-9c | clearance-dose-adjustment | 5 (kp1–kp5) | ap1-w1-038, 039, 042, 043, 044, 045 | — |

**Atom questions:** 6 placeholders in `data/recall-questions-atoms.js` (engine proof only):
- 3 feed r-ap1-w1-1b: atom-competitive-antag-1, atom-noncompetitive-antag-1, atom-inverse-agonism-1
- 3 feed r-ap1-w1-3a: atom-central-compartment-1, atom-redistribution-1, atom-csht-1
- All 6 are `tier: 'atom'`, `courseId: 'adv-pharmacology-1'`, `nodeId: 'ap1-wk-1'`

---

## Section 2: MCQ Source Coverage

### ap1-wk-1 MCQ bank: 80 MCQs (ap1-w1-001 through ap1-w1-080)
**File:** `data/questions/ap1-wk1-receptors-pharmacodynamics.js` (1327 lines)

**MCQ topic distribution (80 total):**

| MCQ Topic | Count | Synthesis topic(s) that cite these MCQs |
|-----------|-------|----------------------------------------|
| Receptor Theory | 8 | receptor-theory |
| Receptor Regulation | 5 | receptor-regulation |
| Receptor Types | 3 | *(none — uncited)* |
| Pharmacodynamics | 6 | dose-response |
| Pharmacokinetics | 2 | *(none — uncited)* |
| Distribution | 6 | pk-compartment-model |
| Protein Binding | 6 | protein-binding |
| Absorption | 6 | absorption-bioavailability |
| Metabolism | 8 | drug-metabolism |
| Phase I Metabolism | 4 | drug-metabolism |
| Phase II Metabolism | 1 | drug-metabolism |
| Kinetics | 9 | elimination-kinetics, clearance-dose-adjustment |
| Hepatic Clearance | 3 | clearance-dose-adjustment |
| Renal Clearance | 3 | clearance-dose-adjustment |
| Ion Trapping | 1 | clearance-dose-adjustment |
| Pharmacogenetics | 6 | pharmacogenetics |
| Drug Interactions | 3 | dose-response |

**MCQ IDs cited by synthesis questions:** 70 of 80 (87.5%)

**10 MCQ IDs NOT cited by any synthesis question:**

| MCQ ID | Topic | Content |
|--------|-------|---------|
| ap1-w1-013 | Receptor Types | Most drug receptors located on cell membrane |
| ap1-w1-014 | Receptor Types | Milrinone inhibits PDE III |
| ap1-w1-015 | Receptor Types | NaHCO₃ mechanism |
| ap1-w1-016 | Pharmacokinetics | PK definition |
| ap1-w1-017 | Pharmacokinetics | ADME acronym |
| ap1-w1-028 | Metabolism | Goal of drug metabolism |
| ap1-w1-036 | Phase I Metabolism | Fluoride nephrotoxicity / sevoflurane |
| ap1-w1-047 | Absorption | Weak base in stomach pH |
| ap1-w1-072 | Kinetics | Hysteresis definition |
| ap1-w1-078 | Pharmacogenetics | MH / RyR1 receptor |

**Note:** ap1-w1-013 through 015 (Receptor Types) and 016–017 (Pharmacokinetics overview) are foundational-knowledge MCQs not tied to any synthesis scenario. ap1-w1-072 (hysteresis) is partially covered by r-ap1-w1-9b kp6 which mentions ke0 and hysteresis. ap1-w1-078 (MH/RyR1) is covered conceptually in r-ap1-w1-7 kp3 but that question cites 067/068, not 078.

### ap1-wk-2 through ap1-wk-13: ALL EMPTY SCAFFOLDS

Every file is 15 lines with `QUESTIONS = []` and `totalQuestions: 0`.

| Node | File | Title | Chapter | MCQs |
|------|------|-------|---------|------|
| ap1-wk-2 | ap1-wk2.js | Autonomic Drugs, Cholinergic Agonism/Antagonism | Stoelting Ch 3 | 0 |
| ap1-wk-3 | ap1-wk3.js | Sympathomimetics, Antihypertensives, Vasodilators | Stoelting Ch 15,18,19,20 | 0 |
| ap1-wk-4 | ap1-wk4.js | Anticoagulants and Procoagulants | Stoelting Ch 29,30 | 0 |
| ap1-wk-5 | ap1-wk5.js | Lipid Lowering, Antidysrhythmics, Diuretics | Stoelting Ch 19,21,22,23,37 | 0 |
| ap1-wk-6 | ap1-wk6.js | Histamine, Vasoactive, Prostaglandin Drugs | Stoelting Ch 3,20,25 | 0 |
| ap1-wk-7 | ap1-wk7.js | Nitric Oxide, Respiratory Active Drugs | Stoelting Ch 20,25 | 0 |
| ap1-wk-8 | ap1-wk8.js | Antipsychotic and Antidepressant Drugs | Stoelting Ch 13,43 | 0 |
| ap1-wk-9 | ap1-wk9.js | Hypothalamus, Thyroid, Adrenocorticosteroids | Stoelting Ch 37,38,39,40 | 0 |
| ap1-wk-10 | ap1-wk10.js | Antiseizure, Movement Disorders, Antimicrobials, GI | Stoelting Ch 13,32,34,35,41 | 0 |
| ap1-wk-11 | ap1-wk11.js | Steroids and Antihistamines | Stoelting Ch 35,40 | 0 |
| ap1-wk-12 | ap1-wk12.js | Drugs of Abuse, Cannabinoids, Chemotherapy | Stoelting Ch 42,43 | 0 |
| ap1-wk-13 | ap1-wk13.js | Dietary Supplements and Herbal Medications | Stoelting Ch 36 | 0 |

---

## Section 3: Slide / Source File Inventory

### Source files provided (all in ~/Downloads/)

| # | File | Format | Slides/Pages | Maps to Node | Content Domain |
|---|------|--------|-------------|--------------|----------------|
| 1 | Ch2 Stoelting_CN-Vandivier redo.pdf | PDF (66 slides) | 66 | **ap1-wk-1** | Receptor theory, agonists/antagonists, R/R* conformations, PK (ADME), distribution, redistribution, protein binding, metabolism (Phase I/II), hepatic clearance, renal clearance, ion trapping, absorption, ionization, drug interactions, pharmacogenetics, elderly |
| 2 | Ch2 Stoelting_CN-Vandivier redo.pptx | PPTX | (same deck) | **ap1-wk-1** | Same as above — PPTX source of the PDF |
| 3 | PNS_ch_3_Vandivier (1).pptx | PPTX | 33 | **ap1-wk-2** | PNS anatomy, ANS divisions, NE synthesis/storage/release/reuptake, ACh, autonomic tone, autonomic dysfunction, aging ANS, adrenal medulla, thermoregulation |
| 4 | Sympathomimetics_ch_18_VandivierCN.pptx | PPTX | 58 | **ap1-wk-3** (partial) | Sympathomimetics: epinephrine, NE, dopamine, isoproterenol, dobutamine, ephedrine, phenylephrine, selective β2 agonists, digoxin, PDE III inhibitors (milrinone), calcium |
| 5 | antagonist_hypertensives_CN_Vandivier.pptx | PPTX | 47 | **ap1-wk-3** (partial) + **ap1-wk-5** (partial) | α/β antagonists, α2 agonists (clonidine, dex), β-blockers (propranolol, esmolol, metoprolol, atenolol, timolol, labetalol), CCBs (verapamil, nifedipine, nicardipine, diltiazem), ACE inhibitors, ARBs, nitrovasodilators (SNP, NTG), hydralazine, fenoldopam, diuretics, heart failure |
| 6 | NAS500 Pharmacology AnswerKey.pdf | PDF | 23 pages, 100 Qs | **ap1-wk-3** primarily | 100-question exam: "NAS 500 / Cardiovascular & Autonomic Pharmacology" — sympathomimetics, antihypertensives, vasodilators, cardiac glycosides, CCBs, ACE/ARBs, clinical scenarios |

### Slide-to-node mapping detail

**ap1-wk-1 (Stoelting Ch 2)** — FULLY COVERED
- Ch2 Stoelting PDF/PPTX (66 slides) maps directly and completely to this node
- All 14 synthesis questions + 80 MCQs draw from this material

**ap1-wk-2 (Stoelting Ch 3: Autonomic Drugs, Cholinergic)** — SLIDES AVAILABLE, NO QUESTIONS
- PNS_ch_3_Vandivier (33 slides) maps directly to this node
- Content: PNS anatomy, ANS divisions, NE/ACh neurotransmission, adrenal medulla, thermoregulation
- Node scaffold exists but MCQ bank is empty (0 questions)
- No synthesis questions exist for this node

**ap1-wk-3 (Stoelting Ch 15,18,19,20: Sympathomimetics, Antihypertensives, Vasodilators)** — SLIDES + EXAM AVAILABLE, NO QUESTIONS
- Sympathomimetics_ch_18 (58 slides) covers the sympathomimetic half
- antagonist_hypertensives (47 slides) covers the antagonist/antihypertensive/vasodilator half
- NAS500 exam (100 MCQs) maps primarily here — breakdown:
  - Q1–Q33: Sympathomimetics (epinephrine, NE, dopamine, dobutamine, phenylephrine, ephedrine, β2 agonists, milrinone)
  - Q34–Q38: Digoxin
  - Q39–Q42: α2 agonists (clonidine, dexmedetomidine)
  - Q43–Q52: β-blockers, CCBs, ACE inhibitors
  - Q53–Q69: Vasodilators (SNP, NTG, iNO, hydralazine, fenoldopam), clinical scenarios
  - Q70–Q100: Mixed clinical application (RV failure, transplant heart, HOCM, thyroid storm, etc.)
- Node scaffold exists but MCQ bank is empty (0 questions)
- No synthesis questions exist for this node

**ap1-wk-4 through ap1-wk-13** — NO SOURCE MATERIAL PROVIDED
- No lecture slides or exams provided for any of these nodes
- All MCQ banks are empty scaffolds

---

## Section 4: Gaps, Conflicts & Observations

### Critical gap: 12 of 13 nodes have zero content

| Status | Nodes | MCQs | Synthesis | Slides | Exam |
|--------|-------|------|-----------|--------|------|
| ✅ FULL | ap1-wk-1 | 80 | 14 | 66 slides | — |
| 🟡 SLIDES+EXAM, NO Qs | ap1-wk-2 | 0 | 0 | 33 slides | — |
| 🟡 SLIDES+EXAM, NO Qs | ap1-wk-3 | 0 | 0 | 105 slides + 100-Q exam | — |
| 🔴 EMPTY | ap1-wk-4 thru 13 | 0 each | 0 | 0 | 0 |

### Source-to-node conflicts / edge cases

1. **antagonist_hypertensives PPTX spans two nodes.** Slides 1–30 (α/β antagonists, CCBs) map cleanly to ap1-wk-3. Slides 31–47 cover heart failure, ACE/ARBs, diuretics — these straddle ap1-wk-3 (Stoelting Ch 19,20) and ap1-wk-5 (Stoelting Ch 19,21,22,23). The diuretics content on slides 45–46 also touches ap1-wk-5. Decision needed: split this deck's content between ap1-wk-3 and ap1-wk-5, or assign all to ap1-wk-3.

2. **NAS500 exam scope vs. node boundaries.** The 100-question exam is titled "Cardiovascular & Autonomic Pharmacology" and covers sympathomimetics (Ch 18), antihypertensives (Ch 19), and vasodilators (Ch 20) — all assigned to ap1-wk-3 in NODE_CONFIG. However, some questions touch autonomic physiology concepts (Bezold-Jarisch reflex, transplant heart denervation) that could also be claimed by ap1-wk-2 (ANS/PNS). Recommend assigning all 100 to ap1-wk-3 since the clinical pharmacology framing fits better than the pure physiology framing of ap1-wk-2.

3. **Digoxin placement.** NAS500 Q34–Q38 cover digoxin, which NODE_CONFIG places under ap1-wk-5 ("Lipid Lowering, Antidysrhythmics, Diuretics" — Stoelting Ch 19,21,22,23,37). The Sympathomimetics PPTX (slides 46–49) also covers digoxin under Ch 18 sympathomimetic agents. The NAS500 exam tests it as part of the cardiovascular pharm block. Recommend: keep digoxin MCQs in ap1-wk-3 if authoring from the NAS500 source, since the exam context is cardiovascular-focused. Cross-reference ap1-wk-5 when that node gets content later.

4. **Milrinone/PDE III placement.** Same tension — milrinone slides (50–54) are in the Sympathomimetics deck, and NAS500 Q24–Q33 test it alongside sympathomimetics. NODE_CONFIG lists PDE inhibitors under multiple Stoelting chapters. Keep with ap1-wk-3 for now.

5. **10 orphaned MCQs in ap1-wk-1.** Ten MCQs (ap1-w1-013 through 078) are not cited as sources by any synthesis question rubric. Most are foundational definitions (receptor types, PK/ADME definitions) or edge-case topics (fluoride nephrotoxicity). These are fine as standalone MCQs — they don't represent a content gap, just synthesis questions that don't reference every single MCQ.

### Atom coverage

- Only 2 of 14 synthesis questions have feeder_atoms defined (r-ap1-w1-1b and r-ap1-w1-3a)
- 6 placeholder atoms exist — all are real questions with rubrics (not stubs), but labeled "engine proof only"
- The remaining 12 synthesis questions have zero atoms, meaning soft gating cannot meaningfully gate them
- Atom authoring is needed across all 10 synthesis topics for the adaptive difficulty engine to function properly on ap1-wk-1

---

## Section 5: Recommendation

### Immediate next steps (in priority order)

1. **ap1-wk-3 is the highest-value target for content authoring.** Three independent source materials converge on this node: 105 lecture slides across 2 decks + a 100-question validated exam. The NAS500 answer key provides complete rationales that can inform both MCQ authoring and synthesis question rubrics. This node alone could yield 60–100 MCQs and 10–15 synthesis questions.

2. **ap1-wk-2 is the second priority.** 33 slides of autonomic physiology content are available. This is a smaller node but has clear source material. Estimate: 25–40 MCQs and 3–5 synthesis questions.

3. **Atom authoring for ap1-wk-1.** The adaptive difficulty engine requires atoms for all 10 synthesis topics on this node. Currently only 2 topics (receptor-theory and pk-compartment-model) have atoms. The remaining 8 topics need at minimum 2–3 atoms each (16–24 new atoms total) for the soft-gating system to function.

4. **ap1-wk-4 through ap1-wk-13 require source materials.** No lecture slides or exams have been provided for these 10 nodes. Content authoring cannot proceed without source material. The course spans Stoelting chapters 2, 3, 13, 15, 18–25, 29–30, 32, 34–43. Source slides/exams for these chapters are needed.

### Content authoring constraints (from mission spec)

- No questions are to be authored in this inventory step
- No code changes in this step
- This document is the deliverable — stop and wait for human review
