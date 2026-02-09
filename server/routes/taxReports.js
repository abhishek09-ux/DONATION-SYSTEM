const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const User = require('../models/User');
const Charity = require('../models/Charity');
const PDFDocument = require('pdfkit');

// Middleware to check authentication
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get donation summary for tax purposes
router.get('/summary/:year', auth, async (req, res) => {
  try {
    const { year } = req.params;
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31T23:59:59`);

    const donations = await Donation.find({
      user: req.userId,
      status: 'completed',
      createdAt: { $gte: startDate, $lte: endDate }
    }).populate('charity', 'name registrationNumber pan80G');

    // Group donations by charity
    const byCharity = {};
    let totalAmount = 0;

    donations.forEach(donation => {
      const charityId = donation.charity._id.toString();
      if (!byCharity[charityId]) {
        byCharity[charityId] = {
          charity: donation.charity,
          donations: [],
          total: 0
        };
      }
      byCharity[charityId].donations.push({
        id: donation._id,
        amount: donation.amount,
        date: donation.createdAt,
        receiptNumber: donation.receiptNumber || `DON-${donation._id.toString().slice(-8).toUpperCase()}`
      });
      byCharity[charityId].total += donation.amount;
      totalAmount += donation.amount;
    });

    // Calculate tax benefits (Section 80G - typically 50% or 100% deduction)
    const taxBenefit50 = totalAmount * 0.5; // 50% deduction charities
    const taxBenefit100 = totalAmount; // 100% deduction charities (government funds)

    res.json({
      year: parseInt(year),
      summary: {
        totalDonations: donations.length,
        totalAmount,
        estimatedTaxBenefit: {
          under50Percent: taxBenefit50,
          under100Percent: taxBenefit100
        }
      },
      byCharity: Object.values(byCharity),
      user: req.userId
    });
  } catch (error) {
    console.error('Tax summary error:', error);
    res.status(500).json({ message: 'Error generating tax summary' });
  }
});

// Generate 80G certificate PDF for a specific donation
router.get('/certificate/:donationId', auth, async (req, res) => {
  try {
    const donation = await Donation.findOne({
      _id: req.params.donationId,
      user: req.userId
    }).populate('charity').populate('user');

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    const user = await User.findById(req.userId);
    const receiptNumber = donation.receiptNumber || `80G-${donation._id.toString().slice(-8).toUpperCase()}`;

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=80G-Certificate-${receiptNumber}.pdf`);
    
    doc.pipe(res);

    // Header
    doc.fontSize(20).text('DONATION RECEIPT', { align: 'center' });
    doc.fontSize(14).text('(For Income Tax Exemption under Section 80G)', { align: 'center' });
    doc.moveDown(2);

    // Receipt details
    doc.fontSize(12);
    doc.text(`Receipt Number: ${receiptNumber}`);
    doc.text(`Date: ${new Date(donation.createdAt).toLocaleDateString('en-IN')}`);
    doc.moveDown();

    // Charity details
    doc.fontSize(14).text('Organization Details:', { underline: true });
    doc.fontSize(12);
    doc.text(`Name: ${donation.charity?.name || 'N/A'}`);
    doc.text(`Registration Number: ${donation.charity?.registrationNumber || 'N/A'}`);
    doc.text(`80G Registration: ${donation.charity?.pan80G || 'Applied'}`);
    doc.moveDown();

    // Donor details
    doc.fontSize(14).text('Donor Details:', { underline: true });
    doc.fontSize(12);
    doc.text(`Name: ${user?.name || 'Anonymous Donor'}`);
    doc.text(`Email: ${user?.email || 'N/A'}`);
    doc.text(`PAN: ${user?.pan || 'Not Provided'}`);
    doc.moveDown();

    // Donation details
    doc.fontSize(14).text('Donation Details:', { underline: true });
    doc.fontSize(12);
    doc.text(`Amount: ₹${donation.amount.toLocaleString('en-IN')}`);
    doc.text(`Amount in Words: ${numberToWords(donation.amount)} Rupees Only`);
    doc.text(`Payment Mode: ${donation.paymentMethod || 'Online'}`);
    doc.text(`Transaction ID: ${donation.transactionId || donation._id}`);
    doc.moveDown(2);

    // Declaration
    doc.fontSize(10);
    doc.text('This receipt is issued under Section 80G of the Income Tax Act, 1961.', { align: 'center' });
    doc.text('The donor is eligible for tax deduction as per applicable provisions.', { align: 'center' });
    doc.moveDown(2);

    // Signature area
    doc.text('_____________________________', { align: 'right' });
    doc.text('Authorized Signatory', { align: 'right' });

    // Footer
    doc.fontSize(8);
    doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 50, doc.page.height - 50);

    doc.end();
  } catch (error) {
    console.error('Certificate generation error:', error);
    res.status(500).json({ message: 'Error generating certificate' });
  }
});

// Generate annual tax report PDF
router.get('/annual-report/:year', auth, async (req, res) => {
  try {
    const { year } = req.params;
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31T23:59:59`);

    const user = await User.findById(req.userId);
    const donations = await Donation.find({
      user: req.userId,
      status: 'completed',
      createdAt: { $gte: startDate, $lte: endDate }
    }).populate('charity', 'name registrationNumber pan80G').sort({ createdAt: 1 });

    if (donations.length === 0) {
      return res.status(404).json({ message: 'No donations found for this year' });
    }

    const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Annual-Donation-Report-${year}.pdf`);
    
    doc.pipe(res);

    // Header
    doc.fontSize(20).text('ANNUAL DONATION STATEMENT', { align: 'center' });
    doc.fontSize(14).text(`Financial Year: ${year}-${parseInt(year) + 1}`, { align: 'center' });
    doc.fontSize(12).text('(For Income Tax Filing Purpose)', { align: 'center' });
    doc.moveDown(2);

    // Donor details
    doc.fontSize(14).text('Donor Information:', { underline: true });
    doc.fontSize(12);
    doc.text(`Name: ${user?.name || 'N/A'}`);
    doc.text(`Email: ${user?.email || 'N/A'}`);
    doc.text(`PAN: ${user?.pan || 'Not Provided'}`);
    doc.moveDown();

    // Summary
    doc.fontSize(14).text('Donation Summary:', { underline: true });
    doc.fontSize(12);
    doc.text(`Total Donations: ${donations.length}`);
    doc.text(`Total Amount: ₹${totalAmount.toLocaleString('en-IN')}`);
    doc.text(`Estimated Tax Benefit (50%): ₹${(totalAmount * 0.5).toLocaleString('en-IN')}`);
    doc.moveDown();

    // Donation table
    doc.fontSize(14).text('Donation Details:', { underline: true });
    doc.moveDown();

    // Table header
    doc.fontSize(10);
    const tableTop = doc.y;
    doc.text('Date', 50, tableTop);
    doc.text('Charity', 120, tableTop);
    doc.text('Receipt No.', 320, tableTop);
    doc.text('Amount (₹)', 430, tableTop);
    
    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    let yPos = tableTop + 25;
    donations.forEach((donation, index) => {
      if (yPos > 700) {
        doc.addPage();
        yPos = 50;
      }
      
      const receiptNo = donation.receiptNumber || `DON-${donation._id.toString().slice(-6).toUpperCase()}`;
      doc.text(new Date(donation.createdAt).toLocaleDateString('en-IN'), 50, yPos);
      doc.text(donation.charity?.name?.substring(0, 30) || 'N/A', 120, yPos);
      doc.text(receiptNo, 320, yPos);
      doc.text(donation.amount.toLocaleString('en-IN'), 430, yPos);
      yPos += 20;
    });

    // Total line
    doc.moveTo(50, yPos).lineTo(550, yPos).stroke();
    yPos += 10;
    doc.fontSize(12).text('Total:', 320, yPos);
    doc.text(`₹${totalAmount.toLocaleString('en-IN')}`, 430, yPos);

    doc.moveDown(3);
    doc.fontSize(10);
    doc.text('Note: Please verify 80G registration status of each organization before claiming tax benefits.', 50);
    doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 50);

    doc.end();
  } catch (error) {
    console.error('Annual report error:', error);
    res.status(500).json({ message: 'Error generating annual report' });
  }
});

// Get list of all donations for tax purposes
router.get('/donations', auth, async (req, res) => {
  try {
    const { year, page = 1, limit = 20 } = req.query;
    
    const query = { user: req.userId, status: 'completed' };
    
    if (year) {
      query.createdAt = {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31T23:59:59`)
      };
    }

    const donations = await Donation.find(query)
      .populate('charity', 'name registrationNumber pan80G verificationBadge')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Donation.countDocuments(query);

    res.json({
      donations: donations.map(d => ({
        id: d._id,
        amount: d.amount,
        date: d.createdAt,
        charity: d.charity,
        receiptNumber: d.receiptNumber || `DON-${d._id.toString().slice(-8).toUpperCase()}`,
        taxDeductible: d.charity?.pan80G ? true : false
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Tax donations error:', error);
    res.status(500).json({ message: 'Error fetching donations' });
  }
});

// Helper function to convert number to words
function numberToWords(num) {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if (num === 0) return 'Zero';
  
  const convert = (n) => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
  };
  
  return convert(Math.floor(num));
}

module.exports = router;
