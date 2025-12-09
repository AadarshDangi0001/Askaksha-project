const express = require("express");
const router = express.Router();
const { getChatHistory } = require("../controllers/chatController");
const studentAuth = require("../middlewares/studentAuth");

// Get chat history
router.get("/history", studentAuth, getChatHistory);

module.exports = router;
