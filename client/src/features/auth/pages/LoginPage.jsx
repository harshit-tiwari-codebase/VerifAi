import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Info,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import AuthLayout from "../../../components/layout/AuthLayout.jsx";
import Button from "../../../components/ui/Button.jsx";
import {
  login,
  resendVerification,
  selectAuthError,
} from "../authSlice.js";

export default function LoginPage() {
  const dispatch = useDispatch();
  const authError = useSelector(selectAuthError);

  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [socialNotice, setSocialNotice] = useState("");

  function validate() {
    const errors = {};

    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      errors.email = "Enter a valid email address.";
    }

    if (form.password.length < 1) {
      errors.password = "Password is required.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    setResendMessage("");
    setSocialNotice("");

    try {
      await dispatch(
        login({
          email: form.email.trim(),
          password: form.password,
        })
      ).unwrap();

      navigate(redirectTo, {
        replace: true,
      });
    } catch {
      // authError is already handled by Redux auth slice.
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResendVerification() {
    if (!form.email.trim()) return;

    setResending(true);
    try {
      await dispatch(resendVerification(form.email.trim())).unwrap();
      setResendMessage("A fresh verification link is on its way to your inbox.");
    } catch {
      // handled by slice
    } finally {
      setResending(false);
    }
  }

  function handleSocialLogin(provider) {
    setSocialNotice(`${provider} sign-in will be enabled soon. Please use email & password.`);
  }

  const normalizedError = authError?.toLowerCase() || "";
  const needsVerification =
    normalizedError.includes("verify") || normalizedError.includes("verified");

  return (
    <AuthLayout>
      <div className="w-full">
        {/* Header matching the reference screenshot */}
        <div className="text-center mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
            Welcome back
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-mist-400">
            Log in to continue
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          {/* Email Input */}
          <div className="space-y-1">
            <div className="relative flex items-center">
              <div className="pointer-events-none absolute left-3.5 text-mist-500">
                <User className="h-4 w-4" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="username"
                required
                placeholder="Email"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: "" });
                }}
                className={`w-full rounded-xl border bg-[#12141d]/90 text-sm text-mist-100 placeholder:text-mist-500 outline-none transition-all py-2.5 pl-10 pr-3.5 ${
                  fieldErrors.email
                    ? "border-red-500/60 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                    : "border-ink-600/90 hover:border-ink-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                }`}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-[10.5px] text-red-400 pl-1 font-mono">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <div className="relative flex items-center">
              <div className="pointer-events-none absolute left-3.5 text-mist-500">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                placeholder="Password"
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                  if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: "" });
                }}
                className={`w-full rounded-xl border bg-[#12141d]/90 text-sm text-mist-100 placeholder:text-mist-500 outline-none transition-all py-2.5 pl-10 pr-10 ${
                  fieldErrors.password
                    ? "border-red-500/60 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                    : "border-ink-600/90 hover:border-ink-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1 rounded-md text-mist-500 hover:text-mist-200 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-[10.5px] text-red-400 pl-1 font-mono">{fieldErrors.password}</p>
            )}
          </div>

          {/* Remember me & Forgot password row */}
          <div className="flex items-center justify-between text-xs py-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none text-mist-400 hover:text-mist-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-ink-600 bg-[#12141d] accent-violet-600 cursor-pointer"
              />
              <span>Remember me</span>
            </label>

            <Link
              to="/forgot-password"
              className="text-mist-400 hover:text-violet-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Auth Error Banner */}
          {authError && (
            <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs font-mono space-y-1.5">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                <p className="flex-1">{authError}</p>
              </div>

              {needsVerification && (
                <div className="pt-1.5 border-t border-red-500/20 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resending}
                    className="px-2 py-0.5 rounded-lg border border-violet-500/40 bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 transition-colors flex items-center gap-1.5 text-[11px]"
                  >
                    <RefreshCw className={`h-3 w-3 ${resending ? "animate-spin" : ""}`} />
                    {resending ? "Resending..." : "Resend link"}
                  </button>
                  {resendMessage && (
                    <span className="text-emerald-400 text-[10.5px] flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Sent!
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Social notice feedback if clicked */}
          {socialNotice && (
            <div className="p-2.5 rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-200 text-xs flex items-center gap-2">
              <Info className="h-3.5 w-3.5 text-violet-400 shrink-0" />
              <p className="flex-1">{socialNotice}</p>
            </div>
          )}

          {/* Submit Button (Modern Awwwards specular primary) */}
          <Button
            type="submit"
            variant="verify"
            size="md"
            disabled={submitting}
            loading={submitting}
            className="w-full !py-2.5 !rounded-xl"
          >
            Log In
          </Button>

          {/* Divider "Or" */}
          <div className="relative flex items-center justify-center my-3 py-1">
            <div className="border-t border-ink-600/80 w-full" />
            <span className="bg-[#04030a] px-3 text-xs text-mist-500 font-sans absolute">
              Or
            </span>
          </div>

          {/* Social Logins */}
          <div className="space-y-2">
            {/* Google */}
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleSocialLogin("Google")}
              className="w-full !py-2 !rounded-xl !bg-[#12141d]/90 hover:!bg-[#181a26] text-xs sm:text-sm !font-medium"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Log in with Google</span>
            </Button>

            {/* Facebook */}
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleSocialLogin("Facebook")}
              className="w-full !py-2 !rounded-xl !bg-[#12141d]/90 hover:!bg-[#181a26] text-xs sm:text-sm !font-medium"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Log in with Facebook</span>
            </Button>
          </div>

          {/* Sign up prompt */}
          <div className="pt-3 text-center text-xs text-mist-400">
            <span>Don't have an account? </span>
            <Link
              to="/register"
              className="text-violet-400 hover:text-violet-300 font-semibold underline-offset-2 hover:underline transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
