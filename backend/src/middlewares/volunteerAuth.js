const studentAuth = require("./studentAuth");

module.exports = function (req, res, next) {
  studentAuth(req, res, async () => {
    try {
      const Student = require("../models/Student");
      const student = await Student.findById(req.student.id).select("isVolunteer name email collegeCode");

      if (!student || !student.isVolunteer) {
        return res.status(403).json({ msg: "Volunteer access required" });
      }

      req.volunteer = student;
      next();
    } catch (error) {
      res.status(500).json({ msg: "Server error", error: error.message });
    }
  });
};