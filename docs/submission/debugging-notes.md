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

---

## Issue 6 — Bell notification badge stale after switching users

### Problem

After logging out as one user and logging in as another (e.g. employee → admin), the bell icon showed **no unread count** or the **previous user's count**.

### How I Investigated

1. Confirmed backend `/notifications/unread-count` returns correct count per JWT user.
2. Traced `useUnreadNotificationCountQuery` — RTK Query cached under a single key (`undefined`), not per user.
3. Noted `refetchOnMountOrArgChange: false` and 60s polling — new session could reuse stale cache until poll.
4. Logout (`clearCredentials`) did not reset RTK Query API state.

### How AI Helped

- Identified RTK cache key as root cause when auth user changes without full page reload.
- Suggested scoping cache by `userId` argument and resetting API state on logout.

### What I Validated

- Employee login → agent login shows agent's unread count immediately.
- Logout clears cached ticket/notification data (no cross-user leak).
- Mark read / mark all read optimistic updates target correct user's cache scope.

### Final Fix

- `notificationsApi.js`: pass `userId` as RTK Query arg for count + list endpoints (not sent to API).
- `NotificationsMenu.jsx`: pass `user._id` into notification hooks; skip when unauthenticated.
- `apiListener.js`: dispatch `baseApi.util.resetApiState()` on `clearCredentials`.

**Files:** `notificationsApi.js`, `NotificationsMenu.jsx`, `apiListener.js`

---

## Issue 7 — Notification list empty while badge showed unread count

### Problem

Bell badge displayed a positive count, but opening the menu showed "You're all caught up."

### How I Investigated

1. Compared `getUnreadNotificationCount` vs `getNotifications` cache entries.
2. Found mark-all-read optimistic update zeroed count but left stale list cache (or vice versa).
3. Menu did not refetch list on open when cached empty array existed.

### How AI Helped

- Split count and list into separate endpoints/tags with targeted invalidation.
- Added `refetch()` when bell menu opens.

### What I Validated

- Badge count and menu items stay in sync after mark read / mark all read.
- Opening bell always shows current unread items.

### Final Fix

- Separate `GET /notifications/unread-count` endpoint for badge.
- Refetch list on menu open; invalidate both count and list tags on ticket/comment mutations.

**Files:** `notification.routes.ts`, `notificationsApi.js`, `NotificationsMenu.jsx`

---

## Issue 8 — Ticket search only matched title and description

### Problem

Search box did not find tickets by assignee name, status label, priority, date, or ticket number.

### How I Investigated

1. Read `TicketSearchFilterService` — keyword applied only to title/description regex.
2. Compared with UI placeholder promising broader search.

### How AI Helped

- Implemented `ticket-keyword-search.helper.ts` with user lookup, enum label matching, date parsing, and ticket number matching.

### What I Validated

- Search by assignee name, `high` priority, `in progress` status, `2026`, and ticket `#` works.
- Backend unit tests in `ticket-keyword-search.test.ts`.

### Final Fix

- Cross-field search helper integrated into `TicketSearchFilterService`.
- Updated search placeholder in `TicketSearchBox.jsx`.

**Files:** `ticket-keyword-search.helper.ts`, `TicketSearchFilterService`, `TicketSearchBox.jsx`
