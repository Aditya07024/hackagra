const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware'); // Assuming you have an auth middleware

/**
 * @route POST /api/reviews
 * @desc Create a new review
 * @access Private
 */
router.post('/', protect, reviewController.createReview);

module.exports = router;
