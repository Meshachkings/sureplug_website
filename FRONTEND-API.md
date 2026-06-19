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
  "password": "Password123!"
}
```
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
  "data": {
    "provider": {
      "_id": "...",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "08012345678",
      "bio": "Professional plumber with 5 years experience",
      "avatar": { "url": "..." },
      "suretag": "john4x2k",
      "providerVerified": true,
      "role": "SELLER"
    },
    "stats": {
      "serviceCount": 3,
      "orderCount": 47,
      "reviewCount": 21,
      "averageRating": 4.6
    },
    "services": [
      {
        "_id": "...",
        "title": "Home Plumbing",
        "price": 5000,
        "categoryId": { "name": "Plumbing" },
        "reviewCount": 7,
        "orderCount": 15,
        "averageRating": 4.8,
        "reviews": [
          {
            "rating": 5,
            "comment": "Excellent work!",
            "createdAt": "2024-01-15T...",
            "user": {
              "firstName": "Jane",
              "lastName": "Smith",
              "avatar": { "url": "..." }
            }
          }
        ]
      }
    ]
  }
}
```

> **Suretag** is a short, memorable handle auto-generated when a user becomes a provider (e.g. `john4x2k`). Providers can update it via `PATCH /users/suretag`. Use suretags to build shareable profile links: `sureplug.com/p/john4x2k`.

---

## Become a Provider `🔒 Auth required`
`POST /users/become-provider`

No body needed. Upgrades the user's role to `SELLER` and auto-generates a suretag if they don't have one.

```json
{
  "status": 200,
  "message": "You are now a service provider",
  "data": { "suretag": "john4x2k", "role": "SELLER", ... }
}
```

---

## Update Suretag `🔒 Auth required`
`PATCH /users/suretag`

```json
{ "suretag": "mynewtag" }
```
Must be unique. Lowercase, trimmed automatically.
