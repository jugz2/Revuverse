const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Subscription = require('../models/Subscription');

/**
 * @desc    Get current user's subscription
 * @route   GET /api/subscription
 * @access  Private
 */
exports.getSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user._id });
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }
    
    res.json({
      success: true,
      data: subscription
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
 * @desc    Update subscription (change plan)
 * @route   PUT /api/subscription
 * @access  Private
 */
exports.updateSubscription = async (req, res) => {
  try {
    const { plan } = req.body;
    
    if (!['free', 'premium'].includes(plan)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription plan'
      });
    }
    
    const subscription = await Subscription.findOne({ user: req.user._id });
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }
    
    // Update subscription plan
    subscription.plan = plan;
    
    // Update features based on plan
    if (plan === 'free') {
      subscription.features = {
        reviewRequestsLimit: 50,
        apiIntegrations: false,
        advancedAnalytics: false,
        multipleBusinesses: false
      };
    } else if (plan === 'premium') {
      subscription.features = {
        reviewRequestsLimit: -1, // Unlimited
        apiIntegrations: true,
        advancedAnalytics: true,
        multipleBusinesses: true
      };
    }
    
    await subscription.save();
    
    // Update user's subscription field
    await User.findByIdAndUpdate(req.user._id, { subscription: plan });
    
    res.json({
      success: true,
      data: subscription
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
 * @desc    Create a checkout session for subscription
 * @route   POST /api/subscription/checkout
 * @access  Private
 */
exports.createCheckoutSession = async (req, res) => {
  try {
    const { plan } = req.body;
    
    if (plan !== 'premium') {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription plan'
      });
    }
    
    // Get or create Stripe customer
    let user = await User.findById(req.user._id);
    
    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`
      });
      
      user.stripeCustomerId = customer.id;
      await user.save();
    }
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Revuverse Premium Subscription',
              description: 'Unlimited review requests, API integrations, and advanced analytics'
            },
            unit_amount: 1999, // $19.99
            recurring: {
              interval: 'month'
            }
          },
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/dashboard?subscription=success`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard?subscription=cancel`
    });
    
    res.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url
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
 * @desc    Handle Stripe webhook events
 * @route   POST /api/subscription/webhook
 * @access  Public
 */
exports.handleWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature'];
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error(`Webhook signature verification failed: ${error.message}`);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      // Update user's subscription
      const user = await User.findOne({ stripeCustomerId: session.customer });
      
      if (user) {
        user.subscription = 'premium';
        await user.save();
        
        // Update subscription in database
        await Subscription.findOneAndUpdate(
          { user: user._id },
          {
            plan: 'premium',
            status: 'active',
            stripeSubscriptionId: session.subscription,
            features: {
              reviewRequestsLimit: -1, // Unlimited
              apiIntegrations: true,
              advancedAnalytics: true,
              multipleBusinesses: true
            }
          }
        );
      }
      break;
      
    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      
      // Find user with this subscription and downgrade to free
      const subUser = await User.findOne({ stripeCustomerId: subscription.customer });
      
      if (subUser) {
        subUser.subscription = 'free';
        await subUser.save();
        
        // Update subscription in database
        await Subscription.findOneAndUpdate(
          { user: subUser._id },
          {
            plan: 'free',
            status: 'inactive',
            stripeSubscriptionId: null,
            features: {
              reviewRequestsLimit: 50,
              apiIntegrations: false,
              advancedAnalytics: false,
              multipleBusinesses: false
            }
          }
        );
      }
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  res.json({ received: true });
};

/**
 * @desc    Cancel current subscription
 * @route   POST /api/subscription/cancel
 * @access  Private
 */
exports.cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const subscription = await Subscription.findOne({ user: req.user._id });
    
    if (!subscription || !subscription.stripeSubscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'No active subscription to cancel'
      });
    }
    
    // Cancel subscription in Stripe
    await stripe.subscriptions.del(subscription.stripeSubscriptionId);
    
    // Update subscription in database
    subscription.plan = 'free';
    subscription.status = 'inactive';
    subscription.stripeSubscriptionId = null;
    subscription.features = {
      reviewRequestsLimit: 50,
      apiIntegrations: false,
      advancedAnalytics: false,
      multipleBusinesses: false
    };
    
    await subscription.save();
    
    // Update user's subscription field
    user.subscription = 'free';
    await user.save();
    
    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: subscription
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 