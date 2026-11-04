import json

with open('public/database.json', encoding='utf-8') as f:
    db = json.load(f)

lessons = db['usa']['data']['lessons'][:4]

for l in lessons:
    print(f"\n==========================================")
    print(f"{l['id']}: {l['title']}")
    sources = l.get('sources', [])
    for s in sources:
        print(f"  [{s.get('letter')}] {s.get('id')}: {s.get('title')}")
        print(f"      Image: {s.get('image')}")
        text_preview = s.get('text', '')[:60].replace('\n', ' ') if s.get('text') else 'NO TEXT'
        print(f"      Text: {text_preview}")

