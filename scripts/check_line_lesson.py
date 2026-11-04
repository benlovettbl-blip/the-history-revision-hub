with open('units/usa/data.js', encoding='utf-8') as f:
    lines = f.readlines()
for i in range(11682, 0, -1):
    if '"id": "lesson_' in lines[i]:
        print(f"Line {i+1}: {lines[i].strip()}")
        break

