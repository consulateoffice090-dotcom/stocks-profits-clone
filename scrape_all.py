import urllib.request
import os
import time

base_url = "https://stocks-profits.com/"
pages = [
    "login", "register", "cryptocurrencies", "forex", "shares", 
    "indices", "etfs", "trade", "copy", "automate", "about", 
    "why-us", "faq", "regulation", "for-traders", "contacts"
]

out_dir = "scraped_pages"
os.makedirs(out_dir, exist_ok=True)

for page in pages:
    url = base_url + page
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            with open(os.path.join(out_dir, f"{page}.html"), 'w', encoding='utf-8') as f:
                f.write(html)
        print(f"Successfully scraped {page}")
    except Exception as e:
        print(f"Failed to scrape {page}: {e}")
    time.sleep(1) # Be polite
