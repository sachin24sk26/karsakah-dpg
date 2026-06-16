// Google Translate Initialization
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,hi,mr,pa,bn,te,ta,kn,ml,ur', // Added new languages
        autoDisplay: false
    }, 'google_translate_element');
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject the hidden Google Translate div if it doesn't exist
    if (!document.getElementById('google_translate_element')) {
        const gtDiv = document.createElement('div');
        gtDiv.id = 'google_translate_element';
        gtDiv.style.position = 'absolute';
        gtDiv.style.left = '-9999px';
        gtDiv.style.top = '-9999px';
        gtDiv.style.zIndex = '-1';
        document.body.appendChild(gtDiv);
    }

    // 2. Inject the Google Translate Script
    const script = document.createElement('script');
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(script);

    // 3. Inject CSS to hide Google Translate's built-in UI elements
    const style = document.createElement('style');
    style.innerHTML = `
        /* Hide Google Translate Toolbar */
        .goog-te-banner-frame.skiptranslate, .goog-te-gadget-icon {
            display: none !important;
        }
        body {
            top: 0px !important;
        }
        /* Hide the Google Translate tooltip */
        #goog-gt-tt, .goog-te-balloon-frame {
            display: none !important;
        }
        .goog-text-highlight {
            background: none !important;
            box-shadow: none !important;
        }
    `;
    document.head.appendChild(style);

    // 4. Handle the custom dropdowns
    const langSelects = document.querySelectorAll('.lang-select');
    
    // Check if we have a saved language preference
    const savedLang = localStorage.getItem('karsakah_lang') || 'en';
    
    langSelects.forEach(langSelect => {
        langSelect.value = savedLang;
        
        langSelect.addEventListener('change', (e) => {
            const lang = e.target.value;
            localStorage.setItem('karsakah_lang', lang);
            changeGoogleTranslateLanguage(lang);
            // Sync other language selects on the page
            langSelects.forEach(select => {
                if(select !== e.target) select.value = lang;
            });
        });
    });
    
    // Trigger initial translation if a language is saved (other than default English)
    if (savedLang !== 'en') {
        // We need to wait for Google Translate to finish loading before we can change the language
        const maxWait = 50; // max 5 seconds (50 * 100ms)
        let waitCount = 0;
        const checkInterval = setInterval(() => {
            const select = document.querySelector('.goog-te-combo');
            if (select || waitCount > maxWait) {
                clearInterval(checkInterval);
                if (select) {
                    changeGoogleTranslateLanguage(savedLang);
                }
            }
            waitCount++;
        }, 100);
    }
});

function changeGoogleTranslateLanguage(lang) {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
        select.value = lang;
        select.dispatchEvent(new Event('change'));
    }
}
