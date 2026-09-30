import glob

files = glob.glob("*.html")
if "admin\\index.html" in files: files.append("admin\\index.html")

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            
        # Add Meta Description if missing
        if '<meta name="description"' not in content:
            content = content.replace('<title>', '<meta name="description" content="KARSAKAH is an expert agricultural platform for crop identification, market prices, and government schemes.">\n    <title>')
            
        # Add Defer to local scripts sequentially
        for script_name in ['theme.js', 'chatbot.js', 'translate.js', 'schemes.js', 'crop_id.js', 'prices.js', 'weather.js']:
            if f'<script src="{script_name}"></script>' in content:
                content = content.replace(f'<script src="{script_name}"></script>', f'<script src="{script_name}" defer></script>')

        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
            
        print(f"Optimized {f}")
    except Exception as e:
        print(f"Error processing {f}: {e}")
