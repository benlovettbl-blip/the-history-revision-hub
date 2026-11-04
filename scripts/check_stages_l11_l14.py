import json

with open('public/database.json', encoding='utf-8') as f:
    db = json.load(f)

lessons = db['usa']['data']['lessons']

for lid in ['lesson_3_3', 'lesson_3_4', 'lesson_4_1', 'lesson_4_2']:
    l = next(x for x in lessons if x['id'] == lid)
    print(f"\n==========================================")
    print(f"ID: {l['id']} - Title: {l['title']}")
    # print narrative blocks
    nb = l.get('narrative_blocks', [])
    print(f"Total narrative blocks: {len(nb)}")
    for i, b in enumerate(nb):
        print(f"  Block {i+1}: act_title: '{b.get('act_title')}' | title: '{b.get('title')}' | theme: '{b.get('theme_heading')}'")

