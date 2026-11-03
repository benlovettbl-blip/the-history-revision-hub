const fs = require('fs');
const path = require('path');

// 1. Update cme_new
const cmeEnquiries = [
  "How did physical geography and artificial borders make conflict in the Middle East inevitable?",
  "Why did the British Mandate collapse and how was the State of Israel created amidst war?",
  "What were the territorial, human, and geopolitical consequences of the 1948–49 War?",
  "Why did the nationalisation of the Suez Canal trigger a global crisis in 1956?",
  "How did water disputes, border raids, and escalating militarism make a second regional war inescapable?",
  "Why was the Six-Day War decided so rapidly, and did Egyptian brinkmanship make an Israeli preemptive strike inevitable?",
  "How did Israel's capture of the occupied territories reshape diplomacy, identity, and the prospects for peace?",
  "Why did the PLO shift towards armed international struggle, and how did Black September reshape Palestinian resistance?",
  "How did the surprise offensive of the Yom Kippur War puncture Israeli invincibility and force a fundamental diplomatic realignment?",
  "How did historic enemies Egypt and Israel finally achieve a lasting peace treaty?",
  "How did the First Intifada fundamentally alter the nature of the Palestinian struggle?",
  "Why did the Oslo Accords bring historic hope for peace, yet fail to resolve the conflict?"
];

function updateCME(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const jsonStr = content.replace(/^export\s+default\s+/, '').replace(/;\s*$/, '');
  const data = JSON.parse(jsonStr);

  data.lessons.forEach((l, idx) => {
    l.enquiry = cmeEnquiries[idx];
  });

  const newContent = 'export default ' + JSON.stringify(data, null, 2) + ';\n';
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log('Updated CME file:', filePath);
}

updateCME('C:/Projects/the-history-revision-hub/units/cme_new/data.js');
updateCME('C:/Projects/the-history-revision-hub/public/units/cme_new/data.js');

// 2. Update usa
function updateUSA(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const jsonStr = content.replace(/^export\s+default\s+/, '').replace(/;\s*$/, '');
  const data = JSON.parse(jsonStr);

  data.lessons.forEach((l, idx) => {
    const raw = l.enquiry || l.hook_text || '';
    const qMatch = raw.match(/([^.?!]+[?])/g);
    if (qMatch && qMatch.length > 0) {
      l.enquiry = qMatch[qMatch.length - 1].trim();
    }
  });

  const newContent = 'export default ' + JSON.stringify(data, null, 2) + ';\n';
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log('Updated USA file:', filePath);
}

updateUSA('C:/Projects/the-history-revision-hub/units/usa/data.js');
updateUSA('C:/Projects/the-history-revision-hub/public/units/usa/data.js');

console.log('Finished updating data files!');

