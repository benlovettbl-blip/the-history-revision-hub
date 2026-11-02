const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'units', 'cme_new', 'data.js');
let content = fs.readFileSync(dataFilePath, 'utf8');

const replacements = [
  {
    target: `"hook_text": "The Middle East is the ultimate geopolitical crossroads of the earth—the physical land bridge connecting Europe, Asia, and Africa, the guardian of vital maritime chokepoints, and the birthplace of three world religions. To understand the bloody wars between Arabs and Israelis from 1945 to 1995, one must first understand its geography: how European diplomats drew straight ruler lines across deserts, why fresh water from the River Jordan is a matter of national survival, and why controlling the high ground of the Golan Heights or the narrow waters of the Straits of Tiran dictated the difference between victory and annihilation."`,
    replacement: `"hook_text": "The Middle East is the ultimate geopolitical crossroads of the earth—the physical land bridge connecting Europe, Asia, and Africa, the guardian of vital maritime chokepoints, and the birthplace of three world religions. To understand the bloody wars between Arabs and Israelis from 1945 to 1995, one must first understand its geography: how European diplomats drew straight ruler lines across deserts, why fresh water from the River Jordan is a matter of national survival, and why controlling the high ground of the Golan Heights or the narrow waters of the Straits of Tiran dictated the difference between victory and annihilation. How did imperial diplomacy and strategic geography lay the groundwork for fifty years of intractable conflict?"`
  },
  {
    target: `"hook_text": "In 1945, the world was reeling from the horrors of the Holocaust, creating immense international pressure for a Jewish homeland. Yet, for the Arab population of Palestine, this meant the terrifying prospect of losing their ancestral land. The British, exhausted and bankrupt from World War Two, were caught in the middle of an impossible situation."`,
    replacement: `"hook_text": "In 1945, the world was reeling from the horrors of the Holocaust, creating immense international pressure for a Jewish homeland. Yet, for the Arab population of Palestine, this meant the terrifying prospect of losing their ancestral land. The British, exhausted and bankrupt from World War Two, were caught in the middle of an impossible situation. Why did the British Mandate collapse, and how was the State of Israel established in the crucible of civil war?"`
  },
  {
    target: `"hook_text": "The moment Israel declared independence on 14 May 1948, five Arab armies invaded. What followed was a desperate fight for survival for the Israelis, and a catastrophic loss of land for the Palestinians—an event they remember as the 'Nakba' (Catastrophe). The map of the Middle East was forever redrawn."`,
    replacement: `"hook_text": "The moment Israel declared independence on 14 May 1948, five Arab armies invaded. What followed was a desperate fight for survival for the Israelis, and a catastrophic loss of land for the Palestinians—an event they remember as the 'Nakba' (Catastrophe). The map of the Middle East was forever redrawn. How did the 1948–49 War transform the territorial and human landscape of Palestine?"`
  },
  {
    target: `"hook_text": "By the 1950s, the Cold War had arrived in the Middle East. Egypt's charismatic new leader, Gamal Abdel Nasser, emerged as a hero of Arab nationalism, willing to stand up to the old European empires and Israel. When he nationalised the Suez Canal, it triggered a global crisis that almost sparked World War Three."`,
    replacement: `"hook_text": "By the 1950s, the Cold War had arrived in the Middle East. Egypt's charismatic new leader, Gamal Abdel Nasser, emerged as a hero of Arab nationalism, willing to stand up to the old European empires and Israel. When he nationalised the Suez Canal, it triggered a global crisis that almost sparked World War Three. Why did the nationalisation of the Suez Canal trigger a global crisis, and how did it destroy Britain's imperial authority?"`
  },
  {
    target: `"hook_text": "In January 1964, Arab leaders met in Cairo to resolve two crises: Israel was pumping water out of the River Jordan, and Palestinians demanded their own state. Within three years, artillery battles and aerial dogfights had made a full-scale war inevitable."`,
    replacement: `"hook_text": "In January 1964, Arab leaders met in Cairo to resolve two crises: Israel was pumping water out of the River Jordan, and Palestinians demanded their own state. Within three years, artillery battles and aerial dogfights had made a full-scale war inevitable. How did water disputes, cross-border guerrilla raids, and escalating militarism make a second regional war inescapable?"`
  },
  {
    target: `"hook_text": "On the morning of 5 June 1967, nearly 200 Israeli fighter jets flew low beneath radar over the Mediterranean. Within three hours, over 300 Egyptian aircraft lay burning on the tarmac. By Saturday evening, the map of the Middle East had been changed forever."`,
    replacement: `"hook_text": "On the morning of 5 June 1967, nearly 200 Israeli fighter jets flew low beneath radar over the Mediterranean. Within three hours, over 300 Egyptian aircraft lay burning on the tarmac. By Saturday evening, the map of the Middle East had been changed forever. Why was the Six-Day War decided so rapidly, and did Egyptian brinkmanship make an Israeli preemptive strike inevitable?"`
  },
  {
    target: `"hook_text": "In the summer of 1967, Israel found itself ruling over one million Palestinians. In September, Arab leaders declared the \\"Three Noes\\" in Khartoum. In November, the UN passed Resolution 242 promising \\"Land for Peace\\"—yet its ambiguous words locked the region in stalemate."`,
    replacement: `"hook_text": "In the summer of 1967, Israel found itself ruling over one million Palestinians. In September, Arab leaders declared the \\"Three Noes\\" in Khartoum. In November, the UN passed Resolution 242 promising \\"Land for Peace\\"—yet its ambiguous words locked the region in stalemate. How did Israel's capture of the occupied territories reshape diplomacy, identity, and the prospects for peace?"`
  },
  {
    target: `"hook_text": "In September 1970, Palestinian militants blew up three hijacked airliners in the Jordanian desert. Two years later, hooded gunmen scaled an Olympic fence in Munich. Having lost faith in Arab armies, Palestinians took their fight to the global stage."`,
    replacement: `"hook_text": "In September 1970, Palestinian militants blew up three hijacked airliners in the Jordanian desert. Two years later, hooded gunmen scaled an Olympic fence in Munich. Having lost faith in Arab armies, Palestinians took their fight to the global stage. Why did the PLO shift towards armed international struggle, and how did Black September reshape Palestinian resistance?"`
  },
  {
    target: `"hook_text": "On 6 October 1973, while Israel observed its holiest fast day, 80,000 Egyptian soldiers crossed the Suez Canal using high-pressure water hoses to wash away Israeli sand ramparts. It was a war that brought the superpowers to nuclear alert and changed Middle Eastern history."`,
    replacement: `"hook_text": "On 6 October 1973, while Israel observed its holiest fast day, 80,000 Egyptian soldiers crossed the Suez Canal using high-pressure water hoses to wash away Israeli sand ramparts. It was a war that brought the superpowers to nuclear alert and changed Middle Eastern history. How did the surprise offensive of the Yom Kippur War puncture Israeli invincibility and force a fundamental diplomatic realignment?"`
  },
  {
    target: `"hook_text": "In an unprecedented move that stunned the world, Egyptian President Anwar Sadat traveled to Jerusalem in 1977, offering peace. This bold step shattered the Arab taboo of refusing to talk to Israel and paved the way for the historic Camp David Accords, fundamentally altering the Middle East peace process."`,
    replacement: `"hook_text": "In an unprecedented move that stunned the world, Egyptian President Anwar Sadat traveled to Jerusalem in 1977, offering peace. This bold step shattered the Arab taboo of refusing to talk to Israel and paved the way for the historic Camp David Accords, fundamentally altering the Middle East peace process. How did historic adversaries Egypt and Israel negotiate the landmark Camp David Accords, and what were the consequences for the wider Arab world?"`
  },
  {
    target: `"hook_text": "While Egypt and Israel made peace, the Palestinians felt abandoned. Operating out of Lebanon, the PLO launched relentless attacks against Israel, leading to the devastating 1982 Israeli invasion of Lebanon. By 1987, Palestinian frustration inside the occupied territories exploded into a spontaneous, grassroots uprising known as the First Intifada."`,
    replacement: `"hook_text": "While Egypt and Israel made peace, the Palestinians felt abandoned. Operating out of Lebanon, the PLO launched relentless attacks against Israel, leading to the devastating 1982 Israeli invasion of Lebanon. By 1987, Palestinian frustration inside the occupied territories exploded into a spontaneous, grassroots uprising known as the First Intifada. How did the First Intifada fundamentally alter the balance of power and bring the Palestinian struggle to the forefront of global attention?"`
  },
  {
    target: `"hook_text": "The sheer exhaustion of the Intifada forced both sides to the negotiating table in secret. In 1993, the world watched in awe as PLO Chairman Yasser Arafat and Israeli Prime Minister Yitzhak Rabin shook hands on the White House lawn, signing the Oslo Accords. It seemed peace was finally possible, but extremists on both sides were determined to destroy it."`,
    replacement: `"hook_text": "The sheer exhaustion of the Intifada forced both sides to the negotiating table in secret. In 1993, the world watched in awe as PLO Chairman Yasser Arafat and Israeli Prime Minister Yitzhak Rabin shook hands on the White House lawn, signing the Oslo Accords. It seemed peace was finally possible, but extremists on both sides were determined to destroy it. Why did the Oslo Accords create such unprecedented hope for peace, yet ultimately fail to resolve the core drivers of the conflict?"`
  }
];

let matchCount = 0;
replacements.forEach((r, idx) => {
  if (content.includes(r.target)) {
    content = content.replace(r.target, r.replacement);
    matchCount++;
  } else {
    console.error(`Target ${idx + 1} not found!`);
  }
});

if (matchCount === 12) {
  fs.writeFileSync(dataFilePath, content, 'utf8');
  console.log('✅ Successfully updated all 12 hook_text entries in cme_new/data.js');
} else {
  console.error(`❌ Only matched ${matchCount}/12 targets! Aborting.`);
  process.exit(1);
}

