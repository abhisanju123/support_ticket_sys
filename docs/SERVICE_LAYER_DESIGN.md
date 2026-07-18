# Service Layer Design

## 1. Purpose

The Service Layer is the **single place for business decisions** in the Support Ticket Management System.

```
Controller → Service → Repository → Mongoose Model → MongoDB
```

| Layer | Owns |
|---|---|
| **Controller** | HTTP parsing, status codes, `ApiResponse` formatting |
| **Service** | Business rules, workflows, exception throwing |
| **Repository** | Database queries only |

Controllers and repositories must **never** contain business logic.

---

## 2. Folder Structure

```
src/services/
├── base/
│   ├── base.service.ts              # Shared service extension point
│   └── index.ts
├── types/
│   ├── ticket.service.types.ts      # Service-layer DTOs (inputs/queries)
│   └── index.ts
├── ticket/
│   ├── ticket-creation.service.ts   # Create ticket workflow
│   ├── ticket-retrieval.service.ts  # Get by ID, list all
│   ├── ticket-update.service.ts   # Update editable fields
│   └── index.ts
└── index.ts
```

Future modules (comments, status transitions) add folders under `services/` following the same pattern.

---

## 3. Naming Conventions

| Artifact | Pattern | Example |
|---|---|---|
| Service class | `{Domain}{Action}Service` or `{Domain}{Concern}Service` | `TicketCreationService` |
| Service file | `{domain}-{action}.service.ts` | `ticket-creation.service.ts` |
| Input DTO | `{Action}{Entity}Input` | `CreateTicketInput` |
| Query DTO | `{Entity}ListQuery` | `TicketListQuery` |
| Method names | Verb-first, domain context | `createTicket`, `getTicketById` |

---

## 4. Base Service Guidelines

`BaseService` is an abstract class all services may extend.

### Rules

1. **Constructor injection** — receive repository interfaces, never concrete Mongoose models.
2. **No Express imports** — services are framework-agnostic.
3. **Throw `AppException` subclasses** — `NotFoundException`, `ValidationException`, `BadRequestException`.
4. **Return domain types** — `ITicketRecord`, `ITicketPopulated`, not HTTP responses.
5. **One workflow per service class** — keeps classes focused (Single Responsibility).

---

## 5. Service Responsibilities

| Service | Responsibility |
|---|---|
| **TicketCreationService** | Validate create input, verify creator exists, apply defaults (`status = OPEN`), persist ticket |
| **TicketRetrievalService** | Fetch ticket by ID or list all with populated creator/assignee; throw if not found |
| **TicketUpdateService** | Update editable fields only (`title`, `description`, `priority`, `assignedTo`); verify ticket and assignee exist |
| **CommentService** *(future)* | Add comments, validate ticket exists, list thread |
| **TicketStatusService** *(future)* | Enforce status transition rules |

---

## 6. How Services Consume Repositories

```typescript
class TicketCreationService extends BaseService {
  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly userRepository: IUserRepository,
  ) {
    super();
  }
}
```

- Services depend on **`I*Repository` interfaces** for testability.
- Concrete repositories are wired at the composition root (future: `src/container.ts` or route factories).
- Unit tests mock repositories; integration tests use real DB.

---

## 7. Exception Strategy

| Scenario | Exception |
|---|---|
| Missing required field | `ValidationException` |
| Invalid enum value | `ValidationException` |
| Entity not found | `NotFoundException` |
| Invalid reference (user/ticket) | `NotFoundException` |

Controllers map these to HTTP responses via the global error handler.

---

## 8. Testing Strategy

| Level | Approach |
|---|---|
| **Unit** | Mock `ITicketRepository`, `IUserRepository`; test business rules |
| **Integration** | Real repositories against test database |

---

## 9. Out of Scope (Future Prompts)

- Controllers and routes
- Comment services
- Status transition service
- Authentication / authorization
- Dependency injection container
