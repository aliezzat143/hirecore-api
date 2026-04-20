const Message = require('../../models/message');

module.exports = (io, socket) => {
  // Send message in real-time
  socket.on('send-message', async (data) => {
    const { conversationId, senderId, content } = data;
    
    try {
      const message = new Message({
        conversationId,
        senderId,
        content
      });
      await message.save();
      
      // Broadcast message to all users in conversation
      io.to(`conversation-${conversationId}`).emit('new-message', {
        _id: message._id,
        conversationId,
        senderId,
        content,
        createdAt: message.createdAt
      });
    } catch (err) {
      console.error('Error saving message:', err);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });
};
