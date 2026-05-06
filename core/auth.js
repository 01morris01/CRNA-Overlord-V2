/**
 * Simple client-side authentication system.
 * Stores user accounts in localStorage with per-user save slots.
 * Passwords are hashed using SHA-256 via Web Crypto API.
 */

const USERS_KEY = 'hemodynamic_overlord_users';
const SESSION_KEY = 'hemodynamic_overlord_session';
const SAVE_PREFIX = 'hemodynamic_overlord_save_';

// Legacy key — used for migration
const LEGACY_SAVE_KEY = 'hemodynamic_overlord_save';

/**
 * Hash a password using SHA-256.
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
 * Set the current session.
 */
function setSession(userId, displayName) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId, displayName }));
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

/**
 * Log out — clear session but keep user data.
 */
export function logout() {
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
 * Check if any users are registered.
 */
export function hasRegisteredUsers() {
  return Object.keys(getUsers()).length > 0;
}

// Expose getUserSaveKey globally so legacy (non-module) scripts can use it
window._getUserSaveKey = getUserSaveKey;
