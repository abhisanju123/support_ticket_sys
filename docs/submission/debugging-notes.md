# Debugging Notes

## Issue 1 — MongoDB Atlas connection failure on Windows

### Problem

Backend failed to start with:

```
Could not connect to any servers in your MongoDB Atlas cluster.
SSL routines: ssl3_read_bytes: tlsv1 alert internal error (alert 80)
```

### How I Investigated

1. Confirmed `MONGODB_URI` uses `mongodb+srv://` (Atlas).
2. Ran DNS SRV lookup — cluster resolved correctly via `8.8.8.8`.
3. Ran `Test-NetConnection` to shard host on port `27017` — **TCP succeeded**.
4. Ran Node/mongoose connection test — still failed with IP whitelist message.
5. Fetched public IP (`api.ipify.org`) for Atlas Network Access whitelist.

### How AI Helped

- Cursor diagnosed pattern: TCP OK + TLS failure → usually **IP not whitelisted**, not a code bug.
- Suggested Windows DNS workaround already present in `connection.ts` (`MONGODB_DNS_SERVERS`).
- Recommended local MongoDB fallback for uninterrupted dev.

### What I Validated

- Network path to Atlas is open; failure is Atlas-side access control.
- Supplemental DNS log line appears: `Configured supplemental DNS for Atlas SRV lookup`.
- Switching to `mongodb://localhost:27017/support_tickets` works when local MongoDB runs.

### Final Fix

**Operational (not code):** Add current public IP to Atlas **Network Access**, or use `0.0.0.0/0` for dev only. Optionally use local MongoDB in `.env`.

---

## Issue 2 — Edit form fields reverting to saved values while typing

### Problem

On the edit ticket page, changing title/description appeared impossible — fields snapped back to original ticket data.

### How I Investigated

1. Traced `EditTicketForm` → `useEffect` depending on `[ticket, reset, clearGlobalError]`.
2. Noted RTK Query returns a **new `ticket` object reference** on parent re-renders.
3. Confirmed `reset(buildDefaultValues(ticket))` ran on every reference change.

### How AI Helped

- Identified `useEffect` + unstable `ticket` dependency as root cause.
- Suggested `key={ticketId}` remount and removing aggressive reset.

### What I Validated

- After fix, typing persists until save or manual reset.
- Reset icon restores original snapshot via `initialValues`.
- Navigating to different ticket remounts form with correct data.

### Final Fix

- Removed `useEffect` that reset on every `ticket` change.
- Used `key={ticketId}` on `EditTicketForm` / `TicketForm` for ticket switches.
- Stable `initialValues` from `useMemo(() => buildDefaultValues(ticket), [ticketId])`.

**Files:** `EditTicketForm.jsx`, `EditTicketPage.jsx`

---

## Issue 3 — Priority dropdown empty on edit form

### Problem

Title and description prefilled on edit, but **Priority** select showed blank label.

### How I Investigated

1. Compared create vs edit `PriorityDropdown` usage.
2. Read `PriorityDropdown.jsx` — when `register` passed, `value` prop was **ignored**.
3. Known MUI `TextField select` + React Hook Form issue: uncontrolled `register` alone does not set visible value.

### How AI Helped

- Explained MUI Select needs explicit `value` for controlled display.
- Updated component to merge controlled `value` + `onChange` with optional register handlers.

### What I Validated

- Edit form shows correct priority (e.g. `high`, `medium`).
- Create form still supports empty placeholder state.
- Submit sends updated priority to `PUT /api/tickets/:id`.

### Final Fix

- `PriorityDropdown`: controlled mode when `value !== undefined`.
- `TicketForm`: pass `value={values.priority}` and `onChange` via `onFieldChange` / `setValue`.

**Files:** `PriorityDropdown.jsx`, `TicketForm.jsx`

---

## Issue 4 — Missing `OBJECT_ID_REGEX` export

### Problem

Frontend crash: `does not provide an export named 'OBJECT_ID_REGEX'`.

### How I Investigated

- Grep for `OBJECT_ID_REGEX` imports in `ticketFormatters.js`, `common.schema.js`.
- Checked `ticket.constants.js` — export removed during `isTicketEditable` addition.

### How AI Helped

- Immediate fix: restore export at bottom of constants file.

### What I Validated

- Dev server reloads without module error.
- User ID validation in forms still works.

### Final Fix

Re-added `export const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;` to `ticket.constants.js`.

---

## Issue 5 — Assignee not showing in edit form Autocomplete

### Problem

Assigned user dropdown empty despite ticket having assignee.

### How I Investigated

- Checked `buildDefaultValues` — `assignedTo` extraction from populated object.
- Checked `UserSelectField` — strict `user._id === value` comparison.

### How AI Helped

- Added `resolveTicketUserId()` helper for consistent ID extraction.
- String-coerced ID comparison in Autocomplete.

### What I Validated

- Edit form shows correct assignee name when users list loads.
- Unassigned tickets show placeholder.

### Final Fix

`resolveTicketUserId()` in `ticketFormatters.js`; `String(user._id) === String(value)` in `UserSelectField.jsx`.
