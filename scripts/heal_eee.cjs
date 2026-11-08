const fs = require('fs');
const path = require('path');

const eeeClues = {
  "Factional Balance at Court": "Elizabeth carefully balanced rival factions on the Privy Council—such as William Cecil and Robert Dudley—to prevent any single courtier from dominating policy.",
  "Papal Rejection of Anne Boleyn": "The Roman Catholic Church's refusal to annul Henry VIII's marriage to Catherine of Aragon, leaving Catholic Europe regarding Elizabeth as an illegitimate child of Anne Boleyn.",
  "1536 Succession Act Bar": "The second succession act passed by Henry VIII that formally declared both Mary and Elizabeth illegitimate following Anne Boleyn's execution.",
  "Pressure to Produce Protestant Heir": "Urgent appeals from Parliament and the Privy Council imploring the unmarried Queen to marry and secure the Protestant succession against Mary Queen of Scots.",
  "Radical Returning Marian Exiles": "Hundreds of zealous English Protestants who had fled Mary I's burnings to Geneva and Zurich, returning in 1558 demanding a radically purified Calvinist Church.",
  "Marian Bishops in Lords": "The conservative Catholic bishops appointed by Mary I who held twenty-six seats in the House of Lords and fiercely resisted Elizabeth's Protestant religious legislation.",
  "All Marian Bishops Deprived": "The dismissal and house arrest of all but one Catholic bishop in 1559 for refusing to take the Oath of Supremacy recognizing Elizabeth as Supreme Governor.",
  "One-Shilling Recusancy Fine": "The financial penalty of twelve pence (roughly a week's wage for a laborer) imposed under the 1559 Act of Uniformity for failing to attend Sunday church.",
  "Fifty-Seven Royal Directives": "The comprehensive Royal Injunctions issued by Elizabeth in 1559 regulating clergy conduct, preaching licenses, church furnishings, and Bible ownership in English.",
  "Four Hundred Clergy Resignations": "The estimated four hundred Catholic parish priests and university fellows who chose to resign their livings rather than swear the 1559 Oath of Supremacy.",
  "Demand to Abolish Holy Days": "Puritan attempts in the 1563 Convocation to eliminate saints' feast days, organ music, and kneeling at communion as remnants of Catholic 'papistry'.",
  "Threat to Royal Prerogative": "Elizabeth's fierce defense of her monarchical authority, forbidding Parliament and Puritans from debating church settlement reforms without royal permission.",
  "Compulsory Clergy Surplices": "The requirement in the 1566 Book of Advertisements that all ministers wear white surplices during services, sparking thirty-seven London clergy dismissals.",
  "French Wars of Religion (1562)": "The outbreak of brutal civil warfare between French Catholics and Huguenot Protestants that temporarily prevented France from invading Protestant England.",
  "10,000 Spanish Troops in Netherlands": "The elite Spanish Army of Flanders dispatched under the Duke of Alba in 1567 to crush Dutch Protestant rebels directly across the English Channel.",
  "Council of Troubles Brutality": "The ruthless military tribunal established by the Duke of Alba that executed thousands of suspected Dutch rebels and heretics, nicknamed the 'Council of Blood'.",
  "£85,000 Italian Bullion Storm Shelter": "Four Genoese ships carrying 400,000 florins intended to pay Alba's Spanish troops seeking shelter from privateers in Plymouth and Southampton in 1568.",
  "Queen Claims Italian Bank Loan": "Elizabeth's audacious legal manoeuvre impounding the Genoese bullion, arguing that since the gold belonged to Italian bankers and not Spain, she would borrow it herself.",
  "Alba Imposes English Trade Embargo": "The retaliatory trade sanctions imposed by the Duke of Alba seizing English merchant ships in Antwerp, severely damaging London's cloth export market.",
  "Suspicious Murder of Mary’s Husband": "The mysterious explosion at Kirk o' Field in 1567 that killed Lord Darnley, followed by Mary Queen of Scots marrying the chief suspect, the Earl of Bothwell.",
  "Anointed Monarch Under House Arrest": "The unprecedented diplomatic and legal dilemma of holding a crowned, divinely anointed foreign queen under nineteen years of captivity in English castles.",
  "Refusal of Direct Cross-Examination": "The York and Westminster inquiry procedures where Mary was forbidden from appearing in person or cross-examining Scottish regents presenting the Casket Letters.",
  "Four Hundred and Fifty Executions": "The brutal royal vengeance ordered by Elizabeth following the failed 1569 Revolt of the Northern Earls, hanging hundreds of common rebels in village squares.",
  "Philip II Provides 200,000 Ducats": "The substantial Spanish funding promised through banker Roberto di Ridolfi to finance a 10,000-man invasion of England during the 1571 Ridolfi Plot.",
  "Phelippes Decodes Gallows Cipher": "Cryptographer Thomas Phelippes cracking the coded correspondence between Mary Queen of Scots and Anthony Babington, adding a gallows symbol to the intercepted letters.",
  "Explicit Approval of Regicide": "Mary Queen of Scots' fatal letter of 17 July 1586 explicitly authorizing the assassination of Elizabeth, providing concrete legal treason evidence.",
  "Divine Right Monarchical Martyrdom": "Mary's theatrical performance on the Fotheringhay execution scaffold in February 1587, dressing in Catholic martyr's crimson and clutching an ivory crucifix.",
  "Antwerp Deep-Water Ports Threat": "English fears that Spanish control of the Scheldt estuary would provide Philip II with a forward launchpad for a seaborne invasion fleet against London.",
  "William of Orange Protestant Rebellion": "The leader of the Dutch Revolt who united northern provinces against Spanish tyranny until his assassination by a Catholic fanatic in 1584.",
  "Nombre de Dios Mule Train Ambush": "Francis Drake's daring 1572 raid in Panama capturing fifteen tons of Spanish silver, establishing his reputation as 'El Draque'.",
  "Queen Licences Legal Piracy": "Elizabeth secretly investing in privateering expeditions and pocketing shares of captured Spanish treasure while maintaining official diplomatic deniability.",
  "Uncharted Pacific Raids on Peru": "Drake's audacious circumnavigation voyage aboard the Golden Hind (1577–80), looting undefended Spanish galleons along the Pacific coast of South America.",
  "Philip II Inherits Portuguese Crown": "The 1580 succession uniting the Portuguese Empire with Spain, giving Philip II control over Lisbon's deep-water port and large Atlantic ocean-going galleons.",
  "French Catholic Guise League Accord": "The secret Treaty of Joinville (1584) between Philip II and the French Catholic League to eliminate French Protestantism and isolate England.",
  "7,400 English Troops under Dudley": "The army sent under the Earl of Leicester under the 1585 Treaty of Nonsuch, marking England's formal military entry into the Dutch Revolt against Spain.",
  "Governor-General Title Angers Elizabeth": "Robert Dudley accepting the supreme title of Governor-General of the United Provinces, furious that he implied Elizabeth was claiming sovereignty over the Netherlands.",
  "Underfunded & Deserting English Troops": "The desperate plight of English soldiers in the Low Countries, unpaid by a parsimonious queen and dying of disease and starvation in winter camps.",
  "Dutch Council of State Distrust": "Bitter friction between English commanders and wealthy Dutch regents over military strategy, taxation, and Dudley's unilateral political appointments.",
  "Postpones Armada by Twelve Months": "Francis Drake's 'Singeing of the King of Spain's Beard' in Cadiz harbor (1587), destroying thirty-seven Spanish ships and thousands of seasoned barrel staves.",
  "Seven-Mile Crescent Defensive Line": "The tightly disciplined defensive formation maintained by the 130-ship Spanish Armada sailing up the English Channel, protecting its transport vessels.",
  "Eight Pitch-Soaked Vessels at Midnight": "The fireships packed with gunpowder and pitch launched by the English fleet into Calais harbour on 7 August 1588, scattering the panicked Spanish fleet.",
  "Shattered Crescent Never Reforms": "The loss of formation after the fireship attack that left individual Spanish galleons isolated and exposed to close-range English broadsides at Gravelines.",
  "Rapid-Fire Broadside Gunnery Close Range": "English culverin naval guns mounted on nimble race-built galleons capable of firing repeated iron shot while staying out of Spanish grappling range.",
  "Missing Anchors on Scottish & Irish Reefs": "The fatal decision of Armada captains to cut their anchor cables at Calais, leaving ships unable to moor off rocky Scottish and Irish coasts in Atlantic storms.",
  "Only Sixty-Seven Battered Ships Return": "The catastrophic toll of the Armada campaign, where nearly half of Philip II's fleet was wrecked by storms and starvation on the return journey.",
  "Social Mobility for Middling Sons": "The rising social status of yeoman farmers and merchants whose educated sons attended grammar schools and entered legal and administrative careers.",
  "Oxford & Cambridge College Expansions": "The rapid growth of Elizabethan university colleges providing theological training for Anglican clergy and education for gentry administrators.",
  "Inns of Court London Legal Training": "The prestigious London legal institutions (Gray's Inn, Lincoln's Inn, Temple) where wealthy gentry sons completed their gentlemanly education.",
  "Universal Paris Garden Bear-Baiting": "Popular mass entertainment in Southwark amphitheaters where audiences from all social classes gathered to watch dogs bait chained bears and bulls.",
  "Population Surges from 3m to Over 4m": "The dramatic 35 percent demographic explosion during Elizabeth's reign that triggered massive food inflation, land shortages, and urban vagrancy.",
  "Falling Real Wages for Farm Labourers": "Severe economic hardship caused by bad harvests, debased coinage, and surplus agricultural labor driving down purchasing power across England.",
  "Eviction of Strip-Farming Tenant Cottagers": "The conversion of communal arable open fields into enclosed sheep pastures, displacing peasant families and accelerating rural poverty.",
  "Harman’s Caveat for Common Cursitors Book": "Thomas Harman's sensational 1567 expose categorizing vagabonds into fraudulent archetypes like 'counterfeit cranks' and 'clapper-dudgeons'.",
  "Dread of Social Unrest & Treasonous Riot": "The deep ruling-class fear that desperate wandering beggars would band together to spark riots, disorder, and rebellions against the Crown.",
  "£140,000 Spanish Bullion Cargo Returns": "The vast wealth brought back by Francis Drake aboard the Golden Hind in 1580, paying off England's national debt and enriching Elizabeth's treasury.",
  "Hakluyt’s Discourse on Western Planting": "Richard Hakluyt's influential 1584 treatise arguing that American colonization would challenge Catholic Spain, expand trade, and export surplus population.",
  "Silver Cup Dispute Leads to Village Burning": "The reckless overreaction by Sir Richard Grenville in 1585, burning an entire Native Secotan village and cornfields over a missing silver cup.",
  "Ralph Lane Ambush Kills Chief Wingina": "The preemptive strike by English governor Ralph Lane in June 1586, beheading the local Secotan leader and making peace with indigenous tribes impossible.",
  "Drake Arrives to Evacuate Starving Settlers": "Francis Drake's fleet visiting Roanoke in June 1586 following Caribbean raids, rescuing the demoralized and starving first English settlers.",
  "Armada Impounds Supply Ships in England": "The military emergency of 1588 forcing the Privy Council to requisition all ocean-going vessels for defense, preventing relief ships from reaching the Lost Colony."
};

const eeePath = path.join(__dirname, '../data/eee.json');
const publicEeePath = path.join(__dirname, '../public/data/eee.json');
const dbPath = path.join(__dirname, '../database.json');
const publicDbPath = path.join(__dirname, '../public/database.json');

const eeeData = JSON.parse(fs.readFileSync(eeePath, 'utf8'));

let updatedCount = 0;
const lessons = Array.isArray(eeeData) ? eeeData : (eeeData.lessons || []);

lessons.forEach(lesson => {
  const stages = lesson.workbook_stages || lesson.stages || [];
  stages.forEach(stage => {
    const words = stage.words || stage.key_terms || [];
    words.forEach(w => {
      const term = typeof w === 'string' ? w : w.term;
      if (eeeClues[term]) {
        w.clue = eeeClues[term];
        updatedCount++;
      }
    });
  });
});

console.log(`Updated ${updatedCount} clues in Early Elizabethan England!`);

fs.writeFileSync(eeePath, JSON.stringify(eeeData, null, 2), 'utf8');
console.log(`Saved ${eeePath}`);

if (fs.existsSync(publicEeePath)) {
  fs.writeFileSync(publicEeePath, JSON.stringify(eeeData, null, 2), 'utf8');
  console.log(`Saved ${publicEeePath}`);
}

if (fs.existsSync(dbPath)) {
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  db.eee = eeeData;
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  console.log('Saved database.json (eee key)');
}

if (fs.existsSync(publicDbPath)) {
  const pdb = JSON.parse(fs.readFileSync(publicDbPath, 'utf8'));
  pdb.eee = eeeData;
  fs.writeFileSync(publicDbPath, JSON.stringify(pdb, null, 2), 'utf8');
  console.log('Saved public/database.json (eee key)');
}

console.log('Early Elizabethan England healing completed successfully!');

