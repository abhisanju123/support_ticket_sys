# Support Ticket System

Monorepo for the Support Ticket Management System — internal employees create, assign, track, and resolve support tickets.

| Package | Path | Description |
| ------- | ---- | ----------- |
| **Backend** | [`backend/`](backend/) | Node.js + TypeScript REST API |
| **Frontend** | [`frontend/`](frontend/) | React + Vite client |

> **Backend build prompts:** [`docs/PROMPTS.md`](docs/PROMPTS.md)  
> **Frontend build prompts:** [`docs/FRONTEND_PROMPTS.md`](docs/FRONTEND_PROMPTS.md)  
> **API contract (backend ↔ frontend):** [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md)

## Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- npm
- MongoDB (local or Atlas)

## Quick Start

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

API runs at `http://localhost:3000` by default.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

App runs at `http://localhost:5173` by default.

## Repository Structure

```
.
├── backend/          # Express API, MongoDB, business logic
├── frontend/         # React UI
├── docs/             # Design docs, API contract, build prompts
└── README.md
```

## Documentation

| Document | Description |
| -------- | ----------- |
| [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md) | Fixed REST API contract for frontend integration |
| [`docs/FRONTEND_PROMPTS.md`](docs/FRONTEND_PROMPTS.md) | All AI prompts used to build the frontend (Phases 1–8) |
| [`docs/PROMPTS.md`](docs/PROMPTS.md) | All AI prompts used to build the backend |
| [`docs/DATABASE_DESIGN.md`](docs/DATABASE_DESIGN.md) | Database entities, relationships, and indexes |
| [`docs/REPOSITORY_LAYER_DESIGN.md`](docs/REPOSITORY_LAYER_DESIGN.md) | Repository layer architecture |
| [`docs/SERVICE_LAYER_DESIGN.md`](docs/SERVICE_LAYER_DESIGN.md) | Service layer architecture |
| [`docs/submission/`](docs/submission/) | Assessment submission pack (requirements, design, tests, reflection, PR description) |
