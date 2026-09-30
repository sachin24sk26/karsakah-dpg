import re
import os

translate_js_path = 's:/ByteForce/translate.js'
with open(translate_js_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix updateLanguage logic to preserve child nodes (like icons)
new_update_logic = '''
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (texts[key]) {
            let textNodeChanged = false;
            for (let i = 0; i < el.childNodes.length; i++) {
                let node = el.childNodes[i];
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
                    const leadingMatch = node.textContent.match(/^\s*/);
                    const trailingMatch = node.textContent.match(/\s*$/);
                    const leadingSpace = leadingMatch ? leadingMatch[0] : '';
                    const trailingSpace = trailingMatch ? trailingMatch[0] : '';
                    node.textContent = leadingSpace + texts[key] + trailingSpace;
                    textNodeChanged = true;
                    break;
                }
            }
            if (!textNodeChanged) {
                if (el.children.length === 0) {
                    el.textContent = texts[key];
                } else {
                    el.appendChild(document.createTextNode(' ' + texts[key]));
                }
            }
        }
    });
'''

# Replace the updateLanguage inner loop
content = re.sub(
    r'document\.querySelectorAll\(\'\[data-i18n\]\'\)\.forEach\(el => \{[\s\S]*?el\.textContent = texts\[key\];[\s\S]*?\}\);',
    new_update_logic.strip(),
    content
)

en_crop = '''
        nav_news: "Agri News",
        nav_about: "About Us",
        
        // Crop ID specific
        crop_page_title: "AI Crop Disease Diagnosis",
        crop_page_subtitle: "Upload a photo of your crop leaf or take a picture using your camera. Our Kaggle-trained AI model will instantly identify the disease.",
        btn_camera: "Use Camera",
        btn_upload: "Upload Image",
        btn_capture: "Capture Photo",
        btn_retake: "Retake / Re-upload",
        btn_analyze: "Analyze Disease",
        empty_state_text: "Select an option above to provide a leaf sample.",
        analyzing_text: "AI is analyzing the sample...",
        report_title: "Doctor's Report",
        report_subtitle: "Based on the symptoms shown on the leaves, here is the diagnosis and a plan to save your crop.",
        sec_identification: "1. Disease Identification",
        label_disease: "Name of Disease:",
        label_confidence: "Confidence Level:",
        label_symptoms: "Symptoms:",
        sec_immediate: "2. Immediate Action (Stop the Spread)",
        sec_treatment: "3. Treatment Options",
        label_organic: "Organic/Low-Cost Solution:",
        label_chemical: "Chemical Solution:",
        sec_prevention: "4. Prevention for Next Time",
        sec_safety: "5. Safety Warning",
        safety_text: "Always wear protective clothing, a mask, and gloves when handling or spraying chemicals. Consult with your local Krishi Vigyan Kendra (KVK) or Horticulture Department for the most accurate spray timings based on your local weather and crop variety.",
        btn_check_another: "Check Another Crop",
        kvk_note: "Consult with your local Krishi Vigyan Kendra (KVK) before applying heavy chemicals.",
        api_error_message: "Could not connect to the Python Backend API. Make sure the Flask server is running.",
'''

hi_crop = '''
        nav_news: "कृषि समाचार",
        nav_about: "हमारे बारे में",
        
        // Crop ID specific
        crop_page_title: "एआई फसल रोग निदान",
        crop_page_subtitle: "अपनी फसल की पत्ती की तस्वीर अपलोड करें या कैमरे का उपयोग करके तस्वीर लें। हमारा एआई मॉडल तुरंत बीमारी की पहचान करेगा।",
        btn_camera: "कैमरा का उपयोग करें",
        btn_upload: "छवि अपलोड करें",
        btn_capture: "फोटो खींचें",
        btn_retake: "पुनः प्रयास / पुनः अपलोड करें",
        btn_analyze: "रोग का विश्लेषण करें",
        empty_state_text: "पत्ती का नमूना प्रदान करने के लिए ऊपर एक विकल्प चुनें।",
        analyzing_text: "एआई नमूने का विश्लेषण कर रहा है...",
        report_title: "डॉक्टर की रिपोर्ट",
        report_subtitle: "पत्तियों पर दिखाई देने वाले लक्षणों के आधार पर, यहाँ आपकी फसल को बचाने का निदान और योजना है।",
        sec_identification: "1. रोग की पहचान",
        label_disease: "बीमारी का नाम:",
        label_confidence: "आत्मविश्वास का स्तर:",
        label_symptoms: "लक्षण:",
        sec_immediate: "2. तत्काल कार्रवाई (फैलने से रोकें)",
        sec_treatment: "3. उपचार के विकल्प",
        label_organic: "जैविक/कम लागत वाला समाधान:",
        label_chemical: "रासायनिक समाधान:",
        sec_prevention: "4. अगली बार के लिए रोकथाम",
        sec_safety: "5. सुरक्षा चेतावनी",
        safety_text: "रसायनों को संभालते या स्प्रे करते समय हमेशा सुरक्षामय कपड़े, मास्क और दस्ताने पहनें। अपनी स्थानीय मौसम और फसल विविधता के आधार पर सबसे सटीक छिड़काव समय के लिए अपने स्थानीय कृषि विज्ञान केंद्र (KVK) से परामर्श लें।",
        btn_check_another: "अन्य फसल की जाँच करें",
        kvk_note: "भारी रसायनों का उपयोग करने से पहले अपने स्थानीय कृषि विज्ञान केंद्र (KVK) से परामर्श लें।",
        api_error_message: "पायथन बैकएंड एपीआई से कनेक्ट नहीं हो सका। सुनिश्चित करें कि फ्लास्क सर्वर चल रहा है।",
'''

mr_crop = '''
        nav_news: "कृषी बातम्या",
        nav_about: "आमच्याबद्दल",
        
        // Crop ID specific
        crop_page_title: "एआय पीक रोग निदान",
        crop_page_subtitle: "तुमच्या पिकाच्या पानाचा फोटो अपलोड करा किंवा कॅमेरा वापरून फोटो घ्या. आमचे एआय मॉडेल त्वरित रोगाची ओळख करेल.",
        btn_camera: "कॅमेरा वापरा",
        btn_upload: "फोटो अपलोड करा",
        btn_capture: "फोटो घ्या",
        btn_retake: "पुन्हा प्रयत्न करा / पुन्हा अपलोड करा",
        btn_analyze: "रोगाचे विश्लेषण करा",
        empty_state_text: "पानाचा नमुना देण्यासाठी वरील एक पर्याय निवडा.",
        analyzing_text: "एआय नमुन्याचे विश्लेषण करत आहे...",
        report_title: "डॉक्टरांचा रिपोर्ट",
        report_subtitle: "पानांवर दिसणाऱ्या लक्षणांवरून, तुमच्या पिकाला वाचवण्यासाठी निदान आणि योजना येथे आहे.",
        sec_identification: "1. रोगाची ओळख",
        label_disease: "रोगाचे नाव:",
        label_confidence: "खात्रीची पातळी:",
        label_symptoms: "लक्षणे:",
        sec_immediate: "2. त्वरित कारवाई (प्रसार थांबवा)",
        sec_treatment: "3. उपचाराचे पर्याय",
        label_organic: "सेंद्रिय/कमी खर्चाचा उपाय:",
        label_chemical: "रासायनिक उपाय:",
        sec_prevention: "4. पुढच्या वेळेसाठी प्रतिबंध",
        sec_safety: "5. सुरक्षिततेचा इशारा",
        safety_text: "रसायने हाताळताना किंवा फवारताना नेहमी संरक्षणात्मक कपडे, मास्क आणि हातमोजे घाला. तुमच्या स्थानिक हवामान आणि पिकांच्या विविधतेवर आधारित अचूक फवारणीच्या वेळेसाठी कृषी विज्ञान केंद्राचा (KVK) सल्ला घ्या.",
        btn_check_another: "दुसरे पीक तपासा",
        kvk_note: "जड रसायने वापरण्यापूर्वी तुमच्या स्थानिक कृषी विज्ञान केंद्राशी (KVK) सल्लामसलत करा.",
        api_error_message: "पायथन बॅकएंड एपीआयशी कनेक्ट होऊ शकले नाही. फ्लास्क सर्व्हर चालू असल्याची खात्री करा.",
'''

pa_crop = '''
        nav_news: "ਖੇਤੀਬਾੜੀ ਖ਼ਬਰਾਂ",
        nav_about: "ਸਾਡੇ ਬਾਰੇ",
        
        // Crop ID specific
        crop_page_title: "ਏਆਈ ਫ਼ਸਲ ਰੋਗ ਨਿਦਾਨ",
        crop_page_subtitle: "ਆਪਣੀ ਫ਼ਸਲ ਦੇ ਪੱਤੇ ਦੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ ਜਾਂ ਕੈਮਰੇ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਫੋਟੋ ਖਿੱਚੋ। ਸਾਡਾ ਏਆਈ ਮਾਡਲ ਤੁਰੰਤ ਬਿਮਾਰੀ ਦੀ ਪਛਾਣ ਕਰੇਗਾ।",
        btn_camera: "ਕੈਮਰਾ ਵਰਤੋ",
        btn_upload: "ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ",
        btn_capture: "ਫੋਟੋ ਖਿੱਚੋ",
        btn_retake: "ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ / ਦੁਬਾਰਾ ਅਪਲੋਡ ਕਰੋ",
        btn_analyze: "ਰੋਗ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ",
        empty_state_text: "ਪੱਤੇ ਦਾ ਨਮੂਨਾ ਪ੍ਰਦਾਨ ਕਰਨ ਲਈ ਉੱਪਰ ਇੱਕ ਵਿਕਲਪ ਚੁਣੋ।",
        analyzing_text: "ਏਆਈ ਨਮੂਨੇ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਿਹਾ ਹੈ...",
        report_title: "ਡਾਕਟਰ ਦੀ ਰਿਪੋਰਟ",
        report_subtitle: "ਪੱਤਿਆਂ 'ਤੇ ਦਿਖਾਈ ਦੇਣ ਵਾਲੇ ਲੱਛਣਾਂ ਦੇ ਆਧਾਰ 'ਤੇ, ਇੱਥੇ ਤੁਹਾਡੀ ਫ਼ਸਲ ਨੂੰ ਬਚਾਉਣ ਲਈ ਨਿਦਾਨ ਅਤੇ ਯੋਜਨਾ ਹੈ।",
        sec_identification: "1. ਰੋਗ ਦੀ ਪਛਾਣ",
        label_disease: "ਬਿਮਾਰੀ ਦਾ ਨਾਮ:",
        label_confidence: "ਭਰੋਸੇ ਦਾ ਪੱਧਰ:",
        label_symptoms: "ਲੱਛਣ:",
        sec_immediate: "2. ਤੁਰੰਤ ਕਾਰਵਾਈ (ਫੈਲਣ ਤੋਂ ਰੋਕੋ)",
        sec_treatment: "3. ਇਲਾਜ ਦੇ ਵਿਕਲਪ",
        label_organic: "ਜੈਵਿਕ/ਘੱਟ ਕੀਮਤ ਵਾਲਾ ਹੱਲ:",
        label_chemical: "ਰਸਾਇਣਕ ਹੱਲ:",
        sec_prevention: "4. ਅਗਲੀ ਵਾਰ ਲਈ ਰੋਕਥਾਮ",
        sec_safety: "5. ਸੁਰੱਖਿਆ ਚੇਤਾਵਨੀ",
        safety_text: "ਰਸਾਇਣਾਂ ਨੂੰ ਸੰਭਾਲਣ ਜਾਂ ਸਪਰੇਅ ਕਰਨ ਵੇਲੇ ਹਮੇਸ਼ਾ ਸੁਰੱਖਿਆ ਕੱਪੜੇ, ਮਾਸਕ ਅਤੇ ਦਸਤਾਨੇ ਪਹਿਨੋ। ਸਭ ਤੋਂ ਸਹੀ ਸਪਰੇਅ ਦੇ ਸਮੇਂ ਲਈ ਆਪਣੇ ਸਥਾਨਕ ਕ੍ਰਿਸ਼ੀ ਵਿਗਿਆਨ ਕੇਂਦਰ (KVK) ਨਾਲ ਸਲਾਹ ਕਰੋ।",
        btn_check_another: "ਹੋਰ ਫ਼ਸਲ ਦੀ ਜਾਂਚ ਕਰੋ",
        kvk_note: "ਭਾਰੀ ਰਸਾਇਣਾਂ ਦੀ ਵਰਤੋਂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਆਪਣੇ ਸਥਾਨਕ ਕ੍ਰਿਸ਼ੀ ਵਿਗਿਆਨ ਕੇਂਦਰ (KVK) ਨਾਲ ਸਲਾਹ ਕਰੋ।",
        api_error_message: "ਪਾਈਥਨ ਬੈਕਐਂਡ API ਨਾਲ ਕਨੈਕਟ ਨਹੀਂ ਕਰ ਸਕਿਆ। ਯਕੀਨੀ ਬਣਾਓ ਕਿ ਫਲਾਸਕ ਸਰਵਰ ਚੱਲ ਰਿਹਾ ਹੈ।",
'''

# Use regex to find language blocks and inject translations right after the `logout` key
def insert_translation(lang_code, lang_snippet, text):
    # Depending on the language, the logout text might differ
    # We can match `logout: ".*?",`
    pattern = r'(logout:\s*".*?",)'
    
    # We need to target the specific language block: `en: { ... logout: "...", ... }`
    # A cleaner way is to search for `lang_code: {` and then find the next `logout:` line.
    
    block_pattern = rf'({lang_code}:\s*{{[\s\S]*?logout:\s*".*?",)'
    
    match = re.search(block_pattern, text)
    if match:
        return text[:match.end()] + '\n' + lang_snippet + text[match.end():]
    return text

content = insert_translation('en', en_crop, content)
content = insert_translation('hi', hi_crop, content)
content = insert_translation('mr', mr_crop, content)
content = insert_translation('pa', pa_crop, content)

with open(translate_js_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated translate.js translations.")

# Now we need to update crop_id.html with `data-i18n` attributes.
crop_id_path = 's:/ByteForce/crop_id.html'
with open(crop_id_path, 'r', encoding='utf-8') as f:
    html = f.read()

replacements = [
    ('<h1>AI Crop Disease Diagnosis</h1>', '<h1 data-i18n="crop_page_title">AI Crop Disease Diagnosis</h1>'),
    ('<p>Upload a photo of your crop leaf or take a picture using your camera. Our Kaggle-trained AI model\\n                    will instantly identify the disease.</p>', '<p data-i18n="crop_page_subtitle">Upload a photo of your crop leaf or take a picture using your camera. Our Kaggle-trained AI model\\n                    will instantly identify the disease.</p>'),
    ('<h1>AI Crop Disease Diagnosis</h1>', '<h1 data-i18n="crop_page_title">AI Crop Disease Diagnosis</h1>'),
    # Use regex to replace exact buttons
    (r'<button id="btn-camera" class="action-btn">([^<]+)<i class="([^"]+)"></i>\s*(Use Camera)\s*</button>', r'<button id="btn-camera" class="action-btn">\g<1><i class="\g<2>"></i> <span data-i18n="btn_camera">\g<3></span>\n                    </button>'),
    (r'<button id="btn-upload" class="action-btn">([^<]+)<i class="([^"]+)"></i>\s*(Upload Image)\s*</button>', r'<button id="btn-upload" class="action-btn">\g<1><i class="\g<2>"></i> <span data-i18n="btn_upload">\g<3></span>\n                    </button>'),
    (r'<button id="btn-capture" class="btn btn-primary btn-overlay">([^<]+)<i class="([^"]+)"></i>\s*(Capture Photo)\s*</button>', r'<button id="btn-capture" class="btn btn-primary btn-overlay">\g<1><i class="\g<2>"></i> <span data-i18n="btn_capture">\g<3></span>\n                    </button>'),
    (r'<button id="btn-retake" class="btn btn-secondary">(Retake / Re-upload)</button>', r'<button id="btn-retake" class="btn btn-secondary" data-i18n="btn_retake">Retake / Re-upload</button>'),
    (r'<button id="btn-analyze" class="btn btn-primary">([^<]+)<i class="([^"]+)"></i>\s*(Analyze Disease)\s*</button>', r'<button id="btn-analyze" class="btn btn-primary">\g<1><i class="\g<2>"></i> <span data-i18n="btn_analyze">\g<3></span>\n                        </button>'),
    (r'<p>Select an option above to provide a leaf sample.</p>', r'<p data-i18n="empty_state_text">Select an option above to provide a leaf sample.</p>'),
    (r'<p>AI is analyzing the sample...</p>', r'<p data-i18n="analyzing_text">AI is analyzing the sample...</p>'),
    (r'<h3>Doctor\'s Report</h3>', r'<h3 data-i18n="report_title">Doctor\'s Report</h3>'),
    (r'<p>Based on the symptoms shown on the leaves, here is the diagnosis and a plan to save your crop.</p>', r'<p data-i18n="report_subtitle">Based on the symptoms shown on the leaves, here is the diagnosis and a plan to save your crop.</p>'),
    (r'<h4>1. Disease Identification</h4>', r'<h4 data-i18n="sec_identification">1. Disease Identification</h4>'),
    (r'<strong>Name of Disease:</strong>', r'<strong data-i18n="label_disease">Name of Disease:</strong>'),
    (r'<strong>Confidence Level:</strong>', r'<strong data-i18n="label_confidence">Confidence Level:</strong>'),
    (r'<strong>Symptoms:</strong>', r'<strong data-i18n="label_symptoms">Symptoms:</strong>'),
    (r'<h4>2. Immediate Action \(Stop the Spread\)</h4>', r'<h4 data-i18n="sec_immediate">2. Immediate Action (Stop the Spread)</h4>'),
    (r'<h4>3. Treatment Options</h4>', r'<h4 data-i18n="sec_treatment">3. Treatment Options</h4>'),
    (r'<strong>Organic/Low-Cost Solution:</strong>', r'<strong data-i18n="label_organic">Organic/Low-Cost Solution:</strong>'),
    (r'<strong>Chemical Solution:</strong>', r'<strong data-i18n="label_chemical">Chemical Solution:</strong>'),
    (r'<h4>4. Prevention for Next Time</h4>', r'<h4 data-i18n="sec_prevention">4. Prevention for Next Time</h4>'),
    (r'<h4>5. Safety Warning</h4>', r'<h4 data-i18n="sec_safety">5. Safety Warning</h4>'),
    (r'<p>Always wear protective clothing, a mask, and gloves when handling or spraying chemicals. Consult with your local Krishi Vigyan Kendra \(KVK\) or Horticulture Department for the most accurate spray timings based on your local weather and crop variety.</p>', r'<p data-i18n="safety_text">Always wear protective clothing, a mask, and gloves when handling or spraying chemicals. Consult with your local Krishi Vigyan Kendra (KVK) or Horticulture Department for the most accurate spray timings based on your local weather and crop variety.</p>'),
    (r'<button id="btn-check-another" class="btn btn-primary" style="margin-bottom: 16px;">([^<]+)<i class="([^"]+)"></i>\s*(Check Another Crop)\s*</button>', r'<button id="btn-check-another" class="btn btn-primary" style="margin-bottom: 16px;">\g<1><i class="\g<2>"></i> <span data-i18n="btn_check_another">\g<3></span>\n                        </button>'),
    (r'Consult with your local Krishi Vigyan Kendra \(KVK\) before applying heavy chemicals.', r'<span data-i18n="kvk_note">Consult with your local Krishi Vigyan Kendra (KVK) before applying heavy chemicals.</span>'),
    (r'Could not connect to the Python Backend API. Make sure the Flask server is\s*running.', r'<span data-i18n="api_error_message">Could not connect to the Python Backend API. Make sure the Flask server is running.</span>')
]

for src, dst in replacements:
    html = re.sub(src, dst, html)
    
# Manual replacement for subtitle since multiline regex could fail
html = html.replace('<p>Upload a photo of your crop leaf or take a picture using your camera. Our Kaggle-trained AI model\n                    will instantly identify the disease.</p>', '<p data-i18n="crop_page_subtitle">Upload a photo of your crop leaf or take a picture using your camera. Our Kaggle-trained AI model\n                    will instantly identify the disease.</p>')

with open(crop_id_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated crop_id.html with data-i18n tags.")
