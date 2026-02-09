const express = require('express');
const router = express.Router();
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { auth } = require('../middleware/auth');
const { sendOTPEmail } = require('../utils/email');

// @route   POST /api/2fa/send-otp
// @desc    Send OTP to email for 2FA
// @access  Public (for login) / Private (for enabling)
router.post('/send-otp', async (req, res) => {
  try {
    const { email, purpose = 'login' } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate OTP
    const otp = OTP.generateOTP();

    // Delete existing OTPs for this user and purpose
    await OTP.deleteMany({ userId: user._id, purpose });

    // Create new OTP
    await OTP.create({
      userId: user._id,
      email,
      otp,
      purpose,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    // Send OTP via email
    const emailResult = await sendOTPEmail(email, otp, purpose);
    
    if (!emailResult.success) {
      // For development - if email fails, log the OTP
      console.log(`DEV MODE - OTP for ${email}: ${otp}`);
    }

    res.json({
      success: true,
      message: 'OTP sent to your email'
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });
  }
});

// @route   POST /api/2fa/verify-otp
// @desc    Verify OTP
// @access  Public
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp, purpose = 'login' } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({
      userId: user._id,
      purpose,
      verified: false
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new one.'
      });
    }

    // Check if expired
    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Check attempts
    if (otpRecord.attempts >= 5) {
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Mark as verified
    otpRecord.verified = true;
    await otpRecord.save();

    res.json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP'
    });
  }
});

// @route   POST /api/2fa/enable
// @desc    Enable 2FA for user
// @access  Private
router.post('/enable', auth, async (req, res) => {
  try {
    const { method = 'email' } = req.body;
    const user = await User.findById(req.userId);

    if (method === 'authenticator') {
      // Generate secret for TOTP
      const secret = speakeasy.generateSecret({
        name: `DonateMatch:${user.email}`,
        issuer: 'DonateMatch'
      });

      // Generate QR code
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

      // Save secret (not confirmed yet)
      user.twoFactorSecret = secret.base32;
      user.twoFactorMethod = 'authenticator';
      await user.save();

      res.json({
        success: true,
        message: 'Scan the QR code with your authenticator app',
        data: {
          qrCode: qrCodeUrl,
          secret: secret.base32 // For manual entry
        }
      });
    } else {
      // Email method - send verification OTP
      user.twoFactorMethod = 'email';
      user.twoFactorEnabled = true;
      await user.save();

      res.json({
        success: true,
        message: '2FA via email has been enabled'
      });
    }
  } catch (error) {
    console.error('Enable 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enable 2FA'
    });
  }
});

// @route   POST /api/2fa/confirm-authenticator
// @desc    Confirm authenticator setup with verification code
// @access  Private
router.post('/confirm-authenticator', auth, async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.userId).select('+twoFactorSecret');

    if (!user.twoFactorSecret) {
      return res.status(400).json({
        success: false,
        message: 'Please setup authenticator first'
      });
    }

    // Verify the token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token
    });

    if (!verified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    user.twoFactorEnabled = true;
    await user.save();

    res.json({
      success: true,
      message: '2FA via authenticator has been enabled'
    });
  } catch (error) {
    console.error('Confirm authenticator error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm authenticator'
    });
  }
});

// @route   POST /api/2fa/verify-authenticator
// @desc    Verify authenticator token during login
// @access  Public
router.post('/verify-authenticator', async (req, res) => {
  try {
    const { email, token } = req.body;
    const user = await User.findOne({ email }).select('+twoFactorSecret');

    if (!user || !user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: '2FA not enabled for this account'
      });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1 // Allow 1 step tolerance
    });

    if (!verified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    res.json({
      success: true,
      message: '2FA verified successfully'
    });
  } catch (error) {
    console.error('Verify authenticator error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify 2FA'
    });
  }
});

// @route   POST /api/2fa/disable
// @desc    Disable 2FA
// @access  Private
router.post('/disable', auth, async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.userId);

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password'
      });
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    await user.save();

    res.json({
      success: true,
      message: '2FA has been disabled'
    });
  } catch (error) {
    console.error('Disable 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disable 2FA'
    });
  }
});

// @route   GET /api/2fa/status
// @desc    Get 2FA status
// @access  Private
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    res.json({
      success: true,
      data: {
        enabled: user.twoFactorEnabled,
        method: user.twoFactorMethod
      }
    });
  } catch (error) {
    console.error('Get 2FA status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get 2FA status'
    });
  }
});

module.exports = router;
