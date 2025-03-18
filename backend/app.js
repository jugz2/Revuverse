require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
const authRoutes = require('./routes/auth');
const businessRoutes = require('./routes/business');
const reviewRoutes = require('./routes/reviews');
const subscriptionRoutes = require('./routes/subscription');
const reviewRequestRoutes = require('./routes/reviewRequest');

// Initialize express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    process.env.FRONTEND_URL || 'https://your-frontend-name.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/review-request', reviewRequestRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

module.exports = app; 