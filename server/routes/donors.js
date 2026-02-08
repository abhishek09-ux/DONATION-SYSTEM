const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const DonorProfile = require('../models/DonorProfile');
const User = require('../models/User');
const Donation = require('../models/Donation');
const { auth, isDonor } = require('../middleware/auth');

// @route   GET /api/donors/profile
// @desc    Get donor profile
// @access  Private (Donor)
router.get('/profile', auth, async (req, res) => {
  try {
    let profile = await DonorProfile.findOne({ user: req.userId }).populate('user', 'name email phone avatar');
    
    if (!profile) {
      // Create profile if doesn't exist
      profile = await DonorProfile.create({ user: req.userId });
      profile = await DonorProfile.findOne({ user: req.userId }).populate('user', 'name email phone avatar');
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/donors/profile
// @desc    Update donor profile
// @access  Private (Donor)
router.put('/profile', auth, [
  body('interests').optional().isArray(),
  body('monthlyBudget').optional().isNumeric(),
  body('location.city').optional().trim().notEmpty(),
  body('location.state').optional().trim().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const updateFields = [
      'dateOfBirth', 'gender', 'occupation',
      'location', 'interests', 'preferredCauses',
      'monthlyBudget', 'preferredDonationAmounts', 'donationFrequency',
      'preferAnonymous', 'receiveUpdates', 'preferredDistanceKm',
      'panNumber', 'want80GReceipt'
    ];

    const updateData = {};
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    let profile = await DonorProfile.findOneAndUpdate(
      { user: req.userId },
      { $set: updateData },
      { new: true, upsert: true }
    );

    // Update profile completeness
    profile.calculateCompleteness();
    await profile.save();

    // Also update user basic info if provided
    if (req.body.name || req.body.phone) {
      await User.findByIdAndUpdate(req.userId, {
        ...(req.body.name && { name: req.body.name }),
        ...(req.body.phone && { phone: req.body.phone })
      });
    }

    profile = await DonorProfile.findOne({ user: req.userId }).populate('user', 'name email phone avatar');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: profile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/donors/dashboard
// @desc    Get donor dashboard data
// @access  Private (Donor)
router.get('/dashboard', auth, async (req, res) => {
  try {
    const profile = await DonorProfile.findOne({ user: req.userId });
    
    // Get recent donations
    const recentDonations = await Donation.find({ 
      donor: req.userId,
      paymentStatus: 'completed'
    })
    .populate('charity', 'organizationName logo causes')
    .sort({ createdAt: -1 })
    .limit(5);

    // Get donation statistics
    const donationStats = await Donation.aggregate([
      { $match: { donor: req.userId, paymentStatus: 'completed' } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      }
    ]);

    // Get donations by cause
    const donationsByCause = await Donation.aggregate([
      { $match: { donor: req.userId, paymentStatus: 'completed' } },
      {
        $lookup: {
          from: 'charities',
          localField: 'charity',
          foreignField: '_id',
          as: 'charityInfo'
        }
      },
      { $unwind: '$charityInfo' },
      { $unwind: '$charityInfo.causes' },
      {
        $group: {
          _id: '$charityInfo.causes',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    // Monthly donation trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrend = await Donation.aggregate([
      { 
        $match: { 
          donor: req.userId, 
          paymentStatus: 'completed',
          createdAt: { $gte: sixMonthsAgo }
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        profile,
        stats: donationStats[0] || { totalAmount: 0, count: 0, avgAmount: 0 },
        recentDonations,
        donationsByCause,
        monthlyTrend,
        impactStats: profile?.impactStats || {}
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/donors/donations
// @desc    Get all donations for donor
// @access  Private (Donor)
router.get('/donations', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { donor: req.userId };
    if (status) query.paymentStatus = status;

    const donations = await Donation.find(query)
      .populate('charity', 'organizationName logo causes location')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Donation.countDocuments(query);

    res.json({
      success: true,
      data: {
        donations,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: total
        }
      }
    });
  } catch (error) {
    console.error('Get donations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/donors/impact
// @desc    Get donor impact summary
// @access  Private (Donor)
router.get('/impact', auth, async (req, res) => {
  try {
    const donations = await Donation.find({
      donor: req.userId,
      paymentStatus: 'completed'
    }).populate('charity', 'organizationName causes');

    // Aggregate impact
    const impact = {
      totalDonated: 0,
      charitiesSupported: new Set(),
      causesSupported: new Set(),
      impactMetrics: {
        livesImpacted: 0,
        mealsProvided: 0,
        booksGiven: 0,
        treesPlanted: 0
      }
    };

    donations.forEach(donation => {
      impact.totalDonated += donation.amount;
      impact.charitiesSupported.add(donation.charity._id.toString());
      donation.charity.causes.forEach(cause => impact.causesSupported.add(cause));
      
      if (donation.impact?.metrics) {
        Object.keys(donation.impact.metrics).forEach(key => {
          if (impact.impactMetrics[key] !== undefined) {
            impact.impactMetrics[key] += donation.impact.metrics[key] || 0;
          }
        });
      }
    });

    res.json({
      success: true,
      data: {
        totalDonated: impact.totalDonated,
        charitiesSupported: impact.charitiesSupported.size,
        causesSupported: Array.from(impact.causesSupported),
        donationCount: donations.length,
        impactMetrics: impact.impactMetrics
      }
    });
  } catch (error) {
    console.error('Get impact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
