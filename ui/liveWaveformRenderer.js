const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));
const normalize = (value) => clamp(Number.isFinite(value) ? value : 0, -1, 1);

export function ecgMorphology(phase) {
  if (phase < 0.12) return Math.sin(phase / 0.12 * Math.PI) * 0.1;
  if (phase < 0.18) return -0.12 * Math.sin((phase - 0.12) / 0.06 * Math.PI);
  if (phase < 0.205) return (phase - 0.18) / 0.025 * 1.05;
  if (phase < 0.235) return 1.05 - (phase - 0.205) / 0.03 * 1.55;
  if (phase < 0.29) return -0.5 + (phase - 0.235) / 0.055 * 0.5;
  if (phase < 0.5) return Math.sin((phase - 0.29) / 0.21 * Math.PI) * 0.24;
  return 0;
}

export function plethMorphology(phase) {
  if (phase < 0.16) return (phase / 0.16) ** 2;
  const decay = Math.exp(-(phase - 0.16) * 4.2);
  const notch = phase > 0.38 && phase < 0.48
    ? -0.09 * Math.sin((phase - 0.38) / 0.1 * Math.PI)
    : 0;
  return Math.max(0, decay + notch);
}

export function capnoMorphology(phase) {
  if (phase < 0.12) return 0;
  if (phase < 0.2) return (phase - 0.12) / 0.08;
  if (phase < 0.55) return 0.9 + (phase - 0.2) / 0.35 * 0.1;
  if (phase < 0.66) return 1 - (phase - 0.55) / 0.11;
  return 0;
}

/* Ventilator traces, synthesized for display from received machine numerics
   (mode, set rate, measured tidal volume, Ppeak, PEEP). RENDERING ONLY: they
   never feed back to the engine. I:E is drawn at 1:2. Pressure is scaled to
   PAW_SCALE cmH2O and flow to FLOW_SCALE L/min so both normalize to [-1, 1]. */
export const PAW_SCALE = 40;
export const FLOW_SCALE = 60;
const INSPIRATORY_FRACTION = 1 / 3;

export function ventilatorMode(signals = {}) {
  const mode = Number(signals.ventMode);
  const mechanical = (mode === 1 || mode === 2) && signals.airwayDevice !== 'none'
    && Number.isFinite(signals.ppeak) && signals.ppeak > 0;
  if (mechanical) return mode === 1 ? 'vcv' : 'pcv';
  if (mode === 3 && signals.spont) return 'psv';
  return signals.spont ? 'spont' : 'none';
}

export function pawMorphology(phase, signals = {}) {
  const peep = Number.isFinite(signals.ventSetPeep) ? Math.max(0, signals.ventSetPeep) : 0;
  const ppeak = Number.isFinite(signals.ppeak) ? Math.max(peep, signals.ppeak) : peep;
  const kind = ventilatorMode(signals);
  const ti = INSPIRATORY_FRACTION;
  if (kind === 'vcv') {
    if (phase < ti) {
      const x = phase / ti;
      return peep + (ppeak - peep) * (0.25 + 0.75 * x);
    }
    return peep + (ppeak - peep) * 0.15 * Math.exp(-(phase - ti) * 30);
  }
  if (kind === 'pcv') {
    if (phase < ti) return peep + (ppeak - peep) * (1 - Math.exp(-phase * 60));
    return peep + (ppeak - peep) * Math.exp(-(phase - ti) * 40);
  }
  if (kind === 'psv') {
    const support = Number.isFinite(signals.ventSetPressureSupport) ? signals.ventSetPressureSupport : 0;
    if (phase < 0.03) return peep - 1.5 * Math.sin(phase / 0.03 * Math.PI);
    if (phase < 0.33) return peep + support * (1 - Math.exp(-(phase - 0.03) * 50));
    return peep + support * Math.exp(-(phase - 0.33) * 40);
  }
  if (kind === 'spont') {
    if (phase < 0.4) return peep - 2 * Math.sin(phase / 0.4 * Math.PI);
    if (phase < 0.7) return peep + 1 * Math.sin((phase - 0.4) / 0.3 * Math.PI);
    return peep;
  }
  return peep;
}

export function flowMorphology(phase, signals = {}) {
  const kind = ventilatorMode(signals);
  const tvL = Number.isFinite(signals.tv) ? Math.max(0, signals.tv) / 1000 : 0;
  const rr = Number.isFinite(signals.cycleRate) ? signals.cycleRate : 0;
  if (kind === 'none' || rr <= 0 || tvL <= 0) return 0;
  const cycleSec = 60 / rr;
  const tiSec = cycleSec * INSPIRATORY_FRACTION;
  const ti = INSPIRATORY_FRACTION;
  // Mean inspiratory flow in L/min that delivers the measured tidal volume.
  const meanInsp = (tvL / tiSec) * 60;
  if (kind === 'vcv') {
    if (phase < ti) return meanInsp;
    return -meanInsp * 1.6 * Math.exp(-(phase - ti) * 9);
  }
  if (phase < ti) return meanInsp * 2.2 * Math.exp(-phase * 7);
  return -meanInsp * 1.6 * Math.exp(-(phase - ti) * 9);
}

export function createWaveformRenderer(options = {}) {
  const sampleRate = Math.max(1, Math.round(options.sampleRate ?? 100));
  const seconds = Math.max(0.1, Number(options.seconds) || 6);
  const capacity = Math.max(1, Math.round(sampleRate * seconds));
  const maxFrameGapSeconds = Math.max(
    1 / sampleRate,
    Number(options.maxFrameGapSeconds) || 0.25,
  );
  const histories = { ecg: [], pleth: [], co2: [], paw: [], flow: [] };
  let cardiacPhase = 0;
  let respiratoryPhase = 0;
  let ventPhase = 0;
  let sampleRemainder = 0;

  function append(key, value) {
    histories[key].push(normalize(value));
    if (histories[key].length > capacity) {
      histories[key].splice(0, histories[key].length - capacity);
    }
  }

  function advance(elapsedSeconds, receivedSignals = {}) {
    const elapsed = clamp(
      Number.isFinite(elapsedSeconds) ? elapsedSeconds : 0,
      0,
      maxFrameGapSeconds,
    );
    sampleRemainder += elapsed * sampleRate;
    const appended = Math.floor(sampleRemainder);
    sampleRemainder -= appended;

    const hasHeartRate = Number.isFinite(receivedSignals.hr);
    const hasSpo2 = Number.isFinite(receivedSignals.spo2);
    const hasRespiratoryRate = Number.isFinite(receivedSignals.rr);
    const hasEtco2 = Number.isFinite(receivedSignals.etco2);
    const heartRate = hasHeartRate ? Math.max(0, receivedSignals.hr) : 0;
    const respiratoryRate = hasRespiratoryRate ? Math.max(0, receivedSignals.rr) : 0;
    const oxygenScale = hasSpo2 ? clamp(receivedSignals.spo2 / 100, 0, 1) : 0;
    const co2Scale = hasEtco2 ? clamp(receivedSignals.etco2 / 50, 0, 1) : 0;

    const kind = ventilatorMode(receivedSignals);
    const mechanical = kind === 'vcv' || kind === 'pcv';
    const cycleRate = mechanical && Number.isFinite(receivedSignals.ventSetRR)
      ? Math.max(0, receivedSignals.ventSetRR)
      : respiratoryRate;
    const ventSignals = { ...receivedSignals, cycleRate };

    for (let index = 0; index < appended; index += 1) {
      if (cycleRate > 0) ventPhase = (ventPhase + cycleRate / 60 / sampleRate) % 1;
      if (hasHeartRate) {
        cardiacPhase = (cardiacPhase + heartRate / 60 / sampleRate) % 1;
      }
      if (hasRespiratoryRate) {
        respiratoryPhase = (respiratoryPhase + respiratoryRate / 60 / sampleRate) % 1;
      }

      append('ecg', hasHeartRate ? ecgMorphology(cardiacPhase) : 0);
      append('pleth', hasHeartRate && hasSpo2
        ? plethMorphology(cardiacPhase) * oxygenScale
        : 0);
      // Under mechanical ventilation the capnogram follows the ventilator cycle
      // so its plateau sits in expiration, in step with the Paw and flow traces.
      const co2Phase = mechanical && cycleRate > 0
        ? (ventPhase >= INSPIRATORY_FRACTION
          ? 0.12 + ((ventPhase - INSPIRATORY_FRACTION) / (1 - INSPIRATORY_FRACTION)) * 0.54
          : 0.7)
        : respiratoryPhase;
      append('co2', receivedSignals.capnogramPresent === true
        && hasRespiratoryRate && hasEtco2
        ? capnoMorphology(co2Phase) * co2Scale
        : 0);
      append('paw', cycleRate > 0 || kind === 'none'
        ? pawMorphology(cycleRate > 0 ? ventPhase : 0.9, receivedSignals) / PAW_SCALE
        : 0);
      append('flow', flowMorphology(ventPhase, ventSignals) / FLOW_SCALE);
    }

    return { appended, elapsedSeconds: elapsed };
  }

  function snapshot() {
    return {
      ecg: histories.ecg.slice(),
      pleth: histories.pleth.slice(),
      co2: histories.co2.slice(),
      paw: histories.paw.slice(),
      flow: histories.flow.slice(),
      cardiacPhase,
      respiratoryPhase,
      ventPhase,
      capacity,
      sampleRate,
    };
  }

  return { advance, snapshot };
}
