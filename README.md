<div align="center">

# VerifAI

**Verifiable engineering challenges — write code, run it, earn credentials.**

[![CI](https://github.com/harshit-tiwari-codebase/VerifAi/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/harshit-tiwari-codebase/VerifAi/actions)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)](https://redis.io)
[![License](https://img.shields.io/badge/license-Educational-blue)](#license)

</div>

---

VerifAI is a full-stack platform where developers solve engineering challenges, run code against test suites in a browser-based Monaco editor, and earn verifiable badges. AI-generated code review provides advisory feedback; only deterministic test results issue scores and badges — keeping evaluation honest and reproducible.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Design Decisions & Why](#design-decisions--why)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [CI & Testing](#ci--testing)
- [Deployment Guide](#deployment-guide)
- [Production Go-Live Checklist](#production-go-live-checklist)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Monaco Editor** — full IDE experience in the browser with syntax highlighting, autocomplete, and multi-language support
- **Secure auth** — JWT access tokens (in-memory) + httpOnly refresh cookies; email verification and password reset flows
- **Three challenge modes:**
  - `testcases` — score determined purely by automated test results
  - `both` — automated tests determine score; Gemini/Groq provides advisory AI code review
  - `review_only` — AI feedback only; no automated score or badge (requires human review)
- **Async job queue** — Bull + Redis queue handles code execution and AI evaluation without blocking HTTP
- **Real-time status** — Socket.IO pushes submission state (`queued → executing → evaluating → completed`) to the authenticated client
- **External code execution** — Judge0-compatible API; untrusted code never runs in the application process
- **AI redundancy** — Gemini (primary) → Groq (fallback) for AI code review
- **Rate limiting** — applied on auth endpoints, challenge writes, code runs, and submissions
- **Hidden test sanitization** — test case output stripped from client responses to prevent cheating

---

## Architecture

```
VerifAI/
├── .github/
│   └── workflows/ci.yml       # CI: build client + run server tests on dev/main
├── client/                    # React 18 + Vite — deployed on Vercel
│   ├── src/
│   │   ├── api/               # Axios API clients
│   │   ├── components/        # Shared UI, landing page, loader, Monaco wrapper
│   │   ├── features/          # Auth, challenge, submission Redux slices
│   │   └── pages/             # Route-level page components
│   └── .env.example
├── server/                    # Node.js 20 + Express 5 — deployed via Docker on Render
│   ├── src/
│   │   ├── config/            # MongoDB and Redis connection setup
│   │   ├── controllers/       # HTTP request handlers
│   │   ├── middlewares/       # Auth, validation, error handling
│   │   ├── models/            # Mongoose schemas (User, Challenge, Submission, Badge)
│   │   ├── queues/            # Bull queue definitions
│   │   ├── routes/            # Express routers
│   │   ├── tests/             # Node.js built-in test suite
│   │   ├── utils/             # Execution, scoring, mail, AI helpers
│   │   └── workers/           # Execution worker + AI evaluation worker
│   ├── .env.example
│   ├── Dockerfile
│   └── server.js
└── docker-compose.yml         # Local dev: MongoDB + Redis + backend
```

### Submission Flow

```
Client ──POST /submit──► Express API ──enqueue──► Bull Queue (Redis)
                                                        │
                                              Execution Worker
                                                        │
                                          Judge0-compatible API
                                          (runs code externally)
                                                        │
                                          AI Worker (if applicable)
                                          Gemini ──fallback──► Groq
                                                        │
                                          Results saved to MongoDB
                                                        │
                                    Socket.IO ──► Client (real-time)
```

**Execution safety:** the server never spawns untrusted code in a local child process. If the external provider is unavailable, execution fails with `provider_unavailable`.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | React, Vite, Tailwind CSS | 18 / 5 / 3 |
| State management | Redux Toolkit | latest |
| Code editor | Monaco Editor | latest |
| Animation | Framer Motion | latest |
| Backend | Node.js, Express | 20 / 5 |
| ORM / Database | Mongoose, MongoDB | 9 / 7.0 |
| Auth | JWT (`jsonwebtoken`), bcryptjs | — |
| Real-time | Socket.IO | 4 |
| Queue | Bull, Redis | 4 / 7 |
| Code execution | External Judge0-compatible API | — |
| AI feedback | Gemini (primary), Groq (fallback) | — |
| Email | Brevo transactional API | — |
| CI | GitHub Actions | — |
| Containerization | Docker, Docker Compose | — |

---

## Design Decisions & Why

These are the deliberate choices behind the architecture — not defaults, but decisions made for specific reasons.

### 1. JWT in-memory + httpOnly Refresh Cookie

Access tokens live only in JavaScript memory (Redux store) — never in `localStorage` or a cookie. Refresh tokens are stored in `httpOnly`, `Secure`, `SameSite=None` cookies, invisible to JavaScript entirely.

**Why:** `localStorage` is readable by any JavaScript on the page, making XSS attacks trivially dangerous. This token strategy means even a successful XSS attack cannot steal refresh tokens. Access tokens expire in 15 minutes; refresh tokens in 7 days. It's the most XSS-resistant auth pattern for browser-based SPAs without requiring a BFF layer.

---

### 2. Bull Queue + Redis for Async Processing

Code submissions are enqueued into a Bull queue backed by Redis. Workers pick them up asynchronously — execution and AI review happen entirely outside the HTTP request cycle.

**Why:** Code execution can take seconds or even minutes depending on the test suite. Blocking an HTTP request for that long is untenable — it ties up server connections, causes timeouts, and degrades UX for every user. The queue decouples submission acceptance from evaluation, making the system resilient to spikes and provider slowdowns. Bull also gives retry logic, job state tracking, and failure isolation for free.

---

### 3. External Judge0 — Never Execute Code Locally

The server sends candidate code to an external Judge0-compatible API. No user code runs inside the application server process.

**Why:** Running untrusted code in the same process (or even the same machine) as your database credentials, JWT secrets, and API keys is a catastrophic security risk — even in sandboxed `vm` contexts. Offloading to a purpose-built code execution sandbox (Judge0) makes the security boundary explicit and enforceable. The tradeoff is external API dependency — if the provider goes down, `provider_unavailable` is returned. That's a better failure mode than a compromised server.

---

### 4. Gemini Primary → Groq Fallback for AI Review

The AI code review pipeline tries Gemini first. If Gemini fails (rate limit, quota, network error), it automatically retries with Groq.

**Why:** AI providers have outages, rate limits, and quota ceilings — especially during traffic spikes. A single-provider dependency means AI review is as reliable as that provider's uptime. The fallback adds one more dependency but buys redundancy where the failure is silent and graceful rather than a visible error to the user.

---

### 5. Docker Only for the Backend

`docker-compose.yml` containerizes MongoDB, Redis, and the Express server. The React frontend runs directly on the host (`npm run dev`) in development and is deployed to Vercel (static CDN) in production — no Docker for the client.

**Why:** The backend has stateful infrastructure dependencies (Mongo, Redis) that need consistent configuration across dev machines and deployment environments. Docker makes that reproducible. The frontend is a static build artifact — no persistent state, no platform dependencies. Vite dev server and Vercel's CDN handle it perfectly. Adding a Docker layer for a static SPA would add complexity with zero benefit.

---

### 6. Alpine-based Docker Images

Both `mongo:7.0` and `redis:7-alpine` use minimal Alpine Linux base images.

**Why:** Alpine images are drastically smaller than full Debian/Ubuntu images — Redis Alpine is ~30 MB vs ~130 MB. Smaller images mean faster pulls in CI, smaller attack surfaces (fewer installed packages = fewer CVEs), and lower container startup time. For databases in development and staging, this is a straightforward win.

---

### 7. Monaco Editor

The code editor in the challenge UI is Microsoft's Monaco Editor — the same engine that powers VS Code.

**Why:** Browser-based `<textarea>` elements are inadequate for a coding platform. Monaco provides syntax highlighting, language-aware autocomplete, multi-cursor editing, keyboard shortcuts developers already know, and proper tab/indentation handling. It signals to developers that the platform is serious about the coding experience. The bundle is heavier than a simple textarea, but for a code-evaluation platform, the UX tradeoff is clear.

---

### 8. NeoLeaf-style Liquid Preloader

The landing page starts with a full-screen black preloader featuring the `verifai.` wordmark with a dark violet animated liquid gradient masked through the text. A smooth cross-fade reveals the actual landing page after the loader exits.

**Why:** The first impression sets the tone of the entire product. An immediate hard cut to the landing page (especially on slow connections) feels unpolished. The loader serves two functions: it masks the asset loading delay naturally, and it introduces the brand identity before anything else is visible. The violet gradient inside the text mask was chosen specifically because it's subtle — it gives the wordmark life without being flashy or clashing with the predominantly black aesthetic.

> **Production note:** `client/src/App.jsx` currently has `once={false}` on the `AnimatePresence` for development testing purposes. Change this to `once={true}` before deploying to production to prevent the loader from replaying on in-app navigation.

---

## Local Development

### Option A — Docker Compose (Recommended)

Starts MongoDB, Redis, and the backend in containers. Frontend runs on the host.

```powershell
# 1. Set up backend env
Copy-Item server\.env.example server\.env
# Edit server/.env — add JWT secrets, Judge0 key, Gemini/Groq key, etc.

# 2. Start all services
docker compose up --build

# 3. In a new terminal, start the frontend
cd client
npm ci
Copy-Item .env.example .env
# Edit client/.env → VITE_API_BASE_URL=http://localhost:3001/api
npm run dev
```

Frontend: `http://localhost:5173` | Backend: `http://localhost:3001`

To stop: `docker compose down`  
To also wipe database volumes: `docker compose down --volumes`

---

### Option B — Run Directly

Start MongoDB and Redis separately (local installs or cloud), then:

```powershell
# Backend
cd server
npm ci
Copy-Item .env.example .env
# Edit .env with MONGO_URI, REDIS_URL, and all other required vars
npm run dev

# Frontend (new terminal)
cd client
npm ci
Copy-Item .env.example .env
npm run dev
```

---

### Commands Reference

| Directory | Command | Purpose |
|---|---|---|
| `server/` | `npm run dev` | Start API with nodemon (hot reload) |
| `server/` | `npm start` | Start API (production) |
| `server/` | `npm test` | Run backend test suite |
| `client/` | `npm run dev` | Start Vite dev server |
| `client/` | `npm run build` | Production build → `dist/` |
| `client/` | `npm run preview` | Preview production build locally |

---

## Environment Variables

> **Never commit `.env` files.** Only `.env.example` files belong in version control.

### Backend: `server/.env`

| Variable | Required | Description |
|---|:---:|---|
| `PORT` | hosting | HTTP port. Defaults to `5000` if unset. Set to whatever your host requires. |
| `NODE_ENV` | production | Set to `production`. Enables secure cookies and production logging. |
| `CLIENT_URL` | ✅ | Exact frontend origin (e.g. `https://your-app.vercel.app`). No path, no trailing slash. Used for CORS, Socket.IO, and password-reset links. |
| `API_URL` | email links | Public backend origin without `/api` suffix. Used to generate verification and reset URLs. |
| `MONGO_URI` | ✅ | MongoDB connection string. Use a managed cluster with TLS in production. |
| `REDIS_URL` | ✅ | Redis connection string. Use `rediss://` when the provider requires TLS. |
| `ACCESS_TOKEN_SECRET` | ✅ | High-entropy secret for short-lived access JWTs. Must differ from refresh secret. |
| `REFRESH_TOKEN_SECRET` | ✅ | High-entropy secret for refresh JWTs. Must differ from access secret. |
| `ACCESS_TOKEN_EXPIRY` | — | Access token lifetime. Defaults to `15m`. |
| `REFRESH_TOKEN_EXPIRY` | — | Refresh token lifetime. Defaults to `7d`. |
| `COOKIE_SAME_SITE` | deployment | Override refresh-cookie SameSite. Production defaults to `none` (requires HTTPS). |
| `JUDGE0_API_URL` | code runs | Base URL of the Judge0-compatible provider. |
| `RAPIDAPI_KEY` | code runs | RapidAPI key if routing through RapidAPI. |
| `JUDGE0_API_KEY` | code runs | Alternate key variable accepted by the execution layer. |
| `RAPIDAPI_HOST` | — | Defaults to `judge0-ce.p.rapidapi.com`. |
| `GEMINI_API_KEY` | ✅ (one AI) | Primary AI review provider. |
| `GROQ_API_KEY` | ✅ (one AI) | Fallback AI review provider. |
| `BADGE_SCORE_THRESHOLD` | — | Minimum score for badge eligibility. Defaults to `70`. |
| `BREVO_API_KEY` | email | Brevo transactional email API key. |
| `BREVO_SENDER_EMAIL` | email | Verified sender address. Falls back to `FROM_EMAIL`. |
| `BREVO_SENDER_NAME` | — | Sender display name. Falls back to `FROM_NAME`, then `VerifAI`. |
| `FROM_EMAIL` | email | Fallback sender address. |
| `FROM_NAME` | — | Fallback sender display name. |

Generate secure secrets:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### Frontend: `client/.env`

| Variable | Required | Description |
|---|:---:|---|
| `VITE_API_BASE_URL` | ✅ | Backend API base URL including `/api`. E.g. `https://your-api.render.com/api`. **Set before building.** Vite bakes this value into the static bundle. |

---

## API Reference

All routes are mounted under `/api`.

| Method | Path | Auth | Description |
|---|---|:---:|---|
| `GET` | `/` | — | Backend liveness check |
| `GET` | `/api/health/diagnostics` | — | MongoDB, Redis, AI, and execution provider status |
| `POST` | `/api/auth/register` | — | Register a new user |
| `POST` | `/api/auth/login` | — | Sign in, receive access token + set refresh cookie |
| `POST` | `/api/auth/refresh` | cookie | Exchange refresh cookie for a new access token |
| `POST` | `/api/auth/logout` | ✅ | Clear auth cookies |
| `GET` | `/api/auth/me` | ✅ | Get the current authenticated user |
| `GET` | `/api/challenges` | — | List all available challenges |
| `GET` | `/api/challenges/:id` | — | Get challenge details |
| `POST` | `/api/challenges/:id/run` | ✅ | Run code against public tests (no score, no badge) |
| `POST` | `/api/challenges/:id/submit` | ✅ | Submit code for evaluation |
| `GET` | `/api/submissions` | ✅ | Get submission history for the current user |
| `GET` | `/api/submissions/:id` | ✅ | Get a specific submission (owner only) |

For exact request/response shapes and validation rules, see `server/src/routes/` and `server/src/controllers/`.

---

## CI & Testing

```powershell
# Run backend tests
cd server
npm test

# Build frontend (mimics what CI does)
cd client
npm ci
npm run build
```

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on pushes and PRs targeting `dev` or `main`:

1. Install client dependencies and run a production build
2. Install server dependencies and run the test suite

**CD is not configured.** Hosting providers (Vercel for client, Render for server) are configured to deploy from `main` independently. Do not add production secrets to workflow YAML.

---

## Deployment Guide

The intended production setup: **Vercel** (frontend static CDN) + **Render** (backend, Docker) + **MongoDB Atlas** + **Managed Redis** + **external Judge0 provider**.

### 1. Provision Managed Services

- MongoDB Atlas cluster — create a DB user with minimum required permissions; enable TLS and IP allowlisting
- Managed Redis (Upstash, Redis Cloud, or Render Redis) — enable TLS
- Judge0 provider — confirm the deployed backend can reach it and that the plan covers your expected submission volume
- Gemini API key (Google AI Studio) + optionally Groq API key
- Brevo account — verify sender domain/email

### 2. Deploy the Backend (Render)

- **Repository:** this repo
- **Root directory:** `server`
- **Runtime:** Docker (Render auto-detects `Dockerfile`)
- **Health check path:** `/`
- Set all backend environment variables in Render's environment settings
- Set `CLIENT_URL` to the final Vercel frontend URL
- Set `API_URL` to the final Render backend URL (no `/api` suffix)
- Use Atlas and managed Redis URLs — not `localhost`

### 3. Deploy the Frontend (Vercel)

- **Root directory:** `client`
- **Build command:** `npm ci && npm run build`
- **Output directory:** `dist`
- Set `VITE_API_BASE_URL` to `https://your-api.render.com/api`
- Enable SPA fallback to `index.html` (Vercel does this automatically via `vercel.json`)
- Trigger a redeploy after any change to frontend environment variables

### 4. Smoke Test

1. `GET /` → returns `VerifAI API is running`
2. `GET /api/health/diagnostics` → all services green
3. Register → verify email → login → navigate protected pages
4. Submit a code solution → watch it move through `queued → executing → evaluating → completed`
5. Verify badge issuance works on a passing, above-threshold submission
6. Confirm AI review appears for `both`-type challenges
7. Check Render logs and Atlas metrics under load

---

## Production Go-Live Checklist

- [ ] Frontend and backend both served over HTTPS
- [ ] `CLIENT_URL` matches the exact production frontend origin
- [ ] `VITE_API_BASE_URL` points to the exact production backend `/api` URL
- [ ] `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` are different, high-entropy values stored in the host's secret manager — never committed
- [ ] `MONGO_URI` → Atlas (TLS + IP restrict + strong DB user password)
- [ ] `REDIS_URL` → managed Redis (TLS where required)
- [ ] Judge0 provider configured and a real code execution has completed successfully in the deployed environment
- [ ] At least one AI provider key set; provider quota/billing confirmed
- [ ] Email delivery tested — verification and password-reset links reach a real inbox
- [ ] Refresh cookie settings work across production domains (HTTPS + `SameSite=None`)
- [ ] `App.jsx` → `once={true}` on AnimatePresence (change from `once={false}` dev setting)
- [ ] Database backups enabled (Atlas continuous backups recommended)
- [ ] CI checks pass on the exact commit being deployed
- [ ] Rollback procedure defined before go-live

---

## Troubleshooting

| Symptom | What to check |
|---|---|
| CORS errors in the browser | `VITE_API_BASE_URL` includes `/api`. `CLIENT_URL` on the backend exactly matches the frontend origin. Frontend was rebuilt after changing the variable. |
| Login works, but refresh fails | HTTPS on both ends. `COOKIE_SAME_SITE=none` set. Credentialed CORS (`withCredentials: true`). Frontend and backend domains compatible with the SameSite policy. |
| `provider_unavailable` on submission | `JUDGE0_API_URL` and API key correct. The backend host can make outbound HTTPS requests to the provider. |
| Submission stuck in `queued` | Redis connected. Bull workers are running (check backend logs). Deployment must be a long-running process — serverless functions don't support persistent queue workers. |
| AI review never appears | Gemini and/or Groq keys set. Provider quotas not exhausted. Check backend logs for AI worker errors. |
| Emails not arriving | `BREVO_API_KEY` set. `BREVO_SENDER_EMAIL` is a verified address in your Brevo account. `API_URL` set (used to build links in emails). |
| Direct frontend URL returns 404 | SPA fallback not configured. On Vercel, ensure `vercel.json` rewrites all paths to `index.html`. |

---

## Contributing

1. Branch from `dev` (or `main` for hotfixes)
2. Keep changes focused — one feature or fix per PR
3. Never commit `.env` files, API keys, secrets, or `dist/`
4. Run `npm test` from `server/` and `npm run build` from `client/` before opening a PR
5. Open PRs to `dev` — CI runs automatically on push

---

## License

This project is intended for educational and portfolio use. No separate license file is included — contact the author before redistributing or reusing this code commercially.

---

<div align="center">

Built by [Harshit Tiwari](https://github.com/harshit-tiwari-codebase)

</div>
