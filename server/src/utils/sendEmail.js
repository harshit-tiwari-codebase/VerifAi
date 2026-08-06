const { Resend } = require("resend");

const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
};

const buildVerificationUrl = (token) => {
  const apiBaseUrl = process.env.API_URL || process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3000}`;
  return `${apiBaseUrl}/api/auth/verify-email/${token}`;
};

const buildPasswordResetUrl = (token) => {
  const apiBaseUrl = process.env.API_URL || process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3000}`;
  return `${apiBaseUrl}/api/auth/reset-password/${token}`;
};

/**
 * Send an email verification link to a newly registered user.
 *
 * @param {string} toEmail - Recipient's email address.
 * @param {string} name - Recipient's name, used in the greeting.
 * @param {string} token - Raw verification token (not hashed) to embed in the link.
 */
const sendVerificationEmail = async (toEmail, name, token) => {
  const verifyUrl = buildVerificationUrl(token);

  try {
    const resend = getResendClient();
    if (!resend) {
      console.warn("RESEND_API_KEY not configured; skipping verification email send");
      return;
    }

    await resend.emails.send({
      from: process.env.FROM_EMAIL || "onboarding@resend.dev",
      to: toEmail,
      subject: "Verify your VerifAI account",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
          <h2>Welcome to VerifAI, ${name}!</h2>
          <p>Please verify your email address to activate your account.</p>
          <a href="${verifyUrl}" style="display:inline-block;padding:10px 20px;background:#4F46E5;color:#fff;text-decoration:none;border-radius:6px;">
            Verify Email
          </a>
          <p style="margin-top:20px;color:#666;font-size:13px;">
            This link expires in 24 hours. If you didn't create this account, ignore this email.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send verification email:", error.message);
    // Don't throw — registration should still succeed even if email fails to send
  }
};

/**
 * Send a password reset email.
 *
 * @param {string} toEmail - Recipient's email address.
 * @param {string} name - Recipient's name.
 * @param {string} token - Raw password reset token.
 */
const sendPasswordResetEmail = async (toEmail, name, token) => {
  const resetUrl = buildPasswordResetUrl(token);

  try {
    const resend = getResendClient();
    if (!resend) {
      console.warn("RESEND_API_KEY not configured; skipping password reset email send");
      return;
    }

    await resend.emails.send({
      from: process.env.FROM_EMAIL || "onboarding@resend.dev",
      to: toEmail,
      subject: "Reset your VerifAI password",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
          <h2>Hello ${name},</h2>

          <p>We received a request to reset your VerifAI account password.</p>

          <p>If you requested this password reset, click the button below.</p>

          <a
            href="${resetUrl}"
            style="
              display:inline-block;
              padding:12px 20px;
              background:#EF4444;
              color:#ffffff;
              text-decoration:none;
              border-radius:6px;
              font-weight:bold;
            "
          >
            Reset Password
          </a>

          <p style="margin-top:20px;color:#666;font-size:13px;">
            This link will expire in <strong>30 minutes</strong>.
          </p>

          <p style="margin-top:20px;color:#666;font-size:13px;">
            If you did not request a password reset, you can safely ignore this email.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send password reset email:", error.message);
    throw error;
  }
};

module.exports = {
  buildVerificationUrl,
  buildPasswordResetUrl,
  sendVerificationEmail,
  sendPasswordResetEmail,
};