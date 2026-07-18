# Acceptance Criteria

## Core

- [x] User can register with name, email, and password meeting policy rules.
- [x] User can log in and receive a JWT; token is sent on subsequent API requests.
- [x] User can log out (client-side token clear) and session expires per `JWT_EXPIRES_IN`.
- [x] Dashboard displays ticket counts (total, open, in progress, resolved, closed, cancelled).
- [x] Ticket list supports pagination, column sorting, keyword search, and status/priority filters.
- [x] User can create a ticket with title, description, priority, createdBy, and assignedTo.
- [x] User can open ticket details by sequential ticket number in the URL.
- [x] User can edit ticket title, description, priority, and assignee (when not closed).
- [x] User can change ticket status only through allowed transitions.
- [x] User can add comments on the ticket details page.
- [x] User can delete a ticket with confirmation dialog.
- [x] Navigation: sidebar, breadcrumbs, header with search (Ctrl+K command palette).

## Validation

- [x] Client-side Zod schemas for login, register, create/edit ticket, and comment forms.
- [x] Submit disabled until all required fields are non-empty.
- [x] Server-side Zod validation on all request bodies, params, and query strings.
- [x] Field-level API validation errors mapped to form fields where applicable.
- [x] Password policy: min 8 chars, upper, lower, digit 1–9, special `@$!`.

## Error Handling

- [x] Standard API error envelope (`success`, `message`, `error.code`, `error.details`).
- [x] HTTP status codes: 400, 401, 403, 404, 422, 500 as documented.
- [x] Frontend toast notifications with status prefix (e.g. `[404]`, `[422]`).
- [x] Loading, error, and empty states on pages and tables.
- [x] 404 page for unknown routes and missing tickets.
- [x] MongoDB connection retry with logged attempts on backend startup.

## Testing

- [x] Backend unit tests: `auth.service.test.ts`, `password.schema.test.ts`.
- [ ] Frontend component tests (not implemented — manual QA via dev server).
- [ ] API integration tests with Supertest (infrastructure present, limited coverage).
- [x] Manual end-to-end flows verified: auth, CRUD tickets, status workflow, comments.

## Documentation

- [x] Root `README.md` with quick start.
- [x] `docs/API_CONTRACT.md` — full REST contract (725+ lines).
- [x] `docs/DATABASE_DESIGN.md`, repository/service layer design docs.
- [x] `docs/PROMPTS.md` and `docs/FRONTEND_PROMPTS.md` — AI build history.
- [x] `docs/submission/` — assessment artifact pack (this folder).
- [x] `.env.example` files for backend and frontend.
