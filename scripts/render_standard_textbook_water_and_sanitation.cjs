/**
 * scripts/render_standard_textbook_water_and_sanitation.cjs
 *
 * KS3: Water and Sanitation Through Time (AD 43–Present)
 * 12-Page Master Classroom Companion Textbook
 *
 * Adheres strictly to the KS3 12-Page Pure Narrative Standard:
 * - Page 1: Master Front Cover with 108mm hero plate & 7-Enquiry Reading Directory
 * - Page 2: Master Chronological Milestone Spine (16 Turning Points, zero maps)
 * - Page 3: Spatial Geography & Hampshire Fieldwork Context (Fishbourne, Titchfield, Thames, Eastney)
 * - Pages 4–10: Seven Canonical Enquiries (1 page per enquiry, 2-column balanced Lora serif, badge-free narrative block questions)
 * - Page 11: Disciplinary Historiography & 8 Core Conceptual Anchors
 * - Page 12: 35-Question Master Knowledge Retrieval Quiz Back Cover (zero answers printed)
 *
 * Proxies to canonical 12-page engine: scripts/render_water_and_sanitation_12page_textbook.cjs
 */

const { main, generateTextbookHtml } = require('./render_water_and_sanitation_12page_textbook.cjs');

if (require.main === module) {
  main().catch((err) => {
    console.error('Fatal execution error in water and sanitation textbook:', err);
    process.exit(1);
  });
}

module.exports = { main, generateTextbookHtml };
