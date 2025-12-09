const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: false // Allow null for WhatsApp guest users
  },
  chat: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["user", "model"],
    required: true
  },
  platform: {
    type: String,
    enum: ["web", "whatsapp"],
    default: "web"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

MessageSchema.index({ chat: 1, createdAt: -1 });
MessageSchema.index({ user: 1 });
MessageSchema.index({ platform: 1 });

module.exports = mongoose.model("Message", MessageSchema);
