const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'render_standard_textbook_water_and_sanitation.cjs');
let code = fs.readFileSync(file, 'utf8');

// 1. Add formatBlockParas
if (!code.includes('function formatBlockParas')) {
  code = code.replace(
    'function cleanProse(text) {',
    `function formatBlockParas(htmlText) {
  if (!htmlText) return '';
  const matches = htmlText.match(/<p\\b[^>]*>([\\s\\S]*?)<\\/p>/gi);
  if (matches && matches.length > 0) {
    return matches
      .map((m) => {
        let inner = m.replace(/<\\/?p\\b[^>]*>/gi, '');
        inner = cleanProse(inner);
        inner = formatMarkdown(inner);
        return \`<p class="prose-p">\${inner}</p>\`;
      })
      .join('\\n');
  }
  const cleaned = cleanProse(htmlText);
  const paras = cleaned
    .split(/\\n\\s*\\n/)
    .map((p) => formatMarkdown(p.trim()))
    .filter(Boolean);
  if (paras.length === 0) return \`<p class="prose-p">\${formatMarkdown(cleaned)}</p>\`;
  return paras.map((p) => \`<p class="prose-p">\${p}</p>\`).join('\\n');
}

function cleanProse(text) {`
  );
  console.log('✅ Added formatBlockParas to water_and_sanitation!');
}

// 2. Fix CSS for .page-lesson-content and .prose-body
code = code.replace(
  /\.page-lesson-content\s*\{[\s\S]*?justify-content:\s*space-between;\s*\}/,
  `.page-lesson-content {
      padding: 6mm 14mm 4mm 14mm;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }`
);

code = code.replace(
  /\.prose-body\s*\{[\s\S]*?text-align:\s*justify;\s*\}/,
  `.prose-body {
      column-count: 2;
      column-gap: 6.5mm;
      column-fill: balance;
      text-align: justify;
    }`
);

// 3. Fix broken CSS from .block-workbook-question through .block-prose
const brokenCssRegex = /\.block-workbook-question\s*\{[\s\S]*?\/\* Calibrated base styling per enquiry \*\/\s*\.page-lesson-5[\s\S]*?margin-bottom:\s*3\.5px;\s*\}/;

const fixedCss = `.block-workbook-question {
      font-family: 'Playfair Display', Georgia, serif;
      font-style: italic;
      font-size: 7.5pt;
      color: #1e3a8a;
      break-after: avoid;
      page-break-after: avoid;
      margin-bottom: 2.5px;
      line-height: 1.25;
      padding-left: 5px;
      display: block;
    }

    .block-prose {
      font-family: 'Lora', Georgia, serif;
      color: #1e293b;
      margin: 0;
    }

    .block-prose .prose-p, .block-prose p {
      font-family: 'Lora', Georgia, serif;
      margin: 0 0 3px 0;
      text-indent: 0;
      break-inside: auto;
      page-break-inside: auto;
      orphans: 2;
      widows: 2;
      text-align: justify;
      text-justify: inter-word;
      hyphens: auto;
    }

    .block-prose .prose-p:last-child, .block-prose p:last-child {
      margin-bottom: 0;
    }

    .block-prose strong, .block-prose .prose-p strong {
      color: #0f172a;
      font-weight: 700;
    }`;

if (brokenCssRegex.test(code)) {
  code = code.replace(brokenCssRegex, fixedCss);
  console.log('✅ Replaced broken CSS in water_and_sanitation!');
} else {
  console.log('⚠️ Could not match brokenCssRegex');
}

// 4. Update block HTML to wrap in div.block-prose and formatBlockParas
code = code.replace(
  /<p class="block-prose">\$\{formattedText\}<\/p>/g,
  `<div class="block-prose">\${formatBlockParas(b.text)}</div>`
);

// 5. Replace Auto-balancer loop
const oldLoopRegex = /const lessonPages = document\.querySelectorAll\('\.page-lesson'\);[\s\S]*?sections\.forEach\(\(s\) => \(s\.style\.marginBottom = margin\.toFixed\(1\) \+ 'px'\)\);\s*\}\s*\}\);/;

const newLoop = `const lessonPages = document.querySelectorAll('.page-lesson');
    lessonPages.forEach((p) => {
      const footer = p.querySelector('.running-footer');
      const footerTop = footer ? footer.getBoundingClientRect().top : p.clientHeight - 30;
      const prose = p.querySelector('.prose-body');
      const proseEls = Array.from(p.querySelectorAll('.block-prose .prose-p, .block-prose p'));
      const sections = Array.from(p.querySelectorAll('.block-section'));
      if (!prose || !proseEls.length || !footer) return;

      let best = null;
      for (let s = 9.0; s <= 12.6; s += 0.05) {
        const lh = (1.38 + (s - 9.0) * 0.045).toFixed(2);
        const mb = (3.0 + (s - 9.0) * 1.2).toFixed(1);
        const pMb = (2.5 + (s - 9.0) * 0.8).toFixed(1);

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
      } else {
        // Fallback for denser lessons: step down from 8.95pt to 8.0pt
        for (let s = 8.95; s >= 8.0; s -= 0.05) {
          const lh = (1.34 + (s - 8.0) * 0.04).toFixed(2);
          const mb = 2.5;
          const pMb = 2.0;
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
          if (bDiff <= 0 && colDiff <= 0 && clearance >= 25) {
            best = { s, lh, mb, pMb, clearance };
            break;
          }
        }
      }
    });`;

if (oldLoopRegex.test(code)) {
  code = code.replace(oldLoopRegex, newLoop);
  console.log('✅ Replaced Auto-Balancer in water_and_sanitation!');
} else {
  console.log('⚠️ Could not match oldLoopRegex');
}

fs.writeFileSync(file, code, 'utf8');
console.log('Saved patched render_standard_textbook_water_and_sanitation.cjs');

