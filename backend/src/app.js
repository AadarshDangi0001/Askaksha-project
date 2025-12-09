const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const socketHandler = require("./config/socketHandler");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for widget embedding
    methods: ["GET", "POST"]
  }
});

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: "*", // Allow all origins for widget embedding
  credentials: true
}));
app.use(express.json());

// Serve static files (widget script)
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.use("/api/auth", require("./routes/adminRoutes"));
app.use("/api/college", require("./routes/collegeRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/guest", require("./routes/guestRoutes"));

// Socket.io connection handling
socketHandler(io);

module.exports = server;
