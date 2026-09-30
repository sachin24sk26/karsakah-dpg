import os
import glob

html_files = glob.glob('s:/ByteForce/*.html')

target_nav = '<a href="contacts.html" data-i18n="nav_contacts"><i class="ph-bold ph-phone"></i> Contacts</a>'
replacement_nav = '<a href="contacts.html" data-i18n="nav_contacts"><i class="ph-bold ph-phone"></i> Contacts</a>\n                <a href="about.html" data-i18n="nav_about"><i class="ph-bold ph-info"></i> About Us</a>'

for file in html_files:
    if "admin" in file or "rental" in file:
        continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if target_nav in content and "about.html" not in content:
        content = content.replace(target_nav, replacement_nav)
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file}")
    else:
        print(f"Skipped {file} (target not found or already updated)")
