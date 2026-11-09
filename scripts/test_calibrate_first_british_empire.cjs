const fs = require('fs');

const lessonsData = [
  // Lesson 1: The East India Company & Mughal Bengal (1600–1757)
  [
    // B1: ["218 London Merchants", "Pepper & Cotton Cargo", "Private Trade Profits"]
    '<p class="prose-p"><span class="para-ref">[1.1]</span> On New Year’s Eve in 1600, Queen Elizabeth I granted an exclusive royal monopoly charter to 218 London merchants and City financiers. Seeking enormous fortunes in Asian spice markets, the syndicate pooled £68,000 to fit out armed ocean-going galleons loaded with silver bullion and English broadcloth.</p><p class="prose-p">Commanded by James Lancaster, their ships returned laden with precious pepper & cotton cargo, generating sensational private trade profits of over 300%. This commercial triumph laid the permanent corporate foundation of the <strong>East India Company</strong>.</p>',

    // B2: ["Emperor Jahangir", "Surat, Madras, Calcutta", "Armed Sepoy Garrisons"]
    '<p class="prose-p"><span class="para-ref">[1.2]</span> In 1615, King James I dispatched diplomat Sir Thomas Roe to negotiate with Mughal Emperor Jahangir at his royal court. Roe secured an imperial royal decree permitting English merchants to construct permanent fortified warehouses known as factories at the port of Surat.</p><p class="prose-p">Over the seventeenth century, the Company established vital commercial coastal enclaves across Surat, Madras, Calcutta, and Bombay. These bustling depots were defended by armed sepoy garrisons of recruited Indian infantry, transforming merchant warehouses into formidable corporate fortresses.</p>',

    // B3: ["Mounting Heavy Cannons", "Siege of Fort William", "The Black Hole Dungeon"]
    '<p class="prose-p"><span class="para-ref">[1.3]</span> By 1756, the lush province of Bengal had become the Company’s most lucrative trading territory. When British merchants began mounting heavy cannons around Fort William without permission, twenty-three-year-old Nawab Siraj ud-Daulah marched 50,000 soldiers against Calcutta to halt unauthorized fortifications.</p><p class="prose-p">Following the swift three-day siege of Fort William, captured British soldiers were locked overnight in the Black Hole dungeon guardroom, where dozens died of suffocation. British imperial accounts sensationalized the tragedy to whip up public fury for conquest.</p>',

    // B4: ["Secret Gold Bribes", "Heavy Monsoon Downpour", "Mir Jafar’s Treason"]
    '<p class="prose-p"><span class="para-ref">[1.4]</span> In 1757, Lieutenant-Colonel Robert Clive arrived with troops to retake Calcutta. Realizing he was hopelessly outnumbered, Clive used secret gold bribes to corrupt Mir Jafar, commander of Bengal’s army, promising him the Nawab’s throne in return for betrayal.</p><p class="prose-p">On 23 June at Plassey, a heavy monsoon downpour soaked Siraj’s exposed cannon gunpowder while Clive protected British powder under tarpaulins. Mir Jafar’s treason ensured his divisions stood motionless, allowing British artillery to shatter Siraj’s forces.</p>',

    // B5: ["Emperor Shah Alam II", "Collecting Land Revenue", "1770 Bengal Famine"]
    '<p class="prose-p"><span class="para-ref">[1.5]</span> Following further military triumphs at Buxar, Clive forced defeated Mughal Emperor Shah Alam II to sign the 1765 Treaty of Allahabad. This granted the Company the <em>Diwani</em>: the sovereign right of collecting land revenue and taxes across Bengal, Bihar, and Orissa.</p><p class="prose-p">Corporate agents ruthlessly extracted millions from Indian peasants. When severe drought struck, unbending tax enforcement triggered the catastrophic 1770 Bengal famine, leading to the starvation of an estimated ten million people while Company profits soared.</p>'
  ],

  // Lesson 2: The Transatlantic Slave Trade & The Middle Passage (1619–1807)
  [
    // B1: ["Manufactured Guns & Brass", "Kidnapped African Captives", "Raw Plantation Sugar"]
    '<p class="prose-p"><span class="para-ref">[2.1]</span> Britain’s transatlantic empire was anchored in triangular trade. British merchant ships sailed from Liverpool and Bristol laden with manufactured guns & brass pans, iron bars, and textiles, exchanging these manufactured goods with coastal African elites for human beings.</p><p class="prose-p">Captains forced kidnapped African captives into ship holds, transporting survivors across the Atlantic into brutal plantation slavery. Ships then returned to Britain laden with raw plantation sugar, rum, tobacco, and cotton, enriching British merchants and banks.</p>',

    // B2: ["Royal African Company", "Branded Hot Iron RAC", "Spanish Asiento Contract"]
    '<p class="prose-p"><span class="para-ref">[2.2]</span> In 1672, King Charles II chartered the Royal African Company, headed by his brother James, Duke of York. The Crown granted the enterprise a legal monopoly over British slave trafficking, constructing heavily armed forts along the West African coast.</p><p class="prose-p">Enslaved men, women, and children were branded hot iron RAC on their chests to signify corporate ownership. In 1713, Britain secured the Spanish Asiento contract, winning the exclusive right to supply Spanish American colonies with enslaved laborers.</p>',

    // B3: ["Chained on Wooden Shelves", "Iron Shackles & Collars", "Deadly Dysentery & Fevers"]
    '<p class="prose-p"><span class="para-ref">[2.3]</span> The Middle Passage was an eight-week ocean crossing of calculated terror. Hundreds of African men, women, and children were packed chained on wooden shelves below deck, given less breathing room than a corpse in a coffin.</p><p class="prose-p">Locked tightly in iron shackles & collars, captives suffered agonizing seasickness and deadly dysentery & fevers in pitch-black, suffocating holds. Approximately one in six captive Africans died during the horrific crossing, their bodies callously tossed into the Atlantic Ocean.</p>',

    // B4: ["Captain Luke Collingwood", "133 Thrown Overboard", "Fraudulent Insurance Claim"]
    '<p class="prose-p"><span class="para-ref">[2.4]</span> In November 1781, the cruelty of chattel slavery culminated in the Zong massacre. Running dangerously low on fresh drinking water due to navigational errors, Captain Luke Collingwood ordered sick enslaved captives murdered to preserve financial investments.</p><p class="prose-p">Over three days, Collingwood had 133 thrown overboard to drown in the Caribbean sea. When the ship owners filed a fraudulent insurance claim treating human lives as lost cargo, abolitionist Granville Sharp exposed the atrocity to the British public.</p>',

    // B5: ["Brookes Ship Diagram", "Equiano’s Bestselling Book", "Abolition Act of 1807"]
    '<p class="prose-p"><span class="para-ref">[2.5]</span> During the late eighteenth century, British abolitionists launched a powerful moral campaign to awaken the public conscience. Activists printed thousands of copies of the famous Brookes ship diagram, visually exposing how human bodies were stowed like cargo in dark, airless holds.</p><p class="prose-p">Freed African author Olaudah Equiano published Equiano’s bestselling book autobiography, recounting his enslavement and stirring national outrage. This relentless public pressure forced Parliament to pass the landmark Abolition Act of 1807, outlawing British slave trading.</p>'
  ],

  // Lesson 3: Plantation Reality, Queen Nanny & Maroon Resistance (1655–1740)
  [
    // B1: ["Western Design Invasion", "Escaping to Rainforests", "Blue Mountain Fortresses"]
    '<p class="prose-p"><span class="para-ref">[3.1]</span> In 1655, Oliver Cromwell dispatched an English expeditionary fleet on his ambitious Western Design invasion, seizing the Caribbean island of Jamaica from the Spanish Empire. Amid the chaos of battle, enslaved African workers seized the opportunity to break their chains by escaping to rainforests in the mountainous interior.</p><p class="prose-p">Known as the Maroons, these self-liberated communities constructed impenetrable Blue Mountain fortresses. There they established autonomous settlements, cultivating communal mountain crops and organizing disciplined military units to resist British colonial recapture.</p>',

    // B2: ["Iron Crushing Rollers", "Overseer Cowhide Whips", "Exhaustion & Brutality"]
    '<p class="prose-p"><span class="para-ref">[3.2]</span> On Jamaican sugar estates, enslaved people endured brutal industrial discipline from dawn until dusk. In punishing tropical heat, field gangs toiled under the constant threat of overseer cowhide whips, while mill workers risked having hands crushed in heavy iron crushing rollers.</p><p class="prose-p">Work continued relentlessly for eighteen hours a day during intensive harvest seasons. Extreme exhaustion & brutality caused shocking mortality rates, forcing wealthy absentee British planters to import thousands of newly captured Africans annually to replace those who died.</p>',

    // B3: ["Breaking Tool Handles", "Feigning Sudden Sickness", "Anansi Trickster Tales"]
    '<p class="prose-p"><span class="para-ref">[3.3]</span> Enslaved people fought back against dehumanisation through everyday sabotage and cultural solidarity. Field hands actively resisted plantation oppression by breaking tool handles, damaging boiling house copper cauldrons, working slowly, and feigning sudden sickness to disrupt sugar production.</p><p class="prose-p">In slave quarters, communities maintained West African spiritual rituals, herbal medicine, and songs of hope. Elders gathered families at night to recount Anansi trickster tales, celebrating how a small spider outwitted greedy, powerful predators through quick intellect.</p>',

    // B4: ["Living Branch Camouflage", "Sounding the Abeng Horn", "Guerilla Ambush Tactics"]
    '<p class="prose-p"><span class="para-ref">[3.4]</span> In eastern Jamaica, the Windward Maroons were led by Queen Nanny, a legendary Asante warrior and spiritual leader. Nanny trained her forest fighters in living branch camouflage, concealing warriors so effectively with forest leaves that they appeared as natural mountain foliage.</p><p class="prose-p">Maroons coordinated swift military movements across misty ridges by sounding the abeng horn made from cow horns. Using devastating guerilla ambush tactics, Nanny’s warriors repeatedly outmanoeuvred and routed heavily armed British military regiments.</p>',

    // B5: ["1,500 Sovereign Acres", "British Truce White Flag", "Returning Enslaved Fugitives"]
    '<p class="prose-p"><span class="para-ref">[3.5]</span> Exhausted by decades of humiliating jungle warfare, British Governor Edward Trelawny sent messengers carrying a British truce white flag in 1739. The resulting peace treaty formally granted the Maroons 1,500 sovereign acres of fertile mountain territory, acknowledging their freedom.</p><p class="prose-p">However, the treaty demanded a painful moral compromise: the Maroons agreed to assist British authorities by returning enslaved fugitives who escaped plantations. Despite this tragic concession, Maroon autonomy proved that organized resistance could humble the British Empire.</p>'
  ],

  // Lesson 4: The Thirteen Colonies, The Proclamation of 1763 & The Boston Tea Party (1763–1773)
  [
    // B1: ["£133m Imperial War Debt", "Proclamation Line of 1763", "Standing Army Quartering"]
    '<p class="prose-p"><span class="para-ref">[4.1]</span> Victory in the Seven Years’ War left Great Britain with an enormous £133m imperial war debt. Seeking to prevent costly frontier wars with Native American nations, King George III established the Proclamation Line of 1763, forbidding white settlement west of the Appalachian Mountains.</p><p class="prose-p">American colonists felt cheated of fertile land they had fought to secure. Resentment flared further when Parliament passed the Quartering Acts, forcing towns to provide standing army quartering for ten thousand British soldiers.</p>',

    // B2: ["Taxing Legal Documents", "Attacking Stamp Collectors", "Colonial Import Boycotts"]
    '<p class="prose-p"><span class="para-ref">[4.2]</span> In 1765, Parliament passed the controversial Stamp Act to raise colonial revenue, taxing legal documents, newspapers, pamphlets, and playing cards. Colonists reacted with furious outrage, declaring that taxation without representation in the British Parliament violated their historic rights as freeborn Englishmen.</p><p class="prose-p">The Sons of Liberty organized violent resistance, attacking stamp collectors, hanging royal officials in effigy, and burning tax offices. Widespread colonial import boycotts crippled British exports, forcing Parliament to repeal the hated stamp tax in 1766.</p>',

    // B3: ["Snowballs, Ice & Oysters", "Five Dead Colonists", "Paul Revere’s Engraving"]
    '<p class="prose-p"><span class="para-ref">[4.3]</span> On 5 March 1770, simmering anger exploded on Boston’s icy King Street. A hostile crowd surrounded a lone British sentry post, pelting arriving soldiers with snowballs, ice & oysters shells while daring redcoats to fire their loaded muskets.</p><p class="prose-p">In the confusion, panicked soldiers discharged their weapons, leaving five dead colonists on the cobbles, including Black sailor Crispus Attucks. Paul Revere’s engraving sensationalized the clash as a premeditated British slaughter, galvanizing colonial fury against military occupation.</p>',

    // B4: ["18m Pounds Surplus Tea", "East India Company Monopoly", "Bypassing Local Merchants"]
    '<p class="prose-p"><span class="para-ref">[4.4]</span> In May 1773, Parliament passed the Tea Act to rescue the struggling East India Company, which held 18m pounds surplus tea unsold in London warehouses. The statute granted the corporation an East India Company monopoly to sell tea directly to American ports.</p><p class="prose-p">Although this lowered tea prices below smuggled Dutch imports, colonists recognized a dangerous constitutional trap. Bypassing local merchants and enforcing taxes without consent provoked unified resistance and harbour blockades across colonial seaports.</p>',

    // B5: ["Sons of Liberty Mohawks", "342 Chests Smashed Open", "Punitive Coercive Acts"]
    '<p class="prose-p"><span class="para-ref">[4.5]</span> On the night of 16 December 1773, dozens of Sons of Liberty Mohawks disguised themselves with war paint and blankets, boarding three British tea ships in Boston harbour. In three disciplined hours, 342 chests smashed open emptied £10,000 of tea into the ocean.</p><p class="prose-p">King George III and Parliament retaliated ruthlessly by enacting the punitive Coercive Acts of 1774. The legislation shut Boston port and suspended Massachusetts government, driving the thirteen colonies toward open armed revolution.</p>'
  ],

  // Lesson 5: The American Revolution, 1776 Declaration & The Black Loyalists (1775–1783)
  [
    // B1: ["Paul Revere Midnight Alarm", "The Shot Heard Round the World", "Dunmore’s Freedom Offer"]
    '<p class="prose-p"><span class="para-ref">[5.1]</span> In April 1775, British redcoats marched to seize colonial munitions at Concord. The famous Paul Revere midnight alarm warned town militias to mobilize, leading to an armed standoff at Lexington Green where someone fired the shot heard round the world.</p><p class="prose-p">As war spread, Virginia’s royal governor issued Dunmore’s freedom offer, promising emancipation to enslaved Black laborers who fled rebel plantations to bear arms for King George III, prompting thousands to join the British forces.</p>',

    // B2: ["Jefferson’s Eagle Quill", "All Men Created Equal", "Slaveholder Signatories"]
    '<p class="prose-p"><span class="para-ref">[5.2]</span> In July 1776, the Continental Congress in Philadelphia met to adopt the Declaration of Independence. Drafting the historic text with Jefferson’s eagle quill, Thomas Jefferson wrote the immortal words declaring that all men created equal with natural rights to life and liberty.</p><p class="prose-p">Yet the founding document concealed a profound moral hypocrisy: forty-one of the fifty-six slaveholder signatories personally owned enslaved humans, deliberately denying basic legal and human freedom to half a million African Americans across the colonies.</p>',

    // B3: ["Defeating General Burgoyne", "King Louis XVI Warships", "Sugar Island Divergence"]
    '<p class="prose-p"><span class="para-ref">[5.3]</span> The decisive turning point arrived in October 1777 at Saratoga, where American continental forces triumphed by defeating General Burgoyne. This victory convinced King Louis XVI warships and French armies to enter the conflict as formal military allies of the American rebels.</p><p class="prose-p">The conflict transformed rapidly into a global war. Great Britain suffered severe sugar island divergence, compelled to divert vital warships away from North America to safeguard its fabulously lucrative Caribbean sugar colonies against French capture.</p>',

    // B4: ["Cornwallis Peninsula Trap", "De Grasse Chesapeake Blockade", "The World Turned Upside Down"]
    '<p class="prose-p"><span class="para-ref">[5.4]</span> In autumn 1781, British commander Lord Cornwallis marched into a peninsula trap at Yorktown, Virginia. George Washington’s forces besieged the garrison by land, while French Admiral de Grasse Chesapeake blockade cut off all British naval reinforcements and rescue.</p><p class="prose-p">Trapped and relentlessly pounded by heavy artillery, Cornwallis surrendered eight thousand redcoats on 19 October 1781. As defeated British soldiers marched out to lay down their muskets, their military band famously played the melancholy ballad The World Turned Upside Down.</p>',

    // B5: ["American Independence Treaty", "Book of Negroes Ledgers", "Nova Scotia Evacuation Ships"]
    '<p class="prose-p"><span class="para-ref">[5.5]</span> In September 1783, the American independence treaty signed at Paris recognized the United States as a sovereign republic. In New York, British commander Sir Guy Carleton protected three thousand Black Loyalists who had loyally served the British Crown during the war.</p><p class="prose-p">British military clerks registered their names into Book of Negroes ledgers, issuing freedom certificates that allowed families to board Nova Scotia evacuation ships, securing liberty in Canada and later founding Freetown in Sierra Leone.</p>'
  ]
];

// Check word counts and paragraphs
console.log('=== WORD COUNT & PARAGRAPH AUDIT FOR FIRST BRITISH EMPIRE ===');
let allOk = true;
let totalWords = 0;
let blockCount = 0;

lessonsData.forEach((l, lIdx) => {
  l.forEach((bText, bIdx) => {
    blockCount++;
    const words = bText.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
    totalWords += words;
    const pCount = (bText.match(/<p class="prose-p">/g) || []).length;
    const status = (words >= 75 && words <= 115 && pCount === 2) ? 'OK' : 'FAIL';
    if (status === 'FAIL') allOk = false;
    console.log(`L${lIdx+1} B${bIdx+1}: ${words}w, ${pCount} paras -> ${status}`);
  });
});
console.log(`\nAverage word count: ${(totalWords / blockCount).toFixed(1)} words/block`);
console.log('All blocks within 75-115w and exactly 2 paragraphs:', allOk);

// Trigger check
const vm = require('vm');
const path = require('path');
const ROOT_DIR = path.resolve(__dirname, '..');
const wbPath = path.join(ROOT_DIR, 'scripts', 'render_first_british_empire_workbook.cjs');
const wbContent = fs.readFileSync(wbPath, 'utf8');
const startIdx = wbContent.indexOf('const enquiryConfigs = [');
const endIdx = wbContent.indexOf('\nfunction renderFooterStrip');
const cfgStr = wbContent.slice(startIdx, endIdx);
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(cfgStr.replace('const enquiryConfigs', 'var enquiryConfigs'), sandbox);
const enquiryConfigs = sandbox.enquiryConfigs;

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'that', 'this', 'into', 'over', 'after', 
  'before', 'under', 'between', 'across', 'through', 'during', 'without', 'within', 
  'against', 'about', 'than', 'only', 'also', 'each', 'such', 'were', 'been', 
  'have', 'their', 'they', 'will', 'would', 'could', 'should', 'does', 'done', 
  'both', 'what', 'when', 'where', 'which', 'while', 'whom', 'why', 'per', 'how'
]);

let missingTotal = 0;
enquiryConfigs.forEach((cfg, eIdx) => {
  const blocks = lessonsData[eIdx];
  cfg.stages.forEach((stg, sIdx) => {
    const blockText = (blocks[sIdx] || '').toLowerCase().replace(/<[^>]+>/g, ' ');
    stg.bullets.forEach(bullet => {
      const words = bullet.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
      const missing = [];
      words.forEach(w => {
        const reg = new RegExp('\\b' + w, 'i');
        if (!reg.test(blockText)) missing.push(w);
      });
      if (missing.length > 0) {
        missingTotal += missing.length;
        console.log(`GAP: E${eIdx+1} S${stg.step || sIdx+1} "${bullet}" missing: [${missing.join(', ')}]`);
      }
    });
  });
});
console.log(`Trigger check result: ${missingTotal} missing words.`);

module.exports = { lessonsData };
