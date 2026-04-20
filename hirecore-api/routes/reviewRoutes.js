const express = require('express');
const authenticateToken = require('../middleware/auth');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router.post('/', authenticateToken, reviewController.createReview);
router.get('/:gigId', authenticateToken, reviewController.getReviews);

module.exports = router;