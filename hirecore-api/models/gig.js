const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gigSchema = new mongoose.Schema({
  title: { 
    type: String,
    required: true
  },
  description: { 
    type: String,
    required: true
  },
  price: { 
    type: Number,
    required: true
  },
  category:{
    type: String,
    required: true
  },
  images: [String],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Gig", gigSchema);