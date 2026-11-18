/**
 * Authentication for both apps.
 *
 * Two modes, chosen by what is actually behind the page rather than by configuration:
 *
 *   synced  there is a sync server (server/overlord-server.mjs) on this origin. Accounts live on it,
 *           passwords are checked there against PBKDF2, and saves are pulled down at sign-in and pushed
 *           back as you work. The same account on a phone is the same account.
 *   local   there is no server — a static host, a file:// copy. Accounts and saves are this browser's
 *           only, exactly as they were before sync existed. Nothing breaks; nothing follows you either.
 *
 * In local mode the password hash is a bare SHA-256 in localStorage, which is not a real defence and never
 * was: anything that can read the hash can read the save beside it. It stays only so an offline copy keeps
 * working. Treat a synced account's password as the real one.
 *
 * The save keys are unchanged in both modes, so core/state.js and world/js/save.js read and write exactly
 * what they always did. Sync is a layer around localStorage, not a replacement for it.
 */

import * as sync from './sync.js';

const USERS_KEY = 'hemodynamic_overlord_users';
const SESSION_KEY = 'hemodynamic_overlord_session';
const SAVE_PREFIX = 'hemodynamic_overlord_save_';

// Legacy key — used for migration
const LEGACY_SAVE_KEY = 'hemodynamic_overlord_save';

/** The two save blobs, and the slot name the server files each under. */
export const SLOTS = [
  { slot: 'app', key: (userId) => SAVE_PREFIX + userId },
  { slot: 'world', key: (userId) => SAVE_PREFIX + userId + '::world' },
];

/**
 * Hash a password using SHA-256. Local mode only — the server never sees this, and uses PBKDF2 instead.
 */
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Get all registered users.
 */
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
  } catch (e) {
    return {};
  }
}

/**
 * Save users registry.
 */
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/**
 * Register a new user. Returns { success, error }.
 */
export async function registerUser(username, password) {
  const trimmed = username.trim();
  if (!trimmed || trimmed.length < 2) {
    return { success: false, error: 'Username must be at least 2 characters.' };
  }
  if (!password || password.length < 4) {
    return { success: false, error: 'Password must be at least 4 characters.' };
  }

  // With a server present the account belongs to it, so it exists for every device at once.
  const remote = await sync.remoteRegister(trimmed, password);
  if (remote.ok) {
    setSession(trimmed.toLowerCase(), remote.displayName, remote.token);
    _migrateLegacySave(trimmed.toLowerCase());
    await syncSession();
    return { success: true, displayName: remote.displayName, synced: true };
  }
  // A server that answered and said no (name taken, password too short) is the answer. Only an
  // unreachable server falls through to a browser-local account.
  if (!remote.offline) return { success: false, error: remote.error };

  const users = getUsers();
  const lowerUser = trimmed.toLowerCase();

  if (users[lowerUser]) {
    return { success: false, error: 'Username already taken.' };
  }

  const hash = await hashPassword(password);
  users[lowerUser] = {
    displayName: trimmed,
    passwordHash: hash,
    createdAt: Date.now(),
  };
  saveUsers(users);

  // Migrate legacy save data if it exists and this is the first user
  _migrateLegacySave(lowerUser);

  // Set session
  setSession(lowerUser, trimmed);

  return { success: true, displayName: trimmed };
}

/**
 * Login an existing user. Returns { success, error, displayName }.
 */
export async function loginUser(username, password) {
  const trimmed = username.trim();
  const lowerUser = trimmed.toLowerCase();

  const remote = await sync.remoteLogin(trimmed, password);
  if (remote.ok) {
    setSession(lowerUser, remote.displayName, remote.token);
    await syncSession();
    return { success: true, displayName: remote.displayName, synced: true };
  }
  if (!remote.offline) return { success: false, error: remote.error };

  const users = getUsers();

  if (!users[lowerUser]) {
    return { success: false, error: 'User not found. Register first.' };
  }

  const hash = await hashPassword(password);
  if (users[lowerUser].passwordHash !== hash) {
    return { success: false, error: 'Incorrect password.' };
  }

  setSession(lowerUser, users[lowerUser].displayName);
  return { success: true, displayName: users[lowerUser].displayName };
}

/**
 * Set the current session. token is present only for a synced account.
 */
function setSession(userId, displayName, token = null) {
  const s = { userId, displayName };
  if (token) s.token = token;
  localStorage.setItem(SESSION_KEY, JSON.stringify(s));
}

/**
 * Get the current session (or null).
 */
export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch (e) {
    return null;
  }
}

/** True when this session's progress is being kept on the server rather than only in this browser. */
export const isSynced = () => !!(getSession() || {}).token;

/**
 * Bring both save slots into line with the server, then leave the result in localStorage for the apps to
 * load as usual. Awaited by loginUser/registerUser so the app never reads a save that is about to change
 * under it. Returns a per-slot report, or null when there is nothing to sync.
 */
export async function syncSession() {
  const session = getSession();
  if (!session || !session.token) return null;
  const out = {};
  for (const { slot, key } of SLOTS) {
    try {
      const r = await sync.pullSlot(session.userId, slot, key(session.userId), session.token);
      out[slot] = r;
      // The token was rejected: the account is gone or the token expired. Drop it and carry on
      // browser-local rather than leaving the app signed in to a server that disowns it.
      if (r && r.unauthorized) { delete session.token; localStorage.setItem(SESSION_KEY, JSON.stringify(session)); return out; }
    } catch (e) {
      out[slot] = { source: 'offline' };
    }
  }
  return out;
}

/**
 * Called by the apps' save paths right after they write localStorage. Debounced, non-blocking, and a
 * no-op in local mode.
 */
export function noteSaved(slot) {
  const session = getSession();
  if (!session || !session.token) return;
  const entry = SLOTS.find((s) => s.slot === slot);
  if (!entry) return;
  sync.queuePush(session.userId, slot, entry.key(session.userId), session.token);
}

/** Send anything still queued before the page goes away. */
export function flushSaves() {
  const session = getSession();
  if (!session || !session.token) return;
  for (const { slot, key } of SLOTS) sync.flushNow(session.userId, slot, key(session.userId), session.token);
}

/**
 * Log out — clear session but keep user data.
 */
export function logout() {
  const session = getSession();
  if (session && session.token) {
    flushSaves();
    sync.remoteLogout(session.token);
  }
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Get the localStorage key for the current user's save data.
 */
export function getUserSaveKey() {
  const session = getSession();
  if (!session) return LEGACY_SAVE_KEY; // fallback
  return SAVE_PREFIX + session.userId;
}

/**
 * Migrate legacy save data (if any) to the first registered user.
 */
function _migrateLegacySave(userId) {
  const legacyRaw = localStorage.getItem(LEGACY_SAVE_KEY);
  if (!legacyRaw) return;

  const userKey = SAVE_PREFIX + userId;
  // Only migrate if user has no existing save
  if (!localStorage.getItem(userKey)) {
    localStorage.setItem(userKey, legacyRaw);
    console.log('[AUTH] Migrated legacy save data to user:', userId);
  }
}

/**
 * Check if any users are registered. Local mode only; with a server the answer is not this browser's
 * to give, which is the point of having one.
 */
export function hasRegisteredUsers() {
  return Object.keys(getUsers()).length > 0;
}

/** Saves this browser set aside when another device's copy won. For recovery by hand, not automatic. */
export function recoverableSaves() {
  const session = getSession();
  return session ? sync.listRecoverable(session.userId) : [];
}

// Expose getUserSaveKey globally so legacy (non-module) scripts can use it
window._getUserSaveKey = getUserSaveKey;

// Ask once, early, whether there is a server here. The sign-in screen uses the answer to say truthfully
// whether an account will follow the person to another device.
export const syncAvailable = () => sync.probe();
