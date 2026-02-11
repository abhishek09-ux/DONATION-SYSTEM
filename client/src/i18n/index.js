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
