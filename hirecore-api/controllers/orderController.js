const Order = require('../models/order');
const Gig = require('../models/gig');
const uuid = require('uuid');
const validateObjectId = require('../utils/validateObjectId');

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { gigId } = req.body;

    if (!gigId) {
      return res.status(400).json({ message: 'Gig ID required' });
    }

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.userId.toString() === req.user.userId) {
      return res.status(400).json({ message: "You can't buy your own gig" });
    }

    const order = new Order({
      orderId: uuid.v4(),
      gigId: gig._id,
      clientId: req.user.userId,
      freelancerId: gig.userId,
      price: gig.price
    });

    await order.save();

    res.status(201).json(order);

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get orders
exports.getOrders = async (req, res) => {
  try {
    let orders;

    if (req.user.role === "client") {
     orders = await Order.find({ clientId: req.user.userId })
        .populate("gigId", "title price")
        .populate("freelancerId", "username");
    } else if (req.user.role === "freelancer") {
      orders = await Order.find({ freelancerId: req.user.userId })
        .populate("gigId", "title price")
        .populate("clientId", "username");
    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(orders);

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["pending", "in_progress", "delivered", "completed"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      order.clientId.toString() !== req.user.userId &&
      order.freelancerId.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: "Not your order" });
    }

    const freelancerAllowed = ["in_progress", "delivered"];
    const clientAllowed = ["completed"];

    if (req.user.role === "freelancer" && !freelancerAllowed.includes(status)) {
      return res.status(403).json({ message: "Freelancer cannot set this status" });
    }

    if (req.user.role === "client" && !clientAllowed.includes(status)) {
      return res.status(403).json({ message: "Client cannot set this status" });
    }

    order.status = status;
    await order.save();

    res.json(order);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
