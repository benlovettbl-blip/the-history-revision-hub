/**
 * Visual Showcase Game 3: "Chancellor on the Brink: Weimar Crisis Desk (1919–1933)"
 *
 * Tongue-in-cheek illustrated ministerial crisis simulation for Edexcel GCSE Weimar & Nazi Germany:
 *   - Live Animated SVG Reich Chancellery Desk with Loaf-of-Bread Hyperinflation Ticker
 *     (0.63 Marks -> 160 Marks -> 200,000,000,000 Marks -> 1.00 Rentenmark!)
 *   - Reichstag Democracy Stability Meter + Left/Right Street Violence Thermometers
 *   - Tempting Red "STAMP ARTICLE 48" Emergency Decree Button (solves short-term deadlock while eroding democracy!)
 *
 * 100% Pure Custom Vector SVG Graphics & Animations (Zero AI Images).
 */

import { arcadeAudio, getArcadePersonalBest, saveArcadePersonalBest } from '../arcade_audio.js';
import { generateQuestionId, recordQuestionResult } from '../../storage.js';

const CRISIS_DOSSIERS = [
  {
    year: 'MARCH 1920',
    title: 'Crisis 1: The Kapp Putsch — 5,000 Freikorps March on Berlin!',
    breadPrice: '1.20 Marks',
    breadAlert: false,
    unemployed: '0.4m',
    leftThreat: 45,
    rightThreat: 88,
    telegram: 'URGENT TELEGRAM: Right-wing nationalist Wolfgang Kapp & Freikorps troops furious at Versailles army cuts (100,000 limit) have seized Berlin! General von Seeckt of the Reichswehr just told President Ebert: "Reichswehr does not fire upon Reichswehr!"',
    prompt: 'Your own army refuses to shoot the right-wing rebels! How do you save the Weimar Republic before lunchtime?',
    options: [
      {
        label: 'Call on Berlin’s workers & trade unions to launch a total General Strike—shut off all water, gas, electricity, trains, and trams!',
        correct: true,
        stabilityDelta: +15,
        verdict: '🚋 GENIUS MOVE, CHANCELLOR! Kapp can’t govern a capital city with no electricity, no trams, and no running taps! Within 4 days (100 hours), Wolfgang Kapp flees to Sweden!',
        examNote: 'The March 1920 Kapp Putsch exposed the Reichswehr’s right-wing sympathy, yet Berlin workers paralysed the city via a General Strike to rescue the Republic.',
      },
      {
        label: 'Order the 100,000-man Reichswehr to charge anyway',
        correct: false,
        stabilityDelta: -20,
        verdict: '🪖 Von Seeckt ignored your order and went for coffee! Never forget: the army crushed left-wing Spartacists in 1919, yet refused to fire on right-wing Freikorps in 1920!',
        examNote: 'Crucial Weimar asymmetry: The army and judiciary (judges) punished left-wing rebels harshly while treating right-wing putschists leniently.',
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
    year: 'AUTUMN 1923',
    title: 'Crisis 2: Ruhr Invasion & 200-Billion-Mark Loaf of Bread!',
    breadPrice: '200,000,000,000 Marks!',
    breadAlert: true,
    unemployed: '1.5m',
    leftThreat: 65,
    rightThreat: 85,
    telegram: 'ECONOMIC MELTDOWN: France & Belgium occupied the Ruhr industrial heartland after missed reparations! Printing paper Marks to pay striking workers triggered HYPERINFLATION—thieves just stole a woman’s wheelbarrow and left the piles of cash on the pavement!',
    prompt: 'You are Gustav Stresemann (appointed August 1923). What decisive stabilization package rescues Germany?',
    options: [
      {
        label: 'Print EVEN FASTER 100-trillion-Mark notes so everyone becomes a billionaire!',
        correct: false,
        stabilityDelta: -25,
        verdict: '💸 A cup of coffee doubled in price while the waiter walked from the kitchen to your table! Middle-class savers and pensioners will never forgive Weimar!',
        examNote: 'Hyperinflation wiped out middle-class bank savings and fixed pensions (though borrowers/landowners paid off debts cheaply).',
      },
      {
        label: 'Call off passive resistance in the Ruhr, burn worthless Papiermarks, & launch the strictly limited Rentenmark (later Reichsmark)!',
        correct: true,
        stabilityDelta: +20,
        verdict: '🍞 CURRENCY STABILISED! Bread drops back to 1 Rentenmark! Nationalists call calling off passive resistance a betrayal, yet confidence returns overnight!',
        examNote: 'Stresemann ended passive resistance (Sept 1923), introduced the temporary Rentenmark (Nov 1923, backed by land/industrial mortgages), and established the Reichsbank Reichsmark (1924).',
      },
      {
        label: 'Invade Paris with 100,000 soldiers and zero tanks or aircraft',
        correct: false,
        stabilityDelta: -30,
        verdict: '🏳️ Under the Treaty of Versailles, Germany had 0 tanks, 0 submarines, 0 air force, and a 100,000 army—France had 750,000 troops!',
        examNote: 'Versailles military restrictions made armed resistance to the 1923 Franco-Belgian Ruhr occupation impossible.',
      },
    ],
  },
  {
    year: '8–9 NOV 1923',
    title: 'Crisis 3: Munich Beer Hall Putsch — Hitler Fires Into the Ceiling!',
    breadPrice: '1.00 Rentenmark',
    breadAlert: false,
    unemployed: '1.2m',
    leftThreat: 35,
    rightThreat: 92,
    telegram: 'BAVARIA FLASH: Adolf Hitler, General Ludendorff & 600 SA stormtroopers burst into the Bürgerbräukeller beer hall, waving a pistol at Bavarian leaders Kahr, Lossow & Seisser! Now 2,000 Nazis are marching toward Munich’s Odeonsplatz!',
    prompt: 'Why does Hitler’s armed putsch collapse in minutes—yet turn into a long-term propaganda gift for the NSDAP?',
    options: [
      {
        label: 'Kahr alerts the Bavarian state police/army (killing 16 Nazis)—yet sympathetic right-wing judges give Hitler just 5 years in comfy Landsberg Prison (serving 9 months to write Mein Kampf & pivot to winning power LEGALLY)!',
        correct: true,
        stabilityDelta: +10,
        verdict: '⚖️ EXACTLY RIGHT! Short-term humiliation for Hitler, long-term wake-up call: he reorganises the NSDAP (Bamberg 1926, Gauleiters, SS, Hitler Youth) to destroy democracy through the ballot box!',
        examNote: 'Edexcel 12/16-Mark Key Insight: The Munich Putsch failed militarily due to lack of army/public support, yet gave Hitler nationwide trial headlines, Mein Kampf, and the legal strategy.',
      },
      {
        label: 'Right-wing judges sentence Hitler to life imprisonment without visitors or paper',
        correct: false,
        stabilityDelta: -15,
        verdict: '❌ If only! Judge Georg Neithardt admired Hitler’s nationalism—Ludendorff walked free and Hitler got a sunlit room with flowers and visitors!',
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
    year: '1924–1929',
    title: 'Crisis 4: Stresemann’s "Golden Years" — Or Dancing on a Volcano?',
    breadPrice: '0.85 Reichsmark',
    breadAlert: false,
    unemployed: '1.3m',
    leftThreat: 20,
    rightThreat: 22,
    telegram: 'FOREIGN OFFICE BRIEF: Extremist Nazi vote has shrunk to a tiny 2.6% (12 seats in 1928)! How do you secure reparations relief & international respect—and what hidden timebomb did Stresemann himself warn about?',
    prompt: 'Select Stresemann’s real 1924–29 diplomatic achievements AND his famous "volcano" warning:',
    options: [
      {
        label: 'Secure 800m mark US loans (Dawes Plan 1924), sign Locarno (1925), join League of Nations (1926) & cut reparations to £2bn (Young Plan 1929)—while warning Germany is "dancing on a volcano" of short-term American Wall Street loans!',
        correct: true,
        stabilityDelta: +15,
        verdict: '🌋 SPOT-ON! Bauhaus art, Marlene Dietrich cinema, and 3 million new homes boomed—all balanced precariously on short-term US bank loans that could be recalled in 90 days!',
        examNote: 'Dawes (1924) & Young (1929) revived German industry, while Locarno (1925) & the League (1926) ended pariah status—yet fatal dependence on US Wall Street credit remained.',
      },
      {
        label: 'Refuse all foreign loans, quit the League of Nations, and ban cinema & Bauhaus architecture',
        correct: false,
        stabilityDelta: -20,
        verdict: '🎭 That’s Goebbels after 1933, not Stresemann in the Golden Twenties!',
        examNote: 'Weimar culture flourished in 1924–29 (Otto Dix, Fritz Lang’s Metropolis, Walter Gropius’s Bauhaus), though conservatives condemned it as decadent.',
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
    year: 'OCT 1929 – JAN 1933',
    title: 'Crisis 5: Wall Street Crash, 6 Million Unemployed & Backstairs Intrigue!',
    breadPrice: '0.75 RM (No Jobs to Buy It!)',
    breadAlert: true,
    unemployed: '6.1 MILLION!',
    leftThreat: 78,
    rightThreat: 96,
    telegram: 'FINAL SHOWDOWN: Wall Street crashed! US banks recalled German loans! 6 million Germans are jobless! Chancellor Brüning ("The Hunger Chancellor") cut benefits, raised taxes, and ruled via 66 Presidential Article 48 decrees in 1932! Nazis hold 230 Reichstag seats (July 1932)!',
    prompt: 'Why did President Hindenburg finally appoint Adolf Hitler Chancellor on 30 January 1933 even though Hindenburg despised "the Bohemian corporal"?',
    options: [
      {
        label: 'Hitler won 75% of the vote in a free presidential election',
        correct: false,
        stabilityDelta: -25,
        verdict: '📊 EXAM MYTH BUSTED! Hitler LOST the 1932 presidential race to Hindenburg (36.8% vs 53%), and Nazi Reichstag votes actually DIPPED from 230 seats (July) to 196 seats (Nov 1932)!',
        examNote: 'The Nazis NEVER won an overall majority (>50%) in a free Weimar election (peaking at 37.3% in July 1932).',
      },
      {
        label: 'Backstairs Intrigue! Scheming ex-Chancellor Franz von Papen & industrialists persuaded Hindenburg to appoint Hitler with only 2 other Nazis in Cabinet—boasting "within two months we will have pushed Hitler so far into a corner that he’ll squeak!"',
        correct: true,
        stabilityDelta: +15,
        verdict: '🎭 TRAGIC MASTERCLASS! Papen & Hindenburg fatally underestimated Hitler—within weeks came the Reichstag Fire Decree, the Enabling Act, and total dictatorship!',
        examNote: 'Hitler became Chancellor through Depression mass support (propaganda, SA anti-communism) PLUS elite backstairs intrigue between Papen, Schleicher, and Hindenburg.',
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

function renderWeimarDeskSVG(dossier, stability, article48Uses, answered) {
  const stabColor = stability >= 65 ? '#34d399' : stability >= 40 ? '#fbbf24' : '#f87171';
  return `
    <div class="diorama-viewport">
      <img src="/images/arcade/weimar_desk.webp" alt="Weimar Chancellery Crisis Desk Berlin" class="diorama-img" />
      <div class="diorama-vignette"></div>
      <div class="diorama-candle-glow"></div>

      <!-- Pinned Over Reichstag Dome Window -->
      <div class="diorama-hud-chip" style="left:12px;top:12px;border-color:${stabColor};">
        🏛️ Reichstag Democracy: <span style="color:${stabColor};">${stability}%</span>
        &bull; KPD ${dossier.leftThreat}% / Right ${dossier.rightThreat}%
      </div>

      <div class="diorama-hud-chip" style="right:12px;top:12px;border-color:#f59e0b;color:#fde047;">
        📅 ${dossier.year} &bull; Jobless: ${dossier.unemployed}
      </div>

      <!-- Pinned Directly Over the Wheelbarrow & Loaf of Rye Bread -->
      <div class="diorama-hud-chip" style="left:12px;bottom:12px;border-color:${dossier.breadAlert ? '#ef4444' : '#38bdf8'};background:rgba(10,15,28,0.94);">
        🍞 Loaf of Bread: <span style="color:${dossier.breadAlert ? '#f87171' : '#34d399'};font-family:monospace;font-size:0.88rem;">${dossier.breadPrice}</span>
      </div>

      <!-- Pinned Directly Over the Painted Red Rubber Stamp on the Desk! -->
      ${
        !answered
          ? `
        <button type="button" class="diorama-hotspot wcd-desk-stamp-hotspot" style="left:68%;top:80%;border-color:#ef4444;background:rgba(127,29,29,0.92);color:#fecaca;">
          📜 Stamp Article 48! (${article48Uses})
        </button>
      `
          : ''
      }
    </div>
  `;
}

export function mountWeimarCrisisDesk(stageEl, pools, ctx = {}) {
  const unitId = ctx.unitId || 'weimar_nazi_germany';
  let idx = 0;
  let score = 0;
  let stability = 65;
  let article48Uses = 0;
  let correctCount = 0;
  let answered = null;
  let stampBanner = '';
  let pb = getArcadePersonalBest(unitId, 'weimar_desk', 'all');

  function restart() {
    arcadeAudio.ensureContext();
    arcadeAudio.levelUp();
    idx = 0;
    score = 0;
    stability = 65;
    article48Uses = 0;
    correctCount = 0;
    answered = null;
    stampBanner = '';
    render();
  }

  function useArticle48Stamp() {
    if (answered) return;
    article48Uses++;
    stability = Math.max(10, stability - 12);
    arcadeAudio.bomb();
    stampBanner = `
      <div class="tlb-banner err" style="border-color:#f59e0b;color:#fde68a;background:rgba(245,158,11,0.14);">
        📜 <strong>THUMP! ARTICLE 48 STAMPED (#${article48Uses})!</strong> You bypassed the Reichstag by presidential decree—convenient today, yet Weimar democracy just lost <strong>-12% legitimacy</strong> (just like Brüning in 1930–32)!
      </div>
    `;
    render();
  }

  function choosePolicy(optIdx) {
    if (answered) return;
    const d = CRISIS_DOSSIERS[idx];
    const opt = d.options[optIdx];
    if (!opt) return;

    const qId = generateQuestionId(unitId, d.year, d.prompt);
    stability = Math.max(5, Math.min(100, stability + opt.stabilityDelta));

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

  function render() {
    if (idx >= CRISIS_DOSSIERS.length) {
      renderSummary();
      return;
    }
    const d = CRISIS_DOSSIERS[idx];

    stageEl.innerHTML = `
      <div style="max-width:920px;margin:0 auto;">
        <div class="tlb-hud" style="border-color:#d97706;">
          <div class="tlb-stat"><span>Chancellor Score</span><strong class="cyan">${score}</strong></div>
          <div class="tlb-stat"><span>Dossier</span><strong class="amber">${idx + 1} / ${CRISIS_DOSSIERS.length} (${d.year})</strong></div>
          <div class="tlb-stat"><span>Democracy Meter</span><strong style="color:${stability >= 50 ? '#34d399' : '#f87171'};">${stability}%</strong></div>
          <div class="tlb-stat"><span>Best</span><strong>${Math.max(pb, score)}</strong></div>
          <button type="button" id="wcd-stamp-btn" ${answered ? 'disabled' : ''} style="background:#7f1d1d;border:1.5px solid #ef4444;color:#fecaca;border-radius:8px;padding:6px 12px;font-size:0.78rem;font-weight:900;cursor:pointer;">
            📜 Stamp Article 48!
          </button>
        </div>

        ${stampBanner}

        <div style="margin-bottom:14px;">
          ${renderWeimarDeskSVG(d, stability, article48Uses, Boolean(answered))}
        </div>

        <div style="background:#111827;border:1.5px solid #334155;border-radius:16px;padding:20px;">
          <h3 style="margin:0 0 10px 0;color:#ffffff;font-size:1.2rem;">${d.title}</h3>
          <div style="background:#1c1917;border-left:4px solid #f59e0b;border-radius:8px;padding:11px 14px;margin-bottom:14px;font-family:monospace;font-size:0.86rem;color:#fef3c7;line-height:1.5;">
            ${d.telegram}
          </div>

          <p style="margin:0 0 12px 0;font-weight:800;color:#f8fafc;">${d.prompt}</p>

          <div class="bsp-options">
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
            <div style="margin-top:16px;" class="tlb-banner ${answered.opt.correct ? 'ok' : 'err'}">
              <strong style="display:block;margin-bottom:6px;">${answered.opt.verdict}</strong>
              <p style="margin:0 0 12px 0;font-size:0.85rem;color:#e2e8f0;">
                <strong>🎓 Edexcel Paper 3 Exam Takeaway:</strong> ${answered.opt.examNote}
              </p>
              <button type="button" class="arcade-btn-primary" id="wcd-next-btn">
                ${idx + 1 < CRISIS_DOSSIERS.length ? 'Open Next Crisis Telegram' : 'View Chancellery Career Verdict'} <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          `
              : ''
          }
        </div>
      </div>
    `;

    stageEl.querySelector('#wcd-stamp-btn')?.addEventListener('click', useArticle48Stamp);
    stageEl.querySelector('.wcd-desk-stamp-hotspot')?.addEventListener('click', useArticle48Stamp);
    stageEl.querySelectorAll('.wcd-opt-btn').forEach((btn) => {
      btn.addEventListener('click', () => choosePolicy(parseInt(btn.dataset.idx, 10)));
    });
    stageEl.querySelector('#wcd-next-btn')?.addEventListener('click', () => {
      idx++;
      answered = null;
      stampBanner = '';
      render();
    });
  }

  function renderSummary() {
    arcadeAudio.levelUp();
    const { isNewBest, best } = saveArcadePersonalBest(unitId, 'weimar_desk', 'all', score);
    pb = best;

    stageEl.innerHTML = `
      <div class="arcade-result-panel" style="max-width:720px;margin:0 auto;">
        <div style="font-size:2.8rem;margin-bottom:6px;">${isNewBest ? '🏆' : '💼'}</div>
        <h3>Chancellery Term Complete (1919–1933)!</h3>
        <p style="color:#cbd5e1;font-size:0.92rem;max-width:540px;margin:0 auto 14px;">
          ${article48Uses >= 3 ? `You stamped Article 48 ${article48Uses} times—showing firsthand how presidential rule hollowed out Weimar parliamentary democracy!` : 'You steered through putsches, 200-billion-mark bread, US loans, and Depression intrigue!'}
        </p>
        <div class="arcade-gameover-stats">
          <div><span>Final Score</span><strong>${score}</strong></div>
          <div><span>Crises Mastered</span><strong>${correctCount} / ${CRISIS_DOSSIERS.length}</strong></div>
          <div><span>Final Stability</span><strong>${stability}%</strong></div>
          <div><span>Personal Best</span><strong>${best}</strong></div>
        </div>
        <button type="button" class="arcade-btn-primary" id="wcd-replay-btn">
          <i class="fa-solid fa-rotate-right"></i> Take Office Again
        </button>
      </div>
    `;
    stageEl.querySelector('#wcd-replay-btn')?.addEventListener('click', restart);
  }

  render();
  return () => {};
}
