# Object Impact — 20261116200000_hpr_field_evidence_foundation.sql

Status: COMMITTED FOR REVIEW / NOT EXECUTED IN ANY SUPABASE PROJECT

## Domain boundary
HVAC Performance Record (HPR) technician field evidence, increment 1: schema,
RLS and authenticated access boundaries. This migration does not modify any
existing table, policy, function or bucket. It creates no storage bucket,
upload route, digest service, verifier, HVAC Analyzer, DDD, admission gate,
execution authority or Refrigerant Governor capability.

## Objects created
| Object | Kind | Purpose |
|---|---|---|
| `hpr_baseline_steps` | table | The 14 canonical steps (titles + zones), seeded then locked against insert/update/delete/truncate. |
| `hpr_technicians` | table | Enrollment (authorization). Written only by `service_role`. A signed-in user who is not enrolled and active cannot write HPR records. |
| `hpr_equipment` | table | Equipment identity as registered by a technician. Append-only. |
| `hpr_inspections` | table | One technician inspection of one equipment item. Append-only. `verification_status='UNVERIFIED'`, `ddd_status='LOCKED'`, `intervention_authorization='NONE'` are CHECK-constrained constants. |
| `hpr_evidence_submissions` | table | Individual evidence items (PHOTO / MEASUREMENT / OBSERVATION) per canonical step. Append-only; always `UNVERIFIED`; corrections are superseding rows. |
| `hpr_evidence_storage_objects` | table | Private storage reference + server-computed SHA-256 for PHOTO evidence. Written only via the function below. |
| `hpr_evidence_current` | view (`security_invoker`) | Submissions with no superseding successor. |
| `hpr_record_evidence_storage_object(uuid,text,bigint,text)` | function, SECURITY DEFINER | Records the storage reference; derives the object path; executable by `service_role` only. |
| `hpr_is_active_technician()` | function, SECURITY DEFINER | RLS helper; `authenticated` only. |
| `hpr_require_active_technician()` | function, SECURITY DEFINER | Guard helper; no API role may call it directly. |
| `hpr_guard_*_insert()` | trigger functions | Bind identity to `auth.uid()`, check enrollment, ownership and supersession, stamp server time and constant statuses. |
| `hpr_reject_mutation()` | trigger function | Append-only enforcement. |

## Security model
1. **Identity comes from the verified session only.** `technician_user_id` and
   `registered_by` default to `auth.uid()`, which is the `sub` of the JWT that
   Supabase verified. These columns are excluded from the `authenticated`
   column-level INSERT grant, so a client that supplies them gets
   `permission denied`, even if the value names the caller. Guard triggers
   also reject any row whose identity differs from `auth.uid()` and reject
   writes with no `auth.uid()` (fail-closed for `service_role` and for the owner).
2. **Being authenticated is not authorization.** Writes also require an active
   `hpr_technicians` enrollment. Users cannot enroll themselves or change
   their own status.
3. **Tenant isolation.** RLS limits SELECT to the caller's own equipment,
   inspections, evidence and storage references. Inserts must target the
   caller's own inspection or equipment (checked by both RLS and trigger).
   Supersession must target evidence in the same inspection, on the same
   step, by the same technician.
4. **Append-only.** UPDATE/DELETE/TRUNCATE are not granted to any API role
   (including `service_role`), and triggers reject them for every role,
   including the table owner. Technician enrollment status is the only
   mutable HPR row, and only `service_role` can change it.
5. **Always UNVERIFIED.** CHECK constraints make `UNVERIFIED` the only legal
   value. Future verification must be a separate record written by an
   independent verifier, never a change to technician evidence.
6. **Integrity.** `client_declared_sha256` is labelled as a client claim. The
   authoritative digest is `server_sha256`. Only `service_role` (the server,
   after it streams the bytes and hashes them itself) can write it, through
   a function that derives the object path
   `{technician}/{inspection}/{submission}/original`. A second record for the
   same submission is rejected.
7. **Default privileges.** Supabase grants ALL on new `public` tables and
   functions to `anon`, `authenticated` and `service_role`. This migration
   revokes them and grants back only the minimum.

## Migration review requirements (before any non-local execution)
- [ ] Independent review (Atlas) of RLS policies, grants and SECURITY DEFINER functions (`search_path = ''` is set on all of them).
- [ ] Run Supabase advisors (security + performance) against a **branch / preview project**, not production.
- [ ] Confirm `auth.users` FKs use `on delete restrict`, so a user with HPR evidence cannot be hard-deleted. Decide the account-deletion and retention policy (legal review) before production.
- [ ] Confirm that technician-scoped equipment identity is acceptable for now (the same physical unit may be registered separately by two technicians; see Blockers).
- [ ] Confirm the 25 MiB size limit and the image MIME allowlist on `hpr_evidence_storage_objects`.
- [ ] Confirm `client_captured_at` future tolerance (5 min) for field clock skew.
- [ ] Decide who runs `hpr_technicians` enrollment, and the audit record for enrollment changes (currently mutable `status`, no history table).
- [ ] Verify against real Supabase (PostgREST + GoTrue) that column-level INSERT grants behave as in the PGlite tests. PostgREST `upsert`/`on conflict` paths need UPDATE, which is intentionally not granted.
- [ ] Do not apply to production in this PR. No deployment is requested.

## Explicit non-claims
No verification, calibration attestation, trusted timestamp, digital
signature, DDD, admission, intervention or physical-control capability is
created or implied. The Refrigerant Governor is untouched.
