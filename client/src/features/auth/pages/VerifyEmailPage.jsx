import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";

import axiosInstance from "../../../api/axiosInstance.js";
import AuthLayout from "../../../components/layout/AuthLayout.jsx";
import Button from "../../../components/ui/Button.jsx";

export default function VerifyEmailPage() {
  const { token } = useParams();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState(
    "Verifying your email address..."
  );

  useEffect(() => {
    let cancelled = false;

    async function verifyEmail() {
      if (!token) {
        if (!cancelled) {
          setStatus("error");
          setMessage(
            "This verification link is missing the token."
          );
        }

        return;
      }

      try {
        const { data } = await axiosInstance.get(
          `/auth/verify-email/${token}`
        );

        if (!cancelled) {
          setStatus("success");
          setMessage(
            data?.message || "Your email is verified."
          );
        }
      } catch (error) {
        if (!cancelled) {
          setStatus("error");
          setMessage(
            error?.response?.data?.message ||
              "We could not verify your email. The link may have expired."
          );
        }
      }
    }

    verifyEmail();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isError = status === "error";

  return (
    <AuthLayout
      eyebrow="email verification"
      title={
        isSuccess
          ? "Your email is confirmed"
          : isError
            ? "Verification needs attention"
            : "Verify your account"
      }
      subtitle={
        isSuccess
          ? "You can sign in and start using VerifAI."
          : isError
            ? "We couldn't complete the verification process."
            : "This link will complete your account verification."
      }
    >
      <div className="relative">
        {/* Dark moon ambient glow */}
        <div
          className={`pointer-events-none absolute -inset-10 -z-10 rounded-[2rem] blur-3xl ${
            isSuccess
              ? "bg-violet-600/[0.06]"
              : isError
                ? "bg-red-600/[0.04]"
                : "bg-purple-600/[0.04]"
          }`}
        />

        <div
          className={`
            relative overflow-hidden rounded-2xl border
            bg-ink-800/60 p-6
            shadow-2xl shadow-black/20
            ${
              isSuccess
                ? "border-violet-400/20"
                : isError
                  ? "border-red-500/30"
                  : "border-purple-400/15"
            }
          `}
        >
          {/* Status icon */}
          <div className="flex items-center gap-4">
            <div
              className={`
                flex h-12 w-12 shrink-0 items-center justify-center
                rounded-xl border
                ${
                  isSuccess
                    ? "border-violet-400/20 bg-violet-500/10 text-violet-400"
                    : isError
                      ? "border-red-500/20 bg-red-500/10 text-red-400"
                      : "border-purple-400/20 bg-purple-500/10 text-purple-300"
                }
              `}
            >
              {isLoading && (
                <Loader2 className="h-5 w-5 animate-spin" />
              )}

              {isSuccess && (
                <CheckCircle2 className="h-5 w-5" />
              )}

              {isError && (
                <AlertCircle className="h-5 w-5" />
              )}
            </div>

            {/* Status label */}
            <div>
              <span
                className={`
                  inline-flex rounded-full border px-3 py-1
                  font-mono text-[11px] font-semibold
                  uppercase tracking-[0.12em]
                  ${
                    isSuccess
                      ? "border-violet-400/20 bg-violet-500/10 text-violet-400"
                      : isError
                        ? "border-red-500/30 bg-red-500/10 text-red-400"
                        : "border-purple-400/20 bg-purple-500/10 text-purple-300"
                  }
                `}
              >
                {isSuccess
                  ? "Verified"
                  : isError
                    ? "Needs attention"
                    : "Checking"}
              </span>
            </div>
          </div>

          {/* Message */}
          <p className="mt-5 text-sm leading-6 text-mist-300">
            {message}
          </p>

          {/* Success confirmation */}
          {isSuccess && (
            <div className="mt-4 rounded-lg border border-violet-400/10 bg-violet-500/[0.04] px-4 py-3">
              <p className="font-mono text-[11px] text-violet-300">
                Your profile is ready for verified challenges.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              as={Link}
              to="/login"
              variant="verify"
            >
              Go to sign in
              <ArrowRight className="h-4 w-4" />
            </Button>

            {isError && (
              <Button
                as={Link}
                to="/register"
                variant="ghost"
              >
                Create account
              </Button>
            )}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}