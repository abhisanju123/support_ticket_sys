# PR Description

## Summary

Implements a full-stack **Support Ticket Management System** — employees create and track support tickets through a React UI backed by a TypeScript Express API and MongoDB. Includes JWT authentication, dashboard analytics, ticket CRUD with workflow status transitions, comments, search/filter/sort, and polished form UX.

---

## Features Implemented

### Authentication
- Register, login, JWT session (`30m` default TTL)
- Protected API routes and frontend routes
- Password policy enforcement (client + server)

### Tickets
- Create with title, description, priority, reporter, assignee
- List with pagination, sorting, keyword search, status/priority filters
- Details view with metadata and status timeline
- Edit title, description, priority, assignee (**blocked when status is `closed`**)
- Status changes via validated workflow (`PATCH /tickets/:id/status`)
- Delete with confirmation
- Sequential public ticket numbers in URLs (`/tickets/1`, `/tickets/2`)

### Collaboration
- Comments on ticket details page
- User list API for assignee/reporter dropdowns

### Dashboard
- Stat cards: total, open, in progress, resolved, closed, cancelled
- Status breakdown chart
- Recent tickets list

### UX
- Responsive layout (header, sidebar, breadcrumbs)
- Command palette (Ctrl+K)
- Toast notifications with HTTP status prefix
- Form submit disabled until required fields filled
- Reset icon beside submit (create + edit)
- Light/dark theme support
- Button hover animations and improved form styling

---

## Technical Changes

### Backend (`backend/`)

- Express 5 + TypeScript layered architecture
- Mongoose models: `users`, `tickets`, `comments`, `ticket_counters`
- Zod request validation middleware
- JWT auth middleware
- Services: ticket CRUD, status, dashboard, comments, auth
- MongoDB connection retry + Windows Atlas DNS workaround
- Seed script (10 users)
- Unit tests: auth service, password schema

### Frontend (`frontend/`)

- React 19 + Vite 8 + MUI 9 + Tailwind 4
- Redux Toolkit + RTK Query with cache invalidation tags
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
| `ticket_counters` | New — atomic sequential ID generation |

Indexes applied via `apply-indexes.ts` on startup (status, assignee, email unique, etc.).

**Seed:** `npm run seed` — 10 sample users, password `Password123!`

---

## Testing Done

| Test | Result |
| ---- | ------ |
| `backend npm test` | Pass (auth.service, password.schema) |
| `backend npm run lint` | Pass |
| `backend npm run typecheck` | Pass |
| `frontend npm run lint` | Pass |
| `frontend npm run build` | Pass |
| Manual E2E: auth flow | Pass |
| Manual E2E: ticket CRUD + status + comments | Pass |
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
2. Login: `john@example.com` / `Password123!`
3. Dashboard → view stat cards and chart.
4. Tickets → search, filter by status, sort by date.
5. Create Ticket → fill all fields → submit.
6. Open ticket details → add comment → change status to `in_progress`.
7. Edit ticket → change priority → save.
8. Transition to `resolved` → `closed` → verify edit button hidden and edit page blocked.
9. Toggle dark mode in settings (if enabled).

*Screenshots: attach `dashboard.png`, `ticket-list.png`, `ticket-details.png`, `create-ticket.png` when preparing final submission zip.*

---

## Known Limitations

1. No role-based endpoint authorization (roles stored, not enforced).
2. Limited automated test coverage (2 backend unit test files only).
3. `on_hold` status exists in enum but limited UI transition support.
4. Hard delete for tickets (no soft delete / audit trail).
5. No email notifications or file attachments.
6. MongoDB Atlas requires IP whitelist configuration on developer machine.
7. Comment `isInternal` field in DB design not exposed in UI.

---

## Future Improvements

- Supertest integration test suite
- Vitest + RTL for form components
- RBAC middleware per route
- Soft delete + activity log
- Email/Slack notifications on assignment
- File uploads on tickets
- GitHub Actions CI
- Playwright E2E tests
