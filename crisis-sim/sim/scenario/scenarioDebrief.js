/* Faithful port of OperatingRoom.Simulation.ScenarioDebrief + SimulationResult.
   completedAtUtc is omitted (non-deterministic; excluded from parity). */
import { mul, div, RoundToInt } from '../float32.js';

const pretty = (key) => (!key ? '' : key.replace(/_/g, ' '));

// .NET custom "0" / "F0" formatting: round half to even.
function fmt0(x) {
  const s = Math.sign(x);
  const a = Math.abs(x);
  const fl = Math.floor(a);
  const diff = a - fl;
  let r;
  if (diff < 0.5) r = fl;
  else if (diff > 0.5) r = fl + 1;
  else r = fl % 2 === 0 ? fl : fl + 1;
  return String(s < 0 ? -r : r);
}

export function buildDebrief(def, run, scoring, log, totalScore, maxScore, durationSec) {
  const r = {
    scenarioId: def.id,
    title: def.title,
    courseUnit: def.courseUnit || '',
    durationSec,
    rawPoints: totalScore,
    maxPoints: maxScore,
    score: maxScore > 0 ? Math.max(0, Math.min(100, RoundToInt(div(mul(100, totalScore), maxScore)))) : 0,
    timeToRecognitionSec: run.timeToRecognition,
    timeToTreatmentSec: run.timeToTreatment,
    teachingFeedback: '',
    teachingPoints: [],
    reviewTopics: [],
    reviewTags: [],
    criticalActionsCompleted: [],
    criticalActionsMissed: [],
    dangerousActions: [],
  };

  if (def.expectedActions) {
    for (let i = 0; i < def.expectedActions.length; i++) {
      const name = pretty(def.expectedActions[i].action);
      if (run.expectedDone.has(i)) {
        r.criticalActionsCompleted.push(run.expectedLate.get(i) ? `${name} (late)` : name);
      } else {
        r.criticalActionsMissed.push(name);
      }
    }
  }
  if (def.dangerousActions) {
    for (const i of run.dangerousFired) {
      if (i >= 0 && i < def.dangerousActions.length) r.dangerousActions.push(pretty(def.dangerousActions[i].action));
    }
  }

  if (def.debrief) {
    r.teachingFeedback = composeFeedback(def, r);
    r.teachingPoints = def.debrief.teachingPoints || [];
    r.reviewTopics = def.debrief.reviewTopics || [];
    r.reviewTags = (def.debrief.reviewTags && def.debrief.reviewTags.length > 0)
      ? def.debrief.reviewTags : (def.tags || []);
  }
  return r;
}

export function buildLidocaineAttribution(lidocaineSystem, tofCheckHistory = []) {
  const l = lidocaineSystem;
  if (!l) {
    return {
      peakPlasmaTotalMcgMl: 0,
      currentToxicityStage: 'none',
      doseHistory: [], regionalHistory: [], toxicityHistory: [], lipidRescueHistory: [],
      stimulation: {}, ventricularIrritability: {}, rhythmHistory: [], tofCheckHistory: [],
    };
  }
  return {
    peakPlasmaTotalMcgMl: l.peakPlasmaTotalMcgMl,
    currentPlasmaTotalMcgMl: l.plasmaTotalMcgMl,
    currentPlasmaFreeMcgMl: l.plasmaFreeMcgMl,
    currentEffectSiteMcgMl: l.effectSiteMcgMl,
    currentToxicityStage: l.toxicityStage,
    doseHistory: l.doseHistory,
    regionalHistory: l.regionalHistory,
    toxicityHistory: l.toxicityHistory,
    lipidRescueHistory: l.lipidRescueHistory,
    stimulation: {
      raw: l.surgicalStimulusRaw,
      effective: l.surgicalStimulusEffective,
      regionalSensoryBlock: l.regionalSensoryBlock,
      systemicAnalgesicContribution: l.systemicAnalgesicContribution,
    },
    ventricularIrritability: {
      raw: l.ventricularIrritabilityRaw,
      effective: l.ventricularIrritabilityEffective,
      antiarrhythmicContribution: l.antiarrhythmicContribution,
      derivedRhythm: l.derivedRhythm,
    },
    rhythmHistory: l.irritabilityHistory,
    tofCheckHistory: tofCheckHistory.map((record) => ({ ...record })),
  };
}

function composeFeedback(def, r) {
  const parts = [];
  if (def.debrief.summary) parts.push(def.debrief.summary);
  if (r.criticalActionsMissed.length === 0 && r.dangerousActions.length === 0) {
    parts.push('All critical actions were completed without dangerous behavior.');
  }
  if (r.criticalActionsMissed.length > 0) parts.push(`Missed: ${r.criticalActionsMissed.join(', ')}.`);
  if (r.dangerousActions.length > 0) parts.push(`Dangerous: ${r.dangerousActions.join(', ')}.`);
  if (r.timeToTreatmentSec >= 0) parts.push(`Time to treatment: ${fmt0(r.timeToTreatmentSec)}s.`);
  return parts.join(' ');
}
