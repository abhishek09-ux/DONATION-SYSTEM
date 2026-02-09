const mongoose = require('mongoose');

const giftCardSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  amount: {
    type: Number,
    required: true,
    min: 100
  },
  purchasedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipientEmail: {
    type: String,
    required: true
  },
  recipientName: {
    type: String,
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  message: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['active', 'redeemed', 'expired', 'cancelled'],
    default: 'active'
  },
  redeemedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  redeemedAt: Date,
  redeemedForCharity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Charity'
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
  },
  design: {
    type: String,
    enum: ['birthday', 'celebration', 'thankyou', 'holiday', 'general'],
    default: 'general'
  }
}, {
  timestamps: true
});

// Generate unique code
giftCardSchema.statics.generateCode = function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'DM-';
  for (let i = 0; i < 12; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
    if (i === 3 || i === 7) code += '-';
  }
  return code;
};

module.exports = mongoose.model('GiftCard', giftCardSchema);
