require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');

// Import routes
const authRoutes = require('./routes/auth');
const businessRoutes = require('./routes/business');
const feedbackRoutes = require('./routes/feedback');
const reviewRoutes = require('./routes/reviews');
const subscriptionRoutes = require('./routes/subscription');
const reviewRequestRoutes = require('./routes/reviewRequest');
const smsRoutes = require('./routes/smsRoutes');
const googlePlacesRoutes = require('./routes/googlePlaces');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Debug middleware
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.path}`);
  next();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/review-request', reviewRequestRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/places', googlePlacesRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  res.status(500).json({
    message: err.message || 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Try a different port or kill the process using this port.`);
    // Try another port
    const newPort = PORT + 1;
    console.log(`Attempting to use port ${newPort} instead...`);
    app.listen(newPort, () => {
      console.log(`Server running on alternate port ${newPort}`);
    });
  } else {
    console.error('Server error:', err);
  }
});

module.exports = app; // For testing purposes 