// whatsappBot.js
const qrcodeTerminal = require("qrcode-terminal");
const path = require("path");
const { Client, LocalAuth, DisconnectReason } = require("whatsapp-web.js");
const { generateMessage, generateQRCode } = require("./whatsappServer");
const Message = require("../models/Message");
const Student = require("../models/Student");

function initWhatsAppBot(io) {
  let isDestroying = false;
  
  const client = new Client({
    authStrategy: new LocalAuth({
      clientId: "askaksha-bot-1",
      dataPath: path.join(__dirname, ".wwebjs_auth"),
    }),
    puppeteer: {
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--single-process=false",
      ],
    },
  });

  client.on("qr", async (qr) => {
    try {
      console.log("[WhatsApp Bot] QR Code generated");
      qrcodeTerminal.generate(qr, { small: true });

      if (io) {
        try {
          const qrDataUrl = await generateQRCode(qr);
          io.emit("whatsapp-qr", { qr, qrDataUrl, status: "pending" });
        } catch (qrErr) {
          io.emit("whatsapp-qr", { qr, status: "pending" });
        }
      }
    } catch (err) {
      console.error("[WhatsApp Bot] QR generation error:", err.message);
      if (io) {
        io.emit("whatsapp-error", { type: "qr_generation", message: "Failed to generate QR" });
      }
    }
  });

  client.on("authenticated", () => {
    console.log("[WhatsApp Bot] Authenticated successfully");
    if (io) io.emit("whatsapp-status", { type: "authenticated" });
  });

  client.on("ready", () => {
    console.log("[WhatsApp Bot] Ready to receive messages!");
    if (io) io.emit("whatsapp-status", { type: "ready" });
  });

  client.on("disconnected", (reason) => {
    console.log("[WhatsApp Bot] Disconnected:", reason);
    if (io) io.emit("whatsapp-status", { type: "disconnected", reason });

    if (reason === DisconnectReason.LOGGED_OUT) {
      setTimeout(() => {
        try {
          if (!isDestroying) {
            console.log("[WhatsApp Bot] Reconnecting...");
            client.initialize();
          }
        } catch (err) {
          console.error("[WhatsApp Bot] Reconnect failed:", err.message);
          if (io) {
            io.emit("whatsapp-error", { type: "reconnect_failed", message: "Failed to reconnect" });
          }
        }
      }, 3000);
    } else {
      try {
        if (!isDestroying) {
          client.initialize();
        }
      } catch (err) {
        console.error("[WhatsApp Bot] Reconnect failed:", err.message);
        if (io) {
          io.emit("whatsapp-error", { type: "reconnect_failed", message: "Failed to reconnect" });
        }
      }
    }
  });

  // Handle Puppeteer/Protocol errors
  client.on("error", (err) => {
    console.error("[WhatsApp Bot] Error:", err.message);
    if (err.message.includes("Execution context was destroyed") || 
        err.message.includes("Protocol error")) {
      isDestroying = true;
      if (io) {
        io.emit("whatsapp-error", { type: "puppeteer_crash", message: "Browser context lost, reconnecting..." });
      }
      
      setTimeout(() => {
        try {
          isDestroying = false;
          client.initialize();
        } catch (e) {
          console.error("[WhatsApp Bot] Recovery failed:", e.message);
          if (io) {
            io.emit("whatsapp-error", { type: "recovery_failed", message: "Failed to recover connection" });
          }
        }
      }, 5000);
    }
  });

  // Global process error handler
  process.on("unhandledRejection", (reason) => {
    if (reason?.message?.includes("Execution context was destroyed") ||
        reason?.message?.includes("Protocol error")) {
      isDestroying = true;
      if (io) {
        io.emit("whatsapp-error", { type: "context_destroyed", message: "Recovering connection..." });
      }
      
      setTimeout(() => {
        try {
          isDestroying = false;
          client.initialize();
        } catch (e) {
          console.error("[WhatsApp Bot] Recovery failed");
        }
      }, 5000);
    }
  });

  // MAIN CHAT LOGIC - Trigger on "askaksha"
  client.on("message", async (msg) => {
    const chatId = msg.from;
    const text = (msg.body || "").trim();
    if (!text) return;
    if (msg.fromMe) return;

    const lowerText = text.toLowerCase();
    
    // Check if message contains "askaksha"
    if (!lowerText.includes("askaksha")) {
      return; // Only respond to messages containing "askaksha"
    }

    console.log(`[WhatsApp Bot] Message from ${chatId}: ${text}`);

    if (io) {
      io.emit("whatsapp-message", {
        direction: "in",
        from: chatId,
        text,
        timestamp: Date.now(),
      });
    }

    try {
      // Extract the actual question (remove "askaksha" keyword)
      let userQuestion = text
        .replace(/askaksha/gi, "")
        .replace(/^[,.\s]+|[,.\s]+$/g, "")
        .trim();

      // If only "askaksha" was sent, show greeting
      if (!userQuestion || ["hi", "hello", "hey"].includes(userQuestion.toLowerCase())) {
        const greeting =
          "Hello 👋\n\n" +
          "I'm *AskKaksha*, your AI educational assistant!\n\n" +
          "Ask me anything about:\n" +
          "📚 Studies & Education\n" +
          "💡 Homework & Assignments\n" +
          "🎓 College Information\n" +
          "🤔 Any doubts or questions\n\n" +
          "_Just type 'askaksha' followed by your question!_";
        
        try {
          await client.sendMessage(chatId, greeting);
        } catch (sendErr) {
          if (sendErr.message?.includes("Execution context was destroyed")) {
            isDestroying = true;
            setTimeout(() => { isDestroying = false; client.initialize(); }, 5000);
            return;
          }
          throw sendErr;
        }
        
        if (io) {
          io.emit("whatsapp-message", {
            direction: "out",
            to: chatId,
            text: greeting,
            timestamp: Date.now(),
          });
        }
        return;
      }

      // Send thinking message
      try {
        await msg.reply("🤔 Let me think...");
      } catch (replyErr) {
        if (replyErr.message?.includes("Execution context was destroyed")) {
          isDestroying = true;
          setTimeout(() => { isDestroying = false; client.initialize(); }, 5000);
          return;
        }
      }

      // Generate AI response with translation support
      let aiReply;
      try {
        console.log(`[WhatsApp Bot] Processing question: ${userQuestion}`);
        aiReply = await generateMessage(userQuestion);
        
        // Log to database (optional - as guest user)
        try {
          const whatsappNumber = chatId.replace("@c.us", "");
          await Message.create({
            user: null, // Guest user
            chat: `whatsapp_${whatsappNumber}`,
            content: userQuestion,
            role: "user",
            platform: "whatsapp"
          });
          
          await Message.create({
            user: null,
            chat: `whatsapp_${whatsappNumber}`,
            content: aiReply,
            role: "model",
            platform: "whatsapp"
          });
        } catch (dbErr) {
          // Don't fail if DB logging fails
          console.error("[WhatsApp Bot] DB logging error:", dbErr.message);
        }
        
      } catch (apiErr) {
        console.error("[WhatsApp Bot] API error:", apiErr.message);
        if (apiErr.status === 429) {
          const retryDelay = apiErr.response?.data?.details?.[2]?.retryDelay || "34s";
          aiReply = `⏳ I'm currently experiencing high traffic. Please try again in ${retryDelay}`;
        } else {
          aiReply = "Sorry, I'm experiencing some technical difficulties right now. Please try again in a moment 🙏";
        }
      }

      // Send AI response
      try {
        await client.sendMessage(chatId, aiReply);
        console.log(`[WhatsApp Bot] Response sent to ${chatId}`);
      } catch (sendErr) {
        if (sendErr.message?.includes("Execution context was destroyed")) {
          isDestroying = true;
          setTimeout(() => { isDestroying = false; client.initialize(); }, 5000);
          return;
        }
        throw sendErr;
      }

      if (io) {
        io.emit("whatsapp-message", {
          direction: "out",
          to: chatId,
          text: aiReply,
          timestamp: Date.now(),
        });
      }
    } catch (err) {
      console.error("[WhatsApp Bot] Error processing message:", err.message);
      
      // Check if it's a context destruction error
      if (err.message?.includes("Execution context was destroyed") ||
          err.message?.includes("Protocol error")) {
        isDestroying = true;
        if (io) {
          io.emit("whatsapp-error", { type: "context_error", message: "Recovering connection..." });
        }
        setTimeout(() => { isDestroying = false; client.initialize(); }, 5000);
        return;
      }

      const errorMsg =
        "⚠️ Sorry, I encountered a technical issue. Please try again in a moment 🙏";
      try {
        await msg.reply(errorMsg);
        if (io) {
          io.emit("whatsapp-message", {
            direction: "out",
            to: chatId,
            text: errorMsg,
            timestamp: Date.now(),
            error: true,
          });
        }
      } catch (e) {
        console.error("[WhatsApp Bot] Failed to send error message");
      }
    }
  });

  console.log("[WhatsApp Bot] Initializing...");
  client.initialize();
  return client;
}

module.exports = {
  initWhatsAppBot,
};