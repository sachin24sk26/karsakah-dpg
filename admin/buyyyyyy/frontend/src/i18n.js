import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    resources: {
      en: {
        translation: {
          "navbar.marketplace": "Marketplace",
          "navbar.login": "Login / Register",
          "dashboard.weather": "Local Weather",
          "dashboard.alerts": "Advisory Alerts"
        }
      },
      hi: {
        translation: {
          "navbar.marketplace": "बाज़ार (Marketplace)",
          "navbar.login": "लॉग इन / रजिस्टर",
          "dashboard.weather": "स्थानीय मौसम",
          "dashboard.alerts": "सलाहकार अलर्ट"
        }
      }
    },
    interpolation: {
      escapeValue: false, 
    }
  });

export default i18n;
