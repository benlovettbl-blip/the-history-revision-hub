const fs = require('fs');
const path = require('path');

const newBlocks = [
  {
    act: 1,
    title: "Mendel, Heredity & The Chromosomal Mystery (c1900–1940s)",
    theme_heading: "Mendel, Heredity & The Chromosomal Mystery (c1900–1940s)",
    theme: "Mendel, Heredity & The Chromosomal Mystery (c1900–1940s)",
    text: `<span class="para-ref">[1.1]</span> In the early twentieth century, Louis Pasteur and Robert Koch’s Germ Theory explained how external bacteria caused infectious diseases like cholera and tuberculosis. However, doctors faced a profound medical mystery: why did illnesses such as cystic fibrosis, sickle cell anaemia, and haemophilia run in families across generations without any microbial infection? In 1900, European scientists rediscovered the forgotten 1866 experiments of Gregor Mendel, which proved that physical characteristics were passed down from parents to offspring in mathematical patterns through invisible units called "genes."<br><br><span class="para-ref">[1.2]</span> Although doctors now knew that inherited traits existed, the physical nature of the gene remained an unsolved puzzle. Microscopes revealed thread-like structures called chromosomes inside cell nuclei, but scientists could not see how they worked. Most biochemists believed that complex proteins stored hereditary information, leaving the true role of DNA overlooked. Without understanding how genes were structured, doctors could neither explain how genetic information was copied nor understand why genetic mistakes caused incurable hereditary diseases.`,
    content: `<span class="para-ref">[1.1]</span> In the early twentieth century, Louis Pasteur and Robert Koch’s Germ Theory explained how external bacteria caused infectious diseases like cholera and tuberculosis. However, doctors faced a profound medical mystery: why did illnesses such as cystic fibrosis, sickle cell anaemia, and haemophilia run in families across generations without any microbial infection? In 1900, European scientists rediscovered the forgotten 1866 experiments of Gregor Mendel, which proved that physical characteristics were passed down from parents to offspring in mathematical patterns through invisible units called "genes."<br><br><span class="para-ref">[1.2]</span> Although doctors now knew that inherited traits existed, the physical nature of the gene remained an unsolved puzzle. Microscopes revealed thread-like structures called chromosomes inside cell nuclei, but scientists could not see how they worked. Most biochemists believed that complex proteins stored hereditary information, leaving the true role of DNA overlooked. Without understanding how genes were structured, doctors could neither explain how genetic information was copied nor understand why genetic mistakes caused incurable hereditary diseases.`
  },
  {
    act: 2,
    title: "Rosalind Franklin & Photograph 51 (1951–1952)",
    theme_heading: "Rosalind Franklin & Photograph 51 (1951–1952)",
    theme: "Rosalind Franklin & Photograph 51 (1951–1952)",
    text: `<span class="para-ref">[2.1]</span> In January 1951, physical chemist Rosalind Franklin joined King’s College London as an expert in X-ray crystallography—a demanding technique using high-powered X-rays to take shadow diffraction photographs of microscopic molecules. Working alongside PhD student Raymond Gosling in a basement laboratory, Franklin perfected a camera setup, exposing delicate DNA fibres to 62 continuous hours of X-ray beams. In May 1952, she captured "Photograph 51" (<span class="archival-meta-tag">Source A</span>), a razor-sharp image showing a dark X-shaped pattern that proved DNA formed a double-stranded helical spiral.<br><br><span class="para-ref">[2.2]</span> Severe personal and professional tension divided the King’s biophysics unit. Maurice Wilkins, a senior physicist who mistakenly regarded Franklin as his assistant rather than an independent researcher, clashed with her rigorous standards. In January 1953, without Franklin’s knowledge or permission, Wilkins showed Photograph 51 to James Watson, an ambitious 24-year-old American biologist visiting from Cambridge. Watson later recalled that his mouth fell open and his pulse raced: the distinct 'X' pattern gave Watson and Francis Crick immediate proof that DNA was a double helix, providing the vital breakthrough they needed to build their model.`,
    content: `<span class="para-ref">[2.1]</span> In January 1951, physical chemist Rosalind Franklin joined King’s College London as an expert in X-ray crystallography—a demanding technique using high-powered X-rays to take shadow diffraction photographs of microscopic molecules. Working alongside PhD student Raymond Gosling in a basement laboratory, Franklin perfected a camera setup, exposing delicate DNA fibres to 62 continuous hours of X-ray beams. In May 1952, she captured "Photograph 51" (<span class="archival-meta-tag">Source A</span>), a razor-sharp image showing a dark X-shaped pattern that proved DNA formed a double-stranded helical spiral.<br><br><span class="para-ref">[2.2]</span> Severe personal and professional tension divided the King’s biophysics unit. Maurice Wilkins, a senior physicist who mistakenly regarded Franklin as his assistant rather than an independent researcher, clashed with her rigorous standards. In January 1953, without Franklin’s knowledge or permission, Wilkins showed Photograph 51 to James Watson, an ambitious 24-year-old American biologist visiting from Cambridge. Watson later recalled that his mouth fell open and his pulse raced: the distinct 'X' pattern gave Watson and Francis Crick immediate proof that DNA was a double helix, providing the vital breakthrough they needed to build their model.`
  },
  {
    act: 3,
    title: "Watson & Crick’s Double Helix Model (1953)",
    theme_heading: "Watson & Crick’s Double Helix Model (1953)",
    theme: "Watson & Crick’s Double Helix Model (1953)",
    text: `<span class="para-ref">[3.1]</span> Armed with Franklin’s experimental measurements, James Watson and Francis Crick worked frantically at the Cavendish Laboratory in Cambridge. Instead of running wet chemical experiments, they used physical modeling, assembling sheet-metal cutouts and brass wire rods on an upright stand (<span class="archival-meta-tag">Source B</span>). In March 1953, they completed their model, proving that DNA was a "double helix"—a twisting ladder with two chemical backbones linked by pairs of four chemical bases: Adenine (A) bonded strictly with Thymine (T), and Cytosine (C) bonded strictly with Guanine (G).<br><br><span class="para-ref">[3.2]</span> This base-pairing discovery was revolutionary because it explained how genetic replication works. During cell division, the two strands unzip down the middle, and each strand acts as a template to build an identical copy. Watson and Crick famously announced in The Eagle pub that they had discovered "the secret of life." In April 1953, they published their breakthrough paper in <em>Nature</em>, proving for the first time how hereditary information is stored and passed from parent to child.`,
    content: `<span class="para-ref">[3.1]</span> Armed with Franklin’s experimental measurements, James Watson and Francis Crick worked frantically at the Cavendish Laboratory in Cambridge. Instead of running wet chemical experiments, they used physical modeling, assembling sheet-metal cutouts and brass wire rods on an upright stand (<span class="archival-meta-tag">Source B</span>). In March 1953, they completed their model, proving that DNA was a "double helix"—a twisting ladder with two chemical backbones linked by pairs of four chemical bases: Adenine (A) bonded strictly with Thymine (T), and Cytosine (C) bonded strictly with Guanine (G).<br><br><span class="para-ref">[3.2]</span> This base-pairing discovery was revolutionary because it explained how genetic replication works. During cell division, the two strands unzip down the middle, and each strand acts as a template to build an identical copy. Watson and Crick famously announced in The Eagle pub that they had discovered "the secret of life." In April 1953, they published their breakthrough paper in <em>Nature</em>, proving for the first time how hereditary information is stored and passed from parent to child.`
  },
  {
    act: 4,
    title: "The Human Genome Project (1990–2003)",
    theme_heading: "The Human Genome Project (1990–2003)",
    theme: "The Human Genome Project (1990–2003)",
    text: `<span class="para-ref">[4.1]</span> Discovering the structure of DNA was the catalyst for the greatest collaborative scientific effort in modern medical history: the Human Genome Project. Launched in 1990, the project was an international public consortium led by scientists in the United States and Britain (funded by the Medical Research Council and the Wellcome Trust charity), alongside researchers in France, Germany, and Japan. Their mission was to decode the complete genetic instruction manual of human life.<br><br><span class="para-ref">[4.2]</span> Completed in April 2003, the project successfully mapped all 3 billion chemical base pairs across humanity’s 20,000–25,000 genes, publishing the data free online for all scientists. Powered by advanced laboratory computers, this landmark achievement allowed researchers to pinpoint the specific faulty genes responsible for over 4,000 inherited disorders, including the BRCA1 and BRCA2 genes that increase the risk of hereditary breast and ovarian cancer.`,
    content: `<span class="para-ref">[4.1]</span> Discovering the structure of DNA was the catalyst for the greatest collaborative scientific effort in modern medical history: the Human Genome Project. Launched in 1990, the project was an international public consortium led by scientists in the United States and Britain (funded by the Medical Research Council and the Wellcome Trust charity), alongside researchers in France, Germany, and Japan. Their mission was to decode the complete genetic instruction manual of human life.<br><br><span class="para-ref">[4.2]</span> Completed in April 2003, the project successfully mapped all 3 billion chemical base pairs across humanity’s 20,000–25,000 genes, publishing the data free online for all scientists. Powered by advanced laboratory computers, this landmark achievement allowed researchers to pinpoint the specific faulty genes responsible for over 4,000 inherited disorders, including the BRCA1 and BRCA2 genes that increase the risk of hereditary breast and ovarian cancer.`
  },
  {
    act: 5,
    title: "Genetic Screening & The Treatment Gap (2000s–Present)",
    theme_heading: "Genetic Screening & The Treatment Gap (2000s–Present)",
    theme: "Genetic Screening & The Treatment Gap (2000s–Present)",
    text: `<span class="para-ref">[5.1]</span> The discovery of DNA and the Human Genome Project transformed modern medicine by allowing doctors to understand the root causes of inherited disease. For the first time, doctors could use genetic testing and screening to see if a patient carried faulty genes passed down from their parents. For example, testing can identify breast cancer risk genes (like BRCA1 and BRCA2) or cystic fibrosis before symptoms appear. This allows patients to take preventative action, have regular health checks, or undergo preventative surgery before disease develops.<br><br><span class="para-ref">[5.2]</span> However, medical historians emphasize that understanding the cause of a disease does not automatically provide a cure. While finding and mapping faulty genes is now quick and cheap, repairing or replacing them through gene therapy has proved slow, difficult, and expensive. As a result, there is still a major gap between diagnosis and treatment: doctors can easily identify genetic diseases, but cures for most hereditary conditions remain a challenge for the future.`,
    content: `<span class="para-ref">[5.1]</span> The discovery of DNA and the Human Genome Project transformed modern medicine by allowing doctors to understand the root causes of inherited disease. For the first time, doctors could use genetic testing and screening to see if a patient carried faulty genes passed down from their parents. For example, testing can identify breast cancer risk genes (like BRCA1 and BRCA2) or cystic fibrosis before symptoms appear. This allows patients to take preventative action, have regular health checks, or undergo preventative surgery before disease develops.<br><br><span class="para-ref">[5.2]</span> However, medical historians emphasize that understanding the cause of a disease does not automatically provide a cure. While finding and mapping faulty genes is now quick and cheap, repairing or replacing them through gene therapy has proved slow, difficult, and expensive. As a result, there is still a major gap between diagnosis and treatment: doctors can easily identify genetic diseases, but cures for most hereditary conditions remain a challenge for the future.`
  }
];

function updateLesson(lesson) {
  newBlocks.forEach((nb, i) => {
    const existing = lesson.narrative_blocks[i];
    if (existing) {
      existing.text = nb.text;
      existing.content = nb.content;
      existing.title = nb.title;
      existing.theme_heading = nb.theme_heading;
      existing.theme = nb.theme;
    }
  });

  if (lesson.guided_reading && lesson.guided_reading[3]) {
    lesson.guided_reading[3].question = "Using paragraph [4.2], how many base pairs and genes were sequenced during the Human Genome Project?";
  }
}

// 1. Update data/edexcel_medicine.json and public/data/edexcel_medicine.json
['data/edexcel_medicine.json', 'public/data/edexcel_medicine.json'].forEach(rel => {
  const p = path.resolve(__dirname, '..', rel);
  if (!fs.existsSync(p)) return;
  const json = JSON.parse(fs.readFileSync(p, 'utf8'));
  const l41 = json.lessons.find(l => l.id === 'lesson_4_1');
  if (l41) {
    updateLesson(l41);
    fs.writeFileSync(p, JSON.stringify(json, null, 2), 'utf8');
    console.log(`Updated lesson_4_1 in ${rel}`);
  }
});

// 2. Update units/edexcel_medicine/data.js
const unitJsPath = path.resolve(__dirname, '../units/edexcel_medicine/data.js');
if (fs.existsSync(unitJsPath)) {
  let content = fs.readFileSync(unitJsPath, 'utf8');
  let clean = content;
  if (clean.startsWith('export default ')) clean = clean.substring('export default '.length);
  if (clean.endsWith(';\n')) clean = clean.substring(0, clean.length - 2);
  else if (clean.endsWith(';')) clean = clean.substring(0, clean.length - 1);
  const parsed = JSON.parse(clean);
  const l41 = parsed.lessons.find(l => l.id === 'lesson_4_1');
  if (l41) {
    updateLesson(l41);
    fs.writeFileSync(unitJsPath, `export default ${JSON.stringify(parsed, null, 2)};\n`, 'utf8');
    console.log(`Updated lesson_4_1 in units/edexcel_medicine/data.js`);
  }
}

// 3. Update database.json and public/database.json
['database.json', 'public/database.json'].forEach(rel => {
  const p = path.resolve(__dirname, '..', rel);
  if (!fs.existsSync(p)) return;
  const db = JSON.parse(fs.readFileSync(p, 'utf8'));
  const medUnit = db.edexcel_medicine?.data || db.edexcel_medicine || (db.units ? db.units.find(u => u.id === 'edexcel_medicine') : null);
  if (medUnit && medUnit.lessons) {
    const l41 = medUnit.lessons.find(l => l.id === 'lesson_4_1');
    if (l41) {
      updateLesson(l41);
      fs.writeFileSync(p, JSON.stringify(db, null, 2), 'utf8');
      console.log(`Updated lesson_4_1 in ${rel}`);
    }
  }
});

console.log('Update complete!');
