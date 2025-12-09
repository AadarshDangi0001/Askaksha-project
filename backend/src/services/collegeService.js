const College = require("../models/College");

// Get college by admin ID
exports.getCollegeByAdminId = async (adminId) => {
  try {
    return await College.findOne({ adminId });
  } catch (error) {
    throw new Error("Error fetching college: " + error.message);
  }
};

// Get college details by college code
exports.getCollegeByCode = async (collegeCode, Admin) => {
  try {
    // First try to find college directly by code (for guest users)
    let college = await College.findOne({ code: collegeCode });
    if (college) return college;
    
    // If not found, try finding by admin (for regular users)
    const admin = await Admin.findOne({ collegeCode });
    if (!admin) return null;
    
    return await College.findOne({ adminId: admin._id });
  } catch (error) {
    throw new Error("Error fetching college: " + error.message);
  }
};
