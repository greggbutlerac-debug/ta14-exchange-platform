# HPR Field Evidence — Open Dependencies and Fail-Closed Safeguards

Status: DESIGN RECORD for PR #704 (increment 1, schema + RLS). Nothing here is
deployed. Migration `20261116200000_hpr_field_evidence_foundation.sql` has not
been executed in any Supabase project.

Responds to Atlas independent review, 2026-11-16 (findings 1–5 → D1–D5).

Governance boundary (unchanged): Technician collects evidence → Independent
verifier establishes verification → HVAC Analyzer issues the DDD → Separate
execution authority governs intervention. The Refrigerant Governor stays
independent and fail-closed. No part of this PR creates verification, a DDD,
admission, intervention or physical-control capability.

| # | Finding | Status in #704 | Blocks |
|---|---|---|---|
| D1 | Storage reference is a caller declaration | **Addressed in schema**: renamed to declaration semantics, `UNRECONCILED` constant, contract comments. Upload/reconciliation design below. | Increment 2 (upload) |
| D2 | Default EXECUTE grants; PGlite is not production proof | **Addressed in tests**: exact grant audit + read-only preview script. **Unresolved**: Supabase preview run. | Any deployment |
| D3 | `ON DELETE RESTRICT` vs retention/privacy; immutability claims | **Claims corrected**; limit demonstrated in a test. **Unresolved**: retention/erasure decision. | Production |
| D4 | Photo without a stored object | **Addressed in schema**: `storage_state = STORAGE_PENDING`; recovery by supersession only. Orphan design below. | Increment 2 |
| D5 | Per-technician equipment identity | **Declared provisional** (`identity_scope = TECHNICIAN_PROVISIONAL`). Canonical identity model below. | Multi-technician lifetime history |

---

## D1 — Storage reference contract

**What `hpr_declare_evidence_storage_object()` does:** records a digest, size
and MIME type *declared* by a `service_role` caller, and derives the object
path `{technician}/{inspection}/{submission}/original` from the submission row.

**What it does not do:** it does not prove that an object exists at that path,
that the bytes match the declared digest, size or MIME type, or that the
server computed the digest over the bytes it stored. `service_role` permission
shows only that a server-side caller made the declaration.

**Safeguards now in the schema:**
- Column names: `server_declared_sha256`, `declared_byte_size`,
  `declared_content_type`, `declared_at`.
- `reconciliation_status` is CHECK-constrained to `'UNRECONCILED'`. No grant
  allows any role to change it.
- Table and function comments state that the reference is not verified
  integrity.
- Tests: a declaration succeeds even though no object exists (which is the
  point of the test), and no role can mark a row reconciled.

**Increment 2 upload path (design, not implemented):**
1. Authenticate from the cookie session (`auth.getUser()`, server-side).
   Ignore any client `technicianId`.
2. Confirm the caller owns the target PHOTO submission and that it is
   `STORAGE_PENDING`.
3. Stream the request body. Compute SHA-256 and byte count while streaming,
   enforce the size limit, and sniff the MIME type from magic bytes rather
   than trusting the header.
4. Write the object to the private bucket at the derived path with
   `upsert: false` (no overwrite).
5. Call `hpr_declare_evidence_storage_object` as `service_role`.
6. **Failure handling (fail-closed):**
   - *Object write fails:* no DB row is written, and the submission stays
     `STORAGE_PENDING`.
   - *Object written, DB write fails:* the object is an orphan (see D4). It is
     never deleted or overwritten inline, and it stays invisible to readers
     because no reference exists.
   - *Object already exists at the path:* reject. Do not overwrite.
7. **Reconciliation (separate later increment):** an independent job re-reads
   the stored bytes, re-hashes them, and compares against the declaration.
   It appends a row to a new `hpr_evidence_storage_reconciliations` table
   (append-only; recording reconciler identity, observed digest, size, result
   and time). It never updates the declaration row. Only a matching
   reconciliation could later be offered to an independent verifier.
   Reconciliation is still not verification.

## D2 — Privilege audit and production proof

**Done in #704:**
- Every `hpr_*` function, including trigger functions, has an explicit
  `REVOKE ALL ... FROM public, anon, authenticated, service_role`, followed by
  a minimal grant. The default Supabase `service_role` grant on
  `hpr_is_active_technician()` is now revoked as well.
- A test enumerates every `hpr_*` function and asserts the exact EXECUTE
  matrix: no PUBLIC grant, `authenticated` only on `hpr_is_active_technician`,
  and `service_role` only on `hpr_declare_evidence_storage_object`. The test
  fails if a new function is added without being reviewed.
- Tests assert that every SECURITY DEFINER function pins
  `search_path = ''`, and that the table- and column-level privilege matrices
  are exact.
- `supabase/verification/verify_hpr_field_evidence_privileges.sql` is
  read-only and returns zero rows when correct. The test suite runs it in
  PGlite, so the preview script and the tests cannot drift.

**Unresolved (must be done before any deployment; needs a project owner):**
- [ ] Create a Supabase branch or preview project and apply the migration
      there only.
- [ ] Run the verification script. Every section except 7 must return 0 rows.
- [ ] Run the Supabase security and performance advisors, and record the
      results on the PR.
- [ ] Exercise PostgREST with real GoTrue tokens (two technicians, one
      unenrolled user, anon):
      - insert with `technician_user_id` in the body → 401/403
      - cross-technician `select` → empty
      - `PATCH`/`DELETE` → denied
      - `upsert` → denied (no UPDATE grant)
      - `rpc/hpr_declare_evidence_storage_object` with a user JWT → denied
- [ ] Confirm in the preview that column-level INSERT grants behave as they
      do in PGlite through PostgREST (including the `Prefer: return=representation`
      round-trip, which requires SELECT).

PGlite reproduces Postgres RLS, grants and triggers, and the Supabase default
privileges and `auth.uid()` definition. It does **not** reproduce PostgREST,
GoTrue JWT verification or `storage.*`. The PGlite suite is not proof of
production authorization.

## D3 — Retention, erasure, and the limits of append-only

**Claims corrected.** Append-only is enforced against the controlled
application roles (`anon`, `authenticated`, `service_role`) by missing grants
and by triggers. A privileged PostgreSQL owner or superuser can disable or drop
triggers, change grants or run DDL. A test now shows this: the owner disables
the trigger and rewrites a row inside a rolled-back transaction, while
`authenticated` and `service_role` get `must be owner`. Protection against
that actor is procedural (restricted owner credentials, reviewed migrations,
audit logs, and detection with `verify_hpr_field_evidence_privileges.sql`
section 6) and is not claimed by the schema.

**`auth.users ON DELETE RESTRICT`.** Kept for #704 as the fail-closed default:
deleting an account cannot silently cascade away evidence. The consequence is
that a technician with evidence cannot be hard-deleted through Supabase Auth.

**Decision required (owner + legal), before production:**

| Option | Effect |
|---|---|
| A. Keep RESTRICT, and handle erasure requests by disabling login and scrubbing PII in `auth.users` | Simple. Attribution stays tied to `auth.users.id`. Retention justification must be documented. |
| B. Introduce a pseudonymous `hpr_principals` identity; evidence references the principal, and a separate erasable mapping table links principal → `auth.users` | Evidence and attribution survive erasure of PII. Requires a schema change before any production data exists, which is cheapest now. |
| C. CASCADE delete | **Rejected.** It contradicts append-only evidence and allows evidence to be destroyed after an adverse result. |

Recommendation: **B**, decided before production. It needs a retention
schedule (statutory or contractual period), a lawful basis, and a documented
disposition process that records the disposition as an event rather than
erasing it silently.

## D4 — Photo submission without a stored object

- `hpr_evidence_current.storage_state` is one of `NOT_APPLICABLE`,
  `STORAGE_PENDING` or `DECLARED_UNRECONCILED`. No value means complete,
  verified, reconciled or admissible, and a test asserts that the view
  defines no such state.
- **Rule for future admission:** a step whose current PHOTO evidence is
  `STORAGE_PENDING` or `DECLARED_UNRECONCILED` cannot satisfy production
  admission. Only a future reconciled state, *plus* independent verification
  receipts, may be considered. Admission is non-operational today:
  `PRODUCTION_ADMISSION_OPERATIONAL = false` (asserted in the tests).
- **Recovery without overwrite:**
  - *DB row with no object (upload never completed):* the upload may be
    retried for the same submission while it is still `STORAGE_PENDING` (the
    path is single-write). Alternatively the technician records a superseding
    submission with a reason (for example `UPLOAD_FAILED`). The pending row is
    never deleted, and its history stays visible. Both paths are tested.
  - *Object with no DB row (orphan):* a reconciliation job (increment 2 or 3)
    lists bucket paths with no reference. For each one it records an
    append-only orphan event, then either
    (a) declares it after re-hashing the *actual* bytes, if the submission is
    still `STORAGE_PENDING` and the bytes pass the checks, or
    (b) moves it to a quarantine prefix under the retention policy. It never
    overwrites, and never silently deletes.
  - Stale `STORAGE_PENDING` rows are reported (verification script section 7),
    not auto-removed.

## D5 — Equipment identity

The current identity is **intentionally provisional**. Every `hpr_equipment` row
carries `identity_scope = 'TECHNICIAN_PROVISIONAL'` (CHECK-constrained and not
writable by clients). Two technicians who inspect the same unit create two
rows, and a test asserts exactly that. A provisional row is **not** a lifetime
equipment record.

**Required before any multi-technician lifetime history (future model):**
- `hpr_canonical_equipment`: an identity owned by a separate identity authority
  (not technicians), keyed by verified manufacturer + serial, with a site
  binding.
- `hpr_equipment_identity_links`: append-only, attributable claims that a
  provisional row refers to a canonical unit. They carry evidence and a link
  authority, and corrections use supersession.
- `hpr_equipment_custody_events`: append-only site, owner and servicing
  transfers. A transfer never rewrites prior history.
- Technicians can *propose* links but cannot assert canonical identity.
  Disputes stay as open, competing claims until the identity authority
  resolves them.

This is a dependency, not part of #704.
