module.exports = (io, socket) => {
  // User typing indicator
  socket.on('user-typing', (data) => {
    const { conversationId, userId } = data;
    io.to(`conversation-${conversationId}`).emit('user-typing', { userId });
  });

  // User stopped typing
  socket.on('user-stopped-typing', (data) => {
    const { conversationId, userId } = data;
    io.to(`conversation-${conversationId}`).emit('user-stopped-typing', { userId });
  });
};
