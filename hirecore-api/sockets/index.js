const messageHandler = require('./handlers/messageHandler');
const conversationHandler = require('./handlers/conversationHandler');
const typingHandler = require('./handlers/typingHandler');

module.exports = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true
    }
  });

  // Socket.IO connection handling
  io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    // Load all handlers
    messageHandler(io, socket);
    conversationHandler(io, socket);
    typingHandler(io, socket);

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};