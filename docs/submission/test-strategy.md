# Test Strategy

## Test Scope

Testing covers:

- **Backend unit logic** — auth service, password schema, RBAC permissions, notification routing, keyword search, ticket access
- **Backend integration** — RBAC ticket visibility and assignee validation
- **Manual end-to-end** — full user flows through React UI against live API
- **Static analysis** — ESLint, TypeScript `typecheck`, Prettier on backend

**Out of scope for this submission:**

- Frontend automated tests (no Vitest/Jest setup in frontend)
- Load/performance testing
- Cross-browser matrix (Chrome primary)
- Security penetration testing

---

## Unit Tests

| File | What it covers |
| ---- | -------------- |
| `backend/src/tests/unit/auth.service.test.ts` | Login/register logic, password hashing, JWT payload |
| `backend/src/tests/unit/password.schema.test.ts` | Password Zod schema rules (length, charset, special chars) |
| `backend/src/tests/unit/permission-check.test.ts` | Role permission matrix |
| `backend/src/tests/unit/ticket-access.test.ts` | Ticket visibility and assignee validation |
| `backend/src/tests/unit/notification-routing.test.ts` | Bell notification recipient routing by role |
| `backend/src/tests/unit/ticket-keyword-search.test.ts` | Cross-field keyword search helper |
| `backend/src/tests/integration/rbac.integration.test.ts` | RBAC rules against live API routes |

**Run:**

```bash
cd backend
npm test
```

**Framework:** Jest + ts-jest

---

## Component Tests

| Area | Status |
| ---- | ------ |
| React page components | Not implemented |
| Form components (`TicketForm`, `LoginForm`) | Not implemented |
| RTK Query hooks | Not implemented |

**Recommendation:** Add Vitest + React Testing Library; priority tests:

- `useValidatedForm` / `isFormComplete`
- `isTicketEditable` helper
- `PriorityDropdown` controlled value rendering

---

## API / Integration Tests

| Area | Status |
| ---- | ------ |
| Supertest + Express app | Wired for RBAC integration test |
| Ticket CRUD flow | Manual via Postman / UI |
| Status transition rules | Manual + service-level reasoning |
| Notification routing | Unit tests + manual bell UI |
| Auth middleware | Covered via auth service unit tests and RBAC integration |

**Recommended integration tests:**

1. `POST /api/tickets` → `GET /api/tickets/:id` → `PUT` → `PATCH status` → `DELETE`
2. `PUT` on closed ticket → expect `403`
3. Invalid status transition → expect `400`
4. `POST /api/auth/login` with seed user → access protected route

---

## Edge Case Tests

| Scenario | How verified |
| -------- | ------------ |
| Closed ticket edit blocked | Manual: edit page shows empty state; API returns 403 |
| Empty form submit disabled | Manual: submit button grayed until fields filled |
| Edit form prefill | Manual: title, description, priority, assignee show saved values |
| Form reset on edit | Manual: reset icon restores original ticket data |
| Invalid login | Manual: toast with error message |
| 404 ticket | Manual: navigate to `/tickets/99999` |
| Pagination boundary | Manual: last page, empty list |
| Bell count after user switch | Manual: logout/login as different role; badge shows correct count |
| Notification list vs badge sync | Manual: mark all read; menu and badge agree |
| MongoDB connection failure | Observed during Atlas IP whitelist debugging |

---

## Tests Not Covered (and why)

| Gap | Reason |
| --- | ------ |
| Frontend unit/component tests | Time-boxed assessment; manual QA prioritized |
| Full API integration suite | Supertest harness not scaffolded; contract doc serves as spec |
| E2E (Playwright/Cypress) | No browser automation setup |
| Repository layer mocks | Services tested indirectly; repos thin wrappers |
| Comment CRUD automated tests | Manual verification on details page |
| Role-based access control | Partial — ticket visibility, assignee rules, permissions; not every endpoint role-gated |
| Concurrent ticket number assignment | Low risk; counter uses atomic MongoDB operation |
| Accessibility (axe) | Not in assessment scope |

---

## Test Data

- **Seed script:** `npm run seed` in `backend/`
- **10 users** with default password `Password123!`
- Example logins (password `Password123!`):
  - Employee: `abhishek@example.com`
  - Admin: `jane@example.com`
  - Agent: `john@example.com`

---

## Quality Gates (CI-ready)

| Check | Command |
| ----- | ------- |
| Backend lint | `cd backend && npm run lint` |
| Backend typecheck | `cd backend && npm run typecheck` |
| Backend tests | `cd backend && npm test` |
| Frontend lint | `cd frontend && npm run lint` |
| Frontend build | `cd frontend && npm run build` |

Pre-commit (backend): Husky + lint-staged runs ESLint + Prettier on staged files.
