const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  customer: {
    name: {
      type: String,
      required: [true, 'Customer name is required']
    },
    email: {
      type: String,
      required: [true, 'Customer email is required'],
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
      type: String
    }
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true
  },
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
    default: 'neutral'
  },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'resolved', 'ignored'],
    default: 'new'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  redirectedToReview: {
    type: Boolean,
    default: false
  },
  platform: {
    type: String,
    enum: ['google', 'facebook', 'yelp', 'tripadvisor', 'trustpilot', 'internal', 'other'],
    default: 'internal'
  },
  businessResponse: {
    content: String,
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  tags: [String]
}, {
  timestamps: true
});

// Calculate sentiment based on rating
FeedbackSchema.pre('save', function(next) {
  if (this.rating >= 4) {
    this.sentiment = 'positive';
  } else if (this.rating === 3) {
    this.sentiment = 'neutral';
  } else {
    this.sentiment = 'negative';
  }
  next();
});

module.exports = mongoose.model('Feedback', FeedbackSchema); 