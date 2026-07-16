# MVP Acceptance Matrix

| Requirement | Acceptance condition | Preserved evidence |
|---|---|---|
| TA14-ACC-001 Organization creation | Verified user creates one organization and receives unique non-reassigned TA14-ORG | DB row, audit event, tenant test |
| TA14-RTE-001 Route versioning | Route saves, reloads, versions, and exports without field loss | JSON validation and version diff |
| TA14-DEC-001 Deterministic HOLD | Missing current dual authority returns the same HOLD and reason on repeated runs | Signed receipts with same requirement/policy version |
| TA14-COR-001 Free correction | User adds missing proof and reruns without checkout | Before/after immutable route versions |
| TA14-AER-001 Export parity | AER JSON and PDF carry matching RID, version, manifest hash, state, and history | Automated parity test |
| TA14-PAY-001 One entitlement | One confirmed payment activates exactly one Durable Route Record | Idempotent webhook test and registry event |
| TA14-REG-001 Lookup | Lookup resolves correct route version, status, boundary, limitations, and signature metadata | Browser/API test |
| TA14-REC-001 Recovery | Essential data and object hashes restore within target | Restore log and checksum report |
| TA14-CLM-001 Claim protection | No self-declared route can render VERIFIED status | Authorization and UI tests |
| TA14-MTR-001 Meter separation | Free, purchased, protected-rerun, and subscription executions use identical requirement logic | Cross-entitlement decision parity test |
