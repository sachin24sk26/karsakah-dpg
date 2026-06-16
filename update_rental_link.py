import glob
import re

for file in glob.glob('*.html'):
    if file in ['auth.html']: continue
    try:
        content = open(file, 'r', encoding='utf-8').read()
        
        # We need to find: <a href="rental/templates/index.html" data-i18n="nav_rental">
        # And replace with: <a href="rental/templates/index.html" target="_blank" data-i18n="nav_rental">
        
        # Let's replace the string
        old_str = '<a href="rental/templates/index.html" data-i18n="nav_rental">'
        new_str = '<a href="rental/templates/index.html" target="_blank" data-i18n="nav_rental">'
        
        if old_str in content:
            content = content.replace(old_str, new_str)
            open(file, 'w', encoding='utf-8').write(content)
            print(f'Updated {file}')
        else:
            print(f'Skipped {file} (pattern not found)')
            
    except Exception as e:
        print(f'Failed {file}: {e}')
