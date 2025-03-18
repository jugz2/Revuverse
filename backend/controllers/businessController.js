const Business = require('../models/Business');

/**
 * @desc    Create a new business
 * @route   POST /api/business
 * @access  Private
 */
exports.createBusiness = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;
    
    // Check if user already has a business (for free tier)
    if (req.user.subscription === 'free') {
      const existingBusinesses = await Business.find({ user: req.user.id });
      
      if (existingBusinesses.length >= 1) {
        return res.status(400).json({
          success: false,
          message: 'Free tier users can only create one business. Please upgrade to premium.'
        });
      }
    }
    
    const business = await Business.create(req.body);
    
    res.status(201).json({
      success: true,
      data: business
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
 * @desc    Get all businesses for a user
 * @route   GET /api/business
 * @access  Private
 */
exports.getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({ user: req.user.id });
    
    res.status(200).json({
      success: true,
      count: businesses.length,
      data: businesses
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
 * @desc    Get single business
 * @route   GET /api/business/:id
 * @access  Private
 */
exports.getBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    
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
        message: 'Not authorized to access this business'
      });
    }
    
    res.status(200).json({
      success: true,
      data: business
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
 * @desc    Update business
 * @route   PUT /api/business/:id
 * @access  Private
 */
exports.updateBusiness = async (req, res) => {
  try {
    let business = await Business.findById(req.params.id);
    
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
        message: 'Not authorized to update this business'
      });
    }
    
    business = await Business.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: business
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
 * @desc    Delete business
 * @route   DELETE /api/business/:id
 * @access  Private
 */
exports.deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    
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
        message: 'Not authorized to delete this business'
      });
    }
    
    await business.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 