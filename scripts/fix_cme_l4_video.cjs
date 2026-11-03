const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const files = [
  path.join(root, 'units', 'cme_new', 'data.js'),
  path.join(root, 'public', 'units', 'cme_new', 'data.js')
];

for (const f of files) {
  const raw = fs.readFileSync(f, 'utf8');
  const jsonStr = raw.replace(/^export\s+default\s+/, '').replace(/;?\s*$/, '');
  const data = JSON.parse(jsonStr);

  const l4 = data.lessons.find(l => l.id === 'lesson_4');
  if (l4 && l4.video) {
    const idx = l4.video.findIndex(v => v.url && v.url.includes('43DqkyuItH8'));
    if (idx !== -1) {
      l4.video[idx] = {
        type: "youtube",
        id: "KISRkue-NNU",
        url: "https://www.youtube.com/watch?v=KISRkue-NNU",
        title: "Egypt Grabs Suez (1956) | British Pathé",
        duration: "1 mins 33 secs",
        pathway: "Cinematic",
        teacher_guidance: "Recommended Watch Window: 00:00–01:33 | Lesson Phase: Primary Source Flashpoint | Tone Alert: Authentic 1956 British newsreel capturing President Nasser's historic speech in Alexandria nationalising the Suez Canal.",
        viewing_task: "[00:30] Primary Source Observation: How did Gamal Abdel Nasser announce the nationalisation of the Suez Canal to the cheering crowds in Alexandria?\n[01:10] Imperial Reaction: Why did Britain and France view the nationalisation of the canal as an intolerable strategic threat?",
        model_answer: "Nasser announced the nationalisation amidst ecstatic applause, declaring that Egyptian revenues from the canal would fund the construction of the Aswan High Dam. Britain and France viewed this as an intolerable crisis because the canal was the maritime lifeline for Middle Eastern oil to Western Europe and a vital symbol of imperial prestige."
      };
      console.log(`Replaced dead video in CME L4 in ${f}`);
    }
  }

  const updatedContent = 'export default ' + JSON.stringify(data, null, 2) + ';\n';
  fs.writeFileSync(f, updatedContent, 'utf8');
}

