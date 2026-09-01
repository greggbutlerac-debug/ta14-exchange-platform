alter table public.ta14_registry_legacy_registration_reconstructions
  add column if not exists promoted_at timestamptz;

create or replace function public.ta14_guard_legacy_registration_reconstruction_provenance()
returns trigger language plpgsql as $$
begin
  if coalesce((new.provenance_boundary->>'originalSubstantivePayloadRecovered')::boolean, true) <> false then
    raise exception 'legacy reconstruction cannot represent original substantive payload as recovered';
  end if;
  if coalesce((new.provenance_boundary->>'reconstructedPayloadIsOriginalServerRecord')::boolean, true) <> false then
    raise exception 'legacy reconstruction cannot represent reconstructed payload as original server record';
  end if;
  if new.status = 'PROMOTED_TO_DRAFT' and (
    old.status is distinct from 'PARTICIPANT_CONFIRMED'
    or new.participant_confirmed_at is null
    or new.promoted_submission_id is null
    or new.promoted_at is null
  ) then
    raise exception 'legacy reconstruction promotion requires participant confirmation and a promoted Registry draft';
  end if;
  if old.status = 'PROMOTED_TO_DRAFT' and (
    new.promoted_submission_id is distinct from old.promoted_submission_id
    or new.participant_confirmed_at is distinct from old.participant_confirmed_at
    or new.original_attempt_at is distinct from old.original_attempt_at
    or new.reconstructed_payload is distinct from old.reconstructed_payload
  ) then
    raise exception 'promoted legacy reconstruction lineage is immutable';
  end if;
  new.updated_at = now();
  return new;
end;
$$;
