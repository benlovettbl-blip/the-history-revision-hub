const fs = require('fs');

const lessonsData = [
  // Lesson 1
  [
    '<p class="prose-p"><span class="para-ref">[1.1]</span> In October 1517, German monk Martin Luther nailed 95 fiery arguments to the <strong>Wittenberg church door</strong>. Luther attacked corrupt friars selling an <strong>indulgence</strong>—a certificate promising that paying for forgiveness would free dead relatives from the agonies of <strong>Purgatory</strong>.</p><p class="prose-p">Printed copies spread across Europe, triggering the Protestant <strong>Reformation</strong>. When young King Henry VIII wrote a book defending Catholic sacraments against Luther, Pope Leo X rewarded him with the proud <strong>Defender of the Faith title</strong>.</p>',
    '<p class="prose-p"><span class="para-ref">[1.2]</span> By 1527, Henry faced an agonizing <strong>dynastic</strong> crisis. Catherine of Aragon was past forty and had borne only one living daughter, Princess Mary. Driven by a desperate need for a son to protect royal <strong>succession</strong>, Henry feared civil war if the Tudor dynasty collapsed without a male heir.</p><p class="prose-p">Having fallen deeply in love for Anne Boleyn, Henry cited a strict Bible warning on marriage from Leviticus, claiming his marriage to Catherine was cursed. He demanded an official papal <strong>annulment</strong> to marry again.</p>',
    '<p class="prose-p"><span class="para-ref">[1.3]</span> Normally, popes readily granted royal annulments, but Pope Clement VII was trapped. In May 1527, Holy Roman Emperor Charles V—Catherine’s nephew—led imperial troops that attacks Rome, ransacked the city, and left the Pope held prisoner in Castel Sant’Angelo.</p><p class="prose-p">Charles warned the <strong>papacy</strong> that ending Catherine’s marriage would bring ruin. When Henry’s chief minister Cardinal Wolsey opened a legatine court in London, Clement revoked the case, the church trial cancelled, and English <strong>sovereignty</strong> was defied, causing Wolsey’s immediate arrest.</p>',
    '<p class="prose-p"><span class="para-ref">[1.4]</span> A ruthless lawyer named Thomas Cromwell showed Henry how to bypass Rome. Cromwell used the Reformation Parliament to pass revolutionary <strong>statute</strong> laws. Henry cowed the English clergy by threatening church fines under ancient treason laws, forcing bishops into complete royal submission.</p><p class="prose-p">Cromwell escalated the siege by stopping taxes to Rome (annates) and passing the 1533 Act in Restraint of Appeals, banning appeals to the Pope. Archbishop Cranmer declared Henry’s marriage void and crowned Anne Boleyn, sealing England’s legal independence.</p>',
    '<p class="prose-p"><span class="para-ref">[1.5]</span> In November 1534, Parliament passed the historic <strong>Act of Supremacy</strong>, formally breaking ties with Rome. The statute declared Henry the supreme head of the Church of England, holding absolute spiritual authority over English subjects.</p><p class="prose-p">Henry enforced loyalty through forced treason oaths; those refusing, including Sir Thomas More, were executed for <strong>treason</strong>. Cromwell then surveyed church wealth, dissolving over 800 Catholic monasteries between 1536 and 1540, selling monastic lands to gentry allies and permanently enriching the Crown.</p>'
  ],
  // Lesson 2
  [
    '<p class="prose-p"><span class="para-ref">[2.1]</span> In November 1558, twenty-five-year-old Elizabeth I inherited an acutely divided nation. Her Catholic half-sister Queen Mary I had launched fierce religious persecution, seeing almost three hundred Protestants burned at stake as heretics. Each brave Protestant <strong>martyr</strong> died holding English prayer books, inflaming fierce religious hatred across the country.</p><p class="prose-p">Simultaneously, the return of strict Puritans from European exile put pressure on the young queen. These militant Calvinists demanded that Elizabeth purge all Catholic ritual, Latin prayers, and bishops from the English Church.</p>',
    '<p class="prose-p"><span class="para-ref">[2.2]</span> Elizabeth needed an enduring political <strong>compromise</strong> to avoid civil war. In early 1559, Parliament passed the Act of Supremacy. To soothe Catholics who believed only Christ or the Pope could lead the Church, Elizabeth adopted the clever title of <strong>Supreme Governor</strong> rather than Supreme Head.</p><p class="prose-p">The Act required strict loyalty oaths for priests and public officials. When all but one Marian Catholic bishop refused to take the oath, Elizabeth showed steel by sacking Catholic bishops and appointing moderate Protestants in their place.</p>',
    '<p class="prose-p"><span class="para-ref">[2.3]</span> Alongside supremacy, the 1559 Act of <strong>Uniformity</strong> established Elizabeth\'s famed <strong>Via Media</strong> (Middle Way). It introduced one shared prayer book for every parish, written in English. The communion service featured clever compromise wording that satisfied both Protestants and Catholics.</p><p class="prose-p">Attendance was strictly compulsory. Any Catholic <strong>recusant</strong> who refused to attend Sunday church services was punished with Sunday church fines (12d)—roughly a day’s wages for a labourer. Elizabeth avoided probing private conscience, famously declaring she had no desire to make windows into men\'s souls.</p>',
    '<p class="prose-p"><span class="para-ref">[2.4]</span> Elizabeth’s Middle Way soon faced violent Catholic resistance. In 1569, traditionalist Northern Earls rebel against royal authority, marching into Durham Cathedral, tearing down Protestant communion tables, and celebrating secret Catholic mass. Elizabeth swiftly crushed the rebellion, executing four hundred rebels.</p><p class="prose-p">In response, Pope Pius V issued the 1570 <strong>papal bull</strong> <em>Regnans in Excelsis</em>, ordering Elizabeth\'s <strong>excommunication</strong>. By declaring Elizabeth a heretic and usurper, the Pope orders Elizabeth deposed, freeing English Catholics from their allegiance and turning every Catholic subject into a suspected traitor.</p>',
    '<p class="prose-p"><span class="para-ref">[2.5]</span> Mary Queen of Scots\' arrival in England sparked deadly Catholic assassination plots. Elizabeth\'s spymaster Sir Francis Walsingham ran a sophisticated network of <strong>espionage</strong> to trap conspirators. In 1586, Anthony Babington plotted Elizabeth’s murder, smuggling letters hidden in barrels of beer to Mary.</p><p class="prose-p">Walsingham intercepted the letters and had Mary\'s secret code broken by expert cryptographers. Confronted with Mary’s treason, Parliament demanded blood. With deep reluctance, Elizabeth finally saw Mary\'s death warrant signed, and Mary Stuart was beheaded at Fotheringhay Castle in February 1587.</p>'
  ],
  // Lesson 3
  [
    '<p class="prose-p"><span class="para-ref">[3.1]</span> By 1585, King Philip II of Spain launched a holy Catholic <strong>crusade</strong> to conquer Protestant England. Philip was infuriated by English help for Dutch rebels fighting Spanish rule in the Netherlands, and enraged by English <strong>privateer</strong> Sir Francis Drake stealing Spanish gold and raiding Caribbean treasure fleets.</p><p class="prose-p">When Mary Queen of Scots was beheaded in 1587, Philip secured papal blessings to depose Elizabeth. Philip assembled an invincible Armada to sail up the English Channel, ferry the Duke of Parma\'s veteran army from Flanders, and overthrow the Protestant Crown.</p>',
    '<p class="prose-p"><span class="para-ref">[3.2]</span> In April 1587, Francis Drake struck a daring pre-emptive blow, sailing directly into Cadiz harbour. In this raid, known as \'singeing the King of Spain’s beard\', Drake destroyed thirty Spanish warships and burned vast warehouses of seasoned barrel staves, devastating Spanish naval <strong>logistics</strong>.</p><p class="prose-p">Burning food barrels forced the Spanish to construct fresh casks from unseasoned green wood. Consequently, rotten water and bread contaminated supplies before the fleet even sailed. Drake\'s audacious raid caused the invasion fleet held back for a year, buying precious time for English coastal defenses.</p>',
    '<p class="prose-p"><span class="para-ref">[3.3]</span> On 29 July 1588, the Armada entered the English Channel under the Duke of Medina Sidonia. The Spanish sailed 130 ships in crescent line formation, designed to resist boarding attacks and protect slow transport vessels with lumbering floating castles.</p><p class="prose-p">Lord Howard and Drake counterattacked using faster race-built ships designed by John Hawkins. Rather than grappling, the nimble English ships delivered rapid naval <strong>broadside</strong> firepower, firing cannons from afar using long-range brass <strong>culverin</strong> guns that battered the Spanish formation while staying out of reach.</p>',
    '<p class="prose-p"><span class="para-ref">[3.4]</span> On 7 August, the Armada anchored at Calais, waiting for Parma’s delayed troops. Trapped in a vulnerable open <strong>anchorage</strong>, the Spanish were terrorized at midnight when English captains launched eight burning ghost ships coated in pitch and gunpowder directly toward their fleet.</p><p class="prose-p">Panicked Spanish captains shouted orders for cutting anchor ropes in panic to escape the blazing <strong>fireship</strong> threat. Scattering in the dark into the open North Sea, the Armada lost its defensive crescent formation forever, leaving individual vessels helpless against English gunfire.</p>',
    '<p class="prose-p"><span class="para-ref">[3.5]</span> At the Battle of Gravelines, English warships closed in, blasting wooden hulls of each Spanish <strong>galleon</strong> at point-blank range. Blown northward into fierce North Sea gales, Medina Sidonia had no choice but to steer his battered fleet around Scotland and Ireland.</p><p class="prose-p">Furious Atlantic storms drove dozens of ships onto jagged Irish rocks, causing devastating shipwrecks. Only sixty-seven damaged vessels limped back to Spain. Elizabeth celebrated divine <strong>providence</strong>, striking a famous medal declaring: \'God blew and they were scattered\', cementing England’s naval and Protestant identity.</p>'
  ],
  // Lesson 4
  [
    '<p class="prose-p"><span class="para-ref">[4.1]</span> Believing in the absolute <strong>Divine Right</strong> of Kings, Charles I insisted monarchs answered only to God. When MPs challenged his religious policy and taxation in 1629, Charles dismissed Parliament and ruled for eleven years with no MPs, a period opponents branded the \'Eleven Years\' Tyranny\' or <strong>Personal Rule</strong>.</p><p class="prose-p">To raise funds without Parliament, Charles levied <strong>Ship Money</strong> on inland towns, an ancient naval tax traditionally charged only to coastal counties. In 1637, wealthy landowner John Hampden refuses to pay, sparking widespread tax boycotts across England.</p>',
    '<p class="prose-p"><span class="para-ref">[4.2]</span> Scottish rebellion forced Charles to recall Parliament in 1640. Furious MPs dismantled royal courts and pursued the <strong>impeachment</strong> of Charles\'s closest ministers. Tensions exploded on 4 January 1642, when armed royal guards raid the Commons chamber as Charles attempted to arrest Five MPs for high treason.</p><p class="prose-p">Warned beforehand, the Five MPs escape by river boat into the protective shelter of the City of London. Humiliated and furious, Charles fled London. In August 1642, the King raises war flag at Nottingham, plunging England into brutal civil war.</p>',
    '<p class="prose-p"><span class="para-ref">[4.3]</span> Early royalist victories exposed Parliament\'s weak regional militias. In 1645, Parliament created the revolutionary <strong>New Model Army</strong>: Britain’s first professional national force of full-time paid redcoats, promoted purely on merit rather than noble birth, commanded by Sir Thomas Fairfax and Oliver Cromwell.</p><p class="prose-p">At the decisive Battle of Naseby in June 1645, Cromwell’s cavalry charges smashed the King’s flanks. Royalists routed and captured surrendered their artillery and private royal correspondence, completely destroying Charles’s military hopes and sealing Parliamentary victory.</p>',
    '<p class="prose-p"><span class="para-ref">[4.4]</span> Charles refused to accept defeat, sparking a second civil war by plotting with Scottish allies. Determined to punish the \'man of blood\', Colonel Pride used troops to purge Parliament; the Army kicks out moderate MPs, leaving a radical \'Rump\'.</p><p class="prose-p">In January 1649, Charles was a king put on trial for treason before a High Court of Justice. Found guilty of <strong>high treason</strong> against his people, Charles was beheaded outside Whitehall on 30 January 1649, abolishing monarchy and establishing a revolutionary republic.</p>',
    '<p class="prose-p"><span class="para-ref">[4.5]</span> The 1660 Stuart <strong>Restoration</strong> brought back the Crown, but religious conflict reignited under Catholic King James II. In 1688, Protestant nobles invited Dutch Prince William of Orange to intervene. A Dutch army lands at Torbay, and James II flees the country to France in the Glorious Revolution.</p><p class="prose-p">Parliament offered the crown to William and Mary on strict conditions, enacting the 1689 <strong>Bill of Rights</strong>. Monarchy was permanently bound by the law: kings could neither cancel statutes nor raise taxes without parliamentary consent, cementing constitutional rule.</p>'
  ],
  // Lesson 5
  [
    '<p class="prose-p"><span class="para-ref">[5.1]</span> The Break with Rome transformed national authority. Under Henry VIII, the Pope lost all English power as the Crown established sovereign national independence. Crucially, Henry achieved this not by royal decree, but through <strong>statute law</strong> passed by the Reformation Parliament.</p><p class="prose-p">New laws made with MPs forged an unprecedented partnership between King and Parliament. Furthermore, vast monastery lands given away or sold to local gentry bound England’s landowning classes to royal supremacy, laying the foundations of modern English parliamentary <strong>sovereignty</strong>.</p>',
    '<p class="prose-p"><span class="para-ref">[5.2]</span> Elizabeth I anchored national unity through pragmatic statecraft. Her 1559 Elizabethan Religious Settlement provided a compromise for both sides, creating a Protestant national church with moderate ceremonies that allowed broad outward <strong>conformity</strong> without religious inquisitions.</p><p class="prose-p">She enforced order through modest fines for missing church on Sundays to penalize recusants. When Spain invaded in 1588, England was united by Armada victory, forging a lasting patriotic myth that God favoured Protestant England and strengthening parliamentary support for the Crown.</p>',
    '<p class="prose-p"><span class="para-ref">[5.3]</span> The Stuart accession shattered Tudor harmony. James I and Charles I embraced <strong>absolutism</strong>, insisting through Divine Right that kings claim only God rules them, free from parliamentary consent. Charles ruled eleven years without MPs, extracting illegal taxes without votes through Ship Money.</p><p class="prose-p">This tyranny collapsed when Scots rebel against English rules and prayer books. Bankrupted by military resistance, Charles was forced to recall MPs in 1640, triggering an ideological showdown between absolute royal power and parliamentary privilege.</p>',
    '<p class="prose-p"><span class="para-ref">[5.4]</span> The Civil War transformed English constitutional history. Parliament\'s citizen army beat the King at Naseby, ending royal hopes of military victory. Following Charles’s repeated intrigues, Pride\'s Purge cleared dissenters from Parliament, abolishing the House of Lords and monarchy to establish a republican <strong>Commonwealth</strong>.</p><p class="prose-p">Beheading Charles I in 1649 set a revolutionary <strong>precedent</strong>: an anointed monarch was held to the law. A ruler who broke his constitutional trust with the people could be tried and executed for treason.</p>',
    '<p class="prose-p"><span class="para-ref">[5.5]</span> The 1688 Glorious Revolution and 1689 Bill of Rights established permanent <strong>constitutional monarchy</strong> across the realm. Parliament drafted a binding statutory contract with new rulers William III and Mary II, legally ending centuries of royal claims to absolute divine power.</p><p class="prose-p">The statute confirmed that the King cannot cancel laws without Parliament, prohibited royal taxes without MP votes, and removed the Crown\'s royal <strong>veto</strong> over parliamentary statutes. Sovereignty had shifted decisively from the personal will of the monarch to the supreme authority of the King-in-Parliament.</p>'
  ]
];

// Check word counts and paragraphs
console.log('=== WORD COUNT & PARAGRAPH AUDIT FOR MONARCHY ===');
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
const { enquiryConfigs } = require('./render_monarchy_religion_power_workbook.cjs');
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
        console.log(`GAP: E${eIdx+1} S${stg.step} "${bullet}" missing: [${missing.join(', ')}]`);
      }
    });
  });
});
console.log(`Trigger check result: ${missingTotal} missing words.`);

module.exports = { lessonsData };
