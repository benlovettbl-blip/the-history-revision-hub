const fs = require('fs');
const path = require('path');

const units = ['cme_new', 'edexcel_medicine', 'weimar_nazi_germany', 'eee', 'usa'];

units.forEach(u => {
  const p = path.join(__dirname, '..', `units/${u}/data.js`);
  const raw = fs.readFileSync(p, 'utf8');
  
  // Transform ES export default to module.exports
  // Remove imports if any
  const cjs = raw
    .replace(/^\s*import\s+.*?;\s*$/gm, '')
    .replace(/export\s+default\s+/, 'module.exports = ');
  
  const m = { exports: {} };
  try {
    const fn = new Function('module', 'exports', cjs);
    fn(m, m.exports);
    const data = m.exports;
    
    // Count lessons and narrative blocks
    let lessonCount = 0;
    let blockCount = 0;
    let totalWords = 0;

    const lessons = Array.isArray(data.lessons) ? data.lessons : [];
    lessonCount = lessons.length;

    lessons.forEach(l => {
      const blocks = Array.isArray(l.narrative_blocks) ? l.narrative_blocks : [];
      blockCount += blocks.length;
      blocks.forEach(b => {
        let text = b.text || b.content || '';
        if (Array.isArray(b.paragraphs)) {
          text += ' ' + b.paragraphs.join(' ');
        }
        const clean = text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
        totalWords += clean.split(/\s+/).filter(w => w.length > 0).length;
      });
    });

    console.log(`✅ Loaded ${u.padEnd(20)}: ${lessonCount} lessons, ${blockCount} narrative blocks, ${totalWords.toLocaleString()} total narrative words.`);
  } catch (err) {
    console.error(`❌ Error loading ${u}:`, err.message);
  }
});

