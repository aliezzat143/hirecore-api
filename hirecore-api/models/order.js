const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({
  _id: String, // uuid
  gigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gig"
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  price: Number,
  status: {
    type: String,
    enum: ["pending", "in_progress", "delivered", "completed"],
    default: "pending"
  },
  paymentIntent: {type: String}, // Stripe
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);