const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'master_rights_database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// 1. Add henry_kissinger to cme_new
if (db.units.cme_new && !JSON.stringify(db.units.cme_new.sources).includes('henry_kissinger.jpg')) {
  db.units.cme_new.sources.push({
    lesson_num: 11,
    lesson_title: "KT 3.1: Diplomatic Negotiations: From Shuttle Diplomacy to Camp David, 1974–1979",
    source_id: "Source A",
    artifact_title: "US Secretary of State Henry Kissinger (January 1974)",
    date: "January 1974",
    creator: "US Department of State / Gerald R. Ford Presidential Library",
    repository: "National Archives and Records Administration (NARA)",
    accession_id: "NARA RG 59 / Ford Library NLGRF-WHPO-A2633-14",
    rights_status: "Public Domain (US Federal Government Work — 17 U.S.C. § 105)",
    commercial_use_permitted: true,
    source_url: "https://www.fordlibrarymuseum.gov/",
    asset_path: "/units/cme_new/assets/henry_kissinger.jpg",
    caption: "Dr Henry Kissinger, US Secretary of State who pioneered 'Shuttle Diplomacy' between Cairo, Damascus, and Jerusalem following the 1973 Yom Kippur War.",
    hinge_question: "Why did Kissinger insist on an incremental, 'step-by-step' approach rather than attempting a comprehensive peace conference at Geneva?"
  });
  console.log('Added henry_kissinger.jpg to cme_new');
}

// 2. Add pre_nightingale_middlesex_hospital to edexcel_medicine
if (db.units.edexcel_medicine && !JSON.stringify(db.units.edexcel_medicine.sources).includes('pre_nightingale_middlesex_hospital.jpg')) {
  db.units.edexcel_medicine.sources.push({
    lesson_num: 13,
    lesson_title: "KT3.3: Improvements in Hospital Care: Florence Nightingale, Mary Seacole & The Sanitary Revolution (1854–1863)",
    source_id: "Block 1 Narrative Plate",
    artifact_title: "Middlesex Hospital Ward (1808)",
    date: "1808",
    creator: "Thomas Rowlandson and Augustus Pugin",
    repository: "Wellcome Collection, London / British Museum",
    accession_id: "Wellcome Library No. 38995i",
    rights_status: "Public Domain (Life of the Author + 70 Years — CDPA 1988)",
    commercial_use_permitted: true,
    source_url: "https://wellcomecollection.org/works/y96jvxk7",
    asset_path: "/images/pre_nightingale_middlesex_hospital.jpg",
    caption: "Middlesex Hospital Ward by Thomas Rowlandson and Augustus Pugin (1808), showing cramped beds, poor cross-ventilation, and unhygienic conditions in pre-modern voluntary hospitals.",
    hinge_question: "Why did middle-class patients in the early nineteenth century refuse to be treated in hospitals, preferring to be operated on at home?"
  });
  console.log('Added pre_nightingale_middlesex_hospital.jpg to edexcel_medicine');
}

// Recalculate totals
let totalSources = 0;
for (const unitKey of Object.keys(db.units)) {
  if (db.units[unitKey].sources) {
    totalSources += db.units[unitKey].sources.length;
  }
}
db.total_registered_sources = totalSources;
db.total_sources = totalSources;
db.last_audit = new Date().toISOString().split('T')[0];

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log(`Successfully updated master_rights_database.json (Total sources: ${totalSources})`);

