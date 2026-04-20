module.exports = (io, socket) => {
  // User joins a conversation room
  socket.on('join-conversation', (conversationId, userId) => {
    socket.join(`conversation-${conversationId}`);
    socket.emit('joined-conversation', { 
      message: `Connected to conversation ${conversationId}` 
    });
    io.to(`conversation-${conversationId}`).emit('user-online', { 
      userId, 
      message: `User is now online` 
    });
  });

  // Leave conversation
  socket.on('leave-conversation', (conversationId, userId) => {
    socket.leave(`conversation-${conversationId}`);
    io.to(`conversation-${conversationId}`).emit('user-offline', { 
      userId, 
      message: 'User has left' 
    });
  });
};
