/* ═══════════════════════════════════════════════════════════════════
   SRNA CHARACTER V2 — detailed illustrated portrait (the user's art)
   Mounted into #srna-panel. Renders assets/img/srna-character.png with
   a breathing bob/float on a podium + soft glow, matching the mockup.
   Reactive states on the flat art: 'confident' (a happy hop) and
   'wipe_brow' (a weary lean). Equipped gear shows as cream chips and
   updates the rank plate.
   Exposes window._srna3d = { setState, syncEquip, setName } and
   re-points window._setSRNAState. legacy/legacy.js drawSRNA()
   delegates here when window._srna3d exists.
   Also contains a small reskin helper (coin score pop / roll-up).
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var panel = document.getElementById('srna-panel');
  if (!panel) return;

  var legacyCvs = document.getElementById('srna-cvs');
  var RM = false;
  try { RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  /* ── name / gear plate (DOM) ── */
  var plate = document.createElement('div');
  plate.className = 'srna-plate';
  plate.innerHTML = '<span class="pname">YOUR SRNA</span><span class="gear">0/4 GEAR</span>';
  panel.appendChild(plate);
  var curName = '';
  var curEquip = { vent: false, mac: false, vl: false, bougie: false };
  function updatePlate(name, equip) {
    var pn = plate.querySelector('.pname');
    var gr = plate.querySelector('.gear');
    if (name && pn) pn.textContent = String(name).toUpperCase();
    if (equip && gr) {
      var n = 0; for (var k in equip) { if (equip[k]) n++; }
      gr.textContent = n + '/4 GEAR';
    }
  }

  /* ── one-time CSS for the portrait presentation ── */
  function injectCSS() {
    if (document.getElementById('srna-portrait-css')) return;
    var css = [
      '#game #srna-panel .srna-glow{position:absolute;left:50%;top:6%;width:150%;height:70%;transform:translateX(-50%);',
      '  background:radial-gradient(ellipse at center,rgba(157,176,240,.42),rgba(33,84,232,.18) 45%,transparent 68%);',
      '  pointer-events:none;z-index:1;animation:srna-glow 3.2s ease-in-out infinite;}',
      '#game #srna-panel .srna-podium{position:absolute;left:50%;bottom:30px;width:78px;height:16px;transform:translateX(-50%);',
      '  background:radial-gradient(ellipse at center,rgba(33,84,232,.6),rgba(33,84,232,.12) 60%,transparent 72%);',
      '  border-radius:50%;pointer-events:none;z-index:1;animation:srna-podium 3.2s ease-in-out infinite;}',
      '#game #srna-panel .srna-figure{position:absolute;left:0;right:0;top:6px;bottom:30px;display:flex;align-items:flex-end;',
      '  justify-content:center;z-index:2;pointer-events:none;transform-origin:50% 100%;}',
      '#game #srna-panel .srna-img{width:98%;height:auto;max-height:100%;object-fit:contain;',
      '  filter:drop-shadow(0 5px 5px rgba(8,15,34,.45));animation:srna-bob 3.2s cubic-bezier(.45,0,.55,1) infinite;transform-origin:50% 100%;}',
      '#game #srna-panel .srna-figure.is-confident .srna-img{animation:srna-hop .62s cubic-bezier(.34,1.56,.64,1);}',
      '#game #srna-panel .srna-figure.is-wipe .srna-img{animation:srna-lean 2s ease-in-out;}',
      '#game #srna-panel .srna-gear{position:absolute;left:5px;top:5px;z-index:3;display:flex;flex-direction:column;gap:3px;pointer-events:none;}',
      '#game #srna-panel .srna-chip{font-family:"IBM Plex Mono",monospace;font-size:.4rem;font-weight:700;letter-spacing:.1em;',
      '  color:#10307E;background:#F6F0E1;border:1.5px solid #101C3A;border-radius:5px;padding:1px 5px;box-shadow:0 2px 0 rgba(8,15,34,.35);}',
      '@keyframes srna-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}',
      '@keyframes srna-podium{0%,100%{transform:translateX(-50%) scaleX(1);opacity:.9}50%{transform:translateX(-50%) scaleX(.88);opacity:.55}}',
      '@keyframes srna-glow{0%,100%{opacity:.85}50%{opacity:1}}',
      '@keyframes srna-hop{0%{transform:translateY(0) scale(1)}30%{transform:translateY(-16px) scale(1.06)}55%{transform:translateY(-4px) scale(1.02)}100%{transform:translateY(0) scale(1)}}',
      '@keyframes srna-lean{0%,100%{transform:rotate(0) translateY(0)}25%{transform:rotate(-3.5deg) translateY(-2px)}60%{transform:rotate(-2.5deg) translateY(-1px)}}',
      '@media (prefers-reduced-motion: reduce){',
      '  #game #srna-panel .srna-img,#game #srna-panel .srna-podium,#game #srna-panel .srna-glow{animation:none;}}'
    ].join('\n');
    var el = document.createElement('style');
    el.id = 'srna-portrait-css';
    el.textContent = css;
    document.head.appendChild(el);
  }

  /* ══════════════ PORTRAIT BUILD ══════════════ */
  function buildImage() {
    injectCSS();
    if (legacyCvs) legacyCvs.style.display = 'none';

    var glow = document.createElement('div'); glow.className = 'srna-glow';
    var podium = document.createElement('div'); podium.className = 'srna-podium';
    var gearWrap = document.createElement('div'); gearWrap.className = 'srna-gear';
    var figure = document.createElement('div'); figure.className = 'srna-figure';
    var img = document.createElement('img');
    img.className = 'srna-img';
    img.alt = 'Your SRNA';
    img.draggable = false;
    img.src = 'assets/img/srna-character.png';
    figure.appendChild(img);

    panel.insertBefore(glow, plate);
    panel.insertBefore(podium, plate);
    panel.insertBefore(figure, plate);
    panel.insertBefore(gearWrap, plate);

    var stTimer = 0;
    function setState(state, ms) {
      figure.classList.remove('is-confident', 'is-wipe');
      /* reflow so a repeat of the same state re-triggers the keyframes */
      void figure.offsetWidth;
      if (state === 'confident') figure.classList.add('is-confident');
      else if (state === 'wipe_brow') figure.classList.add('is-wipe');
      clearTimeout(stTimer);
      if (ms && (state === 'confident' || state === 'wipe_brow')) {
        stTimer = setTimeout(function () { figure.classList.remove('is-confident', 'is-wipe'); }, ms);
      }
    }

    var LABELS = { vent: 'VENT', mac: 'MAC', vl: 'VL', bougie: 'BOUGIE' };
    function renderGear() {
      gearWrap.innerHTML = '';
      for (var k in LABELS) {
        if (!curEquip[k]) continue;
        var c = document.createElement('span');
        c.className = 'srna-chip';
        c.textContent = LABELS[k];
        gearWrap.appendChild(c);
      }
    }

    return {
      setState: setState,
      syncEquip: function (eq) {
        if (!eq) return;
        for (var k in curEquip) curEquip[k] = !!eq[k];
        renderGear();
        updatePlate(null, curEquip);
      },
      setName: function (n) { if (n) { curName = n; updatePlate(n, null); } }
    };
  }

  var api;
  try { api = buildImage(); }
  catch (err) {
    api = { setState: function () {}, syncEquip: function () {}, setName: function () {} };
  }
  window._srna3d = api;

  /* re-point the reactive hook used by ui/gameUI.js */
  window._setSRNAState = function (state, ms) { api.setState(state, ms); };

  /* keep equip in sync when the shim store purchases gear */
  var _origSync = window._syncLegacyEquip;
  window._syncLegacyEquip = function (eq) {
    if (typeof _origSync === 'function') _origSync(eq);
    api.syncEquip(eq);
  };

  /* pick up saved equip/name once state is available */
  setTimeout(function () {
    try {
      var key = (typeof window._getUserSaveKey === 'function') ? window._getUserSaveKey() : 'hemodynamic_overlord_save';
      var raw = localStorage.getItem(key);
      if (raw) {
        var s = JSON.parse(raw);
        if (s && s.equip) api.syncEquip(s.equip);
        if (s && s.name) api.setName(s.name);
      }
    } catch (e) {}
  }, 400);

  /* ══════════════ RESKIN HELPER ══════════════ */
  /* points coin pop + rolling count-up when #scv changes */
  (function () {
    var scv = document.getElementById('scv');
    var scArea = document.querySelector('#hud .sc-area');
    if (!scv || !scArea) return;
    var muting = false, shown = 0, rollRaf = 0, popTimer = 0;
    function parseNum(s) { var n = parseInt(String(s).replace(/[^0-9-]/g, ''), 10); return isNaN(n) ? 0 : n; }
    shown = parseNum(scv.textContent);
    var mo = new MutationObserver(function () {
      if (muting) return;
      var target = parseNum(scv.textContent);
      if (target === shown) return;
      scArea.classList.remove('coin-pop');
      void scArea.offsetWidth;
      scArea.classList.add('coin-pop');
      clearTimeout(popTimer);
      popTimer = setTimeout(function () { scArea.classList.remove('coin-pop'); }, 700);
      if (RM || target < shown) { shown = target; return; }
      /* roll up */
      cancelAnimationFrame(rollRaf);
      var from = shown, start = performance.now(), dur = 450;
      function step(now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = Math.round(from + (target - from) * eased);
        muting = true;
        scv.textContent = val.toLocaleString();
        muting = false;
        if (p < 1) rollRaf = requestAnimationFrame(step);
        else shown = target;
      }
      rollRaf = requestAnimationFrame(step);
    });
    mo.observe(scv, { childList: true, characterData: true, subtree: true });
  })();
})();
