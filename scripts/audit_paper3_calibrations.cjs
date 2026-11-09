// scripts/audit_paper3_calibrations.cjs
const fs = require('fs');

function countWords(str) {
  if (!str) return 0;
  return str.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
}

function auditUnit(name, path) {
  console.log(`\n================ AUDIT: ${name} ================`);
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  let totalQs = 0;
  let passed = 0;
  let failed = 0;

  data.lessons.forEach(l => {
    (l.exam_practice?.questions || []).forEach((q, idx) => {
      totalQs++;
      const qNum = idx + 1;
      const qType = q.type || 'q';
      const modelWords = countWords(q.model);
      const tiers = Object.keys(q.model_tiers || {});

      let minW = 0, maxW = 999;
      if (qType.includes('4m') || q.marks === 4) { minW = 45; maxW = 65; }
      else if (qType.includes('8m') || q.marks === 8) { minW = 165; maxW = 185; }
      else if (qType.includes('12m') || q.marks === 12) { minW = 200; maxW = 240; }
      else if (qType.includes('16m') || q.marks === 16) { minW = 240; maxW = 280; }

      const inRange = modelWords >= minW && modelWords <= maxW;
      const topTierKey = tiers[tiers.length - 1];
      const topTierWords = countWords(q.model_tiers?.[topTierKey]?.text);
      const matchesTop = q.model === q.model_tiers?.[topTierKey]?.text;
      const hasScholar = tiers.some(t => t.includes('10m') || t.includes('20m'));

      if (inRange && matchesTop && !hasScholar && tiers.length === 3) {
        passed++;
        console.log(`✅ [${l.id}] Q${qNum} (${qType}) | ${modelWords}w [${minW}-${maxW}] | 3 tiers: ${tiers.join(', ')}`);
      } else {
        failed++;
        console.error(`❌ [${l.id}] Q${qNum} (${qType}) | model:${modelWords}w [${minW}-${maxW}] | top:${topTierWords}w | match:${matchesTop} | tiers:${tiers.join(', ')} | scholar:${hasScholar}`);
      }
    });
  });

  console.log(`\nSUMMARY for ${name}: ${passed}/${totalQs} PASSED (${failed} failed)`);
  return failed === 0;
}

const usaOk = auditUnit('USA (1954-1975)', 'data/usa.json');
const gerOk = auditUnit('Weimar & Nazi Germany', 'data/weimar_nazi_germany.json');

if (usaOk && gerOk) {
  console.log('\n🎉 ALL PAPER 3 EXAM QUESTIONS ARE 100% CALIBRATED AND COMPLIANT!');
} else {
  console.error('\n⚠️ SOME QUESTIONS FAILED AUDIT.');
  process.exit(1);
}
