const axios = require('axios');
const Business = require('../models/Business');

/**
 * @desc    Get all reviews for a business
 * @route   GET /api/reviews/business/:businessId
 * @access  Private
 */
exports.getReviews = async (req, res) => {
  try {
    const { businessId } = req.params;
    
    // Check if business exists and belongs to user
    const business = await Business.findOne({
      _id: businessId,
      user: req.user._id
    });
    
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found or not authorized'
      });
    }
    
    // In a real implementation, we would fetch reviews from a database
    // For now, we'll return a mock response
    const reviews = [
      {
        id: '1',
        platform: 'Google',
        rating: 4,
        text: 'Great service, would recommend!',
        customerName: 'John Doe',
        date: new Date('2023-01-15'),
        businessResponse: null
      },
      {
        id: '2',
        platform: 'Facebook',
        rating: 5,
        text: 'Excellent experience, very professional staff.',
        customerName: 'Jane Smith',
        date: new Date('2023-02-20'),
        businessResponse: 'Thank you for your kind words!'
      }
    ];
    
    res.json({
      success: true,
      count: reviews.length,
      data: reviews
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
 * @desc    Get a single review
 * @route   GET /api/reviews/:id
 * @access  Private
 */
exports.getReview = async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real implementation, we would fetch the review from a database
    // For now, we'll return a mock response
    const review = {
      id,
      platform: 'Google',
      rating: 4,
      text: 'Great service, would recommend!',
      customerName: 'John Doe',
      date: new Date('2023-01-15'),
      businessResponse: null
    };
    
    res.json({
      success: true,
      data: review
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
 * @desc    Fetch reviews from external platforms (Google, Facebook, etc.)
 * @route   POST /api/reviews/fetch/:businessId
 * @access  Private
 */
exports.fetchExternalReviews = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { platform } = req.body; // 'google', 'facebook', 'yelp', etc.
    
    // Check if business exists and belongs to user
    const business = await Business.findOne({
      _id: businessId,
      user: req.user._id
    });
    
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found or not authorized'
      });
    }
    
    // In a real implementation, we would use the appropriate API to fetch reviews
    // For now, we'll return a mock response
    let reviews = [];
    
    if (platform === 'google' && business.socialProfiles.google.placeId) {
      // Mock Google reviews
      reviews = [
        {
          id: 'g1',
          platform: 'Google',
          rating: 4,
          text: 'Great service, would recommend!',
          customerName: 'John Doe',
          date: new Date('2023-01-15'),
          businessResponse: null
        },
        {
          id: 'g2',
          platform: 'Google',
          rating: 5,
          text: 'Excellent experience, very professional staff.',
          customerName: 'Jane Smith',
          date: new Date('2023-02-20'),
          businessResponse: 'Thank you for your kind words!'
        }
      ];
    } else if (platform === 'facebook' && business.socialProfiles.facebook.pageId) {
      // Mock Facebook reviews
      reviews = [
        {
          id: 'f1',
          platform: 'Facebook',
          rating: 5,
          text: 'Amazing service!',
          customerName: 'Mike Johnson',
          date: new Date('2023-03-10'),
          businessResponse: null
        }
      ];
    }
    
    res.json({
      success: true,
      count: reviews.length,
      data: reviews
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
 * @desc    Reply to a review on external platforms
 * @route   POST /api/reviews/:id/reply
 * @access  Private
 */
exports.replyToReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply, platform } = req.body;
    
    // In a real implementation, we would use the appropriate API to post the reply
    // For now, we'll return a mock response
    
    res.json({
      success: true,
      message: 'Reply posted successfully',
      data: {
        id,
        platform,
        businessResponse: reply,
        replyDate: new Date()
      }
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
 * @desc    Get review analytics for a business
 * @route   GET /api/reviews/analytics/:businessId
 * @access  Private
 */
exports.getReviewAnalytics = async (req, res) => {
  try {
    const { businessId } = req.params;
    
    // Check if business exists and belongs to user
    const business = await Business.findOne({
      _id: businessId,
      user: req.user._id
    });
    
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found or not authorized'
      });
    }
    
    // In a real implementation, we would calculate analytics from actual data
    // For now, we'll return a mock response
    const analytics = {
      totalReviews: 25,
      averageRating: 4.2,
      ratingDistribution: {
        5: 12,
        4: 8,
        3: 3,
        2: 1,
        1: 1
      },
      platformBreakdown: {
        Google: 15,
        Facebook: 5,
        Yelp: 3,
        TripAdvisor: 2
      },
      recentTrend: [
        { month: 'Jan', avgRating: 4.0, count: 3 },
        { month: 'Feb', avgRating: 4.2, count: 5 },
        { month: 'Mar', avgRating: 4.5, count: 8 },
        { month: 'Apr', avgRating: 4.3, count: 9 }
      ]
    };
    
    res.json({
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