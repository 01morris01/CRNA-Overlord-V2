/**
 * Themed Topic Map System
 * Renders per-course themed maps with procedural backgrounds,
 * node paths, and responsive layout (desktop curve / mobile subway).
 */

const COURSE_THEMES = {
  'adv-phys-path-1':          { name: 'PATHO VOLCANIC',    accent: '#ff3300', bg: '#1a0500', pattern: 'lava' },
  'adv-phys-path-2':          { name: 'NEURAL ARCTIC',     accent: '#00ddff', bg: '#001122', pattern: 'circuit' },
  'tech-advances-anesthesia': { name: 'OR ALPHA STATION',  accent: '#00ffa3', bg: '#000a08', pattern: 'grid' },
  'basics-anesthesia':        { name: 'TRAINING THEATRE',  accent: '#5b9eff', bg: '#03081a', pattern: 'blueprint' },
  'chem-phys-anesthesia':     { name: 'GAS LAW LAB',       accent: '#a78bfa', bg: '#0a041a', pattern: 'molecule' },
  'adv-health-assess':        { name: 'CADAVER LAB',       accent: '#ffb000', bg: '#1a0e00', pattern: 'anatomy' },
  'adv-pharmacology-1':       { name: 'PHARM LAB',         accent: '#ff6b9d', bg: '#1a0010', pattern: 'molecule' },
  'regional-anesthesia':      { name: 'NERVE MAP',         accent: '#00e5ff', bg: '#001a1f', pattern: 'circuit' },
};

function _svgPattern(pattern, accent) {
  const c = accent + '18'; // low opacity version
  const patterns = {
    lava:      `<pattern id="tp" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M0 30 Q15 20 30 30 Q45 40 60 30" stroke="${c}" fill="none" stroke-width="1"/><path d="M0 50 Q20 45 40 50 Q55 55 60 50" stroke="${c}" fill="none" stroke-width=".5"/></pattern>`,
    circuit:   `<pattern id="tp" width="40" height="40" patternUnits="userSpaceOnUse"><rect x="0" y="19" width="20" height="2" fill="${c}"/><rect x="19" y="0" width="2" height="20" fill="${c}"/><circle cx="20" cy="20" r="3" fill="none" stroke="${c}" stroke-width="1"/></pattern>`,
    grid:      `<pattern id="tp" width="30" height="30" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="30" height="30" fill="none" stroke="${c}" stroke-width=".5"/></pattern>`,
    blueprint: `<pattern id="tp" width="50" height="50" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="50" height="50" fill="none" stroke="${c}" stroke-width=".3"/><rect x="0" y="0" width="25" height="25" fill="none" stroke="${c}" stroke-width=".2"/></pattern>`,
    molecule:  `<pattern id="tp" width="50" height="50" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="8" fill="none" stroke="${c}" stroke-width=".8"/><line x1="25" y1="17" x2="25" y2="5" stroke="${c}" stroke-width=".5"/><line x1="32" y1="29" x2="42" y2="35" stroke="${c}" stroke-width=".5"/><line x1="18" y1="29" x2="8" y2="35" stroke="${c}" stroke-width=".5"/></pattern>`,
    anatomy:   `<pattern id="tp" width="80" height="80" patternUnits="userSpaceOnUse"><ellipse cx="40" cy="40" rx="20" ry="30" fill="none" stroke="${c}" stroke-width=".6"/><line x1="40" y1="10" x2="40" y2="70" stroke="${c}" stroke-width=".3"/><line x1="20" y1="40" x2="60" y2="40" stroke="${c}" stroke-width=".3"/></pattern>`,
  };
  return patterns[pattern] || patterns.grid;
}

function _nodeShape(type) {
  if (type === 'synthesis') return 'hexagon';
  if (type === 'mastery') return 'diamond';
  return 'circle';
}

/**
 * Render a themed topic map into the #world-map container.
 * @param {string} courseId
 * @param {object} course - { id, title, topics: [...] }
 * @param {Function} onSelectTopic - called with topicId when a node is clicked
 */
function _getTopicStats() {
  try {
    const key = typeof window._getUserSaveKey === 'function' ? window._getUserSaveKey() : 'hemodynamic_overlord_save';
    const raw = JSON.parse(localStorage.getItem(key) || '{}');
    return raw.topicStats || {};
  } catch(e) { return {}; }
}

function _tierForStats(stats) {
  if (!stats) return 'new';
  if (stats.bestPct >= 80) return 'mastered';
  if (stats.bestPct >= 60) return 'completed';
  if (stats.plays > 0) return 'started';
  return 'new';
}

function _showNodeDetail(topic, stats, onStart) {
  const s = stats || { plays: 0, bestScore: 0, bestPct: 0 };
  const statusLabel = s.bestPct >= 80 ? '\u2605 MASTERED' : s.bestPct >= 60 ? '\u25D0 COMPLETED' : s.plays > 0 ? '\u25CB STARTED' : 'NEW';

  const ov = document.createElement('div');
  ov.id = 'node-detail-overlay';
  ov.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 200ms var(--ease-out,cubic-bezier(.23,1,.32,1));pointer-events:auto;';

  const card = document.createElement('div');
  card.style.cssText = 'background:var(--card,#0e1a2e);border:1px solid var(--line-2,#243757);border-radius:8px;padding:1.5rem;max-width:340px;width:90%;transform:scale(0.95);transition:transform 240ms var(--ease-out);';
  card.innerHTML = `
    <div style="font-family:var(--fm);font-size:.5rem;color:var(--muted,#5a6f8a);letter-spacing:.2em;margin-bottom:.4rem;">NODE ${topic.order || '?'}</div>
    <div style="font-family:var(--fd);font-size:1.4rem;font-weight:700;color:var(--txt,#e5edf7);line-height:1.1;margin-bottom:.3rem;">${topic.title}</div>
    <div style="font-size:.55rem;color:var(--txt-2,#a3b3c9);margin-bottom:1rem;">${topic.chapters ? 'Ch. ' + topic.chapters : ''}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-bottom:.8rem;">
      <div style="background:var(--abyss,#070d1a);padding:.5rem;border-radius:4px;text-align:center;">
        <div style="font-family:var(--fd);font-size:1.3rem;font-weight:700;color:var(--green,#00ffa3);line-height:1;">${s.bestPct || 0}%</div>
        <div style="font-family:var(--fm);font-size:.4rem;color:var(--muted,#5a6f8a);letter-spacing:.12em;margin-top:.15rem;">BEST</div>
      </div>
      <div style="background:var(--abyss,#070d1a);padding:.5rem;border-radius:4px;text-align:center;">
        <div style="font-family:var(--fd);font-size:1.3rem;font-weight:700;color:var(--amber,#ffb000);line-height:1;">${s.plays || 0}</div>
        <div style="font-family:var(--fm);font-size:.4rem;color:var(--muted,#5a6f8a);letter-spacing:.12em;margin-top:.15rem;">PLAYS</div>
      </div>
    </div>
    <div style="height:3px;background:var(--line,#1a2940);border-radius:2px;margin-bottom:.3rem;overflow:hidden;">
      <div style="height:100%;width:${s.bestPct || 0}%;background:linear-gradient(90deg,var(--green,#00ffa3),var(--amber,#ffb000));"></div>
    </div>
    <div style="font-family:var(--fm);font-size:.4rem;color:var(--muted-2,#384a66);text-align:right;margin-bottom:.8rem;letter-spacing:.1em;">${statusLabel} · HIGH: ${(s.bestScore||0).toLocaleString()}</div>
    <button id="node-play" style="width:100%;background:var(--green,#00ffa3);border:none;color:#000;font-family:var(--fd);font-size:.9rem;font-weight:700;letter-spacing:.12em;padding:.7rem;border-radius:4px;cursor:pointer;margin-bottom:.4rem;transition:transform 130ms var(--ease-out);">START SESSION</button>
    <button id="node-cancel" style="width:100%;background:transparent;border:1px solid var(--line-2,#243757);color:var(--muted,#5a6f8a);font-family:var(--fm);font-size:.5rem;letter-spacing:.12em;padding:.4rem;border-radius:4px;cursor:pointer;">CANCEL</button>
  `;
  ov.appendChild(card);
  document.body.appendChild(ov);
  requestAnimationFrame(() => { ov.style.opacity = '1'; card.style.transform = 'scale(1)'; });

  document.getElementById('node-play').onclick = () => { ov.remove(); onStart(); };
  document.getElementById('node-cancel').onclick = () => { ov.style.opacity = '0'; setTimeout(() => ov.remove(), 200); };
  ov.onclick = (e) => { if (e.target === ov) { ov.style.opacity = '0'; setTimeout(() => ov.remove(), 200); } };
}

function renderTopicMap(courseId, course, onSelectTopic) {
  const wm = document.getElementById('world-map');
  if (!wm) return;

  const theme = COURSE_THEMES[courseId] || COURSE_THEMES['tech-advances-anesthesia'];
  const topics = course.topics || [];
  const isMobile = window.innerWidth < 700;
  const allStats = _getTopicStats();

  wm.innerHTML = '';
  wm.style.cssText = `
    width:100%;position:relative;overflow-y:auto;overflow-x:hidden;
    background:radial-gradient(ellipse at 50% 30%, ${theme.bg} 0%, var(--void,#03060c) 100%);
    min-height:${isMobile ? 'auto' : '500px'};
    max-height:${isMobile ? 'none' : '70vh'};
    padding:${isMobile ? '1rem .8rem' : '2rem'};
    border-radius:8px;border:1px solid var(--line,#1a2940);
  `;

  // SVG pattern overlay
  const svgBg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgBg.setAttribute('width', '100%');
  svgBg.setAttribute('height', '100%');
  svgBg.style.cssText = 'position:absolute;inset:0;pointer-events:none;opacity:.15;';
  svgBg.innerHTML = `<defs>${_svgPattern(theme.pattern, theme.accent)}</defs><rect width="100%" height="100%" fill="url(#tp)"/>`;
  wm.appendChild(svgBg);

  // Course title
  const title = document.createElement('div');
  title.style.cssText = `position:relative;font-family:var(--fd);font-size:1rem;font-weight:700;color:${theme.accent};letter-spacing:.15em;text-align:center;margin-bottom:.3rem;opacity:.7;`;
  title.textContent = theme.name;
  wm.appendChild(title);

  const subtitle = document.createElement('div');
  subtitle.style.cssText = 'position:relative;font-family:var(--fm);font-size:.45rem;color:var(--muted,#5a6f8a);text-align:center;margin-bottom:1.5rem;letter-spacing:.1em;';
  subtitle.textContent = `${topics.length} NODES · ${course.title.toUpperCase()}`;
  wm.appendChild(subtitle);

  // Node container
  const nodeContainer = document.createElement('div');

  if (isMobile) {
    // Mobile: vertical subway map
    nodeContainer.style.cssText = 'position:relative;display:flex;flex-direction:column;align-items:center;gap:0;padding-left:30px;';

    topics.forEach((topic, idx) => {
      const isLast = idx === topics.length - 1;
      const shape = _nodeShape(topic.type);

      const row = document.createElement('div');
      row.style.cssText = `
        position:relative;display:flex;align-items:center;width:100%;
        min-height:72px;cursor:pointer;
        opacity:0;animation:sp-stagger 280ms var(--ease-out,cubic-bezier(.23,1,.32,1)) ${50 * idx}ms forwards;
      `;

      // Vertical path line
      if (!isLast) {
        const line = document.createElement('div');
        line.style.cssText = `position:absolute;left:22px;top:36px;bottom:-36px;width:2px;background:${theme.accent}30;`;
        row.appendChild(line);
      }

      // Node circle/shape with tier treatment
      const topicStats = allStats[topic.id];
      const tier = _tierForStats(topicStats);
      const tierRing = tier === 'mastered' ? '3px solid var(--amber,#ffb000)' : tier === 'completed' ? '2px solid var(--amber,#ffb000)' : tier === 'started' ? `2px solid ${theme.accent}` : `1px solid ${theme.accent}50`;
      const tierGlow = tier === 'mastered' ? `box-shadow:0 0 16px rgba(255,176,0,.5);` : tier === 'completed' ? `box-shadow:0 0 10px rgba(255,176,0,.3);` : '';
      const tierBadge = tier === 'mastered' ? '\u2605\u2605' : tier === 'completed' ? '\u2605' : tier === 'started' ? '\u25D0' : '';

      const node = document.createElement('div');
      const size = 44;
      let shapeCSS = `border-radius:50%;`;
      if (shape === 'hexagon') shapeCSS = `clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);border-radius:0;`;
      if (shape === 'diamond') shapeCSS = `transform:rotate(45deg);border-radius:4px;`;

      node.style.cssText = `
        width:${size}px;height:${size}px;flex-shrink:0;position:relative;
        background:linear-gradient(135deg,${theme.accent}30,var(--card,#0e1a2e));
        border:${tierRing};${tierGlow}
        display:flex;align-items:center;justify-content:center;
        font-family:var(--fd);font-size:1rem;font-weight:700;color:${theme.accent};
        opacity:${tier === 'new' ? '0.6' : '1'};
        ${shapeCSS}
        transition:border-color 200ms var(--ease-out),transform 130ms var(--ease-out);
      `;
      node.textContent = shape === 'diamond' ? '' : topic.order;
      if (shape === 'diamond') {
        const inner = document.createElement('span');
        inner.style.cssText = 'transform:rotate(-45deg);display:block;';
        inner.textContent = topic.order;
        node.innerHTML = '';
        node.appendChild(inner);
      }
      row.appendChild(node);

      // Label
      const label = document.createElement('div');
      label.style.cssText = `margin-left:.7rem;flex:1;min-width:0;`;
      const topicType = topic.type === 'synthesis' ? 'SYNTHESIS' : topic.type === 'mastery' ? 'MASTERY' : `NODE ${topic.order}`;
      const badgeHTML = tierBadge ? ` <span style="color:var(--amber,#ffb000);font-size:.55rem;">${tierBadge}</span>` : '';
      label.innerHTML = `
        <div style="font-family:var(--fm);font-size:.4rem;color:var(--muted,#5a6f8a);letter-spacing:.12em;margin-bottom:.15rem;">${topicType}${badgeHTML}</div>
        <div style="font-size:.7rem;color:var(--txt,#e5edf7);font-weight:600;line-height:1.3;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${topic.title}</div>
        ${topic.chapters ? `<div style="font-family:var(--fm);font-size:.4rem;color:var(--muted-2,#384a66);margin-top:.15rem;">Ch. ${topic.chapters}</div>` : ''}
      `;
      row.appendChild(label);

      row.onclick = () => _showNodeDetail(topic, topicStats, () => onSelectTopic(topic.id));
      nodeContainer.appendChild(row);
    });

  } else {
    // Desktop: curved path layout
    nodeContainer.style.cssText = 'position:relative;min-height:400px;';

    // Calculate positions along a sine wave path
    const margin = 80;
    const containerW = 900;
    const containerH = Math.max(350, topics.length * 28);
    nodeContainer.style.minHeight = containerH + 'px';

    // Draw connecting path as SVG
    const pathSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    pathSvg.setAttribute('width', containerW);
    pathSvg.setAttribute('height', containerH);
    pathSvg.style.cssText = 'position:absolute;inset:0;pointer-events:none;';

    let pathD = '';
    const positions = [];

    topics.forEach((topic, idx) => {
      const t = idx / Math.max(1, topics.length - 1);
      const x = margin + (containerW - margin * 2) * t;
      const y = containerH / 2 + Math.sin(t * Math.PI * 2) * (containerH * 0.25);
      positions.push({ x, y });

      if (idx === 0) pathD += `M${x},${y}`;
      else pathD += ` L${x},${y}`;
    });

    pathSvg.innerHTML = `<path d="${pathD}" stroke="${theme.accent}" stroke-opacity=".25" stroke-width="2" fill="none" filter="drop-shadow(0 0 6px ${theme.accent}40)"/>`;
    nodeContainer.appendChild(pathSvg);

    // Render nodes at positions
    topics.forEach((topic, idx) => {
      const pos = positions[idx];
      const shape = _nodeShape(topic.type);
      const size = 56;

      const wrapper = document.createElement('div');
      wrapper.style.cssText = `
        position:absolute;left:${pos.x - size/2}px;top:${pos.y - size/2}px;
        width:${size}px;text-align:center;cursor:pointer;
        opacity:0;animation:sp-stagger 280ms var(--ease-out,cubic-bezier(.23,1,.32,1)) ${50 * idx}ms forwards;
        transition:transform 200ms var(--ease-out);
      `;

      let shapeCSS = `border-radius:50%;`;
      if (shape === 'hexagon') shapeCSS = `clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);border-radius:0;`;
      if (shape === 'diamond') shapeCSS = `transform:rotate(45deg);border-radius:4px;`;

      const circle = document.createElement('div');
      circle.style.cssText = `
        width:${size}px;height:${size}px;margin:0 auto;
        background:linear-gradient(135deg,${theme.accent}25,var(--card,#0e1a2e));
        border:2px solid ${theme.accent}40;
        display:flex;align-items:center;justify-content:center;
        font-family:var(--fd);font-size:1.2rem;font-weight:700;color:${theme.accent};
        ${shapeCSS}
      `;
      if (shape === 'diamond') {
        const inner = document.createElement('span');
        inner.style.cssText = 'transform:rotate(-45deg);display:block;';
        inner.textContent = topic.order;
        circle.appendChild(inner);
      } else {
        circle.textContent = topic.order;
      }
      wrapper.appendChild(circle);

      const label = document.createElement('div');
      label.style.cssText = `font-family:var(--fm);font-size:.42rem;color:var(--txt-2,#a3b3c9);margin-top:.3rem;line-height:1.3;max-width:100px;margin-left:auto;margin-right:auto;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;`;
      label.textContent = topic.title;
      wrapper.appendChild(label);

      const dStats = allStats[topic.id];
      wrapper.onclick = () => _showNodeDetail(topic, dStats, () => onSelectTopic(topic.id));
      nodeContainer.appendChild(wrapper);
    });
  }

  wm.appendChild(nodeContainer);

  // Bottom status bar
  const _save = typeof loadSave === 'function' ? loadSave() : (typeof window._getUserSaveKey === 'function' ? JSON.parse(localStorage.getItem(window._getUserSaveKey()) || '{}') : {});
  const pts = _save.bankedPts || 0;
  const inv = _save.inv || { shield: 0, skip: 0, reveal: 0, time: 0 };

  const bar = document.createElement('div');
  bar.style.cssText = `
    position:relative;display:flex;align-items:center;gap:.8rem;
    padding:.6rem .8rem;margin-top:1rem;
    border-top:1px solid var(--line,#1a2940);
    font-family:var(--fm);font-size:.5rem;color:var(--muted,#5a6f8a);
  `;
  bar.innerHTML = `
    <span style="color:var(--amber,#ffb000);">${pts.toLocaleString()} PTS</span>
    <span style="color:var(--line-2,#243757);">|</span>
    <span>🫁${inv.shield} 🔪${inv.skip} 📺${inv.reveal} 🔧${inv.time}</span>
    <span style="flex:1;"></span>
  `;

  const storeBtn = document.createElement('button');
  storeBtn.textContent = 'STORE';
  storeBtn.style.cssText = 'background:none;border:1px solid var(--line,#1a2940);color:var(--amber,#ffb000);font-family:var(--fm);font-size:.5rem;padding:.25rem .7rem;cursor:pointer;border-radius:3px;letter-spacing:.1em;transition:border-color 200ms var(--ease-out);';
  const allEmpty = inv.shield === 0 && inv.skip === 0 && inv.reveal === 0 && inv.time === 0;
  if (allEmpty && pts >= 400) {
    storeBtn.style.animation = 'lastlife-pulse .7s ease-in-out infinite';
    storeBtn.style.borderColor = 'var(--amber,#ffb000)';
  }
  storeBtn.onclick = () => { if (typeof openStore === 'function') openStore(); };
  bar.appendChild(storeBtn);

  const backBtn = document.createElement('button');
  backBtn.textContent = 'BACK';
  backBtn.style.cssText = 'background:none;border:1px solid var(--line,#1a2940);color:var(--muted,#5a6f8a);font-family:var(--fm);font-size:.5rem;padding:.25rem .7rem;cursor:pointer;border-radius:3px;letter-spacing:.1em;transition:border-color 200ms var(--ease-out);';
  backBtn.onclick = () => { if (typeof showCourseSelector === 'function') showCourseSelector(); };
  bar.appendChild(backBtn);

  wm.appendChild(bar);
}

// Expose globally for legacy code
window.renderTopicMap = renderTopicMap;
