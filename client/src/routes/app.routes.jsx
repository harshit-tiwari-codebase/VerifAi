import { Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage.jsx";
import LoginPage from "../features/auth/pages/LoginPage.jsx";
import RegisterPage from "../features/auth/pages/RegisterPage.jsx";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import ChallengesPage from "../pages/ChallengesPage.jsx";
import PlaygroundPage from "../pages/PlaygroundPage.jsx";
import LeaderboardPage from "../pages/LeaderboardPage.jsx";
import DocsPage from "../pages/DocsPage.jsx";
import VerifyEmailPage from "../features/auth/pages/VerifyEmailPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import ProtectedRoute from "../features/auth/routes/ProtectedRoute.jsx";
import PublicOnlyRoute from "../features/auth/routes/PublicOnlyRoute.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/challenges" element={<ChallengesPage />} />
      <Route path="/playground" element={<PlaygroundPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/docs" element={<DocsPage />} />

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
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
