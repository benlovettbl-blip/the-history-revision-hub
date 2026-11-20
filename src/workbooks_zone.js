import { state } from './state.js';
import { resolveCanonicalPdfUrl } from './data/unit_resources_catalog.js';

/**
 * Compatibility Adapter — Booklets & Printables
 *
 * All printable booklets now live in ONE single home (`src/data/unit_resources_catalog.js`
 * + the Unit Sticky Bar's `PDFs & Booklets` drawer and `openTeacherPrintPreview` modal).
 */

if (typeof window !== 'undefined') {
  window.openInPagePreview = function (url, title, pdfUrl) {
    const resolvedPdf = resolveCanonicalPdfUrl(url, pdfUrl);
    if (typeof window.openTeacherPrintPreview === 'function') {
      window.openTeacherPrintPreview(url, title, resolvedPdf);
    } else if (url) {
      window.open(url, '_blank');
    }
  };
}

export function renderWorkbooksZone(container, unitData) {
  const activeUnitId =
    unitData?.id || state.selectedUnitId || window.currentUnitId || 'edexcel_medicine';
  if (typeof window !== 'undefined' && typeof window.openUnitResourceDrawer === 'function') {
    window.openUnitResourceDrawer(activeUnitId, 'booklets');
  } else if (typeof window !== 'undefined' && typeof window.switchView === 'function') {
    window.switchView('lessons', activeUnitId);
  }
}
