const fs = require('fs');
const path = require('path');

const curationL13L16 = {
  13: { // Lesson 13
    1: {
      words: [
        { term: "Living Room War", clue: "The unprecedented reality of Vietnam being the first conflict broadcast daily in graphic colour directly into American living rooms." },
        { term: "uncensored combat television", clue: "Nightly network news footage showing firefights, burning villages, wounded soldiers, and body bags without government censorship." },
        { term: "domestic Credibility Gap", clue: "The stark contrast between grim television footage of carnage and the optimistic official statements issued by the Pentagon." }
      ],
      model_sentence: "As the <strong>Living Room War</strong> brought <strong>uncensored combat television</strong> into millions of homes, it created an insurmountable <strong>domestic Credibility Gap</strong>."
    },
    2: {
      words: [
        { term: "Selective Service draft system", clue: "The federal conscription apparatus that called up young men aged 18 to 26 for mandatory military service in Vietnam." },
        { term: "college student deferments", clue: "Class-biased exemptions allowing middle-class youths attending university to avoid military service, forcing working-class and Black men into combat." },
        { term: "draft card burning protests", clue: "Public acts of civil disobedience where thousands of young men destroyed their conscription notices to resist an immoral war." }
      ],
      model_sentence: "Because <strong>college student deferments</strong> disproportionately protected affluent youth from the <strong>Selective Service draft system</strong>, widespread <strong>draft card burning protests</strong> erupted on campuses."
    },
    3: {
      words: [
        { term: "My Lai massacre (Son My)", clue: "The horrific slaughter of up to 504 unarmed Vietnamese villagers—mostly women, children, and elderly men—by US troops in March 1968." },
        { term: "Lieutenant William Calley", clue: "Platoon leader in Charlie Company convicted of premeditated murder for ordering his soldiers to execute civilians in drainage ditches." },
        { term: "Seymour Hersh investigative reporting", clue: "The explosive independent journalism in late 1969 that uncovered the military cover-up of the My Lai atrocity and published eyewitness accounts." }
      ],
      model_sentence: "The gruesome reality of the <strong>My Lai massacre (Son My)</strong> perpetrated under <strong>Lieutenant William Calley</strong> was exposed to the world through <strong>Seymour Hersh investigative reporting</strong>."
    },
    4: {
      words: [
        { term: "Cambodian incursion protests", clue: "Nationwide student demonstrations triggered by President Nixon's sudden announcement in April 1970 that US forces were invading neutral Cambodia." },
        { term: "Ohio National Guard shooting", clue: "The lethal confrontation on 4 May 1970 when 28 guardsmen fired 67 live rifle rounds into an unarmed crowd of campus demonstrators." },
        { term: "Kent State killings", clue: "The deaths of four university students—Allison Krause, Jeffrey Miller, Sandra Scheuer, and William Schroeder—which paralyzed higher education nationwide." }
      ],
      model_sentence: "Outrage over Nixon's <strong>Cambodian incursion protests</strong> culminated in the tragic <strong>Ohio National Guard shooting</strong> that caused the iconic <strong>Kent State killings</strong>."
    },
    5: {
      words: [
        { term: "Pentagon Papers leak", clue: "The unauthorized release of a classified 7,000-page Department of Defense study detailing systematic executive deception about the war." },
        { term: "Daniel Ellsberg", clue: "Former military analyst who copied the top-secret documents and leaked them to major newspapers to inform the American public." },
        { term: "New York Times Co. v. United States", clue: "The landmark Supreme Court ruling upholding First Amendment freedom of the press and rejecting Nixon's prior restraint injunction." }
      ],
      model_sentence: "When former analyst <strong>Daniel Ellsberg</strong> orchestrated the <strong>Pentagon Papers leak</strong>, the Supreme Court affirmed freedom of the press in <strong>New York Times Co. v. United States</strong>."
    }
  },
  14: { // Lesson 14
    1: {
      words: [
        { term: "Cold War anti-communist consensus", clue: "The widespread patriotic conviction among older generations that stopping the spread of global communism in Asia was vital to national security." },
        { term: "'Middle America' patriotism", clue: "The core values of traditional working- and middle-class citizens who viewed flag-burning anti-war protesters as unpatriotic and lawless." },
        { term: "veterans' organizations", clue: "Influential patriotic civic groups such as the American Legion and VFW that actively backed the US armed forces and opposed unconditional withdrawal." }
      ],
      model_sentence: "Rooted in the <strong>Cold War anti-communist consensus</strong>, mainstream <strong>'Middle America' patriotism</strong> was vigorously championed by conservative <strong>veterans' organizations</strong>."
    },
    2: {
      words: [
        { term: "'Silent Majority' address (Nov 1969)", clue: "President Nixon's televised speech appealing to the millions of quiet, law-abiding citizens who supported his policy of 'peace with honor'." },
        { term: "President Richard Nixon", clue: "US President who skillfully mobilized working-class patriotic resentment against counter-cultural radicals to build a new conservative coalition." },
        { term: "'peace with honor'", clue: "Nixon's stated policy goal of ending American involvement in Vietnam without abandoning South Vietnam to communist subjugation." }
      ],
      model_sentence: "In his historic <strong>'Silent Majority' address (Nov 1969)</strong>, <strong>President Richard Nixon</strong> rallied working-class Americans to support his pursuit of <strong>'peace with honor'</strong>."
    },
    3: {
      words: [
        { term: "Hard Hat Riots (Wall Street)", clue: "The violent clash on 8 May 1970 in Lower Manhattan where 200 pro-war construction workers assaulted student anti-war protesters." },
        { term: "pro-war construction workers", clue: "Unionized building laborers wearing yellow hard hats and carrying American flags who attacked students mourning the Kent State victims." },
        { term: "anti-war student demonstrators", clue: "College youths holding peaceful vigils who were beaten with lead pipes and tools while city police officers offered minimal intervention." }
      ],
      model_sentence: "During the 1970 <strong>Hard Hat Riots (Wall Street)</strong>, hundreds of <strong>pro-war construction workers</strong> violently attacked <strong>anti-war student demonstrators</strong> with metal tools."
    },
    4: {
      words: [
        { term: "congressional hawks", clue: "Elected lawmakers who argued that rapid American withdrawal would humiliate the superpower, shatter NATO credibility, and invite Soviet expansion." },
        { term: "fear of national humiliation", clue: "The deep geopolitical anxiety that the United States would suffer its first-ever military defeat if it failed to sustain South Vietnam." },
        { term: "patriotic working-class backlash", clue: "Resentment among blue-collar families whose drafted sons fought in Vietnam against draft-exempt, privileged university protesters." }
      ],
      model_sentence: "Supported by a fierce <strong>patriotic working-class backlash</strong>, influential <strong>congressional hawks</strong> warned that premature retreat would invite global <strong>fear of national humiliation</strong>."
    },
    5: {
      words: [
        { term: "1972 presidential landslide", clue: "Nixon's overwhelming victory over anti-war Democrat George McGovern, winning 49 of 50 states and over 60% of the popular vote." },
        { term: "George McGovern defeat", clue: "The crushing electoral loss of the Democratic peace candidate, whose progressive platform was branded by Republicans as radical and defeatist." },
        { term: "deep domestic political polarization", clue: "The lasting ideological and cultural divide between conservative Middle America and liberal anti-war coalitions created by the Vietnam conflict." }
      ],
      model_sentence: "Nixon's crushing <strong>1972 presidential landslide</strong> and the devastating <strong>George McGovern defeat</strong> cemented a lasting legacy of <strong>deep domestic political polarization</strong>."
    }
  },
  15: { // Lesson 15
    1: {
      words: [
        { term: "secret Paris peace negotiations", clue: "Clandestine meetings conducted in private Parisian apartments between Henry Kissinger and Le Duc Tho starting in August 1969." },
        { term: "Henry Kissinger & Le Duc Tho", clue: "The principal American diplomat and North Vietnamese Politburo member who spent three years negotiating the terms of US withdrawal." },
        { term: "NVA troop retention concession", clue: "The crucial American concession in October 1972 allowing 150,000 North Vietnamese combat troops to remain inside South Vietnam after US departure." }
      ],
      model_sentence: "During prolonged <strong>secret Paris peace negotiations</strong> between <strong>Henry Kissinger & Le Duc Tho</strong>, Washington made the fateful <strong>NVA troop retention concession</strong>."
    },
    2: {
      words: [
        { term: "Operation Linebacker II (Christmas Bombings)", clue: "The massive eleven-day aerial bombardment of Hanoi and Haiphong in December 1972, dropping over 20,000 tons of bombs to force North Vietnam back to talks." },
        { term: "B-52 Stratofortress raids", clue: "Heavy strategic bomber missions flown over heavily defended northern industrial zones, suffering fifteen B-52 losses from Soviet surface-to-air missiles." },
        { term: "President Nguyen Van Thieu", clue: "The South Vietnamese president who furiously resisted the peace accord as an American betrayal until forced into compliance by Nixon's threats." }
      ],
      model_sentence: "To force Hanoi back to negotiations and reassure <strong>President Nguyen Van Thieu</strong>, Nixon unleashed destructive <strong>B-52 Stratofortress raids</strong> during <strong>Operation Linebacker II (Christmas Bombings)</strong>."
    },
    3: {
      words: [
        { term: "Paris Peace Accords (Jan 1973)", clue: "The treaty signed on 27 January 1973 officially ending direct US military involvement in the Vietnam War." },
        { term: "complete US military withdrawal", clue: "The mandatory departure of all remaining American combat troops and military advisors within sixty days of signing the agreement." },
        { term: "POW release agreement", clue: "The repatriation of 591 American prisoners of war held by North Vietnam, celebrated in the televised 'Operation Homecoming'." }
      ],
      model_sentence: "The signing of the <strong>Paris Peace Accords (Jan 1973)</strong> mandated the <strong>complete US military withdrawal</strong> alongside a long-awaited <strong>POW release agreement</strong>."
    },
    4: {
      words: [
        { term: "final US combat troop withdrawal", clue: "The historic departure of the last American infantry units and the lowering of the MACV flag in Saigon on 29 March 1973." },
        { term: "'decent interval' strategy", clue: "The cynical diplomatic calculation that South Vietnam only needed to survive long enough after US departure so Washington would not be blamed for its collapse." },
        { term: "South Vietnamese isolation", clue: "The precarious condition of the Thieu regime, left militarily crippled by fuel shortages, inflation, and dwindling congressional funding." }
      ],
      model_sentence: "Following the <strong>final US combat troop withdrawal</strong> in March 1973, Washington's <strong>'decent interval' strategy</strong> left Saigon in severe <strong>South Vietnamese isolation</strong>."
    },
    5: {
      words: [
        { term: "War Powers Act (1973)", clue: "Federal legislation requiring the president to inform Congress within 48 hours of deploying troops and withdraw them within 60 days unless authorized by law." },
        { term: "congressional veto override", clue: "Congress asserting its constitutional authority by voting to overturn President Nixon's executive veto of the War Powers Resolution in November 1973." },
        { term: "presidential war power restriction", clue: "The permanent statutory curbing of the imperial presidency and the undeclared war-making authority previously claimed during the Vietnam conflict." }
      ],
      model_sentence: "Passing through a decisive <strong>congressional veto override</strong>, the landmark <strong>War Powers Act (1973)</strong> established lasting <strong>presidential war power restriction</strong>."
    }
  },
  16: { // Lesson 16
    1: {
      words: [
        { term: "1975 Spring Offensive", clue: "The massive conventional blitzkrieg launched by twenty North Vietnamese army divisions under General Van Tien Dung in early 1975." },
        { term: "General Van Tien Dung", clue: "North Vietnamese military commander who orchestrated the lightning motorized campaign that rapidly overran the Central Highlands." },
        { term: "'Convoy of Tears'", clue: "The chaotic, panicked retreat of 200,000 South Vietnamese soldiers and civilians along Route 7B, resulting in tens of thousands of deaths from artillery." }
      ],
      model_sentence: "When <strong>General Van Tien Dung</strong> launched the devastating <strong>1975 Spring Offensive</strong>, routed South Vietnamese forces disintegrated in the horrific <strong>'Convoy of Tears'</strong>."
    },
    2: {
      words: [
        { term: "Fall of Saigon (30 April 1975)", clue: "The capture of the South Vietnamese capital by communist tanks crashing through the gates of the presidential palace, concluding thirty years of war." },
        { term: "Operation Frequent Wind helicopter airlift", clue: "The chaotic emergency evacuation of 7,000 Americans and South Vietnamese allies from the US Embassy rooftop in Saigon." },
        { term: "Independence Palace tank capture", clue: "North Vietnamese Army Tank 390 crashing through the ornamental wrought-iron gates of South Vietnam's seat of government to raise the Vietcong flag." }
      ],
      model_sentence: "The tragic <strong>Fall of Saigon (30 April 1975)</strong> was immortalized by the <strong>Operation Frequent Wind helicopter airlift</strong> and the symbolic <strong>Independence Palace tank capture</strong>."
    },
    3: {
      words: [
        { term: "Vietnamese revolutionary nationalism", clue: "The profound ideological dedication of North Vietnamese and Vietcong fighters fighting an existential anti-colonial struggle for national liberation." },
        { term: "technological military inadequacy", clue: "The fundamental failure of advanced US air power, sensors, and mechanization to defeat a determined, decentralized guerrilla insurgency." },
        { term: "Ho Chi Minh anti-colonial vision", clue: "The enduring moral appeal of Ho Chi Minh that inspired millions of ordinary Vietnamese to endure catastrophic casualties and outlast foreign invaders." }
      ],
      model_sentence: "Ultimately, superior American firepower suffered from <strong>technological military inadequacy</strong> when confronted by the unyielding power of <strong>Vietnamese revolutionary nationalism</strong> and the <strong>Ho Chi Minh anti-colonial vision</strong>."
    },
    4: {
      words: [
        { term: "Saigon regime illegitimacy", clue: "The fatal vulnerability of South Vietnam's government, perceived by rural peasants as a corrupt, foreign-dependent Catholic elite." },
        { term: "widespread ARVN corruption", clue: "Ghost soldiers on payrolls, embezzlement of military supplies, and demoralized conscripts that crippled South Vietnam's defensive fighting ability." },
        { term: "rural peasant alienation", clue: "The alienation of South Vietnam's rural majority through forced relocations, airstrikes, and economic exploitation, driving support to the insurgents." }
      ],
      model_sentence: "Chronic <strong>widespread ARVN corruption</strong> and persistent <strong>rural peasant alienation</strong> fatally compromised the domestic authority of the <strong>Saigon regime illegitimacy</strong>."
    },
    5: {
      words: [
        { term: "'Vietnam Syndrome'", clue: "The enduring public and political reluctance of the United States to commit American ground forces to protracted foreign conflicts abroad." },
        { term: "collapse of domestic consensus", clue: "The destruction of the post-WWII domestic trust in government, military leadership, and foreign intervention following the Vietnam disaster." },
        { term: "58,220 American military deaths", clue: "The tragic human toll etched into the Vietnam Veterans Memorial in Washington D.C., representing a generation of lost American youth." }
      ],
      model_sentence: "Resulting in <strong>58,220 American military deaths</strong> and the total <strong>collapse of domestic consensus</strong>, the tragic defeat produced a lasting foreign policy <strong>'Vietnam Syndrome'</strong>."
    }
  }
};

module.exports = curationL13L16;
