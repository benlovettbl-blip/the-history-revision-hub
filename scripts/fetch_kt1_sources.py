import urllib.request
import urllib.parse
import json
import time
import os

headers = {'User-Agent': 'HistoryRevisionHub/1.0 (educational-nonprofit; contact@historyhub.org)'}

def search_and_download(query, dest_filename):
    print(f"Searching for: {query}...")
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}&srnamespace=6&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            items = data.get('query', {}).get('search', [])
            if not items:
                print(f"No results for {query}")
                return False
            title = items[0]['title']
            print(f"Top result: {title}")
            
            # Get URL
            info_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url&format=json"
            time.sleep(1)
            req2 = urllib.request.Request(info_url, headers=headers)
            with urllib.request.urlopen(req2) as resp2:
                data2 = json.loads(resp2.read().decode('utf-8'))
                pages = data2.get('query', {}).get('pages', {})
                for pid, p in pages.items():
                    img_url = p.get('imageinfo', [{}])[0].get('url')
                    if img_url:
                        print(f"Downloading from {img_url} to {dest_filename}...")
                        time.sleep(1)
                        req3 = urllib.request.Request(img_url, headers=headers)
                        with urllib.request.urlopen(req3) as img_resp, open(dest_filename, 'wb') as out_f:
                            out_f.write(img_resp.read())
                        print("Saved successfully!")
                        return True
    except Exception as e:
        print(f"Error: {e}")
        return False

# Download queries
os.makedirs('temp_sources', exist_ok=True)
search_and_download('Thurgood Marshall 1954 Supreme Court', 'temp_sources/thurgood_marshall_scotus.jpg')
time.sleep(2)
search_and_download('Orval Faubus 1957 speaking', 'temp_sources/orval_faubus_1957.jpg')
time.sleep(2)
search_and_download('Montgomery Bus Boycott flyer 1955', 'temp_sources/montgomery_bus_boycott_flyer.jpg')
time.sleep(2)
search_and_download('Emmett Till Chicago Defender', 'temp_sources/emmett_till_chicago_defender.jpg')

