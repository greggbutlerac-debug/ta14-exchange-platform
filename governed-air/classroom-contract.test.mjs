import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const ui=readFileSync(new URL('../apps/web/app/governed-air/classroom/classroom-exam.tsx',import.meta.url),'utf8');
test('classroom imports the canonical evaluator',()=>{
  assert.match(ui,/import\s*\{\s*evaluate\s*\}\s*from\s*['"][^'"]*decision-engine\.mjs['"]/);
  assert.match(ui,/const result=evaluate\(input\)/);
});
test('every examination input change invalidates the previous result',()=>{
  assert.match(ui,/setChecked\(v=>\(\{\.\.\.v,\[k\]:e\.target\.checked\}\)\);setRecord\(null\)/);
  assert.match(ui,/setAction\(v\);setRecord\(null\)/);
  assert.match(ui,/setSafety\(e\.target\.checked\);setRecord\(null\)/);
});
test('download uses the latest generated record',()=>{
  assert.match(ui,/JSON\.stringify\(record,null,2\)/);
  assert.match(ui,/a\.download='governed-air-simulation\.json'/);
});
test('interface visibly identifies simulation and limits',()=>{
  assert.match(ui,/SIMULATION ONLY/);
  assert.match(ui,/not a universal health or legal threshold/);
  assert.match(ui,/AWAITING EXAMINATION/);
});
