const fs = require('fs');

const lessonsData = [
  // Lesson 1: Engines of Empire: Mercantilism, Naval Hegemony & Portsmouth Dockyard
  [
    // B1: ["Raw Sugar and Cotton", "Armed Merchant Fleets", "Piles of Gold Coins"]
    '<p class="prose-p"><span class="para-ref">[1.1]</span> During the eighteenth and nineteenth centuries, Great Britain constructed its imperial power on a mercantilist economic system. British Navigation Acts legally compelled Caribbean and American colonies to export valuable raw sugar and cotton exclusively to British ports aboard British-built ships.</p><p class="prose-p">Safeguarded across oceans by armed merchant fleets, domestic manufacturers transformed these cheap raw materials into valuable industrial exports. By restricting colonial trade, British merchants and financiers accumulated towering piles of gold coins, cementing Britain\'s global commercial dominance.</p>',

    // B2: ["Twenty-Seven Battleships", "Smashing Enemy Flagships", "Controlling Global Sea Lanes"]
    '<p class="prose-p"><span class="para-ref">[1.2]</span> On 21 October 1805, Admiral Lord Nelson secured Britain’s complete naval supremacy off Cape Trafalgar. Commanding twenty-seven battleships against thirty-three allied French and Spanish warships, Nelson boldly divided his fleet into two attacking columns to pierce the enemy line.</p><p class="prose-p">Nelson\'s aggressive battle tactics succeeded by smashing enemy flagships at point-blank range with pulverising broadsides. Following the battle, the Royal Navy reigned supreme, controlling global sea lanes and safeguarding worldwide merchant shipping routes from foreign interference for over a century.</p>',

    // B3: ["Ten Thousand Dockyard Smiths", "Steam Wooden Block Mills", "Forging Iron Anchors"]
    '<p class="prose-p"><span class="para-ref">[1.3]</span> The vital heartbeat of British naval power was Portsmouth Royal Dockyard, the largest industrial manufacturing complex on earth. More than ten thousand dockyard smiths, shipwrights, caulkers, and carpenters worked day and night to build, repair, and maintain the Royal Navy’s mighty battle fleets.</p><p class="prose-p">In 1803, Marc Brunel installed revolutionary steam wooden block mills, pioneering the world’s first mass-production assembly line. Nearby dockyard forges echoed continuously, forging iron anchors, copper sheathing, and giant naval cannons to equip Britain\'s armada.</p>',

    // B4: ["Four-Inch Iron Armour Plates", "Twin Steam Engines", "Bouncing Cannon Shells"]
    '<p class="prose-p"><span class="para-ref">[1.4]</span> In 1860, Great Britain launched HMS Warrior in response to French naval innovations, igniting a revolutionary transformation in warship design. Warrior abandoned traditional wooden construction in favour of revolutionary four-inch iron armour plates backed by eighteen inches of solid teak wood.</p><p class="prose-p">Propelled by massive twin steam engines alongside towering sails, Warrior made every traditional wooden battleship obsolete overnight. During live firing trials, Warrior proved virtually indestructible, bouncing cannon shells off its sides and deterring foreign naval rivals.</p>',

    // B5: ["Naval Defence Act Law", "Matching Two Foreign Fleets", "Dozens of New Battleships"]
    '<p class="prose-p"><span class="para-ref">[1.5]</span> By the late nineteenth century, emerging industrial competitors Germany, France, and Russia challenged Britain’s supremacy at sea. In 1889, Parliament passed the decisive Naval Defence Act law, officially establishing the famous Two-Power Standard as official government policy.</p><p class="prose-p">The legislation required the Royal Navy to maintain fighting naval power matching two foreign fleets combined. Supported by a massive £21.5 million budget, Portsmouth dockyards constructed dozens of new battleships, guaranteeing British control over global maritime empire.</p>'
  ],

  // Lesson 2: The De-industrialisation of India: The Company & Handloom Crisis
  [
    // B1: ["Quarter of World Output", "Fine Village Handloom Silk", "Paying in Silver Ingots"]
    '<p class="prose-p"><span class="para-ref">[2.1]</span> Throughout the seventeenth century, Mughal India was the undisputed textile manufacturing workshop of the globe, producing over a quarter of world output. Across flourishing villages in Bengal and Gujarat, millions of skilled artisanal weavers created exquisite fine village handloom silk, calicoes, and muslin cloths.</p><p class="prose-p">European merchant trading corporations competed aggressively for these luxury fabrics, paying in silver ingots and gold bullion. This continuous influx of precious metals enriched Indian banking dynasties and sustained vibrant regional urban economies.</p>',

    // B2: ["Protesting English Weavers", "Banning Printed Cotton Cloth", "Protecting Home Wool Sales"]
    '<p class="prose-p"><span class="para-ref">[2.2]</span> As comfortable, colourful Indian cottons flooded the English market, domestic textile manufacturers grew alarmed. In London, angry mobs of protesting English weavers rioted outside the Houses of Parliament, threatening royal officials and throwing acid onto women wearing Indian calico dresses.</p><p class="prose-p">Parliament succumbed to pressure by passing the protectionist 1700 and 1721 Calico Acts, banning printed cotton cloth from being imported, sold, or worn in Britain. This statutory ban safeguarded domestic manufactures, protecting home wool sales from Asian competition.</p>',

    // B3: ["Collecting Peasant Crop Taxes", "Buying Silk with Local Taxes", "Halting Silver Shipments"]
    '<p class="prose-p"><span class="para-ref">[2.3]</span> The British military triumph in Bengal following the 1765 Treaty of Allahabad transformed Company commerce forever. Defeated Mughal Emperor Shah Alam II granted the Company the Diwani, granting British merchants the sovereign power of collecting peasant crop taxes across twenty million inhabitants.</p><p class="prose-p">Company factors no longer imported European bullion, instead buying silk with local taxes wrung straight from Bengali cultivators. Halting silver shipments saved British directors vast sums, initiating a devastating drain of wealth from India directly to London.</p>',

    // B4: ["Lancashire Factory Mills", "Seventy Percent Border Tax", "Flooding Bazaars with Cheap Cotton"]
    '<p class="prose-p"><span class="para-ref">[2.4]</span> The invention of steam-powered textile machinery in Britain inverted historic global trade flows. High-speed Lancashire factory mills produced millions of yards of cheap machine-spun cloth. To destroy Asian competition, the British government slapped a seventy percent border tax on imported Indian cottons.</p><p class="prose-p">Simultaneously, British industrial textiles entered Indian ports virtually tariff-free, flooding bazaars with cheap cotton cloth. Machine production systematically undercut local spinners and handloom weavers, devastating a centuries-old artisanal economy across Indian provinces.</p>',

    // B5: ["Dhaka Loom City Deserted", "Starving Handloom Families", "Forced into Farm Labour"]
    '<p class="prose-p"><span class="para-ref">[2.5]</span> Within decades, Britain’s unequal tariff regime and commercial dominance caused catastrophic de-industrialisation across the subcontinent. Once-bustling textile centres like Dhaka saw their famous loom city deserted as weaving workshops shut down and handloom exports collapsed under industrial competition.</p><p class="prose-p">Deprived of their traditional livelihood, hundreds of thousands of starving handloom families were forced into farm labour as impoverished agricultural peasants. In 1834, Governor-General William Bentinck observed that the bones of the cotton weavers were bleaching the plains of India.</p>'
  ],

  // Lesson 3: The 1857 Indian Rebellion: Sepoy Grievance, Rani Lakshmibai & The Raj
  [
    // B1: ["Seizing Heirless Kingdoms", "Satara, Nagpur, Jhansi", "Annexing Wealthy Awadh"]
    '<p class="prose-p"><span class="para-ref">[3.1]</span> By the 1850s, Indian resentment against aggressive East India Company rule had reached boiling point. Governor-General Lord Dalhousie introduced the controversial Doctrine of Lapse, seizing heirless kingdoms whenever a native Hindu prince died without an acknowledged biological male heir.</p><p class="prose-p">The Company annexed proud princely territories including Satara, Nagpur, Jhansi, disinheriting adopted heirs. Popular outrage peaked in 1856 when Dalhousie deposed the local Nawab by annexing wealthy Awadh, outraging thousands of aristocratic families and royal sepoy regiments.</p>',

    // B2: ["Greased Enfield Cartridges", "Biting Cow and Pig Fat", "Fear of Forced Conversion"]
    '<p class="prose-p"><span class="para-ref">[3.2]</span> In early 1857, the British military command issued the newly designed Pattern 1853 Enfield rifle to Indian soldiers. Loading the weapon required biting open greased paper tubes coated in animal grease to release the powder charge, provoking widespread religious alarm.</p><p class="prose-p">Rumours spread rapidly that sepoys were biting cow and pig fat, desecrating religious laws for Hindus who revere the sacred cow, and Muslims who abhor pork. This provoked profound fear of forced conversion to Christianity, convincing soldiers that the British intended to destroy their caste.</p>',

    // B3: ["Breaking Open Jail Cells", "Aged Emperor Bahadur Shah", "Hindu and Muslim Unity"]
    '<p class="prose-p"><span class="para-ref">[3.3]</span> On 10 May 1857, sepoys at the Meerut military garrison revolted after eighty-five comrades were sentenced to hard labour for refusing the ammunition. After breaking open jail cells and killing their British officers, the mutinous soldiers marched through the night to Delhi.</p><p class="prose-p">Reaching the historic Mughal capital, the sepoys persuaded aged Emperor Bahadur Shah II to lead their rebellion. The uprising fostered remarkable Hindu and Muslim unity, uniting peasants, landowners, and royal soldiers in an armed struggle to overthrow British rule.</p>',

    // B4: ["Riding Battle Horseback", "Swinging Curved Talwar Sword", "Killed in Action at Gwalior"]
    '<p class="prose-p"><span class="para-ref">[3.4]</span> In central India, twenty-two-year-old Rani Lakshmibai of Jhansi emerged as the most courageous military leader of the uprising after the British annexed her principality. When British forces breached Jhansi’s fortress walls, the warrior queen escaped at midnight, riding battle horseback with her young adopted child strapped to her back.</p><p class="prose-p">Rani Lakshmibai rallied rebel cavalry, swinging curved talwar sword in ferocious front-line combat against British infantry. In June 1858, she was killed in action at Gwalior, earning the lasting admiration of her British opponents as a brilliant military strategist.</p>',

    // B5: ["Dissolving Company Rule", "Viceroy Direct Crown Command", "Queen Victoria Proclamation"]
    '<p class="prose-p"><span class="para-ref">[3.5]</span> Following the brutal suppression of the rebellion, Parliament passed the historic Government of India Act 1858, dissolving Company rule and ending commercial control over India forever. Sovereign authority was transferred directly to the Crown, governed in India through a royal Viceroy direct Crown command.</p><p class="prose-p">The famous Queen Victoria proclamation promised religious toleration and fair treatment under British imperial law. However, the new British Raj deepened racial segregation, ruling India through authoritarian military force and maintaining strict racial superiority.</p>'
  ],

  // Lesson 4: The Scramble for Africa & Imperial Ideology: Maxim Guns & Plunder
  [
    // B1: ["Chancellor Otto von Bismarck", "Drawing Lines Across Maps", "Zero Africans Invited"]
    '<p class="prose-p"><span class="para-ref">[4.1]</span> In November 1884, representatives from fourteen Western imperial nations gathered in Berlin to carve up the African continent without triggering war between themselves. Convened by German Chancellor Otto von Bismarck, the diplomatic delegates sat around large tables negotiating imperial territorial claims.</p><p class="prose-p">European diplomats partitioned ancient kingdoms by drawing lines across maps, dividing linguistic communities and trading corridors with artificial geometric borders. Tellingly, zero Africans invited were allowed to participate in decisions determining the sovereign fate of their homelands.</p>',

    // B2: ["Building Coastal Forts", "Marching Troops into Interior", "Planting National Flags"]
    '<p class="prose-p"><span class="para-ref">[4.2]</span> The Berlin Conference established the Principle of Effective Occupation to govern imperial land claims. Under this doctrine, European governments could no longer claim vast African territories merely by building coastal forts or establishing minor coastal trading settlements.</p><p class="prose-p">Instead, empires had to demonstrate physical control by marching troops into interior regions, establishing fortified administrative posts, and planting national flags over tribal kingdoms. This rule unleashed a ruthless armed race between European powers to conquer the African interior.</p>',

    // B3: ["Six Hundred Rounds per Minute", "Bitter Bark Fever Medicine", "Ten Thousand Dead at Omdurman"]
    '<p class="prose-p"><span class="para-ref">[4.3]</span> European conquest of Africa was made possible by revolutionary technological advances. Quinine, an anti-malarial bitter bark fever medicine derived from South American cinchona trees, allowed European explorers and colonial troops to survive deadly tropical fevers in deep rainforests.</p><p class="prose-p">Militarily, the invention of the Hiram Maxim machine gun produced devastating technological inequality on the battlefield. Firing six hundred rounds per minute, Maxim machine guns slaughtered traditional African armies, leaving ten thousand dead at Omdurman during Kitchener’s 1898 invasion of Sudan.</p>',

    // B4: ["Poem in The Times", "Claiming Selfless Duty", "Racist Slur Half-Devil"]
    '<p class="prose-p"><span class="para-ref">[4.4]</span> Imperial conquest was underpinned by pervasive racial propaganda. In February 1899, author Rudyard Kipling published an influential poem in The Times titled "The White Man\'s Burden", urging the United States and Britain to conquer non-white populations overseas.</p><p class="prose-p">Kipling justified imperial violence by claiming selfless duty and moral mission, while openly dehumanising colonized peoples using the racist slur half-devil and half-child. This paternalistic ideology masked brutal economic plunder beneath the noble language of Christian civilization.</p>',

    // B5: ["Stealing Rubber and Palm Oil", "Severed Hands in Congo", "Enriching European Tycoons"]
    '<p class="prose-p"><span class="para-ref">[4.5]</span> Behind civilizing rhetoric lay unvarnished economic exploitation. European colonial authorities seized vast territories, stealing rubber and palm oil, copper, diamonds, and ivory from indigenous African populations through forced labour and confiscatory taxes.</p><p class="prose-p">In King Leopold II’s Congo Free State, failure to fulfill severe rubber quotas led to hostage taking, village burnings, and severed hands in Congo. This state-backed terror operated primarily for enriching European tycoons while causing the premature deaths of an estimated ten million Congolese people.</p>'
  ],

  // Lesson 5: The Imperial Verdict: Workshop of the World or Age of Exploitation?
  [
    // B1: ["Glass and Iron Crystal Palace", "Six Million Ticket Holders", "Looted Koh-i-Noor Diamond"]
    '<p class="prose-p"><span class="para-ref">[5.1]</span> In May 1851, Queen Victoria inaugurated the Great Exhibition in London’s Hyde Park. Housed within Joseph Paxton’s magnificent glass and iron Crystal Palace, the grand spectacle celebrated Britain’s self-proclaimed status as the triumphant "Workshop of the World".</p><p class="prose-p">Over six million ticket holders marvelled at cutting-edge steam engines, electric telegraphs, and imperial manufactured commodities. Central to the Indian pavilion was the looted Koh-i-Noor diamond confiscated from child Maharaja Duleep Singh, symbolising Britain\'s unchallenged imperial subjugation.</p>',

    // B2: ["Twenty-Five Thousand Rail Miles", "Digging River Canals", "Electric Telegraph Wires"]
    '<p class="prose-p"><span class="para-ref">[5.2]</span> Proponents of the British Empire highlighted extensive modernization projects across colonized territories. In India, British colonial engineers constructed over twenty-five thousand rail miles, integrating distant regional markets and transforming transportation networks across the subcontinent.</p><p class="prose-p">Authorities simultaneously invested in digging river canals for irrigation and stringing thousands of miles of electric telegraph wires. While these networks modernised transport, they were designed primarily to extract agricultural commodities and deploy military regiments rapidly to suppress domestic unrest.</p>',

    // B3: ["Viceroy Lytton Market Dogma", "Hard Labour Relief Camps", "Ten Million Starved to Death"]
    '<p class="prose-p"><span class="para-ref">[5.3]</span> The catastrophic human costs of British rule were starkly revealed during the Great Famines of the late nineteenth century. When monsoon rains failed, Viceroy Lytton market dogma refused to ban food exports or cap wheat prices, fanatically enforcing strict free-market economic theory.</p><p class="prose-p">Desperate peasants seeking government food aid were forced into punitive hard labour relief camps receiving starvation rations. Consequently, an estimated ten million starved to death across India, even as record grain exports flowed directly to Britain.</p>',

    // B4: ["London Book on Poverty", "Millions Siphoned in Tax Money", "First Indian Westminster MP"]
    '<p class="prose-p"><span class="para-ref">[5.4]</span> Indian scholars mounted devastating intellectual challenges against British economic policy. In 1867, Dadabhai Naoroji pioneered the "Drain of Wealth" theory, subsequently publishing a landmark London book on poverty detailing systemic imperial exploitation of Indian resources.</p><p class="prose-p">Naoroji demonstrated how millions siphoned in tax money were transferred directly to Britain to fund imperial wars and official pensions without return. Elected as the first Indian Westminster MP in 1892, Naoroji used Parliament to demand Indian self-determination and political equality.</p>',

    // B5: ["Global Free Trade and Laws", "Crushing Local Industries", "Clashing Moral Judgments"]
    '<p class="prose-p"><span class="para-ref">[5.5]</span> Modern historians remain deeply polarised over the historical legacy of the British Empire. Historian Niall Ferguson contends the Empire fostered global development by promoting parliamentary democracy, global free trade and laws, English common law, and international communications networks.</p><p class="prose-p">In stark contrast, Shashi Tharoor argues British colonial rule de-industrialised prosperous nations by crushing local industries, extracting taxation, and causing catastrophic famines. These clashing moral judgments reflect profound ongoing debate over the human cost of British imperialism.</p>'
  ]
];

// Check word counts and paragraphs
console.log('=== WORD COUNT & PARAGRAPH AUDIT FOR SECOND BRITISH EMPIRE ===');
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
const wbPath = path.join(ROOT_DIR, 'scripts', 'render_second_british_empire_workbook.cjs');
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
