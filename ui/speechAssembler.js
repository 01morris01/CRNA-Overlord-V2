/* Speech to text that waits for the speaker to finish.

   Chrome's recognizer finalizes a phrase after well under a second of
   silence, so a student who paused mid sentence ("give some..." then
   "etomidate") was answered before finishing. This joins phrases and only
   hands the text over after a real pause, or when the speaker says so. */

// How long a pause ends what the student is saying. Chrome finalizes a
// phrase after well under a second of silence, which cut people off mid
// order ("give some..." then "etomidate"). Phrases inside this window join.
export const SILENCE_MS = 2200;
// After the push to talk button is let go, late results still arrive.
export const RELEASE_GRACE_MS = 700;

/* Joins speech recognition results into one utterance and hands it over
   after a pause. finals: confirmed phrases; interim: the phrase in progress. */
export function createUtteranceAssembler({ silenceMs = SILENCE_MS, onUtterance = () => {}, onHearing = () => {}, timers = globalThis } = {}) {
  let finals = [];
  let interim = '';
  let timer = null;
  const text = () => [...finals, interim].map((part) => part.trim()).filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
  function flush() {
    if (timer) { timers.clearTimeout(timer); timer = null; }
    const said = text();
    finals = [];
    interim = '';
    onHearing('');
    if (said) onUtterance(said);
    return said;
  }
  function arm(ms = silenceMs) {
    if (timer) timers.clearTimeout(timer);
    timer = timers.setTimeout(flush, ms);
  }
  return {
    /* A SpeechRecognition result event. */
    push(event, { autoFlush = true } = {}) {
      const results = event?.results ?? [];
      interim = '';
      for (let i = event?.resultIndex ?? 0; i < results.length; i += 1) {
        const phrase = results[i]?.[0]?.transcript ?? '';
        if (results[i]?.isFinal) finals.push(phrase);
        else interim += ` ${phrase}`;
      }
      onHearing(text());
      if (autoFlush) arm();
    },
    flush,
    flushSoon(ms = RELEASE_GRACE_MS) { arm(ms); },
    clear() { if (timer) timers.clearTimeout(timer); timer = null; finals = []; interim = ''; onHearing(''); },
    get text() { return text(); },
  };
}
