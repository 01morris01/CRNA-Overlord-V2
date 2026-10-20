/* Instructor computer <-> student computer link: the bridge carries the
   same BroadcastChannel messages between two computers and copies the shared
   localStorage work across before the message that refers to it. Two
   computers are simulated with separate channel buses and storages, joined
   by a fake PeerJS. */
import { describe, expect, it } from 'vitest';
import {
  LINK_CHANNELS, VIA_LINK, createRemoteLink, createStorageSync, hostPeerId, isSyncedKey, joinUrl, makeRoomCode, normalizeRoomCode,
} from '../../ui/remoteLink.js';
import { STUDENT_CHANNEL, createStudentChannel } from '../../ui/studentChannel.js';
import { LIVE_SIM_CHANNEL } from '../../ui/liveSimTransport.js';

function memoryStorage() {
  const map = new Map();
  return {
    get length() { return map.size; },
    key: (i) => [...map.keys()][i] ?? null,
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
  };
}

/* One computer's BroadcastChannel: delivers to every other instance with
   the same name, never to the sender, synchronously for test clarity. */
function busFor() {
  const instances = new Set();
  return class FakeBroadcastChannel {
    constructor(name) { this.name = name; this.listeners = new Set(); instances.add(this); }
    addEventListener(type, fn) { if (type === 'message') this.listeners.add(fn); }
    removeEventListener(type, fn) { this.listeners.delete(fn); }
    postMessage(data) {
      const copy = structuredClone(data);
      for (const other of instances) if (other !== this && other.name === this.name) for (const fn of other.listeners) fn({ data: copy });
    }
    close() { instances.delete(this); }
  };
}

function fakePeerNetwork() {
  const peers = new Map();
  class Emitter {
    constructor() { this.handlers = {}; }
    on(event, fn) { (this.handlers[event] ??= []).push(fn); return this; }
    emit(event, ...args) { for (const fn of this.handlers[event] ?? []) fn(...args); }
  }
  class FakeConn extends Emitter {
    constructor() { super(); this.open = false; this.other = null; this.sent = []; }
    send(text) { this.sent.push(text); this.other.emit('data', text); }
    close() { if (!this.open) return; this.open = false; this.emit('close'); if (this.other.open) this.other.close(); }
  }
  class FakePeer extends Emitter {
    constructor(id) {
      super();
      this.id = typeof id === 'string' ? id : `guest-${Math.random()}`;
      peers.set(this.id, this);
      this.disconnected = false; this.destroyed = false;
      queueMicrotask(() => this.emit('open', this.id));
    }
    connect(targetId) {
      const local = new FakeConn();
      const target = peers.get(targetId);
      if (!target) { queueMicrotask(() => this.emit('error', { type: 'peer-unavailable' })); return local; }
      const remote = new FakeConn();
      local.other = remote; remote.other = local;
      target.emit('connection', remote);
      queueMicrotask(() => { local.open = true; remote.open = true; remote.emit('open'); local.emit('open'); });
      return local;
    }
    reconnect() {}
    destroy() { this.destroyed = true; peers.delete(this.id); }
  }
  return FakePeer;
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
const timers = {
  setTimeout: (fn, ms) => setTimeout(fn, ms), clearTimeout: (t) => clearTimeout(t),
  setInterval: () => 0, clearInterval: () => {},
};

async function twoComputers() {
  const Peer = fakePeerNetwork();
  const code = 'K7Q4MX';
  const instructor = { BC: busFor(), storage: memoryStorage(), statuses: [] };
  const student = { BC: busFor(), storage: memoryStorage(), statuses: [] };
  instructor.link = createRemoteLink({ role: 'host', code, PeerImpl: Peer, BroadcastChannelImpl: instructor.BC, storage: instructor.storage, timers, onStatus: (s) => instructor.statuses.push(s) });
  await flush();
  student.link = createRemoteLink({ role: 'guest', code, PeerImpl: Peer, BroadcastChannelImpl: student.BC, storage: student.storage, timers, onStatus: (s) => student.statuses.push(s) });
  await flush(); await flush();
  return { instructor, student };
}

describe('room codes', () => {
  it('makes 6 character codes without look alike characters and reads what people type', () => {
    const code = makeRoomCode(() => 0.5);
    expect(code).toMatch(/^[A-Z2-9]{6}$/);
    expect(normalizeRoomCode(' k7q-4mx ')).toBe('K7Q4MX');
    expect(normalizeRoomCode('K7Q4M')).toBeNull();
    expect(normalizeRoomCode('ABCDE0')).toBeNull();
    expect(hostPeerId('K7Q4MX')).toBe('crna-overlord-room-K7Q4MX');
    expect(joinUrl('K7Q4MX', 'https://x.app')).toBe('https://x.app/student.html?room=K7Q4MX');
  });
});

describe('shared storage', () => {
  it('only copies student work keys and reports changes once', () => {
    expect(isSyncedKey('overlord.careplan.v1.p52')).toBe(true);
    expect(isSyncedKey('overlord.student.session.v1')).toBe(true);
    expect(isSyncedKey('overlord.link.room.v1.host')).toBe(false);
    const storage = memoryStorage();
    const sync = createStorageSync(storage);
    storage.setItem('overlord.careplan.v1.p52', '{"a":1}');
    storage.setItem('unrelated', 'x');
    expect(sync.scan()).toEqual({ 'overlord.careplan.v1.p52': '{"a":1}' });
    expect(sync.scan()).toEqual({});
    sync.apply({ 'overlord.interview.v1.p52': '[]' });
    expect(sync.scan()).toEqual({});
    storage.setItem('overlord.interview.v1.p52', 'mine');
    sync.apply({ 'overlord.interview.v1.p52': 'theirs' }, { onlyMissing: true });
    expect(storage.getItem('overlord.interview.v1.p52')).toBe('mine');
  });
});

describe('the bridge between two computers', () => {
  it('connects and reports it on both sides', async () => {
    const { instructor, student } = await twoComputers();
    expect(instructor.statuses.at(-1)).toMatchObject({ state: 'connected', peers: 1 });
    expect(student.statuses.at(-1)).toMatchObject({ state: 'connected' });
  });

  it('carries student channel messages both ways, with the care plan record first', async () => {
    const { instructor, student } = await twoComputers();
    const consoleChannel = createStudentChannel({ role: 'console', BroadcastChannelImpl: instructor.BC });
    const studentChannel = createStudentChannel({ role: 'student', BroadcastChannelImpl: student.BC });
    const heardByConsole = [];
    consoleChannel.subscribe((message) => heardByConsole.push({ message, plan: instructor.storage.getItem('overlord.careplan.v1.p52') }));
    student.storage.setItem('overlord.careplan.v1.p52', '{"submittedAt":1}');
    studentChannel.post({ type: 'student-plan', patientId: 'p52' });
    await flush();
    const plan = heardByConsole.find((entry) => entry.message.type === 'student-plan');
    expect(plan.plan).toBe('{"submittedAt":1}');

    const heardByStudent = [];
    studentChannel.subscribe((message) => heardByStudent.push(message));
    consoleChannel.post({ type: 'instructor-advance', patientId: 'p52', step: 'or' });
    await flush();
    expect(heardByStudent).toContainEqual({ type: 'instructor-advance', patientId: 'p52', step: 'or' });
  });

  it('never sends a replayed message back, so the computers cannot echo', async () => {
    const { instructor, student } = await twoComputers();
    const listener = new instructor.BC(STUDENT_CHANNEL);
    const got = [];
    listener.addEventListener('message', (event) => got.push(event.data));
    const studentPage = new student.BC(STUDENT_CHANNEL);
    studentPage.postMessage({ protocol: 1, type: 'student-hello' });
    await flush(); await flush();
    expect(got.filter((m) => m.type === 'student-hello').length).toBeGreaterThanOrEqual(1);
    expect(got.every((m) => m[VIA_LINK] === true)).toBe(true);
    // A replayed message heard by a bridge is not sent again.
    const before = got.length;
    new instructor.BC(STUDENT_CHANNEL).postMessage({ protocol: 1, type: 'student-hello', [VIA_LINK]: true });
    await flush();
    const studentHeard = [];
    studentPage.addEventListener('message', (event) => studentHeard.push(event.data));
    await flush();
    expect(studentHeard).toEqual([]);
    expect(got.length).toBe(before + 1);
  });

  it('thins monitor snapshots to about ten a second and keeps the newest', async () => {
    const { instructor, student } = await twoComputers();
    const display = new student.BC(LIVE_SIM_CHANNEL);
    const frames = [];
    display.addEventListener('message', (event) => { if (event.data.type === 'snapshot') frames.push(event.data.sequence); });
    const consolePage = new instructor.BC(LIVE_SIM_CHANNEL);
    for (let i = 1; i <= 30; i += 1) consolePage.postMessage({ protocol: 1, type: 'snapshot', sequence: i, sessionId: 's', sessionStartedAt: 0, payload: {} });
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(frames.length).toBeLessThanOrEqual(3);
    expect(frames.at(-1)).toBe(30);
  });

  it('asks the console for the current monitor state as soon as it connects', async () => {
    const Peer = fakePeerNetwork();
    const BC = busFor();
    const consolePage = new BC(LIVE_SIM_CHANNEL);
    const requests = [];
    consolePage.addEventListener('message', (event) => { if (event.data.type === 'state-request') requests.push(event.data); });
    createRemoteLink({ role: 'host', code: 'K7Q4MX', PeerImpl: Peer, BroadcastChannelImpl: BC, storage: memoryStorage(), timers });
    await flush();
    createRemoteLink({ role: 'guest', code: 'K7Q4MX', PeerImpl: Peer, BroadcastChannelImpl: busFor(), storage: memoryStorage(), timers });
    await flush(); await flush();
    expect(requests).toHaveLength(1);
    expect(LINK_CHANNELS).toEqual([STUDENT_CHANNEL, LIVE_SIM_CHANNEL]);
  });

  it('tells the student when no console has that room yet', async () => {
    const Peer = fakePeerNetwork();
    const statuses = [];
    const link = createRemoteLink({ role: 'guest', code: 'K7Q4MX', PeerImpl: Peer, BroadcastChannelImpl: busFor(), storage: memoryStorage(), timers, onStatus: (s) => statuses.push(s) });
    await flush(); await flush();
    expect(statuses.at(-1).message).toMatch(/No instructor console is using room K7Q4MX/);
    link.close();
    expect(statuses.at(-1).state).toBe('off');
  });
});
