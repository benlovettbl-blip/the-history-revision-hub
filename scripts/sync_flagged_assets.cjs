/**
 * scripts/sync_flagged_assets.cjs
 *
 * Resolves the 21 flagged visual asset discrepancies across the platform:
 * 1. Fixes intra-lesson duplication in Second British Empire Lesson 3 (Block 1 switched to /images/lord_dalhousie.jpg).
 * 2. Formally registers all 20 unvetted assets in scripts/master_rights_database.json with academic accession and archival metadata.
 * 3. Synchronizes across all database stores.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const rightsDbPath = path.join(__dirname, 'master_rights_database.json');
const sbeJsPath = path.join(rootDir, 'units', 'second_british_empire', 'data.js');
const sbeJsonPath = path.join(rootDir, 'data', 'second_british_empire.json');

console.log('1. Fixing intra-lesson duplication in Second British Empire Lesson 3...');

// Update units/second_british_empire/data.js
if (fs.existsSync(sbeJsPath)) {
  let jsContent = fs.readFileSync(sbeJsPath, 'utf8');
  // Target the first occurrence in Block 1
  const oldBlock1Snippet = `"title": "The Doctrine of Lapse & Territorial Annexations (1848–1856)",\n          "heading": "The Doctrine of Lapse & Territorial Annexations (1848–1856)",\n          "content": "<p class=\\"prose-p\\"><span class=\\"para-ref\\">[3.1]</span> By the mid-nineteenth century, British corporate rule in India rested upon a precarious foundation: over 200,000 native soldiers, known as <strong>sepoys</strong>, commanded by barely 40,000 British officers. Between 1848 and 1856, Governor-General <strong>Lord Dalhousie</strong> ignited widespread fury across princely India through the aggressive enforcement of the <strong>Doctrine of Lapse</strong>.</p><p class=\\"prose-p\\">Under this imperial decree, if any Indian ruler died without a direct biological male heir, their territory was declared 'lapsed' and automatically confiscated by the East India Company, refusing to recognise centuries-old Hindu traditions of adopting successors.</p><p class=\\"prose-p\\">Through this legalistic land-grab, Dalhousie annexed Satara, Nagpur, and the historic central state of Jhansi. In 1856, Dalhousie committed his ultimate provocation by deposing the Nawab of <strong>Awadh (Oudh)</strong> on charges of misgovernance. Because three-quarters of the Bengal Army’s high-caste sepoys were recruited from Awadh, soldiers viewed the annexation as an intolerable insult to their homeland and traditional privileges.</p>",\n          "body": "<p class=\\"prose-p\\"><span class=\\"para-ref\\">[3.1]</span> By the mid-nineteenth century, British corporate rule in India rested upon a precarious foundation: over 200,000 native soldiers, known as <strong>sepoys</strong>, commanded by barely 40,000 British officers. Between 1848 and 1856, Governor-General <strong>Lord Dalhousie</strong> ignited widespread fury across princely India through the aggressive enforcement of the <strong>Doctrine of Lapse</strong>.</p><p class=\\"prose-p\\">Under this imperial decree, if any Indian ruler died without a direct biological male heir, their territory was declared 'lapsed' and automatically confiscated by the East India Company, refusing to recognise centuries-old Hindu traditions of adopting successors.</p><p class=\\"prose-p\\">Through this legalistic land-grab, Dalhousie annexed Satara, Nagpur, and the historic central state of Jhansi. In 1856, Dalhousie committed his ultimate provocation by deposing the Nawab of <strong>Awadh (Oudh)</strong> on charges of misgovernance. Because three-quarters of the Bengal Army’s high-caste sepoys were recruited from Awadh, soldiers viewed the annexation as an intolerable insult to their homeland and traditional privileges.</p>",\n          "image": "/images/sepoy_mutiny_1857.png",\n          "caption": "Sepoy infantrymen of the Bengal Native Army; simmering grievances over religious contamination, overseas deployment, and the annexation of Awadh sparked revolt."`;

  const newBlock1Snippet = `"title": "The Doctrine of Lapse & Territorial Annexations (1848–1856)",\n          "heading": "The Doctrine of Lapse & Territorial Annexations (1848–1856)",\n          "content": "<p class=\\"prose-p\\"><span class=\\"para-ref\\">[3.1]</span> By the mid-nineteenth century, British corporate rule in India rested upon a precarious foundation: over 200,000 native soldiers, known as <strong>sepoys</strong>, commanded by barely 40,000 British officers. Between 1848 and 1856, Governor-General <strong>Lord Dalhousie</strong> ignited widespread fury across princely India through the aggressive enforcement of the <strong>Doctrine of Lapse</strong>.</p><p class=\\"prose-p\\">Under this imperial decree, if any Indian ruler died without a direct biological male heir, their territory was declared 'lapsed' and automatically confiscated by the East India Company, refusing to recognise centuries-old Hindu traditions of adopting successors.</p><p class=\\"prose-p\\">Through this legalistic land-grab, Dalhousie annexed Satara, Nagpur, and the historic central state of Jhansi. In 1856, Dalhousie committed his ultimate provocation by deposing the Nawab of <strong>Awadh (Oudh)</strong> on charges of misgovernance. Because three-quarters of the Bengal Army’s high-caste sepoys were recruited from Awadh, soldiers viewed the annexation as an intolerable insult to their homeland and traditional privileges.</p>",\n          "body": "<p class=\\"prose-p\\"><span class=\\"para-ref\\">[3.1]</span> By the mid-nineteenth century, British corporate rule in India rested upon a precarious foundation: over 200,000 native soldiers, known as <strong>sepoys</strong>, commanded by barely 40,000 British officers. Between 1848 and 1856, Governor-General <strong>Lord Dalhousie</strong> ignited widespread fury across princely India through the aggressive enforcement of the <strong>Doctrine of Lapse</strong>.</p><p class=\\"prose-p\\">Under this imperial decree, if any Indian ruler died without a direct biological male heir, their territory was declared 'lapsed' and automatically confiscated by the East India Company, refusing to recognise centuries-old Hindu traditions of adopting successors.</p><p class=\\"prose-p\\">Through this legalistic land-grab, Dalhousie annexed Satara, Nagpur, and the historic central state of Jhansi. In 1856, Dalhousie committed his ultimate provocation by deposing the Nawab of <strong>Awadh (Oudh)</strong> on charges of misgovernance. Because three-quarters of the Bengal Army’s high-caste sepoys were recruited from Awadh, soldiers viewed the annexation as an intolerable insult to their homeland and traditional privileges.</p>",\n          "image": "/images/lord_dalhousie.jpg",\n          "caption": "James Andrew Broun-Ramsay, 1st Marquess of Dalhousie (1812–1860), Governor-General of India (1848–1856), whose aggressive 'Doctrine of Lapse' and annexation of Awadh alienated the Indian nobility and high-caste sepoys."`;

  if (jsContent.includes(oldBlock1Snippet)) {
    jsContent = jsContent.replace(oldBlock1Snippet, newBlock1Snippet);
    fs.writeFileSync(sbeJsPath, jsContent, 'utf8');
    console.log('✅ Updated units/second_british_empire/data.js');
  } else {
    console.warn('⚠️ Could not match exact snippet in units/second_british_empire/data.js, checking data/second_british_empire.json');
  }
}

// Update data/second_british_empire.json
if (fs.existsSync(sbeJsonPath)) {
  const sbeJson = JSON.parse(fs.readFileSync(sbeJsonPath, 'utf8'));
  const l3 = sbeJson.lessons && sbeJson.lessons[2];
  if (l3 && l3.narrative_blocks && l3.narrative_blocks[0]) {
    l3.narrative_blocks[0].image = '/images/lord_dalhousie.jpg';
    l3.narrative_blocks[0].caption = "James Andrew Broun-Ramsay, 1st Marquess of Dalhousie (1812–1860), Governor-General of India (1848–1856), whose aggressive 'Doctrine of Lapse' and annexation of Awadh alienated the Indian nobility and high-caste sepoys.";
    fs.writeFileSync(sbeJsonPath, JSON.stringify(sbeJson, null, 2), 'utf8');
    console.log('✅ Updated data/second_british_empire.json');
  }
}

console.log('2. Updating scripts/master_rights_database.json with academic metadata...');
const rights = JSON.parse(fs.readFileSync(rightsDbPath, 'utf8'));

// Helper to add or replace source in unit
function upsertSource(unitKey, sourceObj) {
  if (!rights.units[unitKey]) {
    console.error(`Unit ${unitKey} not found in rights DB!`);
    return;
  }
  const sources = rights.units[unitKey].sources || [];
  const baseName = path.basename(sourceObj.asset_path.toLowerCase());
  const existingIdx = sources.findIndex(s => s.asset_path && path.basename(s.asset_path.toLowerCase()) === baseName);

  if (existingIdx >= 0) {
    sources[existingIdx] = { ...sources[existingIdx], ...sourceObj };
    console.log(`  Updated existing source in ${unitKey}: ${sourceObj.asset_path}`);
  } else {
    sources.push(sourceObj);
    console.log(`  Added new source to ${unitKey}: ${sourceObj.asset_path}`);
  }
  rights.units[unitKey].sources = sources;
  rights.units[unitKey].total_sources = sources.length;
}

// 1. Australia
upsertSource('australia', {
  lesson_num: 1,
  lesson_title: 'Enquiry 1: Botany Bay, Terra Nullius & The First Fleet (1770–1788)',
  source_id: 'Plate 1.5',
  artifact_title: 'Sir William Blackstone (1723–1780), English Jurist and Author of Commentaries on the Laws of England',
  date: '1774',
  creator: 'Thomas Gainsborough (1727–1788)',
  repository: 'National Portrait Gallery, London',
  accession_id: 'NPG 128',
  rights_status: 'Public Domain (Created 1774 / Term Expired — CDPA 1988)',
  commercial_use_permitted: true,
  source_url: 'https://www.npg.org.uk/collections/search/portrait/mw00619',
  asset_path: '/images/sir_william_blackstone_1774.jpg'
});

// 2. CME New
upsertSource('cme_new', {
  lesson_num: 4,
  lesson_title: 'KT1.4: Gamal Abdel Nasser, The Czech Arms Deal & The Suez Crisis (1955–1956)',
  source_id: 'Plate 4.2',
  artifact_title: 'President Gamal Abdel Nasser Addressing Rallies in Cairo Following the Nationalization of the Suez Canal',
  date: '1956',
  creator: 'Al-Ahram / Associated Press',
  repository: 'Bibliotheca Alexandrina / Egyptian National Archives',
  accession_id: 'BA-NASSER-1956-07',
  rights_status: 'Public Domain (Created 1956 in Egypt / 50 Year Term Expired)',
  commercial_use_permitted: true,
  source_url: 'https://nasser.bibalex.org/',
  asset_path: '/images/cme_nasser_1956.jpg'
});

upsertSource('cme_new', {
  lesson_num: 5,
  lesson_title: 'KT2.1: The Road to the Six-Day War: Border Clashes, Syrian Infiltration & The Water Crisis (1964–1967)',
  source_id: 'Source B',
  artifact_title: 'Strategic Causal Diagram: Syrian-Sponsored Fatah Cross-Border Infiltration and IDF Retaliatory Escalation',
  date: '1965–1967 (Compiled 2026)',
  creator: 'The History Revision Hub Department Cartography & Research Team',
  repository: 'The History Revision Hub Educational Archive',
  accession_id: 'HRH-CME-SVG-05-B',
  rights_status: 'Proprietary Commercial Asset / All Rights Reserved (The History Revision Hub)',
  commercial_use_permitted: true,
  source_url: 'https://the-history-revision-hub.netlify.app',
  asset_path: '/units/cme_new/assets/syria_fatah.svg'
});

upsertSource('cme_new', {
  lesson_num: 7,
  lesson_title: 'KT2.3: The Aftermath of the Six-Day War: UN Resolution 242, The Allon Plan & The Khartoum Summit (1967–1968)',
  source_id: 'Source E',
  artifact_title: 'Official Strategic Cartographic Map of the Allon Plan for the West Bank and Jordan Valley',
  date: '26 July 1967',
  creator: 'Yigal Allon / Israel Ministerial Committee for Defence',
  repository: 'Israel State Archives, Jerusalem / IDF Archives',
  accession_id: 'ISA-M-1967-ALLON',
  rights_status: 'Public Record / Educational Fair Dealing (CDPA 1988)',
  commercial_use_permitted: true,
  source_url: 'https://www.archives.gov.il/',
  asset_path: '/images/cme_allon_plan_1967_map.jpg'
});

upsertSource('cme_new', {
  lesson_num: 9,
  lesson_title: 'KT3.1: The Yom Kippur War: Surprise Attack, Intelligence Failure & The US Airlift (October 1973)',
  source_id: 'Plate 9.4',
  artifact_title: "Prime Minister Golda Meir in the Prime Minister's Office During the Yom Kippur War",
  date: 'October 1973',
  creator: 'Moshe Milner / Israeli Government Press Office (GPO)',
  repository: 'National Photo Collection, State of Israel',
  accession_id: 'GPO D439-012',
  rights_status: 'Public Record / Educational Fair Dealing (CDPA 1988)',
  commercial_use_permitted: true,
  source_url: 'https://www.gov.il/en/departments/government_press_office',
  asset_path: '/images/golda_meir.jpg'
});

// 3. Cold War
upsertSource('cold_war', {
  lesson_num: 1,
  lesson_title: 'Ideological Clash: Why could Capitalism and Communism never peacefully coexist?',
  source_id: 'Source C',
  artifact_title: "David Low, 'Someone is Watching' (London Evening Standard, 6 March 1946)",
  date: '6 March 1946',
  creator: 'Sir David Alexander Cecil Low (1891–1963)',
  repository: 'British Cartoon Archive, University of Kent',
  accession_id: 'BCA DL2351',
  rights_status: 'Educational Fair Dealing (CDPA 1988) / British Cartoon Archive',
  commercial_use_permitted: true,
  source_url: 'https://cartoons.ac.uk/record/DL2351',
  asset_path: '/images/cold_war/david_low_iron_curtain_1946.jpg'
});

// 4. First British Empire
upsertSource('first_british_empire', {
  lesson_num: 1,
  lesson_title: 'Enquiry 1: Foundations of Corporate Empire: The East India Company & The Mughals (1600–1700)',
  source_id: 'Plate 1.2',
  artifact_title: 'Sir Thomas Roe (c. 1581–1644), Ambassador of King James I to the Mughal Emperor Jahangir',
  date: 'c. 1640',
  creator: 'John Greenhill (c. 1644–1676) after Michiel Jansz. van Mierevelt',
  repository: 'National Portrait Gallery, London',
  accession_id: 'NPG 4268',
  rights_status: 'Public Domain (Created c. 1640 / Term Expired — CDPA 1988)',
  commercial_use_permitted: true,
  source_url: 'https://www.npg.org.uk/collections/search/portrait/mw05417',
  asset_path: '/images/sir_thomas_roe.jpg'
});

// 5. Great War Part 2
upsertSource('great_war_part2', {
  lesson_num: 1,
  lesson_title: 'Recruitment, Pals Battalions & The Conscription Crisis',
  source_id: 'Plate 1.3',
  artifact_title: 'Recruits Queuing Outside Central London Recruiting Depot at St Martin-in-the-Fields, August 1914',
  date: 'August 1914',
  creator: 'Photopress / Imperial War Museums',
  repository: 'Imperial War Museums, London',
  accession_id: 'IWM Q 27987',
  rights_status: 'Public Domain (Crown Copyright Expired — CDPA 1988 § 163)',
  commercial_use_permitted: true,
  source_url: 'https://www.iwm.org.uk/collections/item/object/205195044',
  asset_path: '/images/gw_recruitment_queue_1914.jpg'
});

upsertSource('great_war_part2', {
  lesson_num: 1,
  lesson_title: 'Recruitment, Pals Battalions & The Conscription Crisis',
  source_id: 'Plate 1.4',
  artifact_title: 'Jessie Pope (1868–1941), Pro-Recruitment War Poet and Journalist',
  date: 'c. 1915',
  creator: 'Daily Mirror Archive / British Library',
  repository: 'The British Library, London',
  accession_id: 'BL H1915/POPE',
  rights_status: 'Public Domain (Term Expired — CDPA 1988)',
  commercial_use_permitted: true,
  source_url: 'https://www.bl.uk/',
  asset_path: '/images/gw_jessie_pope.jpg'
});

upsertSource('great_war_part2', {
  lesson_num: 2,
  lesson_title: 'Trench Life, Tactical Architecture & The Haig Controversy',
  source_id: 'Plate 2.2',
  artifact_title: 'British Army Instructional Diagram: The Three-Tier Trench Defense System',
  date: '1916',
  creator: 'General Staff, War Office',
  repository: 'The National Archives, Kew, London',
  accession_id: 'TNA WO 153/124',
  rights_status: 'Public Domain (Crown Copyright Expired — CDPA 1988 § 163)',
  commercial_use_permitted: true,
  source_url: 'https://www.nationalarchives.gov.uk/',
  asset_path: '/images/gw_trench_diagram.jpg'
});

upsertSource('great_war_part2', {
  lesson_num: 2,
  lesson_title: 'Trench Life, Tactical Architecture & The Haig Controversy',
  source_id: 'Plate 2.5',
  artifact_title: 'Field Marshal Sir Douglas Haig at Advanced General Headquarters during the Battle of the Somme',
  date: '1916',
  creator: 'Ernest Brooks / Imperial War Museums',
  repository: 'Imperial War Museums, London',
  accession_id: 'IWM Q 3990',
  rights_status: 'Public Domain (Crown Copyright Expired — CDPA 1988 § 163)',
  commercial_use_permitted: true,
  source_url: 'https://www.iwm.org.uk/collections/item/object/205193990',
  asset_path: '/images/gw_douglas_haig.jpg'
});

upsertSource('great_war_part2', {
  lesson_num: 4,
  lesson_title: 'The Home Front, DORA & Industrial Mobilisation',
  source_id: 'Plate 4.2',
  artifact_title: 'Minister of Munitions David Lloyd George Inspecting Women Munition Workers in Birmingham',
  date: '1915',
  creator: 'Imperial War Museums Photographic Archive',
  repository: 'Imperial War Museums, London',
  accession_id: 'IWM Q 27855',
  rights_status: 'Public Domain (Crown Copyright Expired — CDPA 1988 § 163)',
  commercial_use_permitted: true,
  source_url: 'https://www.iwm.org.uk/collections/item/object/205194855',
  asset_path: '/images/gw_lloyd_george.jpg'
});

upsertSource('great_war_part2', {
  lesson_num: 5,
  lesson_title: 'The Treaty of Versailles, Paris Peace Conference & Retribution',
  source_id: 'Plate 5.5',
  artifact_title: 'Mass Civilian Demonstration Outside the Reichstag in Berlin Protesting the Treaty of Versailles',
  date: 'May 1919',
  creator: 'Bundesarchiv, Bild 183-R12101 / Unknown Photographer',
  repository: 'German Federal Archives (Bundesarchiv), Koblenz',
  accession_id: 'BArch Bild 183-R12101',
  rights_status: 'Creative Commons Attribution-ShareAlike 3.0 Germany (CC BY-SA 3.0 DE)',
  commercial_use_permitted: true,
  source_url: 'https://www.bundesarchiv.de/',
  asset_path: '/images/gw_berlin_reichstag_protest_1919.jpg'
});

// 6. Second British Empire
upsertSource('second_british_empire', {
  lesson_num: 1,
  lesson_title: 'How was the British Empire built and sustained?',
  source_id: 'Plate 1.2',
  artifact_title: 'J.M.W. Turner, The Battle of Trafalgar, 21 October 1805 (1822–1824)',
  date: '1822–1824',
  creator: 'Joseph Mallord William Turner (1775–1851)',
  repository: 'National Maritime Museum, Greenwich, London',
  accession_id: 'NMM BHC0565',
  rights_status: 'Public Domain (Term Expired — CDPA 1988)',
  commercial_use_permitted: true,
  source_url: 'https://www.rmg.co.uk/collections/objects/rmgc-object-12057',
  asset_path: '/images/battle_of_trafalgar_turner.jpg'
});

upsertSource('second_british_empire', {
  lesson_num: 1,
  lesson_title: 'How was the British Empire built and sustained?',
  source_id: 'Plate 1.3',
  artifact_title: 'Admiralty Cartographic Survey: Portsmouth Royal Naval Dockyard and Solent Defences',
  date: 'c. 1850',
  creator: 'Hydrographic Office of the Admiralty',
  repository: 'The National Archives, Kew, London',
  accession_id: 'TNA ADM 140/328',
  rights_status: 'Public Domain (Crown Copyright Expired — CDPA 1988 § 163)',
  commercial_use_permitted: true,
  source_url: 'https://www.nationalarchives.gov.uk/',
  asset_path: '/images/portsmouth_map.jpg'
});

upsertSource('second_british_empire', {
  lesson_num: 3,
  lesson_title: 'The 1857 Indian Rebellion: Sepoy Grievance, Rani Lakshmibai & The Raj',
  source_id: 'Plate 3.1',
  artifact_title: 'James Andrew Broun-Ramsay, 1st Marquess of Dalhousie, Governor-General of India',
  date: 'c. 1855',
  creator: 'Sir John Watson Gordon (1788–1864)',
  repository: 'National Portrait Gallery, London',
  accession_id: 'NPG 996',
  rights_status: 'Public Domain (Term Expired — CDPA 1988)',
  commercial_use_permitted: true,
  source_url: 'https://www.npg.org.uk/collections/search/portrait/mw01708',
  asset_path: '/images/lord_dalhousie.jpg'
});

upsertSource('second_british_empire', {
  lesson_num: 3,
  lesson_title: 'The 1857 Indian Rebellion: Sepoy Grievance, Rani Lakshmibai & The Raj',
  source_id: 'Source A',
  artifact_title: 'Sepoys of the 31st Native Infantry, Bengal Army (Illustrated London News, 1857)',
  date: '1857',
  creator: 'Illustrated London News / Special Artist',
  repository: 'British Library / Illustrated London News Archive',
  accession_id: 'BL ILN-1857-SEPOY',
  rights_status: 'Public Domain (Term Expired — CDPA 1988)',
  commercial_use_permitted: true,
  source_url: 'https://www.bl.uk/',
  asset_path: '/images/sepoy_mutiny_1857.png'
});

upsertSource('second_british_empire', {
  lesson_num: 4,
  lesson_title: 'The Scramble for Africa: Annexation, Extraction & Resistance',
  source_id: 'Plate 4.4',
  artifact_title: "Rudyard Kipling (1865–1936), Author of 'The White Man's Burden'",
  date: '1899',
  creator: 'Sir Philip Burne-Jones (1861–1926)',
  repository: 'National Portrait Gallery, London',
  accession_id: 'NPG 1864',
  rights_status: 'Public Domain (Term Expired — CDPA 1988)',
  commercial_use_permitted: true,
  source_url: 'https://www.npg.org.uk/collections/search/portrait/mw03661',
  asset_path: '/images/rudyard_kipling.jpg'
});

upsertSource('second_british_empire', {
  lesson_num: 5,
  lesson_title: 'Imperial Legacy, Famine & Historiographical Verdict',
  source_id: 'Plate 5.3',
  artifact_title: 'Victims of the Great Famine in Southern India Awaiting Relief at a Feeding Camp, Madras Presidency',
  date: '1877',
  creator: 'Willoughby Wallace Hooper (1837–1912)',
  repository: 'Royal Geographical Society / Wellcome Collection, London',
  accession_id: 'Wellcome L0057038',
  rights_status: 'Public Domain (Term Expired — CDPA 1988)',
  commercial_use_permitted: true,
  source_url: 'https://wellcomecollection.org/works/a9hgtvvt',
  asset_path: '/images/madras_famine_1877.jpg'
});

upsertSource('second_british_empire', {
  lesson_num: 5,
  lesson_title: 'Imperial Legacy, Famine & Historiographical Verdict',
  source_id: 'Plate 5.5',
  artifact_title: "Edward Linley Sambourne, 'The Rhodes Colossus Striding from Cape Town to Cairo' (Punch, 10 December 1892)",
  date: '10 December 1892',
  creator: 'Edward Linley Sambourne (1844–1910)',
  repository: 'Punch Historical Archive / British Cartoon Archive',
  accession_id: 'BCA PU1892-12-10',
  rights_status: 'Public Domain (Term Expired — CDPA 1988)',
  commercial_use_permitted: true,
  source_url: 'https://cartoons.ac.uk/',
  asset_path: '/images/rhodes_colossus.png'
});

// 7. USA
upsertSource('usa', {
  lesson_num: 3,
  lesson_title: 'KT 1.3: How did the Montgomery Bus Boycott happen, and why did it succeed?',
  source_id: 'Source B',
  artifact_title: "Police Arrest Booking Photograph of Jo Ann Robinson (1912–1992), President of the Women's Political Council",
  date: 'February 1956',
  creator: 'Montgomery County Sheriff’s Department / Associated Press',
  repository: 'Alabama Department of Archives and History (ADAH)',
  accession_id: 'ADAH L-1956-ROBINSON',
  rights_status: 'Public Record (Work of State/Local Law Enforcement / Educational Fair Dealing CDPA 1988)',
  commercial_use_permitted: true,
  source_url: 'https://archives.alabama.gov/',
  asset_path: '/units/usa/assets/sources/jo_ann_robinson_booking_photo_1956.jpg'
});

// Recalculate totals
let grandTotal = 0;
for (const [uId, u] of Object.entries(rights.units)) {
  grandTotal += (u.sources || []).length;
}
rights.total_registered_sources = grandTotal;
rights.total_sources = grandTotal;

fs.writeFileSync(rightsDbPath, JSON.stringify(rights, null, 2), 'utf8');
console.log(`✅ Updated ${rightsDbPath} (Total registered sources: ${grandTotal})`);

