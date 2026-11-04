for p in ['units/usa/data.js', 'public/units/usa/data.js', 'data/usa.json', 'public/data/usa.json']:
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace('Congress.\\"\\n\\nPresident', 'Congress.\\"<br><br>President')
    c = c.replace('Congress.\\"\\\\n\\\\nPresident', 'Congress.\\"<br><br>President')
    with open(p, 'w', encoding='utf-8') as f:
        f.write(c)
print('Replaced \\\\n\\\\n with <br><br> in all files.')

