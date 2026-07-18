# Repository Layer Design

## 1. Purpose

The Repository Layer sits between **Services** (business logic) and **Mongoose Models** (database). It is the only layer allowed to import and query Mongoose models directly.

```
Controller → Service → Repository → Mongoose Model → MongoDB
```

| Layer | Responsibility |
|---|---|
| **Controller** | HTTP request/response handling |
| **Service** | Business rules, orchestration, validation of workflows |
| **Repository** | Data access — queries, inserts, updates, deletes |
| **Model** | Schema definition, indexes, Mongoose document shape |

Services must **never** import from `src/models/`. All database access flows through repositories.

---

## 2. Folder Structure

```
src/repositories/
├── base/
│   ├── base.repository.ts          # Abstract base with shared helpers
│   └── index.ts
├── interfaces/
│   ├── user.repository.interface.ts
│   ├── ticket.repository.interface.ts
│   ├── comment.repository.interface.ts
│   └── index.ts
├── user.repository.ts              # User persistence
├── ticket.repository.ts            # Ticket persistence
├── comment.repository.ts           # Comment persistence
└── index.ts                        # Barrel exports
```

### Why this structure

| Folder / file | Reason |
|---|---|
| `base/` | Shared logic (pagination helpers, ID conversion, error mapping) lives in one place |
| `interfaces/` | Services depend on contracts, not concrete classes — enables mocking in tests |
| `*.repository.ts` | One repository per aggregate root (User, Ticket, Comment) |

---

## 3. Naming Conventions

| Artifact | Convention | Example |
|---|---|---|
| Interface | `I{Entity}Repository` | `IUserRepository` |
| Implementation | `{Entity}Repository` | `UserRepository` |
| File (interface) | `{entity}.repository.interface.ts` | `user.repository.interface.ts` |
| File (implementation) | `{entity}.repository.ts` | `user.repository.ts` |
| Method names | Verb + entity/context | `findById`, `findByEmail`, `create`, `updateStatus` |
| Return types | Domain interfaces (`IUserRecord`), not Mongoose documents | `Promise<IUserRecord \| null>` |

### Rules

- Use **singular** entity names (`UserRepository`, not `UsersRepository`).
- Prefix interfaces with `I` to distinguish contracts from implementations.
- Repository methods return **plain domain types** (`IUserRecord`, `ITicketRecord`) or `null`, never `HydratedDocument` to callers outside the repository.

---

## 4. Responsibilities

### What repositories DO

- Execute Mongoose queries (`find`, `findOne`, `create`, `updateOne`, `deleteOne`, `aggregate`).
- Map Mongoose documents to domain interfaces before returning.
- Handle database-specific concerns (lean queries, population, projections, sorting, pagination cursors).
- Translate MongoDB duplicate key / validation errors into domain-friendly outcomes where appropriate.

### What repositories DO NOT

- Enforce business rules (status transitions, assignment permissions).
- Validate HTTP request payloads (that's Validators + Services).
- Format API responses (that's Controllers + `ApiResponse` helper).
- Call other services or controllers.
- Contain authentication or authorization logic.

---

## 5. Base Repository Guidelines

`BaseRepository` is an abstract class that feature repositories extend.

### Intended shared capabilities (to be implemented later)

| Capability | Purpose |
|---|---|
| `toDomain()` / `toDomainList()` | Map Mongoose documents → plain `I*Record` objects |
| `toObjectId()` | Safe string → `ObjectId` conversion with validation |
| `buildPagination()` | Standardize `skip` / `limit` / `sort` for list queries |
| `existsById()` | Lightweight existence check without loading full document |

### Design rules for `BaseRepository`

1. **Generic over record type** — `BaseRepository<TRecord>` where `TRecord` extends a domain interface.
2. **No entity-specific queries** — only cross-cutting data-access helpers.
3. **Protected methods** — shared helpers are `protected`, not public, so they are not exposed to services.
4. **No model reference in base** — each feature repository passes its own Mongoose model to the base or holds it as a `protected` property.

```typescript
// Conceptual — implementations deferred
abstract class BaseRepository<TRecord> {
  protected abstract readonly modelName: string;
  protected toDomain<T>(document: unknown): T { /* map document */ }
  protected toObjectId(id: string): ObjectId { /* validate + convert */ }
}
```

---

## 6. Feature Repository Guidelines

Each feature repository implements its `I*Repository` interface and extends `BaseRepository`.

### Planned repositories

| Repository | Aggregate | Planned responsibilities |
|---|---|---|
| `UserRepository` | User | Find by id/email, list by role, existence checks |
| `TicketRepository` | Ticket | CRUD, filter by status/priority/assignee/creator, pagination |
| `CommentRepository` | Comment | Create, list by ticket, list by author |

### Design rules

1. **One repository per aggregate root** — `CommentRepository` does not modify tickets.
2. **Interface-first** — define `I*Repository` before implementing; services import the interface only.
3. **Lean queries by default** — use `.lean()` and map to domain types to avoid leaking Mongoose documents.
4. **Single model import** — each repository imports only its own model from `src/models/`.
5. **No static methods** — instantiate repositories (or inject via constructor) for testability.

```typescript
// Conceptual — CRUD methods deferred
class TicketRepository extends BaseRepository<ITicketRecord> implements ITicketRepository {
  // constructor holds Ticket model reference
  // methods: findById, findAll, create, update, delete — to be implemented
}
```

---

## 7. How Services Consume Repositories

### Dependency direction

```
Service  →  I*Repository (interface)
              ↑
         *Repository (concrete, wired at composition root)
```

### Pattern: Constructor injection

Services receive repository **interfaces** via constructor. This keeps services testable — unit tests pass mock repositories.

```typescript
// Conceptual — not implemented yet
class TicketService {
  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly userRepository: IUserRepository,
    private readonly commentRepository: ICommentRepository,
  ) {}

  // Business method example (future):
  // async assignTicket(ticketId, assigneeId) {
  //   const user = await this.userRepository.findById(assigneeId);
  //   if (!user) throw new NotFoundException('Assignee not found');
  //   return this.ticketRepository.updateAssignedTo(ticketId, assigneeId);
  // }
}
```

### Wiring (composition root)

Concrete repositories are instantiated once and passed into services. Wiring happens in a dedicated factory module (future: `src/container.ts` or per-route factories) — **not** inside controllers or services.

```typescript
// Conceptual wiring
const userRepository = new UserRepository();
const ticketRepository = new TicketRepository();
const ticketService = new TicketService(ticketRepository, userRepository);
```

### Testing strategy

| Test type | Repository usage |
|---|---|
| **Unit tests (service)** | Mock `I*Repository` with jest mocks — no database |
| **Integration tests (repository)** | Real MongoDB (test database) — test actual queries |
| **E2E tests** | Full stack through controllers |

---

## 8. Data Flow Example (Future)

```
POST /api/tickets
  → TicketController.create()
    → TicketService.createTicket(dto)
      → UserRepository.findById(dto.createdBy)     // verify creator exists
      → TicketRepository.create(ticketData)         // persist
    ← ITicketRecord
  ← ApiResponse.success(...)
```

The service orchestrates; the repository only reads/writes data.

---

## 9. Error Handling

| Scenario | Repository behavior |
|---|---|
| Document not found | Return `null` (service decides to throw `NotFoundException`) |
| Duplicate key (email) | Let error propagate or map to a typed result — service handles `ConflictException` |
| Invalid ObjectId format | Throw or return `null` — consistent per method, documented in interface |

Repositories do **not** throw HTTP-layer exceptions (`NotFoundException`). That is the service's job.

---

## 10. Out of Scope (This Prompt)

- CRUD method implementations
- Service implementations
- API routes / controllers
- Dependency injection container
- Transaction/session management (future enhancement)

These will be addressed in subsequent implementation prompts.

---

## 11. Implementation Order (Recommended)

1. `BaseRepository` — shared mapping and ID helpers
2. `UserRepository` — simplest aggregate, needed for ticket validation
3. `TicketRepository` — core business entity
4. `CommentRepository` — depends on tickets existing
5. Service layer — consumes all three interfaces
