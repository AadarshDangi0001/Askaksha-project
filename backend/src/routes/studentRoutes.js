const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const volunteerController = require("../controllers/volunteerController");
const auth = require("../middlewares/studentAuth");
const volunteerAuth = require("../middlewares/volunteerAuth");

// Student Signup
router.post("/signup", studentController.signup);

// Student Login
router.post("/login", studentController.login);

// Get Student Dashboard
router.get("/dashboard", auth, studentController.getDashboard);

// Volunteer help for students
router.post("/volunteer/questions", auth, volunteerController.submitQuestion);
router.get("/volunteer/questions", auth, volunteerController.getStudentQuestions);
router.get("/volunteer/feed", auth, volunteerController.getCollegeFeed);
router.get("/volunteer/assigned", volunteerAuth, volunteerController.getVolunteerInbox);
router.post("/volunteer/questions/:questionId/reply", volunteerAuth, volunteerController.replyToQuestion);

module.exports = router;
