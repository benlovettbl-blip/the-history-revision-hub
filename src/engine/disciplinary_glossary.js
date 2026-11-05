/**
 * Disciplinary & Conceptual Glossary Engine
 *
 * Provides a rich, academic Tier 2 & Tier 3 vocabulary framework across KS2, KS3, and GCSE.
 * Merges lesson-specific vocabulary, unit-wide course vocabularies, and universal
 * disciplinary concepts (political, economic, ideological, and historical turning points).
 *
 * Supports intelligent morphological matching (plurals, derivatives, compound terms)
 * and rich ambient vocabulary lens annotations with phonetic guides and audio.
 */

export const MASTER_DISCIPLINARY_GLOSSARY = [
  // --- Cold War & Ideological Conflict ---
  {
    term: 'Capitalism',
    definition:
      'An economic and political system founded on private ownership of property, enterprise, and production for profit, governed by free-market commerce and minimal state intervention.',
    syllables: 'cap-i-tal-ism',
    phonetic: 'ˈkæpɪtəlɪzəm',
    tier: '3',
    variants: [
      'capitalist',
      'capitalists',
      'free-market capitalism',
      'free market capitalism',
      'free-market',
    ],
  },
  {
    term: 'Socialism',
    definition:
      'A political and economic philosophy advocating collective or state ownership of industry, land, and resources to eliminate capitalist exploitation and guarantee social equality.',
    syllables: 'so-cial-ism',
    phonetic: 'ˈsəʊʃəlɪzəm',
    tier: '3',
    variants: [
      'socialist',
      'socialists',
      'Marxist-Leninist socialism',
      'command socialism',
      'state socialism',
    ],
  },
  {
    term: 'Communism',
    definition:
      'A revolutionary political doctrine derived from Karl Marx, seeking a stateless, classless society where private property is abolished and all production is controlled for the collective good.',
    syllables: 'com-mu-nism',
    phonetic: 'ˈkɒmjʊnɪzəm',
    tier: '3',
    variants: [
      'communist',
      'communists',
      'Marxist-Leninist',
      'Marxist',
      'Leninist',
      'Bolshevik',
      'Bolshevism',
    ],
  },
  {
    term: 'Ideology',
    definition:
      'A comprehensive, organized system of political beliefs, core values, and economic principles that guides the governance, policies, and foreign relations of a state.',
    syllables: 'i-de-ol-o-gy',
    phonetic: 'ˌaɪdiˈɒlədʒi',
    tier: '2',
    variants: ['ideologies', 'ideological', 'ideologically'],
  },
  {
    term: 'Superpower',
    definition:
      'An exceptionally dominant global power possessing decisive geopolitical influence, vast economic wealth, continental military strength, and strategic nuclear capability.',
    syllables: 'su-per-pow-er',
    phonetic: 'ˈsuːpəpaʊə',
    tier: '2',
    variants: ['superpowers'],
  },
  {
    term: 'Containment',
    definition:
      'The foundational United States foreign policy strategy during the Cold War, devised by George F. Kennan to halt the geopolitical expansion and spread of Soviet communism.',
    syllables: 'con-tain-ment',
    phonetic: 'kənˈteɪnmənt',
    tier: '3',
    variants: ['contain', 'containment policy'],
  },
  {
    term: 'Coexistence',
    definition:
      'A diplomatic state wherein competing geopolitical superpowers and hostile ideologies peacefully inhabit the international arena without resorting to open warfare.',
    syllables: 'co-ex-ist-ence',
    phonetic: 'ˌkəʊɪɡˈzɪstəns',
    tier: '2',
    variants: ['peaceful coexistence'],
  },
  {
    term: 'Détente',
    definition:
      'A period of deliberate diplomatic thawing, mutual accommodation, and relaxed tensions between the United States and the Soviet Union during the 1970s.',
    syllables: 'dé-tente',
    phonetic: 'deɪˈtɑːnt',
    tier: '3',
    variants: ['detente'],
  },
  {
    term: 'Brinkmanship',
    definition:
      'The high-stakes diplomatic and military practice of escalating international crises to the absolute threshold of all-out nuclear war to force an adversary to back down.',
    syllables: 'brink-man-ship',
    phonetic: 'ˈbrɪŋkmənʃɪp',
    tier: '3',
    variants: ['brink of war'],
  },
  {
    term: 'Deterrence',
    definition:
      'The military doctrine of possessing overwhelming retaliatory firepower (especially nuclear arms) so devastating that any rational enemy is dissuaded from launching a first strike.',
    syllables: 'de-ter-rence',
    phonetic: 'dɪˈterəns',
    tier: '3',
    variants: ['nuclear deterrence', 'deterrent'],
  },
  {
    term: 'Proxy War',
    definition:
      'An armed conflict where rival superpowers instigate, finance, and arm third-party combatants to fight each other directly, avoiding direct open combat between the superpowers.',
    syllables: 'prox-y war',
    phonetic: 'ˈprɒksi wɔː',
    tier: '3',
    variants: ['proxy wars', 'proxy conflict'],
  },
  {
    term: 'Domino Theory',
    definition:
      'The strategic US Cold War conviction that the fall of a single vulnerable nation to communist rule would inevitably trigger the collapse of its neighbouring regional states.',
    syllables: 'dom-i-no the-o-ry',
    phonetic: 'ˈdɒmɪnəʊ ˈθɪəri',
    tier: '3',
    variants: ['domino effect'],
  },
  {
    term: 'Iron Curtain',
    definition:
      'Winston Churchill’s famous metaphor depicting the rigid ideological, military, and political barrier erected by the USSR to seal off Eastern European satellite states from the West.',
    syllables: 'i-ron cur-tain',
    phonetic: 'ˈaɪən ˈkɜːtn',
    tier: '3',
    variants: ['iron curtain border'],
  },
  {
    term: 'Marshall Plan',
    definition:
      'The massive $13 billion American financial aid package launched in 1948 to rebuild war-torn European capitalist economies and inoculate them against communist expansion.',
    syllables: 'Mar-shall Plan',
    phonetic: 'ˈmɑːʃəl plæn',
    tier: '3',
    variants: ['European Recovery Program'],
  },
  {
    term: 'Truman Doctrine',
    definition:
      'President Harry S. Truman’s 1947 commitment pledging US economic, financial, and military assistance to any democratic nation threatened by armed communist insurrections.',
    syllables: 'Tru-man Doc-trine',
    phonetic: 'ˈtruːmən ˈdɒktrɪn',
    tier: '3',
    variants: ['Truman doctrine speech'],
  },
  {
    term: 'NATO',
    definition:
      'The North Atlantic Treaty Organisation, established in 1949 as an intergovernmental mutual-defence military alliance of Western democratic powers against Soviet aggression.',
    syllables: 'NA-TO',
    phonetic: 'ˈneɪtəʊ',
    tier: '3',
    variants: ['North Atlantic Treaty', 'North Atlantic Treaty Organisation'],
  },
  {
    term: 'Warsaw Pact',
    definition:
      'The collective mutual-defence military alliance created in 1955 by the Soviet Union and its Eastern European satellite states to counterbalance NATO.',
    syllables: 'War-saw Pact',
    phonetic: 'ˈwɔːsɔː pækt',
    tier: '3',
    variants: ['Warsaw Treaty'],
  },
  {
    term: 'Glasnost',
    definition:
      'Mikhail Gorbachev’s policy of political openness and transparency initiated in 1985, allowing public critique of the Soviet state and lifting state censorship.',
    syllables: 'glas-nost',
    phonetic: 'ˈɡlæznɒst',
    tier: '3',
    variants: ['openness'],
  },
  {
    term: 'Perestroika',
    definition:
      'Gorbachev’s structural reform campaign launched in the late 1980s to decentralize and modernize the stagnant Soviet command economy by introducing market incentives.',
    syllables: 'per-e-stroi-ka',
    phonetic: 'ˌperəˈstrɔɪkə',
    tier: '3',
    variants: ['economic restructuring'],
  },
  {
    term: 'Satellite State',
    definition:
      'A formally sovereign and independent country that is under the heavy political, ideological, economic, and military hegemony and control of an external superpower.',
    syllables: 'sat-el-lite state',
    phonetic: 'ˈsætəlaɪt steɪt',
    tier: '3',
    variants: ['satellite states', 'Soviet satellite'],
  },
  {
    term: 'Buffer Zone',
    definition:
      'A neutral or allied territorial belt situated between two adversarial powers, maintained to absorb prospective invasions and protect national heartlands.',
    syllables: 'buf-fer zone',
    phonetic: 'ˈbʌfə zəʊn',
    tier: '3',
    variants: ['buffer zones', 'buffer territory'],
  },
  {
    term: 'Spheres of Influence',
    definition:
      'Geopolitical territorial regions wherein a predominant foreign empire or superpower asserts exclusive political, diplomatic, and economic supremacy.',
    syllables: 'spheres of in-flu-ence',
    phonetic: 'sfɪəz ɒv ˈɪnflʊəns',
    tier: '3',
    variants: ['sphere of influence'],
  },
  {
    term: 'Grand Alliance',
    definition:
      'The wartime coalition of convenience forged between Britain, the United States, and the Soviet Union (the "Big Three") to achieve the military defeat of Nazi Germany.',
    syllables: 'Grand Al-li-ance',
    phonetic: 'ɡrænd əˈlaɪəns',
    tier: '3',
    variants: ['Big Three alliance'],
  },
  {
    term: 'Mutually Assured Destruction',
    definition:
      'The strategic nuclear reality that an atomic strike by either superpower would inevitably result in catastrophic retaliatory annihilation for both belligerents.',
    syllables: 'Mu-tu-al-ly As-sured De-struc-tion',
    phonetic: 'ˈmjuːtʃuəli əˈʃʊəd dɪˈstrʌkʃən',
    tier: '3',
    variants: ['MAD doctrine'],
  },

  // --- Political & Constitutional Governance ---
  {
    term: 'Democracy',
    definition:
      'A system of governance where sovereign political legitimacy derives from the governed, exercised through universal suffrage, competitive multi-party elections, and the rule of law.',
    syllables: 'de-moc-ra-cy',
    phonetic: 'dɪˈmɒkrəsi',
    tier: '2',
    variants: ['democracies', 'democratic', 'multi-party democracy'],
  },
  {
    term: 'Dictatorship',
    definition:
      'An authoritarian regime where supreme legislative and executive authority is monopolized by an individual autocrat or single party, devoid of legal constitutional checks.',
    syllables: 'dic-ta-tor-ship',
    phonetic: 'dɪkˈteɪtəʃɪp',
    tier: '2',
    variants: ['dictators', 'dictator', 'dictatorial'],
  },
  {
    term: 'Totalitarianism',
    definition:
      'An all-encompassing system of tyrannical governance that tolerates zero opposition, exercises absolute surveillance over society, and subordinates all private life to state dogma.',
    syllables: 'to-tal-i-tar-i-an-ism',
    phonetic: 'təʊˌtælɪˈteəriənɪzəm',
    tier: '3',
    variants: ['totalitarian', 'totalitarian state'],
  },
  {
    term: 'Fascism',
    definition:
      'A radical, ultranationalist, authoritarian political movement characterized by dictatorial power, military regimentation, forcible suppression of dissent, and intense national supremacy.',
    syllables: 'fas-cism',
    phonetic: 'ˈfæʃɪzəm',
    tier: '3',
    variants: ['fascist', 'fascists'],
  },
  {
    term: 'Monarchy',
    definition:
      'A constitutional or traditional system of governance headed by a hereditary king, queen, or sovereign emperor possessing formal dynastic royal authority.',
    syllables: 'mon-ar-chy',
    phonetic: 'ˈmɒnəki',
    tier: '2',
    variants: ['monarch', 'monarchs', 'monarchies', 'monarchical'],
  },
  {
    term: 'Constitutional Monarchy',
    definition:
      'A system of government where a hereditary sovereign reigns as head of state, but their executive powers are strictly bounded by constitutional law, statutes, and an elected parliament.',
    syllables: 'con-sti-tu-tion-al mon-ar-chy',
    phonetic: 'ˌkɒnstɪˈtjuːʃənl ˈmɒnəki',
    tier: '3',
    variants: ['constitutional monarch', 'limited monarchy'],
  },
  {
    term: 'Authoritarianism',
    definition:
      'A governing regime demanding strict public obedience and loyalty to state authority at the expense of individual civil liberties, political pluralism, and democratic opposition.',
    syllables: 'au-thor-i-tar-i-an-ism',
    phonetic: 'ɔːˌθɒrɪˈteəriənɪzəm',
    tier: '3',
    variants: ['authoritarian', 'authoritarian regime'],
  },
  {
    term: 'Sovereignty',
    definition:
      'The supreme, independent authority and legal right of a state to govern its own domestic and foreign affairs without external intervention or subordination.',
    syllables: 'sov-er-eign-ty',
    phonetic: 'ˈsɒvrənti',
    tier: '3',
    variants: ['sovereign', 'sovereign state'],
  },
  {
    term: 'Self-Determination',
    definition:
      'The fundamental international legal principle that nations and ethnic peoples hold the inherent sovereign right to freely choose their own political status and governance.',
    syllables: 'self-de-ter-mi-na-tion',
    phonetic: 'self-dɪˌtɜːmɪˈneɪʃən',
    tier: '3',
    variants: ['national self-determination'],
  },

  // --- Warfare, Treaties & Diplomacy ---
  {
    term: 'Imperialism',
    definition:
      'The state policy, practice, or advocacy of extending sovereign power and dominion across foreign territories through direct military annexation, settlement, or economic hegemony.',
    syllables: 'im-pe-ri-al-ism',
    phonetic: 'ɪmˈpɪəriəlɪzəm',
    tier: '3',
    variants: ['imperialist', 'imperialists', 'empires', 'imperial'],
  },
  {
    term: 'Colonialism',
    definition:
      'The policy or practice of acquiring full or partial political control over another country, occupying it with settlers, and economically exploiting its native population and resources.',
    syllables: 'co-lo-ni-al-ism',
    phonetic: 'kəˈləʊniəlɪzəm',
    tier: '3',
    variants: ['colonial', 'colonies', 'colony', 'colonists', 'colonisation', 'colonization'],
  },
  {
    term: 'Allies',
    definition:
      'Sovereign nations formally united in a mutual military treaty, defensive alliance, or military coalition to pursue shared defensive and strategic warfare objectives.',
    syllables: 'al-lies',
    phonetic: 'ˈælaɪz',
    tier: '2',
    variants: ['alliance', 'alliances', 'allied'],
  },
  {
    term: 'Treaty',
    definition:
      'A binding, formally negotiated, and legally ratified international agreement entered into by sovereign nation-states under international law.',
    syllables: 'trea-ty',
    phonetic: 'ˈtriːti',
    tier: '2',
    variants: ['treaties'],
  },
  {
    term: 'Armistice',
    definition:
      'A formal agreement between belligerent warring states to temporarily or permanently suspend active military fighting and combat, often preceding formal peace negotiations.',
    syllables: 'ar-mi-stice',
    phonetic: 'ˈɑːmɪstɪs',
    tier: '2',
    variants: ['armistices', 'ceasefire'],
  },
  {
    term: 'Reparations',
    definition:
      'Mandatory financial indemnities, territorial concessions, or material goods extracted from a vanquished power to compensate victor nations for wartime destruction.',
    syllables: 'rep-a-ra-tions',
    phonetic: 'ˌrepəˈreɪʃənz',
    tier: '3',
    variants: ['reparation', 'war reparations'],
  },
  {
    term: 'Annexation',
    definition:
      'The unilateral administrative acquisition and incorporation of a foreign territory into another sovereign political entity, frequently accomplished through military force.',
    syllables: 'an-nex-a-tion',
    phonetic: 'ˌænekˈseɪʃən',
    tier: '3',
    variants: ['annex', 'annexed', 'annexing'],
  },
  {
    term: 'Appeasement',
    definition:
      'A controversial diplomatic doctrine of conceding political, strategic, or territorial demands to an aggressive revisionist power to avert open armed conflict.',
    syllables: 'ap-pease-ment',
    phonetic: 'əˈpiːzmənt',
    tier: '3',
    variants: ['appease', 'appeased'],
  },
  {
    term: 'Militarism',
    definition:
      'The ideological glorification of military power, aggressive armed readiness, and the dominant supremacy of military elites in determining national state policy.',
    syllables: 'mil-i-ta-rism',
    phonetic: 'ˈmɪlɪtərɪzəm',
    tier: '3',
    variants: ['militaristic'],
  },
  {
    term: 'Nationalism',
    definition:
      'A potent political ideology positing that an ethnic or national collective possesses the inherent right to sovereignty, self-government, and prioritized national interests.',
    syllables: 'na-tion-al-ism',
    phonetic: 'ˈnæʃnəlɪzəm',
    tier: '2',
    variants: ['nationalist', 'nationalists'],
  },
  {
    term: 'Propaganda',
    definition:
      'Information, biased narratives, or psychological appeals systematically disseminated by state authorities or political factions to influence public belief and loyalty.',
    syllables: 'prop-a-gan-da',
    phonetic: 'ˌprɒpəˈɡændə',
    tier: '2',
    variants: ['propagandist', 'state propaganda'],
  },
  {
    term: 'Censorship',
    definition:
      'The official suppression, prohibition, or alteration of published writings, broadcasts, news, or artistic speech deemed politically subversive by state authorities.',
    syllables: 'cen-sor-ship',
    phonetic: 'ˈsensəʃɪp',
    tier: '2',
    variants: ['censored', 'press censorship'],
  },
  {
    term: 'Conscription',
    definition:
      'The compulsory, legally mandated enlistment of eligible civilian citizens into the state’s armed forces during wartime national emergencies.',
    syllables: 'con-scrip-tion',
    phonetic: 'kənˈskrɪpʃən',
    tier: '3',
    variants: ['conscripted', 'military draft'],
  },
  {
    term: 'Coup d’État',
    definition:
      'The sudden, violent, or unconstitutional overthrow of an existing sovereign government by a faction within the state military or political establishment.',
    syllables: 'coup d’é-tat',
    phonetic: 'ˌkuː deɪˈtɑː',
    tier: '3',
    variants: ['coup', 'military coup'],
  },

  // --- Socio-Economic Realities & Disciplinary Concepts ---
  {
    term: 'Proletariat',
    definition:
      'The industrial wage-earning working class who subsist solely by selling their manual labour, possessing no personal ownership of capital or the means of production.',
    syllables: 'pro-le-tar-i-at',
    phonetic: 'ˌprəʊlɪˈteəriət',
    tier: '3',
    variants: ['proletarian'],
  },
  {
    term: 'Bourgeoisie',
    definition:
      'The affluent capitalist middle class who own the factories, banks, and enterprises that constitute the means of societal production and commercial wealth.',
    syllables: 'bour-geoi-sie',
    phonetic: 'ˌbʊəʒwɑːˈziː',
    tier: '3',
    variants: ['bourgeois'],
  },
  {
    term: 'Industrialisation',
    definition:
      'The historic socio-economic transition from an agrarian handicraft economy to one dominated by machine industry, steam power, factories, and mass manufacturing.',
    syllables: 'in-dus-tri-al-i-sa-tion',
    phonetic: 'ɪnˌdʌstriəlaɪˈzeɪʃən',
    tier: '3',
    variants: [
      'industrialise',
      'industrialised',
      'industrialization',
      'industrial revolution',
    ],
  },
  {
    term: 'Urbanisation',
    definition:
      'The demographic migration and expansion of human populations moving from rural agricultural hinterlands into dense urban industrial metropolises.',
    syllables: 'ur-ban-i-sa-tion',
    phonetic: 'ˌɜːbənaɪˈzeɪʃən',
    tier: '3',
    variants: ['urbanise', 'urbanised', 'urbanization'],
  },
  {
    term: 'Trade Union',
    definition:
      'An organized association of wage-earning workers formed to protect and advance their collective rights, wages, and working conditions through collective bargaining.',
    syllables: 'trade un-ion',
    phonetic: 'treɪd ˈjuːnjən',
    tier: '2',
    variants: ['trade unions', 'labour union'],
  },
  {
    term: 'Segregation',
    definition:
      'The institutionalized, enforced physical and legal separation of racial groups across public facilities, schools, transport, housing, and social institutions.',
    syllables: 'seg-re-ga-tion',
    phonetic: 'ˌseɡrɪˈɡeɪʃən',
    tier: '3',
    variants: ['segregated', 'racial segregation'],
  },
  {
    term: 'Civil Rights',
    definition:
      'The legally guaranteed constitutional rights and protections ensuring equal legal status, personal liberty, and freedom from discrimination for all citizens.',
    syllables: 'civ-il rights',
    phonetic: 'ˈsɪvəl raɪts',
    tier: '2',
    variants: ['civil liberties'],
  },
  {
    term: 'Suffrage',
    definition:
      'The constitutional right and franchise to cast a ballot in public political elections to choose representatives and governments.',
    syllables: 'suf-frage',
    phonetic: 'ˈsʌfrɪdʒ',
    tier: '2',
    variants: ['suffragettes', 'suffragists', 'universal suffrage'],
  },
  {
    term: 'Reformation',
    definition:
      'The 16th-century religious upheaval across Western Europe initiated by Martin Luther, breaking from the Roman Catholic Papacy and founding Protestantism.',
    syllables: 'ref-or-ma-tion',
    phonetic: 'ˌrefəˈmeɪʃən',
    tier: '3',
    variants: ['Protestant Reformation', 'English Reformation'],
  },
  {
    term: 'Enlightenment',
    definition:
      'The 18th-century intellectual movement emphasizing empiricism, secular reason, human individual rights, and scientific inquiry over divine authority and royal absolutism.',
    syllables: 'en-light-en-ment',
    phonetic: 'ɪnˈlaɪtnmənt',
    tier: '3',
    variants: ['Age of Enlightenment'],
  },

  // --- History of Medicine & Science ---
  {
    term: 'Anatomy',
    definition:
      'The scientific study of the bodily structure of humans and animals, pioneered through empirical human dissection by Renaissance physicians like Andreas Vesalius.',
    syllables: 'a-nat-o-my',
    phonetic: 'əˈnætəmi',
    tier: '3',
    variants: ['anatomical', 'anatomist', 'dissection', 'dissect', 'dissecting'],
  },
  {
    term: 'Physiology',
    definition:
      'The branch of biology and medicine dealing with the internal mechanical and physical functions of living organisms and their organs (e.g. William Harvey on blood circulation).',
    syllables: 'phys-i-ol-o-gy',
    phonetic: 'ˌfɪziˈɒlədʒi',
    tier: '3',
    variants: ['physiological'],
  },
  {
    term: 'Antiseptic',
    definition:
      'A chemical substance (such as carbolic acid) applied to living tissue or surgical instruments to destroy infectious pathogens and eliminate post-operative sepsis.',
    syllables: 'an-ti-sep-tic',
    phonetic: 'ˌæntiˈseptɪk',
    tier: '3',
    variants: ['antiseptics', 'antiseptic surgery', 'aseptic', 'aseptic surgery'],
  },
  {
    term: 'Anaesthetic',
    definition:
      'A chemical substance (such as ether or James Simpson’s chloroform) administered to induce reversible loss of sensation and consciousness to conquer surgical pain.',
    syllables: 'an-aes-thet-ic',
    phonetic: 'ˌænəsˈθetɪk',
    tier: '3',
    variants: ['anaesthetics', 'anesthetic', 'anesthetics', 'anesthesia'],
  },
  {
    term: 'Pathogen',
    definition:
      'A disease-causing biological microorganism, such as a bacterium or virus, identified as the true cause of contagious infections following Louis Pasteur’s Germ Theory (1861).',
    syllables: 'path-o-gen',
    phonetic: 'ˈpæθədʒən',
    tier: '3',
    variants: ['pathogens', 'microbe', 'microbes', 'germ theory'],
  },
  {
    term: 'Epidemic',
    definition:
      'The widespread, rapid occurrence of an infectious disease within a community or population at a particular time (e.g. the 1831–1866 cholera outbreaks).',
    syllables: 'ep-i-dem-ic',
    phonetic: 'ˌepɪˈdemɪk',
    tier: '2',
    variants: ['epidemics', 'pandemic'],
  },
  {
    term: 'Vaccination',
    definition:
      'The clinical administration of an antigenic material (pioneered by Edward Jenner using cowpox in 1796) to stimulate the immune system and confer immunity against a disease.',
    syllables: 'vac-ci-na-tion',
    phonetic: 'ˌvæksɪˈneɪʃən',
    tier: '3',
    variants: ['vaccine', 'vaccines', 'inoculation', 'inoculate'],
  },
];

/**
 * Builds a comprehensive, unified vocabulary dictionary for a given lesson
 * by merging:
 * 1. The Master Disciplinary Glossary (foundational historical concepts)
 * 2. The unit-wide vocabulary pool (all terms across all lessons in the unit)
 * 3. The current lesson's specific vocabulary (highest priority)
 * 4. Automatic plural, stem, and morphological derivatives
 */
export function buildComprehensiveVocabDict(lesson, unitData) {
  const vocabDict = {};

  const registerItem = (term, def, syllables = '', phonetic = '', tier = '2', variants = []) => {
    if (!term || !def) return;
    const baseTerm = term.trim();
    const termKey = baseTerm.toLowerCase();
    const meta = {
      term: baseTerm,
      definition: def,
      syllables: syllables || '',
      phonetic: phonetic || '',
      tier: String(tier || '2'),
    };

    if (!vocabDict[termKey]) {
      vocabDict[termKey] = meta;
    }

    // Auto-register regular plurals
    if (!termKey.endsWith('s') && !termKey.includes(' ')) {
      const pl = termKey + 's';
      if (!vocabDict[pl]) vocabDict[pl] = meta;
    }

    // Register explicit variants
    if (Array.isArray(variants)) {
      variants.forEach((v) => {
        const vKey = (v || '').trim().toLowerCase();
        if (vKey && !vocabDict[vKey]) {
          vocabDict[vKey] = meta;
        }
      });
    }

    // Auto-register common historical adjective/stem derivatives
    if (termKey.endsWith('ism')) {
      const stem = termKey.slice(0, -3);
      if (!vocabDict[stem + 'ist']) vocabDict[stem + 'ist'] = meta;
      if (!vocabDict[stem + 'ists']) vocabDict[stem + 'ists'] = meta;
    }
    if (termKey.endsWith('y')) {
      const stem = termKey.slice(0, -1);
      if (!vocabDict[stem + 'ies']) vocabDict[stem + 'ies'] = meta;
      if (!vocabDict[stem + 'ic']) vocabDict[stem + 'ic'] = meta;
      if (!vocabDict[stem + 'ical']) vocabDict[stem + 'ical'] = meta;
    }
    if (termKey.endsWith('tion')) {
      const stem = termKey.slice(0, -4);
      if (!vocabDict[stem + 'tive']) vocabDict[stem + 'tive'] = meta;
    }
  };

  // 1. Master Disciplinary Glossary (baseline concepts)
  MASTER_DISCIPLINARY_GLOSSARY.forEach((item) => {
    registerItem(
      item.term,
      item.definition,
      item.syllables,
      item.phonetic,
      item.tier,
      item.variants,
    );
  });

  // 2. Unit-wide vocabulary pool from all lessons in the active unit
  if (unitData && Array.isArray(unitData.lessons)) {
    unitData.lessons.forEach((l) => {
      const vArr = (l.vocab || l.vocabulary || []).concat(
        !l.vocab && !l.vocabulary && l.flashcards ? l.flashcards : [],
      );
      vArr.forEach((v) => {
        if (!v) return;
        registerItem(
          v.term,
          v.definition || v.def || v.desc,
          v.syllables,
          v.phonetic,
          v.tier,
          v.variants,
        );
      });
    });
  }

  // 3. Current lesson vocabulary (overrides / highest priority)
  const currentVocab = (lesson && (lesson.vocab || lesson.vocabulary || [])) || [];
  currentVocab.forEach((v) => {
    if (!v) return;
    registerItem(
      v.term,
      v.definition || v.def || v.desc,
      v.syllables,
      v.phonetic,
      v.tier,
      v.variants,
    );
  });

  return vocabDict;
}

/**
 * Annotates historical narrative prose with ambient vocabulary lens markup.
 * Matches terms against HTML while strictly skipping existing tags and links.
 *
 * @param {string} text - Raw narrative text
 * @param {Object} vocabDict - Comprehensive vocabulary dictionary
 * @param {number} maxPerBlock - Maximum interactive terms highlighted per paragraph block
 * @returns {string} HTML with embedded .vocab-lens-term spans
 */
export function highlightGlossaryInProse(text, vocabDict, maxPerBlock = 3) {
  if (!text || typeof text !== 'string') return text || '';
  if (!vocabDict || Object.keys(vocabDict).length === 0) return text;

  let processedText = text;
  let blockCount = 0;
  const sortedTerms = Object.keys(vocabDict).sort((a, b) => b.length - a.length);
  const matchedRootsInBlock = new Set();

  for (const term of sortedTerms) {
    if (blockCount >= maxPerBlock) break;
    const vocabItem = vocabDict[term];
    if (!vocabItem || !vocabItem.definition) continue;

    const rootKey = vocabItem.term.toLowerCase();
    if (matchedRootsInBlock.has(rootKey)) continue;

    // Regex matches existing <a>...</a> tags OR existing <span class="...vocab-...">...</span> tags OR other HTML tags OR the exact target term
    const escapedTerm = term.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(
      `(<a\\b[^>]*>[\\s\\S]*?<\\/a>)|(<span\\b[^>]*class=["'][^"']*vocab-[^"']*["'][^>]*>[\\s\\S]*?<\\/span>)|(<[^>]+>)|\\b(${escapedTerm})\\b`,
      'gi',
    );
    let didMatch = false;

    processedText = processedText.replace(
      regex,
      (match, anchorTag, existingVocabSpan, htmlTag, word) => {
        // Preserve existing links, existing vocab spans, and HTML tags completely
        if (anchorTag) return anchorTag;
        if (existingVocabSpan) return existingVocabSpan;
        if (htmlTag) return htmlTag;

      if (word && blockCount < maxPerBlock) {
        didMatch = true;
        blockCount++;
        const safeDef = vocabItem.definition.replace(/"/g, '&quot;');
        const safeSyllables = (vocabItem.syllables || '').replace(/"/g, '&quot;');
        const safePhonetic = (vocabItem.phonetic || '').replace(/"/g, '&quot;');
        const safeTier = vocabItem.tier || '2';
        const safeTerm = vocabItem.term.replace(/"/g, '&quot;');
        return `<span class="vocab-word vocab-lens-term" data-term="${safeTerm}" data-definition="${safeDef}" data-syllables="${safeSyllables}" data-phonetic="${safePhonetic}" data-tier="${safeTier}">${word}</span>`;
      }
      return match;
    });

    if (didMatch) {
      matchedRootsInBlock.add(rootKey);
    }
  }

  return processedText;
}
