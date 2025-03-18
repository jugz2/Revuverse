const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    enum: ['free', 'premium'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'canceled', 'expired', 'trial'],
    default: 'active'
  },
  stripeSubscriptionId: {
    type: String
  },
  stripePriceId: {
    type: String
  },
  stripeCustomerId: {
    type: String
  },
  currentPeriodStart: {
    type: Date
  },
  currentPeriodEnd: {
    type: Date
  },
  cancelAtPeriodEnd: {
    type: Boolean,
    default: false
  },
  canceledAt: {
    type: Date
  },
  features: {
    reviewRequestsLimit: {
      type: Number,
      default: 50 // Free tier limit
    },
    apiIntegrations: {
      type: Boolean,
      default: false
    },
    advancedAnalytics: {
      type: Boolean,
      default: false
    },
    multipleBusinesses: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Set features based on plan
SubscriptionSchema.pre('save', function(next) {
  if (this.plan === 'premium') {
    this.features = {
      reviewRequestsLimit: 1000,
      apiIntegrations: true,
      advancedAnalytics: true,
      multipleBusinesses: true
    };
  } else {
    this.features = {
      reviewRequestsLimit: 50,
      apiIntegrations: false,
      advancedAnalytics: false,
      multipleBusinesses: false
    };
  }
  next();
});

module.exports = mongoose.model('Subscription', SubscriptionSchema); 