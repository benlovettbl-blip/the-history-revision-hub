const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'render_monarchy_religion_power_8page_textbook.cjs');
let code = fs.readFileSync(file, 'utf8');

// 1. Add formatBlockParas
if (!code.includes('function formatBlockParas')) {
  code = code.replace(
    'function cleanProse(text) {',
    `function formatBlockParas(htmlText) {
  if (!htmlText) return '';
  const matches = htmlText.match(/<p>([\\s\\S]*?)<\\/p>/gi);
  if (matches && matches.length > 0) {
    return matches
      .map((m) => {
        let inner = m.replace(/<\\/?p>/gi, '');
        inner = cleanProse(inner);
        return \`<p class="prose-p">\${inner}</p>\`;
      })
      .join('\\n');
  }
  return \`<p class="prose-p">\${cleanProse(htmlText)}</p>\`;
}

function cleanProse(text) {`
  );
}

// 2. Cover hero height
code = code.replace(/height:\s*80mm;/g, 'height: 89mm;');

// 3. Directory table padding
code = code.replace(/padding:\s*4\.5px\s*8px;/g, 'padding: 5.5px 8px;');

// 4. block-prose CSS
code = code.replace(
  /\.block-prose\s*\{[\s\S]*?\/\* Calibrated base styling per enquiry \*\//,
  `.block-prose {
      font-family: 'Lora', Georgia, serif;
      color: #1e293b;
      margin: 0;
    }

    .block-prose .prose-p {
      font-family: 'Lora', Georgia, serif;
      color: #1e293b;
      margin: 0 0 5px 0;
      text-align: justify;
      text-justify: inter-word;
      hyphens: auto;
    }

    .block-prose .prose-p:last-child {
      margin-bottom: 0;
    }

    .block-prose strong, .block-prose .prose-p strong {
      font-weight: 700;
      color: #0f172a;
    }

    /* Calibrated typography */
    .block-section { margin-bottom: 6px; }
    .block-prose .prose-p { font-size: 11.2pt; line-height: 1.50; }

    /* Calibrated base styling per enquiry */`
);

// 5. Replace HTML template
code = code.replace(
  /<p class="block-prose">\$\{prose\}<\/p>/g,
  `<div class="block-prose">
                  \${formatBlockParas(block.text)}
                </div>`
);

// 6. Replace Auto-balancer loop
const oldLoopRegex = /const lessonPages = document\.querySelectorAll\('\.page-lesson'\);[\s\S]*?sections\.forEach\(\(s\) => \(s\.style\.marginBottom = secMargin\.toFixed\(1\) \+ 'px'\)\);\s*\}\s*\}\);/;

const newLoop = `const lessonPages = document.querySelectorAll('.page-lesson');
    lessonPages.forEach((p) => {
      const footer = p.querySelector('.running-footer');
      const footerTop = footer ? footer.getBoundingClientRect().top : p.clientHeight - 30;
      const prose = p.querySelector('.prose-columns');
      const proseEls = Array.from(p.querySelectorAll('.block-prose .prose-p, .block-prose p'));
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
  console.log('✅ Replaced Auto-Balancer in monarchy_religion_power!');
} else {
  console.log('⚠️ Could not match oldLoopRegex');
}

fs.writeFileSync(file, code, 'utf8');
console.log('Saved patched render_monarchy_religion_power_8page_textbook.cjs');

