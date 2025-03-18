const express = require('express');
const router = express.Router();
const { 
  createFeedback, 
  getBusinessFeedback, 
  getFeedback, 
  updateFeedbackStatus, 
  deleteFeedback,
  getFeedbackAnalytics,
  respondToFeedback
} = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

// Public route for customers to submit feedback
router.post('/submit/:businessId', createFeedback);

// All other routes are protected and require authentication
router.use(protect);

// @route   GET /api/feedback/analytics/:businessId
// @desc    Get feedback analytics for a business
// @access  Private
router.get('/analytics/:businessId', getFeedbackAnalytics);

// @route   GET /api/feedback/business/:businessId
// @desc    Get all feedback for a specific business
// @access  Private
router.get('/business/:businessId', getBusinessFeedback);

// @route   GET /api/feedback
// @desc    Get all feedback for the user's businesses
// @access  Private
router.get('/', getBusinessFeedback);

// @route   POST /api/feedback/:id/respond
// @desc    Respond to a feedback
// @access  Private
router.post('/:id/respond', respondToFeedback);

// @route   GET /api/feedback/:id
// @desc    Get a single feedback by ID
// @access  Private
router.get('/:id', getFeedback);

// @route   PUT /api/feedback/:id
// @desc    Update a feedback (mark as resolved, etc.)
// @access  Private
router.put('/:id', updateFeedbackStatus);

// @route   DELETE /api/feedback/:id
// @desc    Delete a feedback
// @access  Private
router.delete('/:id', deleteFeedback);

module.exports = router; 