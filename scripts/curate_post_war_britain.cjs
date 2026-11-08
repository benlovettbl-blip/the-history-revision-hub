const fs = require('fs');
const path = require('path');

const curationPWB = {
  1: { // Lesson 1
    1: {
      words: [
        { term: "Dame Millicent Garrett Fawcett", clue: "Leader of the NUWSS who advocated patient persuasion, democratic campaigning, and law-abiding methods to win the vote." },
        { term: "National Union of Women's Suffrage Societies (NUWSS)", clue: "The peaceful, democratic federation founded in 1897 uniting over 50,000 constitutional suffragists across Britain." },
        { term: "constitutional campaigning", clue: "The law-abiding strategy of mass petitions, parliamentary lobbying, and public education to prove women mature democratic citizens." }
      ],
      model_sentence: "Under the leadership of <strong>Dame Millicent Garrett Fawcett</strong>, the <strong>National Union of Women's Suffrage Societies (NUWSS)</strong> relied on <strong>constitutional campaigning</strong> to make women's enfranchisement a respectable mainstream demand."
    },
    2: {
      words: [
        { term: "Emmeline Pankhurst", clue: "Charismatic co-founder of the militant WSPU in Manchester in 1903 who championed radical direct action to force political concessions." },
        { term: "Women's Social and Political Union (WSPU)", clue: "The militant suffrage organization founded in 1903 that operated as a disciplined hierarchy to demand immediate voting rights." },
        { term: "'Deeds, not words' militancy", clue: "The radical motto driving Suffragettes to heckle ministers, chain themselves to railings, and disrupt Parliament for media headlines." }
      ],
      model_sentence: "Frustrated by decades of parliamentary inaction, <strong>Emmeline Pankhurst</strong> established the <strong>Women's Social and Political Union (WSPU)</strong> to wage an uncompromising campaign of <strong>'Deeds, not words' militancy</strong>."
    },
    3: {
      words: [
        { term: "hunger strike protests", clue: "The prison resistance tactic initiated by Marion Wallace Dunlop in 1909 demanding political prisoner status, met with brutal forced feeding." },
        { term: "'Cat and Mouse Act'", clue: "The notorious 1913 law allowing hunger strikers to be released on license when dangerously frail and re-arrested once recovered." },
        { term: "Hunger Strike Medals", clue: "Military-style silver honours awarded by the WSPU to women who endured imprisonment and the physical agony of forced feeding." }
      ],
      model_sentence: "When the government countered Suffragette <strong>hunger strike protests</strong> with the cruel <strong>'Cat and Mouse Act'</strong>, the WSPU awarded commemorative <strong>Hunger Strike Medals</strong> to honour their physical sacrifice."
    },
    4: {
      words: [
        { term: "'The Bodyguard'", clue: "The elite security unit of thirty athletic suffragettes tasked with protecting WSPU leaders from police assault and re-arrest." },
        { term: "Edith Garrud", clue: "Pioneering martial arts instructor who taught suffragettes unarmed combat and jiu-jitsu to evade and overpower police officers." },
        { term: "jiu-jitsu self-defence", clue: "The Japanese martial art utilized by Suffragette bodyguards wielding concealed Indian clubs to shield Emmeline Pankhurst from arrest." }
      ],
      model_sentence: "Trained by martial artist <strong>Edith Garrud</strong> in <strong>jiu-jitsu self-defence</strong>, the covert WSPU security unit known as <strong>'The Bodyguard'</strong> successfully protected fugitive leaders from police batons."
    },
    5: {
      words: [
        { term: "Representation of the People Act 1918", clue: "Historic legislation that enfranchised 8.4 million women aged 30 and over who met minimal property qualifications." },
        { term: "wartime patriotic service", clue: "The mobilization of millions of women into munitions factories, transport, and agriculture during WWI, proving their vital national contribution." },
        { term: "property qualification enfranchisement", clue: "The parliamentary compromise granting votes only to women householders or wives of householders, excluding younger working-class women." }
      ],
      model_sentence: "Recognising years of pre-war pressure and vital <strong>wartime patriotic service</strong>, Parliament passed the <strong>Representation of the People Act 1918</strong>, although it retained a restrictive <strong>property qualification enfranchisement</strong>."
    }
  },
  2: { // Lesson 2
    1: {
      words: [
        { term: "Operation Pied Piper evacuation", clue: "The September 1939 wartime scheme that evacuated 1.5 million city children and mothers to rural foster families." },
        { term: "shared wartime trauma", clue: "The collective suffering from the Blitz, rationing, and civilian casualties that united the British public across social classes." },
        { term: "cross-class social solidarity", clue: "The unprecedented exposure of affluent rural host families to inner-city child poverty and malnutrition, sparking demands for welfare reform." }
      ],
      model_sentence: "The nationwide <strong>Operation Pied Piper evacuation</strong> exposed deep urban deprivation to rural hosts, generating a powerful sense of <strong>shared wartime trauma</strong> and <strong>cross-class social solidarity</strong>."
    },
    2: {
      words: [
        { term: "Beveridge Report (1942)", clue: "Sir William Beveridge's revolutionary social blueprint that sold 630,000 copies proposing universal state protection 'from the cradle to the grave'." },
        { term: "Five Giants of Want and Disease", clue: "The societal scourges identified by Beveridge—Want, Disease, Ignorance, Squalor, and Idleness—that post-war reconstruction had to defeat." },
        { term: "universal social security", clue: "A comprehensive state insurance system providing sickness, unemployment, and retirement benefits funded by flat-rate contributions." }
      ],
      model_sentence: "Published in December 1942, the revolutionary <strong>Beveridge Report (1942)</strong> proposed <strong>universal social security</strong> to slay the <strong>Five Giants of Want and Disease</strong> blighting British society."
    },
    3: {
      words: [
        { term: "1945 Labour election landslide", clue: "Clement Attlee's stunning 146-seat parliamentary victory over Winston Churchill's Conservatives in the first general election in a decade." },
        { term: "Clement Attlee", clue: "Labour Prime Minister whose decisive administration nationalized major industries and constructed the modern British welfare state." },
        { term: "'Let Us Face the Future' manifesto", clue: "Labour's progressive 1945 election manifesto pledging to eliminate poverty, provide full employment, and build a free health service." }
      ],
      model_sentence: "Campaigning on their visionary <strong>'Let Us Face the Future' manifesto</strong>, <strong>Clement Attlee</strong> led the party to the historic <strong>1945 Labour election landslide</strong>."
    },
    4: {
      words: [
        { term: "National Insurance Act 1946", clue: "Legislation creating a unified system of flat-rate unemployment, sickness, and maternity benefits funded by weekly national insurance stamps." },
        { term: "National Assistance Act 1948", clue: "The landmark act that abolished the hated Victorian Poor Law workhouse system and created an unconditional state safety net." },
        { term: "abolition of the Poor Law", clue: "The formal dismantling of punitive workhouses, ensuring that poverty was no longer treated as a personal moral failure." }
      ],
      model_sentence: "Through the passage of the <strong>National Insurance Act 1946</strong> and the <strong>National Assistance Act 1948</strong>, Attlee's government achieved the historic <strong>abolition of the Poor Law</strong>."
    },
    5: {
      words: [
        { term: "National Health Service (NHS)", clue: "The world's first universal health system founded on 5 July 1948 providing free medical treatment at the point of delivery from general taxation." },
        { term: "Health Minister Aneurin Bevan", clue: "The passionate Welsh socialist minister who overcame fierce opposition from private doctors to establish the National Health Service." },
        { term: "'stuffed their mouths with gold' compromise", clue: "Bevan's pragmatic concession allowing hospital consultants to retain lucrative private patients inside NHS hospitals to secure their cooperation." }
      ],
      model_sentence: "On 5 July 1948, <strong>Health Minister Aneurin Bevan</strong> launched the universal <strong>National Health Service (NHS)</strong> after securing doctor agreement through his famous <strong>'stuffed their mouths with gold' compromise</strong>."
    }
  },
  3: { // Lesson 3
    1: {
      words: [
        { term: "post-war labour shortages", clue: "Severe manpower deficits across nationalized coal, rail networks, and London Transport following the devastation of World War II." },
        { term: "Commonwealth worker recruitment", clue: "The British government's deliberate campaign to invite citizens from the Caribbean, India, and Pakistan to rebuild British infrastructure." },
        { term: "rebuilding essential public services", clue: "Staffing hospitals, bus networks, and manufacturing industries critical to national economic survival." }
      ],
      model_sentence: "Facing acute <strong>post-war labour shortages</strong> across transport and hospitals, the government actively encouraged <strong>Commonwealth worker recruitment</strong> to assist in <strong>rebuilding essential public services</strong>."
    },
    2: {
      words: [
        { term: "British Nationality Act 1948", clue: "Historic statute creating Citizens of the UK and Colonies (CUKC), granting 800 million imperial subjects unrestricted rights of entry and settlement." },
        { term: "Citizens of the UK and Colonies (CUKC)", clue: "The common legal status entitling all Commonwealth citizens to British passports, legal equality, and immediate voting rights." },
        { term: "unrestricted right of settlement", clue: "The statutory guarantee allowing Commonwealth arrivals to live, work, and settle in Great Britain without visas or quotas." }
      ],
      model_sentence: "The landmark <strong>British Nationality Act 1948</strong> conferred equal status on <strong>Citizens of the UK and Colonies (CUKC)</strong>, guaranteeing them an <strong>unrestricted right of settlement</strong> in Britain."
    },
    3: {
      words: [
        { term: "HMT Empire Windrush (22 June 1948)", clue: "The converted troopship that docked at Tilbury Docks carrying 492 Caribbean passengers to help rebuild post-war Britain." },
        { term: "Lord Kitchener calypso recording", clue: "Trinidadian singer Aldwyn Roberts singing his iconic love letter 'London is the place for me' directly to Pathé newsreel cameras on the gangway." },
        { term: "Caribbean pioneer arrivals", clue: "RAF veterans, nurses, welders, and artisans who answered Britain's call for workers and laid the foundation of modern multicultural Britain." }
      ],
      model_sentence: "When <strong>HMT Empire Windrush (22 June 1948)</strong> docked at Tilbury, the historic <strong>Lord Kitchener calypso recording</strong> celebrated the hope of the arriving <strong>Caribbean pioneer arrivals</strong>."
    },
    4: {
      words: [
        { term: "'No Blacks, No Irish, No Dogs'", clue: "Notorious signs placed in boarding house windows by white private landlords in the 1950s enforcing housing discrimination." },
        { term: "informal colour bar", clue: "Unofficial racial discrimination in private housing, banking, pubs, and employment that operated without formal legislation." },
        { term: "Caribbean 'pardner' credit unions", clue: "Community rotating credit schemes where members pooled weekly savings to help families purchase freehold homes and bypass racist mortgage lenders." }
      ],
      model_sentence: "Confronting the humiliations of an <strong>informal colour bar</strong> and signs reading <strong>'No Blacks, No Irish, No Dogs'</strong>, immigrants organized <strong>Caribbean 'pardner' credit unions</strong> to achieve financial independence."
    },
    5: {
      words: [
        { term: "1958 Notting Hill riots", clue: "Five nights of racist violence in London where white 'Teddy Boy' mobs attacked Black residents and homes with iron bars and petrol bombs." },
        { term: "Claudia Jones", clue: "Trinidad-born communist journalist and activist who founded the West Indian Gazette in Brixton to fight racial injustice and organize the Black community." },
        { term: "Notting Hill Carnival origins", clue: "The historic indoor Caribbean carnival organized by Claudia Jones at St Pancras Town Hall in January 1959 to heal racial divisions through music and culture." }
      ],
      model_sentence: "Following the racial terror of the <strong>1958 Notting Hill riots</strong>, visionary activist <strong>Claudia Jones</strong> founded the cultural showcase that marked the <strong>Notting Hill Carnival origins</strong>."
    }
  },
  4: { // Lesson 4
    1: {
      words: [
        { term: "Bristol Omnibus Company", clue: "The state-owned municipal bus operator in Bristol that openly enforced a racial colour bar against hiring Black or Asian bus crews." },
        { term: "commercial colour bar", clue: "The discriminatory hiring policy that relegated Black employees to low-paid garage cleaning while banning them from driving or conducting buses." },
        { term: "Transport and General Workers' Union", clue: "The union branch whose white bus crews voted to strike if management hired non-white workers, colluding with company discrimination." }
      ],
      model_sentence: "In early 1963, the <strong>Bristol Omnibus Company</strong> and the <strong>Transport and General Workers' Union</strong> colluded to maintain an exclusionary <strong>commercial colour bar</strong> on the city's bus routes."
    },
    2: {
      words: [
        { term: "Paul Stephenson", clue: "26-year-old Black youth worker and community leader who orchestrated the undercover sting operation exposing Bristol's bus discrimination." },
        { term: "Guy Bailey job interview rejection", clue: "The immediate telephone cancellation of qualified 18-year-old Guy Bailey's interview once the company learned he was Black." },
        { term: "West Indian Development Council", clue: "The grassroots civil rights group founded by Stephenson, Roy Hackett, and Owen Henry that launched the Bristol Bus Boycott." }
      ],
      model_sentence: "When <strong>Paul Stephenson</strong> exposed the blatant <strong>Guy Bailey job interview rejection</strong>, the <strong>West Indian Development Council</strong> voted to mobilize a direct-action campaign."
    },
    3: {
      words: [
        { term: "citywide bus boycott", clue: "The four-month peaceful boycott launched on 30 April 1963 where thousands of Bristolians refused to ride the municipal buses." },
        { term: "Bristol University student solidarity", clue: "Hundreds of student demonstrators who joined picket lines and marched through city streets carrying protest placards." },
        { term: "mass non-violent non-cooperation", clue: "The direct-action strategy inspired by Martin Luther King Jr.'s Montgomery Bus Boycott that applied intense moral and economic pressure." }
      ],
      model_sentence: "Relying on <strong>mass non-violent non-cooperation</strong>, the <strong>citywide bus boycott</strong> gained nationwide support bolstered by enthusiastic <strong>Bristol University student solidarity</strong>."
    },
    4: {
      words: [
        { term: "Tony Benn political intervention", clue: "Local Bristol South East Labour MP who championed the boycott, condemned racial discrimination, and brought the issue to national party leaders." },
        { term: "Bristol Omnibus Company surrender", clue: "The capitulation of company management on 28 August 1963, formally ending the colour bar and announcing equal employment opportunities." },
        { term: "first Black bus conductor hired", clue: "Pakistani Sikh worker Raghbir Singh and Jamaican Norman Samuels being employed on Bristol buses in September 1963, cementing the victory." }
      ],
      model_sentence: "Propelled by high-level <strong>Tony Benn political intervention</strong>, the <strong>Bristol Omnibus Company surrender</strong> on 28 August 1963 led directly to the <strong>first Black bus conductor hired</strong> weeks later."
    },
    5: {
      words: [
        { term: "Race Relations Act 1965", clue: "Harold Wilson's landmark legislation—the first of its kind in British history—that legally banned racial discrimination in public accommodations." },
        { term: "statutory ban on racial discrimination", clue: "The legal prohibition against refusing services or denying access to hotels, public transport, and restaurants based on race." },
        { term: "British civil rights turning point", clue: "The Bristol Boycott's historic legacy in forcing Parliament to replace customary prejudice with enforceable statutory civil rights protections." }
      ],
      model_sentence: "Recognised as a pivotal <strong>British civil rights turning point</strong>, the Bristol campaign directly pressured Parliament to enact the historic <strong>Race Relations Act 1965</strong>, establishing a <strong>statutory ban on racial discrimination</strong>."
    }
  },
  5: { // Lesson 5
    1: {
      words: [
        { term: "British nuclear deterrent", clue: "The development of an independent British atomic and hydrogen bomb stockpile to maintain great-power status alongside the US and USSR." },
        { term: "Operation Hurricane (1952)", clue: "Britain's first atomic bomb test conducted off Western Australia, making Britain the world's third nuclear power." },
        { term: "Aldermaston CND marches", clue: "The famous annual four-day, 52-mile protest walks from London to the Atomic Weapons Research Establishment in Berkshire." }
      ],
      model_sentence: "While governments justified the <strong>British nuclear deterrent</strong> following <strong>Operation Hurricane (1952)</strong>, widespread public fear sparked the massive <strong>Aldermaston CND marches</strong>."
    },
    2: {
      words: [
        { term: "Campaign for Nuclear Disarmament (CND)", clue: "The mass peace movement founded in 1958 by Bertrand Russell and Canon John Collins demanding unilateral British nuclear disarmament." },
        { term: "Gerald Holtom peace symbol", clue: "The iconic semaphore-based emblem (combining N and D for Nuclear Disarmament) created in 1958 that became a universal global symbol for peace." },
        { term: "annual Aldermaston protest marches", clue: "Mass Easter weekend demonstrations drawing over 100,000 citizens marching peacefully through the English countryside." }
      ],
      model_sentence: "Founded to demand unilateral disarmament, the <strong>Campaign for Nuclear Disarmament (CND)</strong> adopted the timeless <strong>Gerald Holtom peace symbol</strong> and organized the <strong>annual Aldermaston protest marches</strong>."
    },
    3: {
      words: [
        { term: "Royal Observer Corps (ROC)", clue: "A civilian defence organization that operated a secret network of 1,563 subterranean concrete monitoring posts across Great Britain." },
        { term: "subterranean monitoring posts", clue: "Blast-proof underground bunkers designed for volunteer observers to survive a thermonuclear attack and record nuclear detonations." },
        { term: "nuclear fallout radiation tracking", clue: "The critical task of plotting radioactive fallout plumes across the UK using fixed-survey meters to guide government survival plans." }
      ],
      model_sentence: "Trained in <strong>nuclear fallout radiation tracking</strong>, dedicated volunteers of the <strong>Royal Observer Corps (ROC)</strong> staffed over 1,500 <strong>subterranean monitoring posts</strong> during the Cold War."
    },
    4: {
      words: [
        { term: "'Protect and Survive' pamphlet", clue: "The infamous Home Office booklet published in 1980 instructing households on how to survive a nuclear attack using cardboard and sandbags." },
        { term: "'inner core' refuge mockery", clue: "Public derision directed at government instructions to build makeshift shelter cores by leaning doors against interior walls inside homes." },
        { term: "Home Office civil defence propaganda", clue: "Official booklets and terrifying television public information films that downplayed the apocalyptic reality of thermonuclear warfare." }
      ],
      model_sentence: "Widespread ridicule greeted <strong>Home Office civil defence propaganda</strong> when the 1980 <strong>'Protect and Survive' pamphlet</strong> prescribed an absurd <strong>'inner core' refuge mockery</strong>."
    },
    5: {
      words: [
        { term: "'Protest and Survive' counter-manifesto", clue: "Historian E. P. Thompson's blistering anti-nuclear pamphlet denouncing official civil defence advice as lethal deception." },
        { term: "historian E. P. Thompson", clue: "Prominent socialist historian and CND leader whose passionate writings helped mobilize a new generation against nuclear cruise missiles." },
        { term: "Greenham Common Women's Peace Camp", clue: "The non-violent direct-action protest camp established in 1981 by women encircling the RAF base holding American nuclear cruise missiles." }
      ],
      model_sentence: "Reinvigorated by <strong>historian E. P. Thompson</strong> and his bestselling <strong>'Protest and Survive' counter-manifesto</strong>, activists established the <strong>Greenham Common Women's Peace Camp</strong> to blockade nuclear missiles."
    }
  }
};

const pwbPath = path.join(__dirname, '../data/post_war_britain.json');
const publicPwbPath = path.join(__dirname, '../public/data/post_war_britain.json');
const dbPath = path.join(__dirname, '../database.json');
const publicDbPath = path.join(__dirname, '../public/database.json');

const pwbData = JSON.parse(fs.readFileSync(pwbPath, 'utf8'));

let stagesUpdated = 0;
let errors = [];

pwbData.lessons.forEach((lesson, lIdx) => {
  const lessonNum = lIdx + 1;
  const stages = lesson.workbook_stages || lesson.stages || [];

  stages.forEach((stage, sIdx) => {
    const stageNum = sIdx + 1;
    const curated = curationPWB[lessonNum] && curationPWB[lessonNum][stageNum];

    if (!curated) {
      errors.push(`Missing curation for Lesson ${lessonNum} Stage ${stageNum}`);
      return;
    }

    stage.words = curated.words;
    stage.key_terms = curated.words;
    stage.model_sentence = curated.model_sentence;

    curated.words.forEach(w => {
      if (w.term.endsWith(':')) errors.push(`Trailing colon: ${w.term}`);
      if (!curated.model_sentence.includes(`<strong>${w.term}</strong>`)) {
        errors.push(`Missing term in model: L${lessonNum}S${stageNum} -> ${w.term}`);
      }
    });

    stagesUpdated++;
  });
});

if (errors.length > 0) {
  console.error(`Validation errors (${errors.length}):`, errors);
  process.exit(1);
}

fs.writeFileSync(pwbPath, JSON.stringify(pwbData, null, 2), 'utf8');
console.log(`Updated ${pwbPath}`);

if (fs.existsSync(publicPwbPath)) {
  fs.writeFileSync(publicPwbPath, JSON.stringify(pwbData, null, 2), 'utf8');
  console.log(`Updated ${publicPwbPath}`);
}

if (fs.existsSync(dbPath)) {
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  db.post_war_britain = pwbData;
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  console.log('Updated database.json (post_war_britain key)');
}

if (fs.existsSync(publicDbPath)) {
  const pdb = JSON.parse(fs.readFileSync(publicDbPath, 'utf8'));
  pdb.post_war_britain = pwbData;
  fs.writeFileSync(publicDbPath, JSON.stringify(pdb, null, 2), 'utf8');
  console.log('Updated public/database.json (post_war_britain key)');
}

console.log(`Successfully healed all ${stagesUpdated} stages of Post-War Britain!`);

