const fs = require('fs');
const path = require('path');

function calibrateUnit(unitId, updateFn) {
  const p1 = path.resolve(__dirname, `../units/${unitId}/data.js`);
  const p2 = path.resolve(__dirname, `../public/units/${unitId}/data.js`);

  [p1, p2].forEach(fp => {
    if (!fs.existsSync(fp)) return;
    const data = require(fp).default;
    updateFn(data);
    fs.writeFileSync(fp, `export default ${JSON.stringify(data, null, 2)};\n`, 'utf8');
    console.log(`Calibrated ${unitId} in ${fp}`);
  });
}

// 1. australia
calibrateUnit('australia', (data) => {
  // L1: Terra nullius & British claim (12m)
  const l1Model = "A primary reason Britain claimed eastern Australia in 1770 was strategic imperial rivalry with France. Following Captain Cook’s voyage, the British Admiralty sought naval bases in the Pacific to protect valuable Asian trade routes and supply vital timber and flax for naval masts and sails.<br><br>Furthermore, the British declared Australia 'terra nullius' (nobody's land) because Indigenous Australians did not build European-style stone towns or cultivate fenced agricultural fields. By ignoring 65,000 years of Indigenous land management, British authorities justified seizing the continent without treaties, purchasing land, or recognizing Aboriginal ownership.";
  if (data.lessons[0].tasks?.[0]) data.lessons[0].tasks[0].model_answer = l1Model;
  if (data.lessons[0].exam_practice?.questions?.[0]) data.lessons[0].exam_practice.questions[0].model = l1Model;

  // L2: Prison hulks features (4m) & Sydney Cove utility (8m)
  if (data.lessons[1].exam_practice?.questions?.[0]) {
    data.lessons[1].exam_practice.questions[0].model = "One feature of prison hulks was extreme overcrowding and disease, where convicts slept in foul-smelling, unventilated wooden decks plagued by typhus and cholera. Another feature was harsh penal discipline, where prisoners were forced into hard labour dredging the Thames while kept in heavy leg irons.";
  }
  const l2Utility = "Source A is useful for an enquiry into the founding of Sydney Cove because it reveals the severe food shortages and poor soil confronting the First Fleet. Governor Arthur Phillip records how convicts lacked farming tools and struggled to clear dense eucalyptus bush, showing how close the settlement came to starvation.<br><br>Source B is useful because it shows the strict military discipline enforced by colonial authorities to prevent mutiny. Together, both sources are highly valuable for understanding the harsh physical struggles of convicts and officers between 1788 and 1792.";
  if (data.lessons[1].tasks?.[1]) data.lessons[1].tasks[1].model_answer = l2Utility;
  if (data.lessons[1].exam_practice?.questions?.[1]) data.lessons[1].exam_practice.questions[1].model = l2Utility;

  // L3: Frontier conflict narrative (8m) & Pemulwuy (8m)
  const l3Narrative = "Initially, relations between the Eora people and British settlers deteriorated in 1788 as colonists cleared land, felled trees, and cut off Aboriginal hunting grounds and fishing coves around Sydney.<br><br>Following this, widespread frontier violence erupted as Indigenous clans fiercely defended their homelands. From 1790, Bidjigal warrior Pemulwuy led a brilliant 12-year guerrilla campaign, ambushing settlers, burning crops, and raiding colonial outposts along the Hawkesbury River.<br><br>Finally, British troops mounted punitive military expeditions, using muskets to overwhelm Indigenous spears. After Pemulwuy was killed in 1802, British expansion continued inland, displacing Aboriginal nations through violent frontier conflict.";
  if (data.lessons[2].tasks?.[0]) data.lessons[2].tasks[0].model_answer = l3Narrative;
  if (data.lessons[2].exam_practice?.questions?.[0]) data.lessons[2].exam_practice.questions[0].model = l3Narrative;

  const l3Pemulwuy = "Pemulwuy’s guerrilla campaign was of immense importance because it shattered the myth of peaceful British settlement and demonstrated fierce, organised Aboriginal resistance. For twelve years, Pemulwuy united different Indigenous language groups, using knowledge of the bush to wage devastating economic warfare against colonial farms, inspiring ongoing Aboriginal resistance against colonisation.";
  if (data.lessons[2].exam_practice?.questions?.[1]) data.lessons[2].exam_practice.questions[1].model = l3Pemulwuy;

  // L4: Interpretations (4m each)
  if (data.lessons[3].exam_practice?.questions?.[0]) {
    data.lessons[3].exam_practice.questions[0].model = "Interpretation 1 views frontier conflict as small, sporadic clashes between isolated settlers and Indigenous groups. In contrast, Interpretation 2 argues that the Frontier Wars were sustained, large-scale military conflicts with thousands of casualties, amounting to a concerted war of conquest.";
  }
  if (data.lessons[3].exam_practice?.questions?.[1]) {
    data.lessons[3].exam_practice.questions[1].model = "The interpretations differ because the historians prioritize different sources. Interpretation 1 relies on official colonial government dispatches that minimized frontier violence, whereas Interpretation 2 examines regional police archives, settler diaries, and Indigenous oral histories.";
  }

  // L5: Eureka Stockade essay (12m)
  const l5Eureka = "On the one hand, the 1854 Eureka Stockade was a major turning point in Australian democracy. Frustrated by corrupt gold commissioners and expensive mining licence fees, Ballarat gold miners rebelled under the Southern Cross flag. Although British soldiers crushed the stockade, public outrage led the colonial government to abolish the licence fee and grant the vote and parliamentary representation to miners.<br><br>On the other hand, the massive 1850s Gold Rush itself was a far more transformative economic turning point. Gold tripled Australia’s population, attracted international immigrants, and funded modern railways, transforming Australia from a remote penal colony into a wealthy, modern society.";
  if (data.lessons[4].tasks?.[0]) data.lessons[4].tasks[0].model_answer = l5Eureka;
  if (data.lessons[4].exam_practice?.questions?.[0]) data.lessons[4].exam_practice.questions[0].model = l5Eureka;
});

// 2. the_shoah
calibrateUnit('the_shoah', (data) => {
  // L1: Anti-Jewish boycotts consequence (4m)
  if (data.lessons[0].tasks?.[1]) {
    data.lessons[0].tasks[1].model_answer = "One consequence of the April 1933 Nazi anti-Jewish boycott was the legal and social exclusion of German Jews from public life. Specifically, SA stormtroopers stood outside Jewish shops and doctors' surgeries with placards, deterring customers and signaling to the German public that the Nazi state was systematically isolating Jews from the economy.";
  }

  // L2: Kristallnacht narrative (8m)
  if (data.lessons[1].tasks?.[0]) {
    data.lessons[1].tasks[0].model_answer = "Initially, following the assassination of German diplomat Ernst vom Rath in Paris, Joseph Goebbels delivered an inflammatory speech on 9 November 1938 inciting antisemitic violence across Germany.<br><br>During the night, SA stormtroopers and SS men unleashed the 'Night of Broken Glass' (Kristallnacht). Over 1,000 synagogues were torched, thousands of Jewish businesses destroyed, and 91 Jews murdered, while police and fire brigades were ordered not to intervene.<br><br>Finally, the Nazi regime blamed Jews for the destruction, imposing a 1 billion Reichsmark collective fine on the Jewish community and sending 30,000 Jewish men to concentration camps like Dachau.";
  }

  // L3: Warsaw Ghetto utility (8m)
  if (data.lessons[2].tasks?.[0]) {
    data.lessons[2].tasks[0].model_answer = "Source A is useful because it records the extreme starvation, overcrowding, and typhus epidemics inside the Warsaw Ghetto, where over 400,000 Jews were trapped behind brick walls on starvation rations. Source B is useful because it provides evidence of Jewish spiritual resistance and underground education. Together, both sources are highly valuable for showing how ghetto inhabitants fought for physical and cultural survival.";
  }

  // L4: Wannsee Conference essay (12m)
  if (data.lessons[3].tasks?.[0]) {
    data.lessons[3].tasks[0].model_answer = "On the one hand, the January 1942 Wannsee Conference was a decisive turning point because it coordinated the bureaucratic logistics of the 'Final Solution'. Chaired by Reinhard Heydrich, top Nazi officials and civil servants agreed to systematically deport 11 million European Jews to industrial death camps in occupied Poland, using poison gas (Zyklon B) for mass extermination.<br><br>On the other hand, systematic mass murder had already begun in June 1941 following the invasion of the Soviet Union. Mobile killing squads (Einsatzgruppen) had already shot over one million Jewish men, women, and children. Therefore, Wannsee did not initiate mass murder, but transformed it into a continent-wide, factory-style industrial genocide.";
  }

  // L5: Camp resistance (8m)
  if (data.lessons[4].tasks?.[1]) {
    data.lessons[4].tasks[1].model_answer = "A primary reason prisoners resisted in extermination camps like Treblinka and Sobibor was the desperate realization that total extermination was imminent. When members of the Sonderkommando realized they were destined to be murdered to conceal Nazi crimes, they organized armed uprisings, blowing up crematoria and helping dozens escape to expose the death camps to the world.";
  }

  // L6: Liberation narrative (8m)
  if (data.lessons[5].tasks?.[0]) {
    data.lessons[5].tasks[0].model_answer = "Initially, Soviet troops liberated Majdanek in July 1944 and Auschwitz in January 1945, discovering gas chambers, mass graves, and mountains of victims' shoes and hair left behind by retreating SS guards.<br><br>Following this, British and American forces advancing into Germany liberated camps like Bergen-Belsen and Dachau in April 1945, finding thousands of unburied corpses and starving survivors dying of typhus.<br><br>Finally, Allied liberation provided undeniable photographic and film evidence of Nazi atrocities, which was used to prosecute Nazi war criminals at the 1945–46 Nuremberg Trials.";
  }

  // L7: Holocaust memory essay (12m)
  if (data.lessons[6].tasks?.[0]) {
    data.lessons[6].tasks[0].model_answer = "On the one hand, international Holocaust remembrance is vital because it honours the six million Jewish victims and counters dangerous Holocaust denial. Educational memorials, survivor testimonies, and Holocaust Memorial Day teach future generations about the perils of state-sponsored racism and prejudice.<br><br>On the other hand, memory must be matched by active prevention of modern genocide. Since 1945, the world has witnessed mass atrocities in Cambodia, Rwanda, and Srebrenica. Therefore, remembering the Shoah is profoundly important, but its ultimate value lies in educating society to challenge hatred and human rights abuses wherever they occur.";
  }
});

// 3. medieval_england
calibrateUnit('medieval_england', (data) => {
  // L1: Battle of Hastings (12m)
  if (data.lessons[0].tasks?.[0]) {
    data.lessons[0].tasks[0].model_answer = "A primary reason Duke William won the Battle of Hastings was his tactical brilliance and flexible army. Unlike Harold Godwinson's Saxon army, which consisted entirely of infantry fighting behind a static shield wall, William had heavily armoured cavalry and skilled archers. When the Saxon line held, William ordered 'feigned retreats', tricking inexperienced Saxon fyrd soldiers into breaking rank and pursuing down Senlac Hill, where Norman cavalry surrounded and slaughtered them.<br><br>Furthermore, King Harold's army was severely exhausted. Harold had marched 200 miles north to defeat the Vikings at Stamford Bridge, before rushing 250 miles south to meet William in under three weeks, leaving his men fatigued and missing vital reinforcements.";
  }

  // L2: Domesday features (4m) & consequence (4m)
  if (data.lessons[1].tasks?.[0]) {
    data.lessons[1].tasks[0].model_answer = "One feature of the Domesday Book (1086) was its comprehensive survey of wealth, recording every manor, woodland, mill, and animal across England. Another feature was its legal purpose, establishing William as the ultimate landholder to enforce feudal taxes and military knight service.";
  }
  if (data.lessons[1].tasks?.[1]) {
    data.lessons[1].tasks[1].model_answer = "One consequence of the Domesday survey was the total transfer of English land from Anglo-Saxon nobility to Norman barons. Specifically, by 1086, less than 5% of English land remained in Saxon hands, permanently cementing Norman feudal control and royal taxation across the realm.";
  }

  // L3: Magna Carta interpretations (8m)
  if (data.lessons[2].tasks?.[0]) {
    data.lessons[2].tasks[0].model_answer = "Interpretation 1 suggests that Magna Carta (1215) was a selfish feudal contract designed solely to protect the private privileges and wealth of rebel barons against King John. In contrast, Interpretation 2 argues that Magna Carta was a foundational constitutional turning point that established the enduring principle of the Rule of Law, declaring that even the monarch is subject to the law of the land.";
  }

  // L4: Black Death narrative (8m)
  if (data.lessons[3].tasks?.[0]) {
    data.lessons[3].tasks[0].model_answer = "Initially, the Black Death arrived in Dorset in the summer of 1348 from Genoese trading ships. Carried by fleas on black rats, bubonic and pneumonic plague spread rapidly along trade routes.<br><br>The epidemic devastated England within eighteen months. Lacking medical knowledge, people blamed miasma and divine anger, dying within days from agony and swollen buboes. Approximately one-third to one-half of the population perished.<br><br>Finally, the catastrophic loss of life triggered an acute labour shortage. Surviving peasants demanded higher wages and freedom from feudal bondage, permanently undermining the traditional manorial system.";
  }

  // L5: Peasants' Revolt 1381 essay (12m)
  if (data.lessons[4].tasks?.[0]) {
    data.lessons[4].tasks[0].model_answer = "On the one hand, the 1381 Peasants' Revolt was caused by anger over the third Poll Tax (1381), which levied a flat fee on everyone regardless of wealth. Furthermore, the 1351 Statute of Labourers had attempted to cap wages at pre-plague levels, frustrating serfs who knew their labour was valuable.<br><br>On the other hand, the rebellion was driven by radical ideological demands for human equality. Leaders like priest John Ball preached that God created all men equal ('When Adam delved and Eve span, who was then the gentleman?'). Therefore, while the unjust Poll Tax was the immediate spark, the rebellion was fundamentally fueled by long-term anger against the feudal system and serfdom.";
  }
});

// 4. industrialisation_and_empire
calibrateUnit('industrialisation_and_empire', (data) => {
  // L1: Henry Cort Funtley breakthrough (12m)
  const l1Model = "A primary reason Henry Cort achieved his breakthrough in wrought iron production at Funtley in 1784 was his innovative combination of the puddling furnace and grooved rollers. By stirring pig iron in a reverberatory furnace with iron oxide, Cort burned away impurities using coal instead of scarce charcoal, while grooved rollers squeezed out slag fifteen times faster than traditional hammering.<br><br>Furthermore, the Royal Navy provided huge commercial demand. Britain’s dockyards needed thousands of durable iron hoops, bolts, and anchors to maintain naval supremacy. Cort's ability to produce cheap, high-quality British iron freed the Admiralty from dependence on expensive Swedish and Russian imports.";
  if (data.lessons[0].tasks?.[0]) data.lessons[0].tasks[0].model_answer = l1Model;
  if (data.lessons[0].exam_practice?.questions?.[0]) data.lessons[0].exam_practice.questions[0].model = l1Model;

  // L2: Factory act features & consequence (4m)
  if (data.lessons[1].exam_practice?.questions?.[0]) {
    data.lessons[1].exam_practice.questions[0].model = "One feature of Victorian textile mill conditions was long, exhausting shifts of up to 14 hours in hot, deafening rooms. Another feature was dangerous unguarded machinery, where child scavengers crawled beneath looms, risking crushed limbs or scalpings.";
  }
  if (data.lessons[1].exam_practice?.questions?.[1]) {
    data.lessons[1].exam_practice.questions[1].model = "One consequence of the 1833 Factory Act was the appointment of factory inspectors to enforce the law. Specifically, children under nine were banned from working in textile mills, and employers were forced to provide two hours of daily schooling.";
  }

  // L3: Back-to-back housing & Great Stink (4m)
  if (data.lessons[2].exam_practice?.questions?.[0]) {
    data.lessons[2].exam_practice.questions[0].model = "One feature of back-to-back housing was extreme overcrowding and lack of ventilation, with houses sharing three walls. Another feature was poor sanitation, where dozens of families shared a single outdoor privy that contaminated drinking wells.";
  }
  if (data.lessons[2].exam_practice?.questions?.[1]) {
    data.lessons[2].exam_practice.questions[1].model = "One consequence of the 1858 Great Stink was Parliament funding London's massive sewer network. Specifically, MPs fled the foul smell of the Thames and granted £3 million to Joseph Bazalgette, who built 82 miles of underground intercepting sewers.";
  }

  // L4: Peterloo to Tolpuddle narrative (8m)
  const l4Narrative = "Initially, in August 1819, 60,000 peaceful protesters gathered at St Peter's Field in Manchester demanding parliamentary reform. Magistrates sent cavalry charging into the crowd, killing eighteen and injuring hundreds in the 'Peterloo Massacre'.<br><br>Following this, desperate agricultural labourers in southern England launched the 1830 Swing Riots, smashing threshing machines and burning ricks to protest starvation wages.<br><br>Finally, when six Dorset farm workers formed an agricultural trade union in 1834, the government prosecuted them as the 'Tolpuddle Martyrs' and transported them to Australia, triggering mass working-class protests that forced their pardon.";
  if (data.lessons[3].tasks?.[1]) data.lessons[3].tasks[1].model_answer = l4Narrative;
  if (data.lessons[3].exam_practice?.questions?.[1]) data.lessons[3].exam_practice.questions[1].model = l4Narrative;

  // L5: 1832 Reform Act essay (12m)
  const l5Reform = "On the one hand, fear of violent revolution was the primary motive for passing the 1832 Great Reform Act. Following the 1830 French Revolution and the rejection of the bill by the House of Lords, riots erupted in Bristol, Nottingham, and Derby. Radical groups organized the 'Days of May' bank run ('Stop the Duke, go for gold'), convincing Earl Grey that reform was necessary to prevent revolution.<br><br>On the other hand, the Whigs passed the Act to protect the aristocratic constitution. By abolishing 56 rotten boroughs and granting votes to the industrial middle class (£10 householders), the Whigs detached wealthy factory owners from working-class radicals, securing political stability.";
  if (data.lessons[4].tasks?.[0]) data.lessons[4].tasks[0].model_answer = l5Reform;
  if (data.lessons[4].exam_practice?.questions?.[0]) data.lessons[4].exam_practice.questions[0].model = l5Reform;
});

