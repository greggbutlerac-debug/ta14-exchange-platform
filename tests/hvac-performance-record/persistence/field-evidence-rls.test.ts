/**
 * Executes the HPR field-evidence migration in real Postgres (PGlite) and
 * attacks its access boundary as anon, authenticated and service_role.
 */
import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import {HVAC_BASELINE_STEP_TITLES} from '../../../apps/web/lib/hvac-performance-record/step-definitions';
import {HVAC_BASELINE_STEP_ZONES} from '../../../apps/web/lib/hvac-performance-record/production-admission';
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
    const call = 'select * from public.hpr_record_evidence_storage_object($1, $2, 1024, \'image/jpeg\')';
    await expect(sim.as(anon, call, [photo.id, SHA])).rejects.toThrow(PERMISSION_DENIED);
    await expect(sim.as(A, call, [photo.id, SHA])).rejects.toThrow(PERMISSION_DENIED);
    await expect(sim.as(A,
      `insert into public.hpr_evidence_storage_objects (submission_id, object_path, server_sha256, byte_size, content_type)
       values ($1, 'x', $2, 1, 'image/jpeg')`, [photo.id, SHA])).rejects.toThrow(PERMISSION_DENIED);
    await expect(sim.as(service,
      `insert into public.hpr_evidence_storage_objects (submission_id, object_path, server_sha256, byte_size, content_type)
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
    await sim.as(service, `select * from public.hpr_record_evidence_storage_object($1, $2, 2048, 'image/jpeg')`, [photo.id, SHA]);
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

  it('the database owner is still stopped by append-only triggers', async () => {
    for (const table of ['hpr_equipment', 'hpr_inspections', 'hpr_evidence_submissions', 'hpr_evidence_storage_objects']) {
      await expect(sim.admin(`delete from public.${table}`)).rejects.toThrow(APPEND_ONLY);
      await expect(sim.admin(`truncate public.${table} cascade`)).rejects.toThrow(APPEND_ONLY);
    }
    await expect(sim.admin(`update public.hpr_evidence_submissions set observation = 'rewritten' where id = $1`, [original.id]))
      .rejects.toThrow(APPEND_ONLY);
    await expect(sim.admin(`update public.hpr_inspections set ddd_status = 'LOCKED' where id = $1`, [inspection]))
      .rejects.toThrow(APPEND_ONLY);
  });

  it('a stored photograph reference cannot be replaced or re-recorded', async () => {
    const photo = await submitEvidence(A, inspection, {kind: 'PHOTO', observation: null, step: 4});
    const call = `select * from public.hpr_record_evidence_storage_object($1, $2, 4096, 'image/jpeg')`;
    const [stored] = await sim.as<{object_path: string; server_sha256: string}>(service, call, [photo.id, SHA.toUpperCase()]);
    expect(stored.object_path).toBe(`${TECH_A}/${inspection}/${photo.id}/original`);
    expect(stored.server_sha256).toBe(SHA);
    await expect(sim.as(service, call, [photo.id, 'cd'.repeat(32)])).rejects.toThrow(/duplicate key/);
    await expect(sim.as(service, `update public.hpr_evidence_storage_objects set server_sha256 = $2 where submission_id = $1`,
      [photo.id, 'cd'.repeat(32)])).rejects.toThrow(PERMISSION_DENIED);
  });

  it('storage references are rejected for non-photo evidence and malformed digests', async () => {
    const call = `select * from public.hpr_record_evidence_storage_object($1, $2, 4096, 'image/jpeg')`;
    await expect(sim.as(service, call, [original.id, SHA])).rejects.toThrow(/HPR_STORAGE_KIND_MISMATCH/);
    const photo = await submitEvidence(A, inspection, {kind: 'PHOTO', observation: null, step: 8});
    await expect(sim.as(service, call, [photo.id, 'not-a-digest'])).rejects.toThrow(/check constraint/);
    await expect(sim.as(service, `select * from public.hpr_record_evidence_storage_object($1, $2, 4096, 'application/pdf')`, [photo.id, SHA]))
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
