/* Faithful port of OperatingRoom.Simulation.ScenarioScoring. */
import { Max, Min, sub } from '../float32.js';
import { ActionClass } from './scenarioState.js';
import { ActionCatalog } from './actionCatalog.js';

const FLOAT_MAX = 3.4028234663852886e38; // float.MaxValue

export class ScenarioScoring {
  constructor(def, run, log) {
    this.def = def; this.run = run; this.log = log;
    this.earned = 0;
    this.penalties = 0;
    this.MaxExpectedPoints = 0;
    this.onFeedback = null; // (msg, isPositive) => void
    if (def.expectedActions) {
      for (const ea of def.expectedActions) this.MaxExpectedPoints += Math.max(0, ea.points);
    }
  }

  _fb(msg, positive) { if (this.onFeedback) this.onFeedback(msg, positive); }

  evaluate(canonical, tSec) {
    let delta = 0; let fb = ''; let cls = ActionClass.Neutral;
    const { def, run } = this;

    if (def.dangerousActions) {
      for (let i = 0; i < def.dangerousActions.length; i++) {
        const da = def.dangerousActions[i];
        if (run.dangerousFired.has(i)) continue;
        if (da.action && da.action === canonical && !ScenarioScoring.isConditionKey(da.action)) {
          run.dangerousFired.add(i);
          delta += da.penalty;
          this.penalties += da.penalty;
          fb = da.feedback;
          cls = ActionClass.Dangerous;
          this._fb(da.feedback, false);
        }
      }
    }

    if (def.expectedActions) {
      for (let i = 0; i < def.expectedActions.length; i++) {
        if (run.expectedDone.has(i)) continue;
        const ea = def.expectedActions[i];
        if (!ScenarioScoring._matches(ea, canonical)) continue;

        let windowStart = 0;
        if (ea.afterTrigger && run.firedTriggers.has(ea.afterTrigger)) windowStart = run.firedTriggers.get(ea.afterTrigger);
        const late = ea.timeLimitSec > 0 && sub(tSec, windowStart) > ea.timeLimitSec;

        const pts = late ? Math.max(1, Math.trunc(ea.points / 2)) : ea.points;
        run.expectedDone.set(i, tSec);
        run.expectedLate.set(i, late);
        this.earned += pts;
        delta += pts;
        cls = ActionClass.Expected;
        fb = ea.feedback
          ? ea.feedback
          : (late ? `${ea.action} done (late — half credit)` : `${ea.action} ✓`);
        this._fb(fb, !late);
        if (run.insultOnsetSec >= 0) run.noteTreatment(tSec);
        break;
      }
    }

    if (cls === ActionClass.Neutral) run.noteRecognition(tSec);
    return { delta, cls, feedback: fb };
  }

  static _matches(ea, canonical) {
    if (ea.action && ea.action === canonical) return true;
    const dk = ActionCatalog.isDrugKey(canonical);
    if (ea.acceptedDrugs && dk.ok) {
      for (const d of ea.acceptedDrugs) if (d.toLowerCase() === dk.drug.toLowerCase()) return true;
    }
    if (ea.acceptedInterventions) {
      for (const iv of ea.acceptedInterventions) {
        const key = ActionCatalog.canonical(iv);
        if (key === canonical) return true;
        const dk2 = ActionCatalog.isDrugKey(canonical);
        if (dk2.ok && iv.toLowerCase() === dk2.drug.toLowerCase()) return true;
      }
    }
    return false;
  }

  tickConditions(p, tSec, dt) {
    const { def, run } = this;
    if (def.dangerousActions == null || p == null) return 0;
    let delta = 0;

    run.hypotensionSince = ScenarioScoring._track(run.hypotensionSince, p.meanArterialPressure < 60, tSec);
    run.hypoxiaSince = ScenarioScoring._track(run.hypoxiaSince, p.spO2 < 90, tSec);
    run.highEtco2Since = ScenarioScoring._track(run.highEtco2Since, p.etCO2 > 60, tSec);
    if (run.hypotensionSince >= 0 || run.hypoxiaSince >= 0 || run.highEtco2Since >= 0) {
      run.noteInsult(Min(
        run.hypotensionSince >= 0 ? run.hypotensionSince : FLOAT_MAX,
        Min(run.hypoxiaSince >= 0 ? run.hypoxiaSince : FLOAT_MAX,
          run.highEtco2Since >= 0 ? run.highEtco2Since : FLOAT_MAX),
      ));
    }

    for (let i = 0; i < def.dangerousActions.length; i++) {
      const da = def.dangerousActions[i];
      if (run.dangerousFired.has(i) || !ScenarioScoring.isConditionKey(da.action)) continue;

      let fire = false;
      switch (da.action) {
        case 'ignore_hypotension':
          fire = run.hypotensionSince >= 0 && sub(tSec, run.hypotensionSince) >= da.conditionSec && !this._treatedBy(da);
          break;
        case 'ignore_hypoxia':
          fire = run.hypoxiaSince >= 0 && sub(tSec, run.hypoxiaSince) >= da.conditionSec && !this._treatedBy(da);
          break;
        case 'ignore_rising_etco2':
          fire = run.highEtco2Since >= 0 && sub(tSec, run.highEtco2Since) >= da.conditionSec && !this._treatedBy(da);
          break;
        case 'fail_to_confirm_etco2':
          fire = run.intubatedAtSec >= 0 && !run.etco2Confirmed && sub(tSec, run.intubatedAtSec) >= Max(30, da.conditionSec);
          break;
        default: break;
      }
      if (fire) {
        run.dangerousFired.add(i);
        this.penalties += da.penalty;
        delta += da.penalty;
        if (this.log) this.log.record(tSec, da.action, da.action, p, ActionClass.Dangerous, da.penalty, da.feedback);
        this._fb(da.feedback, false);
      }
    }
    return delta;
  }

  _treatedBy(da) {
    const { def, run } = this;
    if (!da.treatedBy || da.treatedBy.length === 0 || def.expectedActions == null) return false;
    for (let i = 0; i < def.expectedActions.length; i++) {
      if (!run.expectedDone.has(i)) continue;
      const key = def.expectedActions[i].action;
      for (let j = 0; j < da.treatedBy.length; j++) if (key === da.treatedBy[j]) return true;
    }
    return false;
  }

  static _track(since, active, tSec) {
    if (active) { if (since < 0) return tSec; return since; }
    return -1;
  }

  static isConditionKey(a) {
    return a === 'ignore_hypotension' || a === 'ignore_hypoxia' ||
      a === 'ignore_rising_etco2' || a === 'fail_to_confirm_etco2';
  }

  missedExpected() {
    const missed = [];
    if (this.def.expectedActions) {
      for (let i = 0; i < this.def.expectedActions.length; i++) if (!this.run.expectedDone.has(i)) missed.push(i);
    }
    return missed;
  }
}
