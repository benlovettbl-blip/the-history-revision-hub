const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, 'cme_unified_textbook_data.cjs');
let code = fs.readFileSync(p, 'utf8');

const questionsMap = {
  1.1: 'Why was the secret Sykes-Picot Agreement viewed as an imperial betrayal?',
  1.2: 'How did contradictory British pledges to Arabs and Jews create irreconcilable conflict?',
  1.3: 'Why did rising Jewish immigration spark communal violence under the Mandate?',
  1.4: 'Why did the 1939 White Paper turn Zionists against British rule?',
  2.1: 'Why did Bevin strictly enforce the 1,500 monthly refugee immigration limit?',
  2.2: 'Why did targeting the King David Hotel prove Palestine was ungovernable?',
  2.3: 'Why did the UN partition resolution spark immediate civil war in Palestine?',
  2.4: 'How did the 1949 Green Line transform the territory allocated by the UN?',
  3.1: 'Why is the cause of the 1948 Palestinian refugee flight (Al-Nakba) contested?',
  3.2: 'Why did UN Resolution 194 fail to resolve the refugee right of return?',
  3.3: 'How did the Law of Return transform Israel’s demographics and economy by 1953?',
  3.4: 'Why did cross-border infiltration trigger Sharon’s Unit 101 raid on Qibya?',
  4.1: 'Why did the Czech arms deal alarm Britain, France, and Israel in 1955?',
  4.2: 'Why did Britain and France view canal nationalisation as an intolerable threat?',
  4.3: 'How did the secret Sèvres Agreement orchestrate a pretext for invading Egypt?',
  4.4: 'Why did the Suez Crisis end in political triumph for Nasser despite military defeat?',
  5.1: 'Why did Arab leaders meet in Cairo and create the PLO in 1964?',
  5.2: 'How did the dispute over River Jordan water spark military conflict?',
  5.3: 'What were the consequences of the Israeli reprisal raid on Samu?',
  5.4: 'How did the 7 April dogfight escalate tensions toward all-out war?',
  6.1: 'Why was closing the Straits of Tiran treated by Israel as a casus belli?',
  6.2: 'How did the pre-emptive air strike destroy Arab air power on the first morning?',
  6.3: 'How did Israeli armored columns capture the Sinai and East Jerusalem in three days?',
  6.4: 'What territories did Israel conquer during the six days of fighting?',
  7.1: 'Why did the capture and annexation of East Jerusalem cause global outcry?',
  7.2: 'Why did the Arab League issue the "Three Noes" at the Khartoum Summit?',
  7.3: 'How did UN Resolution 242 establish the principle of "Land for Peace"?',
  7.4: 'How did permanent Israeli settlements transform the occupied territories?',
  8.1: 'How did the Battle of Karameh establish Yasser Arafat as leader of the PLO?',
  8.2: 'Why did King Hussein expel the PLO during Black September in 1970?',
  8.3: 'What was the global impact of the Munich Olympics massacre in 1972?',
  8.4: 'How did Israel retaliate through Operation Wrath of God covert strikes?',
  9.1: 'Why did Nasser launch the War of Attrition along the Suez Canal?',
  9.2: 'How did Egyptian and Syrian forces achieve tactical surprise on Yom Kippur?',
  9.3: 'How did the US airlift enable General Sharon’s canal counter-crossing?',
  9.4: 'How did the Arab OPEC oil embargo transform global superpower diplomacy?',
  10.1: 'How did Kissinger’s step-by-step shuttle diplomacy separate the frontline armies?',
  10.2: 'Why was Sadat’s speech to the Israeli Knesset such a profound psychological breakthrough?',
  10.3: 'How did Jimmy Carter prevent the 13-day Camp David summit from collapsing?',
  10.4: 'Why did Egyptian Islamic Jihad assassinate Anwar Sadat in October 1981?',
  11.1: 'Why did Ariel Sharon expand the invasion far beyond the cabinet’s 40km limit?',
  11.2: 'Why was Israel held internationally accountable for the Phalangist massacre?',
  11.3: 'Why did a traffic collision in the Gaza Strip spark the First Intifada?',
  11.4: 'Why was Arafat’s 1988 Geneva speech a historic turning point for the PLO?',
  12.1: 'Why did the end of the Cold War and the Gulf War make the Madrid Conference possible?',
  12.2: 'Why was strict secrecy essential for the Oslo negotiators in Norway?',
  12.3: 'How did the division of the West Bank into Areas A, B, and C leave territory fragmented?',
  12.4: 'Why did Jewish extremist Yigal Amir assassinate Prime Minister Yitzhak Rabin?',
};

let replaced = 0;
for (const [ref, q] of Object.entries(questionsMap)) {
  const target = new RegExp(
    '(ref:\\s*[\'\\"]' + ref + '[\'\\"],[\\s\\S]*?title:\\s*[\'\\"][^\'\\"]+[\'\\"],)',
  );
  if (target.test(code)) {
    code = code.replace(target, `$1\n      question: "${q}",`);
    replaced++;
  }
}
console.log('Injected questions:', replaced);
fs.writeFileSync(p, code, 'utf8');
