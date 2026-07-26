import { beforeEach, describe, expect, it } from 'vitest';
import {
  createLiveSimTransport,
  LEARNER_MONITOR_KEYS,
  projectLearnerMonitorSnapshot,
} from '../../ui/liveSimTransport.js';

class FakeBroadcastChannel {
  static rooms = new Map();

  static reset() { this.rooms.clear(); }

  constructor(name) {
    this.name = name;
    this.listeners = new Set();
    this.closed = false;
    const room = FakeBroadcastChannel.rooms.get(name) || new Set();
    room.add(this);
    FakeBroadcastChannel.rooms.set(name, room);
  }

  addEventListener(type, listener) {
    if (type === 'message') this.listeners.add(listener);
  }

  removeEventListener(type, listener) {
    if (type === 'message') this.listeners.delete(listener);
  }

  postMessage(data) {
    for (const peer of FakeBroadcastChannel.rooms.get(this.name) || []) {
      if (peer === this || peer.closed) continue;
      for (const listener of peer.listeners) listener({ data });
    }
  }

  close() {
    this.closed = true;
    this.listeners.clear();
    FakeBroadcastChannel.rooms.get(this.name)?.delete(this);
  }
}

beforeEach(() => FakeBroadcastChannel.reset());

describe('live simulation transport', () => {
  it('publishes snapshots without exposing BroadcastChannel to callers', () => {
    const instructor = createLiveSimTransport({
      role: 'instructor', BroadcastChannelImpl: FakeBroadcastChannel,
      sessionId: 'session-a', sessionStartedAt: 100,
    });
    const display = createLiveSimTransport({
      role: 'display', BroadcastChannelImpl: FakeBroadcastChannel,
    });
    const received = [];
    display.subscribe((message) => received.push(message));

    instructor.publishSnapshot({ hr: 88 });

    expect(received).toHaveLength(1);
    expect(received[0]).toMatchObject({
      type: 'snapshot', sessionId: 'session-a', sequence: 1, payload: { hr: 88 },
    });
    expect('channel' in display).toBe(false);
  });

  it('answers late-join and heartbeat requests with a fresh sequence', () => {
    const instructor = createLiveSimTransport({
      role: 'instructor', BroadcastChannelImpl: FakeBroadcastChannel,
      sessionId: 'session-a', sessionStartedAt: 100,
    });
    instructor.publishSnapshot({ hr: 91, tofRatio: 0.72 });

    const display = createLiveSimTransport({
      role: 'display', BroadcastChannelImpl: FakeBroadcastChannel,
    });
    const received = [];
    display.subscribe((message) => received.push(message));
    display.requestState();
    display.requestState();

    expect(received.at(-1)).toMatchObject({
      type: 'snapshot', payload: { hr: 91, tofRatio: 0.72 },
    });
    expect(received.map((message) => message.sequence)).toEqual([2, 3]);
  });

  it('rejects out-of-order snapshots and replaces state for a newer instructor session', () => {
    const display = createLiveSimTransport({
      role: 'display', BroadcastChannelImpl: FakeBroadcastChannel,
    });
    const sender = new FakeBroadcastChannel('crna-overlord-live-sim-v1');
    const received = [];
    display.subscribe((message) => received.push(message));

    sender.postMessage({ protocol: 1, type: 'snapshot', sessionId: 'old', sessionStartedAt: 100, sequence: 2, payload: { hr: 80 } });
    sender.postMessage({ protocol: 1, type: 'snapshot', sessionId: 'old', sessionStartedAt: 100, sequence: 1, payload: { hr: 70 } });
    sender.postMessage({ protocol: 1, type: 'snapshot', sessionId: 'new', sessionStartedAt: 200, sequence: 1, payload: { hr: 90 } });
    sender.postMessage({ protocol: 1, type: 'snapshot', sessionId: 'old', sessionStartedAt: 100, sequence: 3, payload: { hr: 60 } });

    expect(received.map((message) => message.payload.hr)).toEqual([80, 90]);
    expect(received[1].sessionChanged).toBe(true);
  });

  it('publishes only allowlisted monitor keys even when handed a raw runner snapshot', () => {
    const instructor = createLiveSimTransport({
      role: 'instructor', BroadcastChannelImpl: FakeBroadcastChannel,
      sessionId: 'session-a', sessionStartedAt: 100,
    });
    const display = createLiveSimTransport({
      role: 'display', BroadcastChannelImpl: FakeBroadcastChannel,
    });
    const received = [];
    display.subscribe((message) => received.push(message));

    instructor.publishSnapshot({
      t: 10, hr: 88, dbp: 70,
      instructorGuide: { answer: 'postpone' },
      rubricNotes: ['answer key'],
    });

    expect(received).toHaveLength(1);
    expect(received[0].payload).toEqual({ t: 10, hr: 88, dbp: 70 });
    expect(JSON.stringify(received[0].payload)).not.toMatch(/postpone|answer key/);
  });

  it('keeps the late-join payload immune to caller mutation after publishing', () => {
    const instructor = createLiveSimTransport({
      role: 'instructor', BroadcastChannelImpl: FakeBroadcastChannel,
      sessionId: 'session-a', sessionStartedAt: 100,
    });
    const projected = projectLearnerMonitorSnapshot({ t: 12, hr: 88, dbp: 70 });
    instructor.publishSnapshot(projected);

    projected.hr = 999;
    projected.instructorGuide = { answer: 'postpone' };

    const display = createLiveSimTransport({
      role: 'display', BroadcastChannelImpl: FakeBroadcastChannel,
    });
    const received = [];
    display.subscribe((message) => received.push(message));
    display.requestState();

    expect(received).toHaveLength(1);
    expect(received[0].payload).toEqual({ t: 12, hr: 88, dbp: 70 });
    expect(JSON.stringify(received[0].payload)).not.toMatch(/postpone/);
  });

  it('removes listeners and closes cleanly', () => {
    const instructor = createLiveSimTransport({
      role: 'instructor', BroadcastChannelImpl: FakeBroadcastChannel,
      sessionId: 'session-a', sessionStartedAt: 100,
    });
    const display = createLiveSimTransport({
      role: 'display', BroadcastChannelImpl: FakeBroadcastChannel,
    });
    const received = [];
    display.subscribe((message) => received.push(message));

    display.close();
    instructor.publishSnapshot({ hr: 88 });

    expect(received).toEqual([]);
    expect(() => display.requestState()).toThrow(/closed/);
  });
});

describe('learner monitor snapshot projection', () => {
  it('projects only allowlisted monitor keys and drops case guidance', () => {
    const projected = projectLearnerMonitorSnapshot({
      t: 10, hr: 88, dbp: 70, patient: '70 kg · 40 y · Female',
      instructorGuide: { answer: 'postpone' },
      concealedFindings: ['MH'], expectedResponse: 'avoid volatile',
      rubricNotes: ['answer key'], caseContext: { private: true },
    });

    expect(projected).toEqual({ t: 10, hr: 88, dbp: 70, patient: '70 kg · 40 y · Female' });
    expect(JSON.stringify(projected)).not.toMatch(/postpone|MH|answer key|private/);
  });

  it('omits absent allowlisted keys instead of inventing them', () => {
    expect(projectLearnerMonitorSnapshot({ hr: 55 })).toEqual({ hr: 55 });
    expect(projectLearnerMonitorSnapshot()).toEqual({});
  });

  it('exposes a frozen allowlist without instructor fields', () => {
    expect(Object.isFrozen(LEARNER_MONITOR_KEYS)).toBe(true);
    expect(LEARNER_MONITOR_KEYS).toContain('hr');
    expect(LEARNER_MONITOR_KEYS).toContain('capnogramPresent');
    for (const forbidden of [
      'instructorGuide', 'concealedFindings', 'expectedResponse', 'rubricNotes', 'caseContext',
    ]) {
      expect(LEARNER_MONITOR_KEYS).not.toContain(forbidden);
    }
  });

  it('is unaffected by later mutation of the source snapshot', () => {
    const source = { t: 5, hr: 60, spo2: 99 };
    const projected = projectLearnerMonitorSnapshot(source);

    source.hr = 999;
    source.spo2 = 0;
    source.instructorGuide = { answer: 'postpone' };

    expect(projected).toEqual({ t: 5, hr: 60, spo2: 99 });
  });
});
