const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Business category is required'],
    enum: [
      'restaurant', 
      'salon', 
      'retail', 
      'service', 
      'healthcare', 
      'fitness', 
      'education', 
      'hospitality', 
      'other'
    ]
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  contactInfo: {
    phone: String,
    email: String,
    website: String
  },
  socialProfiles: {
    google: {
      placeId: String,
      url: String
    },
    facebook: {
      pageId: String,
      url: String
    },
    yelp: {
      businessId: String,
      url: String
    },
    tripadvisor: {
      businessId: String,
      url: String
    },
    trustpilot: {
      businessId: String,
      url: String
    }
  },
  logo: {
    type: String
  },
  coverImage: {
    type: String
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Business', BusinessSchema); 