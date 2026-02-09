const express = require('express');
const router = express.Router();
const Charity = require('../models/Charity');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');

// Chatbot knowledge base
const FAQ = {
  'how to donate': {
    answer: 'To donate, simply browse our charities, select one you want to support, choose an amount, and complete the payment. You can pay using UPI, cards, or net banking.',
    actions: ['browse_charities', 'view_campaigns']
  },
  'tax benefits': {
    answer: 'Donations to registered charities with 80G certification are eligible for tax deduction under Section 80G of the Income Tax Act. You can get 50% or 100% deduction based on the charity type.',
    actions: ['view_tax_report', 'download_certificate']
  },
  'payment methods': {
    answer: 'We accept multiple payment methods: UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Wallets. All payments are securely processed.',
    actions: []
  },
  'refund': {
    answer: 'Donations are generally non-refundable as they go directly to charities. However, for technical issues or failed transactions, please contact our support team with your transaction ID.',
    actions: ['contact_support']
  },
  'recurring donation': {
    answer: 'Yes! You can set up monthly recurring donations to your favorite charities. Go to the charity page and select "Monthly Donation" option.',
    actions: ['setup_recurring']
  },
  'track donation': {
    answer: 'You can track all your donations in your Dashboard. We also send email receipts for every donation. For 80G certificates, visit the Tax Reports section.',
    actions: ['view_dashboard', 'view_donations']
  },
  'charity verification': {
    answer: 'All charities on our platform are verified. We check their legal registration, 80G status, and financial records. Look for the verification badge on charity profiles.',
    actions: ['learn_verification']
  },
  'corporate matching': {
    answer: 'Many companies match employee donations. Check if your employer has a matching program in our Corporate section, or contact your HR department.',
    actions: ['view_corporate']
  }
};

// Intent patterns for matching user queries
const INTENT_PATTERNS = [
  { pattern: /how.*(donate|give|contribute)/i, intent: 'how to donate' },
  { pattern: /(tax|80g|deduction|exemption)/i, intent: 'tax benefits' },
  { pattern: /(pay|payment|upi|card|bank)/i, intent: 'payment methods' },
  { pattern: /(refund|cancel|money back)/i, intent: 'refund' },
  { pattern: /(recurring|monthly|regular|subscribe)/i, intent: 'recurring donation' },
  { pattern: /(track|history|receipt|status)/i, intent: 'track donation' },
  { pattern: /(verify|verified|trust|legitimate|safe)/i, intent: 'charity verification' },
  { pattern: /(corporate|employer|company|match)/i, intent: 'corporate matching' },
  { pattern: /(hello|hi|hey|start)/i, intent: 'greeting' },
  { pattern: /(help|support|assist)/i, intent: 'help' },
  { pattern: /(charity|charities|ngo|organization)/i, intent: 'find_charity' },
  { pattern: /(campaign|cause|project)/i, intent: 'find_campaign' }
];

// Process chat message
router.post('/message', async (req, res) => {
  try {
    const { message, userId, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const lowerMessage = message.toLowerCase().trim();
    
    // Detect intent
    let matchedIntent = null;
    for (const { pattern, intent } of INTENT_PATTERNS) {
      if (pattern.test(lowerMessage)) {
        matchedIntent = intent;
        break;
      }
    }

    // Generate response based on intent
    let response = await generateResponse(matchedIntent, message, userId);

    res.json(response);
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ 
      message: 'Sorry, I encountered an error. Please try again.',
      type: 'error'
    });
  }
});

// Get suggested questions
router.get('/suggestions', async (req, res) => {
  try {
    const suggestions = [
      'How do I donate?',
      'What are the tax benefits?',
      'How can I track my donations?',
      'Are the charities verified?',
      'What payment methods are accepted?',
      'How do I set up monthly donations?'
    ];

    res.json({ suggestions });
  } catch (error) {
    res.status(500).json({ message: 'Error getting suggestions' });
  }
});

// Search charities through chatbot
router.get('/search/charities', async (req, res) => {
  try {
    const { query, category } = req.query;
    
    const searchQuery = { isActive: true };
    
    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (category) {
      searchQuery.category = category;
    }

    const charities = await Charity.find(searchQuery)
      .select('name description category verificationBadge image')
      .limit(5);

    res.json({ charities });
  } catch (error) {
    res.status(500).json({ message: 'Error searching charities' });
  }
});

// Generate chatbot response
async function generateResponse(intent, message, userId) {
  switch (intent) {
    case 'greeting':
      return {
        text: 'Hello! 👋 I\'m DonateMatch Assistant. I can help you find charities, answer questions about donations, taxes, and more. What would you like to know?',
        type: 'greeting',
        quickReplies: ['Find a charity', 'How to donate', 'Tax benefits', 'Track my donations']
      };

    case 'help':
      return {
        text: 'I can help you with:\n• Finding charities to support\n• Understanding donation process\n• Tax benefits and 80G certificates\n• Payment methods\n• Tracking your donations\n• Setting up recurring donations\n\nWhat would you like to know more about?',
        type: 'help',
        quickReplies: ['Find charities', 'Tax benefits', 'Payment methods', 'Track donations']
      };

    case 'find_charity':
      const trendingCharities = await Charity.find({ isActive: true })
        .sort({ totalDonations: -1 })
        .select('name category verificationBadge')
        .limit(3);
      
      return {
        text: 'Here are some popular charities you can support:',
        type: 'charity_list',
        data: trendingCharities,
        quickReplies: ['Education charities', 'Healthcare charities', 'Environment charities', 'View all']
      };

    case 'find_campaign':
      const activeCampaigns = await Campaign.find({ 
        status: 'active',
        endDate: { $gte: new Date() }
      })
      .populate('charity', 'name')
      .select('title goalAmount raisedAmount')
      .limit(3);
      
      return {
        text: 'Here are some active campaigns that need your support:',
        type: 'campaign_list',
        data: activeCampaigns,
        quickReplies: ['View all campaigns', 'How to donate', 'Tax benefits']
      };

    default:
      // Check FAQ knowledge base
      if (intent && FAQ[intent]) {
        const faq = FAQ[intent];
        return {
          text: faq.answer,
          type: 'faq',
          actions: faq.actions,
          quickReplies: getQuickReplies(intent)
        };
      }

      // Default fallback
      return {
        text: 'I understand you\'re asking about donations. Could you please rephrase your question? I can help with:\n• Finding charities\n• Donation process\n• Tax benefits\n• Payment methods\n• Tracking donations',
        type: 'fallback',
        quickReplies: ['How to donate', 'Find charities', 'Tax benefits', 'Contact support']
      };
  }
}

// Get quick replies based on context
function getQuickReplies(intent) {
  const contextReplies = {
    'how to donate': ['Find a charity', 'Payment methods', 'Set up recurring'],
    'tax benefits': ['Download 80G certificate', 'View tax report', 'Find 80G charities'],
    'payment methods': ['Donate now', 'About UPI', 'Is it secure?'],
    'refund': ['Contact support', 'Track donation', 'Report issue'],
    'recurring donation': ['Set up monthly', 'Manage subscriptions', 'Cancel recurring'],
    'track donation': ['View dashboard', 'Download receipt', 'Tax report'],
    'charity verification': ['How we verify', 'Report suspicious', 'View verified charities'],
    'corporate matching': ['Find programs', 'Add my company', 'How it works']
  };

  return contextReplies[intent] || ['More help', 'Find charities', 'Contact support'];
}

module.exports = router;
