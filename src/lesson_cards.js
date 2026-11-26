import { getAssetUrl } from './engine/assets.js'; // refreshed
import { renderSidebarVideoBadgeHTML } from './engine/video_utils.js';
import { getIconicLessonVisuals } from './data/iconic_lesson_visuals.js';

export function getLessonEnquiryQuestion(lesson) {
  if (!lesson) return '';
  if (lesson.enquiry && typeof lesson.enquiry === 'string') {
    const text = lesson.enquiry.trim();
    if (text.split(/\s+/).length > 35) {
      const qMatch = text.match(/([^.?!]+[?])/g);
      if (qMatch && qMatch.length > 0) return qMatch[qMatch.length - 1].trim();
    }
    if (text) return text;
  }
  if (lesson.enquiry_question && typeof lesson.enquiry_question === 'string' && lesson.enquiry_question.trim()) {
    return lesson.enquiry_question.trim();
  }
  if (lesson.enquiryQuestion && typeof lesson.enquiryQuestion === 'string' && lesson.enquiryQuestion.trim()) {
    return lesson.enquiryQuestion.trim();
  }
  if (lesson.inquiry_question && typeof lesson.inquiry_question === 'string' && lesson.inquiry_question.trim()) {
    return lesson.inquiry_question.trim();
  }
  if (lesson.hook_text && typeof lesson.hook_text === 'string') {
    const qMatch = lesson.hook_text.trim().match(/([^.?!]+[?])/g);
    if (qMatch && qMatch.length > 0) return qMatch[qMatch.length - 1].trim();
  }
  if (lesson.subtitle && typeof lesson.subtitle === 'string') {
    return lesson.subtitle.trim();
  }
  return '';
}

/**
 * Evaluates whether an image candidate is an authentic historical photographic/documentary asset
 * suitable for display on a lesson card banner (strictly rejecting SVGs, diagrams, flowcharts,
 * and legacy AI/synthetic cover artwork).
 */
export function isValidCardPhoto(url) {
  if (!url || typeof url !== 'string') return false;
  const clean = url.trim().toLowerCase();
  if (clean.length === 0) return false;
  // Disallow SVGs and generic vector flowcharts
  if (clean.endsWith('.svg') || clean.includes('.svg?')) return false;
  // Disallow synthetic / AI parchment cover illustrations
  if (
    clean.includes('oslo_cover') ||
    clean.includes('cover_placeholder') ||
    clean.includes('placeholder_cover')
  ) {
    return false;
  }
  // Disallow flowcharts, schematics, and diagrams
  if (
    clean.includes('flowchart') ||
    clean.includes('diagram') ||
    clean.includes('schematic') ||
    clean.includes('infographic')
  ) {
    return false;
  }
  return true;
}

export function resolveLessonCardImage(lesson, unitIdOverride = '') {
  if (!lesson) return null;

  // 0. Curated Iconic Visual Registry (prioritises high-recognition portraits/artefacts over generic skylines)
  const activeUnitId =
    unitIdOverride || (typeof window !== 'undefined' && window.currentUnitId) || '';
  const iconic = getIconicLessonVisuals(activeUnitId, lesson);
  if (iconic && iconic.cardImage && isValidCardPhoto(iconic.cardImage)) {
    return iconic.cardImage;
  }

  // 1. Mandatory hardcoded historical protections for high-stakes GCSE turning points
  const isCME =
    activeUnitId.startsWith('cme') ||
    (lesson.title &&
      (lesson.title.includes('Oslo') ||
        lesson.title.includes('Munich') ||
        lesson.title.includes('British Mandate') ||
        lesson.title.includes('Arab-Israeli')));

  if (
    isCME &&
    (lesson.id === 'lesson_11' ||
      lesson.id === 'lesson_13' ||
      (lesson.title && lesson.title.includes('Oslo') && lesson.title.includes('Attempts at a Solution')))
  ) {
    return '/images/cme_oslo_handshake_1993.jpg';
  }
  if (
    isCME &&
    lesson.id === 'lesson_9' &&
    lesson.title &&
    (lesson.title.includes('Black September') || lesson.title.includes('Munich'))
  ) {
    return '/images/cme_munich_1972_balcony.jpg';
  }

  // 2. Explicitly configured card image or banner
  const directCandidates = [
    lesson.card_image,
    lesson.banner,
    lesson.hero_image,
    lesson.cover_image,
  ];

  for (let cand of directCandidates) {
    if (cand && typeof cand === 'object') {
      cand = cand.image || cand.src || cand.image_url || cand.url || null;
    }
    if (cand && isValidCardPhoto(cand)) {
      return cand;
    }
  }

  // 3. Scan narrative blocks for authentic photographic plates
  if (lesson.narrative_blocks && lesson.narrative_blocks.length > 0) {
    for (const b of lesson.narrative_blocks) {
      if (b.image && isValidCardPhoto(b.image)) {
        return b.image;
      }
      if (b.source) {
        const sImg = b.source.image || b.source.src || b.source.image_url;
        if (sImg && isValidCardPhoto(sImg)) {
          return sImg;
        }
      }
    }
  }

  // 4. Scan primary sources for authentic archival photographs
  if (lesson.sources && lesson.sources.length > 0) {
    for (const s of lesson.sources) {
      const sImg = s.image || s.src || s.image_url;
      if (sImg && isValidCardPhoto(sImg)) {
        return sImg;
      }
    }
  }

  // 5. Scan acts if present
  if (lesson.acts && lesson.acts.length > 0) {
    for (const a of lesson.acts) {
      if (a.source) {
        const aImg = a.source.image || a.source.src || a.source.image_url;
        if (aImg && isValidCardPhoto(aImg)) {
          return aImg;
        }
      }
    }
  }

  // 6. Safe fallback (anything except SVGs and oslo_cover)
  for (let cand of directCandidates) {
    if (cand && typeof cand === 'object') {
      cand = cand.image || cand.src || cand.image_url || cand.url || null;
    }
    if (
      cand &&
      typeof cand === 'string' &&
      !cand.endsWith('.svg') &&
      !cand.includes('oslo_cover')
    ) {
      return cand;
    }
  }

  return null;
}

export function renderKeyTopicLessonsHTML(unitData, currentUnitId, currentUnitData) {
  let lessonsHTML = `
      <style>
        .premium-banner {
          position: relative; overflow: hidden; border-radius: 10px; padding: 13px 20px; margin-top: 22px; margin-bottom: 14px;
          scroll-margin-top: 66px;
          box-shadow: 0 6px 16px -8px rgba(0,0,0,0.35); display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 12px;
          cursor: default;
        }
        .premium-banner-bg {
          position: absolute; top: -5%; left: -5%; width: 110%; height: 110%; 
          background-position: center; background-size: cover; 
          z-index: 1; filter: brightness(0.88); transition: transform 0.6s ease;
        }
        .premium-banner:hover .premium-banner-bg {
          transform: scale(1.02);
        }
        .premium-banner-overlay-1 {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
          background: linear-gradient(135deg, rgba(15,23,42,0.78) 0%, rgba(15,23,42,0.32) 100%); z-index: 2;
        }
        .premium-banner-overlay-2 {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
          opacity: 0.42; mix-blend-mode: multiply; z-index: 3;
        }
        .premium-banner-glow {
          position: absolute; bottom: -50px; right: -50px; width: 240px; height: 240px; 
          filter: blur(40px); z-index: 3; opacity: 0.5; border-radius: 50%;
        }
        .premium-banner-content {
          position: relative; z-index: 4; padding-left: 14px;
        }
        .premium-banner-title {
          margin: 0; color: #ffffff; font-size: 1.24rem; font-weight: 800; line-height: 1.22;
          font-family: 'Playfair Display', serif; text-shadow: 0px 2px 8px rgba(0,0,0,0.75); letter-spacing: -0.2px;
        }
        .premium-banner-enquiry {
          margin: 3px 0 0 0; color: #e2e8f0; font-size: 0.86rem; font-style: italic; line-height: 1.35;
          max-width: 820px; font-weight: 400; text-shadow: 0px 1px 6px rgba(0,0,0,0.75);
        }
        .compact-lessons-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(225px, 1fr));
          gap: 16px;
          text-align: left;
        }
        .lesson-enquiry-clamp {
          display: block;
          overflow: visible;
        }
      </style>
    `;

  if (
    currentUnitId === 'edexcel_medicine' ||
    currentUnitId === 'cme_new' ||
    currentUnitId === 'weimar_nazi_germany' ||
    currentUnitId === 'eee' ||
    currentUnitId === 'usa' ||
    currentUnitId === 'gcse_cold_war'
  ) {
    let periods = [];
    if (currentUnitId === 'edexcel_medicine') {
      periods = [
        {
          id: 'medieval',
          title: 'Medieval (c1250–c1500)',
          prefix: 'lesson_1_',
          gradient: 'linear-gradient(135deg, #7f1d1d, #dc2626)',
          border: '#dc2626',
          image: '/images/banner_medicine_medieval.jpg',
          bgPos: 'center 42%',
          enquiry: 'How much did medicine really change in Medieval England?',
        },
        {
          id: 'renaissance',
          title: 'Renaissance (c1500–c1700)',
          prefix: 'lesson_2_',
          gradient: 'linear-gradient(135deg, #064e3b, #059669)',
          border: '#059669',
          image: '/images/med_era_banner_renaissance_tulp.jpg',
          bgPos: 'center 35%',
          enquiry: 'Why did the Medical Renaissance have so little impact on everyday treatments?',
        },
        {
          id: '18th_19th',
          title: '18th & 19th C (c1700–c1900)',
          prefix: 'lesson_3_',
          gradient: 'linear-gradient(135deg, #475569, #d97706)',
          border: '#d97706',
          image: '/images/banner_medicine_18th_19th.jpg',
          bgPos: 'center 48%',
          enquiry:
            'How did the Industrial Revolution transform the understanding and prevention of disease?',
        },
        {
          id: 'modern',
          title: 'Modern (c1900–present)',
          prefix: 'lesson_4_',
          gradient: 'linear-gradient(135deg, #0c4a6e, #0284c7)',
          border: '#0284c7',
          image: '/images/banner_medicine_modern.jpg',
          bgPos: 'center 32%',
          enquiry:
            'How did technology and government intervention revolutionise 20th-century medicine?',
        },
        {
          id: 'western_front',
          title: 'Western Front (1914–1918)',
          prefix: 'lesson_5_',
          gradient: 'linear-gradient(135deg, #422006, #65a30d)',
          border: '#65a30d',
          image: '/images/banner_medicine_western_front.jpg',
          bgPos: 'center 42%',
          enquiry:
            'How did the horrific conditions of trench warfare drive rapid medical innovation?',
        },
      ];
    } else if (currentUnitId === 'cme_new') {
      periods = [
        {
          id: 'KT1',
          title: 'Key Topic 1: The Birth of Israel, 1945–63',
          prefix: 'KT 1',
          gradient: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
          border: '#3b82f6',
          image: '/assets/cme_ben_gurion.jpg',
          bgPos: 'center 25%',
          enquiry: 'How and why was the state of Israel established, and why did conflict escalate by 1956?',
        },
        {
          id: 'KT2',
          title: 'Key Topic 2: Escalating Conflict, 1963–73',
          prefix: 'KT 2',
          gradient: 'linear-gradient(135deg, #7f1d1d, #ef4444)',
          border: '#ef4444',
          image: '/assets/cme_new_yom_kippur_crossing.png',
          enquiry: 'What drove the major wars in the Middle East between 1967 and 1973?',
        },
        {
          id: 'KT3',
          title: 'Key Topic 3: Attempts at Peace, 1974–95',
          prefix: 'KT 3',
          gradient: 'linear-gradient(135deg, #064e3b, #10b981)',
          border: '#10b981',
          image: '/assets/cme_new_camp_david_accords.png',
          enquiry: 'Why did diplomatic breakthroughs still leave lasting peace elusive by 1995?',
          bgPos: 'center 20%',
        },
      ];
    } else if (
      currentUnitId === 'weimar_nazi_germany' ||
      (currentUnitData && currentUnitData.title && currentUnitData.title.includes('Weimar'))
    ) {
      periods = [
        {
          id: 'KT1',
          title: 'Key Topic 1: The Weimar Republic (1918–29)',
          prefix: 'lesson_1_',
          gradient: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
          border: '#3b82f6',
          image: 'images/weimar_kt1_cover.jpg',
          enquiry: 'To what extent did the Weimar Republic recover from its early crises by 1929?',
        },
        {
          id: 'KT2',
          title: "Key Topic 2: Hitler's Rise to Power (1919–33)",
          prefix: 'lesson_2_',
          gradient: 'linear-gradient(135deg, #7f1d1d, #dc2626)',
          border: '#dc2626',
          image: 'images/weimar_kt2_cover.jpg',
          enquiry: 'How did the Nazi Party grow from a fringe movement into the ruling party of Germany by 1933?',
        },
        {
          id: 'KT3',
          title: 'Key Topic 3: Nazi Control and Dictatorship (1933–39)',
          prefix: 'lesson_3_',
          gradient: 'linear-gradient(135deg, #4b5563, #1f2937)',
          border: '#1f2937',
          image: 'images/weimar_kt3_cover.jpg',
          enquiry: 'How did Hitler dismantle democracy and maintain control through terror and propaganda?',
        },
        {
          id: 'KT4',
          title: 'Key Topic 4: Life in Nazi Germany (1933–39)',
          prefix: 'lesson_4_',
          gradient: 'linear-gradient(135deg, #4d7c0f, #65a30d)',
          border: '#65a30d',
          image: 'images/weimar_kt4_cover.jpg',
          enquiry: 'How far did Nazi policies transform everyday life for women, youth, workers, and minorities?',
        },
      ];
    } else if (
      currentUnitId === 'eee' ||
      (currentUnitData && currentUnitData.title && currentUnitData.title.includes('Elizabeth'))
    ) {
      periods = [
        {
          id: 'KT1',
          title: 'Key Topic 1: Queen, government and religion, 1558–69',
          prefix: 'lesson_1_',
          gradient: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
          border: '#3b82f6',
          image: '/images/elizabeth_i_in_parliament_1559.jpg',
          bgPos: 'center 25%',
          enquiry: 'How successfully did Elizabeth I secure her throne and settle religious division by 1569?',
        },
        {
          id: 'KT2',
          title: 'Key Topic 2: Challenges to Elizabeth at home and abroad, 1569–88',
          prefix: 'lesson_2_',
          gradient: 'linear-gradient(135deg, #7f1d1d, #dc2626)',
          border: '#dc2626',
          image: '/images/elizabeth_tilbury_speech.jpg',
          bgPos: 'center 22%',
          enquiry: 'Why did Catholic plots and rivalry with Spain culminate in the Armada of 1588?',
        },
        {
          id: 'KT3',
          title: 'Key Topic 3: Elizabethan society in the Age of Exploration, 1558–88',
          prefix: 'lesson_3_',
          gradient: 'linear-gradient(135deg, #4b5563, #1f2937)',
          border: '#1f2937',
          image: '/images/elizabethan_england_saxton_1579_map_auth.jpg',
          bgPos: 'center 35%',
          enquiry: 'How far was the Elizabethan era truly a Golden Age of culture, education, and exploration?',
        },
      ];
    } else if (
      currentUnitId === 'usa' ||
      (currentUnitData && currentUnitData.title && currentUnitData.title.includes('USA'))
    ) {
      periods = [
        {
          id: 'KT1',
          title: 'Key Topic 1: The development of the civil rights movement, 1954–60',
          prefix: 'lesson_1_',
          gradient: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
          border: '#2563eb',
          image: '/units/usa/assets/sources/airborne-little-rock-patrol.jpg',
          bgPos: 'center 35%',
          enquiry:
            'How did legal victories and grassroots action transform the struggle for civil rights?',
        },
        {
          id: 'KT2',
          title: 'Key Topic 2: Protest, progress and radicalism, 1960–75',
          prefix: 'lesson_2_',
          gradient: 'linear-gradient(135deg, #7f1d1d, #dc2626)',
          border: '#dc2626',
          image: '/units/usa/assets/sources/birmingham-protests-dogs-1963.jpg',
          bgPos: 'center 30%',
          enquiry:
            'How did the civil rights movement evolve from non-violent protest to Black Power?',
        },
        {
          id: 'KT3',
          title: 'Key Topic 3: US involvement in the Vietnam War, 1954–75',
          prefix: 'lesson_3_',
          gradient: 'linear-gradient(135deg, #064e3b, #059669)',
          border: '#059669',
          image: '/units/usa/assets/sources/us-soldier-patrolling-swamp.jpg',
          bgPos: 'center 30%',
          enquiry:
            'Why did the USA become militarily entangled in Vietnam, and why were US tactics unable to defeat the Vietcong?',
        },
        {
          id: 'KT4',
          title:
            'Key Topic 4: Reactions to, and the end of, US involvement in the Vietnam War, 1964–75',
          prefix: 'lesson_4_',
          gradient: 'linear-gradient(135deg, #312e81, #6366f1)',
          border: '#6366f1',
          image: '/units/usa/assets/sources/antiwar-pentagon-protest-1967.jpg',
          bgPos: 'center 30%',
          enquiry:
            'Why did domestic opposition force the USA to withdraw, and what was the consequence of the fall of Saigon?',
        },
      ];
    } else if (
      currentUnitId === 'gcse_cold_war' ||
      (currentUnitData && currentUnitData.title && currentUnitData.title.includes('Superpower'))
    ) {
      periods = [
        {
          id: 'KT1',
          title: 'Key Topic 1: The origins of the Cold War, 1941–58',
          prefix: 'KT 1',
          gradient: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
          border: '#2563eb',
          image: '/images/cold_war/yalta_conference_1945.jpg',
          bgPos: 'center 25%',
          enquiry: 'How did the wartime Grand Alliance fracture into two rival nuclear blocs by 1958?',
        },
        {
          id: 'KT2',
          title: 'Key Topic 2: Cold War crises, 1958–70',
          prefix: 'KT 2',
          gradient: 'linear-gradient(135deg, #7f1d1d, #dc2626)',
          border: '#dc2626',
          image: '/images/checkpoint_charlie_tanks_1961.jpg',
          bgPos: 'center 35%',
          enquiry: 'Why did superpower confrontation peak in Berlin, Cuba, and Czechoslovakia?',
        },
        {
          id: 'KT3',
          title: 'Key Topic 3: The end of the Cold War, 1970–91',
          prefix: 'KT 3',
          gradient: 'linear-gradient(135deg, #064e3b, #10b981)',
          border: '#10b981',
          image: '/images/upgraded/gcse-cw-cme/cw_l12_berlin_wall_mauerfall_nov_1989.jpg',
          bgPos: 'center 30%',
          enquiry: 'How did Détente collapse into the Second Cold War before Gorbachev and 1989 ended Soviet rule?',
        },
      ];
    }

    periods.forEach((p) => {
      lessonsHTML += `
        <div class="premium-banner" id="kt-section-${p.id}">
          <div class="premium-banner-bg" style="background-image: url('${p.image}'); background-position: ${p.bgPos || 'center'};"></div>
          <div class="premium-banner-overlay-1"></div>
          <div class="premium-banner-overlay-2" style="background: ${p.gradient};"></div>
          <div class="premium-banner-glow" style="background: radial-gradient(circle, ${p.border} 0%, transparent 70%);"></div>
          <div class="premium-banner-content" style="border-left: 5px solid ${p.border}; flex: 1; min-width: 240px;">
            <h3 class="premium-banner-title">${p.title}</h3>
            <p class="premium-banner-enquiry">${p.enquiry}</p>
          </div>
        </div>
      `;

      lessonsHTML += '<div class="compact-lessons-grid">';

      let foundAny = false;
      unitData.lessons.forEach((lesson, index) => {
        let isMatch =
          (lesson.id && lesson.id.startsWith(p.prefix)) ||
          (lesson.title && lesson.title.startsWith(p.prefix));

        if (!isMatch && currentUnitId === 'cme_new') {
          if (p.id === 'KT1') {
            isMatch =
              (lesson.title && /KT\s*1\b/i.test(lesson.title)) ||
              (lesson.id &&
                (lesson.id.startsWith('lesson_1_') ||
                  ['lesson_0', 'lesson_1', 'lesson_2', 'lesson_3'].includes(lesson.id))) ||
              index < 4;
          } else if (p.id === 'KT2') {
            isMatch =
              (lesson.title && /KT\s*2\b/i.test(lesson.title)) ||
              (lesson.id &&
                (lesson.id.startsWith('lesson_2_') ||
                  [
                    'lesson_4',
                    'lesson_5',
                    'lesson_6',
                    'lesson_7',
                    'lesson_8',
                  ].includes(lesson.id))) ||
              (index >= 4 && index < 9);
          } else if (p.id === 'KT3') {
            isMatch =
              (lesson.title && /KT\s*3\b/i.test(lesson.title)) ||
              (lesson.id &&
                (lesson.id.startsWith('lesson_3_') ||
                  ['lesson_9', 'lesson_10', 'lesson_11'].includes(lesson.id))) ||
              index >= 9;
          }
        }

        if (isMatch) {
          foundAny = true;

          let displayTitle = (lesson.title || '')
            .replace(/^(?:Enquiry|Lesson)\s*\d+:\s*/i, '')
            .trim();
          let shortCode = `Lesson ${index + 1}`;
          let overlayBadge = `LESSON ${index + 1}`;
          const ktMatch = displayTitle.match(/^(KT\s*\d+\.\d+)\s*(?:Enquiry)?:\s*(.*)$/i);
          if (ktMatch) {
            if (currentUnitId === 'cme_new' || lesson.id === 'lesson_0' || ktMatch[1] === 'KT 1.0') {
              if (index === 0 || lesson.id === 'lesson_0' || ktMatch[1] === 'KT 1.0') {
                shortCode = `${ktMatch[1]} • Intro`;
                overlayBadge = `INTRO • ${ktMatch[1]}`;
              } else {
                shortCode = `${ktMatch[1]} • Lesson ${index}`;
                overlayBadge = `LESSON ${index}`;
              }
            } else {
              shortCode = `${ktMatch[1]} • Lesson ${index + 1}`;
              overlayBadge = `LESSON ${index + 1}`;
            }
            displayTitle = ktMatch[2].trim();
          } else if (currentUnitId === 'cme_new' && (index === 0 || lesson.id === 'lesson_0')) {
            shortCode = `Intro Lesson`;
            overlayBadge = `INTRO`;
          }

          let candidateImg = resolveLessonCardImage(lesson, currentUnitId);
          let topMediaHTML = '';
          if (candidateImg) {
            let imgUrl = getAssetUrl(candidateImg);
            let cardPos =
              lesson.card_position ||
              lesson.card_image_position ||
              (typeof lesson.card_image === 'object' && lesson.card_image?.position) ||
              (typeof lesson.banner === 'object' && lesson.banner
                ? lesson.banner.card_position || lesson.banner.position
                : null) ||
              lesson.banner_position ||
              'center 22%';

            if (imgUrl.includes('edward_jenner')) {
              cardPos = 'center 15%';
            } else if (imgUrl.includes('oslo_handshake') || lesson.id === 'lesson_11' || lesson.id === 'lesson_13') {
              cardPos = 'center 20%';
            }
            cardPos = String(cardPos || 'center 22%').replace(/\bcentre\b/gi, 'center');

            topMediaHTML = `
              <div style="position: relative; width: 100%; height: 128px; overflow: hidden; background: #0a101f; flex-shrink: 0;">
                <div style="position: absolute; top: -10px; left: -10px; right: -10px; bottom: -10px; background-image: url('${imgUrl}'); background-size: cover; background-position: center; filter: blur(14px) brightness(0.34); opacity: 0.72; transform: scale(1.12);"></div>
                <img src="${imgUrl}" alt="${lesson.title}" class="lesson-card-banner-img" onload="if(this.naturalHeight > this.naturalWidth * 0.72){this.style.objectFit='contain';this.style.objectPosition='center center';this.style.filter='drop-shadow(0 3px 10px rgba(0,0,0,0.52))';}else{this.style.objectFit='cover';}" style="position: relative; z-index: 2; width: 100%; height: 100%; object-fit: cover; object-position: ${cardPos}; display: block; transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);" />
                <span style="position: absolute; top: 8px; left: 8px; z-index: 3; background: rgba(15, 23, 42, 0.84); color: #ffffff; font-size: 0.63rem; font-weight: 800; letter-spacing: 0.05em; padding: 2.5px 7px; border-radius: 5px; border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(4px);">
                  ${overlayBadge}
                </span>
              </div>
            `;
          } else {
            topMediaHTML = `
              <div style="position: relative; width: 100%; height: 42px; background: linear-gradient(135deg, ${p.border || '#1e3a8a'} 0%, #3b82f6 100%); display: flex; align-items: center; padding: 0 12px; flex-shrink: 0;">
                <span style="background: rgba(255,255,255,0.22); color: #ffffff; font-size: 0.68rem; font-weight: 800; padding: 2.5px 9px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.04em;">
                  ${overlayBadge}
                </span>
              </div>
            `;
          }

          const displayEnquiry = getLessonEnquiryQuestion(lesson);

          lessonsHTML += `
            <div class="homepage-lesson-card" data-action="view-lesson-detail" data-index="${index}" style="background: #ffffff; border: 1.5px solid #e2e8f0; border-top: 3.5px solid ${p.border || '#2563eb'}; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 6px rgba(15,23,42,0.05); cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s; display: flex; flex-direction: column;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 18px rgba(15,23,42,0.1)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 6px rgba(15,23,42,0.05)';">
              ${topMediaHTML}
              <div style="padding: 11px 13px 13px 13px; display: flex; flex-direction: column; flex: 1; justify-content: space-between; gap: 6px;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; gap: 6px;">
                    <span style="font-size: 0.68rem; font-weight: 700; color: ${p.border || '#2563eb'}; text-transform: uppercase; letter-spacing: 0.04em;">
                      ${shortCode}
                    </span>
                    ${(() => {
                      const cnt = typeof window !== 'undefined' && window.getLessonInfographicCount ? window.getLessonInfographicCount(currentUnitId, lesson.id || index) : 0;
                      if (!cnt || cnt === 0) return '';
                      const items = typeof window !== 'undefined' && window.getLessonInfographicsSync ? window.getLessonInfographicsSync(currentUnitId, lesson.id || index) : [];
                      const posterItems = Array.isArray(items) ? items.filter(it => it && it.image && it.image.trim().length > 0) : [];
                      if (posterItems.length > 0) {
                        const label = posterItems.length > 1 ? `Infographics (${posterItems.length})` : 'Infographic';
                        return `<button type="button" class="btn-card-infographic-pill" onclick="event.stopPropagation(); if(window.openLessonInfographicModal){window.openLessonInfographicModal('${lesson.id || index}', '${currentUnitId}');}" title="Open Lesson Infographic" style="padding: 2px 6px; font-size: 0.66rem; font-weight: 700; background: #e0f2fe; color: #0284c7; border: 1px solid #bae6fd; border-radius: 4px; display: inline-flex; align-items: center; gap: 3px; cursor: pointer;"><i class="fa-solid fa-image" style="font-size: 0.65rem;"></i> <span>${label}</span></button>`;
                      }
                      const storyItems = Array.isArray(items) ? items.filter(it => it && it.type === 'visual_story_sheet' && it.interactiveUrl) : [];
                      if (storyItems.length > 0) {
                        return `<button type="button" class="btn-card-infographic-pill" onclick="event.stopPropagation(); if(window.openLessonInfographicModal){window.openLessonInfographicModal('${lesson.id || index}', '${currentUnitId}', { initialMode: 'interactive' });}" title="Open 1-Page Visual Story Sheet with Studio Voice" style="padding: 2px 6px; font-size: 0.66rem; font-weight: 700; background: #fef3c7; color: #b45309; border: 1px solid #fde68a; border-radius: 4px; display: inline-flex; align-items: center; gap: 3px; cursor: pointer;"><i class="fa-solid fa-diagram-project" style="font-size: 0.63rem; color: #d97706;"></i> <span>Story Sheet</span></button>`;
                      }
                      const isKs2Card = currentUnitId === 'ks2_ww2' || String(currentUnitId || '').startsWith('ks2');
                      if (isKs2Card && items && items.some(it => it.interactiveUrl)) {
                        return `<button type="button" class="btn-card-infographic-pill" onclick="event.stopPropagation(); if(window.openLessonInfographicModal){window.openLessonInfographicModal('${lesson.id || index}', '${currentUnitId}', { initialMode: 'interactive' });}" title="Open Interactive Infographic" style="padding: 2px 6px; font-size: 0.66rem; font-weight: 700; background: #fef3c7; color: #b45309; border: 1px solid #fde68a; border-radius: 4px; display: inline-flex; align-items: center; gap: 3px; cursor: pointer;"><i class="fa-solid fa-wand-magic-sparkles" style="font-size: 0.65rem; color: #d97706;"></i> <span>Infographic</span></button>`;
                      }
                      return '';
                    })()}
                  </div>
                  <h3 style="margin: 0 0 5px 0; color: #0f172a; font-size: 0.94rem; font-weight: 700; line-height: 1.3; font-family: 'Playfair Display', Georgia, serif;">
                    ${displayTitle}
                  </h3>
                  ${
                    displayEnquiry
                      ? `
                    <p class="lesson-enquiry-clamp" style="margin: 0; color: #475569; font-weight: 400; font-size: 0.79rem; line-height: 1.38; font-style: italic;">
                      ${displayEnquiry}
                    </p>
                  `
                      : ''
                  }
                </div>
              </div>
            </div>
          `;
        }
      });

      if (!foundAny) {
        lessonsHTML += `<p style="color: #64748b; font-style: italic; margin-left: 10px;">No lessons found for this period.</p>`;
      }
      lessonsHTML += '</div>';
    });
  } else {
    const isKs2UnitCards =
      unitData?.id === 'ks2_ww2' ||
      currentUnitId === 'ks2_ww2' ||
      Boolean(unitData?.is_ks2) ||
      Boolean(currentUnitData && currentUnitData.id === 'ks2_ww2');
    const totalLessonsCount = Array.isArray(unitData.lessons) ? unitData.lessons.length : 0;
    lessonsHTML +=
      `<h2 style="font-family: 'Playfair Display', serif; font-size: 1.3rem; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 22px; margin-bottom: 16px;">${isKs2UnitCards ? `Enquiry Lessons (1–${totalLessonsCount || 11})` : `Enquiry Lessons (${totalLessonsCount})`}</h2><div class="compact-lessons-grid">`;
    if (unitData.lessons) {
      unitData.lessons.forEach((lesson, index) => {
        const cardBadge = `Lesson ${index + 1}`;
        const overlayBadge = `LESSON ${index + 1}`;

        let candidateImg = resolveLessonCardImage(lesson, currentUnitId || unitData?.id || '');

        let topMediaHTML = '';
        if (candidateImg) {
          let imgUrl = getAssetUrl(candidateImg);
          let cardPos =
            lesson.card_position ||
            lesson.card_image_position ||
            (typeof lesson.card_image === 'object' && lesson.card_image?.position) ||
            (typeof lesson.banner === 'object' && lesson.banner
              ? lesson.banner.card_position || lesson.banner.position
              : null) ||
            lesson.banner_position;

          if (imgUrl.includes('edward_jenner')) {
            cardPos = 'center 15%';
          } else if (imgUrl.includes('oslo_handshake') || lesson.id === 'lesson_13') {
            cardPos = 'center 20%';
          }

          if (!cardPos) cardPos = 'center 22%';
          cardPos = String(cardPos).replace(/\bcentre\b/gi, 'center');
          const hasExplicitCardPos = Boolean(lesson.card_position || lesson.card_image_position);

          topMediaHTML = `
            <div style="position: relative; width: 100%; height: 128px; overflow: hidden; background: #0a101f; flex-shrink: 0;">
              <div style="position: absolute; top: -10px; left: -10px; right: -10px; bottom: -10px; background-image: url('${imgUrl}'); background-size: cover; background-position: center; filter: blur(14px) brightness(0.34); opacity: 0.72; transform: scale(1.12);"></div>
              <img src="${imgUrl}" alt="${lesson.title}" class="lesson-card-banner-img" onload="if(this.naturalHeight > this.naturalWidth * 0.82){this.style.objectFit='contain';this.style.objectPosition='center center';this.style.filter='drop-shadow(0 3px 10px rgba(0,0,0,0.52))';}else{this.style.objectFit='cover';}" style="position: relative; z-index: 2; width: 100%; height: 100%; object-fit: cover; object-position: ${cardPos}${hasExplicitCardPos ? ' !important' : ''}; display: block; transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);" />
              <span style="position: absolute; top: 8px; left: 8px; z-index: 3; background: rgba(15, 23, 42, 0.84); color: #ffffff; font-size: 0.63rem; font-weight: 800; letter-spacing: 0.05em; padding: 2.5px 7px; border-radius: 5px; border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(4px);">
                ${overlayBadge}
              </span>
            </div>
          `;
        } else {
          topMediaHTML = `
            <div style="position: relative; width: 100%; height: 42px; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); display: flex; align-items: center; padding: 0 12px; flex-shrink: 0;">
              <span style="background: rgba(255,255,255,0.22); color: #ffffff; font-size: 0.68rem; font-weight: 800; padding: 2.5px 9px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.04em;">
                ${overlayBadge}
              </span>
            </div>
          `;
        }

        const displayTitle = (lesson.title || '')
          .replace(/^(?:Enquiry|Lesson)\s*\d+:\s*/i, '')
          .trim();
        const displayEnquiry = getLessonEnquiryQuestion(lesson);

        lessonsHTML += `
          <div class="homepage-lesson-card" data-action="view-lesson-detail" data-index="${index}" style="background: #ffffff; border: 1.5px solid #e2e8f0; border-top: 3.5px solid #2563eb; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 6px rgba(15,23,42,0.05); cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s; display: flex; flex-direction: column;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 18px rgba(15,23,42,0.1)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 6px rgba(15,23,42,0.05)';">
            ${topMediaHTML}
            <div style="padding: 11px 13px 13px 13px; display: flex; flex-direction: column; flex: 1; justify-content: space-between; gap: 6px;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; gap: 6px;">
                  <span style="font-size: 0.68rem; font-weight: 700; color: #2563eb; text-transform: uppercase; letter-spacing: 0.04em;">
                    ${cardBadge}
                  </span>
                  ${(() => {
                    const cnt = typeof window !== 'undefined' && window.getLessonInfographicCount ? window.getLessonInfographicCount(currentUnitId, lesson.id || index) : 0;
                    if (!cnt || cnt === 0) return '';
                    const items = typeof window !== 'undefined' && window.getLessonInfographicsSync ? window.getLessonInfographicsSync(currentUnitId, lesson.id || index) : [];
                    const posterItems = Array.isArray(items) ? items.filter(it => it && it.image && it.image.trim().length > 0) : [];
                    if (posterItems.length > 0) {
                      const label = posterItems.length > 1 ? `Infographics (${posterItems.length})` : 'Infographic';
                      return `<button type="button" class="btn-card-infographic-pill" onclick="event.stopPropagation(); if(window.openLessonInfographicModal){window.openLessonInfographicModal('${lesson.id || index}', '${currentUnitId}');}" title="Open Lesson Infographic" style="padding: 2px 6px; font-size: 0.66rem; font-weight: 700; background: #e0f2fe; color: #0284c7; border: 1px solid #bae6fd; border-radius: 4px; display: inline-flex; align-items: center; gap: 3px; cursor: pointer;"><i class="fa-solid fa-image" style="font-size: 0.65rem;"></i> <span>${label}</span></button>`;
                    }
                    const storyItems = Array.isArray(items) ? items.filter(it => it && it.type === 'visual_story_sheet' && it.interactiveUrl) : [];
                    if (storyItems.length > 0) {
                      return `<button type="button" class="btn-card-infographic-pill" onclick="event.stopPropagation(); if(window.openLessonInfographicModal){window.openLessonInfographicModal('${lesson.id || index}', '${currentUnitId}', { initialMode: 'interactive' });}" title="Open 1-Page Visual Story Sheet with Studio Voice" style="padding: 2px 6px; font-size: 0.66rem; font-weight: 700; background: #fef3c7; color: #b45309; border: 1px solid #fde68a; border-radius: 4px; display: inline-flex; align-items: center; gap: 3px; cursor: pointer;"><i class="fa-solid fa-diagram-project" style="font-size: 0.63rem; color: #d97706;"></i> <span>Story Sheet</span></button>`;
                    }
                    if (isKs2UnitCards && items && items.some(it => it.interactiveUrl)) {
                      return `<button type="button" class="btn-card-infographic-pill" onclick="event.stopPropagation(); if(window.openLessonInfographicModal){window.openLessonInfographicModal('${lesson.id || index}', '${currentUnitId}', { initialMode: 'interactive' });}" title="Open Interactive Infographic" style="padding: 2px 6px; font-size: 0.66rem; font-weight: 700; background: #fef3c7; color: #b45309; border: 1px solid #fde68a; border-radius: 4px; display: inline-flex; align-items: center; gap: 3px; cursor: pointer;"><i class="fa-solid fa-wand-magic-sparkles" style="font-size: 0.65rem; color: #d97706;"></i> <span>Infographic</span></button>`;
                    }
                    return '';
                  })()}
                </div>
                <h3 style="margin: 0 0 5px 0; color: #0f172a; font-size: 0.94rem; font-weight: 700; line-height: 1.3; font-family: 'Playfair Display', Georgia, serif;">
                  ${displayTitle}
                </h3>
                ${
                  displayEnquiry
                    ? `
                  <p class="${isKs2UnitCards ? '' : 'lesson-enquiry-clamp'}" style="margin: 0; color: #475569; font-weight: 400; font-size: 0.79rem; line-height: 1.38; font-style: italic;">
                    ${displayEnquiry}
                  </p>
                `
                    : ''
                }
              </div>
            </div>
          </div>
        `;
      });
    }
    lessonsHTML += '</div>';
  }

  return lessonsHTML;
}
