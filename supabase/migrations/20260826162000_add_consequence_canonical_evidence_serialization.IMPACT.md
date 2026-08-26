# Object Impact — 20260826162000_add_consequence_canonical_evidence_serialization.sql

Status: COMMITTED / NOT YET EXECUTED IN SUPABASE

## Freeze-worthy boundary
This migration establishes TA-14 Canonical Evidence Serialization v1 (TA14-CES-v1). It defines the exact database-side byte representation used to recompute selected Consequence Examination SHA-256 digests.

Canonical rule:
1. Input must be PostgreSQL `jsonb`.
2. PostgreSQL's normalized `jsonb::text` representation is the canonical textual representation.
3. That text is encoded as UTF-8 bytes.
4. SHA-256 is computed over those exact bytes.
5. Digest output is lowercase hexadecimal.

This rule is intentionally versioned. A future canonicalization rule must use a new version/function name rather than silently changing v1.

## Extension
### pgcrypto
`CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions`.
Required only for database-side SHA-256 digest computation. If already installed, no extension change occurs.

## Functions created/replaced
### public.consequence_canonical_json_v1(jsonb) -> text
Returns TA14-CES-v1 canonical text.

### public.consequence_sha256_v1(jsonb) -> text
Computes lowercase SHA-256 hex over TA14-CES-v1 UTF-8 bytes.

### public.consequence_verify_payload_hash_v1(jsonb,text) -> boolean
Recomputes and compares a payload digest.

### public.consequence_verify_integrity_v2(text) -> jsonb
Builds on the existing structural verifier and additionally recomputes:
- S0-S7 event payload SHA-256 values;
- finding_body SHA-256;
- seal_manifest SHA-256;
- receipt_payload SHA-256.
Returns explicit payload-hash mismatch failure codes.

## Deliberate non-claim / remaining boundary
This migration does NOT recompute `consequence_examination_runs.run_sha256`. A canonical aggregate run-manifest composition (which fields, ordering, timestamps, Registry bindings, Technical Freeze digest, and S0-S7 digests constitute the run hash) has not yet been frozen. That must be separately specified rather than guessed.

## Permissions
All four functions revoke EXECUTE from PUBLIC, anon, authenticated and grant EXECUTE only to service_role.

## Existing objects read but NOT structurally modified
- consequence_examination_events
- consequence_examination_findings
- consequence_examination_seals
- consequence_examination_receipts
- existing consequence_verify_integrity(text)

## Objects structurally modified
None, other than ensuring pgcrypto exists.

## Registry boundary
No Registry table, row, identifier, version, submission step, readiness rule, review rule, or finalization function is modified.
