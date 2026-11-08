const fs = require('fs');
const path = require('path');

const indModels = {
  "1_1": "Severe <strong>Deforestation of English Oaks</strong> forced early British ironmasters to produce <strong>Brittle Impure Pig Iron</strong>, creating a dangerous <strong>Dependence on Swedish Imports</strong>.",
  "1_2": "By introducing superior <strong>Separate Condenser Efficiency</strong> and continuous <strong>Rotary Shaft Motion</strong>, James Watt achieved the industrial <strong>Liberation from River Valleys</strong>.",
  "1_3": "Utilising an innovative <strong>Reverberatory Furnace Chamber</strong> to enable continuous <strong>Stirring Molten Decarburisation</strong>, Henry Cort succeeded in <strong>Eliminating Harmful Sulphur</strong> from wrought iron.",
  "1_4": "Cort’s new <strong>Mechanical Grooved Cylinders</strong> were fifteen times faster at <strong>Squeezing Out Slag Impurities</strong>, ensuring standardized <strong>Uniform Naval Bar Production</strong>.",
  "1_5": "Rigorous <strong>Admiralty Smith Forge Tests</strong> at Portsmouth confirmed that Cort’s <strong>Shatter-Resistant Anchors</strong> provided the Royal Navy with <strong>Complete Naval Independence</strong>.",
  "2_1": "Displacing traditional <strong>Domestic Home Handlooms</strong>, the rise of <strong>Centralised Steam Factories</strong> subjected weavers to the punishing, <strong>Relentless Machine Speed</strong> of power technology.",
  "2_2": "Working <strong>Rigid Fourteen-Hour Shifts</strong> under threat of <strong>Pence-Deduction Lateness Fines</strong>, mill hands were trapped amidst <strong>Choking Dust & Locked Doors</strong>.",
  "2_3": "Vulnerable children caught in <strong>Workhouse Apprentice Trafficking</strong> spent long hours <strong>Crawling Under Spinning Mules</strong>, suffering horrific <strong>Crushed Fingers & Hair Scalpings</strong>.",
  "2_4": "Enduring <strong>Sixteen-Hour Daily Fatigue</strong> enforced by brutal <strong>Overlooker Leather Strap Beatings</strong>, child workers like Matthew Crabtree suffered <strong>Permanent Spinal Stunting</strong>.",
  "2_5": "The 1833 Factory Act enacted a strict <strong>Ban on Children Under Nine</strong> and established <strong>Eight-Hour Workday Limits</strong> enforced by just <strong>Four Statutory Factory Inspectors</strong>.",
  "3_1": "Driven by <strong>Unregulated Speculative Building</strong>, developers packed factory families into slums with <strong>Windowless Shared Party Walls</strong> and damp, <strong>Flooded Earthen Cellars</strong>.",
  "3_2": "Severe <strong>Shared Privy Overflow</strong> and <strong>Towering Nightsoil Dunghills</strong> poisoned the water supply by leaking directly into <strong>Seeping Groundwater Wells</strong>.",
  "3_3": "Inflicting agonizing <strong>Waterborne Bacterial Agony</strong> and sudden <strong>Blue-Skinned Twelve-Hour Collapse</strong>, Asiatic cholera terrorised even <strong>Terrified Wealthy Elites</strong>.",
  "3_4": "Presenting a shocking <strong>Statistical Lifespan Comparison</strong>, Chadwick demonstrated a mere <strong>Nineteen-Year Manchester Average</strong> worker lifespan to prove the devastating <strong>Economic Cost of Epidemics</strong>.",
  "3_5": "When the 1858 <strong>Midsummer Thames Fermentation</strong> forced MPs to hang <strong>Commons Chloride Curtains</strong>, Parliament hurriedly funded <strong>Bazalgette Interceptor Tunnels</strong>.",
  "4_1": "Rebelling against catastrophic <strong>Powerloom Wage Collapses</strong>, Luddite croppers conducted <strong>Sledgehammer Midnight Raids</strong> until Parliament passed the draconian <strong>Capital Frame-Breaking Act</strong>.",
  "4_2": "When magistrate cavalry launched the <strong>Manchester Yeomanry Sabre Charge</strong> into a <strong>Peaceful St Peter’s Field Crowd</strong> at Peterloo, the government retaliated with the <strong>Repressive Tory Six Acts</strong>.",
  "4_3": "Facing <strong>Starvation Winter Destitution</strong>, agricultural labourers swept Hampshire with <strong>Sledgehammer Threshing Destruction</strong> and terrifying <strong>Nocturnal Hayrick Arson</strong>.",
  "4_4": "Convening the <strong>Winchester Great Hall Trials</strong> to punish local machine-breakers, judges ordered a tragic <strong>Micheldever Youth Execution</strong> alongside widespread <strong>Australian Penal Transportation</strong>.",
  "4_5": "Forming a peaceful <strong>Friendly Society Mutual Aid</strong> lodge, the six Tolpuddle labourers were prosecuted under an <strong>Obscure Secret Oaths Law</strong>, triggering <strong>Massive London Protest Marches</strong>.",
  "5_1": "Restricted to an <strong>Under-Five-Percent Electorate</strong> electing members from <strong>Old Sarum & Newtown Rotten Boroughs</strong>, Britain's Parliament left booming industrial centres as <strong>Unrepresented Industrial Cities</strong>.",
  "5_2": "Fueled by the violent <strong>Bristol Reform Riots & Fires</strong> and an alarming <strong>\"Days of May\" Bank Run Gold Panic</strong>, public rebellion forced the <strong>Tory House of Lords Surrender</strong> in 1832.",
  "5_3": "Although the 1832 Act enfranchised <strong>Manchester, Birmingham & Leeds MPs</strong>, its narrow <strong>Ten-Pound Property Qualification</strong> resulted in the <strong>Deliberate Working-Class Exclusion</strong>.",
  "5_4": "Demanding <strong>Universal Male Suffrage & Secret Ballot</strong> along with the <strong>Abolition of Property Requirements</strong>, Chartists presented <strong>Three Mammoth Rejected Petitions</strong> to Parliament.",
  "5_5": "Securing the <strong>Abolition of Public Hustings</strong> in 1872, the introduction of <strong>Private Booths & Liquorice Wax Seals</strong> granted British voters lasting <strong>Freedom from Landlord Eviction</strong>."
};

const cmeModels = {
  "2_1": "While thousands languished in European <strong>Displaced Persons (DP) camps</strong>, US President <strong>Harry S. Truman</strong> clashed with British Foreign Secretary <strong>Ernest Bevin</strong> over Jewish immigration quotas.",
  "2_2": "Formed to coordinate underground resistance, the <strong>United Resistance Movement</strong> (or <strong>Tenuat HaMeri</strong>) combined the military forces of the <strong>Haganah</strong> with Irgun and Lehi fighters.",
  "2_4": "In retaliation for the execution of three Irgun members, militants hanged British sergeants <strong>Clifford Martin</strong> and <strong>Mervyn Paice</strong>, sparking the national outrage of the <strong>Sergeants Affair</strong>.",
  "2_5": "Conducting clandestine immigration under <strong>Aliyah Bet</strong>, the intercepted refugee vessel <strong>SS Exodus 1947</strong> was forcibly returned to displaced camps in <strong>Germany</strong>, provoking global outcry.",
  "4_2": "Concluded in <strong>September 1955</strong>, the landmark <strong>Czech Arms Deal</strong> supplied the Egyptian armed forces with over <strong>200 MiG-15 jet fighters</strong>, tilting the regional balance of power.",
  "4_3": "When US Secretary of State <strong>John Foster Dulles</strong> abruptly cancelled financing for the <strong>Aswan High Dam</strong>, President Nasser retaliated in <strong>July 1956</strong> by nationalising the Suez Canal.",
  "5_1": "Convening in <strong>January 1964</strong>, the <strong>First Arab League Summit</strong> met in Cairo to address Israel's newly opened <strong>National Water Carrier</strong> project.",
  "5_2": "Arab states attempted the <strong>Headwaters Diversion Plan</strong> to divert the vital <strong>River Jordan headwaters</strong>, aiming to deprive Israel of roughly <strong>35%</strong> of its freshwater inflow.",
  "5_3": "Under a radical <strong>Neo-Ba'athist</strong> government including Defence Minister <strong>Hafez al-Assad</strong>, Syria sponsored militant border raids across the Golan Heights conducted by <strong>Fatah</strong>.",
  "6_5": "Led by armoured division commanders <strong>Israel Tal</strong>, <strong>Avraham Yoffe</strong>, and <strong>Ariel Sharon</strong>, Israeli forces swiftly captured the Sinai Peninsula during the Six-Day War.",
  "7_4": "Constructed along the Suez Canal, the fortified <strong>Bar-Lev Line</strong> named after Chief of Staff <strong>Haim Bar-Lev</strong> featured a massive <strong>20-metre high artificial sand rampart</strong>.",
  "7_5": "Formulated by minister <strong>Yigal Allon</strong>, the strategic <strong>Allon Plan</strong> proposed establishing military agricultural settlements known as <strong>Nahal</strong> outposts along the Jordan Valley.",
  "8_2": "Masterminded by <strong>George Habash's Popular Front for the Liberation of Palestine</strong> (the <strong>PFLP</strong>), four international airliners were hijacked simultaneously on <strong>6 September 1970</strong>.",
  "8_3": "Fearing that Palestinian guerrillas had established an armed <strong>state-within-a-state</strong>, King Hussein ordered the military into Amman on <strong>16 September 1970</strong>, igniting the civil conflict of <strong>Black September</strong>.",
  "9_2": "Pursuing independent diplomatic initiatives, President <strong>Anwar Sadat</strong> expelled 15,000 Soviet military advisers in <strong>July 1972</strong> to encourage backchannel dialogue with <strong>Henry Kissinger</strong>.",
  "9_4": "Following the massive tank battle on <strong>14 October</strong>, US President Nixon ordered <strong>Operation Nickel Grass</strong> to deliver emergency military supplies, enabling the Israeli canal crossing on <strong>15–16 October</strong>.",
  "10_1": "US Secretary of State <strong>Henry Kissinger</strong> conducted intensive <strong>Shuttle Diplomacy</strong> between Cairo and Jerusalem, culminating in the historic 1974 <strong>Sinai I Disengagement Agreement</strong>.",
  "10_2": "Following the stunning <strong>May 1977</strong> election victory of the right-wing <strong>Likud party</strong>, Prime Minister <strong>Menachem Begin</strong> welcomed Anwar Sadat to Jerusalem for historic peace negotiations.",
  "11_1": "Aiming to eradicate Palestinian guerrilla bases in southern Lebanon known as <strong>Fatahland</strong>, Israel launched <strong>Operation Litani</strong> in 1978, prompting the deployment of UN peacekeepers under <strong>UNIFIL</strong>.",
  "11_2": "While the PLO evacuated to <strong>Tunis</strong>, the assassination of Christian President-elect <strong>Bachir Gemayel</strong> led Lebanese <strong>Kataeb</strong> Christian Phalangist militiamen to enter the refugee camps.",
  "11_3": "Demonstrating public outrage, over <strong>400,000 citizens</strong> rallied in Tel Aviv demanding the official <strong>Kahan Commission of Inquiry</strong>, while Israeli occupation in the south catalyzed the rise of <strong>Hezbollah</strong>.",
  "11_4": "Coordinating grassroots protests through the <strong>Unified National Leadership of the Uprising</strong> (the <strong>UNLU</strong>), activists resisted the 'iron fist' containment policy enforced by Defence Minister <strong>Yitzhak Rabin</strong>.",
  "11_5": "Meeting in Algiers in <strong>November 1988</strong>, the PNC issued the historic <strong>Declaration of Independence of the State of Palestine</strong> before Yasser Arafat addressed the UN on <strong>13 December 1988</strong>.",
  "12_1": "Accelerated by the <strong>collapse of the Soviet Union</strong> and the defeat of <strong>Saddam Hussein</strong> in the <strong>1990–1991 Gulf War</strong>, world powers convened the October 1991 Madrid Peace Conference.",
  "12_5": "Amidst waves of deadly suicide bus bombings by <strong>Hamas and Palestinian Islamic Jihad</strong> and fierce right-wing opposition led by <strong>Benjamin Netanyahu</strong>, Yitzhak Rabin was assassinated on <strong>4 November 1995</strong>."
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

applyModels('industrialisation_and_empire.json', 'industrialisation_and_empire', indModels);
applyModels('cme_new.json', 'cme_new', cmeModels);

