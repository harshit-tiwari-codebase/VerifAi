import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../../components/layout/AuthLayout.jsx";
import Input from "../../../components/ui/Input.jsx";
import Button from "../../../components/ui/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { login, authError, resendVerification } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  function validate() {
    const errors = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "Enter a valid email.";
    if (form.password.length < 1) errors.password = "Password is required.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await login(form);
      setResendMessage("");
      navigate(redirectTo, { replace: true });
    } catch {
      // authError is already set by AuthContext
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResendVerification() {
    if (!form.email) return;
    setResending(true);
    try {
      await resendVerification(form.email);
      setResendMessage("A fresh verification link is on its way.");
    } catch {
      // authError is already set by AuthContext
    } finally {
      setResending(false);
    }
  }

  const needsVerification = authError?.toLowerCase().includes("verify") || authError?.toLowerCase().includes("verified");

  return (
    <AuthLayout
      eyebrow="welcome back"
      title="Sign in to your profile"
      subtitle="Pick up where your last submission left off."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@college.edu"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={fieldErrors.email}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={fieldErrors.password}
        />

        {authError && (
          <div className="space-y-3 rounded-lg border border-flag/40 bg-flag/10 px-3.5 py-2.5">
            <p className="font-mono text-xs text-flag">{authError}</p>
            {needsVerification && (
              <div className="flex flex-wrap items-center gap-3">
                <Button type="button" variant="ghost" size="sm" onClick={handleResendVerification} disabled={resending}>
                  {resending ? "Sending…" : "Resend verification email"}
                </Button>
                {resendMessage && <span className="text-xs text-verify">{resendMessage}</span>}
              </div>
            )}
          </div>
        )}

        <Button type="submit" variant="verify" className="w-full" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-mist-500">
        New here?{" "}
        <Link to="/register" className="text-verify hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
