const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Running permanent Watson-Crick fix...');
execSync('node scripts/fix_watson_crick_permanent.cjs', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
execSync('node scripts/sync_modified_units.cjs', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
console.log('Permanent Watson-Crick fix complete.');
