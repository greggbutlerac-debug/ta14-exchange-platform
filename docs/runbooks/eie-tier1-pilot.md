# TA-14 EIE — Tier 1 pilot activation runbook (owner-operated)

Path under test: real manual-instrument observation → Node → Recorder → sealed INTACT window → s09 adapter →
real C1-R7 evaluation → attributable Gate A receipt. **A HOLD receipt is a successful Tier 1 outcome.** Do not
tune anything to obtain ALLOW. Tier 2 is prohibited. No pressure-evidence window, Gate B or Governor step exists
in the pilot surface.

Nothing below has been executed. Each step is a human, external or owner act.

## 0. Preconditions (owner decisions already made)
- P1 = 1b (committed baseline), P2 = Option A (Cloud KMS, Ed25519, SOFTWARE protection, pilot only),
  P3 = 3b (independent RFC 3161 TSA), P4 = 4a (local-only pilot page/API behind flag + project allowlist).

## 1. Isolated pilot Supabase project
1. Create a **new** Supabase project used for nothing else. Record its project reference.
2. Confirm it is not the production project (different reference, different URL, no production data).
3. Take a `pg_dump` snapshot before each migration below. Rollback = restore the snapshot or delete the pilot project.
4. Apply, in order, **to the pilot project only**:
   1. `20260928120000_niret_certification_verifications.sql`
   2. `20260928130000_ta14_eie_evidence_windows.sql`
   3. `20260929090000_ta14_eie_pilot_key_record.sql`
   4. `20260929090100_ta14_eie_witness_checkpoints.sql`
   5. `20260929090200_ta14_eie_asset_identity.sql`
   6. `20260929090300_ta14_eie_instrument_register.sql`

## 2. Roles (owner, SQL editor, service role)
```sql
insert into public.ta14_eie_pilot_role_assignments (role, account_id, appointed_by)
values ('TA-14 GOVERNANCE OWNER', '<owner account uuid>', 'TA-14 Governance Owner'),
       ('TA-14 RECORD INTEGRITY CUSTODIAN', '<custodian account uuid>', 'TA-14 Governance Owner');
```
The custodian occupant must be named before step 3. Also follow `niret-gate-a-authenticated-e2e.md` steps 3–5:
appoint the certification verifier V (V ≠ technician T) and record T's issuer-checked EPA 608 verification.

## 3. Recorder seal key (custodian)
1. In a pilot-only GCP project: create a key ring and an asymmetric-sign key, algorithm `EC_SIGN_ED25519`
   (protection level SOFTWARE; Cloud KMS offers Ed25519 at SOFTWARE only). The key is non-exportable.
2. Grant the pilot host's service identity **only** `cloudkms.cryptoKeyVersions.useToSign` (and public-key read)
   on that key version. The custodian keeps rotate/disable, never sign.
3. `node scripts/eie-pilot/describe-kms-key.mjs <cryptoKeyVersion> TA14-EIE-PILOT-REC-0001 <custodian uuid>`
   prints the REGISTERED event (public key, SHA-256, protection level as KMS reports it).
4. Insert events (service role), in order: REGISTERED (custodian) → APPROVED (Governance Owner, with the
   registration hash) → ACTIVATED (custodian):
```sql
insert into public.ta14_eie_recorder_key_events (key_id, event_type, actor_role, actor_account_id, event)
values ('TA14-EIE-PILOT-REC-0001', 'REGISTERED', 'TA-14 RECORD INTEGRITY CUSTODIAN', '<custodian uuid>', '<event json>'::jsonb);
```
   Rotation later: register a new key id with `supersedes`, activate it, RETIRE the old one. Never delete.

## 4. Timestamp authority (P3 = 3b)
1. Choose the TSA (an established certificate authority's RFC 3161 service) and confirm its terms of use.
2. Save its root certificate chain (PEM) on the pilot host; pin it via `TA14_EIE_PILOT_TSA_TRUST_ANCHORS_FILE`.

## 5. Continuity profile (five-stage model)
1. The Governance Owner completes `docs/eie/pilot/TA14-EIE-PILOT-MANUAL-SNAPSHOT-PROFILE.draft.json`
   (author `maxGapSeconds` and the optional values).
2. An **eligible independent reviewer** (not the author; not AI) reviews and attests.
3. The owner establishes the version, and an owner-authorized change pins its canonical hash in
   `packages/domain/eie/pilot/pinned-profiles.ts`. Until then no pilot window can open.

## 6. Local pilot run
Environment (local host only; never a Vercel deployment):
```
TA14_EIE_PILOT_ENABLED=true
TA14_EIE_PILOT_PROJECT_REFS=<pilot project ref>
NEXT_PUBLIC_SUPABASE_URL=https://<pilot project ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<pilot publishable key>
SUPABASE_SERVICE_ROLE_KEY=<pilot service role key>
GOOGLE_APPLICATION_CREDENTIALS=<pilot service identity credentials>
TA14_EIE_PILOT_KEY_ID=TA14-EIE-PILOT-REC-0001
TA14_EIE_PILOT_KMS_KEY_VERSION=<cryptoKeyVersion resource name>
TA14_EIE_PILOT_TSA_URL=<https TSA endpoint>
TA14_EIE_PILOT_TSA_TRUST_ANCHORS_FILE=<path to pinned PEM>
```
`npm run build && npm run start`, then open `http://localhost:3000/eie/pilot`. Step 0 must report no readiness findings.

Operator sequence (each call is attributed to the signed-in account; time is server time):
1. Asset: register asset and components; upload nameplate photos; transcriber A transcribes MANUFACTURER and
   MODEL exactly as printed; **a different person B** verifies each transcription against the photo.
2. Instruments: register each instrument; upload its calibration certificate (DOCUMENTED, not VERIFIED).
3. Open an evidence window (pinned profile). Enter readings with exact C1-R7 unit codes (`F`, `PCT_RH`, `CFM`,
   `IN_WC`); static pressure signed relative to ambient. **One reading per channel** (C1-R7 takes point values;
   a series fails closed). If an instrument cannot produce the governed unit, HOLD — never convert.
4. Seal the window (the seal is then witnessed). Open the preserving window with it as predecessor.
5. Gate A: submit the declared input (equipment strings exactly equal to the verified nameplate) with the
   evidence window id. Expect an attributable HOLD (`OEM_REFERENCE_NOT_VERIFIED`: no OEM record is established).
6. Export, then verify offline:
   `TA14_EIE_EXPORT_FILE=export.json TA14_EIE_TSA_TRUST_ANCHORS_FILE=<pem> npm run eie:verify-export`

## Tier 1 success = all of
Production-mode windows under the pinned profile and pilot key; MANUAL_INSTRUMENT observations only; INTACT
seals verifying under the Key Record; witness chain verifying; two-person-verified identity matching the
declared equipment; a preserved receipt whose every measurement traces offline to a sealed, witnessed
observation; a non-ALLOW, attributable determination with `gate_b_authorized: false`; declared elements left
declared. An ALLOW in Tier 1 is a defect to investigate.
