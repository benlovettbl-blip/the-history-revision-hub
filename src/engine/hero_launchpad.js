import { isVerifiedPdf } from '../verified_pdf_manifest.js';

/**
 * Hero Curricular Launchpad Engine
 * Renders the high-status 3-Pillars Quick-Launch Bar (Master Textbook, Pupil Workbook,
 * and Knowledge Retrieval Companion) directly inside the unit Hero Banner.
 */

// Window-level launcher ensuring instant in-page preview or tab opening
if (typeof window !== 'undefined') {
  window.openCurricularPillar = function (htmlUrl, title, pdfUrl, badge) {
    if (typeof window.openTeacherPrintPreview === 'function') {
      window.openTeacherPrintPreview(htmlUrl, title, pdfUrl);
      return;
    }
    if (
      typeof window.openInPagePreview === 'function' &&
      document.getElementById('inpage-preview-console')
    ) {
      window.openInPagePreview(htmlUrl, title, pdfUrl, { badge: badge || 'DOCUMENT' });
      return;
    }
    window.open(htmlUrl, '_blank');
  };
}

export const CURRICULAR_PILLARS_CATALOG = {
  ks2_ww2: {
    textbook: {
      title: 'World War II & The Home Front (1933–1945) Master Classroom Textbook',
      label: 'Master Textbook (16 Pages)',
      htmlUrl: '/units/ks2_ww2/textbook.html',
      pdfUrl: '/pdfs/ks2_ww2_textbook.pdf',
    },
    workbook: {
      title: 'World War II & The Home Front (1933–1945) Pupil Workbook',
      label: 'Pupil Workbook (28 Pages)',
      htmlUrl: '/units/ks2_ww2/pupil_workbook.html',
      pdfUrl: '/pdfs/ks2_ww2_pupil_workbook.pdf',
    },
    retrieval: {
      title: 'World War II & The Home Front Retrieval Quiz Pack',
      label: 'Quiz Pack (44 Qs)',
      htmlUrl: '/units/ks2_ww2/quiz_pack.html',
      pdfUrl: '/pdfs/KS2_World_War_II_Master_Knowledge_Retrieval_Companion.pdf',
    },
    schemeOfWork: {
      title: 'Key Stage 2 World War II Walk-In Teacher Guide & Scheme of Work',
      label: 'Teacher Guide & SOW',
      htmlUrl: '/units/ks2_ww2/ks2_ww2_scheme_of_work.html',
      pdfUrl: '/pdfs/ks2_ww2/ks2_ww2_scheme_of_work.pdf',
    },
    timelineUrl: {
      label: 'Timeline Slider',
      url: '/units/ks2_ww2/timeline_slider.html',
    },
  },
  great_war: {
    textbook: {
      title: 'Causes of the Great War (1871–1914) Master Classroom Textbook',
      label: 'Master Textbook',
      htmlUrl: '/units/great_war/textbook.html',
      pdfUrl: '/pdfs/great_war_textbook.pdf',
    },
    workbook: {
      title: 'Causes of the Great War Pupil Workbook',
      label: 'Pupil Workbook',
      htmlUrl: '/units/great_war/pupil_workbook.html',
      pdfUrl: '/pdfs/great_war_pupil_workbook.pdf',
    },
    retrieval: {
      title: 'Causes of the Great War Knowledge Retrieval Companion',
      label: 'Retrieval Companion (30 Qs)',
      htmlUrl: '/units/great_war/great_war_retrieval_companion.html',
      pdfUrl: '/pdfs/Causes_of_the_Great_War_Master_Knowledge_Retrieval_Companion.pdf',
    },
  },
  great_war_part2: {
    textbook: {
      title: 'The Course of the Great War (1914–1918) Master Classroom Textbook',
      label: 'Master Textbook',
      htmlUrl: '/units/great_war_part2/textbook.html',
      pdfUrl: '/pdfs/great_war_part2_textbook.pdf',
    },
    workbook: {
      title: 'Course of the Great War Pupil Workbook',
      label: 'Pupil Workbook (16p)',
      htmlUrl: '/units/great_war_part2/pupil_workbook.html',
      pdfUrl: '/pdfs/great_war_part2_pupil_workbook.pdf',
    },
    retrieval: {
      title: 'The Course of the Great War Master Retrieval & Literary Companion (12 Pages)',
      label: 'Retrieval & Literary Companion (12p)',
      htmlUrl: '/units/great_war_part2/great_war_part2_retrieval_companion.html',
      pdfUrl: '/pdfs/The_Course_of_the_Great_War_Master_Retrieval_and_Literary_Companion.pdf',
    },
    combined: {
      title: 'The Course of the Great War Combined Master Scholar Workbook (24 Pages)',
      label: 'Combined Workbook (24p)',
      htmlUrl: '/units/great_war_part2/great_war_part2_combined_workbook.html',
      pdfUrl: '/pdfs/The_Course_of_the_Great_War_Combined_Master_Scholar_Workbook.pdf',
    },
  },
  medieval_england: {
    textbook: {
      title: 'Medieval England (1066–1381) Master Classroom Textbook',
      label: 'Master Textbook (8 Pages)',
      htmlUrl: '/units/medieval_england/textbook.html',
      pdfUrl: '/pdfs/medieval_england_textbook.pdf',
    },
    workbook: {
      title: 'Medieval England Pupil Workbook',
      label: 'Pupil Workbook (16 Pages)',
      htmlUrl: '/units/medieval_england/pupil_workbook.html',
      pdfUrl: '/pdfs/medieval_england_pupil_workbook.pdf',
    },
    retrieval: {
      title: 'Medieval England Knowledge Retrieval Companion',
      label: 'Retrieval Companion (30 Qs)',
      htmlUrl: '/units/medieval_england/medieval_england_retrieval_companion.html',
      pdfUrl: '/pdfs/Medieval_England_Master_Knowledge_Retrieval_Companion.pdf',
    },
  },
  monarchy_religion_power: {
    textbook: {
      title: 'Crown, Church, or Parliament (1517–1689) Master Classroom Textbook',
      label: 'Master Textbook',
      htmlUrl: '/units/monarchy_religion_power/textbook.html',
      pdfUrl: '/pdfs/monarchy_religion_power_textbook.pdf',
    },
    workbook: {
      title: 'Crown, Church, or Parliament 16-Page Pupil Workbook',
      label: 'Pupil Workbook (16 Pages)',
      htmlUrl: '/units/monarchy_religion_power/pupil_workbook.html',
      pdfUrl: '/pdfs/monarchy_religion_power_pupil_workbook.pdf',
    },
    retrieval: {
      title: 'Crown, Church, or Parliament Knowledge Retrieval Companion',
      label: 'Retrieval Companion (30 Qs)',
      htmlUrl: '/units/monarchy_religion_power/monarchy_religion_power_retrieval_companion.html',
      pdfUrl: '/pdfs/Crown_Church_or_Parliament_Master_Knowledge_Retrieval_Companion.pdf',
    },
  },
  first_british_empire: {
    textbook: {
      title: 'The First British Empire (1600–1783) Master Classroom Textbook',
      label: 'Master Textbook',
      htmlUrl: '/units/first_british_empire/textbook.html',
      pdfUrl: '/pdfs/first_british_empire_textbook.pdf',
    },
    workbook: {
      title: 'The First British Empire 16-Page Pupil Workbook',
      label: 'Pupil Workbook (16 Pages)',
      htmlUrl: '/units/first_british_empire/pupil_workbook.html',
      pdfUrl: '/pdfs/first_british_empire_pupil_workbook.pdf',
    },
    retrieval: {
      title: 'The First British Empire Knowledge Retrieval Companion',
      label: 'Retrieval Companion (30 Qs)',
      htmlUrl: '/units/first_british_empire/first_british_empire_retrieval_companion.html',
      pdfUrl: '/pdfs/The_First_British_Empire_Master_Knowledge_Retrieval_Companion.pdf',
    },
  },
  industrialisation_and_empire: {
    textbook: {
      title: 'Industrialisation, Power & Protest (1750–1901) Master Classroom Textbook',
      label: 'Master Textbook',
      htmlUrl: '/units/industrialisation_and_empire/textbook.html',
      pdfUrl: '/pdfs/industrialisation_and_empire_textbook.pdf',
    },
    workbook: {
      title: 'Industrialisation & Empire Pupil Workbook',
      label: 'Pupil Workbook',
      htmlUrl: '/units/industrialisation_and_empire/pupil_workbook.html',
      pdfUrl: '/pdfs/industrialisation_and_empire_pupil_workbook.pdf',
    },
    retrieval: {
      title: 'The Industrial Revolution Knowledge Retrieval Companion',
      label: 'Retrieval Companion (30 Qs)',
      htmlUrl:
        '/units/industrialisation_and_empire/industrialisation_and_empire_retrieval_companion.html',
      pdfUrl: '/pdfs/Industrialisation_Power_and_Protest_Master_Knowledge_Retrieval_Companion.pdf',
    },
  },
  second_british_empire: {
    textbook: {
      title: 'The Second British Empire (1783–1914) Master Classroom Textbook',
      label: 'Master Textbook',
      htmlUrl: '/units/second_british_empire/textbook.html',
      pdfUrl: '/pdfs/second_british_empire_textbook.pdf',
    },
    workbook: {
      title: 'The Second British Empire 16-Page Pupil Workbook',
      label: 'Pupil Workbook (16 Pages)',
      htmlUrl: '/units/second_british_empire/pupil_workbook.html',
      pdfUrl: '/pdfs/second_british_empire_pupil_workbook.pdf',
    },
    retrieval: {
      title: 'The Second British Empire Knowledge Retrieval Companion',
      label: 'Retrieval Companion (30 Qs)',
      htmlUrl: '/units/second_british_empire/second_british_empire_retrieval_companion.html',
      pdfUrl: '/pdfs/The_Second_British_Empire_Master_Knowledge_Retrieval_Companion.pdf',
    },
  },
  water_and_sanitation: {
    textbook: {
      title: 'Water & Sanitation Through Time (1250–Present) Master Classroom Textbook',
      label: 'Master Textbook',
      htmlUrl: '/units/water_and_sanitation/textbook.html',
      pdfUrl: '/pdfs/water_and_sanitation_textbook.pdf',
    },
    workbook: {
      title: 'Water & Sanitation 20-Page Pupil Workbook',
      label: 'Pupil Workbook (20 Pages)',
      htmlUrl: '/units/water_and_sanitation/pupil_workbook.html',
      pdfUrl: '/pdfs/water_and_sanitation_pupil_workbook.pdf',
    },
    retrieval: {
      title: 'Water & Sanitation Knowledge Retrieval Companion',
      label: 'Retrieval Companion (30 Qs)',
      htmlUrl: '/units/water_and_sanitation/water_and_sanitation_retrieval_companion.html',
      pdfUrl: '/pdfs/Water_and_Sanitation_Master_Knowledge_Retrieval_Companion.pdf',
    },
  },
  the_shoah: {
    textbook: {
      title: 'The Shoah / The Holocaust Master Classroom Textbook',
      label: 'Master Textbook',
      htmlUrl: '/units/the_shoah/textbook.html',
      pdfUrl: '/pdfs/the_shoah_textbook.pdf',
    },
    workbook: {
      title: 'The Shoah 20-Page Pupil Workbook',
      label: 'Pupil Workbook (20 Pages)',
      htmlUrl: '/units/the_shoah/pupil_workbook.html',
      pdfUrl: '/pdfs/the_shoah_pupil_workbook.pdf',
    },
    retrieval: {
      title: 'The Shoah Knowledge Retrieval Companion',
      label: 'Retrieval Companion (30 Qs)',
      htmlUrl: '/units/the_shoah/the_shoah_retrieval_companion.html',
      pdfUrl: '/pdfs/The_Shoah_Master_Knowledge_Retrieval_Companion.pdf',
    },
  },
  post_war_britain: {
    textbook: {
      title: 'Post-War Britain (1945–1990) Master Classroom Textbook',
      label: 'Master Textbook',
      htmlUrl: '/units/post_war_britain/textbook.html',
      pdfUrl: '/pdfs/post_war_britain_textbook.pdf',
    },
    workbook: {
      title: 'Post-War Britain Pupil Workbook',
      label: 'Pupil Workbook',
      htmlUrl: '/units/post_war_britain/pupil_workbook.html',
      pdfUrl: '/pdfs/post_war_britain_pupil_workbook.pdf',
    },
    retrieval: {
      title: 'Post-War Britain Knowledge Retrieval Companion',
      label: 'Retrieval Companion (30 Qs)',
      htmlUrl: '/units/post_war_britain/post_war_britain_retrieval_companion.html',
      pdfUrl: '/pdfs/Post_War_Britain_Master_Knowledge_Retrieval_Companion.pdf',
    },
  },
  australia: {
    textbook: {
      title: 'History of Australia & The Pacific Master Classroom Textbook',
      label: 'Master Textbook',
      htmlUrl: '/units/australia/textbook.html',
      pdfUrl: '/pdfs/australia_textbook.pdf',
    },
    workbook: {
      title: 'Australia & The Pacific Pupil Workbook',
      label: 'Pupil Workbook',
      htmlUrl: '/units/australia/pupil_workbook.html',
      pdfUrl: '/pdfs/australia_pupil_workbook.pdf',
    },
    retrieval: {
      title: 'History of Australia Knowledge Retrieval Companion',
      label: 'Retrieval Companion (30 Qs)',
      htmlUrl: '/units/australia/australia_retrieval_companion.html',
      pdfUrl: '/pdfs/History_of_Australia_Master_Knowledge_Retrieval_Companion.pdf',
    },
  },
  cme_new: {
    textbook: {
      title: 'Conflict in the Middle East Classroom Textbooks (KT1, KT2 & KT3)',
      label: 'Textbooks (KT1–KT3)',
      openHub: true,
      editions: [
        {
          label: 'Key Topic 1: Birth of the State of Israel (1945–63)',
          pages: '12 Pages',
          htmlUrl: '/units/cme_new/textbook_KT1_PUBLISHER.html',
          pdfUrl: '/pdfs/cme_new_textbook_KT1.pdf',
        },
        {
          label: 'Key Topic 2: The Escalating Conflict (1963–73)',
          pages: '16 Pages',
          htmlUrl: '/units/cme_new/textbook_KT2_PUBLISHER.html',
          pdfUrl: '/pdfs/cme_new_textbook_KT2.pdf',
        },
        {
          label: 'Key Topic 3: Attempts at a Solution (1974–95)',
          pages: '12 Pages',
          htmlUrl: '/units/cme_new/textbook_KT3_PUBLISHER.html',
          pdfUrl: '/pdfs/cme_new_textbook_KT3.pdf',
        },
      ],
    },
    workbook: {
      title: 'Conflict in the Middle East Pupil Workbooks (KT1, KT2 & KT3)',
      label: 'Pupil Workbooks (KT1–KT3)',
      openHub: true,
      icon: 'fa-solid fa-pen-to-square',
    },
    retrieval: {
      title: 'Conflict in the Middle East Master Knowledge Retrieval Companion',
      label: 'Retrieval Companion (96 Qs)',
      htmlUrl: '/units/cme_new/cme_master_retrieval_companion.html',
      pdfUrl: '/pdfs/Conflict_in_the_Middle_East_Master_Knowledge_Retrieval_Companion.pdf',
    },
    revisionGuide: {
      title: 'Conflict in the Middle East (1945–1995) 14-Page Ultra-Condensed Revision Guide',
      label: 'Revision Guide (14p)',
      htmlUrl: '/units/cme_new/revision_guide.html',
      pdfUrl: '/pdfs/cme_revision_guide.pdf',
    },
    overviewInfographic: {
      slug: 'cme_edexcel_spec_roadmap',
      label: 'Specification Roadmap (1945–1995)',
      title: 'GCSE (9–1) Conflict in the Middle East Specification Roadmap',
      icon: 'fa-solid fa-route',
    },
  },
  usa: {
    textbook: {
      title: 'USA, 1954–1975 Classroom Textbooks (KT1–KT4)',
      label: 'Textbooks (KT1–KT4)',
      openHub: true,
      editions: [
        {
          label: 'Key Topic 1: Development of Civil Rights (1954–60)',
          pages: '12 Pages',
          htmlUrl: '/units/usa/textbook_KT1_PUBLISHER.html',
          pdfUrl: '/pdfs/usa_textbook_KT1.pdf',
        },
        {
          label: 'Key Topic 2: Protest, Progress & Radicalism (1960–75)',
          pages: '12 Pages',
          htmlUrl: '/units/usa/textbook_KT2_PUBLISHER.html',
          pdfUrl: '/pdfs/usa_textbook_KT2.pdf',
        },
        {
          label: 'Key Topic 3: US Involvement in the Vietnam War (1954–75)',
          pages: '12 Pages',
          htmlUrl: '/units/usa/textbook_KT3_PUBLISHER.html',
          pdfUrl: '/pdfs/usa_textbook_KT3.pdf',
        },
        {
          label: 'Key Topic 4: Reactions & End of US Involvement (1964–75)',
          pages: '12 Pages',
          htmlUrl: '/units/usa/textbook_KT4_PUBLISHER.html',
          pdfUrl: '/pdfs/usa_textbook_KT4.pdf',
        },
      ],
    },
    workbook: {
      title: 'USA, 1954–1975 Pupil Workbooks (KT1–KT4)',
      label: 'Pupil Workbooks (KT1–KT4)',
      openHub: true,
      icon: 'fa-solid fa-pen-to-square',
    },
    retrieval: {
      title: 'USA 1954–1975 Master Knowledge Retrieval Companion',
      label: 'Retrieval Companion (128 Qs)',
      htmlUrl: '/units/usa/usa_master_retrieval_companion.html',
      pdfUrl: '/pdfs/USA_1954_1975_Master_Knowledge_Retrieval_Companion.pdf',
    },
    overviewInfographic: {
      slug: 'usa_paper3_exam_strategy_guide',
      label: 'Paper 3 Exam Strategy Guide',
      title: 'Mastering Edexcel GCSE Paper 3: USA 1954–1975 Exam Strategy Guide',
      icon: 'fa-solid fa-graduation-cap',
    },
  },
  edexcel_medicine: {
    textbook: {
      title: 'Medicine Through Time & Western Front Classroom Textbooks (5 Eras)',
      label: 'Textbooks (5 Eras)',
      openHub: true,
      editions: [
        {
          label: 'Era 1: Medieval Britain (c1250–c1500)',
          pages: '16 Pages',
          htmlUrl: '/units/edexcel_medicine/textbook_medieval_PUBLISHER.html',
          pdfUrl: '/pdfs/edexcel_medicine_textbook_medieval.pdf',
        },
        {
          label: 'Era 2: The Medical Renaissance (c1500–c1700)',
          pages: '16 Pages',
          htmlUrl: '/units/edexcel_medicine/textbook_renaissance_PUBLISHER.html',
          pdfUrl: '/pdfs/edexcel_medicine_textbook_renaissance.pdf',
        },
        {
          label: 'Era 3: 18th & 19th Century Britain (c1700–c1900)',
          pages: '16 Pages',
          htmlUrl: '/units/edexcel_medicine/textbook_18th_19th_PUBLISHER.html',
          pdfUrl: '/pdfs/edexcel_medicine_textbook_18th_19th.pdf',
        },
        {
          label: 'Era 4: Modern Britain (c1900–present)',
          pages: '16 Pages',
          htmlUrl: '/units/edexcel_medicine/textbook_modern_PUBLISHER.html',
          pdfUrl: '/pdfs/edexcel_medicine_textbook_modern.pdf',
        },
        {
          label: 'Historic Env: The British Sector of the Western Front (1914–18)',
          pages: '16 Pages',
          htmlUrl: '/units/edexcel_medicine/textbook_western_front_PUBLISHER.html',
          pdfUrl: '/pdfs/edexcel_medicine_textbook_western_front.pdf',
        },
      ],
    },
    workbook: {
      title: 'Medicine Through Time & Western Front Pupil Workbooks (5 Booklets)',
      label: 'Pupil Workbooks (5 Booklets)',
      openHub: true,
      icon: 'fa-solid fa-pen-to-square',
    },
    retrieval: {
      title: 'Medicine in Britain Master Knowledge Retrieval Companion',
      label: 'Retrieval Companion (96 Qs)',
      htmlUrl: '/units/edexcel_medicine/medicine_master_retrieval_companion.html',
      pdfUrl: '/pdfs/Medicine_Through_Time_Master_Knowledge_Retrieval_Companion.pdf',
    },
    overviewInfographic: {
      slug: 'med_course_overview_c1250_present',
      label: 'Course Overview (c1250–Present)',
      title: 'Medicine in Britain: c1250–Present Master Course Overview & Timeline',
      icon: 'fa-solid fa-map-location-dot',
    },
  },
  weimar_nazi_germany: {
    textbook: {
      title: 'Weimar & Nazi Germany Classroom Textbooks (KT1–KT4)',
      label: 'Textbooks (KT1–KT4)',
      openHub: true,
      editions: [
        {
          label: 'Key Topic 1: The Weimar Republic (1918–29)',
          pages: '12 Pages',
          htmlUrl: '/units/weimar_nazi_germany/textbook_KT1_PUBLISHER.html',
          pdfUrl: '/pdfs/weimar_nazi_germany_textbook_KT1.pdf',
        },
        {
          label: 'Key Topic 2: Hitler’s Rise to Power (1919–33)',
          pages: '12 Pages',
          htmlUrl: '/units/weimar_nazi_germany/textbook_KT2_PUBLISHER.html',
          pdfUrl: '/pdfs/weimar_nazi_germany_textbook_KT2.pdf',
        },
        {
          label: 'Key Topic 3: Nazi Control & Dictatorship (1933–39)',
          pages: '12 Pages',
          htmlUrl: '/units/weimar_nazi_germany/textbook_KT3_PUBLISHER.html',
          pdfUrl: '/pdfs/weimar_nazi_germany_textbook_KT3.pdf',
        },
        {
          label: 'Key Topic 4: Life in Nazi Germany (1933–39)',
          pages: '12 Pages',
          htmlUrl: '/units/weimar_nazi_germany/textbook_KT4_PUBLISHER.html',
          pdfUrl: '/pdfs/weimar_nazi_germany_textbook_KT4.pdf',
        },
      ],
    },
    workbook: {
      title: 'Weimar & Nazi Germany Pupil Workbooks (KT1–KT4)',
      label: 'Pupil Workbooks (KT1–KT4)',
      openHub: true,
      icon: 'fa-solid fa-pen-to-square',
    },
    retrieval: {
      title: 'Weimar and Nazi Germany Master Knowledge Retrieval Companion',
      label: 'Retrieval Companion (128 Qs)',
      htmlUrl: '/units/weimar_nazi_germany/weimar_master_retrieval_companion.html',
      pdfUrl: '/pdfs/Weimar_and_Nazi_Germany_Master_Knowledge_Retrieval_Companion.pdf',
    },
  },
  eee: {
    textbook: {
      title: 'Early Elizabethan England Classroom Textbooks (KT1–KT3)',
      label: 'Textbooks (KT1–KT3)',
      openHub: true,
      editions: [
        {
          label: 'Key Topic 1: Queen, Government & Religion (1558–69)',
          pages: '12 Pages',
          htmlUrl: '/units/eee/textbook_KT1_PUBLISHER.html',
          pdfUrl: '/pdfs/eee_textbook_KT1.pdf',
        },
        {
          label: 'Key Topic 2: Challenges at Home & Abroad (1569–88)',
          pages: '12 Pages',
          htmlUrl: '/units/eee/textbook_KT2_PUBLISHER.html',
          pdfUrl: '/pdfs/eee_textbook_KT2.pdf',
        },
        {
          label: 'Key Topic 3: Elizabethan Society & Exploration (1558–88)',
          pages: '12 Pages',
          htmlUrl: '/units/eee/textbook_KT3_PUBLISHER.html',
          pdfUrl: '/pdfs/eee_textbook_KT3.pdf',
        },
      ],
    },
    workbook: {
      title: 'Early Elizabethan England Pupil Workbooks (KT1–KT3)',
      label: 'Pupil Workbooks (KT1–KT3)',
      openHub: true,
      icon: 'fa-solid fa-pen-to-square',
    },
    retrieval: {
      title: 'Early Elizabethan England Master Knowledge Retrieval Companion',
      label: 'Retrieval Companion (120 Qs)',
      htmlUrl: '/units/eee/eee_master_retrieval_companion.html',
      pdfUrl: '/pdfs/Early_Elizabethan_England_Master_Knowledge_Retrieval_Companion.pdf',
    },
  },
  cold_war: {
    textbook: {
      title: 'The Cold War & Global Flashpoints Master Textbook',
      label: 'Master Textbook',
      htmlUrl: '/units/cold_war/textbook.html',
      pdfUrl: '/pdfs/cold_war_textbook.pdf',
    },
    workbook: {
      title: 'Superpower Relations & Cold War Pupil Workbook',
      label: 'Pupil Workbook (20 Pages)',
      htmlUrl: '/units/cold_war/pupil_workbook.html',
      pdfUrl: '/pdfs/cold_war_pupil_workbook.pdf',
      icon: 'fa-solid fa-pen-to-square',
    },
    retrieval: {
      title: 'Superpower Relations Knowledge Retrieval Companion',
      label: 'Retrieval Companion',
      htmlUrl: '/units/cold_war/cold_war_master_retrieval_companion.html',
      pdfUrl: '/pdfs/Superpower_Relations_and_Cold_War_Master_Knowledge_Retrieval_Companion.pdf',
    },
  },
};

/**
 * Returns HTML string for the 3-Pillars Quick-Launch Bar in the Hero Banner.
 * @param {string} unitId
 * @param {object} unitData
 * @returns {string} HTML markup
 */
export function renderHeroCurricularLaunchpad(unitId, unitData) {
  if (!unitId) return '';
  const isTrip = unitId === 'trip_ypres' || (unitData && unitData.type === 'trip');
  if (isTrip) return '';

  const config = CURRICULAR_PILLARS_CATALOG[unitId] || {
    workbook: {
      title: `${unitData?.title || 'Unit'} Pupil Workbook`,
      label: 'Pupil Workbook',
      htmlUrl: `/units/${unitId}/pupil_workbook.html`,
      pdfUrl: `/pdfs/${unitId}_pupil_workbook.pdf`,
    },
    retrieval: {
      title: `${unitData?.title || 'Unit'} Knowledge Retrieval Companion`,
      label: 'Retrieval Companion',
      htmlUrl: `/units/${unitId}/quiz_pack.html`,
      pdfUrl: `/pdfs/${unitId}_quiz_pack.pdf`,
    },
  };

  const tb = config.textbook;
  const wb = config.workbook;
  const rc = config.retrieval;
  const cb = config.combined;
  const ov = config.overviewInfographic;
  const sow = config.schemeOfWork;
  const tl = config.timelineUrl;
  const rg = config.revisionGuide;

  const hasDistinctTextbook = Boolean(
    tb && (tb.openHub || !wb || tb.htmlUrl !== wb.htmlUrl || tb.pdfUrl !== wb.pdfUrl),
  );

  const cleanTbTitle = (tb?.title || '').replace(/'/g, "\\'");
  const cleanWbTitle = (wb?.title || '').replace(/'/g, "\\'");
  const cleanRcTitle = (rc?.title || '').replace(/'/g, "\\'");
  const cleanRgTitle = (rg?.title || '').replace(/'/g, "\\'");
  const cleanCbTitle = (cb?.title || '').replace(/'/g, "\\'");
  const cleanOvTitle = (ov?.title || ov?.label || '').replace(/'/g, "\\'");
  const cleanSowTitle = (sow?.title || sow?.label || '').replace(/'/g, "\\'");

  const textbookPill = hasDistinctTextbook
    ? tb.openHub
      ? `
        <!-- Pillar 1: Individual Key Topic / Era Classroom Textbooks Picker -->
        <div class="launchpad-pill-group pill-textbook">
          <button type="button" class="launchpad-pill-btn" onclick="if(window.openTextbookEditionPicker){window.openTextbookEditionPicker('${unitId}');}else if(window.switchView){window.switchView('booklet', '${unitId}');}" title="Select an Era or Key Topic Classroom Textbook to read or download">
            <i class="fa-solid fa-book-open"></i>
            <span>${tb.label}</span>
          </button>
        </div>`
      : `
        <!-- Pillar 1: Master Textbook -->
        <div class="launchpad-pill-group pill-textbook">
          <button type="button" class="launchpad-pill-btn" onclick="window.openCurricularPillar('${tb.htmlUrl}', '${cleanTbTitle}', '${tb.pdfUrl}', 'TEXTBOOK')" title="Open Classroom Textbook in reader">
            <i class="fa-solid fa-book-open"></i>
            <span>${tb.label}</span>
          </button>
          ${
            isVerifiedPdf(tb.pdfUrl)
              ? `
          <a href="${tb.pdfUrl}" target="_blank" download title="Download Classroom Textbook PDF" class="launchpad-pill-pdf">
            <i class="fa-solid fa-file-pdf"></i>
          </a>`
              : ''
          }
        </div>`
    : '';

  const isExamPack = wb?.label?.includes('Exam') || wb?.icon?.includes('signature');
  const wbIcon =
    wb?.icon || (isExamPack ? 'fa-solid fa-file-signature' : 'fa-solid fa-pen-to-square');
  const wbPillClass = isExamPack
    ? 'launchpad-pill-group pill-workbook pill-exam-pack'
    : 'launchpad-pill-group pill-workbook';
  const wbAction = isExamPack ? 'EXAM_PACK' : 'WORKBOOK';
  const wbTooltip = isExamPack
    ? `Open ${wb.label} in classroom reader`
    : 'Open Pupil Workbook in classroom reader';
  const wbDownloadTooltip = isExamPack ? `Download ${wb.label} PDF` : 'Download Pupil Workbook PDF';

  const workbookPill = wb
    ? wb.openHub
      ? `
        <!-- Pillar 2: Individual Key Topic / Era Pupil Workbooks Hub -->
        <div class="${wbPillClass}">
          <button type="button" class="launchpad-pill-btn" onclick="window.switchView && window.switchView('booklet', '${unitId}')" title="Open Workbooks Hub to view or print individual Key Topic booklets & Mark Schemes">
            <i class="${wbIcon}"></i>
            <span>${wb.label}</span>
          </button>
        </div>`
      : `
        <!-- Pillar 2: Pupil Workbook / Mastery Exam Pack -->
        <div class="${wbPillClass}">
          <button type="button" class="launchpad-pill-btn" onclick="window.openCurricularPillar('${wb.htmlUrl}', '${cleanWbTitle}', '${wb.pdfUrl}', '${wbAction}')" title="${wbTooltip}">
            <i class="${wbIcon}"></i>
            <span>${wb.label}</span>
          </button>
          ${
            isVerifiedPdf(wb.pdfUrl)
              ? `
          <a href="${wb.pdfUrl}" target="_blank" download title="${wbDownloadTooltip}" class="launchpad-pill-pdf">
            <i class="fa-solid fa-file-pdf"></i>
          </a>`
              : ''
          }
        </div>`
    : '';

  const workbookMarkSchemePill =
    wb && wb.markSchemeHtmlUrl
      ? `
        <!-- Pillar 2b: Page-Matched Workbook Teacher Mark Scheme & WAGOLLs -->
        <div class="launchpad-pill-group pill-workbook">
          <button type="button" class="launchpad-pill-btn" onclick="window.openCurricularPillar('${wb.markSchemeHtmlUrl}', '${(wb.markSchemeTitle || 'Workbook Mark Scheme').replace(/'/g, "\\'")}', '${wb.markSchemePdfUrl || ''}', 'MARK_SCHEME')" title="Open Page-Matched Printed Workbook Mark Scheme & Grade 9 WAGOLLs">
            <i class="fa-solid fa-check-double"></i>
            <span>${wb.markSchemeLabel || 'Workbook Mark Scheme'}</span>
          </button>
          ${
            wb.markSchemePdfUrl && isVerifiedPdf(wb.markSchemePdfUrl)
              ? `
          <a href="${wb.markSchemePdfUrl}" target="_blank" download title="Download Page-Matched Workbook Mark Scheme PDF" class="launchpad-pill-pdf">
            <i class="fa-solid fa-file-pdf"></i>
          </a>`
              : ''
          }
        </div>`
      : '';

  const retrievalPill = rc
    ? `
        <!-- Pillar 3: Knowledge Retrieval Companion -->
        <div class="launchpad-pill-group pill-retrieval">
          <button type="button" class="launchpad-pill-btn" onclick="window.openCurricularPillar('${rc.htmlUrl}', '${cleanRcTitle}', '${rc.pdfUrl}', 'RETRIEVAL')" title="Open ${cleanRcTitle || rc.label} in classroom reader">
            <i class="fa-solid fa-brain"></i>
            <span>${rc.label}</span>
          </button>
          ${
            isVerifiedPdf(rc.pdfUrl)
              ? `
          <a href="${rc.pdfUrl}" target="_blank" download title="Download ${cleanRcTitle || rc.label} PDF" class="launchpad-pill-pdf">
            <i class="fa-solid fa-file-pdf"></i>
          </a>`
              : ''
          }
        </div>`
    : '';

  const revisionGuidePill = rg
    ? `
        <!-- Optional Pillar: 14-Page Ultra-Condensed Revision Guide -->
        <div class="launchpad-pill-group pill-revision-guide">
          <button type="button" class="launchpad-pill-btn" onclick="window.openCurricularPillar('${rg.htmlUrl}', '${cleanRgTitle}', '${rg.pdfUrl}', 'REVISION_GUIDE')" title="Open 14-Page Revision Guide in classroom reader">
            <i class="fa-solid fa-book-bookmark"></i>
            <span>${rg.label}</span>
          </button>
          ${
            isVerifiedPdf(rg.pdfUrl)
              ? `
          <a href="${rg.pdfUrl}" target="_blank" download title="Download 14-Page Revision Guide PDF" class="launchpad-pill-pdf">
            <i class="fa-solid fa-file-pdf"></i>
          </a>`
              : ''
          }
        </div>`
    : '';

  const combinedPill = cb
    ? `
        <!-- Optional Pillar: Combined Master Scholar Workbook -->
        <div class="launchpad-pill-group pill-combined">
          <button type="button" class="launchpad-pill-btn" onclick="window.openCurricularPillar('${cb.htmlUrl}', '${cleanCbTitle}', '${cb.pdfUrl}', 'COMBINED')" title="Open Combined Master Scholar Workbook (24 Pages) in classroom reader">
            <i class="fa-solid fa-layer-group"></i>
            <span>${cb.label}</span>
          </button>
          ${
            isVerifiedPdf(cb.pdfUrl)
              ? `
          <a href="${cb.pdfUrl}" target="_blank" download title="Download Combined Master Scholar Workbook (24 Pages) PDF" class="launchpad-pill-pdf">
            <i class="fa-solid fa-file-pdf"></i>
          </a>`
              : ''
          }
        </div>`
    : '';

  const overviewPill = ov
    ? `
        <!-- Optional Pillar: Master Course Overview & Timeline Infographic -->
        <div class="launchpad-pill-group pill-overview">
          <button type="button" class="launchpad-pill-btn" onclick="if(window.openInfographicModal){window.openInfographicModal('${ov.slug}');}" title="Open ${cleanOvTitle} in visual lightbox">
            <i class="${ov.icon || 'fa-solid fa-map-location-dot'}"></i>
            <span>${ov.label}</span>
          </button>
        </div>`
    : '';

  const sowPill = sow
    ? `
        <!-- Optional Pillar: Teacher Guide & Scheme of Work -->
        <div class="launchpad-pill-group pill-combined">
          <button type="button" class="launchpad-pill-btn" onclick="window.openCurricularPillar('${sow.htmlUrl}', '${cleanSowTitle}', '${sow.pdfUrl}', 'SCHEME_OF_WORK')" title="Open ${cleanSowTitle} in classroom reader">
            <i class="fa-solid fa-chalkboard-user"></i>
            <span>${sow.label}</span>
          </button>
          ${
            sow.pdfUrl && isVerifiedPdf(sow.pdfUrl)
              ? `
          <a href="${sow.pdfUrl}" target="_blank" download title="Download ${cleanSowTitle} PDF" class="launchpad-pill-pdf">
            <i class="fa-solid fa-file-pdf"></i>
          </a>`
              : ''
          }
        </div>`
    : '';

  const timelinePill = tl
    ? `
        <!-- Optional Pillar: Standalone Interactive Timeline Slider -->
        <div class="launchpad-pill-group pill-overview">
          <a href="${tl.url}" target="_blank" class="launchpad-pill-btn" style="text-decoration: none;" title="Open Interactive Classroom Timeline Slider">
            <i class="fa-solid fa-clock-rotate-left"></i>
            <span>${tl.label}</span>
          </a>
        </div>`
    : '';

  const arcadePill =
    unitId && unitId !== 'battlefield_trip'
      ? `
        <!-- Pillar: Interactive 7-Game Revision Arcade -->
        <div class="launchpad-pill-group pill-overview">
          <button type="button" class="launchpad-pill-btn" onclick="if(window.launchUnitArcade){window.launchUnitArcade('${unitId}', 'all', 'lobby');}else if(window.switchView){window.switchView('arcade', '${unitId}');}" title="Launch the 7-Game Revision Arcade (Keyword Stack, Timeline Blitz, Connections Wall, Redacted, Boss Sprint & more)">
            <i class="fa-solid fa-gamepad" style="color: #38bdf8;"></i>
            <span>Revision Arcade</span>
          </button>
        </div>`
      : '';

  return `
    <div class="hero-curricular-launchpad">
      <div class="hero-launchpad-capsule">
        ${textbookPill}
        ${workbookPill}
        ${workbookMarkSchemePill}
        ${retrievalPill}
        ${arcadePill}
        ${revisionGuidePill}
        ${sowPill}
        ${timelinePill}
        ${combinedPill}
        ${overviewPill}
      </div>
    </div>
  `;
}

/**
 * Opens an instant Key Topic / Era Textbook Picker Modal so GCSE courses
 * present slim individual Era / KT booklets directly instead of giant 28-page books.
 */
export function openTextbookEditionPicker(unitId) {
  const cfg = CURRICULAR_PILLARS_CATALOG[unitId]?.textbook;
  if (!cfg || !Array.isArray(cfg.editions) || cfg.editions.length === 0) {
    if (window.switchView) window.switchView('booklet', unitId);
    return;
  }

  const existing = document.getElementById('textbook-edition-picker-modal');
  if (existing) existing.remove();

  const rowsHtml = cfg.editions
    .map((ed) => {
      const safeTitle = (ed.label || '').replace(/'/g, "\\'");
      const hasPdf = isVerifiedPdf(ed.pdfUrl);
      return `
        <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding:12px 14px; background:#f8fafc; border:1.5px solid #e2e8f0; border-left:4px solid #0284c7; border-radius:8px; flex-wrap:wrap;">
          <div style="flex:1 1 240px; min-width:0;">
            <div style="font-size:0.92rem; font-weight:800; color:#0f172a; line-height:1.3;">${ed.label}</div>
            ${ed.pages ? `<div style="font-size:0.74rem; font-weight:700; color:#64748b; margin-top:2px;">${ed.pages} &bull; Pure Narrative Classroom Booklet</div>` : ''}
          </div>
          <div style="display:flex; align-items:center; gap:8px; flex-shrink:0;">
            <button type="button" onclick="document.getElementById('textbook-edition-picker-modal')?.remove(); window.openCurricularPillar('${ed.htmlUrl}', '${safeTitle}', '${ed.pdfUrl}', 'TEXTBOOK');" style="background:#ffffff; color:#0f172a; border:1.5px solid #cbd5e1; padding:7px 12px; border-radius:6px; font-size:0.78rem; font-weight:800; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
              <i class="fa-solid fa-book-open-reader" style="color:#0284c7;"></i> Read Online
            </button>
            ${
              hasPdf
                ? `<a href="${ed.pdfUrl}" target="_blank" download onclick="document.getElementById('textbook-edition-picker-modal')?.remove();" style="background:#0284c7; color:#ffffff; border:1.5px solid #0284c7; padding:7px 12px; border-radius:6px; font-size:0.78rem; font-weight:800; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
                    <i class="fa-solid fa-file-pdf"></i> Download PDF
                  </a>`
                : ''
            }
          </div>
        </div>
      `;
    })
    .join('');

  const modal = document.createElement('div');
  modal.id = 'textbook-edition-picker-modal';
  modal.style.cssText =
    'position:fixed; inset:0; z-index:99999; background:rgba(15,23,42,0.72); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; padding:16px; font-family:Inter,system-ui,sans-serif;';
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };

  modal.innerHTML = `
    <div style="width:100%; max-width:640px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 24px 48px rgba(0,0,0,0.35); border:1px solid #334155;">
      <div style="background:#0f172a; color:#ffffff; padding:16px 20px; display:flex; align-items:center; justify-content:space-between; gap:12px; border-bottom:3px solid #0284c7;">
        <div>
          <div style="font-size:0.68rem; font-weight:900; letter-spacing:0.1em; text-transform:uppercase; color:#38bdf8;">Pillar 1 &bull; Classroom Textbooks</div>
          <div style="font-size:1.08rem; font-weight:800; margin-top:2px;">${cfg.title}</div>
        </div>
        <button type="button" onclick="document.getElementById('textbook-edition-picker-modal')?.remove();" aria-label="Close" style="background:rgba(255,255,255,0.1); color:#e2e8f0; border:1px solid rgba(255,255,255,0.2); width:32px; height:32px; border-radius:6px; font-size:1rem; font-weight:800; cursor:pointer;">&times;</button>
      </div>
      <div style="padding:16px 20px; display:flex; flex-direction:column; gap:10px; max-height:72vh; overflow-y:auto;">
        ${rowsHtml}
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

if (typeof window !== 'undefined') {
  window.openTextbookEditionPicker = openTextbookEditionPicker;
}
