import re

with open(r"C:\Users\user\.gemini\antigravity\brain\ea9c525d-c74f-49fa-85f9-007e1483e7e5\.system_generated\steps\31\content.md", "r", encoding="utf-8") as f:
    content = f.read()

html_start = content.find("<!DOCTYPE html>")
if html_start != -1:
    html = content[html_start:]
    
    # Remove tailwind CDN
    html = re.sub(r'<script src="https://cdn\.tailwindcss\.com"></script>', '', html)
    # Remove alpine CDN
    html = re.sub(r'<script defer src="https://unpkg\.com/alpinejs@3\.x\.x/dist/cdn\.min\.js"></script>', '', html)
    # Remove inline tailwind config
    html = re.sub(r'<script>\s*tailwind\.config = {[\s\S]*?}\s*</script>', '', html)
    # Remove the Alpine initialization scripts since they are in main.js
    html = re.sub(r'<script>\s*// Utility function for mobile menu[\s\S]*?Alpine\.store\(\'darkMode\'\)\.on = false;\s*}\s*}\);\s*</script>', '', html)
    
    # Remove unresolved asset paths (temp/custom/*)
    html = re.sub(r'<script[^>]*src="temp/custom/[^>]*></script>', '', html)
    html = re.sub(r'<link[^>]*href="temp/custom/[^>]*>', '', html)
    html = re.sub(r'<img[^>]*src="temp/custom/[^>]*>', '', html)
    
    # Fix the unclosed/invalid HTML comment that caused parsing errors
    html = re.sub(r'<!-- Start Pricing Trading.*?</section>', '', html, flags=re.DOTALL)

    # Add Vite entry point in <head>
    head_end = html.find("</head>")
    if head_end != -1:
        vite_scripts = '\n    <script type="module" src="/main.js"></script>\n'
        html = html[:head_end] + vite_scripts + html[head_end:]

    with open(r"C:\Users\user\.gemini\antigravity\scratch\stocks-profits-clone\index.html", "w", encoding="utf-8") as f:
        f.write(html)
    print("Successfully extracted and cleaned HTML to index.html")
else:
    print("Could not find HTML start tag.")
