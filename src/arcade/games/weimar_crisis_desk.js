/**
 * Visual Showcase Game 3: "Chancellor on the Brink: Weimar Crisis Desk (1918–1933)"
 * Gold Standard v3 — Official History Escape Room & Ministerial Crisis Edition
 *
 * Features:
 *   - Unified History Revision Hub Escape Room Brand Bar & Cover Launchpad
 *   - 2-Scene Voiced Atmospheric 1918–1929 Cinematic Opening (`weimar_pro_1..2`)
 *   - 5 Era-Verified Archival Source Plates with Interactive 2.4× Brass Magnifying Loupe
 *   - Explicit "What To Do & Why" Task Directive Banners + Grounded 5-Record Cabinet Case File
 *   - Live Loaf-of-Bread Hyperinflation Ticker + Article 48 Presidential Decree Temptation (-12% Democracy!)
 *   - 2-Scene Voiced Atmospheric January 1933 Cinematic Ending (`weimar_end_1..2`)
 *   - Official GCSE Weimar Workbook Back-Cover Homework Verification Code Card
 */

import { arcadeAudio, getArcadePersonalBest, saveArcadePersonalBest } from '../arcade_audio.js';
import { generateQuestionId, recordQuestionResult } from '../../storage.js';
import {
  renderEscapeBrandBarHTML,
  renderEscapeCoverSealHTML,
  renderTaskDirectiveBannerHTML,
  renderArchivalLoupeFrameHTML,
  bindArchivalLoupeDelegation,
  renderHistoricalCaseFileHTML,
  renderAtmosphericCinemaHTML,
  renderWorkbookCodeCardHTML,
  createEscapeCinemaVoicePlayer,
} from '../../interactive_labs/escape_room_brand.js';

const WEIMAR_PROLOGUE = [
  {
    voClip: 'weimar_pro_1',
    credit: 'THE HISTORY REVISION HUB PRESENTS • BERLIN, NOVEMBER 1918',
    heading: 'Birth of a Fragile Republic',
    img: '/images/upgraded/gcse-p3/weimar_l01_banner_berlin_revolution_1918.jpg',
    alt: 'November 1918 Berlin street crowd carrying banner supporting the Ebert-Scheidemann government',
    caption:
      'Berlin, November 1918 • Crowds rally for the new Ebert–Scheidemann Republic ("Für die Regierung Ebert-Scheidemann") after the Kaiser’s abdication',
    vignette: 'gold',
    narration:
      'Berlin, November 1918. Out of war, starvation, and the Kaiser’s abdication, Germany’s new Weimar Republic is born—with proportional representation, votes for women, and emergency Article 48.',
  },
  {
    voClip: 'weimar_pro_2',
    credit: 'VERSAILLES, PUTSCHES & ECONOMIC SHOCK • 1919–1929',
    heading: 'Besieged From Left and Right',
    img: '/images/gw_berlin_reichstag_protest_1919.jpg',
    alt: 'Mass demonstration outside the Berlin Reichstag protesting the Treaty of Versailles on 15 May 1919',
    caption:
      'Berlin Reichstag, 15 May 1919 • Mass demonstration protesting the Treaty of Versailles ("Massendemonstration gegen den Gewaltfrieden")',
    vignette: 'crimson',
    narration:
      'Attacked by Spartacists on the Left, Freikorps and Nazis on the Right, hyperinflation in 1923, and the Wall Street Crash of 1929—step behind the Chancellor’s desk and try to keep democracy alive.',
  },
];

const WEIMAR_EPILOGUE = [
  {
    voClip: 'weimar_end_1',
    credit: 'FINALE SCENE 1 OF 2 • 30 JANUARY – MARCH 1933',
    heading: 'Hollowed Out From Within',
    img: '/images/hitler_hindenburg_1933.jpg',
    alt: 'Chancellor Adolf Hitler bowing as he shakes hands with Reich President Paul von Hindenburg in March 1933',
    caption:
      'Potsdam Day, 21 March 1933 • Newly appointed Chancellor Adolf Hitler bows before Reich President Paul von Hindenburg',
    vignette: 'crimson',
    narration:
      '30 January 1933. Weimar democracy did not fall to an armed putsch—it was hollowed out from within by six million unemployed, Article 48 decrees, and Von Papen’s fatal backstairs deal with Hindenburg.',
  },
  {
    voClip: 'weimar_end_2',
    credit: 'FINALE SCENE 2 OF 2 • WEIMAR REPUBLIC HISTORICAL VERDICT',
    heading: 'From Stresemann’s Volcano to Dictatorship',
    img: '/images/upgraded/gcse-p3/weimar_l03_banner_locarno_treaties_1925.jpg',
    alt: 'Foreign Minister Gustav Stresemann with European statesmen at the Locarno Conference in October 1925',
    caption:
      'Locarno Conference, October 1925 • Gustav Stresemann restored German stability—yet warned that prosperity rested on a volcano of short-term US loans',
    vignette: 'gold',
    narration:
      'From Stresemann’s Rentenmark and Dawes Plan recovery to Brüning’s decrees and Hitler’s chancellorship, you have traced every turning point of Weimar Germany!',
  },
];

const CRISIS_DOSSIERS = [
  {
    id: 'kapp_1920',
    year: 'MARCH 1920',
    shortTab: '1. Kapp (1920)',
    title: 'Crisis 1: The Kapp Putsch — 5,000 Freikorps March on Berlin!',
    breadPrice: '1.20 Marks',
    breadAlert: false,
    unemployed: '0.4m',
    leftThreat: 45,
    rightThreat: 88,
    plateImg: '/images/gw_berlin_reichstag_protest_1919.jpg',
    plateAlt: 'Huge crowd gathered outside the Berlin Reichstag protesting the Treaty of Versailles, May 1919',
    plateCaption:
      'Archival Plate • Mass nationalist protest outside the Berlin Reichstag against Versailles army & border terms (15 May 1919)',
    clueX: 50,
    clueY: 56,
    clueBtnLabel: '🔍 Magnify Reichstag Versailles Crowd',
    clueInsight:
      'Loupe Clue Verified: Fury over the Treaty of Versailles (100,000-man army cap) turned right-wing soldiers against Weimar—so the army refused to fire on Freikorps rebels!',
    taskWhat:
      'Magnify the Reichstag source plate, read General von Seeckt’s telegram, and choose the ONLY non-military weapon capable of paralysing Wolfgang Kapp’s coup!',
    taskWhy:
      'In 1919 the army crushed left-wing Spartacists ruthlessly, yet in March 1920 it refused to shoot right-wing Freikorps—forcing Ebert to rely on Berlin’s workers instead.',
    caseRecordTitle: '1920 General Strike & Army Bias',
    caseRecordSummary:
      'Von Seeckt refused to fire on right-wing Freikorps, proving Weimar depended on trade-union workers while the army stayed disloyal.',
    telegram:
      'URGENT TELEGRAM: Right-wing nationalist Wolfgang Kapp & Freikorps troops furious at Versailles army cuts (100,000 limit) have seized Berlin! General von Seeckt of the Reichswehr just told President Ebert: "Reichswehr does not fire upon Reichswehr!"',
    prompt: 'Your own army refuses to shoot the right-wing rebels! How do you save the Weimar Republic before lunchtime?',
    options: [
      {
        label:
          'Call on Berlin’s workers & trade unions to launch a total General Strike—shut off all water, gas, electricity, trains, and trams!',
        correct: true,
        stabilityDelta: +15,
        verdict:
          '🚋 GENIUS MOVE, CHANCELLOR! Kapp can’t govern a capital city with no electricity, no trams, and no running taps! Within 4 days (100 hours), Wolfgang Kapp flees to Sweden!',
        examNote:
          'The March 1920 Kapp Putsch exposed the Reichswehr’s right-wing sympathy, yet Berlin workers paralysed the city via a General Strike to rescue the Republic.',
      },
      {
        label: 'Order the 100,000-man Reichswehr to charge anyway',
        correct: false,
        stabilityDelta: -20,
        verdict:
          '🪖 Von Seeckt ignored your order and went for coffee! Never forget: the army crushed left-wing Spartacists in 1919, yet refused to fire on right-wing Freikorps in 1920!',
        examNote:
          'Crucial Weimar asymmetry: The army and judiciary (judges) punished left-wing rebels harshly while treating right-wing putschists leniently.',
      },
      {
        label: 'Surrender the Weimar Constitution and crown Wolfgang Kapp the new Kaiser',
        correct: false,
        stabilityDelta: -30,
        verdict: '👑 Shortest Chancellorship in German history! Pack your briefcase!',
        examNote: 'Ebert’s government temporarily fled to Dresden/Stuttgart and defeated Kapp via passive civil paralysis.',
      },
    ],
  },
  {
    id: 'ruhr_1923',
    year: 'AUTUMN 1923',
    shortTab: '2. Ruhr (1923)',
    title: 'Crisis 2: Ruhr Invasion & 200-Billion-Mark Loaf of Bread!',
    breadPrice: '200,000,000,000 Marks!',
    breadAlert: true,
    unemployed: '1.5m',
    leftThreat: 65,
    rightThreat: 85,
    plateImg: '/images/upgraded/gcse-p3/weimar_l02_b4_hyperinflation_berlin_bread_1923.jpg',
    plateAlt: 'October 1923 Berliners thrusting thick bundles of paper Reichsmarks toward a baker’s wagon to buy rye bread',
    plateCaption:
      'Archival Plate • Berliners thrust thick wads of worthless Papiermarks at a street bread wagon during peak hyperinflation (October 1923)',
    clueX: 54,
    clueY: 50,
    clueBtnLabel: '🔍 Magnify Paper-Mark Bread Bundles',
    clueInsight:
      'Loupe Clue Verified: Printing unbacked paper money to pay striking Ruhr workers destroyed the currency—only ending passive resistance and issuing a strictly limited currency can restore trust!',
    taskWhat:
      'Inspect the 1923 Berlin bread wagon under the brass loupe, then enact Gustav Stresemann’s currency rescue package to bring bread back down from 200 billion Marks!',
    taskWhy:
      'Hyperinflation wiped out middle-class life savings and pensions, planting deep middle-class resentment that extremists later exploited.',
    caseRecordTitle: 'Nov 1923 Rentenmark & Middle-Class Scars',
    caseRecordSummary:
      'Stresemann ended passive resistance and stabilised the currency with the Rentenmark, but middle-class savers never forgot losing everything.',
    telegram:
      'ECONOMIC MELTDOWN: France & Belgium occupied the Ruhr industrial heartland after missed reparations! Printing paper Marks to pay striking workers triggered HYPERINFLATION—thieves just stole a woman’s wheelbarrow and left the piles of cash on the pavement!',
    prompt: 'You are Gustav Stresemann (appointed August 1923). What decisive stabilization package rescues Germany?',
    options: [
      {
        label: 'Print EVEN FASTER 100-trillion-Mark notes so everyone becomes a billionaire!',
        correct: false,
        stabilityDelta: -25,
        verdict:
          '💸 A cup of coffee doubled in price while the waiter walked from the kitchen to your table! Middle-class savers and pensioners will never forgive Weimar!',
        examNote:
          'Hyperinflation wiped out middle-class bank savings and fixed pensions (though borrowers/landowners paid off debts cheaply).',
      },
      {
        label:
          'Call off passive resistance in the Ruhr, burn worthless Papiermarks, & launch the strictly limited Rentenmark (later Reichsmark)!',
        correct: true,
        stabilityDelta: +20,
        verdict:
          '🍞 CURRENCY STABILISED! Bread drops back to 1 Rentenmark! Nationalists call calling off passive resistance a betrayal, yet confidence returns overnight!',
        examNote:
          'Stresemann ended passive resistance (Sept 1923), introduced the temporary Rentenmark (Nov 1923, backed by land/industrial mortgages), and established the Reichsbank Reichsmark (1924).',
      },
      {
        label: 'Invade Paris with 100,000 soldiers and zero tanks or aircraft',
        correct: false,
        stabilityDelta: -30,
        verdict:
          '🏳️ Under the Treaty of Versailles, Germany had 0 tanks, 0 submarines, 0 air force, and a 100,000 army—France had 750,000 troops!',
        examNote: 'Versailles military restrictions made armed resistance to the 1923 Franco-Belgian Ruhr occupation impossible.',
      },
    ],
  },
  {
    id: 'munich_1923',
    year: '8–9 NOV 1923',
    shortTab: '3. Munich (1923)',
    title: 'Crisis 3: Munich Beer Hall Putsch — Hitler Fires Into the Ceiling!',
    breadPrice: '1.00 Rentenmark',
    breadAlert: false,
    unemployed: '1.2m',
    leftThreat: 35,
    rightThreat: 92,
    plateImg: '/images/upgraded/gcse-p3/weimar_l06_banner_munich_nsdap_march_nov1923.jpg',
    plateAlt: 'Uniformed SA stormtroopers marching in Munich on 4 November 1923 days before the Beer Hall Putsch',
    plateCaption:
      'Archival Plate • SA stormtroopers march through Munich ("Münchner Trauertag 4.11.23") four days before Hitler’s Beer Hall Putsch',
    clueX: 38,
    clueY: 36,
    clueBtnLabel: '🔍 Magnify 4.11.23 Munich SA Column',
    clueInsight:
      'Loupe Clue Verified: Notice the conservative Bavarian officials watching on the left—once released from gunpoint, Bavarian state police crushed Hitler’s march, yet sympathetic judges spared him!',
    taskWhat:
      'Zoom into the November 1923 Munich photograph, then identify why Hitler’s armed putsch failed in 24 hours—yet gave the Nazi Party its winning long-term strategy!',
    taskWhy:
      'Munich taught Hitler that he could never seize power against the German army by force; instead, he pivoted to destroying democracy legally through elections.',
    caseRecordTitle: '1924 Landsberg Trial & Legal Strategy',
    caseRecordSummary:
      'Sympathetic judges gave Hitler just 9 months in Landsberg, where he wrote Mein Kampf and switched from armed coups to ballot-box legality.',
    telegram:
      'BAVARIA FLASH: Adolf Hitler, General Ludendorff & 600 SA stormtroopers burst into the Bürgerbräukeller beer hall, waving a pistol at Bavarian leaders Kahr, Lossow & Seisser! Now 2,000 Nazis are marching toward Munich’s Odeonsplatz!',
    prompt: 'Why does Hitler’s armed putsch collapse in minutes—yet turn into a long-term propaganda gift for the NSDAP?',
    options: [
      {
        label:
          'Kahr alerts the Bavarian state police/army (killing 16 Nazis)—yet sympathetic right-wing judges give Hitler just 5 years in comfy Landsberg Prison (serving 9 months to write Mein Kampf & pivot to winning power LEGALLY)!',
        correct: true,
        stabilityDelta: +10,
        verdict:
          '⚖️ EXACTLY RIGHT! Short-term humiliation for Hitler, long-term wake-up call: he reorganises the NSDAP (Bamberg 1926, Gauleiters, SS, Hitler Youth) to destroy democracy through the ballot box!',
        examNote:
          'Edexcel 12/16-Mark Key Insight: The Munich Putsch failed militarily due to lack of army/public support, yet gave Hitler nationwide trial headlines, Mein Kampf, and the legal strategy.',
      },
      {
        label: 'Right-wing judges sentence Hitler to life imprisonment without visitors or paper',
        correct: false,
        stabilityDelta: -15,
        verdict:
          '❌ If only! Judge Georg Neithardt admired Hitler’s nationalism—Ludendorff walked free and Hitler got a sunlit room with flowers and visitors!',
        examNote: 'Under Weimar law treason carried a life sentence, yet right-wing judicial bias let Hitler out after just 9 months.',
      },
      {
        label: 'The German army joins Hitler and marches straight to Berlin in 1923',
        correct: false,
        stabilityDelta: -25,
        verdict: '❌ Unlike Mussolini’s March on Rome, Lossow and the Bavarian army stayed loyal to the state once released from gunpoint!',
        examNote: 'Ernst Röhm failed to secure the Munich army barracks and telephone exchange, allowing Kahr to mobilise armed police.',
      },
    ],
  },
  {
    id: 'golden_1924',
    year: '1924–1929',
    shortTab: '4. Stresemann (1924–29)',
    title: 'Crisis 4: Stresemann’s "Golden Years" — Or Dancing on a Volcano?',
    breadPrice: '0.85 Reichsmark',
    breadAlert: false,
    unemployed: '1.3m',
    leftThreat: 20,
    rightThreat: 22,
    plateImg: '/images/upgraded/gcse-p3/weimar_l03_banner_locarno_treaties_1925.jpg',
    plateAlt: 'Foreign Minister Gustav Stresemann standing centrally with European delegates at Locarno, October 1925',
    plateCaption:
      'Archival Plate • Foreign Minister Gustav Stresemann (centre) negotiates Germany’s return to international diplomacy at Locarno (October 1925)',
    clueX: 52,
    clueY: 46,
    clueBtnLabel: '🔍 Magnify Stresemann at Locarno',
    clueInsight:
      'Loupe Clue Verified: Stresemann restored German prestige (Dawes 1924, Locarno 1925, League 1926, Young 1929)—yet warned Germany was "dancing on a volcano" of short-term American loans!',
    taskWhat:
      'Magnify Stresemann at Locarno, then select his genuine 1924–1929 diplomatic achievements AND the hidden economic timebomb beneath Weimar recovery!',
    taskWhy:
      'While Nazi support shrank to just 2.6% in 1928, German factories and reparations depended on short-term US Wall Street loans that could be recalled in 90 days.',
    caseRecordTitle: '1924–29 Dawes Plan Wall Street Dependency',
    caseRecordSummary:
      '800 million marks of US loans funded recovery and cut Nazi votes to 2.6%, but tied Weimar’s survival directly to Wall Street.',
    telegram:
      'FOREIGN OFFICE BRIEF: Extremist Nazi vote has shrunk to a tiny 2.6% (12 seats in 1928)! How do you secure reparations relief & international respect—and what hidden timebomb did Stresemann himself warn about?',
    prompt: 'Select Stresemann’s real 1924–29 diplomatic achievements AND his famous "volcano" warning:',
    options: [
      {
        label:
          'Secure 800m mark US loans (Dawes Plan 1924), sign Locarno (1925), join League of Nations (1926) & cut reparations to £2bn (Young Plan 1929)—while warning Germany is "dancing on a volcano" of short-term American Wall Street loans!',
        correct: true,
        stabilityDelta: +15,
        verdict:
          '🌋 SPOT-ON! Bauhaus art, Marlene Dietrich cinema, and 3 million new homes boomed—all balanced precariously on short-term US bank loans that could be recalled in 90 days!',
        examNote:
          'Dawes (1924) & Young (1929) revived German industry, while Locarno (1925) & the League (1926) ended pariah status—yet fatal dependence on US Wall Street credit remained.',
      },
      {
        label: 'Refuse all foreign loans, quit the League of Nations, and ban cinema & Bauhaus architecture',
        correct: false,
        stabilityDelta: -20,
        verdict: '🎭 That’s Goebbels after 1933, not Stresemann in the Golden Twenties!',
        examNote:
          'Weimar culture flourished in 1924–29 (Otto Dix, Fritz Lang’s Metropolis, Walter Gropius’s Bauhaus), though conservatives condemned it as decadent.',
      },
      {
        label: 'Sign the Nazi-Soviet Pact in 1925',
        correct: false,
        stabilityDelta: -20,
        verdict: '📅 Wrong decade! Stresemann signed the Locarno Treaties (western borders) and Berlin Treaty (1926), earning the Nobel Peace Prize!',
        examNote: 'Locarno (1925) voluntarily guaranteed Germany’s western borders with France and Belgium.',
      },
    ],
  },
  {
    id: 'intrigue_1933',
    year: 'OCT 1929 – JAN 1933',
    shortTab: '5. Intrigue (1933)',
    title: 'Crisis 5: Wall Street Crash, 6 Million Unemployed & Backstairs Intrigue!',
    breadPrice: '0.75 RM (No Jobs to Buy It!)',
    breadAlert: true,
    unemployed: '6.1 MILLION!',
    leftThreat: 78,
    rightThreat: 96,
    plateImg: '/images/upgraded/gcse-p3/weimar_l08_banner_papen_schleicher_cabinet_1932.jpg',
    plateAlt: 'Chancellor Franz von Papen seated with his 1932 Cabinet of Barons and General Kurt von Schleicher standing in uniform behind',
    plateCaption:
      'Archival Plate • Chancellor Franz von Papen (seated second left) & General Kurt von Schleicher (standing left in uniform), 1932 "Cabinet of Barons"',
    clueX: 39,
    clueY: 42,
    clueBtnLabel: '🔍 Magnify Papen & Schleicher (1932)',
    clueInsight:
      'Loupe Clue Verified: Neither Papen nor Schleicher commanded a Reichstag majority—their rival backstairs scheming around ageing President Hindenburg opened the Chancellery door to Hitler!',
    taskWhat:
      'Inspect Papen and Schleicher’s 1932 Cabinet photograph under the brass loupe, then uncover why President Hindenburg appointed Hitler Chancellor on 30 January 1933!',
    taskWhy:
      'Hitler NEVER won over 50% in a free election (peaking at 37.3% in July 1932)—conservative elites handed him office believing they could "tame" him.',
    caseRecordTitle: 'Jan 1933 Backstairs Intrigue & Article 48 Habit',
    caseRecordSummary:
      'Years of Article 48 decrees sidelining the Reichstag allowed Von Papen and Hindenburg to appoint Hitler legally behind closed doors.',
    telegram:
      'FINAL SHOWDOWN: Wall Street crashed! US banks recalled German loans! 6 million Germans are jobless! Chancellor Brüning ("The Hunger Chancellor") cut benefits, raised taxes, and ruled via 66 Presidential Article 48 decrees in 1932! Nazis hold 230 Reichstag seats (July 1932)!',
    prompt:
      'Why did President Hindenburg finally appoint Adolf Hitler Chancellor on 30 January 1933 even though Hindenburg despised "the Bohemian corporal"?',
    options: [
      {
        label: 'Hitler won 75% of the vote in a free presidential election',
        correct: false,
        stabilityDelta: -25,
        verdict:
          '📊 EXAM MYTH BUSTED! Hitler LOST the 1932 presidential race to Hindenburg (36.8% vs 53%), and Nazi Reichstag votes actually DIPPED from 230 seats (July) to 196 seats (Nov 1932)!',
        examNote: 'The Nazis NEVER won an overall majority (>50%) in a free Weimar election (peaking at 37.3% in July 1932).',
      },
      {
        label:
          'Backstairs Intrigue! Scheming ex-Chancellor Franz von Papen & industrialists persuaded Hindenburg to appoint Hitler with only 2 other Nazis in Cabinet—boasting "within two months we will have pushed Hitler so far into a corner that he’ll squeak!"',
        correct: true,
        stabilityDelta: +15,
        verdict:
          '🎭 TRAGIC MASTERCLASS! Papen & Hindenburg fatally underestimated Hitler—within weeks came the Reichstag Fire Decree, the Enabling Act, and total dictatorship!',
        examNote:
          'Hitler became Chancellor through Depression mass support (propaganda, SA anti-communism) PLUS elite backstairs intrigue between Papen, Schleicher, and Hindenburg.',
      },
      {
        label: 'The SA overthrew the Reichswehr in a second bloody armed battle in Berlin',
        correct: false,
        stabilityDelta: -20,
        verdict: '❌ No armed coup occurred in January 1933—Hitler walked into the Chancellery completely legally by presidential appointment!',
        examNote: 'Hitler’s legal appointment via Article 53/48 elite manoeuvring fulfilled the post-Landsberg strategy he adopted after 1924.',
      },
    ],
  },
];

function ensureWeimarStyles() {
  if (typeof document === 'undefined' || document.getElementById('wcd-scoped-styles')) return;
  const style = document.createElement('style');
  style.id = 'wcd-scoped-styles';
  style.textContent = `
    .wcd-shell, .wcd-shell * {
      box-sizing: border-box;
    }
    .wcd-shell {
      max-width: 1080px;
      width: 100%;
      margin: 0 auto;
      background: #070b14;
      border: 1.5px solid rgba(245, 158, 11, 0.42);
      border-radius: 16px;
      overflow: hidden;
      color: #f8fafc;
      display: flex;
      flex-direction: column;
      min-height: 640px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.65);
    }
    .wcd-shell.wcd-is-fullscreen {
      position: fixed !important;
      inset: 0 !important;
      z-index: 99995 !important;
      max-width: none !important;
      width: 100vw !important;
      height: 100vh !important;
      height: 100dvh !important;
      border-radius: 0 !important;
      margin: 0 !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
    }
    .wcd-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
      padding: 8px 14px;
      background: #0b1120;
      border-bottom: 1px solid rgba(148, 163, 184, 0.22);
    }
    .wcd-nav-pills {
      display: flex;
      align-items: center;
      gap: 5px;
      flex-wrap: wrap;
    }
    .wcd-step-pill {
      appearance: none;
      border: 1px solid #334155;
      background: #111827;
      color: #cbd5e1;
      font-size: 0.72rem;
      font-weight: 800;
      padding: 5px 10px;
      border-radius: 999px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .wcd-step-pill:hover {
      border-color: #f59e0b;
      color: #fef3c7;
    }
    .wcd-step-pill.is-active {
      background: linear-gradient(135deg, #b45309, #78350f);
      border-color: #fde047;
      color: #ffffff;
    }
    .wcd-step-pill.is-done:not(.is-active) {
      border-color: #10b981;
      color: #6ee7b7;
    }
    .wcd-util-btns {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .wcd-util-btn {
      appearance: none;
      border: 1px solid rgba(251, 191, 36, 0.45);
      background: rgba(15, 23, 42, 0.9);
      color: #fef3c7;
      font-size: 0.73rem;
      font-weight: 800;
      padding: 5px 10px;
      border-radius: 8px;
      cursor: pointer;
    }
    .wcd-util-btn:hover {
      background: rgba(245, 158, 11, 0.2);
    }
    .wcd-body-slot {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .wcd-cover-stage {
      flex: 1;
      display: grid;
      grid-template-columns: minmax(260px, 1.02fr) minmax(300px, 1.18fr);
      gap: 24px;
      align-items: center;
      padding: 24px 26px;
      background:
        radial-gradient(ellipse at 25% 35%, rgba(180, 83, 9, 0.18), transparent 60%),
        linear-gradient(180deg, #080d19 0%, #050811 100%);
    }
    .wcd-cover-plate {
      background: #04070f;
      border: 1.5px solid rgba(245, 158, 11, 0.55);
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 18px 44px rgba(0, 0, 0, 0.75);
    }
    .wcd-cover-plate img {
      width: 100%;
      max-height: 320px;
      object-fit: contain;
      display: block;
    }
    .wcd-cover-cta-primary {
      width: 100%;
      padding: 12px 18px;
      border-radius: 10px;
      border: 1.5px solid #fde047;
      background: linear-gradient(135deg, #d97706 0%, #92400e 100%);
      color: #ffffff;
      font-size: 0.9rem;
      font-weight: 900;
      letter-spacing: 0.03em;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(217, 119, 6, 0.35);
      margin-bottom: 8px;
    }
    .wcd-trail-strip {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 8px;
      padding: 10px 16px;
      background: #050811;
      border-top: 1px solid rgba(245, 158, 11, 0.28);
    }
    .wcd-trail-node {
      background: rgba(15, 23, 42, 0.78);
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 6px 8px;
      font-size: 0.7rem;
      color: #94a3b8;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .wcd-trail-node.is-solved {
      border-color: #10b981;
      color: #d1fae5;
      background: rgba(6, 78, 59, 0.25);
    }
    .wcd-wrap {
      padding: 14px 16px;
      width: 100%;
      flex: 1;
      overflow-x: clip;
    }
    .wcd-main-split {
      display: grid;
      grid-template-columns: minmax(270px, 0.96fr) minmax(300px, 1.14fr);
      gap: 16px;
      align-items: start;
      margin-top: 12px;
    }
    .wcd-meter-bar {
      display: none;
    }
    .wcd-dossier-card {
      background: #111827;
      border: 1.5px solid #334155;
      border-radius: 14px;
      padding: 18px;
      color: #f8fafc;
    }
    .wcd-telegram-brief {
      background: #1c1917;
      border-left: 4px solid #f59e0b;
      border-radius: 8px;
      padding: 10px 13px;
      margin-bottom: 12px;
      font-family: monospace;
      font-size: 0.84rem;
      color: #fef3c7;
      line-height: 1.48;
    }
    .wcd-Loupe-hud-row {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      padding: 8px 10px;
      background: #0b1120;
      border: 1px solid #1e293b;
      border-radius: 10px;
      margin-top: 8px;
      justify-content: space-between;
      align-items: center;
      font-size: 0.75rem;
      font-weight: 800;
    }
    .wcd-clue-toast {
      margin-top: 8px;
      padding: 8px 11px;
      border-radius: 9px;
      background: rgba(6, 78, 59, 0.35);
      border: 1px solid #34d399;
      color: #d1fae5;
      font-size: 0.78rem;
      line-height: 1.4;
    }
    .wcd-opt-btn,
    #wcd-stamp-btn,
    .wcd-shell .arcade-btn-primary {
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }
    @media (max-width: 896px) {
      .wcd-cover-stage,
      .wcd-main-split {
        grid-template-columns: 1fr;
        padding: 14px;
      }
      .wcd-trail-strip {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .wcd-desktop-hud {
        display: none !important;
      }
      .wcd-meter-bar {
        position: sticky;
        top: 0;
        z-index: 25;
        height: 38px;
        display: flex !important;
        align-items: center;
        justify-content: space-between;
        gap: 6px;
        padding: 0 9px;
        margin-bottom: 8px;
        background: rgba(15, 23, 42, 0.96);
        border: 1.5px solid #d97706;
        border-radius: 10px;
      }
      .wcd-meter-pill {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 0.68rem;
        font-weight: 800;
        color: #e2e8f0;
      }
    }
  `;
  document.head.appendChild(style);
}

export function mountWeimarCrisisDesk(stageEl, pools, ctx = {}) {
  ensureWeimarStyles();
  const unitId = ctx.unitId || 'weimar_nazi_germany';

  let mode = 'cover'; // 'cover' | 'prologue' | 'desk' | 'epilogue' | 'summary'
  let cinemaIdx = 0;
  let idx = 0;
  let score = 0;
  let stability = 65;
  let article48Uses = 0;
  let correctCount = 0;
  let answered = null;
  let stampBanner = '';
  let xpAwarded = false;
  let isFullscreen = false;
  let audioMuted = false;
  const solvedDossiers = new Set();
  const inspectedLoupes = new Set();
  let pb = getArcadePersonalBest(unitId, 'weimar_desk', 'all');

  const cinemaVoice = createEscapeCinemaVoicePlayer();

  function wakeWeimarAudio() {
    const aCtx = arcadeAudio.ensureContext();
    if (aCtx) window.__hhRegisterAudioCtx?.(aCtx);
  }

  function toggleFullscreen(forceVal) {
    isFullscreen = typeof forceVal === 'boolean' ? forceVal : !isFullscreen;
    if (typeof document !== 'undefined') {
      if (isFullscreen && document.documentElement.requestFullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else if (!isFullscreen && document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
    render();
  }

  const onFsChange = () => {
    if (typeof document !== 'undefined' && !document.fullscreenElement && isFullscreen) {
      isFullscreen = false;
      render();
    }
  };
  if (typeof document !== 'undefined') {
    document.addEventListener('fullscreenchange', onFsChange);
  }

  function startCinema(targetMode) {
    wakeWeimarAudio();
    mode = targetMode;
    cinemaIdx = 0;
    const clipPrefix = targetMode === 'epilogue' ? 'weimar_end' : 'weimar_pro';
    render();
    cinemaVoice.play(`${clipPrefix}_1`);
  }

  function restart() {
    wakeWeimarAudio();
    cinemaVoice.stop();
    arcadeAudio.levelUp();
    idx = 0;
    score = 0;
    stability = 65;
    article48Uses = 0;
    correctCount = 0;
    answered = null;
    stampBanner = '';
    xpAwarded = false;
    solvedDossiers.clear();
    inspectedLoupes.clear();
    mode = 'desk';
    render();
  }

  function useArticle48Stamp() {
    if (answered) return;
    wakeWeimarAudio();
    article48Uses++;
    stability = Math.max(10, stability - 12);
    arcadeAudio.bomb();
    stampBanner = `
      <div class="tlb-banner err" style="border-color:#f59e0b;color:#fde68a;background:rgba(245,158,11,0.14);padding:8px 12px;margin-top:8px;font-size:0.81rem;">
        📜 <strong>ARTICLE 48 STAMPED (#${article48Uses})!</strong> You bypassed the elected Reichstag by presidential decree &mdash; Weimar democracy lost <strong>&minus;12% legitimacy</strong>!
      </div>
    `;
    render();
  }

  function choosePolicy(optIdx) {
    if (answered) return;
    wakeWeimarAudio();
    const d = CRISIS_DOSSIERS[idx];
    const opt = d.options[optIdx];
    if (!opt) return;

    const qId = generateQuestionId(unitId, d.year, d.prompt);
    stability = Math.max(5, Math.min(100, stability + opt.stabilityDelta));
    solvedDossiers.add(d.id);

    if (opt.correct) {
      correctCount++;
      score += 220 + stability;
      arcadeAudio.correct();
      recordQuestionResult(
        qId,
        true,
        {
          id: qId,
          q: `${d.year}: ${d.prompt}`,
          a: opt.label,
          source: d.title,
          explanation: opt.examNote,
        },
        unitId,
      );
    } else {
      arcadeAudio.wrong();
      const right = d.options.find((o) => o.correct);
      recordQuestionResult(
        qId,
        false,
        {
          id: qId,
          q: `${d.year}: ${d.prompt}`,
          a: right ? right.label : '',
          source: d.title,
          explanation: opt.examNote,
        },
        unitId,
      );
    }

    answered = { opt, optIdx };
    render();
  }

  function renderTrailStripHTML() {
    return `
      <div class="wcd-trail-strip" aria-label="Weimar Chancellery Crisis Trail">
        ${CRISIS_DOSSIERS.map((c, cIdx) => {
          const done = solvedDossiers.has(c.id);
          return `
            <div class="wcd-trail-node ${done ? 'is-solved' : ''}">
              <strong style="color:${done ? '#6ee7b7' : '#fbbf24'};">${done ? '🔓' : '🔒'} Dossier ${cIdx + 1} • ${c.year}</strong>
              <span>${c.shortTab.replace(/^\d+\.\s*/, '')}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function renderTopChromeHTML() {
    const stabColor = stability >= 55 ? '#34d399' : stability >= 35 ? '#fbbf24' : '#f87171';
    const extraBadge = `
      <span style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;background:rgba(15,23,42,0.9);border:1px solid ${stabColor};font-size:0.72rem;font-weight:800;color:${stabColor};">
        🏛️ DEMOCRACY: ${stability}% ${article48Uses > 0 ? `• 📜 Art.48: ${article48Uses}` : ''}
      </span>
    `;
    return `
      ${renderEscapeBrandBarHTML({
        eraTag: 'GCSE • WEIMAR GERMANY (1918–1933)',
        locksCracked: solvedDossiers.size,
        totalLocks: CRISIS_DOSSIERS.length,
        extraBadge,
      })}
      <div class="wcd-topbar">
        <div class="wcd-nav-pills">
          <button type="button" class="wcd-step-pill ${mode === 'cover' ? 'is-active' : ''}" data-wcd-mode="cover">🏛️ Cover</button>
          <button type="button" class="wcd-step-pill ${mode === 'prologue' ? 'is-active' : ''}" data-wcd-cinema="prologue">🎬 Opening</button>
          ${CRISIS_DOSSIERS.map(
            (c, cIdx) => `
              <button type="button" class="wcd-step-pill ${mode === 'desk' && idx === cIdx ? 'is-active' : ''} ${solvedDossiers.has(c.id) ? 'is-done' : ''}" data-wcd-dossier="${cIdx}">
                ${solvedDossiers.has(c.id) ? '✓ ' : ''}${c.shortTab}
              </button>
            `,
          ).join('')}
          <button type="button" class="wcd-step-pill ${mode === 'epilogue' ? 'is-active' : ''}" data-wcd-cinema="epilogue">🎬 1933 Finale</button>
        </div>
        <div class="wcd-util-btns">
          <button type="button" class="wcd-util-btn" id="wcd-audio-btn">
            ${audioMuted ? '🔇 Audio Off' : '🔊 Audio On'}
          </button>
          <button type="button" class="wcd-util-btn" id="wcd-fs-btn">
            ${isFullscreen ? '✕ Exit Full Screen' : '⛶ Full Screen'}
          </button>
        </div>
      </div>
    `;
  }

  function renderCoverBodyHTML() {
    return `
      <div class="wcd-cover-stage">
        <div class="wcd-cover-plate">
          <img src="/images/upgraded/gcse-p3/weimar_l01_banner_berlin_revolution_1918.jpg" alt="November 1918 Berlin street crowd supporting the Ebert-Scheidemann Weimar Republic" />
          <div class="hh-er-cinema-caption">
            Berlin, November 1918 • Citizens rally behind the new Ebert–Scheidemann democratic government amid post-war turmoil
          </div>
        </div>
        <div>
          ${renderEscapeCoverSealHTML('THE HISTORY REVISION HUB • OFFICIAL CRISIS ESCAPE DESK')}
          <div style="font-size:0.74rem;font-weight:900;letter-spacing:0.12em;color:#fbbf24;text-transform:uppercase;margin-bottom:6px;">
            REICH CHANCELLERY SIMULATION • EDEXCEL PAPER 3 (1918–1933)
          </div>
          <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:clamp(1.65rem,2.8vw,2.25rem);margin:0 0 10px 0;color:#fef3c7;line-height:1.12;">
            Chancellor on the Brink: Weimar Crisis Desk
          </h2>
          <p style="color:#cbd5e1;font-size:0.92rem;line-height:1.58;margin:0 0 14px 0;">
            Step behind the Reich Chancellor’s oak desk across five defining crises—from the <strong>1920 Kapp Putsch</strong> and <strong>200-billion-Mark bread in 1923</strong> to <strong>Stresemann’s Wall Street volcano</strong> and <strong>January 1933 backstairs intrigue</strong>. Inspect authentic Weimar photographs under a <strong>2.4× Brass Magnifying Loupe</strong>, resist over-stamping emergency <strong>Article 48</strong>, and unlock your Workbook Verification Code!
          </p>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;">
            <span class="hh-er-era-pill">🔍 2.4× Archival Source Loupe</span>
            <span class="hh-er-era-pill">🍞 Live Bread Hyperinflation Ticker</span>
            <span class="hh-er-era-pill">📜 Article 48 Legitimacy Trap</span>
            <span class="hh-er-era-pill">🎙️ Voiced 1918 &amp; 1933 Cinema</span>
          </div>
          <button type="button" class="wcd-cover-cta-primary" data-wcd-cinema="prologue">
            🎬 WATCH VOICED 1918–1929 CINEMATIC OPENING →
          </button>
          <button type="button" class="hh-er-cover-secondary-cta" data-wcd-mode="desk">
            ⚡ Skip Opening Credits → Enter Chancellery Crisis #1 (March 1920)
          </button>
        </div>
      </div>
      ${renderTrailStripHTML()}
    `;
  }

  function renderCinemaBodyHTML(isEnding) {
    const slides = isEnding ? WEIMAR_EPILOGUE : WEIMAR_PROLOGUE;
    const s = slides[cinemaIdx] || slides[0];
    const isLast = cinemaIdx >= slides.length - 1;

    const actionsHTML = isEnding
      ? `
        ${
          !isLast
            ? `<button type="button" class="wcd-cover-cta-primary" style="width:auto;margin:0;" id="wcd-cinema-next-btn">▶ Next Finale Scene (${cinemaIdx + 2}/${slides.length}) →</button>`
            : `<button type="button" class="wcd-cover-cta-primary" style="width:auto;margin:0;" id="wcd-open-summary-btn">🏆 View Chancellery Verdict &amp; Workbook Code →</button>`
        }
        <button type="button" class="wcd-util-btn" id="wcd-cinema-replay-btn">🔊 Replay Voiceover</button>
      `
      : `
        ${
          !isLast
            ? `<button type="button" class="wcd-cover-cta-primary" style="width:auto;margin:0;" id="wcd-cinema-next-btn">▶ Next Opening Scene (${cinemaIdx + 2}/${slides.length}) →</button>`
            : `<button type="button" class="wcd-cover-cta-primary" style="width:auto;margin:0;" data-wcd-mode="desk">🔑 Enter Chancellery Crisis #1 (March 1920) →</button>`
        }
        <button type="button" class="wcd-util-btn" id="wcd-cinema-replay-btn">🔊 Replay Voiceover</button>
        <button type="button" class="wcd-util-btn" data-wcd-mode="desk">Skip Prologue →</button>
      `;

    return renderAtmosphericCinemaHTML({
      topLeftLabel: isEnding
        ? 'THE HISTORY REVISION HUB • WEIMAR FINALE CINEMA (JANUARY 1933)'
        : 'THE HISTORY REVISION HUB • WEIMAR ARCHIVE CINEMA (1918–1929)',
      topRightLabel: `SCENE ${cinemaIdx + 1} OF ${slides.length} • 🎙️ STUDIO VOICEOVER`,
      slideIndex: cinemaIdx,
      totalSlides: slides.length,
      vignetteTone: s.vignette,
      imgSrc: s.img,
      imgAlt: s.alt,
      caption: s.caption,
      credit: s.credit,
      heading: s.heading,
      narrationHTML: `<p style="margin:0;">${s.narration}</p>`,
      actionsHTML,
      dotAttr: 'data-wcd-cdot',
      extraFooterHTML: renderTrailStripHTML(),
    });
  }

  function renderDeskBodyHTML() {
    const d = CRISIS_DOSSIERS[idx];
    const supportPct = Math.max(8, Math.min(95, 100 - Math.round((d.leftThreat + d.rightThreat) / 2)));
    const econPct = d.breadAlert ? 16 : 78;
    const supCol = supportPct >= 50 ? '#34d399' : supportPct >= 32 ? '#fbbf24' : '#f87171';
    const econCol = econPct >= 50 ? '#38bdf8' : '#f87171';
    const demCol = stability >= 55 ? '#34d399' : stability >= 35 ? '#fbbf24' : '#f87171';
    const loupeId = `wcd-loupe-${d.id}`;
    const clueFound = inspectedLoupes.has(loupeId);

    const caseItems = CRISIS_DOSSIERS.map((item, itemIdx) => ({
      collected: solvedDossiers.has(item.id),
      title: item.caseRecordTitle,
      summary: item.caseRecordSummary,
      lockedLabel: `Cabinet Dossier #${itemIdx + 1} (${item.year})`,
      lockedHint: 'Resolve this Chancellery crisis to file its constitutional evidence.',
    }));

    return `
      <div class="wcd-wrap">
        <div class="wcd-meter-bar" role="status" aria-label="Weimar Republic Stability Meters">
          <div class="wcd-meter-pill"><span>Support</span><strong style="color:${supCol};">${supportPct}%</strong></div>
          <div class="wcd-meter-pill"><span>Economy</span><strong style="color:${econCol};">${econPct}%</strong></div>
          <div class="wcd-meter-pill"><span>Democracy</span><strong style="color:${demCol};">${stability}%</strong></div>
          <span style="font-size:0.68rem;font-weight:900;color:#fde047;">${idx + 1}/${CRISIS_DOSSIERS.length}</span>
        </div>

        <div class="tlb-hud wcd-desktop-hud" style="border-color:#d97706;margin-bottom:10px;">
          <div class="tlb-stat"><span>Chancellor Score</span><strong class="cyan">${score}</strong></div>
          <div class="tlb-stat"><span>Dossier</span><strong class="amber">${idx + 1} / ${CRISIS_DOSSIERS.length} (${d.year})</strong></div>
          <div class="tlb-stat"><span>Support / Econ</span><strong style="color:${supCol};">${supportPct}% / ${econPct}%</strong></div>
          <div class="tlb-stat"><span>Democracy Meter</span><strong style="color:${demCol};">${stability}%</strong></div>
          <div class="tlb-stat"><span>Best</span><strong>${Math.max(pb, score)}</strong></div>
          <button type="button" id="wcd-stamp-btn" ${answered ? 'disabled' : ''} style="background:#7f1d1d;border:1.5px solid #ef4444;color:#fecaca;border-radius:8px;padding:6px 12px;font-size:0.78rem;font-weight:900;cursor:pointer;" title="Bypass the Reichstag by Presidential Decree (-12% Democracy Legitimacy!)">
            📜 Stamp Article 48! (${article48Uses})
          </button>
        </div>

        ${renderTaskDirectiveBannerHTML({
          kicker: `🎯 CHANCELLERY CRISIS #${idx + 1} OF ${CRISIS_DOSSIERS.length} • ${d.year}`,
          whatToDo: d.taskWhat,
          whyItMatters: d.taskWhy,
          solved: Boolean(answered),
        })}

        ${stampBanner}

        <div class="wcd-main-split">
          <div>
            ${renderArchivalLoupeFrameHTML({
              loupeId,
              imgSrc: d.plateImg,
              imgAlt: d.plateAlt,
              caption: d.plateCaption,
              clueX: d.clueX,
              clueY: d.clueY,
              clueButtonLabel: d.clueBtnLabel,
              clueFound,
              clueFoundLabel: '✓ Archival Source Clue Verified',
            })}
            <div class="wcd-Loupe-hud-row">
              <span>🍞 Rye Bread: <strong style="color:${d.breadAlert ? '#f87171' : '#34d399'};font-family:monospace;">${d.breadPrice}</strong></span>
              <span>👷 Unemployed: <strong style="color:${d.breadAlert ? '#fbbf24' : '#cbd5e1'};">${d.unemployed}</strong></span>
              <span>⚖️ KPD ${d.leftThreat}% / Right ${d.rightThreat}%</span>
            </div>
            ${clueFound ? `<div class="wcd-clue-toast">🔎 <strong>${d.clueInsight}</strong></div>` : ''}
          </div>

          <div class="wcd-dossier-card">
            <h3 style="margin:0 0 10px 0;color:#ffffff;font-size:1.16rem;">${d.title}</h3>
            <div class="wcd-telegram-brief">${d.telegram}</div>
            <p style="margin:0 0 12px 0;font-weight:800;color:#f8fafc;">${d.prompt}</p>

            <div class="bsp-options wcd-policy-list">
              ${d.options
                .map((opt, oIdx) => {
                  let cls = '';
                  if (answered) {
                    if (opt.correct) cls = 'right';
                    else if (answered.optIdx === oIdx) cls = 'wrong';
                  }
                  return `
                    <button type="button" class="bsp-opt-btn wcd-opt-btn ${cls}" data-idx="${oIdx}" ${answered ? 'disabled' : ''}>
                      <span class="bsp-key">${String.fromCharCode(65 + oIdx)}</span>
                      <span>${opt.label}</span>
                    </button>
                  `;
                })
                .join('')}
            </div>

            ${
              answered
                ? `
              <div style="margin-top:14px;" class="tlb-banner wcd-verdict-banner ${answered.opt.correct ? 'ok' : 'err'}">
                <strong style="display:block;margin-bottom:6px;">${answered.opt.verdict}</strong>
                <p style="margin:0 0 12px 0;font-size:0.84rem;color:#e2e8f0;">
                  <strong>🎓 Edexcel Paper 3 Exam Takeaway:</strong> ${answered.opt.examNote}
                </p>
                <button type="button" class="arcade-btn-primary" id="wcd-next-btn">
                  ${
                    idx + 1 < CRISIS_DOSSIERS.length
                      ? `Open Crisis #${idx + 2} Telegram (${CRISIS_DOSSIERS[idx + 1].year})`
                      : '🎬 Watch Voiced Jan 1933 Cinematic Finale'
                  }
                  <i class="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            `
                : ''
            }
          </div>
        </div>
      </div>
      ${renderHistoricalCaseFileHTML({
        heading: '📂 REICH CHANCELLERY CABINET CASE FILE — WHY WEIMAR BECAME VULNERABLE BY 1933',
        items: caseItems,
      })}
    `;
  }

  function renderSummaryBodyHTML() {
    wakeWeimarAudio();
    if (!xpAwarded) {
      xpAwarded = true;
      arcadeAudio.levelUp();
      window.hhAwardXp?.({ amount: 30, source: 'weimar_desk', unitId: 'weimar_nazi_germany' });
    }
    const { isNewBest, best } = saveArcadePersonalBest(unitId, 'weimar_desk', 'all', score);
    pb = best;
    const isGold = correctCount >= 4 && article48Uses <= 1;

    return `
      <div class="wcd-wrap" style="display:flex;align-items:center;justify-content:center;padding:24px 16px;">
        <div class="arcade-result-panel" style="max-width:760px;width:100%;margin:0 auto;">
          <div style="font-size:2.6rem;margin-bottom:4px;">${isGold ? '🥇' : isNewBest ? '🏆' : '💼'}</div>
          <div style="display:inline-block;padding:4px 14px;border-radius:999px;background:${isGold ? 'rgba(245,158,11,0.2)' : 'rgba(148,163,184,0.18)'};border:1px solid ${isGold ? '#fde047' : '#94a3b8'};color:${isGold ? '#fef08a' : '#e2e8f0'};font-size:0.74rem;font-weight:900;margin-bottom:8px;">
            ${isGold ? '🥇 GOLD CONSTITUTIONAL HISTORIAN SEAL' : '🥈 SILVER CHANCELLERY HISTORIAN SEAL'}
          </div>
          <h3>Chancellery Term Complete (1918–1933)!</h3>
          <p style="color:#cbd5e1;font-size:0.91rem;max-width:580px;margin:0 auto 14px;">
            ${
              article48Uses >= 2
                ? `You stamped emergency Article 48 ${article48Uses} times—experiencing firsthand how presidential decree rule sidelined the Reichstag before January 1933!`
                : 'You navigated putsches, 200-billion-Mark bread, Stresemann’s US loan volcano, and Von Papen’s fatal 1933 backstairs intrigue!'
            }
          </p>
          <div class="arcade-gameover-stats">
            <div><span>Final Score</span><strong>${score}</strong></div>
            <div><span>Crises Mastered</span><strong>${correctCount} / ${CRISIS_DOSSIERS.length}</strong></div>
            <div><span>Final Democracy</span><strong>${stability}%</strong></div>
            <div><span>Personal Best</span><strong>${best}</strong></div>
          </div>

          <div style="text-align:left;margin:14px 0 18px;">
            ${renderWorkbookCodeCardHTML({
              slotLabel: 'WEIMAR & NAZI GERMANY WORKBOOK • BACK COVER VERDICT LEDGER',
              phrase: 'ARTICLE 48 AND DEPRESSION HOLLOWED WEIMAR DEMOCRACY',
              instruction:
                'Write this exact unlocked verdict phrase into the Escape Room Verdict Ledger on the Back Cover of your Weimar & Nazi Germany Pupil Workbook!',
            })}
          </div>

          <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
            <button type="button" class="wcd-util-btn" data-wcd-cinema="epilogue" style="padding:10px 16px;">
              🎬 Replay Jan 1933 Cinema Finale
            </button>
            <button type="button" class="arcade-btn-primary" id="wcd-replay-btn">
              <i class="fa-solid fa-rotate-right"></i> Take Office Again
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Mount persistent outer shell once so bindArchivalLoupeDelegation works smoothly
  stageEl.innerHTML = `<div class="wcd-shell" id="wcd-root-shell"></div>`;
  const shellEl = stageEl.querySelector('#wcd-root-shell');

  bindArchivalLoupeDelegation(shellEl, (loupeId) => {
    if (!inspectedLoupes.has(loupeId)) {
      inspectedLoupes.add(loupeId);
      score += 25;
      wakeWeimarAudio();
      arcadeAudio.zoom?.();
    }
    render();
  });

  function render() {
    if (!shellEl) return;
    shellEl.classList.toggle('wcd-is-fullscreen', isFullscreen);

    let bodyHTML = '';
    if (mode === 'cover') bodyHTML = renderCoverBodyHTML();
    else if (mode === 'prologue') bodyHTML = renderCinemaBodyHTML(false);
    else if (mode === 'epilogue') bodyHTML = renderCinemaBodyHTML(true);
    else if (mode === 'summary') bodyHTML = renderSummaryBodyHTML();
    else bodyHTML = renderDeskBodyHTML();

    shellEl.innerHTML = `
      ${renderTopChromeHTML()}
      <div class="wcd-body-slot">${bodyHTML}</div>
    `;

    shellEl.querySelector('#wcd-audio-btn')?.addEventListener('click', () => {
      audioMuted = !audioMuted;
      cinemaVoice.setMuted(audioMuted);
      render();
    });

    shellEl.querySelector('#wcd-fs-btn')?.addEventListener('click', () => toggleFullscreen());

    shellEl.querySelectorAll('[data-wcd-mode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        cinemaVoice.stop();
        mode = btn.getAttribute('data-wcd-mode') || 'desk';
        render();
      });
    });

    shellEl.querySelectorAll('[data-wcd-cinema]').forEach((btn) => {
      btn.addEventListener('click', () => {
        startCinema(btn.getAttribute('data-wcd-cinema'));
      });
    });

    shellEl.querySelectorAll('[data-wcd-dossier]').forEach((btn) => {
      btn.addEventListener('click', () => {
        cinemaVoice.stop();
        const nextIdx = parseInt(btn.getAttribute('data-wcd-dossier'), 10);
        if (!Number.isNaN(nextIdx)) {
          idx = nextIdx;
          answered = null;
          stampBanner = '';
          mode = 'desk';
          render();
        }
      });
    });

    shellEl.querySelector('#wcd-cinema-next-btn')?.addEventListener('click', () => {
      const isEnd = mode === 'epilogue';
      const arr = isEnd ? WEIMAR_EPILOGUE : WEIMAR_PROLOGUE;
      cinemaIdx = Math.min(arr.length - 1, cinemaIdx + 1);
      render();
      cinemaVoice.play(`${isEnd ? 'weimar_end' : 'weimar_pro'}_${cinemaIdx + 1}`);
    });

    shellEl.querySelectorAll('[data-wcd-cdot]').forEach((dot) => {
      dot.addEventListener('click', () => {
        cinemaIdx = parseInt(dot.getAttribute('data-wcd-cdot'), 10) || 0;
        const isEnd = mode === 'epilogue';
        render();
        cinemaVoice.play(`${isEnd ? 'weimar_end' : 'weimar_pro'}_${cinemaIdx + 1}`);
      });
    });

    shellEl.querySelector('#wcd-cinema-replay-btn')?.addEventListener('click', () => {
      cinemaVoice.replay();
    });

    shellEl.querySelector('#wcd-open-summary-btn')?.addEventListener('click', () => {
      cinemaVoice.stop();
      mode = 'summary';
      render();
    });

    shellEl.querySelector('#wcd-stamp-btn')?.addEventListener('click', useArticle48Stamp);
    shellEl.querySelectorAll('.wcd-opt-btn').forEach((btn) => {
      btn.addEventListener('click', () => choosePolicy(parseInt(btn.dataset.idx, 10)));
    });
    shellEl.querySelector('#wcd-next-btn')?.addEventListener('click', () => {
      wakeWeimarAudio();
      if (idx + 1 < CRISIS_DOSSIERS.length) {
        idx++;
        answered = null;
        stampBanner = '';
        render();
      } else {
        startCinema('epilogue');
      }
    });
    shellEl.querySelector('#wcd-replay-btn')?.addEventListener('click', restart);
  }

  render();

  return () => {
    cinemaVoice.destroy();
    if (typeof document !== 'undefined') {
      document.removeEventListener('fullscreenchange', onFsChange);
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };
}
