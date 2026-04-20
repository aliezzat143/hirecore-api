const express = require('express');
const authenticateToken = require('../middleware/auth');
const stripeController = require('../controllers/stripeControllers');

const router = express.Router();

// Webhook endpoint (must not have authentication)
router.post('/webhook', express.raw({ type: 'application/json' }), stripeController.handleWebhook);

// Payment intent endpoint
router.post('/create-payment-intent', authenticateToken, stripeController.createPaymentIntent);

module.exports = router;
