-- TA-14 Governance Life-History Append Bridge
-- Establishes one controlled database seam for appending progression events.
-- Existing event rows remain append-oriented and are never rewritten by this function.

begin;

create or replace function public.ta14_append_governance_life_history_event(
  p_registry_identifier text,
  p_event_key text,
  p_event_type text,
  p_event_date timestamptz,
  p_title text,
  p_summary text default null,
  p_governance_version text default null,
  p_artifact_identifier text default null,
  p_demonstration_identifier text default null,
  p_related_record_href text default null,
  p_evidence_state text default null,
  p_publication_state text default 'published',
  p_metadata jsonb default '{}'::jsonb
)
returns public.ta14_governance_life_history_events
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sequence integer;
  v_existing public.ta14_governance_life_history_events;
  v_inserted public.ta14_governance_life_history_events;
begin
  if nullif(trim(p_registry_identifier), '') is null then
    raise exception 'registry_identifier is required';
  end if;

  if nullif(trim(p_event_key), '') is null then
    raise exception 'event_key is required';
  end if;

  -- Idempotency: a retry with the same event key returns the preserved event.
  select *
  into v_existing
  from public.ta14_governance_life_history_events
  where event_key = p_event_key;

  if found then
    if v_existing.registry_identifier <> p_registry_identifier then
      raise exception 'event_key % already belongs to registry %', p_event_key, v_existing.registry_identifier;
    end if;
    return v_existing;
  end if;

  -- Serialize sequence allocation per governance identity.
  perform pg_advisory_xact_lock(hashtext(p_registry_identifier));

  select coalesce(max(sequence_number), 0) + 10
  into v_sequence
  from public.ta14_governance_life_history_events
  where registry_identifier = p_registry_identifier;

  insert into public.ta14_governance_life_history_events (
    registry_identifier,
    event_key,
    event_type,
    event_date,
    title,
    summary,
    governance_version,
    artifact_identifier,
    demonstration_identifier,
    related_record_href,
    evidence_state,
    publication_state,
    sequence_number,
    metadata
  )
  values (
    trim(p_registry_identifier),
    trim(p_event_key),
    p_event_type,
    p_event_date,
    trim(p_title),
    p_summary,
    p_governance_version,
    p_artifact_identifier,
    p_demonstration_identifier,
    p_related_record_href,
    p_evidence_state,
    p_publication_state,
    v_sequence,
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning * into v_inserted;

  return v_inserted;
end;
$$;

revoke all on function public.ta14_append_governance_life_history_event(
  text,text,text,timestamptz,text,text,text,text,text,text,text,text,jsonb
) from public, anon, authenticated;

grant execute on function public.ta14_append_governance_life_history_event(
  text,text,text,timestamptz,text,text,text,text,text,text,text,text,jsonb
) to service_role;

comment on function public.ta14_append_governance_life_history_event(
  text,text,text,timestamptz,text,text,text,text,text,text,text,text,jsonb
) is 'Controlled idempotent append seam for TA-14 governance life-history progression events. Service-role only.';

commit;
