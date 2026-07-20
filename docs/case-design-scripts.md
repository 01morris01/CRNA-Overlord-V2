# Confirmed case design — instructor scripts, trainee expectations, engine effects

This is the operator-approved blueprint the two scenario JSONs transcribe. Every
stage lists: what the **trainee** should do, the **instructor script / watch-fors**,
the **engine effect** (only effects the engine can actually produce — see
`case-clinical-sourcing.md` capability map), and the **source**. It realizes the
operator directive: "a path towards the scenario, a script and feedback for the
instructor, and what the trainee should be doing at each stage."

## Time compression (operator requirement)

The instructor must be able to teach a case's topics without waiting out real time.
Mechanism, using existing engine capability (`caseFlowSession.js:514–537`):

- **Learner-action beats fire automatically** (induction drug given → `induction_started`;
  intubation succeeds → `airway_secured`). No waiting.
- **Intraoperative teaching beats are `instructor`-triggered.** The instructor fires
  `bronchospasm_onset`, `pneumoperitoneum_started`, and the emergence beats on demand
  from the case panel; each phase lists `activate_event` in `allowedInstructorControls`.
  The physiology then evolves realistically once fired (bronchospasm worsens until
  treated; EtCO₂ climbs until ventilation is corrected) — the instructor controls
  *when*, the engine controls *how*. Phases advance via the `advance` control.
- The simulation clock itself is never scaled (that would corrupt deterministic
  physiology). "Speed up" = fire the next beat now, not run the clock faster.

Where the plan (`2026-07-18-…`) wanted a physiology-dwell auto-trigger for the
ventilatory challenge, it is retained as a secondary automatic path so the case is
faithful when run in real time, while the instructor path allows compression.

---

## Karen Whitfield — `cn_preassessment_lap_chole_001`

**Patient (real DOC-A Case 07):** 32F, symptomatic cholelithiasis for outpatient
laparoscopic cholecystectomy. Mild intermittent asthma; migraine on PRN treatment;
OCP use; codeine intolerance (nausea, not allergy); latex contact dermatitis;
non-smoker; high Apfel PONV risk. Airway Mallampati I, easy. Weight set to a healthy
adult value so desaturation during any hypoxic beat is realistic, not exaggerated.

**Rubric exercised:** Standard IV Induction (`carson-newman-standard-iv-induction`,
14 items / 28 points / 10 critical). Discriminator: **mask-ventilate before the
paralytic (item 7, the sole ENGINE_OBSERVABLE critical), PPV while awaiting onset
(item 8).** Also exercises items 1–6, 12, 14.

**Realigned finding IDs** (supersede the plan's composite IDs): `mild_asthma`,
`ponv_high_risk`, `ocp_vte_risk`, `codeine_intolerance`, `latex_precaution`,
`airway_assessed`, `anesthetic_history_reviewed`.

**Realigned plan rule IDs:** `asa_ii_with_reason`, `reactive_airway_plan`,
`multimodal_ponv_prophylaxis`, `vte_prophylaxis`, `postoperative_pain_plan`.

### Phase 1 — `preassessment`
- **Trainee:** review chart; interview for asthma control/triggers/last exacerbation,
  PONV history, OCP use, codeine reaction; airway exam; anesthetic history. Summarize
  findings.
- **Instructor script:** confirm the trainee *asks* about asthma (not just reads it),
  elicits the high PONV history, and recognizes codeine intolerance ≠ allergy. Red flag:
  moving to plan without an airway exam. (`consider_asthma_control`, `consider_ponv_risk`,
  `consider_airway_exam`.)
- **Engine effect:** none (assessment). **Source:** DOC-A Case 07; DOC-B; DOC-C.

### Phase 2 — `plan_review`
- **Trainee:** ASA II with reason; reactive-airway plan (sevoflurane preferred, avoid
  desflurane; albuterol available); multimodal PONV prophylaxis (dexamethasone +
  ondansetron ± TIVA); VTE prophylaxis (SCDs) for pneumoperitoneum + OCP; multimodal
  analgesia avoiding codeine/tramadol; latex-safe environment.
- **Instructor script:** the plan must pre-empt bronchospasm (agent choice, albuterol
  ready) — this is what pays off live. (`consider_ponv_plan`, `consider_reactive_airway`.)
- **Engine effect:** none. **Source:** DOC-A Case 07 lines 305–348.

### Phase 3 — `induction_airway`
- **Trainee:** preoxygenate (ETO₂ > 90%); induce (propofol + fentanyl); **confirm
  mask ventilation BEFORE rocuronium**; demonstrate PPV while awaiting onset; intubate.
- **Instructor script:** watch the discriminator — paralytic before confirmed mask
  ventilation is the scored error. (`consider_mask_before_paralytic`.)
- **Engine effect:** `induction_started` (action, auto), `airway_secured` (action, auto).
  Real preox/ETO₂ and mask-vs-paralytic ordering. **Source:** Standard IV rubric items 5–8, 12.
- **Instructor beat (fireable now):** `bronchospasm_onset` — `inject_complication:Bronchospasm`.
  Rising airway resistance, falling SpO₂, wheeze. **Trainee:** recognize, deepen anesthetic
  and/or give albuterol; hand-ventilate. **Source:** DOC-A Case 07 (mild asthma; sevoflurane
  bronchodilator); engine `scenarioManager.js:618–621,745–763`.

### Phase 4 — `laparoscopic_maintenance`
- **Instructor beat (fireable now):** `pneumoperitoneum_started` — `set_machine` reduces
  effective ventilation (models reduced compliance/positioning; the engine has no CO₂-
  absorption input, so the EtCO₂ rise is produced honestly via reduced alveolar
  ventilation — noted in sourcing). Secondary auto path: `ventilatory_challenge_detected`
  on an EtCO₂ dwell.
- **Trainee:** recognize rising EtCO₂; increase minute ventilation ~25–30%.
  `ventilation_adjusted` fires on the accepted machine-setting action.
- **Instructor script:** confirm the trainee *increases MV* rather than chasing depth.
  **Source:** DOC-A Case 07 line 326 ("increase MV 25–30%").
- **Engine effect:** real EtCO₂ response to minute ventilation.

### Phase 5 — `emergence`
- **Trainee:** end volatile; confirm TOF and reverse (sugammadex); confirm spontaneous
  ventilation; extubate awake; PONV re-check.
- **Instructor script:** sugammadex 2–4 mg/kg reasoning; PONV plan carried to PACU.
  **Source:** DOC-A Case 07 lines 338, 348.
- **Engine effect:** real TOF/reversal/spontaneous-ventilation (shared emergence model).

### Phase 6 — `debrief`
- Teaching items (all DOC-A Case 07 pearls, released per instructor toggle): Apfel score
  and 80% figure; multimodal PONV regimen; pneumoperitoneum 15 mmHg / >20 risk; sugammadex
  vs neostigmine; sevoflurane for the reactive airway.

---

## Brittany Cole — `cn_preassessment_npo_mh_001`

**Patient:** elective knee arthroscopy; heavy breakfast ~2 h pre-op (ASA fasting
violation); MH family history (DOC-E); predicted difficult airway with dental risk
(DOC-C). No source-patient exists, so non-MH attributes stay at DOC-B/DOC-C level;
weight set honestly so failed-attempt desaturation is realistic.

**Finding IDs (unchanged by realignment):** `heavy_breakfast_two_hours`,
`family_history_mh`, `pregnancy_screen_needed`, `predicted_difficult_airway`,
`dental_injury_risk`. **Plan rule IDs:** `asa_not_changed_by_npo`,
`postpone_elective_case`, `escalate_mh_history`, `trigger_free_plan`,
`difficult_airway_plan`, `team_communication`.

### Primary correct path — phases `preassessment → plan_review → appropriately_deferred → debrief`
- **Trainee:** discover the fasting violation (against ASA minimums) and the MH family
  history; assess airway/dental; conclude **postpone**, escalate MH, document trigger-free
  precautions and team communication. ASA-PS unchanged by NPO.
- **Instructor script:** the correct disposition is to decline to proceed — scored as a
  successful outcome, not a failure. Red flags: proceeding despite the violation; missing
  the MH history. (`consider_npo_violation`, `consider_mh_escalation`, `consider_asa_unchanged`.)
- **Engine effect:** none — the correct path involves no live anesthetic. **Source:** DOC-C
  lines 94–101, 145–150, 306–312; DOC-E; ASA fasting (operator-directed).

### Instructor training-only branch — `proceed_for_training` (labelled a counterfactual)
Fired only by the instructor (`activate_branch`); the debrief repeatedly labels it an
educational counterfactual, never the recommended disposition. Phases
`training_preinduction → trigger_free_induction → difficult_airway → training_maintenance
→ training_emergence`.
- **RSI technique** (rubric `carson-newman-rsi-induction`, 53/106/27 critical): preox to
  ETO₂ > 90% (item 7/8), cricoid (9), no mask PPV before first laryngoscopy (11), timed
  attempt; **first attempt fails** (`airwayPlan.failedIntubationAttempts:[1]`, real
  desaturation), PPV-with-cricoid rescue (28), second attempt succeeds (26/42).
- **MH beat (instructor-fired on an unsafe trigger):** if the learner selects
  succinylcholine or a volatile, `mh_complication_started`
  (`inject_complication:MalignantHyperthermia`). **EtCO₂ rises first (early sign), HR up,
  temperature later** — matches DOC-E. **Trainee:** stop the trigger, hyperventilate 100%
  O₂, **dantrolene 2.5 mg/kg**, cool, call MHAUS. Resolves on dantrolene + volatile off.
- **Trigger-free path:** if no unsafe trigger through the window, `trigger_free_path_maintained`.
- **Source:** DOC-E throughout; DOC-D RSI rubric; engine `scenarioManager.js:630–632,702–722`,
  `airwayProcedureSystem.js` failed-attempt path.

**Time compression:** every training beat (`mh_complication_started`, attempt outcomes,
rescue) is instructor-fireable so the branch can be taught in minutes.

---

## What this design deliberately does NOT simulate (honesty, per capability map)

- PONV, GERD/aspiration, smoking physiology, and any valve/rate-dependent hemodynamics
  are **not** live effects — the engine has no model. They are assessed as plan/chart
  items only. The monitor will not react to them, and no teaching text implies it will.
- Difficult **mask** ventilation is not modeled; Brittany's difficulty is intubation-side
  only (first attempt fails, mask rescue succeeds).
- `needsReview: true` is set on every ASA-operator-directed value and on the unsourced
  items U-4 (pregnancy-screen indication) and U-5 (Brittany's specific airway exam values).