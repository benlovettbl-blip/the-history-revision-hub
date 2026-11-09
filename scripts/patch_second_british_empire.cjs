const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'render_standard_textbook_second_british_empire.cjs');
let code = fs.readFileSync(file, 'utf8');

// 1. Cover hero height: from 94mm to 98mm
code = code.replace(/height:\s*94mm;/g, 'height: 98mm;');

// 2. Directory table padding: from 4.5px 8px to 5.6px 8px
code = code.replace(/padding:\s*4\.5px\s*8px;/g, 'padding: 5.6px 8px;');

// 3. Remove flex: 1 from .prose-columns
code = code.replace(
  /\.prose-columns\s*\{([^}]*?)flex:\s*1;([^}]*?)\}/s,
  '.prose-columns {$1$2}'
);

// 4. Update Auto-Balancer loop
const oldLoopRegex = /const lessonPages = document\.querySelectorAll\('\.page-lesson'\);[\s\S]*?sections\.forEach\(\(s\) => \(s\.style\.marginBottom = margin\.toFixed\(1\) \+ 'px'\)\);\s*\}\s*\}\);/;

const newLoop = `const lessonPages = document.querySelectorAll('.page-lesson');
    lessonPages.forEach((p) => {
      const footer = p.querySelector('.running-footer');
      const footerTop = footer ? footer.getBoundingClientRect().top : p.clientHeight - 30;
      const prose = p.querySelector('.prose-columns');
      const proseEls = Array.from(p.querySelectorAll('.block-prose .prose-p, .block-prose p, .block-prose'));
      const sections = Array.from(p.querySelectorAll('.block-section'));
      if (!prose || !proseEls.length || !footer) return;

      let best = null;
      for (let s = 9.8; s <= 12.6; s += 0.05) {
        const lh = (1.40 + (s - 9.8) * 0.045).toFixed(2);
        const mb = (3.5 + (s - 9.8) * 1.4).toFixed(1);
        const pMb = (3.0 + (s - 9.8) * 0.8).toFixed(1);

        proseEls.forEach((el) => {
          el.style.fontSize = s.toFixed(2) + 'pt';
          el.style.lineHeight = lh;
          if (el.classList.contains('prose-p')) el.style.marginBottom = pMb + 'px';
        });
        sections.forEach((sec) => {
          sec.style.marginBottom = mb + 'px';
        });

        const bDiff = p.scrollHeight - p.clientHeight;
        const colDiff = prose.scrollHeight - prose.clientHeight;
        const allChildren = Array.from(
          p.querySelectorAll('.block-section, p, .block-header, .block-workbook-question')
        );
        const maxChildB = allChildren.length ? Math.max(...allChildren.map((c) => c.getBoundingClientRect().bottom)) : 0;
        const proseB = prose.getBoundingClientRect().bottom;
        const maxB = Math.max(maxChildB, proseB);
        const clearance = Math.round(footerTop - maxB);

        if (bDiff <= 0 && colDiff <= 0 && clearance >= 35) {
          best = { s, lh, mb, pMb, clearance };
        }
      }

      if (best) {
        proseEls.forEach((el) => {
          el.style.fontSize = best.s.toFixed(2) + 'pt';
          el.style.lineHeight = best.lh;
          if (el.classList.contains('prose-p')) el.style.marginBottom = best.pMb + 'px';
        });
        sections.forEach((sec) => {
          sec.style.marginBottom = best.mb + 'px';
        });
      }
    });`;

if (oldLoopRegex.test(code)) {
  code = code.replace(oldLoopRegex, newLoop);
  console.log('✅ Replaced Auto-Balancer in second_british_empire!');
} else {
  console.log('⚠️ Could not match oldLoopRegex in second_british_empire');
}

fs.writeFileSync(file, code, 'utf8');
console.log('Saved patched render_standard_textbook_second_british_empire.cjs');
