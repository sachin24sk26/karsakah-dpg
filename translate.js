// Centralized translation configuration
const translations = {
    en: {
        nav_home: "Home",
        nav_crop: "Crop Identification",
        nav_prices: "Live Market Prices",
        nav_schemes: "Gov Schemes",
        nav_contacts: "Contacts",
        my_account: "My Account",
        my_profile: "My Profile",
        settings: "Settings",
        history: "History",
        logout: "Log Out",
        
        // Prices specific
        page_title: "Live Mandi Prices",
        page_subtitle: "Real-time agricultural commodity prices across India from AGMARKNET.",
        powered_by: "Powered by Data.gov.in (AGMARKNET API)",
        label_state: "Select State",
        option_all_states: "All States",
        label_commodity: "Select Commodity",
        option_all_commodities: "All Commodities",
        btn_search: "Search Prices",
        th_commodity: "Commodity",
        th_state: "State",
        th_market: "Market (Mandi)",
        th_min_price: "Min Price (₹/Quintal)",
        th_max_price: "Max Price (₹/Quintal)",
        th_modal_price: "Modal Price (₹)",
        th_date: "Date",
        loading: "Fetching live prices...",
        no_data: "No data found for the selected filters.",
        
        // Weather specific
        weather_page_title: "Climatic Conditions",
        weather_page_subtitle: "Real-time weather, soil moisture estimates, and rain forecast.",
        weather_btn_search: "Search Location",
        weather_loading: "Fetching weather data..."
    },
    hi: {
        nav_home: "मुख्य पृष्ठ",
        nav_crop: "फसल की पहचान",
        nav_prices: "लाइव बाजार भाव",
        nav_schemes: "सरकारी योजनाएं",
        nav_contacts: "संपर्क",
        my_account: "मेरा खाता",
        my_profile: "मेरी प्रोफ़ाइल",
        settings: "सेटिंग्स",
        history: "इतिहास",
        logout: "लॉग आउट",
        
        // Prices specific
        page_title: "लाइव मंडी भाव",
        page_subtitle: "एगमार्कनेट से पूरे भारत में रियल-टाइम कृषि जिंस कीमतें।",
        powered_by: "Data.gov.in द्वारा संचालित (AGMARKNET API)",
        label_state: "राज्य चुनें",
        option_all_states: "सभी राज्य",
        label_commodity: "फसल/जिंस चुनें",
        option_all_commodities: "सभी फसलें",
        btn_search: "भाव खोजें",
        th_commodity: "फसल (Commodity)",
        th_state: "राज्य",
        th_market: "मंडी",
        th_min_price: "न्यूनतम भाव (₹/क्विंटल)",
        th_max_price: "अधिकतम भाव (₹/क्विंटल)",
        th_modal_price: "औसत भाव (₹)",
        th_date: "तारीख",
        loading: "लाइव भाव प्राप्त किए जा रहे हैं...",
        no_data: "चयनित फिल्टर के लिए कोई डेटा नहीं मिला।",
        
        // Weather specific
        weather_page_title: "जलवायु की स्थिति",
        weather_page_subtitle: "वास्तविक समय का मौसम, मिट्टी की नमी का अनुमान और बारिश का पूर्वानुमान।",
        weather_btn_search: "स्थान खोजें",
        weather_loading: "मौसम का डेटा प्राप्त किया जा रहा है..."
    },
    mr: {
        nav_home: "मुखपृष्ठ",
        nav_crop: "पिकाची ओळख",
        nav_prices: "थेट बाजार भाव",
        nav_schemes: "सरकारी योजना",
        nav_contacts: "संपर्क",
        my_account: "माझे खाते",
        my_profile: "माझी प्रोफाईल",
        settings: "सेटिंग्ज",
        history: "इतिहास",
        logout: "लॉग आउट",
        
        // Prices specific
        page_title: "थेट बाजार (मंडी) भाव",
        page_subtitle: "अॅगमार्कनेट वरून संपूर्ण भारतातील रिअल-टाइम कृषी मालाच्या किमती.",
        powered_by: "Data.gov.in द्वारा समर्थित (AGMARKNET API)",
        label_state: "राज्य निवडा",
        option_all_states: "सर्व राज्ये",
        label_commodity: "पीक/माल निवडा",
        option_all_commodities: "सर्व पिके",
        btn_search: "भाव शोधा",
        th_commodity: "पीक",
        th_state: "राज्य",
        th_market: "बाजार (मंडी)",
        th_min_price: "किमान भाव (₹/क्विंटल)",
        th_max_price: "कमाल भाव (₹/क्विंटल)",
        th_modal_price: "सरासरी भाव (₹)",
        th_date: "तारीख",
        loading: "थेट भाव मिळवत आहे...",
        no_data: "निवडलेल्या फिल्टरसाठी कोणताही डेटा आढळला नाही.",
        
        // Weather specific
        weather_page_title: "हवामानाची परिस्थिती",
        weather_page_subtitle: "रिअल-टाइम हवामान, मातीतील ओलावा अंदाज आणि पावसाचा अंदाज.",
        weather_btn_search: "स्थान शोधा",
        weather_loading: "हवामानाचा डेटा मिळवत आहे..."
    },
    pa: {
        nav_home: "ਮੁੱਖ ਪੰਨਾ",
        nav_crop: "ਫ਼ਸਲ ਦੀ ਪਛਾਣ",
        nav_prices: "ਲਾਈਵ ਬਜ਼ਾਰ ਦੀਆਂ ਕੀਮਤਾਂ",
        nav_schemes: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ",
        nav_contacts: "ਸੰਪਰਕ",
        my_account: "ਮੇਰਾ ਖਾਤਾ",
        my_profile: "ਮੇਰੀ ਪ੍ਰੋਫਾਈਲ",
        settings: "ਸੈਟਿੰਗਾਂ",
        history: "ਇਤਿਹਾਸ",
        logout: "ਲੌਗ ਆਉਟ",
        
        // Prices specific
        page_title: "ਲਾਈਵ ਮੰਡੀ ਦੀਆਂ ਕੀਮਤਾਂ",
        page_subtitle: "AGMARKNET ਤੋਂ ਪੂਰੇ ਭਾਰਤ ਵਿੱਚ ਰੀਅਲ-ਟਾਈਮ ਖੇਤੀਬਾੜੀ ਵਸਤੂਆਂ ਦੀਆਂ ਕੀਮਤਾਂ।",
        powered_by: "Data.gov.in (AGMARKNET API) ਦੁਆਰਾ ਸੰਚਾਲਿਤ",
        label_state: "ਰਾਜ ਚੁਣੋ",
        option_all_states: "ਸਾਰੇ ਰਾਜ",
        label_commodity: "ਵਸਤੂ ਚੁਣੋ",
        option_all_commodities: "ਸਾਰੀਆਂ ਵਸਤੂਆਂ",
        btn_search: "ਕੀਮਤਾਂ ਲੱਭੋ",
        th_commodity: "ਵਸਤੂ",
        th_state: "ਰਾਜ",
        th_market: "ਮਾਰਕੀਟ (ਮੰਡੀ)",
        th_min_price: "ਘੱਟੋ-ਘੱਟ ਕੀਮਤ (₹/ਕੁਇੰਟਲ)",
        th_max_price: "ਵੱਧ ਤੋਂ ਵੱਧ ਕੀਮਤ (₹/ਕੁਇੰਟਲ)",
        th_modal_price: "ਔਸਤ ਕੀਮਤ (₹)",
        th_date: "ਤਾਰੀਖ",
        loading: "ਲਾਈਵ ਕੀਮਤਾਂ ਲਿਆਂਦੀਆਂ ਜਾ ਰਹੀਆਂ ਹਨ...",
        no_data: "ਚੁਣੇ ਫਿਲਟਰਾਂ ਲਈ ਕੋਈ ਡੇਟਾ ਨਹੀਂ ਮਿਲਿਆ।",
        
        // Weather specific
        weather_page_title: "ਮੌਸਮੀ ਹਾਲਾਤ",
        weather_page_subtitle: "ਰੀਅਲ-ਟਾਈਮ ਮੌਸਮ, ਮਿੱਟੀ ਦੀ ਨਮੀ ਦਾ ਅਨੁਮਾਨ, ਅਤੇ ਮੀਂਹ ਦੀ ਭਵਿੱਖਬਾਣੀ।",
        weather_btn_search: "ਸਥਾਨ ਖੋਜੋ",
        weather_loading: "ਮੌਸਮ ਦਾ ਡੇਟਾ ਲਿਆਂਦਾ ਜਾ ਰਿਹਾ ਹੈ..."
    }
};

function updateLanguage(lang) {
    const texts = translations[lang];
    if (!texts) return;

    // Update Elements with data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (texts[key]) {
            el.textContent = texts[key];
        }
    });
    
    // Save to localStorage so it persists across pages
    localStorage.setItem('karsakah_lang', lang);
}

document.addEventListener('DOMContentLoaded', () => {
    const langSelect = document.getElementById('lang-select');
    
    // Check if we have a saved language preference
    const savedLang = localStorage.getItem('karsakah_lang') || 'en';
    
    if (langSelect) {
        langSelect.value = savedLang;
        langSelect.addEventListener('change', (e) => {
            updateLanguage(e.target.value);
        });
    }
    
    // Initial translation translation
    updateLanguage(savedLang);
});
