import urllib.request
import urllib.parse
import json

def search(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(q)}&srnamespace=6&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'HistoryRevisionHub/1.0'})
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        return [item['title'] for item in data.get('query', {}).get('search', [])[:5]]

print('Boycott leaflet:', search('Montgomery Bus Boycott'))
print('Southern Manifesto doc:', search('Southern Manifesto Congressional Record'))
