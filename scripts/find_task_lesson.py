with open('public/units/usa/data.js', encoding='utf-8') as f:
    lines = f.readlines()
for i in range(11884, 0, -1):
    line = lines[i]
    if '"id": "lesson_' in line or '"title": "KT' in line:
        print(f'Line {i+1}: {line.strip()}')
        break
