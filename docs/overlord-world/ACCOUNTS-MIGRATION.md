# Accounts and progress: what exists, and a migration that keeps it

## Verified today (deployed code, commit bcba0c3)

- `core/auth.js`: accounts are a JSON object in the browser's localStorage (`hemodynamic_overlord_users`), passwords
  hashed with unsalted SHA-256 in the browser, session in `hemodynamic_overlord_session`.
- Progress: one localStorage entry per user, `hemodynamic_overlord_save_<userId>`. A legacy single-user key is
  migrated on first registration.
- Mock OR Day keeps care plans, interviews and the student session in localStorage too. Two computers are linked
  browser to browser (WebRTC, PeerJS public broker) and copy those keys across; no server stores them.
- The only server code is four Vercel functions that call Claude (recall grading, patient chat, sim operator, speech).
  None stores anything.
- The world slice follows the same pattern: `hemodynamic_overlord_save_<userId>::world`.

Consequences: nothing follows a student to another device; clearing site data deletes everything; two students on one
browser are separated only by a password that is checked on the client; "classmates" cannot be real accounts yet.

**Cross-device sync does not exist. Nothing in the app or this slice claims it.**

## Proposal (not built)

1. **Server accounts** with a hosted auth and database service that fits Vercel (for example Supabase or Clerk with
   Postgres). Email or school sign-in; passwords never handled by our code.
2. **One record per user per area**, stored as versioned JSON documents first (classic save, world save, Mock OR Day
   documents), so the existing shapes move over unchanged. Split into tables later only where queries need it
   (learning attempts are the first candidate).
3. **Claiming existing data.** On first sign-in to a server account from a browser that has local accounts, show them
   and let the student claim one by entering its local password. Upload its saves as-is, keep the local copy, and mark
   it claimed. Nothing is deleted from the browser.
4. **Sync rule.** Local first, then background upload. Last-write-wins per document, except learning attempts, which
   are append-only and merged by timestamp, so two devices can never erase each other's answers.
5. **Export stays.** The existing backup and import keep working as the escape hatch.
6. **Order of work:** accounts and claim flow; classic save sync; world save sync; Mock OR Day documents; then
   classmates (visiting a plot, shared challenges), which depend on real identities.

## Tests that must pass before anyone is told it syncs

- Claim on device A, sign in on device B: same progress, byte for byte.
- Answer on A and B while offline, reconnect: every attempt present once.
- Wrong local password cannot claim. A claimed local account cannot be claimed again by another server account.
- Deleting site data then signing in restores everything.
- Tested on a real iPad and a real phone, not only emulation.
