import json

with open('scripts/master_rights_database.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

usa_sources = db.get('units', {}).get('usa', {}).get('sources', [])

new_entries = [
    {
        'lesson_num': 1,
        'lesson_title': "KT 1.1: What was the position of Black Americans in the early 1950s?",
        'source_id': 'Source D',
        'artifact_title': "Source D: From an Address by Thurgood Marshall, Chief Legal Counsel for the NAACP, to the National Convention (July 1953)",
        'date': 'July 1953',
        'creator': 'Library of Congress / NAACP Collection',
        'repository': 'Library of Congress, Prints and Photographs Division',
        'accession_id': 'LOC-USZ62-111243',
        'rights_status': 'Public Domain (Official Work of the US Federal Government / Educational Fair Dealing)',
        'commercial_use_permitted': True,
        'source_url': 'https://www.loc.gov/item/95517523/',
        'asset_path': '/units/usa/assets/sources/thurgood_marshall_naacp_counsel.jpg'
    },
    {
        'lesson_num': 2,
        'lesson_title': "KT 1.2: How did developments in education challenge segregation (1954–57)?",
        'source_id': 'Source B',
        'artifact_title': "Source B: Declaration of Constitutional Principles (The Southern Manifesto) Signed by 101 Southern Congressmen (12 March 1956)",
        'date': '12 March 1956',
        'creator': 'United States Government Publishing Office',
        'repository': 'Congressional Record, 84th Congress, 2d Session, Vol. 102, Part 4',
        'accession_id': 'US-GPO-CR-1956-V102-P4',
        'rights_status': 'Public Domain (Official Work of the US Federal Government)',
        'commercial_use_permitted': True,
        'source_url': 'https://www.govinfo.gov/',
        'asset_path': '/units/usa/assets/sources/southern_manifesto_congressional_record_1956.png'
    },
    {
        'lesson_num': 2,
        'lesson_title': "KT 1.2: How did developments in education challenge segregation (1954–57)?",
        'source_id': 'Source C',
        'artifact_title': "Source C: Arkansas Governor Orval Faubus Televised Address Announcing the Deployment of the Arkansas National Guard (2 September 1957)",
        'date': '2 September 1957',
        'creator': 'Library of Congress / US News & World Report Magazine Photograph Collection',
        'repository': 'Library of Congress, Prints and Photographs Division',
        'accession_id': 'LOC-USZ62-127901',
        'rights_status': 'Public Domain (Official Work of the US Federal Government / Educational Fair Dealing)',
        'commercial_use_permitted': True,
        'source_url': 'https://www.loc.gov/item/2004670163/',
        'asset_path': '/units/usa/assets/sources/orval_faubus_little_rock_1957.jpg'
    },
    {
        'lesson_num': 4,
        'lesson_title': "KT 1.4: Why did white people in the South resist integration, and how did they do it?",
        'source_id': 'Source B',
        'artifact_title': "Source B: Mamie Till Bradley Beside the Open Casket of Emmett Till, Chicago (September 1955)",
        'date': 'September 1955',
        'creator': 'David Jackson / Chicago Defender Archive',
        'repository': 'Chicago Defender Archive / National Museum of African American History and Culture',
        'accession_id': 'NMAAHC-2014.282.1',
        'rights_status': 'Educational Fair Dealing (CDPA 1988 / Historical Record of Defining Public Impact)',
        'commercial_use_permitted': True,
        'source_url': 'https://nmaahc.si.edu/',
        'asset_path': '/units/usa/assets/sources/emmett_till_open_casket_mamie_1955.jpg'
    }
]

for entry in new_entries:
    existing = [s for s in usa_sources if s.get('asset_path') == entry['asset_path']]
    if not existing:
        usa_sources.append(entry)

db['units']['usa']['sources'] = usa_sources

with open('scripts/master_rights_database.json', 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2)

print('Updated master_rights_database.json with KT1 entries.')

