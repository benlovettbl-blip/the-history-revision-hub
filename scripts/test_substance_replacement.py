import os
import shutil

src_path = 'units/usa/data.js'
with open(src_path, 'r', encoding='utf-8') as f:
    content = f.read()

print('Initial content length:', len(content))
assert len(content) > 1000000, "Content must be > 1MB"

# Make a guaranteed safe backup
shutil.copyfile(src_path, 'units/usa/data.js.safe_bak')

# 1. Lesson 12 - Source A
old_l12_a_img = '/units/usa/assets/sources/hamburger-hill-101st-airborne-1969.jpg'
new_l12_a_img = '/units/usa/assets/sources/walter_cronkite_vietnam_hue_1968.jpg'
content = content.replace(old_l12_a_img, new_l12_a_img)

# 2. Lesson 12 - Source E (Replace kissinger portrait with authentic 1972 White House photo)
old_l12_e_img = '/units/usa/assets/sources/portraits/kissinger.jpg'
new_l12_e_img = '/units/usa/assets/sources/nixon_kissinger_oval_office_1972.jpg'
# Only in lesson 12 (usa_lesson_3_4)
content = content.replace(
    '"id": "usa_lesson_3_4_e",\n              "letter": "E",\n              "type": "declassified_transcript",\n              "title": "Source E: Declassified Oval Office Tape Recording: President Nixon and National Security Advisor Henry Kissinger (3 August 1972)",\n              "date": "3 August 1972",\n              "image": "/units/usa/assets/sources/portraits/kissinger.jpg",\n              "image_url": "/units/usa/assets/sources/portraits/kissinger.jpg",\n              "attribution": "Nixon Presidential Materials Project, White House Tapes, National Archives, College Park",',
    '"id": "usa_lesson_3_4_e",\n              "letter": "E",\n              "type": "declassified_transcript",\n              "title": "Source E: Declassified Oval Office Tape Recording: President Nixon and National Security Advisor Henry Kissinger (3 August 1972)",\n              "date": "3 August 1972",\n              "image": "/units/usa/assets/sources/nixon_kissinger_oval_office_1972.jpg",\n              "image_url": "/units/usa/assets/sources/nixon_kissinger_oval_office_1972.jpg",\n              "caption": "President Richard Nixon seated on the Oval Office desk conferring in private with National Security Advisor Dr. Henry Kissinger during strategic deliberations over Vietnam exit terms (White House Photo Office, 1972).",\n              "text": "Dr. Henry Kissinger: \\"We require a decent interval. If a year or two years from now South Vietnam goes down the drain, it will look like a hell of an achievement to have got out, and it will be blamed on the South Vietnamese and on Congress.\\"\\\\n\\\\nPresident Richard Nixon: \\"If we can get them out by November... then we\'ve got to find a formula that holds the thing together until after the election. Then, if South Vietnam collapses in two years, that\'s their problem. We will have done our best.\\"",\n              "attribution": "Nixon Presidential Materials Project, White House Tapes, National Archives, College Park",'
)

print('Post-L12 length:', len(content))

with open(src_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Wrote back successfully! Size:', os.path.getsize(src_path))

