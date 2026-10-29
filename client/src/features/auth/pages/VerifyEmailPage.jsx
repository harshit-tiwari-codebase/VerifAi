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
          ? "You can sign in and start exploring challenges."
          : isError
            ? "We couldn't complete the verification process."
            : "Confirming your identity on the platform."
      }
    >
      <div className="relative">
        <div
          className={`
            relative overflow-hidden rounded-2xl border
            bg-[#171714] p-6
            shadow-xl
            ${
              isSuccess
                ? "border-[#34D399]/30"
                : isError
                  ? "border-[#F87171]/30"
                  : "border-[#30302B]"
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
                    ? "border-[#34D399]/30 bg-[#34D399]/10 text-[#34D399]"
                    : isError
                      ? "border-[#F87171]/30 bg-[#F87171]/10 text-[#F87171]"
                      : "border-[#FF6A3D]/30 bg-[#261912] text-[#FFB08E]"
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
                      ? "border-[#34D399]/30 bg-[#34D399]/10 text-[#34D399]"
                      : isError
                        ? "border-[#F87171]/30 bg-[#F87171]/10 text-[#F87171]"
                        : "border-[#FF6A3D]/30 bg-[#261912] text-[#FFD1BB]"
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
          <p className="mt-5 text-sm leading-6 text-[#AAA69B]">
            {message}
          </p>

          {/* Success confirmation */}
          {isSuccess && (
            <div className="mt-4 rounded-[10px] border border-[#FF6A3D]/20 bg-[#261912] px-4 py-3">
              <p className="font-mono text-[11px] text-[#FFD1BB]">
                Your profile is ready for verified engineering challenges.
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
