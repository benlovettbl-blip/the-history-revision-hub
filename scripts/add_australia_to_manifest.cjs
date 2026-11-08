const fs = require('fs');
const path = require('path');

const publicManifestPath = path.join(__dirname, '..', 'public', 'data', 'infographics_manifest.json');
const distManifestPath = path.join(__dirname, '..', 'dist', 'data', 'infographics_manifest.json');
const dbPath = path.join(__dirname, '..', 'public', 'database.json');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const ausLessons = db.australia.data.lessons;

const australiaInfographics = ausLessons.map((l, idx) => {
  const lessonNum = idx + 1;
  const stages = l.workbook_stages || [];
  const keyPoints = stages.map(s => `${s.date || 'Key Event'}: ${s.heading || s.title || ''}`);
  
  return {
    unit: 'australia',
    lessonId: `lesson_${lessonNum}`,
    slug: `australia_lesson_${lessonNum}`,
    title: l.title,
    topic: `Key Stage 3 • The History of Australia (1770–1901) • Lesson ${lessonNum}`,
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: keyPoints.length > 0 ? keyPoints : [
      'Comprehensive five-stage enquiry into First Nations custodianship, colonisation, and resistance.',
      'Archival visual evidence analyzed alongside verbatim historical written extracts.',
      'Causal domino chronology mapping decision-making and structural transformation.'
    ],
    image: l.card_image || '/images/francis_fowkes_sydney_cove_1788.jpg',
    interactiveUrl: `/interactive_mats/viewer.html?unit=australia&lesson=${lessonNum}`,
    fileSizeKb: 140,
    hingeQuestion: l.enquiry || l.title,
    modelAnswer: l.tasks?.[0]?.model_answer || l.tasks?.[0]?.model || l.exam_practice?.questions?.[0]?.model_answer || ''
  };
});

function updateManifest(filePath) {
  if (!fs.existsSync(filePath)) return;
  const manifest = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  manifest.australia = australiaInfographics;
  manifest.generated_at = new Date().toISOString();
  fs.writeFileSync(filePath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`✅ Updated ${filePath} with ${australiaInfographics.length} Australia infographics.`);
}

updateManifest(publicManifestPath);
updateManifest(distManifestPath);

