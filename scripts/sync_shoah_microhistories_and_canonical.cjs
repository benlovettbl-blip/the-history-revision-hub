const fs = require('fs');
const path = require('path');

const microHistoriesData = [
  {
    id: 'richard_stern',
    name: 'Richard Stern',
    group: 'German-Jewish Veteran & Anti-Boycott Resister',
    birthplace: 'Cologne, Germany',
    dates: '1899–1967',
    region: 'Western Europe (Germany)',
    bio: 'A decorated German-Jewish soldier awarded the Iron Cross in WWI. On 1 April 1933, when SA stormtroopers launched the nationwide anti-Jewish boycott, Richard pinned his Iron Cross to his jacket and stood defiantly outside his shop beside the stormtrooper, handing out leaflets protesting the Nazi betrayal of German-Jewish patriots. He escaped to America in 1939 and enlisted in the US Army at age 43 to fight Hitler.',
    quote: 'I do not fight for revenge. I fight for the honour of those who believed in a free Germany and were betrayed by criminals.',
    citation: 'Letter from Camp Ritchie training depot (1942)',
    enquiries: [1, 2],
    journey: [
      { stage: '1. Pre-War Life (1914–1932)', text: 'Served patriotically in the German Imperial Army in WWI, awarded the Iron Cross 2nd Class for bravery under fire. Fully integrated into Cologne civic life running a textile business.' },
      { stage: '2. Nazi Boycott Defiance (April 1933)', text: 'Refused to hide during the 1 April 1933 Nazi boycott. Stood on the pavement in uniform with his Iron Cross, handing out protest pamphlets to customers.' },
      { stage: '3. Stripping of Rights (1935–1938)', text: 'Stripped of German citizenship under the 1935 Nuremberg Laws. Faced increasing economic aryanisation and harassment in Cologne.' },
      { stage: '4. Escape to America (1939)', text: 'Fled Nazi Germany via Belgium to New York in 1939, arriving with almost nothing after property confiscation.' },
      { stage: '5. Fighting Back in US Army (1942–1945)', text: 'Volunteered for the US Army at age 43. Served in the military intelligence and psychological warfare service at Camp Ritchie, helping defeat Nazi Germany.' }
    ],
    image: '/images/default_person.svg'
  },
  {
    id: 'heinz_kounio',
    name: 'Heinz Salvator Kounio',
    group: 'Sephardic Greek Jewry & Auschwitz Survivor',
    birthplace: 'Thessaloniki, Greece',
    dates: '1927–Living',
    region: 'Southern Europe (Balkans / Mediterranean)',
    bio: 'Born into the historic Sephardic Jewish community of Thessaloniki where over 50,000 Jews spoke Ladino. In March 1943, Nazi authorities rounded up the entire community into the Baron Hirsch ghetto before deporting 45,000 people to Auschwitz-Birkenau. Over 96% were murdered. 15-year-old Heinz survived on the selection ramp because he spoke fluent German and was ordered to interpret orders for arriving Greek transports.',
    quote: 'In one hour, five people became two. My mother and sister disappeared into the smoke. I had to interpret orders for the SS.',
    citation: 'A Liter of Soup and 60 Grams of Bread (Yad Vashem Memoir)',
    enquiries: [1, 5],
    journey: [
      { stage: '1. Pre-War Sephardic World (1927–1941)', text: 'Grew up in Thessaloniki (the "Jerusalem of the Balkans"), speaking Ladino at home and Greek at school. His father was a prominent photographer and printer.' },
      { stage: '2. German Occupation (1941–1943)', text: 'German forces occupied northern Greece in April 1941. In July 1942 (Black Shabbat), 9,000 Jewish men were publicly tortured on Liberty Square.' },
      { stage: '3. Baron Hirsch Ghetto & Deportation (March 1943)', text: 'Enclosed in the Baron Hirsch transit ghetto beside the railway station; crammed into freight trains for the 7-day journey to Poland.' },
      { stage: '4. Auschwitz Selection & Translation (1943–1945)', text: 'Arrived at Birkenau on 20 March 1943. Because he and his father spoke fluent German, the SS assigned them as camp interpreters and photographic technicians, sparing their lives.' },
      { stage: '5. Death March & Liberation (1945)', text: 'Surviving the January 1945 death march from Auschwitz to Mauthausen and Ebensee, Heinz was liberated by American troops in May 1945, returning to Thessaloniki to rebuild Jewish communal memory.' }
    ],
    image: '/images/default_person.svg'
  },
  {
    id: 'dawid_sierakowiak',
    name: 'Dawid Sierakowiak',
    group: 'Łódź Ghetto Youth & Eyewitness Diarist',
    birthplace: 'Łódź, Poland',
    dates: '1924–1943',
    region: 'Eastern Europe (Poland)',
    bio: 'A 15-year-old high school student in Łódź, Poland, Dawid kept five detailed diary notebooks after 160,000 Jews were trapped behind barbed wire in 1940. He recorded the daily agony of starvation rations, slave labour in ghetto workshops, and the horrific September 1942 Gehsperre roundup when the SS deported 15,000 children and elderly people—including his mother—to Chełmno gas vans. Dawid died of starvation and tuberculosis in August 1943 at age 19.',
    quote: 'Hunger, only hunger. My poor mother was taken away before my eyes. In the ghetto, tears do not flow; they freeze in your heart.',
    citation: 'Łódź Ghetto Diary (September 1942 entry)',
    enquiries: [3],
    journey: [
      { stage: '1. Intellectual Pre-War Youth (1924–1939)', text: 'A brilliant pupil at the Jewish Gymnasium in Łódź, Dawid was fluent in Polish, Yiddish, German, French, and Hebrew, passionate about literature and Marxist philosophy.' },
      { stage: '2. Enclosure in the Ghetto (February 1940)', text: 'Forced from his home into the Bałuty district of Łódź, sealed off with wooden fences and barbed wire by German decree.' },
      { stage: '3. Slave Labour & Starvation (1941–1942)', text: 'Worked in ghetto workshops producing uniforms for the Wehrmacht in exchange for meager food rations of bread and turnip soup.' },
      { stage: '4. The Gehsperre Deportation (September 1942)', text: 'Witnessed the SS demand all children under 10 and adults over 65 be handed over. Dawid watched helplessly as his mother was taken to the Chełmno death camp.' },
      { stage: '5. Death from Starvation (8 August 1943)', text: 'His final diary entry ends abruptly with exhaustion. He succumbed to tuberculosis and starvation at age 19, leaving behind an irreplaceable historical record.' }
    ],
    image: '/images/default_person.svg'
  },
  {
    id: 'roza_robota',
    name: 'Roza Robota',
    group: 'Auschwitz-Birkenau Underground Resistance Leader',
    birthplace: 'Ciechanów, Poland',
    dates: '1921–1945',
    region: 'Eastern Europe (Camp Underground Resistance)',
    bio: 'Born in Ciechanów, Poland, 21-year-old Roza joined the Hashomer Hatzair youth movement before deportation to Auschwitz-Birkenau in 1942. Working under armed SS guard in the Weichsel-Union munitions factory, Roza and a clandestine network of young Jewish women smuggled gunpowder in matchboxes to the Sonderkommando prisoners. This explosive enabled them to blow up Crematorium IV on 7 October 1944. Tortured brutally by the Gestapo, Roza never betrayed her comrades.',
    quote: 'Her final whispered message from the torture bunker was "Hazak V\'Amatz"—Be strong and of good courage.',
    citation: 'Noah Zabludowicz, Auschwitz Underground Resistance Record (January 1945)',
    enquiries: [5],
    journey: [
      { stage: '1. Zionist Youth Activism (1921–1939)', text: 'Active leader in the Hashomer Hatzair youth movement in Ciechanów, emphasizing self-reliance, community solidarity, and socialist Zionism.' },
      { stage: '2. Ghetto Liquidation & Deportation (1942)', text: 'Her entire family was rounded up during the liquidation of the Ciechanów ghetto; all were gassed upon arrival at Birkenau except Roza, selected for slave labour.' },
      { stage: '3. The Gunpowder Smuggling Network (1943–1944)', text: 'Assigned to the Union munitions factory, Roza organized young women workers (including Ala Gertner, Regina Safirsztajn, and Ester Wajcblum) to secretly scrape explosive gunpowder into tins and matchboxes.' },
      { stage: '4. The Crematorium IV Uprising (7 October 1944)', text: 'The smuggled gunpowder was detonated by Sonderkommando fighters, destroying Crematorium IV and killing three SS guards in the only armed revolt inside Birkenau.' },
      { stage: '5. Torture & Martyrdom (6 January 1945)', text: 'Arrested and subjected to months of brutal torture in the Gestapo bunker of Block 11, Roza never gave up a single name. She was publicly hanged on 6 January 1945, just 21 days before Soviet liberation.' }
    ],
    image: '/images/default_person.svg'
  },
  {
    id: 'etty_hillesum',
    name: 'Etty Hillesum',
    group: 'Westerbork Transit Camp Diarist & Spiritual Witness',
    birthplace: 'Middelburg / Amsterdam, Netherlands',
    dates: '1914–1943',
    region: 'Western Europe (The Netherlands)',
    bio: 'A 27-year-old Dutch Jewish writer and intellectual in occupied Amsterdam, Etty volunteered at Westerbork transit camp to support families facing cattle-truck deportation to the East. Her diaries document the weekly terror of deportation lists while maintaining an unshakeable belief in human decency. On 7 September 1943, Etty and her family were deported to Auschwitz; she threw a postcard from the train window reading: "We left the camp singing." She was murdered on 30 November 1943.',
    quote: 'I want to be the thinking heart of the barracks. If nothing else is saved from this time, let it be that we did not lose our humanity.',
    citation: 'Etty Hillesum, Westerbork Letters (August 1943)',
    enquiries: [3, 5],
    journey: [
      { stage: '1. Bohemian Intellectual Life in Amsterdam (1914–1940)', text: 'Studied law and Slavic languages at the University of Amsterdam, deeply engaged in psychology, literature, and philosophical study.' },
      { stage: '2. The Net Closes in the Netherlands (1941–1942)', text: 'As anti-Jewish decrees banned Jews from public parks, trams, and universities, Etty began her intimate diaries recording inner spiritual resilience.' },
      { stage: '3. Westerbork Transit Camp Volunteer (1942–1943)', text: 'Refused offers to go into hiding; chose to accompany deportees at Camp Westerbork as a member of the Jewish Council, caring for sick and terrified children.' },
      { stage: '4. Chronicling the Cattle Trains (Summer 1943)', text: 'Wrote devastating letters describing the weekly Tuesday morning trains departing for Auschwitz and Sobibór, resolving to bear moral witness to human suffering.' },
      { stage: '5. Deportation to Auschwitz & Postcard (September 1943)', text: 'Deported to Auschwitz with her parents and brother Mischa on 7 September 1943. Threw a final postcard from the train window, discovered by Dutch farmers. Murdered in Auschwitz on 30 November 1943.' }
    ],
    image: '/images/default_person.svg'
  },
  {
    id: 'arek_hersh',
    name: 'Arek Hersh MBE',
    group: 'Child Survivor of Auschwitz & Windermere Child',
    birthplace: 'Sieradz, Poland',
    dates: '1928–Living',
    region: 'Eastern Europe / British Humanitarian Sanctuary',
    bio: 'Born in Sieradz, Poland in 1928, Arek was 11 when war broke out. He survived the Łódź Ghetto, slave labour camps, Auschwitz-Birkenau (surviving selection by pretending to be an adult tailor), and the freezing death march to Theresienstadt. Liberated by the Red Army in May 1945 weighing just four stone, Arek was one of 300 child survivors flown to the British Lake District (The Windermere Children) to heal and rebuild life. He settled in Leeds, dedicating his life to education.',
    quote: 'When we landed in England and saw the mountains of Windermere, we felt we had entered paradise. We learned to laugh again, to trust human beings.',
    citation: 'Arek Hersh MBE, A Detail of History (Windermere Survivor Memoir)',
    enquiries: [7],
    journey: [
      { stage: '1. Childhood in Sieradz (1928–1939)', text: 'Grew up in a religious Jewish family in central Poland, the son of a bootmaker. Was 11 years old when the German army invaded in September 1939.' },
      { stage: '2. Łódź Ghetto & Otoczno Slave Labour (1940–1942)', text: 'Interned in the Sieradz and Łódź ghettos; sent to the brutal Otoczno labour camp cleaning railway tracks, where 1,800 of the 2,000 boys died.' },
      { stage: '3. Auschwitz Ramp Selection (1944)', text: 'Deported to Auschwitz-Birkenau in 1944. During selection, an older prisoner whispered to him: "Run to the men\'s line!" He claimed to be an 18-year-old tailor, escaping immediate gassing.' },
      { stage: '4. Death March to Theresienstadt (January–May 1945)', text: 'Forced on a freezing death march across Poland and Germany in open coal wagons; liberated in Theresienstadt on 8 May 1945 weighing only 28kg.' },
      { stage: '5. The Windermere Children & Life in Britain (August 1945–Present)', text: 'Flown by the RAF to Calgarth Estate at Lake Windermere as one of the 300 orphaned survivors. Learned English, trained as an electrician in Leeds, and received an MBE for Holocaust education.' }
    ],
    image: '/images/default_person.svg'
  }
];

// List of data files to update
const targetFiles = [
  'data/the_shoah.json',
  'public/data/the_shoah.json',
  'units/the_shoah/data.js',
  'public/units/the_shoah/data.js',
  'database.json',
  'public/database.json'
];

const canonicalLessonTitles = {
  lesson_1: { title: 'Pre-War Diversity & Antisemitism', enquiry: 'Who were the Jews of Europe before the Second World War?' },
  lesson_2: { title: 'Stripping Rights & Kristallnacht (1933–1939)', enquiry: 'How were German Jews progressively stripped of citizenship and rights?' },
  lesson_3: { title: 'WWII Outbreak & Ghettoisation (1939–1941)', enquiry: 'How did the outbreak of WWII transform Nazi anti-Jewish policy?' },
  lesson_4: { title: 'Barbarossa & The Holocaust by Bullets (1941–1942)', enquiry: 'How and why did persecution turn into systematic mass murder?' },
  lesson_5: { title: 'The "Final Solution" & Armed Resistance (1942–1944)', enquiry: 'How did the "Final Solution" operate, and how did Jews resist?' },
  lesson_6: { title: 'Responsibility, Complicity & Rescue across Europe', enquiry: 'Who was responsible, who collaborated, and who tried to save?' },
  lesson_7: { title: 'Liberation, Aftermath & Legacy of Memory (1944–1948)', enquiry: 'What was lost, and what does survivor testimony teach us?' }
};

for (const file of targetFiles) {
  if (!fs.existsSync(file)) continue;
  console.log(`Updating ${file}...`);
  let isJs = file.endsWith('.js');
  let raw = fs.readFileSync(file, 'utf8');

  let prefix = '';
  if (isJs) {
    if (raw.startsWith('window.unitData = ')) {
      prefix = 'window.unitData = ';
      data = JSON.parse(raw.replace(/^window\.unitData\s*=\s*/, '').replace(/;?\s*$/, ''));
    } else {
      prefix = 'export default ';
      data = JSON.parse(raw.replace(/^export\s+default\s+/, '').replace(/;?\s*$/, ''));
    }
  } else {
    data = JSON.parse(raw);
  }

  // If this is database.json, update the_shoah unit within units array
  let unitData = data;
  if (data.units) {
    unitData = data.units.find(u => u.id === 'the_shoah');
  }

  if (unitData) {
    // Add micro_histories array
    unitData.micro_histories = microHistoriesData;

    // Also ensure key_individuals includes the 6 individuals
    unitData.key_individuals = microHistoriesData.map(m => ({
      name: m.name,
      group: m.group,
      bio: m.bio,
      quote: m.quote,
      citation: m.citation,
      image: m.image
    }));

    // Update lesson titles and enquiries to canonical standards
    if (unitData.lessons) {
      for (const les of unitData.lessons) {
        const can = canonicalLessonTitles[les.id];
        if (can) {
          les.title = `Enquiry ${les.id.replace('lesson_', '')}: ${can.enquiry}`;
          les.subtitle = `Enquiry ${les.id.replace('lesson_', '')}: ${can.title}`;
          les.enquiry = can.enquiry;
        }
      }
    }
  }

  let output;
  if (isJs) {
    output = `${prefix}${JSON.stringify(data, null, 2)};\n`;
  } else {
    output = JSON.stringify(data, null, 2);
  }
  fs.writeFileSync(file, output, 'utf8');
  console.log(`Saved ${file} successfully.`);
}

console.log('All data stores successfully updated with Six Lives Micro-Histories and Canonical Titles!');
