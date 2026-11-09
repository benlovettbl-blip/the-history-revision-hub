const fs = require('fs');

const lessonsData = [
  // Lesson 1: German Unification, Franco-Prussian War & Bismarck (1871–1890)
  [
    // B1: ["39 Separate German States", "Bismarck’s Blood & Iron Speech", "Deadly Krupp Steel Guns"]
    '<p class="prose-p"><span class="para-ref">[1.1]</span> In the mid-nineteenth century, Central Europe was fragmented into 39 separate German states divided between Austrian and Prussian influence. Determined to unite Germany under the Prussian monarchy, Minister-President Otto von Bismarck delivered his famous Bismarck’s Blood & Iron speech in 1862, arguing that military strength alone determined history.</p><p class="prose-p">Bismarck expanded Prussian armed forces through modern railways and lethal, breech-loading deadly Krupp steel guns. Prussian military technology outgunned Austria and Denmark, establishing Prussia as the unchallenged master of Northern Germany.</p>',

    // B2: ["French Emperor Captured at Sedan", "German Empire Crowned at Versailles", "Prussia Dominates Europe"]
    '<p class="prose-p"><span class="para-ref">[1.2]</span> In July 1870, Bismarck provoked war with France to rally the independent southern German kingdoms into a national union. At the Battle of Sedan, Prussian encirclement resulted in French Emperor captured at Sedan alongside eighty thousand soldiers, toppling Emperor Napoleon III’s imperial regime.</p><p class="prose-p">On 18 January 1871, German princes gathered in the Palace of Versailles where the German Empire crowned at Versailles, appointing Kaiser Wilhelm I. Following victory, Prussia dominates Europe as the continent’s leading industrial and military titan.</p>',

    // B3: ["French Forced to Pay 5 Billion", "Losing Coal and Iron Land", "Hatred Between France and Germany"]
    '<p class="prose-p"><span class="para-ref">[1.3]</span> The 1871 Treaty of Frankfurt imposed harsh punitive terms on defeated France. Bismarck ordered German occupation troops to remain in French cities until the French forced to pay 5 billion gold francs in war indemnities.</p><p class="prose-p">Crucially, France was humiliated by losing coal and iron land through the annexation of the wealthy border provinces of Alsace-Lorraine. This painful territorial seizure created enduring hatred between France and Germany that poisoned European international relations for four decades.</p>',

    // B4: ["Classroom Maps Veiled in Black", "Dreaming of French Revenge", "Army Conscription for Boys"]
    '<p class="prose-p"><span class="para-ref">[1.4]</span> Across the French Third Republic, the loss of Alsace-Lorraine inspired <em>revanche</em>—a national desire for vengeance against Germany. In primary schools across the nation, patriotic teachers kept classroom maps veiled in black crepe paper to mourn the lost eastern provinces every morning.</p><p class="prose-p">French schoolchildren grew up dreaming of French revenge and the future liberation of their homeland. The French government introduced universal army conscription for boys reaching twenty, training millions of young citizens for an unavoidable continental war.</p>',

    // B5: ["Secret Deal with Russia", "Fear of War on Two Fronts", "Keeping France Isolated"]
    '<p class="prose-p"><span class="para-ref">[1.5]</span> As Imperial Chancellor, Otto von Bismarck devoted his diplomatic career to keeping France isolated from potential European allies. Bismarck was permanently haunted by the existential fear of war on two fronts against France in the west and Tsarist Russia in the east.</p><p class="prose-p">To safeguard Germany’s eastern frontier, Bismarck negotiated a secret deal with Russia in the 1887 Reinsurance Treaty, promising mutual neutrality. Through cautious diplomacy, Bismarck balanced European alliances and protected the newly created German Reich.</p>'
  ],

  // Lesson 2: Imperial Rivalry, the Scramble for Africa & the Moroccan Crises (1884–1911)
  [
    // B1: ["Carving Up African Land", "Rubber, Copper & Mineral Riches", "Rules Made at Berlin Meeting"]
    '<p class="prose-p"><span class="para-ref">[2.1]</span> In the late nineteenth century, European empires engaged in carving up African land during the competitive Scramble for Africa. Industrial powers sought overseas colonies to exploit raw materials, including valuable rubber, copper & mineral riches, palm oil, and cotton.</p><p class="prose-p">To prevent armed clashes among rival powers, Chancellor Bismarck organized the 1884 Berlin Conference. The rules made at Berlin meeting established that empires had to prove "effective occupation", prompting a rapid rush to conquer the African interior.</p>',

    // B2: ["Kaiser Sacks Old Bismarck", "Demanding a Place in the Sun", "Building a German Empire"]
    '<p class="prose-p"><span class="para-ref">[2.2]</span> In 1890, twenty-nine-year-old Kaiser Wilhelm II forced the sudden resignation of the veteran Chancellor. Kaiser sacks old Bismarck to abandon cautious European balance-of-power treaties in favour of an aggressive global strategy known as <em>Weltpolitik</em> ("World Policy").</p><p class="prose-p">Wilhelm envied the vast overseas territories of Great Britain and France, loudly demanding a place in the sun for the German nation. Building a German empire across Africa, Asia, and the Pacific required colonial acquisitions and a battle fleet to challenge British naval mastery.</p>',

    // B3: ["Kaiser Rides White Horse", "Testing Britain and France", "Promising to Protect Morocco"]
    '<p class="prose-p"><span class="para-ref">[2.3]</span> In March 1905, Kaiser Wilhelm challenged expanding French influence across North Africa by landing unannounced at Tangier. In a theatrical show of imperial defiance, the Kaiser rides white horse through the streets to the German embassy.</p><p class="prose-p">Wilhelm was actively testing Britain and France following their 1904 Entente Cordiale agreement, openly promising to protect Morocco as a free, independent sovereign state. Wilhelm intended to humiliate the French Republic and split the fledgling Anglo-French alliance before European eyes.</p>',

    // B4: ["Germany Defeated in Vote", "Britain Backs Up France", "Fearing Being Surrounded"]
    '<p class="prose-p"><span class="para-ref">[2.4]</span> The Moroccan dispute was settled at the 1906 Algeciras Conference in Spain. The international summit proved a catastrophic diplomatic setback for Berlin: Germany defeated in vote by twelve nations to two, with only Austria-Hungary supporting the German delegation.</p><p class="prose-p">Throughout the crisis, Britain backs up France completely, initiating secret joint military staff conversations in London. Instead of breaking the Entente, German bullying cemented Anglo-French defense ties, leaving German leaders fearing being surrounded by hostile powers on all borders.</p>',

    // B5: ["Gunboat Sent to Bully France", "Lloyd George Issues Warning", "Britain and France Plan for War"]
    '<p class="prose-p"><span class="para-ref">[2.5]</span> In July 1911, imperial tensions erupted again when French forces marched to suppress unrest in Fez. Germany reacted aggressively: the gunboat sent to bully France, SMS Panther, anchored threateningly inside the Moroccan port of Agadir.</p><p class="prose-p">British leaders feared Germany sought an Atlantic naval base. In his famous Mansion House speech, Chancellor David Lloyd George issues warning that Britain would fight to defend international standing. Humiliated into retreat, Germany watched Britain and France plan for war with coordinated naval deployments.</p>'
  ],

  // Lesson 3: The Anglo-German Naval Arms Race & HMS Dreadnought (1898–1914)
  [
    // B1: ["Britain Surrounded by Sea", "Food Brought by Ships", "Fleet Twice as Big as Rivals"]
    '<p class="prose-p"><span class="para-ref">[3.1]</span> As an island nation, Great Britain relied on unchallenged maritime dominance for national survival. With Britain surrounded by sea and over sixty percent of its essential food brought by ships, an enemy naval blockade meant rapid starvation for British civilians.</p><p class="prose-p">In 1889, Parliament codified the Two-Power Standard into national law. This statutory standard required the Royal Navy to maintain a battleship fleet twice as big as rivals France and Russia combined, guaranteeing imperial ocean security and protecting worldwide merchant shipping lanes.</p>',

    // B2: ["Tirpitz Plans High Seas Fleet", "Building Warships in North Sea", "Threatening British Waters"]
    '<p class="prose-p"><span class="para-ref">[3.2]</span> In 1898, German Naval Secretary Admiral Alfred von Tirpitz secured the German Naval Laws through the Reichstag. Tirpitz plans High Seas Fleet expansion directly across the German coastline, formulating his controversial "Risk Theory" to challenge British supremacy.</p><p class="prose-p">By building warships in North Sea bases, Tirpitz calculated that Germany could threaten the Royal Navy into diplomatic neutrality. Threatening British waters convinced the Admiralty that Germany was preparing to challenge British naval command of home waters in a future conflict.</p>',

    // B3: ["Ten Huge 12-Inch Guns", "Fast Steam Turbine Engines", "Old Battleships Now Useless"]
    '<p class="prose-p"><span class="para-ref">[3.3]</span> In 1906, Britain’s First Sea Lord Sir John Fisher unveiled HMS Dreadnought, revolutionizing warship design worldwide. The battleship was armed with ten huge 12-inch guns capable of firing broadsides twice as heavy as any vessel afloat.</p><p class="prose-p">Powered by fast steam turbine engines, Dreadnought surpassed every rival warship in speed and firepower. However, by rendering all older battleships now useless overnight, Dreadnought wiped out Britain\'s naval lead, allowing Germany to start building dreadnoughts on equal terms.</p>',

    // B4: ["Fearing Secret German Docks", "Newspaper Headlines Cause Panic", "Building Eight Battleships"]
    '<p class="prose-p"><span class="para-ref">[3.4]</span> By 1909, naval competition reached fever pitch and national hysteria in Great Britain. British naval intelligence reported German shipyards accelerating construction, leading the anxious British public into fearing secret German docks constructing hidden battleships along the Baltic coast.</p><p class="prose-p">Sensational newspaper headlines cause panic across the country, while crowds marched chanting: "We want eight and we won\'t wait!" Under immense political pressure, the government funded building eight battleships in a single year, maintaining British dominance.</p>',

    // B5: ["Talks in Berlin Fail", "Germany Refuses to Stop Building", "Royal Navy Ships Guard North Sea"]
    '<p class="prose-p"><span class="para-ref">[3.5]</span> In 1912, British War Secretary Lord Haldane travelled to Berlin seeking a formal naval truce between empires. Haldane offered territorial concessions in Africa if Germany reduced dreadnought construction, but diplomatic talks in Berlin fail completely due to Kaiser Wilhelm\'s opposition.</p><p class="prose-p">Kaiser Wilhelm and Tirpitz insisted that Germany refuses to stop building without a British neutrality pledge. Britain redeployed its Mediterranean battleships to home ports, ensuring Royal Navy ships guard North Sea waters against German naval strikes and pre-emptive attacks.</p>'
  ],

  // Lesson 4: The Alliance Systems & the Balkan Powder Keg (1879–1913)
  [
    // B1: ["Germany Backs Austria", "Italy Joins the Triple Alliance", "Promise of Help Against Russia"]
    '<p class="prose-p"><span class="para-ref">[4.1]</span> Between 1879 and 1882, Central Europe unified into a formidable mutual military coalition. Through the defensive Dual Alliance of 1879, Germany backs Austria to protect both central empires against Russian territorial ambitions in Eastern Europe and the volatile Balkans.</p><p class="prose-p">In 1882, Italy joins the Triple Alliance alongside Germany and Austria-Hungary. The mutual defense treaty guaranteed military assistance, securing a vital promise of help against Russia if war erupted, dividing the continent into armed power blocs.</p>',

    // B2: ["French Money Helps Russia", "Britain and France Shake Hands", "Triple Entente Formed"]
    '<p class="prose-p"><span class="para-ref">[4.2]</span> When Germany allowed its Russian alliance to expire, the French Republic seized the opportunity to break its diplomatic isolation. In 1894, French money helps Russia finance industrialisation and construct strategic military railways toward Germany\'s frontier, sealing the formal Franco-Russian Military Alliance.</p><p class="prose-p">A decade later, Britain and France shake hands over colonial rivalries in the 1904 Entente Cordiale. By 1907, Britain resolved differences with Russia, completing the Triple Entente formed to counterbalance the Central Powers.</p>',

    // B3: ["Ottoman Empire Falling Apart", "Slavic Peoples Want Freedom", "Austria Clashes with Russia"]
    '<p class="prose-p"><span class="para-ref">[4.3]</span> The mountainous Balkan peninsula became known as the explosive "powder keg of Europe". With the ancient Ottoman Empire falling apart after centuries of dominance, newly emerging Balkan nations fought to liberate territory from collapsing Turkish rule.</p><p class="prose-p">Millions of Orthodox Slavic peoples want freedom from foreign imperial domination, looking to independent Serbia and Tsarist Russia for protection. In this volatile region, expansionist Austria clashes with Russia as both rival empires sought hegemony over the crumbling Balkans.</p>',

    // B4: ["Austria Grabs Bosnia", "Serbian Fury at Land Grab", "Russia Forced to Back Down"]
    '<p class="prose-p"><span class="para-ref">[4.4]</span> In October 1908, crisis erupted across south-eastern Europe when Austria grabs Bosnia and Herzegovina, formally annexing the Slavic territories without international approval. The annexation sparked furious Serbian fury at land grab, as Serbian nationalists dreamed of creating a united South Slavic state.</p><p class="prose-p">Tsarist Russia mobilised to support Serbia, but Germany issued a threatening ultimatum demanding Russian compliance. Unprepared for war, Russia forced to back down in humiliation, swearing never to yield to Austro-German intimidation again.</p>',

    // B5: ["Serbia Wins Two Wars", "Double the Land and Army", "Austria Plans to Crush Serbia"]
    '<p class="prose-p"><span class="para-ref">[4.5]</span> In 1912 and 1913, the Balkan League attacked the Turks in the Balkan Wars, expelling Ottoman authority from Europe. Serbia emerged victorious: Serbia wins two wars in rapid succession, dramatically expanding its regional influence and national prestige.</p><p class="prose-p">The kingdom achieved double the land and army strength, inspiring militant pan-Slav nationalists inside the Austro-Hungarian empire. Terrified of ethnic disintegration, hawkish generals in Vienna concluded that Austria plans to crush Serbia in a pre-emptive strike before Slavic nationalism dismantled their realm.</p>'
  ],

  // Lesson 5: The July Crisis: Sarajevo to the Outbreak of War (June–August 1914)
  [
    // B1: ["Open-Top Car in Sarajevo", "Wrong Turn at the Sandwich Shop", "Gavrilo Princip Fires Two Shots"]
    '<p class="prose-p"><span class="para-ref">[5.1]</span> On 28 June 1914, Archduke Franz Ferdinand, heir to the Austro-Hungarian throne, toured Sarajevo. Travelling in an open-top car in Sarajevo with his wife Sophie, the royal couple survived an initial grenade attack on the Appel Quay.</p><p class="prose-p">Later that morning, the royal chauffeur made a fatal wrong turn at the sandwich shop where Black Hand conspirator Gavrilo Princip stood. Stepping forward, Gavrilo Princip fires two shots at point-blank range, assassinating the Archduke and Sophie and igniting the July Crisis.</p>',

    // B2: ["Kaiser Promises Total Support", "Blank Cheque Given to Austria", "Ready to Attack Serbia"]
    '<p class="prose-p"><span class="para-ref">[5.2]</span> The Austro-Hungarian government resolved to use the Sarajevo assassination to crush Serbia militarily once and for all. However, Austrian leaders feared that invading Serbia would trigger Russian military intervention to protect Slavic independence across Eastern Europe.</p><p class="prose-p">On 5 July 1914, the German Kaiser promises total support to Emperor Franz Joseph. This unconditional blank cheque given to Austria guaranteed German military alliance under all circumstances, leaving Austria ready to attack Serbia regardless of European consequences.</p>',

    // B3: ["Harsh Ten-Point Demands", "Demanding Austrian Police in Belgrade", "Shelling Serbia from the River"]
    '<p class="prose-p"><span class="para-ref">[5.3]</span> On 23 July 1914, Austria-Hungary delivered an ultimatum containing harsh ten-point demands designed deliberately to be rejected by Serbian authorities within forty-eight hours. The ultimatum included demanding Austrian police in Belgrade to arrest dissidents and suppress anti-Austrian groups, directly violating Serbian independent national sovereignty.</p><p class="prose-p">Although Serbia accepted nine conditions, Austria broke diplomatic ties. On 28 July, Austria declared war, shelling Serbia from the river Danube with gunboats and initiating Europe’s descent into world war.</p>',

    // B4: ["Russian Millions Call Up to War", "Soldiers Boarding Trains", "Clock Ticking for Generals"]
    '<p class="prose-p"><span class="para-ref">[5.4]</span> Austrian aggression activated Europe’s rigid military alliances across the continent. Bound by sacred honour to protect Serbia, Tsar Nicholas II ordered general mobilisation: Russian millions call up to war across thousands of miles of the Russian Empire.</p><p class="prose-p">Across Europe, millions of soldiers boarding trains headed toward borders according to rigid railway timetables. With the clock ticking for generals terrified of being caught unready, mobilisation plans could not be halted without risking total military defeat.</p>',

    // B5: ["German Troops March into Belgium", "Scrap of Paper Treaty Broken", "Britain Enters the War at Midnight"]
    '<p class="prose-p"><span class="para-ref">[5.5]</span> Executing the Schlieffen Plan to knock out France before Russia mobilized, German troops march into Belgium on 4 August 1914. German Chancellor Bethmann-Hollweg dismissed the 1839 Treaty of London guaranteeing Belgian neutrality as a mere scrap of paper treaty broken at will.</p><p class="prose-p">Great Britain demanded immediate German withdrawal from neutral territory. When Germany refused, Britain enters the war at midnight on 4 August 1914, plunging the British Empire into the catastrophic slaughter of the First World War.</p>'
  ],

  // Lesson 6: Summative Assessment Masterclass: Why Did War Break Out in 1914?
  [
    // B1: ["Why did war break out in 1914?", "strictly three developed PEEL paragraphs", "NO conclusion is required!"]
    '<p class="prose-p"><span class="para-ref">[6.1]</span> In your formal summative assessment, you will answer the central historical inquiry: Why did war break out in 1914? To achieve top marks at Key Stage 3, students must construct strictly three developed PEEL paragraphs analysing distinct historical factors.</p><p class="prose-p">Structure your time carefully across thirty minutes to explain cause and consequence. Remember that NO conclusion is required! Focus your effort on providing precise historical evidence and detailed explanation rather than repeating summary arguments across your essay.</p>',

    // B2: ["Otto von Bismarck", "Treaty of Frankfurt", "Alsace-Lorraine"]
    '<p class="prose-p"><span class="para-ref">[6.2]</span> The first long-term cause of the conflict was the unification of Germany. Prussian Chancellor Otto von Bismarck unified thirty-nine independent German states into a dominant continental empire after crushing France in the decisive 1870 Franco-Prussian War.</p><p class="prose-p">Under the punitive 1871 Treaty of Frankfurt, victorious Germany annexed the mineral-rich border province of Alsace-Lorraine. This humiliating seizure generated four decades of bitter French revanchism, permanently dividing Europe’s two strongest continental military powers and creating lasting friction across borders.</p>',

    // B3: ["Scramble for Africa", "Weltpolitik", "place in the sun"]
    '<p class="prose-p"><span class="para-ref">[6.3]</span> The second major factor was imperial rivalry across Africa and Asia. Between 1884 and 1911, European industrial nations competed ruthlessly during the Scramble for Africa, carving up vast overseas colonial territory for mineral wealth, valuable copper, and raw rubber.</p><p class="prose-p">Under Kaiser Wilhelm II, Germany embraced <em>Weltpolitik</em>, aggressively demanding Germany\'s overseas place in the sun equal to Britain and France. German interventions in Morocco united Britain and France against German imperial expansion across the globe.</p>',

    // B4: ["Two-Power Standard", "HMS Dreadnought", "naval tension"]
    '<p class="prose-p"><span class="para-ref">[6.4]</span> The third crucial factor was the fierce Anglo-German naval arms race. As an island nation, Britain defended its global maritime empire by maintaining the Two-Power Standard, requiring the Royal Navy to equal or exceed the next two navies combined.</p><p class="prose-p">When Britain launched HMS Dreadnought in 1906, revolutionary all-big-gun technology restarted the naval race. Admiral Tirpitz built dreadnoughts in the North Sea, generating intense naval tension and panic among the British public who demanded more battleships.</p>',

    // B5: ["Triple Alliance", "Triple Entente", "28 June 1914"]
    '<p class="prose-p"><span class="para-ref">[6.5]</span> The final catalyst and trigger was the interlocking alliance system and the July Crisis. By 1914, Europe was dangerously split into two hostile armed camps: the Central Powers Triple Alliance (Germany, Austria, Italy) and the rival Triple Entente (Britain, France, Russia).</p><p class="prose-p">When Serbian nationalist student Gavrilo Princip assassinated Archduke Franz Ferdinand in Sarajevo on 28 June 1914, Austrian retaliation activated mutual military alliances, dragging all five great powers into global conflict within five weeks.</p>'
  ]
];

// Check word counts and paragraphs
console.log('=== WORD COUNT & PARAGRAPH AUDIT FOR GREAT WAR ===');
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
const { enquiryConfigs } = require('./render_great_war_twopage_workbook.cjs');
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
