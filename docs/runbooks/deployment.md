# Deployment Runbook

1. Run typecheck and acceptance tests.
2. Build immutable release artifact from a tagged commit.
3. Apply database migration to staging snapshot.
4. Run tenant-isolation, payment-idempotency, state-precedence, and registry tests.
5. Verify backup freshness and restoration rehearsal status.
6. Deploy with monitored rollout.
7. Validate health, login, route test, AER export, checkout sandbox, and registry lookup.
8. Record release ID, commit, schema version, approver, and health evidence.

## Rollback
Rollback must not delete newly created append-only events. Deploy the previous compatible application release and use compensating migrations/events when necessary.

## Emergency read-only mode
Preserve registry lookup and authorized exports while blocking unsafe writes, testing, checkout, and status mutation.
