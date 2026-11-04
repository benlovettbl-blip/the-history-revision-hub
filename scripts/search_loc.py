import urllib.request
import urllib.parse
import json

url = "https://www.loc.gov/search/?q=Montgomery+bus+boycott+leaflet&fo=json"
req = urllib.request.Request(url, headers={'User-Agent': 'HistoryRevisionHub/1.0'})
try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        for item in data.get('results', [])[:5]:
            print(item.get('title'))
            print('  URL:', item.get('url'))
            print('  Images:', item.get('image_url', []))
except Exception as e:
    print('LOC error:', e)

