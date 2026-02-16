const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const DonorProfile = require('../models/DonorProfile');
const Charity = require('../models/Charity');
const { auth } = require('../middleware/auth');

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('role').isIn(['donor', 'charity']).withMessage('Invalid role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password, name, phone, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user
    const user = new User({
      email,
      password,
      name,
      phone,
      role
    });

    await user.save();

    // Create profile based on role
    if (role === 'donor') {
      await DonorProfile.create({ user: user._id });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account has been deactivated'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    let profile = null;
    if (user.role === 'donor') {
      profile = await DonorProfile.findOne({ user: req.userId });
    } else if (user.role === 'charity') {
      profile = await Charity.findOne({ user: req.userId });
    }

    res.json({
      success: true,
      data: {
        user,
        profile
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/auth/update-password
// @desc    Update password
// @access  Private
router.put('/update-password', auth, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.userId);
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// ============================================
// OAUTH ROUTES
// ============================================

// @route   POST /api/auth/google
// @desc    Login/Register with Google
// @access  Public
router.post('/google', async (req, res) => {
  try {
    const { credential, clientId } = req.body;
    
    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required'
      });
    }

    // Verify the Google token
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: clientId || process.env.GOOGLE_CLIENT_ID
      });
      payload = ticket.getPayload();
    } catch (verifyError) {
      console.error('Google token verification failed:', verifyError);
      return res.status(401).json({
        success: false,
        message: 'Invalid Google token'
      });
    }

    const { sub: googleId, email, name, picture, email_verified } = payload;

    // Check if user exists with this Google ID
    let user = await User.findOne({ googleId });
    
    if (!user) {
      // Check if user exists with this email
      user = await User.findOne({ email });
      
      if (user) {
        // Link Google account to existing user
        user.googleId = googleId;
        user.authProvider = user.authProvider === 'local' ? 'local' : 'google';
        if (picture && !user.avatar) user.avatar = picture;
        if (email_verified) user.emailVerified = true;
        await user.save();
      } else {
        // Create new user
        user = new User({
          email,
          name,
          googleId,
          avatar: picture || '',
          role: 'donor',
          isVerified: true,
          emailVerified: email_verified || false,
          authProvider: 'google'
        });
        await user.save();
        
        // Create donor profile
        await DonorProfile.create({ user: user._id });
      }
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Google login successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during Google authentication'
    });
  }
});

// @route   POST /api/auth/github
// @desc    Login/Register with GitHub
// @access  Public
router.post('/github', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'GitHub authorization code is required'
      });
    }

    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      },
      {
        headers: { Accept: 'application/json' }
      }
    );

    const { access_token } = tokenResponse.data;
    
    if (!access_token) {
      return res.status(401).json({
        success: false,
        message: 'Failed to get GitHub access token'
      });
    }

    // Get user info from GitHub
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const githubUser = userResponse.data;
    
    // Get user emails (may be private)
    let email = githubUser.email;
    if (!email) {
      const emailsResponse = await axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      const primaryEmail = emailsResponse.data.find(e => e.primary);
      email = primaryEmail?.email || `${githubUser.id}@github.user`;
    }

    // Check if user exists with this GitHub ID
    let user = await User.findOne({ githubId: githubUser.id.toString() });
    
    if (!user) {
      // Check if user exists with this email
      user = await User.findOne({ email });
      
      if (user) {
        // Link GitHub account to existing user
        user.githubId = githubUser.id.toString();
        if (githubUser.avatar_url && !user.avatar) user.avatar = githubUser.avatar_url;
        await user.save();
      } else {
        // Create new user
        user = new User({
          email,
          name: githubUser.name || githubUser.login,
          githubId: githubUser.id.toString(),
          avatar: githubUser.avatar_url || '',
          role: 'donor',
          isVerified: true,
          emailVerified: true,
          authProvider: 'github'
        });
        await user.save();
        
        // Create donor profile
        await DonorProfile.create({ user: user._id });
      }
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'GitHub login successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('GitHub auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during GitHub authentication'
    });
  }
});

// @route   POST /api/auth/facebook
// @desc    Login/Register with Facebook
// @access  Public
router.post('/facebook', async (req, res) => {
  try {
    const { accessToken, userID } = req.body;
    
    if (!accessToken || !userID) {
      return res.status(400).json({
        success: false,
        message: 'Facebook access token and user ID are required'
      });
    }

    // Verify the token and get user info from Facebook
    const fbResponse = await axios.get(
      `https://graph.facebook.com/v18.0/${userID}?fields=id,name,email,picture.type(large)&access_token=${accessToken}`
    );

    const fbUser = fbResponse.data;
    
    if (!fbUser || fbUser.id !== userID) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Facebook token'
      });
    }

    const email = fbUser.email || `${fbUser.id}@facebook.user`;

    // Check if user exists with this Facebook ID
    let user = await User.findOne({ facebookId: fbUser.id });
    
    if (!user) {
      // Check if user exists with this email
      user = await User.findOne({ email });
      
      if (user) {
        // Link Facebook account to existing user
        user.facebookId = fbUser.id;
        if (fbUser.picture?.data?.url && !user.avatar) {
          user.avatar = fbUser.picture.data.url;
        }
        await user.save();
      } else {
        // Create new user
        user = new User({
          email,
          name: fbUser.name,
          facebookId: fbUser.id,
          avatar: fbUser.picture?.data?.url || '',
          role: 'donor',
          isVerified: true,
          emailVerified: !!fbUser.email,
          authProvider: 'facebook'
        });
        await user.save();
        
        // Create donor profile
        await DonorProfile.create({ user: user._id });
      }
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Facebook login successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Facebook auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during Facebook authentication'
    });
  }
});

// @route   GET /api/auth/oauth/config
// @desc    Get OAuth configuration for frontend
// @access  Public
router.get('/oauth/config', (req, res) => {
  res.json({
    success: true,
    data: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        enabled: !!process.env.GOOGLE_CLIENT_ID
      },
      github: {
        clientId: process.env.GITHUB_CLIENT_ID || '',
        enabled: !!process.env.GITHUB_CLIENT_ID
      },
      facebook: {
        appId: process.env.FACEBOOK_APP_ID || '',
        enabled: !!process.env.FACEBOOK_APP_ID
      }
    }
  });
});

module.exports = router;
