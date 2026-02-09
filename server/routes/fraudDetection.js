const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const User = require('../models/User');
const Charity = require('../models/Charity');

// Fraud detection thresholds
const THRESHOLDS = {
  MAX_DAILY_DONATIONS: 10,
  MAX_DAILY_AMOUNT: 100000, // ₹1,00,000
  SUSPICIOUS_AMOUNT: 50000, // Flag amounts over ₹50,000
  RAPID_DONATIONS_WINDOW: 300000, // 5 minutes in ms
  RAPID_DONATIONS_COUNT: 3,
  NEW_USER_MAX_AMOUNT: 10000, // ₹10,000 for users < 7 days old
  VELOCITY_SPIKE_MULTIPLIER: 5 // 5x normal activity
};

// Risk score weights
const RISK_WEIGHTS = {
  NEW_USER: 20,
  HIGH_AMOUNT: 25,
  RAPID_TRANSACTIONS: 30,
  MULTIPLE_CARDS: 15,
  UNUSUAL_TIME: 10,
  VELOCITY_SPIKE: 25,
  UNVERIFIED_EMAIL: 15,
  VPN_DETECTED: 20
};

// Analyze donation for fraud risk
router.post('/analyze', async (req, res) => {
  try {
    const { userId, amount, charityId, paymentMethod, metadata } = req.body;

    const riskFactors = [];
    let riskScore = 0;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check 1: New user check
    const userAge = Date.now() - new Date(user.createdAt).getTime();
    const userDays = userAge / (1000 * 60 * 60 * 24);
    
    if (userDays < 7) {
      riskScore += RISK_WEIGHTS.NEW_USER;
      riskFactors.push({
        factor: 'new_user',
        description: `Account is ${Math.floor(userDays)} days old`,
        weight: RISK_WEIGHTS.NEW_USER
      });

      // New user amount check
      if (amount > THRESHOLDS.NEW_USER_MAX_AMOUNT) {
        riskScore += 15;
        riskFactors.push({
          factor: 'new_user_high_amount',
          description: `New user attempting ₹${amount} donation (limit: ₹${THRESHOLDS.NEW_USER_MAX_AMOUNT})`,
          weight: 15
        });
      }
    }

    // Check 2: High amount check
    if (amount > THRESHOLDS.SUSPICIOUS_AMOUNT) {
      riskScore += RISK_WEIGHTS.HIGH_AMOUNT;
      riskFactors.push({
        factor: 'high_amount',
        description: `Amount ₹${amount} exceeds threshold of ₹${THRESHOLDS.SUSPICIOUS_AMOUNT}`,
        weight: RISK_WEIGHTS.HIGH_AMOUNT
      });
    }

    // Check 3: Daily donation count and amount
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dailyDonations = await Donation.find({
      user: userId,
      createdAt: { $gte: today }
    });

    const dailyCount = dailyDonations.length;
    const dailyTotal = dailyDonations.reduce((sum, d) => sum + d.amount, 0);

    if (dailyCount >= THRESHOLDS.MAX_DAILY_DONATIONS) {
      riskScore += 20;
      riskFactors.push({
        factor: 'daily_limit',
        description: `${dailyCount} donations today (limit: ${THRESHOLDS.MAX_DAILY_DONATIONS})`,
        weight: 20
      });
    }

    if (dailyTotal + amount > THRESHOLDS.MAX_DAILY_AMOUNT) {
      riskScore += 25;
      riskFactors.push({
        factor: 'daily_amount_limit',
        description: `Daily total ₹${dailyTotal + amount} exceeds ₹${THRESHOLDS.MAX_DAILY_AMOUNT}`,
        weight: 25
      });
    }

    // Check 4: Rapid transaction detection
    const recentTime = new Date(Date.now() - THRESHOLDS.RAPID_DONATIONS_WINDOW);
    const rapidDonations = await Donation.find({
      user: userId,
      createdAt: { $gte: recentTime }
    });

    if (rapidDonations.length >= THRESHOLDS.RAPID_DONATIONS_COUNT) {
      riskScore += RISK_WEIGHTS.RAPID_TRANSACTIONS;
      riskFactors.push({
        factor: 'rapid_transactions',
        description: `${rapidDonations.length} donations in last 5 minutes`,
        weight: RISK_WEIGHTS.RAPID_TRANSACTIONS
      });
    }

    // Check 5: Velocity spike (compare to historical average)
    const lastMonth = new Date();
    lastMonth.setDate(lastMonth.getDate() - 30);
    
    const monthlyDonations = await Donation.find({
      user: userId,
      createdAt: { $gte: lastMonth }
    });

    const avgDailyDonations = monthlyDonations.length / 30;
    if (avgDailyDonations > 0 && dailyCount > avgDailyDonations * THRESHOLDS.VELOCITY_SPIKE_MULTIPLIER) {
      riskScore += RISK_WEIGHTS.VELOCITY_SPIKE;
      riskFactors.push({
        factor: 'velocity_spike',
        description: `Activity ${Math.round(dailyCount / avgDailyDonations)}x higher than average`,
        weight: RISK_WEIGHTS.VELOCITY_SPIKE
      });
    }

    // Check 6: Email verification
    if (!user.emailVerified) {
      riskScore += RISK_WEIGHTS.UNVERIFIED_EMAIL;
      riskFactors.push({
        factor: 'unverified_email',
        description: 'Email address not verified',
        weight: RISK_WEIGHTS.UNVERIFIED_EMAIL
      });
    }

    // Check 7: Unusual time (midnight to 4 AM local time)
    const currentHour = new Date().getHours();
    if (currentHour >= 0 && currentHour < 4) {
      riskScore += RISK_WEIGHTS.UNUSUAL_TIME;
      riskFactors.push({
        factor: 'unusual_time',
        description: `Transaction at ${currentHour}:00 hours`,
        weight: RISK_WEIGHTS.UNUSUAL_TIME
      });
    }

    // Determine risk level
    let riskLevel = 'low';
    let action = 'allow';

    if (riskScore >= 70) {
      riskLevel = 'high';
      action = 'block';
    } else if (riskScore >= 40) {
      riskLevel = 'medium';
      action = 'review';
    }

    // Log the analysis
    console.log(`Fraud analysis for user ${userId}: Score ${riskScore}, Level ${riskLevel}`);

    res.json({
      riskScore,
      riskLevel,
      action,
      riskFactors,
      recommendations: getRecommendations(riskLevel, riskFactors)
    });
  } catch (error) {
    console.error('Fraud analysis error:', error);
    res.status(500).json({ message: 'Error analyzing transaction' });
  }
});

// Report suspicious activity
router.post('/report', async (req, res) => {
  try {
    const { reportType, entityType, entityId, description, reportedBy } = req.body;

    // In production, this would save to a fraud reports collection
    const report = {
      reportType, // 'suspicious_donation', 'fake_charity', 'scam', 'other'
      entityType, // 'donation', 'charity', 'user', 'campaign'
      entityId,
      description,
      reportedBy,
      status: 'pending',
      createdAt: new Date()
    };

    // Log the report
    console.log('Fraud report submitted:', report);

    res.json({
      message: 'Report submitted successfully',
      reportId: Date.now().toString(36), // Simplified ID
      status: 'pending_review'
    });
  } catch (error) {
    console.error('Report error:', error);
    res.status(500).json({ message: 'Error submitting report' });
  }
});

// Get user risk profile
router.get('/user-profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get donation history
    const donations = await Donation.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(100);

    const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
    const avgDonation = donations.length > 0 ? totalDonated / donations.length : 0;

    // Calculate trust score
    let trustScore = 50; // Base score

    // Positive factors
    if (user.emailVerified) trustScore += 10;
    if (user.twoFactorEnabled) trustScore += 10;
    if (donations.length > 10) trustScore += 10;
    if (donations.length > 50) trustScore += 10;
    
    const userAge = (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    if (userAge > 30) trustScore += 5;
    if (userAge > 180) trustScore += 5;

    // Cap at 100
    trustScore = Math.min(trustScore, 100);

    res.json({
      userId,
      trustScore,
      accountAge: Math.floor(userAge),
      emailVerified: user.emailVerified || false,
      twoFactorEnabled: user.twoFactorEnabled || false,
      donationStats: {
        total: donations.length,
        totalAmount: totalDonated,
        averageAmount: Math.round(avgDonation)
      },
      riskLevel: trustScore >= 70 ? 'low' : trustScore >= 40 ? 'medium' : 'high'
    });
  } catch (error) {
    console.error('User profile error:', error);
    res.status(500).json({ message: 'Error getting user profile' });
  }
});

// Charity verification check
router.get('/verify-charity/:charityId', async (req, res) => {
  try {
    const charity = await Charity.findById(req.params.charityId);
    
    if (!charity) {
      return res.status(404).json({ message: 'Charity not found' });
    }

    const verificationChecks = {
      isRegistered: !!charity.registrationNumber,
      has80G: !!charity.pan80G,
      hasVerificationBadge: charity.verificationBadge && charity.verificationBadge !== 'none',
      hasTransparencyScore: (charity.transparencyScore?.overall || 0) > 0,
      isActive: charity.isActive !== false
    };

    const passedChecks = Object.values(verificationChecks).filter(Boolean).length;
    const verificationScore = (passedChecks / Object.keys(verificationChecks).length) * 100;

    res.json({
      charityId: charity._id,
      name: charity.name,
      verificationScore: Math.round(verificationScore),
      checks: verificationChecks,
      verificationBadge: charity.verificationBadge || 'none',
      transparencyScore: charity.transparencyScore?.overall || 0,
      recommendation: verificationScore >= 80 ? 'safe' : verificationScore >= 50 ? 'caution' : 'review'
    });
  } catch (error) {
    console.error('Charity verification error:', error);
    res.status(500).json({ message: 'Error verifying charity' });
  }
});

// Helper function to get recommendations
function getRecommendations(riskLevel, factors) {
  const recommendations = [];

  if (riskLevel === 'high') {
    recommendations.push('Transaction requires manual review before processing');
    recommendations.push('Consider requesting additional verification from user');
  }

  factors.forEach(f => {
    switch (f.factor) {
      case 'new_user':
        recommendations.push('Recommend completing email verification');
        break;
      case 'high_amount':
        recommendations.push('Suggest splitting into smaller donations');
        break;
      case 'rapid_transactions':
        recommendations.push('Implement cooldown period between donations');
        break;
      case 'unverified_email':
        recommendations.push('Require email verification before processing');
        break;
    }
  });

  return [...new Set(recommendations)]; // Remove duplicates
}

module.exports = router;
