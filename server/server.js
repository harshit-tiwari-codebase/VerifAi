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

app.set("io", io);
setIO(io);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
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