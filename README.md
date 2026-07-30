# VerifAI

**An AI-Driven Platform for Verifiable Skill Credentialing Through Real-World Code Challenges**

VerifAI replaces resume-based skill claims with verifiable proof of work. Users solve real-world engineering challenges in an in-browser code editor, submissions are executed in a sandboxed environment, and an AI evaluation engine reviews code quality, architecture, and robustness — generating structured feedback similar to a senior engineer's code review. Verified submissions earn badges on a public developer profile.

---

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS, Monaco Editor, Socket.io-client
**Backend:** Node.js, Express.js, JWT Auth, Bull (Redis queue), Socket.io
**Database:** MongoDB (Atlas)
**Code Execution:** Judge0 API
**AI Evaluation:** Gemini / Groq API
**Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas, Upstash Redis

---

## Project Structure

```
verifai/
├── client/                 # React frontend
└── server/                 # Express backend
    ├── config/             # DB connection, env config
    ├── controllers/        # Route logic
    ├── models/             # Mongoose schemas
    ├── routes/             # API route definitions
    ├── middleware/         # Auth, error handling
    ├── utils/              # Helper functions (Judge0 client, AI client)
    ├── .env.example
    ├── server.js
    └── package.json
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (free tier)
- Upstash Redis account (free tier)
- Judge0 API key (via RapidAPI, free tier)
- Gemini or Groq API key (free tier)

### Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Fill in your actual keys in .env
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Environment Variables

See `server/.env.example` for the full list of required variables.

---

## Team

| Name | Role |
|---|---|
| Kirtan Yadav | Backend (primary), shared frontend work |
| Harshit Tiwari | Frontend (primary), shared backend work |
| Kartik Sharma | Project originator — conceived the project idea and led AI workflow design |
| Krishna Gangrade | Project manager — coordinates the project and proposes new ideas and feature directions |

---

## Branching Strategy

- `main` — stable, demo-ready code only
- `dev` — integration branch, all features merge here first
- `feature/*` — individual feature branches, merged into `dev` via PR

---

## Project Phases

1. Auth + Core CRUD
2. Monaco Editor Integration
3. Judge0 Code Execution
4. Async Queue + Real-time Updates
5. AI Evaluation Layer
6. Public Profile + Badges
7. Deployment + Polish

---

## License

This project is built for academic/educational purposes.
