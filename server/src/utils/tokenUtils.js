const crypto = require("crypto");

/**
 * Generates a cryptographically secure random token.
 *
 * Returns:
 * - rawToken     → Send to the user (email/link)
 * - hashedToken  → Store in the database
 */
const generateSecureToken = () => {
  // Generate a secure random token
  const rawToken = crypto.randomBytes(32).toString("hex");

  // Hash the token before storing it
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  return {
    rawToken,
    hashedToken,
  };
};

module.exports = {
  generateSecureToken,
};

