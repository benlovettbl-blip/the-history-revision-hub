import json

with open('public/database.json', encoding='utf-8') as f:
    db = json.load(f)

usa = db['usa']['data']['lessons']
written_kw = ['extract', 'speech', 'written', 'letter', 'statute', 'testimony', 'proclamation', 'declaration', 'memoir', 'report', 'act', 'code', 'order', 'treaty', 'cable', 'telegram', 'resolution', 'ruling', 'opinion', 'editorial']

for li, l in enumerate(usa):
    for s in l.get('sources', []):
        stitle = (s.get('title') or '').lower()
        stype = (s.get('type') or '').lower()
        is_written = any(k in stitle or k in stype for k in written_kw)
        is_photo = any(k in stitle for k in ['photograph', 'photo', 'picture', 'poster', 'map', 'diagram'])
        if is_written and not is_photo and (not s.get('text') or len(s.get('text').strip()) == 0):
            print(f"MISSING TEXT: L{li+1} [{s.get('letter')}] {s.get('id')}: {s.get('title')}")
        if 'portraits/' in (s.get('image') or ''):
            print(f"PORTRAIT: L{li+1} [{s.get('letter')}] {s.get('id')}: {s.get('image')} | Title: {s.get('title')}")

