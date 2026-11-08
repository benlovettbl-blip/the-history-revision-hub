const fs = require('fs');
const path = require('path');

const shoahPath = path.join(__dirname, '../data/the_shoah.json');
const pubShoahPath = path.join(__dirname, '../public/data/the_shoah.json');
const dbPath = path.join(__dirname, '../database.json');
const pubDbPath = path.join(__dirname, '../public/database.json');

const shoah = JSON.parse(fs.readFileSync(shoahPath, 'utf8'));

const fixes = {
  "1_1": {
    words: [
      { term: "9.5 million Jewish people", clue: "The total Jewish population residing across continental Europe on the eve of the Second World War." },
      { term: "European Jewry", clue: "The diverse communities of Jewish people living across Europe with rich cultural, religious, and civic traditions." },
      { term: "Yiddish", clue: "The Germanic language written in Hebrew characters spoken by the majority of Ashkenazi Jews in Central and Eastern Europe." }
    ],
    model: "Prior to the Second World War, the vibrant tapestry of <strong>European Jewry</strong> encompassed over <strong>9.5 million Jewish people</strong>, many of whom spoke <strong>Yiddish</strong> in thriving communities across Central and Eastern Europe."
  },
  "1_2": {
    words: [
      { term: "shtetls", clue: "Small market towns in Poland, Ukraine, and Lithuania with large, close-knit Jewish populations." },
      { term: "Yiddish culture", clue: "The flourishing literary, musical, and theatrical heritage that defined Jewish daily life in Eastern Europe." },
      { term: "Vilna", clue: "The capital of Lithuania celebrated as the 'Jerusalem of the North' for its renowned talmudic academies and secular Yiddish institutes." }
    ],
    model: "Centred in small market towns known as <strong>shtetls</strong> and major cultural capitals like <strong>Vilna</strong>, Eastern European Jewish civilization flourished through the everyday vitality of <strong>Yiddish culture</strong>."
  },
  "1_3": {
    words: [
      { term: "assimilated", clue: "Jewish citizens who integrated deeply into mainstream German culture, language, university education, and professional life." },
      { term: "100,000 German Jewish soldiers", clue: "The patriotic Jewish men who enlisted in the Kaiser's army during WWI, with 12,000 dying on the battlefields for Germany." },
      { term: "German & Western Jews", clue: "Communities in Germany, France, and Britain who viewed themselves as patriotic citizens of their respective nations." }
    ],
    model: "In Weimar Germany, highly <strong>assimilated</strong> communities of <strong>German & Western Jews</strong> took immense pride in their citizenship, demonstrated when over <strong>100,000 German Jewish soldiers</strong> served in the imperial armed forces."
  },
  "1_4": {
    words: [
      { term: "Sephardic Jewish communities", clue: "Communities descended from Jews expelled from Spain and Portugal in the 1490s, settled across the Mediterranean." },
      { term: "Thessaloniki", clue: "The historic Aegean port city known as the 'Jerusalem of the Balkans', where Sephardic Jews formed the majority of the city's population." },
      { term: "Ladino language", clue: "The Judeo-Spanish language spoken and written in Hebrew script by Sephardic communities for over four centuries." }
    ],
    model: "Vibrant <strong>Sephardic Jewish communities</strong> flourished across Southern Europe, most notably in <strong>Thessaloniki</strong> where families maintained their rich heritage and traditional <strong>Ladino language</strong>."
  },
  "2_5": {
    words: [
      { term: "Évian Conference (1938)", clue: "The July 1938 international conference called by Roosevelt where 32 nations offered sympathy but refused to expand immigration quotas for German Jewish refugees." },
      { term: "Kindertransport", clue: "The British rescue mission that brought nearly 10,000 unaccompanied refugee children to safety in the UK between December 1938 and September 1939." },
      { term: "10,000 refugee children rescued", clue: "The predominantly Jewish children under 17 given temporary asylum in Britain provided they had private sponsors and left their parents behind." }
    ],
    model: "Following international inaction at the <strong>Évian Conference (1938)</strong>, the British <strong>Kindertransport</strong> initiative saw nearly <strong>10,000 refugee children rescued</strong> from escalating Nazi terror."
  },
  "3_3": {
    words: [
      { term: "urban ghettos", clue: "Walled, overcrowded districts in Polish cities established by Nazi occupiers to isolate, exploit, and starve Jewish populations." },
      { term: "Warsaw Ghetto", clue: "The largest ghetto in Nazi-occupied Europe, confining over 400,000 Jews into just 1.3 square miles under catastrophic humanitarian conditions." },
      { term: "sealed brick walls", clue: "Ten-foot high brick walls topped with broken glass and barbed wire constructed around the ghetto perimeter, guarded by armed police." }
    ],
    model: "Nazi authorities established overcrowded <strong>urban ghettos</strong> to segregate Polish Jewry, imprisoning over 400,000 people inside the <strong>Warsaw Ghetto</strong> behind <strong>sealed brick walls</strong>."
  },
  "3_5": {
    words: [
      { term: "Emanuel Ringelblum", clue: "The heroic Polish-Jewish historian who assembled and directed the clandestine underground archive chronicling the tragedy of the Warsaw Ghetto." },
      { term: "Oyneg Shabes archive", clue: "The secret codename ('Sabbath Joy') for the clandestine historical archive that gathered diaries, ration cards, posters, and photographs." },
      { term: "buried milk cans", clue: "The heavy metal containers and tin boxes used to bury the archive beneath ghetto basements to ensure the historical truth survived." }
    ],
    model: "Under the leadership of historian <strong>Emanuel Ringelblum</strong>, the clandestine <strong>Oyneg Shabes archive</strong> preserved eyewitness testimony of ghetto life inside sealed tin boxes and <strong>buried milk cans</strong>."
  },
  "4_5": {
    words: [
      { term: "mass shooting psychological strain", clue: "The alcoholism, breakdowns, and demoralization experienced by German shooting squads executing women and children face-to-face." },
      { term: "Heinrich Himmler & SS technicians", clue: "Nazi leaders who sought more impersonal, automated methods of mass extermination to shield executioners from psychological trauma." },
      { term: "shift to gas vans", clue: "The deployment of hermetically sealed trucks redirecting exhaust fumes into passenger compartments, tested at Chełmno in December 1941." }
    ],
    model: "Citing <strong>mass shooting psychological strain</strong> among execution squads, <strong>Heinrich Himmler & SS technicians</strong> ordered the lethal <strong>shift to gas vans</strong> as a prelude to extermination camps."
  },
  "5_2": {
    words: [
      { term: "Operation Reinhard", clue: "The top-secret Nazi plan coordinated by Odilo Globocnik to murder all two million Polish Jews in the General Government." },
      { term: "Bełżec, Sobibór, and Treblinka", clue: "The three purpose-built industrial death camps constructed in eastern Poland equipped with carbon monoxide gas chambers." },
      { term: "1.7 million murder victims", clue: "The staggering death toll of Jewish men, women, and children slaughtered in the Operation Reinhard camps between March 1942 and late 1943." }
    ],
    model: "Codenamed <strong>Operation Reinhard</strong>, the Nazi regime constructed the purpose-built death camps of <strong>Bełżec, Sobibór, and Treblinka</strong>, resulting in over <strong>1.7 million murder victims</strong>."
  },
  "5_3": {
    words: [
      { term: "Auschwitz-Birkenau", clue: "The largest Nazi concentration and extermination complex in Poland, combining industrial slave labour with mass murder via gas chambers." },
      { term: "Zyklon B gas chambers", clue: "The commercial hydrogen cyanide pesticide pellets dropped into disguised underground shower rooms to asphyxiate up to 2,000 victims at a time." },
      { term: "1.1 million murdered", clue: "The human death toll at Auschwitz-Birkenau, including nearly one million European Jews alongside Roma, Soviet prisoners of war, and Poles." }
    ],
    model: "Operating as an industrial death factory, <strong>Auschwitz-Birkenau</strong> utilized <strong>Zyklon B gas chambers</strong> to execute over <strong>1.1 million murdered</strong> victims, predominantly European Jews."
  },
  "5_5": {
    words: [
      { term: "Treblinka revolt", clue: "The August 1943 prisoner uprising where Sonderkommando inmates seized weapons from the camp armory, torched barracks, and allowed several hundred to escape." },
      { term: "Sobibór uprising", clue: "The October 1943 revolt led by Leon Feldhendler and Alexander Pechersky, killing eleven SS officers and leading to the permanent closure of the camp." },
      { term: "armed camp rebellions", clue: "Desperate, heroic prisoner revolts in extermination centres demonstrating that Jewish victims resisted their executioners even inside the death camps." }
    ],
    model: "Defying impossible odds, Jewish Sonderkommandos organized <strong>armed camp rebellions</strong> including the heroic August 1943 <strong>Treblinka revolt</strong> and the October 1943 <strong>Sobibór uprising</strong>."
  },
  "6_1": {
    words: [
      { term: "Raul Hilberg's analysis", clue: "The pioneering historical study 'The Destruction of the European Jews' demonstrating that the Holocaust required the active cooperation of the entire German state apparatus." },
      { term: "Deutsche Reichsbahn railway network", clue: "The German state railway system that scheduled and routed deportation trains across Europe, charging the SS passenger fares for each victim." },
      { term: "civil service complicity", clue: "The routine participation of bank tellers, lawyers, police officers, and clerks whose ordinary bureaucratic actions made genocide possible." }
    ],
    model: "As shown in <strong>Raul Hilberg's analysis</strong>, executing the Holocaust required extensive <strong>civil service complicity</strong> and the logistical cooperation of the <strong>Deutsche Reichsbahn railway network</strong>."
  },
  "6_2": {
    words: [
      { term: "437,000 Hungarian Jews deported", clue: "The lightning deportation of over 430,000 Hungarian Jewish citizens to Auschwitz in just 54 days between May and July 1944." },
      { term: "Vichy and Arrow Cross collaboration", clue: "Fascist and collaborationist regimes across France, Slovakia, and Hungary that actively rounded up their Jewish citizens for deportation." },
      { term: "European-wide complicity", clue: "The painful historical reality that the Final Solution was facilitated by local police forces, civil servants, and informants across conquered Europe." }
    ],
    model: "Demonstrating tragic <strong>European-wide complicity</strong>, <strong>Vichy and Arrow Cross collaboration</strong> culminated when over <strong>437,000 Hungarian Jews deported</strong> were transported to Auschwitz in fifty-four days."
  },
  "7_4": {
    words: [
      { term: "International Military Tribunal (IMT)", clue: "The international court established by Britain, the US, USSR, and France in Nuremberg in 1945 to try top Nazi leaders for war crimes." },
      { term: "crimes against humanity", clue: "The revolutionary legal concept introduced at Nuremberg to prosecute murder, extermination, enslavement, and persecution against civilian populations." },
      { term: "Raphael Lemkin's concept of genocide", clue: "The Polish-Jewish legal scholar who coined the term 'genocide' in 1944, leading directly to the 1948 UN Convention on the Prevention and Punishment of Genocide." }
    ],
    model: "The post-war <strong>International Military Tribunal (IMT)</strong> at Nuremberg prosecuted Nazi leaders for <strong>crimes against humanity</strong>, informed by <strong>Raphael Lemkin's concept of genocide</strong>."
  }
};

let count = 0;
shoah.lessons.forEach((l, li) => {
  (l.workbook_stages || l.stages || []).forEach((s, si) => {
    const key = `${li+1}_${si+1}`;
    if (fixes[key]) {
      s.words = fixes[key].words;
      s.key_terms = fixes[key].words;
      s.model_sentence = fixes[key].model;
      count++;
    }
  });
});

console.log(`Updated ${count} stages in The Shoah.`);

fs.writeFileSync(shoahPath, JSON.stringify(shoah, null, 2), 'utf8');
if (fs.existsSync(pubShoahPath)) {
  fs.writeFileSync(pubShoahPath, JSON.stringify(shoah, null, 2), 'utf8');
}

[dbPath, pubDbPath].forEach(dbp => {
  if (fs.existsSync(dbp)) {
    const db = JSON.parse(fs.readFileSync(dbp, 'utf8'));
    db.the_shoah = shoah;
    fs.writeFileSync(dbp, JSON.stringify(db, null, 2), 'utf8');
    console.log(`Updated ${dbp} (the_shoah)`);
  }
});

