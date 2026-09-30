import glob
import re

for file in glob.glob('*.html'):
    if file in ['auth.html']: continue
    try:
        content = open(file, 'r', encoding='utf-8').read()
        
        # We need to find the info-dropdown structure ending and insert a missing </div>
        # Let's use regex:
        # Match: <a href="contacts.html" [^>]+><i class="ph-bold ph-phone"></i> Contacts</a>\s*</div>\s*<div class="right-nav-mobile">
        pattern = re.compile(r'(<a href="contacts\.html"[^>]+><i class="ph-bold ph-phone"></i> Contacts</a>\s*</div>)(\s*<div class="right-nav-mobile">)')
        
        if pattern.search(content):
            content = pattern.sub(r'\1\n                </div>\2', content)
            open(file, 'w', encoding='utf-8').write(content)
            print(f'Updated {file}')
        else:
            print(f'Skipped {file} (pattern not found)')
            
    except Exception as e:
        print(f'Failed {file}: {e}')
