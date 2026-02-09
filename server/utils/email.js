const nodemailer = require('nodemailer');

// Create transporter - using Gmail by default, can be configured
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send OTP email
const sendOTPEmail = async (email, otp, purpose = 'login') => {
  const transporter = createTransporter();
  
  const purposeText = {
    'login': 'Login Verification',
    'registration': 'Email Verification',
    'password-reset': 'Password Reset',
    'email-verification': 'Email Verification'
  };

  const mailOptions = {
    from: `"DonateMatch" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `${purposeText[purpose]} - Your OTP Code`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-box { background: white; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .otp-code { font-size: 36px; font-weight: bold; color: #6366f1; letter-spacing: 8px; }
          .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 20px; }
          .warning { color: #ef4444; font-size: 14px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎁 DonateMatch</h1>
            <p>${purposeText[purpose]}</p>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>Your one-time password (OTP) for ${purposeText[purpose].toLowerCase()} is:</p>
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
            </div>
            <p>This code will expire in <strong>10 minutes</strong>.</p>
            <p class="warning">⚠️ Never share this code with anyone. DonateMatch will never ask for your OTP.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} DonateMatch. All rights reserved.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Send donation receipt email
const sendDonationReceiptEmail = async (email, donationDetails) => {
  const transporter = createTransporter();
  
  const { donorName, charityName, amount, transactionId, date, receiptNumber } = donationDetails;

  const mailOptions = {
    from: `"DonateMatch" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Donation Receipt - ₹${amount.toLocaleString()} to ${charityName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .receipt-box { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .amount { font-size: 36px; font-weight: bold; color: #22c55e; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
          .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 20px; }
          .tax-note { background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Thank You!</h1>
            <p>Your donation has been received</p>
          </div>
          <div class="content">
            <p>Dear ${donorName},</p>
            <p>Thank you for your generous donation to <strong>${charityName}</strong>.</p>
            <div class="receipt-box">
              <div style="text-align: center; margin-bottom: 20px;">
                <div class="amount">₹${amount.toLocaleString()}</div>
              </div>
              <div class="detail-row">
                <span>Receipt Number:</span>
                <strong>${receiptNumber}</strong>
              </div>
              <div class="detail-row">
                <span>Transaction ID:</span>
                <strong>${transactionId}</strong>
              </div>
              <div class="detail-row">
                <span>Date:</span>
                <strong>${new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
              </div>
              <div class="detail-row" style="border-bottom: none;">
                <span>Charity:</span>
                <strong>${charityName}</strong>
              </div>
            </div>
            <div class="tax-note">
              <strong>📋 Tax Benefit:</strong> This donation is eligible for tax deduction under Section 80G of the Income Tax Act. Please save this receipt for your tax records.
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} DonateMatch. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Receipt email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, name) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"DonateMatch" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to DonateMatch! 🎁',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .btn { display: inline-block; background: #6366f1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎁 Welcome to DonateMatch!</h1>
          </div>
          <div class="content">
            <p>Hello ${name},</p>
            <p>Welcome to DonateMatch - India's AI-Powered Donation Matching Platform!</p>
            <p>Here's what you can do:</p>
            <ul>
              <li>🔍 Discover verified charities matching your interests</li>
              <li>💰 Make secure donations with 80G tax benefits</li>
              <li>📊 Track your impact with detailed analytics</li>
              <li>🏆 Join our donor leaderboard</li>
            </ul>
            <center>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/charities" class="btn">Start Exploring</a>
            </center>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} DonateMatch. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Welcome email sending failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOTPEmail,
  sendDonationReceiptEmail,
  sendWelcomeEmail
};
