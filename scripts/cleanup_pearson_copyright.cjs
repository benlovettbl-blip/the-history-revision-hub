const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// Replacements to apply
const replacements = [
  // Specific exact phrases first
  {
    search: /Official Pearson Edexcel Examination Series/gi,
    replace: 'Edexcel GCSE Examination Series'
  },
  {
    search: /Official Pearson Past Exam Questions/gi,
    replace: 'Edexcel Past Exam Questions'
  },
  {
    search: /Official Pearson Mark Scheme Model/gi,
    replace: 'Edexcel Mark Scheme Benchmark Model'
  },
  {
    search: /Pearson Verbatim Benchmark Model/gi,
    replace: 'Specification Benchmark Model'
  },
  {
    search: /Official Pearson Mark Scheme/gi,
    replace: 'Edexcel Mark Scheme'
  },
  {
    search: /Official Pearson Question Stem/gi,
    replace: 'Edexcel Exam Question Stem'
  },
  {
    search: /Official Pearson Archive/gi,
    replace: 'Edexcel Exam Paper Archive'
  },
  {
    search: /OFFICIAL PEARSON ARCHIVE/g,
    replace: 'EDEXCEL EXAM ARCHIVE'
  },
  {
    search: /Official Pearson Past Papers/gi,
    replace: 'Edexcel Past Papers Archive'
  },
  {
    search: /Official Pearson Candidate Details Box/gi,
    replace: 'Edexcel Style Candidate Details Box'
  },
  {
    search: /Official Pearson Examination Header/gi,
    replace: 'Edexcel Style Examination Header'
  },
  {
    search: /Official Pearson Edexcel Specification Structure/gi,
    replace: 'Edexcel GCSE Specification Structure'
  },
  {
    search: /Official Pearson Edexcel Specification Revision Checklist/gi,
    replace: 'Edexcel Specification Revision Checklist'
  },
  {
    search: /Official Pearson Edexcel Specification/gi,
    replace: 'Edexcel GCSE Specification'
  },
  {
    search: /Official Pearson Edexcel/gi,
    replace: 'Edexcel'
  },
  {
    search: /official Pearson Edexcel/gi,
    replace: 'Edexcel'
  },
  {
    search: /official Pearson/gi,
    replace: 'Edexcel exam board'
  },
  {
    search: /Official Pearson/gi,
    replace: 'Edexcel'
  }
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  for (const r of replacements) {
    if (r.search.test(content)) {
      content = content.replace(r.search, r.replace);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Cleaned: ${path.relative(ROOT, filePath)}`);
  }
}

// Target specific directories and files
const targets = [
  'src/exam_trend_matrix.js',
  'src/gcse_spec_tracker.js',
  'src/views.js',
  'public/marking_policy.html'
];

targets.forEach(rel => {
  const p = path.join(ROOT, rel);
  if (fs.existsSync(p)) {
    processFile(p);
  }
});

// Also scan units/**/*.html and data/raw_mocks/**/*.html
function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist') {
        walkDir(fullPath);
      }
    } else if (entry.isFile() && (entry.name.endsWith('.html') || entry.name.endsWith('.js'))) {
      processFile(fullPath);
    }
  }
}

walkDir(path.join(ROOT, 'units'));
walkDir(path.join(ROOT, 'data', 'raw_mocks'));
walkDir(path.join(ROOT, 'public', 'interactive_mats'));

console.log('\n🎉 Finished cleaning all "Official Pearson" phrases across the codebase.');

