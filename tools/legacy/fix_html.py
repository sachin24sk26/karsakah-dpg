import os
import sys

files = [
    "index.html", 
    "contacts.html", 
    "crop_id.html", 
    "prices.html", 
    "profile.html", 
    "schemes.html", 
    "weather.html"
]

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # 1. Update Navigation links by stripping any existing data-i18n if they are formatted oddly, 
        # but the safest way is to target the end of the start tag and inner HTML.
        
        # Some links might already have data-i18n if they were copied from prices.html, so let's only do it if they don't
        if 'data-i18n="nav_home"' not in content:
            content = content.replace('><i class="ph-bold ph-house"></i> Home</a>', ' data-i18n="nav_home"><i class="ph-bold ph-house"></i> Home</a>')
            
        if 'data-i18n="nav_crop"' not in content:
            content = content.replace('><i class="ph-bold ph-scan"></i> Crop Identification</a>', ' data-i18n="nav_crop"><i class="ph-bold ph-scan"></i> Crop Identification</a>')
            
        if 'data-i18n="nav_prices"' not in content:
            content = content.replace('><i class="ph-bold ph-currency-inr"></i> Live Market Prices</a>', ' data-i18n="nav_prices"><i class="ph-bold ph-currency-inr"></i> Live Market Prices</a>')
            
        if 'data-i18n="nav_schemes"' not in content:
            content = content.replace('><i class="ph-bold ph-newspaper"></i> Gov Schemes</a>', ' data-i18n="nav_schemes"><i class="ph-bold ph-newspaper"></i> Gov Schemes</a>')
            
        if 'data-i18n="nav_contacts"' not in content:
            content = content.replace('><i class="ph-bold ph-phone"></i> Contacts</a>', ' data-i18n="nav_contacts"><i class="ph-bold ph-phone"></i> Contacts</a>')
            
        # 2. Update Profile Menu
        if 'data-i18n="my_account"' not in content:
            content = content.replace('<span class="profile-name">My Account</span>', '<span class="profile-name" data-i18n="my_account">My Account</span>')
            
        if 'data-i18n="my_profile"' not in content:
            content = content.replace('><i class="ph-bold ph-user"></i> My Profile</a>', ' data-i18n="my_profile"><i class="ph-bold ph-user"></i> My Profile</a>')
            
        if 'data-i18n="settings"' not in content:
            content = content.replace('><i class="ph-bold ph-gear"></i> Settings</a>', ' data-i18n="settings"><i class="ph-bold ph-gear"></i> Settings</a>')
            
        if 'data-i18n="history"' not in content:
            content = content.replace('><i class="ph-bold ph-clock-counter-clockwise"></i> History</a>', ' data-i18n="history"><i class="ph-bold ph-clock-counter-clockwise"></i> History</a>')
            
        if 'data-i18n="logout"' not in content:
            content = content.replace('><i class="ph-bold ph-sign-out"></i> Log Out</a>', ' data-i18n="logout"><i class="ph-bold ph-sign-out"></i> Log Out</a>')
            
        # 3. Add script tag at the end (before </body>)
        if 'src="translate.js"' not in content:
            content = content.replace('</body>', '    <script src="translate.js"></script>\n</body>')
            
        # 4. Add Punjabi language option to selector
        if '<option value="pa">' not in content:
            # Match the exact string from prices.html & index.html
            content = content.replace('<option value="mr">मराठी (Marathi)</option>', '<option value="mr">मराठी (Marathi)</option>\n                        <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>')
            
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
            
        print(f"Updated {f}")
    except Exception as e:
        print(f"Error processing {f}: {e}")
