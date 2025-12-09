const Message = require("../models/Message");
const Admin = require("../models/Admin");
const College = require("../models/College");

// Get chat logs for admin's college (last 24 hours)
const getChatLogs = async (req, res) => {
  try {
    const adminId = req.admin.id;

    // Get admin's college
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const college = await College.findOne({ adminId: adminId });
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    // Get all students from this college
    const Student = require("../models/Student");
    const students = await Student.find({ collegeCode: admin.collegeCode }).select('_id');
    const studentIds = students.map(s => s._id);

    // Get messages from last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const messages = await Message.find({
      user: { $in: studentIds },
      createdAt: { $gte: twentyFourHoursAgo }
    })
    .sort({ createdAt: -1 })
    .select('content role createdAt')
    .lean();

    res.json({
      success: true,
      totalMessages: messages.length,
      messages: messages
    });
  } catch (error) {
    console.error("Error fetching chat logs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat logs"
    });
  }
};

module.exports = {
  getChatLogs
};
