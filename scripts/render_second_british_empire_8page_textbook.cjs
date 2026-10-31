/**
 * scripts/render_second_british_empire_8page_textbook.cjs
 *
 * Proxy entry point for The Second British Empire 8-Page Master Textbook.
 */
const { run, buildHtml } = require('./render_standard_textbook_second_british_empire.cjs');

if (require.main === module) {
  run().catch((err) => {
    console.error('Fatal error during compilation:', err);
    process.exit(1);
  });
}

module.exports = { run, buildHtml };
