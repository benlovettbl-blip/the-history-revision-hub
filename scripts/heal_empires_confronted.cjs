const fs = require('fs');
const path = require('path');

const fbeModels = {
  "1_1": "Chartered in 1600 by <strong>218 London Merchants</strong>, the East India Company sailed for <strong>Pepper & Cotton Cargo</strong> that generated immense <strong>Private Trade Profits</strong>.",
  "1_2": "Securing royal trading rights from Mughal <strong>Emperor Jahangir</strong>, the Company built fortified factories in <strong>Surat, Madras, Calcutta</strong> protected by <strong>Armed Sepoy Garrisons</strong>.",
  "1_3": "Angered by British merchants <strong>Mounting Heavy Cannons</strong> without permission, Siraj ud-Daulah laid <strong>Siege of Fort William</strong>, imprisoning survivors in <strong>The Black Hole Dungeon</strong>.",
  "1_4": "Secured through Robert Clive's <strong>Secret Gold Bribes</strong> during a <strong>Heavy Monsoon Downpour</strong> at Plassey, victory was sealed by general <strong>Mir Jafar’s Treason</strong>.",
  "1_5": "Granted the Diwani by <strong>Emperor Shah Alam II</strong> for <strong>Collecting Land Revenue</strong>, ruthless Company taxation exacerbated the catastrophic <strong>1770 Bengal Famine</strong>.",
  "2_1": "The Transatlantic Triangular Trade exchanged British <strong>Manufactured Guns & Brass</strong> for <strong>Kidnapped African Captives</strong> in West Africa to produce profitable <strong>Raw Plantation Sugar</strong> in the Caribbean.",
  "2_2": "Chartered by the Stuart monarchy, the <strong>Royal African Company</strong> marked enslaved humans with a <strong>Branded Hot Iron RAC</strong> before supplying the lucrative <strong>Spanish Asiento Contract</strong>.",
  "2_5": "Mobilising public outrage through the graphic <strong>Brookes Ship Diagram</strong> and Olaudah <strong>Equiano’s Bestselling Book</strong>, abolitionists secured the historic <strong>Abolition Act of 1807</strong>.",
  "3_1": "Following Oliver Cromwell's 1655 <strong>Western Design Invasion</strong> of Jamaica, Spanish-held enslaved people fled by <strong>Escaping to Rainforests</strong> to build impregnable <strong>Blue Mountain Fortresses</strong>.",
  "3_2": "Working dangerous sugar cane <strong>Iron Crushing Rollers</strong> under the threat of <strong>Overseer Cowhide Whips</strong>, enslaved field hands endured relentless <strong>Exhaustion & Brutality</strong>.",
  "3_5": "After forcing the colonial governor to raise a <strong>British Truce White Flag</strong>, Maroons were granted <strong>1,500 Sovereign Acres</strong> in exchange for a controversial clause <strong>Returning Enslaved Fugitives</strong>.",
  "4_1": "Burdened by a staggering <strong>£133m Imperial War Debt</strong>, Parliament drew the <strong>Proclamation Line of 1763</strong> while mandating unpopular <strong>Standing Army Quartering</strong> in colonial towns.",
  "4_4": "To liquidate <strong>18m Pounds Surplus Tea</strong>, the 1773 Tea Act granted an <strong>East India Company Monopoly</strong> by <strong>Bypassing Local Merchants</strong> in American ports.",
  "4_5": "Disguised as <strong>Sons of Liberty Mohawks</strong>, Boston patriots left <strong>342 Chests Smashed Open</strong> in the harbor, provoking Parliament to retaliate with the <strong>Punitive Coercive Acts</strong>.",
  "5_1": "Following the famous <strong>Paul Revere Midnight Alarm</strong> and <strong>The Shot Heard Round the World</strong> at Lexington, Virginia's royal governor issued <strong>Dunmore’s Freedom Offer</strong> to enslaved recruits.",
  "5_2": "Drafted by <strong>Jefferson’s Eagle Quill</strong>, the Declaration proclaimed that <strong>All Men Created Equal</strong> despite the paradox of forty-one <strong>Slaveholder Signatories</strong> signing the document.",
  "5_4": "Ensnared in the <strong>Cornwallis Peninsula Trap</strong> by Admiral <strong>De Grasse Chesapeake Blockade</strong> at Yorktown, British redcoats surrendered as fifes played <strong>The World Turned Upside Down</strong>.",
  "5_5": "While the 1783 <strong>American Independence Treaty</strong> recognized the United States, British officers recorded 3,000 Black Loyalists in the <strong>Book of Negroes Ledgers</strong> before boarding <strong>Nova Scotia Evacuation Ships</strong>."
};

const sbeModels = {
  "1_1": "Driven by imports of <strong>Raw Sugar and Cotton</strong> carried across oceans by <strong>Armed Merchant Fleets</strong>, British ports accumulated vast <strong>Piles of Gold Coins</strong>.",
  "1_2": "Deploying <strong>Twenty-Seven Battleships</strong> under Nelson at Trafalgar, the Royal Navy broke enemy lines by <strong>Smashing Enemy Flagships</strong> and <strong>Controlling Global Sea Lanes</strong>.",
  "1_3": "Employing <strong>Ten Thousand Dockyard Smiths</strong> and pioneering machinery in <strong>Steam Wooden Block Mills</strong>, Portsmouth shipwrights laboured at <strong>Forging Iron Anchors</strong> for the fleet.",
  "1_4": "Equipped with massive <strong>Four-Inch Iron Armour Plates</strong> and powered by <strong>Twin Steam Engines</strong>, HMS Warrior revolutionised naval warfare by <strong>Bouncing Cannon Shells</strong> off iron hulls.",
  "1_5": "Enshrined in the 1889 <strong>Naval Defence Act Law</strong>, the Royal Navy committed to <strong>Matching Two Foreign Fleets</strong> by commissioning <strong>Dozens of New Battleships</strong>.",
  "2_1": "Before British colonial rule, India manufactured a <strong>Quarter of World Output</strong>, trading <strong>Fine Village Handloom Silk</strong> across Asia in exchange for merchants <strong>Paying in Silver Ingots</strong>.",
  "2_4": "Powered by industrial <strong>Lancashire Factory Mills</strong>, British tariffs placed a <strong>Seventy Percent Border Tax</strong> on Indian textiles while <strong>Flooding Bazaars with Cheap Cotton</strong>.",
  "2_5": "Left ruined as the ancient <strong>Dhaka Loom City Deserted</strong>, thousands of <strong>Starving Handloom Families</strong> were displaced from weaving and <strong>Forced into Farm Labour</strong>.",
  "3_2": "Issued with new Lee-Enfield <strong>Greased Paper Tubes</strong>, Hindu and Muslim sepoys revolted against <strong>Biting Cow and Pig Fat</strong> due to widespread <strong>Fear of Forced Conversion</strong>.",
  "3_3": "Rebellious sepoys stormed Meerut by <strong>Breaking Open Jail Cells</strong>, marching on Delhi to rally around the <strong>Aged Emperor Bahadur Shah</strong> in a display of <strong>Hindu and Muslim Unity</strong>.",
  "3_5": "Passed by Parliament in 1858, legislation <strong>Dissolving Company Rule</strong> established a royal <strong>Viceroy Direct Crown Command</strong> proclaimed in the historic <strong>Queen Victoria Proclamation</strong>.",
  "4_1": "Presided over by German <strong>Chancellor Otto von Bismarck</strong>, European diplomats sat <strong>Drawing Lines Across Maps</strong> at the 1884 Berlin Conference with <strong>Zero Africans Invited</strong>.",
  "4_3": "Capable of firing <strong>Six Hundred Rounds per Minute</strong> and protected by <strong>Bitter Bark Fever Medicine</strong>, British Maxim guns left <strong>Ten Thousand Dead at Omdurman</strong>.",
  "4_4": "Published as a viral <strong>Poem in The Times</strong>, Rudyard Kipling framed imperialism as a <strong>Claiming Selfless Duty</strong> while degrading colonised peoples with the <strong>Racist Slur Half-Devil</strong>.",
  "5_1": "Showcased inside the monumental <strong>Glass and Iron Crystal Palace</strong> before <strong>Six Million Ticket Holders</strong>, imperial wealth was symbolised by the <strong>Looted Koh-i-Noor Diamond</strong>.",
  "5_2": "Connecting commercial centres with over <strong>Twenty-Five Thousand Rail Miles</strong>, British engineers focused on <strong>Digging River Canals</strong> and stringing overhead <strong>Electric Telegraph Wires</strong>.",
  "5_3": "Governed by <strong>Viceroy Lytton Market Dogma</strong> that exported grain while confining famine victims to <strong>Hard Labour Relief Camps</strong>, over <strong>Ten Million Starved to Death</strong> in the 1870s.",
  "5_4": "Exposed in Dadabhai Naoroji's famous <strong>London Book on Poverty</strong> documenting <strong>Millions Siphoned in Tax Money</strong>, Naoroji made history as the <strong>First Indian Westminster MP</strong>.",
  "5_5": "While British imperialists celebrated <strong>Global Free Trade and Laws</strong>, critics highlighted the injustice of <strong>Crushing Local Industries</strong>, creating deeply <strong>Clashing Moral Judgments</strong>."
};

function applyModels(fileName, unitKey, models) {
  const filePath = path.join(__dirname, '../data', fileName);
  const pubFilePath = path.join(__dirname, '../public/data', fileName);
  const dbPath = path.join(__dirname, '../database.json');
  const pubDbPath = path.join(__dirname, '../public/database.json');

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let updated = 0;
  data.lessons.forEach((l, li) => {
    (l.workbook_stages || l.stages || []).forEach((s, si) => {
      const key = `${li+1}_${si+1}`;
      if (models[key]) {
        s.model_sentence = models[key];
        updated++;
      }
    });
  });
  console.log(`Updated ${updated} stages in ${fileName}`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  if (fs.existsSync(pubFilePath)) {
    fs.writeFileSync(pubFilePath, JSON.stringify(data, null, 2), 'utf8');
  }
  [dbPath, pubDbPath].forEach(dbp => {
    if (fs.existsSync(dbp)) {
      const db = JSON.parse(fs.readFileSync(dbp, 'utf8'));
      db[unitKey] = data;
      fs.writeFileSync(dbp, JSON.stringify(db, null, 2), 'utf8');
      console.log(`Updated ${unitKey} in ${dbp}`);
    }
  });
}

applyModels('first_british_empire.json', 'first_british_empire', fbeModels);
applyModels('second_british_empire.json', 'second_british_empire', sbeModels);

