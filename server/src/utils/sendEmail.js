const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send an email verification link to a newly registered user.
 *
 * @param {string} toEmail - Recipient's email address.
 * @param {string} name - Recipient's name, used in the greeting.
 * @param {string} token - Raw verification token (not hashed) to embed in the link.
 */
const sendVerificationEmail = async (toEmail, name, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

  try {
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

module.exports = { sendVerificationEmail };
