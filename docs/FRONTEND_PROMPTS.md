# Support Ticket System — Frontend Build Prompts

This document archives every prompt used to build the **Support Ticket Management System** frontend. Prompts are listed in development order.

Use this file to reproduce the frontend step-by-step in Cursor or another AI coding assistant.

> **Prerequisite:** Complete the backend and [`API_CONTRACT.md`](./API_CONTRACT.md) first. The frontend integrates against that contract (extended with `GET /users` and `DELETE /tickets/:id`).

---

## Table of Contents

1. [Phase 1 — Project Setup & Infrastructure](#phase-1--project-setup--infrastructure)
2. [Phase 2 — Layout & Design System](#phase-2--layout--design-system)
3. [Phase 3 — Redux & API Integration](#phase-3--redux--api-integration)
4. [Phase 4 — Business Pages](#phase-4--business-pages)
5. [Phase 5 — Reusable Business Components](#phase-5--reusable-business-components)
6. [Phase 6 — Form Validation](#phase-6--form-validation)
7. [Phase 7 — Search, Filter, Workflow & Sync](#phase-7--search-filter-workflow--sync)
8. [Phase 8 — Delete Ticket](#phase-8--delete-ticket)
9. [Phase 9 — UI/UX Polish & Layout Refinements](#phase-9--uiux-polish--layout-refinements)
10. [Troubleshooting & Q&A Prompts](#troubleshooting--qa-prompts)
11. [Prompt-to-Artifact Map](#prompt-to-artifact-map)

---

## Phase 1 — Project Setup & Infrastructure

### Prompt 1.1 — Initialize Frontend Project

```
The Support Ticket Management System will be used by internal employees to manage support tickets. This prompt focuses only on setting up the frontend project and installing the required dependencies. No business pages should be created yet.

Task
Create React application
Configure latest JavaScript
Install Material UI
Install Tailwind CSS
Install React Router DOM
Install Redux Toolkit
Install RTK Query
Install Axios
Install React Hook Form
Install Zod
Configure ESLint
Configure Prettier

Do not create UI pages.
```

> **Result:** Vite + React app in `frontend/`, minimal scaffold, no business pages.

---

### Prompt 1.2 — Configure Tailwind & Material UI

```
Configure Tailwind & Material UI

The application should provide a clean, responsive, and consistent user interface for internal employees.

Task
Configure latest Tailwind CSS
Configure Material UI theme
Setup responsive breakpoints
Configure typography
Configure color palette
Configure reusable spacing
Configure dark mode support (optional)

No business UI.
```

> **Result:** `frontend/src/theme/`, Tailwind in Vite, MUI theme.

---

### Prompt 1.3 — Create Folder Structure

```
Create Folder Structure

The frontend should follow a scalable feature-based architecture to support future modules.

Task: Create a production-ready folder structure.

src/
├── api/
├── app/
├── assets/
├── components/
├── constants/
├── features/
├── hooks/
├── layouts/
├── pages/
├── routes/
├── services/
├── store/
├── styles/
├── theme/
├── utils/
└── App.jsx

Create placeholder files only.
```

> **Result:** Feature-based tree under `frontend/src/`.

---

### Prompt 1.4 — Configure Routing

```
Configure Routing

Employees should navigate between different sections of the application using client-side routing.

Task: Configure React Router.

Create routes for:
Dashboard
Tickets
Create Ticket
Ticket Details
Edit Ticket
404 Page

Do not create page content.
```

> **Result:** `frontend/src/routes/AppRouter.jsx`, `frontend/src/pages/`, route constants.

---

## Phase 2 — Layout & Design System

### Prompt 2.1 — Theme & Global Styles

```
Theme & Global Styles

Configure:
Material UI Theme
Global CSS
Tailwind integration
CSS reset
Typography
Shared colors
Shared spacing
Common utility classes
```

> **Result:** `frontend/src/styles/`, `frontend/src/theme/`.

---

### Prompt 2.2 — Main Layout

```
Main Layout

Create:
Main Layout, Responsive layout, Content container
Header — Application title, User placeholder
Sidebar — Dashboard, Tickets, Create Ticket (highlight active route)
Breadcrumbs — auto-generated from routes
Common UI States — Loader, Empty State, Error State, No Results, Not Found
```

> **Result:** `frontend/src/layouts/`, `frontend/src/components/common/`.

---

## Phase 3 — Redux & API Integration

```
Prompt 3.1  Configure Redux Store
     ↓
Prompt 3.2  Configure RTK Query & Axios
     ↓
Prompt 3.3  Integrate Ticket APIs
     ↓
Prompt 3.4  Integrate Comment APIs
     ↓
Prompt 3.5  Global API Error Handling & Cache Management
```

### Prompt 3.1 — Configure Redux Store

Centralized Redux for UI state only (filters, pagination). RTK Query for server data. Feature UI slices: `ticketsUi`, `dashboardUi`, `commentsUi`.

> **Result:** `frontend/src/store/`, feature UI slices.

---

### Prompt 3.2 — Configure RTK Query & Axios

Shared API foundation: `baseApi.js`, `baseQuery.js`, env vars, Axios instance, tag types.

> **Result:** `frontend/src/api/`, `frontend/src/constants/api.constants.js`.

---

### Prompt 3.3 — Integrate Ticket APIs

```
Endpoints:
POST   /tickets
GET    /tickets
GET    /tickets/dashboard
GET    /tickets/:id
PUT    /tickets/:id
PATCH  /tickets/:id/status
DELETE /tickets/:id

Hooks: create, list, dashboard, getById, update, updateStatus, delete
Cache tags: providesTags / invalidatesTags
```

> **Result:** `frontend/src/features/tickets/api/ticketsApi.js`.

---

### Prompt 3.4 — Integrate Comment APIs

```
POST   /tickets/:ticketId/comments
GET    /tickets/:ticketId/comments
```

> **Result:** `frontend/src/features/comments/api/commentsApi.js`.

Also: `GET /users` for employee dropdowns (`features/users/api/usersApi.js`).

---

### Prompt 3.5 — Global API Error Handling & Cache Management

Normalize API errors (400, 404, 422, 500). Global notification listener. Cache invalidation after mutations.

> **Result:** `frontend/src/utils/apiError.js`, `frontend/src/store/apiListener.js`, `NotificationProvider`.

---

## Phase 4 — Business Pages

### Prompt 4.1 — Dashboard Page

Overview of ticket volume and status distribution using `GET /tickets/dashboard`. Loader, ErrorState, EmptyState.

> **Result:** `frontend/src/pages/DashboardPage.jsx`.

---

### Prompt 4.2 — Tickets List Page

Browse, search, filter, paginate via `GET /tickets`. Create Ticket button. No local filtering.

> **Result:** `frontend/src/pages/TicketsPage.jsx`.

---

### Prompt 4.3 — Create Ticket Page

Form with React Hook Form + Zod. `POST /tickets`. Navigate to details on success.

> **Result:** `frontend/src/pages/CreateTicketPage.jsx`, `CreateTicketForm.jsx`.

---

### Prompt 4.4 — Edit Ticket Page

`GET` + `PUT /tickets/:id`. Editable fields only; status changed on details page.

> **Result:** `frontend/src/pages/EditTicketPage.jsx`, `EditTicketForm.jsx`.

---

### Prompt 4.5 — Ticket Details Page

Full ticket view, status control, comments section, edit link.

> **Result:** `frontend/src/pages/TicketDetailsPage.jsx`.

---

## Phase 5 — Reusable Business Components

Presentational components only: **props in, callbacks out**. No API, Redux, or business logic inside components.

```
Prompt 5.1  Dashboard Components
     ↓
Prompt 5.2  Ticket List Components
     ↓
Prompt 5.3  Ticket Form Components
     ↓
Prompt 5.4  Ticket Status Components
     ↓
Prompt 5.5  Comment Components
     ↓
Prompt 5.6  Shared Business Components
```

### Prompt 5.1 — Dashboard Components

`DashboardCard`, `DashboardCardGrid`, `DashboardSummary`, `StatisticsCard`

Display: Total, Open, In Progress, Resolved, Closed, Cancelled.

> **Result:** `frontend/src/components/business/dashboard/`.

---

### Prompt 5.2 — Ticket List Components

`TicketTable`, `TicketTableRow`, `TicketPriorityChip`, `TicketStatusBadge`, `TicketActionMenu`, `TicketToolbar`, `TicketSearchBox`, `TicketStatusFilter`, `PaginationComponent`

Features: search, status filter, sort indicators, pagination, view/edit/delete actions.

> **Result:** `frontend/src/components/business/tickets/list/`.

---

### Prompt 5.3 — Ticket Form Components

`TicketForm`, `TitleField`, `DescriptionField`, `PriorityDropdown`, `AssignedUserDropdown`, `CreatedByDropdown`, `FormActions`

Shared for Create and Edit modes. React Hook Form compatible.

> **Result:** `frontend/src/components/business/tickets/form/`.

---

### Prompt 5.4 — Ticket Status Components

`StatusBadge`, `StatusChip`, `StatusTimeline`, `StatusDropdown`, `StatusConfirmationDialog`

> **Result:** `frontend/src/components/business/tickets/status/`.

---

### Prompt 5.5 — Comment Components

`CommentList`, `CommentCard`, `CommentForm`, `CommentInput`, `CommentHeader`, `CommentEmptyState`

> **Result:** `frontend/src/components/business/comments/`.

---

### Prompt 5.6 — Shared Business Components

`PageHeader`, `PageTitle`, `SectionCard`, `ConfirmDialog`, `DeleteConfirmationDialog`, `EmptyState`, `ErrorState`, `LoadingSpinner`, `SkeletonLoader`, `SearchInput`, `FilterDropdown`, `NoResults`, `ActionButtons`, `BackButton`, `RefreshButton`, `PageContainer`, `FormErrorAlert`

> **Result:** `frontend/src/components/business/shared/`.

---

## Phase 6 — Form Validation

```
Prompt 6.1  Create Ticket Form Validation
     ↓
Prompt 6.2  Edit Ticket Form Validation
     ↓
Prompt 6.3  Comment Form Validation
     ↓
Prompt 6.4  Reusable Validation Utilities
```

### Prompt 6.1 — Create Ticket Form Validation

Validate: title, description, priority, assignedTo (optional), createdBy (required). Zod + RHF. Inline errors. Backend validation mapping. User must exist in `/api/users`.

> **Result:** `CreateTicketForm.jsx`, `utils/validation/ticketForm.schema.js`.

---

### Prompt 6.2 — Edit Ticket Form Validation

Editable: title, description, priority, assignedTo. Read-only: ticket ID, status, created by, created date.

> **Result:** `EditTicketForm.jsx`.

---

### Prompt 6.3 — Comment Form Validation

Message: required, trim, max length. Created by: required. Clear form after success.

> **Result:** `TicketCommentsSection.jsx`, `utils/validation/commentForm.schema.js`.

---

### Prompt 6.4 — Reusable Validation Utilities

`createZodSubmitHandler`, `applyFieldErrors`, `handleFormApiError`, `useValidatedForm`, `useFormGlobalError`, `resetFormState`, `FormErrorAlert`

Handle HTTP 400, 404, 409, 422, 500. Inline field errors + global alerts + success notifications.

> **Result:** `frontend/src/utils/validation/`.

---

## Phase 7 — Search, Filter, Workflow & Sync

```
Prompt 7.1  Keyword Search
     ↓
Prompt 7.2  Status Filtering
     ↓
Prompt 7.3  Status Workflow
     ↓
Prompt 7.4  Automatic Data Synchronization
```

### Prompt 7.1 — Keyword Search

```
Employees should quickly find support tickets using keyword search.
Search by title and description.
Call backend search endpoint.
Debounced search input.
URL sync for keyword.
Loading, empty results, API errors.
Never filter data locally.
```

> **Result:** `useTicketListSearch.js`, `useDebouncedValue.js`, URL params `?keyword=`.

---

### Prompt 7.2 — Status Filtering

```
Filter tickets by status using backend APIs.
Status values: Open, In Progress, Resolved, Closed, Cancelled.
Combined search + filter supported.
Clear filter. Loading and empty states.
```

> **Result:** Combined `keyword` + `status` query params; backend `listWithFilters`.

---

### Prompt 7.3 — Status Workflow

```
Allowed workflow:
Open → In Progress → Resolved → Closed
Open → Cancelled
In Progress → Cancelled

Display current status. Allow updates via PATCH /tickets/:id/status.
Show backend errors for invalid transitions.
Success notifications. Disable while in progress.
Do not implement transition rules on frontend (display only).
```

> **Result:** `TicketStatusControl.jsx`, `StatusTimeline`, backend error display.

---

### Prompt 7.4 — Automatic Data Synchronization

```
Use RTK Query providesTags / invalidatesTags.
Refresh after: create, update, change status, add comment, delete ticket.
Refresh: Dashboard, Ticket List, Ticket Details, Comments.
Do not manually update Redux with server data.
```

> **Result:** `ticketTags.js`, `commentTags.js`, mutation invalidation tags.

---

## Phase 8 — Delete Ticket

### Prompt 8.1 — Delete Ticket API & UI

```
Add DELETE /api/tickets/:id
Delete associated comments when ticket is deleted.
Delete button on ticket list (row actions) and ticket details page.
Confirmation dialog before delete.
Success notification. Navigate to list from details after delete.
RTK Query cache invalidation (list, detail, dashboard, comments).
```

> **Result:**
> - Backend: `TicketDeletionService`, `DELETE /tickets/:id`
> - Frontend: `useDeleteTicketMutation`, delete icons/buttons, `DeleteConfirmationDialog`

---

## Phase 9 — UI/UX Polish & Layout Refinements

Prompts from the July 2026 UI polish session (auth, layout, forms, dashboard, notifications).

### Prompt 9.1 — User Dropdowns & Seeded Users

```
Remove email from user picker display (names only).
Seed 10 users for development (default password Password123!).
```

> **Result:** `UserSelectField.jsx`, `TicketUserSelect.jsx`, `seed-users.data.ts`, `user-seed.ts`

---

### Prompt 9.2 — Create Ticket Form Layout

```
Move title/description inside white app-panel.
Reset icon in top-right of panel (not text button).
Make Priority, Created By, and Assigned User mandatory with validation.
Priority default should be empty with placeholder (not medium).
```

> **Result:** `TicketForm.jsx`, `CreateTicketPage.jsx`, `FormActions.jsx`, `ticketForm.schema.js`, backend `createTicketBodySchema`

---

### Prompt 9.3 — API Error Toasts with Status Codes

```
Global listener should show [404], [500], [Network], etc. in toast messages.
```

> **Result:** `apiError.js` (`getApiErrorNotificationMessage`), `apiListener.js`, `TicketsPage.jsx`, `TicketDetailsPage.jsx`

---

### Prompt 9.4 — Header, Search & Profile UI

```
Frosted glass header with search (Ctrl+K), notifications, profile button.
Remove role/“Employee” from profile area.
Move branding (logo + title) from sidebar to full-width header.
Breadcrumbs moved out of header into page content (top-left above page body).
```

> **Result:** `AppHeader.jsx`, `CommandPaletteTrigger.jsx`, `NotificationsMenu.jsx`, `AppBreadcrumbs.jsx`, `MainLayout.jsx`, `AppLogo.jsx`, `layout.constants.js`

---

### Prompt 9.5 — JWT Authentication (Frontend)

```
Wire login/register with Bearer token.
POST /api/auth/login, POST /api/auth/register, GET /api/auth/me.
Protect ticket and user routes on backend; frontend uses token in baseQuery.
After register → redirect to login (no auto sign-in).
Password validation: min 8 chars, uppercase, lowercase, number 1–9, special @ $ !
```

> **Result:** `authApi.js`, `baseQuery.js`, `RegisterPage.jsx`, `authForm.schema.js`, `password.schema.js`

---

### Prompt 9.6 — Table Status & Priority Styling

```
Colorful text only in tables (not chips/buttons).
Remove colored dots from table rows.
Chips remain on ticket details and elsewhere where appropriate.
```

> **Result:** `TicketTableStatusLabel.jsx`, `TicketTablePriorityLabel.jsx`, `TicketTableRow.jsx`, `statusColors.js`

---

### Prompt 9.7 — Ticket URLs Use Sequential Numbers

```
Ticket URLs should use sequential IDs (1, 2, 3…) not MongoDB ObjectIds.
Example: /tickets/1 instead of /tickets/6a59f70bcb24890edc200810
```

> **Result:**
> - Backend: `ticketNumber` param schema, `findByTicketNumber`, services/controllers updated
> - Frontend: `getTicketRouteId()`, navigation and API calls use `ticketNumber`

---

### Prompt 9.8 — Sidebar Styling & Layout

```
Style sidebar like dashboard panels.
Remove “Navigation” section label from sidebar.
Sidebar should align beside dashboard content (not separate full-height drawer column).
No double white background beside nav panel.
Sidebar height should start where page title starts (Dashboard, Tickets, Create Ticket)
and end where page content ends (match content height, not forced viewport height).
```

> **Result:** `AppSidebar.jsx`, `MainLayout.jsx` (grid layout, sidebar in content row), `utilities.css`

---

### Prompt 9.9 — Ticket Details Status & Priority Labels

```
Status and priority on ticket details should be colored text, not chip/button format.
Show as “Status: In Progress” and “Priority: Medium” with label prefix.
Status workflow timeline should also use colored text (not chips).
```

> **Result:** `TicketDetailsInfo.jsx`, `TicketStatusControl.jsx`, `StatusTimeline.jsx`, `TicketTableStatusLabel.jsx`, `TicketTablePriorityLabel.jsx`

---

### Prompt 9.10 — Page Layout: Headers Outside Panels

```
Create Ticket: title, description, and reset button should be outside the white form panel.
Dashboard: “Dashboard” title, description, and action buttons (Create Ticket, View Open Tickets)
should be outside panels. Stat cards should be inside a white app-panel box.
```

> **Result:** `TicketForm.jsx`, `DashboardSummary.jsx`

---

### Prompt 9.11 — Spacing & Header Alignment

```
Remove padding-block from page-shell.
Remove padding-block from section-spacing.
Header should align horizontally with main content container (maxWidth xl, matching px).
```

> **Result:** `utilities.css`, `PageContainer.jsx`, `AppHeader.jsx` (Container maxWidth="xl")

---

### Prompt 9.12 — Toast Auto-Dismiss & Animation

```
Toast messages should auto-remove after 10 seconds.
Use animation for enter and exit.
```

> **Result:** `NotificationProvider.jsx` (`TOAST_AUTO_HIDE_MS = 10000`), `toast-pop` / `toast-out` in `utilities.css`

---

### Prompt 9.13 — Dashboard Improvement Ideas (Advisory)

```
What can I improve in dashboard?
```

> **Suggested (not all implemented):** backend trend aggregation, On Hold in stats, skeleton loading, refresh button, clickable charts, “assigned to me” section, priority breakdown, combined dashboard API payload.

---

## Troubleshooting & Q&A Prompts

| # | Prompt | Purpose |
|---|--------|---------|
| Q1 | `there is node_modules outside Frontend and backend is it required` | Monorepo vs per-package `node_modules` |
| Q2 | `fromt end ka te md fileprompt crea` | Create frontend prompts archive |
| Q3 | Phase 3 — Redux & API Integration structure | Reorganize prompts 3.1–3.5 |
| Q4 | `Failed to resolve import CheckCircleOutline` | MUI icon naming (`CheckCircleOutlined`) |
| Q5 | `when I am selecting Create Ticket then Ticket should not be select` | Sidebar active state for `/tickets/new` |
| Q6 | `optimize front end filter UI` | Filter toolbar layout and chips |
| Q7 | `Search tickets field is not working` | Debounced search + MUI search button fix |
| Q8 | `Failed to resolve import FormErrorAlert` | Fix relative import path in `CommentForm.jsx` |
| Q9 | `there should also be delete api and delete button` | Phase 8 delete ticket |
| Q10 | `update the md file list all the prompt` | This document update |
| Q11 | `can we style side bar and improve styling` | Phase 9.8 sidebar styling |
| Q12 | `id should be 1,2,3,...` | Phase 9.7 sequential ticket URLs |
| Q13 | `status should not be in button format just color is ok` | Phase 9.9 status/priority text |
| Q14 | `Status: In Progress` and `Priority: Medium` label format | Phase 9.9 ticket details header |
| Q15 | `remove Navigation from side nav` | Phase 9.8 sidebar label removed |
| Q16 | `side nav styled like dashboard` / alignment fixes | Phase 9.8–9.11 layout |
| Q17 | `stat cards in white box` | Phase 9.10 dashboard panel |
| Q18 | `header should align according to content` | Phase 9.11 AppHeader Container |
| Q19 | `toaster remove after 10 sec use animation` | Phase 9.12 notifications |
| Q20 | `consolidate all the prompt of FE in md file` | Phase 9 + this document update |

---

## Prompt-to-Artifact Map

| Phase | Prompt | Key Output | Status |
|-------|--------|------------|--------|
| 1 | 1.1 Initialize Frontend | `frontend/package.json`, Vite, ESLint, Prettier | Done |
| 1 | 1.2 Tailwind & MUI | `frontend/src/theme/` | Done |
| 1 | 1.3 Folder Structure | `frontend/src/` feature tree | Done |
| 1 | 1.4 Routing | `routes/`, `pages/`, route constants | Done |
| 2 | 2.1 Theme & Global Styles | `styles/`, design tokens | Done |
| 2 | 2.2 Main Layout | `layouts/`, common UI states | Done |
| 3 | 3.1 Redux Store | `store/`, UI slices | Done |
| 3 | 3.2 RTK Query & Axios | `api/baseApi.js`, `lib/axios.js` | Done |
| 3 | 3.3 Ticket APIs | `features/tickets/api/ticketsApi.js` | Done |
| 3 | 3.4 Comment APIs | `features/comments/api/commentsApi.js` | Done |
| 3 | 3.5 Error & Cache | `utils/apiError.js`, `apiListener.js` | Done |
| 4 | 4.1 Dashboard Page | `pages/DashboardPage.jsx` | Done |
| 4 | 4.2 Tickets List | `pages/TicketsPage.jsx` | Done |
| 4 | 4.3 Create Ticket | `pages/CreateTicketPage.jsx` | Done |
| 4 | 4.4 Edit Ticket | `pages/EditTicketPage.jsx` | Done |
| 4 | 4.5 Ticket Details | `pages/TicketDetailsPage.jsx` | Done |
| 5 | 5.1 Dashboard Components | `components/business/dashboard/` | Done |
| 5 | 5.2 Ticket List Components | `components/business/tickets/list/` | Done |
| 5 | 5.3 Ticket Form Components | `components/business/tickets/form/` | Done |
| 5 | 5.4 Status Components | `components/business/tickets/status/` | Done |
| 5 | 5.5 Comment Components | `components/business/comments/` | Done |
| 5 | 5.6 Shared Components | `components/business/shared/` | Done |
| 6 | 6.1 Create Form Validation | `utils/validation/`, `CreateTicketForm` | Done |
| 6 | 6.2 Edit Form Validation | `EditTicketForm` | Done |
| 6 | 6.3 Comment Validation | `TicketCommentsSection` | Done |
| 6 | 6.4 Validation Utilities | `handleFormApiError`, `useValidatedForm` | Done |
| 7 | 7.1 Keyword Search | `useTicketListSearch`, URL sync | Done |
| 7 | 7.2 Status Filter | Combined search + status | Done |
| 7 | 7.3 Status Workflow | `TicketStatusControl`, timeline | Done |
| 7 | 7.4 Auto Sync | RTK tag invalidation | Done |
| 8 | 8.1 Delete Ticket | `DELETE /tickets/:id`, delete UI | Done |
| 9 | 9.1 User Dropdowns | User pickers, seed data | Done |
| 9 | 9.2 Create Ticket Layout | Mandatory fields, panel layout | Done |
| 9 | 9.3 API Error Toasts | Status-prefixed toast messages | Done |
| 9 | 9.4 Header & Breadcrumbs | Frosted header, logo, breadcrumbs | Done |
| 9 | 9.5 JWT Auth (FE) | Login, register, token, password rules | Done |
| 9 | 9.6 Table Label Styling | Colored text in tables | Done |
| 9 | 9.7 Sequential Ticket URLs | `/tickets/1`, `getTicketRouteId` | Done |
| 9 | 9.8 Sidebar Layout | Grid sidebar, content-height panel | Done |
| 9 | 9.9 Status/Priority Text | Labels on details & timeline | Done |
| 9 | 9.10 Headers Outside Panels | Create Ticket & Dashboard headers | Done |
| 9 | 9.11 Spacing & Header Align | page-shell, section-spacing, Container | Done |
| 9 | 9.12 Toast Animation | 10s auto-hide, enter/exit animation | Done |

---

## How to Rebuild the Frontend

1. Ensure the backend is running and [`API_CONTRACT.md`](./API_CONTRACT.md) exists.
2. Run prompts **in order** from Phase 1 through Phase 8.
3. Copy `frontend/.env.example` to `frontend/.env` — set `VITE_API_BASE_URL=http://localhost:3000`.
4. After Phase 3, verify RTK Query hooks against live backend.
5. Run `npm run lint` and `npm run build` from `frontend/` after major phases.
6. Seed backend users: `cd backend && npm run seed`.
7. Test at `http://localhost:5173` with `npm run dev`.

---

## Related Documents

| Document | Purpose |
| -------- | ------- |
| [`PROMPTS.md`](./PROMPTS.md) | Backend build prompts archive |
| [`API_CONTRACT.md`](./API_CONTRACT.md) | REST API contract |
| [`frontend/README.md`](../frontend/README.md) | Frontend setup and structure |

---

*Last updated: July 18, 2026*
