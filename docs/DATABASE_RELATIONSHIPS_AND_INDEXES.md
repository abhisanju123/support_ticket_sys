# Relationships & Database Indexes

This document defines entity relationships and explains every database index used for query optimization.

---

## Entity Relationships

```
User
  │
  │ creates (1:N, required)
  ▼
Ticket
  │
  ├── assignedTo (N:1, optional) ──▶ User
  │
  │ has many (1:N)
  ▼
Comment
  │
  ├── belongs to (N:1) ──▶ Ticket
  └── createdBy (N:1) ──▶ User
```

| Relationship | Cardinality | FK Field | Required | Description |
|---|---|---|---|---|
| User → Ticket (creates) | One-to-Many | `tickets.createdBy` | Yes | Every ticket has exactly one creator |
| User → Ticket (assigned) | One-to-Many | `tickets.assignedTo` | No | A ticket may have zero or one assignee |
| Ticket → Comment | One-to-Many | `comments.ticketId` | Yes | Comments belong to one ticket |
| Comment → User (author) | Many-to-One | `comments.createdBy` | Yes | Every comment has one author |

**Why references over embedding:** Comments grow unbounded per ticket. Separate collections with indexed `ObjectId` references avoid document size limits and enable independent querying.

---

## Index Strategy

Indexes are chosen to support:

- Ticket listing and filtering (`status`, `priority`, `createdBy`, `assignedTo`)
- Chronological sorting (`createdAt`)
- User resolution (`email`)
- Comment thread loading (`ticketId`)

Compound indexes use MongoDB's **leftmost prefix** rule — a compound index `{ a: 1, b: 1 }` also supports queries on `a` alone.

---

## Users Collection

### `users_email_unique` — `{ email: 1 }` (unique)

**Why:** Email is the natural identifier for internal users. A unique index enforces one account per email and makes user lookups O(log n) when populating `createdBy`, `assignedTo`, or comment `createdBy` references.

### `users_role` — `{ role: 1 }`

**Why:** Supports filtering users by role — e.g. fetching all `support_agent` users for an assignment dropdown without scanning the full collection.

---

## Tickets Collection

### `tickets_createdBy_createdAt` — `{ createdBy: 1, createdAt: -1 }`

**Why:** Powers the "My Tickets" view — find all tickets created by a user, sorted newest first. Covers `createdBy` filter queries via leftmost prefix.

### `tickets_assignedTo_status` — `{ assignedTo: 1, status: 1 }` (sparse)

**Why:** Agent workload queries — e.g. "show me all IN_PROGRESS tickets assigned to user X." Sparse because newly created tickets have no assignee yet.

### `tickets_status_priority_createdAt` — `{ status: 1, priority: 1, createdAt: -1 }`

**Why:** Support dashboard with combined filters — e.g. all OPEN + HIGH priority tickets, sorted by date. Also supports `status`-only queries via leftmost prefix.

### `tickets_status_createdAt` — `{ status: 1, createdAt: -1 }`

**Why:** Dedicated status filtering without priority in the query — e.g. list all RESOLVED tickets sorted by date. More efficient than the three-field compound when priority is not filtered.

### `tickets_priority_createdAt` — `{ priority: 1, createdAt: -1 }`

**Why:** Urgency-based queues — e.g. "all CRITICAL tickets" regardless of status. The status compound index cannot serve priority-only queries.

### `tickets_assignedTo_createdAt` — `{ assignedTo: 1, createdAt: -1 }` (sparse)

**Why:** List all tickets for an assignee sorted by date across all statuses. Sparse because unassigned tickets omit `assignedTo`.

### `tickets_createdAt` — `{ createdAt: -1 }`

**Why:** Global ticket feed sorted newest first — admin overview and paginated listing without other filters.

---

## Comments Collection

### `comments_ticketId_createdAt` — `{ ticketId: 1, createdAt: 1 }`

**Why:** The most frequent comment query — load a ticket's full discussion thread in chronological order.

### `comments_createdBy_createdAt` — `{ createdBy: 1, createdAt: -1 }`

**Why:** Activity history for a user — all comments they have authored, sorted newest first.

---

## Index Summary Table

| Collection | Index Name | Keys | Sparse | Purpose |
|---|---|---|---|---|
| users | `users_email_unique` | `email` | No | User lookup, uniqueness |
| users | `users_role` | `role` | No | Role-based filtering |
| tickets | `tickets_createdBy_createdAt` | `createdBy`, `createdAt` | No | My tickets |
| tickets | `tickets_assignedTo_status` | `assignedTo`, `status` | Yes | Agent workload |
| tickets | `tickets_status_priority_createdAt` | `status`, `priority`, `createdAt` | No | Combined dashboard filter |
| tickets | `tickets_status_createdAt` | `status`, `createdAt` | No | Status-only filter |
| tickets | `tickets_priority_createdAt` | `priority`, `createdAt` | No | Priority-only filter |
| tickets | `tickets_assignedTo_createdAt` | `assignedTo`, `createdAt` | Yes | Assignee ticket list |
| tickets | `tickets_createdAt` | `createdAt` | No | Global chronological list |
| comments | `comments_ticketId_createdAt` | `ticketId`, `createdAt` | No | Discussion thread |
| comments | `comments_createdBy_createdAt` | `createdBy`, `createdAt` | No | User comment history |

---

## Source of Truth

Index definitions live in `src/database/index-definitions.ts` and are applied to Mongoose schemas via `applySchemaIndexes()`. This keeps models, documentation, and runtime indexes aligned.
