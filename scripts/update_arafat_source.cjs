const fs = require('fs');

function updateDataFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  const oldTarget = `"id": "cme_l8_source_a",
              "letter": "A",
              "title": "Source A: Yasser Arafat in Military Battle Fatigues (1969)",
              "src": "/units/cme_new/assets/arafat_fatigues_1969.jpg",
              "image": "/units/cme_new/assets/arafat_fatigues_1969.jpg",
              "source": "/units/cme_new/assets/arafat_fatigues_1969.jpg",
              "caption": "Yasser Arafat in military battle fatigues and checkered kaffiyeh during a diplomatic and military summit following the 1968 Battle of Karameh (1969).",
              "desc": "Archival photograph of PLO Chairman Yasser Arafat in military battle fatigues and kaffiyeh (1969).",
              "provenance": "Palestinian National Authority Information Department / Gamma-Rapho, c. 1969.",
              "citation": "Palestinian National Authority Information Department / Gamma-Rapho.",
              "hinge_question": "How did Arafat's consistent adoption of military uniform project the image of an active guerrilla warrior rather than a desk-bound diplomat?",
              "source_context": "After the 1968 Battle of Karameh in Jordan, where Fatah fighters inflicted heavy casualties on an Israeli raid, Arafat emerged as the preeminent symbol of armed Palestinian nationalism. In 1969, he was elected Chairman of the PLO Executive Committee. **Hinge Question:** How did Arafat's consistent adoption of military uniform project the image of an active guerrilla warrior rather than a desk-bound diplomat?",`;

  const newReplacement = `"id": "cme_l8_source_a",
              "letter": "A",
              "title": "Source A: Yasser Arafat in Military Battle Fatigues (1969)",
              "src": "/units/cme_new/assets/cme_arafat_fatigues_1969.jpg",
              "image": "/units/cme_new/assets/cme_arafat_fatigues_1969.jpg",
              "source": "/units/cme_new/assets/cme_arafat_fatigues_1969.jpg",
              "caption": "Archival portrait of PLO Chairman Yasser Arafat wearing his iconic military combat field jacket and checkered kaffiyeh (1969).",
              "desc": "Archival portrait of PLO Chairman Yasser Arafat in military combat field jacket and checkered kaffiyeh (1969).",
              "provenance": "Palestinian National Authority Information Department / Gamma-Rapho / Wikimedia Commons, 1969.",
              "citation": "Archival portrait (1969), PNA Information Dept / Gamma-Rapho / Wikimedia Commons.",
              "hinge_question": "How did Arafat's consistent adoption of military uniform project the image of an active guerrilla warrior rather than a desk-bound diplomat?",
              "source_context": "Following the March 1968 Battle of Karameh in Jordan, where Fatah fighters mounted a fierce defence against an Israeli raid, Yasser Arafat emerged as the preeminent symbol of armed Palestinian nationalism. In 1969, he was elected Chairman of the PLO Executive Committee, adopting his signature olive-drab combat fatigues and checkered kaffiyeh to signal that the PLO's leadership was rooted in direct guerrilla warfare rather than political diplomacy. **Hinge Question:** How did Arafat's consistent adoption of military uniform project the image of an active guerrilla warrior rather than a desk-bound diplomat?",`;

  if (!content.includes(oldTarget)) {
    console.error('Target not found in ' + filePath);
    process.exit(1);
  }

  content = content.replace(oldTarget, newReplacement);

  // Also update teacher_notes inside lesson_9
  const oldTeacherContext = `"source_context": "After the 1968 Battle of Karameh in Jordan, where Fatah fighters inflicted heavy casualties on an Israeli raid, Arafat emerged as the preeminent symbol of Palestinian armed struggle. In 1969, Fatah took control of the Palestine Liberation Organization (PLO), declaring that armed struggle was the only way to liberate Palestine. **Hinge Question:** How did Arafat's consistent adoption of military uniform project the image of an active guerrilla warrior rather than a desk-bound diplomat?"`;
  const newTeacherContext = `"source_context": "Following the March 1968 Battle of Karameh in Jordan, where Fatah fighters mounted a fierce defence against an Israeli raid, Yasser Arafat emerged as the preeminent symbol of armed Palestinian nationalism. In 1969, he was elected Chairman of the PLO Executive Committee, adopting his signature olive-drab combat fatigues and checkered kaffiyeh to signal that the PLO's leadership was rooted in direct guerrilla warfare rather than political diplomacy. **Hinge Question:** How did Arafat's consistent adoption of military uniform project the image of an active guerrilla warrior rather than a desk-bound diplomat?"`;

  content = content.replace(oldTeacherContext, newTeacherContext);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated:', filePath);
}

updateDataFile('C:/Projects/the-history-revision-hub/units/cme_new/data.js');
updateDataFile('C:/Projects/the-history-revision-hub/public/units/cme_new/data.js');

