const College = require("../models/College");

const DEFAULT_BULLETINS = [
  {
    title: "Orientation Schedule",
    description: "Freshers orientation will be held next Monday at the main auditorium. Students should arrive 15 minutes early and carry their ID cards."
  },
  {
    title: "Exam Fee Reminder",
    description: "The exam fee submission window is open. Please complete payment before the deadline to avoid late charges and verification delays."
  },
  {
    title: "Library Hours Update",
    description: "The library will remain open from 8:00 AM to 8:00 PM on weekdays and 9:00 AM to 2:00 PM on Saturdays starting this week."
  },
  {
    title: "Placement Drive",
    description: "Final-year students interested in campus placements must register at the training and placement office before the announced cutoff date."
  },
  {
    title: "Attendance Notice",
    description: "Students must maintain the required attendance percentage in each subject to be eligible for semester exams and internal assessments."
  },
  {
    title: "Event Announcement",
    description: "The annual college cultural event will be announced soon. Volunteer registrations and performance sign-ups will open shortly."
  }
];

const ensureCollegeBulletins = async (college) => {
  if (!college) {
    return null;
  }

  if (!college.notices || college.notices.length === 0) {
    college.notices = DEFAULT_BULLETINS;
    await college.save();
  }

  return college;
};

// Get college by admin ID
exports.getCollegeByAdminId = async (adminId) => {
  try {
    const college = await College.findOne({ adminId });
    return await ensureCollegeBulletins(college);
  } catch (error) {
    throw new Error("Error fetching college: " + error.message);
  }
};

// Get college details by college code
exports.getCollegeByCode = async (collegeCode, Admin) => {
  try {
    // First try to find college directly by code (for guest users)
    let college = await College.findOne({ code: collegeCode });
    if (college) return await ensureCollegeBulletins(college);
    
    // If not found, try finding by admin (for regular users)
    const admin = await Admin.findOne({ collegeCode });
    if (!admin) return null;
    
    const adminCollege = await College.findOne({ adminId: admin._id });
    return await ensureCollegeBulletins(adminCollege);
  } catch (error) {
    throw new Error("Error fetching college: " + error.message);
  }
};

exports.DEFAULT_BULLETINS = DEFAULT_BULLETINS;
