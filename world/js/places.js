// places.js: what each station in the institute opens, and the one line that says where to go next.
// Every place states plainly what works there, what is approximated and what is not built. A doorway that leads to
// nothing is not presented as a finished mode.
import { summary, dueNow, has, save } from './save.js';
import { ITEMS, ORDER, info } from './collection.js';
import { CASES, LEVELS } from '../data/regional.js';
import { OUTLINE } from '../data/plexus.js';
import { sfx, isMuted, setMuted } from './audio.js';

export function mountPlaces({ world, exhibits, state, persist, els, enterHall, enterScan, showCharacter, wipe }) {
  const P = (state.game.progress ||= {}), E = els.place, touch = matchMedia('(hover: none) and (pointer: coarse)').matches;
  let open = null, onClose = null;
  const esc = (s) => String(s).replace(/</g, '&lt;');
  // ---------------------------------------------------------------- the next thing, in one line
  function next() {
    const g = state.game, due = dueNow(state).length, spec = has(state, 'plexus-specimen');
    if (due && spec) return { key: 'plexus', mode: 'review', text: `<b>${due} due.</b> A review is waiting at the plexus plinth.` };
    if (!g.filmDone) return { key: 'plexus', mode: 'film', text: 'Through the dark doorway ahead: <b>the lit plinth.</b> Start there.' };
    if (!g.lessonDone) return { key: 'plexus', mode: 'lesson', text: 'Back at the plinth: <b>handle the model</b>, six steps.' };
    if (!spec) return { key: 'plexus', mode: 'challenge', text: 'The plinth again: <b>identify it without labels.</b>' };
    if (!P.sawStudio) return { key: 'collection', text: 'Your specimen is in <b>your studio</b>: the door on the east side of the court.' };
    if (!P.regionalDone) return { key: 'regional_case', mode: 'r-intro', text: 'In the gallery, the stone table: <b>a regional case</b> on the same anatomy.' };
    if (exhibits.hasScan && !has(state, 'airway-sections')) return { key: 'airway', text: 'West side of the gallery: <b>the airway and neck</b>, scan and structure.' };
    const waiting = state.learning.due.length; return { key: null, text: waiting ? `Nothing is due today. <b>${waiting}</b> ${waiting === 1 ? 'item returns' : 'items return'} on later days.` : 'Nothing is due. The building is yours to walk.' };
  }
  function goal() { const n = next(); world.invite(n.key); els.goal.hidden = false; els.goal.innerHTML = `<span>${n.text}</span>${n.key ? '<button data-go>Go there</button>' : ''}`; const b = els.goal.querySelector('[data-go]'); if (b) b.onclick = () => { sfx('tap'); world.open(n.key); }; return n; }
  // ---------------------------------------------------------------- the panel beside a station
  function panel(key, html, closing = null) { open = key; onClose = closing; E.hidden = false; E.innerHTML = html + '<button class="btn alt" data-x>Step back</button>'; E.scrollTop = 0; E.querySelector('[data-x]').onclick = close; els.goal.hidden = true; return E; }
  function close() { if (!open) return; const c = onClose; open = null; onClose = null; E.hidden = true; c && c(); world.release(); persist(); goal(); }
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) close(); });
  const state3 = (rows) => `<dl class="state">${rows.map(([k, t]) => `<dt class="${k}">${{ works: 'Works', approx: 'Approximated', not: 'Not built' }[k]}</dt><dd>${t}</dd>`).join('')}</dl>`;
  const act = (sel, fn) => { const b = E.querySelector(sel); if (b) b.onclick = () => { sfx('tap'); fn(b); }; };
  const leaveTo = (fn) => { open = null; onClose = null; E.hidden = true; els.goal.hidden = true; persist(); wipe(fn); };

  const OPEN = {
    plexus() { const n = next(); leaveTo(() => enterHall(n.key === 'plexus' ? n.mode : 'menu', 'gallery')); },
    regional_case() { leaveTo(() => enterHall(P.regionalDone ? 'r-case' : 'r-intro', 'gallery')); },
    airway() {
      if (exhibits.hasScan) return leaveTo(() => enterScan('menu'));
      panel('airway', `<small>Anatomy gallery</small><h2>Airway and neck.</h2><p>This mount is for a model made from a real CT scan, with its slices on the lightbox beside it.</p>${state3([['not', 'The scan-derived model is still being prepared offline. Nothing here is shown as finished until its segmentation has been reviewed.']])}`);
    },
    atrium() { const f = exhibits.figure; if (!f) return panel('atrium', '<small>The court</small><h2>The sectioned figure.</h2><p>The figure could not be loaded.</p>');
      f.auto = false; panel('atrium', `<small>The court</small><h2>The sectioned figure.</h2><p>A whole skeleton and its nerves inside a body surface. The brass ring is a section plane: below it the surface is intact, above it the surface is cut away.</p>
        <div class="setting"><label for="figK">Move the plane</label><input type="range" id="figK" min="0.04" max="1" step="0.005" value="${f.k}"><label for="figS">Body surface</label><button class="chip ${f.skin ? 'on' : ''}" id="figS">${f.skin ? 'Shown' : 'Hidden'}</button></div>
        ${state3([['works', 'Moving the plane; showing and hiding the surface.'], ['approx', 'The surface is the source atlas\'s generic body, not a person. The cut is drawn by clipping, with no filled cross-section.'], ['not', 'Nothing here is named, taught or assessed. It is a view-only piece.']])}
        <p class="fine">Model: Z-Anatomy (CC BY-SA 4.0), from BodyParts3D (CC BY-SA 2.1 Japan). Reduced for the browser; not edited anatomically and not checked against a textbook.</p>`, () => { f.auto = true; });
      E.querySelector('#figK').oninput = (e) => f.set(+e.target.value); act('#figS', (b) => { f.showSkin(!f.skin); b.classList.toggle('on', f.skin); b.textContent = f.skin ? 'Shown' : 'Hidden'; }); },
    orientation() { sheet('study', true); },
    mirror() {
      panel('mirror', `<small>Anatomy gallery</small><h2>Mirror station.</h2><p>A mirror that lays a generic anatomical model over your own outline, so that moving your hand moves what you see.</p>
        ${state3([['works', 'The same anatomy without a camera: open the model and turn it by hand.'], ['approx', '<span id="mirState">Checking whether the camera experiment is on this machine…</span>'], ['not', 'Freeze-frame, and any link between the mirror and your learning record. Nothing the mirror does is scored, and losing tracking can never count against you.']])}
        <p class="fine">What a mirror like this can and cannot show: the model is a generic body fitted to landmarks on your outline. Lining it up with you is not evidence about your own internal anatomy.</p>
        <button class="row go" data-m="explore"><b>Inspect the model without a camera</b><span>The plexus, free to turn and peel. Never recorded.</span></button><button class="row" data-m="cam" disabled><b>Start the camera mirror</b><span>Asks for your camera only when you press this.</span></button>`);
      act('[data-m=explore]', () => leaveTo(() => enterHall('explore', 'gallery')));
      fetch(new URL('../local/x-ray-mirror.html', import.meta.url), { method: 'HEAD' }).then((r) => { if (open !== 'mirror') return; const s = E.querySelector('#mirState'), b = E.querySelector('[data-m=cam]');
        if (r.ok) { s.textContent = 'A camera mirror experiment is present on this machine. It runs as its own page, from files that are not part of this build, and loads its hand and pose tracking from the network.'; b.disabled = false; b.onclick = () => { const o = document.createElement('div'); o.id = 'mirrorFrame'; o.style.cssText = 'position:fixed;inset:0;z-index:20;background:#000'; o.innerHTML = '<iframe allow="camera" style="border:0;width:100%;height:100%"></iframe><button class="btn" style="position:absolute;left:16px;bottom:16px;width:auto;padding:12px 18px">Close the mirror</button>'; o.querySelector('iframe').src = new URL('../local/x-ray-mirror.html', import.meta.url).href; o.querySelector('button').onclick = () => o.remove(); document.body.appendChild(o); }; }
        else s.textContent = 'The camera mirror experiment is not included in this build, so there is nothing to start here.'; }).catch(() => {});
    },
    regional() {
      panel('regional', `<small>Regional practice</small><h2>A block bay.</h2><p>A curtained bay against a timber head wall: stretcher, ultrasound unit, monitor, supplies. The stretcher is empty on purpose. The reasoning work for this room runs on the anatomical model.</p>
        ${state3([['works', 'The regional sequence on the model: a narrated explanation, the four levels, unlabeled identification, a case, and practice questions.'], ['approx', 'Ultrasound is available only as recorded clips with a structure overlay, in the existing trainer. Those are recordings, not a simulation, and the overlay model has a published accuracy ceiling. The unit in this bay is a model: its screen shows what a probe held in air shows, and says so.'], ['not', 'A validated ultrasound simulation, needle practice, probe handling at this stretcher, and patient positioning. No needle path or dose is shown anywhere, because none has been validated.']])}
        <button class="row go" data-m="seq"><b>Run the regional sequence</b><span>On the plexus model. Recorded.</span></button><button class="row" data-m="us"><b>Open the recorded-ultrasound trainer</b><span>The existing Overlord module, in a new tab.</span></button>
        <p class="fine">Equipment models, each CC BY 4.0 and changed for this room: ultrasound unit by Liuuzaki; stretcher by meeww; curtains and vital signs monitor by Ethan Cragun; supply cart by NicolasVB; IV pole by Mouch; suction set by Dwayne.Barnett. <a href="../assets/LICENSES.md" target="_blank" rel="noopener">Full credits</a>.</p>`);
      act('[data-m=seq]', () => leaveTo(() => enterHall(P.regionalDone ? 'r-case' : 'r-intro', 'regional'))); act('[data-m=us]', () => window.open('../ultrasound/index.html', '_blank', 'noopener'));
    },
    or() {
      const w = world.stations.find((s) => s.key === 'or').work;
      panel('or', `<small>Operating room</small><h2>The operating room.</h2><p>${exhibits.hasClinical ? 'Operating table, anesthesia workstation, lights, carts and monitors are in place under a laminar-flow ceiling.' : 'The room is built. Its equipment is still loading, or could not be loaded.'}</p>
        ${state3([['works', 'Walking the room and taking the anesthesia position at the head of the table. Opening the existing simulator and its 50 synthetic preoperative charts under the same account.'], ['approx', 'Equipment is placed for the room\'s layout; its controls are not live here. The monitor and ventilator run a labelled demonstration loop, as real monitors do in demo mode. The figure on the table is set dressing, and the monitor tone is a recording of nothing: no simulated patient is connected in this room.'], ['not', 'Running a case inside this room. The patient simulation still runs in the classic app. Cases that depend on carbon dioxide kinetics are not scored anywhere yet: a defect there is documented and its correction is waiting for faculty review.']])}
        <button class="row go" data-m="work"><b>Take the anesthesia position</b><span>Head of the table, beside the workstation.</span></button><button class="row" data-m="sim"><b>Open the Student Workstation</b><span>The existing simulator: pick a patient, read the chart, plan, run it.</span></button>
        <p class="fine">Equipment models, each CC BY 4.0 and changed for this room: anesthesia workstation by DGLENN43; operating table by shashkinv1ad; emergency cart by tutminchai; supply cart by NicolasVB; IV pole by Mouch; suction set by Dwayne.Barnett; instruments by ferofluid; laryngoscope by marcomiceli29; syringes by Ethan Cragun; clock by Mohamed Ahmed. Cylinders, flow controls and vaporizer dials were recoloured to the United States convention. The lights, ceiling arm, draped tables, stools and cabinets were built for this project. <a href="../assets/LICENSES.md" target="_blank" rel="noopener">Full credits</a>.</p>`);
      act('[data-m=work]', () => { open = null; E.hidden = true; world.standAt(w[0], w[1], w[0], w[1] + 2); goal(); }); act('[data-m=sim]', () => { persist(); location.href = '../student.html'; });
    },
    collection() { P.sawStudio = true; persist(); exhibits.refresh();
      const held = state.game.collection, has_ = (id) => held.some((c) => c.id === id), cases = held.filter((c) => c.id.startsWith('case:')), best = state.game.best.plexus;
      const card = (id, locked) => { const it = info(id), c = held.find((q) => q.id === id); return `<details class="item ${locked ? 'locked' : ''}"><summary><b>${it.name}</b><span>${locked ? 'Not yet. ' + (it.how || '') : it.where + ' · ' + new Date(c.at).toLocaleDateString()}</span></summary>
          <dl class="state"><dt>What</dt><dd>${it.what}</dd><dt>Why</dt><dd>${it.why}</dd><dt>Use</dt><dd>${it.use}</dd><dt>Kept</dt><dd>${it.keeps}</dd><dt>Return</dt><dd>${it.back}</dd></dl></details>`; };
      panel('collection', `<small>Study studio</small><h2>Your collection.</h2><p>${held.length ? 'What you hold, and what each one is for.' : 'The shelf is empty. The first thing to stand on it is in the gallery.'}</p>
        ${has_('plexus-specimen') ? `<button class="row go" data-m="inspect"><b>Open the plexus specimen</b><span>Turn it, peel it, pin notes${has_('stimulator-layer') ? ', stimulate a nerve' : ''}. Never recorded.</span></button><button class="row" data-m="best"><b>Personal-best round</b><span>${best ? `Best so far: ${best.right} of ${best.total} unaided in ${Math.floor(best.ms / 60000)}:${String(Math.round(best.ms / 1000) % 60).padStart(2, '0')}.` : 'Eight items, unaided. Accuracy first, then time.'} Recorded.</span></button>` : ''}
        ${has_('airway-sections') ? '<button class="row" data-m="airway"><b>Open the airway section set</b><span>Section the model, read the slice.</span></button>' : ''}
        <div class="shelf">${ORDER.filter(has_).map((id) => card(id, false)).join('')}${cases.map((c) => card(c.id, false)).join('')}${ORDER.filter((id) => !has_(id) && (id !== 'airway-sections' || exhibits.hasScan)).map((id) => card(id, true)).join('')}</div>
        <p class="fine">Kept in this browser under your account. Holding something records what you demonstrated on a model; it is not a clinical competence and does not change any simulated patient.</p>`);
      act('[data-m=inspect]', () => leaveTo(() => enterHall('explore', 'studio'))); act('[data-m=best]', () => leaveTo(() => enterHall('challenge', 'studio'))); act('[data-m=airway]', () => leaveTo(() => enterScan('explore')));
    },
    desk() {
      const A = Object.entries(state.game.cases).filter(([, v]) => v.attempts && v.attempts.length), fmt = (c, a) => `<div class="att"><em>${new Date(a.t).toLocaleDateString()}</em><b>${LEVELS[a.chosen]?.name || a.chosen}</b><span class="${a.grade === 'no' ? 'bad' : 'ok'}">${a.grade === 'best' ? 'The preferred approach' : a.grade === 'ok' ? 'Defensible' : 'Not this approach'}</span>
          <span>Reasons: ${a.reasons.length ? a.reasons.map((i) => c.reasons[i]?.[1] ? '✓' : '✗').join(' ') : 'none selected'} ${a.reasonsRight ? '(all right)' : '(not all right)'}</span>${a.typed ? `<q>${esc(a.typed)}</q>` : '<span>No sentence written.</span>'}${a.self === null || a.self === undefined ? '' : `<span>Your own rating: ${a.self ? 'said it' : 'missed part'}</span>`}</div>`;
      panel('desk', `<small>Study studio</small><h2>Case archive.</h2><p>${A.length ? 'Each case you completed, with every attempt in order.' : 'Nothing here yet. A case you complete and explain is filed on this desk.'}</p>
        ${A.map(([id, v]) => { const c = CASES.find((q) => q.id === id), n = v.attempts.length; return `<h3>${c.title}</h3><p class="fine">${c.stem}</p><div class="atts ${n > 1 ? 'two' : ''}">${n > 1 ? fmt(c, v.attempts[0]) + fmt(c, v.attempts[n - 1]) : fmt(c, v.attempts[0])}</div>${n > 1 ? `<p class="fine">First attempt on the left, latest on the right${n > 2 ? `, ${n - 2} between` : ''}.</p>` : '<p class="fine">Run it again to set a second attempt beside this one.</p>'}<p><b>Model answer.</b> ${c.model}</p>`; }).join('')}
        <button class="row ${A.length ? '' : 'go'}" data-m="case"><b>${A.length ? 'Run a case again' : 'Go to the regional case'}</b><span>On the plexus model. Recorded.</span></button>`);
      act('[data-m=case]', () => leaveTo(() => enterHall('r-case', 'studio')));
    },
    wardrobe() { open = null; E.hidden = true; persist(); showCharacter(); },
  };

  // ---------------------------------------------------------------- sheets from the menu: direct study, the record, settings
  function sheet(kind, atStation = false) {
    if (!atStation) world.hold(); const sm = summary(state), due = dueNow(state).length, g = state.game;
    if (kind === 'study') {
      const n = next(), row = (k, mode, b, s, go) => `<button class="row ${go ? 'go' : ''}" data-d="${k}" data-mode="${mode || ''}"><b>${b}</b><span>${s}</span></button>`;
      panel('study', `<small>${atStation ? 'The court' : 'Direct study'}</small><h2>Choose a session.</h2><p>Each of these opens where it lives. No walking is required.</p>
        ${n.key ? `<button class="row go" data-d="${n.key}" data-mode="${n.mode || ''}"><b>Continue</b><span>${n.text.replace(/<[^>]+>/g, '')}</span></button>` : ''}
        ${due ? row('plexus', 'review', `Review what is due (${due})`, 'What you missed or guessed, first.') : ''}
        <h3>The brachial plexus</h3>${row('plexus', 'film', 'Film', '76 seconds, one question, one prediction.')}${row('plexus', 'lesson', 'Hands-on', 'Six guided steps. Not scored.')}${row('plexus', 'challenge', 'Challenge', 'Unlabeled, a new view each time. Recorded.')}${row('plexus', 'explore', 'Explore', 'Free. Never recorded.')}
        <h3>Regional anesthesia</h3>${row('regional_case', 'r-intro', 'Four ways in', 'Explanation, levels, identification, a case, questions.')}${g.progress.regionalDone ? row('regional_case', 'r-case', 'A case', 'Choose a level and say why.') : ''}
        ${exhibits.hasScan ? `<h3>Airway and neck</h3>${row('airway', '', 'Scan and structure', 'A CT-derived model with its slices.')}` : ''}
        <h3>Places</h3>${row('collection', '', 'Your studio', 'The collection and the case archive.')}${row('or', '', 'Operating room', 'The room, and the existing simulator.')}${row('regional', '', 'Regional practice room', 'What works there and what does not.')}`);
      E.querySelectorAll('[data-d]').forEach((b) => b.onclick = () => { sfx('tap'); const k = b.dataset.d, mode = b.dataset.mode; if (k === 'plexus' || k === 'regional_case') { world.teleport(k); return leaveTo(() => enterHall(mode || 'menu', 'direct')); } if (k === 'airway') { world.teleport(k); return leaveTo(() => enterScan('menu')); } open = null; E.hidden = true; world.open(k); });
    } else if (kind === 'record') {
      const pc = (v) => v === null ? '–' : v + '%', rows = Object.entries(sm.byOutline).map(([k, v]) => `<dt>${k}</dt><dd>${OUTLINE[k] || k}: ${v.correct} of ${v.seen} unaided</dd>`).join('');
      panel('record', `<small>${esc(state.character?.name || '')}</small><h2>Your record.</h2><p>Four different things. They are never added into one number.</p>
        <dl class="state"><dt>Coverage</dt><dd>${sm.covered} objective${sm.covered === 1 ? '' : 's'} met at least once.</dd><dt>Assisted</dt><dd>${sm.assisted} answer${sm.assisted === 1 ? '' : 's'} given with a hint, or on a second try after feedback. Kept, never counted as recall.</dd>
        <dt>Unaided</dt><dd>${sm.attempts} answers. Identified ${pc(sm.identified)} · worked out ${pc(sm.related)} · applied ${pc(sm.applied)} · practice questions ${pc(sm.recognised)}.</dd><dt>Delayed</dt><dd>${sm.delayed ? `${sm.delayed} answered a day or more after first seeing them: ${pc(sm.delayedPct)} right.` : 'None yet. An item counts here only when it comes back after a day or more.'}</dd></dl>
        ${rows ? `<h3>By NBCRNA outline area (2025/2026)</h3><dl class="state">${rows}</dl>` : ''}
        <h3>Due</h3><p>${due ? `${due} now.` : 'Nothing now.'} ${sm.missedWaiting ? `${sm.missedWaiting} waiting because they were missed or guessed.` : ''}</p>
        <p class="fine">These are your answers on Overlord's own items and models. They are not an NBCRNA score, and nothing here predicts one. Stored in this browser under your account; they do not follow you to another device.</p>`);
    } else {
      const p = world.prefs, sel = (id, v, opts) => `<select id="${id}">${opts.map(([k, n]) => `<option value="${k}" ${v === k ? 'selected' : ''}>${n}</option>`).join('')}</select>`, tog = (id, on) => `<button class="chip ${on ? 'on' : ''}" id="${id}">${on ? 'On' : 'Off'}</button>`;
      panel('settings', `<small>Settings</small><h2>How it feels.</h2>
        <div class="setting"><label>Graphics</label>${sel('sQ', p.quality, [['high', 'High'], ['medium', 'Balanced'], ['low', 'Lower cost']])}<label>Camera</label>${sel('sV', p.view, [['third', 'Behind you'], ['first', 'Your own eyes']])}
          <label for="sF">Field of view</label><input type="range" id="sF" min="48" max="84" step="1" value="${p.fov}"><label for="sS">Look sensitivity</label><input type="range" id="sS" min="0.4" max="2" step="0.05" value="${p.sens}">
          <label>Camera glides and moving parts</label>${tog('sM', p.motion)}<label>Sound</label>${tog('sA', !isMuted())}<label>Captions for sounds</label>${tog('sC', p.captions)}<label>Graphics diagnostics</label>${tog('sD', p.diag)}</div>
        <p class="fine">${touch ? 'Left pad to walk, drag to look, tap the floor to walk there.' : 'W A S D or arrows to walk, Shift to slow down, drag to look, scroll to move the camera in or out, V to switch view, E to open what you are standing at. Clicking the floor walks you there.'} Lower cost halves the lightmap, turns off the mirror in the pool and softens shadows; it takes effect fully on the next load.</p>`);
      const bind = (id, fn) => { const e = E.querySelector('#' + id); if (!e) return; if (e.tagName === 'BUTTON') e.onclick = () => { const on = !e.classList.contains('on'); e.classList.toggle('on', on); e.textContent = on ? 'On' : 'Off'; fn(on); persist(); }; else e.oninput = () => { fn(e.type === 'range' ? +e.value : e.value); persist(); }; };
      bind('sQ', (v) => world.setPref('quality', v)); bind('sV', (v) => world.setPref('view', v)); bind('sF', (v) => world.setPref('fov', v)); bind('sS', (v) => world.setPref('sens', v)); bind('sM', (v) => world.setPref('motion', v)); bind('sA', (v) => setMuted(!v)); bind('sC', (v) => world.setPref('captions', v)); bind('sD', (v) => world.setPref('diag', v));
    }
  }

  return {
    open(key) { (OPEN[key] || (() => panel(key, `<h2>${esc(key)}</h2>`)))(); },
    sheet, next, goal,
    /** Called every time the walker is given the level back. */
    arrive({ fresh = false, from = null } = {}) {
      world.release(); exhibits.refresh(); const n = goal(), name = esc(state.character?.name || '');
      if (from && from.earned && from.earned.items && from.earned.items.length) world.toast(`<b>Added to your collection.</b> ${from.earned.items[0]}.`, 9);
      else if (fresh || state.visits <= 1) world.toast(`Welcome, ${name}. The building is open.`, 5);
      else if (!from) world.toast(`Welcome back, ${name}.`, 4);
    },
    /** A direct route from a link: ?go=plexus&mode=challenge, ?go=studio, ?go=record ... */
    direct(go, mode) { const map = { hall: 'plexus', plexus: 'plexus', regional: 'regional_case', scan: 'airway', airway: 'airway', studio: 'collection', archive: 'desk', or: 'or' }; if (go === 'record' || go === 'settings' || go === 'study') return sheet(go);
      const k = map[go]; if (!k) return; world.teleport(k); if (k === 'plexus' || k === 'regional_case') return wipe(() => enterHall(mode || (k === 'regional_case' ? 'r-intro' : 'menu'), 'direct')); if (k === 'airway' && exhibits.hasScan) return wipe(() => enterScan(mode || 'menu')); world.open(k); },
  };
}
