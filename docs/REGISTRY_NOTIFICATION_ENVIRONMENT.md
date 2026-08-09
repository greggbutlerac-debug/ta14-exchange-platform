[REGISTRY_NOTIFICATION_ENVIRONMENT_v2.md](https://github.com/user-attachments/files/30875443/REGISTRY_NOTIFICATION_ENVIRONMENT_v2.md)
# TA-14 Registry Notification Environment

Add the following environment variables to the production deployment.

## Required

```text
CRON_SECRET=<generate-a-long-random-secret>
RESEND_API_KEY=<your-resend-api-key>
TA14_REGISTRY_REVIEWER_EMAILS=<comma-separated-admin-email-addresses>
SUPABASE_SERVICE_ROLE_KEY=<existing-supabase-service-role-key>
NEXT_PUBLIC_SUPABASE_URL=<existing-supabase-project-url>
```

## Recommended

```text
TA14_REGISTRY_NOTIFICATION_FROM=TA-14 Registry <registry@ta14authority.org>
TA14_PUBLIC_APP_URL=https://ta14authority.org
TA14_REGISTRY_NOTIFICATION_EMAIL_CUTOFF_AT=<activation-timestamp>
```

`TA14_REGISTRY_NOTIFICATION_EMAIL_CUTOFF_AT` should be set to the UTC ISO-8601
timestamp representing the moment external Registry email notification is
activated in production.

Example format only:

```text
2026-08-09T15:00:00Z
```

Do not copy that example blindly. Use the actual activation timestamp.

Notifications with `occurred_at` earlier than the cutoff remain preserved and
visible in the Registry Administration Inbox, but the scheduled email delivery
route will not send them retroactively.

## Optional manual-delivery secret

The delivery endpoint also supports a separate TA-14-specific secret for
authorized manual invocation:

```text
TA14_REGISTRY_NOTIFICATION_CRON_SECRET=<generate-a-different-long-random-secret>
```

Do not commit real secret values to GitHub.

## Vercel

Add each variable in:

Project Settings -> Environment Variables

Apply the required variables to Production. Apply them to Preview only if
Registry notification testing is intentionally enabled in Preview.

After adding or changing environment variables, redeploy the application so
the server runtime receives the new values.

## Activation order

Use this order when enabling production email notification:

1. Confirm the Registry notification database trigger is active.
2. Confirm the delivery-audit migration is applied.
3. Confirm the Registry Inbox shows the historical notifications.
4. Verify the Resend sending domain or approved sender.
5. Add `RESEND_API_KEY`.
6. Add `TA14_REGISTRY_REVIEWER_EMAILS`.
7. Add `CRON_SECRET`.
8. Set `TA14_REGISTRY_NOTIFICATION_EMAIL_CUTOFF_AT` to the actual activation
   moment in UTC.
9. Redeploy production.
10. Confirm the delivery-health surface reports `idle` or `healthy`.
11. Complete a controlled new registration and verify one email delivery.

Setting the cutoff before the first production cron execution prevents the
historical backfill from becoming a batch of retroactive email alerts.

## Resend sender domain

Before using:

```text
TA14_REGISTRY_NOTIFICATION_FROM=TA-14 Registry <registry@ta14authority.org>
```

verify `ta14authority.org` as a sending domain with Resend.

If the domain is not yet verified, use a Resend-approved sender during testing
and switch to the institutional Registry sender after verification.

## Delivery behavior

The Vercel cron configuration calls:

```text
/api/ai-governance/registry/admin-notifications/deliver
```

every five minutes.

Vercel sends `CRON_SECRET` as a Bearer token. The delivery route accepts that
secret and also accepts `TA14_REGISTRY_NOTIFICATION_CRON_SECRET` for protected
manual invocation.

The route reads recipients from:

```text
TA14_REGISTRY_REVIEWER_EMAILS
```

Every configured reviewer receives the administrative registration email.

Successful delivery is deduplicated by:

```text
notification_id + channel + recipient
```

Failed attempts remain preserved in the delivery audit table and can be
retried by a later cron execution.

## Historical notification behavior

The database Inbox and email delivery channel intentionally have different
retention behavior.

The Inbox preserves all authoritative awareness events, including the initial
historical backfill.

The email channel can begin from a later activation boundary using:

```text
TA14_REGISTRY_NOTIFICATION_EMAIL_CUTOFF_AT
```

This means:

```text
historical registration
  -> remains in Registry Inbox
  -> no retroactive email after cutoff activation

new registration after cutoff
  -> Registry Inbox notification
  -> scheduled email delivery
  -> delivery audit record
```

Removing the cutoff later would make older undelivered registration
notifications eligible for delivery again. Keep the production cutoff configured
unless there is an intentional decision to send historical notices.

## Governance boundary

External notification delivery is an administrative awareness mechanism.

It does not:

- register a governance;
- approve a governance;
- change a Registry finding;
- certify or endorse a participant;
- establish technical validation;
- establish legal or regulatory approval; or
- replace the authoritative Registry record.

The authoritative registration event remains the database transition recorded
by the TA-14 AI Governance Exchange.
