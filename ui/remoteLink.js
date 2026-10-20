/* Instructor computer <-> student computer link.

   The console, the student workstation and the monitor display talk over
   BroadcastChannel, which only reaches windows in the same browser on the
   same computer. This module carries those same messages between two
   computers over a WebRTC data channel, so none of the pages change how
   they talk: a bridge on each computer listens to the local channels,
   sends what it hears to the other computer, and replays what arrives.

   Pairing: the instructor console starts a room and shows a 6 character
   code. The student computer enters the code (or opens a link with
   ?room=CODE). PeerJS's free public broker introduces the two browsers;
   after that the traffic goes browser to browser.

   Shared work: care plans, interview transcripts and the student session
   live in localStorage, which each computer has its own copy of. The bridge
   copies those keys across, always before the message that refers to them.

   One bridge per computer: tabs elect a leader with the Web Locks API, so a
   student with the workstation and the monitor open makes one connection. */

import { STUDENT_CHANNEL } from './studentChannel.js';
import { LIVE_SIM_CHANNEL } from './liveSimTransport.js';

export const LINK_CHANNELS = Object.freeze([STUDENT_CHANNEL, LIVE_SIM_CHANNEL]);
export const LINK_STATUS_CHANNEL = 'crna-overlord-link-status-v1';
export const LINK_LOCK = 'crna-overlord-remote-link-v1';
export const LINK_ROOM_KEY = 'overlord.link.room.v1';
// Set on every message a bridge replays, so no bridge ever sends it on again.
export const VIA_LINK = '__viaLink';
export const SYNC_PREFIXES = Object.freeze([
  'overlord.careplan.v1.',
  'overlord.interview.v1.',
  'overlord.student.session.v1',
]);
export const PEER_ID_PREFIX = 'crna-overlord-room-';
export const PEERJS_URL = 'https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js';
export const ICE_SERVERS = Object.freeze([
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
]);
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const SNAPSHOT_INTERVAL_MS = 100;
const STORAGE_SCAN_MS = 1000;
const RETRY_MS = 3000;
const MAX_FRAME_CHARS = 900000;

export function makeRoomCode(random = Math.random) {
  let code = '';
  for (let i = 0; i < 6; i += 1) code += CODE_ALPHABET[Math.floor(random() * CODE_ALPHABET.length)];
  return code;
}

/* Accepts what a person types: any case, spaces or dashes. Codes never use
   O, 0, I, 1 or L, so those cannot be misread. */
export function normalizeRoomCode(input) {
  const code = String(input ?? '').toUpperCase().replace(/[\s-]/g, '');
  return code.length === 6 && [...code].every((ch) => CODE_ALPHABET.includes(ch)) ? code : null;
}

export function hostPeerId(code) {
  return `${PEER_ID_PREFIX}${code}`;
}

export function joinUrl(code, origin = globalThis.location?.origin ?? '') {
  return `${origin}/student.html?room=${code}`;
}

export function isSyncedKey(key) {
  return typeof key === 'string' && SYNC_PREFIXES.some((prefix) => key.startsWith(prefix));
}

/* Tracks the shared localStorage keys and reports what changed since the
   last scan. Values applied from the other computer are recorded as known,
   so they are not echoed back. */
export function createStorageSync(storage) {
  const known = new Map();
  function readAll() {
    const out = new Map();
    try {
      for (let i = 0; i < storage.length; i += 1) {
        const key = storage.key(i);
        if (isSyncedKey(key)) out.set(key, storage.getItem(key));
      }
    } catch { /* storage blocked */ }
    return out;
  }
  return {
    /* Every shared key and value, for a fresh connection. */
    all() {
      const current = readAll();
      for (const [key, value] of current) known.set(key, value);
      return Object.fromEntries(current);
    },
    /* Keys whose value changed (null means removed). */
    scan() {
      const current = readAll();
      const changes = {};
      for (const [key, value] of current) {
        if (known.get(key) !== value) changes[key] = value;
      }
      for (const key of known.keys()) {
        if (!current.has(key)) changes[key] = null;
      }
      for (const [key, value] of Object.entries(changes)) {
        if (value === null) known.delete(key); else known.set(key, value);
      }
      return changes;
    },
    /* Writes values from the other computer. onlyMissing keeps local work. */
    apply(entries, { onlyMissing = false } = {}) {
      let applied = 0;
      for (const [key, value] of Object.entries(entries ?? {})) {
        if (!isSyncedKey(key)) continue;
        if (value !== null && typeof value !== 'string') continue;
        try {
          const local = storage.getItem(key);
          if (onlyMissing && local !== null) { known.set(key, local); continue; }
          if (value === null) { storage.removeItem(key); known.delete(key); } else { storage.setItem(key, value); known.set(key, value); }
          applied += 1;
        } catch { /* storage blocked or full */ }
      }
      return applied;
    },
  };
}

export function loadPeerLibrary({ doc = globalThis.document, src = PEERJS_URL } = {}) {
  if (globalThis.Peer) return Promise.resolve(globalThis.Peer);
  if (!doc) return Promise.reject(new Error('No document to load the link library'));
  if (!loadPeerLibrary.pending) {
    loadPeerLibrary.pending = new Promise((resolve, reject) => {
      const script = doc.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => (globalThis.Peer ? resolve(globalThis.Peer) : reject(new Error('Link library did not load')));
      script.onerror = () => { loadPeerLibrary.pending = null; reject(new Error('Could not download the link library. Check the internet connection.')); };
      doc.head.appendChild(script);
    });
  }
  return loadPeerLibrary.pending;
}

/* The bridge. role 'host' (instructor console) or 'guest' (student computer).
   Status objects: { state, code, peers, message }. state is one of off,
   starting, waiting (host, nobody joined), connecting (guest), connected,
   error. */
export function createRemoteLink({
  role,
  code,
  PeerImpl = null,
  peerOptions = {},
  BroadcastChannelImpl = globalThis.BroadcastChannel,
  storage = globalThis.localStorage,
  onStatus = () => {},
  timers = { setTimeout: globalThis.setTimeout.bind(globalThis), clearTimeout: globalThis.clearTimeout.bind(globalThis), setInterval: globalThis.setInterval.bind(globalThis), clearInterval: globalThis.clearInterval.bind(globalThis) },
  connectTimeoutMs = 20000,
} = {}) {
  if (!['host', 'guest'].includes(role)) throw new TypeError('role must be host or guest');
  if (normalizeRoomCode(code) !== code) throw new TypeError('invalid room code');
  const sync = createStorageSync(storage);
  const channels = new Map();
  const connections = new Set();
  let peer = null;
  let closed = false;
  let status = { state: 'starting', code, peers: 0, message: '' };
  let scanTimer = null;
  let retryTimer = null;
  let connectTimer = null;
  let pendingSnapshot = null;
  let snapshotTimer = null;
  let lastSnapshotSentAt = 0;

  function setStatus(patch) {
    status = { ...status, ...patch, code, peers: openConnections().length };
    onStatus({ ...status });
  }

  function openConnections() {
    return [...connections].filter((conn) => conn.open);
  }

  function sendFrame(frame, except = null) {
    let text;
    try { text = JSON.stringify(frame); } catch { return; }
    if (text.length > MAX_FRAME_CHARS) return;
    for (const conn of openConnections()) {
      if (conn === except) continue;
      try { conn.send(text); } catch { /* the connection dropped; close handler cleans up */ }
    }
  }

  function flushStorage(except = null) {
    const changes = sync.scan();
    if (Object.keys(changes).length) sendFrame({ k: 's', entries: changes }, except);
  }

  function sendSnapshotNow() {
    snapshotTimer = null;
    if (!pendingSnapshot) return;
    const frame = pendingSnapshot;
    pendingSnapshot = null;
    lastSnapshotSentAt = Date.now();
    sendFrame(frame);
  }

  // Local page said something: copy it to the other computer.
  function onLocal(channelName, event) {
    const data = event?.data;
    if (!data || typeof data !== 'object' || data[VIA_LINK] || !openConnections().length) return;
    const frame = { k: 'm', ch: channelName, data };
    // The monitor publishes every frame; the other computer needs about 10 a second.
    if (channelName === LIVE_SIM_CHANNEL && data.type === 'snapshot') {
      pendingSnapshot = frame;
      const wait = SNAPSHOT_INTERVAL_MS - (Date.now() - lastSnapshotSentAt);
      if (wait <= 0) sendSnapshotNow();
      else if (!snapshotTimer) snapshotTimer = timers.setTimeout(sendSnapshotNow, wait);
      return;
    }
    flushStorage();
    sendFrame(frame);
  }

  for (const name of LINK_CHANNELS) {
    const channel = new BroadcastChannelImpl(name);
    const listener = (event) => onLocal(name, event);
    channel.addEventListener('message', listener);
    channels.set(name, { channel, listener });
  }

  // The other computer said something: replay it here.
  function onRemote(conn, raw) {
    let frame;
    try { frame = typeof raw === 'string' ? JSON.parse(raw) : raw; } catch { return; }
    if (!frame || typeof frame !== 'object') return;
    if (frame.k === 's') {
      sync.apply(frame.entries);
      if (role === 'host') sendFrame(frame, conn);
    } else if (frame.k === 'hello') {
      // First contact: the student's work wins on the instructor computer;
      // the instructor's copy only fills in what the student does not have.
      sync.apply(frame.entries, { onlyMissing: role === 'guest' });
    } else if (frame.k === 'm' && LINK_CHANNELS.includes(frame.ch) && frame.data && typeof frame.data === 'object') {
      channels.get(frame.ch).channel.postMessage({ ...frame.data, [VIA_LINK]: true });
      if (role === 'host') sendFrame(frame, conn);
    }
  }

  function adopt(conn) {
    connections.add(conn);
    conn.on('open', () => {
      timers.clearTimeout(connectTimer);
      conn.send(JSON.stringify({ k: 'hello', role, entries: sync.all() }));
      // Ask this computer's console for the current monitor frame and say hello
      // to its student pages, so both sides catch up at once.
      if (role === 'guest') sendFrame({ k: 'm', ch: LIVE_SIM_CHANNEL, data: { protocol: 1, type: 'state-request', requestId: `link-${Date.now()}` } });
      if (role === 'guest') sendFrame({ k: 'm', ch: STUDENT_CHANNEL, data: { protocol: 1, type: 'student-hello' } });
      setStatus({ state: 'connected', message: role === 'host' ? 'Student computer connected.' : 'Connected to the instructor computer.' });
    });
    conn.on('data', (raw) => onRemote(conn, raw));
    const drop = () => {
      connections.delete(conn);
      if (closed) return;
      if (role === 'host') {
        setStatus(openConnections().length ? { state: 'connected' } : { state: 'waiting', message: 'Student computer disconnected. Waiting for it to rejoin.' });
      } else {
        setStatus({ state: 'connecting', message: 'Lost the instructor computer. Reconnecting...' });
        scheduleRetry();
      }
    };
    conn.on('close', drop);
    conn.on('error', drop);
  }

  function scheduleRetry() {
    if (closed || retryTimer) return;
    retryTimer = timers.setTimeout(() => { retryTimer = null; connectGuest(); }, RETRY_MS);
  }

  function connectGuest() {
    if (closed || !peer || peer.destroyed) return;
    if (peer.disconnected) { try { peer.reconnect(); } catch { /* retried below */ } }
    const conn = peer.connect(hostPeerId(code), { reliable: true, serialization: 'raw' });
    if (!conn) { scheduleRetry(); return; }
    timers.clearTimeout(connectTimer);
    connectTimer = timers.setTimeout(() => {
      if (conn.open || closed) return;
      try { conn.close(); } catch { /* ignore */ }
      connections.delete(conn);
      setStatus({ state: 'connecting', message: `Still trying room ${code}. Make sure the instructor console shows this code. If it never connects, this network may block computer to computer connections.` });
      scheduleRetry();
    }, connectTimeoutMs);
    adopt(conn);
  }

  let PeerClass = PeerImpl;
  let idAttempts = 0;

  async function start() {
    try {
      if (!PeerClass) PeerClass = await loadPeerLibrary();
    } catch (error) {
      setStatus({ state: 'error', message: error.message });
      return;
    }
    if (closed) return;
    createPeer();
    scanTimer = timers.setInterval(() => flushStorage(), STORAGE_SCAN_MS);
  }

  function createPeer() {
    if (closed) return;
    const options = { debug: 0, config: { iceServers: ICE_SERVERS }, ...peerOptions };
    peer = role === 'host' ? new PeerClass(hostPeerId(code), options) : new PeerClass(options);
    peer.on('open', () => {
      if (role === 'host') setStatus({ state: openConnections().length ? 'connected' : 'waiting', message: openConnections().length ? '' : 'Waiting for a student computer.' });
      else { setStatus({ state: 'connecting', message: `Joining room ${code}...` }); connectGuest(); }
    });
    if (role === 'host') peer.on('connection', (conn) => adopt(conn));
    peer.on('disconnected', () => {
      // Lost the broker only; open data channels keep working. Re-register so
      // a student computer that reloads can find this room again.
      if (!closed) timers.setTimeout(() => { try { if (!closed && peer.disconnected) peer.reconnect(); } catch { /* ignore */ } }, RETRY_MS);
    });
    peer.on('error', (error) => {
      if (closed) return;
      const type = error?.type ?? '';
      if (role === 'guest' && type === 'peer-unavailable') {
        setStatus({ state: 'connecting', message: `No instructor console is using room ${code} right now. Retrying...` });
        scheduleRetry();
      } else if (role === 'host' && type === 'unavailable-id') {
        // Right after a reload the service can still hold this room for a few
        // seconds. Wait it out, then give up and say so.
        idAttempts += 1;
        try { peer.destroy(); } catch { /* ignore */ }
        if (idAttempts <= 6) {
          setStatus({ state: 'starting', message: `Reopening room ${code}...` });
          timers.setTimeout(createPeer, RETRY_MS);
        } else {
          setStatus({ state: 'error', message: `Room ${code} is already open in another console. Close it there or start a new room.`, reason: 'room-taken' });
        }
      } else if (['network', 'server-error', 'socket-error', 'socket-closed'].includes(type)) {
        setStatus({ state: role === 'host' ? 'error' : 'connecting', message: 'Cannot reach the link service. Check the internet connection. Retrying...' });
        if (role === 'guest') scheduleRetry();
        else timers.setTimeout(() => { try { if (!closed && peer.disconnected) peer.reconnect(); } catch { /* ignore */ } }, RETRY_MS);
      } else if (type === 'browser-incompatible') {
        setStatus({ state: 'error', message: 'This browser cannot make the link. Use current Chrome or Edge.' });
      } else {
        setStatus({ message: error?.message ?? String(error) });
      }
    });
  }

  setStatus({ state: 'starting', message: role === 'host' ? 'Opening the room...' : `Joining room ${code}...` });
  start();

  return {
    role,
    code,
    getStatus: () => ({ ...status }),
    close() {
      if (closed) return;
      closed = true;
      timers.clearInterval(scanTimer);
      timers.clearTimeout(retryTimer);
      timers.clearTimeout(connectTimer);
      timers.clearTimeout(snapshotTimer);
      for (const conn of connections) { try { conn.close(); } catch { /* ignore */ } }
      connections.clear();
      for (const { channel, listener } of channels.values()) {
        channel.removeEventListener('message', listener);
        channel.close();
      }
      try { peer?.destroy(); } catch { /* ignore */ }
      status = { state: 'off', code, peers: 0, message: '' };
      onStatus({ ...status });
    },
  };
}

/* Runs the bridge in whichever tab holds the lock, and keeps every tab's
   status display current. Returns a controller for the link widgets. */
export function createLinkManager({
  role,
  storage = globalThis.localStorage,
  locks = globalThis.navigator?.locks ?? null,
  BroadcastChannelImpl = globalThis.BroadcastChannel,
  linkFactory = createRemoteLink,
  random = Math.random,
} = {}) {
  const listeners = new Set();
  const statusChannel = typeof BroadcastChannelImpl === 'function' ? new BroadcastChannelImpl(`${LINK_STATUS_CHANNEL}-${role}`) : null;
  const roomKey = `${LINK_ROOM_KEY}.${role}`;
  const lockName = `${LINK_LOCK}-${role}`;
  let link = null;
  let releaseLock = null;
  let status = { state: 'off', code: readRoom(), peers: 0, message: '', here: false };

  function readRoom() {
    try { return normalizeRoomCode(storage?.getItem(roomKey)); } catch { return null; }
  }
  function writeRoom(code) {
    try {
      if (code) storage?.setItem(roomKey, code); else storage?.removeItem(roomKey);
    } catch { /* storage blocked */ }
  }
  function emit(next, { broadcast = true } = {}) {
    status = next;
    for (const listener of listeners) listener({ ...status });
    if (broadcast && statusChannel) statusChannel.postMessage({ ...status, here: false });
  }
  let generation = 0;

  function runLink(code) {
    link = linkFactory({ role, code, storage, BroadcastChannelImpl, onStatus: (s) => emit({ ...s, here: true }) });
  }

  async function connect(code, { takeOver = true } = {}) {
    const clean = normalizeRoomCode(code);
    if (!clean) return { ok: false, reason: 'Enter the 6 character room code from the instructor console.' };
    disconnect({ keepRoom: true });
    writeRoom(clean);
    const mine = ++generation;
    if (locks?.request) {
      // Wait for the lock. A new code from this tab takes over from the tab
      // running the link; a page that just opened only queues behind it.
      if (takeOver) statusChannel?.postMessage({ restart: clean });
      else statusChannel?.postMessage({ ask: true });
      if (takeOver) emit({ state: 'starting', code: clean, peers: 0, message: 'Starting the link...', here: false }, { broadcast: false });
      locks.request(lockName, () => new Promise((resolve) => {
        if (mine !== generation || readRoom() !== clean || link) { resolve(); return; }
        releaseLock = resolve;
        runLink(clean);
      }));
    } else {
      runLink(clean);
    }
    return { ok: true, code: clean };
  }

  function disconnect({ keepRoom = false } = {}) {
    const running = link;
    link = null;
    running?.close();
    releaseLock?.();
    releaseLock = null;
    if (!keepRoom) {
      writeRoom(null);
      statusChannel?.postMessage({ stop: true });
      emit({ state: 'off', code: null, peers: 0, message: '', here: false });
    }
  }

  statusChannel?.addEventListener('message', (event) => {
    const data = event?.data;
    if (!data || typeof data !== 'object') return;
    if (data.stop) {
      generation += 1;
      if (link) disconnect({ keepRoom: true });
      emit({ state: 'off', code: null, peers: 0, message: '', here: false }, { broadcast: false });
    } else if (data.restart) {
      generation += 1;
      if (link) disconnect({ keepRoom: true });
    } else if (data.ask) {
      if (link) statusChannel.postMessage({ ...status, here: false });
    } else if (typeof data.state === 'string' && !link) {
      // Another tab runs the link; show its status here.
      emit({ ...data, here: false }, { broadcast: false });
    }
  });

  return {
    role,
    getStatus: () => ({ ...status }),
    subscribe(listener) { listeners.add(listener); listener({ ...status }); return () => listeners.delete(listener); },
    /* Host: open a room (new code unless one is saved). Guest: join a code. */
    start(code = null) {
      if (role === 'host') return connect(code ?? readRoom() ?? makeRoomCode(random));
      return connect(code);
    },
    newRoom() { return connect(makeRoomCode(random)); },
    /* Picks up a saved room after a reload. */
    resume() {
      const code = readRoom();
      if (code) return connect(code, { takeOver: false });
      statusChannel?.postMessage({ ask: true });
      return Promise.resolve({ ok: false });
    },
    stop: () => disconnect(),
  };
}
