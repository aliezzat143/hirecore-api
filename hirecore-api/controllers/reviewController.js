const Review = require('../models/review');
const validateObjectId = require('../utils/validateObjectId');
const calculateAverage = require('../utils/calculateAverage');

// Create review
exports.createReview = async (req, res) => {
    const { gigId, rating, comment } = req.body;

    if (!gigId || !rating || !comment) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (!validateObjectId(gigId)) {
        return res.status(400).json({ message: "Invalid gig ID" });
    }

    try {
        const review = new Review({
            gigId,
            userId: req.user.userId,
            rating,
            comment
        });
        await review.save();
        res.status(201).json(review);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get reviews for a gig
exports.getReviews = async (req, res) => {
    const { gigId } = req.params;
    if (!gigId) {
        return res.status(400).json({ message: "Gig ID required" });
    }
    if (!validateObjectId(gigId)) {
        return res.status(400).json({ message: "Invalid gig ID" });
    }
    try {
        const reviews = await Review.find({ gigId }).populate("userId", "username");
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
