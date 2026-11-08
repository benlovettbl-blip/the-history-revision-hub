const fs = require('fs');
const path = require('path');

const curationL9L12 = {
  9: { // Lesson 9
    1: {
      words: [
        { term: "Battle of Dien Bien Phu", clue: "The catastrophic 55-day siege in May 1954 where General Vo Nguyen Giap's Viet Minh forces shattered French colonial rule in Indochina." },
        { term: "Geneva Accords (1954)", clue: "The international peace conference agreements that ended French colonial warfare and temporarily partitioned Vietnam." },
        { term: "17th Parallel partition", clue: "The temporary demilitarized demarcation line separating Ho Chi Minh's communist North from the Western-backed South." }
      ],
      model_sentence: "Following the decisive French defeat at the <strong>Battle of Dien Bien Phu</strong>, the <strong>Geneva Accords (1954)</strong> established a temporary <strong>17th Parallel partition</strong> pending nationwide democratic elections."
    },
    2: {
      words: [
        { term: "Ngo Dinh Diem", clue: "The staunchly anti-communist, Catholic prime minister installed by the United States to head the newly proclaimed Republic of Vietnam in Saigon." },
        { term: "rigged 1955 referendum", clue: "The fraudulent electoral contest orchestrated by Diem that claimed 98.2% support and deposed Emperor Bao Dai." },
        { term: "1956 reunification elections", clue: "The nationwide democratic elections mandated by the Geneva Accords that Diem cancelled with US backing, fearing a landslide victory for Ho Chi Minh." }
      ],
      model_sentence: "After consolidating power through a notoriously <strong>rigged 1955 referendum</strong>, South Vietnamese leader <strong>Ngo Dinh Diem</strong> blocked the scheduled <strong>1956 reunification elections</strong> with full American backing."
    },
    3: {
      words: [
        { term: "National Liberation Front (Vietcong)", clue: "The communist-led guerrilla insurgency established in December 1960 to unite southern dissidents and overthrow Diem's regime." },
        { term: "Diem's rural repression", clue: "Violent military sweeps, land seizures from peasants, and execution of political suspects under Diem's draconian Law 10/59." },
        { term: "Ho Chi Minh Trail", clue: "The covert logistical supply network running through Laos and Cambodia to deliver northern weapons and troops to southern insurgents." }
      ],
      model_sentence: "Widespread peasant outrage against <strong>Diem's rural repression</strong> sparked the formation of the <strong>National Liberation Front (Vietcong)</strong>, which received arms via the <strong>Ho Chi Minh Trail</strong>."
    },
    4: {
      words: [
        { term: "Strategic Hamlet Program", clue: "The counter-insurgency plan to forcibly relocate peasant villagers behind fortified, barbed-wire settlements to isolate them from Vietcong influence." },
        { term: "Buddhist Crisis (1963)", clue: "Mass protests against religious persecution by the Catholic Diem regime following government shootings of Buddhist flag-wavers in Hue." },
        { term: "Thich Quang Duc self-immolation", clue: "The shocking self-sacrifice of a Buddhist monk who set himself on fire in a busy Saigon street, broadcast globally to protest Diem's tyranny." }
      ],
      model_sentence: "Peasant resentment over the failed <strong>Strategic Hamlet Program</strong> combined with the <strong>Buddhist Crisis (1963)</strong>, epitomised by the horrifying <strong>Thich Quang Duc self-immolation</strong>, shattered Diem's domestic legitimacy."
    },
    5: {
      words: [
        { term: "Saigon military coup (1963)", clue: "The November 1963 armed uprising organized by South Vietnamese generals to depose and eliminate Ngo Dinh Diem." },
        { term: "ARVN generals & CIA", clue: "Rebel South Vietnamese officers who received assurances from American embassy officials that US aid would continue after Diem was overthrown." },
        { term: "assassination of Ngo Dinh Diem", clue: "The execution of Diem and his brother Nhu inside an armored personnel carrier, leaving South Vietnam in persistent political chaos." }
      ],
      model_sentence: "With clandestine support negotiated between <strong>ARVN generals & CIA</strong> operatives, the <strong>Saigon military coup (1963)</strong> culminated in the brutal <strong>assassination of Ngo Dinh Diem</strong>."
    }
  },
  10: { // Lesson 10
    1: {
      words: [
        { term: "USS Maddox", clue: "The US naval destroyer operating electronic espionage patrols in the Gulf of Tonkin that exchanged gunfire with North Vietnamese torpedo boats on 2 August 1964." },
        { term: "Gulf of Tonkin Incident", clue: "The naval confrontation off North Vietnam that President Johnson used to justify full-scale, direct US military intervention in Indochina." },
        { term: "covert DeSoto patrols", clue: "Secret US naval surveillance operations coordinated with South Vietnamese commando raids against North Vietnamese coastal radar installations." }
      ],
      model_sentence: "While conducting <strong>covert DeSoto patrols</strong> off the North Vietnamese coast, the American destroyer <strong>USS Maddox</strong> was involved in the fateful <strong>Gulf of Tonkin Incident</strong> in August 1964."
    },
    2: {
      words: [
        { term: "disputed 4 August radar attack", clue: "A chaotic night incident involving freak weather and false radar blips that was falsely presented to Congress as an unprovoked second communist assault." },
        { term: "President Lyndon B. Johnson", clue: "US President who seized upon the contested Tonkin reports to order retaliatory air strikes and push through comprehensive war powers." },
        { term: "deceptive congressional briefing", clue: "The withholding of intelligence doubts and covert commando operations from Congress to secure rapid authorization for military force." }
      ],
      model_sentence: "Relying on a <strong>deceptive congressional briefing</strong> regarding the <strong>disputed 4 August radar attack</strong>, <strong>President Lyndon B. Johnson</strong> ordered immediate aerial bombardment of North Vietnam."
    },
    3: {
      words: [
        { term: "Gulf of Tonkin Resolution", clue: "The joint congressional measure passed on 7 August 1964 authorising the president to take all necessary measures to repel armed aggression in Southeast Asia." },
        { term: "'blank check' war powers", clue: "The sweeping, undeclared constitutional authority granted to Johnson allowing unlimited military escalation without consulting Congress." },
        { term: "unanimous House passage", clue: "The overwhelming congressional endorsement of the Tonkin Resolution, with only two dissenting votes in the entire Senate." }
      ],
      model_sentence: "Securing near-total support marked by <strong>unanimous House passage</strong>, the <strong>Gulf of Tonkin Resolution</strong> handed Lyndon Johnson virtually unlimited <strong>'blank check' war powers</strong>."
    },
    4: {
      words: [
        { term: "Operation Rolling Thunder", clue: "The three-year sustained bombing campaign launched in March 1965 targeting North Vietnamese roads, bridges, and military installations." },
        { term: "Pleiku barracks attack", clue: "The February 1965 Vietcong guerrilla assault on a US military base that killed nine Americans and triggered LBJ's sustained bombing offensive." },
        { term: "sustained aerial bombing", clue: "The dropping of 864,000 tons of bombs on North Vietnam between 1965 and 1968, far exceeding the total tonnage dropped during the Pacific War." }
      ],
      model_sentence: "Retaliating against the <strong>Pleiku barracks attack</strong>, Washington initiated <strong>Operation Rolling Thunder</strong>, unleashing three years of destructive <strong>sustained aerial bombing</strong> across North Vietnam."
    },
    5: {
      words: [
        { term: "Da Nang Marine landing", clue: "The arrival of 3,500 US Marines on Red Beach in March 1965 to secure the Da Nang airfield, marking the first combat troops in Vietnam." },
        { term: "General William Westmoreland", clue: "Commander of US Military Assistance Command Vietnam (MACV) who advocated shifting from base security to offensive search-and-destroy combat." },
        { term: "Americanization of the war", clue: "The decisive transition from advising South Vietnamese forces to having the United States military directly wage the ground and air war." }
      ],
      model_sentence: "The historic <strong>Da Nang Marine landing</strong> requested by <strong>General William Westmoreland</strong> in March 1965 marked the definitive, irreversible <strong>Americanization of the war</strong>."
    }
  },
  11: { // Lesson 11
    1: {
      words: [
        { term: "Vietcong guerrilla warfare", clue: "Hit-and-run tactics, ambushes, and concealment used by communist insurgents to neutralize conventional American firepower and technology." },
        { term: "'hanging onto American belts'", clue: "The tactical doctrine of fighting in extremely close proximity to US infantry so American commanders could not call in air strikes or artillery." },
        { term: "Cu Chi tunnel networks", clue: "Vast subterranean complexes containing hospitals, command bunkers, and weapon depots that shielded guerrillas from aerial bombardment." }
      ],
      model_sentence: "To neutralize superior US firepower, <strong>Vietcong guerrilla warfare</strong> relied on <strong>'hanging onto American belts'</strong> in close combat and retreating into massive <strong>Cu Chi tunnel networks</strong>."
    },
    2: {
      words: [
        { term: "Ho Chi Minh Trail", clue: "A 1,000-mile network of camouflaged jungle roads and paths through Laos and Cambodia carrying men and Soviet supplies south." },
        { term: "punji stick booby traps", clue: "Sharpened bamboo stakes smeared with feces hidden in pits, designed to maim American soldiers and inflict severe psychological terror." },
        { term: "asymmetric jungle attrition", clue: "A military strategy aimed at exhausting the enemy's will to fight by inflicting steady casualties without offering a decisive pitched battle." }
      ],
      model_sentence: "Supplied relentlessly via the <strong>Ho Chi Minh Trail</strong>, guerrilla fighters deployed lethal <strong>punji stick booby traps</strong> to wear down American patrols through <strong>asymmetric jungle attrition</strong>."
    },
    3: {
      words: [
        { term: "Search and Destroy missions", clue: "Aggressive helicopter-borne operations inserted into jungle terrain to locate, engage, and annihilate Vietcong combat units." },
        { term: "'body count' metric", clue: "The flawed statistical measure of progress implemented by General Westmoreland that prioritized the number of enemy dead over territory held." },
        { term: "Zippo raids", clue: "Infantry operations where American soldiers set fire to thatched peasant huts with cigarette lighters after searching villages for weapons." }
      ],
      model_sentence: "During controversial <strong>Search and Destroy missions</strong> measured primarily by the misleading <strong>'body count' metric</strong>, frustrated patrols often conducted destructive <strong>Zippo raids</strong> on rural villages."
    },
    4: {
      words: [
        { term: "Agent Orange defoliation", clue: "A toxic chemical herbicide sprayed by US planes to strip dense jungle canopies and destroy food crops, leaving lasting ecological and birth defect legacies." },
        { term: "Napalm incendiary strikes", clue: "Jellied petroleum bombs dropped on suspected enemy positions that stuck to skin and burned at 1,000 degrees Celsius, causing horrific civilian casualties." },
        { term: "peasant alienation", clue: "The deep resentment generated among rural South Vietnamese whose homes, farmlands, and children were incinerated by US chemical and aerial attacks." }
      ],
      model_sentence: "The widespread use of <strong>Agent Orange defoliation</strong> and devastating <strong>Napalm incendiary strikes</strong> caused catastrophic civilian suffering and severe <strong>peasant alienation</strong> across the countryside."
    },
    5: {
      words: [
        { term: "failure to win 'hearts and minds'", clue: "The complete collapse of American civic pacification programs caused by widespread civilian destruction and rural dislocation." },
        { term: "Operation Rolling Thunder limits", clue: "The strategic inability of heavy bombing to stop an agrarian society from transporting supplies on bicycles and foot along dirt trails." },
        { term: "technological hubris", clue: "The mistaken military belief that superior industrial technology and sheer tonnage of firepower could defeat an existential nationalist insurgency." }
      ],
      model_sentence: "The obvious <strong>failure to win 'hearts and minds'</strong> exposed the <strong>technological hubris</strong> of relying on brute firepower, demonstrating the severe <strong>Operation Rolling Thunder limits</strong>."
    }
  },
  12: { // Lesson 12
    1: {
      words: [
        { term: "Tet Offensive", clue: "The massive surprise offensive launched on 31 January 1968 by 84,000 communist troops attacking over 100 cities, towns, and military bases across South Vietnam." },
        { term: "assault on 100 cities", clue: "The coordinated nationwide strikes that shattered US official claims that the Vietcong was weakened and incapable of major offensive action." },
        { term: "US Embassy Saigon siege", clue: "The dramatic commando infiltration into the American embassy compound in Saigon, broadcast live on American evening news broadcasts." }
      ],
      model_sentence: "During the 1968 <strong>Tet Offensive</strong>, the sudden <strong>assault on 100 cities</strong> included a televised <strong>US Embassy Saigon siege</strong> that shattered official American assurances of impending victory."
    },
    2: {
      words: [
        { term: "Walter Cronkite broadcast", clue: "The influential CBS Evening News editorial where America's most trusted journalist declared that the Vietnam conflict was mired in an unwinnable stalemate." },
        { term: "domestic Credibility Gap", clue: "The chasm between optimistic official Pentagon claims of military progress and the grim, bloody reality broadcast daily into American living rooms." },
        { term: "unwinnable stalemate verdict", clue: "The growing consensus among political elites and the public following Tet that military victory in Vietnam was impossible." }
      ],
      model_sentence: "The celebrated <strong>Walter Cronkite broadcast</strong> delivered an <strong>unwinnable stalemate verdict</strong>, irrevocably widening the <strong>domestic Credibility Gap</strong> that undermined public trust in Washington."
    },
    3: {
      words: [
        { term: "LBJ non-candidacy speech", clue: "President Johnson's dramatic 31 March 1968 address announcing a bombing halt and declaring he would not seek re-election to the presidency." },
        { term: "Nixon Doctrine", clue: "President Richard Nixon's foreign policy principle stating that Asian nations must supply their own ground troops for defense rather than relying on US soldiers." },
        { term: "phased troop withdrawals", clue: "The gradual return of American combat divisions from Vietnam between 1969 and 1972 to de-escalate domestic anti-war protests." }
      ],
      model_sentence: "Prompted by Johnson's historic <strong>LBJ non-candidacy speech</strong>, incoming President Nixon enacted the <strong>Nixon Doctrine</strong> through <strong>phased troop withdrawals</strong> to calm domestic fury."
    },
    4: {
      words: [
        { term: "Vietnamization policy", clue: "Nixon's strategy to train and heavily equip the South Vietnamese military (ARVN) to assume all combat duties while American ground forces departed." },
        { term: "Operation Menu secret bombings", clue: "The covert B-52 carpet-bombing of neutral Cambodia between 1969 and 1970, concealed from Congress and the American public." },
        { term: "'Madman Theory'", clue: "Nixon's psychological diplomatic tactic intended to convince North Vietnamese leaders that he was unpredictable and capable of using nuclear weapons." }
      ],
      model_sentence: "While publicly promoting his <strong>Vietnamization policy</strong>, Nixon secretly authorized <strong>Operation Menu secret bombings</strong> of Cambodia in a reckless gamble based on his <strong>'Madman Theory'</strong>."
    },
    5: {
      words: [
        { term: "US conscript morale collapse", clue: "The acute breakdown in discipline, drug abuse, and insubordination that afflicted the American military as troops realized they were fighting in a lost war." },
        { term: "fragging incidents", clue: "The murder or attempted assassination of overzealous officers and sergeants by their own enlisted soldiers using fragmentation grenades." },
        { term: "combat refusals", clue: "Entire US infantry platoons refusing direct orders from commanders to patrol into dangerous Vietcong territory as withdrawal accelerated." }
      ],
      model_sentence: "As troop withdrawals dragged on, an alarming <strong>US conscript morale collapse</strong> sparked widespread <strong>combat refusals</strong> and hundreds of lethal <strong>fragging incidents</strong>."
    }
  }
};

module.exports = curationL9L12;

