# Code Review Notes

## AI-Assisted Review Summary

AI (Cursor) was used iteratively to review:

- Form validation wiring (`useValidatedForm`, Zod schemas, submit disabled states)
- Ticket edit lifecycle (closed status guard, prefill, reset behavior)
- MUI theme overrides (button hover, disabled styles, form inputs)
- Notification bell UX and RTK cache invalidation on auth change
- Layer boundaries (controllers thin, business rules in services)

Review style: prompt-based “check this file for bugs” plus inline fixes during feature work.

---

## My Review Observations

### Strengths

1. **Clear separation of concerns** — backend routes/controllers/services/repositories are consistent.
2. **Contract-first API** — `docs/API_CONTRACT.md` reduces frontend/backend drift.
3. **Shared validation language** — Zod on both tiers.
4. **RTK Query cache tags** — list/detail/dashboard invalidate on mutations.
5. **Reusable form utilities** — `useValidatedForm`, `formCompletion`, `handleFormApiError`.
6. **Design tokens** — CSS variables + MUI theme stay aligned.

### Areas for improvement

1. **Test coverage** — backend unit + RBAC integration tests added; no frontend tests yet.
2. **RBAC** — ticket visibility, assignee rules, and permissions implemented; not every endpoint is role-gated.
3. **Comment model** — DB has `isInternal`; API/UI do not expose it.
4. **`on_hold` status** — in enum but limited transition support in UI.
5. **Duplicate documentation** — `docs/API_CONTRACT.md` vs submission `api-contract.md` (intentional summary).
6. **Edit form `initialValues` memo** — depends only on `ticketId`; if ticket refetched with new data same ID, form won’t auto-refresh (acceptable for MVP).

---

## Changes Made After Review

| Change | Motivation |
| ------ | ---------- |
| Closed tickets not editable (403 + UI hide) | Business rule / data integrity |
| Submit disabled until required fields filled | Prevent noisy 422 errors |
| Controlled `PriorityDropdown` | Fix blank select on edit |
| Remove ticket-object `useEffect` reset | Stop wiping user input |
| `resolveTicketUserId` helper | Consistent populated user ID handling |
| MUI disabled button `pointer-events: none` | Clear non-interactive affordance |
| Reset as icon beside submit | UX consistency create/edit |
| Restore `OBJECT_ID_REGEX` export | Fix runtime import error |
| Atlas connection diagnostics documented | Operational troubleshooting |
| In-app notifications + role-based routing | Bell UX for ticket activity |
| Cross-field ticket keyword search | Match assignee, status, priority, date, ticket # |
| Assignee dropdown filtered to admin/agent | Align UI with status-change permission |
| Per-user RTK notification cache + logout reset | Fix stale bell count on user switch |

---

## Suggestions Rejected (and why)

| Suggestion | Why rejected |
| ---------- | ------------ |
| Add Redux for all form state | React Hook Form already manages forms; unnecessary duplication |
| Replace MUI with headless UI only | MUI already integrated; large rewrite for assessment scope |
| Use MongoDB `_id` in URLs again | Sequential ticket numbers already implemented and preferred for UX |
| Auto-login after register | Product decision: redirect to login for explicit sign-in |
| Allow editing closed tickets | Violates workflow; reopen would need new status transition |
| Add `0.0.0.0/0` to repo/docs as default | Security risk; documented as dev-only operator action |
| Full E2E suite before submission | Time-boxed; manual QA + unit tests prioritized |
| Merge submission API doc into single file | Keep full contract separate; summary for reviewers |

---

## Pre-Submission Checklist

- [x] `npm run dev` works (backend + frontend) with local MongoDB
- [x] `npm test` passes in backend
- [x] `npm run lint` passes (both packages)
- [x] `.env` not committed
- [x] Submission docs reflect actual implementation
- [x] Known limitations documented in `pr-description.md`
