const Message = require('../models/message');
const Conversation = require('../models/conversation');
const validateObjectId = require('../utils/validateObjectId');

// Create message
exports.createMessage = async (req, res) => {
    const { conversationId, content } = req.body;
    if (!conversationId || !content) {
        return res.status(400).json({ message: "Conversation ID and content required" });
    } else if (!validateObjectId(conversationId)) {
        return res.status(400).json({ message: "Invalid conversation ID" });
    } else if (content.trim() === "") {
        return res.status(400).json({ message: "Message content cannot be empty" });
    } else {
        try {
            const conversation = await Conversation.findById(conversationId);
            if (!conversation){
                return res.status(404).json({ message: "Conversation not found" });
            }
            if (!conversation.members.includes(req.user.userId)) {
                return res.status(403).json({ message: "Access denied" });
            }
            const message = new Message({
                conversationId,
                senderId: req.user.userId,
                content
            });
            await message.save();
            res.status(201).json(message);
        } catch (err) {
            res.status(500).json({ message: 'Server error' });
        }
    }
};

// Get messages for a conversation
exports.getMessages = async (req, res) => {
    const { conversationId } = req.params;
    if (!conversationId) {
        return res.status(400).json({ message: "Conversation ID required" });
    } else if (!validateObjectId(conversationId)) {
        return res.status(400).json({ message: "Invalid conversation ID" });
    }
    try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        } else if (!conversation.members.includes(req.user.userId)) {
            return res.status(403).json({ message: "Access denied" });
        } else {
            const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
            res.json(messages);
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
