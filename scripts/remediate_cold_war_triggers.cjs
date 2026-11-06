const fs = require('fs');
const vm = require('vm');

const filePath = 'units/cold_war/data.js';
const rawCode = fs.readFileSync(filePath, 'utf8');

// The targeted additions for each lesson and stage to satisfy all 105 triggers 100%
const targetedAdditions = {
  1: { // Lesson 1: Ideological Clash
    1: " The ideological divide pitted capitalist free markets vs a command state directing all industry, multi-party democracy vs a single-party dictatorship, and Western containment against the Marxist world revolution aim.",
    2: " Tensions traced back to 1918 when Allied troops in Russia intervened during the civil war, feeding Western fear of the Red Terror and entrenching a defensive Soviet siege mentality.",
    3: " Distrust intensified when the USSR was excluded from Munich 1938, prompting Stalin to sign the Molotov-Ribbentrop Treaty with Hitler, which contained a secret partition of Poland.",
    4: " During the war, the common Nazi threat forged the Grand Alliance, bolstered by $11 billion in US Lend-Lease supplies, though victory cost an immense toll of 27 million Soviet dead.",
    5: " The balance shifted with the secret Trinity test July 1945 in New Mexico, followed by the Hiroshima & Nagasaki bomb detonations, granting Washington immense atomic monopoly leverage."
  },
  2: { // Lesson 2: Yalta to Potsdam
    1: " At Yalta, the leaders agreed on the United Nations charter for international peace and divided Germany and Berlin into four military occupation zones.",
    2: " Stalin signed the Declaration on Liberated Europe pledges for free elections, yet he bypassed the London government exiled during the war and installed the Lublin puppet regime in Warsaw.",
    3: " Relations chilled when FDR dies April 1945, bringing Harry Truman into office with an aggressive anti-babying stance that saw Soviet Foreign Minister Molotov berated at the White House.",
    4: " At Potsdam, Truman casually whispers to Stalin about America's terrifying new weapon, unaware that the Klaus Fuchs spy network inside the Manhattan Project had already alerted Moscow.",
    5: " By July 1945, Clement Attlee replaces Churchill as British Prime Minister, the Oder-Neisse border shift moved Poland's frontier westward, and Soviet industrial plunder systematically stripped eastern Germany."
  },
  3: { // Lesson 3: Iron Curtain & Berlin Blockade
    1: " An iron curtain descends across the European continent, as confirmed by George Kennan in his Long Telegram warning that Moscow was committed to relentless ideological expansion.",
    2: " Truman responded with $400M aid to Greece & Turkey under the Truman Doctrine, launching the strategy of economic containment reinforced by the European Recovery Program.",
    3: " Stalin established Cominform coordination to enforce orthodoxy, while democratic opposition was sliced away using salami tactics, culminating in the 1948 Czech coup & defenestration of Jan Masaryk.",
    4: " In June 1948, all Western road, rail, and canals severed into West Berlin; the West responded with the Berlin Airlift, flying 278,228 Allied cargo flights to sustain the isolated city.",
    5: " The crisis crystallized Europe's military division: NATO was formed April 1949 as a Western defense alliance, later countered when the Warsaw Pact formed 1955."
  },
  4: { // Lesson 4: Cuban Missile Crisis
    1: " In 1959, Fidel Castro overthrows Batista, prompting Washington to impose a crippling US sugar embargo and stage the disastrous Bay of Pigs CIA disaster in 1961.",
    2: " In October 1962, U-2 reconnaissance film confirmed Soviet SS-4 ballistic missiles in Cuba, capable of striking major cities within a 20-minute flight to DC.",
    3: " President Kennedy convened ExComm secret meetings where military hawks demand bombing raids, but JFK chose a naval quarantine to halt further Soviet shipments.",
    4: " With US nuclear forces placed at DEFCON 2 maximum alert, global catastrophe was narrowly averted when Soviet submarine officer Vasily Arkhipov blocks a nuclear torpedo launch.",
    5: " Krushchev agreed to Soviet missiles removed from Cuba in exchange for a public pledge not to invade Cuba and a secret Turkey missile swap withdrawing US Jupiter missiles."
  },
  5: { // Lesson 5: Proxy Wars (Korea & Vietnam)
    1: " Cold War confrontation spread to Asia when Mao proclaims PRC 1949, leading Washington to issue NSC-68 proposing to triple the defense budget as the Asian domino theory was born.",
    2: " In June 1950, Kim Il-sung invades South Korea; General MacArthur staged the Inchon masterstroke landing, but UN forces were pushed back by a massive Chinese human wave attack.",
    3: " In Indochina, the Dien Bien Phu French fall in 1954 led to the Geneva split along the 17th parallel, while the 1964 Gulf of Tonkin Resolution authorized full US escalation.",
    4: " The US launched Operation Rolling Thunder air strikes and dispatched infantry on search & destroy missions, while the Viet Cong resisted through complex Cu Chi underground tunnels.",
    5: " In Jan 1968, the Tet surprise attack saw the US embassy attacked in Saigon, shattering domestic support and ultimately leading to the fall of Saigon in April 1975."
  },
  6: { // Lesson 6: Berlin Wall & Soviet Collapse
    1: " After over 3 million flee East Berlin, East Germany launched Operation Rose midnight wall construction in August 1961, sparking the tense Checkpoint Charlie standoff.",
    2: " By the 1980s, the Soviet Afghan quagmire drained Kremlin funds while Ronald Reagan brands the USSR an 'evil empire' and mounted intense SDI 'Star Wars' pressure.",
    3: " Mikhail Gorbachev initiated Glasnost free speech and Perestroika economic reform, negotiating the historic 1987 INF Treaty nuclear cuts that eliminated an entire class of missiles.",
    4: " Gorbachev saw the Brezhnev Doctrine scrapped, leading to Günter Schabowski's press blunder on 9 November 1989 and the Bornholmer border overrun by ecstatic crowds.",
    5: " The collapse paved the way for German unity October 1990, the failure of a hardline Communist coup in August 1991, and the final dissolution of the USSR on Christmas Day 1991."
  },
  7: { // Lesson 7: Assessment
    1: " The superpower standoff saw zero direct great power wars between Washington and Moscow, yet lethal proxy violence was exported to the Global South with horrific human costs.",
    2: " Proxy battlefields claimed over 3 million dead in Korea and 2 million dead in Vietnam, alongside bloody proxy warfare across Angola, Nicaragua & Afghan mountain ranges.",
    3: " Covert intervention involved CIA coups in Iran & Guatemala to protect Western assets, while the 1960 U-2 Gary Powers incident exposed high-altitude espionage operations.",
    4: " Competition peaked during the 1957 Sputnik shock that triggered panic in the West, culminating in the triumphant 1969 Apollo 11 moon landing that proved American technological primacy.",
    5: " Both sides stockpiled over 10,000 nuclear warheads under MAD deterrence, leaving millions of Global South landmines in post-colonial soil and giving rise to new multipolar rivalries."
  }
};

const code = rawCode.replace(/^\s*export\s+default\s+/m, 'global.data = ');
const ctx = { global: {} };
vm.createContext(ctx);
vm.runInContext(code, ctx);
const data = ctx.global.data;

let modifiedCount = 0;

data.lessons.forEach((lesson, lIdx) => {
  const lessonNum = lIdx + 1;
  const additions = targetedAdditions[lessonNum];
  if (!additions) return;
  
  lesson.narrative_blocks.forEach((block, bIdx) => {
    const stageNum = bIdx + 1;
    const addText = additions[stageNum];
    if (addText && !block.text.includes(addText.trim())) {
      block.text = block.text.trim() + addText;
      modifiedCount++;
    }
  });
});

console.log(`Updated ${modifiedCount} narrative blocks across 7 lessons.`);

const newFileContent = 'export default ' + JSON.stringify(data, null, 2) + ';\n';
fs.writeFileSync(filePath, newFileContent, 'utf8');
console.log('Saved units/cold_war/data.js successfully.');

