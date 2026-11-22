# HPR Increment 2 — Private Photo Upload, Server Hashing, Append-Only Reconciliation

Status: DESIGN RECORD for issue #730, stacked on PR #704. It has been executed
only on an isolated local Supabase stack and has not been applied to any hosted
project. The upload route is **disabled by default** (`HPR_PHOTO_UPLOAD_ENABLED`
must equal `true`), and no deployment enables it.

Governance boundary (unchanged): Technician collects evidence → Independent
verifier establishes verification → HVAC Analyzer issues the DDD → Separate
execution authority governs intervention. Every record stays `UNVERIFIED`.
`ddd_status` stays `LOCKED`, `intervention_authorization` stays `NONE`, and
`PRODUCTION_ADMISSION_OPERATIONAL === false`. The Refrigerant Governor is not
touched.

## 1. What each state does and does not prove

| State (`hpr_evidence_photo_integrity.photo_integrity_state`) | Meaning | Does **not** mean |
|---|---|---|
| `STORAGE_PENDING` | PHOTO submission with no declaration | anything about bytes |
| `DECLARED_UNRECONCILED` | The server streamed the bytes, hashed them, stored them at the derived path with no overwrite, and the database confirmed that an object row exists with the same size and MIME type | that the bytes are still intact, or that any independent party observed them |
| `RECONCILED_MATCH` | A later service read of the stored bytes recomputed the same SHA-256 and size, and no failure was ever recorded | independent verification, authenticity of the scene, correctness of the HVAC work, admission, or permission to act |
| `RECONCILIATION_INCONCLUSIVE` | The latest reconciliation could not read the bytes (for example, Storage returned HTTP 500) | that the object is fine, or that it is missing |
| `RECONCILIATION_FAILED` | At least one `DIGEST_MISMATCH`, `SIZE_MISMATCH` or `OBJECT_ABSENT` was recorded. This state is sticky: a later MATCH does not clear it | which copy is "right". It needs human review |

**Declared vs reconciled.** A declaration (`hpr_evidence_storage_objects`, #704
table, still `UNRECONCILED`) is the uploader's claim. A reconciliation
(`hpr_evidence_storage_reconciliations`) is a separate append-only
observation, made later by re-reading the stored bytes. The database computes
the result from the declaration. The caller cannot supply a result, and
reconciliation never updates the declaration.

**Trust boundary of reconciliation.** The reconciler runs with `service_role`,
which is the **same trust domain as the uploader**. A MATCH shows that the bytes
held by Storage still hash to the digest the service declared. It does not
defend against a compromised service credential that uploads wrong bytes in
the first place, and it does not prove who took the photograph or what it
depicts. An independent verifier authority, with its own identity and records,
is a later and separate increment.

## 2. Upload path (`PUT /api/hpr/evidence/{submissionId}/photo`)

The route body is the raw image bytes. The request must carry
`Content-Type` (`image/jpeg|png|heic|webp`) and `X-HPR-Upload-Nonce` (a fresh
UUID for each request).

1. **Gate.** The route returns 503 unless `HPR_PHOTO_UPLOAD_ENABLED=true`. The
   service credential is never loaded for a disabled or unauthenticated
   request.
2. **Authenticate.** The route reads the Supabase cookie session through
   `@supabase/ssr` and calls `auth.getUser()`, so the token is verified by
   Supabase Auth. Any `Authorization` header, `technicianId`, object path,
   content-type claim or digest header from the client is ignored. A missing
   or forged session gets 401.
3. **Pre-body checks.** The submission id must be a UUID. The MIME header must
   be on the allowlist. `Content-Length` must be at most 25 MiB, and the nonce
   is required.
4. **Open attempt (as the user).** The route calls
   `hpr_open_photo_upload_attempt` with the user's JWT, so `auth.uid()` is the
   identity. The function checks, in order:
   - the caller is an active enrolled technician;
   - the caller owns the submission and its inspection (the error is the same
     for "absent" and "not yours");
   - `kind = PHOTO`;
   - the submission is not superseded;
   - it is not already declared;
   - no undeclared object exists at the path;
   - no attempt is already open (serialized with an advisory lock);
   - the nonce has not been used (`HPR_UPLOAD_REPLAY`).

   The database derives `{technician}/{inspection}/{submission}/original` and
   opens a 15-minute lease.
5. **Stream and hash.** The route computes SHA-256 over the exact bytes it
   receives. It aborts as soon as more than 25 MiB (26,214,400 bytes) arrive,
   so an oversized body is never fully buffered. A short body, an aborted
   stream, or a `Content-Length` mismatch is a partial upload.
6. **Content signature.** The magic bytes must identify the declared type. The
   file must also be structurally complete: JPEG must end with EOI, PNG with
   IEND, WebP's RIFF length must equal the file size, and HEIF's top-level
   boxes must tile the file. This is a plausibility check; the image is not
   decoded.
7. **Client digest.** If the submission row has `client_declared_sha256`, it
   must equal the server digest. This is checked before anything is stored.
   The value comes from the database, not from the request.
8. **Single-write object.** The route stores the bytes as `service_role` with
   `upsert: false` at the derived path.
9. **Declare.** The route calls `hpr_complete_photo_upload_attempt` as
   `service_role`. The database re-checks the attempt lease and confirms that
   no outcome exists yet. It also confirms that the `storage.objects` row exists
   and that its `metadata.size` and `metadata.mimetype` equal the
   server-streamed values. It then inserts the #704 declaration (still
   `UNRECONCILED`) and a `DECLARED` outcome.
10. Every failure after step 4 appends a `REJECTED` or `FAILED` outcome with a
    reason code, the observed digest and size where known, and
    `object_may_exist`. Nothing is deleted.

**Direct declaration is closed.** Increment 2 revokes `service_role` EXECUTE on
#704's `hpr_declare_evidence_storage_object`, without editing #704's migration.
A declaration now requires a completed attempt and an existing object.

## 3. Storage boundary

- The bucket `hpr-field-evidence-private` has `public = false`, a 25 MiB
  limit, and MIME types limited to jpeg, png, heic and webp. It is created by a
  plain insert, so the migration fails rather than adopting an existing bucket
  with other settings.
- **storage.objects RLS.** The only client policy for this bucket is SELECT for
  `authenticated`. It applies only to an original whose path starts with the
  caller's uid **and** that has a declaration for a submission the caller owns.
  Orphans are not readable. There are no client INSERT, UPDATE or DELETE
  policies.
- **Guard trigger `hpr_private_photo_object_guard`** on `storage.objects`. For
  this bucket it rejects UPDATE, which covers upsert-overwrite, `update()`,
  `move()` and metadata rewrites. It also rejects DELETE, moves into the
  bucket, and inserts at any path that is not `{uuid}/{uuid}/{uuid}/original`.
  The guard applies to `service_role` too, which bypasses RLS. A test confirms
  on the real Storage API that a rejected overwrite leaves the original bytes
  unchanged.
- **Limit.** A PostgreSQL owner can disable the trigger, and anyone with
  backend (S3/file) access can alter bytes without touching Postgres.
  Reconciliation detects the latter: the local test rewrites one byte in the
  Storage volume and gets `DIGEST_MISMATCH`. Hosted Supabase may restrict
  triggers on `storage.objects`. **This must be confirmed on a preview project
  before any deployment.** If it is not permitted, overwrite protection
  against a service credential would rest on `upsert: false` and procedure
  alone.

## 4. Storage consistency model and failure modes

Storage bytes and Postgres rows are not written in one transaction. The order
is: **attempt row → bytes → declaration**. Every intermediate state is
recorded and fails closed.

| Failure | Result | Recovery |
|---|---|---|
| Forged, expired or missing session | 401; no attempt | sign in |
| Unenrolled or suspended technician, or another technician's submission | 403; no attempt | none (by design) |
| Oversized or partial body, MIME or signature mismatch, truncation, client digest mismatch | `REJECTED` outcome; nothing stored; stays `STORAGE_PENDING` | retry with a new nonce |
| Replayed nonce | 409 `HPR_UPLOAD_REPLAY` | none |
| Concurrent upload for the same submission | 409 `HPR_UPLOAD_IN_PROGRESS`; only one can finalize | none needed |
| Object already exists (`upsert: false`) | `REJECTED HPR_OBJECT_EXISTS`; the existing bytes are untouched | see orphan |
| Ambiguous storage error (timeout, reset) | `FAILED`, `object_may_exist = true` | retry; the orphan job resolves any stray object |
| Object written, declaration failed (DB outage, lease expired, size or MIME disagreement) | `FAILED`, `object_may_exist = true`; the object is an **orphan**; stays `STORAGE_PENDING` | the next attempt is refused (`HPR_OBJECT_ORPHANED`); record a **superseding** PHOTO submission (new id, new path) |
| Process crash after the attempt opened | Attempt left without an outcome; the lease expires in 15 minutes | retry after the lease; verification SQL section 7 counts these |

**Orphans (objects without a declaration).**
`hpr_list_storage_orphans()` and `hpr_record_storage_orphan()` (service_role)
append a record with `disposition = QUARANTINED_RETAINED`, linked to the last
attempt for that path. This is **logical quarantine**: the object is never
moved (moving it would be a rewrite, and the guard forbids it), never
overwritten, never adopted as evidence automatically, never readable by the
technician, and never deleted. Physical disposal waits for the retention
decision (D3), and disposal must itself be a recorded event.

**Reconciliation results.** A definite not-found, or a missing metadata row,
records `OBJECT_ABSENT` (sticky failure). Any other read error records
`READ_FAILED` (inconclusive, never a match). Storage v1.96 answers **HTTP 500**
when the metadata row exists but the backend bytes are missing, so this case
cannot be told apart from a transient fault. It is recorded so that it stays
visible.

## 5. Upload size limits

- 25 MiB (26,214,400 bytes) is enforced four times: by the #704 CHECK on
  `declared_byte_size`, by the bucket `file_size_limit`, by the route before
  the body (`Content-Length`), and by the route while streaming. The exact
  limit is accepted and limit + 1 is rejected (tested on the local stack
  without `Content-Length`).
- The route buffers at most 25 MiB in memory for each request after hashing.
- **Hosting blocker.** Vercel Functions reject request bodies larger than
  4.5 MB at the platform edge. On the current hosting, photos over about
  4.5 MB could not reach this route. Before deployment, an owner decision is
  needed between two options. One is a non-Vercel upload host. The other is a
  two-phase design: the client uploads to a quarantined staging location via a
  short-lived signed URL, then the server re-reads the bytes, hashes them, and
  copies them to the derived path. That second design needs its own threat
  review, because the client then writes bytes the server did not stream.

## 6. Open dependencies (unchanged by this increment)

- **Retention and account erasure (D3).** The `auth.users` FKs on the new
  tables are `ON DELETE RESTRICT`, like #704. Photographs are personal data
  where people or addresses are visible. The recommended option is still a
  pseudonymous principal with an erasable mapping, plus a retention schedule
  and recorded disposition events (including for quarantined orphans). An
  owner and legal decision is required before production.
- **Canonical equipment identity (D5).** Photographs attach to provisional,
  technician-scoped equipment. They are not a lifetime equipment record.
- **Legacy migration collisions (#723, D6).** Full-history apply is still
  blocked. Increment 2 is verified in `hpr-only` mode: the #704 migration plus
  this one, both with unique 14-digit versions, depending only on `auth.*`,
  `storage.*` and #704. No remote migration history is changed.
- **Independent verifier authority.** Nothing here can produce `VERIFIED`.
- **Hosted confirmation.** The checks to run on a hosted project are the
  `storage.objects` trigger permission (above), the advisors, the
  verification SQL, and the absence of any pre-existing non-bucket-scoped
  client write policies on `storage.objects`. The last one is what section
  3b of `verify_hpr_photo_reconciliation_privileges.sql` reports.

## 7. Local verification: EXECUTED 2026-11-22, PASS (hpr-only)

This is local evidence only, not production proof. The run used Colima on
Docker server 29.5.2, Supabase CLI 3.2.0 and storage-api v1.96.0, with an
unlinked scratch project, loopback endpoints, and zero credential env vars
present. Log: `verification-logs/2026-11-22-local-supabase-verify-hpr-increment2.log`
(redacted; the credential scan passed).

| Step | Observed |
|---|---|
| Migration history | `20261116200000` then `20261122120000`, applied cleanly |
| Increment-2 verification SQL | sections 1–6: 0 rows (before and after the adversarial tests) |
| #704 verification SQL, sections 2–6 | 0 rows |
| `db lint` | no schema errors |
| Advisors | 1 INFO security finding: `rls_enabled_no_policy` on `hpr_storage_orphan_records`. This is intended: the table is service_role-only and clients are denied. The rest are INFO performance findings: unused indexes on a fresh DB, and an unindexed FK `last_attempt_id` that is review-only |
| Real GoTrue/PostgREST/Storage suites | 25/25 passed (11 from #704, including the loopback guard; 14 from increment 2, including the 2 backend-tampering cases) |
| PGlite mutation check | 16/16 migration weakenings detected |
