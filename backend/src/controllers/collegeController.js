const College = require("../models/College");

// Save or Update College
exports.saveCollege = async (req, res) => {
  try {
    const collegeData = req.body;

    let college = await College.findOne({ adminId: req.admin.id });

    if (college) {
      await College.updateOne({ adminId: req.admin.id }, collegeData);
      return res.json({ msg: "Updated successfully" });
    }

    await College.create({
      adminId: req.admin.id,
      ...collegeData
    });

    res.json({ msg: "College saved" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get College Details
exports.getCollege = async (req, res) => {
  try {
    const data = await College.findOne({ adminId: req.admin.id });
    res.json(data);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
