# InPact — Backend API Routes

This document tracks all backend routes required to replace the mock data in each frontend page/component.

---

## Pages Built So Far

- `GroupsPage` — Lists all groups a user has joined
- `GroupDetailPage` — Detailed view of a single group (heatmap, stats, squad status, leaderboard, calendar)

---

## Auth (required by all routes)

All routes below assume a logged-in user and expect a JWT in the `Authorization: Bearer <token>` header.

---

## 1. Groups List Page (`GroupsPage`)

### `GET /api/groups`
Returns all groups the authenticated user is a member of.

**Response:**
```json
[
  {
    "id": "g1",
    "name": "100 Days of Code",
    "type": "GitHub",
    "memberCount": 1420
  }
]
```

**Used by:** Stats row (count, total members, unique platforms), group card grid.

---

## 2. Group Detail Page (`GroupDetailPage`)

### `GET /api/groups/:groupId`
Returns top-level info about a group.

**Response:**
```json
{
  "id": "g1",
  "name": "100 Days of Code",
  "type": "GitHub",
  "groupStreak": 18,
  "consistency": 92,
  "level": 6,
  "xp": 2100,
  "xpNext": 3000
}
```

**Used by:** Page header, stat cards (streak, consistency, level/XP).

---

### `GET /api/groups/:groupId/members`
Returns all members of the group with their streak and XP stats.

**Response:**
```json
[
  {
    "id": "m1",
    "name": "Neha",
    "initials": "N",
    "color": "#7c3aed",
    "streak": 18,
    "consistency": 94,
    "xp": 2340,
    "checkedIn": true,
    "checkInTime": "06:14",
    "isCurrentUser": true
  }
]
```

**Used by:** `SquadStatus` (completed / yet-to-complete split), `Leaderboard` (rank by consistency + XP).

---

### `GET /api/groups/:groupId/activity`
Returns daily activity heatmap data for the group (past ~16 weeks).

**Response:**
```json
{
  "weeks": [
    [0, 1, 2, 3, 4, 3, 1],
    [2, 0, 1, 4, 3, 2, 0],
    ...
  ]
}
```

Each row is a week (7 days). Each value is 0–4 representing activity intensity.

> **Note:** For platform-specific streak data (GitHub contribution graph, CodeForces submissions, Duolingo XP), this route should aggregate activity from the respective 3rd-party API per member and reduce it to the group-level view. Could also be done client-side from member-level data.

**Used by:** `ActivityHeatmap`.

---

### `GET /api/groups/:groupId/calendar?year=2026&month=3`
Returns daily completion status for the group for a given month.

**Response:**
```json
{
  "year": 2026,
  "month": 3,
  "days": [
    { "day": 1,  "status": "all"     },
    { "day": 7,  "status": "partial" },
    { "day": 26, "status": "future"  }
  ]
}
```

`status` values:
- `"all"` — every member checked in ✅
- `"partial"` — some members checked in 🟡
- `"none"` — nobody checked in
- `"future"` — day hasn't happened yet

**Used by:** `StreakCalendar`.

---

## 3. Platform API Integrations (planned)

These will be called server-side to hydrate member streak data before returning it to the frontend.

| Platform    | API / Endpoint                              | Data Fetched              |
|-------------|---------------------------------------------|---------------------------|
| GitHub      | `https://github.com/users/:username/contributions` (scrape or use GH GraphQL API) | Contribution heatmap      |
| CodeForces  | `https://codeforces.com/api/user.status?handle=:handle` | Submission history        |
| Duolingo    | `https://www.duolingo.com/users/:username`  | Streak, XP, active days   |

> These should be fetched and cached server-side (e.g., Redis or in-DB) to avoid rate limits.

---

## Future Pages (to be tracked as built)

| Page / Component | Routes Needed |
|------------------|---------------|
| Home / Dashboard | `GET /api/users/me`, `GET /api/users/me/stats` |
| Check-in         | `POST /api/groups/:groupId/checkin` |
| Profile          | `GET /api/users/:userId`, `PATCH /api/users/me` |

---

## 3. Money Accountability System (Frontend: `AccountabilityPanel`, `GroupCard`)

### `POST /api/groups`
Create a new group (includes pact type and rules).

**Request body:**
```json
{
  "name": "100 Days of Code",
  "type": "GitHub",
  "pactType": "money",
  "depositAmount": 50,
  "penaltyPerMiss": 10
}
```

---

### `GET /api/groups/:groupId/stake`
Get the group's total stake pool and each member's current deposit balance.

**Response:**
```json
{
  "stakePool": 210,
  "members": [
    { "userId": "m1", "name": "Neha", "depositBalance": 40 }
  ]
}
```

---

### `GET /api/groups/:groupId/accountability`
Get the current week's circular accountability chain.

**Response:**
```json
{
  "weekStart": "2026-03-23",
  "chain": ["m1", "m2", "m3", "m4", "m5"],
  "yourPartnerId": "m2"
}
```

---

### `POST /api/groups/:groupId/checkin`
Record today's check-in for the authenticated user.

**Request body:**
```json
{
  "proofUrl": "https://github.com/neha/commit/abc123"
}
```

---

## 4. Wallet / Payments

### `POST /api/wallet/deposit`
Deposit money into a group (top-up or initial join deposit).

**Request body:**
```json
{ "groupId": "g1", "amount": 50 }
```

---

### `GET /api/wallet/balance`
Get the user's overall wallet: earnings received from accountability + remaining deposits.

**Response:**
```json
{
  "totalEarnings": 30,
  "deposits": [
    { "groupId": "g1", "balance": 40 }
  ]
}
```

---

### `POST /api/wallet/withdraw`
Withdraw earnings to bank account / UPI.

**Request body:**
```json
{ "amount": 30, "upiId": "neha@upi" }
```

---

## 5. Scheduled Jobs (Server-Side Cron)

| Job | Trigger | Action |
|-----|---------|--------|
| **Miss detection** | Daily 11:59 PM IST | Check all members; deduct `penaltyPerMiss` from balance; credit accountability partner |
| **Chain rotation** | Every Monday 00:00 IST | Rotate `accountabilityChain` array by 1 position |
| **Kick check** | After miss detection | Set `status: kicked` for members with `depositBalance <= 0`; remove from group |

> **Note (Hackathon):** For the demo, use a simulated in-app wallet — no real payment gateway needed. Razorpay can be integrated later for production.

