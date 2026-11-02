const fs = require('fs');
const path = require('path');

const unitsDir = path.resolve(__dirname, '../units');
const units = fs.readdirSync(unitsDir);

console.log("=== COMPREHENSIVE MODEL ANSWER SURVEY ACROSS ALL UNITS ===\n");

units.forEach(u => {
  const p = path.join(unitsDir, u, 'data.js');
  if (fs.existsSync(p)) {
    try {
      const data = require(p).default;
      let examModels = [];
      let taskModels = [];
      let sourceModels = [];

      (data.lessons || []).forEach(l => {
        (l.exam_practice?.questions || []).forEach(q => {
          const m = q.model || q.model_answer;
          if (m) examModels.push(m.trim().split(/\s+/).length);
        });
        (l.tasks || []).forEach(t => {
          const m = t.model || t.model_answer;
          if (m) taskModels.push(m.trim().split(/\s+/).length);
        });
        (l.sources || []).forEach(s => {
          const m = s.model_answer || s.model;
          if (m) sourceModels.push(m.trim().split(/\s+/).length);
        });
      });
      const avgExam = examModels.length ? Math.round(examModels.reduce((a,b)=>a+b,0)/examModels.length) : 0;
      const avgTask = taskModels.length ? Math.round(taskModels.reduce((a,b)=>a+b,0)/taskModels.length) : 0;
      const avgSource = sourceModels.length ? Math.round(sourceModels.reduce((a,b)=>a+b,0)/sourceModels.length) : 0;
      console.log(`${u.padEnd(30)}: ${String(examModels.length).padStart(2)} exams (avg ${String(avgExam).padStart(3)}w, max ${String(Math.max(0, ...examModels)).padStart(3)}w) | ${String(taskModels.length).padStart(2)} tasks (avg ${String(avgTask).padStart(3)}w, max ${String(Math.max(0, ...taskModels)).padStart(3)}w) | ${String(sourceModels.length).padStart(2)} sources (avg ${String(avgSource).padStart(3)}w, max ${String(Math.max(0, ...sourceModels)).padStart(3)}w)`);
    } catch(e) {
      console.log(`${u.padEnd(30)}: Error loading - ${e.message}`);
    }
  }
});
