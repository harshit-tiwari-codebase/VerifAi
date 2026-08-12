const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes"); 
const challengeRoutes = require("./routes/challenge.routes")
// const challengeRoutes = require("./routes/challengeRoutes");
const { notFound, errorHandler } = require("../src/middlewares/errorMiddleware");

const app = express();

// Core middleware
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
// app.use("/api/challenges", challengeRoutes);


//  challenge routes
app.use("/api/challenge",challengeRoutes);

// TODO: add this in Phase 3 (Judge0 execution + AI evaluation)
// app.use("/api/submissions", submissionRoutes);

// Error handling (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
