const express = require('express');
const router = express.Router();
const ImpactStory = require('../models/ImpactStory');
const Charity = require('../models/Charity');
const { auth } = require('../middleware/auth');

// @route   GET /api/impact-stories
// @desc    Get impact stories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, category, charity, featured } = req.query;

    const query = { status: 'published' };
    if (category) query.category = category;
    if (charity) query.charity = charity;
    if (featured === 'true') query.featured = true;

    const stories = await ImpactStory.find(query)
      .populate('charity', 'organizationName logo verificationBadge')
      .sort({ featured: -1, publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ImpactStory.countDocuments(query);

    res.json({
      success: true,
      data: {
        stories,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: total
        }
      }
    });
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/impact-stories/:id
// @desc    Get single impact story
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const story = await ImpactStory.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('charity', 'organizationName logo verificationBadge description');

    if (!story || story.status !== 'published') {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    res.json({ success: true, data: story });
  } catch (error) {
    console.error('Get story error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/impact-stories
// @desc    Create impact story
// @access  Private (Charity)
router.post('/', auth, async (req, res) => {
  try {
    const charity = await Charity.findOne({ user: req.userId });
    if (!charity) {
      return res.status(403).json({ success: false, message: 'Only charities can create stories' });
    }

    const story = await ImpactStory.create({
      ...req.body,
      charity: charity._id
    });

    res.status(201).json({ success: true, data: story });
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/impact-stories/:id
// @desc    Update impact story
// @access  Private (Charity owner)
router.put('/:id', auth, async (req, res) => {
  try {
    const story = await ImpactStory.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    const charity = await Charity.findOne({ user: req.userId });
    if (!charity || story.charity.toString() !== charity._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    Object.assign(story, req.body);
    
    if (req.body.status === 'published' && !story.publishedAt) {
      story.publishedAt = new Date();
    }

    await story.save();

    res.json({ success: true, data: story });
  } catch (error) {
    console.error('Update story error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/impact-stories/:id/like
// @desc    Like/unlike a story
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const story = await ImpactStory.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    const likeIndex = story.likes.findIndex(like => like.user.toString() === req.userId);

    if (likeIndex > -1) {
      story.likes.splice(likeIndex, 1);
    } else {
      story.likes.push({ user: req.userId });
    }

    await story.save();

    res.json({
      success: true,
      data: {
        liked: likeIndex === -1,
        likeCount: story.likes.length
      }
    });
  } catch (error) {
    console.error('Like story error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/impact-stories/:id/share
// @desc    Increment share count
// @access  Public
router.post('/:id/share', async (req, res) => {
  try {
    const story = await ImpactStory.findByIdAndUpdate(
      req.params.id,
      { $inc: { shares: 1 } },
      { new: true }
    );

    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    res.json({ success: true, data: { shares: story.shares } });
  } catch (error) {
    console.error('Share story error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/impact-stories/featured
// @desc    Get featured impact stories
// @access  Public
router.get('/list/featured', async (req, res) => {
  try {
    const stories = await ImpactStory.find({ featured: true, status: 'published' })
      .populate('charity', 'organizationName logo')
      .sort({ publishedAt: -1 })
      .limit(6);

    res.json({ success: true, data: stories });
  } catch (error) {
    console.error('Get featured stories error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
