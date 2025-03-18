const axios = require('axios');

/**
 * Google Places API Service
 * Provides methods to interact with Google Places API
 */
class GooglePlacesService {
  constructor() {
    this.apiKey = process.env.GOOGLE_API_KEY;
    this.baseUrl = 'https://maps.googleapis.com/maps/api/place';
  }

  /**
   * Get details for a place by its ID
   * @param {string} placeId - Google Place ID
   * @returns {Promise<Object>} - Place details
   */
  async getPlaceDetails(placeId) {
    try {
      const response = await axios.get(`${this.baseUrl}/details/json`, {
        params: {
          place_id: placeId,
          fields: 'name,formatted_address,geometry,url,website,formatted_phone_number,rating,reviews,photos,types',
          key: this.apiKey
        }
      });

      if (response.data.status !== 'OK') {
        throw new Error(`Google Places API error: ${response.data.status}`);
      }

      return response.data.result;
    } catch (error) {
      console.error('Error fetching place details:', error);
      throw error;
    }
  }

  /**
   * Search for places by text query
   * @param {string} query - Search query
   * @returns {Promise<Array>} - List of places
   */
  async searchPlaces(query) {
    try {
      const response = await axios.get(`${this.baseUrl}/textsearch/json`, {
        params: {
          query,
          key: this.apiKey
        }
      });

      if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
        throw new Error(`Google Places API error: ${response.data.status}`);
      }

      return response.data.results;
    } catch (error) {
      console.error('Error searching places:', error);
      throw error;
    }
  }

  /**
   * Get reviews for a place
   * @param {string} placeId - Google Place ID
   * @returns {Promise<Array>} - List of reviews
   */
  async getPlaceReviews(placeId) {
    try {
      const placeDetails = await this.getPlaceDetails(placeId);
      return placeDetails.reviews || [];
    } catch (error) {
      console.error('Error fetching place reviews:', error);
      throw error;
    }
  }

  /**
   * Get a photo URL for a place
   * @param {string} photoReference - Photo reference from Google Places API
   * @param {number} maxWidth - Maximum width of the photo
   * @returns {string} - Photo URL
   */
  getPhotoUrl(photoReference, maxWidth = 400) {
    return `${this.baseUrl}/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${this.apiKey}`;
  }
}

module.exports = new GooglePlacesService(); 