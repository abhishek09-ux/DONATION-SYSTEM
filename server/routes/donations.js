const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Donation = require('../models/Donation');
const Charity = require('../models/Charity');
const DonorProfile = require('../models/DonorProfile');
const { auth, optionalAuth } = require('../middleware/auth');

// @route   POST /api/donations
// @desc    Create a new donation
// @access  Private
router.post('/', auth, [
  body('charityId').notEmpty().withMessage('Charity ID is required'),
  body('amount').isNumeric().custom(val => val >= 1).withMessage('Amount must be at least ₹1'),
  body('paymentMethod').isIn(['razorpay', 'upi', 'card', 'netbanking', 'wallet']).withMessage('Invalid payment method')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      charityId,
      amount,
      paymentMethod,
      projectId,
      isAnonymous,
      message,
      dedicatedTo,
      wants80GReceipt,
      donationType,
      recurringDetails,
      matchScore,
      matchedVia
    } = req.body;

    // Verify charity exists and is verified
    const charity = await Charity.findById(charityId);
    if (!charity) {
      return res.status(404).json({
        success: false,
        message: 'Charity not found'
      });
    }

    if (charity.verificationStatus !== 'verified') {
      return res.status(400).json({
        success: false,
        message: 'Charity is not verified'
      });
    }

    // Check minimum donation
    if (amount < charity.minimumDonation) {
      return res.status(400).json({
        success: false,
        message: `Minimum donation for this charity is ₹${charity.minimumDonation}`
      });
    }

    // Create donation record
    const donation = new Donation({
      donor: req.userId,
      charity: charityId,
      project: projectId,
      amount,
      paymentMethod,
      isAnonymous: isAnonymous || false,
      message,
      dedicatedTo,
      wants80GReceipt: wants80GReceipt !== false,
      donationType: donationType || 'one_time',
      recurringDetails,
      matchScore,
      matchedVia: matchedVia || 'direct'
    });

    donation.addTimelineEntry('created', 'Donation initiated');

    await donation.save();

    res.status(201).json({
      success: true,
      message: 'Donation created. Please complete payment.',
      data: {
        donationId: donation._id,
        amount: donation.amount,
        charity: {
          id: charity._id,
          name: charity.organizationName
        }
      }
    });
  } catch (error) {
    console.error('Create donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/donations/:id
// @desc    Get donation by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('charity', 'organizationName logo causes location')
      .populate('donor', 'name email');

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Only donor, charity, or admin can view
    const charity = await Charity.findById(donation.charity._id);
    if (
      donation.donor._id.toString() !== req.userId.toString() &&
      charity?.user?.toString() !== req.userId.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: donation
    });
  } catch (error) {
    console.error('Get donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/donations/:id/complete
// @desc    Mark donation as completed (after payment)
// @access  Private
router.put('/:id/complete', auth, async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    } = req.body;

    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    if (donation.donor.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update donation
    donation.paymentStatus = 'completed';
    donation.razorpayOrderId = razorpayOrderId;
    donation.razorpayPaymentId = razorpayPaymentId;
    donation.razorpaySignature = razorpaySignature;
    donation.completedAt = new Date();
    donation.addTimelineEntry('completed', 'Payment successful');

    await donation.save();

    // Update charity stats
    await Charity.findByIdAndUpdate(donation.charity, {
      $inc: {
        'stats.totalDonationsReceived': donation.amount,
        'stats.totalDonors': 1,
        'fundingNeeds.totalRaised': donation.amount
      }
    });

    // Update donor stats
    await DonorProfile.findOneAndUpdate(
      { user: req.userId },
      {
        $inc: {
          totalDonated: donation.amount,
          donationCount: 1
        }
      }
    );

    res.json({
      success: true,
      message: 'Donation completed successfully!',
      data: donation
    });
  } catch (error) {
    console.error('Complete donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/donations/:id/fail
// @desc    Mark donation as failed
// @access  Private
router.put('/:id/fail', auth, async (req, res) => {
  try {
    const { reason } = req.body;

    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    donation.paymentStatus = 'failed';
    donation.addTimelineEntry('failed', reason || 'Payment failed');

    await donation.save();

    res.json({
      success: true,
      message: 'Donation marked as failed',
      data: donation
    });
  } catch (error) {
    console.error('Fail donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/donations/:id/feedback
// @desc    Add feedback for a donation
// @access  Private
router.post('/:id/feedback', auth, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { rating, comment } = req.body;

    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    if (donation.donor.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (donation.paymentStatus !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only provide feedback for completed donations'
      });
    }

    donation.donorFeedback = {
      rating,
      comment,
      date: new Date()
    };

    await donation.save();

    // Update charity rating
    const allDonations = await Donation.find({
      charity: donation.charity,
      paymentStatus: 'completed',
      'donorFeedback.rating': { $exists: true }
    });

    const avgRating = allDonations.reduce((sum, d) => sum + d.donorFeedback.rating, 0) / allDonations.length;

    await Charity.findByIdAndUpdate(donation.charity, {
      'rating.average': avgRating,
      'rating.count': allDonations.length
    });

    res.json({
      success: true,
      message: 'Thank you for your feedback!',
      data: donation.donorFeedback
    });
  } catch (error) {
    console.error('Add feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/donations/receipt/:id
// @desc    Get donation receipt
// @access  Private
router.get('/receipt/:id', auth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('charity', 'organizationName registrationNumber is80GRegistered location')
      .populate('donor', 'name email');

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    if (donation.donor._id.toString() !== req.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (donation.paymentStatus !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Receipt only available for completed donations'
      });
    }

    // Generate receipt data
    const receipt = {
      receiptNumber: donation.transactionId || `REC-${donation._id.toString().slice(-8).toUpperCase()}`,
      date: donation.completedAt,
      donor: {
        name: donation.isAnonymous ? 'Anonymous Donor' : donation.donor.name,
        email: donation.donor.email
      },
      charity: {
        name: donation.charity.organizationName,
        registrationNumber: donation.charity.registrationNumber,
        is80GRegistered: donation.charity.is80GRegistered,
        location: donation.charity.location
      },
      amount: donation.amount,
      paymentMethod: donation.paymentMethod,
      transactionId: donation.razorpayPaymentId || donation.transactionId,
      message: 'Thank you for your generous donation!'
    };

    res.json({
      success: true,
      data: receipt
    });
  } catch (error) {
    console.error('Get receipt error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/donations/public/recent
// @desc    Get recent public donations
// @access  Public
router.get('/public/recent', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const donations = await Donation.find({
      paymentStatus: 'completed'
    })
    .populate('charity', 'organizationName logo causes')
    .populate('donor', 'name')
    .select('amount createdAt isAnonymous donor charity message')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

    // Anonymize
    const publicDonations = donations.map(d => ({
      id: d._id,
      amount: d.amount,
      date: d.createdAt,
      donor: d.isAnonymous ? 'Anonymous' : d.donor?.name || 'Anonymous',
      charity: d.charity,
      message: d.message
    }));

    res.json({
      success: true,
      data: publicDonations
    });
  } catch (error) {
    console.error('Get public donations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
