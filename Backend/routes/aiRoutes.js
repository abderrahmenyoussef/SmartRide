const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// Endpoint de chat IA - protégé (utilisateur doit être connecté)
// Body: { message: string }
router.post('/chat', protect, chat);

module.exports = router;
