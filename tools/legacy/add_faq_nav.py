import os
import glob
import re

html_files = glob.glob('s:/ByteForce/*.html')

# We are looking to insert the FAQ link right after the About Us link
target_nav = '<a href="about.html" data-i18n="nav_about"><i class="ph-bold ph-info"></i> About Us</a>'
target_nav_mobile = '<a href="about.html" class="active" data-i18n="nav_about"><i class="ph-bold ph-info"></i> About Us</a>' # for about.html itself where the class is active

replacement_nav = '<a href="about.html" data-i18n="nav_about"><i class="ph-bold ph-info"></i> About Us</a>\n                <a href="faq.html" data-i18n="nav_faq"><i class="ph-bold ph-question"></i> FAQs</a>'
replacement_nav_mobile = '<a href="about.html" class="active" data-i18n="nav_about"><i class="ph-bold ph-info"></i> About Us</a>\n                <a href="faq.html" data-i18n="nav_faq"><i class="ph-bold ph-question"></i> FAQs</a>'

for file in html_files:
    if "admin" in file or "rental" in file:
        continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    if "faq.html" not in content:
        # standard case
        if target_nav in content:
            content = content.replace(target_nav, replacement_nav)
            modified = True
            
        # active class case on about.html
        if target_nav_mobile in content:
             content = content.replace(target_nav_mobile, replacement_nav_mobile)
             modified = True
            
    if modified:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file}")
    else:
        print(f"Skipped {file} (target not found or already updated)")
