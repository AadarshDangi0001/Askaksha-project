const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  collegeCode: String,
  college: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
  enrollmentNumber: String,
  isGuest: { type: Boolean, default: false },
  guestId: { type: String, sparse: true }
}, {
  timestamps: true
});

module.exports = mongoose.model("Student", StudentSchema);
