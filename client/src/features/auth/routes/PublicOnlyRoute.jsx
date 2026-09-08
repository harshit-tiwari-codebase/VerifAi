import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectIsAuthLoading,
} from "../authSlice.js";

/**
 * Wrap routes like /login and /register: an already-authenticated user gets
 * redirected straight to their dashboard instead of seeing the form again.
 */
export default function PublicOnlyRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsAuthLoading);

  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
