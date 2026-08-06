import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance.js";
import AuthLayout from "../../../components/layout/AuthLayout.jsx";
import Button from "../../../components/ui/Button.jsx";

export default function VerifyEmailPage() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email address...");

  useEffect(() => {
    let cancelled = false;

    async function verifyEmail() {
      if (!token) {
        if (!cancelled) {
          setStatus("error");
          setMessage("This verification link is missing the token.");
        }
        return;
      }

      try {
        const { data } = await axiosInstance.get(`/auth/verify-email/${token}`);
        if (!cancelled) {
          setStatus("success");
          setMessage(data.message || "Your email is verified.");
        }
      } catch (error) {
        if (!cancelled) {
          setStatus("error");
          setMessage(error.response?.data?.message || "We could not verify your email. The link may have expired.");
        }
      }
    }

    verifyEmail();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <AuthLayout
      eyebrow="email verification"
      title={status === "success" ? "Your email is confirmed" : "Verify your account"}
      subtitle={status === "success" ? "You can sign in and start using VerifAI." : "This link will complete your account verification."}
    >
      <div className="rounded-2xl border border-ink-600 bg-ink-800/60 p-5 shadow-2xl shadow-black/20">
        <div className="space-y-3">
          <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status === "success" ? "bg-verify/15 text-verify" : status === "error" ? "bg-flag/15 text-flag" : "bg-signal/15 text-signal"}`}>
            {status === "success" ? "Verified" : status === "error" ? "Needs attention" : "Checking"}
          </div>

          <p className="text-sm leading-6 text-mist-300">{message}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button as={Link} to="/login" variant="verify">
            Go to sign in
          </Button>
          {status === "error" && (
            <Button as={Link} to="/register" variant="ghost">
              Create account
            </Button>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
