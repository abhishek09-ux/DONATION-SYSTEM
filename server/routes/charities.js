const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Charity = require('../models/Charity');
const User = require('../models/User');
const Donation = require('../models/Donation');
const { auth, isCharity, optionalAuth } = require('../middleware/auth');

// @route   GET /api/charities
// @desc    Get all verified charities
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      cause,
      city,
      state,
      search,
      sortBy = 'rating',
      verified = 'true'
    } = req.query;

    const query = {};
    
    if (verified === 'true') {
      query.verificationStatus = 'verified';
    }

    if (cause) {
      query.causes = { $in: cause.split(',') };
    }

    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }

    if (state) {
      query['location.state'] = new RegExp(state, 'i');
    }

    if (search) {
      query.$or = [
        { organizationName: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') }
      ];
    }

    const sortOptions = {
      rating: { 'rating.average': -1 },
      donations: { 'stats.totalDonationsReceived': -1 },
      recent: { createdAt: -1 },
      name: { organizationName: 1 }
    };

    const charities = await Charity.find(query)
      .populate('user', 'name email')
      .select('-bankDetails -documents')
      .sort(sortOptions[sortBy] || sortOptions.rating)
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

// @route   GET /api/charities/:id
// @desc    Get charity by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const charity = await Charity.findById(req.params.id)
      .populate('user', 'name email phone')
      .select('-bankDetails.accountNumber');

    if (!charity) {
      return res.status(404).json({
        success: false,
        message: 'Charity not found'
      });
    }

    // Get recent donations (anonymized)
    const recentDonations = await Donation.find({
      charity: req.params.id,
      paymentStatus: 'completed'
    })
    .populate('donor', 'name')
    .select('amount createdAt isAnonymous donor message')
    .sort({ createdAt: -1 })
    .limit(10);

    // Anonymize donor info
    const donations = recentDonations.map(d => ({
      amount: d.amount,
      createdAt: d.createdAt,
      donor: d.isAnonymous ? 'Anonymous' : d.donor?.name || 'Anonymous',
      message: d.message
    }));

    res.json({
      success: true,
      data: {
        charity,
        recentDonations: donations
      }
    });
  } catch (error) {
    console.error('Get charity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/charities/register
// @desc    Register a new charity
// @access  Private (Charity role)
router.post('/register', auth, isCharity, [
  body('organizationName').trim().notEmpty().withMessage('Organization name is required'),
  body('registrationNumber').trim().notEmpty().withMessage('Registration number is required'),
  body('description').trim().isLength({ min: 50 }).withMessage('Description must be at least 50 characters'),
  body('causes').isArray({ min: 1 }).withMessage('At least one cause is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Check if charity already exists for this user
    const existingCharity = await Charity.findOne({ user: req.userId });
    if (existingCharity) {
      return res.status(400).json({
        success: false,
        message: 'Charity profile already exists'
      });
    }

    // Check for duplicate registration number
    const duplicateReg = await Charity.findOne({ registrationNumber: req.body.registrationNumber });
    if (duplicateReg) {
      return res.status(400).json({
        success: false,
        message: 'Charity with this registration number already exists'
      });
    }

    const charityData = {
      user: req.userId,
      organizationName: req.body.organizationName,
      registrationNumber: req.body.registrationNumber,
      description: req.body.description,
      mission: req.body.mission,
      vision: req.body.vision,
      foundedYear: req.body.foundedYear,
      website: req.body.website,
      socialMedia: req.body.socialMedia,
      location: req.body.location,
      operatingAreas: req.body.operatingAreas,
      causes: req.body.causes,
      beneficiaryTypes: req.body.beneficiaryTypes,
      fundingNeeds: req.body.fundingNeeds,
      minimumDonation: req.body.minimumDonation,
      is80GRegistered: req.body.is80GRegistered,
      fcraRegistered: req.body.fcraRegistered,
      tags: req.body.tags
    };

    const charity = await Charity.create(charityData);

    res.status(201).json({
      success: true,
      message: 'Charity registered successfully. Pending verification.',
      data: charity
    });
  } catch (error) {
    console.error('Register charity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/charities/profile
// @desc    Update charity profile
// @access  Private (Charity)
router.put('/profile', auth, isCharity, async (req, res) => {
  try {
    const charity = await Charity.findOne({ user: req.userId });
    
    if (!charity) {
      return res.status(404).json({
        success: false,
        message: 'Charity profile not found'
      });
    }

    const updateFields = [
      'description', 'mission', 'vision', 'website', 'socialMedia',
      'location', 'operatingAreas', 'causes', 'beneficiaryTypes',
      'fundingNeeds', 'minimumDonation', 'acceptsRecurring',
      'logo', 'coverImage', 'gallery', 'tags'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        charity[field] = req.body[field];
      }
    });

    await charity.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: charity
    });
  } catch (error) {
    console.error('Update charity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/charities/my/profile
// @desc    Get my charity profile
// @access  Private (Charity)
router.get('/my/profile', auth, isCharity, async (req, res) => {
  try {
    const charity = await Charity.findOne({ user: req.userId })
      .populate('user', 'name email phone');

    if (!charity) {
      return res.status(404).json({
        success: false,
        message: 'Please complete your charity registration'
      });
    }

    res.json({
      success: true,
      data: charity
    });
  } catch (error) {
    console.error('Get my charity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/charities/my/dashboard
// @desc    Get charity dashboard
// @access  Private (Charity)
router.get('/my/dashboard', auth, isCharity, async (req, res) => {
  try {
    const charity = await Charity.findOne({ user: req.userId });
    
    if (!charity) {
      return res.status(404).json({
        success: false,
        message: 'Charity profile not found'
      });
    }

    // Get donation statistics
    const donationStats = await Donation.aggregate([
      { $match: { charity: charity._id, paymentStatus: 'completed' } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' },
          uniqueDonors: { $addToSet: '$donor' }
        }
      }
    ]);

    // Recent donations
    const recentDonations = await Donation.find({
      charity: charity._id,
      paymentStatus: 'completed'
    })
    .populate('donor', 'name email')
    .sort({ createdAt: -1 })
    .limit(10);

    // Monthly trend
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrend = await Donation.aggregate([
      {
        $match: {
          charity: charity._id,
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
        charity,
        stats: {
          totalRaised: donationStats[0]?.totalAmount || 0,
          donationCount: donationStats[0]?.count || 0,
          avgDonation: Math.round(donationStats[0]?.avgAmount || 0),
          uniqueDonors: donationStats[0]?.uniqueDonors?.length || 0
        },
        recentDonations,
        monthlyTrend
      }
    });
  } catch (error) {
    console.error('Charity dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/charities/my/projects
// @desc    Add a new project
// @access  Private (Charity)
router.post('/my/projects', auth, isCharity, [
  body('title').trim().notEmpty().withMessage('Project title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('targetAmount').isNumeric().withMessage('Target amount is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const charity = await Charity.findOne({ user: req.userId });
    
    if (!charity) {
      return res.status(404).json({
        success: false,
        message: 'Charity profile not found'
      });
    }

    const project = {
      title: req.body.title,
      description: req.body.description,
      targetAmount: req.body.targetAmount,
      startDate: req.body.startDate || new Date(),
      endDate: req.body.endDate,
      beneficiariesCount: req.body.beneficiariesCount,
      images: req.body.images || []
    };

    charity.activeProjects.push(project);
    await charity.save();

    res.status(201).json({
      success: true,
      message: 'Project added successfully',
      data: charity.activeProjects[charity.activeProjects.length - 1]
    });
  } catch (error) {
    console.error('Add project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/charities/my/impact-report
// @desc    Add impact report
// @access  Private (Charity)
router.post('/my/impact-report', auth, isCharity, async (req, res) => {
  try {
    const charity = await Charity.findOne({ user: req.userId });
    
    if (!charity) {
      return res.status(404).json({
        success: false,
        message: 'Charity profile not found'
      });
    }

    const report = {
      title: req.body.title,
      description: req.body.description,
      date: new Date(),
      fileUrl: req.body.fileUrl,
      metrics: req.body.metrics
    };

    charity.impactReports.push(report);
    await charity.save();

    res.status(201).json({
      success: true,
      message: 'Impact report added successfully',
      data: charity.impactReports[charity.impactReports.length - 1]
    });
  } catch (error) {
    console.error('Add impact report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/charities/causes/list
// @desc    Get list of all causes
// @access  Public
router.get('/causes/list', (req, res) => {
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

  res.json({
    success: true,
    data: causes
  });
});

module.exports = router;
