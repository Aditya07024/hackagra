const Review = require('../models/Review');
const User = require('../models/User');

exports.createReview = async (req, res) => {
  try {
    const { seniorId, rating, comment } = req.body;
    const reviewerId = req.user.id; // Assuming user ID is available from authentication middleware

    if (!seniorId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Senior ID, rating, and comment are required' });
    }

    // Check if the senior exists and is actually a senior profile
    const senior = await User.findById(seniorId);
    if (!senior || !senior.isSeniorProfileActive) {
      return res.status(404).json({ success: false, message: 'Senior profile not found or not active' });
    }

    // Ensure the reviewer is not the senior themselves
    if (reviewerId.toString() === seniorId.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot review your own profile' });
    }

    // Create the review
    const review = await Review.create({
      senior: seniorId,
      reviewer: reviewerId,
      rating,
      comment,
    });

    // Add the review to the senior's reviews array
    senior.reviews.push(review._id);

    // Calculate and update average rating
    const reviews = await Review.find({ senior: seniorId });
    const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    senior.averageRating = reviews.length > 0 ? (totalRating / reviews.length) : 0;

    await senior.save();

    res.status(201).json({ success: true, message: 'Review submitted successfully', data: review });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ success: false, message: 'Failed to submit review', error: error.message });
  }
};
