/**
 * scripts/render_great_war_part2_8page_textbook.cjs
 *
 * Proxy entry point for The Great War (Part 2: 1914–1919) 8-Page Master Textbook.
 */
const { run, buildHtml } = require('./render_standard_textbook_great_war_part2.cjs');

if (require.main === module) {
  run().catch((err) => {
    console.error('Fatal error during compilation:', err);
    process.exit(1);
  });
}

module.exports = { run, buildHtml };
