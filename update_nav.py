import glob
import re

info_menu_html = '''                <div class="info-menu" style="position: relative; display: flex; align-items: center; cursor: pointer; padding: 8px 12px; border-radius: 8px; font-weight: 500; font-size: 15px; color: var(--text-dark); transition: all 0.2s ease;" onclick="toggleInfoMenu(event)">
                    <i class="ph-bold ph-info" style="margin-right: 6px;"></i> <span data-i18n="nav_more">More</span> <i class="ph-bold ph-caret-down" style="margin-left: 4px; font-size: 12px;"></i>
                    <div class="info-dropdown" style="position: absolute; top: 100%; left: 0; margin-top: 8px; background-color: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); width: 200px; display: none; flex-direction: column; z-index: 50; overflow: hidden;">
                        <a href="about.html" style="padding: 12px 16px; text-decoration: none; color: var(--text-dark); font-size: 14px; display: flex; align-items: center; gap: 12px; transition: background-color 0.2s;" data-i18n="nav_about"><i class="ph-bold ph-info"></i> About Us</a>
                        <a href="faq.html" style="padding: 12px 16px; text-decoration: none; color: var(--text-dark); font-size: 14px; display: flex; align-items: center; gap: 12px; transition: background-color 0.2s;" data-i18n="nav_faq"><i class="ph-bold ph-question"></i> FAQs</a>
                        <a href="contacts.html" style="padding: 12px 16px; text-decoration: none; color: var(--text-dark); font-size: 14px; display: flex; align-items: center; gap: 12px; transition: background-color 0.2s;" data-i18n="nav_contacts"><i class="ph-bold ph-phone"></i> Contacts</a>
                        <a href="privacy.html" style="padding: 12px 16px; text-decoration: none; color: var(--text-dark); font-size: 14px; display: flex; align-items: center; gap: 12px; transition: background-color 0.2s;" data-i18n="nav_privacy"><i class="ph-bold ph-shield-check"></i> Privacy Policy</a>
                        <a href="terms.html" style="padding: 12px 16px; text-decoration: none; color: var(--text-dark); font-size: 14px; display: flex; align-items: center; gap: 12px; transition: background-color 0.2s;" data-i18n="nav_terms"><i class="ph-bold ph-file-text"></i> Terms of Service</a>
                    </div>
                </div>'''

footer_links_html = '''                <div class="footer-links" style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; margin-bottom: 20px;">
                    <a href="about.html" style="color: var(--text-color); opacity: 0.8; text-decoration: none; font-weight: 500;" onmouseover="this.style.color='var(--primary-color)'" onmouseout="this.style.color='var(--text-color)'" data-i18n="nav_about">About Us</a>
                    <a href="faq.html" style="color: var(--text-color); opacity: 0.8; text-decoration: none; font-weight: 500;" onmouseover="this.style.color='var(--primary-color)'" onmouseout="this.style.color='var(--text-color)'" data-i18n="nav_faq">FAQs</a>
                    <a href="contacts.html" style="color: var(--text-color); opacity: 0.8; text-decoration: none; font-weight: 500;" onmouseover="this.style.color='var(--primary-color)'" onmouseout="this.style.color='var(--text-color)'" data-i18n="nav_contacts">Contacts</a>
                    <a href="privacy.html" style="color: var(--text-color); opacity: 0.8; text-decoration: none; font-weight: 500;" onmouseover="this.style.color='var(--primary-color)'" onmouseout="this.style.color='var(--text-color)'" data-i18n="nav_privacy">Privacy Policy</a>
                    <a href="terms.html" style="color: var(--text-color); opacity: 0.8; text-decoration: none; font-weight: 500;" onmouseover="this.style.color='var(--primary-color)'" onmouseout="this.style.color='var(--text-color)'" data-i18n="nav_terms">Terms of Service</a>
                </div>'''

for file in glob.glob('*.html'):
    if file in ['auth.html']: continue
    try:
        content = open(file, 'r', encoding='utf-8').read()
        
        # Replace footer
        content = re.sub(r'<div class="footer-links".*?</div>', footer_links_html, content, flags=re.DOTALL)
        
        # Remove contacts link from nav if it exists
        content = re.sub(r'<a href="contacts.html"[^>]*><i class="ph-bold ph-phone"></i> Contacts</a>\s*', '', content)
        
        # Add info_menu_html before <div class="right-nav-mobile">
        if '<div class="info-menu"' not in content:
            content = content.replace('<div class="right-nav-mobile">', info_menu_html + '\n                <div class="right-nav-mobile">')
        
        open(file, 'w', encoding='utf-8').write(content)
        print(f'Updated {file}')
    except Exception as e:
        print(f'Failed {file}: {e}')
