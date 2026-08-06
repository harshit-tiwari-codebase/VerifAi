import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * Wrap protected pages: <Route element={<ProtectedRoute />}>...</Route>
 * Redirects to /login, preserving the attempted location so we can bounce
 * the user back after they sign in.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-900">
        <div className="flex items-center gap-3 font-mono text-sm text-mist-500">
          <span className="h-2 w-2 animate-pulse rounded-full bg-verify" />
          verifying session…
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
