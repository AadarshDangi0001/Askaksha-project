const mongoose = require("mongoose");

const MemorySchema = new mongoose.Schema({
  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    required: true
  },
  vectors: {
    type: [Number],
    required: true
  },
  metadata: {
    chat: String,
    user: mongoose.Schema.Types.ObjectId,
    text: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

MemorySchema.index({ "metadata.user": 1 });
MemorySchema.index({ "metadata.chat": 1 });

module.exports = mongoose.model("Memory", MemorySchema);
