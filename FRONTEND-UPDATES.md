# SurePlug Frontend Integration Guide

Recent backend changes for the mobile/web frontend. Base URL:

```
https://api.sureplug.com/api/v1
```

Local: `http://localhost:3002/api/v1`

All authenticated requests:

```
Authorization: Bearer <token>
```

Standard response shape:

```json
{
  "message": "Human-readable message",
  "status": 200,
  "data": {}
}
```

Errors return `{ "message": "...", "status": 4xx }` without `data`.

---

## Table of contents

1. [Breaking changes summary](#breaking-changes-summary)
2. [User badges: verified vs premium](#user-badges-verified-vs-premium)
3. [User object fields](#user-object-fields)
4. [Premium subscription](#premium-subscription)
5. [Business verification (verified badge)](#business-verification-verified-badge)
6. [Service provider profile](#service-provider-profile)
7. [Service search & listings](#service-search--listings)
8. [Dispute management](#dispute-management)
9. [Notifications](#notifications)
10. [Admin panel (disputes)](#admin-panel-disputes)

---

## Breaking changes summary

| Before | After |
|--------|-------|
| `providerVerified` on user = monthly subscription badge | **Removed from API responses** |
| Monthly `/verification/*` payment = verified badge | Monthly payment = **premium subscription** (`isPremium`) |
| `businessVerified` = optional premium label | `businessVerified` / `isVerified` = **verified badge** |
| Service listings sorted by newest only | **Premium providers appear first**, then by newest |
| No disputes API | Full **dispute management** for users |

### Frontend migration checklist

- [ ] Replace `providerVerified` badge logic with `isVerified` (or `businessVerified`)
- [ ] Show premium benefits using `isPremium` / `premiumExpiresAt`
- [ ] Update premium subscription screens to read `isPremium` from `/verification/status`
- [ ] Add dispute flows for customers and providers
- [ ] Expect `provider.isPremium` and `provider.isVerified` on service listing responses

---

## User badges: verified vs premium

Two separate concepts. Do not conflate them in the UI.

| Badge / tier | How it is earned | API fields | User-facing benefit |
|--------------|------------------|------------|---------------------|
| **Verified badge** | Pay business verification fee → upload documents → **admin approves** | `isVerified`, `businessVerified` | Trust badge on profile |
| **Premium subscription** | Monthly Paystack payment via `/verification/*` | `isPremium`, `premiumExpiresAt` | Appears **first** in service search/browse results |

A provider can be:
- Neither verified nor premium
- Premium only
- Verified only
- Both verified and premium

---

## User object fields

Returned on **login**, **register**, **profile**, and anywhere the user is sanitized.

### New / changed fields

| Field | Type | Description |
|-------|------|-------------|
| `isVerified` | `boolean` | Verified badge (from business verification approval) |
| `businessVerified` | `boolean` | Same as `isVerified` |
| `isPremium` | `boolean` | Active premium subscription |
| `premiumExpiresAt` | `string \| null` | ISO date when premium expires |

### Removed from API responses

| Field | Notes |
|-------|-------|
| `providerVerified` | Internal DB field — no longer returned |
| `providerVerificationExpiresAt` | Use `premiumExpiresAt` instead |
| `paystackAuthorizationCode` | Never exposed |

### Example user object

```json
{
  "_id": "...",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "role": "seller",
  "suretag": "johnplug",
  "accountType": "handyman",
  "isVerified": false,
  "businessVerified": false,
  "isPremium": true,
  "premiumExpiresAt": "2026-08-06T10:00:00.000Z"
}
```

---

## Premium subscription

Routes are still under `/verification/*` (path unchanged; semantics are now **premium**, not verified badge).

All routes require auth.

### Get premium status

`GET /verification/status`

**Response `data`:**

```json
{
  "role": "seller",
  "isServiceProvider": true,
  "isPremium": true,
  "premiumExpiresAt": "2026-08-06T10:00:00.000Z",
  "daysUntilExpiry": 28,
  "needsRenewal": false,
  "canRenew": false,
  "requiresPayment": false,
  "monthlyAmount": 5000,
  "autoRenewEnabled": true,
  "hasSavedPaymentMethod": true,
  "isVerified": false
}
```

| Field | Description |
|-------|-------------|
| `isPremium` | Whether premium is currently active |
| `premiumExpiresAt` | Expiry date |
| `needsRenewal` | Premium expired but user had it before |
| `canRenew` | Can initiate renewal (expired or within 7 days of expiry) |
| `requiresPayment` | First-time premium — call `/verification/initialize` |
| `monthlyAmount` | Amount in NGN (default ₦5,000) |
| `isVerified` | Verified badge status (separate from premium) |

### First-time subscribe

`POST /verification/initialize`

```json
{ "callbackUrl": "https://yourapp.com/premium/callback" }
```

Returns Paystack `authorization_url`, `reference`, `amount`, etc.

### Confirm payment

`GET /verification/confirm/:reference`

**Response `data`:**

```json
{
  "isPremium": true,
  "premiumExpiresAt": "2026-08-06T10:00:00.000Z",
  "autoRenewEnabled": true
}
```

### Renew premium

`POST /verification/renew`

```json
{ "callbackUrl": "https://yourapp.com/premium/callback" }
```

Available when `canRenew` is `true`.

### Toggle auto-renew

`PATCH /verification/auto-renew`

```json
{ "enabled": true }
```

Requires a saved reusable card from a previous Paystack payment.

---

## Business verification (verified badge)

Flow is unchanged. On **admin approval**, user gets the verified badge.

| Step | Method | Path |
|------|--------|------|
| 1. Pay fee | `POST` | `/business-verification/initialize` |
| 2. Confirm payment | `GET` | `/business-verification/confirm/:reference` |
| 3. Upload documents | `POST` | `/business-verification/submit` |
| 4. Check status | `GET` | `/business-verification/status` |

After approval: `isVerified: true` and `businessVerified: true` on the user profile.

Show the **verified badge** using `isVerified`, not `isPremium`.

---

## Service provider profile

Full provider detail including stats, services, reviews, and order counts.

### By suretag (public, no auth)

`GET /users/provider/:suretag`

### By user ID (public, no auth)

`GET /users/provider/id/:id`

### Response shape

```json
{
  "provider": {
    "_id": "...",
    "firstName": "Jane",
    "lastName": "Doe",
    "suretag": "janeplug",
    "bio": "...",
    "avatar": { "url": "...", "fileName": "...", "size": 0, "type": "image/jpeg" },
    "role": "seller",
    "accountType": "handyman",
    "isVerified": true,
    "businessVerified": true,
    "isPremium": true,
    "premiumExpiresAt": "2026-08-06T10:00:00.000Z"
  },
  "stats": {
    "serviceCount": 2,
    "orderCount": 15,
    "reviewCount": 8,
    "averageRating": 4.5
  },
  "services": [
    {
      "_id": "...",
      "title": "Home Cleaning",
      "description": "...",
      "price": 5000,
      "categoryId": { "_id": "...", "name": "Cleaning" },
      "reviewCount": 5,
      "orderCount": 10,
      "averageRating": 4.8,
      "reviews": [
        {
          "_id": "...",
          "rating": 5,
          "comment": "Great service!",
          "createdAt": "2026-06-01T12:00:00.000Z",
          "user": {
            "_id": "...",
            "firstName": "Bob",
            "lastName": "Smith",
            "avatar": null
          }
        }
      ]
    }
  ]
}
```

### `stats` fields

| Field | Description |
|-------|-------------|
| `serviceCount` | Number of services listed |
| `orderCount` | Total bookings across all services |
| `reviewCount` | Total reviews across all services |
| `averageRating` | Overall average rating (0–5, 1 decimal) |

Each service in `services` includes its own `reviews`, `reviewCount`, `orderCount`, and `averageRating`.

---

## Service search & listings

Premium providers' services are sorted **first**. Within each group, newest services come first.

### Public browse (no auth)

`GET /services/public`

| Query param | Type | Description |
|-------------|------|-------------|
| `search` | string | Search by title or suretag |
| `category` | string | Category ID |
| `state` | string | State filter |
| `country` | string | Country filter |
| `suretag` | string | Filter to one provider |
| `page` | number | Default `1` |
| `limit` | number | Default `10`, max `100` |

### Authenticated browse (location-based)

`GET /services`

Uses the user's default address for `state` / `country`. Same query params as above plus `price`, `rating`.

### By category

`GET /services/category/:categoryId?page=1&limit=10`

### Provider object on each service

Service listings now include an enriched `provider` object:

```json
{
  "_id": "...",
  "title": "Plumbing Repair",
  "price": 8000,
  "provider": {
    "_id": "...",
    "firstName": "Jane",
    "lastName": "Doe",
    "suretag": "janeplug",
    "avatar": { "url": "..." },
    "isPremium": true,
    "premiumExpiresAt": "2026-08-06T10:00:00.000Z",
    "isVerified": true,
    "businessVerified": true
  }
}
```

Use `provider.isPremium` to show a premium indicator in search results. Premium providers already appear at the top of the list.

---

## Dispute management

All dispute routes require auth. Base path: `/disputes`.

### Dispute reasons

| Value | Label suggestion |
|-------|------------------|
| `service_not_delivered` | Service not delivered |
| `poor_quality` | Poor quality |
| `payment_issue` | Payment issue |
| `provider_no_show` | Provider no-show |
| `other` | Other |

### Dispute statuses

| Status | Meaning |
|--------|---------|
| `open` | Just opened, awaiting provider response or admin review |
| `under_review` | Admin is reviewing |
| `resolved_customer` | Resolved in customer's favor |
| `resolved_provider` | Resolved in provider's favor |
| `closed` | Closed without a sided resolution |

Active statuses (can still respond / add evidence): `open`, `under_review`.

---

### Open a dispute (customer only)

`POST /disputes`

**Content-Type:** `multipart/form-data`

| Field | Required | Description |
|-------|----------|-------------|
| `booking` | Yes | Booking ID |
| `reason` | Yes | One of the dispute reasons above |
| `description` | Yes | 10–2000 characters |
| `evidence` | No | File(s) — use field name `evidence` |

**Rules:**
- Only the **customer who made the booking** can open a dispute
- Booking must be `in_progress` or `completed`
- Only **one active dispute** per booking
- Provider is notified automatically

**Response `data`:** Full dispute object (see [Dispute object shape](#dispute-object-shape)).

---

### List my disputes

`GET /disputes?status=open&page=1&limit=10`

Returns disputes where the current user is either the **customer** (`raisedBy`) or the **provider**.

**Response `data`:**

```json
{
  "disputes": [ /* array of dispute objects */ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

### Get dispute detail

`GET /disputes/:id`

Only accessible to the customer or provider involved. Returns 403 for others.

---

### Provider respond (one time)

`POST /disputes/:id/respond`

**Content-Type:** `multipart/form-data`

| Field | Required | Description |
|-------|----------|-------------|
| `message` | Yes | 10–2000 characters |
| `evidence` | No | Additional file(s) |

**Rules:**
- Only the **provider** on the dispute
- Dispute must be `open` or `under_review`
- Provider can only respond **once**
- Customer is notified when provider responds

---

### Add evidence (customer or provider)

`POST /disputes/:id/evidence`

**Content-Type:** `multipart/form-data`

| Field | Required | Description |
|-------|----------|-------------|
| `evidence` | Yes | One or more files |

Only allowed while dispute is `open` or `under_review`.

---

### Dispute object shape

```json
{
  "_id": "...",
  "booking": {
    "_id": "...",
    "status": "completed",
    "description": "Need deep cleaning",
    "date": "2026-06-20T00:00:00.000Z",
    "time": "2026-06-20T10:00:00.000Z",
    "user": {
      "_id": "...",
      "firstName": "John",
      "lastName": "Doe",
      "avatar": null
    },
    "service": {
      "_id": "...",
      "title": "Home Cleaning",
      "userId": {
        "_id": "...",
        "firstName": "Jane",
        "lastName": "Provider"
      }
    },
    "address": { "street": "...", "city": "...", "state": "..." }
  },
  "raisedBy": {
    "_id": "...",
    "firstName": "John",
    "lastName": "Doe"
  },
  "provider": {
    "_id": "...",
    "firstName": "Jane",
    "lastName": "Provider"
  },
  "reason": "poor_quality",
  "description": "The service was not completed to the agreed standard.",
  "evidence": [
    {
      "path": "https://...",
      "filename": "photo.jpg",
      "size": 102400,
      "mimetype": "image/jpeg"
    }
  ],
  "providerResponse": null,
  "providerRespondedAt": null,
  "status": "open",
  "adminNote": null,
  "resolution": null,
  "reviewedBy": null,
  "reviewedAt": null,
  "createdAt": "2026-07-06T12:00:00.000Z",
  "updatedAt": "2026-07-06T12:00:00.000Z"
}
```

After provider responds, `providerResponse` and `providerRespondedAt` are set. After admin resolves, `resolution`, `reviewedBy`, and `reviewedAt` are set.

---

### Suggested UI flows

**Customer:**
1. On booking detail (`in_progress` or `completed`) → "Open dispute" button
2. Form: reason picker, description, optional photo uploads
3. Disputes list screen with status filter
4. Dispute detail → view provider response, add more evidence while active

**Provider:**
1. Notification on new dispute
2. Disputes list (filter by status)
3. Dispute detail → one-time response form + optional evidence
4. View final resolution when admin closes

---

## Notifications

Disputes use `notificationType: "dispute"`. The `notificationTypeId` is the dispute `_id`.

FCM `data.type` values for disputes:

| `data.type` | When |
|-------------|------|
| `dispute_opened` | Customer opened dispute (sent to provider) |
| `dispute_response` | Provider responded (sent to customer) |

In-app notifications are also sent on status changes and resolution (no specific FCM type documented for those — refresh disputes list on notification tap).

---

## Admin panel (disputes)

For the admin dashboard frontend. Requires `Authorization: Bearer <admin_token>` and role `admin` or `subadmin` with `manage_disputes` permission.

### List disputes

`GET /admin/disputes?status=open&page=1&limit=10`

### Get dispute detail

`GET /admin/disputes/:id`

### Move to under review / close

`PATCH /admin/disputes/:id/status`

```json
{
  "status": "under_review",
  "adminNote": "Optional internal note"
}
```

Allowed statuses for this endpoint: `under_review`, `closed`.

### Resolve dispute

`PATCH /admin/disputes/:id/resolve`

```json
{
  "status": "resolved_customer",
  "resolution": "Refund issued to customer based on evidence provided.",
  "adminNote": "Optional internal note"
}
```

Allowed resolution statuses: `resolved_customer`, `resolved_provider`, `closed`.

Both parties are notified on status change and resolution.

### Staff permission

Subadmins need `manage_disputes` in their permissions array. Full admins have access automatically.

---

## Quick reference: all new/changed endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/verification/status` | Yes | Premium + verified status |
| `POST` | `/verification/initialize` | Yes | Start premium subscription |
| `POST` | `/verification/renew` | Yes | Renew premium |
| `GET` | `/verification/confirm/:reference` | Yes | Confirm premium payment |
| `PATCH` | `/verification/auto-renew` | Yes | Toggle auto-renew |
| `GET` | `/users/provider/:suretag` | No | Full provider profile |
| `GET` | `/users/provider/id/:id` | No | Full provider profile by ID |
| `GET` | `/services/public` | No | Browse (premium first) |
| `GET` | `/services` | Yes | Browse (premium first) |
| `GET` | `/services/category/:id` | Yes | By category (premium first) |
| `POST` | `/disputes` | Yes | Open dispute (customer) |
| `GET` | `/disputes` | Yes | List my disputes |
| `GET` | `/disputes/:id` | Yes | Dispute detail |
| `POST` | `/disputes/:id/respond` | Yes | Provider response |
| `POST` | `/disputes/:id/evidence` | Yes | Add evidence |
| `GET` | `/admin/disputes` | Admin | List all disputes |
| `GET` | `/admin/disputes/:id` | Admin | Dispute detail |
| `PATCH` | `/admin/disputes/:id/status` | Admin | Update status |
| `PATCH` | `/admin/disputes/:id/resolve` | Admin | Resolve dispute |
