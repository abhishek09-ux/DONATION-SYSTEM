require('dotenv').config();
const dns = require('dns');

// Force Google DNS for MongoDB Atlas SRV lookup
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import routes
const authRoutes = require('./routes/auth');
const donorRoutes = require('./routes/donors');
const charityRoutes = require('./routes/charities');
const donationRoutes = require('./routes/donations');
const matchingRoutes = require('./routes/matching');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payments');
const twoFactorRoutes = require('./routes/2fa');
const campaignRoutes = require('./routes/campaigns');
const giftCardRoutes = require('./routes/giftcards');
const forumRoutes = require('./routes/forum');
const volunteerRoutes = require('./routes/volunteers');
const corporateRoutes = require('./routes/corporate');
const impactStoryRoutes = require('./routes/impactStories');
const taxReportRoutes = require('./routes/taxReports');
const referralRoutes = require('./routes/referrals');
const recommendationRoutes = require('./routes/recommendations');
const chatbotRoutes = require('./routes/chatbotAI'); // Smart AI Chatbot
const fraudDetectionRoutes = require('./routes/fraudDetection');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/donation_system';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/charities', charityRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/2fa', twoFactorRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/giftcards', giftCardRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/corporate', corporateRoutes);
app.use('/api/impact-stories', impactStoryRoutes);
app.use('/api/tax-reports', taxReportRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/fraud', fraudDetectionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Donation Matching System is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  });
});

module.exports = app;
