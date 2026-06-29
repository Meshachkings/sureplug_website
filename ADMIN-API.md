# SurePlug Admin API Reference

Base URL: `https://api.sureplug.com` (or local: `http://localhost:3000`)

All admin endpoints require:
1. A valid user JWT token in the `Authorization` header
2. The authenticated user must have role `"admin"` or `"subadmin"`

```
Authorization: Bearer <admin-token>
```

Any request from a non-admin/subadmin user returns:
```json
{ "status": 403, "message": "Forbidden" }
```

> **Subadmin note:** Subadmins can access all `/admin/*` routes but their actions may be restricted by their assigned permissions. Full admins have unrestricted access.

---

## Table of Contents

- [Dashboard](#dashboard)
- [Users](#users)
- [Services](#services)
- [Bookings](#bookings)
- [Reviews](#reviews)
- [Provider Verifications](#provider-verifications)
- [Business Verifications](#business-verifications)
- [Staff Management](#staff-management)
- [Contacts](#contacts)
- [Waitlist](#waitlist)
- [Notifications / Broadcast](#notifications--broadcast)
- [Quick Reference](#quick-reference)

---

## User Object Schema

All user objects returned by admin endpoints include these fields:

```json
{
  "_id": "664a1b2c3d4e5f6a7b8c9d0e",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "08012345678",
  "role": "seller",
  "accountType": "handyman",
  "suretag": "john4x2r",
  "bio": "Hi, i'm new here",
  "verified": true,
  "isBlocked": false,
  "providerVerified": true,
  "providerVerificationExpiresAt": "2026-07-15T00:00:00.000Z",
  "businessVerified": false,
  "autoRenewEnabled": true,
  "avatar": {
    "url": "https://res.cloudinary.com/sureplug/image/upload/v1/avatars/abc.jpg",
    "fileName": "abc.jpg",
    "size": 42000,
    "type": "image/jpeg"
  },
  "location": null,
  "fcmTokens": [],
  "createdAt": "2025-11-01T10:00:00.000Z",
  "updatedAt": "2026-06-10T08:22:11.000Z"
}
```

**New fields:**

| Field | Type | Values | Description |
|-------|------|--------|-------------|
| `accountType` | string | `customer`, `handyman`, `business` | The user's account category. Default: `customer` |
| `businessVerified` | boolean | `true / false` | Whether the user has passed business verification |

**Role values:** `user`, `seller`, `subadmin`, `admin`

---

## Dashboard

### Get Platform Stats
`GET /admin/dashboard`

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
    "services": { "total": 512 },
    "bookings": {
      "total": 3870,
      "pending": 142,
      "completed": 2810
    },
    "reviews": { "total": 1634 },
    "verifications": {
      "total": 420,
      "successful": 380
    },
    "revenue": { "total": 760000 },
    "contacts": { "total": 56 },
    "waitlist": { "total": 210 }
  }
}
```

> `revenue.total` is the sum of all successful provider verification payments (in kobo).

---

## Users

### List All Users
`GET /admin/users`

**Query Parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `search` | string | No | Searches firstName, lastName, email, suretag |
| `role` | string | No | Filter by role: `user`, `seller`, `subadmin`, `admin` |
| `page` | number | No | Default: 1 |
| `limit` | number | No | Default: 10, max: 100 |

**Example**
```
GET /admin/users?role=seller&search=john&page=1&limit=20
```

**Response**
```json
{
  "status": 200,
  "message": "Users fetched",
  "data": {
    "users": [ { ...userObject } ],
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

Returns full user info plus a stats summary.

**Response**
```json
{
  "status": 200,
  "message": "User fetched",
  "data": {
    "user": { ...userObject },
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

**Body**
```json
{ "role": "seller" }
```

Valid values: `"user"`, `"seller"`, `"admin"`

> Assigning `"admin"` grants full unrestricted admin access. To create a limited admin, use the [Staff Management](#staff-management) endpoints instead.

**Response**
```json
{
  "status": 200,
  "message": "User role updated",
  "data": { ...userObject }
}
```

---

### Block / Unblock User
`PATCH /admin/users/:id/ban`

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
  "data": { ...userObject }
}
```

---

### Delete User
`DELETE /admin/users/:id`

Permanently deletes the user account. Associated data (services, bookings, etc.) remains in the database.

**Response**
```json
{ "status": 200, "message": "User deleted successfully" }
```

---

## Services

### List All Services
`GET /admin/services`

**Query Parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `search` | string | No | Search by service title |
| `category` | string | No | Filter by category ID |
| `page` | number | No | Default: 1 |
| `limit` | number | No | Default: 10, max: 100 |

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
        "price": 15000,
        "status": "active",
        "createdAt": "2025-12-01T09:00:00.000Z",
        "provider": {
          "_id": "664a1b2c3d4e5f6a7b8c9d0e",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com",
          "suretag": "john4x2r",
          "accountType": "handyman",
          "providerVerified": true
        },
        "category": {
          "_id": "663c1a2b3c4d5e6f7a8b9c0d",
          "name": "Plumbing"
        }
      }
    ],
    "pagination": { "total": 512, "page": 1, "limit": 20, "totalPages": 26, "hasNextPage": true, "hasPrevPage": false }
  }
}
```

---

### Delete Service
`DELETE /admin/services/:id`

```json
{ "status": 200, "message": "Service deleted successfully" }
```

---

## Bookings

### List All Bookings
`GET /admin/bookings`

**Query Parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string | No | `pending`, `accepted`, `rejected`, `in_progress`, `completed`, `cancelled` |
| `page` | number | No | Default: 1 |
| `limit` | number | No | Default: 10, max: 100 |

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
          "accountType": "customer"
        },
        "service": {
          "_id": "665b2c3d4e5f6a7b8c9d0e1f",
          "title": "Expert Plumbing Repair",
          "price": 15000
        }
      }
    ],
    "pagination": { "total": 142, "page": 1, "limit": 20, "totalPages": 8, "hasNextPage": true, "hasPrevPage": false }
  }
}
```

---

### Get Booking Detail
`GET /admin/bookings/:id`

Full booking with user, service (+ provider), and address populated.

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
      { "path": "https://res.cloudinary.com/...", "filename": "abc.jpg", "size": 120000, "mimetype": "image/jpeg" }
    ],
    "user": { "_id": "...", "firstName": "Jane", "lastName": "Smith", "email": "jane@example.com", "accountType": "customer" },
    "service": {
      "_id": "...",
      "title": "Expert Plumbing Repair",
      "price": 15000,
      "userId": { "_id": "...", "firstName": "John", "lastName": "Doe", "accountType": "handyman" }
    },
    "address": { "_id": "...", "street": "12 Lekki Phase 1", "city": "Lagos", "state": "Lagos", "country": "Nigeria" },
    "createdAt": "2026-06-18T14:22:00.000Z"
  }
}
```

---

### Update Booking Status
`PATCH /admin/bookings/:id/status`

**Body**
```json
{ "status": "cancelled" }
```

Valid: `pending`, `accepted`, `rejected`, `in_progress`, `completed`, `cancelled`

---

## Reviews

### List All Reviews
`GET /admin/reviews`

**Query Parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `serviceId` | string | No | Filter by service ID |
| `page` | number | No | Default: 1 |
| `limit` | number | No | Default: 10, max: 100 |

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
        "comment": "The technician was very late.",
        "createdAt": "2026-06-01T11:45:00.000Z",
        "user": { "_id": "...", "firstName": "Jane", "lastName": "Smith", "email": "jane@example.com" },
        "service": { "_id": "...", "title": "Expert Plumbing Repair" }
      }
    ],
    "pagination": { "total": 1634, "page": 1, "limit": 20, "totalPages": 82, "hasNextPage": true, "hasPrevPage": false }
  }
}
```

---

### Delete Review
`DELETE /admin/reviews/:id`

```json
{ "status": 200, "message": "Review deleted successfully" }
```

---

## Provider Verifications

Monthly subscription-based badge for individual service providers.

### List Verification Payments
`GET /admin/verifications`

**Query Parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string | No | `pending`, `success`, `failed` |
| `page` | number | No | Default: 1 |
| `limit` | number | No | Default: 10, max: 100 |

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
          "accountType": "handyman",
          "providerVerified": true,
          "providerVerificationExpiresAt": "2026-06-12T09:30:00.000Z"
        }
      }
    ],
    "pagination": { "total": 420, "page": 1, "limit": 20, "totalPages": 21, "hasNextPage": true, "hasPrevPage": false }
  }
}
```

---

### Manually Verify / Unverify a Provider
`PATCH /admin/verifications/:userId/verify`

> `:userId` is the **User ID**, not a payment record ID.

**Body**
```json
{ "verified": true }
```

| Value | Effect |
|-------|--------|
| `true` | Sets `providerVerified: true`, extends expiry by 30 days |
| `false` | Sets `providerVerified: false`, clears expiry |

**Response**
```json
{ "status": 200, "message": "Provider verified successfully", "data": { ...userObject } }
```

**Error — user is not a provider**
```json
{ "status": 400, "message": "User is not a service provider" }
```

---

## Business Verifications

One-time fee + document upload for a premium business account badge. Requires manual admin review.

**Status flow:** `awaiting_payment` → `awaiting_documents` → `pending_review` → `approved | rejected`

### List Business Verification Requests
`GET /admin/business-verifications`

**Query Parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string | No | `awaiting_payment`, `awaiting_documents`, `pending_review`, `approved`, `rejected` |
| `page` | number | No | Default: 1 |
| `limit` | number | No | Default: 10, max: 100 |

**Example**
```
GET /admin/business-verifications?status=pending_review
```

**Response**
```json
{
  "status": 200,
  "message": "Business verifications fetched",
  "data": {
    "verifications": [
      {
        "_id": "672a1b2c3d4e5f6a7b8c9d0e",
        "businessName": "John's Plumbing Ltd",
        "status": "pending_review",
        "paymentStatus": "success",
        "paidAt": "2026-06-20T10:00:00.000Z",
        "adminNote": null,
        "reviewedBy": null,
        "reviewedAt": null,
        "documents": [
          {
            "path": "https://res.cloudinary.com/sureplug/raw/upload/v1/docs/cac.pdf",
            "filename": "cac.pdf",
            "size": 204800,
            "mimetype": "application/pdf"
          }
        ],
        "createdAt": "2026-06-20T09:55:00.000Z",
        "user": {
          "_id": "664a1b2c3d4e5f6a7b8c9d0e",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com",
          "accountType": "business",
          "businessVerified": false
        }
      }
    ],
    "pagination": { "total": 14, "page": 1, "limit": 10, "totalPages": 2, "hasNextPage": true, "hasPrevPage": false }
  }
}
```

---

### Approve Business Verification
`PATCH /admin/business-verifications/:id/approve`

> `:id` is the business verification **record ID**, not the user ID.

No body required.

Sets `status: approved`, sets `user.businessVerified: true`, sends an in-app notification to the user.

**Response**
```json
{
  "status": 200,
  "message": "Business verification approved",
  "data": {
    "_id": "672a1b2c3d4e5f6a7b8c9d0e",
    "status": "approved",
    "reviewedAt": "2026-06-21T08:00:00.000Z",
    "reviewedBy": "664a1b2c3d4e5f6a7b8c9d0f"
  }
}
```

---

### Reject Business Verification
`PATCH /admin/business-verifications/:id/reject`

**Body**
```json
{ "adminNote": "Documents provided are expired. Please resubmit with current CAC certificate." }
```

Sets `status: rejected`, stores the rejection reason, notifies the user in-app.

**Response**
```json
{
  "status": 200,
  "message": "Business verification rejected",
  "data": {
    "_id": "672a1b2c3d4e5f6a7b8c9d0e",
    "status": "rejected",
    "adminNote": "Documents provided are expired. Please resubmit with current CAC certificate.",
    "reviewedAt": "2026-06-21T08:05:00.000Z"
  }
}
```

---

## Staff Management

Subadmins are limited admin accounts. They can access all `/admin/*` routes but can only perform actions within their assigned permissions.

### Available Permissions

| Permission | What it controls |
|-----------|-----------------|
| `view_dashboard` | View platform stats |
| `manage_users` | View, block, delete users |
| `manage_services` | View, delete services |
| `manage_bookings` | View, update booking status |
| `manage_reviews` | View, delete reviews |
| `manage_verifications` | Provider verification management |
| `manage_business_verifications` | Business verification review |
| `manage_categories` | CRUD categories |
| `manage_contacts` | View contact messages |
| `manage_waitlist` | View waitlist |
| `send_notifications` | Send broadcast notifications |
| `manage_staff` | Create, update, delete subadmins |

---

### List Staff
`GET /admin/staff`

**Query Parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `page` | number | No | Default: 1 |
| `limit` | number | No | Default: 10, max: 100 |

**Response**
```json
{
  "status": 200,
  "message": "Staff fetched",
  "data": {
    "staff": [
      {
        "_id": "664a1b2c3d4e5f6a7b8c9d0f",
        "firstName": "Sarah",
        "lastName": "Admin",
        "email": "sarah@sureplug.com",
        "phone": "08099999999",
        "role": "subadmin",
        "verified": true,
        "permissions": ["manage_users", "manage_bookings", "view_dashboard"],
        "createdAt": "2026-06-01T09:00:00.000Z"
      }
    ],
    "pagination": { "total": 4, "page": 1, "limit": 10, "totalPages": 1, "hasNextPage": false, "hasPrevPage": false }
  }
}
```

---

### Create Staff
`POST /admin/staff`

Creates a new subadmin user account and assigns permissions.

**Body**
```json
{
  "firstName": "Sarah",
  "lastName": "Admin",
  "email": "sarah@sureplug.com",
  "phone": "08099999999",
  "password": "SecurePass123!",
  "permissions": ["manage_users", "manage_bookings", "view_dashboard"]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `firstName` | string | Yes | |
| `lastName` | string | Yes | |
| `email` | string | Yes | Must be unique |
| `phone` | string | Yes | Must be unique |
| `password` | string | Yes | Login password for the staff account |
| `permissions` | string[] | Yes | Array of permission strings from the table above |

**Response**
```json
{
  "status": 201,
  "message": "Staff created successfully",
  "data": {
    "_id": "664a1b2c3d4e5f6a7b8c9d0f",
    "firstName": "Sarah",
    "lastName": "Admin",
    "email": "sarah@sureplug.com",
    "role": "subadmin",
    "permissions": ["manage_users", "manage_bookings", "view_dashboard"],
    "createdAt": "2026-06-21T08:00:00.000Z"
  }
}
```

**Error — invalid permission**
```json
{ "status": 400, "message": "Invalid permissions: manage_everything" }
```

**Error — email already exists**
```json
{ "status": 409, "message": "A user with this email already exists" }
```

---

### Update Staff Permissions
`PATCH /admin/staff/:id/permissions`

Replaces the staff member's full permissions list.

**Body**
```json
{
  "permissions": ["manage_users", "manage_bookings", "manage_reviews", "view_dashboard", "send_notifications"]
}
```

**Response**
```json
{
  "status": 200,
  "message": "Staff permissions updated",
  "data": {
    "_id": "664a1b2c3d4e5f6a7b8c9d0f",
    "role": "subadmin",
    "permissions": ["manage_users", "manage_bookings", "manage_reviews", "view_dashboard", "send_notifications"]
  }
}
```

---

### Delete Staff
`DELETE /admin/staff/:id`

Permanently deletes the subadmin's user account and their permissions record.

**Response**
```json
{ "status": 200, "message": "Staff deleted successfully" }
```

---

## Contacts

### List Contact Messages
`GET /admin/contacts`

**Query Parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `search` | string | No | Search by name, email, or message content |
| `page` | number | No | Default: 1 |
| `limit` | number | No | Default: 10, max: 100 |

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
    "pagination": { "total": 56, "page": 1, "limit": 10, "totalPages": 6, "hasNextPage": true, "hasPrevPage": false }
  }
}
```

---

## Waitlist

### List Waitlist Entries
`GET /admin/waitlist`

**Query Parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `page` | number | No | Default: 1 |
| `limit` | number | No | Default: 10, max: 100 |

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
    "pagination": { "total": 210, "page": 1, "limit": 10, "totalPages": 21, "hasNextPage": true, "hasPrevPage": false }
  }
}
```

---

## Notifications / Broadcast

### Broadcast Notification
`POST /admin/notifications/broadcast`

Sends an in-app notification and FCM push to the entire platform or a specific set of users.

**Body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | string | Yes | The notification message |
| `userIds` | string[] | No | If omitted, broadcasts to all non-admin users |

**Broadcast to everyone**
```json
{ "message": "SurePlug will undergo maintenance on June 25 from 2–4 AM WAT." }
```

**Broadcast to specific users**
```json
{
  "message": "Your account has been reviewed. Please check your profile.",
  "userIds": ["664a1b2c3d4e5f6a7b8c9d0e", "664a1b2c3d4e5f6a7b8c9d1f"]
}
```

**Response**
```json
{
  "status": 200,
  "message": "Notification broadcast sent",
  "data": { "sent": 1240 }
}
```

> `sent` is the count of in-app notifications created. FCM pushes run in the background.

---

## Common Error Responses

```json
{ "status": 401, "message": "Unauthorised" }
{ "status": 403, "message": "Forbidden" }
{ "status": 404, "message": "User not found" }
{ "status": 400, "message": "Invalid role. Valid roles: user, seller, admin" }
{ "status": 409, "message": "A user with this email already exists" }
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
| GET | `/admin/verifications` | List provider verification payments |
| PATCH | `/admin/verifications/:userId/verify` | Manually verify/unverify provider |
| GET | `/admin/business-verifications` | List business verification requests |
| PATCH | `/admin/business-verifications/:id/approve` | Approve business verification |
| PATCH | `/admin/business-verifications/:id/reject` | Reject business verification |
| GET | `/admin/staff` | List all subadmins |
| POST | `/admin/staff` | Create subadmin |
| PATCH | `/admin/staff/:id/permissions` | Update subadmin permissions |
| DELETE | `/admin/staff/:id` | Delete subadmin |
| GET | `/admin/contacts` | List contact messages |
| GET | `/admin/waitlist` | List waitlist entries |
| POST | `/admin/notifications/broadcast` | Broadcast notification |
