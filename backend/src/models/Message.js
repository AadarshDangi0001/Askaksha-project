const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

MessageSchema.index({ chat: 1, createdAt: -1 });
MessageSchema.index({ user: 1 });

module.exports = mongoose.model("Message", MessageSchema);
