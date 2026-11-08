const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');

// Master curated dictionary of verified model answers for every affected task
const correctedModels = {
  // 1. post_war_britain
  post_war_britain: {
    // Lesson 1: Suffrage (12m)
    pwb_l1_explain_why_suffrage_1918: "A primary reason British women over thirty were granted the vote in 1918 was their indispensable contribution to the war effort during the First World War. Between 1914 and 1918, over one million women entered the workforce, taking on vital roles in munitions factories, public transport, agriculture (Women's Land Army), and frontline nursing. By keeping the wartime economy alive and manufacturing the artillery shells that sustained the Western Front, women definitively dismantled the anti-suffrage argument that they lacked the physical and civic capability for parliamentary responsibility.<br><br>Furthermore, the government feared a resurgence of pre-war Suffragette militancy if electoral reform excluded women. Before 1914, Emmeline Pankhurst’s WSPU had waged an escalating campaign of arson, window-smashing, and hunger strikes. When Parliament was forced to pass the 1918 Representation of the People Act to enfranchise working-class soldiers who had lost their voting qualifications through overseas military service, politicians recognized that failing to include women would provoke immediate, violent unrest.<br><br>Finally, decades of disciplined, constitutional lobbying by Millicent Fawcett’s NUWSS (Suffragists) had already established strong cross-party parliamentary alliances. The war allowed politicians who had previously opposed women's suffrage to reverse their stance without appearing to surrender to militant violence.",

    // Lesson 2 Task 2: NHS Creation Consequence (4m)
    pwb_l2_consequence_nhs_creation: "One consequence of the creation of the National Health Service on 5 July 1948 was the elimination of the financial barrier to medical care for working-class families, establishing universal healthcare free at the point of delivery based on clinical need rather than ability to pay. Specifically, millions of working-class citizens who had previously delayed seeing a doctor due to the terror of medical bills immediately accessed treatment, with over 187 million prescriptions dispensed and millions of pairs of free spectacles and dental dentures fitted in the first year alone. This transformed public health, dramatically reducing infant and maternal mortality and eliminating untreated chronic infections across industrial Britain.",

    // Lesson 4: Bristol Bus Boycott (8m narrative)
    pwb_l4_narrative_account_bus_boycott: "Initially, in April 1963, 18-year-old student Guy Bailey was refused a job interview by the Bristol Omnibus Company because of their strict \"colour bar\" ban on employing Black and Asian crews. Outraged by this blatant racial discrimination, civil rights leaders Paul Stephenson, Roy Hackett, and the West Indian Development Council launched a total boycott of the city's bus network.<br><br>As a result, the boycott gained massive public momentum, attracting national media coverage and active solidarity from Bristol University students, local churches, and prominent politicians including Bristol South MP Tony Benn and Labour leader Harold Wilson. For four months, thousands of West Indian and white supporters refused to use municipal transport, causing significant revenue loss and severe moral embarrassment to the transport company.<br><br>Finally, on 28 August 1963—the same day Martin Luther King delivered his \"I Have a Dream\" speech in Washington—the Transport and General Workers' Union voted to abolish the colour bar, with the company hiring its first non-white conductor, Raghbir Singh, in September. This landmark victory demonstrated the power of peaceful direct action and directly pressured Harold Wilson's government into enacting Britain's first anti-discrimination law, the Race Relations Act of 1965.",

    // Lesson 5: Cold War Civil Defence (12m evaluative)
    pwb_l5_evaluative_essay_nuclear: "On the one hand, public-facing civil defence preparations were largely cosmetic exercises in morale maintenance rather than genuine survival strategies against thermonuclear attack. Government advice pamphlets like \"Protect and Survive\" instructed families to build makeshift \"fallout rooms\" inside their homes using doors, mattresses, and whitewashed windows to deflect thermal radiation. In reality, given the catastrophic blast radius, firestorms, and radioactive fallout of modern Soviet multi-megaton hydrogen bombs, these flimsy domestic measures would have offered zero protection, serving primarily to project an illusion of control and suppress public hysteria and CND anti-nuclear protests.<br><br>On the other hand, genuine, heavily funded survival infrastructure was constructed to preserve military command and continuity of government. Massive hardened subterranean bunker complexes, such as the 35-acre Central Government War Headquarters (\"Burlington\") at Corsham, were engineered with self-contained air filtration, communication networks, and food stockpiles to keep political and military elites alive for months. Furthermore, the Royal Observer Corps operated a nationwide network of 1,500 monitoring posts to calculate nuclear blast vectors. Therefore, while civil defence for the ordinary population was an exercise in morale, the state invested immense resources into elite survival and military retaliation."
  },

  // 2. first_british_empire
  first_british_empire: {
    // Lesson 1: EIC Expansion (12m)
    fbe_l1_explain_why_eic_expansion: "A primary reason the East India Company was able to expand its territorial control across Bengal was decisive military superiority and the tactical exploitation of Indian political divisions. Following the decline of the central Mughal Empire, regional nawabs engaged in bitter dynastic struggles. At the Battle of Plassey (1757), Robert Clive conspired with the disaffected general Mir Jafar to betray Nawab Siraj-ud-Daulah, securing victory with disciplined sepoy regiments equipped with modern European flintlock muskets and rapid-firing field artillery.<br><br>Furthermore, the 1765 Treaty of Allahabad granted the Company immense financial and administrative sovereignty. Defeating the combined forces of the Mughal Emperor, Awadh, and Bengal at the Battle of Buxar (1764) forced Emperor Shah Alam II to grant the EIC the 'Diwani'—the right to collect all land taxes and customs revenues across Bengal, Bihar, and Orissa. This transformed the Company from a private trading enterprise into a sovereign territorial government with millions of pounds in annual revenue to fund a permanent private standing army of over 200,000 soldiers.",

    // Lesson 5: Evaluative Essay (12m)
    fbe_l5_evaluative_essay_independence: "On the one hand, French military and naval intervention was the decisive turning point in securing American independence. Following the crucial American victory at Saratoga (1777), France formed an official military alliance with the United States in 1778, providing vital naval fleets, professional troops under General Rochambeau, and massive financial loans. Most crucially, at the Siege of Yorktown in 1781, Admiral de Grasse’s French fleet won the Battle of the Chesapeake, blockading British reinforcements by sea while Franco-American armies encircled General Cornwallis on land, forcing the final British surrender.<br><br>On the other hand, British strategic blunders and geographical distance were equally fundamental causes of the American victory. The British military faced the insurmountable logistical challenge of supplying armies across 3,000 miles of the Atlantic Ocean against a decentralized enemy with no single capital to capture. Furthermore, George Washington’s Fabian strategy of calculated retreat kept the Continental Army intact while local colonial militias waged effective guerrilla warfare. Therefore, while French naval power delivered the final blow at Yorktown, British strategic isolation in a vast, hostile continent made sustaining colonial rule impossible."
  },

  // 3. cold_war
  cold_war: {
    // Lesson 5: Vietnam War Narrative (8m)
    cw_l5_narrative_account_vietnam: "Initially, following the French defeat at Dien Bien Phu and the 1954 Geneva Accords dividing Vietnam at the 17th parallel, the United States intervened to prevent communist expansion under President Eisenhower’s 'domino theory'. Under Presidents Eisenhower and Kennedy, the US sent financial aid and thousands of military 'advisers' (Green Berets) to support the anti-communist regime of Ngo Dinh Diem in South Vietnam.<br><br>As a result of increasing Vietcong guerrilla attacks and political instability in Saigon, the conflict escalated dramatically in August 1964 following the Gulf of Tonkin incident. President Lyndon B. Johnson used the alleged North Vietnamese torpedo boat attack to pass the Gulf of Tonkin Resolution, granting him near-unlimited authority to deploy conventional military forces. In early 1965, Johnson launched Operation Rolling Thunder, a sustained aerial bombing campaign against North Vietnam, and deployed the first US combat ground troops at Da Nang, escalating troop levels to over 500,000 soldiers by 1968.<br><br>Finally, the climax of American escalation occurred in January 1968 during the Tet Offensive, when Vietcong and North Vietnamese forces launched a coordinated surprise assault on over 100 cities, including the US Embassy in Saigon. Although militarily defeated with catastrophic communist casualties, the Tet Offensive shattered the American public’s belief that the US was winning the war, creating a profound 'credibility gap' that forced President Johnson to halt further troop increases and announce he would not seek re-election."
  },

  // 4. the_shoah
  the_shoah: {
    // Lesson 1 Task 2: Racial Antisemitism Consequence (4m)
    shoah_l1_consequence_racial_antisemitism: "One decisive consequence of the rise of 19th-century racial antisemitism was that anti-Jewish hostility became biological and inescapable rather than religious. Under pseudo-scientific theories pioneered by figures like Wilhelm Marr and Houston Stewart Chamberlain, Jews were classified as a distinct, unchangeable biological \"race\" rather than a religious group, meaning religious conversion or cultural assimilation could no longer offer protection. Specifically, this new racial ideology fueled political antisemitic parties across Germany and Austria and legitimized violent, state-tolerated pogroms in the Russian Empire (such as the 1881–1884 pogrom waves), driving over two million traumatised Jews to flee Eastern Europe.",

    // Lesson 5 Task 2: Warsaw Ghetto Uprising (8m)
    shoah_l5_warsaw_ghetto_uprising: "A primary reason Jewish fighters launched the Warsaw Ghetto Uprising in April 1943 was the definitive knowledge that mass deportation meant industrial slaughter. By early 1943, underground courier reports confirmed that over 265,000 Warsaw Jews deported during the Great Action of summer 1942 had been murdered in Treblinka's gas chambers. Underground resistance organizations, notably the Jewish Combat Organization (ŻOB) led by 23-year-old Mordecai Anielewicz and the Jewish Military Union (ŻZW), recognized that the remaining 50,000 starving inhabitants were slated for complete liquidation.<br><br>Furthermore, the fighters were motivated by a desperate determination to die with honor and resist on their own terms. Armed with only smuggled pistols, homemade Molotov cocktails, and captured weapons, young fighters fought from interconnected cellars and sewer bunkers for nearly a month against heavily armed SS troops equipped with flame-throwers and artillery. As Anielewicz wrote, their armed resistance was not about military survival, but an uncompromising moral assertion of Jewish dignity and defiance against Nazi extermination.",

    // Lesson 6 Task 1: Allied Response Narrative (8m)
    shoah_l6_narrative_allied_response: "Initially, the international response before the outbreak of war was characterized by diplomatic inaction and closed borders. At the July 1938 Évian Conference, convened to address the growing Jewish refugee crisis from Nazi Germany and Austria, 31 of the 32 participating nations (including the US and Britain) refused to raise their immigration quotas, stranding hundreds of thousands of desperate Jews under Nazi control.<br><br>As a result, when systematic mass extermination began following the 1941 invasion of the USSR, verified intelligence smuggled out by Polish resistance courier Jan Karski and the Riegner Telegram reached Allied governments. In December 1942, the Allied powers issued a joint declaration publicly condemning Nazi extermination and promising postwar prosecution. However, despite urgent appeals from Jewish leaders, Allied military commanders consistently refused to divert bombers to destroy the railway lines to Auschwitz-Birkenau, arguing that rapid military victory against the German army was the only effective way to save remaining prisoners.<br><br>Finally, intense political pressure forced US President Franklin D. Roosevelt to create the War Refugee Board in January 1944. Working with Swedish diplomat Raoul Wallenberg in Budapest, the Board funded relief efforts, issued protective passports, and successfully rescued an estimated 200,000 European Jews from deportation in the final eighteen months of the war.",

    // Lesson 7 Task 1: Survivors Evaluative Essay (12m)
    shoah_l7_evaluative_essay_survivors: "On the one hand, military liberation by Allied forces in spring 1945 unquestionably marked the end of systematic Nazi mass murder and daily terror. British, American, and Soviet soldiers ended the horrors of gas chambers, slave labor marches, and deliberate starvation, providing immediate emergency medical triage, clean water, and food supplies to tens of thousands of emaciated prisoners who were days away from death.<br><br>On the other hand, the agony of survivors persisted for years after 1945. Most liberated survivors had lost their entire extended families, homes, and communities, leaving them completely destitute with nowhere to go. Over 250,000 Jewish survivors languished for years in allied Displaced Persons (DP) camps behind barbed wire in Germany and Austria because international borders remained closed. Furthermore, survivors who attempted to return to their hometowns in Eastern Europe faced continuing violent antisemitism, such as the July 1946 Kielce pogrom in Poland where 42 Jewish survivors were murdered by local mobs. Coupled with profound, lifelong psychological trauma and survivor guilt, liberation was the beginning of an agonizing process of rebuilding shattered lives. Therefore, while liberation ended direct Nazi murder, intense physical, social, and emotional suffering continued for decades."
  },

  // 5. water_and_sanitation
  water_and_sanitation: {
    // Lesson 3 Task 1: Early Modern Progress (12m)
    ws_l3_evaluative_essay_early_modern: "On the one hand, significant engineering and commercial progress was achieved in urban water supply during the Early Modern period. In London, Peter Morris built an innovative waterwheel at London Bridge in 1582 that harnessed tidal Thames currents to pump water through wooden pipes directly into affluent private residences. Furthermore, in 1613, Sir Hugh Myddelton completed the ambitious 38-mile New River aqueduct, bringing clean spring water from Hertfordshire into North London, which substantially improved water purity for tens of thousands of citizens compared to medieval cisterns.<br><br>On the other hand, sanitation and waste disposal remained dangerously primitive for the overwhelming majority of town dwellers. Towns lacked subterranean sewer networks; waste from domestic privies drained into porous cesspools that constantly seeped into drinking wells, while industrial offal, human excrement, and rotting refuse were routinely dumped into open gutters and waterways like London's notorious Fleet Ditch. Municipal scavenging (\"rakers\") was hopelessly overwhelmed by explosive population growth, and without any scientific knowledge of Germ Theory or waterborne disease, contaminated water continued to trigger devastating outbreaks of typhus, dysentery, and cholera. Therefore, while water engineering advanced for the wealthy, sanitation infrastructure remained stagnant and lethal."
  },

  // 6. monarchy_religion_power
  monarchy_religion_power: {
    // Lesson 5 Task 2: Turning point 1649 vs 1688 (12m)
    mrp_l5_t2_evaluative_essay: "On the one hand, the public execution of King Charles I in January 1649 was an unprecedented revolutionary turning point. By putting an anointed monarch on trial for high treason against his own people, Parliament irreversibly shattered the Divine Right of Kings. The regicide abolished both the monarchy and the House of Lords, creating England’s first and only republic (the Commonwealth under Oliver Cromwell), demonstrating that a king was legally accountable to the law and to the nation.<br><br>On the other hand, the constitutional impact of 1649 proved fragile and short-lived compared to the lasting settlement of 1688–1689. Following Cromwell’s military dictatorship, the Commonwealth collapsed, resulting in the 1660 Restoration where Charles II and James II attempted to reassert absolute royal prerogative. In contrast, the Glorious Revolution of 1688 and the 1689 Bill of Rights permanently established constitutional monarchy and parliamentary supremacy. The Crown agreed never to suspend laws, maintain an army, or levy taxes without parliamentary consent, creating a permanent constitutional framework that endures to this day. Therefore, while 1649 was the most radical ideological shock, 1688 was the more enduring and successful turning point."
  },

  // 7. great_war
  great_war: {
    // Lesson 6 Task 1: Summative Masterclass (12m)
    gw_l6_summative_masterclass: "Point 1 (Militarism & Arms Race): A decisive reason for the outbreak of war was militarism and the Anglo-German naval arms race. Following Britain's launch of HMS Dreadnought in 1906, Admiral Tirpitz's expansion of the German High Seas Fleet directly threatened Britain's maritime survival, convincing British statesmen that Germany sought European hegemony. Furthermore, military mobilization timetables, such as Germany's Schlieffen Plan, dictated that once Russia mobilized in July 1914, German generals felt compelled to strike rapidly through neutral Belgium, making a diplomatic solution impossible.<br><br>Point 2 (Alliance System): A second major cause was the rigid alliance system dividing Europe into two armed camps: the Triple Entente (Britain, France, Russia) and the Triple Alliance (Germany, Austria-Hungary, Italy). Rather than maintaining peace through deterrence, these treaties acted as a tripwire. When Germany gave Austria-Hungary the unconditional 'blank cheque' to attack Serbia in July 1914, it ensured that a localized conflict would inevitably drag all major powers into total war.<br><br>Point 3 (Balkan Nationalism & the July Crisis): Finally, the immediate trigger was explosive Slavic nationalism in the Balkans. The assassination of Archduke Franz Ferdinand by Gavrilo Princip in Sarajevo on 28 June 1914 ignited longstanding Austro-Serbian hatred. Austria-Hungary sought to destroy Serbia as a sovereign threat, triggering Russia's mobilization to protect its fellow Slavic state.<br><br>Conclusion: Overall, while the Balkan crisis lit the spark, it was the rigid alliance obligations and irreversible military timetables that converted a localized assassination into a world war."
  }
};

// Function to update a unit JSON object
function updateUnitData(unitId, data) {
  const fixes = correctedModels[unitId];
  if (!fixes) return false;
  let changed = false;

  const lessons = data.lessons || (data.curriculum && data.curriculum.lessons) || [];
  lessons.forEach((l, lIdx) => {
    (l.tasks || []).forEach((t, tIdx) => {
      // Check if taskId matches any key in fixes
      let matchedKey = null;
      if (t.id && fixes[t.id]) {
        matchedKey = t.id;
      } else {
        // Fallback matching by pattern
        Object.keys(fixes).forEach(fKey => {
          if (t.id && t.id.includes(fKey)) matchedKey = fKey;
        });
        if (!matchedKey) {
          // Check if lesson / task index matches
          if (unitId === 'post_war_britain') {
            if (lIdx === 0 && tIdx === 0) matchedKey = 'pwb_l1_explain_why_suffrage_1918';
            if (lIdx === 1 && tIdx === 1) matchedKey = 'pwb_l2_consequence_nhs_creation';
            if (lIdx === 3 && tIdx === 0) matchedKey = 'pwb_l4_narrative_account_bus_boycott';
            if (lIdx === 4 && tIdx === 0) matchedKey = 'pwb_l5_evaluative_essay_nuclear';
          } else if (unitId === 'first_british_empire') {
            if (lIdx === 0 && tIdx === 0) matchedKey = 'fbe_l1_explain_why_eic_expansion';
            if (lIdx === 4 && tIdx === 0) matchedKey = 'fbe_l5_evaluative_essay_independence';
          } else if (unitId === 'cold_war') {
            if (lIdx === 4 && tIdx === 0) matchedKey = 'cw_l5_narrative_account_vietnam';
          } else if (unitId === 'the_shoah') {
            if (lIdx === 0 && tIdx === 1) matchedKey = 'shoah_l1_consequence_racial_antisemitism';
            if (lIdx === 4 && tIdx === 1) matchedKey = 'shoah_l5_warsaw_ghetto_uprising';
            if (lIdx === 5 && tIdx === 0) matchedKey = 'shoah_l6_narrative_allied_response';
            if (lIdx === 6 && tIdx === 0) matchedKey = 'shoah_l7_evaluative_essay_survivors';
          } else if (unitId === 'water_and_sanitation') {
            if (lIdx === 2 && tIdx === 0) matchedKey = 'ws_l3_evaluative_essay_early_modern';
          } else if (unitId === 'monarchy_religion_power') {
            if (lIdx === 4 && tIdx === 1) matchedKey = 'mrp_l5_t2_evaluative_essay';
          } else if (unitId === 'great_war') {
            if (lIdx === 5 && tIdx === 0) matchedKey = 'gw_l6_summative_masterclass';
          }
        }
      }

      if (matchedKey && fixes[matchedKey]) {
        console.log(`[FIXING] ${unitId} L${lIdx+1} T${tIdx+1} (${t.id || matchedKey})`);
        t.model_answer = fixes[matchedKey];
        if (t.model !== undefined) t.model = fixes[matchedKey];
        changed = true;
      }
    });

    // Also check exam_practice.questions
    if (l.exam_practice && Array.isArray(l.exam_practice.questions)) {
      l.exam_practice.questions.forEach((eq, eqIdx) => {
        let matchedKey = null;
        if (eq.id && fixes[eq.id]) matchedKey = eq.id;
        else if (unitId === 'post_war_britain') {
          if (lIdx === 0 && eqIdx === 0) matchedKey = 'pwb_l1_explain_why_suffrage_1918';
          if (lIdx === 1 && eqIdx === 1) matchedKey = 'pwb_l2_consequence_nhs_creation';
          if (lIdx === 3 && eqIdx === 0) matchedKey = 'pwb_l4_narrative_account_bus_boycott';
          if (lIdx === 4 && eqIdx === 0) matchedKey = 'pwb_l5_evaluative_essay_nuclear';
        } else if (unitId === 'first_british_empire') {
          if (lIdx === 0 && eqIdx === 0) matchedKey = 'fbe_l1_explain_why_eic_expansion';
          if (lIdx === 4 && eqIdx === 0) matchedKey = 'fbe_l5_evaluative_essay_independence';
        }
        if (matchedKey && fixes[matchedKey]) {
          eq.model = fixes[matchedKey];
          eq.model_answer = fixes[matchedKey];
          changed = true;
        }
      });
    }
  });

  return changed;
}

// 1. Update data/*.json and public/data/*.json
['data', 'public/data'].forEach(subDir => {
  const dirPath = path.join(repoRoot, subDir);
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json') && !f.includes('package'));
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    try {
      const json = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      if (file === 'database.json') {
        let dbChanged = false;
        Object.keys(correctedModels).forEach(uKey => {
          if (json[uKey]) {
            if (updateUnitData(uKey, json[uKey])) dbChanged = true;
          }
        });
        if (dbChanged) {
          fs.writeFileSync(fullPath, JSON.stringify(json, null, 2), 'utf8');
          console.log(`Updated database file ${subDir}/${file}`);
        }
      } else {
        const uId = json.id || file.replace('.json', '');
        if (correctedModels[uId]) {
          if (updateUnitData(uId, json)) {
            fs.writeFileSync(fullPath, JSON.stringify(json, null, 2), 'utf8');
            console.log(`Updated unit file ${subDir}/${file}`);
          }
        }
      }
    } catch (e) {
      console.error(`Error updating ${subDir}/${file}:`, e.message);
    }
  });
});

// 2. Update root database.json
const rootDbPath = path.join(repoRoot, 'database.json');
if (fs.existsSync(rootDbPath)) {
  const json = JSON.parse(fs.readFileSync(rootDbPath, 'utf8'));
  let rootDbChanged = false;
  Object.keys(correctedModels).forEach(uKey => {
    if (json[uKey]) {
      if (updateUnitData(uKey, json[uKey])) rootDbChanged = true;
    }
  });
  if (rootDbChanged) {
    fs.writeFileSync(rootDbPath, JSON.stringify(json, null, 2), 'utf8');
    console.log(`Updated root database.json`);
  }
}

// 3. Update public/units/*/data.js and units/*/data.js
['units', 'public/units'].forEach(subDir => {
  const dirPath = path.join(repoRoot, subDir);
  if (!fs.existsSync(dirPath)) return;
  Object.keys(correctedModels).forEach(uKey => {
    const dataJsPath = path.join(dirPath, uKey, 'data.js');
    if (!fs.existsSync(dataJsPath)) return;
    try {
      const content = fs.readFileSync(dataJsPath, 'utf8');
      const match = content.match(/export\s+default\s+({[\s\S]+});?\s*$/);
      if (match) {
        const obj = JSON.parse(match[1]);
        if (updateUnitData(uKey, obj)) {
          fs.writeFileSync(dataJsPath, `export default ${JSON.stringify(obj, null, 2)};\n`, 'utf8');
          console.log(`Updated ${subDir}/${uKey}/data.js`);
        }
      }
    } catch (e) {
      console.error(`Error updating ${subDir}/${uKey}/data.js:`, e.message);
    }
  });
});

console.log('All model answers cured and synchronized!');

