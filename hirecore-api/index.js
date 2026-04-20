require('dotenv').config();
const PORT = process.env.PORT || 3000;
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');

// Import database connection
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const gigRoutes = require('./routes/gigRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const stripeRoutes = require('./routes/stripeRoutes');

// Import socket handler
const socketHandler = require('./socket/index');

const app = express();

// Middleware (in correct order)
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

// Rate limiting (before express.json)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50
});
app.use(limiter);

app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/stripe', stripeRoutes);

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
socketHandler(server);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong' });
});

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});