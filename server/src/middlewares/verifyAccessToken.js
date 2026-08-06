const jwt = require("jsonwebtoken");

const verifyAccessToken = (req, res, next) => {
  const authorization = req.headers.authorization;
  const tokenFromHeader = authorization && authorization.startsWith("Bearer ") ? authorization.slice(7) : null;
  const token = tokenFromHeader || req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  if (!process.env.ACCESS_TOKEN_SECRET) {
    console.error("ACCESS_TOKEN_SECRET is not defined");
    return res.status(500).json({ message: "Server configuration error" });
  }

  try {
    req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired access token" });
  }
};

module.exports = verifyAccessToken;
