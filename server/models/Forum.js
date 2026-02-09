const mongoose = require('mongoose');

const forumPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['general', 'charity-reviews', 'impact-stories', 'tips', 'questions', 'announcements'],
    default: 'general'
  },
  tags: [String],
  charity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Charity'
  },
  images: [String],
  likes: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  views: {
    type: Number,
    default: 0
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'hidden', 'deleted'],
    default: 'active'
  }
}, {
  timestamps: true
});

const forumCommentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumPost',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumComment'
  },
  likes: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  status: {
    type: String,
    enum: ['active', 'hidden', 'deleted'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Virtuals
forumPostSchema.virtual('likeCount').get(function() {
  return this.likes?.length || 0;
});

forumPostSchema.virtual('commentCount', {
  ref: 'ForumComment',
  localField: '_id',
  foreignField: 'post',
  count: true
});

forumPostSchema.set('toJSON', { virtuals: true });
forumPostSchema.set('toObject', { virtuals: true });

const ForumPost = mongoose.model('ForumPost', forumPostSchema);
const ForumComment = mongoose.model('ForumComment', forumCommentSchema);

module.exports = { ForumPost, ForumComment };
