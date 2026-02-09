const express = require('express');
const router = express.Router();
const { VolunteerOpportunity, VolunteerApplication } = require('../models/Volunteer');
const Charity = require('../models/Charity');
const { auth } = require('../middleware/auth');

// @route   GET /api/volunteers/opportunities
// @desc    Get volunteer opportunities
// @access  Public
router.get('/opportunities', async (req, res) => {
  try {
    const { page = 1, limit = 12, skill, location, type, charity } = req.query;

    const query = { status: 'open' };
    if (skill) query.skills = skill;
    if (type) query['location.type'] = type;
    if (location) query['location.city'] = new RegExp(location, 'i');
    if (charity) query.charity = charity;

    const opportunities = await VolunteerOpportunity.find(query)
      .populate('charity', 'organizationName logo verificationBadge')
      .sort({ featured: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await VolunteerOpportunity.countDocuments(query);

    res.json({
      success: true,
      data: {
        opportunities,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: total
        }
      }
    });
  } catch (error) {
    console.error('Get opportunities error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/volunteers/opportunities/:id
// @desc    Get single opportunity
// @access  Public
router.get('/opportunities/:id', async (req, res) => {
  try {
    const opportunity = await VolunteerOpportunity.findById(req.params.id)
      .populate('charity', 'organizationName logo verificationBadge description location');

    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    res.json({ success: true, data: opportunity });
  } catch (error) {
    console.error('Get opportunity error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/volunteers/opportunities
// @desc    Create volunteer opportunity
// @access  Private (Charity)
router.post('/opportunities', auth, async (req, res) => {
  try {
    const charity = await Charity.findOne({ user: req.userId });
    if (!charity) {
      return res.status(403).json({ success: false, message: 'Only charities can create opportunities' });
    }

    const opportunity = await VolunteerOpportunity.create({
      ...req.body,
      charity: charity._id
    });

    res.status(201).json({ success: true, data: opportunity });
  } catch (error) {
    console.error('Create opportunity error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/volunteers/opportunities/:id/apply
// @desc    Apply for volunteer opportunity
// @access  Private
router.post('/opportunities/:id/apply', auth, async (req, res) => {
  try {
    const opportunity = await VolunteerOpportunity.findById(req.params.id);
    if (!opportunity || opportunity.status !== 'open') {
      return res.status(404).json({ success: false, message: 'Opportunity not found or closed' });
    }

    // Check if already applied
    const existingApplication = await VolunteerApplication.findOne({
      opportunity: opportunity._id,
      user: req.userId
    });

    if (existingApplication) {
      return res.status(400).json({ success: false, message: 'You have already applied' });
    }

    const { message, skills, availability, experience } = req.body;

    const application = await VolunteerApplication.create({
      opportunity: opportunity._id,
      user: req.userId,
      message,
      skills,
      availability,
      experience
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    console.error('Apply error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/volunteers/my-applications
// @desc    Get user's volunteer applications
// @access  Private
router.get('/my-applications', auth, async (req, res) => {
  try {
    const applications = await VolunteerApplication.find({ user: req.userId })
      .populate({
        path: 'opportunity',
        populate: { path: 'charity', select: 'organizationName logo' }
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: applications });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/volunteers/charity-applications
// @desc    Get applications for charity's opportunities
// @access  Private (Charity)
router.get('/charity-applications', auth, async (req, res) => {
  try {
    const charity = await Charity.findOne({ user: req.userId });
    if (!charity) {
      return res.status(403).json({ success: false, message: 'Not a charity' });
    }

    const opportunities = await VolunteerOpportunity.find({ charity: charity._id });
    const opportunityIds = opportunities.map(o => o._id);

    const applications = await VolunteerApplication.find({
      opportunity: { $in: opportunityIds }
    })
      .populate('user', 'name email avatar')
      .populate('opportunity', 'title')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: applications });
  } catch (error) {
    console.error('Get charity applications error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/volunteers/applications/:id/status
// @desc    Update application status
// @access  Private (Charity)
router.put('/applications/:id/status', auth, async (req, res) => {
  try {
    const { status, reviewNotes } = req.body;

    const application = await VolunteerApplication.findById(req.params.id)
      .populate('opportunity');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const charity = await Charity.findOne({ user: req.userId });
    if (!charity || application.opportunity.charity.toString() !== charity._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    application.status = status;
    application.reviewedBy = req.userId;
    application.reviewedAt = new Date();
    application.reviewNotes = reviewNotes;
    await application.save();

    // Update spots filled if accepted
    if (status === 'accepted') {
      await VolunteerOpportunity.findByIdAndUpdate(
        application.opportunity._id,
        { $inc: { spotsFilled: 1 } }
      );
    }

    res.json({ success: true, data: application });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/volunteers/skills
// @desc    Get list of volunteer skills
// @access  Public
router.get('/skills', (req, res) => {
  const skills = [
    { id: 'teaching', name: 'Teaching', icon: '📚' },
    { id: 'medical', name: 'Medical/Healthcare', icon: '🏥' },
    { id: 'technical', name: 'Technical/IT', icon: '💻' },
    { id: 'administrative', name: 'Administrative', icon: '📋' },
    { id: 'creative', name: 'Creative/Design', icon: '🎨' },
    { id: 'physical-labor', name: 'Physical Labor', icon: '💪' },
    { id: 'counseling', name: 'Counseling', icon: '🤝' },
    { id: 'event-management', name: 'Event Management', icon: '🎉' },
    { id: 'fundraising', name: 'Fundraising', icon: '💰' },
    { id: 'other', name: 'Other', icon: '✨' }
  ];

  res.json({ success: true, data: skills });
});

module.exports = router;
