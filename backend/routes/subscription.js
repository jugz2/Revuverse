const express = require('express');
const router = express.Router();
const { 
  getSubscription, 
  updateSubscription, 
  createCheckoutSession,
  handleWebhook,
  cancelSubscription
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

// Webhook route for Stripe (needs to be public)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// All other routes are protected and require authentication
router.use(protect);

// @route   GET /api/subscription
// @desc    Get current user's subscription
// @access  Private
router.get('/', getSubscription);

// @route   PUT /api/subscription
// @desc    Update subscription (change plan)
// @access  Private
router.put('/', updateSubscription);

// @route   POST /api/subscription/checkout
// @desc    Create a checkout session for subscription
// @access  Private
router.post('/checkout', createCheckoutSession);

// @route   POST /api/subscription/cancel
// @desc    Cancel current subscription
// @access  Private
router.post('/cancel', cancelSubscription);

module.exports = router; 