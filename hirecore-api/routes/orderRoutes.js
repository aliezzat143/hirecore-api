const express = require('express');
const authenticateToken = require('../middleware/auth');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.post('/', authenticateToken, orderController.createOrder);
router.get('/', authenticateToken, orderController.getOrders);
router.put('/:id/status', authenticateToken, orderController.updateOrderStatus);

module.exports = router;