require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const app = require("./src/app");
const connectDB = require("./src/config/db");
const { setIO } = require("./src/socket");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

const jwt = require("jsonwebtoken");

app.set("io", io);
setIO(io);

// Authenticate socket connections via verified token (§7)
io.use((socket, next) => {
  const token =
    socket.handshake.auth?.token ||
    (socket.handshake.headers?.authorization &&
      socket.handshake.headers.authorization.split(" ")[1]);

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    socket.user = decoded;
    return next();
  } catch (err) {
    return next(new Error("Authentication error: invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  if (socket.user?.id) {
    socket.join(socket.user.id.toString());
  }

  // Prevent clients from joining another user's submission-status room (§7)
  socket.on("join", (targetUserId) => {
    if (socket.user?.id && String(targetUserId) === String(socket.user.id)) {
      socket.join(socket.user.id.toString());
    } else {
      console.warn(`Unauthorized room join attempt for ${targetUserId} by ${socket.id}`);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start background workers (same process, fine for free-tier/dev)
require("./src/workers/execution.worker");
require("./src/workers/aiEvaluation.worker");

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`VerifAI server listening on port ${PORT}`);
  });
});