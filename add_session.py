import os
import glob

def main():
    root_files = glob.glob('s:/ByteForce/*.html')
    rental_files = glob.glob('s:/ByteForce/rental/templates/*.html')
    
    for file in root_files:
        if os.path.basename(file) in ('auth.html', 'profile.html'):
            continue
        update_file(file, 'session.js')
        
    for file in rental_files:
        # rental templates might need different path, but since theme.js is used, let's see how they reference theme.js
        # if they use <script src="theme.js" defer></script>, they are likely on root or expect root
        update_file(file, 'session.js') # or maybe '../session.js' if they use relative path

def update_file(file, script_path):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if f'<script src="{script_path}"' not in content and 'session.js' not in content:
        if '<script src="theme.js" defer></script>' in content:
            new_content = content.replace('<script src="theme.js" defer></script>', f'<script src="{script_path}" defer></script>\n    <script src="theme.js" defer></script>')
        elif '<script src="../theme.js" defer></script>' in content:
            new_content = content.replace('<script src="../theme.js" defer></script>', f'<script src="../session.js" defer></script>\n    <script src="../theme.js" defer></script>')
        else:
            # fallback
            new_content = content.replace('</body>', f'    <script src="{script_path}" defer></script>\n</body>')
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated {os.path.basename(file)}')

if __name__ == '__main__':
    main()
