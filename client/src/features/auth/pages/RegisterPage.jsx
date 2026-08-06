import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../../components/layout/AuthLayout.jsx";
import Input from "../../../components/ui/Input.jsx";
import Button from "../../../components/ui/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function RegisterPage() {
  const { register, authError, resendVerification } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resending, setResending] = useState(false);

  function validate() {
    const errors = {};
    if (form.name.trim().length < 2) errors.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "Enter a valid email.";
    if (form.password.length < 8)
      errors.password = "At least 8 characters.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await register(form);
      setRegisteredEmail(form.email);
      setShowSuccess(true);
      setResendMessage("");
    } catch {
      // authError already set by AuthContext
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResendVerification() {
    if (!registeredEmail) return;
    setResending(true);
    try {
      await resendVerification(registeredEmail);
      setResendMessage("A fresh verification link is on its way.");
    } catch {
      // authError already set by AuthContext
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
      {showSuccess ? (
        <div className="space-y-4 rounded-2xl border border-verify/30 bg-verify/10 p-5 text-sm text-mist-100">
          <p className="font-semibold text-verify">Check your inbox</p>
          <p>
            We sent a verification link to <span className="font-medium text-white">{registeredEmail}</span>.
            Open it, then sign in once your email is confirmed.
          </p>
          {resendMessage && <p className="text-verify">{resendMessage}</p>}
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="verify" size="md" onClick={handleResendVerification} disabled={resending}>
              {resending ? "Sending…" : "Resend email"}
            </Button>
            <Link to="/login" className="inline-flex items-center text-sm font-medium text-verify hover:underline">
              Back to sign in
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            id="name"
            label="Full name"
            type="text"
            autoComplete="name"
            placeholder="Aditi Sharma"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={fieldErrors.name}
          />
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
            autoComplete="new-password"
            placeholder="min. 8 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={fieldErrors.password}
          />

          {authError && (
            <p className="rounded-lg border border-flag/40 bg-flag/10 px-3.5 py-2.5 font-mono text-xs text-flag">
              {authError}
            </p>
          )}

          <Button type="submit" variant="verify" className="w-full" disabled={submitting}>
            {submitting ? "Creating account…" : "Create account"}
          </Button>
        </form>
      )}

      <p className="mt-6 text-sm text-mist-500">
        Already verified?{" "}
        <Link to="/login" className="text-verify hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
