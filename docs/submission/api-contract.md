# API Contract

> **Full specification:** [`../API_CONTRACT.md`](../API_CONTRACT.md) (version 1.0.0, 725 lines)  
> This document summarizes endpoints for submission review. The linked file is the **single source of truth**.

**Base URL (dev):** `http://localhost:3000`  
**Content-Type:** `application/json`  
**Auth:** `Authorization: Bearer <JWT>` on protected routes

---

## Global Conventions

### Success envelope

```json
{
  "success": true,
  "message": "Human-readable success message",
  "data": {}
}
```

### Error envelope

```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": { "fields": { "title": ["Title is required"] } }
  }
}
```

### Enums

| Type | Values |
| ---- | ------ |
| `status` | `open`, `in_progress`, `on_hold`, `resolved`, `closed`, `cancelled` |
| `priority` | `low`, `medium`, `high`, `critical` |
| `role` | `employee`, `support_agent`, `admin` |

### Ticket identifier

Public URLs and API path param `:id` use **sequential `ticketNumber`** (e.g. `1`, `2`, `3`), not MongoDB `_id`.

---

## Endpoint: Health Check

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/health` |
| **Purpose** | Verify API is running |
| **Auth** | None |

### Response `200`

```json
{
  "success": true,
  "message": "Service is healthy",
  "data": { "timestamp": "2026-07-08T15:30:00.000Z" }
}
```

---

## Endpoint: Register

| | |
|-|-|
| **Method** | `POST` |
| **Path** | `/api/auth/register` |
| **Purpose** | Create new user account |
| **Auth** | None |

### Request

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "Password123!"
}
```

### Response `201`

```json
{
  "success": true,
  "message": "Registration successful",
  "data": { "_id": "...", "name": "Jane Smith", "email": "jane@example.com", "role": "employee" }
}
```

### Validation rules

- `name`: 1–100 chars
- `email`: valid email, unique
- `password`: min 8 chars, upper, lower, digit, special `@$!`

### Error responses

| Status | Code | Condition |
| ------ | ---- | --------- |
| 422 | `VALIDATION_ERROR` | Invalid body |
| 409 | `CONFLICT` | Email already exists |

---

## Endpoint: Login

| | |
|-|-|
| **Method** | `POST` |
| **Path** | `/api/auth/login` |
| **Purpose** | Authenticate and receive JWT |
| **Auth** | None |

### Request

```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

### Response `200`

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { "_id": "...", "name": "John Doe", "email": "john@example.com", "role": "support_agent" }
  }
}
```

### Error responses

| Status | Code | Condition |
| ------ | ---- | --------- |
| 401 | `UNAUTHORIZED` | Invalid credentials |
| 422 | `VALIDATION_ERROR` | Invalid body |

---

## Endpoint: List Tickets

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/tickets` |
| **Purpose** | Paginated, filterable ticket list |
| **Auth** | Bearer JWT |

### Query parameters

| Param | Type | Notes |
| ----- | ---- | ----- |
| `page`, `limit` | integer | Pagination |
| `sortBy`, `sortOrder` | string | e.g. `createdAt`, `desc` |
| `status`, `priority` | enum | Filters |
| `assignedTo`, `createdBy` | ObjectId | Filters |
| `keyword` | string | Cross-field search: title, description, assignee/reporter name or email, priority, status, date, ticket number |

### Response `200`

```json
{
  "success": true,
  "message": "Tickets retrieved successfully",
  "data": {
    "items": [ /* TicketPopulated[] */ ],
    "pagination": { "page": 1, "limit": 20, "total": 42, "totalPages": 3 }
  }
}
```

---

## Endpoint: Create Ticket

| | |
|-|-|
| **Method** | `POST` |
| **Path** | `/api/tickets` |
| **Purpose** | Create new support ticket |
| **Auth** | Bearer JWT |

### Request

```json
{
  "title": "Cannot access VPN",
  "description": "VPN fails after password reset.",
  "priority": "high",
  "createdBy": "507f1f77bcf86cd799439012",
  "assignedTo": "507f1f77bcf86cd799439013"
}
```

### Response `201`

`data` = Ticket (unpopulated), `status` defaults to `open`, `ticketNumber` assigned sequentially.

### Error responses

| Status | Code | Condition |
| ------ | ---- | --------- |
| 422 | `VALIDATION_ERROR` | Invalid fields |
| 404 | `NOT_FOUND` | User ID not found |

---

## Endpoint: Get Ticket by ID

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/tickets/:id` |
| **Purpose** | Single ticket with populated users |
| **Auth** | Bearer JWT |

`:id` = `ticketNumber` (integer as string).

### Response `200`

`data` = **TicketPopulated** (`createdBy`, `assignedTo` as UserSummary objects).

---

## Endpoint: Update Ticket

| | |
|-|-|
| **Method** | `PUT` |
| **Path** | `/api/tickets/:id` |
| **Purpose** | Update title, description, priority, assignee |
| **Auth** | Bearer JWT |

### Request (partial allowed)

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "medium",
  "assignedTo": "507f1f77bcf86cd799439013"
}
```

`assignedTo: null` unassigns.

### Error responses

| Status | Code | Condition |
| ------ | ---- | --------- |
| 403 | `FORBIDDEN` | Ticket status is `closed` |
| 404 | `NOT_FOUND` | Ticket or user not found |
| 422 | `VALIDATION_ERROR` | Invalid body |

---

## Endpoint: Change Ticket Status

| | |
|-|-|
| **Method** | `PATCH` |
| **Path** | `/api/tickets/:id/status` |
| **Purpose** | Workflow status transition |
| **Auth** | Bearer JWT |

### Request

```json
{ "status": "in_progress" }
```

### Validation rules

Transitions must match §1.4 in full contract (e.g. `open` → `in_progress` | `cancelled` only).

### Error responses

| Status | Code | Condition |
| ------ | ---- | --------- |
| 400 | `BAD_REQUEST` | Invalid transition |
| 404 | `NOT_FOUND` | Ticket not found |

---

## Endpoint: Delete Ticket

| | |
|-|-|
| **Method** | `DELETE` |
| **Path** | `/api/tickets/:id` |
| **Purpose** | Remove ticket and related comments |
| **Auth** | Bearer JWT |

### Response `200`

```json
{ "success": true, "message": "Ticket deleted successfully", "data": null }
```

---

## Endpoint: Dashboard Statistics

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/tickets/dashboard` |
| **Purpose** | Count tickets by status |
| **Auth** | Bearer JWT |

### Response `200`

```json
{
  "success": true,
  "data": {
    "total": 42,
    "open": 10,
    "inProgress": 8,
    "resolved": 12,
    "closed": 9,
    "cancelled": 3
  }
}
```

---

## Endpoint: List Users

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/users` |
| **Purpose** | Dropdown data for assignee/reporter fields |
| **Auth** | Bearer JWT |

### Response `200`

`data` = array of `{ _id, name, email, role }`.

---

## Endpoint: Add Comment

| | |
|-|-|
| **Method** | `POST` |
| **Path** | `/api/tickets/:ticketId/comments` |
| **Purpose** | Add comment to ticket thread |
| **Auth** | Bearer JWT |

### Request

```json
{
  "message": "Escalated to network team.",
  "createdBy": "507f1f77bcf86cd799439012"
}
```

---

## Endpoint: List Comments

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/tickets/:ticketId/comments` |
| **Purpose** | Paginated comments for a ticket |
| **Auth** | Bearer JWT |

---

## Endpoint: List Notifications

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/notifications` |
| **Purpose** | Unread in-app notifications for current user (newest first, limit 10) |
| **Auth** | Bearer JWT |

### Response `200`

`data` = array of notification objects (`_id`, `type`, `message`, `ticketNumber`, `ticketTitle`, `read`, `createdAt`).

---

## Endpoint: Unread Notification Count

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/notifications/unread-count` |
| **Purpose** | Lightweight badge count for bell icon |
| **Auth** | Bearer JWT |

### Response `200`

```json
{
  "success": true,
  "data": { "count": 3 }
}
```

---

## Endpoint: Mark Notification Read

| | |
|-|-|
| **Method** | `PATCH` |
| **Path** | `/api/notifications/:id/read` |
| **Purpose** | Mark single notification as read |
| **Auth** | Bearer JWT |

---

## Endpoint: Mark All Notifications Read

| | |
|-|-|
| **Method** | `PATCH` |
| **Path** | `/api/notifications/read-all` |
| **Purpose** | Mark all notifications for current user as read |
| **Auth** | Bearer JWT |

---

## Maintenance

Any change to request/response shapes requires updating `docs/API_CONTRACT.md` and coordinating a version bump per contract header instructions.
