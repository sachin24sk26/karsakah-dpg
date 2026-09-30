import glob
import re

for file in glob.glob('*.html'):
    if file in ['auth.html']: continue
    try:
        content = open(file, 'r', encoding='utf-8').read()
        
        # We need to find:
        # <a href="contacts.html" ...>...</a>
        # </div>
        # <div class="right-nav-mobile">
        # And change the </div> to </div>\n                </div>
        
        # Let's do a simple replace
        old_str = '''<a href="contacts.html" style="padding: 12px 16px; text-decoration: none; color: var(--text-dark); font-size: 14px; display: flex; align-items: center; gap: 12px; transition: background-color 0.2s;" data-i18n="nav_contacts"><i class="ph-bold ph-phone"></i> Contacts</a>
                </div>
                <div class="right-nav-mobile">'''
                
        new_str = '''<a href="contacts.html" style="padding: 12px 16px; text-decoration: none; color: var(--text-dark); font-size: 14px; display: flex; align-items: center; gap: 12px; transition: background-color 0.2s;" data-i18n="nav_contacts"><i class="ph-bold ph-phone"></i> Contacts</a>
                    </div>
                </div>
                <div class="right-nav-mobile">'''
                
        if old_str in content:
            content = content.replace(old_str, new_str)
            open(file, 'w', encoding='utf-8').write(content)
            print(f'Updated {file}')
        else:
            print(f'Skipped {file} (pattern not found)')
            
    except Exception as e:
        print(f'Failed {file}: {e}')
