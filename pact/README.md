# Pact 🔥
> *Habits you can't ignore — because your squad is watching.*

A group-first, socially-aware habit tracking app with real stakes. Built at SNUC Hacks '26.

---

## 🧠 Concept
Pact transforms solo habits into shared commitments. Miss a day and your *whole squad* feels it — through lost group XP, redistributed stakes, and a public shame card. Backed by loss aversion theory, dyadic accountability, and social identity psychology.

---

## 📁 Project Structure

```
pact/
├── client/          # React + Vite + Tailwind + Framer Motion
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       └── utils/
│
└── server/          # Node.js + Express + MongoDB
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    └── utils/
```

---

## ⚙️ Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Frontend
```bash
cd client
npm install
npm run dev
```

### Backend
```bash
cd server
cp .env.example .env    # fill in your values
npm install
npm run dev
```

---

## 🌍 Environment Variables (server/.env)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `CLIENT_URL` | Frontend URL for CORS |
| `JWT_SECRET` | Secret for JWT tokens |

---

## ✨ Key Features
- 🔗 **Circular Accountability** — you're paired with the next person in the ring
- 💸 **Stake System** — upfront payment redistributed when you miss
- 📸 **Photo Check-ins** — daily proof with peer verification
- 🔥 **Group Streaks** — one miss resets everyone (real stakes)
- 🏅 **Badges & Levels** — visual progress across the group
- 🏆 **In-group Leaderboard** — ranked by consistency
- 🃏 **Shame Cards** — public miss notification to your squad
- 🛡️ **Vouching** — a pal can cover for you (limited uses)

---

## 👥 Team
Built with ❤️ for SNUC Hacks '26 — Track 1: Social Tech
