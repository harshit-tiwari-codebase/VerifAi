const BREVO_EMAIL_API_URL = "https://api.brevo.com/v3/smtp/email";

const sendBrevoEmail = async ({ toEmail, toName, subject, html }) => {
  if (!process.env.BREVO_API_KEY) {
    return false;
  }

  const response = await fetch(BREVO_EMAIL_API_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL || process.env.FROM_EMAIL,
        name: process.env.BREVO_SENDER_NAME || process.env.FROM_NAME || "VerifAI",
      },
      to: [{ email: toEmail, name: toName || undefined }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Brevo email request failed (${response.status}): ${errorBody}`);
  }

  return true;
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
 * Premium developer-grade email shell modeled after Vercel / Linear / Supabase.
 * Features the signature VerifAI floral check-mark SVG, glowing ambient gradients,
 * monospace metadata chips, and responsive container layout.
 */
const renderEmailLayout = ({ title, preheader, badgeText, badgeColor, contentHtml }) => {
  const currentYear = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark light">
  <meta name="supported-color-schemes" content="dark light">
  <title>${title}</title>
  <style>
    :root {
      color-scheme: dark;
      supported-color-schemes: dark;
    }
    body {
      margin: 0;
      padding: 0;
      background-color: #05070B !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: #E2E8F0;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-collapse: separate;
    }
    a {
      text-decoration: none;
    }
    @media only screen and (max-width: 600px) {
      .email-wrapper {
        padding: 16px 8px !important;
      }
      .email-card {
        padding: 24px 20px !important;
        border-radius: 12px !important;
      }
      .brand-title {
        font-size: 20px !important;
      }
      .content-header {
        font-size: 19px !important;
      }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#05070B;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#E2E8F0;">

  <!-- Hidden preheader for email preview snippets -->
  <div style="display:none;font-size:1px;color:#05070B;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;">
    ${preheader} &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847;
  </div>

  <table width="100%" border="0" cellspacing="0" cellpadding="0" class="email-wrapper" style="background-color:#05070B;padding:48px 12px;">
    <tr>
      <td align="center">
        <!-- Inner wrapper container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:560px;">

          <!-- Outer Card with gradient border effect -->
          <tr>
            <td style="background:linear-gradient(180deg, rgba(168, 85, 247, 0.28) 0%, rgba(30, 41, 59, 0.4) 100%);padding:1px;border-radius:18px;box-shadow:0 24px 48px -12px rgba(0,0,0,0.7), 0 0 40px -10px rgba(168,85,247,0.15);">

              <!-- Inner Card Content Area -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" class="email-card" style="background-color:#090D16;border-radius:17px;overflow:hidden;padding:36px 36px 32px;">

                <!-- Header: Logo & Status Badge -->
                <tr>
                  <td style="padding-bottom:28px;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <!-- VerifAI Exact Floral-Check Logo -->
                        <td align="left" style="vertical-align:middle;">
                          <table border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="vertical-align:middle;padding-right:12px;">
                                <!-- Exact VerifAI 6-petal vector ring with cross-slash -->
                                <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;">
                                  <defs>
                                    <linearGradient id="vfDots" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                                      <stop stop-color="#A78BFA" />
                                      <stop offset="1" stop-color="#E879F9" />
                                    </linearGradient>
                                  </defs>
                                  <circle cx="24" cy="9" r="5.5" fill="url(#vfDots)" />
                                  <circle cx="37" cy="16.5" r="4.2" fill="url(#vfDots)" />
                                  <circle cx="37" cy="31.5" r="4.2" fill="url(#vfDots)" />
                                  <circle cx="24" cy="39" r="5.5" fill="url(#vfDots)" />
                                  <circle cx="11" cy="31.5" r="4.2" fill="url(#vfDots)" />
                                  <circle cx="11" cy="16.5" r="4.2" fill="url(#vfDots)" />
                                  <path d="M15 30L24 21L33 12" stroke="#0B0912" stroke-width="6.5" stroke-linecap="round" />
                                  <path d="M15 30L24 21L33 12" stroke="#FAFAFA" stroke-width="4.2" stroke-linecap="round" />
                                </svg>
                              </td>
                              <td style="vertical-align:middle;">
                                <span class="brand-title" style="font-size:21px;font-weight:700;color:#F8FAFC;letter-spacing:-0.4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                                  verifai<span style="color:#E879F9;margin-left:1px;">.</span>
                                </span>
                              </td>
                            </tr>
                          </table>
                        </td>

                        <!-- Notification Pill Badge -->
                        <td align="right" style="vertical-align:middle;">
                          <span style="display:inline-block;padding:4px 10px;border-radius:9999px;font-size:11px;font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;font-weight:600;letter-spacing:0.3px;text-transform:uppercase;background-color:${badgeColor.bg};color:${badgeColor.text};border:1px solid ${badgeColor.border};">
                            ${badgeText}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Main Body Content Slot -->
                <tr>
                  <td style="padding-top:28px;">
                    ${contentHtml}
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Subtle Email Footer -->
          <tr>
            <td style="padding:28px 16px 0;text-align:center;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    <span style="display:inline-block;height:6px;width:6px;border-radius:50%;background-color:#10B981;margin-right:6px;vertical-align:middle;"></span>
                    <span style="font-size:12px;font-family:'SFMono-Regular',Consolas,monospace;color:#64748B;">All Systems Operational</span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size:12px;color:#475569;line-height:18px;">
                    This automated message was sent by <strong style="color:#94A3B8;">VerifAI Security</strong>.<br>
                    You are receiving this because an action was initiated on your account.
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:14px;font-size:11px;font-family:'SFMono-Regular',Consolas,monospace;color:#334155;">
                    &copy; ${currentYear} VerifAI &bull; Autonomous Code Verification Platform
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
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

  const contentHtml = `
    <!-- Top Greeting -->
    <h1 class="content-header" style="margin:0 0 10px;font-size:22px;font-weight:700;color:#F8FAFC;letter-spacing:-0.4px;">
      Welcome to VerifAI
    </h1>
    <p style="margin:0 0 24px;font-size:14px;line-height:22px;color:#94A3B8;">
      Hey <strong style="color:#F1F5F9;">${name || "Developer"}</strong>, your account has been created. Click below to verify your email address and start solving sandboxed engineering challenges.
    </p>

    <!-- Glowing Primary CTA Button -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:8px 0 28px;">
      <tr>
        <td align="center">
          <table border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center" style="border-radius:10px;background:linear-gradient(135deg, #9333EA 0%, #C084FC 100%);box-shadow:0 8px 24px -4px rgba(147, 51, 234, 0.5);">
                <a href="${verifyUrl}" target="_blank" style="display:inline-block;padding:14px 34px;font-size:14px;font-weight:600;color:#FFFFFF;text-decoration:none;border-radius:10px;letter-spacing:0.2px;">
                  Verify Developer Account &rarr;
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Monospace Token Snippet Box -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#0D1322;border:1px solid rgba(255,255,255,0.07);border-radius:12px;margin:20px 0;padding:16px 18px;">
      <tr>
        <td>
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td style="font-size:11px;font-family:'SFMono-Regular',Consolas,monospace;text-transform:uppercase;color:#64748B;letter-spacing:0.5px;padding-bottom:6px;">
                Direct Verification Link
              </td>
            </tr>
            <tr>
              <td style="font-size:12px;font-family:'SFMono-Regular',Consolas,monospace;color:#C084FC;word-break:break-all;line-height:18px;">
                <a href="${verifyUrl}" style="color:#C084FC;text-decoration:none;">${verifyUrl}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Security Information Cards -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top:1px solid rgba(255,255,255,0.06);padding-top:20px;">
      <tr>
        <td style="font-size:12px;color:#64748B;line-height:19px;">
          <strong style="color:#94A3B8;">Security note:</strong> This activation link expires in <strong style="color:#F1F5F9;">24 hours</strong>. If you did not sign up for VerifAI, no action is required and you can safely ignore this email.
        </td>
      </tr>
    </table>
  `;

  const html = renderEmailLayout({
    title: "Verify your VerifAI account",
    preheader: "Confirm your email address to unlock production engineering challenges on VerifAI.",
    badgeText: "Account Verification",
    badgeColor: {
      bg: "rgba(168, 85, 247, 0.12)",
      text: "#C084FC",
      border: "rgba(168, 85, 247, 0.3)",
    },
    contentHtml,
  });

  try {
    const success = await sendBrevoEmail({
      toEmail,
      toName: name,
      subject: "Verify your VerifAI account",
      html,
    });

    if (!success) {
      console.warn("BREVO_API_KEY not configured; skipping verification email send");
      return;
    }
  } catch (error) {
    console.error("Failed to send verification email via Brevo:", error.message);
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

  const contentHtml = `
    <!-- Top Greeting -->
    <h1 class="content-header" style="margin:0 0 10px;font-size:22px;font-weight:700;color:#F8FAFC;letter-spacing:-0.4px;">
      Password Reset Request
    </h1>
    <p style="margin:0 0 24px;font-size:14px;line-height:22px;color:#94A3B8;">
      Hi <strong style="color:#F1F5F9;">${name || "there"}</strong>, we received a request to reset the password for your <span style="color:#C084FC;font-weight:600;">VerifAI</span> account. Click below to specify a new password.
    </p>

    <!-- Danger Accent CTA Button -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:8px 0 28px;">
      <tr>
        <td align="center">
          <table border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center" style="border-radius:10px;background:linear-gradient(135deg, #E11D48 0%, #FB7185 100%);box-shadow:0 8px 24px -4px rgba(225, 29, 72, 0.5);">
                <a href="${resetUrl}" target="_blank" style="display:inline-block;padding:14px 34px;font-size:14px;font-weight:600;color:#FFFFFF;text-decoration:none;border-radius:10px;letter-spacing:0.2px;">
                  Reset Account Password &rarr;
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Monospace Token Snippet Box -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#180F14;border:1px solid rgba(244,63,94,0.18);border-radius:12px;margin:20px 0;padding:16px 18px;">
      <tr>
        <td>
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td style="font-size:11px;font-family:'SFMono-Regular',Consolas,monospace;text-transform:uppercase;color:#FB7185;letter-spacing:0.5px;padding-bottom:6px;">
                Alternative URL
              </td>
            </tr>
            <tr>
              <td style="font-size:12px;font-family:'SFMono-Regular',Consolas,monospace;color:#FDA4AF;word-break:break-all;line-height:18px;">
                <a href="${resetUrl}" style="color:#FDA4AF;text-decoration:none;">${resetUrl}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Urgency Notice -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top:1px solid rgba(255,255,255,0.06);padding-top:20px;">
      <tr>
        <td style="font-size:12px;color:#FDA4AF;line-height:19px;">
          <strong>Urgent:</strong> This link will expire in <strong>30 minutes</strong>. If you did not make this request, your account is still secure and you may safely ignore this message.
        </td>
      </tr>
    </table>
  `;

  const html = renderEmailLayout({
    title: "Reset your VerifAI password",
    preheader: "Secure link to reset your VerifAI account password.",
    badgeText: "Security Alert",
    badgeColor: {
      bg: "rgba(244, 63, 94, 0.12)",
      text: "#FB7185",
      border: "rgba(244, 63, 94, 0.3)",
    },
    contentHtml,
  });

  try {
    const success = await sendBrevoEmail({
      toEmail,
      toName: name,
      subject: "Reset your VerifAI password",
      html,
    });

    if (!success) {
      console.warn("BREVO_API_KEY not configured; skipping password reset email send");
      return;
    }
  } catch (error) {
    console.error("Failed to send password reset email via Brevo:", error.message);
    throw error;
  }
};

module.exports = {
  buildVerificationUrl,
  buildPasswordResetUrl,
  sendVerificationEmail,
  sendPasswordResetEmail,
};