import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Common
      common: {
        loading: 'Loading...',
        error: 'Something went wrong',
        retry: 'Retry',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        submit: 'Submit',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        viewAll: 'View All',
        learnMore: 'Learn More',
        seeMore: 'See More',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        close: 'Close',
        yes: 'Yes',
        no: 'No',
        or: 'or'
      },
      // Filter labels
      causes: 'Causes',
      state: 'State',
      city: 'City',
      allStates: 'All States',
      allCities: 'All Cities',
      applyFilters: 'Apply Filters',
      clearAll: 'Clear All',
      giftCards: 'Gift Cards',
      // Navigation
      nav: {
        home: 'Home',
        charities: 'Charities',
        about: 'About',
        login: 'Login',
        register: 'Register',
        dashboard: 'Dashboard',
        profile: 'Profile',
        donations: 'My Donations',
        logout: 'Logout',
        campaigns: 'Campaigns',
        forum: 'Community',
        volunteer: 'Volunteer'
      },
      // Home page
      home: {
        hero: {
          title: 'Make Every Donation Count',
          subtitle: 'AI-powered platform connecting donors with verified charities across India',
          cta: 'Start Donating',
          exploreCta: 'Explore Charities'
        },
        stats: {
          donated: 'Total Donated',
          donors: 'Happy Donors',
          charities: 'Verified Charities',
          impact: 'Impact Rate'
        },
        trending: 'Trending Charities',
        recentDonations: 'Recent Donations',
        causes: 'Explore Causes'
      },
      // Charities page
      charities: {
        title: 'Browse Charities',
        subtitle: 'Find verified organizations making a difference',
        noResults: 'No charities found matching your criteria',
        clearFilters: 'Clear Filters',
        verified: 'Verified',
        rating: 'Rating',
        donors: 'donors',
        raised: 'raised',
        donateNow: 'Donate Now'
      },
      // Donation
      donation: {
        amount: 'Amount',
        customAmount: 'Custom Amount',
        selectCharity: 'Select Charity',
        paymentMethod: 'Payment Method',
        donateButton: 'Donate ₹{{amount}}',
        processing: 'Processing...',
        success: 'Thank you for your donation!',
        failed: 'Donation failed. Please try again.',
        receipt: 'Download Receipt',
        taxBenefit: 'Tax Benefit under 80G',
        recurring: 'Make this a monthly donation'
      },
      // Auth
      auth: {
        login: {
          title: 'Welcome Back',
          subtitle: 'Sign in to your account',
          email: 'Email Address',
          password: 'Password',
          forgotPassword: 'Forgot Password?',
          noAccount: "Don't have an account?",
          signUp: 'Sign Up'
        },
        register: {
          title: 'Create Account',
          subtitle: 'Join our community of donors',
          name: 'Full Name',
          email: 'Email Address',
          password: 'Password',
          confirmPassword: 'Confirm Password',
          phone: 'Phone Number',
          role: 'I want to',
          donor: 'Donate to charities',
          charity: 'Register my charity',
          hasAccount: 'Already have an account?',
          signIn: 'Sign In'
        },
        twoFactor: {
          title: '2-Factor Authentication',
          subtitle: 'Enter the code sent to your email',
          code: 'Verification Code',
          verify: 'Verify',
          resend: 'Resend Code'
        }
      },
      // Dashboard
      dashboard: {
        welcome: 'Welcome, {{name}}!',
        totalDonated: 'Total Donated',
        charitiesSupported: 'Charities Supported',
        taxSaved: 'Tax Saved (80G)',
        recentActivity: 'Recent Activity',
        impactSummary: 'Your Impact Summary'
      },
      // Footer
      footer: {
        tagline: 'Connecting hearts, changing lives.',
        quickLinks: 'Quick Links',
        support: 'Support',
        legal: 'Legal',
        contact: 'Contact Us',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        faq: 'FAQ',
        copyright: '© {{year}} DonateMatch. All rights reserved.'
      }
    }
  },
  hi: {
    translation: {
      // Common
      common: {
        loading: 'लोड हो रहा है...',
        error: 'कुछ गलत हो गया',
        retry: 'पुनः प्रयास करें',
        save: 'सेव करें',
        cancel: 'रद्द करें',
        delete: 'हटाएं',
        edit: 'संपादित करें',
        submit: 'जमा करें',
        search: 'खोजें',
        filter: 'फ़िल्टर',
        sort: 'क्रमबद्ध करें',
        viewAll: 'सभी देखें',
        learnMore: 'और जानें',
        seeMore: 'और देखें',
        back: 'वापस',
        next: 'अगला',
        previous: 'पिछला',
        close: 'बंद करें',
        yes: 'हाँ',
        no: 'नहीं',
        or: 'या'
      },
      // Filter labels
      causes: 'कारण',
      state: 'राज्य',
      city: 'शहर',
      allStates: 'सभी राज्य',
      allCities: 'सभी शहर',
      applyFilters: 'फ़िल्टर लागू करें',
      clearAll: 'सभी साफ़ करें',
      giftCards: 'गिफ्ट कार्ड',
      // Navigation
      nav: {
        home: 'होम',
        charities: 'चैरिटी',
        about: 'हमारे बारे में',
        login: 'लॉगिन',
        register: 'रजिस्टर',
        dashboard: 'डैशबोर्ड',
        profile: 'प्रोफ़ाइल',
        donations: 'मेरे दान',
        logout: 'लॉगआउट',
        campaigns: 'अभियान',
        forum: 'समुदाय',
        volunteer: 'स्वयंसेवक'
      },
      // Home page
      home: {
        hero: {
          title: 'हर दान को सार्थक बनाएं',
          subtitle: 'AI-संचालित प्लेटफॉर्म जो दाताओं को भारत भर की सत्यापित चैरिटी से जोड़ता है',
          cta: 'दान करना शुरू करें',
          exploreCta: 'चैरिटी खोजें'
        },
        stats: {
          donated: 'कुल दान',
          donors: 'खुश दाता',
          charities: 'सत्यापित चैरिटी',
          impact: 'प्रभाव दर'
        },
        trending: 'ट्रेंडिंग चैरिटी',
        recentDonations: 'हाल के दान',
        causes: 'कारण खोजें'
      },
      // Charities page
      charities: {
        title: 'चैरिटी ब्राउज़ करें',
        subtitle: 'सत्यापित संगठनों को खोजें जो बदलाव ला रहे हैं',
        noResults: 'आपके मानदंडों से मेल खाती कोई चैरिटी नहीं मिली',
        clearFilters: 'फ़िल्टर साफ़ करें',
        verified: 'सत्यापित',
        rating: 'रेटिंग',
        donors: 'दाता',
        raised: 'जुटाया गया',
        donateNow: 'अभी दान करें'
      },
      // Donation
      donation: {
        amount: 'राशि',
        customAmount: 'कस्टम राशि',
        selectCharity: 'चैरिटी चुनें',
        paymentMethod: 'भुगतान विधि',
        donateButton: '₹{{amount}} दान करें',
        processing: 'प्रोसेसिंग...',
        success: 'आपके दान के लिए धन्यवाद!',
        failed: 'दान विफल। कृपया पुनः प्रयास करें।',
        receipt: 'रसीद डाउनलोड करें',
        taxBenefit: '80G के तहत कर लाभ',
        recurring: 'इसे मासिक दान बनाएं'
      },
      // Auth
      auth: {
        login: {
          title: 'वापस स्वागत है',
          subtitle: 'अपने खाते में साइन इन करें',
          email: 'ईमेल पता',
          password: 'पासवर्ड',
          forgotPassword: 'पासवर्ड भूल गए?',
          noAccount: 'खाता नहीं है?',
          signUp: 'साइन अप'
        },
        register: {
          title: 'खाता बनाएं',
          subtitle: 'दाताओं के हमारे समुदाय में शामिल हों',
          name: 'पूरा नाम',
          email: 'ईमेल पता',
          password: 'पासवर्ड',
          confirmPassword: 'पासवर्ड की पुष्टि करें',
          phone: 'फोन नंबर',
          role: 'मैं चाहता/चाहती हूं',
          donor: 'चैरिटी को दान करना',
          charity: 'अपनी चैरिटी रजिस्टर करना',
          hasAccount: 'पहले से खाता है?',
          signIn: 'साइन इन'
        },
        twoFactor: {
          title: '2-फैक्टर प्रमाणीकरण',
          subtitle: 'अपने ईमेल पर भेजा गया कोड दर्ज करें',
          code: 'सत्यापन कोड',
          verify: 'सत्यापित करें',
          resend: 'कोड पुनः भेजें'
        }
      },
      // Dashboard
      dashboard: {
        welcome: 'स्वागत है, {{name}}!',
        totalDonated: 'कुल दान',
        charitiesSupported: 'समर्थित चैरिटी',
        taxSaved: 'बचाया गया टैक्स (80G)',
        recentActivity: 'हाल की गतिविधि',
        impactSummary: 'आपका प्रभाव सारांश'
      },
      // Footer
      footer: {
        tagline: 'दिलों को जोड़ना, जीवन बदलना।',
        quickLinks: 'त्वरित लिंक',
        support: 'सहायता',
        legal: 'कानूनी',
        contact: 'संपर्क करें',
        privacy: 'गोपनीयता नीति',
        terms: 'सेवा की शर्तें',
        faq: 'अक्सर पूछे जाने वाले प्रश्न',
        copyright: '© {{year}} DonateMatch। सर्वाधिकार सुरक्षित।'
      }
    }
  },
  // Tamil (தமிழ்)
  ta: {
    translation: {
      common: {
        loading: 'ஏற்றுகிறது...',
        error: 'ஏதோ தவறு ஏற்பட்டது',
        retry: 'மீண்டும் முயற்சிக்கவும்',
        save: 'சேமி',
        cancel: 'ரத்து செய்',
        delete: 'நீக்கு',
        edit: 'திருத்து',
        submit: 'சமர்ப்பி',
        search: 'தேடு',
        filter: 'வடிகட்டி',
        sort: 'வரிசைப்படுத்து',
        viewAll: 'அனைத்தையும் காண்க',
        learnMore: 'மேலும் அறிக',
        seeMore: 'மேலும் பார்க்க',
        back: 'பின்செல்',
        next: 'அடுத்து',
        previous: 'முந்தைய',
        close: 'மூடு',
        yes: 'ஆம்',
        no: 'இல்லை',
        or: 'அல்லது'
      },
      nav: {
        home: 'முகப்பு',
        charities: 'தர்ம நிறுவனங்கள்',
        about: 'எங்களைப் பற்றி',
        login: 'உள்நுழை',
        register: 'பதிவு செய்',
        dashboard: 'டாஷ்போர்டு',
        profile: 'சுயவிவரம்',
        donations: 'என் நன்கொடைகள்',
        logout: 'வெளியேறு',
        campaigns: 'பிரச்சாரங்கள்',
        forum: 'சமூகம்',
        volunteer: 'தொண்டர்'
      },
      home: {
        hero: {
          title: 'ஒவ்வொரு நன்கொடையும் மதிப்புள்ளதாக மாற்று',
          subtitle: 'இந்தியா முழுவதும் சான்றளிக்கப்பட்ட தர்ம நிறுவனங்களை நன்கொடையாளர்களுடன் இணைக்கும் AI இயங்கும் தளம்',
          cta: 'நன்கொடை அளிக்கத் தொடங்கு',
          exploreCta: 'தர்ம நிறுவனங்களை ஆராய்'
        },
        stats: {
          donated: 'மொத்த நன்கொடை',
          donors: 'மகிழ்ச்சியான நன்கொடையாளர்கள்',
          charities: 'சான்றளிக்கப்பட்ட நிறுவனங்கள்',
          impact: 'தாக்க விகிதம்'
        },
        trending: 'பிரபலமான நிறுவனங்கள்',
        recentDonations: 'சமீபத்திய நன்கொடைகள்',
        causes: 'காரணங்களை ஆராய்'
      },
      charities: {
        title: 'தர்ம நிறுவனங்களை உலாவு',
        subtitle: 'மாற்றத்தை ஏற்படுத்தும் சான்றளிக்கப்பட்ட நிறுவனங்களைக் கண்டறி',
        noResults: 'உங்கள் தேர்வுகளுக்கு பொருந்தும் நிறுவனங்கள் இல்லை',
        clearFilters: 'வடிகட்டிகளை நீக்கு',
        verified: 'சான்றளிக்கப்பட்டது',
        rating: 'மதிப்பீடு',
        donors: 'நன்கொடையாளர்கள்',
        raised: 'திரட்டப்பட்டது',
        donateNow: 'இப்போது நன்கொடை அளி'
      },
      donation: {
        amount: 'தொகை',
        customAmount: 'தனிப்பயன் தொகை',
        selectCharity: 'நிறுவனத்தைத் தேர்வு செய்',
        paymentMethod: 'பணம் செலுத்தும் முறை',
        donateButton: '₹{{amount}} நன்கொடை அளி',
        processing: 'செயலாக்கம்...',
        success: 'உங்கள் நன்கொடைக்கு நன்றி!',
        failed: 'நன்கொடை தோல்வி. மீண்டும் முயற்சிக்கவும்.',
        receipt: 'ரசீதைப் பதிவிறக்கு',
        taxBenefit: '80G கீழ் வரி சலுகை',
        recurring: 'இதை மாதாந்திர நன்கொடையாக மாற்று'
      },
      auth: {
        login: {
          title: 'மீண்டும் வருக',
          subtitle: 'உங்கள் கணக்கில் உள்நுழையவும்',
          email: 'மின்னஞ்சல்',
          password: 'கடவுச்சொல்',
          forgotPassword: 'கடவுச்சொல் மறந்துவிட்டதா?',
          noAccount: 'கணக்கு இல்லையா?',
          signUp: 'பதிவு செய்'
        },
        register: {
          title: 'கணக்கை உருவாக்கு',
          subtitle: 'நன்கொடையாளர்கள் சமூகத்தில் சேர்',
          name: 'முழு பெயர்',
          email: 'மின்னஞ்சல்',
          password: 'கடவுச்சொல்',
          confirmPassword: 'கடவுச்சொல்லை உறுதிப்படுத்து',
          phone: 'தொலைபேசி எண்',
          role: 'நான்',
          donor: 'தர்ம நிறுவனங்களுக்கு நன்கொடை அளிக்க விரும்புகிறேன்',
          charity: 'என் தர்ம நிறுவனத்தைப் பதிவு செய்ய விரும்புகிறேன்',
          hasAccount: 'ஏற்கனவே கணக்கு உள்ளதா?',
          signIn: 'உள்நுழை'
        },
        twoFactor: {
          title: '2-காரணி அங்கீகாரம்',
          subtitle: 'உங்கள் மின்னஞ்சலுக்கு அனுப்பப்பட்ட குறியீட்டை உள்ளிடவும்',
          code: 'சரிபார்ப்பு குறியீடு',
          verify: 'சரிபார்',
          resend: 'குறியீட்டை மீண்டும் அனுப்பு'
        }
      },
      dashboard: {
        welcome: 'வரவேற்கிறோம், {{name}}!',
        totalDonated: 'மொத்த நன்கொடை',
        charitiesSupported: 'ஆதரிக்கப்பட்ட நிறுவனங்கள்',
        taxSaved: 'சேமிக்கப்பட்ட வரி (80G)',
        recentActivity: 'சமீபத்திய செயல்பாடு',
        impactSummary: 'உங்கள் தாக்க சுருக்கம்'
      },
      footer: {
        tagline: 'இதயங்களை இணைத்து, வாழ்க்கையை மாற்றுகிறது.',
        quickLinks: 'விரைவு இணைப்புகள்',
        support: 'ஆதரவு',
        legal: 'சட்டம்',
        contact: 'எங்களை தொடர்புகொள்',
        privacy: 'தனியுரிமைக் கொள்கை',
        terms: 'சேவை விதிமுறைகள்',
        faq: 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
        copyright: '© {{year}} DonateMatch. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.'
      }
    }
  },
  // Bengali (বাংলা)
  bn: {
    translation: {
      common: {
        loading: 'লোড হচ্ছে...',
        error: 'কিছু ভুল হয়েছে',
        retry: 'আবার চেষ্টা করুন',
        save: 'সংরক্ষণ করুন',
        cancel: 'বাতিল',
        delete: 'মুছুন',
        edit: 'সম্পাদনা',
        submit: 'জমা দিন',
        search: 'অনুসন্ধান',
        filter: 'ফিল্টার',
        sort: 'সাজান',
        viewAll: 'সব দেখুন',
        learnMore: 'আরও জানুন',
        seeMore: 'আরও দেখুন',
        back: 'পিছনে',
        next: 'পরবর্তী',
        previous: 'পূর্ববর্তী',
        close: 'বন্ধ',
        yes: 'হ্যাঁ',
        no: 'না',
        or: 'অথবা'
      },
      nav: {
        home: 'হোম',
        charities: 'দাতব্য সংস্থা',
        about: 'আমাদের সম্পর্কে',
        login: 'লগইন',
        register: 'নিবন্ধন',
        dashboard: 'ড্যাশবোর্ড',
        profile: 'প্রোফাইল',
        donations: 'আমার দান',
        logout: 'লগআউট',
        campaigns: 'প্রচারণা',
        forum: 'সম্প্রদায়',
        volunteer: 'স্বেচ্ছাসেবক'
      },
      home: {
        hero: {
          title: 'প্রতিটি দান সার্থক করুন',
          subtitle: 'AI-চালিত প্ল্যাটফর্ম যা দাতাদের ভারত জুড়ে যাচাইকৃত দাতব্য সংস্থার সাথে সংযুক্ত করে',
          cta: 'দান করা শুরু করুন',
          exploreCta: 'দাতব্য সংস্থা অন্বেষণ করুন'
        },
        stats: {
          donated: 'মোট দান',
          donors: 'সুখী দাতা',
          charities: 'যাচাইকৃত সংস্থা',
          impact: 'প্রভাব হার'
        },
        trending: 'জনপ্রিয় সংস্থা',
        recentDonations: 'সাম্প্রতিক দান',
        causes: 'কারণ অন্বেষণ করুন'
      },
      charities: {
        title: 'দাতব্য সংস্থা ব্রাউজ করুন',
        subtitle: 'পরিবর্তন আনছে এমন যাচাইকৃত সংস্থাগুলি খুঁজুন',
        noResults: 'আপনার মানদণ্ডের সাথে মিলে যাওয়া কোনো সংস্থা পাওয়া যায়নি',
        clearFilters: 'ফিল্টার সাফ করুন',
        verified: 'যাচাইকৃত',
        rating: 'রেটিং',
        donors: 'দাতা',
        raised: 'সংগ্রহিত',
        donateNow: 'এখনই দান করুন'
      },
      donation: {
        amount: 'পরিমাণ',
        customAmount: 'কাস্টম পরিমাণ',
        selectCharity: 'সংস্থা নির্বাচন করুন',
        paymentMethod: 'পেমেন্ট পদ্ধতি',
        donateButton: '₹{{amount}} দান করুন',
        processing: 'প্রক্রিয়াকরণ...',
        success: 'আপনার দানের জন্য ধন্যবাদ!',
        failed: 'দান ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।',
        receipt: 'রসিদ ডাউনলোড করুন',
        taxBenefit: '80G এর অধীনে কর সুবিধা',
        recurring: 'এটি মাসিক দান করুন'
      },
      auth: {
        login: {
          title: 'স্বাগতম',
          subtitle: 'আপনার অ্যাকাউন্টে সাইন ইন করুন',
          email: 'ইমেল',
          password: 'পাসওয়ার্ড',
          forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
          noAccount: 'অ্যাকাউন্ট নেই?',
          signUp: 'সাইন আপ'
        },
        register: {
          title: 'অ্যাকাউন্ট তৈরি করুন',
          subtitle: 'আমাদের দাতা সম্প্রদায়ে যোগ দিন',
          name: 'পুরো নাম',
          email: 'ইমেল',
          password: 'পাসওয়ার্ড',
          confirmPassword: 'পাসওয়ার্ড নিশ্চিত করুন',
          phone: 'ফোন নম্বর',
          role: 'আমি চাই',
          donor: 'দাতব্য সংস্থায় দান করতে',
          charity: 'আমার দাতব্য সংস্থা নিবন্ধন করতে',
          hasAccount: 'ইতিমধ্যে অ্যাকাউন্ট আছে?',
          signIn: 'সাইন ইন'
        },
        twoFactor: {
          title: '২-ফ্যাক্টর প্রমাণীকরণ',
          subtitle: 'আপনার ইমেলে পাঠানো কোড লিখুন',
          code: 'যাচাইকরণ কোড',
          verify: 'যাচাই করুন',
          resend: 'কোড পুনরায় পাঠান'
        }
      },
      dashboard: {
        welcome: 'স্বাগতম, {{name}}!',
        totalDonated: 'মোট দান',
        charitiesSupported: 'সমর্থিত সংস্থা',
        taxSaved: 'সঞ্চিত কর (80G)',
        recentActivity: 'সাম্প্রতিক কার্যকলাপ',
        impactSummary: 'আপনার প্রভাব সারাংশ'
      },
      footer: {
        tagline: 'হৃদয় সংযুক্ত করা, জীবন পরিবর্তন করা।',
        quickLinks: 'দ্রুত লিঙ্ক',
        support: 'সাপোর্ট',
        legal: 'আইনি',
        contact: 'যোগাযোগ করুন',
        privacy: 'গোপনীয়তা নীতি',
        terms: 'সেবার শর্তাবলী',
        faq: 'সচরাচর জিজ্ঞাসা',
        copyright: '© {{year}} DonateMatch. সর্বস্বত্ব সংরক্ষিত।'
      }
    }
  },
  // Telugu (తెలుగు)
  te: {
    translation: {
      common: {
        loading: 'లోడ్ అవుతోంది...',
        error: 'ఏదో తప్పు జరిగింది',
        retry: 'మళ్ళీ ప్రయత్నించండి',
        save: 'సేవ్ చేయండి',
        cancel: 'రద్దు చేయండి',
        delete: 'తొలగించండి',
        edit: 'సవరించండి',
        submit: 'సమర్పించండి',
        search: 'వెతకండి',
        filter: 'ఫిల్టర్',
        sort: 'క్రమబద్ధీకరించండి',
        viewAll: 'అన్నీ చూడండి',
        learnMore: 'మరింత తెలుసుకోండి',
        seeMore: 'మరిన్ని చూడండి',
        back: 'వెనుకకు',
        next: 'తదుపరి',
        previous: 'మునుపటి',
        close: 'మూసివేయండి',
        yes: 'అవును',
        no: 'కాదు',
        or: 'లేదా'
      },
      nav: {
        home: 'హోమ్',
        charities: 'దాతృత్వ సంస్థలు',
        about: 'మా గురించి',
        login: 'లాగిన్',
        register: 'నమోదు',
        dashboard: 'డాష్‌బోర్డ్',
        profile: 'ప్రొఫైల్',
        donations: 'నా విరాళాలు',
        logout: 'లాగౌట్',
        campaigns: 'ప్రచారాలు',
        forum: 'సంఘం',
        volunteer: 'వాలంటీర్'
      },
      home: {
        hero: {
          title: 'ప్రతి విరాళాన్ని విలువైనదిగా చేయండి',
          subtitle: 'భారతదేశం అంతటా ధృవీకరించబడిన దాతృత్వ సంస్థలతో దాతలను అనుసంధానించే AI-ఆధారిత వేదిక',
          cta: 'విరాళం ఇవ్వడం ప్రారంభించండి',
          exploreCta: 'దాతృత్వ సంస్థలను అన్వేషించండి'
        },
        stats: {
          donated: 'మొత్తం విరాళం',
          donors: 'సంతోషకరమైన దాతలు',
          charities: 'ధృవీకరించబడిన సంస్థలు',
          impact: 'ప్రభావ రేటు'
        },
        trending: 'ట్రెండింగ్ సంస్థలు',
        recentDonations: 'ఇటీవలి విరాళాలు',
        causes: 'కారణాలను అన్వేషించండి'
      },
      charities: {
        title: 'దాతృత్వ సంస్థలను బ్రౌజ్ చేయండి',
        subtitle: 'మార్పును తీసుకొస్తున్న ధృవీకరించబడిన సంస్థలను కనుగొనండి',
        noResults: 'మీ ప్రమాణాలకు సరిపోయే సంస్థలు కనుగొనబడలేదు',
        clearFilters: 'ఫిల్టర్‌లను క్లియర్ చేయండి',
        verified: 'ధృవీకరించబడింది',
        rating: 'రేటింగ్',
        donors: 'దాతలు',
        raised: 'సేకరించబడింది',
        donateNow: 'ఇప్పుడు విరాళం ఇవ్వండి'
      },
      donation: {
        amount: 'మొత్తం',
        customAmount: 'అనుకూల మొత్తం',
        selectCharity: 'సంస్థను ఎంచుకోండి',
        paymentMethod: 'చెల్లింపు పద్ధతి',
        donateButton: '₹{{amount}} విరాళం ఇవ్వండి',
        processing: 'ప్రాసెస్ అవుతోంది...',
        success: 'మీ విరాళానికి ధన్యవాదాలు!',
        failed: 'విరాళం విఫలమైంది. దయచేసి మళ్ళీ ప్రయత్నించండి.',
        receipt: 'రసీదు డౌన్‌లోడ్ చేయండి',
        taxBenefit: '80G కింద పన్ను ప్రయోజనం',
        recurring: 'దీన్ని నెలవారీ విరాళంగా చేయండి'
      },
      auth: {
        login: {
          title: 'తిరిగి స్వాగతం',
          subtitle: 'మీ ఖాతాలోకి సైన్ ఇన్ చేయండి',
          email: 'ఇమెయిల్',
          password: 'పాస్‌వర్డ్',
          forgotPassword: 'పాస్‌వర్డ్ మర్చిపోయారా?',
          noAccount: 'ఖాతా లేదా?',
          signUp: 'సైన్ అప్'
        },
        register: {
          title: 'ఖాతా సృష్టించండి',
          subtitle: 'మా దాతల సంఘంలో చేరండి',
          name: 'పూర్తి పేరు',
          email: 'ఇమెయిల్',
          password: 'పాస్‌వర్డ్',
          confirmPassword: 'పాస్‌వర్డ్ నిర్ధారించండి',
          phone: 'ఫోన్ నంబర్',
          role: 'నేను',
          donor: 'దాతృత్వ సంస్థలకు విరాళం ఇవ్వాలనుకుంటున్నాను',
          charity: 'నా దాతృత్వ సంస్థను నమోదు చేయాలనుకుంటున్నాను',
          hasAccount: 'ఇప్పటికే ఖాతా ఉందా?',
          signIn: 'సైన్ ఇన్'
        },
        twoFactor: {
          title: '2-ఫ్యాక్టర్ ప్రమాణీకరణ',
          subtitle: 'మీ ఇమెయిల్‌కు పంపిన కోడ్ నమోదు చేయండి',
          code: 'ధృవీకరణ కోడ్',
          verify: 'ధృవీకరించండి',
          resend: 'కోడ్ మళ్ళీ పంపండి'
        }
      },
      dashboard: {
        welcome: 'స్వాగతం, {{name}}!',
        totalDonated: 'మొత్తం విరాళం',
        charitiesSupported: 'మద్దతు ఇచ్చిన సంస్థలు',
        taxSaved: 'ఆదా అయిన పన్ను (80G)',
        recentActivity: 'ఇటీవలి కార్యాచరణ',
        impactSummary: 'మీ ప్రభావ సారాంశం'
      },
      footer: {
        tagline: 'హృదయాలను అనుసంధానిస్తూ, జీవితాలను మారుస్తోంది.',
        quickLinks: 'త్వరిత లింకులు',
        support: 'మద్దతు',
        legal: 'చట్టపరమైన',
        contact: 'మమ్మల్ని సంప్రదించండి',
        privacy: 'గోప్యతా విధానం',
        terms: 'సేవా నిబంధనలు',
        faq: 'తరచుగా అడిగే ప్రశ్నలు',
        copyright: '© {{year}} DonateMatch. అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి.'
      }
    }
  },
  // Marathi (मराठी)
  mr: {
    translation: {
      common: {
        loading: 'लोड होत आहे...',
        error: 'काहीतरी चुकीचे झाले',
        retry: 'पुन्हा प्रयत्न करा',
        save: 'जतन करा',
        cancel: 'रद्द करा',
        delete: 'हटवा',
        edit: 'संपादित करा',
        submit: 'सबमिट करा',
        search: 'शोधा',
        filter: 'फिल्टर',
        sort: 'क्रमवारी लावा',
        viewAll: 'सर्व पहा',
        learnMore: 'अधिक जाणून घ्या',
        seeMore: 'अधिक पहा',
        back: 'मागे',
        next: 'पुढे',
        previous: 'मागील',
        close: 'बंद करा',
        yes: 'होय',
        no: 'नाही',
        or: 'किंवा'
      },
      nav: {
        home: 'होम',
        charities: 'धर्मादाय संस्था',
        about: 'आमच्याबद्दल',
        login: 'लॉगिन',
        register: 'नोंदणी',
        dashboard: 'डॅशबोर्ड',
        profile: 'प्रोफाइल',
        donations: 'माझे दान',
        logout: 'लॉगआउट',
        campaigns: 'मोहिमा',
        forum: 'समुदाय',
        volunteer: 'स्वयंसेवक'
      },
      home: {
        hero: {
          title: 'प्रत्येक दान सार्थक करा',
          subtitle: 'संपूर्ण भारतातील सत्यापित धर्मादाय संस्थांशी दाता जोडणारे AI-संचालित व्यासपीठ',
          cta: 'दान करणे सुरू करा',
          exploreCta: 'धर्मादाय संस्था शोधा'
        },
        stats: {
          donated: 'एकूण दान',
          donors: 'आनंदी दाते',
          charities: 'सत्यापित संस्था',
          impact: 'प्रभाव दर'
        },
        trending: 'ट्रेंडिंग संस्था',
        recentDonations: 'अलीकडील दान',
        causes: 'कारणे शोधा'
      },
      charities: {
        title: 'धर्मादाय संस्था ब्राउझ करा',
        subtitle: 'बदल घडवणाऱ्या सत्यापित संस्था शोधा',
        noResults: 'तुमच्या निकषांशी जुळणाऱ्या संस्था सापडल्या नाहीत',
        clearFilters: 'फिल्टर साफ करा',
        verified: 'सत्यापित',
        rating: 'रेटिंग',
        donors: 'दाते',
        raised: 'जमा केले',
        donateNow: 'आता दान करा'
      },
      donation: {
        amount: 'रक्कम',
        customAmount: 'सानुकूल रक्कम',
        selectCharity: 'संस्था निवडा',
        paymentMethod: 'पेमेंट पद्धत',
        donateButton: '₹{{amount}} दान करा',
        processing: 'प्रक्रिया होत आहे...',
        success: 'तुमच्या दानाबद्दल धन्यवाद!',
        failed: 'दान अयशस्वी. कृपया पुन्हा प्रयत्न करा.',
        receipt: 'पावती डाउनलोड करा',
        taxBenefit: '80G अंतर्गत कर लाभ',
        recurring: 'हे मासिक दान करा'
      },
      auth: {
        login: {
          title: 'पुन्हा स्वागत आहे',
          subtitle: 'तुमच्या खात्यात साइन इन करा',
          email: 'ईमेल',
          password: 'पासवर्ड',
          forgotPassword: 'पासवर्ड विसरलात?',
          noAccount: 'खाते नाही?',
          signUp: 'साइन अप'
        },
        register: {
          title: 'खाते तयार करा',
          subtitle: 'आमच्या दाता समुदायात सामील व्हा',
          name: 'पूर्ण नाव',
          email: 'ईमेल',
          password: 'पासवर्ड',
          confirmPassword: 'पासवर्डची पुष्टी करा',
          phone: 'फोन नंबर',
          role: 'मला',
          donor: 'धर्मादाय संस्थांना दान करायचे आहे',
          charity: 'माझी धर्मादाय संस्था नोंदणी करायची आहे',
          hasAccount: 'आधीच खाते आहे?',
          signIn: 'साइन इन'
        },
        twoFactor: {
          title: '२-फॅक्टर प्रमाणीकरण',
          subtitle: 'तुमच्या ईमेलवर पाठवलेला कोड प्रविष्ट करा',
          code: 'सत्यापन कोड',
          verify: 'सत्यापित करा',
          resend: 'कोड पुन्हा पाठवा'
        }
      },
      dashboard: {
        welcome: 'स्वागत आहे, {{name}}!',
        totalDonated: 'एकूण दान',
        charitiesSupported: 'समर्थित संस्था',
        taxSaved: 'वाचवलेला कर (80G)',
        recentActivity: 'अलीकडील क्रियाकलाप',
        impactSummary: 'तुमचा प्रभाव सारांश'
      },
      footer: {
        tagline: 'हृदये जोडणे, जीवन बदलणे.',
        quickLinks: 'जलद दुवे',
        support: 'समर्थन',
        legal: 'कायदेशीर',
        contact: 'आमच्याशी संपर्क साधा',
        privacy: 'गोपनीयता धोरण',
        terms: 'सेवेच्या अटी',
        faq: 'वारंवार विचारले जाणारे प्रश्न',
        copyright: '© {{year}} DonateMatch. सर्व हक्क राखीव.'
      }
    }
  },
  // Gujarati (ગુજરાતી)
  gu: {
    translation: {
      common: {
        loading: 'લોડ થઈ રહ્યું છે...',
        error: 'કંઈક ખોટું થયું',
        retry: 'ફરી પ્રયાસ કરો',
        save: 'સાચવો',
        cancel: 'રદ કરો',
        delete: 'કાઢી નાખો',
        edit: 'સંપાદિત કરો',
        submit: 'સબમિટ કરો',
        search: 'શોધો',
        filter: 'ફિલ્ટર',
        sort: 'ક્રમબદ્ધ કરો',
        viewAll: 'બધું જુઓ',
        learnMore: 'વધુ જાણો',
        seeMore: 'વધુ જુઓ',
        back: 'પાછા',
        next: 'આગળ',
        previous: 'અગાઉનું',
        close: 'બંધ કરો',
        yes: 'હા',
        no: 'ના',
        or: 'અથવા'
      },
      nav: {
        home: 'હોમ',
        charities: 'ચેરિટી',
        about: 'અમારા વિશે',
        login: 'લૉગિન',
        register: 'નોંધણી',
        dashboard: 'ડેશબોર્ડ',
        profile: 'પ્રોફાઇલ',
        donations: 'મારા દાન',
        logout: 'લૉગઆઉટ',
        campaigns: 'અભિયાનો',
        forum: 'સમુદાય',
        volunteer: 'સ્વયંસેવક'
      },
      home: {
        hero: {
          title: 'દરેક દાનને સાર્થક બનાવો',
          subtitle: 'AI-સંચાલિત પ્લેટફોર્મ જે દાતાઓને ભારતભરની ચકાસાયેલ ચેરિટી સાથે જોડે છે',
          cta: 'દાન કરવાનું શરૂ કરો',
          exploreCta: 'ચેરિટી શોધો'
        },
        stats: {
          donated: 'કુલ દાન',
          donors: 'ખુશ દાતાઓ',
          charities: 'ચકાસાયેલ ચેરિટી',
          impact: 'અસર દર'
        },
        trending: 'ટ્રેન્ડિંગ ચેરિટી',
        recentDonations: 'તાજેતરના દાન',
        causes: 'કારણો શોધો'
      },
      charities: {
        title: 'ચેરિટી બ્રાઉઝ કરો',
        subtitle: 'પરિવર્તન લાવતી ચકાસાયેલ સંસ્થાઓ શોધો',
        noResults: 'તમારા માપદંડો સાથે મેળ ખાતી ચેરિટી મળી નથી',
        clearFilters: 'ફિલ્ટર સાફ કરો',
        verified: 'ચકાસાયેલ',
        rating: 'રેટિંગ',
        donors: 'દાતાઓ',
        raised: 'એકત્રિત',
        donateNow: 'હવે દાન કરો'
      },
      donation: {
        amount: 'રકમ',
        customAmount: 'કસ્ટમ રકમ',
        selectCharity: 'ચેરિટી પસંદ કરો',
        paymentMethod: 'ચુકવણી પદ્ધતિ',
        donateButton: '₹{{amount}} દાન કરો',
        processing: 'પ્રોસેસિંગ...',
        success: 'તમારા દાન બદલ આભાર!',
        failed: 'દાન નિષ્ફળ. ફરી પ્રયાસ કરો.',
        receipt: 'રસીદ ડાઉનલોડ કરો',
        taxBenefit: '80G હેઠળ કર લાભ',
        recurring: 'આને માસિક દાન બનાવો'
      },
      auth: {
        login: {
          title: 'પાછા આવ્યા',
          subtitle: 'તમારા ખાતામાં સાઇન ઇન કરો',
          email: 'ઇમેઇલ',
          password: 'પાસવર્ડ',
          forgotPassword: 'પાસવર્ડ ભૂલી ગયા?',
          noAccount: 'ખાતું નથી?',
          signUp: 'સાઇન અપ'
        },
        register: {
          title: 'ખાતું બનાવો',
          subtitle: 'દાતાઓના સમુદાયમાં જોડાઓ',
          name: 'પૂરું નામ',
          email: 'ઇમેઇલ',
          password: 'પાસવર્ડ',
          confirmPassword: 'પાસવર્ડની પુષ્ટિ કરો',
          phone: 'ફોન નંબર',
          role: 'હું ઇચ્છું છું',
          donor: 'ચેરિટીને દાન કરવા',
          charity: 'મારી ચેરિટી નોંધાવવા',
          hasAccount: 'પહેલેથી ખાતું છે?',
          signIn: 'સાઇન ઇન'
        },
        twoFactor: {
          title: '2-ફેક્ટર ઓથેન્ટિકેશન',
          subtitle: 'તમારા ઇમેઇલ પર મોકલેલ કોડ દાખલ કરો',
          code: 'ચકાસણી કોડ',
          verify: 'ચકાસો',
          resend: 'કોડ ફરી મોકલો'
        }
      },
      dashboard: {
        welcome: 'સ્વાગત છે, {{name}}!',
        totalDonated: 'કુલ દાન',
        charitiesSupported: 'સમર્થિત ચેરિટી',
        taxSaved: 'બચાવેલ કર (80G)',
        recentActivity: 'તાજેતરની પ્રવૃત્તિ',
        impactSummary: 'તમારો અસર સારાંશ'
      },
      footer: {
        tagline: 'હૃદયો જોડવા, જીવન બદલવું.',
        quickLinks: 'ઝડપી લિંક્સ',
        support: 'સપોર્ટ',
        legal: 'કાનૂની',
        contact: 'સંપર્ક કરો',
        privacy: 'ગોપનીયતા નીતિ',
        terms: 'સેવાની શરતો',
        faq: 'વારંવાર પૂછાતા પ્રશ્નો',
        copyright: '© {{year}} DonateMatch. સર્વાધિકાર સુરક્ષિત.'
      }
    }
  },
  // Kannada (ಕನ್ನಡ)
  kn: {
    translation: {
      common: {
        loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
        error: 'ಏನೋ ತಪ್ಪಾಯಿತು',
        retry: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
        save: 'ಉಳಿಸಿ',
        cancel: 'ರದ್ದುಮಾಡಿ',
        delete: 'ಅಳಿಸಿ',
        edit: 'ಸಂಪಾದಿಸಿ',
        submit: 'ಸಲ್ಲಿಸಿ',
        search: 'ಹುಡುಕಿ',
        filter: 'ಫಿಲ್ಟರ್',
        sort: 'ಕ್ರಮಬದ್ಧಗೊಳಿಸಿ',
        viewAll: 'ಎಲ್ಲಾ ನೋಡಿ',
        learnMore: 'ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ',
        seeMore: 'ಇನ್ನಷ್ಟು ನೋಡಿ',
        back: 'ಹಿಂದೆ',
        next: 'ಮುಂದೆ',
        previous: 'ಹಿಂದಿನ',
        close: 'ಮುಚ್ಚಿ',
        yes: 'ಹೌದು',
        no: 'ಇಲ್ಲ',
        or: 'ಅಥವಾ'
      },
      nav: {
        home: 'ಮುಖಪುಟ',
        charities: 'ದತ್ತಿ ಸಂಸ್ಥೆಗಳು',
        about: 'ನಮ್ಮ ಬಗ್ಗೆ',
        login: 'ಲಾಗಿನ್',
        register: 'ನೋಂದಣಿ',
        dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
        profile: 'ಪ್ರೊಫೈಲ್',
        donations: 'ನನ್ನ ದಾನಗಳು',
        logout: 'ಲಾಗ್‌ಔಟ್',
        campaigns: 'ಅಭಿಯಾನಗಳು',
        forum: 'ಸಮುದಾಯ',
        volunteer: 'ಸ್ವಯಂಸೇವಕ'
      },
      home: {
        hero: {
          title: 'ಪ್ರತಿ ದಾನವನ್ನು ಮೌಲ್ಯಯುತವಾಗಿಸಿ',
          subtitle: 'ಭಾರತದಾದ್ಯಂತ ಪರಿಶೀಲಿತ ದತ್ತಿ ಸಂಸ್ಥೆಗಳೊಂದಿಗೆ ದಾನಿಗಳನ್ನು ಸಂಪರ್ಕಿಸುವ AI-ಚಾಲಿತ ವೇದಿಕೆ',
          cta: 'ದಾನ ಮಾಡಲು ಪ್ರಾರಂಭಿಸಿ',
          exploreCta: 'ದತ್ತಿ ಸಂಸ್ಥೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ'
        },
        stats: {
          donated: 'ಒಟ್ಟು ದಾನ',
          donors: 'ಸಂತೋಷದ ದಾನಿಗಳು',
          charities: 'ಪರಿಶೀಲಿತ ಸಂಸ್ಥೆಗಳು',
          impact: 'ಪ್ರಭಾವ ದರ'
        },
        trending: 'ಟ್ರೆಂಡಿಂಗ್ ಸಂಸ್ಥೆಗಳು',
        recentDonations: 'ಇತ್ತೀಚಿನ ದಾನಗಳು',
        causes: 'ಕಾರಣಗಳನ್ನು ಅನ್ವೇಷಿಸಿ'
      },
      charities: {
        title: 'ದತ್ತಿ ಸಂಸ್ಥೆಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ',
        subtitle: 'ಬದಲಾವಣೆ ತರುತ್ತಿರುವ ಪರಿಶೀಲಿತ ಸಂಸ್ಥೆಗಳನ್ನು ಹುಡುಕಿ',
        noResults: 'ನಿಮ್ಮ ಮಾನದಂಡಗಳಿಗೆ ಹೊಂದಾಣಿಕೆಯಾಗುವ ಸಂಸ್ಥೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
        clearFilters: 'ಫಿಲ್ಟರ್‌ಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ',
        verified: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
        rating: 'ರೇಟಿಂಗ್',
        donors: 'ದಾನಿಗಳು',
        raised: 'ಸಂಗ್ರಹಿಸಲಾಗಿದೆ',
        donateNow: 'ಈಗ ದಾನ ಮಾಡಿ'
      },
      donation: {
        amount: 'ಮೊತ್ತ',
        customAmount: 'ಕಸ್ಟಮ್ ಮೊತ್ತ',
        selectCharity: 'ಸಂಸ್ಥೆ ಆಯ್ಕೆಮಾಡಿ',
        paymentMethod: 'ಪಾವತಿ ವಿಧಾನ',
        donateButton: '₹{{amount}} ದಾನ ಮಾಡಿ',
        processing: 'ಪ್ರಕ್ರಿಯೆ...',
        success: 'ನಿಮ್ಮ ದಾನಕ್ಕೆ ಧನ್ಯವಾದ!',
        failed: 'ದಾನ ವಿಫಲವಾಯಿತು. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
        receipt: 'ರಸೀದಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
        taxBenefit: '80G ಅಡಿಯಲ್ಲಿ ತೆರಿಗೆ ಪ್ರಯೋಜನ',
        recurring: 'ಇದನ್ನು ಮಾಸಿಕ ದಾನವಾಗಿ ಮಾಡಿ'
      },
      auth: {
        login: {
          title: 'ಮತ್ತೆ ಸ್ವಾಗತ',
          subtitle: 'ನಿಮ್ಮ ಖಾತೆಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ',
          email: 'ಇಮೇಲ್',
          password: 'ಪಾಸ್‌ವರ್ಡ್',
          forgotPassword: 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?',
          noAccount: 'ಖಾತೆ ಇಲ್ಲವೇ?',
          signUp: 'ಸೈನ್ ಅಪ್'
        },
        register: {
          title: 'ಖಾತೆ ರಚಿಸಿ',
          subtitle: 'ದಾನಿಗಳ ಸಮುದಾಯಕ್ಕೆ ಸೇರಿ',
          name: 'ಪೂರ್ಣ ಹೆಸರು',
          email: 'ಇಮೇಲ್',
          password: 'ಪಾಸ್‌ವರ್ಡ್',
          confirmPassword: 'ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ',
          phone: 'ಫೋನ್ ನಂಬರ್',
          role: 'ನಾನು',
          donor: 'ದತ್ತಿ ಸಂಸ್ಥೆಗಳಿಗೆ ದಾನ ಮಾಡಲು ಬಯಸುತ್ತೇನೆ',
          charity: 'ನನ್ನ ದತ್ತಿ ಸಂಸ್ಥೆಯನ್ನು ನೋಂದಾಯಿಸಲು ಬಯಸುತ್ತೇನೆ',
          hasAccount: 'ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?',
          signIn: 'ಸೈನ್ ಇನ್'
        },
        twoFactor: {
          title: '2-ಫ್ಯಾಕ್ಟರ್ ದೃಢೀಕರಣ',
          subtitle: 'ನಿಮ್ಮ ಇಮೇಲ್‌ಗೆ ಕಳುಹಿಸಿದ ಕೋಡ್ ನಮೂದಿಸಿ',
          code: 'ಪರಿಶೀಲನಾ ಕೋಡ್',
          verify: 'ಪರಿಶೀಲಿಸಿ',
          resend: 'ಕೋಡ್ ಮತ್ತೆ ಕಳುಹಿಸಿ'
        }
      },
      dashboard: {
        welcome: 'ಸ್ವಾಗತ, {{name}}!',
        totalDonated: 'ಒಟ್ಟು ದಾನ',
        charitiesSupported: 'ಬೆಂಬಲಿತ ಸಂಸ್ಥೆಗಳು',
        taxSaved: 'ಉಳಿತಾಯ ಮಾಡಿದ ತೆರಿಗೆ (80G)',
        recentActivity: 'ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ',
        impactSummary: 'ನಿಮ್ಮ ಪ್ರಭಾವ ಸಾರಾಂಶ'
      },
      footer: {
        tagline: 'ಹೃದಯಗಳನ್ನು ಸಂಪರ್ಕಿಸುವುದು, ಜೀವನಗಳನ್ನು ಬದಲಾಯಿಸುವುದು.',
        quickLinks: 'ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು',
        support: 'ಬೆಂಬಲ',
        legal: 'ಕಾನೂನು',
        contact: 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ',
        privacy: 'ಗೌಪ್ಯತಾ ನೀತಿ',
        terms: 'ಸೇವಾ ನಿಯಮಗಳು',
        faq: 'ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು',
        copyright: '© {{year}} DonateMatch. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.'
      }
    }
  },
  // Malayalam (മലയാളം)
  ml: {
    translation: {
      common: {
        loading: 'ലോഡ് ചെയ്യുന്നു...',
        error: 'എന്തോ തെറ്റ് സംഭവിച്ചു',
        retry: 'വീണ്ടും ശ്രമിക്കുക',
        save: 'സേവ് ചെയ്യുക',
        cancel: 'റദ്ദാക്കുക',
        delete: 'ഇല്ലാതാക്കുക',
        edit: 'എഡിറ്റ് ചെയ്യുക',
        submit: 'സമർപ്പിക്കുക',
        search: 'തിരയുക',
        filter: 'ഫിൽട്ടർ',
        sort: 'ക്രമപ്പെടുത്തുക',
        viewAll: 'എല്ലാം കാണുക',
        learnMore: 'കൂടുതലറിയുക',
        seeMore: 'കൂടുതൽ കാണുക',
        back: 'പിന്നോട്ട്',
        next: 'അടുത്തത്',
        previous: 'മുമ്പത്തേത്',
        close: 'അടയ്ക്കുക',
        yes: 'അതെ',
        no: 'ഇല്ല',
        or: 'അല്ലെങ്കിൽ'
      },
      nav: {
        home: 'ഹോം',
        charities: 'ചാരിറ്റികൾ',
        about: 'ഞങ്ങളെ കുറിച്ച്',
        login: 'ലോഗിൻ',
        register: 'രജിസ്റ്റർ',
        dashboard: 'ഡാഷ്‌ബോർഡ്',
        profile: 'പ്രൊഫൈൽ',
        donations: 'എന്റെ സംഭാവനകൾ',
        logout: 'ലോഗൗട്ട്',
        campaigns: 'കാമ്പെയ്‌നുകൾ',
        forum: 'കമ്മ്യൂണിറ്റി',
        volunteer: 'വോളണ്ടിയർ'
      },
      home: {
        hero: {
          title: 'എല്ലാ സംഭാവനയും മൂല്യവത്താക്കുക',
          subtitle: 'ഇന്ത്യയിലുടനീളമുള്ള പരിശോധിച്ച ചാരിറ്റികളുമായി ദാതാക്കളെ ബന്ധിപ്പിക്കുന്ന AI-പ്രവർത്തിത പ്ലാറ്റ്‌ഫോം',
          cta: 'സംഭാവന ചെയ്യാൻ തുടങ്ങുക',
          exploreCta: 'ചാരിറ്റികൾ പര്യവേക്ഷണം ചെയ്യുക'
        },
        stats: {
          donated: 'ആകെ സംഭാവന',
          donors: 'സന്തുഷ്ട ദാതാക്കൾ',
          charities: 'പരിശോധിച്ച ചാരിറ്റികൾ',
          impact: 'ഇംപാക്ട് റേറ്റ്'
        },
        trending: 'ട്രെൻഡിംഗ് ചാരിറ്റികൾ',
        recentDonations: 'സമീപകാല സംഭാവനകൾ',
        causes: 'കാരണങ്ങൾ പര്യവേക്ഷണം ചെയ്യുക'
      },
      charities: {
        title: 'ചാരിറ്റികൾ ബ്രൗസ് ചെയ്യുക',
        subtitle: 'മാറ്റം വരുത്തുന്ന പരിശോധിച്ച സംഘടനകൾ കണ്ടെത്തുക',
        noResults: 'നിങ്ങളുടെ മാനദണ്ഡങ്ങൾക്ക് അനുയോജ്യമായ ചാരിറ്റികൾ കണ്ടെത്തിയില്ല',
        clearFilters: 'ഫിൽട്ടറുകൾ മായ്‌ക്കുക',
        verified: 'പരിശോധിച്ചത്',
        rating: 'റേറ്റിംഗ്',
        donors: 'ദാതാക്കൾ',
        raised: 'ശേഖരിച്ചത്',
        donateNow: 'ഇപ്പോൾ സംഭാവന ചെയ്യുക'
      },
      donation: {
        amount: 'തുക',
        customAmount: 'കസ്റ്റം തുക',
        selectCharity: 'ചാരിറ്റി തിരഞ്ഞെടുക്കുക',
        paymentMethod: 'പേയ്‌മെന്റ് രീതി',
        donateButton: '₹{{amount}} സംഭാവന ചെയ്യുക',
        processing: 'പ്രോസസ്സ് ചെയ്യുന്നു...',
        success: 'നിങ്ങളുടെ സംഭാവനയ്ക്ക് നന്ദി!',
        failed: 'സംഭാവന പരാജയപ്പെട്ടു. വീണ്ടും ശ്രമിക്കുക.',
        receipt: 'രസീത് ഡൗൺലോഡ് ചെയ്യുക',
        taxBenefit: '80G പ്രകാരം നികുതി ആനുകൂല്യം',
        recurring: 'ഇത് പ്രതിമാസ സംഭാവനയാക്കുക'
      },
      auth: {
        login: {
          title: 'തിരികെ സ്വാഗതം',
          subtitle: 'നിങ്ങളുടെ അക്കൗണ്ടിലേക്ക് സൈൻ ഇൻ ചെയ്യുക',
          email: 'ഇമെയിൽ',
          password: 'പാസ്‌വേഡ്',
          forgotPassword: 'പാസ്‌വേഡ് മറന്നോ?',
          noAccount: 'അക്കൗണ്ട് ഇല്ലേ?',
          signUp: 'സൈൻ അപ്പ്'
        },
        register: {
          title: 'അക്കൗണ്ട് ഉണ്ടാക്കുക',
          subtitle: 'ദാതാക്കളുടെ കമ്മ്യൂണിറ്റിയിൽ ചേരുക',
          name: 'പൂർണ്ണ പേര്',
          email: 'ഇമെയിൽ',
          password: 'പാസ്‌വേഡ്',
          confirmPassword: 'പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക',
          phone: 'ഫോൺ നമ്പർ',
          role: 'എനിക്ക്',
          donor: 'ചാരിറ്റികൾക്ക് സംഭാവന ചെയ്യാൻ താല്പര്യമുണ്ട്',
          charity: 'എന്റെ ചാരിറ്റി രജിസ്റ്റർ ചെയ്യാൻ താല്പര്യമുണ്ട്',
          hasAccount: 'ഇതിനകം അക്കൗണ്ട് ഉണ്ടോ?',
          signIn: 'സൈൻ ഇൻ'
        },
        twoFactor: {
          title: '2-ഘടക പരിശോധന',
          subtitle: 'നിങ്ങളുടെ ഇമെയിലിലേക്ക് അയച്ച കോഡ് നൽകുക',
          code: 'പരിശോധന കോഡ്',
          verify: 'പരിശോധിക്കുക',
          resend: 'കോഡ് വീണ്ടും അയയ്ക്കുക'
        }
      },
      dashboard: {
        welcome: 'സ്വാഗതം, {{name}}!',
        totalDonated: 'ആകെ സംഭാവന',
        charitiesSupported: 'പിന്തുണച്ച ചാരിറ്റികൾ',
        taxSaved: 'ലാഭിച്ച നികുതി (80G)',
        recentActivity: 'സമീപകാല പ്രവർത്തനം',
        impactSummary: 'നിങ്ങളുടെ ഇംപാക്ട് സമ്മറി'
      },
      footer: {
        tagline: 'ഹൃദയങ്ങളെ ബന്ധിപ്പിക്കുന്നു, ജീവിതങ്ങളെ മാറ്റുന്നു.',
        quickLinks: 'ക്വിക്ക് ലിങ്കുകൾ',
        support: 'സപ്പോർട്ട്',
        legal: 'നിയമപരം',
        contact: 'ഞങ്ങളെ ബന്ധപ്പെടുക',
        privacy: 'സ്വകാര്യതാ നയം',
        terms: 'സേവന നിബന്ധനകൾ',
        faq: 'പതിവ് ചോദ്യങ്ങൾ',
        copyright: '© {{year}} DonateMatch. എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.'
      }
    }
  },
  // Punjabi (ਪੰਜਾਬੀ)
  pa: {
    translation: {
      common: {
        loading: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
        error: 'ਕੁਝ ਗਲਤ ਹੋ ਗਿਆ',
        retry: 'ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ',
        save: 'ਸੇਵ ਕਰੋ',
        cancel: 'ਰੱਦ ਕਰੋ',
        delete: 'ਮਿਟਾਓ',
        edit: 'ਸੋਧੋ',
        submit: 'ਜਮ੍ਹਾਂ ਕਰੋ',
        search: 'ਖੋਜੋ',
        filter: 'ਫਿਲਟਰ',
        sort: 'ਕ੍ਰਮਬੱਧ ਕਰੋ',
        viewAll: 'ਸਭ ਦੇਖੋ',
        learnMore: 'ਹੋਰ ਜਾਣੋ',
        seeMore: 'ਹੋਰ ਦੇਖੋ',
        back: 'ਪਿੱਛੇ',
        next: 'ਅੱਗੇ',
        previous: 'ਪਿਛਲਾ',
        close: 'ਬੰਦ ਕਰੋ',
        yes: 'ਹਾਂ',
        no: 'ਨਹੀਂ',
        or: 'ਜਾਂ'
      },
      nav: {
        home: 'ਹੋਮ',
        charities: 'ਚੈਰਿਟੀਜ਼',
        about: 'ਸਾਡੇ ਬਾਰੇ',
        login: 'ਲੌਗਇਨ',
        register: 'ਰਜਿਸਟਰ',
        dashboard: 'ਡੈਸ਼ਬੋਰਡ',
        profile: 'ਪ੍ਰੋਫਾਈਲ',
        donations: 'ਮੇਰੇ ਦਾਨ',
        logout: 'ਲੌਗਆਊਟ',
        campaigns: 'ਮੁਹਿੰਮਾਂ',
        forum: 'ਭਾਈਚਾਰਾ',
        volunteer: 'ਵਲੰਟੀਅਰ'
      },
      home: {
        hero: {
          title: 'ਹਰ ਦਾਨ ਨੂੰ ਸਾਰਥਕ ਬਣਾਓ',
          subtitle: 'AI-ਸੰਚਾਲਿਤ ਪਲੇਟਫਾਰਮ ਜੋ ਦਾਨੀਆਂ ਨੂੰ ਭਾਰਤ ਭਰ ਦੀਆਂ ਪ੍ਰਮਾਣਿਤ ਚੈਰਿਟੀਜ਼ ਨਾਲ ਜੋੜਦਾ ਹੈ',
          cta: 'ਦਾਨ ਕਰਨਾ ਸ਼ੁਰੂ ਕਰੋ',
          exploreCta: 'ਚੈਰਿਟੀਜ਼ ਖੋਜੋ'
        },
        stats: {
          donated: 'ਕੁੱਲ ਦਾਨ',
          donors: 'ਖੁਸ਼ ਦਾਨੀ',
          charities: 'ਪ੍ਰਮਾਣਿਤ ਚੈਰਿਟੀਜ਼',
          impact: 'ਪ੍ਰਭਾਵ ਦਰ'
        },
        trending: 'ਟ੍ਰੈਂਡਿੰਗ ਚੈਰਿਟੀਜ਼',
        recentDonations: 'ਹਾਲੀਆ ਦਾਨ',
        causes: 'ਕਾਰਨ ਖੋਜੋ'
      },
      charities: {
        title: 'ਚੈਰਿਟੀਜ਼ ਬ੍ਰਾਊਜ਼ ਕਰੋ',
        subtitle: 'ਬਦਲਾਅ ਲਿਆਉਣ ਵਾਲੀਆਂ ਪ੍ਰਮਾਣਿਤ ਸੰਸਥਾਵਾਂ ਲੱਭੋ',
        noResults: 'ਤੁਹਾਡੇ ਮਾਪਦੰਡਾਂ ਨਾਲ ਮੇਲ ਖਾਂਦੀ ਕੋਈ ਚੈਰਿਟੀ ਨਹੀਂ ਮਿਲੀ',
        clearFilters: 'ਫਿਲਟਰ ਸਾਫ਼ ਕਰੋ',
        verified: 'ਪ੍ਰਮਾਣਿਤ',
        rating: 'ਰੇਟਿੰਗ',
        donors: 'ਦਾਨੀ',
        raised: 'ਇਕੱਠਾ ਕੀਤਾ',
        donateNow: 'ਹੁਣੇ ਦਾਨ ਕਰੋ'
      },
      donation: {
        amount: 'ਰਕਮ',
        customAmount: 'ਕਸਟਮ ਰਕਮ',
        selectCharity: 'ਚੈਰਿਟੀ ਚੁਣੋ',
        paymentMethod: 'ਭੁਗਤਾਨ ਢੰਗ',
        donateButton: '₹{{amount}} ਦਾਨ ਕਰੋ',
        processing: 'ਪ੍ਰੋਸੈਸ ਹੋ ਰਿਹਾ ਹੈ...',
        success: 'ਤੁਹਾਡੇ ਦਾਨ ਲਈ ਧੰਨਵਾਦ!',
        failed: 'ਦਾਨ ਅਸਫਲ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
        receipt: 'ਰਸੀਦ ਡਾਊਨਲੋਡ ਕਰੋ',
        taxBenefit: '80G ਅਧੀਨ ਟੈਕਸ ਲਾਭ',
        recurring: 'ਇਸਨੂੰ ਮਾਸਿਕ ਦਾਨ ਬਣਾਓ'
      },
      auth: {
        login: {
          title: 'ਵਾਪਸ ਸਵਾਗਤ ਹੈ',
          subtitle: 'ਆਪਣੇ ਖਾਤੇ ਵਿੱਚ ਸਾਈਨ ਇਨ ਕਰੋ',
          email: 'ਈਮੇਲ',
          password: 'ਪਾਸਵਰਡ',
          forgotPassword: 'ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?',
          noAccount: 'ਖਾਤਾ ਨਹੀਂ ਹੈ?',
          signUp: 'ਸਾਈਨ ਅੱਪ'
        },
        register: {
          title: 'ਖਾਤਾ ਬਣਾਓ',
          subtitle: 'ਦਾਨੀਆਂ ਦੇ ਭਾਈਚਾਰੇ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ',
          name: 'ਪੂਰਾ ਨਾਮ',
          email: 'ਈਮੇਲ',
          password: 'ਪਾਸਵਰਡ',
          confirmPassword: 'ਪਾਸਵਰਡ ਪੁਸ਼ਟੀ ਕਰੋ',
          phone: 'ਫ਼ੋਨ ਨੰਬਰ',
          role: 'ਮੈਂ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ',
          donor: 'ਚੈਰਿਟੀਜ਼ ਨੂੰ ਦਾਨ ਕਰਨਾ',
          charity: 'ਆਪਣੀ ਚੈਰਿਟੀ ਰਜਿਸਟਰ ਕਰਨਾ',
          hasAccount: 'ਪਹਿਲਾਂ ਹੀ ਖਾਤਾ ਹੈ?',
          signIn: 'ਸਾਈਨ ਇਨ'
        },
        twoFactor: {
          title: '2-ਫੈਕਟਰ ਪ੍ਰਮਾਣਿਕਤਾ',
          subtitle: 'ਤੁਹਾਡੀ ਈਮੇਲ ਤੇ ਭੇਜਿਆ ਕੋਡ ਦਾਖਲ ਕਰੋ',
          code: 'ਪੁਸ਼ਟੀ ਕੋਡ',
          verify: 'ਪੁਸ਼ਟੀ ਕਰੋ',
          resend: 'ਕੋਡ ਦੁਬਾਰਾ ਭੇਜੋ'
        }
      },
      dashboard: {
        welcome: 'ਸਵਾਗਤ ਹੈ, {{name}}!',
        totalDonated: 'ਕੁੱਲ ਦਾਨ',
        charitiesSupported: 'ਸਮਰਥਿਤ ਚੈਰਿਟੀਜ਼',
        taxSaved: 'ਬਚਾਇਆ ਟੈਕਸ (80G)',
        recentActivity: 'ਹਾਲੀਆ ਗਤੀਵਿਧੀ',
        impactSummary: 'ਤੁਹਾਡਾ ਪ੍ਰਭਾਵ ਸਾਰ'
      },
      footer: {
        tagline: 'ਦਿਲਾਂ ਨੂੰ ਜੋੜਨਾ, ਜ਼ਿੰਦਗੀਆਂ ਬਦਲਣਾ।',
        quickLinks: 'ਤੁਰੰਤ ਲਿੰਕ',
        support: 'ਸਹਾਇਤਾ',
        legal: 'ਕਾਨੂੰਨੀ',
        contact: 'ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ',
        privacy: 'ਗੋਪਨੀਯਤਾ ਨੀਤੀ',
        terms: 'ਸੇਵਾ ਦੀਆਂ ਸ਼ਰਤਾਂ',
        faq: 'ਅਕਸਰ ਪੁੱਛੇ ਜਾਂਦੇ ਸਵਾਲ',
        copyright: '© {{year}} DonateMatch. ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ।'
      }
    }
  },
  // Odia (ଓଡ଼ିଆ)
  or: {
    translation: {
      common: {
        loading: 'ଲୋଡ୍ ହେଉଛି...',
        error: 'କିଛି ଭୁଲ ହୋଇଗଲା',
        retry: 'ପୁନଃଚେଷ୍ଟା କରନ୍ତୁ',
        save: 'ସେଭ୍ କରନ୍ତୁ',
        cancel: 'ବାତିଲ୍ କରନ୍ତୁ',
        delete: 'ବିଲୋପ କରନ୍ତୁ',
        edit: 'ସମ୍ପାଦନା କରନ୍ତୁ',
        submit: 'ଦାଖଲ କରନ୍ତୁ',
        search: 'ଖୋଜନ୍ତୁ',
        filter: 'ଫିଲ୍ଟର୍',
        sort: 'କ୍ରମବଦ୍ଧ କରନ୍ତୁ',
        viewAll: 'ସମସ୍ତ ଦେଖନ୍ତୁ',
        learnMore: 'ଅଧିକ ଜାଣନ୍ତୁ',
        seeMore: 'ଅଧିକ ଦେଖନ୍ତୁ',
        back: 'ପଛକୁ',
        next: 'ପରବର୍ତ୍ତୀ',
        previous: 'ପୂର୍ବବର୍ତ୍ତୀ',
        close: 'ବନ୍ଦ କରନ୍ତୁ',
        yes: 'ହଁ',
        no: 'ନା',
        or: 'ବା'
      },
      nav: {
        home: 'ହୋମ୍',
        charities: 'ଚାରିଟି',
        about: 'ଆମ ବିଷୟରେ',
        login: 'ଲଗଇନ୍',
        register: 'ପଞ୍ଜୀକରଣ',
        dashboard: 'ଡ୍ୟାସବୋର୍ଡ',
        profile: 'ପ୍ରୋଫାଇଲ୍',
        donations: 'ମୋର ଦାନ',
        logout: 'ଲଗଆଉଟ୍',
        campaigns: 'ଅଭିଯାନ',
        forum: 'ସମ୍ପ୍ରଦାୟ',
        volunteer: 'ସ୍ୱେଚ୍ଛାସେବୀ'
      },
      home: {
        hero: {
          title: 'ପ୍ରତ୍ୟେକ ଦାନକୁ ମୂଲ୍ୟବାନ କରନ୍ତୁ',
          subtitle: 'ଭାରତବ୍ୟାପୀ ଯାଞ୍ଚକୃତ ଚାରିଟିମାନଙ୍କ ସହ ଦାତାମାନଙ୍କୁ ସଂଯୁକ୍ତ କରୁଥିବା AI-ଚାଳିତ ପ୍ଲାଟଫର୍ମ',
          cta: 'ଦାନ କରିବା ଆରମ୍ଭ କରନ୍ତୁ',
          exploreCta: 'ଚାରିଟି ଅନୁସନ୍ଧାନ କରନ୍ତୁ'
        },
        stats: {
          donated: 'ମୋଟ ଦାନ',
          donors: 'ଖୁସି ଦାତା',
          charities: 'ଯାଞ୍ଚକୃତ ଚାରିଟି',
          impact: 'ପ୍ରଭାବ ହାର'
        },
        trending: 'ଟ୍ରେଣ୍ଡିଂ ଚାରିଟି',
        recentDonations: 'ସାମ୍ପ୍ରତିକ ଦାନ',
        causes: 'କାରଣ ଅନୁସନ୍ଧାନ କରନ୍ତୁ'
      },
      charities: {
        title: 'ଚାରିଟି ବ୍ରାଉଜ୍ କରନ୍ତୁ',
        subtitle: 'ପରିବର୍ତ୍ତନ ଆଣୁଥିବା ଯାଞ୍ଚକୃତ ସଂଗଠନ ଖୋଜନ୍ତୁ',
        noResults: 'ଆପଣଙ୍କ ମାନଦଣ୍ଡ ସହ ମେଳ ଖାଉଥିବା ଚାରିଟି ମିଳିଲା ନାହିଁ',
        clearFilters: 'ଫିଲ୍ଟର୍ ସଫା କରନ୍ତୁ',
        verified: 'ଯାଞ୍ଚକୃତ',
        rating: 'ରେଟିଂ',
        donors: 'ଦାତା',
        raised: 'ସଂଗୃହିତ',
        donateNow: 'ବର୍ତ୍ତମାନ ଦାନ କରନ୍ତୁ'
      },
      donation: {
        amount: 'ରାଶି',
        customAmount: 'କଷ୍ଟମ୍ ରାଶି',
        selectCharity: 'ଚାରିଟି ଚୟନ କରନ୍ତୁ',
        paymentMethod: 'ପେମେଣ୍ଟ ପଦ୍ଧତି',
        donateButton: '₹{{amount}} ଦାନ କରନ୍ତୁ',
        processing: 'ପ୍ରକ୍ରିୟାକରଣ...',
        success: 'ଆପଣଙ୍କ ଦାନ ପାଇଁ ଧନ୍ୟବାଦ!',
        failed: 'ଦାନ ବିଫଳ। ଦୟାକରି ପୁନଃଚେଷ୍ଟା କରନ୍ତୁ।',
        receipt: 'ରସିଦ ଡାଉନଲୋଡ୍ କରନ୍ତୁ',
        taxBenefit: '80G ଅଧୀନରେ ଟ୍ୟାକ୍ସ ସୁବିଧା',
        recurring: 'ଏହାକୁ ମାସିକ ଦାନ କରନ୍ତୁ'
      },
      auth: {
        login: {
          title: 'ପୁଣି ସ୍ୱାଗତ',
          subtitle: 'ଆପଣଙ୍କ ଖାତାରେ ସାଇନ୍ ଇନ୍ କରନ୍ତୁ',
          email: 'ଇମେଲ୍',
          password: 'ପାସୱାର୍ଡ',
          forgotPassword: 'ପାସୱାର୍ଡ ଭୁଲିଗଲେ?',
          noAccount: 'ଖାତା ନାହିଁ?',
          signUp: 'ସାଇନ୍ ଅପ୍'
        },
        register: {
          title: 'ଖାତା ସୃଷ୍ଟି କରନ୍ତୁ',
          subtitle: 'ଦାତାମାନଙ୍କ ସମ୍ପ୍ରଦାୟରେ ଯୋଗ ଦିଅନ୍ତୁ',
          name: 'ପୂର୍ଣ୍ଣ ନାମ',
          email: 'ଇମେଲ୍',
          password: 'ପାସୱାର୍ଡ',
          confirmPassword: 'ପାସୱାର୍ଡ ନିଶ୍ଚିତ କରନ୍ତୁ',
          phone: 'ଫୋନ୍ ନମ୍ବର',
          role: 'ମୁଁ ଚାହେଁ',
          donor: 'ଚାରିଟିକୁ ଦାନ କରିବାକୁ',
          charity: 'ମୋର ଚାରିଟି ପଞ୍ଜୀକରଣ କରିବାକୁ',
          hasAccount: 'ପୂର୍ବରୁ ଖାତା ଅଛି?',
          signIn: 'ସାଇନ୍ ଇନ୍'
        },
        twoFactor: {
          title: '2-ଫ୍ୟାକ୍ଟର ପ୍ରମାଣୀକରଣ',
          subtitle: 'ଆପଣଙ୍କ ଇମେଲରେ ପଠାଯାଇଥିବା କୋଡ୍ ପ୍ରବେଶ କରନ୍ତୁ',
          code: 'ଯାଞ୍ଚ କୋଡ୍',
          verify: 'ଯାଞ୍ଚ କରନ୍ତୁ',
          resend: 'କୋଡ୍ ପୁନଃ ପଠାନ୍ତୁ'
        }
      },
      dashboard: {
        welcome: 'ସ୍ୱାଗତ, {{name}}!',
        totalDonated: 'ମୋଟ ଦାନ',
        charitiesSupported: 'ସମର୍ଥିତ ଚାରିଟି',
        taxSaved: 'ସଞ୍ଚିତ ଟ୍ୟାକ୍ସ (80G)',
        recentActivity: 'ସାମ୍ପ୍ରତିକ କାର୍ଯ୍ୟକଳାପ',
        impactSummary: 'ଆପଣଙ୍କ ପ୍ରଭାବ ସାରାଂଶ'
      },
      footer: {
        tagline: 'ହୃଦୟ ସଂଯୋଗ କରିବା, ଜୀବନ ବଦଳାଇବା।',
        quickLinks: 'ଦ୍ରୁତ ଲିଙ୍କ',
        support: 'ସମର୍ଥନ',
        legal: 'ଆଇନଗତ',
        contact: 'ଆମ ସହ ଯୋଗାଯୋଗ କରନ୍ତୁ',
        privacy: 'ଗୋପନୀୟତା ନୀତି',
        terms: 'ସେବା ସର୍ତ୍ତାବଳୀ',
        faq: 'ବାରମ୍ବାର ପଚରାଯାଉଥିବା ପ୍ରଶ୍ନ',
        copyright: '© {{year}} DonateMatch। ସମସ୍ତ ଅଧିକାର ସଂରକ୍ଷିତ।'
      }
    }
  },
  // Assamese (অসমীয়া)
  as: {
    translation: {
      common: {
        loading: 'লোড হৈ আছে...',
        error: 'কিবা ভুল হ\'ল',
        retry: 'পুনৰ চেষ্টা কৰক',
        save: 'সংৰক্ষণ কৰক',
        cancel: 'বাতিল কৰক',
        delete: 'মচক',
        edit: 'সম্পাদনা কৰক',
        submit: 'দাখিল কৰক',
        search: 'সন্ধান কৰক',
        filter: 'ফিল্টাৰ',
        sort: 'ক্ৰমবদ্ধ কৰক',
        viewAll: 'সকলো চাওক',
        learnMore: 'অধিক জানক',
        seeMore: 'অধিক চাওক',
        back: 'পিছলৈ',
        next: 'পৰৱৰ্তী',
        previous: 'পূৰ্বৱৰ্তী',
        close: 'বন্ধ কৰক',
        yes: 'হয়',
        no: 'নহয়',
        or: 'বা'
      },
      nav: {
        home: 'হোম',
        charities: 'দাতব্য সংস্থা',
        about: 'আমাৰ বিষয়ে',
        login: 'লগইন',
        register: 'পঞ্জীয়ন',
        dashboard: 'ডেশ্ববৰ্ড',
        profile: 'প্ৰফাইল',
        donations: 'মোৰ দান',
        logout: 'লগআউট',
        campaigns: 'অভিযান',
        forum: 'সম্প্ৰদায়',
        volunteer: 'স্বেচ্ছাসেৱক'
      },
      home: {
        hero: {
          title: 'প্ৰতিটো দান মূল্যৱান কৰক',
          subtitle: 'AI-চালিত মঞ্চ যি দাতাসকলক সমগ্ৰ ভাৰতৰ প্ৰমাণিত দাতব্য সংস্থাসমূহৰ সৈতে সংযোগ কৰে',
          cta: 'দান কৰা আৰম্ভ কৰক',
          exploreCta: 'দাতব্য সংস্থা অন্বেষণ কৰক'
        },
        stats: {
          donated: 'মুঠ দান',
          donors: 'সুখী দাতা',
          charities: 'প্ৰমাণিত সংস্থা',
          impact: 'প্ৰভাৱ হাৰ'
        },
        trending: 'ট্ৰেণ্ডিং সংস্থা',
        recentDonations: 'শেহতীয়া দান',
        causes: 'কাৰণ অন্বেষণ কৰক'
      },
      charities: {
        title: 'দাতব্য সংস্থা ব্ৰাউজ কৰক',
        subtitle: 'পৰিৱৰ্তন আনি থকা প্ৰমাণিত সংস্থা বিচাৰক',
        noResults: 'আপোনাৰ মাপকাঠিৰ সৈতে মিল থকা কোনো সংস্থা পোৱা নগ\'ল',
        clearFilters: 'ফিল্টাৰ পৰিষ্কাৰ কৰক',
        verified: 'প্ৰমাণিত',
        rating: 'ৰেটিং',
        donors: 'দাতা',
        raised: 'সংগৃহীত',
        donateNow: 'এতিয়াই দান কৰক'
      },
      donation: {
        amount: 'পৰিমাণ',
        customAmount: 'কাষ্টম পৰিমাণ',
        selectCharity: 'সংস্থা বাছনি কৰক',
        paymentMethod: 'পেমেণ্ট পদ্ধতি',
        donateButton: '₹{{amount}} দান কৰক',
        processing: 'প্ৰক্ৰিয়াকৰণ...',
        success: 'আপোনাৰ দানৰ বাবে ধন্যবাদ!',
        failed: 'দান বিফল হ\'ল। পুনৰ চেষ্টা কৰক।',
        receipt: 'ৰচিদ ডাউনলোড কৰক',
        taxBenefit: '80G অধীনত কৰ সুবিধা',
        recurring: 'ইয়াক মাহিলী দান কৰক'
      },
      auth: {
        login: {
          title: 'পুনৰ স্বাগতম',
          subtitle: 'আপোনাৰ একাউণ্টত চাইন ইন কৰক',
          email: 'ইমেইল',
          password: 'পাছৱৰ্ড',
          forgotPassword: 'পাছৱৰ্ড পাহৰিলে?',
          noAccount: 'একাউণ্ট নাই?',
          signUp: 'চাইন আপ'
        },
        register: {
          title: 'একাউণ্ট সৃষ্টি কৰক',
          subtitle: 'দাতাসকলৰ সম্প্ৰদায়ত যোগদান কৰক',
          name: 'সম্পূৰ্ণ নাম',
          email: 'ইমেইল',
          password: 'পাছৱৰ্ড',
          confirmPassword: 'পাছৱৰ্ড নিশ্চিত কৰক',
          phone: 'ফোন নম্বৰ',
          role: 'মই বিচাৰো',
          donor: 'দাতব্য সংস্থালৈ দান কৰিব',
          charity: 'মোৰ দাতব্য সংস্থা পঞ্জীয়ন কৰিব',
          hasAccount: 'ইতিমধ্যে একাউণ্ট আছে?',
          signIn: 'চাইন ইন'
        },
        twoFactor: {
          title: '২-ফেক্টৰ প্ৰমাণীকৰণ',
          subtitle: 'আপোনাৰ ইমেইলত পঠোৱা ক\'ড প্ৰবেশ কৰক',
          code: 'প্ৰমাণীকৰণ ক\'ড',
          verify: 'প্ৰমাণিত কৰক',
          resend: 'ক\'ড পুনৰ পঠাওক'
        }
      },
      dashboard: {
        welcome: 'স্বাগতম, {{name}}!',
        totalDonated: 'মুঠ দান',
        charitiesSupported: 'সমৰ্থিত সংস্থা',
        taxSaved: 'সঞ্চিত কৰ (80G)',
        recentActivity: 'শেহতীয়া কাৰ্যকলাপ',
        impactSummary: 'আপোনাৰ প্ৰভাৱ সাৰাংশ'
      },
      footer: {
        tagline: 'হৃদয় সংযোগ কৰা, জীৱন সলনি কৰা।',
        quickLinks: 'দ্ৰুত লিংক',
        support: 'সমৰ্থন',
        legal: 'আইনী',
        contact: 'আমাৰ সৈতে যোগাযোগ কৰক',
        privacy: 'গোপনীয়তা নীতি',
        terms: 'সেৱাৰ চৰ্তাৱলী',
        faq: 'সঘনাই সোধা প্ৰশ্ন',
        copyright: '© {{year}} DonateMatch। সকলো অধিকাৰ সংৰক্ষিত।'
      }
    }
  },
  // Urdu (اردو)
  ur: {
    translation: {
      common: {
        loading: 'لوڈ ہو رہا ہے...',
        error: 'کچھ غلط ہو گیا',
        retry: 'دوبارہ کوشش کریں',
        save: 'محفوظ کریں',
        cancel: 'منسوخ کریں',
        delete: 'حذف کریں',
        edit: 'ترمیم کریں',
        submit: 'جمع کریں',
        search: 'تلاش کریں',
        filter: 'فلٹر',
        sort: 'ترتیب دیں',
        viewAll: 'سب دیکھیں',
        learnMore: 'مزید جانیں',
        seeMore: 'مزید دیکھیں',
        back: 'واپس',
        next: 'اگلا',
        previous: 'پچھلا',
        close: 'بند کریں',
        yes: 'ہاں',
        no: 'نہیں',
        or: 'یا'
      },
      nav: {
        home: 'ہوم',
        charities: 'خیراتی ادارے',
        about: 'ہمارے بارے میں',
        login: 'لاگ ان',
        register: 'رجسٹر',
        dashboard: 'ڈیش بورڈ',
        profile: 'پروفائل',
        donations: 'میرے عطیات',
        logout: 'لاگ آؤٹ',
        campaigns: 'مہمات',
        forum: 'کمیونٹی',
        volunteer: 'رضاکار'
      },
      home: {
        hero: {
          title: 'ہر عطیہ کو قیمتی بنائیں',
          subtitle: 'AI سے چلنے والا پلیٹ فارم جو عطیہ دہندگان کو پورے بھارت میں تصدیق شدہ خیراتی اداروں سے جوڑتا ہے',
          cta: 'عطیہ دینا شروع کریں',
          exploreCta: 'خیراتی ادارے تلاش کریں'
        },
        stats: {
          donated: 'کل عطیات',
          donors: 'خوش عطیہ دہندگان',
          charities: 'تصدیق شدہ ادارے',
          impact: 'اثر کی شرح'
        },
        trending: 'ٹرینڈنگ ادارے',
        recentDonations: 'حالیہ عطیات',
        causes: 'مقاصد تلاش کریں'
      },
      charities: {
        title: 'خیراتی ادارے براؤز کریں',
        subtitle: 'تبدیلی لانے والے تصدیق شدہ ادارے تلاش کریں',
        noResults: 'آپ کے معیار سے مماثل کوئی ادارہ نہیں ملا',
        clearFilters: 'فلٹر صاف کریں',
        verified: 'تصدیق شدہ',
        rating: 'ریٹنگ',
        donors: 'عطیہ دہندگان',
        raised: 'جمع شدہ',
        donateNow: 'ابھی عطیہ دیں'
      },
      donation: {
        amount: 'رقم',
        customAmount: 'حسب ضرورت رقم',
        selectCharity: 'ادارہ منتخب کریں',
        paymentMethod: 'ادائیگی کا طریقہ',
        donateButton: '₹{{amount}} عطیہ دیں',
        processing: 'پروسیسنگ...',
        success: 'آپ کے عطیے کا شکریہ!',
        failed: 'عطیہ ناکام۔ دوبارہ کوشش کریں۔',
        receipt: 'رسید ڈاؤن لوڈ کریں',
        taxBenefit: '80G کے تحت ٹیکس فائدہ',
        recurring: 'اسے ماہانہ عطیہ بنائیں'
      },
      auth: {
        login: {
          title: 'خوش آمدید',
          subtitle: 'اپنے اکاؤنٹ میں سائن ان کریں',
          email: 'ای میل',
          password: 'پاس ورڈ',
          forgotPassword: 'پاس ورڈ بھول گئے؟',
          noAccount: 'اکاؤنٹ نہیں ہے؟',
          signUp: 'سائن اپ'
        },
        register: {
          title: 'اکاؤنٹ بنائیں',
          subtitle: 'عطیہ دہندگان کی کمیونٹی میں شامل ہوں',
          name: 'پورا نام',
          email: 'ای میل',
          password: 'پاس ورڈ',
          confirmPassword: 'پاس ورڈ کی تصدیق کریں',
          phone: 'فون نمبر',
          role: 'میں چاہتا/چاہتی ہوں',
          donor: 'خیراتی اداروں کو عطیہ دینا',
          charity: 'اپنا خیراتی ادارہ رجسٹر کرنا',
          hasAccount: 'پہلے سے اکاؤنٹ ہے؟',
          signIn: 'سائن ان'
        },
        twoFactor: {
          title: '2-فیکٹر تصدیق',
          subtitle: 'اپنے ای میل پر بھیجا گیا کوڈ درج کریں',
          code: 'تصدیقی کوڈ',
          verify: 'تصدیق کریں',
          resend: 'کوڈ دوبارہ بھیجیں'
        }
      },
      dashboard: {
        welcome: 'خوش آمدید، {{name}}!',
        totalDonated: 'کل عطیات',
        charitiesSupported: 'معاون ادارے',
        taxSaved: 'بچایا گیا ٹیکس (80G)',
        recentActivity: 'حالیہ سرگرمی',
        impactSummary: 'آپ کے اثرات کا خلاصہ'
      },
      footer: {
        tagline: 'دلوں کو جوڑنا، زندگیاں بدلنا۔',
        quickLinks: 'فوری لنکس',
        support: 'سپورٹ',
        legal: 'قانونی',
        contact: 'ہم سے رابطہ کریں',
        privacy: 'پرائیویسی پالیسی',
        terms: 'سروس کی شرائط',
        faq: 'اکثر پوچھے گئے سوالات',
        copyright: '© {{year}} DonateMatch۔ جملہ حقوق محفوظ ہیں۔'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;
