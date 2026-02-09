const mongoose = require('mongoose');

const impactStorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150
  },
  story: {
    type: String,
    required: true,
    maxlength: 10000
  },
  summary: {
    type: String,
    maxlength: 300
  },
  charity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Charity',
    required: true
  },
  beneficiary: {
    name: String,
    age: Number,
    location: String,
    photo: String,
    consentGiven: { type: Boolean, default: true }
  },
  category: {
    type: String,
    enum: ['education', 'healthcare', 'livelihood', 'environment', 'disaster-relief', 'community', 'other'],
    required: true
  },
  images: [{
    url: String,
    caption: String,
    isCover: Boolean
  }],
  videoUrl: String,
  impactMetrics: [{
    metric: String, // e.g., "Children Educated"
    value: String,  // e.g., "500+"
    icon: String
  }],
  donationsLinked: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation'
  }],
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: Date,
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  shares: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search
impactStorySchema.index({ title: 'text', story: 'text', summary: 'text' });

// Virtual for like count
impactStorySchema.virtual('likeCount').get(function() {
  return this.likes?.length || 0;
});

impactStorySchema.set('toJSON', { virtuals: true });
impactStorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('ImpactStory', impactStorySchema);
