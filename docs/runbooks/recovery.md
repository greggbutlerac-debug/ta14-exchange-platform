# Recovery Runbook

1. Declare incident severity and preserve logs.
2. Isolate affected credentials and services.
3. Restore database backup into an isolated environment.
4. Restore essential object records and compare hashes.
5. Rebuild registry projection from append-only events.
6. Verify RID continuity, signed receipt references, and payment entitlements.
7. Record restoration time, data loss window, checksum results, and unresolved gaps.
8. Approve production recovery or remain in read-only mode.

No identifier may be silently reassigned during recovery.
