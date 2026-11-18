// store.mjs: accounts and save slots on disk. Zero dependencies — node:crypto and node:fs only.
//
// This is the thing that makes progress follow a person between devices. Until it existed, accounts and
// saves were localStorage, so the same person on a phone was a stranger with an empty save.
//
// Three decisions worth knowing before changing anything here:
//
//   1. The data directory is NOT inside the checkout. A deploy re-clones the repo; a save directory inside
//      it would be destroyed by the next deploy. OVERLORD_DATA defaults to a sibling of the checkout.
//   2. A save blob is opaque. The server never parses, merges or validates its shape — the two apps own
//      their own formats and will change them. The server only versions blobs and refuses stale writes.
//   3. Nothing is ever overwritten without a copy. A rejected write is kept under conflicts/ before the
//      409 goes back, so a confused client cannot destroy work that a second device did.
import { createHash, randomBytes, pbkdf2, timingSafeEqual } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, renameSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// OWASP's current floor for PBKDF2-HMAC-SHA512. Raising it later is safe: the cost is recorded in each
// stored hash, so old passwords keep verifying at the iteration count they were written with.
const ITERATIONS = 210000;
const KEYLEN = 64;
const DIGEST = 'sha512';

const TOKEN_TTL = 30 * 86400000;        // 30 days. A study session should not be interrupted by a re-login.
const MAX_BLOB = 4 * 1024 * 1024;       // 4 MB. The world save is ~20 KB today; this is a sanity ceiling.
const SLOTS = new Set(['app', 'world']);

// Login throttle, per username. In memory on purpose: a restart clearing it is not a weakness worth a file.
const FAIL_WINDOW = 15 * 60000;
const FAIL_MAX = 10;

const sha256 = (s) => createHash('sha256').update(s).digest('hex');
const pbkdf2Async = (pw, salt) => new Promise((ok, no) =>
  pbkdf2(pw, salt, ITERATIONS, KEYLEN, DIGEST, (e, k) => (e ? no(e) : ok(k))));

/** Write through a temporary file in the same directory, then rename. A crash mid-write leaves the old
 *  file intact rather than a truncated one — this holds every account on the box. */
function writeAtomic(file, text) {
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  writeFileSync(tmp, text, 'utf8');
  renameSync(tmp, file);
}

function readJSON(file, fallback) {
  try { return JSON.parse(readFileSync(file, 'utf8')); } catch { return fallback; }
}

export function openStore(dir) {
  const root = dir;
  const savesDir = join(root, 'saves');
  const conflictDir = join(root, 'conflicts');
  for (const d of [root, savesDir, conflictDir]) mkdirSync(d, { recursive: true });

  const usersFile = join(root, 'users.json');
  const tokensFile = join(root, 'tokens.json');

  let users = readJSON(usersFile, {});       // userId -> { displayName, pw, createdAt }
  let tokens = readJSON(tokensFile, {});     // sha256(token) -> { userId, expiresAt }
  const fails = new Map();                   // userId -> { n, first }

  const flushUsers = () => writeAtomic(usersFile, JSON.stringify(users, null, 2));
  const flushTokens = () => writeAtomic(tokensFile, JSON.stringify(tokens));

  // A username may be anything the apps already allow, including spaces and non-Latin text, so it must
  // never reach the filesystem. The hash does, and it is stable for the life of the account.
  const slotFile = (userId, slot) => join(savesDir, `${sha256(userId)}__${slot}.json`);

  function dropExpiredTokens() {
    const now = Date.now();
    let changed = false;
    for (const [k, v] of Object.entries(tokens)) if (v.expiresAt <= now) { delete tokens[k]; changed = true; }
    if (changed) flushTokens();
  }
  dropExpiredTokens();

  function issueToken(userId) {
    const token = randomBytes(32).toString('hex');
    tokens[sha256(token)] = { userId, issuedAt: Date.now(), expiresAt: Date.now() + TOKEN_TTL };
    flushTokens();
    return token;
  }

  function throttled(userId) {
    const f = fails.get(userId);
    if (!f) return false;
    if (Date.now() - f.first > FAIL_WINDOW) { fails.delete(userId); return false; }
    return f.n >= FAIL_MAX;
  }

  function noteFailure(userId) {
    const f = fails.get(userId);
    if (!f || Date.now() - f.first > FAIL_WINDOW) fails.set(userId, { n: 1, first: Date.now() });
    else f.n++;
  }

  return {
    get dir() { return root; },
    get userCount() { return Object.keys(users).length; },

    /** Create an account. Returns { ok, token, displayName } or { ok: false, error, code }. */
    async register(username, password) {
      const name = String(username ?? '').trim();
      const pw = String(password ?? '');
      if (name.length < 2) return { ok: false, code: 400, error: 'Username must be at least 2 characters.' };
      if (name.length > 64) return { ok: false, code: 400, error: 'Username is too long.' };
      if (pw.length < 4) return { ok: false, code: 400, error: 'Password must be at least 4 characters.' };
      if (pw.length > 1024) return { ok: false, code: 400, error: 'Password is too long.' };

      const userId = name.toLowerCase();
      if (users[userId]) return { ok: false, code: 409, error: 'Username already taken.' };

      const salt = randomBytes(16);
      const hash = await pbkdf2Async(pw, salt);
      users[userId] = {
        displayName: name,
        pw: `pbkdf2$${DIGEST}$${ITERATIONS}$${salt.toString('base64')}$${hash.toString('base64')}`,
        createdAt: Date.now(),
      };
      flushUsers();
      return { ok: true, token: issueToken(userId), userId, displayName: name };
    },

    /** Verify a password. Returns { ok, token, displayName } or { ok: false, error, code }. */
    async login(username, password) {
      const name = String(username ?? '').trim();
      const userId = name.toLowerCase();
      const rec = users[userId];

      if (throttled(userId)) return { ok: false, code: 429, error: 'Too many attempts. Wait a few minutes.' };
      // Same message for an unknown user and a wrong password: the difference tells an outsider which
      // usernames exist, and costs the person who typo'd their name nothing to lose.
      if (!rec) { noteFailure(userId); return { ok: false, code: 401, error: 'Wrong username or password.' }; }

      const [, digest, iter, saltB64, hashB64] = rec.pw.split('$');
      const want = Buffer.from(hashB64, 'base64');
      const got = await new Promise((ok, no) => pbkdf2(String(password ?? ''), Buffer.from(saltB64, 'base64'),
        Number(iter), want.length, digest, (e, k) => (e ? no(e) : ok(k))));
      if (got.length !== want.length || !timingSafeEqual(got, want)) {
        noteFailure(userId);
        return { ok: false, code: 401, error: 'Wrong username or password.' };
      }
      fails.delete(userId);
      return { ok: true, token: issueToken(userId), userId, displayName: rec.displayName };
    },

    /** Resolve a bearer token to { userId, displayName }, or null. */
    whoIs(token) {
      if (!token) return null;
      const rec = tokens[sha256(String(token))];
      if (!rec) return null;
      if (rec.expiresAt <= Date.now()) { delete tokens[sha256(String(token))]; flushTokens(); return null; }
      const u = users[rec.userId];
      return u ? { userId: rec.userId, displayName: u.displayName } : null;
    },

    revoke(token) {
      const k = sha256(String(token ?? ''));
      if (tokens[k]) { delete tokens[k]; flushTokens(); return true; }
      return false;
    },

    isSlot(slot) { return SLOTS.has(slot); },

    /** The stored blob for a slot: { rev, updatedAt, data } — rev 0 and data null when nothing is stored. */
    read(userId, slot) {
      if (!SLOTS.has(slot)) throw new Error(`unknown slot: ${slot}`);
      return readJSON(slotFile(userId, slot), { rev: 0, updatedAt: null, data: null });
    },

    /** Store a blob, but only on top of the revision the client actually has.
     *
     *  baseRev matches  -> accepted, rev + 1.
     *  baseRev is stale -> refused with the server's copy, AND the refused blob is written to conflicts/
     *                      first. Refusing a write must never be the same thing as throwing work away:
     *                      the client decides which side wins, and the loser stays on disk either way.
     */
    write(userId, slot, baseRev, data) {
      if (!SLOTS.has(slot)) throw new Error(`unknown slot: ${slot}`);
      const serialized = JSON.stringify(data);
      if (serialized === undefined) return { ok: false, code: 400, error: 'Save data is not serializable.' };
      if (Buffer.byteLength(serialized) > MAX_BLOB) return { ok: false, code: 413, error: 'Save data is too large.' };

      const cur = this.read(userId, slot);
      if (Number(baseRev) !== cur.rev) {
        const stamp = `${sha256(userId).slice(0, 12)}__${slot}__${Date.now()}.json`;
        try {
          writeAtomic(join(conflictDir, stamp), JSON.stringify({
            userId, slot, rejectedBaseRev: Number(baseRev), serverRev: cur.rev, at: Date.now(), data,
          }));
        } catch { /* keeping the copy is best-effort; the 409 below still protects the stored blob */ }
        return { ok: false, code: 409, error: 'This save is based on an older revision.', server: cur };
      }

      const next = { rev: cur.rev + 1, updatedAt: Date.now(), data };
      writeAtomic(slotFile(userId, slot), JSON.stringify(next));
      return { ok: true, rev: next.rev, updatedAt: next.updatedAt };
    },

    /** For the operator: what is stored, without any blob contents. */
    stats() {
      let saves = 0;
      try { saves = readdirSync(savesDir).filter((f) => f.endsWith('.json')).length; } catch { /* empty dir */ }
      let conflicts = 0;
      try { conflicts = readdirSync(conflictDir).filter((f) => f.endsWith('.json')).length; } catch { /* empty dir */ }
      return { users: Object.keys(users).length, saves, conflicts, dir: root };
    },

    /** Re-read from disk. Only used by the tests, which write through a second handle. */
    _reload() {
      users = readJSON(usersFile, {});
      tokens = readJSON(tokensFile, {});
    },
  };
}

export const _internals = { ITERATIONS, MAX_BLOB, TOKEN_TTL, FAIL_MAX, SLOTS, existsSync };
