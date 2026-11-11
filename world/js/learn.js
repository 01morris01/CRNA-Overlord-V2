// learn.js: everything that happens inside Anatomy Hall.
//   The brachial plexus:   lesson (6 steps)  ·  challenge (find and work-it-out items, no labels)  ·  explore
//   Four ways in:          narrated explanation  ·  explore the four levels  ·  identify  ·  case  ·  questions
//   Review:                whatever is due, from both, first
// Scoring is plain rules on the id of what was clicked or chosen. No AI decides anything here.
import { STRUCTURES, SOURCES, LAYERS, LESSON, CHALLENGE, CHALLENGE_LENGTH, VIEWS_FOR_CHALLENGE, MODEL_NOTE, CHECK_STATUS, STIM, OUTLINE } from '../data/plexus.js';
import { LEVELS, LEVEL_ORDER, NARRATION, IDENTIFY, IDENTIFY_LENGTH, CASES, QUESTIONS, QUESTIONS_LENGTH, DISCLAIMER } from '../data/regional.js';
import { recordAttempt, dueNow, save } from './save.js';
import { sfx } from './audio.js';

const TOUCH = matchMedia('(hover: none) and (pointer: coarse)').matches;
const cite = (keys = []) => [...new Set(keys)].map((k) => SOURCES[k]?.cite).filter(Boolean);
const srcHtml = (keys) => { const c = cite(keys); return c.length ? `<details class="src"><summary>Source${c.length > 1 ? 's' : ''}, read in context</summary>${c.map((x) => `<p>${x}</p>`).join('')}<p class="chk">${CHECK_STATUS}</p></details>` : ''; };
const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const ORIGIN = { built: ['Built for Overlord', 'This structure is not in the source model. It was built from the model\'s own landmarks to match the cited description.'], corrected: ['Corrected from the source model', 'The source model attached or placed this differently from the cited description. It was moved to match.'] };

export function mountLearn({ atlas, state, els, onExit, onReward }) {
  const { panel, bar, tip, labels, head } = els, cv = atlas.renderer.domElement;
  const S = { mode: 'menu', names: true, peel: false, voice: true };
  const persist = () => save(state), nameOf = (id) => atlas.nameOf(id), lc = (id) => nameOf(id).replace(/^(C\d|T\d)/, (m) => m).replace(/^([A-Z])(?![0-9])/, (m) => m.toLowerCase());
  const P = (state.game.progress ||= {}), rewards = state.game.rewards;

  // ---------- labels beside structures, nudged apart ----------
  function setLabels(ids = [], extra = {}) { labels.innerHTML = ids.map((id) => `<span data-id="${id}">${extra[id] || nameOf(id)}</span>`).join(''); }
  atlas.onFrame = () => { const live = [];
    for (const el of labels.children) { const id = el.dataset.id, p = id.startsWith('marker:') ? atlas.markerScreen(id.slice(7)) : atlas.screenOf(id); const on = p && !p.behind && (p.alpha ?? 1) > 0.5; el.style.opacity = on ? 1 : 0; if (on) live.push({ el, x: p.x, y: p.y }); }
    live.sort((a, b) => a.y - b.y); for (let i = 1; i < live.length; i++) if (live[i].y - live[i - 1].y < 27 && Math.abs(live[i].x - live[i - 1].x) < 170) live[i].y = live[i - 1].y + 27;
    for (const l of live) l.el.style.transform = `translate(${l.x}px, ${l.y}px) translate(16px, -50%)`; };

  // ---------- the bar ----------
  let room = 'studio';
  function drawBar() {
    bar.innerHTML = `<div class="grp">${LAYERS.map(([k, n]) => `<button class="chip ${atlas.layerIsOn(k) ? 'on' : ''}" data-layer="${k}"><i class="dot ${k}"></i>${n}</button>`).join('')}</div>
      <div class="grp">${[['whole', 'Whole'], ['anterolateral', 'Front'], ['lateral', 'Side'], ['posterior', 'Back'], ['superior', 'Above']].map(([k, n]) => `<button class="chip" data-view="${k}">${n}</button>`).join('')}</div>
      <div class="grp"><button class="chip ${S.peel ? 'on warm' : ''}" data-act="peel" title="When on, selecting a structure removes it">Peel</button><button class="chip" data-act="restore">Restore all</button><button class="chip" data-act="room">${room === 'studio' ? 'Dark room' : 'Studio'}</button></div>`;
    bar.querySelectorAll('[data-layer]').forEach((b) => b.onclick = () => { atlas.setLayer(b.dataset.layer, !atlas.layerIsOn(b.dataset.layer)); sfx('tap'); drawBar(); });
    bar.querySelectorAll('[data-view]').forEach((b) => b.onclick = () => atlas.view(b.dataset.view));
    bar.querySelector('[data-act=peel]').onclick = () => { S.peel = !S.peel; drawBar(); };
    bar.querySelector('[data-act=restore]').onclick = () => { atlas.showAll(); if (S.mode === 'lesson') applyStep(false); drawBar(); };
    bar.querySelector('[data-act=room]').onclick = () => { room = room === 'studio' ? 'dark' : 'studio'; atlas.setRoom(room); document.body.dataset.room = room; drawBar(); };
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
  function presentItem() {   // a different angle and a different dressing each time, and never a label or a highlight
    S.phase = 'ask'; S.picked = null; S.peel = false; atlas.setMarkers([]); atlas.showAll(); atlas.glow([]); atlas.select(null); setLabels([]); atlas.ghost([]); atlas.isolate(null);
    const dress = Math.random(); if (dress > 0.7) atlas.setLayer('vein', false); else if (dress > 0.45) atlas.setLayer('airway', false);
    atlas.view(VIEWS_FOR_CHALLENGE[Math.floor(Math.random() * VIEWS_FOR_CHALLENGE.length)], 1.0, 0.5); drawBar();
  }
  function answer(conf) {
    const it = S.items[S.i], correct = it.answer.includes(S.picked);
    recordAttempt(state, { objective: OBJ(it), outline: it.outline, item: it.ask, evidence: it.kind === 'find' ? 'identified' : it.kind === 'relation' ? 'related' : 'applied', correct, confidence: conf, picked: S.picked });
    S.results.push({ it, correct, conf, picked: S.picked }); persist(); S.phase = 'feedback'; sfx(correct ? 'correct' : 'wrong');
    atlas.showAll(); atlas.ghost(['muscle']); atlas.glow(it.answer); atlas.select(correct ? null : S.picked); setLabels(correct ? [S.picked] : [it.answer[0], S.picked]); atlas.focus(correct ? S.picked : it.answer[0]); drawBar(); draw();
  }
  const mistake = (it, picked) => { const p = STRUCTURES[picked], a = STRUCTURES[it.answer[0]]; return `<p>You selected the <b>${lc(picked)}</b>.${p?.tell ? ' ' + p.tell : ''}</p><p><b>What you were looking for:</b> ${a?.tell || ''} ${it.why}</p>`; };

  // ---------- regional: narration ----------
  let narrT = 0, speaking = null;
  const levelAt = (k) => { const L = LEVELS[k]; return L.anchorAt === 'top' ? atlas.topOf(L.anchor) : atlas.centreOf(L.anchor); };
  const allMarkers = () => LEVEL_ORDER.map((k) => ({ id: k, at: levelAt(k) }));
  function speak(text) { try { speechSynthesis.cancel(); if (!S.voice || !('speechSynthesis' in window)) return; speaking = new SpeechSynthesisUtterance(text); speaking.rate = 1.0; speechSynthesis.speak(speaking); } catch (e) { /* no voice available: captions carry it */ } }
  function narrStep(i) {
    S.n = i; const st = NARRATION[i], L = st.level ? LEVELS[st.level] : null; clearTimeout(narrT);
    atlas.showAll(); atlas.ghost(L ? ['muscle'] : []); atlas.setMarkers(L ? [{ id: st.level, at: levelAt(st.level) }] : allMarkers()); atlas.glow(st.glow || (L ? L.show : [])); setLabels(L ? ['marker:' + st.level] : [], L ? { ['marker:' + st.level]: L.name } : {});
    atlas.view(L ? L.view : st.view || 'whole', 1.4); speak(st.say); if (S.playing) narrT = setTimeout(() => (i < NARRATION.length - 1 ? narrStep(i + 1) : (S.playing = false, draw())), st.ms); draw();
  }
  // ---------- regional: explore ----------
  function pickLevel(k) { S.level = k; (S.visited ||= new Set()).add(k); const L = LEVELS[k]; atlas.showAll(); atlas.ghost(['muscle']); atlas.glow(L.show); atlas.chooseMarker(k); atlas.view(L.view, 1.1); sfx('tap'); draw(); }
  // ---------- regional: case ----------
  function startCase() { const due = new Set(dueNow(state).map((d) => d.item)); const order = [...CASES].sort((a, b) => (due.has(b.id) - due.has(a.id)) || ((P.casesSeen?.[a.id] || 0) - (P.casesSeen?.[b.id] || 0))); S.case = order[0]; (P.casesSeen ||= {})[S.case.id] = (P.casesSeen[S.case.id] || 0) + 1;
    S.mode = 'r-case'; S.cphase = 'approach'; S.chosen = null; S.rsel = new Set(); S.reasonOrder = shuffle(S.case.reasons.map((_, i) => i)); S.typed = ''; atlas.showAll(); atlas.ghost([]); atlas.glow([]); setLabels([]); atlas.select(null); atlas.setMarkers(allMarkers()); atlas.chooseMarker(null); atlas.view('whole', 1.1, 0.35); document.body.dataset.learn = 'r-case'; drawBar(); draw(); }
  function gradeCase() {
    const c = S.case, [g] = c.grade[S.chosen], okApproach = g !== 'no', picks = S.reasonOrder.map((i) => ({ i, sel: S.rsel.has(i), truth: c.reasons[i][1] })), reasonsRight = picks.every((p) => p.sel === p.truth);
    recordAttempt(state, { objective: 'regional.case.' + c.id + '.approach', outline: c.outline, item: c.id, evidence: 'applied', correct: okApproach, confidence: 2, picked: S.chosen });
    recordAttempt(state, { objective: 'regional.case.' + c.id + '.reasons', outline: c.outline, item: c.id + ':reasons', evidence: 'applied', correct: reasonsRight, confidence: 2, picked: [...S.rsel].join(',') });
    S.caseResult = { okApproach, reasonsRight, g, picks }; persist(); sfx(okApproach && reasonsRight ? 'correct' : 'wrong');
    const best = Object.keys(c.grade).find((k) => c.grade[k][0] === 'best'); atlas.ghost(['muscle']); atlas.glow(LEVELS[best].show); atlas.chooseMarker(best); setLabels(LEVEL_ORDER.map((k) => 'marker:' + k), Object.fromEntries(LEVEL_ORDER.map((k) => ['marker:' + k, LEVELS[k].name]))); atlas.view(LEVELS[best].view, 1.2);
  }
  // ---------- questions ----------
  function startQuestions(pool, n, run) { const due = new Set(dueNow(state).map((d) => d.item)); S.qs = [...shuffle(pool.filter((q) => due.has(q.stem))), ...shuffle(pool.filter((q) => !due.has(q.stem)))].slice(0, n); S.q = 0; S.qsel = new Set(); S.qmatch = {}; S.qdone = false; S.qres = []; S.run = run; S.mode = 'questions';
    atlas.setMarkers([]); atlas.showAll(); atlas.glow([]); setLabels([]); atlas.ghost([]); atlas.view('whole'); document.body.dataset.learn = 'questions'; drawBar(); draw(); }
  function submitQ() { const q = S.qs[S.q]; let correct;
    if (q.type === 'match') correct = q.left.every((_, i) => +S.qmatch[i] === q.correct[i]); else { const sel = [...S.qsel].sort(), c = [...q.correct].sort(); correct = sel.length === c.length && sel.every((v, i) => v === c[i]); }
    recordAttempt(state, { objective: 'regional.q.' + q.stem.slice(0, 40), outline: q.outline, item: q.stem, evidence: 'recognised', correct, confidence: 2, picked: q.type === 'match' ? JSON.stringify(S.qmatch) : [...S.qsel].join(',') }); S.qres.push(correct); S.qdone = true; persist(); sfx(correct ? 'correct' : 'wrong'); draw(); }

  // ---------- results and rewards ----------
  function finishRun() {
    const R = S.results || [], right = R.filter((r) => r.correct).length, total = R.length, g = state.game, earned = { blocks: 0, items: [] }; let pass = false;
    if (S.run === 'plexus' || S.run === 'review') { pass = total > 0 && right >= Math.ceil(total * 0.75); earned.blocks = right * 2; g.inventory.plank += right * 2;
      if (S.run === 'plexus' && pass && !rewards.includes('nerve-stimulator')) { rewards.push('nerve-stimulator'); earned.items.push('A nerve stimulator. Clipped to your scrubs, on your workshop bench, and usable in Explore: select a cord and stimulate it'); }
      if (S.run === 'plexus' && pass && !rewards.includes('plexus-model')) { rewards.push('plexus-model'); g.inventory.plexus = (g.inventory.plexus || 0) + 1; earned.items.push('A plexus sculpture for your plot'); } }
    if (S.run === 'regional') { const c = S.caseResult || {}, q = S.qres.filter(Boolean).length; pass = right >= Math.ceil(total * 0.75) && c.okApproach; earned.blocks = right * 2 + q * 2 + (c.okApproach ? 4 : 0); g.inventory.coral = (g.inventory.coral || 0) + earned.blocks; P.regionalDone = (P.regionalDone || 0) + 1;
      if (pass && !rewards.includes('block-cap')) { rewards.push('block-cap'); earned.items.push('A regional scrub cap. Find it under Wearing when you change your character'); } }
    S.earned = earned; S.pass = pass; persist(); if (earned.items.length) sfx('reward'); onReward && onReward(earned);
  }

  function go(mode) {
    clearTimeout(narrT); try { speechSynthesis.cancel(); } catch (e) { /* none */ }
    S.mode = mode; S.picked = null; S.nudge = ''; S.stim = null; atlas.select(null); atlas.glow([]); setLabels([]); atlas.ghost([]); atlas.isolate(null); atlas.setMarkers([]);
    if (mode === 'menu' || mode === 'explore') { atlas.showAll(); if (mode === 'menu') atlas.view('whole'); }
    if (mode === 'lesson') { S.step = 0; S.prog = []; S.done = false; applyStep(); }
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
      head.innerHTML = `<small>Anatomy Hall · regional anesthesia</small><h1>The brachial plexus.</h1><p>Right side, neck to hand. Turn it, peel it, and select anything.</p>`;
      h = `${S.flash ? `<p class="nudge">${S.flash}</p>` : ''}${due ? `<button class="row go" data-go="review"><b>Review what is due</b><span>${due} ${due === 1 ? 'item' : 'items'} you missed or guessed, first.</span></button>` : ''}
        <h3>The plexus</h3>
        <button class="row ${!due && !g.lessonDone ? 'go' : ''}" data-go="lesson"><b>Lesson</b><span>Six steps. Roots to nerves. You act at every step.</span></button>
        <button class="row ${!due && g.lessonDone && !rewards.includes('nerve-stimulator') ? 'go' : ''}" data-go="challenge"><b>Challenge</b><span>${CHALLENGE_LENGTH} from ${CHALLENGE.length}: name it, or work it out. No labels, new angle each time.</span></button>
        <button class="row" data-go="explore"><b>Explore</b><span>Layers, isolate, names on or off${rewards.includes('nerve-stimulator') ? ', nerve stimulator' : ''}.</span></button>
        <h3>Four ways in: regional blocks</h3>
        <button class="row ${!due && rewards.includes('nerve-stimulator') && !P.regionalDone ? 'go' : ''}" data-go="r-intro"><b>${P.regionalDone ? 'Run it again' : 'Start'}</b><span>A narrated explanation, the four levels, identification, a case, questions.</span></button>
        ${P.regionalDone ? `<div class="tools"><button class="chip" data-go="r-explore">Levels</button><button class="chip" data-go="r-case">Case</button><button class="chip" data-go="r-questions">Questions</button></div>` : ''}
        <button class="row quiet" data-go="exit"><b>Back to the island</b></button><p class="fine">${MODEL_NOTE}</p><p class="fine">${SOURCES.ZA.cite}</p>`; S.flash = '';
    } else if (S.mode === 'explore') {
      head.innerHTML = `<small>Explore</small><h1>Turn it. Peel it.</h1><p>Select a structure. Switch names off to test yourself.</p>`;
      const id = S.picked, st = STRUCTURES[id], part = id && atlas.parts.get(id), o = part && ORIGIN[part.origin];
      h = `<div class="tools"><button class="chip ${S.names ? 'on' : ''}" data-act="names">Names ${S.names ? 'on' : 'off'}</button><button class="chip" data-go="menu">Done</button></div>`;
      if (!id) h += `<h2>Nothing selected.</h2><p>Drag to turn, scroll or pinch to zoom, click a structure.</p>`;
      else if (!S.revealed) h += `<h2>What is this?</h2><p>Decide, then check.</p><button class="btn" data-act="reveal">Reveal</button>`;
      else h += `<h2>${nameOf(id)}</h2><p class="lay"><i class="dot ${part.layer}"></i>${part.layer}${o ? ` · <span class="badge" title="${o[1]}">${o[0]}</span>` : ''}</p>${st?.fact ? `<p>${st.fact}</p>` : '<p class="fine">Named from the source model. No statement about it has been checked yet, so none is shown.</p>'}${o ? `<p class="fine">${o[1]} ${part.what ? 'What was done: ' + part.what + '.' : ''}</p>` : ''}${srcHtml(['ZA', ...(st?.src || [])])}
        ${S.stim ? `<p class="stim">${S.stim}</p>` : ''}<div class="tools"><button class="chip" data-act="isolate">${atlas.isIsolated() ? 'Show the rest' : 'Isolate'}</button><button class="chip" data-act="hide">Hide</button><button class="chip" data-act="focus">Centre</button>${rewards.includes('nerve-stimulator') && part.layer === 'nerve' ? '<button class="chip on warm" data-act="stim">Stimulate</button>' : ''}</div>`;
    } else if (S.mode === 'lesson') {
      const st = LESSON[S.step], last = S.step === LESSON.length - 1;
      head.innerHTML = `<small>Lesson · step ${S.step + 1} of ${LESSON.length}</small><h1>${st.title}</h1><p>${st.say}</p>`;
      h = `<div class="dots">${LESSON.map((_, i) => `<i class="${i < S.step ? 'past' : i === S.step ? 'now' : ''}"></i>`).join('')}</div><h2>${S.done ? 'Yes.' : st.do}</h2>${S.nudge && !S.done ? `<p class="nudge">${S.nudge}</p>` : ''}
        ${S.done ? `<button class="btn" data-act="next">${last ? 'Finish the lesson' : 'Next'}</button>` : ''}${srcHtml(st.src)}<button class="chip quiet" data-go="menu">Leave lesson</button>`;
    } else if (S.mode === 'items') {
      const it = S.items[S.i], kind = { find: 'name it', relation: 'work it out', apply: 'apply it' }[it.kind], runName = { plexus: 'Challenge', regional: 'Identify', review: 'Review' }[S.run];
      head.innerHTML = `<small>${runName} · ${S.i + 1} of ${S.items.length} · ${kind}</small><h1 class="${it.ask.length > 40 ? 'stem' : ''}">${it.ask}</h1><p>${S.phase === 'feedback' ? '' : 'No labels. Turn it and peel what is in your way.'}</p>`;
      if (S.phase === 'ask') h = `<h2>Select the structure.</h2><p>You can change your mind before you commit.</p>`;
      else if (S.phase === 'sure') h = `<h2>Selected. How sure are you?</h2><p>The name stays hidden until you commit.</p><div class="sure"><button class="btn alt" data-conf="1">Guess</button><button class="btn alt" data-conf="2">Think so</button><button class="btn" data-conf="3">Sure</button></div>`;
      else { const r = S.results[S.results.length - 1], last = S.i === S.items.length - 1;
        h = `<div class="verdict ${r.correct ? 'yes' : 'no'}">${r.correct ? 'Correct' : 'Not this time'}</div><h2>${nameOf(r.correct ? r.picked : it.answer[0])}</h2>${r.correct ? `<p>${it.why}</p>` : mistake(it, r.picked)}
          ${r.correct && r.conf === 1 ? '<p class="fine">Right, but a guess, so it comes back in two days.</p>' : !r.correct ? `<p class="fine">${r.conf === 3 ? 'You were sure. That is the kind to distrust. ' : ''}It comes back tomorrow.</p>` : ''}${srcHtml(['ZA', ...it.src])}
          <button class="btn" data-act="inext">${!last ? 'Next' : S.run === 'regional' ? 'On to the case' : 'See how you did'}</button>`; }
    } else if (S.mode === 'r-intro') {
      const st = NARRATION[S.n], voice = 'speechSynthesis' in window;
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
      head.innerHTML = `<small>Four ways in · case</small><h1 class="stem">${c.stem}</h1><p>${S.cphase === 'approach' ? 'The four rings are the four levels. They are not labelled.' : ''}</p>`;
      if (S.cphase === 'approach') h = `<h2>${S.chosen ? 'That level?' : 'Select the level you would choose.'}</h2><p>${S.chosen ? 'You can select another ring before you commit.' : 'Select a ring on the model.'}</p><button class="btn" data-act="ccommit" ${S.chosen ? '' : 'disabled'}>Commit</button>`;
      else if (S.cphase === 'reasons') h = `<h2>Which of these are true and support a choice here?</h2><p class="fine">Select every one that applies.</p><div class="opts">${S.reasonOrder.map((i) => `<button class="opt ${S.rsel.has(i) ? 'sel' : ''}" data-reason="${i}">${c.reasons[i][0]}</button>`).join('')}</div><button class="btn" data-act="creasons">Submit</button>`;
      else if (S.cphase === 'explain') h = `<h2>In one sentence: why that approach?</h2><textarea id="why" rows="3" placeholder="Type it before you look.">${S.typed}</textarea><button class="btn" data-act="cexplain">Compare with a model answer</button><button class="chip quiet" data-act="cskip">Skip</button>`;
      else { const r = S.caseResult, [gr, why] = c.grade[S.chosen], best = Object.keys(c.grade).find((k) => c.grade[k][0] === 'best');
        h = `<div class="verdict ${gr === 'no' ? 'no' : 'yes'}">${gr === 'best' ? 'The approach the source prefers' : gr === 'ok' ? 'Defensible' : 'Not this approach'}</div><h2>You chose ${LEVELS[S.chosen].name.toLowerCase()}.</h2><p>${why}</p>${gr !== 'best' ? `<p><b>${LEVELS[best].name}:</b> ${c.grade[best][1]}</p>` : ''}
          <h3>Your reasons</h3>${r.picks.map((p) => `<p class="reason ${p.sel === p.truth ? 'ok' : 'bad'}"><b>${p.sel === p.truth ? '✓' : '✗'}</b> ${c.reasons[p.i][0]} <span>${c.reasons[p.i][2]}${p.sel !== p.truth ? (p.truth ? ' You left it out.' : ' You selected it.') : ''}</span></p>`).join('')}
          ${S.typed ? `<h3>Your sentence</h3><p class="fine">"${S.typed.replace(/</g, '&lt;')}"</p><h3>A model answer</h3><p>${c.model}</p><div class="sure two-b"><button class="btn alt" data-self="0">I missed part of it</button><button class="btn" data-self="1">Mine said this</button></div>` : `<h3>A model answer</h3><p>${c.model}</p>`}${srcHtml(c.src)}
          <button class="btn" data-go="r-questions">On to the questions</button>`; }
    } else if (S.mode === 'questions') {
      const q = S.qs[S.q], kind = { single: 'multiple choice', multi: 'multiple correct response', match: 'matching' }[q.type];
      head.innerHTML = `<small>Practice question ${S.q + 1} of ${S.qs.length} · ${kind}</small><h1 class="stem">${q.stem}</h1>`;
      const body = q.type === 'match' ? `<div class="match">${q.left.map((l, i) => `<label><span>${l}</span><select data-match="${i}" ${S.qdone ? 'disabled' : ''} class="${S.qdone ? (+S.qmatch[i] === q.correct[i] ? 'right' : 'wrong') : ''}"><option value="">Choose</option>${(S.qorder ||= shuffle(q.right.map((_, j) => j))).map((j) => `<option value="${j}" ${+S.qmatch[i] === j && S.qmatch[i] !== undefined && S.qmatch[i] !== '' ? 'selected' : ''}>${q.right[j]}</option>`).join('')}</select>${S.qdone && +S.qmatch[i] !== q.correct[i] ? `<em>${q.right[q.correct[i]]}</em>` : ''}</label>`).join('')}</div>`
        : `<div class="opts">${q.options.map((o, i) => `<button class="opt ${S.qsel.has(i) ? 'sel' : ''} ${S.qdone ? (q.correct.includes(i) ? 'right' : S.qsel.has(i) ? 'wrong' : '') : ''}" data-opt="${i}" ${S.qdone ? 'disabled' : ''}>${o}</button>`).join('')}</div>`;
      const ready = q.type === 'match' ? q.left.every((_, i) => S.qmatch[i] !== undefined && S.qmatch[i] !== '') : S.qsel.size > 0;
      h = `<p class="fine">Original practice question written for Overlord. Not an NBCRNA item, and not a predictor of any exam score.</p>${body}
        ${S.qdone ? `<div class="verdict ${S.qres[S.q] ? 'yes' : 'no'}">${S.qres[S.q] ? 'Correct' : 'Not this time'}</div><p>${q.why}</p>${srcHtml(q.src)}<button class="btn" data-act="qnext">${S.q === S.qs.length - 1 ? 'See how you did' : 'Next question'}</button>` : `<button class="btn" data-act="qsubmit" ${ready ? '' : 'disabled'}>Submit</button>`}`;
    } else if (S.mode === 'results') {
      const R = S.results || [], by = (k) => R.filter((r) => r.it.kind === k), n = (xs) => `${xs.filter((r) => r.correct).length} of ${xs.length}`, missed = R.filter((r) => !r.correct), sureWrong = missed.filter((r) => r.conf === 3).length, regional = S.run === 'regional', c = S.caseResult;
      head.innerHTML = `<small>Results</small><h1>${S.pass ? 'You know your way around.' : 'Closer than last time.'}</h1><p>${S.pass ? 'Done without labels.' : 'What you missed is scheduled to come back.'}</p>`;
      const cells = regional ? [[n(by('apply')), 'identified'], [c ? (c.okApproach ? 'Yes' : 'No') : '–', 'case approach'], [`${S.qres.filter(Boolean).length} of ${S.qres.length}`, 'questions']] : [[n(by('find')), 'named'], [n(by('relation')), 'worked out'], [n(by('apply')), 'applied']].filter((x) => !x[0].endsWith('of 0'));
      h = `<div class="two">${cells.map(([b, s]) => `<div><b>${b}</b><span>${s}</span></div>`).join('')}</div>
        <h3>What you know</h3><p>${missed.length ? `Back tomorrow: ${[...new Set(missed.map((r) => lc(r.it.answer[0])))].join(', ')}.` : 'Nothing missed. These return in six days to check they stuck.'}${sureWrong ? ` You were sure and wrong ${sureWrong === 1 ? 'once' : sureWrong + ' times'}.` : ''}${regional && c && !c.reasonsRight ? ' The case comes back too: one of your reasons was off.' : ''}</p>
        <h3>What you earned</h3><p>${S.earned.blocks} ${regional ? 'coral' : 'timber'} blocks for your plot.${S.earned.items.length ? ' ' + S.earned.items.join('. ') + '.' : S.pass ? '' : ' Three in four correct earns the item.'}</p>
        <p class="fine">Blocks and items show what you earned. The lines above them show what you know. They are recorded separately.</p>
        <button class="btn" data-go="exit">Back to the island</button><button class="btn alt" data-go="${regional ? 'r-intro' : S.run === 'review' ? 'menu' : 'challenge'}">${S.run === 'review' ? 'Hall menu' : 'Go again'}</button>`;
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
    on('[data-act=nprev]', () => { S.playing = false; narrStep(S.n - 1); }); on('[data-act=nnext]', () => { S.playing = false; narrStep(S.n + 1); }); on('[data-act=nvoice]', () => { S.voice = !S.voice; if (!S.voice) try { speechSynthesis.cancel(); } catch (e) { /* none */ } draw(); });
    on('[data-act=nplay]', () => { if (S.playing) { S.playing = false; clearTimeout(narrT); try { speechSynthesis.cancel(); } catch (e) { /* none */ } draw(); } else { S.playing = true; narrStep(S.n === NARRATION.length - 1 ? 0 : S.n); } });
    panel.querySelectorAll('[data-level]').forEach((b) => b.onclick = () => pickLevel(b.dataset.level));
    on('[data-act=ccommit]', () => { S.cphase = 'reasons'; sfx('tap'); draw(); });
    panel.querySelectorAll('[data-reason]').forEach((b) => b.onclick = () => { const i = +b.dataset.reason; S.rsel.has(i) ? S.rsel.delete(i) : S.rsel.add(i); draw(); });
    on('[data-act=creasons]', () => { S.cphase = 'explain'; draw(); });
    const fin = (typed) => { S.typed = typed; if (typed) (state.learning.recall ||= []).push({ t: Date.now(), item: S.case.id, text: typed.slice(0, 400) }); gradeCase(); S.cphase = 'feedback'; draw(); };
    on('[data-act=cexplain]', () => fin((panel.querySelector('#why').value || '').trim())); on('[data-act=cskip]', () => fin(''));
    panel.querySelectorAll('[data-self]').forEach((b) => b.onclick = () => { recordAttempt(state, { objective: 'regional.case.' + S.case.id + '.explain', outline: S.case.outline, item: S.case.id + ':explain', evidence: 'recalled (self-rated)', correct: b.dataset.self === '1', confidence: 2, picked: 'self' }); persist(); b.parentElement.innerHTML = '<p class="fine">Recorded as your own judgement, not a grade.</p>'; });
    panel.querySelectorAll('[data-opt]').forEach((b) => b.onclick = () => { const i = +b.dataset.opt, q = S.qs[S.q]; if (q.type === 'single') S.qsel = new Set([i]); else S.qsel.has(i) ? S.qsel.delete(i) : S.qsel.add(i); draw(); });
    panel.querySelectorAll('[data-match]').forEach((s) => s.onchange = () => { S.qmatch[+s.dataset.match] = s.value; draw(); });
    on('[data-act=qsubmit]', submitQ); on('[data-act=qnext]', () => { if (S.q === S.qs.length - 1) go('results'); else { S.q++; S.qsel = new Set(); S.qmatch = {}; S.qorder = null; S.qdone = false; draw(); } });
  }
  function leave() { clearTimeout(narrT); try { speechSynthesis.cancel(); } catch (e) { /* none */ } onExit(); }
  go('menu');
  return { go, state: S, outlineSummary: () => Object.entries(OUTLINE) };
}
