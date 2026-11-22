# Impact — 20261122120000_hpr_private_photo_reconciliation.sql

Issue #730, stacked on PR #704 (`20261116200000_hpr_field_evidence_foundation.sql`,
which is not modified). Executed only on an isolated local Supabase stack, in
`hpr-only` mode. **Not applied to any hosted project.** Design record:
`docs/hvac-performance-record/PHOTO-UPLOAD-RECONCILIATION.md`.

## Objects

| Object | Kind | Access |
|---|---|---|
| `storage.buckets` row `hpr-field-evidence-private` | private bucket, 25 MiB, jpeg/png/heic/webp | plain insert (fails if the bucket exists) |
| policy `HPR technicians read their own declared photo originals` on `storage.objects` | SELECT | `authenticated`: own uid prefix **and** declared for an owned submission |
| `hpr_guard_private_photo_object()` + trigger `hpr_private_photo_object_guard` on `storage.objects` | BEFORE INSERT/UPDATE/DELETE row trigger | for this bucket, rejects UPDATE, DELETE, move-in and non-derived paths. Applies to every role, including `service_role`. Other buckets are unaffected |
| `hpr_photo_upload_attempts` | append-only table | SELECT own (`authenticated`), `service_role` |
| `hpr_photo_upload_outcomes` | append-only table, one row per attempt | SELECT own, `service_role` |
| `hpr_evidence_storage_reconciliations` | append-only table, always `UNVERIFIED` | SELECT own, `service_role` |
| `hpr_storage_orphan_records` | append-only table, `QUARANTINED_RETAINED` | `service_role` SELECT only |
| `hpr_evidence_photo_integrity` | `security_invoker` view | SELECT `authenticated`, `service_role` |
| `hpr_open_photo_upload_attempt(uuid, uuid)` | SECURITY DEFINER | EXECUTE `authenticated` |
| `hpr_complete_photo_upload_attempt(uuid, text, bigint, text)` | SECURITY DEFINER | EXECUTE `service_role` |
| `hpr_record_photo_upload_failure(...)` | SECURITY DEFINER | EXECUTE `service_role` |
| `hpr_record_storage_reconciliation(...)` | SECURITY DEFINER | EXECUTE `service_role` |
| `hpr_list_storage_orphans()`, `hpr_record_storage_orphan(text, text)` | SECURITY DEFINER | EXECUTE `service_role` |
| `hpr_request_api_role()` | SECURITY DEFINER helper | nobody |
| `hpr_declare_evidence_storage_object` (#704) | **EXECUTE revoked from `service_role`** | nobody (declaration only via a completed attempt) |

Every SECURITY DEFINER function pins `search_path = ''`. The Supabase default
privileges are revoked on every new object and re-granted minimally. No
INSERT, UPDATE, DELETE or TRUNCATE is granted on the new tables to any API
role.

## Changes in behavior relative to #704

- `service_role` can no longer call `hpr_declare_evidence_storage_object`
  directly. #704's local Supabase test detects increment 2 and asserts the
  denial instead.
- #704's `verify_hpr_field_evidence_privileges.sql` section 1 (exact EXECUTE
  matrix) is superseded by section 1 of
  `supabase/verification/verify_hpr_photo_reconciliation_privileges.sql`.
  #704's sections 2–7 still apply and still return zero findings.
- The #704 view `hpr_evidence_current` is unchanged.

## Migration review checklist

- [ ] Independent review of the storage RLS policy, the guard trigger, the
      grants, and the SECURITY DEFINER bodies.
- [ ] **Hosted:** confirm the migration role may create a trigger on
      `storage.objects`. If it may not, record that the overwrite and delete
      protection against `service_role` is procedural only.
- [ ] **Hosted:** run both verification files. Section 3b lists any existing
      non-bucket-scoped client write policy on `storage.objects` that could
      admit writes into this bucket.
- [ ] Advisors on a preview project (local: 0 security findings).
- [ ] Retention and erasure decision (D3) covering photographs and quarantined
      orphans.
- [ ] Hosting body-size limit decision (Vercel 4.5 MB vs 25 MiB).
- [ ] Do not enable `HPR_PHOTO_UPLOAD_ENABLED` in any deployment before the
      above.

## Rollback

Not applicable while the migration is unapplied. After any future
application, do not drop the append-only tables or the bucket. They hold
governed evidence. Disable the route with `HPR_PHOTO_UPLOAD_ENABLED` instead.
