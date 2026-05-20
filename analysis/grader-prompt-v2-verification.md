# Grader Prompt V2 Verification Results

**Date:** 2026-05-20
**Model:** `claude-opus-4-7`
**Prompt version:** V2 (mechanism-required, safety override, extra-content tolerant)
**Question tested:** r-ap1-w1-3 (Compartment Model / Propofol Redistribution)

---

## Test 1: Wrong CSHT Definition (C-tier replay)

**Purpose:** Confirm the new prompt does NOT capture kp3 when the student names
"context-sensitive half-time" but defines it incorrectly.

**Answer submitted:** _"Context-sensitive half-time means the drug half-life changes
depending on how long you give it."_ (exact C-tier answer from Phase 2)

**Result:**
- **kp3 captured: NO** (correct — previously over-captured in Phase 2)
- **kp3 flagged as error: YES** — correction states CSHT is the time for plasma
  concentration to fall 50% after stopping an infusion, not a changing half-life
- **Safety override applied: YES** — the student's claim that elderly patients
  need higher propofol doses triggered the patient-harm cap, limiting the score
  to below 60 regardless of other captured points
- **Score: 9 (was 29 under old prompt)**
- **Passed: false**

**Verdict: PASS** — The mechanism-required rule and safety override both function
correctly. The old prompt captured kp3 from this answer; the new prompt rejects it
and flags it as an error.

---

## Test 2: Correct Redistribution Without the Word "Redistribution"

**Purpose:** Confirm the new prompt captures kp2 when the student describes the
correct mechanism in their own words without using the textbook term.

**Answer submitted:** _"...the drug moves down its concentration gradient out of
the brain into muscle tissue and eventually fat. The brain concentration drops
below the level needed to keep the patient unconscious. Hepatic metabolism is far
too slow to explain an 8-minute awakening..."_ (never uses the word
"redistribution")

**Result:**
- **kp2 captured: YES** — evidence quoted the mechanistic description
- **All 6 key points captured**
- **Errors: 0**
- **Score: 100**
- **Passed: true**

**Verdict: PASS** — Paraphrase is rewarded. Understanding beats vocabulary.

---

## Test 3: All Points Correct + Extra Accurate Content

**Purpose:** Confirm the new prompt does not penalize accurate clinical content
beyond the rubric.

**Answer submitted:** All 6 key points addressed correctly, plus one extra
sentence: _"prolonged high-dose propofol infusions carry risk of propofol infusion
syndrome, characterized by metabolic acidosis, rhabdomyolysis, and cardiac failure"_

**Result:**
- **All 6 key points captured**
- **Propofol infusion syndrome NOT flagged as error** (correct — it is accurate)
- **Errors: 0**
- **Score: 100**
- **Passed: true**

**Verdict: PASS** — Extra correct content is tolerated without penalty.

---

## Prompt V2 Behavior Changes Confirmed

| Behavior | Old Prompt (Sonnet 4) | New Prompt (Opus 4.7) |
|---|---|---|
| Wrong CSHT definition | Captured kp3 (score 29) | Rejected kp3, flagged as error (score 9) |
| Safety override on dangerous claim | Not implemented | Applied — elderly overdose capped score |
| Paraphrase without term | Captured | Captured (unchanged) |
| Extra correct content | Not penalized | Not penalized (unchanged) |
| Model | claude-sonnet-4-20250514 | claude-opus-4-7 |
| Temperature | 0.3 | Removed (deprecated for Opus 4.7) |

---

*Raw JSON results: `analysis/grader-tests/v2-test1-csht-wrong-def.json`,
`v2-test2-no-redistribution-word.json`, `v2-test3-extra-correct-content.json`*
