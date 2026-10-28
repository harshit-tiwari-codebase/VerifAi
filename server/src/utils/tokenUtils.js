const crypto = require("crypto");

/**
 * Generate a secure random token for one-time-use links (email verification,
 * password reset, etc). Returns both the raw token (to email to the user)
 * and its SHA-256 hash (to store in the DB) — never store the raw token.
 *
 * @returns {{ rawToken: string, hashedToken: string }}
 */
const generateSecureToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = hashToken(rawToken);
  return { rawToken, hashedToken };
};

/**
 * Hash a raw token the same way generateSecureToken does, so an incoming
 * token from a URL param can be compared against the stored hash.
 *
 * @param {string} rawToken
 * @returns {string} SHA-256 hash (hex)
 */
const hashToken = (rawToken) => {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
};

module.exports = { generateSecureToken, hashToken };
