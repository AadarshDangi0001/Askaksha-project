const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { getChatLogs } = require("../controllers/logsController");
const auth = require("../middlewares/auth");

// Admin Signup
router.post("/signup", adminController.signup);

// Admin Login
router.post("/login", adminController.login);

// Get Admin Info
router.get("/me", auth, adminController.getAdminInfo);

// Get Dashboard Stats
router.get("/dashboard", auth, adminController.getDashboard);

// Get Chat Logs
router.get("/logs", auth, getChatLogs);

module.exports = router;
