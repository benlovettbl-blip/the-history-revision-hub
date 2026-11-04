import json

with open('public/database.json', encoding='utf-8') as f:
    db = json.load(f)

usa = db['usa']['data']
lessons = usa['lessons']

for i, l in enumerate(lessons):
    print(f"\n==========================================")
    print(f"L{i+1}: {l.get('id')} - {l.get('title')}")
    stages = l.get('stages', [])
    for s_idx, s in enumerate(stages):
        stitle = s.get('title', '')
        senq = s.get('enquiry', '')
        print(f"   Stage {s_idx+1}: {stitle} | Enquiry: {senq[:60]}")

