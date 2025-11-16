const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = require("./app");
const { connectDB } = require("./config/database");

const PORT = process.env.PORT || 5001;

// Create http server for socket.io
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("✓ User connected to Socket.io:", socket.id);
  socket.on("disconnect", () => console.log("✗ User disconnected:", socket.id));
});

// Start server
const startServer = async () => {
  try {
    // Connect to PostgreSQL
    await connectDB();

    // Start HTTP server
    server.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (err) {
    console.error("✗ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
