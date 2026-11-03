const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

async function auditCovers() {
  console.log('========================================================================');
  console.log('📋 AUDIT 3: FRONT COVER METADATA, EXAM CODES, TIMINGS & MARKS');
  console.log('========================================================================\n');

  const papers = [
    // USA
    ...Array.from({ length: 13 }, (_, i) => ({
      path: `public/pdfs/mocks/usa/usa_mock_${i + 1}_question_booklet.pdf`,
      id: `usa_mock_${i + 1}`,
      expectedCode: '1HI0/33',
      expectedTime: '1 hour 30 minutes',
      expectedMarks: '56'
    })),
    // Weimar
    ...['mock_adapted_2026', 'mock_notebook_1', 'mock_notebook_2', 'mock_notebook_3'].map(id => ({
      path: `public/pdfs/mocks/weimar_nazi_germany/${id}_question_booklet.pdf`,
      id,
      expectedCode: '1HI0/31',
      expectedTime: '1 hour 30 minutes',
      expectedMarks: '56'
    })),
    // Medicine
    ...['mock_2025_clone', 'mock_a_2026_predict', 'mock_b_2026_predict', 'mock_c_2026_predict'].map(id => ({
      path: `public/pdfs/mocks/edexcel_medicine/${id}_question_booklet.pdf`,
      id,
      expectedCode: '1HI0/11',
      expectedTime: '1 hour 20 minutes',
      expectedMarks: '52'
    })),
    // CME
    ...['cme_mock_a', 'cme_mock_b', 'cme_mock_c', 'cme_mock_d', 'cme_mock_e', 'cme_mock_radar'].map(id => ({
      path: `public/pdfs/mocks/cme_new/${id}.pdf`,
      id,
      expectedCode: '1HI0/P5',
      expectedTime: '1 hour 50 minutes',
      expectedMarks: '32'
    })),
    // EEE
    ...['eee_mock_2026', 'eee_mock_b', 'eee_mock_c', 'eee_mock_d', 'eee_notebook_1', 'eee_notebook_2', 'eee_notebook_3'].map(id => ({
      path: `public/pdfs/mocks/eee/${id}.pdf`,
      id,
      expectedCode: '1HI0/B4',
      expectedTime: '1 hour 50 minutes',
      expectedMarks: '32'
    }))
  ];

  let errors = [];

  for (const p of papers) {
    if (!fs.existsSync(p.path)) {
      errors.push(`Missing: ${p.path}`);
      continue;
    }
    const buf = fs.readFileSync(p.path);
    const data = await pdfParse(buf);
    const text = data.text;
    const coverText = text.slice(0, 1500).replace(/\s+/g, ' ');

    if (!coverText.includes(p.expectedCode)) {
      errors.push(`${p.id}: Expected paper code "${p.expectedCode}" not found on cover!`);
    }
    if (p.expectedTime && !coverText.includes(p.expectedTime)) {
      errors.push(`${p.id}: Expected time "${p.expectedTime}" not found on cover!`);
    }
    if (p.expectedMarks && !coverText.includes(p.expectedMarks)) {
      errors.push(`${p.id}: Expected total marks "${p.expectedMarks}" not found on cover!`);
    }
  }

  if (errors.length === 0) {
    console.log(`✅ ALL ${papers.length} QUESTION PAPERS HAVE 100% ACCURATE COVER METADATA!`);
  } else {
    console.log(`❌ Cover Errors (${errors.length}):`);
    errors.forEach(e => console.log('  -', e));
  }
}

auditCovers().catch(console.error);

