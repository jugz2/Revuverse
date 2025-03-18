const express = require('express');
const router = express.Router();
const SMSController = require('../controllers/smsController');
const { protect } = require('../middleware/authMiddleware');

// Test Twilio configuration (protected)
router.get('/test-config', protect, SMSController.testTwilioConfig);

// Send SMS (protected)
router.post('/send', protect, SMSController.sendSMS);

// Send verification code (public)
router.post('/verify/send', SMSController.sendVerificationCode);

// Verify code (public)
router.post('/verify/check', SMSController.verifyCode);

module.exports = router;