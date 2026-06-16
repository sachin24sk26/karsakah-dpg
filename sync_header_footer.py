import glob
import re

# Read index.html
with open('index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

header_match = re.search(r'<header class="navbar">.*?</header>', index_content, re.DOTALL)
footer_match = re.search(r'<footer class="footer">.*?</footer>', index_content, re.DOTALL)

if not header_match or not footer_match:
    print('Failed to find header or footer in index.html')
    exit(1)

header_html = header_match.group(0)
footer_html = footer_match.group(0)

print('Found header and footer.')

for file in glob.glob('*.html'):
    if file in ['index.html', 'auth.html', 'rental/templates/index.html']: continue
    
    try:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Replace header
        content = re.sub(r'<header class="navbar">.*?</header>', header_html, content, flags=re.DOTALL)
        
        # Replace footer
        content = re.sub(r'<footer class="footer">.*?</footer>', footer_html, content, flags=re.DOTALL)
        
        # Now fix the active class
        # Remove active from Home
        content = content.replace('href="index.html" class="active"', 'href="index.html"')
        
        # Add active to current file
        if file == 'crop_id.html':
            content = content.replace('href="crop_id.html"', 'href="crop_id.html" class="active"')
        elif file == 'prices.html':
            content = content.replace('href="prices.html"', 'href="prices.html" class="active"')
        elif file == 'schemes.html':
            # schemes is in the dropdown now, but we can still highlight it if we want
            content = content.replace('href="schemes.html"', 'href="schemes.html" class="active"')
        elif file == 'news.html':
            content = content.replace('href="news.html"', 'href="news.html" class="active"')
            
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
            
        print(f'Updated {file}')
    except Exception as e:
        print(f'Failed {file}: {e}')
