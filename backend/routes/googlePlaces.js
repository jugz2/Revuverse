const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const googlePlacesService = require('../services/googlePlacesService');

/**
 * @route   GET /api/places/search
 * @desc    Search for places by query
 * @access  Private
 */
router.get('/search', protect, async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const places = await googlePlacesService.searchPlaces(query);
    
    res.json({
      success: true,
      data: places
    });
  } catch (error) {
    console.error('Error searching places:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching places'
    });
  }
});

/**
 * @route   GET /api/places/:placeId
 * @desc    Get details for a place
 * @access  Private
 */
router.get('/:placeId', protect, async (req, res) => {
  try {
    const { placeId } = req.params;
    
    const placeDetails = await googlePlacesService.getPlaceDetails(placeId);
    
    res.json({
      success: true,
      data: placeDetails
    });
  } catch (error) {
    console.error('Error fetching place details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching place details'
    });
  }
});

/**
 * @route   GET /api/places/:placeId/reviews
 * @desc    Get reviews for a place
 * @access  Private
 */
router.get('/:placeId/reviews', protect, async (req, res) => {
  try {
    const { placeId } = req.params;
    
    const reviews = await googlePlacesService.getPlaceReviews(placeId);
    
    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching place reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching place reviews'
    });
  }
});

module.exports = router; 