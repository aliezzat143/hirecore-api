const express = require('express');
const authenticateToken = require('../middleware/auth');
const messageController = require('../controllers/messageController');

const router = express.Router();

router.post('/', authenticateToken, messageController.createMessage);
router.get('/:conversationId', authenticateToken, messageController.getMessages);

module.exports = router;