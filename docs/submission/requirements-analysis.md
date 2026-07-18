# Requirement Analysis

## Selected Project Option

**Support Ticket Management System** — an internal tool for employees to log, assign, prioritize, and resolve IT/support requests with full lifecycle tracking and collaboration via comments.

---

## My Understanding (in your own words)

Employees need a single place to report issues (tickets), see who is working on them, and follow progress from **Open** through **Resolved/Closed**. Support agents and managers need visibility via a dashboard, searchable ticket list, and the ability to change status according to business rules. The system is **internal** (not customer-facing), so user accounts represent employees with roles. Tickets must retain audit-friendly metadata (creator, assignee, timestamps, comments). The UI should be responsive, accessible enough for daily use, and consistent across pages.

---

## Functional Requirements

| ID | Requirement |
| -- | ----------- |
| FR-01 | Users can register and log in with email/password (JWT). |
| FR-02 | Authenticated users can view a dashboard with ticket statistics. |
| FR-03 | Users can list tickets with pagination, sorting, keyword search, and filters (status, priority, assignee). |
| FR-04 | Users can create a ticket with title, description, priority, reporter (`createdBy`), and assignee (`assignedTo`). |
| FR-05 | Users can view ticket details including status, priority, metadata, and comments. |
| FR-06 | Users can edit ticket fields (title, description, priority, assignee) except when status is **closed**. |
| FR-07 | Users can change ticket status only via allowed workflow transitions. |
| FR-08 | Users can add comments to a ticket. |
| FR-09 | Users can delete tickets (with confirmation). |
| FR-10 | Ticket URLs and API identifiers use sequential **ticket numbers** (1, 2, 3…) for readability. |
| FR-11 | User dropdowns list employees by name; seeded sample users available for development. |

---

## Non-Functional Requirements

| ID | Requirement |
| -- | ----------- |
| NFR-01 | REST API with JSON request/response and documented contract. |
| NFR-02 | Input validation on client (Zod) and server (Zod middleware). |
| NFR-03 | Layered backend (controller / service / repository) for maintainability. |
| NFR-04 | Responsive UI (MUI breakpoints + Tailwind utilities). |
| NFR-05 | Light/dark theme support via MUI color schemes. |
| NFR-06 | Graceful API error handling with user-visible toasts (status-prefixed messages). |
| NFR-07 | MongoDB with indexes for common query patterns. |
| NFR-08 | Code quality gates: ESLint, Prettier, Husky pre-commit on backend. |
| NFR-09 | Backend connection retry for MongoDB; supplemental DNS for Atlas on Windows. |

---

## Assumptions

1. **Single organization** — all users are internal employees; no multi-tenant isolation required.
2. **JWT auth is sufficient** — no OAuth/SSO in scope for this assessment.
3. **Role-based UI restrictions are minimal** — all authenticated users can perform core ticket operations; fine-grained RBAC is a future enhancement.
4. **Comments are public to authenticated users** — internal-only comment flag exists in DB design but is not fully exposed in UI.
5. **MongoDB** is the system of record; no event sourcing or separate read models.
6. **English-only** UI and API messages.
7. **Ticket category** field exists in DB design but is optional and not required in MVP forms.

---

## Clarifications (questions for a product owner)

1. Should **cancelled** tickets be editable, or only **closed**? (Currently: closed tickets are locked; cancelled behavior may differ.)
2. Should employees only see tickets they created or are assigned to, or all tickets?
3. Is **email notification** on assignment/status change in scope?
4. Should **on_hold** status be reachable from the UI given API transition rules?
5. Are **file attachments** required on tickets or comments?
6. What is the **password policy** for production vs. dev seed users?
7. Should **deleted tickets** be soft-deleted for audit retention?

---

## Edge Cases

| Scenario | Expected behavior |
| -------- | ----------------- |
| Edit ticket with status `closed` | Blocked in UI and API (`403 Forbidden`). |
| Invalid status transition (e.g. `open` → `closed`) | `400 Bad Request` with business rule message. |
| Assign ticket to non-existent user | `404 Not Found`. |
| Empty required form fields | Submit button disabled; server returns `422` if bypassed. |
| MongoDB Atlas IP not whitelisted | Connection fails with retry; dev can use local MongoDB. |
| Stale RTK Query cache after mutation | Cache tags invalidate list/detail/dashboard. |
| Ticket list with no results | Empty state with guidance to create or clear filters. |
| Unauthenticated API access | `401 Unauthorized` on protected routes. |
| Password with special characters in Atlas URI | Must be URL-encoded in `MONGODB_URI`. |
| Reset form on edit | Restores original ticket snapshot, not empty fields. |
