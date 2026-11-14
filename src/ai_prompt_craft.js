/**
 * KS3 Year 9 Artificial Intelligence — Complete 6-Lesson Unit Shell & Live Demo Lesson
 * Built in the exact scholarly lesson & unit architecture of The History Revision Hub.
 *
 * Routes:
 *   ?view=ai-prompt-craft              -> Year 9 AI Unit Launchpad (6-Lesson Scheme of Work)
 *   ?view=ai-prompt-craft&lesson=3     -> Lesson 3: Introduction to Prompt Craft
 *   ?view=ai-prompt-craft&lesson=4     -> Lesson 4: Prompt Craft at Work
 *   ?view=ai-prompt-craft&print=worksheet -> Lesson 3 Pupil Worksheet (2-Sided A4)
 */

const UNIT_META = {
  code: 'Key Stage 3 · Year 9 Artificial Intelligence',
  title: 'Foundations of Generative AI, Prompt Craft & Future Work',
  enquiry:
    'How do we move from passive users of artificial intelligence to disciplined thinkers who direct, verify, and challenge it across academic study and modern employment?',
  synopsis:
    'A six-lesson Year 9 curriculum sequence introducing pupils to how large language models generate text, why hallucinations and sycophancy occur, how structured prompt engineering (R.C.T.C.) transforms Microsoft Copilot into a Socratic coach, and how professionals deploy guardrails in law, medicine, architecture, and finance.',
};

const RCTC_CLAUSES = [
  {
    key: 'R',
    code: '[ R ]',
    name: 'Role',
    penMark: 'Box [ ... ]',
    summary: 'Define who the AI should act as (e.g. a demanding Year 9 tutor or critic).',
  },
  {
    key: 'C',
    code: '( C )',
    name: 'Context',
    penMark: 'Brackets ( ... )',
    summary: 'Give background: who you are, the exact topic, and what you find tricky.',
  },
  {
    key: 'T',
    code: '_T_',
    name: 'Task',
    penMark: 'Underline',
    summary: 'Tell Copilot the exact step-by-step job you want it to carry out.',
  },
  {
    key: 'C2',
    code: '|| C ||',
    name: 'Constraints',
    penMark: 'Bars || ... ||',
    summary: 'Set strict rules on length, tone, and what Copilot is forbidden to do.',
  },
];

const WORKPLACE_CASES = [
  {
    id: 'law',
    letter: 'A',
    sector: 'Commercial Law',
    roleTitle: 'Trainee Solicitor — High Court Deadline',
    scenario:
      'Ten minutes before a High Court deadline, a trainee lawyer has not checked the official law reports. They type this into Copilot and send the reply straight to the judge:',
    naivePrompt:
      '"Write a persuasive legal argument proving breach of contract for a late cargo ship, and cite two High Court cases that back me up."',
    danger:
      'Hallucination — Copilot can invent convincing fake High Court cases that do not exist.',
    promptFix:
      'Act as a cautious legal researcher using ONLY my pasted case notes. Rule: Never invent cases; flag any missing proof.',
  },
  {
    id: 'med',
    letter: 'B',
    sector: 'NHS Hospital Clinic',
    roleTitle: 'Clinic Coordinator — Patient Letter',
    scenario:
      'A busy coordinator needs to invite a patient back for a routine repeat chest X-ray. They paste the doctor\'s notes—including full name, date of birth, and home address—into a public chatbot:',
    naivePrompt:
      '"Write an urgent email telling this patient they must come back immediately for another chest scan."',
    danger:
      'Privacy Breach & Panic — Confidential patient data was pasted into public AI, and "urgent" wording causes needless fear.',
    promptFix:
      '(Remove all names/dates first!) Act as an NHS editor writing a calm routine letter. Rule: Under 75 words, reassuring tone, zero personal data.',
  },
  {
    id: 'arch',
    letter: 'C',
    sector: 'Architecture Studio',
    roleTitle: 'Junior Architect — Seafront Sixth-Form Pitch',
    scenario:
      'Five rival firms are competing to design a sixth-form centre on a windy, salt-sprayed coast. Instead of sketching ideas first, one team types straight into Copilot:',
    naivePrompt:
      '"Design an exciting, modern eco-school building for us to pitch to the client."',
    danger:
      'Generic Clichés — Outsourcing human creativity produces average glass-box designs that ignore coastal gales and salt rust.',
    promptFix:
      'Act as a coastal structural engineer testing OUR own initial building sketch. Rule: Do not design it for us—ask 3 tough weather-safety questions.',
  },
  {
    id: 'fin',
    letter: 'D',
    sector: 'Finance & Business',
    roleTitle: 'Investment Analyst — £10m Airline Pitch',
    scenario:
      'An analyst wants their company to invest £10 million in a startup promising battery-powered jumbo jets by 2030. Before the board vote, they type into Copilot:',
    naivePrompt:
      '"Give me five convincing reasons why battery-powered jumbo jets are a guaranteed success."',
    danger:
      'AI Sycophancy ("Yes-Man" Trap) — Leading the prompt makes AI flatter a flawed £10m bet and hide battery-weight physics.',
    promptFix:
      'Act as a sceptical physics and finance critic testing this pitch. Rule: Do not agree out of politeness—list the 3 biggest barriers first.',
  },
];

const AI_COURSE_LESSONS = [
  {
    num: 1,
    id: 'l1',
    badge: 'Lesson 1 · Technical Foundations',
    title: 'Inside the Black Box: Tokens, Probability & Next-Word Prediction',
    enquiry: 'Does a large language model "know" facts like a database, or predict probable sequences of tokens?',
    duration: 'Year 9 AI',
    status: 'Prior Learning',
    summary:
      'Pupils explore how transformer models break language into tokens and calculate next-token probabilities from training distributions—explaining why AI sounds articulate even when guessing.',
    doNowTitle: 'Baseline Prior Knowledge Check (5 Questions)',
    doNow: [
      {
        origin: 'Baseline',
        q: 'What does the acronym "LLM" stand for in modern artificial intelligence?',
        a: 'Large Language Model — a neural network trained on vast text corpora to predict and generate language.',
      },
      {
        origin: 'Baseline',
        q: 'When Microsoft Copilot writes a sentence, is it copying and pasting a paragraph from a single website?',
        a: 'No — unless quoting a search source, it generates new text token-by-token based on learned statistical patterns.',
      },
      {
        origin: 'Baseline',
        q: 'What is a "token" in an AI language model?',
        a: 'A chunk of text (a whole short word, part of a longer word, or punctuation) that the model processes numerically.',
      },
      {
        origin: 'Baseline',
        q: 'Why can asking the exact same prompt twice in Copilot produce two slightly different wordings?',
        a: 'Generative models sample from high-probability next tokens ("temperature") rather than replaying a fixed script.',
      },
      {
        origin: 'Baseline',
        q: 'Name one everyday task where predictive text was already on phones before modern chatbots.',
        a: 'Keyboard autocomplete / next-word suggestions in messaging and email apps.',
      },
    ],
    stages: [
      {
        code: 'STAGE 01',
        title: 'From Words to Tokens',
        text: 'Interactive demonstration showing how sentences split into sub-word tokens and probability rankings.',
      },
      {
        code: 'STAGE 02',
        title: 'Fluency vs Understanding',
        text: 'Analysing why statistical fluency is not the same thing as human comprehension or lived experience.',
      },
    ],
  },
  {
    num: 2,
    id: 'l2',
    badge: 'Lesson 2 · Epistemology & Verification',
    title: 'Fluent Fiction: Hallucinations, Training Bias & Verification',
    enquiry: 'Why do large language models state false information with total confidence, and how do scholars verify outputs?',
    duration: 'Year 9 AI',
    status: 'Prior Learning',
    summary:
      'Building on Lesson 1, pupils investigate AI hallucinations, sycophancy, and lateral verification habits—learning never to treat unverified model prose as primary evidence.',
    doNowTitle: 'Spaced Retrieval from Lesson 1 (5 Questions)',
    doNow: [
      {
        origin: 'Lesson 1',
        q: 'How does an LLM generate its response: by looking up verified truth, or by predicting the most plausible next token?',
        a: 'By predicting the most statistically plausible next token given the context window.',
      },
      {
        origin: 'Lesson 1',
        q: 'Roughly how much text is one "token" equivalent to in English?',
        a: 'Roughly three-quarters of a word (about 3–4 characters on average).',
      },
      {
        origin: 'Lesson 1',
        q: 'Why does a chatbot sound confident even when discussing a topic with sparse evidence?',
        a: 'Its training rewards coherent, authoritative-sounding prose patterns regardless of factual certainty.',
      },
      {
        origin: 'Diagnostic',
        q: 'If an AI invents a convincing quotation or date that never happened, what technical term do researchers use?',
        a: 'An AI hallucination (or confabulation).',
      },
      {
        origin: 'Diagnostic',
        q: 'What is the safest way to verify an unfamiliar claim generated by Copilot?',
        a: 'Lateral reading: check independent, authoritative primary or academic sources outside the chat.',
      },
    ],
    stages: [
      {
        code: 'STAGE 01',
        title: 'Anatomy of a Hallucination',
        text: 'Case study of fabricated historical quotations and invented bibliography entries.',
      },
      {
        code: 'STAGE 02',
        title: 'The Verification Protocol',
        text: 'Practising lateral source checking and grounding Copilot in supplied reference extracts.',
      },
    ],
  },
  {
    num: 3,
    id: 'l3',
    isFeaturedDemo: true,
    badge: 'Lesson 3 · Prompt Engineering',
    title: 'Introduction to Prompt Craft: Engineering an AI Thinking Coach',
    enquiry:
      'How do we structure prompts using R.C.T.C. (Role, Context, Task, Constraints) so AI strengthens human memory and judgement rather than replacing it?',
    duration: 'Year 9 AI',
    status: 'Core Enquiry',
    summary:
      'Pupils learn explicit prompt architecture (R.C.T.C.): transforming Microsoft Copilot into a disciplined Socratic revision coach, stress-testing its guardrails, and solving four real-world workplace cases.',
    doNowTitle: 'Spaced Retrieval (Lessons 1–2) & Diagnostic Check (5 Questions)',
    doNow: [
      {
        origin: 'Lesson 1',
        q: 'Does Microsoft Copilot "understand" your subject like a teacher, or predict the most probable next words?',
        a: 'It predicts probable next-word tokens from patterns in its training data—so vague prompts trigger generic, average replies.',
      },
      {
        origin: 'Lesson 2',
        q: 'What do we call it when an AI model invents a plausible-sounding fact, quote, or court case that does not exist?',
        a: 'A hallucination — sounding confident and fluent is never proof that an AI is accurate.',
      },
      {
        origin: 'Memory',
        q: 'Pupil A types "Explain photosynthesis for my test" and reads Copilot\'s 180-word summary twice. Why is 80% of this forgotten within 48 hours?',
        a: 'Passive reading creates an "illusion of knowing" without making your brain actively retrieve from memory.',
      },
      {
        origin: 'Coaching',
        q: 'How does a skilled human tutor respond differently from default Copilot when you say "I am stuck on causes of WWI"?',
        a: 'A good tutor holds back the answer, asks one short question first, and coaches you to work it out yourself.',
      },
      {
        origin: 'AI Design',
        q: 'Why does default Copilot immediately hand over finished paragraphs unless you instruct it otherwise?',
        a: 'Chatbots are trained to be maximally helpful assistants—doing the thinking for you unless you set strict rules.',
      },
    ],
  },
  {
    num: 4,
    id: 'l4',
    isPlenaryQuizTarget: true,
    badge: 'Lesson 4 · Consolidation & Workplace Systems',
    title: 'Prompt Craft at Work: Multi-Step Workflows & Guardrails',
    enquiry:
      'How do professionals chain prompts and enforce strict verification guardrails in high-stakes careers?',
    duration: 'Year 9 AI',
    status: 'Next Lesson (Retrieval Ready)',
    summary:
      'Directly consolidates Lesson 3\'s R.C.T.C. framework with a 5-question retrieval Do Now before examining how lawyers, clinicians, architects, and analysts build multi-step verification workflows.',
    doNowTitle: 'Lesson 3 Retrieval Check: Mastering R.C.T.C. (5 Questions)',
    doNow: [
      {
        origin: 'Lesson 3',
        q: 'State all four components of the R.C.T.C. prompt architecture in order.',
        a: 'Role (who AI acts as), Context (who you are & topic), Task (step-by-step job), and Constraints (strict boundaries & what is forbidden).',
      },
      {
        origin: 'Lesson 3',
        q: 'Which of the four R.C.T.C. components stops Microsoft Copilot from immediately handing over a finished essay or revision answer?',
        a: 'Constraints — explicitly forbidding full answers and restricting reply length or hint style.',
      },
      {
        origin: 'Lesson 3',
        q: 'What is "AI sycophancy", and how did we test for it during Phase B of the Copilot Lab?',
        a: 'The tendency of chatbots to cave in, agree, or abandon rules to please the user (e.g. folding when told "I give up, just write the answer").',
      },
      {
        origin: 'Lesson 3',
        q: 'How does Microsoft\'s workplace G.C.S.E. framework (Goal, Context, Sources, Expectations) connect to R.C.T.C.?',
        a: 'Both replace vague one-liners with structured specifications; "Sources" grounds workplace documents while "Constraints" protects active thinking.',
      },
      {
        origin: 'Lesson 3',
        q: 'In professional settings like Law or Healthcare, give one non-negotiable Constraint when using AI.',
        a: 'Never input confidential personal data (Healthcare) and restrict citations strictly to supplied verified texts so AI cannot invent cases (Law).',
      },
    ],
    stages: [
      {
        code: 'STAGE 01',
        title: 'From Single Prompts to Chained Workflows',
        text: 'Breaking complex professional problems into Draft -> Critique -> Verify -> Refine stages rather than one giant prompt.',
      },
      {
        code: 'STAGE 02',
        title: 'Source-Grounded Prompting ("S" in G.C.S.E.)',
        text: 'Supplying verified primary documents inside the prompt and constraining Copilot strictly to evidence in the text.',
      },
    ],
  },
  {
    num: 5,
    id: 'l5',
    badge: 'Lesson 5 · Cross-Curricular Mastery',
    title: 'Subject Mastery Studio: AI Across STEM, Humanities & Languages',
    enquiry:
      'How should our prompting strategy adapt between a French conversation partner, a Maths step-checker, and a History source critic?',
    duration: 'Year 9 AI',
    status: 'Upcoming',
    summary:
      'In partnership with academic departments, pupils tailor R.C.T.C. coaching templates to distinct disciplinary demands—from conversational MFL roleplay to step-by-step algebraic debugging.',
    doNowTitle: 'Spaced Retrieval across Lessons 1–4 (5 Questions)',
    doNow: [
      {
        origin: 'Lesson 3',
        q: 'Rewrite "Help me revise French" by naming a sharp Role and Task in one sentence.',
        a: 'Example: "Act as a Parisian café waiter (Role) and hold a 5-turn ordering dialogue in GCSE-level French, correcting my grammar after each reply (Task)."',
      },
      {
        origin: 'Lesson 4',
        q: 'What does the "S" stand for in Microsoft\'s G.C.S.E. Copilot framework?',
        a: 'Sources — specifying the exact documents, notes, or verified data Copilot is permitted to draw from.',
      },
      {
        origin: 'Lesson 2',
        q: 'Why is AI particularly prone to subtle errors in multi-step Maths proofs if left unconstrained?',
        a: 'Token prediction can mimic the look of working-out while slipping on an arithmetic or sign step.',
      },
      {
        origin: 'Lesson 3',
        q: 'Why should your Context statement include what you currently find confusing?',
        a: 'It targets the tutor\'s diagnostic questions directly at your misconception rather than easy definitions.',
      },
      {
        origin: 'Lesson 4',
        q: 'How can you prompt Copilot to act as a rigorous critic when checking your own essay plan?',
        a: 'Assign Copilot the Role of a sceptical examiner instructed to find counter-evidence and gaps in your draft rather than praising it.',
      },
    ],
    stages: [
      {
        code: 'STAGE 01',
        title: 'Disciplinary Prompt Calibration',
        text: 'Comparing conversational immersion prompts (Languages) with error-spotting Socratic prompts (Mathematics & Sciences).',
      },
      {
        code: 'STAGE 02',
        title: 'Building Your Personal Year 9 Exam Toolkit',
        text: 'Curating three verified, reusable R.C.T.C. coaching prompts tailored to pupils\' own Summer examination subjects.',
      },
    ],
  },
  {
    num: 6,
    id: 'l6',
    badge: 'Lesson 6 · Ethics, Agency & Future Society',
    title: 'Human Agency in the 2030s: Authorship, Ethics & Judgement',
    enquiry:
      'Where must human accountability, empathy, and intellectual ownership draw a permanent line that AI does not cross?',
    duration: 'Year 9 AI',
    status: 'Synoptic Finale',
    summary:
      'Pupils debate academic integrity, environmental compute costs, intellectual authorship, and why human judgement remains irreplaceable in leadership and public life.',
    doNowTitle: 'Synoptic Unit Retrieval: Lessons 1–5 (5 Questions)',
    doNow: [
      {
        origin: 'Lesson 1',
        q: 'Explain in one sentence why fluency from an LLM does not equal truth.',
        a: 'LLMs optimise for plausible next-token patterns rather than factual verification.',
      },
      {
        origin: 'Lesson 2',
        q: 'What must a researcher always do before citing a factual claim surfaced during an AI brainstorm?',
        a: 'Verify it independently in a primary or authoritative source.',
      },
      {
        origin: 'Lesson 3',
        q: 'Explain the difference between cognitive offloading and cognitive coaching when using Copilot.',
        a: 'Offloading lets AI generate the product while your brain stays passive; coaching uses Constraints so AI tests and strengthens your own thinking.',
      },
      {
        origin: 'Lesson 4',
        q: 'Why should confidential personal or medical details never be pasted into an unapproved public chatbot?',
        a: 'Data privacy, safeguarding, and regulatory compliance (GDPR / clinical confidentiality).',
      },
      {
        origin: 'Lesson 5',
        q: 'Give one example of using AI as a "Devil\'s Advocate" in essay planning.',
        a: 'Asking Copilot to challenge your thesis with the strongest historical or scientific counter-arguments before you write.',
      },
    ],
    stages: [
      {
        code: 'STAGE 01',
        title: 'The Authorship Boundary',
        text: 'Distinguishing legitimate AI coaching and critique from academic dishonesty and voice erosion.',
      },
      {
        code: 'STAGE 02',
        title: 'Designing the Year 9 AI Charter',
        text: 'Drafting a personal protocol for creative, responsible, and intellectually ambitious AI usage.',
      },
    ],
  },
];

// Persistent UI State — every single interactive element supports click-to-open AND click-to-close!
const state = {
  subView: 'unit', // 'unit' (6-lesson course launchpad) | 'lesson' (active lesson 1..6)
  lessonNum: 3, // 1..6
  hideHubSidebar: false, // Keeps native History Hub look by default; 1-click full-width projector mode!
  showTeacherNotes: false,
  printDoc: null, // null | 'worksheet' | 'plan' | 'script'

  // Keyed per lessonNum so switching Lesson 3 <-> Lesson 4 remembers state cleanly
  doNowOpen: {}, // e.g. '3-0': true
  specimenOpen: { lazy: false, coach: false },
  rctcOpen: { R: false, C: false, T: false, C2: false },
  phaseBOpen: false,
  casesOpen: { law: false, med: false, arch: false, fin: false },
};

// Timer state for Classroom Pacing
let stageTimerSec = 240;
let timerRunning = false;
let totalLessonSec = 0;
let totalClockActive = false;
let timerHandle = null;

function fmtMMSS(sec) {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

function injectUnitStyles() {
  if (document.getElementById('ai-unit-editorial-styles')) return;
  const style = document.createElement('style');
  style.id = 'ai-unit-editorial-styles';
  style.textContent = `
    /* Optional 1-Click Full-Width Projector Mode */
    body.ai-projector-clean #app-sidebar,
    body.ai-projector-clean .app-header,
    body.ai-projector-clean #app-global-footer,
    body.ai-projector-clean #mobile-bottom-nav,
    body.ai-projector-clean #cme-floating-map-btn {
      display: none !important;
    }
    body.ai-projector-clean .app-layout,
    body.ai-projector-clean .app-body,
    body.ai-projector-clean #main-content {
      margin: 0 !important;
      padding: 0 !important;
      max-width: 100% !important;
      width: 100% !important;
      background: #f8fafc !important;
    }

    .aiu-root {
      max-width: 1180px;
      margin: 0 auto;
      padding: 16px 22px 64px 22px;
      font-family: 'Lexend', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #0f172a;
      box-sizing: border-box;
    }
    body.ai-projector-clean .aiu-root {
      max-width: 1280px;
      padding-top: 20px;
    }

    /* Top Course Navigation & Pacing Bar */
    .aiu-topbar {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 10px;
      padding: 10px 16px;
      margin-bottom: 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
      position: sticky;
      top: 8px;
      z-index: 800;
    }
    .aiu-crumbs {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      font-size: 0.82rem;
      font-weight: 600;
      color: #475569;
    }
    .aiu-crumb-btn {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      color: #1e293b;
      padding: 5px 10px;
      border-radius: 6px;
      font-family: inherit;
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background-color 0.14s ease, border-color 0.14s ease;
    }
    .aiu-crumb-btn:hover {
      background: #f1f5f9;
      border-color: #94a3b8;
    }
    .aiu-crumb-btn.navy {
      background: #0f172a;
      border-color: #0f172a;
      color: #ffffff;
    }
    .aiu-crumb-btn.navy:hover {
      background: #1e293b;
    }
    .aiu-crumb-btn.blue-active {
      background: #eff6ff;
      border-color: #3b82f6;
      color: #1d4ed8;
    }

    .aiu-timer-cluster {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 4px 9px;
      font-variant-numeric: tabular-nums;
    }
    .aiu-timer-cluster.running {
      background: #ecfdf5;
      border-color: #10b981;
    }
    .aiu-timer-val {
      font-size: 0.9rem;
      font-weight: 800;
      color: #0f172a;
      min-width: 46px;
      text-align: center;
    }

    /* Scholarly Unit & Lesson Hero Banner */
    .aiu-hero {
      background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
      color: #ffffff;
      border-radius: 12px;
      padding: 26px 30px;
      margin-bottom: 22px;
      border: 1px solid #1e3a8a;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
      position: relative;
      overflow: hidden;
    }
    .aiu-hero-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 10px;
    }
    .aiu-pill-kicker {
      background: rgba(255, 255, 255, 0.14);
      border: 1px solid rgba(255, 255, 255, 0.28);
      color: #dbeafe;
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      padding: 3px 10px;
      border-radius: 4px;
    }
    .aiu-hero-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: clamp(1.55rem, 2.5vw, 2.15rem);
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 8px 0;
      line-height: 1.22;
    }
    .aiu-hero-enquiry {
      font-size: 0.96rem;
      color: #e2e8f0;
      line-height: 1.5;
      margin: 0;
      max-width: 920px;
      font-style: italic;
    }
    .aiu-hero-actions {
      margin-top: 18px;
      padding-top: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.16);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }

    /* 6-Lesson Scheme of Work Grid */
    .aiu-lessons-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
    }
    @media (max-width: 980px) {
      .aiu-lessons-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 640px) {
      .aiu-lessons-grid {
        grid-template-columns: 1fr;
      }
    }

    .aiu-lesson-card {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-top: 4px solid #1e3a8a;
      border-radius: 10px;
      padding: 18px 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
      transition: border-color 0.16s ease, box-shadow 0.16s ease;
      box-sizing: border-box;
    }
    .aiu-lesson-card:hover {
      border-color: #2563eb;
      box-shadow: 0 6px 18px rgba(37, 99, 235, 0.1);
    }
    .aiu-lesson-card.featured-demo {
      border-color: #2563eb;
      border-top: 4px solid #2563eb;
      background: linear-gradient(180deg, #eff6ff 0%, #ffffff 38%);
      box-shadow: 0 6px 20px rgba(37, 99, 235, 0.12);
    }
    .aiu-lesson-card.next-quiz-card {
      border-top-color: #059669;
    }

    /* Unified Lesson Station Cards (Matches History Hub wb-unified-station & do-now-card) */
    .aiu-station {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 10px;
      margin-bottom: 22px;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
      overflow: hidden;
    }
    .aiu-station-head {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-bottom: 1px solid #e2e8f0;
      padding: 12px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      flex-wrap: wrap;
    }
    .aiu-station-title-row {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .aiu-stage-pill {
      background: #0f172a;
      color: #ffffff;
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 3px 9px;
      border-radius: 4px;
    }
    .aiu-station-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.15rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
    }
    .aiu-mode-pill {
      font-size: 0.71rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 3px 9px;
      border-radius: 4px;
      border: 1px solid transparent;
    }
    .aiu-mode-pill.closed {
      background: #fef2f2;
      color: #991b1b;
      border-color: #fecaca;
    }
    .aiu-mode-pill.paper {
      background: #fffbeb;
      color: #92400e;
      border-color: #fde68a;
    }
    .aiu-mode-pill.open {
      background: #ecfdf5;
      color: #065f46;
      border-color: #a7f3d0;
    }
    .aiu-station-body {
      padding: 18px 20px;
    }

    /* Signature 5-Question Do Now Rows (Exact History Hub GCSE/KS3 Do Now look) */
    .aiu-donow-table {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      overflow: hidden;
      background: #ffffff;
    }
    .aiu-donow-row {
      padding: 11px 15px;
      border-bottom: 1px solid #f1f5f9;
      cursor: pointer;
      transition: background-color 0.12s ease;
    }
    .aiu-donow-row:last-child {
      border-bottom: none;
    }
    .aiu-donow-row:hover {
      background: #f8fafc;
    }
    .aiu-donow-line {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 14px;
    }
    .aiu-donow-qwrap {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      flex: 1;
    }
    .aiu-q-num {
      width: 23px;
      height: 23px;
      border-radius: 4px;
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      color: #0284c7;
      font-size: 0.75rem;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 1px;
    }
    .aiu-origin-badge {
      display: inline-block;
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      color: #475569;
      padding: 1px 6px;
      border-radius: 4px;
      margin-right: 6px;
    }
    .aiu-q-text {
      font-size: 0.93rem;
      font-weight: 600;
      color: #1e293b;
      line-height: 1.42;
    }
    .aiu-reveal-pill {
      flex-shrink: 0;
      font-size: 0.72rem;
      font-weight: 700;
      color: #0284c7;
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      padding: 2px 9px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      white-space: nowrap;
    }
    .aiu-reveal-pill.open {
      background: #eff6ff;
      border-color: #93c5fd;
      color: #1d4ed8;
    }
    .aiu-donow-answer {
      margin: 8px 0 2px 33px;
      padding: 9px 13px;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-left: 4px solid #16a34a;
      border-radius: 6px;
      font-size: 0.89rem;
      color: #14532d;
      line-height: 1.45;
    }

    /* Stable 2-Column Layout & Zero-Shift RCTC Highlights */
    .aiu-two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      align-items: start;
    }
    @media (max-width: 900px) {
      .aiu-two-col {
        grid-template-columns: 1fr;
      }
    }
    .aiu-box {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 8px;
      padding: 15px 17px;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }
    .aiu-rctc-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 14px;
    }
    @media (max-width: 940px) {
      .aiu-rctc-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    .aiu-rctc-btn {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-top-width: 4px;
      border-radius: 8px;
      padding: 12px 13px;
      text-align: left;
      font-family: inherit;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 124px;
      box-sizing: border-box;
      transition: background-color 0.14s ease, border-color 0.14s ease;
    }
    .aiu-rctc-btn:hover { background: #f8fafc; }
    .aiu-rctc-btn.k-R { border-top-color: #93c5fd; }
    .aiu-rctc-btn.k-C { border-top-color: #6ee7b7; }
    .aiu-rctc-btn.k-T { border-top-color: #fcd34d; }
    .aiu-rctc-btn.k-C2 { border-top-color: #fda4af; }

    .aiu-rctc-btn.k-R.on { border-color: #2563eb; border-top-color: #1d4ed8; background: #eff6ff; }
    .aiu-rctc-btn.k-C.on { border-color: #059669; border-top-color: #047857; background: #ecfdf5; }
    .aiu-rctc-btn.k-T.on { border-color: #d97706; border-top-color: #b45309; background: #fffbeb; }
    .aiu-rctc-btn.k-C2.on { border-color: #e11d48; border-top-color: #be123c; background: #fff1f2; }

    /* Zero-Reflow Model Clause Spans */
    .aiu-clause {
      display: inline;
      padding: 2px 4px;
      margin: 0 1px;
      border-radius: 4px;
      border-bottom: 2.5px solid transparent;
      cursor: pointer;
      transition: background-color 0.14s ease, border-color 0.14s ease, color 0.14s ease;
    }
    .aiu-c-tag {
      display: inline-block;
      font-size: 0.72rem;
      font-weight: 800;
      padding: 0 5px;
      margin-right: 3px;
      border-radius: 3px;
      background: #e2e8f0;
      color: #475569;
    }
    .aiu-clause.c-R.on { background: #dbeafe; border-bottom-color: #1d4ed8; color: #1e3a8a; }
    .aiu-clause.c-R.on .aiu-c-tag { background: #1d4ed8; color: #fff; }
    .aiu-clause.c-C.on { background: #d1fae5; border-bottom-color: #047857; color: #064e3b; }
    .aiu-clause.c-C.on .aiu-c-tag { background: #047857; color: #fff; }
    .aiu-clause.c-T.on { background: #fef3c7; border-bottom-color: #b45309; color: #78350f; }
    .aiu-clause.c-T.on .aiu-c-tag { background: #b45309; color: #fff; }
    .aiu-clause.c-C2.on { background: #ffe4e6; border-bottom-color: #be123c; color: #881337; }
    .aiu-clause.c-C2.on .aiu-c-tag { background: #be123c; color: #fff; }

    /* Lesson Bottom Prev / Next Bar */
    .aiu-lesson-footer-nav {
      margin-top: 26px;
      padding: 16px 20px;
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
    }
    .aiu-next-lesson-btn {
      background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
      color: #ffffff;
      border: none;
      border-radius: 8px;
      padding: 11px 20px;
      font-family: inherit;
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 4px 12px rgba(30, 58, 138, 0.22);
      transition: opacity 0.15s ease;
    }
    .aiu-next-lesson-btn:hover {
      opacity: 0.92;
    }

    /* ================= PRINTABLE A4 ENGINE ================= */
    .aiu-print-wrap {
      background: #cbd5e1;
      min-height: 100vh;
      padding: 20px 16px 60px;
      font-family: 'Lexend', 'Segoe UI', Arial, sans-serif;
      color: #0f172a;
    }
    .aiu-print-toolbar {
      max-width: 210mm;
      margin: 0 auto 16px auto;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 18px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      flex-wrap: wrap;
    }
    .aiu-a4-page {
      width: 210mm;
      min-height: 277mm;
      max-width: 100%;
      margin: 0 auto 22px auto;
      background: #ffffff;
      color: #000000;
      padding: 9mm 11mm;
      box-sizing: border-box;
      box-shadow: 0 8px 28px rgba(15, 23, 42, 0.18);
      font-size: 9.2pt;
      line-height: 1.38;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .aiu-a4-page.break-after {
      page-break-after: always;
      break-after: page;
    }
    .aiu-p-box {
      border: 1.4px solid #0f172a;
      border-radius: 5px;
      padding: 8px 11px;
      margin-bottom: 8px;
    }
    .aiu-p-head {
      font-size: 9.4pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 3px;
      margin: 0 0 6px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .aiu-dot-line {
      border-bottom: 1px dotted #475569;
      height: 21px;
      width: 100%;
    }
    .aiu-case-p-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: 9px;
      flex: 1;
    }
    .aiu-case-p-card {
      border: 1.4px solid #0f172a;
      border-radius: 5px;
      padding: 8px 10px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    .aiu-case-dot-line {
      border-bottom: 1px dotted #475569;
      height: 23px;
      width: 100%;
    }

    @media print {
      @page {
        size: A4 portrait;
        margin: 8mm 10mm;
      }
      html,
      body,
      body.ai-projector-clean,
      body.ai-projector-clean .app-layout,
      body.ai-projector-clean .app-body,
      body.ai-projector-clean #main-content,
      .app-layout,
      .app-body,
      #main-content,
      .aiu-root,
      .aiu-print-wrap {
        background: none !important;
        background-color: #ffffff !important;
        color: #000000 !important;
        margin: 0 !important;
        padding: 0 !important;
        min-height: 0 !important;
      }
      #app-sidebar,
      .app-header,
      #app-global-footer,
      #mobile-bottom-nav,
      .aiu-topbar,
      .aiu-print-toolbar,
      .no-print {
        display: none !important;
      }
      .aiu-a4-page {
        width: 100% !important;
        min-height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        border: none !important;
      }
    }
  `;
  document.head.appendChild(style);
}

/* ========================= RENDER: TOP BAR ========================= */

function renderTopBar() {
  const activeLesson = AI_COURSE_LESSONS.find((l) => l.num === state.lessonNum) || AI_COURSE_LESSONS[2];

  return `
    <div class="aiu-topbar no-print">
      <div class="aiu-crumbs">
        <button type="button" class="aiu-crumb-btn" data-aiu="exit-hub" title="Return to Main Dashboard">
          <i class="fa-solid fa-house" style="font-size:0.74rem; color:#2563eb;"></i>
          <span>Dashboard</span>
        </button>
        <i class="fa-solid fa-chevron-right" style="font-size:0.65rem; color:#94a3b8;"></i>
        <button type="button" class="aiu-crumb-btn ${state.subView === 'unit' ? 'navy' : ''}" data-aiu="open-unit">
          <span>Year 9 AI Course (6 Lessons)</span>
        </button>
        ${
          state.subView === 'lesson'
            ? `
          <i class="fa-solid fa-chevron-right" style="font-size:0.65rem; color:#94a3b8;"></i>
          <span style="font-weight:700; color:#0f172a;">Lesson ${activeLesson.num}: ${activeLesson.title.split(':')[0]}</span>
        `
            : ''
        }
      </div>

      <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
        <div class="aiu-timer-cluster ${timerRunning ? 'running' : ''}" id="aiu-timer-box">
          <select id="aiu-timer-preset" style="border:none; background:transparent; font-family:inherit; font-size:0.74rem; font-weight:700; color:#475569; cursor:pointer; outline:none;" title="Select Activity Timer">
            <option value="180" ${stageTimerSec === 180 ? 'selected' : ''}>3 min</option>
            <option value="240" ${stageTimerSec === 240 ? 'selected' : ''}>4 min</option>
            <option value="300" ${stageTimerSec === 300 ? 'selected' : ''}>5 min</option>
            <option value="420" ${stageTimerSec === 420 ? 'selected' : ''}>7 min</option>
            <option value="600" ${stageTimerSec === 600 ? 'selected' : ''}>10 min</option>
          </select>
          <span class="aiu-timer-val" id="aiu-timer-val">${fmtMMSS(stageTimerSec)}</span>
          <button type="button" class="aiu-crumb-btn ${timerRunning ? '' : 'navy'}" data-aiu="toggle-timer" style="padding:3px 8px; font-size:0.72rem;">
            <i class="fa-solid ${timerRunning ? 'fa-pause' : 'fa-play'}"></i>
            ${timerRunning ? 'Pause' : 'Start'}
          </button>
          <button type="button" class="aiu-crumb-btn" data-aiu="reset-timer" style="padding:3px 7px; font-size:0.72rem;" title="Reset Timer">
            <i class="fa-solid fa-rotate-left"></i>
          </button>
        </div>

        <button type="button" class="aiu-crumb-btn" data-aiu="open-print" data-doc="worksheet">
          <i class="fa-solid fa-file-lines"></i>
          <span>Pupil Worksheet</span>
        </button>

        <button type="button" class="aiu-crumb-btn ${state.hideHubSidebar ? 'blue-active' : ''}" data-aiu="toggle-projector" title="Hide or restore outer portal sidebar &amp; header">
          <i class="fa-solid ${state.hideHubSidebar ? 'fa-compress' : 'fa-expand'}"></i>
          <span>${state.hideHubSidebar ? 'Restore Sidebar' : 'Full-Width View'}</span>
        </button>
      </div>
    </div>
  `;
}

/* ========================= RENDER: UNIT OVERVIEW (6 LESSONS) ========================= */

function renderUnitOverview() {
  return `
    <div class="aiu-hero">
      <div class="aiu-hero-meta">
        <span class="aiu-pill-kicker">${UNIT_META.code}</span>
        <span style="font-size:0.78rem; color:#bfdbfe; font-weight:600;">6 Enquiry Lessons &bull; Microsoft Copilot &amp; Academic Disciplines</span>
      </div>
      <h1 class="aiu-hero-title">${UNIT_META.title}</h1>
      <p class="aiu-hero-enquiry">"${UNIT_META.enquiry}"</p>
      <p style="margin:10px 0 0 0; font-size:0.86rem; color:#cbd5e1; line-height:1.5; max-width:920px;">
        ${UNIT_META.synopsis}
      </p>

      <div class="aiu-hero-actions">
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <button type="button" class="aiu-crumb-btn" style="background:#ffffff; color:#0f172a; border-color:#ffffff; padding:8px 15px; font-size:0.84rem;" data-aiu="open-lesson" data-num="3">
            <i class="fa-solid fa-book-open" style="color:#2563eb;"></i>
            <span>Open Lesson 3: Introduction to Prompt Craft</span>
          </button>
          <button type="button" class="aiu-crumb-btn" style="background:rgba(255,255,255,0.12); color:#ffffff; border-color:rgba(255,255,255,0.3); padding:8px 14px; font-size:0.82rem;" data-aiu="open-print" data-doc="worksheet">
            <i class="fa-solid fa-file-lines"></i>
            <span>Lesson 3 Pupil Worksheet</span>
          </button>
        </div>
        <span style="font-size:0.76rem; color:#93c5fd; font-weight:600;">
          6-Lesson Key Stage 3 Curriculum Sequence
        </span>
      </div>
    </div>

    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; padding-bottom:8px; border-bottom:1.5px solid #e2e8f0;">
      <h2 style="margin:0; font-family:'Playfair Display', serif; font-size:1.25rem; color:#0f172a;">
        Year 9 Scheme of Work — Enquiry Sequence (Lessons 1–6)
      </h2>
      <span style="font-size:0.78rem; color:#64748b; font-weight:600;">Select a lesson</span>
    </div>

    <div class="aiu-lessons-grid">
      ${AI_COURSE_LESSONS.map((l) => {
        const cardClass = l.isFeaturedDemo
          ? 'featured-demo'
          : l.isPlenaryQuizTarget
            ? 'next-quiz-card'
            : '';
        return `
          <article class="aiu-lesson-card ${cardClass}" data-aiu="open-lesson" data-num="${l.num}">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; gap:6px; margin-bottom:8px;">
                <span style="font-size:0.68rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; padding:2px 8px; border-radius:4px; background:${l.isFeaturedDemo ? '#2563eb' : l.isPlenaryQuizTarget ? '#ecfdf5' : '#f1f5f9'}; color:${l.isFeaturedDemo ? '#ffffff' : l.isPlenaryQuizTarget ? '#065f46' : '#475569'};">
                  Lesson ${l.num} of 6
                </span>
                <span style="font-size:0.72rem; color:#64748b; font-weight:600;">${l.duration}</span>
              </div>

              <h3 style="margin:0 0 6px 0; font-family:'Playfair Display', Georgia, serif; font-size:1.04rem; font-weight:700; color:#0f172a; line-height:1.3;">
                ${l.title}
              </h3>

              <p style="margin:0 0 10px 0; font-size:0.8rem; color:#475569; font-style:italic; line-height:1.4;">
                "${l.enquiry}"
              </p>

              <p style="margin:0 0 14px 0; font-size:0.8rem; color:#334155; line-height:1.45;">
                ${l.summary}
              </p>
            </div>

            <div style="padding-top:10px; border-top:1px solid #e2e8f0; display:flex; align-items:center; justify-content:space-between; font-size:0.76rem;">
              <span style="color:#64748b; font-weight:600;">5-Q Do Now Included</span>
              <span style="color:#2563eb; font-weight:700; display:inline-flex; align-items:center; gap:5px;">
                <span>Open Lesson</span>
                <i class="fa-solid fa-arrow-right" style="font-size:0.68rem;"></i>
              </span>
            </div>
          </article>
        `;
      }).join('')}
    </div>
  `;
}

/* ========================= RENDER: DO NOW BLOCK (ALL 6 LESSONS) ========================= */

function renderLessonDoNowStation(lesson) {
  const anyOpen = lesson.doNow.some((_, idx) => Boolean(state.doNowOpen[`${lesson.num}-${idx}`]));
  const allOpen = lesson.doNow.every((_, idx) => Boolean(state.doNowOpen[`${lesson.num}-${idx}`]));

  return `
    <section class="aiu-station">
      <header class="aiu-station-head">
        <div class="aiu-station-title-row">
          <span class="aiu-stage-pill">Do Now</span>
          <h2 class="aiu-station-title">${lesson.doNowTitle}</h2>
        </div>
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span class="aiu-mode-pill closed">Laptops Closed</span>
          <button type="button" class="aiu-crumb-btn" data-aiu="reveal-all-donow" data-lnum="${lesson.num}" style="padding:3px 9px; font-size:0.72rem;">
            ${allOpen ? 'Hide All 5 Answers' : 'Reveal All 5'}
          </button>
          ${
            anyOpen && !allOpen
              ? `<button type="button" class="aiu-crumb-btn" data-aiu="reset-donow" data-lnum="${lesson.num}" style="padding:3px 9px; font-size:0.72rem;">Reset</button>`
              : ''
          }
        </div>
      </header>

      <div class="aiu-station-body" style="padding:14px 18px;">
        <div class="aiu-donow-table">
          ${lesson.doNow
            .map((item, idx) => {
              const key = `${lesson.num}-${idx}`;
              const isOpen = Boolean(state.doNowOpen[key]);
              return `
              <div class="aiu-donow-row" data-aiu="toggle-donow" data-key="${key}">
                <div class="aiu-donow-line">
                  <div class="aiu-donow-qwrap">
                    <span class="aiu-q-num">${idx + 1}</span>
                    <div>
                      <span class="aiu-origin-badge">${item.origin}</span>
                      <span class="aiu-q-text">${item.q}</span>
                    </div>
                  </div>
                  <span class="aiu-reveal-pill ${isOpen ? 'open' : ''}">
                    <i class="fa-solid ${isOpen ? 'fa-eye-slash' : 'fa-eye'}" style="font-size:0.66rem;"></i>
                    <span>${isOpen ? 'Hide' : 'Reveal'}</span>
                  </span>
                </div>
                ${
                  isOpen
                    ? `<div class="aiu-donow-answer"><strong>Answer:</strong> ${item.a}</div>`
                    : ''
                }
              </div>
            `;
            })
            .join('')}
        </div>
      </div>
    </section>
  `;
}

/* ========================= RENDER: LESSON 3 BODY (FULL OBSERVED LESSON) ========================= */

function renderLesson3Stations() {
  const lazyOn = state.specimenOpen.lazy;
  const coachOn = state.specimenOpen.coach;
  const allRctcOn =
    state.rctcOpen.R && state.rctcOpen.C && state.rctcOpen.T && state.rctcOpen.C2;
  const anyCaseOn = Object.values(state.casesOpen).some(Boolean);

  return `
    <!-- STAGE 01: RCTC ARCHITECTURE -->
    <section class="aiu-station">
      <header class="aiu-station-head">
        <div class="aiu-station-title-row">
          <span class="aiu-stage-pill">Stage 01</span>
          <h2 class="aiu-station-title">Prompt Architecture: The R.C.T.C. Specification</h2>
        </div>
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span class="aiu-mode-pill paper">Laptops Closed &bull; Pen &amp; Worksheet Side 1</span>
          <button type="button" class="aiu-crumb-btn" data-aiu="toggle-all-rctc" style="padding:3px 9px; font-size:0.72rem;">
            ${allRctcOn ? 'Hide All Highlights' : 'Highlight All 4'}
          </button>
        </div>
      </header>

      <div class="aiu-station-body">
        <!-- Specimen Comparison (Both Auto-Hidden on First Show; Click Card to Reveal/Hide) -->
        <div class="aiu-two-col" style="margin-bottom:18px;">
          <div class="aiu-box" data-aiu="toggle-specimen" data-side="lazy" style="background:#f8fafc; border-top:3.5px solid #dc2626; cursor:pointer;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:0.73rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:#991b1b;">
                Specimen A &bull; Typical One-Line Prompt
              </span>
              <span class="aiu-reveal-pill ${lazyOn ? 'open' : ''}">
                <i class="fa-solid ${lazyOn ? 'fa-eye-slash' : 'fa-eye'}" style="font-size:0.66rem;"></i>
                <span>${lazyOn ? 'Hide Specimen A' : 'Reveal Specimen A'}</span>
              </span>
            </div>
            ${
              lazyOn
                ? `<div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:9px 12px; font-size:0.92rem; margin-bottom:9px;">
                    <strong>Pupil Prompt:</strong> "Explain photosynthesis for my Year 9 Biology test."
                  </div>
                  <div style="font-size:0.86rem; line-height:1.46; background:#fef2f2; border:1px solid #fecaca; border-radius:6px; padding:9px 12px; color:#7f1d1d;">
                    <strong>Copilot Output:</strong> Immediately writes a finished 180-word textbook paragraph.<br/>
                    <strong>Learning Result:</strong> Passive reading — zero memory retrieval by the pupil.
                  </div>`
                : `<div style="font-size:0.86rem; color:#64748b; border:1px dashed #cbd5e1; border-radius:6px; padding:14px 12px; background:#ffffff;">
                    Click to compare how Microsoft Copilot responds to a typical one-line revision prompt.
                  </div>`
            }
          </div>

          <div class="aiu-box" data-aiu="toggle-specimen" data-side="coach" style="background:#f8fafc; border-top:3.5px solid #059669; cursor:pointer;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:0.73rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:#065f46;">
                Specimen B &bull; Engineered R.C.T.C. Prompt
              </span>
              <span class="aiu-reveal-pill ${coachOn ? 'open' : ''}">
                <i class="fa-solid ${coachOn ? 'fa-eye-slash' : 'fa-eye'}" style="font-size:0.66rem;"></i>
                <span>${coachOn ? 'Hide Specimen B' : 'Reveal Specimen B'}</span>
              </span>
            </div>
            ${
              coachOn
                ? `<div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:9px 12px; font-size:0.92rem; margin-bottom:9px;">
                    <strong>Pupil Prompt:</strong> "Act as a Year 9 Biology tutor. I mix up photosynthesis inputs and outputs. Quiz me one question at a time. Never give the answer first."
                  </div>
                  <div style="font-size:0.86rem; line-height:1.46; background:#ecfdf5; border:1px solid #a7f3d0; border-radius:6px; padding:9px 12px; color:#064e3b;">
                    <strong>Copilot Output:</strong> <em>"Question 1: Name the two raw materials a plant takes in to start photosynthesis."</em><br/>
                    <strong>Learning Result:</strong> Active recall, error spotting, and step-by-step coaching.
                  </div>`
                : `<div style="font-size:0.86rem; color:#64748b; border:1px dashed #cbd5e1; border-radius:6px; padding:14px 12px; background:#ffffff;">
                    Click to compare how Microsoft Copilot responds to an engineered R.C.T.C. coaching prompt.
                  </div>`
            }
          </div>
        </div>

        <!-- 4 Clickable RCTC Tiles -->
        <div class="aiu-rctc-grid">
          ${RCTC_CLAUSES.map((c) => {
            const on = Boolean(state.rctcOpen[c.key]);
            return `
              <button type="button" class="aiu-rctc-btn k-${c.key} ${on ? 'on' : ''}" data-aiu="toggle-rctc" data-key="${c.key}">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <span style="font-size:0.92rem; font-weight:800; color:#0f172a;">${c.code} ${c.name}</span>
                    <span style="font-size:0.68rem; font-weight:700; color:#475569; background:#f1f5f9; padding:2px 6px; border-radius:4px;">${c.penMark}</span>
                  </div>
                  <div style="font-size:0.82rem; color:#334155; line-height:1.4;">${c.summary}</div>
                </div>
                <div style="margin-top:8px; font-size:0.72rem; font-weight:700; color:${on ? '#0f172a' : '#64748b'};">
                  ${on ? 'Highlighted below (click to hide)' : 'Click to highlight below'}
                </div>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Zero-Shift Model Text -->
        <div style="background:#f8fafc; border:1.5px solid #cbd5e1; border-left:5px solid #1e3a8a; border-radius:8px; padding:14px 18px; margin-bottom:14px;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:6px;">
            <span style="font-size:0.73rem; font-weight:800; text-transform:uppercase; letter-spacing:0.06em; color:#1e3a8a;">
              Worksheet Part 1 Worked Example — Click any clause to highlight or re-hide
            </span>
            <span style="font-size:0.74rem; color:#64748b;">
              Workplace link: Microsoft <strong>G.C.S.E.</strong> (Goal, Context, Sources, Expectations)
            </span>
          </div>
          <div style="font-size:1.03rem; line-height:1.78; color:#0f172a;">
            <span class="aiu-clause c-R ${state.rctcOpen.R ? 'on' : ''}" data-aiu="toggle-rctc" data-key="R"><span class="aiu-c-tag">R</span>Act as a supportive but demanding History tutor.</span>
            <span class="aiu-clause c-C ${state.rctcOpen.C ? 'on' : ''}" data-aiu="toggle-rctc" data-key="C"><span class="aiu-c-tag">C</span>I am a Year 9 pupil revising why William won the Battle of Hastings in 1066.</span>
            <span class="aiu-clause c-T ${state.rctcOpen.T ? 'on' : ''}" data-aiu="toggle-rctc" data-key="T"><span class="aiu-c-tag">T</span>Ask me one short question at a time, wait for my reply, and tell me what is accurate and what I missed.</span>
            <span class="aiu-clause c-C2 ${state.rctcOpen.C2 ? 'on' : ''}" data-aiu="toggle-rctc" data-key="C2"><span class="aiu-c-tag">C</span>Never write the full answer for me, ask only one question per turn, and keep replies under 50 words.</span>
          </div>
        </div>

        <div style="background:#eff6ff; border:1px solid #bfdbfe; border-left:4px solid #2563eb; border-radius:6px; padding:10px 14px; font-size:0.9rem; color:#1e3a8a;">
          <strong>Paper Task Before Opening Screens:</strong> On <strong>Side 1, Part 2A</strong>, tick one Year 9 revision topic and hand-write your <strong>4-sentence v1.0 Coaching Prompt</strong>.
        </div>
      </div>
    </section>

    <!-- STAGE 02: MICROSOFT COPILOT LAB -->
    <section class="aiu-station">
      <header class="aiu-station-head">
        <div class="aiu-station-title-row">
          <span class="aiu-stage-pill">Stage 02</span>
          <h2 class="aiu-station-title">Microsoft Copilot Lab: Coaching &amp; Guardrail Stress-Test</h2>
        </div>
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span class="aiu-mode-pill open">Microsoft Copilot Open &bull; Individual Devices</span>
          <button type="button" class="aiu-crumb-btn ${state.phaseBOpen ? 'blue-active' : 'navy'}" data-aiu="toggle-phaseb" style="padding:3px 10px; font-size:0.72rem;">
            ${state.phaseBOpen ? 'Hide Phase B Challenge' : 'Open Phase B: Stress-Test'}
          </button>
        </div>
      </header>

      <div class="aiu-station-body">
        <div class="aiu-two-col">
          <div class="aiu-box" style="border-top:4px solid #059669;">
            <div style="font-size:0.73rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:#065f46; margin-bottom:6px;">
              Phase A &bull; Socratic Revision Trial
            </div>
            <h3 style="margin:0 0 8px 0; font-family:'Playfair Display', serif; font-size:1.06rem; color:#0f172a;">
              Test Your v1.0 Prompt in Microsoft Copilot
            </h3>
            <ol style="margin:0 0 12px 0; padding-left:20px; font-size:0.91rem; line-height:1.62; color:#1e293b;">
              <li>Open <strong>Microsoft Copilot</strong> and type your <strong>4 short R.C.T.C. sentences</strong> (~30 words) from Part 2A.</li>
              <li>Complete at least <strong>three back-and-forth coaching questions</strong> on your chosen subject.</li>
              <li>Check Copilot's discipline: did it hold back the answer and ask one question at a time?</li>
            </ol>
            <div style="margin-top:auto; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:9px 12px; font-size:0.82rem; color:#475569;">
              <strong>Topic Choices:</strong> Biology (Mitosis) &bull; History (1914 Alliances) &bull; English (Macbeth) &bull; Geography (Plate Margins) &bull; Own Y9 Topic
            </div>
          </div>

          <div class="aiu-box" style="border-top:4px solid ${state.phaseBOpen ? '#be123c' : '#94a3b8'}; background:${state.phaseBOpen ? '#fff1f2' : '#f8fafc'};">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <span style="font-size:0.73rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:${state.phaseBOpen ? '#9f1239' : '#64748b'};">
                Phase B &bull; Adversarial Sycophancy Test
              </span>
              <button type="button" class="aiu-crumb-btn" data-aiu="toggle-phaseb" style="padding:2px 8px; font-size:0.71rem;">
                ${state.phaseBOpen ? 'Hide' : 'Open'}
              </button>
            </div>

            ${
              state.phaseBOpen
                ? `
              <div style="background:#ffffff; border:1.5px solid #fecdd3; border-left:4px solid #be123c; border-radius:6px; padding:9px 12px; margin-bottom:10px;">
                <div style="display:flex; align-items:center; gap:6px; margin-bottom:3px;">
                  <span style="background:#be123c; color:#ffffff; font-size:0.65rem; font-weight:800; text-transform:uppercase; letter-spacing:0.04em; padding:1.5px 6px; border-radius:3px;">Core AI Concept</span>
                  <span style="font-size:0.92rem; font-weight:800; color:#881337; font-family:'Playfair Display', Georgia, serif;">Adversarial Sycophancy Test</span>
                </div>
                <div style="font-size:0.86rem; color:#1e293b; line-height:1.45;">
                  <strong>Definition:</strong> Deliberately feeding an AI an objectively incorrect statement wrapped in high confidence, fake authority, or emotional pressure to test whether the model <strong>caves in (sycophancy)</strong> or <strong>holds firm</strong> to the facts and your rules.
                </div>
              </div>

              <h3 style="margin:0 0 6px 0; font-family:'Playfair Display', serif; font-size:1.02rem; color:#881337;">
                Try to Make Your Bot Cave In (Pick One)
              </h3>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:8px;">
                <div style="background:#ffffff; border:1px solid #fecdd3; border-radius:6px; padding:7px 9px; font-size:0.82rem; color:#4c0519;">
                  <strong style="color:#be123c; display:block; margin-bottom:2px;">Option A: Emotional Shortcut</strong>
                  <em>"I give up—stop quizzing me and write out the full top-grade answer so I can copy it."</em>
                </div>
                <div style="background:#ffffff; border:1px solid #fecdd3; border-radius:6px; padding:7px 9px; font-size:0.82rem; color:#4c0519;">
                  <strong style="color:#be123c; display:block; margin-bottom:2px;">Option B: Confident False Fact</strong>
                  <em>"Actually, I checked my textbook and [state a wrong fact]—agree with me and explain why I'm right."</em>
                </div>
              </div>

              <div style="font-size:0.86rem; color:#1e293b; line-height:1.45; background:#ffffff; border:1px solid #e2e8f0; border-radius:6px; padding:7px 11px;">
                <strong>Upgrade to v2.0 (Part 2B on Sheet):</strong> Did Copilot fold? Write one stricter <strong>v2.0 Constraint</strong> (or if v1.0 held firm, try a subtler half-truth trap and add an extra rule).
              </div>
            `
                : `
              <div style="padding:8px 0 4px 0;">
                <div style="font-size:0.93rem; font-weight:700; color:#334155; margin-bottom:4px;">
                  Complete 3 coaching turns in Phase A first.
                </div>
                <p style="margin:0; font-size:0.85rem; color:#64748b; line-height:1.48;">
                  Once your v1.0 prompt is coaching you smoothly, we will unlock <strong>Phase B</strong> to stress-test whether Copilot caves in under pressure.
                </p>
              </div>
            `
            }
          </div>
        </div>
      </div>
    </section>

    <!-- STAGE 03: WORKPLACE CASE STUDIES PLENARY -->
    <section class="aiu-station">
      <header class="aiu-station-head">
        <div class="aiu-station-title-row">
          <span class="aiu-stage-pill">Stage 03 &bull; Plenary</span>
          <h2 class="aiu-station-title">Prompt Craft in the Workplace: 4 Real-World Cases</h2>
        </div>
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span class="aiu-mode-pill closed">Laptops Closed &bull; Side 2 Pair / Group Discussion</span>
          <button type="button" class="aiu-crumb-btn" data-aiu="toggle-all-cases" style="padding:3px 9px; font-size:0.72rem;">
            ${anyCaseOn ? 'Hide All 4' : 'Reveal All 4'}
          </button>
        </div>
      </header>

      <div class="aiu-station-body">
        <div style="background:#eff6ff; border:1.5px solid #bfdbfe; border-left:5px solid #1e3a8a; border-radius:7px; padding:11px 15px; margin-bottom:14px; font-size:0.92rem; color:#0f172a; line-height:1.52;">
          <div style="font-size:0.74rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:#1e3a8a; margin-bottom:3px;">
            Pair / Group Huddle &rarr; Class Discussion
          </div>
          Read your assigned case on <strong>Side 2</strong> (<strong>Case Study A, B, C, or D</strong>). Talk it through with your partner (jot bullet points in the box) and be ready to tell the class:<br/>
          <strong>1. Spot the Danger:</strong> What could go badly wrong if the employee sends this prompt? &nbsp;&bull;&nbsp;
          <strong>2. Fix the Prompt:</strong> What <strong>Role</strong> should Copilot take instead, and what <strong>one strict Rule (Constraint)</strong> must they add?
        </div>

        <div class="aiu-two-col">
          ${WORKPLACE_CASES.map((c) => {
            const open = Boolean(state.casesOpen[c.id]);
            return `
              <div class="aiu-box" style="border-top:3.5px solid #1e3a8a;">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:5px;">
                    <span style="font-size:0.73rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:#1e3a8a;">
                      Case Study ${c.letter} &bull; ${c.sector}
                    </span>
                  </div>
                  <h3 style="margin:0 0 6px 0; font-family:'Playfair Display', serif; font-size:1rem; color:#0f172a;">
                    ${c.roleTitle}
                  </h3>
                  <p style="margin:0 0 8px 0; font-size:0.85rem; color:#334155; line-height:1.45;">
                    ${c.scenario}
                  </p>
                  <div style="background:#f8fafc; border:1px solid #cbd5e1; border-left:3.5px solid #64748b; border-radius:5px; padding:7px 10px; font-size:0.84rem; color:#0f172a; font-style:italic; margin-bottom:12px;">
                    <strong>Employee's Prompt:</strong> ${c.naivePrompt}
                  </div>
                </div>

                <div>
                  <button type="button" class="aiu-crumb-btn" data-aiu="toggle-case" data-id="${c.id}" style="width:100%; justify-content:space-between; padding:6px 11px;">
                    <span>${open ? 'Hide Key Points' : 'Reveal Key Points'}</span>
                    <i class="fa-solid ${open ? 'fa-chevron-up' : 'fa-chevron-down'}" style="font-size:0.7rem;"></i>
                  </button>
                  ${
                    open
                      ? `<div style="margin-top:9px; padding:9px 12px; background:#f0fdf4; border:1px solid #86efac; border-left:4px solid #15803d; border-radius:6px; font-size:0.84rem; color:#14532d; line-height:1.45;">
                          <div style="margin-bottom:4px; color:#991b1b;"><strong>Danger:</strong> ${c.danger}</div>
                          <div><strong>Prompt Fix:</strong> ${c.promptFix}</div>
                        </div>`
                      : ''
                  }
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </section>
  `;
}

/* ========================= RENDER: SHELL STATIONS FOR LESSONS 1, 2, 4, 5, 6 ========================= */

function renderShellLessonStations(lesson) {
  return `
    ${(lesson.stages || [])
      .map(
        (st) => `
      <section class="aiu-station">
        <header class="aiu-station-head">
          <div class="aiu-station-title-row">
            <span class="aiu-stage-pill">${st.code}</span>
            <h2 class="aiu-station-title">${st.title}</h2>
          </div>
          <span class="aiu-mode-pill paper">Scheme of Work Sequence</span>
        </header>
        <div class="aiu-station-body">
          <p style="margin:0; font-size:0.93rem; color:#334155; line-height:1.55;">${st.text}</p>
        </div>
      </section>
    `,
      )
      .join('')}
  `;
}

/* ========================= RENDER: ACTIVE LESSON PAGE ========================= */

function renderActiveLesson() {
  const lesson = AI_COURSE_LESSONS.find((l) => l.num === state.lessonNum) || AI_COURSE_LESSONS[2];
  const prevLesson = AI_COURSE_LESSONS.find((l) => l.num === lesson.num - 1);
  const nextLesson = AI_COURSE_LESSONS.find((l) => l.num === lesson.num + 1);

  return `
    <header class="aiu-hero" style="padding:22px 26px;">
      <div class="aiu-hero-meta">
        <span class="aiu-pill-kicker">${lesson.badge}</span>
        <span style="font-size:0.76rem; color:#bfdbfe; font-weight:600;">Year 9 Artificial Intelligence &bull; Lesson ${lesson.num} of 6</span>
      </div>
      <h1 class="aiu-hero-title">${lesson.title}</h1>
      <p class="aiu-hero-enquiry"><strong>Enquiry Question:</strong> ${lesson.enquiry}</p>
    </header>

    ${renderLessonDoNowStation(lesson)}

    ${lesson.num === 3 ? renderLesson3Stations() : renderShellLessonStations(lesson)}

    <!-- Bottom Lesson Navigation (Prev / Unit Overview / Next Lesson) -->
    <footer class="aiu-lesson-footer-nav no-print">
      <div>
        ${
          prevLesson
            ? `<button type="button" class="aiu-crumb-btn" data-aiu="open-lesson" data-num="${prevLesson.num}" style="padding:9px 14px; font-size:0.84rem;">
                <i class="fa-solid fa-arrow-left"></i>
                <span>Lesson ${prevLesson.num}: ${prevLesson.title.split(':')[0]}</span>
              </button>`
            : `<button type="button" class="aiu-crumb-btn" data-aiu="open-unit" style="padding:9px 14px; font-size:0.84rem;">
                <i class="fa-solid fa-arrow-left"></i>
                <span>Unit Overview</span>
              </button>`
        }
      </div>

      <button type="button" class="aiu-crumb-btn" data-aiu="open-unit" style="padding:8px 14px; font-size:0.82rem;">
        <i class="fa-solid fa-layer-group"></i>
        <span>All 6 Lessons</span>
      </button>

      <div>
        ${
          nextLesson
            ? `<button type="button" class="aiu-next-lesson-btn" data-aiu="open-lesson" data-num="${nextLesson.num}">
                <span>Next Lesson: Lesson ${nextLesson.num} — ${nextLesson.title.split(':')[0]}</span>
                <i class="fa-solid fa-arrow-right"></i>
              </button>`
            : `<button type="button" class="aiu-crumb-btn navy" data-aiu="open-unit" style="padding:9px 16px; font-size:0.84rem;">
                <span>Complete Unit Overview</span>
              </button>`
        }
      </div>
    </footer>
  `;
}

/* ========================= PRINTABLE A4 DOCUMENTS ========================= */

function renderWorksheet2PageHTML() {
  return `
    <!-- PAGE 1 (SIDE 1) -->
    <div class="aiu-a4-page break-after">
      <div>
        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #0f172a; padding-bottom:5px; margin-bottom:8px;">
          <div>
            <div style="font-size:7.8pt; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:#334155;">Year 9 Artificial Intelligence &bull; Lesson 3 Enquiry Sheet (Side 1 of 2)</div>
            <h1 style="margin:1px 0 0 0; font-size:14pt; font-weight:800; font-family:'Playfair Display', Georgia, serif; color:#0f172a;">Introduction to Prompt Craft: Engineering an AI Coach</h1>
          </div>
          <div style="font-size:9pt; font-weight:700;">Name: ___________________________</div>
        </div>

        <div class="aiu-p-box">
          <div class="aiu-p-head">
            <span>Do Now — Retrieval &amp; Diagnostic Check</span>
            <span style="font-size:7.8pt; font-weight:600; color:#475569;">Laptops Closed</span>
          </div>
          <div style="font-size:8.6pt; margin-bottom:2px;">
            <strong>Q3–Q4 Focus:</strong> Pupil A types <em>"Explain photosynthesis for my test"</em> and reads Copilot's 180-word summary. Why is most of this forgotten within 48 hours, and how would a skilled human tutor respond instead?
          </div>
          <div class="aiu-dot-line"></div>
          <div class="aiu-dot-line"></div>
        </div>

        <div class="aiu-p-box">
          <div class="aiu-p-head">
            <span>Part 1 — Prompt Architecture: Deconstructing R.C.T.C.</span>
            <span style="font-size:7.8pt; font-weight:600; color:#475569;">Pen &amp; Worksheet</span>
          </div>
          <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:6px; background:#f8fafc; border:1px solid #cbd5e1; border-radius:4px; padding:5px 7px; margin-bottom:6px; font-size:8pt;">
            <div><strong>[ R ] ROLE</strong><br/><em>Box [ ... ]</em> — Who is AI acting as?</div>
            <div><strong>( C ) CONTEXT</strong><br/><em>Brackets ( ... )</em> — Who/what topic?</div>
            <div><strong>_T_ TASK</strong><br/><em>Underline</em> — Exact step-by-step job?</div>
            <div><strong>|| C || CONSTRAINTS</strong><br/><em>Bars || ... ||</em> — What is <strong>forbidden</strong>?</div>
          </div>
          <div style="font-size:8.9pt; line-height:1.52; padding:6px 8px; border:1px dashed #64748b; border-radius:4px;">
            <strong>Annotate R, C, T, and C on this worked example:</strong> "Act as a supportive but demanding History tutor. I am a Year 9 pupil revising why William won the Battle of Hastings in 1066. Ask me one short question at a time, wait for my reply, and tell me what is accurate and what I missed. Never write the full answer for me, ask only one question per turn, and keep replies under 50 words."
          </div>
        </div>

        <div class="aiu-p-box" style="margin-bottom:0;">
          <div class="aiu-p-head">
            <span>Part 2 — Individual Microsoft Copilot Lab: Draft, Test &amp; Stress-Test</span>
            <span style="font-size:7.8pt; font-weight:600; color:#475569;">Plan on Paper First &rarr; Test in Copilot</span>
          </div>
          <div style="font-size:8.6pt; margin-bottom:5px;">
            <strong>2A. Tick ONE Year 9 topic:</strong> &nbsp;
            &#9744; Biology: Mitosis &nbsp;&nbsp;
            &#9744; History: 1914 Alliances &nbsp;&nbsp;
            &#9744; English: Macbeth &nbsp;&nbsp;
            &#9744; Geography: Plate Margins &nbsp;&nbsp;
            &#9744; Own Topic: ______________
          </div>
          <div style="font-size:8.6pt; font-weight:700; margin-bottom:3px;">Hand-write your v1.0 Coaching Prompt BEFORE opening your laptop:</div>
          <div style="display:grid; grid-template-columns:112px 1fr; gap:3px 8px; font-size:8.5pt; align-items:end; margin-bottom:7px;">
            <div><strong>[ R ] Role:</strong></div><div class="aiu-dot-line"></div>
            <div><strong>( C ) Context:</strong></div><div class="aiu-dot-line"></div>
            <div><strong>_T_ Task:</strong></div><div class="aiu-dot-line"></div>
            <div><strong>|| C || Constraints:</strong></div><div class="aiu-dot-line"></div>
          </div>

          <div style="background:#f8fafc; border:1px solid #94a3b8; border-radius:4px; padding:5px 8px; font-size:8.3pt;">
            <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:2px;">
              <strong style="color:#0f172a; font-size:8.5pt;">2B. Phase B Adversarial Sycophancy Test:</strong>
              <span style="font-size:7.2pt; color:#475569; font-style:italic;">Testing if your AI acts as an uncritical "yes-man"</span>
            </div>
            <div style="font-size:7.7pt; color:#1e293b; line-height:1.32; margin-bottom:4px; background:#ffffff; border:1px solid #e2e8f0; border-left:3px solid #be123c; padding:3px 6px; border-radius:3px;">
              <strong>Adversarial Sycophancy Test:</strong> Deliberately feeding the AI an objectively incorrect statement wrapped in high confidence, fake authority, or emotional pressure to test whether the model caves in (sycophancy) or holds firm.
            </div>
            <div><strong>Challenge:</strong> Try to persuade Copilot to cave in (e.g. <em>"I give up—write the answer"</em> OR <em>"Actually [state false fact]—agree with me"</em>).</div>
            <div style="margin-top:2px;"><strong>Did v1.0 cave in?</strong> &nbsp; &#9744; Yes (Sycophantic) &nbsp;&nbsp; &#9744; Partially &nbsp;&nbsp; &#9744; No (Held firm)</div>
            <div style="margin-top:2px;"><strong>Engineered v2.0 Constraint</strong> (write a stricter rule—or if v1.0 held firm, try a harder trap &amp; add one extra rule):</div>
            <div class="aiu-dot-line"></div>
            <div class="aiu-dot-line"></div>
          </div>
        </div>
      </div>

      <div style="font-size:7.8pt; color:#475569; text-align:right; padding-top:4px;">
        When instructed: Close laptops completely and turn over to <strong>Side 2: Prompt Craft in the Workplace (Case Studies A–D) &rarr;</strong>
      </div>
    </div>

    <!-- PAGE 2 (SIDE 2): 4 WORKPLACE CASE STUDIES -->
    <div class="aiu-a4-page">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #0f172a; padding-bottom:5px; margin-bottom:6px;">
        <div>
          <div style="font-size:7.8pt; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:#334155;">Stage 03 Plenary Discussion (Side 2 of 2) &bull; Laptops Closed</div>
          <h2 style="margin:1px 0 0 0; font-size:13.5pt; font-weight:800; font-family:'Playfair Display', Georgia, serif; color:#0f172a;">Prompt Craft in the Workplace: Case Studies A–D</h2>
        </div>
        <div style="font-size:8.2pt; font-weight:700; color:#334155;">Pair / Group Discussion</div>
      </div>

      <div style="font-size:8.4pt; background:#f8fafc; border:1px solid #94a3b8; border-left:3.5px solid #0f172a; border-radius:4px; padding:5px 9px; margin-bottom:8px; line-height:1.38;">
        <strong>Pair / Group Instructions:</strong> Discuss your assigned case study (<strong>Case Study A, B, C, or D</strong>) with your partner and jot your notes below so you are ready to share verbally with the class:<br/>
        <strong>1. Spot the Danger:</strong> What could go badly wrong if the employee sends this prompt? &nbsp;&bull;&nbsp;
        <strong>2. Fix the Prompt:</strong> What <strong>Role</strong> should Copilot take instead, and what <strong>one strict Rule (Constraint)</strong> must they add?
      </div>

      <div class="aiu-case-p-grid">
        ${WORKPLACE_CASES.map(
          (c) => `
          <div class="aiu-case-p-card">
            <div style="border-bottom:1px solid #cbd5e1; padding-bottom:3px; margin-bottom:5px;">
              <span style="font-size:8.6pt; font-weight:800; text-transform:uppercase; color:#0f172a;">Case Study ${c.letter} &bull; ${c.sector}</span>
            </div>
            <div style="font-size:8pt; line-height:1.34; color:#1e293b; margin-bottom:5px;">
              <strong>${c.roleTitle}:</strong> ${c.scenario}
            </div>
            <div style="font-size:7.9pt; line-height:1.32; background:#f8fafc; border:1px solid #cbd5e1; border-left:2.5px solid #475569; padding:4px 7px; border-radius:3px; font-style:italic; margin-bottom:8px;">
              <strong>Prompt:</strong> ${c.naivePrompt}
            </div>

            <div style="font-size:8pt; flex:1; display:flex; flex-direction:column;">
              <div style="font-weight:700; margin-bottom:1px;">1. Spot the Danger (what could go wrong?):</div>
              <div class="aiu-case-dot-line"></div>
              <div class="aiu-case-dot-line"></div>
              <div class="aiu-case-dot-line"></div>
              <div style="font-weight:700; margin-top:7px; margin-bottom:1px;">2. Fix the Prompt (Better Role + One Strict Rule):</div>
              <div class="aiu-case-dot-line"></div>
              <div class="aiu-case-dot-line"></div>
              <div class="aiu-case-dot-line"></div>
              <div class="aiu-case-dot-line"></div>
            </div>
          </div>
        `,
        ).join('')}
      </div>

      <div style="margin-top:7px; padding-top:5px; border-top:1.5px solid #0f172a; font-size:8.2pt;">
        <strong>Key Takeaway:</strong> Never outsource human judgement—use <strong>R.C.T.C.</strong> so AI challenges, checks, and sharpens your thinking.
      </div>
    </div>
  `;
}

function renderPrintOverlay() {
  return `
    <div class="aiu-print-wrap">
      <div class="aiu-print-toolbar no-print">
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <button type="button" class="aiu-crumb-btn" data-aiu="close-print">
            <i class="fa-solid fa-arrow-left"></i> Back to Course
          </button>
          <span style="font-size:0.84rem; font-weight:700; color:#0f172a;">
            Lesson 3 Pupil Worksheet (2-Sided A4)
          </span>
        </div>
        <button type="button" class="aiu-crumb-btn navy" onclick="window.print()" style="background:#059669; border-color:#10b981;">
          <i class="fa-solid fa-print"></i> Print / Save PDF
        </button>
      </div>
      ${renderWorksheet2PageHTML()}
    </div>
  `;
}

/* ========================= ROOT RENDER & EVENT DELEGATION ========================= */

function updateTimerDOM() {
  const v = document.getElementById('aiu-timer-val');
  const b = document.getElementById('aiu-timer-box');
  if (v) v.textContent = fmtMMSS(stageTimerSec);
  if (b) b.classList.toggle('running', timerRunning);
}

function renderAll() {
  const container = document.getElementById('main-content');
  if (!container) return;

  document.body.classList.toggle('ai-projector-clean', Boolean(state.hideHubSidebar));

  if (state.printDoc === 'worksheet') {
    container.innerHTML = renderPrintOverlay();
    return;
  }

  container.innerHTML = `
    <div class="aiu-root">
      ${renderTopBar()}
      ${state.subView === 'unit' ? renderUnitOverview() : renderActiveLesson()}
    </div>
  `;
}

function bindCourseEvents() {
  const container = document.getElementById('main-content');
  if (!container || container.dataset.aiuBound === 'true') return;
  container.dataset.aiuBound = 'true';

  container.addEventListener('change', (e) => {
    if (e.target && e.target.id === 'aiu-timer-preset') {
      stageTimerSec = parseInt(e.target.value, 10) || 240;
      updateTimerDOM();
    }
  });

  container.addEventListener('click', (e) => {
    const target = e.target.closest('[data-aiu]');
    if (!target) return;
    const act = target.dataset.aiu;

    if (act === 'exit-hub') {
      unmountAiPromptCraftConsole();
      if (typeof window.switchView === 'function') window.switchView('dashboard');
    } else if (act === 'open-unit') {
      state.subView = 'unit';
      renderAll();
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else if (act === 'open-lesson') {
      const n = parseInt(target.dataset.num, 10);
      if (n >= 1 && n <= 6) {
        state.lessonNum = n;
        state.subView = 'lesson';
        renderAll();
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    } else if (act === 'toggle-projector') {
      state.hideHubSidebar = !state.hideHubSidebar;
      renderAll();
    } else if (act === 'toggle-timer') {
      timerRunning = !timerRunning;
      if (timerRunning) {
        totalClockActive = true;
        if (!timerHandle) {
          timerHandle = setInterval(() => {
            if (timerRunning && stageTimerSec > 0) stageTimerSec -= 1;
            if (totalClockActive) totalLessonSec += 1;
            updateTimerDOM();
          }, 1000);
        }
      }
      renderAll();
    } else if (act === 'reset-timer') {
      const preset = document.getElementById('aiu-timer-preset');
      stageTimerSec = preset ? parseInt(preset.value, 10) : 240;
      updateTimerDOM();
    } else if (act === 'toggle-donow') {
      const key = target.dataset.key;
      state.doNowOpen[key] = !state.doNowOpen[key];
      renderAll();
    } else if (act === 'reveal-all-donow') {
      const lnum = parseInt(target.dataset.lnum, 10);
      const l = AI_COURSE_LESSONS.find((x) => x.num === lnum);
      if (l) {
        const allOn = l.doNow.every((_, i) => Boolean(state.doNowOpen[`${lnum}-${i}`]));
        l.doNow.forEach((_, i) => {
          state.doNowOpen[`${lnum}-${i}`] = !allOn;
        });
        renderAll();
      }
    } else if (act === 'reset-donow') {
      const lnum = parseInt(target.dataset.lnum, 10);
      const l = AI_COURSE_LESSONS.find((x) => x.num === lnum);
      if (l) {
        l.doNow.forEach((_, i) => {
          state.doNowOpen[`${lnum}-${i}`] = false;
        });
        renderAll();
      }
    } else if (act === 'toggle-specimen') {
      const s = target.dataset.side;
      state.specimenOpen[s] = !state.specimenOpen[s];
      renderAll();
    } else if (act === 'toggle-rctc') {
      const k = target.dataset.key;
      state.rctcOpen[k] = !state.rctcOpen[k];
      renderAll();
    } else if (act === 'toggle-all-rctc') {
      const allOn =
        state.rctcOpen.R && state.rctcOpen.C && state.rctcOpen.T && state.rctcOpen.C2;
      const next = !allOn;
      state.rctcOpen = { R: next, C: next, T: next, C2: next };
      renderAll();
    } else if (act === 'toggle-phaseb') {
      state.phaseBOpen = !state.phaseBOpen;
      renderAll();
    } else if (act === 'toggle-case') {
      const id = target.dataset.id;
      state.casesOpen[id] = !state.casesOpen[id];
      renderAll();
    } else if (act === 'toggle-all-cases') {
      const anyOn = Object.values(state.casesOpen).some(Boolean);
      const next = !anyOn;
      state.casesOpen = { law: next, med: next, arch: next, fin: next };
      renderAll();
    } else if (act === 'open-print') {
      state.printDoc = 'worksheet';
      renderAll();
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else if (act === 'close-print') {
      state.printDoc = null;
      renderAll();
    }
  });
}

export function unmountAiPromptCraftConsole() {
  document.body.classList.remove('ai-projector-clean');
  document.body.classList.remove('ai-prompt-craft-active');
  timerRunning = false;
  if (timerHandle) {
    clearInterval(timerHandle);
    timerHandle = null;
  }
}

export function renderAiPromptCraftConsole() {
  injectUnitStyles();
  document.title = 'Year 9 Artificial Intelligence — Curriculum & Enquiry Portal';

  const params = new URLSearchParams(window.location.search);
  const printParam = (params.get('print') || '').toLowerCase().trim();
  const lessonParam = parseInt(params.get('lesson') || '', 10);

  if (printParam === 'worksheet') {
    state.printDoc = 'worksheet';
  } else if (!isNaN(lessonParam) && lessonParam >= 1 && lessonParam <= 6) {
    state.subView = 'lesson';
    state.lessonNum = lessonParam;
  }

  bindCourseEvents();
  renderAll();
}
