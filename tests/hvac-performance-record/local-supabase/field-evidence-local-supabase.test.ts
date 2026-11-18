/**
 * HPR field evidence against a REAL local Supabase stack (GoTrue + PostgREST
 * + PostgreSQL), as opposed to the PGlite simulation in ../persistence.
 *
 * Skipped unless scripts/hpr/local-supabase-verify.sh (or an operator) sets
 * HPR_LOCAL_SUPABASE_URL / HPR_LOCAL_SUPABASE_ANON_KEY /
 * HPR_LOCAL_SUPABASE_SERVICE_ROLE_KEY. Refuses to run against any host other
 * than 127.0.0.1 / localhost, so production credentials cannot be exercised.
 */
import {createHmac, randomBytes, randomUUID} from 'node:crypto';
import {createClient, type SupabaseClient} from '@supabase/supabase-js';
import {beforeAll, describe, expect, it} from 'vitest';

const URL_ENV = process.env.HPR_LOCAL_SUPABASE_URL ?? '';
const ANON_KEY = process.env.HPR_LOCAL_SUPABASE_ANON_KEY ?? '';
const SERVICE_KEY = process.env.HPR_LOCAL_SUPABASE_SERVICE_ROLE_KEY ?? '';

export function isLocalSupabaseUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' && (u.hostname === '127.0.0.1' || u.hostname === 'localhost');
  } catch {
    return false;
  }
}

const configured = Boolean(URL_ENV && ANON_KEY && SERVICE_KEY);
if (configured && !isLocalSupabaseUrl(URL_ENV)) {
  throw new Error('HPR local Supabase tests refuse non-local URL: ' + URL_ENV);
}

const noSession = {auth: {persistSession: false, autoRefreshToken: false, detectSessionInUrl: false}};
const client = (key: string, accessToken?: string): SupabaseClient => createClient(URL_ENV, key, {
  ...noSession,
  ...(accessToken ? {global: {headers: {Authorization: `Bearer ${accessToken}`}}} : {}),
});

type Principal = {id: string; db: SupabaseClient; token: string};

const SHA = 'ab'.repeat(32);
const DENIED = '42501';

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url');
}

/** HS256 JWT signed with a key the stack does not know. */
function forgedToken(sub: string): string {
  const header = b64url(JSON.stringify({alg: 'HS256', typ: 'JWT'}));
  const now = Math.floor(Date.now() / 1000);
  const payload = b64url(JSON.stringify({sub, role: 'authenticated', aud: 'authenticated', iat: now, exp: now + 600}));
  const signature = createHmac('sha256', randomBytes(32)).update(header + '.' + payload).digest('base64url');
  return `${header}.${payload}.${signature}`;
}

describe.skipIf(!configured)('HPR field evidence on local Supabase (GoTrue + PostgREST)', () => {
  let service: SupabaseClient;
  let anon: SupabaseClient;
  let A: Principal;
  let B: Principal;
  let U: Principal; // authenticated, never enrolled
  let n = 0;

  async function principal(): Promise<Principal> {
    const email = `hpr-${randomUUID()}@example.test`;
    const password = randomBytes(18).toString('base64url');
    const created = await service.auth.admin.createUser({email, password, email_confirm: true});
    if (created.error) throw created.error;
    const signedIn = await client(ANON_KEY).auth.signInWithPassword({email, password});
    if (signedIn.error || !signedIn.data.session) throw signedIn.error ?? new Error('no session');
    return {id: created.data.user.id, token: signedIn.data.session.access_token, db: client(ANON_KEY, signedIn.data.session.access_token)};
  }

  async function equipment(p: Principal, serial = 'SN-' + ++n) {
    const r = await p.db.from('hpr_equipment')
      .insert({manufacturer: 'Carrier', model: '24ACC6', serial_number: serial, equipment_type: 'SPLIT_AC'})
      .select('id, registered_by, identity_scope').single();
    if (r.error) throw r.error;
    return r.data as {id: string; registered_by: string; identity_scope: string};
  }

  async function inspection(p: Principal) {
    const e = await equipment(p);
    const r = await p.db.from('hpr_inspections')
      .insert({equipment_id: e.id, concern: 'Warm air at registers', operating_mode_as_found: 'COOLING'})
      .select('id, technician_user_id, verification_status, ddd_status, intervention_authorization').single();
    if (r.error) throw r.error;
    return r.data as {id: string; technician_user_id: string; verification_status: string; ddd_status: string; intervention_authorization: string};
  }

  const evidenceRow = (inspectionId: string, extra: Record<string, unknown> = {}) => ({
    inspection_id: inspectionId, step_number: 6, client_record_id: 'REC-' + ++n, kind: 'OBSERVATION',
    client_captured_at: new Date(Date.now() - 60_000).toISOString(), observation: 'Filter visibly loaded', ...extra,
  });

  async function evidence(p: Principal, inspectionId: string, extra: Record<string, unknown> = {}) {
    const r = await p.db.from('hpr_evidence_submissions').insert(evidenceRow(inspectionId, extra))
      .select('id, technician_user_id, verification_status, source').single();
    if (r.error) throw r.error;
    return r.data as {id: string; technician_user_id: string; verification_status: string; source: string};
  }

  beforeAll(async () => {
    service = client(SERVICE_KEY);
    anon = client(ANON_KEY);
    [A, B, U] = [await principal(), await principal(), await principal()];
    const enrolled = await service.from('hpr_technicians').insert([{user_id: A.id}, {user_id: B.id}]);
    if (enrolled.error) throw enrolled.error;
  }, 60_000);

  it('exposes the 14 canonical steps to authenticated users only', async () => {
    const steps = await A.db.from('hpr_baseline_steps').select('step_number').order('step_number');
    expect(steps.error).toBeNull();
    expect(steps.data?.map(s => s.step_number)).toEqual(Array.from({length: 14}, (_, i) => i + 1));
    const denied = await anon.from('hpr_baseline_steps').select('step_number');
    expect(denied.error?.code).toBe(DENIED);
  });

  it('anon is denied on every HPR table and RPC', async () => {
    for (const t of ['hpr_technicians', 'hpr_equipment', 'hpr_inspections', 'hpr_evidence_submissions',
      'hpr_evidence_storage_objects', 'hpr_evidence_current']) {
      const r = await anon.from(t).select('*').limit(1);
      expect(r.error?.code, t).toBe(DENIED);
    }
    const rpc = await anon.rpc('hpr_is_active_technician');
    expect(rpc.error).not.toBeNull();
  });

  it('rejects a JWT not signed by this stack, even when it names an enrolled technician', async () => {
    const res = await fetch(`${URL_ENV}/rest/v1/hpr_inspections?select=id`, {
      headers: {apikey: ANON_KEY, Authorization: `Bearer ${forgedToken(A.id)}`},
    });
    expect(res.status).toBe(401);
  });

  it('attributes records to the GoTrue-verified user and keeps them UNVERIFIED', async () => {
    const e = await equipment(A);
    expect(e.registered_by).toBe(A.id);
    expect(e.identity_scope).toBe('TECHNICIAN_PROVISIONAL');
    const i = await inspection(A);
    expect(i).toMatchObject({technician_user_id: A.id, verification_status: 'UNVERIFIED', ddd_status: 'LOCKED', intervention_authorization: 'NONE'});
    const ev = await evidence(A, i.id);
    expect(ev).toMatchObject({technician_user_id: A.id, verification_status: 'UNVERIFIED', source: 'TECHNICIAN_CAPTURE'});
  });

  it('rejects client-supplied identity, verification and time fields through PostgREST', async () => {
    const i = await inspection(A);
    for (const forged of [
      {technician_user_id: B.id}, {technician_user_id: A.id}, {verification_status: 'VERIFIED'},
      {source: 'INDEPENDENT_VERIFIER'}, {submitted_at: '2020-01-01T00:00:00Z'}, {id: randomUUID()},
    ]) {
      const r = await A.db.from('hpr_evidence_submissions').insert(evidenceRow(i.id, forged));
      expect(r.error?.code, JSON.stringify(forged)).toBe(DENIED);
    }
    const ddd = await A.db.from('hpr_inspections')
      .insert({equipment_id: (await equipment(A)).id, concern: 'c', operating_mode_as_found: 'COOLING', ddd_status: 'ISSUED'});
    expect(ddd.error?.code).toBe(DENIED);
  });

  it('enrollment gates writes and cannot be self-granted', async () => {
    const r = await U.db.from('hpr_equipment')
      .insert({manufacturer: 'a', model: 'b', serial_number: 'c', equipment_type: 'd'});
    expect(r.error?.message).toMatch(/HPR_TECHNICIAN_NOT_AUTHORIZED/);
    const self = await U.db.from('hpr_technicians').insert({user_id: U.id});
    expect(self.error?.code).toBe(DENIED);
    const own = await A.db.from('hpr_technicians').select('user_id');
    expect(own.data?.map(r => r.user_id)).toEqual([A.id]);
  });

  it('isolates two independently authenticated technicians', async () => {
    const i = await inspection(A);
    await evidence(A, i.id);
    for (const t of ['hpr_equipment', 'hpr_inspections', 'hpr_evidence_submissions', 'hpr_evidence_current']) {
      const col = t === 'hpr_equipment' ? 'registered_by' : 'technician_user_id';
      const r = await B.db.from(t).select(col);
      expect(r.error, t).toBeNull();
      expect((r.data as unknown as Array<Record<string, string>>).every(row => row[col] === B.id), t).toBe(true);
    }
    const write = await B.db.from('hpr_evidence_submissions').insert(evidenceRow(i.id));
    expect(write.error?.message).toMatch(/HPR_INSPECTION_NOT_ACCESSIBLE/);
    const onForeignEquipment = await B.db.from('hpr_inspections')
      .insert({equipment_id: (await equipment(A)).id, concern: 'c', operating_mode_as_found: 'COOLING'});
    expect(onForeignEquipment.error?.message).toMatch(/HPR_EQUIPMENT_NOT_ACCESSIBLE/);
  });

  it('denies UPDATE, DELETE and UPSERT of evidence to the technician and to service_role', async () => {
    const i = await inspection(A);
    const ev = await evidence(A, i.id);
    for (const db of [A.db, service]) {
      const upd = await db.from('hpr_evidence_submissions').update({observation: 'rewritten'}).eq('id', ev.id);
      expect(upd.error?.code).toBe(DENIED);
      const del = await db.from('hpr_evidence_submissions').delete().eq('id', ev.id);
      expect(del.error?.code).toBe(DENIED);
    }
    const ups = await A.db.from('hpr_evidence_submissions').upsert({...evidenceRow(i.id), client_record_id: 'UPSERT-1'});
    expect(ups.error?.code).toBe(DENIED);
    const svcInsert = await service.from('hpr_evidence_submissions').insert(evidenceRow(i.id));
    expect(svcInsert.error?.code).toBe(DENIED);
    const still = await A.db.from('hpr_evidence_submissions').select('observation').eq('id', ev.id).single();
    expect(still.data?.observation).toBe('Filter visibly loaded');
  });

  it('records corrections as superseding rows and rejects duplicate record ids', async () => {
    const i = await inspection(A);
    const original = await evidence(A, i.id, {client_record_id: 'DUP-LOCAL'});
    const dup = await A.db.from('hpr_evidence_submissions').insert(evidenceRow(i.id, {client_record_id: 'DUP-LOCAL'}));
    expect(dup.error?.code).toBe('23505');
    const correction = await evidence(A, i.id, {supersedes_submission_id: original.id, correction_reason: 'Wrong air handler'});
    const current = await A.db.from('hpr_evidence_current').select('id').eq('inspection_id', i.id);
    expect(current.data?.map(r => r.id)).toEqual([correction.id]);
    const hostile = await B.db.from('hpr_evidence_submissions')
      .insert(evidenceRow((await inspection(B)).id, {supersedes_submission_id: correction.id, correction_reason: 'x'}));
    expect(hostile.error?.message).toMatch(/HPR_SUPERSESSION_NOT_ACCESSIBLE/);
  });

  it('storage declaration is service_role-only, single-write and UNRECONCILED; photos start STORAGE_PENDING', async () => {
    const i = await inspection(A);
    const photo = await evidence(A, i.id, {kind: 'PHOTO', observation: null, step_number: 4});
    const pending = await A.db.from('hpr_evidence_current').select('storage_state').eq('id', photo.id).single();
    expect(pending.data?.storage_state).toBe('STORAGE_PENDING');
    const args = {p_submission_id: photo.id, p_declared_sha256: SHA, p_declared_byte_size: 4096, p_declared_content_type: 'image/jpeg'};
    const asUser = await A.db.rpc('hpr_declare_evidence_storage_object', args);
    expect(asUser.error?.code).toBe(DENIED);
    const declared = await service.rpc('hpr_declare_evidence_storage_object', args).single();
    expect(declared.error).toBeNull();
    expect(declared.data).toMatchObject({
      reconciliation_status: 'UNRECONCILED',
      object_path: `${A.id}/${i.id}/${photo.id}/original`,
    });
    const again = await service.rpc('hpr_declare_evidence_storage_object', {...args, p_declared_sha256: 'cd'.repeat(32)});
    expect(again.error?.code).toBe('23505');
    const after = await A.db.from('hpr_evidence_current').select('storage_state').eq('id', photo.id).single();
    expect(after.data?.storage_state).toBe('DECLARED_UNRECONCILED');
    const leaked = await B.db.from('hpr_evidence_storage_objects').select('submission_id').eq('submission_id', photo.id);
    expect(leaked.data).toEqual([]);
  });
});

describe('local Supabase guard', () => {
  it('accepts only loopback http URLs', () => {
    expect(isLocalSupabaseUrl('http://127.0.0.1:54321')).toBe(true);
    expect(isLocalSupabaseUrl('http://localhost:54321')).toBe(true);
    expect(isLocalSupabaseUrl('https://abcdefghijklmnop.supabase.co')).toBe(false);
    expect(isLocalSupabaseUrl('http://127.0.0.1.evil.example:54321')).toBe(false);
    expect(isLocalSupabaseUrl('not a url')).toBe(false);
  });
});
