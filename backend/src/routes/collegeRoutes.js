const express = require("express");
const router = express.Router();
const collegeController = require("../controllers/collegeController");
const auth = require("../middlewares/auth");

// Save or Update College
router.post("/save", auth, collegeController.saveCollege);

// Get College Details
router.get("/my", auth, collegeController.getCollege);

module.exports = router;
