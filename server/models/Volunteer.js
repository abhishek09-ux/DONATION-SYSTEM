const mongoose = require('mongoose');

const volunteerOpportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 3000
  },
  charity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Charity',
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['on-site', 'remote', 'hybrid'],
      default: 'on-site'
    },
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  skills: [{
    type: String,
    enum: ['teaching', 'medical', 'technical', 'administrative', 'creative', 'physical-labor', 'counseling', 'event-management', 'fundraising', 'other']
  }],
  requirements: [String],
  commitment: {
    hoursPerWeek: Number,
    duration: String, // e.g., "3 months", "ongoing"
    schedule: String  // e.g., "Weekends", "Flexible"
  },
  spotsAvailable: {
    type: Number,
    default: 10
  },
  spotsFilled: {
    type: Number,
    default: 0
  },
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    enum: ['open', 'filled', 'closed', 'cancelled'],
    default: 'open'
  },
  benefits: [String],
  contactEmail: String,
  contactPhone: String,
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const volunteerApplicationSchema = new mongoose.Schema({
  opportunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VolunteerOpportunity',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    maxlength: 1000
  },
  skills: [String],
  availability: String,
  experience: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  reviewNotes: String
}, {
  timestamps: true
});

// Prevent duplicate applications
volunteerApplicationSchema.index({ opportunity: 1, user: 1 }, { unique: true });

const VolunteerOpportunity = mongoose.model('VolunteerOpportunity', volunteerOpportunitySchema);
const VolunteerApplication = mongoose.model('VolunteerApplication', volunteerApplicationSchema);

module.exports = { VolunteerOpportunity, VolunteerApplication };
