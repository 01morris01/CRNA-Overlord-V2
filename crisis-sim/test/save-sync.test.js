// save-sync.test.js — the server that makes progress follow a person, and the client policy that decides
// which copy wins when two devices disagree.
//
// It lives in crisis-sim/test/ because that is where `npm test` looks; the code under test is at the
// repository root (server/, core/). One test command for the repository is worth the odd path.
//
// The client half is exercised against a real HTTP server with a stub localStorage, not against a mocked
// transport. The thing most likely to lose someone's work is the agreement between the two halves, and a
// mock of one half cannot show a disagreement with the other.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mkdtempSync, rmSync, readdirSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { openStore } from '../../server/store.mjs';
import { start, tlsPlan, isTailnetName } from '../../server/overlord-server.mjs';

let dir;
beforeEach(() => { dir = mkdtempSync(join(tmpdir(), 'overlord-sync-')); });
afterEach(() => { try { rmSync(dir, { recursive: true, force: true }); } catch { /* windows holds files */ } });

// ---------------------------------------------------------------- accounts

describe('accounts', () => {
  it('registers, then signs in with the same password', async () => {
    const s = openStore(dir);
    const reg = await s.register('Shawn', 'hunter2!');
    expect(reg.ok).toBe(true);
    expect(reg.token).toMatch(/^[0-9a-f]{64}$/);

    const log = await s.login('Shawn', 'hunter2!');
    expect(log.ok).toBe(true);
    expect(log.displayName).toBe('Shawn');
    expect(log.token).not.toBe(reg.token);      // a fresh token per sign-in
  });

  it('matches the username case-insensitively but keeps the name as typed', async () => {
    const s = openStore(dir);
    await s.register('ShawnM', 'hunter2!');
    const log = await s.login('shawnm', 'hunter2!');
    expect(log.ok).toBe(true);
    expect(log.displayName).toBe('ShawnM');
  });

  it('refuses a wrong password', async () => {
    const s = openStore(dir);
    await s.register('Shawn', 'hunter2!');
    const bad = await s.login('Shawn', 'hunter3!');
    expect(bad.ok).toBe(false);
    expect(bad.code).toBe(401);
  });

  it('says the same thing for an unknown user as for a wrong password', async () => {
    const s = openStore(dir);
    await s.register('Shawn', 'hunter2!');
    const unknown = await s.login('nobody', 'whatever');
    const wrong = await s.login('Shawn', 'whatever');
    expect(unknown.error).toBe(wrong.error);    // the difference would enumerate usernames
    expect(unknown.code).toBe(401);
  });

  it('refuses a duplicate username', async () => {
    const s = openStore(dir);
    await s.register('Shawn', 'hunter2!');
    const again = await s.register('shawn', 'different');
    expect(again.ok).toBe(false);
    expect(again.code).toBe(409);
  });

  it('refuses a short username or password', async () => {
    const s = openStore(dir);
    expect((await s.register('a', 'hunter2!')).code).toBe(400);
    expect((await s.register('Shawn', 'abc')).code).toBe(400);
  });

  it('stores no password and no reversible hash', async () => {
    const s = openStore(dir);
    await s.register('Shawn', 'hunter2!');
    const raw = readFileSync(join(dir, 'users.json'), 'utf8');
    expect(raw).not.toContain('hunter2!');
    const rec = JSON.parse(raw).shawn;
    expect(rec.pw).toMatch(/^pbkdf2\$sha512\$\d{6,}\$/);  // salted, and the cost is recorded in the record
    const [, , iter] = rec.pw.split('$');
    expect(Number(iter)).toBeGreaterThanOrEqual(210000);
  });

  it('salts per account, so two people with one password do not share a hash', async () => {
    const s = openStore(dir);
    await s.register('Ann', 'same-password');
    await s.register('Bob', 'same-password');
    const users = JSON.parse(readFileSync(join(dir, 'users.json'), 'utf8'));
    expect(users.ann.pw).not.toBe(users.bob.pw);
  });

  it('accepts a username with a space or non-Latin letters and keeps it off the filesystem', async () => {
    const s = openStore(dir);
    const reg = await s.register('Ana María', 'hunter2!');
    expect(reg.ok).toBe(true);
    s.write('ana maría', 'world', 0, { hello: true });
    const files = readdirSync(join(dir, 'saves'));
    expect(files).toHaveLength(1);
    expect(files[0]).toMatch(/^[0-9a-f]{64}__world\.json$/);   // hashed, not the name
    expect(s.read('ana maría', 'world').data).toEqual({ hello: true });
  });

  it('throttles repeated wrong passwords for one username', async () => {
    const s = openStore(dir);
    await s.register('Shawn', 'hunter2!');
    for (let i = 0; i < 10; i++) await s.login('Shawn', 'wrong');
    const now = await s.login('Shawn', 'hunter2!');     // the right password, but too late
    expect(now.ok).toBe(false);
    expect(now.code).toBe(429);
  });
});

describe('tokens', () => {
  it('resolves a token to its account and forgets it on revoke', async () => {
    const s = openStore(dir);
    const { token } = await s.register('Shawn', 'hunter2!');
    expect(s.whoIs(token)).toMatchObject({ userId: 'shawn', displayName: 'Shawn' });
    expect(s.revoke(token)).toBe(true);
    expect(s.whoIs(token)).toBe(null);
  });

  it('rejects an unknown or empty token', async () => {
    const s = openStore(dir);
    await s.register('Shawn', 'hunter2!');
    expect(s.whoIs('f'.repeat(64))).toBe(null);
    expect(s.whoIs('')).toBe(null);
    expect(s.whoIs(undefined)).toBe(null);
  });

  it('stores only a hash of the token, so the file does not grant access', async () => {
    const s = openStore(dir);
    const { token } = await s.register('Shawn', 'hunter2!');
    expect(readFileSync(join(dir, 'tokens.json'), 'utf8')).not.toContain(token);
  });

  it('survives a restart, so a phone is not signed out when the box reboots', async () => {
    const a = openStore(dir);
    const { token } = await a.register('Shawn', 'hunter2!');
    const b = openStore(dir);                       // a fresh process reading the same directory
    expect(b.whoIs(token)).toMatchObject({ userId: 'shawn' });
  });
});

// ---------------------------------------------------------------- save slots

describe('save slots', () => {
  it('starts empty at revision zero', () => {
    const s = openStore(dir);
    expect(s.read('shawn', 'world')).toEqual({ rev: 0, updatedAt: null, data: null });
  });

  it('accepts a write on the revision the caller actually holds', () => {
    const s = openStore(dir);
    expect(s.write('shawn', 'world', 0, { visits: 1 })).toMatchObject({ ok: true, rev: 1 });
    expect(s.write('shawn', 'world', 1, { visits: 2 })).toMatchObject({ ok: true, rev: 2 });
    expect(s.read('shawn', 'world').data).toEqual({ visits: 2 });
  });

  it('refuses a write built on a stale revision and leaves the stored save alone', () => {
    const s = openStore(dir);
    s.write('shawn', 'world', 0, { from: 'laptop' });
    s.write('shawn', 'world', 1, { from: 'phone' });

    const stale = s.write('shawn', 'world', 1, { from: 'laptop, second try' });
    expect(stale.ok).toBe(false);
    expect(stale.code).toBe(409);
    expect(stale.server.data).toEqual({ from: 'phone' });
    expect(s.read('shawn', 'world').data).toEqual({ from: 'phone' });   // untouched
  });

  it('keeps the refused copy rather than discarding it', () => {
    const s = openStore(dir);
    s.write('shawn', 'world', 0, { from: 'laptop' });
    s.write('shawn', 'world', 1, { from: 'phone' });
    s.write('shawn', 'world', 1, { from: 'the one that lost' });

    const files = readdirSync(join(dir, 'conflicts'));
    expect(files).toHaveLength(1);
    const kept = JSON.parse(readFileSync(join(dir, 'conflicts', files[0]), 'utf8'));
    expect(kept.data).toEqual({ from: 'the one that lost' });
    expect(kept.serverRev).toBe(2);
  });

  it('keeps the two slots apart', () => {
    const s = openStore(dir);
    s.write('shawn', 'app', 0, { which: 'classic' });
    s.write('shawn', 'world', 0, { which: 'institute' });
    expect(s.read('shawn', 'app').data).toEqual({ which: 'classic' });
    expect(s.read('shawn', 'world').data).toEqual({ which: 'institute' });
  });

  it('keeps two accounts apart', () => {
    const s = openStore(dir);
    s.write('ann', 'world', 0, { who: 'ann' });
    s.write('bob', 'world', 0, { who: 'bob' });
    expect(s.read('ann', 'world').data).toEqual({ who: 'ann' });
    expect(s.read('bob', 'world').data).toEqual({ who: 'bob' });
  });

  it('refuses an unknown slot name', () => {
    const s = openStore(dir);
    expect(() => s.read('shawn', '../../etc/passwd')).toThrow();
    expect(() => s.write('shawn', 'anything', 0, {})).toThrow();
  });

  it('refuses a blob past the ceiling', () => {
    const s = openStore(dir);
    const huge = { pad: 'x'.repeat(5 * 1024 * 1024) };
    expect(s.write('shawn', 'world', 0, huge)).toMatchObject({ ok: false, code: 413 });
    expect(s.read('shawn', 'world').rev).toBe(0);
  });

  it('leaves no partial file behind when a write lands', () => {
    const s = openStore(dir);
    s.write('shawn', 'world', 0, { visits: 1 });
    expect(readdirSync(join(dir, 'saves')).filter((f) => f.includes('.tmp'))).toHaveLength(0);
  });
});

// ---------------------------------------------------------------- over HTTP

async function withServer(fn) {
  const srv = start({ port: 0, httpsPort: 0, data: dir, root: join(import.meta.dirname, '..', '..'), cert: null, key: null });
  await new Promise((r) => srv.servers[0].once('listening', r));
  const base = `http://127.0.0.1:${srv.servers[0].address().port}`;
  try { await fn(base, srv); } finally { await srv.close(); }
}

const call = (base, path, opts = {}) => fetch(base + path, {
  method: opts.method || 'GET',
  headers: {
    ...(opts.token ? { authorization: `Bearer ${opts.token}` } : {}),
    ...(opts.body ? { 'content-type': 'application/json' } : {}),
  },
  body: opts.body ? JSON.stringify(opts.body) : undefined,
});

describe('over HTTP', () => {
  it('announces itself, so a client can tell a synced host from a static one', async () => {
    await withServer(async (base) => {
      const r = await call(base, '/api/sync/health');
      expect(r.status).toBe(200);
      expect(await r.json()).toMatchObject({ ok: true, sync: true });
    });
  });

  it('registers, stores a save and reads it back', async () => {
    await withServer(async (base) => {
      const reg = await (await call(base, '/api/sync/register', { method: 'POST', body: { username: 'Shawn', password: 'hunter2!' } })).json();
      expect(reg.ok).toBe(true);

      const empty = await (await call(base, '/api/sync/save?slot=world', { token: reg.token })).json();
      expect(empty).toMatchObject({ rev: 0, data: null });

      const put = await (await call(base, '/api/sync/save?slot=world', { method: 'PUT', token: reg.token, body: { baseRev: 0, data: { visits: 3 } } })).json();
      expect(put).toMatchObject({ ok: true, rev: 1 });

      const got = await (await call(base, '/api/sync/save?slot=world', { token: reg.token })).json();
      expect(got.data).toEqual({ visits: 3 });
    });
  });

  it('turns away a request with no token, a bad token, or a bad slot', async () => {
    await withServer(async (base) => {
      const reg = await (await call(base, '/api/sync/register', { method: 'POST', body: { username: 'Shawn', password: 'hunter2!' } })).json();
      expect((await call(base, '/api/sync/save?slot=world')).status).toBe(401);
      expect((await call(base, '/api/sync/save?slot=world', { token: 'nope' })).status).toBe(401);
      expect((await call(base, '/api/sync/save?slot=secrets', { token: reg.token })).status).toBe(400);
    });
  });

  it('refuses a PUT without a whole-number baseRev', async () => {
    await withServer(async (base) => {
      const reg = await (await call(base, '/api/sync/register', { method: 'POST', body: { username: 'Shawn', password: 'hunter2!' } })).json();
      for (const baseRev of [undefined, -1, 1.5, '0']) {
        const r = await call(base, '/api/sync/save?slot=world', { method: 'PUT', token: reg.token, body: { baseRev, data: {} } });
        expect(r.status).toBe(400);
      }
    });
  });

  it('hands back the stored copy when a write is stale', async () => {
    await withServer(async (base) => {
      const reg = await (await call(base, '/api/sync/register', { method: 'POST', body: { username: 'Shawn', password: 'hunter2!' } })).json();
      await call(base, '/api/sync/save?slot=world', { method: 'PUT', token: reg.token, body: { baseRev: 0, data: { from: 'phone' } } });
      const r = await call(base, '/api/sync/save?slot=world', { method: 'PUT', token: reg.token, body: { baseRev: 0, data: { from: 'laptop' } } });
      expect(r.status).toBe(409);
      expect((await r.json()).server.data).toEqual({ from: 'phone' });
    });
  });

  it('forgets a token on sign-out', async () => {
    await withServer(async (base) => {
      const reg = await (await call(base, '/api/sync/register', { method: 'POST', body: { username: 'Shawn', password: 'hunter2!' } })).json();
      expect((await call(base, '/api/sync/me', { token: reg.token })).status).toBe(200);
      await call(base, '/api/sync/logout', { method: 'POST', token: reg.token });
      expect((await call(base, '/api/sync/me', { token: reg.token })).status).toBe(401);
    });
  });

  it('still serves the world, and still refuses the repository metadata', async () => {
    await withServer(async (base) => {
      const page = await call(base, '/world/index.html');
      expect(page.status).toBe(200);
      expect(await page.text()).toContain('Overlord');
      expect((await call(base, '/.git/config')).status).toBe(403);
      expect((await call(base, '/world/../../etc/passwd')).status).not.toBe(200);
    });
  });
});

// ---------------------------------------------------------------- the client's merge policy
//
// core/sync.js is browser code. Here it gets a stub localStorage and a fetch that resolves its relative
// URLs against the test server, which is enough to drive the real policy against the real server.

function fakeDevice(base) {
  const map = new Map();
  return {
    storage: {
      get length() { return map.size; },
      key: (i) => [...map.keys()][i] ?? null,
      getItem: (k) => (map.has(k) ? map.get(k) : null),
      setItem: (k, v) => { map.set(k, String(v)); },
      removeItem: (k) => { map.delete(k); },
      clear: () => map.clear(),
    },
    map,
    base,
  };
}

const nodeFetch = globalThis.fetch;

/** Point the globals that browser code expects at one device. Called before every call into that
 *  device's module, because two devices in one test must not end up sharing a localStorage. */
function activate(device) {
  globalThis.localStorage = device.storage;
  globalThis.fetch = (url, opts) => nodeFetch(String(url).startsWith('http') ? url : device.base + url, opts);
}

/** Load a private copy of core/sync.js for one device.
 *
 *  A fresh module instance per device is the point: core/sync.js remembers whether it found a server, and
 *  a phone and a laptop must be able to disagree about that. vi.resetModules() is what forces the
 *  re-evaluation — a dynamic import with a cache-busting query is not something Vite will resolve.
 *  Every export is then wrapped so the globals are switched to this device first, which is what keeps two
 *  instances from reading each other's storage. */
async function loadSyncFor(device) {
  activate(device);
  vi.resetModules();
  const mod = await import('../../core/sync.js');
  const bound = {};
  for (const k of Object.keys(mod)) {
    const v = mod[k];
    bound[k] = typeof v === 'function' ? (...a) => { activate(device); return v(...a); } : v;
  }
  await bound.probe();
  return bound;
}

const KEY = 'hemodynamic_overlord_save_shawn::world';

describe('client merge policy', () => {
  it('finds the server when there is one, and does not when there is not', async () => {
    await withServer(async (base) => {
      const d = fakeDevice(base);
      const sync = await loadSyncFor(d);
      expect(await sync.probe()).toBe(true);
    });
    const dead = fakeDevice('http://127.0.0.1:1');       // nothing listening
    const sync = await loadSyncFor(dead);
    expect(await sync.probe()).toBe(false);
  });

  it('carries progress made before there was a server up to it', async () => {
    await withServer(async (base) => {
      const d = fakeDevice(base);
      const sync = await loadSyncFor(d);
      const { token } = await sync.remoteRegister('Shawn', 'hunter2!');

      d.storage.setItem(KEY, JSON.stringify({ visits: 7, from: 'the laptop, before sync existed' }));
      const r = await sync.pullSlot('shawn', 'world', KEY, token);
      expect(r.source).toBe('local');

      const stored = openStore(dir).read('shawn', 'world');
      expect(stored.data).toMatchObject({ visits: 7 });
    });
  });

  it('brings a second device up to date', async () => {
    await withServer(async (base) => {
      const laptop = fakeDevice(base);
      const laptopSync = await loadSyncFor(laptop);
      const { token } = await laptopSync.remoteRegister('Shawn', 'hunter2!');
      laptop.storage.setItem(KEY, JSON.stringify({ visits: 7 }));
      await laptopSync.pullSlot('shawn', 'world', KEY, token);

      // A different browser with nothing in it — the phone.
      const phone = fakeDevice(base);
      const phoneSync = await loadSyncFor(phone);
      const r = await phoneSync.pullSlot('shawn', 'world', KEY, token);

      expect(r.source).toBe('server');
      expect(JSON.parse(phone.storage.getItem(KEY))).toMatchObject({ visits: 7 });
    });
  });

  it('round-trips: work on the phone shows up on the laptop', async () => {
    await withServer(async (base) => {
      const laptop = fakeDevice(base);
      const laptopSync = await loadSyncFor(laptop);
      const { token } = await laptopSync.remoteRegister('Shawn', 'hunter2!');
      laptop.storage.setItem(KEY, JSON.stringify({ visits: 1 }));
      await laptopSync.pullSlot('shawn', 'world', KEY, token);

      const phone = fakeDevice(base);
      const phoneSync = await loadSyncFor(phone);
      await phoneSync.pullSlot('shawn', 'world', KEY, token);
      phone.storage.setItem(KEY, JSON.stringify({ visits: 2, answeredOnPhone: true }));
      phoneSync.markDirty('shawn', 'world');
      expect((await phoneSync.pushSlot('shawn', 'world', KEY, token)).ok).toBe(true);

      const back = await laptopSync.pullSlot('shawn', 'world', KEY, token);
      expect(back.source).toBe('server');
      expect(JSON.parse(laptop.storage.getItem(KEY))).toMatchObject({ answeredOnPhone: true });
    });
  });

  it('prefers the server on a device that has never synced, and keeps the local copy anyway', async () => {
    await withServer(async (base) => {
      const laptop = fakeDevice(base);
      const laptopSync = await loadSyncFor(laptop);
      const { token } = await laptopSync.remoteRegister('Shawn', 'hunter2!');
      laptop.storage.setItem(KEY, JSON.stringify({ visits: 9, source: 'server copy' }));
      await laptopSync.pullSlot('shawn', 'world', KEY, token);

      // Another browser that has its own untracked save and has never talked to the server.
      const other = fakeDevice(base);
      const otherSync = await loadSyncFor(other);
      other.storage.setItem(KEY, JSON.stringify({ visits: 1, source: 'stale local copy' }));

      const r = await otherSync.pullSlot('shawn', 'world', KEY, token);
      expect(r.source).toBe('server');
      expect(JSON.parse(other.storage.getItem(KEY)).source).toBe('server copy');

      // The copy it displaced is still recoverable rather than gone.
      const kept = otherSync.listRecoverable('shawn');
      expect(kept).toHaveLength(1);
      expect(JSON.parse(JSON.parse(other.storage.getItem(kept[0].key)).raw).source).toBe('stale local copy');
    });
  });

  it('gives the newer side the win when both moved, and keeps the loser', async () => {
    await withServer(async (base) => {
      const phone = fakeDevice(base);
      const phoneSync = await loadSyncFor(phone);
      const { token } = await phoneSync.remoteRegister('Shawn', 'hunter2!');
      phone.storage.setItem(KEY, JSON.stringify({ round: 1 }));
      await phoneSync.pullSlot('shawn', 'world', KEY, token);

      const laptop = fakeDevice(base);
      const laptopSync = await loadSyncFor(laptop);
      await laptopSync.pullSlot('shawn', 'world', KEY, token);        // both now at rev 1

      // The phone goes ahead to rev 2.
      phone.storage.setItem(KEY, JSON.stringify({ round: 2, by: 'phone' }));
      phoneSync.markDirty('shawn', 'world');
      await phoneSync.pushSlot('shawn', 'world', KEY, token);

      // The laptop, still holding rev 1, writes too — but later in wall-clock time, so it should win.
      await new Promise((r) => setTimeout(r, 5));
      laptop.storage.setItem(KEY, JSON.stringify({ round: 2, by: 'laptop' }));
      laptopSync.markDirty('shawn', 'world');
      const pushed = await laptopSync.pushSlot('shawn', 'world', KEY, token);

      expect(pushed.ok).toBe(true);
      expect(openStore(dir).read('shawn', 'world').data).toMatchObject({ by: 'laptop' });
      // The phone's revision was displaced, not destroyed.
      expect(readdirSync(join(dir, 'conflicts')).length).toBeGreaterThan(0);
    });
  });

  it('yields to the server when the other device wrote more recently', async () => {
    await withServer(async (base) => {
      const laptop = fakeDevice(base);
      const laptopSync = await loadSyncFor(laptop);
      const { token } = await laptopSync.remoteRegister('Shawn', 'hunter2!');
      laptop.storage.setItem(KEY, JSON.stringify({ round: 1 }));
      await laptopSync.pullSlot('shawn', 'world', KEY, token);

      // The laptop has unsent work from a while ago...
      laptop.storage.setItem(KEY, JSON.stringify({ round: 2, by: 'laptop, earlier' }));
      laptopSync.markDirty('shawn', 'world');
      const meta = JSON.parse(laptop.storage.getItem('hemodynamic_overlord_sync_shawn_world'));
      meta.dirtyAt = Date.now() - 600000;        // ten minutes ago
      laptop.storage.setItem('hemodynamic_overlord_sync_shawn_world', JSON.stringify(meta));

      // ...while the phone has just written.
      const phone = fakeDevice(base);
      const phoneSync = await loadSyncFor(phone);
      await phoneSync.pullSlot('shawn', 'world', KEY, token);
      phone.storage.setItem(KEY, JSON.stringify({ round: 3, by: 'phone, just now' }));
      phoneSync.markDirty('shawn', 'world');
      await phoneSync.pushSlot('shawn', 'world', KEY, token);

      const r = await laptopSync.pullSlot('shawn', 'world', KEY, token);
      expect(r.source).toBe('server');
      expect(JSON.parse(laptop.storage.getItem(KEY)).by).toBe('phone, just now');
      expect(laptopSync.listRecoverable('shawn')).toHaveLength(1);   // the laptop's own work is still here
    });
  });

  // Closing a page sends its last save with keepalive and then the page is gone, so nothing records that
  // the send landed: the slot still looks unsent on the next visit. Seen through the conflict rules alone
  // that looks exactly like a rival device, and the browser would stash a copy of its own work on every
  // single reload until localStorage filled up. This is the guard against that.
  it('does not treat its own flushed save as a rival device', async () => {
    await withServer(async (base) => {
      const d = fakeDevice(base);
      const sync = await loadSyncFor(d);
      const { token } = await sync.remoteRegister('Shawn', 'hunter2!');
      d.storage.setItem(KEY, JSON.stringify({ visits: 1 }));
      await sync.pullSlot('shawn', 'world', KEY, token);

      // What a keepalive flush leaves behind: the save reached the server, the meta still says unsent.
      d.storage.setItem(KEY, JSON.stringify({ visits: 2 }));
      sync.markDirty('shawn', 'world');
      await sync.pushSlot('shawn', 'world', KEY, token);
      sync.markDirty('shawn', 'world');

      const r = await sync.pullSlot('shawn', 'world', KEY, token);
      expect(r.source).toBe('same');
      expect(sync.listRecoverable('shawn')).toHaveLength(0);
      expect(JSON.parse(d.storage.getItem(KEY))).toEqual({ visits: 2 });
    });
  });

  it('keeps only the last few displaced copies, so they cannot fill localStorage', async () => {
    await withServer(async (base) => {
      const laptop = fakeDevice(base);
      const laptopSync = await loadSyncFor(laptop);
      const { token } = await laptopSync.remoteRegister('Shawn', 'hunter2!');
      laptop.storage.setItem(KEY, JSON.stringify({ round: 0 }));
      await laptopSync.pullSlot('shawn', 'world', KEY, token);

      const phone = fakeDevice(base);
      const phoneSync = await loadSyncFor(phone);
      await phoneSync.pullSlot('shawn', 'world', KEY, token);

      // Six rounds of the phone getting there first while the laptop has older unsent work.
      for (let i = 1; i <= 6; i++) {
        phone.storage.setItem(KEY, JSON.stringify({ round: i, by: 'phone' }));
        phoneSync.markDirty('shawn', 'world');
        await phoneSync.pushSlot('shawn', 'world', KEY, token);

        laptop.storage.setItem(KEY, JSON.stringify({ round: i, by: 'laptop' }));
        laptopSync.markDirty('shawn', 'world');
        const meta = JSON.parse(laptop.storage.getItem('hemodynamic_overlord_sync_shawn_world'));
        meta.dirtyAt = Date.now() - 600000;
        laptop.storage.setItem('hemodynamic_overlord_sync_shawn_world', JSON.stringify(meta));
        await new Promise((r) => setTimeout(r, 2));     // distinct timestamps in the stash keys
        await laptopSync.pullSlot('shawn', 'world', KEY, token);
      }

      const kept = laptopSync.listRecoverable('shawn');
      expect(kept).toHaveLength(3);
      expect(kept.map((k) => JSON.parse(JSON.parse(laptop.storage.getItem(k.key)).raw).round)).toEqual([6, 5, 4]);

      // Worth being plain about the cost of the cap. The laptop yielded every round without ever pushing,
      // so the server never saw those copies and conflicts/ is empty — this browser's stash is the only
      // record of them, and rounds 1 to 3 are now gone. That is the deliberate trade: three recoverable
      // copies, against a localStorage that fills up and starts failing the saves this exists to protect.
      expect(readdirSync(join(dir, 'conflicts'))).toHaveLength(0);
      expect(openStore(dir).read('shawn', 'world').data).toMatchObject({ round: 6, by: 'phone' });
    });
  });

  it('does nothing at all when the server cannot be reached', async () => {
    const d = fakeDevice('http://127.0.0.1:1');
    const sync = await loadSyncFor(d);
    d.storage.setItem(KEY, JSON.stringify({ visits: 4 }));

    expect((await sync.remoteLogin('Shawn', 'hunter2!')).offline).toBe(true);
    expect((await sync.pullSlot('shawn', 'world', KEY, 'any-token')).source).toBe('offline');
    sync.queuePush('shawn', 'world', KEY, 'any-token');            // must not throw
    expect(JSON.parse(d.storage.getItem(KEY))).toEqual({ visits: 4 });   // untouched
  });

  it('keeps the app and world slots independent end to end', async () => {
    await withServer(async (base) => {
      const d = fakeDevice(base);
      const sync = await loadSyncFor(d);
      const { token } = await sync.remoteRegister('Shawn', 'hunter2!');
      const appKey = 'hemodynamic_overlord_save_shawn';
      d.storage.setItem(appKey, JSON.stringify({ bankedPts: 500 }));
      d.storage.setItem(KEY, JSON.stringify({ visits: 2 }));
      await sync.pullSlot('shawn', 'app', appKey, token);
      await sync.pullSlot('shawn', 'world', KEY, token);

      const s = openStore(dir);
      expect(s.read('shawn', 'app').data).toMatchObject({ bankedPts: 500 });
      expect(s.read('shawn', 'world').data).toMatchObject({ visits: 2 });
    });
  });
});

describe('where the data lives', () => {
  it('creates its directories under the data root and nowhere else', () => {
    const s = openStore(join(dir, 'nested', 'deeper'));
    expect(existsSync(join(dir, 'nested', 'deeper', 'saves'))).toBe(true);
    expect(existsSync(join(dir, 'nested', 'deeper', 'conflicts'))).toBe(true);
    expect(s.stats()).toMatchObject({ users: 0, saves: 0, conflicts: 0 });
  });
});

// ---------------------------------------------------------------- the world save's own guard

describe('the world save refuses to write without a session', () => {
  async function loadWorldSave() {
    const map = new Map();
    globalThis.localStorage = {
      get length() { return map.size; },
      key: (i) => [...map.keys()][i] ?? null,
      getItem: (k) => (map.has(k) ? map.get(k) : null),
      setItem: (k, v) => { map.set(k, String(v)); },
      removeItem: (k) => { map.delete(k); },
      clear: () => map.clear(),
    };
    globalThis.window = globalThis.window || {};
    vi.resetModules();
    const mod = await import('../../world/js/save.js');
    return { mod, map };
  }

  it('writes nothing at all when nobody is signed in', async () => {
    const { mod, map } = await loadWorldSave();
    expect(mod.save({ v: 3, game: {}, learning: {} })).toBe(false);
    expect([...map.keys()]).toHaveLength(0);
  });

  it('never touches the legacy key, which every signed-out visitor would share', async () => {
    const { mod, map } = await loadWorldSave();
    mod.save({ v: 3, game: { secret: 'one person’s work' }, learning: {} });
    expect(map.has('hemodynamic_overlord_save::world')).toBe(false);
  });

  it('writes under the account once there is one', async () => {
    const { mod, map } = await loadWorldSave();
    map.set('hemodynamic_overlord_session', JSON.stringify({ userId: 'shawn', displayName: 'Shawn' }));
    expect(mod.save({ v: 3, game: {}, learning: {} })).toBe(true);
    expect(map.has('hemodynamic_overlord_save_shawn::world')).toBe(true);
  });
});

// ---------------------------------------------------------------- which certificate answers which name

describe('TLS certificate selection', () => {
  const pair = { cert: '/tls/lan.pem', key: '/tls/lan.key', tailnetCert: '/tls/ts.pem', tailnetKey: '/tls/ts.key' };

  it('makes the LAN certificate the default, because a bare IP sends no SNI', () => {
    // The regression this guards: with the tailnet certificate as the default, every browser opening
    // https://192.168.1.78:8801 is shown a certificate for a .ts.net name and warns. SNICallback never
    // runs for those connections, so no amount of correct callback logic can save it.
    const plan = tlsPlan(pair);
    expect(plan.default).toEqual({ cert: '/tls/lan.pem', key: '/tls/lan.key' });
    expect(plan.for(undefined)).toEqual({ cert: '/tls/lan.pem', key: '/tls/lan.key' });
    expect(plan.for('192.168.1.78')).toEqual({ cert: '/tls/lan.pem', key: '/tls/lan.key' });
  });

  it('serves the tailnet certificate for a tailnet name', () => {
    expect(tlsPlan(pair).for('3080-hub.tail9eadeb.ts.net')).toEqual({ cert: '/tls/ts.pem', key: '/tls/ts.key' });
  });

  it('falls back to the one certificate it has when there is no tailnet pair', () => {
    const plan = tlsPlan({ cert: '/tls/lan.pem', key: '/tls/lan.key' });
    expect(plan.tailnet).toBe(null);
    expect(plan.for('3080-hub.tail9eadeb.ts.net')).toEqual({ cert: '/tls/lan.pem', key: '/tls/lan.key' });
  });

  it('has no TLS at all without a default pair', () => {
    expect(tlsPlan({ tailnetCert: '/tls/ts.pem', tailnetKey: '/tls/ts.key' })).toBe(null);
  });

  it('recognises a tailnet name and nothing that merely looks like one', () => {
    expect(isTailnetName('box.tail9eadeb.ts.net')).toBe(true);
    expect(isTailnetName('192.168.1.78')).toBe(false);
    expect(isTailnetName('ts.net.example.com')).toBe(false);
    expect(isTailnetName(undefined)).toBe(false);
    expect(isTailnetName('')).toBe(false);
  });
});
