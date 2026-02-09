const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const Charity = require('../models/Charity');
const { auth, isCharity, isAdmin } = require('../middleware/auth');

// @route   GET /api/campaigns
// @desc    Get all active campaigns
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, category, featured, charity, status = 'active' } = req.query;

    const query = { status };
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    if (charity) query.charity = charity;

    const campaigns = await Campaign.find(query)
      .populate('charity', 'organizationName logo verificationBadge')
      .sort({ featured: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Campaign.countDocuments(query);

    res.json({
      success: true,
      data: {
        campaigns,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: total
        }
      }
    });
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/campaigns/:id
// @desc    Get campaign by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('charity', 'organizationName logo verificationBadge location description');

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    res.json({ success: true, data: campaign });
  } catch (error) {
    console.error('Get campaign error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/campaigns
// @desc    Create a new campaign
// @access  Private (Charity)
router.post('/', auth, async (req, res) => {
  try {
    const charity = await Charity.findOne({ user: req.userId });
    if (!charity) {
      return res.status(403).json({ success: false, message: 'Only charities can create campaigns' });
    }

    const campaign = await Campaign.create({
      ...req.body,
      charity: charity._id,
      createdBy: req.userId
    });

    res.status(201).json({ success: true, data: campaign });
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/campaigns/:id
// @desc    Update campaign
// @access  Private (Charity owner)
router.put('/:id', auth, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    const charity = await Charity.findOne({ user: req.userId });
    if (!charity || campaign.charity.toString() !== charity._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    Object.assign(campaign, req.body);
    await campaign.save();

    res.json({ success: true, data: campaign });
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/campaigns/:id/update
// @desc    Add campaign update/news
// @access  Private (Charity owner)
router.post('/:id/update', auth, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    const charity = await Charity.findOne({ user: req.userId });
    if (!charity || campaign.charity.toString() !== charity._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    campaign.updates.push({
      title: req.body.title,
      content: req.body.content,
      image: req.body.image
    });
    await campaign.save();

    res.json({ success: true, data: campaign });
  } catch (error) {
    console.error('Add update error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/campaigns/featured
// @desc    Get featured campaigns
// @access  Public
router.get('/list/featured', async (req, res) => {
  try {
    const campaigns = await Campaign.find({ featured: true, status: 'active' })
      .populate('charity', 'organizationName logo verificationBadge')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({ success: true, data: campaigns });
  } catch (error) {
    console.error('Get featured campaigns error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
