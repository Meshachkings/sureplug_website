# SurePlug Frontend API Reference

Base URL: `https://api.sureplug.com` (or local: `http://localhost:3000`)

All authenticated requests require:
```
Authorization: Bearer <token>
```

---

## Auth

### Register
`POST /auth/register`

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "08012345678",
  "password": "Password123!",
  "accountType": "customer"
}
```

| Field | Required | Values | Description |
|-------|----------|--------|-------------|
| `firstName` | Yes | string | |
| `lastName` | Yes | string | |
| `email` | Yes | string | |
| `phone` | Yes | string | |
| `password` | Yes | string | |
| `accountType` | No | `customer`, `handyman`, `business` | Defaults to `customer` |

Returns user object. An OTP is sent to the email — call **Verify OTP** next.

---

### Verify OTP
`POST /auth/verify-otp`

```json
{ "email": "john@example.com", "code": "123456" }
```

---

### Resend OTP
`POST /auth/resend-otp`

```json
{ "email": "john@example.com" }
```

---

### Login
`POST /auth/login`

```json
{ "email": "john@example.com", "password": "Password123!" }
```
Returns `{ token, user }`. Store the token for authenticated requests.

---

### Forgot Password
`POST /auth/forgot-password`

```json
{ "email": "john@example.com" }
```
Sends a reset OTP to the email.

---

### Verify Forgot Password OTP
`POST /auth/verify-forgot-password`

```json
{ "email": "john@example.com", "code": "123456" }
```

---

### Reset Password
`PATCH /auth/reset-password`

```json
{ "email": "john@example.com", "otp": "123456", "password": "NewPass123!" }
```

---

### Change Password `🔒 Auth required`
`PATCH /auth/change-password`

```json
{ "password": "NewPass123!" }
```

---

### Check Email Exists
`POST /auth/email-exists`

```json
{ "email": "john@example.com" }
```
Returns `true` or `false`.

---

## Services (Public)

### Browse Services
`GET /services/public`

No auth required. Supports query params:

| Param | Type | Description |
|---|---|---|
| `search` | string | Search by title |
| `category` | string | Filter by category ID |
| `state` | string | Filter by state |
| `country` | string | Filter by country |
| `suretag` | string | Show only services from a specific provider |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |

**Examples:**
```
GET /services/public
GET /services/public?search=plumber&state=Lagos
GET /services/public?suretag=john4x2k
GET /services/public?category=<categoryId>&page=2&limit=20
```

Each service in the response includes a `provider` object with the provider's details.

**Response:**
```json
{
  "status": 200,
  "data": {
    "services": [
      {
        "_id": "...",
        "title": "Home Plumbing",
        "description": "...",
        "price": 5000,
        "state": "Lagos",
        "images": [...],
        "categoryId": { "_id": "...", "name": "Plumbing" },
        "reviewCount": 12,
        "averageRating": 4.5,
        "provider": {
          "_id": "...",
          "firstName": "John",
          "lastName": "Doe",
          "avatar": { "url": "..." },
          "suretag": "john4x2k",
          "providerVerified": true
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 42,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

## Provider Profile

Both endpoints are **public** — no auth required.

### Get Provider by Suretag
`GET /users/provider/:suretag`

```
GET /users/provider/john4x2k
```

### Get Provider by ID
`GET /users/provider/id/:id`

```
GET /users/provider/id/64a1f2e3b4c5d6e7f8a9b0c1
```

**Both return the same shape:**
```json
{
  "status": 200,
  "message": "Service provider fetched successfully",
  "data": {
    "provider": {
      "_id": "673732778a16b708d63f4bb5",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1234567892",
      "dob": "1998-07-15",
      "role": "seller",
      "bio": "Hi, i'm new here",
      "suretag": "john4x2k",
      "avatar": {
        "url": "https://res.cloudinary.com/.../avatar.png",
        "fileName": "...",
        "size": 421757,
        "type": "image/png"
      },
      "location": null,
      "verified": true,
      "providerVerified": false,
      "createdAt": "2024-11-15T11:37:27.804Z",
      "updatedAt": "2025-05-03T10:54:14.262Z"
    },
    "stats": {
      "serviceCount": 3,
      "orderCount": 1,
      "reviewCount": 5,
      "averageRating": 2.6
    },
    "services": [
      {
        "_id": "67e2a63bc0aa160363e14ff8",
        "title": "Plumbing company ltd",
        "description": "we offer all plumbing services, including repair and replacements",
        "address": "Ikeja, lagos nigeria.",
        "state": "Lagos",
        "country": "Nigeria",
        "price": 5000,
        "images": [
          {
            "url": "https://res.cloudinary.com/.../image.jpg",
            "filename": "...",
            "type": "image/jpeg",
            "size": 28072
          }
        ],
        "categoryId": {
          "_id": "67e29a03896df267979aa87d",
          "name": "Plumbing",
          "description": "Fixing leaks, clogged drains, and pipe issues.",
          "image": { "url": "..." }
        },
        "reviews": [
          {
            "_id": "...",
            "rating": 5,
            "comment": "Excellent service, highly recommended!",
            "createdAt": "2025-04-30T15:18:50.773Z",
            "user": {
              "_id": "...",
              "firstName": "Jane",
              "lastName": "Smith",
              "avatar": { "url": "..." }
            }
          }
        ],
        "reviewCount": 5,
        "orderCount": 1,
        "averageRating": 2.6,
        "createdAt": "2025-03-25T12:48:59.664Z",
        "updatedAt": "2025-03-25T12:48:59.664Z"
      }
    ]
  }
}
```

> Services with no reviews will have `reviews: []`, `reviewCount: 0`, `orderCount: 0`, `averageRating: 0`.

> **Suretag** is a short, memorable handle auto-generated when a user becomes a provider (e.g. `john4x2k`). Providers can update it via `PATCH /users/suretag`. Use suretags to build shareable profile links: `sureplug.com/p/john4x2k`.

---

## User Object Schema

All authenticated user responses include these fields:

```json
{
  "_id": "664a1b2c3d4e5f6a7b8c9d0e",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "08012345678",
  "role": "user",
  "accountType": "customer",
  "bio": "Hi, i'm new here",
  "suretag": null,
  "verified": true,
  "isBlocked": false,
  "providerVerified": false,
  "providerVerificationExpiresAt": null,
  "businessVerified": false,
  "autoRenewEnabled": false,
  "avatar": null,
  "location": null,
  "createdAt": "2025-11-01T10:00:00.000Z",
  "updatedAt": "2026-06-10T08:22:11.000Z"
}
```

| Field | Description |
|-------|-------------|
| `role` | `user`, `seller`, `subadmin`, `admin` |
| `accountType` | `customer`, `handyman`, `business` — the user's account category |
| `providerVerified` | Monthly provider verification badge (sellers only) |
| `businessVerified` | Premium business account badge — set after admin approves business verification |

---

## Update Profile `🔒 Auth required`
`PUT /users/`

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "08012345678",
  "dob": "1995-08-20",
  "bio": "Professional plumber with 10 years experience",
  "accountType": "handyman"
}
```

All fields are optional. `accountType` must be one of `customer`, `handyman`, `business`.

---

## Become a Provider `🔒 Auth required`
`POST /users/become-provider`

No body needed. Upgrades the user's role to `seller` and auto-generates a suretag if they don't have one.

```json
{
  "status": 200,
  "message": "You are now a service provider",
  "data": { "suretag": "john4x2k", "role": "seller", ... }
}
```

---

## Switch Role `🔒 Auth required`
`PATCH /users/role`

Toggles between `user` (buyer view) and `seller` (provider view). The user must have already completed **become-provider** before they can switch to `seller`.

**Body**
```json
{ "role": "seller" }
```

| Value | Requirement |
|-------|-------------|
| `"user"` | Always allowed |
| `"seller"` | Requires the user to have a suretag (must have completed become-provider) |

**Response**
```json
{
  "status": 200,
  "message": "Role switched successfully",
  "data": { "role": "seller", ... }
}
```

---

## Update Suretag `🔒 Auth required`
`PATCH /users/suretag`

```json
{ "suretag": "mynewtag" }
```
Must be unique. Lowercase, trimmed automatically.

---

## Business Verification `🔒 Auth required`

A one-time premium upgrade. The user pays a fee, uploads business documents, then waits for admin approval. On approval, `businessVerified` is set to `true` on the user's profile.

**Status flow:** `awaiting_payment` → `awaiting_documents` → `pending_review` → `approved | rejected`

### Step 1 — Initialize Payment
`POST /business-verification/initialize`

No body required. Returns a Paystack payment session.

**Response**
```json
{
  "status": 200,
  "message": "Business verification payment initialized",
  "data": {
    "authorization_url": "https://checkout.paystack.com/xxxx",
    "access_code": "xxxx",
    "reference": "bizverify_664a1b2c_a1b2c3",
    "amount": 10000
  }
}
```

Redirect the user to `authorization_url` to complete payment.

---

### Step 2 — Confirm Payment
`GET /business-verification/confirm/:reference`

Call this after Paystack redirects back, using the `reference` from Step 1.

**Response**
```json
{
  "status": 200,
  "message": "Payment confirmed. Please submit your business documents.",
  "data": {
    "status": "awaiting_documents"
  }
}
```

---

### Step 3 — Submit Documents
`POST /business-verification/submit`

`Content-Type: multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `businessName` | string (form field) | Yes | Official business name |
| `documents` | file(s) | Yes | Up to 5 files (CAC, certificates, etc.) |

**Response**
```json
{
  "status": 200,
  "message": "Documents submitted. Your application is under review.",
  "data": {
    "businessName": "John's Plumbing Ltd",
    "status": "pending_review",
    "documents": [
      { "path": "https://res.cloudinary.com/...", "filename": "cac.pdf", "size": 204800, "mimetype": "application/pdf" }
    ]
  }
}
```

---

### Check Status
`GET /business-verification/status`

Returns the user's current business verification record.

**Response**
```json
{
  "status": 200,
  "message": "Business verification status fetched",
  "data": {
    "_id": "672a1b2c3d4e5f6a7b8c9d0e",
    "businessName": "John's Plumbing Ltd",
    "status": "pending_review",
    "paymentStatus": "success",
    "paidAt": "2026-06-20T10:00:00.000Z",
    "adminNote": null,
    "documents": [ { "path": "...", "filename": "cac.pdf" } ],
    "createdAt": "2026-06-20T09:55:00.000Z"
  }
}
```

**Status values and what to show:**

| Status | UI message |
|--------|-----------|
| `awaiting_payment` | Payment not yet completed |
| `awaiting_documents` | Payment done — prompt user to upload documents |
| `pending_review` | Submitted — waiting for admin review |
| `approved` | Verified — `businessVerified: true` on user profile |
| `rejected` | Rejected — show `adminNote` for the reason |
