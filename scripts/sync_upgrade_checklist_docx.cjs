/**
 * sync_upgrade_checklist_docx.cjs
 *
 * Compiles scripts/platform_upgrade_checklist_state.json into:
 * 1. C:\Users\fives\Desktop\History_Hub_Master_Upgrade_Checklist_2026.docx (Living Word doc with real strikethrough)
 * 2. public/docs/History_Hub_Master_Upgrade_Checklist_2026.docx (Tracked repo Word doc)
 * 3. PLATFORM_UPGRADE_MASTER_CHECKLIST.md (Instant AI-readable Markdown mirror with ~~strikethrough~~)
 *
 * Usage:
 *   node scripts/sync_upgrade_checklist_docx.cjs
 *   node scripts/sync_upgrade_checklist_docx.cjs --complete 1.2
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
} = require('docx');

const ROOT = path.resolve(__dirname, '..');
const STATE_PATH = path.join(__dirname, 'platform_upgrade_checklist_state.json');
const MD_OUT_PATH = path.join(ROOT, 'PLATFORM_UPGRADE_MASTER_CHECKLIST.md');
const REPO_DOCX_PATH = path.join(ROOT, 'public', 'docs', 'History_Hub_Master_Upgrade_Checklist_2026.docx');
const DESKTOP_DOCX_PATH = path.join(os.homedir(), 'Desktop', 'History_Hub_Master_Upgrade_Checklist_2026.docx');

// Optional CLI helper: --complete <taskId>
const args = process.argv.slice(2);
const completeIdx = args.indexOf('--complete');
const state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));

if (completeIdx !== -1 && args[completeIdx + 1]) {
  const targetId = args[completeIdx + 1].trim();
  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  let found = false;
  for (const phase of state.phases) {
    for (const t of phase.tasks) {
      if (t.id === targetId) {
        t.done = true;
        t.completedAt = today;
        found = true;
      }
    }
  }
  if (!found) {
    console.error(`❌ Task ID "${targetId}" not found in ${STATE_PATH}`);
    process.exit(1);
  }
  state.lastUpdated = today;
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n', 'utf8');
  console.log(`✅ Marked task [${targetId}] as DONE (${today}).`);
}

function buildMarkdown(data) {
  const allTasks = data.phases.flatMap((p) => p.tasks);
  const doneCount = allTasks.filter((t) => t.done).length;
  const lines = [
    `# ${data.title}`,
    `> **${data.subtitle}**  `,
    `> **Progress:** \`${doneCount} / ${allTasks.length}\` Tasks Completed • **Last Updated:** ${data.lastUpdated}`,
    '',
    '## Cost-Smart AI Model Allocation Guide (Protecting Claude Credits)',
    '| AI Model | Cost Tier | When to Select It |',
    '| :--- | :--- | :--- |',
    ...data.modelBudgetGuide.map((m) => `| **${m.model}** | ${m.tier} | ${m.bestFor} |`),
    '',
    '---',
    '',
  ];

  for (const phase of data.phases) {
    const pDone = phase.tasks.filter((t) => t.done).length;
    const allPhaseDone = pDone === phase.tasks.length;
    lines.push(`## ${allPhaseDone ? `~~${phase.title}~~ ✅` : phase.title} (\`${pDone}/${phase.tasks.length}\`)`);
    lines.push(`*Goal: ${phase.goal}*`);
    lines.push('');
    for (const t of phase.tasks) {
      if (t.done) {
        lines.push(
          `- [x] ~~**[${t.id}] ${t.title}**~~ ✅ *(Completed ${t.completedAt || 'Done'} • Model: ${t.model})*  `,
        );
        lines.push(`  ~~${t.detail}~~`);
      } else {
        lines.push(
          `- [ ] **[${t.id}] ${t.title}** — **Use AI: \`${t.model}\`** (${t.costTier})  `,
        );
        lines.push(`  ${t.detail}`);
      }
      lines.push('');
    }
  }

  return lines.join('\n') + '\n';
}

async function buildDocx(data) {
  const allTasks = data.phases.flatMap((p) => p.tasks);
  const doneCount = allTasks.filter((t) => t.done).length;

  const thinBorder = { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' };
  const cellBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };

  const children = [
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: 'THE HISTORY REVISION HUB • MASTER UPGRADE TRACKER',
          bold: true,
          size: 18,
          color: 'B45309',
          font: 'Calibri',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: data.title,
          bold: true,
          size: 34,
          color: '0F172A',
          font: 'Calibri',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 220 },
      children: [
        new TextRun({
          text: `${data.subtitle}   |   Completed: ${doneCount} of ${allTasks.length} tasks   |   Updated: ${data.lastUpdated}`,
          italics: true,
          size: 20,
          color: '475569',
          font: 'Calibri',
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 120, after: 100 },
      children: [
        new TextRun({
          text: 'Cost-Smart AI Model Selection Guide (Protecting Your Claude Budget)',
          bold: true,
          size: 25,
          color: '0F172A',
          font: 'Calibri',
        }),
      ],
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: ['Recommended AI Model', 'Cost Tier', 'When to Select This Model'].map(
            (hdr, idx) =>
              new TableCell({
                borders: cellBorders,
                width: { size: idx === 0 ? 26 : idx === 1 ? 24 : 50, type: WidthType.PERCENTAGE },
                shading: { fill: '0F172A', type: ShadingType.CLEAR, color: 'auto' },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: hdr, bold: true, color: 'FFFFFF', size: 19, font: 'Calibri' }),
                    ],
                  }),
                ],
              }),
          ),
        }),
        ...data.modelBudgetGuide.map(
          (row, rIdx) =>
            new TableRow({
              children: [
                new TableCell({
                  borders: cellBorders,
                  shading: { fill: rIdx % 2 === 0 ? 'F8FAFC' : 'FFFFFF', type: ShadingType.CLEAR, color: 'auto' },
                  margins: { top: 80, bottom: 80, left: 120, right: 120 },
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: row.model, bold: true, color: '0F172A', size: 19, font: 'Calibri' }),
                      ],
                    }),
                  ],
                }),
                new TableCell({
                  borders: cellBorders,
                  shading: { fill: rIdx % 2 === 0 ? 'F8FAFC' : 'FFFFFF', type: ShadingType.CLEAR, color: 'auto' },
                  margins: { top: 80, bottom: 80, left: 120, right: 120 },
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: row.tier, bold: true, color: '334155', size: 19, font: 'Calibri' }),
                      ],
                    }),
                  ],
                }),
                new TableCell({
                  borders: cellBorders,
                  shading: { fill: rIdx % 2 === 0 ? 'F8FAFC' : 'FFFFFF', type: ShadingType.CLEAR, color: 'auto' },
                  margins: { top: 80, bottom: 80, left: 120, right: 120 },
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: row.bestFor, color: '334155', size: 19, font: 'Calibri' }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
        ),
      ],
    }),
  ];

  for (const phase of data.phases) {
    const pDone = phase.tasks.filter((t) => t.done).length;
    const allPhaseDone = pDone === phase.tasks.length;

    children.push(
      new Paragraph({
        spacing: { before: 280, after: 60 },
        shading: { fill: 'F1F5F9', type: ShadingType.CLEAR, color: 'auto' },
        children: [
          new TextRun({
            text: `  ${phase.title}  `,
            bold: true,
            strike: allPhaseDone,
            size: 24,
            color: allPhaseDone ? '15803D' : '0F172A',
            font: 'Calibri',
          }),
          new TextRun({
            text: `(${pDone}/${phase.tasks.length} Done)`,
            bold: true,
            size: 20,
            color: allPhaseDone ? '15803D' : 'B45309',
            font: 'Calibri',
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: phase.goal,
            italics: true,
            size: 19,
            color: '475569',
            font: 'Calibri',
          }),
        ],
      }),
    );

    for (const t of phase.tasks) {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          indent: { left: 200 },
          children: [
            new TextRun({
              text: t.done ? '✓ DONE  ' : '☐ TODO  ',
              bold: true,
              size: 21,
              color: t.done ? '15803D' : 'B45309',
              font: 'Calibri',
            }),
            new TextRun({
              text: `[${t.id}] ${t.title}`,
              bold: true,
              strike: t.done,
              size: 21,
              color: t.done ? '64748B' : '0F172A',
              font: 'Calibri',
            }),
            new TextRun({
              text: t.done
                ? `   (Completed ${t.completedAt || ''} • ${t.model})`
                : `   [Select AI: ${t.model} • ${t.costTier}]`,
              bold: !t.done,
              italics: t.done,
              size: 19,
              color: t.done ? '15803D' : '1D4ED8',
              font: 'Calibri',
            }),
          ],
        }),
        new Paragraph({
          spacing: { after: 110 },
          indent: { left: 480 },
          children: [
            new TextRun({
              text: t.detail,
              strike: t.done,
              size: 19,
              color: t.done ? '94A3B8' : '334155',
              font: 'Calibri',
            }),
          ],
        }),
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 900, right: 900, bottom: 900, left: 900 },
          },
        },
        children,
      },
    ],
  });

  const buf = await Packer.toBuffer(doc);
  fs.mkdirSync(path.dirname(REPO_DOCX_PATH), { recursive: true });
  fs.writeFileSync(REPO_DOCX_PATH, buf);
  try {
    fs.writeFileSync(DESKTOP_DOCX_PATH, buf);
  } catch (err) {
    console.warn(`⚠️ Could not overwrite Desktop Word doc (may be open in Microsoft Word): ${err.message}`);
  }
  fs.writeFileSync(MD_OUT_PATH, buildMarkdown(data), 'utf8');

  console.log(`📄 Synced Word Checklist & Strikethroughs (${doneCount}/${allTasks.length} completed):`);
  console.log(`   • Desktop Word Doc: ${DESKTOP_DOCX_PATH}`);
  console.log(`   • Repo Word Doc:    ${REPO_DOCX_PATH}`);
  console.log(`   • AI Markdown Sync: ${MD_OUT_PATH}`);
}

buildDocx(state).catch((err) => {
  console.error(err);
  process.exit(1);
});
