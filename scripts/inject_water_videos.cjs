const fs = require('fs');
const path = require('path');

const waterVideosL4 = [
  {
    id: "5k8AnhNkN04",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=5k8AnhNkN04",
    title: "Bazalgette: Saviour of the Great Stink | London's Forgotten Hero",
    duration: "5 mins 13 secs",
    pathway: "Starter Hook",
    teacher_guidance: "Examines how the boiling summer of 1858 overwhelmed London with raw sewage stench, threatening Parliament and compelling politicians to fund civil engineering. Recommended Watch Window: 00:00–04:45 | Lesson Phase: Starter Hook & Problem Definition. Tone Alert: Engaging historical narrative examining how municipal stench forced political action.",
    viewing_task: "[01:10] Recall: What environmental and weather conditions in the summer of 1858 caused the 'Great Stink' of London?\n[02:40] Explain: Why did the stench of the River Thames directly motivate Parliament to pass legislation and grant funding to Joseph Bazalgette?\n[04:15] Challenge: How did prevailing belief in the miasma theory of disease actually accelerate sanitary reform, even though the scientific theory itself was wrong?",
    model_answer: "Recall: An unprecedented heatwave dried up the Thames, causing millions of gallons of raw human excrement and industrial waste to rot in the mudflats under baking sun.\nExplain: Parliament sat directly beside the Thames at Westminster; the stench was so overwhelming that curtains were soaked in chloride of lime and MPs were forced to flee committee rooms, directly compelling politicians to fund Bazalgette's underground sewer scheme.\nChallenge: Victorians believed bad smells (miasma) directly transmitted fatal diseases like cholera; therefore, eliminating foul odours by building underground sewers inadvertently eliminated the real water-borne pathogen (Vibrio cholerae)."
  },
  {
    id: "mQFSUfVBPw8",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=mQFSUfVBPw8",
    title: "The Story Of Sir Joseph Bazalgette & The Sewers Of London",
    duration: "8 mins 28 secs",
    pathway: "Core Enquiry",
    teacher_guidance: "Chronicles Joseph Bazalgette's master design: intercepting sewers utilizing gravity, Roman Portland cement, and pumping stations to divert waste downstream. Recommended Watch Window: 01:00–06:30 | Lesson Phase: Core Enquiry & Technological Innovation. Tone Alert: Technical and biographical overview highlighting precision engineering.",
    viewing_task: "[01:50] Recall: How many miles of underground brick intercepting sewers did Joseph Bazalgette construct across London?\n[03:45] Explain: What revolutionary material did Bazalgette insist on testing for every batch of brickwork, and why was this critical for sewer durability?\n[05:20] Challenge: Why did Bazalgette deliberately double the diameter of his sewer pipes beyond what London's population required in 1865, and what does this reveal about Victorian engineering foresight?",
    model_answer: "Recall: 82 miles of main underground intercepting sewers connected to over 1,100 miles of street sewers.\nExplain: Portland cement; Bazalgette subjected every delivery to rigorous tensile strength tests, ensuring the mortar could resist acidic sewer effluent and water pressure for centuries.\nChallenge: Bazalgette foresaw rapid urban expansion and remarked that they were building only once, so it must anticipate future generations; his foresight meant London's sewer system continues to serve over 9 million residents today."
  },
  {
    id: "nJ4Mr2oMuec",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=nJ4Mr2oMuec",
    title: "318 Million Bricks, No Machines: How They Built London's Sewers (1858)",
    duration: "10 mins 15 secs",
    pathway: "Primary Evidence",
    teacher_guidance: "Explores the harsh manual labour of Victorian navvies digging subterranean tunnels by hand through quicksand and foul clay beneath London. Recommended Watch Window: 01:15–07:00 | Lesson Phase: Working-Class Experience & Labour History. Tone Alert: Vivid focus on manual hardship, safety hazards, and underground architecture.",
    viewing_task: "[01:45] Recall: What tools did Victorian labourers ('navvies') use to excavate underground tunnels through urban clay and gravel?\n[04:00] Explain: What physical dangers and toxic hazards did workmen encounter while digging subterranean sewers beneath gas lines and houses?\n[06:10] Challenge: How did Bazalgette's Thames Embankment project simultaneously solve sewage transport, reclaim valuable riverfront land, and support underground railways?",
    model_answer: "Recall: Hand picks, shovels, wheelbarrows, and wooden shuttering frames.\nExplain: Explosive coal-gas pockets, sudden river wall collapses, asphyxiating hydrogen sulfide sewer gas, and cave-ins of poorly supported urban buildings overhead.\nChallenge: The Victoria and Albert Embankments reclaimed 37 acres of river mud, encasing low-level interceptor sewers inside granite river walls while building wide modern roadways and underground tracks for the District line above them."
  },
  {
    id: "kdJSIxC5LF0",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=kdJSIxC5LF0",
    title: "Bazalgette's Sewers: The Forgotten Tunnels That Built London",
    duration: "28 mins 16 secs",
    pathway: "Documentary Depth",
    teacher_guidance: "Comprehensive architectural and sanitary exploration of London's Victorian wastewater network and the Abbey Mills / Crossness cathedral pumping stations. Recommended Watch Window: 04:00–12:30 | Lesson Phase: High-Attainer Stretch & Industrial Archaeology. Tone Alert: Architectural documentary celebrating Victorian civil engineering.",
    viewing_task: "[05:10] Recall: What ornate nickname was given to the Crossness and Abbey Mills beam engine pumping stations?\n[08:30] Explain: How did giant steam-powered beam engines lift millions of gallons of sewage up to river discharge levels during high tide?\n[11:45] Challenge: To what extent did Bazalgette's sewer network permanently conquer cholera in London before doctors fully understood bacterial contagion?",
    model_answer: "Recall: 'Cathedrals of Sewage' due to their magnificent Italianate and Byzantine ironwork and brass architecture.\nExplain: Low-level interceptors brought sewage deep underground; immense steam-driven beam pumps raised the liquid into vast covered reservoirs to release on the ebb tide downriver at Erith and Beckton.\nChallenge: When cholera struck London again in 1866, the only area with high deaths was East London, which was not yet linked to Bazalgette's system; areas connected experienced virtually zero deaths, demonstrating that isolating waste from drinking water eradicated cholera empirically."
  }
];

const waterVideosL5 = [
  {
    id: "lNjrAXGRda4",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=lNjrAXGRda4",
    title: "John Snow and the 1854 Broad Street Cholera Outbreak | Harvard Online",
    duration: "8 mins 01 secs",
    pathway: "Starter Hook",
    teacher_guidance: "Academic breakdown from Harvard epidemiology tracing how Dr John Snow investigated the horrific Soho cholera epidemic in September 1854. Recommended Watch Window: 00:00–05:00 | Lesson Phase: Starter Hook & Scientific Method. Tone Alert: Objective epidemiological investigation demonstrating empirical methodology.",
    viewing_task: "[01:15] Recall: In what Soho neighbourhood and year did Dr John Snow carry out his famous cholera investigation?\n[02:40] Explain: How did Snow's hypothesis that cholera was a gastrointestinal infection contradict orthodox medical belief in airborne miasma?\n[04:20] Challenge: Why was the local Board of Guardians initially skeptical of Snow's recommendation to remove the Broad Street pump handle?",
    model_answer: "Recall: Broad Street, Soho, London, in September 1854.\nExplain: Miasma theory asserted that airborne poisons caused disease via respiratory inhalations; Snow noted cholera attacked the bowels with violent diarrhea and vomiting, deducing the poison entered the body through ingestion of contaminated water.\nChallenge: Officials were wedded to miasma doctrine and believed water was clean because it looked clear; removing the pump handle also seemed too simple a remedy for a catastrophic epidemic."
  },
  {
    id: "VJ86D_DtyWg",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=VJ86D_DtyWg",
    title: "The 1850s Map That Changed How We Fight Outbreaks | Vox Ghost Map",
    duration: "6 mins 56 secs",
    pathway: "Core Enquiry",
    teacher_guidance: "Visual journalism exploring how John Snow created his landmark spot map connecting household cholera deaths to the Broad Street water pump. Recommended Watch Window: 00:30–05:45 • Lesson Phase: Disciplinary Spatial Analysis & Data Visualization. Tone Alert: Dynamic visual analysis connecting 19th-century cartography to modern contact tracing.",
    viewing_task: "[01:20] Recall: What visual symbol did John Snow draw on his street map to represent each cholera death in a household?\n[02:50] Explain: How did Snow explain the two critical statistical anomalies: the nearby workhouse with few deaths and the Broad Street brewery with zero deaths?\n[04:30] Challenge: How did John Snow's spot map invent the modern medical discipline of spatial epidemiology?",
    model_answer: "Recall: Thick black bar lines stacked outside each street address.\nExplain: The Poland Street Workhouse had its own private well so inmates drank untainted water; the brewery workers drank free malt liquor (beer) brewed from boiled water, protecting them completely from pump contamination.\nChallenge: Snow proved that tracking the geographical distribution of disease cases relative to environmental factors could pinpoint the exact causal mechanism of an epidemic before a pathogen was visible under a microscope."
  },
  {
    id: "TLpzHHbFrHY",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=TLpzHHbFrHY",
    title: "England: The Broad Street Pump - You Know Nothing, John Snow | Extra History",
    duration: "7 mins 33 secs",
    pathway: "Primary Archive",
    teacher_guidance: "Vivid animated history of Snow's door-to-door detective work and Reverend Henry Whitehead's discovery of the infant index case at 40 Broad Street. Recommended Watch Window: 01:00–06:15 • Lesson Phase: Historical Detective Work & Collaborative Investigation. Tone Alert: Highly engaging narrative focusing on archival sleuthing.",
    viewing_task: "[01:40] Recall: How quickly could a healthy adult contract cholera and die of severe dehydration during the 1854 Soho outbreak?\n[03:30] Explain: How did local curate Reverend Henry Whitehead initially attempt to disprove Snow's theory, only to uncover the crucial proof?\n[05:15] Challenge: What was discovered when the ground around the Broad Street well was excavated: where had the contamination originated?",
    model_answer: "Recall: Within 12 to 24 hours of first symptoms.\nExplain: Whitehead believed Snow was defaming God's clean water and interviewed parishioners to prove him wrong, but discovered that baby Lewis had contracted cholera first and his mother had washed dirty diapers into a leaking cesspool.\nChallenge: Excavation revealed that the cracked brick cesspool of 40 Broad Street was only three feet away from the well pump; sewage had been percolating directly into the drinking water aquifer."
  },
  {
    id: "XoS68K916eo",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=XoS68K916eo",
    title: "Government Action & The Public Health Act 1875 | GCSE History",
    duration: "3 mins 23 secs",
    pathway: "Documentary Depth",
    teacher_guidance: "Clear synthesis examining the transition from permissive legislation (1848) to mandatory statutory intervention (1875). Recommended Watch Window: 00:00–03:20 • Lesson Phase: Statutory Synthesis & Laissez-Faire Shift. Tone Alert: Focused exam syllabus review of state intervention.",
    viewing_task: "[00:45] Recall: What was the defining difference between the 1848 Public Health Act (permissive) and the 1875 Public Health Act (compulsory)?\n[01:40] Explain: What mandatory duties were local town councils legally required to fulfill under the terms of the 1875 Act?\n[02:45] Challenge: Why did the British government abandon its long-standing ideology of 'laissez-faire' (leave alone) by the 1870s?",
    model_answer: "Recall: The 1848 Act gave councils permission to set up health boards if they chose; the 1875 Act made public health measures legally compulsory nationwide.\nExplain: Councils had to appoint medical officers of health, provide clean water, collect refuse, inspect abattoirs, pave and light streets, and regulate sewage disposal.\nChallenge: The extension of the vote to urban working-class men in the 1867 Reform Act forced political parties to appeal to working voters by promising social reform, combined with Pasteur's scientific proof of Germ Theory in 1861."
  }
];

const waterVideosL6 = [
  {
    id: "kl8SoV8A7RI",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=kl8SoV8A7RI",
    title: "GCSE History: Who was Edwin Chadwick & The 1842 Sanitary Report?",
    duration: "6 mins 34 secs",
    pathway: "Starter Hook",
    teacher_guidance: "Explores Edwin Chadwick's pioneering 1842 Report on the Sanitary Condition of the Labouring Population and his economic argument for public health. Recommended Watch Window: 00:30–05:15 • Lesson Phase: Masterclass Starter & Economic Justification. Tone Alert: Clear analytical study connecting public health to national economic productivity.",
    viewing_task: "[01:10] Recall: What landmark government investigation did Edwin Chadwick publish in 1842, and what shocking life expectancy statistics did it reveal?\n[02:45] Explain: How did Chadwick convince conservative politicians that investing tax revenue in clean water was cheaper than paying poor relief to sick widows and orphans?\n[04:20] Challenge: Why was Edwin Chadwick personally resented by ratepayers and local councils, leading to his dismissal from the Board of Health in 1854?",
    model_answer: "Recall: Report on the Sanitary Condition of the Labouring Population; in industrial cities like Liverpool and Manchester, working-class life expectancy was under 19 years.\nExplain: Chadwick argued sickness was the primary cause of poverty and economic dependency; providing clean water and sewers would prevent illness, reduce pauperism, and slash poor-rate taxes.\nChallenge: Chadwick was arrogant and authoritarian, forcing local councils to adopt centralized government regulations; middle-class ratepayers resented increased taxation, branding health boards as tyrannical interference with private property."
  },
  {
    id: "GawMwNu90nI",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=GawMwNu90nI",
    title: "Edwin Chadwick: Victorian Sanitation Reform & The End of Laissez-Faire",
    duration: "6 mins 09 secs",
    pathway: "Core Enquiry",
    teacher_guidance: "Deconstructs the philosophical conflict between Victorian laissez-faire individualism and collectivist sanitary intervention. Recommended Watch Window: 00:45–05:00 • Lesson Phase: Political Ideology & Historical Debates. Tone Alert: Disciplinary focus on political ideology and social legislation.",
    viewing_task: "[01:20] Recall: What French economic phrase described the Victorian belief that governments should not interfere in private businesses or citizens' lives?\n[03:00] Explain: What role did recurring epidemics of Asiatic cholera (1831, 1848, 1853, 1866) play in weakening public resistance to state health regulations?\n[04:30] Challenge: How did the 1875 Public Health Act mark the definitive constitutional death of laissez-faire in Victorian domestic governance?",
    model_answer: "Recall: 'Laissez-faire' ('leave alone' or 'let it be').\nExplain: Unlike endemic diseases that plagued only slums, cholera attacked affluent wealthy districts and killed within hours; sheer terror created overwhelming public pressure for sanitary legislation that bypassed local opposition.\nChallenge: The 1875 Act established the legal principle that protecting citizens' physical lives superseded private property rights, making government intervention in housing, water, and sanitation a permanent state duty."
  },
  {
    id: "ZzhVLS-pXFM",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=ZzhVLS-pXFM",
    title: "GCSE History Rapid Revision: 19th Century Public Health Revolution",
    duration: "16 mins 35 secs",
    pathway: "Enquiry Depth",
    teacher_guidance: "High-density synoptic overview connecting Chadwick, Snow, Pasteur, Bazalgette, and Disraeli's reforms into an exam-ready causal narrative. Recommended Watch Window: 00:00–08:30 • Lesson Phase: Revision Synthesis & Assessment Prep. Tone Alert: Comprehensive GCSE examiner-led structural breakdown.",
    viewing_task: "[02:15] Recall: Which four key factors drove public health progress between 1840 and 1875: Individuals, Science/Tech, Government, or Public Pressure?\n[05:40] Explain: How did Louis Pasteur's 1861 Germ Theory finally silence opponents of sewer spending by providing irrefutable microscopic proof?\n[07:50] Challenge: In an assessment essay, which individual made the greatest contribution to British water and sanitation: Chadwick, Snow, or Bazalgette? Justify your choice.",
    model_answer: "Recall: A combination of all four: key individuals (Chadwick, Snow, Bazalgette), science/technology (microscopy, Germ Theory, Portland cement), government legislation (1875 Act), and public pressure (cholera terror, working-class franchise).\nExplain: Until 1861, ratepayers argued spending millions on sewers was wasted because disease came from air; Germ Theory proved microbes breed in filth and contaminated liquids, proving that water purification was a biological necessity.\nChallenge: An argument can be made for Bazalgette because his physical infrastructure eradicated cholera in practice for millions, or for Snow because his scientific proof altered human understanding, or for Chadwick because his reports initiated modern public health legislation."
  },
  {
    id: "a4pKq1-zcCo",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=a4pKq1-zcCo",
    title: "British History Documentaries: 19th Century Public Health & Urban Slums",
    duration: "44 mins 01 secs",
    pathway: "Documentary Depth",
    teacher_guidance: "In-depth documentary exploring life, death, and municipal sanitation in Britain's industrial cities during Queen Victoria's reign. Recommended Watch Window: 10:00–22:00 • Lesson Phase: High-Attainer Stretch & Living Conditions. Tone Alert: Immersive historical documentary with archival footage and social history analysis.",
    viewing_task: "[11:30] Recall: How did industrial back-to-back housing and shared courtyard privy pits contaminate household water pumps in 19th-century slums?\n[16:00] Explain: Why did private water companies often provide tap water for only two hours a day in poor urban districts?\n[20:15] Challenge: Evaluate how municipal socialism (councils taking over water, gas, and sewers) transformed British cities from cesspools into models of public hygiene by 1900.",
    model_answer: "Recall: Privy cesspools were unlined and dug directly into soil only yards from shallow water wells; sewage soaked through the earth into drinking aquifers.\nExplain: Private water companies operated for shareholder profit rather than civic welfare; poor residents could not afford metered supply, so water was rationed to intermittent communal standpipes.\nChallenge: Led by cities like Birmingham under Joseph Chamberlain, municipalities bought out private water suppliers, declaring clean water a public right rather than a commercial commodity, which cut urban death rates in half by the end of the century."
  }
];

function stringifyVideos(arr) {
  return '      video: ' + JSON.stringify(arr, null, 8).replace(/^/gm, '      ').trim() + ',\n';
}

function processFile(filePath) {
  let text = fs.readFileSync(filePath, 'utf8');

  // Insert L4 video right before L4 sources: [
  // Find id: 'lesson_4' and then its sources: [
  const l4Pos = text.indexOf("id: 'lesson_4'");
  if (l4Pos === -1) throw new Error('Could not find lesson_4');
  const l4SourcesPos = text.indexOf("sources: [", l4Pos);
  if (l4SourcesPos === -1) throw new Error('Could not find sources for lesson_4');

  text = text.slice(0, l4SourcesPos) + stringifyVideos(waterVideosL4) + text.slice(l4SourcesPos);

  // Now find L5
  const l5Pos = text.indexOf("id: 'lesson_5'");
  if (l5Pos === -1) throw new Error('Could not find lesson_5');
  const l5SourcesPos = text.indexOf("sources: [", l5Pos);
  if (l5SourcesPos === -1) throw new Error('Could not find sources for lesson_5');

  text = text.slice(0, l5SourcesPos) + stringifyVideos(waterVideosL5) + text.slice(l5SourcesPos);

  // Now find L6
  const l6Pos = text.indexOf("id: 'lesson_6'");
  if (l6Pos === -1) throw new Error('Could not find lesson_6');
  const l6SourcesPos = text.indexOf("sources: [", l6Pos);
  if (l6SourcesPos === -1) throw new Error('Could not find sources for lesson_6');

  text = text.slice(0, l6SourcesPos) + stringifyVideos(waterVideosL6) + text.slice(l6SourcesPos);

  fs.writeFileSync(filePath, text, 'utf8');
  console.log('Successfully injected videos into:', filePath);
}

processFile(path.join(__dirname, '..', 'units', 'water_and_sanitation', 'data.js'));
processFile(path.join(__dirname, '..', 'public', 'units', 'water_and_sanitation', 'data.js'));
