const express = require('express');
const router = express.Router();
const { 
  getReviews, 
  getReview, 
  fetchExternalReviews, 
  replyToReview,
  getReviewAnalytics
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected and require authentication
router.use(protect);

// @route   GET /api/reviews/business/:businessId
// @desc    Get all reviews for a specific business
// @access  Private
router.get('/business/:businessId', getReviews);

// @route   GET /api/reviews/:id
// @desc    Get a single review by ID
// @access  Private
router.get('/:id', getReview);

// @route   POST /api/reviews/fetch/:businessId
// @desc    Fetch reviews from external platforms (Google, Facebook, etc.)
// @access  Private
router.post('/fetch/:businessId', fetchExternalReviews);

// @route   POST /api/reviews/:id/reply
// @desc    Reply to a review on external platforms
// @access  Private
router.post('/:id/reply', replyToReview);

// @route   GET /api/reviews/analytics/:businessId
// @desc    Get review analytics for a business
// @access  Private
router.get('/analytics/:businessId', getReviewAnalytics);

module.exports = router; 