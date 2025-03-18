const express = require('express');
const router = express.Router();
const { 
  createBusiness, 
  getBusinesses, 
  getBusiness, 
  updateBusiness, 
  deleteBusiness 
} = require('../controllers/businessController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected and require authentication
router.use(protect);

// @route   POST /api/business
// @desc    Create a new business
// @access  Private
router.post('/', createBusiness);

// @route   GET /api/business
// @desc    Get all businesses for the logged in user
// @access  Private
router.get('/', getBusinesses);

// @route   GET /api/business/:id
// @desc    Get a single business by ID
// @access  Private
router.get('/:id', getBusiness);

// @route   PUT /api/business/:id
// @desc    Update a business
// @access  Private
router.put('/:id', updateBusiness);

// @route   DELETE /api/business/:id
// @desc    Delete a business
// @access  Private
router.delete('/:id', deleteBusiness);

module.exports = router; 