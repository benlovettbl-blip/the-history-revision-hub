const fs = require('fs');

const lessonsData = [
  // Lesson 1: What powered the Industrial Revolution, and how did a Fareham ironmaster change the world?
  [
    // B1: ["Deforestation of English Oaks", "Brittle Impure Pig Iron", "Dependence on Swedish Imports"]
    '<p class="prose-p"><span class="para-ref">[1.1]</span> In the mid-eighteenth century, Great Britain confronted an acute metallurgical bottleneck that threatened its economic expansion. Smelting iron required immense quantities of timber charcoal, causing devastating deforestation of English oaks and stripping the realm\'s ancient woodlands.</p><p class="prose-p">Early coal-fired blast furnaces produced brittle impure pig iron saturated with carbon and sulphur, which fractured under pressure. Consequently, Britain suffered costly dependence on Swedish imports of refined bar iron to supply naval anchors and weapons for the Royal Navy.</p>',

    // B2: ["Separate Condenser Efficiency", "Rotary Shaft Motion", "Liberation from River Valleys"]
    '<p class="prose-p"><span class="para-ref">[1.2]</span> The nation\'s industrial energy crisis was overcome by Scottish inventor James Watt. In 1769, Watt patented an ingenious separate condenser efficiency enhancement that drastically slashed the fuel consumption of Thomas Newcomen’s earlier atmospheric steam engines.</p><p class="prose-p">Partnering with Birmingham entrepreneur Matthew Boulton at the Soho Manufactory, Watt adapted his engine to produce smooth rotary shaft motion. This mechanical triumph allowed factories to drive machinery continuously in any location, achieving complete liberation from river valleys and unreliable waterwheels.</p>',

    // B3: ["Reverberatory Furnace Chamber", "Stirring Molten Decarburisation", "Eliminating Harmful Sulphur"]
    '<p class="prose-p"><span class="para-ref">[1.3]</span> In 1775, Fareham ironmaster Henry Cort leased an iron mill at Funtley in Hampshire to conquer the metallurgical crisis. Cort engineered an innovative reverberatory furnace chamber that separated burning coal fuel from the molten pig iron charge, preventing chemical contamination.</p><p class="prose-p">By stirring molten decarburisation puddles with long iron bars, puddlers exposed the metal to air, burning away excess carbon while eliminating harmful sulphur impurities. Cort’s breakthrough converted cheap British pig iron into malleable, high-grade wrought iron.</p>',

    // B4: ["Mechanical Grooved Cylinders", "Squeezing Out Slag Impurities", "Uniform Naval Bar Production"]
    '<p class="prose-p"><span class="para-ref">[1.4]</span> In 1783, Cort patented a second revolutionary breakthrough: replacing slow, labour-intensive trip-hammers with steam-driven mechanical grooved cylinders. Passing red-hot puddled iron through these heavy rollers accelerated processing speeds fifteen-fold compared to traditional forge hammering.</p><p class="prose-p">The tremendous rolling pressure compressed the metal, squeezing out slag impurities while shaping hot iron into standardized dimensions. Cort’s mechanized innovation established rapid, uniform naval bar production, supplying structural iron and bolts directly to the Royal Navy at Portsmouth Dockyard.</p>',

    // B5: ["Admiralty Smith Forge Tests", "Shatter-Resistant Anchors", "Complete Naval Independence"]
    '<p class="prose-p"><span class="para-ref">[1.5]</span> In 1787, the Royal Navy subjected Cort’s Funtley iron to exhaustive Admiralty smith forge tests at Portsmouth Dockyard. Master naval blacksmiths twisted, bent, and hammered the iron bars under heavy drop-forges, proving they were tougher and more resilient than expensive Swedish imports.</p><p class="prose-p">Blacksmiths forged massive, shatter-resistant anchors and hull fittings capable of withstanding ferocious ocean gales. Cort’s Hampshire invention granted Great Britain complete naval independence, supplying the indestructible iron fabric that forged the Victorian Empire.</p>'
  ],

  // Lesson 2: Was industrial work progress or punishment?
  [
    // B1: ["Domestic Home Handlooms", "Centralised Steam Factories", "Relentless Machine Speed"]
    '<p class="prose-p"><span class="para-ref">[2.1]</span> The Industrial Revolution permanently reshaped how ordinary Britons lived, worked, and survived. For generations, textile production was organized around domestic home handlooms in rural cottages, where independent weaving families controlled their own daily hours and working rhythms.</p><p class="prose-p">Steam power rapidly replaced family cottages with centralised steam factories housing hundreds of powerlooms. Factory operatives surrendered their customary independence to relentless machine speed, forced to subordinate their bodies to the tireless, unbroken pace of steam engines from sunrise to sunset.</p>',

    // B2: ["Rigid Fourteen-Hour Shifts", "Pence-Deduction Lateness Fines", "Choking Dust & Locked Doors"]
    '<p class="prose-p"><span class="para-ref">[2.2]</span> Inside the new textile mills, manufacturers instituted harsh industrial discipline dictated strictly by the factory clock. Mill hands endured rigid fourteen-hour shifts in sweltering temperatures exceeding eighty degrees Fahrenheit to prevent delicate cotton threads from snapping.</p><p class="prose-p">Overseers imposed severe pence-deduction lateness fines, docking wages for arriving minutes late or daring to sit down. Inhaling choking dust & locked doors trapped workers inside hazardous workrooms, leaving thousands of operatives suffering from chronic respiratory illness and byssinosis.</p>',

    // B3: ["Workhouse Apprentice Trafficking", "Crawling Under Spinning Mules", "Crushed Fingers & Hair Scalpings"]
    '<p class="prose-p"><span class="para-ref">[2.3]</span> Mill owners relied heavily on vulnerable child labour to maximize commercial factory profits. Poor Law parish authorities engaged in systemic workhouse apprentice trafficking, transporting destitute orphans from southern workhouses to northern mills as indentured factory hands without parental protection.</p><p class="prose-p">Employed as scavengers, tiny children spent long shifts crawling under spinning mules to gather loose cotton beneath moving machinery. Catastrophic factory injuries were routine, resulting in crushed fingers & hair scalpings beneath heavy, unguarded iron gears and belts.</p>',

    // B4: ["Sixteen-Hour Daily Fatigue", "Overlooker Leather Strap Beatings", "Permanent Spinal Stunting"]
    '<p class="prose-p"><span class="para-ref">[2.4]</span> In 1832, parliamentary investigations laid bare the terrifying physical toll of industrial employment on young children. Former child operative Matthew Crabtree testified before Michael Sadler’s parliamentary committee, recounting his sixteen-hour daily fatigue in Yorkshire textile mills from eight years old.</p><p class="prose-p">Crabtree described brutal overlooker leather strap beatings administered to exhausted children who slowed down. Constant physical strain produced permanent spinal stunting, bowed legs, and lifelong bodily deformities across entire generations of British factory workers.</p>',

    // B5: ["Ban on Children Under Nine", "Eight-Hour Workday Limits", "Four Statutory Factory Inspectors"]
    '<p class="prose-p"><span class="para-ref">[2.5]</span> Damning parliamentary evidence compelled Lord Ashley, Earl of Shaftesbury, to lead an urgent moral campaign for factory reform. In 1833, Parliament enacted the landmark Factory Act, establishing a statutory ban on children under nine in textile mills.</p><p class="prose-p">The legislation enforced eight-hour workday limits for children aged nine to thirteen alongside mandatory daily schooling. Crucially, Parliament appointed four statutory factory inspectors to enforce compliance, establishing the legal principle of state regulation over private industrial capitalism.</p>'
  ],

  // Lesson 3: Did industrialisation make British towns unlivable?
  [
    // B1: ["Unregulated Speculative Building", "Windowless Shared Party Walls", "Flooded Earthen Cellars"]
    '<p class="prose-p"><span class="para-ref">[3.1]</span> Between 1800 and 1850, explosive urban migration completely overwhelmed Britain\'s northern industrial towns. Millions of rural families flooded into Manchester, Leeds, and Sheffield seeking factory employment, sparking an unchecked boom in unregulated speculative building by private landlords.</p><p class="prose-p">Greedy builders packed rows of back-to-back dwellings along narrow, sunless courts, featuring windowless shared party walls that prevented ventilation. The poorest families rented damp, flooded earthen cellars beneath street level, where contaminated sewage seeped directly through porous brick walls.</p>',

    // B2: ["Shared Privy Overflow", "Towering Nightsoil Dunghills", "Seeping Groundwater Wells"]
    '<p class="prose-p"><span class="para-ref">[3.2]</span> Rapid urban growth completely outstripped primitive municipal sanitation arrangements across industrial towns. Dozens of families shared a single overflowing outdoor earth closet, resulting in disgusting shared privy overflow across communal alleyways and public courtyards where children played.</p><p class="prose-p">Human waste accumulated into towering nightsoil dunghills that festered beside front doors for months before disposal. Heavy rain washed waste deep into the earth, seeping groundwater wells from which local residents drew their daily drinking and cooking water.</p>',

    // B3: ["Waterborne Bacterial Agony", "Blue-Skinned Twelve-Hour Collapse", "Terrified Wealthy Elites"]
    '<p class="prose-p"><span class="para-ref">[3.3]</span> In 1831, Asiatic cholera invaded Britain, unleashing terrifying epidemic destruction upon vulnerable urban populations. The disease spread invisibly through contaminated town pumps, inflicting excruciating waterborne bacterial agony upon densely populated working-class neighbourhoods.</p><p class="prose-p">Victims suffered violent vomiting, painful cramps, and severe dehydration, leading to blue-skinned twelve-hour collapse and rapid death. Because the terrifying infection struck affluent districts as well as slums, terrified wealthy elites abandoned laissez-faire dogmas, demanding sweeping government sanitary intervention to avert social disaster.</p>',

    // B4: ["Statistical Lifespan Comparison", "Nineteen-Year Manchester Average", "Economic Cost of Epidemics"]
    '<p class="prose-p"><span class="para-ref">[3.4]</span> In 1842, pioneering civil servant Edwin Chadwick published his landmark Sanitary Report on the condition of the labouring population. Chadwick utilized meticulous statistical lifespan comparison charts and medical evidence to shock the Victorian governing class into action.</p><p class="prose-p">His data revealed a horrifying nineteen-year Manchester average life expectancy for working-class labourers, compared to thirty-eight years in rural Rutland. Chadwick underscored the immense economic cost of epidemics on ratepayers, arguing that clean municipal water would save national wealth and prevent poverty.</p>',

    // B5: ["Midsummer Thames Fermentation", "Commons Chloride Curtains", "Bazalgette Interceptor Tunnels"]
    '<p class="prose-p"><span class="para-ref">[3.5]</span> In July 1858, an intense heatwave brought London to a standstill during the infamous "Great Stink". Unprocessed sewage produced noxious midsummer Thames fermentation, turning the River Thames into a bubbling, pestilent open sewer.</p><p class="prose-p">Fearing deadly disease, MPs in Parliament soaked their Commons chloride curtains in disinfectant to dull the suffocating stench. Parliament rapidly authorized Joseph Bazalgette’s engineering masterpiece: constructing eighty-two miles of brick Bazalgette interceptor tunnels that redirected London’s effluent eastward, permanently eradicating urban cholera.</p>'
  ],

  // Lesson 4: How did ordinary people fight for a voice?
  [
    // B1: ["Powerloom Wage Collapses", "Sledgehammer Midnight Raids", "Capital Frame-Breaking Act"]
    '<p class="prose-p"><span class="para-ref">[4.1]</span> Between 1811 and 1816, skilled textile craftsmen across northern England took up arms against mechanisation. The uncontrolled spread of industrial steam looms caused disastrous powerloom wage collapses, reducing skilled domestic weavers to destitution and starvation.</p><p class="prose-p">Organizing under the mythical name "General Ned Ludd", workers launched disciplined sledgehammer midnight raids to smash weaving frames. Terrified of armed insurrection, Parliament enacted the 1812 capital Frame-Breaking Act, making machine breaking a hanging offence and stationing twelve thousand soldiers in industrial towns.</p>',

    // B2: ["Peaceful St Peter’s Field Crowd", "Manchester Yeomanry Sabre Charge", "Repressive Tory Six Acts"]
    '<p class="prose-p"><span class="para-ref">[4.2]</span> On 16 August 1819, sixty thousand working-class men, women, and children assembled at St Peter’s Field in Manchester. Dressed in their Sunday best, the peaceful St Peter’s Field crowd gathered to demand parliamentary representation, lower food prices, and political liberty.</p><p class="prose-p">Panicked magistrates unleashed a drunken Manchester Yeomanry sabre charge into the defenceless gathering, killing eighteen and injuring over six hundred. Defending the massacre, the government passed the repressive Tory Six Acts, outlawing political assemblies and taxing radical publications.</p>',

    // B3: ["Starvation Winter Destitution", "Sledgehammer Threshing Destruction", "Nocturnal Hayrick Arson"]
    '<p class="prose-p"><span class="para-ref">[4.3]</span> In the autumn of 1830, agricultural uprising swept across southern England. Enclosure of common lands, plummeting wages, and mechanised threshing machines left impoverished farm labourers confronting severe starvation winter destitution and food shortages.</p><p class="prose-p">Rallying behind threatening letters signed by "Captain Swing", farmworkers carried out systematic sledgehammer threshing destruction across Hampshire and Berkshire estates. Angry labourers set fire to landlords’ crops through nocturnal hayrick arson, demanding a living wage of two shillings a day to feed their families.</p>',

    // B4: ["Winchester Great Hall Trials", "Micheldever Youth Execution", "Australian Penal Transportation"]
    '<p class="prose-p"><span class="para-ref">[4.4]</span> The British government responded to the Swing Riots with unsparing judicial vengeance. In December 1830, Special Assize judges conducted dramatic Winchester Great Hall trials, prosecuting three hundred Hampshire agricultural workers for riot, machine breaking, and arson.</p><p class="prose-p">The judges carried out the public Micheldever youth execution of nineteen-year-old labourer Henry Cook for striking a local magistrate. Furthermore, over four hundred convicted farm hands were sentenced to Australian penal transportation, shattering rural radicalism through terrifying state retribution.</p>',

    // B5: ["Friendly Society Mutual Aid", "Obscure Secret Oaths Law", "Massive London Protest Marches"]
    '<p class="prose-p"><span class="para-ref">[4.5]</span> In 1834, six agricultural labourers in Tolpuddle, Dorset, formed a friendly society mutual aid union to resist crippling farm wage cuts. Threatening to blacklist union members, local landowners and magistrates plotted to destroy their organization.</p><p class="prose-p">Authorities prosecuted the six leaders under an obscure secret oaths law dating from naval mutinies, sentencing them to seven years\' penal exile. The conviction sparked massive London protest marches, mobilizing over one hundred thousand trade unionists and forcing the Crown to pardon the men in 1836.</p>'
  ],

  // Lesson 5: How did the road to democracy expand?
  [
    // B1: ["Under-Five-Percent Electorate", "Old Sarum & Newtown Rotten Boroughs", "Unrepresented Industrial Cities"]
    '<p class="prose-p"><span class="para-ref">[5.1]</span> In 1830, Britain’s parliamentary franchise was deeply corrupt, unrepresentative, and undemocratic. Wealthy aristocratic landowners maintained absolute control over Parliament through an exclusive under-five-percent electorate restricted to rich male property owners.</p><p class="prose-p">Deserted medieval sites like Old Sarum & Newtown rotten boroughs sent two MPs to Westminster with virtually zero resident voters. In stark contrast, massive unrepresented industrial cities such as Manchester, Birmingham, and Leeds had no parliamentary representation whatsoever, denying millions of urban citizens a political voice.</p>',

    // B2: ["Bristol Reform Riots & Fires", "Days of May Bank Run Gold Panic", "Tory House of Lords Surrender"]
    '<p class="prose-p"><span class="para-ref">[5.2]</span> When the Tory House of Lords rejected the Whig government\'s Reform Bill in October 1831, revolutionary unrest erupted nationwide. Rioting crowds set off the destructive Bristol reform riots & fires, burning the Bishop’s Palace and releasing imprisoned radicals.</p><p class="prose-p">In May 1832, political unions organized nationwide financial boycotts under the slogan "Stop the Duke, go for gold", triggering a "Days of May" bank run gold panic. Facing financial collapse, the Tory House of Lords surrender allowed the landmark reform measure to pass.</p>',

    // B3: ["Manchester, Birmingham & Leeds MPs", "Ten-Pound Property Qualification", "Deliberate Working-Class Exclusion"]
    '<p class="prose-p"><span class="para-ref">[5.3]</span> The 1832 Great Reform Act redistributed parliamentary seats, disenfranchising fifty-six corrupt rotten boroughs. The statute granted long-delayed political representation to industrial manufacturing hubs, creating new Manchester, Birmingham & Leeds MPs in the House of Commons.</p><p class="prose-p">However, the franchise remained restricted by a strict ten-pound property qualification for borough householders. This measure entrenched deliberate working-class exclusion, giving votes to middle-class factory masters while denying the ballot to the working-class labourers who generated Britain’s industrial wealth.</p>',

    // B4: ["Universal Male Suffrage & Secret Ballot", "Abolition of Property Requirements", "Three Mammoth Rejected Petitions"]
    '<p class="prose-p"><span class="para-ref">[5.4]</span> Feeling betrayed by the 1832 settlement, working-class leaders published the People’s Charter in 1838. Chartists mobilized millions behind six radical democratic demands, including universal male suffrage & secret ballot, annual parliaments, and salaries for MPs.</p><p class="prose-p">Chartists campaigned for the abolition of property requirements for MPs so ordinary working men could stand for election. Between 1839 and 1848, Chartists delivered three mammoth rejected petitions bearing millions of signatures to Westminster, keeping democratic reform at the forefront of national politics.</p>',

    // B5: ["Abolition of Public Hustings", "Private Booths & Liquorice Wax Seals", "Freedom from Landlord Eviction"]
    '<p class="prose-p"><span class="para-ref">[5.5]</span> In nineteenth-century Britain, parliamentary voting took place openly on wooden platforms, exposing voters to intimidation and employer bribery. In 1872, Gladstone’s government passed the Ballot Act, mandating the statutory abolition of public hustings across the realm.</p><p class="prose-p">The legislation introduced private booths & liquorice wax seals on ballot boxes to guarantee total voter privacy. Secret voting gave tenant farmers and factory hands freedom from landlord eviction and dismissal, permanently transforming British parliamentary elections into a modern, independent democratic process.</p>'
  ]
];

// Check word counts and paragraphs
console.log('=== WORD COUNT & PARAGRAPH AUDIT FOR INDUSTRIALISATION ===');
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
const wbPath = path.join(ROOT_DIR, 'scripts', 'render_industrialisation_workbook.cjs');
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
