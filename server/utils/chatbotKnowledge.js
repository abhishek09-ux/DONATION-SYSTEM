/**
 * DonateMatch AI Chatbot Knowledge Base
 * Comprehensive knowledge about the entire website
 */

// ============================================
// WEBSITE STRUCTURE & NAVIGATION
// ============================================
const WEBSITE_STRUCTURE = {
  pages: {
    home: {
      path: '/',
      description: 'Landing page with hero section, trending charities, recent donations, and impact stats',
      features: ['Search charities', 'View trending', 'Quick donate', 'Impact statistics']
    },
    charities: {
      path: '/charities',
      description: 'Browse all verified charities with filters by cause, location, and rating',
      features: ['Filter by cause', 'Search by name', 'Sort by rating', 'View charity details']
    },
    campaigns: {
      path: '/campaigns',
      description: 'View active crowdfunding campaigns with progress tracking',
      features: ['Filter by category', 'Sort by progress', 'View campaign details', 'Donate to campaigns']
    },
    login: {
      path: '/login',
      description: 'Sign in to your DonateMatch account',
      features: ['Email login', 'Password recovery', '2FA support']
    },
    register: {
      path: '/register',
      description: 'Create a new account as donor or charity',
      features: ['Donor registration', 'Charity registration', 'Email verification']
    },
    donorDashboard: {
      path: '/donor/dashboard',
      description: 'Donor dashboard with donation history, impact metrics, and recommendations',
      features: ['View donations', 'Track impact', 'Get recommendations', 'Download receipts']
    },
    charityDashboard: {
      path: '/charity/dashboard',
      description: 'Charity dashboard to manage profile, view donations, and create campaigns',
      features: ['Manage profile', 'View received donations', 'Create campaigns', 'Analytics']
    },
    adminDashboard: {
      path: '/admin/dashboard',
      description: 'Admin panel for platform management',
      features: ['User management', 'Charity verification', 'Platform analytics', 'Fraud detection']
    },
    taxReports: {
      path: '/donor/tax-reports',
      description: 'View and download 80G tax certificates',
      features: ['Download certificates', 'Yearly summary', 'Tax savings calculator']
    },
    forum: {
      path: '/forum',
      description: 'Community forum for discussions about charitable giving',
      features: ['Ask questions', 'Share experiences', 'Connect with others']
    },
    volunteer: {
      path: '/volunteer',
      description: 'Find volunteer opportunities with charities',
      features: ['Browse opportunities', 'Apply to volunteer', 'Track hours']
    }
  }
};

// ============================================
// FEATURES & HOW-TO GUIDES
// ============================================
const FEATURES = {
  donation: {
    title: 'Making a Donation',
    steps: [
      '1. Browse charities or campaigns on the homepage or Charities page',
      '2. Click "Donate Now" on any charity or campaign',
      '3. Enter the donation amount (minimum ₹10)',
      '4. Choose payment method: UPI, Card, Net Banking, or Wallet',
      '5. Complete payment through Razorpay secure checkout',
      '6. Receive instant confirmation and receipt via email'
    ],
    tips: [
      'Look for the verified badge for trusted charities',
      'Check the 80G status for tax benefits',
      'You can donate anonymously if preferred'
    ]
  },
  
  recurringDonation: {
    title: 'Setting Up Monthly Donations',
    steps: [
      '1. Go to any charity page',
      '2. Click "Donate Now"',
      '3. Toggle "Make this a monthly donation"',
      '4. Set up auto-debit through Razorpay',
      '5. Manage subscriptions from your dashboard'
    ],
    tips: [
      'You can cancel anytime from your dashboard',
      'Monthly donations help charities plan better',
      'You\'ll receive monthly impact updates'
    ]
  },
  
  taxBenefits: {
    title: '80G Tax Benefits',
    info: [
      'Donations to 80G registered charities are tax deductible',
      'You can claim 50% or 100% deduction based on charity type',
      'Maximum deduction is 10% of your gross total income',
      'Keep your 80G certificate for ITR filing'
    ],
    howToClaim: [
      '1. Make donation to 80G registered charity',
      '2. Download 80G certificate from Tax Reports section',
      '3. Enter details in Section 80G while filing ITR',
      '4. Keep certificate for 7 years for verification'
    ]
  },
  
  giftCards: {
    title: 'Donation Gift Cards',
    description: 'Give the gift of giving! Purchase gift cards that recipients can use to donate to charities of their choice.',
    steps: [
      '1. Go to Gift Cards section in your dashboard',
      '2. Select gift card amount',
      '3. Enter recipient email',
      '4. Add a personal message',
      '5. Complete payment',
      '6. Recipient receives card via email'
    ]
  },
  
  referrals: {
    title: 'Referral Program',
    description: 'Earn rewards by inviting friends to donate!',
    rewards: [
      'Get ₹50 credit for each friend who makes their first donation',
      'Your friend also gets ₹50 bonus on their first donation',
      'No limit on referrals - keep earning!'
    ],
    howTo: [
      '1. Go to your Dashboard',
      '2. Find your unique referral link',
      '3. Share with friends and family',
      '4. Track referrals and earnings'
    ]
  },
  
  corporateDonations: {
    title: 'Corporate Giving',
    description: 'Companies can set up CSR programs, employee matching, and bulk donations.',
    features: [
      'CSR dashboard for companies',
      'Employee donation matching',
      'Team giving campaigns',
      'CSR compliance reports',
      'Bulk donation processing'
    ]
  },
  
  volunteerProgram: {
    title: 'Volunteering',
    description: 'Donate your time and skills to charities.',
    steps: [
      '1. Go to Volunteer section',
      '2. Browse opportunities by cause and location',
      '3. Apply to volunteer positions',
      '4. Coordinate directly with charities',
      '5. Log volunteer hours'
    ]
  },
  
  twoFactorAuth: {
    title: 'Two-Factor Authentication',
    description: 'Extra security for your account using authenticator app.',
    steps: [
      '1. Go to Profile > Security Settings',
      '2. Click "Enable 2FA"',
      '3. Scan QR code with Google Authenticator or similar app',
      '4. Enter the 6-digit code to verify',
      '5. Save backup codes securely'
    ]
  },
  
  darkMode: {
    title: 'Dark Mode',
    description: 'Switch between light and dark themes.',
    howTo: 'Click the moon/sun icon in the top navigation bar to toggle dark mode. Your preference is saved automatically.'
  },
  
  languageSwitcher: {
    title: 'Language Settings',
    description: 'DonateMatch supports multiple Indian languages.',
    languages: ['English', 'Hindi (हिन्दी)', 'Tamil (தமிழ்)', 'Bengali (বাংলা)', 'Telugu (తెలుగు)', 'Marathi (मराठी)', 'Gujarati (ગુજરાતી)', 'Kannada (ಕನ್ನಡ)', 'Malayalam (മലയാളം)', 'Punjabi (ਪੰਜਾਬੀ)', 'Odia (ଓଡ଼ିଆ)', 'Assamese (অসমীয়া)'],
    howTo: 'Click the language icon (🌐) in the navigation bar to switch languages.'
  },
  
  accessibility: {
    title: 'Accessibility Features',
    features: [
      'Screen reader support',
      'Keyboard navigation',
      'High contrast mode',
      'Font size adjustment',
      'Reduced motion option'
    ],
    howTo: 'Click the accessibility icon in the navigation to open settings panel.'
  },
  
  impactTracking: {
    title: 'Impact Tracking',
    description: 'See how your donations make a difference.',
    metrics: [
      'Total amount donated',
      'Number of charities supported',
      'Estimated lives impacted',
      'Meals provided / Children educated / Trees planted etc.',
      'Comparison with community'
    ]
  }
};

// ============================================
// FREQUENTLY ASKED QUESTIONS
// ============================================
const FAQ = {
  // Donation Related
  'how to donate': {
    answer: 'To donate:\n1. Browse charities on our Charities page\n2. Click "Donate Now" on your chosen charity\n3. Enter amount and complete payment via UPI, Card, or Net Banking\n4. Get instant receipt via email!\n\nMinimum donation is just ₹10.',
    quickReplies: ['Show charities', 'Payment methods', 'Tax benefits']
  },
  
  'minimum donation': {
    answer: 'The minimum donation amount is ₹10. There\'s no maximum limit! Every contribution, big or small, makes a difference.',
    quickReplies: ['How to donate', 'Payment methods']
  },
  
  'anonymous donation': {
    answer: 'Yes! You can donate anonymously. While making a donation, check the "Donate Anonymously" option. Your name won\'t be visible to the charity or other donors, but you\'ll still receive your tax receipt.',
    quickReplies: ['How to donate', 'Tax benefits']
  },
  
  'cancel donation': {
    answer: 'Once a donation is completed, it cannot be cancelled as funds are transferred immediately to charities. For recurring donations, you can cancel future payments from your Dashboard > Recurring Donations section.',
    quickReplies: ['Recurring donations', 'Contact support']
  },
  
  'failed payment': {
    answer: 'If your payment failed:\n1. Check your bank/UPI app for any deduction\n2. If debited, the amount will be auto-refunded in 5-7 business days\n3. Try again with a different payment method\n4. Contact support if the issue persists',
    quickReplies: ['Payment methods', 'Contact support']
  },
  
  // Tax Related
  'tax benefits': {
    answer: '📋 Tax Benefits under Section 80G:\n\n• Donations to 80G registered charities are tax deductible\n• Get 50% or 100% deduction depending on charity type\n• Maximum limit: 10% of gross total income\n• Download 80G certificate from your Tax Reports section\n\nLook for the "80G Certified" badge on charity profiles!',
    quickReplies: ['Download certificate', 'Find 80G charities']
  },
  
  'download certificate': {
    answer: 'To download your 80G tax certificate:\n1. Log in to your account\n2. Go to Dashboard > Tax Reports\n3. Select the financial year\n4. Click "Download 80G Certificate"\n\nCertificates are generated automatically for eligible donations.',
    quickReplies: ['Tax benefits', 'Go to dashboard']
  },
  
  // Payment Related
  'payment methods': {
    answer: '💳 We accept multiple payment methods:\n\n• UPI (GPay, PhonePe, Paytm, BHIM)\n• Credit/Debit Cards (Visa, Mastercard, RuPay)\n• Net Banking (All major banks)\n• Wallets (Paytm, Mobikwik, etc.)\n\nAll payments are secured by Razorpay with 256-bit encryption.',
    quickReplies: ['How to donate', 'Is it safe?']
  },
  
  'payment safe': {
    answer: '🔒 Yes, 100% safe!\n\n• Payments processed by Razorpay (RBI licensed)\n• 256-bit SSL encryption\n• PCI DSS compliant\n• We never store your card details\n• 2FA enabled for extra security',
    quickReplies: ['Payment methods', 'Enable 2FA']
  },
  
  'refund': {
    answer: 'Donations are generally non-refundable as they directly benefit charities. However:\n\n• Failed transaction auto-refunds in 5-7 days\n• Duplicate payments will be refunded\n• Contact support for special cases\n\nFor recurring donations, you can cancel future payments anytime.',
    quickReplies: ['Cancel recurring', 'Contact support']
  },
  
  // Account Related
  'create account': {
    answer: 'Creating an account is easy:\n1. Click "Register" in the top menu\n2. Choose "Donor" or "Charity"\n3. Enter your email and create password\n4. Verify your email\n5. Complete your profile\n\nYou can also donate as a guest, but an account gives you donation history and tax reports!',
    quickReplies: ['Benefits of account', 'Login help']
  },
  
  'login help': {
    answer: 'To log in:\n1. Click "Login" in navigation\n2. Enter your registered email\n3. Enter your password\n4. If 2FA enabled, enter the code\n\nForgot password? Click "Forgot Password" to reset via email.',
    quickReplies: ['Reset password', 'Enable 2FA']
  },
  
  'reset password': {
    answer: 'To reset your password:\n1. Go to Login page\n2. Click "Forgot Password?"\n3. Enter your registered email\n4. Check email for reset link\n5. Create new password\n\nLink expires in 1 hour. Check spam folder if not received.',
    quickReplies: ['Login help', 'Contact support']
  },
  
  'delete account': {
    answer: 'To delete your account:\n1. Go to Profile > Settings\n2. Scroll to "Delete Account"\n3. Confirm deletion\n\nNote: This will remove your profile but donation records are retained for charity reporting and tax purposes.',
    quickReplies: ['Contact support', 'Update profile']
  },
  
  // Charity Related
  'find charity': {
    answer: 'To find charities:\n1. Go to Charities page from the menu\n2. Use filters: Cause (Education, Health, etc.), Location, Rating\n3. Search by name or keyword\n4. Look for Verified ✓ and 80G badges\n5. Click on charity to see details\n\nOr ask me for recommendations based on your interests!',
    quickReplies: ['Education charities', 'Health charities', 'Nearby charities']
  },
  
  'verified charity': {
    answer: '✓ Verified Charities mean:\n\n• Legal registration verified (NGO Darpan, etc.)\n• 80G status confirmed\n• Bank details validated\n• Organization physically verified\n• Annual reports reviewed\n\nAlways look for the blue Verified badge!',
    quickReplies: ['Find verified charities', 'How to verify']
  },
  
  'register charity': {
    answer: 'To register your charity:\n1. Click Register > "Register Charity"\n2. Fill organization details\n3. Upload documents (Registration cert, 80G, PAN)\n4. Wait for verification (2-5 business days)\n5. Once approved, set up your profile\n\nRequired documents: Registration certificate, 80G certificate (if applicable), PAN card, Bank details',
    quickReplies: ['Verification process', 'Contact support']
  },
  
  // Campaign Related
  'what is campaign': {
    answer: '🎯 Campaigns are time-bound fundraising goals!\n\n• Created by charities for specific projects\n• Have target amount and deadline\n• Show live progress\n• Updates from the charity\n• May offer matching from sponsors\n\nCampaigns help fund specific causes like building schools, medical camps, disaster relief, etc.',
    quickReplies: ['View campaigns', 'Donate to campaign']
  },
  
  'create campaign': {
    answer: 'Charities can create campaigns:\n1. Log in to Charity Dashboard\n2. Go to Campaigns > Create New\n3. Add title, description, goal amount\n4. Set start and end dates\n5. Upload cover image\n6. Publish campaign\n\nTips: Add compelling story, set realistic goals, post regular updates!',
    quickReplies: ['Campaign tips', 'View campaigns']
  },
  
  // Features
  'gift card': {
    answer: '🎁 Donation Gift Cards!\n\nGive the gift of giving:\n1. Go to Dashboard > Gift Cards\n2. Choose amount (₹500, ₹1000, ₹2000, custom)\n3. Enter recipient email\n4. Add personal message\n5. Pay and send!\n\nRecipient can donate to any charity they choose. Valid for 1 year!',
    quickReplies: ['Buy gift card', 'How to donate']
  },
  
  'recurring donation': {
    answer: '🔄 Monthly Donations:\n\nSet up recurring donations for sustained impact:\n1. Click "Donate" on any charity\n2. Toggle "Make this monthly"\n3. Complete payment setup\n4. Automatic monthly deduction\n\nManage or cancel anytime from Dashboard > Recurring Donations.',
    quickReplies: ['Set up monthly', 'Cancel recurring']
  },
  
  'referral': {
    answer: '👥 Referral Program:\n\nEarn while you spread kindness!\n• Get ₹50 for each friend who donates\n• Your friend gets ₹50 bonus too!\n• No limit on referrals\n\nFind your referral link: Dashboard > Referrals',
    quickReplies: ['Get referral link', 'How to donate']
  },
  
  'volunteer': {
    answer: '🙋 Volunteer Program:\n\nDonate your time and skills:\n1. Go to Volunteer section\n2. Browse opportunities by cause/location\n3. Apply to positions\n4. Coordinate with charities\n5. Log volunteer hours\n\nVolunteering looks great on your impact profile!',
    quickReplies: ['Find opportunities', 'How it works']
  },
  
  'corporate': {
    answer: '🏢 Corporate Giving:\n\nFor companies and CSR:\n• CSR dashboard with compliance reports\n• Employee donation matching\n• Payroll giving setup\n• Team giving campaigns\n• Bulk donation processing\n\nContact us for enterprise plans!',
    quickReplies: ['CSR inquiry', 'Contact support']
  },
  
  // Technical/Settings
  'dark mode': {
    answer: '🌙 Dark Mode:\n\nTo toggle dark mode, click the moon/sun icon in the top navigation bar. Your preference is automatically saved!',
    quickReplies: ['Other settings', 'Accessibility']
  },
  
  'change language': {
    answer: '🌐 Language Settings:\n\nWe support multiple Indian languages!\n1. Click the globe icon (🌐) in navigation\n2. Select your preferred language\n3. The entire website will switch\n\nAvailable: English, Hindi, Tamil, Bengali, Telugu, Marathi, and more!',
    quickReplies: ['Other settings', 'Accessibility']
  },
  
  '2fa': {
    answer: '🔐 Two-Factor Authentication:\n\nAdd extra security to your account:\n1. Go to Profile > Security\n2. Click "Enable 2FA"\n3. Scan QR code with Google Authenticator\n4. Enter 6-digit code to verify\n5. Save backup codes!\n\nYou\'ll need the code to log in.',
    quickReplies: ['Security tips', 'Login help']
  },
  
  'notifications': {
    answer: '🔔 Notification Settings:\n\n1. Go to Profile > Notifications\n2. Choose what you want to receive:\n   • Donation receipts (Email)\n   • Campaign updates\n   • Impact reports\n   • Newsletter\n3. Save preferences',
    quickReplies: ['Update profile', 'Contact support']
  },
  
  // Support
  'contact support': {
    answer: '📞 Contact Support:\n\n• Email: support@donatematch.in\n• Phone: 1800-XXX-XXXX (9 AM - 6 PM)\n• Chat: Use this chatbot!\n• Response time: Within 24 hours\n\nFor urgent payment issues, please call us directly.',
    quickReplies: ['FAQ', 'How to donate']
  },
  
  'report issue': {
    answer: '🚨 Report an Issue:\n\n1. Go to Help > Report Issue\n2. Select issue type\n3. Describe the problem\n4. Attach screenshots if possible\n5. Submit\n\nOr email: support@donatematch.in with "ISSUE:" in subject.',
    quickReplies: ['Contact support', 'FAQ']
  },
  
  // About
  'about donatematch': {
    answer: '🤝 About DonateMatch:\n\nDonateMatch is India\'s smartest donation platform!\n\n✨ AI-powered charity matching\n✓ 100% verified charities\n📊 Real-time impact tracking\n🧾 Instant 80G certificates\n🔒 Secure payments via Razorpay\n🌐 Multi-language support\n\nOur mission: Make giving simple, transparent, and impactful!',
    quickReplies: ['How it works', 'Why choose us']
  },
  
  'how it works': {
    answer: '⚙️ How DonateMatch Works:\n\n1️⃣ DISCOVER\nAI matches you with charities based on your interests\n\n2️⃣ DONATE\nSecure payment via UPI, Card, Net Banking\n\n3️⃣ TRACK\nSee exactly how your donation helps\n\n4️⃣ TAX BENEFITS\nAutomatic 80G certificates\n\nStart your giving journey today! 💝',
    quickReplies: ['Find charity', 'Tax benefits']
  },
  
  'why choose us': {
    answer: '✨ Why DonateMatch?\n\n• ✓ All charities verified\n• 🤖 AI-powered matching\n• 📊 Transparent impact tracking\n• 💰 100% to charity (no platform fees)\n• 🧾 Instant tax receipts\n• 🔒 Bank-level security\n• 🌐 12+ Indian languages\n• 📱 Works on all devices\n• 💬 24/7 support',
    quickReplies: ['Start donating', 'Find charity']
  }
};

// ============================================
// DYNAMIC RESPONSES
// ============================================
const CAUSE_RESPONSES = {
  education: {
    emojis: '📚🎓',
    description: 'Support education initiatives like school building, scholarships, digital learning, and teacher training.',
    impactExample: '₹500 can provide books for a child for a year!'
  },
  health: {
    emojis: '🏥💊',
    description: 'Fund healthcare programs including medical camps, medicine distribution, hospital support, and health awareness.',
    impactExample: '₹1000 can provide medicines to a family for a month!'
  },
  environment: {
    emojis: '🌳🌍',
    description: 'Support environmental causes like tree plantation, wildlife conservation, clean water, and sustainability projects.',
    impactExample: '₹100 can plant 5 trees!'
  },
  poverty: {
    emojis: '🍚🏠',
    description: 'Help alleviate poverty through food distribution, shelter, livelihood training, and economic empowerment.',
    impactExample: '₹50 can provide a meal to 10 people!'
  },
  animals: {
    emojis: '🐕🐄',
    description: 'Support animal welfare including rescue, shelter, medical care, and adoption programs.',
    impactExample: '₹200 can feed a shelter animal for a month!'
  },
  disaster: {
    emojis: '🆘🏠',
    description: 'Provide disaster relief through emergency supplies, shelter, medical aid, and rehabilitation.',
    impactExample: '₹300 can provide an emergency kit to a family!'
  },
  women: {
    emojis: '👩💪',
    description: 'Empower women through education, skill training, self-defense, and economic independence programs.',
    impactExample: '₹1000 can fund a week of skill training!'
  },
  children: {
    emojis: '👶🧒',
    description: 'Support child welfare including orphan care, nutrition, education, and child rights protection.',
    impactExample: '₹500 can provide nutrition to a child for a month!'
  },
  elderly: {
    emojis: '👴👵',
    description: 'Care for senior citizens through old age homes, healthcare, companionship, and dignity programs.',
    impactExample: '₹300 can provide meals to an elderly person for a week!'
  },
  disability: {
    emojis: '♿🦮',
    description: 'Support people with disabilities through assistive devices, education, therapy, and inclusion programs.',
    impactExample: '₹2000 can provide learning aids for a special child!'
  }
};

// ============================================
// SMART INTENT PATTERNS
// ============================================
const INTENT_PATTERNS = [
  // Greetings
  { patterns: ['hello', 'hi', 'hey', 'hola', 'namaste', 'namaskar', 'good morning', 'good afternoon', 'good evening', 'howdy', 'hii', 'hiii', 'yo', 'sup'], intent: 'greeting' },
  { patterns: ['how are you', 'how r u', 'how\'s it going', 'whats up', 'what\'s up', 'wassup'], intent: 'greeting_how' },
  { patterns: ['thanks', 'thank you', 'thank u', 'thx', 'ty', 'dhanyavad', 'shukriya'], intent: 'thanks' },
  { patterns: ['bye', 'goodbye', 'see you', 'take care', 'later', 'alvida'], intent: 'bye' },
  
  // Donation
  { patterns: ['donate', 'donation', 'give', 'contribute', 'help', 'support', 'fund'], intent: 'how_to_donate' },
  { patterns: ['minimum amount', 'minimum donation', 'how much', 'least amount', 'lowest donation'], intent: 'minimum_donation' },
  { patterns: ['anonymous', 'hide name', 'hide my name', 'secret donation', 'private donation'], intent: 'anonymous_donation' },
  { patterns: ['cancel', 'stop', 'cancel donation'], intent: 'cancel_donation' },
  { patterns: ['failed', 'fail', 'error', 'not working', 'payment failed', 'transaction failed'], intent: 'failed_payment' },
  { patterns: ['recurring', 'monthly', 'subscription', 'regular', 'auto pay', 'autopay'], intent: 'recurring_donation' },
  
  // Tax
  { patterns: ['tax', '80g', 'deduction', 'exemption', 'tax benefit', 'tax saving', 'income tax'], intent: 'tax_benefits' },
  { patterns: ['certificate', 'download certificate', '80g certificate', 'receipt', 'download receipt'], intent: 'download_certificate' },
  
  // Payment
  { patterns: ['payment', 'pay', 'upi', 'card', 'credit card', 'debit card', 'net banking', 'gpay', 'phonepe', 'paytm', 'wallet'], intent: 'payment_methods' },
  { patterns: ['safe', 'secure', 'security', 'trust', 'fraud', 'scam', 'is it safe'], intent: 'payment_safe' },
  { patterns: ['refund', 'money back', 'return', 'chargeback'], intent: 'refund' },
  
  // Account
  { patterns: ['register', 'sign up', 'signup', 'create account', 'new account', 'join'], intent: 'create_account' },
  { patterns: ['login', 'log in', 'sign in', 'signin', 'access account', 'can\'t login', 'cant login'], intent: 'login_help' },
  { patterns: ['forgot password', 'reset password', 'change password', 'lost password'], intent: 'reset_password' },
  { patterns: ['delete account', 'remove account', 'close account', 'deactivate'], intent: 'delete_account' },
  { patterns: ['profile', 'update profile', 'edit profile', 'change email', 'change phone'], intent: 'update_profile' },
  
  // Charity
  { patterns: ['find charity', 'search charity', 'which charity', 'best charity', 'good charity', 'recommend charity', 'show charity', 'charities'], intent: 'find_charity' },
  { patterns: ['verified', 'verification', 'trust', 'legitimate', 'real', 'authentic'], intent: 'verified_charity' },
  { patterns: ['register charity', 'add charity', 'add my ngo', 'register ngo', 'become charity'], intent: 'register_charity' },
  
  // Campaigns
  { patterns: ['campaign', 'campaigns', 'fundraiser', 'fundraising', 'crowdfunding'], intent: 'what_is_campaign' },
  { patterns: ['create campaign', 'start campaign', 'new campaign', 'make campaign'], intent: 'create_campaign' },
  
  // Features
  { patterns: ['gift card', 'gift', 'present', 'voucher'], intent: 'gift_card' },
  { patterns: ['referral', 'refer', 'invite', 'share with friend', 'tell friend'], intent: 'referral' },
  { patterns: ['volunteer', 'volunteering', 'volunteer work', 'seva'], intent: 'volunteer' },
  { patterns: ['corporate', 'csr', 'company', 'employer', 'office', 'business'], intent: 'corporate' },
  
  // Settings
  { patterns: ['dark mode', 'night mode', 'dark theme', 'light mode'], intent: 'dark_mode' },
  { patterns: ['language', 'hindi', 'tamil', 'bengali', 'telugu', 'marathi', 'gujarati', 'change language', 'bhasha'], intent: 'change_language' },
  { patterns: ['2fa', 'two factor', 'otp', 'authenticator', 'extra security'], intent: '2fa' },
  { patterns: ['notification', 'alert', 'email notification', 'updates'], intent: 'notifications' },
  { patterns: ['accessibility', 'screen reader', 'visually impaired', 'font size'], intent: 'accessibility' },
  
  // Support
  { patterns: ['contact', 'support', 'help', 'customer service', 'call', 'phone', 'email support'], intent: 'contact_support' },
  { patterns: ['report', 'complain', 'complaint', 'issue', 'problem', 'bug'], intent: 'report_issue' },
  
  // About
  { patterns: ['about', 'what is donatematch', 'tell me about', 'who are you', 'what do you do'], intent: 'about_donatematch' },
  { patterns: ['how does it work', 'how it works', 'explain', 'process'], intent: 'how_it_works' },
  { patterns: ['why donatematch', 'why choose', 'why should i', 'benefits', 'advantage'], intent: 'why_choose_us' },
  
  // Causes (for dynamic charity recommendations)
  { patterns: ['education', 'school', 'college', 'student', 'books', 'learning', 'scholarship'], intent: 'cause_education' },
  { patterns: ['health', 'medical', 'hospital', 'medicine', 'doctor', 'patient', 'treatment', 'healthcare'], intent: 'cause_health' },
  { patterns: ['environment', 'tree', 'plant', 'nature', 'climate', 'pollution', 'wildlife', 'forest'], intent: 'cause_environment' },
  { patterns: ['poverty', 'poor', 'hunger', 'food', 'meal', 'shelter', 'homeless', 'slum'], intent: 'cause_poverty' },
  { patterns: ['animal', 'dog', 'cat', 'cow', 'pet', 'rescue', 'shelter animal', 'stray'], intent: 'cause_animals' },
  { patterns: ['disaster', 'flood', 'earthquake', 'cyclone', 'tsunami', 'relief', 'emergency'], intent: 'cause_disaster' },
  { patterns: ['women', 'girl', 'female', 'empowerment', 'mahila', 'nari'], intent: 'cause_women' },
  { patterns: ['child', 'children', 'kids', 'orphan', 'bachche', 'baby'], intent: 'cause_children' },
  { patterns: ['elderly', 'old age', 'senior citizen', 'aged', 'bujurg'], intent: 'cause_elderly' },
  { patterns: ['disability', 'disabled', 'handicap', 'special needs', 'divyang'], intent: 'cause_disability' },
  
  // Navigation
  { patterns: ['home', 'main page', 'homepage', 'start'], intent: 'nav_home' },
  { patterns: ['dashboard', 'my account', 'my donations', 'my profile'], intent: 'nav_dashboard' },
  { patterns: ['settings', 'options', 'preferences', 'configure'], intent: 'nav_settings' }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Find intent from user message
 */
const findIntent = (message) => {
  const lowerMessage = message.toLowerCase().trim();
  
  for (const { patterns, intent } of INTENT_PATTERNS) {
    for (const pattern of patterns) {
      if (lowerMessage.includes(pattern)) {
        return intent;
      }
    }
  }
  
  return null;
};

/**
 * Get FAQ response
 */
const getFAQResponse = (intent) => {
  // Map intent to FAQ key
  const faqKeyMap = {
    'how_to_donate': 'how to donate',
    'minimum_donation': 'minimum donation',
    'anonymous_donation': 'anonymous donation',
    'cancel_donation': 'cancel donation',
    'failed_payment': 'failed payment',
    'recurring_donation': 'recurring donation',
    'tax_benefits': 'tax benefits',
    'download_certificate': 'download certificate',
    'payment_methods': 'payment methods',
    'payment_safe': 'payment safe',
    'refund': 'refund',
    'create_account': 'create account',
    'login_help': 'login help',
    'reset_password': 'reset password',
    'delete_account': 'delete account',
    'find_charity': 'find charity',
    'verified_charity': 'verified charity',
    'register_charity': 'register charity',
    'what_is_campaign': 'what is campaign',
    'create_campaign': 'create campaign',
    'gift_card': 'gift card',
    'referral': 'referral',
    'volunteer': 'volunteer',
    'corporate': 'corporate',
    'dark_mode': 'dark mode',
    'change_language': 'change language',
    '2fa': '2fa',
    'notifications': 'notifications',
    'contact_support': 'contact support',
    'report_issue': 'report issue',
    'about_donatematch': 'about donatematch',
    'how_it_works': 'how it works',
    'why_choose_us': 'why choose us'
  };
  
  const faqKey = faqKeyMap[intent];
  return faqKey ? FAQ[faqKey] : null;
};

/**
 * Get cause info
 */
const getCauseInfo = (cause) => {
  return CAUSE_RESPONSES[cause] || null;
};

/**
 * Get page info
 */
const getPageInfo = (page) => {
  return WEBSITE_STRUCTURE.pages[page] || null;
};

/**
 * Get feature info
 */
const getFeatureInfo = (feature) => {
  return FEATURES[feature] || null;
};

module.exports = {
  WEBSITE_STRUCTURE,
  FEATURES,
  FAQ,
  CAUSE_RESPONSES,
  INTENT_PATTERNS,
  findIntent,
  getFAQResponse,
  getCauseInfo,
  getPageInfo,
  getFeatureInfo
};
