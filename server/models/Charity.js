const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Basic Information
  organizationName: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true
  },
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true
  },
  foundedYear: {
    type: Number
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  mission: {
    type: String,
    maxlength: [500, 'Mission cannot exceed 500 characters']
  },
  vision: {
    type: String,
    maxlength: [500, 'Vision cannot exceed 500 characters']
  },
  // Contact Information
  website: {
    type: String
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String
  },
  // Location
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    country: {
      type: String,
      default: 'India'
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  operatingAreas: [{
    city: String,
    state: String
  }],
  // Causes & Focus Areas
  causes: [{
    type: String,
    enum: [
      'education',
      'health',
      'environment',
      'disaster_relief',
      'women_empowerment',
      'child_welfare',
      'elderly_care',
      'animal_welfare',
      'rural_development',
      'poverty_alleviation',
      'arts_culture',
      'sports',
      'technology',
      'other'
    ]
  }],
  beneficiaryTypes: [{
    type: String,
    enum: ['children', 'women', 'elderly', 'disabled', 'poor', 'animals', 'environment', 'general']
  }],
  // Funding Information
  fundingNeeds: {
    totalRequired: { type: Number, default: 0 },
    totalRaised: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' }
  },
  minimumDonation: {
    type: Number,
    default: 100
  },
  acceptsRecurring: {
    type: Boolean,
    default: true
  },
  // Projects
  activeProjects: [{
    title: String,
    description: String,
    targetAmount: Number,
    raisedAmount: { type: Number, default: 0 },
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ['active', 'completed', 'paused'],
      default: 'active'
    },
    beneficiariesCount: Number,
    images: [String]
  }],
  // Verification & Documents
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'suspended'],
    default: 'pending'
  },
  verificationDate: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  documents: {
    registrationCertificate: String,
    panCard: String,
    certificate80G: String,
    fcraLicense: String,
    annualReport: String,
    auditReport: String,
    bankDetails: String
  },
  is80GRegistered: {
    type: Boolean,
    default: false
  },
  fcraRegistered: {
    type: Boolean,
    default: false
  },
  // Bank Details
  bankDetails: {
    accountName: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String,
    branch: String
  },
  // Statistics
  stats: {
    totalDonationsReceived: { type: Number, default: 0 },
    totalDonors: { type: Number, default: 0 },
    beneficiariesHelped: { type: Number, default: 0 },
    projectsCompleted: { type: Number, default: 0 }
  },
  // Ratings & Reviews
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  // Media
  logo: String,
  coverImage: String,
  gallery: [String],
  // Impact Reports
  impactReports: [{
    title: String,
    description: String,
    date: Date,
    fileUrl: String,
    metrics: {
      peopleHelped: Number,
      amountUtilized: Number
    }
  }],
  // Tags for better matching
  tags: [String],
  // Priority Score for AI matching
  priorityScore: {
    type: Number,
    default: 50
  },
  // Verification Badges
  verificationBadge: {
    type: String,
    enum: ['none', 'verified', 'gold', 'platinum'],
    default: 'none'
  },
  badges: [{
    type: {
      type: String,
      enum: ['verified', 'top-rated', 'transparent', 'impact-leader', 'community-choice', 'fast-responder']
    },
    awardedAt: { type: Date, default: Date.now },
    expiresAt: Date
  }],
  // Transparency Score (0-100)
  transparencyScore: {
    overall: { type: Number, default: 0 },
    financial: { type: Number, default: 0 },      // Financial disclosure
    governance: { type: Number, default: 0 },     // Board & Management
    impact: { type: Number, default: 0 },         // Impact reporting
    communication: { type: Number, default: 0 },  // Donor communication
    lastCalculated: Date
  },
  // Financial Health Metrics
  financialHealth: {
    adminExpenseRatio: Number,     // Admin expenses / Total expenses
    programExpenseRatio: Number,   // Program expenses / Total expenses
    fundraisingEfficiency: Number, // Funds raised per rupee spent on fundraising
    reserveRatio: Number,          // Reserves / Annual expenses
    lastUpdated: Date
  }
}, {
  timestamps: true
});

// Index for location and cause-based queries
charitySchema.index({ 'location.coordinates': '2dsphere' });
charitySchema.index({ causes: 1 });
charitySchema.index({ verificationStatus: 1 });

// Virtual for funding progress
charitySchema.virtual('fundingProgress').get(function() {
  if (this.fundingNeeds.totalRequired === 0) return 0;
  return Math.round((this.fundingNeeds.totalRaised / this.fundingNeeds.totalRequired) * 100);
});

// Include virtuals in JSON
charitySchema.set('toJSON', { virtuals: true });
charitySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Charity', charitySchema);
