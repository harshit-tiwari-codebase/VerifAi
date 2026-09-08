const jwt = require("jsonwebtoken");

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const headerToken =
    authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  const token = headerToken || req.cookies?.accessToken;

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    req.user = err ? null : decoded;
    next();
  });
};

module.exports = optionalAuth;


