const fs = require('fs');
const path = require('path');

const replacement = {
  type: "youtube",
  id: "hHqJ6pgdE-c",
  url: "https://www.youtube.com/watch?v=hHqJ6pgdE-c",
  title: "Six-Day War (1967) - Origins, Brinkmanship & Outbreak | Kings and Generals",
  duration: "15 mins 58 secs",
  pathway: "Documentary Depth",
  teacher_guidance: "Recommended Watch Window: 00:00–06:30 | Lesson Phase: Escalation to War | Tone Alert: Authoritative animated tactical map documentary detailing the War Over Water, Golan Heights artillery clashes, UNEF removal, and the closure of the Straits of Tiran.",
  viewing_task: "<ol><li><strong>[02:15] Water & Borders:</strong> How did Israel's National Water Carrier and Syrian counter-diversion canals turn the Jordan River basin into a direct military flashpoint?</li><li><strong>[04:45] Strategic Chokepoint:</strong> Why did Nasser's remilitarization of the Sinai and blockade of the Straits of Tiran make an Israeli pre-emptive strike inevitable under international law?</li></ol>",
  model_answer: "<ol><li><strong>Water & Borders:</strong> Israel viewed water from Lake Kinneret as vital for agricultural survival in the Negev, while Syria attempted to divert the Jordan headwaters (Banias) away from Israel. Clashes over construction machinery and tractor patrols along the demilitarized zones escalated into tank duels and aerial dogfights over the Golan Heights.</li><li><strong>Strategic Chokepoint:</strong> The Gulf of Aqaba and Straits of Tiran were Israel's only maritime shipping route to Asia and East Africa, securing 90% of its vital oil imports from Iran. Israel had explicitly stated in 1957 that closing the Straits would be considered a formal act of war (casus belli); by expelling UNEF peacekeepers and mining the straits, Nasser forced Israel to choose between economic strangulation or pre-emptive attack.</li></ol>"
};

async function fixCmeL5() {
  const paths = [
    path.join(__dirname, '..', 'units', 'cme_new', 'data.js'),
    path.join(__dirname, '..', 'public', 'units', 'cme_new', 'data.js')
  ];

  for (const p of paths) {
    if (!fs.existsSync(p)) continue;
    const fileUrl = 'file:///' + p.replace(/\\/g, '/');
    const mod = (await import(fileUrl)).default;

    // Lesson 5 is index 4
    console.log('Old video in L5 [3]:', mod.lessons[4].video[3].title);
    mod.lessons[4].video[3] = replacement;

    fs.writeFileSync(p, 'export default ' + JSON.stringify(mod, null, 2) + ';\n', 'utf8');
    console.log(`✅ Updated ${p}`);
  }
}

fixCmeL5().catch(console.error);

