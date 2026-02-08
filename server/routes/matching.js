const express = require('express');
const router = express.Router();
const { auth, optionalAuth } = require('../middleware/auth');
const {
  getMatchingCharities,
  getQuickRecommendations,
  findSimilarCharities,
  calculateMatchScore
} = require('../utils/matchingAlgorithm');
const DonorProfile = require('../models/DonorProfile');
const Charity = require('../models/Charity');

// @route   GET /api/matching/recommendations
// @desc    Get AI-powered charity recommendations for logged-in donor
// @access  Private
router.get('/recommendations', auth, async (req, res) => {
  try {
    const {
      limit = 5,
      minScore = 50,
      causes,
      city,
      state
    } = req.query;

    const options = {
      limit: parseInt(limit),
      minScore: parseInt(minScore),
      causes: causes ? causes.split(',') : null,
      city,
      state
    };

    const matches = await getMatchingCharities(req.userId, options);

    res.json({
      success: true,
      message: `Found ${matches.length} matching charities`,
      data: {
        matches,
        filters: options
      }
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   GET /api/matching/quick
// @desc    Get quick recommendations (for homepage, etc.)
// @access  Public (with optional auth for personalization)
router.get('/quick', optionalAuth, async (req, res) => {
  try {
    const { causes, limit = 3 } = req.query;
    
    let interests = causes ? causes.split(',') : null;
    
    // If logged in, use donor's interests
    if (req.userId) {
      const profile = await DonorProfile.findOne({ user: req.userId });
      if (profile?.interests?.length) {
        interests = profile.interests;
      }
    }

    const recommendations = await getQuickRecommendations(interests, parseInt(limit));

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Quick recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/matching/similar/:charityId
// @desc    Find similar charities
// @access  Public
router.get('/similar/:charityId', async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const similarCharities = await findSimilarCharities(
      req.params.charityId, 
      parseInt(limit)
    );

    res.json({
      success: true,
      data: similarCharities
    });
  } catch (error) {
    console.error('Similar charities error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   POST /api/matching/score
// @desc    Calculate match score between donor and specific charity
// @access  Private
router.post('/score', auth, async (req, res) => {
  try {
    const { charityId } = req.body;

    if (!charityId) {
      return res.status(400).json({
        success: false,
        message: 'Charity ID is required'
      });
    }

    const donorProfile = await DonorProfile.findOne({ user: req.userId });
    const charity = await Charity.findById(charityId);

    if (!donorProfile) {
      return res.status(404).json({
        success: false,
        message: 'Donor profile not found'
      });
    }

    if (!charity) {
      return res.status(404).json({
        success: false,
        message: 'Charity not found'
      });
    }

    const matchData = calculateMatchScore(donorProfile, charity);

    res.json({
      success: true,
      data: {
        charity: {
          id: charity._id,
          name: charity.organizationName,
          causes: charity.causes
        },
        ...matchData
      }
    });
  } catch (error) {
    console.error('Calculate score error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/matching/trending
// @desc    Get trending/popular charities
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    // Get charities with most recent donations
    const trendingCharities = await Charity.find({
      verificationStatus: 'verified'
    })
    .sort({ 
      'stats.totalDonationsReceived': -1,
      'rating.average': -1 
    })
    .limit(parseInt(limit))
    .select('organizationName logo causes location rating stats fundingNeeds');

    res.json({
      success: true,
      data: trendingCharities
    });
  } catch (error) {
    console.error('Trending charities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/matching/by-cause/:cause
// @desc    Get top charities by cause
// @access  Public
router.get('/by-cause/:cause', async (req, res) => {
  try {
    const { cause } = req.params;
    const { limit = 10 } = req.query;

    const charities = await Charity.find({
      verificationStatus: 'verified',
      causes: cause
    })
    .sort({ 'rating.average': -1, 'stats.totalDonationsReceived': -1 })
    .limit(parseInt(limit))
    .select('organizationName logo causes location rating stats description');

    res.json({
      success: true,
      data: {
        cause,
        charities
      }
    });
  } catch (error) {
    console.error('Charities by cause error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/matching/filters
// @desc    Get available filter options
// @access  Public
router.get('/filters', async (req, res) => {
  try {
    // Get unique cities and states
    const locations = await Charity.aggregate([
      { $match: { verificationStatus: 'verified' } },
      {
        $group: {
          _id: null,
          cities: { $addToSet: '$location.city' },
          states: { $addToSet: '$location.state' }
        }
      }
    ]);

    // Get cause counts
    const causeCounts = await Charity.aggregate([
      { $match: { verificationStatus: 'verified' } },
      { $unwind: '$causes' },
      {
        $group: {
          _id: '$causes',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const causes = [
      { id: 'education', name: 'Education', icon: '📚' },
      { id: 'health', name: 'Health & Medical', icon: '🏥' },
      { id: 'environment', name: 'Environment', icon: '🌱' },
      { id: 'disaster_relief', name: 'Disaster Relief', icon: '🆘' },
      { id: 'women_empowerment', name: 'Women Empowerment', icon: '👩' },
      { id: 'child_welfare', name: 'Child Welfare', icon: '👶' },
      { id: 'elderly_care', name: 'Elderly Care', icon: '👴' },
      { id: 'animal_welfare', name: 'Animal Welfare', icon: '🐾' },
      { id: 'rural_development', name: 'Rural Development', icon: '🏘️' },
      { id: 'poverty_alleviation', name: 'Poverty Alleviation', icon: '🤝' },
      { id: 'arts_culture', name: 'Arts & Culture', icon: '🎨' },
      { id: 'sports', name: 'Sports', icon: '⚽' },
      { id: 'technology', name: 'Technology', icon: '💻' },
      { id: 'other', name: 'Other', icon: '📌' }
    ];

    // Merge cause counts
    const causesWithCounts = causes.map(cause => {
      const found = causeCounts.find(c => c._id === cause.id);
      return {
        ...cause,
        count: found?.count || 0
      };
    });

    res.json({
      success: true,
      data: {
        causes: causesWithCounts,
        cities: locations[0]?.cities?.filter(Boolean).sort() || [],
        states: locations[0]?.states?.filter(Boolean).sort() || [],
        donationAmounts: [100, 500, 1000, 2500, 5000, 10000, 25000, 50000]
      }
    });
  } catch (error) {
    console.error('Get filters error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
