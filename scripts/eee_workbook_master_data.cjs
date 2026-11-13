/**
 * eee_workbook_master_data.cjs
 *
 * Canonical Single Source of Truth for Early Elizabethan England, 1558–88
 * (Pearson Edexcel GCSE History Paper 2, Option B4 — 1HI0/B4).
 *
 * Drives in 1-to-1 parity:
 *  1. Printed Pupil Workbooks (3 x 16-page A4 saddle-stitch booklets: KT1, KT2, KT3; zero combined master)
 *  2. Page-Matched Teacher Mark Schemes & Grade 9 WAGOLLs (HTML + PDF)
 *  3. Standalone Classroom Projection Mini-Mocks (HTML QP + MS)
 *  4. Web App Interactive Lessons (`data/eee.json`, `public/data/eee.json`, `database.json`, `units/eee/data.js`)
 *
 * Strict Edexcel 1HI0/B4 Exam Rules Enforced:
 *  - Total Paper Marks: 32 (Q1a [2m] + Q1b [2m] = 4m; Q2 Explain why = 12m; Q3/Q4 How far agree = 16m, ZERO SPaG)
 *  - 100% Verbatim Specification Stems: Every Q1, Q2, and Q3/Q4 stem uses literal phrases from `1HI0/B4`.
 *  - Bottom 2x5 (10-Term) Shuffled Spec Word Bank on every Lesson Left (Verso) Page (120 terms total).
 */

const EEE_BOOKLETS = {
  KT1: {
    id: 'KT1',
    keyTopicNum: 1,
    totalPages: 16,
    dateRange: '1558–1569',
    title: 'Key Topic 1: Queen, Government and Religion, 1558–69',
    subtitle: 'Accession Crisis, The 1559 Religious Settlement, Puritan & Catholic Challenges, and Mary, Queen of Scots',
    footerQuip: 'Early Elizabethan England, 1558–88 • Key Topic 1 Pupil Workbook (1HI0/B4)',
    cover: {
      src: '../../images/elizabeth_coronation_robes.jpg',
      alt: 'Coronation Portrait of Queen Elizabeth I wearing cloth-of-gold robes trimmed with ermine and holding the sceptre and orb, c. 1600 after 1559 original',
      photographer: 'Unknown English Artist',
      date: '1559 (c. 1600 copy)',
      repository: 'National Portrait Gallery, London (NPG 2607)',
      title: 'Queen Elizabeth I (‘The Coronation Portrait’, 1559)',
      caption:
        'Crowned at Westminster Abbey on 15 January 1559, twenty-five-year-old Elizabeth used rich royal symbolism to project divinely ordained authority over a bankrupt and religiously divided realm.',
      cmeHeroHeightMm: 64,
      hubUrl: 'https://the-history-revision-hub.netlify.app/?view=lessons&unit=eee&lesson=kt1.1-accession-1558',
      clues: [
        'Cloth-of-gold mantle trimmed with white ermine fur, projecting divine-right majesty.',
        'Sceptre and sovereign orb held firmly to assert legitimate rule despite her gender.',
        'Loose flowing hair beneath the imperial state crown — symbol of a virgin queen.',
      ],
      hingeQuestion:
        'Why was projecting unquestionable divine-right authority at her January 1559 coronation vital for a twenty-five-year-old unmarried Protestant queen?',
    },
    lessons: [
      {
        code: 'KT 1.1',
        num: 1,
        appLessonId: 'lesson_1_1',
        slug: 'kt1.1-accession-1558',
        aliases: ['kt1.1-accession-1558', 'kt1.1', 'lesson_1_1'],
        pages: 'pp. 2–3',
        textbookSpread: 'Textbook pp. 4–5',
        title: 'The Situation on Elizabeth’s Accession, 1558',
        enquiryQuestion:
          'How did an inexperienced queen secure an impoverished and divided England amidst acute foreign encirclement in 1558?',
        qrUrl: 'https://the-history-revision-hub.netlify.app/?view=lessons&unit=eee&lesson=kt1.1-accession-1558',
        vocabBank: [
          'Privy Council',
          'Calais',
          '£300,000',
          'Anne Boleyn',
          'Justices of the Peace',
          'William Cecil',
          'Auld Alliance',
          'patronage',
          'Antwerp',
          'Lords Lieutenant',
        ],
        stages: [
          {
            date: '17 NOV 1558',
            questionHeading: 'Why did inherited debt and foreign loans create a crisis in 1558?',
          },
          {
            date: 'NOV–DEC 1558',
            questionHeading: 'How did Elizabeth use patronage and factions to control her court?',
          },
          {
            date: 'DEC 1558',
            questionHeading: 'Why did doubts over gender, marriage, and legitimacy threaten rule?',
          },
          {
            date: 'JAN–MAY 1559',
            questionHeading: 'Why did the Crown rely on Parliament and unpaid local gentry?',
          },
          {
            date: '1558–1560',
            questionHeading: 'Why did losing Calais and the Auld Alliance create encirclement?',
          },
        ],
        q1: {
          stem: 'Describe one feature of the French threat in 1558.',
          clue: 'Feature (1m) + specific supporting detail such as Calais, the Auld Alliance, or Mary Stuart’s claim (1m).',
          wagoll:
            'One feature of the French threat in 1558 was the strategic encirclement of England through France’s traditional Auld Alliance with Scotland. Battle-hardened French garrison troops were stationed along the Scottish border under Regent Mary of Guise while England had just lost Calais in January 1558, exposing the realm to a two-front Catholic invasion.',
        },
        extended: {
          type: 'explain_12',
          questionNum: '2',
          tariff: 'Question 2: Explain Why [12 Marks]',
          shortLabel: 'Q2 Why',
          marks: 12,
          stem: 'Explain why Elizabeth’s legitimacy, gender and marriage were a problem for her in 1558.',
          stimulus: ['Henry VIII’s marriage to Anne Boleyn', 'The succession'],
          wagoll:
            'Elizabeth’s disputed legitimacy posed an acute dynastic threat in 1558 because devout Catholics at home and abroad rejected Henry VIII’s divorce from Catherine of Aragon and his 1533 marriage to Anne Boleyn. Under Roman Catholic canon law—and even Henry VIII’s own 1536 Act of Succession passed after Anne Boleyn’s execution—Elizabeth was viewed by strict Catholics as illegitimate and barred from inheriting the throne. Consequently, Catholic powers such as France promoted Elizabeth’s cousin Mary, Queen of Scots—married to the French Dauphin Francis—as England’s rightful Catholic monarch, encouraging Mary to quarter the English royal coat of arms alongside her own.\n\nSecond, sixteenth-century patriarchal attitudes made Elizabeth’s gender an immediate political problem. Contemporary society believed the Great Chain of Being placed men in authority over women, viewing female monarchs as emotionally weak, indecisive, and incapable of leading royal armies into battle. Recent painful memories of Mary I’s reign—marked by disastrous harvests, nearly 300 Protestant burnings, financial ruin, and the humiliating loss of Calais in January 1558—deepened elite prejudice that a woman ruling alone would invite domestic rebellion and foreign invasion.\n\nFinally, the problem of marriage and the succession trapped Elizabeth in an almost impossible political dilemma. Because Elizabeth ascended at twenty-five with no Protestant heir, her death from illness such as smallpox threatened to plunge England into civil war, prompting the Privy Council and Parliament to press her relentlessly to marry. Yet marrying an English nobleman like Robert Dudley risked fierce court faction fighting, whereas marrying a foreign Catholic prince such as Philip II of Spain risked repeating Mary I’s unpopular Spanish marriage and surrendering English independence to foreign control.',
        },
      },
      {
        code: 'KT 1.2',
        num: 2,
        appLessonId: 'lesson_1_2',
        slug: 'kt1.2-religious-settlement',
        aliases: ['kt1.2-religious-settlement', 'kt1.2', 'lesson_1_2'],
        pages: 'pp. 4–5',
        textbookSpread: 'Textbook pp. 6–7',
        title: 'The ‘Settlement’ of Religion, 1559',
        enquiryQuestion:
          'To what extent was the 1559 Religious Settlement an enduring theological compromise designed to prevent civil war?',
        qrUrl: 'https://the-history-revision-hub.netlify.app/?view=lessons&unit=eee&lesson=kt1.2-religious-settlement',
        vocabBank: [
          'Supreme Governor',
          'recusants',
          'Marian exiles',
          'Royal Injunctions',
          'Act of Supremacy',
          'Church courts',
          'Book of Common Prayer',
          'visitations',
          'Act of Uniformity',
          'Oath of Supremacy',
        ],
        stages: [
          {
            date: 'NOV 1558–JAN 1559',
            questionHeading: 'Why did England’s religious divisions require a cautious compromise?',
          },
          {
            date: 'MAY 1559',
            questionHeading: 'Why did Elizabeth adopt the title ‘Supreme Governor’ under Supremacy?',
          },
          {
            date: 'MAY 1559',
            questionHeading: 'How did the Act of Uniformity balance Protestant and Catholic worship?',
          },
          {
            date: 'SUMMER 1559',
            questionHeading: 'How did the 57 Royal Injunctions regulate local parish worship?',
          },
          {
            date: '1559–1560s',
            questionHeading: 'How did visitations and the Church of England enforce daily order?',
          },
        ],
        q1: {
          stem: 'Describe one feature of the role of the Church of England in society.',
          clue: 'Feature (1m) + specific factual detail such as Church courts, parish charity, or preaching obedience (1m).',
          wagoll:
            'One feature of the role of the Church of England in society was enforcing moral discipline and royal obedience through local Church courts. These ecclesiastical courts supervised everyday community behaviour by prosecuting slander, adultery, non-attendance at Sunday worship, and disputes over wills and marriage contracts.',
        },
        extended: {
          type: 'explain_12',
          questionNum: '2',
          tariff: 'Question 2: Explain Why [12 Marks]',
          shortLabel: 'Q2 Why',
          marks: 12,
          stem: 'Explain why Elizabeth’s religious settlement (1559) took the form it did in 1559.',
          stimulus: ['Religious divisions in 1558', 'The French threat'],
          wagoll:
            'Elizabeth’s 1559 religious settlement took the form of a cautious Protestant ‘middle way’ primarily to heal deep domestic religious divisions without provoking civil war. While London, East Anglia, and returning Marian exiles from Geneva demanded radical Protestant reform, the majority of rural parishes—especially powerful gentry and earls in the north and west—remained conservatively attached to traditional Catholic ceremonies, and twenty-six Marian bishops initially opposed change in the House of Lords. Consequently, Elizabeth blended Protestant theology with reassuring outward continuity: she took the diplomatic title ‘Supreme Governor’ rather than ‘Supreme Head’, combined the 1549 and 1552 communion wordings in the Book of Common Prayer, kept clergy vestments, and set the recusancy fine at a modest 12 pence (one shilling) per missed Sunday.\n\nSecond, dangerous foreign threats in 1558–59 forced Elizabeth to avoid an aggressively anti-Catholic settlement that might unite Catholic superpowers against England. Having just lost Calais, England faced French troops stationed in Scotland backing Mary, Queen of Scots’ rival Catholic claim, while Elizabeth desperately needed the diplomatic neutrality of Catholic King Philip II of Spain before the Treaty of Cateau-Cambrésis was signed in April 1559. Retaining traditional church ornaments, bishops, and moderate enforcement convinced Philip II and most European observers that England had not fallen to radical Calvinist extremism, averting an immediate Catholic crusade.\n\nFinally, Elizabeth’s own personal religious convictions and fierce defence of the royal prerogative shaped the exact structure of the settlement. Raised as a moderate Protestant, Elizabeth genuinely favoured dignified ceremony, choral music, and episcopal hierarchy—where bishops answered directly to the monarch—over radical Puritan congregational equality. Establishing a state church governed through bishops, the Oath of Supremacy, and fifty-seven Royal Injunctions enabled Elizabeth and William Cecil to secure firm royal control over every pulpit in England while demanding outward conformity rather than persecuting private conscience.',
        },
      },
      {
        code: 'KT 1.3',
        num: 3,
        appLessonId: 'lesson_1_3',
        slug: 'kt1.3-puritan-catholic-challenges',
        aliases: ['kt1.3-puritan-catholic-challenges', 'kt1.3', 'lesson_1_3'],
        pages: 'pp. 6–7',
        textbookSpread: 'Textbook pp. 8–9',
        title: 'Challenge to the Religious Settlement, 1559–69',
        enquiryQuestion:
          'Why did opposition from Puritan zealots and Catholic traditionalists test Elizabeth’s middle way during the 1560s?',
        qrUrl: 'https://the-history-revision-hub.netlify.app/?view=lessons&unit=eee&lesson=kt1.3-puritan-catholic-challenges',
        vocabBank: [
          'Church Papists',
          'Book of Advertisements',
          'Genoese Loan',
          'Puritans',
          'Duke of Alba',
          'surplice',
          'Matthew Parker',
          'crucifix',
          'Council of Troubles',
          'Counter-Reformation',
        ],
        stages: [
          {
            date: '1559–1563',
            questionHeading: 'Why did Puritan demands over crucifixes challenge royal authority?',
          },
          {
            date: '1566',
            questionHeading: 'How did Archbishop Parker defeat Puritan defiance over vestments?',
          },
          {
            date: '1559–1568',
            questionHeading: 'Why did most English Catholics conform outwardly in the early 1560s?',
          },
          {
            date: '1562–1568',
            questionHeading: 'Why did Alba’s Spanish army in the Netherlands alarm the Privy Council?',
          },
          {
            date: '1568–1569',
            questionHeading: 'How did seizing the Genoese Loan strain relations with Catholic Spain?',
          },
        ],
        q1: {
          stem: 'Describe one feature of the Puritan challenge to the religious settlement.',
          clue: 'Feature (1m) + specific factual detail such as crucifixes or the 1566 Vestments Controversy (1m).',
          wagoll:
            'One feature of the Puritan challenge was fierce opposition to traditional clerical vestments such as the white linen surplice, which Puritans condemned as ‘rags of Rome’. When Archbishop Matthew Parker enforced uniformity through his 1566 Book of Advertisements, 37 London Puritan ministers refused to conform and were dismissed from their livings.',
        },
        extended: {
          type: 'essay_16',
          questionNum: '3',
          tariff: 'Question 3: Evaluative Essay [16 Marks — Zero SPaG]',
          shortLabel: 'Q3 Agree',
          marks: 16,
          stem: '‘The Catholic challenge was a greater threat to Elizabeth’s religious settlement than the Puritan challenge in the years 1559–69.’ How far do you agree? Explain your answer.',
          stimulus: ['The role of the Catholic nobility', 'The Puritan challenge'],
          wagoll:
            'Between 1559 and 1569, the Catholic challenge posed a substantially greater threat to Elizabeth’s religious settlement than the Puritan challenge because Catholic opposition combined powerful northern aristocratic armies, a rival claimant to the throne, and dangerous foreign powers, whereas Puritans lacked foreign backing or any desire to depose the Queen.\n\nOn the one hand, the Catholic challenge carried mortal political and military danger, particularly in the late 1560s. Roughly one-third of the English nobility and gentry—concentrated in the north under ancient magnates like the Earls of Northumberland and Westmorland—remained loyal to Catholicism, sheltering Marian priests while lax local JPs ignored recusancy. Although Pope Pius IV issued no immediate excommunication in 1559–66 and many Catholics acted as outward ‘Church Papists’, international Catholic pressure escalated sharply after 1567 when Philip II sent the Duke of Alba with 10,000 veteran Spanish troops to crush Protestants in the nearby Netherlands and Elizabeth seized the £85,000 Genoese Loan in 1568. Once Catholic Mary, Queen of Scots fled to England in May 1568, northern Catholic earls gained a legitimate figurehead, culminating in armed insurrection in November 1569 where rebels tore up English Bibles and celebrated Latin Mass in Durham Cathedral.\n\nOn the other hand, Puritans mounted vocal clerical opposition inside the Church of England during the early 1560s. Returning Marian exiles influenced by John Calvin demanded the removal of ‘popish’ ornaments: Puritan bishops threatened to resign until Elizabeth removed the silver crucifix from her Royal Chapel, and reformist clergy came within a single vote of abolishing saint days and organs at the 1563 Convocation. Friction peaked in the 1566 Vestments Controversy when clergy refused to wear the white surplice; however, when Archbishop Matthew Parker issued the Book of Advertisements and sacked 37 non-conforming London preachers, most Puritans reluctantly conformed.\n\nOverall, I strongly agree with the statement. While Puritans noisily challenged church ceremony, they remained fiercely loyal to a Protestant Queen because replacing Elizabeth meant Catholic rule. Conversely, the Catholic challenge possessed noble militias, papal sympathy, Alba’s nearby Spanish army, and Mary Stuart’s rival claim—making it a far graver threat to both the settlement and Elizabeth’s crown by 1569.',
        },
      },
      {
        code: 'KT 1.4',
        num: 4,
        appLessonId: 'lesson_1_4',
        slug: 'kt1.4-mary-queen-of-scots',
        aliases: ['kt1.4-mary-queen-of-scots', 'kt1.4', 'lesson_1_4'],
        pages: 'pp. 10–11',
        textbookSpread: 'Textbook pp. 10–11',
        title: 'The Problem of Mary, Queen of Scots, 1568–69',
        enquiryQuestion:
          'How did the arrival of Mary, Queen of Scots in 1568 transform Elizabeth’s dynastic security into a permanent national crisis?',
        qrUrl: 'https://the-history-revision-hub.netlify.app/?view=lessons&unit=eee&lesson=kt1.4-mary-queen-of-scots',
        vocabBank: [
          'Casket Letters',
          'Lord Darnley',
          'Margaret Tudor',
          'Earl of Shrewsbury',
          'Lochleven',
          'Duke of Norfolk',
          'Kirk o’ Field',
          'James VI',
          'Earl of Bothwell',
          'York',
        ],
        stages: [
          {
            date: '1560–1565',
            questionHeading: 'Why did Mary Stuart’s Tudor bloodline threaten Elizabeth’s throne?',
          },
          {
            date: 'FEB 1567',
            questionHeading: 'How did Darnley’s murder at Kirk o’ Field destroy Mary’s rule?',
          },
          {
            date: '1567–1568',
            questionHeading: 'Why did Mary’s escape from Lochleven into England trap Elizabeth?',
          },
          {
            date: 'OCT 1568–JAN 1569',
            questionHeading: 'Why did the York Inquiry over the Casket Letters end without a verdict?',
          },
          {
            date: '1569',
            questionHeading: 'How did Mary’s captivity spark the 1569 Norfolk marriage conspiracy?',
          },
        ],
        q1: {
          stem: 'Describe one feature of relations between Elizabeth and Mary, Queen of Scots, in the years 1568–69.',
          clue: 'Feature (1m) + specific factual detail such as house arrest, the York Inquiry, or the Casket Letters (1m).',
          wagoll:
            'One feature of relations between Elizabeth and Mary in 1568–69 was Elizabeth’s decision to detain Mary under guarded house arrest while convening the York and Westminster Inquiry (October 1568–January 1569). By examining the disputed Casket Letters without passing a formal guilty or innocent verdict, Elizabeth avoided restoring Mary to Scotland while keeping her neutralized in English custody.',
        },
        extended: {
          type: 'essay_16',
          questionNum: '3',
          tariff: 'Question 3: Evaluative Essay [16 Marks — Zero SPaG]',
          shortLabel: 'Q3 Agree',
          marks: 16,
          stem: '‘Mary, Queen of Scots’ claim to the English throne was the main problem in relations between Elizabeth and Mary in the years 1568–69.’ How far do you agree? Explain your answer.',
          stimulus: ['Mary’s arrival in England (1568)', 'The Catholic nobility'],
          wagoll:
            'Mary, Queen of Scots’ legitimate Catholic claim to the English throne was indeed the underlying root problem in relations between the two queens in 1568–69, because without that hereditary claim neither her arrival in England nor English noble conspiracies would have endangered Elizabeth’s crown.\n\nFirst, Mary’s dynastic bloodline made her uniquely dangerous. As the granddaughter of Henry VIII’s elder sister Margaret Tudor, Mary possessed an unimpeachable legitimate Tudor pedigree, whereas Roman Catholics regarded Elizabeth as the illegitimate daughter of Anne Boleyn. Unlike Elizabeth, Mary had also given birth to an heir (James VI) in 1566. Consequently, from the moment she quartered the English royal arms, Catholic Europe and English traditionalists viewed Mary not merely as a neighbouring monarch, but as the rightful Catholic alternative waiting to replace Elizabeth.\n\nSecond, however, Mary’s sudden arrival in England in May 1568 turned a distant dynastic claim into an immediate constitutional and diplomatic crisis. Having fled Lochleven Castle after the murder of her husband Lord Darnley at Kirk o’ Field and her scandalous marriage to the Earl of Bothwell, Mary crossed the Solway Firth demanding English troops to crush Scotland’s Protestant regency under the Earl of Moray. Every option damaged Elizabeth: helping Mary risked deposing a friendly Protestant Scottish government; handing her back risked executing an anointed sovereign; freeing her risked her seeking French military aid. Even the 1568–69 York Inquiry over the eight Casket Letters could only manage—not solve—the crisis by issuing an inconclusive verdict to justify indefinite detention under the Earl of Shrewsbury.\n\nThird, the ambition of England’s nobility and court factions turned Mary’s captivity into active conspiracy in 1569. Protestant courtiers including Robert Dudley secretly proposed marrying Mary to England’s premier nobleman, the Duke of Norfolk, to settle the succession, while Catholic Earls of Northumberland and Westmorland went further—planning to wed Mary to Norfolk, overthrow Cecil, and restore Catholicism by force.\n\nIn conclusion, I largely agree with the statement. While Mary’s flight to England in May 1568 and the scheming of English nobles triggered the immediate crisis of 1568–69, both only mattered because Mary possessed a powerful, legitimate Catholic claim to Elizabeth’s throne; without that bloodline claim, she would have been a powerless exile rather than a mortal magnet for rebellion.',
        },
      },
    ],
    centrefold: {
      subtitle: '1558–1569: From Bankrupt Accession & Via Media Settlement to Captive Scottish Rival',
      qrUrl: 'https://the-history-revision-hub.netlify.app/?view=timeline&unit=eee&kt=1',
      nodes: [
        {
          num: 1,
          date: '17 Nov 1558',
          title: 'Accession & £300k Debt',
          teacherKey: [
            'Elizabeth ascends aged 25 inheriting £300,000 Crown debt and Antwerp loans at 14%.',
            'Appoints William Cecil Principal Secretary and trims the Privy Council to 19 loyal advisers.',
            'Faces legitimacy doubts (1536 Act / papal view) and French troops in Scotland.',
          ],
        },
        {
          num: 2,
          date: 'May 1559',
          title: 'Acts of Supremacy & Uniformity',
          teacherKey: [
            'Act of Supremacy names Elizabeth ‘Supreme Governor’; clergy swear Oath (all but 1 Marian bishop deprived).',
            'Act of Uniformity enforces 1559 Book of Common Prayer with fused 1549/1552 communion wording.',
            'Recusants fined 1 shilling (12d) per missed Sunday service; clerical ornaments retained.',
          ],
        },
        {
          num: 3,
          date: 'Summer–Aut 1559',
          title: '57 Injunctions & Visitations',
          teacherKey: [
            '57 Royal Injunctions ban fake miracles/pilgrimages and place an English Bible in every parish.',
            '125 Visitation Commissioners tour England; ~400 clergy resign out of ~8,000.',
            'Treaty of Cateau-Cambrésis (Apr 1559) ends French war; Calais remains French.',
          ],
        },
        {
          num: 4,
          date: '1562–1566',
          title: 'Crucifix & Vestments Crises',
          teacherKey: [
            'Puritan bishops force removal of the Royal Chapel crucifix; 1563 Convocation narrowly fails (by 1 vote).',
            '1566: Archbishop Parker’s Book of Advertisements enforces the white linen surplice.',
            '37 London Puritan ministers are dismissed at Lambeth Palace for refusing to conform.',
          ],
        },
        {
          num: 5,
          date: 'Feb–Jul 1567',
          title: 'Darnley Murder & Lochleven',
          teacherKey: [
            'Feb 1567: Lord Darnley murdered after gunpowder explosion at Kirk o’ Field; Mary marries Bothwell.',
            'Outraged Scottish Protestant lords rebel and imprison Mary at Lochleven Castle.',
            'Jul 1567: Mary forced to abdicate in favour of her 1-year-old Protestant son, James VI.',
          ],
        },
        {
          num: 6,
          date: '1567–May 1568',
          title: 'Alba’s Army & Mary’s Flight',
          teacherKey: [
            '1567: Philip II sends Duke of Alba with 10,000 Spanish troops and Council of Troubles to Netherlands.',
            '16 May 1568: After escaping Lochleven and losing at Langside, Mary flees across Solway Firth to Workington.',
            '1568: William Allen founds English Catholic seminary at Douai in the Spanish Netherlands.',
          ],
        },
        {
          num: 7,
          date: 'Nov–Dec 1568',
          title: 'Genoese Loan & York Inquiry',
          teacherKey: [
            'Oct 1568–Jan 1569: York/Westminster Inquiry examines 8 Casket Letters; ‘not proven’ keeps Mary detained.',
            'Nov 1568: Spanish ships carrying £85,000 Genoese gold for Alba’s troops shelter in English ports.',
            'Elizabeth seizes the Genoese bullion loan; Alba retaliates with a trade embargo at Antwerp.',
          ],
        },
        {
          num: 8,
          date: 'Autumn 1569',
          title: 'Norfolk Marriage Plot Fails',
          teacherKey: [
            'Court plot hatches to marry Catholic captive Mary Stuart to Protestant Duke of Norfolk.',
            'Leicester confesses the secret scheme to Elizabeth, who furiously forbids the marriage.',
            'Norfolk is sent to the Tower (Oct 1569), pushing northern Catholic Earls toward open revolt.',
          ],
        },
      ],
    },
    consolidation: {
      page12Title: 'Key Topic 1 Rapid Essay Blueprints: 5-Minute Exam Planning Grids [2 × 6m = 12 Marks]',
      blueprintA: {
        code: 'Blueprint A',
        examType: 'Paper 2 Q2 • Explain Why (12m Stem)',
        marks: 6,
        stem: 'Explain why relations between Elizabeth and Mary, Queen of Scots were a problem in the years 1568–69.',
        stimulus: ['Mary’s arrival in England (1568)', 'the Casket Letters'],
        rows: [
          {
            label: 'Reason 1 (Stimulus 1)',
            evidenceModel: 'May 1568 flight to Cumbria after Lochleven/Langside; granddaughter of Margaret Tudor with infant son James VI.',
            linkModel: 'Trapped Elizabeth: helping Mary alienated Protestant Scotland, while detaining her inspired English Catholic plots.',
          },
          {
            label: 'Reason 2 (Stimulus 2)',
            evidenceModel: 'Oct 1568–Jan 1569 York/Westminster Inquiry; Regent Moray produced 8 French Casket Letters implicating Mary in Darnley’s murder.',
            linkModel: '‘Not proven’ verdict avoided executing an anointed queen yet forced Elizabeth into costly, tense indefinite captivity.',
          },
          {
            label: 'Reason 3 (Own Knowledge)',
            evidenceModel: '1569 secret court marriage plot to wed Mary to England’s premier peer, the Duke of Norfolk, backed by Catholic northern earls.',
            linkModel: 'Threatened Cecil’s government and the Protestant succession directly, sparking Norfolk’s arrest and the 1569 revolt.',
          },
        ],
      },
      blueprintB: {
        code: 'Blueprint B',
        examType: 'Paper 2 Q3/Q4 • How Far Agree (16m Stem — Zero SPaG)',
        marks: 6,
        stem: '‘Financial weaknesses were the main challenge facing Elizabeth at home and from abroad in 1558.’ How far do you agree? Explain your answer.',
        stimulus: ['Crown debt', 'the French threat'],
        forModel:
          'Inherited £300,000 Marian war debt against £286,000 annual income; forced to borrow on Antwerp market at 14% interest while debased coinage fuelled inflation; raising taxes risked rebellion.',
        againstModel:
          'Foreign encirclement was more existential: loss of Calais (Jan 1558), French troops in Scotland via the Auld Alliance, and Catholic Mary Stuart claiming England’s arms—compounded by doubts over Elizabeth’s legitimacy (Anne Boleyn / 1536 Act) and religious division.',
        verdictModel:
          'Agree only partially: £300,000 debt crippled England’s ability to fund armies or fleets, making the foreign French/Scottish Catholic threat and dynastic illegitimacy far more dangerous in 1558.',
      },
      workoutTitle: 'Paper 2 Question 1 Feature Workout: High-Probability Spec Drills [6 × 2m = 12 Marks]',
      drills: [
        {
          num: '1(a)',
          stem: 'Describe one feature of Elizabeth’s character and strengths.',
          wagoll:
            'One feature of Elizabeth’s character and strengths was her exceptional humanist education and linguistic skill. Tutored by Roger Ascham, she spoke Latin, French, Italian, and Greek fluently, enabling her to negotiate directly with foreign ambassadors and craft persuasive speeches to Parliament.',
        },
        {
          num: '1(b)',
          stem: 'Describe one feature of religious divisions in England in 1558.',
          wagoll:
            'One feature of religious divisions in 1558 was the sharp geographical split between regions. While London, the south-east, and East Anglia strongly favoured Protestantism—reinforced by returning Marian exiles—northern and western shires under traditional earls remained deeply loyal to Roman Catholic Mass.',
        },
        {
          num: '1(c)',
          stem: 'Describe one feature of the role of the Papacy and foreign powers in the Catholic challenge, 1559–69.',
          wagoll:
            'One feature of the Papacy’s role before 1569 was cautious restraint rather than active crusade. In 1566 Pope Pius V instructed English Catholics not to attend Anglican services, yet stopped short of excommunicating Elizabeth or backing military rebellion during the 1560s, limiting domestic Catholic resistance.',
        },
        {
          num: '1(d)',
          stem: 'Describe one feature of Mary, Queen of Scots’ claim to the English throne.',
          wagoll:
            'One feature of Mary, Queen of Scots’ claim was her legitimate Tudor descent as the granddaughter of Henry VIII’s elder sister, Margaret Tudor. Because Catholics deemed Elizabeth illegitimate, they viewed Catholic Mary Stuart as England’s rightful monarch and immediate heir.',
        },
        {
          num: '1(e)',
          stem: 'Describe one feature of Elizabethan government in 1558.',
          wagoll:
            'One feature of Elizabethan government in 1558 was executive rule through the Privy Council. Elizabeth streamlined her Privy Council to 19 trusted nobles and administrators led by Principal Secretary William Cecil, meeting almost daily to manage finance, defence, and local Justices of the Peace.',
        },
        {
          num: '1(f)',
          stem: 'Describe one feature of Elizabeth’s financial weaknesses in 1558.',
          wagoll:
            'One feature of Elizabeth’s financial weaknesses in 1558 was the crippling £300,000 Crown debt inherited from Mary I’s French war. With ordinary royal revenue around £286,000 a year, the Crown relied on high-interest 14% loans from Antwerp bankers.',
        },
      ],
    },
    miniMock: {
      title: 'Key Topic 1 End-of-Topic Mini-Mock (1558–69)',
      totalMarks: 16,
      timeMinutes: 25,
      q1a: {
        stem: 'Describe one feature of Elizabeth’s religious settlement (1559).',
        wagoll:
          'One feature of Elizabeth’s religious settlement (1559) was the Act of Supremacy, which ended papal authority in England and named Elizabeth ‘Supreme Governor’ of the Church of England. All clergy and royal officials had to swear an Oath of Supremacy accepting her authority or lose their posts.',
      },
      q1b: {
        stem: 'Describe one feature of the problem of marriage for Elizabeth.',
        wagoll:
          'One feature of the problem of marriage was the no-win political choice between domestic and foreign suitors. Marrying an English courtier like Robert Dudley risked violent noble jealousy and faction, whereas marrying a foreign Catholic prince like Philip II risked foreign domination and Protestant anger.',
      },
      q2: {
        questionNum: '2',
        tariff: 'Question 2: Explain Why [12 Marks]',
        stem: 'Explain why Elizabeth faced challenges to the religious settlement in the years 1559–69.',
        stimulus: ['The Puritan challenge', 'Foreign powers'],
        wagoll:
          'First, Elizabeth faced vocal domestic challenges from radical Puritans who believed the 1559 settlement was an incomplete ‘half-reformed’ compromise that retained popish superstitions. Influenced by Calvinist Geneva during Mary I’s reign, returning Marian exiles objected fiercely to crucifixes, organs, saint days, and clerical vestments, viewing the white linen surplice as ‘rags of Rome’. This provoked the 1562 Crucifix Controversy in the Royal Chapel, a narrow one-vote battle in the 1563 Convocation, and open clerical defiance in 1566 when 37 London ministers refused Archbishop Parker’s Book of Advertisements and had to be sacked.\n\nSecond, deep-rooted Catholic loyalty among England’s northern nobility and rural gentry created persistent resistance to Protestant uniformity. Roughly one-third of peers and a majority of northern JPs remained sympathetic to Catholicism; thousands of ‘Church Papists’ conformed only outwardly on Sundays while sheltering former Marian priests to celebrate Latin Mass in manor houses. Once Pope Pius V instructed Catholics in 1566 to boycott Anglican worship—and especially after Catholic claimant Mary, Queen of Scots arrived in England in May 1568—northern earls like Northumberland and Westmorland rallied around restoring Catholicism, culminating in the 1569 Revolt of the Northern Earls.\n\nFinally, shifting actions by Catholic foreign powers steadily intensified pressure on the settlement by the late 1560s. Although France was distracted by its Wars of Religion (1562) and Philip II initially preserved friendship to counter French influence, the Counter-Reformation sharpened international hostility: William Allen founded the Douai seminary in 1568 to train missionary priests, while Philip II dispatched the Duke of Alba with 10,000 ruthless Spanish troops to the Netherlands in 1567 right across the Channel. Combined with the 1568 Genoese Loan crisis, Alba’s nearby Catholic army emboldened English Catholic conspirators to believe foreign military help might back a rebellion against Elizabeth’s Church.',
      },
    },
  },

  KT2: {
    id: 'KT2',
    keyTopicNum: 2,
    totalPages: 16,
    dateRange: '1569–1588',
    title: 'Key Topic 2: Challenges to Elizabeth at Home and Abroad, 1569–88',
    subtitle: 'Catholic Plots & Mary’s Execution, Anglo-Spanish Rivalry, Outbreak of War, and Defeat of the Armada',
    footerQuip: 'Early Elizabethan England, 1558–88 • Key Topic 2 Pupil Workbook (1HI0/B4)',
    cover: {
      src: '../../images/armada_portrait.jpg',
      alt: 'The Armada Portrait of Queen Elizabeth I c. 1588 attributed to George Gower, showing Elizabeth with her hand on the globe and English fireships and wrecked Spanish galleons in the two windows behind her',
      photographer: 'Attributed to George Gower',
      date: 'c. 1588',
      repository: 'Woburn Abbey Collection, Bedfordshire',
      title: 'The Armada Portrait of Queen Elizabeth I (c. 1588)',
      caption:
        'Painted straight after the defeat of Philip II’s invasion fleet in August 1588, Gower’s portrait celebrates Protestant deliverance and England’s emerging Atlantic ambition.',
      cmeHeroHeightMm: 64,
      hubUrl: 'https://the-history-revision-hub.netlify.app/?view=lessons&unit=eee&lesson=kt2.1-plots-and-revolts',
      clues: [
        'Right hand resting over the Americas on the globe, signalling English imperial ambition.',
        'Left window depicting English fireships advancing across calm sunlit waters.',
        'Right window showing Spanish Armada galleons wrecked on storm-lashed rocky cliffs.',
      ],
      hingeQuestion:
        'How did the Armada Portrait turn England’s narrow naval survival in August 1588 into a powerful myth of Protestant triumph and global reach?',
    },
    lessons: [
      {
        code: 'KT 2.1',
        num: 1,
        appLessonId: 'lesson_2_1',
        slug: 'kt2.1-plots-and-revolts',
        aliases: ['kt2.1-plots-and-revolts', 'kt2.1', 'lesson_2_1'],
        pages: 'pp. 2–3',
        textbookSpread: 'Textbook pp. 12–13',
        title: 'Plots and Revolts at Home, 1569–87',
        enquiryQuestion:
          'Why did escalating assassination conspiracies compel Elizabeth to take the unprecedented step of executing an anointed monarch?',
        qrUrl: 'https://the-history-revision-hub.netlify.app/?view=lessons&unit=eee&lesson=kt2.1-plots-and-revolts',
        vocabBank: [
          'Babington Plot',
          'Regnans in Excelsis',
          'Durham Cathedral',
          'Francis Walsingham',
          'Ridolfi Plot',
          'Fotheringhay',
          'Bond of Association',
          'Northern Earls',
          'Thomas Phelippes',
          'Throckmorton Plot',
        ],
        stages: [
          {
            date: 'NOV 1569–JAN 1570',
            questionHeading: 'Why did the Revolt of the Northern Earls fail to depose Elizabeth?',
          },
          {
            date: '1570–1572',
            questionHeading: 'How did the 1570 Papal Bull and Ridolfi Plot endanger the Queen?',
          },
          {
            date: '1583–1584',
            questionHeading: 'Why did the Throckmorton Plot produce the Bond of Association?',
          },
          {
            date: 'JULY 1586',
            questionHeading: 'How did Walsingham’s beer-barrel cipher trap expose Babington and Mary?',
          },
          {
            date: '8 FEB 1587',
            questionHeading: 'Why was Mary Stuart’s execution at Fotheringhay so significant?',
          },
        ],
        q1: {
          stem: 'Describe one feature of Walsingham and the use of spies.',
          clue: 'Feature (1m) + specific factual detail such as double agents, ciphers, or Thomas Phelippes (1m).',
          wagoll:
            'One feature of Walsingham’s use of spies was an extensive network of double agents and expert codebreakers across England and Europe. In the 1586 Babington Plot, double agent Gilbert Gifford smuggled Mary Stuart’s secret letters inside Chartley Manor beer barrels straight to Walsingham’s cryptographer Thomas Phelippes to decipher.',
        },
        extended: {
          type: 'explain_12',
          questionNum: '2',
          tariff: 'Question 2: Explain Why [12 Marks]',
          shortLabel: 'Q2 Why',
          marks: 12,
          stem: 'Explain why Mary, Queen of Scots was executed in 1587.',
          stimulus: ['The Babington Plot', 'Walsingham’s spies'],
          wagoll:
            'The immediate trigger for Mary, Queen of Scots’ execution in February 1587 was her proven personal treason in the 1586 Babington Plot. Unlike the earlier Ridolfi (1571) and Throckmorton (1583) plots where Elizabeth could cling to doubts over Mary’s direct involvement, Catholic conspirator Anthony Babington planned for six gentlemen to assassinate Elizabeth while a foreign Catholic army invaded to free Mary. On 17 July 1586, Mary wrote back explicitly approving Elizabeth’s murder; under the 1584 Bond of Association and the 1585 Act for the Queen’s Safety, this signed endorsement of regicide made Mary legally liable to trial and execution at Fotheringhay Castle.\n\nSecond, Sir Francis Walsingham’s intelligence network and spies proved decisive in manufacturing irrefutable legal proof to overcome Elizabeth’s reluctance to execute an anointed monarch. Walsingham turned Catholic courier Gilbert Gifford into a double agent who intercepted every ciphered letter smuggled inside waterproof beer barrels at Chartley Manor, passing them to master codebreaker Thomas Phelippes. Once Phelippes decoded Mary’s fatal consent and forged a gallows postscript to expose Babington’s accomplices, Cecil and Parliament possessed unassailable evidence that forced Elizabeth to sign the death warrant.\n\nFinally, the outbreak of open war with Spain after August 1585 made keeping Mary alive an intolerable national security risk. Since Pope Pius V’s 1570 bull Regnans in Excelsis had absolved Catholics from obedience to Elizabeth, Philip II was actively assembling an invasion Armada by 1586–87 to overthrow Protestant England. Privy Councillors warned Elizabeth that as long as Mary lived, foreign invaders and domestic Catholic plotters possessed a legitimate Catholic Queen waiting to take the throne; executing Mary in February 1587 permanently eliminated that domestic figurehead before Spanish warships could sail.',
        },
      },
      {
        code: 'KT 2.2',
        num: 2,
        appLessonId: 'lesson_2_2',
        slug: 'kt2.2-relations-with-spain',
        aliases: ['kt2.2-relations-with-spain', 'kt2.2', 'lesson_2_2'],
        pages: 'pp. 4–5',
        textbookSpread: 'Textbook pp. 14–15',
        title: 'Relations with Spain, 1569–85',
        enquiryQuestion:
          'How did maritime raiding and covert proxy intervention escalate an undeclared cold war into direct military conflict with Spain?',
        qrUrl: 'https://the-history-revision-hub.netlify.app/?view=lessons&unit=eee&lesson=kt2.2-relations-with-spain',
        vocabBank: [
          'Cacafuego',
          'Treaty of Nonsuch',
          'Sea Beggars',
          'Golden Hind',
          'Philip II',
          'Nombre de Dios',
          'Treaty of Joinville',
          'William of Orange',
          'Deptford',
          'privateering',
        ],
        stages: [
          {
            date: '1570–1577',
            questionHeading: 'Why did Spanish rule in the Netherlands threaten English security?',
          },
          {
            date: '1570–1579',
            questionHeading: 'How did English privateering challenge Spain’s New World monopoly?',
          },
          {
            date: '1577–1580',
            questionHeading: 'How did Drake’s voyage in the Golden Hind raid Spanish Pacific wealth?',
          },
          {
            date: 'APRIL 1581',
            questionHeading: 'Why did knighting Drake at Deptford infuriate King Philip II?',
          },
          {
            date: '1584–AUG 1585',
            questionHeading: 'Why did William of Orange’s death and Joinville force Nonsuch (1585)?',
          },
        ],
        q1: {
          stem: 'Describe one feature of privateering and the activities of Drake.',
          clue: 'Feature (1m) + specific factual detail such as royal backing, Nombre de Dios, or the Cacafuego £140,000 haul (1m).',
          wagoll:
            'One feature of Drake’s privateering was Crown-backed raiding against Spanish treasure ships and ports in the Americas. During his 1577–80 circumnavigation aboard the Golden Hind, Drake captured the Spanish treasure galleon Cacafuego off Peru with £140,000 of silver and jewels, before Elizabeth knighted him at Deptford in 1581.',
        },
        extended: {
          type: 'essay_16',
          questionNum: '3',
          tariff: 'Question 3: Evaluative Essay [16 Marks — Zero SPaG]',
          shortLabel: 'Q3 Agree',
          marks: 16,
          stem: '‘Commercial rivalry was the main reason for rivalry between England and Spain in the years 1569–85.’ How far do you agree? Explain your answer.',
          stimulus: ['Privateering and the activities of Drake', 'Political and religious rivalry'],
          wagoll:
            'While commercial rivalry and Francis Drake’s audacious privateering provoked bitter Spanish anger throughout the 1570s, political and strategic rivalry over the Spanish Netherlands—intensified by religious hostility—was ultimately the decisive reason Anglo-Spanish relations collapsed into war by 1585.\n\nCommercial rivalry certainly poisoned relations between 1569 and 1581. Following Alba’s trade embargo on Antwerp after the 1568 Genoese Loan seizure, English merchants led by John Hawkins and Francis Drake sought to break Philip II’s strict imperial trade monopoly over the New World. Backed secretly by Elizabeth and court investors, Drake ambushed Spanish silver mule trains at Nombre de Dios in 1572 and raided the Pacific coast during his 1577–80 circumnavigation, seizing £140,000 from the Cacafuego alone and returning roughly £400,000 in bullion to Plymouth. When Elizabeth publicly defied Spanish ambassador Mendoza by boarding the Golden Hind at Deptford to knight Drake in April 1581, Philip II viewed Elizabeth as a state sponsor of piracy.\n\nHowever, religious rivalry steadily transformed commercial friction into an ideological conflict. Devoutly Catholic Philip II saw himself as the champion of the Counter-Reformation, especially after Pope Pius V excommunicated Elizabeth in 1570. Spain backed Catholic conspiracies to put Mary, Queen of Scots on the English throne—promising 10,000 troops in the 1571 Ridolfi Plot and 200,000 ducats in the 1583 Throckmorton Plot—while Elizabeth executed Jesuit missionaries and sheltered Protestant Dutch ‘Sea Beggars’.\n\nAbove all, geopolitical security in the Netherlands proved the decisive trigger that turned cold war into open conflict. England could never tolerate a hostile Spanish army controlling deep-water Channel ports just miles from London. While Elizabeth preferred covert subsidies to Dutch Protestant leader William of Orange during the 1570s, two events in 1584 shattered the balance of power: William of Orange was assassinated in July 1584, and Philip II signed the Catholic Treaty of Joinville with the French Guise family in December 1584. Faced with total Dutch collapse and Catholic encirclement, Elizabeth signed the Treaty of Nonsuch in August 1585, sending 7,400 English soldiers to fight Spain directly.\n\nOverall, I disagree that commercial rivalry was the main reason. Privateering for silver inflamed pride on both sides, yet Philip II tolerated Drake’s raids for over a decade without invading; it was the strategic and religious crisis in the Netherlands in 1584–85 that compelled England and Spain to go to war.',
        },
      },
      {
        code: 'KT 2.3',
        num: 3,
        appLessonId: 'lesson_2_3',
        slug: 'kt2.3-outbreak-of-war',
        aliases: ['kt2.3-outbreak-of-war', 'kt2.3', 'lesson_2_3'],
        pages: 'pp. 6–7',
        textbookSpread: 'Textbook pp. 16–17',
        title: 'Outbreak of War with Spain, 1585–88',
        enquiryQuestion:
          'Why did direct English military intervention in the Low Countries and the raid on Cadiz lead directly to the Spanish Armada?',
        qrUrl: 'https://the-history-revision-hub.netlify.app/?view=lessons&unit=eee&lesson=kt2.3-outbreak-of-war',
        vocabBank: [
          'Cadiz',
          'Governor-General',
          'Medina Sidonia',
          'Flushing',
          'barrel staves',
          'Deventer',
          'Duke of Parma',
          'Santa Cruz',
          'Zutphen',
          'Rowland Yorke',
        ],
        stages: [
          {
            date: 'DEC 1585–1586',
            questionHeading: 'Why did Dudley’s title of Governor-General anger both Queen and Dutch?',
          },
          {
            date: '1586–JAN 1587',
            questionHeading: 'How did betrayals at Deventer and Zutphen undermine Dudley’s campaign?',
          },
          {
            date: 'APRIL 1587',
            questionHeading: 'How did Drake’s raid on Cadiz disrupt Spain’s invasion preparations?',
          },
          {
            date: '1587–EARLY 1588',
            questionHeading: 'Why did burned barrel staves and Santa Cruz’s death weaken the fleet?',
          },
          {
            date: 'MAY–JULY 1588',
            questionHeading: 'What fatal flaw undermined Philip II’s plan to link Sidonia and Parma?',
          },
        ],
        q1: {
          stem: 'Describe one feature of Drake and the raid on Cadiz (1587).',
          clue: 'Feature (1m) + specific factual detail such as 30 warships destroyed, barrel staves burned, or 12-month delay (1m).',
          wagoll:
            'One feature of Drake’s raid on Cadiz in April 1587—nicknamed ‘singeing the King of Spain’s beard’—was the preemptive destruction of Spanish shipping and supplies. Sailing straight into Cadiz harbour, Drake destroyed around 30 warships and burned thousands of seasoned oak barrel staves, delaying the Armada’s launch by a crucial year.',
        },
        extended: {
          type: 'essay_16',
          questionNum: '3',
          tariff: 'Question 3: Evaluative Essay [16 Marks — Zero SPaG]',
          shortLabel: 'Q3 Agree',
          marks: 16,
          stem: '‘The actions of Robert Dudley were the main reason for deteriorating relations with Spain in the years 1585–88.’ How far do you agree? Explain your answer.',
          stimulus: ['English direct involvement in the Netherlands', 'Drake and the raid on Cadiz'],
          wagoll:
            'Robert Dudley’s provocative actions in the Netherlands certainly deepened Philip II’s determination to defeat England, yet they were part of a wider strategic escalation in which Elizabeth’s Treaty of Nonsuch (1585), Mary Stuart’s execution (1587), and Francis Drake’s raid on Cadiz (1587) played equally decisive roles in turning tension into full-scale invasion by 1588.\n\nOn the one hand, Dudley’s actions in 1585–87 directly challenged Philip II’s sovereignty over the Spanish Netherlands. In January 1586, without Elizabeth’s permission, Dudley accepted the supreme title of ‘Governor-General of the Netherlands’, implying England intended to depose Philip II permanently as ruler of the Dutch provinces rather than broker a compromise peace. Although Dudley’s campaign suffered from chronic underfunding and English defections by Sir William Stanley at Deventer and Rowland Yorke at Zutphen in 1587, his garrison successfully defended deep-water Channel ports such as Ostend and Flushing—convincing Philip II that he could never reconquer the Dutch rebels until England itself was neutralized.\n\nOn the other hand, Elizabeth’s foundational decision to sign the Treaty of Nonsuch in August 1585 had already crossed the diplomatic point of no return before Dudley even set foot in Flushing. Financing 7,400 English troops to fight Philip’s commander, the Duke of Parma, amounted to an open act of war, prompting Philip II immediately to seize English shipping in Spanish ports and begin planning the ‘Enterprise of England’ in late 1585.\n\nFurthermore, events in 1587 escalated hostilities to irreversible naval warfare. In February 1587, Elizabeth executed Catholic Mary, Queen of Scots, prompting Pope Sixtus V to promise Philip II one million gold ducats once Spanish troops landed on English soil. Two months later, in April 1587, Elizabeth sent Francis Drake to raid Cadiz harbour, where he humiliated Spain by destroying 30 vessels and burning seasoned oak barrel staves along the Algarve coast—infuriating Philip and locking Spain onto its 1588 Armada launch.\n\nIn conclusion, I only partly agree. Dudley’s acceptance of the Governor-Generalship insulted Spanish sovereignty and blocked Parma from deep-water ports, but it was a consequence of Elizabeth’s Treaty of Nonsuch—and it was Mary’s execution alongside Drake’s devastating raid on Cadiz in 1587 that drove Anglo-Spanish relations to all-out invasion in 1588.',
        },
      },
      {
        code: 'KT 2.4',
        num: 4,
        appLessonId: 'lesson_2_4',
        slug: 'kt2.4-spanish-armada',
        aliases: ['kt2.4-spanish-armada', 'kt2.4', 'lesson_2_4'],
        pages: 'pp. 10–11',
        textbookSpread: 'Textbook pp. 18–19',
        title: 'The Armada, 1588',
        enquiryQuestion:
          'Was the defeat of the Spanish Armada primarily the result of superior English naval tactics or flawed Spanish planning and Atlantic storms?',
        qrUrl: 'https://the-history-revision-hub.netlify.app/?view=lessons&unit=eee&lesson=kt2.4-spanish-armada',
        vocabBank: [
          'Gravelines',
          'crescent formation',
          'Tilbury',
          'fireships',
          'Lord Howard',
          'Protestant Wind',
          'race-built',
          'Isle of Wight',
          'broadsides',
          'Calais',
        ],
        stages: [
          {
            date: '29 JUL–4 AUG 1588',
            questionHeading: 'Why did the Spanish crescent hold firm during Channel skirmishes?',
          },
          {
            date: '7–8 AUG 1588',
            questionHeading: 'How did eight midnight fireships at Calais shatter the Spanish fleet?',
          },
          {
            date: '8 AUG 1588',
            questionHeading: 'How did race-built galleons and broadsides win at Gravelines?',
          },
          {
            date: 'AUG–SEPT 1588',
            questionHeading: 'Why did gales and cut anchors wreck retreating ships off Ireland?',
          },
          {
            date: 'AUG 1588–1589',
            questionHeading: 'How did Tilbury and the Armada victory secure Elizabeth’s prestige?',
          },
        ],
        q1: {
          stem: 'Describe one feature of Spanish invasion plans in 1588.',
          clue: 'Feature (1m) + specific factual detail such as 130 ships, Medina Sidonia meeting Parma’s 27,000 troops at Dunkirk, or landing in Kent (1m).',
          wagoll:
            'One feature of Spanish invasion plans in 1588 was the combined naval-and-land rendezvous in the English Channel. Philip II ordered the Duke of Medina Sidonia to sail 130 ships up the Channel to link up with the Duke of Parma’s 27,000 veteran soldiers in the Netherlands and escort their invasion barges across to Kent.',
        },
        extended: {
          type: 'explain_12',
          questionNum: '2',
          tariff: 'Question 2: Explain Why [12 Marks]',
          shortLabel: 'Q2 Why',
          marks: 12,
          stem: 'Explain why the English achieved victory over the Spanish Armada in 1588.',
          stimulus: ['Spanish invasion plans', 'English ship design and tactics'],
          wagoll:
            'Fatal weaknesses in Philip II’s Spanish invasion plans laid the foundation for English victory before a single shot was fired in the Channel. Philip’s rigid strategy required the Duke of Medina Sidonia’s 130-ship fleet to rendezvous off Dunkirk with the Duke of Parma’s 27,000 soldiers, yet Spain possessed no deep-water harbour in the Netherlands: Dutch Justin of Nassau’s ‘Sea Beggars’ blockaded Parma’s flat-bottomed barges in the shallow canals while messages between Sidonia and Parma took up to a week to arrive. Worse still, inexperienced commander Medina Sidonia replaced veteran Admiral Santa Cruz, while Drake’s 1587 Cadiz raid had burned seasoned barrel staves, leaving Spanish food rotting in leaky green-wood casks and cannons supplied with mismatched iron shot.\n\nSecond, superior English ship design and aggressive naval tactics shattered the Armada once it anchored helplessly off Calais. John Hawkins’ fast, low-profile ‘race-built’ galleons outperformed high-castled Spanish vessels designed for grappling and boarding, while English gun crews mounted long-range culverins on compact four-wheel carriages to fire rapid, destructive broadsides. Crucially, on the night of 7 August 1588, Lord Howard and Francis Drake sent eight burning, pitch-soaked fireships into Calais Roads, panicking Spanish captains into cutting their anchor cables and breaking their protective crescent formation so English broadsides could batter isolated ships at close range at the Battle of Gravelines on 8 August.\n\nFinally, shifting weather—celebrated in England as the ‘Protestant Wind’—turned tactical defeat at Gravelines into total strategic catastrophe. Strong south-westerly winds prevented Medina Sidonia from turning back to collect Parma’s army, driving the damaged Spanish fleet north around uncharted Scotland and western Ireland into ferocious late-summer Atlantic gales. Because Spanish captains had cut their anchors to escape the Calais fireships, dozens of crippled galleons were driven onto Scottish and Irish reefs, ensuring only 67 shattered vessels ever returned to Spain.',
        },
      },
    ],
    centrefold: {
      subtitle: '1569–1588: From Northern Rebellion & Catholic Plots to the Defeat of the Spanish Armada',
      qrUrl: 'https://the-history-revision-hub.netlify.app/?view=timeline&unit=eee&kt=2',
      nodes: [
        {
          num: 1,
          date: 'Nov 1569–Jan 1570',
          title: 'Revolt of Northern Earls',
          teacherKey: [
            'Earls of Northumberland and Westmorland march on Durham Cathedral and celebrate Latin Mass.',
            'Promised Spanish troops never land; Royal army under Earl of Sussex crushes the rising.',
            'Elizabeth orders ~450 rebels executed under martial law and reorganises Council of the North.',
          ],
        },
        {
          num: 2,
          date: '1570–1572',
          title: 'Papal Bull & Ridolfi Plot',
          teacherKey: [
            'Feb 1570: Pope Pius V issues Regnans in Excelsis excommunicating Elizabeth as a heretic.',
            '1571: Italian banker Roberto Ridolfi plots 10,000-man Spanish landing and Mary-Norfolk marriage.',
            'Cecil uncovers ciphers; Duke of Norfolk is executed on Tower Hill in June 1572.',
          ],
        },
        {
          num: 3,
          date: '1577–Apr 1581',
          title: 'Circumnavigation & Deptford',
          teacherKey: [
            '1577–80: Francis Drake sails Golden Hind round the globe, looting £140,000 from the Cacafuego.',
            'Returns ~£400,000 in Spanish bullion to Plymouth (4,700% return for Elizabeth and investors).',
            'Apr 1581: Elizabeth defies Philip II by boarding Golden Hind at Deptford to knight Drake.',
          ],
        },
        {
          num: 4,
          date: '1583–1584',
          title: 'Throckmorton & Joinville',
          teacherKey: [
            'Nov 1583: Walsingham uncovers Throckmorton Plot (French Guise invasion + Spanish gold); Mendoza expelled.',
            '1584: Bond of Association pledges signatories to hunt down anyone plotting or benefiting from regicide.',
            'Jul–Dec 1584: William of Orange assassinated; Spain and French Catholic League sign Treaty of Joinville.',
          ],
        },
        {
          num: 5,
          date: 'Aug 1585–1586',
          title: 'Treaty of Nonsuch & Dudley',
          teacherKey: [
            'Aug 1585: Elizabeth signs Treaty of Nonsuch, sending 7,400 English troops under Robert Dudley to Netherlands.',
            'Jan 1586: Dudley accepts title ‘Governor-General’, infuriating Elizabeth and Philip II alike.',
            '1586–87: Underfunded campaign suffers Stanley/Yorke betrayals at Deventer and Zutphen, yet holds Ostend.',
          ],
        },
        {
          num: 6,
          date: 'Jul 1586–Feb 1587',
          title: 'Babington & Mary’s Execution',
          teacherKey: [
            'Jul 1586: Walsingham’s double agent Gifford and codebreaker Phelippes decode Mary’s beer-barrel letters.',
            'Oct 1586: Mary convicted under Act for the Queen’s Safety for endorsing Elizabeth’s assassination.',
            '8 Feb 1587: Mary, Queen of Scots executed at Fotheringhay Castle, intensifying Philip II’s war resolve.',
          ],
        },
        {
          num: 7,
          date: '19 Apr 1587',
          title: 'Drake’s Raid on Cadiz',
          teacherKey: [
            'Drake sails 24 ships into Cadiz harbour (‘singeing the King of Spain’s beard’), destroying ~30 ships.',
            'Raids Algarve coast, burning thousands of seasoned oak barrel staves needed for Armada water casks.',
            'Delays Spanish Armada launch by 12 vital months while English defences and galleons prepare.',
          ],
        },
        {
          num: 8,
          date: 'Jul–Aug 1588',
          title: 'Calais Fireships & Gravelines',
          teacherKey: [
            '7 Aug 1588: 8 midnight English fireships scatter Medina Sidonia’s anchored crescent off Calais.',
            '8 Aug 1588: Race-built English galleons shatter Spanish hulls at close range at Battle of Gravelines.',
            'Gales drive anchorless fleet around Scotland and Ireland; Elizabeth rallies troops at Tilbury; only 67 ships return.',
          ],
        },
      ],
    },
    consolidation: {
      page12Title: 'Key Topic 2 Rapid Essay Blueprints: 5-Minute Exam Planning Grids [2 × 6m = 12 Marks]',
      blueprintA: {
        code: 'Blueprint A',
        examType: 'Paper 2 Q2 • Explain Why (12m Stem)',
        marks: 6,
        stem: 'Explain why the Revolt of the Northern Earls took place in 1569–70.',
        stimulus: ['the Duke of Norfolk', 'Catholicism in the north'],
        rows: [
          {
            label: 'Reason 1 (Stimulus 1)',
            evidenceModel: '1569 court plot for Catholic-sympathising Duke of Norfolk to marry Mary, Queen of Scots; Elizabeth sent Norfolk to the Tower (Oct 1569).',
            linkModel: 'Panicked Earls of Northumberland and Westmorland into launching desperate armed rebellion rather than face arrest for treason.',
          },
          {
            label: 'Reason 2 (Stimulus 2)',
            evidenceModel: 'Deep northern Catholic loyalty; Protestant Bishop James Pilkington of Durham alienated local gentry; rebels held Latin Mass in Durham Cathedral.',
            linkModel: 'Religious resentment rallied 4,600 northern rebels hoping to restore Roman Catholicism and overthrow Elizabeth’s 1559 settlement.',
          },
          {
            label: 'Reason 3 (Own Knowledge)',
            evidenceModel: 'Loss of noble political power & income under Elizabeth: Cecil and Protestant ‘new men’ replaced Northumberland and Westmorland in northern offices.',
            linkModel: 'Political humiliation and lost royal patronage pushed both earls to gamble on replacing Elizabeth with Catholic Mary Stuart.',
          },
        ],
      },
      blueprintB: {
        code: 'Blueprint B',
        examType: 'Paper 2 Q3/Q4 • How Far Agree (16m Stem — Zero SPaG)',
        marks: 6,
        stem: '‘Drake’s raid on Cadiz (1587) was the main reason for the English victory over the Spanish Armada.’ How far do you agree? Explain your answer.',
        stimulus: ['Cadiz harbour (1587)', 'English ship design and tactics'],
        forModel:
          'April 1587 ‘Singeing the King of Spain’s Beard’ destroyed 30 ships, delayed invasion 12 vital months so England fortified coasts, and burned seasoned barrel staves—forcing green-wood casks that rotted Armada food and water in 1588.',
        againstModel:
          'In 1588 battle, Hawkins’s agile race-built galleons, fast-reloading long-range culverins, Howard/Drake’s 7 August Calais fireships, Philip II’s flawed Parma rendezvous (no deep-water port, Dutch flyboats), and Atlantic gales actually defeated the fleet.',
        verdictModel:
          'Disagree overall: Cadiz weakened Spanish logistics and bought preparation time, but superior English race-built gunnery, Calais fireships, and Philip II’s unworkable Flanders plan won the 1588 campaign.',
      },
      workoutTitle: 'Paper 2 Question 1 Feature Workout: High-Probability Spec Drills [6 × 2m = 12 Marks]',
      drills: [
        {
          num: '1(a)',
          stem: 'Describe one feature of the Revolt of the Northern Earls, 1569–70.',
          wagoll:
            'One feature of the Revolt of the Northern Earls was its religious defiance against Elizabeth’s Protestant settlement. In November 1569, the Catholic Earls of Northumberland and Westmorland seized Durham Cathedral, tore up the English Bible and Prayer Book, and celebrated a traditional Latin Mass.',
        },
        {
          num: '1(b)',
          stem: 'Describe one feature of the Ridolfi Plot (1571).',
          wagoll:
            'One feature of the 1571 Ridolfi Plot was its plan for a coordinated foreign Catholic invasion and domestic coup. Italian banker Roberto Ridolfi arranged for 10,000 Spanish troops from the Netherlands to land in England while the Duke of Norfolk married Mary, Queen of Scots and deposed Elizabeth.',
        },
        {
          num: '1(c)',
          stem: 'Describe one feature of the Throckmorton Plot (1583).',
          wagoll:
            'One feature of the 1583 Throckmorton Plot was joint Franco-Spanish Catholic involvement. Uncovered when Walsingham’s agents tortured courier Francis Throckmorton, the plot planned for the French Duke of Guise to invade Sussex financed by Spanish gold, leading to ambassador Mendoza’s expulsion.',
        },
        {
          num: '1(d)',
          stem: 'Describe one feature of the key events of the Spanish Armada.',
          wagoll:
            'One feature of the key events of the Spanish Armada was the midnight fireship attack at Calais Roads on 7 August 1588. English commanders sent eight burning ships toward the anchored Spanish fleet, panicking Spanish captains into cutting their anchors and scattering into English broadsides at Gravelines.',
        },
        {
          num: '1(e)',
          stem: 'Describe one feature of the Babington Plot (1586).',
          wagoll:
            'One feature of the 1586 Babington Plot was Walsingham’s interception of coded letters smuggled inside Chartley Hall beer barrels. Codebreaker Thomas Phelippes deciphered Mary Stuart’s 17 July reply explicitly endorsing Elizabeth’s assassination, providing the treason evidence that sealed Mary’s execution.',
        },
        {
          num: '1(f)',
          stem: 'Describe one feature of political and religious rivalry between England and Spain.',
          wagoll:
            'One feature of Anglo-Spanish political and religious rivalry was conflict over the Protestant Dutch Revolt in the Spanish Netherlands. Elizabeth covertly sent loans, volunteers, and temporary harbour shelter to William of Orange’s rebels to stop Catholic Spain stationing a hostile army opposite the Thames.',
        },
      ],
    },
    miniMock: {
      title: 'Key Topic 2 End-of-Topic Mini-Mock (1569–88)',
      totalMarks: 16,
      timeMinutes: 25,
      q1a: {
        stem: 'Describe one feature of English direct involvement in the Netherlands.',
        wagoll:
          'One feature of English direct involvement in the Netherlands was the August 1585 Treaty of Nonsuch. Under its terms, Elizabeth agreed to fund and dispatch 7,400 English soldiers under Robert Dudley, Earl of Leicester, to protect Dutch Protestant rebels and Channel ports against Spain.',
      },
      q1b: {
        stem: 'Describe one feature of the significance of Mary, Queen of Scots’ execution in 1587.',
        wagoll:
          'One feature of the significance of Mary’s execution in February 1587 was that it removed the main Catholic figurehead for domestic plots inside England while provoking international fury from Philip II of Spain, who accelerated preparations for the 1588 Armada to claim the English crown himself.',
      },
      q2: {
        questionNum: '2',
        tariff: 'Question 2: Explain Why [12 Marks]',
        stem: 'Explain why relations with Spain deteriorated in the years 1585–88.',
        stimulus: ['English direct involvement in the Netherlands', 'Drake and the raid on Cadiz'],
        wagoll:
          'First, English direct military involvement in the Netherlands from August 1585 transformed years of covert rivalry into open undeclared war with Spain. Alarmed by William of Orange’s assassination and the Franco-Spanish Catholic Treaty of Joinville (1584), Elizabeth signed the Treaty of Nonsuch in August 1585, dispatching 7,400 English soldiers under Robert Dudley, Earl of Leicester, to fight Philip II’s army under the Duke of Parma. Relations worsened dramatically in January 1586 when Dudley accepted the title ‘Governor-General of the Netherlands’, which Philip II viewed as an intolerable usurpation of his rightful Habsburg sovereignty, prompting Philip to seize English merchant ships and begin assembling an invasion fleet.\n\nSecond, Francis Drake’s aggressive naval raids between 1585 and 1587 repeatedly humiliated Spain and forced Philip II toward full-scale retaliation. After raiding Spanish colonial settlements at Santo Domingo and Cartagena in the Caribbean in 1585–86, Drake sailed 24 ships straight into Cadiz harbour in April 1587 (‘singeing the King of Spain’s beard’), destroying around 30 Spanish vessels and burning thousands of seasoned barrel staves along the Algarve coast before capturing the rich treasure carrack San Felipe. Although this delayed the Armada by twelve months, the public humiliation hardened Philip II’s determination to crush English naval piracy permanently.\n\nFinally, the execution of Catholic Mary, Queen of Scots at Fotheringhay Castle in February 1587 eliminated any remaining hope of peaceful Catholic succession and turned Anglo-Spanish tension into a religious crusade. Before her death, Mary bequeathed her claim to the English throne not to her Protestant son James VI, but directly to King Philip II of Spain. Backed by Pope Sixtus V’s promise of one million gold ducats once Spanish soldiers landed in England, Philip II now possessed both dynastic and papal justification to launch the 130-ship Spanish Armada in May 1588.',
      },
    },
  },

  KT3: {
    id: 'KT3',
    keyTopicNum: 3,
    totalPages: 16,
    dateRange: '1558–1588',
    title: 'Key Topic 3: Elizabethan Society in the Age of Exploration, 1558–88',
    subtitle: 'Education & Leisure, Poverty & Vagabondage, Oceanic Exploration, and the Colonisation of Virginia',
    footerQuip: 'Early Elizabethan England, 1558–88 • Key Topic 3 Pupil Workbook (1HI0/B4)',
    cover: {
      src: '../../images/john_white_chief_herowan.jpg',
      alt: 'John White 1585 watercolour inscribed A cheife Herowan showing a standing Carolina Algonquian Secotan leader wearing a copper gorget on a cord, feather ornament, and fringed deerskin apron',
      photographer: 'John White (Watercolour)',
      date: '1585',
      repository: 'The British Museum, London (1906,0509.1.21)',
      title: '‘A cheife Herowan’ — Algonquian Leader at Roanoke (1585)',
      caption:
        'Painted from life on Roanoke Island during Raleigh’s 1585 Virginia expedition, John White’s watercolour records Secotan leadership before English food demands sparked fatal violence.',
      cmeHeroHeightMm: 65,
      hubUrl: 'https://the-history-revision-hub.netlify.app/?view=lessons&unit=eee&lesson=kt3.1-education-and-leisure',
      clues: [
        'Square copper gorget on a neck cord — prized trade metal English settlers bartered for corn.',
        'Shaved roach hairstyle, upright feather, and body markings denoting elite Secotan rank.',
        'Composed folded-arm stance painted from life before Ralph Lane’s ambush killed Wingina.',
      ],
      hingeQuestion:
        'Why did English dependence on Algonquian food supplies rapidly turn initial curiosity—captured in John White’s 1585 watercolours—into fatal conflict at Roanoke?',
    },
    lessons: [
      {
        code: 'KT 3.1',
        num: 1,
        appLessonId: 'lesson_3_1',
        slug: 'kt3.1-education-and-leisure',
        aliases: ['kt3.1-education-and-leisure', 'kt3.1', 'lesson_3_1'],
        pages: 'pp. 2–3',
        textbookSpread: 'Textbook pp. 20–21',
        title: 'Education and Leisure, 1558–88',
        enquiryQuestion:
          'How did educational expansion and popular theatrical culture reflect both social change and strict Tudor hierarchy?',
        qrUrl: 'https://the-history-revision-hub.netlify.app/?view=lessons&unit=eee&lesson=kt3.1-education-and-leisure',
        vocabBank: [
          'groundlings',
          'grammar schools',
          'Great Chain of Being',
          'The Theatre',
          'petty schools',
          'Inns of Court',
          'bear-baiting',
          'James Burbage',
          'dame schools',
          'Oxford',
        ],
        stages: [
          {
            date: '1558–1580s',
            questionHeading: 'How did Tudor hierarchy and gender shape basic literacy and schooling?',
          },
          {
            date: '1558–1580s',
            questionHeading: 'How did endowed grammar schools educate gentry and merchant sons?',
          },
          {
            date: '1558–1580s',
            questionHeading: 'How did noble home tutors differ from Oxford, Cambridge, and Law Inns?',
          },
          {
            date: '1558–1580s',
            questionHeading: 'How did blood sports and pastimes reflect class divides in England?',
          },
          {
            date: '1576–1588',
            questionHeading: 'Why did purpose-built London playhouses thrive despite Puritan anger?',
          },
        ],
        q1: {
          stem: 'Describe one feature of sport and pastimes in early Elizabethan England.',
          clue: 'Feature (1m) + specific factual detail such as noble hunting/fencing, violent folk football, or bear-baiting (1m).',
          wagoll:
            'One feature of sport and pastimes in early Elizabethan England was sharp division by social class alongside shared blood sports. While nobles practised expensive pursuits like hunting deer, hawking, and real tennis, all social ranks attended Southwark arenas such as the Paris Garden to gamble on bear-baiting and cockfighting.',
        },
        extended: {
          type: 'essay_16',
          questionNum: '3',
          tariff: 'Question 3: Evaluative Essay [16 Marks — Zero SPaG]',
          shortLabel: 'Q3 Agree',
          marks: 16,
          stem: '‘The growth of the theatre was the most significant feature of sport, pastimes and the theatre in early Elizabethan England.’ How far do you agree? Explain your answer.',
          stimulus: ['The theatre', 'Pastimes of the nobility and lower classes'],
          wagoll:
            'The dramatic rise of permanent commercial playhouses after 1576 was indeed the most innovative and culturally significant feature of Elizabethan leisure, even though traditional class-divided sports and blood sports continued to occupy the everyday lives of far more rural English people.\n\nOn the one hand, the transformation of the theatre between 1576 and 1588 revolutionized English entertainment. Whereas early Elizabethan strolling players performed in temporary inn-yards and risked arrest as vagabonds under the 1572 Act unless licensed by noble patrons such as the Earl of Leicester’s Men or the Queen’s Men (1583), actor James Burbage built England’s first purpose-built playhouse—‘The Theatre’ in Shoreditch—in 1576, swiftly followed by the Curtain (1577) and the Rose (1587). Uniquely, playhouses brought opposing social classes under one roof while preserving visible hierarchy: labourer ‘groundlings’ paid just one penny to stand in the open pit watching gripping secular dramas by Christopher Marlowe and Thomas Kyd, while gentry and nobles paid extra for cushioned seats in covered upper galleries, despite fierce Puritan opposition over plague and immorality.\n\nOn the other hand, traditional pastimes of the nobility and lower classes remained central to reinforcing the social order across every county outside London. Aristocratic leisure intentionally displayed wealth and chivalric exclusivity: peers maintained private deer parks for hunting on horseback, practised hawking and fencing, and competed in royal Accession Day tilts. Conversely, working labourers played rough, rule-free parish folk football where whole villages brawled across fields, often resulting in broken bones or deaths.\n\nFurthermore, spectator blood sports and tavern pastimes were far more widespread nationally than London playgoing. Across towns and Southwark arenas like the Paris Garden, rich and poor alike gambled heavily on chained bear-baiting, bull-baiting, and cockfighting, while archery, dice, ballads, and alehouse drinking structured weekly parish life across rural shires.\n\nOverall, I agree with the statement. Although blood sports and class-based country pastimes involved larger rural numbers and reinforced traditional hierarchy, they represented centuries-old continuity; the creation of permanent, affordable commercial theatres after 1576 was the defining new cultural breakthrough of Elizabeth’s reign.',
        },
      },
      {
        code: 'KT 3.2',
        num: 2,
        appLessonId: 'lesson_3_2',
        slug: 'kt3.2-poverty-and-vagabondage',
        aliases: ['kt3.2-poverty-and-vagabondage', 'kt3.2', 'lesson_3_2'],
        pages: 'pp. 4–5',
        textbookSpread: 'Textbook pp. 22–23',
        title: 'The ‘Problem’ of the Poor, 1558–88',
        enquiryQuestion:
          'Why did poverty and vagabondage surge, and why did Tudor policy shift from harsh punishment toward parish work relief?',
        qrUrl: 'https://the-history-revision-hub.netlify.app/?view=lessons&unit=eee&lesson=kt3.2-poverty-and-vagabondage',
        vocabBank: [
          'enclosure',
          'sturdy beggars',
          '1572 Vagabonds Act',
          'impotent poor',
          'bad harvests',
          'Bridewell',
          'sheep farming',
          'Thomas Harman',
          'poor rate',
          'inflation',
        ],
        stages: [
          {
            date: '1558–1580s',
            questionHeading: 'How did rapid population growth and bad harvests fuel food inflation?',
          },
          {
            date: '1558–1580s',
            questionHeading: 'Why did enclosure and profitable sheep farming cause rural eviction?',
          },
          {
            date: '1560s–1570s',
            questionHeading: 'Why did authorities distinguish ‘impotent poor’ from ‘sturdy beggars’?',
          },
          {
            date: '1572',
            questionHeading: 'How did the 1572 Vagabonds Act combine whipping with compulsory rates?',
          },
          {
            date: '1576',
            questionHeading: 'How did the 1576 Poor Relief Act pioneer raw wool work and Bridewells?',
          },
        ],
        q1: {
          stem: 'Describe one feature of policies towards the poor in early Elizabethan England.',
          clue: 'Feature (1m) + specific factual detail from the 1563 Statute of Artificers, 1572 Vagabonds Act, or 1576 Poor Relief Act (1m).',
          wagoll:
            'One feature of Elizabethan policies towards the poor was combining harsh physical punishment for idle vagrants with compulsory local taxation for genuine relief. Under the 1572 Vagabonds Act, JPs levied a compulsory parish poor rate to support the impotent poor while ordering unlicensed sturdy beggars to be whipped and bored through the ear with a hot iron.',
        },
        extended: {
          type: 'essay_16',
          questionNum: '3',
          tariff: 'Question 3: Evaluative Essay [16 Marks — Zero SPaG]',
          shortLabel: 'Q3 Agree',
          marks: 16,
          stem: '‘Economic pressures were the main reason for the increase in poverty and vagabondage in the years 1558–88.’ How far do you agree? Explain your answer.',
          stimulus: ['Sheep farming and enclosure', 'Population growth'],
          wagoll:
            'Economic pressures—such as price inflation, falling real wages, cloth trade slumps, and agricultural enclosure for sheep farming—played a major role in impoverishing Elizabethan labourers, yet sustained demographic population growth was the underlying root catalyst that made every economic shock so severe between 1558 and 1588.\n\nOn the one hand, economic and agricultural pressures directly destroyed rural jobs and purchasing power. Because raw wool and cloth accounted for roughly 80% of England’s exports, profit-seeking landowners enclosed open village strip-fields with hedges and converted arable crop land into pasture for sheep farming, which required a tiny fraction of the workforce. Evicted tenant farmers and landless cottagers lost common grazing rights while rack-renting landlords sharply raised entry fines and rents. Simultaneously, sudden foreign trade disruptions—such as the Duke of Alba’s 1568 Antwerp cloth embargo—threw thousands of East Anglian and West Country spinners and weavers out of work overnight, while earlier Tudor coin debasement fuelled price inflation as real wages stagnated.\n\nOn the other hand, rapid population growth from roughly 3 million in 1551 to nearly 4 million by 1588 was the fundamental structural driver behind rising poverty and vagabondage. With hundreds of thousands more mouths to feed and stagnant farming yields, demand for grain and housing permanently outstripped supply—quadrupling bread prices whenever consecutive bad harvests struck in the mid-1550s, 1573–77, and 1586. Surplus rural youths unable to inherit land flooded into towns like London and Norwich looking for work, swelling the ranks of wandering ‘masterless men’ who terrified magistrates.\n\nFurthermore, long-term institutional changes left destitute families without a safety net: Henry VIII’s earlier Dissolution of the Monasteries had abolished traditional church charity and hospital alms, forcing jobless families onto the roads until Parliament introduced compulsory poor rates in 1572 and wool work-stocks in 1576.\n\nIn conclusion, I agree to a large extent because inflation, rack-renting, cloth embargoes, and sheep enclosure were the immediate mechanisms that evicted tenants and crushed wages. However, those economic pressures were inseparable from relentless population growth: without a million extra people competing for scarce jobs, land, and grain, neither bad harvests nor enclosure would have produced mass vagabondage on such a national scale.',
        },
      },
      {
        code: 'KT 3.3',
        num: 3,
        appLessonId: 'lesson_3_3',
        slug: 'kt3.3-exploration-and-drake',
        aliases: ['kt3.3-exploration-and-drake', 'kt3.3', 'lesson_3_3'],
        pages: 'pp. 6–7',
        textbookSpread: 'Textbook pp. 24–25',
        title: 'Exploration and Voyages of Discovery, 1558–88',
        enquiryQuestion:
          'How did navigational science, galleon engineering, and Drake’s circumnavigation turn England into an oceanic sea power?',
        qrUrl: 'https://the-history-revision-hub.netlify.app/?view=lessons&unit=eee&lesson=kt3.3-exploration-and-drake',
        vocabBank: [
          'Mercator',
          'culverins',
          'astrolabe',
          'Nova Albion',
          'Muscovy Company',
          'lateen sails',
          'Strait of Magellan',
          'quadrant',
          'Northwest Passage',
          'Antwerp',
        ],
        stages: [
          {
            date: '1558–1575',
            questionHeading: 'How did astrolabes, quadrants, and Mercator maps transform navigation?',
          },
          {
            date: '1558–1577',
            questionHeading: 'How did race-built galleons, lateen sails, and culverins improve ships?',
          },
          {
            date: '1550s–1570s',
            questionHeading: 'Why did Antwerp’s collapse spur new trade companies and Arctic voyages?',
          },
          {
            date: '1577–1580',
            questionHeading: 'How did Drake navigate the Strait of Magellan and claim Nova Albion?',
          },
          {
            date: '1580–1588',
            questionHeading: 'Why was Drake’s £400,000 return so significant for English sea power?',
          },
        ],
        q1: {
          stem: 'Describe one feature of the impact of new technology on ships and sailing.',
          clue: 'Feature (1m) + specific factual detail such as astrolabes/quadrants, 1569 Mercator maps, or race-built galleons with lateen sails (1m).',
          wagoll:
            'One feature of the impact of new technology on sailing was accurate open-ocean navigation using brass astrolabes, quadrants, and Gerardus Mercator’s 1569 world map projection. By plotting true compass bearings as straight lines and measuring star latitude accurately, English captains could sail safely across vast oceans out of sight of coastlines.',
        },
        extended: {
          type: 'explain_12',
          questionNum: '2',
          tariff: 'Question 2: Explain Why [12 Marks]',
          shortLabel: 'Q2 Why',
          marks: 12,
          stem: 'Explain why Drake’s circumnavigation of the globe (1577–80) was significant.',
          stimulus: ['Spanish treasure', 'England’s reputation as a sea power'],
          wagoll:
            'First, Drake’s circumnavigation (1577–80) was financially and commercially transformative because of the vast haul of captured Spanish treasure brought back to Plymouth in September 1580. Having raided Spanish Pacific ports like Valparaiso and captured the treasure galleon Cacafuego carrying £140,000 of silver and jewels alone, the Golden Hind returned roughly £400,000 in bullion—delivering a staggering 4,700% profit to court syndicate investors. Elizabeth’s personal royal share exceeded her entire annual Crown income, enabling her to pay off England’s foreign debt while encouraging wealthy London merchants to fund joint-stock companies such as the Levant Company (1581).\n\nSecond, the voyage dramatically elevated England’s reputation as a global sea power and inspired early colonial ambition. Despite losing four of his five ships, surviving violent gales in the Strait of Magellan, and crossing the uncharted Pacific and Indian Oceans, Drake returned as only the second captain in history—and the first Englishman—to sail around the world. Furthermore, in June 1579 Drake landed on the Californian coast and claimed ‘Nova Albion’ (New England) for Queen Elizabeth, demonstrating that Philip II’s Pacific monopoly could be breached and inspiring Sir Walter Raleigh’s subsequent Virginia expeditions.\n\nFinally, the circumnavigation had major diplomatic significance by sharply escalating Anglo-Spanish hostility toward war. Furious at English plunder in waters claimed exclusively by Spain, ambassador Mendoza demanded Drake’s execution as a pirate; instead, Elizabeth publicly boarded the Golden Hind at Deptford in April 1581 and knighted Drake on deck. This calculated royal defiance humiliated Philip II, proved Elizabeth backed maritime aggression against Spain’s empire, and deepened the strategic rivalry that culminated in war in 1585.',
        },
      },
      {
        code: 'KT 3.4',
        num: 4,
        appLessonId: 'lesson_3_4',
        slug: 'kt3.4-virginia-roanoke',
        aliases: ['kt3.4-virginia-roanoke', 'kt3.4', 'lesson_3_4'],
        pages: 'pp. 10–11',
        textbookSpread: 'Textbook pp. 26–27',
        title: 'Attempted Colonisation of Virginia, 1584–90',
        enquiryQuestion:
          'Why did Sir Walter Raleigh promote Virginia, and why did both the 1585 and 1587 Roanoke settlements fail?',
        qrUrl: 'https://the-history-revision-hub.netlify.app/?view=lessons&unit=eee&lesson=kt3.4-virginia-roanoke',
        vocabBank: [
          'Tiger',
          'Walter Raleigh',
          'Wingina',
          'CROATOAN',
          'Richard Hakluyt',
          'Ralph Lane',
          'Manteo',
          'John White',
          'Richard Grenville',
          'Roanoke',
        ],
        stages: [
          {
            date: '1584',
            questionHeading: 'How did Raleigh’s royal patent and Hakluyt justify colonising Virginia?',
          },
          {
            date: 'APRIL 1585',
            questionHeading: 'Why did recruiting 107 soldiers and gentlemen weaken the 1585 voyage?',
          },
          {
            date: 'JUNE 1585–1586',
            questionHeading: 'How did the wreck of the Tiger ruin seed corn and force food reliance?',
          },
          {
            date: 'JUNE 1586',
            questionHeading: 'Why did killing Chief Wingina force Lane’s colonists to flee with Drake?',
          },
          {
            date: '1587–1590',
            questionHeading: 'Why did the Armada turn John White’s 1587 families into a Lost Colony?',
          },
        ],
        q1: {
          stem: 'Describe one feature of the significance of Raleigh in the attempted colonisation of Virginia.',
          clue: 'Feature (1m) + specific factual detail such as securing the 1584 royal charter, fundraising, naming Virginia, or bringing Manteo and Wanchese to London (1m).',
          wagoll:
            'One feature of Raleigh’s significance was masterminding, funding, and promoting the entire Virginia venture despite Elizabeth forbidding him to sail in person. Armed with his 1584 royal patent, Raleigh sent Barlowe’s reconnaissance voyage, named ‘Virginia’ to honour the Queen, commissioned Richard Hakluyt’s propaganda, and recruited court investors and colonists.',
        },
        extended: {
          type: 'essay_16',
          questionNum: '3',
          tariff: 'Question 3: Evaluative Essay [16 Marks — Zero SPaG]',
          shortLabel: 'Q3 Agree',
          marks: 16,
          stem: '‘The drive to expand trade was the main reason for the attempted colonisation of Virginia.’ How far do you agree? Explain your answer.',
          stimulus: ['The significance of Raleigh', 'Rivalry with Spain'],
          wagoll:
            'The drive to expand trade and acquire raw materials untied to European rivals was a powerful economic motive behind the attempted colonisation of Virginia in the 1580s, yet strategic rivalry with Catholic Spain—championed by Sir Walter Raleigh and Richard Hakluyt—was equally crucial in winning royal backing from Queen Elizabeth.\n\nOn the one hand, commercial pressures strongly encouraged English merchants and courtiers to establish an American colony. Since the collapse of the Antwerp cloth market and Spanish trade embargoes had exposed England’s dangerous over-reliance on European wool exports, geographer Richard Hakluyt’s 1584 Discourse on Western Planting argued that North America offered both a captive market for English woollens and a direct source of exotic commodities—sugar, wine, naval timber, pitch, hemp, and hoped-for gold or copper—without paying high duties to Spanish, Mediterranean, or Baltic middlemen. Colonisation also promised employment for England’s growing population of landless poor while friendly Algonquian trade scouted in 1584 suggested rich commercial rewards.\n\nOn the other hand, geopolitical and religious rivalry with Philip II’s Spain gave Virginia urgent strategic purpose by 1584–85. As Anglo-Spanish tension slid toward open war under the Treaty of Nonsuch (1585), Elizabeth and Walsingham backed Virginia primarily because Roanoke offered a permanent North American naval base from which English privateers could ambush Spanish treasure fleets sailing up the Florida Channel from the Caribbean—draining Philip II’s war chest while challenging Catholic domination of the New World.\n\nFinally, neither commercial nor anti-Spanish motives would have produced an expedition in 1584–87 without the personal ambition and organisation of Sir Walter Raleigh. Granted a six-year royal patent by Elizabeth in March 1584 after his half-brother Humphrey Gilbert drowned, Raleigh invested £40,000 of his own and court backers’ wealth, flattered Elizabeth by naming the territory ‘Virginia’, brought Manteo and Wanchese to London so Thomas Harriot could learn Algonquian, and organised both the 1585 Grenville/Lane military venture and John White’s 1587 family colony.\n\nIn conclusion, I agree to a substantial extent, because long-term trade independence from Europe underpinned merchant investment and Hakluyt’s blueprint. However, trade cannot be separated from anti-Spanish strategy: in the crisis years of 1584–88, Elizabeth approved Raleigh’s venture above all because Virginia promised to enrich English commerce while simultaneously striking at Spain’s Atlantic treasure lifeline.',
        },
      },
    ],
    centrefold: {
      subtitle: '1558–1590: Education, Poor Relief Legislation, Global Navigation & the Roanoke Ventures',
      qrUrl: 'https://the-history-revision-hub.netlify.app/?view=timeline&unit=eee&kt=3',
      nodes: [
        {
          num: 1,
          date: '1563 & 1567',
          title: 'Statute of Artificers & Harman',
          teacherKey: [
            'Population rises from ~3m to ~4m alongside enclosure for sheep farming and price inflation.',
            '1563 Statute of Artificers caps wages and requires JPs to collect poor relief.',
            '1567: Thomas Harman’s Caveat for Common Cursitors fuels fear of ‘counterfeit’ sturdy beggars.',
          ],
        },
        {
          num: 2,
          date: '1569',
          title: 'Mercator’s World Map',
          teacherKey: [
            'Gerardus Mercator publishes his cylindrical map projection with parallel latitude/longitude grid.',
            'Combined with brass astrolabes and quadrants, sailors plot accurate open-ocean compass bearings.',
            'John Hawkins pioneers fast, low-forecastle ‘race-built’ galleons armed with long-range culverins.',
          ],
        },
        {
          num: 3,
          date: '1572 & 1576',
          title: 'Vagabonds & Poor Relief Acts',
          teacherKey: [
            '1572 Vagabonds Act introduces compulsory parish poor rate alongside whipping and ear-boring.',
            '1576 Poor Relief Act recognises unemployment is economic as well as moral.',
            'Parishes supply raw wool/hemp for able-bodied work; stubborn vagrants sent to Bridewells.',
          ],
        },
        {
          num: 4,
          date: '1576',
          title: 'Burbage Builds ‘The Theatre’',
          teacherKey: [
            'James Burbage opens England’s first permanent purpose-built playhouse in Shoreditch outside City walls.',
            'Followed by The Curtain (1577) and The Rose (1587); Queen’s Men formed in 1583.',
            '1d groundlings stand in the pit beneath gallery gentry; Puritans condemn plague and sin.',
          ],
        },
        {
          num: 5,
          date: 'Dec 1577–Sep 1580',
          title: 'Drake’s Circumnavigation',
          teacherKey: [
            'Drake sails Pelican (renamed Golden Hind) through Strait of Magellan into the Pacific.',
            'Captures Cacafuego (£140k) and claims Nova Albion (June 1579) before crossing Indian Ocean.',
            'Returns ~£400,000 treasure to Plymouth (4,700% investor profit) and boosts English sea prestige.',
          ],
        },
        {
          num: 6,
          date: '1584',
          title: 'Raleigh’s Virginia Charter',
          teacherKey: [
            'Mar 1584: Elizabeth grants Walter Raleigh a 6-year patent to colonise unclaimed North America.',
            'Amadas and Barlowe scout Roanoke Island and bring Algonquians Manteo and Wanchese to London.',
            'Richard Hakluyt writes Discourse on Western Planting promoting trade and anti-Spanish bases.',
          ],
        },
        {
          num: 7,
          date: '1585–Jun 1586',
          title: 'First Roanoke Colony Fails',
          teacherKey: [
            'Apr–Jun 1585: 107 male colonists (mostly soldiers, zero farmers) sail under Grenville and Ralph Lane.',
            'Flagship Tiger hits Ocracoke sandbar, seawater ruining seed corn and forcing reliance on Secotan food.',
            'Jun 1586: After Lane’s men ambush and kill Chief Wingina, starving settlers evacuate with Drake.',
          ],
        },
        {
          num: 8,
          date: '1587–Aug 1590',
          title: 'John White & ‘CROATOAN’',
          teacherKey: [
            '1587: John White leads 118 men, women, and children (including baby Virginia Dare) back to Roanoke.',
            '1588 Spanish Armada causes Elizabeth to impound every English ship, trapping White for 3 years.',
            'Aug 1590: White returns to find Roanoke deserted with ‘CROATOAN’ carved into a palisade post.',
          ],
        },
      ],
    },
    consolidation: {
      page12Title: 'Key Topic 3 Rapid Essay Blueprints: 5-Minute Exam Planning Grids [2 × 6m = 12 Marks]',
      blueprintA: {
        code: 'Blueprint A',
        examType: 'Paper 2 Q2 • Explain Why (12m Stem)',
        marks: 6,
        stem: 'Explain why English sailors went on voyages of exploration in the years 1558–88.',
        stimulus: ['the drive to expand trade', 'new technology on ships and sailing'],
        rows: [
          {
            label: 'Reason 1 (Stimulus 1)',
            evidenceModel: 'Antwerp cloth market collapse & Spanish embargoes hit woollen exports; joint-stock Muscovy (1555), Eastland (1579), Levant (1581) companies.',
            linkModel: 'Forced London merchants and investors to fund oceanic expeditions hunting direct spice, silk, and New World markets.',
          },
          {
            label: 'Reason 2 (Stimulus 2)',
            evidenceModel: 'Brass astrolabes, quadrants/back-staffs, Mercator’s 1569 map projection, and Hawkins’s sleek race-built galleons with lateen sails.',
            linkModel: 'Made multi-month Atlantic and Pacific crossings far more accurate, seaworthy, and well-armed, enabling ambitious global voyages.',
          },
          {
            label: 'Reason 3 (Own Knowledge)',
            evidenceModel: 'Privateering wealth & Protestant rivalry with Spain: Drake’s 1577–80 Golden Hind raid on the Cacafuego yielded a 4,700% investor return.',
            linkModel: 'Spectacular bullion profits and patriotic desire to weaken Catholic Philip II’s empire inspired gentry and royal backing.',
          },
        ],
      },
      blueprintB: {
        code: 'Blueprint B',
        examType: 'Paper 2 Q3/Q4 • How Far Agree (16m Stem — Zero SPaG)',
        marks: 6,
        stem: '‘Education in the home and schools changed very little in early Elizabethan England.’ How far do you agree? Explain your answer.',
        stimulus: ['grammar schools', 'petty and dame schools'],
        forModel:
          'Education still reinforced the Great Chain of Being: ~70% of men and ~90% of women remained illiterate, farm labourers’ children worked from age six, and girls were barred from grammar schools and Oxford/Cambridge.',
        againstModel:
          'Over 70 new Protestant town grammar schools opened in the 1560s–70s (with scholarships for poorer bright boys), petty schools expanded middling male literacy to ~30%, and Emmanuel/Jesus Colleges & Inns of Court grew rapidly.',
        verdictModel:
          'Agree for the rural poor and women (strong continuity), but disagree for gentry, merchant, and yeoman boys, whose schooling and literacy expanded markedly.',
      },
      workoutTitle: 'Paper 2 Question 1 Feature Workout: High-Probability Spec Drills [6 × 2m = 12 Marks]',
      drills: [
        {
          num: '1(a)',
          stem: 'Describe one feature of education in the home in early Elizabethan England.',
          wagoll:
            'One feature of education in the home was private tuition for children of the nobility. Wealthy noble boys and girls were taught at home by university-educated tutors in Latin, French, music, dancing, and horse-riding, though noble girls also learned needlework and household management.',
        },
        {
          num: '1(b)',
          stem: 'Describe one feature of the theatre in early Elizabethan England.',
          wagoll:
            'One feature of the Elizabethan theatre was socially mixed yet physically tiered audiences inside open-air playhouses like The Theatre (1576). Poorer ‘groundlings’ paid just one penny to stand in the uncovered yard around the stage while wealthy gentry paid extra to sit in covered galleries.',
        },
        {
          num: '1(c)',
          stem: 'Describe one feature of changing attitudes towards the poor in early Elizabethan England.',
          wagoll:
            'One feature of changing attitudes towards the poor was Parliament’s recognition by the 1576 Poor Relief Act that some able-bodied people were genuinely unemployed rather than lazy criminals, leading parishes to provide raw wool and flax so the deserving unemployed could earn a living.',
        },
        {
          num: '1(d)',
          stem: 'Describe one feature of Drake’s circumnavigation of the globe.',
          wagoll:
            'One feature of Drake’s 1577–80 circumnavigation was raiding Spanish Pacific ports and treasure ships along South America. Sailing the Golden Hind through the Strait of Magellan, Drake captured the Spanish galleon Cacafuego carrying £140,000 in silver and jewels before crossing the Pacific home.',
        },
        {
          num: '1(e)',
          stem: 'Describe one feature of education in schools in early Elizabethan England.',
          wagoll:
            'One feature of education in schools was the rapid expansion of fee-paying town grammar schools for boys aged 10 to 14. Over 70 grammar schools were founded in the 1560s and 1570s, teaching a strict classical curriculum of Latin, Greek, scripture, and rhetoric from 6 a.m. to 5 p.m.',
        },
        {
          num: '1(f)',
          stem: 'Describe one feature of the increase in vagabondage in early Elizabethan England.',
          wagoll:
            'One feature of the increase in vagabondage was rural eviction caused by land enclosure for sheep farming. As landlords fenced village arable fields into low-labour pastures, displaced farmhands wandered toward towns seeking work, fuelling gentry fears of crime and rebellion.',
        },
      ],
    },
    miniMock: {
      title: 'Key Topic 3 End-of-Topic Mini-Mock (1558–88)',
      totalMarks: 16,
      timeMinutes: 25,
      q1a: {
        stem: 'Describe one feature of the drive to expand trade in the Elizabethan era.',
        wagoll:
          'One feature of the drive to expand trade was establishing royal chartered joint-stock companies to bypass Spanish and Antwerp markets. Merchants pooled capital in the Muscovy Company (Russia) and Levant Company (1581, Ottoman Empire) while explorers like Martin Frobisher searched for a Northwest Passage to Asia.',
      },
      q1b: {
        stem: 'Describe one feature of the first settlement in Virginia.',
        wagoll:
          'One feature of the first Virginia settlement at Roanoke (1585–86) was its flawed recruitment of 107 all-male colonists under Ralph Lane and Richard Grenville. Roughly half were gentlemen soldiers seeking gold rather than skilled farmers capable of growing crops to make the colony self-sufficient.',
      },
      q2: {
        questionNum: '2',
        tariff: 'Question 2: Explain Why [12 Marks]',
        stem: 'Explain why the first settlement in Virginia failed.',
        stimulus: ['Supplies and the voyage', 'Relations with Native Americans'],
        wagoll:
          'First, disastrous problems with the 1585 voyage and lost supplies crippled the Roanoke settlement from the moment it reached North America. Setting sail from Plymouth in April 1585—already too late in the agricultural year to plant spring crops—flagship Tiger struck a shallow sandbar at Ocracoke Inlet on 29 June 1585. Flooding seawater ruined almost all the expedition’s seed corn, salt, and gunpowder, leaving the settlers unable to grow harvests for the coming winter or preserve meat and fish.\n\nSecond, flawed recruitment and weak colonial planning compounded these supply shortages. Sir Walter Raleigh’s 107 all-male colonists lacked essential farming families, stone-masons, and fishermen: roughly half were soldiers and status-conscious gentlemen expecting easy gold or Native labour rather than manual agricultural toil, while military governor Ralph Lane clashed bitterly with naval commander Sir Richard Grenville. Without seed grain or farming skills, the garrison could never achieve self-sufficiency before Grenville sailed back to England for resupply.\n\nFinally, deteriorating relations with local Algonquian Native Americans destroyed the settlers’ only remaining source of food and forced total evacuation in June 1586. Initially reliant on Chief Wingina’s Secotan people for corn and fish traps, Grenville torched the village of Aquascogoc over a missing silver cup, and as winter hunger bit, Wingina (renamed Pemisapan) refused to hand over scarce tribal grain stores and planned resistance. When Ralph Lane launched a preemptive ambush on 1 June 1586 and beheaded Wingina, surrounding tribes cut off all food supplies; facing starvation and retaliation, the surviving colonists abandoned Virginia aboard Francis Drake’s passing fleet on 18 June 1586.',
      },
    },
  },
};

module.exports = {
  EEE_BOOKLETS,
};
