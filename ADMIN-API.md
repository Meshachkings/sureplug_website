# SurePlug Admin API Reference

Base URL: `https://api.sureplug.com` (or local: `http://localhost:3000`)

All admin endpoints require:
1. A valid user JWT token in the `Authorization` header
2. The authenticated user must have role `"admin"`

```
Authorization: Bearer <admin-token>
```

Any request from a non-admin user returns:
```json
{ "status": 403, "message": "Forbidden" }
```

---

## Table of Contents

- [Dashboard](#dashboard)
- [Users](#users)
- [Services](#services)
- [Bookings](#bookings)
- [Reviews](#reviews)
- [Verifications](#verifications)
- [Contacts](#contacts)
- [Waitlist](#waitlist)
- [Notifications / Broadcast](#notifications--broadcast)

---

## Dashboard

### Get Platform Stats
`GET /admin/dashboard`

Returns a high-level overview of the entire platform.

**Response**
```json
{
  "status": 200,
  "message": "Dashboard stats fetched",
  "data": {
    "users": {
      "total": 1240,
      "providers": 380,
      "newThisMonth": 94
    },
    "services": {
      "total": 512
    },
    "bookings": {
      "total": 3870,
      "pending": 142,
      "completed": 2810
    },
    "reviews": {
      "total": 1634
    },
    "verifications": {
      "total": 420,
      "successful": 380
    },
    "revenue": {
      "total": 760000
    },
    "contacts": {
      "total": 56
    },
    "waitlist": {
      "total": 210
    }
  }
}
```

> `revenue.total` is the sum of all successful verification payments (in kobo if using Paystack).

---

## Users

### List All Users
`GET /admin/users`

Returns a paginated list of all users. Supports search and role filtering.

**Query Parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `search` | string | No | Searches across firstName, lastName, email, suretag |
| `role` | string | No | Filter by role: `user`, `seller`, `admin` |
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 10, max: 100) |

**Example Request**
```
GET /admin/users?role=seller&search=john&page=1&limit=20
```

**Response**
```json
{
  "status": 200,
  "message": "Users fetched",
  "data": {
    "users": [
      {
        "_id": "664a1b2c3d4e5f6a7b8c9d0e",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "08012345678",
        "role": "seller",
        "suretag": "john4x2r",
        "verified": true,
        "providerVerified": true,
        "providerVerificationExpiresAt": "2026-07-15T00:00:00.000Z",
        "isBlocked": false,
        "bio": "Hi, i'm new here",
        "avatar": {
          "url": "https://res.cloudinary.com/sureplug/image/upload/v1/avatars/abc.jpg",
          "fileName": "abc.jpg",
          "size": 42000,
          "type": "image/jpeg"
        },
        "createdAt": "2025-11-01T10:00:00.000Z",
        "updatedAt": "2026-06-10T08:22:11.000Z"
      }
    ],
    "pagination": {
      "total": 380,
      "page": 1,
      "limit": 20,
      "totalPages": 19,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

### Get User Detail
`GET /admin/users/:id`

Returns full user info plus a quick stats summary.

**Response**
```json
{
  "status": 200,
  "message": "User fetched",
  "data": {
    "user": {
      "_id": "664a1b2c3d4e5f6a7b8c9d0e",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "08012345678",
      "role": "seller",
      "suretag": "john4x2r",
      "verified": true,
      "providerVerified": true,
      "providerVerificationExpiresAt": "2026-07-15T00:00:00.000Z",
      "isBlocked": false,
      "bio": "Hi, i'm new here",
      "avatar": null,
      "location": null,
      "autoRenewEnabled": true,
      "createdAt": "2025-11-01T10:00:00.000Z",
      "updatedAt": "2026-06-10T08:22:11.000Z"
    },
    "stats": {
      "serviceCount": 5,
      "bookingCount": 42,
      "reviewCount": 18
    }
  }
}
```

---

### Change User Role
`PATCH /admin/users/:id/role`

Promote or demote a user's role.

**Body**
```json
{ "role": "seller" }
```

Valid values: `"user"`, `"seller"`, `"admin"`

**Response**
```json
{
  "status": 200,
  "message": "User role updated",
  "data": {
    "_id": "664a1b2c3d4e5f6a7b8c9d0e",
    "role": "seller",
    ...
  }
}
```

> Assigning `"admin"` role grants full admin access to that account. Use with caution.

---

### Block / Unblock User
`PATCH /admin/users/:id/ban`

Blocks or unblocks a user account. A blocked user can still log in — enforce access restriction on the frontend or use in combination with JWT invalidation on your auth layer.

**Body**
```json
{ "isBlocked": true }
```

| Value | Effect |
|-------|--------|
| `true` | Block the user |
| `false` | Unblock the user |

**Response**
```json
{
  "status": 200,
  "message": "User blocked successfully",
  "data": {
    "_id": "664a1b2c3d4e5f6a7b8c9d0e",
    "isBlocked": true,
    ...
  }
}
```

---

### Delete User
`DELETE /admin/users/:id`

Permanently deletes a user account. This is **irreversible** — the user's associated data (services, bookings, etc.) remains in the database.

**Response**
```json
{
  "status": 200,
  "message": "User deleted successfully"
}
```

---

## Services

### List All Services
`GET /admin/services`

Returns all services across all providers with provider and category info.

**Query Parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `search` | string | No | Search by service title |
| `category` | string | No | Filter by category ID |
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 10, max: 100) |

**Example Request**
```
GET /admin/services?search=plumbing&page=1&limit=20
```

**Response**
```json
{
  "status": 200,
  "message": "Services fetched",
  "data": {
    "services": [
      {
        "_id": "665b2c3d4e5f6a7b8c9d0e1f",
        "title": "Expert Plumbing Repair",
        "description": "Full residential plumbing services.",
        "price": 15000,
        "status": "active",
        "createdAt": "2025-12-01T09:00:00.000Z",
        "provider": {
          "_id": "664a1b2c3d4e5f6a7b8c9d0e",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com",
          "suretag": "john4x2r",
          "providerVerified": true
        },
        "category": {
          "_id": "663c1a2b3c4d5e6f7a8b9c0d",
          "name": "Plumbing",
          "icon": "🔧"
        }
      }
    ],
    "pagination": {
      "total": 512,
      "page": 1,
      "limit": 20,
      "totalPages": 26,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

### Delete Service
`DELETE /admin/services/:id`

Permanently removes a service from the platform.

**Response**
```json
{
  "status": 200,
  "message": "Service deleted successfully"
}
```

---

## Bookings

### List All Bookings
`GET /admin/bookings`

Returns all bookings across all users with customer and service info.

**Query Parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string | No | Filter by status (see values below) |
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 10, max: 100) |

**Booking status values:** `pending`, `accepted`, `rejected`, `in_progress`, `completed`, `cancelled`

**Example Request**
```
GET /admin/bookings?status=pending&page=1&limit=20
```

**Response**
```json
{
  "status": 200,
  "message": "Bookings fetched",
  "data": {
    "bookings": [
      {
        "_id": "666c3d4e5f6a7b8c9d0e1f2a",
        "status": "pending",
        "note": "Please come early in the morning.",
        "scheduledDate": "2026-06-25T08:00:00.000Z",
        "attachments": [],
        "createdAt": "2026-06-18T14:22:00.000Z",
        "user": {
          "_id": "664a1b2c3d4e5f6a7b8c9d0e",
          "firstName": "Jane",
          "lastName": "Smith",
          "email": "jane@example.com",
          "phone": "08011111111"
        },
        "service": {
          "_id": "665b2c3d4e5f6a7b8c9d0e1f",
          "title": "Expert Plumbing Repair",
          "price": 15000
        }
      }
    ],
    "pagination": {
      "total": 142,
      "page": 1,
      "limit": 20,
      "totalPages": 8,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

### Get Booking Detail
`GET /admin/bookings/:id`

Returns the full booking record with deeply populated user, service (+ provider), and address.

**Response**
```json
{
  "status": 200,
  "message": "Booking fetched",
  "data": {
    "_id": "666c3d4e5f6a7b8c9d0e1f2a",
    "status": "in_progress",
    "note": "Please come early.",
    "scheduledDate": "2026-06-25T08:00:00.000Z",
    "attachments": [
      {
        "path": "https://res.cloudinary.com/sureplug/image/upload/v1/attachments/abc.jpg",
        "filename": "abc.jpg",
        "size": 120000,
        "mimetype": "image/jpeg"
      }
    ],
    "user": {
      "_id": "664a1b2c3d4e5f6a7b8c9d0e",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@example.com"
    },
    "service": {
      "_id": "665b2c3d4e5f6a7b8c9d0e1f",
      "title": "Expert Plumbing Repair",
      "price": 15000,
      "userId": {
        "_id": "664a1b2c3d4e5f6a7b8c9d0f",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      }
    },
    "address": {
      "_id": "667d4e5f6a7b8c9d0e1f2a3b",
      "street": "12 Lekki Phase 1",
      "city": "Lagos",
      "state": "Lagos",
      "country": "Nigeria"
    },
    "createdAt": "2026-06-18T14:22:00.000Z"
  }
}
```

---

### Update Booking Status
`PATCH /admin/bookings/:id/status`

Allows admin to manually override a booking's status.

**Body**
```json
{ "status": "cancelled" }
```

Valid values: `pending`, `accepted`, `rejected`, `in_progress`, `completed`, `cancelled`

**Response**
```json
{
  "status": 200,
  "message": "Booking status updated",
  "data": {
    "_id": "666c3d4e5f6a7b8c9d0e1f2a",
    "status": "cancelled",
    ...
  }
}
```

---

## Reviews

### List All Reviews
`GET /admin/reviews`

Returns all reviews across the platform. Can be filtered by a specific service.

**Query Parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `serviceId` | string | No | Filter reviews for a specific service |
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 10, max: 100) |

**Example Request**
```
GET /admin/reviews?serviceId=665b2c3d4e5f6a7b8c9d0e1f&page=1&limit=20
```

**Response**
```json
{
  "status": 200,
  "message": "Reviews fetched",
  "data": {
    "reviews": [
      {
        "_id": "668e5f6a7b8c9d0e1f2a3b4c",
        "rating": 2,
        "comment": "The technician was very late and didn't finish the job.",
        "createdAt": "2026-06-01T11:45:00.000Z",
        "user": {
          "_id": "664a1b2c3d4e5f6a7b8c9d0e",
          "firstName": "Jane",
          "lastName": "Smith",
          "email": "jane@example.com"
        },
        "service": {
          "_id": "665b2c3d4e5f6a7b8c9d0e1f",
          "title": "Expert Plumbing Repair"
        }
      }
    ],
    "pagination": {
      "total": 1634,
      "page": 1,
      "limit": 20,
      "totalPages": 82,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

### Delete Review
`DELETE /admin/reviews/:id`

Permanently removes an inappropriate or fraudulent review.

**Response**
```json
{
  "status": 200,
  "message": "Review deleted successfully"
}
```

---

## Verifications

### List All Verification Payments
`GET /admin/verifications`

Returns all provider verification payment records with the associated user.

**Query Parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string | No | Filter by payment status: `pending`, `success`, `failed` |
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 10, max: 100) |

**Example Request**
```
GET /admin/verifications?status=failed&page=1&limit=20
```

**Response**
```json
{
  "status": 200,
  "message": "Verifications fetched",
  "data": {
    "verifications": [
      {
        "_id": "669f6a7b8c9d0e1f2a3b4c5d",
        "reference": "verify_initial_664a1b2c_a1b2c3",
        "amount": 5000,
        "status": "success",
        "paidAt": "2026-05-12T09:30:00.000Z",
        "createdAt": "2026-05-12T09:28:00.000Z",
        "user": {
          "_id": "664a1b2c3d4e5f6a7b8c9d0e",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com",
          "suretag": "john4x2r",
          "providerVerified": true,
          "providerVerificationExpiresAt": "2026-06-12T09:30:00.000Z"
        }
      }
    ],
    "pagination": {
      "total": 420,
      "page": 1,
      "limit": 20,
      "totalPages": 21,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

### Manually Verify / Unverify a Provider
`PATCH /admin/verifications/:userId/verify`

Grants or revokes provider verification for a user without requiring payment. When granted manually, the verification is extended by one month from today.

> `:userId` is the **User ID**, not a verification payment ID.

**Body**
```json
{ "verified": true }
```

| Value | Effect |
|-------|--------|
| `true` | Sets `providerVerified: true`, extends `providerVerificationExpiresAt` by 30 days |
| `false` | Sets `providerVerified: false`, clears `providerVerificationExpiresAt` |

**Response**
```json
{
  "status": 200,
  "message": "Provider verified successfully",
  "data": {
    "_id": "664a1b2c3d4e5f6a7b8c9d0e",
    "firstName": "John",
    "lastName": "Doe",
    "role": "seller",
    "providerVerified": true,
    "providerVerificationExpiresAt": "2026-07-20T00:00:00.000Z",
    ...
  }
}
```

**Error — user is not a provider**
```json
{
  "status": 400,
  "message": "User is not a service provider"
}
```

---

## Contacts

### List Contact Messages
`GET /admin/contacts`

Returns all messages submitted through the contact form.

**Query Parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `search` | string | No | Search by name, email, or message content |
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 10, max: 100) |

**Response**
```json
{
  "status": 200,
  "message": "Contacts fetched",
  "data": {
    "contacts": [
      {
        "_id": "670a7b8c9d0e1f2a3b4c5d6e",
        "name": "Alice Okafor",
        "email": "alice@example.com",
        "message": "I have an issue with my booking payment.",
        "createdAt": "2026-06-15T07:10:00.000Z"
      }
    ],
    "pagination": {
      "total": 56,
      "page": 1,
      "limit": 10,
      "totalPages": 6,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

## Waitlist

### List Waitlist Entries
`GET /admin/waitlist`

Returns all users who signed up for the waitlist.

**Query Parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 10, max: 100) |

**Response**
```json
{
  "status": 200,
  "message": "Waitlist fetched",
  "data": {
    "entries": [
      {
        "_id": "671b8c9d0e1f2a3b4c5d6e7f",
        "email": "waitlistuser@example.com",
        "phone": "08099999999",
        "service": "Carpentry",
        "createdAt": "2026-06-10T12:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 210,
      "page": 1,
      "limit": 10,
      "totalPages": 21,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

## Notifications / Broadcast

### Broadcast Notification
`POST /admin/notifications/broadcast`

Sends an in-app notification and FCM push to a set of users or to the **entire platform** (excluding admins).

**Body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | string | Yes | The notification message to send |
| `userIds` | string[] | No | If omitted, broadcasts to **all non-admin users** |

**Broadcast to everyone**
```json
{
  "message": "SurePlug will undergo maintenance on June 25 from 2–4 AM WAT."
}
```

**Broadcast to specific users**
```json
{
  "message": "Your account has been reviewed. Please check your profile.",
  "userIds": [
    "664a1b2c3d4e5f6a7b8c9d0e",
    "664a1b2c3d4e5f6a7b8c9d1f"
  ]
}
```

**Response**
```json
{
  "status": 200,
  "message": "Notification broadcast sent",
  "data": {
    "sent": 1240
  }
}
```

> `sent` is the number of in-app notifications created. FCM pushes are fire-and-forget and run in the background — they are not reflected in this count.

---

## Common Error Responses

### 401 — Not Authenticated
```json
{ "status": 401, "message": "Unauthorised" }
```

### 403 — Not Admin
```json
{ "status": 403, "message": "Forbidden" }
```

### 404 — Resource Not Found
```json
{ "status": 404, "message": "User not found" }
```

### 400 — Bad Request
```json
{ "status": 400, "message": "Invalid role. Valid roles: user, seller, admin" }
```

---

## Quick Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/dashboard` | Platform-wide stats |
| GET | `/admin/users` | List all users |
| GET | `/admin/users/:id` | User detail + stats |
| PATCH | `/admin/users/:id/role` | Change user role |
| PATCH | `/admin/users/:id/ban` | Block / unblock user |
| DELETE | `/admin/users/:id` | Delete user |
| GET | `/admin/services` | List all services |
| DELETE | `/admin/services/:id` | Delete a service |
| GET | `/admin/bookings` | List all bookings |
| GET | `/admin/bookings/:id` | Booking detail |
| PATCH | `/admin/bookings/:id/status` | Override booking status |
| GET | `/admin/reviews` | List all reviews |
| DELETE | `/admin/reviews/:id` | Delete a review |
| GET | `/admin/verifications` | List verification payments |
| PATCH | `/admin/verifications/:userId/verify` | Manually verify/unverify provider |
| GET | `/admin/contacts` | List contact messages |
| GET | `/admin/waitlist` | List waitlist entries |
| POST | `/admin/notifications/broadcast` | Broadcast notification |
