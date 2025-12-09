const Message = require("../models/Message");

// Get chat history for a student
const getChatHistory = async (req, res) => {
  try {
    const studentId = req.student.id;
    const { chat } = req.query;

    // Build query
    const query = { user: studentId };
    if (chat) {
      query.chat = chat;
    }

    // Fetch messages
    const messages = await Message.find(query)
      .sort({ createdAt: 1 })
      .lean();

    res.json({
      success: true,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        createdAt: msg.createdAt
      }))
    });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat history"
    });
  }
};

module.exports = {
  getChatHistory
};
