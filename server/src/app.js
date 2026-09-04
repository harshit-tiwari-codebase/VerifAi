const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes"); 
const challengeRoutes = require("./routes/challenge.routes")
// const challengeRoutes = require("./routes/challengeRoutes");
const { notFound, errorHandler } = require("../src/middlewares/errorMiddleware");

const app = express();

// Core middleware
// Log every request before it reaches a route. `dev` is compact and readable
// locally; `combined` preserves the standard production diagnostics format.
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Health check
app.get("/", (req, res) => res.send("VerifAI API is running"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/challenge", challengeRoutes);

// Error handling (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
