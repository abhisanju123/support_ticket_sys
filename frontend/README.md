# Support Ticket System — Frontend

React frontend scaffold for the Support Ticket Management System.

## Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- npm

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template:

   ```bash
   cp .env.example .env
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

The app runs at `http://localhost:5173` by default.

## Scripts

| Script                 | Description                      |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Start Vite dev server            |
| `npm run build`        | Production build                 |
| `npm run preview`      | Preview production build         |
| `npm run lint`         | Lint source files with ESLint    |
| `npm run lint:fix`     | Lint and auto-fix issues         |
| `npm run format`       | Format files with Prettier       |
| `npm run format:check` | Check formatting without writing |

## Stack

| Library                   | Purpose                        |
| ------------------------- | ------------------------------ |
| React 19                  | UI framework (JavaScript)      |
| Vite                      | Build tool and dev server      |
| Material UI               | Component library              |
| Tailwind CSS              | Utility-first styling          |
| React Router DOM          | Client-side routing            |
| Redux Toolkit + RTK Query | State management and API layer |
| Axios                     | HTTP client                    |
| React Hook Form           | Form state management          |
| Zod                       | Schema validation              |
| ESLint + Prettier         | Linting and formatting         |

## Project Structure

```
frontend/src/
├── api/                 # RTK Query API slices and endpoints
├── app/                 # App providers and bootstrap config
├── assets/              # Static images, icons, fonts
├── components/          # Shared UI components
│   ├── business/        # Reusable business components (dashboard, tickets, comments)
│   ├── common/          # Cross-feature reusable components
│   └── ui/              # Low-level UI primitives
├── constants/           # App-wide constants
├── features/            # Feature-based modules
│   ├── tickets/
│   ├── comments/
│   └── dashboard/
├── hooks/               # Shared React hooks
├── layouts/             # Application shell layouts
├── lib/                 # Current HTTP client (→ services/)
├── pages/               # Top-level route page components
├── routes/              # Route definitions and router
├── services/            # HTTP and integration services
├── store/               # Redux store and state
├── styles/              # Global CSS, reset, Tailwind, utilities
├── theme/               # Design tokens and MUI theme
├── utils/               # Shared utility functions
├── App.jsx
└── main.jsx
```

> Placeholder folders are ready for future prompts. HTTP client remains in `lib/` until migrated to `services/`.

## Design System

Material UI and Tailwind CSS share a single design system.

| Layer | Files |
| ----- | ----- |
| JS tokens + MUI theme | `src/theme/tokens.js`, `src/theme/muiTheme.js` |
| CSS custom properties | `src/styles/tokens.css` |
| CSS reset | `src/styles/reset.css` |
| Global typography & shell | `src/styles/global.css` |
| Tailwind integration | `src/styles/tailwind.css` |
| Utility classes | `src/styles/utilities.css` |

**Import order** (`src/index.css`): reset → global → tailwind → utilities

**Breakpoints** (MUI + Tailwind): `sm` 600px, `md` 900px, `lg` 1200px, `xl` 1536px

**Layout utilities:** `container-app`, `page-shell`, `section-spacing`, `card-spacing`, `stack-spacing`, `inline-spacing`

**Typography utilities:** `text-muted`, `text-heading`, `text-balance`

**Surface utilities:** `surface-card`, `border-default`, `shadow-elevated`, `flex-center`, `sr-only`

**Dark mode:** MUI `colorSchemes` + Tailwind `dark` variant. Use `useThemeMode()` from `src/hooks/`.

## Routes

| Path | Page |
| ---- | ---- |
| `/` | Redirects to `/dashboard` |
| `/dashboard` | Dashboard |
| `/tickets` | Tickets list |
| `/tickets/new` | Create ticket |
| `/tickets/:ticketId` | Ticket details |
| `/tickets/:ticketId/edit` | Edit ticket |
| `/404` | Not found |
| `*` | Not found (catch-all) |

Route constants live in `src/constants/routes.constants.js`.

## Build Prompts (Phases 1–8)

Full prompt archive: [`../docs/FRONTEND_PROMPTS.md`](../docs/FRONTEND_PROMPTS.md)

| Phase | Topics |
| ----- | ------ |
| 1 | Project setup, Tailwind, MUI, folder structure, routing |
| 2 | Theme, global styles, main layout |
| 3 | Redux, RTK Query, ticket/comment/user APIs, error handling |
| 4 | Dashboard, tickets list, create, edit, details pages |
| 5 | Reusable business components (dashboard, list, form, status, comments, shared) |
| 6 | Form validation (Zod + React Hook Form) |
| 7 | Keyword search, status filter, workflow, RTK cache sync |
| 8 | Delete ticket API and UI |

## API Contract

The frontend integrates with the backend using the fixed contract in [`../docs/API_CONTRACT.md`](../docs/API_CONTRACT.md).

Step-by-step build prompts are archived in [`../docs/FRONTEND_PROMPTS.md`](../docs/FRONTEND_PROMPTS.md).

Set `VITE_API_BASE_URL` in `.env` to point at the backend (default: `http://localhost:3000`).

## Notes

- Business pages and reusable components are implemented under `src/pages/` and `src/components/business/`.
- RTK Query manages server state; Redux UI slices hold filters and pagination only.
- Run backend seed (`npm run seed` in `backend/`) so user dropdowns populate.
