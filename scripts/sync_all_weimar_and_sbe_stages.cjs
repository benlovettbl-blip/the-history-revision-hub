const fs = require('fs');
const path = require('path');
const { WEIMAR_ENQUIRY_CONFIGS } = require(path.join(__dirname, 'components/weimar_enquiry_configs.cjs'));

// Canonical model sentences for all 80 stages across KT1, KT2, KT3, KT4
const WEIMAR_MODELS = {
  // KT1.1
  "lesson_1_1": [
    "Severe civilian suffering during the <strong>Turnip Winter starvation</strong>, intensified by the <strong>Allied naval blockade</strong>, triggered the <strong>Kiel naval mutiny</strong> which shattered military discipline and imperial rule.",
    "Amid mounting revolutionary unrest, ministers forced <strong>Kaiser Wilhelm abdication</strong> followed by his hasty <strong>Dutch border exile</strong>, prompting the <strong>Philipp Scheidemann proclamation</strong> of a democratic republic to preempt a communist coup.",
    "Immediately after the <strong>Compiègne armistice signed</strong> ended the war, new leader <strong>Friedrich Ebert chancellor</strong> secured the stability of the provisional government through the secret <strong>Ebert-Groener army pact</strong>.",
    "Convening away from street fighting in Berlin, the <strong>Weimar National Assembly</strong> elected <strong>Friedrich Ebert president</strong> and established Germany’s first <strong>democratic coalition government</strong>.",
    "Although the Weimar constitution granted progressive <strong>universal suffrage rights</strong>, chronic political fragmentation caused by <strong>proportional representation weakness</strong> forced frequent reliance on <strong>Article 48 emergency powers</strong>."
  ],
  // KT1.2
  "lesson_1_2": [
    "In January 1919, the left-wing <strong>Spartacist Communist uprising</strong> was brutally crushed through government <strong>Freikorps paramilitary deployment</strong>, during which leader <strong>Rosa Luxemburg murdered</strong> extinguished the immediate revolutionary threat.",
    "Nationalist resentment exploded over the treaty’s <strong>Article 231 War Guilt</strong> clause and crippling <strong>£6.6 billion reparations</strong>, heavily fueling the right-wing <strong>'Dolchstoss' backstab myth</strong> against democratic politicians.",
    "When right-wing rebels launched the <strong>Wolfgang Kapp putsch</strong> and army chief <strong>General von Seeckt refusal</strong> left the government defenseless, the putsch was paralyzed by a massive <strong>Berlin general strike</strong>.",
    "Political extremism escalated through <strong>Organisation Consul terror</strong>, as ultranationalist squads ensured <strong>Matthias Erzberger assassinated</strong> and foreign minister <strong>Walther Rathenau murdered</strong> in brazen daylight attacks.",
    "When French forces began the <strong>Ruhr industrial occupation</strong>, the German government called for <strong>passive strike resistance</strong> and printed paper currency to fund striking workers, triggering catastrophic <strong>hyperinflation currency collapse</strong>."
  ],
  // KT1.3
  "lesson_1_3": [
    "Appointed at the height of crisis, <strong>Gustav Stresemann chancellor</strong> abolished worthless paper money and issued the <strong>Rentenmark land-backed currency</strong>, ensuring the national <strong>mark stabilized (1924)</strong> to restore economic confidence.",
    "Stresemann negotiated the <strong>1924 Dawes Plan</strong>, which secured substantial <strong>800m gold-mark loans</strong> from American financiers alongside realistic <strong>reparations annual restructuring</strong> to revive German industry.",
    "Diplomatic rapprochement was cemented by the <strong>Locarno Treaties (1925)</strong>, wherein Germany’s <strong>western borders recognized</strong> permanently and <strong>Rhineland demilitarization affirmed</strong> to rebuild European trust.",
    "Germany’s international standing was restored through <strong>League of Nations admission</strong> in 1926, which granted Berlin a permanent <strong>Geneva Council seat</strong> and confirmed Germany's <strong>great power rehabilitation</strong>.",
    "Following Germany's signing of the <strong>Kellogg-Briand Pact (1928)</strong> outlawing war, Stresemann secured the <strong>Young Plan (1929)</strong> which saw <strong>reparations reduced (£2bn)</strong> to ease the long-term national debt."
  ],
  // KT1.4
  "lesson_1_4": [
    "Weimar social reforms saw average <strong>real wages increase</strong>, protected vulnerable families through the landmark <strong>1927 Unemployment Insurance</strong> Act, and funded extensive <strong>municipal housing construction</strong> across German cities.",
    "Urban society embraced the emancipated <strong>Weimar 'New Woman'</strong>, who gained representation through elected <strong>female Reichstag deputies</strong> and enjoyed greater <strong>financial employment independence</strong> in modern white-collar jobs.",
    "Architectural innovation was pioneered by <strong>Walter Gropius Bauhaus</strong> school, which championed sleek <strong>modernist functional architecture</strong> from its groundbreaking <strong>Dessau design campus</strong>.",
    "Weimar painters rejected romanticism in favour of cynical <strong>Neue Sachlichkeit art</strong>, showcased through raw <strong>Otto Dix expressionism</strong> and biting <strong>George Grosz satire</strong> targeting war profiteers.",
    "Although cinematic masterpieces like <strong>Fritz Lang Metropolis</strong> produced at famous <strong>UFA film studios</strong> brought global acclaim, avant-garde experimentation provoked an intense <strong>conservative cultural backlash</strong> from traditionalists."
  ],
  // KT2.1
  "lesson_2_1": [
    "Founded by railway mechanic <strong>Anton Drexler DAP</strong>, the tiny nationalist movement transformed rapidly when <strong>Adolf Hitler joins (1919)</strong> and electrified crowds during raucous <strong>Munich beer-cellar meetings</strong>.",
    "In February 1920, Hitler announced the radical <strong>25-Point NSDAP Programme</strong>, demanding total <strong>Versailles Treaty repudiation</strong> alongside strict <strong>anti-Semitic citizenship exclusion</strong> for German Jews.",
    "The movement orchestrated a bold <strong>NSDAP party rebranding</strong>, adopting the eye-catching <strong>swastika party emblem</strong> and purchasing the struggling <strong>Völkischer Beobachter newspaper</strong> to amplify its propaganda.",
    "Demanding total authority under the <strong>Führerprinzip absolute leadership</strong> doctrine, Hitler issued an uncompromising <strong>resignation ultimatum (Jul 1921)</strong> that left co-founder <strong>Anton Drexler sidelined</strong>.",
    "To command the streets, the party established the <strong>Sturmabteilung (SA) Brownshirts</strong> under ruthless <strong>Ernst Röhm leadership</strong> to carry out violent <strong>rival party intimidation</strong> against left-wing opponents."
  ],
  // KT2.2
  "lesson_2_2": [
    "Exploiting hyperinflation in November 1923, Hitler stormed the <strong>Bürgerbräukeller Beer Hall</strong> alongside war hero <strong>General Erich Ludendorff</strong>, but their armed coup collapsed during a <strong>failed Munich march (16 dead)</strong> when Bavarian police opened fire.",
    "Rather than silencing him, the 1924 <strong>Munich treason trial</strong> provided an ideal national platform for <strong>Hitler courtroom propaganda</strong>, earning him sympathetic headlines and a remarkably <strong>lenient five-year sentence</strong>.",
    "Serving minimal prison time in comfortable <strong>Landsberg Fortress detention</strong>, Hitler dictated his political autobiography <strong>Mein Kampf treatise</strong> outlining his racial worldview and plans for eastern <strong>Lebensraum territorial expansion</strong>.",
    "Recognizing armed insurrection was futile, Hitler pivoted toward a <strong>legal democratic pathway</strong> to power, using the pivotal <strong>1926 Bamberg Conference</strong> to ensure internal <strong>party discipline consolidated</strong> under his unquestioned authority.",
    "Despite winning only 2.6% of votes and <strong>twelve parliamentary seats</strong> in the <strong>1928 Reichstag election (2.6%)</strong>, the party used these lean years to build an efficient <strong>Gauleiter nationwide apparatus</strong> across every region."
  ],
  // KT2.3
  "lesson_2_3": [
    "The devastating October <strong>Wall Street Crash (1929)</strong> caused catastrophic economic shockwaves as vital <strong>US bank loans recalled</strong> immediately, precipitating a nationwide <strong>German financial collapse</strong>.",
    "With joblessness surging toward <strong>6 million unemployed</strong>, Chancellor <strong>Heinrich Brüning deflation</strong> policies worsened the crisis through unpopular welfare and wage reductions, earning him the despised moniker of <strong>Hunger Chancellor cuts</strong>.",
    "Propaganda director <strong>Joseph Goebbels propaganda</strong> innovated modern campaigning through pioneering <strong>'Hitler over Germany' flights</strong> by aeroplane alongside pervasive <strong>radio & mass posters</strong> promising work and bread.",
    "The Nazis broadened their electoral base through strong <strong>Mittelstand small-business appeal</strong>, exploiting bourgeois <strong>fear of Communist revolution</strong> to attract wealthy <strong>industrialist financial backing</strong>.",
    "Capitalizing on mass desperation, the Nazis achieved an electoral breakthrough in the <strong>July 1932 election (37.3%)</strong>, capturing <strong>230 Reichstag seats</strong> to emerge decisively as Germany’s <strong>largest parliamentary party</strong>."
  ],
  // KT2.4
  "lesson_2_4": [
    "Following <strong>Brüning dismissal (May 1932)</strong> and the total <strong>Article 48 rule failure</strong> to maintain parliamentary majorities, decisive <strong>President Hindenburg intervention</strong> left German governance entirely in presidential hands.",
    "Hindenburg appointed aristocrat <strong>Franz von Papen chancellor</strong> to lead an unelected <strong>'Cabinet of Barons'</strong>, but his regime proved fragile following a notable <strong>November election seat decline</strong> for both the government and Nazis.",
    "Papen’s successor <strong>General Kurt von Schleicher</strong> plunged Berlin into a deep <strong>cabinet intrigue crisis</strong>, exacerbated by his complete <strong>failure to split Nazis</strong> through negotiations with Gregor Strasser.",
    "Seeking revenge against Schleicher, ruthless <strong>Von Papen backroom intrigue</strong> ensured <strong>Hindenburg appointment persuaded</strong> under the arrogant and mistaken <strong>'Hitler boxed in' belief</strong> that conservative elites could easily control the new chancellor.",
    "On <strong>30 January 1933</strong>, democracy ended as <strong>Hitler sworn chancellor</strong> of a coalition cabinet, celebrated that night by twenty-five thousand SA stormtroopers staging triumphant <strong>torchlight victory parades</strong> through Berlin."
  ],
  // KT3.1
  "lesson_3_1": [
    "When arson destroyed the parliament in the <strong>Reichstag Fire (Feb 1933)</strong>, the arrest of Dutch communist <strong>Marinus van der Lubbe</strong> was seized upon by Hitler to fabricate a terrifying <strong>communist plot allegation</strong>.",
    "Hitler persuaded Hindenburg to sign the emergency <strong>Reichstag Fire Decree</strong>, under which constitutional <strong>habeas corpus suspended</strong> completely, enabling the police to carry out <strong>mass Communist arrests</strong> and suppress free press.",
    "Surrounded by armed SA stormtroopers during the dramatic <strong>Kroll Opera House vote</strong>, intimidated politicians passed the <strong>1933 Enabling Act</strong>, whereby all legislative <strong>Reichstag powers surrendered</strong> directly to Hitler's cabinet.",
    "To eliminate internal radical rivals and placate the regular army, Hitler ordered the bloody June 1934 <strong>Night of Long Knives</strong>, ensuring SA chief <strong>Ernst Röhm executed</strong> as the violent <strong>SA paramilitary purged</strong> decisively.",
    "In August 1934 when elderly <strong>President Hindenburg dies</strong>, Hitler had the constitutional offices of <strong>Führer and Chancellor combined</strong>, cementing his absolute dictatorship when soldiers swore an unconditional <strong>armed forces loyalty oath</strong> to him personally."
  ],
  // KT3.2
  "lesson_3_2": [
    "Terror apparatus was consolidated under <strong>Heinrich Himmler SS</strong>, whose elite <strong>Schutzstaffel blackshirts</strong> and Reinhard Heydrich's pervasive <strong>SD intelligence security</strong> network monitored potential dissenters across society.",
    "Citizens were terrorized by the ruthless <strong>Gestapo secret police</strong>, who bypassed judicial courts by consigning political suspects to <strong>indefinite protective custody</strong> within the brutal <strong>Dachau concentration camp (1933)</strong> system.",
    "The regime subverted the legal profession through the compulsory <strong>National Socialist League Jurists</strong> and established the notorious <strong>People's Court (Roland Freisler)</strong>, ensuring traditional <strong>judicial independence abolished</strong> in favour of ideological loyalty.",
    "Hitler neutralized Catholic political opposition by signing the <strong>Reichskonkordat treaty (1933)</strong> with the Vatican, under which <strong>Catholic Church autonomy promised</strong> in worship while the Catholic <strong>Center Party dissolved</strong> itself.",
    "Although the regime established a unified, swastika-adorned <strong>Protestant Reich Church</strong> under Ludwig Müller, courageous religious leaders led by <strong>Martin Niemöller opposition</strong> formed the rival <strong>Confessional Church resistance</strong> to defend Christian doctrine."
  ],
  // KT3.3
  "lesson_3_3": [
    "Ideological conformity was enforced by the newly created <strong>Reich Ministry of Propaganda</strong>, placing <strong>Joseph Goebbels control</strong> over all communication channels to impose <strong>total media censorship</strong> across Germany.",
    "Goebbels mass-produced the affordable <strong>Volksempfänger cheap radio</strong> to achieve over <strong>70% household radio ownership</strong>, while strictly enforcing draconian <strong>foreign broadcast bans</strong> to isolate citizens from external news.",
    "Mass spectacle peaked during the grand <strong>annual Nuremberg Rallies</strong>, where Albert Speer’s dazzling <strong>Zeppelin Field cathedral of light</strong> and monumental <strong>Leni Riefenstahl propaganda films</strong> mesmerized millions with images of supreme national unity.",
    "The regime exploited the prestigious <strong>Berlin Olympics (1936)</strong> as a choreographed <strong>Nazi athletic showcase</strong> for Aryan superiority, though racial propaganda was famously disrupted by African-American athlete <strong>Jesse Owens track victories</strong>.",
    "Cultural life was purged of modernist influence through public <strong>1933 Book burnings</strong> and an aggressive <strong>'Degenerate Art' ban</strong>, replaced by monumental <strong>Albert Speer neoclassical architecture</strong> designed to demonstrate state power."
  ],
  // KT3.4
  "lesson_3_4": [
    "Widespread civilian obedience was sustained through genuine <strong>popular Nazi conformity</strong> driven by broad <strong>economic recovery approval</strong> alongside pervasive <strong>terror police compliance</strong> that silenced private misgivings.",
    "Left-wing opponents organized courageous <strong>KPD and SPD underground cells</strong> and clandestine <strong>Rote Kapelle courier networks</strong>, actively resisting the regime through coordinated <strong>factory sabotage & illegal leaflets</strong>.",
    "Working-class teenagers expressed overt <strong>Edelweiss Pirates defiance</strong> through spontaneous <strong>working-class youth rebellion</strong>, mocking official indoctrination by conducting <strong>camp beatings & anti-Nazi leaflets</strong> drops against Hitler Youth patrols.",
    "Affluent bourgeois adolescents embraced subversive <strong>Swing Youth culture</strong>, flaunting forbidden <strong>American jazz music</strong> and British fashion as a stylish vehicle for <strong>middle-class non-conformity</strong> against regimented Nazi collectivism.",
    "Religious defiance surfaced when Pope Pius XI issued the encyclical <strong>Mit Brennender Sorge (1937)</strong>, echoed domestically by dissident theologians <strong>Pastor Martin Niemöller & Bonhoeffer</strong> and brave <strong>Bishop von Galen euthanasia protests</strong> against secret murder."
  ],
  // KT4.1
  "lesson_4_1": [
    "Nazi social engineering championed the motto <strong>'Kinder, Küche, Kirche'</strong> to force women back into <strong>traditional domestic roles</strong> as child-bearers, representing a total <strong>rejection of Weimar 'New Woman'</strong> freedom.",
    "To incentivize parenthood, the state passed the <strong>1933 Marriage Loan Act</strong> providing newlywed couples with <strong>1,000-mark marriage coupons</strong>, offering a generous <strong>25% loan forgiveness per child</strong> born to encourage large Aryan families.",
    "The regime elevated motherhood by awarding prestigious <strong>Mother's Cross medals</strong> including the coveted <strong>gold cross (8 children)</strong>, while SS leader Himmler expanded the racial breeding <strong>Lebensborn maternity program</strong>.",
    "Racial hygiene was enforced through the punitive <strong>1933 Hereditary Health Act</strong>, which instituted a compulsory <strong>forced sterilization law</strong> under which over <strong>400,000 citizens sterilized</strong> for alleged genetic disorders.",
    "When industrial demands surged under <strong>Four-Year Plan rearmament</strong>, the state introduced a compulsory <strong>Duty Year labour service</strong> causing the number of essential <strong>women factory workers expand</strong> dramatically by 1939."
  ],
  // KT4.2
  "lesson_4_2": [
    "Male youth were indoctrinated in the <strong>Hitlerjugend for boys</strong>, focusing on rigorous <strong>military drill & camping</strong> expeditions designed as physical <strong>preparation for armed forces</strong> conscription.",
    "Girls were organized within the <strong>Bund Deutscher Mädel (BDM)</strong>, which combined physical fitness with intensive <strong>motherhood & domestic training</strong> and strict <strong>racial hygiene instruction</strong> for future wives.",
    "The state tightened its monopoly over adolescence through the <strong>1936 Hitler Youth Act</strong>, establishing legally <strong>compulsory membership (1939)</strong> while rival Catholic and Protestant <strong>church youth organizations banned</strong> completely.",
    "School classrooms were ideologically regimented as the vast majority joined the <strong>National Socialist Teachers League</strong>, following the purge when <strong>Jewish teachers sacked (1933)</strong> and educators attended mandatory <strong>ideological summer camps</strong>.",
    "The curriculum was transformed through thoroughly <strong>rewritten school textbooks</strong> prioritizing pseudo-scientific <strong>racial biology & Eugenics</strong>, while the regime nurtured future political leaders inside specialized <strong>Napolas elite cadet schools</strong>."
  ],
  // KT4.3
  "lesson_4_3": [
    "In May 1933 independent <strong>trade unions abolished (May 1933)</strong> and replaced by Robert Ley’s monolithic <strong>German Labour Front (DAF)</strong>, under which all <strong>strikes banned & wages frozen</strong> to ensure industrial discipline.",
    "To eliminate visible unemployment, young men were conscripted into the <strong>Reich Labour Service (RAD)</strong> for <strong>six months compulsory labour</strong> performing manual physical work on public schemes like <strong>Autobahn highway construction</strong>.",
    "Unemployment figures plummeted when peacetime <strong>military conscription reintroduced</strong> in 1935, aided by manipulated <strong>'invisible unemployment' stats</strong> wherein married <strong>women and Jews excluded</strong> from official government tallies.",
    "Worker loyalty was cultivated through the leisure division <strong>Kraft durch Freude (KdF)</strong> offering <strong>subsidized cruises & theater</strong> tickets, alongside the popular but unfulfilled <strong>Volkswagen Beetle savings scheme</strong>.",
    "Directed by Hermann Göring, the ambitious <strong>Four-Year Plan (1936)</strong> aimed at total <strong>autarky economic self-sufficiency</strong> for impending war, resulting in <strong>longer hours & food rationing</strong> of butter and meat for working families."
  ],
  // KT4.4
  "lesson_4_4": [
    "Driven by racist <strong>Aryan 'Herrenvolk' ideology</strong>, the regime initiated state-sponsored persecution with the <strong>April 1933 shop boycott</strong> against Jewish businesses, rapidly followed as <strong>Jewish civil servants purged</strong> from state employment.",
    "Anti-Semitic discrimination was formalized in the landmark <strong>Nuremberg Laws (1935)</strong>, comprising the <strong>Reich Citizenship Act</strong> stripping Jews of citizenship and the strict <strong>German Blood Protection Law</strong> criminalizing mixed marriages.",
    "Nazi biological cleansing encompassed brutal <strong>Roma Gypsy persecution</strong>, widespread <strong>pink triangle homosexual arrests</strong> sent to concentration camps, and the sinister <strong>Euthanasia T4 program origins</strong> targeting disabled infants and patients.",
    "State terror erupted into nationwide violence during the November <strong>Kristallnacht pogrom (1938)</strong>, where hundreds of <strong>synagogues burnt & shops looted</strong> by stormtroopers, culminating with <strong>30,000 Jewish men sent to camps</strong>.",
    "Following Kristallnacht, the Nazi state imposed an extortionate <strong>1 billion mark collective fine</strong> on the victimized community, forced all remaining <strong>Jewish businesses 'Aryanized'</strong>, and created the <strong>Central Emigration Office expulsions</strong> agency under Heydrich to drive Jews penniless into exile."
  ]
};

console.log('--- Step 1: Updating data/weimar_nazi_germany.json ---');
const weimarPath = 'data/weimar_nazi_germany.json';
const weimarData = JSON.parse(fs.readFileSync(weimarPath, 'utf8'));

weimarData.lessons.forEach(l => {
  const lessonId = l.id;
  const models = WEIMAR_MODELS[lessonId];
  if (!models) {
    console.error(`Missing models for lesson: ${lessonId}`);
    return;
  }

  // Get config stages
  let cfg = null;
  for (const kt of Object.keys(WEIMAR_ENQUIRY_CONFIGS)) {
    const found = WEIMAR_ENQUIRY_CONFIGS[kt].find(e => e.id === lessonId);
    if (found) {
      cfg = found;
      break;
    }
  }

  if (!cfg) {
    console.error(`Missing config for lesson: ${lessonId}`);
    return;
  }

  if (!l.workbook_stages) {
    l.workbook_stages = [];
  }

  cfg.stages.forEach((cs, sIdx) => {
    if (!l.workbook_stages[sIdx]) {
      l.workbook_stages[sIdx] = {
        step: sIdx + 1,
        title: cs.title || `Stage ${sIdx + 1}`,
        heading: cs.title || `Stage ${sIdx + 1}`,
        bullets: [...cs.bullets],
        model_sentence: models[sIdx]
      };
    } else {
      const st = l.workbook_stages[sIdx];
      st.step = sIdx + 1;
      st.heading = st.heading || st.title || cs.title || `Stage ${sIdx + 1}`;
      st.bullets = [...cs.bullets];
      st.model_sentence = models[sIdx];
      // remove old words if present or map to bullets
      st.words = cs.bullets.map(b => ({ term: b, type: 'key_term' }));
    }
  });

  console.log(`Updated ${lessonId}: 5 stages synchronized.`);
});

fs.writeFileSync(weimarPath, JSON.stringify(weimarData, null, 2), 'utf8');
fs.writeFileSync('public/' + weimarPath, JSON.stringify(weimarData, null, 2), 'utf8');

console.log('--- Step 2: Updating data/second_british_empire.json ---');
const sbePath = 'data/second_british_empire.json';
const sbeData = JSON.parse(fs.readFileSync(sbePath, 'utf8'));

sbeData.lessons.forEach(l => {
  if (l.id === 'lesson_2') {
    if (l.workbook_stages && l.workbook_stages[1]) {
      l.workbook_stages[1].model_sentence = "In response to violent demonstrations by <strong>protesting English Weavers</strong>, Parliament passed legislation <strong>banning Printed Cotton Cloth</strong> in order to succeed in <strong>protecting Home Wool Sales</strong>.";
    }
    if (l.workbook_stages && l.workbook_stages[2]) {
      l.workbook_stages[2].model_sentence = "Under the Diwani treaty, the East India Company began <strong>collecting Peasant Crop Taxes</strong> across Bengal, using this revenue for <strong>buying Silk with Local Taxes</strong> and decisively <strong>halting Silver Shipments</strong> from London.";
    }
  }
  if (l.id === 'lesson_4') {
    if (l.workbook_stages && l.workbook_stages[1]) {
      l.workbook_stages[1].model_sentence = "European imperial powers moved beyond simply <strong>building Coastal Forts</strong> by aggressively <strong>marching Troops into Interior</strong> territories and <strong>planting National Flags</strong> to claim exclusive colonial sovereignty.";
    }
  }
});

fs.writeFileSync(sbePath, JSON.stringify(sbeData, null, 2), 'utf8');
fs.writeFileSync('public/' + sbePath, JSON.stringify(sbeData, null, 2), 'utf8');

console.log('--- Step 3: Synchronizing units/weimar_nazi_germany/data.js ---');
const jsCode = `window.unitData = ${JSON.stringify(weimarData, null, 2)};\n`;
if (fs.existsSync('units/weimar_nazi_germany/data.js')) {
  fs.writeFileSync('units/weimar_nazi_germany/data.js', jsCode, 'utf8');
}
if (fs.existsSync('public/units/weimar_nazi_germany/data.js')) {
  fs.writeFileSync('public/units/weimar_nazi_germany/data.js', jsCode, 'utf8');
}

console.log('--- Step 4: Synchronizing database.json and public/database.json ---');
['database.json', 'public/database.json'].forEach(dbPath => {
  if (fs.existsSync(dbPath)) {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    // update weimar_nazi_germany
    if (db.units && db.units.weimar_nazi_germany) {
      db.units.weimar_nazi_germany.lessons = weimarData.lessons;
    }
    // update second_british_empire
    if (db.units && db.units.second_british_empire) {
      db.units.second_british_empire.lessons = sbeData.lessons;
    }
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
    console.log(`Updated ${dbPath}`);
  }
});

console.log('--- Step 5: Verification & Zero-Remaining Audit ---');
let totalDoctrinalRemaining = 0;
const allFiles = fs.readdirSync('data').filter(f => f.endsWith('.json'));
allFiles.forEach(f => {
  const txt = fs.readFileSync(path.join('data', f), 'utf8');
  if (txt.includes('doctrinal control')) {
    totalDoctrinalRemaining++;
    console.error(`FAILURE: 'doctrinal control' still found in data/${f}`);
  }
});

if (totalDoctrinalRemaining === 0) {
  console.log('SUCCESS: ZERO instances of "doctrinal control" remain across ALL data files!');
} else {
  console.error(`ERROR: ${totalDoctrinalRemaining} files still contain "doctrinal control"!`);
}
