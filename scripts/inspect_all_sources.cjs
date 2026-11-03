const fs = require('fs');
const path = require('path');

function extractBoxes(html, className) {
  const marker = 'class="' + className + '"';
  let pos = 0;
  const boxes = [];
  while ((pos = html.indexOf(marker, pos)) !== -1) {
    let start = html.lastIndexOf('<div', pos);
    let depth = 0;
    let end = -1;
    let i = start;
    while (i < html.length) {
      if (html.slice(i, i + 4) === '<div') {
        depth++;
        i += 4;
      } else if (html.slice(i, i + 6) === '</div>') {
        depth--;
        i += 6;
        if (depth === 0) {
          end = i;
          break;
        }
      } else {
        i++;
      }
    }
    if (end !== -1) {
      boxes.push(html.slice(start, end));
      pos = end;
    } else {
      pos += marker.length;
    }
  }
  return boxes;
}

console.log('=== CHECKING USA MOCKS ===');
const usaFiles = fs.readdirSync('data/raw_mocks/usa').filter(f => f.endsWith('.html'));
for (const f of usaFiles) {
  const html = fs.readFileSync('data/raw_mocks/usa/' + f, 'utf8');
  const boxes = extractBoxes(html, 'source-box');
  console.log(`${f}: source-boxes count = ${boxes.length}`);
  boxes.forEach((b, idx) => {
    const text = b.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    console.log(`   Box ${idx} (${b.length} chars): ${text.slice(0, 90)}...`);
  });
}

console.log('\n=== CHECKING WEIMAR MOCKS ===');
const weimarFiles = fs.readdirSync('data/raw_mocks/weimar_nazi_germany').filter(f => f.endsWith('.html'));
for (const f of weimarFiles) {
  const html = fs.readFileSync('data/raw_mocks/weimar_nazi_germany/' + f, 'utf8');
  const boxes = extractBoxes(html, 'source-box');
  console.log(`${f}: source-boxes count = ${boxes.length}`);
  boxes.forEach((b, idx) => {
    const text = b.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    console.log(`   Box ${idx} (${b.length} chars): ${text.slice(0, 90)}...`);
  });
}

