const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 5000
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  charity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Charity',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goalAmount: {
    type: Number,
    required: true,
    min: 1000
  },
  raisedAmount: {
    type: Number,
    default: 0
  },
  donorCount: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: ['education', 'healthcare', 'environment', 'disaster-relief', 'animals', 'community', 'other'],
    required: true
  },
  images: [{
    url: String,
    caption: String
  }],
  coverImage: {
    type: String
  },
  videoUrl: {
    type: String
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'active', 'completed', 'cancelled'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  updates: [{
    title: String,
    content: String,
    image: String,
    postedAt: { type: Date, default: Date.now }
  }],
  milestones: [{
    amount: Number,
    title: String,
    description: String,
    reached: { type: Boolean, default: false },
    reachedAt: Date
  }],
  tags: [String],
  // For matching/corporate donations
  matchingEnabled: {
    type: Boolean,
    default: false
  },
  matchingRatio: {
    type: Number,
    default: 1 // 1:1 matching
  },
  matchingCap: {
    type: Number
  },
  matchedAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Virtual for progress percentage
campaignSchema.virtual('progressPercentage').get(function() {
  return Math.min(100, (this.raisedAmount / this.goalAmount) * 100);
});

// Virtual for days remaining
campaignSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const end = new Date(this.endDate);
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
});

campaignSchema.set('toJSON', { virtuals: true });
campaignSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Campaign', campaignSchema);
