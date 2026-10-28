import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import AuthLayout from "../../../components/layout/AuthLayout.jsx";
import Button from "../../../components/ui/Button.jsx";
import { forgotPasswordRequest } from "../api/authApi.js";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await forgotPasswordRequest({ email: email.trim() });
      setSuccessMessage(
        res.message || "If an account exists with that email, a password reset link has been sent."
      );
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to process request. Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your verified email and we'll send a secure reset link."
    >
      {successMessage ? (
        <div className="space-y-4 rounded-xl border border-[#34D399]/30 bg-[#34D399]/10 p-5 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#34D399]/20 text-[#34D399]">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#34D399]">Reset link sent</h3>
            <p className="mt-1 text-xs text-[#A1A1AA] leading-relaxed">{successMessage}</p>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-[#A78BFA] hover:text-[#C4B5FD] font-medium pt-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2 rounded-[10px] border border-[#F87171]/30 bg-[#F87171]/10 p-3 text-xs text-[#F87171]">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717A]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@company.com"
                className="w-full rounded-[10px] border border-[#27272A] bg-[#111116] pl-10 pr-4 py-2.5 text-sm text-[#FAFAFA] placeholder:text-[#71717A] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/30 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="verify"
            size="md"
            disabled={submitting}
            className="w-full"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending reset link...
              </>
            ) : (
              "Send password reset link"
            )}
          </Button>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to sign in
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
