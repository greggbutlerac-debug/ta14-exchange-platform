[REGISTRY_NOTIFICATION_ENVIRONMENT.md](https://github.com/user-attachments/files/30874827/REGISTRY_NOTIFICATION_ENVIRONMENT.md)
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
```

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
