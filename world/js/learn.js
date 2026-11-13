// learn.js: everything that happens at the gallery's plexus exhibit.
//   The brachial plexus:   film (about 80 s, spoken and captioned, scrubbing, one prediction)  ·  hands-on (6 steps)  ·
//                          challenge (name it or work it out: no labels, a new view each time)  ·  explore
//   Four ways in:          narrated explanation  ·  explore the four levels  ·  identify  ·  case  ·  questions
//   Review:                whatever is due, from both, first
// Three modes are kept apart: free exploration (never recorded), guided learning (never scored), assessment (recorded).
// An answer given after a hint, or on a second try after feedback, is recorded as assisted and never counted as recall.
// Scoring is plain rules on the id of what was clicked or chosen. No AI decides anything here.
import { STRUCTURES, SOURCES, LAYERS, LESSON, FILM, CHALLENGE, CHALLENGE_LENGTH, VIEWS_FOR_CHALLENGE, MODEL_NOTE, CHECK_STATUS, STIM, OUTLINE } from '../data/plexus.js';
import { LEVELS, LEVEL_ORDER, NARRATION, IDENTIFY, IDENTIFY_LENGTH, CASES, QUESTIONS, QUESTIONS_LENGTH, DISCLAIMER } from '../data/regional.js';
import { recordAttempt, dueNow, save, grant, has } from './save.js';
import { sfx } from './audio.js';
import * as vo from './voice.js';

await vo.loadVoice();      // recordings, and with them the film's and the explanation's timing

const TOUCH = matchMedia('(hover: none) and (pointer: coarse)').matches;
const cite = (keys = []) => [...new Set(keys)].map((k) => SOURCES[k]?.cite).filter(Boolean);
const srcHtml = (keys) => { const c = cite(keys); return c.length ? `<details class="src"><summary>Source${c.length > 1 ? 's' : ''}, read in context</summary>${c.map((x) => `<p>${x}</p>`).join('')}<p class="chk">${CHECK_STATUS}</p></details>` : ''; };
const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const ORIGIN = { built: ['Built for Overlord', 'This structure is not in the source model. It was built from the model\'s own landmarks to match the cited description.'], corrected: ['Corrected from the source model', 'The source model attached or placed this differently from the cited description. It was moved to match.'] };

export function mountLearn({ atlas, state, els, onExit, onReward }) {
  const { panel, bar, tip, labels, head } = els, cv = atlas.renderer.domElement;
  const S = { mode: 'menu', names: true, peel: false, voice: true };
  const persist = () => save(state), nameOf = (id) => atlas.nameOf(id), lc = (id) => nameOf(id).replace(/^(C\d|T\d)/, (m) => m).replace(/^([A-Z])(?![0-9])/, (m) => m.toLowerCase());
  const P = (state.game.progress ||= {}), rewards = state.game.rewards, api = { where: 'gallery' }, mmss = (t) => Math.floor(t / 60) + ':' + String(Math.floor(t % 60)).padStart(2, '0');

  // ---------- labels beside structures, nudged apart ----------
  function setLabels(ids = [], extra = {}) { labels.innerHTML = ids.map((id) => `<span data-id="${id}">${extra[id] || nameOf(id)}</span>`).join(''); }
  atlas.onFrame = (dt) => { filmTick(dt); const live = [];
    for (const el of labels.children) { const id = el.dataset.id, p = id.startsWith('marker:') ? atlas.markerScreen(id.slice(7)) : atlas.screenOf(id); const on = p && !p.behind && (p.alpha ?? 1) > 0.5; el.style.opacity = on ? 1 : 0; if (on) live.push({ el, x: p.x, y: p.y }); }
    live.sort((a, b) => a.y - b.y); for (let i = 1; i < live.length; i++) if (live[i].y - live[i - 1].y < 27 && Math.abs(live[i].x - live[i - 1].x) < 170) live[i].y = live[i - 1].y + 27;
    for (const l of live) l.el.style.transform = `translate(${l.x}px, ${l.y}px) translate(16px, -50%)`; };

  // ---------- the bar ----------
  let room = 'dark';
  function drawBar() {
    bar.innerHTML = `<div class="grp">${LAYERS.map(([k, n]) => `<button class="chip ${atlas.layerIsOn(k) ? 'on' : ''}" data-layer="${k}"><i class="dot ${k}"></i>${n}</button>`).join('')}</div>
      <div class="grp">${[['whole', 'Whole'], ['anterolateral', 'Front'], ['lateral', 'Side'], ['posterior', 'Back'], ['superior', 'Above']].map(([k, n]) => `<button class="chip" data-view="${k}">${n}</button>`).join('')}</div>
      <div class="grp"><button class="chip ${S.peel ? 'on warm' : ''}" data-act="peel" title="When on, selecting a structure removes it">Peel</button><button class="chip" data-act="restore">Restore all</button></div>`;
    bar.querySelectorAll('[data-layer]').forEach((b) => b.onclick = () => { atlas.setLayer(b.dataset.layer, !atlas.layerIsOn(b.dataset.layer)); sfx('tap'); drawBar(); });
    bar.querySelectorAll('[data-view]').forEach((b) => b.onclick = () => atlas.view(b.dataset.view));
    bar.querySelector('[data-act=peel]').onclick = () => { S.peel = !S.peel; drawBar(); };
    bar.querySelector('[data-act=restore]').onclick = () => { atlas.showAll(); if (S.mode === 'lesson') applyStep(false); drawBar(); };
  }

  // ---------- pointer ----------
  let down = null;
  cv.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; });
  cv.addEventListener('pointerup', (e) => { if (!down) return; const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y), dt = performance.now() - down.t; down = null; if (moved < 7 && dt < 600) click(e); });
  const namesShown = () => (S.mode === 'explore' && S.names) || S.mode === 'lesson' || S.mode === 'menu' || S.mode === 'r-explore';
  cv.addEventListener('pointermove', (e) => { if (e.buttons) { tip.classList.remove('on'); return; } const id = atlas.pick(e); atlas.hover(id && !id.startsWith('marker:') ? id : null); cv.style.cursor = id ? 'pointer' : 'grab';
    const show = id && namesShown() && !(S.mode !== 'r-explore' && id.startsWith('marker:')); tip.classList.toggle('on', !!show); if (show) { tip.textContent = id.startsWith('marker:') ? LEVELS[id.slice(7)].name + ' level' : nameOf(id); tip.style.left = e.clientX + 'px'; tip.style.top = e.clientY + 'px'; } });
  cv.addEventListener('pointerleave', () => { tip.classList.remove('on'); atlas.hover(null); });
  function click(e) {
    const id = atlas.pick(e), isMarker = id && id.startsWith('marker:');
    if (isMarker) { if (S.mode === 'r-explore') return pickLevel(id.slice(7)); if (S.mode === 'r-case' && S.cphase === 'approach') { S.chosen = id.slice(7); atlas.chooseMarker(S.chosen); sfx('tap'); draw(); } return; }
    if (S.peel && id && !/^r-(case|questions|intro)|questions/.test(S.mode)) { atlas.hide(id); sfx('take'); if (S.mode === 'lesson') lessonClick(id, true); return; }
    if (S.mode === 'explore' || S.mode === 'menu') { if (S.mode === 'menu' && id) go('explore'); atlas.select(id); S.picked = id; S.revealed = S.names; S.stim = null; if (id) sfx('tap'); draw(); }
    else if (S.mode === 'lesson') lessonClick(id, false);
    else if (S.mode === 'film') { film.playing = false; draw(); }
    else if (S.mode === 'items' && S.phase !== 'feedback' && id) { S.picked = id; S.phase = 'sure'; atlas.select(id); sfx('tap'); draw(); }
  }

  // ---------- lesson ----------
  function applyStep(move = true) { const st = LESSON[S.step]; atlas.showAll(); for (const id of st.hide || []) atlas.hide(id); atlas.ghost(st.ghost || []); atlas.glow(st.glow || []); setLabels(st.label || []); atlas.select(null); if (move) atlas.view(st.view); drawBar(); }
  function lessonClick(id, peeled) {
    if (S.done) return; const st = LESSON[S.step], u = st.until; let ok = false, nudge = '';
    if (u.hide) { if (id === u.hide) { atlas.hide(id); ok = true; } else if (id) nudge = `That is the ${lc(id)}. The one to lift is the long strap running up to the skull.`; }
    else if (peeled) return;
    else if (u.pick) { if (u.pick.includes(id)) ok = true; else if (id) nudge = `That is the ${lc(id)}. ${STRUCTURES[id]?.tell || ''}`; }
    else if (u.order) { const want = u.order[S.prog.length]; if (id === want) { S.prog.push(id); ok = S.prog.length === u.order.length; if (!ok) nudge = `Yes: the ${lc(id)}. Next one down.`; } else if (id) nudge = `That is the ${lc(id)}. Start with the highest and work down.`; }
    else if (u.all) { if (u.all.includes(id)) { if (!S.prog.includes(id)) S.prog.push(id); ok = S.prog.length === u.all.length; if (!ok) nudge = `Yes: the ${lc(id)}. ${u.all.length - S.prog.length} more.`; } else if (id) nudge = `That is the ${lc(id)}. ${STRUCTURES[id]?.tell || ''}`; }
    if (ok) { S.done = true; atlas.glow(u.pick && u.pick.length < 3 ? u.pick : u.order || u.all || [id]); sfx('correct'); } else if (nudge) sfx('tap');
    S.nudge = nudge; draw();
  }

  // ---------- identification runs (plexus challenge, regional identification, review) ----------
  const OBJ = (it) => (it.kind === 'apply' ? 'regional.blocks.' : 'regional.plexus.') + it.answer[0];
  function pickItems(pool, n, needKinds) {
    const due = new Set(dueNow(state).map((d) => d.item)), first = shuffle(pool.filter((c) => due.has(c.ask))).slice(0, n), rest = shuffle(pool.filter((c) => !due.has(c.ask))); let out = [...first];
    for (const [kind, min] of Object.entries(needKinds || {})) { const have = out.filter((c) => c.kind === kind).length; for (const c of rest.filter((c) => c.kind === kind).slice(0, Math.max(0, min - have))) if (out.length < n) out.push(c); }
    for (const c of rest) if (out.length < n && !out.includes(c)) out.push(c);
    return [...out.slice(0, first.length), ...shuffle(out.slice(first.length))].slice(0, n);
  }
  function startItems(items, run) { S.mode = 'items'; S.run = run; S.items = items; S.i = 0; S.results = []; presentItem(); document.body.dataset.learn = 'items'; drawBar(); draw(); }
  function presentItem(retry = false) {   // a different angle and a different dressing each time, and never a label or a highlight
    S.phase = 'ask'; S.picked = null; S.peel = false; S.hint = false; S.retry = retry; S.t0 = performance.now(); atlas.setMarkers([]); atlas.showAll(); atlas.glow([]); atlas.select(null); setLabels([]); atlas.ghost([]); atlas.isolate(null);
    const mine = new Set(S.items[S.i].answer.map((id) => atlas.parts.get(id)?.layer));      // never dress away the layer the answer is in
    const dresses = ['plain', 'noVein', 'noAirway'].filter((d) => d !== S.lastDress && !(d === 'noVein' && mine.has('vein')) && !(d === 'noAirway' && mine.has('airway'))); S.lastDress = dresses[Math.floor(Math.random() * dresses.length)]; if (S.lastDress === 'noVein') atlas.setLayer('vein', false); else if (S.lastDress === 'noAirway') atlas.setLayer('airway', false);
    const views = VIEWS_FOR_CHALLENGE.filter((v) => v !== S.lastView); S.lastView = views[Math.floor(Math.random() * views.length)]; atlas.view(S.lastView, 1.0, 0.5); drawBar();
  }
  function answer(conf) {
    const it = S.items[S.i], correct = it.answer.includes(S.picked), ms = Math.round(performance.now() - S.t0), assist = S.retry ? 'retry' : S.hint ? 'hint' : null;
    recordAttempt(state, { objective: OBJ(it), outline: it.outline, item: it.ask, evidence: it.kind === 'find' ? 'identified' : it.kind === 'relation' ? 'related' : 'applied', correct, confidence: conf, picked: S.picked, assist, ms, where: S.run === 'review' ? 'review' : api.where, view: S.lastView });
    if (S.retry) S.results[S.results.length - 1].retry = { correct, picked: S.picked }; else S.results.push({ it, correct, conf, picked: S.picked, assist, ms });
    persist(); S.phase = 'feedback'; sfx(correct ? 'correct' : 'wrong');
    atlas.showAll(); atlas.ghost(['muscle']); atlas.glow(it.answer); atlas.select(correct ? null : S.picked); setLabels(correct ? [S.picked] : [it.answer[0], S.picked]); atlas.focus(correct ? S.picked : it.answer[0]); drawBar(); draw();
  }
  const mistake = (it, picked) => { const p = STRUCTURES[picked], a = STRUCTURES[it.answer[0]]; return `<p>You selected the <b>${lc(picked)}</b>.${p?.tell ? ' ' + p.tell : ''}</p><p><b>What you were looking for:</b> ${a?.tell || ''} ${it.why}</p>`; };

  // ---------- regional: narration ----------
  let narrT = 0, speaking = null;
  const levelAt = (k) => { const L = LEVELS[k]; return L.anchorAt === 'top' ? atlas.topOf(L.anchor) : atlas.centreOf(L.anchor); };
  const allMarkers = () => LEVEL_ORDER.map((k) => ({ id: k, at: levelAt(k) }));
  /** Speak a line (recorded when there is a recording, else the browser's voice), from `at` seconds into it. Captions always carry the same words. */
  function speak(text, at = 0) { if (!S.voice) { vo.stop(); return; } vo.say(text, { at }); }
  function narrStep(i) {
    S.n = i; const st = NARRATION[i], L = st.level ? LEVELS[st.level] : null; clearTimeout(narrT);
    atlas.showAll(); atlas.ghost(L ? ['muscle'] : []); atlas.setMarkers(L ? [{ id: st.level, at: levelAt(st.level) }] : allMarkers()); atlas.glow(st.glow || (L ? L.show : [])); setLabels(L ? ['marker:' + st.level] : [], L ? { ['marker:' + st.level]: L.name } : {});
    atlas.view(L ? L.view : st.view || 'whole', 1.4); speak(st.say); if (S.playing) narrT = setTimeout(() => (i < NARRATION.length - 1 ? narrStep(i + 1) : (S.playing = false, draw())), st.ms); draw();
  }
  // ---------- regional: explore ----------
  function pickLevel(k) { S.level = k; (S.visited ||= new Set()).add(k); const L = LEVELS[k]; atlas.showAll(); atlas.ghost(['muscle']); atlas.glow(L.show); atlas.chooseMarker(k); atlas.view(L.view, 1.1); sfx('tap'); draw(); }
  // ---------- regional: case ----------
  function startCase() { const due = new Set(dueNow(state).map((d) => d.item)); const order = [...CASES].sort((a, b) => (due.has(b.id) - due.has(a.id)) || ((P.casesSeen?.[a.id] || 0) - (P.casesSeen?.[b.id] || 0))); S.case = order[0]; (P.casesSeen ||= {})[S.case.id] = (P.casesSeen[S.case.id] || 0) + 1;
    S.mode = 'r-case'; S.cphase = 'approach'; S.t0 = performance.now(); S.chosen = null; S.rsel = new Set(); S.reasonOrder = shuffle(S.case.reasons.map((_, i) => i)); S.typed = ''; atlas.showAll(); atlas.ghost([]); atlas.glow([]); setLabels([]); atlas.select(null); atlas.setMarkers(allMarkers()); atlas.chooseMarker(null); atlas.view('whole', 1.1, 0.35); document.body.dataset.learn = 'r-case'; drawBar(); draw(); }
  function gradeCase() {
    const c = S.case, [g] = c.grade[S.chosen], okApproach = g !== 'no', picks = S.reasonOrder.map((i) => ({ i, sel: S.rsel.has(i), truth: c.reasons[i][1] })), reasonsRight = picks.every((p) => p.sel === p.truth);
    recordAttempt(state, { objective: 'regional.case.' + c.id + '.approach', outline: c.outline, item: c.id, evidence: 'applied', correct: okApproach, confidence: 2, picked: S.chosen, where: api.where, ms: Math.round(performance.now() - (S.t0 || performance.now())) });
    recordAttempt(state, { objective: 'regional.case.' + c.id + '.reasons', outline: c.outline, item: c.id + ':reasons', evidence: 'applied', correct: reasonsRight, confidence: 2, picked: [...S.rsel].join(','), where: api.where });
    S.caseResult = { okApproach, reasonsRight, g, picks };
    const arch = (state.game.cases[c.id] ||= { attempts: [] }); arch.attempts.push({ t: Date.now(), chosen: S.chosen, grade: g, reasons: picks.filter((p) => p.sel).map((p) => p.i), reasonsRight, typed: (S.typed || '').slice(0, 400), self: null }); if (arch.attempts.length > 12) arch.attempts.shift();
    if (S.typed && grant(state, 'case:' + c.id, 'completed and explained the case')) S.newCase = c.id;
    persist(); sfx(okApproach && reasonsRight ? 'correct' : 'wrong');
    const best = Object.keys(c.grade).find((k) => c.grade[k][0] === 'best'); atlas.ghost(['muscle']); atlas.glow(LEVELS[best].show); atlas.chooseMarker(best); setLabels(LEVEL_ORDER.map((k) => 'marker:' + k), Object.fromEntries(LEVEL_ORDER.map((k) => ['marker:' + k, LEVELS[k].name]))); atlas.view(LEVELS[best].view, 1.2);
  }
  // ---------- questions ----------
  function startQuestions(pool, n, run) { const due = new Set(dueNow(state).map((d) => d.item)); S.qs = [...shuffle(pool.filter((q) => due.has(q.stem))), ...shuffle(pool.filter((q) => !due.has(q.stem)))].slice(0, n); S.q = 0; S.qsel = new Set(); S.qmatch = {}; S.qdone = false; S.qres = []; S.run = run; S.mode = 'questions';
    atlas.setMarkers([]); atlas.showAll(); atlas.glow([]); setLabels([]); atlas.ghost([]); atlas.view('whole'); document.body.dataset.learn = 'questions'; drawBar(); draw(); }
  function submitQ() { const q = S.qs[S.q]; let correct;
    if (q.type === 'match') correct = q.left.every((_, i) => +S.qmatch[i] === q.correct[i]); else { const sel = [...S.qsel].sort(), c = [...q.correct].sort(); correct = sel.length === c.length && sel.every((v, i) => v === c[i]); }
    recordAttempt(state, { objective: 'regional.q.' + q.stem.slice(0, 40), outline: q.outline, item: q.stem, evidence: 'recognised', correct, confidence: 2, picked: q.type === 'match' ? JSON.stringify(S.qmatch) : [...S.qsel].join(',') }); S.qres.push(correct); S.qdone = true; persist(); sfx(correct ? 'correct' : 'wrong'); draw(); }

  // ---------- the film: a timed lesson you can scrub ----------
  const film = { t: 0, playing: false, cue: -1, pred: {}, ui: null };
  const cueAt = (t) => { let i = 0; for (let k = 0; k < FILM.cues.length; k++) if (t >= FILM.cues[k].t) i = k; return i; };
  /** Put the model and camera in the state the film has at time t. With snap, nothing eases: the picture depends on t alone. */
  function filmApply(t, snap = false) {
    const i = cueAt(t), c = FILM.cues[i], from = FILM.cues[Math.max(0, i - 1)];
    if (i !== film.cue || snap) { const changed = i !== film.cue; film.cue = i; atlas.showAll(); for (const id of c.hide || []) atlas.hide(id); atlas.ghost(c.ghost || []); atlas.glow(c.glow || []); setLabels(c.label || []); atlas.select(null); atlas.setMarkers([]); if (snap) atlas.settle(); if (changed) { if (film.playing) speak(c.say, Math.max(0, t - c.t)); const nx = FILM.cues[i + 1]; if (nx) vo.warm(nx.say); draw(); } }
    const k = Math.min(1, (t - c.t) / 2.4), e = k * k * (3 - 2 * k), a = atlas.pose(i ? from.view : c.view), bb = atlas.pose(c.view); atlas.setPose(a.pos.lerp(bb.pos, e), a.target.lerp(bb.target, e));
  }
  function filmTick(dt) {
    if (S.mode !== 'film' || !film.playing) return; const i = cueAt(film.t), c = FILM.cues[i], end = i < FILM.cues.length - 1 ? FILM.cues[i + 1].t : FILM.seconds;
    film.t = Math.min(FILM.seconds, film.t + dt);
    if (c.predict && film.pred[i] === undefined && film.t >= end - 0.05) { film.t = end - 0.06; film.playing = false; vo.stop(); draw(); return; }      // wait for the prediction
    if (film.t >= FILM.seconds) { film.playing = false; if (!state.game.filmDone) { state.game.filmDone = true; persist(); } draw(); }
    filmApply(film.t); if (film.ui) { film.ui.range.value = film.t; film.ui.time.textContent = mmss(film.t) + ' / ' + mmss(FILM.seconds); }
  }
  /** One exact frame of the lesson, for capture: window.renderAt(seconds, { width, height }). Touches no learner record. */
  window.renderAt = (t, opts = {}) => { if (S.mode !== 'film') go('film'); film.playing = false; vo.stop(); film.t = Math.max(0, Math.min(FILM.seconds, +t || 0)); filmApply(film.t, true); atlas.renderOnce(opts); const c = FILM.cues[film.cue]; return { t: film.t, cue: film.cue, caption: c.say, sources: cite(c.src) }; };
  window.renderAt.duration = FILM.seconds; window.renderAt.cues = FILM.cues.map((c) => c.t);

  // ---------- results, and what they add to the collection ----------
  function finishRun() {
    const R = S.results || [], own = R.filter((r) => !r.assist), right = own.filter((r) => r.correct).length, total = R.length, g = state.game, earned = { items: [] }; let pass = false;
    const add = (id, from, line) => { if (grant(state, id, from)) earned.items.push(line); };
    if (S.run === 'plexus' || S.run === 'review') {
      pass = total > 0 && right >= Math.ceil(total * 0.75);          // answers given after a hint do not count toward it
      if (S.run === 'plexus' && pass) { add('plexus-specimen', 'identified the plexus without labels, ' + right + ' of ' + total, 'The brachial plexus specimen is now in your studio. Open it there to inspect it, pin notes to it and run a personal-best round');
        const ms = own.reduce((a, r) => a + (r.ms || 0), 0), best = g.best.plexus; if (!best || right > best.right || (right === best.right && ms < best.ms)) g.best.plexus = { right, total, ms, t: Date.now() }; }
      const spec = g.collection.find((c) => c.id === 'plexus-specimen');
      if (S.run === 'review' && pass && spec && Date.now() - spec.at > 20 * 3600000) { add('stimulator-layer', 'passed a review a day or more after earning the specimen', 'A stimulation layer for your specimen: select a nerve and see its stated motor response'); if (!rewards.includes('nerve-stimulator')) rewards.push('nerve-stimulator'); }
    }
    if (S.run === 'regional') { const c = S.caseResult || {}; pass = right >= Math.ceil(total * 0.75) && !!c.okApproach; P.regionalDone = (P.regionalDone || 0) + 1;
      if (pass) add('regional-patch', 'completed the regional series', 'The regional series patch: on your studio wall and your character card'); }
    if (S.newCase) { earned.items.push('The case you explained is in your archive, on the studio desk: replay it and compare a later attempt'); S.newCase = null; }
    S.earned = earned; S.pass = pass; persist(); if (earned.items.length) sfx('reward'); onReward && onReward(earned);
  }

  function go(mode) {
    clearTimeout(narrT); vo.stop(); film.playing = false; film.ui = null;
    S.mode = mode; S.picked = null; S.nudge = ''; S.stim = null; atlas.select(null); atlas.glow([]); setLabels([]); atlas.ghost([]); atlas.isolate(null); atlas.setMarkers([]);
    if (mode === 'menu' || mode === 'explore') { atlas.showAll(); if (mode === 'menu') atlas.view('whole'); }
    if (mode === 'lesson') { S.step = 0; S.prog = []; S.done = false; applyStep(); }
    if (mode === 'film') { film.t = 0; film.cue = -1; film.pred = {}; film.playing = true; S.voice = S.voice !== false; filmApply(0, true); speak(FILM.cues[0].say); }
    if (mode === 'challenge') return startItems(pickItems(CHALLENGE, CHALLENGE_LENGTH, { relation: 4, find: 2 }), 'plexus');
    if (mode === 'review') { const due = new Set(dueNow(state).map((d) => d.item)), items = shuffle([...CHALLENGE, ...IDENTIFY].filter((c) => due.has(c.ask))).slice(0, 8); if (!items.length) { S.mode = 'menu'; S.flash = 'Nothing is due right now.'; } else return startItems(items, 'review'); }
    if (mode === 'r-intro') { S.playing = true; S.visited = new Set(); S.caseResult = null; S.results = []; S.qres = []; narrStep(0); }
    if (mode === 'r-explore') { atlas.showAll(); atlas.ghost(['muscle']); atlas.setMarkers(allMarkers()); setLabels(LEVEL_ORDER.map((k) => 'marker:' + k), Object.fromEntries(LEVEL_ORDER.map((k) => ['marker:' + k, LEVELS[k].name]))); S.level = null; atlas.view('whole'); }
    if (mode === 'r-identify') return startItems(pickItems(IDENTIFY, IDENTIFY_LENGTH), 'regional');
    if (mode === 'r-case') return startCase();
    if (mode === 'r-questions') return startQuestions(QUESTIONS, QUESTIONS_LENGTH, 'regional');
    if (mode === 'results') finishRun();
    document.body.dataset.learn = mode; drawBar(); draw();
  }
  const afterItems = () => S.run === 'regional' ? go('r-case') : go('results');

  function draw() {
    const due = dueNow(state).length, g = state.game; let h = '';
    if (S.mode === 'menu') {
      const spec = has(state, 'plexus-specimen'), next = due ? 'review' : !g.filmDone ? 'film' : !g.lessonDone ? 'lesson' : !spec ? 'challenge' : !P.regionalDone ? 'r-intro' : '';
      head.innerHTML = `<small>Anatomy gallery · regional anesthesia</small><h1>The brachial plexus.</h1><p>Right side, neck to hand. Turn it, peel it, and select anything.</p>`;
      h = `${S.flash ? `<p class="nudge">${S.flash}</p>` : ''}${due ? `<button class="row go" data-go="review"><b>Review what is due</b><span>${due} ${due === 1 ? 'item' : 'items'} you missed or guessed, first.</span></button>` : ''}
        <h3>Learn</h3>
        <button class="row ${next === 'film' ? 'go' : ''}" data-go="film"><b>Film: follow the lowest trunk</b><span>${Math.round(FILM.seconds)} seconds. One question, one prediction. Captions, replay, scrubbing.</span></button>
        <button class="row ${next === 'lesson' ? 'go' : ''}" data-go="lesson"><b>Hands-on</b><span>Six steps, roots to nerves. You act at every step. Not scored.</span></button>
        <h3>Show what you know</h3>
        <button class="row ${next === 'challenge' ? 'go' : ''}" data-go="challenge"><b>Challenge</b><span>${CHALLENGE_LENGTH} from ${CHALLENGE.length}: name it, or work it out. No labels, a new view each time. Recorded.</span></button>
        <h3>Free</h3>
        <button class="row" data-go="explore"><b>Explore</b><span>Layers, isolate, names on or off${has(state, 'stimulator-layer') ? ', stimulation layer' : ''}${spec ? ', your notes' : ''}. Never recorded.</span></button>
        <h3>Four ways in: regional blocks</h3>
        <button class="row ${next === 'r-intro' ? 'go' : ''}" data-go="r-intro"><b>${P.regionalDone ? 'Run it again' : 'Start'}</b><span>A narrated explanation, the four levels, identification, a case, questions.</span></button>
        ${P.regionalDone ? `<div class="tools"><button class="chip" data-go="r-explore">Levels</button><button class="chip" data-go="r-case">Case</button><button class="chip" data-go="r-questions">Questions</button></div>` : ''}
        <button class="row quiet" data-go="exit"><b>Step back from the exhibit</b></button><p class="fine">${MODEL_NOTE}</p><p class="fine">${SOURCES.ZA.cite}</p>`; S.flash = '';
    } else if (S.mode === 'film') {
      const c = FILM.cues[Math.max(0, film.cue)], pr = c.predict, picked = film.pred[film.cue], waiting = pr && picked === undefined && !film.playing && film.t < FILM.seconds - 0.2 && film.t >= (FILM.cues[film.cue + 1]?.t ?? FILM.seconds) - 0.2, over = film.t >= FILM.seconds - 0.05, voice = vo.recorded(c.say) || 'speechSynthesis' in window;
      head.innerHTML = `<small>Film · ${FILM.title} · ${film.cue + 1} of ${FILM.cues.length}</small><h1 class="stem caption">${c.say}</h1>`;
      h = `<div class="scrub"><button class="chip on" data-act="fplay">${film.playing ? 'Pause' : over ? 'Replay' : 'Play'}</button><input type="range" id="fRange" min="0" max="${FILM.seconds}" step="0.1" value="${film.t.toFixed(1)}" aria-label="Position in the film"><span id="fTime">${mmss(film.t)} / ${mmss(FILM.seconds)}</span></div>
        <div class="tools">${FILM.cues.map((q, i) => `<button class="chip ${i === film.cue ? 'on' : ''}" data-cue="${i}" title="${q.say.slice(0, 60)}">${i + 1}</button>`).join('')}${voice ? `<button class="chip ${S.voice ? 'on' : ''}" data-act="nvoice">Voice ${S.voice ? 'on' : 'off'}</button>` : ''}</div>
        ${waiting ? `<h2>Your prediction</h2><p class="fine">Not scored. It is here so that you commit before you are shown.</p><div class="opts">${pr.options.map((o, i) => `<button class="opt" data-pred="${i}">${o}</button>`).join('')}</div>` : ''}
        ${pr && picked !== undefined ? `<p class="${picked === pr.answer ? 'stim' : 'nudge'}">${picked === pr.answer ? '<b>You predicted it.</b>' : `You predicted the ${pr.options[picked].toLowerCase()}.`} Watch where it goes.</p>` : ''}
        ${over ? `<h2>Now do it with your hands.</h2><p>Lift the muscle, find the roots, name the trunks. Then try it without labels.</p><button class="btn" data-go="lesson">Hands-on, six steps</button><button class="btn alt" data-go="challenge">Straight to the challenge</button>` : ''}
        ${srcHtml(c.src)}<button class="chip quiet" data-go="menu">Leave the film</button>`;
    } else if (S.mode === 'explore') {
      head.innerHTML = `<small>Explore · free, never recorded</small><h1>Turn it. Peel it.</h1><p>Select a structure. Switch names off to test yourself.</p>`;
      const id = S.picked, st = STRUCTURES[id], part = id && atlas.parts.get(id), o = part && ORIGIN[part.origin];
      h = `<div class="tools"><button class="chip ${S.names ? 'on' : ''}" data-act="names">Names ${S.names ? 'on' : 'off'}</button><button class="chip" data-go="menu">Done</button></div>`;
      if (!id) h += `<h2>Nothing selected.</h2><p>Drag to turn, scroll or pinch to zoom, click a structure.</p>`;
      else if (!S.revealed) h += `<h2>What is this?</h2><p>Decide, then check.</p><button class="btn" data-act="reveal">Reveal</button>`;
      else h += `<h2>${nameOf(id)}</h2><p class="lay"><i class="dot ${part.layer}"></i>${part.layer}${o ? ` · <span class="badge" title="${o[1]}">${o[0]}</span>` : ''}</p>${st?.fact ? `<p>${st.fact}</p>` : '<p class="fine">Named from the source model. No statement about it has been checked yet, so none is shown.</p>'}${o ? `<p class="fine">${o[1]} ${part.what ? 'What was done: ' + part.what + '.' : ''}</p>` : ''}${srcHtml(['ZA', ...(st?.src || [])])}
        ${S.stim ? `<p class="stim">${S.stim}</p>` : ''}<div class="tools"><button class="chip" data-act="isolate">${atlas.isIsolated() ? 'Show the rest' : 'Isolate'}</button><button class="chip" data-act="hide">Hide</button><button class="chip" data-act="focus">Center</button>${has(state, 'stimulator-layer') && part.layer === 'nerve' ? '<button class="chip on warm" data-act="stim">Stimulate</button>' : ''}</div>${has(state, 'plexus-specimen') ? `<h3>Your note</h3><textarea id="note" rows="2" placeholder="Pin a note to this structure. It stays with your specimen.">${(state.game.notes[id] || '').replace(/</g, '&lt;')}</textarea>` : ''}`;
    } else if (S.mode === 'lesson') {
      const st = LESSON[S.step], last = S.step === LESSON.length - 1;
      head.innerHTML = `<small>Hands-on · step ${S.step + 1} of ${LESSON.length} · guided, not scored</small><h1>${st.title}</h1><p>${st.say}</p>`;
      h = `<div class="dots">${LESSON.map((_, i) => `<i class="${i < S.step ? 'past' : i === S.step ? 'now' : ''}"></i>`).join('')}</div><h2>${S.done ? 'Yes.' : st.do}</h2>${S.nudge && !S.done ? `<p class="nudge">${S.nudge}</p>` : ''}
        ${S.done ? `<button class="btn" data-act="next">${last ? 'Finish the lesson' : 'Next'}</button>` : ''}${srcHtml(st.src)}<button class="chip quiet" data-go="menu">Leave</button>`;
    } else if (S.mode === 'items') {
      const it = S.items[S.i], kind = { find: 'name it', relation: 'work it out', apply: 'apply it' }[it.kind], runName = { plexus: 'Challenge', regional: 'Identify', review: 'Review' }[S.run];
      head.innerHTML = `<small>${runName} · ${S.i + 1} of ${S.items.length} · ${kind}</small><h1 class="${it.ask.length > 40 ? 'stem' : ''}">${it.ask}</h1><p>${S.phase === 'feedback' ? '' : 'No labels. Turn it and peel what is in your way.'}</p>`;
      if (S.phase === 'ask') h = `<h2>${S.retry ? 'Again, from this side.' : 'Select the structure.'}</h2><p>${S.retry ? 'A different view and dressing. This second try is recorded as assisted.' : 'You can change your mind before you commit.'}</p>${S.hint ? `<p class="nudge">${STRUCTURES[it.answer[0]]?.tell || 'No hint is written for this one.'}</p>` : !S.retry ? '<button class="chip quiet" data-act="hint">Show a hint (the answer is then recorded as assisted)</button>' : ''}`;
      else if (S.phase === 'sure') h = `<h2>Selected. How sure are you?</h2><p>The name stays hidden until you commit.</p><div class="sure"><button class="btn alt" data-conf="1">Guess</button><button class="btn alt" data-conf="2">Think so</button><button class="btn" data-conf="3">Sure</button></div>`;
      else { const r = S.results[S.results.length - 1], last = S.i === S.items.length - 1, nextLabel = !last ? 'Next' : S.run === 'regional' ? 'On to the case' : 'See how you did';
        if (r.retry) h = `<div class="verdict ${r.retry.correct ? 'yes' : 'no'}">${r.retry.correct ? 'Found it this time' : 'Still not it'}</div><h2>${nameOf(it.answer[0])}</h2>${r.retry.correct ? `<p>${it.why}</p>` : mistake(it, r.retry.picked)}<p class="fine">Second try after seeing the answer: recorded as assisted. The first answer is the one that counts, and it comes back tomorrow.</p>${srcHtml(['ZA', ...it.src])}<button class="btn" data-act="inext">${nextLabel}</button>`;
        else h = `<div class="verdict ${r.correct ? 'yes' : 'no'}">${r.correct ? (r.assist ? 'Correct, with a hint' : 'Correct') : 'Not this time'}</div><h2>${nameOf(r.correct ? r.picked : it.answer[0])}</h2>${r.correct ? `<p>${it.why}</p>` : mistake(it, r.picked)}
          ${r.assist ? '<p class="fine">You used the hint, so this is recorded as assisted and does not count as recall.</p>' : r.correct && r.conf === 1 ? '<p class="fine">Right, but a guess, so it comes back in two days.</p>' : !r.correct ? `<p class="fine">${r.conf === 3 ? 'You were sure. That is the kind to distrust. ' : ''}It comes back tomorrow. Both are lit on the model now: what you chose in white, the answer in coral.</p>` : ''}${srcHtml(['ZA', ...it.src])}
          ${!r.correct ? `<button class="btn" data-act="iretry">Find it again from another view</button><button class="chip quiet" data-act="inext">Skip the second try</button>` : `<button class="btn" data-act="inext">${nextLabel}</button>`}`; }
    } else if (S.mode === 'r-intro') {
      const st = NARRATION[S.n], voice = vo.recorded(st.say) || 'speechSynthesis' in window;
      head.innerHTML = `<small>Four ways in · ${S.n + 1} of ${NARRATION.length}</small><h1 class="stem caption">${st.say}</h1>`;
      h = `<div class="dots">${NARRATION.map((_, i) => `<i class="${i < S.n ? 'past' : i === S.n ? 'now' : ''}"></i>`).join('')}</div>
        <div class="tools"><button class="chip" data-act="nprev" ${S.n ? '' : 'disabled'}>Back</button><button class="chip on" data-act="nplay">${S.playing ? 'Pause' : S.n === NARRATION.length - 1 ? 'Replay' : 'Play'}</button><button class="chip" data-act="nnext" ${S.n < NARRATION.length - 1 ? '' : 'disabled'}>Next</button>${voice ? `<button class="chip ${S.voice ? 'on' : ''}" data-act="nvoice">Voice ${S.voice ? 'on' : 'off'}</button>` : ''}</div>
        <button class="btn" data-go="r-explore">${S.n === NARRATION.length - 1 ? 'Explore the four levels' : 'Skip to exploring'}</button>${srcHtml(st.src)}<p class="fine">${DISCLAIMER}</p><button class="chip quiet" data-go="menu">Leave</button>`;
    } else if (S.mode === 'r-explore') {
      const L = S.level && LEVELS[S.level], n = S.visited?.size || 0;
      head.innerHTML = `<small>Four ways in · explore</small><h1>${L ? L.name + '.' : 'Four levels.'}</h1><p>${L ? 'Aimed at ' + L.targets + '.' : 'Select a ring on the model, or a level below.'}</p>`;
      h = `<div class="tools">${LEVEL_ORDER.map((k) => `<button class="chip ${S.level === k ? 'on' : ''}" data-level="${k}">${LEVELS[k].name}${S.visited?.has(k) ? ' ✓' : ''}</button>`).join('')}</div>
        ${L ? `<h3>Used for</h3><p>${L.usedFor}</p><h3>What it misses</h3><p>${L.misses}</p><h3>What lies beside it</h3><p>${L.near}</p>${srcHtml(L.src)}` : `<p>Each ring marks where an approach is aimed. Everything else on the model still works: turn, peel, select.</p>`}
        <button class="btn" data-go="r-identify">${n >= 4 ? 'Identify without labels' : `Continue (${n} of 4 visited)`}</button><p class="fine">${DISCLAIMER}</p><button class="chip quiet" data-go="menu">Leave</button>`;
    } else if (S.mode === 'r-case') {
      const c = S.case;
      head.innerHTML = `<small>Four ways in · case</small><h1 class="stem">${c.stem}</h1><p>${S.cphase === 'approach' ? 'The four rings are the four levels. They are not labeled.' : ''}</p>`;
      if (S.cphase === 'approach') h = `<h2>${S.chosen ? 'That level?' : 'Select the level you would choose.'}</h2><p>${S.chosen ? 'You can select another ring before you commit.' : 'Select a ring on the model.'}</p><button class="btn" data-act="ccommit" ${S.chosen ? '' : 'disabled'}>Commit</button>`;
      else if (S.cphase === 'reasons') h = `<h2>Which of these are true and support a choice here?</h2><p class="fine">Select every one that applies.</p><div class="opts">${S.reasonOrder.map((i) => `<button class="opt ${S.rsel.has(i) ? 'sel' : ''}" data-reason="${i}">${c.reasons[i][0]}</button>`).join('')}</div><button class="btn" data-act="creasons">Submit</button>`;
      else if (S.cphase === 'explain') h = `<h2>In one sentence: why that approach?</h2><textarea id="why" rows="3" placeholder="Type it before you look.">${S.typed}</textarea><button class="btn" data-act="cexplain">Compare with a model answer</button><button class="chip quiet" data-act="cskip">Skip</button>`;
      else { const r = S.caseResult, [gr, why] = c.grade[S.chosen], best = Object.keys(c.grade).find((k) => c.grade[k][0] === 'best');
        h = `<div class="verdict ${gr === 'no' ? 'no' : 'yes'}">${gr === 'best' ? 'The approach the source prefers' : gr === 'ok' ? 'Defensible' : 'Not this approach'}</div><h2>You chose ${LEVELS[S.chosen].name.toLowerCase()}.</h2><p>${why}</p>${gr !== 'best' ? `<p><b>${LEVELS[best].name}:</b> ${c.grade[best][1]}</p>` : ''}
          <h3>Your reasons</h3>${r.picks.map((p) => `<p class="reason ${p.sel === p.truth ? 'ok' : 'bad'}"><b>${p.sel === p.truth ? '✓' : '✗'}</b> ${c.reasons[p.i][0]} <span>${c.reasons[p.i][2]}${p.sel !== p.truth ? (p.truth ? ' You left it out.' : ' You selected it.') : ''}</span></p>`).join('')}
          ${S.typed ? `<h3>Your sentence</h3><p class="fine">"${S.typed.replace(/</g, '&lt;')}"</p><h3>A model answer</h3><p>${c.model}</p><div class="sure two-b"><button class="btn alt" data-self="0">I missed part of it</button><button class="btn" data-self="1">Mine said this</button></div>` : `<h3>A model answer</h3><p>${c.model}</p>`}${srcHtml(c.src)}
          ${state.game.cases[c.id]?.attempts.length > 1 ? `<p class="fine">This is attempt ${state.game.cases[c.id].attempts.length}. Your earlier ones are in the archive on your studio desk, side by side with this one.</p>` : ''}<button class="btn" data-go="r-questions">On to the questions</button>`; }
    } else if (S.mode === 'questions') {
      const q = S.qs[S.q], kind = { single: 'multiple choice', multi: 'multiple correct response', match: 'matching' }[q.type];
      head.innerHTML = `<small>Practice question ${S.q + 1} of ${S.qs.length} · ${kind}</small><h1 class="stem">${q.stem}</h1>`;
      const body = q.type === 'match' ? `<div class="match">${q.left.map((l, i) => `<label><span>${l}</span><select data-match="${i}" ${S.qdone ? 'disabled' : ''} class="${S.qdone ? (+S.qmatch[i] === q.correct[i] ? 'right' : 'wrong') : ''}"><option value="">Choose</option>${(S.qorder ||= shuffle(q.right.map((_, j) => j))).map((j) => `<option value="${j}" ${+S.qmatch[i] === j && S.qmatch[i] !== undefined && S.qmatch[i] !== '' ? 'selected' : ''}>${q.right[j]}</option>`).join('')}</select>${S.qdone && +S.qmatch[i] !== q.correct[i] ? `<em>${q.right[q.correct[i]]}</em>` : ''}</label>`).join('')}</div>`
        : `<div class="opts">${q.options.map((o, i) => `<button class="opt ${S.qsel.has(i) ? 'sel' : ''} ${S.qdone ? (q.correct.includes(i) ? 'right' : S.qsel.has(i) ? 'wrong' : '') : ''}" data-opt="${i}" ${S.qdone ? 'disabled' : ''}>${o}</button>`).join('')}</div>`;
      const ready = q.type === 'match' ? q.left.every((_, i) => S.qmatch[i] !== undefined && S.qmatch[i] !== '') : S.qsel.size > 0;
      h = `<p class="fine">Original practice question written for Overlord. Not an NBCRNA item, and not a predictor of any exam score.</p>${body}
        ${S.qdone ? `<div class="verdict ${S.qres[S.q] ? 'yes' : 'no'}">${S.qres[S.q] ? 'Correct' : 'Not this time'}</div><p>${q.why}</p>${srcHtml(q.src)}<button class="btn" data-act="qnext">${S.q === S.qs.length - 1 ? 'See how you did' : 'Next question'}</button>` : `<button class="btn" data-act="qsubmit" ${ready ? '' : 'disabled'}>Submit</button>`}`;
    } else if (S.mode === 'results') {
      const R = S.results || [], own = R.filter((r) => !r.assist), by = (k) => own.filter((r) => r.it.kind === k), n = (xs) => `${xs.filter((r) => r.correct).length} of ${xs.length}`, missed = R.filter((r) => !r.correct), sureWrong = missed.filter((r) => r.conf === 3).length, regional = S.run === 'regional', c = S.caseResult, helped = R.filter((r) => r.assist).length, retried = R.filter((r) => r.retry).length;
      head.innerHTML = `<small>Results</small><h1>${S.pass ? 'You know your way around.' : 'Closer than last time.'}</h1><p>${S.pass ? 'Done without labels.' : 'What you missed is scheduled to come back.'}</p>`;
      const cells = regional ? [[n(by('apply')), 'identified'], [c ? (c.okApproach ? 'Yes' : 'No') : '–', 'case approach'], [`${S.qres.filter(Boolean).length} of ${S.qres.length}`, 'questions']] : [[n(by('find')), 'named'], [n(by('relation')), 'worked out'], [n(by('apply')), 'applied']].filter((x) => !x[0].endsWith('of 0'));
      h = `<div class="two">${cells.map(([b, s]) => `<div><b>${b}</b><span>${s}, unaided</span></div>`).join('')}</div>
        <h3>What you showed</h3><p>${missed.length ? `Back tomorrow: ${[...new Set(missed.map((r) => lc(r.it.answer[0])))].join(', ')}.` : 'Nothing missed. These return in six days to check they stuck.'}${sureWrong ? ` You were sure and wrong ${sureWrong === 1 ? 'once' : sureWrong + ' times'}.` : ''}${regional && c && !c.reasonsRight ? ' The case comes back too: one of your reasons was off.' : ''}</p>
        ${helped || retried ? `<p class="fine">${helped ? `${helped} answered with a hint. ` : ''}${retried ? `${retried} tried a second time after feedback. ` : ''}Those are kept as assisted work and are not counted above.</p>` : ''}
        <h3>What it added</h3><p>${S.earned.items.length ? S.earned.items.join('. ') + '.' : S.pass ? 'Nothing new this time: you already hold what this earns.' : 'Nothing yet. Three in four unaided adds the specimen to your studio.'}</p>
        <p class="fine">What you hold shows what you earned. The lines above it show what you demonstrated, today, on this model. Neither is a clinical competence or an exam score.</p>
        <button class="btn" data-go="exit">${S.earned.items.length ? 'Step back: your studio is across the court' : 'Step back from the exhibit'}</button><button class="btn alt" data-go="${regional ? 'r-intro' : S.run === 'review' ? 'menu' : 'challenge'}">${S.run === 'review' ? 'Exhibit menu' : 'Go again'}</button>`;
    }
    if (TOUCH) { h = h.replace(/\bClick\b/g, 'Tap').replace(/\bclick\b/g, 'tap').replace(/\bSelect\b(?! every)/g, 'Tap').replace('scroll or pinch', 'pinch'); head.innerHTML = head.innerHTML.replace(/\bClick\b/g, 'Tap'); }
    panel.innerHTML = h; panel.scrollTop = 0;
    panel.querySelectorAll('[data-go]').forEach((b) => b.onclick = () => { sfx('tap'); b.dataset.go === 'exit' ? leave() : go(b.dataset.go); });
    const on = (sel, fn) => { const b = panel.querySelector(sel); if (b) b.onclick = fn; };
    on('[data-act=names]', () => { S.names = !S.names; S.revealed = S.names; draw(); }); on('[data-act=reveal]', () => { S.revealed = true; draw(); });
    on('[data-act=isolate]', () => { atlas.isolate(atlas.isIsolated() ? null : [S.picked]); draw(); }); on('[data-act=hide]', () => { atlas.hide(S.picked); S.picked = null; draw(); }); on('[data-act=focus]', () => atlas.focus(S.picked));
    on('[data-act=stim]', () => { const r = STIM[S.picked]; sfx(r ? 'correct' : 'tap'); S.stim = r ? `<b>Stimulated.</b> ${r.says} <span>${cite(r.src)[0]}</span>` : '<b>Stimulated.</b> No response for this structure is stated in the sources checked so far, so none is shown.'; draw(); });
    on('[data-act=next]', () => { if (S.step === LESSON.length - 1) { state.game.lessonDone = true; persist(); go('menu'); } else { S.step++; S.prog = []; S.done = false; S.nudge = ''; applyStep(); draw(); } });
    panel.querySelectorAll('[data-conf]').forEach((b) => b.onclick = () => answer(+b.dataset.conf));
    on('[data-act=inext]', () => { if (S.i === S.items.length - 1) afterItems(); else { S.i++; presentItem(); draw(); } });
    on('[data-act=iretry]', () => { presentItem(true); sfx('tap'); draw(); }); on('[data-act=hint]', () => { S.hint = true; draw(); });
    on('[data-act=fplay]', () => { if (film.playing) { film.playing = false; vo.stop(); } else { if (film.t >= FILM.seconds - 0.05) { film.t = 0; film.cue = -1; film.pred = {}; } film.playing = true; filmApply(film.t); { const c = FILM.cues[cueAt(film.t)]; speak(c.say, Math.max(0, film.t - c.t)); } } draw(); });
    panel.querySelectorAll('[data-cue]').forEach((b) => b.onclick = () => { film.playing = false; film.t = FILM.cues[+b.dataset.cue].t; filmApply(film.t, true); draw(); });
    panel.querySelectorAll('[data-pred]').forEach((b) => b.onclick = () => { film.pred[film.cue] = +b.dataset.pred; film.t = FILM.cues[film.cue + 1]?.t ?? FILM.seconds; film.playing = true; sfx('tap'); filmApply(film.t); });
    const fr = panel.querySelector('#fRange'); film.ui = fr ? { range: fr, time: panel.querySelector('#fTime') } : null; if (fr) fr.oninput = () => { film.playing = false; vo.stop(); film.t = +fr.value; filmApply(film.t, true); film.ui.time.textContent = mmss(film.t) + ' / ' + mmss(FILM.seconds); }; if (fr) fr.onchange = () => draw();
    const note = panel.querySelector('#note'); if (note) note.onchange = () => { const v = note.value.trim().slice(0, 300); if (v) state.game.notes[S.picked] = v; else delete state.game.notes[S.picked]; persist(); };
    on('[data-act=nprev]', () => { S.playing = false; narrStep(S.n - 1); }); on('[data-act=nnext]', () => { S.playing = false; narrStep(S.n + 1); }); on('[data-act=nvoice]', () => { S.voice = !S.voice; if (!S.voice) vo.stop(); draw(); });
    on('[data-act=nplay]', () => { if (S.playing) { S.playing = false; clearTimeout(narrT); vo.stop(); draw(); } else { S.playing = true; narrStep(S.n === NARRATION.length - 1 ? 0 : S.n); } });
    panel.querySelectorAll('[data-level]').forEach((b) => b.onclick = () => pickLevel(b.dataset.level));
    on('[data-act=ccommit]', () => { S.cphase = 'reasons'; sfx('tap'); draw(); });
    panel.querySelectorAll('[data-reason]').forEach((b) => b.onclick = () => { const i = +b.dataset.reason; S.rsel.has(i) ? S.rsel.delete(i) : S.rsel.add(i); draw(); });
    on('[data-act=creasons]', () => { S.cphase = 'explain'; draw(); });
    const fin = (typed) => { S.typed = typed; if (typed) (state.learning.recall ||= []).push({ t: Date.now(), item: S.case.id, text: typed.slice(0, 400) }); gradeCase(); S.cphase = 'feedback'; draw(); };
    on('[data-act=cexplain]', () => fin((panel.querySelector('#why').value || '').trim())); on('[data-act=cskip]', () => fin(''));
    panel.querySelectorAll('[data-self]').forEach((b) => b.onclick = () => { recordAttempt(state, { objective: 'regional.case.' + S.case.id + '.explain', outline: S.case.outline, item: S.case.id + ':explain', evidence: 'recalled (self-rated)', correct: b.dataset.self === '1', confidence: 2, picked: 'self', where: api.where }); const at = state.game.cases[S.case.id]?.attempts; if (at && at.length) at[at.length - 1].self = b.dataset.self === '1'; persist(); b.parentElement.innerHTML = '<p class="fine">Recorded as your own judgment, not a grade.</p>'; });
    panel.querySelectorAll('[data-opt]').forEach((b) => b.onclick = () => { const i = +b.dataset.opt, q = S.qs[S.q]; if (q.type === 'single') S.qsel = new Set([i]); else S.qsel.has(i) ? S.qsel.delete(i) : S.qsel.add(i); draw(); });
    panel.querySelectorAll('[data-match]').forEach((s) => s.onchange = () => { S.qmatch[+s.dataset.match] = s.value; draw(); });
    on('[data-act=qsubmit]', submitQ); on('[data-act=qnext]', () => { if (S.q === S.qs.length - 1) go('results'); else { S.q++; S.qsel = new Set(); S.qmatch = {}; S.qorder = null; S.qdone = false; draw(); } });
  }
  function leave() { clearTimeout(narrT); vo.stop(); onExit(); }
  atlas.setRoom('dark'); document.body.dataset.room = 'dark'; go('menu');
  return Object.assign(api, { voice: vo, go, state: S, film, outlineSummary: () => Object.entries(OUTLINE) });
}
