# Threat Model

| Threat | Prevent | Detect | Recover / prove |
|---|---|---|---|
| Cross-tenant access | RLS, scoped paths, authorization middleware | Automated cross-tenant tests, alerts | Revoke, contain, notify, preserve audit evidence |
| Forged payment webhook | Signature validation, secret rotation, idempotency | Rejected-signature and duplicate-event metrics | Replay trusted events and reconcile entitlements |
| Route-history tampering | Append-only events, hashes, restricted admin actions | Hash verification and audit review | Rebuild projection from immutable events |
| False VERIFIED claim | Registry-only protected status | Crawler/misuse reports and badge checks | Suspend claim, preserve history, publish correction |
| Malicious upload | Allowlist, size limits, scan, quarantine | Scanner events and download blocks | Quarantine/delete under policy; notify affected user |
| Signing-key compromise | Managed KMS, limited principals, rotation, dual control | Key-use logs and anomaly alerts | Revoke key, publish rotation, re-sign eligible records |
| Admin misuse | Least privilege, dual approval for critical status changes | Immutable admin audit events | Correct through new event; never erase prior action |
| Bulk spam/fake entities | Verified email, rate limits, bot controls, identity levels | Velocity and reputation monitoring | Suspend abusive accounts; retain registry history |
| Evidence deletion after adverse result | Retention flags and institutional-record separation | Deletion-attempt logs | Preserve required institutional record and document disposition |
