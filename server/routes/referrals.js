const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Donation = require('../models/Donation');
const crypto = require('crypto');

// Middleware to check authentication
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Referral reward model (embedded for simplicity)
const ReferralReward = {
  SIGNUP_BONUS: 100, // Points for successful referral
  FIRST_DONATION_BONUS: 200, // Points when referral makes first donation
  DONATION_PERCENTAGE: 0.05 // 5% of referred user's donation as points
};

// Get user's referral code
router.get('/code', auth, async (req, res) => {
  try {
    let user = await User.findById(req.userId);
    
    if (!user.referralCode) {
      // Generate unique referral code
      const code = generateReferralCode(user.name);
      user.referralCode = code;
      await user.save();
    }

    // Generate shareable link
    const referralLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/register?ref=${user.referralCode}`;

    res.json({
      referralCode: user.referralCode,
      referralLink,
      referralCount: user.referralCount || 0,
      totalPoints: user.referralPoints || 0
    });
  } catch (error) {
    console.error('Get referral code error:', error);
    res.status(500).json({ message: 'Error getting referral code' });
  }
});

// Apply referral code during registration (called after user creation)
router.post('/apply', async (req, res) => {
  try {
    const { referralCode, userId } = req.body;

    if (!referralCode || !userId) {
      return res.status(400).json({ message: 'Referral code and user ID required' });
    }

    // Find referrer
    const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
    if (!referrer) {
      return res.status(404).json({ message: 'Invalid referral code' });
    }

    // Update new user with referral info
    const newUser = await User.findById(userId);
    if (!newUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (newUser.referredBy) {
      return res.status(400).json({ message: 'Referral already applied' });
    }

    // Apply referral
    newUser.referredBy = referrer._id;
    await newUser.save();

    // Reward referrer
    referrer.referralCount = (referrer.referralCount || 0) + 1;
    referrer.referralPoints = (referrer.referralPoints || 0) + ReferralReward.SIGNUP_BONUS;
    await referrer.save();

    res.json({
      message: 'Referral applied successfully',
      bonus: ReferralReward.SIGNUP_BONUS
    });
  } catch (error) {
    console.error('Apply referral error:', error);
    res.status(500).json({ message: 'Error applying referral' });
  }
});

// Get referral statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    // Get referred users
    const referredUsers = await User.find({ referredBy: req.userId })
      .select('name createdAt')
      .sort({ createdAt: -1 });

    // Get donations made by referred users
    const referredUserIds = referredUsers.map(u => u._id);
    const referredDonations = await Donation.aggregate([
      { $match: { user: { $in: referredUserIds }, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    res.json({
      referralCode: user.referralCode,
      totalReferrals: user.referralCount || 0,
      totalPoints: user.referralPoints || 0,
      referredUsers: referredUsers.map(u => ({
        name: u.name,
        joinedAt: u.createdAt
      })),
      referredDonationsTotal: referredDonations[0]?.total || 0,
      referredDonationsCount: referredDonations[0]?.count || 0
    });
  } catch (error) {
    console.error('Referral stats error:', error);
    res.status(500).json({ message: 'Error getting referral stats' });
  }
});

// Get referral leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const leaderboard = await User.find({ referralCount: { $gt: 0 } })
      .select('name referralCount referralPoints')
      .sort({ referralCount: -1 })
      .limit(parseInt(limit));

    res.json({
      leaderboard: leaderboard.map((u, index) => ({
        rank: index + 1,
        name: u.name,
        referrals: u.referralCount,
        points: u.referralPoints || 0
      }))
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: 'Error getting leaderboard' });
  }
});

// Process referral bonus when referred user makes donation
router.post('/donation-bonus', auth, async (req, res) => {
  try {
    const { donationId, amount } = req.body;

    const user = await User.findById(req.userId);
    if (!user.referredBy) {
      return res.json({ message: 'No referrer to reward' });
    }

    // Check if this is user's first donation
    const donationCount = await Donation.countDocuments({ 
      user: req.userId, 
      status: 'completed' 
    });

    const referrer = await User.findById(user.referredBy);
    if (!referrer) {
      return res.json({ message: 'Referrer not found' });
    }

    let bonusPoints = Math.floor(amount * ReferralReward.DONATION_PERCENTAGE);
    
    // Add first donation bonus
    if (donationCount === 1) {
      bonusPoints += ReferralReward.FIRST_DONATION_BONUS;
    }

    referrer.referralPoints = (referrer.referralPoints || 0) + bonusPoints;
    await referrer.save();

    res.json({
      message: 'Referral bonus applied',
      bonusPoints
    });
  } catch (error) {
    console.error('Donation bonus error:', error);
    res.status(500).json({ message: 'Error processing referral bonus' });
  }
});

// Redeem referral points
router.post('/redeem', auth, async (req, res) => {
  try {
    const { points, rewardType } = req.body;

    const user = await User.findById(req.userId);
    
    if ((user.referralPoints || 0) < points) {
      return res.status(400).json({ message: 'Insufficient points' });
    }

    // Process redemption based on type
    const rewards = {
      'donation-credit': { pointsRequired: 500, value: 50 }, // 50 INR credit
      'exclusive-badge': { pointsRequired: 1000, value: 'referrer-badge' },
      'charity-donation': { pointsRequired: 2000, value: 200 } // Donate 200 INR
    };

    const reward = rewards[rewardType];
    if (!reward || points < reward.pointsRequired) {
      return res.status(400).json({ message: 'Invalid reward or insufficient points' });
    }

    user.referralPoints -= reward.pointsRequired;
    await user.save();

    res.json({
      message: 'Reward redeemed successfully',
      reward: {
        type: rewardType,
        value: reward.value
      },
      remainingPoints: user.referralPoints
    });
  } catch (error) {
    console.error('Redeem error:', error);
    res.status(500).json({ message: 'Error redeeming points' });
  }
});

// Helper function to generate referral code
function generateReferralCode(name) {
  const prefix = (name || 'USER').substring(0, 3).toUpperCase();
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${prefix}${random}`;
}

module.exports = router;
