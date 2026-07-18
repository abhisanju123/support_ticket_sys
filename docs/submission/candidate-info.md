# Candidate Information

| Field | Value |
| ----- | ----- |
| **Name** | Abhishek Mishra |
| **Role** | Full-Stack Developer (Assessment Candidate) |
| **Primary Technology Stack** | React 19, Vite, Redux Toolkit / RTK Query, Material UI, Tailwind CSS, Node.js 20, Express 5, TypeScript, MongoDB (Mongoose), Zod, Jest |
| **Primary AI Tool Used** | Cursor (AI-assisted IDE) |
| **Project Option Selected** | Support Ticket Management System |
| **Assessment Start Date** | July 2026 |
| **Submission Date** | July 18, 2026 |

---

## Project Summary

Built a full-stack **Support Ticket Management System** for internal employees to create, assign, track, update, and resolve support tickets. The solution includes:

- **Backend REST API** with layered architecture (routes → controllers → services → repositories → MongoDB)
- **React SPA** with dashboard, ticket list (search/filter/sort/pagination), create/edit/details flows, comments, and JWT authentication
- **Fixed API contract** between frontend and backend
- **Sequential ticket numbers** in URLs (`/tickets/1`, `/tickets/2`, …)
- **Status workflow** with validated transitions and closed-ticket edit restrictions
- **Form validation** (Zod + React Hook Form) on both client and server

Monorepo layout: `backend/`, `frontend/`, `docs/`.

---

## Tools Used

| Category | Tools |
| -------- | ----- |
| IDE / AI | Cursor |
| Runtime | Node.js 20+, npm |
| Backend | Express, TypeScript, Mongoose, Zod, bcryptjs, jsonwebtoken, Jest, Supertest |
| Frontend | React 19, Vite 8, MUI 9, Redux Toolkit, RTK Query, React Router 7, React Hook Form, Zod, Tailwind CSS 4 |
| Database | MongoDB (local or MongoDB Atlas) |
| Quality | ESLint, Prettier, Husky, lint-staged |
| Version control | Git |

---

## Setup Summary

### Prerequisites

- Node.js 20+
- npm
- MongoDB (local `mongodb://localhost:27017` or Atlas `mongodb+srv://…`)

### Backend

```bash
cd backend
npm install
cp .env.example .env   # set MONGODB_URI, JWT_SECRET, etc.
npm run dev              # http://localhost:3000
npm run seed             # optional: sample users (Password123!)
npm test                 # unit tests
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env     # VITE_API_BASE_URL=http://localhost:3000
npm run dev              # http://localhost:5173
```

### Default dev login (after seed)

- Email: `john@example.com`
- Password: `Password123!`

### Key environment variables

| Package | Variable | Purpose |
| ------- | -------- | ------- |
| Backend | `MONGODB_URI` | MongoDB connection string |
| Backend | `JWT_SECRET` | JWT signing (min 32 chars) |
| Backend | `JWT_EXPIRES_IN` | Token TTL (default `30m`) |
| Frontend | `VITE_API_BASE_URL` | Backend API base URL |
