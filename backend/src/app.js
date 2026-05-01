const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const socketHandler = require("./config/socketHandler");
const { initWhatsAppBot } = require("./bot/whatsappBot");
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

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Routes
app.use("/api/auth", require("./routes/adminRoutes"));
app.use("/api/college", require("./routes/collegeRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/guest", require("./routes/guestRoutes"));
app.use("/api", require("./routes/whatsappRoutes"));

// Socket.io connection handling
socketHandler(io);

// Initialize WhatsApp Bot
// try {
//   console.log("[App] Initializing WhatsApp Bot...");
//   const whatsappClient = initWhatsAppBot(io);
  
//   // Store client reference for graceful shutdown
//   app.set('whatsappClient', whatsappClient);
  
//   console.log("[App] WhatsApp Bot integration enabled");
//   console.log("[App] Bot will respond to messages containing 'askaksha'");
// } catch (error) {
//   console.error("[App] Failed to initialize WhatsApp Bot:", error.message);
//   console.log("[App] Continuing without WhatsApp integration");
// }

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n[App] Shutting down gracefully...');
  
  const whatsappClient = app.get('whatsappClient');
  if (whatsappClient) {
    try {
      await whatsappClient.destroy();
      console.log('[App] WhatsApp client closed');
    } catch (err) {
      console.error('[App] Error closing WhatsApp client:', err.message);
    }
  }
  
  process.exit(0);
});

module.exports = server;
