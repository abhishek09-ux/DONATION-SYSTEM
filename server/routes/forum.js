const express = require('express');
const router = express.Router();
const { ForumPost, ForumComment } = require('../models/Forum');
const { auth, optionalAuth } = require('../middleware/auth');

// @route   GET /api/forum/posts
// @desc    Get all forum posts
// @access  Public
router.get('/posts', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, sortBy = 'latest' } = req.query;

    const query = { status: 'active' };
    if (category && category !== 'all') query.category = category;

    let sort = { isPinned: -1 };
    if (sortBy === 'latest') sort.createdAt = -1;
    else if (sortBy === 'popular') sort.views = -1;
    else if (sortBy === 'mostLiked') sort['likes.length'] = -1;

    const posts = await ForumPost.find(query)
      .populate('author', 'name avatar')
      .populate('charity', 'organizationName')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ForumPost.countDocuments(query);

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: total
        }
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/forum/posts/:id
// @desc    Get single post with comments
// @access  Public
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await ForumPost.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'name avatar')
      .populate('charity', 'organizationName logo');

    if (!post || post.status !== 'active') {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comments = await ForumComment.find({ post: post._id, status: 'active' })
      .populate('author', 'name avatar')
      .populate('parentComment')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      data: { post, comments }
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/forum/posts
// @desc    Create a new post
// @access  Private
router.post('/posts', auth, async (req, res) => {
  try {
    const { title, content, category, tags, charity, images } = req.body;

    const post = await ForumPost.create({
      title,
      content,
      category,
      tags,
      charity,
      images,
      author: req.userId
    });

    await post.populate('author', 'name avatar');

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/forum/posts/:id/like
// @desc    Like/unlike a post
// @access  Private
router.post('/posts/:id/like', auth, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const likeIndex = post.likes.findIndex(like => like.user.toString() === req.userId);

    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push({ user: req.userId });
    }

    await post.save();

    res.json({
      success: true,
      data: {
        liked: likeIndex === -1,
        likeCount: post.likes.length
      }
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/forum/posts/:id/comments
// @desc    Add comment to post
// @access  Private
router.post('/posts/:id/comments', auth, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post || post.isLocked) {
      return res.status(404).json({ success: false, message: 'Post not found or locked' });
    }

    const { content, parentComment } = req.body;

    const comment = await ForumComment.create({
      post: post._id,
      content,
      author: req.userId,
      parentComment
    });

    await comment.populate('author', 'name avatar');

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/forum/posts/:id
// @desc    Delete post (soft delete)
// @access  Private (owner or admin)
router.delete('/posts/:id', auth, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.author.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    post.status = 'deleted';
    await post.save();

    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/forum/categories
// @desc    Get forum categories with post counts
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      { id: 'all', name: 'All Posts', icon: '📋' },
      { id: 'general', name: 'General Discussion', icon: '💬' },
      { id: 'charity-reviews', name: 'Charity Reviews', icon: '⭐' },
      { id: 'impact-stories', name: 'Impact Stories', icon: '❤️' },
      { id: 'tips', name: 'Tips & Advice', icon: '💡' },
      { id: 'questions', name: 'Questions', icon: '❓' },
      { id: 'announcements', name: 'Announcements', icon: '📢' }
    ];

    // Get counts for each category
    for (let cat of categories) {
      if (cat.id === 'all') {
        cat.count = await ForumPost.countDocuments({ status: 'active' });
      } else {
        cat.count = await ForumPost.countDocuments({ category: cat.id, status: 'active' });
      }
    }

    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
