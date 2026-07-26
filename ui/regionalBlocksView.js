/**
 * REGIONAL NERVE BLOCKS: educational reference panel.
 *
 * This module renders the nerve block study reference (selector plus detail
 * card) into a container supplied by the Ultrasound Trainer view, where it
 * lives as the BLOCK REFERENCE tab. It is no longer a standalone top level
 * view; the trainer owns the surrounding chrome (header, BACK TO MAP, tabs).
 *
 *   1. ultrasoundTrainerView.js calls mountRegionalBlocksPanel(container)
 *      while building its tab panels.
 *   2. Block cards with a trained live model call window.showUltrasoundTrainer
 *      with that model, which switches the trainer to the LIVE TRAINER tab.
 *
 * This is EDUCATIONAL study material summarized from Hadzic's Peripheral
 * Nerve Blocks (3rd ed). The block technique text is descriptive reference
 * content, not live intra procedure guidance.
 */

import { REGIONAL_BLOCKS, BLOCK_GROUPS } from './regionalBlocks.data.js';

let mounted = false;
let panel = null;
let activeBlockId = null;

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function paragraphs(text) {
  return String(text)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join('');
}

function renderSelector() {
  const list = panel?.querySelector('#rb-selector');
  if (!list) return;

  let html = '<div class="rb-selector-hint">Select a block to study</div>';
  for (const group of BLOCK_GROUPS) {
    const blocks = REGIONAL_BLOCKS.filter((b) => b.group === group.id);
    if (blocks.length === 0) continue;
    html += `<div class="rb-group-label">${escapeHtml(group.label)}</div>`;
    for (const block of blocks) {
      const active = block.id === activeBlockId ? ' is-active' : '';
      html += `
        <button type="button" class="rb-block-btn${active}" data-block="${block.id}">
          <span class="rb-block-icon" aria-hidden="true">${block.icon}</span>
          <span class="rb-block-meta">
            <span class="rb-block-name">${escapeHtml(block.name)}</span>
            <span class="rb-block-region">${escapeHtml(block.regionLabel)}</span>
          </span>
        </button>`;
    }
  }
  list.innerHTML = html;

  for (const button of list.querySelectorAll('[data-block]')) {
    button.addEventListener('click', () => selectBlock(button.dataset.block));
  }
}

/**
 * Live labeling launch action. Blocks with a trained model switch the trainer
 * to the LIVE TRAINER tab with that model preselected, in the same view.
 * Every other block shows an honest disabled state. This is a teaching
 * overlay launcher, not clinical guidance.
 */
function renderLiveLabeling(block) {
  const live = block.liveLabeling || { available: false };

  if (live.available) {
    const note = live.note ? `<div class="rb-live-note">${escapeHtml(live.note)} · AI teaching overlay, not clinical guidance</div>` : '';
    const modelAttr = live.model ? ` data-live-model="${escapeHtml(live.model)}"` : '';
    const label = live.model
      ? 'OPEN IN LIVE TRAINER · MODEL PRESELECTED'
      : 'OPEN LIVE STRUCTURE LABELING (PLEXUS STUDIO)';
    return `
      <section class="rb-section rb-live">
        <div class="rb-section-title"><span class="rb-dot"></span>Live Structure Labeling · PLEXUS STUDIO</div>
        <div class="rb-card rb-live-card">
          <button type="button" class="rb-live-btn" data-live-open="1"${modelAttr}>${label}</button>
          ${note}
          <div class="rb-live-hint">Switches to the LIVE TRAINER tab with this model loaded.</div>
        </div>
      </section>`;
  }

  return `
    <section class="rb-section rb-live">
      <div class="rb-section-title"><span class="rb-dot"></span>Live Structure Labeling · PLEXUS STUDIO</div>
      <div class="rb-card rb-live-card rb-live-unavailable">
        <button type="button" class="rb-live-btn rb-live-btn-off" disabled>LIVE LABELING NOT AVAILABLE</button>
        <div class="rb-live-hint">No model trained for this region yet. The live labeling AI is validated only for the supraclavicular brachial plexus (and the femoral and sciatic peripheral nerve models in the trainer's model lab).</div>
      </div>
    </section>`;
}

function renderDetail(block) {
  const detail = panel?.querySelector('#rb-detail');
  if (!detail) return;

  if (!block) {
    detail.innerHTML = '<div class="rb-empty">Choose a nerve block from the list to see its study card.</div>';
    return;
  }

  const volume = block.volume
    ? `<div class="rb-kv">Study reference volume: ${escapeHtml(block.volume)}</div>`
    : '';

  const pearls = (block.pearls || [])
    .map((p) => `<li>${escapeHtml(p)}</li>`)
    .join('');

  detail.innerHTML = `
    <div class="rb-detail-inner">
      <div class="rb-detail-head">
        <div class="rb-detail-eyebrow">${escapeHtml(block.regionLabel)} · Chapter ${escapeHtml(String(block.chapter))}</div>
        <h2 class="rb-detail-title">${escapeHtml(block.name)}</h2>
        <p class="rb-detail-tagline">${escapeHtml(block.tagline)}</p>
      </div>

      ${renderLiveLabeling(block)}

      <section class="rb-section">
        <div class="rb-section-title"><span class="rb-dot"></span>Indication</div>
        <div class="rb-card">${paragraphs(block.indication)}</div>
      </section>

      <section class="rb-section">
        <div class="rb-section-title"><span class="rb-dot"></span>Relevant Anatomy</div>
        <div class="rb-card">${paragraphs(block.anatomy)}</div>
      </section>

      <section class="rb-section rb-recommend">
        <div class="rb-section-title"><span class="rb-dot"></span>Recommendation · Finding the Nerve on Ultrasound</div>
        <div class="rb-card">${paragraphs(block.ultrasound)}</div>
      </section>

      <section class="rb-section rb-recommend">
        <div class="rb-section-title"><span class="rb-dot"></span>Recommendation · Block Technique (Study Material)</div>
        <div class="rb-card">${paragraphs(block.technique)}${volume}</div>
      </section>

      <section class="rb-section">
        <div class="rb-section-title"><span class="rb-dot"></span>Clinical Pearls and Safety</div>
        <div class="rb-card"><ul class="rb-pearls">${pearls}</ul></div>
      </section>

      <div class="rb-source">${escapeHtml(block.source)}</div>
    </div>`;

  const liveButton = detail.querySelector('[data-live-open]');
  if (liveButton) {
    liveButton.addEventListener('click', () => {
      const model = liveButton.dataset.liveModel || null;
      if (typeof window.showUltrasoundTrainer === 'function') {
        window.showUltrasoundTrainer(model, liveButton);
      }
    });
  }

  detail.scrollTop = 0;
}

function selectBlock(id) {
  const block = REGIONAL_BLOCKS.find((b) => b.id === id);
  if (!block) return;
  activeBlockId = id;
  renderSelector();
  renderDetail(block);
}

function renderShell() {
  panel.innerHTML = `
    <div class="rb-fence" role="note">Educational study material summarized from Hadzic's Peripheral Nerve Blocks. Reference only; not clinical or intra procedure guidance.</div>
    <div class="rb-panel-head">
      <p class="rb-eyebrow">STUDY CONSOLE · NERVE MAP</p>
      <p class="rb-subtitle">Sonoanatomy, technique, and pearls for ${REGIONAL_BLOCKS.length} core blocks</p>
    </div>
    <div class="rb-body">
      <nav id="rb-selector" class="rb-selector" aria-label="Nerve block selector"></nav>
      <div id="rb-detail" class="rb-detail" aria-live="polite"></div>
    </div>`;
}

/**
 * Render the block reference into the given container. Idempotent; the
 * trainer calls this once while building its BLOCK REFERENCE tab panel.
 */
export function mountRegionalBlocksPanel(container) {
  if (mounted || !container) return;
  mounted = true;
  panel = container;
  renderShell();
  renderSelector();
  // Open on the first block so the panel is never empty.
  selectBlock(REGIONAL_BLOCKS[0]?.id);
}
