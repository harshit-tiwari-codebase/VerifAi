import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import AuthLayout from "../../../components/layout/AuthLayout.jsx";
import Button from "../../../components/ui/Button.jsx";
import { resetPasswordRequest } from "../api/authApi.js";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Reset token is missing or invalid.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await resetPasswordRequest({ token, password });
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to reset password. The link may have expired."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create new password"
      subtitle="Your new password must be at least 8 characters."
    >
      {success ? (
        <div className="space-y-4 rounded-xl border border-[#34D399]/30 bg-[#34D399]/10 p-5 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#34D399]/20 text-[#34D399]">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#34D399]">Password reset successful</h3>
            <p className="mt-1 text-xs text-[#AAA69B] leading-relaxed">
              All active sessions have been invalidated. Redirecting you to sign in...
            </p>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-[#FFB08E] hover:text-[#FFD1BB] font-medium pt-2"
          >
            Sign in now
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-[10px] border border-[#F87171]/30 bg-[#F87171]/10 p-3 text-xs text-[#F87171]">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#AAA69B] mb-1.5">New password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#77756D]" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full rounded-[10px] border border-[#30302B] bg-[#171714] pl-10 pr-10 py-2.5 text-sm text-[#F2EFE6] placeholder:text-[#77756D] focus:border-[#FF6A3D] focus:ring-1 focus:ring-[#FF6A3D]/30 focus:outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#77756D] hover:text-[#AAA69B]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#AAA69B] mb-1.5">
              Confirm new password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#77756D]" />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full rounded-[10px] border border-[#30302B] bg-[#171714] pl-10 pr-4 py-2.5 text-sm text-[#F2EFE6] placeholder:text-[#77756D] focus:border-[#FF6A3D] focus:ring-1 focus:ring-[#FF6A3D]/30 focus:outline-none transition-colors"
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
                Resetting password...
              </>
            ) : (
              "Save new password"
            )}
          </Button>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs text-[#AAA69B] hover:text-[#F2EFE6] transition-colors"
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
