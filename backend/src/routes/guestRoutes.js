const express = require("express");
const router = express.Router();
const { createGuestStudent, cleanupGuestStudents } = require("../controllers/guestController");
const auth = require("../middlewares/auth");

// Create guest student
router.post("/create", createGuestStudent);

// Cleanup old guest students (admin only)
router.delete("/cleanup", auth, cleanupGuestStudents);

module.exports = router;
