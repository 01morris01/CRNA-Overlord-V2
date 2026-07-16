/* ═══════════════════════════════════════════════════════════════════
   scenarioManager.js — faithful float32 port of
   OperatingRoom.Simulation.ScenarioManager (the scenario-platform surface:
   loading, starting, actions, triggered events, delta vital-change
   transitions, per-tick complication machines, scoring, and debrief).
   Truth boundary preserved: complications set drivers only.
   ═══════════════════════════════════════════════════════════════════ */
import {
  f, add, sub, mul, div, Clamp, Clamp01, Max, Min, Lerp, MoveTowards,
} from '../float32.js';
import { VentMode } from '../ventilatorSystem.js';
import { AirwayDevice } from '../patientPhysiology.js';
import { ScenarioRunState, ActionClass } from './scenarioState.js';
import { ScenarioScoring } from './scenarioScoring.js';
import { ActionLogger } from './actionLogger.js';
import { ActionCatalog } from './actionCatalog.js';
import { ScenarioEventType, normalize } from './scenarioLoader.js';
import { buildDebrief } from './scenarioDebrief.js';

export const ScenarioState = {
  NotLoaded: 0, Ready: 1, Running: 2, Paused: 3, Completed: 4, Failed: 5,
};

const SpasmStage = { None: 0, Partial: 1, Complete: 2, Resolved: 3 };

export class ScenarioManager {
  constructor() {
    this.patient = null;
    this.drugSystem = null;
    this.lidocaineSystem = null;
    this.ventilator = null;
    this.airwayProcedure = null;
    this.alarmSystem = null;

    this.activeScenario = null;
    this.state = ScenarioState.NotLoaded;
    this.elapsedTime = 0;
    this.scenarioSpeed = 1;
    this.currentScore = 0;
    this.maxPossibleScore = 0;

    this.eventLog = [];
    this.activePrompts = [];
    this.feedbackMessage = '';
    this.feedbackTimer = 0;

    this._firedEvents = new Set();
    this._completedChecks = new Set();
    this._studentActions = new Map();

    this.drivenExternally = false;
    this.rng = null;
    this.seed = 12345;

    this.run = null;
    this.actionLog = new ActionLogger();
    this.scoring = null;
    this.lastResult = null;
    this.onDebriefReady = null;
    this.onScoreChanged = null;

    this._transitions = [];
    this._deadlines = [];
    this._airwayEventCursor = 0;

    this._cpapUntil = 0; this._jawThrustUntil = 0; this._coolingUntil = 0;
    this._allergenStopped = false;
    this._spasm = SpasmStage.None;

    this._mhActive = false; this._anaphylaxisActive = false; this._bronchoActive = false; this._opioidActive = false;
    this._sympActive = false; this._sympSeverity = 0;
    this._mhSeverity = 0; this._anaphylaxisSeverity = 0; this._bronchoSeverity = 0; this._opioidSeverity = 0;
    this._mhFailTimer = 0; this._anaphylaxisFailTimer = 0; this._bronchoFailTimer = 0; this._opioidFailTimer = 0;
    this._naloxoneSurgeActive = false; this._naloxoneSurge = 0;
    this._restingVco2 = 200;

    this._hemorrhageActive = false; this._bleedingControlled = false;
    this._hemorrhageFailTimer = 0; this._lastHemorrhageClass = -1;
    this._lidocaineToxicityCursor = 0;
  }

  // ── loading ──────────────────────────────────────────────────────────
  loadDefinition(def) {
    if (def == null) return;
    this.activeScenario = def;
    this.resetScenario();
    this.setState(ScenarioState.Ready);
  }

  // load a raw parsed scenario object (clones + normalizes, as C# re-parses)
  loadRaw(rawObj) {
    const def = normalize(JSON.parse(JSON.stringify(rawObj)));
    this.loadDefinition(def);
  }

  // ── control ──────────────────────────────────────────────────────────
  startScenario() {
    if (this.activeScenario == null || this.state === ScenarioState.Running) return;
    this.resetScenario();
    this.applyPatientProfile();
    this.applyStartingSetup();
    this.applyAirwayPlan();
    this.run = new ScenarioRunState();
    this.run.scenarioId = this.activeScenario.id;
    this.run.startedAtSim = 0;
    this.actionLog.clear();
    this.scoring = new ScenarioScoring(this.activeScenario, this.run, this.actionLog);
    this.scoring.onFeedback = (msg, ok) => this.setFeedback(msg, ok);
    this.maxPossibleScore += this.scoring.MaxExpectedPoints;
    this.setState(ScenarioState.Running);
    this.logEvent(`Scenario started: ${this.activeScenario.title}`);
  }

  pauseScenario() {
    if (this.state === ScenarioState.Running) { this.setState(ScenarioState.Paused); this.logEvent('Scenario paused'); }
  }

  resumeScenario() {
    if (this.state === ScenarioState.Paused) { this.setState(ScenarioState.Running); this.logEvent('Scenario resumed'); }
  }

  /**
   * Rebase a paused, administratively preconditioned case to learner t=0
   * without resetting its already-derived physiology. This is intentionally
   * narrower than resetScenario(): setup state stays intact, while every
   * learner-visible scenario clock, event cursor, score, and log is fresh.
   */
  rebaseLearnerRun() {
    if (this.activeScenario == null) throw new Error('Cannot rebase without an active scenario');
    if (this.state !== ScenarioState.Paused) {
      throw new Error('Scenario must be paused before rebasing learner time');
    }

    this.elapsedTime = 0;
    this.currentScore = 0;
    this._firedEvents.clear();
    this._completedChecks.clear();
    this._studentActions.clear();
    this._transitions = [];
    this._deadlines = [];
    this._airwayEventCursor = 0;
    this.eventLog = [];
    this.activePrompts = [];
    this.feedbackMessage = '';
    this.feedbackTimer = 0;

    this.run = new ScenarioRunState();
    this.run.scenarioId = this.activeScenario.id;
    this.run.startedAtSim = 0;
    this.actionLog.clear();
    this.scoring = new ScenarioScoring(this.activeScenario, this.run, this.actionLog);
    this.scoring.onFeedback = (msg, ok) => this.setFeedback(msg, ok);
    this.maxPossibleScore = this.scoring.MaxExpectedPoints;
    this.lastResult = null;
    this.setState(ScenarioState.Running);
    return { scenarioId: this.activeScenario.id, elapsedTime: this.elapsedTime };
  }

  resetScenario() {
    this.elapsedTime = 0;
    this.currentScore = 0;
    this._firedEvents.clear();
    this._completedChecks.clear();
    this._studentActions.clear();
    this._transitions = [];
    this._deadlines = [];
    this._airwayEventCursor = 0;
    this._cpapUntil = 0; this._jawThrustUntil = 0; this._coolingUntil = 0;
    this._allergenStopped = false;
    this._spasm = SpasmStage.None;
    this._mhActive = false; this._anaphylaxisActive = false; this._bronchoActive = false; this._opioidActive = false;
    this._sympActive = false; this._sympSeverity = 0;
    this.run = null; this.scoring = null; this.lastResult = null;
    this.actionLog.clear();
    this._mhSeverity = 0; this._anaphylaxisSeverity = 0; this._bronchoSeverity = 0; this._opioidSeverity = 0;
    this._mhFailTimer = 0; this._anaphylaxisFailTimer = 0; this._bronchoFailTimer = 0; this._opioidFailTimer = 0;
    this._naloxoneSurgeActive = false; this._naloxoneSurge = 0;
    this._hemorrhageActive = false; this._bleedingControlled = false; this._hemorrhageFailTimer = 0; this._lastHemorrhageClass = -1;
    this._lidocaineToxicityCursor = 0;
    this._restingVco2 = this.patient != null ? Max(120, mul(2.8, this.patient.weightKg)) : 200;
    this.eventLog = [];
    this.activePrompts = [];
    this.feedbackMessage = '';
    this.feedbackTimer = 0;

    if (this.activeScenario != null) {
      this.maxPossibleScore = 0;
      for (const evt of this.activeScenario.events) {
        if (evt.type !== ScenarioEventType.Assessment) continue;
        if (this.isAssessmentSatisfiable(evt.expectedAction)) this.maxPossibleScore += evt.points;
      }
    }

    if (this.airwayProcedure != null) this.airwayProcedure.reset();
    if (this.patient != null) this.patient.resetToBaseline();
    if (this.drugSystem != null && this.drugSystem.resetReversalState) this.drugSystem.resetReversalState();
    if (this.lidocaineSystem != null && this.lidocaineSystem.reset) this.lidocaineSystem.reset();
    this.setState(this.activeScenario != null ? ScenarioState.Ready : ScenarioState.NotLoaded);
  }

  // ── student actions ──────────────────────────────────────────────────
  recordStudentAction(actionName) {
    const canonical = ActionCatalog.canonical(actionName);
    if (canonical === 'intubate' && this.activeScenario?.airwayPlan != null
      && this.airwayProcedure != null) {
      const result = this.airwayProcedure.attemptIntubation();
      this.processAirwayProcedureEvents();
      if (!result.ok) this.logEvent(`Intubation attempt rejected: ${result.reason}`);
      return result;
    }

    this._studentActions.set(actionName, this.elapsedTime);
    this.logEvent(`Student action: ${actionName} at ${this.formatTime(this.elapsedTime)}`);
    this.applyActionPhysiology(actionName);
    this.checkAssessments(actionName);

    if (this.run != null) {
      this.run.markTrigger(canonical, this.elapsedTime);
      if (canonical === 'intubate') {
        this.run.intubatedAtSec = this.elapsedTime;
        this.run.markTrigger('intubation_successful', this.elapsedTime);
      }
      if (canonical === 'confirm_etco2') this.run.etco2Confirmed = true;
    }
    let delta = 0; let cls = ActionClass.Neutral; let fb = '';
    if (this.scoring != null) {
      ({ delta, cls, feedback: fb } = this.scoring.evaluate(canonical, this.elapsedTime));
      if (delta !== 0) {
        this.currentScore += delta;
        if (this.onScoreChanged) this.onScoreChanged(this.currentScore, this.maxPossibleScore);
      }
    }
    const dk = ActionCatalog.isDrugKey(canonical);
    this.actionLog.record(this.elapsedTime, actionName, canonical, this.patient, cls, delta, fb, dk.ok ? dk.drug : null);
    this.processTriggeredEvents(canonical);
    return undefined;
  }

  processAirwayProcedureEvents() {
    if (this.airwayProcedure == null) return;
    const events = this.airwayProcedure.eventsSince(this._airwayEventCursor);
    this._airwayEventCursor += events.length;
    for (const event of events) {
      let delta = 0;
      let cls = ActionClass.Neutral;
      let feedback = '';

      if (event.type === 'intubation_attempt_succeeded' && this.run != null) {
        this._studentActions.set('Intubate', event.tSec);
        this.run.intubatedAtSec = event.tSec;
        this.run.markTrigger('intubate', event.tSec);
        this.run.markTrigger('intubation_successful', event.tSec);
        this.checkAssessments('Intubate');
        if (this.scoring != null) {
          ({ delta, cls, feedback } = this.scoring.evaluate('intubate', event.tSec));
          if (delta !== 0) {
            this.currentScore += delta;
            if (this.onScoreChanged) this.onScoreChanged(this.currentScore, this.maxPossibleScore);
          }
        }
        this.processTriggeredEvents('intubate');
        this.processTriggeredEvents('intubation_successful');
      }

      this.actionLog.record(
        event.tSec,
        event.type,
        event.type,
        this.patient,
        cls,
        delta,
        feedback,
        null,
        0,
        event.meta,
      );
      this.logEvent(`${event.type} at ${this.formatTime(event.tSec)}`);
    }
  }

  recordDrugAction(drugName, doseMg) {
    if (this.drugSystem != null && doseMg > 0) this.drugSystem.administerBolus(drugName, doseMg);
    this.recordStudentAction(`Give${drugName}`);
    if (this.actionLog.entries.length > 0) this.actionLog.entries[this.actionLog.entries.length - 1].doseMg = doseMg;
  }

  processTriggeredEvents(canonicalKey) {
    if (this.activeScenario == null || !canonicalKey) return;
    for (let i = 0; i < this.activeScenario.events.length; i++) {
      if (this._firedEvents.has(i)) continue;
      const evt = this.activeScenario.events[i];
      if (!evt.trigger || evt.trigger !== canonicalKey) continue;
      this._firedEvents.add(i);
      this.processEvent(evt, i);
    }
  }

  applyActionPhysiology(action) {
    if (this.tryAdministerDrug(action)) return;

    switch (action) {
      case 'PreOxygenate':
      case 'SetFiO2_100':
      case 'FiO2_100':
      case 'IncreaseFiO2':
      case 'GiveOxygen':
      case 'SupplementalO2':
        if (this.ventilator != null) { this.ventilator.o2FlowLPerMin = 10; this.ventilator.airFlowLPerMin = 0; this.ventilator.setFiO2 = 1; }
        break;
      case 'CPAP':
      case 'PositivePresure':
        this._cpapUntil = f(this.elapsedTime + 30);
        if (this.ventilator != null) { this.ventilator.o2FlowLPerMin = 10; this.ventilator.setFiO2 = 1; }
        break;
      case 'JawThrust':
      case 'AirwayManeuver':
        this._jawThrustUntil = f(this.elapsedTime + 30);
        break;
      case 'Intubate':
      case 'PlaceETT':
        if (this.patient != null) {
          this.patient.transitionAirwayDevice(AirwayDevice.Intubated);
          this.patient.airwayPatency = 1;
        }
        if (this.ventilator != null) this.ventilator.setMode(VentMode.VCV);
        break;
      case 'StopVolatile':
      case 'StopSevoflurane':
      case 'TurnOffAgent':
        if (this.ventilator != null) this.ventilator.vaporizerDial = 0;
        break;
      case 'ReduceVolatile':
      case 'DecreaseAgent':
      case 'DecreaseSevoflurane':
        if (this.ventilator != null) this.ventilator.vaporizerDial = Max(0, sub(this.ventilator.vaporizerDial, 1));
        break;
      case 'DeependAnesthesia':
      case 'IncreaseSevoflurane':
      case 'IncreaseAgent':
        if (this.ventilator != null) this.ventilator.vaporizerDial = f(this.ventilator.vaporizerDial + 1.5);
        break;
      case 'Hyperventilate':
      case 'IncreaseVentilation':
      case 'IncreaseMV':
        if (this.ventilator != null) this.ventilator.setRespiratoryRate = Min(30, this.ventilator.setRespiratoryRate + 10);
        break;
      case 'ActiveCooling':
      case 'IcePacks':
      case 'CoolPatient':
        this._coolingUntil = f(this.elapsedTime + 60);
        break;
      case 'StopAntibiotic':
      case 'StopInfusion':
      case 'StopCausativeAgent':
      case 'StopAllergen':
        this._allergenStopped = true;
        break;
      case 'GiveFluid':
      case 'FluidBolus':
      case 'Crystalloid':
        if (this.patient != null) this.patient.bloodVolumeFraction = Min(1.1, add(this.patient.bloodVolumeFraction, 0.15));
        break;
      case 'GiveBlood':
      case 'Transfuse':
      case 'BloodProducts':
        if (this.patient != null) this.patient.bloodVolumeFraction = Min(1.1, add(this.patient.bloodVolumeFraction, 0.20));
        break;
      case 'SourceControl':
      case 'ControlBleeding':
      case 'ControlHemorrhage':
      case 'Hemostasis':
        this._bleedingControlled = true;
        break;
      case 'GiveLipid':
      case 'LipidEmulsion':
      case 'Intralipid':
      case 'LipidRescue':
        if (this.lidocaineSystem != null) this.lidocaineSystem.giveLipidBolus();
        break;
      case 'GiveEpinephrineACLS':
      case 'EpinephrineFullDose':
      case 'HighDoseEpi':
        if (this.drugSystem != null) this.drugSystem.administerBolus('Epinephrine', 1.0);
        break;
      default: break;
    }
  }

  tryAdministerDrug(action) {
    if (this.drugSystem == null) return false;
    const a = action.startsWith('Give') ? action.substring(4) : action;
    switch (a) {
      case 'Propofol': this.drugSystem.administerWeightBasedBolus('Propofol', 2); return true;
      case 'Fentanyl': this.drugSystem.administerWeightBasedBolus('Fentanyl', f(0.002)); return true;
      case 'Rocuronium': this.drugSystem.administerWeightBasedBolus('Rocuronium', f(0.6)); return true;
      case 'Succinylcholine': this.drugSystem.administerWeightBasedBolus('Succinylcholine', 1.0); return true;
      case 'Midazolam': this.drugSystem.administerWeightBasedBolus('Midazolam', f(0.03)); return true;
      case 'Ephedrine': this.drugSystem.administerBolus('Ephedrine', 10); return true;
      case 'Phenylephrine': this.drugSystem.administerBolus('Phenylephrine', f(0.1)); return true;
      case 'Glycopyrrolate': this.drugSystem.administerBolus('Glycopyrrolate', f(0.2)); return true;
      case 'Epinephrine':
      case 'Adrenaline': this.drugSystem.administerBolus('Epinephrine', f(0.05)); return true;
      case 'Dantrolene': this.drugSystem.administerWeightBasedBolus('Dantrolene', 2.5); return true;
      case 'Naloxone':
      case 'Narcan':
      case 'NaloxoneTitrated': this.drugSystem.administerBolus('Naloxone', f(0.04)); return true;
      case 'NaloxoneFull':
      case 'NaloxoneSlam': this.drugSystem.administerBolus('Naloxone', f(0.4)); return true;
      case 'Atropine': this.drugSystem.administerBolus('Atropine', this.atropineDose()); return true;
      case 'Albuterol':
      case 'Bronchodilator':
      case 'MDI': this.drugSystem.administerBolus('Albuterol', 1); return true;
      default: return false;
    }
  }

  atropineDose() {
    if (this.patient == null) return 0.5;
    if (this.patient.ageYears < 12) return Clamp(f(0.02) * this.patient.weightKg, 0.1, 0.5);
    return Max(0.1, 0.5);
  }

  // ── tick ─────────────────────────────────────────────────────────────
  tick(dt) {
    if (dt <= 0) return;
    if (this.feedbackTimer > 0) {
      this.feedbackTimer = f(this.feedbackTimer - dt);
      if (this.feedbackTimer <= 0) this.feedbackMessage = '';
    }
    if (this.state !== ScenarioState.Running || this.activeScenario == null) return;

    this.elapsedTime = f(this.elapsedTime + dt * this.scenarioSpeed);
    this.processAirwayProcedureEvents();

    for (let i = 0; i < this.activeScenario.events.length; i++) {
      if (this._firedEvents.has(i)) continue;
      const evt = this.activeScenario.events[i];
      if (this.elapsedTime >= evt.triggerTimeSeconds) {
        this._firedEvents.add(i);
        this.processEvent(evt, i);
      }
    }

    this.advanceTransitions(dt);
    this.advanceDeadlines(dt);
    this.advanceComplications(dt);

    if (this.scoring != null) {
      const condDelta = this.scoring.tickConditions(this.patient, this.elapsedTime, dt);
      if (condDelta !== 0) {
        this.currentScore += condDelta;
        if (this.onScoreChanged) this.onScoreChanged(this.currentScore, this.maxPossibleScore);
      }
    }

    if (this.activeScenario.maxDurationSeconds > 0 && this.elapsedTime >= this.activeScenario.maxDurationSeconds) {
      this.completeScenario();
    }
  }

  processEvent(evt, index) {
    switch (evt.type) {
      case ScenarioEventType.VitalChange:
        if (evt.changes != null && evt.changes.length > 0 && this.patient != null) {
          for (const ch of evt.changes) {
            switch ((ch.vital || '').toLowerCase()) {
              case 'hr': evt.targetHR = f(this.patient.heartRate + ch.delta); break;
              case 'sbp': evt.targetSystolic = f(this.patient.systolicBP + ch.delta); break;
              case 'dbp': evt.targetDiastolic = f(this.patient.diastolicBP + ch.delta); break;
              case 'spo2': evt.targetSpO2 = Clamp(this.patient.spO2 + ch.delta, 1, 100); break;
              case 'etco2': evt.targetEtCO2 = Max(0, this.patient.etCO2 + ch.delta); break;
              case 'rr': evt.targetRR = Max(0, this.patient.respiratoryRate + ch.delta); break;
              case 'tempc': evt.targetTemp = f(this.patient.temperature + ch.delta); break;
              default: break;
            }
          }
          if (!(evt.transitionSeconds > 0)) evt.transitionSeconds = Max(1, evt.durationSec);
          if (this.run) this.run.noteInsult(this.elapsedTime);
        }
        this.applyVitalChange(evt);
        break;
      case ScenarioEventType.Complication:
        this.applyComplication(evt);
        if (this.run) this.run.noteInsult(this.elapsedTime);
        break;
      case ScenarioEventType.Prompt:
        this.showPrompt(evt.promptText);
        break;
      case ScenarioEventType.Assessment:
        if (!this.tryCompleteFromHistory(index, evt) && evt.deadlineSeconds > 0) {
          this._deadlines.push({ index, evt, remaining: evt.deadlineSeconds });
        }
        break;
      case ScenarioEventType.DrugEffect:
        this.applyDrugEffect(evt);
        break;
      case ScenarioEventType.VentilatorChange:
        this.applyVentilatorChange(evt);
        break;
      default: break;
    }
    this.logEvent(`[${this.formatTime(this.elapsedTime)}] ${evt.type}: ${evt.description}`);
  }

  applyVitalChange(evt) {
    if (this.patient == null) return;
    this._transitions.push({
      evt,
      elapsed: 0,
      startHR: this.patient.baselineHR,
      startSys: this.patient.baselineSystolic,
      startDia: this.patient.baselineDiastolic,
      startSpO2: this.patient.baselineSpO2,
      startRR: this.patient.baselineRR,
      startTemp: this.patient.baselineTemp,
      startEtCO2: this.patient.baselineEtCO2,
    });
  }

  advanceTransitions(dt) {
    for (let i = this._transitions.length - 1; i >= 0; i--) {
      const tr = this._transitions[i];
      const evt = tr.evt;
      const duration = Max(evt.transitionSeconds, 1);
      tr.elapsed = f(tr.elapsed + dt);
      const t = Clamp01(tr.elapsed / duration);
      const s = f(t * t * (3 - 2 * t));

      if (evt.targetHR > 0) this.patient.baselineHR = Lerp(tr.startHR, evt.targetHR, s);
      if (evt.targetSystolic > 0) this.patient.baselineSystolic = Lerp(tr.startSys, evt.targetSystolic, s);
      if (evt.targetDiastolic > 0) this.patient.baselineDiastolic = Lerp(tr.startDia, evt.targetDiastolic, s);
      if (evt.targetSpO2 > 0) this.patient.baselineSpO2 = Lerp(tr.startSpO2, evt.targetSpO2, s);
      if (evt.targetRR > 0) this.patient.baselineRR = Lerp(tr.startRR, evt.targetRR, s);
      if (evt.targetTemp > 0) this.patient.baselineTemp = Lerp(tr.startTemp, evt.targetTemp, s);
      if (evt.targetEtCO2 > 0) this.patient.baselineEtCO2 = Lerp(tr.startEtCO2, evt.targetEtCO2, s);

      if (t >= 1) this._transitions.splice(i, 1);
    }
  }

  applyComplication(evt) {
    if (this.patient == null) return;
    switch (evt.complicationType) {
      case 'Bronchospasm':
        this._bronchoActive = true; this._bronchoSeverity = 1;
        this.showPrompt('COMPLICATION: Rising peak airway pressure, wheeze, SpO2 falling.');
        break;
      case 'HighSpinal':
      case 'Sympathectomy':
        this._sympActive = true; this._sympSeverity = 1;
        break;
      case 'Anaphylaxis':
        this._anaphylaxisActive = true; this._anaphylaxisSeverity = 1;
        this.showPrompt('COMPLICATION: Cardiovascular collapse, tachycardia, bronchospasm, rash.');
        break;
      case 'MalignantHyperthermia':
        this._mhActive = true; this._mhSeverity = 1;
        this.showPrompt('COMPLICATION: EtCO2 rising despite ventilation, tachycardia, rigidity.');
        break;
      case 'OpioidRespDepression':
      case 'OpioidInducedRespiratoryDepression':
        this._opioidActive = true; this._opioidSeverity = 1;
        this.showPrompt('COMPLICATION: Increasing sedation and hypopnea, SpO2 falling, CO2 rising.');
        break;
      case 'Hemorrhage':
        this._hemorrhageActive = true; this._bleedingControlled = false; this._lastHemorrhageClass = -1;
        this.showPrompt('COMPLICATION: Ongoing surgical hemorrhage. Estimated blood loss rising.');
        break;
      case 'Laryngospasm':
        this._spasm = SpasmStage.Complete;
        this.patient.airwayPatency = 0.05;
        this.showPrompt('COMPLICATION: Complete airway obstruction, stridor then silent chest. SpO2 falling.');
        break;
      case 'LocalAnestheticToxicity':
        if (this.lidocaineSystem != null) {
          this.lidocaineSystem.injectToxicExposure({ targetPlasmaMcgMl: 10 });
          this.logEvent('last_exposure_injected');
        }
        this.showPrompt('COMPLICATION: Perioral numbness, tinnitus, metallic taste, agitation — rising local anesthetic level.');
        break;
      case 'TensionPneumothorax':
        this.patient.shuntFraction = 0.4;
        this.patient.svrFactor = 0.55;
        this.patient.airwayResistanceFactor = 3;
        this.patient.hrComplicationOffset = 35;
        this.showPrompt('COMPLICATION: Desaturation, hypotension, high airway pressures, absent breath sounds left.');
        break;
      case 'VentricularFibrillation':
        this.patient.explicitVentricularFibrillation = true;
        this.patient.hrComplicationOffset = -this.patient.baselineHR;
        this.patient.svrFactor = 0;
        this.patient.shuntFraction = 0.9;
        this.showPrompt('CARDIAC ARREST: Ventricular fibrillation, no pulse.');
        break;
      default:
        this.showPrompt(`COMPLICATION: ${evt.description}`);
        break;
    }
  }

  advanceComplications(dt) {
    this.advanceSympathectomy(dt);
    this.advanceMH(dt);
    this.advanceAnaphylaxis(dt);
    this.advanceBronchospasm(dt);
    this.advanceOpioid(dt);
    this.advanceLaryngospasm(dt);
    this.advanceHemorrhage(dt);
    this.observeLidocaineToxicity();
  }

  advanceSympathectomy(dt) {
    if (!this._sympActive || this.patient == null) return;
    const p = this.patient;
    const pressor = f(p.phenylephrineCe + p.ephedrineCe + p.epinephrineCe);
    const recoveryPerSec = pressor > f(0.35) ? f(0.012) : f(0.0015);
    this._sympSeverity = Max(0, this._sympSeverity - recoveryPerSec * dt);
    p.svrFactor = Lerp(1, 0.52, this._sympSeverity);
    p.hrComplicationOffset = f(-26 * this._sympSeverity);
    if (this._sympSeverity > 0.7) p.respiratoryDriveFactor = Min(p.respiratoryDriveFactor, 0.6);
    if (this._sympSeverity <= 0.02) {
      this._sympActive = false;
      p.svrFactor = 1; p.hrComplicationOffset = 0; p.respiratoryDriveFactor = 1;
      this.logEvent('High spinal resolving — hemodynamics recovering');
    }
  }

  advanceMH(dt) {
    if (!this._mhActive) return;
    const p = this.patient;
    const triggerOff = this.ventilator == null || this.ventilator.vaporizerDial <= 0.01;
    const dantrolene = Clamp01(p.dantroleneCe / f(0.8));
    const resolve = f(dantrolene * (triggerOff ? 1 : 0.5));
    if (resolve > f(0.01)) this._mhSeverity = Max(0, this._mhSeverity - resolve * f(0.025) * dt);
    else this._mhSeverity = Min(1, this._mhSeverity + f(0.003) * dt);

    p.vco2MlMin = f(this._restingVco2 * (1 + 2.5 * this._mhSeverity));
    p.airwayResistanceFactor = f(1 + f(0.4) * this._mhSeverity);
    p.hrComplicationOffset = f(30 * this._mhSeverity);

    const cooling = this.elapsedTime <= this._coolingUntil;
    p.heatLoadC = Clamp(p.heatLoadC + (this._mhSeverity * f(0.02) - (cooling ? f(0.05) : 0)) * dt, 0, 4);

    if (this._mhSeverity > 0.5) this._mhFailTimer = f(this._mhFailTimer + dt);
    else this._mhFailTimer = Max(0, this._mhFailTimer - dt);
    if (this._mhFailTimer > 1800) { this.arrest(); this.logEvent('MH FAILURE'); }
    if (this._mhSeverity < 0.1) { this._mhActive = false; this.logEvent('MH resolved'); this.setFeedback('MH controlled', true); }
  }

  advanceAnaphylaxis(dt) {
    if (!this._anaphylaxisActive) return;
    const p = this.patient;
    const epi = Clamp01(p.epinephrineCe / 0.6);
    const resolve = f(epi * 0.025 + (this._allergenStopped ? 0.003 : 0));
    if (resolve > 0.001) this._anaphylaxisSeverity = Max(0, this._anaphylaxisSeverity - resolve * dt);
    else this._anaphylaxisSeverity = Min(1, this._anaphylaxisSeverity + 0.002 * dt);

    p.svrFactor = Lerp(1, 0.45, this._anaphylaxisSeverity);
    p.shuntFraction = f(0.5 * this._anaphylaxisSeverity);
    p.airwayResistanceFactor = f(1 + 1.5 * this._anaphylaxisSeverity);
    p.hrComplicationOffset = f(40 * this._anaphylaxisSeverity);
    if (this._anaphylaxisSeverity > 0.3) {
      p.bloodVolumeFraction = Max(0.6, p.bloodVolumeFraction - 0.0015 * this._anaphylaxisSeverity * dt);
    }
    if (p.meanArterialPressure < 45 && this._anaphylaxisSeverity > 0.4) this._anaphylaxisFailTimer = f(this._anaphylaxisFailTimer + dt);
    else this._anaphylaxisFailTimer = Max(0, this._anaphylaxisFailTimer - dt);
    if (this._anaphylaxisFailTimer > 120) { this.arrest(); this.logEvent('ANAPHYLAXIS FAILURE'); }
    if (this._anaphylaxisSeverity < 0.1) { this._anaphylaxisActive = false; this.logEvent('Anaphylaxis resolved'); this.setFeedback('Anaphylaxis controlled.', true); }
  }

  advanceBronchospasm(dt) {
    if (!this._bronchoActive) return;
    const p = this.patient;
    const albuterol = Clamp01(p.albuterolCe / 0.6);
    const deepened = this.ventilator != null && this.ventilator.vaporizerDial >= 2.5;
    const epi = Clamp01(p.epinephrineCe / 0.6);
    const resolve = f(albuterol * 0.02 + (deepened ? 0.01 : 0) + epi * 0.02);
    if (resolve > 0.001) this._bronchoSeverity = Max(0, this._bronchoSeverity - resolve * dt);
    else this._bronchoSeverity = Min(1, this._bronchoSeverity + 0.002 * dt);

    p.airwayResistanceFactor = f(1 + 3 * this._bronchoSeverity);
    p.shuntFraction = f(0.4 * this._bronchoSeverity);
    p.hrComplicationOffset = f(25 * this._bronchoSeverity);

    if (p.spO2 < 85 && this._bronchoSeverity > 0.4) this._bronchoFailTimer = f(this._bronchoFailTimer + dt);
    else this._bronchoFailTimer = Max(0, this._bronchoFailTimer - dt);
    if (this._bronchoFailTimer > 120) { this.arrest(); this.logEvent('BRONCHOSPASM FAILURE'); }
    if (this._bronchoSeverity < 0.1) { this._bronchoActive = false; this.logEvent('Bronchospasm resolved'); this.setFeedback('Bronchospasm controlled.', true); }
  }

  advanceOpioid(dt) {
    const p = this.patient;
    if (this._naloxoneSurge > 0) {
      this._naloxoneSurge = Max(0, this._naloxoneSurge - 0.01 * dt);
      p.hrComplicationOffset = Max(p.hrComplicationOffset, 45 * this._naloxoneSurge);
      p.svrFactor = Max(p.svrFactor, 1 + 0.4 * this._naloxoneSurge);
      p.shuntFraction = Max(p.shuntFraction, 0.35 * this._naloxoneSurge);
      if (this._naloxoneSurge <= 0.01) this._naloxoneSurgeActive = false;
    }
    if (!this._opioidActive) return;

    if (!this._naloxoneSurgeActive && p.naloxoneCe > 2) {
      this._naloxoneSurgeActive = true; this._naloxoneSurge = 1;
      this.logEvent('Naloxone SLAM'); this.setFeedback('Full naloxone reversal triggered a sympathetic surge / pulmonary edema.', false);
    }

    const reversal = Clamp01(p.naloxoneCe / 0.8);
    const effective = f(this._opioidSeverity * (1 - reversal));
    p.respiratoryDriveFactor = Lerp(1, 0.2, effective);

    this._opioidSeverity = Max(0, this._opioidSeverity - 0.00003 * dt);

    if (p.spO2 < 80) this._opioidFailTimer = f(this._opioidFailTimer + dt);
    else this._opioidFailTimer = Max(0, this._opioidFailTimer - dt);
    if (this._opioidFailTimer > 60) p.hrComplicationOffset = MoveTowards(p.hrComplicationOffset, -p.baselineHR, 6 * dt);
    if (this._opioidSeverity < 0.05 && !this._naloxoneSurgeActive) { this._opioidActive = false; this.logEvent('Opioid depression resolved.'); }
  }

  advanceLaryngospasm(dt) {
    if (this._spasm === SpasmStage.None || this._spasm === SpasmStage.Resolved) return;
    const p = this.patient;
    const cpap = this.elapsedTime <= this._cpapUntil;
    const jaw = this.elapsedTime <= this._jawThrustUntil;
    const deepPropofol = p.propofolCe > 1.5;
    const suxGiven = p.succinylcholineCe > 0.1;

    if (suxGiven || deepPropofol) { this.resolveLaryngospasm(suxGiven ? 'succinylcholine' : 'propofol deepening'); return; }
    if (this._spasm === SpasmStage.Complete && cpap && jaw) {
      this._spasm = SpasmStage.Partial;
      p.airwayPatency = 0.35;
      this.logEvent('Laryngospasm easing to partial (CPAP + jaw thrust).');
    } else if (this._spasm === SpasmStage.Partial && cpap && jaw) {
      this.resolveLaryngospasm('CPAP + jaw thrust');
      return;
    }

    if (p.spO2 < 85) {
      p.baselineHR = MoveTowards(p.baselineHR, 40, 8 * dt);
      if (p.spO2 < 50) p.baselineHR = MoveTowards(p.baselineHR, 0, 6 * dt);
    }
  }

  resolveLaryngospasm(how) {
    this._spasm = SpasmStage.Resolved;
    this.patient.airwayPatency = 1;
    if (this.activeScenario != null && this.activeScenario.patientProfile != null && this.activeScenario.patientProfile.baselineHR > 0) {
      this.patient.baselineHR = this.activeScenario.patientProfile.baselineHR;
    }
    this.logEvent(`Laryngospasm BROKEN (${how})`);
    this.setFeedback('Laryngospasm resolved — ventilation restored.', true);
  }

  advanceHemorrhage(dt) {
    if (!this._hemorrhageActive) return;
    const p = this.patient;
    if (!this._bleedingControlled) p.bloodVolumeFraction = Max(0, p.bloodVolumeFraction - 0.0012 * dt);
    const lossFrac = Clamp01(1 - p.bloodVolumeFraction);
    const cls = lossFrac < 0.15 ? 1 : lossFrac < 0.30 ? 2 : lossFrac < 0.40 ? 3 : 4;
    if (cls !== this._lastHemorrhageClass) { this._lastHemorrhageClass = cls; this.logEvent(`Hemorrhage ATLS Class ${cls}`); }
    p.hrComplicationOffset = Min(lossFrac * 150, 75);
    p.svrFactor = f(1 + 0.8 * Min(lossFrac, 0.30) - 3.0 * Max(0, lossFrac - 0.30));
    if (p.bloodVolumeFraction < 0.5) this._hemorrhageFailTimer = f(this._hemorrhageFailTimer + dt);
    else this._hemorrhageFailTimer = Max(0, this._hemorrhageFailTimer - dt);
    if (p.bloodVolumeFraction < 0.4 || this._hemorrhageFailTimer > 90) { this.arrest(); this.logEvent('HEMORRHAGE FAILURE'); }
    if (this._bleedingControlled && p.bloodVolumeFraction > 0.9) {
      this._hemorrhageActive = false; p.svrFactor = 1; p.hrComplicationOffset = 0;
      this.logEvent('Hemorrhage resolved'); this.setFeedback('Hemorrhage controlled — pressure and perfusion restored.', true);
    }
  }

  observeLidocaineToxicity() {
    if (this.lidocaineSystem == null) return;
    const history = this.lidocaineSystem.toxicityHistory;
    while (this._lidocaineToxicityCursor < history.length) {
      const transition = history[this._lidocaineToxicityCursor++];
      this.logEvent(`lidocaine_toxicity_${transition.stage}`);
      if (transition.stage === 'cardiac') {
        this.showPrompt('LAST: Cardiovascular toxicity is developing — initiate lipid rescue.');
      } else if (transition.stage === 'cns') {
        this.showPrompt('LAST: CNS toxicity is developing — stop injection and prepare lipid rescue.');
      } else if (transition.stage === 'none') {
        this.setFeedback('LAST exposure returned below the modeled toxicity threshold.', true);
      }
    }
  }

  arrest() {
    this.patient.hrComplicationOffset = -this.patient.baselineHR;
    this.patient.svrFactor = 0;
  }

  applyDrugEffect(evt) {
    if (this.drugSystem == null) return;
    this.drugSystem.administerBolus(evt.drugName, evt.drugDoseMg);
    this.logEvent(`Scenario administered ${evt.drugName} ${evt.drugDoseMg}mg`);
  }

  applyVentilatorChange(evt) {
    if (this.ventilator == null || this.patient == null) return;
    if (evt.ventMode >= 0) this.ventilator.mode = evt.ventMode;
    if (evt.targetRR > 0) this.ventilator.setRespiratoryRate = evt.targetRR;
    if (evt.targetTidalVolume > 0) this.ventilator.setTidalVolume = evt.targetTidalVolume;
  }

  showPrompt(text) {
    this.activePrompts.push(text);
    this.logEvent(`Prompt: ${text}`);
  }

  // ── assessments (legacy) ─────────────────────────────────────────────
  checkAssessments(actionName) {
    if (this.activeScenario == null) return;
    for (let i = 0; i < this.activeScenario.events.length; i++) {
      if (this._completedChecks.has(i)) continue;
      const evt = this.activeScenario.events[i];
      if (evt.type !== ScenarioEventType.Assessment) continue;
      if (!this._firedEvents.has(i)) continue;
      if (this.matchesExpectedAction(actionName, evt.expectedAction)) this.awardAssessment(i, evt);
    }
  }

  awardAssessment(index, evt) {
    if (this._completedChecks.has(index)) return;
    this._completedChecks.add(index);
    this.currentScore += evt.points;
    this.setFeedback(`Correct: ${evt.feedbackCorrect}`, true);
    if (this.onScoreChanged) this.onScoreChanged(this.currentScore, this.maxPossibleScore);
    this.logEvent(`Assessment PASSED: ${evt.description} (+${evt.points} pts)`);
  }

  tryCompleteFromHistory(index, evt) {
    if (this._completedChecks.has(index)) return true;
    for (const [key] of this._studentActions) {
      if (this.matchesExpectedAction(key, evt.expectedAction)) { this.awardAssessment(index, evt); return true; }
    }
    return false;
  }

  advanceDeadlines(dt) {
    for (let i = this._deadlines.length - 1; i >= 0; i--) {
      const d = this._deadlines[i];
      if (this._completedChecks.has(d.index)) { this._deadlines.splice(i, 1); continue; }
      d.remaining = sub(d.remaining, dt);
      if (d.remaining <= 0) {
        this._completedChecks.add(d.index);
        this.setFeedback(`Missed: ${d.evt.feedbackIncorrect}`, false);
        this.logEvent(`Assessment MISSED: ${d.evt.description}`);
        this._deadlines.splice(i, 1);
      }
    }
  }

  matchesExpectedAction(action, expected) {
    if (!expected) return false;
    const acceptable = expected.split(',');
    for (const a of acceptable) if (action.trim().toLowerCase() === a.trim().toLowerCase()) return true;
    return false;
  }

  isAssessmentSatisfiable(expected) {
    if (!expected) return true;
    for (const raw of expected.split(',')) {
      const tok = raw.trim();
      if (tok.length > 0 && this.tokenSatisfiable(tok)) return true;
    }
    return false;
  }

  tokenSatisfiable(tok) {
    if (WIRED_DRUG_TOKENS.has(tok.toLowerCase())) return true;
    if (tok.toLowerCase().startsWith('give')) {
      if (NON_DRUG_GIVE_ACTIONS.has(tok.toLowerCase())) return true;
      return WIRED_DRUG_TOKENS.has(tok.substring(4).toLowerCase());
    }
    return true;
  }

  setFeedback(msg, correct) {
    this.feedbackMessage = msg;
    this.feedbackTimer = 5;
  }

  endCase() {
    if (this.state === ScenarioState.Running || this.state === ScenarioState.Paused) this.completeScenario();
  }

  completeScenario() {
    this.setState(ScenarioState.Completed);
    this.logEvent(`Scenario completed. Score: ${this.currentScore}/${this.maxPossibleScore}`);
    if (this.run != null) {
      this.run.completed = true;
      this.run.completedAtSec = this.elapsedTime;
      this.lastResult = buildDebrief(this.activeScenario, this.run, this.scoring, this.actionLog,
        this.currentScore, this.maxPossibleScore, this.elapsedTime);
      if (this.patient != null) this.lastResult.respiratoryAttribution = this.patient.respiratoryAttribution;
      if (this.onDebriefReady) this.onDebriefReady(this.lastResult);
    }
  }

  applyStartingSetup() {
    const su = this.activeScenario ? this.activeScenario.startingSetup : null;
    if (su == null) return;
    if (this.ventilator != null) {
      if (su.oxygenOn) this.ventilator.o2FlowLPerMin = Max(2, this.ventilator.o2FlowLPerMin);
      if (su.fio2 > 0) this.ventilator.setFiO2 = Clamp01(su.fio2);
      if (su.tidalVolume > 0) this.ventilator.setTidalVolume = su.tidalVolume;
      if (su.respiratoryRate > 0) this.ventilator.setRespiratoryRate = su.respiratoryRate;
      if (su.peep > 0) this.ventilator.setPeep = su.peep;
      this.ventilator.vaporizerDial = Max(0, su.vaporizerDial);
      switch ((su.ventMode || 'manual').toLowerCase()) {
        case 'vcv': this.ventilator.setMode(VentMode.VCV); break;
        case 'pcv': this.ventilator.setMode(VentMode.PCV); break;
        case 'psv': this.ventilator.setMode(VentMode.PSV); break;
        default: this.ventilator.setMode(VentMode.Manual); break;
      }
    }
    if (this.patient != null && (su.airway || '').toLowerCase() === 'ett') {
      this.patient.transitionAirwayDevice(AirwayDevice.Intubated);
      this.patient.airwayPatency = 1;
      if (this.run) this.run.markTrigger('intubation_successful', 0);
    }
  }

  applyAirwayPlan() {
    const plan = this.activeScenario?.airwayPlan;
    if (plan == null || this.airwayProcedure == null) return;
    this.airwayProcedure.configureIntubation({
      failedIntubationAttempts: plan.failedIntubationAttempts,
      attemptDurationSeconds: plan.intubationAttemptDurationSeconds,
    });
  }

  applyPatientProfile() {
    if (this.patient == null || this.activeScenario == null) return;
    const profile = this.activeScenario.patientProfile;
    this.patient.weightKg = profile.weightKg > 0 ? profile.weightKg : 70;
    this.patient.heightCm = profile.heightCm > 0 ? profile.heightCm : 170;
    this.patient.ageYears = profile.ageYears > 0 ? profile.ageYears : 45;
    this.patient.sex = profile.sex === 'Female' ? 'Female' : 'Male';
    if (profile.baselineHR > 0) this.patient.baselineHR = f(profile.baselineHR);
    if (profile.baselineSystolic > 0) this.patient.baselineSystolic = f(profile.baselineSystolic);
    if (profile.baselineDiastolic > 0) this.patient.baselineDiastolic = f(profile.baselineDiastolic);
    if (profile.baselineSpO2 > 0) this.patient.baselineSpO2 = f(profile.baselineSpO2);
    if (profile.baselineRR > 0) this.patient.baselineRR = f(profile.baselineRR);
    if (profile.baselineTemp > 0) this.patient.baselineTemp = f(profile.baselineTemp);
    this.patient.resetToBaseline();
  }

  setState(newState) { this.state = newState; }

  logEvent(msg) { this.eventLog.push(`[${this.formatTime(this.elapsedTime)}] ${msg}`); }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const p2 = (n) => String(n).padStart(2, '0');
    return `${p2(mins)}:${p2(secs)}`;
  }
}

const WIRED_DRUG_TOKENS = new Set([
  'propofol', 'fentanyl', 'rocuronium', 'succinylcholine', 'midazolam',
  'ephedrine', 'phenylephrine', 'glycopyrrolate',
  'epinephrine', 'adrenaline', 'dantrolene', 'naloxone', 'narcan',
  'naloxonetitrated', 'naloxonefull', 'naloxoneslam', 'atropine', 'albuterol', 'bronchodilator', 'mdi',
]);
const NON_DRUG_GIVE_ACTIONS = new Set([
  'givefluid', 'giveoxygen', 'giveparalytic', 'giveblood', 'bloodproducts', 'transfuse',
  'givelipid', 'lipidemulsion', 'intralipid', 'lipidrescue', 'giveepinephrineacls', 'epinephrinefulldose',
]);
