import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  RefreshCw,
  Info,
  ArrowRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import AuthLayout from "../../../components/layout/AuthLayout.jsx";
import Button from "../../../components/ui/Button.jsx";
import {
  register,
  resendVerification,
  selectAuthError,
} from "../authSlice.js";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const authError = useSelector(selectAuthError);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resending, setResending] = useState(false);
  const [socialNotice, setSocialNotice] = useState("");

  function validate() {
    const errors = {};

    if (form.name.trim().length < 2) {
      errors.name = "Enter your full name (at least 2 characters).";
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      errors.email = "Enter a valid email address.";
    }

    if (form.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }

    if (!agreeTerms) {
      errors.terms = "Please agree to Terms & Privacy Policy to continue.";
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
    setSocialNotice("");

    try {
      const email = form.email.trim();

      await dispatch(
        register({
          ...form,
          name: form.name.trim(),
          email,
        })
      ).unwrap();

      setRegisteredEmail(email);
      setShowSuccess(true);
    } catch {
      // handled by auth slice
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResendVerification() {
    if (!registeredEmail) return;

    setResending(true);
    setResendMessage("");

    try {
      await dispatch(resendVerification(registeredEmail)).unwrap();
      setResendMessage("A fresh verification link has been dispatched.");
    } catch {
      // handled by auth slice
    } finally {
      setResending(false);
    }
  }

  function handleSocialSignUp(provider) {
    setSocialNotice(`${provider} sign-up will be available soon. Please register using email & password.`);
  }

  return (
    <AuthLayout>
      <div className="w-full">
        {showSuccess ? (
          <div className="space-y-4 text-center py-2">
            {/* Animated Email Success Graphic */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#FF6A3D]/40 bg-[#261912] text-[#FFB08E] shadow-sm">
              <Mail className="h-7 w-7" />
            </div>

            <div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#34D399] font-semibold">
                Verification Required
              </span>
              <h2 className="text-xl font-bold font-display text-[#F2EFE6] mt-1">
                Check your inbox
              </h2>
              <p className="mt-1.5 text-xs text-[#AAA69B] leading-relaxed max-w-sm mx-auto">
                We sent a verification link to{" "}
                <span className="text-[#F2EFE6] font-medium underline underline-offset-2">
                  {registeredEmail}
                </span>
                . Click the link to activate your account.
              </p>
            </div>

            {resendMessage && (
              <div className="p-2.5 rounded-[10px] border border-[#FF6A3D]/30 bg-[#261912] font-mono text-xs text-[#FFD1BB]">
                {resendMessage}
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <Button
                type="button"
                variant="verify"
                size="sm"
                onClick={handleResendVerification}
                disabled={resending}
                className="w-full sm:w-auto justify-center"
              >
                <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${resending ? "animate-spin" : ""}`} />
                {resending ? "Sending..." : "Resend Email"}
              </Button>

              <Button
                as={Link}
                to="/login"
                variant="ghost"
                size="sm"
                className="w-full sm:w-auto justify-center"
              >
                Go to Sign In
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-[#F2EFE6]">
                Create an account
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-[#AAA69B]">
                Sign up to start verifying your engineering craft
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-3" noValidate>
              {/* Name Input */}
              <div className="space-y-0.5">
                <div className="relative flex items-center">
                  <div className="pointer-events-none absolute left-3.5 text-[#77756D]">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className={`w-full rounded-[10px] border bg-[#171714] text-sm text-[#F2EFE6] placeholder:text-[#77756D] outline-none transition-all py-2.5 pl-10 pr-3.5 ${
                      fieldErrors.name
                        ? "border-[#F87171] focus:border-[#F87171] focus:ring-1 focus:ring-[#F87171]/20"
                        : "border-[#30302B] hover:border-[#414139] focus:border-[#FF6A3D] focus:ring-1 focus:ring-[#FF6A3D]/30"
                    }`}
                  />
                </div>
                {fieldErrors.name && (
                  <p className="text-[10px] text-[#F87171] pl-1 font-mono">{fieldErrors.name}</p>
                )}
              </div>

              {/* Email Input */}
              <div className="space-y-0.5">
                <div className="relative flex items-center">
                  <div className="pointer-events-none absolute left-3.5 text-[#77756D]">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    placeholder="developer@company.com"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className={`w-full rounded-[10px] border bg-[#171714] text-sm text-[#F2EFE6] placeholder:text-[#77756D] outline-none transition-all py-2.5 pl-10 pr-3.5 ${
                      fieldErrors.email
                        ? "border-[#F87171] focus:border-[#F87171] focus:ring-1 focus:ring-[#F87171]/20"
                        : "border-[#30302B] hover:border-[#414139] focus:border-[#FF6A3D] focus:ring-1 focus:ring-[#FF6A3D]/30"
                    }`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-[10px] text-[#F87171] pl-1 font-mono">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-0.5">
                <div className="relative flex items-center">
                  <div className="pointer-events-none absolute left-3.5 text-[#77756D]">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    placeholder="Password (min. 8 characters)"
                    value={form.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    className={`w-full rounded-[10px] border bg-[#171714] text-sm text-[#F2EFE6] placeholder:text-[#77756D] outline-none transition-all py-2.5 pl-10 pr-10 ${
                      fieldErrors.password
                        ? "border-[#F87171] focus:border-[#F87171] focus:ring-1 focus:ring-[#F87171]/20"
                        : "border-[#30302B] hover:border-[#414139] focus:border-[#FF6A3D] focus:ring-1 focus:ring-[#FF6A3D]/30"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 p-1 rounded-md text-[#77756D] hover:text-[#AAA69B] transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-[10px] text-[#F87171] pl-1 font-mono">{fieldErrors.password}</p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div>
                <label className="flex items-start gap-2 cursor-pointer select-none text-[11px] text-[#AAA69B] hover:text-[#F2EFE6]">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked);
                      if (fieldErrors.terms) setFieldErrors({ ...fieldErrors, terms: "" });
                    }}
                    className="mt-0.5 h-3.5 w-3.5 rounded border-[#30302B] bg-[#171714] accent-[#FF6A3D] cursor-pointer"
                  />
                  <span className="leading-tight">
                    I agree to the{" "}
                    <span className="text-[#FFB08E] hover:underline">Terms of Service</span> and{" "}
                    <span className="text-[#FFB08E] hover:underline">Privacy Policy</span>.
                  </span>
                </label>
                {fieldErrors.terms && (
                  <p className="text-[10px] text-[#F87171] pl-1 pt-0.5 font-mono">{fieldErrors.terms}</p>
                )}
              </div>

              {/* Error Banner */}
              {authError && (
                <div className="p-2.5 rounded-[10px] border border-[#F87171]/30 bg-[#F87171]/10 text-[#F87171] text-xs font-mono flex items-start gap-2">
                  <AlertCircle className="h-3.5 w-3.5 text-[#F87171] shrink-0 mt-0.5" />
                  <p className="flex-1">{authError}</p>
                </div>
              )}

              {/* Social notice feedback if clicked */}
              {socialNotice && (
                <div className="p-2 rounded-[10px] border border-[#FF6A3D]/30 bg-[#261912] text-[#FFD1BB] text-xs flex items-center gap-2">
                  <Info className="h-3.5 w-3.5 text-[#FFB08E] shrink-0" />
                  <p className="flex-1">{socialNotice}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="verify"
                size="md"
                disabled={submitting}
                loading={submitting}
                className="w-full !py-2.5"
              >
                Create Account
              </Button>

              {/* Divider "Or" */}
              <div className="relative flex items-center justify-center my-2.5 py-0.5">
                <div className="border-t border-[#30302B] w-full" />
                <span className="bg-[#171714] px-2.5 text-xs text-[#77756D] font-sans absolute">
                  Or continue with
                </span>
              </div>

              {/* Social Sign-up */}
              <div className="space-y-2">
                {/* Google */}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handleSocialSignUp("Google")}
                  className="w-full !py-2 !rounded-[10px] text-xs sm:text-sm !font-medium"
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
                  <span>Sign up with Google</span>
                </Button>

                {/* Facebook */}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handleSocialSignUp("Facebook")}
                  className="w-full !py-2 !rounded-[10px] text-xs sm:text-sm !font-medium"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Sign up with Facebook</span>
                </Button>
              </div>

              {/* Login prompt */}
              <div className="pt-2 text-center text-xs text-[#AAA69B]">
                <span>Already have an account? </span>
                <Link
                  to="/login"
                  className="text-[#FFB08E] hover:text-[#FFD1BB] font-semibold underline-offset-2 hover:underline transition-colors"
                >
                  Log In
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
