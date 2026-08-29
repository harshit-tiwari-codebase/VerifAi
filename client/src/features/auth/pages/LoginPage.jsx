import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight } from "lucide-react";

import AuthLayout from "../../../components/layout/AuthLayout.jsx";
import Input from "../../../components/ui/Input.jsx";
import Button from "../../../components/ui/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { login, authError, resendVerification } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo =
    location.state?.from?.pathname || "/dashboard";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  function validate() {
    const errors = {};

    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      errors.email = "Enter a valid email.";
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

    try {
      await login({
        email: form.email.trim(),
        password: form.password,
      });

      navigate(redirectTo, {
        replace: true,
      });
    } catch {
      // authError is already handled by AuthContext
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResendVerification() {
    if (!form.email.trim()) return;

    setResending(true);

    try {
      await resendVerification(form.email.trim());

      setResendMessage(
        "A fresh verification link is on its way."
      );
    } catch {
      // authError is already handled by AuthContext
    } finally {
      setResending(false);
    }
  }

  const normalizedError = authError?.toLowerCase() || "";

  const needsVerification =
    normalizedError.includes("verify") ||
    normalizedError.includes("verified");

  return (
    <AuthLayout
      eyebrow="welcome back"
      title="Sign in to your profile"
      subtitle="Pick up where your last submission left off."
    >
      <div className="relative">
        {/* Dark moon ambient glow */}
        <div className="pointer-events-none absolute -inset-10 -z-10 rounded-[2rem] bg-violet-600/[0.04] blur-3xl" />

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          noValidate
        >
          {/* Email */}
          <Input
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@college.edu"
            value={form.email}
            onChange={(e) => {
              setForm({
                ...form,
                email: e.target.value,
              });

              if (fieldErrors.email) {
                setFieldErrors({
                  ...fieldErrors,
                  email: "",
                });
              }
            }}
            error={fieldErrors.email}
          />

          {/* Password */}
          <Input
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => {
              setForm({
                ...form,
                password: e.target.value,
              });

              if (fieldErrors.password) {
                setFieldErrors({
                  ...fieldErrors,
                  password: "",
                });
              }
            }}
            error={fieldErrors.password}
          />

          {/* Authentication error */}
          {authError && (
            <div
              className="
                rounded-xl
                border border-flag/30
                bg-flag/[0.06]
                px-4 py-3
              "
            >
              <div className="flex gap-3">
                <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-flag" />

                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xs leading-relaxed text-flag">
                    {authError}
                  </p>

                  {needsVerification && (
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleResendVerification}
                        disabled={resending}
                        className="
                          border-violet-400/20
                          text-violet-300
                          hover:border-violet-400/40
                          hover:bg-violet-500/[0.06]
                        "
                      >
                        {resending
                          ? "Sending…"
                          : "Resend verification email"}
                      </Button>

                      {resendMessage && (
                        <span className="font-mono text-[11px] text-violet-400">
                          {resendMessage}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            variant="verify"
            className="
              group
              w-full
              justify-between
              px-5
            "
            disabled={submitting}
          >
            <span>
              {submitting ? "Signing in…" : "Sign in"}
            </span>

            {!submitting && (
              <ArrowRight
                className="
                  h-4 w-4
                  transition-transform duration-200
                  group-hover:translate-x-0.5
                "
              />
            )}
          </Button>
        </form>

        {/* Register */}
        <div className="mt-7 flex items-center justify-center gap-2 text-sm">
          <span className="text-mist-500">
            New here?
          </span>

          <Link
            to="/register"
            className="
              inline-flex items-center gap-1
              font-medium
              text-violet-400
              transition-colors
              hover:text-violet-300
              hover:underline
              underline-offset-4
            "
          >
            Create an account
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Trust indicator */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-violet-400/70" />

          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mist-700">
            secure authentication
          </span>
        </div>
      </div>
    </AuthLayout>
  );
}