const express = require('express');
const authenticateToken = require('../middleware/auth');
const conversationController = require('../controllers/conversationController');

const router = express.Router();

router.post('/', authenticateToken, conversationController.createConversation);
router.get('/:userId', authenticateToken, conversationController.getConversations);

module.exports = router;