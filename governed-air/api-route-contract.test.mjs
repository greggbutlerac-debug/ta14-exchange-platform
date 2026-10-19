import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const route=readFileSync(new URL('../apps/web/app/api/governed-air/examine/route.ts',import.meta.url),'utf8');
test('server-only route invokes canonical pipeline',()=>{
 assert.match(route,/runtime='nodejs'/);
 assert.match(route,/examineGovernedAirCase\(body,\{keys:\{\}\}\)/);
});
test('endpoint does not import or accept browser-provided trust keys',()=>{
 assert.doesNotMatch(route,/body\.keys|body\.trustedKeys|body\.publicKeyPem/);
 assert.match(route,/DEVELOPMENT_SIMULATION/);
});
test('endpoint enforces input bounds and no-store',()=>{
 assert.match(route,/16384/);
 assert.match(route,/Cache-Control':'no-store/);
 assert.match(route,/Invalid JSON/);
});
