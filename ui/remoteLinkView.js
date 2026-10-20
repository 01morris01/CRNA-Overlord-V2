/* The link controls: the instructor console opens a room and shows its code;
   a student computer enters the code. */

import { createLinkManager, joinUrl, normalizeRoomCode } from './remoteLink.js';

function esc(value) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const STATE_LABEL = {
  off: 'OFF', starting: 'STARTING', waiting: 'WAITING', connecting: 'CONNECTING', connected: 'CONNECTED', error: 'PROBLEM',
};

export function renderHostLinkPanel() {
  return `
    <div class="remote-link remote-link-host" data-link-role="host">
      <h3>Student on another computer</h3>
      <p class="live-help">Open a room, then on the student's computer go to this site's student screen and enter the code.</p>
      <div class="remote-link-row" data-link-show="off">
        <button type="button" class="live-primary" data-link-action="start">OPEN A ROOM</button>
      </div>
      <div class="remote-link-room" data-link-show="on" hidden>
        <p class="remote-link-code-label">Room code</p>
        <output class="remote-link-code" data-link-code>------</output>
        <p class="remote-link-url">Student opens <a data-link-url href="#" target="_blank" rel="noopener"></a></p>
        <div class="remote-link-row">
          <button type="button" data-link-action="copy">COPY LINK</button>
          <button type="button" data-link-action="new">NEW CODE</button>
          <button type="button" class="live-danger-outline" data-link-action="stop">CLOSE ROOM</button>
        </div>
      </div>
      <output class="remote-link-status" data-link-status data-state="off" aria-live="polite">Not linked to another computer.</output>
    </div>`;
}

export function renderGuestLinkPanel() {
  return `
    <div class="remote-link remote-link-guest" data-link-role="guest">
      <form class="remote-link-join" data-link-show="off" novalidate>
        <label><span>Instructor room code</span>
          <input type="text" data-link-input maxlength="9" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="ABC123">
        </label>
        <button type="submit">CONNECT</button>
      </form>
      <div class="remote-link-joined" data-link-show="on" hidden>
        <span>Room <strong data-link-code>------</strong></span>
        <button type="button" class="remote-link-quiet" data-link-action="stop">DISCONNECT</button>
      </div>
      <output class="remote-link-status" data-link-status data-state="off" aria-live="polite">Same computer as the instructor? Nothing to do. On another computer, enter the room code.</output>
    </div>`;
}

export function statusText(role, status) {
  const label = STATE_LABEL[status.state] ?? status.state;
  if (status.state === 'off') {
    return role === 'host' ? 'Not linked to another computer.' : 'Same computer as the instructor? Nothing to do. On another computer, enter the room code.';
  }
  if (status.state === 'connected') {
    return role === 'host'
      ? `${label} · ${status.peers === 1 ? '1 student computer' : `${status.peers} student computers`} linked.`
      : `${label} · linked to the instructor computer.`;
  }
  return `${label} · ${status.message || ''}`.trim();
}

/* Wires a rendered panel to a link manager. Returns the manager. */
export function bindLinkPanel(container, { role, manager = createLinkManager({ role }), location = globalThis.location, clipboard = globalThis.navigator?.clipboard } = {}) {
  if (!container) return manager;
  const $ = (selector) => container.querySelector(selector);
  const status = $('[data-link-status]');

  function render(current) {
    const on = current.state !== 'off';
    for (const el of container.querySelectorAll('[data-link-show]')) el.hidden = (el.dataset.linkShow === 'on') !== on;
    for (const el of container.querySelectorAll('[data-link-code]')) el.textContent = current.code ?? '------';
    const url = current.code ? joinUrl(current.code, location?.origin ?? '') : '';
    const anchor = $('[data-link-url]');
    if (anchor) { anchor.textContent = url; anchor.href = url || '#'; }
    if (status) {
      status.dataset.state = current.state;
      status.textContent = statusText(role, current);
    }
    container.dataset.linkState = current.state;
  }
  manager.subscribe(render);

  container.addEventListener('click', async (event) => {
    const action = event.target?.closest?.('[data-link-action]')?.dataset.linkAction;
    if (!action) return;
    if (action === 'start') manager.start();
    else if (action === 'new') manager.newRoom();
    else if (action === 'stop') manager.stop();
    else if (action === 'copy') {
      const code = manager.getStatus().code;
      if (!code) return;
      try { await clipboard?.writeText(joinUrl(code, location?.origin ?? '')); if (status) status.textContent = 'Link copied.'; } catch { /* clipboard blocked */ }
    }
  });
  const form = $('.remote-link-join');
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const input = $('[data-link-input]');
    const result = await manager.start(input?.value ?? '');
    if (!result.ok && status) { status.dataset.state = 'error'; status.textContent = result.reason; }
  });

  // A join link (?room=CODE) connects straight away; otherwise pick up a saved room.
  const fromUrl = role === 'guest' ? normalizeRoomCode(new URLSearchParams(location?.search ?? '').get('room')) : null;
  if (fromUrl) {
    manager.start(fromUrl);
    // Drop the code from the address bar; the room is remembered.
    try {
      const url = new URL(location.href);
      url.searchParams.delete('room');
      globalThis.history?.replaceState?.(null, '', url.toString());
    } catch { /* ignore */ }
  }
  else manager.resume();
  return manager;
}
