const mongoose = require('mongoose');

const donorProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Personal Information
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say']
  },
  occupation: {
    type: String,
    trim: true
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
  // Donation Preferences
  interests: [{
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
  preferredCauses: [{
    type: String
  }],
  // Budget & Donation Settings
  monthlyBudget: {
    type: Number,
    default: 0
  },
  preferredDonationAmounts: [{
    type: Number
  }],
  donationFrequency: {
    type: String,
    enum: ['one_time', 'monthly', 'quarterly', 'yearly'],
    default: 'one_time'
  },
  // Preferences
  preferAnonymous: {
    type: Boolean,
    default: false
  },
  receiveUpdates: {
    type: Boolean,
    default: true
  },
  preferredDistanceKm: {
    type: Number,
    default: 100
  },
  // Statistics
  totalDonated: {
    type: Number,
    default: 0
  },
  donationCount: {
    type: Number,
    default: 0
  },
  // Tax Information
  panNumber: {
    type: String
  },
  want80GReceipt: {
    type: Boolean,
    default: true
  },
  // Profile Completeness
  profileCompleteness: {
    type: Number,
    default: 0
  },
  // Impact Stats
  impactStats: {
    livesImpacted: { type: Number, default: 0 },
    booksProvided: { type: Number, default: 0 },
    mealsFed: { type: Number, default: 0 },
    treesPlanted: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Calculate profile completeness
donorProfileSchema.methods.calculateCompleteness = function() {
  let score = 0;
  const fields = [
    'dateOfBirth', 'gender', 'occupation',
    'location.city', 'location.state',
    'interests', 'monthlyBudget', 'panNumber'
  ];
  
  fields.forEach(field => {
    const value = field.includes('.') 
      ? field.split('.').reduce((obj, key) => obj?.[key], this)
      : this[field];
    
    if (value && (Array.isArray(value) ? value.length > 0 : true)) {
      score += 100 / fields.length;
    }
  });
  
  this.profileCompleteness = Math.round(score);
  return this.profileCompleteness;
};

// Index for location-based queries
donorProfileSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('DonorProfile', donorProfileSchema);
