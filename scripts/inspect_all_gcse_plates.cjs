const fs = require('fs');
const path = require('path');

(async () => {
  let output = '';
  for (const u of ['cme_new', 'eee', 'weimar_nazi_germany']) {
    const fullPath = path.resolve(__dirname, '..', 'units', u, 'data.js');
    const mod = await import('file:///' + fullPath.replace(/\\/g, '/'));
    const d = mod.default || mod.data;
    output += `\n========================================\nUNIT: ${u.toUpperCase()}\n========================================\n`;
    d.lessons.forEach((l, idx) => {
      const lTitle = l.title || l.lesson_title;
      (l.narrative_blocks || []).forEach(b => {
        if (b.image) {
          output += `L${idx+1}: ${lTitle}\n`;
          output += `   Act ${b.act}: "${b.title}"\n`;
          output += `   Img: ${b.image}\n`;
          output += `   Cap: ${b.caption}\n`;
          const textClean = (b.text || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);
          output += `   Txt: ${textClean}...\n`;
          output += `----------------------------------------\n`;
        }
      });
    });
  }
  fs.writeFileSync(path.resolve(__dirname, 'all_gcse_plates.txt'), output, 'utf8');
  console.log('Saved utf8 all_gcse_plates.txt');
})();
