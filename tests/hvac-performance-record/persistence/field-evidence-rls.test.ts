/**
 * Executes the HPR field-evidence migration in real Postgres (PGlite) and
 * attacks its access boundary as anon, authenticated and service_role.
 */
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import {HVAC_BASELINE_STEP_TITLES} from '../../../apps/web/lib/hvac-performance-record/step-definitions';
import {
  HVAC_BASELINE_STEP_ZONES,
  PRODUCTION_ADMISSION_OPERATIONAL,
} from '../../../apps/web/lib/hvac-performance-record/production-admission';
import {SupabaseSim, type Actor} from './supabase-pglite-harness';

const TECH_A = '00000000-0000-4000-8000-00000000000a';
const TECH_B = '00000000-0000-4000-8000-00000000000b';
const SUSPENDED = '00000000-0000-4000-8000-00000000000c';
const UNENROLLED = '00000000-0000-4000-8000-00000000000d';

const A: Actor = {role: 'authenticated', sub: TECH_A};
const B: Actor = {role: 'authenticated', sub: TECH_B};
const anon: Actor = {role: 'anon'};
const service: Actor = {role: 'service_role'};

const PERMISSION_DENIED = /permission denied/;
const APPEND_ONLY = /HPR_APPEND_ONLY/;
const SHA = 'ab'.repeat(32);

let sim: SupabaseSim;
let counter = 0;

async function registerEquipment(actor: Actor, serial = 'SN-' + ++counter) {
  const [row] = await sim.as<{id: string}>(actor,
    `insert into public.hpr_equipment (manufacturer, model, serial_number, equipment_type)
     values ('Carrier', '24ACC6', $1, 'SPLIT_AC') returning id`, [serial]);
  return row.id;
}

async function openInspection(actor: Actor, equipmentId?: string) {
  const equipment = equipmentId ?? await registerEquipment(actor);
  const [row] = await sim.as<{id: string}>(actor,
    `insert into public.hpr_inspections (equipment_id, concern, operating_mode_as_found)
     values ($1, 'Warm air at registers', 'COOLING') returning id`, [equipment]);
  return row.id;
}

type EvidenceOverrides = Partial<{
  step: number; kind: string; recordId: string; observation: string | null;
  supersedes: string | null; reason: string | null; capturedAt: string;
}>;

async function submitEvidence(actor: Actor, inspectionId: string, o: EvidenceOverrides = {}) {
  const kind = o.kind ?? 'OBSERVATION';
  const [row] = await sim.as<{id: string; verification_status: string; technician_user_id: string}>(actor,
    `insert into public.hpr_evidence_submissions
       (inspection_id, step_number, client_record_id, kind, client_captured_at,
        observation, supersedes_submission_id, correction_reason)
     values ($1, $2, $3, $4, $5, $6, $7, $8)
     returning id, verification_status, technician_user_id`,
    [inspectionId, o.step ?? 6, o.recordId ?? 'REC-' + ++counter, kind,
      o.capturedAt ?? '2026-11-16T12:00:00Z',
      o.observation === undefined ? (kind === 'OBSERVATION' ? 'Filter visibly loaded' : null) : o.observation,
      o.supersedes ?? null, o.reason ?? null]);
  return row;
}

beforeAll(async () => {
  sim = await SupabaseSim.create();
  for (const id of [TECH_A, TECH_B, SUSPENDED, UNENROLLED]) await sim.createUser(id);
  await sim.enrollTechnician(TECH_A);
  await sim.enrollTechnician(TECH_B);
  await sim.enrollTechnician(SUSPENDED, 'suspended');
}, 60_000);

afterAll(async () => {
  await sim?.close();
});

describe('canonical 14-step baseline', () => {
  it('seeds exactly the 14 canonical steps with their titles and zones', async () => {
    const rows = await sim.as<{step_number: number; title: string; zone: string}>(A,
      'select step_number, title, zone from public.hpr_baseline_steps order by step_number');
    expect(rows.map(r => r.step_number)).toEqual(Array.from({length: 14}, (_, i) => i + 1));
    expect(rows.map(r => r.title)).toEqual([...HVAC_BASELINE_STEP_TITLES]);
    expect(rows.map(r => r.zone)).toEqual([...HVAC_BASELINE_STEP_ZONES]);
  });

  it('cannot be altered by any role, including the migration owner', async () => {
    await expect(sim.as(service, `update public.hpr_baseline_steps set title = 'x' where step_number = 1`))
      .rejects.toThrow(PERMISSION_DENIED);
    await expect(sim.admin(`update public.hpr_baseline_steps set title = 'x' where step_number = 1`))
      .rejects.toThrow(APPEND_ONLY);
    await expect(sim.admin(`insert into public.hpr_baseline_steps values (15, 'Extra', 'INDOOR')`))
      .rejects.toThrow();
    await expect(sim.admin('delete from public.hpr_baseline_steps')).rejects.toThrow(APPEND_ONLY);
    await expect(sim.admin('truncate public.hpr_baseline_steps cascade')).rejects.toThrow(APPEND_ONLY);
    const [{n}] = await sim.admin<{n: number}>('select count(*)::int as n from public.hpr_baseline_steps');
    expect(n).toBe(14);
  });

  it('rejects evidence for a step outside 1..14', async () => {
    const inspection = await openInspection(A);
    await expect(submitEvidence(A, inspection, {step: 15})).rejects.toThrow(/foreign key/);
    await expect(submitEvidence(A, inspection, {step: 0})).rejects.toThrow(/foreign key/);
  });
});

describe('unauthorized access', () => {
  const tables = [
    'hpr_baseline_steps', 'hpr_technicians', 'hpr_equipment', 'hpr_inspections',
    'hpr_evidence_submissions', 'hpr_evidence_storage_objects', 'hpr_evidence_current',
  ];

  it.each(tables)('anon has no access to %s', async table => {
    await expect(sim.as(anon, `select * from public.${table}`)).rejects.toThrow(PERMISSION_DENIED);
  });

  it('anon cannot write equipment, inspections or evidence', async () => {
    await expect(sim.as(anon,
      `insert into public.hpr_equipment (manufacturer, model, serial_number, equipment_type) values ('a','b','c','d')`))
      .rejects.toThrow(PERMISSION_DENIED);
  });

  it('a signed-in but unenrolled user cannot register equipment or open inspections', async () => {
    await expect(registerEquipment({role: 'authenticated', sub: UNENROLLED}))
      .rejects.toThrow(/HPR_TECHNICIAN_NOT_AUTHORIZED/);
    const equipment = await registerEquipment(A);
    await expect(openInspection({role: 'authenticated', sub: UNENROLLED}, equipment))
      .rejects.toThrow(/HPR_TECHNICIAN_NOT_AUTHORIZED/);
  });

  it('a suspended technician cannot submit new records', async () => {
    await expect(registerEquipment({role: 'authenticated', sub: SUSPENDED}))
      .rejects.toThrow(/HPR_TECHNICIAN_NOT_AUTHORIZED/);
  });

  it('users cannot enroll themselves or change their own enrollment status', async () => {
    const self: Actor = {role: 'authenticated', sub: UNENROLLED};
    await expect(sim.as(self, 'insert into public.hpr_technicians (user_id) values ($1)', [UNENROLLED]))
      .rejects.toThrow(PERMISSION_DENIED);
    const suspended: Actor = {role: 'authenticated', sub: SUSPENDED};
    await expect(sim.as(suspended, `update public.hpr_technicians set status = 'active' where user_id = $1`, [SUSPENDED]))
      .rejects.toThrow(PERMISSION_DENIED);
  });

  it('a technician sees only their own enrollment row', async () => {
    const rows = await sim.as<{user_id: string}>(A, 'select user_id from public.hpr_technicians');
    expect(rows.map(r => r.user_id)).toEqual([TECH_A]);
  });

  it('only service_role can record a server-side storage reference', async () => {
    const inspection = await openInspection(A);
    const photo = await submitEvidence(A, inspection, {kind: 'PHOTO', observation: null});
    const call = 'select * from public.hpr_declare_evidence_storage_object($1, $2, 1024, \'image/jpeg\')';
    await expect(sim.as(anon, call, [photo.id, SHA])).rejects.toThrow(PERMISSION_DENIED);
    await expect(sim.as(A, call, [photo.id, SHA])).rejects.toThrow(PERMISSION_DENIED);
    await expect(sim.as(A,
      `insert into public.hpr_evidence_storage_objects (submission_id, object_path, server_declared_sha256, declared_byte_size, declared_content_type)
       values ($1, 'x', $2, 1, 'image/jpeg')`, [photo.id, SHA])).rejects.toThrow(PERMISSION_DENIED);
    await expect(sim.as(service,
      `insert into public.hpr_evidence_storage_objects (submission_id, object_path, server_declared_sha256, declared_byte_size, declared_content_type)
       values ($1, 'x', $2, 1, 'image/jpeg')`, [photo.id, SHA])).rejects.toThrow(PERMISSION_DENIED);
  });

  it('internal guard functions are not callable by API roles', async () => {
    await expect(sim.as(A, 'select public.hpr_require_active_technician()')).rejects.toThrow(PERMISSION_DENIED);
    await expect(sim.as(anon, 'select public.hpr_is_active_technician()')).rejects.toThrow(PERMISSION_DENIED);
  });
});

describe('forged technician identity', () => {
  it('stamps technician identity from the verified session, not from input', async () => {
    const inspection = await openInspection(A);
    const row = await submitEvidence(A, inspection);
    expect(row.technician_user_id).toBe(TECH_A);
  });

  it('rejects a client-supplied technician_user_id, even if it names the caller', async () => {
    const inspection = await openInspection(A);
    for (const forged of [TECH_B, TECH_A]) {
      await expect(sim.as(A,
        `insert into public.hpr_evidence_submissions
           (inspection_id, step_number, client_record_id, kind, client_captured_at, observation, technician_user_id)
         values ($1, 6, $2, 'OBSERVATION', now(), 'x', $3)`, [inspection, 'FORGE-' + ++counter, forged]))
        .rejects.toThrow(PERMISSION_DENIED);
    }
  });

  it('rejects forged registered_by on equipment and technician on inspections', async () => {
    await expect(sim.as(A,
      `insert into public.hpr_equipment (manufacturer, model, serial_number, equipment_type, registered_by)
       values ('a','b','c','d', $1)`, [TECH_B])).rejects.toThrow(PERMISSION_DENIED);
    const equipment = await registerEquipment(A);
    await expect(sim.as(A,
      `insert into public.hpr_inspections (equipment_id, concern, operating_mode_as_found, technician_user_id)
       values ($1, 'c', 'COOLING', $2)`, [equipment, TECH_B])).rejects.toThrow(PERMISSION_DENIED);
  });

  it('service_role cannot submit evidence on behalf of a technician', async () => {
    const inspection = await openInspection(A);
    await expect(sim.as(service,
      `insert into public.hpr_evidence_submissions
         (inspection_id, step_number, client_record_id, kind, client_captured_at, observation, technician_user_id)
       values ($1, 6, 'SVC-1', 'OBSERVATION', now(), 'x', $2)`, [inspection, TECH_A]))
      .rejects.toThrow(PERMISSION_DENIED);
  });

  it('even a privileged writer with a forged row cannot bypass the identity guard', async () => {
    const inspection = await openInspection(A);
    // Migration owner bypasses grants and RLS; the trigger still binds identity to auth.uid().
    await expect(sim.admin(
      `insert into public.hpr_evidence_submissions
         (inspection_id, step_number, client_record_id, kind, client_captured_at, observation, technician_user_id)
       values ($1, 6, 'OWNER-1', 'OBSERVATION', now(), 'x', $2)`, [inspection, TECH_A]))
      .rejects.toThrow(/HPR_AUTH_REQUIRED/);
  });
});

describe('duplicate evidence identifiers', () => {
  it('rejects a second submission with the same client record id from the same technician', async () => {
    const inspection = await openInspection(A);
    await submitEvidence(A, inspection, {recordId: 'DUP-1'});
    await expect(submitEvidence(A, inspection, {recordId: 'DUP-1'})).rejects.toThrow(/duplicate key/);
    const other = await openInspection(A);
    await expect(submitEvidence(A, other, {recordId: 'DUP-1'})).rejects.toThrow(/duplicate key/);
  });

  it('does not let one technician probe another technician\'s record ids', async () => {
    const a = await openInspection(A);
    const b = await openInspection(B);
    await submitEvidence(A, a, {recordId: 'SHARED-ID'});
    await expect(submitEvidence(B, b, {recordId: 'SHARED-ID'})).resolves.toBeDefined();
  });

  it('cannot supply the server-generated id', async () => {
    const inspection = await openInspection(A);
    await expect(sim.as(A,
      `insert into public.hpr_evidence_submissions (id, inspection_id, step_number, client_record_id, kind, client_captured_at, observation)
       values (gen_random_uuid(), $1, 6, 'ID-1', 'OBSERVATION', now(), 'x')`, [inspection]))
      .rejects.toThrow(PERMISSION_DENIED);
  });
});

describe('cross-inspection access', () => {
  it('technicians cannot read each other\'s equipment, inspections or evidence', async () => {
    const inspection = await openInspection(A);
    await submitEvidence(A, inspection);
    for (const table of ['hpr_equipment', 'hpr_inspections', 'hpr_evidence_submissions', 'hpr_evidence_current']) {
      const column = table === 'hpr_equipment' ? 'registered_by' : 'technician_user_id';
      const rows = await sim.as<{owner: string}>(B, `select ${column} as owner from public.${table}`);
      expect(rows.every(r => r.owner === TECH_B)).toBe(true);
    }
    const leaked = await sim.as(B, 'select id from public.hpr_inspections where id = $1', [inspection]);
    expect(leaked).toEqual([]);
  });

  it('a technician cannot submit evidence into another technician\'s inspection', async () => {
    const inspection = await openInspection(A);
    await expect(submitEvidence(B, inspection)).rejects.toThrow(/HPR_INSPECTION_NOT_ACCESSIBLE/);
  });

  it('a technician cannot open an inspection on equipment registered by someone else', async () => {
    const equipment = await registerEquipment(A);
    await expect(openInspection(B, equipment)).rejects.toThrow(/HPR_EQUIPMENT_NOT_ACCESSIBLE/);
  });

  it('a technician cannot supersede another technician\'s evidence', async () => {
    const a = await openInspection(A);
    const original = await submitEvidence(A, a);
    const b = await openInspection(B);
    await expect(submitEvidence(B, b, {supersedes: original.id, reason: 'hostile correction'}))
      .rejects.toThrow(/HPR_SUPERSESSION_NOT_ACCESSIBLE/);
  });

  it('evidence cannot be superseded from a different inspection by the same technician', async () => {
    const first = await openInspection(A);
    const original = await submitEvidence(A, first);
    const second = await openInspection(A);
    await expect(submitEvidence(A, second, {supersedes: original.id, reason: 'moved'}))
      .rejects.toThrow(/HPR_SUPERSESSION_NOT_ACCESSIBLE/);
  });

  it('storage references are visible only to the owning technician', async () => {
    const inspection = await openInspection(A);
    const photo = await submitEvidence(A, inspection, {kind: 'PHOTO', observation: null});
    await sim.as(service, `select * from public.hpr_declare_evidence_storage_object($1, $2, 2048, 'image/jpeg')`, [photo.id, SHA]);
    expect(await sim.as(A, 'select submission_id from public.hpr_evidence_storage_objects where submission_id = $1', [photo.id]))
      .toHaveLength(1);
    expect(await sim.as(B, 'select submission_id from public.hpr_evidence_storage_objects where submission_id = $1', [photo.id]))
      .toEqual([]);
  });
});

describe('attempted replacement of original evidence', () => {
  let inspection: string;
  let original: {id: string};

  beforeAll(async () => {
    inspection = await openInspection(A);
    original = await submitEvidence(A, inspection, {observation: 'Original as-found observation'});
  });

  it('the capturing technician cannot update or delete their evidence', async () => {
    await expect(sim.as(A, `update public.hpr_evidence_submissions set observation = 'rewritten' where id = $1`, [original.id]))
      .rejects.toThrow(PERMISSION_DENIED);
    await expect(sim.as(A, 'delete from public.hpr_evidence_submissions where id = $1', [original.id]))
      .rejects.toThrow(PERMISSION_DENIED);
  });

  it('service_role cannot update, delete or truncate evidence', async () => {
    await expect(sim.as(service, `update public.hpr_evidence_submissions set observation = 'rewritten' where id = $1`, [original.id]))
      .rejects.toThrow(PERMISSION_DENIED);
    await expect(sim.as(service, 'delete from public.hpr_evidence_submissions where id = $1', [original.id]))
      .rejects.toThrow(PERMISSION_DENIED);
    await expect(sim.as(service, 'truncate public.hpr_evidence_submissions cascade')).rejects.toThrow(PERMISSION_DENIED);
  });

  it('owner-level DML is rejected while the append-only triggers are in place', async () => {
    for (const table of ['hpr_equipment', 'hpr_inspections', 'hpr_evidence_submissions', 'hpr_evidence_storage_objects']) {
      await expect(sim.admin(`delete from public.${table}`)).rejects.toThrow(APPEND_ONLY);
      await expect(sim.admin(`truncate public.${table} cascade`)).rejects.toThrow(APPEND_ONLY);
    }
    await expect(sim.admin(`update public.hpr_evidence_submissions set observation = 'rewritten' where id = $1`, [original.id]))
      .rejects.toThrow(APPEND_ONLY);
    await expect(sim.admin(`update public.hpr_inspections set ddd_status = 'LOCKED' where id = $1`, [inspection]))
      .rejects.toThrow(APPEND_ONLY);
  });

  it('DOCUMENTED LIMIT: a privileged owner can disable the triggers (not absolute immutability)', async () => {
    // Demonstrates the boundary rather than hiding it. Rolled back so the shared DB is unchanged.
    let rewritten: string | undefined;
    await sim.db.transaction(async tx => {
      await tx.exec('alter table public.hpr_evidence_submissions disable trigger hpr_evidence_append_only');
      await tx.query(`update public.hpr_evidence_submissions set observation = 'owner rewrite' where id = $1`, [original.id]);
      rewritten = (await tx.query<{observation: string}>(
        'select observation from public.hpr_evidence_submissions where id = $1', [original.id])).rows[0].observation;
      await tx.rollback();
    }).catch(() => undefined);
    expect(rewritten).toBe('owner rewrite');
    const [row] = await sim.admin<{observation: string}>(
      'select observation from public.hpr_evidence_submissions where id = $1', [original.id]);
    expect(row.observation).toBe('Original as-found observation');
    // Application roles cannot perform the same DDL.
    for (const actor of [A, service]) {
      await expect(sim.as(actor, 'alter table public.hpr_evidence_submissions disable trigger hpr_evidence_append_only'))
        .rejects.toThrow(/must be owner/);
    }
  });

  it('a stored photograph reference cannot be replaced or re-recorded', async () => {
    const photo = await submitEvidence(A, inspection, {kind: 'PHOTO', observation: null, step: 4});
    const call = `select * from public.hpr_declare_evidence_storage_object($1, $2, 4096, 'image/jpeg')`;
    const [stored] = await sim.as<{object_path: string; server_declared_sha256: string}>(service, call, [photo.id, SHA.toUpperCase()]);
    expect(stored.object_path).toBe(`${TECH_A}/${inspection}/${photo.id}/original`);
    expect(stored.server_declared_sha256).toBe(SHA);
    await expect(sim.as(service, call, [photo.id, 'cd'.repeat(32)])).rejects.toThrow(/duplicate key/);
    await expect(sim.as(service, `update public.hpr_evidence_storage_objects set server_declared_sha256 = $2 where submission_id = $1`,
      [photo.id, 'cd'.repeat(32)])).rejects.toThrow(PERMISSION_DENIED);
  });

  it('storage references are rejected for non-photo evidence and malformed digests', async () => {
    const call = `select * from public.hpr_declare_evidence_storage_object($1, $2, 4096, 'image/jpeg')`;
    await expect(sim.as(service, call, [original.id, SHA])).rejects.toThrow(/HPR_STORAGE_KIND_MISMATCH/);
    const photo = await submitEvidence(A, inspection, {kind: 'PHOTO', observation: null, step: 8});
    await expect(sim.as(service, call, [photo.id, 'not-a-digest'])).rejects.toThrow(/check constraint/);
    await expect(sim.as(service, `select * from public.hpr_declare_evidence_storage_object($1, $2, 4096, 'application/pdf')`, [photo.id, SHA]))
      .rejects.toThrow(/check constraint/);
  });
});

describe('corrections are attributable superseding events', () => {
  it('records a correction as a new row and leaves the original intact', async () => {
    const inspection = await openInspection(A);
    const original = await submitEvidence(A, inspection, {observation: 'Filter clean'});
    const correction = await submitEvidence(A, inspection, {
      observation: 'Filter visibly loaded (earlier entry recorded wrong unit)',
      supersedes: original.id, reason: 'Recorded against the wrong air handler',
    });
    expect(correction.technician_user_id).toBe(TECH_A);
    const rows = await sim.as<{id: string; observation: string; supersedes_submission_id: string | null}>(A,
      'select id, observation, supersedes_submission_id from public.hpr_evidence_submissions where inspection_id = $1 order by submitted_at, id',
      [inspection]);
    expect(rows.find(r => r.id === original.id)?.observation).toBe('Filter clean');
    expect(rows.find(r => r.id === correction.id)?.supersedes_submission_id).toBe(original.id);
    const current = await sim.as<{id: string}>(A, 'select id from public.hpr_evidence_current where inspection_id = $1', [inspection]);
    expect(current.map(r => r.id)).toEqual([correction.id]);
  });

  it('requires a reason, the same step, and a single successor', async () => {
    const inspection = await openInspection(A);
    const original = await submitEvidence(A, inspection, {step: 3});
    await expect(submitEvidence(A, inspection, {step: 3, supersedes: original.id})).rejects.toThrow(/hpr_evidence_correction_shape/);
    await expect(submitEvidence(A, inspection, {step: 3, reason: 'no target'})).rejects.toThrow(/hpr_evidence_correction_shape/);
    await expect(submitEvidence(A, inspection, {step: 4, supersedes: original.id, reason: 'x'}))
      .rejects.toThrow(/HPR_SUPERSESSION_STEP_MISMATCH/);
    await submitEvidence(A, inspection, {step: 3, supersedes: original.id, reason: 'first correction'});
    await expect(submitEvidence(A, inspection, {step: 3, supersedes: original.id, reason: 'competing correction'}))
      .rejects.toThrow(/duplicate key/);
  });
});

describe('every submitted record remains UNVERIFIED', () => {
  it('clients cannot write verification, source, DDD or intervention fields', async () => {
    const inspection = await openInspection(A);
    const attempts: Array<[string, string]> = [
      ['hpr_evidence_submissions', 'verification_status'],
      ['hpr_evidence_submissions', 'source'],
      ['hpr_evidence_submissions', 'submitted_at'],
    ];
    for (const [table, column] of attempts) {
      await expect(sim.as(A,
        `insert into public.${table} (inspection_id, step_number, client_record_id, kind, client_captured_at, observation, ${column})
         values ($1, 6, $2, 'OBSERVATION', now(), 'x', $3)`,
        [inspection, 'AUTH-' + ++counter, column === 'submitted_at' ? '2020-01-01T00:00:00Z' : 'VERIFIED']))
        .rejects.toThrow(PERMISSION_DENIED);
    }
    const equipment = await registerEquipment(A);
    for (const [column, value] of [['verification_status', 'VERIFIED'], ['ddd_status', 'ISSUED'], ['intervention_authorization', 'AUTHORIZED']]) {
      await expect(sim.as(A,
        `insert into public.hpr_inspections (equipment_id, concern, operating_mode_as_found, ${column}) values ($1, 'c', 'COOLING', $2)`,
        [equipment, value])).rejects.toThrow(PERMISSION_DENIED);
    }
  });

  it('new records are UNVERIFIED with the DDD locked and no intervention authority', async () => {
    const inspection = await openInspection(A);
    const evidence = await submitEvidence(A, inspection);
    expect(evidence.verification_status).toBe('UNVERIFIED');
    const [row] = await sim.as<Record<string, unknown>>(A,
      'select verification_status, ddd_status, intervention_authorization, canonical_step_count from public.hpr_inspections where id = $1',
      [inspection]);
    expect(row).toEqual({verification_status: 'UNVERIFIED', ddd_status: 'LOCKED', intervention_authorization: 'NONE', canonical_step_count: 14});
  });

  it('the schema itself forbids any verification state other than UNVERIFIED', async () => {
    const rows = await sim.admin<{table: string; def: string}>(`
      select c.conrelid::regclass::text as table, pg_get_constraintdef(c.oid) as def
      from pg_constraint c
      where c.contype = 'c' and pg_get_constraintdef(c.oid) like '%verification_status%'`);
    expect(rows.map(r => r.table).sort()).toEqual(['hpr_equipment', 'hpr_evidence_submissions', 'hpr_inspections']);
    for (const r of rows) expect(r.def).toMatch(/verification_status = 'UNVERIFIED'/);
  });
});

describe('evidence shape', () => {
  it('enforces measurement, observation, digest and capture-time rules', async () => {
    const inspection = await openInspection(A);
    const insert = (kind: string, cols: string, vals: string) => sim.as(A,
      `insert into public.hpr_evidence_submissions (inspection_id, step_number, client_record_id, kind, client_captured_at${cols})
       values ($1, 10, $2, '${kind}', now()${vals})`, [inspection, 'SHAPE-' + ++counter]);
    await expect(insert('MEASUREMENT', ', measurement_value, measurement_unit', `, 12.5, 'A'`)).rejects.toThrow(/hpr_evidence_measurement_shape/);
    await expect(insert('MEASUREMENT', ', measurement_value, measurement_unit, instrument_id', `, 'NaN', 'A', 'METER-1'`)).rejects.toThrow(/hpr_evidence_measurement_shape/);
    await expect(insert('MEASUREMENT', ', measurement_value, measurement_unit, instrument_id', `, 12.5, 'A', 'METER-1'`)).resolves.toBeDefined();
    await expect(insert('PHOTO', ', measurement_value', ', 1')).rejects.toThrow(/hpr_evidence_measurement_shape/);
    await expect(insert('OBSERVATION', '', '')).rejects.toThrow(/hpr_evidence_observation_required/);
    await expect(insert('PHOTO', ', client_declared_sha256', `, 'ABC'`)).rejects.toThrow(/check constraint/);
    await expect(submitEvidence(A, inspection, {capturedAt: '2099-01-01T00:00:00Z'})).rejects.toThrow(/HPR_CAPTURE_TIME_IN_FUTURE/);
  });
});

describe('review D2: privilege audit of every HPR object', () => {
  const ROLES = ['anon', 'authenticated', 'service_role'] as const;

  it('every hpr_* function has exactly the intended EXECUTE grants and none for PUBLIC', async () => {
    const expected: Record<string, ReadonlyArray<string>> = {
      hpr_reject_mutation: [],
      hpr_is_active_technician: ['authenticated'],
      hpr_require_active_technician: [],
      hpr_guard_equipment_insert: [],
      hpr_guard_inspection_insert: [],
      hpr_guard_evidence_insert: [],
      hpr_declare_evidence_storage_object: ['service_role'],
    };
    const rows = await sim.admin<{name: string; oid: number; public_exec: boolean}>(`
      select p.proname as name, p.oid::int as oid,
        exists (select 1 from aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) a
                where a.grantee = 0 and a.privilege_type = 'EXECUTE') as public_exec
      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.proname like 'hpr\\_%'`);
    expect(rows.map(r => r.name).sort()).toEqual(Object.keys(expected).sort());
    for (const row of rows) {
      expect(row.public_exec, row.name + ' PUBLIC').toBe(false);
      for (const role of ROLES) {
        const [{ok}] = await sim.admin<{ok: boolean}>(
          `select has_function_privilege($1, $2::oid, 'EXECUTE') as ok`, [role, row.oid]);
        expect(ok, row.name + ' / ' + role).toBe(expected[row.name].includes(role));
      }
    }
  });

  it('every SECURITY DEFINER hpr_* function pins an empty search_path', async () => {
    const rows = await sim.admin<{name: string; config: string[] | null}>(`
      select p.proname as name, p.proconfig as config
      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.proname like 'hpr\\_%' and p.prosecdef`);
    expect(rows.length).toBeGreaterThan(0);
    for (const r of rows) expect(r.config, r.name).toContain('search_path=""');
  });

  it('table-level privileges match the intended matrix exactly', async () => {
    const objects = [
      'hpr_baseline_steps', 'hpr_technicians', 'hpr_equipment', 'hpr_inspections',
      'hpr_evidence_submissions', 'hpr_evidence_storage_objects', 'hpr_evidence_current',
    ];
    const privileges = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER'];
    const allowed = new Set([
      ...objects.map(o => `authenticated:${o}:SELECT`),
      ...objects.map(o => `service_role:${o}:SELECT`),
      'service_role:hpr_technicians:INSERT',
    ]);
    for (const role of ROLES) for (const object of objects) for (const privilege of privileges) {
      const [{ok}] = await sim.admin<{ok: boolean}>(
        'select has_table_privilege($1, $2, $3) as ok', [role, 'public.' + object, privilege]);
      expect(ok, `${role}:${object}:${privilege}`).toBe(allowed.has(`${role}:${object}:${privilege}`));
    }
  });

  it('column-level INSERT/UPDATE grants exclude identity, status, time and integrity columns', async () => {
    const columnsWith = async (role: string, table: string, privilege: string) => (await sim.admin<{c: string}>(`
      select column_name as c from information_schema.columns
      where table_schema = 'public' and table_name = $2
        and has_column_privilege($1, 'public.' || $2, column_name, $3)
      order by column_name`, [role, table, privilege])).map(r => r.c);
    expect(await columnsWith('authenticated', 'hpr_equipment', 'INSERT'))
      .toEqual(['equipment_type', 'manufacturer', 'model', 'serial_number']);
    expect(await columnsWith('authenticated', 'hpr_inspections', 'INSERT'))
      .toEqual(['concern', 'equipment_id', 'operating_mode_as_found']);
    expect(await columnsWith('authenticated', 'hpr_evidence_submissions', 'INSERT')).toEqual([
      'calibration_ref', 'client_captured_at', 'client_declared_sha256', 'client_record_id', 'correction_reason',
      'inspection_id', 'instrument_id', 'kind', 'measurement_unit', 'measurement_value', 'observation',
      'step_number', 'supersedes_submission_id',
    ]);
    for (const table of ['hpr_equipment', 'hpr_inspections', 'hpr_evidence_submissions', 'hpr_evidence_storage_objects']) {
      for (const role of ROLES) expect(await columnsWith(role, table, 'UPDATE'), role + ' UPDATE ' + table).toEqual([]);
      expect(await columnsWith('service_role', table, 'INSERT'), 'service_role INSERT ' + table).toEqual([]);
    }
    expect(await columnsWith('authenticated', 'hpr_evidence_storage_objects', 'INSERT')).toEqual([]);
    expect(await columnsWith('service_role', 'hpr_technicians', 'UPDATE'))
      .toEqual(['enrollment_note', 'status', 'status_changed_at']);
  });
  it('the preview verification script reports no findings against this migration', async () => {
    const script = readFileSync(fileURLToPath(new URL(
      '../../../supabase/verification/verify_hpr_field_evidence_privileges.sql', import.meta.url)), 'utf8');
    const results = await sim.db.exec(script);
    expect(results).toHaveLength(7);
    results.slice(0, 6).forEach((result, i) => expect(result.rows, 'verification query ' + (i + 1)).toEqual([]));
    expect(results[6].rows).toHaveLength(1);
  });
});

describe('review D1: storage reference is a declaration, not verified integrity', () => {
  it('records a declaration even though no object exists, and marks it UNRECONCILED', async () => {
    const inspection = await openInspection(A);
    const photo = await submitEvidence(A, inspection, {kind: 'PHOTO', observation: null});
    // No storage backend exists in this increment: the DB cannot know whether bytes were uploaded.
    const [row] = await sim.as<{reconciliation_status: string}>(service,
      `select * from public.hpr_declare_evidence_storage_object($1, $2, 1, 'image/png')`, [photo.id, SHA]);
    expect(row.reconciliation_status).toBe('UNRECONCILED');
  });

  it('no role can mark a reference reconciled, and the schema forbids any other state', async () => {
    const [{def}] = await sim.admin<{def: string}>(`
      select pg_get_constraintdef(c.oid) as def from pg_constraint c
      where c.conrelid = 'public.hpr_evidence_storage_objects'::regclass
        and pg_get_constraintdef(c.oid) like '%reconciliation_status%'`);
    expect(def).toMatch(/reconciliation_status = 'UNRECONCILED'/);
    await expect(sim.as(service, `update public.hpr_evidence_storage_objects set reconciliation_status = 'RECONCILED'`))
      .rejects.toThrow(PERMISSION_DENIED);
  });
});

describe('review D4: photo without a storage object stays incomplete', () => {
  it('reports STORAGE_PENDING until declared, then DECLARED_UNRECONCILED — never complete', async () => {
    const inspection = await openInspection(A);
    const photo = await submitEvidence(A, inspection, {kind: 'PHOTO', observation: null, step: 1});
    const note = await submitEvidence(A, inspection, {step: 2});
    const state = async () => Object.fromEntries((await sim.as<{id: string; storage_state: string}>(A,
      'select id, storage_state from public.hpr_evidence_current where inspection_id = $1', [inspection]))
      .map(r => [r.id, r.storage_state]));
    expect(await state()).toEqual({[photo.id]: 'STORAGE_PENDING', [note.id]: 'NOT_APPLICABLE'});
    await sim.as(service, `select * from public.hpr_declare_evidence_storage_object($1, $2, 10, 'image/jpeg')`, [photo.id, SHA]);
    expect((await state())[photo.id]).toBe('DECLARED_UNRECONCILED');
    const [{states}] = await sim.admin<{states: string}>(
      `select pg_get_viewdef('public.hpr_evidence_current'::regclass) as states`);
    expect(states).not.toMatch(/'(COMPLETE|VERIFIED|RECONCILED|ADMISSIBLE)'/);
  });

  it('a failed upload is recovered by a superseding submission, never by overwriting', async () => {
    const inspection = await openInspection(A);
    const failed = await submitEvidence(A, inspection, {kind: 'PHOTO', observation: null, step: 9});
    const retry = await submitEvidence(A, inspection, {
      kind: 'PHOTO', observation: null, step: 9, supersedes: failed.id, reason: 'UPLOAD_FAILED: object never stored',
    });
    const rows = await sim.as<{id: string; storage_state: string}>(A,
      'select id, storage_state from public.hpr_evidence_current where inspection_id = $1', [inspection]);
    expect(rows).toEqual([{id: retry.id, storage_state: 'STORAGE_PENDING'}]);
    const history = await sim.as(A, 'select id from public.hpr_evidence_submissions where inspection_id = $1', [inspection]);
    expect(history).toHaveLength(2);
  });

  it('production admission remains non-operational', () => {
    expect(PRODUCTION_ADMISSION_OPERATIONAL).toBe(false);
  });
});

describe('review D5: equipment identity is provisional and technician-scoped', () => {
  it('marks every equipment row TECHNICIAN_PROVISIONAL and lets two technicians register the same unit separately', async () => {
    const serial = 'SHARED-UNIT-' + ++counter;
    const a = await registerEquipment(A, serial);
    const b = await registerEquipment(B, serial);
    expect(a).not.toBe(b);
    const [row] = await sim.as<{identity_scope: string}>(A, 'select identity_scope from public.hpr_equipment where id = $1', [a]);
    expect(row.identity_scope).toBe('TECHNICIAN_PROVISIONAL');
    await expect(sim.as(A,
      `insert into public.hpr_equipment (manufacturer, model, serial_number, equipment_type, identity_scope)
       values ('a','b','c','d','CANONICAL')`)).rejects.toThrow(PERMISSION_DENIED);
  });
});
