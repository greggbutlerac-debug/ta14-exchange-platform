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
| `hpr_equipment` | table | **Provisional**, technician-scoped equipment identity (`identity_scope = TECHNICIAN_PROVISIONAL`). Append-only. Not canonical (D5). |
| `hpr_inspections` | table | One technician inspection of one equipment item. Append-only. `verification_status='UNVERIFIED'`, `ddd_status='LOCKED'`, `intervention_authorization='NONE'` are CHECK-constrained constants. |
| `hpr_evidence_submissions` | table | Individual evidence items (PHOTO / MEASUREMENT / OBSERVATION) per canonical step. Append-only; always `UNVERIFIED`; corrections are superseding rows. |
| `hpr_evidence_storage_objects` | table | Server-**declared** storage reference (digest/size/MIME) for PHOTO evidence; `reconciliation_status = UNRECONCILED`. Not verified integrity (D1). |
| `hpr_evidence_current` | view (`security_invoker`) | Submissions with no superseding successor, plus `storage_state` (`NOT_APPLICABLE` / `STORAGE_PENDING` / `DECLARED_UNRECONCILED`) (D4). |
| `hpr_declare_evidence_storage_object(uuid,text,bigint,text)` | function, SECURITY DEFINER | Records a server-declared reference; derives the object path; `service_role` only. Does not prove the object exists or the digest matches bytes. |
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
4. **Append-only for controlled application roles.** UPDATE/DELETE/TRUNCATE
   are not granted to `anon`, `authenticated` or `service_role`, and triggers
   reject them for any DML caller while the triggers are in place.
   **Not absolute:** a privileged PostgreSQL owner or superuser can disable or
   drop triggers. A test demonstrates this, and the protection against it is
   procedural (D3). Technician enrollment status is the only mutable HPR row,
   and only `service_role` can change it.
5. **Always UNVERIFIED.** CHECK constraints make `UNVERIFIED` the only legal
   value. Future verification must be a separate record written by an
   independent verifier, never a change to technician evidence.
6. **Integrity is declared, not verified.** `client_declared_sha256` is a
   client claim. `server_declared_sha256` is a claim by a `service_role`
   caller. The database cannot prove that the object exists or that the
   digest was computed over its bytes, so every row is `UNRECONCILED`.
   Reconciliation must be a separate append-only record (D1). The object path
   is derived, and a second declaration for the same submission is rejected.
   A PHOTO with no declaration is `STORAGE_PENDING` and incomplete (D4).
7. **Default privileges.** Supabase grants ALL on new `public` tables and
   functions to `anon`, `authenticated` and `service_role`, and Postgres grants
   EXECUTE to PUBLIC. Every `hpr_*` function, including trigger functions, is
   revoked from all four, then minimally re-granted. The exact matrices are
   asserted by tests and by
   `supabase/verification/verify_hpr_field_evidence_privileges.sql` (D2).
   The PGlite tests are **not** proof of production authorization.

## Migration review requirements (before any non-local execution)
- [ ] Independent review (Atlas) of RLS policies, grants and SECURITY DEFINER functions (`search_path = ''` is set on all of them).
- [ ] Apply to a Supabase **branch / preview project** only. Run `supabase/verification/verify_hpr_field_evidence_privileges.sql` (sections 1–6 must return 0 rows) and the security and performance advisors.
- [ ] Exercise PostgREST + GoTrue with real tokens per the D2 checklist in `docs/hvac-performance-record/FIELD-EVIDENCE-OPEN-DEPENDENCIES.md`.
- [ ] Retention / erasure decision (D3, owner + legal). Current fail-closed default is `on delete restrict`. Recommended: a pseudonymous principal plus an erasable mapping, before any production data exists.
- [ ] Accept technician-scoped equipment identity as **provisional** only. A canonical identity / link / custody model (D5) is required before multi-technician lifetime history.
- [ ] Confirm the 25 MiB size limit and the image MIME allowlist on `hpr_evidence_storage_objects`.
- [ ] Confirm `client_captured_at` future tolerance (5 min) for field clock skew.
- [ ] Decide who runs `hpr_technicians` enrollment, and the audit record for enrollment changes (currently mutable `status`, no history table).
- [ ] Do not apply to production in this PR. No deployment is requested.

## Explicit non-claims
No verification, reconciliation, calibration attestation, trusted timestamp,
digital signature, DDD, admission, intervention or physical-control
capability is created or implied. Append-only is not claimed against
privileged database owners. The Refrigerant Governor is untouched.
