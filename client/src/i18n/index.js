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
