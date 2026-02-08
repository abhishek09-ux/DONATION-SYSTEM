const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Charity = require('../models/Charity');
const Donation = require('../models/Donation');
const DonorProfile = require('../models/DonorProfile');
const { auth, isAdmin } = require('../middleware/auth');

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Private (Admin)
router.get('/dashboard', auth, isAdmin, async (req, res) => {
  try {
    // Get counts
    const [
      totalUsers,
      totalDonors,
      totalCharities,
      verifiedCharities,
      pendingVerification,
      totalDonations,
      completedDonations
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'donor' }),
      Charity.countDocuments(),
      Charity.countDocuments({ verificationStatus: 'verified' }),
      Charity.countDocuments({ verificationStatus: 'pending' }),
      Donation.countDocuments(),
      Donation.countDocuments({ paymentStatus: 'completed' })
    ]);

    // Get total donation amount
    const donationStats = await Donation.aggregate([
      { $match: { paymentStatus: 'completed' } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          avgAmount: { $avg: '$amount' }
        }
      }
    ]);

    // Get monthly donation trend (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyTrend = await Donation.aggregate([
      {
        $match: {
          paymentStatus: 'completed',
          createdAt: { $gte: twelveMonthsAgo }
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

    // Get donations by cause
    const donationsByCause = await Donation.aggregate([
      { $match: { paymentStatus: 'completed' } },
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

    // Get top charities by donations
    const topCharities = await Charity.find({ verificationStatus: 'verified' })
      .sort({ 'stats.totalDonationsReceived': -1 })
      .limit(5)
      .select('organizationName logo stats causes');

    // Get recent donations
    const recentDonations = await Donation.find({ paymentStatus: 'completed' })
      .populate('donor', 'name email')
      .populate('charity', 'organizationName')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('amount createdAt donor charity isAnonymous');

    // Flagged donations
    const flaggedCount = await Donation.countDocuments({ isFlagged: true });

    res.json({
      success: true,
      data: {
        counts: {
          totalUsers,
          totalDonors,
          totalCharities,
          verifiedCharities,
          pendingVerification,
          totalDonations,
          completedDonations,
          flaggedDonations: flaggedCount
        },
        financials: {
          totalRaised: donationStats[0]?.totalAmount || 0,
          avgDonation: Math.round(donationStats[0]?.avgAmount || 0)
        },
        monthlyTrend,
        donationsByCause,
        topCharities,
        recentDonations
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/charities
// @desc    Get all charities for admin
// @access  Private (Admin)
router.get('/charities', auth, isAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status,
      search 
    } = req.query;

    const query = {};
    
    if (status) {
      query.verificationStatus = status;
    }

    if (search) {
      query.$or = [
        { organizationName: new RegExp(search, 'i') },
        { registrationNumber: new RegExp(search, 'i') }
      ];
    }

    const charities = await Charity.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Charity.countDocuments(query);

    res.json({
      success: true,
      data: {
        charities,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: total
        }
      }
    });
  } catch (error) {
    console.error('Get charities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/charities/:id/verify
// @desc    Verify or reject a charity
// @access  Private (Admin)
router.put('/charities/:id/verify', auth, isAdmin, async (req, res) => {
  try {
    const { status, reason } = req.body;

    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "verified" or "rejected"'
      });
    }

    const charity = await Charity.findById(req.params.id);
    
    if (!charity) {
      return res.status(404).json({
        success: false,
        message: 'Charity not found'
      });
    }

    charity.verificationStatus = status;
    charity.verificationDate = new Date();
    charity.verifiedBy = req.userId;

    if (status === 'rejected' && reason) {
      charity.adminNotes = reason;
    }

    await charity.save();

    // Update user verification status
    await User.findByIdAndUpdate(charity.user, {
      isVerified: status === 'verified'
    });

    res.json({
      success: true,
      message: `Charity ${status === 'verified' ? 'verified' : 'rejected'} successfully`,
      data: charity
    });
  } catch (error) {
    console.error('Verify charity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/charities/:id/suspend
// @desc    Suspend a charity
// @access  Private (Admin)
router.put('/charities/:id/suspend', auth, isAdmin, async (req, res) => {
  try {
    const { reason } = req.body;

    const charity = await Charity.findByIdAndUpdate(
      req.params.id,
      {
        verificationStatus: 'suspended',
        adminNotes: reason
      },
      { new: true }
    );

    if (!charity) {
      return res.status(404).json({
        success: false,
        message: 'Charity not found'
      });
    }

    res.json({
      success: true,
      message: 'Charity suspended',
      data: charity
    });
  } catch (error) {
    console.error('Suspend charity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin)
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      role,
      search,
      active 
    } = req.query;

    const query = {};
    
    if (role) query.role = role;
    if (active !== undefined) query.isActive = active === 'true';
    
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: total
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Activate/Deactivate user
// @access  Private (Admin)
router.put('/users/:id/status', auth, isAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'}`,
      data: user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/donations
// @desc    Get all donations
// @access  Private (Admin)
router.get('/donations', auth, isAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status,
      flagged,
      startDate,
      endDate
    } = req.query;

    const query = {};
    
    if (status) query.paymentStatus = status;
    if (flagged === 'true') query.isFlagged = true;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const donations = await Donation.find(query)
      .populate('donor', 'name email')
      .populate('charity', 'organizationName')
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

// @route   PUT /api/admin/donations/:id/flag
// @desc    Flag/unflag a donation
// @access  Private (Admin)
router.put('/donations/:id/flag', auth, isAdmin, async (req, res) => {
  try {
    const { isFlagged, reason } = req.body;

    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { 
        isFlagged,
        flagReason: isFlagged ? reason : null,
        adminNotes: isFlagged ? `Flagged by admin: ${reason}` : null
      },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    res.json({
      success: true,
      message: `Donation ${isFlagged ? 'flagged' : 'unflagged'}`,
      data: donation
    });
  } catch (error) {
    console.error('Flag donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get detailed analytics
// @access  Private (Admin)
router.get('/analytics', auth, isAdmin, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    // Daily donations
    const dailyDonations = await Donation.aggregate([
      {
        $match: {
          paymentStatus: 'completed',
          createdAt: { $gte: daysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // New users per day
    const newUsers = await User.aggregate([
      {
        $match: { createdAt: { $gte: daysAgo } }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Payment method distribution
    const paymentMethods = await Donation.aggregate([
      { $match: { paymentStatus: 'completed' } },
      {
        $group: {
          _id: '$paymentMethod',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Geographic distribution
    const geographicData = await Charity.aggregate([
      { $match: { verificationStatus: 'verified' } },
      {
        $group: {
          _id: '$location.state',
          count: { $sum: 1 },
          totalRaised: { $sum: '$stats.totalDonationsReceived' }
        }
      },
      { $sort: { totalRaised: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        dailyDonations,
        newUsers,
        paymentMethods,
        geographicData
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/fraud-alerts
// @desc    Get potential fraud alerts
// @access  Private (Admin)
router.get('/fraud-alerts', auth, isAdmin, async (req, res) => {
  try {
    // Detect anomalies
    const alerts = [];

    // 1. Large donations (> 100000)
    const largeDonations = await Donation.find({
      paymentStatus: 'completed',
      amount: { $gt: 100000 }
    })
    .populate('donor', 'name email')
    .populate('charity', 'organizationName')
    .sort({ createdAt: -1 })
    .limit(10);

    largeDonations.forEach(d => {
      alerts.push({
        type: 'large_donation',
        severity: 'medium',
        message: `Large donation of ₹${d.amount}`,
        donation: d,
        date: d.createdAt
      });
    });

    // 2. Multiple donations from same user in short time
    const recentDonations = await Donation.aggregate([
      {
        $match: {
          paymentStatus: 'completed',
          createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: '$donor',
          count: { $sum: 1 },
          total: { $sum: '$amount' }
        }
      },
      {
        $match: { count: { $gt: 3 } }
      }
    ]);

    for (const item of recentDonations) {
      const user = await User.findById(item._id).select('name email');
      alerts.push({
        type: 'multiple_donations',
        severity: 'high',
        message: `${item.count} donations in 24 hours totaling ₹${item.total}`,
        user,
        date: new Date()
      });
    }

    // 3. Flagged donations
    const flaggedDonations = await Donation.find({ isFlagged: true })
      .populate('donor', 'name email')
      .populate('charity', 'organizationName')
      .sort({ createdAt: -1 })
      .limit(10);

    flaggedDonations.forEach(d => {
      alerts.push({
        type: 'flagged',
        severity: 'high',
        message: d.flagReason || 'Manually flagged',
        donation: d,
        date: d.createdAt
      });
    });

    res.json({
      success: true,
      data: alerts.sort((a, b) => new Date(b.date) - new Date(a.date))
    });
  } catch (error) {
    console.error('Fraud alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
