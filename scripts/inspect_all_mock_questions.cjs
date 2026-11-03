const fs = require('fs');
const path = require('path');

const units = [
  { name: 'USA', dir: 'data/raw_mocks/usa' },
  { name: 'Weimar', dir: 'data/raw_mocks/weimar_nazi_germany' },
  { name: 'Medicine', dir: 'data/raw_mocks/edexcel_medicine' },
  { name: 'CME', dir: 'data/raw_mocks/cme_new' },
  { name: 'EEE', dir: 'data/raw_mocks/eee' },
];

for (const unit of units) {
  if (!fs.existsSync(unit.dir)) continue;
  console.log(`\n======================================================`);
  console.log(`UNIT: ${unit.name} (${unit.dir})`);
  console.log(`======================================================`);
  const files = fs.readdirSync(unit.dir).filter(f => f.endsWith('.html'));
  for (const f of files) {
    const content = fs.readFileSync(path.join(unit.dir, f), 'utf8');
    console.log(`\n--- ${f} ---`);
    
    // Look for all questions in this mock
    // Questions typically have: Explain why, How far do you agree, Describe two features, Give two things, Two consequences, Write an analytical narrative
    const regex = /(?:<div[^>]*class="[^"]*question-title[^"]*"[^>]*>|<h[234][^>]*>|<b>\s*(?:Question|\d+\b))([\s\S]*?)(?=(?:<div[^>]*class="[^"]*question-title[^"]*"[^>]*>|<h[234][^>]*>|<b>\s*(?:Question|\d+\b)|<div[^>]*class="page"|<\/body>|$))/gi;
    
    // Also extract bullets directly:
    const bulletBlocks = content.matchAll(/(Explain why|How far do you agree|Write an analytical narrative|Describe two features)[\s\S]*?(?:You may use the following|You must also use)[\s\S]*?<ul>([\s\S]*?)<\/ul>/gi);
    for (const b of bulletBlocks) {
      const qText = b[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const bullets = Array.from(b[2].matchAll(/<li>([\s\S]*?)<\/li>/gi)).map(m => m[1].replace(/<[^>]+>/g, '').trim());
      console.log(`  [QUESTION STIMULUS CHECK]:`);
      console.log(`    Context snippet: ${qText.slice(0, 140)}...`);
      console.log(`    Bullets: ${JSON.stringify(bullets)}`);
    }
  }
}

