import glob
import re

lang_selector_html = '''<div class="language-selector">
                    <i class="ph-bold ph-translate"></i>
                    <select class="lang-select">
                        <option value="en">English</option>
                        <option value="hi">हिन्दी (Hindi)</option>
                        <option value="mr">मराठी (Marathi)</option>
                        <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                        <option value="bn">বাংলা (Bengali)</option>
                        <option value="te">తెలుగు (Telugu)</option>
                        <option value="ta">தமிழ் (Tamil)</option>
                        <option value="kn">ಕನ್ನಡ (Kannada)</option>
                        <option value="ml">മലയാളം (Malayalam)</option>
                        <option value="ur">اردو (Urdu)</option>
                    </select>
                </div>'''

mobile_lang_selector = '''<div class="language-selector" style="margin-bottom: 15px; width: 100%; justify-content: space-between;">
                        <span style="font-weight: 500; color: var(--text-dark);"><i class="ph-bold ph-translate"></i> Language</span>
                        <select class="lang-select" style="background: var(--card-bg); border: 1px solid var(--border-color); padding: 4px 8px; border-radius: 6px; color: var(--text-dark);">
                            <option value="en">English</option>
                            <option value="hi">हिन्दी (Hindi)</option>
                            <option value="mr">मराठी (Marathi)</option>
                            <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                            <option value="bn">বাংলা (Bengali)</option>
                            <option value="te">తెలుగు (Telugu)</option>
                            <option value="ta">தமிழ் (Tamil)</option>
                            <option value="kn">ಕನ್ನಡ (Kannada)</option>
                            <option value="ml">മലയാളം (Malayalam)</option>
                            <option value="ur">اردو (Urdu)</option>
                        </select>
                    </div>'''

for file in glob.glob('*.html'):
    if file in ['auth.html']: continue
    try:
        content = open(file, 'r', encoding='utf-8').read()
        
        # 1. Update right-nav language selector
        content = re.sub(r'<div class="language-selector">.*?</div>', lang_selector_html, content, count=1, flags=re.DOTALL)
        
        # 2. Add language selector to mobile nav if not there
        if 'class="lang-select" style="background:' not in content:
            content = content.replace('<div class="right-nav-mobile">', '<div class="right-nav-mobile">\n                    ' + mobile_lang_selector)
        
        # 3. Show profile name on desktop
        content = content.replace('<span class="profile-name" style="display: none;">User</span>', '<span class="profile-name">User</span>')
        
        # 4. Link profile menu directly to dashboard. Let's change "My Profile" to "Dashboard"
        content = content.replace('My Profile</a>', 'Dashboard</a>')
        content = content.replace('my_profile', 'dashboard')
        
        open(file, 'w', encoding='utf-8').write(content)
        print(f'Updated {file}')
    except Exception as e:
        print(f'Failed {file}: {e}')
