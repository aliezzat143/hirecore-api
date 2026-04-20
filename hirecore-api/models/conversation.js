const mongoose = require('mongoose');
const { updateMany } = require('./user');
const Schema = mongoose.Schema;

const conversationSchema = new mongoose.Schema({
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Conversation", conversationSchema);