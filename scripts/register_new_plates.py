import json

with open('scripts/master_rights_database.json', encoding='utf-8') as f:
    db = json.load(f)

usa_sources = db['units']['usa']['sources']
existing_assets = {s.get('asset_path') for s in usa_sources}

new_entries = [
    {
        "lesson_num": 5,
        "lesson_title": "KT 2.1: How did peaceful protests (like sit-ins and Freedom Rides) force the government to act?",
        "source_id": "Source E",
        "artifact_title": "Interstate Commerce Commission Order Docket No. MC-C-3358 Outlawing Terminal Segregation",
        "date": "22 September 1961",
        "creator": "Interstate Commerce Commission",
        "repository": "National Archives and Records Administration (NARA)",
        "accession_id": "USA-L5-E-ICC-3358",
        "rights_status": "Public Domain (Official Work of the US Federal Government)",
        "commercial_use_permitted": True,
        "source_url": "https://www.archives.gov",
        "asset_path": "/units/usa/assets/sources/icc_order_mc_c_3358_1961.png"
    },
    {
        "lesson_num": 9,
        "lesson_title": "KT 3.1: Why did the US support the unpopular government of Ngo Dinh Diem in South Vietnam?",
        "source_id": "Source D",
        "artifact_title": "State Department Telegram No. 243 (Cable 243) on Saigon Coup Deliberations",
        "date": "24 August 1963",
        "creator": "Department of State / George Ball & Dean Rusk",
        "repository": "National Archives and Records Administration (NARA) / JFK Presidential Library",
        "accession_id": "USA-L9-D-CABLE-243",
        "rights_status": "Public Domain (US Government Declassified)",
        "commercial_use_permitted": True,
        "source_url": "https://www.jfklibrary.org",
        "asset_path": "/units/usa/assets/sources/state_dept_cable_243_1963.png"
    },
    {
        "lesson_num": 9,
        "lesson_title": "KT 3.1: Why did the US support the unpopular government of Ngo Dinh Diem in South Vietnam?",
        "source_id": "Source E",
        "artifact_title": "CIA Special National Intelligence Estimate (SNIE 53-2-63): Prospects for South Vietnam",
        "date": "22 October 1963",
        "creator": "Central Intelligence Agency (CIA)",
        "repository": "CIA CREST Database / National Archives",
        "accession_id": "USA-L9-E-SNIE-53-63",
        "rights_status": "Public Domain (US Government Declassified)",
        "commercial_use_permitted": True,
        "source_url": "https://www.cia.gov/readingroom",
        "asset_path": "/units/usa/assets/sources/cia_snie_53_63_south_vietnam.png"
    },
    {
        "lesson_num": 10,
        "lesson_title": "KT 3.2: Why did the US send combat troops to Vietnam after the Gulf of Tonkin incident?",
        "source_id": "Source C",
        "artifact_title": "Gulf of Tonkin Resolution (Public Law 88-408)",
        "date": "7 August 1964",
        "creator": "88th United States Congress",
        "repository": "National Archives and Records Administration (NARA)",
        "accession_id": "USA-L10-C-GULF-TONKIN",
        "rights_status": "Public Domain (Official Work of the US Federal Government)",
        "commercial_use_permitted": True,
        "source_url": "https://www.archives.gov/milestone-documents/gulf-of-tonkin-resolution",
        "asset_path": "/units/usa/assets/sources/gulf_of_tonkin_resolution_statute_1964.png"
    }
]

added = 0
for entry in new_entries:
    if entry['asset_path'] not in existing_assets:
        usa_sources.append(entry)
        added += 1

db['units']['usa']['total_sources'] = len(usa_sources)
print(f"Added {added} new entries. Total USA sources: {len(usa_sources)}")

with open('scripts/master_rights_database.json', 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2, ensure_ascii=False)
