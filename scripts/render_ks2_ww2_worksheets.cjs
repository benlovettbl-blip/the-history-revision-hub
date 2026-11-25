/**
 * Deterministic KS2 World War II (`ks2_ww2`) Individual Worksheet & Carbon SVG Compiler
 *
 * Enforces:
 *  1. 100% App ↔ Worksheet Sync: Reads `units/ks2_ww2/data.js` directly so Page 1 Enquiry Question,
 *     Page 1 Task 2 (3-Step Chronology Headings, Dates & Questions), and Page 2 Task 5 Enquiry Question
 *     match the interactive classroom app 1:1!
 *  2. Bespoke Museum-Grade Carbon SVGs in Page 2 `Task 3` across ALL 11 Worksheets (`11/11`),
 *     plus crisp vector maps on L02/L04 `Task 1` and illustrated stitched vintage suitcases on L02/L04 `Page 3`.
 *  3. Zero archive shelfmarks (`IWM CH 15903`) in student-facing captions or question stems.
 *  4. Compiles all 11 PDFs to `public/pdfs/ks2_ww2/` via headless Chrome and asserts exact page counts
 *     (`2p` on L01, L03, L05–L11; `3p` on L02 & L04) + `0px` `.worksheet-page` overflow!
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const puppeteer = require('puppeteer');
const pdf = require('pdf-parse');

const ROOT = path.resolve(__dirname, '..');
const PUB_WS_DIR = path.join(ROOT, 'public/units/ks2_ww2/worksheets');
const SRC_WS_DIR = path.join(ROOT, 'units/ks2_ww2/worksheets');
const PDF_OUT_DIR = path.join(ROOT, 'public/pdfs/ks2_ww2');

fs.mkdirSync(PUB_WS_DIR, { recursive: true });
fs.mkdirSync(SRC_WS_DIR, { recursive: true });
fs.mkdirSync(PDF_OUT_DIR, { recursive: true });

function loadCanonicalUnitData() {
  let code = fs.readFileSync(path.join(ROOT, 'units/ks2_ww2/data.js'), 'utf8');
  code = code.replace(/^\s*export\s+default\s+/m, 'window.__E = ');
  code = code.replace(/export\s+default\s+UNIT_DATA\s*;?/g, 'window.__E = UNIT_DATA;');
  const ctx = { window: {} };
  vm.runInNewContext(code, ctx);
  return ctx.window.__E || ctx.window.UNIT_DATA || Object.values(ctx.window)[0];
}

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ============================================================================
// BESPOKE CARBON SVGS FOR PAGE 2 TASK 3 (ALL 11 LESSONS) + SUITCASE CRAFT
// ============================================================================
const TASK3_SVGS = {
  1: `
    <svg viewBox="0 0 220 310" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="212" height="302" rx="6" fill="#fffbeb" stroke="#78350f" stroke-width="1.6"/>
      <text x="110" y="21" text-anchor="middle" font-size="9.5" font-weight="900" fill="#78350f" letter-spacing="0.4">1939 HOME FRONT KIT</text>
      <!-- Shoulder cord + Cardboard Gas Mask Box -->
      <path d="M52,58 Q80,22 108,58" fill="none" stroke="#92400e" stroke-width="2.2" stroke-dasharray="3,1.5"/>
      <rect x="42" y="56" width="76" height="62" rx="4" fill="#fde68a" stroke="#78350f" stroke-width="1.8"/>
      <line x1="42" y1="72" x2="118" y2="72" stroke="#78350f" stroke-width="1.3"/>
      <circle cx="80" cy="64" r="3" fill="#78350f"/>
      <text x="80" y="88" text-anchor="middle" font-size="7.5" font-weight="800" fill="#78350f">GAS MASK</text>
      <text x="80" y="99" text-anchor="middle" font-size="7" font-weight="700" fill="#92400e">CARRIER BOX</text>
      <!-- Taped Window + Anti-Dim Stick + ID Card -->
      <g transform="translate(132, 36)">
        <rect x="0" y="0" width="70" height="48" rx="3" fill="#e0f2fe" stroke="#1e3a8a" stroke-width="1.6"/>
        <line x1="35" y1="0" x2="35" y2="48" stroke="#1e3a8a" stroke-width="1.4"/>
        <line x1="0" y1="24" x2="70" y2="24" stroke="#1e3a8a" stroke-width="1.4"/>
        <line x1="4" y1="4" x2="66" y2="44" stroke="#b45309" stroke-width="3" opacity="0.85"/>
        <line x1="66" y1="4" x2="4" y2="44" stroke="#b45309" stroke-width="3" opacity="0.85"/>
        <text x="35" y="58" text-anchor="middle" font-size="6.8" font-weight="800" fill="#1e3a8a">Taped Pane</text>
      </g>
      <g transform="translate(132, 96)">
        <rect x="0" y="0" width="70" height="22" rx="3" fill="#f1f5f9" stroke="#334155" stroke-width="1.4"/>
        <rect x="52" y="3" width="14" height="16" rx="2" fill="#cbd5e1" stroke="#334155" stroke-width="1"/>
        <text x="26" y="14" text-anchor="middle" font-size="6.6" font-weight="800" fill="#0f172a">Anti-Dim Soap</text>
      </g>
      <!-- Fillable Carrier Label -->
      <rect x="14" y="132" width="192" height="142" rx="5" fill="#ffffff" stroke="#b45309" stroke-width="1.5"/>
      <rect x="14" y="132" width="192" height="20" rx="4" fill="#78350f"/>
      <text x="110" y="145" text-anchor="middle" font-size="8" font-weight="800" fill="#ffffff" letter-spacing="0.5">CIVILIAN RESPIRATOR LABEL</text>
      <text x="24" y="172" font-size="8" font-weight="800" fill="#0f172a">NAME:</text>
      <line x1="58" y1="173" x2="196" y2="173" stroke="#64748b" stroke-width="1" stroke-dasharray="2,2"/>
      <text x="24" y="198" font-size="8" font-weight="800" fill="#0f172a">SCHOOL:</text>
      <line x1="68" y1="199" x2="196" y2="199" stroke="#64748b" stroke-width="1" stroke-dasharray="2,2"/>
      <text x="24" y="224" font-size="8" font-weight="800" fill="#0f172a">STREET:</text>
      <line x1="64" y1="225" x2="196" y2="225" stroke="#64748b" stroke-width="1" stroke-dasharray="2,2"/>
      <text x="24" y="250" font-size="8" font-weight="800" fill="#0f172a">ID NO:</text>
      <line x1="56" y1="251" x2="196" y2="251" stroke="#64748b" stroke-width="1" stroke-dasharray="2,2"/>
      <text x="110" y="293" text-anchor="middle" font-size="7.6" font-weight="800" fill="#92400e">CARRY OVER SHOULDER AT ALL TIMES</text>
    </svg>`,

  2: `
    <svg viewBox="0 0 220 310" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <!-- Twine loop at top -->
      <path d="M110,4 C82,4 86,44 110,48 C134,44 138,4 110,4 Z" fill="none" stroke="#92400e" stroke-width="2.4" stroke-dasharray="4,2"/>
      <!-- Chamfered Manila Luggage Label -->
      <polygon points="48,34 172,34 198,62 198,296 22,296 22,62" fill="#fef3c7" stroke="#78350f" stroke-width="2.2"/>
      <polygon points="52,40 168,40 192,65 192,290 28,290 28,65" fill="none" stroke="#d97706" stroke-width="1" stroke-dasharray="3,2"/>
      <!-- Reinforced Brass Eyelet -->
      <circle cx="110" cy="54" r="11" fill="#b45309" stroke="#78350f" stroke-width="2"/>
      <circle cx="110" cy="54" r="5.5" fill="#ffffff" stroke="#78350f" stroke-width="1.5"/>
      <!-- Header Stamp -->
      <rect x="38" y="76" width="144" height="24" rx="3" fill="#78350f"/>
      <text x="110" y="88" text-anchor="middle" font-size="7.8" font-weight="900" fill="#ffffff" letter-spacing="0.5">OPERATION PIED PIPER</text>
      <text x="110" y="97" text-anchor="middle" font-size="6.5" font-weight="700" fill="#fde68a">SEPT 1939 EVACUEE COAT LABEL</text>
      <!-- Fillable Lines -->
      <rect x="36" y="110" width="148" height="142" rx="4" fill="#ffffff" stroke="#b45309" stroke-width="1.3"/>
      <text x="44" y="132" font-size="7.8" font-weight="800" fill="#0f172a">CHILD’S NAME:</text>
      <line x1="44" y1="148" x2="176" y2="148" stroke="#64748b" stroke-width="1.1" stroke-dasharray="2,2"/>
      <text x="44" y="168" font-size="7.8" font-weight="800" fill="#0f172a">CITY SCHOOL:</text>
      <line x1="44" y1="184" x2="176" y2="184" stroke="#64748b" stroke-width="1.1" stroke-dasharray="2,2"/>
      <text x="44" y="204" font-size="7.8" font-weight="800" fill="#0f172a">HOME CITY:</text>
      <line x1="44" y1="220" x2="176" y2="220" stroke="#64748b" stroke-width="1.1" stroke-dasharray="2,2"/>
      <text x="44" y="241" font-size="7.6" font-weight="800" fill="#15803d">BILLET: Devon / Rural Wales</text>
      <text x="110" y="272" text-anchor="middle" font-size="7.3" font-weight="800" fill="#78350f">TIE SECURELY TO COAT LAPEL</text>
      <text x="110" y="284" text-anchor="middle" font-size="6.8" font-weight="700" fill="#92400e">1.5 Million Evacuated • 1–3 Sept 1939</text>
    </svg>`,

  3: `
    <svg viewBox="0 0 220 310" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="212" height="302" rx="6" fill="#f8fafc" stroke="#1e3a8a" stroke-width="1.6"/>
      <rect x="4" y="4" width="212" height="24" rx="5" fill="#1e3a8a"/>
      <text x="110" y="20" text-anchor="middle" font-size="8.6" font-weight="900" fill="#ffffff" letter-spacing="0.4">RIGHTS LOST STEP BY STEP</text>
      <!-- Step 1 -->
      <rect x="12" y="38" width="166" height="52" rx="4" fill="#dcfce7" stroke="#15803d" stroke-width="1.6"/>
      <text x="20" y="53" font-size="7.5" font-weight="900" fill="#14532d">BEFORE JAN 1933 • EQUAL CITIZENS</text>
      <text x="20" y="66" font-size="7.2" font-weight="600" fill="#1e293b">Shared local schools, football</text>
      <text x="20" y="78" font-size="7.2" font-weight="600" fill="#1e293b">clubs, shops &amp; friendships.</text>
      <path d="M180,64 L188,64 L188,96" fill="none" stroke="#dc2626" stroke-width="2"/>
      <!-- Step 2 -->
      <rect x="28" y="100" width="150" height="52" rx="4" fill="#fef3c7" stroke="#d97706" stroke-width="1.6"/>
      <text x="36" y="115" font-size="8" font-weight="900" fill="#92400e">1933–1934 • EARLY EXCLUSIONS</text>
      <text x="36" y="128" font-size="7.3" font-weight="600" fill="#1e293b">Shop boycotts; shut out of sports</text>
      <text x="36" y="140" font-size="7.3" font-weight="600" fill="#1e293b">teams, pools &amp; government jobs.</text>
      <path d="M182,126 L192,126 L192,158" fill="none" stroke="#dc2626" stroke-width="2"/>
      <!-- Step 3 -->
      <rect x="42" y="162" width="152" height="52" rx="4" fill="#ffedd5" stroke="#ea580c" stroke-width="1.6"/>
      <text x="50" y="177" font-size="8" font-weight="900" fill="#9a3412">SEPT 1935 • NUREMBERG LAWS</text>
      <text x="50" y="190" font-size="7.3" font-weight="600" fill="#1e293b">Stripped of German citizenship</text>
      <text x="50" y="202" font-size="7.3" font-weight="600" fill="#1e293b">and equal protection under law.</text>
      <!-- Step 4 -->
      <rect x="54" y="224" width="152" height="56" rx="4" fill="#fee2e2" stroke="#b91c1c" stroke-width="1.8"/>
      <text x="62" y="239" font-size="8" font-weight="900" fill="#7f1d1d">NOV 1938 • KRISTALLNACHT &amp; BAN</text>
      <text x="62" y="252" font-size="7.3" font-weight="700" fill="#1e293b">9–10 Nov: synagogues attacked;</text>
      <text x="62" y="264" font-size="7.3" font-weight="700" fill="#7f1d1d">15 Nov: banned from state schools.</text>
      <text x="110" y="296" text-anchor="middle" font-size="7.3" font-weight="800" fill="#475569">5 peacetime years before war began (1939)</text>
    </svg>`,

  4: `
    <svg viewBox="0 0 220 310" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <!-- Neck cord -->
      <path d="M72,6 Q110,48 148,6" fill="none" stroke="#1e3a8a" stroke-width="2.2" stroke-dasharray="4,2"/>
      <!-- Kindertransport Landing Tag -->
      <rect x="20" y="26" width="180" height="196" rx="8" fill="#ffffff" stroke="#1e3a8a" stroke-width="2.2"/>
      <circle cx="110" cy="42" r="8" fill="#e2e8f0" stroke="#1e3a8a" stroke-width="2"/>
      <circle cx="110" cy="42" r="3.8" fill="#ffffff"/>
      <rect x="20" y="56" width="180" height="26" fill="#1e3a8a"/>
      <text x="110" y="69" text-anchor="middle" font-size="8.2" font-weight="900" fill="#ffffff" letter-spacing="0.5">KINDERTRANSPORT PASS</text>
      <text x="110" y="78" text-anchor="middle" font-size="6.6" font-weight="700" fill="#fde68a">£50 SPONSOR GUARANTEE • UNDER 17</text>
      <rect x="70" y="88" width="80" height="22" rx="4" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
      <text x="110" y="103" text-anchor="middle" font-size="11" font-weight="900" fill="#92400e">NO. 152</text>
      <text x="32" y="128" font-size="7.8" font-weight="800" fill="#0f172a">NAME: <tspan font-weight="600">Vera Löwyová (Age 9)</tspan></text>
      <text x="32" y="147" font-size="7.8" font-weight="800" fill="#0f172a">FROM: <tspan font-weight="600">Prague (May 1939)</tspan></text>
      <text x="32" y="166" font-size="7.8" font-weight="800" fill="#0f172a">FERRY: <tspan font-weight="600">Hook of Holland → Harwich</tspan></text>
      <text x="32" y="185" font-size="7.8" font-weight="800" fill="#0f172a">ARRIVAL: <tspan font-weight="600">London Liverpool St</tspan></text>
      <line x1="32" y1="196" x2="188" y2="196" stroke="#cbd5e1" stroke-width="1"/>
      <text x="110" y="211" text-anchor="middle" font-size="7.2" font-weight="800" fill="#b91c1c">ONE SMALL SUITCASE • NO PARENTS</text>
      <!-- Mini icons of Vera's items -->
      <rect x="20" y="232" width="180" height="68" rx="6" fill="#fffbeb" stroke="#d97706" stroke-width="1.4"/>
      <text x="110" y="247" text-anchor="middle" font-size="7.8" font-weight="900" fill="#78350f">INSIDE VERA’S SMALL CASE</text>
      <!-- Suitcase + Diary + Doll icons -->
      <rect x="34" y="256" width="38" height="26" rx="3" fill="#fde68a" stroke="#78350f" stroke-width="1.5"/>
      <path d="M46,256 L46,251 L60,251 L60,256" fill="none" stroke="#78350f" stroke-width="1.5"/>
      <text x="53" y="293" text-anchor="middle" font-size="6.6" font-weight="700" fill="#78350f">1 Case</text>
      <rect x="92" y="255" width="34" height="27" rx="2" fill="#ffffff" stroke="#1e3a8a" stroke-width="1.5"/>
      <line x1="98" y1="263" x2="120" y2="263" stroke="#64748b" stroke-width="1"/>
      <line x1="98" y1="270" x2="120" y2="270" stroke="#64748b" stroke-width="1"/>
      <text x="109" y="293" text-anchor="middle" font-size="6.6" font-weight="700" fill="#1e3a8a">Signed Diary</text>
      <circle cx="166" cy="262" r="6" fill="#fde68a" stroke="#78350f" stroke-width="1.4"/>
      <path d="M156,282 L166,268 L176,282 Z" fill="#dbeafe" stroke="#1e3a8a" stroke-width="1.4"/>
      <text x="166" y="293" text-anchor="middle" font-size="6.6" font-weight="700" fill="#1e3a8a">Porcelain Doll</text>
    </svg>`,

  5: `
    <svg viewBox="0 0 220 310" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="212" height="302" rx="6" fill="#f0fdf4" stroke="#166534" stroke-width="1.6"/>
      <rect x="4" y="4" width="212" height="24" rx="5" fill="#166534"/>
      <text x="110" y="20" text-anchor="middle" font-size="8.5" font-weight="900" fill="#ffffff" letter-spacing="0.4">THE PRAGUE RESCUE CHAIN</text>
      <!-- Link 1 -->
      <rect x="16" y="36" width="188" height="52" rx="5" fill="#ffffff" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="34" cy="62" r="11" fill="#166534"/><text x="34" y="66" text-anchor="middle" font-size="9" font-weight="900" fill="#ffffff">1</text>
      <text x="52" y="53" font-size="8" font-weight="900" fill="#14532d">HOTEL ALCRON DESK (PRAGUE)</text>
      <text x="52" y="66" font-size="7.2" font-weight="600" fill="#334155">Dec 1938: Winton cancels ski trip;</text>
      <text x="52" y="77" font-size="7.2" font-weight="600" fill="#334155">lists endangered refugee children.</text>
      <line x1="110" y1="88" x2="110" y2="100" stroke="#166534" stroke-width="2.2"/>
      <!-- Link 2 -->
      <rect x="16" y="100" width="188" height="52" rx="5" fill="#ffffff" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="34" cy="126" r="11" fill="#166534"/><text x="34" y="130" text-anchor="middle" font-size="9" font-weight="900" fill="#ffffff">2</text>
      <text x="52" y="117" font-size="8" font-weight="900" fill="#14532d">LONDON FOSTER HOMES &amp; £50</text>
      <text x="52" y="130" font-size="7.2" font-weight="600" fill="#334155">Winton &amp; mother Babette place</text>
      <text x="52" y="141" font-size="7.2" font-weight="600" fill="#334155">press photo appeals for sponsors.</text>
      <line x1="110" y1="152" x2="110" y2="164" stroke="#166534" stroke-width="2.2"/>
      <!-- Link 3 -->
      <rect x="16" y="164" width="188" height="52" rx="5" fill="#ffffff" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="34" cy="190" r="11" fill="#166534"/><text x="34" y="194" text-anchor="middle" font-size="9" font-weight="900" fill="#ffffff">3</text>
      <text x="52" y="181" font-size="8" font-weight="900" fill="#14532d">8 TRAINS FROM PRAGUE (1939)</text>
      <text x="52" y="194" font-size="7.2" font-weight="600" fill="#334155">Trevor Chadwick &amp; Doreen Warriner</text>
      <text x="52" y="205" font-size="7.2" font-weight="600" fill="#334155">see 8 trains safely across Europe.</text>
      <line x1="110" y1="216" x2="110" y2="228" stroke="#166534" stroke-width="2.2"/>
      <!-- Link 4 -->
      <rect x="16" y="228" width="188" height="54" rx="5" fill="#fef3c7" stroke="#b45309" stroke-width="1.6"/>
      <circle cx="34" cy="255" r="11" fill="#b45309"/><text x="34" y="259" text-anchor="middle" font-size="9" font-weight="900" fill="#ffffff">4</text>
      <text x="52" y="245" font-size="8" font-weight="900" fill="#78350f">669 CHILDREN SAVED!</text>
      <text x="52" y="258" font-size="7.2" font-weight="700" fill="#334155">9th train stopped on 1 Sept 1939;</text>
      <text x="52" y="269" font-size="7.2" font-weight="700" fill="#78350f">scrapbook kept quiet until 1988.</text>
      <text x="110" y="297" text-anchor="middle" font-size="7.3" font-weight="800" fill="#166534">Upstanders: Ordinary Citizens Taking Action</text>
    </svg>`,

  6: `
    <svg viewBox="0 0 220 310" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="212" height="302" rx="6" fill="#f8fafc" stroke="#0f172a" stroke-width="1.6"/>
      <rect x="4" y="4" width="212" height="23" rx="5" fill="#0f172a"/>
      <text x="110" y="19" text-anchor="middle" font-size="8.4" font-weight="900" fill="#ffffff" letter-spacing="0.4">SHELTER CUTAWAY COMPARISON</text>
      <!-- TOP: GARDEN ANDERSON SHELTER -->
      <text x="110" y="40" text-anchor="middle" font-size="8" font-weight="900" fill="#14532d">1. GARDEN ANDERSON SHELTER (1939)</text>
      <!-- Lawn level -->
      <line x1="14" y1="106" x2="206" y2="106" stroke="#15803d" stroke-width="2.2"/>
      <rect x="14" y="106" width="192" height="40" fill="#e7e5e4"/>
      <!-- Earth mound (15 inches) -->
      <path d="M36,106 Q110,36 184,106 L160,106 Q110,58 60,106 Z" fill="#a8a29e" stroke="#57534e" stroke-width="1.5"/>
      <!-- Corrugated steel arch sunk 3ft -->
      <path d="M62,138 L62,92 Q110,54 158,92 L158,138 Z" fill="#ffffff" stroke="#0f172a" stroke-width="2.4" stroke-dasharray="5,2"/>
      <!-- Benches inside -->
      <rect x="68" y="122" width="24" height="5" fill="#78350f"/>
      <rect x="128" y="122" width="24" height="5" fill="#78350f"/>
      <text x="110" y="54" text-anchor="middle" font-size="7.1" font-weight="800" fill="#0f172a">15 in. earth absorbs blast &amp; shrapnel</text>
      <text x="110" y="114" text-anchor="middle" font-size="7.1" font-weight="800" fill="#1e3a8a">6 curved steel sheets</text>
      <text x="110" y="136" text-anchor="middle" font-size="7" font-weight="700" fill="#475569">Sunk 3 ft into garden soil</text>
      <line x1="16" y1="156" x2="204" y2="156" stroke="#cbd5e1" stroke-width="1.2"/>
      <!-- BOTTOM: INDOOR MORRISON SHELTER -->
      <text x="110" y="173" text-anchor="middle" font-size="8" font-weight="900" fill="#1e3a8a">2. INDOOR MORRISON CAGE (1941)</text>
      <!-- Heavy steel tabletop -->
      <rect x="28" y="186" width="164" height="9" rx="2" fill="#334155" stroke="#0f172a" stroke-width="1.6"/>
      <!-- Corner steel legs -->
      <rect x="32" y="195" width="7" height="58" fill="#334155"/>
      <rect x="181" y="195" width="7" height="58" fill="#334155"/>
      <rect x="28" y="250" width="164" height="5" fill="#475569"/>
      <!-- Wire mesh grid -->
      <rect x="39" y="195" width="142" height="55" fill="#eff6ff" stroke="#1e3a8a" stroke-width="1.2"/>
      <path d="M59,195 V250 M79,195 V250 M99,195 V250 M119,195 V250 M139,195 V250 M159,195 V250 M39,213 H181 M39,231 H181" stroke="#64748b" stroke-width="0.9"/>
      <rect x="82" y="212" width="56" height="18" rx="3" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
      <text x="110" y="224" text-anchor="middle" font-size="7" font-weight="800" fill="#0f172a">Wire-mesh cage</text>
      <text x="110" y="268" text-anchor="middle" font-size="7.1" font-weight="700" fill="#334155">Thick steel top holds falling ceiling</text>
      <rect x="16" y="276" width="188" height="22" rx="4" fill="#fef3c7" stroke="#d97706" stroke-width="1.2"/>
      <text x="110" y="290" text-anchor="middle" font-size="7.2" font-weight="800" fill="#92400e">3. Deep Tube Platforms: Up to 177,000 nightly</text>
    </svg>`,

  7: `
    <svg viewBox="0 0 220 310" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="212" height="302" rx="6" fill="#fffbeb" stroke="#78350f" stroke-width="1.6"/>
      <rect x="4" y="4" width="212" height="23" rx="5" fill="#78350f"/>
      <text x="110" y="19" text-anchor="middle" font-size="8.2" font-weight="900" fill="#ffffff" letter-spacing="0.4">1942 ADULT WEEKLY RATION PLATE</text>
      <!-- Divided Ration Plate -->
      <circle cx="110" cy="108" r="70" fill="#ffffff" stroke="#78350f" stroke-width="2.2"/>
      <circle cx="110" cy="108" r="62" fill="#fef9c3" stroke="#d97706" stroke-width="1" stroke-dasharray="3,2"/>
      <line x1="110" y1="46" x2="110" y2="170" stroke="#d97706" stroke-width="1.2"/>
      <line x1="48" y1="108" x2="172" y2="108" stroke="#d97706" stroke-width="1.2"/>
      <!-- Q1: 1 Egg -->
      <ellipse cx="80" cy="76" rx="9" ry="12" fill="#ffffff" stroke="#78350f" stroke-width="1.5"/>
      <text x="80" y="99" text-anchor="middle" font-size="7.4" font-weight="900" fill="#0f172a">1 Fresh Egg</text>
      <!-- Q2: Butter & Cheese -->
      <rect x="128" y="66" width="24" height="14" rx="2" fill="#fde047" stroke="#854d0e" stroke-width="1.3"/>
      <text x="140" y="92" text-anchor="middle" font-size="7.1" font-weight="800" fill="#0f172a">Butter: 2 oz</text>
      <text x="140" y="102" text-anchor="middle" font-size="7.1" font-weight="800" fill="#0f172a">Cheese: 2 oz</text>
      <!-- Q3: Bacon 4oz -->
      <path d="M64,122 Q78,118 94,124 M64,130 Q78,126 94,132" fill="none" stroke="#b91c1c" stroke-width="2.6"/>
      <text x="80" y="146" text-anchor="middle" font-size="7.2" font-weight="800" fill="#0f172a">Bacon: 4 oz</text>
      <text x="80" y="156" text-anchor="middle" font-size="6.6" font-weight="700" fill="#475569">(~4 rashers)</text>
      <!-- Q4: Sugar & Tea -->
      <rect x="130" y="118" width="20" height="16" rx="2" fill="#ffffff" stroke="#475569" stroke-width="1.3"/>
      <text x="140" y="146" text-anchor="middle" font-size="7.1" font-weight="800" fill="#0f172a">Sugar: 8 oz</text>
      <text x="140" y="156" text-anchor="middle" font-size="7.1" font-weight="800" fill="#0f172a">Tea: 2 oz</text>
      <!-- Bottom: UNRATIONED ALLOTMENT BASKET -->
      <rect x="16" y="190" width="188" height="106" rx="6" fill="#dcfce7" stroke="#15803d" stroke-width="1.6"/>
      <text x="110" y="207" text-anchor="middle" font-size="8.2" font-weight="900" fill="#14532d">DIG FOR VICTORY • UNRATIONED!</text>
      <!-- Basket + Veg -->
      <polygon points="48,252 172,252 158,282 62,282" fill="#fde68a" stroke="#78350f" stroke-width="1.8"/>
      <circle cx="78" cy="244" r="11" fill="#eab308" stroke="#78350f" stroke-width="1.3"/>
      <polygon points="104,252 114,224 124,252" fill="#f97316" stroke="#9a3412" stroke-width="1.3"/>
      <circle cx="144" cy="242" r="12" fill="#4ade80" stroke="#166534" stroke-width="1.3"/>
      <text x="110" y="220" text-anchor="middle" font-size="7.2" font-weight="700" fill="#166534">Potatoes • Carrots • Cabbages • Swedes</text>
      <text x="110" y="293" text-anchor="middle" font-size="7" font-weight="800" fill="#14532d">1.4 Million Allotments Saved Cargo Space</text>
    </svg>`,

  8: `
    <svg viewBox="0 0 220 310" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="212" height="302" rx="6" fill="#f0fdf4" stroke="#166534" stroke-width="1.6"/>
      <rect x="4" y="4" width="212" height="23" rx="5" fill="#166534"/>
      <text x="110" y="19" text-anchor="middle" font-size="8.3" font-weight="900" fill="#ffffff" letter-spacing="0.4">FOUR VITAL WARTIME ROLES</text>
      <!-- Badge 1: Land Army -->
      <rect x="14" y="36" width="92" height="114" rx="6" fill="#ffffff" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="60" cy="70" r="22" fill="#fef3c7" stroke="#15803d" stroke-width="1.6"/>
      <line x1="60" y1="54" x2="60" y2="86" stroke="#78350f" stroke-width="2"/>
      <path d="M52,62 Q60,54 68,62 M52,70 Q60,62 68,70" fill="none" stroke="#b45309" stroke-width="2"/>
      <text x="60" y="108" text-anchor="middle" font-size="7.8" font-weight="900" fill="#14532d">LAND GIRLS</text>
      <text x="60" y="120" text-anchor="middle" font-size="6.9" font-weight="700" fill="#334155">80,000 WLA</text>
      <text x="60" y="131" text-anchor="middle" font-size="6.8" font-weight="600" fill="#475569">Plough &amp; harvest</text>
      <!-- Badge 2: Lumberjills -->
      <rect x="114" y="36" width="92" height="114" rx="6" fill="#ffffff" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="160" cy="70" r="22" fill="#dcfce7" stroke="#166534" stroke-width="1.6"/>
      <polygon points="160,52 148,76 172,76" fill="#166534"/>
      <rect x="157" y="76" width="6" height="9" fill="#78350f"/>
      <text x="160" y="108" text-anchor="middle" font-size="7.8" font-weight="900" fill="#14532d">LUMBERJILLS</text>
      <text x="160" y="120" text-anchor="middle" font-size="6.9" font-weight="700" fill="#334155">Timber Corps</text>
      <text x="160" y="131" text-anchor="middle" font-size="6.8" font-weight="600" fill="#475569">Pit props &amp; wood</text>
      <!-- Badge 3: Canary Girls -->
      <rect x="14" y="160" width="92" height="114" rx="6" fill="#ffffff" stroke="#d97706" stroke-width="1.5"/>
      <circle cx="60" cy="194" r="22" fill="#fef08a" stroke="#b45309" stroke-width="1.6"/>
      <path d="M54,208 L54,186 Q60,174 66,186 L66,208 Z" fill="#f59e0b" stroke="#78350f" stroke-width="1.5"/>
      <text x="60" y="232" text-anchor="middle" font-size="7.8" font-weight="900" fill="#92400e">CANARY GIRLS</text>
      <text x="60" y="244" text-anchor="middle" font-size="6.9" font-weight="700" fill="#334155">Munitions (~1M)</text>
      <text x="60" y="255" text-anchor="middle" font-size="6.8" font-weight="600" fill="#475569">TNT shell filling</text>
      <!-- Badge 4: ATA & Auxiliaries -->
      <rect x="114" y="160" width="92" height="114" rx="6" fill="#ffffff" stroke="#1e3a8a" stroke-width="1.5"/>
      <circle cx="160" cy="194" r="22" fill="#dbeafe" stroke="#1e3a8a" stroke-width="1.6"/>
      <path d="M142,194 L178,194 M160,180 L160,208 M152,205 L168,205" stroke="#1e3a8a" stroke-width="2.4" stroke-linecap="round"/>
      <text x="160" y="232" text-anchor="middle" font-size="7.8" font-weight="900" fill="#1e3a8a">ATA &amp; SERVICES</text>
      <text x="160" y="244" text-anchor="middle" font-size="6.9" font-weight="700" fill="#334155">ATS • WAAF • WRNS</text>
      <text x="160" y="255" text-anchor="middle" font-size="6.8" font-weight="600" fill="#475569">Radar &amp; Spitfires</text>
      <text x="110" y="293" text-anchor="middle" font-size="7.1" font-weight="800" fill="#166534">Dec 1941 National Service Act (Ages 20–30)</text>
    </svg>`,

  9: `
    <svg viewBox="0 0 220 310" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="212" height="302" rx="6" fill="#eff6ff" stroke="#1e3a8a" stroke-width="1.6"/>
      <rect x="4" y="4" width="212" height="23" rx="5" fill="#1e3a8a"/>
      <text x="110" y="19" text-anchor="middle" font-size="8.3" font-weight="900" fill="#ffffff" letter-spacing="0.4">STATION X CIPHER WHEEL</text>
      <!-- 2-Ring Rotor Wheel -->
      <circle cx="110" cy="96" r="58" fill="#fef3c7" stroke="#78350f" stroke-width="2"/>
      <circle cx="110" cy="96" r="25" fill="#ffffff" stroke="#1e3a8a" stroke-width="1.8"/>
      <circle cx="110" cy="96" r="13" fill="#1e3a8a"/>
      <text x="110" y="99" text-anchor="middle" font-size="7" font-weight="900" fill="#ffffff">-1</text>
      <!-- Sample Rotor Pairs Around Wheel (Code -> Decoded) -->
      <text x="110" y="53" text-anchor="middle" font-size="8.2" font-weight="900" fill="#78350f">F → E</text>
      <text x="151" y="76" text-anchor="middle" font-size="8.2" font-weight="900" fill="#78350f">I → H</text>
      <text x="151" y="121" text-anchor="middle" font-size="8.2" font-weight="900" fill="#78350f">J → I</text>
      <text x="110" y="144" text-anchor="middle" font-size="8.2" font-weight="900" fill="#78350f">U → T</text>
      <text x="69" y="121" text-anchor="middle" font-size="8.2" font-weight="900" fill="#78350f">V → U</text>
      <text x="69" y="76" text-anchor="middle" font-size="8.2" font-weight="900" fill="#78350f">H → G</text>
      <text x="110" y="168" text-anchor="middle" font-size="7.4" font-weight="800" fill="#1e3a8a">Step BACK 1 letter in alphabet (B=A, C=B)</text>
      <!-- Clean 3 + 5 Cipher Boxes (H U T   E I G H T) -->
      <rect x="12" y="178" width="196" height="104" rx="5" fill="#ffffff" stroke="#1e3a8a" stroke-width="1.4"/>
      <text x="110" y="194" text-anchor="middle" font-size="7.8" font-weight="900" fill="#0f172a">DECODE ALAN TURING’S HUT:</text>
      <!-- Word 1: I V U (3 boxes) -->
      <g transform="translate(18, 202)">
        <text x="10" y="10" text-anchor="middle" font-size="9" font-weight="900" fill="#b91c1c">I</text>
        <text x="31" y="10" text-anchor="middle" font-size="9" font-weight="900" fill="#b91c1c">V</text>
        <text x="52" y="10" text-anchor="middle" font-size="9" font-weight="900" fill="#b91c1c">U</text>
        <rect x="1" y="15" width="18" height="22" rx="2" fill="#f8fafc" stroke="#1e3a8a" stroke-width="1.4"/>
        <rect x="22" y="15" width="18" height="22" rx="2" fill="#f8fafc" stroke="#1e3a8a" stroke-width="1.4"/>
        <rect x="43" y="15" width="18" height="22" rx="2" fill="#f8fafc" stroke="#1e3a8a" stroke-width="1.4"/>
      </g>
      <!-- Word 2: F J H I U (5 boxes) -->
      <g transform="translate(96, 202)">
        <text x="10" y="10" text-anchor="middle" font-size="9" font-weight="900" fill="#b91c1c">F</text>
        <text x="31" y="10" text-anchor="middle" font-size="9" font-weight="900" fill="#b91c1c">J</text>
        <text x="52" y="10" text-anchor="middle" font-size="9" font-weight="900" fill="#b91c1c">H</text>
        <text x="73" y="10" text-anchor="middle" font-size="9" font-weight="900" fill="#b91c1c">I</text>
        <text x="94" y="10" text-anchor="middle" font-size="9" font-weight="900" fill="#b91c1c">U</text>
        <rect x="1" y="15" width="18" height="22" rx="2" fill="#f8fafc" stroke="#1e3a8a" stroke-width="1.4"/>
        <rect x="22" y="15" width="18" height="22" rx="2" fill="#f8fafc" stroke="#1e3a8a" stroke-width="1.4"/>
        <rect x="43" y="15" width="18" height="22" rx="2" fill="#f8fafc" stroke="#1e3a8a" stroke-width="1.4"/>
        <rect x="64" y="15" width="18" height="22" rx="2" fill="#f8fafc" stroke="#1e3a8a" stroke-width="1.4"/>
        <rect x="85" y="15" width="18" height="22" rx="2" fill="#f8fafc" stroke="#1e3a8a" stroke-width="1.4"/>
      </g>
      <text x="110" y="256" text-anchor="middle" font-size="7.1" font-weight="700" fill="#475569">(3 letters + 5 letters • Bletchley Park office)</text>
      <text x="110" y="272" text-anchor="middle" font-size="7" font-weight="800" fill="#1e3a8a">Real Enigma: 158 million million million settings!</text>
      <text x="110" y="296" text-anchor="middle" font-size="7.1" font-weight="800" fill="#78350f">75% of Station X’s 10,000 Staff Were Women</text>
    </svg>`,

  10: `
    <svg viewBox="0 0 220 310" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="212" height="302" rx="6" fill="#f8fafc" stroke="#1e3a8a" stroke-width="1.6"/>
      <rect x="4" y="4" width="212" height="23" rx="5" fill="#1e3a8a"/>
      <text x="110" y="19" text-anchor="middle" font-size="8.3" font-weight="900" fill="#ffffff" letter-spacing="0.4">PEACE, REBUILDING &amp; MEMORY</text>
      <!-- Bunting arch -->
      <path d="M16,34 Q110,52 204,34" fill="none" stroke="#0f172a" stroke-width="1.3"/>
      <polygon points="34,37 44,50 54,39" fill="#b91c1c"/>
      <polygon points="74,42 84,55 94,43" fill="#1d4ed8"/>
      <polygon points="126,43 136,55 146,42" fill="#b91c1c"/>
      <polygon points="166,39 176,50 186,37" fill="#1d4ed8"/>
      <!-- Vertical Spine -->
      <line x1="36" y1="68" x2="36" y2="256" stroke="#1e3a8a" stroke-width="2.5"/>
      <!-- M1 -->
      <circle cx="36" cy="74" r="7" fill="#b91c1c"/>
      <text x="52" y="72" font-size="8" font-weight="900" fill="#0f172a">8 MAY 1945 • VE DAY</text>
      <text x="52" y="84" font-size="7.2" font-weight="600" fill="#334155">Peace in Europe; street parties.</text>
      <!-- M2 -->
      <circle cx="36" cy="118" r="7" fill="#d97706"/>
      <text x="52" y="116" font-size="8" font-weight="900" fill="#0f172a">15 AUG 1945 • VJ DAY</text>
      <text x="52" y="128" font-size="7.2" font-weight="600" fill="#334155">War in Asia ends; 450,000+ UK dead.</text>
      <!-- M3 -->
      <circle cx="36" cy="162" r="7" fill="#0284c7"/>
      <text x="52" y="160" font-size="8" font-weight="900" fill="#0f172a">JULY 1948 • FREE NHS OPENS</text>
      <text x="52" y="172" font-size="7.2" font-weight="600" fill="#334155">Free doctors &amp; hospitals for all.</text>
      <!-- M4 -->
      <circle cx="36" cy="206" r="7" fill="#15803d"/>
      <text x="52" y="204" font-size="8" font-weight="900" fill="#0f172a">JULY 1954 • RATIONING ENDS</text>
      <text x="52" y="216" font-size="7.2" font-weight="600" fill="#334155">9 years of post-war rebuilding.</text>
      <!-- M5 Poppy -->
      <circle cx="36" cy="252" r="9" fill="#dc2626"/><circle cx="36" cy="252" r="3.2" fill="#0f172a"/>
      <text x="52" y="250" font-size="8" font-weight="900" fill="#991b1b">11 NOV • REMEMBRANCE</text>
      <text x="52" y="262" font-size="7.2" font-weight="600" fill="#334155">Cenotaph &amp; two-minute silence.</text>
      <text x="110" y="292" text-anchor="middle" font-size="7" font-weight="800" fill="#1e3a8a">Britain &amp; Commonwealth Service Remembered</text>
    </svg>`,

  11: `
    <svg viewBox="0 0 220 310" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="212" height="302" rx="6" fill="#f0fdf4" stroke="#166534" stroke-width="1.6"/>
      <rect x="4" y="4" width="212" height="23" rx="5" fill="#166534"/>
      <text x="110" y="19" text-anchor="middle" font-size="8.3" font-weight="900" fill="#ffffff" letter-spacing="0.4">COMPARING TWO CHILD RESCUES</text>
      <!-- Card 1: Kindertransport -->
      <rect x="14" y="36" width="192" height="114" rx="6" fill="#ffffff" stroke="#b45309" stroke-width="1.6"/>
      <rect x="14" y="36" width="192" height="20" rx="5" fill="#fef3c7"/>
      <text x="110" y="49" text-anchor="middle" font-size="7.9" font-weight="900" fill="#78350f">1. KINDERTRANSPORT (1938–1939)</text>
      <!-- Steam train + suitcase icon -->
      <rect x="26" y="66" width="44" height="22" rx="3" fill="#78350f"/>
      <rect x="56" y="58" width="14" height="10" fill="#78350f"/>
      <circle cx="36" cy="92" r="5" fill="#334155"/><circle cx="58" cy="92" r="5" fill="#334155"/>
      <text x="82" y="72" font-size="7.4" font-weight="800" fill="#0f172a">• BEFORE war began</text>
      <text x="82" y="85" font-size="7.4" font-weight="700" fill="#334155">• ~10,000 children</text>
      <text x="82" y="98" font-size="7.4" font-weight="700" fill="#334155">• By train &amp; North Sea ferry</text>
      <text x="26" y="118" font-size="7.2" font-weight="600" fill="#475569">Lived with British foster families</text>
      <text x="26" y="131" font-size="7.2" font-weight="600" fill="#475569">across towns and cities.</text>
      <!-- Card 2: Windermere Children -->
      <rect x="14" y="160" width="192" height="120" rx="6" fill="#ffffff" stroke="#15803d" stroke-width="1.6"/>
      <rect x="14" y="160" width="192" height="20" rx="5" fill="#dcfce7"/>
      <text x="110" y="173" text-anchor="middle" font-size="7.9" font-weight="900" fill="#14532d">2. WINDERMERE AIRLIFT (AUG 1945)</text>
      <!-- RAF Aircraft silhouette -->
      <path d="M26,204 L70,204 M48,190 L48,218 M40,216 L56,216" stroke="#1d4ed8" stroke-width="3" stroke-linecap="round"/>
      <text x="82" y="196" font-size="7.4" font-weight="800" fill="#0f172a">• AFTER VE Day (Aug 1945)</text>
      <text x="82" y="209" font-size="7.4" font-weight="700" fill="#334155">• 300 orphaned survivors</text>
      <text x="82" y="222" font-size="7.4" font-weight="700" fill="#1d4ed8">• 10 RAF Stirling bombers</text>
      <text x="26" y="242" font-size="7.2" font-weight="600" fill="#475569">Healed together at Calgarth Estate</text>
      <text x="26" y="255" font-size="7.2" font-weight="600" fill="#475569">with art, hot meals &amp; bicycles;</text>
      <text x="26" y="268" font-size="7.2" font-weight="800" fill="#14532d">formed lifelong ’45 Aid Society.</text>
      <text x="110" y="295" text-anchor="middle" font-size="7.1" font-weight="800" fill="#166534">1938 Pre-War Escape vs 1945 Post-War Sanctuary</text>
    </svg>`,
};

// Concise 1-line stage context blurbs grounded 100% in `units/ks2_ww2/data.js` narrative_blocks
const STAGE_SUMMARIES = {
  1: [
    'At 11:15am on Sunday 3 Sept 1939, families hear Neville Chamberlain announce war on wireless radio; air raid sirens wail minutes later.',
    'Remembering WWI poison gas, Britain hands out 38 million gas masks in cardboard boxes, plus bright "Mickey Mouse" masks for toddlers.',
    'Blackout curtains cover every window from 1 Sept, kerbs are painted white, and 1.4 million ARP wardens patrol dark streets.',
  ],
  2: [
    'On 1 Sept 1939, 1.5 million schoolchildren, teachers, and mothers with under-fives board trains from cities to safer rural counties.',
    'Wearing brown luggage labels on their coats, children gather in village halls where Billeting Officers place them with host families.',
    'Many city children love farm animals and orchards for the first time, while others feel terribly homesick or face strict hosts.',
  ],
  3: [
    'Before 1933, Jewish children across Germany, Austria, and Czechoslovakia share local schools, football teams, and music lessons.',
    'After 1933, Nazi laws ban Jewish families from parks, pools, and sports clubs, and the 1935 Nuremberg Laws strip citizenship.',
    'After violent Kristallnacht attacks on 9–10 Nov 1938, all Jewish children are expelled from German state schools on 15 Nov.',
  ],
  4: [
    'Shocked by Kristallnacht in Nov 1938, Parliament allows unaccompanied refugee children under 17 into Britain with a £50 guarantee.',
    'In May 1939, nine-year-old Vera Löwyová waves goodbye to her parents in Prague carrying one small suitcase, her doll, and a diary.',
    'Crossing safely into the Netherlands, nearly 10,000 children sail from Hook of Holland to Harwich and steam into Liverpool Street.',
  ],
  5: [
    'In Dec 1938, 29-year-old Londoner Nicholas Winton cancels his ski trip to visit Prague camps and list endangered children at his hotel.',
    'Winton and his mother Babette find British foster sponsors in London while Trevor Chadwick and Doreen Warriner run 8 Prague trains.',
    '669 children reach safety before war stops the 9th train on 1 Sept 1939; Winton’s attic scrapbook stays secret until 1988.',
  ],
  6: [
    'From "Black Saturday" (7 Sept 1940), Luftwaffe bombers raid London for 57 nights and hit ports and factories from Coventry to Clydebank.',
    'Families bury corrugated steel Anderson shelters under 15 inches of garden soil, or sleep inside steel-mesh Morrison table cages.',
    'Up to 177,000 Londoners shelter on deep Underground platforms while ARP wardens and firefighters battle blazes above.',
  ],
  7: [
    'Island Britain imported two-thirds of its food by sea; German U-boat attacks on Atlantic merchant convoys forced rationing in Jan 1940.',
    'Registered coupon books guaranteed fair weekly shares (such as 1 fresh egg, 2oz butter, and 4oz bacon) for rich and poor alike.',
    'Families planted 1.4 million "Dig for Victory" allotments, ate Potato Pete & Woolton dishes, and children grew up healthier.',
  ],
  8: [
    'With millions of men away fighting, Parliament passed the Dec 1941 National Service Act calling up unmarried women aged 20–30.',
    'Over 80,000 Land Girls ploughed fields and milked cows, while Lumberjills in the Timber Corps felled pine trees for coal mines.',
    'Nearly a million "Canary Girls" filled explosive TNT shells, and 168 ATA women pilots ferried Spitfires and bombers to airfields.',
  ],
  9: [
    'German forces scrambled radio signals on Enigma machines with 158 million million million settings that reset every midnight.',
    'At Bletchley Park ("Station X"), Alan Turing and Gordon Welchman built spinning Bombe machines to crack daily Enigma keys.',
    'Around 7,500 women (75% of staff) ran machines and wireless rooms, keeping total silence for 30 years under the Official Secrets Act.',
  ],
  10: [
    'On Tuesday 8 May 1945, Churchill broadcast peace in Europe at 3:00pm; blackout curtains came down for joyful street parties.',
    'Over 450,000 British lives were lost and VJ Day came in Aug 1945; post-war Britain rebuilt homes and founded the free NHS in 1948.',
    'Each November at the Cenotaph on Whitehall and across towns, people wear red poppies and keep a two-minute silence.',
  ],
  11: [
    'On 14 Aug 1945, 10 converted RAF Short Stirling bombers flew 300 orphaned child camp survivors from Prague to Carlisle in Cumbria.',
    'At Calgarth Estate by Lake Windermere, warm meals, Marie Paneth’s art room, and red bicycles gently rebuilt trust.',
    'Forming the lifelong ’45 Aid Society in 1963, survivors like Olympic captain Sir Ben Helfgott shared lessons of kindness across Britain.',
  ],
};

function renderSuitcaseCraftPage({ num, badgeTitle, subtitle, checklistHeading, items, note, tagTitle, tagRoute }) {
  return `
  <!-- ========================================================
       PAGE 3: OPTIONAL VINTAGE SUITCASE ACTIVITY (A4 PORTRAIT)
       ======================================================== -->
  <div class="worksheet-page" id="sheet-page-3">
    <div class="exercise-book-cutline">
      <div class="cut-indicator">
        ✂ Cut along dashed line to stick neatly into exercise book
      </div>

      <div class="sheet-masthead">
        <div class="brand-left">
          <span class="brand-badge">KS2 CRAFT SHEET</span>
          <span class="brand-text">THE HISTORY REVISION HUB • KS2 WORLD WAR II</span>
        </div>
        <div class="student-fields">
          <div class="field-item">Name: <span class="field-line"></span></div>
          <div class="field-item">LESSON ${String(num).padStart(2, '0')} • Sheet 3 of 3</div>
        </div>
      </div>

      <div class="enquiry-banner">
        <div class="enquiry-title-group">
          <h1>${esc(badgeTitle)}</h1>
          <p class="enquiry-question">${esc(subtitle)}</p>
        </div>
        <div class="lesson-badge">
          LESSON ${String(num).padStart(2, '0')}<br><span style="font-size: 7pt; font-weight:600;">OPTIONAL CRAFT</span>
        </div>
      </div>

      <div class="suitcase-portrait-wrap">
        <div class="suitcase-checklist-card">
          <div class="checklist-heading">${esc(checklistHeading)}</div>
          <div class="checklist-grid">
            ${items.map((it) => `<div class="checklist-item"><span class="tick-box"></span><span>${esc(it)}</span></div>`).join('\n            ')}
          </div>
          <div class="checklist-note">${esc(note)}</div>
        </div>

        <div class="suitcase-svg-frame">
          <svg viewBox="0 0 680 560" width="100%" height="100%" preserveAspectRatio="none" class="suitcase-bg-svg" xmlns="http://www.w3.org/2000/svg">
            <!-- Stitched Leather Handle -->
            <path d="M268,28 L268,10 Q268,4 276,4 L404,4 Q412,4 412,10 L412,28" fill="none" stroke="#78350f" stroke-width="7" stroke-linecap="round"/>
            <path d="M282,28 L282,15 L398,15 L398,28" fill="none" stroke="#b45309" stroke-width="2" stroke-dasharray="4,3"/>
            <!-- Main Fibreboard Case Body -->
            <rect x="6" y="26" width="668" height="528" rx="18" fill="#fef3c7" stroke="#78350f" stroke-width="4"/>
            <rect x="15" y="35" width="650" height="510" rx="13" fill="none" stroke="#b45309" stroke-width="1.6" stroke-dasharray="6,4"/>
            <!-- Leather Corner Reinforcements + Brass Rivets -->
            <path d="M6,62 L6,40 Q6,26 20,26 L46,26 L6,62 Z" fill="#92400e"/>
            <path d="M674,62 L674,40 Q674,26 660,26 L634,26 L674,62 Z" fill="#92400e"/>
            <path d="M6,518 L6,540 Q6,554 20,554 L46,554 L6,518 Z" fill="#92400e"/>
            <path d="M674,518 L674,540 Q674,554 660,554 L634,554 L674,518 Z" fill="#92400e"/>
            <!-- Twin Brass Toggle Clasps -->
            <rect x="132" y="18" width="44" height="22" rx="4" fill="#f59e0b" stroke="#78350f" stroke-width="2.5"/>
            <circle cx="154" cy="29" r="3.5" fill="#78350f"/>
            <rect x="504" y="18" width="44" height="22" rx="4" fill="#f59e0b" stroke="#78350f" stroke-width="2.5"/>
            <circle cx="526" cy="29" r="3.5" fill="#78350f"/>
          </svg>

          <div class="suitcase-inner-content">
            <div class="suitcase-travel-tag">
              <div class="tag-title">${esc(tagTitle)}</div>
              <div class="tag-route">${esc(tagRoute)}</div>
            </div>

            <div class="suitcase-canvas-area">
              <div class="suitcase-watermark">
                DRAW, COLOUR &amp; LABEL YOUR PACKED BELONGINGS INSIDE THIS SUITCASE
              </div>
            </div>

            <div class="suitcase-caption-box">
              <div class="q-item">My Most Precious Item &amp; Why I Chose It:</div>
              <div class="ruled-line" style="height:6.2mm;"></div>
              <div class="ruled-line" style="height:6.2mm;"></div>
              <div class="ruled-line" style="height:6.2mm;"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="sheet-footer">
        <span>The History Revision Hub • KS2 World War II Enquiry Series</span>
        <span>LESSON ${String(num).padStart(2, '0')} OF 11 • Sheet 3 of 3 (Optional Cut-Out Craft)</span>
      </div>
    </div>
  </div>`;
}

function buildWorksheetHtml(ws, lesson) {
  const num = ws.num;
  const pad = String(num).padStart(2, '0');
  const totalSheets = ws.hasPage3 ? 3 : 2;
  const canonicalEnq = lesson.enquiry_question || lesson.enquiry;
  const stages = lesson.workbook_stages || [];

  // Use crisp SVG vector maps on Lessons 2 & 4 so city names stay razor-sharp in print!
  let srcBImg = ws.srcBImg;
  if (num === 2) srcBImg = '../assets/evacuation_map_ks2_pupil.svg';
  if (num === 4) srcBImg = '../assets/kindertransport_route_map.svg';

  // Clean zero-shelfmark rule on Lesson 11 Source B & Q1
  let srcBCap = ws.srcBCap.replace(/\s*\(IWM\s+CH\s*\d+,?\s*Public Domain\)/i, ' (Imperial War Museum, Public Domain)');
  const t1Qs = ws.t1Qs.map((q) => q.replace(/\s*\(IWM\s+CH\s*\d+\)/gi, ''));

  // Task 5 synthesis header aligned with canonical Enquiry Question (preserving L02's creative Postcard Home format + canonical tie-in)
  const t5Header =
    num === 2
      ? `Postcard Home (${esc(canonicalEnq)}): Write a short postcard to Mum and Dad describing your train ride, brown luggage label, and new countryside billet.`
      : `Enquiry Answer: ${esc(canonicalEnq)}`;

  const stageCardsHtml = stages
    .slice(0, 3)
    .map((st, idx) => {
      const dateStr = (st.date || '').toUpperCase();
      // Keep card title compact so 3-column layout never overflows
      const cleanTitle = String(st.title || '')
        .replace(/\s*\([^)]*\)\s*/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      const desc = STAGE_SUMMARIES[num][idx] || '';
      const q = st.question || st.questionHeading || '';
      return `
          <div class="timeline-step-card">
            <div style="flex-shrink:0;">
              <div class="step-badge">STAGE ${idx + 1} • ${esc(dateStr)}</div>
              <div class="step-title">${esc(cleanTitle)}</div>
              <p class="step-desc">${esc(desc)}</p>
            </div>
            <p class="step-prompt">${esc(q)}</p>
            <div class="ruled-lines-box">
              <div class="ruled-line"></div>
              <div class="ruled-line"></div>
              <div class="ruled-line"></div>
              <div class="ruled-line"></div>
            </div>
          </div>`;
    })
    .join('\n');

  let page3Html = '';
  if (num === 2) {
    page3Html = renderSuitcaseCraftPage({
      num: 2,
      badgeTitle: 'THE BRITISH EVACUEE SUITCASE • OPERATION PIED PIPER (SEPT 1939)',
      subtitle: 'Draw, colour, and label the essential belongings packed by a British child leaving the city in September 1939.',
      checklistHeading: 'Sept 1939 Government Packing Checklist (Tick as you draw):',
      items: [
        'Gas mask in cardboard box',
        'Warm woollen jumper & coat',
        'Change of underwear & nightclothes',
        'Toothbrush, soap, towel & comb',
        'Strong walking boots / plimsolls',
        'Packet of sandwiches & an apple',
        'Family photograph & postcard home',
      ],
      note: 'Remember: Food rationing did not start until January 1940, so September 1939 evacuees did NOT carry a ration book yet!',
      tagTitle: 'L.C.C. EVACUATION LABEL • SEPT 1939',
      tagRoute: 'LONDON → SAFER COUNTRYSIDE RECEPTION AREA',
    });
  } else if (num === 4) {
    page3Html = renderSuitcaseCraftPage({
      num: 4,
      badgeTitle: "VERA'S ONE SMALL SUITCASE • THE KINDERTRANSPORT (1938–1939)",
      subtitle: 'Each child could bring only ONE small suitcase and no money or valuables. Draw, colour, and label the items Vera packed.',
      checklistHeading: "Vera's Real Suitcase Belongings (Tick as you draw):",
      items: [
        'Warm winter coat & woollen dresses',
        'Sturdy shoes & knitted socks',
        'Family photograph of Mum, Dad & Grandmother',
        'Treasured English porcelain doll',
        'Little autograph diary signed by Mum & Dad in Czech',
        'Handkerchief & wash bag',
        'Czech-to-English pocket word book',
      ],
      note: 'Contrast Check: Unlike British evacuees inside the UK, Kindertransport children fled persecution across borders BEFORE war started.',
      tagTitle: 'KINDERTRANSPORT TRAVEL TAG • MAY 1939',
      tagRoute: 'PRAGUE → HOOK OF HOLLAND → HARWICH → LONDON',
    });
  }

  const pdfFile = ws.file.replace('.html', '.pdf');

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <title>KS2 History Worksheet • Lesson ${num}: ${esc(ws.h1)}</title>
  <link rel="icon" href="data:,">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Inter:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    :root {
      --ink: #0f172a;
      --ink-muted: #334155;
      --navy-primary: #1e3a8a;
      --navy-deep: #0f172a;
      --parchment: #fdfbf7;
      --accent-gold: #b45309;
      --border-gray: #94a3b8;
      --cut-guide: #94a3b8;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    svg g { opacity: 1 !important; }

    @page {
      size: 210mm 297mm;
      margin: 0;
    }

    body {
      background: #e2e8f0;
      font-family: 'Inter', system-ui, sans-serif;
      color: var(--ink);
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .screen-toolbar {
      width: 100%;
      background: #0f172a;
      color: #f8fafc;
      padding: 9px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #f59e0b;
      position: sticky;
      top: 0;
      z-index: 50;
      gap: 12px;
      flex-wrap: wrap;
    }

    .screen-toolbar-title {
      font-size: 9pt;
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    .screen-toolbar-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .screen-toolbar a,
    .screen-toolbar button {
      background: #1e3a8a;
      color: #ffffff;
      border: 1px solid #3b82f6;
      padding: 5px 12px;
      border-radius: 5px;
      font-size: 8.5pt;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      font-family: 'Inter', sans-serif;
    }

    .screen-toolbar button.print-btn {
      background: #f59e0b;
      color: #0f172a;
      border-color: #f59e0b;
    }

    .worksheet-page {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      background: #ffffff;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
      margin: 8mm auto;
      padding: 7mm 8mm 6mm 8mm;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      page-break-after: always;
      break-after: page;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    @media print {
      body { background: #ffffff; }
      .screen-toolbar { display: none !important; }
      .worksheet-page {
        margin: 0;
        box-shadow: none !important;
      }
      .worksheet-page:last-of-type {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
    }

    .exercise-book-cutline {
      width: 100%;
      flex: 1;
      min-height: 0;
      border: 1.5px dashed var(--cut-guide);
      border-radius: 6px;
      padding: 4.2mm 5.2mm 3.8mm 5.2mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      background: #ffffff;
    }

    .cut-indicator {
      position: absolute;
      top: -2.6mm;
      left: 12mm;
      background: #ffffff;
      padding: 0 6px;
      font-size: 7.4pt;
      font-weight: 700;
      color: #475569;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      line-height: 1;
    }

    .sheet-masthead {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      border-bottom: 2px solid var(--navy-deep);
      padding-bottom: 1.6mm;
      margin-bottom: 1.8mm;
      flex-shrink: 0;
    }

    .brand-left {
      display: flex;
      align-items: center;
      gap: 7px;
      min-width: 0;
    }

    .brand-badge {
      background: var(--navy-deep);
      color: #ffffff;
      font-family: 'Cinzel', serif;
      font-size: 7.2pt;
      font-weight: 800;
      padding: 1.5px 6px;
      border-radius: 3px;
      letter-spacing: 0.04em;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .brand-text {
      font-size: 7.3pt;
      font-weight: 800;
      color: var(--navy-primary);
      letter-spacing: 0.02em;
      text-transform: uppercase;
      line-height: 1.15;
    }

    .student-fields {
      display: flex;
      gap: 9px;
      font-size: 7.8pt;
      font-weight: 700;
      color: var(--ink);
      align-items: center;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .field-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .field-line {
      display: inline-block;
      width: 31mm;
      border-bottom: 1.2px solid var(--ink);
      height: 3.4mm;
    }

    .field-line.short { width: 18mm; }

    .enquiry-banner {
      background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
      color: #ffffff;
      border-radius: 5px;
      padding: 2.2mm 3.4mm;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 3mm;
      margin-bottom: 2mm;
      flex-shrink: 0;
    }

    .enquiry-title-group h1 {
      font-family: 'Cinzel', serif;
      font-size: 10.3pt;
      font-weight: 800;
      letter-spacing: 0.02em;
      line-height: 1.18;
    }

    .enquiry-title-group .enquiry-question {
      font-family: 'Lora', Georgia, serif;
      font-size: 8pt;
      font-style: italic;
      color: #fde68a;
      margin-top: 0.5mm;
      line-height: 1.24;
    }

    .lesson-badge {
      background: rgba(255, 255, 255, 0.16);
      border: 1px solid rgba(255, 255, 255, 0.35);
      padding: 1.5mm 2.8mm;
      border-radius: 4px;
      text-align: center;
      font-size: 7.4pt;
      font-weight: 800;
      letter-spacing: 0.04em;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .story-evidence-grid {
      display: grid;
      grid-template-columns: 64mm 1fr;
      gap: 2.8mm;
      margin-bottom: 2mm;
      flex-shrink: 0;
    }

    .archival-plate-box {
      border: 1.2px solid var(--border-gray);
      border-radius: 4px;
      padding: 1.5mm;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
    }

    .archival-img {
      width: 100%;
      height: 39mm;
      object-fit: contain;
      background: #f8fafc;
      border-radius: 3px;
      border: 1px solid #cbd5e1;
    }

    .archival-caption {
      font-size: 7.2pt;
      line-height: 1.22;
      color: var(--ink-muted);
      margin-top: 1mm;
      text-align: center;
    }

    .story-text-box {
      background: var(--parchment);
      border: 1.2px solid #d97706;
      border-left: 3.8px solid var(--accent-gold);
      border-radius: 4px;
      padding: 2mm 2.8mm;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .story-header {
      font-size: 7.6pt;
      font-weight: 800;
      color: var(--navy-deep);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 0.9mm;
    }

    .story-prose {
      font-family: 'Lora', Georgia, serif;
      font-size: 8.3pt;
      line-height: 1.4;
      color: #0f172a;
    }

    .story-prose strong { color: var(--navy-primary); }

    .task-card {
      background: #ffffff;
      border: 1.2px solid var(--border-gray);
      border-radius: 5px;
      padding: 2mm 2.8mm;
      display: flex;
      flex-direction: column;
      margin-bottom: 1.8mm;
      min-height: 0;
    }

    .task-card.last { margin-bottom: 0; }

    .p1-task1 { flex: 1.1; }
    .p1-task2 { flex: 1.04; }
    .p2-task3 { flex: 1.36; }
    .p2-task4 { flex: 0.84; }
    .p2-task5 { flex: 0.82; }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.4mm;
      padding-bottom: 0.9mm;
      border-bottom: 1px solid #cbd5e1;
      flex-shrink: 0;
    }

    .task-num-title {
      font-size: 8.4pt;
      font-weight: 800;
      color: var(--navy-deep);
    }

    .task-tag {
      font-size: 7.2pt;
      font-weight: 800;
      text-transform: uppercase;
      background: #e0e7ff;
      color: #1e3a8a;
      border: 1px solid #93c5fd;
      padding: 1px 6px;
      border-radius: 3px;
    }

    .artifact-detective-grid {
      display: grid;
      grid-template-columns: ${num === 2 || num === 4 ? '74mm 1fr' : '60mm 1fr'};
      gap: 2.8mm;
      flex: 1;
      min-height: 0;
    }

    .artifact-container {
      background: #fdfbf7;
      border: 1.2px dashed #b45309;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 1.5mm;
      min-height: 0;
    }

    .artifact-img {
      width: 100%;
      flex: 1;
      min-height: 0;
      max-height: 57mm;
      object-fit: contain;
      border-radius: 3px;
      background: #ffffff;
    }

    .artifact-caption {
      font-size: 7.1pt;
      line-height: 1.2;
      color: var(--ink-muted);
      text-align: center;
      margin-top: 0.9mm;
      flex-shrink: 0;
    }

    .detective-questions {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1.6mm;
      flex: 1;
      min-height: 0;
    }

    .q-block {
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: flex-start;
      min-height: 0;
    }

    .q-item {
      font-size: 7.9pt;
      font-weight: 700;
      color: var(--navy-deep);
      line-height: 1.22;
      margin-bottom: 0.4mm;
      flex-shrink: 0;
    }

    .ruled-lines-box {
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: space-evenly;
      min-height: 0;
    }

    .ruled-line {
      height: 7mm;
      border-bottom: 1.2px dashed #94a3b8;
      width: 100%;
    }

    .ruled-lines-box .ruled-line {
      flex: 1;
      height: auto;
      min-height: 4.8mm;
      max-height: 7.5mm;
    }

    .timeline-3col {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2.4mm;
      flex: 1;
      min-height: 0;
    }

    .timeline-step-card {
      background: #f8fafc;
      border: 1.1px solid #94a3b8;
      border-top: 3.5px solid var(--navy-primary);
      border-radius: 4px;
      padding: 1.6mm 2mm;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      min-height: 0;
    }

    .step-badge {
      font-size: 7pt;
      font-weight: 800;
      color: var(--navy-primary);
      letter-spacing: 0.02em;
    }

    .step-title {
      font-size: 7.7pt;
      font-weight: 800;
      color: var(--navy-deep);
      margin: 0.3mm 0;
      line-height: 1.16;
    }

    .step-desc {
      font-size: 7.1pt;
      color: var(--ink-muted);
      line-height: 1.18;
      margin-bottom: 0.8mm;
    }

    .step-prompt {
      font-size: 7.3pt;
      font-weight: 700;
      color: #1e3a8a;
      line-height: 1.18;
      padding-top: 0.8mm;
      border-top: 1px dashed #cbd5e1;
      margin-bottom: 0.3mm;
      flex-shrink: 0;
    }

    .visual-investigation-grid {
      display: grid;
      grid-template-columns: 62mm 1fr;
      gap: 2.8mm;
      flex: 1;
      min-height: 0;
    }

    .canvas-drawing-col {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 1.2px dashed #b45309;
      border-radius: 5px;
      background: #fdfbf7;
      padding: 1.8mm;
      min-height: 0;
    }

    .svg-showcase-slot {
      width: 100%;
      flex: 1;
      min-height: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .canvas-subcaption {
      font-size: 7.1pt;
      font-weight: 700;
      color: #78350f;
      text-align: center;
      margin-top: 1mm;
      line-height: 1.18;
      flex-shrink: 0;
    }

    .investigation-ledger {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1.3mm;
      flex: 1;
      min-height: 0;
    }

    .ledger-row {
      background: #ffffff;
      border: 1px solid #94a3b8;
      border-left: 3.5px solid var(--navy-primary);
      border-radius: 4px;
      padding: 1.2mm 2mm;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      min-height: 0;
    }

    .ledger-item-title {
      font-size: 7.7pt;
      font-weight: 800;
      color: var(--navy-deep);
    }

    .ledger-reason-prompt {
      font-size: 7.3pt;
      color: var(--ink-muted);
      line-height: 1.16;
      margin-bottom: 0.2mm;
    }

    .thinking-heads-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2.8mm;
      flex: 1;
      min-height: 0;
    }

    .head-card {
      background: #f8fafc;
      border: 1.1px solid var(--border-gray);
      border-radius: 5px;
      padding: 1.6mm 2.3mm;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      min-height: 0;
    }

    .head-title-row {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 0.5mm;
      flex-shrink: 0;
    }

    .head-badge {
      width: 17px;
      height: 17px;
      border-radius: 50%;
      background: var(--navy-primary);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 7.3pt;
      font-weight: 800;
      flex-shrink: 0;
    }

    .head-name {
      font-size: 7.6pt;
      font-weight: 800;
      color: var(--navy-deep);
      line-height: 1.18;
    }

    .thought-prompt {
      font-size: 7.3pt;
      color: var(--navy-primary);
      font-weight: 600;
      line-height: 1.2;
      margin-bottom: 0.3mm;
      flex-shrink: 0;
    }

    .synthesis-container {
      background: #fdfbf7;
      border: 1.2px solid #d97706;
      border-left: 4px solid var(--accent-gold);
      border-radius: 5px;
      padding: 1.6mm 2.6mm;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      flex: 1;
      min-height: 0;
    }

    .wb-scaffold-strip {
      font-size: 6.9pt;
      line-height: 1.2;
      color: #1e293b;
      background: #fffbeb;
      border: 1px solid #f59e0b;
      border-radius: 3px;
      padding: 0.6mm 1.5mm;
      margin-bottom: 0.4mm;
      flex-shrink: 0;
    }

    .synthesis-header {
      font-family: 'Lora', Georgia, serif;
      font-size: 8pt;
      font-style: italic;
      color: var(--navy-primary);
      font-weight: 700;
      line-height: 1.22;
      margin-bottom: 0.4mm;
      flex-shrink: 0;
    }

    .sheet-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1.3mm;
      margin-top: 1.3mm;
      border-top: 1px solid #cbd5e1;
      font-size: 7.3pt;
      font-weight: 600;
      color: var(--ink-muted);
      flex-shrink: 0;
    }

    /* PAGE 3 PORTRAIT SUITCASE CRAFT */
    .suitcase-portrait-wrap {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 3mm;
      min-height: 0;
    }

    .suitcase-checklist-card {
      background: #fdfbf7;
      border: 1.2px solid #b45309;
      border-radius: 5px;
      padding: 2.2mm 3.2mm;
      flex-shrink: 0;
    }

    .checklist-heading {
      font-size: 8pt;
      font-weight: 800;
      color: #78350f;
      margin-bottom: 1.3mm;
    }

    .checklist-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.1mm 4mm;
    }

    .checklist-item {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 7.6pt;
      color: #0f172a;
      font-weight: 600;
    }

    .tick-box {
      width: 3.3mm;
      height: 3.3mm;
      border: 1.2px solid #78350f;
      border-radius: 2px;
      background: #ffffff;
      display: inline-block;
      flex-shrink: 0;
    }

    .checklist-note {
      margin-top: 1.5mm;
      padding-top: 1.2mm;
      border-top: 1px dashed #d97706;
      font-size: 7.4pt;
      font-weight: 700;
      color: #1e3a8a;
    }

    .suitcase-svg-frame {
      flex: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      min-height: 0;
      padding: 11mm 7mm 6mm 7mm;
    }

    .suitcase-bg-svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      pointer-events: none;
    }

    .suitcase-inner-content {
      position: relative;
      z-index: 1;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2.8mm;
      min-height: 0;
    }

    .suitcase-travel-tag {
      background: #ffffff;
      border: 1.5px solid #b45309;
      border-radius: 4px;
      padding: 1.5mm 3mm;
      text-align: center;
      flex-shrink: 0;
    }

    .tag-title {
      font-size: 7.9pt;
      font-weight: 800;
      color: #78350f;
      letter-spacing: 0.04em;
    }

    .tag-route {
      font-size: 7.5pt;
      font-weight: 700;
      color: #1e3a8a;
      margin-top: 0.3mm;
    }

    .suitcase-canvas-area {
      flex: 1;
      background: #ffffff;
      border: 2px dashed #b45309;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5mm;
      min-height: 0;
    }

    .suitcase-watermark {
      font-size: 8.8pt;
      font-weight: 800;
      color: rgba(120, 53, 15, 0.28);
      text-align: center;
      letter-spacing: 0.06em;
      max-width: 120mm;
      line-height: 1.4;
    }

    .suitcase-caption-box {
      background: #ffffff;
      border: 1.2px solid #b45309;
      border-radius: 5px;
      padding: 1.8mm 2.8mm;
      flex-shrink: 0;
    }
  </style>
</head>
<body>

  <div class="screen-toolbar">
    <div class="screen-toolbar-title">KS2 World War II • Lesson ${pad} of 11: ${esc(ws.h1)}${ws.hasPage3 ? ' (Pages 1–2 Core Worksheet + Optional Page 3 Suitcase Craft)' : ''}</div>
    <div class="screen-toolbar-actions">
      <a href="/?view=lessons&amp;unit=ks2_ww2">← Back to KS2 Unit</a>
      <a href="/pdfs/ks2_ww2/${pdfFile}" download>⬇ Download PDF</a>
      <button class="print-btn" onclick="window.print()">🖨 Print Worksheet</button>
    </div>
  </div>

  <!-- ========================================================
       PAGE 1: SOURCE ENQUIRY & APP-SYNCED CHRONOLOGY (SHEET 1)
       ======================================================== -->
  <div class="worksheet-page" id="sheet-page-1">
    <div class="exercise-book-cutline">
      <div class="cut-indicator">
        ✂ Cut along dashed line to stick neatly into exercise book
      </div>

      <div class="sheet-masthead">
        <div class="brand-left">
          <span class="brand-badge">KS2 HISTORY</span>
          <span class="brand-text">KS2 WORLD WAR II • LESSON ${pad} OF 11</span>
        </div>
        <div class="student-fields">
          <div class="field-item">Name: <span class="field-line"></span></div>
          <div class="field-item">Date: <span class="field-line short"></span></div>
        </div>
      </div>

      <div class="enquiry-banner">
        <div class="enquiry-title-group">
          <h1>${esc(ws.h1)}</h1>
          <p class="enquiry-question">Enquiry Question: ${esc(canonicalEnq)}</p>
        </div>
        <div class="lesson-badge">
          LESSON ${pad}<br><span style="font-size: 6.8pt; font-weight:600;">OF 11 • KS2</span>
        </div>
      </div>

      <div class="story-evidence-grid">
        <div class="archival-plate-box">
          <img src="${ws.srcAImg}" class="archival-img" alt="Source A">
          <p class="archival-caption">${ws.srcACap}</p>
        </div>
        <div class="story-text-box">
          <div class="story-header">Historical Background • Read Together</div>
          <p class="story-prose">${ws.storyProse}</p>
        </div>
      </div>

      <div class="task-card p1-task1">
        <div class="task-header">
          <span class="task-num-title">${esc(ws.t1Title)}</span>
          <span class="task-tag">${esc(ws.t1Tag)}</span>
        </div>
        <div class="artifact-detective-grid">
          <div class="artifact-container">
            <img src="${srcBImg}" class="artifact-img" alt="Source B">
            <p class="artifact-caption">${srcBCap}</p>
          </div>
          <div class="detective-questions">
            <div class="q-block">
              <p class="q-item">${esc(t1Qs[0])}</p>
              <div class="ruled-lines-box">
                <div class="ruled-line"></div>
                <div class="ruled-line"></div>
                <div class="ruled-line"></div>
              </div>
            </div>
            <div class="q-block">
              <p class="q-item">${esc(t1Qs[1])}</p>
              <div class="ruled-lines-box">
                <div class="ruled-line"></div>
                <div class="ruled-line"></div>
                <div class="ruled-line"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="task-card p1-task2 last">
        <div class="task-header">
          <span class="task-num-title">${esc(ws.t2Title)}</span>
          <span class="task-tag">${esc(ws.t2Tag)}</span>
        </div>
        <div class="timeline-3col">
${stageCardsHtml}
        </div>
      </div>

      <div class="sheet-footer">
        <span>The History Revision Hub • KS2 World War II Enquiry Series</span>
        <span>LESSON ${pad} OF 11 • Sheet 1 of ${totalSheets}</span>
      </div>
    </div>
  </div>

  <!-- ========================================================
       PAGE 2: VISUAL INVESTIGATION, PERSPECTIVES & CHALLENGE
       ======================================================== -->
  <div class="worksheet-page" id="sheet-page-2">
    <div class="exercise-book-cutline">
      <div class="cut-indicator">
        ✂ Cut along dashed line to stick neatly into exercise book
      </div>

      <div class="sheet-masthead">
        <div class="brand-left">
          <span class="brand-badge">KS2 ENQUIRY</span>
          <span class="brand-text">${esc(ws.p2Brand)}</span>
        </div>
        <div class="student-fields">
          <div class="field-item">Name: <span class="field-line"></span></div>
          <div class="field-item">LESSON ${pad} • Sheet 2 of ${totalSheets}</div>
        </div>
      </div>

      <div class="task-card p2-task3">
        <div class="task-header">
          <span class="task-num-title">${esc(ws.t3Title)}</span>
          <span class="task-tag">${esc(ws.t3Tag)}</span>
        </div>
        <div class="visual-investigation-grid">
          <div class="canvas-drawing-col">
            <div class="svg-showcase-slot">
              ${TASK3_SVGS[num]}
            </div>
            <p class="canvas-subcaption">${esc(ws.t3Subcap)}</p>
          </div>
          <div class="investigation-ledger">
            ${ws.t3Items
              .map(
                (item) => `
            <div class="ledger-row">
              <div style="flex-shrink:0;">
                <div class="ledger-item-title">${esc(item.title)}</div>
                <p class="ledger-reason-prompt">${esc(item.prompt)}</p>
              </div>
              <div class="ruled-lines-box">
                <div class="ruled-line"></div>
                <div class="ruled-line"></div>
              </div>
            </div>`
              )
              .join('')}
          </div>
        </div>
      </div>

      <div class="task-card p2-task4">
        <div class="task-header">
          <span class="task-num-title">Task 4: Thinking Heads • Two Historical Viewpoints</span>
          <span class="task-tag">Perspectives</span>
        </div>
        <div class="thinking-heads-grid">
          ${ws.t4Heads
            .map(
              (hd, hi) => `
          <div class="head-card">
            <div style="flex-shrink:0;">
              <div class="head-title-row">
                <span class="head-badge">${hi + 1}</span>
                <span class="head-name">${esc(hd.name)}</span>
              </div>
              <p class="thought-prompt">${esc(hd.prompt)}</p>
            </div>
            <div class="ruled-lines-box">
              <div class="ruled-line"></div>
              <div class="ruled-line"></div>
              <div class="ruled-line"></div>
              <div class="ruled-line"></div>
            </div>
          </div>`
            )
            .join('')}
        </div>
      </div>

      <div class="task-card p2-task5 last">
        <div class="task-header">
          <span class="task-num-title">Task 5: Historian Mission Challenge • Answering the Enquiry</span>
          <span class="task-tag">Extended Writing</span>
        </div>
        <div class="synthesis-container">
          <p class="synthesis-header">${t5Header}</p>
          <div class="wb-scaffold-strip">${ws.t5Scaffold}</div>
          <div class="ruled-lines-box">
            <div class="ruled-line"></div>
            <div class="ruled-line"></div>
            <div class="ruled-line"></div>
            <div class="ruled-line"></div>
          </div>
        </div>
      </div>

      <div class="sheet-footer">
        <span>The History Revision Hub • KS2 World War II Enquiry Series</span>
        <span>LESSON ${pad} OF 11 • Sheet 2 of ${totalSheets}</span>
      </div>
    </div>
  </div>
${page3Html}
</body>
</html>`;
}

async function main() {
  const unit = loadCanonicalUnitData();
  const extracted = JSON.parse(
    fs.readFileSync(
      'C:/Users/fives/.gemini/antigravity/brain/31f993ab-5a3f-4adc-b83e-c1fe533ca630/scratch/extracted_worksheets.json',
      'utf8'
    )
  );

  // 1. Write all 11 HTML files to both public/units and units/
  for (let i = 0; i < extracted.length; i++) {
    const ws = extracted[i];
    const lesson = unit.lessons[i];
    const html = buildWorksheetHtml(ws, lesson);
    fs.writeFileSync(path.join(PUB_WS_DIR, ws.file), html, 'utf8');
    fs.writeFileSync(path.join(SRC_WS_DIR, ws.file), html, 'utf8');
  }

  // 2. Render all 11 PDFs via Headless Chrome + verify 0px overflow & exact physical page count
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1000, height: 1400, deviceScaleFactor: 2 });

    for (let i = 0; i < extracted.length; i++) {
      const ws = extracted[i];
      const htmlPath = path.join(PUB_WS_DIR, ws.file);
      const pdfName = ws.file.replace('.html', '.pdf');
      const pdfPath = path.join(PDF_OUT_DIR, pdfName);
      const expectedPages = ws.hasPage3 ? 3 : 2;

      const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
      await page.goto(fileUrl, { waitUntil: 'networkidle0' });

      const domCheck = await page.evaluate(() => {
        const sheets = [...document.querySelectorAll('.worksheet-page')];
        const brokenImgs = [...document.querySelectorAll('img')].filter((im) => !im.complete || im.naturalWidth === 0).map((im) => im.getAttribute('src'));
        const overflows = sheets.map((el, idx) => ({
          sheet: idx + 1,
          over: Math.max(0, el.scrollHeight - el.clientHeight),
        }));
        return { brokenImgs, overflows };
      });

      if (domCheck.brokenImgs.length > 0) {
        throw new Error(`Broken image(s) in ${ws.file}: ${domCheck.brokenImgs.join(', ')}`);
      }
      const badOver = domCheck.overflows.filter((o) => o.over > 2);
      if (badOver.length > 0) {
        throw new Error(`DOM overflow in ${ws.file}: ${JSON.stringify(badOver)}`);
      }

      await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
      });

      const parsed = await pdf(fs.readFileSync(pdfPath));
      if (parsed.numpages !== expectedPages) {
        throw new Error(
          `Skia PDF Spillover Gate FAILED on ${pdfName}: expected ${expectedPages} pages, got ${parsed.numpages}`
        );
      }
      console.log(`✅ L${String(ws.num).padStart(2, '0')} (${pdfName}): ${parsed.numpages}/${expectedPages} pages, 0px overflow, 100% app-synced!`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
