const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  collegeCode: { type: String, unique: true }
});

module.exports = mongoose.model("Admin", AdminSchema);
