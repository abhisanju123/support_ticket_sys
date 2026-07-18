# Support Ticket System — Project Build Prompts

This document archives every prompt used to build the **Support Ticket Management System** backend. Prompts are listed in the order they were given during development (July 8–9, 2026).

> **Frontend prompts:** See [`FRONTEND_PROMPTS.md`](./FRONTEND_PROMPTS.md) for the React client build archive.

Use this file to reproduce the project step-by-step in Cursor or another AI coding assistant.

---

## Table of Contents

1. [Phase 1 — Project Setup & Infrastructure](#phase-1--project-setup--infrastructure)
2. [Phase 2 — Database Design & Models](#phase-2--database-design--models)
3. [Phase 3 — Repository Layer](#phase-3--repository-layer)
4. [Phase 4 — Service Layer](#phase-4--service-layer)
5. [Phase 5 — Controllers, Routes & Validation](#phase-5--controllers-routes--validation)
6. [Phase 6 — API Contract (Backend ↔ Frontend)](#phase-6--api-contract-backend--frontend)
7. [Troubleshooting & Q&A Prompts](#troubleshooting--qa-prompts)

---

## Phase 1 — Project Setup & Infrastructure

### Prompt 1.1 — Initialize Backend Project

```
Initialize Backend Project

Initialize Node.js project
Configure TypeScript
Install required dependencies
Configure tsconfig.json
Configure ESLint
Configure Prettier
Configure Husky
Configure lint-staged
Add useful npm scripts
Create README
Create .gitignore
Create .env.example

Do NOT create

Express app
Database
Routes
Models
APIs
```

### Prompt 1.2 — Use JavaScript for Config Files

```
use java script Initialize Backend Project

Initialize Node.js project
Configure TypeScript
Install required dependencies
Configure tsconfig.json
Configure ESLint
Configure Prettier
Configure Husky
Configure lint-staged
Add useful npm scripts
Create README
Create .gitignore
Create .env.example

Do NOT create

Express app
Database
Routes
Models
APIs
```

> **Result:** TypeScript source with JavaScript config files (`eslint.config.js`, `prettier.config.js`).

---

### Prompt 1.3 — Create Project Architecture

```
Create Project Architecture

Business Requirement

The Support Ticket Management System should follow a scalable enterprise architecture so future modules like Tickets, Comments, Authentication, and Notifications can be added easily.

Task

Create only the folder structure.

Example:

src/
 config/
 database/
 controllers/
 services/
 repositories/
 routes/
 middlewares/
 validators/
 models/
 schemas/
 utils/
 helpers/
 constants/
 enums/
 interfaces/
 types/
 exceptions/
 tests/

Create empty placeholder files where necessary.

Do NOT implement any logic.
```

---

### Prompt 1.4 — Configure Express Application

```
Configure Express Application

Business Requirement

The backend should expose REST APIs that will later be consumed by the frontend.

Task

Create:

app.ts
server.ts

Configure:

Express
Helmet
CORS
Morgan
Compression
JSON Parser
URL Encoded Parser

Create only one endpoint:
```

> **Note:** The original prompt was cut off at "Create only one endpoint:". A `GET /health` health-check endpoint was implemented.

---

### Prompt 1.5 — Environment & Database Configuration

```
Environment & Database Configuration

Business Requirement

The application must securely connect to MongoDB using environment variables and support production deployment.

Task

Create:

dotenv configuration
Environment validation
MongoDB connection utility
Graceful shutdown
Database connection logging
Connection retry strategy

Do NOT create schemas or collections.
```

---

### Prompt 1.6 — Global Error Handling & Common Utilities

```
Global Error Handling & Common Utilities

Business Requirement

Every API in the Support Ticket Management System should return consistent responses and handle failures gracefully.

Task

Create:

Global Error Handler
Not Found Middleware
API Response Helper
Async Handler
Logger Utility
Common Constants
Custom Exception Classes

Use a standard response format:
```

> **Note:** The original prompt was cut off. A standard envelope was implemented:
>
> **Success:** `{ success, message, data }`
>
> **Error:** `{ success, message, error: { code, details } }`

---

### Prompt 1.7 — Testing Configuration

```
Testing Configuration

Business Requirement

The project should be test-ready from the beginning so that business rules can be verified as features are implemented.

Task

Configure:

Jest
ts-jest
Supertest

Create test folder structure.

Do not write any tests yet.
```

---

## Phase 2 — Database Design & Models

### Prompt 2.1 — Business Domain & Database Design

```
Business Domain & Database Design
Business Requirement
You are continuing the existing backend project.

## Business Requirement

We are building a Support Ticket Management System for internal employees.

The system allows employees to create, assign, update, track, and resolve support tickets.

Each support ticket belongs to one creator and may be assigned to another internal user.

Every ticket can have multiple comments that maintain the discussion history.

Before implementing any APIs, the application's database must correctly represent the business domain and its relationships.

This prompt is ONLY for designing the database structure.

Do NOT create Mongoose models yet.
```

**Follow-up task (same session):**

```
Task
Identify all entities
Define relationships
Define cardinality (One-to-One, One-to-Many)
Decide which fields should be required
Identify enums
Decide indexes
Define timestamps
Explain why each design choice is made

Deliver a complete database design document only.
```

> **Deliverable:** [`DATABASE_DESIGN.md`](./DATABASE_DESIGN.md)

---

### Prompt 2.2 — Create Shared Enums & Constants

```
Prompt 2.2 — Create Shared Enums & Constants
Business Requirement
The Support Ticket Management System should use centralized enums instead of hardcoded string values to maintain consistency across the application.
Task

Create reusable enums for:

Ticket Status
Ticket Priority
User Role

Example:

OPEN
IN_PROGRESS
RESOLVED
CLOSED
CANCELLED
```

---

### Prompt 2.3 — Create User Model

```
Create User Model
Business Requirement
The application has internal users.

Users are already available in the database.

There is NO user management feature.

Users only participate as:

• Ticket Creator
• Ticket Assignee
• Comment Creator
Entity
User

id
name
email
role
```

**Follow-up task:**

```
Task

Create

User Schema
Validation
Indexes
Timestamps if required

Business Rules

Email must be unique.
Name is required.
Role is required.
No password field.
No authentication logic.

Do not create APIs. is this task completed
```

---

### Prompt 2.4 — Create Ticket Model

```
Create Ticket Model
Business Requirement
A Ticket represents a customer support issue.

Every ticket is created by one internal employee.

A ticket may be assigned to another employee.

Each ticket follows a predefined lifecycle managed by business rules implemented later.
Entity
Ticket

id
title
description
priority
status
assignedTo
createdBy
createdAt
updatedAt
Task

Create Ticket schema.

Business Rules

title required
description required
priority required
status default = OPEN
assignedTo optional
createdBy required
timestamps enabled

Use ObjectId references.

No APIs.
```

---

### Prompt 2.5 — Create Comment Model

```
Create Comment Model
Business Requirement
Every support ticket should maintain a discussion history.

Employees can add comments to a ticket to provide updates or communicate with teammates.
Entity
Comment

id
ticketId
message
createdBy
createdAt
Task

Create Comment Schema.

Business Rules

Ticket reference required
Message required
Creator required
Timestamp enabled

No API implementation.
```

---

### Prompt 2.6 — Relationships & Database Optimization

```
Relationships & Database Optimization
Business Requirement
The application should efficiently retrieve tickets, comments, and users while supporting future search and filtering features.
Task

Define relationships.

User → creates → Ticket
Ticket → assignedTo → User
Ticket → has many → Comments
Comment → belongs to → Ticket
Comment → createdBy → User

Create appropriate indexes.

Examples

email
status
priority
assignedTo
createdBy
createdAt

Explain why each index exists.

Do not implement APIs.
```

> **Deliverable:** [`DATABASE_RELATIONSHIPS_AND_INDEXES.md`](./DATABASE_RELATIONSHIPS_AND_INDEXES.md)

---

### Prompt 2.7 — Seed Initial Users

```
Seed Initial Users
Business Requirement
The application does not include User Management.

Internal employees already exist.

To support ticket assignment and ticket creation during development, predefined users should be inserted into the database.
Task

Create

seed.ts

Insert sample users.

Example

John Doe — john@example.com — Support Agent
Jane Smith — jane@example.com — Support Manager
Alex Johnson — alex@example.com — Support Agent

Seed should

Avoid duplicate users
Be re-runnable
Use environment variables
Log success/failure

No authentication.
```

---

## Phase 3 — Repository Layer

### Prompt 3.1 — Design Repository Layer

```
Design Repository Layer
You are continuing the existing backend project.

## Business Requirement

The Support Ticket Management System follows Clean Architecture.

The Repository Layer is responsible only for interacting with the database.

It should isolate all MongoDB/Mongoose operations from the business logic so that Services never directly access Mongoose models.

Repositories should be reusable, testable, and easy to extend.

This prompt focuses only on designing the Repository Layer.

Do NOT implement any business logic or APIs.

## Objectives

Design the repository architecture that will be used throughout the project.

The Repository Layer should:

- Encapsulate all database operations.
- Keep Services independent of Mongoose.
- Promote code reuse.
- Follow the Single Responsibility Principle.
```

> **Deliverable:** [`REPOSITORY_LAYER_DESIGN.md`](./REPOSITORY_LAYER_DESIGN.md)

---

### Prompt 3.2 — Create Base Repository

```
Create Base Repository
You are continuing the existing backend project.

## Business Requirement

Multiple entities such as Tickets, Users, and Comments require common database operations.

To avoid duplicate code, create a reusable Base Repository.

All feature repositories should inherit or reuse this base implementation.

## Objective

Create a generic Base Repository using TypeScript Generics.

## Responsibilities

Implement reusable methods such as:

- create()
- findById()
- findOne()
- findAll()
- updateById()
- deleteById()
- exists()
- count()

The implementation should:

- Work with any Mongoose model.
- Support future pagination and filtering.
- Return typed responses.
- Handle common database errors gracefully.

## Rules

- No business validation.
- No state transition logic.
- No HTTP handling.
- Only database operations.
```

---

### Prompt 3.3 — Create User Repository

```
Create User Repository
You are continuing the existing backend project.

## Business Requirement

Users are pre-seeded into the system.

They are used for:

- Ticket creator
- Ticket assignee
- Comment creator

There is no User Management module.

## Objective

Create the User Repository.

## Responsibilities

Provide database methods for:

- Find user by ID.
- Find user by email.
- List all users.
- Check whether a user exists.

Reuse the Base Repository wherever possible.

## Rules

- No business logic.
- No authentication.
- No role validation.
- No HTTP handling.
- Only database queries.
```

---

### Prompt 3.4 — Create Ticket Repository

```
Create Ticket Repository
You are continuing the existing backend project.

## Business Requirement

Support tickets are the primary business entity.

The Repository Layer should provide all database operations required by future business services.

## Objective

Create the Ticket Repository.

## Responsibilities

Provide methods for:

- Create ticket.
- Find ticket by ID.
- Update ticket.
- Delete ticket.
- List tickets.
- Search tickets by keyword.
- Filter tickets by status.
- Count tickets.
- Populate creator and assignee information where required.

Design repository methods so that future pagination and sorting can be added without changing service code.

Reuse the Base Repository wherever possible.

## Rules

Do NOT implement:

- Validation
- Status transition rules
- Search business logic
- HTTP responses

Only perform database operations.
```

---

### Prompt 3.5 — Create Comment Repository

```
Create Comment Repository
You are continuing the existing backend project.

## Business Requirement

Each support ticket can contain multiple comments.

Comments maintain the history of communication related to a ticket.

The Repository Layer should provide efficient access to comment data.

## Objective

Create the Comment Repository.

## Responsibilities

Provide methods for:

- Create comment.
- Find comment by ID.
- List comments for a ticket.
- Delete comment if required in the future.
- Count comments for a ticket.

Support sorting comments by creation date.

Reuse the Base Repository wherever possible.

## Rules

Do NOT implement:

- Comment validation.
- Ticket existence validation.
- Business rules.
- HTTP responses.

Only perform database operations.
```

---

## Phase 4 — Service Layer

### Prompt 4.1 — Design Service Layer (+ Ticket Services)

```
Design Service Layer
You are continuing the existing backend project.

## Business Requirement

We are building a Support Ticket Management System.

The Service Layer is responsible for implementing all business rules and application workflows.

Controllers should never contain business logic.

Repositories should never contain business logic.

The Service Layer must become the single place where business decisions are implemented.

## Objective

Design the Service Layer architecture.

The Service Layer should:

- Consume repositories
- Implement business rules
- Validate business workflows
- Throw business exceptions
- Remain independent of Express
- Be easily testable

## Deliverables

Create:

- Service folder structure
- Service naming conventions
- Base service guidelines
- Explain service responsibilities
- Implement Ticket Creation, Retrieval, and Update services
```

> **Deliverable:** [`SERVICE_LAYER_DESIGN.md`](./SERVICE_LAYER_DESIGN.md)
>
> **Implemented services:**
> - `TicketCreationService` — validate input, verify creator, apply defaults, create ticket
> - `TicketRetrievalService` — get by ID, list all with populated users
> - `TicketUpdateService` — update editable fields only, verify entities exist

---

### Prompt 4.2 — Comment, Search/Filter, Status & Dashboard Services

This was submitted as a **combined multi-prompt message**:

```
Comment Service
You are continuing the existing backend project.

## Business Requirement

Employees should collaborate using comments.

Every comment belongs to one ticket.

A comment cannot exist without a ticket.

## Business Rules

Message is required.
Ticket must exist.
Comment creator must exist.
CreatedAt should be generated automatically.

## Objective

Implement

Create Comment
Get Comments by Ticket

Use repositories.

Do not implement controllers or routes.
```

```
Prompt 4.6 — Search & Filter Service
You are continuing the existing backend project.

## Business Requirement

Employees should quickly locate support tickets.

The application must support searching and filtering.

## Features

Keyword Search

Search should match

- Title
- Description

Case insensitive.

Status Filter

Filter tickets by status.

Support pagination and sorting.

Do not implement controllers or routes.
```

```
Prompt 4.7 — Ticket Status Service
You are continuing the existing backend project.

## Business Requirement

Tickets follow a predefined lifecycle.

Status changes must follow allowed transitions.

## Objective

Implement status transition logic.

Enforce allowed transitions:

OPEN → IN_PROGRESS, CANCELLED
IN_PROGRESS → RESOLVED, CANCELLED
RESOLVED → CLOSED

Reject invalid transitions.

Do not implement controllers or routes.
```

```
Prompt 4.8 — Dashboard Statistics Service
You are continuing the existing backend project.

## Business Requirement

Managers need a quick overview of ticket distribution.

## Objective

Implement dashboard statistics.

Return ticket counts grouped by status.

Use repositories.

Do not implement controllers or routes.
```

> **Implemented services:**
> - `CommentService`
> - `TicketSearchFilterService`
> - `TicketStatusService`
> - `DashboardStatisticsService`

---

## Phase 5 — Controllers, Routes & Validation

### Prompt 5.1 — Create Controllers

```
You are continuing the existing backend project.

## Business Requirement

The Support Ticket Management System is used by internal employees to manage support tickets throughout their lifecycle.

The business logic has already been implemented inside the Service Layer.

The Controller Layer should act only as the interface between HTTP requests and the Service Layer.

Controllers must never contain business logic or direct database operations.

They should only:

- Receive HTTP requests
- Validate request parameters (using validation middleware)
- Call the appropriate service
- Return standardized API responses
- Pass errors to the global error handler

## Objective

Create production-ready controllers for the following modules.

### Ticket Controller

Implement controller methods for:

- Create Ticket
- Get All Tickets
- Get Ticket by ID
- Update Ticket
- Change Ticket Status
- Search Tickets
- Filter Tickets by Status
- Get Dashboard Statistics

### Comment Controller

Implement controller methods for:

- Add Comment to Ticket
- Get Comments by Ticket

## Rules

- No business logic in controllers.
- No direct database access.
- Use asyncHandler.
- Use ApiResponse helper.
- Wire dependency injection via constructor.
```

---

### Prompt 5.2 — Routes + Validation Middleware

```
Routes + Validation Middleware

You are continuing the existing backend project.

## Business Requirement

The backend should expose REST APIs for the frontend while ensuring that invalid requests are rejected before reaching the business logic.

Every incoming request must be validated to maintain data integrity and provide meaningful error messages.

The routing structure should be clean, modular, and easy to extend.

## Objective

Create all application routes and request validation middleware.

### Ticket Routes

Create routes for:

POST   /tickets
GET    /tickets
GET    /tickets/:id
PUT    /tickets/:id
PATCH  /tickets/:id/status
GET    /tickets/dashboard

### Comment Routes

POST   /tickets/:ticketId/comments
GET    /tickets/:ticketId/comments

### Validation

Use Zod to validate:

- Request body
- Route parameters
- Query parameters

Create a reusable validate middleware.

Reject invalid requests before reaching controllers.

## Rules

- Mount routes in app.ts
- Use dependency injection container
- Do not add business logic to routes
```

---

## Phase 6 — API Contract (Backend ↔ Frontend)

### Prompt 6.1 — Define Fixed API Contract

```
This prompt becomes the agreement between the backend and frontend.

It should instruct the AI to:

Define every REST endpoint.
Define request payloads.
Define response payloads.
Define query parameters.
Define HTTP status codes.
Define error response format.
Keep the API contract fixed for the frontend.
```

> **Deliverable:** [`API_CONTRACT.md`](./API_CONTRACT.md)

---

## Troubleshooting & Q&A Prompts

These prompts were used during development to debug or clarify setup:

| # | Prompt | Purpose |
|---|--------|---------|
| Q1 | `run the node server.ts` | Run the development server |
| Q2 | `why there is error while npm run dev` | Debug dev server startup error |
| Q3 | `userSchema it is giving error userSchema` | Fix User schema compilation error |
| Q4 | `is connection with mongoose done` | Verify MongoDB connection setup |
| Q5 | `if I want to connect with real data ase atlas so what should I do` | Connect to MongoDB Atlas |

---

## Prompt-to-Artifact Map

| Phase | Prompt | Key Output |
|-------|--------|------------|
| 1 | Initialize Backend | `backend/package.json`, `tsconfig.json`, ESLint, Prettier, Husky |
| 1 | Project Architecture | `backend/src/` folder structure |
| 1 | Express Application | `backend/src/app.ts`, `backend/src/server.ts`, `GET /health` |
| 1 | Environment & DB | `backend/src/config/env.ts`, `backend/src/database/connection.ts` |
| 1 | Error Handling | Middlewares, helpers, exceptions, logger |
| 1 | Testing Config | `backend/jest.config.js`, `backend/src/tests/` structure |
| 2 | Database Design | `docs/DATABASE_DESIGN.md` |
| 2 | Enums | `backend/src/enums/` |
| 2 | Models | `backend/src/models/`, `backend/src/schemas/` |
| 2 | Indexes & Relationships | `docs/DATABASE_RELATIONSHIPS_AND_INDEXES.md` |
| 2 | Seed Users | `backend/src/database/seed.ts` |
| 3 | Repository Design | `docs/REPOSITORY_LAYER_DESIGN.md` |
| 3 | Repositories | `backend/src/repositories/` |
| 4 | Service Design | `docs/SERVICE_LAYER_DESIGN.md` |
| 4 | Services | `backend/src/services/` |
| 5 | Controllers | `backend/src/controllers/` |
| 5 | Routes & Validation | `backend/src/routes/`, `backend/src/middlewares/validate.middleware.ts`, `backend/src/schemas/request/` |
| 5 | DI Container | `backend/src/container.ts` |
| 6 | API Contract | `docs/API_CONTRACT.md` |

---

## How to Rebuild This Project

1. Start a new Node.js + TypeScript project in `backend/`.
2. Run prompts **in order** from Phase 1 through Phase 6.
3. After each phase, run `npm run typecheck` from `backend/`.
4. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI`.
5. Run `npm run seed` from `backend/` to insert sample users.
6. Run `npm run dev` from `backend/` and test `GET /health` and ticket/comment endpoints.

---

*Last updated: July 12, 2026*
