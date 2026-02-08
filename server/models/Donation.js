const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  charity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Charity',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId
  },
  // Amount Details
  amount: {
    type: Number,
    required: [true, 'Donation amount is required'],
    min: [1, 'Minimum donation is ₹1']
  },
  currency: {
    type: String,
    default: 'INR'
  },
  // Payment Information
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'upi', 'card', 'netbanking', 'wallet', 'bank_transfer'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  // Donation Type
  donationType: {
    type: String,
    enum: ['one_time', 'recurring'],
    default: 'one_time'
  },
  recurringDetails: {
    frequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly']
    },
    startDate: Date,
    endDate: Date,
    isActive: Boolean,
    nextPaymentDate: Date
  },
  // Donor Preferences
  isAnonymous: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  dedicatedTo: {
    name: String,
    occasion: String
  },
  // Tax Information
  wants80GReceipt: {
    type: Boolean,
    default: true
  },
  receiptNumber: String,
  receiptGenerated: {
    type: Boolean,
    default: false
  },
  receiptUrl: String,
  // Impact Tracking
  impact: {
    description: String,
    metrics: {
      livesImpacted: Number,
      mealsProvided: Number,
      booksGiven: Number,
      treesPlanted: Number,
      other: mongoose.Schema.Types.Mixed
    },
    images: [String],
    updateDate: Date
  },
  // Matching Score (how well this matched)
  matchScore: {
    type: Number,
    default: 0
  },
  matchedVia: {
    type: String,
    enum: ['ai_recommendation', 'search', 'direct', 'quick_donate', 'campaign'],
    default: 'direct'
  },
  // Status & Timeline
  timeline: [{
    status: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
  }],
  completedAt: Date,
  // Feedback
  donorFeedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    date: Date
  },
  // Admin Notes
  adminNotes: String,
  isFlagged: {
    type: Boolean,
    default: false
  },
  flagReason: String
}, {
  timestamps: true
});

// Generate unique transaction ID
donationSchema.pre('save', async function(next) {
  if (!this.transactionId && this.paymentStatus === 'completed') {
    const date = new Date();
    const prefix = 'DON';
    const timestamp = date.getTime().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    this.transactionId = `${prefix}${timestamp}${random}`;
  }
  next();
});

// Add timeline entry
donationSchema.methods.addTimelineEntry = function(status, message) {
  this.timeline.push({
    status,
    message,
    timestamp: new Date()
  });
};

// Indexes
donationSchema.index({ donor: 1, createdAt: -1 });
donationSchema.index({ charity: 1, createdAt: -1 });
donationSchema.index({ paymentStatus: 1 });
donationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Donation', donationSchema);
