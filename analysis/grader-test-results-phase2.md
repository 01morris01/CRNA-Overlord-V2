# Phase 2: Live Grader Test Results

**Date:** 2026-05-20
**Endpoint:** Anthropic Messages API (direct call replicating `/api/grade-recall` logic)
**Model:** `claude-sonnet-4-20250514`
**System prompt:** Identical to `api/grade-recall.js` Dr. Voss persona
**Tests:** 3 questions x 4 answer tiers = 12 total

> **Note:** The live Vercel endpoint (`/api/grade-recall`) references model `claude-sonnet-4-5-20250514` which returns 404 on the current API key. Tests used `claude-sonnet-4-20250514` (Sonnet 4) via direct Anthropic API call with the identical system prompt, rubric format, and temperature (0.3). Fix the model ID in `api/grade-recall.js` before production use.

---

## Score Summary

| Question | Tier A (Excellent) | Tier B (Good) | Tier C (Partial+Errors) | Tier D (Poor) |
|---|---|---|---|---|
| **Q3** r-ap1-w1-3 (Compartment Model) | 100 (6/6 captured, 0 errors) | 83 (4/6 captured, 0 errors) | 29 (2/6 captured, 3 errors) | 0 (0/6 captured, 2 errors) |
| **Q6** r-ap1-w1-6 (Hepatic Metabolism) | 100 (6/6 captured, 0 errors) | 86 (4/6 captured, 0 errors) | 29 (2/6 captured, 1 error) | 0 (0/6 captured, 3 errors) |
| **Q9b** r-ap1-w1-9b (Clearance) | 100 (5/5 captured, 0 errors) | 80 (3/5 captured, 0 errors) | 20 (1/5 captured, 3 errors) | 0 (0/5 captured, 1 error) |

---

## Grading Behavior Analysis

### Score Gradient
The grader produces a clean monotonic gradient across all three questions:
- **A tier (100):** All key points captured, zero false errors flagged
- **B tier (80-86):** Core points captured, peripheral points (pulmonary uptake, halothane, codeine, ion trapping, NAPQI) correctly identified as missed, no false errors
- **C tier (20-29):** Only superficial mentions captured; factual errors correctly identified and corrected
- **D tier (0):** Zero points awarded; major misconceptions correctly flagged

### Error Detection Quality
The grader correctly caught every planted error:

| Planted Error | Question | Detected? | Correction Quality |
|---|---|---|---|
| "Propofol rapidly metabolized by liver" (bolus awakening) | Q3-C | YES | Correctly attributed to redistribution |
| "Liver enzymes overwhelmed after 4 hrs" | Q3-C | YES | Explained peripheral saturation instead |
| "Elderly need higher doses (more fat)" | Q3-C | YES | Corrected to smaller central compartment, lower doses |
| "Liver gets fatigued" | Q3-D | YES | Correctly dismissed as misconception |
| "Pseudocholinesterase breaks down remifentanil" | Q6-C | YES | Correctly specified nonspecific tissue esterases |
| "CYP3A4 breaks down remifentanil" | Q6-D | YES | Correct distinction |
| "Kidneys clear remifentanil" | Q6-D | YES | Organ-independent esterase metabolism |
| "Enzyme inducers for high-extraction drug" | Q9b-C | YES | Flow-limited ceiling correctly explained |
| "Make urine acidic to trap acidic drugs" | Q9b-C | YES | Corrected to alkaline urine traps weak acids |
| "Creatinine normal = kidneys fine" | Q9b-C | YES | Muscle mass masking explained |

**Zero false positives:** No correct statements were flagged as errors in any tier.

### Rubric Point Discrimination
The grader correctly distinguished between:
- **Paraphrased hits:** Q3-B mentions "vessel-rich group which receives a large portion of cardiac output" without the exact "75% / 10%" figures -- still captured (generous on phrasing)
- **Mentioned but wrong:** Q3-C mentions "context-sensitive half-time" but defines it incorrectly as "drug half-life changes" -- still captured kp3 (borderline call, see note below)
- **Topic mentioned but mechanism wrong:** Q3-C mentions liver metabolism as cause of rapid awakening -- correctly NOT captured for kp2 (strict on accuracy)

### Voss Persona
The Dr. Voss quips are in-character, snarky but instructive, and appropriately calibrated to answer quality:
- A tier: "Finally, someone who actually understands pharmacokinetics instead of memorizing flashcards."
- C tier: "Redistribution, not metabolism. The liver doesn't get tired after lunch."
- D tier: "Did you confuse remifentanil with furosemide? Back to basics."

---

## Issues Found

### 1. Model ID Mismatch (BLOCKING for production)
`api/grade-recall.js` line 62 references `claude-sonnet-4-5-20250514` which returns 404.
Working model: `claude-sonnet-4-20250514`.
**Fix:** Update model string in `api/grade-recall.js`.

### 2. Markdown Code Fences in Response
The model wraps JSON in ` ```json ... ``` ` fences despite the system prompt saying "Respond in valid JSON only." The `grade-recall.js` regex parser (`text.match(/\{[\s\S]*\}/)`) handles this correctly by extracting the inner JSON object. No fix needed, but worth noting.

### 3. Borderline Capture on Q3-C kp3
The grader captured kp3 (CSHT definition) from the C-tier answer "Context-sensitive half-time means the drug half-life changes depending on how long you give it" — this is an imprecise paraphrase. CSHT is specifically about plasma concentration falling 50% after stopping an infusion, not about half-life changing. The "generous on phrasing" instruction in the system prompt may be slightly too generous here. Consider adding "strict on mechanism" qualifier.

### 4. Q9b-C kp2 Partial Capture
The grader awarded kp2 for "drugs are filtered by the glomerulus based on size" — this captures only filtration, not the full three-mechanism framework (filtration + secretion - reabsorption). Awarded at score=20, suggesting the grader correctly weighted this as minimal.

---

## Conclusion

The grading system reliably:
- Discriminates across 4 quality tiers with monotonic scores
- Catches factual errors with accurate corrections
- Respects rubric weights (critical kp2 in Q3 worth 2 points)
- Generates zero false-positive error flags
- Produces in-character, pedagogically useful feedback

**Recommendation:** Fix the model ID in `api/grade-recall.js`, then the live endpoint is production-ready for these rubrics.

---

*Raw JSON results: `analysis/grader-tests/*.json`*
