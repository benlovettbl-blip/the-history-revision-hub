/**
 * Courtyard of Two Keys (1914–1995)
 * 3-Generation Ageing Family Tree, Heirloom Lineage & Gentle Acoustic Foley
 * Zero arcade buzzers or gamey SFX — respectful, atmospheric foley with 1-click mute.
 */

class CourtyardFoley {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (this.muted || typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
      window.__hhRegisterAudioCtx?.(this.ctx);
    }
    window.__hhRegisterAudioCtx?.(this.ctx);
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  // Soft parchment / page rustle
  pageTurn() {
    const ctx = this.ensure();
    if (!ctx) return;
    try {
      const dur = 0.09;
      const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / data.length) * Math.PI) * 0.09;
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1100;
      src.connect(filter);
      filter.connect(ctx.destination);
      src.start();
    } catch (e) {}
  }

  // Brief vintage wireless tuning static + warm carrier settle
  radioTune(freqHz = 520) {
    const ctx = this.ensure();
    if (!ctx) return;
    try {
      const dur = 0.18;
      const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const env = 1 - i / data.length;
        data[i] = (Math.random() * 2 - 1) * env * 0.08;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 1600;
      noise.connect(bp);
      bp.connect(ctx.destination);
      noise.start();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freqHz, now + 0.05);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + 0.05);
      osc.stop(now + 0.29);
    } catch (e) {}
  }

  // Quiet warm wooden chord for wax chronicle stamp or Memory Echo
  warmChord() {
    const ctx = this.ensure();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [293.66, 369.99, 440].forEach((hz, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(hz, now + idx * 0.04);
        gain.gain.setValueAtTime(0.001, now + idx * 0.04);
        gain.gain.linearRampToValueAtTime(0.045, now + idx * 0.04 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + 0.58);
      });
    } catch (e) {}
  }

  // Heavy forged iron / brass key clink
  keyClink() {
    const ctx = this.ensure();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [1320, 1985, 2790].forEach((hz, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(hz, now + i * 0.028);
        g.gain.setValueAtTime(0.001, now + i * 0.028);
        g.gain.linearRampToValueAtTime(0.06 / (i + 1), now + i * 0.028 + 0.006);
        g.gain.exponentialRampToValueAtTime(0.0008, now + 0.34);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now + i * 0.028);
        osc.stop(now + 0.36);
      });
    } catch (e) {}
  }

  // Heavy limestone well block / stone scrape
  stoneScrape() {
    const ctx = this.ensure();
    if (!ctx) return;
    try {
      const dur = 0.28;
      const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const env = Math.sin((i / data.length) * Math.PI);
        data[i] = (Math.random() * 2 - 1) * env * 0.14;
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 360;
      src.connect(lp);
      lp.connect(ctx.destination);
      src.start();
    } catch (e) {}
  }

  // Delicate mint-tea glass / porcelain cup chime
  teaGlassChime() {
    const ctx = this.ensure();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2349, now);
      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(0.045, now + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0008, now + 0.42);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {}
  }

  // Soft match strike & candle / lamp warmth
  candleGlow() {
    const ctx = this.ensure();
    if (!ctx) return;
    try {
      this.pageTurn();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now + 0.04);
      g.gain.setValueAtTime(0.001, now + 0.04);
      g.gain.linearRampToValueAtTime(0.035, now + 0.12);
      g.gain.exponentialRampToValueAtTime(0.0008, now + 0.48);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now + 0.04);
      osc.stop(now + 0.5);
    } catch (e) {}
  }

  // Dispatch object-specific LucasArts prop foley based on hotspot ID
  playPropSound(hotspotId = '') {
    const id = String(hotspotId).toLowerCase();
    if (id.includes('key') || id.includes('tube') || id.includes('bino')) {
      this.keyClink();
    } else if (id.includes('well') || id.includes('stone') || id.includes('bridge') || id.includes('crane') || id.includes('shutter')) {
      this.stoneScrape();
    } else if (id.includes('tea') || id.includes('tin') || id.includes('crate') || id.includes('box')) {
      this.teaGlassChime();
    } else if (id.includes('candle') || id.includes('oil') || id.includes('cradle') || id.includes('tv')) {
      this.candleGlow();
    } else if (id.includes('radio')) {
      this.radioTune(510);
    } else {
      this.pageTurn();
    }
  }

  // Subtle mechanical rotary Bakelite knob detent tick
  knobClick(freqHz = 720) {
    const ctx = this.ensure();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freqHz, now);
      g.gain.setValueAtTime(0.032, now);
      g.gain.exponentialRampToValueAtTime(0.0008, now + 0.032);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.035);
    } catch (e) {}
  }

  // Heavy wooden ledger / wax seal stamp thunk
  waxStamp() {
    const ctx = this.ensure();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(145, now);
      osc.frequency.exponentialRampToValueAtTime(52, now + 0.14);
      g.gain.setValueAtTime(0.16, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.17);
    } catch (e) {}
  }
}

export const courtyardFoley = new CourtyardFoley();

export function resolveTreeNodePortrait(_person, _year = 1995) {
  // Composite archetype characters render crisp wax-seal monograms (AGENTS.md §6.2)
  return null;
}

export const FAMILY_TREE_GENERATIONS = [
  {
    genLabel: 'Generation I (1897–1970s) — Roots, Refuge & The 1948 Threshold',
    haddad: [
      {
        id: 'ibrahim',
        name: 'Ibrahim Haddad',
        shortName: 'Ibrahim',
        monogram: 'IH',
        relationTag: 'Patriarch · Married Salma',
        lifespan: 'b. 1897 (Jaffa) – d. 1972 (Amman)',
        birthYear: 1897,
        deathYear: 1972,
        role: 'Jaffa citrus grower & town elder',
        arc: 'Tends his family’s pomegranate courtyard in Jaffa under Mandate rule; hides toddler Karim’s brass biscuit tin behind the well stone in April 1948 before fleeing to Jericho (Al-Nakba); passes the iron house key to Karim in Amman shortly before dying in autumn 1972.',
      },
      {
        id: 'salma',
        name: 'Salma Haddad',
        shortName: 'Salma',
        monogram: 'SH',
        relationTag: 'Matriarch · Married Ibrahim',
        lifespan: 'b. 1903 (Jaffa) – d. 1976 (Amman)',
        birthYear: 1903,
        deathYear: 1976,
        role: 'Matriarch of the Jaffa courtyard',
        arc: 'Leaves her porcelain teacup on the courtyard table in April 1948 expecting to return within two weeks; holds the family together through Jericho UNRWA tent winters and the second displacement across the River Jordan in June 1967.',
      },
    ],
    aloni: [
      {
        id: 'dov',
        name: 'Dov Aloni',
        shortName: 'Dov',
        monogram: 'DA',
        relationTag: 'Patriarch · Married Miriam',
        lifespan: 'b. 1916 (Kraków) – d. 1989 (Tel Aviv)',
        birthYear: 1916,
        deathYear: 1989,
        role: 'Haifa print-shop typesetter & IDF signal technician',
        arc: 'Arrives at Haifa in 1936 with his sister Rivka during the Fifth Aliyah while fiancée Miriam is trapped in Poland by the 1939 White Paper; serves in 1948 and 1956 while rejecting Cousin Eli’s Irgun extremism.',
      },
      {
        id: 'miriam',
        name: 'Miriam Aloni (née Kowalska)',
        shortName: 'Miriam',
        monogram: 'MA',
        relationTag: 'Matriarch · Married Dov',
        lifespan: 'b. 1919 (Kraków)',
        birthYear: 1919,
        deathYear: null,
        role: 'Auschwitz survivor, Haifa seamstress & Jaffa grandmother',
        arc: 'Trapped in Kraków when Britain’s 1939 White Paper rationed visas; survives Auschwitz and a 1946 DP camp before reuniting with Dov in Haifa; housed in the vacated Jaffa courtyard in late 1948, where she protects Ibrahim’s brass tin for 19 years.',
      },
      {
        id: 'eli',
        name: 'Cousin Eli',
        shortName: 'Cousin Eli',
        relationTag: 'Side Branch · Dov’s Cousin',
        lifespan: 'b. 1924 (Warsaw)',
        birthYear: 1924,
        deathYear: null,
        isFoil: true,
        monogram: 'CE',
        role: 'Irgun underground militant (1946–48)',
        arc: 'Argues at Haifa harbour in 1947 that bombing the King David Hotel forced Britain out — confronted by Miriam over the 91 dead and Haganah’s moral split from Irgun.',
      },
    ],
  },
  {
    genLabel: 'Generation II (1942–Present) — Borders, Wars & The 1967 Doorway',
    haddad: [
      {
        id: 'karim',
        name: 'Karim Haddad',
        shortName: 'Karim',
        monogram: 'KH',
        relationTag: 'Eldest Son of Ibrahim & Salma',
        lifespan: 'b. 1942 (Jaffa)',
        birthYear: 1942,
        deathYear: null,
        role: 'UNRWA history & English teacher (Gaza, Amman & Ramallah)',
        arc: 'Photographed as a young child in Jaffa before 1948; studies in a 1956 UNRWA camp classroom; knocks on his childhood Jaffa door when the Green Line opens in July 1967; refutes brother Tariq’s PFLP/Munich radicalism in 1972; raises daughter Layla in Amman and Ramallah.',
      },
      {
        id: 'tariq',
        name: 'Tariq Haddad',
        shortName: 'Tariq',
        monogram: 'TH',
        relationTag: 'Younger Son of Ibrahim & Salma',
        lifespan: 'b. 1948 (Road to Jericho)',
        birthYear: 1948,
        deathYear: null,
        isFoil: true,
        role: 'Younger brother drawn toward radical factions (1966–72)',
        arc: 'Born during the 1948 exodus; boasts of Syrian/Egyptian victory in 1966 and defends Dawson’s Field and Munich in 1972 — challenged by Karim and Father Ibrahim over civilian harm and Black September.',
      },
    ],
    aloni: [
      {
        id: 'noa',
        name: 'Noa Aloni-Mizrahi',
        shortName: 'Noa',
        monogram: 'NA',
        relationTag: 'Daughter of Dov & Miriam · Married Avi',
        lifespan: 'b. May 1948 (Jaffa)',
        birthYear: 1948,
        deathYear: null,
        role: 'Galilee nurse & reserve signal operator',
        arc: 'Born the week Israel declared independence; opens the Jaffa courtyard door to Karim in July 1967 and returns his childhood photo from the well; serves in June 1967 and Oct 1973; marches with 400,000 Israelis in 1982 demanding the Kahan Inquiry.',
      },
      {
        id: 'avi',
        name: 'Avi Mizrahi',
        shortName: 'Avi',
        monogram: 'AM',
        relationTag: 'Married Noa · Iraqi-Jewish Son',
        lifespan: 'b. 1946 (Baghdad, Iraq)',
        birthYear: 1946,
        deathYear: null,
        role: 'Water engineer & armoured corps reservist',
        arc: 'Airlifted from Baghdad dispossession in 1950 at age four into an Israeli ma’abarah tent camp — representing ~850,000 Mizrahi Jews from Arab lands; works on the 1964 National Water Carrier, fights on Yom Kippur 1973, and welcomes Sadat in Jerusalem in 1977.',
      },
    ],
  },
  {
    genLabel: 'Generation III (1971–Present) — Intifada, Oslo & Unfinished Hope (1995)',
    haddad: [
      {
        id: 'layla',
        name: 'Layla Haddad',
        shortName: 'Layla',
        monogram: 'LH',
        relationTag: 'Daughter of Karim · Granddaughter of Ibrahim',
        lifespan: 'b. late 1973 (Amman / Ramallah)',
        birthYear: 1973,
        deathYear: null,
        role: 'Palestinian medical student (Ramallah & Jericho)',
        arc: 'Sleeps in her Amman cradle during the 1973–74 war; comes of age during the Dec 1987 First Intifada and 1988 Algiers/Geneva breakthrough; carries Grandfather Ibrahim’s iron key with a carved pomegranate charm and stands beside Yonatan in Jaffa on 4 Nov 1995.',
      },
      {
        id: 'sami',
        name: 'Cousin Sami',
        shortName: 'Cousin Sami',
        relationTag: 'Side Branch · Gaza Cousin',
        lifespan: 'b. 1973 (Gaza)',
        birthYear: 1973,
        deathYear: null,
        isFoil: true,
        monogram: 'CS',
        role: 'Anti-Oslo / Hamas sympathiser (1993–95)',
        arc: 'Bitter over checkpoints and Area C (73%), argues Oslo is a trap — confronted by Layla over the moral horror and self-sabotage of Hamas civilian bus bombings.',
      },
    ],
    aloni: [
      {
        id: 'yonatan',
        name: 'Yonatan (“Yoni”) Aloni-Mizrahi',
        shortName: 'Yonatan',
        monogram: 'YM',
        relationTag: 'Son of Noa & Avi · Grandson of Miriam',
        lifespan: 'b. 1974 (Tel Aviv)',
        birthYear: 1974,
        deathYear: null,
        role: 'IDF paramedic & university student',
        arc: 'Carried on Avi’s shoulders at the 1982 Tel Aviv rally; helps Layla save a heart patient at a 1995 West Bank checkpoint; mourns Prime Minister Yitzhak Rabin in Savta Miriam’s rainy Jaffa courtyard on 4 November 1995.',
      },
      {
        id: 'gideon',
        name: 'Cousin Gideon',
        shortName: 'Cousin Gideon',
        relationTag: 'Side Branch · Settler Cousin',
        lifespan: 'b. 1971 (West Bank Settlement)',
        birthYear: 1971,
        deathYear: null,
        isFoil: true,
        monogram: 'CG',
        role: 'Hardline Area C settler opposing Oslo I & II (1993–95)',
        arc: 'Brings anti-Rabin flyers to Friday dinner claiming handing land to the PNA betrays Jewish security — rebuked by Grandmother Miriam days before Yigal Amir assassinates Rabin.',
      },
    ],
  },
];

export const HEIRLOOM_LINEAGE = [
  { icon: '🗝️', name: 'Forged Iron Jaffa Key (1922 → 1948 → 1972 → 1995)', holder: 'Ibrahim → Karim → Layla', note: 'Locked the courtyard door in April 1948; passed from dying Ibrahim in Amman (1972) to Karim, then carried with a carved pomegranate charm by granddaughter Layla in 1995.' },
  { icon: '🥫', name: 'Hidden Brass Biscuit Tin (1948 → 1967)', holder: 'Ibrahim → Protected by Miriam → Returned by Noa to Karim', note: 'Held the Jaffa grove deed and young Karim’s portrait behind the loose well stone for 19 winters until the Green Line opened in July 1967.' },
  { icon: '🧳', name: 'Kraków Quota Permit & Baghdad Suitcase Tag (1936–50)', holder: 'Dov, Miriam & Avi Mizrahi', note: 'Captures both European Holocaust survival and the exodus of ~850,000 Mizrahi Jews from Iraq and Arab states.' },
  { icon: '🕯️', name: 'Twin Courtyard Keys & Rabin’s Candle (4 Nov 1995)', holder: 'Layla, Yonatan & Savta Miriam', note: 'Ibrahim’s 1948 iron key and Miriam’s brass latchkey united beside Rabin’s memorial candle in defiance of extremists on both fringes.' },
];
