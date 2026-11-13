/**
 * scripts/sync_eee_workbook_to_app.cjs
 *
 * Unit-Scoped Master Synchronizer for Early Elizabethan England (`eee`, 1558–88, 1HI0/B4):
 *  1. Cleans all 60 narrative blocks across `lesson_1_1`..`lesson_3_4` to eliminate legacy
 *     telegraphese splices, keep GCSE prose strictly 110–142 words across two clean paragraphs
 *     (`[X.1]` / `[X.2]`), replace off-period "the Globe" (1599) with period playhouses, and
 *     embed 120/120 `vocabBank` terms + 180/180 natural 1–3 word `workbook_stages` trigger terms.
 *  2. Synchronizes 1-to-1 Stage-for-Stage `question`, `date`, `words`, `key_terms`, `bullets`,
 *     and natural `model_sentence` across `workbook_stages`, `causal_domino_spine.stages`,
 *     `narrative_blocks`, and `teacher_notes.objectives`.
 *  3. Maps readable `slug` + backwards-compatible `alias_ids` onto `lesson_1_1`..`lesson_3_4`.
 *  4. Synchronizes 100% Edexcel 1HI0/B4 spec-verbatim `exam_practice.questions` (`1(a)` [2m],
 *     `1(b)` [2m] from Page 13 Workout, and `2.` [12m] OR `3.` [16m — Zero SPaG] with Grade 9 WAGOLLs).
 *  5. Upserts the 3 Printed Workbook Closed-Book Mini-Mocks (`pp. 14–15`, 16m) into `eee.mock_exams`.
 *  6. Writes identically to `data/eee.json`, `public/data/eee.json`, `database.json`,
 *     `public/database.json`, and `units/eee/data.js` (`node -c` verified).
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { EEE_BOOKLETS } = require('./eee_workbook_master_data.cjs');
const EEE_EXAM_CALIBRATION = require('./eee_exam_practice_calibration.json');

const ROOT_DIR = path.resolve(__dirname, '..');

// Clean GCSE prose + 3 natural trigger terms + natural model sentence for all 60 blocks
const LESSON_PROSE_SPECS = {
  lesson_1_1: [
    {
      p1: 'In November 1558, twenty-five-year-old Elizabeth Tudor ascended the English throne following the death of her Catholic half-sister Mary I. The young Queen inherited an impoverished, vulnerable realm burdened by an astronomical **£300,000** Crown debt, largely accumulated through costly Tudor wars in France and currency debasement that shook confidence in English coinage.',
      p2: 'Because the Crown’s ordinary annual revenue stood at barely £286,000, royal treasurers were forced to take foreign loans on the **Antwerp** money market at steep 14% interest to fund basic expenditure. Seeking immediate administrative grip and fiscal stability, Elizabeth acted decisively on accession day by appointing Sir **William Cecil** as Principal Secretary, forging a political partnership that directed English statecraft for forty years.',
      terms: ['£300,000', 'Antwerp', 'William Cecil'],
      model:
        'Inheriting a crippling <strong>£300,000</strong> Crown debt financed through high-interest <strong>Antwerp</strong> loans, Elizabeth appointed <strong>William Cecil</strong> as Principal Secretary to restore royal solvency.',
    },
    {
      p1: 'Tudor monarchical rule rested upon divine right, yet the Crown possessed no standing army or salaried national police force. Executive authority was instead exercised through a streamlined 19-man **Privy Council** of trusted nobles and seasoned administrators who met almost daily at court to direct national defence, royal finance, foreign diplomacy, and the enforcement of parliamentary statutes.',
      p2: 'To preserve political stability, Elizabeth skilfully balanced rival court factions so ambitious councillors like William Cecil and Robert Dudley could never monopolise royal favour or policy. She bound the landed elite firmly to her throne through royal **patronage**, distributing prestigious court offices, Crown land leases, and lucrative commercial **monopolies** that rewarded unswerving political loyalty without surrendering her royal prerogative.',
      terms: ['Privy Council', 'patronage', 'monopolies'],
      model:
        'Governing daily through her 19-man <strong>Privy Council</strong>, Elizabeth used royal <strong>patronage</strong> and commercial <strong>monopolies</strong> to balance rival court factions and secure noble loyalty.',
    },
    {
      p1: 'Elizabeth’s title was immediately questioned through sixteenth-century patriarchal prejudice against female rulers and religious doubts over her birth. Roman Catholic canon law maintained that Henry VIII’s marriage to Catherine of Aragon remained indissoluble, condemning his 1533 wedding to **Anne Boleyn** as invalid; devout Catholics therefore viewed Elizabeth as illegitimate and barred from inheriting the English crown.',
      p2: 'Doubts were reinforced by Henry VIII’s own **1536 Succession Act**, passed after Anne Boleyn’s execution, which had legally declared Elizabeth illegitimate even after the 1544 Act restored her place in line. As an unmarried queen regnant, she faced relentless parliamentary pressure to marry and produce a **Protestant heir** lest sudden illness plunge England into dynastic civil war.',
      terms: ['Anne Boleyn', '1536 Succession Act', 'Protestant heir'],
      model:
        'Because Catholics rejected Henry VIII’s marriage to <strong>Anne Boleyn</strong> and cited the <strong>1536 Succession Act</strong>, MPs pressed Elizabeth urgently to marry and secure a <strong>Protestant heir</strong>.',
    },
    {
      p1: 'Beyond Whitehall, the Tudor Crown depended entirely upon unpaid county elites to enforce royal authority across the shires. Regional defence was entrusted to noble **Lords Lieutenant**, who mustered and trained county militias during emergencies, while daily local government rested on wealthy gentry appointed as **Justices of the Peace** to judge crimes, maintain roads, and administer poor laws.',
      p2: 'Meanwhile, **Parliament** was not a permanent legislature but an occasional assembly summoned only when the monarch needed new statutes or emergency war funding. Although Elizabeth fiercely guarded her royal prerogative over marriage, religion, and foreign policy, constitutional custom dictated that extraordinary taxation required parliamentary consent, giving the House of Commons important financial leverage.',
      terms: ['Lords Lieutenant', 'Justices of the Peace', 'Parliament'],
      model:
        'Elizabeth relied upon noble <strong>Lords Lieutenant</strong> and unpaid <strong>Justices of the Peace</strong> to govern the shires while summoning <strong>Parliament</strong> whenever she required extraordinary taxation.',
    },
    {
      p1: 'In foreign affairs, Elizabeth inherited dangerous strategic encirclement by hostile Catholic powers. During Mary I’s disastrous French war alongside Habsburg Spain, England had suffered the humiliating loss of **Calais** in January 1558—its last continental foothold—damaging Tudor military prestige and leaving England’s southern coastline exposed to invasion fleets assembling across the narrow English Channel.',
      p2: 'Danger was compounded to the north through France’s traditional **Auld Alliance** with Scotland, where veteran French garrison troops bolstered Regent Mary of Guise along the vulnerable English border. Her daughter, Catholic claimant **Mary, Queen of Scots**, was married to the French Dauphin Francis and quartered the English royal arms with her own, openly asserting her dynastic claim to Elizabeth’s throne.',
      terms: ['Calais', 'Auld Alliance', 'Mary, Queen of Scots'],
      model:
        'After the loss of <strong>Calais</strong> in January 1558, France’s <strong>Auld Alliance</strong> with Scotland and the rival claim of <strong>Mary, Queen of Scots</strong> threatened England on two fronts.',
    },
  ],

  lesson_1_2: [
    {
      p1: 'Upon her accession in 1558, Elizabeth inherited a deeply fractured nation scarred by decades of sudden Tudor religious upheaval. Conservative **northern gentry** and earls in the north and west remained devoted to traditional Roman Catholic Mass, images, and papal authority, whereas London, East Anglia, and south-eastern ports strongly favoured Protestant reform through continental trade links.',
      p2: 'Following Mary I’s burning of nearly three hundred Protestants, zealous **Marian exiles** returned from Calvinist Geneva and Zurich demanding a stripped, scripture-only church purged of every Catholic remnant. Conversely, twenty-six conservative **Marian bishops** sat in the House of Lords opposing Protestant legislation, forcing Elizabeth to craft a cautious religious compromise to avert sectarian civil war.',
      terms: ['northern gentry', 'Marian exiles', 'Marian bishops'],
      model:
        'Caught between traditional Catholic <strong>northern gentry</strong>, radical returning <strong>Marian exiles</strong>, and entrenched <strong>Marian bishops</strong> in the Lords, Elizabeth sought a cautious religious settlement.',
    },
    {
      p1: 'Passed by Parliament in May 1559, the **Act of Supremacy** permanently severed England’s legal ties with Rome and restored royal control over the Church. In a shrewd diplomatic gesture designed to calm Catholic consciences—and ease male anxieties over a woman heading the Church—Elizabeth adopted the title **Supreme Governor** rather than Henry VIII’s ‘Supreme Head’.',
      p2: 'The statute introduced a mandatory **Oath of Supremacy**, requiring all clergy, judges, university fellows, and royal officeholders to swear allegiance to Elizabeth’s spiritual authority or forfeit their posts. While twenty-six of twenty-seven Marian bishops refused and were deprived of their sees, roughly 8,000 ordinary parish priests took the oath, giving the new Protestant hierarchy peaceful continuity.',
      terms: ['Act of Supremacy', 'Supreme Governor', 'Oath of Supremacy'],
      model:
        'Under the May 1559 <strong>Act of Supremacy</strong>, Elizabeth took the diplomatic title <strong>Supreme Governor</strong> and enforced clerical loyalty through the compulsory <strong>Oath of Supremacy</strong>.',
    },
    {
      p1: 'Enacted alongside royal supremacy, the May 1559 **Act of Uniformity** established a single legal pattern of worship across every parish in England and Wales. It introduced a revised English **Book of Common Prayer** and required everyone to attend church every Sunday and holy day; absentees were classed as **recusants** and fined twelve pence (one shilling) per missed service.',
      p2: 'To win broad acceptance, the prayer book deliberately fused the 1549 and 1552 communion sentences so traditionalists could perceive Christ’s real presence in the bread and wine while Protestants understood it as a memorial meal. Meanwhile, the Ornaments Rubric retained traditional clerical vestments and church decoration, reassuring conservative rural congregations with familiar outward dignity.',
      terms: ['Act of Uniformity', 'Book of Common Prayer', 'recusants'],
      model:
        'The 1559 <strong>Act of Uniformity</strong> enforced the ambiguous <strong>Book of Common Prayer</strong> across every parish while fining non-attending <strong>recusants</strong> one shilling per Sunday.',
    },
    {
      p1: 'In the summer of 1559, William Cecil issued fifty-seven **Royal Injunctions**—detailed practical instructions guiding parish clergy on how to implement the statutory religious settlement in local communities. Every licensed minister had to preach royal supremacy at least four times a year, denounce papal superstition, and place a large **English Bible** alongside Erasmus’s *Paraphrases* inside every parish church.',
      p2: 'The injunctions outlawed traditional Catholic **pilgrimages**, ‘feigned’ miracles, candles burned before statues, and processions around monuments while permitting traditional hymns and kneeling at prayer for Christian reverence. Clerical marriage was permitted for Protestant priests, provided prospective wives produced formal certificates of good character approved by the diocesan bishop and two local Justices of the Peace.',
      terms: ['Royal Injunctions', 'English Bible', 'pilgrimages'],
      model:
        'Cecil’s fifty-seven <strong>Royal Injunctions</strong> placed an <strong>English Bible</strong> in every parish church while banning traditional Catholic <strong>pilgrimages</strong> and ‘feigned’ miracles.',
    },
    {
      p1: 'To police religious compliance nationwide, the Crown appointed 125 royal commissioners to conduct sweeping **visitations** across every English and Welsh diocese in autumn 1559, inspecting parish altars, removing superstitious images, administering the Oath of Supremacy, and licensing loyal preachers. Only around **400 clergy** resigned or were dismissed nationwide, allowing most rural parishes to transition smoothly under familiar local vicars.',
      p2: 'Beyond Sunday liturgy, the established Church of England underpinned everyday village order, poor relief, and royal obedience. Ecclesiastical **Church courts** supervised community morality by prosecuting slander, adultery, sabbath-breaking, heresy, and disputed wills, while elected parish churchwardens collected alms and vicars read royal proclamations aloud from the pulpit to a largely illiterate rural population.',
      terms: ['visitations', '400 clergy', 'Church courts'],
      model:
        'Enforced through 1559 royal <strong>visitations</strong> in which only around <strong>400 clergy</strong> lost their posts, the settlement regulated daily community life through ecclesiastical <strong>Church courts</strong>.',
    },
  ],

  lesson_1_3: [
    {
      p1: 'Radical Protestant reformers known as **Puritans** viewed Elizabeth’s 1559 settlement as a lukewarm compromise tainted by popish ceremony. Inspired by John Calvin’s Geneva, returning Marian exiles campaigned to strip parish churches of organs, stained glass, holy days, and silver **crucifix** ornaments—forcing Elizabeth to remove the silver crucifix from her own Royal Chapel when newly appointed Protestant bishops threatened to resign.',
      p2: 'At the **1563 Convocation** of clergy, Puritan reformers came within a single vote of abolishing kneeling at communion, saints’ feast days, and organ music altogether. Elizabeth regarded such clerical activism as a direct assault on her royal prerogative as Supreme Governor, insisting that once Parliament had settled worship, subjects owed silent obedience.',
      terms: ['Puritans', 'crucifix', '1563 Convocation'],
      model:
        'Zealous <strong>Puritans</strong> forced the removal of the Royal Chapel <strong>crucifix</strong> and came within one vote of radical liturgical reform at the <strong>1563 Convocation</strong>.',
    },
    {
      p1: 'Clerical resistance peaked in the mid-1560s over traditional priestly vestments. Zealous Puritans refused to wear the plain white linen **surplice** and square cap prescribed by the Ornaments Rubric, condemning special priestly garments as ‘rags of Rome’. Determined to enforce outward uniformity, Elizabeth ordered Archbishop of Canterbury **Matthew Parker** to issue his 1566 **Book of Advertisements** setting strict rules for clerical dress.',
      p2: 'When Parker summoned 110 London ministers to Lambeth Palace in March 1566 to inspect compliant model outfits, **37 Puritan priests** refused to conform and were promptly suspended and deprived of their church livings. Lacking noble military backing or any viable Protestant alternative to Elizabeth, most remaining Puritans grudgingly wore the surplice rather than lose their parish pulpits.',
      terms: ['surplice', 'Matthew Parker', 'Book of Advertisements'],
      model:
        'When Puritans rejected the white linen <strong>surplice</strong>, Archbishop <strong>Matthew Parker</strong> issued the 1566 <strong>Book of Advertisements</strong> and dismissed 37 non-conforming London ministers.',
    },
    {
      p1: 'Domestic Catholic opposition initially remained subdued and largely passive during the early 1560s. Thousands of traditionalists acted as **Church Papists**, attending Anglican parish services on Sundays to escape the twelve-penny recusancy fine while hearing Latin Mass privately inside gentry manor houses whenever opportunity arose, especially across northern shires where sympathetic Catholic earls and lax local JPs ignored recusancy.',
      p2: 'Elizabeth reinforced domestic calm by refusing to make ‘windows into men’s souls’ so long as Catholic subjects stayed politically loyal, while Pope Pius IV issued no immediate excommunication against her. By 1566–68, however, the militant European **Counter-Reformation** hardened attitudes: **Pope Pius V** forbade English Catholics from attending Protestant church services and William Allen founded the Douai seminary.',
      terms: ['Church Papists', 'Counter-Reformation', 'Pope Pius V'],
      model:
        'Although many Catholics initially conformed outwardly as <strong>Church Papists</strong>, the European <strong>Counter-Reformation</strong> and <strong>Pope Pius V</strong>’s 1566 instruction sharpened religious division.',
    },
    {
      p1: 'Abroad, escalating European religious conflict reshaped England’s strategic security. When the **French Wars of Religion** erupted in 1562, Elizabeth briefly sent money and troops to aid French Huguenot Protestants in hopes of regaining Calais, though English defeat at Le Havre ended the venture under the 1564 Treaty of Troyes while keeping France too divided internally to threaten England.',
      p2: 'Far graver strategic danger emerged across the narrow sea in the Spanish Netherlands. In 1567 Catholic King Philip II dispatched the ruthless **Duke of Alba** with 10,000 veteran Spanish troops to crush Dutch Protestant protests and heresy. Alba established the notorious **Council of Troubles** (‘Council of Blood’), executing thousands of Dutch Protestants and stationing a battle-hardened Catholic army just across the Channel.',
      terms: ['French Wars of Religion', 'Duke of Alba', 'Council of Troubles'],
      model:
        'While the <strong>French Wars of Religion</strong> distracted France, Philip II sent the <strong>Duke of Alba</strong> and his brutal <strong>Council of Troubles</strong> into the neighbouring Netherlands in 1567.',
    },
    {
      p1: 'In November 1568, Anglo-Spanish friction escalated sharply when five Spanish vessels carrying **£85,000** in gold bullion borrowed from Italian bankers took shelter in Plymouth and Southampton from Channel storms and French privateers. The treasure—known as the **Genoese Loan**—was urgently bound for Antwerp to pay the Duke of Alba’s Spanish army operating in the Netherlands.',
      p2: 'Advised by William Cecil to weaken Spanish military power in Flanders, Elizabeth audaciously impounded the bullion on the legal technicality that the gold still belonged to Genoese bankers until safely delivered to Antwerp, transferring the loan to the English Crown instead. Outraged, Alba seized English merchant ships and imposed a punishing **Antwerp trade embargo**, paralysing London cloth exports.',
      terms: ['£85,000', 'Genoese Loan', 'Antwerp trade embargo'],
      model:
        'Elizabeth’s November 1568 seizure of the <strong>£85,000</strong> <strong>Genoese Loan</strong> deprived Alba’s troops of pay and provoked a retaliatory <strong>Antwerp trade embargo</strong>.',
    },
  ],

  lesson_1_4: [
    {
      p1: 'In May 1568, the unexpected arrival of Catholic **Mary, Queen of Scots** in Cumbria confronted Elizabeth with an acute dynastic emergency. As the Catholic granddaughter of Henry VIII’s elder sister **Margaret Tudor**, Mary possessed an unimpeachable legitimate Tudor bloodline, making her the natural heir presumptive—and in strict Catholic eyes, England’s rightful reigning monarch.',
      p2: 'Unlike unmarried Elizabeth, Mary had already given birth to a healthy male heir, Prince **James VI**, in June 1566 after marrying her cousin Henry Stuart, Lord Darnley. Even as a penniless fugitive stripped of her Scottish crown, Mary immediately became a dangerous political magnet for disaffected English Catholic nobles hoping to topple Cecil and restore Roman Catholicism.',
      terms: ['Mary, Queen of Scots', 'Margaret Tudor', 'James VI'],
      model:
        'Descended legitimately from <strong>Margaret Tudor</strong> and mother to infant heir <strong>James VI</strong>, <strong>Mary, Queen of Scots</strong> posed an immediate Catholic rival claim to Elizabeth’s crown.',
    },
    {
      p1: 'Mary’s Scottish reign had collapsed amidst sensational aristocratic violence in Edinburgh. Deeply resentful of her drunken, violent second husband **Lord Darnley**—who had helped murder her Italian secretary David Rizzio before her eyes—Mary was implicated when a massive gunpowder explosion destroyed Darnley’s lodging at **Kirk o’ Field** in February 1567 and Darnley was found strangled outside in the orchard.',
      p2: 'Only three months later, Mary scandalised royal courts across Europe by marrying the chief murder suspect, the ruthless **Earl of Bothwell**. Outraged Protestant Scottish lords rose in armed rebellion, confronted Mary’s dwindling forces at Carberry Hill in June 1567, drove Bothwell into Scandinavian exile, and paraded a humiliated Mary back through hostile Edinburgh crowds.',
      terms: ['Lord Darnley', 'Kirk o’ Field', 'Earl of Bothwell'],
      model:
        'Following the murder of <strong>Lord Darnley</strong> at <strong>Kirk o’ Field</strong> in February 1567, Mary’s hasty marriage to suspect <strong>Earl of Bothwell</strong> sparked a Protestant noble rebellion.',
    },
    {
      p1: 'Imprisoned on an island fortress at **Lochleven** Castle in July 1567, Mary was forced by rebel Protestant lords to abdicate in favour of her one-year-old son James VI under the regency of her Protestant half-brother, the **Earl of Moray**. In May 1568 Mary escaped Lochleven, raised 6,000 supporters, lost at Langside, and fled by fishing boat across the Solway Firth into England.',
      p2: 'Mary’s arrival trapped Elizabeth in an acute diplomatic dilemma. Sending English troops to restore a deposed Catholic monarch would alienate friendly Protestant Scotland; handing Mary back risked executing an anointed sovereign; allowing her abroad risked French military intervention; keeping her under **house arrest** inside England invited endless domestic Catholic plots.',
      terms: ['Lochleven', 'Earl of Moray', 'house arrest'],
      model:
        'After escaping <strong>Lochleven</strong> and fleeing the Protestant regency of the <strong>Earl of Moray</strong>, Mary was placed under guarded <strong>house arrest</strong> inside northern England.',
    },
    {
      p1: 'Seeking to discredit Mary politically without putting a fellow anointed monarch on criminal trial, Elizabeth convened a formal commission of inquiry at **York** (later moved south to Westminster) between October 1568 and January 1569. Scottish Regent Moray dramatically produced eight French **Casket Letters** and love sonnets allegedly written by Mary to Bothwell proving she had plotted Darnley’s assassination.',
      p2: 'Mary’s representatives condemned the letters as Protestant rebel forgeries and demanded she address Elizabeth face-to-face, which Elizabeth flatly refused. In January 1569 William Cecil delivered a calculated **not proven verdict**: neither clearing Moray of treasonous rebellion nor pronouncing Mary innocent, thereby giving Elizabeth a convenient diplomatic pretext to hold Mary captive indefinitely.',
      terms: ['York', 'Casket Letters', 'not proven verdict'],
      model:
        'Convened at <strong>York</strong> in October 1568 to inspect the disputed <strong>Casket Letters</strong>, Elizabeth’s inquiry issued a deliberate <strong>not proven verdict</strong> to justify keeping Mary detained.',
    },
    {
      p1: 'In early 1569 Elizabeth transferred Mary south to Tutbury Castle and Sheffield Manor under the watchful, expensive custody of George Talbot, **Earl of Shrewsbury**. Despite strict surveillance, Mary’s continued captivity inside England immediately inspired an aristocratic **court marriage plot** backed secretly by courtiers including Robert Dudley, who hoped marrying Mary to an English Protestant peer would settle the succession.',
      p2: 'The chosen groom was England’s wealthiest premier peer, Thomas Howard, **Duke of Norfolk**. When the Catholic Earls of Northumberland and Westmorland widened the secret scheme toward toppling Cecil and restoring Catholicism—and a terrified Dudley confessed everything to a furious Elizabeth in September 1569—Norfolk was clapped into the Tower, igniting northern rebellion.',
      terms: ['Earl of Shrewsbury', 'court marriage plot', 'Duke of Norfolk'],
      model:
        'Held in custody under the <strong>Earl of Shrewsbury</strong>, Mary soon became the centre of a secret 1569 <strong>court marriage plot</strong> involving the <strong>Duke of Norfolk</strong>.',
    },
  ],

  lesson_2_1: [
    {
      p1: 'Following Norfolk’s arrest, the **Northern Earls**—Catholic magnates Thomas Percy, Earl of Northumberland, and Charles Neville, Earl of Westmorland—launched an armed uprising in November 1569 to rescue Mary Stuart from Tutbury and restore Catholicism. Marching 4,600 men into **Durham Cathedral**, rebels tore up the English Bible and prayer book and celebrated a defiant Latin Mass.',
      p2: 'However, promised Spanish troops from Alba never landed at Hartlepool, most loyal northern gentry stood by the Queen, and Elizabeth moved Mary south to Coventry before dispatching a large royal army under the Earl of Sussex. As the earls fled into Scotland, Elizabeth ordered **450 rebels executed** under martial law across northern villages and confiscated rebel estates under the reconstituted Council of the North.',
      terms: ['Northern Earls', 'Durham Cathedral', '450 rebels executed'],
      model:
        'After the <strong>Northern Earls</strong> celebrated Latin Mass in <strong>Durham Cathedral</strong> in November 1569, royal troops crushed the revolt and left <strong>450 rebels executed</strong> across the north.',
    },
    {
      p1: 'Too late to rally support for the northern rebels, Pope Pius V issued the papal bull **Regnans in Excelsis** in February 1570, formally excommunicating Elizabeth as a heretic and commanding English Catholics to end their allegiance to her. Overnight, every devout English Catholic became a potential traitor in Parliament’s eyes, prompting the harsh **1571 Treasons Act** outlawing papal bulls.',
      p2: 'In 1571 Italian-born Florentine banker Roberto Ridolfi organised the international **Ridolfi Plot**: Philip II promised 10,000 Spanish troops under Alba to invade England, assassinate Elizabeth, and place Mary Stuart on the throne married to Norfolk. Cecil and Walsingham intercepted Ridolfi’s coded letters, leading directly to the **Duke of Norfolk**’s execution for high treason in June 1572.',
      terms: ['Regnans in Excelsis', 'Ridolfi Plot', 'Duke of Norfolk'],
      model:
        'Emboldened by the 1570 papal bull <strong>Regnans in Excelsis</strong>, conspirators hatched the 1571 <strong>Ridolfi Plot</strong>, which Cecil uncovered and punished by executing the <strong>Duke of Norfolk</strong>.',
    },
    {
      p1: 'As Jesuit and seminary priests trained at Douai smuggled themselves into England after 1574—leading to Edmund Campion’s execution and £20 monthly recusancy fines in 1581—Secretary of State **Sir Francis Walsingham** uncovered the **Throckmorton Plot** in November 1583. Under torture, courier Francis Throckmorton confessed a plan for Mary’s cousin, the French Catholic Duke of Guise, to invade Sussex.',
      p2: 'Crucially, Spain’s London ambassador Bernardino de Mendoza was financing the conspiracy with Spanish gold; Elizabeth expelled Mendoza, severing formal diplomatic ties with Madrid. To deter future plots, Cecil and Walsingham created the 1584 **Bond of Association** (enacted into law in 1585), binding signatories to execute anyone on whose behalf an assassination of Elizabeth was attempted.',
      terms: ['Sir Francis Walsingham', 'Throckmorton Plot', 'Bond of Association'],
      model:
        'After <strong>Sir Francis Walsingham</strong> exposed the French-Spanish 1583 <strong>Throckmorton Plot</strong>, ministers drafted the 1584 <strong>Bond of Association</strong> targeting claimants behind regicide plots.',
    },
    {
      p1: 'In 1586 young Derbyshire Catholic gentleman Anthony Babington organised the **Babington Plot** to murder Elizabeth at court, rescue Mary Stuart from Chartley Hall in Staffordshire, and trigger a joint Franco-Spanish Catholic invasion of 60,000 troops backed financially by the Pope. Unknown to Mary, Walsingham’s Catholic double agent Gilbert Gifford routed every coded letter smuggled inside **beer barrels** directly to Walsingham’s desk.',
      p2: 'Master codebreaker **Thomas Phelippes** patiently deciphered every message until, on 17 July 1586, Mary dictated a reply explicitly endorsing the ‘dispatch’ (assassination) of Elizabeth before foreign troops landed. Phelippes forged a postscript requesting the six assassins’ names, enabling Walsingham to arrest Babington, execute the conspirators horribly, and seize Mary’s incriminating papers.',
      terms: ['Babington Plot', 'beer barrels', 'Thomas Phelippes'],
      model:
        'During the 1586 <strong>Babington Plot</strong>, letters hidden in <strong>beer barrels</strong> were decoded by <strong>Thomas Phelippes</strong>, proving Mary had explicitly approved Elizabeth’s murder.',
    },
    {
      p1: 'Put on trial before thirty-six royal commissioners at **Fotheringhay Castle** in October 1586 under the 1585 Act for the Preservation of the Queen’s Safety, Mary was swiftly convicted of high treason. Still agonising over executing an anointed queen and provoking Spanish or Scottish retaliation, Elizabeth delayed until February 1587 before signing the death warrant, which her Privy Council secretly dispatched.',
      p2: 'On **8 February 1587**, forty-four-year-old Mary knelt in the Great Hall at Fotheringhay wearing bright **crimson martyrdom** petticoats—the liturgical colour of Catholic martyrs. Although Scottish King James VI accepted Elizabeth’s tearful apology, Mary had bequeathed her claim to England to Philip II, removing the domestic Catholic figurehead while hardening Spain’s resolve to invade.',
      terms: ['Fotheringhay Castle', '8 February 1587', 'crimson martyrdom'],
      model:
        'Executed at <strong>Fotheringhay Castle</strong> on <strong>8 February 1587</strong> in <strong>crimson martyrdom</strong> robes, Mary eliminated domestic plots while giving Philip II another pretext to invade.',
    },
  ],

  lesson_2_2: [
    {
      p1: 'Throughout the 1570s, Anglo-Spanish relations deteriorated steadily over religious, commercial, and strategic rivalry in the **Spanish Netherlands**. Because Low Countries Channel ports lay directly opposite the Thames estuary and Antwerp dominated English woollen cloth exports, Elizabeth dreaded Spanish absolutism crushing traditional Dutch provincial liberties and establishing a permanent Catholic military springboard facing southern England.',
      p2: 'When Dutch Protestants led by **William of Orange** rebelled against Alba’s harsh taxation and religious persecution, Elizabeth avoided open war while covertly sending secret loans, permitting English Protestant volunteers to fight, and briefly sheltering Dutch **Sea Beggars** before expelling them from English ports in 1572—an expulsion that ironically prompted them to seize Brielle and ignite general Dutch revolt.',
      terms: ['Spanish Netherlands', 'William of Orange', 'Sea Beggars'],
      model:
        'Fearing Spanish troops in the <strong>Spanish Netherlands</strong>, Elizabeth covertly backed <strong>William of Orange</strong> and Dutch Protestant <strong>Sea Beggars</strong> without risking open war.',
    },
    {
      p1: 'Simultaneously, fierce commercial conflict erupted across the Atlantic as English **privateers** challenged King Philip II’s closed imperial monopoly over New World trade. After Spanish warships ambushed John Hawkins and **Francis Drake** at San Juan de Ulúa in 1568, Drake launched daring retaliatory **privateering** raids across the Spanish Main, ambushing silver mule trains at Nombre de Dios in Panama.',
      p2: 'Rather than punishing her captains, Elizabeth secretly invested royal ships and capital into syndicates licensing legalised maritime plunder against Spanish shipping while issuing polite diplomatic denials to Madrid. After mutinous unpaid Spanish troops sacked Antwerp in the brutal **Spanish Fury** of November 1576, Elizabeth lent the Dutch Estates £100,000 under the Pacification of Ghent.',
      terms: ['privateers', 'Francis Drake', 'Spanish Fury'],
      model:
        'While English <strong>privateers</strong> led by <strong>Francis Drake</strong> raided Spanish Caribbean silver, the 1576 <strong>Spanish Fury</strong> at Antwerp deepened Elizabeth’s financial aid to Dutch rebels.',
    },
    {
      p1: 'In December 1577 Elizabeth secretly backed Drake’s expedition of five ships from Plymouth with orders to sail through the Strait of Magellan and raid Spanish Pacific possessions—while publicly claiming he was bound for Alexandria. Surviving fierce Magellan gales in his renamed flagship **Golden Hind**, Drake attacked unfortified Spanish ports up the coasts of Chile and Peru.',
      p2: 'In March 1579 Drake captured Spain’s premier Pacific treasure galleon, nicknamed the **Cacafuego**, seizing over £140,000 in silver bars, gold, and jewels before sailing across the Pacific and Indian oceans. Returning to Plymouth in September 1580 with roughly **£400,000** in total plunder, Drake gave Elizabeth enough Crown share to clear England’s entire national debt.',
      terms: ['Golden Hind', 'Cacafuego', '£400,000'],
      model:
        'Sailing the <strong>Golden Hind</strong> into the Pacific, Drake captured the treasure ship <strong>Cacafuego</strong> and returned in 1580 with roughly <strong>£400,000</strong> in Spanish bullion.',
    },
    {
      p1: 'Furious at Drake’s Pacific raids—and newly emboldened after annexing Portugal and its Atlantic war fleet in 1580—King Philip II instructed ambassador Mendoza to demand Drake’s immediate execution as a pirate and complete restitution of the captured treasure. Instead, in April 1581 Elizabeth boarded the *Golden Hind* at **Deptford** on the River Thames and publicly awarded **Drake’s knighthood** upon the quarterdeck.',
      p2: 'Deliberately handing the ceremonial gilded sword to a visiting French royal diplomat while courting the Catholic **Duke of Alençon** as a marriage suitor and financing his Dutch intervention, Elizabeth signalled an anti-Spanish alignment with France. Publicly honouring ‘El Draque’ humiliated Philip II before all Europe, proving the English Crown endorsed maritime challenges to Spain’s empire.',
      terms: ['Deptford', 'Drake’s knighthood', 'Duke of Alençon'],
      model:
        'By boarding the *Golden Hind* at <strong>Deptford</strong> in April 1581 to confer <strong>Drake’s knighthood</strong> while courting the French <strong>Duke of Alençon</strong>, Elizabeth openly defied Philip II.',
    },
    {
      p1: 'By 1584 indirect diplomacy collapsed altogether. Under the brilliant Spanish general **Duke of Parma**, Spain steadily reconquered southern Dutch towns; then on 10 July 1584 a Catholic assassin shot dead rebel leader William of Orange at Delft. Worse still, in December 1584 Philip II signed the **Treaty of Joinville** with the French Catholic League to eradicate Protestantism.',
      p2: 'With France neutralised by Catholic League civil war and Antwerp falling to Parma, Elizabeth could no longer rely on surrogates. On 10 August 1585 she signed the **Treaty of Nonsuch** with the Dutch Protestant Estates, pledging 7,400 English soldiers under Robert Dudley, Earl of Leicester—an act Philip II treated as an open declaration of Anglo-Spanish war.',
      terms: ['Duke of Parma', 'Treaty of Joinville', 'Treaty of Nonsuch'],
      model:
        'Alarmed by the <strong>Duke of Parma</strong>’s advances, Orange’s assassination, and the 1584 <strong>Treaty of Joinville</strong>, Elizabeth signed the August 1585 <strong>Treaty of Nonsuch</strong>.',
    },
  ],

  lesson_2_3: [
    {
      p1: 'Landing in the Netherlands in December 1585 with 7,400 men after England garrisoned the cautionary ports of **Flushing** and Brielle, **Robert Dudley**, Earl of Leicester, immediately enraged Elizabeth in January 1586 by accepting the supreme title **Governor-General** of the United Provinces without consulting her. Furious that accepting sovereignty openly repudiated Philip II’s hereditary rule, Elizabeth publicly humiliated Dudley before the Dutch.',
      p2: 'Throughout 1586–87 Elizabeth deliberately starved the expedition of money, siege artillery, and reinforcements, hoping still to negotiate a compromise peace with Madrid while unpaid English troops suffered hunger and desertion. Even so, Dudley’s garrisons slowed the **Duke of Parma**’s coastal advance and held the deep-water port of Ostend, denying Spain an easy Channel anchorage.',
      terms: ['Robert Dudley', 'Governor-General', 'Duke of Parma'],
      model:
        'Sent to check the <strong>Duke of Parma</strong>, <strong>Robert Dudley</strong> infuriated Elizabeth in 1586 by accepting the Dutch title <strong>Governor-General</strong> while his troops went underfunded.',
    },
    {
      p1: 'Militarily and politically, Leicester’s Dutch campaign suffered demoralising blows. During the autumn 1586 skirmish outside **Zutphen**, celebrated Protestant courtier-poet Sir Philip Sidney was mortally wounded, and in January 1587 two Catholic English officers appointed by Leicester—Sir William Stanley and **Rowland Yorke**—treacherously surrendered the vital town of **Deventer** and Zutphen fort directly to Parma’s Spanish army.',
      p2: 'Stanley and Yorke’s shocking defection shattered Dutch confidence in English loyalty, especially as rumours spread of secret Anglo-Spanish peace talks and English privateers disrupted Dutch Baltic shipping. Unable to cooperate smoothly with the merchant-led Dutch States-General or match Parma’s 30,000 veteran soldiers, a discredited Dudley was permanently recalled to England by Elizabeth in late 1587.',
      terms: ['Zutphen', 'Rowland Yorke', 'Deventer'],
      model:
        'Following bloody fighting at <strong>Zutphen</strong>, the January 1587 defection of Stanley and <strong>Rowland Yorke</strong> at <strong>Deventer</strong> destroyed Dutch trust in Leicester’s command.',
    },
    {
      p1: 'Learning from Walsingham’s spies in early 1587 that Philip II—spurred by Nonsuch and Mary Stuart’s execution—was assembling a vast invasion Armada, Elizabeth ordered Francis Drake to strike pre-emptively against Spanish ports. On 19 April 1587 Drake sailed twenty-four warships boldly into **Cadiz** harbour—Spain’s busiest naval arsenal—in a daring raid nicknamed **‘Singeing the King of Spain’s Beard’**.',
      p2: 'Over three days of chaotic bombardment Drake’s gunners burned or sank **30 Spanish ships** and destroyed thousands of tonnes of naval provisions before raiding the Algarve coast and capturing the rich Portuguese spice carrack *San Felipe* (£108,000) off the Azores. Crucially, diverting Santa Cruz’s warships to hunt Drake delayed the Armada’s launch by an entire vital year until 1588.',
      terms: ['Cadiz', '‘Singeing the King of Spain’s Beard’', '30 Spanish ships'],
      model:
        'Drake’s April 1587 raid on <strong>Cadiz</strong>—<strong>‘Singeing the King of Spain’s Beard’</strong>—destroyed <strong>30 Spanish ships</strong> and delayed Philip II’s invasion by twelve crucial months.',
    },
    {
      p1: 'Drake’s coastal raids off Cape St Vincent also inflicted hidden logistical ruin by burning huge stockpiles of seasoned **barrel staves** and hoops intended for the Armada’s food and water casks. Forced to manufacture hasty replacements from damp, unseasoned green pine timber, Spanish victuallers loaded leaky barrels that warped at sea, turning salted meat, ship’s biscuit, and drinking water foul.',
      p2: 'Spanish naval command weakened further in February 1588 when Madrid’s most experienced fighting admiral, the Marquis of Santa Cruz, died suddenly in Lisbon. Philip II appointed the reluctant aristocratic **Duke of Medina Sidonia**—an able shore administrator who candidly protested his lack of sea combat experience and chronic **seasickness**—ordering him strictly to obey inflexible royal instructions.',
      terms: ['barrel staves', 'Duke of Medina Sidonia', 'seasickness'],
      model:
        'After Drake burned Spain’s seasoned <strong>barrel staves</strong>, Philip II placed the reluctant, <strong>seasickness</strong>-prone <strong>Duke of Medina Sidonia</strong> in command of a fleet carrying spoiling supplies.',
    },
    {
      p1: 'After violent spring storms forced emergency hull repairs at Corunna, the **130 ships** of Spain’s Great Armada carrying roughly 30,000 sailors and soldiers entered the English Channel at the end of July 1588. Philip II’s grand invasion strategy required Medina Sidonia to sail up the Channel to **Calais** and Flanders, link up with Parma’s 27,000 veteran troops, and escort their barges across to Kent.',
      p2: 'Yet Philip’s rigid blueprint contained a fatal structural flaw: Parma controlled **no deep-water port** in Flanders, meaning his unarmed, flat-bottomed troop barges needed forty-eight hours of calm weather to emerge through shallow coastal canals blockaded by nimble **Dutch flyboats** under Justin of Nassau, while slow courier boats prevented Medina Sidonia and Parma from timing their rendezvous.',
      terms: ['130 ships', 'Calais', 'Dutch flyboats'],
      model:
        'Although Medina Sidonia’s <strong>130 ships</strong> reached <strong>Calais</strong> intact, Parma lacked a deep-water harbour and remained bottled up in shallow canals by <strong>Dutch flyboats</strong>.',
    },
  ],

  lesson_2_4: [
    {
      p1: 'Sighted off the Lizard on 29 July 1588, Medina Sidonia’s Armada advanced up the English Channel in a tight seven-mile **crescent formation**, stationing heavy fighting galleons on its horned wings to protect slower supply hulks in the centre. Warping out of Plymouth against the wind, **Lord Howard of Effingham**, Francis Drake, and John Hawkins seized the windward weather gauge behind the Spaniards.',
      p2: 'Over six days of running skirmishes past Plymouth, Portland Bill, and the **Isle of Wight**, agile English ships avoided Spanish grappling hooks and fired stand-off cannon salvos. Although few Spanish ships sank in the Channel, Howard prevented Medina Sidonia from seizing an anchorage in the Solent, herding the Armada onward to exposed Calais Roads on 6 August.',
      terms: ['crescent formation', 'Lord Howard of Effingham', 'Isle of Wight'],
      model:
        'Pursued by <strong>Lord Howard of Effingham</strong>, the Armada held its defensive <strong>crescent formation</strong> past the <strong>Isle of Wight</strong> but failed to secure a sheltered English anchorage.',
    },
    {
      p1: 'Anchored off exposed **Calais Roads** on 6 August, Medina Sidonia learned to his dismay that Parma’s army at Dunkirk needed another week to embark and possessed no warships to clear Dutch blockaders. Seizing the moment around midnight on **7 August 1588**, Howard and Drake packed eight old vessels with pitch, brimstone, gunpowder, and double-shotted guns, setting these blazing **fireships** drifting on wind and tide toward the anchored Spaniards.',
      p2: 'Dreading catastrophic floating ‘hell-burners’ used previously against Spanish bridges at Antwerp, panic-stricken Spanish captains **cut anchor cables** in the darkness and scattered out into the open North Sea. Although not a single Spanish galleon burned that night, the Armada lost its primary heavy anchors and broke its disciplined crescent formation completely.',
      terms: ['Calais Roads', 'fireships', 'cut anchor cables'],
      model:
        'When eight English <strong>fireships</strong> drifted into <strong>Calais Roads</strong> at midnight on 7 August, terrified Spanish captains <strong>cut anchor cables</strong> and shattered their defensive crescent.',
    },
    {
      p1: 'At dawn on 8 August 1588, the decisive nine-hour Battle of **Gravelines** erupted off the treacherous Flemish sandbanks. Closing to destructive cannon range of under a hundred yards aboard fast, low-built **race-built galleons** pioneered by Naval Treasurer John Hawkins, English squadrons repeatedly out-turned high-castled Spanish ships while shallow Flemish waters and Dutch flyboats barred Parma from coming out.',
      p2: 'Mounted on compact four-wheeled naval gun-carriages, long-range English bronze **culverins** fired three times faster than cumbersome Spanish guns manned by soldiers trained primarily to fire one volley and board enemy decks. Relentless English broadsides sank or drove aground five major Spanish ships, inflicted over 1,000 casualties, and permanently ruined any chance of invading Kent.',
      terms: ['Gravelines', 'race-built galleons', 'culverins'],
      model:
        'At the 8 August Battle of <strong>Gravelines</strong>, nimble English <strong>race-built galleons</strong> armed with fast-reloading <strong>culverins</strong> battered the scattered Spanish fleet.',
    },
    {
      p1: 'Blocked by the pursuing English fleet behind them and treacherous Flemish shoals ahead, a fierce south-westerly gale—celebrated across Protestant England as the **‘Protestant Wind’**—drove Medina Sidonia’s battered fleet north into the open North Sea on 9 August. Critically short of cannonballs, leaking badly, and drinking putrid water from green-wood barrels, the Armada had to limp home around Scotland and **Ireland**.',
      p2: 'Uncharted North Atlantic autumn tempests turned Spain’s retreat into utter catastrophe: lacking spare heavy anchors cut at Calais and guided by inaccurate charts of the Gulf Stream, over twenty-five Spanish vessels wrecked along rocky Scottish and Irish coasts where thousands drowned or were killed ashore. Barely **67 ships**—roughly half the original fleet—straggled back to Spain with over 15,000 men lost.',
      terms: ['‘Protestant Wind’', 'Ireland', '67 ships'],
      model:
        'Driven north by the <strong>‘Protestant Wind’</strong> into Atlantic gales off Scotland and <strong>Ireland</strong>, barely <strong>67 ships</strong> of Spain’s shattered Armada returned home.',
    },
    {
      p1: 'Even while the shattered Armada fled north, England remained braced against Parma’s army in Flanders; on 18 August Elizabeth rode in silver breastplate before 4,000 militia mustered by Leicester at **Tilbury** in Essex, famously declaring she possessed ‘the heart and stomach of a king, and of a king of England too’. Victory reinforced Elizabeth’s personal authority despite her gender and strengthened English Protestant national pride.',
      p2: 'Royal propaganda struck commemorative silver medals inscribed *Flavit Jehovah et Dissipati Sunt*—**‘God blew and they were scattered’**—portraying Protestant England as divinely favoured. Strategically, defeating the Armada preserved Dutch Protestant independence, confirmed English **naval prestige** across the Atlantic, and ended immediate danger of Spanish conquest even as costly war dragged on until 1604.',
      terms: ['Tilbury', '‘God blew and they were scattered’', 'naval prestige'],
      model:
        'Celebrated in Elizabeth’s <strong>Tilbury</strong> speech and medals proclaiming <strong>‘God blew and they were scattered’</strong>, 1588 secured Protestant survival and lasting English <strong>naval prestige</strong>.',
    },
  ],

  lesson_3_1: [
    {
      p1: 'Sixteenth-century English education reflected humanist learning and Protestant belief that Christians should read the vernacular Bible, yet access remained sharply divided by class and gender. Overall **literacy** rose to roughly **30% of men** and **10% of women** by the end of Elizabeth’s reign—concentrated overwhelmingly among gentry, merchants, and yeomen rather than rural farm labourers, whose children worked from age six.',
      p2: 'Boys of the middling sort attended elementary **petty schools** in a teacher’s home to learn basic English reading, writing, and arithmetic, while some girls attended **dame schools** focused on reading, sewing, and housework. Above all, Tudor schooling aimed to reinforce the **Great Chain of Being**, teaching every child obedience to God, monarch, and social superiors.',
      terms: ['literacy', 'petty schools', 'Great Chain of Being'],
      model:
        'Although male <strong>literacy</strong> rose to 30% through elementary <strong>petty schools</strong>, Elizabethan education primarily reinforced hierarchy under the <strong>Great Chain of Being</strong>.',
    },
    {
      p1: 'The greatest educational expansion occurred in fee-paying town **grammar schools**: forty-two were founded in the 1560s and thirty more in the 1570s by wealthy Protestant benefactors and merchant guilds, replacing dissolved monastic schools. Attended by bright boys aged ten to fourteen from gentry, professional, merchant, and yeoman families (plus talented scholarship boys), school days ran from 6 a.m. to 5 p.m.',
      p2: 'Grammar schools taught a demanding **classical curriculum** centred on **Latin** and Greek authors such as Cicero, Virgil, and Seneca alongside public rhetoric, scripture, archery, and strict corporal punishment supervised by student monitors. Meanwhile, merchants’ and craftsmen’s sons without Latin followed petty-to-apprenticeship routes learning practical book-keeping, commercial arithmetic, and skilled urban trades.',
      terms: ['grammar schools', 'classical curriculum', 'Latin'],
      model:
        'Over seventy newly endowed Elizabethan <strong>grammar schools</strong> trained gentry, merchant, and yeoman boys in a rigorous <strong>classical curriculum</strong> dominated by <strong>Latin</strong>.',
    },
    {
      p1: 'Children of the titled nobility were educated privately at home by prestigious **private tutors**—just as humanist scholar Roger Ascham had tutored young Princess Elizabeth. Noble boys learned Latin, Greek, French, history, philosophy, fencing, and horsemanship, whereas noble girls studied languages, music, courtly dancing, needlework, and household management to secure advantageous aristocratic marriages while remaining barred from universities.',
      p2: 'At fourteen or fifteen, wealthy gentlemen’s sons progressed to **Oxford and Cambridge**, where Protestant colleges such as Emmanuel College (1584) and Jesus College (1571) expanded rapidly to train loyal, educated Anglican clergy and royal officials. Many gentry sons also studied English common law in London at the **Inns of Court** rather than entering church ministry.',
      terms: ['private tutors', 'Oxford and Cambridge', 'Inns of Court'],
      model:
        'Educated initially by <strong>private tutors</strong> at home, noble and gentry sons completed higher study at <strong>Oxford and Cambridge</strong> or London’s legal <strong>Inns of Court</strong>.',
    },
    {
      p1: 'Elizabethan leisure pastimes were equally stratified by social rank, landownership, and gender. Only wealthy nobles and landed gentry possessed walled deer parks and legal game rights for exclusive **hunting and hawking**, fenced with rapiers, played expensive indoor **real tennis**, danced courtly galliards, composed lute music, and collected costly printed histories and classical poetry.',
      p2: 'Working husbandmen, rural labourers, and townsfolk played boisterous parish **folk football**—violent village-wide matches with few written rules, unlimited players, and frequent broken bones—and wrestled on church holy days. Yet commercial blood sports united every social class: Elizabethans from Privy Councillors down to apprentices paid pennies at Southwark’s Paris Garden to gamble fiercely on **bear-baiting**, bull-baiting, and cock-fighting.',
      terms: ['hunting and hawking', 'folk football', 'bear-baiting'],
      model:
        'While elites pursued exclusive <strong>hunting and hawking</strong> and commoners played rough <strong>folk football</strong>, rich and poor alike crowded Southwark rings for <strong>bear-baiting</strong>.',
    },
    {
      p1: 'Secular Elizabethan drama blossomed after the 1572 Vagabonds Act required touring actors to secure a nobleman’s licence—producing troupes like Leicester’s Men and the **Queen’s Men** (1583). In 1576 actor **James Burbage** built England’s first permanent purpose-built playhouse, **‘The Theatre’**, in Shoreditch outside City of London jurisdiction, soon followed by the Curtain (1577) and the Rose (1587).',
      p2: 'Performances drew up to 2,000 spectators across every class: poorer **groundlings** paid just one penny to stand in the open pit around the thrust stage while wealthy gentry paid extra for cushioned gallery boxes or seats upon the stage itself. Conversely, **Puritans** and London aldermen denounced theatres for spreading bubonic plague, attracting pickpockets, and encouraging sinful idleness.',
      terms: ['James Burbage', '‘The Theatre’', 'groundlings'],
      model:
        'After <strong>James Burbage</strong> built <strong>‘The Theatre’</strong> at Shoreditch in 1576, one-penny <strong>groundlings</strong> and gallery gentry watched vibrant plays despite fierce Puritan opposition.',
    },
  ],

  lesson_3_2: [
    {
      p1: 'Poverty and vagrancy surged dangerously across Elizabeth’s reign primarily due to rapid demographic growth: England’s population climbed by roughly 35%, rising from around **3 million to 4 million** people between 1551 and 1601. Major towns like London and Norwich expanded fastest while stagnant agricultural output struggled to feed extra mouths, pushing up farm rents and food prices.',
      p2: 'Rural hardship deepened sharply whenever wet weather brought consecutive **bad harvests** (especially 1573–77), causing severe grain shortages and rapid **price inflation** lingering from earlier Tudor coin debasement. With a surplus of labourers competing for scarce work, **real wages** fell sharply while the 1563 Statute of Artificers capped maximum wages, forcing landless families below subsistence.',
      terms: ['3 million to 4 million', 'bad harvests', 'price inflation'],
      model:
        'As England’s population rose from <strong>3 million to 4 million</strong>, repeated <strong>bad harvests</strong> and severe <strong>price inflation</strong> eroded real wages and multiplied rural poverty.',
    },
    {
      p1: 'Structural changes in countryside farming drove thousands more rural labourers off the land. Because raw wool and woollen cloth accounted for over **80% of exports**, profit-minded gentry landlords increasingly practiced **enclosure**—hedging open village strip-fields and shared common grazing land into private fenced pastures to expand commercial **sheep farming** rather than labour-intensive arable grain.',
      p2: 'Whereas ploughing, sowing, and harvesting corn employed whole rural parishes year-round, tending enclosed **sheep** pasture required barely one tenth the workforce while driving up entry fines (**rack-renting**) and shrinking local grain supplies. Evicted tenant cottagers and unemployed farmhands drifted toward crowded market towns—further hit whenever Spanish trade embargoes disrupted Antwerp cloth sales—swelling bands of wandering homeless rural families.',
      terms: ['80% of exports', 'enclosure', 'sheep'],
      model:
        'Driven by booming wool profits worth <strong>80% of exports</strong>, rural <strong>enclosure</strong> for low-labour <strong>sheep</strong> farming evicted tenant families and caused rural unemployment.',
    },
    {
      p1: 'Elizabethan society divided the poor into two distinct moral and legal categories: the **impotent poor** (or deserving poor—young orphans, widows, the elderly, sick, and disabled physically unable to work, who merited sympathetic parish charity) versus **sturdy beggars** (the idle or undeserving poor—able-bodied adults suspected of choosing criminal idleness over honest daily labour).',
      p2: 'Public anxiety over wandering masterless men was whipped up by Kent magistrate **Thomas Harman**’s popular 1567 illustrated book *A Caveat for Common Cursitors*, which exposed underworld tricks such as ‘counterfeit cranks’ chewing soap to fake epilepsy and ‘Tom o’ Bedlams’ feigning madness. Lacking any salaried police force, gentry JPs feared vagrant bands spread bubonic plague, violent crime, and **rebellion**.',
      terms: ['impotent poor', 'sturdy beggars', 'Thomas Harman'],
      model:
        'While parishes pitied the <strong>impotent poor</strong>, pamphlets by <strong>Thomas Harman</strong> fuelled elite fear that deceitful <strong>sturdy beggars</strong> threatened crime and rebellion.',
    },
    {
      p1: 'Following the 1569 Northern Revolt, Parliament passed the **1572 Vagabonds Act** combining national welfare taxation with fierce physical deterrence. For the first time nationwide, local Justices of the Peace had to compile an official register of deserving poor and levy a weekly **compulsory poor rate** upon every wealthy parish householder—imprisoning anyone who refused to contribute.',
      p2: 'Simultaneously, the 1572 statute imposed harsh corporal terror upon able-bodied vagrants aged over fourteen caught begging without a JP’s licence: first-time offenders were whipped naked through market towns and **bored through the ear** with a red-hot iron an inch thick; a second offence within sixty days meant hanging as a felon unless an employer hired them.',
      terms: ['1572 Vagabonds Act', 'compulsory poor rate', 'bored through the ear'],
      model:
        'The <strong>1572 Vagabonds Act</strong> introduced a national <strong>compulsory poor rate</strong> for the deserving poor while ordering unlicensed vagrants whipped and <strong>bored through the ear</strong>.',
    },
    {
      p1: 'By mid-decade MPs recognised a crucial shift in social attitudes: recurring cloth-trade slumps meant many able-bodied poor genuinely could not find work. The **1576 Poor Relief Act** therefore instructed town and parish officials to purchase parish stocks of **raw wool**, flax, iron, and hemp so willing unemployed residents could spin yarn and earn an honest wage.',
      p2: 'Those able-bodied vagrants who still stubbornly refused parish work were sent not to ordinary county gaols, but to newly established houses of correction known as **Bridewells** (named after London’s Bridewell Palace), where inmates endured strict hard labour to reform their habits. Together, the 1572 and 1576 statutes established state responsibility for unemployment underpinning the 1601 Poor Law.',
      terms: ['1576 Poor Relief Act', 'raw wool', 'Bridewells'],
      model:
        'Marking a more constructive attitude, the <strong>1576 Poor Relief Act</strong> supplied <strong>raw wool</strong> to the genuinely unemployed while confining stubborn refusers in county <strong>Bridewells</strong>.',
    },
  ],

  lesson_3_3: [
    {
      p1: 'Elizabethan oceanic voyages depended upon major scientific advances in mathematical navigation and cartography. Mariners calculated north-south latitude far out of sight of coastlines using heavy brass **astrolabes** and more stable marine **quadrants** (or John Davis’s back-staff) to measure the angle of the midday sun or Polaris above the horizon alongside translated Spanish manuals like *The Art of Navigation* (1561).',
      p2: 'Open-ocean course-plotting was revolutionised in 1569 when Flemish cartographer Gerardus **Mercator** published his cylindrical world map projection laying out parallel lines of latitude and longitude on a flat compass grid. Combined with standardized printed charts, magnetic compasses, and knotted chip logs, English captains navigated transatlantic waters with far greater precision and survival rates.',
      terms: ['astrolabes', 'quadrants', 'Mercator'],
      model:
        'Armed with brass <strong>astrolabes</strong>, marine <strong>quadrants</strong>, and Gerardus <strong>Mercator</strong>’s 1569 world map projection, Elizabethan navigators plotted reliable transatlantic courses.',
    },
    {
      p1: 'Simultaneously, English royal shipyards transformed vessel engineering. Replacing slow, top-heavy medieval carracks built primarily as floating castles for boarding soldiers, Royal Navy Treasurer John Hawkins developed sleek **race-built galleons** from the 1570s: longer, narrower hulls with lowered forecastles and stern castles reduced wind drag, improved stability in Atlantic gales, and carried larger water and food stores for oceanic voyages.',
      p2: 'Combining large square main sails for downwind speed with triangular **lateen sails** on the mizzenmast for agile windward tacking, these galleons mounted heavy bronze **culverins** and demi-culverins along full-length gun decks. Capable of pounding enemy hulls from long range and reloading rapidly, race-built warships gave English explorers both oceanic endurance and formidable firepower.',
      terms: ['race-built galleons', 'lateen sails', 'culverins'],
      model:
        'Hawkins’s fast <strong>race-built galleons</strong> combined manoeuvrable triangular <strong>lateen sails</strong> with long-range <strong>culverins</strong> to master rough Atlantic oceans and naval combat.',
    },
    {
      p1: 'Economic necessity drove English merchants to seek distant markets after the Antwerp cloth trade collapsed and Spanish embargoes choked traditional wool exports. Wealthy London investors pooled risk in royal chartered joint-stock companies: the **Muscovy Company** (1555) traded furs and naval timber with Russia, the Eastland Company (1579) entered the Baltic, and the **Levant Company** (1581) imported Ottoman spices and silks.',
      p2: 'Others hunted direct sea routes to Asia to bypass Iberian monopolies and acquire African gold, ivory, and enslaved cargoes (pioneered by John Hawkins in 1562). Between 1576 and 1587 **Martin Frobisher** and John Davis braved Arctic icebergs seeking a Northwest Passage above Canada, charting Baffin Island while Humphrey Gilbert promoted North American settlement.',
      terms: ['Muscovy Company', 'Levant Company', 'Martin Frobisher'],
      model:
        'Seeking markets beyond Antwerp, investors formed the <strong>Muscovy Company</strong> and <strong>Levant Company</strong> while <strong>Martin Frobisher</strong> searched Arctic waters for a Northwest Passage.',
    },
    {
      p1: 'In December 1577 **Francis Drake** sailed from Plymouth with five vessels and 164 men—backed secretly by Elizabeth, Walsingham, and Leicester—to raid Spanish Pacific ports and avenge Spain’s 1568 treachery at San Juan de Ulúa. Surviving mutiny and ferocious storms through the **Strait of Magellan**, only Drake’s renamed flagship *Golden Hind* reached the Pacific in September 1578.',
      p2: 'Sweeping north past unfortified Valparaíso and Callao, Drake captured the silver-laden *Cacafuego* before sailing up the North American coast in June 1579, where friendly Miwok people welcomed him and he claimed **Nova Albion** (‘New England’, likely California) for Queen Elizabeth. Crossing the Pacific, trading for cloves in the Moluccas, and rounding Africa, Drake reached Plymouth in September 1580.',
      terms: ['Francis Drake', 'Strait of Magellan', 'Nova Albion'],
      model:
        'Navigating the treacherous <strong>Strait of Magellan</strong> aboard the *Golden Hind*, <strong>Francis Drake</strong> raided Spanish Peru and claimed <strong>Nova Albion</strong> for Elizabeth in June 1579.',
    },
    {
      p1: 'Drake’s three-year **circumnavigation** of the earth (1577–80)—only the second in world history and the first led throughout by an English captain—delivered sensational financial, political, and psychological rewards. Returning roughly £400,000 in Spanish treasure yielded syndicate investors a **4,700% profit**, while Elizabeth’s Crown share exceeded an entire year’s royal income and cleared England’s national debt.',
      p2: 'Gathering priceless Pacific rutters and charts, signing spice treaties in the Moluccas, and proving English galleons could survive a global voyage boosted national maritime confidence and inspired Raleigh’s colonial schemes in Nova Albion’s wake. Conversely, Elizabeth’s public **Deptford knighting** of Drake in April 1581 shattered Spain’s exclusive claim to the Pacific and hastened open Anglo-Spanish war.',
      terms: ['circumnavigation', '4,700% profit', 'Deptford knighting'],
      model:
        'Drake’s 1577–80 <strong>circumnavigation</strong> delivered a spectacular <strong>4,700% profit</strong>, boosted English maritime confidence, and provoked Madrid through his 1581 <strong>Deptford knighting</strong>.',
    },
  ],

  lesson_3_4: [
    {
      p1: 'Following the drowning of his half-brother Humphrey Gilbert, courtier **Sir Walter Raleigh** received a six-year royal patent from Elizabeth in March 1584 to explore and settle North American lands unclaimed by any Christian ruler. Forbidden by the protective Queen to sail in person, Raleigh raised £40,000 from merchants and courtiers and named the territory **Virginia** to honour the Virgin Queen.',
      p2: 'In April 1584 Raleigh sent Philip Amadas and Arthur Barlowe on a fact-finding reconnaissance to **Roanoke** Island, returning with glowing reports of fertile soil and two Algonquian men, Manteo and Wanchese. Simultaneously, clergyman **Richard Hakluyt** wrote *Discourse on Western Planting* (1584) urging Elizabeth to back Virginia as a privateering base against Spanish treasure fleets, a source of naval timber and exotic goods, and a market for English cloth.',
      terms: ['Sir Walter Raleigh', 'Virginia', 'Richard Hakluyt'],
      model:
        'Armed with Elizabeth’s 1584 patent, <strong>Sir Walter Raleigh</strong> named <strong>Virginia</strong> and used <strong>Richard Hakluyt</strong>’s *Discourse on Western Planting* to promote trade and anti-Spanish bases.',
    },
    {
      p1: 'For the April 1585 colonising expedition, Raleigh recruited **107 colonists**—exclusively men—aboard seven vessels commanded at sea by his fiery, aggressive cousin **Sir Richard Grenville**, with veteran army officer **Ralph Lane** appointed colony governor from ashore alongside mathematician-scientist Thomas Harriot and watercolour artist John White (whom Harriot helped learn Algonquian from Manteo and Wanchese in London).',
      p2: 'From the very outset, recruitment imbalances and divided leadership proved deeply flawed: roughly half the 107 settlers were professional soldiers and status-conscious gentlemen expecting quick gold mines or Indigenous tribute rather than skilled **farmers**, carpenters, stone-masons, and winter fishermen able to make an Atlantic wilderness colony self-sufficient, while Grenville and Lane clashed bitterly over strategy.',
      terms: ['107 colonists', 'Sir Richard Grenville', 'Ralph Lane'],
      model:
        'Raleigh’s 1585 all-male force of <strong>107 colonists</strong> lacked skilled farmers and suffered bitter command friction between naval leader <strong>Sir Richard Grenville</strong> and governor <strong>Ralph Lane</strong>.',
    },
    {
      p1: 'Departing Plymouth on 9 April 1585—already too late in spring to plant crops for an autumn harvest—the expedition suffered disaster on 29 June 1585 when flagship **Tiger** struck a sandbar at Ocracoke Inlet. Flooding seawater ruined almost all the hold’s **seed corn**, salt, dried peas, and gunpowder, leaving the garrison unable to grow harvests or preserve meat.',
      p2: 'When Grenville sailed back to England in August for fresh supplies, Lane’s 107 men at Roanoke became dangerously dependent on local Algonquians for maize and woven reed **Secotan fish traps** they could neither build nor repair themselves, while brought-over European diseases (measles or smallpox) sparked mysterious deaths and deep suspicion inside Native villages.',
      terms: ['Tiger', 'seed corn', 'Secotan fish traps'],
      model:
        'After the flagship <strong>Tiger</strong> grounded on an Outer Banks sandbar and seawater ruined the <strong>seed corn</strong>, starving colonists relied helplessly on <strong>Secotan fish traps</strong>.',
    },
    {
      p1: 'Relations with the Secotan people deteriorated rapidly over winter 1585–86. In July 1585 Grenville had already burned the Native village of Aquascogoc over a missing silver cup; by spring 1586, exhausted by feeding unproductive English soldiers during a severe regional drought, Secotan ruler **Chief Wingina** (who took the war-name Pemisapan) stopped trading maize and coordinated local resistance.',
      p2: 'Suspecting an imminent confederate attack, Governor Ralph Lane staged a ruthless pre-emptive **1 June 1586 ambush** at Dasamonquepeuc, luring Wingina to a peaceful parley and beheading him. Surrounding Algonquian tribes cut off all food supplies; facing starvation before Grenville’s delayed relief ships arrived, the colonists abandoned Roanoke on 18 June 1586 aboard **Francis Drake**’s passing fleet.',
      terms: ['Chief Wingina', '1 June 1586 ambush', 'Francis Drake'],
      model:
        'After Lane killed <strong>Chief Wingina</strong> in a <strong>1 June 1586 ambush</strong>, hostile tribes cut off food and the starving garrison evacuated aboard <strong>Francis Drake</strong>’s fleet.',
    },
    {
      p1: 'Learning from 1585’s military mistakes, Raleigh sent artist-governor **John White** back in May 1587 with 118 men, women, and children—promised 500 acres per family—intending to settle deeper Chesapeake Bay, though their Portuguese master pilot Simon Fernandez landed them back on **Roanoke** Island, where loyal Manteo was christened Lord of Roanoke and White’s granddaughter Virginia Dare was born.',
      p2: 'After hostile Algonquians killed colonist George Howe while crabbing, anxious settlers persuaded White to sail back to England for urgent supplies in August 1587. Tragically, the **1588 Spanish Armada** caused Elizabeth to requisition every seaworthy English vessel; when White finally returned in August 1590, Roanoke stood deserted with **‘CROATOAN’** carved into a palisade post—ending Elizabethan America.',
      terms: ['John White', '1588 Spanish Armada', '‘CROATOAN’'],
      model:
        'Delayed three years because the <strong>1588 Spanish Armada</strong> requisitioned relief ships, Governor <strong>John White</strong> returned in 1590 to find only <strong>‘CROATOAN’</strong> carved at deserted Roanoke.',
    },
  ],
};

function stripTagsAndMarkdown(str) {
  return String(str || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function countWords(str) {
  const clean = stripTagsAndMarkdown(str).replace(/\[\d+\.\d+\]/g, '').trim();
  return clean ? clean.split(/\s+/).length : 0;
}

function toParagraphHtml(str) {
  return String(str || '')
    .trim()
    .split(/\n\s*\n/)
    .map((p) => `<p>${p.trim()}</p>`)
    .join('');
}

function make2MarkQuestionObj(prefixLabel, qObj, calObj) {
  const cleanStem = (qObj.stem || qObj.question || '').replace(/^\d+(\([a-z]\))?\.?\s*/i, '');
  const topicPhrase = cleanStem.replace(/^Describe one feature of\s+/i, '').replace(/\.$/, '');
  const modelHtml = toParagraphHtml(qObj.wagoll);
  if (!calObj || !calObj.tier_1m || !calObj.tier_1m.text) {
    throw new Error(`Missing calibrated 2-mark tier_1m for "${cleanStem}"`);
  }
  return {
    tariff: '2 marks',
    type: 'feature_2m',
    marks: 2,
    workbook_badge: `In Printed Workbook • ${calObj.wbPage}`,
    question: `${prefixLabel} ${cleanStem} [2 marks]`,
    model: modelHtml,
    scaffolding: {
      acronym: '1 Feature (1m) + 1 Specific Fact (1m) • 3m',
      button_label: 'Sentence Starters',
      acronym_title: '',
      guidance: '',
      sentence_starters: [
        `One feature of ${topicPhrase} was...`,
        'Specifically, ...',
      ],
    },
    model_tiers: {
      tier_1m: {
        title: '1/2 Simple Statement',
        score: '1 / 2 Marks',
        level: 'AO1 (1 Mark — Unsupported Feature)',
        text: calObj.tier_1m.text,
        verdict: calObj.tier_1m.verdict,
      },
      tier_2m: {
        title: '2/2 Grade 9 Exam ★',
        score: '2 / 2 Marks',
        level: 'AO1 Full Marks (Supported Feature)',
        badge: 'Printed Workbook WAGOLL',
        text: modelHtml,
        verdict:
          calObj.tier_2m_verdict ||
          'AO1 (2 marks). Valid feature clearly identified and developed with precise supporting factual detail.',
      },
    },
  };
}

function makeExtendedQuestionObj(extObj, vocabBank, calObj) {
  const isEssay16 = extObj.type === 'essay_16';
  const prefix = isEssay16 ? '3.' : '2.';
  const cleanStem = extObj.stem.replace(/^\d+(\([a-z]\))?\.?\s*/i, '');
  const modelHtml = toParagraphHtml(extObj.wagoll);

  if (isEssay16) {
    if (!calObj || !calObj.tier_4m || !calObj.tier_8m) {
      throw new Error(`Missing calibrated 16-mark tiers for "${cleanStem}"`);
    }
    return {
      tariff: '16 marks',
      type: 'evaluative_16',
      marks: 16,
      spag_marks: 0,
      workbook_badge: `In Printed Workbook • ${calObj.wbPage}`,
      question: `${prefix} ${cleanStem} [16 marks]`,
      stimulus: extObj.stimulus,
      bullet_points: extObj.stimulus,
      model: modelHtml,
      scaffolding: {
        acronym: 'FOR + AGAINST + Own Knowledge (Cap 8/16) + Verdict • 25m',
        button_label: 'Starters & Word Bank',
        acronym_title: '',
        guidance: '',
        sentence_starters: [
          'On the one hand, there is strong evidence to agree with the statement because...',
          'However, on the other hand, an equally important factor was...',
          'In conclusion, I agree to a large / limited extent because...',
        ],
        connectives_label: 'Connectives',
        connectives_bank: [
          'On the one hand',
          'However, by contrast',
          'More importantly',
          'Consequently',
          'To a large extent',
          'Overall',
        ],
        vocab_bank: vocabBank || [],
      },
      model_tiers: {
        tier_4m: {
          title: '4/16 Generalised Assertions',
          score: '4 / 16 Marks',
          level: 'Level 1 (Simple Statements)',
          text: calObj.tier_4m.text,
          verdict: calObj.tier_4m.verdict,
        },
        tier_8m: {
          title: '8/16 Descriptive / Stimulus-Bound',
          score: '8 / 16 Marks',
          level: 'Level 2 (Stimulus-Bound Cap)',
          text: calObj.tier_8m.text,
          verdict: calObj.tier_8m.verdict,
        },
        tier_16m: {
          title: '16/16 Grade 9 Exam ★',
          score: '16 / 16 Marks',
          level: 'Level 4 Top (Pearson Benchmark — Zero SPaG)',
          badge: 'Printed Workbook WAGOLL',
          text: modelHtml,
          verdict:
            calObj.tier_16m_verdict ||
            'AO1 (6 marks) • AO2 (10 marks). Balanced, criteria-led evaluation integrating rich own knowledge beyond the stimulus to reach a sustained judgement.',
        },
      },
    };
  }

  if (!calObj || !calObj.tier_3m || !calObj.tier_6m) {
    throw new Error(`Missing calibrated 12-mark tiers for "${cleanStem}"`);
  }

  const whyPhrase = cleanStem.replace(/^Explain why\s+/i, '').replace(/\.$/, '');

  return {
    tariff: '12 marks',
    type: 'explain_why_12',
    marks: 12,
    workbook_badge: `In Printed Workbook • ${calObj.wbPage}`,
    question: `${prefix} ${cleanStem} [12 marks]`,
    stimulus: extObj.stimulus,
    bullet_points: extObj.stimulus,
    model: modelHtml,
    scaffolding: {
      acronym: '3 PEEL Reasons • Own Knowledge Required (Cap 6/12) • 15m',
      button_label: 'Starters & Word Bank',
      acronym_title: '',
      guidance: '',
      sentence_starters: [
        `First, one major reason why ${whyPhrase} was...`,
        'Second, another key reason was...',
        'Finally, a third reason was...',
      ],
      connectives_label: 'Connectives',
      connectives_bank: [
        'Consequently',
        'This meant that',
        'Furthermore',
        'As a result',
        'In addition',
        'Crucially',
      ],
      vocab_bank: vocabBank || [],
    },
    model_tiers: {
      tier_3m: {
        title: '3/12 Simple Statements',
        score: '3 / 12 Marks',
        level: 'Level 1 (Simple Statements)',
        text: calObj.tier_3m.text,
        verdict: calObj.tier_3m.verdict,
      },
      tier_6m: {
        title: '6/12 Descriptive / Stimulus-Bound',
        score: '6 / 12 Marks',
        level: 'Level 2 (Stimulus-Bound Cap)',
        text: calObj.tier_6m.text,
        verdict: calObj.tier_6m.verdict,
      },
      tier_12m: {
        title: '12/12 Grade 9 Exam ★',
        score: '12 / 12 Marks',
        level: 'Level 4 Top (Pearson Benchmark)',
        badge: 'Printed Workbook WAGOLL',
        text: modelHtml,
        verdict:
          calObj.tier_12m_verdict ||
          'AO1 (6 marks) • AO2 (6 marks). Three analytical PEEL causation paragraphs integrating precise own knowledge beyond the stimulus.',
      },
    },
  };
}

function run() {
  const eeeDataPath = path.join(ROOT_DIR, 'data', 'eee.json');
  const publicEeeDataPath = path.join(ROOT_DIR, 'public', 'data', 'eee.json');
  const rootDbPath = path.join(ROOT_DIR, 'database.json');
  const publicDbPath = path.join(ROOT_DIR, 'public', 'database.json');
  const unitDataJsPath = path.join(ROOT_DIR, 'units', 'eee', 'data.js');

  const unit = JSON.parse(fs.readFileSync(eeeDataPath, 'utf8'));

  // 1. Sync unit.workbooks cover metadata
  const coverMap = {
    KT1: '/images/elizabeth_coronation_robes.jpg',
    KT2: '/images/armada_portrait.jpg',
    KT3: '/images/john_white_chief_herowan.jpg',
  };
  if (Array.isArray(unit.workbooks)) {
    for (const wbMeta of unit.workbooks) {
      if (coverMap[wbMeta.id]) wbMeta.image = coverMap[wbMeta.id];
    }
  }

  // 2. Sync all 12 lessons across KT1, KT2, KT3
  for (const ktId of ['KT1', 'KT2', 'KT3']) {
    const booklet = EEE_BOOKLETS[ktId];
    for (const wb of booklet.lessons) {
      const les = unit.lessons.find((l) => l.id === wb.appLessonId);
      if (!les) {
        throw new Error(`Missing canonical lesson ${wb.appLessonId}`);
      }

      // Slug & aliases
      les.slug = wb.slug;
      const prevAliases = Array.isArray(les.alias_ids) ? les.alias_ids : [];
      les.alias_ids = Array.from(new Set([...wb.aliases, ...prevAliases]));
      les.enquiry = wb.enquiryQuestion;
      les.enquiry_question = wb.enquiryQuestion;

      const proseBlocks = LESSON_PROSE_SPECS[wb.appLessonId];
      if (!proseBlocks || proseBlocks.length !== 5) {
        throw new Error(`Expected 5 prose blocks for ${wb.appLessonId}`);
      }

      wb.stages.forEach((st, idx) => {
        const pb = proseBlocks[idx];
        const block = les.narrative_blocks[idx];
        const stageObj = les.workbook_stages[idx];
        const num = idx + 1;

        const p1 = `<span class="para-ref">[${num}.1]</span> ${pb.p1.trim()}`;
        const p2 = `<span class="para-ref">[${num}.2]</span> ${pb.p2.trim()}`;
        const fullText = `${p1}\n\n${p2}`;

        const wc = countWords(fullText);
        if (wc < 110 || wc > 140) {
          throw new Error(
            `[Word Budget Violation] ${wb.appLessonId} Block ${num} has ${wc} words (expected 110–140)`,
          );
        }

        // Assert all 3 stage trigger terms exist verbatim inside this block
        const plainLower = stripTagsAndMarkdown(fullText).toLowerCase();
        for (const term of pb.terms) {
          if (!plainLower.includes(term.toLowerCase())) {
            throw new Error(
              `[Trigger Term Missing] "${term}" not found verbatim in ${wb.appLessonId} Block ${num}`,
            );
          }
        }

        block.stage = num;
        block.act = num;
        const bTitle = block.title || `Stage ${num}`;
        block.act_title = `Stage ${num}: ${bTitle} — ${st.questionHeading}`;
        block.paragraphs = [p1, p2];
        block.text = fullText;
        block.content = fullText;

        // Clean workbook_stages[idx]
        if (stageObj) {
          stageObj.step = num;
          stageObj.stage = num;
          stageObj.date = st.date;
          stageObj.dates = st.date;
          stageObj.question = st.questionHeading;
          stageObj.focus_clue = st.questionHeading;
          stageObj.bullets = [...pb.terms];

          const oldClues = Array.isArray(stageObj.words) ? stageObj.words : [];
          const cleanWordObjs = pb.terms.map((t, wIdx) => ({
            term: t,
            clue:
              (oldClues[wIdx] && oldClues[wIdx].clue) ||
              stripTagsAndMarkdown(wIdx < 2 ? pb.p1 : pb.p2),
          }));
          stageObj.words = cleanWordObjs;
          stageObj.key_terms = cleanWordObjs;
          stageObj.model_sentence = pb.model;
        }

        // Sync causal_domino_spine
        if (
          les.causal_domino_spine &&
          Array.isArray(les.causal_domino_spine.stages) &&
          les.causal_domino_spine.stages[idx]
        ) {
          const ds = les.causal_domino_spine.stages[idx];
          ds.step = num;
          ds.date = st.date;
          ds.question = st.questionHeading;
          ds.desc = pb.terms.join(' • ');
        }

        // Sync teacher_notes.objectives[idx]
        if (
          les.teacher_notes &&
          Array.isArray(les.teacher_notes.objectives) &&
          les.teacher_notes.objectives[idx]
        ) {
          const obj = les.teacher_notes.objectives[idx];
          obj.question = st.questionHeading;
          obj.objective = `Explain and evaluate ${bTitle} (${st.date}): ${pb.terms.join(', ')}.`;
          obj.primer = `Direct students to paragraphs [${num}.1]–[${num}.2]. Focus on ${pb.terms[0]}, ${pb.terms[1]}, and ${pb.terms[2]}.`;
        }
      });

      // Assert all 10 shuffled vocabBank terms appear verbatim in this lesson's narrative_blocks
      const lessonPlainLower = les.narrative_blocks
        .map((b) => stripTagsAndMarkdown(b.text))
        .join(' ')
        .toLowerCase();

      if (lessonPlainLower.includes('the globe')) {
        throw new Error(`[Anachronism Gate] Found off-period "the Globe" in ${wb.appLessonId}`);
      }

      for (const vTerm of wb.vocabBank) {
        if (!lessonPlainLower.includes(vTerm.toLowerCase())) {
          throw new Error(
            `[VocabBank Missing] "${vTerm}" not found verbatim in ${wb.appLessonId} narrative_blocks!`,
          );
        }
      }

      // Sync 100% Spec-Verbatim, Topic-Matched Exam Practice (1a from Recto + 1b from Page 13/14 + Extended 12m/16m)
      const lesCal = EEE_EXAM_CALIBRATION[wb.appLessonId];
      if (!lesCal) {
        throw new Error(`Missing EEE_EXAM_CALIBRATION entry for ${wb.appLessonId}`);
      }

      let rawQ1b;
      if (lesCal.q1b.source === 'drill') {
        rawQ1b = booklet.consolidation.drills[lesCal.q1b.drillIndex];
      } else if (lesCal.q1b.source === 'miniMock_q1a') {
        rawQ1b = booklet.miniMock.q1a;
      } else if (lesCal.q1b.source === 'miniMock_q1b') {
        rawQ1b = booklet.miniMock.q1b;
      } else {
        throw new Error(`Unknown q1b source "${lesCal.q1b.source}" for ${wb.appLessonId}`);
      }

      const q1aObj = make2MarkQuestionObj('1(a).', wb.q1, lesCal.q1a);
      const q1bObj = make2MarkQuestionObj('1(b).', rawQ1b, lesCal.q1b);
      const extObj = makeExtendedQuestionObj(wb.extended, wb.vocabBank, lesCal.extended);
      const printedMarks = 2 + wb.extended.marks;

      les.exam_practice = {
        type: 'feature_and_extended',
        title: `Edexcel GCSE (9–1) Paper 2 (1HI0/B4) Exam Practice (${wb.code} • Printed ${ktId} Booklet ${wb.pages})`,
        tariff: `${printedMarks} marks on ${wb.pages} + 2m Feature Drill (${lesCal.q1b.wbPage.split(' (')[0]})`,
        questions: [q1aObj, q1bObj, extObj],
      };
    }
  }

  // 3. Upsert the 3 Printed Workbook Closed-Book Mini-Mocks (pp. 14–15, 16m)
  const workbookMiniMocks = [
    {
      id: 'eee_workbook_minimock_kt1',
      title: 'KT1 End-of-Topic Mini-Mock (Printed Pupil Workbook • Pages 14–15)',
      url: 'eee_workbook_minimock_kt1.html',
      has_mark_scheme: true,
      mark_scheme_url: 'eee_workbook_minimock_kt1_mark_scheme.html',
      paper_reference: 'Printed KT1 Workbook pp. 14–15 (1HI0/B4)',
      total_marks: 16,
      time_minutes: 25,
      workbook_badge: 'Printed Workbook pp. 14–15',
    },
    {
      id: 'eee_workbook_minimock_kt2',
      title: 'KT2 End-of-Topic Mini-Mock (Printed Pupil Workbook • Pages 14–15)',
      url: 'eee_workbook_minimock_kt2.html',
      has_mark_scheme: true,
      mark_scheme_url: 'eee_workbook_minimock_kt2_mark_scheme.html',
      paper_reference: 'Printed KT2 Workbook pp. 14–15 (1HI0/B4)',
      total_marks: 16,
      time_minutes: 25,
      workbook_badge: 'Printed Workbook pp. 14–15',
    },
    {
      id: 'eee_workbook_minimock_kt3',
      title: 'KT3 End-of-Topic Mini-Mock (Printed Pupil Workbook • Pages 14–15)',
      url: 'eee_workbook_minimock_kt3.html',
      has_mark_scheme: true,
      mark_scheme_url: 'eee_workbook_minimock_kt3_mark_scheme.html',
      paper_reference: 'Printed KT3 Workbook pp. 14–15 (1HI0/B4)',
      total_marks: 16,
      time_minutes: 25,
      workbook_badge: 'Printed Workbook pp. 14–15',
    },
  ];

  unit.mock_exams = (unit.mock_exams || []).filter(
    (m) => !workbookMiniMocks.some((wm) => wm.id === m.id),
  );
  unit.mock_exams.push(...workbookMiniMocks);

  // 4. Write out all 5 canonical data files identically
  const unitJsonStr = JSON.stringify(unit, null, 2) + '\n';
  fs.writeFileSync(eeeDataPath, unitJsonStr, 'utf8');
  fs.writeFileSync(publicEeeDataPath, unitJsonStr, 'utf8');

  const unitDataJsContent = `const unitData = ${JSON.stringify(unit, null, 2)};\nif (typeof window !== "undefined") { window.unitData = unitData; window.eeeData = unitData; }\nif (typeof module !== "undefined") { module.exports = unitData; }\n`;
  fs.writeFileSync(unitDataJsPath, unitDataJsContent, 'utf8');
  const publicUnitDataJsPath = path.join(ROOT_DIR, 'public', 'units', 'eee', 'data.js');
  if (fs.existsSync(path.dirname(publicUnitDataJsPath))) {
    fs.writeFileSync(publicUnitDataJsPath, unitDataJsContent, 'utf8');
  }

  for (const dbPath of [rootDbPath, publicDbPath]) {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    if (db.units && db.units.eee) {
      if (db.units.eee.data) db.units.eee.data = unit;
      else db.units.eee = unit;
    } else if (db.eee && db.eee.data) {
      db.eee.data = unit;
    } else {
      db.eee = unit;
    }
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2) + '\n', 'utf8');
  }

  execSync(`node -c "${unitDataJsPath}"`, { stdio: 'inherit' });
  console.log(
    '✅ Synchronized eee (12 lessons, 60 GCSE blocks, 120/120 vocabBank terms, 180/180 stage terms, spec exam practice & 3 Mini-Mocks) across all 5 canonical files!',
  );
}

if (require.main === module) {
  run();
}

module.exports = { run };
