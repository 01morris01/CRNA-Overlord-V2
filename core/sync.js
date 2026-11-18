/**
 * sync.js: makes a save follow the person instead of the browser.
 *
 * localStorage stays the thing the app reads and writes. That is deliberate — every read path in the two
 * apps is synchronous, the world saves on a timer while you walk, and none of that should wait on a
 * network. So this module is a layer around localStorage, not a replacement for it:
 *
 *     sign in   -> ask the server for the stored save, settle it against what is in this browser, write
 *                  the winner into localStorage, and only then let the app load()
 *     on save   -> the app writes localStorage as it always did; we mark the slot dirty and push, debounced
 *     offline   -> every call fails soft. The app behaves exactly as it did before this file existed.
 *
 * When there is no sync server behind the page — the Vercel deployment, a file:// copy, a plain static
 * host — probe() returns false once and nothing else here ever runs. That is the fallback, not an error.
 *
 * Conflicts. A save blob is one big object with no per-field history, so a true merge is not possible and
 * pretending otherwise would quietly corrupt someone's record of what they know. Instead: whoever wrote
 * more recently wins, and the side that loses is kept — the server writes it to conflicts/, and a losing
 * local copy is stashed under a dated key in this browser. Nothing is thrown away silently.
 */

const SYNC_META = 'hemodynamic_overlord_sync_';   // + userId + '_' + slot
const STASH = 'hemodynamic_overlord_stash_';      // + userId + '_' + slot + '_' + timestamp
const PUSH_DEBOUNCE = 1500;

let available = null;        // null = not asked yet, true/false once probed
let probing = null;

const api = (path) => `/api/sync${path}`;

async function req(path, { method = 'GET', token = null, body = null, keepalive = false } = {}) {
  const headers = {};
  if (token) headers.authorization = `Bearer ${token}`;
  if (body !== null) headers['content-type'] = 'application/json';
  const res = await fetch(api(path), {
    method, headers, keepalive,
    body: body === null ? undefined : JSON.stringify(body),
  });
  let json = null;
  try { json = await res.json(); } catch { /* a non-JSON reply means not our server */ }
  return { status: res.status, ok: res.ok, json };
}

/** Is there a sync server behind this page? Asked once; the answer is remembered for the page's life. */
export function probe() {
  if (available !== null) return Promise.resolve(available);
  if (probing) return probing;
  probing = (async () => {
    try {
      const r = await req('/health');
      available = !!(r.ok && r.json && r.json.sync === true);
    } catch {
      available = false;     // no server, wrong host, offline — all the same answer
    }
    probing = null;
    return available;
  })();
  return probing;
}

/** For callers that must not trigger a probe (synchronous paths). null when it has not been asked. */
export const known = () => available;

// ---------------------------------------------------------------- accounts

export async function remoteRegister(username, password) {
  if (!await probe()) return { ok: false, offline: true };
  try {
    const r = await req('/register', { method: 'POST', body: { username, password } });
    if (r.ok && r.json?.ok) return { ok: true, token: r.json.token, displayName: r.json.displayName };
    return { ok: false, error: r.json?.error || 'The server refused the account.' };
  } catch {
    return { ok: false, offline: true };
  }
}

export async function remoteLogin(username, password) {
  if (!await probe()) return { ok: false, offline: true };
  try {
    const r = await req('/login', { method: 'POST', body: { username, password } });
    if (r.ok && r.json?.ok) return { ok: true, token: r.json.token, displayName: r.json.displayName };
    return { ok: false, error: r.json?.error || 'The server refused the sign-in.' };
  } catch {
    return { ok: false, offline: true };
  }
}

export async function remoteLogout(token) {
  if (!token || available !== true) return;
  try { await req('/logout', { method: 'POST', token }); } catch { /* the token expires on its own */ }
}

// ---------------------------------------------------------------- local bookkeeping

const metaKey = (userId, slot) => SYNC_META + userId + '_' + slot;

function readMeta(userId, slot) {
  try { return JSON.parse(localStorage.getItem(metaKey(userId, slot))) || null; } catch { return null; }
}

function writeMeta(userId, slot, meta) {
  try { localStorage.setItem(metaKey(userId, slot), JSON.stringify(meta)); } catch { /* storage full */ }
}

/** Record that this browser's copy of a slot has changed and has not reached the server yet. */
export function markDirty(userId, slot) {
  const m = readMeta(userId, slot) || { rev: 0, syncedAt: null, dirtyAt: null };
  m.dirtyAt = Date.now();
  writeMeta(userId, slot, m);
}

const STASH_KEEP = 3;

function stash(userId, slot, raw, why) {
  if (raw == null) return;
  try {
    localStorage.setItem(STASH + userId + '_' + slot + '_' + Date.now(), JSON.stringify({ why, at: Date.now(), raw }));
  } catch { /* if there is no room to stash, the server's conflicts/ copy is still the backstop */ }
  // localStorage is a few megabytes for the whole origin and a world save is tens of kilobytes that grow
  // with every answer. Keeping every displaced copy forever would eventually fill it and start failing
  // the saves this is all meant to protect, so only the most recent few are kept here; the server's
  // conflicts/ directory is the one with no such limit.
  try {
    const mine = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(STASH + userId + '_' + slot + '_')) mine.push(k);
    }
    mine.sort();                                        // the timestamp suffix makes this oldest-first
    for (const k of mine.slice(0, Math.max(0, mine.length - STASH_KEEP))) localStorage.removeItem(k);
  } catch { /* pruning is housekeeping; failing it changes nothing that matters */ }
}

/** Do the two copies hold the same thing? Both sides go through one parse and one stringify, so this
 *  compares content rather than whitespace or key order. */
function sameContent(localRaw, serverData) {
  if (localRaw == null || serverData == null) return false;
  try { return JSON.stringify(JSON.parse(localRaw)) === JSON.stringify(serverData); } catch { return false; }
}

/** Every stashed copy for a user, newest first. Nothing reads these automatically — they are a safety net
 *  to recover from by hand, and listRecoverable() is how you find out they exist. */
export function listRecoverable(userId) {
  const out = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k || !k.startsWith(STASH + userId + '_')) continue;
    try {
      const v = JSON.parse(localStorage.getItem(k));
      out.push({ key: k, slot: k.slice((STASH + userId + '_').length).replace(/_\d+$/, ''), at: v.at, why: v.why });
    } catch { /* skip an unreadable stash */ }
  }
  return out.sort((a, b) => b.at - a.at);
}

// ---------------------------------------------------------------- pull / push

/**
 * Settle one slot at sign-in and leave the winner in localStorage.
 *
 * storageKey is the localStorage key the app itself uses, so the app's own load() picks the result up
 * with no changes to how it reads.
 *
 * Returns { source, rev } where source is one of:
 *   'server'   the stored save was newer, or this browser had nothing
 *   'local'    this browser was newer, or the server had nothing; it has been pushed up
 *   'same'     nothing to do
 *   'offline'  the server could not be reached; localStorage is untouched
 */
export async function pullSlot(userId, slot, storageKey, token) {
  if (!await probe()) return { source: 'offline' };

  let server;
  try {
    const r = await req(`/save?slot=${encodeURIComponent(slot)}`, { token });
    if (r.status === 401) return { source: 'offline', unauthorized: true };
    if (!r.ok || !r.json?.ok) return { source: 'offline' };
    server = r.json;
  } catch {
    return { source: 'offline' };
  }

  const localRaw = localStorage.getItem(storageKey);
  const meta = readMeta(userId, slot);

  // The two sides already agree. This is the normal state after a page is closed: flushNow() sends the
  // last save with keepalive and the page dies before it can record that the send landed, so the slot
  // still looks unsent. Without this check the next visit would treat its own work as a rival device's
  // and stash a copy of it, every single time.
  if (sameContent(localRaw, server.data)) {
    writeMeta(userId, slot, { rev: server.rev, syncedAt: Date.now(), dirtyAt: null });
    return { source: 'same', rev: server.rev };
  }

  const takeServer = (why) => {
    if (server.data == null) return null;
    if (localRaw != null && why) stash(userId, slot, localRaw, why);
    try { localStorage.setItem(storageKey, JSON.stringify(server.data)); } catch { return null; }
    writeMeta(userId, slot, { rev: server.rev, syncedAt: Date.now(), dirtyAt: null });
    return { source: 'server', rev: server.rev };
  };

  const pushLocal = async () => {
    if (localRaw == null) return { source: 'same', rev: server.rev };
    let data;
    try { data = JSON.parse(localRaw); } catch { return { source: 'same', rev: server.rev }; }
    const r = await pushSlot(userId, slot, storageKey, token, { baseRev: server.rev, data });
    return r.ok ? { source: 'local', rev: r.rev } : { source: 'offline' };
  };

  // Nothing stored for this account yet: whatever is in this browser becomes the starting point.
  if (server.rev === 0 || server.data == null) return pushLocal();

  // This browser has never synced this slot. Its copy could be anything — progress from before there was
  // a server, or an empty save from a glance at the sign-in screen. Its age is unknowable; the stored
  // save's is not, and it got there on purpose. So the server wins, and the local copy is stashed rather
  // than overwritten, which is what makes that choice safe to get wrong.
  if (!meta) return takeServer(localRaw ? 'first sync on this device' : null) || { source: 'server', rev: server.rev };

  // In step with the server and nothing unsent here: just take what it has.
  if (!meta.dirtyAt) {
    if (server.rev === meta.rev) return { source: 'same', rev: server.rev };
    return takeServer(null) || { source: 'server', rev: server.rev };
  }

  // Unsent work here, and the server has not moved since we last saw it: ours goes up cleanly.
  if (server.rev === meta.rev) return pushLocal();

  // Both sides moved. Newer wins; the loser is kept either way.
  if ((server.updatedAt || 0) > meta.dirtyAt) {
    return takeServer('a newer save arrived from another device') || { source: 'server', rev: server.rev };
  }
  return pushLocal();
}

/**
 * Push one slot. Called debounced from the save paths, and directly by pullSlot.
 * On a stale-revision refusal it re-reads the server copy and settles it the same way as at sign-in,
 * so a second device writing at the same moment cannot lose either side's work.
 */
export async function pushSlot(userId, slot, storageKey, token, forced = null) {
  if (available !== true) return { ok: false, offline: true };

  let data, baseRev;
  if (forced) {
    ({ data, baseRev } = forced);
  } else {
    const raw = localStorage.getItem(storageKey);
    if (raw == null) return { ok: false, empty: true };
    try { data = JSON.parse(raw); } catch { return { ok: false, empty: true }; }
    baseRev = (readMeta(userId, slot) || {}).rev || 0;
  }

  let r;
  try { r = await req(`/save?slot=${encodeURIComponent(slot)}`, { method: 'PUT', token, body: { baseRev, data } }); }
  catch { return { ok: false, offline: true }; }

  if (r.ok && r.json?.ok) {
    writeMeta(userId, slot, { rev: r.json.rev, syncedAt: Date.now(), dirtyAt: null });
    return { ok: true, rev: r.json.rev };
  }

  if (r.status === 409 && r.json?.server) {
    const srv = r.json.server;
    if (sameContent(localStorage.getItem(storageKey), srv.data)) {
      writeMeta(userId, slot, { rev: srv.rev, syncedAt: Date.now(), dirtyAt: null });
      return { ok: true, rev: srv.rev };            // someone else stored exactly this; nothing to resolve
    }
    const mine = readMeta(userId, slot) || {};
    const myTime = mine.dirtyAt || Date.now();
    if ((srv.updatedAt || 0) > myTime) {
      // The other device is ahead. Keep ours, take theirs.
      stash(userId, slot, localStorage.getItem(storageKey), 'overtaken by another device');
      try { localStorage.setItem(storageKey, JSON.stringify(srv.data)); } catch { /* storage full */ }
      writeMeta(userId, slot, { rev: srv.rev, syncedAt: Date.now(), dirtyAt: null });
      return { ok: false, took: 'server', rev: srv.rev };
    }
    // Ours is newer. Write it on top of their revision — the copy we displace is already in conflicts/.
    try {
      const again = await req(`/save?slot=${encodeURIComponent(slot)}`, {
        method: 'PUT', token, body: { baseRev: srv.rev, data },
      });
      if (again.ok && again.json?.ok) {
        writeMeta(userId, slot, { rev: again.json.rev, syncedAt: Date.now(), dirtyAt: null });
        return { ok: true, rev: again.json.rev };
      }
    } catch { /* fall through: it stays dirty and goes again on the next save */ }
    return { ok: false, conflict: true };
  }

  if (r.status === 401) return { ok: false, unauthorized: true };
  return { ok: false, error: r.json?.error || 'The save did not reach the server.' };
}

// ---------------------------------------------------------------- the debounced writer

const timers = new Map();

/** Called by the apps' own save functions, right after they write localStorage. Cheap and never throws. */
export function queuePush(userId, slot, storageKey, token) {
  if (available !== true || !token) return;
  markDirty(userId, slot);
  const k = userId + '_' + slot;
  clearTimeout(timers.get(k));
  timers.set(k, setTimeout(() => {
    timers.delete(k);
    pushSlot(userId, slot, storageKey, token).catch(() => { /* stays dirty; the next save tries again */ });
  }, PUSH_DEBOUNCE));
}

/** Send anything still waiting, now. Used when the page is going away, where a timer will not fire. */
export function flushNow(userId, slot, storageKey, token) {
  if (available !== true || !token) return;
  const k = userId + '_' + slot;
  if (timers.has(k)) { clearTimeout(timers.get(k)); timers.delete(k); }
  const meta = readMeta(userId, slot);
  if (!meta || !meta.dirtyAt) return;
  const raw = localStorage.getItem(storageKey);
  if (raw == null) return;
  try {
    // keepalive lets the request outlive the page. Fire and forget: there is no one left to tell.
    req(`/save?slot=${encodeURIComponent(slot)}`, {
      method: 'PUT', token, keepalive: true,
      body: { baseRev: meta.rev || 0, data: JSON.parse(raw) },
    }).catch(() => {});
  } catch { /* unparseable local copy; nothing to send */ }
}

export const _test = { readMeta, writeMeta, metaKey, sameContent, SYNC_META, STASH, STASH_KEEP, PUSH_DEBOUNCE };
