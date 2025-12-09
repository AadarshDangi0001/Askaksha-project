const express = require('express');
const router = express.Router();

// Store WhatsApp bot stats (in-memory for now)
let whatsappStats = {
  isConnected: false,
  messagesReceived: 0,
  messagesSent: 0,
  lastActivity: null,
  startTime: Date.now()
};

// Get WhatsApp bot status
router.get('/whatsapp/status', (req, res) => {
  res.json({
    success: true,
    stats: {
      ...whatsappStats,
      uptime: Date.now() - whatsappStats.startTime
    }
  });
});

// Update stats (called internally by WhatsApp bot)
router.post('/whatsapp/stats', (req, res) => {
  const { action, data } = req.body;
  
  switch(action) {
    case 'connected':
      whatsappStats.isConnected = true;
      whatsappStats.lastActivity = Date.now();
      break;
    case 'disconnected':
      whatsappStats.isConnected = false;
      whatsappStats.lastActivity = Date.now();
      break;
    case 'message_received':
      whatsappStats.messagesReceived++;
      whatsappStats.lastActivity = Date.now();
      break;
    case 'message_sent':
      whatsappStats.messagesSent++;
      whatsappStats.lastActivity = Date.now();
      break;
  }
  
  res.json({ success: true });
});

// Reset stats
router.post('/whatsapp/reset-stats', (req, res) => {
  whatsappStats = {
    isConnected: whatsappStats.isConnected,
    messagesReceived: 0,
    messagesSent: 0,
    lastActivity: whatsappStats.lastActivity,
    startTime: Date.now()
  };
  
  res.json({ success: true, message: 'Stats reset successfully' });
});

module.exports = router;
