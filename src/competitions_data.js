/**
 * Co-Curricular Competitions & Young Historian Awards Data
 * Central registry of regional, national, and university historical competitions.
 * Strictly focuses on official competition rules, eligibility, word limits, and adjudication standards.
 */

export const competitionsData = [
  {
    id: 'hampshire_archives_2027',
    title: 'Hampshire Archives Trust History Competition 2026–27',
    sponsor: 'Hampshire Archives Trust',
    sponsorLogo: 'fa-landmark-dome',
    badge: 'County Competition • Primary Archives',
    badgeColor: '#f59e0b',
    status: 'Open for Entries',
    targetYears: 'Years 7–9 (Key Stage 3) • Years 10–11 (GCSE) • Sixth Form',
    deadline: 'Friday 19th March 2027',
    ceremony: "Summer Term 2027 at the Lord Lieutenant of Hampshire's offices in Winchester",
    posterPdfUrl: '/pdfs/hampshire_archives_competition_poster.pdf',
    prizes: [
      {
        tier: 'Individual Winner',
        reward: '£100 Cash Prize',
        icon: 'fa-award',
        desc: "Awarded directly to student winners in each year category, plus an official Winner's Certificate presented by the Lord Lieutenant.",
      },
      {
        tier: 'School / Group Winner',
        reward: '£300 Department Grant + Trophy',
        icon: 'fa-trophy',
        desc: "£300 towards History Department books and learning resources, plus the prestigious Annual Winner's Trophy to keep at The History Portal for the academic year.",
      },
      {
        tier: 'Runners-Up',
        reward: 'Highly Commended Certificates',
        icon: 'fa-certificate',
        desc: 'Official commended certificates awarded to students and groups producing high-calibre archival projects.',
      },
    ],
    overview:
      'The Hampshire Archives Trust invites students to submit historical investigations into any aspect of Hampshire history—from local communities, institutions, and maritime/military events to family heritage and prominent figures. Projects may be produced individually or in collaborative groups.',
    keyRequirement:
      'Mandatory demonstrated use of authentic primary archives (original documents, diaries, letters, parish/census rolls, historical cartography, port/naval records, military logs, old photographs, oral history recordings, or archival film footage).',
    acceptableFormats: [
      { name: 'Historical Essay / Report (1,000–2,000 words)', icon: 'fa-file-lines' },
      { name: 'Short Documentary / Film (Max 10 mins)', icon: 'fa-video' },
      { name: 'Audio Podcast / Oral Interview (Max 10 mins)', icon: 'fa-podcast' },
      { name: 'Academic Research Poster / Display (A1/A2)', icon: 'fa-image' },
      { name: 'Interactive Website / Digital Dossier', icon: 'fa-laptop-code' },
      { name: 'Illustrated Lecture Presentation', icon: 'fa-person-chalkboard' },
    ],
    competitionRules: [
      {
        label: 'Mandatory Primary Archival Standard',
        rule: 'Every entry must be grounded in authentic primary source material. Projects based solely on secondary internet summaries, textbook reproductions, or generic encyclopedias will not be shortlisted.',
      },
      {
        label: 'Geographical Eligibility Rule',
        rule: 'The enquiry must focus substantively on people, events, places, institutions, or developments connected to Hampshire, the Solent, or the Isle of Wight.',
      },
      {
        label: 'Individual or Collaborative Entry',
        rule: 'Pupils may enter individually or in small research groups (up to 4 students). Group entries compete in the collective school category.',
      },
      {
        label: 'Originality & Academic Integrity',
        rule: 'All written work and media scripts must be original student work. Any verbatim quotation must be enclosed in quotation marks with the holding archive or document reference clearly cited. AI-generated text or uncredited plagiarism will result in immediate disqualification.',
      },
      {
        label: 'Referencing & Provenance Standard',
        rule: 'All archival sources must be accompanied by accurate repository citations (e.g. document reference code, holding archive name such as Hampshire Record Office, date, and description).',
      },
    ],
    adjudicationCriteria: [
      {
        title: 'Archival Interrogation (40%)',
        desc: 'Quality and depth with which authentic primary documents, maps, photographs, or records are discovered, evaluated, and integrated into the historical narrative.',
      },
      {
        title: 'Historical Reasoning & Context (30%)',
        desc: 'Accurate chronological context, nuanced historical explanation of causes and consequences, and avoidance of anachronism.',
      },
      {
        title: 'Originality & Depth of Enquiry (20%)',
        desc: 'Independence of thought in formulating the research question and pursuing unexamined local evidence rather than copying pre-existing summaries.',
      },
      {
        title: 'Clarity of Presentation & Referencing (10%)',
        desc: 'Clear structure, rigorous vocabulary, accurate citations, and professional presentation across the chosen format.',
      },
    ],
    howToEnter: [
      'Choose whether to enter as an individual or in a collaborative group (Years 7–9, 10–11, or Sixth Form).',
      'Formulate your own original historical enquiry question on any aspect of Hampshire or Solent history.',
      'Explore primary archives (visit the Hampshire Record Office in Winchester or access verified digital public record repositories).',
      'Select your approved medium (written report, documentary film, podcast, research poster, or interactive website).',
      'Submit your completed project and archival reference list to Department Lead before Friday 19th March 2027. Multiple entries per year group are permitted and free of charge.',
    ],
    links: [
      {
        label: 'Download A4 Printable Poster (PDF)',
        url: '/pdfs/hampshire_archives_competition_poster.pdf',
        icon: 'fa-file-pdf',
        isDownload: true,
      },
      {
        label: 'Hampshire Archives Trust Official Portal',
        url: 'https://hampshirearchivestrust.co.uk/',
        icon: 'fa-arrow-up-right-from-square',
      },
      {
        label: 'Hampshire Record Office Catalogue (Winchester)',
        url: 'https://www.hants.gov.uk/librariesandarchives/archives',
        icon: 'fa-building-columns',
      },
    ],
    contact:
      'Dr Alistair Dougall (Trustee, Hampshire Archives Trust) • Co-ordinated by Department Lead',
  },

  {
    id: 'ha_young_historian_2027',
    title: 'Historical Association Young Historian Awards 2026–27',
    sponsor: 'The Historical Association & The Spirit of Normandy Trust',
    sponsorLogo: 'fa-book-atlas',
    badge: 'National UK Competition',
    badgeColor: '#dc2626',
    status: 'Annual Summer Awards',
    targetYears: 'Key Stage 3 (Years 7–9) • GCSE (Years 10–11) • Sixth Form (Years 12–13)',
    deadline: 'Late June 2027 (Annual Summer Term Deadline)',
    ceremony: 'National Historical Association Awards Presentation',
    prizes: [
      {
        tier: 'Spirit of Normandy Trust Prize',
        reward: '£100 Student Prize + School Trophy',
        icon: 'fa-shield-halved',
        desc: 'Awarded for outstanding historical enquiry into British involvement in the Second World War or the 1944 D-Day landings (separate tiers for KS3 and GCSE).',
      },
      {
        tier: 'First World War Prize',
        reward: '£100 Cash Prize + Certificate',
        icon: 'fa-medal',
        desc: 'Awarded to individual students for an exceptional enquiry exploring any aspect of the 1914–1918 conflict.',
      },
      {
        tier: 'Local History Prize',
        reward: '£100 Cash Prize + Certificate',
        icon: 'fa-map-location-dot',
        desc: 'Awarded for an in-depth personal enquiry into any local history topic across Britain (KS3, GCSE, and Post-16 categories).',
      },
      {
        tier: 'GCSE Modern World Prize',
        reward: '£100 Student Prize + School Trophy',
        icon: 'fa-trophy',
        desc: 'Recognising the best individual coursework, extended essay, or independent historical enquiry on any Modern World history topic.',
      },
    ],
    overview:
      "Organised by the UK's premier national subject body for history, the Young Historian Awards celebrate rigorous, analytical historical enquiry by pupils across Britain. Entries can draw directly on classroom coursework or independent personal research projects.",
    keyRequirement:
      'Rigorous historical enquiry, critical source analysis, nuanced engagement with historical interpretations, structured argument, and clear analytical prose (typically 1,500–2,500 words for secondary students).',
    acceptableFormats: [
      { name: 'Extended Historical Essay (1,500–2,500 words)', icon: 'fa-file-lines' },
      { name: 'Independent Research Dossier', icon: 'fa-folder-open' },
      { name: 'Adapted Class Coursework Submission', icon: 'fa-graduation-cap' },
    ],
    competitionRules: [
      {
        label: 'Category Eligibility Rule',
        rule: 'Each entry must be formally entered into one of the designated categories: Spirit of Normandy (WW2/D-Day), First World War, Local British History, or GCSE Modern World History.',
      },
      {
        label: 'Word Count & Submission Scope',
        rule: 'Secondary entries (KS3 & GCSE) should typically range between 1,500 and 2,500 words. Sixth Form entries may extend up to 3,500 words. Essays must include word count declarations.',
      },
      {
        label: 'Independent Investigation Mandate',
        rule: 'The essay question and thesis must be chosen and formulated independently by the pupil. Work must represent the student’s own intellectual enquiry.',
      },
      {
        label: 'Historiographical & Interpretive Requirement',
        rule: 'Higher-tier submissions must evaluate competing historical interpretations and demonstrate critical awareness of why historians disagree.',
      },
      {
        label: 'Academic Honesty & Plagiarism Policy',
        rule: 'Every submission is subject to strict plagiarism checks. All source extracts, statistical data, and historical scholarship must be fully referenced in footnotes or an end-of-essay bibliography.',
      },
    ],
    adjudicationCriteria: [
      {
        title: 'Analytical Focus & Thesis (30%)',
        desc: 'Sustained, structured answer to a clear historical enquiry question rather than simple storytelling or factual narrative.',
      },
      {
        title: 'Disciplinary Source Evaluation (30%)',
        desc: 'Nuanced analysis of contemporary evidence, interrogating provenance, bias, utility, and historical limitations.',
      },
      {
        title: 'Historical Understanding & Context (25%)',
        desc: 'Depth of subject knowledge, conceptual grasp of causation and consequence, and accurate contextual grounding.',
      },
      {
        title: 'Scholarly Apparatus & Referencing (15%)',
        desc: 'Accurate citation of academic texts, clean bibliography, and high disciplinary literacy.',
      },
    ],
    howToEnter: [
      'Select your competition category: Spirit of Normandy (WW2), First World War, Local History, or GCSE Modern World.',
      'Formulate your own focused enquiry question addressing a historical debate or unexplored evidence.',
      'Produce an extended analytical essay (incorporating primary contemporary evidence and historical interpretations).',
      'Submit your completed draft to Department Lead for department review and formal school endorsement.',
      'Official submission is delivered to the Historical Association national panel prior to the June 2027 deadline.',
    ],
    links: [
      {
        label: 'Historical Association Young Historian Portal',
        url: 'https://www.history.org.uk/secondary/categories/436/news/3724/young-historian-awards',
        icon: 'fa-arrow-up-right-from-square',
      },
      {
        label: 'Spirit of Normandy Trust Education Hub',
        url: 'https://www.spiritofnormandy.org.uk/',
        icon: 'fa-shield-halved',
      },
    ],
    contact: 'Co-ordinated by Department Lead',
  },

  {
    id: 'julia_wood_oxford_2027',
    title: 'The Julia Wood History Essay Prize (University of Oxford)',
    sponsor: "St Hugh's College, University of Oxford",
    sponsorLogo: 'fa-graduation-cap',
    badge: 'Oxford University Sixth Form Prize',
    badgeColor: '#1e3a8a',
    status: 'Annual Sixth Form Competition',
    targetYears: 'Sixth Form (Years 12 & 13 / Under 19)',
    deadline: 'Late July 2027 (Annual Summer Deadline)',
    ceremony: "Academic Reception & Presentation at St Hugh's College, Oxford",
    prizes: [
      {
        tier: 'First Place Winner',
        reward: '£400–£500 Cash Prize',
        icon: 'fa-trophy',
        desc: "Prestigious national recognition from Oxford University historians, cash award, and formal invitation to St Hugh's College.",
      },
      {
        tier: 'Runner-Up Prizes',
        reward: '£100 Cash / Book Vouchers',
        icon: 'fa-award',
        desc: 'Cash awards or academic book grants awarded to highly commended entries demonstrating original scholarship.',
      },
      {
        tier: 'Oxbridge & UCAS Distinction',
        reward: 'Academic Distinction on Personal Statement',
        icon: 'fa-scroll',
        desc: 'One of the most respected academic essay distinctions in the UK for students applying to read History at Oxford, Cambridge, or Russell Group universities.',
      },
    ],
    overview:
      "Established in memory of St Hugh's College history exhibitioner Julia Wood, this annual competition offers Sixth Form students complete intellectual freedom to write an original, fully referenced academic essay on any historical topic of their choice. Oxford adjudicators actively seek original argument, wide scholarly reading, and sophisticated engagement with historiography.",
    keyRequirement:
      'An original, fully referenced academic essay of 2,000 to 4,000 words on any historical subject. Entries must include complete scholarly citations (footnotes or endnotes), a full bibliography, and demonstrate independent intellectual enquiry beyond the exam syllabus.',
    acceptableFormats: [
      { name: 'Formal Scholarly Essay (2,000–4,000 words)', icon: 'fa-file-lines' },
      { name: 'EPQ Historical Dissertation Adaptation', icon: 'fa-book-bookmark' },
    ],
    competitionRules: [
      {
        label: 'Open Subject Matter Rule',
        rule: 'Candidates possess complete intellectual freedom: essays may address any historical era, country, theme, or question. Topics need not be connected to the school examination syllabus.',
      },
      {
        label: 'Strict Word Limit Constraint',
        rule: 'Essays must be between 2,000 and 4,000 words in length. This word count includes text and footnotes, but excludes the bibliography. Essays outside this limit are penalized or disqualified.',
      },
      {
        label: 'Single Candidate Authorship',
        rule: 'Submissions must be the candidate’s own unaided work. Collaborative, joint, or group entries are not permitted for this prize.',
      },
      {
        label: 'Sixth Form Eligibility Constraint',
        rule: 'Open to pupils enrolled in Sixth Form (Years 12–13 or equivalent) who have not been in Sixth Form education for more than two academic years and are under the age of 19 on the date of submission.',
      },
      {
        label: 'Academic Referencing Standard',
        rule: 'The essay must adhere strictly to academic referencing conventions. All quotations and factual indebtedness must be acknowledged via footnotes or endnotes with specific page numbers and publication details.',
      },
    ],
    adjudicationCriteria: [
      {
        title: 'Originality of Argument & Thesis (35%)',
        desc: 'A bold, coherent thesis that engages critically with historical questions rather than producing descriptive biography or textbook summary.',
      },
      {
        title: 'Historiographical Sophistication (30%)',
        desc: 'Nuanced engagement with academic debates, contrasting historical schools of thought, and evaluating why previous historians arrived at different conclusions.',
      },
      {
        title: 'Evidence Interrogation & Breadth of Reading (25%)',
        desc: 'Integration of primary sources and scholarly academic literature beyond basic introductory texts.',
      },
      {
        title: 'Scholarly Prose & Precision (10%)',
        desc: 'Lucid, academic prose, flawless citation formatting, and accurate historical terminology.',
      },
    ],
    howToEnter: [
      'Open to all Sixth Form students who have not completed more than two years of Sixth Form study.',
      'Formulate your own original enquiry question on any historical period, region, or theme of your choice.',
      'Write a 2,000–4,000 word scholarly essay with rigorous footnotes and an alphabetical bibliography.',
      "Submit directly via the St Hugh's College Oxford online portal or through the History Department by late July 2027.",
    ],
    links: [
      {
        label: "St Hugh's College Oxford Essay Competitions",
        url: 'https://www.st-hughs.ox.ac.uk/prospective-students/outreach-at-st-hughs/essay-competitions/',
        icon: 'fa-building-columns',
      },
      {
        label: 'Oxford History Faculty Undergraduate Admissions',
        url: 'https://www.history.ox.ac.uk/ba-history',
        icon: 'fa-arrow-up-right-from-square',
      },
    ],
    contact: "St Hugh's College Admissions • Mentored by Department Lead",
  },
];
