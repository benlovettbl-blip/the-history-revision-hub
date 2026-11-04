import json
import re

with open('units/usa/data.js', encoding='utf-8') as f:
    text = f.read()

# Let's inspect each lesson by extracting title, hook_text, exam_practice, gcse_task, flashcards, vocab_cloze
# Since data.js is a JS file, let's load public/database.json where it was built
with open('public/database.json', encoding='utf-8') as f:
    db = json.load(f)

usa = db['usa']['data']
lessons = usa['lessons']

print(f"Total lessons: {len(lessons)}")
for i, l in enumerate(lessons):
    title = l.get('title', '')
    lid = l.get('id', '')
    
    # Check flashcards
    flashcards = l.get('flashcards', [])
    fc_terms = [fc.get('term', '') for fc in flashcards]
    
    # Check vocab cloze
    cloze = l.get('vocab_cloze_text', '')[:80]
    
    # Check exam practice
    ep = l.get('exam_practice', {})
    ep_q = ""
    if 'questions' in ep and len(ep['questions']) > 0:
        ep_q = ep['questions'][0].get('question', '')[:90]
    
    # Check gcse task
    gt = l.get('gcse_task', {})
    gt_q = ""
    if 'tasks' in gt and len(gt['tasks']) > 0:
        gt_q = gt['tasks'][0].get('text', '')[:90]
        
    print(f"\n==========================================")
    print(f"L{i+1}: {lid} -> {title}")
    print(f"  Flashcards ({len(fc_terms)}): {', '.join(fc_terms[:3])} ...")
    print(f"  Cloze preview: {cloze}...")
    print(f"  Exam Practice Q: {ep_q}")
    print(f"  GCSE Task Q: {gt_q}")

