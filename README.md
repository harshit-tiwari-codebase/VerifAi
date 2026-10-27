# VerifAI

**Verifiable software-engineering challenges, submissions, and skill credentials.**

VerifAI is a full-stack web application where developers discover engineering challenges, write code in a browser-based editor, run solutions against challenge tests, and submit work for evaluation. The backend owns challenge test cases and scoring. AI-generated code-review feedback is advisory; it does not determine automated scores or badges.

> **Deployment status:** The repository contains CI checks, but no GitHub Actions continuous-deployment workflow. Frontend and backend hosting, managed databases, provider credentials, and production environment variables must be configured separately before deployment.

## Contents

- [Features](#features)
- [Architecture and repository layout](#architecture-and-repository-layout)
- [Technology stack](#technology-stack)
- [Requirements](#requirements)
- [Local development](#local-development)
- [Environment variables](#environment-variables)
- [API overview](#api-overview)
- [Testing and CI](#testing-and-ci)
- [Deployment guide](#deployment-guide)
- [Production go-live checklist](#production-go-live-checklist)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Features

- React frontend with landing pages, authentication screens, dashboards, challenge pages, and a Monaco-based code editor.
- Express API with registration, login, refresh-token, logout, email verification, and password-reset flows.
- MongoDB persistence for users, challenges, submissions, and earned badges.
- Challenge types:
  - `testcases`: automated tests determine the score.
  - `both`: automated tests determine the score; AI review provides additional advisory feedback.
  - `review_only`: AI feedback is shown without an automated score or badge; human review is required.
- External Judge0-compatible code execution with configured CPU, wall-time, and memory limits.
- Redis/Bull queues for asynchronous submission and AI-evaluation jobs.
- Socket.IO events for authenticated users' submission status.
- Hidden test output sanitization before results are returned to clients.
- Rate limiting on authentication, challenge writes, code runs, and submissions.

## Architecture and repository layout

```text
.
├── .github/
│   └── workflows/ci.yml       # CI checks on pushes/PRs to dev and main
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── api/               # API clients
│   │   ├── components/        # Shared UI and landing-page components
│   │   ├── features/          # Auth, challenges, and related features
│   │   └── pages/             # Application pages
│   └── .env.example
├── server/                    # Express API and background workers
│   ├── src/
│   │   ├── config/            # MongoDB and Redis configuration
│   │   ├── controllers/       # HTTP request handlers
│   │   ├── middlewares/       # Auth, validation, and error handling
│   │   ├── models/            # Mongoose schemas
│   │   ├── queues/            # Bull queues
│   │   ├── routes/            # API routes
│   │   ├── tests/             # Node.js test suite
│   │   ├── utils/             # Execution, scoring, mail, and AI helpers
│   │   └── workers/           # Execution and AI-evaluation workers
│   ├── .env.example
│   ├── Dockerfile
│   └── server.js
└── docker-compose.yml         # Local MongoDB, Redis, and backend
```

### Submission flow

1. The authenticated client creates a submission through the API.
2. The server stores the submission and queues execution.
3. The execution worker sends candidate code and server-owned tests to the configured external execution provider.
4. For `testcases`, deterministic test results determine the score. For `both`, the AI reviewer also produces advisory feedback, but only test correctness determines the automated score and badge eligibility.
5. For `review_only`, the AI feedback is saved without an automated score or badge.
6. The server stores results and sends status updates to the owning user.

**Execution safety:** The server does not run untrusted submissions in a local Node.js child process. If the external execution provider is missing or unavailable, execution fails with `provider_unavailable`. Do not deploy expecting code runs to work until the external provider has been configured and tested.

## Technology stack

| Area | Technologies |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Monaco Editor, Redux Toolkit |
| Backend | Node.js 20, Express 5, Mongoose, JWT, Socket.IO |
| Data and queues | MongoDB, Redis, Bull |
| Code execution | External Judge0-compatible API |
| AI feedback | Gemini, with Groq as a fallback |
| Email | Brevo transactional email API |
| CI | GitHub Actions: frontend production build and backend tests |

## Requirements

- Node.js 20 (matches the GitHub Actions and Docker configuration).
- npm.
- MongoDB (local Docker container or managed MongoDB service).
- Redis (local Docker container or managed Redis service).
- A reachable Judge0-compatible execution API and credentials as required by that provider.
- At least one AI provider key (Gemini or Groq) for production AI feedback.
- Brevo API key and a verified sender address if registration verification and password-reset emails should be delivered.

## Local development

### Option A: Start MongoDB, Redis, and backend using Docker Compose

1. Create the backend environment file:

   ```powershell
   Copy-Item server\.env.example server\.env
   ```

2. Edit `server/.env`. Set strong JWT secrets and configure the execution/AI/email providers you intend to test. Docker Compose sets the backend's MongoDB and Redis URLs to internal Compose service names.

3. Build and start the services from the repository root:

   ```powershell
   docker compose up --build
   ```

   The backend is available at `http://localhost:3001`; MongoDB and Redis remain on the internal Compose network and are not published to host ports.

4. In another terminal, install and start the frontend:

   ```powershell
   cd client
   npm ci
   Copy-Item .env.example .env
   npm run dev
   ```

   Before starting Vite, edit `client/.env` and set `VITE_API_BASE_URL=http://localhost:3001/api` (Compose publishes the backend on port `3001`; the checked-in client example defaults to port `3000`). Open `http://localhost:5173`.

   If you configure a self-hosted Judge0 service for this Compose setup, `JUDGE0_API_URL` must be an address reachable **from the backend container**. `localhost` inside that container refers to the backend container itself.

To stop the containers, run `docker compose down`. To remove local database data as well, use `docker compose down --volumes` (this permanently deletes the Compose MongoDB and Redis volumes).

### Option B: Run the backend directly

Start MongoDB and Redis separately, then configure `MONGO_URI` and `REDIS_URL` in `server/.env` for those services.

```powershell
cd server
npm ci
Copy-Item .env.example .env
npm run dev
```

The backend listens on `PORT` (the example uses `3000`; `server.js` defaults to `5000` if `PORT` is unset). In another terminal:

```powershell
cd client
npm ci
Copy-Item .env.example .env
npm run dev
```

The client uses `VITE_API_BASE_URL`, which defaults to `http://localhost:3000/api`.

### Build, test, and start commands

```powershell
cd server
npm test
```

```powershell
cd server
npm start
```

```powershell
cd client
npm ci
npm run build
```

```powershell
cd client
npm run preview
```

## Environment variables

Keep actual secrets in local `.env` files or the hosting provider's secret manager. Never commit secrets, paste them into issue trackers, or put private API keys in frontend `VITE_*` variables. The checked-in `.env.example` files contain placeholders only.

### Backend: `server/.env`

| Variable | Required | Description |
|---|---:|---|
| `PORT` | Hosting-dependent | HTTP port. The repository example uses `3000`; the server defaults to `5000` if omitted. Set this to the port provided by your hosting platform. |
| `NODE_ENV` | Production | Set to `production` for deployment. Enables production cookie settings and production logging. |
| `CLIENT_URL` | Yes | Exact frontend origin, such as `https://your-app.example.com`, with no path or trailing slash. Used by CORS, Socket.IO, and password-reset redirects. |
| `API_URL` | Email links | Public backend origin, such as `https://your-api.example.com`, with no `/api` suffix. Used to generate verification and reset links. `BACKEND_URL` is an alternative. |
| `MONGO_URI` | Yes | MongoDB connection string. Use a managed database with authentication/TLS in production. |
| `REDIS_URL` | Recommended | Redis connection string for Bull queues. Use `rediss://` where the provider requires TLS. |
| `ACCESS_TOKEN_SECRET` | Yes | Strong, unique signing secret for short-lived access JWTs. |
| `REFRESH_TOKEN_SECRET` | Yes | Separate, strong, unique signing secret for refresh JWTs. |
| `ACCESS_TOKEN_EXPIRY` | No | Access-token lifetime; defaults to `15m`. |
| `REFRESH_TOKEN_EXPIRY` | No | Refresh-token lifetime; defaults to `7d`. |
| `COOKIE_SAME_SITE` | Deployment-dependent | Override for refresh-cookie SameSite behavior. Production defaults to `none`, which requires HTTPS; select a value compatible with your frontend/backend domain setup. |
| `JUDGE0_API_URL` | For code runs | Base URL of the reachable Judge0-compatible service. If unset, the integration defaults to Judge0 CE on RapidAPI. |
| `RAPIDAPI_KEY` | Provider-dependent | RapidAPI key when using Judge0 through RapidAPI. |
| `JUDGE0_API_KEY` | Provider-dependent | Alternate key variable accepted by the execution integration. |
| `RAPIDAPI_HOST` | No | RapidAPI host override; defaults to `judge0-ce.p.rapidapi.com`. |
| `GEMINI_API_KEY` | One AI key required in production | Primary AI evaluation provider. |
| `GROQ_API_KEY` | One AI key required in production | Fallback AI evaluation provider. |
| `BADGE_SCORE_THRESHOLD` | No | Score threshold for badge eligibility. The example sets `80`; code falls back to `70` if unset. Required tests must also pass. |
| `BREVO_API_KEY` | Email delivery | Brevo API key for verification and password-reset email. |
| `BREVO_SENDER_EMAIL` | Email delivery | Verified sender address; falls back to `FROM_EMAIL`. |
| `BREVO_SENDER_NAME` | No | Sender display name; falls back to `FROM_NAME` and then `VerifAI`. |
| `FROM_EMAIL` | Email delivery | Fallback sender address if `BREVO_SENDER_EMAIL` is not set. |
| `FROM_NAME` | No | Fallback sender display name. |

`server/.env.example` also contains `RESEND_API_KEY` and `BREVO_SMTP_USER`, but the current email sender implementation uses Brevo's HTTP API and does not read those two variables.

Generate two different secrets locally, then paste each output into its corresponding environment variable:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### Frontend: `client/.env`

| Variable | Required | Description |
|---|---:|---|
| `VITE_API_BASE_URL` | Yes for deployment | Backend API base URL. Use `https://your-api.example.com/api` in production and `http://localhost:3000/api` for direct local development. Do not include credentials or secrets. |

Vite embeds `VITE_*` values into the client build. Set the correct production value **before** building/deploying the frontend.

## API overview

The API is mounted under `/api`. The main endpoints include:

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/` | Basic backend liveness response. |
| `GET` | `/api/health/diagnostics` | Service diagnostics for MongoDB, Redis, and configured providers. |
| `POST` | `/api/auth/register` | Register a user. |
| `POST` | `/api/auth/login` | Sign in. |
| `POST` | `/api/auth/refresh` | Refresh access credentials using the refresh cookie. |
| `POST` | `/api/auth/logout` | Clear auth cookies. |
| `GET` | `/api/auth/me` | Get the authenticated user. |
| `GET` | `/api/challenges` | List challenges. |
| `GET` | `/api/challenges/:id` | Get a challenge. |
| `POST` | `/api/challenges/:id/run` | Run public challenge tests; no score or badge is issued. |
| `POST` | `/api/challenges/:id/submit` | Challenge-scoped submission route. |
| `POST` | `/api/submissions` | Canonical authenticated submission endpoint. |
| `GET` | `/api/submissions` | Get the authenticated user's submission history. |
| `GET` | `/api/submissions/:id` | Get a submission if authorized. |

Authentication uses short-lived access tokens and HTTP-only refresh cookies. The frontend sends credentials and uses the configured backend origin. Cross-origin production deployments require correct CORS, HTTPS, and cookie settings.

For exact validation rules and response shapes, see the route validators and controllers under `server/src`.

## Testing and CI

Run the backend tests:

```powershell
cd server
npm test
```

Build the frontend:

```powershell
cd client
npm ci
npm run build
```

The GitHub Actions workflow at `.github/workflows/ci.yml` runs:

- Client dependency installation and production build.
- Server dependency installation and automated tests.

The workflow triggers on pushes and pull requests targeting `dev` or `main`. **It does not trigger on `submission/UI` pushes and it does not deploy the application.** Merge or open a pull request to a configured branch to run these checks, or extend the workflow deliberately.

## Deployment guide

This repository does not pin deployment to one host. The following is a practical split-host setup (for example: Vercel for the client, Render for the API, managed MongoDB, managed Redis, and a hosted Judge0-compatible provider). Equivalent providers can be used if they satisfy the same requirements.

### 1. Prepare managed services

1. Create a production MongoDB database and a database user with only the permissions the app needs.
2. Restrict MongoDB network access to the backend host when your provider supports IP/network restrictions. Require TLS.
3. Create a managed Redis instance. Require authentication and TLS if offered.
4. Create/choose a Judge0-compatible execution provider. Confirm the deployed backend can reach it and that its API plan supports the submission volume and resource limits required by your challenges.
5. Create Gemini and/or Groq credentials.
6. Configure Brevo and verify the sender domain/address if account emails are part of launch.

The provided Compose file is for local development. Its MongoDB and Redis services are only reachable on its private Compose network, have no authentication configured, and should not be exposed as production services.

### 2. Deploy the backend

For a Node service on a platform such as Render:

- Repository: this Git repository.
- Root directory: `server`.
- Runtime: Node.js 20.
- Build/install command: `npm ci`.
- Start command: `npm start`.
- Health check path: `/`.
- Add the backend variables from [Backend: `server/.env`](#backend-serverenv) to the host's secret/environment settings.
- Set `PORT` to the platform-provided port if the platform requires it.
- Set `CLIENT_URL` to the final HTTPS frontend origin.
- Set `API_URL` to the final HTTPS backend origin, without `/api`.
- Use managed MongoDB and Redis URLs, not `localhost`.
- Configure Judge0 URL and key(s); the backend must be able to reach the provider from the deployed environment.

The backend starts MongoDB-backed API handling and attaches the execution and AI workers in the server process. Confirm your host supports long-running Node processes and outbound HTTPS requests. If using a serverless host, confirm it supports persistent Socket.IO connections and background workers before choosing it.

### 3. Deploy the frontend

For Vercel or a similar static frontend host:

- Root directory: `client`.
- Build command: `npm ci && npm run build`.
- Output directory: `dist`.
- Set `VITE_API_BASE_URL` to `https://your-api.example.com/api`.
- Enable SPA route rewrites/fallback to `index.html` so direct navigation to client routes works.
- Redeploy after changing frontend environment variables; Vite values are baked into the build.

### 4. Connect and smoke-test

1. Check `https://your-api.example.com/` returns `VerifAI API is running`.
2. Open `/api/health/diagnostics` and inspect MongoDB, Redis, AI, and execution-provider statuses. Treat this as diagnostics, not a substitute for end-to-end testing.
3. Open the frontend over HTTPS and test registration, login, refresh after reload, logout, and protected pages.
4. Verify a test email reaches a real inbox and verification/reset links point to the deployed HTTPS backend/frontend.
5. Run a public challenge test and confirm it returns provider results. Confirm submissions move through queued/executing/evaluating/completed states and that provider failures show as errors rather than successful scores.
6. Confirm failed required tests cannot receive badges, and AI score changes do not change automated scores or badge decisions.
7. Check host logs and resource usage during a few concurrent submissions.

### CI/CD

CI is present; automatic deployment is not. Configure deployment in the hosting provider (for example, deploy from a selected production branch) or add a separate deployment workflow after selecting hosts and their secret names. Do not add production credentials to workflow YAML or repository files.

## Production go-live checklist

- [ ] Production frontend and backend use HTTPS.
- [ ] Backend and frontend origins are final, and `CLIENT_URL` / `VITE_API_BASE_URL` match them exactly.
- [ ] Production `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` are different, high-entropy values, stored in the host secret manager.
- [ ] `MONGO_URI` points to secured production MongoDB; database users have strong passwords and TLS/network restrictions are enabled.
- [ ] `REDIS_URL` points to secured production Redis; TLS is used when required.
- [ ] A reachable external Judge0-compatible provider is configured and an actual code execution has passed in the deployed environment. No local execution fallback exists.
- [ ] At least one AI key is set; check provider quotas and billing.
- [ ] Email sender is verified and verification/reset email delivery is tested.
- [ ] `API_URL` points at the public backend origin and `CLIENT_URL` at the public frontend origin.
- [ ] Refresh-cookie settings work across the chosen domains. Production uses secure cookies; cross-site cookies require HTTPS.
- [ ] Database backup/restore and log access are understood.
- [ ] CI checks have passed for the exact revision being deployed.
- [ ] A rollback procedure and a person responsible for monitoring are agreed before launch.

## Troubleshooting

| Symptom | Checks |
|---|---|
| Frontend reports network/CORS errors | Confirm `VITE_API_BASE_URL` includes `/api`, the backend is reachable over HTTPS, and backend `CLIENT_URL` exactly matches the frontend origin. Rebuild the frontend after changing its variable. |
| Login works, but refresh fails | Confirm HTTPS, cookie settings, credentialed CORS, and that frontend/backend domains are compatible with the configured SameSite policy. |
| Submission returns `provider_unavailable` | Confirm `JUDGE0_API_URL` and required key/host variables. Verify outbound access from the backend host. The server intentionally does not execute submissions locally. |
| Submission stays queued | Check Redis connectivity, Bull queue/worker logs, and the backend process. Ensure the deployment is a long-running process, not a short-lived request-only function. |
| AI evaluation fails | Configure Gemini or Groq, check provider quotas and keys, and inspect backend logs for provider errors. |
| Verification/reset emails do not arrive | Configure `BREVO_API_KEY`, a verified sender (`BREVO_SENDER_EMAIL` or `FROM_EMAIL`), and the public `API_URL`. |
| Direct refresh of a frontend route returns 404 | Configure the frontend host to serve `index.html` for SPA routes. |

## Contributing

1. Create a feature branch from the current integration branch.
2. Keep changes focused and do not commit `.env` files, API keys, or database credentials.
3. Run `npm test` from `server` and `npm run build` from `client`.
4. Open a pull request to `dev` or `main` so the configured CI workflow runs.

## License

This project is intended for educational use. No separate license file is currently included; contact the project owners before redistributing or reusing the code.
