# Implementation Plan

## Overview

Deliver a monorepo Support Ticket System in two packages (`backend`, `frontend`) with a **contract-first** approach: define API contract and database schema before UI integration. Work proceeded in phased AI-assisted prompts (documented in `docs/PROMPTS.md` and `docs/FRONTEND_PROMPTS.md`), with manual validation after each phase.

**High-level sequence:**

1. Backend foundation → database → repositories → services → routes → auth
2. API contract freeze → frontend scaffold → layout/theme → RTK Query APIs
3. Pages (dashboard, tickets, create/edit/details) → forms/validation → polish

---

## Task Breakdown

### Phase 1 — Backend foundation

| Task | Status |
| ---- | ------ |
| Express + TypeScript project setup | Done |
| MongoDB connection with retry + Windows SRV DNS workaround | Done |
| Environment config (Zod-validated `env.ts`) | Done |
| Global error middleware + response envelope | Done |
| Health check endpoint | Done |

### Phase 2 — Data layer

| Task | Status |
| ---- | ------ |
| Mongoose models: User, Ticket, Comment | Done |
| Sequential `ticketNumber` counter collection | Done |
| Indexes (status, assignee, createdAt, etc.) | Done |
| Seed script (10 users, default password) | Done |

### Phase 3 — Business logic

| Task | Status |
| ---- | ------ |
| Repository layer (ticket, user, comment) | Done |
| Service layer (create, update, status, delete, dashboard) | Done |
| Status transition validation | Done |
| Closed ticket edit guard | Done |
| JWT auth (login, register, me) | Done |

### Phase 4 — API surface

| Task | Status |
| ---- | ------ |
| Ticket CRUD + status PATCH + comments | Done |
| User list endpoint | Done |
| Dashboard statistics endpoint | Done |
| Request validation schemas (Zod) | Done |
| `docs/API_CONTRACT.md` | Done |

### Phase 5 — Frontend foundation

| Task | Status |
| ---- | ------ |
| Vite + React 19 + MUI + Tailwind | Done |
| Theme tokens, dark mode, layout (header, sidebar, breadcrumbs) | Done |
| Redux store + RTK Query base API + auth token injection | Done |
| React Router + protected routes | Done |

### Phase 6 — Frontend features

| Task | Status |
| ---- | ------ |
| Login / Register pages | Done |
| Dashboard with stat cards + charts | Done |
| Ticket list (table, filters, search, pagination) | Done |
| Create / Edit / Details pages | Done |
| Comments section | Done |
| Command palette (Ctrl+K) | Done |
| Form validation + disabled submit until complete | Done |
| UI polish (panels, toasts, button hover, form styling) | Done |

### Phase 7 — Quality & docs

| Task | Status |
| ---- | ------ |
| Backend unit tests (auth, password, RBAC, notifications, search) | Done |
| RBAC integration test | Done |
| ESLint / Prettier / Husky | Done |
| Submission documentation pack | Done |

### Phase 8 — Notifications, RBAC & search polish

| Task | Status |
| ---- | ------ |
| `notifications` collection + API endpoints | Done |
| Role-based notification routing (comments, updates, status) | Done |
| Frontend bell menu + unread badge + mark read | Done |
| Per-user RTK cache + logout API reset | Done |
| Cross-field ticket keyword search | Done |
| Assignee dropdown: admin/agent only | Done |
| Dashboard status chart includes cancelled | Done |
| Auth login 50/50 layout (remove mock preview cards) | Done |

---

## Milestones

| Milestone | Target | Outcome |
| --------- | ------ | ------- |
| M1 — API running locally | Week 1 | Health + ticket CRUD without UI |
| M2 — Contract + DB stable | Week 1 | `API_CONTRACT.md`, seed data |
| M3 — Frontend integrated | Week 2 | All pages call real API |
| M4 — Auth end-to-end | Week 2 | JWT login, protected routes |
| M5 — UX polish + edge cases | Week 2 | Closed ticket rules, form prefill, styling |
| M6 — Submission artifacts | Week 2 | `docs/submission/` complete |

---

## AI Usage Plan

| Phase | How AI was used |
| ----- | ---------------- |
| Scaffolding | Generate folder structure, boilerplate configs, ESLint/Prettier |
| Backend layers | Implement repositories/services from design docs |
| API contract | Draft and iterate endpoint shapes; human review for consistency |
| Frontend UI | Build pages/components from phased prompts in `FRONTEND_PROMPTS.md` |
| Debugging | Diagnose MongoDB Atlas SSL/IP issues, form reset bugs, select prefill |
| Documentation | Generate submission templates populated from actual codebase |
| Review | AI-suggested refactors; human accepted/rejected per scope |

**Rules followed:**

- Contract-first: no breaking API changes without doc update
- Minimal diff: avoid unrelated refactors
- Validate AI output by running `npm run dev`, `npm test`, manual UI checks

---

## Risks

| Risk | Impact | Likelihood |
| ---- | ------ | ---------- |
| MongoDB Atlas connectivity (IP whitelist) | Blocks backend startup | Medium |
| AI-generated code drift from patterns | Inconsistent architecture | Medium |
| RTK Query cache staleness | Wrong UI after mutations or user switch | Low (tags + per-user scope + logout reset) |
| RHF + MUI Select integration | Empty dropdown on edit | Medium (fixed with controlled value) |
| Over-scoping assessment | Miss deadline | Low (phased prompts) |
| Secrets in `.env` committed | Security incident | Low (gitignored) |

---

## Mitigation

| Risk | Mitigation |
| ---- | ---------- |
| Atlas connectivity | Document IP whitelist; local MongoDB fallback; Windows DNS workaround in `connection.ts` |
| Pattern drift | Cursor rules, existing file conventions, layered folder structure |
| Cache issues | RTK Query `tagTypes` + `invalidatesTags`; per-user notification cache; `resetApiState` on logout |
| Form bugs | `useValidatedForm`, controlled selects, stable `ticketId` key on edit form |
| Scope creep | Acceptance criteria checklist; defer email delivery, attachments, full endpoint RBAC |
| Secrets | `.gitignore` for `.env`; `.env.example` only |
