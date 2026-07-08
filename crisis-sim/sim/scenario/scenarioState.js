/* Faithful port of OperatingRoom.Simulation.ScenarioRunState + ActionClass. */
import { Max } from '../float32.js';

export const ActionClass = { Expected: 'Expected', Neutral: 'Neutral', Dangerous: 'Dangerous' };

export class ScenarioRunState {
  constructor() {
    this.scenarioId = '';
    this.startedAtSim = 0;
    this.firedTriggers = new Map();   // canonical key → sim-time
    this.expectedDone = new Map();    // index → completion time
    this.expectedLate = new Map();    // index → bool
    this.dangerousFired = new Set();  // indices

    this.insultOnsetSec = -1;
    this.firstRecognitionSec = -1;
    this.firstTreatmentSec = -1;

    this.hypotensionSince = -1;
    this.hypoxiaSince = -1;
    this.highEtco2Since = -1;
    this.intubatedAtSec = -1;
    this.etco2Confirmed = false;

    this.completed = false;
    this.completedAtSec = 0;
  }

  markTrigger(key, tSec) {
    if (!key) return;
    if (!this.firedTriggers.has(key)) this.firedTriggers.set(key, tSec);
  }

  hasTrigger(key) { return !!key && this.firedTriggers.has(key); }

  noteInsult(tSec) {
    if (this.insultOnsetSec < 0) this.insultOnsetSec = tSec;
  }

  noteRecognition(tSec) {
    if (this.insultOnsetSec >= 0 && this.firstRecognitionSec < 0 && tSec >= this.insultOnsetSec) {
      this.firstRecognitionSec = tSec;
    }
  }

  noteTreatment(tSec) {
    if (this.firstTreatmentSec < 0) this.firstTreatmentSec = tSec;
    this.noteRecognition(tSec);
  }

  get timeToRecognition() {
    return (this.insultOnsetSec >= 0 && this.firstRecognitionSec >= 0)
      ? Max(0, this.firstRecognitionSec - this.insultOnsetSec) : -1;
  }

  get timeToTreatment() {
    return (this.insultOnsetSec >= 0 && this.firstTreatmentSec >= 0)
      ? Max(0, this.firstTreatmentSec - this.insultOnsetSec) : -1;
  }
}
