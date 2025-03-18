const Feedback = require('../models/Feedback');
const Business = require('../models/Business');
const User = require('../models/User');
const emailService = require('../services/emailService');

/**
 * @desc    Create new feedback
 * @route   POST /api/feedback/submit/:businessId
 * @access  Public
 */
exports.createFeedback = async (req, res) => {
  try {
    const { rating, content, customerName, customerEmail } = req.body;
    const businessId = req.params.businessId;

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    const feedback = await Feedback.create({
      business: businessId,
      rating,
      content,
      customerName,
      customerEmail
    });

    // Get business owner's email
    const businessOwner = await User.findById(business.user);

    // Send notification to business owner
    if (businessOwner && businessOwner.email) {
      await emailService.sendFeedbackNotification({
        to: businessOwner.email,
        businessName: business.name,
        customerName: customerName,
        rating,
        comment: content,
        dashboardUrl: `${process.env.FRONTEND_URL}/dashboard/feedback/${feedback._id}`
      });
    }

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error creating feedback', error: error.message });
  }
};

/**
 * @desc    Get all feedback for a business
 * @route   GET /api/feedback/business/:businessId
 * @access  Private
 */
exports.getBusinessFeedback = async (req, res) => {
  try {
    const businessId = req.params.businessId || null;
    let query = {};
    
    if (businessId) {
      query.business = businessId;
    } else {
      // Get all businesses owned by the user
      const businesses = await Business.find({ user: req.user.id });
      query.business = { $in: businesses.map(b => b._id) };
    }

    const feedback = await Feedback.find(query)
      .populate('business', 'name')
      .sort({ createdAt: -1 });

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback', error: error.message });
  }
};

/**
 * @desc    Get single feedback
 * @route   GET /api/feedback/:id
 * @access  Private
 */
exports.getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('business', 'name user');

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Check if user owns the business
    if (feedback.business.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback', error: error.message });
  }
};

/**
 * @desc    Update feedback status
 * @route   PUT /api/feedback/:id
 * @access  Private
 */
exports.updateFeedbackStatus = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('business', 'user');

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Check if user owns the business
    if (feedback.business.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    feedback.status = req.body.status;
    await feedback.save();

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error updating feedback', error: error.message });
  }
};

/**
 * @desc    Delete feedback
 * @route   DELETE /api/feedback/:id
 * @access  Private
 */
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('business', 'user');

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Check if user owns the business
    if (feedback.business.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await feedback.remove();
    res.json({ message: 'Feedback removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting feedback', error: error.message });
  }
};

/**
 * @desc    Get feedback analytics
 * @route   GET /api/feedback/analytics/:businessId
 * @access  Private
 */
exports.getFeedbackAnalytics = async (req, res) => {
  try {
    const businessId = req.params.businessId;
    
    const feedback = await Feedback.find({ business: businessId });
    
    const analytics = {
      total: feedback.length,
      averageRating: feedback.reduce((acc, curr) => acc + curr.rating, 0) / feedback.length || 0,
      ratingDistribution: {
        1: feedback.filter(f => f.rating === 1).length,
        2: feedback.filter(f => f.rating === 2).length,
        3: feedback.filter(f => f.rating === 3).length,
        4: feedback.filter(f => f.rating === 4).length,
        5: feedback.filter(f => f.rating === 5).length
      }
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
};

/**
 * @desc    Respond to feedback
 * @route   POST /api/feedback/:id/respond
 * @access  Private
 */
exports.respondToFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('business', 'user');

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Check if user owns the business
    if (feedback.business.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    feedback.response = req.body.response;
    feedback.responseDate = Date.now();
    await feedback.save();

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error responding to feedback', error: error.message });
  }
}; 