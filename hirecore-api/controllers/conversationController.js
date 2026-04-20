const Conversation = require('../models/conversation');
const validateObjectId = require('../utils/validateObjectId');

// Create conversation
exports.createConversation = async (req, res) => {
    const { recipientId } = req.body;
    if (!recipientId) {
        return res.status(400).json({ message: "Recipient ID required" });
    } else if (!validateObjectId(recipientId)) {
        return res.status(400).json({ message: "Invalid recipient ID" });
    } else if (recipientId === req.user.userId) {
        return res.status(400).json({ message: "Cannot start conversation with yourself" });
    } else {
        try {
            let conversation = await Conversation.findOne({
                members: { $all: [req.user.userId, recipientId] }
            });
            if (!conversation) {
                conversation = new Conversation({
                    members: [req.user.userId, recipientId]
                });
                await conversation.save();
            }
            res.status(201).json(conversation);

        } catch (err) {
            res.status(500).json({ message: 'Server error' });
        }
    }
};

// Get conversations for a user
exports.getConversations = async (req, res) => {
    const { userId } = req.params;
    
    if (!userId) {
        return res.status(400).json({ message: "User ID required" });
    }
    
    if (!validateObjectId(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
        const conversations = await Conversation.find({
            members: userId
        }).populate("members", "username");
        
        res.json(conversations);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
