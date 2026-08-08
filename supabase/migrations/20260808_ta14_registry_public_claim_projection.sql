-- TA-14 AI Governance Registry
-- Public claim-boundary projection repair
-- Date: 2026-08-08
--
-- Purpose:
--   1. Preserve registered claims, explicit non-claims, known limitations,
--      and regulatory/framework scope in the publication-safe Registry projection.
--   2. Backfill already-finalized public Registry records from their immutable
--      source submissions without requiring registrants to resubmit or rewrite records.
--   3. Keep future public projections synchronized at finalization time through
--      source_record_id.
--   4. Extend the permanent public-record RPC so the existing public record page
--      can faithfully render these preserved fields.
--
-- Boundary:
--   This migration changes the public projection only. It does not modify the
--   governed Registry submission, registration identifier, evidence package,
--   review decision, or chronology. Registration remains distinct from
--   certification, endorsement, legal validity, technical efficacy, or fitness.

begin;

alter table public.ta14_registry_public_records
  add column if not exists formal_claims text,
  add column if not exists explicit_non_claims text,
  add column if not exists known_limitations text,
  add column if not exists regulatory_scope text;

comment on column public.ta14_registry_public_records.formal_claims is
  'Publication-safe projection of the formal claims preserved in the governed source registration.';

comment on column public.ta14_registry_public_records.explicit_non_claims is
  'Publication-safe projection of the explicit non-claims preserved in the governed source registration.';

comment on column public.ta14_registry_public_records.known_limitations is
  'Publication-safe projection of known limitations preserved in the governed source registration.';

comment on column public.ta14_registry_public_records.regulatory_scope is
  'Publication-safe projection of the separately declared regulatory or framework scope preserved in the governed source registration.';

-- Backfill every existing public projection from its governed source record.
-- The source submission remains authoritative; this operation does not infer,
-- summarize, paraphrase, or rewrite registrant language.
update public.ta14_registry_public_records as public_record
set
  formal_claims = source_record.formal_claims,
  explicit_non_claims = source_record.explicit_non_claims,
  known_limitations = source_record.known_limitations,
  regulatory_scope = source_record.regulatory_scope
from public.ai_governance_registry_submissions as source_record
where public_record.source_record_id = source_record.id
  and (
    public_record.formal_claims is distinct from source_record.formal_claims
    or public_record.explicit_non_claims is distinct from source_record.explicit_non_claims
    or public_record.known_limitations is distinct from source_record.known_limitations
    or public_record.regulatory_scope is distinct from source_record.regulatory_scope
  );

-- Future-proof the projection without rewriting the existing finalization RPC.
-- Whenever a public projection is inserted or its source_record_id changes,
-- copy the exact governed claim-boundary fields from the source submission.
create or replace function public.ta14_registry_apply_public_claim_projection()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  source_record public.ai_governance_registry_submissions%rowtype;
begin
  if new.source_record_id is null then
    return new;
  end if;

  select *
  into source_record
  from public.ai_governance_registry_submissions
  where id = new.source_record_id;

  if not found then
    raise exception using
      errcode = '23503',
      message = 'Public Registry projection references a source registration that does not exist.';
  end if;

  new.formal_claims := source_record.formal_claims;
  new.explicit_non_claims := source_record.explicit_non_claims;
  new.known_limitations := source_record.known_limitations;
  new.regulatory_scope := source_record.regulatory_scope;

  return new;
end;
$$;

drop trigger if exists ta14_registry_public_claim_projection
  on public.ta14_registry_public_records;

create trigger ta14_registry_public_claim_projection
before insert or update of source_record_id
on public.ta14_registry_public_records
for each row
execute function public.ta14_registry_apply_public_claim_projection();

-- PostgreSQL does not allow CREATE OR REPLACE to change a RETURNS TABLE shape,
-- so the public detail RPC is dropped and recreated with the additional fields.
drop function if exists public.ta14_registry_public_record_v1(text);

create function public.ta14_registry_public_record_v1(
  requested_registry_identifier text
)
returns table (
  id uuid,
  registry_identifier text,
  governance_name text,
  short_name text,
  version text,
  category text,
  steward text,
  claimed_establishment_date date,
  registered_at timestamptz,
  status text,
  summary text,
  formal_claims text,
  explicit_non_claims text,
  known_limitations text,
  domains text[],
  regulatory_scope text,
  evidence_count integer,
  dispute_count integer,
  supersedes_registry_identifier text,
  record_digest_sha256 text,
  published_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    record.id,
    record.registry_identifier,
    record.governance_name,
    record.short_name,
    record.version,
    record.category,
    record.steward,
    record.claimed_establishment_date,
    record.registered_at,
    record.status,
    record.summary,
    record.formal_claims,
    record.explicit_non_claims,
    record.known_limitations,
    record.domains,
    record.regulatory_scope,
    record.evidence_count,
    record.dispute_count,
    record.supersedes_registry_identifier,
    record.record_digest_sha256,
    record.published_at
  from public.ta14_registry_public_records as record
  where record.registry_identifier = requested_registry_identifier
    and record.is_published = true
    and record.visibility = 'public'
    and record.status in (
      'Registered',
      'Disputed',
      'Superseded',
      'Withdrawn',
      'Archived'
    )
  limit 1;
$$;

comment on function public.ta14_registry_public_record_v1(text) is
  'Returns one publication-safe finalized TA-14 AI Governance Registry record, including the exact registered claim boundary, by permanent Registry identifier.';

revoke all on function public.ta14_registry_public_record_v1(text) from public;
grant execute on function public.ta14_registry_public_record_v1(text)
  to anon, authenticated;

commit;
