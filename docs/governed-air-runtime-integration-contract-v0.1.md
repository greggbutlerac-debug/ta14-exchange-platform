# Governed Air read-only runtime integration contract (draft v0.1)

Status: DESIGN ONLY. SE-001 OPEN. Production HOLD. No runtime connection, merge, or authorization change is implemented by this document.

## Sources and branch isolation
- Examination Workspace: `greggbutlerac-debug/ta14-exchange-platform`, branch `governed-air-foundation`.
- Runtime: `greggbutlerac-debug/ta14-admissible-execution-gate`, branch `dev/governance-engine-v0.1`, draft PR #6, observed head `0a597f92ef74b0f644b23ba220041f9d90d81f4f`.
- Runtime projection source: `ta14/reference_artifact_projection.py` and `ta14/production_authorization_boundary.py`.
- Workspace endpoint: `POST /api/governed-air/examine` is currently a DEVELOPMENT_SIMULATION endpoint with no configured trust keys. It is not the runtime API.

## Mandatory trust separation
1. Never interpret nested reference `PROCEED`, `ALLOW`, `EXECUTED`, `execution_authorized`, valid signatures, or replay verification as real-world execution authority.
2. Workspace authorization state is computed from a **server-owned**, fail-closed production boundary. Never accept a client-supplied production authorization envelope as authoritative.
3. For this development integration, the effective boundary MUST always be:
   - `boundary: REFERENCE_ONLY_PRODUCTION_HOLD`
   - `effective_disposition: HOLD`
   - `production_execution_authorized: false`
   - `production_commit_authorized: false`
4. Preserve raw reference artifacts only as labeled reference claims. Prefer the runtime's `reference_artifact_presentation` for customer-facing display. Never promote the projection to an execution credential.
5. On missing, malformed, conflicting, stale, or unavailable runtime response, retain HOLD and show a bounded diagnostic. Do not fall back to authorization.
6. No physical controls, payment, dispatch, or operational credentials may be connected.

## Proposed server-owned display DTO (not yet implemented)
```json
{
  "schema_version": "governed-air-read-only-runtime-v0.1",
  "mode": "REFERENCE_ONLY",
  "reference_result": {"decision": "REFERENCE_ONLY"},
  "reference_artifact_presentation": null,
  "production_authorization": {
    "boundary": "REFERENCE_ONLY_PRODUCTION_HOLD",
    "effective_disposition": "HOLD",
    "production_execution_authorized": false,
    "production_commit_authorized": false
  }
}
```

## Integration sequence
1. Freeze both baselines and obtain verified test results. Confirm PR #6 remains draft/unmerged.
2. Add a server-side adapter with an explicit allowlist and strict runtime response validation; reject unexpected authorization fields and conflicting boundary values.
3. Add synthetic fixture tests for reference PROCEED/EXECUTED with production HOLD; missing fields; malformed payload; timeouts; revocation; replay; and altered authority claims.
4. Display reference trace and non-authorizing receipt/snapshot projection in the Workspace. Keep the current classroom examination and report integrity behavior.
5. Test both systems together in a separate integration branch and require independent SE-001 security review before any production discussion.

This document does not establish issuer trust, independent standing, admissibility, or authorization.
