/**
 * generate_cme_condensed_revision_guide.cjs
 *
 * Builds the brand-new ULTRA-CONDENSED 14-page GCSE History Revision Guide:
 *   Conflict in the Middle East, 1945–1995
 *
 *   Page 1      Cover · Revision checklist · Master timeline
 *   Pages 2–13  One page per lesson (all 12 CME lessons)
 *   Page 14     Key treaties & key figures summary
 *
 * Pure condensed notes only – zero model answers, zero exam-practice lines.
 *
 * Usage
 *   node scripts/generate_cme_condensed_revision_guide.cjs [--shots <dir>] [--no-drive] [--force]
 *
 * Outputs
 *   public/pdfs/cme_revision_guide.pdf
 *   G:\My Drive\AAMX\Dep File\...\Conflict in the Middle East Visual Revision & Exam Guide.pdf
 *   PNG screenshot of every page (default: scripts/cme_condensed_guide/qa_screenshots)
 *
 * QA guardrail: aborts (exit 1, no PDF) if any page or any element inside a page overflows / clips,
 * an image fails to load, the page count is not 14, or banned branding / exam-practice text appears.
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const sharp = require('sharp');
const { KT, lessons, timeline, treaties, figures } = require('./cme_condensed_guide/cme_condensed_data.cjs');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const PDF_OUT = path.join(PUBLIC, 'pdfs', 'cme_revision_guide.pdf');
const HTML_OUT = path.join(__dirname, 'cme_condensed_guide', 'cme_revision_guide.html');
const shotsArg = process.argv.indexOf('--shots');
const SHOTS_DIR =
  shotsArg > -1 ? path.resolve(process.argv[shotsArg + 1]) : path.join(__dirname, 'cme_condensed_guide', 'qa_screenshots');
const DRIVE_TARGETS = [
  'G:\\My Drive\\AAMX\\Dep File\\01_Curriculum_and_Key_Stages\\GCSE (Years 10-11)\\Paper 2 - Conflict in the Middle East\\Conflict in the Middle East Visual Revision & Exam Guide.pdf',
];
const TOTAL_PAGES = 14;
const FOOTER_BRAND = 'The History Revision Hub · GCSE History · Conflict in the Middle East, 1945–1995 · Condensed Revision Guide';
const KT_COL = { 1: '#0f766e', 2: '#b91c1c', 3: '#1d4ed8' };
const BANNED = /pearson|edexcel|model answer|exam practice|\[\d+ marks?\]/i;

// ───────────────────────── helpers
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
const ktOfDate = (d) => {
  const yr = parseInt(String(d).match(/\d{4}/)[0], 10);
  return yr <= 1963 ? 1 : yr <= 1973 ? 2 : 3;
};

const imgCache = new Map();
const imgRatio = new Map();
async function img(rel) {
  if (imgCache.has(rel)) return imgCache.get(rel);
  const full = path.join(PUBLIC, rel);
  if (!fs.existsSync(full)) throw new Error(`Image missing: ${full}`);
  let uri;
  if (full.toLowerCase().endsWith('.svg')) {
    // Strip exam-board branding baked into the shared map SVGs (source files untouched).
    const svg = fs
      .readFileSync(full, 'utf8')
      .replace(/EDEXCEL GCSE HISTORY · PAPER 2 CARTOGRAPHY/g, 'GCSE HISTORY · CONFLICT IN THE MIDDLE EAST')
      .replace(/Pearson Edexcel\s*/gi, '')
      .replace(/pearson|edexcel/gi, '');
    if (BANNED.test(svg)) throw new Error(`Branding remains in ${rel}`);
    // Rasterise (filters/drop-shadows in vector maps bloat the PDF massively)
    const buf = await sharp(Buffer.from(svg, 'utf8'), { density: 200 })
      .resize({ width: 1000, withoutEnlargement: false })
      .flatten({ background: '#ffffff' })
      .jpeg({ quality: 85 })
      .toBuffer();
    uri = `data:image/jpeg;base64,${buf.toString('base64')}`;
  } else {
    const buf = await sharp(full)
      .resize({ width: 1100, height: 1100, fit: 'inside', withoutEnlargement: true })
      .flatten({ background: '#ffffff' })
      .jpeg({ quality: 80 })
      .toBuffer();
    uri = `data:image/jpeg;base64,${buf.toString('base64')}`;
  }
  const meta = await sharp(Buffer.from(uri.split(',')[1], 'base64')).metadata();
  imgRatio.set(rel, meta.height / meta.width);
  imgCache.set(rel, uri);
  return uri;
}

const footer = (n) =>
  `<footer class="ftr"><span>${esc(FOOTER_BRAND)}</span><span class="pg">Page ${n} / ${TOTAL_PAGES}</span></footer>`;

// ───────────────────────── styles
const CSS = `
@page { size: A4; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: #e2e8f0; }
body { font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; color: #0f172a; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { width: 794px; height: 1123px; background: #fff; position: relative; overflow: hidden; display: flex; flex-direction: column;
  padding: 20px 24px 0; page-break-after: always; break-after: page; margin: 0 auto; }
.page:last-child { page-break-after: auto; break-after: auto; }
b { font-weight: 800; color: #0b1324; }
.ftr { height: 24px; flex: 0 0 24px; border-top: 1.5px solid #0f172a; margin-top: 8px; display: flex; justify-content: space-between;
  align-items: center; font-size: 8.4px; letter-spacing: .02em; color: #334155; }
.ftr .pg { font-weight: 800; color: #0f172a; }

/* header */
.hdr { display: flex; align-items: stretch; gap: 10px; flex: 0 0 auto; }
.hdr .num { width: 58px; border-radius: 6px; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3px 0; }
.hdr .num small { font-size: 8px; letter-spacing: .14em; font-weight: 700; opacity: .9; line-height: 1.3; }
.hdr .num span { font-size: 25px; font-weight: 900; line-height: 1.2; }
.hdr .tt { flex: 1; min-width: 0; border-bottom: 3px solid currentColor; padding-bottom: 4px; }
.hdr .kt { font-size: 9px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; line-height: 1.3; }
.hdr h1 { font-size: 21px; line-height: 1.18; font-weight: 900; color: #0f172a; margin-top: 1px; }
.hdr .dt { align-self: center; font-size: 11.5px; line-height: 1.3; font-weight: 900; color: #fff; padding: 5px 10px; border-radius: 999px; white-space: nowrap; }

/* cause → event → consequence strip */
.flow { display: grid; grid-template-columns: repeat(4, 1fr); margin-top: 9px; flex: 0 0 auto; }
.flow .st { position: relative; padding: 4px 8px 5px 10px; background: #f1f5f9; border-top: 3px solid var(--c); }
.flow .st:nth-child(even) { background: #e5ecf4; }
.flow .st + .st { padding-left: 19px; }
.flow .st + .st::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%);
  border-top: 13px solid transparent; border-bottom: 13px solid transparent; border-left: 10px solid var(--c); }
.flow .k { font-size: 8.4px; font-weight: 900; letter-spacing: .12em; text-transform: uppercase; color: var(--c); line-height: 1.3; }
.flow .t { font-size: 10.2px; line-height: 1.3; margin-top: 1px; }

/* main body: left text column auto-fits font size (--fs) to fill height exactly */
.main { flex: 1 1 auto; min-height: 0; display: grid; grid-template-columns: 1.62fr 1fr; gap: 12px; margin-top: 9px; overflow: hidden; }
.col-l { --fs: 11px; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; overflow: hidden; }
.sec h2 { font-size: calc(var(--fs) * .95); line-height: 1.3; font-weight: 900; letter-spacing: .06em; text-transform: uppercase; color: #fff;
  padding: 2px 8px; border-radius: 3px; display: inline-block; background: var(--c); }
.sec ul { list-style: none; margin-top: 3px; }
.sec li { font-size: var(--fs); line-height: 1.36; padding-left: 12px; position: relative; margin-bottom: 1.5px; }
.sec li::before { content: ''; position: absolute; left: 2px; top: calc(var(--fs) * .52); width: 5px; height: 5px; border-radius: 1px; background: var(--c); }
.sec.sig { background: #fffbeb; border: 1.5px solid #f59e0b; border-radius: 5px; padding: 5px 8px 4px; }
.sec.sig h2 { background: #b45309; }
.sec.sig li::before { background: #b45309; }
.sec.chron .cg { display: grid; grid-template-columns: 1fr 1fr; gap: 0 10px; margin-top: 3px; border-top: 1.5px solid var(--c); }
.sec.chron .ce { display: grid; grid-template-columns: calc(var(--fs) * 7.2) 1fr; column-gap: 4px; font-size: calc(var(--fs) * .9); line-height: 1.32;
  padding: 1.5px 0; border-bottom: 1px dotted #cbd5e1; }
.sec.chron .ce b { color: var(--c); white-space: nowrap; }
.sec.povs .pg2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 3px; }
.sec.povs .pv { border-radius: 4px; padding: 3px 7px 3px; border: 1px solid #cbd5e1; background: #f8fafc; }
.sec.povs h4 { font-size: calc(var(--fs) * .78); line-height: 1.3; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; color: #334155; }
.sec.povs .pv.a { border-left: 4px solid #2563eb; }
.sec.povs .pv.b { border-left: 4px solid #16a34a; }
.sec.povs .pv li { font-size: calc(var(--fs) * .88); line-height: 1.32; margin: 1px 0 0; padding-left: 10px; }
.sec.povs .pv li::before { top: calc(var(--fs) * .45); width: 4px; height: 4px; background: #475569; }
.boxes { display: grid; grid-template-columns: 1.1fr 1fr; gap: 8px; }
.box { border: 1.5px solid #0f172a; border-radius: 5px; padding: 4px 7px 5px; }
.box h3 { font-size: calc(var(--fs) * .8); line-height: 1.3; font-weight: 900; letter-spacing: .1em; text-transform: uppercase; color: var(--c); margin-bottom: 2px; }
.box div div { font-size: calc(var(--fs) * .86); line-height: 1.3; }
.box div div + div { margin-top: 1.5px; }

.col-r { display: flex; flex-direction: column; gap: 8px; min-height: 0; overflow: hidden; }
.fig { flex: 1 1 0; min-height: 0; display: flex; flex-direction: column; border: 1px solid #cbd5e1; border-radius: 5px; overflow: hidden; background: #f8fafc; }
.fig .im { flex: 1 1 0; min-height: 0; width: 100%; object-fit: cover; display: block; }
.fig .im.contain { object-fit: contain; background: #fff; padding: 3px; }
.fig figcaption { flex: 0 0 auto; font-size: 8.8px; line-height: 1.3; padding: 3px 6px; background: #0f172a; color: #e2e8f0; }
.fig figcaption b { color: #fde68a; }
.stats { flex: 0 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; }
.stat { border: 1.5px solid var(--c); border-radius: 5px; text-align: center; padding: 4px 2px; }
.stat .v { font-size: 14px; font-weight: 900; line-height: 1.25; color: var(--c); white-space: nowrap; }
.stat .l { font-size: 7.8px; line-height: 1.25; color: #334155; margin-top: 1px; }

/* cover */
.cv-top { flex: 0 0 auto; display: grid; grid-template-columns: 1.15fr 1fr; gap: 14px; }
.cv-title { background: #0f172a; color: #fff; border-radius: 8px; padding: 14px 16px; display: flex; flex-direction: column; justify-content: space-between; }
.cv-title .ey { font-size: 9.6px; letter-spacing: .18em; font-weight: 800; color: #fde68a; text-transform: uppercase; line-height: 1.3; }
.cv-title h1 { font-size: 31px; line-height: 1.1; font-weight: 900; margin-top: 6px; }
.cv-title h1 span { display: block; font-size: 22px; line-height: 1.25; color: #93c5fd; margin-top: 2px; }
.cv-title p { font-size: 10.4px; line-height: 1.4; color: #cbd5e1; margin-top: 7px; }
.cv-title p b { color: #fde68a; }
.cv-title .kts { display: flex; flex-direction: column; gap: 4px; margin-top: 8px; }
.cv-title .kts div { font-size: 9.8px; line-height: 1.3; font-weight: 700; padding: 3px 8px; border-left: 4px solid; background: rgba(255,255,255,.06); }
.cv-hero { border-radius: 8px; overflow: hidden; display: flex; flex-direction: column; border: 1px solid #cbd5e1; }
.cv-hero img { flex: 1 1 0; min-height: 0; width: 100%; object-fit: cover; object-position: center 30%; }
.cv-hero figcaption { font-size: 8.8px; line-height: 1.3; padding: 4px 7px; background: #0f172a; color: #e2e8f0; }
.cv-hero figcaption b { color: #fde68a; }
.h-band { flex: 0 0 auto; font-size: 11px; line-height: 1.3; font-weight: 900; letter-spacing: .12em; text-transform: uppercase; border-bottom: 2.5px solid #0f172a;
  padding-bottom: 2px; margin: 10px 0 5px; display: flex; justify-content: space-between; align-items: flex-end; }
.h-band small { font-size: 8.5px; letter-spacing: .04em; font-weight: 600; text-transform: none; color: #475569; }
table { width: 100%; border-collapse: collapse; flex: 0 0 auto; }
.chk th { font-size: 8.4px; line-height: 1.3; text-transform: uppercase; letter-spacing: .08em; background: #0f172a; color: #fff; padding: 3px 6px; text-align: left; }
.chk th.c, .chk td.c { text-align: center; width: 30px; }
.chk td { font-size: 9.8px; line-height: 1.3; padding: 2px 6px; border-bottom: 1px solid #e2e8f0; }
.chk td.l { font-weight: 900; width: 34px; }
.chk td.p { width: 40px; font-weight: 700; color: #475569; }
.chk td.dd { width: 86px; color: #475569; font-weight: 700; white-space: nowrap; }
.tick { display: inline-block; width: 12px; height: 12px; border: 1.5px solid; border-radius: 3px; vertical-align: middle; }
.tl { --fs: 10px; flex: 1 1 auto; min-height: 0; overflow: hidden; display: grid; grid-auto-flow: column; grid-template-columns: 1fr 1fr; column-gap: 16px; align-content: space-between; }
.tl .ev { display: grid; grid-template-columns: calc(var(--fs) * 8) 1fr; align-items: baseline; border-left: 3px solid; padding: 0 0 0 7px; }
.tl .ev .y { font-size: var(--fs); line-height: 1.3; font-weight: 900; }
.tl .ev .e { font-size: var(--fs); line-height: 1.3; }

/* summary page */
.trt th { font-size: 8.4px; line-height: 1.3; text-transform: uppercase; letter-spacing: .07em; background: #0f172a; color: #fff; padding: 3px 6px; text-align: left; }
.trt td { font-size: 10px; line-height: 1.3; padding: 3px 6px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
.trt tr:nth-child(even) td { background: #f8fafc; }
.trt td.n { font-weight: 900; border-left: 4px solid transparent; white-space: nowrap; }
.trt td.d { font-weight: 800; white-space: nowrap; }
.figs { flex: 1 1 auto; min-height: 0; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: repeat(4, 1fr); gap: 7px 10px; }
.fc { border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden; display: flex; min-height: 0; background: #f8fafc; }
.fc img { flex: 0 0 118px; width: 118px; height: 100%; object-fit: cover; }
.fc .tx { flex: 1; min-width: 0; padding: 5px 8px; display: flex; flex-direction: column; justify-content: center; }
.fc .tx .nm { font-size: 13px; line-height: 1.25; font-weight: 900; color: #0f172a; }
.fc .tx .rl { font-size: 9.6px; line-height: 1.3; font-weight: 700; color: #b45309; margin-bottom: 2px; }
.fc .tx li { list-style: none; font-size: 10.4px; line-height: 1.4; padding-left: 9px; position: relative; }
.fc .tx li::before { content: '▸'; position: absolute; left: 0; color: #475569; font-size: 8px; top: 1px; }
`;

// ───────────────────────── page renderers
async function renderCover() {
  const hero = await img('images/cme_cover.jpg');
  const rows = lessons
    .map(
      (l) => `<tr><td class="l" style="color:${KT_COL[l.kt]}">L${l.n}</td><td>${esc(l.title)}</td>
      <td class="dd">${esc(l.dates)}</td><td class="p">p. ${l.n + 1}</td>
      <td class="c"><span class="tick" style="border-color:#b91c1c"></span></td>
      <td class="c"><span class="tick" style="border-color:#d97706"></span></td>
      <td class="c"><span class="tick" style="border-color:#15803d"></span></td></tr>`,
    )
    .join('');
  const half = Math.ceil(timeline.length / 2);
  const evs = timeline
    .map(([y, e]) => {
      const c = KT_COL[ktOfDate(y)];
      return `<div class="ev" style="border-color:${c}"><span class="y" style="color:${c}">${esc(y)}</span><span class="e">${esc(e)}</span></div>`;
    })
    .join('');
  return `<section class="page" id="p1">
    <div class="cv-top">
      <div class="cv-title">
        <div>
          <div class="ey">GCSE History · Ultra-Condensed Revision Guide</div>
          <h1>Conflict in the Middle East<span>1945–1995</span></h1>
          <p>All 12 lessons on 12 pages. <b>Bold</b> = must-know dates &amp; statistics. Each page runs top-down: <b>cause → event → consequence</b> strip, condensed notes, “why it matters” links, archival photos &amp; maps.</p>
        </div>
        <div class="kts">
          <div style="border-color:#14b8a6">${esc(KT[1])} · L1–4</div>
          <div style="border-color:#ef4444">${esc(KT[2])} · L5–9</div>
          <div style="border-color:#60a5fa">${esc(KT[3])} · L10–12</div>
        </div>
      </div>
      <figure class="cv-hero"><img src="${hero}" alt="Begin, Carter and Sadat">
        <figcaption><b>Begin, Carter &amp; Sadat</b> – the search for peace, Camp David era (1978–79)</figcaption></figure>
    </div>
    <div class="h-band">Revision checklist <small>Tick: <b style="color:#b91c1c">R</b> not yet · <b style="color:#d97706">A</b> nearly · <b style="color:#15803d">G</b> secure</small></div>
    <table class="chk"><thead><tr><th>#</th><th>Lesson</th><th>Dates</th><th>Page</th><th class="c">R</th><th class="c">A</th><th class="c">G</th></tr></thead><tbody>${rows}</tbody></table>
    <div class="h-band">Master timeline 1915–1995 <small>Colour = key topic · read down each column</small></div>
    <div class="tl" data-fit="10.4" style="grid-template-rows:repeat(${half}, auto)">${evs}</div>
    ${footer(1)}
  </section>`;
}

async function renderLesson(l) {
  const c = KT_COL[l.kt];
  const page = l.n + 1;
  const flow = l.flow.map((f) => `<div class="st"><div class="k">${esc(f.k)}</div><div class="t">${md(f.t)}</div></div>`).join('');
  const secs = l.sections
    .map((s) => `<div class="sec"><h2>${esc(s.h)}</h2><ul>${s.b.map((b) => `<li>${md(b)}</li>`).join('')}</ul></div>`)
    .join('');
  const sig = `<div class="sec sig"><h2>Why it matters · links</h2><ul>${l.sig.map((b) => `<li>${md(b)}</li>`).join('')}</ul></div>`;
  const h = Math.ceil(l.chron.length / 2);
  const chCol = (arr) => `<div>${arr.map(([d, e]) => `<div class="ce"><b>${esc(d)}</b><span>${esc(e)}</span></div>`).join('')}</div>`;
  const chron = `<div class="sec chron"><h2>Key chronology</h2><div class="cg">${chCol(l.chron.slice(0, h))}${chCol(l.chron.slice(h))}</div></div>`;
  const povCol = (lab, arr, cls) => `<div class="pv ${cls}"><h4>${lab}</h4><ul>${arr.map((x) => `<li>${md(x)}</li>`).join('')}</ul></div>`;
  const pov = `<div class="sec povs"><h2>Two perspectives</h2><div class="pg2">${povCol('Israeli / Zionist view', l.pov[0], 'a')}${povCol('Arab / Palestinian view', l.pov[1], 'b')}</div></div>`;
  const figs = [];
  // Sizing: maps/documents (contain, not too tall) keep natural aspect – no letterboxing.
  // Of two photos, the wider keeps natural aspect (no crop); exactly one figure absorbs the remaining height.
  const ratios = l.imgs.map((im) => imgRatio.get(im.src));
  const nat = l.imgs.map((im, i) => im.fit === 'contain' && ratios[i] <= 1.25);
  const covers = l.imgs.map((im, i) => i).filter((i) => !nat[i]);
  if (covers.length === 0) nat[nat.length - 1] = false;
  const forced = l.imgs.some((im) => im.natural !== undefined);
  l.imgs.forEach((im, i) => im.natural !== undefined && (nat[i] = im.natural));
  if (!forced && covers.length >= 2) {
    const widest = covers.reduce((a, b) => (ratios[a] <= ratios[b] ? a : b));
    nat[widest] = true;
  }
  for (const [i, im] of l.imgs.entries()) {
    const src = await img(im.src);
    const natural = nat[i];
    const figStyle = natural ? 'flex:0 0 auto' : 'flex:1 1 0';
    const imStyle = natural ? `flex:none;height:auto;aspect-ratio:${(1 / ratios[i]).toFixed(4)}` : '';
    figs.push(
      `<figure class="fig" style="${figStyle}"><img class="im ${im.fit === 'contain' ? 'contain' : ''}" style="object-position:${im.pos || 'center'};${imStyle}" src="${src}" alt=""><figcaption>${md(im.cap)}</figcaption></figure>`,
    );
  }
  const stats = l.stats.map(([v, lb]) => `<div class="stat"><div class="v">${esc(v)}</div><div class="l">${esc(lb)}</div></div>`).join('');
  const fg = l.figures.map(([n, r]) => `<div><b>${esc(n)}</b> – ${esc(r)}</div>`).join('');
  const tg = l.terms.map(([t, d]) => `<div><b>${esc(t)}:</b> ${esc(d)}</div>`).join('');
  return `<section class="page" id="p${page}" style="--c:${c}">
    <header class="hdr" style="color:${c}">
      <div class="num" style="background:${c}"><small>LESSON</small><span>${String(l.n).padStart(2, '0')}</span></div>
      <div class="tt"><div class="kt">${esc(KT[l.kt])}</div><h1>${esc(l.title)}</h1></div>
      <div class="dt" style="background:${c}">${esc(l.dates)}</div>
    </header>
    <div class="flow">${flow}</div>
    <div class="main">
      <div class="col-l" data-fit="13.4">${secs}${chron}${pov}${sig}
        <div class="boxes"><div class="box"><h3>Key figures</h3><div>${fg}</div></div><div class="box"><h3>Key terms</h3><div>${tg}</div></div></div>
      </div>
      <div class="col-r">${figs.join('')}<div class="stats">${stats}</div></div>
    </div>
    ${footer(page)}
  </section>`;
}

async function renderSummary() {
  const rows = treaties
    .map(
      ([n, d, what, res]) =>
        `<tr><td class="n" style="border-left-color:${KT_COL[ktOfDate(d)]}">${esc(n)}</td><td class="d">${esc(d)}</td><td>${esc(what)}</td><td>${esc(res)}</td></tr>`,
    )
    .join('');
  const cards = [];
  for (const f of figures) {
    cards.push(
      `<div class="fc"><img src="${await img(f.img)}" style="object-position:${f.pos || 'center 20%'}" alt="${esc(f.name)}"><div class="tx"><div class="nm">${esc(f.name)}</div><div class="rl">${esc(f.role)}</div><ul>${f.facts.map((x) => `<li>${md(x)}</li>`).join('')}</ul></div></div>`,
    );
  }
  return `<section class="page" id="p14" style="--c:#0f172a">
    <header class="hdr" style="color:#0f172a">
      <div class="num" style="background:#0f172a"><small>SUMMARY</small><span>14</span></div>
      <div class="tt"><div class="kt">Whole course · 1917–1995</div><h1>Key Treaties, Agreements &amp; Figures</h1></div>
      <div class="dt" style="background:#0f172a">1945–1995</div>
    </header>
    <div class="h-band">Key treaties &amp; agreements <small>Colour = key topic</small></div>
    <table class="trt"><thead><tr><th>Agreement</th><th>Date</th><th>What it said</th><th>Consequence</th></tr></thead><tbody>${rows}</tbody></table>
    <div class="h-band">Key figures</div>
    <div class="figs">${cards.join('')}</div>
    ${footer(14)}
  </section>`;
}

// ───────────────────────── auto-fit: largest font that fits each [data-fit] container exactly
async function autoFit(page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-fit]')).map((el) => {
      const max = parseFloat(el.dataset.fit);
      const fits = () => el.scrollHeight <= el.clientHeight;
      let lo = 8,
        hi = max,
        best = lo;
      for (let i = 0; i < 18; i++) {
        const mid = (lo + hi) / 2;
        el.style.setProperty('--fs', mid + 'px');
        if (fits()) {
          best = mid;
          lo = mid;
        } else hi = mid;
      }
      best = Math.floor(best * 20) / 20; // round down to 0.05px for safety
      el.style.setProperty('--fs', best + 'px');
      return { page: el.closest('.page').id, fs: best, ok: fits() };
    }),
  );
}

// ───────────────────────── QA
async function auditLayout(page) {
  return page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.page').forEach((pg, i) => {
      const pr = pg.getBoundingClientRect();
      const issues = [];
      if (pg.scrollHeight > pg.clientHeight || pg.scrollWidth > pg.clientWidth) issues.push(`page scroll ${pg.scrollWidth}x${pg.scrollHeight}`);
      pg.querySelectorAll('*').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (!r.width && !r.height) return;
        const tag = `${el.tagName.toLowerCase()}.${el.className || ''}`;
        if (r.bottom > pr.bottom + 0.5 || r.right > pr.right + 0.5 || r.left < pr.left - 0.5 || r.top < pr.top - 0.5)
          issues.push(`${tag} outside page`);
        if (el.tagName === 'IMG') {
          if (!el.complete || !el.naturalWidth) issues.push('broken image');
          if (r.height < 60) issues.push(`image too small (${Math.round(r.height)}px)`);
          return;
        }
        if (el.clientHeight > 0 && (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1))
          issues.push(`${tag} content overflow ${el.scrollWidth}x${el.scrollHeight} > ${el.clientWidth}x${el.clientHeight} "${(el.textContent || '').trim().slice(0, 40)}"`);
        const p = el.parentElement;
        if (p && p !== pg && !['B', 'SPAN', 'SMALL'].includes(el.tagName)) {
          const q = p.getBoundingClientRect();
          if (r.bottom > q.bottom + 1 || r.right > q.right + 1 || r.left < q.left - 1 || r.top < q.top - 1)
            issues.push(`${tag} escapes parent .${p.className}`);
        }
      });
      // density metric: unused vertical space in the fitted container
      const fit = pg.querySelector('[data-fit]');
      let slack = null;
      if (fit) {
        const kids = Array.from(fit.children);
        const used = kids.reduce((a, k) => a + k.getBoundingClientRect().height, 0);
        slack = Math.round(fit.clientHeight - used);
      }
      out.push({ page: i + 1, issues, slack });
    });
    return out;
  });
}

// ───────────────────────── run
(async () => {
  console.log('🚀 Building ultra-condensed CME Revision Guide (14 pages)…');
  if (lessons.length !== 12) throw new Error(`Expected 12 lessons, got ${lessons.length}`);

  const pages = [await renderCover()];
  for (const l of lessons) pages.push(await renderLesson(l));
  pages.push(await renderSummary());

  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Conflict in the Middle East 1945–1995 · Condensed Revision Guide</title><style>${CSS}</style></head><body>${pages.join('\n')}</body></html>`;
  if (BANNED.test(html.replace(/data:[^"]+/g, ''))) throw new Error('Banned branding / exam-practice text found in HTML');

  fs.mkdirSync(path.dirname(HTML_OUT), { recursive: true });

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--font-render-hinting=none'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
  await page.emulateMediaType('print');
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);

  const fit = await autoFit(page);
  fit.forEach((f) => console.log(`   ↳ auto-fit ${f.page}: ${f.fs}px ${f.ok ? '' : '(DOES NOT FIT)'}`));

  // Save the fitted HTML (inline font sizes baked in) for reference
  fs.writeFileSync(HTML_OUT, await page.content(), 'utf8');

  const report = await auditLayout(page);
  let failed = report.length !== TOTAL_PAGES || fit.some((f) => !f.ok);
  if (report.length !== TOTAL_PAGES) console.error(`❌ Expected ${TOTAL_PAGES} pages, rendered ${report.length}`);
  report.forEach((r) => {
    const s = r.slack === null ? '' : ` · slack ${r.slack}px`;
    if (r.issues.length) {
      failed = true;
      console.error(`❌ Page ${r.page}: ${r.issues.length} issue(s)${s}`);
      r.issues.slice(0, 8).forEach((x) => console.error('     - ' + x));
    } else console.log(`✅ Page ${r.page}: 0 overflow · 0 clipping${s}`);
  });

  fs.mkdirSync(SHOTS_DIR, { recursive: true });
  const els = await page.$$('.page');
  for (let i = 0; i < els.length; i++) {
    await els[i].screenshot({ path: path.join(SHOTS_DIR, `cme_revision_guide_p${String(i + 1).padStart(2, '0')}.png`) });
  }
  console.log(`📸 ${els.length} page screenshots → ${SHOTS_DIR}`);

  if (failed && !process.argv.includes('--force')) {
    await browser.close();
    console.error('❌ Layout QA failed – PDF not written.');
    process.exit(1);
  }

  await page.pdf({ path: PDF_OUT, format: 'A4', printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await browser.close();

  const pdfTxt = fs.readFileSync(PDF_OUT).toString('latin1');
  const pdfPages = (pdfTxt.match(/\/Type\s*\/Page[^s]/g) || []).length;
  console.log(`📕 PDF written: ${PDF_OUT} (${(fs.statSync(PDF_OUT).size / 1e6).toFixed(2)} MB, ${pdfPages} pages)`);
  if (pdfPages !== TOTAL_PAGES) {
    console.error(`❌ PDF has ${pdfPages} pages, expected ${TOTAL_PAGES}`);
    process.exit(1);
  }

  if (process.argv.includes('--no-drive')) return;
  for (const t of DRIVE_TARGETS) {
    try {
      fs.mkdirSync(path.dirname(t), { recursive: true });
      fs.copyFileSync(PDF_OUT, t);
      console.log(`☁️  Synced → ${t}`);
    } catch (e) {
      console.warn(`⚠️  Drive sync failed (${t}): ${e.message}`);
    }
  }
})().catch((e) => {
  console.error('❌', e);
  process.exit(1);
});
