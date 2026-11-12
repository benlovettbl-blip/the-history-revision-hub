---
name: Production Release Gate
description: Pre-deployment security, bundle weight, static asset hygiene, provenance register, and classroom-freeze checklist before pushing to production (Netlify / origin main).
---

# Production Release & Deployment Hygiene Gate

## Trigger
Activate this skill before executing production deployments, large multi-unit merges, static asset cleanups, Vite/Service Worker modifications, or Netlify configuration updates.

---

## 1. Security, Secrets & GDPR Gate (P0)
1. **Zero Plaintext Passkeys or Credentials:**
   - Verify `0` plaintext passkeys exist across `src/`, `netlify/functions/`, `public/`, or HTML attributes (`placeholder`, `title`).
   - All staff/teacher checks must route through `src/engine/staff_auth.js` (salted SHA-256 digests) and `process.env.CHESS_TEACHER_PASSKEY` in `netlify/functions/chess_sync.js`.
   - Ensure only ONE function file per endpoint exists in `netlify/functions/` (never both `.js` and `.mjs`).
2. **Strict Institutional Neutrality (`0` Leaks):**
   - Run `node scripts/verify_sanitization.cjs` and confirm `0` prohibited school or personal identifiers across the repository.
3. **GDPR Student Data Protection:**
   - Never persist pupil surnames, academic years (`p.year`), or identifiable cohort records in Netlify Blobs, `localStorage`, or static JSON files.

---

## 2. Bundle Weight, Service Worker & Edge Caching Gate (P0/P1)
1. **Service Worker Install Budget (`public/sw.js`):**
   - `CORE_ASSETS` precached on SW `install` MUST remain lightweight (`< 5 MB` total). Never precache monolithic `/database.json` (`26+ MB`) on install; cache unit JSONs dynamically on-demand.
2. **Vite Chunk Splitting (`vite.config.js`):**
   - Run `npm run build` and inspect `dist/assets/*.js`. Heavy feature zones (Blurt Past Papers, Mock Exam Bank, Chess Hub, Masterpiece Studio) should lazy-load on route activation rather than bloating the initial entry chunk.
3. **Static Directory Hygiene (`public/`):**
   - Keep dev mockups, screenshot comparison dumps, and multi-megabyte uncompressed duplicate plates (`> 5 MB`) out of `public/`.
   - Run `node scripts/verify_images.cjs` and `node scripts/verify_asset_paths.cjs` to guarantee zero 403 HTML-masquerading `.jpg` files and zero broken paths.
4. **Master Provenance & Copyright Register:**
   - Every visual source added or changed must be registered in `scripts/master_rights_database.json` and recompiled via `node scripts/generate_rights_register_pdf.cjs`.

---

## 3. Classroom Reprographics "Zero Disruption" Freeze Check
Before overwriting any `pupil_workbook.html` or `public/pdfs/*.pdf` on `main`:
1. Check `WORKBOOK_STATUS_AND_ROLLOUT_TRACKER.md` and `VACATION_REPRINT_SPECIFICATION.md` to ensure you are not breaking page/question numbers for booklets physically printed and on pupils' desks mid-term.
2. Verify all PDF link resolvers in `src/workbooks_zone.js`, `src/engine/modals.js`, and `src/verified_pdf_manifest.js` resolve cleanly (`npm run audit:links`).

---

## 4. Turnkey Pre-Push Verification Sequence
```bash
node scripts/verify_sanitization.cjs
node scripts/verify_images.cjs
npm run audit:stages
npm run audit:links
npm run build
```

