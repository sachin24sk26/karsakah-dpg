import glob

html_files = glob.glob('s:/ByteForce/*.html')

# Strings to search for in nav
nav_search = [
    '<a href="about.html" data-i18n="nav_about"><i class="ph-bold ph-info"></i> About Us</a>\n                <a href="faq.html" data-i18n="nav_faq"><i class="ph-bold ph-question"></i> FAQs</a>',
    '<a href="about.html" class="active" data-i18n="nav_about"><i class="ph-bold ph-info"></i> About Us</a>\n                <a href="faq.html" data-i18n="nav_faq"><i class="ph-bold ph-question"></i> FAQs</a>',
    '<a href="about.html" data-i18n="nav_about"><i class="ph-bold ph-info"></i> About Us</a>\n                <a href="faq.html" class="active" data-i18n="nav_faq"><i class="ph-bold ph-question"></i> FAQs</a>'
]

# Replacement for the footer container
footer_search = '<div class="footer-credits">'
footer_replacement = '''<div class="footer-links" style="display: flex; gap: 20px; justify-content: center; margin-bottom: 20px;">
                    <a href="about.html" style="color: var(--text-color); opacity: 0.8; text-decoration: none; font-weight: 500;" onmouseover="this.style.color=\'var(--primary-color)\'" onmouseout="this.style.color=\'var(--text-color)\'">About Us</a>
                    <a href="faq.html" style="color: var(--text-color); opacity: 0.8; text-decoration: none; font-weight: 500;" onmouseover="this.style.color=\'var(--primary-color)\'" onmouseout="this.style.color=\'var(--text-color)\'">FAQs</a>
                </div>
                <div class="footer-credits">'''

for file in html_files:
    if "admin" in file or "rental" in file:
        continue
    
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    modified = False

    # 1. Remove from nav
    for search_str in nav_search:
        if search_str in content:
            content = content.replace(search_str, "")
            modified = True

    # 2. Add to footer (only if not already there)
    if 'class="footer-links"' not in content and footer_search in content:
        content = content.replace(footer_search, footer_replacement)
        modified = True

    if modified:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file}")
    else:
        print(f"Skipped {file} (no target nav/footer found or already updated)")
