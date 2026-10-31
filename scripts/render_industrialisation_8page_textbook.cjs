/**
 * scripts/render_industrialisation_8page_textbook.cjs
 *
 * Proxy entry point for The Industrial Revolution 8-Page Master Textbook.
 */
const { run, buildHtml } = require('./render_standard_textbook_industrialisation.cjs');

if (require.main === module) {
  run().catch((err) => {
    console.error('Fatal error during compilation:', err);
    process.exit(1);
  });
}

module.exports = { run, buildHtml };
