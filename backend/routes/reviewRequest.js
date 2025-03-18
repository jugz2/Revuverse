const express = require('express');
const router = express.Router();
const { 
  createReviewRequest, 
  getReviewRequests, 
  getReviewRequest, 
  updateReviewRequest, 
  deleteReviewRequest,
  sendReviewRequestEmail,
  sendReviewRequestSMS,
  getReviewRequestAnalytics
} = require('../controllers/reviewRequestController');
const { protect } = require('../middleware/authMiddleware');

// Public route for customers to view the feedback form
router.get('/form/:requestId', getReviewRequest);

// All other routes are protected and require authentication
router.use(protect);

// @route   POST /api/review-request
// @desc    Create a new review request
// @access  Private
router.post('/', createReviewRequest);

// @route   GET /api/review-request
// @desc    Get all review requests for the user's businesses
// @access  Private
router.get('/', getReviewRequests);

// @route   GET /api/review-request/business/:businessId
// @desc    Get all review requests for a specific business
// @access  Private
router.get('/business/:businessId', getReviewRequests);

// @route   GET /api/review-request/:id
// @desc    Get a single review request by ID
// @access  Private
router.get('/:id', getReviewRequest);

// @route   PUT /api/review-request/:id
// @desc    Update a review request
// @access  Private
router.put('/:id', updateReviewRequest);

// @route   DELETE /api/review-request/:id
// @desc    Delete a review request
// @access  Private
router.delete('/:id', deleteReviewRequest);

// @route   POST /api/review-request/:id/send-email
// @desc    Send a review request via email
// @access  Private
router.post('/:id/send-email', sendReviewRequestEmail);

// @route   POST /api/review-request/:id/send-sms
// @desc    Send a review request via SMS
// @access  Private
router.post('/:id/send-sms', sendReviewRequestSMS);

// @route   GET /api/review-request/analytics/:businessId
// @desc    Get review request analytics for a business
// @access  Private
router.get('/analytics/:businessId', getReviewRequestAnalytics);

module.exports = router; 