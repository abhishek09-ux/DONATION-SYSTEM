const express = require('express');
const router = express.Router();
const GiftCard = require('../models/GiftCard');
const User = require('../models/User');
const Donation = require('../models/Donation');
const { auth } = require('../middleware/auth');
const { sendOTPEmail } = require('../utils/email');

// @route   POST /api/giftcards
// @desc    Purchase a gift card
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { amount, recipientEmail, recipientName, senderName, message, design } = req.body;

    if (amount < 100) {
      return res.status(400).json({ success: false, message: 'Minimum gift card amount is ₹100' });
    }

    const code = GiftCard.generateCode();

    const giftCard = await GiftCard.create({
      code,
      amount,
      purchasedBy: req.userId,
      recipientEmail,
      recipientName,
      senderName,
      message,
      design
    });

    // TODO: Send gift card email to recipient

    res.status(201).json({
      success: true,
      message: 'Gift card created successfully',
      data: giftCard
    });
  } catch (error) {
    console.error('Create gift card error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/giftcards/my-cards
// @desc    Get gift cards purchased by user
// @access  Private
router.get('/my-cards', auth, async (req, res) => {
  try {
    const giftCards = await GiftCard.find({ purchasedBy: req.userId })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: giftCards });
  } catch (error) {
    console.error('Get my gift cards error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/giftcards/check/:code
// @desc    Check gift card validity and balance
// @access  Public
router.get('/check/:code', async (req, res) => {
  try {
    const giftCard = await GiftCard.findOne({ code: req.params.code.toUpperCase() });

    if (!giftCard) {
      return res.status(404).json({ success: false, message: 'Gift card not found' });
    }

    if (giftCard.status === 'redeemed') {
      return res.status(400).json({ success: false, message: 'Gift card has already been redeemed' });
    }

    if (giftCard.status === 'expired' || giftCard.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'Gift card has expired' });
    }

    res.json({
      success: true,
      data: {
        code: giftCard.code,
        amount: giftCard.amount,
        senderName: giftCard.senderName,
        message: giftCard.message,
        expiresAt: giftCard.expiresAt
      }
    });
  } catch (error) {
    console.error('Check gift card error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/giftcards/redeem
// @desc    Redeem a gift card for donation
// @access  Private
router.post('/redeem', auth, async (req, res) => {
  try {
    const { code, charityId } = req.body;

    const giftCard = await GiftCard.findOne({ code: code.toUpperCase() });

    if (!giftCard) {
      return res.status(404).json({ success: false, message: 'Gift card not found' });
    }

    if (giftCard.status !== 'active') {
      return res.status(400).json({ success: false, message: `Gift card is ${giftCard.status}` });
    }

    if (giftCard.expiresAt < new Date()) {
      giftCard.status = 'expired';
      await giftCard.save();
      return res.status(400).json({ success: false, message: 'Gift card has expired' });
    }

    // Create donation
    const donation = await Donation.create({
      donor: req.userId,
      charity: charityId,
      amount: giftCard.amount,
      paymentMethod: 'gift_card',
      paymentStatus: 'completed',
      transactionId: `GC-${giftCard.code}`,
      isGiftCard: true,
      giftCardCode: giftCard.code
    });

    // Update gift card
    giftCard.status = 'redeemed';
    giftCard.redeemedBy = req.userId;
    giftCard.redeemedAt = new Date();
    giftCard.redeemedForCharity = charityId;
    await giftCard.save();

    res.json({
      success: true,
      message: 'Gift card redeemed successfully',
      data: {
        donation,
        giftCard
      }
    });
  } catch (error) {
    console.error('Redeem gift card error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/giftcards/designs
// @desc    Get available gift card designs
// @access  Public
router.get('/designs', (req, res) => {
  const designs = [
    { id: 'birthday', name: 'Birthday', emoji: '🎂', color: '#ec4899' },
    { id: 'celebration', name: 'Celebration', emoji: '🎉', color: '#f59e0b' },
    { id: 'thankyou', name: 'Thank You', emoji: '💝', color: '#ef4444' },
    { id: 'holiday', name: 'Holiday', emoji: '🎄', color: '#22c55e' },
    { id: 'general', name: 'General', emoji: '🎁', color: '#6366f1' }
  ];

  res.json({ success: true, data: designs });
});

module.exports = router;
