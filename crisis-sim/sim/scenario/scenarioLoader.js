/* Faithful port of OperatingRoom.Simulation.ScenarioLoader.Normalize + the
   JsonUtility default-filling that FromJson<ScenarioDefinition> performs. */

export const ScenarioEventType = {
  VitalChange: 0, Complication: 1, Prompt: 2, Assessment: 3, DrugEffect: 4, VentilatorChange: 5,
};

function copyAdditiveScenarioData(value) {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(copyAdditiveScenarioData);
  return Object.fromEntries(Object.entries(value).map(
    ([key, nested]) => [key, copyAdditiveScenarioData(nested)],
  ));
}

function toComplicationName(typeName) {
  switch (typeName.trim().toLowerCase()) {
    case 'hemorrhage': return 'Hemorrhage';
    case 'bronchospasm': return 'Bronchospasm';
    case 'anaphylaxis': return 'Anaphylaxis';
    case 'malignant_hyperthermia': return 'MalignantHyperthermia';
    case 'sympathectomy':
    case 'high_spinal': return 'HighSpinal';
    case 'laryngospasm': return 'Laryngospasm';
    default: return '';
  }
}

function fillEventDefaults(e) {
  e.triggerTimeSeconds = e.triggerTimeSeconds ?? 0;
  e.type = e.type ?? 0;
  e.description = e.description ?? '';
  e.typeName = e.typeName ?? '';
  e.trigger = e.trigger ?? '';
  e.message = e.message ?? '';
  e.changes = e.changes ?? [];
  e.durationSec = e.durationSec ?? 0;
  e.targetHR = e.targetHR ?? 0;
  e.targetSystolic = e.targetSystolic ?? 0;
  e.targetDiastolic = e.targetDiastolic ?? 0;
  e.targetSpO2 = e.targetSpO2 ?? 0;
  e.targetRR = e.targetRR ?? 0;
  e.targetTemp = e.targetTemp ?? 0;
  e.targetEtCO2 = e.targetEtCO2 ?? 0;
  e.transitionSeconds = e.transitionSeconds ?? 0;
  e.complicationType = e.complicationType ?? '';
  e.promptText = e.promptText ?? '';
  e.expectedAction = e.expectedAction ?? '';
  e.points = e.points ?? 0;
  e.deadlineSeconds = e.deadlineSeconds ?? 0;
  e.feedbackCorrect = e.feedbackCorrect ?? '';
  e.feedbackIncorrect = e.feedbackIncorrect ?? '';
  e.drugName = e.drugName ?? '';
  e.drugDoseMg = e.drugDoseMg ?? 0;
  e.ventMode = e.ventMode ?? 0;
  e.targetTidalVolume = e.targetTidalVolume ?? 0;
}

function fillExpectedDefaults(ea) {
  ea.action = ea.action ?? '';
  ea.acceptedDrugs = ea.acceptedDrugs ?? [];
  ea.acceptedInterventions = ea.acceptedInterventions ?? [];
  ea.timeLimitSec = ea.timeLimitSec ?? 0;
  ea.afterTrigger = ea.afterTrigger ?? '';
  ea.points = ea.points ?? 10;
  ea.feedback = ea.feedback ?? '';
}

function fillDangerousDefaults(da) {
  da.action = da.action ?? '';
  da.conditionSec = da.conditionSec ?? 90;
  da.penalty = da.penalty ?? -10;
  da.feedback = da.feedback ?? '';
  da.treatedBy = da.treatedBy ?? [];
}

/** Normalize a parsed scenario definition (mutates in place). */
export function normalize(def) {
  if (!def.id) def.id = 'scenario_x';
  if (!(def.maxDurationSeconds > 0)) def.maxDurationSeconds = 900;
  if (!def.events) def.events = [];
  def.courseUnit = def.courseUnit ?? '';
  def.tags = def.tags ?? [];
  def.learningObjectives = def.learningObjectives ?? [];
  def.expectedActions = def.expectedActions ?? [];
  def.dangerousActions = def.dangerousActions ?? [];
  def.debrief = def.debrief ?? null;
  def.rubricId = def.rubricId ?? '';
  def.rubricCriteria = copyAdditiveScenarioData(def.rubricCriteria ?? {});
  def.administrativeSetup = copyAdditiveScenarioData(def.administrativeSetup ?? null);
  def.seed = Number.isInteger(def.seed) ? def.seed : 12345;
  def.airwayPlan = def.airwayPlan ?? null;
  if (def.airwayPlan != null) {
    const failures = Array.isArray(def.airwayPlan.failedIntubationAttempts)
      ? def.airwayPlan.failedIntubationAttempts : [];
    def.airwayPlan.failedIntubationAttempts = [...new Set(failures
      .filter((attempt) => Number.isInteger(attempt) && attempt > 0))]
      .sort((left, right) => left - right);
    const duration = def.airwayPlan.intubationAttemptDurationSeconds;
    def.airwayPlan.intubationAttemptDurationSeconds = Number.isFinite(duration) && duration > 0
      ? duration : 30;
  }

  for (const evt of def.events) {
    fillEventDefaults(evt);
    if (evt.typeName) {
      switch (evt.typeName.trim().toLowerCase()) {
        case 'vital_change':
        case 'monitor_change': evt.type = ScenarioEventType.VitalChange; break;
        case 'learner_prompt':
        case 'prompt': evt.type = ScenarioEventType.Prompt; break;
        case 'assessment': evt.type = ScenarioEventType.Assessment; break;
        case 'ventilation_change': evt.type = ScenarioEventType.VentilatorChange; break;
        case 'drug_effect': evt.type = ScenarioEventType.DrugEffect; break;
        case 'complication':
        case 'airway_event':
        case 'hemorrhage':
        case 'bronchospasm':
        case 'anaphylaxis':
        case 'malignant_hyperthermia':
        case 'sympathectomy':
        case 'high_spinal':
        case 'laryngospasm':
        case 'arrhythmia': evt.type = ScenarioEventType.Complication; break;
        default: evt.type = ScenarioEventType.Prompt; break;
      }
      if (evt.type === ScenarioEventType.Complication && !evt.complicationType) {
        evt.complicationType = toComplicationName(evt.typeName);
      }
    }
    if (!evt.promptText && evt.message) evt.promptText = evt.message;
    if (evt.trigger && !(evt.triggerTimeSeconds > 0)) evt.triggerTimeSeconds = Infinity;
  }

  for (const ea of def.expectedActions) fillExpectedDefaults(ea);
  for (const da of def.dangerousActions) fillDangerousDefaults(da);
  return def;
}
