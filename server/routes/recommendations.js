const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const Charity = require('../models/Charity');
const User = require('../models/User');
const Campaign = require('../models/Campaign');

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

// Get personalized charity recommendations
router.get('/charities', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    // Get user's donation history
    const donations = await Donation.find({ user: req.userId, status: 'completed' })
      .populate('charity', 'category tags');

    // Analyze donation patterns
    const categoryWeights = {};
    const tagWeights = {};
    let totalDonations = 0;

    donations.forEach(d => {
      if (d.charity?.category) {
        categoryWeights[d.charity.category] = (categoryWeights[d.charity.category] || 0) + d.amount;
      }
      d.charity?.tags?.forEach(tag => {
        tagWeights[tag] = (tagWeights[tag] || 0) + 1;
      });
      totalDonations += d.amount;
    });

    // Get top categories
    const topCategories = Object.entries(categoryWeights)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([cat]) => cat);

    // Get top tags
    const topTags = Object.entries(tagWeights)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([tag]) => tag);

    // Build recommendation query
    const query = { isActive: true };
    
    if (topCategories.length > 0) {
      query.$or = [
        { category: { $in: topCategories } },
        { tags: { $in: topTags } }
      ];
    }

    // Get recommended charities
    let recommendations = await Charity.find(query)
      .select('name description category tags transparencyScore totalDonations image verificationBadge')
      .limit(10);

    // If not enough recommendations, get trending charities
    if (recommendations.length < 5) {
      const trending = await Charity.find({ isActive: true })
        .sort({ totalDonations: -1, 'transparencyScore.overall': -1 })
        .limit(10 - recommendations.length);
      
      const existingIds = recommendations.map(r => r._id.toString());
      trending.forEach(t => {
        if (!existingIds.includes(t._id.toString())) {
          recommendations.push(t);
        }
      });
    }

    // Score and sort recommendations
    recommendations = recommendations.map(charity => {
      let score = 0;
      
      // Category match bonus
      if (topCategories.includes(charity.category)) {
        score += 30;
      }
      
      // Tag match bonus
      const matchingTags = charity.tags?.filter(t => topTags.includes(t)) || [];
      score += matchingTags.length * 10;
      
      // Transparency score bonus
      score += (charity.transparencyScore?.overall || 0) * 0.5;
      
      // Verification badge bonus
      if (charity.verificationBadge === 'platinum') score += 20;
      else if (charity.verificationBadge === 'gold') score += 15;
      else if (charity.verificationBadge === 'verified') score += 10;

      return {
        ...charity.toObject(),
        matchScore: score,
        matchReason: getMatchReason(charity, topCategories, topTags)
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      recommendations,
      userProfile: {
        topCategories,
        topTags,
        totalDonated: totalDonations,
        donationCount: donations.length
      }
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ message: 'Error getting recommendations' });
  }
});

// Get recommended campaigns
router.get('/campaigns', auth, async (req, res) => {
  try {
    // Get user's past donations
    const donations = await Donation.find({ user: req.userId, status: 'completed' })
      .populate('charity', 'category');

    const categoryWeights = {};
    donations.forEach(d => {
      if (d.charity?.category) {
        categoryWeights[d.charity.category] = (categoryWeights[d.charity.category] || 0) + 1;
      }
    });

    const preferredCategories = Object.entries(categoryWeights)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([cat]) => cat);

    // Get active campaigns
    let campaigns = await Campaign.find({
      status: 'active',
      endDate: { $gte: new Date() }
    })
    .populate('charity', 'name category verificationBadge')
    .sort({ 'raisedAmount': -1 })
    .limit(20);

    // Score campaigns
    campaigns = campaigns.map(campaign => {
      let score = 0;
      
      // Category preference
      if (preferredCategories.includes(campaign.charity?.category)) {
        score += 30;
      }
      
      // Urgency bonus (campaigns ending soon)
      const daysRemaining = Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24));
      if (daysRemaining <= 7) score += 20;
      else if (daysRemaining <= 14) score += 10;
      
      // Progress bonus (near goal)
      const progress = (campaign.raisedAmount / campaign.goalAmount) * 100;
      if (progress >= 80 && progress < 100) score += 25;
      else if (progress >= 50) score += 10;
      
      // Matching bonus
      if (campaign.matchingEnabled) score += 15;

      // Featured bonus
      if (campaign.featured) score += 20;

      return {
        ...campaign.toObject(),
        matchScore: score,
        daysRemaining,
        progressPercentage: progress
      };
    }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 10);

    res.json({ campaigns });
  } catch (error) {
    console.error('Campaign recommendations error:', error);
    res.status(500).json({ message: 'Error getting campaign recommendations' });
  }
});

// Get suggested donation amount
router.get('/donation-amount/:charityId', auth, async (req, res) => {
  try {
    const { charityId } = req.params;

    // Get user's donation history
    const userDonations = await Donation.find({ 
      user: req.userId, 
      status: 'completed' 
    }).sort({ createdAt: -1 });

    // Get charity's recent donations (for social proof)
    const charityDonations = await Donation.find({ 
      charity: charityId, 
      status: 'completed' 
    }).sort({ createdAt: -1 }).limit(100);

    // Calculate user's average donation
    const userAvg = userDonations.length > 0
      ? userDonations.reduce((sum, d) => sum + d.amount, 0) / userDonations.length
      : 0;

    // Calculate charity's average donation
    const charityAvg = charityDonations.length > 0
      ? charityDonations.reduce((sum, d) => sum + d.amount, 0) / charityDonations.length
      : 500;

    // Calculate suggested amounts
    const baseAmount = userAvg > 0 ? userAvg : charityAvg;
    
    const suggestions = [
      { amount: Math.round(baseAmount * 0.5 / 100) * 100, label: 'Basic' },
      { amount: Math.round(baseAmount / 100) * 100, label: 'Recommended' },
      { amount: Math.round(baseAmount * 1.5 / 100) * 100, label: 'Generous' },
      { amount: Math.round(baseAmount * 2.5 / 100) * 100, label: 'Champion' }
    ].filter(s => s.amount >= 100); // Minimum ₹100

    // Get impact descriptions
    const charity = await Charity.findById(charityId);
    suggestions.forEach(s => {
      s.impact = getImpactDescription(s.amount, charity?.category);
    });

    res.json({
      suggestions,
      userAverage: Math.round(userAvg),
      charityAverage: Math.round(charityAvg),
      recentDonors: charityDonations.length
    });
  } catch (error) {
    console.error('Donation amount suggestion error:', error);
    res.status(500).json({ message: 'Error getting donation suggestions' });
  }
});

// Get giving insights
router.get('/insights', auth, async (req, res) => {
  try {
    const donations = await Donation.find({ 
      user: req.userId, 
      status: 'completed' 
    }).populate('charity', 'name category');

    if (donations.length === 0) {
      return res.json({
        insights: [{
          type: 'getting-started',
          title: 'Start Your Giving Journey',
          message: 'Make your first donation to see personalized insights about your charitable impact.'
        }]
      });
    }

    const insights = [];
    const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
    const avgAmount = totalAmount / donations.length;

    // Giving pattern insights
    const monthlyDonations = {};
    donations.forEach(d => {
      const month = new Date(d.createdAt).toISOString().slice(0, 7);
      monthlyDonations[month] = (monthlyDonations[month] || 0) + d.amount;
    });

    const months = Object.keys(monthlyDonations).sort();
    if (months.length >= 2) {
      const recentMonth = monthlyDonations[months[months.length - 1]] || 0;
      const prevMonth = monthlyDonations[months[months.length - 2]] || 0;
      
      if (recentMonth > prevMonth) {
        insights.push({
          type: 'growth',
          title: 'Growing Generosity',
          message: `Your giving increased by ${Math.round((recentMonth - prevMonth) / prevMonth * 100)}% compared to last month!`,
          icon: 'trending-up'
        });
      }
    }

    // Category diversity
    const categories = [...new Set(donations.map(d => d.charity?.category).filter(Boolean))];
    if (categories.length >= 3) {
      insights.push({
        type: 'diversity',
        title: 'Diverse Supporter',
        message: `You've supported ${categories.length} different cause categories. Your impact spans multiple areas!`,
        icon: 'diversity'
      });
    }

    // Milestone insights
    if (totalAmount >= 10000) {
      insights.push({
        type: 'milestone',
        title: 'Impact Champion',
        message: `You've donated ₹${totalAmount.toLocaleString('en-IN')} in total! You're making a significant difference.`,
        icon: 'trophy'
      });
    }

    // Consistency insight
    if (donations.length >= 5) {
      insights.push({
        type: 'consistency',
        title: 'Consistent Giver',
        message: `You've made ${donations.length} donations. Consistency builds lasting change!`,
        icon: 'repeat'
      });
    }

    res.json({
      insights,
      summary: {
        totalDonated: totalAmount,
        averageDonation: Math.round(avgAmount),
        donationCount: donations.length,
        categoriesSupported: categories.length
      }
    });
  } catch (error) {
    console.error('Insights error:', error);
    res.status(500).json({ message: 'Error generating insights' });
  }
});

// Helper function to get match reason
function getMatchReason(charity, topCategories, topTags) {
  const reasons = [];
  
  if (topCategories.includes(charity.category)) {
    reasons.push(`Matches your interest in ${charity.category}`);
  }
  
  const matchingTags = charity.tags?.filter(t => topTags.includes(t)) || [];
  if (matchingTags.length > 0) {
    reasons.push(`Similar to causes you support`);
  }

  if (charity.verificationBadge && charity.verificationBadge !== 'none') {
    reasons.push(`${charity.verificationBadge.charAt(0).toUpperCase() + charity.verificationBadge.slice(1)} verified organization`);
  }

  if ((charity.transparencyScore?.overall || 0) >= 80) {
    reasons.push('Highly transparent operations');
  }

  return reasons.slice(0, 2);
}

// Helper function to get impact description
function getImpactDescription(amount, category) {
  const impacts = {
    education: {
      100: 'Provides school supplies for 1 child',
      500: 'Funds 1 month of tuition for a student',
      1000: 'Sponsors a student for a semester',
      5000: 'Funds a full scholarship'
    },
    healthcare: {
      100: 'Provides basic medical check-up',
      500: 'Funds vaccinations for 5 children',
      1000: 'Supports a patient\'s treatment',
      5000: 'Funds a critical surgery'
    },
    environment: {
      100: 'Plants 10 trees',
      500: 'Protects 1 acre of forest',
      1000: 'Funds cleanup of 1km coastline',
      5000: 'Sponsors a conservation project'
    },
    default: {
      100: 'Makes a meaningful impact',
      500: 'Supports program activities',
      1000: 'Funds significant initiatives',
      5000: 'Creates transformative change'
    }
  };

  const categoryImpacts = impacts[category] || impacts.default;
  
  if (amount <= 100) return categoryImpacts[100];
  if (amount <= 500) return categoryImpacts[500];
  if (amount <= 1000) return categoryImpacts[1000];
  return categoryImpacts[5000];
}

module.exports = router;
