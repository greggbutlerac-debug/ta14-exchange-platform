[REGISTRY_NOTIFICATION_DEPLOYMENT_CHECKLIST.md](https://github.com/user-attachments/files/30874846/REGISTRY_NOTIFICATION_DEPLOYMENT_CHECKLIST.md)
# TA-14 Registry Notification Deployment Checklist

Use this checklist after the Registry Administration Inbox, notification trigger,
delivery audit migration, delivery route, and Vercel cron configuration have
been committed.

## 1. Supabase database

Confirm these tables exist:

```text
public.ta14_registry_admin_notifications
public.ta14_registry_admin_notification_deliveries
```

Confirm the registration trigger exists on:

```text
public.ai_governance_registry_submissions
```

Confirm the seven historical registration notifications were backfilled.

Expected initial state from the August 9, 2026 deployment:

```text
unread = 7
```

Do not treat this historical count as a permanent expected value. It will change
as notifications are acknowledged and new governances register.

## 2. Vercel environment variables

Production must contain:

```text
CRON_SECRET
RESEND_API_KEY
TA14_REGISTRY_REVIEWER_EMAILS
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SUPABASE_URL
```

Recommended:

```text
TA14_REGISTRY_NOTIFICATION_FROM
TA14_PUBLIC_APP_URL
```

Optional:

```text
TA14_REGISTRY_NOTIFICATION_CRON_SECRET
```

Never commit secret values.

## 3. Reviewer email configuration

`TA14_REGISTRY_REVIEWER_EMAILS` is comma-separated.

Example format only:

```text
reviewer@example.com,second-reviewer@example.com
```

The same reviewer list protects the Registry administration UI and determines
who receives registration notification email.

## 4. Resend

Verify the sender domain before using an institutional sender such as:

```text
TA-14 Registry <registry@ta14authority.org>
```

Confirm the sender is accepted by Resend before enabling production delivery.

## 5. Redeploy

After environment variables are saved, redeploy the production application.

Environment-variable changes are not considered active until the production
runtime receives them.

## 6. Confirm cron deployment

The repository-root `vercel.json` should contain the Registry delivery endpoint.

Expected route:

```text
/api/ai-governance/registry/admin-notifications/deliver
```

Expected cadence:

```text
*/5 * * * *
```

This means the delivery job is eligible to run every five minutes.

## 7. Verify Mission Control

Sign in using an email included in:

```text
TA14_REGISTRY_REVIEWER_EMAILS
```

Open:

```text
/workspace/ai-governance
```

Confirm the Registry Mission Control surface is visible.

Then open:

```text
/workspace/ai-governance/registry/inbox
```

Confirm the existing unread notifications appear.

## 8. Verify non-reviewer boundary

Sign in with a normal participant account that is not included in
`TA14_REGISTRY_REVIEWER_EMAILS`.

Confirm:

- the administrative Mission Control surface is not exposed;
- the protected notification API does not return Registry administration data;
- ordinary governance registration functionality remains available according to
  its existing authorization rules.

## 9. Controlled email test

Before waiting for a new real registration, invoke the delivery endpoint through
the configured cron mechanism or an authorized request using the configured
secret.

The first successful delivery run may send emails for existing unread/backfilled
registration notifications because those notifications have no prior successful
delivery record.

If you do not want historical registrations emailed, do not perform the first
production delivery until those historical notifications have been intentionally
handled or a separate delivery baseline has been established.

## 10. Delivery audit verification

After a delivery attempt, run in Supabase SQL Editor:

```sql
select
  delivery_state,
  count(*) as total
from public.ta14_registry_admin_notification_deliveries
group by delivery_state
order by delivery_state;
```

Then inspect recent attempts:

```sql
select
  d.delivery_state,
  d.recipient,
  d.provider,
  d.provider_message_id,
  d.failure_reason,
  d.attempted_at,
  d.delivered_at,
  n.registry_identifier,
  n.governance_name
from public.ta14_registry_admin_notification_deliveries d
join public.ta14_registry_admin_notifications n
  on n.id = d.notification_id
order by d.attempted_at desc
limit 50;
```

## 11. Test future automatic registration

Use a controlled test governance only if appropriate for the Registry environment.

The expected lifecycle is:

```text
submission
  ->
readiness/completeness checks
  ->
automatic registration
  ->
permanent Registry identifier
  ->
Registry admin notification
  ->
Mission Control unread count
  ->
scheduled email delivery
  ->
delivery audit receipt
```

No manual registration step should be introduced merely to create the
notification.

## 12. Confirm deduplication

Allow the cron route to execute again after a successful email delivery.

The same notification should not generate a second successful email to the same
recipient.

Successful delivery uniqueness is:

```text
notification_id + channel + recipient
```

Failed attempts may remain in the audit history and may be retried.

## 13. Confirm acknowledgement boundary

Acknowledge a Registry Inbox notification.

Confirm:

- the notification state changes from `unread` to `acknowledged`;
- the underlying governance remains `registered`;
- its Registry identifier does not change;
- the public registration record is not modified merely because the
  administrative notification was acknowledged.

## 14. Confirm resolution boundary

Resolve an administrative notification.

Confirm resolution changes only the administrative awareness record.

It must not be interpreted as:

- approval;
- certification;
- endorsement;
- validation;
- ownership adjudication;
- legal approval;
- regulatory approval; or
- modification of the underlying registration.

## 15. AI Cornerstone check

At the time this notification system was built, the previously inspected
Registry submission data did not contain AI Cornerstone Associates LLC.

After Michael Shuler completes registration, confirm that the system produces:

```text
governance registration
+
TA-14 Registry identifier
+
unread Registry administration notification
+
email delivery
+
delivery audit record
```

The resulting identifier can then be used in the separately governed
FD-2026-0004 demonstration record as appropriate.

## 16. Operational acceptance

Treat the notification system as operational only after all of the following are
confirmed:

- automatic governance registration still works;
- registration creates exactly one authoritative admin notification;
- reviewer Mission Control shows the event;
- Registry Inbox opens the event;
- acknowledgement works;
- resolution works;
- email delivery succeeds;
- successful email delivery is deduplicated;
- delivery audit history is preserved;
- non-reviewers cannot access administrative notification data;
- notification actions do not mutate the underlying governance registration.

## Institutional rule

The TA-14 Exchange should not require the administrator to discover completed
registrations by manually querying Supabase.

Automatic registration remains automatic.

Administrative awareness becomes automatic too.
