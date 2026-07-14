/* Faithful port of OperatingRoom.Simulation.ActionLogger + ActionLogEntry. */

export class ActionLogger {
  constructor() { this.entries = []; }

  record(tSec, action, canonical, p, cls, pointsDelta, feedback, drug = null, doseMg = 0, meta = null) {
    const e = {
      tSec,
      action,
      canonical,
      drug: drug || '',
      doseMg,
      classification: cls.toLowerCase(),
      pointsDelta,
      feedback: feedback || '',
      hr: p ? p.heartRate : 0,
      sbp: p ? p.systolicBP : 0,
      dbp: p ? p.diastolicBP : 0,
      map: p ? p.meanArterialPressure : 0,
      spo2: p ? p.spO2 : 0,
      etco2: p ? p.etCO2 : 0,
      rr: p ? p.respiratoryRate : 0,
      tempC: p ? p.temperature : 0,
      bis: p ? p.bisIndex : 0,
    };
    if (meta != null) e.meta = { ...meta };
    this.entries.push(e);
    return e;
  }

  clear() { this.entries = []; }
}
