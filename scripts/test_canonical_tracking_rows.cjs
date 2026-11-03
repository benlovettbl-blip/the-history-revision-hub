const fs = require('fs');
const path = require('path');
const { getCanonicalGCSESpec, UNIT_SPEC_MAP, highlightKeyTerms } = require('./components/get_canonical_spec.cjs');

const dbPath = path.join(__dirname, '..', 'public', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

function getLessonEnquiry(l) {
  if (!l) return '';
  if (l.enquiry_question && typeof l.enquiry_question === 'string') return l.enquiry_question.trim();
  if (l.enquiryQuestion && typeof l.enquiryQuestion === 'string') return l.enquiryQuestion.trim();
  if (l.enquiry && typeof l.enquiry === 'string') {
    const text = l.enquiry.trim();
    if (text.split(/\s+/).length > 35) {
      const qMatch = text.match(/([^.?!]+[?])/g);
      if (qMatch && qMatch.length > 0) return qMatch[qMatch.length - 1].trim();
    }
    return text;
  }
  if (l.hook_text && typeof l.hook_text === 'string') {
    const qMatch = l.hook_text.trim().match(/([^.?!]+[?])/g);
    if (qMatch && qMatch.length > 0) return qMatch[qMatch.length - 1].trim();
  }
  return '';
}

function getCanonicalTrackingRows(unitId, keyTopicNum = 1) {
  const spec = getCanonicalGCSESpec(unitId, keyTopicNum);
  const unit = db[unitId]?.data;
  const allLessons = unit?.lessons || [];

  let lessons = [];
  if (unitId === 'edexcel_medicine') {
    const eraPrefixes = ['lesson_1_', 'lesson_2_', 'lesson_3_', 'lesson_4_', 'lesson_5_'];
    const targetPrefix = eraPrefixes[keyTopicNum - 1];
    lessons = allLessons.filter(l => l.id && l.id.startsWith(targetPrefix));
  } else if (unitId === 'cme_new' || unitId === 'middle_east') {
    if (keyTopicNum === 1) lessons = allLessons.slice(0, 4);
    else if (keyTopicNum === 2) lessons = allLessons.slice(4, 9);
    else if (keyTopicNum === 3) lessons = allLessons.slice(9, 13);
  } else {
    // Standard 4-lesson units: weimar, usa, eee
    const prefix = `lesson_${keyTopicNum}_`;
    lessons = allLessons.filter(l => l.id && l.id.startsWith(prefix));
    if (lessons.length === 0) {
      // Fallback slice: (keyTopicNum - 1) * 4 to keyTopicNum * 4
      lessons = allLessons.slice((keyTopicNum - 1) * 4, keyTopicNum * 4);
    }
  }

  const rows = [];
  const subtopics = spec.subtopics || [];

  lessons.forEach((l, idx) => {
    let title = l.title || `Enquiry ${idx + 1}`;
    // Format title as KT X.Y: ...
    if (!/^KT\s*\d+\.\d+/i.test(title)) {
      title = `KT ${keyTopicNum}.${idx + 1}: ${title.replace(/^(?:Enquiry|Lesson)\s*\d+:\s*/i, '').trim()}`;
    }

    const enquiry = getLessonEnquiry(l);

    // Map to literal spec points:
    let specPoints = [];
    if (subtopics.length === lessons.length) {
      // 1-to-1 match (e.g. Weimar, USA, EEE)
      specPoints = subtopics[idx]?.items || [];
    } else if (subtopics.length > 0) {
      // Thematic mapping: distribute or pick corresponding subtopic
      const sIdx = Math.min(idx, subtopics.length - 1);
      specPoints = subtopics[sIdx]?.items || [];
    }

    // Join spec points into concise, punchy bulleted string
    let specText = specPoints.join(' &bull; ');
    if (!specText && l.specification_anchor) {
      specText = highlightKeyTerms(l.specification_anchor);
    }

    rows.push({
      title,
      enquiry,
      specText,
      lessonId: l.id
    });
  });

  const specCode = UNIT_SPEC_MAP[unitId]?.code || '1HI0';
  const frameworkTitle = `Key Topic ${keyTopicNum} Specification Framework (Edexcel ${specCode})`;

  return {
    frameworkTitle,
    rows
  };
}

console.log('Testing getCanonicalTrackingRows across GCSE units:');
['cme_new', 'edexcel_medicine', 'weimar_nazi_germany', 'usa', 'eee'].forEach(u => {
  console.log(`\n================== ${u.toUpperCase()} KT1 ==================`);
  const res = getCanonicalTrackingRows(u, 1);
  console.log('Header:', res.frameworkTitle);
  res.rows.forEach((r, i) => {
    console.log(`Row ${i + 1}: [${r.title}]`);
    console.log(`  Enquiry: "${r.enquiry}"`);
    console.log(`  Spec: ${r.specText.slice(0, 100)}...`);
  });
});

