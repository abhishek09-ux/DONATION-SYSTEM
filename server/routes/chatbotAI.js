/**
 * DonateMatch Smart AI Chatbot
 * Intelligent chatbot with comprehensive website knowledge
 */

const express = require('express');
const router = express.Router();
const Charity = require('../models/Charity');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');
const {
  findIntent,
  getFAQResponse,
  getCauseInfo,
  CAUSE_RESPONSES,
  FAQ
} = require('../utils/chatbotKnowledge');

// ============================================
// GREETING RESPONSES
// ============================================
const GREETINGS = [
  "Hello! 👋 I'm DonateMatch Assistant! I know everything about our platform. How can I help you today?",
  "Hi there! 👋 Welcome to DonateMatch! I can help you find charities, donate, understand tax benefits, and much more. What would you like to know?",
  "Namaste! 🙏 I'm your DonateMatch guide. Ask me anything about donations, charities, campaigns, or how to use the platform!",
  "Hey! 😊 I'm here to help you make a difference. What would you like to explore - charities, campaigns, or maybe tax benefits?"
];

const HOW_ARE_YOU_RESPONSES = [
  "I'm doing great, thank you! 😊 Ready to help you find amazing charities. What brings you here today?",
  "I'm wonderful! Always excited to help connect donors with causes they care about. How can I assist you?",
  "Feeling great and ready to help! 💪 Looking to donate or learn about our platform?"
];

const THANKS_RESPONSES = [
  "You're welcome! 😊 Happy to help. Is there anything else you'd like to know?",
  "My pleasure! 🙏 Thank you for using DonateMatch. Anything else I can help with?",
  "Glad I could help! 💝 Feel free to ask if you have more questions!"
];

const BYE_RESPONSES = [
  "Goodbye! 👋 Thank you for visiting DonateMatch. Every donation makes a difference! 💝",
  "Take care! 🙏 Remember, even small donations create big impact. See you soon!",
  "Bye! 😊 Keep spreading kindness. Have a wonderful day!"
];

// ============================================
// MAIN CHAT ENDPOINT
// ============================================
router.post('/message', async (req, res) => {
  try {
    const { message, userId, context } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ 
        text: 'Please type a message.',
        type: 'error'
      });
    }

    const userMessage = message.trim();
    const intent = findIntent(userMessage);
    
    let response = await generateResponse(intent, userMessage, userId, context);
    
    res.json(response);
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ 
      text: "I'm having a small technical hiccup 😅 Please try again in a moment.",
      type: 'error',
      quickReplies: ['How to donate', 'Find charities', 'Contact support']
    });
  }
});

// ============================================
// SUGGESTIONS ENDPOINT
// ============================================
router.get('/suggestions', async (req, res) => {
  try {
    const suggestions = [
      '💝 How do I donate?',
      '🔍 Find charities near me',
      '📊 Best charities for education',
      '🧾 Tax benefits explained',
      '🔄 Set up monthly donation',
      '📱 How to use this website',
      '🎁 Gift card for someone',
      '✅ Are charities verified?',
      '🌐 Change language',
      '❓ What is DonateMatch?'
    ];

    // Randomize and pick 6
    const shuffled = suggestions.sort(() => 0.5 - Math.random());
    
    res.json({ suggestions: shuffled.slice(0, 6) });
  } catch (error) {
    res.status(500).json({ message: 'Error getting suggestions' });
  }
});

// ============================================
// SEARCH ENDPOINTS
// ============================================
router.get('/search/charities', async (req, res) => {
  try {
    const { query, cause, location, limit = 5 } = req.query;
    
    const searchQuery = { verificationStatus: 'verified' };
    
    if (query) {
      searchQuery.$or = [
        { organizationName: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { causes: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (cause) {
      searchQuery.causes = { $in: [cause] };
    }
    
    if (location) {
      searchQuery.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.state': { $regex: location, $options: 'i' } }
      ];
    }

    const charities = await Charity.find(searchQuery)
      .select('organizationName description causes verificationStatus is80GRegistered rating location')
      .sort({ 'rating.average': -1 })
      .limit(parseInt(limit));

    res.json({ charities });
  } catch (error) {
    res.status(500).json({ message: 'Error searching charities' });
  }
});

router.get('/search/campaigns', async (req, res) => {
  try {
    const { query, category, limit = 5 } = req.query;
    
    const searchQuery = { 
      status: 'active',
      endDate: { $gte: new Date() }
    };
    
    if (query) {
      searchQuery.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (category) {
      searchQuery.category = category;
    }

    const campaigns = await Campaign.find(searchQuery)
      .populate('charity', 'organizationName')
      .select('title description goalAmount raisedAmount category endDate')
      .sort({ featured: -1, raisedAmount: -1 })
      .limit(parseInt(limit));

    res.json({ campaigns });
  } catch (error) {
    res.status(500).json({ message: 'Error searching campaigns' });
  }
});

// ============================================
// STATISTICS ENDPOINT
// ============================================
router.get('/stats', async (req, res) => {
  try {
    const [totalDonations, totalCharities, activeCampaigns] = await Promise.all([
      Donation.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]),
      Charity.countDocuments({ verificationStatus: 'verified' }),
      Campaign.countDocuments({ status: 'active', endDate: { $gte: new Date() } })
    ]);

    res.json({
      totalAmount: totalDonations[0]?.total || 0,
      donationCount: totalDonations[0]?.count || 0,
      charityCount: totalCharities,
      activeCampaigns
    });
  } catch (error) {
    res.status(500).json({ message: 'Error getting stats' });
  }
});

// ============================================
// RESPONSE GENERATOR
// ============================================
async function generateResponse(intent, message, userId, context) {
  const quickRepliesDefault = ['How to donate', 'Find charities', 'Tax benefits', 'Contact support'];
  
  // Handle greetings
  if (intent === 'greeting') {
    return {
      text: getRandomResponse(GREETINGS),
      type: 'greeting',
      quickReplies: ['🔍 Find charities', '💝 How to donate', '📊 Tax benefits', '❓ About DonateMatch']
    };
  }
  
  if (intent === 'greeting_how') {
    return {
      text: getRandomResponse(HOW_ARE_YOU_RESPONSES),
      type: 'greeting',
      quickReplies: ['Find charities', 'How to donate', 'View campaigns']
    };
  }
  
  if (intent === 'thanks') {
    return {
      text: getRandomResponse(THANKS_RESPONSES),
      type: 'thanks',
      quickReplies: ['Find more charities', 'Tax benefits', 'Share with friends']
    };
  }
  
  if (intent === 'bye') {
    return {
      text: getRandomResponse(BYE_RESPONSES),
      type: 'bye',
      quickReplies: ['Start new chat']
    };
  }
  
  // Handle FAQ intents
  const faqResponse = getFAQResponse(intent);
  if (faqResponse) {
    return {
      text: faqResponse.answer,
      type: 'faq',
      quickReplies: faqResponse.quickReplies || quickRepliesDefault
    };
  }
  
  // Handle cause-specific queries
  if (intent?.startsWith('cause_')) {
    const cause = intent.replace('cause_', '');
    return await handleCauseQuery(cause);
  }
  
  // Handle navigation queries
  if (intent?.startsWith('nav_')) {
    return handleNavigationQuery(intent);
  }
  
  // Handle dynamic queries that need database
  if (intent === 'find_charity') {
    return await handleFindCharity(message);
  }
  
  if (intent === 'what_is_campaign') {
    return await handleCampaignInfo();
  }
  
  // Handle update profile
  if (intent === 'update_profile') {
    return {
      text: '👤 To update your profile:\n\n1. Click on your profile icon (top right)\n2. Select "Profile" or "Settings"\n3. Edit your details:\n   • Name & Photo\n   • Email & Phone\n   • Location\n   • Preferred causes\n4. Click "Save Changes"\n\nYou can also update your notification preferences and privacy settings!',
      type: 'guide',
      quickReplies: ['Change password', 'Enable 2FA', 'Delete account']
    };
  }
  
  // Handle accessibility
  if (intent === 'accessibility') {
    return {
      text: '♿ Accessibility Features:\n\nDonateMatch is built for everyone!\n\n• Screen reader compatible\n• Keyboard navigation support\n• High contrast mode\n• Adjustable font sizes\n• Reduced motion option\n• Alt text on images\n\nTo access: Click the accessibility icon (♿) in navigation or press Alt+A.',
      type: 'feature',
      quickReplies: ['Dark mode', 'Change language', 'Other settings']
    };
  }
  
  // Fallback - Try to be helpful
  return await handleFallback(message);
}

// ============================================
// SPECIALIZED HANDLERS
// ============================================

async function handleCauseQuery(cause) {
  const causeInfo = getCauseInfo(cause);
  
  if (!causeInfo) {
    return {
      text: "I can help you find charities for various causes! What are you interested in?\n\n• Education 📚\n• Health 🏥\n• Environment 🌳\n• Poverty/Hunger 🍚\n• Animals 🐕\n• Women Empowerment 👩\n• Children 👶\n• Disaster Relief 🆘",
      type: 'cause_list',
      quickReplies: ['Education', 'Health', 'Environment', 'Animals']
    };
  }
  
  // Fetch related charities
  let charities = [];
  try {
    charities = await Charity.find({
      verificationStatus: 'verified',
      causes: { $in: [cause] }
    })
    .select('organizationName description rating is80GRegistered')
    .sort({ 'rating.average': -1 })
    .limit(3);
  } catch (e) {
    console.error('Error fetching charities:', e);
  }
  
  let responseText = `${causeInfo.emojis} **${cause.charAt(0).toUpperCase() + cause.slice(1)} Charities**\n\n${causeInfo.description}\n\n💡 Impact: ${causeInfo.impactExample}`;
  
  if (charities.length > 0) {
    responseText += '\n\n🌟 **Top Charities:**\n';
    charities.forEach((c, i) => {
      responseText += `${i + 1}. **${c.organizationName}** ${c.is80GRegistered ? '✓ 80G' : ''}\n`;
    });
    responseText += '\n👆 Click on charities page to see more!';
  }
  
  return {
    text: responseText,
    type: 'cause_info',
    data: { cause, charities },
    quickReplies: ['Donate now', 'View all charities', 'Tax benefits', 'Other causes']
  };
}

async function handleFindCharity(message) {
  // Try to extract location from message
  const states = ['delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad', 'pune', 'ahmedabad', 'jaipur', 'lucknow', 'maharashtra', 'karnataka', 'tamil nadu', 'uttar pradesh', 'gujarat', 'rajasthan', 'west bengal', 'kerala', 'telangana'];
  
  let location = null;
  const lowerMessage = message.toLowerCase();
  for (const state of states) {
    if (lowerMessage.includes(state)) {
      location = state;
      break;
    }
  }
  
  let charities = [];
  try {
    const query = { verificationStatus: 'verified' };
    
    if (location) {
      query.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.state': { $regex: location, $options: 'i' } }
      ];
    }
    
    charities = await Charity.find(query)
      .select('organizationName description causes rating is80GRegistered location')
      .sort({ 'rating.average': -1 })
      .limit(5);
  } catch (e) {
    console.error('Error fetching charities:', e);
  }
  
  if (charities.length === 0) {
    return {
      text: '🔍 **Finding Charities**\n\nI can help you discover amazing charities! Try:\n\n• "Education charities"\n• "Health charities in Mumbai"\n• "Environment NGOs"\n• "Best rated charities"\n\nOr visit our **Charities** page for filters and search!',
      type: 'find_charity',
      quickReplies: ['Education charities', 'Health charities', 'View all charities', 'How to donate']
    };
  }
  
  let responseText = location 
    ? `📍 **Charities ${location ? 'in ' + location.charAt(0).toUpperCase() + location.slice(1) : ''}:**\n\n`
    : '🌟 **Top Verified Charities:**\n\n';
  
  charities.forEach((c, i) => {
    const rating = c.rating?.average ? `⭐ ${c.rating.average.toFixed(1)}` : '';
    const badge = c.is80GRegistered ? '✓ 80G' : '';
    responseText += `${i + 1}. **${c.organizationName}** ${rating} ${badge}\n   ${c.causes?.slice(0, 2).join(', ') || 'Various causes'}\n\n`;
  });
  
  responseText += 'Click on **Charities** in the menu for more options!';
  
  return {
    text: responseText,
    type: 'charity_list',
    data: { charities, location },
    quickReplies: ['Donate to charity', 'Tax benefits', 'More charities', 'View campaigns']
  };
}

async function handleCampaignInfo() {
  let campaigns = [];
  try {
    campaigns = await Campaign.find({
      status: 'active',
      endDate: { $gte: new Date() }
    })
    .populate('charity', 'organizationName')
    .select('title goalAmount raisedAmount category')
    .sort({ featured: -1 })
    .limit(3);
  } catch (e) {
    console.error('Error fetching campaigns:', e);
  }
  
  let responseText = '🎯 **Campaigns** are time-bound fundraising goals!\n\n';
  responseText += 'Charities create campaigns for specific projects like:\n• Building schools 🏫\n• Medical camps 🩺\n• Disaster relief 🆘\n• Animal shelters 🐕\n\n';
  
  if (campaigns.length > 0) {
    responseText += '🔥 **Active Campaigns:**\n\n';
    campaigns.forEach((c, i) => {
      const progress = Math.round((c.raisedAmount / c.goalAmount) * 100);
      responseText += `${i + 1}. **${c.title}**\n   ${progress}% funded (₹${(c.raisedAmount/1000).toFixed(0)}K / ₹${(c.goalAmount/1000).toFixed(0)}K)\n\n`;
    });
  }
  
  responseText += 'Visit **Campaigns** page to support a cause! 💝';
  
  return {
    text: responseText,
    type: 'campaign_info',
    data: { campaigns },
    quickReplies: ['View all campaigns', 'Create campaign', 'How to donate', 'Find charities']
  };
}

function handleNavigationQuery(intent) {
  const pages = {
    'nav_home': {
      text: '🏠 **Home Page**\n\nOur homepage features:\n• Hero section with quick actions\n• Trending charities\n• Active campaigns\n• Recent donations\n• Platform statistics\n• Cause categories\n\nJust click the DonateMatch logo or "Home" in the menu!',
      path: '/'
    },
    'nav_dashboard': {
      text: '📊 **Your Dashboard**\n\nYour personal donation hub:\n• Total donations made\n• Charities supported\n• Tax savings (80G)\n• Impact metrics\n• Donation history\n• Recommendations\n\nGo to: Profile icon → Dashboard\n(Make sure you\'re logged in!)',
      path: '/donor/dashboard'
    },
    'nav_settings': {
      text: '⚙️ **Settings**\n\nCustomize your experience:\n• Profile details\n• Notification preferences\n• Privacy settings\n• Language (12+ options!)\n• Dark mode\n• 2FA security\n• Accessibility options\n\nGo to: Profile icon → Settings',
      path: '/settings'
    }
  };
  
  const page = pages[intent] || pages['nav_home'];
  
  return {
    text: page.text,
    type: 'navigation',
    data: { path: page.path },
    quickReplies: ['How to donate', 'Find charities', 'Tax benefits', 'Contact support']
  };
}

async function handleFallback(message) {
  // Check if it contains any recognizable keywords
  const keywords = message.toLowerCase().split(/\s+/);
  
  // Try to match partial intents
  const partialMatches = [];
  
  if (keywords.some(k => ['best', 'top', 'recommend', 'suggest', 'good'].includes(k))) {
    partialMatches.push('recommendations');
  }
  if (keywords.some(k => ['help', 'assist', 'guide'].includes(k))) {
    partialMatches.push('assistance');
  }
  if (keywords.some(k => ['work', 'use', 'navigate', 'find', 'where', 'how'].includes(k))) {
    partialMatches.push('navigation');
  }
  
  // Check if asking about specific amount
  const amountMatch = message.match(/₹?\d+[kK]?/);
  if (amountMatch) {
    const amount = amountMatch[0].toLowerCase().replace('₹', '').replace('k', '000');
    return {
      text: `💝 Want to donate ₹${parseInt(amount).toLocaleString()}?\n\nGreat choice! Here's how:\n1. Go to **Charities** page\n2. Select a charity you like\n3. Click "Donate Now"\n4. Enter your amount\n5. Complete payment!\n\nYou'll get a receipt and 80G certificate (if applicable) instantly! 🧾`,
      type: 'donation_help',
      quickReplies: ['Find charities', 'Tax benefits', 'Payment methods']
    };
  }
  
  // Default helpful response
  return {
    text: `🤔 I'm not sure I understood that fully, but I'm here to help!\n\nI can assist you with:\n\n🔍 **Find** - Charities, campaigns, causes\n💝 **Donate** - Process, payments, recurring\n🧾 **Tax** - 80G benefits, certificates\n👤 **Account** - Login, profile, settings\n🌐 **Website** - Navigation, features, languages\n📞 **Support** - Issues, contact, FAQ\n\nTry asking something like:\n• "How do I donate?"\n• "Find education charities"\n• "What are the tax benefits?"\n• "Change website language"`,
    type: 'fallback',
    quickReplies: ['How to donate', 'Find charities', 'Tax benefits', 'Contact support']
  };
}

// ============================================
// UTILITY FUNCTIONS  
// ============================================
function getRandomResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}

module.exports = router;
