# Support Ticket System — API Contract

> **Status:** Fixed contract between backend and frontend  
> **Version:** 1.0.0  
> **Base URL:** `http://localhost:3000` (development)  
> **Content-Type:** `application/json` for all request and response bodies

This document is the **single source of truth** for the REST API. The frontend must implement against this contract. The backend must not change request/response shapes, status codes, or error formats without updating this document and coordinating a version bump.

---

## AI Instructions (Contract Maintenance)

When extending this API, always:

1. Define every new REST endpoint with method, path, and purpose.
2. Define request payloads (body, params, query) with field types, constraints, and required/optional rules.
3. Define response payloads inside the standard success envelope.
4. Define applicable HTTP status codes per endpoint.
5. Use the shared error response format for all failures.
6. Keep enum values identical to backend `src/enums/`.
7. Do not add breaking changes to existing endpoints without a version increment.

---

## 1. Global Conventions

### 1.1 Identifiers

| Type | Format | Example |
| ---- | ------ | ------- |
| `ObjectId` | 24-character hexadecimal MongoDB ID | `"507f1f77bcf86cd799439011"` |

### 1.2 Dates

All timestamps are ISO 8601 strings in UTC.

```json
"2026-07-08T15:30:00.000Z"
```

### 1.3 Enums

#### Ticket Status (`status`)

| Value | Description |
| ----- | ----------- |
| `open` | Newly created ticket |
| `in_progress` | Actively being worked on |
| `on_hold` | Paused |
| `resolved` | Fix delivered, awaiting closure |
| `closed` | Completed |
| `cancelled` | Cancelled |

#### Ticket Priority (`priority`)

| Value |
| ----- |
| `low` |
| `medium` |
| `high` |
| `critical` |

#### User Role (`role`)

| Value |
| ----- |
| `employee` |
| `support_agent` |
| `admin` |

### 1.4 Allowed Status Transitions

Status changes via `PATCH /tickets/:id/status` must follow these rules. Any other transition returns **400 Bad Request**.

| Current Status | Allowed Next Status |
| -------------- | ------------------- |
| `open` | `in_progress`, `cancelled` |
| `in_progress` | `resolved`, `cancelled` |
| `on_hold` | *(none — transitions blocked)* |
| `resolved` | `closed` |
| `closed` | *(terminal)* |
| `cancelled` | *(terminal)* |

### 1.5 Pagination & Sorting (Query)

Used by list endpoints.

| Parameter | Type | Default | Constraints |
| --------- | ---- | ------- | ----------- |
| `page` | integer | `1` | Positive integer |
| `limit` | integer | `20` | Positive integer, max `100` |
| `sortBy` | string | *(endpoint-specific default)* | See endpoint tables |
| `sortOrder` | string | `desc` | `asc` or `desc` |

**Pagination behavior:**

- If `limit` is provided, `page` defaults to `1`.
- If only `page` is provided, `limit` defaults to `20`.
- If neither is provided, no pagination is applied (all matching records returned).

---

## 2. Standard Response Envelope

### 2.1 Success Response

```json
{
  "success": true,
  "message": "Human-readable success message",
  "data": {}
}
```

| Field | Type | Description |
| ----- | ---- | ----------- |
| `success` | `boolean` | Always `true` |
| `message` | `string` | Endpoint-specific success message |
| `data` | `object` \| `array` \| `null` | Response payload |

### 2.2 Error Response

```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": {
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

| Field | Type | Description |
| ----- | ---- | ----------- |
| `success` | `boolean` | Always `false` |
| `message` | `string` | Human-readable error summary |
| `error.code` | `string` | Machine-readable error code (see §2.3) |
| `error.details` | `object` | Optional structured details |

### 2.3 Error Codes

| Code | HTTP Status | When Used |
| ---- | ----------- | --------- |
| `VALIDATION_ERROR` | 422 | Invalid request body, params, or query (Zod validation) |
| `BAD_REQUEST` | 400 | Business rule violation (e.g. invalid status transition) |
| `NOT_FOUND` | 404 | Resource or route not found |
| `CONFLICT` | 409 | Resource conflict |
| `UNAUTHORIZED` | 401 | Authentication required *(reserved for future use)* |
| `FORBIDDEN` | 403 | Insufficient permissions *(reserved for future use)* |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |

### 2.4 Validation Error Details

When `error.code` is `VALIDATION_ERROR`, `error.details` has this shape:

```json
{
  "fields": {
    "title": ["Title is required"],
    "createdBy": ["Invalid ObjectId format"]
  },
  "issues": [
    {
      "path": "title",
      "message": "Title is required",
      "code": "too_small"
    }
  ]
}
```

---

## 3. Shared Data Types

### 3.1 UserSummary

Populated user reference on tickets.

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "support_agent"
}
```

### 3.2 Ticket (unpopulated)

Returned by create, update, and status-change endpoints.

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Cannot access VPN",
  "description": "VPN connection fails after password reset.",
  "priority": "high",
  "status": "open",
  "createdBy": "507f1f77bcf86cd799439012",
  "assignedTo": "507f1f77bcf86cd799439013",
  "createdAt": "2026-07-08T15:30:00.000Z",
  "updatedAt": "2026-07-08T15:30:00.000Z"
}
```

| Field | Type | Required | Notes |
| ----- | ---- | -------- | ----- |
| `_id` | `ObjectId` | Yes | |
| `title` | `string` | Yes | Max 200 characters |
| `description` | `string` | Yes | Max 5000 characters |
| `priority` | enum | Yes | See §1.3 |
| `status` | enum | Yes | Defaults to `open` on create |
| `createdBy` | `ObjectId` | Yes | User ID |
| `assignedTo` | `ObjectId` | No | Omitted or `null` if unassigned |
| `createdAt` | ISO date | Yes | |
| `updatedAt` | ISO date | Yes | |

### 3.3 TicketPopulated

Returned by get-by-id and list endpoints.

Same as **Ticket**, except:

- `createdBy` is a **UserSummary** object
- `assignedTo` is a **UserSummary** object or `null`

### 3.4 Comment

```json
{
  "_id": "507f1f77bcf86cd799439014",
  "ticketId": "507f1f77bcf86cd799439011",
  "message": "Escalated to network team.",
  "createdBy": "507f1f77bcf86cd799439012",
  "createdAt": "2026-07-08T16:00:00.000Z"
}
```

| Field | Type | Required | Notes |
| ----- | ---- | -------- | ----- |
| `_id` | `ObjectId` | Yes | |
| `ticketId` | `ObjectId` | Yes | Parent ticket |
| `message` | `string` | Yes | Max 5000 characters |
| `createdBy` | `ObjectId` | Yes | User ID (not populated) |
| `createdAt` | ISO date | Yes | |

### 3.5 DashboardStatistics

```json
{
  "total": 42,
  "open": 10,
  "inProgress": 8,
  "resolved": 12,
  "closed": 9,
  "cancelled": 3
}
```

| Field | Type | Description |
| ----- | ---- | ----------- |
| `total` | `number` | Total ticket count |
| `open` | `number` | Tickets with status `open` |
| `inProgress` | `number` | Tickets with status `in_progress` |
| `resolved` | `number` | Tickets with status `resolved` |
| `closed` | `number` | Tickets with status `closed` |
| `cancelled` | `number` | Tickets with status `cancelled` |

> **Note:** `on_hold` tickets are included in `total` but not broken out into a separate field.

---

## 4. Endpoints

### 4.1 Health Check

#### `GET /health`

Verify the API is running.

**Request:** No body, params, or query.

**Success — `200 OK`**

```json
{
  "success": true,
  "message": "Service is healthy",
  "data": {
    "timestamp": "2026-07-08T15:30:00.000Z"
  }
}
```

**Errors:** None expected.

---

### 4.2 Create Ticket

#### `POST /tickets`

Create a new support ticket.

**Request Body**

```json
{
  "title": "Cannot access VPN",
  "description": "VPN connection fails after password reset.",
  "priority": "high",
  "createdBy": "507f1f77bcf86cd799439012",
  "assignedTo": "507f1f77bcf86cd799439013"
}
```

| Field | Type | Required | Constraints |
| ----- | ---- | -------- | ----------- |
| `title` | `string` | Yes | 1–200 chars, trimmed |
| `description` | `string` | Yes | 1–5000 chars, trimmed |
| `priority` | enum | Yes | `low`, `medium`, `high`, `critical` |
| `createdBy` | `ObjectId` | Yes | Must reference an existing user |
| `assignedTo` | `ObjectId` | No | Must reference an existing user if provided |

- Extra fields are rejected (`.strict()` schema).
- `status` is set server-side to `open`.

**Success — `201 Created`**

```json
{
  "success": true,
  "message": "Ticket created successfully",
  "data": { }
}
```

`data` is a **Ticket** (unpopulated). See §3.2.

**Errors**

| Status | Code | Condition |
| ------ | ---- | --------- |
| 422 | `VALIDATION_ERROR` | Invalid or missing body fields |
| 404 | `NOT_FOUND` | `createdBy` or `assignedTo` user does not exist |
| 500 | `INTERNAL_SERVER_ERROR` | Unexpected failure |

---

### 4.3 List / Search / Filter Tickets

#### `GET /tickets`

Returns tickets based on query mode:

1. **Search** — if `keyword` is provided
2. **Filter** — if `status` is provided
3. **List all** — if neither is provided

> `keyword` and `status` **cannot** be used together. Doing so returns **422**.

**Query Parameters**

| Parameter | Type | Required | Constraints |
| --------- | ---- | -------- | ----------- |
| `keyword` | `string` | No | Min 1 char; case-insensitive search on `title` and `description` |
| `status` | enum | No | Ticket status enum |
| `page` | integer | No | See §1.5 |
| `limit` | integer | No | See §1.5 |
| `sortBy` | string | No | `createdAt`, `updatedAt`, `title`, `priority`, `status` |
| `sortOrder` | string | No | `asc` or `desc` |

**Success — `200 OK`**

```json
{
  "success": true,
  "message": "Tickets retrieved successfully",
  "data": []
}
```

`data` is an array of **TicketPopulated** objects. See §3.3.

**Errors**

| Status | Code | Condition |
| ------ | ---- | --------- |
| 422 | `VALIDATION_ERROR` | Invalid query; both `keyword` and `status` provided |
| 500 | `INTERNAL_SERVER_ERROR` | Unexpected failure |

---

### 4.4 Get Ticket by ID

#### `GET /tickets/:id`

**Path Parameters**

| Parameter | Type | Required |
| --------- | ---- | -------- |
| `id` | `ObjectId` | Yes |

**Success — `200 OK`**

```json
{
  "success": true,
  "message": "Ticket retrieved successfully",
  "data": { }
}
```

`data` is a **TicketPopulated**. See §3.3.

**Errors**

| Status | Code | Condition |
| ------ | ---- | --------- |
| 422 | `VALIDATION_ERROR` | Invalid `id` format |
| 404 | `NOT_FOUND` | Ticket does not exist |
| 500 | `INTERNAL_SERVER_ERROR` | Unexpected failure |

---

### 4.5 Update Ticket

#### `PUT /tickets/:id`

Update editable ticket fields. `status` cannot be changed here — use §4.6.

**Path Parameters**

| Parameter | Type | Required |
| --------- | ---- | -------- |
| `id` | `ObjectId` | Yes |

**Request Body** (at least one field required in practice; empty body returns existing ticket unchanged)

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "medium",
  "assignedTo": "507f1f77bcf86cd799439013"
}
```

| Field | Type | Required | Constraints |
| ----- | ---- | -------- | ----------- |
| `title` | `string` | No | 1–200 chars if provided |
| `description` | `string` | No | 1–5000 chars if provided |
| `priority` | enum | No | Valid priority enum |
| `assignedTo` | `ObjectId` \| `null` | No | `null` clears assignment |

- Extra fields are rejected (`.strict()` schema).

**Success — `200 OK`**

```json
{
  "success": true,
  "message": "Ticket updated successfully",
  "data": { }
}
```

`data` is a **Ticket** (unpopulated). See §3.2.

**Errors**

| Status | Code | Condition |
| ------ | ---- | --------- |
| 422 | `VALIDATION_ERROR` | Invalid body or `id` |
| 404 | `NOT_FOUND` | Ticket or assigned user not found |
| 500 | `INTERNAL_SERVER_ERROR` | Unexpected failure |

---

### 4.6 Change Ticket Status

#### `PATCH /tickets/:id/status`

Transition ticket status per allowed rules in §1.4.

**Path Parameters**

| Parameter | Type | Required |
| --------- | ---- | -------- |
| `id` | `ObjectId` | Yes |

**Request Body**

```json
{
  "status": "in_progress"
}
```

| Field | Type | Required | Constraints |
| ----- | ---- | -------- | ----------- |
| `status` | enum | Yes | Valid ticket status enum |

**Success — `200 OK`**

```json
{
  "success": true,
  "message": "Ticket status updated successfully",
  "data": { }
}
```

`data` is a **Ticket** (unpopulated). See §3.2.

**Errors**

| Status | Code | Condition |
| ------ | ---- | --------- |
| 422 | `VALIDATION_ERROR` | Invalid `status` or `id` |
| 400 | `BAD_REQUEST` | Disallowed status transition |
| 404 | `NOT_FOUND` | Ticket does not exist |
| 500 | `INTERNAL_SERVER_ERROR` | Unexpected failure |

**Example — invalid transition (`400`)**

```json
{
  "success": false,
  "message": "Invalid status transition from 'open' to 'closed'",
  "error": {
    "code": "BAD_REQUEST"
  }
}
```

---

### 4.7 Dashboard Statistics

#### `GET /tickets/dashboard`

> **Route order note:** This route is registered before `GET /tickets/:id`, so `dashboard` is not interpreted as an ID.

**Request:** No body or query.

**Success — `200 OK`**

```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
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

`data` is **DashboardStatistics**. See §3.5.

**Errors**

| Status | Code | Condition |
| ------ | ---- | --------- |
| 500 | `INTERNAL_SERVER_ERROR` | Unexpected failure |

---

### 4.8 Add Comment to Ticket

#### `POST /tickets/:ticketId/comments`

**Path Parameters**

| Parameter | Type | Required |
| --------- | ---- | -------- |
| `ticketId` | `ObjectId` | Yes |

**Request Body**

```json
{
  "message": "Escalated to network team.",
  "createdBy": "507f1f77bcf86cd799439012"
}
```

| Field | Type | Required | Constraints |
| ----- | ---- | -------- | ----------- |
| `message` | `string` | Yes | 1–5000 chars, trimmed |
| `createdBy` | `ObjectId` | Yes | Must reference an existing user |

**Success — `201 Created`**

```json
{
  "success": true,
  "message": "Comment added successfully",
  "data": { }
}
```

`data` is a **Comment**. See §3.4.

**Errors**

| Status | Code | Condition |
| ------ | ---- | --------- |
| 422 | `VALIDATION_ERROR` | Invalid body or `ticketId` |
| 404 | `NOT_FOUND` | Ticket or creator user not found |
| 500 | `INTERNAL_SERVER_ERROR` | Unexpected failure |

---

### 4.9 Get Comments by Ticket

#### `GET /tickets/:ticketId/comments`

**Path Parameters**

| Parameter | Type | Required |
| --------- | ---- | -------- |
| `ticketId` | `ObjectId` | Yes |

**Query Parameters**

| Parameter | Type | Required | Constraints |
| --------- | ---- | -------- | ----------- |
| `page` | integer | No | See §1.5 |
| `limit` | integer | No | See §1.5 |
| `sortBy` | string | No | `createdAt` only |
| `sortOrder` | string | No | `asc` or `desc` |

**Success — `200 OK`**

```json
{
  "success": true,
  "message": "Comments retrieved successfully",
  "data": []
}
```

`data` is an array of **Comment** objects, sorted by `createdAt` (default descending). See §3.4.

**Errors**

| Status | Code | Condition |
| ------ | ---- | --------- |
| 422 | `VALIDATION_ERROR` | Invalid `ticketId` or query |
| 404 | `NOT_FOUND` | Ticket does not exist |
| 500 | `INTERNAL_SERVER_ERROR` | Unexpected failure |

---

## 5. Unknown Routes

Any undefined method/path combination returns:

**`404 Not Found`**

```json
{
  "success": false,
  "message": "Route GET /unknown not found",
  "error": {
    "code": "NOT_FOUND"
  }
}
```

---

## 6. Endpoint Summary

| Method | Path | Purpose | Success Status |
| ------ | ---- | ------- | -------------- |
| `GET` | `/health` | Health check | 200 |
| `POST` | `/tickets` | Create ticket | 201 |
| `GET` | `/tickets` | List / search / filter tickets | 200 |
| `GET` | `/tickets/dashboard` | Dashboard statistics | 200 |
| `GET` | `/tickets/:id` | Get ticket by ID | 200 |
| `PUT` | `/tickets/:id` | Update ticket fields | 200 |
| `PATCH` | `/tickets/:id/status` | Change ticket status | 200 |
| `POST` | `/tickets/:ticketId/comments` | Add comment | 201 |
| `GET` | `/tickets/:ticketId/comments` | List comments | 200 |

---

## 7. Frontend Integration Checklist

- [ ] Use `success` boolean to branch success vs. error handling
- [ ] Read payload from `data` on success
- [ ] Read `error.code` and `error.details` on failure
- [ ] Send `createdBy` / `assignedTo` as user ObjectId strings (from seeded users)
- [ ] Do not send `status` on ticket create — server defaults to `open`
- [ ] Use `PATCH /tickets/:id/status` for status changes, not `PUT`
- [ ] Use either `keyword` or `status` on `GET /tickets`, never both
- [ ] Handle `422` validation errors with `error.details.fields` for form feedback
- [ ] Treat `401` / `403` as reserved for future authentication

---

## 8. Versioning Policy

| Change Type | Action |
| ----------- | ------ |
| New endpoint | Add to this document; minor version bump |
| New optional response field | Allowed without version bump |
| New required request field | **Breaking** — requires version bump |
| Changed field type or name | **Breaking** — requires version bump |
| Changed status code | **Breaking** — requires version bump |

---

*Contract version 1.0.0 — aligned with backend implementation as of July 12, 2026*
