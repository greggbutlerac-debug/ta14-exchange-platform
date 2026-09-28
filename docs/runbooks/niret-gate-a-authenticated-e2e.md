# NIRET Gate A — authenticated end-to-end run (owner-operated)

Purpose: exercise the real technician workflow in a browser against the real Supabase project, with real accounts. No session is fabricated and authentication is not relaxed. Record each result (receipt JSON and `receipt_hash`) as run evidence.

## Preconditions (owner)

1. Apply the migration `supabase/migrations/20260928120000_niret_certification_verifications.sql` to the target Supabase project. It needs owner approval. It creates three tables:
   - `ta14_niret_certification_verifiers` (roster; service-role writes only);
   - `ta14_niret_certification_verifications` (append-only);
   - `ta14_niret_certification_revocations` (append-only).
2. Make sure the deployment has `NEXT_PUBLIC_SUPABASE_URL` and the publishable key configured.
3. Set up two distinct real accounts:
   - **T**, the technician;
   - **V**, the verifier. V must not be T.
4. Appoint V. This is an owner/service-role act, done in the SQL editor:
   ```sql
   insert into public.ta14_niret_certification_verifiers (verifier_account_id, appointed_by)
   values ('<V uuid>', '<owner name / authority reference>');
   ```
5. V checks T's EPA 608 credential with its issuing organization. Then, signed in as V (RLS applies), V records the result:
   ```sql
   insert into public.ta14_niret_certification_verifications
     (technician_account_id, technician_identity, certification_type, certificate_ref, holder_name,
      issuing_organization, method, evidence_reference, evidence_sha256, verifier_account_id)
   values ('<T uuid>', '<exact technician ID T will enter>', 'UNIVERSAL', '<exact certificate number>',
           '<holder name>', '<issuing organization>', 'ISSUER_RECORD_LOOKUP', '<issuer lookup reference>',
           null, '<V uuid>');
   ```
   The insert is refused if V is T, if V is not an appointed verifier, or if V is retired. `verified_at` is stamped by the server.

## Known limit

Technical ALLOW cannot occur in production until a governed OEM system binding is VERIFIED and pinned. The shipped registry is empty. So a production run today shows technical HOLD with `OEM_REFERENCE_NOT_VERIFIED`, or a governed-record status of NO_RECORD. The technical-ALLOW scenarios below become runnable only after an owner-approved binding is registered, together with equipment whose nameplate exactly matches that binding.

## Scenarios

Sign in as T at `/academy/hvac/niret`. For every scenario, confirm `gate_b_authorized: false` in the receipt.

| # | Setup | Expected |
|---|---|---|
| 0 | Signed out, POST `/api/niret/gate-a/evaluate` | 401 |
| 1 | Complete evidence; certificate exactly as V recorded it | Technical ALLOW; execution ALLOW; "PRESSURE-INSTRUMENT ENTRY: AUTHORIZED — pressure evidence only"; `certification_status.verification_status` VERIFIED, with verifier `NIRET-CERT-VERIFIER:<V uuid>` (requires a verified binding) |
| 2 | As 1, but the certificate number differs by one character, case or whitespace | Execution HOLD `CERTIFICATION_NOT_VERIFIED`; entry NOT AUTHORIZED |
| 3 | As 1, after V inserts a revocation for the verification | Execution HOLD `CERTIFICATION_NOT_VERIFIED` |
| 4 | Airflow missing, or its uncertainty straddles the OEM range | Technical HOLD |
| 5 | Run time below the OEM minimum, or outdoor temperature outside the OEM envelope | Technical HOLD |
| 6 | Non-invasive indicator within the OEM criterion | DENY |
| 7 | Refrigerant R-32 (A2L), or hazard "beyond competence" | ESCALATE |
| 8 | Signed in as V, evaluating V's own declared certificate | Not verified (no self-verification) |

The same scenarios run automatically, through the production server path with the synthetic OEM registry, in `tests/acceptance/niret-execution-authority.spec.ts`.
