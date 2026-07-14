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

export function createWaveformRenderer(options = {}) {
  const sampleRate = Math.max(1, Math.round(options.sampleRate ?? 100));
  const seconds = Math.max(0.1, Number(options.seconds) || 6);
  const capacity = Math.max(1, Math.round(sampleRate * seconds));
  const maxFrameGapSeconds = Math.max(
    1 / sampleRate,
    Number(options.maxFrameGapSeconds) || 0.25,
  );
  const histories = { ecg: [], pleth: [], co2: [] };
  let cardiacPhase = 0;
  let respiratoryPhase = 0;
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

    for (let index = 0; index < appended; index += 1) {
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
      append('co2', receivedSignals.capnogramPresent === true
        && hasRespiratoryRate && hasEtco2
        ? capnoMorphology(respiratoryPhase) * co2Scale
        : 0);
    }

    return { appended, elapsedSeconds: elapsed };
  }

  function snapshot() {
    return {
      ecg: histories.ecg.slice(),
      pleth: histories.pleth.slice(),
      co2: histories.co2.slice(),
      cardiacPhase,
      respiratoryPhase,
      capacity,
      sampleRate,
    };
  }

  return { advance, snapshot };
}
