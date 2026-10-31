const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Comprehensive dictionary for historical, foreign, acronym, and proper noun terms
const VOCAB_MAP = {
  // CME & Middle East
  'sykes-picot agreement': {
    syllables: 'Sykes-Pi-cot A-gree-ment',
    phonetic: 'saɪks piːˈkəʊ əˈɡriːmənt',
    tier: '3',
  },
  mandate: { syllables: 'man-date', phonetic: 'ˈmændeɪt', tier: '3' },
  'balfour declaration': {
    syllables: 'Bal-four Dec-la-ra-tion',
    phonetic: 'ˈbælfɔː ˌdɛkləˈreɪʃən',
    tier: '3',
  },
  zionism: { syllables: 'Zi-on-ism', phonetic: 'ˈzaɪənɪzəm', tier: '3' },
  'arab nationalism': {
    syllables: 'Ar-ab Na-tion-al-ism',
    phonetic: 'ˈærəb ˈnæʃənəlɪzəm',
    tier: '3',
  },
  chokepoint: { syllables: 'choke-point', phonetic: 'ˈtʃəʊkˌpɔɪnt', tier: '2' },
  irgun: { syllables: 'Ir-gun', phonetic: 'ˈɪərɡuːn', tier: '3' },
  nakba: { syllables: 'Nak-ba', phonetic: 'ˈnækbə', tier: '3' },
  'dual obligation': {
    syllables: 'du-al ob-li-ga-tion',
    phonetic: 'ˈdjuːəl ˌɒblɪˈɡeɪʃən',
    tier: '3',
  },
  'un resolution 181': {
    syllables: 'U-N Res-o-lu-tion 181',
    phonetic: 'juː ɛn ˌrɛzəˈluːʃən',
    tier: '3',
  },
  'green line': { syllables: 'green line', phonetic: 'ɡriːn laɪn', tier: '3' },
  unrwa: { syllables: 'U-N-R-W-A', phonetic: 'ˈjuːnrwə', tier: '3' },
  'law of return': { syllables: 'law of re-turn', phonetic: 'lɔː ɒv rɪˈtɜːn', tier: '3' },
  fedayeen: { syllables: 'fe-da-yeen', phonetic: 'ˌfɛdəˈjiːn', tier: '3' },
  'armistice agreements': {
    syllables: 'ar-mi-stice a-gree-ments',
    phonetic: 'ˈɑːmɪstɪs əˈɡriːmənts',
    tier: '3',
  },
  'resolution 194': { syllables: 'res-o-lu-tion 194', phonetic: 'ˌrɛzəˈluːʃən', tier: '3' },
  'pan-arabism': { syllables: 'pan-Ar-ab-ism', phonetic: 'ˌpænˈærəbɪzəm', tier: '3' },
  'czech arms deal': { syllables: 'czech arms deal', phonetic: 'tʃɛk ɑːmz diːl', tier: '3' },
  nationalisation: { syllables: 'na-tion-al-i-sa-tion', phonetic: 'ˌnæʃənəlaɪˈzeɪʃən', tier: '3' },
  'secret sèvres agreement': {
    syllables: 'se-cret Sèv-res a-gree-ment',
    phonetic: 'ˈsiːkrɪt ˈsɛvr əˈɡriːmənt',
    tier: '3',
  },
  unef: { syllables: 'U-N-E-F', phonetic: 'ˈjuːnɛf', tier: '3' },
  'straits of tiran': { syllables: 'straits of ti-ran', phonetic: 'streɪts ɒv tɪˈræn', tier: '3' },
  plo: { syllables: 'P-L-O', phonetic: 'ˌpiː ɛl ˈəʊ', tier: '3' },
  fatah: { syllables: 'Fa-tah', phonetic: 'ˈfætə', tier: '3' },
  'six-day war': { syllables: 'six-day war', phonetic: 'sɪks deɪ wɔː', tier: '3' },
  'pre-emptive strike': {
    syllables: 'pre-emp-tive strike',
    phonetic: 'priːˈɛmptɪv straɪk',
    tier: '2',
  },
  'resolution 242': { syllables: 'res-o-lu-tion 242', phonetic: 'ˌrɛzəˈluːʃən', tier: '3' },
  'occupied territories': {
    syllables: 'oc-cu-pied ter-ri-to-ries',
    phonetic: 'ˈɒkjʊpaɪd ˈtɛrɪtəriz',
    tier: '3',
  },
  'golan heights': { syllables: 'Go-lan heights', phonetic: 'ˈɡəʊlæn haɪts', tier: '3' },
  'west bank': { syllables: 'west bank', phonetic: 'wɛst bæŋk', tier: '3' },
  'sinai peninsula': {
    syllables: 'Si-nai pen-in-su-la',
    phonetic: 'ˈsaɪnaɪ pəˈnɪnsjʊlə',
    tier: '3',
  },
  'gaza strip': { syllables: 'Ga-za strip', phonetic: 'ˈɡɑːzə strɪp', tier: '3' },
  'yom kippur war': { syllables: 'Yom Kip-pur war', phonetic: 'jɒm kɪˈpʊər wɔː', tier: '3' },
  opec: { syllables: 'O-P-E-C', phonetic: 'ˈəʊpɛk', tier: '3' },
  'oil embargo': { syllables: 'oil em-bar-go', phonetic: 'ɔɪl ɛmˈbɑːɡəʊ', tier: '3' },
  'shuttle diplomacy': {
    syllables: 'shut-tle di-plo-ma-cy',
    phonetic: 'ˈʃʌtl dɪˈpləʊməsi',
    tier: '3',
  },
  'camp david accords': {
    syllables: 'Camp Da-vid ac-cords',
    phonetic: 'kæmp ˈdeɪvɪd əˈkɔːdz',
    tier: '3',
  },
  intifada: { syllables: 'in-ti-fa-da', phonetic: 'ˌɪntɪˈfɑːdə', tier: '3' },
  'oslo accords': { syllables: 'Os-lo ac-cords', phonetic: 'ˈɒzləʊ əˈkɔːdz', tier: '3' },
  hamas: { syllables: 'Ha-mas', phonetic: 'hæˈmæs', tier: '3' },
  hezbollah: { syllables: 'Hez-bol-lah', phonetic: 'ˌhɛzbəˈlɑː', tier: '3' },

  // Weimar & Nazi Germany
  'weimar republic': { syllables: 'Wei-mar re-pub-lic', phonetic: 'ˈvaɪmɑː rɪˈpʌblɪk', tier: '3' },
  reichstag: { syllables: 'Reichs-tag', phonetic: 'ˈraɪçstɑːk', tier: '3' },
  diktat: { syllables: 'dik-tat', phonetic: 'dɪkˈtæt', tier: '3' },
  dolchstoß: { syllables: 'Dolch-stoß', phonetic: 'ˈdɔltʃˌʃtoːs', tier: '3' },
  'stab in the back': { syllables: 'stab in the back', phonetic: 'stæb ɪn ðə bæk', tier: '3' },
  freikorps: { syllables: 'Frei-korps', phonetic: 'ˈfraɪˌkɔːr', tier: '3' },
  'kapp putsch': { syllables: 'Kapp putsch', phonetic: 'kæp pʊtʃ', tier: '3' },
  hyperinflation: { syllables: 'hy-per-in-fla-tion', phonetic: 'ˌhaɪpərɪnˈfleɪʃən', tier: '3' },
  rentenmark: { syllables: 'Ren-ten-mark', phonetic: 'ˈrɛntənˌmɑːrk', tier: '3' },
  'dawes plan': { syllables: 'Dawes plan', phonetic: 'dɔːz plæn', tier: '3' },
  'young plan': { syllables: 'Young plan', phonetic: 'jʌŋ plæn', tier: '3' },
  'locarno pact': { syllables: 'Lo-car-no pact', phonetic: 'ləʊˈkɑːnəʊ pækt', tier: '3' },
  'kellogg-briand pact': {
    syllables: 'Kel-logg-Bri-and pact',
    phonetic: 'ˈkɛlɒɡ briːˈɑːnd pækt',
    tier: '3',
  },
  'article 48': { syllables: 'Ar-ti-cle 48', phonetic: 'ˈɑːtɪkl', tier: '3' },
  coalition: { syllables: 'co-a-li-tion', phonetic: 'ˌkəʊəˈlɪʃən', tier: '2' },
  'munich putsch': { syllables: 'Mu-nich putsch', phonetic: 'ˈmjuːnɪk pʊtʃ', tier: '3' },
  'mein kampf': { syllables: 'Mein Kampf', phonetic: 'maɪn kæmpf', tier: '3' },
  sa: { syllables: 'S-A', phonetic: 'ˌɛs ˈeɪ', tier: '3' },
  ss: { syllables: 'S-S', phonetic: 'ˌɛs ˈɛs', tier: '3' },
  gestapo: { syllables: 'Ge-sta-po', phonetic: 'ɡəˈstɑːpəʊ', tier: '3' },
  'reichstag fire': { syllables: 'Reichs-tag fire', phonetic: 'ˈraɪçstɑːk ˈfaɪər', tier: '3' },
  'enabling act': { syllables: 'En-a-bling act', phonetic: 'ɪˈneɪblɪŋ ækt', tier: '3' },
  'night of the long knives': {
    syllables: 'night of the long knives',
    phonetic: 'naɪt ɒv ðə lɒŋ naɪvz',
    tier: '3',
  },
  führer: { syllables: 'Füh-rer', phonetic: 'ˈfjʊərər', tier: '3' },
  concordat: { syllables: 'con-cor-dat', phonetic: 'kənˈkɔːdæt', tier: '3' },
  gleichschaltung: { syllables: 'Gleich-schal-tung', phonetic: 'ˈɡlaɪçˌʃaltʊŋ', tier: '3' },
  'hitler youth': { syllables: 'Hit-ler youth', phonetic: 'ˈhɪtlər juːθ', tier: '3' },
  'league of german maidens': {
    syllables: 'league of ger-man maid-ens',
    phonetic: 'liːɡ ɒv ˈdʒɜːmən ˈmeɪdənz',
    tier: '3',
  },
  kdf: { syllables: 'K-d-F', phonetic: 'kaː deː ɛf', tier: '3' },
  'strength through joy': {
    syllables: 'strength through joy',
    phonetic: 'strɛŋθ θruː dʒɔɪ',
    tier: '3',
  },
  'beauty of labour': {
    syllables: 'beau-ty of la-bour',
    phonetic: 'ˈbjuːti ɒv ˈleɪbər',
    tier: '3',
  },
  autarky: { syllables: 'au-tar-ky', phonetic: 'ˈɔːtɑːki', tier: '3' },
  'four-year plan': { syllables: 'four-year plan', phonetic: 'fɔː jɪər plæn', tier: '3' },
  'nuremberg laws': { syllables: 'Nu-rem-berg laws', phonetic: 'ˈnjʊərəmbɜːɡ lɔːz', tier: '3' },
  kristallnacht: { syllables: 'Kris-tall-nacht', phonetic: 'krɪˈstɑːlnaxt', tier: '3' },
  'night of broken glass': {
    syllables: 'night of bro-ken glass',
    phonetic: 'naɪt ɒv ˈbrəʊkən ɡlɑːs',
    tier: '3',
  },
  ghetto: { syllables: 'ghet-to', phonetic: 'ˈɡɛtəʊ', tier: '3' },
  einsatzgruppen: { syllables: 'Ein-satz-grup-pen', phonetic: 'ˈaɪnzatsˌɡrʊpən', tier: '3' },
  'final solution': { syllables: 'fi-nal so-lu-tion', phonetic: 'ˈfaɪnəl səˈluːʃən', tier: '3' },
  'wannsee conference': {
    syllables: 'Wann-see con-fer-ence',
    phonetic: 'ˈvɑːnzeɪ ˈkɒnfərəns',
    tier: '3',
  },

  // The Shoah
  antisemitism: { syllables: 'an-ti-sem-i-tism', phonetic: 'ˌæntiˈsɛmɪtɪzəm', tier: '3' },
  shoah: { syllables: 'Sho-ah', phonetic: 'ˈʃəʊə', tier: '3' },
  holocaust: { syllables: 'hol-o-caust', phonetic: 'ˈhɒləkɔːst', tier: '3' },
  deportation: { syllables: 'de-por-ta-tion', phonetic: 'ˌdiːpɔːˈteɪʃən', tier: '2' },
  'extermination camp': {
    syllables: 'ex-ter-mi-na-tion camp',
    phonetic: 'ɪkˌstɜːmɪˈneɪʃən kæmp',
    tier: '3',
  },
  'concentration camp': {
    syllables: 'con-cen-tra-tion camp',
    phonetic: 'ˌkɒnsənˈtreɪʃən kæmp',
    tier: '3',
  },
  resistance: { syllables: 're-sist-ance', phonetic: 'rɪˈzɪstəns', tier: '2' },
  perpetrator: { syllables: 'per-pe-tra-tor', phonetic: 'ˈpɜːpɪtreɪtər', tier: '2' },
  bystander: { syllables: 'by-stand-er', phonetic: 'ˈbaɪˌstændər', tier: '2' },
  collaborator: { syllables: 'col-lab-o-ra-tor', phonetic: 'kəˈlæbəreɪtər', tier: '2' },

  // Medicine Through Time
  miasma: { syllables: 'mi-as-ma', phonetic: 'maɪˈæzmə', tier: '3' },
  humourism: { syllables: 'hu-mour-ism', phonetic: 'ˈhjuːmərɪzəm', tier: '3' },
  'four humours': { syllables: 'four hu-mours', phonetic: 'fɔː ˈhjuːməz', tier: '3' },
  bloodletting: { syllables: 'blood-let-ting', phonetic: 'ˈblʌdˌlɛtɪŋ', tier: '3' },
  purging: { syllables: 'purg-ing', phonetic: 'ˈpɜːdʒɪŋ', tier: '2' },
  apothecary: { syllables: 'a-poth-e-car-y', phonetic: 'əˈpɒθɪkəri', tier: '3' },
  'barber-surgeon': { syllables: 'bar-ber-sur-geon', phonetic: 'ˈbɑːbə ˈsɜːdʒən', tier: '3' },
  quarantine: { syllables: 'quar-an-tine', phonetic: 'ˈkwɒrəntiːn', tier: '2' },
  plague: { syllables: 'plague', phonetic: 'pleɪɡ', tier: '3' },
  vesalius: { syllables: 'Ve-sa-li-us', phonetic: 'vɪˈseɪliəs', tier: '3' },
  harvey: { syllables: 'Har-vey', phonetic: 'ˈhɑːvi', tier: '3' },
  sydenham: { syllables: 'Syd-en-ham', phonetic: 'ˈsɪdənəm', tier: '3' },
  inoculation: { syllables: 'in-oc-u-la-tion', phonetic: 'ɪˌnɒkjʊˈleɪʃən', tier: '3' },
  vaccination: { syllables: 'vac-ci-na-tion', phonetic: 'ˌvæksɪˈneɪʃən', tier: '3' },
  jenner: { syllables: 'Jen-ner', phonetic: 'ˈdʒɛnər', tier: '3' },
  smallpox: { syllables: 'small-pox', phonetic: 'ˈsmɔːlpɒks', tier: '3' },
  anaesthetic: { syllables: 'an-aes-thet-ic', phonetic: 'ˌænəsˈθɛtɪk', tier: '3' },
  antiseptic: { syllables: 'an-ti-sep-tic', phonetic: 'ˌæntɪˈsɛptɪk', tier: '3' },
  chloroform: { syllables: 'chlo-ro-form', phonetic: 'ˈklɒrəfɔːm', tier: '3' },
  simpson: { syllables: 'Simp-son', phonetic: 'ˈsɪmpsən', tier: '3' },
  lister: { syllables: 'Lis-ter', phonetic: 'ˈlɪstər', tier: '3' },
  'carbolic acid': { syllables: 'car-bol-ic ac-id', phonetic: 'kɑːˈbɒlɪk ˈæsɪd', tier: '3' },
  pasteur: { syllables: 'Pas-teur', phonetic: 'pæˈstɜː', tier: '3' },
  koch: { syllables: 'Koch', phonetic: 'kɒx', tier: '3' },
  bacteriology: { syllables: 'bac-te-ri-ol-o-gy', phonetic: 'bækˌtɪəriˈɒlədʒi', tier: '3' },
  penicillin: { syllables: 'pen-i-cil-lin', phonetic: 'ˌpɛnɪˈsɪlɪn', tier: '3' },
  fleming: { syllables: 'Flem-ing', phonetic: 'ˈflɛmɪŋ', tier: '3' },
  'florey and chain': { syllables: 'Flo-rey and Chain', phonetic: 'ˈflɔːri ænd tʃeɪn', tier: '3' },
  'magic bullet': { syllables: 'mag-ic bul-let', phonetic: 'ˈmædʒɪk ˈbʊlɪt', tier: '3' },
  'salvarsan 606': { syllables: 'Sal-var-san 606', phonetic: 'ˈsælvəsæn', tier: '3' },
  prontosil: { syllables: 'Pron-to-sil', phonetic: 'ˈprɒntəsɪl', tier: '3' },
  antibiotic: { syllables: 'an-ti-bi-ot-ic', phonetic: 'ˌæntɪbaɪˈɒtɪk', tier: '3' },

  // USA 1954-1975
  segregation: { syllables: 'seg-re-ga-tion', phonetic: 'ˌsɛɡrɪˈɡeɪʃən', tier: '3' },
  'jim crow': { syllables: 'Jim Crow', phonetic: 'dʒɪm krəʊ', tier: '3' },
  'de jure': { syllables: 'de ju-re', phonetic: 'deɪ ˈdʒʊəri', tier: '3' },
  'de facto': { syllables: 'de fac-to', phonetic: 'deɪ ˈfæktəʊ', tier: '3' },
  naacp: { syllables: 'N-A-A-C-P', phonetic: 'ˌɛn eɪ eɪ siː ˈpiː', tier: '3' },
  sclc: { syllables: 'S-C-L-C', phonetic: 'ˌɛs siː ɛl ˈsiː', tier: '3' },
  sncc: { syllables: 'S-N-C-C', phonetic: 'snɪk', tier: '3' },
  core: { syllables: 'C-O-R-E', phonetic: 'kɔːr', tier: '3' },
  'brown v board of education': {
    syllables: 'Brown v Board of Ed-u-ca-tion',
    phonetic: 'braʊn vɜːsəs bɔːd',
    tier: '3',
  },
  'montgomery bus boycott': {
    syllables: 'Mont-gom-er-y bus boy-cott',
    phonetic: 'məntˈɡʌməri bʌs ˈbɔɪkɒt',
    tier: '3',
  },
  'little rock nine': { syllables: 'Lit-tle Rock nine', phonetic: 'ˈlɪtl rɒk naɪn', tier: '3' },
  'sit-in': { syllables: 'sit-in', phonetic: 'ˈsɪtɪn', tier: '3' },
  'freedom rides': { syllables: 'free-dom rides', phonetic: 'ˈfriːdəm raɪdz', tier: '3' },
  'march on washington': {
    syllables: 'march on Wash-ing-ton',
    phonetic: 'mɑːtʃ ɒn ˈwɒʃɪŋtən',
    tier: '3',
  },
  'civil rights act 1964': {
    syllables: 'civ-il rights act 1964',
    phonetic: 'ˈsɪvəl raɪts ækt',
    tier: '3',
  },
  'voting rights act 1965': {
    syllables: 'vot-ing rights act 1965',
    phonetic: 'ˈvəʊtɪŋ raɪts ækt',
    tier: '3',
  },
  'black power': { syllables: 'black pow-er', phonetic: 'blæk ˈpaʊər', tier: '3' },
  'black panthers': { syllables: 'black pan-thers', phonetic: 'blæk ˈpænθəz', tier: '3' },
  'malcolm x': { syllables: 'Mal-colm X', phonetic: 'ˈmælkəm ɛks', tier: '3' },
  'martin luther king': {
    syllables: 'Mar-tin Lu-ther King',
    phonetic: 'ˈmɑːtɪn ˈluːθər kɪŋ',
    tier: '3',
  },

  // Great War (Part 1 & 2)
  'alliance system': { syllables: 'al-li-ance sys-tem', phonetic: 'əˈlaɪəns ˈsɪstəm', tier: '3' },
  'triple entente': { syllables: 'tri-ple en-tente', phonetic: 'ˈtrɪpl ɒnˈtɒnt', tier: '3' },
  'triple alliance': { syllables: 'tri-ple al-li-ance', phonetic: 'ˈtrɪpl əˈlaɪəns', tier: '3' },
  militarism: { syllables: 'mil-i-ta-rism', phonetic: 'ˈmɪlɪtərɪzəm', tier: '3' },
  imperialism: { syllables: 'im-pe-ri-al-ism', phonetic: 'ɪmˈpɪəriəlɪzəm', tier: '3' },
  nationalism: { syllables: 'na-tion-al-ism', phonetic: 'ˈnæʃənəlɪzəm', tier: '3' },
  dreadnought: { syllables: 'dread-nought', phonetic: 'ˈdrɛdnɔːt', tier: '3' },
  'schlieffen plan': { syllables: 'Schlief-fen plan', phonetic: 'ˈʃliːfən plæn', tier: '3' },
  stalemate: { syllables: 'stale-mate', phonetic: 'ˈsteɪlmeɪt', tier: '2' },
  'no man’s land': { syllables: 'no man’s land', phonetic: 'nəʊ mænz lænd', tier: '3' },
  'trench warfare': { syllables: 'trench war-fare', phonetic: 'trɛntʃ ˈwɔːfeər', tier: '3' },
  artillery: { syllables: 'ar-til-ler-y', phonetic: 'ɑːˈtɪləri', tier: '3' },
  shrapnel: { syllables: 'shrap-nel', phonetic: 'ˈʃræpnəl', tier: '3' },
  conscription: { syllables: 'con-scrip-tion', phonetic: 'kənˈskrɪpʃən', tier: '3' },
  propaganda: { syllables: 'prop-a-gan-da', phonetic: 'ˌprɒpəˈɡændə', tier: '2' },
  armistice: { syllables: 'ar-mi-stice', phonetic: 'ˈɑːmɪstɪs', tier: '3' },
  reparations: { syllables: 'rep-a-ra-tions', phonetic: 'ˌrɛpəˈreɪʃənz', tier: '3' },

  // Early Elizabethan England
  'divine right': { syllables: 'di-vine right', phonetic: 'dɪˈvaɪn raɪt', tier: '3' },
  legitimacy: { syllables: 'le-git-i-ma-cy', phonetic: 'lɪˈdʒɪtɪməsi', tier: '2' },
  'privy council': { syllables: 'priv-y coun-cil', phonetic: 'ˈprɪvi ˈkaʊnsəl', tier: '3' },
  parliament: { syllables: 'par-lia-ment', phonetic: 'ˈpɑːləmənt', tier: '3' },
  'religious settlement': {
    syllables: 're-li-gious set-tle-ment',
    phonetic: 'rɪˈlɪdʒəs ˈsɛtlmənt',
    tier: '3',
  },
  'act of supremacy': {
    syllables: 'act of su-prem-a-cy',
    phonetic: 'ækt ɒv suːˈprɛməsi',
    tier: '3',
  },
  'act of uniformity': {
    syllables: 'act of u-ni-form-i-ty',
    phonetic: 'ækt ɒv ˌjuːnɪˈfɔːmɪti',
    tier: '3',
  },
  'papal bull': { syllables: 'pa-pal bull', phonetic: 'ˈpeɪpəl bʊl', tier: '3' },
  excommunication: {
    syllables: 'ex-com-mu-ni-ca-tion',
    phonetic: 'ˌɛkskəˌmjuːnɪˈkeɪʃən',
    tier: '3',
  },
  recusant: { syllables: 'rec-u-sant', phonetic: 'ˈrɛkjʊzənt', tier: '3' },
  'seminary priest': { syllables: 'sem-i-nar-y priest', phonetic: 'ˈsɛmɪnəri priːst', tier: '3' },
  jesuit: { syllables: 'Jes-u-it', phonetic: 'ˈdʒɛzjuɪt', tier: '3' },
  'ridolfi plot': { syllables: 'Ri-dol-fi plot', phonetic: 'rɪˈdɒlfi plɒt', tier: '3' },
  'throckmorton plot': {
    syllables: 'Throck-mor-ton plot',
    phonetic: 'ˈθrɒkmɔːtən plɒt',
    tier: '3',
  },
  'babington plot': { syllables: 'Bab-ing-ton plot', phonetic: 'ˈbæbɪŋtən plɒt', tier: '3' },
  armada: { syllables: 'ar-ma-da', phonetic: 'ɑːˈmɑːdə', tier: '3' },
  fireships: { syllables: 'fire-ships', phonetic: 'ˈfaɪəʃɪps', tier: '3' },
  galleon: { syllables: 'gal-le-on', phonetic: 'ˈɡæliən', tier: '3' },
};

// Algorithmic syllabifier fallback
function generateSyllables(word) {
  if (!word) return '';
  const clean = word.trim();
  const lower = clean.toLowerCase();
  if (VOCAB_MAP[lower] && VOCAB_MAP[lower].syllables) return VOCAB_MAP[lower].syllables;

  // Handle hyphenated or multi-word
  if (clean.includes(' ')) {
    return clean.split(/\s+/).map(generateSyllables).join(' ');
  }
  if (clean.includes('-')) {
    return clean.split('-').map(generateSyllables).join('-');
  }

  // Basic English syllable splitting rule
  const text = clean;
  if (text.length <= 4) return text;
  return text
    .replace(/([aeiouy]{1,2})([bcdfghjklmnpqrstvwxz]{2,})([aeiouy])/gi, '$1-$2$3')
    .replace(/([aeiouy])([bcdfghjklmnpqrstvwxz])([aeiouy])/gi, '$1-$2$3');
}

// Algorithmic phonetic fallback
function generatePhonetic(word) {
  if (!word) return '';
  const clean = word.trim();
  const lower = clean.toLowerCase();
  if (VOCAB_MAP[lower] && VOCAB_MAP[lower].phonetic) return VOCAB_MAP[lower].phonetic;

  // Multi-word
  if (clean.includes(' ')) {
    return clean.split(/\s+/).map(generatePhonetic).join(' ');
  }

  // Plain phonetic fallback
  return clean.toLowerCase();
}

function determineTier(term, def) {
  const lower = (term + ' ' + (def || '')).toLowerCase();
  if (VOCAB_MAP[term.toLowerCase()] && VOCAB_MAP[term.toLowerCase()].tier) {
    return VOCAB_MAP[term.toLowerCase()].tier;
  }
  const tier3Keywords = [
    'act',
    'treaty',
    'pact',
    'war',
    'battle',
    'emperor',
    'king',
    'rebellion',
    'feudal',
    'monarchy',
    'republic',
    'empire',
    'church',
    'pope',
    'soviet',
    'nazi',
    'doctrine',
    'decree',
    'parliament',
    'strike',
    'revolt',
    'plague',
  ];
  return tier3Keywords.some((k) => lower.includes(k)) ? '3' : '2';
}

const ROOT_DIR = path.resolve(__dirname, '..');
const UNITS_DIR = path.join(ROOT_DIR, 'units');

const TARGET_UNITS = [
  'cme_new',
  'edexcel_medicine',
  'eee',
  'great_war',
  'great_war_part2',
  'industrialisation_and_empire',
  'ks2_ww2',
  'second_british_empire',
  'the_shoah',
  'usa',
  'water_and_sanitation',
  'weimar_nazi_germany',
];

let grandTotalEnriched = 0;

TARGET_UNITS.forEach((unitId) => {
  const dataPath = path.join(UNITS_DIR, unitId, 'data.js');
  if (!fs.existsSync(dataPath)) return;
  let code = fs.readFileSync(dataPath, 'utf8');

  let enrichedInUnit = 0;

  // Match each vocab: [ ... ] block
  // We can parse the array or replace items that have term and definition
  code = code.replace(/vocab\s*:\s*\[([\s\S]*?)\]\s*,/g, (match, inner) => {
    // Inside inner, match { ... } objects
    const newInner = inner.replace(/\{([\s\S]*?)\}/g, (objMatch, objBody) => {
      const termMatch = objBody.match(/term\s*:\s*(['"`])([\s\S]*?)\1/);
      if (!termMatch) return objMatch;

      const term = termMatch[2].trim();
      const hasSyllables = /syllables\s*:/.test(objBody);
      const hasPhonetic = /phonetic\s*:/.test(objBody);
      const hasTier = /tier\s*:/.test(objBody);

      if (hasSyllables && hasPhonetic && hasTier) {
        return objMatch; // already complete!
      }

      enrichedInUnit++;
      grandTotalEnriched++;

      const defMatch = objBody.match(/definition\s*:\s*(['"`])([\s\S]*?)\1/);
      const def = defMatch ? defMatch[2] : '';

      const syl = generateSyllables(term);
      const phon = generatePhonetic(term);
      const tierVal = determineTier(term, def);

      let additions = '';
      if (!hasSyllables) additions += `\n          syllables: '${syl.replace(/'/g, "\\'")}',`;
      if (!hasPhonetic) additions += `\n          phonetic: '${phon.replace(/'/g, "\\'")}',`;
      if (!hasTier) additions += `\n          tier: '${tierVal}',`;

      // Insert additions before closing brace
      return objMatch.replace(/\s*\}$/, `${additions}\n        }`);
    });

    return `vocab: [${newInner}],`;
  });

  const tempPath = path.join(__dirname, `temp_enrich_${unitId}.js`);
  fs.writeFileSync(tempPath, code, 'utf8');

  try {
    execSync(`node -c "${tempPath}"`, { stdio: 'pipe' });
    fs.writeFileSync(dataPath, code, 'utf8');
    console.log(
      `✅ ${unitId.padEnd(28)}: Enriched ${enrichedInUnit} vocabulary entries with full phonetic metadata.`,
    );
  } catch (err) {
    console.error(`❌ ${unitId} failed syntax check:`, err.message);
  } finally {
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  }
});

console.log(
  `\n🎉 Grand Total Vocab Entries Enriched with Phonetics & Syllables: ${grandTotalEnriched}`,
);
