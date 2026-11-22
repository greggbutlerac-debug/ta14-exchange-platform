#!/usr/bin/env node
// TA-14 HPR increment 2 — mutation check for the PGlite suite.
//
// Applies one weakening at a time to
// supabase/migrations/20261122120000_hpr_private_photo_reconciliation.sql
// (written to a temp file; the repository file is never modified), runs
// tests/hvac-performance-record/persistence/photo-reconciliation-rls.test.ts
// against it via HPR_PHOTO_MIGRATION_PATH, and requires the suite to FAIL.
// A mutation that the suite does not catch is reported and exits non-zero.
//
// Usage: node scripts/hpr/mutation-check-photo-reconciliation.mjs
import {spawnSync} from 'node:child_process';
import {mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const source = readFileSync(path.join(root, 'supabase/migrations/20261122120000_hpr_private_photo_reconciliation.sql'), 'utf8');
const suite = 'tests/hvac-performance-record/persistence/photo-reconciliation-rls.test.ts';

const mutations = [
  ['bucket made public', "  'hpr-field-evidence-private',\n  false,", "  'hpr-field-evidence-private',\n  true,"],
  ['client INSERT policy on the bucket', 'create policy "HPR technicians read their own declared photo originals"',
    `create policy "mutant insert" on storage.objects for insert to authenticated with check (bucket_id = 'hpr-field-evidence-private');\ncreate policy "HPR technicians read their own declared photo originals"`],
  ['bucket guard ignores UPDATE/DELETE', 'before insert or update or delete on storage.objects', 'before insert on storage.objects'],
  ['path discipline removed', "    if new.name !~ '^[0-9a-f]{8}", "    if false and new.name !~ '^[0-9a-f]{8}"],
  ['authenticated may complete attempts', 'grant execute on function public.hpr_complete_photo_upload_attempt(uuid, text, bigint, text) to service_role;',
    'grant execute on function public.hpr_complete_photo_upload_attempt(uuid, text, bigint, text) to service_role, authenticated;'],
  // Removing only one of the two ownership clauses is an equivalent mutant
  // (#704 guarantees a submission's technician owns its inspection), so the
  // whole ownership check is removed.
  ['ownership check removed from open', `  if not found
     or v_sub.technician_user_id <> v_uid
     or not exists (
       select 1 from public.hpr_inspections i
       where i.id = v_sub.inspection_id and i.technician_user_id = v_uid
     ) then`, '  if not found then'],
  ['nonce replay index removed', 'create unique index hpr_photo_upload_attempt_nonce_key', 'create index hpr_photo_upload_attempt_nonce_key'],
  ['concurrent attempt check removed', "      and a.lease_expires_at > now()\n      and not exists", "      and false and a.lease_expires_at > now()\n      and not exists"],
  ['object existence not required', "  if not found then\n    raise exception using errcode = '22023',\n      message = 'HPR_OBJECT_ABSENT: no stored object at the derived path';",
    "  if false then\n    raise exception using errcode = '22023',\n      message = 'HPR_OBJECT_ABSENT: no stored object at the derived path';"],
  ['storage size not compared', "(v_object.metadata ->> 'size')::bigint <> p_byte_size", 'false'],
  ['client digest not compared', 'v_sub.client_declared_sha256 <> p_server_sha256', 'false'],
  ['digest mismatch counted as MATCH', "    when lower(p_observed_sha256) is distinct from v_decl.server_declared_sha256 then 'DIGEST_MISMATCH'\n", ''],
  ['failure not sticky', "    when r.failure_count > 0 then 'RECONCILIATION_FAILED'\n", ''],
  ['#704 direct declaration left to service_role', 'revoke execute on function public.hpr_declare_evidence_storage_object(uuid, text, bigint, text) from service_role;', ''],
  ['reconciliations not append-only', 'create trigger hpr_reconciliations_append_only before update or delete', 'create trigger hpr_reconciliations_append_only before insert'],
  ['search_path pin removed', "returns public.hpr_storage_orphan_records\nlanguage plpgsql\nvolatile\nsecurity definer\nset search_path = ''",
    "returns public.hpr_storage_orphan_records\nlanguage plpgsql\nvolatile\nsecurity definer"],
];

const dir = mkdtempSync(path.join(tmpdir(), 'hpr-mutation-'));
let survived = 0;
try {
  for (const [name, from, to] of mutations) {
    if (!source.includes(from)) {
      console.log(`ERROR  ${name}: anchor text not found (update this script)`);
      survived++;
      continue;
    }
    const file = path.join(dir, 'mutant.sql');
    writeFileSync(file, source.replace(from, to));
    const run = spawnSync('npx', ['vitest', 'run', suite, '--reporter=dot'], {
      cwd: root, env: {...process.env, HPR_PHOTO_MIGRATION_PATH: file}, encoding: 'utf8',
    });
    const killed = run.status !== 0;
    if (!killed) survived++;
    console.log(`${killed ? 'KILLED  ' : 'SURVIVED'} ${name}`);
  }
} finally {
  rmSync(dir, {recursive: true, force: true});
}
console.log(`\n${mutations.length - survived}/${mutations.length} mutations killed`);
process.exit(survived === 0 ? 0 : 1);
