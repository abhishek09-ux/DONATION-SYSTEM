import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Initialize i18n with basic configuration
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          // Add translations here as needed
          welcome: 'Welcome',
          donate: 'Donate',
          campaigns: 'Campaigns',
          charities: 'Charities',
          giftCards: 'Gift Cards',
          login: 'Login',
          register: 'Register',
          search: 'Search',
          loading: 'Loading...',
          noResults: 'No results found',
        }
      },
      hi: {
        translation: {
          welcome: 'स्वागत',
          donate: 'दान करें',
          campaigns: 'अभियान',
          charities: 'चैरिटी',
          giftCards: 'गिफ्ट कार्ड',
          login: 'लॉगिन',
          register: 'रजिस्टर',
          search: 'खोजें',
          loading: 'लोड हो रहा है...',
          noResults: 'कोई परिणाम नहीं मिला',
        }
      }
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already safes from xss
    }
  });

export default i18n;
