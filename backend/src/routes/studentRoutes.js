const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const auth = require("../middlewares/studentAuth");

// Student Signup
router.post("/signup", studentController.signup);

// Student Login
router.post("/login", studentController.login);

// Get Student Dashboard
router.get("/dashboard", auth, studentController.getDashboard);

module.exports = router;
