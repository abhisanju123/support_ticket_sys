# Design Notes

## Architecture Overview (frontend, backend, database)

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (React SPA)                      │
│  Pages → Features → Components → RTK Query → Axios/baseQuery │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS / JSON + JWT Bearer
┌────────────────────────────▼────────────────────────────────┐
│                   Express API (Node.js / TS)                   │
│  Routes → Middleware (auth, validate) → Controllers → Services │
└────────────────────────────┬────────────────────────────────┘
                             │ Mongoose ODM
┌────────────────────────────▼────────────────────────────────┐
│                         MongoDB                                │
│   Collections: users, tickets, comments, notifications, ticket_counters     │
└───────────────────────────────────────────────────────────────┘
```

**Communication:** REST over JSON. Success/error envelopes defined in `docs/API_CONTRACT.md`. Frontend `VITE_API_BASE_URL` points to backend (default `http://localhost:3000`).

---

## Frontend Design

### Stack

- **React 19** + **Vite 8** (ESM)
- **Material UI 9** for components; **Tailwind CSS 4** for utility classes
- **Redux Toolkit** + **RTK Query** for server state and caching
- **React Router 7** for routing
- **React Hook Form** + **Zod** for forms

### Structure

```
frontend/src/
├── api/           # baseApi, baseQuery (JWT), cache rules
├── app/           # providers, NotificationProvider
├── components/    # business + common UI
├── features/      # auth, tickets, dashboard, users, notifications, command-palette
├── layouts/       # MainLayout, AppHeader, AppSidebar
├── pages/         # route-level page components
├── routes/        # AppRouter, protected routes
├── store/         # Redux slices (auth, tickets UI, notifications)
├── styles/        # tokens.css, utilities.css, global.css
└── utils/         # validation, apiError, formatters
```

### Key patterns

- **Feature folders** colocate API slices, hooks, components, constants.
- **Sequential ticket IDs** in routes: `getTicketRouteId(ticket)` → `ticketNumber`.
- **Protected routes** redirect unauthenticated users to `/login`.
- **Notifications bell** — unread count polled every 60s; full list fetched only when menu opens; RTK cache keyed by `userId`; API state reset on logout.
- **Form completion**: `useValidatedForm` exposes `isFormComplete`; submit disabled until required fields filled.
- **Theming**: MUI `ThemeProvider` with light/dark `colorSchemes`; shared CSS variables in `tokens.css`.

### UI layout (post Phase 9)

- Full-width header (logo, search, notifications, profile)
- Sidebar inside content grid (not full-height viewport column)
- Breadcrumbs below header, inside page content
- White `app-panel` cards for dashboard stats, forms, tables

---

## Backend Design

### Stack

- **Node.js 20+**, **Express 5**, **TypeScript**
- **Mongoose 9** for MongoDB
- **Zod 4** for env + request validation
- **bcryptjs** + **jsonwebtoken** for auth

### Layered architecture

```
routes/          HTTP path definitions + validation middleware
controllers/     Parse request, call service, send response
services/        Business rules, orchestration
repositories/    Database access (interfaces + implementations)
models/          Mongoose schemas
schemas/         Zod request/response validation
middlewares/     authenticate, validate, errorHandler
exceptions/      Typed HTTP exceptions (NotFound, Validation, Forbidden, …)
```

### Key services

| Service | Responsibility |
| ------- | -------------- |
| `TicketCreationService` | Create ticket, assign users, set `open` status |
| `TicketUpdateService` | Update fields; reject if `closed` |
| `TicketStatusService` | Validate transitions, set lifecycle timestamps |
| `TicketDeletionService` | Remove ticket + related comments |
| `DashboardService` | Aggregate counts by status |
| `AuthService` | Register, login, bcrypt, JWT |
| `CommentService` | Add/list comments per ticket; trigger notifications |
| `NotificationService` | List unread, unread count, mark read / mark all read |
| `TicketSearchFilterService` | Cross-field keyword search + filters |

### Auth & authorization

- `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/me`
- `Authorization: Bearer <token>` on protected ticket/user/notification routes
- Password hashed with bcrypt; never returned in API responses
- **Ticket access:** employees limited to own/assigned tickets; admin and support_agent see all
- **Assignee rules:** only `admin` / `support_agent` may be assigned; validated in `ticket-access.ts`
- **Permissions:** `permission-check.ts` + `ROLE_PERMISSIONS` for status change and related actions

### Notifications

- `notifications` collection with compound index `{ recipientId, read, createdAt }`
- Created on comments, ticket updates, and status changes via `resolveNotificationRecipients()`
- Routing: employee activity → assignee; staff activity → employee creator; actor excluded
- API: `GET /notifications`, `GET /notifications/unread-count`, `PATCH /notifications/:id/read`, `PATCH /notifications/read-all`

---

## Database Design

See full detail: [`../DATABASE_DESIGN.md`](../DATABASE_DESIGN.md)

### Collections

| Collection | Purpose |
| ---------- | ------- |
| `users` | Employees (name, email, passwordHash, role) |
| `tickets` | Support requests (title, description, status, priority, refs) |
| `comments` | Thread messages on tickets |
| `notifications` | In-app bell notifications (recipient, message, ticket ref, read flag) |
| `ticket_counters` | Atomic sequential `ticketNumber` generation |

### Relationships

- Ticket `createdBy` → User (required)
- Ticket `assignedTo` → User (optional)
- Comment `ticketId` → Ticket; `createdBy` → User

### Indexes

- Tickets: `ticketNumber` (unique), `status`, `assignedTo + status`, text search fields
- Users: `email` (unique)
- Comments: `ticketId + createdAt`
- Notifications: `recipientId + read + createdAt`

---

## Validation Strategy

| Layer | Mechanism |
| ----- | --------- |
| Frontend forms | Zod schemas + `useValidatedForm` + React Hook Form |
| API requests | `validate` middleware with Zod body/params/query schemas |
| Business rules | Service layer throws `ValidationException`, `ForbiddenException` |
| Environment | `env.ts` Zod schema at startup |

Field errors from API (`VALIDATION_ERROR`) map to form fields via `handleFormApiError` / `applyFieldErrors`.

---

## Error Handling Strategy

### Backend

- `AppException` subclasses → global error middleware → consistent JSON envelope
- Zod failures → `422` with `error.details.fields`
- Unexpected errors → `500` with generic message (no stack leak in production)

### Frontend

- RTK Query `baseQuery` attaches JWT; handles 401 redirect
- `apiListener` middleware shows toasts on rejected mutations/queries; resets RTK cache on `clearCredentials`
- `getApiErrorMessage()` extracts human-readable text + status
- Page-level: `LoadingSpinner`, `ErrorState`, `EmptyState`, `NotFoundState`

---

## Testing Strategy Link

See [`test-strategy.md`](./test-strategy.md) for scope, existing tests, and gaps.

**Quick summary:**

- Backend: Jest unit tests for auth, password schema, RBAC, notification routing, keyword search, ticket access; integration test for RBAC
- Frontend: manual QA; no automated component tests yet
- Recommended next: Supertest integration tests for ticket CRUD + status transitions
