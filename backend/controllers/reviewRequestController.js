const ReviewRequest = require('../models/ReviewRequest');
const Business = require('../models/Business');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');
const crypto = require('crypto');

/**
 * @desc    Create a new review request
 * @route   POST /api/reviews/request
 * @access  Private
 */
exports.createReviewRequest = async (req, res) => {
  try {
    const { businessId, customerName, customerEmail, customerPhone, requestMethod, message } = req.body;

    // Check if business exists and belongs to user
    const business = await Business.findById(businessId);
    
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }
    
    // Make sure user owns the business
    if (business.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to create review requests for this business'
      });
    }

    // Check if user has reached their review request limit (for free tier)
    if (req.user.subscription === 'free') {
      const subscription = await Subscription.findOne({ user: req.user.id });
      
      if (!subscription) {
        return res.status(400).json({
          success: false,
          message: 'Subscription not found'
        });
      }
      
      // Count review requests for this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const requestCount = await ReviewRequest.countDocuments({
        business: businessId,
        createdAt: { $gte: startOfMonth }
      });
      
      if (requestCount >= subscription.features.reviewRequestsLimit) {
        return res.status(400).json({
          success: false,
          message: `You have reached your monthly limit of ${subscription.features.reviewRequestsLimit} review requests. Please upgrade to premium.`
        });
      }
    }

    // Generate unique ID for tracking
    const uniqueId = crypto.randomBytes(16).toString('hex');

    // Create review request
    const reviewRequest = await ReviewRequest.create({
      business: businessId,
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone
      },
      requestMethod,
      message,
      uniqueId
    });

    // Generate feedback URL
    const feedbackUrl = `${process.env.FRONTEND_URL}/feedback/${uniqueId}`;

    // Send review request based on method
    if (requestMethod === 'email' || requestMethod === 'both') {
      if (customerEmail) {
        await emailService.sendReviewRequest({
          to: customerEmail,
          customerName,
          businessName: business.name,
          feedbackUrl
        });
      }
    }

    if (requestMethod === 'sms' || requestMethod === 'both') {
      if (customerPhone) {
        await smsService.sendReviewRequestSMS({
          to: customerPhone,
          businessName: business.name,
          feedbackUrl
        });
      }
    }

    // Update review request status to sent
    await ReviewRequest.findByIdAndUpdate(reviewRequest._id, {
      status: 'sent',
      sentAt: Date.now()
    });

    res.status(201).json({
      success: true,
      data: reviewRequest
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get all review requests for a business
 * @route   GET /api/reviews/request/business/:businessId
 * @access  Private
 */
exports.getBusinessReviewRequests = async (req, res) => {
  try {
    const business = await Business.findById(req.params.businessId);
    
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }
    
    // Make sure user owns the business
    if (business.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access review requests for this business'
      });
    }
    
    const reviewRequests = await ReviewRequest.find({ business: req.params.businessId })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: reviewRequests.length,
      data: reviewRequests
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Send reminder for a review request
 * @route   POST /api/reviews/request/:id/remind
 * @access  Private
 */
exports.sendReviewReminder = async (req, res) => {
  try {
    const reviewRequest = await ReviewRequest.findById(req.params.id).populate('business');
    
    if (!reviewRequest) {
      return res.status(404).json({
        success: false,
        message: 'Review request not found'
      });
    }
    
    // Make sure user owns the business associated with the review request
    if (reviewRequest.business.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to send reminders for this review request'
      });
    }
    
    // Check if reminder has already been sent
    if (reviewRequest.reminderSent) {
      return res.status(400).json({
        success: false,
        message: 'Reminder has already been sent for this review request'
      });
    }
    
    // Check if review request has been completed
    if (reviewRequest.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot send reminder for a completed review request'
      });
    }

    // Generate feedback URL
    const feedbackUrl = `${process.env.FRONTEND_URL}/feedback/${reviewRequest.uniqueId}`;

    // Send reminder based on original request method
    if (reviewRequest.requestMethod === 'email' || reviewRequest.requestMethod === 'both') {
      if (reviewRequest.customer.email) {
        await emailService.sendReviewReminder({
          to: reviewRequest.customer.email,
          customerName: reviewRequest.customer.name,
          businessName: reviewRequest.business.name,
          feedbackUrl
        });
      }
    }

    if (reviewRequest.requestMethod === 'sms' || reviewRequest.requestMethod === 'both') {
      if (reviewRequest.customer.phone) {
        await smsService.sendReviewReminderSMS({
          to: reviewRequest.customer.phone,
          businessName: reviewRequest.business.name,
          feedbackUrl
        });
      }
    }

    // Update review request to mark reminder as sent
    await ReviewRequest.findByIdAndUpdate(req.params.id, {
      reminderSent: true,
      reminderSentAt: Date.now()
    });

    res.status(200).json({
      success: true,
      message: 'Reminder sent successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get review request analytics for a business
 * @route   GET /api/review-request/analytics/:businessId
 * @access  Private
 */
exports.getReviewRequestAnalytics = async (req, res) => {
  try {
    const business = await Business.findById(req.params.businessId);
    
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }
    
    // Make sure user owns the business
    if (business.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access analytics for this business'
      });
    }

    // Get review requests for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const reviewRequests = await ReviewRequest.find({
      business: req.params.businessId,
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Calculate analytics
    const analytics = {
      totalRequests: reviewRequests.length,
      completedRequests: reviewRequests.filter(r => r.status === 'completed').length,
      pendingRequests: reviewRequests.filter(r => r.status === 'sent').length,
      responseRate: reviewRequests.length > 0 
        ? (reviewRequests.filter(r => r.status === 'completed').length / reviewRequests.length) * 100 
        : 0,
      requestsByMethod: {
        email: reviewRequests.filter(r => r.requestMethod === 'email').length,
        sms: reviewRequests.filter(r => r.requestMethod === 'sms').length,
        both: reviewRequests.filter(r => r.requestMethod === 'both').length
      }
    };

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get all review requests for the user's businesses
 * @route   GET /api/review-request
 * @access  Private
 */
exports.getReviewRequests = async (req, res) => {
  try {
    const reviewRequests = await ReviewRequest.find({ 'business.user': req.user.id })
      .populate('business', 'name')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: reviewRequests.length,
      data: reviewRequests
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get a single review request
 * @route   GET /api/review-request/:id
 * @access  Private
 */
exports.getReviewRequest = async (req, res) => {
  try {
    const reviewRequest = await ReviewRequest.findById(req.params.id)
      .populate('business', 'name');
    
    if (!reviewRequest) {
      return res.status(404).json({
        success: false,
        message: 'Review request not found'
      });
    }

    // For public form access, only return necessary data
    if (req.path.includes('/form/')) {
      return res.status(200).json({
        success: true,
        data: {
          businessName: reviewRequest.business.name,
          message: reviewRequest.message
        }
      });
    }
    
    // For authenticated users, check ownership
    if (reviewRequest.business.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this review request'
      });
    }

    res.status(200).json({
      success: true,
      data: reviewRequest
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Update a review request
 * @route   PUT /api/review-request/:id
 * @access  Private
 */
exports.updateReviewRequest = async (req, res) => {
  try {
    const reviewRequest = await ReviewRequest.findById(req.params.id).populate('business');
    
    if (!reviewRequest) {
      return res.status(404).json({
        success: false,
        message: 'Review request not found'
      });
    }
    
    // Make sure user owns the business
    if (reviewRequest.business.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this review request'
      });
    }

    const updatedRequest = await ReviewRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedRequest
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Delete a review request
 * @route   DELETE /api/review-request/:id
 * @access  Private
 */
exports.deleteReviewRequest = async (req, res) => {
  try {
    const reviewRequest = await ReviewRequest.findById(req.params.id).populate('business');
    
    if (!reviewRequest) {
      return res.status(404).json({
        success: false,
        message: 'Review request not found'
      });
    }
    
    // Make sure user owns the business
    if (reviewRequest.business.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this review request'
      });
    }

    await reviewRequest.remove();

    res.status(200).json({
      success: true,
      message: 'Review request deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Send a review request via email
 * @route   POST /api/review-request/:id/send-email
 * @access  Private
 */
exports.sendReviewRequestEmail = async (req, res) => {
  try {
    const reviewRequest = await ReviewRequest.findById(req.params.id).populate('business');
    
    if (!reviewRequest) {
      return res.status(404).json({
        success: false,
        message: 'Review request not found'
      });
    }
    
    // Make sure user owns the business
    if (reviewRequest.business.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to send email for this review request'
      });
    }

    const feedbackUrl = `${process.env.FRONTEND_URL}/feedback/${reviewRequest.uniqueId}`;

    await emailService.sendReviewRequest({
      to: reviewRequest.customer.email,
      customerName: reviewRequest.customer.name,
      businessName: reviewRequest.business.name,
      feedbackUrl
    });

    res.status(200).json({
      success: true,
      message: 'Review request email sent successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Send a review request via SMS
 * @route   POST /api/review-request/:id/send-sms
 * @access  Private
 */
exports.sendReviewRequestSMS = async (req, res) => {
  try {
    const reviewRequest = await ReviewRequest.findById(req.params.id).populate('business');
    
    if (!reviewRequest) {
      return res.status(404).json({
        success: false,
        message: 'Review request not found'
      });
    }
    
    // Make sure user owns the business
    if (reviewRequest.business.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to send SMS for this review request'
      });
    }

    const feedbackUrl = `${process.env.FRONTEND_URL}/feedback/${reviewRequest.uniqueId}`;

    await smsService.sendReviewRequestSMS({
      to: reviewRequest.customer.phone,
      businessName: reviewRequest.business.name,
      feedbackUrl
    });

    res.status(200).json({
      success: true,
      message: 'Review request SMS sent successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 