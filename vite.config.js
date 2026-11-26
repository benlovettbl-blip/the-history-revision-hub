import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import {
  SEO_UNIT_ROUTES,
  SCHOOLS_SEO_PAGE,
  SITE_ORIGIN,
  getLessonSeoSlugList,
} from './src/data/seo_routes.js';
import { getLessonMockQuestions } from './src/engine/mock_exam_bank_data.js';

function stripPlainText(str = '') {
  return String(str)
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(?:p|div|li|h[1-6])>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&bull;|•/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&ndash;/gi, '–')
    .replace(/&mdash;/gi, '—')
    .replace(/&ldquo;|&rdquo;|&quot;/gi, '"')
    .replace(/&#39;|&rsquo;|&lsquo;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function trimAtSentence(text = '', maxLen = 380) {
  const clean = stripPlainText(text).replace(/^Sample Acceptable Inferences:\s*/i, '').trim();
  if (!clean || clean.length <= maxLen) return clean;
  const slice = clean.slice(0, maxLen);
  const lastStop = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('! '), slice.lastIndexOf('? '));
  if (lastStop > 110) return slice.slice(0, lastStop + 1).trim();
  const lastSpace = slice.lastIndexOf(' ');
  return `${(lastSpace > 80 ? slice.slice(0, lastSpace) : slice).trim()}...`;
}

function collectLessonSeoQA(unitId, lesson) {
  const items = [];
  const seenKeys = new Set();

  const pushQA = (rawQ, rawAns, marks) => {
    let qClean = stripPlainText(rawQ || '').replace(/^(?:Question|Task)\s*\d+[\.:\s-]*/i, '').trim();
    if (!qClean || qClean.length < 12) return;
    const normKey = qClean
      .toLowerCase()
      .replace(/\[\s*\d+[^\]]*\]|\(\s*\d+\s*marks?\s*\)/gi, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
    if (!normKey || seenKeys.has(normKey)) return;
    seenKeys.add(normKey);

    if (marks && !/\b\d+\s*marks?\b/i.test(qClean)) {
      qClean = `${qClean} (${marks} marks)`;
    }
    const ansClean = trimAtSentence(rawAns || '', 380);
    items.push({ question: qClean, answer: ansClean });
  };

  if (lesson?.exam_practice) {
    const ep = lesson.exam_practice;
    if (Array.isArray(ep.questions)) {
      ep.questions.forEach((q) => {
        let bestAns = q.model || q.model_answer || q.answer || '';
        if (!bestAns && q.model_tiers && typeof q.model_tiers === 'object' && !Array.isArray(q.model_tiers)) {
          const tierVals = Object.values(q.model_tiers).filter((v) => typeof v === 'string');
          if (tierVals.length > 0) bestAns = tierVals[tierVals.length - 1];
        }
        pushQA(q.question || q.prompt, bestAns, q.marks);
      });
    }
    if (ep.question) pushQA(ep.question, ep.model || ep.model_answer || ep.answer, ep.marks);
    if (ep.part_a?.question) pushQA(ep.part_a.question, ep.part_a.model || ep.part_a.answer, ep.part_a.marks);
    if (ep.part_b?.question) pushQA(ep.part_b.question, ep.part_b.model || ep.part_b.answer, ep.part_b.marks);
  }

  const extraMocks = getLessonMockQuestions(unitId, lesson?.id);
  if (Array.isArray(extraMocks)) {
    extraMocks.forEach((mq) => {
      pushQA(mq.questionText || mq.question, mq.modelAnswer || mq.model, mq.marks);
    });
  }

  if (Array.isArray(lesson?.tasks)) {
    lesson.tasks.forEach((t) => {
      let tAns = t.model_answer || t.model || t.answer || '';
      if (!tAns && t.feature_1?.model) {
        tAns = `${t.feature_1.model} ${t.feature_2?.model || ''}`;
      }
      pushQA(t.question || t.prompt || t.synthesis_prompt, tAns, t.marks);
    });
  }

  return items;
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function seoCoursePagesPlugin() {
  return {
    name: 'seo-course-pages-generator',
    closeBundle() {
      const distDir = path.resolve(process.cwd(), 'dist');
      const baseIndexPath = path.join(distDir, 'index.html');
      const dbPath = path.resolve(process.cwd(), 'database.json');
      if (!fs.existsSync(baseIndexPath) || !fs.existsSync(dbPath)) return;

      const baseHtml = fs.readFileSync(baseIndexPath, 'utf8');
      const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

      // 1. Inject Homepage JSON-LD + Crawlable Course Directory into root dist/index.html
      const homeItemListSchema = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'EducationalOrganization',
            name: 'The History Revision Hub',
            url: `${SITE_ORIGIN}/`,
            email: 'contact@historyrevisionhub.co.uk',
            contactPoint: {
              '@type': 'ContactPoint',
              email: 'contact@historyrevisionhub.co.uk',
              contactType: 'customer support',
              areaServed: 'GB',
              availableLanguage: 'en-GB',
            },
          },
          {
            '@type': 'WebSite',
            name: 'The History Revision Hub',
            url: `${SITE_ORIGIN}/`,
            description:
              'Interactive UK History learning and revision platform for Key Stage 2, Key Stage 3, and Pearson Edexcel GCSE (9–1) History.',
          },
          {
            '@type': 'ItemList',
            name: 'UK History Courses (KS2, KS3 & Edexcel GCSE 9–1)',
            itemListElement: SEO_UNIT_ROUTES.map((r, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              name: r.heading,
              url: `${SITE_ORIGIN}/${r.slug}/`,
            })),
          },
        ],
      };

      const homeDirectoryHtml = `
          <section class="seo-prerender-directory" style="max-width: 920px; margin: 24px auto; padding: 20px;">
            <h1 style="font-size: 1.6rem; margin-bottom: 8px;">The History Revision Hub — UK KS2, KS3 &amp; Edexcel GCSE (9–1) History</h1>
            <p style="margin-bottom: 18px; line-height: 1.6;">Interactive History lessons, archival primary sources, studio audio read-alouds, retrieval quizzes, and printable classroom Textbooks, Pupil Workbooks, and Knowledge Retrieval Companions across Key Stage 2, Key Stage 3, and Pearson Edexcel GCSE History.</p>
            <nav aria-label="History Courses Directory">
              <ul style="line-height: 1.8; padding-left: 20px;">
                ${SEO_UNIT_ROUTES.map(
                  (r) =>
                    `<li><a href="/${escapeHtml(r.slug)}/"><strong>${escapeHtml(r.heading)}</strong></a> — ${escapeHtml(r.keyStage)}</li>`,
                ).join('\n                ')}
              </ul>
            </nav>
          </section>`;

      const enrichedHomeHtml = baseHtml
        .replace(
          '</head>',
          `    <script type="application/ld+json">${JSON.stringify(homeItemListSchema)}</script>\n  </head>`,
        )
        .replace(
          /<div class="content-container" id="main-content">[\s\S]*?<\/div>/,
          `<div class="content-container" id="main-content">${homeDirectoryHtml}\n        </div>`,
        );

      fs.writeFileSync(baseIndexPath, enrichedHomeHtml, 'utf8');

      // 2. Generate dedicated static HTML route for each course + every individual lesson in SEO_UNIT_ROUTES
      let generatedCount = 0;
      let generatedLessonCount = 0;
      let totalIndexedQuestions = 0;
      const lessonSitemapUrls = [];

      for (const route of SEO_UNIT_ROUTES) {
        const unitRecord = db[route.unitId];
        const unitData = (unitRecord && (unitRecord.data || unitRecord)) || {};
        const lessons = unitData.lessons || unitData.subtopics || [];
        const lessonSlugs = getLessonSeoSlugList(lessons);
        const canonicalUrl = `${SITE_ORIGIN}/${route.slug}/`;
        const rawImage = unitData.cover_image || unitData.homepage_background || '/icon-512.svg';
        const ogImageUrl = rawImage.startsWith('http') ? rawImage : `${SITE_ORIGIN}${rawImage}`;
        const overviewProse =
          unitData.synopsis || unitData.description || route.metaDescription;

        const courseSchema = {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'The History Revision Hub',
                  item: `${SITE_ORIGIN}/`,
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: route.heading,
                  item: canonicalUrl,
                },
              ],
            },
            {
              '@type': 'Course',
              name: route.heading,
              description: route.metaDescription,
              url: canonicalUrl,
              educationalLevel: route.keyStage,
              inLanguage: 'en-GB',
              provider: {
                '@type': 'EducationalOrganization',
                name: 'The History Revision Hub',
                url: `${SITE_ORIGIN}/`,
                email: 'contact@historyrevisionhub.co.uk',
              },
              syllabusSections: lessons.slice(0, 30).map((l, idx) => ({
                '@type': 'Syllabus',
                name: l.title || `Enquiry ${idx + 1}`,
                description: l.enquiry || l.enquiryQuestion || l.subtitle || l.period || undefined,
                url: `${SITE_ORIGIN}/${route.slug}/${lessonSlugs[idx]}/`,
              })),
            },
          ],
        };

        const lessonItemsHtml = lessons
          .map((l, idx) => {
            const title = escapeHtml(l.title || `Lesson ${idx + 1}`);
            const eq = l.enquiry || l.enquiryQuestion || l.enquiry_question || '';
            const enquiry = eq ? ` — <em>${escapeHtml(eq)}</em>` : '';
            return `<li><a href="/${escapeHtml(route.slug)}/${escapeHtml(lessonSlugs[idx])}/"><strong>${title}</strong></a>${enquiry}</li>`;
          })
          .join('\n              ');

        const otherLinksHtml = SEO_UNIT_ROUTES.filter((r) => r.unitId !== route.unitId)
          .map((r) => `<a href="/${escapeHtml(r.slug)}/" style="margin-right: 12px;">${escapeHtml(r.heading)}</a>`)
          .join('\n              ');

        const courseBodyHtml = `
          <article class="seo-course-prerender" style="max-width: 920px; margin: 24px auto; padding: 20px;">
            <p style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.8; margin-bottom: 6px;">${escapeHtml(route.examBoard)} &bull; ${escapeHtml(route.keyStage)}</p>
            <h1 style="font-size: 1.75rem; margin-bottom: 12px;">${escapeHtml(route.heading)}</h1>
            <p style="line-height: 1.65; margin-bottom: 14px;">${escapeHtml(overviewProse)}</p>
            <p style="line-height: 1.6; margin-bottom: 20px; font-size: 0.94rem; opacity: 0.92;">Includes studio-voiced narrative lessons, rotated archival primary sources, interactive retrieval quizzes, and printable classroom Textbooks, Pupil Workbooks, and Knowledge Retrieval Companions.</p>
            ${
              lessonItemsHtml
                ? `<h2 style="font-size: 1.2rem; margin-bottom: 10px;">Course Enquiries &amp; Revision Topics (${lessons.length} Lessons)</h2>
            <ol style="line-height: 1.75; padding-left: 22px; margin-bottom: 24px;">
              ${lessonItemsHtml}
            </ol>`
                : ''
            }
            <nav aria-label="All History Courses" style="font-size: 0.88rem; line-height: 1.8; border-top: 1px solid rgba(148,163,184,0.25); padding-top: 14px;">
              <a href="/" style="font-weight: 700; margin-right: 14px;">&larr; All Courses Home</a>
              ${otherLinksHtml}
            </nav>
          </article>`;

        const extraMetaTags = `    <meta property="og:image" content="${escapeHtml(ogImageUrl)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(route.seoTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(route.metaDescription)}" />
    <meta name="twitter:image" content="${escapeHtml(ogImageUrl)}" />
    <script>window.__initialUnitBootMap=window.__initialUnitBootMap||{};window.__initialUnitBootMap["${escapeHtml(route.unitId)}"]=fetch("/data/${escapeHtml(route.unitId)}.json").then(function(r){return r.ok?r.json():null;}).catch(function(){return null;});</script>
    <script type="application/ld+json">${JSON.stringify(courseSchema)}</script>`;

        const unitHtml = baseHtml
          .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(route.seoTitle)}</title>`)
          .replace(
            /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
            `<meta name="description" content="${escapeHtml(route.metaDescription)}" />`,
          )
          .replace(
            /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
            `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
          )
          .replace(
            /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
            `<meta property="og:title" content="${escapeHtml(route.seoTitle)}" />`,
          )
          .replace(
            /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
            `<meta property="og:description" content="${escapeHtml(route.metaDescription)}" />`,
          )
          .replace(
            /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
            `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`,
          )
          .replace('</head>', `${extraMetaTags}\n  </head>`)
          .replace(
            /<div class="content-container" id="main-content">[\s\S]*?<\/div>/,
            `<div class="content-container" id="main-content">${courseBodyHtml}\n        </div>`,
          );

        const outRouteDir = path.join(distDir, route.slug);
        fs.mkdirSync(outRouteDir, { recursive: true });
        fs.writeFileSync(path.join(outRouteDir, 'index.html'), unitHtml, 'utf8');
        generatedCount++;

        // 2b. Pre-render static SEO + OpenGraph page for every individual lesson in this course
        const shortCourseTitle = route.heading.split(/[:—–]/)[0].trim();
        lessons.forEach((lesson, lIdx) => {
          const lessonSlug = lessonSlugs[lIdx];
          const lessonCanonical = `${SITE_ORIGIN}/${route.slug}/${lessonSlug}/`;
          const rawLessonTitle = stripPlainText(lesson.title || `Lesson ${lIdx + 1}`);
          const cleanLessonTitle = rawLessonTitle.replace(/^(?:Enquiry|Lesson)\s*\d+:\s*/i, '').trim();
          const enquiryQ = stripPlainText(
            lesson.enquiryQuestion || lesson.enquiry_question || lesson.enquiry || lesson.subtitle || '',
          );

          const stages = Array.isArray(lesson.workbook_stages) && lesson.workbook_stages.length > 0
            ? lesson.workbook_stages
            : Array.isArray(lesson.narrative_blocks)
              ? lesson.narrative_blocks
              : [];

          const stageHeadings = stages
            .map((st, sIdx) => {
              const stTitle = stripPlainText(st.title || st.theme_heading || `Stage ${sIdx + 1}`);
              const stQ = stripPlainText(st.question || st.questionHeading || '');
              return { stTitle, stQ };
            })
            .filter((s) => s.stTitle || s.stQ);

          // Collect all workbook, past-paper & forecast questions + concise model answer summaries
          const lessonQAItems = collectLessonSeoQA(route.unitId, lesson);
          totalIndexedQuestions += lessonQAItems.length;
          const faqEntities = lessonQAItems
            .filter((item) => item.question && item.answer && item.answer.length >= 25)
            .slice(0, 10)
            .map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            }));

          const rawLessonHero =
            lesson.hero_image ||
            lesson.card_image ||
            (typeof lesson.banner === 'string' ? lesson.banner : lesson.banner?.image) ||
            rawImage;
          const lessonOgImage = rawLessonHero.startsWith('http')
            ? rawLessonHero
            : `${SITE_ORIGIN}${rawLessonHero.startsWith('/') ? '' : '/'}${rawLessonHero}`;

          const lessonSeoTitle = `${cleanLessonTitle} | ${shortCourseTitle} (${route.keyStage}) | The History Revision Hub`;
          const stageSummarySnippet = stageHeadings
            .slice(0, 3)
            .map((s) => s.stTitle)
            .filter(Boolean)
            .join(', ');
          const rawMetaDesc = enquiryQ
            ? `${enquiryQ} Free ${route.keyStage} History revision notes, primary sources, model answers & quiz${stageSummarySnippet ? `: ${stageSummarySnippet}` : ''}.`
            : `${rawLessonTitle} — Free ${route.examBoard} revision notes, primary sources, stepped model answers & retrieval quiz.`;
          const lessonMetaDesc =
            rawMetaDesc.length > 160 ? `${rawMetaDesc.slice(0, 157).trim()}...` : rawMetaDesc;

          const lessonSchemaGraph = [
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'The History Revision Hub', item: `${SITE_ORIGIN}/` },
                { '@type': 'ListItem', position: 2, name: route.heading, item: canonicalUrl },
                { '@type': 'ListItem', position: 3, name: rawLessonTitle, item: lessonCanonical },
              ],
            },
            {
              '@type': 'LearningResource',
              name: rawLessonTitle,
              description: lessonMetaDesc,
              url: lessonCanonical,
              educationalLevel: route.keyStage,
              learningResourceType: ['Lesson', 'Practice Questions', 'Model Answers', 'Primary Source Enquiry'],
              inLanguage: 'en-GB',
              isPartOf: {
                '@type': 'Course',
                name: route.heading,
                url: canonicalUrl,
              },
              provider: {
                '@type': 'EducationalOrganization',
                name: 'The History Revision Hub',
                url: `${SITE_ORIGIN}/`,
              },
            },
          ];
          if (faqEntities.length > 0) {
            lessonSchemaGraph.push({
              '@type': 'FAQPage',
              mainEntity: faqEntities,
            });
          }
          const lessonSchema = {
            '@context': 'https://schema.org',
            '@graph': lessonSchemaGraph,
          };

          const prevLessonLink =
            lIdx > 0
              ? `<a href="/${escapeHtml(route.slug)}/${escapeHtml(lessonSlugs[lIdx - 1])}/" style="margin-right: 14px;">&larr; Previous: ${escapeHtml(stripPlainText(lessons[lIdx - 1].title || 'Previous Lesson'))}</a>`
              : '';
          const nextLessonLink =
            lIdx < lessons.length - 1
              ? `<a href="/${escapeHtml(route.slug)}/${escapeHtml(lessonSlugs[lIdx + 1])}/" style="margin-right: 14px;">Next: ${escapeHtml(stripPlainText(lessons[lIdx + 1].title || 'Next Lesson'))} &rarr;</a>`
              : '';

          const lessonBodyHtml = `
          <article class="seo-lesson-prerender" style="max-width: 920px; margin: 24px auto; padding: 20px;">
            <nav aria-label="Breadcrumb" style="font-size: 0.85rem; margin-bottom: 10px;">
              <a href="/">All Courses</a> &rsaquo; <a href="/${escapeHtml(route.slug)}/">${escapeHtml(shortCourseTitle)}</a>
            </nav>
            <p style="font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.8; margin-bottom: 6px;">${escapeHtml(route.examBoard)} &bull; ${escapeHtml(route.keyStage)}</p>
            <h1 style="font-size: 1.7rem; margin-bottom: 10px;">${escapeHtml(rawLessonTitle)}</h1>
            ${enquiryQ ? `<p style="font-size: 1.05rem; font-style: italic; margin-bottom: 16px;"><strong>Key Enquiry:</strong> ${escapeHtml(enquiryQ)}</p>` : ''}
            ${
              stageHeadings.length > 0
                ? `<h2 style="font-size: 1.18rem; margin-bottom: 8px;">Key Historical Stages &amp; Chronology</h2>
            <ol style="line-height: 1.75; padding-left: 22px; margin-bottom: 20px;">
              ${stageHeadings
                .map(
                  (s) =>
                    `<li><strong>${escapeHtml(s.stTitle)}</strong>${s.stQ ? ` — ${escapeHtml(s.stQ)}` : ''}</li>`,
                )
                .join('\n              ')}
            </ol>`
                : ''
            }
            ${
              lessonQAItems.length > 0
                ? `<section aria-label="Exam and Practice Questions" style="margin-bottom: 22px;">
              <h2 style="font-size: 1.18rem; margin-bottom: 10px;">Exam &amp; Practice Questions with Model Answer Summaries</h2>
              ${lessonQAItems
                .map(
                  (item) =>
                    `<div style="margin-bottom: 12px;"><h3 style="font-size: 1rem; margin: 0 0 4px 0;">${escapeHtml(item.question)}</h3>${item.answer ? `<p style="margin: 0; line-height: 1.6; font-size: 0.93rem;">${escapeHtml(item.answer)}</p>` : ''}</div>`,
                )
                .join('\n              ')}
            </section>`
                : ''
            }
            <nav aria-label="Lesson Navigation" style="font-size: 0.88rem; line-height: 1.8; border-top: 1px solid rgba(148,163,184,0.25); padding-top: 14px;">
              ${prevLessonLink}
              ${nextLessonLink}
              <a href="/${escapeHtml(route.slug)}/" style="font-weight: 700; margin-right: 14px;">Course Overview</a>
              <a href="/schools/">For UK Schools &amp; Teachers</a>
            </nav>
          </article>`;

          const lessonExtraMeta = `    <meta property="og:image" content="${escapeHtml(lessonOgImage)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(lessonSeoTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(lessonMetaDesc)}" />
    <meta name="twitter:image" content="${escapeHtml(lessonOgImage)}" />
    <script>window.__initialUnitBootMap=window.__initialUnitBootMap||{};window.__initialUnitBootMap["${escapeHtml(route.unitId)}"]=fetch("/data/${escapeHtml(route.unitId)}.json").then(function(r){return r.ok?r.json():null;}).catch(function(){return null;});</script>
    <script type="application/ld+json">${JSON.stringify(lessonSchema)}</script>`;

          const lessonHtml = baseHtml
            .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(lessonSeoTitle)}</title>`)
            .replace(
              /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
              `<meta name="description" content="${escapeHtml(lessonMetaDesc)}" />`,
            )
            .replace(
              /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
              `<link rel="canonical" href="${escapeHtml(lessonCanonical)}" />`,
            )
            .replace(
              /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
              `<meta property="og:title" content="${escapeHtml(lessonSeoTitle)}" />`,
            )
            .replace(
              /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
              `<meta property="og:description" content="${escapeHtml(lessonMetaDesc)}" />`,
            )
            .replace(
              /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
              `<meta property="og:url" content="${escapeHtml(lessonCanonical)}" />`,
            )
            .replace('</head>', `${lessonExtraMeta}\n  </head>`)
            .replace(
              /<div class="content-container" id="main-content">[\s\S]*?<\/div>/,
              `<div class="content-container" id="main-content">${lessonBodyHtml}\n        </div>`,
            );

          const outLessonDir = path.join(outRouteDir, lessonSlug);
          fs.mkdirSync(outLessonDir, { recursive: true });
          fs.writeFileSync(path.join(outLessonDir, 'index.html'), lessonHtml, 'utf8');
          lessonSitemapUrls.push(lessonCanonical);
          generatedLessonCount++;
        });
      }

      // 3. Generate dedicated static SEO page for /schools/ (For Schools & History Departments)
      const schoolsCanonical = `${SITE_ORIGIN}/${SCHOOLS_SEO_PAGE.slug}/`;
      const schoolsSchema = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'The History Revision Hub', item: `${SITE_ORIGIN}/` },
              { '@type': 'ListItem', position: 2, name: SCHOOLS_SEO_PAGE.heading, item: schoolsCanonical },
            ],
          },
          {
            '@type': 'WebPage',
            name: SCHOOLS_SEO_PAGE.seoTitle,
            description: SCHOOLS_SEO_PAGE.metaDescription,
            url: schoolsCanonical,
            inLanguage: 'en-GB',
            about: {
              '@type': 'EducationalOrganization',
              name: 'The History Revision Hub',
              url: `${SITE_ORIGIN}/`,
              email: 'contact@historyrevisionhub.co.uk',
            },
          },
        ],
      };
      const schoolsBodyHtml = `
          <article class="seo-schools-prerender" style="max-width: 960px; margin: 24px auto; padding: 20px;">
            <h1 style="font-size: 1.8rem; margin-bottom: 12px;">${escapeHtml(SCHOOLS_SEO_PAGE.heading)}</h1>
            <p style="line-height: 1.65; margin-bottom: 16px;">${escapeHtml(SCHOOLS_SEO_PAGE.metaDescription)}</p>
            <h2 style="font-size: 1.2rem; margin-bottom: 8px;">Zero Student Logins &bull; Print-Room Saddle-Stitch Booklets &bull; Studio Audio</h2>
            <ul style="line-height: 1.75; padding-left: 22px; margin-bottom: 20px;">
              <li><strong>Zero Student Accounts or Personal Data:</strong> Share lesson, audio, and quiz links directly into Google Classroom or Microsoft Teams with zero GDPR Data Processing Agreement delays.</li>
              <li><strong>Four Classroom Publications Per Course:</strong> Master Classroom Textbooks, Double-Page Pupil Workbooks (with Teacher Mark Schemes &amp; WAGOLLs), Knowledge Retrieval Companions, and Mastery Exam Packs.</li>
              <li><strong>26 Complete Courses:</strong> Pearson Edexcel GCSE (Medicine, Early Elizabethan England, Superpower Cold War 1941–91, Conflict in the Middle East, Weimar &amp; Nazi Germany, USA 1954–75), 12 Key Stage 3 National Curriculum units, and all 8 Key Stage 2 Primary History units.</li>
            </ul>
            <p style="margin-bottom: 20px;">Department enquiries: <a href="mailto:contact@historyrevisionhub.co.uk"><strong>contact@historyrevisionhub.co.uk</strong></a></p>
            <nav aria-label="All History Courses" style="font-size: 0.88rem; line-height: 1.8; border-top: 1px solid rgba(148,163,184,0.25); padding-top: 14px;">
              <a href="/" style="font-weight: 700; margin-right: 14px;">&larr; All Courses Home</a>
              ${SEO_UNIT_ROUTES.map((r) => `<a href="/${escapeHtml(r.slug)}/" style="margin-right: 12px;">${escapeHtml(r.heading)}</a>`).join('\n              ')}
            </nav>
          </article>`;
      const schoolsHtml = baseHtml
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(SCHOOLS_SEO_PAGE.seoTitle)}</title>`)
        .replace(
          /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
          `<meta name="description" content="${escapeHtml(SCHOOLS_SEO_PAGE.metaDescription)}" />`,
        )
        .replace(
          /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
          `<link rel="canonical" href="${escapeHtml(schoolsCanonical)}" />`,
        )
        .replace(
          /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
          `<meta property="og:title" content="${escapeHtml(SCHOOLS_SEO_PAGE.seoTitle)}" />`,
        )
        .replace(
          /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
          `<meta property="og:description" content="${escapeHtml(SCHOOLS_SEO_PAGE.metaDescription)}" />`,
        )
        .replace(
          /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
          `<meta property="og:url" content="${escapeHtml(schoolsCanonical)}" />`,
        )
        .replace(
          '</head>',
          `    <script type="application/ld+json">${JSON.stringify(schoolsSchema)}</script>\n  </head>`,
        )
        .replace(
          /<div class="content-container" id="main-content">[\s\S]*?<\/div>/,
          `<div class="content-container" id="main-content">${schoolsBodyHtml}\n        </div>`,
        );
      const schoolsOutDir = path.join(distDir, SCHOOLS_SEO_PAGE.slug);
      fs.mkdirSync(schoolsOutDir, { recursive: true });
      fs.writeFileSync(path.join(schoolsOutDir, 'index.html'), schoolsHtml, 'utf8');

      // 4. Auto-generate dist/sitemap.xml directly from SEO_UNIT_ROUTES + /schools/ (Zero Drift)
      const buildDateIso = new Date().toISOString().slice(0, 10);
      const sitemapEntries = [
        `  <url>\n    <loc>${SITE_ORIGIN}/</loc>\n    <lastmod>${buildDateIso}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>`,
        `  <url>\n    <loc>${schoolsCanonical}</loc>\n    <lastmod>${buildDateIso}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${SCHOOLS_SEO_PAGE.priority}</priority>\n  </url>`,
        ...SEO_UNIT_ROUTES.map(
          (r) =>
            `  <url>\n    <loc>${SITE_ORIGIN}/${escapeHtml(r.slug)}/</loc>\n    <lastmod>${buildDateIso}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${escapeHtml(r.priority || '0.85')}</priority>\n  </url>`,
        ),
        ...lessonSitemapUrls.map(
          (u) =>
            `  <url>\n    <loc>${escapeHtml(u)}</loc>\n    <lastmod>${buildDateIso}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`,
        ),
      ].join('\n');
      const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`;
      fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');
      fs.writeFileSync(path.resolve(process.cwd(), 'public', 'sitemap.xml'), sitemapXml, 'utf8');

      console.log(
        `[seo-course-pages-generator] Generated ${generatedCount} course pages + ${generatedLessonCount} lesson pages (${totalIndexedQuestions} indexed exam/practice Q&As) + /schools/ + sitemap.xml (${SEO_UNIT_ROUTES.length + generatedLessonCount + 2} URLs) in dist/.`,
      );
    },
  };
}

function serviceWorkerVersionPlugin() {
  return {
    name: 'sw-version-stamper',
    closeBundle() {
      const distDir = path.resolve(process.cwd(), 'dist');
      const swPath = path.join(distDir, 'sw.js');
      const buildTimestamp = Date.now();
      if (fs.existsSync(swPath)) {
        let swContent = fs.readFileSync(swPath, 'utf8');
        swContent = swContent.replace(
          /const CACHE_NAME = ['"][^'"]+['"];/,
          `const CACHE_NAME = 'history-hub-cache-v20-gdpr-${buildTimestamp}';`,
        );
        swContent = swContent.replace(
          /const DYNAMIC_CACHE = ['"][^'"]+['"];/,
          `const DYNAMIC_CACHE = 'history-hub-dynamic-v20-gdpr-${buildTimestamp}';`,
        );
        fs.writeFileSync(swPath, swContent, 'utf8');
        console.log(
          `[sw-version-stamper] Stamped dist/sw.js with build timestamp: ${buildTimestamp}`,
        );
      }
      // Stamp ?v=<buildTimestamp> onto /data/database_index.json in dist/index.html so Cloudflare/browser HTTP cache never serves a stale course index
      const distIndexPath = path.join(distDir, 'index.html');
      if (fs.existsSync(distIndexPath)) {
        const html = fs
          .readFileSync(distIndexPath, 'utf8')
          .replace(/\/data\/database_index\.json/g, `/data/database_index.json?v=${buildTimestamp}`);
        fs.writeFileSync(distIndexPath, html, 'utf8');
      }
    },
  };
}

function localChessSyncPlugin() {
  let inMemoryState = null;
  return {
    name: 'local-chess-sync-middleware',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/.netlify/functions/chess_sync')) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-teacher-passkey');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Content-Type', 'application/json');
          res.setHeader(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          );
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
          res.setHeader('Surrogate-Control', 'no-store');
          res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');

          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            return res.end();
          }

          if (req.method === 'GET') {
            res.statusCode = 200;
            if (inMemoryState && Array.isArray(inMemoryState.players)) {
              inMemoryState.players.forEach((p) => delete p.year);
            }
            return res.end(JSON.stringify(inMemoryState || null));
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                const data = JSON.parse(body);
                if (Array.isArray(data.players)) {
                  data.players.forEach((p) => delete p.year);
                }
                inMemoryState = { ...data, syncedAt: Date.now() };
                res.statusCode = 200;
                return res.end(JSON.stringify({ success: true, syncedAt: inMemoryState.syncedAt }));
              } catch (e) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: e.message }));
              }
            });
            return;
          }
        }
        next();
      });
    },
  };
}

function directPdfServePlugin() {
  return {
    name: 'direct-pdf-serve-middleware',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/pdfs/')) {
          const cleanUrl = req.url.split('?')[0].split('#')[0];
          const decodedUrl = decodeURIComponent(cleanUrl);
          const diskPath = path.resolve(process.cwd(), 'public', decodedUrl.replace(/^\//, ''));
          if (fs.existsSync(diskPath) && fs.statSync(diskPath).isFile()) {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Length', fs.statSync(diskPath).size);
            res.setHeader('Cache-Control', 'no-cache');
            return fs.createReadStream(diskPath).pipe(res);
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  root: '.',
  plugins: [
    serviceWorkerVersionPlugin(),
    seoCoursePagesPlugin(),
    localChessSyncPlugin(),
    directPdfServePlugin(),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rolldownOptions: {
      input: {
        main: 'index.html',
      },
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'vendor',
              test: /node_modules/,
              priority: 100,
            },
            {
              name: 'shared-runtime',
              test: /(?:src[\\/]data[\\/](?:unit_resources_catalog|seo_routes|iconic_lesson_visuals)|src[\\/]engine[\\/](?:workbook_page_map|speech|video_utils|store|assets|share_utils)|src[\\/]data_parser)\.js/,
              priority: 95,
            },
            {
              name: 'infographic-viewer',
              test: /(?:src[\\/]infographic_viewer\.js|infographics_manifest\.json)/,
              priority: 90,
            },
            {
              name: 'exam-bank-p1p2',
              test: /src[\\/]engine[\\/]mock_exam_bank_p1_p2\.js/,
              priority: 85,
            },
            {
              name: 'exam-bank-p3',
              test: /src[\\/]engine[\\/](mock_exam_bank_p3|mock_exam_bank_cold_war|mock_exam_bank_data)\.js/,
              priority: 80,
            },
            {
              name: 'exam-scaffolding',
              test: /src[\\/]engine[\\/](lesson_exam_practice_panel|gcse_donow_engine|ks2_guidance)\.js/,
              priority: 75,
            },
            {
              name: 'arena-corners',
              test: /src[\\/]engine[\\/]arena_corners/,
              priority: 70,
            },
            {
              name: 'arena-standoffs',
              test: /src[\\/]engine[\\/](arena_standoffs|workbook_timeline_data)/,
              priority: 65,
            },
            {
              name: 'cme-courtyard-data',
              test: /src[\\/]arcade[\\/]games[\\/]cme_courtyard[\\/](episodes_kt|adventure_immersion_data|directors_cut_data|courtyard_gis_paths)/,
              priority: 60,
            },
            {
              name: 'cme-courtyard-engine',
              test: /src[\\/]arcade[\\/]games[\\/]cme_courtyard/,
              priority: 55,
            },
            {
              name: 'classroom-reader-tools',
              test: /src[\\/](digital_textbook_reader|engine[\\/](classroom_spotlight_and_locator|teacher_guidance_modal)|interactive_labs[\\/]lab_registry)\.js/,
              priority: 45,
            },
            {
              name: 'lesson-helpers',
              test: /src[\\/](engine[\\/](lesson_renderer_helpers|lesson_consolidate_station|disciplinary_glossary|narrative_annotator)|key_individuals)\.js/,
              priority: 40,
            },
            {
              name: 'lesson-core',
              test: /src[\\/]engine[\\/]lesson_renderer\.js/,
              priority: 30,
            },
            {
              name: 'ui-modals-tools',
              test: /src[\\/](engine[\\/](modals|share_utils)|keyword_search|diagnostic_benchmark|cme_theater_map)\.js/,
              priority: 20,
            },
          ],
        },
      },
    },
  },
  server: {
    port: 3003,
    host: true,
    open: true,
    watch: {
      ignored: ['**/public/assets/infographics/**', '**/public/pdfs/**', '**/dist/**', '**/dist2/**', '**/scratch/**', '**/temp_backups/**'],
    },
  },
});
