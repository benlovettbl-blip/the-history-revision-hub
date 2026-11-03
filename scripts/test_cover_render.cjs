const { renderStandardFrontCover } = require('./components/render_standard_cover.cjs');

[2, 3].forEach(ktNum => {
  const html = renderStandardFrontCover({
    unitId: 'cme_new',
    keyTopicNum: ktNum,
    title: `Key Topic ${ktNum} Title`,
    heroImage: { src: '/images/test.jpg', alt: 'Test' }
  });

  console.log(`\n=================== CME KEY TOPIC ${ktNum} ===================`);
  const colBlocks = [...html.matchAll(/<div class="spec-column-box"[\s\S]*?<\/div>\s*<\/div>/g)];
  colBlocks.forEach((col, cIdx) => {
    const titleMatch = col[0].match(/<strong[^>]*>([\s\S]*?)<\/strong>/);
    console.log(`\nColumn ${cIdx + 1}: ${titleMatch ? titleMatch[1].trim() : 'Unknown'}`);
    const bulletMatches = [...col[0].matchAll(/<span style="flex: 1;[^>]*>([\s\S]*?)<\/span>/g)];
    bulletMatches.forEach((b, bIdx) => {
      console.log(`  • ${b[1].trim()}`);
    });
  });
});
