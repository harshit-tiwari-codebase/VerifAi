import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  loginRequest,
  logoutRequest,
  refreshRequest,
  registerRequest,
  resendVerificationRequest,
} from "../api/authApi";

import { setAccessToken } from "../../../api/axiosInstance";

const AuthContext = createContext(null);

const STATUS = {
  IDLE: "idle",
  AUTHENTICATED: "authenticated",
  UNAUTHENTICATED: "unauthenticated",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [authError, setAuthError] = useState(null);

  /*
   * Restore the authenticated session on page reload.
   *
   * The refresh token is stored in an httpOnly cookie,
   * so the browser sends it automatically.
   */
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const data = await refreshRequest();

        if (cancelled) return;

        setAccessToken(data?.accessToken ?? null);
        setUser(data?.user ?? null);
        setAuthError(null);
        setStatus(STATUS.AUTHENTICATED);
      } catch {
        if (cancelled) return;

        setAccessToken(null);
        setUser(null);
        setAuthError(null);
        setStatus(STATUS.UNAUTHENTICATED);
      }
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  async function login(credentials) {
    setAuthError(null);

    try {
      const data = await loginRequest(credentials);

      setAccessToken(data?.accessToken ?? null);
      setUser(data?.user ?? null);
      setStatus(STATUS.AUTHENTICATED);

      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Could not sign in.";

      setAuthError(message);

      throw err;
    }
  }

  async function register(details) {
    setAuthError(null);

    try {
      const data = await registerRequest(details);

      /*
       * Registration does not authenticate the user.
       * The user must verify their email and then sign in.
       */
      setAccessToken(null);
      setUser(null);
      setStatus(STATUS.UNAUTHENTICATED);

      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Could not create account.";

      setAuthError(message);

      throw err;
    }
  }

  async function resendVerification(email) {
    setAuthError(null);

    try {
      const data = await resendVerificationRequest({
        email,
      });

      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Could not resend verification email.";

      setAuthError(message);

      throw err;
    }
  }

  async function logout() {
    setAuthError(null);

    try {
      await logoutRequest();
    } finally {
      setAccessToken(null);
      setUser(null);
      setStatus(STATUS.UNAUTHENTICATED);
    }
  }

  const value = useMemo(
    () => ({
      user,
      status,

      isAuthenticated:
        status === STATUS.AUTHENTICATED,

      isLoading:
        status === STATUS.IDLE,

      authError,

      login,
      register,
      resendVerification,
      logout,
    }),
    [user, status, authError]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return ctx;
}