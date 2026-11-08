const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function syncUnitToAllLayers(unitId, updateFn) {
  const dataPath = path.join(ROOT, 'data', `${unitId}.json`);
  const publicDataPath = path.join(ROOT, 'public', 'data', `${unitId}.json`);
  let unitData = null;

  if (fs.existsSync(dataPath)) {
    unitData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    updateFn(unitData);
    fs.writeFileSync(dataPath, JSON.stringify(unitData, null, 2), 'utf8');
    console.log(`✅ Updated data/${unitId}.json`);
  }

  if (fs.existsSync(publicDataPath)) {
    const pubData = JSON.parse(fs.readFileSync(publicDataPath, 'utf8'));
    updateFn(pubData);
    fs.writeFileSync(publicDataPath, JSON.stringify(pubData, null, 2), 'utf8');
    console.log(`✅ Updated public/data/${unitId}.json`);
  }

  ['database.json', 'public/database.json'].forEach(rel => {
    const fp = path.join(ROOT, rel);
    if (fs.existsSync(fp)) {
      const db = JSON.parse(fs.readFileSync(fp, 'utf8'));
      const target = db.units ? db.units[unitId] : db[unitId];
      if (target) {
        updateFn(target);
        fs.writeFileSync(fp, JSON.stringify(db, null, 2), 'utf8');
        console.log(`✅ Updated ${rel} [${unitId}]`);
      }
    }
  });

  const unitsDataJs = path.join(ROOT, 'units', unitId, 'data.js');
  if (fs.existsSync(unitsDataJs) && unitData) {
    fs.writeFileSync(unitsDataJs, 'export default ' + JSON.stringify(unitData, null, 2) + ';\n', 'utf8');
    console.log(`✅ Updated units/${unitId}/data.js`);
  }
}

syncUnitToAllLayers('weimar_nazi_germany', (u) => {
  // Lesson 14: Nazi Policies Towards the Young (lesson_4_2)
  const l14 = u.lessons.find(l => l.id === 'lesson_4_2' || l.id === 'lesson_14');
  if (l14) {
    l14.narrative_blocks = [
      {
        id: "block_1",
        decimal: "[4.2.1]",
        title: "The Hitler Youth (Hitlerjugend) for Boys",
        text: "<span class=\"para-ref\">[4.2.1]</span> For German boys aged fourteen to eighteen, life was dominated by the <em>Hitlerjugend</em> (HJ). Aiming to forge toughened future soldiers, activities centred on military drills: <strong>Training boys in compass reading and trench warfare</strong>, small-bore rifle marksmanship, signalling, and bridge-building. Boys spent weekends <strong>Marching on overnight hikes carrying heavy military packs</strong> to build physical resilience and unconditional obedience. Upon <strong>Passing fitness tests before receiving official pocket knives</strong> engraved with the motto <em>'Blood and Honour'</em>, boys were sworn into sworn devotion to the Führer.",
        image: "/images/hitler_youth_drill_marching.jpg",
        image_alt: "Hitler Youth Military Drill",
        caption: "Hitler Youth boys on a field exercise undergoing military map-reading and endurance drills.",
        theme_heading: "Military Indoctrination",
        sources: [
          {
            id: "source_4_2_1",
            title: "Hitler Youth Training Manual",
            url: "/images/hitler_youth_drill_marching.jpg",
            caption: "Physical endurance and tactical field training were prioritized over intellectual development."
          }
        ]
      },
      {
        id: "block_2",
        decimal: "[4.2.2]",
        title: "The League of German Girls (Bund Deutscher Mädel)",
        text: "<span class=\"para-ref\">[4.2.2]</span> While boys were prepared for battlefield combat, German girls entered the <em>Bund Deutscher Mädel</em> (BDM) to be molded into fit, fertile racial mothers. Dressed identically, girls spent hours <strong>Exercising in blue skirts and white blouses outdoors</strong> to develop strong bodies capable of bearing multiple healthy Aryan children. Activities focused heavily on <strong>Learning domestic cooking and infant hygiene skills</strong>, needlework, and child-rearing. Evenings were spent <strong>Singing campfire folk songs celebrating racial community</strong> (<em>Volksgemeinschaft</em>), cementing intense ideological loyalty.",
        image: "/images/bdm_girls_calisthenics.jpg",
        image_alt: "BDM Calisthenics Exercise",
        caption: "Members of the League of German Girls performing synchronised physical exercises outdoors.",
        theme_heading: "Racial Motherhood & Duty",
        sources: [
          {
            id: "source_4_2_2",
            title: "BDM Handbook for Group Leaders",
            url: "/images/bdm_girls_calisthenics.jpg",
            caption: "The BDM prepared young women for domestic motherhood and racial service to the state."
          }
        ]
      },
      {
        id: "block_3",
        decimal: "[4.2.3]",
        title: "Compulsory Youth Membership & Resistance",
        text: "<span class=\"para-ref\">[4.2.3]</span> The regime steadily eliminated alternative youth identities. By <strong>Banning rival church youth groups and scout troops</strong> between 1933 and 1936, the state closed off independent social spaces. In December 1936, Hitler enacted the First Hitler Youth Law, followed by the 1939 decree <strong>Passing law making youth service compulsory for all children</strong> aged ten to eighteen. This apparatus culminated in <strong>Drafting eight million children into uniform by war outbreak</strong>. Despite intense conformity, rebellious youths formed dissident groups like the <em>Edelweiss Pirates</em> and <em>Swing Youth</em>, rejecting regimented militarism in favor of jazz music and freedom.",
        image: "/images/hitler_youth_rally_nuremberg.jpg",
        image_alt: "Hitler Youth Nuremberg Rally",
        caption: "Massed ranks of Hitler Youth parading before Adolf Hitler at the Nuremberg Party Rally.",
        theme_heading: "Totalitarian Coercion & Dissent",
        sources: [
          {
            id: "source_4_2_3",
            title: "Hitler Youth Law of 1936",
            url: "/images/hitler_youth_rally_nuremberg.jpg",
            caption: "The state mandated that all German youth outside home and school be educated physically, intellectually, and morally in the Hitler Youth."
          }
        ]
      },
      {
        id: "block_4",
        decimal: "[4.2.4]",
        title: "Purging Teachers & The Nazi Teachers' League",
        text: "<span class=\"para-ref\">[4.2.4]</span> Total control required the subversion of state schools. Under the Civil Service Restoration Act of April 1933, the regime began <strong>Firing Jewish and politically unreliable educators from classrooms</strong> across Germany. To retain their employment, teachers conformed en masse, resulting in <strong>Ninety-seven percent of teachers joining national league</strong> (the <em>Nationalsozialistischer Lehrerbund</em>, NSLB). Teachers were mandated to enforce racial doctrine, regularly <strong>Attending compulsory ideological camps during school holidays</strong> to master Nazi racial theory and unquestioning loyalty.",
        image: "/images/nazi_classroom_instruction.jpg",
        image_alt: "Nazi Classroom Instruction",
        caption: "A German schoolteacher conducting a lesson before a portrait of Adolf Hitler, beginning with the mandatory Hitler salute.",
        theme_heading: "Subversion of the Teaching Profession",
        sources: [
          {
            id: "source_4_2_4",
            title: "NSLB Guidelines for Teachers",
            url: "/images/nazi_classroom_instruction.jpg",
            caption: "Teachers who failed to demonstrate active enthusiasm for Nazi ideology were dismissed or reported by pupils."
          }
        ]
      },
      {
        id: "block_5",
        decimal: "[4.2.5]",
        title: "Indoctrinating the Curriculum & Elite Schools",
        text: "<span class=\"para-ref\">[4.2.5]</span> The curriculum was systematically reconstructed to serve militarism and racial biology. Physical Education dominated school life, <strong>Allocating fifteen percent of timetable to physical fitness</strong> and boxing. Every academic subject was militarised, including <strong>Calculating military bombing runs in mathematics word problems</strong> and studying hereditary genetics in biology. For the regime's future military and political elite, the party established prestigious boarding schools, <strong>Establishing Napolas and Adolf Hitler boarding academies for leaders</strong> run under strict SS supervision.",
        image: "/images/nazi_racial_instruction_classroom.jpg",
        image_alt: "Racial Biology Lesson in German School",
        caption: "Pupils measuring facial indices with calipers in a compulsory racial biology lesson.",
        theme_heading: "Curriculum Militarisation & Elite Academies",
        sources: [
          {
            id: "source_4_2_5",
            title: "Racial Biology School Textbook (1937)",
            url: "/images/nazi_racial_instruction_classroom.jpg",
            caption: "Classroom biology was transformed into racial pseudo-science justifying Aryan superiority."
          }
        ]
      }
    ];
    console.log('  aligned weimar_nazi_germany lesson 14 (lesson_4_2)');
  }

  // Lesson 16: Persecution of Minorities (lesson_4_4)
  const l16 = u.lessons.find(l => l.id === 'lesson_4_4' || l.id === 'lesson_16');
  if (l16) {
    l16.narrative_blocks = [
      {
        id: "block_1",
        decimal: "[4.4.1]",
        title: "Aryan Supremacy & The April Anti-Jewish Boycott",
        text: "<span class=\"para-ref\">[4.4.1]</span> Nazi policy was rooted in biological Social Darwinism, <strong>Placing Aryans atop biological hierarchy and others beneath</strong> as subhuman <em>Untermenschen</em>. On 1 April 1933, the regime launched its first nationwide anti-Semitic campaign, with brownshirt <strong>Stormtroopers standing outside department stores with placards</strong> bearing the warning: <em>'Germans! Defend yourselves! Do not buy from Jews!'</em> Days later, the Civil Service Act began <strong>Excluding Jewish civil servants from government administrative posts</strong>, universities, and judicial courts.",
        image: "/images/1933_anti_jewish_boycott_berlin.jpg",
        image_alt: "April 1933 Anti-Jewish Boycott Berlin",
        caption: "SA stormtroopers picketing a Jewish-owned retail shop during the nationwide boycott of 1 April 1933.",
        theme_heading: "Racial Hierarchy & Economic Boycott",
        sources: [
          {
            id: "source_4_4_1",
            title: "April 1933 Boycott Proclamation",
            url: "/images/1933_anti_jewish_boycott_berlin.jpg",
            caption: "The 1933 boycott signaled the official transition from party street violence to state-sponsored economic exclusion."
          }
        ]
      },
      {
        id: "block_2",
        decimal: "[4.4.2]",
        title: "The Nuremberg Laws (Citizenship & Blood Protection)",
        text: "<span class=\"para-ref\">[4.4.2]</span> In September 1935, racial persecution was codified into constitutional law at the annual Nuremberg rally. The Reich Citizenship Law attacked legal status by <strong>Stripping German Jews of civil rights and passport vote</strong>, demoting them from citizens to mere subjects. The Law for the Protection of German Blood and Honour criminalised intermarriage, <strong>Outlawing marriage and sexual relations with German blood</strong> under pain of imprisonment for 'racial defilement'. Identity was defined biologically rather than religiously, <strong>Classifying citizens through grandfather parish baptism records</strong>.",
        image: "/images/nuremberg_laws_racial_chart_1935.jpg",
        image_alt: "Nuremberg Laws Racial Classification Chart",
        caption: "Official diagram illustrating legal categories of citizenship based on the number of Jewish grandparents.",
        theme_heading: "Legalised Biological Segregation",
        sources: [
          {
            id: "source_4_4_2",
            title: "Text of the Nuremberg Laws (1935)",
            url: "/images/nuremberg_laws_racial_chart_1935.jpg",
            caption: "The Nuremberg Laws institutionalized biological racism and stripped Jewish Germans of citizenship."
          }
        ]
      },
      {
        id: "block_3",
        decimal: "[4.4.3]",
        title: "Persecution of Roma, Homosexuals & The Disabled",
        text: "<span class=\"para-ref\">[4.4.3]</span> Beyond Jews, the racial state targeted all deemed 'asocial' or biologically defective. The SS systematically arrested Gypsies, <strong>Deporting Roma into municipal camps on city outskirts</strong> like Marzahn before transferring them to extermination camps. The Gestapo rigorously enforced Paragraph 175, <strong>Sending pink-triangle prisoners to concentration camp barracks</strong> where thousands were worked to death. Under the 1933 Sterilisation Law, the regime attacked hereditary illness by <strong>Compulsorily sterilising patients diagnosed with schizophrenia</strong>, depression, or physical deformities, forcibly sterilising over 350,000 citizens.",
        image: "/images/marzahn_roma_camp_berlin.jpg",
        image_alt: "Marzahn Roma Internment Camp",
        caption: "Roma and Sinti families held at the Marzahn internment camp outside Berlin prior to mass deportation.",
        theme_heading: "The Wider Racial Terror",
        sources: [
          {
            id: "source_4_4_3",
            title: "Law for the Prevention of Hereditarily Diseased Offspring",
            url: "/images/marzahn_roma_camp_berlin.jpg",
            caption: "Forced sterilisation and internment were used to systematically purge the German gene pool."
          }
        ]
      },
      {
        id: "block_4",
        decimal: "[4.4.4]",
        title: "Kristallnacht (The Night of Broken Glass)",
        text: "<span class=\"para-ref\">[4.4.4]</span> On 9–10 November 1938, state violence escalated into a murderous pogrom following the assassination of a German diplomat in Paris. Propaganda Minister Joseph <strong>Goebbels ordering SA in plain clothes into streets</strong> unleashed orchestrated mobs across the Reich. Rioting gangs carried out violent vandalism, <strong>Shattering windows of seven thousand Jewish shops</strong> and ransacking homes. Flames consumed Jewish places of worship, <strong>Burning thousand synagogues as police instructed to watch</strong> without interfering while fire brigades only protected neighbouring German properties. Over ninety Jews were murdered, and thirty thousand sent to concentration camps.",
        image: "/images/kristallnacht_synagogue_burning_1938.jpg",
        image_alt: "Synagogue Burning on Kristallnacht",
        caption: "A burning synagogue in 1938 surrounded by bystanders and firefighters instructed not to extinguish the flames.",
        theme_heading: "State-Orchestrated Pogrom",
        sources: [
          {
            id: "source_4_4_4",
            title: "Heydrich's Confidential Instructions on Kristallnacht",
            url: "/images/kristallnacht_synagogue_burning_1938.jpg",
            caption: "Reich Security Chief Heydrich ordered police not to prevent violent demonstrations against Jewish targets."
          }
        ]
      },
      {
        id: "block_5",
        decimal: "[4.4.5]",
        title: "Economic Expropriation & Forced Emigration",
        text: "<span class=\"para-ref\">[4.4.5]</span> In the wake of Kristallnacht, the Nazi state accelerated total economic dispossession. The regime blamed the victims, <strong>Imposing one-billion-mark fine on community for damages</strong> and confiscating insurance payouts. Jewish businesses were liquidated through compulsory 'Aryanisation', and social exclusion intensified with decrees <strong>Banning children from attending German state primary schools</strong>, cinemas, and parks. Led by Reinhard Heydrich, the <strong>Central Office for Jewish Emigration expelling thousands penniless</strong> forced over half of Germany’s Jewish population into desperate flight abroad before borders slammed shut in 1939.",
        image: "/images/forced_jewish_emigration_queues_1939.jpg",
        image_alt: "Queues for Emigration Visas Berlin 1939",
        caption: "Desperate Jewish families queueing outside foreign consulates in Berlin in 1939 trying to escape the Third Reich.",
        theme_heading: "Economic Ruin & Desperate Flight",
        sources: [
          {
            id: "source_4_4_5",
            title: "Decree on the Elimination of the Jews from Economic Life",
            url: "/images/forced_jewish_emigration_queues_1939.jpg",
            caption: "By 1939, Jewish Germans had been completely stripped of their wealth, livelihoods, and basic civil existence."
          }
        ]
      }
    ];
    console.log('  aligned weimar_nazi_germany lesson 16 (lesson_4_4)');
  }
});

console.log('\n🎉 Finished realigning Weimar lessons across all layers.');

