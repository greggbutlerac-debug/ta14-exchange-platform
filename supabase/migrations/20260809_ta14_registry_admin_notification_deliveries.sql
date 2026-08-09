begin;

create extension if not exists pgcrypto;

-- ============================================================================
-- TA-14 REGISTRY ADMIN NOTIFICATION DELIVERY AUDIT
--
-- Purpose:
-- Preserve an append-oriented delivery record for administrative notifications
-- sent outside the Exchange UI (initially email).
--
-- This table does not alter:
--   * governance registration state;
--   * Registry findings;
--   * review status;
--   * admissibility determinations; or
--   * public Registry records.
--
-- It records only the administrative delivery attempt and result.
-- ============================================================================

create table if not exists public.ta14_registry_admin_notification_deliveries (
  id uuid primary key default gen_random_uuid(),

  notification_id uuid not null
    references public.ta14_registry_admin_notifications(id)
    on delete cascade,

  channel text not null,
  provider text not null,
  recipient text not null,

  delivery_state text not null,

  provider_message_id text,
  failure_reason text,

  attempted_at timestamptz not null
    default timezone('utc', now()),

  delivered_at timestamptz,

  created_at timestamptz not null
    default timezone('utc', now()),

  constraint ta14_registry_admin_notification_delivery_channel_check
    check (
      channel in (
        'email',
        'sms',
        'webhook',
        'other'
      )
    ),

  constraint ta14_registry_admin_notification_delivery_state_check
    check (
      delivery_state in (
        'delivered',
        'failed'
      )
    ),

  constraint ta14_registry_admin_notification_delivery_delivered_at_check
    check (
      (
        delivery_state = 'delivered'
        and delivered_at is not null
      )
      or
      (
        delivery_state = 'failed'
        and delivered_at is null
      )
    ),

  constraint ta14_registry_admin_notification_delivery_recipient_check
    check (
      length(btrim(recipient)) > 0
    ),

  constraint ta14_registry_admin_notification_delivery_provider_check
    check (
      length(btrim(provider)) > 0
    )
);

comment on table public.ta14_registry_admin_notification_deliveries is
  'Preserves administrative notification delivery attempts for TA-14 Registry events. Delivery status is separate from governance registration, review, finding, certification, endorsement, validation, or approval.';

comment on column public.ta14_registry_admin_notification_deliveries.notification_id is
  'References the authoritative Registry administration notification that generated this delivery attempt.';

comment on column public.ta14_registry_admin_notification_deliveries.delivery_state is
  'Records whether the external delivery attempt succeeded or failed. It does not alter the underlying notification state.';

comment on column public.ta14_registry_admin_notification_deliveries.provider_message_id is
  'Optional external provider receipt or message identifier returned after successful delivery.';

comment on column public.ta14_registry_admin_notification_deliveries.failure_reason is
  'Provider or application failure detail preserved for retry and operational review.';


-- ============================================================================
-- INDEXES
-- ============================================================================

create index if not exists
  ta14_registry_admin_notification_deliveries_notification_idx
on public.ta14_registry_admin_notification_deliveries (
  notification_id,
  attempted_at desc
);

create index if not exists
  ta14_registry_admin_notification_deliveries_recipient_idx
on public.ta14_registry_admin_notification_deliveries (
  recipient,
  attempted_at desc
);

create index if not exists
  ta14_registry_admin_notification_deliveries_state_idx
on public.ta14_registry_admin_notification_deliveries (
  delivery_state,
  attempted_at desc
);

create index if not exists
  ta14_registry_admin_notification_deliveries_provider_message_idx
on public.ta14_registry_admin_notification_deliveries (
  provider_message_id
)
where provider_message_id is not null;


-- ============================================================================
-- DELIVERY DEDUPLICATION
--
-- One successful delivery per:
--   notification + channel + recipient
--
-- Failed attempts may be preserved repeatedly so the retry history remains
-- visible. Once a successful delivery exists, application logic can safely
-- skip future attempts for that recipient.
-- ============================================================================

create unique index if not exists
  ta14_registry_admin_notification_deliveries_success_unique
on public.ta14_registry_admin_notification_deliveries (
  notification_id,
  channel,
  lower(recipient)
)
where delivery_state = 'delivered';


-- ============================================================================
-- ROW LEVEL SECURITY
--
-- Delivery audit records are administrative infrastructure.
-- Browser roles receive no direct access.
-- Server-side Exchange administration uses the Supabase service role.
-- ============================================================================

alter table public.ta14_registry_admin_notification_deliveries
  enable row level security;

revoke all
  on table public.ta14_registry_admin_notification_deliveries
  from public;

revoke all
  on table public.ta14_registry_admin_notification_deliveries
  from anon;

revoke all
  on table public.ta14_registry_admin_notification_deliveries
  from authenticated;


-- ============================================================================
-- SERVER-SIDE DELIVERY SUMMARY RPC
--
-- This is deliberately not granted to normal browser roles.
-- It provides a compact operational picture for future Mission Control
-- delivery-health surfaces.
-- ============================================================================

create or replace function
  public.ta14_registry_admin_notification_delivery_summary_v1()
returns table (
  delivered_count bigint,
  failed_count bigint,
  unique_notifications_delivered bigint,
  latest_attempt_at timestamptz,
  latest_delivery_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    count(*) filter (
      where delivery_state = 'delivered'
    ) as delivered_count,

    count(*) filter (
      where delivery_state = 'failed'
    ) as failed_count,

    count(
      distinct notification_id
    ) filter (
      where delivery_state = 'delivered'
    ) as unique_notifications_delivered,

    max(attempted_at) as latest_attempt_at,

    max(delivered_at) filter (
      where delivery_state = 'delivered'
    ) as latest_delivery_at

  from public.ta14_registry_admin_notification_deliveries;
$$;

revoke all
  on function
    public.ta14_registry_admin_notification_delivery_summary_v1()
  from public;

revoke all
  on function
    public.ta14_registry_admin_notification_delivery_summary_v1()
  from anon;

revoke all
  on function
    public.ta14_registry_admin_notification_delivery_summary_v1()
  from authenticated;


-- ============================================================================
-- DELIVERY HISTORY RPC
--
-- Provides a bounded server-side retrieval surface for future administration
-- tooling while preserving the table as non-browser-readable.
-- ============================================================================

create or replace function
  public.ta14_registry_admin_notification_delivery_history_v1(
    p_notification_id uuid,
    p_limit integer default 25
  )
returns table (
  id uuid,
  notification_id uuid,
  channel text,
  provider text,
  recipient text,
  delivery_state text,
  provider_message_id text,
  failure_reason text,
  attempted_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    delivery.id,
    delivery.notification_id,
    delivery.channel,
    delivery.provider,
    delivery.recipient,
    delivery.delivery_state,
    delivery.provider_message_id,
    delivery.failure_reason,
    delivery.attempted_at,
    delivery.delivered_at,
    delivery.created_at

  from public.ta14_registry_admin_notification_deliveries delivery

  where
    delivery.notification_id = p_notification_id

  order by
    delivery.attempted_at desc,
    delivery.created_at desc

  limit least(
    greatest(coalesce(p_limit, 25), 1),
    100
  );
$$;

revoke all
  on function
    public.ta14_registry_admin_notification_delivery_history_v1(
      uuid,
      integer
    )
  from public;

revoke all
  on function
    public.ta14_registry_admin_notification_delivery_history_v1(
      uuid,
      integer
    )
  from anon;

revoke all
  on function
    public.ta14_registry_admin_notification_delivery_history_v1(
      uuid,
      integer
    )
  from authenticated;


commit;
