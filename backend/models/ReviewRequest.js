const mongoose = require('mongoose');

const ReviewRequestSchema = new mongoose.Schema({
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
      required: function() {
        return !this.customer.phone;
      },
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      required: function() {
        return !this.customer.email;
      }
    }
  },
  requestMethod: {
    type: String,
    enum: ['email', 'sms', 'both'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'clicked', 'completed', 'failed'],
    default: 'pending'
  },
  sentAt: {
    type: Date
  },
  clickedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  feedback: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feedback'
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  reminderSentAt: {
    type: Date
  },
  uniqueId: {
    type: String,
    required: true,
    unique: true
  },
  message: {
    type: String
  }
}, {
  timestamps: true
});

// Generate a unique ID for the review request
ReviewRequestSchema.pre('save', function(next) {
  if (!this.uniqueId) {
    this.uniqueId = mongoose.Types.ObjectId().toString();
  }
  next();
});

module.exports = mongoose.model('ReviewRequest', ReviewRequestSchema); 