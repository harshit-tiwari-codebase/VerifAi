# VerifAI — Frontend (Landing + Auth)

React (Vite) + Tailwind client implementing the landing page and the auth
flow described in the project context: JWT access token in memory, refresh
token in an httpOnly cookie, protected routes.

## Design

Dark, developer-tool aesthetic: near-black background (`#0A0E14`), an
emerald "verify" accent (`#00D9A0`) for anything confirmed/passed, and a
violet "signal" accent (`#7C6FFF`) for AI/intelligence moments. Display type
is Space Grotesk, body is Inter, code/labels are JetBrains Mono. The hero and
`#demo` section dramatize the actual product loop — submit → Judge0 execute
→ AI review → verified badge — instead of generic marketing copy.

## Layered architecture

```
src/
  api/         → axios instance (JWT header, silent refresh) + authApi.js (register/login/refresh/logout)
  store/        → Redux store: global auth state and async auth actions
  routes/       → ProtectedRoute (requires session), PublicOnlyRoute (auth pages)
  components/   → ui/ (Button, Input, Badge) + layout/ (Navbar, Footer, AuthLayout) + landing/ (sections)
  pages/        → LandingPage, LoginPage, RegisterPage, DashboardPage, NotFoundPage
```

Each layer only talks to the one below it: pages dispatch Redux actions, the slice uses
the api layer, the api layer talks to the Express backend. No component
calls axios directly.

## Run it

```bash
npm install
cp .env.example .env      # point VITE_API_BASE_URL at your Express server
npm run dev
```

## Wiring to the backend already built (Section 10 of the context doc)

- `POST /api/auth/register`, `/login`, `/refresh`, `/logout` are called from
  `src/api/authApi.js` — matches the controllers already in
  `server/controllers/authController.js`.
- The backend must set the refresh token as an **httpOnly cookie** and
  return `{ accessToken, user }` from register/login/refresh, and must have
  CORS configured with `credentials: true` for the Vite dev origin.
- `/dashboard` is a placeholder behind `ProtectedRoute` — next step is
  wiring it to `GET /api/challenges` and a submissions feed once Monaco +
  Judge0 land (Weeks 4–6 of the roadmap).

## Not included yet (by design, per the roadmap)

Monaco editor, challenge CRUD UI, Judge0/Bull submission flow, Socket.io
live results, and the public badge profile — these come in Weeks 4–11.
This deliverable is just the landing page + auth shell requested now.
