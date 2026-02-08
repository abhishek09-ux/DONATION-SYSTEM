const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const Donation = require('../models/Donation');
const Charity = require('../models/Charity');
const DonorProfile = require('../models/DonorProfile');
const { auth } = require('../middleware/auth');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_xxxxxxxxxxxx',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_secret_key'
});

// @route   POST /api/payments/create-order
// @desc    Create Razorpay order
// @access  Private
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount, donationId, charityId, currency = 'INR' } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        donationId: donationId || '',
        charityId: charityId || '',
        donorId: req.userId.toString()
      }
    };

    const order = await razorpay.orders.create(options);

    // If donation exists, update with order ID
    if (donationId) {
      await Donation.findByIdAndUpdate(donationId, {
        razorpayOrderId: order.id,
        paymentStatus: 'processing'
      });
    }

    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order'
    });
  }
});

// @route   POST /api/payments/verify
// @desc    Verify Razorpay payment
// @access  Private
router.post('/verify', auth, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      donationId
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_secret_key')
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      // Update donation as failed
      if (donationId) {
        await Donation.findByIdAndUpdate(donationId, {
          paymentStatus: 'failed',
          $push: {
            timeline: {
              status: 'failed',
              message: 'Payment verification failed',
              timestamp: new Date()
            }
          }
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Payment verified - update donation
    if (donationId) {
      const donation = await Donation.findById(donationId);
      
      if (donation) {
        donation.paymentStatus = 'completed';
        donation.razorpayOrderId = razorpay_order_id;
        donation.razorpayPaymentId = razorpay_payment_id;
        donation.razorpaySignature = razorpay_signature;
        donation.completedAt = new Date();
        donation.addTimelineEntry('completed', 'Payment verified successfully');
        
        await donation.save();

        // Update charity stats
        await Charity.findByIdAndUpdate(donation.charity, {
          $inc: {
            'stats.totalDonationsReceived': donation.amount,
            'stats.totalDonors': 1,
            'fundingNeeds.totalRaised': donation.amount
          }
        });

        // Update donor stats
        await DonorProfile.findOneAndUpdate(
          { user: req.userId },
          {
            $inc: {
              totalDonated: donation.amount,
              donationCount: 1
            }
          }
        );
      }
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id
      }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
});

// @route   POST /api/payments/quick-donate
// @desc    Quick donate - create donation and payment in one step
// @access  Private
router.post('/quick-donate', auth, async (req, res) => {
  try {
    const {
      charityId,
      amount,
      isAnonymous = false,
      message
    } = req.body;

    if (!charityId || !amount || amount < 1) {
      return res.status(400).json({
        success: false,
        message: 'Charity ID and valid amount are required'
      });
    }

    // Verify charity
    const charity = await Charity.findById(charityId);
    if (!charity || charity.verificationStatus !== 'verified') {
      return res.status(400).json({
        success: false,
        message: 'Invalid or unverified charity'
      });
    }

    if (amount < charity.minimumDonation) {
      return res.status(400).json({
        success: false,
        message: `Minimum donation is ₹${charity.minimumDonation}`
      });
    }

    // Create donation
    const donation = new Donation({
      donor: req.userId,
      charity: charityId,
      amount,
      paymentMethod: 'razorpay',
      paymentStatus: 'processing',
      isAnonymous,
      message,
      matchedVia: 'quick_donate'
    });

    donation.addTimelineEntry('created', 'Quick donation initiated');
    await donation.save();

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `qd_${donation._id}`,
      notes: {
        donationId: donation._id.toString(),
        charityId,
        donorId: req.userId.toString(),
        type: 'quick_donate'
      }
    });

    donation.razorpayOrderId = order.id;
    await donation.save();

    res.json({
      success: true,
      data: {
        donation: {
          id: donation._id,
          amount: donation.amount,
          charity: {
            id: charity._id,
            name: charity.organizationName,
            logo: charity.logo
          }
        },
        payment: {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          key: process.env.RAZORPAY_KEY_ID
        }
      }
    });
  } catch (error) {
    console.error('Quick donate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process quick donation'
    });
  }
});

// @route   GET /api/payments/status/:orderId
// @desc    Get payment status
// @access  Private
router.get('/status/:orderId', auth, async (req, res) => {
  try {
    const { orderId } = req.params;

    const donation = await Donation.findOne({ razorpayOrderId: orderId })
      .populate('charity', 'organizationName logo');

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (donation.donor.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: {
        status: donation.paymentStatus,
        amount: donation.amount,
        charity: donation.charity,
        completedAt: donation.completedAt,
        transactionId: donation.razorpayPaymentId
      }
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/payments/webhook
// @desc    Razorpay webhook handler
// @access  Public (verified by Razorpay signature)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret';

    const body = req.body;
    
    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(body))
      .digest('hex');

    if (webhookSignature !== expectedSignature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const { event, payload } = body;

    switch (event) {
      case 'payment.captured':
        const payment = payload.payment.entity;
        const orderId = payment.order_id;

        await Donation.findOneAndUpdate(
          { razorpayOrderId: orderId },
          {
            paymentStatus: 'completed',
            razorpayPaymentId: payment.id,
            completedAt: new Date(),
            $push: {
              timeline: {
                status: 'completed',
                message: 'Payment captured via webhook',
                timestamp: new Date()
              }
            }
          }
        );
        break;

      case 'payment.failed':
        const failedPayment = payload.payment.entity;
        await Donation.findOneAndUpdate(
          { razorpayOrderId: failedPayment.order_id },
          {
            paymentStatus: 'failed',
            $push: {
              timeline: {
                status: 'failed',
                message: 'Payment failed',
                timestamp: new Date()
              }
            }
          }
        );
        break;

      case 'refund.created':
        const refund = payload.refund.entity;
        await Donation.findOneAndUpdate(
          { razorpayPaymentId: refund.payment_id },
          {
            paymentStatus: 'refunded',
            $push: {
              timeline: {
                status: 'refunded',
                message: `Refund initiated: ₹${refund.amount / 100}`,
                timestamp: new Date()
              }
            }
          }
        );
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// @route   GET /api/payments/config
// @desc    Get Razorpay config (public key)
// @access  Public
router.get('/config', (req, res) => {
  res.json({
    success: true,
    data: {
      key: process.env.RAZORPAY_KEY_ID,
      currency: 'INR',
      name: 'AI Donation System',
      description: 'Donation Payment',
      image: '/logo.png'
    }
  });
});

module.exports = router;
