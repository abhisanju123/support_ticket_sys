# PR Description

## Summary

Implements a full-stack **Support Ticket Management System** — employees create and track support tickets through a React UI backed by a TypeScript Express API and MongoDB. Includes JWT authentication, role-based ticket access, in-app bell notifications, dashboard analytics, ticket CRUD with workflow status transitions, comments, cross-field search/filter/sort, and polished form UX.

---

## Features Implemented

### Authentication
- Register, login, JWT session (`30m` default TTL)
- Protected API routes and frontend routes
- Password policy enforcement (client + server)

### Tickets
- Create with title, description, priority, reporter, assignee
- List with pagination, sorting, keyword search, status/priority filters
- **Cross-field keyword search** — title, description, assignee/reporter name or email, priority, status, date, ticket number
- Details view with metadata and status timeline
- Edit title, description, priority, assignee (**blocked when status is `closed`**)
- **Assignee dropdown** limited to users who can change ticket status (`admin`, `support_agent`)
- Status changes via validated workflow (`PATCH /tickets/:id/status`)
- Delete with confirmation
- Sequential public ticket numbers in URLs (`/tickets/1`, `/tickets/2`)

### Collaboration
- Comments on ticket details page
- User list API for assignee/reporter dropdowns
- **In-app bell notifications** with role-based routing:
  - Employee comments/updates → notify assignee
  - Admin/agent comments/updates → notify employee creator
  - Actor never receives their own notification
- Unread badge count, mark read / mark all read, navigate to ticket from menu

### Access control
- Employees see only tickets they created or are assigned to
- Admins and support agents see all tickets
- Assignee validation on create/update (must be admin or support agent)
- Permission checks for status changes and ticket operations

### Dashboard
- Stat cards: total, open, in progress, resolved, closed, cancelled
- Status breakdown chart (includes **cancelled**)
- Recent tickets list

### UX
- Responsive layout (header, sidebar, breadcrumbs)
- Command palette (Ctrl+K)
- Toast notifications with HTTP status prefix
- Form submit disabled until required fields filled
- Reset icon beside submit (create + edit)
- Light/dark theme support
- Auth login page: 50/50 showcase + form layout (mock ticket preview cards removed)
- Button hover animations and improved form styling

---

## Technical Changes

### Backend (`backend/`)

- Express 5 + TypeScript layered architecture
- Mongoose models: `users`, `tickets`, `comments`, `notifications`, `ticket_counters`
- Zod request validation middleware
- JWT auth middleware + ticket access / permission checks
- Services: ticket CRUD, status, dashboard, comments, notifications, auth
- Notification routing (`notification-routing.ts`) wired into comment and ticket update/status services
- Cross-field ticket keyword search helper
- MongoDB connection retry + Windows Atlas DNS workaround
- Seed script (10 users)
- Unit tests: auth service, password schema

### Frontend (`frontend/`)

- React 19 + Vite 8 + MUI 9 + Tailwind 4
- Redux Toolkit + RTK Query with cache invalidation tags
- Notifications: per-user RTK cache scope, lightweight unread-count poll, full list on bell open
- API cache reset on logout (`clearCredentials` → `resetApiState`)
- React Hook Form + Zod validation
- Feature-based folder structure
- Pages: Dashboard, Tickets, Create/Edit/Details, Login, Register, Settings

### Documentation (`docs/`)

- `API_CONTRACT.md` — full REST specification
- `DATABASE_DESIGN.md`, layer design docs
- `PROMPTS.md`, `FRONTEND_PROMPTS.md` — AI build history
- `submission/` — assessment artifact pack

---

## Database Changes

| Collection | Notes |
| ---------- | ----- |
| `users` | New — auth + dropdown references |
| `tickets` | New — core entity with `ticketNumber`, status, priority |
| `comments` | New — linked to tickets |
| `notifications` | New — in-app bell notifications per recipient |
| `ticket_counters` | New — atomic sequential ID generation |

Indexes applied via `apply-indexes.ts` on startup (status, assignee, email unique, etc.).

**Seed:** `npm run seed` — 10 sample users, password `Password123!`

---

## Testing Done

| Test | Result |
| ---- | ------ |
| `backend npm test` | Pass (auth, password, RBAC, notification routing, keyword search, ticket access) |
| `backend npm run lint` | Pass |
| `backend npm run typecheck` | Pass |
| `frontend npm run lint` | Pass |
| `frontend npm run build` | Pass |
| Manual E2E: auth flow | Pass |
| Manual E2E: ticket CRUD + status + comments | Pass |
| Manual: bell notifications per role | Pass |
| Manual: user switch updates bell unread count | Pass |
| Manual: closed ticket edit blocked | Pass |
| Manual: form validation + disabled submit | Pass |

---

## AI Usage Summary

Built primarily with **Cursor** using phased prompts documented in `docs/PROMPTS.md` and `docs/FRONTEND_PROMPTS.md`. AI generated scaffolding, CRUD layers, UI components, theme styles, and submission docs. All AI output was reviewed, run locally, and corrected (e.g. edit form reset bug, priority dropdown prefill, `OBJECT_ID_REGEX` export).

See [`reflection.md`](./reflection.md) for detailed AI lifecycle notes.

---

## Screenshots / Demo Notes

**Suggested demo flow for reviewers:**

1. Start backend (`npm run dev`) + frontend (`npm run dev`) with MongoDB running.
2. Login as employee (`abhishek@example.com`) → create ticket assigned to agent.
3. Logout → login as agent (`john@example.com`) → verify bell badge shows unread count.
4. Open bell menu → click notification → ticket details.
5. Dashboard → view stat cards and chart (including cancelled).
6. Tickets → search by assignee name, status, priority, ticket #, date.
7. Create Ticket → assignee dropdown shows only admin/agent users.
8. Add comment / change status → verify recipient gets notification.
9. Transition to `resolved` → `closed` → verify edit blocked.
10. Logout → login as different user → bell count reflects new user (not stale cache).

*Screenshots: attach `dashboard.png`, `ticket-list.png`, `ticket-details.png`, `create-ticket.png` when preparing final submission zip.*

---

## Known Limitations

1. RBAC covers ticket visibility, assignee rules, and key permissions — not every endpoint is role-gated.
2. Limited automated test coverage (backend unit + one integration file; no frontend tests).
3. `on_hold` status exists in enum but limited UI transition support.
4. Hard delete for tickets (no soft delete / audit trail).
5. In-app notifications only — no email, push, or Slack delivery.
6. MongoDB Atlas requires IP whitelist configuration on developer machine.
7. Comment `isInternal` field in DB design not exposed in UI.

---

## Future Improvements

- Expanded Supertest integration suite
- Vitest + RTL for form components and notification hooks
- Soft delete + activity log
- Email/Slack delivery alongside in-app notifications
- File uploads on tickets
- GitHub Actions CI
- Playwright E2E tests
