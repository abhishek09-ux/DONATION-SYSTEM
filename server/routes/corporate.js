const express = require('express');
const router = express.Router();
const { CorporatePartner, CorporateMatch } = require('../models/Corporate');
const Donation = require('../models/Donation');
const User = require('../models/User');
const { auth, isAdmin } = require('../middleware/auth');

// @route   GET /api/corporate/partners
// @desc    Get list of corporate partners
// @access  Public
router.get('/partners', async (req, res) => {
  try {
    const partners = await CorporatePartner.find({ status: 'active' })
      .select('companyName logo description matchingProgram.ratio matchingProgram.maxPerEmployee')
      .sort({ companyName: 1 });

    res.json({ success: true, data: partners });
  } catch (error) {
    console.error('Get partners error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/corporate/join
// @desc    Join as employee of a corporate partner
// @access  Private
router.post('/join', auth, async (req, res) => {
  try {
    const { partnerId, employeeId } = req.body;

    const partner = await CorporatePartner.findById(partnerId);
    if (!partner || partner.status !== 'active') {
      return res.status(404).json({ success: false, message: 'Corporate partner not found' });
    }

    // Check if already joined
    const existingEmployee = partner.employees.find(
      e => e.user.toString() === req.userId
    );
    if (existingEmployee) {
      return res.status(400).json({ success: false, message: 'Already registered as employee' });
    }

    partner.employees.push({
      user: req.userId,
      employeeId,
      verified: false
    });
    await partner.save();

    res.json({
      success: true,
      message: 'Registered as employee. Pending verification.'
    });
  } catch (error) {
    console.error('Join corporate error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/corporate/my-matching
// @desc    Get user's matching donations status
// @access  Private
router.get('/my-matching', auth, async (req, res) => {
  try {
    // Find which corporate the user belongs to
    const partner = await CorporatePartner.findOne({
      'employees.user': req.userId,
      'employees.verified': true,
      status: 'active'
    });

    if (!partner) {
      return res.json({
        success: true,
        data: {
          isEmployee: false,
          message: 'Not registered with any corporate matching program'
        }
      });
    }

    // Get matching donations
    const matches = await CorporateMatch.find({ employee: req.userId })
      .populate('donation', 'amount createdAt')
      .populate('corporate', 'companyName')
      .sort({ createdAt: -1 });

    // Calculate totals
    const totalMatched = matches
      .filter(m => m.status === 'paid')
      .reduce((sum, m) => sum + m.matchedAmount, 0);

    const pendingMatched = matches
      .filter(m => m.status === 'pending' || m.status === 'approved')
      .reduce((sum, m) => sum + m.matchedAmount, 0);

    res.json({
      success: true,
      data: {
        isEmployee: true,
        company: partner.companyName,
        matchRatio: partner.matchingProgram.ratio,
        maxPerYear: partner.matchingProgram.maxPerEmployee,
        totalMatched,
        pendingMatched,
        matches
      }
    });
  } catch (error) {
    console.error('Get my matching error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/corporate/request-match
// @desc    Request matching for a donation
// @access  Private
router.post('/request-match', auth, async (req, res) => {
  try {
    const { donationId } = req.body;

    // Find user's corporate partner
    const partner = await CorporatePartner.findOne({
      'employees.user': req.userId,
      'employees.verified': true,
      status: 'active'
    });

    if (!partner || !partner.matchingProgram.enabled) {
      return res.status(400).json({
        success: false,
        message: 'Not eligible for corporate matching'
      });
    }

    // Get donation
    const donation = await Donation.findById(donationId);
    if (!donation || donation.donor.toString() !== req.userId) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    // Check if already matched
    const existingMatch = await CorporateMatch.findOne({ donation: donationId });
    if (existingMatch) {
      return res.status(400).json({ success: false, message: 'Already requested matching' });
    }

    // Check eligibility
    if (partner.matchingProgram.eligibleCharities?.length > 0) {
      if (!partner.matchingProgram.eligibleCharities.includes(donation.charity)) {
        return res.status(400).json({
          success: false,
          message: 'This charity is not eligible for matching'
        });
      }
    }

    // Calculate matched amount
    const matchedAmount = donation.amount * partner.matchingProgram.ratio;

    const match = await CorporateMatch.create({
      donation: donationId,
      employee: req.userId,
      corporate: partner._id,
      originalAmount: donation.amount,
      matchedAmount,
      matchRatio: partner.matchingProgram.ratio
    });

    res.status(201).json({
      success: true,
      message: 'Matching request submitted',
      data: match
    });
  } catch (error) {
    console.error('Request match error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/corporate/partners (Admin)
// @desc    Create corporate partner
// @access  Private (Admin)
router.post('/partners', auth, async (req, res) => {
  try {
    // TODO: Add admin check
    const partner = await CorporatePartner.create(req.body);
    res.status(201).json({ success: true, data: partner });
  } catch (error) {
    console.error('Create partner error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/corporate/matches/:id/approve (Admin/Corporate)
// @desc    Approve a matching request
// @access  Private
router.put('/matches/:id/approve', auth, async (req, res) => {
  try {
    const match = await CorporateMatch.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    match.status = 'approved';
    match.approvedBy = req.userId;
    match.approvedAt = new Date();
    await match.save();

    res.json({ success: true, data: match });
  } catch (error) {
    console.error('Approve match error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
