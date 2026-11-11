// learn.js: what happens inside Anatomy Hall. Four activities on the same specimen:
//   explore   turn it, peel layers, isolate, click to read (or hide names and test yourself)
//   lesson    six steps; each ends with something you do to the model
//   challenge nothing is labelled; you click the structure, say how sure you are, then find out
//   questions three original practice questions with rationale and sources
// Scoring is plain rules on the clicked object id. No AI decides anything here.
import { STRUCTURES, SOURCES, LAYERS, LESSON, CHALLENGE, CHALLENGE_LENGTH, QUESTIONS, MODEL_GAPS, CHECK_STATUS } from '../data/plexus.js';
import { recordAttempt, dueNow, save } from './save.js';

const OBJ = (id) => 'regional.brachial-plexus.' + id;
const cite = (keys = []) => keys.map((k) => SOURCES[k]?.cite).filter(Boolean);
const srcHtml = (keys) => { const c = cite(keys); return c.length ? `<details class="src"><summary>Source${c.length > 1 ? 's' : ''}</summary>${c.map((x) => `<p>${x}</p>`).join('')}<p class="chk">${CHECK_STATUS}</p></details>` : ''; };
const TOUCH = matchMedia('(hover: none) and (pointer: coarse)').matches;
const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

export function mountLearn({ atlas, state, els, onExit, onReward }) {
  const { panel, bar, tip, labels, head } = els;
  const S = { mode: 'menu', names: true, peel: false, step: 0, prog: [], done: false, items: [], i: 0, picked: null, phase: 'ask', results: [], q: 0, qsel: new Set(), qdone: false, qres: [] };
  const cv = atlas.renderer.domElement;
  const persist = () => save(state);

  // ---------- labels that follow structures ----------
  let labelled = [];
  function setLabels(ids = []) { labelled = ids; labels.innerHTML = ids.map((id) => `<span data-id="${id}">${atlas.nameOf(id)}</span>`).join(''); }
  atlas.onFrame = () => {   // labels sit beside their structure and are nudged apart so they never stack
    const live = []; for (const el of labels.children) { const p = atlas.screenOf(el.dataset.id); const on = p && !p.behind && p.alpha > 0.5; el.style.opacity = on ? 1 : 0; if (on) live.push({ el, x: p.x, y: p.y }); }
    live.sort((a, b) => a.y - b.y); for (let i = 1; i < live.length; i++) if (live[i].y - live[i - 1].y < 27 && Math.abs(live[i].x - live[i - 1].x) < 150) live[i].y = live[i - 1].y + 27;
    for (const l of live) l.el.style.transform = `translate(${l.x}px, ${l.y}px) translate(14px, -50%)`;
  };

  // ---------- the bar: layers, views, room ----------
  let room = 'studio';
  function drawBar() {
    bar.innerHTML = `<div class="grp">${LAYERS.map(([k, n]) => `<button class="chip ${atlas.layerIsOn(k) ? 'on' : ''}" data-layer="${k}"><i class="dot ${k}"></i>${n}</button>`).join('')}</div>
      <div class="grp">${[['whole', 'Whole'], ['anterolateral', 'Front'], ['lateral', 'Side'], ['posterior', 'Back'], ['superior', 'Above']].map(([k, n]) => `<button class="chip" data-view="${k}">${n}</button>`).join('')}</div>
      <div class="grp"><button class="chip ${S.peel ? 'on warm' : ''}" data-act="peel" title="When on, clicking a structure removes it">Peel</button><button class="chip" data-act="restore">Restore all</button><button class="chip" data-act="room">${room === 'studio' ? 'Dark room' : 'Studio'}</button></div>`;
    bar.querySelectorAll('[data-layer]').forEach((b) => b.onclick = () => { atlas.setLayer(b.dataset.layer, !atlas.layerIsOn(b.dataset.layer)); drawBar(); });
    bar.querySelectorAll('[data-view]').forEach((b) => b.onclick = () => atlas.view(b.dataset.view));
    bar.querySelector('[data-act=peel]').onclick = () => { S.peel = !S.peel; drawBar(); };
    bar.querySelector('[data-act=restore]').onclick = () => { const keepGhost = S.mode === 'lesson'; atlas.showAll(); if (keepGhost) applyStep(false); drawBar(); };
    bar.querySelector('[data-act=room]').onclick = () => { room = room === 'studio' ? 'dark' : 'studio'; atlas.setRoom(room); document.body.dataset.room = room; drawBar(); };
  }

  // ---------- pointer: a click is a press that did not turn into a drag ----------
  let down = null;
  cv.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; });
  cv.addEventListener('pointerup', (e) => { if (!down) return; const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y), dt = performance.now() - down.t; down = null; if (moved < 7 && dt < 600) click(e); });
  cv.addEventListener('pointermove', (e) => {
    if (e.buttons) { tip.classList.remove('on'); return; }
    const id = atlas.pick(e); atlas.hover(id); cv.style.cursor = id ? 'pointer' : 'grab';
    const show = id && namesShown(); tip.classList.toggle('on', !!show); if (show) { tip.textContent = atlas.nameOf(id); tip.style.left = e.clientX + 'px'; tip.style.top = e.clientY + 'px'; }
  });
  cv.addEventListener('pointerleave', () => { tip.classList.remove('on'); atlas.hover(null); });
  const namesShown = () => (S.mode === 'explore' && S.names) || S.mode === 'lesson' || S.mode === 'menu';
  function click(e) {
    const id = atlas.pick(e);
    if (S.peel && id && S.mode !== 'questions') { atlas.hide(id); if (S.mode === 'lesson') lessonClick(id, true); return; }
    if (S.mode === 'explore' || S.mode === 'menu') { if (S.mode === 'menu' && id) go('explore'); atlas.select(id); S.picked = id; S.revealed = S.names; draw(); }
    else if (S.mode === 'lesson') lessonClick(id, false);
    else if (S.mode === 'challenge' && S.phase !== 'feedback' && id) { S.picked = id; S.phase = 'sure'; atlas.select(id); draw(); }
  }

  // ---------- lesson ----------
  function applyStep(move = true) {
    const st = LESSON[S.step]; atlas.showAll(); for (const id of st.hide || []) atlas.hide(id);
    atlas.ghost(st.ghost || []); atlas.glow(st.glow || []); setLabels(st.label || []); atlas.select(null); if (move) atlas.view(st.view); drawBar();
  }
  function lessonClick(id, peeled) {
    if (S.done) return; const st = LESSON[S.step], u = st.until; let ok = false, nudge = '';
    if (u.hide) { if (id === u.hide) { atlas.hide(id); ok = true; } else if (id) nudge = `That is the ${atlas.nameOf(id).toLowerCase()}. The one in the way is the long strap running up to the skull.`; }
    else if (peeled) return;
    else if (u.pick) { if (u.pick.includes(id)) ok = true; else if (id) nudge = `That is the ${atlas.nameOf(id).toLowerCase()}. Not that one.`; }
    else if (u.order) { const want = u.order[S.prog.length]; if (id === want) { S.prog.push(id); ok = S.prog.length === u.order.length; if (!ok) nudge = `Yes: ${atlas.nameOf(id).toLowerCase()}. Next one down.`; } else if (id) nudge = `That is the ${atlas.nameOf(id).toLowerCase()}. Start with the highest and work down.`; }
    else if (u.all) { if (u.all.includes(id)) { if (!S.prog.includes(id)) S.prog.push(id); ok = S.prog.length === u.all.length; if (!ok) nudge = `Yes: ${atlas.nameOf(id).toLowerCase()}. One more.`; } else if (id) nudge = `The ${atlas.nameOf(id).toLowerCase()} does not come from the posterior cord.`; }
    if (ok) { S.done = true; atlas.glow(u.pick || u.order || u.all || []); }
    S.nudge = nudge; draw();
  }

  // ---------- challenge ----------
  function buildChallenge() {
    const due = new Set(dueNow(state).map((d) => d.item)), first = CHALLENGE.filter((c) => due.has(c.ask));
    const rest = shuffle(CHALLENGE.filter((c) => !due.has(c.ask))), need = CHALLENGE_LENGTH - Math.min(first.length, CHALLENGE_LENGTH);
    const applies = rest.filter((c) => c.kind === 'apply').slice(0, Math.ceil(need / 2)), finds = rest.filter((c) => c.kind === 'find').slice(0, need - applies.length);
    return [...shuffle(first).slice(0, CHALLENGE_LENGTH), ...shuffle([...applies, ...finds])].slice(0, CHALLENGE_LENGTH);
  }
  function answer(conf) {
    const it = S.items[S.i], correct = it.answer.includes(S.picked);
    recordAttempt(state, { objective: OBJ(it.answer[0]), item: it.ask, evidence: it.kind === 'find' ? 'identified' : 'applied', correct, confidence: conf, picked: S.picked });
    S.results.push({ it, correct, conf, picked: S.picked }); persist(); S.phase = 'feedback';
    atlas.showAll(); atlas.ghost(['muscle']); atlas.glow(it.answer); atlas.select(correct ? null : S.picked); setLabels(correct ? it.answer : [...it.answer, S.picked]); atlas.focus(it.answer[0]); drawBar(); draw();
  }

  // ---------- questions ----------
  function submitQ() {
    const q = QUESTIONS[S.q], sel = [...S.qsel].sort(), correct = sel.length === q.correct.length && sel.every((v, i) => v === [...q.correct].sort()[i]);
    recordAttempt(state, { objective: 'regional.brachial-plexus.q' + S.q, item: q.stem, evidence: 'recognised', correct, confidence: 2, picked: sel.join(',') });
    S.qres.push(correct); S.qdone = true; persist(); draw();
  }

  // ---------- results and reward ----------
  function finish() {
    const right = S.results.filter((r) => r.correct).length, total = S.results.length, pass = right >= Math.ceil(total * 0.75);
    const g = state.game, earned = { blocks: right * 2, items: [] };
    g.inventory.plank += right * 2;
    if (pass && !g.rewards.includes('nerve-stimulator')) { g.rewards.push('nerve-stimulator'); earned.items.push('Nerve stimulator, clipped to your scrubs'); }
    if (pass && !g.rewards.includes('plexus-model')) { g.rewards.push('plexus-model'); g.inventory.plexus = (g.inventory.plexus || 0) + 1; earned.items.push('A brachial plexus model you can stand on your plot'); }
    S.earned = earned; S.pass = pass; persist(); onReward && onReward(earned);
  }

  function go(mode) {
    S.mode = mode; S.picked = null; S.nudge = ''; atlas.select(null); atlas.glow([]); setLabels([]); atlas.ghost([]); atlas.isolate(null);
    if (mode === 'menu' || mode === 'explore') { atlas.showAll(); if (mode === 'menu') atlas.view('whole'); }
    if (mode === 'lesson') { S.step = 0; S.prog = []; S.done = false; applyStep(); }
    if (mode === 'challenge') { S.items = buildChallenge(); S.i = 0; S.results = []; S.phase = 'ask'; S.peel = false; atlas.showAll(); atlas.view('whole'); }
    if (mode === 'questions') { S.q = 0; S.qsel = new Set(); S.qdone = false; S.qres = []; atlas.showAll(); atlas.view('whole'); }
    if (mode === 'results') finish();
    document.body.dataset.learn = mode; drawBar(); draw();
  }

  function draw() {
    const due = dueNow(state).length, g = state.game; let h = '';
    if (S.mode === 'menu') {
      head.innerHTML = `<small>Anatomy Hall · regional anesthesia</small><h1>The brachial plexus.</h1><p>Right side, neck to hand. Real sourced anatomy: turn it, peel it, and click anything.</p>`;
      h = `<h2>What would you like to do?</h2>
        <button class="row ${g.lessonDone ? '' : 'go'}" data-go="lesson"><b>Take the lesson</b><span>Six steps, about four minutes. You do something at every step.</span></button>
        <button class="row ${g.lessonDone ? 'go' : ''}" data-go="challenge"><b>Identification challenge</b><span>${CHALLENGE_LENGTH} structures, no labels${due ? `, starting with the ${due} you have due` : ''}.</span></button>
        <button class="row" data-go="explore"><b>Explore freely</b><span>Layers, isolate, names on or off.</span></button>
        <button class="row quiet" data-go="exit"><b>Back to the island</b></button>
        <p class="fine">${MODEL_GAPS}</p><p class="fine">Model: ${SOURCES.ZA.cite} ${CHECK_STATUS}</p>`;
    } else if (S.mode === 'explore') {
      head.innerHTML = `<small>Explore</small><h1>Turn it. Peel it.</h1><p>Click a structure. Switch names off to test yourself.</p>`;
      const id = S.picked, st = STRUCTURES[id];
      h = `<div class="tools"><button class="chip ${S.names ? 'on' : ''}" data-act="names">Names ${S.names ? 'on' : 'off'}</button><button class="chip" data-go="menu">Done</button></div>`;
      if (!id) h += `<h2>Nothing selected.</h2><p>Drag to turn, scroll or pinch to zoom, click a structure.</p>`;
      else if (!S.revealed) h += `<h2>What is this?</h2><p>Decide, then check.</p><button class="btn" data-act="reveal">Reveal</button>`;
      else h += `<h2>${atlas.nameOf(id)}</h2><p class="lay"><i class="dot ${atlas.parts.get(id).layer}"></i>${atlas.parts.get(id).layer}</p>${st?.fact ? `<p>${st.fact}</p>` : '<p class="fine">Named from the source model. No teaching note has been written and checked for this structure yet.</p>'}${srcHtml(['ZA', ...(st?.src || [])])}
        <div class="tools"><button class="chip" data-act="isolate">${atlas.isIsolated() ? 'Show the rest' : 'Isolate'}</button><button class="chip" data-act="hide">Hide</button><button class="chip" data-act="focus">Centre</button></div>`;
    } else if (S.mode === 'lesson') {
      const st = LESSON[S.step], last = S.step === LESSON.length - 1;
      head.innerHTML = `<small>Lesson · step ${S.step + 1} of ${LESSON.length}</small><h1>${st.title}</h1><p>${st.say}</p>`;
      h = `<div class="dots">${LESSON.map((_, i) => `<i class="${i < S.step ? 'past' : i === S.step ? 'now' : ''}"></i>`).join('')}</div>
        <h2>${S.done ? 'Yes.' : st.do}</h2>${S.nudge && !S.done ? `<p class="nudge">${S.nudge}</p>` : ''}
        ${S.done ? `<button class="btn" data-act="next">${last ? 'Finish the lesson' : 'Next'}</button>` : ''}${srcHtml(st.src)}<button class="chip quiet" data-go="menu">Leave lesson</button>`;
    } else if (S.mode === 'challenge') {
      const it = S.items[S.i];
      head.innerHTML = `<small>Challenge · ${S.i + 1} of ${S.items.length} · ${it.kind === 'find' ? 'identify' : 'apply'}</small><h1 class="${it.ask.length > 44 ? 'stem' : ''}">${it.ask}</h1><p>${S.phase === 'feedback' ? '' : 'No labels. Peel what is in your way.'}</p>`;
      if (S.phase === 'ask') h = `<h2>Click the structure.</h2><p>You can change your mind before you commit.</p>`;
      else if (S.phase === 'sure') h = `<h2>Selected. How sure are you?</h2><p>The name stays hidden until you commit.</p><div class="sure"><button class="btn alt" data-conf="1">Guess</button><button class="btn alt" data-conf="2">Think so</button><button class="btn" data-conf="3">Sure</button></div>`;
      else { const r = S.results[S.results.length - 1];
        h = `<div class="verdict ${r.correct ? 'yes' : 'no'}">${r.correct ? 'Correct' : 'Not this time'}</div><h2>${atlas.nameOf(it.answer[0])}</h2>${r.correct ? '' : `<p>You selected the <b>${atlas.nameOf(r.picked).toLowerCase()}</b>.</p>`}<p>${it.why}</p>
          ${r.correct && r.conf === 1 ? '<p class="fine">Right, but a guess, so it comes back in two days.</p>' : !r.correct ? `<p class="fine">${r.conf === 3 ? 'You were sure. Worth a second look. ' : ''}It comes back tomorrow.</p>` : ''}${srcHtml(['ZA', ...it.src])}
          <button class="btn" data-act="cnext">${S.i === S.items.length - 1 ? 'On to three questions' : 'Next'}</button>`; }
    } else if (S.mode === 'questions') {
      const q = QUESTIONS[S.q];
      head.innerHTML = `<small>Practice question ${S.q + 1} of ${QUESTIONS.length} · ${q.type === 'multi' ? 'multiple correct response' : 'multiple choice'}</small><h1 class="stem">${q.stem}</h1>`;
      h = `<p class="fine">Original practice question written for Overlord. Not an NBCRNA item, and not a predictor of any exam score.</p>
        <div class="opts">${q.options.map((o, i) => `<button class="opt ${S.qsel.has(i) ? 'sel' : ''} ${S.qdone ? (q.correct.includes(i) ? 'right' : S.qsel.has(i) ? 'wrong' : '') : ''}" data-opt="${i}" ${S.qdone ? 'disabled' : ''}>${o}</button>`).join('')}</div>
        ${S.qdone ? `<div class="verdict ${S.qres[S.q] ? 'yes' : 'no'}">${S.qres[S.q] ? 'Correct' : 'Not this time'}</div><p>${q.why}</p>${srcHtml(q.src)}<button class="btn" data-act="qnext">${S.q === QUESTIONS.length - 1 ? 'See how you did' : 'Next question'}</button>` : `<button class="btn" data-act="qsubmit" ${S.qsel.size ? '' : 'disabled'}>Submit</button>`}`;
    } else if (S.mode === 'results') {
      const id = S.results.filter((r) => r.it.kind === 'find'), ap = S.results.filter((r) => r.it.kind === 'apply'), n = (xs) => `${xs.filter((r) => r.correct).length} of ${xs.length}`;
      const sureWrong = S.results.filter((r) => !r.correct && r.conf === 3).length, missed = S.results.filter((r) => !r.correct);
      head.innerHTML = `<small>Results</small><h1>${S.pass ? 'You know your way around.' : 'Closer than last time.'}</h1><p>${S.pass ? 'Identified and applied without labels.' : 'The ones you missed are scheduled to come back.'}</p>`;
      h = `<div class="two"><div><b>${n(id)}</b><span>identified</span></div><div><b>${n(ap)}</b><span>applied</span></div><div><b>${S.qres.filter(Boolean).length} of ${S.qres.length}</b><span>questions</span></div></div>
        <h3>What you know</h3><p>${missed.length ? `Coming back tomorrow: ${missed.map((r) => atlas.nameOf(r.it.answer[0]).toLowerCase()).join(', ')}.` : 'Nothing missed. These return in six days to check they stuck.'}${sureWrong ? ` You were sure and wrong ${sureWrong === 1 ? 'once' : sureWrong + ' times'}; those are the ones to distrust.` : ''}</p>
        <h3>What you earned</h3><p>${S.earned.blocks} building blocks for your plot.${S.earned.items.length ? ' ' + S.earned.items.join('. ') + '.' : S.pass ? '' : ' Six of eight earns the nerve stimulator and a plexus model for your plot.'}</p>
        <p class="fine">Blocks and items show what you earned. The line above them shows what you know. They are recorded separately.</p>
        <button class="btn" data-go="exit">Back to the island</button><button class="btn alt" data-go="challenge">Go again</button>`;
    }
    if (TOUCH) { h = h.replace(/\bClick\b/g, 'Tap').replace(/\bclick\b/g, 'tap'); head.innerHTML = head.innerHTML.replace(/\bClick\b/g, 'Tap').replace(/\bclick\b/g, 'tap').replace('scroll or pinch', 'pinch'); }
    panel.innerHTML = h;
    panel.querySelectorAll('[data-go]').forEach((b) => b.onclick = () => b.dataset.go === 'exit' ? onExit() : go(b.dataset.go));
    const on = (sel, fn) => { const b = panel.querySelector(sel); if (b) b.onclick = fn; };
    on('[data-act=names]', () => { S.names = !S.names; S.revealed = S.names; draw(); }); on('[data-act=reveal]', () => { S.revealed = true; draw(); });
    on('[data-act=isolate]', () => { atlas.isolate(atlas.isIsolated() ? null : [S.picked]); draw(); }); on('[data-act=hide]', () => { atlas.hide(S.picked); S.picked = null; draw(); }); on('[data-act=focus]', () => atlas.focus(S.picked));
    on('[data-act=next]', () => { if (S.step === LESSON.length - 1) { state.game.lessonDone = true; persist(); go('menu'); } else { S.step++; S.prog = []; S.done = false; S.nudge = ''; applyStep(); draw(); } });
    panel.querySelectorAll('[data-conf]').forEach((b) => b.onclick = () => answer(+b.dataset.conf));
    on('[data-act=cnext]', () => { if (S.i === S.items.length - 1) go('questions'); else { S.i++; S.phase = 'ask'; S.picked = null; atlas.showAll(); atlas.glow([]); atlas.select(null); setLabels([]); atlas.ghost([]); atlas.view('whole'); drawBar(); draw(); } });
    panel.querySelectorAll('[data-opt]').forEach((b) => b.onclick = () => { const i = +b.dataset.opt, q = QUESTIONS[S.q]; if (q.type === 'single') S.qsel = new Set([i]); else S.qsel.has(i) ? S.qsel.delete(i) : S.qsel.add(i); draw(); });
    on('[data-act=qsubmit]', submitQ); on('[data-act=qnext]', () => { if (S.q === QUESTIONS.length - 1) go('results'); else { S.q++; S.qsel = new Set(); S.qdone = false; draw(); } });
  }
  go('menu');
  return { go, state: S };
}
