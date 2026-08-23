# TA-14 Execution Artifact Integrity Parity Audit

Date: 2026-08-23
Scope: public execution artifact registry and preserved execution-artifact surfaces

## Audit rule

Artifact identity, registry identity, governance identity, route identity, determination, record hash, package hash, receipt hash, publication state, and database source digest are separate fields. No identifier or digest is normalized merely because another field has a different value.

## Verified corpus state

- Public TA-14 execution corpus: TA14-EA-000001 through TA14-EA-000040.
- Second corpus database records: TA14-EA-000013 through TA14-EA-000024 / TA14-EAR-000025 through TA14-EAR-000036.
- Evidence Hardening Corpus database records: TA14-EA-000025 through TA14-EA-000040 / TA14-EAR-000037 through TA14-EAR-000052.
- Evidence Hardening Corpus governance linkage in the governed-artifact database: TA-14-AIGR-000007.
- Public founding architecture bridge currently identifies the founding public architecture record as TA-14-AIGR-0001. These identifiers are not silently merged by this audit.
- All 40 TA-14 artifact public routes are now included in the primary sitemap.

## Integrity condition discovered

TA14-EA-000003 and TA14-EA-000006 currently expose the same values for all three artifact integrity constants:

- RECORD_HASH: `sha256:9c31298e31c2c90e30cf8c3ba61857f59e00486d5bfde98de2bedca4194d1aa4`
- PACKAGE_HASH: `sha256:4e6b1f7cc6a08120c4fe9f53f286cf84df9aa43a84d32497e1f78128c7ee32bd`
- RECEIPT_HASH: `sha256:e8c4d1abf93d6ad0c63a5a46bd791f072632a5e61c901c31aec5592047f23156`

The artifacts describe materially different events and routes. The collision therefore requires source-package reconciliation before either artifact's integrity values should be changed. This audit does **not** manufacture replacement hashes.

## Governed treatment

1. Preserve the existing values and chronology.
2. Treat the collision as an unresolved integrity correspondence condition, not as proof of falsity.
3. Locate the canonical source/package/receipt objects for EA-000003 and EA-000006.
4. Recompute or recover artifact-specific digests only from those preserved objects.
5. Update the public artifact page, registry directory, and verification surface together after correspondence is established.
6. Record any correction without erasing the prior published state.

## Evidence Hardening hash semantics

The governed-artifact database `source_sha256` values for EA-000025 through EA-000040 are source-row digests created at registration. The public TypeScript `rootHash` field is a separate public artifact integrity field. This audit does not equate those two digest classes or overwrite one with the other merely to make the strings match.

## Status

PARITY AUDIT OPEN — one founding-corpus integrity collision requires canonical-source reconciliation. No fabricated correction authorized.
