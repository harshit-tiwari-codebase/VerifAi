const test = require('node:test');
const assert = require('node:assert/strict');
const { buildVerificationUrl, buildPasswordResetUrl } = require('../src/utils/sendEmail');

test('buildVerificationUrl uses the backend verification endpoint', () => {
  process.env.API_URL = 'http://localhost:5000';
  assert.equal(buildVerificationUrl('abc123'), 'http://localhost:5000/api/auth/verify-email/abc123');
});

test('buildPasswordResetUrl uses the backend reset endpoint', () => {
  process.env.API_URL = 'http://localhost:5000';
  assert.equal(buildPasswordResetUrl('abc123'), 'http://localhost:5000/api/auth/reset-password/abc123');
});

test('buildVerificationUrl falls back to the backend port when only the client URL is configured', () => {
  delete process.env.API_URL;
  process.env.CLIENT_URL = 'http://localhost:5173';
  process.env.PORT = '3000';
  assert.equal(buildVerificationUrl('abc123'), 'http://localhost:3000/api/auth/verify-email/abc123');
});
