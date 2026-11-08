const fs = require('fs');
const path = require('path');

const eeeModels = {
  "1_2": "Meeting daily, the <strong>19-Man Privy Council</strong> managed administration while Elizabeth granted lucrative <strong>Monopolies & Royal Licences</strong> to preserve the delicate <strong>Factional Balance at Court</strong>.",
  "1_3": "Compounded by the <strong>Papal Rejection of Anne Boleyn</strong> and the legal barrier of the <strong>1536 Succession Act Bar</strong>, Elizabeth faced immense <strong>Pressure to Produce Protestant Heir</strong>.",
  "1_4": "Relying locally on <strong>Unpaid Justices of the Peace</strong> and <strong>Lords Lieutenant County Militias</strong>, the Crown remained financially constrained by <strong>Taxation Granted Solely by MPs</strong>.",
  "1_5": "Following the humiliating <strong>Loss of Calais (January 1558)</strong>, English security was threatened by <strong>French Garrison Troops in Scotland</strong> alongside Mary Stuart’s <strong>Quartered English Royal Arms</strong>.",
  "2_1": "Divided between the <strong>Conservative North & Western Gentry</strong> and <strong>Radical Returning Marian Exiles</strong>, Elizabeth had to overcome the resistance of <strong>Marian Bishops in Lords</strong>.",
  "2_2": "Adopting the <strong>‘Supreme Governor’ Compromise Title</strong>, the 1559 Act of Supremacy enforced a <strong>Compulsory Oath for Clergy</strong> that resulted in <strong>All Marian Bishops Deprived</strong> of their sees.",
  "2_3": "Enacting the <strong>Compulsory 1559 Prayer Book</strong> and a <strong>One-Shilling Recusancy Fine</strong>, the Act of Uniformity crafted a <strong>Deliberate Communion Ambiguity</strong> to placate moderates.",
  "2_4": "Issuing <strong>Fifty-Seven Royal Directives</strong> that placed an <strong>English Bible in Every Church</strong>, the Royal Injunctions ensured that <strong>Pilgrimages & Fake Miracles Banned</strong> were enforced.",
  "2_5": "Dispatched across England, <strong>125 Visitation Commissioners</strong> enforced <strong>Parish Church Court Supervision</strong>, resulting in approximately <strong>Four Hundred Clergy Resignations</strong>.",
  "3_1": "Influenced by <strong>Geneva Calvinist Influence</strong>, radical Puritans presented a <strong>Demand to Abolish Holy Days</strong>, which the Queen condemned as an unacceptable <strong>Threat to Royal Prerogative</strong>.",
  "3_2": "The Queen's insistence on <strong>Compulsory Clergy Surplices</strong> under the <strong>White Linen Surplice Requirement</strong> culminated in <strong>Thirty-Seven London Priests Sacked</strong> during the Vestments Controversy.",
  "3_3": "While many were <strong>Church Papists Attending Services</strong> and protected by <strong>Lax Local JPs in North</strong>, Elizabeth maintained a <strong>Tolerant ‘Windows Into Men’s Souls’</strong> policy in her early reign.",
  "3_4": "While the <strong>French Wars of Religion (1562)</strong> distracted France, the arrival of <strong>10,000 Spanish Troops in Netherlands</strong> brought the <strong>Council of Troubles Brutality</strong> to England's doorstep.",
  "3_5": "When stormy seas forced an <strong>£85,000 Italian Bullion Storm Shelter</strong> into English ports, the <strong>Queen Claims Italian Bank Loan</strong> manoeuvre provoked Alba to enforce the <strong>Alba Imposes English Trade Embargo</strong>.",
  "4_1": "Backed by royal <strong>Margaret Tudor Granddaughter Lineage</strong>, Mary Queen of Scots fled Scotland following the <strong>Suspicious Murder of Mary’s Husband</strong> to become a <strong>Legitimate Catholic Figurehead</strong> in England.",
  "4_2": "The mysterious <strong>Kirk o’ Field Gunpowder Explosion</strong> and subsequent <strong>Scottish Protestant Rebellion</strong> led the rebellious <strong>Scottish Nobility Force Abdication</strong> upon Mary.",
  "4_3": "Following her <strong>Forced Abdication for Infant James VI</strong> and an escape culminating in a <strong>Fishing Boat Crossing to Workington</strong>, Mary became an <strong>Anointed Monarch Under House Arrest</strong>.",
  "4_4": "Examining the controversial <strong>Eight French Casket Love Letters</strong> amidst Mary's <strong>Refusal of Direct Cross-Examination</strong>, the York commissioners declared <strong>No Verdict Justifies Detention</strong>.",
  "4_5": "Closely <strong>Guarded by Earl of Shrewsbury</strong> in northern castles, Mary was drawn into the <strong>Duke of Norfolk Court Marriage Plot</strong> as a <strong>Magnet for Northern Catholic Discontent</strong>.",
  "5_1": "After celebrating a rebel <strong>Latin Mass at Durham Cathedral</strong>, the 1569 revolt collapsed when <strong>Spanish Troops Fail to Land</strong>, prompting <strong>Four Hundred and Fifty Executions</strong> of common rebels.",
  "5_2": "Pope Pius V's 1570 <strong>Regnans in Excelsis Excommunication</strong> bull inspired <strong>Italian Banker Roberto Ridolfi Courier</strong> to coordinate a conspiracy that saw <strong>Norfolk Beheaded on Tower Hill</strong>.",
  "5_3": "Uncovering a dangerous <strong>French Catholic Invasion Plan</strong> funded when <strong>Philip II Provides 200,000 Ducats</strong>, Walsingham's discovery prompted Parliament to enact the <strong>Bond of Association Traitor Oath</strong>.",
  "5_4": "Smuggling <strong>Letters in Waterproof Beer Barrels</strong>, Walsingham intercepted notes as <strong>Phelippes Decodes Gallows Cipher</strong>, exposing Mary's <strong>Explicit Approval of Regicide</strong>.",
  "5_5": "Tried under the <strong>Act for the Queen’s Safety Trial</strong> and led to the <strong>Fotheringhay Castle Great Hall Block</strong>, Mary staged a dramatic display of <strong>Divine Right Monarchical Martyrdom</strong>.",
  "6_1": "Driven by the strategic <strong>Antwerp Deep-Water Ports Threat</strong> and sympathy for the <strong>William of Orange Protestant Rebellion</strong>, Elizabeth secretly aided the rebels by <strong>Funding Sea Beggars Privateers</strong>.",
  "6_2": "Challenging the <strong>Spanish Monopoly on American Bullion</strong>, Drake’s daring <strong>Nombre de Dios Mule Train Ambush</strong> in 1572 demonstrated how the <strong>Queen Licences Legal Piracy</strong>.",
  "6_3": "Looting the galleon <strong>Cacafuego Surrenders £140,000 Treasure</strong> during <strong>Uncharted Pacific Raids on Peru</strong>, Drake returned to receive a defiant <strong>Golden Hind Knighthood Defiance</strong> from the Queen.",
  "6_4": "When <strong>Philip II Inherits Portuguese Crown</strong> and the tragic <strong>Assassination of William of Orange</strong> unfolded, Spain concluded the secret <strong>French Catholic Guise League Accord</strong>.",
  "6_5": "Prompted by the Catholic <strong>Secret Treaty of Joinville (Dec 1584)</strong>, Elizabeth dispatched <strong>7,400 English Troops under Dudley</strong> under the Treaty of Nonsuch, making <strong>Direct Military Confrontation Declared</strong> between England and Spain.",
  "7_1": "Although Dudley accepting the <strong>Governor-General Title Angers Elizabeth</strong> while commanding <strong>Underfunded & Deserting English Troops</strong>, his campaign <strong>Prevents Parma Capturing Deep Ports</strong> like Flushing and Brill.",
  "7_3": "Leading a preemptive raid where <strong>Thirty Spanish Warships Destroyed</strong> in Cadiz harbor, Drake celebrated <strong>‘Singeing the King of Spain’s Beard’</strong> as the strike <strong>Postpones Armada by Twelve Months</strong>.",
  "7_4": "Because <strong>Seasoned Barrel Staves Incinerated</strong> at Cadiz and <strong>Santa Cruz Dies; Medina Sidonia Inexperienced</strong> took command, the Spanish fleet departed with <strong>Rotting Food & Leaking Water Casks</strong>.",
  "7_5": "When <strong>130 Ships & 30,000 Men Sail</strong> up the Channel, communications collapsed because <strong>Parma Lacks Deep-Water Harbor in Shallows</strong> and commanders relied on an <strong>Unreliable 48-Hour Message Relay</strong>.",
  "8_1": "Advancing in a formidable <strong>Seven-Mile Crescent Defensive Line</strong>, Medina Sidonia fought a <strong>Long-Range Culverin Duel Beyond Boarding</strong> that successfully <strong>Prevented Landing on Isle of Wight</strong>.",
  "8_2": "Releasing <strong>Eight Pitch-Soaked Vessels at Midnight</strong> into Calais roads, the attack caused <strong>Panic-Stricken Spanish Ships Cut Anchors</strong>, ensuring their <strong>Shattered Crescent Never Reforms</strong>.",
  "8_3": "Taking advantage of <strong>Fast English Race-Built Galleons</strong>, Howard used <strong>Rapid-Fire Broadside Gunnery Close Range</strong> until <strong>Three Galleons Sunk & Fleet Scattered</strong> at Gravelines.",
  "8_4": "As a <strong>Gale-Force ‘Protestant Wind’ Drives North</strong>, wrecked ships foundered on <strong>Missing Anchors on Scottish & Irish Reefs</strong>, leaving <strong>Only Sixty-Seven Battered Ships Return</strong> to Spain.",
  "8_5": "Inspiring her troops with her <strong>Tilbury Speech: ‘Heart & Stomach of a King’</strong> and minting <strong>‘God Blew and They Were Scattered’ Medals</strong>, the triumph saw <strong>English Naval Superpower Prestige Secured</strong>.",
  "9_1": "Reflecting modest <strong>Literacy at 30% for Men & 10% for Women</strong>, children learned reading in <strong>Petty Schools & Dame Schools for Basics</strong>, with schooling designed around <strong>Reinforcing Great Chain of Being</strong>.",
  "9_2": "As <strong>Over Seventy New Endowed Schools Founded</strong> across England, grammar schools taught a <strong>Latin Grammar & Classical Rhetoric Curriculum</strong> that offered <strong>Social Mobility for Middling Sons</strong>.",
  "9_3": "Supplementing <strong>Private Tutors in Noble Households</strong>, aristocratic sons attended <strong>Oxford & Cambridge College Expansions</strong> before completing their training with <strong>Inns of Court London Legal Training</strong>.",
  "9_4": "While nobles enjoyed <strong>Hunting, Hawking & Fencing for Elites</strong> and commoners played <strong>Violent Folk Football & Archery for Commoners</strong>, all classes flocked to <strong>Universal Paris Garden Bear-Baiting</strong>.",
  "9_5": "When James <strong>Burbage Builds ‘The Theatre’ at Shoreditch</strong> in 1576, thousands of <strong>Penny Groundlings Mingle with Box Gentry</strong>, even as <strong>Puritans Condemn Immorality & Plague Risk</strong>.",
  "10_1": "As the national <strong>Population Surges from 3m to Over 4m</strong>, severe harvests meant that <strong>Consecutive Bad Harvests Inflate Grain Prices</strong>, causing <strong>Falling Real Wages for Farm Labourers</strong>.",
  "10_2": "Because lucrative <strong>Wool Accounts for 80% of English Exports</strong>, landowners turned to <strong>Hedging Common Land for Low-Labour Flocks</strong>, causing the bitter <strong>Eviction of Strip-Farming Tenant Cottagers</strong>.",
  "10_3": "Influenced by Thomas <strong>Harman’s Caveat for Common Cursitors Book</strong>, authorities distinguished between the <strong>Impotent Poor Versus Sturdy Beggars</strong> driven by the <strong>Dread of Social Unrest & Treasonous Riot</strong>.",
  "10_4": "Establishing a <strong>Compulsory Parish Poor Rate Tax</strong> administered by <strong>Overseers Appointed to Distribute Relief</strong>, the 1572 Vagabonds Act retained harsh <strong>Ear-Boring with Hot Iron for Repeat Vagrants</strong>.",
  "10_5": "Requiring that <strong>Parishes Provide Raw Wool, Flax & Hemp</strong> for employment while <strong>County Bridewells Compel Hard Labour</strong>, the 1576 Act created the <strong>Foundation for Comprehensive 1601 Poor Law</strong>.",
  "11_1": "Navigators utilized <strong>Astrolabes & Quadrants Measure Latitude</strong> and Gerard <strong>Mercator Projection Global Maps (1569)</strong> to pioneer long-distance <strong>Navigation Away from Known Coastlines</strong>.",
  "11_2": "Featuring <strong>Low Forecastles & Triangular Lateen Sails</strong> with heavy <strong>Culverin Cannons on Four-Wheel Carriages</strong>, English galleons excelled at <strong>Manoeuvrable Tacking in Severe Atlantic Weather</strong>.",
  "11_3": "Prompted by the <strong>Collapse of Antwerp Cloth Market (1550s)</strong>, merchants created the <strong>Muscovy & Levant Joint-Stock Companies</strong> while funding the <strong>Frobisher & Davis Arctic Northwest Search</strong>.",
  "11_4": "Renaming his flagship after the <strong>Pelican Renamed Golden Hind at Horn</strong> following <strong>Strait of Magellan Gale Storm Survival</strong>, Drake claimed <strong>Claims Nova Albion (California) for Crown</strong>.",
  "11_5": "Returning home with <strong>£140,000 Spanish Bullion Cargo Returns</strong> that earned a <strong>4,700% Financial Profit Pays Crown Debt</strong>, the voyage demonstrated that <strong>Proves England Can Challenge Spanish Seas</strong>.",
  "12_1": "Granted a royal <strong>Six-Year Patent to Claim Uncharted Land</strong>, Walter Raleigh utilized <strong>Hakluyt’s Discourse on Western Planting</strong> to promote a <strong>Privateering Base to Intercept Spanish Plate</strong>.",
  "12_2": "Consisting of <strong>107 Gentlemen Soldiers & No Farmers</strong> under the strict <strong>Grenville Fleet & Ralph Lane Army Discipline</strong>, the expedition brought <strong>Manteo & Wanchese Native Translators</strong> to Virginia.",
  "12_3": "When their <strong>Flagship Tiger Runs Aground on Sandbar</strong> and <strong>Seawater Ruins Grain Seeds & Provisions</strong>, colonists suffered from a <strong>Disastrous Reliance on Secotan Fish Weirs</strong>.",
  "12_4": "Escalating when a minor <strong>Silver Cup Dispute Leads to Village Burning</strong>, Governor <strong>Ralph Lane Ambush Kills Chief Wingina</strong> before <strong>Drake Arrives to Evacuate Starving Settlers</strong> in 1586.",
  "12_5": "Comprising <strong>118 Civilian Settlers Led by John White</strong>, disaster struck when the <strong>Armada Impounds Supply Ships in England</strong>, leaving only the cryptic word <strong>‘CROATOAN’ Carved on Deserted Palisade</strong>."
};

const filePath = path.join(__dirname, '../data/eee.json');
const pubFilePath = path.join(__dirname, '../public/data/eee.json');
const dbPath = path.join(__dirname, '../database.json');
const pubDbPath = path.join(__dirname, '../public/database.json');

const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

let updated = 0;
data.lessons.forEach((l, li) => {
  (l.workbook_stages || l.stages || []).forEach((s, si) => {
    const key = `${li+1}_${si+1}`;
    if (eeeModels[key]) {
      s.model_sentence = eeeModels[key];
      updated++;
    }
  });
});

console.log(`Updated ${updated} model sentences in Early Elizabethan England.`);

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
if (fs.existsSync(pubFilePath)) {
  fs.writeFileSync(pubFilePath, JSON.stringify(data, null, 2), 'utf8');
}

[dbPath, pubDbPath].forEach(p => {
  if (fs.existsSync(p)) {
    const db = JSON.parse(fs.readFileSync(p, 'utf8'));
    db.eee = data;
    fs.writeFileSync(p, JSON.stringify(db, null, 2), 'utf8');
    console.log(`Updated eee in ${p}`);
  }
});

