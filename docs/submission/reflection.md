# Reflection

## What I Built

A production-style **Support Ticket Management System** monorepo:

- **Backend:** Express 5 + TypeScript REST API with MongoDB, JWT auth, Zod validation, layered architecture, seed data, and sequential ticket numbers.
- **Frontend:** React 19 SPA with dashboard, searchable/filterable ticket table, create/edit/details flows, comments, command palette, auth pages, and polished form/button UX.
- **Documentation:** API contract, database design, AI prompt archives, and this submission pack.

The system supports the full ticket lifecycle from creation through resolution and closure, with comments and dashboard visibility.

---

## How I Used AI (across the lifecycle)

| Lifecycle stage | AI usage |
| --------------- | -------- |
| **Requirements** | Drafted requirement analysis and acceptance criteria from project goals |
| **Design** | Generated architecture notes, folder structures, layer diagrams |
| **Implementation** | Phased prompts in `PROMPTS.md` / `FRONTEND_PROMPTS.md` for scaffold + features |
| **Debugging** | Diagnosed MongoDB Atlas, form reset, MUI select prefill issues |
| **Testing** | Auth/password unit tests scaffolded with AI assistance |
| **Documentation** | Populated submission templates from real codebase state |
| **Review** | AI code review suggestions; human filtered for scope and correctness |

Primary tool: **Cursor** (agent mode with file edits, terminal diagnostics, and multi-file context).

---

## What AI Helped With Most

1. **Boilerplate velocity** — ESLint, Prettier, Husky, Vite, Express, Mongoose setup in hours not days.
2. **Consistent patterns** — RTK Query slices, Zod schemas, service/repository interfaces.
3. **UI composition** — MUI layout, table, forms, theme overrides from natural language prompts.
4. **Debugging obscure issues** — Atlas TLS + IP whitelist pattern; RHF + MUI Select interaction.
5. **Documentation** — Turning codebase knowledge into structured submission artifacts.

---

## What AI Got Wrong

1. **Over-aggressive `useEffect` resets** — Suggested/accepted `reset(ticket)` on full object dependency, causing edit form to revert while typing (fixed manually).
2. **Accidental export removal** — Adding `isTicketEditable` removed `OBJECT_ID_REGEX` export (caught at runtime).
3. **Misleading SSL errors** — Initially looked like TLS/code bug; was Atlas IP whitelist (AI helped diagnose but first instinct was code changes).
4. **Occasional scope creep** — Proposed refactors unrelated to current task; rejected per minimal-diff rule.
5. **Assumed `.env.local`** — Log messages referenced dotenv paths not always present in project.

---

## How I Validated AI Output

1. **Ran the app** — `npm run dev` on backend and frontend after each major change.
2. **Manual UI flows** — Login, create ticket, edit, status change, comment, delete.
3. **Backend tests** — `npm test` for auth and password schema.
4. **Lint/typecheck** — ESLint and `tsc --noEmit` on backend.
5. **Read generated code** — Verified business rules (status transitions, closed edit guard) against `API_CONTRACT.md`.
6. **Network diagnostics** — DNS, TCP, public IP checks for MongoDB issues (not blind env changes).
7. **Browser console** — Caught missing export and RTK errors quickly.

---

## What I Would Improve Next

1. **Automated tests** — Supertest API integration suite + Vitest component tests for forms.
2. **Role-based authorization** — Restrict delete/status change by `support_agent` / `admin`.
3. **Real-time updates** — WebSockets or polling for ticket list on multi-user teams.
4. **Email notifications** — On assignment and status change.
5. **Attachment support** — S3/gridfs for ticket evidence files.
6. **CI pipeline** — GitHub Actions: lint, test, build on PR.
7. **Accessibility audit** — Keyboard nav, ARIA on tables and modals.
8. **Soft delete** — Retain tickets for audit instead of hard delete.

---

## Reusable Workflow (prompts, rules, specs, templates)

### Artifacts to reuse

| Artifact | Location | Use |
| -------- | -------- | --- |
| API contract template | `docs/API_CONTRACT.md` | Any new endpoint |
| Phased build prompts | `docs/PROMPTS.md`, `docs/FRONTEND_PROMPTS.md` | Greenfield features |
| Submission templates | `docs/submission/` | Future assessments |
| Form validation hook | `frontend/src/utils/validation/useValidatedForm.js` | Any CRUD form |
| Error handling | `handleFormApiError.js`, `apiError.js` | API-integrated forms |
| Layer design docs | `DATABASE_DESIGN.md`, `SERVICE_LAYER_DESIGN.md` | Onboarding |

### Prompt patterns that worked

1. **“Contract-first — do not change response shapes”** before frontend work.
2. **“Follow existing conventions in this file”** to reduce pattern drift.
3. **“Minimal diff — only change what’s required”** to avoid refactors.
4. **Phased prompts** (setup → layout → API → pages → polish) instead of one giant prompt.
5. **Paste error logs verbatim** for debugging (Atlas SSL, module export errors).

### Cursor rules applied

- No commits unless requested
- No secrets in code/docs
- Validate with tests or manual run after logic changes
- Security defaults (bcrypt, JWT, helmet, CORS)
