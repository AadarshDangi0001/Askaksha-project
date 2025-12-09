const Student = require("../models/Student");
const jwt = require("jsonwebtoken");
const College = require("../models/College");

// Create a guest student
const createGuestStudent = async (req, res) => {
  try {
    const { collegeCode } = req.body;

    // Find the college
    let college = await College.findOne({ code: collegeCode });
    
    if (!college) {
      // If college not found, use a default/guest college
      college = await College.findOne({ code: "GUEST" });
      
      // Create default guest college if it doesn't exist
      if (!college) {
        college = await College.create({
          name: "Guest College",
          code: "GUEST",
          domain: "guest.example.com",
          contactInfo: {
            email: "guest@example.com",
            phone: "0000000000"
          }
        });
      }
    }

    // Generate a unique guest ID
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    const guestId = `guest_${timestamp}_${randomNum}`;

    // Create guest student
    const guestStudent = await Student.create({
      name: `Guest User ${randomNum}`,
      email: `${guestId}@guest.temp`,
      password: Math.random().toString(36).substring(7), // Random password (won't be used)
      college: college._id,
      collegeCode: college.code,
      enrollmentNumber: guestId,
      isGuest: true,
      guestId: guestId
    });

    // Create JWT token (match format expected by socket handler)
    const token = jwt.sign(
      { student: { id: guestStudent._id }, isGuest: true },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    // Create chat ID
    const chatId = `guest-${college.code}-${timestamp}`;

    res.json({
      success: true,
      token,
      chatId,
      studentId: guestStudent._id,
      message: "Guest session created"
    });
  } catch (error) {
    console.error("Error creating guest student:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create guest session"
    });
  }
};

// Clean up old guest students (optional - can be run as a cron job)
const cleanupGuestStudents = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const result = await Student.deleteMany({
      isGuest: true,
      createdAt: { $lt: thirtyDaysAgo }
    });

    res.json({
      success: true,
      message: `Cleaned up ${result.deletedCount} old guest students`
    });
  } catch (error) {
    console.error("Error cleaning up guest students:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cleanup guest students"
    });
  }
};

module.exports = {
  createGuestStudent,
  cleanupGuestStudents
};
