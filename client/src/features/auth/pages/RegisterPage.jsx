import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";

import AuthLayout from "../../../components/layout/AuthLayout.jsx";
import Input from "../../../components/ui/Input.jsx";
import Button from "../../../components/ui/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function RegisterPage() {
  const { register, authError, resendVerification } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resending, setResending] = useState(false);

  function validate() {
    const errors = {};

    if (form.name.trim().length < 2) {
      errors.name = "Enter your full name.";
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      errors.email = "Enter a valid email.";
    }

    if (form.password.length < 8) {
      errors.password = "At least 8 characters.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  }

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (fieldErrors[field]) {
      setFieldErrors((current) => ({
        ...current,
        [field]: "",
      }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    setResendMessage("");

    try {
      const email = form.email.trim();

      await register({
        ...form,
        name: form.name.trim(),
        email,
      });

      setRegisteredEmail(email);
      setShowSuccess(true);
    } catch {
      // authError is already set by AuthContext
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResendVerification() {
    if (!registeredEmail) return;

    setResending(true);
    setResendMessage("");

    try {
      await resendVerification(registeredEmail);

      setResendMessage(
        "A fresh verification link is on its way."
      );
    } catch {
      // authError is already set by AuthContext
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="get started"
      title="Build your proof-of-work profile"
      subtitle="One account, badges you actually earned."
    >
      <div className="relative">
        {/* Dark moon ambient glow */}
        <div className="pointer-events-none absolute -inset-10 -z-10 rounded-[2rem] bg-violet-600/[0.04] blur-3xl" />

        {showSuccess ? (
          <div
            className="
              relative overflow-hidden
              rounded-2xl
              border border-violet-400/20
              bg-violet-500/[0.06]
              p-6
              shadow-[0_0_40px_rgba(139,92,246,0.06)]
            "
          >
            {/* Success glow */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-600/10 blur-3xl" />

            <div className="relative">
              {/* Success icon */}
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
                <CheckCircle2 className="h-5 w-5 text-violet-400" />
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-violet-400" />

                <p className="font-mono text-xs uppercase tracking-[0.14em] text-violet-400">
                  verification required
                </p>
              </div>

              <h3 className="mt-3 text-xl font-semibold text-mist-100">
                Check your inbox
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-mist-300">
                We sent a verification link to{" "}
                <span className="font-medium text-white">
                  {registeredEmail}
                </span>
                . Open it, then sign in once your email is confirmed.
              </p>

              {resendMessage && (
                <div className="mt-4 rounded-lg border border-violet-400/15 bg-violet-500/[0.05] px-3 py-2.5">
                  <p className="font-mono text-xs text-violet-300">
                    {resendMessage}
                  </p>
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="verify"
                  size="md"
                  onClick={handleResendVerification}
                  disabled={resending}
                >
                  {resending ? "Sending…" : "Resend email"}

                  {!resending && (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </Button>

                <Link
                  to="/login"
                  className="
                    inline-flex items-center gap-1.5
                    text-sm font-medium
                    text-mist-400
                    transition-colors
                    hover:text-violet-300
                  "
                >
                  Back to sign in
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            noValidate
          >
            {/* Full name */}
            <Input
              id="name"
              label="Full name"
              type="text"
              autoComplete="name"
              placeholder="Aditi Sharma"
              value={form.name}
              onChange={(e) =>
                updateField("name", e.target.value)
              }
              error={fieldErrors.name}
            />

            {/* Email */}
            <Input
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@college.edu"
              value={form.email}
              onChange={(e) =>
                updateField("email", e.target.value)
              }
              error={fieldErrors.email}
            />

            {/* Password */}
            <Input
              id="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              placeholder="min. 8 characters"
              value={form.password}
              onChange={(e) =>
                updateField("password", e.target.value)
              }
              error={fieldErrors.password}
            />

            {/* Password hint */}
            <div className="flex items-center gap-2 px-1">
              <span className="h-1 w-1 rounded-full bg-violet-400/70" />

              <span className="font-mono text-[10px] text-mist-700">
                minimum 8 characters
              </span>
            </div>

            {/* Authentication error */}
            {authError && (
              <div className="rounded-xl border border-flag/30 bg-flag/[0.06] px-4 py-3">
                <div className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-flag" />

                  <p className="font-mono text-xs leading-relaxed text-flag">
                    {authError}
                  </p>
                </div>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              variant="verify"
              className="group w-full justify-between px-5"
              disabled={submitting}
            >
              <span>
                {submitting
                  ? "Creating account…"
                  : "Create account"}
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
        )}

        {/* Login link */}
        {!showSuccess && (
          <p className="mt-7 text-center text-sm text-mist-500">
            Already verified?{" "}

            <Link
              to="/login"
              className="
                font-medium
                text-violet-400
                transition-colors
                hover:text-violet-300
                hover:underline
                underline-offset-4
              "
            >
              Sign in
            </Link>
          </p>
        )}
      </div>
    </AuthLayout>
  );
}