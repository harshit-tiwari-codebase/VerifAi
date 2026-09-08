import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import LandingPage from "../pages/LandingPage.jsx";
import LoginPage from "../features/auth/pages/LoginPage.jsx";
import RegisterPage from "../features/auth/pages/RegisterPage.jsx";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage.jsx";
import VerifyEmailPage from "../features/auth/pages/VerifyEmailPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import ProtectedRoute from "../features/auth/routes/ProtectedRoute.jsx";
import PublicOnlyRoute from "../features/auth/routes/PublicOnlyRoute.jsx";

// Lazy-loaded heavy pages to reduce initial bundle size
const DashboardPage = lazy(() => import("../pages/DashboardPage.jsx"));
const ChallengesPage = lazy(() => import("../pages/ChallengesPage.jsx"));
const PlaygroundPage = lazy(() => import("../pages/PlaygroundPage.jsx"));
const LeaderboardPage = lazy(() => import("../pages/LeaderboardPage.jsx"));
const DocsPage = lazy(() => import("../pages/DocsPage.jsx"));

function LazyFallback() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
        <span className="text-xs font-mono text-mist-400">Loading…</span>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<LazyFallback />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route
            path="/verify-email/:token"
            element={<VerifyEmailPage />}
          />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/docs" element={<DocsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
