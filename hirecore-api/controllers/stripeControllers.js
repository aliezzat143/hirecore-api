const Gig = require('../models/gig');
const Order = require('../models/order');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const validateObjectId = require('../utils/validateObjectId');
const formatPrice = require('../utils/formatPrice');

// Create payment intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { gigId } = req.body;

    if (!gigId) {
      return res.status(400).json({ message: "Gig ID required" });
    }

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.userId.toString() === req.user.userId) {
      return res.status(400).json({ message: "You can't buy your own gig" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatPrice(gig.price),
      currency: "usd",
      metadata: {
        gigId: gig._id.toString(),
        clientId: req.user.userId,
        freelancerId: gig.userId.toString()
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (err) {
    console.error("Error in createPaymentIntent:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Handle successful payment
exports.handlePaymentSuccess = async (paymentIntent) => {
  try {
    const { gigId, clientId, freelancerId } = paymentIntent.metadata;

    if (!gigId || !clientId || !freelancerId) {
      console.error('Invalid payment metadata:', paymentIntent.metadata);
      return;
    }

    if (!validateObjectId(gigId) || !validateObjectId(clientId) || !validateObjectId(freelancerId)) {
      console.error('Invalid ObjectIds in metadata');
      return;
    }

    const gig = await Gig.findById(gigId);
    if (!gig) {
      console.error('Gig not found:', gigId);
      return;
    }

    const existingOrder = await Order.findOne({ orderId: paymentIntent.id });
    if (existingOrder) {
      console.log('Order already exists for payment intent:', paymentIntent.id);
      return;
    }

    const order = new Order({
      orderId: paymentIntent.id,
      gigId,
      clientId,
      freelancerId,
      price: paymentIntent.amount / 100,
      status: 'paid'
    });

    await order.save();
    console.log('Order created successfully:', order._id);
  } catch (err) {
    console.error('Error in handlePaymentSuccess:', err);
  }
};

// Handle failed payment
exports.handlePaymentFailed = async (paymentIntent) => {
  try {
    console.log('Payment failed for intent:', paymentIntent.id);
  } catch (err) {
    console.error('Error in handlePaymentFailed:', err);
  }
};

// Handle webhook
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await exports.handlePaymentSuccess(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await exports.handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook processing error:', err);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
};
