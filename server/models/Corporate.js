const mongoose = require('mongoose');

const corporatePartnerSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  logo: String,
  description: String,
  contactEmail: String,
  contactPerson: String,
  website: String,
  matchingProgram: {
    enabled: { type: Boolean, default: true },
    ratio: { type: Number, default: 1 }, // 1:1 by default
    maxPerEmployee: Number, // Max match per employee per year
    maxTotal: Number, // Max total matching per year
    eligibleCharities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Charity' }],
    eligibleCauses: [String]
  },
  employees: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    employeeId: String,
    verified: { type: Boolean, default: false },
    joinedAt: { type: Date, default: Date.now }
  }],
  totalMatched: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const corporateMatchSchema = new mongoose.Schema({
  donation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation',
    required: true
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  corporate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CorporatePartner',
    required: true
  },
  originalAmount: {
    type: Number,
    required: true
  },
  matchedAmount: {
    type: Number,
    required: true
  },
  matchRatio: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'paid'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  paidAt: Date,
  notes: String
}, {
  timestamps: true
});

// Prevent double matching
corporateMatchSchema.index({ donation: 1 }, { unique: true });

const CorporatePartner = mongoose.model('CorporatePartner', corporatePartnerSchema);
const CorporateMatch = mongoose.model('CorporateMatch', corporateMatchSchema);

module.exports = { CorporatePartner, CorporateMatch };
