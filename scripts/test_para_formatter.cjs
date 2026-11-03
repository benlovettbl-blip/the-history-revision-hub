function formatNarrativeParagraphs(contentStr, decimalRef, showParaNumber) {
  if (!contentStr || typeof contentStr !== 'string') return contentStr;

  // 1. Normalize existing <span class="para-ref"> tags to extract clean decimal
  contentStr = contentStr.replace(/<span\s+class=["']para-ref["']>\s*\[?\s*(\d+\.\d+)\s*\]?\s*<\/span>/gi, (match, num) => {
    return `<span class="narrative-para-pill" id="para-${num.replace('.', '-')}" data-para="${num}">${num}</span>`;
  });

  // 2. Normalize raw [X.Y] bracket numbers
  contentStr = contentStr.replace(/(^|>|\s)\[\s*(\d+\.\d+)\s*\]/g, (match, prefix, num) => {
    return `${prefix}<span class="narrative-para-pill" id="para-${num.replace('.', '-')}" data-para="${num}">${num}</span>`;
  });

  // 3. If no leading paragraph pill exists at the start and showParaNumber is true, prepend decimalRef
  if (showParaNumber && decimalRef && !contentStr.includes('narrative-para-pill')) {
    contentStr = `<span class="narrative-para-pill" id="para-${decimalRef.replace('.', '-')}" data-para="${decimalRef}">${decimalRef}</span> ` + contentStr;
  }

  return contentStr;
}

const sampleMed = '<span class="para-ref">[3.1]</span> Paradoxically, the conquest of pain triggered the disastrous "Black Period"...<br><br><span class="para-ref">[3.2]</span> However, because surgeons still knew nothing of germs...';
console.log('--- Sample Medicine ---');
console.log(formatNarrativeParagraphs(sampleMed, '3.1', true));

const sampleWeimar = '<p><span class="para-ref">[1.1]</span> By autumn 1918...<br><br>[1.2] Second para...';
console.log('\n--- Sample Weimar ---');
console.log(formatNarrativeParagraphs(sampleWeimar, '1.1', true));

const samplePlain = 'Paradoxically, the conquest of pain triggered...';
console.log('\n--- Sample Plain ---');
console.log(formatNarrativeParagraphs(samplePlain, '3.1', true));

